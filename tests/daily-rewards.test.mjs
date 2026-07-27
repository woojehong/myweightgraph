import assert from 'node:assert/strict';
import { activityDay, activityDayAge, isCurrentActivityDay, isRewardEligibleDay,
         rewardMaxForLedger, isDailyComplete, DAILY_REWARD_POINTS,
         DAILY_REWARD_MAX } from '../js/daily-rewards.js';

assert.equal(activityDay(new Date(2026, 6, 17, 5, 59)), '2026-07-16');
assert.equal(activityDay(new Date(2026, 6, 17, 6, 0)), '2026-07-17');
assert.equal(isCurrentActivityDay('2026-07-16', new Date(2026, 6, 17, 5, 59)), true);
assert.equal(activityDayAge('2026-07-15', new Date(2026, 6, 17, 12)), 2);
assert.equal(isRewardEligibleDay('2026-07-15', new Date(2026, 6, 17, 12)), true);
assert.equal(isRewardEligibleDay('2026-07-14', new Date(2026, 6, 17, 12)), false);
assert.equal(rewardMaxForLedger('2026-07-16', {}, new Date(2026, 6, 17, 12)), 40);
assert.equal(rewardMaxForLedger('2026-07-16', { attendance:true }, new Date(2026, 6, 17, 12)), 50);
assert.equal(DAILY_REWARD_MAX, 50);
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
assert.equal(isDailyComplete({
  weight: 80,
  meal: { morning: 'skip', lunch: 'yellow', dinner: 'green' },
  exercise: false,
}), true);
assert.equal(isDailyComplete({
  weight: 80,
  meal: { morning: 'unknown', lunch: 'yellow', dinner: 'green' },
  exercise: false,
}), false);
assert.deepEqual(DAILY_REWARD_POINTS, {
  ATTENDANCE: 10, WEIGHT: 10, EACH_MEAL: 2, EXERCISE: 4,
  WATER_ANY: 6, DAILY_COMPLETE: 14,
});

console.log('daily-rewards tests: PASS');
