const legendaryProfile = (id, name, file, visual) => Object.freeze({
  id,
  category: 'profile_emoji',
  name,
  rarity: 'legendary',
  price: 1200,
  asset: `./assets/showroom-v6/profile_emoji/${file}`,
  visual,
  implKey: `profile_emoji:${id}`,
  testOnly: false,
  purchasable: true,
  persistable: true,
});

export const PROFILE_EMOJI_ITEMS_V6 = Object.freeze([
  legendaryProfile('pe_l_fallen_frost_prince', '빙관의 타락왕자', 'pe_l_fallen_frost_prince.png', '서리 검과 빙관을 두른 타락한 왕자의 수집형 초상'),
  legendaryProfile('pe_l_tideglass_archmage', '파도유리 대마도사', 'pe_l_tideglass_archmage.png', '파도와 얼음 마력을 다루는 백금발 대마도사의 수집형 초상'),
  legendaryProfile('pe_l_ironjaw_warchief', '강철턱 대족장', 'pe_l_ironjaw_warchief.png', '거대한 전투도끼와 강철 갑주를 지닌 대족장의 수집형 초상'),
  legendaryProfile('pe_l_raven_tower_guardian', '까마귀탑의 수호자', 'pe_l_raven_tower_guardian.png', '까마귀와 비전 지팡이를 거느린 수호자의 수집형 초상'),
  legendaryProfile('pe_l_netherblade_betrayer', '황천칼날 배신자', 'pe_l_netherblade_betrayer.png', '쌍날과 지옥 마력을 품은 황천 전사의 수집형 초상'),
  legendaryProfile('pe_l_dark_ranger_queen', '어둠순찰 여왕', 'pe_l_dark_ranger_queen.png', '보랏빛 영혼 활을 겨누는 어둠 여왕의 수집형 초상'),
  legendaryProfile('pe_l_worldsoul_stormcaller', '세계혼 폭풍술사', 'pe_l_worldsoul_stormcaller.png', '망치에 대지와 폭풍을 결속한 주술사의 수집형 초상'),
  legendaryProfile('pe_l_felskull_warlock', '지옥해골 흑마도사', 'pe_l_felskull_warlock.png', '해골 지팡이와 지옥불을 부리는 흑마도사의 수집형 초상'),
  legendaryProfile('pe_l_red_dragon_lifequeen', '붉은용 생명의 여왕', 'pe_l_red_dragon_lifequeen.png', '붉은 용의 생명 마력을 품은 여왕의 수집형 초상'),
  legendaryProfile('pe_l_cataclysm_black_dragon', '대격변의 흑룡군주', 'pe_l_cataclysm_black_dragon.png', '용암 균열이 흐르는 흑룡 군주의 수집형 초상'),
]);

