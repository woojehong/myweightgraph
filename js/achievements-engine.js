// achievements-engine.js — single shared pipeline for achievement evaluation,
// persistence, reward unlocking and wallet (coins) settlement.
// Used by: achievements.html (full page render), input.html (instant check
// after every save), admin.html (system-state preview).
//
// Policy:
//  - Achievements are PERMANENT. Once stored in Firestore they never revert,
//    even if the underlying records change (except explicit admin overrides
//    or the `invalidated` flag).
//  - Meta achievements (grade/milestone) are computed to a fixpoint so that
//    score gained from meta achievements can itself unlock further grades.
//  - Border/title rewards come from three sources: built-in auto mappings
//    (borders-data.js), admin assignments (settings/tiers), and shop purchases.

import { ACHIEVEMENTS, RETIRED_ACHIEVEMENT_IDS, calculateEarnedIds,
         calculateMetaEarnedIds, calcTotalScore, DEFAULT_TIERS,
         getTierForScore } from './achievements.js';
import { ACH_BORDER_REWARDS, ACH_TITLE_REWARDS } from './borders-data.js';
import { getUser, getWeights, getEarnedAchievements, saveEarnedAchievement,
         updateUser, getTierSettings } from './db.js';

const META_CATS = new Set(['grade', 'milestone']);
export const ACH_MAP = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));
export const isMetaAchievement = id => META_CATS.has(ACH_MAP[id]?.cat);

function applyOverrides(set, overrides, metaOnly) {
  Object.entries(overrides || {}).forEach(([achId, ov]) => {
    if (!ov || !ACH_MAP[achId]) return;
    if (isMetaAchievement(achId) !== metaOnly) return;
    if (ov.override === 'earned')     set.add(achId);
    if (ov.override === 'not_earned') set.delete(achId);
  });
}

const sameSet = (a, b) =>
  [...(a || [])].sort().join('') === [...(b || [])].sort().join('');

// Pure computation — no I/O.
export function computeAchievementState({ user, records, storedRaw, tierData }) {
  const tiers          = tierData?.tiers || DEFAULT_TIERS;
  const adminOverrides = user?.adminOverrides || {};

  const validStored = (storedRaw || []).filter(a =>
    !a.invalidated && ACH_MAP[a.id] && !RETIRED_ACHIEVEMENT_IDS.has(a.id));
  const storedIds = new Set(validStored.map(a => a.id));

  const shouldEarn = calculateEarnedIds(records || [], user);

  // Base achievements: stored (permanent) ∪ currently satisfied
  const baseEarned = new Set([
    ...[...storedIds].filter(id => !isMetaAchievement(id)),
    ...shouldEarn,
  ]);
  applyOverrides(baseEarned, adminOverrides, false);

  // Meta achievements to fixpoint (max 6 iterations is far beyond worst case)
  let metaEarned = new Set([...storedIds].filter(isMetaAchievement));
  for (let i = 0; i < 6; i++) {
    const score  = calcTotalScore(new Set([...baseEarned, ...metaEarned]));
    const next   = calculateMetaEarnedIds(baseEarned, score, tiers);
    const merged = new Set([...metaEarned, ...next]);
    const grew   = merged.size !== metaEarned.size;
    metaEarned   = merged;
    if (!grew) break;
  }
  applyOverrides(metaEarned, adminOverrides, true);

  const validEarned = new Set([...baseEarned, ...metaEarned]);
  const totalScore  = calcTotalScore(validEarned);
  const tier        = getTierForScore(totalScore, tiers);
  const newlyEarned = [...validEarned].filter(id => !storedIds.has(id));

  // Rewards
  const autoBorders = Object.entries(ACH_BORDER_REWARDS)
    .filter(([achId]) => validEarned.has(achId)).map(([, b]) => b);
  const assignedBorders = Object.entries(tierData?.borderAssign || {})
    .filter(([, achId]) => validEarned.has(achId)).map(([bId]) => bId);
  const unlockedBorders = [...new Set([
    ...autoBorders, ...assignedBorders, ...(user?.purchasedBorders || []),
  ])];

  const autoTitles = Object.entries(ACH_TITLE_REWARDS)
    .filter(([achId]) => validEarned.has(achId)).map(([, t]) => t);
  const assignedTitles = (tierData?.titles || [])
    .filter(t => t.achId && validEarned.has(t.achId)).map(t => t.name);
  const earnedTitles = [...new Set([
    ...(user?.earnedTitles || []), ...autoTitles, ...assignedTitles,
    ...(user?.purchasedTitles || []),
  ])];

  const baseCount = [...validEarned].filter(id => !isMetaAchievement(id)).length;

  return { tiers, tier, validEarned, baseEarned, metaEarned, totalScore,
           newlyEarned, unlockedBorders, earnedTitles, storedIds, baseCount };
}

