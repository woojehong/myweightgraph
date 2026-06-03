// achievements.js

export const RECORD_START_DATE = '2026-06-01'; // 기록 누적 기준일 (체중/식단/운동 횟수)
export const LOSS_START_DATE   = '2026-01-01'; // 감량/갱신 기준일

export const ACHIEVEMENT_CATEGORIES = [
  { id:'record',    label:'체중',  icon:'⚖️' },
  { id:'loss',      label:'감량',  icon:'📉' },
  { id:'goal',      label:'목표',  icon:'🎯' },
  { id:'daily',     label:'일간',  icon:'📆' },
  { id:'weekly',    label:'주간',  icon:'📅' },
  { id:'monthly',   label:'월간',  icon:'🗓️' },
  { id:'diet',      label:'식단',  icon:'🥗' },
  { id:'exercise',  label:'운동',  icon:'💪' },
  { id:'grade',     label:'등급',  icon:'🏅' },
  { id:'milestone', label:'업적',  icon:'🎖️' },
];

export const ACHIEVEMENTS = [

  // ── 체중 기록 (6월 1일~) ─────────────────────────────────────────────
  { id:'record_1',    cat:'record', name:'첫 측정',       desc:'처음으로 체중을 기록했어요',              score:10, icon:'👣' },
  { id:'record_5',    cat:'record', name:'5회 측정',      desc:'체중을 5번 측정했어요',                   score:10, icon:'⚖️' },
  { id:'record_10',   cat:'record', name:'10회 측정',     desc:'체중을 10번 측정했어요',                  score:10, icon:'⚖️' },
  { id:'record_20',   cat:'record', name:'20회 측정',     desc:'체중을 20번 측정했어요',                  score:10, icon:'📋' },
  { id:'record_30',   cat:'record', name:'30회 측정',     desc:'체중을 30번 측정했어요',                  score:10, icon:'📋' },
  { id:'record_40',   cat:'record', name:'40회 측정',     desc:'체중을 40번 측정했어요',                  score:10, icon:'📋' },
  { id:'record_50',   cat:'record', name:'50회 측정',     desc:'체중을 50번 측정했어요',                  score:20, icon:'📊' },
  { id:'record_70',   cat:'record', name:'70회 측정',     desc:'체중을 70번 측정했어요',                  score:20, icon:'📊' },
  { id:'record_100',  cat:'record', name:'100회 측정',    desc:'체중을 100번 측정했어요',                 score:20, icon:'💯' },
  { id:'record_120',  cat:'record', name:'120회 측정',    desc:'체중을 120번 측정했어요',                 score:20, icon:'💯' },
  { id:'record_150',  cat:'record', name:'150회 측정',    desc:'체중을 150번 측정했어요',                 score:30, icon:'🏅' },
  { id:'record_200',  cat:'record', name:'200회 측정',    desc:'체중을 200번 측정했어요',                 score:30, icon:'🏅' },
  { id:'record_250',  cat:'record', name:'250회 측정',    desc:'체중을 250번 측정했어요',                 score:30, icon:'⭐' },
  { id:'record_300',  cat:'record', name:'300회 측정',    desc:'체중을 300번 측정했어요',                 score:40, icon:'⭐' },
  { id:'record_365',  cat:'record', name:'365회 측정',   desc:'체중을 365번 측정했어요',                  score:50, icon:'🌟', legendary:true },
  { id:'record_500',  cat:'record', name:'500회 측정',   desc:'체중을 500번 측정했어요',                  score:50, icon:'💎', legendary:true },
  { id:'record_1000', cat:'record', name:'1000회 측정',  desc:'체중을 1000번 측정했어요',                 score:50, icon:'👑', legendary:true },

  // ── 감량 ─────────────────────────────────────────────────────────
  { id:'loss_1pct',  cat:'loss', name:'첫 감량',   desc:'기준 체중 대비 1% 감량',                        score:10, icon:'📉' },
  { id:'loss_2pct',  cat:'loss', name:'2% 돌파',   desc:'기준 체중 대비 2% 감량',                        score:10, icon:'📉' },
  { id:'loss_3pct',  cat:'loss', name:'3% 돌파',   desc:'기준 체중 대비 3% 감량',                        score:10, icon:'📉' },
  { id:'loss_5pct',  cat:'loss', name:'5% 클럽',   desc:'기준 체중 대비 5% 감량',                        score:20, icon:'🔥' },
  { id:'loss_7pct',  cat:'loss', name:'7% 달성',   desc:'기준 체중 대비 7% 감량',                        score:20, icon:'🔥' },
  { id:'loss_10pct', cat:'loss', name:'10% 돌파',  desc:'기준 체중 대비 10% 감량',                       score:20, icon:'💪' },
  { id:'loss_15pct', cat:'loss', name:'15% 달성',  desc:'15% 감량 또는 BMI 23.5 이하',                   score:30, icon:'💪', bmiThreshold:23.5 },
  { id:'loss_20pct', cat:'loss', name:'20% 달성',  desc:'20% 감량 또는 BMI 23 이하',                     score:30, icon:'⚡', bmiThreshold:23   },
  { id:'loss_25pct', cat:'loss', name:'25% 달성',  desc:'25% 감량 또는 BMI 22.5 이하',                   score:40, icon:'⚡', bmiThreshold:22.5 },
  { id:'loss_30pct', cat:'loss', name:'30% 달성',  desc:'30% 감량 또는 BMI 22 이하',                     score:50, icon:'👑', legendary:true, bmiThreshold:22 },

  // ── 목표 ─────────────────────────────────────────────────────────
  { id:'goal_set',      cat:'goal', name:'목표 설정',    desc:'목표 체중을 처음으로 설정했어요',           score:10, icon:'🎯' },
  { id:'goal_10pct',    cat:'goal', name:'목표까지 10%', desc:'목표까지의 여정 중 10%를 달성했어요',       score:10, icon:'🎯' },
  { id:'goal_25pct',    cat:'goal', name:'목표까지 25%', desc:'목표까지의 여정 중 25%를 달성했어요',       score:20, icon:'🎯' },
  { id:'goal_50pct',    cat:'goal', name:'목표까지 50%', desc:'목표까지의 여정 중 절반을 달성했어요',      score:30, icon:'🎯' },
  { id:'goal_75pct',    cat:'goal', name:'목표까지 75%', desc:'목표까지의 여정 중 75%를 달성했어요',       score:40, icon:'🎯' },
  { id:'goal_achieved', cat:'goal', name:'목표 달성!',   desc:'설정한 목표 체중에 도달했어요',              score:50, icon:'🏆', legendary:true },

  // ── 일간 — 최저 체중 갱신 (1월 1일~) ────────────────────────────
  { id:'daily_1',   cat:'daily', name:'첫 최저 갱신',    desc:'처음으로 최저 체중을 갱신했어요',           score:10, icon:'📆' },
  { id:'daily_5',   cat:'daily', name:'5회 갱신',        desc:'최저 체중을 5번 경신했어요',                score:10, icon:'📆' },
  { id:'daily_10',  cat:'daily', name:'10회 갱신',       desc:'최저 체중을 10번 경신했어요',               score:10, icon:'📆' },
  { id:'daily_20',  cat:'daily', name:'20회 갱신',       desc:'최저 체중을 20번 경신했어요',               score:10, icon:'📆' },
  { id:'daily_30',  cat:'daily', name:'30회 갱신',       desc:'최저 체중을 30번 경신했어요',               score:20, icon:'⭐' },
  { id:'daily_40',  cat:'daily', name:'40회 갱신',       desc:'최저 체중을 40번 경신했어요',               score:20, icon:'⭐' },
  { id:'daily_50',  cat:'daily', name:'50회 갱신',       desc:'최저 체중을 50번 경신했어요',               score:20, icon:'⭐' },
  { id:'daily_60',  cat:'daily', name:'60회 갱신',       desc:'최저 체중을 60번 경신했어요',               score:30, icon:'💎' },
  { id:'daily_70',  cat:'daily', name:'70회 갱신',       desc:'최저 체중을 70번 경신했어요',               score:30, icon:'💎' },
  { id:'daily_80',  cat:'daily', name:'80회 갱신',       desc:'최저 체중을 80번 경신했어요',               score:30, icon:'💎' },
  { id:'daily_90',  cat:'daily', name:'90회 갱신',       desc:'최저 체중을 90번 경신했어요',               score:40, icon:'💎' },
  { id:'daily_100', cat:'daily', name:'100회 갱신',      desc:'최저 체중을 100번 경신했어요',              score:50, icon:'👑', legendary:true },

  // ── 일간 — 식단 기록 (3끼 모두 기록한 날, 6월 1일~) ─────────────
  { id:'diet_meal_1',   cat:'daily', name:'첫 식단 기록', desc:'3끼 모두 기록한 날 첫 달성',               score:10, icon:'🥗' },
  { id:'diet_meal_10',  cat:'daily', name:'식단 10일',    desc:'3끼 모두 기록한 날 10회 달성',             score:10, icon:'🥗' },
  { id:'diet_meal_20',  cat:'daily', name:'식단 20일',    desc:'3끼 모두 기록한 날 20회 달성',             score:20, icon:'🥗' },
  { id:'diet_meal_30',  cat:'daily', name:'식단 30일',    desc:'3끼 모두 기록한 날 30회 달성',             score:20, icon:'🥗' },
  { id:'diet_meal_50',  cat:'daily', name:'식단 50일',    desc:'3끼 모두 기록한 날 50회 달성',             score:30, icon:'🥗' },
  { id:'diet_meal_100', cat:'daily', name:'식단 100일',   desc:'3끼 모두 기록한 날 100회 달성',            score:40, icon:'🥗' },

  // ── 일간 — 운동 기록 (6월 1일~) ──────────────────────────────────
  { id:'ex_1',   cat:'daily', name:'첫 운동 기록', desc:'처음으로 운동 체크마크를 달성했어요',             score:10, icon:'💪' },
  { id:'ex_10',  cat:'daily', name:'운동 10회',    desc:'운동 체크마크 10회 달성',                        score:10, icon:'💪' },
  { id:'ex_20',  cat:'daily', name:'운동 20회',    desc:'운동 체크마크 20회 달성',                        score:20, icon:'💪' },
  { id:'ex_30',  cat:'daily', name:'운동 30회',    desc:'운동 체크마크 30회 달성',                        score:20, icon:'💪' },
  { id:'ex_50',  cat:'daily', name:'운동 50회',    desc:'운동 체크마크 50회 달성',                        score:30, icon:'💪' },
  { id:'ex_100', cat:'daily', name:'운동 100회',   desc:'운동 체크마크 100회 달성',                       score:40, icon:'💪' },

  // ── 주간 — 체중 감량 (1월 1일~) ──────────────────────────────────
  { id:'weekly_1',  cat:'weekly', name:'첫 주간 감량',   desc:'전주 평균보다 낮아진 주 1회',               score:10, icon:'📅' },
  { id:'weekly_2',  cat:'weekly', name:'2주 감량',       desc:'전주 평균보다 낮아진 주 2회 누적',          score:10, icon:'📅' },
  { id:'weekly_3',  cat:'weekly', name:'3주 감량',       desc:'전주 평균보다 낮아진 주 3회 누적',          score:10, icon:'📅' },
  { id:'weekly_4',  cat:'weekly', name:'4주 감량',       desc:'전주 평균보다 낮아진 주 4회 누적',          score:10, icon:'📅' },
  { id:'weekly_5',  cat:'weekly', name:'5주 감량',       desc:'전주 평균보다 낮아진 주 5회 누적',          score:10, icon:'📅' },
  { id:'weekly_10', cat:'weekly', name:'10주 감량',      desc:'전주 평균보다 낮아진 주 10회 누적',         score:20, icon:'📅' },
  { id:'weekly_15', cat:'weekly', name:'15주 감량',      desc:'전주 평균보다 낮아진 주 15회 누적',         score:20, icon:'📅' },
  { id:'weekly_20', cat:'weekly', name:'20주 감량',      desc:'전주 평균보다 낮아진 주 20회 누적',         score:30, icon:'📅' },
  { id:'weekly_25', cat:'weekly', name:'25주 감량',      desc:'전주 평균보다 낮아진 주 25회 누적',         score:40, icon:'📅' },
  { id:'weekly_30', cat:'weekly', name:'30주 감량 ', desc:'전주 평균보다 낮아진 주 30회 누적',         score:50, icon:'👑', legendary:true },

  // ── 주간 — 체중 입력 (6월 1일~) ──────────────────────────────────
  { id:'weekly_input_3', cat:'weekly', name:'주 3회 입력', desc:'한 주에 3회 이상 기록한 주 최초 달성',     score:10, icon:'✏️' },
  { id:'weekly_input_5', cat:'weekly', name:'주 5회 입력', desc:'한 주에 5회 이상 기록한 주 최초 달성',     score:20, icon:'✏️' },
  { id:'weekly_input_7', cat:'weekly', name:'주 7회 개근', desc:'한 주에 7회 모두 기록한 주 최초 달성',     score:30, icon:'🏆' },

  // ── 주간 — 식단 기록 (6월 1일~) ──────────────────────────────────
  { id:'diet_week_1',  cat:'weekly', name:'주간 식단 1회',  desc:'주 18끼 이상 기록한 주 1회 달성',         score:10, icon:'🥗' },
  { id:'diet_week_2',  cat:'weekly', name:'주간 식단 2회',  desc:'주 18끼 이상 기록한 주 2회 누적',         score:10, icon:'🥗' },
  { id:'diet_week_4',  cat:'weekly', name:'주간 식단 4회',  desc:'주 18끼 이상 기록한 주 4회 누적',         score:20, icon:'🥗' },
  { id:'diet_week_8',  cat:'weekly', name:'주간 식단 8회',  desc:'주 18끼 이상 기록한 주 8회 누적',         score:30, icon:'🥗' },
  { id:'diet_week_12', cat:'weekly', name:'주간 식단 12회', desc:'주 18끼 이상 기록한 주 12회 누적',        score:40, icon:'🥗' },

  // ── 주간 — 운동 기록 (6월 1일~) ──────────────────────────────────
  { id:'ex_week_1',  cat:'weekly', name:'주간 운동 1회',  desc:'주 3회 이상 운동한 주 1회 달성',            score:10, icon:'💪' },
  { id:'ex_week_2',  cat:'weekly', name:'주간 운동 2회',  desc:'주 3회 이상 운동한 주 2회 누적',            score:10, icon:'💪' },
  { id:'ex_week_4',  cat:'weekly', name:'주간 운동 4회',  desc:'주 3회 이상 운동한 주 4회 누적',            score:20, icon:'💪' },
  { id:'ex_week_8',  cat:'weekly', name:'주간 운동 8회',  desc:'주 3회 이상 운동한 주 8회 누적',            score:30, icon:'💪' },
  { id:'ex_week_12', cat:'weekly', name:'주간 운동 12회', desc:'주 3회 이상 운동한 주 12회 누적',           score:40, icon:'💪' },

  // ── 월간 — 체중 입력 (6월 1일~) ──────────────────────────────────
  { id:'monthly_10',    cat:'monthly', name:'월간 10회',     desc:'한 달에 10회 이상 기록한 달 달성',        score:10, icon:'🗓️' },
  { id:'monthly_20',    cat:'monthly', name:'월간 20회',     desc:'한 달에 20회 이상 기록한 달 달성',        score:10, icon:'🗓️' },
  { id:'monthly_20x2',  cat:'monthly', name:'2개월 달성',    desc:'월 20회+ 기록 2개월 누적',                score:10, icon:'🗓️' },
  { id:'monthly_20x3',  cat:'monthly', name:'3개월 달성',    desc:'월 20회+ 기록 3개월 누적',                score:20, icon:'🗓️' },
  { id:'monthly_20x4',  cat:'monthly', name:'4개월 달성',    desc:'월 20회+ 기록 4개월 누적',                score:20, icon:'🗓️' },
  { id:'monthly_20x5',  cat:'monthly', name:'5개월 달성',    desc:'월 20회+ 기록 5개월 누적',                score:20, icon:'🗓️' },
  { id:'monthly_20x6',  cat:'monthly', name:'6개월 달성',    desc:'월 20회+ 기록 6개월 누적',                score:20, icon:'🗓️' },
  { id:'monthly_20x7',  cat:'monthly', name:'7개월 달성',    desc:'월 20회+ 기록 7개월 누적',                score:30, icon:'🗓️' },
  { id:'monthly_20x8',  cat:'monthly', name:'8개월 달성',    desc:'월 20회+ 기록 8개월 누적',                score:30, icon:'🗓️' },
  { id:'monthly_20x9',  cat:'monthly', name:'9개월 달성',    desc:'월 20회+ 기록 9개월 누적',                score:30, icon:'🗓️' },
  { id:'monthly_20x10', cat:'monthly', name:'10개월 달성',   desc:'월 20회+ 기록 10개월 누적',               score:30, icon:'🗓️' },
  { id:'monthly_20x11', cat:'monthly', name:'11개월 달성',   desc:'월 20회+ 기록 11개월 누적',               score:40, icon:'🗓️' },
  { id:'monthly_20x12', cat:'monthly', name:'1년 달성 ', desc:'월 20회+ 기록 12개월 누적',               score:50, icon:'🌟', legendary:true },

  // ── 월간 — 체중 감량 (1월 1일~) ──────────────────────────────────
  { id:'monthly_dec_1', cat:'monthly', name:'월간 감량 1개월', desc:'15회+ 입력 월 기준 연속 감량 1개월',    score:30, icon:'📉' },
  { id:'monthly_dec_2', cat:'monthly', name:'월간 감량 2개월', desc:'15회+ 입력 월 기준 연속 감량 2개월',    score:40, icon:'📉' },
  { id:'monthly_dec_3', cat:'monthly', name:'월간 감량 ',  desc:'15회+ 입력 월 기준 연속 감량 3개월',    score:50, icon:'👑', legendary:true },

  // ── 월간 — 식단 기록 (6월 1일~) ──────────────────────────────────
  { id:'diet_month_1', cat:'monthly', name:'월간 식단 1개월', desc:'한 달에 60끼 이상 기록한 달 달성',       score:20, icon:'🥗' },
  { id:'diet_month_2', cat:'monthly', name:'월간 식단 2개월', desc:'월 60끼+ 기록 2개월 누적',               score:30, icon:'🥗' },
  { id:'diet_month_3', cat:'monthly', name:'월간 식단 3개월', desc:'월 60끼+ 기록 3개월 누적',               score:40, icon:'🥗' },

  // ── 월간 — 운동 기록 (6월 1일~) ──────────────────────────────────
  { id:'ex_month_1', cat:'monthly', name:'월간 운동 1개월', desc:'한 달에 15회 이상 운동한 달 달성',         score:20, icon:'💪' },
  { id:'ex_month_2', cat:'monthly', name:'월간 운동 2개월', desc:'월 15회+ 운동 2개월 누적',                 score:30, icon:'💪' },
  { id:'ex_month_3', cat:'monthly', name:'월간 운동 3개월', desc:'월 15회+ 운동 3개월 누적',                 score:40, icon:'💪' },

  // ── 식단 — 녹색 끼니 누적 (6월 1일~) ────────────────────────────
  { id:'diet_green_1',  cat:'diet', name:'초록 첫 끼니',    desc:'녹색 식단을 처음으로 달성했어요 (끼니 단위)', score:10, icon:'🥦' },
  { id:'diet_green_5',  cat:'diet', name:'초록 5끼니',      desc:'녹색 식단 5끼니 누적',                      score:10, icon:'🥦' },
  { id:'diet_green_10', cat:'diet', name:'초록 10끼니',     desc:'녹색 식단 10끼니 누적',                     score:20, icon:'🥦' },
  { id:'diet_green_20', cat:'diet', name:'초록 20끼니',     desc:'녹색 식단 20끼니 누적',                     score:20, icon:'🥦' },
  { id:'diet_green_30', cat:'diet', name:'초록 30끼니',     desc:'녹색 식단 30끼니 누적',                     score:30, icon:'🥦' },
  { id:'diet_green_50', cat:'diet', name:'초록 50끼니',     desc:'녹색 식단 50끼니 누적',                     score:30, icon:'🥦' },
  { id:'diet_green_100',cat:'diet', name:'초록 100끼니',    desc:'녹색 식단 100끼니 누적',                    score:40, icon:'🥦' },

  // ── 식단 — 전체 끼니 기록 누적 (6월 1일~, 색상 무관) ─────────────
  { id:'meal_entry_10',  cat:'diet', name:'식단 10끼 기록',  desc:'색상 관계없이 기록된 끼니 10개 누적',      score:10, icon:'🍽️' },
  { id:'meal_entry_30',  cat:'diet', name:'식단 30끼 기록',  desc:'색상 관계없이 기록된 끼니 30개 누적',      score:10, icon:'🍽️' },
  { id:'meal_entry_50',  cat:'diet', name:'식단 50끼 기록',  desc:'색상 관계없이 기록된 끼니 50개 누적',      score:20, icon:'🍽️' },
  { id:'meal_entry_100', cat:'diet', name:'식단 100끼 기록', desc:'색상 관계없이 기록된 끼니 100개 누적',     score:20, icon:'🍽️' },
  { id:'meal_entry_200', cat:'diet', name:'식단 200끼 기록', desc:'색상 관계없이 기록된 끼니 200개 누적',     score:30, icon:'🍽️' },
  { id:'meal_entry_300', cat:'diet', name:'식단 300끼 기록', desc:'색상 관계없이 기록된 끼니 300개 누적',     score:40, icon:'🍽️' },
  { id:'meal_entry_500', cat:'diet', name:'식단 500끼 ', desc:'색상 관계없이 기록된 끼니 500개 누적',     score:50, icon:'🍽️', legendary:true },

  // ── 운동 — 연속 (6월 1일~) ───────────────────────────────────────
  { id:'ex_streak_2',  cat:'exercise', name:'운동 2일 연속',  desc:'2일 연속 운동 달성',                      score:10, icon:'🔥' },
  { id:'ex_streak_3',  cat:'exercise', name:'운동 3일 연속',  desc:'3일 연속 운동 달성',                      score:20, icon:'🔥' },
  { id:'ex_streak_5',  cat:'exercise', name:'운동 5일 연속',  desc:'5일 연속 운동 달성',                      score:30, icon:'🔥' },
  { id:'ex_streak_7',  cat:'exercise', name:'운동 7일 연속',  desc:'7일 연속 운동 달성',                      score:40, icon:'🔥' },
  { id:'ex_streak_14', cat:'exercise', name:'운동 2주 연속 ', desc:'14일 연속 운동 달성',                 score:50, icon:'🔥', legendary:true },

  // ── 운동 — 누적 고단계 (6월 1일~) ───────────────────────────────
  { id:'ex_cum_150', cat:'exercise', name:'운동 150회',       desc:'운동 체크마크 150회 달성',                score:40, icon:'🏋️' },
  { id:'ex_cum_200', cat:'exercise', name:'운동 200회',       desc:'운동 체크마크 200회 달성',                score:50, icon:'🏋️', legendary:true },
  { id:'ex_cum_300', cat:'exercise', name:'운동 300회',  desc:'운동 체크마크 300회 달성',                score:50, icon:'🏋️', legendary:true },
  { id:'ex_cum_500', cat:'exercise', name:'운동 500회',  desc:'운동 체크마크 500회 달성',                score:50, icon:'🏋️', legendary:true },

  // ── 등급 — 티어 달성 (점수 기반, 메타 업적) ──────────────────────
  { id:'grade_bronze',      cat:'grade', name:'브론즈 달성',      desc:'업적 점수가 브론즈 기준 이상 달성',     score:20,  icon:'🥉' },
  { id:'grade_silver',      cat:'grade', name:'실버 달성',        desc:'업적 점수가 실버 기준 이상 달성',       score:30,  icon:'🥈' },
  { id:'grade_gold',        cat:'grade', name:'골드 달성',        desc:'업적 점수가 골드 기준 이상 달성',       score:40,  icon:'🥇' },
  { id:'grade_platinum',    cat:'grade', name:'플래티넘 달성',    desc:'업적 점수가 플래티넘 기준 이상 달성',   score:50,  icon:'💎', legendary:true },
  { id:'grade_emerald',     cat:'grade', name:'에메랄드 달성',    desc:'업적 점수가 에메랄드 기준 이상 달성',   score:70,  icon:'💚', legendary:true },
  { id:'grade_diamond',     cat:'grade', name:'다이아몬드 달성',  desc:'업적 점수가 다이아몬드 기준 이상 달성', score:80,  icon:'💠', legendary:true },
  { id:'grade_master',      cat:'grade', name:'마스터 달성',      desc:'업적 점수가 마스터 기준 이상 달성',     score:100, icon:'👑', legendary:true },
  { id:'grade_grandmaster', cat:'grade', name:'그랜드마스터 달성',desc:'업적 점수가 그랜드마스터 기준 이상 달성',score:150,icon:'🌟', legendary:true },
  { id:'grade_challenger',  cat:'grade', name:'챌린저 달성',      desc:'업적 점수가 챌린저 기준 이상 달성',     score:200, icon:'⚡', legendary:true },

  // ── 업적 — 달성 개수 마일스톤 (메타 업적) ────────────────────────
  { id:'ach_10',  cat:'milestone', name:'업적 10개 달성',   desc:'업적을 10개 달성했어요',                    score:10, icon:'🎖️' },
  { id:'ach_50',  cat:'milestone', name:'업적 50개 달성',   desc:'업적을 50개 달성했어요',                    score:30, icon:'🎖️' },
  { id:'ach_100', cat:'milestone', name:'업적 100개 달성', desc:'업적을 100개 달성했어요',               score:50, icon:'🏆', legendary:true },
  { id:'ach_200', cat:'milestone', name:'업적 200개 달성', desc:'업적을 200개 달성했어요',               score:50, icon:'👑', legendary:true },
];

