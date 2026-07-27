const ROOT = './assets/showroom-v7/emoji_border';

const PRICES = Object.freeze({
  uncommon: 180,
  rare: 360,
  epic: 590,
  legendary: 900,
});

const frame = (id,name,rarity,visual) => Object.freeze({
  id,
  category: 'emoji_border',
  name,
  rarity,
  price: PRICES[rarity],
  asset: `${ROOT}/${id}.png`,
  visual,
  qualityTier: {
    uncommon:'quality_1',
    rare:'quality_2',
    epic:'quality_3',
    legendary:'quality_4',
  }[rarity],
  implKey:`emoji_border:${id}`,
  testOnly:false,
  purchasable:true,
  persistable:true,
});

export const PORTRAIT_FRAME_ITEMS_V7 = Object.freeze([
  frame('eb_u_bear_batter','서울 곰타자 클럽','uncommon','남색 패딩과 곰 발바닥 문장, 야구공 박음질을 조합한 친근한 야구 프레임'),
  frame('eb_u_twin_stadium','서울 쌍둥이 스타디움','uncommon','한 쌍의 별 문장과 검정·흰색·빨강 스타디움 패널을 조합한 야구 프레임'),
  frame('eb_u_tiger_dugout','광주 호랑이 덕아웃','uncommon','호랑이 줄무늬와 금빛 발톱 문장으로 힘을 준 붉은 야구 프레임'),
  frame('eb_u_morning_brew','모닝 브루 라운지','uncommon','호두나무와 카페 차양, 원두 장식을 담은 따뜻한 일상 프레임'),
  frame('eb_u_dawn_running','새벽 러닝 트랙','uncommon','러닝 트랙 선과 스톱워치 장식을 넣은 현대적인 운동 프레임'),

  frame('eb_r_wolong_trigram','와룡 팔괘진','rare','흑단과 고동, 팔괘 패와 구름 세공을 조합한 고대 책사 프레임'),
  frame('eb_r_red_hare_armor','적토 화염갑','rare','적색 찰갑과 말머리 장식, 검은 고삐를 조합한 고대 기병 프레임'),
  frame('eb_r_crescent_dragon','청룡 언월문','rare','비취빛 용린과 초승달 병장기 장식을 두른 고대 무장 프레임'),
  frame('eb_r_imperial_bronze','황실 청동관문','rare','황실 청동과 수호사자, 고대 기하문을 쌓은 관문형 프레임'),
  frame('eb_r_moon_archive','달빛 고서관','rare','청색 가죽 제본과 은빛 책갈피, 별자리 세공을 담은 고서 프레임'),

  frame('eb_e_crimson_core','진홍 심장로 장갑','epic','진홍 나노장갑과 금빛 골격, 청백 에너지 코어를 결합한 영웅 프레임'),
  frame('eb_e_thunder_guard','천둥 수호자의 강철','epic','암은 강철과 날개형 장갑, 푸른 전격 축전기를 결합한 영웅 프레임'),
  frame('eb_e_web_mobility','거미망 기동장치','epic','청적 복합장갑과 은빛 거미망 격자를 조합한 고기동 프레임'),
  frame('eb_e_dimensional_sanctum','차원술사의 성소','epic','자주빛 수정 회로와 황금 차원 기구를 겹친 비전 기술 프레임'),
  frame('eb_e_black_vibration','흑표 진동문양','epic','흑색 진동금속과 은빛 발톱선, 보랏빛 에너지층을 조합한 프레임'),

  frame('eb_l_frozen_oath','빙관 왕좌의 서약','legendary','검은 빙관 첨탑과 서리 룬, 영혼불꽃을 쌓아 올린 언데드 왕좌 프레임'),
  frame('eb_l_nether_twinblade','황천 배신자의 쌍날','legendary','흑요석 성소와 황천 수정, 지옥빛 쌍날을 결합한 레이드 프레임'),
  frame('eb_l_sunwell_bloodcrystal','태양샘 혈수정 궁정','legendary','혈수정 첨탑과 황금 곡선, 태양샘 광휘를 두른 엘프 궁정 프레임'),
  frame('eb_l_storm_lion_gate','폭풍왕국 사자성문','legendary','백색 성벽과 청금 장식, 사자 수호상을 세운 왕국 성문 프레임'),
  frame('eb_l_rediron_warchief','붉은철 대족장 성문','legendary','붉은 전투깃발과 검은 철갑, 거대한 엄니를 세운 대족장 성문 프레임'),
]);

export default PORTRAIT_FRAME_ITEMS_V7;
