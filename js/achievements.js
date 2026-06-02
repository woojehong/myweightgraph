// ── 업적 시작일 ──────────────────────────────────────────────────────
export const ACHIEVEMENT_START_DATE = '2026-03-01';

// ── 카테고리 ─────────────────────────────────────────────────────────
export const ACHIEVEMENT_CATEGORIES = [
  { id:'record',  label:'기록', icon:'📝' },
  { id:'loss',    label:'감량', icon:'📉' },
  { id:'goal',    label:'목표', icon:'🎯' },
  { id:'daily',   label:'일간', icon:'📆' },
  { id:'weekly',  label:'주간', icon:'📅' },
  { id:'monthly', label:'월간', icon:'🗓️' },
];

// ── 업적 목록 (74개) ─────────────────────────────────────────────────
export const ACHIEVEMENTS = [

  // ── 기록 (17개) ──────────────────────────────────────────────────
  { id:'record_1',    cat:'record', name:'첫 발걸음',     desc:'처음으로 체중을 기록했어요',    score:5,  icon:'👣' },
  { id:'record_5',    cat:'record', name:'5회 달성',      desc:'5번의 기록이 쌓였어요',         score:5,  icon:'📝' },
  { id:'record_10',   cat:'record', name:'10회 달성',     desc:'10번의 기록이 쌓였어요',        score:5,  icon:'📝' },
  { id:'record_20',   cat:'record', name:'20회 달성',     desc:'20번의 기록이 쌓였어요',        score:10, icon:'📋' },
  { id:'record_30',   cat:'record', name:'30회 달성',     desc:'30번의 기록이 쌓였어요',        score:10, icon:'📋' },
  { id:'record_40',   cat:'record', name:'40회 달성',     desc:'40번의 기록이 쌓였어요',        score:10, icon:'📋' },
  { id:'record_50',   cat:'record', name:'50회 달성',     desc:'50번의 기록이 쌓였어요',        score:15, icon:'📊' },
  { id:'record_70',   cat:'record', name:'70회 달성',     desc:'70번의 기록이 쌓였어요',        score:15, icon:'📊' },
  { id:'record_100',  cat:'record', name:'100회 달성',    desc:'100번의 기록이 쌓였어요',       score:20, icon:'💯' },
  { id:'record_120',  cat:'record', name:'120회 달성',    desc:'120번의 기록이 쌓였어요',       score:20, icon:'💯' },
  { id:'record_150',  cat:'record', name:'150회 달성',    desc:'150번의 기록이 쌓였어요',       score:25, icon:'🏅' },
  { id:'record_200',  cat:'record', name:'200회 달성',    desc:'200번의 기록이 쌓였어요',       score:25, icon:'🏅' },
  { id:'record_250',  cat:'record', name:'250회 달성',    desc:'250번의 기록이 쌓였어요',       score:30, icon:'⭐' },
  { id:'record_300',  cat:'record', name:'300회 달성',    desc:'300번의 기록이 쌓였어요',       score:35, icon:'⭐' },
  { id:'record_365',  cat:'record', name:'365의 기적',    desc:'365번의 기록이 쌓였어요',       score:50, icon:'🌟', legendary:true },
  { id:'record_500',  cat:'record', name:'500회 위업',    desc:'500번의 기록이 쌓였어요',       score:50, icon:'💎', legendary:true },
  { id:'record_1000', cat:'record', name:'천 번의 의지',  desc:'1000번의 기록이 쌓였어요',      score:50, icon:'👑', legendary:true },

  // ── 감량 (10개) ──────────────────────────────────────────────────
  { id:'loss_1pct',  cat:'loss', name:'첫 감량',    desc:'기준 체중 대비 1% 감량',              score:10, icon:'📉' },
  { id:'loss_2pct',  cat:'loss', name:'2% 돌파',    desc:'기준 체중 대비 2% 감량',              score:10, icon:'📉' },
  { id:'loss_3pct',  cat:'loss', name:'3% 돌파',    desc:'기준 체중 대비 3% 감량',              score:10, icon:'📉' },
  { id:'loss_5pct',  cat:'loss', name:'5% 클럽',    desc:'기준 체중 대비 5% 감량',              score:15, icon:'🔥' },
  { id:'loss_7pct',  cat:'loss', name:'7% 달성',    desc:'기준 체중 대비 7% 감량',              score:15, icon:'🔥' },
  { id:'loss_10pct', cat:'loss', name:'10% 돌파',   desc:'기준 체중 대비 10% 감량',             score:20, icon:'💪' },
  { id:'loss_15pct', cat:'loss', name:'15% 달성',   desc:'15% 감량 또는 BMI 23.5 이하',         score:25, icon:'💪', bmiThreshold:23.5 },
  { id:'loss_20pct', cat:'loss', name:'20% 달성',   desc:'20% 감량 또는 BMI 23 이하',           score:30, icon:'⚡', bmiThreshold:23   },
  { id:'loss_25pct', cat:'loss', name:'25% 달성',   desc:'25% 감량 또는 BMI 22.5 이하',         score:40, icon:'⚡', bmiThreshold:22.5 },
  { id:'loss_30pct', cat:'loss', name:'30% 위업',   desc:'30% 감량 또는 BMI 22 이하',           score:50, icon:'👑', legendary:true, bmiThreshold:22 },

  // ── 목표 (6개) ───────────────────────────────────────────────────
  { id:'goal_set',      cat:'goal', name:'목표 설정',     desc:'목표 체중을 처음으로 설정했어요',              score:10, icon:'🎯' },
  { id:'goal_10pct',    cat:'goal', name:'목표까지 10%',  desc:'목표까지의 여정 중 10%를 달성했어요',          score:10, icon:'🎯' },
  { id:'goal_25pct',    cat:'goal', name:'목표까지 25%',  desc:'목표까지의 여정 중 25%를 달성했어요',          score:15, icon:'🎯' },
  { id:'goal_50pct',    cat:'goal', name:'목표까지 50%',  desc:'목표까지의 여정 중 절반을 달성했어요',         score:25, icon:'🎯' },
  { id:'goal_75pct',    cat:'goal', name:'목표까지 75%',  desc:'목표까지의 여정 중 75%를 달성했어요',          score:35, icon:'🎯' },
  { id:'goal_achieved', cat:'goal', name:'목표 달성!',    desc:'설정한 목표 체중에 도달했어요',               score:50, icon:'🏆', legendary:true },

  // ── 일간 (12개) ──────────────────────────────────────────────────
  { id:'daily_1',   cat:'daily', name:'첫 최저 갱신',    desc:'처음으로 최저 체중을 갱신했어요',  score:5,  icon:'📆' },
  { id:'daily_5',   cat:'daily', name:'5회 갱신',        desc:'최저 체중을 5번 경신했어요',       score:5,  icon:'📆' },
  { id:'daily_10',  cat:'daily', name:'10회 갱신',       desc:'최저 체중을 10번 경신했어요',      score:10, icon:'📆' },
  { id:'daily_20',  cat:'daily', name:'20회 갱신',       desc:'최저 체중을 20번 경신했어요',      score:10, icon:'📆' },
  { id:'daily_30',  cat:'daily', name:'30회 갱신',       desc:'최저 체중을 30번 경신했어요',      score:15, icon:'⭐' },
  { id:'daily_40',  cat:'daily', name:'40회 갱신',       desc:'최저 체중을 40번 경신했어요',      score:15, icon:'⭐' },
  { id:'daily_50',  cat:'daily', name:'50회 갱신',       desc:'최저 체중을 50번 경신했어요',      score:20, icon:'⭐' },
  { id:'daily_60',  cat:'daily', name:'60회 갱신',       desc:'최저 체중을 60번 경신했어요',      score:25, icon:'💎' },
  { id:'daily_70',  cat:'daily', name:'70회 갱신',       desc:'최저 체중을 70번 경신했어요',      score:25, icon:'💎' },
  { id:'daily_80',  cat:'daily', name:'80회 갱신',       desc:'최저 체중을 80번 경신했어요',      score:30, icon:'💎' },
  { id:'daily_90',  cat:'daily', name:'90회 갱신',       desc:'최저 체중을 90번 경신했어요',      score:35, icon:'💎' },
  { id:'daily_100', cat:'daily', name:'100회 갱신 위업', desc:'최저 체중을 100번 경신했어요',     score:50, icon:'👑', legendary:true },

  // ── 주간 — 감량 (10개) + 입력횟수 (3개) ─────────────────────────
  { id:'weekly_1',       cat:'weekly', name:'첫 주간 감량',    desc:'전주 평균보다 낮아진 주 1회',       score:5,  icon:'📅' },
  { id:'weekly_2',       cat:'weekly', name:'2주 감량',        desc:'전주 평균보다 낮아진 주 2회 누적',  score:5,  icon:'📅' },
  { id:'weekly_3',       cat:'weekly', name:'3주 감량',        desc:'전주 평균보다 낮아진 주 3회 누적',  score:10, icon:'📅' },
  { id:'weekly_4',       cat:'weekly', name:'4주 감량',        desc:'전주 평균보다 낮아진 주 4회 누적',  score:10, icon:'📅' },
  { id:'weekly_5',       cat:'weekly', name:'5주 감량',        desc:'전주 평균보다 낮아진 주 5회 누적',  score:10, icon:'📅' },
  { id:'weekly_10',      cat:'weekly', name:'10주 감량',       desc:'전주 평균보다 낮아진 주 10회 누적', score:15, icon:'📅' },
  { id:'weekly_15',      cat:'weekly', name:'15주 감량',       desc:'전주 평균보다 낮아진 주 15회 누적', score:20, icon:'📅' },
  { id:'weekly_20',      cat:'weekly', name:'20주 감량',       desc:'전주 평균보다 낮아진 주 20회 누적', score:25, icon:'📅' },
  { id:'weekly_25',      cat:'weekly', name:'25주 감량',       desc:'전주 평균보다 낮아진 주 25회 누적', score:35, icon:'📅' },
  { id:'weekly_30',      cat:'weekly', name:'30주 감량 위업',  desc:'전주 평균보다 낮아진 주 30회 누적', score:50, icon:'👑', legendary:true },
  { id:'weekly_input_3', cat:'weekly', name:'주 3회 입력',     desc:'한 주에 3회 이상 기록한 주 최초 달성', score:10, icon:'✏️' },
  { id:'weekly_input_5', cat:'weekly', name:'주 5회 입력',     desc:'한 주에 5회 이상 기록한 주 최초 달성', score:15, icon:'✏️' },
  { id:'weekly_input_7', cat:'weekly', name:'주 7회 개근',     desc:'한 주에 7회 모두 기록한 주 최초 달성', score:25, icon:'🏆' },

  // ── 월간 — 입력횟수 (13개) + 감량 (3개) ─────────────────────────
  { id:'monthly_10',    cat:'monthly', name:'월간 10회',      desc:'한 달에 10회 이상 기록한 달 달성',    score:5,  icon:'🗓️' },
  { id:'monthly_20',    cat:'monthly', name:'월간 20회',      desc:'한 달에 20회 이상 기록한 달 달성',    score:10, icon:'🗓️' },
  { id:'monthly_20x2',  cat:'monthly', name:'2개월 달성',     desc:'월 20회+ 기록 2개월 누적',            score:10, icon:'🗓️' },
  { id:'monthly_20x3',  cat:'monthly', name:'3개월 달성',     desc:'월 20회+ 기록 3개월 누적',            score:15, icon:'🗓️' },
  { id:'monthly_20x4',  cat:'monthly', name:'4개월 달성',     desc:'월 20회+ 기록 4개월 누적',            score:15, icon:'🗓️' },
  { id:'monthly_20x5',  cat:'monthly', name:'5개월 달성',     desc:'월 20회+ 기록 5개월 누적',            score:20, icon:'🗓️' },
  { id:'monthly_20x6',  cat:'monthly', name:'6개월 달성',     desc:'월 20회+ 기록 6개월 누적',            score:20, icon:'🗓️' },
  { id:'monthly_20x7',  cat:'monthly', name:'7개월 달성',     desc:'월 20회+ 기록 7개월 누적',            score:25, icon:'🗓️' },
  { id:'monthly_20x8',  cat:'monthly', name:'8개월 달성',     desc:'월 20회+ 기록 8개월 누적',            score:25, icon:'🗓️' },
  { id:'monthly_20x9',  cat:'monthly', name:'9개월 달성',     desc:'월 20회+ 기록 9개월 누적',            score:30, icon:'🗓️' },
  { id:'monthly_20x10', cat:'monthly', name:'10개월 달성',    desc:'월 20회+ 기록 10개월 누적',           score:30, icon:'🗓️' },
  { id:'monthly_20x11', cat:'monthly', name:'11개월 달성',    desc:'월 20회+ 기록 11개월 누적',           score:35, icon:'🗓️' },
  { id:'monthly_20x12', cat:'monthly', name:'1년 달성 위업',  desc:'월 20회+ 기록 12개월 누적',           score:50, icon:'🌟', legendary:true },
  { id:'monthly_dec_1', cat:'monthly', name:'월간 감량 1개월',desc:'15회+ 입력 월 기준 연속 감량 1개월',  score:30, icon:'📉' },
  { id:'monthly_dec_2', cat:'monthly', name:'월간 감량 2개월',desc:'15회+ 입력 월 기준 연속 감량 2개월',  score:40, icon:'📉' },
  { id:'monthly_dec_3', cat:'monthly', name:'월간 감량 위업', desc:'15회+ 입력 월 기준 연속 감량 3개월',  score:50, icon:'👑', legendary:true },
];

