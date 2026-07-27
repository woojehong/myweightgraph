// Daily engagement rewards. The activity day changes at 06:00 local time.
import { isFullMealDay } from './meal-status.js';
export const DAILY_REWARD_POINTS = Object.freeze({
  ATTENDANCE: 10,
  WEIGHT: 10,
  EACH_MEAL: 2,
  EXERCISE: 4,
  WATER_ANY: 6,
  DAILY_COMPLETE: 14,
});
export const DAILY_REWARD_MAX = 50;
export const RETROACTIVE_REWARD_DAYS = 2;

export function activityDay(now = new Date()) {
  const d = new Date(now);
  if (d.getHours() < 6) d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isCurrentActivityDay(dateStr, now = new Date()) {
  return dateStr === activityDay(now);
}

const parseActivityDate = dateStr => new Date(`${dateStr}T12:00:00`);

export function activityDayAge(dateStr, now = new Date()) {
  const target = parseActivityDate(dateStr);
  const current = parseActivityDate(activityDay(now));
  if (Number.isNaN(target.getTime())) return Infinity;
  return Math.round((current - target) / 86400000);
}

export function isRewardEligibleDay(dateStr, now = new Date()) {
  const age = activityDayAge(dateStr, now);
  return age >= 0 && age <= RETROACTIVE_REWARD_DAYS;
}

export function rewardMaxForLedger(dateStr, ledger = {}, now = new Date()) {
  const age = activityDayAge(dateStr, now);
  if (age === 0 || ledger.attendance || age > RETROACTIVE_REWARD_DAYS) return DAILY_REWARD_MAX;
  return DAILY_REWARD_MAX - DAILY_REWARD_POINTS.ATTENDANCE;
}

export function isDailyComplete(record) {
  return record?.weight != null
    && isFullMealDay(record)
    && (record?.exercise === true || record?.exercise === false);
}
