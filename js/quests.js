// ─────────────────────────────────────────────────────────────────────────────
// 퀘스트 엔진 — 일간 50P / 주간 200P(상한) / 월간 600P(상한)
//
// 설계 원칙
//  1) 완주(complete)는 "행동을 기록했는가"만 본다. 색이 빨강이든 운동이 X든
//     체중이 늘었든 상관없다. 체중 + 세 끼 + 운동유무를 기록하면 완주.
//  2) 물은 선택. 완주 조건이 아니며 보너스 포인트만 준다.
//  3) 주간·월간은 퀘스트를 많이 두되 획득 포인트에 상한을 건다.
//     전부 깨도 상한까지만 받는다 → 자기 스타일대로 골라 깨는 구조.
//     덕분에 감량 퀘스트를 넣어도 유지·증량하는 사람이 불리하지 않다.
//  4) 배점이 큰 주간·월간은 난이도도 높게 잡았다.
//  5) 주는 일요일 시작(그래프와 동일), 활동일 경계는 오전 6시.
// ─────────────────────────────────────────────────────────────────────────────
import { activityDay, isDailyComplete } from './daily-rewards.js';

export const WATER_GOAL_DEFAULT = 6;   // 500ml 잔 기준 기본 목표
export const WATER_GOAL   = WATER_GOAL_DEFAULT;
/** 사용자가 설정한 목표(users.waterGoal) — 없으면 기본값 */
export const waterGoalOf = user =>
  Math.max(1, Math.min(20, Number(user?.waterGoal) || WATER_GOAL_DEFAULT));
export const WEEKLY_CAP   = 200;
export const MONTHLY_CAP  = 1000;

const ds = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parseDs = s => new Date(s + 'T12:00:00');
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

export function weekStartOf(dateStr){ const d=parseDs(dateStr); d.setDate(d.getDate()-d.getDay()); return ds(d); }
export function monthStartOf(dateStr){ const d=parseDs(dateStr); return ds(new Date(d.getFullYear(),d.getMonth(),1)); }

const greenMeals  = r => ['morning','lunch','dinner'].filter(m => r?.meal?.[m]==='green').length;
const mealsLogged = r => ['morning','lunch','dinner'].filter(m => r?.meal?.[m]!=null).length;
const allGreenDay = r => greenMeals(r)===3;
const noRedDay    = r => mealsLogged(r)===3 && !['morning','lunch','dinner'].some(m=>r?.meal?.[m]==='red');
const exerciseDone= r => r?.exercise===true;
const waterDone   = r => (r?.water||0) >= WATER_GOAL;

// ── 일간 ────────────────────────────────────────────────────────────────────
// 완주 퀘스트 44P (필수) + 보너스 6P (물, 선택) = 최대 50P
// 물은 완주 조건이 아니므로 목록 자체를 분리한다.
export const DAILY_QUESTS = Object.freeze([
  { id:'d_attend',  label:'출석',       points:10, goal:1 },
  { id:'d_weight',  label:'체중 기록',  points:10, goal:1 },
  { id:'d_meals',   label:'세 끼 기록', points:6,  goal:3 },
  { id:'d_exercise',label:'운동 체크',  points:4,  goal:1 },
  { id:'d_complete',label:'하루 완주',  points:14, goal:1 },
]);
/** 완주와 무관한 선택 보너스 — 목표 달성 유무로만 판정(부분점수 없음) */
export const dailyBonusDefs = goal => Object.freeze([
  { id:'d_water', label:`수분 섭취 목표 (${goal}잔)`, points:6, goal:1, optional:true },
]);
export const DAILY_BONUS = dailyBonusDefs(WATER_GOAL_DEFAULT);

export function dailyProgress(record){
  const r = record || {};
  return buildList(DAILY_QUESTS, {
    d_attend:1,
    d_weight:   r.weight!=null ? 1 : 0,
    d_meals:    mealsLogged(r),
    d_exercise: (r.exercise===true||r.exercise===false) ? 1 : 0,
    d_complete: isDailyComplete(r) ? 1 : 0,
  });
}
/** 선택 보너스(물) — 완주와 무관. 목표 달성 유무만 본다. */
export function dailyBonusProgress(record, goal = WATER_GOAL_DEFAULT){
  const r = record || {};
  return buildList(dailyBonusDefs(goal), { d_water: (r.water||0) >= goal ? 1 : 0 });
}

