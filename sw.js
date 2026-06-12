const CACHE = 'weight-v35';
const ASSETS = [
  './index.html', './dashboard.html', './input.html', './import.html',
  './achievements.html', './admin-login.html', './admin.html',
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
self.addEventListener('fetch', e => {
  if (e.request.url.includes('firestore') || e.request.url.includes('firebase') ||
      e.request.url.includes('googleapis')) return;
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
