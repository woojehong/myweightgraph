import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import {
  SHOWROOM_CATALOG_V2, SHOWROOM_CATEGORIES, SHOWROOM_DEFAULTS,
  LEGACY_SHOWROOM_ID_ALIASES, GRANDFATHERED_RELEASED_ITEM_IDS, SHOWROOM_V4_ACTIVE_CATEGORIES, resolveShowroomItemIdV2, assertShowroomCatalogV2,
} from '../js/showroom-catalog-v2.js';
import { GRAPH_SKIN_PRICE_BY_RARITY, GRAPH_SKIN_SAFE_AREA } from '../js/showroom-graph-skins.js';
import { POINT_MARKER_ITEMS_V9 } from '../js/showroom-point-markers-v9.js';
import { TROPHY_ITEMS_V10 } from '../js/showroom-trophies-v10.js';
import { LINE_STYLE_ITEMS_V11, AMBIENT_EFFECT_ITEMS_V11 } from '../js/showroom-fx-v11.js';
import { TITLES_CATALOG_V2, TITLE_RARITY_COLORS } from '../js/titles-catalog-v2.js';
import { ACHIEVEMENTS } from '../js/achievements.js';
import { ACHIEVEMENT_ITEM_REWARDS_V2, normalizeAchievementTrophyRewardsV2, rewardItemsForAchievementsV2 } from '../js/achievement-item-rewards-v2.js';
import { fitMainPlotBounds } from '../js/chart-render.js';
import {
  ALL_CATALOG_V2, V2_CATEGORIES, CATEGORY_META, normalizeLoadoutV2, getCatalogItemV2,
  COMPANION_LAYOUT_DEFAULTS, COMPANION_LAYOUT_LIMITS, normalizeCompanionLayoutV2,
  ownedItemIdsV2, unownedSelectionV2, persistableLoadoutV2, validateCatalogPurchaseV2,
  renderEmojiBorderV2, getChartDecorationsV2,
  contrastRatioV2, lineContrastAdviceV2,
  renderCompanionV2, renderTrophyV2, renderMarkerV2, renderProfileEmojiV2,
  renderAmbientV2, renderCatalogPreviewV2, profileVisualForUserV2, applyCardV2,
} from '../js/showroom-v2.js';

assert.equal(assertShowroomCatalogV2(),true);
assert.deepEqual(SHOWROOM_V4_ACTIVE_CATEGORIES,['graph_skin','line_style','ambient_effect','emoji_border']);
assert.equal(SHOWROOM_CATALOG_V2.length,205);
assert.equal(TITLES_CATALOG_V2.length,30);
assert.equal(ALL_CATALOG_V2.length,235);
assert.deepEqual(SHOWROOM_CATEGORIES,['graph_skin','line_style','card_theme','point_marker','companion','ambient_effect','trophy','profile_emoji','emoji_border']);
assert.deepEqual(V2_CATEGORIES,[...SHOWROOM_CATEGORIES.filter(category=>category!=='companion'),'title']);
assert.equal(new Set(ALL_CATALOG_V2.map(entry=>entry.id)).size,235);
assert.equal(new Set(SHOWROOM_CATALOG_V2.filter(entry=>entry.asset).map(entry=>entry.asset)).size,152);

