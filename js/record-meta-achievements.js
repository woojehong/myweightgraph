import { MEAL_TIMES, isMealLogged } from './meal-status.js';

export const RETIRED_PERFORMANCE_ACHIEVEMENT_IDS = Object.freeze([
  ...[1,2,3,5,7,10,15,20,25,30].map(n=>`loss_${n}pct`),
  'goal_set','goal_10pct','goal_25pct','goal_50pct','goal_75pct','goal_achieved',
  ...[1,5,10,20,30,40,50,60,70,80,90,100].map(n=>`daily_${n}`),
  ...[1,2,3,4,5,7,10,12,15,20,25,30].map(n=>`weekly_${n}`),
  'monthly_dec_1','monthly_dec_2','monthly_dec_3',
]);

const meta=(id,horizon,name,desc,score,icon,titleId,trophyId=null)=>Object.freeze({
  id,cat:`meta_${horizon}`,horizon,name,desc,score,icon,legendary:horizon==='1y',titleId,trophyId,
});

export const RECORD_META_ACHIEVEMENTS = Object.freeze([
  meta('meta_3m_first_season','3m','첫 번째 계절','서로 다른 60일에 한 가지 이상 기록',30,'🌱','title_today_logged','tr_a_season_hourglass'),
  meta('meta_3m_twelve_weeks','3m','열두 주의 발자국','서로 다른 12주에 한 가지 이상 기록',30,'🗓️','title_calendar_sentinel','tr_a_twelve_week_compass'),
  meta('meta_3m_three_calendars','3m','세 장의 달력','3개월 동안 매월 12일 이상 기록',35,'📆','title_three_season_witness','tr_a_three_month_recordstone'),
  meta('meta_3m_life_triangle','3m','생활의 삼각형','하루에 서로 다른 3개 범주를 기록한 날 30일',35,'🔺','title_life_recorder'),
  meta('meta_3m_weight_journal','3m','체중 관찰일지','체중을 60회 기록',30,'⚖️','title_body_observer'),
  meta('meta_3m_table_chronicle','3m','식탁의 연대기','식단을 150끼 기록',30,'🍽️','title_table_scribe'),
  meta('meta_3m_water_history','3m','한 잔의 역사','물을 한 잔 이상 기록한 날 60일',30,'💧','title_water_quartermaster'),
  meta('meta_3m_training_log','3m','훈련 기록부','운동 여부를 기록한 날 24일',30,'📒','title_training_logkeeper'),
  meta('meta_3m_daily_annotation','3m','일상의 주석','생활메모 또는 기분을 기록한 날 30일',30,'✍️','title_daily_librarian'),
  meta('meta_3m_versatile','3m','기록의 만능인','4개 기록 범주를 각각 15일 이상 기록',40,'🧩','title_versatile_recorder','tr_a_record_prism'),
  meta('meta_3m_returner','3m','다시 쓰는 사람','7일 이상 쉰 뒤 다시 기록한 경험 3회',35,'🔥','title_always_returns','tr_a_returning_phoenix'),
  meta('meta_3m_hundred_ink','3m','백일의 잉크','전체 입력 항목을 합계 300건 기록',35,'🖋️','title_ink_unspared'),

  meta('meta_6m_half_year_voyage','6m','반년의 항해','서로 다른 120일에 한 가지 이상 기록',50,'⛵','title_halfyear_voyager','tr_a_halfyear_chalice'),
  meta('meta_6m_twentyfour_weeks','6m','스물네 주의 증인','서로 다른 24주에 한 가지 이상 기록',50,'🧭','title_weekly_supervisor'),
  meta('meta_6m_six_calendars','6m','여섯 장의 달력','6개월 동안 매월 12일 이상 기록',55,'🌗','title_halfyear_attendee','tr_a_six_month_astrolabe'),
  meta('meta_6m_observation_net','6m','생활 관측망','하루에 서로 다른 3개 범주를 기록한 날 75일',55,'🕸️','title_life_data_manager'),
  meta('meta_6m_weight_chronicle','6m','체중 연대기','체중을 120회 기록',50,'📜','title_change_witness'),
  meta('meta_6m_table_epic','6m','식탁 대서사시','식단을 350끼 기록',50,'🥘','title_grand_table_scribe'),
  meta('meta_6m_never_dry','6m','마르지 않는 기록','물을 한 잔 이상 기록한 날 120일',50,'🌊','title_spring_guardian'),
  meta('meta_6m_iron_notebook','6m','철의 수첩','운동 여부를 기록한 날 50일',50,'📓','title_record_ironman','tr_a_iron_notebook'),
  meta('meta_6m_five_paths','6m','다섯 갈래 기록','4개 기록 범주를 각각 35일 이상 기록',60,'🌈','title_many_path_archivist'),
  meta('meta_6m_infinite_threeday','6m','작심삼일 무한연장','기록한 주가 누적 24주 이상',55,'♻️','title_infinite_threeday'),

  meta('meta_1y_four_seasons','1y','사계의 기록자','서로 다른 240일에 한 가지 이상 기록',80,'🌳','title_four_season_recorder','tr_a_four_season_worldtree'),
  meta('meta_1y_fortyeight_weeks','1y','마흔여덟 주의 여정','서로 다른 48주에 한 가지 이상 기록',80,'🛤️','title_time_walker'),
  meta('meta_1y_twelve_calendars','1y','열두 장의 달력','12개월 동안 매월 10일 이상 기록',90,'🗓️','title_still_recording','tr_a_golden_almanac'),
  meta('meta_1y_grand_compilation','1y','일상의 대편찬','하루에 서로 다른 3개 범주를 기록한 날 180일',90,'📚','title_almanac_editor'),
  meta('meta_1y_body_observer','1y','몸의 장기 관찰자','체중을 250회 기록',80,'🔭','title_long_breath_observer'),
  meta('meta_1y_thousand_tables','1y','천 번의 식탁','식단을 1,000끼 기록',100,'🏺','title_thousand_tables','tr_a_thousand_table_chalice'),
  meta('meta_1y_complete_network','1y','완성된 기록망','4개 기록 범주를 각각 60일 이상 기록',100,'✨','title_record_network_master'),
  meta('meta_1y_time_archive','1y','시간의 보관소','전체 입력 항목을 합계 1,500건 기록',120,'🏛️','title_eternal_archivist','tr_a_eternal_archive'),
]);

