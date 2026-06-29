const CACHE = 'weight-v39';
const ASSETS = [
  './index.html', './dashboard.html', './input.html', './import.html',
  './achievements.html', './admin-login.html', './admin.html', './compare.html',
  './css/style.css', './css/borders.css',
  './js/firebase-config.js', './js/db.js', './js/auth.js',
  './js/chart-render.js', './js/achievements.js',
  './manifest.json', './favicon.png',
  './register-sw.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// 네트워크 우선(Network-first): 온라인이면 항상 최신 파일을 받아오고 캐시를 갱신,
// 오프라인일 때만 캐시로 폴백. → 배포 후 Ctrl+Shift+R 없이 자동 반영.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Firebase/Firestore 등 실시간 통신은 서비스워커가 건드리지 않음
  if (url.href.includes('firestore') || url.href.includes('firebase') ||
      url.href.includes('googleapis')) return;

  // 외부 CDN(스크립트 등)은 브라우저 기본 처리에 맡김
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req))
  );
});
