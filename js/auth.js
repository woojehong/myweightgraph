// ── 비밀번호 인증 유틸 ────────────────────────────────────────────────

export async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// localStorage에 인증 저장 (이 기기에서 유지)
export function saveAuth(uid, hash) {
  localStorage.setItem('auth_uid',  uid);
  localStorage.setItem('auth_hash', hash);
}

export function clearAuth() {
  localStorage.removeItem('auth_uid');
  localStorage.removeItem('auth_hash');
}

// 이 기기에서 해당 유저 인증됐는지 확인
export function isAuthed(uid, passwordHash) {
  if (!passwordHash) return true;           // 비밀번호 미설정 유저는 자유 접근
  return localStorage.getItem('auth_uid')  === uid &&
         localStorage.getItem('auth_hash') === passwordHash;
}
