import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SHOWROOM_CATALOG_V2, showroomPriceOf } from '../js/showroom-catalog-v2.js';
import { DAESANGHYEOK_SET_ITEM_IDS, SHOWROOM_FULLSET_ITEMS_V14 } from '../js/showroom-fullsets-v14.js';
import {
  AMBIENT_FX_IDS, LINE_FX_IDS, showroomFxPlugin,
  LEGENDARY_AMBIENT_STAR_COUNT_V14, legendaryPerimeterStarsV14,
} from '../js/showroom-fx.js';
import {
  ALL_CATALOG_V2, RARITY_META, compareShowroomRarityV2, getCatalogItemV2,
  normalizeLoadoutV2, renderAmbientV2, renderCatalogPreviewV2, renderProfileEmojiV2,
  profileVisualV2, unownedSelectionV2, validateCatalogPurchaseV2, applyCardV2,
} from '../js/showroom-v2.js';
import {
  SHOWROOM_MOTIFS, SHOWROOM_SOURCE_CATEGORIES, showroomFullSets,
} from '../js/showroom-taxonomy.js';

const expectedIds=[
  'gs14_l_daesanghyeok_stage','ct14_l_daesanghyeok_goat',
  'ae14_l_daesanghyeok_dynasty','ls14_l_daesanghyeok_legacy',
  'pe14_l_daesanghyeok','eb14_l_daesanghyeok_hall','pm14_l_daesanghyeok_crown',
];
assert.deepEqual(DAESANGHYEOK_SET_ITEM_IDS,expectedIds);
assert.deepEqual(SHOWROOM_FULLSET_ITEMS_V14.map(item=>item.id),expectedIds);
assert.ok(SHOWROOM_FULLSET_ITEMS_V14.every(item=>item.rarity==='legendary'&&item.purchasable&&!item.testOnly));
assert.equal(RARITY_META.legendary.label,'전설');
assert.equal(RARITY_META.legendary.color,'#FFD166');
assert.deepEqual([
  {id:'mythic',name:'신화',rarity:'mythic'},
  {id:'legendary',name:'전설',rarity:'legendary'},
].sort(compareShowroomRarityV2).map(item=>item.rarity),['legendary','mythic']);

assert.equal(SHOWROOM_SOURCE_CATEGORIES.esports.label,'e스포츠');
assert.equal(SHOWROOM_MOTIFS.daesanghyeok.displayName,'대상혁');
assert.equal(SHOWROOM_MOTIFS.daesanghyeok.sourceCategory,'esports');
assert.equal(SHOWROOM_MOTIFS.daesanghyeok.fullSet,true);

const catalogItems=expectedIds.map(getCatalogItemV2);
assert.ok(catalogItems.every(Boolean));
assert.ok(catalogItems.every(item=>item.rarity==='legendary'&&item.sourceCategory==='esports'));
assert.deepEqual(validateCatalogPurchaseV2(expectedIds).map(item=>item.id),expectedIds);
assert.equal(SHOWROOM_CATALOG_V2.filter(item=>item.rarity==='legendary').length,7,'only the first V14 full set is true legendary');

const categoryPrices={
  graph_skin:3900,card_theme:2860,ambient_effect:3900,line_style:2860,
  profile_emoji:1560,emoji_border:1170,point_marker:1430,
};
for(const item of catalogItems){
  assert.equal(item.price,categoryPrices[item.category],item.id);
  assert.equal(item.price,showroomPriceOf(item.category,'legendary'),item.id);
  assert.equal(item.price,showroomPriceOf(item.category,'mythic')*1.3,item.id);
}
assert.equal(catalogItems.reduce((sum,item)=>sum+item.price,0),17680);
assert.ok(17680<2992*6,'the complete legendary set stays below six perfect first-month reward cycles');

const fullSets=showroomFullSets(ALL_CATALOG_V2);
const fullSet=fullSets.find(set=>set.id==='daesanghyeok');
assert.ok(fullSet);
assert.equal(fullSets[0].id,'daesanghyeok','the only legendary full set must lead the set list');
assert.equal(fullSet.rarity,'legendary');
assert.equal(fullSet.displayName,'대상혁');
assert.equal(fullSet.filled,7);
assert.deepEqual(Object.values(fullSet.presetMap).map(item=>item.id),expectedIds);
assert.equal(fullSet.items.some(item=>item.category==='trophy'),false);
const loadout=normalizeLoadoutV2(Object.fromEntries(Object.entries(fullSet.presetMap).map(([category,item])=>[category,item.id])));
assert.deepEqual(unownedSelectionV2({purchasedItemsV2:[]},loadout).map(item=>item.id).sort(),[...expectedIds].sort());
assert.equal(unownedSelectionV2({purchasedItemsV2:expectedIds},loadout).length,0);

