import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

import { CARD_THEME_ITEMS } from '../js/showroom-card-themes.js';
import { SHOWROOM_CATALOG_V2 } from '../js/showroom-catalog-v2.js';
import { applyCardV2, renderCatalogPreviewV2 } from '../js/showroom-v2.js';

const expectedPrices = { uncommon: 600, rare: 1200, epic: 2400, legendary: 4800 };
assert.equal(CARD_THEME_ITEMS.length, 12);
assert.deepEqual(
  CARD_THEME_ITEMS.map(item => item.rarity),
  ['uncommon', 'rare', 'epic', 'legendary'].flatMap(rarity => Array(3).fill(rarity)),
);
assert.deepEqual(
  SHOWROOM_CATALOG_V2.filter(item => item.category === 'card_theme').map(item => item.id),
  CARD_THEME_ITEMS.map(item => item.id),
);

function paeth(a, b, c) {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

function decodeRgbaPng(bytes) {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  let offset = 8, width, height, bitDepth, colorType;
  const idat = [];
  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.subarray(offset + 4, offset + 8).toString('ascii');
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    offset += 12 + length;
    if (type === 'IEND') break;
  }
  assert.equal(bitDepth, 8); assert.equal(colorType, 6);
  const packed = inflateSync(Buffer.concat(idat)), stride = width * 4, rgba = Buffer.alloc(stride * height);
  let sourceOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = packed[sourceOffset++];
    for (let x = 0; x < stride; x += 1) {
      const raw = packed[sourceOffset++], left = x >= 4 ? rgba[y * stride + x - 4] : 0;
      const up = y ? rgba[(y - 1) * stride + x] : 0;
      const upperLeft = y && x >= 4 ? rgba[(y - 1) * stride + x - 4] : 0;
      const value = filter === 0 ? raw
        : filter === 1 ? raw + left
        : filter === 2 ? raw + up
        : filter === 3 ? raw + Math.floor((left + up) / 2)
        : filter === 4 ? raw + paeth(left, up, upperLeft)
        : NaN;
      assert.ok(Number.isFinite(value), `unsupported PNG filter ${filter}`);
      rgba[y * stride + x] = value & 255;
    }
  }
  return { width, height, rgba };
}

for (const item of CARD_THEME_ITEMS) {
  assert.equal(item.price, expectedPrices[item.rarity], item.id);
  assert.equal(item.testOnly, false, item.id);
  assert.equal(item.purchasable, true, item.id);
  assert.equal(item.persistable, true, item.id);
  assert.match(item.pairedGraphSkin, /^gs_v4_(uncommon|rare|epic|legendary)_0[1-3]$/);
  assert.ok(item.typography.family && item.typography.effect && item.typography.weight, item.id);
  assert.deepEqual(Object.keys(item.cardAssets), ['header', 'max', 'min', 'current']);
  assert.ok(renderCatalogPreviewV2(item).includes('v4-card-theme-preview'), item.id);

  for (const [part, asset] of Object.entries(item.cardAssets)) {
    const bytes = await readFile(new URL(`../${asset.replace(/^\.\//, '')}`, import.meta.url));
    const { width, height, rgba } = decodeRgbaPng(bytes);
    assert.ok(width >= (part === 'header' ? 1600 : 380), `${item.id}:${part}: width`);
    assert.ok(height >= 280, `${item.id}:${part}: height`);
    let transparent = 0, visible = 0, chroma = 0, centerTransparent = 0, centerTotal = 0;
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4, r = rgba[index], g = rgba[index + 1], b = rgba[index + 2], a = rgba[index + 3];
      if (a === 0) transparent += 1;
      if (a > 24) { visible += 1; if (r > 190 && b > 190 && g < 70) chroma += 1; }
      if (x > width * .3 && x < width * .7 && y > height * .3 && y < height * .7) {
        centerTotal += 1; if (a < 12) centerTransparent += 1;
      }
    }
    assert.ok(transparent / (width * height) > .45, `${item.id}:${part}: transparent background`);
    assert.ok(centerTransparent / centerTotal > .72, `${item.id}:${part}: transparent content hole`);
    assert.ok(chroma / Math.max(1, visible) < .01, `${item.id}:${part}: chroma spill`);
  }
}

