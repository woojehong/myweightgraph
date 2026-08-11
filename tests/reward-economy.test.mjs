import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  dailyProgress, dailyBonusProgress, weeklyProgress, monthlyProgress,
  weekStartOf, cappedEarned, sumPoints, WEEKLY_CAP, MONTHLY_CAP,
} from '../js/quests.js';
import { showroomPriceOf, SHOWROOM_CATALOG_V2 } from '../js/showroom-catalog-v2.js';
import { calculateEarnedIds, calcTotalScore } from '../js/achievements.js';

const fullDay = (date, water=1) => ({
  date, weight:80, exercise:false, water,
  meal:{ morning:'yellow', lunch:'yellow', dinner:'yellow' },
});

const oneDay = fullDay('2026-07-01');
assert.equal(sumPoints(dailyProgress(oneDay)) + sumPoints(dailyBonusProgress(oneDay)), 50);
assert.equal(cappedEarned(dailyProgress(oneDay)), 42);
assert.equal(cappedEarned(dailyBonusProgress(oneDay)), 8);
assert.equal(cappedEarned(dailyBonusProgress(fullDay('2026-07-01', 0))), 2);

const easierDay = {...fullDay('2026-07-02'), meal:{morning:'yellow',lunch:'skip'}};
assert.equal(dailyProgress(easierDay).find(q=>q.id==='d_complete').done,true,'두 끼 기록으로 일간 완주');
assert.equal(dailyProgress(easierDay).find(q=>q.id==='d_meals').done,true);
assert.equal(dailyBonusProgress(easierDay).find(q=>q.id==='d_third_meal').done,false);

const week = Array.from({length:7}, (_,i) => fullDay(`2026-07-${String(5+i).padStart(2,'0')}`));
assert.equal(WEEKLY_CAP, 150);
assert.equal(cappedEarned(weeklyProgress(week, '2026-07-11'), WEEKLY_CAP), 150);
const easierWeekly=weeklyProgress(week.slice(0,6),'2026-07-11');
assert.equal(easierWeekly.find(q=>q.id==='w_complete7').done,true,'주 6일이면 최상위 완주 퀘스트 달성');
assert.equal(easierWeekly.find(q=>q.id==='w_loss').done,true,'감량 없이도 기록만으로 주간 퀘스트 달성');

const month = Array.from({length:30}, (_,i) => fullDay(`2026-07-${String(i+1).padStart(2,'0')}`));
assert.equal(MONTHLY_CAP, 450);
assert.equal(cappedEarned(monthlyProgress(month, '2026-07-30'), MONTHLY_CAP), 450);
const easierMonthly=monthlyProgress(month.slice(0,24),'2026-07-24');
assert.equal(easierMonthly.find(q=>q.id==='m_complete28').done,true,'월 24일이면 최상위 기록 퀘스트 달성');
assert.equal(easierMonthly.find(q=>q.id==='m_streak30').done,true,'21일 연속이면 최상위 연속 퀘스트 달성');
const weekStarts = [...new Set(month.map(r => weekStartOf(r.date)))];
const firstMonthTotal = 30 * 50
  + weekStarts.reduce((sum, start) => sum + cappedEarned(weeklyProgress(month, start), WEEKLY_CAP), 0)
  + cappedEarned(monthlyProgress(month, '2026-07-30'), MONTHLY_CAP)
  + calcTotalScore(calculateEarnedIds(month, {height:178,goal:70,referenceWeight:80}));
assert.equal(firstMonthTotal, 3046, '30일 성실 기록으로 신화 그래프 스킨 하나를 구매할 수 있어야 한다');

assert.equal(showroomPriceOf('graph_skin','mythic'), 3000);
assert.equal(showroomPriceOf('card_theme','mythic'), 2200);
assert.equal(showroomPriceOf('companion','mythic'), 1800);
assert.equal(showroomPriceOf('profile_emoji','mythic'), 1200);
assert.equal(showroomPriceOf('emoji_border','mythic'), 900);
for (const item of SHOWROOM_CATALOG_V2.filter(item => item.purchasable === true))
  assert.equal(item.price, showroomPriceOf(item.category, item.rarity),
    `${item.id}의 실제 카탈로그 가격도 경제표와 일치해야 한다`);

const db = fs.readFileSync(new URL('../js/db.js', import.meta.url), 'utf8');
assert.ok(db.includes('isRewardEligibleDay(dateStr)'));
assert.ok(db.includes("event === 'attendance' && !isCurrentActivityDay(dateStr)"));
assert.ok(db.includes('settlePeriodRewards'));
assert.ok(db.includes('weekTarget - weekPaid'));
assert.ok(db.includes('monthTarget - monthPaid'));

const input = fs.readFileSync(new URL('../input.html', import.meta.url), 'utf8');
for (const token of ['getDailyRewards','rewardMaxForLedger','.day-points.incomplete',
                     '.day-points.complete','.day-points.expired','settlePeriodRewards'])
  assert.ok(input.includes(token), token);

console.log('reward economy tests: PASS');
