import assert from 'node:assert/strict';
import { activityDay, isCurrentActivityDay, isDailyComplete,
         DAILY_REWARD_POINTS } from '../js/daily-rewards.js';

assert.equal(activityDay(new Date(2026, 6, 17, 5, 59)), '2026-07-16');
assert.equal(activityDay(new Date(2026, 6, 17, 6, 0)), '2026-07-17');
assert.equal(isCurrentActivityDay('2026-07-16', new Date(2026, 6, 17, 5, 59)), true);
assert.equal(isDailyComplete({
  weight: 80,
  meal: { morning: 'red', lunch: 'yellow', dinner: 'green' },
  exercise: false,
}), true);
assert.equal(isDailyComplete({
  weight: 80,
  meal: { morning: 'red', lunch: 'yellow' },
  exercise: true,
}), false);
assert.deepEqual(DAILY_REWARD_POINTS, {
  ATTENDANCE: 10, WEIGHT: 10, EACH_MEAL: 2, EXERCISE: 2,
  WATER_STEP: 1, WATER_MAX_STEPS: 6, DAILY_COMPLETE: 10,
});

console.log('daily-rewards tests: PASS');
