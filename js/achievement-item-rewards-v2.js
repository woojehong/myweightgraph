import { RECORD_META_REWARD_ITEMS } from './record-meta-rewards.js';

// Permanent V2 item rewards. Keys are stable achievement ids.
export const ACHIEVEMENT_ITEM_REWARDS_V2 = Object.freeze({
  record_30:['gs_mint_trace'],
  record_365:['gs_crown_of_dawn'],
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
