/**
 * mwg-steps-sync — Cloudflare Worker
 *
 * Receives daily step counts (from iOS Shortcuts / Health Auto Export) and
 * merge-writes them into Firestore project `mygraph-6e4c8` using a service
 * account, so the writes bypass security rules.
 *
 * Endpoints:
 *   GET  /steps?token=...&steps=12345[&date=YYYY-MM-DD]  — single day (date defaults to today, Asia/Seoul)
 *   POST /steps   JSON {token, days:[{date, steps}, ...]} — batch
 *   POST /haex?token=...  — Health Auto Export JSON payload
 *   GET  /health  — liveness check
 *
 * Env secrets: SA_CLIENT_EMAIL, SA_PRIVATE_KEY (PKCS8 PEM, "\n" escapes allowed)
 */

const PROJECT_ID = 'mygraph-6e4c8';
const FS_DOCS = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const OAUTH_SCOPE = 'https://www.googleapis.com/auth/datastore';

const STEPS_MIN = 0;
const STEPS_MAX = 200000;
const MAX_DATE_AGE_DAYS = 14;   // reject dates older than this (Asia/Seoul basis)
const MAX_BATCH_DAYS = 31;      // sanity cap for POST /steps
const TOKEN_TTL_MS = 10 * 60 * 1000;

// Module-level caches. Workers may recycle isolates at any time; both caches
// rebuild themselves transparently on a cold start.
const tokenToUid = new Map();                 // syncToken -> { uid, expires }
let gcpToken = { value: null, expires: 0 };   // OAuth2 access token cache

// ── CORS ─────────────────────────────────────────────────────────────

function corsOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return null;
  if (origin === 'https://woojehong.github.io') return origin;
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return origin;
  return null;
}

function corsHeaders(request) {
  const origin = corsOrigin(request);
  const h = { 'Content-Type': 'application/json; charset=utf-8' };
  if (origin) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Vary'] = 'Origin';
  }
  return h;
}

function handlePreflight(request) {
  const origin = corsOrigin(request);
  if (!origin) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    },
  });
}

// ── Small helpers ────────────────────────────────────────────────────

function jsonResponse(request, body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(request) });
}

function errorResponse(request, message, status) {
  return jsonResponse(request, { ok: false, error: message }, status);
}

/** Today's date string (YYYY-MM-DD) in Asia/Seoul. */
function seoulToday() {
  // en-CA locale formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
}

/** Validate a YYYY-MM-DD string: well-formed, not in the future, not older than 14 days. */
function isValidDate(dateStr) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const target = Date.parse(`${dateStr}T00:00:00Z`);
  const today = Date.parse(`${seoulToday()}T00:00:00Z`);
  if (Number.isNaN(target)) return false;
  const diffDays = (today - target) / 86400000;
  return diffDays >= 0 && diffDays <= MAX_DATE_AGE_DAYS;
}

/** Parse a steps value into a validated integer, or null if invalid. */
function parseSteps(raw) {
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n)) return null;
  const steps = Math.round(n);
  if (steps < STEPS_MIN || steps > STEPS_MAX) return null;
  return steps;
}

// ── Base64url / crypto helpers ───────────────────────────────────────

function base64urlFromBytes(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlFromString(str) {
  return base64urlFromBytes(new TextEncoder().encode(str));
}

function pemToArrayBuffer(pem) {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// ── Google OAuth2 (service account JWT bearer flow) ──────────────────

async function getAccessToken(env) {
  const now = Date.now();
  // Reuse cached token until 5 minutes before expiry.
  if (gcpToken.value && now < gcpToken.expires - 5 * 60 * 1000) {
    return gcpToken.value;
  }

  if (!env.SA_CLIENT_EMAIL || !env.SA_PRIVATE_KEY) {
    throw new Error('service account secrets not configured');
  }

  // Secrets pasted via `wrangler secret put` sometimes keep literal "\n".
  const pem = env.SA_PRIVATE_KEY.replace(/\\n/g, '\n');
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(pem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const iat = Math.floor(now / 1000);
  const header = base64urlFromString(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64urlFromString(JSON.stringify({
    iss: env.SA_CLIENT_EMAIL,
    scope: OAUTH_SCOPE,
    aud: OAUTH_TOKEN_URL,
    iat,
    exp: iat + 3600,
  }));
  const signingInput = `${header}.${claims}`;
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(signingInput),
  );
  const jwt = `${signingInput}.${base64urlFromBytes(new Uint8Array(sig))}`;

  const res = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    // Do not log the response body: it may echo request details.
    throw new Error(`oauth token exchange failed (${res.status})`);
  }
  const data = await res.json();
  gcpToken = {
    value: data.access_token,
    expires: now + (data.expires_in || 3600) * 1000,
  };
  return gcpToken.value;
}

// ── Firestore access ─────────────────────────────────────────────────

/** Resolve syncToken -> uid via runQuery on `users`. Returns null if unknown. */
async function resolveUid(env, token) {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{8,128}$/.test(token)) return null;

  const cached = tokenToUid.get(token);
  if (cached && Date.now() < cached.expires) return cached.uid;

  const accessToken = await getAccessToken(env);
  const res = await fetch(`${FS_DOCS}:runQuery`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'users' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'syncToken' },
            op: 'EQUAL',
            value: { stringValue: token },
          },
        },
        limit: 1,
      },
    }),
  });
  if (!res.ok) throw new Error(`firestore runQuery failed (${res.status})`);

  const rows = await res.json();
  const docRow = Array.isArray(rows) ? rows.find((r) => r.document) : null;
  if (!docRow) return null;

  const uid = docRow.document.name.split('/').pop();
  tokenToUid.set(token, { uid, expires: Date.now() + TOKEN_TTL_MS });
  return uid;
}

