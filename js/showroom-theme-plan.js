// ─────────────────────────────────────────────────────────────────────────────
// 쇼룸 테마 기획안 (PLAN ONLY — 런타임 미사용)
//
// ⚠️ 이 파일은 어디에서도 import하지 않는다. 실제 화면에 노출되지 않는다.
//    카탈로그(showroom-catalog-v2.js)는 범주당 12개 완성 검증과 총합 검증이 걸려 있어
//    직접 추가하면 앱이 깨진다. 그래서 기획 데이터만 별도로 보관한다.
//
// 용도
//   1) GPT 이미지 제작 브리프 원본 (source:'image')
//   2) 내가 구현할 코드 이펙트 사양 원본 (source:'code')
//
// 규칙
//   - 등급(rarity)은 컨셉이 아니라 퀄리티·밀도 차이다. 같은 계열이 여러 등급에 존재한다.
//   - 정확한 고유명사는 쓰지 않되 보면 알아보게 연상시킨다. (오마주 톤)
//   - 계열(theme): game | history | hero | sports | fantasy
//   - 9범주 × 12종(등급별 3종) = 108종
// ─────────────────────────────────────────────────────────────────────────────

const RARITY = Object.freeze({ U: 'uncommon', R: 'rare', E: 'epic', L: 'legendary' });

export const SHOWROOM_THEMES = Object.freeze({
  game:    { id: 'game',    label: '게임',   note: '전략·MMO 게임 연상. 군체/정신체/서리 옥좌/차원 관문 등' },
  history: { id: 'history', label: '역사',   note: '삼국지 중심. 죽간·군기·적벽·오호장·옥새·진형도' },
  hero:    { id: 'hero',    label: '히어로', note: '슈퍼히어로 연상. 심장로 슈트·방패·천둥 망치·여섯 보석' },
  sports:  { id: 'sports',  label: '스포츠', note: '야구·축구·테니스·레슬링. 전광판·골망·클레이코트·챔피언 벨트' },
  fantasy: { id: 'fantasy', label: '판타지', note: '마법학교·마법약·룬·드래곤·불사조·부엉이 우편' },
});

// (범주, id, 이름, 등급, 계열, GPT/구현용 설명)
const p = (category, id, name, rarity, theme, brief, source) =>
  Object.freeze({ id, category, name, rarity, theme, brief, source, planOnly: true });

const img  = (c, i, n, r, t, b) => p(c, i, n, r, t, b, 'image');
const code = (c, i, n, r, t, b) => p(c, i, n, r, t, b, 'code');

// ── 1. 그래프 스킨 [이미지] ─────────────────────────────────────────────────
// 1536×864. 중앙 76%×70%는 데이터 영역이므로 무장식. 장식은 가장자리에만.
const graph_skin = [
  img('graph_skin','gsp_scoreboard','낡은 전광판',RARITY.U,'sports','외곽에 야구장 전광판 패널과 전구 테두리. 중앙은 비움'),
  img('graph_skin','gsp_bamboo','죽간 병법서',RARITY.U,'history','좌우로 말린 죽간과 먹 얼룩. 단일 목재 재질'),
  img('graph_skin','gsp_parchment','마법학교 양피지',RARITY.U,'fantasy','네 귀 촛농과 깃펜 자국이 있는 낡은 양피지'),
  img('graph_skin','gsp_clay','클레이코트',RARITY.R,'sports','붉은 흙 라인과 네트 그림자가 가장자리에 깔림'),
  img('graph_skin','gsp_biomass','군체 점막벽',RARITY.R,'game','유기적 점막과 포자낭이 가장자리를 잠식. 미세 맥동'),
  img('graph_skin','gsp_alchemy','마법약 실험대',RARITY.R,'fantasy','외곽에 플라스크·증류관과 김 서림. 유리+황동'),
  img('graph_skin','gsp_redcliff','적벽의 밤',RARITY.E,'history','좌우 전선 실루엣과 불화살 궤적. 전경/중경/후경 분리'),
  img('graph_skin','gsp_reactor','심장로 격납고',RARITY.E,'hero','청백광 반응로 링과 정비 아암. 금속+발광 4층'),
  img('graph_skin','gsp_sanctum','정신체 성소',RARITY.E,'game','부유 결정판과 황금 홀로 격자. 반투명 다층'),
  img('graph_skin','gsp_icecrown','얼음왕관 성채',RARITY.L,'game','거대한 얼음 첨탑 성채가 좌우 가장자리에 솟음. 상단에 서리 옥좌 실루엣, 하단 빙벽과 냉기 안개. 푸른 냉광+흑철+빙결정 다중 재질 7층. 중앙은 완전히 비움'),
  img('graph_skin','gsp_six_gems','여섯 보석 제단',RARITY.L,'hero','육색 보석이 박힌 장갑 형태의 대형 제단. 공간 깊이'),
  img('graph_skin','gsp_hall_of_fame','명예의 전당',RARITY.L,'sports','챔피언 벨트와 트로피 진열장, 스포트라이트. 7층'),
];

