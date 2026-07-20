import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SHOWROOM_CATALOG_V2, SHOWROOM_CATEGORIES, SHOWROOM_DEFAULTS, assertShowroomCatalogV2 } from '../js/showroom-catalog-v2.js';
import { TITLES_CATALOG_V2, TITLE_RARITY_COLORS } from '../js/titles-catalog-v2.js';
import { ACHIEVEMENTS } from '../js/achievements.js';
import { ACHIEVEMENT_ITEM_REWARDS_V2 } from '../js/achievement-item-rewards-v2.js';
import { ALL_CATALOG_V2, V2_CATEGORIES, normalizeLoadoutV2, getCatalogItemV2,
  ownedItemIdsV2, unownedSelectionV2, renderEmojiBorderV2, getChartDecorationsV2,
  renderCompanionV2,renderTrophyV2,renderMarkerV2,renderProfileEmojiV2,renderAmbientV2,renderCatalogPreviewV2 } from '../js/showroom-v2.js';

assert.equal(assertShowroomCatalogV2(),true);
assert.equal(SHOWROOM_CATALOG_V2.length,218);
assert.equal(TITLES_CATALOG_V2.length,30);
assert.equal(ALL_CATALOG_V2.length,248);
assert.deepEqual(SHOWROOM_CATEGORIES,['graph_skin','card_theme','point_marker','companion','ambient_effect','trophy','profile_emoji','emoji_border']);
assert.deepEqual(V2_CATEGORIES,[...SHOWROOM_CATEGORIES,'title']);
assert.equal(new Set(ALL_CATALOG_V2.map(item=>item.id)).size,248);
assert.equal(new Set(SHOWROOM_CATALOG_V2.map(item=>item.implKey)).size,218);
const rarityExpected={common:8,uncommon:7,rare:6,epic:5,legendary:4};
for(const category of V2_CATEGORIES){const items=ALL_CATALOG_V2.filter(item=>item.category===category),expected=category==='companion'?8:30;assert.equal(items.length,expected,category);for(const [rarity,count] of Object.entries(rarityExpected))assert.equal(items.filter(item=>item.rarity===rarity).length,category==='companion'?(rarity==='common'?8:0):count,`${category}:${rarity}`)}
assert.deepEqual(TITLE_RARITY_COLORS,{common:'#FFFFFF',uncommon:'#1EFF00',rare:'#0070DD',epic:'#A335EE',legendary:'#FF8000'});
for(const item of ALL_CATALOG_V2){assert.match(item.id,/^[a-z0-9_]+$/);assert.ok(Number.isFinite(item.price)&&item.price>=200);}

