import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  AVATAR_V2_ITEMS,
  avatarV2LayerAsset,
  renderAvatarV2,
} from '../js/avatar-v2.js';

const root = path.resolve(import.meta.dirname, '..');
const visualSlots = new Set(['hair', 'headgear', 'top', 'bottom', 'shoes', 'rightHand', 'leftHand']);

for (const item of AVATAR_V2_ITEMS) {
  if (!visualSlots.has(item.slot) || item.id == null || item.id === 'default' || item.id === 'white-tee' || item.id === 'black-track' || item.id === 'bare-chest') continue;
  const asset = avatarV2LayerAsset(item.slot, item.id);
  assert.ok(asset, `missing layer mapping: ${item.slot}:${item.id}`);
  assert.ok(fs.existsSync(path.join(root, asset)), `missing layer file: ${asset}`);
}

for (const body of ['basic', 'slim', 'toned', 'power', 'physique']) {
  const html = renderAvatarV2({body, hair:'hair-02', headgear:'head-01', top:'top-02', bottom:'bottom-02', shoes:'shoes-02', rightHand:'right-01', leftHand:'left-01'});
  assert.match(html, new RegExp(`body-${body}\\.png`));
  assert.match(html, /avatar-v2-top-layer/);
  assert.match(html, /avatar-v2-right-layer/);
}

console.log('avatar-v2 tests: PASS');
