import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import {
  SHOWROOM_CATALOG_V2, SHOWROOM_CATEGORIES, SHOWROOM_DEFAULTS,
  LEGACY_SHOWROOM_ID_ALIASES, GRANDFATHERED_RELEASED_ITEM_IDS, SHOWROOM_V4_ACTIVE_CATEGORIES, resolveShowroomItemIdV2, assertShowroomCatalogV2,
} from '../js/showroom-catalog-v2.js';
import { GRAPH_SKIN_PRICE_BY_RARITY, GRAPH_SKIN_SAFE_AREA } from '../js/showroom-graph-skins.js';
import { TITLES_CATALOG_V2, TITLE_RARITY_COLORS } from '../js/titles-catalog-v2.js';
import { ACHIEVEMENTS } from '../js/achievements.js';
import { ACHIEVEMENT_ITEM_REWARDS_V2, normalizeAchievementTrophyRewardsV2, rewardItemsForAchievementsV2 } from '../js/achievement-item-rewards-v2.js';
import { fitMainPlotBounds } from '../js/chart-render.js';
import {
  ALL_CATALOG_V2, V2_CATEGORIES, normalizeLoadoutV2, getCatalogItemV2,
  COMPANION_LAYOUT_DEFAULTS, COMPANION_LAYOUT_LIMITS, normalizeCompanionLayoutV2,
  ownedItemIdsV2, unownedSelectionV2, persistableLoadoutV2, validateCatalogPurchaseV2,
  renderEmojiBorderV2, getChartDecorationsV2,
  contrastRatioV2, lineContrastAdviceV2,
  renderCompanionV2, renderTrophyV2, renderMarkerV2, renderProfileEmojiV2,
  renderAmbientV2, renderCatalogPreviewV2, profileVisualForUserV2, applyCardV2,
} from '../js/showroom-v2.js';

assert.equal(assertShowroomCatalogV2(),true);
assert.deepEqual(SHOWROOM_V4_ACTIVE_CATEGORIES,['graph_skin','line_style','card_theme','ambient_effect']);
assert.equal(SHOWROOM_CATALOG_V2.length,152);
assert.equal(TITLES_CATALOG_V2.length,30);
assert.equal(ALL_CATALOG_V2.length,182);
assert.deepEqual(SHOWROOM_CATEGORIES,['graph_skin','line_style','card_theme','point_marker','companion','ambient_effect','trophy','profile_emoji','emoji_border']);
assert.deepEqual(V2_CATEGORIES,[...SHOWROOM_CATEGORIES,'title']);
assert.equal(new Set(ALL_CATALOG_V2.map(entry=>entry.id)).size,182);
assert.equal(new Set(SHOWROOM_CATALOG_V2.filter(entry=>entry.asset).map(entry=>entry.asset)).size,84);