// ── 2. 카드 테마 = 프로필 헤더 테두리 [이미지] ─────────────────────────────
// 가로형 투명 프레임. 내부 채움·배경 금지. 이모티콘+이름+칭호 윤곽만 감쌈.
const card_theme = [
  img('card_theme','ctp_bats','교차 배트',RARITY.U,'sports','배트 2자루와 홈플레이트가 윤곽을 이룸'),
  img('card_theme','ctp_bamboo_band','죽간 띠',RARITY.U,'history','좁은 죽간이 좌우로 이어진 단순 띠'),
  img('card_theme','ctp_wands','지팡이 교차',RARITY.U,'fantasy','마법 지팡이 2개가 교차하고 작은 불꽃'),
  img('card_theme','ctp_goalnet','골망 프레임',RARITY.R,'sports','그물 짜임과 코너 깃발'),
  img('card_theme','ctp_psionic','사이오닉 테',RARITY.R,'game','부유 결정 조각 4개가 윤곽을 따라 배치'),
  img('card_theme','ctp_house_crest','기숙사 문장',RARITY.R,'fantasy','사자·뱀·독수리·오소리 소형 문장 4개'),
  img('card_theme','ctp_five_seals','오호장 인장',RARITY.E,'history','다섯 장수 인장이 박힌 청동 띠'),
  img('card_theme','ctp_reactor_ring','심장로 링',RARITY.E,'hero','청백광 원환과 방열 슬릿'),
  img('card_theme','ctp_wild_horn','야생의 뿔',RARITY.E,'fantasy','뒤엉킨 뿔과 넝쿨이 좌우로 뻗음'),
  img('card_theme','ctp_frost_crown','서리 왕관',RARITY.L,'game','얼음 왕관과 냉기 결정이 상단을 지배'),
  img('card_theme','ctp_gem_frame','여섯 보석 프레임',RARITY.L,'hero','육색 보석이 궤도를 이루는 프레임'),
  img('card_theme','ctp_slam_wreath','그랜드슬램 관',RARITY.L,'sports','월계관과 챔피언 벨트 버클 결합'),
];

// ── 3. 프로필 초상 [이미지] ────────────────────────────────────────────────
// 얼굴 핵심을 중앙 64% 안에. 프레임 없이 초상만.
const profile_emoji = [
  img('profile_emoji','pep_rookie','신인 투수',RARITY.U,'sports','모자 눌러쓴 앳된 투수. 단순 채색'),
  img('profile_emoji','pep_soldier','병졸',RARITY.U,'history','가죽 갑옷의 평범한 병졸'),
  img('profile_emoji','pep_apprentice','견습 마법사',RARITY.U,'fantasy','큰 모자를 쓴 앳된 견습생'),
  img('profile_emoji','pep_midfielder','미드필더',RARITY.R,'sports','땀에 젖은 축구 선수, 유니폼 디테일'),
  img('profile_emoji','pep_strategist','군사 참모',RARITY.R,'history','깃털부채와 관을 쓴 책사'),
  img('profile_emoji','pep_prefect','기숙사 대표',RARITY.R,'fantasy','문장 배지를 단 교복 차림'),
  img('profile_emoji','pep_ace','에이스 투수',RARITY.E,'sports','조명 아래 강렬한 표정. 극적 명암'),
  img('profile_emoji','pep_general','오호대장',RARITY.E,'history','장식 갑옷과 투구를 갖춘 명장'),
  img('profile_emoji','pep_commander','기계보병 지휘관',RARITY.E,'game','강화복 헬멧, HUD 반사광'),
  img('profile_emoji','pep_frost_lord','서리 군주',RARITY.L,'game','서리 투구 아래 푸른 안광. 다중 재질'),
  img('profile_emoji','pep_iron_hero','강철 슈트 영웅',RARITY.L,'hero','붉은 금속 헬멧과 청백 코어광'),
  img('profile_emoji','pep_undefeated','무패의 챔피언',RARITY.L,'sports','챔피언 벨트를 두른 격투 챔피언'),
];

