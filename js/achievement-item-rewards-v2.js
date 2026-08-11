import { RECORD_META_REWARD_ITEMS } from './record-meta-rewards.js';

// Permanent V2 item rewards. Keys are stable achievement ids.
export const ACHIEVEMENT_ITEM_REWARDS_V2 = Object.freeze({
  record_30:['gs_mint_trace'],
  record_5:['title_runeflame_apprentice'],
  record_10:['title_stariron_novice'],
  record_100:['title_rift_stitcher'],
  record_streak_7:['title_dawn_watch'],
  record_streak_14:['title_shadow_pactbearer'],
  record_streak_30:['title_doomclock_breaker'],
  ex_10:['title_shieldline_rookie'],
  ex_30:['title_ironwall_vanguard'],
  ex_70:['title_abyssbell_hunter'],
  ex_100:['title_thunderhammer_artisan'],
  ex_200:['title_soulcitadel_gatekeeper'],
  ex_300:['tr_a_doomhammer_statue'],
  steps_10k_5:['title_ashwind_tracker'],
  steps_total_100k:['title_beastpath_companion'],
  steps_total_1m:['tr_a_golden_ball'],
  water_goal_5:['title_healing_circle_touch'],
  water_goal_30:['title_holylance_sentinel'],
  mood_10:['title_leyline_tuner'],
  mood_100:['tr_a_golden_gramophone'],
  journal_clean_10:['title_venom_alchemist'],
  journal_clean_30:['title_ancient_script_decoder'],
  allgreen_10:['title_phoenix_array_healer'],
  weekly_input_5:['title_dungeon_pathfinder'],
  weekly_input_7:['title_eclipse_infiltrator'],
  diet_week_12:['tr_a_club_world_orbit'],
  diet_month_3:['title_crimson_moon_arbiter'],
  monthly_20x3:['title_throneless_warmarshal'],
  monthly_20x6:['title_stargrave_guide','tr_a_big_ears'],
  grade_master:['title_skycleaver'],
  grade_grandmaster:['tr_a_summoners_cup'],
  grade_challenger:['tr_a_frostmourne_statue'],
  ach_30:['tr_a_cinema_guardian'],
  ach_50:['tr_a_world_series_constellation'],
  ach_75:['title_dead_god_witness','tr_a_world_cup_orb'],
  ach_100:['title_infinite_hall_returnee','tr_a_aegis_shield'],
  record_365:['gs_crown_of_dawn','tr_a_stanley_tower'],
  ...RECORD_META_REWARD_ITEMS,
});
export function normalizeAchievementTrophyRewardsV2(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
  return Object.fromEntries(Object.entries(raw).flatMap(([achievementId,value])=>{
    const ids=(Array.isArray(value)?value:[value]).filter(id=>typeof id==='string'&&/^tr_[a-z0-9_]+$/.test(id));
    return achievementId?[[achievementId,[...new Set(ids)]]]:[];
  }));
}

export function normalizeAchievementTitleRewardsV2(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
  return Object.fromEntries(Object.entries(raw).flatMap(([achievementId,value])=>{
    const ids=(Array.isArray(value)?value:[value]).filter(id=>typeof id==='string'&&/^title_[a-z0-9_]+$/.test(id));
    return achievementId?[[achievementId,[...new Set(ids)]]]:[];
  }));
}

export const rewardItemsForAchievementsV2 = (ids,dynamicTrophyRewards={},dynamicTitleRewards={}) => {
  const dynamic=normalizeAchievementTrophyRewardsV2(dynamicTrophyRewards);
  const titles=normalizeAchievementTitleRewardsV2(dynamicTitleRewards);
  return [...new Set([...ids].flatMap(id=>{
    const base=ACHIEVEMENT_ITEM_REWARDS_V2[id]||[];
    const fixed=base.filter(item=>!item.startsWith('tr_')&&!item.startsWith('title_'));
    const baseTrophies=base.filter(item=>item.startsWith('tr_'));
    const baseTitles=base.filter(item=>item.startsWith('title_'));
    return [
      ...fixed,
      ...(Object.hasOwn(dynamic,id)?dynamic[id]:baseTrophies),
      ...(Object.hasOwn(titles,id)?titles[id]:baseTitles),
    ];
  }))];
};
