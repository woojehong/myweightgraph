const SAFE_AREA = Object.freeze({ x: 0.12, y: 0.15, width: 0.76, height: 0.70 });
const PRICE = Object.freeze({ uncommon: 600, rare: 1200, epic: 1950, legendary: 3000 });

const spec = (id, name, rarity, asset, visual) => Object.freeze({
  id,
  category: 'graph_skin',
  name,
  rarity,
  price: null,
  plannedPrice: PRICE[rarity],
  asset: `./assets/showroom-v12/graph_skin/${asset}`,
  visual,
  implKey: `graph_skin:${id}`,
  testOnly: true,
  purchasable: false,
  persistable: false,
  releaseStatus: 'approval_pending',
  safeArea: SAFE_AREA,
});

export const GRAPH_SKIN_ITEMS_V12 = Object.freeze([
  spec('gs12_u_navy_bear_dugout', '남색 곰의 더그아웃', 'uncommon', 'gs12_u_navy_bear_dugout.webp', '남색 야구 더그아웃의 구조물을 가장자리에 배치한 차분한 구장 배경'),
  spec('gs12_u_twin_night_stadium', '쌍별 야간구장', 'uncommon', 'gs12_u_twin_night_stadium.webp', '쌍별 조명과 야간 관중석이 양쪽 가장자리를 감싸는 구장 배경'),
  spec('gs12_u_tiger_bullpen', '호랑이 불펜', 'uncommon', 'gs12_u_tiger_bullpen.webp', '호랑이 문양과 붉은 응원석을 모서리에 둔 불펜 배경'),
  spec('gs12_u_orange_eagle_skybox', '주황 독수리 스카이박스', 'uncommon', 'gs12_u_orange_eagle_skybox.webp', '주황 철골과 독수리의 비행감을 살린 야간 스카이박스'),
  spec('gs12_u_dawn_riverside_track', '새벽 한강 러닝트랙', 'uncommon', 'gs12_u_dawn_riverside_track.webp', '비에 젖은 새벽 강변 러닝트랙과 잔잔한 도심 불빛'),

  spec('gs12_r_wolong_formation', '와룡의 팔진대', 'rare', 'gs12_r_wolong_formation.webp', '팔진의 석등과 군략 문양이 가장자리를 이루는 고대 전장'),
  spec('gs12_r_red_cliff_firefleet', '적벽의 화선', 'rare', 'gs12_r_red_cliff_firefleet.webp', '불타는 선단과 강물의 잔광을 양쪽에 절제해 배치한 적벽'),
  spec('gs12_r_crescent_dragon_shrine', '월아청룡 사당', 'rare', 'gs12_r_crescent_dragon_shrine.webp', '청룡과 월아의 실루엣이 돌기둥에 새겨진 장수의 사당'),
  spec('gs12_r_silver_spear_pass', '백마은창 관문', 'rare', 'gs12_r_silver_spear_pass.webp', '은빛 창과 백마 깃발이 협곡 양끝을 지키는 고대 관문'),
  spec('gs12_r_imperial_seal_archive', '황실 옥새 서고', 'rare', 'gs12_r_imperial_seal_archive.webp', '옥새와 죽간, 황실 문양이 외곽을 감싸는 고대 서고'),

  spec('gs12_e_thunder_astral_bridge', '천둥왕자의 천문교', 'epic', 'gs12_e_thunder_astral_bridge.webp', '번개와 별자리 금속 장치가 외곽을 흐르는 천문 관측교'),
  spec('gs12_e_crimson_reality_garden', '진홍 마녀의 현실정원', 'epic', 'gs12_e_crimson_reality_garden.webp', '진홍 마력과 뒤틀린 정원 구조가 현실의 경계를 흔드는 배경'),
  spec('gs12_e_spider_dimension_city', '거미차원의 야경', 'epic', 'gs12_e_spider_dimension_city.webp', '거미줄 형태의 차원 균열과 네온 도시가 가장자리에 맺힌 야경'),
  spec('gs12_e_mirror_sanctum', '비전술사의 거울성소', 'epic', 'gs12_e_mirror_sanctum.webp', '금빛 비전 고리와 거울 차원이 외곽에서 중첩되는 성소'),
  spec('gs12_e_vibranium_kingdom', '흑진동 왕국의 심장', 'epic', 'gs12_e_vibranium_kingdom.webp', '흑보라 진동광과 미래 왕국의 장치가 테두리를 이루는 배경'),

  spec('gs12_m_banshee_black_wall', '밴시 여왕의 검은 성벽', 'legendary', 'gs12_m_banshee_black_wall.webp', '검은 성벽과 붉은 밴시 기운이 양끝에서 응집되는 신화 배경'),
  spec('gs12_m_iron_warchief_siege', '강철 대족장의 공성마당', 'legendary', 'gs12_m_iron_warchief_siege.webp', '강철 공성장치와 붉은 용광로가 외곽을 장악한 전쟁 마당'),
  spec('gs12_m_raven_time_corridor', '까마귀탑의 시간회랑', 'legendary', 'gs12_m_raven_time_corridor.webp', '까마귀 깃과 시계 비전문이 가장자리를 왜곡하는 시간회랑'),
  spec('gs12_m_tide_sage_fortress', '파도현자의 해상요새', 'legendary', 'gs12_m_tide_sage_fortress.webp', '해상 요새의 석조와 서리 파도가 외곽을 감싸는 신화 배경'),
  spec('gs12_m_moon_priestess_sanctuary', '달의 여사제 성역', 'legendary', 'gs12_m_moon_priestess_sanctuary.webp', '은빛 달빛과 고대 숲의 성역이 가장자리에서 빛나는 신화 배경'),
]);

export default GRAPH_SKIN_ITEMS_V12;