const expectedRarityCounts={
  graph_skin:{uncommon:10,rare:7,epic:8,mythic:11},
  line_style:{uncommon:8,rare:5,epic:6,mythic:8},
  card_theme:{uncommon:7,rare:6,epic:8,mythic:11},
  point_marker:{uncommon:4,rare:1,epic:4,mythic:8},
  companion:{},
  ambient_effect:{uncommon:7,rare:5,epic:6,mythic:8},
  trophy:{artifact:12},
  profile_emoji:{uncommon:6,rare:4,epic:5,mythic:12},
  emoji_border:{uncommon:7,rare:5,epic:7,mythic:9},
};
for(const category of SHOWROOM_CATEGORIES){
  const entries=SHOWROOM_CATALOG_V2.filter(entry=>entry.category===category);
  const expectedCount={graph_skin:36,line_style:27,card_theme:32,point_marker:17,companion:0,ambient_effect:26,trophy:12,profile_emoji:27,emoji_border:28}[category]??4;
  assert.equal(entries.length,expectedCount,category);
  const rarityCounts=Object.fromEntries([...new Set(entries.map(entry=>entry.rarity))].map(rarity=>[rarity,entries.filter(entry=>entry.rarity===rarity).length]));
  assert.deepEqual(rarityCounts,expectedRarityCounts[category],`${category} rarity distribution`);
}
assert.equal(SHOWROOM_CATALOG_V2.filter(entry=>entry.category==='card_theme').length,32,'the expanded-header collection must include V13 coupled themes');
assert.equal(LINE_STYLE_ITEMS_V11.length,21);
assert.equal(AMBIENT_EFFECT_ITEMS_V11.length,21);
assert.deepEqual(LINE_STYLE_ITEMS_V11.map(entry=>entry.rarity),[
  ...Array(5).fill('uncommon'),...Array(5).fill('rare'),...Array(5).fill('epic'),...Array(6).fill('mythic'),
]);
assert.deepEqual(AMBIENT_EFFECT_ITEMS_V11.map(entry=>entry.rarity),[...Array(5).fill('uncommon'),...Array(5).fill('rare'),...Array(5).fill('epic'),...Array(6).fill('mythic')]);
assert.deepEqual(LINE_STYLE_ITEMS_V11.map(entry=>entry.renderSpec.colorMode),[
  ...Array(5).fill('custom'),'custom','fixed','fixed','custom','custom',...Array(11).fill('fixed'),
]);
assert.deepEqual(LINE_STYLE_ITEMS_V11.slice(0,10).map(entry=>entry.renderSpec.motionTier),[
  ...Array(5).fill('gentle'),...Array(5).fill('subtle'),
]);
assert.deepEqual(LINE_STYLE_ITEMS_V11.map(entry=>entry.renderSpec.motionTier),[
  ...Array(5).fill('gentle'),...Array(5).fill('subtle'),...Array(5).fill('heroic'),...Array(6).fill('mythic'),
]);
assert.deepEqual(AMBIENT_EFFECT_ITEMS_V11.map(entry=>entry.renderSpec.motionTier),[
  ...Array(5).fill('gentle'),...Array(5).fill('subtle'),...Array(5).fill('heroic'),...Array(6).fill('mythic'),
]);
assert.equal(getChartDecorationsV2({line_style:'ls11_u_champion_stitch',lineColor:'#ff00ff'}).lineColor,'#ff00ff','custom line colors must be accepted');
assert.equal(getChartDecorationsV2({line_style:'ls11_e_thunder_current',lineColor:'#ff00ff'}).lineColor,'#9ddcff','fixed heroic line colors must ignore manual overrides');
assert.equal(getChartDecorationsV2({line_style:'ls12_m_tidal_archmage_frost'}).lineFx,'ls12_m_tidal_archmage_frost');
assert.equal(getChartDecorationsV2({ambient_effect:'ae12_m_tidal_archmage_blizzard'}).ambientFx,'ae12_m_tidal_archmage_blizzard');
assert.ok(SHOWROOM_CATALOG_V2.filter(entry=>entry.category==='line_style').every(entry=>/^ls1[123]_/.test(entry.id)),'old line styles must be fully retired');
assert.ok(SHOWROOM_CATALOG_V2.filter(entry=>entry.category==='ambient_effect').every(entry=>/^ae1[123]_/.test(entry.id)),'old ambient effects must be fully retired');
const legendaryProfiles=SHOWROOM_CATALOG_V2.filter(entry=>entry.category==='profile_emoji'&&entry.rarity==='mythic'&&entry.id.startsWith('pe_l_'));
assert.equal(legendaryProfiles.length,10,'the first V6 legendary profile set must contain ten additive items');
assert.ok(['빙관의 몰락 왕자','파도유리 대마도사','강철턱 대족장','까마귀탑 수호자'].every(name=>legendaryProfiles.some(entry=>entry.name===name)));
for(const entry of legendaryProfiles){
  assert.equal(entry.price,1200,entry.id);
  assert.equal(entry.purchasable,true,entry.id);
  assert.equal(entry.testOnly,false,entry.id);
  assert.ok(entry.asset.startsWith('./assets/showroom-v6/profile_emoji/'),entry.id);
}
for(const entry of SHOWROOM_CATALOG_V2.filter(item=>item.id!=='pe_r_roaring_tiger_general')){
  assert.equal(entry.testOnly,false,entry.id);
  assert.equal(entry.purchasable,entry.category!=='trophy',entry.id);
  assert.equal(entry.persistable,true,entry.id);
}
const releasedGraphSkins=SHOWROOM_CATALOG_V2.filter(entry=>entry.category==='graph_skin');
assert.deepEqual(GRAPH_SKIN_PRICE_BY_RARITY,{uncommon:600,rare:1200,epic:1950,legendary:3000});
assert.deepEqual(releasedGraphSkins.slice(0,12).map(entry=>entry.price),[600,600,600,1200,3000,1200,3000,1950,3000,3000,3000,3000]);
assert.deepEqual(releasedGraphSkins.slice(0,12).map(entry=>entry.name),[
  '무쇠산 작업장','달빛 여관','사막 유랑단','세계수 꿈길','폭풍왕국','붉은철 요새',
  '은빛달 궁정','별벼림 창조소','심해 여왕 궁전','빙관 왕좌','황천 검은 성소','용군단 화염둥지',
]);
for(const entry of releasedGraphSkins.slice(0,12)){
  assert.equal(entry.testOnly,false,entry.id);assert.equal(entry.purchasable,true,entry.id);assert.equal(entry.persistable,true,entry.id);
  assert.deepEqual(entry.safeArea,GRAPH_SKIN_SAFE_AREA,entry.id);
}
for(const entry of releasedGraphSkins.slice(12)){
  assert.equal(entry.testOnly,false,entry.id);assert.equal(entry.purchasable,true,entry.id);assert.equal(entry.persistable,true,entry.id);
  assert.equal(entry.price,GRAPH_SKIN_PRICE_BY_RARITY[entry.rarity==='mythic'?'legendary':entry.rarity],entry.id);
  assert.equal(entry.plannedPrice,GRAPH_SKIN_PRICE_BY_RARITY[entry.rarity==='mythic'?'legendary':entry.rarity],entry.id);
  assert.ok(entry.asset.startsWith('./assets/showroom-v12/graph_skin/')||entry.asset.startsWith('./assets/showroom-v13/graph_skin/'),entry.id);
  assert.deepEqual(entry.safeArea,GRAPH_SKIN_SAFE_AREA,entry.id);
}
assert.deepEqual(GRANDFATHERED_RELEASED_ITEM_IDS,['ae_dust','ae_firefly','ae_bubble','ae_thunder']);
assert.deepEqual(TITLE_RARITY_COLORS,{common:'#FFFFFF',uncommon:'#1EFF00',rare:'#0070DD',epic:'#A335EE',mythic:'#FF8000',legendary:'#FF8000'});
for(const entry of ALL_CATALOG_V2)assert.match(entry.id,/^[a-z0-9_]+$/);
assert.equal(ALL_CATALOG_V2.some(entry=>entry.category==='companion'),false,'retired companion category must stay out of every user/admin catalog surface');