const graph=getCatalogItemV2('gs14_l_daesanghyeok_stage');
assert.equal(graph.asset,'./assets/showroom-v14/daesanghyeok/graph_skin.webp');
const card=getCatalogItemV2('ct14_l_daesanghyeok_goat');
assert.equal(card.cardAssets.header,'./assets/showroom-v14/daesanghyeok/card_theme.webp');
assert.equal(card.logoAsset,'./assets/showroom-v14/daesanghyeok/t1_logo.svg');
assert.equal(card.cardAssets.max,undefined,'stat badges intentionally fall back to the CSS theme');
assert.deepEqual(Object.keys(card.cssTheme),['accent','panel','edge','shadow']);
const portrait=getCatalogItemV2('pe14_l_daesanghyeok');
assert.equal(portrait.portraitAssets.full,'./assets/showroom-v14/daesanghyeok/portrait_full.webp');
assert.equal(portrait.portraitAssets.bust,'./assets/showroom-v14/daesanghyeok/portrait_bust.webp');
assert.ok(renderProfileEmojiV2(portrait.id,64,'🙂','full').includes(portrait.portraitAssets.full));
assert.ok(renderProfileEmojiV2(portrait.id,64,'🙂','bust').includes(portrait.portraitAssets.bust));
const animatedProfile=profileVisualV2({profile_emoji:portrait.id,portraitMode:'full'},116,'🙂','showcase');
assert.ok(animatedProfile.includes('v14-daesanghyeok-profile'));
assert.ok(animatedProfile.includes('data-profile-id="pe14_l_daesanghyeok"'));
const border=getCatalogItemV2('eb14_l_daesanghyeok_hall');
assert.equal(border.asset,'./assets/showroom-v14/daesanghyeok/portrait_frame.webp');
const marker=getCatalogItemV2('pm14_l_daesanghyeok_crown');
assert.deepEqual(marker.markerAssets,{
  high:'./assets/showroom-v14/daesanghyeok/marker_high.webp',
  low:'./assets/showroom-v14/daesanghyeok/marker_low.webp',
});