// ── 4. 포인트 마커 [이미지] ────────────────────────────────────────────────
// 접점 중심 반경 18px 이내의 작은 아이콘.
const point_marker = [
  img('point_marker','pmp_baseball','야구공',RARITY.U,'sports','실밥이 보이는 단순한 야구공'),
  img('point_marker','pmp_seal','옥새 인장',RARITY.U,'history','붉은 인주가 묻은 작은 인장'),
  img('point_marker','pmp_candle','촛불',RARITY.U,'fantasy','작게 흔들리는 촛불'),
  img('point_marker','pmp_impact','임팩트 순간',RARITY.R,'sports','라켓에 눌린 테니스공과 충격 링'),
  img('point_marker','pmp_banner','군령 깃발',RARITY.R,'history','작은 삼각 군기와 창끝'),
  img('point_marker','pmp_runestone','마법 룬돌',RARITY.R,'fantasy','룬이 새겨진 발광 돌'),
  img('point_marker','pmp_arrowfire','불화살촉',RARITY.E,'history','불붙은 화살촉과 잔열'),
  img('point_marker','pmp_core','심장로 코어',RARITY.E,'hero','청백광 코어와 금속 링 3층'),
  img('point_marker','pmp_crystal','사이오닉 결정',RARITY.E,'game','부유하는 다면 결정, 내부 발광'),
  img('point_marker','pmp_six_gem','여섯 보석',RARITY.L,'hero','육색 보석이 모인 소형 집합체'),
  img('point_marker','pmp_frost_rune','서리 룬검',RARITY.L,'game','소형 룬검과 냉기 결정'),
  img('point_marker','pmp_belt_buckle','챔피언 버클',RARITY.L,'sports','황금 챔피언 벨트 버클, 보석 상감'),
];

// ── 5. 동반자 [이미지] ─────────────────────────────────────────────────────
// 우측 상단 14%×22% 전용 둥지 안에만 존재.
const companion = [
  img('companion','cmp_batboy','배트보이 인형',RARITY.U,'sports','작은 유니폼을 입은 인형'),
  img('companion','cmp_scroll','두루마리 정령',RARITY.U,'history','스스로 펼쳐지는 작은 죽간 정령'),
  img('companion','cmp_wisp','촛불 위습',RARITY.U,'fantasy','따뜻한 불빛의 꼬마 위습'),
  img('companion','cmp_mascot','마스코트 곰',RARITY.R,'sports','구단 마스코트풍 통통한 곰'),
  img('companion','cmp_pigeon','전서구',RARITY.R,'history','편지를 문 비둘기, 발목 통'),
  img('companion','cmp_owl','부엉이 우편배달부',RARITY.R,'fantasy','편지를 문 부엉이, 작은 가방'),
  img('companion','cmp_drake','새끼 드래곤',RARITY.E,'fantasy','날개를 접은 새끼 용, 비늘 반사'),
  img('companion','cmp_drone','정비 드론',RARITY.E,'hero','아암을 접은 소형 드론, 신호등'),
  img('companion','cmp_larva','군체 유충',RARITY.E,'game','꿈틀대는 유기 생명체, 점막 광택'),
  img('companion','cmp_frostwolf','서리 늑대',RARITY.L,'game','냉기를 내뿜는 늑대, 결정 갈기'),
  img('companion','cmp_phoenix','불사조',RARITY.L,'fantasy','깃털마다 불꽃이 흐르는 불사조'),
  img('companion','cmp_trophy_spirit','우승컵 정령',RARITY.L,'sports','트로피에서 태어난 황금 정령'),
];