const toDate=value=>new Date(`${value}T00:00:00`);
const weekKey=date=>{const d=toDate(date);d.setDate(d.getDate()-d.getDay());return d.toISOString().slice(0,10)};
const journalLogged=record=>Object.values(record?.journal||{}).some(v=>v===true||v===false);

export function extractRecordMetaData(records=[]){
  const dates=new Set(),weeks=new Set(),months=new Map(),categoryDays={weight:0,meal:0,water:0,exercise:0,steps:0,mood:0,journal:0};
  let mealEntries=0,multiCategoryDays=0,totalEntries=0,annotationDays=0;
  const activeDates=[];
  [...records].sort((a,b)=>String(a.date).localeCompare(String(b.date))).forEach(record=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(record?.date||''))return;
    const mealCount=MEAL_TIMES.map(time=>record.meal?.[time]).filter(isMealLogged).length;
    const flags={
      weight:record.weight!=null,
      meal:mealCount>0,
      water:typeof record.water==='number'&&record.water>0,
      exercise:typeof record.exercise==='boolean',
      steps:typeof record.steps==='number'&&record.steps>0,
      mood:record.mood!=null,
      journal:journalLogged(record),
    };
    const categories=Object.values(flags).filter(Boolean).length;
    if(!categories)return;
    dates.add(record.date);weeks.add(weekKey(record.date));activeDates.push(record.date);
    months.set(record.date.slice(0,7),(months.get(record.date.slice(0,7))||0)+1);
    Object.entries(flags).forEach(([key,on])=>{if(on)categoryDays[key]++});
    if(categories>=3)multiCategoryDays++;
    if(flags.mood||flags.journal)annotationDays++;
    mealEntries+=mealCount;
    totalEntries+=Number(flags.weight)+mealCount+Number(flags.water)+Number(flags.exercise)+Number(flags.steps)+Number(flags.mood)+Number(flags.journal);
  });
  let returns=0;
  for(let i=1;i<activeDates.length;i++){
    const gap=Math.round((toDate(activeDates[i])-toDate(activeDates[i-1]))/86400000);
    if(gap>=8)returns++;
  }
  const breadth15=Object.values(categoryDays).filter(days=>days>=15).length;
  const breadth35=Object.values(categoryDays).filter(days=>days>=35).length;
  const breadth60=Object.values(categoryDays).filter(days=>days>=60).length;
  return Object.freeze({
    activeDays:dates.size,activeWeeks:weeks.size,
    months12:[...months.values()].filter(days=>days>=12).length,
    months10:[...months.values()].filter(days=>days>=10).length,
    multiCategoryDays,mealEntries,totalEntries,annotationDays,returns,
    weightDays:categoryDays.weight,waterDays:categoryDays.water,exerciseLogDays:categoryDays.exercise,
    breadth15,breadth35,breadth60,categoryDays:Object.freeze(categoryDays),
  });
}

const RULES=Object.freeze({
  meta_3m_first_season:['activeDays',60],meta_3m_twelve_weeks:['activeWeeks',12],meta_3m_three_calendars:['months12',3],
  meta_3m_life_triangle:['multiCategoryDays',30],meta_3m_weight_journal:['weightDays',60],meta_3m_table_chronicle:['mealEntries',150],
  meta_3m_water_history:['waterDays',60],meta_3m_training_log:['exerciseLogDays',24],meta_3m_daily_annotation:['annotationDays',30],
  meta_3m_versatile:['breadth15',4],meta_3m_returner:['returns',3],meta_3m_hundred_ink:['totalEntries',300],
  meta_6m_half_year_voyage:['activeDays',120],meta_6m_twentyfour_weeks:['activeWeeks',24],meta_6m_six_calendars:['months12',6],
  meta_6m_observation_net:['multiCategoryDays',75],meta_6m_weight_chronicle:['weightDays',120],meta_6m_table_epic:['mealEntries',350],
  meta_6m_never_dry:['waterDays',120],meta_6m_iron_notebook:['exerciseLogDays',50],meta_6m_five_paths:['breadth35',4],
  meta_6m_infinite_threeday:['activeWeeks',24],meta_1y_four_seasons:['activeDays',240],meta_1y_fortyeight_weeks:['activeWeeks',48],
  meta_1y_twelve_calendars:['months10',12],meta_1y_grand_compilation:['multiCategoryDays',180],meta_1y_body_observer:['weightDays',250],
  meta_1y_thousand_tables:['mealEntries',1000],meta_1y_complete_network:['breadth60',4],meta_1y_time_archive:['totalEntries',1500],
});

export function calculateRecordMetaEarnedIds(records=[]){
  const data=extractRecordMetaData(records),earned=new Set();
  Object.entries(RULES).forEach(([id,[field,target]])=>{if(data[field]>=target)earned.add(id)});
  return earned;
}

export function calculateRecordMetaProgress(records=[]){
  const data=extractRecordMetaData(records);
  return Object.fromEntries(Object.entries(RULES).map(([id,[field,target]])=>[id,{current:Math.min(data[field],target),target}]));
}
