const ROOT = './assets/showroom-v12/card_theme';
const PRICE = Object.freeze({ rare: 880, epic: 1430, legendary: 2200 });

const theme = (id, name, rarity, asset, visual, palette) => Object.freeze({
  id,
  category: 'card_theme',
  name,
  rarity,
  price: null,
  suggestedPrice: PRICE[rarity],
  asset: `${ROOT}/${asset}`,
  cardAssets: { header: `${ROOT}/${asset}` },
  visual,
  palette,
  typography: { effect: 'restrained' },
  implKey: `card_theme:${id}`,
  testOnly: true,
  purchasable: false,
  persistable: false,
  releaseStatus: 'approval_pending',
});

export const CARD_THEME_ITEMS_V12 = Object.freeze([
  theme('ct12_r_rediron_warchief_hall', '붉은철 대족장 전당', 'rare', 'ct12_r_rediron_warchief_hall.webp', '철판과 가죽, 전투 깃발로 완성한 투박한 전쟁 전당', 'rediron'),
  theme('ct12_e_starforged_observatory', '별벼림 관측의회', 'epic', 'ct12_e_starforged_observatory.webp', '천체 기계와 별빛 계기판이 맞물리는 영웅급 관측의회', 'starforged'),
  theme('ct12_m_deepsea_coral_court', '심해 여왕의 산호궁정', 'legendary', 'ct12_m_deepsea_coral_court.webp', '진주와 산호, 심해광이 어우러지는 여왕의 궁정', 'deepsea'),
  theme('ct12_m_storm_lion_hall', '폭풍왕국 사자전당', 'legendary', 'ct12_m_storm_lion_hall.webp', '청금색 왕실 직물과 대리석으로 완성한 사자전당', 'storm'),
  theme('ct12_m_iron_warchief_command', '강철 대족장의 전쟁지휘소', 'legendary', 'ct12_m_iron_warchief_command.webp', '검붉은 강철과 용광로 열기가 응축된 전쟁지휘소', 'iron'),
  theme('ct12_m_tide_admiral_cabin', '파도현자의 제독실', 'legendary', 'ct12_m_tide_admiral_cabin.webp', '남색 목재와 은빛 파도 문양으로 다듬은 제독실', 'tide'),
  theme('ct12_m_moon_priestess_altar', '달의 여사제 은빛제단', 'legendary', 'ct12_m_moon_priestess_altar.webp', '은빛 월광과 고대 숲의 보석으로 빚은 제단', 'moon'),
  theme('ct12_m_dragonfire_council', '용군단 화염의회', 'legendary', 'ct12_m_dragonfire_council.webp', '흑요석과 용비늘, 용암 균열이 감싸는 화염의회', 'dragonfire'),
]);

export default CARD_THEME_ITEMS_V12;
