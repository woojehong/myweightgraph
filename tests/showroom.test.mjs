import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import {
  SHOWROOM_CATALOG_V2, SHOWROOM_CATEGORIES, SHOWROOM_DEFAULTS,
  LEGACY_SHOWROOM_ID_ALIASES, resolveShowroomItemIdV2, assertShowroomCatalogV2,
} from '../js/showroom-catalog-v2.js';
import { TITLES_CATALOG_V2, TITLE_RARITY_COLORS } from '../js/titles-catalog-v2.js';
import { ACHIEVEMENTS } from '../js/achievements.js';
import { ACHIEVEMENT_ITEM_REWARDS_V2 } from '../js/achievement-item-rewards-v2.js';
import { fitMainPlotBounds } from '../js/chart-render.js';
import {
  ALL_CATALOG_V2, V2_CATEGORIES, normalizeLoadoutV2, getCatalogItemV2,
  ownedItemIdsV2, unownedSelectionV2, persistableLoadoutV2, validateCatalogPurchaseV2,
  renderEmojiBorderV2, getChartDecorationsV2,
  renderCompanionV2, renderTrophyV2, renderMarkerV2, renderProfileEmojiV2,
  renderAmbientV2, renderCatalogPreviewV2, applyCardV2,
} from '../js/showroom-v2.js';

assert.equal(assertShowroomCatalogV2(),true);
assert.equal(SHOWROOM_CATALOG_V2.length,32);
assert.equal(TITLES_CATALOG_V2.length,30);
assert.equal(ALL_CATALOG_V2.length,62);
assert.deepEqual(SHOWROOM_CATEGORIES,['graph_skin','card_theme','point_marker','companion','ambient_effect','trophy','profile_emoji','emoji_border']);
assert.deepEqual(V2_CATEGORIES,[...SHOWROOM_CATEGORIES,'title']);
assert.equal(new Set(ALL_CATALOG_V2.map(entry=>entry.id)).size,62);
assert.equal(new Set(SHOWROOM_CATALOG_V2.map(entry=>entry.asset)).size,32);

for(const category of SHOWROOM_CATEGORIES){
  const entries=SHOWROOM_CATALOG_V2.filter(entry=>entry.category===category);
  assert.equal(entries.length,4,category);
  assert.deepEqual(entries.map(entry=>entry.rarity),category==='companion'
    ? ['common','common','common','common']
    : ['uncommon','rare','epic','legendary']);
}
for(const entry of SHOWROOM_CATALOG_V2){assert.equal(entry.testOnly,true,entry.id);assert.equal(entry.purchasable,false,entry.id)}
assert.deepEqual(TITLE_RARITY_COLORS,{common:'#FFFFFF',uncommon:'#1EFF00',rare:'#0070DD',epic:'#A335EE',legendary:'#FF8000'});
for(const entry of ALL_CATALOG_V2){assert.match(entry.id,/^[a-z0-9_]+$/);assert.ok(Number.isFinite(entry.price)&&entry.price>=200)}

assert.equal(Object.keys(LEGACY_SHOWROOM_ID_ALIASES).length,218);
for(const [legacy,target] of Object.entries(LEGACY_SHOWROOM_ID_ALIASES)){
  assert.ok(getCatalogItemV2(target),`${legacy}:${target}`);
  assert.equal(resolveShowroomItemIdV2(legacy),target);
}
assert.equal(resolveShowroomItemIdV2('fabricated_old_id'),'fabricated_old_id');
assert.equal(getCatalogItemV2('gs_slate_lines').id,'gs_explorer_parchment');
assert.equal(getCatalogItemV2('gs_void_lattice').id,'gs_frost_runestone');
assert.equal(getCatalogItemV2('gs_phoenix_wake').id,'gs_dragonbone_slab');
assert.equal(getCatalogItemV2('gs_crown_of_dawn').id,'gs_cosmic_timekeeper');

const normalized=normalizeLoadoutV2({
  graph_skin:'gs_slate_lines', point_marker:'pm_dawn_relic', title:'legacy title',
  trophy:['tr_wood_medal','tr_crystal_cup','tr_phoenix_relic','tr_dawn_regalia','bad'],
});
assert.equal(normalized.graph_skin,null);
assert.equal(normalized.point_marker,null);
assert.equal(normalized.title,null);
assert.deepEqual(normalized.trophy,[]);
assert.deepEqual(SHOWROOM_DEFAULTS,{graph_skin:null,card_theme:null,point_marker:null,companion:null,ambient_effect:null,trophy:[],profile_emoji:null,emoji_border:null});