// ── 주간 퀘스트 (총 배점 > 상한 200P) ───────────────────────────────────────
// tier: easy(쉬움) / normal / hard(어려움) — 어려울수록 배점이 크다
export const WEEKLY_QUESTS = Object.freeze([
  { id:'w_complete3', label:'3일 완주',          points:30,  goal:3,  tier:'easy'   },
  { id:'w_complete5', label:'5일 완주',          points:60,  goal:5,  tier:'normal' },
  { id:'w_complete7', label:'7일 전부 완주',     points:100, goal:7,  tier:'hard'   },
  { id:'w_weight5',   label:'체중 5일 기록',     points:30,  goal:5,  tier:'easy'   },
  { id:'w_weight7',   label:'체중 7일 기록',     points:60,  goal:7,  tier:'hard'   },
  { id:'w_exercise2', label:'운동 2회 이상',     points:25,  goal:2,  tier:'easy'   },
  { id:'w_exercise4', label:'운동 4회 이상',     points:55,  goal:4,  tier:'normal' },
  { id:'w_exercise6', label:'운동 6회 이상',     points:90,  goal:6,  tier:'hard'   },
  { id:'w_green7',    label:'초록 식단 7끼',     points:30,  goal:7,  tier:'easy'   },
  { id:'w_green14',   label:'초록 식단 14끼',    points:65,  goal:14, tier:'normal' },
  { id:'w_allgreen2', label:'올그린 데이 2일',   points:80,  goal:2,  tier:'hard'   },
  { id:'w_nored3',    label:'빨강 없는 날 3일',  points:45,  goal:3,  tier:'normal' },
  { id:'w_streak4',   label:'4일 연속 완주',     points:55,  goal:4,  tier:'normal' },
  { id:'w_loss',      label:'주간 감량 0.3kg',   points:50,  goal:1,  tier:'normal' },
]);

export function weeklyProgress(records, refDate = activityDay()){
  const start  = weekStartOf(refDate);
  const inWeek = recordsInRange(records, start, 7);
  const delta  = periodDelta(inWeek);
  return buildList(WEEKLY_QUESTS, {
    w_complete3: inWeek.filter(isDailyComplete).length,
    w_complete5: inWeek.filter(isDailyComplete).length,
    w_complete7: inWeek.filter(isDailyComplete).length,
    w_weight5:   inWeek.filter(r=>r.weight!=null).length,
    w_weight7:   inWeek.filter(r=>r.weight!=null).length,
    w_exercise2: inWeek.filter(exerciseDone).length,
    w_exercise4: inWeek.filter(exerciseDone).length,
    w_exercise6: inWeek.filter(exerciseDone).length,
    w_green7:    inWeek.reduce((s,r)=>s+greenMeals(r),0),
    w_green14:   inWeek.reduce((s,r)=>s+greenMeals(r),0),
    w_allgreen2: inWeek.filter(allGreenDay).length,
    w_nored3:    inWeek.filter(noRedDay).length,
    w_streak4:   longestStreak(inWeek, start, 7),
    w_loss:      delta!=null && delta <= -0.3 ? 1 : 0,
  });
}

/** 그 주 완수 = 상한 200P를 꽉 채운 주 */
export function isWeekCleared(records, weekStartStr){
  return cappedEarned(weeklyProgress(records, weekStartStr), WEEKLY_CAP) >= WEEKLY_CAP;
}

// ── 월간 퀘스트 (총 배점 > 상한 600P) ───────────────────────────────────────
export const MONTHLY_QUESTS = Object.freeze([
  { id:'m_weeks2',    label:'주간 상한 2주 달성',  points:150, goal:2,  tier:'normal' },
  { id:'m_weeks3',    label:'주간 상한 3주 달성',  points:250, goal:3,  tier:'hard'   },
  { id:'m_complete15',label:'15일 완주',           points:120, goal:15, tier:'easy'   },
  { id:'m_complete22',label:'22일 완주',           points:200, goal:22, tier:'hard'   },
  { id:'m_streak7',   label:'7일 연속 완주',       points:110, goal:7,  tier:'easy'   },
  { id:'m_streak10',  label:'10일 연속 완주',      points:170, goal:10, tier:'normal' },
  { id:'m_streak15',  label:'15일 연속 완주',      points:260, goal:15, tier:'hard'   },
  { id:'m_buddy5',    label:'친구와 동반 완주 5회',  points:100, goal:5,  tier:'easy'   },
  { id:'m_buddy10',   label:'친구와 동반 완주 10회', points:180, goal:10, tier:'normal' },
  { id:'m_exercise10',label:'운동 10회 이상',      points:120, goal:10, tier:'easy'   },
  { id:'m_exercise16',label:'운동 16회 이상',      points:210, goal:16, tier:'hard'   },
  { id:'m_allgreen5', label:'올그린 데이 5일',     points:150, goal:5,  tier:'normal' },
  { id:'m_allgreen10',label:'올그린 데이 10일',    points:260, goal:10, tier:'hard'   },
  { id:'m_weekday',   label:'7요일 모두 완주',    points:140, goal:7,  tier:'normal' },
  { id:'m_noskip',    label:'2일 연속 결석 없기',  points:160, goal:1,  tier:'normal' },
  { id:'m_loss',      label:'월간 1kg 감량',       points:180, goal:1,  tier:'normal' },
  { id:'m_loss2',     label:'월간 2kg 감량',       points:280, goal:1,  tier:'hard'   },
]);

