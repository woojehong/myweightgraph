// achievements.js

export const ACHIEVEMENT_START_DATE = '2026-03-01';

export const ACHIEVEMENT_CATEGORIES = [
  { id:'record',   label:'기록',  icon:'📝' },
  { id:'loss',     label:'감량',  icon:'📉' },
  { id:'goal',     label:'목표',  icon:'🎯' },
  { id:'daily',    label:'일간',  icon:'📆' },
  { id:'weekly',   label:'주간',  icon:'📅' },
  { id:'monthly',  label:'월간',  icon:'🗓️' },
  { id:'diet',     label:'식단',  icon:'🥗' },
  { id:'exercise', label:'운동',  icon:'💪' },
];

export const ACHIEVEMENTS = [

  // ── 기록 ─────────────────────────────────────────────────────────
  { id:'record_1',    cat:'record', name:'첫 발걸음',    desc:'처음으로 체중을 기록했어요',            score:10, icon:'👣' },
  { id:'record_5',    cat:'record', name:'5회 달성',     desc:'5번의 기록이 쌓였어요',                 score:10, icon:'📝' },
  { id:'record_10',   cat:'record', name:'10회 달성',    desc:'10번의 기록이 쌓였어요',                score:10, icon:'📝' },
  { id:'record_20',   cat:'record', name:'20회 달성',    desc:'20번의 기록이 쌓였어요',                score:10, icon:'📋' },
  { id:'record_30',   cat:'record', name:'30회 달성',    desc:'30번의 기록이 쌓였어요',                score:10, icon:'📋' },
  { id:'record_40',   cat:'record', name:'40회 달성',    desc:'40번의 기록이 쌓였어요',                score:10, icon:'📋' },
  { id:'record_50',   cat:'record', name:'50회 달성',    desc:'50번의 기록이 쌓였어요',                score:20, icon:'📊' },
  { id:'record_70',   cat:'record', name:'70회 달성',    desc:'70번의 기록이 쌓였어요',                score:20, icon:'📊' },
  { id:'record_100',  cat:'record', name:'100회 달성',   desc:'100번의 기록이 쌓였어요',               score:20, icon:'💯' },
  { id:'record_120',  cat:'record', name:'120회 달성',   desc:'120번의 기록이 쌓였어요',               score:20, icon:'💯' },
  { id:'record_150',  cat:'record', name:'150회 달성',   desc:'150번의 기록이 쌓였어요',               score:30, icon:'🏅' },
  { id:'record_200',  cat:'record', name:'200회 달성',   desc:'200번의 기록이 쌓였어요',               score:30, icon:'🏅' },
  { id:'record_250',  cat:'record', name:'250회 달성',   desc:'250번의 기록이 쌓였어요',               score:30, icon:'⭐' },
  { id:'record_300',  cat:'record', name:'300회 달성',   desc:'300번의 기록이 쌓였어요',               score:40, icon:'⭐' },
  { id:'record_365',  cat:'record', name:'365의 기적',   desc:'365번의 기록이 쌓였어요',               score:50, icon:'🌟', legendary:true },
  { id:'record_500',  cat:'record', name:'500회 위업',   desc:'500번의 기록이 쌓였어요',               score:50, icon:'💎', legendary:true },
  { id:'record_1000', cat:'record', name:'천 번의 의지', desc:'1000번의 기록이 쌓였어요',              score:50, icon:'👑', legendary:true },

  // ── 감량 ─────────────────────────────────────────────────────────
  { id:'loss_1pct',  cat:'loss', name:'첫 감량',   desc:'기준 체중 대비 1% 감량',                      score:10, icon:'📉' },
  { id:'loss_2pct',  cat:'loss', name:'2% 돌파',   desc:'기준 체중 대비 2% 감량',                      score:10, icon:'📉' },
  { id:'loss_3pct',  cat:'loss', name:'3% 돌파',   desc:'기준 체중 대비 3% 감량',                      score:10, icon:'📉' },
  { id:'loss_5pct',  cat:'loss', name:'5% 클럽',   desc:'기준 체중 대비 5% 감량',                      score:20, icon:'🔥' },
  { id:'loss_7pct',  cat:'loss', name:'7% 달성',   desc:'기준 체중 대비 7% 감량',                      score:20, icon:'🔥' },
  { id:'loss_10pct', cat:'loss', name:'10% 돌파',  desc:'기준 체중 대비 10% 감량',                     score:20, icon:'💪' },
  { id:'loss_15pct', cat:'loss', name:'15% 달성',  desc:'15% 감량 또는 BMI 23.5 이하',                 score:30, icon:'💪', bmiThreshold:23.5 },
  { id:'loss_20pct', cat:'loss', name:'20% 달성',  desc:'20% 감량 또는 BMI 23 이하',                   score:30, icon:'⚡', bmiThreshold:23   },
  { id:'loss_25pct', cat:'loss', name:'25% 달성',  desc:'25% 감량 또는 BMI 22.5 이하',                 score:40, icon:'⚡', bmiThreshold:22.5 },
  { id:'loss_30pct', cat:'loss', name:'30% 위업',  desc:'30% 감량 또는 BMI 22 이하',                   score:50, icon:'👑', legendary:true, bmiThreshold:22 },

  // ── 목표 ─────────────────────────────────────────────────────────
  { id:'goal_set',      cat:'goal', name:'목표 설정',    desc:'목표 체중을 처음으로 설정했어요',         score:10, icon:'🎯' },
  { id:'goal_10pct',    cat:'goal', name:'목표까지 10%', desc:'목표까지의 여정 중 10%를 달성했어요',     score:10, icon:'🎯' },
  { id:'goal_25pct',    cat:'goal', name:'목표까지 25%', desc:'목표까지의 여정 중 25%를 달성했어요',     score:20, icon:'🎯' },
  { id:'goal_50pct',    cat:'goal', name:'목표까지 50%', desc:'목표까지의 여정 중 절반을 달성했어요',    score:30, icon:'🎯' },
  { id:'goal_75pct',    cat:'goal', name:'목표까지 75%', desc:'목표까지의 여정 중 75%를 달성했어요',     score:40, icon:'🎯' },
  { id:'goal_achieved', cat:'goal', name:'목표 달성!',   desc:'설정한 목표 체중에 도달했어요',            score:50, icon:'🏆', legendary:true },

  // ── 일간 — 체중 갱신 ─────────────────────────────────────────────
  { id:'daily_1',   cat:'daily', name:'첫 최저 갱신',    desc:'처음으로 최저 체중을 갱신했어요',         score:10, icon:'📆' },
  { id:'daily_5',   cat:'daily', name:'5회 갱신',        desc:'최저 체중을 5번 경신했어요',              score:10, icon:'📆' },
  { id:'daily_10',  cat:'daily', name:'10회 갱신',       desc:'최저 체중을 10번 경신했어요',             score:10, icon:'📆' },
  { id:'daily_20',  cat:'daily', name:'20회 갱신',       desc:'최저 체중을 20번 경신했어요',             score:10, icon:'📆' },
  { id:'daily_30',  cat:'daily', name:'30회 갱신',       desc:'최저 체중을 30번 경신했어요',             score:20, icon:'⭐' },
  { id:'daily_40',  cat:'daily', name:'40회 갱신',       desc:'최저 체중을 40번 경신했어요',             score:20, icon:'⭐' },
  { id:'daily_50',  cat:'daily', name:'50회 갱신',       desc:'최저 체중을 50번 경신했어요',             score:20, icon:'⭐' },
  { id:'daily_60',  cat:'daily', name:'60회 갱신',       desc:'최저 체중을 60번 경신했어요',             score:30, icon:'💎' },
  { id:'daily_70',  cat:'daily', name:'70회 갱신',       desc:'최저 체중을 70번 경신했어요',             score:30, icon:'💎' },
  { id:'daily_80',  cat:'daily', name:'80회 갱신',       desc:'최저 체중을 80번 경신했어요',             score:30, icon:'💎' },
  { id:'daily_90',  cat:'daily', name:'90회 갱신',       desc:'최저 체중을 90번 경신했어요',             score:40, icon:'💎' },
  { id:'daily_100', cat:'daily', name:'100회 갱신 위업', desc:'최저 체중을 100번 경신했어요',            score:50, icon:'👑', legendary:true },

  // ── 일간 — 식단 기록 ─────────────────────────────────────────────
  { id:'diet_meal_1',   cat:'daily', name:'첫 식단 기록', desc:'3끼 모두 기록한 날 첫 달성',             score:10, icon:'🥗' },
  { id:'diet_meal_10',  cat:'daily', name:'식단 10회',    desc:'3끼 모두 기록한 날 10회 달성',           score:10, icon:'🥗' },
  { id:'diet_meal_20',  cat:'daily', name:'식단 20회',    desc:'3끼 모두 기록한 날 20회 달성',           score:20, icon:'🥗' },
  { id:'diet_meal_30',  cat:'daily', name:'식단 30회',    desc:'3끼 모두 기록한 날 30회 달성',           score:20, icon:'🥗' },
  { id:'diet_meal_50',  cat:'daily', name:'식단 50회',    desc:'3끼 모두 기록한 날 50회 달성',           score:30, icon:'🥗' },
  { id:'diet_meal_100', cat:'daily', name:'식단 100회',   desc:'3끼 모두 기록한 날 100회 달성',          score:40, icon:'🥗' },

  // ── 일간 — 운동 기록 ─────────────────────────────────────────────
  { id:'ex_1',   cat:'daily', name:'첫 운동 기록', desc:'처음으로 운동 체크마크를 달성했어요',           score:10, icon:'💪' },
  { id:'ex_10',  cat:'daily', name:'운동 10회',    desc:'운동 체크마크 10회 달성',                      score:10, icon:'💪' },
  { id:'ex_20',  cat:'daily', name:'운동 20회',    desc:'운동 체크마크 20회 달성',                      score:20, icon:'💪' },
  { id:'ex_30',  cat:'daily', name:'운동 30회',    desc:'운동 체크마크 30회 달성',                      score:20, icon:'💪' },
  { id:'ex_50',  cat:'daily', name:'운동 50회',    desc:'운동 체크마크 50회 달성',                      score:30, icon:'💪' },
  { id:'ex_100', cat:'daily', name:'운동 100회',   desc:'운동 체크마크 100회 달성',                     score:40, icon:'💪' },

  // ── 주간 — 체중 감량 ─────────────────────────────────────────────
  { id:'weekly_1',  cat:'weekly', name:'첫 주간 감량',   desc:'전주 평균보다 낮아진 주 1회',             score:10, icon:'📅' },
  { id:'weekly_2',  cat:'weekly', name:'2주 감량',       desc:'전주 평균보다 낮아진 주 2회 누적',        score:10, icon:'📅' },
  { id:'weekly_3',  cat:'weekly', name:'3주 감량',       desc:'전주 평균보다 낮아진 주 3회 누적',        score:10, icon:'📅' },
  { id:'weekly_4',  cat:'weekly', name:'4주 감량',       desc:'전주 평균보다 낮아진 주 4회 누적',        score:10, icon:'📅' },
  { id:'weekly_5',  cat:'weekly', name:'5주 감량',       desc:'전주 평균보다 낮아진 주 5회 누적',        score:10, icon:'📅' },
  { id:'weekly_10', cat:'weekly', name:'10주 감량',      desc:'전주 평균보다 낮아진 주 10회 누적',       score:20, icon:'📅' },
  { id:'weekly_15', cat:'weekly', name:'15주 감량',      desc:'전주 평균보다 낮아진 주 15회 누적',       score:20, icon:'📅' },
  { id:'weekly_20', cat:'weekly', name:'20주 감량',      desc:'전주 평균보다 낮아진 주 20회 누적',       score:30, icon:'📅' },
  { id:'weekly_25', cat:'weekly', name:'25주 감량',      desc:'전주 평균보다 낮아진 주 25회 누적',       score:40, icon:'📅' },
  { id:'weekly_30', cat:'weekly', name:'30주 감량 위업', desc:'전주 평균보다 낮아진 주 30회 누적',       score:50, icon:'👑', legendary:true },

  // ── 주간 — 체중 입력 ─────────────────────────────────────────────
  { id:'weekly_input_3', cat:'weekly', name:'주 3회 입력', desc:'한 주에 3회 이상 기록한 주 최초 달성',   score:10, icon:'✏️' },
  { id:'weekly_input_5', cat:'weekly', name:'주 5회 입력', desc:'한 주에 5회 이상 기록한 주 최초 달성',   score:20, icon:'✏️' },
  { id:'weekly_input_7', cat:'weekly', name:'주 7회 개근', desc:'한 주에 7회 모두 기록한 주 최초 달성',   score:30, icon:'🏆' },

  // ── 주간 — 식단 기록 ─────────────────────────────────────────────
  { id:'diet_week_1',  cat:'weekly', name:'주간 식단 1회',  desc:'주 18끼 이상 기록한 주 1회 달성',       score:10, icon:'🥗' },
  { id:'diet_week_2',  cat:'weekly', name:'주간 식단 2회',  desc:'주 18끼 이상 기록한 주 2회 누적',       score:10, icon:'🥗' },
  { id:'diet_week_4',  cat:'weekly', name:'주간 식단 4회',  desc:'주 18끼 이상 기록한 주 4회 누적',       score:20, icon:'🥗' },
  { id:'diet_week_8',  cat:'weekly', name:'주간 식단 8회',  desc:'주 18끼 이상 기록한 주 8회 누적',       score:30, icon:'🥗' },
  { id:'diet_week_12', cat:'weekly', name:'주간 식단 12회', desc:'주 18끼 이상 기록한 주 12회 누적',      score:40, icon:'🥗' },

  // ── 주간 — 운동 기록 ─────────────────────────────────────────────
  { id:'ex_week_1',  cat:'weekly', name:'주간 운동 1회',  desc:'주 3회 이상 운동한 주 1회 달성',          score:10, icon:'💪' },
  { id:'ex_week_2',  cat:'weekly', name:'주간 운동 2회',  desc:'주 3회 이상 운동한 주 2회 누적',          score:10, icon:'💪' },
  { id:'ex_week_4',  cat:'weekly', name:'주간 운동 4회',  desc:'주 3회 이상 운동한 주 4회 누적',          score:20, icon:'💪' },
  { id:'ex_week_8',  cat:'weekly', name:'주간 운동 8회',  desc:'주 3회 이상 운동한 주 8회 누적',          score:30, icon:'💪' },
  { id:'ex_week_12', cat:'weekly', name:'주간 운동 12회', desc:'주 3회 이상 운동한 주 12회 누적',         score:40, icon:'💪' },

  // ── 월간 — 체중 입력 ─────────────────────────────────────────────
  { id:'monthly_10',    cat:'monthly', name:'월간 10회',     desc:'한 달에 10회 이상 기록한 달 달성',      score:10, icon:'🗓️' },
  { id:'monthly_20',    cat:'monthly', name:'월간 20회',     desc:'한 달에 20회 이상 기록한 달 달성',      score:10, icon:'🗓️' },
  { id:'monthly_20x2',  cat:'monthly', name:'2개월 달성',    desc:'월 20회+ 기록 2개월 누적',              score:10, icon:'🗓️' },
  { id:'monthly_20x3',  cat:'monthly', name:'3개월 달성',    desc:'월 20회+ 기록 3개월 누적',              score:20, icon:'🗓️' },
  { id:'monthly_20x4',  cat:'monthly', name:'4개월 달성',    desc:'월 20회+ 기록 4개월 누적',              score:20, icon:'🗓️' },
  { id:'monthly_20x5',  cat:'monthly', name:'5개월 달성',    desc:'월 20회+ 기록 5개월 누적',              score:20, icon:'🗓️' },
  { id:'monthly_20x6',  cat:'monthly', name:'6개월 달성',    desc:'월 20회+ 기록 6개월 누적',              score:20, icon:'🗓️' },
  { id:'monthly_20x7',  cat:'monthly', name:'7개월 달성',    desc:'월 20회+ 기록 7개월 누적',              score:30, icon:'🗓️' },
  { id:'monthly_20x8',  cat:'monthly', name:'8개월 달성',    desc:'월 20회+ 기록 8개월 누적',              score:30, icon:'🗓️' },
  { id:'monthly_20x9',  cat:'monthly', name:'9개월 달성',    desc:'월 20회+ 기록 9개월 누적',              score:30, icon:'🗓️' },
  { id:'monthly_20x10', cat:'monthly', name:'10개월 달성',   desc:'월 20회+ 기록 10개월 누적',             score:30, icon:'🗓️' },
  { id:'monthly_20x11', cat:'monthly', name:'11개월 달성',   desc:'월 20회+ 기록 11개월 누적',             score:40, icon:'🗓️' },
  { id:'monthly_20x12', cat:'monthly', name:'1년 달성 위업', desc:'월 20회+ 기록 12개월 누적',             score:50, icon:'🌟', legendary:true },

  // ── 월간 — 체중 감량 ─────────────────────────────────────────────
  { id:'monthly_dec_1', cat:'monthly', name:'월간 감량 1개월', desc:'15회+ 입력 월 기준 연속 감량 1개월',  score:30, icon:'📉' },
  { id:'monthly_dec_2', cat:'monthly', name:'월간 감량 2개월', desc:'15회+ 입력 월 기준 연속 감량 2개월',  score:40, icon:'📉' },
  { id:'monthly_dec_3', cat:'monthly', name:'월간 감량 위업',  desc:'15회+ 입력 월 기준 연속 감량 3개월',  score:50, icon:'👑', legendary:true },

  // ── 월간 — 식단 기록 ─────────────────────────────────────────────
  { id:'diet_month_1', cat:'monthly', name:'월간 식단 1개월', desc:'한 달에 60끼 이상 기록한 달 달성',     score:20, icon:'🥗' },
  { id:'diet_month_2', cat:'monthly', name:'월간 식단 2개월', desc:'월 60끼+ 기록 2개월 누적',             score:30, icon:'🥗' },
  { id:'diet_month_3', cat:'monthly', name:'월간 식단 3개월', desc:'월 60끼+ 기록 3개월 누적',             score:40, icon:'🥗' },

  // ── 월간 — 운동 기록 ─────────────────────────────────────────────
  { id:'ex_month_1', cat:'monthly', name:'월간 운동 1개월', desc:'한 달에 15회 이상 운동한 달 달성',       score:20, icon:'💪' },
  { id:'ex_month_2', cat:'monthly', name:'월간 운동 2개월', desc:'월 15회+ 운동 2개월 누적',               score:30, icon:'💪' },
  { id:'ex_month_3', cat:'monthly', name:'월간 운동 3개월', desc:'월 15회+ 운동 3개월 누적',               score:40, icon:'💪' },

  // ── 식단 — 올 그린 ───────────────────────────────────────────────
  { id:'diet_green_1',  cat:'diet', name:'올 그린 1회',  desc:'하루 3끼 모두 초록 달성 1회',               score:10, icon:'🥦' },
  { id:'diet_green_5',  cat:'diet', name:'올 그린 5회',  desc:'하루 3끼 모두 초록 달성 5회',               score:20, icon:'🥦' },
  { id:'diet_green_10', cat:'diet', name:'올 그린 10회', desc:'하루 3끼 모두 초록 달성 10회',              score:30, icon:'🥦' },

  // ── 운동 — 연속 ──────────────────────────────────────────────────
  { id:'ex_streak_2', cat:'exercise', name:'운동 2일 연속', desc:'체크마크로 2일 연속 운동 달성',           score:10, icon:'🔥' },
  { id:'ex_streak_3', cat:'exercise', name:'운동 3일 연속', desc:'체크마크로 3일 연속 운동 달성',           score:20, icon:'🔥' },
  { id:'ex_streak_5', cat:'exercise', name:'운동 5일 연속', desc:'체크마크로 5일 연속 운동 달성',           score:30, icon:'🔥' },
];

