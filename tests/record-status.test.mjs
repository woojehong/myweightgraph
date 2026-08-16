import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  classifyRecordStatus,
  latestValidWeightDate,
  millisecondsUntilNextActivityBoundary,
  seoulActivityDay,
  strictDateUtcMs,
} from '../js/record-status.js';

const at = iso => new Date(iso);
const records = (...rows) => rows.map(([date, weight]) => ({ date, weight }));

test('Seoul activity day flips exactly at 06:00 regardless of runtime timezone', () => {
  assert.equal(seoulActivityDay(at('2026-08-15T20:59:59.999Z')), '2026-08-15'); // KST 05:59
  assert.equal(seoulActivityDay(at('2026-08-15T21:00:00.000Z')), '2026-08-16'); // KST 06:00
  assert.equal(millisecondsUntilNextActivityBoundary(at('2026-08-15T20:59:59.000Z')), 1000);
  assert.equal(millisecondsUntilNextActivityBoundary(at('2026-08-15T21:00:00.000Z')), 86400000);
});

test('0/1/2/3/6/7 day boundaries map to the approved four levels', () => {
  const now = at('2026-08-16T03:00:00.000Z'); // KST noon, activity day 2026-08-16
  const expected = [
    ['2026-08-16', 'done'], ['2026-08-15', 'normal'], ['2026-08-14', 'normal'],
    ['2026-08-13', 'warning'], ['2026-08-10', 'warning'], ['2026-08-09', 'critical'],
  ];
  for (const [date, key] of expected) {
    const status = classifyRecordStatus(records([date, 75]), now);
    assert.equal(status.key, key, `${date} should be ${key}`);
  }
});

test('empty, null, non-finite, future and invalid dates stay neutral or are excluded', () => {
  const now = at('2026-08-16T03:00:00.000Z');
  assert.equal(classifyRecordStatus([], now).key, 'empty');
  assert.equal(classifyRecordStatus(records(['2026-08-16', null]), now).key, 'empty');
  assert.equal(classifyRecordStatus(records(['2026-08-16', Infinity]), now).key, 'empty');
  assert.equal(classifyRecordStatus(records(['2026-08-17', 70]), now).key, 'empty');
  assert.equal(classifyRecordStatus(records(['2026-02-30', 70]), now).key, 'empty');
  assert.equal(classifyRecordStatus(records(['2026-8-16', 70]), now).key, 'empty');
  assert.equal(strictDateUtcMs('2024-02-29') != null, true);
  assert.equal(strictDateUtcMs('2025-02-29'), null);
});

test('latest valid date wins across unsorted, backfilled and duplicate-date records', () => {
  const now = at('2026-08-16T03:00:00.000Z');
  const rows = [
    { date:'2026-08-12', weight:72 },
    { date:'2026-08-15', weight:null },
    { date:'2026-08-14', weight:71 },
    { date:'2026-08-14', weight:70.5 },
    { date:'2026-08-20', weight:69 },
  ];
  assert.equal(latestValidWeightDate(rows, now), '2026-08-14');
  assert.equal(classifyRecordStatus(rows, now).age, 2);
});

test('UI contract keeps status outside the chart and provides accessible non-color cues', async () => {
  const html = await readFile(new URL('../compare.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../css/record-status.css', import.meta.url), 'utf8');
  const db = await readFile(new URL('../js/db.js', import.meta.url), 'utf8');
  for (const token of [
    'css/record-status.css', 'classifyRecordStatus', 'record-status-rail',
    'record-status-badge', 'pick-status-dot', 'cmp-graph-only-name',
    "window.addEventListener('focus'", "window.addEventListener('pageshow'",
    'millisecondsUntilNextActivityBoundary', 'syncWeightSubscriptions',
  ]) assert.ok(html.includes(token), `compare UI contract missing: ${token}`);
  assert.ok(db.includes('export function subscribeWeights'), 'selected-user snapshot subscription missing');
  assert.ok(db.includes('onSnapshot'), 'Firestore onSnapshot missing');
  assert.ok(css.includes('pointer-events:none'), 'decorations must not intercept input');
  assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'reduced-motion fallback missing');
  assert.equal(css.includes('.cmp-cell canvas{filter:'), false, 'chart canvas must not be filtered');
  assert.equal(css.includes('.cmp-chart{filter:'), false, 'chart plot must not be filtered');
});