const invalid=normalizeLoadoutV2({graph_skin:'old_border_1',title:'legacy title',trophy:['tr_wood_medal','bad','tr_wood_medal','tr_iron_badge','tr_copper_cup','tr_scout_pin','tr_leaf_wreath']});
assert.equal(invalid.graph_skin,SHOWROOM_DEFAULTS.graph_skin);assert.equal(invalid.title,null);assert.deepEqual(invalid.trophy,['tr_wood_medal','tr_iron_badge','tr_copper_cup','tr_scout_pin']);
const user={purchasedItemsV2:['gs_slate_lines'],achievementRewardItems:['ct_emerald_lodge'],adminGrantedItems:['title_dawn_watch']};
assert.deepEqual(SHOWROOM_DEFAULTS,{graph_skin:null,card_theme:null,point_marker:null,companion:null,ambient_effect:null,trophy:[],profile_emoji:null,emoji_border:null});
assert.equal(ownedItemIdsV2({}).size,0);assert.deepEqual(getChartDecorationsV2(SHOWROOM_DEFAULTS),{});
for(const forbidden of ['gs_ink_grid','ct_dark_canvas','pm_ring','cp_firefly','ae_dust','pe_squire','eb_rope_knot'])assert.equal(Object.values(SHOWROOM_DEFAULTS).flat().includes(forbidden),false);
assert.deepEqual(unownedSelectionV2(user,{...SHOWROOM_DEFAULTS,graph_skin:'gs_slate_lines',title:'title_dawn_watch',companion:'cp_scroll'}).map(i=>i.id),['cp_scroll']);
const borderSvgs=SHOWROOM_CATALOG_V2.filter(i=>i.category==='emoji_border').map((item,index)=>{const svg=renderEmojiBorderV2(item.id);assert.ok(svg.includes(`data-variant="${index}"`));assert.ok(svg.includes(`data-layout="${item.implKey}"`));return svg.replace(/stroke="[^"]+"/g,'').replace(/style="[^"]+"/g,'')});
assert.equal(new Set(borderSvgs).size,30,'all border layout signatures must be unique');
for(const [category,render] of [['companion',renderCompanionV2],['trophy',renderTrophyV2],['point_marker',renderMarkerV2],['profile_emoji',renderProfileEmojiV2]]){const signatures=SHOWROOM_CATALOG_V2.filter(i=>i.category===category).map(i=>render(i.id).replace(/hsl\([^)]*\)/g,'COLOR').replace(/fill="#[^"]+"/g,'')),expected=category==='companion'?8:30;assert.equal(new Set(signatures).size,expected,`${category} structural signatures`)}
const ambientSignatures=SHOWROOM_CATALOG_V2.filter(i=>i.category==='ambient_effect').map(i=>renderAmbientV2(i.id).replace(/hsl\([^)]*\)/g,'COLOR').replace(/--ambient-h:\d+/g,''));assert.ok(new Set(ambientSignatures).size>=15);
const signatureBorders=['eb_astral_portal','eb_frost_spikes','eb_ember_chain','eb_arcane_orbit','eb_primordial_serpent','eb_abyss_tentacles','eb_clockwork_dial','eb_worldroot_arch','eb_drake_wings','eb_dawn_throne'];
const signatureAmbients=['ae_wind','ae_astral','ae_gold_sand','ae_void','ae_abyss','ae_thunder','ae_rune','ae_crystal','ae_dust','ae_dawn_blessing'];
assert.equal(new Set(signatureBorders.map(id=>renderEmojiBorderV2(id).match(/data-signature="([^"]+)"/)?.[1])).size,10);
assert.equal(new Set(signatureAmbients.map(id=>renderAmbientV2(id).match(/data-signature="([^"]+)"/)?.[1])).size,10);
for(const id of [...signatureBorders,...signatureAmbients])assert.ok(getCatalogItemV2(id),id);
const requiredBorderParts=[['left-door','orbit-outer'],['ice-spikes','ice-crystal'],['chain-links','padlock'],['orbit-a','rune-n'],['dragon-one','dragon-two'],['tentacle-one','rear-eye'],['octagonal-plate','gear'],['root-left','leaf-right'],['left-wing','right-wing'],['throne-seat','crown']];
signatureBorders.forEach((id,i)=>{const html=renderEmojiBorderV2(id);for(const part of requiredBorderParts[i])assert.ok(html.includes(`data-part="${part}"`),`${id}:${part}`);assert.equal(html.includes('fill="#000'),false,id)});
const requiredAmbientParts=[['slash-one','cut-surface'],['clock-arc','reverse-arrow'],['chest-base','vertical-light'],['rift-main','rift-left'],['water-one','creature-shadow'],['record-high','bolt-two'],['left-page','geometry'],['glass-frame','glass-shards'],['fragment-triangle','up-arrows'],['light-column','halo']];
signatureAmbients.forEach((id,i)=>{const html=renderAmbientV2(id);for(const part of requiredAmbientParts[i])assert.ok(html.includes(`data-part="${part}"`),`${id}:${part}`);assert.equal(html.includes('<i '),false,id);assert.ok(html.includes('fill="none"'),id)});
assert.ok(renderAmbientV2('ae_wind').includes('data-state="sequence"'));
const restCss=await readFile(new URL('../css/rest-state.css',import.meta.url),'utf8');assert.ok(restCss.includes('[data-state="rest"]'));assert.ok(restCss.includes('animation-fill-mode:forwards'));
const lab=await readFile(new URL('../visual-lab.html',import.meta.url),'utf8');for(const id of [...signatureBorders,...signatureAmbients])assert.ok(lab.includes(id),`lab:${id}`);assert.ok(lab.includes('renderEmojiBorderV2'));assert.ok(lab.includes('renderAmbientV2'));assert.equal(lab.includes('firebase'),false);
const signatureCss=await readFile(new URL('../css/signature-v2.css',import.meta.url),'utf8');assert.equal((signatureCss.match(/@keyframes /g)||[]).length,20);assert.ok(signatureCss.includes('prefers-reduced-motion'));
const policyCss=await readFile(new URL('../css/signature-policy.css',import.meta.url),'utf8');assert.ok(policyCss.includes('animation-iteration-count:1'));
const graphFamilies=new Set(SHOWROOM_CATALOG_V2.filter(i=>i.category==='graph_skin').map(i=>getChartDecorationsV2({graph_skin:i.id}).graphFamily));assert.equal(graphFamilies.size,15);
const cardFamilies=new Set(SHOWROOM_CATALOG_V2.filter(i=>i.category==='card_theme').map(i=>renderCatalogPreviewV2(i).match(/data-family="(\d+)"/)?.[1]));assert.equal(cardFamilies.size,15);
assert.ok(getChartDecorationsV2({point_marker:'pm_dawn_relic'}).markerIndex>=0);

const achIds=new Set(ACHIEVEMENTS.map(a=>a.id));assert.ok(Object.keys(ACHIEVEMENT_ITEM_REWARDS_V2).length>=10);
for(const [achId,ids] of Object.entries(ACHIEVEMENT_ITEM_REWARDS_V2)){assert.ok(achIds.has(achId),achId);for(const id of ids)assert.ok(getCatalogItemV2(id),`${achId}:${id}`)}

const pageNames=['input.html','dashboard.html','compare.html','achievements.html','import.html'];
const labels=['데이터 입력','내 그래프','우리 그래프','업적','쇼룸'];
for(const name of pageNames){const html=await readFile(new URL(`../${name}`,import.meta.url),'utf8');const pos=labels.map(label=>html.indexOf(`label:'${label}'`)>=0?html.indexOf(`label:'${label}'`):html.indexOf(`label: '${label}'`));assert.ok(pos.every(n=>n>=0),name);assert.deepEqual([...pos].sort((a,b)=>a-b),pos,name);assert.equal(html.includes("label:'상점'"),false,name)}
const showroom=await readFile(new URL('../dressroom.html',import.meta.url),'utf8');assert.ok(showroom.includes('purchaseCatalogItemsV2'));assert.ok(showroom.includes('saveShowroomLoadoutV2'));assert.ok(showroom.includes('현재 조합 일괄 구매'));assert.ok(showroom.includes('unownedSelectionV2'));
for(const label of ['기본 그래프','기본 카드','기본 포인트','동반자 없음','효과 없음','트로피 전시 안 함','기본 이모티콘(⚖️)','테두리 없음','칭호 없음'])assert.ok(showroom.includes(label),`missing synthetic default: ${label}`);
assert.ok(showroom.includes("draft.trophy=[]"));assert.ok(showroom.includes("draft[category]=null"));assert.ok(showroom.includes("o==='unowned'"));assert.ok(showroom.includes('defaultCard()+filtered()'));
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
