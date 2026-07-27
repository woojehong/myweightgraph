const PRICES = Object.freeze({
  uncommon: 260,
  rare: 560,
  epic: 900,
  legendary: 1200,
});

const portrait = (id,name,rarity,asset,visual) => Object.freeze({
  id,
  category:'profile_emoji',
  name,
  rarity,
  price:PRICES[rarity],
  asset,
  visual,
  qualityTier:{
    uncommon:'quality_1',
    rare:'quality_2',
    epic:'quality_3',
    legendary:'quality_4',
  }[rarity],
  implKey:`profile_emoji:${id}`,
  testOnly:false,
  purchasable:true,
  persistable:true,
});

const V8 = './assets/showroom-v8/profile_emoji';
const V6 = './assets/showroom-v6/profile_emoji';

export const PROFILE_EMOJI_ITEMS_V6 = Object.freeze([
  portrait('pe_u_blue_bear_slugger','푸른 곰 강타자','uncommon',`${V8}/pe_u_blue_bear_slugger.webp`,'푸른 곰 타자가 힘차게 방망이를 휘두르는 야구 마스코트 초상화'),
  portrait('pe_u_twin_cheer_pair','쌍둥이 응원단','uncommon',`${V8}/pe_u_twin_cheer_pair.webp`,'공과 글러브를 든 남녀 쌍둥이 응원 캐릭터 초상화'),
  portrait('pe_u_soft_bear_fan','말랑곰 승리요정','uncommon',`${V8}/pe_u_soft_bear_fan.webp`,'말랑한 크림색 곰이 응원 도구를 흔드는 초상화'),
  portrait('pe_u_red_tiger_pitcher','붉은 호랑이 투수','uncommon',`${V8}/pe_u_red_tiger_pitcher.webp`,'붉은 유니폼을 입은 호랑이 투수 마스코트 초상화'),
  portrait('pe_u_orange_eagle_cheer','주황 독수리 응원왕','uncommon',`${V8}/pe_u_orange_eagle_cheer.webp`,'주황색 응원 나팔을 든 익살스러운 독수리 마스코트 초상화'),

  portrait('pe_r_jade_fan_strategist','옥선 와룡','rare',`${V8}/pe_r_jade_fan_strategist.webp`,'옥 장식과 백우선을 든 냉철한 고대 책사 초상화'),
  portrait('pe_r_crimson_flying_general','적화 비장','rare',`${V8}/pe_r_crimson_flying_general.webp`,'붉은 전포와 방천극을 든 오만한 고대 맹장 초상화'),
  portrait('pe_r_crescent_beard_general','청룡 월아장군','rare',`${V8}/pe_r_crescent_beard_general.webp`,'긴 수염과 청룡 월아도를 지닌 의로운 장군 초상화'),
  portrait('pe_r_roaring_tiger_general','흑철 호장','rare',`${V8}/pe_r_roaring_tiger_general.webp`,'흑철 갑주와 사모를 든 호방한 장군 초상화'),
  portrait('pe_r_silver_spear_dragon','은창의 어린 용','rare',`${V8}/pe_r_silver_spear_dragon.webp`,'은빛 갑주와 장창을 지닌 날렵한 청년 장수 초상화'),

  portrait('pe_e_crimson_reactor_sentinel','진홍 반응로 파수병','epic',`${V8}/pe_e_crimson_reactor_sentinel.webp`,'진홍·황금 나노 갑주와 청색 반응로를 지닌 파수병 초상화'),
  portrait('pe_e_storm_prince_guardian','폭풍 왕자','epic',`${V8}/pe_e_storm_prince_guardian.webp`,'룬 망치와 푸른 번개를 다루는 은발 폭풍 왕자 초상화'),
  portrait('pe_e_dimensional_mystic','차원 비술사','epic',`${V8}/pe_e_dimensional_mystic.webp`,'두 개의 차원 고리를 펼치는 자색 비술사 초상화'),
  portrait('pe_e_crimson_chaos_witch','진홍 혼돈 마녀','epic',`${V8}/pe_e_crimson_chaos_witch.webp`,'진홍 왕관과 두 개의 혼돈 마력구를 지닌 성숙한 마녀 초상화'),

  portrait('pe_l_fallen_frost_prince','빙관의 몰락 왕자','legendary',`${V6}/pe_l_fallen_frost_prince.png`,'서리검과 빙관의 냉기를 두른 몰락 왕자 초상화'),
  portrait('pe_l_tideglass_archmage','파도유리 대마도사','legendary',`${V6}/pe_l_tideglass_archmage.png`,'파도와 얼음 마력을 다루는 대마도사 초상화'),
  portrait('pe_l_ironjaw_warchief','강철턱 대족장','legendary',`${V6}/pe_l_ironjaw_warchief.png`,'거대한 전투도끼와 강철 갑주를 지닌 대족장 초상화'),
  portrait('pe_l_raven_tower_guardian','까마귀탑 수호자','legendary',`${V6}/pe_l_raven_tower_guardian.png`,'까마귀와 비전 지팡이를 거느린 수호자 초상화'),
  portrait('pe_l_netherblade_betrayer','황천쌍날 배신자','legendary',`${V6}/pe_l_netherblade_betrayer.png`,'쌍날과 황천 마력을 지닌 배신자 초상화'),
  portrait('pe_l_dark_ranger_queen','어둠순찰 여왕','legendary',`${V6}/pe_l_dark_ranger_queen.png`,'보랏빛 영혼활을 겨누는 어둠 여왕 초상화'),
  portrait('pe_l_worldsoul_stormcaller','세계혼 폭풍술사','legendary',`${V6}/pe_l_worldsoul_stormcaller.png`,'대지와 폭풍을 결속한 주술사 초상화'),
  portrait('pe_l_felskull_warlock','지옥해골 흑마법사','legendary',`${V6}/pe_l_felskull_warlock.png`,'해골 지팡이와 지옥불을 부리는 흑마법사 초상화'),
  portrait('pe_l_red_dragon_lifequeen','붉은용 생명의 여왕','legendary',`${V6}/pe_l_red_dragon_lifequeen.png`,'붉은 용의 생명 마력을 지닌 여왕 초상화'),
  portrait('pe_l_cataclysm_black_dragon','대격변 흑룡군주','legendary',`${V6}/pe_l_cataclysm_black_dragon.png`,'암흑 균열을 두른 흑룡 군주 초상화'),
]);

export default PROFILE_EMOJI_ITEMS_V6;
