import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SHOWROOM_CATALOG_V2, SHOWROOM_CATEGORIES, SHOWROOM_DEFAULTS, assertShowroomCatalogV2 } from '../js/showroom-catalog-v2.js';
import { TITLES_CATALOG_V2, TITLE_RARITY_COLORS } from '../js/titles-catalog-v2.js';
import { ACHIEVEMENTS } from '../js/achievements.js';
import { ACHIEVEMENT_ITEM_REWARDS_V2 } from '../js/achievement-item-rewards-v2.js';
import { ALL_CATALOG_V2, V2_CATEGORIES, normalizeLoadoutV2, getCatalogItemV2,
  ownedItemIdsV2, unownedSelectionV2, renderEmojiBorderV2, getChartDecorationsV2 } from '../js/showroom-v2.js';

assert.equal(assertShowroomCatalogV2(),true);
assert.equal(SHOWROOM_CATALOG_V2.length,240);
assert.equal(TITLES_CATALOG_V2.length,30);
assert.equal(ALL_CATALOG_V2.length,270);
assert.deepEqual(SHOWROOM_CATEGORIES,['graph_skin','card_theme','point_marker','companion','ambient_effect','trophy','profile_emoji','emoji_border']);
assert.deepEqual(V2_CATEGORIES,[...SHOWROOM_CATEGORIES,'title']);
assert.equal(new Set(ALL_CATALOG_V2.map(item=>item.id)).size,270);
assert.equal(new Set(SHOWROOM_CATALOG_V2.map(item=>item.implKey)).size,240);
const rarityExpected={common:8,uncommon:7,rare:6,epic:5,legendary:4};
for(const category of V2_CATEGORIES){const items=ALL_CATALOG_V2.filter(item=>item.category===category);assert.equal(items.length,30,category);for(const [rarity,count] of Object.entries(rarityExpected))assert.equal(items.filter(item=>item.rarity===rarity).length,count,`${category}:${rarity}`)}
assert.deepEqual(TITLE_RARITY_COLORS,{common:'#FFFFFF',uncommon:'#1EFF00',rare:'#0070DD',epic:'#A335EE',legendary:'#FF8000'});
for(const item of ALL_CATALOG_V2){assert.match(item.id,/^[a-z0-9_]+$/);assert.ok(Number.isFinite(item.price)&&item.price>=200);}

const invalid=normalizeLoadoutV2({graph_skin:'old_border_1',title:'legacy title',trophy:['tr_wood_medal','bad','tr_wood_medal','tr_iron_badge','tr_copper_cup','tr_scout_pin','tr_leaf_wreath']});
assert.equal(invalid.graph_skin,SHOWROOM_DEFAULTS.graph_skin);assert.equal(invalid.title,null);assert.deepEqual(invalid.trophy,['tr_wood_medal','tr_iron_badge','tr_copper_cup','tr_scout_pin']);
const user={purchasedItemsV2:['gs_slate_lines'],achievementRewardItems:['ct_emerald_lodge'],adminGrantedItems:['title_dawn_watch']};
assert.ok(ownedItemIdsV2(user).has(SHOWROOM_DEFAULTS.profile_emoji));
assert.deepEqual(unownedSelectionV2(user,{...SHOWROOM_DEFAULTS,graph_skin:'gs_slate_lines',title:'title_dawn_watch',companion:'cp_scroll'}).map(i=>i.id),['cp_scroll']);
const borderSvgs=SHOWROOM_CATALOG_V2.filter(i=>i.category==='emoji_border').map((item,index)=>{const svg=renderEmojiBorderV2(item.id);assert.ok(svg.includes(`data-variant="${index}"`));assert.ok(svg.includes(`data-layout="${item.implKey}"`));return svg.replace(/stroke="[^"]+"/g,'').replace(/style="[^"]+"/g,'')});
assert.equal(new Set(borderSvgs).size,30,'all border layout signatures must be unique');
assert.ok(getChartDecorationsV2({point_marker:'pm_dawn_relic'}).markerIndex>=0);

const achIds=new Set(ACHIEVEMENTS.map(a=>a.id));assert.ok(Object.keys(ACHIEVEMENT_ITEM_REWARDS_V2).length>=10);
for(const [achId,ids] of Object.entries(ACHIEVEMENT_ITEM_REWARDS_V2)){assert.ok(achIds.has(achId),achId);for(const id of ids)assert.ok(getCatalogItemV2(id),`${achId}:${id}`)}

const pageNames=['input.html','dashboard.html','compare.html','achievements.html','import.html'];
const labels=['데이터 입력','내 그래프','우리 그래프','업적','쇼룸'];
for(const name of pageNames){const html=await readFile(new URL(`../${name}`,import.meta.url),'utf8');const pos=labels.map(label=>html.indexOf(`label:'${label}'`)>=0?html.indexOf(`label:'${label}'`):html.indexOf(`label: '${label}'`));assert.ok(pos.every(n=>n>=0),name);assert.deepEqual([...pos].sort((a,b)=>a-b),pos,name);assert.equal(html.includes("label:'상점'"),false,name)}
const showroom=await readFile(new URL('../dressroom.html',import.meta.url),'utf8');assert.ok(showroom.includes('purchaseCatalogItemsV2'));assert.ok(showroom.includes('saveShowroomLoadoutV2'));assert.ok(showroom.includes('현재 조합 일괄 구매'));assert.ok(showroom.includes('unownedSelectionV2'));
assert.ok(showroom.includes('구매 확인'));assert.ok(showroom.includes('처리 중…'));assert.ok(showroom.includes("acquisition!=='achievement_only'"));
const shop=await readFile(new URL('../shop.html',import.meta.url),'utf8');assert.ok(shop.includes("location.replace('dressroom.html'+q)"));
const dashboard=await readFile(new URL('../dashboard.html',import.meta.url),'utf8');assert.equal(dashboard.includes('chartDecorations:'),false);
const compare=await readFile(new URL('../compare.html',import.meta.url),'utf8');assert.ok(compare.includes('decoratePlotV2'));assert.ok(compare.includes('getChartDecorationsV2'));
const chart=await readFile(new URL('../js/chart-render.js',import.meta.url),'utf8');assert.equal((chart.match(/dot\(ctx,/g)||[]).length-1,3);assert.equal(chart.includes('record_stamp'),false);assert.equal(chart.includes('stampStyle'),false);assert.ok(chart.includes('markerHits'));
const db=await readFile(new URL('../js/db.js',import.meta.url),'utf8');assert.ok(db.includes('purchaseCatalogItemsV2'));assert.ok(db.includes('runTransaction'));assert.ok(db.includes('adminSetCatalogOwnershipV2'));assert.ok(db.includes('adminGrantedItems'));
assert.ok(db.includes("acquisition==='achievement_only'"));
const admin=await readFile(new URL('../admin.html',import.meta.url),'utf8');for(const term of ['admSkinSearch','admSkinCategory','admSkinRarity','admSkinOwn','adminBulkSkin','adminToggleSkin'])assert.ok(admin.includes(term),term);
for(const file of ['dressroom.html','compare.html','js/showroom-v2.js','js/chart-render.js']){const text=await readFile(new URL(`../${file}`,import.meta.url),'utf8');assert.equal(text.includes('record_stamp'),false,file)}
console.log('showroom V2 tests: PASS');
