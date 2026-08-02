const ROOT='./assets/showroom-v14/daesanghyeok';
const item=(category,id,name,asset,visual,extra={})=>Object.freeze({
  id,category,name,rarity:'legendary',price:null,asset,visual,
  implKey:`${category}:${id}`,testOnly:false,purchasable:true,persistable:true,...extra,
});

export const DAESANGHYEOK_SET_ITEM_IDS=Object.freeze([
  'gs14_l_daesanghyeok_stage',
  'ct14_l_daesanghyeok_goat',
  'ae14_l_daesanghyeok_dynasty',
  'ls14_l_daesanghyeok_legacy',
  'pe14_l_daesanghyeok',
  'eb14_l_daesanghyeok_hall',
  'pm14_l_daesanghyeok_crown',
]);

export const SHOWROOM_FULLSET_ITEMS_V14=Object.freeze([
  item('graph_skin','gs14_l_daesanghyeok_stage','빛상혁의 불멸 전당',`${ROOT}/graph_skin.webp`,'검정·T1 레드·금빛의 우승 전당과 정확히 여섯 별이 기록 영역을 감싸는 전설 그래프 스킨',{
    plannedPrice:3900,
    safeArea:Object.freeze({x:.12,y:.15,width:.76,height:.70}),
  }),
  item('card_theme','ct14_l_daesanghyeok_goat','빛상혁의 전설 기록관',`${ROOT}/card_theme.webp`,'검정·T1 레드·금빛 프레임과 여섯 우승 별이 헤더 정보를 선명하게 분리하는 전설 카드 테마',{
    cardAssets:Object.freeze({header:`${ROOT}/card_theme.webp`}),
    logoAsset:`${ROOT}/t1_logo.svg`,
    cssTheme:Object.freeze({
      accent:'#ffd166',panel:'rgba(10,7,8,.84)',edge:'rgba(226,1,45,.48)',shadow:'rgba(255,209,102,.32)',
    }),
    typography:Object.freeze({effect:'legendary'}),
  }),
  item('ambient_effect','ae14_l_daesanghyeok_dynasty','빛상혁의 육성 광휘',null,'정확히 여섯 개의 금빛 우승 별과 백색·적색 광휘가 그래프 전체 외곽을 순회하는 전설 공간 연출',{
    renderSpec:Object.freeze({fx:'ae14_l_daesanghyeok_dynasty',motionTier:'legendary',layers:6,centerProtection:.72}),
  }),
  item('line_style','ls14_l_daesanghyeok_legacy','빛상혁의 불멸 궤적',null,'T1 레드 주선과 백색 코어 위로 여섯 우승 별과 금빛 왕관 섬광이 질주하는 전설 그래프 선',{
    renderSpec:Object.freeze({fx:'ls14_l_daesanghyeok_legacy',width:3.4,tension:.12,color:'#e2012d',colorMode:'fixed',motionTier:'legendary',layers:6}),
  }),
  item('profile_emoji','pe14_l_daesanghyeok','빛상혁',`${ROOT}/portrait_full.webp`,'이상혁의 얼굴 특징을 보존한 4등신 전신과 동일 인물 상반신, 여섯 우승 별이 빛나는 전설 초상',{
    portraitAssets:Object.freeze({full:`${ROOT}/portrait_full.webp`,bust:`${ROOT}/portrait_bust.webp`}),
  }),
  item('emoji_border','eb14_l_daesanghyeok_hall','빛상혁의 명예 전당',`${ROOT}/portrait_frame.webp`,'검정 탄소섬유와 T1 레드, 금빛 장식이 초상을 침범하지 않고 감싸는 전설 프레임'),
  item('point_marker','pm14_l_daesanghyeok_crown','빛상혁의 절정 인장',`${ROOT}/marker_high.webp`,'최고점은 여섯 별의 왕관 트로피, 최저점은 여섯 별의 복원 방패로 구분하는 전설 마커',{
    markerAssets:Object.freeze({high:`${ROOT}/marker_high.webp`,low:`${ROOT}/marker_low.webp`}),
  }),
]);

export default SHOWROOM_FULLSET_ITEMS_V14;
