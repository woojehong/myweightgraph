import { initializeApp }                              from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc,
         getDoc, getDocs, deleteDoc, query,
         orderBy, writeBatch, serverTimestamp,
         deleteField }                                 from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signInAnonymously,
         signOut, onAuthStateChanged }                 from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig, DEFAULT_GOAL }               from "./firebase-config.js";
import { sha256 }                                     from "./auth.js";

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
