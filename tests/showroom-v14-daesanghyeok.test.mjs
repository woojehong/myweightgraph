import assert from 'node:assert/strict';
import { SHOWROOM_CATALOG_V2, showroomPriceOf } from '../js/showroom-catalog-v2.js';
import { DAESANGHYEOK_SET_ITEM_IDS, SHOWROOM_FULLSET_ITEMS_V14 } from '../js/showroom-fullsets-v14.js';
import { AMBIENT_FX_IDS, LINE_FX_IDS, showroomFxPlugin } from '../js/showroom-fx.js';
import {
  ALL_CATALOG_V2, RARITY_META, compareShowroomRarityV2, getCatalogItemV2,
  normalizeLoadoutV2, renderAmbientV2, renderCatalogPreviewV2, renderProfileEmojiV2,
  unownedSelectionV2, validateCatalogPurchaseV2, applyCardV2,
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

const fullSet=showroomFullSets(ALL_CATALOG_V2).find(set=>set.id==='daesanghyeok');
assert.ok(fullSet);
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
const border=getCatalogItemV2('eb14_l_daesanghyeok_hall');
assert.equal(border.asset,'./assets/showroom-v14/daesanghyeok/portrait_frame.webp');
const marker=getCatalogItemV2('pm14_l_daesanghyeok_crown');
assert.deepEqual(marker.markerAssets,{
  high:'./assets/showroom-v14/daesanghyeok/marker_high.webp',
  low:'./assets/showroom-v14/daesanghyeok/marker_low.webp',
});

assert.ok(LINE_FX_IDS.includes('ls14_l_daesanghyeok_legacy'));
assert.ok(AMBIENT_FX_IDS.includes('ae14_l_daesanghyeok_dynasty'));
assert.ok(renderAmbientV2('ae14_l_daesanghyeok_dynasty').includes('v14-ambient-preview'));
assert.ok(renderCatalogPreviewV2(getCatalogItemV2('ls14_l_daesanghyeok_legacy')).includes('ls14_l_daesanghyeok_legacy'));

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
  data:{datasets:[{label:'실제 체중',borderColor:'#35e0c1',borderWidth:3.4}]},
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
const fakeProfile={
  dataset:{},
  style:{setProperty:(key,value)=>variables.set(key,value),removeProperty:key=>variables.delete(key)},
  querySelectorAll:()=>[],querySelector:()=>null,removeAttribute(){},prepend(){},
};
const previousDocument=globalThis.document;
globalThis.document={createElement:()=>({className:'',src:'',alt:'',setAttribute(){}})};
try{
  assert.equal(applyCardV2({matches:()=>false,querySelector:()=>fakeProfile},{card_theme:card.id}),true);
  assert.equal(variables.get('--ct-accent'),card.cssTheme.accent);
  assert.equal(variables.get('--ct-panel'),card.cssTheme.panel);
}finally{
  if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument;
}

console.log('showroom V14 대상혁 legendary set tests: PASS');
