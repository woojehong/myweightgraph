const SEOUL_OPERATION_OFFSET_MS = 3 * 60 * 60 * 1000;

export function todayMessageDayKey(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() + SEOUL_OPERATION_OFFSET_MS).toISOString().slice(0, 10);
}

export function normalizeTodayMessage(value, maxLength = 160) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n').map(line=>line.replace(/[^\S\n]+/g,' ').trim()).join('\n')
    .replace(/\n{4,}/g,'\n\n\n').trim().slice(0, maxLength);
}

export function activeTodayMessage(user, now = new Date()) {
  const text = normalizeTodayMessage(user?.todayMessage);
  return text && user?.todayMessageDay === todayMessageDayKey(now) ? text : '';
}
