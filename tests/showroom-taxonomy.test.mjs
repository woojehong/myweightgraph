import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ALL_CATALOG_V2, RARITY_DISPLAY_ORDER, compareShowroomRarityV2 } from '../js/showroom-v2.js';
import {
  SHOWROOM_SOURCE_CATEGORIES,
  SHOWROOM_MOTIFS,
  SHOWROOM_FULL_SET_CATEGORIES,
  RETIRED_SHOWROOM_ITEM_IDS,
  showroomFullSets,
} from '../js/showroom-taxonomy.js';
import { SHOWROOM_FULLSET_ITEMS_V13 } from '../js/showroom-fullsets-v13.js';

assert.deepEqual(Object.keys(SHOWROOM_SOURCE_CATEGORIES),['wow','marvel','kbo','three_kingdoms','other']);
assert.deepEqual(SHOWROOM_FULL_SET_CATEGORIES,[
  'graph_skin','card_theme','ambient_effect','line_style','profile_emoji','emoji_border','point_marker',
]);
assert.deepEqual(RARITY_DISPLAY_ORDER,[
  'artifact','legendary','transcendent','mythic','epic','rare','uncommon','common',
]);
const raritySortFixture=[
  {id:'u',name:'고급',rarity:'uncommon'},
  {id:'m',name:'신화',rarity:'mythic'},
  {id:'a',name:'유물',rarity:'artifact'},
  {id:'e',name:'영웅',rarity:'epic'},
].sort(compareShowroomRarityV2);
assert.deepEqual(raritySortFixture.map(item=>item.rarity),['artifact','mythic','epic','uncommon']);

const expectedNames={
  arthas:'리치 왕',jaina:'대제독',illidan:'배신자',sylvanas:'밴시 여왕',
  garrosh:'대족장',medivh:'수호자',azshara:'여왕',kaelthas:'태양왕',
  iron_man:'강철 인간',thor:'천둥의 신',captain_america:'미국 대장',
  scarlet_witch:'진홍 마녀',doosan_main:'철웅이',doosan_sub:'망곰이',
  lg_main:'럭키 & 스타',lg_sub:'루피',
};
for(const [id,name] of Object.entries(expectedNames)){
  assert.equal(SHOWROOM_MOTIFS[id].displayName,name,id);
  assert.equal(SHOWROOM_MOTIFS[id].fullSet,true,id);
}
assert.equal(Object.values(SHOWROOM_MOTIFS).filter(entry=>entry.fullSet).length,16);
assert.equal(SHOWROOM_MOTIFS.kia.displayName,'호걸이');
assert.equal(SHOWROOM_MOTIFS.hanwha.displayName,'수리');
assert.equal(SHOWROOM_MOTIFS.zhuge_liang.displayName,'와룡');

for(const id of RETIRED_SHOWROOM_ITEM_IDS){
  assert.equal(ALL_CATALOG_V2.some(item=>item.id===id),false,`${id} must remain retired`);
}
for(const item of ALL_CATALOG_V2){
  assert.ok(SHOWROOM_SOURCE_CATEGORIES[item.sourceCategory],`${item.id}: invalid source category`);
  if(item.setId)assert.ok(item.motifName,`${item.id}: set item needs a display motif`);
}

const sets=showroomFullSets(ALL_CATALOG_V2);
assert.equal(sets.length,16);
assert.equal(SHOWROOM_FULLSET_ITEMS_V13.length,38,'the approved full-set completion pack must remain intact');
for(const set of sets){
  assert.equal(set.total,7,set.id);
  assert.equal(set.filled,7,`${set.id}: every approved preset category must now have an item`);
  assert.deepEqual(Object.keys(set.categoryMap),SHOWROOM_FULL_SET_CATEGORIES,set.id);
  assert.ok(set.items.every(item=>item.setId===set.setId),set.id);
}

const showroom=await readFile(new URL('../dressroom.html',import.meta.url),'utf8');
for(const token of [
  'id="viewItems"','id="viewSets"','아이템별','세트 장착',
  'id="ownershipFilters"','id="rarityFilters"','id="sourceFilters"',
  '보유','미보유',"['common','uncommon','rare','epic','mythic','transcendent','legendary','artifact']",
  'SHOWROOM_SOURCE_CATEGORIES','showroomFullSets','renderSetGrid','sr-set-grid',
  'data-apply-set','세트 전체 미리보기','원클릭 전체 미리보기',
  "for(const cat of SHOWROOM_FULL_SET_CATEGORIES)","draft[cat]=item?.id||null",
  "const canonicalItems=SHOWROOM_FULL_SET_CATEGORIES.map(cat=>set.presetMap[cat]).filter(Boolean)",
  "const applied=SHOWROOM_FULL_SET_CATEGORIES.every(cat=>draft[cat]===(set.presetMap[cat]?.id||null))",
  '공식 구성품','추가 구매 없음',
  '.sort(compareShowroomRarityV2)',
])assert.ok(showroom.includes(token),token);
assert.ok(showroom.includes('빈 범주는 기본으로 미리보기'));
assert.ok(showroom.includes('세트 미리보기 · 기본'));
assert.equal(showroom.includes('data-apply-set="${set.setId}" disabled'),false,'incomplete sets must remain clickable');
assert.equal(showroom.includes('id="rarity"'),false,'legacy rarity dropdown must be removed');
assert.equal(showroom.includes('id="ownership"'),false,'legacy ownership dropdown must be removed');
assert.equal(showroom.includes('id="setFilters"'),false,'sets must be one-click loadout presets, not filter chips');
assert.equal(showroom.includes('data-set-item'),false,'set parts must not be applied one by one');

const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
assert.ok(sw.includes("'./js/showroom-taxonomy.js'"));
assert.equal(sw.includes("'./assets/showroom-v8/profile_emoji/pe_r_roaring_tiger_general.webp'"),false);

console.log('showroom taxonomy and filter tests: PASS');
