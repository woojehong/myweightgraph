// Showroom catalog and loadout normalization.
// Paid ids are stable Firestore keys. Defaults are represented by null (or [] for trophies).

export const SHOWROOM_CATEGORIES = [
  { id: 'graph_skin', name: '그래프 스킨', icon: '▦', mode: 'single' },
  { id: 'card_theme', name: '카드 테마', icon: '▣', mode: 'single' },
  { id: 'point_marker', name: '포인트 마커', icon: '◆', mode: 'single' },
  { id: 'record_stamp', name: '기록 스탬프', icon: '⚑', mode: 'single' },
  { id: 'companion', name: '동반자', icon: '♧', mode: 'single' },
  { id: 'ambient_effect', name: '공간 효과', icon: '✦', mode: 'single' },
  { id: 'trophy', name: '트로피', icon: '♜', mode: 'multi', max: 4 },
];

export const SHOWROOM_ITEMS = [
  { category:'graph_skin', id:null, name:'기본 그래프', price:0, note:'마웨그 기본 차트' },
  { category:'graph_skin', id:'gs_mint_grid', name:'민트그리드', price:450, note:'선명한 민트 격자' },
  { category:'graph_skin', id:'gs_sunset_duo', name:'선셋듀오', price:700, note:'노을빛 이중 톤' },
  { category:'graph_skin', id:'gs_midnight_neon', name:'미드나이트네온', price:1100, note:'밤하늘 네온 라인' },
  { category:'graph_skin', id:'gs_aurora_prism', name:'오로라프리즘', price:1800, note:'프리즘 오로라 팔레트' },

  { category:'card_theme', id:null, name:'기본 카드', price:0, note:'단정한 기본 카드' },
  { category:'card_theme', id:'ct_snow_paper', name:'스노우 페이퍼', price:350, note:'부드러운 종이 질감' },
  { category:'card_theme', id:'ct_dusk_glass', name:'더스크 글라스', price:650, note:'해질녘 유리 카드' },
  { category:'card_theme', id:'ct_cosmic_mesh', name:'코스믹 메시', price:1000, note:'우주빛 메시 패턴' },
  { category:'card_theme', id:'ct_obsidian_gold', name:'옵시디언 골드', price:1600, note:'흑요석과 금빛 테두리' },

  { category:'point_marker', id:null, name:'기본 포인트', price:0, note:'기본 원형 마커' },
  { category:'point_marker', id:'pm_halo_ring', name:'헤일로 링', price:200, note:'빛나는 고리' },
  { category:'point_marker', id:'pm_blue_diamond', name:'블루 다이아몬드', price:350, note:'푸른 마름모' },
  { category:'point_marker', id:'pm_gold_star', name:'골드 스타', price:600, note:'금빛 별' },
  { category:'point_marker', id:'pm_comet_gem', name:'코멧 젬', price:950, note:'혜성 보석' },

  { category:'record_stamp', id:null, name:'기본 기록점', price:0, note:'기본 기록 표시' },
  { category:'record_stamp', id:'rs_flag', name:'기록 깃발', price:250, note:'기록 위에 꽂는 깃발' },
  { category:'record_stamp', id:'rs_spark', name:'기록 스파크', price:450, note:'작은 불꽃 표시' },
  { category:'record_stamp', id:'rs_crown', name:'기록 왕관', price:700, note:'왕관 기록 표시' },
  { category:'record_stamp', id:'rs_meteor', name:'기록 메테오', price:1100, note:'유성 기록 표시' },

  { category:'companion', id:null, name:'동반자 없음', price:0, note:'그래프에 집중하기' },
  { category:'companion', id:'cp_sprout', name:'새싹 친구', price:450, note:'한 잎씩 자라는 새싹' },
  { category:'companion', id:'cp_cloud', name:'구름 친구', price:800, note:'둥실 떠다니는 구름' },
  { category:'companion', id:'cp_moon_cat', name:'달고양이', price:1300, note:'초승달을 품은 고양이' },
  { category:'companion', id:'cp_tiny_dragon', name:'꼬마 용', price:2100, note:'작은 불빛을 지키는 용' },

  { category:'ambient_effect', id:null, name:'공간 효과 없음', price:0, note:'차분한 기본 공간' },
  { category:'ambient_effect', id:'ae_soft_glow', name:'소프트 글로우', price:500, note:'은은한 주변광' },
  { category:'ambient_effect', id:'ae_firefly', name:'반딧불', price:900, note:'반짝이는 작은 불빛' },
  { category:'ambient_effect', id:'ae_stardust', name:'스타더스트', price:1400, note:'별가루가 흐르는 공간' },
  { category:'ambient_effect', id:'ae_aurora', name:'오로라', price:2300, note:'천천히 흐르는 오로라' },

  { category:'trophy', id:null, name:'트로피 비우기', price:0, note:'전시대를 비웁니다' },
  { category:'trophy', id:'tr_copper_leaf', name:'코퍼 리프', price:250, note:'동빛 잎사귀 트로피' },
  { category:'trophy', id:'tr_blue_orbit', name:'블루 오빗', price:500, note:'푸른 궤도 트로피' },
  { category:'trophy', id:'tr_gold_comet', name:'골드 코멧', price:800, note:'금빛 혜성 트로피' },
  { category:'trophy', id:'tr_prism_crown', name:'프리즘 크라운', price:1200, note:'프리즘 왕관 트로피' },
];

export const DEFAULT_SHOWROOM_LOADOUT = Object.freeze({
  graph_skin: null,
  card_theme: null,
  point_marker: null,
  record_stamp: null,
  companion: null,
  ambient_effect: null,
  trophy: Object.freeze([]),
});

const categoryIds = new Set(SHOWROOM_CATEGORIES.map(category => category.id));
const paidById = new Map(SHOWROOM_ITEMS.filter(item => item.id).map(item => [item.id, item]));

export function getShowroomItem(id) {
  return typeof id === 'string' ? paidById.get(id) || null : null;
}

export function itemsForCategory(category) {
  return SHOWROOM_ITEMS.filter(item => item.category === category);
}

export function normalizeShowroomLoadout(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const normalized = { ...DEFAULT_SHOWROOM_LOADOUT, trophy: [] };
  for (const category of SHOWROOM_CATEGORIES) {
    if (category.mode === 'multi') {
      const ids = Array.isArray(source[category.id]) ? source[category.id] : [];
      normalized[category.id] = [...new Set(ids)]
        .filter(id => getShowroomItem(id)?.category === category.id)
        .slice(0, category.max);
      continue;
    }
    const id = source[category.id];
    normalized[category.id] = getShowroomItem(id)?.category === category.id ? id : null;
  }
  return normalized;
}

export function ownedShowroomIds(user) {
  return new Set(Array.isArray(user?.purchasedShowroomItems) ? user.purchasedShowroomItems : []);
}

export function isShowroomItemOwned(user, id) {
  return id == null || ownedShowroomIds(user).has(id);
}

export function unownedLoadoutItems(user, rawLoadout) {
  const loadout = normalizeShowroomLoadout(rawLoadout);
  const ids = SHOWROOM_CATEGORIES.flatMap(category => {
    const value = loadout[category.id];
    return Array.isArray(value) ? value : value ? [value] : [];
  });
  return ids.map(getShowroomItem).filter(item => item && !isShowroomItemOwned(user, item.id));
}

export function showroomCatalogTotal() {
  return SHOWROOM_ITEMS.filter(item => item.id).reduce((sum, item) => sum + item.price, 0);
}

export function isKnownShowroomCategory(category) {
  return categoryIds.has(category);
}