// Evaluate + persist. Returns full context for rendering, or null if the
// user document is missing.
// opts.preloaded: [user, records, storedRaw, tierData] to skip refetching.
export async function syncAchievements(uid, opts = {}) {
  const [user, records, storedRaw, tierData] = opts.preloaded || await Promise.all([
    getUser(uid),
    getWeights(uid),
    getEarnedAchievements(uid).catch(() => []),
    getTierSettings().catch(() => null),
  ]);
  if (!user) return null;

  const state = computeAchievementState({ user, records, storedRaw, tierData });
  const { totalScore, newlyEarned, unlockedBorders, earnedTitles } = state;
  const adminOverrides = user.adminOverrides || {};

  await Promise.all(newlyEarned.map(id => saveEarnedAchievement(uid, id, {
    score: ACH_MAP[id]?.score || 0,
    invalidated: false,
    earnedAt: adminOverrides[id]?.earnedAt || undefined,
  })));

  // Wallet settlement: every achievement grants coins equal to its score.
  let coinsGained = newlyEarned.reduce((s, id) => s + (ACH_MAP[id]?.score || 0), 0);
  const updates = {};
  if (user.coins == null) {
    // First run after the shop update: retroactive grant for all past scores.
    updates.coins = totalScore;
    coinsGained = 0;
  } else if (coinsGained > 0) {
    updates.coins = (user.coins || 0) + coinsGained;
  }
  if (user.totalScore !== totalScore)                     updates.totalScore = totalScore;
  if (!sameSet(unlockedBorders, user.unlockedBorders))    updates.unlockedBorders = unlockedBorders;
  if (!sameSet(earnedTitles, user.earnedTitles))          updates.earnedTitles = earnedTitles;
  if (Object.keys(updates).length) await updateUser(uid, updates);

  const newAchievements = newlyEarned.map(id => ACH_MAP[id]).filter(Boolean);
  return {
    state, newAchievements, coinsGained,
    user: { ...user, ...updates }, records, storedRaw, tierData,
  };
}

// ── Achievement unlock popup (queued, one at a time) ────────────────────
// Requires .achv-pop* styles from css/style.css.
let popupQueue = [];
let popupActive = false;

export function queueAchievementPopups(achievements, coinsGained = 0) {
  if (!achievements?.length) return;
  achievements.forEach((a, i) => popupQueue.push({
    ach: a,
    coins: i === achievements.length - 1 ? coinsGained : 0,
  }));
  if (!popupActive) drainPopupQueue();
}

function drainPopupQueue() {
  const item = popupQueue.shift();
  if (!item) { popupActive = false; return; }
  popupActive = true;
  const { ach, coins } = item;

  let host = document.getElementById('achvPopHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'achvPopHost';
    document.body.appendChild(host);
  }

  const el = document.createElement('div');
  el.className = `achv-pop${ach.legendary ? ' legendary' : ''}`;
  el.innerHTML = `
    <div class="achv-pop-burst"></div>
    <div class="achv-pop-icon">${ach.icon}</div>
    <div class="achv-pop-body">
      <div class="achv-pop-label">${ach.legendary ? '🌟 위업 달성!' : '업적 달성!'}</div>
      <div class="achv-pop-name"></div>
      <div class="achv-pop-score">+${ach.score} PT · +${ach.score} 🪙${coins > 0 ? '' : ''}</div>
    </div>`;
  el.querySelector('.achv-pop-name').textContent = ach.name;
  host.appendChild(el);

  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => { el.remove(); drainPopupQueue(); }, 350);
  }, 2400);
}
