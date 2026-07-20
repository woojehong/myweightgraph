import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  SHOWROOM_CATEGORIES,
  SHOWROOM_ITEMS,
  normalizeShowroomLoadout,
  unownedLoadoutItems,
  getShowroomItem,
} from '../js/showroom-data.js';
import { getChartDecorations } from '../js/showroom-style.js';

assert.equal(SHOWROOM_CATEGORIES.length, 7);
assert.equal(SHOWROOM_ITEMS.filter(item => item.id).length, 28);
for (const category of SHOWROOM_CATEGORIES) {
  assert.equal(SHOWROOM_ITEMS.filter(item => item.category === category.id && item.id).length, 4);
  assert.equal(SHOWROOM_ITEMS.filter(item => item.category === category.id && item.id === null).length, 1);
}

const expectedPrices = {
  gs_mint_grid:450, gs_sunset_duo:700, gs_midnight_neon:1100, gs_aurora_prism:1800,
  ct_snow_paper:350, ct_dusk_glass:650, ct_cosmic_mesh:1000, ct_obsidian_gold:1600,
  pm_halo_ring:200, pm_blue_diamond:350, pm_gold_star:600, pm_comet_gem:950,
  rs_flag:250, rs_spark:450, rs_crown:700, rs_meteor:1100,
  cp_sprout:450, cp_cloud:800, cp_moon_cat:1300, cp_tiny_dragon:2100,
  ae_soft_glow:500, ae_firefly:900, ae_stardust:1400, ae_aurora:2300,
  tr_copper_leaf:250, tr_blue_orbit:500, tr_gold_comet:800, tr_prism_crown:1200,
};
for (const [id, price] of Object.entries(expectedPrices)) assert.equal(getShowroomItem(id)?.price, price, id);

const normalized = normalizeShowroomLoadout({
  graph_skin:'invalid_graph', card_theme:'ct_dusk_glass', point_marker:'tr_gold_comet',
  trophy:['tr_copper_leaf','invalid','tr_copper_leaf','tr_blue_orbit','tr_gold_comet','tr_prism_crown','tr_copper_leaf'],
});
assert.equal(normalized.graph_skin, null);
assert.equal(normalized.card_theme, 'ct_dusk_glass');
assert.equal(normalized.point_marker, null);
assert.deepEqual(normalized.trophy, ['tr_copper_leaf','tr_blue_orbit','tr_gold_comet','tr_prism_crown']);
assert.equal(getChartDecorations({ graph_skin:'bad', point_marker:'bad', record_stamp:'bad' }).pointStyle, 'circle');

const unowned = unownedLoadoutItems(
  { purchasedShowroomItems:['ct_dusk_glass'] },
  { card_theme:'ct_dusk_glass', companion:'cp_cloud', trophy:['tr_blue_orbit'] },
);
assert.deepEqual(unowned.map(item => item.id), ['cp_cloud','tr_blue_orbit']);

const mediumCombo = ['gs_mint_grid','ct_snow_paper','pm_blue_diamond','rs_spark','cp_sprout','ae_soft_glow','tr_copper_leaf'];
assert.ok(mediumCombo.reduce((sum,id)=>sum+getShowroomItem(id).price,0) <= 3000);

const pages = ['input.html','dashboard.html','compare.html','achievements.html','dressroom.html','shop.html','import.html'];
const navLabels = ['데이터 입력','내 그래프','우리 그래프','업적','쇼룸','상점'];
for (const page of pages) {
  const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
  const positions = navLabels.map(label => html.indexOf(`label:'${label}'`) >= 0
    ? html.indexOf(`label:'${label}'`)
    : html.indexOf(`label: '${label}'`));
  assert.ok(positions.every(position => position >= 0), `${page}: six navigation labels`);
  assert.deepEqual([...positions].sort((a,b)=>a-b), positions, `${page}: navigation order`);
  assert.equal(html.includes('모아보기'), false, `${page}: retired compare label`);
  assert.equal(html.includes('드레스룸'), false, `${page}: retired showroom label`);
}

const dashboard = await readFile(new URL('../dashboard.html', import.meta.url), 'utf8');
const compare = await readFile(new URL('../compare.html', import.meta.url), 'utf8');
const showroom = await readFile(new URL('../dressroom.html', import.meta.url), 'utf8');
const shop = await readFile(new URL('../shop.html', import.meta.url), 'utf8');
assert.equal(dashboard.includes('chartDecorations'), false, 'dashboard must never apply showroom decoration');
assert.ok(compare.includes('mainPlotAspectRatio: 16 / 9'));
assert.ok(compare.includes('applyShowroomStyle'));
assert.ok(showroom.includes("renderChart(records,user,canvas"));
assert.ok(showroom.includes('unownedLoadoutItems'));
assert.ok(shop.includes('purchaseShowroomItem(uid,id)'));

console.log('showroom tests: PASS');
