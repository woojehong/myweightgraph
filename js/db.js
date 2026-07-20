import { initializeApp }                              from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc,
         getDoc, getDocs, deleteDoc, query,
         orderBy, writeBatch, serverTimestamp,
         deleteField, runTransaction }                 from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signInAnonymously,
         signOut, onAuthStateChanged }                 from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig, DEFAULT_GOAL }               from "./firebase-config.js";
import { sha256 }                                     from "./auth.js";
import { DAILY_REWARD_POINTS, activityDay, isCurrentActivityDay,
         isDailyComplete }                            from "./daily-rewards.js";
import { getCatalogItemV2, normalizeLoadoutV2, persistableLoadoutV2,
         validateCatalogPurchaseV2, selectedItemIdsV2, ownedItemIdsV2 } from "./showroom-v2.js";

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
export const auth = getAuth(app);

// Anonymous session bootstrap. Firestore rules require an authenticated
// request; regular users are signed in anonymously, the admin page replaces
// the session with email/password auth. Never signs in anonymously over an
// existing (persisted) session. Failure is non-fatal so the app keeps
// working while anonymous auth is not yet enabled in the Firebase console.
const _ready = (async () => {
  try {
    if (auth.authStateReady) await auth.authStateReady();
    if (!auth.currentUser) await signInAnonymously(auth);
  } catch (e) {
    console.warn('Anonymous auth unavailable:', e?.code || e);
  }
})();
export const dbReady = _ready;
const getDocsR   = async (...a) => { await _ready; return getDocs(...a); };
const getDocR    = async (...a) => { await _ready; return getDoc(...a); };
const setDocR    = async (...a) => { await _ready; return setDoc(...a); };
const deleteDocR = async (...a) => { await _ready; return deleteDoc(...a); };

export function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function parseWeight(raw) {
  if (raw == null) return null;
  const s = String(raw).trim().replace(',', '.');
  if (!s || s === '-') return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : Math.round(n * 10) / 10;
}

// ── 관리자 인증 ──────────────────────────────────────────────────────
export const ADMIN_UID = 'X2kTDfOGWKbqLkv0AYAVRLpzHvy2';
export async function adminSignIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export async function adminSignOut() { return signOut(auth); }
export function onAuthChange(cb) { return onAuthStateChanged(auth, cb); }

// ── 사용자 ──────────────────────────────────────────────────────────
// 정렬 기준: 관리자 지정 순서(sortOrder)가 있으면 우선, 없으면 계정 생성순(createdAt)
function createdMs(u) {
  const c = u.createdAt;
  if (!c) return Number.MAX_SAFE_INTEGER; // createdAt 없는 구계정은 뒤로
  if (typeof c.toMillis === 'function') return c.toMillis();
  if (typeof c.seconds === 'number') return c.seconds * 1000;
  const t = new Date(c).getTime();
  return isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
}
export function sortUsers(users) {
  return [...users].sort((a, b) => {
    const aHas = Number.isFinite(a.sortOrder), bHas = Number.isFinite(b.sortOrder);
    if (aHas && bHas) return a.sortOrder - b.sortOrder;
    if (aHas) return -1;
    if (bHas) return 1;
    return createdMs(a) - createdMs(b);
  });
}
export async function getUsers() {
  const snap = await getDocsR(collection(db, 'users'));
  return sortUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}