const toDs = d =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

function extractData(records, user) {
  const withWeight = records.filter(r => r.weight != null).sort((a,b) => a.date.localeCompare(b.date));
  const allRecs    = [...records].sort((a,b) => a.date.localeCompare(b.date));

  const height = user?.height, goal = user?.goal;
  const refW   = user?.referenceWeight || (withWeight.length ? Math.max(...withWeight.map(r=>r.weight)) : 0);

  // ── 감량 (날짜 제한 없음) ───────────────────────────────────────
  const activeMin = withWeight.length ? Math.min(...withWeight.map(r=>r.weight)) : refW;
  const bestBmi   = height ? activeMin / ((height/100)**2) : null;
  const lossPct   = refW > 0 ? (refW - activeMin) / refW * 100 : 0;
  const goalPct   = (goal && refW > goal) ? Math.max(0,(refW-activeMin)/(refW-goal)*100) : 0;

  // ── 갱신 + 주간 감량 + 월간 감량 (1월 1일~) ─────────────────────
  const lossActive = withWeight.filter(r => r.date >= LOSS_START_DATE);

  let renewals = 0;
  if (lossActive.length > 0) {
    let runMin = lossActive[0].weight;
    for (let i = 1; i < lossActive.length; i++) {
      if (lossActive[i].weight < runMin) { runMin = lossActive[i].weight; renewals++; }
    }
  }

  const lossWeekMap = {};
  lossActive.forEach(r => {
    const d = new Date(r.date+'T00:00:00'), sun = new Date(d);
    sun.setDate(d.getDate()-d.getDay());
    const wk = toDs(sun);
    if (!lossWeekMap[wk]) lossWeekMap[wk] = [];
    lossWeekMap[wk].push(r.weight);
  });
  const lossWeekAvgs = Object.entries(lossWeekMap).sort((a,b)=>a[0].localeCompare(b[0]))
    .map(([,ws])=>ws.reduce((s,w)=>s+w,0)/ws.length);
  let weekDec = 0;
  for (let i = 1; i < lossWeekAvgs.length; i++) if (lossWeekAvgs[i] < lossWeekAvgs[i-1]) weekDec++;

  const lossMonthMap = {};
  lossActive.forEach(r => {
    const ym = r.date.slice(0,7);
    if (!lossMonthMap[ym]) lossMonthMap[ym] = {count:0,sum:0};
    lossMonthMap[ym].count++; lossMonthMap[ym].sum += r.weight;
  });
  const qualMonths = Object.entries(lossMonthMap).filter(([,d])=>d.count>=15)
    .sort((a,b)=>a[0].localeCompare(b[0])).map(([ym,d])=>({ym,avg:d.sum/d.count}));
  let maxDecStreak = 0, streak = 0;
  for (let i = 1; i < qualMonths.length; i++) {
    const [py,pm] = qualMonths[i-1].ym.split('-').map(Number);
    const [cy,cm] = qualMonths[i].ym.split('-').map(Number);
    if ((cy*12+cm)===(py*12+pm+1) && qualMonths[i].avg < qualMonths[i-1].avg) { streak++; maxDecStreak = Math.max(maxDecStreak,streak); }
    else streak = 0;
  }

  // ── 체중 기록 횟수 (6월 1일~) ───────────────────────────────────
  const recordActive = withWeight.filter(r => r.date >= RECORD_START_DATE);
  const total = recordActive.length;

  // 주간 입력 횟수 (6월 1일~)
  const recWeekMap = {};
  recordActive.forEach(r => {
    const d = new Date(r.date+'T00:00:00'), sun = new Date(d);
    sun.setDate(d.getDate()-d.getDay());
    const wk = toDs(sun);
    if (!recWeekMap[wk]) recWeekMap[wk] = [];
    recWeekMap[wk].push(r.weight);
  });
  const recWeekEntries = Object.values(recWeekMap);
  const maxWeeklyEntries = recWeekEntries.length ? Math.max(...recWeekEntries.map(e=>e.length)) : 0;

  // 월간 기록 횟수 (6월 1일~)
  const recMonthMap = {};
  recordActive.forEach(r => {
    const ym = r.date.slice(0,7);
    if (!recMonthMap[ym]) recMonthMap[ym] = 0;
    recMonthMap[ym]++;
  });
  const m10 = Object.values(recMonthMap).filter(c=>c>=10).length;
  const m20 = Object.values(recMonthMap).filter(c=>c>=20).length;

  // ── 식단·운동 (6월 1일~) ────────────────────────────────────────
  const activeDays = allRecs.filter(r => r.date >= RECORD_START_DATE);

  let mealFullDays = 0, mealGreenCount = 0, mealEntryCount = 0;
  const mealWeekMap = {}, mealMonthMap = {};
  activeDays.forEach(r => {
    const m = r.meal || {};
    const entries = [m.morning, m.lunch, m.dinner].filter(v => v != null);
    mealEntryCount += entries.length;
    mealGreenCount += entries.filter(v => v === 'green').length;
    if (entries.length === 3) mealFullDays++;
    if (entries.length > 0) {
      const d = new Date(r.date+'T00:00:00'), sun = new Date(d);
      sun.setDate(d.getDate()-d.getDay());
      const wk = toDs(sun);
      mealWeekMap[wk] = (mealWeekMap[wk]||0) + entries.length;
      mealMonthMap[r.date.slice(0,7)] = (mealMonthMap[r.date.slice(0,7)]||0) + entries.length;
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
    total, refW, activeMin, lossPct, bestBmi, goal, goalPct, renewals,
    weekDec, maxWeeklyEntries, m10, m20, maxDecStreak,
    mealFullDays, mealGreenCount, mealEntryCount, weeklyMeal18, monthlyMeal60,
    exerciseCount, maxExStreak, weeklyEx3, monthlyEx15,
  };
}

export function calculateEarnedIds(records, user) {
  const earned = new Set();
  if (!records.length) return earned;
  const {
    total, lossPct, bestBmi, goal, goalPct, renewals,
    weekDec, maxWeeklyEntries, m10, m20, maxDecStreak,
    mealFullDays, mealGreenCount, mealEntryCount, weeklyMeal18, monthlyMeal60,
    exerciseCount, maxExStreak, weeklyEx3, monthlyEx15,
  } = extractData(records, user);

  // 체중 기록 (6월 1일~)
  [1,5,10,20,30,40,50,70,100,120,150,200,250,300,365,500,1000].forEach(n => { if(total>=n) earned.add(`record_${n}`); });

  // 감량
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

  // 목표
  if(goal) earned.add('goal_set');
  if(goalPct>=10)  earned.add('goal_10pct');
  if(goalPct>=25)  earned.add('goal_25pct');
  if(goalPct>=50)  earned.add('goal_50pct');
  if(goalPct>=75)  earned.add('goal_75pct');
  const allW = records.filter(r=>r.weight!=null);
  const am2  = allW.length ? Math.min(...allW.map(r=>r.weight)) : Infinity;
  if(goal && am2<=goal) earned.add('goal_achieved');

  // 갱신 (1월 1일~)
  [1,5,10,20,30,40,50,60,70,80,90,100].forEach(n => { if(renewals>=n) earned.add(`daily_${n}`); });

  // 식단 일간 (6월 1일~)
  [1,10,20,30,50,100].forEach(n => { if(mealFullDays>=n) earned.add(`diet_meal_${n}`); });

  // 운동 일간 (6월 1일~)
  [1,10,20,30,50,100].forEach(n => { if(exerciseCount>=n) earned.add(`ex_${n}`); });

  // 주간 감량 (1월 1일~)
  [1,2,3,4,5,10,15,20,25,30].forEach(n => { if(weekDec>=n) earned.add(`weekly_${n}`); });

  // 주간 입력 (6월 1일~)
  if(maxWeeklyEntries>=3) earned.add('weekly_input_3');
  if(maxWeeklyEntries>=5) earned.add('weekly_input_5');
  if(maxWeeklyEntries>=7) earned.add('weekly_input_7');

  // 주간 식단/운동 (6월 1일~)
  [1,2,4,8,12].forEach(n => { if(weeklyMeal18>=n) earned.add(`diet_week_${n}`); });
  [1,2,4,8,12].forEach(n => { if(weeklyEx3>=n)    earned.add(`ex_week_${n}`); });

  // 월간 기록 (6월 1일~)
  if(m10>=1) earned.add('monthly_10');
  if(m20>=1) earned.add('monthly_20');
  [2,3,4,5,6,7,8,9,10,11,12].forEach(n => { if(m20>=n) earned.add(`monthly_20x${n}`); });

  // 월간 감량 (1월 1일~)
  if(maxDecStreak>=1) earned.add('monthly_dec_1');
  if(maxDecStreak>=2) earned.add('monthly_dec_2');
  if(maxDecStreak>=3) earned.add('monthly_dec_3');

  // 월간 식단/운동 (6월 1일~)
  [1,2,3].forEach(n => { if(monthlyMeal60>=n) earned.add(`diet_month_${n}`); });
  [1,2,3].forEach(n => { if(monthlyEx15>=n)   earned.add(`ex_month_${n}`); });

  // 식단 — 녹색 끼니 누적 (6월 1일~)
  [1,5,10,20,30,50,100].forEach(n => { if(mealGreenCount>=n) earned.add(`diet_green_${n}`); });

  // 식단 — 전체 끼니 기록 누적 (6월 1일~)
  [10,30,50,100,200,300,500].forEach(n => { if(mealEntryCount>=n) earned.add(`meal_entry_${n}`); });

  // 운동 — 연속 (6월 1일~)
  if(maxExStreak>=2)  earned.add('ex_streak_2');
  if(maxExStreak>=3)  earned.add('ex_streak_3');
  if(maxExStreak>=5)  earned.add('ex_streak_5');
  if(maxExStreak>=7)  earned.add('ex_streak_7');
  if(maxExStreak>=14) earned.add('ex_streak_14');

  // 운동 — 고단계 누적 (6월 1일~)
  if(exerciseCount>=150) earned.add('ex_cum_150');
  if(exerciseCount>=200) earned.add('ex_cum_200');
  if(exerciseCount>=300) earned.add('ex_cum_300');
  if(exerciseCount>=500) earned.add('ex_cum_500');

  return earned;
}

/**
 * 메타 업적 계산 (등급·업적 개수) — achievements.html에서 base 계산 후 호출
 * @param {Set} baseEarned - calculateEarnedIds 결과
 * @param {number} baseScore - calcTotalScore(baseEarned)
 * @param {Array} tiers - tierSettings?.tiers || DEFAULT_TIERS
 * @returns {Set} 추가로 달성된 메타 업적 ID set
 */
export function calculateMetaEarnedIds(baseEarned, baseScore, tiers) {
  const meta = new Set();
  const sorted = [...tiers].sort((a,b) => a.minScore - b.minScore);

  // 등급 달성 (점수 기반)
  const gradeMap = {
    'grade_bronze':      sorted.find(t=>t.id==='bronze')?.minScore      ?? 80,
    'grade_silver':      sorted.find(t=>t.id==='silver')?.minScore      ?? 200,
    'grade_gold':        sorted.find(t=>t.id==='gold')?.minScore        ?? 380,
    'grade_platinum':    sorted.find(t=>t.id==='platinum')?.minScore    ?? 580,
    'grade_emerald':     sorted.find(t=>t.id==='emerald')?.minScore     ?? 700,
    'grade_diamond':     sorted.find(t=>t.id==='diamond')?.minScore     ?? 800,
    'grade_master':      sorted.find(t=>t.id==='master')?.minScore      ?? 1000,
    'grade_grandmaster': sorted.find(t=>t.id==='grandmaster')?.minScore ?? 1250,
    'grade_challenger':  sorted.find(t=>t.id==='challenger')?.minScore  ?? 1500,
  };
  Object.entries(gradeMap).forEach(([id, threshold]) => {
    if (baseScore >= threshold) meta.add(id);
  });

  // 업적 개수 달성
  const earnedCount = baseEarned.size;
  if (earnedCount >= 10)  meta.add('ach_10');
  if (earnedCount >= 50)  meta.add('ach_50');
  if (earnedCount >= 100) meta.add('ach_100');
  if (earnedCount >= 200) meta.add('ach_200');

  return meta;
}

export function calculateProgress(records, user) {
  const {
    total, lossPct, goalPct, goal, renewals,
    weekDec, maxWeeklyEntries, m10, m20, maxDecStreak,
    mealFullDays, mealGreenCount, mealEntryCount, weeklyMeal18, monthlyMeal60,
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
    diet_green_1:p(mealGreenCount,1),diet_green_5:p(mealGreenCount,5),diet_green_10:p(mealGreenCount,10),
    diet_green_20:p(mealGreenCount,20),diet_green_30:p(mealGreenCount,30),diet_green_50:p(mealGreenCount,50),diet_green_100:p(mealGreenCount,100),
    meal_entry_10:p(mealEntryCount,10),meal_entry_30:p(mealEntryCount,30),meal_entry_50:p(mealEntryCount,50),
    meal_entry_100:p(mealEntryCount,100),meal_entry_200:p(mealEntryCount,200),meal_entry_300:p(mealEntryCount,300),meal_entry_500:p(mealEntryCount,500),
    ex_streak_2:p(maxExStreak,2),ex_streak_3:p(maxExStreak,3),ex_streak_5:p(maxExStreak,5),
    ex_streak_7:p(maxExStreak,7),ex_streak_14:p(maxExStreak,14),
    ex_cum_150:p(exerciseCount,150),ex_cum_200:p(exerciseCount,200),
    ex_cum_300:p(exerciseCount,300),ex_cum_500:p(exerciseCount,500),
  };
}

export function calcTotalScore(earnedIds) {
  return [...earnedIds].reduce((sum, id) => {
    const a = ACHIEVEMENTS.find(x => x.id === id);
    return sum + (a ? a.score : 0);
  }, 0);
}

export const DEFAULT_TIERS = [
  { id:'iron',        name:'아이언',       minScore:0,    color:'#6B6B6B' },
  { id:'bronze',      name:'브론즈',       minScore:80,   color:'#8C4A2F' },
  { id:'silver',      name:'실버',         minScore:200,  color:'#82A0AA' },
  { id:'gold',        name:'골드',         minScore:380,  color:'#C89B3C' },
  { id:'platinum',    name:'플래티넘',     minScore:580,  color:'#009B8D' },
  { id:'emerald',     name:'에메랄드',     minScore:700,  color:'#00A86B' },
  { id:'diamond',     name:'다이아몬드',   minScore:800,  color:'#576BCE' },
  { id:'master',      name:'마스터',       minScore:1000, color:'#9B59B6' },
  { id:'grandmaster', name:'그랜드마스터', minScore:1250, color:'#CD3232' },
  { id:'challenger',  name:'챌린저',       minScore:1500, color:'#F4C874' },
];

export function getTierForScore(score, tiers = DEFAULT_TIERS) {
  return [...tiers].sort((a,b)=>b.minScore-a.minScore).find(t=>score>=t.minScore) || tiers[0];
}
