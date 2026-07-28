import { CARD_THEME_ITEMS_V12 } from './showroom-card-themes-v12.js';

const ROOT='./assets/showroom-v8/card_theme';
const theme=(id,name,rarity,asset,visual)=>Object.freeze({
  id,category:'card_theme',name,rarity,price:null,suggestedPrice:{uncommon:440,rare:880,epic:1430,legendary:2200}[rarity],
  asset:`${ROOT}/${asset}`,cardAssets:{header:`${ROOT}/${asset}`},
  visual,typography:{effect:'restrained'},implKey:`card_theme:${id}`,
  testOnly:true,purchasable:false,persistable:false,
});
const CARD_THEME_ITEMS_V8=Object.freeze([
  theme('ct8_u_bear_dugout','곰의 더그아웃','uncommon','ct8_u_bear_dugout.webp','남색 가죽과 은빛 곰발 장식'),
  theme('ct8_u_twin_stadium','쌍별 스타디움','uncommon','ct8_u_twin_stadium.webp','쌍별 기하 장식의 현대 구장 테마'),
  theme('ct8_u_tiger_clubhouse','호랑이 클럽하우스','uncommon','ct8_u_tiger_clubhouse.webp','검정·적색 봉제와 황금 줄무늬'),
  theme('ct8_u_walnut_cafe','호두나무 카페','uncommon','ct8_u_walnut_cafe.webp','호두나무와 크림 법랑의 일상 테마'),
  theme('ct8_u_dawn_runner','새벽 러너','uncommon','ct8_u_dawn_runner.webp','그래파이트 원단과 반사 테이프'),
  theme('ct8_r_wolong_silk','와룡의 비단책','rare','ct8_r_wolong_silk.webp','먹빛 비단과 대나무 전략 문양'),
  theme('ct8_r_red_hare_lacquer','적토의 칠갑','rare','ct8_r_red_hare_lacquer.webp','붉은 칠기와 말총 매듭'),
  theme('ct8_r_crescent_dragon','월아청룡','rare','ct8_r_crescent_dragon.webp','월광 강철과 청룡 비늘 각인'),
  theme('ct8_r_imperial_bronze','황실 청동인','rare','ct8_r_imperial_bronze.webp','고대 청동과 흑옥 인장'),
  theme('ct8_r_moon_archive','월하 서고','rare','ct8_r_moon_archive.webp','남빛 서책천과 월장석 매듭'),
  theme('ct8_e_crimson_reactor','진홍 반응로','epic','ct8_e_crimson_reactor.webp','진홍 나노 합금과 에너지 회로'),
  theme('ct8_e_storm_guardian','폭풍 수호갑','epic','ct8_e_storm_guardian.webp','건메탈 장갑과 절제된 번개'),
  theme('ct8_e_web_tech','은사 기동망','epic','ct8_e_web_tech.webp','탄소 직조와 은빛 미세섬유'),
  theme('ct8_e_dimensional_mystic','차원 비술환','epic','ct8_e_dimensional_mystic.webp','청금 유리와 동심원 비술'),
  theme('ct8_e_kinetic_alloy','흑진동 합금','epic','ct8_e_kinetic_alloy.webp','무광 흑합금과 보랏빛 운동에너지'),
  theme('ct8_legendary_frozen_throne','빙관 왕좌','legendary','ct8_legendary_frozen_throne.png','냉철과 서리 균열의 전설 테마'),
  theme('ct8_legendary_nether_sanctum','황천 검은 성소','legendary','ct8_legendary_nether_sanctum.png','흑요석과 황천 불씨의 전설 테마'),
  theme('ct8_l_sun_crystal_regalia','태양혈정 예복','legendary','ct8_l_sun_crystal_regalia.webp','진홍 칠보와 태양혈정 금장'),
  theme('ct8_l_raven_arcane','까마귀 비전수호','legendary','ct8_l_raven_arcane.webp','심야 비단과 보랏빛 비전유리'),
  theme('ct8_l_dark_ranger_requiem','어둠순찰자의 장송곡','legendary','ct8_l_dark_ranger_requiem.webp','흑은과 유령빛 장송 장식'),
]);

export const CARD_THEME_ITEMS=Object.freeze([...CARD_THEME_ITEMS_V8,...CARD_THEME_ITEMS_V12]);

export default CARD_THEME_ITEMS;
