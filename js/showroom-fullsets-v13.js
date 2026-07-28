const ROOT='./assets/showroom-v13';
const assetItem=(category,id,name,rarity,asset,visual,extra={})=>Object.freeze({
  id,category,name,rarity,price:null,asset,visual,
  implKey:`${category}:${id}`,testOnly:false,purchasable:true,persistable:true,...extra,
});
const imageItem=(category,id,name,rarity,ext,visual,extra={})=>
  assetItem(category,id,name,rarity,`${ROOT}/${category}/${id}.${ext}`,visual,extra);
const cardItem=(id,name,rarity,visual)=>imageItem('card_theme',id,name,rarity,'webp',visual,{
  cardAssets:Object.freeze({header:`${ROOT}/card_theme/${id}.webp`}),
  typography:Object.freeze({effect:'restrained'}),
});
const graphItem=(id,name,rarity,visual)=>imageItem('graph_skin',id,name,rarity,'webp',visual,{
  plannedPrice:{uncommon:600,rare:1200,epic:1950,mythic:3000}[rarity],
  safeArea:Object.freeze({x:.12,y:.15,width:.76,height:.70}),
});
const fxItem=(category,id,name,rarity,visual,renderSpec)=>assetItem(
  category,id,name,rarity,null,visual,{renderSpec:Object.freeze(renderSpec)},
);
const marker=(id,name,rarity,visual)=>imageItem(
  'point_marker',id,name,rarity,'webp',visual,{
    markerAssets:Object.freeze({
      high:`${ROOT}/point_marker/${id}_high.webp`,
      low:`${ROOT}/point_marker/${id}_low.webp`,
    }),
  },
);

export const GRAPH_SKIN_ITEMS_V13=Object.freeze([
  graphItem('gs13_e_arc_reactor_hangar','강철 인간의 반응로 격납고','epic','적금 나노 장갑과 청백 반응로가 둘러싼 첨단 격납고'),
  graphItem('gs13_e_star_shield_command','미국 대장의 별방패 지휘소','epic','남색 전술 강철과 별방패 문양이 결속된 지휘소'),
  graphItem('gs13_u_softbear_ballpark','망곰이의 느긋한 볼파크','uncommon','크림색 손그림 곰과 남색 응원 소품이 놓인 포근한 야구장'),
  graphItem('gs13_u_loopy_twins_party','루피의 쌍별 응원파티','uncommon','분홍 장난꾸러기와 검정·백색·적색 쌍별 응원이 어우러진 구장'),
]);

export const CARD_THEME_ITEMS_V13=Object.freeze([
  cardItem('ct13_e_crimson_hex_chamber','진홍 마녀의 혼돈 성소','epic','진홍 카오스 룬과 현실 균열이 헤더 안전영역을 감싸는 영웅 테마'),
  cardItem('ct13_e_star_shield_bastion','미국 대장의 성조 방벽','epic','남색 전술 가죽과 은빛 별, 적백 방패 곡선으로 구성한 영웅 테마'),
  cardItem('ct13_u_softbear_dugout','망곰이의 느긋한 덕아웃','uncommon','크림색 종이 질감과 남색 야구 소품을 담은 고급 테마'),
  cardItem('ct13_u_loopy_cheer_lounge','루피의 쌍별 응원라운지','uncommon','분홍 포인트와 검정·백색·적색 핀스트라이프를 담은 고급 테마'),
]);

export const PROFILE_EMOJI_ITEMS_V13=Object.freeze([
  imageItem('profile_emoji','pe13_m_tideborn_queen','심해의 여왕','mythic','webp','다완 나가 여왕과 산호 왕관, 심해 마력이 드러나는 배경 없는 전신 초상'),
  imageItem('profile_emoji','pe13_m_sunwell_prince','태양샘의 왕자','mythic','webp','붉은 법복과 황금 견갑, 녹색 수정과 불사조 마력이 드러나는 전신 초상'),
  imageItem('profile_emoji','pe13_e_star_shield_captain','별방패 대장','epic','webp','별 문장 전투복과 원형 방패를 든 배경 없는 영웅 전신 초상'),
  imageItem('profile_emoji','pe13_u_loopy_cheer','루피 응원대장','uncommon','webp','분홍 비버형 장난꾸러기가 쌍별 응원복을 입은 배경 없는 캐릭터 초상'),
]);