// ── 공통 데이터 추출 ─────────────────────────────────────────────────
function extractData(records, user) {
  const all    = records.filter(r => r.weight != null).sort((a,b) => a.date.localeCompare(b.date));
  const active = all.filter(r => r.date >= ACHIEVEMENT_START_DATE);
  const height = user?.height;
  const goal   = user?.goal;
  const refW   = user?.referenceWeight || (all.length ? Math.max(...all.map(r=>r.weight)) : 0);

  const activeMin = active.length ? Math.min(...active.map(r=>r.weight)) : refW;
  const bestBmi   = height ? activeMin / ((height/100)**2) : null;
  const lossPct   = refW > 0 ? (refW - activeMin) / refW * 100 : 0;

  // 목표 진행률
  const goalPct = (goal && refW > goal)
    ? Math.max(0, (refW - activeMin) / (refW - goal) * 100)
    : 0;

  // 일간 갱신 횟수
  let renewals = 0;
  if (active.length > 0) {
    let runMin = active[0].weight;
    for (let i = 1; i < active.length; i++) {
      if (active[i].weight < runMin) { runMin = active[i].weight; renewals++; }
    }
  }

  // 주간 (일요일 기준)
  const weekMap = {};
  active.forEach(r => {
    const d = new Date(r.date + 'T00:00:00');
    const sun = new Date(d); sun.setDate(d.getDate() - d.getDay());
    const wk = sun.toISOString().slice(0,10);
    if (!weekMap[wk]) weekMap[wk] = [];
    weekMap[wk].push(r.weight);
  });
  const weekEntries = Object.values(weekMap);
  const weekAvgs = Object.entries(weekMap)
    .sort((a,b) => a[0].localeCompare(b[0]))
    .map(([,ws]) => ws.reduce((s,w)=>s+w,0)/ws.length);
  let weekDec = 0;
  for (let i = 1; i < weekAvgs.length; i++) if (weekAvgs[i] < weekAvgs[i-1]) weekDec++;
  const maxWeeklyEntries = weekEntries.length ? Math.max(...weekEntries.map(e=>e.length)) : 0;

  // 월간 입력
  const monthMap = {};
  active.forEach(r => {
    const ym = r.date.slice(0,7);
    if (!monthMap[ym]) monthMap[ym] = { count:0, sum:0 };
    monthMap[ym].count++;
    monthMap[ym].sum += r.weight;
  });
  const m10 = Object.values(monthMap).filter(d=>d.count>=10).length;
  const m20 = Object.values(monthMap).filter(d=>d.count>=20).length;

  // 월간 감량 (15회+ 연속)
  const qualMonths = Object.entries(monthMap)
    .filter(([,d]) => d.count >= 15)
    .sort((a,b) => a[0].localeCompare(b[0]))
    .map(([ym,d]) => ({ ym, avg: d.sum/d.count }));
  let maxDecStreak = 0, streak = 0;
  for (let i = 1; i < qualMonths.length; i++) {
    const [py,pm] = qualMonths[i-1].ym.split('-').map(Number);
    const [cy,cm] = qualMonths[i].ym.split('-').map(Number);
    const isConsec = (cy*12+cm) === (py*12+pm+1);
    if (isConsec && qualMonths[i].avg < qualMonths[i-1].avg) {
      streak++; maxDecStreak = Math.max(maxDecStreak, streak);
    } else { streak = 0; }
  }

  return {
    total: active.length, refW, activeMin, lossPct, bestBmi,
    goal, goalPct,
    renewals,
    weekDec, maxWeeklyEntries,
    m10, m20, maxDecStreak
  };
}

