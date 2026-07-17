// achievements.js

export const RECORD_START_DATE = '2026-06-01'; // 기록 누적 기준일 (체중/식단/운동 횟수)
export const LOSS_START_DATE   = '2026-01-01'; // 감량/갱신 기준일
export const WATER_GOAL_CUPS   = 8;            // 하루 물 목표 (잔)

export const ACHIEVEMENT_CATEGORIES = [
  { id:'record',    label:'체중',  icon:'⚖️' },
  { id:'diet',      label:'식단',  icon:'🥗' },
  { id:'exercise',  label:'운동',  icon:'💪' },
  { id:'steps',     label:'걸음',  icon:'🚶' },
  { id:'life',      label:'라이프', icon:'🌱' },
  { id:'loss',      label:'감량',  icon:'📉' },
  { id:'goal',      label:'목표',  icon:'🎯' },
  { id:'daily',     label:'일간',  icon:'📆' },
  { id:'weekly',    label:'주간',  icon:'📅' },
  { id:'monthly',   label:'월간',  icon:'🗓️' },
  { id:'grade',     label:'등급',  icon:'🏅' },
  { id:'milestone', label:'업적',  icon:'🎖️' },
];

export const ACHIEVEMENTS = [

  // ── 체중 기록 (6월 1일~) ─────────────────────────────────────────────
  { id:'record_1',   cat:'record', name:'첫 측정',    desc:'처음으로 체중을 기록했어요',        score:10,  icon:'⚖️' },
  { id:'record_5',   cat:'record', name:'5회 측정',   desc:'체중을 5번 측정했어요',             score:10,  icon:'📏' },
  { id:'record_10',  cat:'record', name:'10회 측정',  desc:'체중을 10번 측정했어요',            score:10,  icon:'📐' },
  { id:'record_20',  cat:'record', name:'20회 측정',  desc:'체중을 20번 측정했어요',            score:20,  icon:'📒' },
  { id:'record_30',  cat:'record', name:'30회 측정',  desc:'체중을 30번 측정했어요',            score:20,  icon:'📓' },
  { id:'record_40',  cat:'record', name:'40회 측정',  desc:'체중을 40번 측정했어요',            score:20,  icon:'📔' },
  { id:'record_50',  cat:'record', name:'50회 측정',  desc:'체중을 50번 측정했어요',            score:30,  icon:'📈' },
  { id:'record_70',  cat:'record', name:'70회 측정',  desc:'체중을 70번 측정했어요',            score:30,  icon:'📊' },
  { id:'record_100', cat:'record', name:'100회 측정', desc:'체중을 100번 측정했어요',           score:40,  icon:'💯' },
  { id:'record_120', cat:'record', name:'120회 측정', desc:'체중을 120번 측정했어요',           score:50,  icon:'🎯' },
  { id:'record_150', cat:'record', name:'150회 측정', desc:'체중을 150번 측정했어요',           score:60,  icon:'🥈' },
  { id:'record_200', cat:'record', name:'200회 측정', desc:'체중을 200번 측정했어요',           score:70,  icon:'🥇' },
  { id:'record_250', cat:'record', name:'250회 측정', desc:'체중을 250번 측정했어요',           score:80,  icon:'🌠' },
  { id:'record_300', cat:'record', name:'300회 측정', desc:'체중을 300번 측정했어요',           score:100, icon:'✨' },
  { id:'record_365', cat:'record', name:'365회 측정', desc:'1년 동안 365번 체중을 측정했어요', score:100, icon:'🌟', legendary:true },

  // ── 식단 — 끼니 단위 녹색 누적 (6월 1일~) ─────────────────────────
  { id:'diet_green_1',   cat:'diet', name:'초록 첫 끼니',   desc:'녹색 식단을 처음 기록했어요 (끼니 단위)',    score:10, icon:'🥦' },
  { id:'diet_green_5',   cat:'diet', name:'초록 5끼니',     desc:'녹색 식단 5끼니 누적',                      score:10, icon:'🥦' },
  { id:'diet_green_10',  cat:'diet', name:'초록 10끼니',    desc:'녹색 식단 10끼니 누적',                     score:20, icon:'🥦' },
  { id:'diet_green_20',  cat:'diet', name:'초록 20끼니',    desc:'녹색 식단 20끼니 누적',                     score:20, icon:'🥦' },
  { id:'diet_green_30',  cat:'diet', name:'초록 30끼니',    desc:'녹색 식단 30끼니 누적',                     score:30, icon:'🥦' },
  { id:'diet_green_50',  cat:'diet', name:'초록 50끼니',    desc:'녹색 식단 50끼니 누적',                     score:40, icon:'🥦' },
  { id:'diet_green_100', cat:'diet', name:'초록 100끼니',   desc:'녹색 식단 100끼니 누적',                    score:60, icon:'🥦', legendary:true },

  // ── 식단 — 올그린 (하루 3끼 모두 초록, 6월 1일~) ──────────────────
  { id:'allgreen_1',  cat:'diet', name:'올 그린 하루',   desc:'하루 3끼 모두 초록 — 첫 달성',                score:10, icon:'🌿' },
  { id:'allgreen_2',  cat:'diet', name:'올 그린 2일',    desc:'하루 3끼 모두 초록인 날 2일 달성',             score:15, icon:'🌿' },
  { id:'allgreen_3',  cat:'diet', name:'올 그린 3일',    desc:'하루 3끼 모두 초록인 날 3일 달성',             score:20, icon:'🌿' },
  { id:'allgreen_5',  cat:'diet', name:'올 그린 5일',    desc:'하루 3끼 모두 초록인 날 5일 달성',             score:30, icon:'🌿' },
  { id:'allgreen_10', cat:'diet', name:'올 그린 10일',   desc:'하루 3끼 모두 초록인 날 10일 달성',            score:50, icon:'🌿', legendary:true },

  // ── 식단 — 전체 끼니 기록 누적 (색상 무관, 6월 1일~) ─────────────
  { id:'meal_entry_10',  cat:'diet', name:'식단 10끼 기록',  desc:'색상 관계없이 기록된 끼니 10개 누적',      score:10, icon:'🍽️' },
  { id:'meal_entry_30',  cat:'diet', name:'식단 30끼 기록',  desc:'색상 관계없이 기록된 끼니 30개 누적',      score:10, icon:'🍱' },
  { id:'meal_entry_50',  cat:'diet', name:'식단 50끼 기록',  desc:'색상 관계없이 기록된 끼니 50개 누적',      score:20, icon:'🥣' },
  { id:'meal_entry_100', cat:'diet', name:'식단 100끼 기록', desc:'색상 관계없이 기록된 끼니 100개 누적',     score:30, icon:'🥗' },
  { id:'meal_entry_200', cat:'diet', name:'식단 200끼 기록', desc:'색상 관계없이 기록된 끼니 200개 누적',     score:40, icon:'🥘' },
  { id:'meal_entry_300', cat:'diet', name:'식단 300끼 기록', desc:'색상 관계없이 기록된 끼니 300개 누적',     score:50, icon:'🫕' },
  { id:'meal_entry_500', cat:'diet', name:'식단 500끼 기록', desc:'색상 관계없이 기록된 끼니 500개 누적',     score:70, icon:'👨‍🍳', legendary:true },

  // ── 운동 — 연속 (6월 1일~, 최대 5일) ────────────────────────────────
  { id:'ex_streak_2', cat:'exercise', name:'운동 2일 연속', desc:'2일 연속 운동 달성',                        score:10, icon:'🔥' },
  { id:'ex_streak_3', cat:'exercise', name:'운동 3일 연속', desc:'3일 연속 운동 달성',                        score:20, icon:'🔥' },
  { id:'ex_streak_5', cat:'exercise', name:'운동 5일 연속', desc:'5일 연속 운동 달성',                        score:30, icon:'🔥' },

  // ── 운동 — 누적 (6월 1일~) ───────────────────────────────────────────
  { id:'ex_10',  cat:'exercise', name:'운동 10회',   desc:'운동 체크마크 10회 달성',                          score:10,  icon:'🏃' },
  { id:'ex_20',  cat:'exercise', name:'운동 20회',   desc:'운동 체크마크 20회 달성',                          score:20,  icon:'🚴' },
  { id:'ex_30',  cat:'exercise', name:'운동 30회',   desc:'운동 체크마크 30회 달성',                          score:20,  icon:'🏊' },
  { id:'ex_50',  cat:'exercise', name:'운동 50회',   desc:'운동 체크마크 50회 달성',                          score:30,  icon:'🤸' },
  { id:'ex_70',  cat:'exercise', name:'운동 70회',   desc:'운동 체크마크 70회 달성',                          score:40,  icon:'🏋️' },
  { id:'ex_100', cat:'exercise', name:'운동 100회',  desc:'운동 체크마크 100회 달성',                         score:50,  icon:'💪', legendary:true },
  { id:'ex_150', cat:'exercise', name:'운동 150회',  desc:'운동 체크마크 150회 달성',                         score:70,  icon:'🥊', legendary:true },
  { id:'ex_200', cat:'exercise', name:'운동 200회',  desc:'운동 체크마크 200회 달성',                         score:100, icon:'🏅', legendary:true },
  { id:'ex_300', cat:'exercise', name:'운동 300회',  desc:'운동 체크마크 300회 달성',                         score:200, icon:'🏆', legendary:true },

  // ── 걸음 수 ──────────────────────────────────────────────────────────
  { id:'steps_day_1',       cat:'steps', name:'첫 걸음',        desc:'걸음 수를 처음 기록했어요',              score:10, icon:'🚶' },
  { id:'steps_8k_1',        cat:'steps', name:'8천 보',         desc:'하루 8,000보를 달성했어요',              score:10, icon:'👟' },
  { id:'steps_10k_1',       cat:'steps', name:'만보 클럽',      desc:'하루 10,000보를 처음 달성했어요',        score:10, icon:'🚶' },
  { id:'steps_10k_5',       cat:'steps', name:'만보 5일',       desc:'하루 1만 보 달성 5일 누적',              score:15, icon:'🏃' },
  { id:'steps_10k_10',      cat:'steps', name:'만보 10일',      desc:'하루 1만 보 달성 10일 누적',             score:20, icon:'🏃' },
  { id:'steps_10k_30',      cat:'steps', name:'만보 30일',      desc:'하루 1만 보 달성 30일 누적',             score:40, icon:'🔥', legendary:true },
  { id:'steps_20k_1',       cat:'steps', name:'2만 보!',        desc:'하루 20,000보를 달성했어요',             score:20, icon:'⚡' },
  { id:'steps_total_100k',  cat:'steps', name:'누적 10만 보',   desc:'기록된 걸음 수 100,000보 누적',          score:20, icon:'🗺️' },
  { id:'steps_total_500k',  cat:'steps', name:'누적 50만 보',   desc:'기록된 걸음 수 500,000보 누적',          score:40, icon:'🌍' },
  { id:'steps_total_1m',    cat:'steps', name:'누적 100만 보',  desc:'기록된 걸음 수 1,000,000보 누적',        score:60, icon:'🌌', legendary:true },

  // ── 라이프 — 물 ──────────────────────────────────────────────────────
  { id:'water_first',       cat:'life', name:'첫 잔',           desc:'물 마시기를 처음 기록했어요',            score:10, icon:'💧' },
  { id:'water_goal_1',      cat:'life', name:'수분 충전',       desc:'하루 물 목표(8잔)를 처음 달성했어요',    score:10, icon:'💧' },
  { id:'water_goal_5',      cat:'life', name:'물 목표 5일',     desc:'하루 물 목표 달성 5일 누적',             score:15, icon:'🚰' },
  { id:'water_goal_10',     cat:'life', name:'물 목표 10일',    desc:'하루 물 목표 달성 10일 누적',            score:20, icon:'🌊' },
  { id:'water_goal_30',     cat:'life', name:'물 목표 30일',    desc:'하루 물 목표 달성 30일 누적',            score:40, icon:'🌊', legendary:true },
  { id:'water_total_100',   cat:'life', name:'누적 100잔',      desc:'물 100잔 누적',                          score:20, icon:'🥤' },
  { id:'water_total_500',   cat:'life', name:'누적 500잔',      desc:'물 500잔 누적',                          score:50, icon:'🏆' },

  // ── 라이프 — 저널 (금주·야식 없음·일찍 취침) ─────────────────────────
  { id:'journal_first',     cat:'life', name:'첫 저널',         desc:'하루 저널을 처음 기록했어요',            score:10, icon:'📔' },
  { id:'journal_clean_1',   cat:'life', name:'클린 데이',       desc:'저널 3항목 모두 ✓ 인 날 첫 달성',        score:10, icon:'✨' },
  { id:'journal_clean_5',   cat:'life', name:'클린 5일',        desc:'저널 3항목 모두 ✓ 인 날 5일 누적',       score:15, icon:'✨' },
  { id:'journal_clean_10',  cat:'life', name:'클린 10일',       desc:'저널 3항목 모두 ✓ 인 날 10일 누적',      score:20, icon:'🌟' },
  { id:'journal_clean_30',  cat:'life', name:'클린 30일',       desc:'저널 3항목 모두 ✓ 인 날 30일 누적',      score:40, icon:'👑', legendary:true },

  // ── 라이프 — 기분 ────────────────────────────────────────────────────
  { id:'mood_first',        cat:'life', name:'오늘의 기분',     desc:'기분을 처음 기록했어요',                 score:10, icon:'😊' },
  { id:'mood_10',           cat:'life', name:'감정 기록 10일',  desc:'기분 기록 10일 누적',                    score:15, icon:'😄' },
  { id:'mood_30',           cat:'life', name:'감정 기록 30일',  desc:'기분 기록 30일 누적',                    score:25, icon:'🥰' },
  { id:'mood_100',          cat:'life', name:'감정 기록 100일', desc:'기분 기록 100일 누적',                   score:50, icon:'🌈', legendary:true },

  // ── 감량 ─────────────────────────────────────────────────────────────
  { id:'loss_1pct',  cat:'loss', name:'첫 감량',    desc:'기준 체중 대비 1% 감량',                           score:10, icon:'📉' },
  { id:'loss_2pct',  cat:'loss', name:'2% 돌파',    desc:'기준 체중 대비 2% 감량',                           score:10, icon:'📉' },
  { id:'loss_3pct',  cat:'loss', name:'3% 돌파',    desc:'기준 체중 대비 3% 감량',                           score:10, icon:'📉' },
  { id:'loss_5pct',  cat:'loss', name:'5% 클럽',    desc:'기준 체중 대비 5% 감량',                           score:20, icon:'🔥' },
  { id:'loss_7pct',  cat:'loss', name:'7% 달성',    desc:'기준 체중 대비 7% 감량',                           score:20, icon:'🌡️' },
  { id:'loss_10pct', cat:'loss', name:'10% 돌파',   desc:'기준 체중 대비 10% 감량',                          score:30, icon:'💥' },
  { id:'loss_15pct', cat:'loss', name:'15% 달성',   desc:'15% 감량 또는 BMI 23.5 이하',                      score:40, icon:'🚀', bmiThreshold:23.5 },
  { id:'loss_20pct', cat:'loss', name:'20% 달성',   desc:'20% 감량 또는 BMI 23 이하',                        score:50, icon:'⚡', bmiThreshold:23   },
  { id:'loss_25pct', cat:'loss', name:'25% 달성',   desc:'25% 감량 또는 BMI 22.5 이하',                      score:60, icon:'🌪️', bmiThreshold:22.5 },
  { id:'loss_30pct', cat:'loss', name:'30% 달성',   desc:'30% 감량 또는 BMI 22 이하',                        score:60, icon:'🏆', legendary:true, bmiThreshold:22 },

  // ── 목표 ─────────────────────────────────────────────────────────────
  { id:'goal_set',      cat:'goal', name:'목표 설정',    desc:'목표 체중을 처음으로 설정했어요',               score:10, icon:'🎯' },
  { id:'goal_10pct',    cat:'goal', name:'목표까지 10%', desc:'목표까지의 여정 중 10%를 달성했어요',           score:10, icon:'🏃' },
  { id:'goal_25pct',    cat:'goal', name:'목표까지 25%', desc:'목표까지의 여정 중 25%를 달성했어요',           score:20, icon:'🚶' },
  { id:'goal_50pct',    cat:'goal', name:'목표까지 50%', desc:'목표까지의 여정 중 절반을 달성했어요',          score:40, icon:'🏁' },
  { id:'goal_75pct',    cat:'goal', name:'목표까지 75%', desc:'목표까지의 여정 중 75%를 달성했어요',           score:60, icon:'🎖️' },
  { id:'goal_achieved', cat:'goal', name:'목표 달성!',   desc:'설정한 목표 체중에 도달했어요',                  score:80, icon:'🏆', legendary:true },

  // ── 일간 — 최저 체중 갱신 (1월 1일~) ────────────────────────────────
  { id:'daily_1',   cat:'daily', name:'첫 최저 갱신',  desc:'처음으로 최저 체중을 갱신했어요',                score:10, icon:'📆' },
  { id:'daily_5',   cat:'daily', name:'5회 갱신',      desc:'최저 체중을 5번 경신했어요',                     score:10, icon:'📉' },
  { id:'daily_10',  cat:'daily', name:'10회 갱신',     desc:'최저 체중을 10번 경신했어요',                    score:10, icon:'🔽' },
  { id:'daily_20',  cat:'daily', name:'20회 갱신',     desc:'최저 체중을 20번 경신했어요',                    score:10, icon:'🔻' },
  { id:'daily_30',  cat:'daily', name:'30회 갱신',     desc:'최저 체중을 30번 경신했어요',                    score:20, icon:'📌' },
  { id:'daily_40',  cat:'daily', name:'40회 갱신',     desc:'최저 체중을 40번 경신했어요',                    score:20, icon:'🎀' },
  { id:'daily_50',  cat:'daily', name:'50회 갱신',     desc:'최저 체중을 50번 경신했어요',                    score:20, icon:'⭐' },
  { id:'daily_60',  cat:'daily', name:'60회 갱신',     desc:'최저 체중을 60번 경신했어요',                    score:30, icon:'🌊' },
  { id:'daily_70',  cat:'daily', name:'70회 갱신',     desc:'최저 체중을 70번 경신했어요',                    score:30, icon:'🌀' },
  { id:'daily_80',  cat:'daily', name:'80회 갱신',     desc:'최저 체중을 80번 경신했어요',                    score:30, icon:'💫' },
  { id:'daily_90',  cat:'daily', name:'90회 갱신',     desc:'최저 체중을 90번 경신했어요',                    score:40, icon:'🌟' },
  { id:'daily_100', cat:'daily', name:'100회 갱신',    desc:'최저 체중을 100번 경신했어요',                   score:50, icon:'👑', legendary:true },

  // ── 일간 — 식단 기록 (3끼 모두 기록한 날, 6월 1일~) ─────────────────
  { id:'diet_meal_1',   cat:'daily', name:'첫 식단 기록', desc:'3끼 모두 기록한 날 첫 달성',                  score:10, icon:'🥗' },
  { id:'diet_meal_10',  cat:'daily', name:'식단 10일',    desc:'3끼 모두 기록한 날 10일 달성',                score:10, icon:'🥗' },
  { id:'diet_meal_20',  cat:'daily', name:'식단 20일',    desc:'3끼 모두 기록한 날 20일 달성',                score:20, icon:'🥗' },
  { id:'diet_meal_30',  cat:'daily', name:'식단 30일',    desc:'3끼 모두 기록한 날 30일 달성',                score:20, icon:'🥗' },
  { id:'diet_meal_50',  cat:'daily', name:'식단 50일',    desc:'3끼 모두 기록한 날 50일 달성',                score:30, icon:'🥗' },
  { id:'diet_meal_100', cat:'daily', name:'식단 100일',   desc:'3끼 모두 기록한 날 100일 달성',               score:50, icon:'🥗', legendary:true },

  // ── 일간 — 운동 첫 기록 (6월 1일~) ──────────────────────────────────
  { id:'ex_1', cat:'daily', name:'첫 운동 기록', desc:'처음으로 운동 체크마크를 달성했어요',                  score:10, icon:'💪' },

  // ── 주간 — 체중 감량 (1월 1일~) ─────────────────────────────────────
  { id:'weekly_1',  cat:'weekly', name:'첫 주간 감량',  desc:'전주 평균보다 낮아진 주 1회',                   score:10, icon:'📅' },
  { id:'weekly_2',  cat:'weekly', name:'2주 감량',      desc:'전주 평균보다 낮아진 주 2회 누적',              score:10, icon:'📅' },
  { id:'weekly_3',  cat:'weekly', name:'3주 감량',      desc:'전주 평균보다 낮아진 주 3회 누적',              score:10, icon:'📅' },
  { id:'weekly_4',  cat:'weekly', name:'4주 감량',      desc:'전주 평균보다 낮아진 주 4회 누적',              score:10, icon:'📅' },
  { id:'weekly_5',  cat:'weekly', name:'5주 감량',      desc:'전주 평균보다 낮아진 주 5회 누적',              score:15, icon:'📅' },
  { id:'weekly_7',  cat:'weekly', name:'7주 감량',      desc:'전주 평균보다 낮아진 주 7회 누적',              score:20, icon:'📉' },
  { id:'weekly_10', cat:'weekly', name:'10주 감량',     desc:'전주 평균보다 낮아진 주 10회 누적',             score:25, icon:'🔽' },
  { id:'weekly_12', cat:'weekly', name:'12주 감량',     desc:'전주 평균보다 낮아진 주 12회 누적',             score:30, icon:'📊' },
  { id:'weekly_15', cat:'weekly', name:'15주 감량',     desc:'전주 평균보다 낮아진 주 15회 누적',             score:40, icon:'🎯' },
  { id:'weekly_20', cat:'weekly', name:'20주 감량',     desc:'전주 평균보다 낮아진 주 20회 누적',             score:50, icon:'🌙' },
  { id:'weekly_25', cat:'weekly', name:'25주 감량',     desc:'전주 평균보다 낮아진 주 25회 누적',             score:70, icon:'🌠' },
  { id:'weekly_30', cat:'weekly', name:'30주 감량',     desc:'전주 평균보다 낮아진 주 30회 누적',             score:80, icon:'🌌', legendary:true },

  // ── 주간 — 체중 입력 (6월 1일~) ─────────────────────────────────────
  { id:'weekly_input_3', cat:'weekly', name:'주 3회 입력', desc:'한 주에 3회 이상 체중을 기록한 주 최초 달성',        score:10, icon:'✏️' },
  { id:'weekly_input_5', cat:'weekly', name:'주 5회 입력', desc:'한 주에 5회 이상 체중을 기록한 주 최초 달성',        score:20, icon:'✏️' },
  { id:'weekly_input_7', cat:'weekly', name:'주 7회 개근', desc:'한 주에 7일 모두 체중을 기록한 주 최초 달성',        score:30, icon:'🏆' },

  // ── 주간 — 식단 기록 (6월 1일~) ─────────────────────────────────────
  { id:'diet_week_1',  cat:'weekly', name:'주간 식단 1회',  desc:'주 18끼 이상 기록한 주 1회 달성',            score:10, icon:'🥗' },
  { id:'diet_week_2',  cat:'weekly', name:'주간 식단 2회',  desc:'주 18끼 이상 기록한 주 2회 누적',            score:10, icon:'🥗' },
  { id:'diet_week_4',  cat:'weekly', name:'주간 식단 4회',  desc:'주 18끼 이상 기록한 주 4회 누적',            score:20, icon:'🥗' },
  { id:'diet_week_8',  cat:'weekly', name:'주간 식단 8회',  desc:'주 18끼 이상 기록한 주 8회 누적',            score:30, icon:'🥗' },
  { id:'diet_week_12', cat:'weekly', name:'주간 식단 12회', desc:'주 18끼 이상 기록한 주 12회 누적',           score:50, icon:'🥗', legendary:true },

  // ── 주간 — 운동 기록 (6월 1일~) ─────────────────────────────────────
  { id:'ex_week_1',  cat:'weekly', name:'주간 운동 1회',  desc:'주 3회 이상 운동한 주 1회 달성',               score:10, icon:'💪' },
  { id:'ex_week_2',  cat:'weekly', name:'주간 운동 2회',  desc:'주 3회 이상 운동한 주 2회 누적',               score:10, icon:'💪' },
  { id:'ex_week_4',  cat:'weekly', name:'주간 운동 4회',  desc:'주 3회 이상 운동한 주 4회 누적',               score:20, icon:'💪' },
  { id:'ex_week_8',  cat:'weekly', name:'주간 운동 8회',  desc:'주 3회 이상 운동한 주 8회 누적',               score:30, icon:'💪' },
  { id:'ex_week_12', cat:'weekly', name:'주간 운동 12회', desc:'주 3회 이상 운동한 주 12회 누적',              score:50, icon:'💪', legendary:true },

  // ── 월간 — 체중 입력 (6월 1일~) ─────────────────────────────────────
  { id:'monthly_10',    cat:'monthly', name:'월간 10회',    desc:'한 달에 10회 이상 체중을 기록한 달 달성',    score:10,  icon:'🗓️' },
  { id:'monthly_20',    cat:'monthly', name:'월간 20회',    desc:'한 달에 20회 이상 체중을 기록한 달 달성',    score:20,  icon:'🗓️' },
  { id:'monthly_20x2',  cat:'monthly', name:'2개월 달성',   desc:'월 20회+ 체중 기록 2개월 누적',                   score:20,  icon:'🗓️' },
  { id:'monthly_20x3',  cat:'monthly', name:'3개월 달성',   desc:'월 20회+ 체중 기록 3개월 누적',                   score:30,  icon:'🗓️' },
  { id:'monthly_20x4',  cat:'monthly', name:'4개월 달성',   desc:'월 20회+ 체중 기록 4개월 누적',                   score:30,  icon:'🗓️' },
  { id:'monthly_20x5',  cat:'monthly', name:'5개월 달성',   desc:'월 20회+ 체중 기록 5개월 누적',                   score:40,  icon:'🗓️' },
  { id:'monthly_20x6',  cat:'monthly', name:'6개월 달성',   desc:'월 20회+ 체중 기록 6개월 누적',                   score:50,  icon:'📅' },
  { id:'monthly_20x7',  cat:'monthly', name:'7개월 달성',   desc:'월 20회+ 체중 기록 7개월 누적',                   score:50,  icon:'🗓️' },
  { id:'monthly_20x8',  cat:'monthly', name:'8개월 달성',   desc:'월 20회+ 체중 기록 8개월 누적',                   score:60,  icon:'🗓️' },
  { id:'monthly_20x9',  cat:'monthly', name:'9개월 달성',   desc:'월 20회+ 체중 기록 9개월 누적',                   score:60,  icon:'🍂' },
  { id:'monthly_20x10', cat:'monthly', name:'10개월 달성',  desc:'월 20회+ 체중 기록 10개월 누적',                  score:70,  icon:'🗓️' },
  { id:'monthly_20x11', cat:'monthly', name:'11개월 달성',  desc:'월 20회+ 체중 기록 11개월 누적',                  score:80,  icon:'🗓️' },
  { id:'monthly_20x12', cat:'monthly', name:'12개월 달성',  desc:'월 20회+ 체중 기록 12개월 누적',                  score:120, icon:'🎊', legendary:true },

  // ── 월간 — 체중 감량 (1월 1일~) ─────────────────────────────────────
  { id:'monthly_dec_1', cat:'monthly', name:'월간 감량 1개월', desc:'월 15회+ 체중 기록한 달 기준, 평균 체중이 전달보다 낮아진 달 1개월',  score:40, icon:'📉' },
  { id:'monthly_dec_2', cat:'monthly', name:'월간 감량 2개월', desc:'월 15회+ 체중 기록한 달 기준, 평균 체중이 연속으로 낮아진 달 2개월', score:60, icon:'📉' },
  { id:'monthly_dec_3', cat:'monthly', name:'월간 감량 3개월', desc:'월 15회+ 체중 기록한 달 기준, 평균 체중이 연속으로 낮아진 달 3개월', score:60, icon:'👑', legendary:true },

  // ── 월간 — 식단 기록 (6월 1일~) ─────────────────────────────────────
  { id:'diet_month_1', cat:'monthly', name:'월간 식단 1개월', desc:'한 달에 60끼 이상 기록한 달 달성',         score:30, icon:'🥗' },
  { id:'diet_month_2', cat:'monthly', name:'월간 식단 2개월', desc:'월 60끼+ 기록 2개월 누적',                 score:50, icon:'🥗' },
  { id:'diet_month_3', cat:'monthly', name:'월간 식단 3개월', desc:'월 60끼+ 기록 3개월 누적',                 score:70, icon:'🥗', legendary:true },

  // ── 월간 — 운동 기록 (6월 1일~) ─────────────────────────────────────
  { id:'ex_month_1', cat:'monthly', name:'월간 운동 1개월', desc:'한 달에 15회 이상 운동한 달 달성',           score:30, icon:'💪' },
  { id:'ex_month_2', cat:'monthly', name:'월간 운동 2개월', desc:'월 15회+ 운동 2개월 누적',                   score:50, icon:'💪' },
  { id:'ex_month_3', cat:'monthly', name:'월간 운동 3개월', desc:'월 15회+ 운동 3개월 누적',                   score:70, icon:'💪', legendary:true },

  // ── 등급 — 티어 달성 (점수 기반, 메타 업적) ──────────────────────────
  { id:'grade_bronze',      cat:'grade', name:'브론즈 달성',      desc:'업적 점수가 브론즈 기준 이상 달성',     score:20,  icon:'🥉' },
  { id:'grade_silver',      cat:'grade', name:'실버 달성',        desc:'업적 점수가 실버 기준 이상 달성',       score:30,  icon:'🥈' },
  { id:'grade_gold',        cat:'grade', name:'골드 달성',        desc:'업적 점수가 골드 기준 이상 달성',       score:40,  icon:'🥇' },
  { id:'grade_platinum',    cat:'grade', name:'플래티넘 달성',    desc:'업적 점수가 플래티넘 기준 이상 달성',   score:50,  icon:'💎', legendary:true },
  { id:'grade_emerald',     cat:'grade', name:'에메랄드 달성',    desc:'업적 점수가 에메랄드 기준 이상 달성',   score:70,  icon:'💚', legendary:true },
  { id:'grade_diamond',     cat:'grade', name:'다이아몬드 달성',  desc:'업적 점수가 다이아몬드 기준 이상 달성', score:80,  icon:'💠', legendary:true },
  { id:'grade_master',      cat:'grade', name:'마스터 달성',      desc:'업적 점수가 마스터 기준 이상 달성',     score:100, icon:'👑', legendary:true },
  { id:'grade_grandmaster', cat:'grade', name:'그랜드마스터 달성',desc:'업적 점수가 그랜드마스터 기준 이상 달성',score:150,icon:'🌟', legendary:true },
  { id:'grade_challenger',  cat:'grade', name:'챌린저 달성',      desc:'업적 점수가 챌린저 기준 이상 달성',     score:200, icon:'⚡', legendary:true },

  // ── 체중 연속 기록 streak (6월 1일~, 최대 30일) ──────────────────────
  { id:'record_streak_3',  cat:'record', name:'3일 연속 기록',  desc:'체중을 3일 연속으로 기록했어요',           score:10,  icon:'📆' },
  { id:'record_streak_7',  cat:'record', name:'7일 연속 기록',  desc:'체중을 7일 연속으로 기록했어요',           score:20,  icon:'🗓️' },
  { id:'record_streak_14', cat:'record', name:'14일 연속 기록', desc:'체중을 14일 연속으로 기록했어요',          score:30,  icon:'📅' },
  { id:'record_streak_30', cat:'record', name:'30일 연속 기록', desc:'체중을 30일 연속으로 기록했어요',          score:50,  icon:'🔥', legendary:true },

  // ── 업적 — 달성 개수 마일스톤 (메타 업적) ────────────────────────────
  { id:'ach_1',   cat:'milestone', name:'첫 업적',          desc:'처음으로 업적을 달성했어요',                  score:5,   icon:'🎖️' },
  { id:'ach_3',   cat:'milestone', name:'업적 3개 달성',    desc:'업적을 3개 달성했어요',                       score:5,   icon:'🎖️' },
  { id:'ach_5',   cat:'milestone', name:'업적 5개 달성',    desc:'업적을 5개 달성했어요',                       score:10,  icon:'🎖️' },
  { id:'ach_10',  cat:'milestone', name:'업적 10개 달성',   desc:'업적을 10개 달성했어요',                      score:10,  icon:'🎖️' },
  { id:'ach_20',  cat:'milestone', name:'업적 20개 달성',   desc:'업적을 20개 달성했어요',                      score:15,  icon:'🎖️' },
  { id:'ach_30',  cat:'milestone', name:'업적 30개 달성',   desc:'업적을 30개 달성했어요',                      score:20,  icon:'🎖️' },
  { id:'ach_50',  cat:'milestone', name:'업적 50개 달성',   desc:'업적을 50개 달성했어요',                      score:30,  icon:'🎖️' },
  { id:'ach_75',  cat:'milestone', name:'업적 75개 달성',   desc:'업적을 75개 달성했어요',                      score:40,  icon:'🏅' },
  { id:'ach_100', cat:'milestone', name:'업적 100개 달성',  desc:'업적을 100개 달성했어요',                     score:50,  icon:'🏆', legendary:true },
  { id:'ach_125', cat:'milestone', name:'업적 125개 달성',  desc:'업적을 125개 달성했어요',                     score:70,  icon:'👑', legendary:true },
];