for(const category of SHOWROOM_CATEGORIES){
  const entries=SHOWROOM_CATALOG_V2.filter(entry=>entry.category===category);
  const expectedCount={graph_skin:12,line_style:32,card_theme:12,companion:44,ambient_effect:36}[category]??4;
  assert.equal(entries.length,expectedCount,category);
  const per=category==='companion'?1:expectedCount>=12?expectedCount/4:1;
  assert.deepEqual(entries.map(entry=>entry.rarity),category==='companion'
    ? [...Array(4).fill('common'),...Array(10).fill('uncommon'),...Array(10).fill('rare'),...Array(10).fill('epic'),...Array(10).fill('legendary')]
    : expectedCount>=12?['uncommon','rare','epic','legendary'].flatMap(r=>Array(per).fill(r))
    : ['uncommon','rare','epic','legendary']);
}
for(const [category,prefix] of [['profile_emoji','pe_'],['emoji_border','eb_']]){
  const entries=SHOWROOM_CATALOG_V2.filter(entry=>entry.category===category);
  assert.equal(entries.length,4,`${category}: active catalog must reflect the four real assets`);
  const migratedLegacy=Object.entries(LEGACY_SHOWROOM_ID_ALIASES).filter(([legacy,target])=>legacy.startsWith(prefix)&&legacy!==target);
  assert.equal(migratedLegacy.length,30,`${category}: legacy ids are aliases, not additional assets`);
  assert.equal(new Set(migratedLegacy.map(([,target])=>target)).size,4,`${category}: legacy aliases must resolve onto the four active assets`);
  for(const entry of entries)assert.ok((await stat(new URL(`../${entry.asset.replace(/^\.\//,'')}`,import.meta.url))).isFile(),`${entry.id}: missing catalog asset`);
}
for(const entry of SHOWROOM_CATALOG_V2){
  const staged=['line_style','ambient_effect'].includes(entry.category)&&!GRANDFATHERED_RELEASED_ITEM_IDS.includes(entry.id);
  assert.equal(entry.testOnly,staged,entry.id);
  assert.equal(entry.purchasable,entry.category==='trophy'?false:!staged,entry.id);
}
const releasedGraphSkins=SHOWROOM_CATALOG_V2.filter(entry=>entry.category==='graph_skin');
assert.deepEqual(GRAPH_SKIN_PRICE_BY_RARITY,{uncommon:900,rare:1800,epic:3600,legendary:7200});
assert.deepEqual(releasedGraphSkins.map(entry=>entry.price),[900,900,900,1800,1800,1800,3600,3600,3600,7200,7200,7200]);
assert.deepEqual(releasedGraphSkins.map(entry=>entry.name),[
  '무쇠산 작업장','달빛 여관','사막 유랑단','세계수 꿈길','폭풍왕국','붉은철 요새',
  '은빛달 궁정','별벼림 창조소','심해 여왕 궁전','빙관 왕좌','황천 검은 성소','용군단 화염둥지',
]);
for(const entry of releasedGraphSkins){
  assert.equal(entry.testOnly,false,entry.id);assert.equal(entry.purchasable,true,entry.id);assert.equal(entry.persistable,true,entry.id);
  assert.deepEqual(entry.safeArea,GRAPH_SKIN_SAFE_AREA,entry.id);
}
assert.deepEqual(GRANDFATHERED_RELEASED_ITEM_IDS,['ae_dust','ae_firefly','ae_bubble','ae_thunder']);
assert.deepEqual(TITLE_RARITY_COLORS,{common:'#FFFFFF',uncommon:'#1EFF00',rare:'#0070DD',epic:'#A335EE',legendary:'#FF8000'});
for(const entry of ALL_CATALOG_V2)assert.match(entry.id,/^[a-z0-9_]+$/);

assert.ok(Object.keys(LEGACY_SHOWROOM_ID_ALIASES).length>=218);
for(const [legacy,target] of Object.entries(LEGACY_SHOWROOM_ID_ALIASES)){
  assert.ok(getCatalogItemV2(target),`${legacy}:${target}`);
  assert.equal(resolveShowroomItemIdV2(legacy),target);
}
assert.equal(resolveShowroomItemIdV2('fabricated_old_id'),'fabricated_old_id');
assert.equal(getCatalogItemV2('gs_slate_lines').id,'gs_v4_uncommon_01');
assert.equal(getCatalogItemV2('gs_void_lattice').id,'gs_v4_rare_01');
assert.equal(getCatalogItemV2('gs_phoenix_wake').id,'gs_v4_epic_01');
assert.equal(getCatalogItemV2('gs_crown_of_dawn').id,'gs_v4_legendary_01');
assert.equal(getCatalogItemV2('gs_explorer_parchment').id,'gs_v4_uncommon_01','released V3 graph ownership must migrate');
assert.equal(getCatalogItemV2('ct_alpine_dawn').id,'ct4_uncommon_iron_outpost','released V3 card ownership must migrate');
assert.equal(resolveShowroomItemIdV2('ae_bubble'),'ae_bubble','active legacy id must preserve its identity');
assert.equal(resolveShowroomItemIdV2('ae_firefly'),'ae_firefly','active legacy id must not alias to another effect');
assert.equal(resolveShowroomItemIdV2('ae_mist'),'ae_dust','retired legacy id must migrate to an active effect');

