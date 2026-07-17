import assert from 'node:assert/strict';
import {
  renderAvatarV2,
} from '../js/avatar-v2.js';

assert.equal(renderAvatarV2({ body: 'basic' }), '');

console.log('avatar retirement test: PASS');