// ── 6. 트로피 [이미지] — 업적 전용(상점 판매 금지) ─────────────────────────
// 좌측 상단 12%×20% 전용 선반 안에만 존재.
const trophy = [
  img('trophy','trp_little_cup','리틀리그 컵',RARITY.U,'sports','작고 소박한 은컵'),
  img('trophy','trp_merit_tablet','죽간 공적패',RARITY.U,'history','공적이 새겨진 작은 죽간패'),
  img('trophy','trp_novice_medal','견습 훈장',RARITY.U,'fantasy','리본이 달린 단순 훈장'),
  img('trophy','trp_league_cup','리그 우승컵',RARITY.R,'sports','손잡이 둘 달린 은도금 우승컵'),
  img('trophy','trp_general_seal','장수 인장',RARITY.R,'history','호랑이 손잡이 청동 인장'),
  img('trophy','trp_house_cup','기숙사 우승배',RARITY.R,'fantasy','보석이 박힌 마법학교 우승배'),
  img('trophy','trp_five_spear','오호장 창',RARITY.E,'history','다섯 술 장식이 달린 의장용 창'),
  img('trophy','trp_hero_shield','영웅의 방패',RARITY.E,'hero','동심원 문양의 원형 방패'),
  img('trophy','trp_relic','정신체 유물',RARITY.E,'game','부유하는 황금 고대 유물'),
  img('trophy','trp_grand_slam','그랜드슬램 트로피',RARITY.L,'sports','네 대회 상징이 결합된 대형 트로피'),
  img('trophy','trp_gauntlet','여섯 보석 장갑',RARITY.L,'hero','육색 보석이 박힌 황금 장갑'),
  img('trophy','trp_frost_crown','서리 왕관',RARITY.L,'game','냉기가 흐르는 왕관, 다중 결정'),
];

// ── 7. 이모티콘 테두리 [코드 — 내가 구현] ──────────────────────────────────
// 링 회전 없음. 상시 루프. 등급 = 동시 진행 레이어 수.
const emoji_border = [
  code('emoji_border','ebp_torch','성화 링',RARITY.U,'sports','은은한 불빛 호흡 1레이어'),
  code('emoji_border','ebp_ink','먹 번짐',RARITY.U,'history','테두리에 먹이 번졌다 옅어짐'),
  code('emoji_border','ebp_rune','룬 점등',RARITY.U,'fantasy','룬 4개가 순차 점등'),
  code('emoji_border','ebp_net','골망 위브',RARITY.R,'sports','그물 짜임 광선 2겹이 교차'),
  code('emoji_border','ebp_psi','사이오닉 장',RARITY.R,'game','결정 부유 + 에너지장 맥동'),
  code('emoji_border','ebp_crest','기숙사 문장광',RARITY.R,'fantasy','문장 발광 + 외곽 스파크'),
  code('emoji_border','ebp_core','심장로 코어',RARITY.E,'hero','코어광 + 방열 + 미세 입자 4레이어'),
  code('emoji_border','ebp_emberheat','화공 잔열',RARITY.E,'history','불티 상승 + 잔열 명멸 + 재 낙하'),
  code('emoji_border','ebp_rift','차원 관문',RARITY.E,'game','관문 왜곡 + 입자 유입 + 테두리 굴절'),
  code('emoji_border','ebp_frost_crown','서리 왕관',RARITY.L,'game','결정 성장→붕괴 순환 + 서리 안개 + 광채 6레이어'),
  code('emoji_border','ebp_gem_orbit','여섯 보석 궤도',RARITY.L,'hero','육색 보석이 각기 다른 속도로 공전 + 색광 간섭'),
  code('emoji_border','ebp_champion','챔피언 광채',RARITY.L,'sports','금광 스윕 + 플래시 세례 + 색종이'),
];