// 과거 버전에서 제거된 업적 id (달성 불가능 업적 정리)
export const RETIRED_ACHIEVEMENT_IDS = new Set(['ach_150', 'ach_200']);
const PAUSED_ACHIEVEMENT_IDS = new Set(
  ACHIEVEMENTS.filter(a => a.cat === 'steps' || a.id.startsWith('mood_') || a.id.startsWith('journal_')).map(a => a.id)
);

const toDs = d =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

function extractData(records, user) {
  const withWeight = records.filter(r => r.weight != null).sort((a,b) => a.date.localeCompare(b.date));
  const allRecs    = [...records].sort((a,b) => a.date.localeCompare(b.date));

  const height = user?.height, goal = user?.goal;
  const refW   = user?.referenceWeight || (withWeight.length ? Math.max(...withWeight.map(r=>r.weight)) : 0);

  // ── 감량 (날짜 제한 없음) ─────────────────────────────────────────────
  const activeMin = withWeight.length ? Math.min(...withWeight.map(r=>r.weight)) : refW;
  const bestBmi   = height ? activeMin / ((height/100)**2) : null;
  const lossPct   = refW > 0 ? (refW - activeMin) / refW * 100 : 0;
  const goalPct   = (goal && refW > goal) ? Math.max(0,(refW-activeMin)/(refW-goal)*100) : 0;

  // ── 갱신 + 주간/월간 감량 (1월 1일~) ─────────────────────────────────
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

  // ── 체중 기록 횟수 (6월 1일~) ─────────────────────────────────────────
  const recordActive = withWeight.filter(r => r.date >= RECORD_START_DATE);
  const total = recordActive.length;

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

  const recMonthMap = {};
  recordActive.forEach(r => {
    const ym = r.date.slice(0,7);
    if (!recMonthMap[ym]) recMonthMap[ym] = 0;
    recMonthMap[ym]++;
  });
  const m10 = Object.values(recMonthMap).filter(c=>c>=10).length;
  const m20 = Object.values(recMonthMap).filter(c=>c>=20).length;

  // ── 식단·운동 (6월 1일~) ──────────────────────────────────────────────
  const activeDays = allRecs.filter(r => r.date >= RECORD_START_DATE);

  let mealFullDays = 0, mealGreenCount = 0, mealGreenDays = 0, mealEntryCount = 0;
  const mealWeekMap = {}, mealMonthMap = {};
  activeDays.forEach(r => {
    const m = r.meal || {};
    const entries = [m.morning, m.lunch, m.dinner].filter(v => v != null);
    mealEntryCount += entries.length;
    mealGreenCount += entries.filter(v => v === 'green').length;
    if (entries.length === 3) {
      mealFullDays++;
      if (m.morning === 'green' && m.lunch === 'green' && m.dinner === 'green') mealGreenDays++;
    }
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

  // ── 걸음/물/저널/기분 (신규 항목 — 날짜 제한 없음) ──────────────────
  let waterTotal = 0, waterGoalDays = 0, waterAnyDays = 0;
  let moodDays = 0;
  let journalAnyDays = 0, journalCleanDays = 0;
  let stepsTotal = 0, stepsAnyDays = 0, steps8kDays = 0, steps10kDays = 0, steps20kDays = 0;
  allRecs.forEach(r => {
    if (typeof r.water === 'number' && r.water > 0) {
      waterTotal += r.water; waterAnyDays++;
      if (r.water >= WATER_GOAL_CUPS) waterGoalDays++;
    }
    if (r.mood != null) moodDays++;
    const j = r.journal || {};
    const jvals = [j.noAlcohol, j.noSnack, j.earlySleep];
    if (jvals.some(v => v === true || v === false)) journalAnyDays++;
    if (jvals.every(v => v === true)) journalCleanDays++;
    if (typeof r.steps === 'number' && r.steps > 0) {
      stepsTotal += r.steps; stepsAnyDays++;
      if (r.steps >= 8000)  steps8kDays++;
      if (r.steps >= 10000) steps10kDays++;
      if (r.steps >= 20000) steps20kDays++;
    }
  });

  // ── 체중 연속 기록 streak (6월 1일~, 최대 30일 캡) ───────────────────
  let maxRecordStreak = 0;
  if (recordActive.length > 0) {
    const dateSet = new Set(recordActive.map(r => r.date));
    const first = new Date(recordActive[0].date + 'T00:00:00');
    const last  = new Date(recordActive[recordActive.length - 1].date + 'T00:00:00');
    let recStreak = 0;
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
      if (dateSet.has(toDs(d))) { recStreak++; maxRecordStreak = Math.max(maxRecordStreak, Math.min(recStreak, 30)); }
      else recStreak = 0;
    }
  }

  return {
    total, refW, activeMin, lossPct, bestBmi, goal, goalPct, renewals,
    weekDec, maxWeeklyEntries, m10, m20, maxDecStreak,
    mealFullDays, mealGreenCount, mealGreenDays, mealEntryCount,
    weeklyMeal18, monthlyMeal60,
    exerciseCount, maxExStreak, weeklyEx3, monthlyEx15,
    maxRecordStreak,
    waterTotal, waterGoalDays, waterAnyDays,
    moodDays, journalAnyDays, journalCleanDays,
    stepsTotal, stepsAnyDays, steps8kDays, steps10kDays, steps20kDays,
  };
}

export function calculateEarnedIds(records, user) {
  const earned = new Set();
  if (!records.length) return earned;
  const {
    total, lossPct, bestBmi, goal, goalPct, renewals,
    weekDec, maxWeeklyEntries, m10, m20, maxDecStreak,
    mealFullDays, mealGreenCount, mealGreenDays, mealEntryCount,
    weeklyMeal18, monthlyMeal60,
    exerciseCount, maxExStreak, weeklyEx3, monthlyEx15,
    maxRecordStreak,
    waterTotal, waterGoalDays, waterAnyDays,
    moodDays, journalAnyDays, journalCleanDays,
    stepsTotal, stepsAnyDays, steps8kDays, steps10kDays, steps20kDays,
  } = extractData(records, user);

  // 체중 기록 (6월 1일~)
  [1,5,10,20,30,40,50,70,100,120,150,200,250,300,365].forEach(n => { if(total>=n) earned.add(`record_${n}`); });

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

  // 운동 첫 기록
  if(exerciseCount>=1) earned.add('ex_1');

  // 주간 감량 (1월 1일~)
  [1,2,3,4,5,7,10,12,15,20,25,30].forEach(n => { if(weekDec>=n) earned.add(`weekly_${n}`); });

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

  // 식단 — 끼니 단위 녹색 누적 (6월 1일~)
  [1,5,10,20,30,50,100].forEach(n => { if(mealGreenCount>=n) earned.add(`diet_green_${n}`); });

  // 식단 — 올그린 (하루 3끼 모두 초록, 6월 1일~)
  [1,2,3,5,10].forEach(n => { if(mealGreenDays>=n) earned.add(`allgreen_${n}`); });

  // 식단 — 전체 끼니 기록 누적 (6월 1일~)
  [10,30,50,100,200,300,500].forEach(n => { if(mealEntryCount>=n) earned.add(`meal_entry_${n}`); });

  // 운동 — 연속 (6월 1일~, 최대 5일)
  if(maxExStreak>=2) earned.add('ex_streak_2');
  if(maxExStreak>=3) earned.add('ex_streak_3');
  if(maxExStreak>=5) earned.add('ex_streak_5');

  // 운동 — 누적 (6월 1일~)
  [10,20,30,50,70,100,150,200,300].forEach(n => { if(exerciseCount>=n) earned.add(`ex_${n}`); });

  // 체중 연속 기록 streak (6월 1일~)
  if(maxRecordStreak>=3)  earned.add('record_streak_3');
  if(maxRecordStreak>=7)  earned.add('record_streak_7');
  if(maxRecordStreak>=14) earned.add('record_streak_14');
  if(maxRecordStreak>=30) earned.add('record_streak_30');

  // 걸음 수
  if(stepsAnyDays>=1)  earned.add('steps_day_1');
  if(steps8kDays>=1)   earned.add('steps_8k_1');
  if(steps10kDays>=1)  earned.add('steps_10k_1');
  if(steps10kDays>=5)  earned.add('steps_10k_5');
  if(steps10kDays>=10) earned.add('steps_10k_10');
  if(steps10kDays>=30) earned.add('steps_10k_30');
  if(steps20kDays>=1)  earned.add('steps_20k_1');
  if(stepsTotal>=100000)  earned.add('steps_total_100k');
  if(stepsTotal>=500000)  earned.add('steps_total_500k');
  if(stepsTotal>=1000000) earned.add('steps_total_1m');

  // 물
  if(waterAnyDays>=1)   earned.add('water_first');
  if(waterGoalDays>=1)  earned.add('water_goal_1');
  if(waterGoalDays>=5)  earned.add('water_goal_5');
  if(waterGoalDays>=10) earned.add('water_goal_10');
  if(waterGoalDays>=30) earned.add('water_goal_30');
  if(waterTotal>=100)   earned.add('water_total_100');
  if(waterTotal>=500)   earned.add('water_total_500');

  // 저널
  if(journalAnyDays>=1)    earned.add('journal_first');
  if(journalCleanDays>=1)  earned.add('journal_clean_1');
  if(journalCleanDays>=5)  earned.add('journal_clean_5');
  if(journalCleanDays>=10) earned.add('journal_clean_10');
  if(journalCleanDays>=30) earned.add('journal_clean_30');

  // 기분
  if(moodDays>=1)   earned.add('mood_first');
  if(moodDays>=10)  earned.add('mood_10');
  if(moodDays>=30)  earned.add('mood_30');
  if(moodDays>=100) earned.add('mood_100');

  // Paused features cannot create new achievements. Previously stored awards
  // remain valid in the engine, preserving their score and wallet history.
  PAUSED_ACHIEVEMENT_IDS.forEach(id => earned.delete(id));
  return earned;
}

/**
 * 메타 업적 계산 (등급·업적 개수) — achievements.html에서 base 계산 후 호출
 */
export function calculateMetaEarnedIds(baseEarned, baseScore, tiers) {
  const meta = new Set();
  const sorted = [...tiers].sort((a,b) => a.minScore - b.minScore);

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

  const earnedCount = baseEarned.size;
  if (earnedCount >= 1)   meta.add('ach_1');
  if (earnedCount >= 3)   meta.add('ach_3');
  if (earnedCount >= 5)   meta.add('ach_5');
  if (earnedCount >= 10)  meta.add('ach_10');
  if (earnedCount >= 20)  meta.add('ach_20');
  if (earnedCount >= 30)  meta.add('ach_30');
  if (earnedCount >= 50)  meta.add('ach_50');
  if (earnedCount >= 75)  meta.add('ach_75');
  if (earnedCount >= 100) meta.add('ach_100');
  if (earnedCount >= 125) meta.add('ach_125');

  return meta;
}

// 메타 업적(등급·업적 개수) 진행도 — 잠금 카드에 진행바를 띄우기 위함
export function calculateMetaProgress(baseEarnedCount, totalScore, tiers = DEFAULT_TIERS) {
  const p = (cur, tgt) => ({ current: Math.min(cur, tgt), target: tgt });
  const out = {};
  [1,3,5,10,20,30,50,75,100,125].forEach(n => { out[`ach_${n}`] = p(baseEarnedCount, n); });
  const sorted = [...tiers].sort((a,b) => a.minScore - b.minScore);
  const gradeIds = {
    grade_bronze:'bronze', grade_silver:'silver', grade_gold:'gold',
    grade_platinum:'platinum', grade_emerald:'emerald', grade_diamond:'diamond',
    grade_master:'master', grade_grandmaster:'grandmaster', grade_challenger:'challenger',
  };
  Object.entries(gradeIds).forEach(([achId, tierId]) => {
    const cut = sorted.find(t => t.id === tierId)?.minScore;
    if (cut != null && cut > 0) out[achId] = p(totalScore, cut);
  });
  return out;
}

export function calculateProgress(records, user) {
  const {
    total, lossPct, goalPct, goal, renewals,
    weekDec, maxWeeklyEntries, m10, m20, maxDecStreak,
    mealFullDays, mealGreenCount, mealGreenDays, mealEntryCount,
    weeklyMeal18, monthlyMeal60,
    exerciseCount, maxExStreak, weeklyEx3, monthlyEx15,
    maxRecordStreak,
    waterTotal, waterGoalDays, waterAnyDays,
    moodDays, journalAnyDays, journalCleanDays,
    stepsTotal, stepsAnyDays, steps8kDays, steps10kDays, steps20kDays,
  } = extractData(records, user);
  const p = (cur, tgt) => ({ current: Math.min(cur, tgt), target: tgt });
  return {
    // 체중
    record_1:p(total,1), record_5:p(total,5), record_10:p(total,10), record_20:p(total,20),
    record_30:p(total,30), record_40:p(total,40), record_50:p(total,50), record_70:p(total,70),
    record_100:p(total,100), record_120:p(total,120), record_150:p(total,150), record_200:p(total,200),
    record_250:p(total,250), record_300:p(total,300), record_365:p(total,365),
    // 감량
    loss_1pct:p(lossPct,1), loss_2pct:p(lossPct,2), loss_3pct:p(lossPct,3), loss_5pct:p(lossPct,5),
    loss_7pct:p(lossPct,7), loss_10pct:p(lossPct,10), loss_15pct:p(lossPct,15), loss_20pct:p(lossPct,20),
    loss_25pct:p(lossPct,25), loss_30pct:p(lossPct,30),
    // 목표
    goal_set:p(goal?1:0,1), goal_10pct:p(goalPct,10), goal_25pct:p(goalPct,25),
    goal_50pct:p(goalPct,50), goal_75pct:p(goalPct,75), goal_achieved:p(goalPct,100),
    // 일간 갱신
    daily_1:p(renewals,1), daily_5:p(renewals,5), daily_10:p(renewals,10), daily_20:p(renewals,20),
    daily_30:p(renewals,30), daily_40:p(renewals,40), daily_50:p(renewals,50), daily_60:p(renewals,60),
    daily_70:p(renewals,70), daily_80:p(renewals,80), daily_90:p(renewals,90), daily_100:p(renewals,100),
    // 일간 식단
    diet_meal_1:p(mealFullDays,1), diet_meal_10:p(mealFullDays,10), diet_meal_20:p(mealFullDays,20),
    diet_meal_30:p(mealFullDays,30), diet_meal_50:p(mealFullDays,50), diet_meal_100:p(mealFullDays,100),
    // 일간 운동
    ex_1:p(exerciseCount,1),
    // 주간 감량
    weekly_1:p(weekDec,1), weekly_2:p(weekDec,2), weekly_3:p(weekDec,3), weekly_4:p(weekDec,4),
    weekly_5:p(weekDec,5), weekly_7:p(weekDec,7), weekly_10:p(weekDec,10), weekly_12:p(weekDec,12),
    weekly_15:p(weekDec,15), weekly_20:p(weekDec,20), weekly_25:p(weekDec,25), weekly_30:p(weekDec,30),
    // 주간 입력
    weekly_input_3:p(maxWeeklyEntries,3), weekly_input_5:p(maxWeeklyEntries,5), weekly_input_7:p(maxWeeklyEntries,7),
    // 주간 식단/운동
    diet_week_1:p(weeklyMeal18,1), diet_week_2:p(weeklyMeal18,2), diet_week_4:p(weeklyMeal18,4),
    diet_week_8:p(weeklyMeal18,8), diet_week_12:p(weeklyMeal18,12),
    ex_week_1:p(weeklyEx3,1), ex_week_2:p(weeklyEx3,2), ex_week_4:p(weeklyEx3,4),
    ex_week_8:p(weeklyEx3,8), ex_week_12:p(weeklyEx3,12),
    // 월간 기록
    monthly_10:p(m10,1), monthly_20:p(m20,1),
    monthly_20x2:p(m20,2), monthly_20x3:p(m20,3), monthly_20x4:p(m20,4),
    monthly_20x5:p(m20,5), monthly_20x6:p(m20,6), monthly_20x7:p(m20,7),
    monthly_20x8:p(m20,8), monthly_20x9:p(m20,9), monthly_20x10:p(m20,10),
    monthly_20x11:p(m20,11), monthly_20x12:p(m20,12),
    // 월간 감량
    monthly_dec_1:p(maxDecStreak,1), monthly_dec_2:p(maxDecStreak,2), monthly_dec_3:p(maxDecStreak,3),
    // 월간 식단/운동
    diet_month_1:p(monthlyMeal60,1), diet_month_2:p(monthlyMeal60,2), diet_month_3:p(monthlyMeal60,3),
    ex_month_1:p(monthlyEx15,1), ex_month_2:p(monthlyEx15,2), ex_month_3:p(monthlyEx15,3),
    // 식단 녹색/올그린/전체 끼니
    diet_green_1:p(mealGreenCount,1), diet_green_5:p(mealGreenCount,5), diet_green_10:p(mealGreenCount,10),
    diet_green_20:p(mealGreenCount,20), diet_green_30:p(mealGreenCount,30), diet_green_50:p(mealGreenCount,50),
    diet_green_100:p(mealGreenCount,100),
    allgreen_1:p(mealGreenDays,1), allgreen_2:p(mealGreenDays,2), allgreen_3:p(mealGreenDays,3),
    allgreen_5:p(mealGreenDays,5), allgreen_10:p(mealGreenDays,10),
    meal_entry_10:p(mealEntryCount,10), meal_entry_30:p(mealEntryCount,30), meal_entry_50:p(mealEntryCount,50),
    meal_entry_100:p(mealEntryCount,100), meal_entry_200:p(mealEntryCount,200),
    meal_entry_300:p(mealEntryCount,300), meal_entry_500:p(mealEntryCount,500),
    // 운동 연속/누적
    ex_streak_2:p(maxExStreak,2), ex_streak_3:p(maxExStreak,3), ex_streak_5:p(maxExStreak,5),
    ex_10:p(exerciseCount,10), ex_20:p(exerciseCount,20), ex_30:p(exerciseCount,30),
    ex_50:p(exerciseCount,50), ex_70:p(exerciseCount,70), ex_100:p(exerciseCount,100),
    ex_150:p(exerciseCount,150), ex_200:p(exerciseCount,200), ex_300:p(exerciseCount,300),
    // 체중 연속 기록 streak
    record_streak_3:p(maxRecordStreak,3), record_streak_7:p(maxRecordStreak,7),
    record_streak_14:p(maxRecordStreak,14), record_streak_30:p(maxRecordStreak,30),
    // 걸음 수
    steps_day_1:p(stepsAnyDays,1), steps_8k_1:p(steps8kDays,1), steps_10k_1:p(steps10kDays,1),
    steps_10k_5:p(steps10kDays,5), steps_10k_10:p(steps10kDays,10), steps_10k_30:p(steps10kDays,30),
    steps_20k_1:p(steps20kDays,1),
    steps_total_100k:p(stepsTotal,100000), steps_total_500k:p(stepsTotal,500000), steps_total_1m:p(stepsTotal,1000000),
    // 물
    water_first:p(waterAnyDays,1), water_goal_1:p(waterGoalDays,1), water_goal_5:p(waterGoalDays,5),
    water_goal_10:p(waterGoalDays,10), water_goal_30:p(waterGoalDays,30),
    water_total_100:p(waterTotal,100), water_total_500:p(waterTotal,500),
    // 저널
    journal_first:p(journalAnyDays,1), journal_clean_1:p(journalCleanDays,1), journal_clean_5:p(journalCleanDays,5),
    journal_clean_10:p(journalCleanDays,10), journal_clean_30:p(journalCleanDays,30),
    // 기분
    mood_first:p(moodDays,1), mood_10:p(moodDays,10), mood_30:p(moodDays,30), mood_100:p(moodDays,100),
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