const toDs = d =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

function extractData(records, user) {
  const all    = records.filter(r => r.weight != null).sort((a,b) => a.date.localeCompare(b.date));
  const active = all.filter(r => r.date >= ACHIEVEMENT_START_DATE);
  const height = user?.height, goal = user?.goal;
  const refW   = user?.referenceWeight || (all.length ? Math.max(...all.map(r=>r.weight)) : 0);
  const activeMin = active.length ? Math.min(...active.map(r=>r.weight)) : refW;
  const bestBmi   = height ? activeMin / ((height/100)**2) : null;
  const lossPct   = refW > 0 ? (refW - activeMin) / refW * 100 : 0;
  const goalPct   = (goal && refW > goal) ? Math.max(0,(refW-activeMin)/(refW-goal)*100) : 0;

  let renewals = 0;
  if (active.length > 0) {
    let runMin = active[0].weight;
    for (let i = 1; i < active.length; i++) {
      if (active[i].weight < runMin) { runMin = active[i].weight; renewals++; }
    }
  }

  const weekMap = {};
  active.forEach(r => {
    const d = new Date(r.date+'T00:00:00'), sun = new Date(d);
    sun.setDate(d.getDate()-d.getDay());
    const wk = toDs(sun);
    if (!weekMap[wk]) weekMap[wk] = [];
    weekMap[wk].push(r.weight);
  });
  const weekEntries = Object.values(weekMap);
  const weekAvgs = Object.entries(weekMap).sort((a,b)=>a[0].localeCompare(b[0]))
    .map(([,ws])=>ws.reduce((s,w)=>s+w,0)/ws.length);
  let weekDec = 0;
  for (let i = 1; i < weekAvgs.length; i++) if (weekAvgs[i] < weekAvgs[i-1]) weekDec++;
  const maxWeeklyEntries = weekEntries.length ? Math.max(...weekEntries.map(e=>e.length)) : 0;

  const monthMap = {};
  active.forEach(r => {
    const ym = r.date.slice(0,7);
    if (!monthMap[ym]) monthMap[ym] = {count:0,sum:0};
    monthMap[ym].count++; monthMap[ym].sum += r.weight;
  });
  const m10 = Object.values(monthMap).filter(d=>d.count>=10).length;
  const m20 = Object.values(monthMap).filter(d=>d.count>=20).length;
  const qualMonths = Object.entries(monthMap).filter(([,d])=>d.count>=15)
    .sort((a,b)=>a[0].localeCompare(b[0])).map(([ym,d])=>({ym,avg:d.sum/d.count}));
  let maxDecStreak = 0, streak = 0;
  for (let i = 1; i < qualMonths.length; i++) {
    const [py,pm] = qualMonths[i-1].ym.split('-').map(Number);
    const [cy,cm] = qualMonths[i].ym.split('-').map(Number);
    if ((cy*12+cm)===(py*12+pm+1) && qualMonths[i].avg < qualMonths[i-1].avg) { streak++; maxDecStreak = Math.max(maxDecStreak,streak); }
    else streak = 0;
  }

  // ── 식단·운동 통계 ────────────────────────────────────────────────
  const activeDays = records.filter(r=>r.date>=ACHIEVEMENT_START_DATE).sort((a,b)=>a.date.localeCompare(b.date));

  let mealFullDays = 0, mealGreenDays = 0;
  const mealWeekMap = {}, mealMonthMap = {};
  activeDays.forEach(r => {
    const m = r.meal || {};
    const cnt = [m.morning, m.lunch, m.dinner].filter(v=>v!=null).length;
    if (cnt === 3) {
      mealFullDays++;
      if (m.morning==='green' && m.lunch==='green' && m.dinner==='green') mealGreenDays++;
    }
    if (cnt > 0) {
      const d = new Date(r.date+'T00:00:00'), sun = new Date(d);
      sun.setDate(d.getDate()-d.getDay());
      const wk = toDs(sun);
      mealWeekMap[wk] = (mealWeekMap[wk]||0) + cnt;
      mealMonthMap[r.date.slice(0,7)] = (mealMonthMap[r.date.slice(0,7)]||0) + cnt;
    }
  });
  const weeklyMeal18  = Object.values(mealWeekMap).filter(c=>c>=18).length;
  const monthlyMeal60 = Object.values(mealMonthMap).filter(c=>c>=60).length;

  let exerciseCount = 0, maxExStreak = 0;
  const exWeekMap = {}, exMonthMap = {};
  activeDays.forEach(r => {
    if (r.exercise === true) {
      exerciseCount++;
      const d = new Date(r.date+'T00:00:00'), sun = new Date(d);
      sun.setDate(d.getDate()-d.getDay());
      exWeekMap[toDs(sun)] = (exWeekMap[toDs(sun)]||0) + 1;
      exMonthMap[r.date.slice(0,7)] = (exMonthMap[r.date.slice(0,7)]||0) + 1;
    }
  });
  const weeklyEx3   = Object.values(exWeekMap).filter(c=>c>=3).length;
  const monthlyEx15 = Object.values(exMonthMap).filter(c=>c>=15).length;

  if (activeDays.length > 0) {
    const dateSet = new Map(activeDays.map(r=>[r.date, r.exercise]));
    const first = new Date(activeDays[0].date+'T00:00:00');
    const last  = new Date(activeDays[activeDays.length-1].date+'T00:00:00');
    let exStreak = 0;
    for (let d = new Date(first); d <= last; d.setDate(d.getDate()+1)) {
      const ds = toDs(d);
      if (dateSet.get(ds) === true) { exStreak++; maxExStreak = Math.max(maxExStreak, exStreak); }
      else exStreak = 0;
    }
  }

  return {
    total:active.length, refW, activeMin, lossPct, bestBmi, goal, goalPct, renewals,
    weekDec, maxWeeklyEntries, m10, m20, maxDecStreak,
    mealFullDays, mealGreenDays, weeklyMeal18, monthlyMeal60,
    exerciseCount, maxExStreak, weeklyEx3, monthlyEx15,
  };
}

