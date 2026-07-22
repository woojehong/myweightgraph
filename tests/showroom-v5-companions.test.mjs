import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';
import { COMPANION_ITEMS_V5, COMPANION_V5_TIER_SPECS } from '../js/showroom-companions-v5.js';
import { SHOWROOM_CATALOG_V2, SHOWROOM_DEFAULTS, resolveShowroomItemIdV2 } from '../js/showroom-catalog-v2.js';
import {
  getCatalogItemV2, ownedItemIdsV2, persistableLoadoutV2,
  renderCompanionV2, validateCatalogPurchaseV2,
} from '../js/showroom-v2.js';

const existingCompanions = Object.freeze({
  cp_sleepy_golem: ['cp_sleepy_golem.png', 'c1dd20ef8cb4b802d3e0bc5f8924891f2b994a3f84b4d30cfe17c2de0aac5760'],
  cp_candle_wisp: ['cp_candle_wisp.png', '4e0f420486325f1d047db1fd3cd5af042fb45203bf4ee10fa3034f7b9edf4210'],
  cp_satchel_mimic: ['cp_satchel_mimic.png', '06e0090aab3ccf3a6d2173560050d456f252fe234913d943779c2b6766d82241'],
  cp_lantern_moth: ['cp_lantern_moth.png', 'f7f120cab30adcade76f8fcaf1c634290dd73c7b59179d89750eb39aa5cd2fde'],
});

for (const [id, [filename, expectedHash]] of Object.entries(existingCompanions)) {
  const entry = getCatalogItemV2(id);
  assert.equal(entry?.id, id, `${id}: released identity must not be replaced or aliased`);
  assert.equal(entry.asset, `./assets/showroom-v3/companion/${filename}`);
  const bytes = await readFile(new URL(`../assets/showroom-v3/companion/${filename}`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), expectedHash, `${id}: released asset changed`);
}

