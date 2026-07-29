import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { ALL_CATALOG_V2 } from '../js/showroom-v2.js';
import {
  SHOWROOM_FULL_SET_CATEGORIES,
  showroomFullSets,
} from '../js/showroom-taxonomy.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const inspected = [];

function webpSize(buffer) {
  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }
  if (chunk === 'VP8L') {
    const b1 = buffer[21];
    const b2 = buffer[22];
    const b3 = buffer[23];
    const b4 = buffer[24];
    return {
      width: 1 + (((b2 & 0x3f) << 8) | b1),
      height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)),
    };
  }
  const signature = buffer.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
  if (signature >= 0) {
    return {
      width: buffer.readUInt16LE(signature + 3) & 0x3fff,
      height: buffer.readUInt16LE(signature + 5) & 0x3fff,
    };
  }
  throw new Error(`지원하지 않는 WebP 청크: ${chunk}`);
}

function jpegSize(buffer) {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }
    offset += 2 + length;
  }
  throw new Error('JPEG 크기 청크를 찾을 수 없습니다.');
}

function imageSize(buffer) {
  if (buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return webpSize(buffer);
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return jpegSize(buffer);
  throw new Error('지원하지 않는 이미지 형식입니다.');
}

const expected = {
  graph_skin: { ratio: 16 / 9, tolerance: 0.025 },
  card_theme: { ratio: 4.2, tolerance: 0.12 },
  profile_emoji: { ratio: 1, tolerance: 0.035 },
  emoji_border: { ratio: 1, tolerance: 0.035 },
  point_marker: { ratio: 1, tolerance: 0.035 },
};

for (const item of ALL_CATALOG_V2) {
  if (!item.asset || !expected[item.category]) continue;
  const source = path.resolve(root, item.asset.replace(/^\.\//, ''));
  try {
    const { width, height } = imageSize(await readFile(source));
    const ratio = height ? width / height : 0;
    const rule = expected[item.category];
    const delta = Math.abs(ratio - rule.ratio);
    if (!width || !height) {
      errors.push(`${item.id}: 이미지 크기를 읽을 수 없습니다.`);
    } else if (delta > rule.tolerance) {
      errors.push(
        `${item.id}: ${item.category} 비율 ${ratio.toFixed(3)} `
        + `(기준 ${rule.ratio.toFixed(3)})`,
      );
    }
    inspected.push({
      id: item.id,
      category: item.category,
      width,
      height,
      ratio: Number(ratio.toFixed(3)),
    });
  } catch (error) {
    errors.push(`${item.id}: 이미지 분석 실패 (${error.message})`);
  }
}

for (const set of showroomFullSets(ALL_CATALOG_V2)) {
  const missing = SHOWROOM_FULL_SET_CATEGORIES.filter(
    category => !set.presetMap[category],
  );
  if (missing.length) errors.push(`${set.displayName}: ${missing.join(', ')} 누락`);

  const rarities = new Set(
    Object.values(set.presetMap).filter(Boolean).map(item => item.rarity),
  );
  if (rarities.size > 1) {
    warnings.push(
      `${set.displayName}: 세트 구성 등급 혼합 (${[...rarities].join(', ')})`,
    );
  }
}

console.log(JSON.stringify({
  status: errors.length ? 'FAIL' : 'PASS',
  inspected: inspected.length,
  sets: showroomFullSets(ALL_CATALOG_V2).length,
  warnings,
  errors,
}, null, 2));

if (errors.length) process.exitCode = 1;