export function calculateEarnedIds(records, user) {
  const earned = new Set();
  if (!records.length) return earned;
  const {
    total, lossPct, bestBmi, goal, goalPct, renewals,
    weekDec, maxWeeklyEntries, m10, m20, maxDecStreak,
    mealFullDays, mealGreenDays, weeklyMeal18, monthlyMeal60,
    exerciseCount, maxExStreak, weeklyEx3, monthlyEx15,
  } = extractData(records, user);

  [1,5,10,20,30,40,50,70,100,120,150,200,250,300,365,500,1000].forEach(n => { if(total>=n) earned.add(`record_${n}`); });
  if(lossPct>=1)  earned.add('loss_1pct');
  if(lossPct>=2)  earned.add('loss_2pct');
  if(lossPct>=3)  earned.add('loss_3pct');
  if(lossPct>=5)  earned.add('loss_5pct');
  if(lossPct>=7)  earned.add('loss_7pct');
  if(lossPct>=10) earned.add('loss_10pct');
  if(lossPct>=15||(bestBmi!=null&&bestBmi<=23.5)) earned.add('loss_15pct');
  if(lossPct>=20||(bestBmi!=null&&bestBmi<=23))   earned.add('loss_20pct');
  if(lossPct>=25||(bestBmi!=null&&bestBmi<=22.5)) earned.add('loss_25pct');
  if(lossPct>=30||(bestBmi!=null&&bestBmi<=22))   earned.add('loss_30pct');
  if(goal) earned.add('goal_set');
  if(goalPct>=10)  earned.add('goal_10pct');
  if(goalPct>=25)  earned.add('goal_25pct');
  if(goalPct>=50)  earned.add('goal_50pct');
  if(goalPct>=75)  earned.add('goal_75pct');
  const am2 = records.filter(r=>r.weight!=null&&r.date>=ACHIEVEMENT_START_DATE).reduce((m,r)=>Math.min(m,r.weight),Infinity);
  if(goal && am2<=goal) earned.add('goal_achieved');
  [1,5,10,20,30,40,50,60,70,80,90,100].forEach(n => { if(renewals>=n) earned.add(`daily_${n}`); });
  [1,10,20,30,50,100].forEach(n => { if(mealFullDays>=n)  earned.add(`diet_meal_${n}`); });
  [1,10,20,30,50,100].forEach(n => { if(exerciseCount>=n) earned.add(`ex_${n}`); });
  [1,2,3,4,5,10,15,20,25,30].forEach(n => { if(weekDec>=n) earned.add(`weekly_${n}`); });
  if(maxWeeklyEntries>=3) earned.add('weekly_input_3');
  if(maxWeeklyEntries>=5) earned.add('weekly_input_5');
  if(maxWeeklyEntries>=7) earned.add('weekly_input_7');
  [1,2,4,8,12].forEach(n => { if(weeklyMeal18>=n) earned.add(`diet_week_${n}`); });
  [1,2,4,8,12].forEach(n => { if(weeklyEx3>=n)    earned.add(`ex_week_${n}`); });
  if(m10>=1) earned.add('monthly_10');
  if(m20>=1) earned.add('monthly_20');
  [2,3,4,5,6,7,8,9,10,11,12].forEach(n => { if(m20>=n) earned.add(`monthly_20x${n}`); });
  if(maxDecStreak>=1) earned.add('monthly_dec_1');
  if(maxDecStreak>=2) earned.add('monthly_dec_2');
  if(maxDecStreak>=3) earned.add('monthly_dec_3');
  [1,2,3].forEach(n => { if(monthlyMeal60>=n) earned.add(`diet_month_${n}`); });
  [1,2,3].forEach(n => { if(monthlyEx15>=n)   earned.add(`ex_month_${n}`); });
  if(mealGreenDays>=1)  earned.add('diet_green_1');
  if(mealGreenDays>=5)  earned.add('diet_green_5');
  if(mealGreenDays>=10) earned.add('diet_green_10');
  if(maxExStreak>=2) earned.add('ex_streak_2');
  if(maxExStreak>=3) earned.add('ex_streak_3');
  if(maxExStreak>=5) earned.add('ex_streak_5');

  return earned;
}