assert.ok(Object.keys(LEGACY_SHOWROOM_ID_ALIASES).length>=30);
assert.equal(Object.keys(LEGACY_SHOWROOM_ID_ALIASES).some(id=>id.startsWith('tr_')),false,'retired trophies must never alias to new trophies');
for(const [legacy,target] of Object.entries(LEGACY_SHOWROOM_ID_ALIASES)){
  if(legacy.startsWith('cp_')){assert.equal(getCatalogItemV2(target),null,`${legacy}: retired companion aliases must remain inert`);continue}
  assert.ok(getCatalogItemV2(target),`${legacy}:${target}`);
  assert.equal(resolveShowroomItemIdV2(legacy),target);
}
assert.equal(resolveShowroomItemIdV2('fabricated_old_id'),'fabricated_old_id');
assert.equal(getCatalogItemV2('gs_slate_lines').id,'gs_v4_uncommon_01');
assert.equal(getCatalogItemV2('gs_void_lattice').id,'gs_v4_rare_01');
assert.equal(getCatalogItemV2('gs_phoenix_wake').id,'gs_v4_epic_01');
assert.equal(getCatalogItemV2('gs_crown_of_dawn').id,'gs_v4_legendary_01');
assert.equal(getCatalogItemV2('gs_explorer_parchment').id,'gs_v4_uncommon_01','released V3 graph ownership must migrate');
assert.equal(getCatalogItemV2('ct_alpine_dawn'),null,'retired card themes must not migrate into the replacement collection');
assert.equal(getCatalogItemV2('ae_bubble'),null,'retired effects must not migrate into the replacement collection');
assert.equal(getCatalogItemV2('ae_firefly'),null,'retired effects must remain inert');
assert.equal(getCatalogItemV2('ae_mist'),null,'retired legacy effects must remain inert');

const normalized=normalizeLoadoutV2({
  graph_skin:'gs_slate_lines', point_marker:'pm_dawn_relic', title:'legacy title',
  trophy:['tr_wood_medal','tr_crystal_cup','tr_phoenix_relic','tr_dawn_regalia','bad'],
});
assert.equal(normalized.graph_skin,'gs_v4_uncommon_01');
assert.equal(normalized.point_marker,null);
assert.equal(normalized.title,null);
assert.deepEqual(normalized.trophy,[]);
assert.deepEqual(SHOWROOM_DEFAULTS,{graph_skin:null,line_style:null,card_theme:null,point_marker:null,companion:null,ambient_effect:null,trophy:[],profile_emoji:null,emoji_border:null});
assert.deepEqual(COMPANION_LAYOUT_DEFAULTS,{scale:1,opacity:1,x:90,y:15});
assert.deepEqual(COMPANION_LAYOUT_LIMITS,{scale:{min:.5,max:5},opacity:{min:.2,max:1},x:{min:5,max:95},y:{min:5,max:95}});
assert.deepEqual(normalizeCompanionLayoutV2({scale:99,opacity:-1,x:'bad',y:101}),{scale:5,opacity:.2,x:90,y:95});
assert.deepEqual(normalizeLoadoutV2({}).companionLayout,COMPANION_LAYOUT_DEFAULTS,'old loadouts must receive non-destructive companion defaults');
assert.equal(contrastRatioV2('#ffffff','#000000'),21);
assert.equal(lineContrastAdviceV2('#111827','#070b12').passes,false);
assert.equal(lineContrastAdviceV2('#ffffff','#070b12').passes,true);