export const PORTRAIT_FRAME_ITEMS_V13=Object.freeze([
  imageItem('emoji_border','eb13_m_tide_admiral','대제독의 빙해 함교','mythic','webp','청백 선체와 금빛 닻, 얼음 결정이 정사각 초상 외곽을 감싸는 프레임'),
  imageItem('emoji_border','eb13_m_banshee_valkyr','밴시 여왕의 발키르 문','mythic','webp','검은 깃털과 자주 갑주, 진홍 화살과 발키르 날개가 감싼 프레임'),
  imageItem('emoji_border','eb13_m_raven_timegate','수호자의 까마귀 시간문','mythic','webp','까마귀 날개와 황금 천문기구, 보랏빛 시간 룬이 감싼 프레임'),
  imageItem('emoji_border','eb13_m_azshara_coral','여왕의 심해 산호관','mythic','webp','적금 산호 왕관과 진주, 청록 생물광 촉수가 감싼 프레임'),
  imageItem('emoji_border','eb13_e_crimson_hex','진홍 마녀의 혼돈관','epic','webp','진홍 왕관 곡선과 균열 룬, 암적색 마력 수정이 감싼 프레임'),
  imageItem('emoji_border','eb13_e_star_shield','미국 대장의 별방패','epic','webp','은빛 별과 남색 강철, 적백 방패 띠가 감싼 프레임'),
  imageItem('emoji_border','eb13_u_softbear','망곰이의 남색 덕아웃','uncommon','webp','크림색 손그림 스티치와 남색 모자, 야구공이 감싼 프레임'),
  imageItem('emoji_border','eb13_u_loopy','루피의 쌍별 응원석','uncommon','webp','분홍 볼과 쌍별, 검정·백색·적색 응원 리본이 감싼 프레임'),
]);

export const POINT_MARKER_ITEMS_V13=Object.freeze([
  marker('pm13_m_banshee_arrow','밴시 여왕의 통곡 화살','mythic','최고점은 승리의 붉은 화살촉, 최저점은 금이 간 자주 화살촉'),
  marker('pm13_m_azshara_tiara','여왕의 해일 왕관','mythic','최고점은 진주 해일 왕관, 최저점은 심해에 잠긴 산호 왕관'),
  marker('pm13_m_sunwell_orb','태양왕의 불사조 보주','mythic','최고점은 날개 편 불사조 보주, 최저점은 재가 된 금이 간 보주'),
  marker('pm13_e_arc_reactor','강철 인간의 반응로','epic','최고점은 완전 충전 청백 반응로, 최저점은 경고등이 켜진 손상 반응로'),
  marker('pm13_e_crimson_hex','진홍 마녀의 혼돈 인장','epic','최고점은 정렬된 진홍 룬, 최저점은 뒤틀려 깨진 혼돈 룬'),
  marker('pm13_e_star_shield','미국 대장의 별방패','epic','최고점은 광택 나는 별방패, 최저점은 긁히고 기울어진 전투 방패'),
  marker('pm13_u_loopy_cheer','루피의 쌍별 응원핀','uncommon','최고점은 환호하는 분홍 응원핀, 최저점은 시무룩한 분홍 응원핀'),
]);