// ── 8. 공간 효과 [코드 — 내가 구현] ────────────────────────────────────────
// 플롯 바깥 테두리 band에만. 중앙 침범 0, 대비 12% 이하. 상시 루프.
const ambient_effect = [
  code('ambient_effect','aep_dust','경기장 먼지',RARITY.U,'sports','외곽에 흙먼지 몇 알 부유'),
  code('ambient_effect','aep_ink_mote','먹 티끌',RARITY.U,'history','미세 먹입자가 느리게 가라앉음'),
  code('ambient_effect','aep_firefly','마법 반딧불',RARITY.U,'fantasy','모서리 반딧불 2~3마리 유영'),
  code('ambient_effect','aep_spore','포자 유동',RARITY.R,'game','군체 포자가 좌우에서 상승'),
  code('ambient_effect','aep_feather','부엉이 깃털',RARITY.R,'fantasy','깃털이 상단에서 사선 낙하'),
  code('ambient_effect','aep_grass','잔디 바람',RARITY.R,'sports','하단 잔디 결이 물결침'),
  code('ambient_effect','aep_roar','함성 파동',RARITY.E,'sports','관중석 방향 빛 파동 + 플래시'),
  code('ambient_effect','aep_firearrow','불화살비',RARITY.E,'history','불화살 궤적 + 잔열 + 재'),
  code('ambient_effect','aep_holo','홀로 격자',RARITY.E,'game','황금 격자 접힘/펴짐 + 스캔라인 + 부유 결정'),
  code('ambient_effect','aep_blizzard','서리폭풍',RARITY.L,'game','눈보라 2겹 + 결정 생성 + 냉기 굴절 + 미광'),
  code('ambient_effect','aep_gem_nebula','보석 성운',RARITY.L,'hero','육색 성운 역방향 흐름 + 별 점멸 + 색 간섭'),
  code('ambient_effect','aep_ceremony','우승 세리머니',RARITY.L,'sports','색종이 낙하 + 스포트라이트 스윕 + 플래시 + 잔광'),
];

// ── 9. 그래프 선 [코드 — 내가 구현] ────────────────────────────────────────
// 선의 실제 좌표는 왜곡 금지. 장식은 선 주변에만.
const line_style = [
  code('line_style','lsp_ink','먹선',RARITY.U,'history','균일 두께 + 가장자리 미세 번짐, 느린 농도 호흡'),
  code('line_style','lsp_tape','라인테이프',RARITY.U,'sports','경기장 라인 같은 단정한 파선'),
  code('line_style','lsp_candle','촛불선',RARITY.U,'fantasy','본선 + 얇은 하이라이트가 천천히 미끄러짐'),
  code('line_style','lsp_vein','흐르는 광맥',RARITY.R,'fantasy','대시가 선 방향으로 흐름 + 글로우 맥동'),
  code('line_style','lsp_psi','사이오닉 선',RARITY.R,'game','본선 + 위상 다른 보조선이 교차하며 흐름'),
  code('line_style','lsp_netthread','골망 실',RARITY.R,'sports','두 가닥이 그물처럼 엮이며 진행'),
  code('line_style','lsp_heatline','화공 열선',RARITY.E,'history','발열대가 선을 따라 이동 + 냉각 잔열 + 불티'),
  code('line_style','lsp_current','심장로 전류',RARITY.E,'hero','굵은 전류 1 + 잔전류 2가 동시에 주파 + 스파크'),
  code('line_style','lsp_afterimage','기억의 잔상',RARITY.E,'game','지연 잔상선 2겹이 다른 지연값으로 따라붙음'),
  code('line_style','lsp_frost','서리 결정선',RARITY.L,'game','결정이 맺혔다 부서지는 순환 + 냉기 + 굴절 + 미광'),
  code('line_style','lsp_gem_trail','여섯 보석 궤적',RARITY.L,'hero','육색 광파가 순차 통과 + 파생 입자 + 외곽 잔상'),
  code('line_style','lsp_spotlight','우승 스포트라이트',RARITY.L,'sports','조명이 선을 훑고 지나감 + 플래시 + 잔광 + 색종이'),
];

export const SHOWROOM_THEME_PLAN = Object.freeze([
  ...graph_skin, ...card_theme, ...profile_emoji, ...point_marker,
  ...companion, ...trophy, ...emoji_border, ...ambient_effect, ...line_style,
]);

export const PLAN_BY_CATEGORY = Object.freeze(
  SHOWROOM_THEME_PLAN.reduce((acc, it) => {
    (acc[it.category] ||= []).push(it);
    return acc;
  }, {})
);

// 이미지 제작 대상(GPT) / 코드 구현 대상(개발) 분리
export const PLAN_IMAGE_ITEMS = Object.freeze(SHOWROOM_THEME_PLAN.filter(i => i.source === 'image'));
export const PLAN_CODE_ITEMS  = Object.freeze(SHOWROOM_THEME_PLAN.filter(i => i.source === 'code'));
