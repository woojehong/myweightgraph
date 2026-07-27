import assert from 'node:assert/strict';
import { activeTodayMessage, normalizeTodayMessage, todayMessageDayKey } from '../js/today-message.js';

assert.equal(todayMessageDayKey(new Date('2026-07-27T20:59:59Z')),'2026-07-27','05:59 KST belongs to the previous operational day');
assert.equal(todayMessageDayKey(new Date('2026-07-27T21:00:00Z')),'2026-07-28','06:00 KST starts a new operational day');
assert.equal(normalizeTodayMessage('  반가워요   오늘도 파이팅  '),'반가워요 오늘도 파이팅');
assert.equal(normalizeTodayMessage('가'.repeat(100)).length,80);
assert.equal(activeTodayMessage({todayMessage:'오늘도 파이팅',todayMessageDay:'2026-07-28'},new Date('2026-07-28T12:00:00Z')),'오늘도 파이팅');
assert.equal(activeTodayMessage({todayMessage:'어제 문구',todayMessageDay:'2026-07-27'},new Date('2026-07-28T12:00:00Z')),'');

console.log('today message tests: PASS');
