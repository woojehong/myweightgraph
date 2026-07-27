const ROOT='./assets/showroom-v8/card_theme';
const theme=(id,name,asset,visual)=>Object.freeze({
  id,category:'card_theme',name,rarity:'legendary',price:null,
  asset:`${ROOT}/${asset}`,cardAssets:{header:`${ROOT}/${asset}`},
  visual,typography:{effect:'restrained'},implKey:`card_theme:${id}`,
  testOnly:true,purchasable:false,persistable:false,
});
export const CARD_THEME_ITEMS=Object.freeze([
  theme('ct8_legendary_frozen_throne','빙관 왕좌','ct8_legendary_frozen_throne.png','빙결 성채 외곽 장식과 서리빛 패널이 결합된 확장 헤더'),
  theme('ct8_legendary_nether_sanctum','황천 검은 성소','ct8_legendary_nether_sanctum.png','흑요석 성소와 황천 불꽃 패널이 결합된 확장 헤더'),
]);

export default CARD_THEME_ITEMS;