assert.deepEqual(Object.keys(COMPANION_V5_TIER_SPECS), ['uncommon', 'rare', 'epic', 'legendary']);
assert.equal(COMPANION_V5_TIER_SPECS.uncommon.length, 10);
assert.equal(COMPANION_V5_TIER_SPECS.rare.length, 10);
assert.equal(COMPANION_V5_TIER_SPECS.epic.length, 10);
assert.equal(COMPANION_V5_TIER_SPECS.legendary.length, 10);
assert.deepEqual(COMPANION_ITEMS_V5.map(item => item.id), [
  ...Array.from({ length: 10 }, (_, index) => `cp_u${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 10 }, (_, index) => `cp_r${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 10 }, (_, index) => `cp_e${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 10 }, (_, index) => `cp_l${String(index + 1).padStart(2, '0')}`),
]);
assert.equal(SHOWROOM_CATALOG_V2.filter(item => item.category === 'companion').length, 44, 'V5 companions must append to the four released companions');

function paeth(a, b, c) {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

function decodeRgbaPng(bytes) {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  let offset = 8, width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0;
  const idat = [];
  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset), type = bytes.subarray(offset + 4, offset + 8).toString();
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9]; interlace = data[12];
    } else if (type === 'IDAT') idat.push(data);
    offset += 12 + length;
    if (type === 'IEND') break;
  }
  assert.deepEqual({ width, height, bitDepth, colorType, interlace }, { width: 1024, height: 1024, bitDepth: 8, colorType: 6, interlace: 0 });
  const packed = inflateSync(Buffer.concat(idat)), stride = width * 4, rgba = Buffer.alloc(stride * height);
  let sourceOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = packed[sourceOffset++], row = packed.subarray(sourceOffset, sourceOffset + stride);
    sourceOffset += stride;
    for (let x = 0; x < stride; x += 1) {
      const left = x >= 4 ? rgba[y * stride + x - 4] : 0;
      const up = y ? rgba[(y - 1) * stride + x] : 0;
      const upLeft = y && x >= 4 ? rgba[(y - 1) * stride + x - 4] : 0;
      const predictor = filter === 0 ? 0 : filter === 1 ? left : filter === 2 ? up
        : filter === 3 ? Math.floor((left + up) / 2) : filter === 4 ? paeth(left, up, upLeft) : NaN;
      assert.ok(Number.isFinite(predictor), `unsupported PNG filter ${filter}`);
      rgba[y * stride + x] = (row[x] + predictor) & 255;
    }
  }
  return { width, height, rgba };
}

for (const entry of COMPANION_ITEMS_V5) {
  const isRare = entry.id.startsWith('cp_r');
  const isEpic = entry.id.startsWith('cp_e');
  const isLegendary = entry.id.startsWith('cp_l');
  assert.equal(resolveShowroomItemIdV2(entry.id), entry.id, `${entry.id}: new identity must not be aliased`);
  assert.equal(getCatalogItemV2(entry.id)?.id, entry.id);
  assert.equal(entry.rarity, isLegendary ? 'legendary' : isEpic ? 'epic' : isRare ? 'rare' : 'uncommon');
  assert.equal(entry.price, isLegendary ? 3600 : isEpic ? 1800 : isRare ? 750 : 300);
  assert.equal(entry.testOnly, false);
  assert.equal(entry.purchasable, true);
  assert.equal(entry.persistable, true);
  assert.equal(renderCompanionV2(entry.id).includes(entry.asset), true);

  const bytes = await readFile(new URL(`../${entry.asset.replace(/^\.\//, '')}`, import.meta.url));
  const { width, height, rgba } = decodeRgbaPng(bytes);
  let visible = 0, partial = 0, magenta = 0, minX = width, minY = height, maxX = -1, maxY = -1;
  const silhouette64 = new Set();
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const index = (y * width + x) * 4, alpha = rgba[index + 3];
    if (alpha > 0) partial += alpha < 255 ? 1 : 0;
    if (alpha > 32) {
      visible += 1; minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      silhouette64.add(`${Math.floor(x / 16)},${Math.floor(y / 16)}`);
      if (rgba[index] > 180 && rgba[index + 2] > 180 && rgba[index + 1] < 100) magenta += 1;
    }
  }
  assert.deepEqual([rgba[3], rgba[(width - 1) * 4 + 3], rgba[((height - 1) * width) * 4 + 3], rgba[(width * height - 1) * 4 + 3]], [0, 0, 0, 0], `${entry.id}: corners must be transparent`);
  assert.ok(visible > width * height * 0.1 && visible < width * height * 0.55, `${entry.id}: implausible subject coverage`);
  assert.ok(partial > 1000, `${entry.id}: antialiased alpha edge is missing`);
  assert.ok(minX >= 24 && minY >= 24 && maxX <= width - 25 && maxY <= height - 25, `${entry.id}: silhouette needs canvas padding`);
  assert.ok(maxX - minX >= width * 0.4 && maxY - minY >= height * 0.4, `${entry.id}: silhouette is too small`);
  assert.ok(silhouette64.size >= 350, `${entry.id}: silhouette is not legible at 64px`);
  if (entry.id === 'cp_r08') assert.ok(magenta < visible * 0.08, `${entry.id}: intentional star trail must stay isolated`);
  else assert.ok(magenta <= 1, `${entry.id}: chroma-key fringe remains`);
}

assert.deepEqual(validateCatalogPurchaseV2(['cp_u01']).map(item => [item.id, item.price]), [['cp_u01', 300]]);
assert.deepEqual(validateCatalogPurchaseV2(['cp_r01']).map(item => [item.id, item.price]), [['cp_r01', 750]]);
assert.deepEqual(validateCatalogPurchaseV2(['cp_e01']).map(item => [item.id, item.price]), [['cp_e01', 1800]]);
assert.deepEqual(validateCatalogPurchaseV2(['cp_l01']).map(item => [item.id, item.price]), [['cp_l01', 3600]]);
assert.equal(persistableLoadoutV2({ ...SHOWROOM_DEFAULTS, companion: 'cp_r10' }).companion, 'cp_r10');
assert.deepEqual([...ownedItemIdsV2({ purchasedItemsV2: ['cp_u03'] })], ['cp_u03']);

const sw = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
assert.ok(sw.includes("'./js/showroom-companions-v5.js'"));
for (const entry of COMPANION_ITEMS_V5) assert.ok(sw.includes(`'${entry.asset}'`), `sw:${entry.id}`);

console.log('showroom V5 companion additive tests: PASS');
