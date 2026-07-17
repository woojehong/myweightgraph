// Daily engagement rewards. The activity day changes at 06:00 local time.
export const DAILY_REWARD_POINTS = Object.freeze({
  ATTENDANCE: 10,
  WEIGHT: 10,
  EACH_MEAL: 2,
  EXERCISE: 2,
  WATER_STEP: 1,
  WATER_MAX_STEPS: 6,
  DAILY_COMPLETE: 10,
});

export function activityDay(now = new Date()) {
  const d = new Date(now);
  if (d.getHours() < 6) d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isCurrentActivityDay(dateStr, now = new Date()) {
  return dateStr === activityDay(now);
}

export function isDailyComplete(record) {
  const meal = record?.meal || {};
  return record?.weight != null
    && meal.morning != null && meal.lunch != null && meal.dinner != null
    && (record?.exercise === true || record?.exercise === false);
}