// ── 업적 달성 계산 ────────────────────────────────────────────────────
export function calculateEarnedIds(records, user) {
  const earned = new Set();
  if (!records.filter(r=>r.weight!=null).length) return earned;

  const { total, lossPct, bestBmi, goal, goalPct, renewals,
          weekDec, maxWeeklyEntries, m10, m20, maxDecStreak } = extractData(records, user);

  // 기록
  [1,5,10,20,30,40,50,70,100,120,150,200,250,300,365,500,1000].forEach(n => {
    if (total >= n) earned.add(`record_${n}`);
  });

  // 감량
  if (lossPct>=1)  earned.add('loss_1pct');
  if (lossPct>=2)  earned.add('loss_2pct');
  if (lossPct>=3)  earned.add('loss_3pct');
  if (lossPct>=5)  earned.add('loss_5pct');
  if (lossPct>=7)  earned.add('loss_7pct');
  if (lossPct>=10) earned.add('loss_10pct');
  if (lossPct>=15||(bestBmi!==null&&bestBmi<=23.5)) earned.add('loss_15pct');
  if (lossPct>=20||(bestBmi!==null&&bestBmi<=23))   earned.add('loss_20pct');
  if (lossPct>=25||(bestBmi!==null&&bestBmi<=22.5)) earned.add('loss_25pct');
  if (lossPct>=30||(bestBmi!==null&&bestBmi<=22))   earned.add('loss_30pct');

  // 목표
  if (goal) earned.add('goal_set');
  if (goalPct>=10)  earned.add('goal_10pct');
  if (goalPct>=25)  earned.add('goal_25pct');
  if (goalPct>=50)  earned.add('goal_50pct');
  if (goalPct>=75)  earned.add('goal_75pct');
  const activeMin = records.filter(r=>r.weight!=null&&r.date>=ACHIEVEMENT_START_DATE)
                           .reduce((m,r)=>Math.min(m,r.weight),Infinity);
  if (goal && activeMin<=goal) earned.add('goal_achieved');

  // 일간
  [1,5,10,20,30,40,50,60,70,80,90,100].forEach(n => {
    if (renewals >= n) earned.add(`daily_${n}`);
  });

  // 주간 감량
  [1,2,3,4,5,10,15,20,25,30].forEach(n => {
    if (weekDec >= n) earned.add(`weekly_${n}`);
  });
  // 주간 입력
  if (maxWeeklyEntries>=3) earned.add('weekly_input_3');
  if (maxWeeklyEntries>=5) earned.add('weekly_input_5');
  if (maxWeeklyEntries>=7) earned.add('weekly_input_7');

  // 월간 입력
  if (m10>=1)  earned.add('monthly_10');
  if (m20>=1)  earned.add('monthly_20');
  [2,3,4,5,6,7,8,9,10,11,12].forEach(n => {
    if (m20>=n) earned.add(`monthly_20x${n}`);
  });
  // 월간 감량
  if (maxDecStreak>=1) earned.add('monthly_dec_1');
  if (maxDecStreak>=2) earned.add('monthly_dec_2');
  if (maxDecStreak>=3) earned.add('monthly_dec_3');

  return earned;
}