const user={purchasedItemsV2:['gs_slate_lines','ae_bubble'],achievementRewardItems:['ct_emerald_lodge'],adminGrantedItems:['title_dawn_watch']};
assert.deepEqual([...ownedItemIdsV2(user)],['gs_v4_uncommon_01','title_dawn_watch']);
assert.equal(normalizeLoadoutV2({...SHOWROOM_DEFAULTS,ambient_effect:'ae_mist'}).ambient_effect,null,'retired loadout effects must be removed');
assert.deepEqual(unownedSelectionV2(user,{...SHOWROOM_DEFAULTS,graph_skin:'gs_v4_uncommon_01',card_theme:'ct_alpine_dawn',companion:'cp_sleepy_golem'}).map(entry=>entry.id),[]);
assert.deepEqual(getChartDecorationsV2(SHOWROOM_DEFAULTS),{});
const pairedMarker=getChartDecorationsV2({point_marker:'pm_l_frozen_runeblade'});
assert.equal(pairedMarker.markerHighAsset,'./assets/showroom-v9/point_marker/pm_l_frozen_runeblade_high.png');
assert.equal(pairedMarker.markerLowAsset,'./assets/showroom-v9/point_marker/pm_l_frozen_runeblade_low.png');
assert.equal(pairedMarker.markerAsset,pairedMarker.markerLowAsset);
const transactionSnapshot={coins:4200,purchasedItemsV2:['legacy_owned'],achievementRewardItems:['legacy_reward'],adminGrantedItems:[]};
const transactionBefore=structuredClone(transactionSnapshot);
assert.deepEqual(validateCatalogPurchaseV2(['gs_v4_uncommon_01']).map(entry=>[entry.id,entry.price]),[['gs_v4_uncommon_01',600]]);
assert.throws(()=>validateCatalogPurchaseV2(['tr_a_world_series_constellation']),/트로피는 구매할 수 없으며 업적 달성 또는 관리자 지급으로만 획득/);
assert.deepEqual(transactionSnapshot,transactionBefore,'blocked purchase must not mutate coins or ownership');
assert.deepEqual(persistableLoadoutV2({graph_skin:'gs_v4_uncommon_01',companion:'cp_sleepy_golem',trophy:['tr_a_world_cup_orb'],companionLayout:{scale:1.35,opacity:.65,x:24,y:81}}),{...SHOWROOM_DEFAULTS,graph_skin:'gs_v4_uncommon_01',companion:null,trophy:['tr_a_world_cup_orb'],title:null,companionLayout:{scale:1.35,opacity:.65,x:24,y:81}});
assert.ok(profileVisualForUserV2({emoji:'🦁'},32).includes('🙂'),'unselected showroom profiles must use the single smiling default instead of legacy emoji remnants');
assert.equal(profileVisualForUserV2({emoji:'🦁'},32).includes('🦁'),false,'legacy user emoji must not leak into common profile surfaces');
assert.equal(profileVisualForUserV2({emoji:'🦁',showroomLoadoutV2:{profile_emoji:'pe_archive_spirit',emoji_border:'eb_forged_iron'}},32).includes('pe_archive_spirit.png'),false);
assert.equal(profileVisualForUserV2({emoji:'🦁',showroomLoadoutV2:{profile_emoji:'pe_archive_spirit',emoji_border:'eb_forged_iron'}},32).includes('eb_forged_iron.png'),false);
assert.deepEqual([...ownedItemIdsV2({achievementRewardItems:['tr_a_world_cup_orb']})],['tr_a_world_cup_orb']);
assert.deepEqual([...ownedItemIdsV2({adminGrantedItems:['tr_a_big_ears']})],['tr_a_big_ears']);

