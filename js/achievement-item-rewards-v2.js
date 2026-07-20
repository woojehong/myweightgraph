// Permanent V2 item rewards. Keys are stable achievement ids.
export const ACHIEVEMENT_ITEM_REWARDS_V2 = Object.freeze({
  record_1:['pe_scout'], record_10:['eb_iron_buckle'], record_30:['gs_mint_trace'],
  record_100:['ct_emerald_lodge'], diet_green_10:['cp_moss_slime'],
  allgreen_5:['ae_forest_spore'], ex_10:['pm_shield'], ex_50:['tr_hunter_horn'],
  weekly_5:['title_campfire_beacon'], monthly_20:['ct_frost_keep'],
  goal_50pct:['title_stormstring_marksman'], goal_achieved:['title_last_beacon_bearer','tr_crystal_cup'],
  daily_30:['eb_sun_rays'], water_goal_10:['ae_bubble'], record_365:['gs_crown_of_dawn'],
});
export const rewardItemsForAchievementsV2 = ids => [...new Set([...ids].flatMap(id=>ACHIEVEMENT_ITEM_REWARDS_V2[id]||[]))];
