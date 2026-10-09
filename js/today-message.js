// UTC 기준 날짜를 한국 활동일(오전 4시 경계)로 이동한다.
// KST(+9)에서 4시간을 빼므로 UTC에는 +5시간을 적용한다.
const SEOUL_OPERATION_OFFSET_MS = 5 * 60 * 60 * 1000;

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
