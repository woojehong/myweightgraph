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
  item('graph_skin','gs14_l_daesanghyeok_stage','대상혁의 전설 무대',`${ROOT}/graph_skin.webp`,'청록과 금빛의 우승 무대가 기록 영역을 감싸는 전설 그래프 스킨',{
    plannedPrice:3900,
    safeArea:Object.freeze({x:.12,y:.15,width:.76,height:.70}),
  }),
  item('card_theme','ct14_l_daesanghyeok_goat','대상혁의 GOAT 기록관',`${ROOT}/card_theme.webp`,'다섯 개의 별과 왕조의 금빛 문장이 헤더를 감싸는 전설 카드 테마',{
    cardAssets:Object.freeze({header:`${ROOT}/card_theme.webp`}),
    logoAsset:`${ROOT}/t1_logo.svg`,
    cssTheme:Object.freeze({
      accent:'#f6d365',panel:'rgba(5,20,24,.84)',edge:'rgba(246,211,101,.46)',shadow:'rgba(0,229,170,.34)',
    }),
    typography:Object.freeze({effect:'legendary'}),
  }),
  item('ambient_effect','ae14_l_daesanghyeok_dynasty','대상혁의 불멸 왕조',null,'청록 별빛과 금빛 우승 고리, 다섯 왕관의 잔광이 가장자리를 순환하는 전설 공간 연출',{
    renderSpec:Object.freeze({fx:'ae14_l_daesanghyeok_dynasty',motionTier:'legendary',layers:6,centerProtection:.72}),
  }),
  item('line_style','ls14_l_daesanghyeok_legacy','대상혁의 불멸 궤적',null,'청록 주선 위로 금빛 왕관과 다섯 개의 우승 별이 이어지고 백색 섬광이 질주하는 전설 그래프 선',{
    renderSpec:Object.freeze({fx:'ls14_l_daesanghyeok_legacy',width:3.4,tension:.12,color:'#35e0c1',colorMode:'fixed',motionTier:'legendary',layers:6}),
  }),
  item('profile_emoji','pe14_l_daesanghyeok','대상혁',`${ROOT}/portrait_full.webp`,'청록과 금빛 무대 조명 아래 선 전설의 전신·반신 초상',{
    portraitAssets:Object.freeze({full:`${ROOT}/portrait_full.webp`,bust:`${ROOT}/portrait_bust.webp`}),
  }),
  item('emoji_border','eb14_l_daesanghyeok_hall','대상혁의 명예의 전당',`${ROOT}/portrait_frame.webp`,'다섯 별과 금빛 월계관, 청록 보석이 초상을 감싸는 전설 프레임'),
  item('point_marker','pm14_l_daesanghyeok_crown','대상혁의 왕관',`${ROOT}/marker_high.webp`,'최고점은 빛나는 금빛 왕관, 최저점은 꺼지지 않은 청록 왕관으로 표시하는 전설 마커',{
    markerAssets:Object.freeze({high:`${ROOT}/marker_high.webp`,low:`${ROOT}/marker_low.webp`}),
  }),
]);

export default SHOWROOM_FULLSET_ITEMS_V14;