export function monthlyProgress(records, refDate = activityDay(), buddyDates = null){
  const mStart = monthStartOf(refDate);
  const d0 = parseDs(mStart);
  const days = new Date(d0.getFullYear(), d0.getMonth()+1, 0).getDate();
  const inMonth = recordsInRange(records, mStart, days);
  const completed = inMonth.filter(isDailyComplete);
  const delta = periodDelta(inMonth);

  const weekStarts = new Set(inMonth.map(r => weekStartOf(r.date)));
  const weeksCleared = [...weekStarts].filter(ws => isWeekCleared(records, ws)).length;
  const streak = longestStreak(inMonth, mStart, days);
  const buddy = buddyDates ? completed.filter(r => buddyDates.has(r.date)).length : 0;
  const weekdayCover = new Set(completed.map(r => parseDs(r.date).getDay())).size;

  return buildList(MONTHLY_QUESTS, {
    m_weeks2:weeksCleared, m_weeks3:weeksCleared,
    m_complete15:completed.length, m_complete22:completed.length,
    m_streak7:streak, m_streak10:streak, m_streak15:streak,
    m_buddy5:buddy, m_buddy10:buddy,
    m_exercise10:inMonth.filter(exerciseDone).length,
    m_exercise16:inMonth.filter(exerciseDone).length,
    m_allgreen5:inMonth.filter(allGreenDay).length,
    m_allgreen10:inMonth.filter(allGreenDay).length,
    m_weekday:weekdayCover,
    m_noskip:noTwoDayGap(inMonth, mStart, days) ? 1 : 0,
    m_loss:  delta!=null && delta <= -1 ? 1 : 0,
    m_loss2: delta!=null && delta <= -2 ? 1 : 0,
  });
}

/** 친구와 같은 날 완주 — 그날 완주한 사람이 2명 이상일 때만, 완주자에게만 적립 */
export function buddyCompletedDates(othersRecords){
  const set = new Set();
  for (const recs of othersRecords || [])
    for (const r of recs || []) if (isDailyComplete(r)) set.add(r.date);
  return set;
}

// ── 계산 유틸 ───────────────────────────────────────────────────────────────
function recordsInRange(records, startStr, days){
  const d = parseDs(startStr);
  const end = ds(new Date(d.getFullYear(), d.getMonth(), d.getDate()+days-1));
  return (records||[]).filter(r => r.date>=startStr && r.date<=end);
}
/** 기간 내 첫 기록 → 마지막 기록 체중 변화 */
function periodDelta(list){
  const w = list.filter(r=>r.weight!=null).sort((a,b)=>a.date.localeCompare(b.date));
  if (w.length < 2) return null;
  return +(w[w.length-1].weight - w[0].weight).toFixed(2);
}
function longestStreak(list, startStr, days){
  const map = new Map(list.map(r=>[r.date,r]));
  const d = parseDs(startStr);
  let best=0, run=0;
  for(let i=0;i<days;i++){
    const key = ds(new Date(d.getFullYear(), d.getMonth(), d.getDate()+i));
    if (isDailyComplete(map.get(key))) { run++; best=Math.max(best,run); } else run=0;
  }
  return best;
}
/** 오늘까지 기준으로 2일 연속 결석이 한 번도 없었는가 */
function noTwoDayGap(list, startStr, days){
  const map = new Map(list.map(r=>[r.date,r]));
  const d = parseDs(startStr);
  const today = activityDay();
  let gap = 0;
  for(let i=0;i<days;i++){
    const key = ds(new Date(d.getFullYear(), d.getMonth(), d.getDate()+i));
    if (key > today) break;
    if (isDailyComplete(map.get(key))) gap = 0;
    else { gap++; if (gap >= 2) return false; }
  }
  return true;
}

function buildList(defs, cur){
  return defs.map(q => {
    const value = clamp(cur[q.id] ?? 0, 0, q.goal);
    const done  = value >= q.goal;
    // 부분점수 없음 — 목표를 채워야만 지급
    return { ...q, value, done, ratio: q.goal ? value/q.goal : 0,
             earned: done ? q.points : 0 };
  });
}

/** 상한 적용 획득량 — 달성한 퀘스트 배점 합을 cap으로 자른다 */
export function cappedEarned(list, cap){
  const raw = list.reduce((s,q)=>s+q.earned, 0);
  return cap == null ? raw : Math.min(raw, cap);
}
export const sumPoints = list => list.reduce((s,q)=>s+q.points,0);
export const rawEarned = list => list.reduce((s,q)=>s+q.earned,0);

/** 상한까지 남은 포인트 */
export const remainingToCap = (list, cap) => Math.max(0, cap - cappedEarned(list, cap));

export function daysLeftInWeek(refDate = activityDay()){
  return 7 - parseDs(refDate).getDay();
}
export function daysLeftInMonth(refDate = activityDay()){
  const d = parseDs(refDate);
  return new Date(d.getFullYear(), d.getMonth()+1, 0).getDate() - d.getDate() + 1;
}