const normalized=normalizeLoadoutV2({
  graph_skin:'gs_slate_lines', point_marker:'pm_dawn_relic', title:'legacy title',
  trophy:['tr_wood_medal','tr_crystal_cup','tr_phoenix_relic','tr_dawn_regalia','bad'],
});
assert.equal(normalized.graph_skin,'gs_v4_uncommon_01');
assert.equal(normalized.point_marker,'pm_phoenix_seal');
assert.equal(normalized.title,null);
assert.deepEqual(normalized.trophy,['tr_summit_compass','tr_sea_chalice','tr_giant_horn','tr_cosmic_goblet']);
assert.deepEqual(SHOWROOM_DEFAULTS,{graph_skin:null,line_style:null,card_theme:null,point_marker:null,companion:null,ambient_effect:null,trophy:[],profile_emoji:null,emoji_border:null});
assert.deepEqual(COMPANION_LAYOUT_DEFAULTS,{scale:1,opacity:1,x:90,y:15});
assert.deepEqual(COMPANION_LAYOUT_LIMITS,{scale:{min:.5,max:2},opacity:{min:.2,max:1},x:{min:5,max:95},y:{min:5,max:95}});
assert.deepEqual(normalizeCompanionLayoutV2({scale:99,opacity:-1,x:'bad',y:101}),{scale:2,opacity:.2,x:90,y:95});
assert.deepEqual(normalizeLoadoutV2({}).companionLayout,COMPANION_LAYOUT_DEFAULTS,'old loadouts must receive non-destructive companion defaults');
assert.equal(contrastRatioV2('#ffffff','#000000'),21);
assert.equal(lineContrastAdviceV2('#111827','#070b12').passes,false);
assert.equal(lineContrastAdviceV2('#ffffff','#070b12').passes,true);