function removable(container, node) {
  node.remove = () => { const index = container.indexOf(node); if (index >= 0) container.splice(index, 1); };
  return node;
}
const headerFrames = [];
const badgeNodes = Object.fromEntries(['max', 'min', 'cur'].map(kind => {
  const children = [];
  return [kind, {
    children,
    prepend(node) { children.unshift(removable(children, node)); },
  }];
}));
const profile = {
  dataset: {},
  querySelectorAll(selector) {
    if (selector.includes(':scope > .v3-card-theme-frame')) return [...headerFrames];
    if (selector.includes('.mk > .v4-card-badge-frame')) return Object.values(badgeNodes).flatMap(node => node.children);
    return [];
  },
  querySelector(selector) {
    if (selector === '.mk-max') return badgeNodes.max;
    if (selector === '.mk-min') return badgeNodes.min;
    if (selector === '.mk-cur') return badgeNodes.cur;
    return null;
  },
  removeAttribute(name) {
    const key = name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()); delete this.dataset[key.replace(/^data/, '').replace(/^./, c => c.toLowerCase())];
  },
  prepend(node) { headerFrames.unshift(removable(headerFrames, node)); },
};
const card = { matches: () => false, querySelector: selector => selector.includes('.cmp-profile') ? profile : null };
const previousDocument = globalThis.document;
globalThis.document = { createElement: tag => ({ tagName: tag.toUpperCase(), setAttribute(name, value) { this[name] = value; } }) };
try {
  const selected = CARD_THEME_ITEMS.at(-1);
  assert.equal(applyCardV2(card, { card_theme: selected.id }), true);
  assert.equal(headerFrames.length, 1);
  assert.equal(headerFrames[0].className, 'v4-card-theme-frame');
  assert.equal(headerFrames[0].src, selected.cardAssets.header);
  assert.equal(profile.dataset.cardTheme, selected.id);
  assert.equal(profile.dataset.cardRarity, 'legendary');
  assert.equal(profile.dataset.cardEffect, selected.typography.effect);
  assert.deepEqual(Object.values(badgeNodes).map(node => node.children.length), [1, 1, 1]);
  assert.equal(badgeNodes.max.children[0].src, selected.cardAssets.max);
  assert.equal(badgeNodes.min.children[0].src, selected.cardAssets.min);
  assert.equal(badgeNodes.cur.children[0].src, selected.cardAssets.current);
  assert.equal(applyCardV2(card, { card_theme: selected.id }), true);
  assert.equal(headerFrames.length, 1, 'reapplying a theme replaces the frame');
  assert.deepEqual(Object.values(badgeNodes).map(node => node.children.length), [1, 1, 1]);
} finally {
  if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
}

const compare = await readFile(new URL('../compare.html', import.meta.url), 'utf8');
const showroom = await readFile(new URL('../dressroom.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../css/showroom-card-themes.css', import.meta.url), 'utf8');
const sw = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
for (const html of [compare, showroom]) assert.ok(html.includes('css/showroom-card-themes.css'));
for (const token of ['previewMarkers()', 'sr-profile-markers', "badge('mk-max','최고'", "badge('mk-min','최저'", "badge('mk-cur','현재'"]) assert.ok(showroom.includes(token), token);
for (const token of ['.v4-card-theme-frame', '.v4-card-badge-frame', '[data-card-theme]', 'prefers-reduced-motion']) assert.ok(css.includes(token), token);
assert.ok(compare.includes('.cmp-profile{ display:flex; align-items:center; gap:9px; margin-bottom:8px; padding:0 6px; flex-wrap:nowrap; }'));
assert.ok(compare.includes('.cmp-info{ display:flex; flex:1 1 auto; overflow:hidden; flex-direction:row;'));
assert.equal(compare.includes('<span class="cmp-score">'), false, 'score must not crowd the one-line identity header');
assert.ok(showroom.includes('.sr-profile-copy{display:flex;flex:1 1 auto;overflow:hidden;flex-direction:row;'));
assert.ok(css.includes('background:transparent!important'), 'theme art must not be covered by an opaque badge fill');
assert.equal(css.includes('filter:brightness(1.35)'), false, 'legendary typography animation must remain readable');
for (const item of CARD_THEME_ITEMS) for (const asset of Object.values(item.cardAssets)) assert.ok(sw.includes(`'${asset}'`), asset);
assert.ok(sw.includes("'./css/showroom-card-themes.css'"));
assert.ok(sw.includes("'./js/showroom-card-themes.js'"));

console.log('card theme coupling tests: PASS');