/**
 * Merge-write steps into weights/{uid}/records/{date}.
 * The updateMask limits the patch to exactly these four fields, so existing
 * fields (weight, meal, exercise, water, mood, journal, ...) are never touched.
 */
async function writeSteps(env, uid, date, steps) {
  const accessToken = await getAccessToken(env);
  const mask = [
    'updateMask.fieldPaths=date',
    'updateMask.fieldPaths=steps',
    'updateMask.fieldPaths=stepsSource',
    'updateMask.fieldPaths=updatedAt',
  ].join('&');
  const url = `${FS_DOCS}/weights/${encodeURIComponent(uid)}/records/${date}?${mask}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        date: { stringValue: date },
        steps: { integerValue: String(steps) },
        stepsSource: { stringValue: 'auto' },
        updatedAt: { timestampValue: new Date().toISOString() },
      },
    }),
  });
  if (!res.ok) throw new Error(`firestore patch failed (${res.status})`);
}

// ── Endpoint handlers ────────────────────────────────────────────────

async function handleGetSteps(request, env, url) {
  const token = url.searchParams.get('token');
  const uid = await resolveUid(env, token);
  if (!uid) return errorResponse(request, 'invalid token', 403);

  const steps = parseSteps(url.searchParams.get('steps'));
  if (steps === null) {
    return errorResponse(request, `steps must be an integer between ${STEPS_MIN} and ${STEPS_MAX}`, 400);
  }

  const date = url.searchParams.get('date') || seoulToday();
  if (!isValidDate(date)) {
    return errorResponse(request, 'date must be YYYY-MM-DD, within the last 14 days, not in the future (Asia/Seoul)', 400);
  }

  await writeSteps(env, uid, date, steps);
  return jsonResponse(request, { ok: true, saved: [{ date, steps }] });
}

async function handlePostSteps(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse(request, 'invalid JSON body', 400);
  }

  const uid = await resolveUid(env, body && body.token);
  if (!uid) return errorResponse(request, 'invalid token', 403);

  const days = body.days;
  if (!Array.isArray(days) || days.length === 0 || days.length > MAX_BATCH_DAYS) {
    return errorResponse(request, `days must be a non-empty array (max ${MAX_BATCH_DAYS})`, 400);
  }

  // Validate everything up front so the batch is all-or-nothing.
  const validated = [];
  for (const day of days) {
    const date = day && day.date;
    const steps = parseSteps(day && day.steps);
    if (!isValidDate(date)) {
      return errorResponse(request, `invalid date: ${String(date).slice(0, 20)}`, 400);
    }
    if (steps === null) {
      return errorResponse(request, `invalid steps for ${date}`, 400);
    }
    validated.push({ date, steps });
  }

  await Promise.all(validated.map((d) => writeSteps(env, uid, d.date, d.steps)));
  return jsonResponse(request, { ok: true, saved: validated });
}

/**
 * Health Auto Export payload:
 *   { data: { metrics: [ { name: 'step_count', units, data: [ { date, qty }, ... ] } ] } }
 * Dates arrive like "2026-07-16 00:00:00 +0900"; take the leading YYYY-MM-DD.
 * Invalid or out-of-window entries are skipped, not fatal.
 */
async function handleHaex(request, env, url) {
  const token = url.searchParams.get('token');
  const uid = await resolveUid(env, token);
  if (!uid) return errorResponse(request, 'invalid token', 403);

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse(request, 'invalid JSON body', 400);
  }

  const metrics = body && body.data && Array.isArray(body.data.metrics) ? body.data.metrics : [];
  const stepMetric = metrics.find((m) => m && m.name === 'step_count');
  if (!stepMetric || !Array.isArray(stepMetric.data)) {
    return errorResponse(request, 'no step_count metric found in payload', 400);
  }

  // Same date can appear in multiple samples; keep the last (aggregate) value.
  const byDate = new Map();
  for (const entry of stepMetric.data) {
    if (!entry || typeof entry.date !== 'string') continue;
    const date = entry.date.slice(0, 10);
    const steps = parseSteps(entry.qty);
    if (!isValidDate(date) || steps === null) continue;
    byDate.set(date, steps);
  }
  if (byDate.size === 0) {
    return errorResponse(request, 'no valid step entries in payload', 400);
  }
  if (byDate.size > MAX_BATCH_DAYS) {
    return errorResponse(request, `too many days in payload (max ${MAX_BATCH_DAYS})`, 400);
  }

  const saved = [...byDate.entries()].map(([date, steps]) => ({ date, steps }));
  await Promise.all(saved.map((d) => writeSteps(env, uid, d.date, d.steps)));
  return jsonResponse(request, { ok: true, saved });
}

// ── Router ───────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return handlePreflight(request);

    const url = new URL(request.url);
    try {
      if (url.pathname === '/health' && request.method === 'GET') {
        return new Response('ok', { status: 200 });
      }
      if (url.pathname === '/steps') {
        if (request.method === 'GET') return await handleGetSteps(request, env, url);
        if (request.method === 'POST') return await handlePostSteps(request, env);
        return errorResponse(request, 'method not allowed', 405);
      }
      if (url.pathname === '/haex') {
        if (request.method === 'POST') return await handleHaex(request, env, url);
        return errorResponse(request, 'method not allowed', 405);
      }
      return errorResponse(request, 'not found', 404);
    } catch (err) {
      // Message contains only status codes / generic text, never tokens or keys.
      console.error('request failed:', err instanceof Error ? err.message : 'unknown error');
      return errorResponse(request, 'internal error', 500);
    }
  },
};