// ── 진행상황 계산 ────────────────────────────────────────────────────
export function calculateProgress(records, user) {
  const { total, lossPct, goalPct, goal, renewals,
          weekDec, maxWeeklyEntries, m10, m20, maxDecStreak } = extractData(records, user);
  const p = (cur, tgt) => ({ current: Math.min(cur, tgt), target: tgt });

  return {
    // 기록
    record_1:p(total,1),record_5:p(total,5),record_10:p(total,10),
    record_20:p(total,20),record_30:p(total,30),record_40:p(total,40),
    record_50:p(total,50),record_70:p(total,70),record_100:p(total,100),
    record_120:p(total,120),record_150:p(total,150),record_200:p(total,200),
    record_250:p(total,250),record_300:p(total,300),
    record_365:p(total,365),record_500:p(total,500),record_1000:p(total,1000),
    // 감량
    loss_1pct:p(lossPct,1),loss_2pct:p(lossPct,2),loss_3pct:p(lossPct,3),
    loss_5pct:p(lossPct,5),loss_7pct:p(lossPct,7),loss_10pct:p(lossPct,10),
    loss_15pct:p(lossPct,15),loss_20pct:p(lossPct,20),
    loss_25pct:p(lossPct,25),loss_30pct:p(lossPct,30),
    // 목표
    goal_set:p(goal?1:0,1),
    goal_10pct:p(goalPct,10),goal_25pct:p(goalPct,25),
    goal_50pct:p(goalPct,50),goal_75pct:p(goalPct,75),goal_achieved:p(goalPct,100),
    // 일간
    daily_1:p(renewals,1),daily_5:p(renewals,5),daily_10:p(renewals,10),
    daily_20:p(renewals,20),daily_30:p(renewals,30),daily_40:p(renewals,40),
    daily_50:p(renewals,50),daily_60:p(renewals,60),daily_70:p(renewals,70),
    daily_80:p(renewals,80),daily_90:p(renewals,90),daily_100:p(renewals,100),
    // 주간 감량
    weekly_1:p(weekDec,1),weekly_2:p(weekDec,2),weekly_3:p(weekDec,3),
    weekly_4:p(weekDec,4),weekly_5:p(weekDec,5),weekly_10:p(weekDec,10),
    weekly_15:p(weekDec,15),weekly_20:p(weekDec,20),
    weekly_25:p(weekDec,25),weekly_30:p(weekDec,30),
    // 주간 입력
    weekly_input_3:p(maxWeeklyEntries,3),
    weekly_input_5:p(maxWeeklyEntries,5),
    weekly_input_7:p(maxWeeklyEntries,7),
    // 월간 입력
    monthly_10:p(m10,1),monthly_20:p(m20,1),
    monthly_20x2:p(m20,2),monthly_20x3:p(m20,3),monthly_20x4:p(m20,4),
    monthly_20x5:p(m20,5),monthly_20x6:p(m20,6),monthly_20x7:p(m20,7),
    monthly_20x8:p(m20,8),monthly_20x9:p(m20,9),monthly_20x10:p(m20,10),
    monthly_20x11:p(m20,11),monthly_20x12:p(m20,12),
    // 월간 감량
    monthly_dec_1:p(maxDecStreak,1),monthly_dec_2:p(maxDecStreak,2),monthly_dec_3:p(maxDecStreak,3),
  };
}