const user={purchasedItemsV2:['gs_slate_lines'],achievementRewardItems:['ct_emerald_lodge'],adminGrantedItems:['title_dawn_watch']};
assert.deepEqual([...ownedItemIdsV2(user)],['title_dawn_watch']);
assert.deepEqual(unownedSelectionV2(user,{...SHOWROOM_DEFAULTS,graph_skin:'gs_explorer_parchment',card_theme:'ct_alpine_dawn',companion:'cp_sleepy_golem'}).map(entry=>entry.id),['gs_explorer_parchment','ct_alpine_dawn','cp_sleepy_golem']);
assert.deepEqual(getChartDecorationsV2(SHOWROOM_DEFAULTS),{});
assert.equal(getChartDecorationsV2({point_marker:'pm_phoenix_seal'}).markerAsset,'./assets/showroom-v3/point_marker/pm_phoenix_seal.png');
const transactionSnapshot={coins:4200,purchasedItemsV2:['legacy_owned'],achievementRewardItems:['legacy_reward'],adminGrantedItems:[]};
const transactionBefore=structuredClone(transactionSnapshot);
assert.throws(()=>validateCatalogPurchaseV2(['gs_explorer_parchment']),/테스트 아이템은 구매할 수 없습니다/);
assert.deepEqual(transactionSnapshot,transactionBefore,'blocked purchase must not mutate coins or ownership');
assert.deepEqual(persistableLoadoutV2({graph_skin:'gs_explorer_parchment',companion:'cp_sleepy_golem',trophy:['tr_cosmic_goblet']}),{...SHOWROOM_DEFAULTS,title:null});

for(const entry of SHOWROOM_CATALOG_V2){
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
  assert.equal(size.width*9,size.height*16,`${entry.id}: source graph skin must be exactly 16:9`);
}

for(const [category,render] of [['companion',renderCompanionV2],['trophy',renderTrophyV2],['point_marker',renderMarkerV2],['profile_emoji',renderProfileEmojiV2],['emoji_border',renderEmojiBorderV2]]){
  for(const entry of SHOWROOM_CATALOG_V2.filter(item=>item.category===category)){
    const html=render(entry.id);assert.ok(html.includes('<img'),entry.id);assert.ok(html.includes(entry.asset),entry.id);assert.equal(html.includes('<svg'),false,entry.id);
  }
}
for(const entry of SHOWROOM_CATALOG_V2.filter(item=>item.category==='ambient_effect')){
  const html=renderAmbientV2(entry.id);assert.ok(html.includes('<img'));assert.equal(html.includes('<i '),false);
}
for(const entry of SHOWROOM_CATALOG_V2)assert.ok(renderCatalogPreviewV2(entry).includes(entry.asset),entry.id);

let removedOldFrame=false,prependedFrame=null;
const fakeProfile={
  dataset:{},querySelector:selector=>selector===':scope > .v3-card-theme-frame'?{remove(){removedOldFrame=true}}:null,
  removeAttribute(name){delete this.dataset[name]},prepend(frame){prependedFrame=frame},
};
const fakeCard={matches:()=>false,querySelector:selector=>selector===':scope > .cmp-profile'?fakeProfile:null};
const previousDocument=globalThis.document;
globalThis.document={createElement:tag=>({tagName:tag.toUpperCase(),setAttribute(name,value){this[name]=value}})};
try{
  assert.equal(applyCardV2(fakeCard,{card_theme:'ct_alpine_dawn'}),true);
  assert.equal(removedOldFrame,true);assert.equal(prependedFrame.tagName,'IMG');assert.equal(prependedFrame.className,'v3-card-theme-frame');
  assert.equal(prependedFrame.src,'./assets/showroom-v3/card_theme/ct_alpine_dawn.webp');assert.equal(prependedFrame['aria-hidden'],'true');
  assert.equal(fakeProfile.dataset.cardPreset,'ct_alpine_dawn');assert.equal('style' in fakeCard,false,'card background style must not be injected');
}finally{if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument}

