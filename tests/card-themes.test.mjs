import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CARD_THEME_ITEMS } from '../js/showroom-card-themes.js';
import { PORTRAIT_FRAME_ITEMS_V7 } from '../js/showroom-portrait-frames-v7.js';
import { SHOWROOM_CATALOG_V2 } from '../js/showroom-catalog-v2.js';
import { applyCardV2 } from '../js/showroom-v2.js';

assert.equal(CARD_THEME_ITEMS.length,20);
assert.deepEqual(CARD_THEME_ITEMS.map(item=>item.rarity),[...Array(5).fill('uncommon'),...Array(5).fill('rare'),...Array(5).fill('epic'),...Array(5).fill('legendary')]);
assert.equal(SHOWROOM_CATALOG_V2.filter(item => item.category === 'card_theme').length,20);
for(const item of CARD_THEME_ITEMS){assert.equal(item.testOnly,true);assert.equal(item.purchasable,false);assert.equal(item.persistable,false)}
assert.equal(PORTRAIT_FRAME_ITEMS_V7.length,20);
assert.deepEqual(PORTRAIT_FRAME_ITEMS_V7.map(item=>item.rarity),[
  ...Array(5).fill('uncommon'),...Array(5).fill('rare'),...Array(5).fill('epic'),...Array(5).fill('legendary'),
]);
assert.deepEqual(PORTRAIT_FRAME_ITEMS_V7.map(item=>item.price),[
  ...Array(5).fill(180),...Array(5).fill(360),...Array(5).fill(590),...Array(5).fill(900),
]);

let removed = false;
const profile = {
  dataset: { cardTheme: 'retired-theme' },
  querySelectorAll: selector => selector.includes('card-theme-frame') ? [{ remove(){ removed = true; } }] : [],
  removeAttribute(name){ delete this.dataset[name.replace(/^data-/,'').replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]; },
};
const card = { matches: () => false, querySelector: () => profile };
assert.equal(applyCardV2(card,{ card_theme:'ct4_legendary_frozen_crown' }),false);
assert.equal(removed,true,'retired theme art must be stripped from an already-rendered header');

const compare = await readFile(new URL('../compare.html',import.meta.url),'utf8');
const showroom = await readFile(new URL('../dressroom.html',import.meta.url),'utf8');
const css=await readFile(new URL('../css/showroom-card-themes.css',import.meta.url),'utf8');
const baseCss=await readFile(new URL('../css/style.css',import.meta.url),'utf8');
for(const token of ['grid-template-columns:repeat(7,30px)','grid-template-rows:repeat(2,30px)','justify-content:right','direction:rtl'])assert.ok(css.includes(token),token);
for(const token of ['.sr-profile-head[data-card-theme] .sr-profile-markers{display:grid','min-width:100%;justify-self:stretch!important','.cmp-profile[data-card-theme] .cmp-markers{display:grid'])assert.ok((showroom+compare).includes(token),token);
for(const token of ['.v2-profile-compact .v2-profile-art{inset:8%','.v2-profile-showcase .v2-profile-art{inset:2%','.v2-profile-showcase .v2-profile-art>.v3-profile-emoji{object-fit:contain;transform:none'])assert.ok(baseCss.includes(token),token);

const sw = await readFile(new URL('../sw.js',import.meta.url),'utf8');
assert.ok(sw.includes('weight-v113-expanded-ambient-fx'));
for(const item of CARD_THEME_ITEMS)assert.ok(sw.includes(item.asset),item.id);
for(const item of PORTRAIT_FRAME_ITEMS_V7)assert.ok(sw.includes(item.asset),item.id);

console.log('retired card theme and V7 portrait frame tests: PASS');