// ── 점수 계산 ────────────────────────────────────────────────────────
export function calcTotalScore(earnedIds) {
  return [...earnedIds].reduce((sum,id) => {
    const a = ACHIEVEMENTS.find(x=>x.id===id);
    return sum + (a?a.score:0);
  }, 0);
}

// ── 티어 기본값 ──────────────────────────────────────────────────────
export const DEFAULT_TIERS = [
  { id:'iron',        name:'아이언',       minScore:0,    color:'#8B8B8B' },
  { id:'bronze',      name:'브론즈',       minScore:80,   color:'#CD7F32' },
  { id:'silver',      name:'실버',         minScore:200,  color:'#A8A8A8' },
  { id:'gold',        name:'골드',         minScore:380,  color:'#FFD700' },
  { id:'platinum',    name:'플래티넘',     minScore:580,  color:'#E5E4E2' },
  { id:'diamond',     name:'다이아몬드',   minScore:800,  color:'#89CFF0' },
  { id:'master',      name:'마스터',       minScore:1000, color:'#9B59B6' },
  { id:'grandmaster', name:'그랜드마스터', minScore:1250, color:'#E74C3C' },
  { id:'challenger',  name:'챌린저',       minScore:1500, color:'#F39C12' },
];

export function getTierForScore(score, tiers=DEFAULT_TIERS) {
  return [...tiers].sort((a,b)=>b.minScore-a.minScore).find(t=>score>=t.minScore)
    || tiers[0];
}