export const AMBIENT_EFFECT_ITEMS_V13=Object.freeze([
  fxItem('ambient_effect','ae13_m_azshara_maelstrom','여왕의 심해 대소용돌이','mythic','청록 해류와 진주 기포, 생물광 촉수와 해일 룬이 층층이 휘감기는 신화 연출',{fx:'ae13_m_azshara_maelstrom',motionTier:'mythic'}),
  fxItem('ambient_effect','ae13_m_sunwell_phoenix','태양왕의 불사조 강림','mythic','적금 불사조 깃털과 녹색 수정 파편, 태양샘 광륜이 교차하는 신화 연출',{fx:'ae13_m_sunwell_phoenix',motionTier:'mythic'}),
  fxItem('ambient_effect','ae13_e_star_shield_salute','미국 대장의 별방패 경례','epic','별빛 잔광과 방패 충격파, 적백 리본이 외곽을 질주하는 영웅 연출',{fx:'ae13_e_star_shield_salute',motionTier:'heroic'}),
  fxItem('ambient_effect','ae13_u_softbear_cheer','망곰이의 느긋한 응원','uncommon','남색 종이 꽃가루와 크림색 곰발, 야구공 실밥이 살랑이는 고급 연출',{fx:'ae13_u_softbear_cheer',motionTier:'gentle'}),
  fxItem('ambient_effect','ae13_u_loopy_party','루피의 쌍별 파티','uncommon','분홍 하트와 쌍별, 검정·백색·적색 응원 테이프가 통통 튀는 고급 연출',{fx:'ae13_u_loopy_party',motionTier:'gentle'}),
]);

export const LINE_STYLE_ITEMS_V13=Object.freeze([
  fxItem('line_style','ls13_m_azshara_tide','여왕의 심해 해일선','mythic','청록 해류 위로 진주와 산호 마디가 솟고 생물광이 역류하는 신화 선',{fx:'ls13_m_azshara_tide',width:3.2,tension:.2,color:'#69f1e7',colorMode:'fixed',motionTier:'mythic'}),
  fxItem('line_style','ls13_m_sunwell_phoenix','태양왕의 불사조선','mythic','적금 불꽃 깃털과 녹색 수정 펄스가 비상과 재생을 반복하는 신화 선',{fx:'ls13_m_sunwell_phoenix',width:3.2,tension:.16,color:'#ffb347',colorMode:'fixed',motionTier:'mythic'}),
  fxItem('line_style','ls13_e_star_shield_rally','미국 대장의 방패 집결선','epic','남색 합금선 위로 은빛 별과 적백 방패 파동이 전진하는 영웅 선',{fx:'ls13_e_star_shield_rally',width:3,tension:.1,color:'#9bc8ff',colorMode:'fixed',motionTier:'heroic'}),
  fxItem('line_style','ls13_u_softbear_stitch','망곰이의 느슨한 실밥선','uncommon','손그림 같은 야구 실밥과 둥근 곰발 매듭을 잇는 고급 선. 선택 색상 적용',{fx:'ls13_u_softbear_stitch',width:2.5,tension:.1,color:'#202b52',colorMode:'custom',motionTier:'gentle'}),
  fxItem('line_style','ls13_u_twins_pinstripe','럭키 & 스타의 쌍별선','uncommon','검정 핀스트라이프와 두 개의 별 마디를 반복하는 고급 선. 선택 색상 적용',{fx:'ls13_u_twins_pinstripe',width:2.5,tension:.1,color:'#c8102e',colorMode:'custom',motionTier:'gentle'}),
  fxItem('line_style','ls13_u_loopy_bounce','루피의 통통 응원선','uncommon','둥근 분홍 리본과 작은 앞니 모양 마디가 통통 이어지는 고급 선. 선택 색상 적용',{fx:'ls13_u_loopy_bounce',width:2.5,tension:.16,color:'#f18bb5',colorMode:'custom',motionTier:'gentle'}),
]);

export const SHOWROOM_FULLSET_ITEMS_V13=Object.freeze([
  ...GRAPH_SKIN_ITEMS_V13,...CARD_THEME_ITEMS_V13,...PROFILE_EMOJI_ITEMS_V13,
  ...PORTRAIT_FRAME_ITEMS_V13,...POINT_MARKER_ITEMS_V13,
  ...AMBIENT_EFFECT_ITEMS_V13,...LINE_STYLE_ITEMS_V13,
]);

export default SHOWROOM_FULLSET_ITEMS_V13;
