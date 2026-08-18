import assert from 'node:assert/strict';
import {
  ACHIEVEMENTS,
  calculateEarnedIds,
  calculateProgress,
} from '../js/achievements.js';
import {
  RECORD_META_ACHIEVEMENTS,
  calculateRecordMetaEarnedIds,
  calculateRecordMetaProgress,
} from '../js/record-meta-achievements.js';

const dateAt = offset => {
  const date = new Date(Date.UTC(2024, 0, 1 + offset));
  return date.toISOString().slice(0, 10);
};
const waterDays = (count, value = 1) => Array.from(
  { length: count },
  (_, index) => ({ date: dateAt(index), water: value }),
);

// 잔 수가 아무리 많아도 한 날짜는 수분 기록 1일로만 센다.
const oneHighVolumeDay = [{ date: dateAt(0), water: 500 }];
const oneDayEarned = calculateEarnedIds(oneHighVolumeDay, {});
assert.ok(oneDayEarned.has('water_first'));
assert.ok(oneDayEarned.has('water_goal_1'));
assert.equal(oneDayEarned.has('water_goal_5'), false);
assert.equal(oneDayEarned.has('water_total_100'), false);

// 과거 날짜를 포함한 전체 기록을 다시 계산해 소급 달성한다.
const historicalThirtyDays = waterDays(30);
historicalThirtyDays[4].water = '1'; // 과거 직렬화 자료도 안전하게 기록으로 인정
const thirtyDayEarned = calculateEarnedIds(historicalThirtyDays, {});
for (const id of ['water_first', 'water_goal_1', 'water_goal_5', 'water_goal_10', 'water_goal_30']) {
  assert.ok(thirtyDayEarned.has(id), `${id} should be retroactively earned`);
}
assert.equal(thirtyDayEarned.has('water_total_100'), false);
assert.deepEqual(calculateProgress(historicalThirtyDays, {}).water_goal_30, {
  current: 30,
  target: 30,
});
assert.deepEqual(calculateProgress(historicalThirtyDays, {}).water_total_100, {
  current: 30,
  target: 100,
});

// 0·음수·빈 값·유효하지 않은 값은 수분 기록으로 보지 않는다.
const invalidRecords = [0, -1, '', null, undefined, 'not-a-number'].map((water, index) => ({
  date: dateAt(index),
  water,
}));
assert.equal(calculateEarnedIds(invalidRecords, {}).has('water_first'), false);
assert.equal(calculateProgress(invalidRecords, {}).water_goal_5.current, 0);

// 장기 업적도 잔 수가 아니라 서로 다른 수분 기록일을 사용한다.
const hundredDayEarned = calculateEarnedIds(waterDays(100, 1), {});
assert.ok(hundredDayEarned.has('water_total_100'));
assert.equal(hundredDayEarned.has('water_total_500'), false);

// 메타 업적도 동일한 기록 판정을 사용하고 과거 숫자 문자열을 수용한다.
const metaSevenDays = waterDays(7, '1');
assert.ok(calculateRecordMetaEarnedIds(metaSevenDays).has('meta_3m_water_7'));
assert.deepEqual(calculateRecordMetaProgress(metaSevenDays).meta_3m_water_7, {
  current: 7,
  target: 7,
});

// 사용자에게 보이는 수분 업적 문구는 목표량이나 특정 한 잔을 요구하지 않는다.
const waterAchievements = ACHIEVEMENTS.filter(achievement =>
  achievement.id.startsWith('water_') || achievement.id.includes('_water_'));
assert.ok(waterAchievements.length > 0);
for (const achievement of waterAchievements) {
  const copy = `${achievement.name} ${achievement.desc}`;
  assert.equal(/목표|(?:한|1)\s*잔/.test(copy), false, `${achievement.id}: ${copy}`);
  assert.match(achievement.desc, /기록/, achievement.id);
}
for (const achievement of RECORD_META_ACHIEVEMENTS.filter(item => item.id.includes('_water_'))) {
  assert.equal(/목표|(?:한|1)\s*잔/.test(`${achievement.name} ${achievement.desc}`), false, achievement.id);
  assert.match(achievement.desc, /기록/, achievement.id);
}

console.log('water record achievement tests: PASS');
