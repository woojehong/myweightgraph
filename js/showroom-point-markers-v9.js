const marker = (id, name, rarity, visual) => Object.freeze({
  id,
  category: 'point_marker',
  name,
  rarity,
  price: null,
  asset: `./assets/showroom-v9/point_marker/${id}_low.png`,
  markerAssets: Object.freeze({
    high: `./assets/showroom-v9/point_marker/${id}_high.png`,
    low: `./assets/showroom-v9/point_marker/${id}_low.png`,
  }),
  visual,
  implKey: `point_marker:${id}`,
  testOnly: true,
  purchasable: false,
  persistable: false,
});

export const POINT_MARKER_ITEMS_V9 = Object.freeze([
  marker('pm_u_bears_signature', '베어스 승부구', 'uncommon', '남색 곰 발톱과 야구공으로 만든 두산 연상 시그니처'),
  marker('pm_u_twins_signature', '트윈스 하이파이브', 'uncommon', '남녀 인간 쌍둥이와 검정·백색·자홍 포인트의 LG 연상 시그니처'),
  marker('pm_u_softbear_signature', '망곰의 한 방', 'uncommon', '말랑한 베이지 곰과 남색 야구 장비의 협업 연상 시그니처'),
  marker('pm_r_feather_stratagem', '공명의 백우선', 'rare', '백우선·팔괘·동남풍·등불로 표현한 제갈량 연상 시그니처'),
  marker('pm_e_thunder_hammer', '천둥왕자의 망치', 'epic', '사각 망치·붉은 망토·날개·번개로 표현한 천둥신 연상 시그니처'),
  marker('pm_l_frozen_runeblade', '빙혼의 룬검', 'legendary', '서리 룬검·검은 왕관·영혼불로 표현한 타락 왕자 연상 시그니처'),
  marker('pm_l_tidal_archmage', '해일의 비전지팡이', 'legendary', '수정 지팡이·마도서·해일로 표현한 바다 대마법사 연상 시그니처'),
  marker('pm_l_iron_warchief', '강철 대족장의 도끼', 'legendary', '검은 강철 도끼·붉은 전쟁깃발·엄니로 표현한 대족장 연상 시그니처'),
  marker('pm_l_raven_tower', '까마귀탑의 지팡이', 'legendary', '까마귀 날개·보랏빛 지팡이·탑 차원문으로 표현한 수호자 연상 시그니처'),
  marker('pm_l_fel_twinblade', '황천의 쌍월도', 'legendary', '초록 불꽃 쌍월도·검은 안대·일식으로 표현한 악마사냥꾼 연상 시그니처'),
]);
