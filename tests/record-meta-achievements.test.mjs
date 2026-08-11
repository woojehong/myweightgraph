import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ACHIEVEMENTS, RETIRED_ACHIEVEMENT_IDS, calculateEarnedIds, calculateProgress } from '../js/achievements.js';
import {
  RECORD_META_ACHIEVEMENTS, RETIRED_PERFORMANCE_ACHIEVEMENT_IDS,
  calculateRecordMetaEarnedIds, extractRecordMetaData,
} from '../js/record-meta-achievements.js';
import { RECORD_META_REWARD_ITEMS, RECORD_META_TITLES, RECORD_META_TROPHIES } from '../js/record-meta-rewards.js';
import { ACHIEVEMENT_ITEM_REWARDS_V2, rewardItemsForAchievementsV2 } from '../js/achievement-item-rewards-v2.js';
import { TITLES_CATALOG_V2 } from '../js/titles-catalog-v2.js';
import { SHOWROOM_CATALOG_V2 } from '../js/showroom-catalog-v2.js';

const ds=offset=>{
  const d=new Date('2025-01-01T00:00:00');d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10);
};
const completeRecord=(offset,weight=90)=>({
  date:ds(offset),weight,water:1,exercise:offset%2===0,
  meal:{morning:'skip',lunch:'green',dinner:'red'},mood:'okay',journal:{noAlcohol:false},
});

assert.equal(RETIRED_PERFORMANCE_ACHIEVEMENT_IDS.length,43);
assert.equal(RECORD_META_ACHIEVEMENTS.length,30);
assert.equal(RECORD_META_TITLES.length,30);
assert.equal(RECORD_META_TROPHIES.length,12);
for(const trophy of RECORD_META_TROPHIES){
  const path=new URL(`../${trophy.asset.replace('./','')}`,import.meta.url);
  assert.ok(fs.existsSync(path),`${trophy.id} image is missing`);
  assert.ok(fs.statSync(path).size>50_000,`${trophy.id} image is unexpectedly small`);
  assert.equal(trophy.rarity,'artifact');
  assert.equal(trophy.purchasable,false);
  assert.equal(trophy.acquisition,'achievement_only');
}
assert.ok(RETIRED_PERFORMANCE_ACHIEVEMENT_IDS.every(id=>RETIRED_ACHIEVEMENT_IDS.has(id)));
assert.ok(RETIRED_PERFORMANCE_ACHIEVEMENT_IDS.every(id=>!ACHIEVEMENTS.some(a=>a.id===id)));
assert.deepEqual(
  [...new Set(RECORD_META_ACHIEVEMENTS.map(a=>a.horizon))].sort(),
  ['1y','3m','6m'],
);

const records=Array.from({length:365},(_,i)=>completeRecord(i,90+(i%4)));
const metrics=extractRecordMetaData(records);
assert.equal(metrics.activeDays,365);
assert.equal(metrics.mealEntries,1095,'skipped meals are valid meal records');
assert.equal(metrics.exerciseLogDays,365,'both exercise and rest-day booleans are valid records');
assert.equal(metrics.breadth60>=4,true);
const earned=calculateRecordMetaEarnedIds(records);
for(const id of [
  'meta_3m_first_season','meta_6m_half_year_voyage','meta_1y_four_seasons',
  'meta_1y_thousand_tables','meta_1y_complete_network','meta_1y_time_archive',
])assert.ok(earned.has(id),id);
assert.equal(earned.has('meta_3m_returner'),false,'continuous logging must not fake a comeback');

const comeback=[0,8,16,24].map(i=>completeRecord(i));
assert.equal(extractRecordMetaData(comeback).returns,3);
assert.ok(calculateRecordMetaEarnedIds(comeback).has('meta_3m_returner'));

const baseEarned=calculateEarnedIds(records,{referenceWeight:90,goal:70,height:180});
assert.ok(RETIRED_PERFORMANCE_ACHIEVEMENT_IDS.every(id=>!baseEarned.has(id)),'weight change can no longer earn performance achievements');
const progress=calculateProgress(records,{});
assert.deepEqual(progress.meta_1y_four_seasons,{current:240,target:240});

const defaults=rewardItemsForAchievementsV2(new Set(['meta_3m_first_season']));
assert.ok(defaults.includes('title_today_logged')&&defaults.includes('tr_a_season_hourglass'));
const overridden=rewardItemsForAchievementsV2(
  new Set(['meta_3m_first_season']),
  {meta_3m_first_season:[]},{meta_3m_first_season:['title_calendar_sentinel']},
);
assert.equal(overridden.includes('tr_a_season_hourglass'),false,'an explicit empty admin mapping removes the default trophy');
assert.equal(overridden.includes('title_today_logged'),false,'an explicit admin mapping replaces the default title');
assert.ok(overridden.includes('title_calendar_sentinel'));

for(const [id,items] of Object.entries(RECORD_META_REWARD_ITEMS)){
  assert.ok(RECORD_META_ACHIEVEMENTS.some(a=>a.id===id),id);
  assert.ok(items.some(item=>item.startsWith('title_')),`${id} needs a title reward`);
}

const automaticallyGranted=new Set(Object.values(ACHIEVEMENT_ITEM_REWARDS_V2).flat());
for(const title of TITLES_CATALOG_V2){
  assert.equal(title.acquisition,'achievement_only',`${title.id} must be achievement-only`);
  assert.equal(title.price,null,`${title.id} must not have a purchase price`);
  assert.ok(automaticallyGranted.has(title.id),`${title.id} needs a default achievement link`);
}
for(const trophy of SHOWROOM_CATALOG_V2.filter(item=>item.category==='trophy')){
  assert.equal(trophy.acquisition,'achievement_only',`${trophy.id} must be achievement-only`);
  assert.equal(trophy.purchasable,false,`${trophy.id} must not be purchasable`);
  assert.equal(trophy.price,null,`${trophy.id} must not have a purchase price`);
  assert.ok(automaticallyGranted.has(trophy.id),`${trophy.id} needs a default achievement link`);
}

const adminSource=fs.readFileSync(new URL('../admin.html',import.meta.url),'utf8');
for(const token of ['achievementTitleRewards','achievementTrophyRewards','업적 ↔ 칭호·트로피 연결']){
  assert.ok(adminSource.includes(token),`admin reward editor missing: ${token}`);
}
const swSource=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
assert.ok(swSource.includes('weight-v146-trophy-rail-24'));
for(const trophy of RECORD_META_TROPHIES)assert.ok(swSource.includes(trophy.asset.replace('./','')));
const showroomSource=fs.readFileSync(new URL('../dressroom.html',import.meta.url),'utf8');
assert.ok(showroomSource.includes("import{syncAchievements}from'./js/achievements-engine.js'"));
assert.ok(showroomSource.includes('achievement reward backfill failed'));

console.log('record-centered meta achievements tests: PASS');