const user={purchasedItemsV2:['gs_slate_lines','ae_bubble'],achievementRewardItems:['ct_emerald_lodge'],adminGrantedItems:['title_dawn_watch']};
assert.deepEqual([...ownedItemIdsV2(user)],['gs_v4_uncommon_01','ae_bubble','ct4_uncommon_iron_outpost','title_dawn_watch']);
assert.equal(unownedSelectionV2(user,{...SHOWROOM_DEFAULTS,ambient_effect:'ae_bubble'}).length,0,'purchased ambient effect must remain owned');
assert.equal(getCatalogItemV2('ae_bubble').testOnly,false,'released ambient effect must not be restaged');
assert.equal(getCatalogItemV2('ae_bubble').purchasable,true,'released ambient effect remains purchasable');
assert.equal(persistableLoadoutV2({...SHOWROOM_DEFAULTS,ambient_effect:'ae_bubble'}).ambient_effect,'ae_bubble','owned released ambient effect must remain saveable');
assert.deepEqual([...ownedItemIdsV2({purchasedItemsV2:['ae_mist'],adminGrantedItems:['ae_firefly'],achievementRewardItems:['ae_bubble']})],['ae_dust','ae_bubble','ae_firefly'],'all ownership sources must merge after alias migration');
assert.equal(normalizeLoadoutV2({...SHOWROOM_DEFAULTS,ambient_effect:'ae_mist'}).ambient_effect,'ae_dust','retired loadout id must migrate to the active effect');
assert.deepEqual(unownedSelectionV2(user,{...SHOWROOM_DEFAULTS,graph_skin:'gs_v4_uncommon_01',card_theme:'ct_alpine_dawn',companion:'cp_sleepy_golem'}).map(entry=>entry.id),['cp_sleepy_golem']);
assert.deepEqual(getChartDecorationsV2(SHOWROOM_DEFAULTS),{});
assert.equal(getChartDecorationsV2({point_marker:'pm_phoenix_seal'}).markerAsset,'./assets/showroom-v3/point_marker/pm_phoenix_seal.png');
const transactionSnapshot={coins:4200,purchasedItemsV2:['legacy_owned'],achievementRewardItems:['legacy_reward'],adminGrantedItems:[]};
const transactionBefore=structuredClone(transactionSnapshot);
assert.deepEqual(validateCatalogPurchaseV2(['gs_v4_uncommon_01']).map(entry=>[entry.id,entry.price]),[['gs_v4_uncommon_01',900]]);
assert.throws(()=>validateCatalogPurchaseV2(['tr_summit_compass']),/트로피는 구매할 수 없으며 업적 달성 또는 관리자 지급으로만 획득/);
assert.deepEqual(transactionSnapshot,transactionBefore,'blocked purchase must not mutate coins or ownership');
assert.deepEqual(persistableLoadoutV2({graph_skin:'gs_v4_uncommon_01',companion:'cp_sleepy_golem',trophy:['tr_cosmic_goblet'],companionLayout:{scale:1.35,opacity:.65,x:24,y:81}}),{...SHOWROOM_DEFAULTS,graph_skin:'gs_v4_uncommon_01',companion:'cp_sleepy_golem',trophy:['tr_cosmic_goblet'],title:null,companionLayout:{scale:1.35,opacity:.65,x:24,y:81}});
assert.ok(profileVisualForUserV2({emoji:'🦁'},32).includes('🙂'),'unselected showroom profiles must use the single smiling default instead of legacy emoji remnants');
assert.equal(profileVisualForUserV2({emoji:'🦁'},32).includes('🦁'),false,'legacy user emoji must not leak into common profile surfaces');
assert.ok(profileVisualForUserV2({emoji:'🦁',showroomLoadoutV2:{profile_emoji:'pe_archive_spirit',emoji_border:'eb_forged_iron'}},32).includes('pe_archive_spirit.png'));
assert.ok(profileVisualForUserV2({emoji:'🦁',showroomLoadoutV2:{profile_emoji:'pe_archive_spirit',emoji_border:'eb_forged_iron'}},32).includes('eb_forged_iron.png'));
assert.deepEqual([...ownedItemIdsV2({achievementRewardItems:['tr_cosmic_goblet']})],['tr_cosmic_goblet']);
assert.deepEqual([...ownedItemIdsV2({adminGrantedItems:['tr_giant_horn']})],['tr_giant_horn']);

