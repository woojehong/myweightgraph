import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { isOwnProfileSettingsTarget, validateProfileSettings } from '../js/profile-settings.js';

const valid = overrides => validateProfileSettings({
  name: '기록왕', goal: '75.5', height: '175', birthYear: '1990',
  password: '', passwordConfirm: '', removePassword: false,
  ...overrides,
}, { currentYear: 2026, hasPassword: false });

test('basic profile values are normalized without showroom fields', () => {
  const result = valid({ name: '  기록왕  ', goal: '75,5' });
  assert.equal(result.ok, true);
  assert.deepEqual(result.value, {
    name: '기록왕', goal: 75.5, height: 175, birthYear: 1990,
    password: '', passwordAction: 'keep',
  });
});

test('goal, height, birth year and nickname ranges are enforced', () => {
  assert.equal(valid({ name: '' }).field, 'name');
  assert.equal(valid({ goal: '29.9' }).field, 'goal');
  assert.equal(valid({ goal: '75.55' }).field, 'goal');
  assert.equal(valid({ height: '175.5' }).field, 'height');
  assert.equal(valid({ birthYear: '2011' }).field, 'birthYear');
});

test('password can be set, changed, kept, or removed explicitly', () => {
  assert.equal(valid({ password: '1234', passwordConfirm: '1234' }).value.passwordAction, 'set');
  assert.equal(valid({ password: '1234', passwordConfirm: '4321' }).field, 'passwordConfirm');
  assert.equal(valid({ password: 'abcd', passwordConfirm: 'abcd' }).field, 'password');
  assert.equal(validateProfileSettings({ name:'나',goal:70,height:170,birthYear:1990,removePassword:true }, { currentYear:2026,hasPassword:true }).value.passwordAction, 'remove');
});

test('only the active owner can edit and admin view is read-only', () => {
  assert.equal(isOwnProfileSettingsTarget('me', { ownerUid:'me', search:'?user=me' }), true);
  assert.equal(isOwnProfileSettingsTarget('other', { ownerUid:'me', search:'?user=other' }), false);
  assert.equal(isOwnProfileSettingsTarget('me', { ownerUid:'me', search:'?user=me&admin_view=1' }), false);
});

test('every signed-in user surface uses the shared settings trigger', async () => {
  const pages = ['input.html','dashboard.html','compare.html','achievements.html','diet.html','dressroom.html','import.html','guide.html'];
  for (const page of pages) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    assert.ok(html.includes('css/profile-settings.css'), `${page}: profile settings CSS missing`);
    assert.ok(html.includes('data-profile-settings-trigger'), `${page}: header trigger missing`);
    assert.ok(html.includes('installProfileSettings'), `${page}: shared settings installer missing`);
  }
});

test('legacy duplicate customization modals are gone from primary pages', async () => {
  for (const page of ['input.html','dashboard.html','achievements.html']) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    assert.equal(html.includes('id="profileModal"'), false, `${page}: legacy modal remains`);
    assert.equal(html.includes('openProfileEdit'), false, `${page}: showroom redirect/dead editor remains`);
  }
  const moduleSource = await readFile(new URL('../js/profile-settings.js', import.meta.url), 'utf8');
  for (const forbidden of ['selectedTitle','selectedBorder','showroomLoadoutV2','pEmojiGrid','profileEmojiGrid']) {
    assert.equal(moduleSource.includes(forbidden), false, `shared basic settings leaked customization field: ${forbidden}`);
  }
});
