import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dbSource = await readFile(new URL('../js/db.js', import.meta.url), 'utf8');
const engineSource = await readFile(
  new URL('../js/achievements-engine.js', import.meta.url), 'utf8');

function extractFunction(source, marker) {
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `${marker} must exist`);
  const bodyStart = source.indexOf('{', start);
  let depth = 0;
  for (let i = bodyStart; i < source.length; i++) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`Unclosed function: ${marker}`);
}

const functionSource = extractFunction(
  dbSource, 'export async function settleAchievementsAtomically');
const docs = new Map();
const ref = (...parts) => parts.filter(part => typeof part === 'string').join('/');
const snapshot = path => ({
  exists: () => docs.has(path),
  data: () => docs.get(path),
});
const tx = {
  get: async path => snapshot(path),
  set(path, value, options) {
    docs.set(path, options?.merge
      ? { ...(docs.get(path) || {}), ...value }
      : { ...value });
  },
  update(path, value) {
    assert.ok(docs.has(path), `update target must exist: ${path}`);
    docs.set(path, { ...docs.get(path), ...value });
  },
};
const factory = new Function(
  '_ready', 'doc', 'db', 'runTransaction', 'serverTimestamp',
  `${functionSource.replace('export async function', 'async function')};` +
  'return settleAchievementsAtomically;',
);
let timestamp = 0;
const settle = factory(
  Promise.resolve(), ref, {}, async (_db, callback) => callback(tx),
  () => `server-time-${++timestamp}`,
);

docs.set('users/u1', {
  coins: 100,
  totalScore: 0,
  achievementRewardItems: ['reward_old'],
});

const first = await settle('u1', {
  achievements: [{ id: 'ach_a', score: 10 }],
  totalScore: 10,
  achievementRewardItems: ['reward_new'],
});
assert.deepEqual(first.newlyEarnedIds, ['ach_a']);
assert.equal(first.coinsGained, 10);
assert.equal(docs.get('users/u1').coins, 110);
assert.equal(docs.get('users/u1').totalScore, 10);
assert.deepEqual(docs.get('users/u1').achievementRewardItems,
  ['reward_old', 'reward_new']);
assert.deepEqual(docs.get('achievements/u1/earned/ach_a'), {
  score: 10, invalidated: false, earnedAt: 'server-time-1',
});

// A second page can submit the same stale candidate, but the earned document
// read inside the transaction makes the second settlement a no-op.
const duplicate = await settle('u1', {
  achievements: [{ id: 'ach_a', score: 10 }],
  totalScore: 10,
  achievementRewardItems: ['reward_new'],
});
assert.deepEqual(duplicate.newlyEarnedIds, []);
assert.equal(duplicate.coinsGained, 0);
assert.equal(docs.get('users/u1').coins, 110);
assert.equal(docs.get('users/u1').totalScore, 10);

// Distinct stale evaluations must accumulate from the transaction-time user
// snapshot instead of overwriting each other's wallet, score, or item list.
await settle('u1', {
  achievements: [{ id: 'ach_b', score: 20 }],
  totalScore: 20,
  achievementRewardItems: ['reward_b'],
});
assert.equal(docs.get('users/u1').coins, 130);
assert.equal(docs.get('users/u1').totalScore, 30);
assert.deepEqual(docs.get('users/u1').achievementRewardItems,
  ['reward_old', 'reward_new', 'reward_b']);

// An invalidated document may be re-earned and is settled exactly once.
docs.set('achievements/u1/earned/ach_c', {
  score: 5, invalidated: true, earnedAt: 'old-time',
});
const reearned = await settle('u1', {
  achievements: [{ id: 'ach_c', score: 5, earnedAt: 'admin-time' }],
  totalScore: 35,
  achievementRewardItems: [],
});
assert.deepEqual(reearned.newlyEarnedIds, ['ach_c']);
assert.equal(docs.get('users/u1').coins, 135);
assert.deepEqual(docs.get('achievements/u1/earned/ach_c'), {
  score: 5, invalidated: false, earnedAt: 'admin-time',
});

// The legacy first sync initializes the wallet from the whole historical score
// and intentionally reports no fresh popup gain.
docs.set('users/u2', { totalScore: 0 });
const migrated = await settle('u2', {
  achievements: [{ id: 'ach_old', score: 50 }],
  totalScore: 50,
  achievementRewardItems: ['reward_old'],
});
assert.equal(migrated.coinsGained, 0);
assert.equal(docs.get('users/u2').coins, 50);
assert.equal(docs.get('users/u2').totalScore, 50);

// Engine contract: persistence is one atomic call, with no split save/update.
assert.ok(engineSource.includes('settleAchievementsAtomically(uid'));
assert.equal(engineSource.includes('saveEarnedAchievement(uid'), false);
assert.equal(engineSource.includes('updateUser(uid, updates)'), false);
assert.ok(dbSource.includes('return runTransaction(db, async tx =>'));
assert.ok(dbSource.includes('const [userSnap, ...earnedSnaps]'));

console.log('achievement settlement tests: PASS');