for(const entry of SHOWROOM_CATALOG_V2.filter(entry=>entry.asset)){
  const fileUrl=new URL(`../${entry.asset.replace(/^\.\//,'')}`,import.meta.url);
  const bytes=await readFile(fileUrl),info=await stat(fileUrl);
  assert.ok(info.size>30000,`${entry.id}: asset unexpectedly small`);
  if(entry.asset.endsWith('.png')){
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',entry.id);
    assert.equal(bytes[25],6,`${entry.id}: PNG must retain RGBA transparency`);
  }else{
    assert.equal(bytes.subarray(0,4).toString(),'RIFF',entry.id);
    assert.equal(bytes.subarray(8,12).toString(),'WEBP',entry.id);
  }
}
function webpDimensions(bytes){
  const kind=bytes.subarray(12,16).toString();
  if(kind==='VP8 ')return{width:bytes.readUInt16LE(26)&0x3fff,height:bytes.readUInt16LE(28)&0x3fff};
  if(kind==='VP8X')return{width:1+bytes.readUIntLE(24,3),height:1+bytes.readUIntLE(27,3)};
  if(kind==='VP8L'){const b1=bytes[21],b2=bytes[22],b3=bytes[23],b4=bytes[24];return{width:1+(b1|((b2&0x3f)<<8)),height:1+((b2>>6)|(b3<<2)|((b4&15)<<10))}}
  throw new Error(`unsupported WebP chunk ${kind}`);
}
for(const entry of SHOWROOM_CATALOG_V2.filter(item=>item.category==='graph_skin')){
  const bytes=await readFile(new URL(`../${entry.asset.replace(/^\.\//,'')}`,import.meta.url)),size=webpDimensions(bytes);
  assert.deepEqual(size,{width:1536,height:864},`${entry.id}: graph skin must be exact 1536x864`);
  assert.equal(size.width*9,size.height*16,`${entry.id}: source graph skin must be exactly 16:9`);
}
const graphManifest=JSON.parse(await readFile(new URL('../assets/showroom-v4/graph_skin.manifest.json',import.meta.url),'utf8'));
assert.equal(graphManifest.items.length,12);assert.equal(graphManifest.category,'graph_skin');
assert.equal(graphManifest.items.some(item=>item.asset.includes('-source.png')),false,'source PNG must never be a runtime asset');
const safeZoneReport=JSON.parse(await readFile(new URL('../assets/showroom-v4/graph_skin.safe-zone.json',import.meta.url),'utf8'));
assert.deepEqual(safeZoneReport.region,GRAPH_SKIN_SAFE_AREA);
assert.equal(safeZoneReport.items.length,12);
for(const report of safeZoneReport.items){
  const manifestEntry=graphManifest.items.find(entry=>entry.id===report.id);
  assert.ok(manifestEntry,report.id);
  assert.equal(report.sha256,manifestEntry.sha256,`${report.id}: safe-zone report must match the verified image hash`);
  assert.ok(report.edgeMean<=safeZoneReport.maxEdgeMean,`${report.id}: central graph safe area is too visually busy`);
  const bytes=await readFile(new URL(`../${manifestEntry.asset.replace(/^\.\//,'')}`,import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),report.sha256,`${report.id}: safe-zone-approved asset changed`);
}
const generatedV4=await readFile(new URL('../js/showroom-catalog-v4.generated.js',import.meta.url),'utf8');
assert.equal(generatedV4.includes('-source.png'),false,'generated runtime must not reference source PNG');

for(const [category,render] of [['companion',renderCompanionV2],['trophy',renderTrophyV2],['point_marker',renderMarkerV2],['profile_emoji',renderProfileEmojiV2],['emoji_border',renderEmojiBorderV2]]){
  for(const entry of SHOWROOM_CATALOG_V2.filter(item=>item.category===category)){
    const html=render(entry.id);assert.ok(html.includes('<img'),entry.id);assert.ok(html.includes(entry.asset),entry.id);assert.equal(html.includes('<svg'),false,entry.id);
  }
}
for(const entry of SHOWROOM_CATALOG_V2.filter(item=>item.category==='ambient_effect'))assert.equal(renderAmbientV2(entry.id),'');
for(const entry of SHOWROOM_CATALOG_V2){
  const html=renderCatalogPreviewV2(entry);
  entry.asset?assert.ok(html.includes(entry.asset),entry.id):assert.ok(html.length>0,entry.id);
}

let removedOldFrame=false,prependedFrame=null;
const fakeProfile={
  dataset:{},
  querySelectorAll:selector=>selector.includes(':scope > .v3-card-theme-frame')?[{remove(){removedOldFrame=true}}]:[],
  querySelector:()=>null,
  removeAttribute(name){delete this.dataset[name]},prepend(frame){prependedFrame=frame},
};
const fakeCard={matches:()=>false,querySelector:selector=>selector===':scope > .cmp-profile, :scope > .sr-profile-head'?fakeProfile:null};
const previousDocument=globalThis.document;
globalThis.document={createElement:tag=>({tagName:tag.toUpperCase(),setAttribute(name,value){this[name]=value}})};
try{
  assert.equal(applyCardV2(fakeCard,{card_theme:'ct_alpine_dawn'}),true);
  assert.equal(removedOldFrame,true);assert.equal(prependedFrame.tagName,'IMG');assert.equal(prependedFrame.className,'v4-card-theme-frame');
  assert.equal(prependedFrame.src,'./assets/showroom-v4/card_theme/ct4_uncommon_iron_outpost_header.png');assert.equal(prependedFrame['aria-hidden'],'true');
  assert.equal(fakeProfile.dataset.cardPreset,'ct4_uncommon_iron_outpost');assert.equal('style' in fakeCard,false,'card background style must not be injected');
}finally{if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument}