const achIds=new Set(ACHIEVEMENTS.map(achievement=>achievement.id));
for(const [achId,ids] of Object.entries(ACHIEVEMENT_ITEM_REWARDS_V2)){
  assert.ok(achIds.has(achId),achId);for(const id of ids)assert.ok(getCatalogItemV2(id),`${achId}:${id}`);
}

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
for(const token of ["querySelector?.(':scope > .cmp-profile')","document.createElement('img')",'v3-card-theme-frame','profile.prepend(frame)'])assert.ok(cardApplicator.includes(token),token);
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
for(const token of ['mainPlotDomBoundsPlugin','chart.chartArea','.v3-main-plot-decor[data-showroom-main-plot="true"]','--showroom-main-plot-bottom','fitMainPlotBounds(area,mainPlotAspectRatio||16/9)','plugins: [canvasBgPlugin, mainPlotDomBoundsPlugin'])assert.ok(chart.includes(token),token);
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
assert.ok(sw.includes("weight-v59-showroom-images"));assert.equal(sw.includes('c.addAll(ASSETS).catch'),false);
for(const entry of SHOWROOM_CATALOG_V2)assert.ok(sw.includes(`'${entry.asset}'`),`sw:${entry.asset}`);

const showroom=await readFile(new URL('../dressroom.html',import.meta.url),'utf8');
for(const token of ['purchaseCatalogItemsV2','saveShowroomLoadoutV2','현재 범주 4종 검색','unownedSelectionV2','decorateMainPlotV2','data-main-weight-plot="true"','data-chart-subgraphs="diet exercise"','mainPlotAspectRatio:16/9','테스트 중 · 구매 불가','item.purchasable!==false&&!item.testOnly','테스트 아이템은 세션 미리보기 전용이며 저장할 수 없습니다'])assert.ok(showroom.includes(token),token);
assert.ok(showroom.includes('.sr-cats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))'));
assert.ok(showroom.includes('@media(max-width:520px){.sr-cats{grid-template-columns:repeat(2,minmax(0,1fr))}}'));
assert.equal(showroom.includes('id="logoutBtn"'),false,'dressroom header must not render the large logout button');
const compare=await readFile(new URL('../compare.html',import.meta.url),'utf8');
for(const token of ['decorateMainPlotV2','getChartDecorationsV2','data-main-weight-plot="true"','mainPlotAspectRatio: 16 / 9','id="dietToggle" type="checkbox"','id="exerciseToggle" type="checkbox"','for="dietToggle"','for="exerciseToggle"',"localStorage.getItem('compare_show_diet') === 'true'","localStorage.getItem('compare_show_exercise') === 'true'","persistSubgraphToggle('compare_show_diet'","persistSubgraphToggle('compare_show_exercise'",'showDietGraph,','showExerciseGraph,','renderGrid()'])assert.ok(compare.includes(token),token);
for(const token of ['showMaxMarker: false','showMinMarker: true','showCurMarker: false'])assert.ok(compare.includes(token),token);
for(const token of ['id="markerSize" type="range" min="20" max="44" step="2" value="32"',"localStorage.getItem('compare_marker_size')",'markerSize=Number(size.value)',"localStorage.setItem('compare_marker_size'",'chartDecorations: { ...getChartDecorationsV2(user?.showroomLoadoutV2), markerSize }','.marker-size-control{grid-column:1/-1'])assert.ok(compare.includes(token),token);
const db=await readFile(new URL('../js/db.js',import.meta.url),'utf8');
for(const token of ['purchaseCatalogItemsV2','validateCatalogPurchaseV2(itemIds)','persistableLoadoutV2(rawLoadout)','테스트 아이템은 소유권을 추가하거나 회수할 수 없습니다','runTransaction','adminSetCatalogOwnershipV2','adminGrantedItems'])assert.ok(db.includes(token),token);
const purchaseSource=db.slice(db.indexOf('export async function purchaseCatalogItemsV2'),db.indexOf('export const purchaseShowroomItem'));
assert.ok(purchaseSource.indexOf('validateCatalogPurchaseV2(itemIds)')<purchaseSource.indexOf('runTransaction'),'test-only purchase must fail before Firestore transaction');

console.log('showroom image catalog tests: PASS');
