const CACHE = 'weight-v83-smiling-profile-default';
const ASSETS = [
  './index.html', './dashboard.html', './input.html', './import.html',
  './achievements.html', './compare.html', './dressroom.html', './shop.html', './guide.html', './visual-lab.html',
  './css/style.css', './css/showroom-card-themes.css',
  './js/firebase-config.js', './js/db.js', './js/auth.js',
  './js/chart-render.js', './js/achievements.js', './js/achievements-engine.js',
  './js/quests.js', './js/quest-panel.js', './js/showroom-fx.js',
  './js/util.js', './js/daily-rewards.js', './js/showroom-v2.js',
  './js/showroom-catalog-v2.js', './js/showroom-catalog-v4.generated.js', './js/showroom-graph-skins.js', './js/showroom-card-themes.js', './js/showroom-companions-v5.js', './js/titles-catalog-v2.js', './js/achievement-item-rewards-v2.js',
  './manifest.json', './favicon.png',
  './register-sw.js',
  './assets/showroom-v4/graph_skin/gs4_uncommon_ironpeak_workshop.webp',
  './assets/showroom-v4/graph_skin/gs4_uncommon_moonlit_inn.webp',
  './assets/showroom-v4/graph_skin/gs4_uncommon_desert_caravan.webp',
  './assets/showroom-v4/graph_skin/gs4_rare_worldtree_dreamway.webp',
  './assets/showroom-v4/graph_skin/gs4_rare_storm_kingdom.webp',
  './assets/showroom-v4/graph_skin/gs4_rare_red_iron_fortress.webp',
  './assets/showroom-v4/graph_skin/gs4_epic_silvermoon_court.webp',
  './assets/showroom-v4/graph_skin/gs4_epic_starforged_creation.webp',
  './assets/showroom-v4/graph_skin/gs4_epic_deepsea_queen_palace.webp',
  './assets/showroom-v4/graph_skin/gs4_legendary_frozen_crown.webp',
  './assets/showroom-v4/graph_skin/gs4_legendary_nether_black_sanctum.webp',
  './assets/showroom-v4/graph_skin/gs4_legendary_dragonflame_nest.webp',
  './assets/showroom-v4/card_theme/ct4_epic_astral_observatory_current.png',
  './assets/showroom-v4/card_theme/ct4_epic_astral_observatory_header.png',
  './assets/showroom-v4/card_theme/ct4_epic_astral_observatory_max.png',
  './assets/showroom-v4/card_theme/ct4_epic_astral_observatory_min.png',
  './assets/showroom-v4/card_theme/ct4_epic_deepsea_throne_current.png',
  './assets/showroom-v4/card_theme/ct4_epic_deepsea_throne_header.png',
  './assets/showroom-v4/card_theme/ct4_epic_deepsea_throne_max.png',
  './assets/showroom-v4/card_theme/ct4_epic_deepsea_throne_min.png',
  './assets/showroom-v4/card_theme/ct4_epic_silvermoon_court_current.png',
  './assets/showroom-v4/card_theme/ct4_epic_silvermoon_court_header.png',
  './assets/showroom-v4/card_theme/ct4_epic_silvermoon_court_max.png',
  './assets/showroom-v4/card_theme/ct4_epic_silvermoon_court_min.png',
  './assets/showroom-v4/card_theme/ct4_legendary_dragonfire_cataclysm_current.png',
  './assets/showroom-v4/card_theme/ct4_legendary_dragonfire_cataclysm_header.png',
  './assets/showroom-v4/card_theme/ct4_legendary_dragonfire_cataclysm_max.png',
  './assets/showroom-v4/card_theme/ct4_legendary_dragonfire_cataclysm_min.png',
  './assets/showroom-v4/card_theme/ct4_legendary_frozen_crown_current.png',
  './assets/showroom-v4/card_theme/ct4_legendary_frozen_crown_header.png',
  './assets/showroom-v4/card_theme/ct4_legendary_frozen_crown_max.png',
  './assets/showroom-v4/card_theme/ct4_legendary_frozen_crown_min.png',
  './assets/showroom-v4/card_theme/ct4_legendary_nether_sanctum_current.png',
  './assets/showroom-v4/card_theme/ct4_legendary_nether_sanctum_header.png',
  './assets/showroom-v4/card_theme/ct4_legendary_nether_sanctum_max.png',
  './assets/showroom-v4/card_theme/ct4_legendary_nether_sanctum_min.png',
  './assets/showroom-v4/card_theme/ct4_rare_red_iron_fortress_current.png',
  './assets/showroom-v4/card_theme/ct4_rare_red_iron_fortress_header.png',
  './assets/showroom-v4/card_theme/ct4_rare_red_iron_fortress_max.png',
  './assets/showroom-v4/card_theme/ct4_rare_red_iron_fortress_min.png',
  './assets/showroom-v4/card_theme/ct4_rare_storm_kingdom_current.png',
  './assets/showroom-v4/card_theme/ct4_rare_storm_kingdom_header.png',
  './assets/showroom-v4/card_theme/ct4_rare_storm_kingdom_max.png',
  './assets/showroom-v4/card_theme/ct4_rare_storm_kingdom_min.png',
  './assets/showroom-v4/card_theme/ct4_rare_worldtree_grove_current.png',
  './assets/showroom-v4/card_theme/ct4_rare_worldtree_grove_header.png',
  './assets/showroom-v4/card_theme/ct4_rare_worldtree_grove_max.png',
  './assets/showroom-v4/card_theme/ct4_rare_worldtree_grove_min.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_desert_caravan_current.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_desert_caravan_header.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_desert_caravan_max.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_desert_caravan_min.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_golden_tavern_current.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_golden_tavern_header.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_golden_tavern_max.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_golden_tavern_min.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_iron_outpost_current.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_iron_outpost_header.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_iron_outpost_max.png',
  './assets/showroom-v4/card_theme/ct4_uncommon_iron_outpost_min.png',
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
  './assets/showroom-v5/companion/cp_u01.png',
  './assets/showroom-v5/companion/cp_u02.png',
  './assets/showroom-v5/companion/cp_u03.png',
  './assets/showroom-v5/companion/cp_u04.png',
  './assets/showroom-v5/companion/cp_u05.png',
  './assets/showroom-v5/companion/cp_u06.png',
  './assets/showroom-v5/companion/cp_u07.png',
  './assets/showroom-v5/companion/cp_u08.png',
  './assets/showroom-v5/companion/cp_u09.png',
  './assets/showroom-v5/companion/cp_u10.png',
  './assets/showroom-v5/companion/cp_r01.png',
  './assets/showroom-v5/companion/cp_r02.png',
  './assets/showroom-v5/companion/cp_r03.png',
  './assets/showroom-v5/companion/cp_r04.png',
  './assets/showroom-v5/companion/cp_r05.png',
  './assets/showroom-v5/companion/cp_r06.png',
  './assets/showroom-v5/companion/cp_r07.png',
  './assets/showroom-v5/companion/cp_r08.png',
  './assets/showroom-v5/companion/cp_r09.png',
  './assets/showroom-v5/companion/cp_r10.png',
  './assets/showroom-v5/companion/cp_e01.png',
  './assets/showroom-v5/companion/cp_e02.png',
  './assets/showroom-v5/companion/cp_e03.png',
  './assets/showroom-v5/companion/cp_e04.png',
  './assets/showroom-v5/companion/cp_e05.png',
  './assets/showroom-v5/companion/cp_e06.png',
  './assets/showroom-v5/companion/cp_e07.png',
  './assets/showroom-v5/companion/cp_e08.png',
  './assets/showroom-v5/companion/cp_e09.png',
  './assets/showroom-v5/companion/cp_e10.png',
  './assets/showroom-v5/companion/cp_l01.png',
  './assets/showroom-v5/companion/cp_l02.png',
  './assets/showroom-v5/companion/cp_l03.png',
  './assets/showroom-v5/companion/cp_l04.png',
  './assets/showroom-v5/companion/cp_l05.png',
  './assets/showroom-v5/companion/cp_l06.png',
  './assets/showroom-v5/companion/cp_l07.png',
  './assets/showroom-v5/companion/cp_l08.png',
  './assets/showroom-v5/companion/cp_l09.png',
  './assets/showroom-v5/companion/cp_l10.png',
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