const achIds=new Set(ACHIEVEMENTS.map(achievement=>achievement.id));
for(const [achId,ids] of Object.entries(ACHIEVEMENT_ITEM_REWARDS_V2)){
  assert.ok(achIds.has(achId),achId);for(const id of ids)assert.ok(getCatalogItemV2(id),`${achId}:${id}`);
}
assert.deepEqual(normalizeAchievementTrophyRewardsV2({record_1:'tr_summit_compass',bad:'not-a-trophy'}),{record_1:['tr_summit_compass']});
assert.ok(rewardItemsForAchievementsV2(new Set(['record_1']),{record_1:'tr_summit_compass'}).includes('tr_summit_compass'));

const visualLab=await readFile(new URL('../visual-lab.html',import.meta.url),'utf8');
assert.ok(visualLab.includes('SHOWROOM_CATALOG_V2'));assert.ok(visualLab.includes('decorateMainPlotV2'));assert.ok(visualLab.includes('<canvas id="demoCanvas"'));assert.equal(visualLab.toLowerCase().includes('firebase'),false);
assert.ok(visualLab.includes('data-main-weight-plot="true"'));
assert.ok(visualLab.includes('data-subgraph="diet"'));assert.ok(visualLab.includes('data-subgraph="exercise"'));
const css=await readFile(new URL('../css/style.css',import.meta.url),'utf8');
for(const token of ['.v3-main-plot-decor','background:transparent','aspect-ratio:16/9','.v3-graph-layer{z-index:1;opacity:.9;display:block;object-fit:fill!important','.v3-ambient-layer','mask-image:radial-gradient','.v2-plot-host>canvas','z-index:2!important','.v2-companion','.v2-trophies','.v3-card-theme-frame','object-fit:fill','mask-composite:exclude'])assert.ok(css.includes(token),token);
assert.equal(css.includes('.v3-card-plot-layer'),false,'card theme must not create a graph layer');
assert.equal(css.includes('.showroom-v2-card::before'),false,'card theme must not become a card background');
assert.equal(css.includes('--v3-card-image'),false,'card theme background variable must be retired');
const renderer=await readFile(new URL('../js/showroom-v2.js',import.meta.url),'utf8');
const cardApplicator=renderer.slice(renderer.indexOf('export function applyCardV2'),renderer.indexOf('export function decorateMainPlotV2'));
for(const token of ["querySelector?.(':scope > .cmp-profile, :scope > .sr-profile-head')","document.createElement('img')",'v3-card-theme-frame','profile.prepend(frame)'])assert.ok(cardApplicator.includes(token),token);
for(const forbidden of ['style.setProperty','background','--v3-card-image','showroom-v2-card'])assert.equal(cardApplicator.includes(forbidden),false,`card theme must not inject ${forbidden}`);
const mainPlotDecorator=renderer.slice(renderer.indexOf('export function decorateMainPlotV2'),renderer.indexOf('export function renderCatalogPreviewV2'));
for(const token of ['[data-main-weight-plot="true"]','v3-main-plot-decor','v3-graph-layer',"dataset.aspectRatio='16:9'","dataset.hasGraph=graph?'true':'false'"])assert.ok(mainPlotDecorator.includes(token),token);
assert.equal(mainPlotDecorator.includes('card_theme'),false,'card theme is card-only');
assert.equal(mainPlotDecorator.includes('v3-card-plot-layer'),false,'card theme layer must not be injected into plots');
assert.ok(renderer.includes('options.mainPlot===true?decorateMainPlotV2(plot,raw):false'),'legacy API must require explicit mainPlot opt-in');
const chart=await readFile(new URL('../js/chart-render.js',import.meta.url),'utf8');
assert.equal((chart.match(/dot\(ctx,/g)||[]).length-1,3,'max/min/current marker calls stay explicit');
assert.equal((chart.match(/dot\(ctx, mix, miy, GREEN, 7, true\)/g)||[]).length,1,'image point marker is rendered exactly once at the lowest point');
assert.ok(chart.includes('chartDecorations?.markerAsset'));assert.ok(chart.includes('ctx.drawImage(markerImage'));
assert.ok(chart.includes('Number(chartDecorations?.markerSize) || 32'));
assert.ok(chart.includes('Math.max(20, Math.min(44'));
assert.ok(chart.includes('ctx.drawImage(markerImage,px-markerSize/2,py-markerSize/2,markerSize,markerSize)'));
const datasetSource=chart.slice(chart.indexOf('const datasets = ['),chart.indexOf('const sharedX ='));
assert.equal(datasetSource.includes('markerSize'),false,'image marker size must not affect ordinary dataset points');
assert.equal(chart.includes("text: '체중 (kg)'"),false,'Y-axis title must be removed');
assert.equal(chart.includes("text: '체중(kg)'"),false,'Y-axis title must be removed');
for(const token of ['mainPlotDomBoundsPlugin','chart.chartArea','.v3-main-plot-decor[data-showroom-main-plot="true"]','--showroom-main-plot-bottom','fitMainPlotBounds(area,mainPlotAspectRatio||16/9)','lineStyleEffectPlugin','showroomFxPlugin','showroomLineColor','showroomLineWidth','chartDecorations?.lineDash','chartDecorations?.lineGlowBlur','chartDecorations?.lineTension','plugins: [canvasBgPlugin, lineStyleEffectPlugin, showroomFxPlugin, mainPlotDomBoundsPlugin'])assert.ok(chart.includes(token),token);
const fitted=fitMainPlotBounds({left:58,top:16,right:658,bottom:430},16/9);
assert.ok(fitted.left>=58,'main plot host must start inside chartArea left');
assert.ok(fitted.top>=16,'main plot host must start inside chartArea top');
assert.ok(fitted.bottom<=430,'main plot host must not reach subgraph reservation below chartArea');
assert.ok(Math.abs(fitted.width/fitted.height-16/9)<1e-9,'main plot host must remain exactly 16:9');
assert.ok(mainPlotDecorator.includes('<span class="v2-trophies">'),'trophy shelf must be a child of the chartArea-bound host');
assert.ok(css.includes('.v2-trophies{position:absolute;z-index:4;left:6px;top:6px'),'trophy shelf must be pinned to the host top-left');
assert.equal((visualLab.match(/drawMarker\(ctx,marker,/g)||[]).length,1,'visual lab must show the image marker only at the lowest point');
assert.equal((visualLab.match(/drawMarker\(ctx,/g)||[]).length-1,1,'visual lab must render exactly one point marker');

const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
assert.ok(sw.includes("weight-v83-smiling-profile-default"));assert.equal(sw.includes('c.addAll(ASSETS).catch'),false);
for(const entry of SHOWROOM_CATALOG_V2.filter(entry=>entry.asset))assert.ok(sw.includes(`'${entry.asset}'`),`sw:${entry.asset}`);

const showroom=await readFile(new URL('../dressroom.html',import.meta.url),'utf8');
for(const token of ['purchaseCatalogItemsV2','saveShowroomLoadoutV2','현재 범주 검색','unownedSelectionV2','decorateMainPlotV2','data-main-weight-plot="true"','data-chart-subgraphs="diet exercise"','mainPlotAspectRatio:16/9','테스트 중 · 구매 불가','item.purchasable!==false&&!item.testOnly','테스트 아이템은 세션 미리보기 전용이며 저장할 수 없습니다','id="trophyOrder"','renderTrophyOrder','data-trophy-move','보유 트로피 · 전시 순서','id="lineControls"','renderLineControls','id="lineColor"','id="lineWidth"','3:1 미만 경고','추천색','id="companionControls"','renderCompanionControls','data-companion-layout="${key}"','크기','투명도','위치 X','위치 Y','최종 저장’ 전에는 계정에 저장되지 않습니다'])assert.ok(showroom.includes(token),token);
const companionControlSource=showroom.slice(showroom.indexOf('function renderCompanionControls'),showroom.indexOf('function filtered'));
assert.equal(companionControlSource.includes('saveShowroomLoadoutV2'),false,'companion sliders must mutate only the draft before final save');
assert.ok(showroom.includes('.sr-cats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))'));
assert.ok(showroom.includes('@media(max-width:520px){.sr-cats{grid-template-columns:repeat(2,minmax(0,1fr))}}'));
assert.equal(showroom.includes('id="logoutBtn"'),false,'dressroom header must not render the large logout button');
const compare=await readFile(new URL('../compare.html',import.meta.url),'utf8');
for(const token of ['decorateMainPlotV2','getChartDecorationsV2','data-main-weight-plot="true"','mainPlotAspectRatio: 16 / 9','id="dietToggle" type="checkbox"','id="exerciseToggle" type="checkbox"','for="dietToggle"','for="exerciseToggle"',"localStorage.getItem('compare_show_diet') === 'true'","localStorage.getItem('compare_show_exercise') === 'true'","persistSubgraphToggle('compare_show_diet'","persistSubgraphToggle('compare_show_exercise'",'showDietGraph,','showExerciseGraph,','renderGrid()'])assert.ok(compare.includes(token),token);
for(const token of ['showMaxMarker: false','showMinMarker: true','showCurMarker: false'])assert.ok(compare.includes(token),token);
for(const token of ['id="markerSize" type="range" min="20" max="44" step="2" value="32"',"localStorage.getItem('compare_marker_size')",'markerSize=Number(size.value)',"localStorage.setItem('compare_marker_size'",'chartDecorations: { ...getChartDecorationsV2(user?.showroomLoadoutV2), markerSize }','.marker-size-control{grid-column:1/-1'])assert.ok(compare.includes(token),token);
const db=await readFile(new URL('../js/db.js',import.meta.url),'utf8');
for(const token of ['purchaseCatalogItemsV2','validateCatalogPurchaseV2(itemIds)','persistableLoadoutV2(rawLoadout)','트로피 외 테스트 아이템은 소유권을 추가하거나 회수할 수 없습니다','runTransaction','adminSetCatalogOwnershipV2','adminGrantedItems',"item.category==='trophy'"])assert.ok(db.includes(token),token);
const purchaseSource=db.slice(db.indexOf('export async function purchaseCatalogItemsV2'),db.indexOf('export const purchaseShowroomItem'));
assert.ok(purchaseSource.indexOf('validateCatalogPurchaseV2(itemIds)')<purchaseSource.indexOf('runTransaction'),'test-only purchase must fail before Firestore transaction');
const admin=await readFile(new URL('../admin.html',import.meta.url),'utf8');
for(const token of ['achievementTrophyRewards','data-ach-trophy','saveAchTrophy','트로피 보상 저장됨'])assert.ok(admin.includes(token),token);
for(const page of ['index.html','input.html','dashboard.html','compare.html','achievements.html','dressroom.html','import.html','admin.html']){
  const html=await readFile(new URL(`../${page}`,import.meta.url),'utf8');
  assert.ok(html.includes('profileVisualForUserV2'),`${page}: common showroom profile renderer missing`);
  assert.equal(html.includes('\uFFFD'),false,`${page}: invalid UTF-8 replacement character`);
  const moduleBody=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1]||'';
  const withoutImports=moduleBody.replace(/import[\s\S]*?from\s*['"][^'"]+['"];\s*/g,'');
  assert.doesNotThrow(()=>new Function(withoutImports),`${page}: inline module syntax`);
}
assert.ok((await readFile(new URL('../index.html',import.meta.url),'utf8')).includes('profileVisualForUserV2(u,52)'),'login account card must render each account showroomLoadoutV2 through the common user renderer');

console.log('showroom image catalog tests: PASS');