for(const entry of SHOWROOM_CATALOG_V2.filter(entry=>entry.asset)){
  const fileUrl=new URL(`../${entry.asset.replace(/^\.\//,'')}`,import.meta.url);
  const bytes=await readFile(fileUrl),info=await stat(fileUrl);
  assert.ok(info.size>30000,`${entry.id}: asset unexpectedly small`);
  if(entry.asset.endsWith('.png')){
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',entry.id);
    if(entry.category!=='card_theme')assert.equal(bytes[25],6,`${entry.id}: PNG must retain RGBA transparency`);
  }else{
    assert.equal(bytes.subarray(0,4).toString(),'RIFF',entry.id);
    assert.equal(bytes.subarray(8,12).toString(),'WEBP',entry.id);
  }
}
for(const entry of POINT_MARKER_ITEMS_V9){
  assert.deepEqual(Object.keys(entry.markerAssets),['high','low'],entry.id);
  for(const asset of Object.values(entry.markerAssets)){
    const bytes=await readFile(new URL(`../${asset.replace(/^\.\//,'')}`,import.meta.url));
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',asset);
    assert.equal(bytes[25],6,`${asset}: paired marker must retain RGBA transparency`);
  }
}
for(const entry of AMBIENT_EFFECT_ITEMS_V11){
  if(entry.id==='ae12_m_tidal_archmage_blizzard')continue;
  for(let index=1;index<=8;index++){
    const asset=`./assets/showroom-v11/ambient_effect/${entry.id}_${String(index).padStart(2,'0')}.png`;
    const bytes=await readFile(new URL(`../${asset.replace(/^\.\//,'')}`,import.meta.url));
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',asset);
    assert.equal(bytes[25],6,`${asset}: V11 effect sprite must retain RGBA transparency`);
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

for(const [category,render] of [['trophy',renderTrophyV2],['point_marker',renderMarkerV2],['profile_emoji',renderProfileEmojiV2],['emoji_border',renderEmojiBorderV2]]){
  for(const entry of SHOWROOM_CATALOG_V2.filter(item=>item.category===category&&item.id!=='pe_r_roaring_tiger_general')){
    const html=render(entry.id);
    const expectedAsset=category==='point_marker'?(entry.markerAssets?.low||entry.asset):entry.asset;
    assert.ok(html.includes('<img'),entry.id);
    assert.ok(html.includes(expectedAsset),entry.id);
    assert.equal(html.includes('<svg'),false,entry.id);
  }
}
assert.equal(renderCompanionV2('cp_l01'),'','retired companions must never render');
for(const entry of SHOWROOM_CATALOG_V2.filter(item=>item.category==='ambient_effect')){
  const preview=renderAmbientV2(entry.id);
  assert.ok(preview.includes('v11-ambient-preview'),entry.id);
  if(entry.id==='ae12_m_tidal_archmage_blizzard')assert.ok(preview.includes('v12-blizzard-preview'),entry.id);
  else if(entry.id.startsWith('ae13_'))assert.ok(preview.includes('v13-ambient-preview'),entry.id);
  else assert.ok(preview.includes(`${entry.id}_01.png`),entry.id);
}
const fxSource=await readFile(new URL('../js/showroom-fx.js',import.meta.url),'utf8');
for(const entry of AMBIENT_EFFECT_ITEMS_V11)assert.ok((fxSource.match(new RegExp(entry.id,'g'))||[]).length>=2,`${entry.id}: renderer allow-list and implementation must both exist`);
for(const token of ['V11_AMBIENT_RENDERERS','v11Bolt','v11ProtectCenter','v11ArtCache','v11DrawArt','v11ArtStream','v11ArtOrbit','v11LayeredAmbient','v11Snowflake','frostTide(ctx,pts,acc,T,base)','ae12_m_tidal_archmage_blizzard(ctx,a,t)','ae11_m_frozen_crown(ctx,a,t)','ae11_m_black_sanctuary(ctx,a,t)','ae11_e_spider_rift(ctx,a,t)','ae11_m_banshee_dirge(ctx,a,t)'])assert.ok(fxSource.includes(token),token);
assert.equal(fxSource.includes('v11RuneRing'),false,'dotted procedural rune rings must be fully removed');
assert.equal(fxSource.includes('function v11Ribbon'),false,'legacy sine-wave ribbon renderer must stay retired');
for(const entry of SHOWROOM_CATALOG_V2.filter(item=>item.id!=='pe_r_roaring_tiger_general')){
  const html=renderCatalogPreviewV2(entry);
  const previewAsset=entry.category==='point_marker'?(entry.markerAssets?.high||entry.markerAssets?.low||entry.asset):entry.asset;
  previewAsset?assert.ok(html.includes(previewAsset),entry.id):assert.ok(html.length>0,entry.id);
}

let removedOldFrame=false;
const fakeProfile={
  dataset:{},
  querySelectorAll:selector=>selector.includes(':scope > .v3-card-theme-frame')?[{remove(){removedOldFrame=true}}]:[],
  querySelector:()=>null,
  removeAttribute(name){delete this.dataset[name]},
};
const fakeCard={matches:()=>false,querySelector:selector=>selector===':scope > .cmp-profile, :scope > .sr-profile-head'?fakeProfile:null};
const previousDocument=globalThis.document;
try{
  assert.equal(applyCardV2(fakeCard,{card_theme:'ct_alpine_dawn'}),false);
  assert.equal(removedOldFrame,true);assert.equal(fakeProfile.dataset.cardPreset,undefined);
}finally{if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument}

const achIds=new Set(ACHIEVEMENTS.map(achievement=>achievement.id));
for(const [achId,ids] of Object.entries(ACHIEVEMENT_ITEM_REWARDS_V2)){
  assert.ok(achIds.has(achId),achId);for(const id of ids)assert.ok(getCatalogItemV2(id),`${achId}:${id}`);
}
assert.deepEqual(normalizeAchievementTrophyRewardsV2({record_1:'tr_a_world_series_constellation',bad:'not-a-trophy'}),{record_1:['tr_a_world_series_constellation']});
assert.ok(rewardItemsForAchievementsV2(new Set(['record_1']),{record_1:'tr_a_world_series_constellation'}).includes('tr_a_world_series_constellation'));

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
assert.equal((chart.match(/dot\(ctx, gx\(mp\.t\), gy\(mp\.w\), RED, 7, 'high', area\)/g)||[]).length,1,'paired high marker must render exactly once at the highest point');
assert.equal((chart.match(/dot\(ctx, mix, miy, GREEN, 7, 'low', area\)/g)||[]).length,1,'paired low marker must render exactly once at the lowest point');
assert.ok(chart.includes('chartDecorations?.markerHighAsset'));assert.ok(chart.includes('chartDecorations?.markerLowAsset'));assert.ok(chart.includes('ctx.drawImage(markerImage'));
assert.ok(chart.includes('Number(chartDecorations?.markerSize) || 32'));
assert.ok(chart.includes('Math.max(20, Math.min(100'));
assert.ok(chart.includes('ctx.drawImage(markerImage,px-safeSize/2,py-safeSize/2,safeSize,safeSize)'));
assert.ok(chart.includes('devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5)'));
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
assert.equal(mainPlotDecorator.includes('v2-trophies'),false,'trophies must leave the graph and render in the card header');
const compareHeaderSource=await readFile(new URL('../compare.html',import.meta.url),'utf8');
assert.ok(compareHeaderSource.includes('<div class="cmp-trophies">${trophies.map(renderTrophyV2).join(\'\')}</div>'),'trophies must render in the header medal rail');
for(const token of ['grid-template-columns:repeat(7,34px)','grid-template-rows:repeat(2,34px)','direction:rtl','justify-content:right','max-height:72px'])assert.ok(compareHeaderSource.includes(token),token);
assert.equal((visualLab.match(/drawMarker\(ctx,marker,/g)||[]).length,1,'visual lab must show the image marker only at the lowest point');
assert.equal((visualLab.match(/drawMarker\(ctx,/g)||[]).length-1,1,'visual lab must render exactly one point marker');

const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
assert.ok(sw.includes("weight-v136-nutrition-beta"));assert.ok(sw.includes("c.addAll(CORE_ASSETS)"));assert.equal(sw.includes('c.addAll(ASSETS)'),false);
for(const entry of SHOWROOM_CATALOG_V2.filter(entry=>entry.asset&&entry.id!=='pe_r_roaring_tiger_general')){
  const cached=entry.asset.includes('/showroom-v13/')
    ?sw.includes(`'${entry.id}'`)
    :sw.includes(`'${entry.asset}'`);
  assert.ok(cached,`sw:${entry.asset}`);
}
for(const entry of POINT_MARKER_ITEMS_V9)for(const asset of Object.values(entry.markerAssets))assert.ok(sw.includes(`'${asset}'`),`${asset}: paired marker must be pre-cached`);
for(const entry of AMBIENT_EFFECT_ITEMS_V11.filter(entry=>entry.id!=='ae12_m_tidal_archmage_blizzard'))assert.ok(sw.includes(entry.id),`${entry.id}: V11 sprite family must be pre-cached`);

const showroom=await readFile(new URL('../dressroom.html',import.meta.url),'utf8');
for(const token of ['purchaseCatalogItemsV2','saveShowroomLoadoutV2','현재 수집품 검색','unownedSelectionV2','decorateMainPlotV2','data-main-weight-plot="true"','data-chart-subgraphs="diet exercise"','mainPlotAspectRatio:16/9','테스트 중 · 구매 불가','item.purchasable!==false&&!item.testOnly','테스트 아이템은 세션 미리보기 전용이며 저장할 수 없습니다','id="trophyOrder"','renderTrophyOrder','data-trophy-move','data-trophy-drag','dragstart','dragover','drop','드래그 또는 화살표로 전시 순서 변경','/14 전시','draft.trophy.length>=14','id="lineControls"','renderLineControls','id="lineColor"','id="lineWidth"','3:1 미만 경고','추천색'])assert.ok(showroom.includes(token),token);
assert.equal(CATEGORY_META.trophy.max,14,'header trophy showcase capacity must be 7 × 2');
for(const retiredToken of ['id="companionControls"','renderCompanionControls','data-companion-layout','동반자 없음'])assert.equal(showroom.includes(retiredToken),false,retiredToken);
assert.ok(showroom.includes('.sr-cats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))'));
assert.ok(showroom.includes('@media(max-width:520px){.sr-cats{grid-template-columns:repeat(2,minmax(0,1fr))}}'));
for(const token of [
  'grid-template-columns:82px minmax(0,1fr)',
  '.sr-message-preview,.sr-profile-head[data-card-theme] .sr-message-preview{grid-column:2!important;grid-row:2!important',
  '.sr-trophy-preview,.sr-profile-head[data-card-theme] .sr-trophy-preview{position:relative!important;inset:auto!important;grid-column:1/-1!important;grid-row:3!important',
  '.sr-profile-markers,.sr-profile-head[data-card-theme] .sr-profile-markers{grid-column:1/-1!important;grid-row:4!important',
])assert.ok(showroom.includes(token),`mobile showroom profile layout: ${token}`);
assert.equal(showroom.includes('id="logoutBtn"'),false,'dressroom header must not render the large logout button');
const compare=await readFile(new URL('../compare.html',import.meta.url),'utf8');
assert.ok(compare.includes("window.matchMedia('(min-width:768px)').matches"),'desktop and tablet-width compare must keep two columns');
assert.equal(compare.includes("window.matchMedia('(min-width:1500px)').matches"),false,'compare must not collapse to one column in a narrowed desktop window');
for(const token of ['decorateMainPlotV2','getChartDecorationsV2','data-main-weight-plot="true"','mainPlotAspectRatio: 16 / 9','id="dietToggle" type="checkbox"','id="exerciseToggle" type="checkbox"','for="dietToggle"','for="exerciseToggle"',"localStorage.getItem('compare_show_diet') === 'true'","localStorage.getItem('compare_show_exercise') === 'true'","persistSubgraphToggle('compare_show_diet'","persistSubgraphToggle('compare_show_exercise'",'showDietGraph,','showExerciseGraph,','renderGrid()'])assert.ok(compare.includes(token),token);
for(const token of ['showMaxMarker: false','showMinMarker: true','showCurMarker: false'])assert.ok(compare.includes(token),token);
for(const token of ['<span>마커 크기</span>','id="markerSize" type="range" min="20" max="100" step="2" value="32"',"localStorage.getItem('compare_marker_size')",'markerSize=Number(size.value)',"localStorage.setItem('compare_marker_size'",'chartDecorations: { ...getChartDecorationsV2(user?.showroomLoadoutV2), markerSize }','.marker-size-control{grid-column:1/-1'])assert.ok(compare.includes(token),token);
for(const token of ['renderMarkerV2',"renderMarkerV2(draft.point_marker,'high')","renderMarkerV2(draft.point_marker,'low')",'showMaxMarker:true','showMinMarker:true','showCurMarker:false','markerSize:56','sr-marker-empty-preview','sr-marker-empty-pair'])assert.ok(showroom.includes(token),token);
for(const token of ['updateUser','normalizeTodayMessage','todayMessageDayKey','data-today-message','data-message-reset','data-message-save','saveShowroomMessage','오늘의 한마디를 입력해보세요'])assert.ok(showroom.includes(token),token);
const db=await readFile(new URL('../js/db.js',import.meta.url),'utf8');
for(const token of ['purchaseCatalogItemsV2','validateCatalogPurchaseV2(itemIds)','persistableLoadoutV2(rawLoadout)','트로피 외 테스트 아이템은 소유권을 추가하거나 회수할 수 없습니다','runTransaction','adminSetCatalogOwnershipV2','adminRefundCatalogPurchasesV2','catalogPurchaseLedgerV2','catalogRefundLogV2','catalogGrantLogV2','adminGrantedItems',"item.category==='trophy'"])assert.ok(db.includes(token),token);
for(const staleColor of ['rgba(195,65,42,.92)','rgba(34,128,50,.92)','rgba(20,98,152,.92)']){
  assert.ok(!showroom.includes(staleColor),`card themes must not inherit forced RGB stat color: ${staleColor}`);
}
assert.ok(db.includes('applyShowroomEffects:false'),'dashboard showroom effects must default to off in user chart settings');
const purchaseSource=db.slice(db.indexOf('export async function purchaseCatalogItemsV2'),db.indexOf('export const purchaseShowroomItem'));
assert.ok(purchaseSource.indexOf('validateCatalogPurchaseV2(itemIds)')<purchaseSource.indexOf('runTransaction'),'test-only purchase must fail before Firestore transaction');
const admin=await readFile(new URL('../admin.html',import.meta.url),'utf8');
for(const token of ['achievementTrophyRewards','buildTrophyConnector','toggleTrophyReward','saveTrophyRewards','저장·전체 계정 반영','syncAchievements(cached.id)','renderCatalogAdminHistory','catalogGrantLogV2','catalogRefundLogV2','최근 지급·회수·환불 내역'])assert.ok(admin.includes(token),token);
assert.ok(admin.includes('초상화와 프레임은 사용자의 쇼룸 장착 설정을 따릅니다.'));
for(const legacyAdminToken of ['ADMIN_EMOJIS','_adminPickEmoji','id="eEmojiGrid"','id="eEmoji"','pickAdminEmoji']){
  assert.equal(admin.includes(legacyAdminToken),false,`admin legacy emoji editor must stay retired: ${legacyAdminToken}`);
}
for(const page of ['index.html','input.html','dashboard.html','compare.html','achievements.html','dressroom.html','import.html','admin.html']){
  const html=await readFile(new URL(`../${page}`,import.meta.url),'utf8');
  assert.ok(html.includes(page==='dressroom.html'?'profileShowcaseForUserV2':'profileVisualForUserV2'),`${page}: common showroom profile renderer missing`);
  assert.equal(html.includes('\uFFFD'),false,`${page}: invalid UTF-8 replacement character`);
  const moduleBody=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1]||'';
  const withoutImports=moduleBody.replace(/import[\s\S]*?from\s*['"][^'"]+['"];\s*/g,'');
  assert.doesNotThrow(()=>new Function(withoutImports),`${page}: inline module syntax`);
}
const dashboard=await readFile(new URL('../dashboard.html',import.meta.url),'utf8');
const inputPage=await readFile(new URL('../input.html',import.meta.url),'utf8');
for(const token of [
  '@media(max-width:520px)',
  '.tdy-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))',
  '.tdy-gap{display:none}',
])assert.ok(inputPage.includes(token),`mobile input meal layout: ${token}`);
for(const token of [
  'id="tShowroomEffects"', '쇼룸 효과 적용', "bind('tShowroomEffects','applyShowroomEffects')",
  'data-main-weight-plot="true"', 'decorateMainPlotV2(plot, showroomLoadout || {})',
  'mainPlotAspectRatio:16/9', 'getChartDecorationsV2(showroomLoadout)',
])assert.ok(dashboard.includes(token),`dashboard showroom effects: ${token}`);
const dashboardLoadoutSource=dashboard.slice(
  dashboard.indexOf('const DASHBOARD_SHOWROOM_CATEGORIES'),
  dashboard.indexOf('// 일간/주간/월간'),
);
for(const category of ['graph_skin','line_style','point_marker','ambient_effect'])assert.ok(dashboardLoadoutSource.includes(`'${category}'`),category);
for(const forbidden of ['card_theme','profile_emoji','emoji_border','title','trophy','companion'])assert.equal(
  dashboardLoadoutSource.includes(`'${forbidden}'`),false,`dashboard graph loadout must exclude ${forbidden}`,
);
const dashboardShowroomLoadout=new Function(`${dashboardLoadoutSource}\nreturn dashboardShowroomLoadout;`)();
assert.deepEqual(dashboardShowroomLoadout({
  graph_skin:'graph',line_style:'line',point_marker:'marker',ambient_effect:'ambient',
  card_theme:'card',profile_emoji:'profile',emoji_border:'border',title:'title',trophy:['trophy'],companion:'companion',
}),{graph_skin:'graph',line_style:'line',point_marker:'marker',ambient_effect:'ambient'});
assert.deepEqual(dashboardShowroomLoadout(null),{
  graph_skin:null,line_style:null,point_marker:null,ambient_effect:null,
});
assert.ok(dashboard.includes("S.applyShowroomEffects===true\n      ? dashboardShowroomLoadout(user?.showroomLoadoutV2)\n      : null"));
assert.ok((await readFile(new URL('../index.html',import.meta.url),'utf8')).includes('profileVisualForUserV2(u,52)'),'login account card must render each account showroomLoadoutV2 through the common user renderer');

console.log('showroom image catalog tests: PASS');
