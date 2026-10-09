import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  aggregateRecords,
  findWeeklyBarHit,
  periodLabel,
  weeklyBarGeometry,
  weeklyBarWidth,
} from '../js/chart-render.js';

test('weekly bar width follows the rendered rectangle width', () => {
  assert.equal(weeklyBarWidth([100]), 24);
  assert.equal(weeklyBarWidth([100, 145, 190]), 38.25);
  assert.equal(weeklyBarWidth([100, 200]), 44);
  assert.equal(weeklyBarWidth([100, 110]), 10);
});

test('weekly hover only hits the actual rendered bar and chooses its exact week', () => {
  const data = [
    { x: 1, y: 0.4 },
    { x: 2, y: -0.8 },
    { x: 3, y: 0.2 },
  ];
  const cssPixels = new Map([[1, 100], [2, 145], [3, 190]]);
  const geometry = weeklyBarGeometry(data, value => cssPixels.get(value), 200, 290, 0.8, 80, 210);

  // The second bar is 38.25 CSS px wide. Its left edge is 125.875.
  // The old full-width hit test selected the first week in this area.
  assert.equal(findWeeklyBarHit(geometry, 130, 250), 1);
  assert.equal(findWeeklyBarHit(geometry, 145, 250), 1);
  assert.equal(findWeeklyBarHit(geometry, 124, 250), -1);
  assert.equal(findWeeklyBarHit(geometry, 100, 250), 0);

  // The pure helper can still enforce the exact painted rectangle.
  assert.equal(findWeeklyBarHit(geometry, 145, 199), -1);
  assert.equal(findWeeklyBarHit(geometry, 145, 289), 1);

  // Production passes the weekly lane as vertical bounds so a 2px-tall,
  // near-zero weekly change remains accessible without widening X hit boxes.
  assert.equal(findWeeklyBarHit(geometry, 145, 205, { top: 200, bottom: 290 }), 1);
  assert.equal(findWeeklyBarHit(geometry, 124, 205, { top: 200, bottom: 290 }), -1);
  assert.equal(findWeeklyBarHit(geometry, 145, 195, { top: 200, bottom: 290 }), -1);
});

test('weekly hover coordinates remain CSS pixels regardless of backing DPR', () => {
  const data = [{ x: 1, y: 1 }];
  const geometry = weeklyBarGeometry(data, () => 240, 100, 180, 1, 0, 480);

  // Chart.js normalizes both scale pixels and event.x/event.y to CSS pixels.
  // A 2x backing bitmap must not require multiplying the pointer by 2.
  assert.equal(findWeeklyBarHit(geometry, 240, 150), 0);
  assert.equal(findWeeklyBarHit(geometry, 480, 300), -1);
});

test('weekly hover respects plot and today clipping', () => {
  const data = [{ x: 1, y: 1 }];
  const geometry = weeklyBarGeometry(data, () => 200, 100, 180, 1, 0, 195);
  assert.equal(geometry[0].right, 195);
  assert.equal(findWeeklyBarHit(geometry, 194, 150), 0);
  assert.equal(findWeeklyBarHit(geometry, 196, 150), -1);
});

test('day, week and month aggregation/labels remain unchanged', () => {
  const records = [
    { date: '2026-08-02', weight: 80, meal: 'green' },
    { date: '2026-08-03', weight: 82, meal: 'yellow' },
    { date: '2026-08-09', weight: 78, meal: 'red' },
    { date: '2026-09-01', weight: 77, meal: 'green' },
  ];
  assert.equal(aggregateRecords(records, 'day'), records);
  assert.deepEqual(aggregateRecords(records, 'week'), [
    { date: '2026-08-02', weight: 81 },
    { date: '2026-08-09', weight: 78 },
    { date: '2026-08-30', weight: 77 },
  ]);
  assert.deepEqual(aggregateRecords(records, 'month'), [
    { date: '2026-08-01', weight: 80 },
    { date: '2026-09-01', weight: 77 },
  ]);
  assert.equal(periodLabel(new Date('2026-08-09T00:00:00'), 'week'), '2026년 8월 3주차');
  assert.equal(periodLabel(new Date('2026-09-01T00:00:00'), 'month'), '2026년 9월');
});

test('dashboard, compare and showroom keep consuming the shared renderer', async () => {
  const [dashboard, compare, dressroom] = await Promise.all([
    readFile(new URL('../dashboard.html', import.meta.url), 'utf8'),
    readFile(new URL('../compare.html', import.meta.url), 'utf8'),
    readFile(new URL('../dressroom.html', import.meta.url), 'utf8'),
  ]);
  assert.match(dashboard, /from ['"]\.\/js\/chart-render\.js['"]/);
  assert.match(compare, /from ['"]\.\/js\/chart-render\.js['"]/);
  assert.match(dressroom, /from['"]\.\/js\/chart-render\.js['"]/);
});
