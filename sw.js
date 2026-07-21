const CACHE = 'weight-v64-fx-72';
const ASSETS = [
  './index.html', './dashboard.html', './input.html', './import.html',
  './achievements.html', './compare.html', './dressroom.html', './shop.html', './guide.html', './visual-lab.html',
  './css/style.css',
  './js/firebase-config.js', './js/db.js', './js/auth.js',
  './js/chart-render.js', './js/achievements.js', './js/achievements-engine.js',
  './js/util.js', './js/daily-rewards.js', './js/showroom-v2.js',
  './js/showroom-catalog-v2.js', './js/showroom-catalog-v4.generated.js', './js/titles-catalog-v2.js', './js/achievement-item-rewards-v2.js',
  './manifest.json', './favicon.png',
  './register-sw.js',
  './assets/showroom-v4/graph_skin/gs4_uncommon_sootwood_ledger.webp',
  './assets/showroom-v4/graph_skin/gs4_uncommon_dwarfsmith_copperplate.webp',
  './assets/showroom-v4/graph_skin/gs4_uncommon_nightwatch_felt.webp',
  './assets/showroom-v4/graph_skin/gs4_rare_star_surveyor_orrey.webp',
  './assets/showroom-v4/graph_skin/gs4_rare_verdant_alchemist.webp',
  './assets/showroom-v4/graph_skin/gs4_rare_tidecaller_archive.webp',
  './assets/showroom-v4/graph_skin/gs4_epic_mirror_oracle.webp',
  './assets/showroom-v4/graph_skin/gs4_epic_storm_prophet_engine.webp',
  './assets/showroom-v4/graph_skin/gs4_epic_abyssal_memory_loom.webp',
  './assets/showroom-v4/graph_skin/gs4_legendary_dreamweaver_loom.webp',
  './assets/showroom-v4/graph_skin/gs4_legendary_gilded_astral_foundry.webp',
  './assets/showroom-v4/graph_skin/gs4_legendary_genesis_gate.webp',
  './assets/showroom-v3/graph_skin/gs_explorer_parchment.webp',
  './assets/showroom-v3/graph_skin/gs_frost_runestone.webp',
  './assets/showroom-v3/graph_skin/gs_dragonbone_slab.webp',
  './assets/showroom-v3/graph_skin/gs_cosmic_timekeeper.webp',
  './assets/showroom-v3/card_theme/ct_alpine_dawn.webp',
  './assets/showroom-v3/card_theme/ct_sunken_temple.webp',
  './assets/showroom-v3/card_theme/ct_moonlit_grove.webp',
  './assets/showroom-v3/card_theme/ct_cosmic_observatory.webp',
  './assets/showroom-v3/point_marker/pm_expedition_compass.png',
  './assets/showroom-v3/point_marker/pm_moon_crystal.png',
  './assets/showroom-v3/point_marker/pm_watcher_eye.png',
  './assets/showroom-v3/point_marker/pm_phoenix_seal.png',
  './assets/showroom-v3/companion/cp_sleepy_golem.png',
  './assets/showroom-v3/companion/cp_candle_wisp.png',
  './assets/showroom-v3/companion/cp_satchel_mimic.png',
  './assets/showroom-v3/companion/cp_lantern_moth.png',
  './assets/showroom-v3/ambient_effect/ae_forest_breath.webp',
  './assets/showroom-v3/ambient_effect/ae_deep_caustics.webp',
  './assets/showroom-v3/ambient_effect/ae_dimensional_breach.webp',
  './assets/showroom-v3/ambient_effect/ae_ancient_dragon.webp',
  './assets/showroom-v3/trophy/tr_summit_compass.png',
  './assets/showroom-v3/trophy/tr_sea_chalice.png',
  './assets/showroom-v3/trophy/tr_giant_horn.png',
  './assets/showroom-v3/trophy/tr_cosmic_goblet.png',
  './assets/showroom-v3/profile_emoji/pe_archive_spirit.png',
  './assets/showroom-v3/profile_emoji/pe_forest_goblin.png',
  './assets/showroom-v3/profile_emoji/pe_dragonblood.png',
  './assets/showroom-v3/profile_emoji/pe_celestial_oracle.png',
  './assets/showroom-v3/emoji_border/eb_forged_iron.png',
  './assets/showroom-v3/emoji_border/eb_worldroot.png',
  './assets/showroom-v3/emoji_border/eb_giant_hunter.png',
  './assets/showroom-v3/emoji_border/eb_twin_dragon.png',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
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
