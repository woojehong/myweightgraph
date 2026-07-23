export const MEAL_TIMES = Object.freeze(['morning', 'lunch', 'dinner']);
export const MEAL_STATUSES = Object.freeze(['green', 'yellow', 'red', 'skip']);
export const MEAL_QUALITY_STATUSES = Object.freeze(['green', 'yellow', 'red']);

const STATUS_SET = new Set(MEAL_STATUSES);
const QUALITY_SET = new Set(MEAL_QUALITY_STATUSES);
const STATUS_ALIASES = Object.freeze({ skipped: 'skip', fasting: 'skip', '결식': 'skip' });

export function normalizeMealStatus(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  const canonical = STATUS_ALIASES[normalized] || normalized;
  return STATUS_SET.has(canonical) ? canonical : null;
}

export function isMealLogged(value) {
  return normalizeMealStatus(value) !== null;
}

export function isMealQualityStatus(value) {
  return QUALITY_SET.has(normalizeMealStatus(value));
}

export function normalizeMeal(meal, { strict = false } = {}) {
  if (meal == null) return {};
  if (typeof meal !== 'object' || Array.isArray(meal)) {
    if (strict) throw new TypeError('식단 기록 형식이 올바르지 않습니다.');
    return {};
  }

  const normalized = {};
  for (const time of MEAL_TIMES) {
    const raw = meal[time];
    if (raw == null || raw === '') continue;
    const status = normalizeMealStatus(raw);
    if (!status) {
      if (strict) throw new TypeError(`허용되지 않은 식단 상태입니다: ${time}`);
      continue;
    }
    normalized[time] = status;
  }
  return normalized;
}

export function normalizeMealRecord(record) {
  if (!record || typeof record !== 'object' || !Object.hasOwn(record, 'meal')) return record;
  return { ...record, meal: normalizeMeal(record.meal) };
}

export function mealEntryCount(record) {
  return MEAL_TIMES.filter(time => isMealLogged(record?.meal?.[time])).length;
}

export function isFullMealDay(record) {
  return mealEntryCount(record) === MEAL_TIMES.length;
}