// 관리자 지정 순서 저장: 전달된 id 순서대로 sortOrder = 0,1,2...
export async function saveUserOrder(orderedIds) {
  await _ready;
  for (let i = 0; i < orderedIds.length; i += 499) {
    const batch = writeBatch(db);
    orderedIds.slice(i, i + 499).forEach((id, j) =>
      batch.set(doc(db, 'users', id), { sortOrder: i + j }, { merge: true }));
    await batch.commit();
  }
}
export async function getUser(userId) {
  const snap = await getDocR(doc(db, 'users', userId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export async function createUser({ id, name, emoji='⚖️', goal=DEFAULT_GOAL,
                                   height=null, birthYear=null, password=null,
                                   referenceWeight=null, currentWeight=null, pastRecords=[] }) {
  const passwordHash = password ? await sha256(password) : null;
  const now = new Date();
  const unlock = new Date(now);
  unlock.setMonth(unlock.getMonth() + 6);

  await setDocR(doc(db, 'users', id), {
    name, emoji, goal,
    height:          height          ? Number(height)          : null,
    birthYear:       birthYear       ? Number(birthYear)       : null,
    referenceWeight: referenceWeight ? Number(referenceWeight) : null,
    goalSetAt:       now.toISOString(),
    goalUnlockAt:    unlock.toISOString(),
    passwordHash,
    createdAt: serverTimestamp()
  });

  // 현재 체중 저장
  if (currentWeight != null) {
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    await setDocR(doc(db, 'weights', id, 'records', today),
      { date: today, weight: Number(currentWeight), updatedAt: serverTimestamp() });
  }

  // 과거 기록 일괄 저장
  if (pastRecords.length) {
    await batchSetWeights(id, pastRecords);
  }

  return passwordHash;
}
export async function setUserPassword(userId, newPassword) {
  const hash = newPassword ? await sha256(newPassword) : null;
  await setDocR(doc(db, 'users', userId), { passwordHash: hash }, { merge: true });
  return hash;
}
export async function updateUser(userId, data) {
  await setDocR(doc(db, 'users', userId), data, { merge: true });
}

// 쇼룸 상품 전용 원자 구매. 한 트랜잭션 안에서 최신 잔액과 보유 목록을 다시
// 확인하므로 빠른 중복 클릭이나 여러 탭 구매로 인한 이중 차감을 막는다.
// 기존 users/{uid}.coins 및 updateUser 기반 문서 구조는 그대로 유지한다.
export async function purchaseCatalogItemsV2(userId, itemIds) {
  const items=validateCatalogPurchaseV2(itemIds);
  await _ready;
  const userRef = doc(db, 'users', userId);
  return runTransaction(db, async tx => {
    const snap = await tx.get(userRef);
    if (!snap.exists()) throw new Error('사용자를 찾을 수 없습니다.');
    const user = snap.data();
    const purchased = Array.isArray(user.purchasedItemsV2) ? user.purchasedItemsV2 : [];
    const owned=ownedItemIdsV2(user);
    const balance = Number.isFinite(user.coins) ? user.coins : 0;
    const buy=items.filter(item=>!owned.has(item.id));
    const cost=buy.reduce((sum,item)=>sum+item.price,0);
    if(balance<cost)throw new Error('코인이 부족해요.');
    const coins=balance-cost;
    if(buy.length)tx.update(userRef,{coins,purchasedItemsV2:[...new Set([...purchased,...buy.map(item=>item.id)])]});
    return {purchased:buy.map(item=>item.id),coins,cost};
  });
}
export const purchaseShowroomItem=(userId,itemId)=>purchaseCatalogItemsV2(userId,[itemId]);

export async function saveShowroomLoadoutV2(userId,rawLoadout){
  await _ready;const clean=persistableLoadoutV2(rawLoadout),userRef=doc(db,'users',userId);
  return runTransaction(db,async tx=>{const snap=await tx.get(userRef);if(!snap.exists())throw new Error('사용자를 찾을 수 없습니다.');const user=snap.data(),owned=ownedItemIdsV2(user);const missing=selectedItemIdsV2(clean).filter(id=>!owned.has(id));if(missing.length)throw new Error('미보유 스킨은 저장할 수 없습니다.');tx.update(userRef,{showroomLoadoutV2:clean});return clean});
}

export async function adminSetCatalogOwnershipV2(userId,itemIds,grant=true){
  const requested=[...new Set(Array.isArray(itemIds)?itemIds:[itemIds])];
  if(requested.some(id=>{const item=getCatalogItemV2(id);return item?.testOnly&&item.category!=='trophy'}))throw new Error('트로피 외 테스트 아이템은 소유권을 추가하거나 회수할 수 없습니다.');
  await _ready;if(auth.currentUser?.uid!==ADMIN_UID)throw new Error('슈퍼관리자 권한이 필요합니다.');
  const ids=requested.filter(id=>{const item=getCatalogItemV2(id);return item&&(item.category==='trophy'||item.purchasable!==false)}),userRef=doc(db,'users',userId);
  return runTransaction(db,async tx=>{const snap=await tx.get(userRef);if(!snap.exists())throw new Error('사용자를 찾을 수 없습니다.');const user=snap.data(),current=new Set(user.adminGrantedItems||[]);ids.forEach(id=>grant?current.add(id):current.delete(id));const nextUser={...user,adminGrantedItems:[...current]},owned=ownedItemIdsV2(nextUser),loadout=normalizeLoadoutV2(user.showroomLoadoutV2);for(const category of Object.keys(loadout)){if(Array.isArray(loadout[category]))loadout[category]=loadout[category].filter(id=>owned.has(id));else if(loadout[category]&&!owned.has(loadout[category]))loadout[category]=normalizeLoadoutV2({})[category]}tx.update(userRef,{adminGrantedItems:[...current],showroomLoadoutV2:loadout});return {adminGrantedItems:[...current],showroomLoadoutV2:loadout}});
}
export async function deleteUser(userId) {
  await _ready;
  const [records, earned] = await Promise.all([
    getWeights(userId),
    getEarnedAchievements(userId).catch(() => []),
  ]);
  const batch = writeBatch(db);
  records.forEach(r => batch.delete(doc(db, 'weights', userId, 'records', r.date)));
  earned.forEach(a => batch.delete(doc(db, 'achievements', userId, 'earned', a.id)));
  batch.delete(doc(db, 'users', userId));
  await batch.commit();
}

// ── 체중 기록 ────────────────────────────────────────────────────────
function recordsRef(uid) { return collection(db, 'weights', uid, 'records'); }
export async function getWeights(userId) {
  const snap = await getDocsR(query(recordsRef(userId), orderBy('date','asc')));
  return snap.docs.map(d => d.data());
}
export async function setWeight(userId, dateStr, weight) {
  if (weight === null) {
    // weight만 null로 설정 (meal/exercise는 유지)
    await setDocR(doc(db, 'weights', userId, 'records', dateStr),
      { date: dateStr, weight: null, updatedAt: serverTimestamp() }, { merge: true });
    return;
  }
  await setDocR(doc(db, 'weights', userId, 'records', dateStr),
    { date: dateStr, weight, updatedAt: serverTimestamp() }, { merge: true });
}

export async function setDietExercise(userId, dateStr, data) {
  // data: { meal?: {morning, lunch, dinner}, exercise?: boolean|null,
  //         water?: number, mood?: number|null,
  //         journal?: {noAlcohol, noSnack, earlySleep}, steps?: number|null,
  //         stepsSource?: 'manual'|'auto' }
  await setDocR(doc(db, 'weights', userId, 'records', dateStr),
    { date: dateStr, ...data, updatedAt: serverTimestamp() }, { merge: true });
}
export const setDayData = setDietExercise;

// Atomic daily reward ledger. A reward flag is permanent even if the user
// later edits/deletes the underlying value. Past activity days never reward.
export async function grantDailyReward(userId, dateStr, event, value = null) {
  await _ready;
  if (!isCurrentActivityDay(dateStr)) return { granted: 0, reason: 'not-current-day' };
  const allowed = new Set(['attendance','weight','morning','lunch','dinner','exercise','water']);
  if (!allowed.has(event)) throw new Error(`Unknown daily reward event: ${event}`);

  const userRef = doc(db, 'users', userId);
  const rewardRef = doc(db, 'dailyRewards', userId, 'days', dateStr);
  const recordRef = doc(db, 'weights', userId, 'records', dateStr);

  return runTransaction(db, async tx => {
    const [userSnap, rewardSnap, recordSnap] = await Promise.all([
      tx.get(userRef), tx.get(rewardRef), tx.get(recordRef),
    ]);
    if (!userSnap.exists()) throw new Error('User not found');
    const ledger = rewardSnap.exists() ? rewardSnap.data() : { date: dateStr };
    const updates = { updatedAt: serverTimestamp() };
    let granted = 0;

    if (event === 'water') {
      const reached = Math.max(0, Math.min(DAILY_REWARD_POINTS.WATER_MAX_STEPS, Math.floor(Number(value) || 0)));
      const paid = Math.max(0, Math.floor(Number(ledger.waterSteps) || 0));
      if (reached > paid) {
        granted += (reached - paid) * DAILY_REWARD_POINTS.WATER_STEP;
        updates.waterSteps = reached;
      }
    } else if (!ledger[event]) {
      const points = event === 'attendance' ? DAILY_REWARD_POINTS.ATTENDANCE
        : event === 'weight' ? DAILY_REWARD_POINTS.WEIGHT
        : event === 'exercise' ? DAILY_REWARD_POINTS.EXERCISE
        : DAILY_REWARD_POINTS.EACH_MEAL;
      granted += points;
      updates[event] = true;
    }

    const merged = { ...ledger, ...updates };
    if (!merged.dailyComplete && isDailyComplete(recordSnap.exists() ? recordSnap.data() : null)) {
      granted += DAILY_REWARD_POINTS.DAILY_COMPLETE;
      updates.dailyComplete = true;
    }

    if (Object.keys(updates).length > 1 || granted > 0) {
      updates.date = dateStr;
      updates.points = (Number(ledger.points) || 0) + granted;
      tx.set(rewardRef, updates, { merge: true });
      if (granted > 0) {
        const userData = userSnap.data();
        const walletBase = userData.coins == null
          ? (Number(userData.totalScore) || 0)
          : (Number(userData.coins) || 0);
        tx.update(userRef, { coins: walletBase + granted });
      }
    }
    return { granted, pointsToday: (Number(ledger.points) || 0) + granted,
             dailyComplete: Boolean(updates.dailyComplete || ledger.dailyComplete) };
  });
}

export async function getDailyReward(userId, dateStr = activityDay()) {
  const snap = await getDocR(doc(db, 'dailyRewards', userId, 'days', dateStr));
  return snap.exists() ? snap.data() : { date: dateStr, points: 0 };
}
export async function batchSetWeights(userId, records) {
  await _ready;
  for (let i=0; i<records.length; i+=499) {
    const batch = writeBatch(db);
    records.slice(i, i+499).forEach(r =>
      batch.set(doc(db,'weights',userId,'records',r.date),
        { date:r.date, weight:r.weight, updatedAt:serverTimestamp() }));
    await batch.commit();
  }
}
// 병합 저장: 같은 날짜는 weight만 교체하고 식단·운동 등 기존 필드는 보존
export async function batchMergeWeights(userId, records) {
  await _ready;
  for (let i=0; i<records.length; i+=499) {
    const batch = writeBatch(db);
    records.slice(i, i+499).forEach(r =>
      batch.set(doc(db,'weights',userId,'records',r.date),
        { date:r.date, weight:r.weight, updatedAt:serverTimestamp() }, { merge:true }));
    await batch.commit();
  }
}
export async function deleteWeight(userId, dateStr) {
  await deleteDocR(doc(db, 'weights', userId, 'records', dateStr));
}

// ── 업적 ──────────────────────────────────────────────────────────────
export async function getEarnedAchievements(userId) {
  const snap = await getDocsR(collection(db, 'achievements', userId, 'earned'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function saveEarnedAchievement(userId, achievementId, data) {
  await setDocR(doc(db, 'achievements', userId, 'earned', achievementId),
    { ...data, earnedAt: data.earnedAt || serverTimestamp() }, { merge: true });
}
export async function invalidateAchievement(userId, achievementId, invalidated) {
  await setDocR(doc(db, 'achievements', userId, 'earned', achievementId),
    { invalidated }, { merge: true });
}

// ── 관리자 업적 강제 설정 ─────────────────────────────────────────────
// override: 'earned' | 'not_earned' | null (null이면 필드 삭제 → 시스템 자동)
export async function saveAdminOverride(userId, achievementId, override, earnedAt) {
  const userRef = doc(db, 'users', userId);
  if (override === null) {
    await setDocR(userRef, {
      adminOverrides: { [achievementId]: deleteField() }
    }, { merge: true });
  } else {
    await setDocR(userRef, {
      adminOverrides: {
        [achievementId]: {
          override,
          earnedAt: earnedAt || null,
        }
      }
    }, { merge: true });
  }
}

// ── 티어 설정 ─────────────────────────────────────────────────────────
export async function getTierSettings() {
  const snap = await getDocR(doc(db, 'settings', 'tiers'));
  return snap.exists() ? snap.data() : null;
}
export async function saveTierSettings(data) {
  await setDocR(doc(db, 'settings', 'tiers'), data, { merge: true });
}

// ── 앱 설정 ──────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  show7dayMA:true, showWeeklyBar:true, showPrediction:false,
  showMaxMarker:true, showMinMarker:true, showCurMarker:true,
  annotOpacity:0.88,
  showStatPeriod:true, showStatStart:true, showStatCurrent:true,
  showStatLoss:true, showStatRatio:true, showStatDaily:true,
  showStatWeekly:true, showStatGoal:true, showStatETA:true,
  showStatBMI:true, showStatStreak:true,
};
// 개인 설정: users/{uid}.chartSettings 에 저장.
// 우선순위: 기본값 ← 전역 기본(settings/chart, 관리자 설정) ← 개인 설정
export async function getSettings(userId, preloadedUser = null) {
  const [globalSnap, user] = await Promise.all([
    getDocR(doc(db, 'settings', 'chart')).catch(() => null),
    userId ? (preloadedUser ? Promise.resolve(preloadedUser) : getUser(userId)) : Promise.resolve(null),
  ]);
  const globalData = globalSnap?.exists?.() ? globalSnap.data() : {};
  return { ...DEFAULT_SETTINGS, ...globalData, ...(user?.chartSettings || {}) };
}
export async function updateSettings(userId, data) {
  if (!userId) throw new Error('updateSettings requires a userId');
  await setDocR(doc(db, 'users', userId), { chartSettings: data }, { merge: true });
}
// 전역 기본값 (관리자 전용)
export async function updateGlobalSettings(data) {
  await setDocR(doc(db, 'settings', 'chart'), data, { merge: true });
}
