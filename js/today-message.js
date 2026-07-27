const SEOUL_OPERATION_OFFSET_MS = 3 * 60 * 60 * 1000;

export function todayMessageDayKey(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() + SEOUL_OPERATION_OFFSET_MS).toISOString().slice(0, 10);
}

export function normalizeTodayMessage(value, maxLength = 80) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export function activeTodayMessage(user, now = new Date()) {
  const text = normalizeTodayMessage(user?.todayMessage);
  return text && user?.todayMessageDay === todayMessageDayKey(now) ? text : '';
}