assert.ok(LINE_FX_IDS.includes('ls14_l_daesanghyeok_legacy'));
assert.ok(AMBIENT_FX_IDS.includes('ae14_l_daesanghyeok_dynasty'));
const ambientPreview=renderAmbientV2('ae14_l_daesanghyeok_dynasty');
assert.ok(ambientPreview.includes('v14-ambient-preview'));
assert.ok(ambientPreview.includes('ambient_dynasty_hall.webp'));
assert.ok(ambientPreview.includes('ambient_six_star_crown.webp'));
assert.equal((ambientPreview.match(/<i style="--i:/g)||[]).length,6,'the preview must expose exactly six championship stars');
assert.ok(renderCatalogPreviewV2(getCatalogItemV2('ls14_l_daesanghyeok_legacy')).includes('ls14_l_daesanghyeok_legacy'));
assert.equal(LEGENDARY_AMBIENT_STAR_COUNT_V14,6);
const starArea={left:0,top:0,right:640,bottom:360};
const perimeterStars=legendaryPerimeterStarsV14(starArea,0);
assert.equal(perimeterStars.length,6);
assert.ok(perimeterStars.every(star=>star.x===18||star.x===622||star.y===18||star.y===342),'every legendary star must stay on the graph perimeter');
assert.equal(new Set(perimeterStars.map(star=>star.phase)).size,6,'the six stars must have evenly separated traversal phases');
assert.notDeepEqual(legendaryPerimeterStarsV14(starArea,5).map(({x,y})=>[x,y]),perimeterStars.map(({x,y})=>[x,y]),'the perimeter stars must traverse over time');

const drawCalls={};
const gradient={addColorStop(){}};
const canvasContext=new Proxy({}, {
  get(_target,key){
    if(key==='createLinearGradient'||key==='createRadialGradient')return()=>gradient;
    return(..._args)=>{drawCalls[key]=(drawCalls[key]||0)+1;};
  },
  set(target,key,value){target[key]=value;return true;},
});
const chart={
  ctx:canvasContext,chartArea:{left:0,top:0,right:640,bottom:360},
  data:{datasets:[{label:'실제 체중',borderColor:'#e2012d',borderWidth:3.4}]},
  getDatasetMeta:()=>({data:[{x:40,y:180},{x:160,y:130},{x:280,y:210},{x:420,y:110},{x:590,y:160}]}),
};
const previousWindow=globalThis.window;
globalThis.window={matchMedia:()=>({matches:true})};
try{
  assert.doesNotThrow(()=>showroomFxPlugin.beforeDatasetsDraw(chart,null,{ambientFx:'ae14_l_daesanghyeok_dynasty'}));
  assert.doesNotThrow(()=>showroomFxPlugin.afterDatasetsDraw(chart,null,{lineFx:'ls14_l_daesanghyeok_legacy'}));
  assert.ok((drawCalls.stroke||0)>=4,'legendary line renderer must execute its layered strokes');
  assert.ok((drawCalls.fill||0)>=5,'legendary ambient and line renderers must execute visible particles and emblems');
}finally{
  if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;
}

const variables=new Map();
const createdElements=[];
const fakeProfile={
  dataset:{},
  style:{setProperty:(key,value)=>variables.set(key,value),removeProperty:key=>variables.delete(key)},
  querySelectorAll:()=>[],querySelector:()=>null,removeAttribute(){},prepend(){},
};
const previousDocument=globalThis.document;
globalThis.document={createElement:tag=>{
  const properties=new Map(),attributes=new Map();
  const element={tagName:String(tag).toUpperCase(),className:'',src:'',alt:'',style:{setProperty:(key,value)=>properties.set(key,value)},setAttribute:(key,value)=>attributes.set(key,value),properties,attributes};
  createdElements.push(element);return element;
}};
try{
  assert.equal(applyCardV2({matches:()=>false,querySelector:()=>fakeProfile},{card_theme:card.id}),true);
  assert.equal(variables.get('--ct-accent'),card.cssTheme.accent);
  assert.equal(variables.get('--ct-panel'),card.cssTheme.panel);
  const logo=createdElements.find(element=>element.className.includes('v14-card-theme-logo'));
  assert.ok(logo);
  assert.equal(logo.tagName,'SPAN');
  assert.ok(logo.className.includes('t1-logo-red'));
  assert.equal(logo.attributes.get('aria-label'),'T1');
  assert.ok(logo.properties.get('--v14-card-logo').includes('t1_logo.svg'));
}finally{
  if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument;
}

const baseCss=await readFile(new URL('../css/style.css',import.meta.url),'utf8');
for(const token of [
  '.v14-daesanghyeok-profile .v2-profile-art{animation:v14DaesanghyeokFloat',
  '.v14-daesanghyeok-profile .v3-profile-emoji{animation:v14DaesanghyeokBreathe',
  '@keyframes v14DaesanghyeokStarOrbit',
  '.v14-daesanghyeok-profile:hover .v3-profile-emoji',
  '@media(prefers-reduced-motion:reduce){.v14-daesanghyeok-profile',
])assert.ok(baseCss.includes(token),token);
for(const assetName of ['ambient_dynasty_hall.webp','ambient_six_star_crown.webp']){
  const asset=await readFile(new URL(`../assets/showroom-v14/daesanghyeok/${assetName}`,import.meta.url));
  assert.equal(asset.subarray(0,4).toString('ascii'),'RIFF',`${assetName} must be a WebP asset`);
  assert.ok(asset.length>250000,`${assetName} must retain production-quality raster detail`);
}
const fxSource=await readFile(new URL('../js/showroom-fx.js',import.meta.url),'utf8');
for(const token of ['v14DrawDynastyArt','ambient_dynasty_hall','ambient_six_star_crown','cycle=((t%12)+12)%12'])assert.ok(fxSource.includes(token),token);
const serviceWorker=await readFile(new URL('../sw.js',import.meta.url),'utf8');
for(const token of ['weight-v146-trophy-rail-24','ambient_dynasty_hall.webp','ambient_six_star_crown.webp'])assert.ok(serviceWorker.includes(token),token);
const cardCss=await readFile(new URL('../css/showroom-card-themes.css',import.meta.url),'utf8');
for(const token of ['t1-logo-red','background:#e2012d','mask:var(--v14-card-logo)','not(.v14-card-theme-logo)','data-card-theme="ct14_l_daesanghyeok_goat"','object-position:left center'])assert.ok(cardCss.includes(token),token);

console.log('showroom V14 대상혁 legendary set tests: PASS');
