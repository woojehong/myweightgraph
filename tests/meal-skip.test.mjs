import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  MEAL_STATUSES, normalizeMealStatus, normalizeMeal, normalizeMealRecord,
  mealEntryCount, isFullMealDay,
} from '../js/meal-status.js';
import { isDailyComplete, DAILY_REWARD_POINTS } from '../js/daily-rewards.js';
import { ACHIEVEMENTS, calculateEarnedIds, calculateProgress } from '../js/achievements.js';
import { dailyProgress, weeklyProgress } from '../js/quests.js';

assert.deepEqual(MEAL_STATUSES, ['green', 'yellow', 'red', 'skip']);
for (const status of MEAL_STATUSES) assert.equal(normalizeMealStatus(status), status);
assert.equal(normalizeMealStatus('skipped'), 'skip');
assert.equal(normalizeMealStatus('결식'), 'skip');
assert.equal(normalizeMealStatus('blue'), null);
assert.deepEqual(normalizeMeal({ morning:'green', lunch:'skip', dinner:'red' }),
  { morning:'green', lunch:'skip', dinner:'red' });
assert.deepEqual(normalizeMeal({ morning:'blue', lunch:null, dinner:'yellow' }), { dinner:'yellow' });
assert.throws(() => normalizeMeal({ morning:'blue' }, { strict:true }), /허용되지 않은 식단 상태/);

const serialized = JSON.parse(JSON.stringify({
  date:'2026-07-01', weight:80, exercise:false,
  meal:{ morning:'green', lunch:'skip', dinner:'red' }, water:4,
}));
assert.deepEqual(normalizeMealRecord(serialized), serialized, '과거 3상태와 결식을 포함한 레코드 왕복을 보존해야 한다');
assert.equal(mealEntryCount(serialized), 3);
assert.equal(isFullMealDay(serialized), true);
assert.equal(isDailyComplete(serialized), true);
assert.equal(isDailyComplete({ ...serialized, meal:{ morning:'skip', lunch:'blue', dinner:'red' } }), false,
  '알 수 없는 non-null 값은 기록으로 인정하지 않는다');

const daily = dailyProgress({
  weight:80, exercise:false,
  meal:{ morning:'skip', lunch:'skip', dinner:'skip' },
});
assert.equal(daily.find(q => q.id === 'd_meals').value, 3);
assert.equal(daily.find(q => q.id === 'd_complete').done, true);

const skipWeek = Array.from({ length:4 }, (_, i) => ({
  date:`2026-07-${String(5 + i).padStart(2,'0')}`, weight:80-i/10, exercise:false,
  meal:{ morning:'skip', lunch:'skip', dinner:'skip' },
}));
const weekly = weeklyProgress(skipWeek, '2026-07-08');
assert.equal(weekly.find(q => q.id === 'w_streak4').done, true,
  '결식으로 기록한 완주일도 연속 기록에 포함된다');
assert.equal(weekly.find(q => q.id === 'w_green7').value, 0);
assert.equal(weekly.find(q => q.id === 'w_allgreen2').value, 0);
assert.equal(weekly.find(q => q.id === 'w_nored3').value, 0,
  '결식은 노레드 품질 보너스에 기여하지 않는다');

const achievementRecords = Array.from({ length:4 }, (_, i) => ({
  date:`2026-06-${String(1 + i).padStart(2,'0')}`,
  meal:{ morning:'skip', lunch:'skip', dinner:'skip' },
}));
const earned = calculateEarnedIds(achievementRecords, {});
assert.ok(earned.has('diet_meal_1'), '결식 3끼도 식단 기록일 업적에 포함된다');
assert.ok(earned.has('meal_entry_10'), '결식도 기존 끼니 누적 기록에 포함된다');
assert.equal([...earned].some(id => id.startsWith('diet_green_') || id.startsWith('allgreen_')), false);
assert.equal(calculateProgress(achievementRecords, {}).meal_entry_10.current, 10);
assert.equal(ACHIEVEMENTS.some(a => /skip|결식/i.test(`${a.id} ${a.name} ${a.desc}`)), false,
  '결식 전용 업적을 추가하지 않는다');
assert.deepEqual(DAILY_REWARD_POINTS, {
  ATTENDANCE:10, WEIGHT:10, EACH_MEAL:2, EXERCISE:2,
  WATER_STEP:1, WATER_MAX_STEPS:6, DAILY_COMPLETE:10,
}, '결식 전용 포인트를 추가하지 않는다');

const [input, admin, chart, db, sw] = await Promise.all([
  readFile(new URL('../input.html', import.meta.url), 'utf8'),
  readFile(new URL('../admin.html', import.meta.url), 'utf8'),
  readFile(new URL('../js/chart-render.js', import.meta.url), 'utf8'),
  readFile(new URL('../js/db.js', import.meta.url), 'utf8'),
  readFile(new URL('../sw.js', import.meta.url), 'utf8'),
]);
assert.ok(input.indexOf("'green', 'yellow', 'red', 'skip'") >= 0);
assert.ok(input.includes('skip-tl') && input.includes('결식(안 먹음)'));
assert.ok(input.includes('.pr-dot.skip'));
assert.ok(admin.includes("['green','yellow','red','skip']"));
assert.ok(chart.includes("skip: 'rgba(255,255,255,0)'"));
assert.ok(db.includes('normalizeMeal(normalized.meal, { strict:true })'));
assert.ok(sw.includes("'./js/meal-status.js'"));

console.log('meal skip tests: PASS');
