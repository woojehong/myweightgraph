const ROOT = './assets/showroom-v4/card_theme';

const theme = ({ id, name, rarity, price, slug, pairedGraphSkin, visual, typography }) => Object.freeze({
  id,
  category: 'card_theme',
  name,
  rarity,
  price,
  asset: `${ROOT}/${slug}_header.png`,
  cardAssets: Object.freeze({
    header: `${ROOT}/${slug}_header.png`,
    max: `${ROOT}/${slug}_max.png`,
    min: `${ROOT}/${slug}_min.png`,
    current: `${ROOT}/${slug}_current.png`,
  }),
  pairedGraphSkin,
  visual,
  typography: Object.freeze(typography),
  qualityTier: {
    uncommon: 'quality_1',
    rare: 'quality_2',
    epic: 'quality_3',
    legendary: 'quality_4',
  }[rarity],
  implKey: `card_theme:${id}`,
  testOnly: false,
  purchasable: true,
  persistable: true,
});

export const CARD_THEME_ITEMS = Object.freeze([
  theme({
    id: 'ct4_uncommon_iron_outpost', name: '철갑 전초기지', rarity: 'uncommon', price: 600,
    slug: 'ct4_uncommon_iron_outpost', pairedGraphSkin: 'gs_v4_uncommon_01',
    visual: '흑철과 황동 리벳으로 두른 전초기지 헤더·측정 배지 세트',
    typography: { family: 'Trebuchet MS', effect: 'iron-emboss', weight: 800 },
  }),
  theme({
    id: 'ct4_uncommon_golden_tavern', name: '황금 여관', rarity: 'uncommon', price: 600,
    slug: 'ct4_uncommon_golden_tavern', pairedGraphSkin: 'gs_v4_uncommon_02',
    visual: '등불과 짙은 목재로 마감한 아늑한 여관 헤더·측정 배지 세트',
    typography: { family: 'Georgia', effect: 'tavern-warmth', weight: 700 },
  }),
  theme({
    id: 'ct4_uncommon_desert_caravan', name: '사막 유랑단', rarity: 'uncommon', price: 600,
    slug: 'ct4_uncommon_desert_caravan', pairedGraphSkin: 'gs_v4_uncommon_03',
    visual: '붉은 가죽끈과 황동 버클을 엮은 유랑단 헤더·측정 배지 세트',
    typography: { family: 'Palatino Linotype', effect: 'desert-carve', weight: 700 },
  }),
  theme({
    id: 'ct4_rare_worldtree_grove', name: '세계수 성소', rarity: 'rare', price: 1200,
    slug: 'ct4_rare_worldtree_grove', pairedGraphSkin: 'gs_v4_rare_01',
    visual: '달빛 이파리와 살아 있는 덩굴로 엮은 세계수 헤더·측정 배지 세트',
    typography: { family: 'Georgia', effect: 'worldtree-bloom', weight: 800 },
  }),
  theme({
    id: 'ct4_rare_storm_kingdom', name: '폭풍 왕국', rarity: 'rare', price: 1200,
    slug: 'ct4_rare_storm_kingdom', pairedGraphSkin: 'gs_v4_rare_02',
    visual: '백색 성벽과 청금 문장을 세운 왕국 헤더·측정 배지 세트',
    typography: { family: 'Georgia', effect: 'storm-banner', weight: 800 },
  }),
  theme({
    id: 'ct4_rare_red_iron_fortress', name: '붉은 철성', rarity: 'rare', price: 1200,
    slug: 'ct4_rare_red_iron_fortress', pairedGraphSkin: 'gs_v4_rare_03',
    visual: '붉은 목재와 거친 철편을 가죽끈으로 묶은 요새 헤더·측정 배지 세트',
    typography: { family: 'Arial Black', effect: 'warpaint-cut', weight: 900 },
  }),
  theme({
    id: 'ct4_epic_silvermoon_court', name: '은빛달 궁정', rarity: 'epic', price: 2400,
    slug: 'ct4_epic_silvermoon_court', pairedGraphSkin: 'gs_v4_epic_01',
    visual: '상아빛 첨탑과 붉은 보석, 금빛 마력을 두른 궁정 헤더·측정 배지 세트',
    typography: { family: 'Palatino Linotype', effect: 'silvermoon-arcane', weight: 800 },
  }),
  theme({
    id: 'ct4_epic_deepsea_throne', name: '심해 왕좌', rarity: 'epic', price: 2400,
    slug: 'ct4_epic_deepsea_throne', pairedGraphSkin: 'gs_v4_epic_02',
    visual: '진주 금속과 심해 산호, 청록 수정으로 세운 왕좌 헤더·측정 배지 세트',
    typography: { family: 'Georgia', effect: 'deepsea-current', weight: 800 },
  }),
  theme({
    id: 'ct4_epic_astral_observatory', name: '별빛 관측소', rarity: 'epic', price: 2400,
    slug: 'ct4_epic_astral_observatory', pairedGraphSkin: 'gs_v4_epic_03',
    visual: '천체환과 남청 보석을 정밀하게 조립한 관측소 헤더·측정 배지 세트',
    typography: { family: 'Trebuchet MS', effect: 'astral-orbit', weight: 800 },
  }),
  theme({
    id: 'ct4_legendary_frozen_crown', name: '얼어붙은 왕관', rarity: 'legendary', price: 4800,
    slug: 'ct4_legendary_frozen_crown', pairedGraphSkin: 'gs_v4_legendary_01',
    visual: '룬 얼음과 왕관 결정을 겹겹이 세공한 전설 헤더·측정 배지 세트',
    typography: { family: 'Georgia', effect: 'frozen-crown', weight: 900 },
  }),
  theme({
    id: 'ct4_legendary_nether_sanctum', name: '황천 성소', rarity: 'legendary', price: 4800,
    slug: 'ct4_legendary_nether_sanctum', pairedGraphSkin: 'gs_v4_legendary_02',
    visual: '검은 첨탑과 비취빛 황천 균열을 새긴 전설 헤더·측정 배지 세트',
    typography: { family: 'Palatino Linotype', effect: 'nether-pulse', weight: 900 },
  }),
  theme({
    id: 'ct4_legendary_dragonfire_cataclysm', name: '용불꽃 대격변', rarity: 'legendary', price: 4800,
    slug: 'ct4_legendary_dragonfire_cataclysm', pairedGraphSkin: 'gs_v4_legendary_03',
    visual: '흑요석 용날개와 살아 움직이는 용암을 결합한 전설 헤더·측정 배지 세트',
    typography: { family: 'Arial Black', effect: 'dragonfire-flare', weight: 900 },
  }),
]);

export default CARD_THEME_ITEMS;
