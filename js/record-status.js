const SEOUL_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function seoulParts(now = new Date()) {
  const shifted = new Date(new Date(now).getTime() + SEOUL_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
  };
}

function dateKeyFromUtcMs(ms) {
  const date = new Date(ms);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function strictDateUtcMs(dateStr) {
  const match = DATE_RE.exec(String(dateStr || ''));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const ms = Date.UTC(year, month - 1, day);
  const parsed = new Date(ms);
  if (parsed.getUTCFullYear() !== year
    || parsed.getUTCMonth() !== month - 1
    || parsed.getUTCDate() !== day) return null;
  return ms;
}

export function seoulActivityDay(now = new Date()) {
  const parts = seoulParts(now);
  const civilDayMs = Date.UTC(parts.year, parts.month - 1, parts.day);
  return dateKeyFromUtcMs(parts.hour < 6 ? civilDayMs - DAY_MS : civilDayMs);
}

export function millisecondsUntilNextActivityBoundary(now = new Date()) {
  const nowMs = new Date(now).getTime();
  const parts = seoulParts(now);
  let targetMs = Date.UTC(parts.year, parts.month - 1, parts.day, 6) - SEOUL_OFFSET_MS;
  if (targetMs <= nowMs) targetMs += DAY_MS;
  return Math.max(1, targetMs - nowMs);
}

export function latestValidWeightDate(records, now = new Date()) {
  const activityDate = seoulActivityDay(now);
  const activityMs = strictDateUtcMs(activityDate);
  let latestDate = null;
  let latestMs = -Infinity;
  for (const record of Array.isArray(records) ? records : []) {
    if (!Number.isFinite(record?.weight)) continue;
    const dateMs = strictDateUtcMs(record?.date);
    if (dateMs == null || dateMs > activityMs || dateMs <= latestMs) continue;
    latestMs = dateMs;
    latestDate = record.date;
  }
  return latestDate;
}

export function classifyRecordStatus(records, now = new Date()) {
  const activityDate = seoulActivityDay(now);
  const latestDate = latestValidWeightDate(records, now);
  if (!latestDate) {
    return {
      key: 'empty', severity: 0, age: null, activityDate, latestDate: null,
      icon: '○', label: '첫 체중 기록 전', compactLabel: '첫 기록 전',
    };
  }

  const age = Math.round((strictDateUtcMs(activityDate) - strictDateUtcMs(latestDate)) / DAY_MS);
  if (age === 0) {
    return {
      key: 'done', severity: 0, age, activityDate, latestDate,
      icon: '✓', label: '오늘 기록 완료', compactLabel: '오늘 완료',
    };
  }
  if (age <= 2) {
    return {
      key: 'normal', severity: 1, age, activityDate, latestDate,
      icon: '◷',
      label: age === 1 ? '오늘은 아직 기록 전' : '2일째 기록 전',
      compactLabel: age === 1 ? '오늘 미기록' : '2일 미기록',
    };
  }
  if (age <= 6) {
    return {
      key: 'warning', severity: 2, age, activityDate, latestDate,
      icon: '!', label: `${age}일째 기록이 비어 있어요`, compactLabel: `${age}일 미기록`,
    };
  }
  return {
    key: 'critical', severity: 3, age, activityDate, latestDate,
    icon: '!!', label: `${age}일째 기록 흐름이 끊겼어요`, compactLabel: `${age}일 미기록`,
  };
}

export function recordStatusClass(status) {
  return `record-status--${status?.key || 'empty'}`;
}