export function calculateProgress(records, user) {
  const {
    total, lossPct, goalPct, goal, renewals,
    weekDec, maxWeeklyEntries, m10, m20, maxDecStreak,
    mealFullDays, mealGreenDays, weeklyMeal18, monthlyMeal60,
    exerciseCount, maxExStreak, weeklyEx3, monthlyEx15,
  } = extractData(records, user);
  const p = (cur, tgt) => ({ current: Math.min(cur, tgt), target: tgt });
  return {
    record_1:p(total,1),record_5:p(total,5),record_10:p(total,10),record_20:p(total,20),
    record_30:p(total,30),record_40:p(total,40),record_50:p(total,50),record_70:p(total,70),
    record_100:p(total,100),record_120:p(total,120),record_150:p(total,150),record_200:p(total,200),
    record_250:p(total,250),record_300:p(total,300),record_365:p(total,365),record_500:p(total,500),record_1000:p(total,1000),
    loss_1pct:p(lossPct,1),loss_2pct:p(lossPct,2),loss_3pct:p(lossPct,3),loss_5pct:p(lossPct,5),
    loss_7pct:p(lossPct,7),loss_10pct:p(lossPct,10),loss_15pct:p(lossPct,15),loss_20pct:p(lossPct,20),
    loss_25pct:p(lossPct,25),loss_30pct:p(lossPct,30),
    goal_set:p(goal?1:0,1),goal_10pct:p(goalPct,10),goal_25pct:p(goalPct,25),
    goal_50pct:p(goalPct,50),goal_75pct:p(goalPct,75),goal_achieved:p(goalPct,100),
    daily_1:p(renewals,1),daily_5:p(renewals,5),daily_10:p(renewals,10),daily_20:p(renewals,20),
    daily_30:p(renewals,30),daily_40:p(renewals,40),daily_50:p(renewals,50),daily_60:p(renewals,60),
    daily_70:p(renewals,70),daily_80:p(renewals,80),daily_90:p(renewals,90),daily_100:p(renewals,100),
    diet_meal_1:p(mealFullDays,1),diet_meal_10:p(mealFullDays,10),diet_meal_20:p(mealFullDays,20),
    diet_meal_30:p(mealFullDays,30),diet_meal_50:p(mealFullDays,50),diet_meal_100:p(mealFullDays,100),
    ex_1:p(exerciseCount,1),ex_10:p(exerciseCount,10),ex_20:p(exerciseCount,20),
    ex_30:p(exerciseCount,30),ex_50:p(exerciseCount,50),ex_100:p(exerciseCount,100),
    weekly_1:p(weekDec,1),weekly_2:p(weekDec,2),weekly_3:p(weekDec,3),weekly_4:p(weekDec,4),
    weekly_5:p(weekDec,5),weekly_10:p(weekDec,10),weekly_15:p(weekDec,15),weekly_20:p(weekDec,20),
    weekly_25:p(weekDec,25),weekly_30:p(weekDec,30),
    weekly_input_3:p(maxWeeklyEntries,3),weekly_input_5:p(maxWeeklyEntries,5),weekly_input_7:p(maxWeeklyEntries,7),
    diet_week_1:p(weeklyMeal18,1),diet_week_2:p(weeklyMeal18,2),diet_week_4:p(weeklyMeal18,4),
    diet_week_8:p(weeklyMeal18,8),diet_week_12:p(weeklyMeal18,12),
    ex_week_1:p(weeklyEx3,1),ex_week_2:p(weeklyEx3,2),ex_week_4:p(weeklyEx3,4),
    ex_week_8:p(weeklyEx3,8),ex_week_12:p(weeklyEx3,12),
    monthly_10:p(m10,1),monthly_20:p(m20,1),monthly_20x2:p(m20,2),monthly_20x3:p(m20,3),
    monthly_20x4:p(m20,4),monthly_20x5:p(m20,5),monthly_20x6:p(m20,6),monthly_20x7:p(m20,7),
    monthly_20x8:p(m20,8),monthly_20x9:p(m20,9),monthly_20x10:p(m20,10),
    monthly_20x11:p(m20,11),monthly_20x12:p(m20,12),
    monthly_dec_1:p(maxDecStreak,1),monthly_dec_2:p(maxDecStreak,2),monthly_dec_3:p(maxDecStreak,3),
    diet_month_1:p(monthlyMeal60,1),diet_month_2:p(monthlyMeal60,2),diet_month_3:p(monthlyMeal60,3),
    ex_month_1:p(monthlyEx15,1),ex_month_2:p(monthlyEx15,2),ex_month_3:p(monthlyEx15,3),
    diet_green_1:p(mealGreenDays,1),diet_green_5:p(mealGreenDays,5),diet_green_10:p(mealGreenDays,10),
    ex_streak_2:p(maxExStreak,2),ex_streak_3:p(maxExStreak,3),ex_streak_5:p(maxExStreak,5),
  };
}

export function calcTotalScore(earnedIds) {
  return [...earnedIds].reduce((sum, id) => {
    const a = ACHIEVEMENTS.find(x => x.id === id);
    return sum + (a ? a.score : 0);
  }, 0);
}

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

export function getTierForScore(score, tiers = DEFAULT_TIERS) {
  return [...tiers].sort((a,b)=>b.minScore-a.minScore).find(t=>score>=t.minScore) || tiers[0];
}
