// Permanent V2 item rewards. Keys are stable achievement ids.
export const ACHIEVEMENT_ITEM_REWARDS_V2 = Object.freeze({
  record_30:['gs_mint_trace'],
  allgreen_5:['ae_forest_spore'], ex_10:['pm_shield'], ex_50:['tr_hunter_horn'],
  weekly_5:['title_campfire_beacon'],
  goal_50pct:['title_stormstring_marksman'], goal_achieved:['title_last_beacon_bearer','tr_crystal_cup'],
  water_goal_10:['ae_bubble'], record_365:['gs_crown_of_dawn'],
});
export function normalizeAchievementTrophyRewardsV2(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
  return Object.fromEntries(Object.entries(raw).flatMap(([achievementId,value])=>{
    const ids=(Array.isArray(value)?value:[value]).filter(id=>typeof id==='string'&&/^tr_[a-z0-9_]+$/.test(id));
    return achievementId&&ids.length?[[achievementId,[...new Set(ids)]]]:[];
  }));
}

export const rewardItemsForAchievementsV2 = (ids,dynamicTrophyRewards={}) => {
  const dynamic=normalizeAchievementTrophyRewardsV2(dynamicTrophyRewards);
  return [...new Set([...ids].flatMap(id=>[...(ACHIEVEMENT_ITEM_REWARDS_V2[id]||[]),...(dynamic[id]||[])]))];
};
