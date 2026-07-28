export const SHOWROOM_SOURCE_CATEGORIES = Object.freeze({
  wow: Object.freeze({ id: 'wow', label: 'WoW' }),
  marvel: Object.freeze({ id: 'marvel', label: '마블' }),
  kbo: Object.freeze({ id: 'kbo', label: 'KBO' }),
  three_kingdoms: Object.freeze({ id: 'three_kingdoms', label: '삼국지' }),
  other: Object.freeze({ id: 'other', label: '기타' }),
});

const motif = (id, displayName, sourceCategory, fullSet = false) => Object.freeze({
  id,
  displayName,
  sourceCategory,
  fullSet,
  setId: fullSet ? `${id}_set` : null,
  setName: fullSet ? `${displayName} 세트` : null,
});

export const SHOWROOM_MOTIFS = Object.freeze({
  arthas: motif('arthas', '리치 왕', 'wow', true),
  jaina: motif('jaina', '대제독', 'wow', true),
  illidan: motif('illidan', '배신자', 'wow', true),
  sylvanas: motif('sylvanas', '밴시 여왕', 'wow', true),
  garrosh: motif('garrosh', '대족장', 'wow', true),
  medivh: motif('medivh', '수호자', 'wow', true),
  azshara: motif('azshara', '여왕', 'wow', true),
  tyrande: motif('tyrande', '달의 여사제', 'wow'),
  kaelthas: motif('kaelthas', '태양왕', 'wow', true),
  varian: motif('varian', '로고쉬', 'wow'),
  anduin: motif('anduin', '왕자', 'wow'),
  thrall: motif('thrall', '대지 고리회', 'wow'),
  guldan: motif('guldan', '대흑마법사', 'wow'),
  deathwing: motif('deathwing', '파괴자', 'wow'),
  alexstrasza: motif('alexstrasza', '생명의 어머니', 'wow'),

  iron_man: motif('iron_man', '강철 인간', 'marvel', true),
  thor: motif('thor', '천둥의 신', 'marvel', true),
  doctor_strange: motif('doctor_strange', '소서러 슈프림', 'marvel'),
  scarlet_witch: motif('scarlet_witch', '진홍 마녀', 'marvel', true),
  spider_man: motif('spider_man', '거미 인간', 'marvel'),
  black_panther: motif('black_panther', '흑표범', 'marvel'),
  captain_america: motif('captain_america', '미국 대장', 'marvel', true),

  zhuge_liang: motif('zhuge_liang', '와룡', 'three_kingdoms'),
  lu_bu: motif('lu_bu', '비장', 'three_kingdoms'),
  guan_yu: motif('guan_yu', '미염공', 'three_kingdoms'),
  zhao_yun: motif('zhao_yun', '상산', 'three_kingdoms'),

  doosan_main: motif('doosan_main', '철웅이', 'kbo', true),
  doosan_sub: motif('doosan_sub', '망곰이', 'kbo', true),
  lg_main: motif('lg_main', '럭키 & 스타', 'kbo', true),
  lg_sub: motif('lg_sub', '루피', 'kbo', true),
  kia: motif('kia', '호걸이', 'kbo'),
  hanwha: motif('hanwha', '수리', 'kbo'),
});

export const SHOWROOM_FULL_SET_CATEGORIES = Object.freeze([
  'graph_skin',
  'card_theme',
  'ambient_effect',
  'line_style',
  'profile_emoji',
  'emoji_border',
  'point_marker',
]);

const ids = (motifId, values) => values.map(id => [id, motifId]);
const ITEM_MOTIF_PAIRS = [
  ...ids('arthas', ['gs_v4_legendary_01','ct8_legendary_frozen_throne','ae11_m_frozen_crown','ls11_m_frozen_runeblade','pe_l_fallen_frost_prince','eb_l_frozen_oath','pm_l_frozen_runeblade']),
  ...ids('jaina', ['gs12_m_tide_sage_fortress','ct12_m_tide_admiral_cabin','ae12_m_tidal_archmage_blizzard','ls12_m_tidal_archmage_frost','pe_l_tideglass_archmage','pm_l_tidal_archmage']),
  ...ids('illidan', ['gs_v4_legendary_02','ct8_legendary_nether_sanctum','ae11_m_black_sanctuary','ls11_m_nether_twinblade','pe_l_netherblade_betrayer','eb_l_nether_twinblade','pm_l_fel_twinblade']),
  ...ids('sylvanas', ['gs12_m_banshee_black_wall','ct8_l_dark_ranger_requiem','ae11_m_banshee_dirge','ls12_m_domination_chain','pe_l_dark_ranger_queen']),
  ...ids('garrosh', ['gs12_m_iron_warchief_siege','ct12_r_rediron_warchief_hall','ct12_m_iron_warchief_command','ae11_m_iron_warchief','ls12_m_corrupted_ironstar','pe_l_ironjaw_warchief','eb_l_rediron_warchief','pm_l_iron_warchief']),
  ...ids('medivh', ['gs12_m_raven_time_corridor','ct8_l_raven_arcane','ae11_m_raven_arcane','ls12_m_flamewreath_paradox','pe_l_raven_tower_guardian','pm_l_raven_tower']),
  ...ids('azshara', ['gs_v4_epic_03','ct12_m_deepsea_coral_court']),
  ...ids('tyrande', ['gs12_m_moon_priestess_sanctuary','ct12_m_moon_priestess_altar']),
  ...ids('kaelthas', ['gs_v4_epic_01','ct8_l_sun_crystal_regalia','eb_l_sunwell_bloodcrystal']),
  ...ids('varian', ['gs_v4_rare_02','ct12_m_storm_lion_hall','eb_l_storm_lion_gate']),
  ...ids('thrall', ['pe_l_worldsoul_stormcaller']),
  ...ids('guldan', ['pe_l_felskull_warlock']),
  ...ids('deathwing', ['pe_l_cataclysm_black_dragon']),
  ...ids('alexstrasza', ['gs_v4_legendary_03','ct12_m_dragonfire_council','pe_l_red_dragon_lifequeen']),

  ...ids('iron_man', ['ct8_e_crimson_reactor','ct12_e_starforged_observatory','ae11_e_starforged_reactor','ls12_e_starforged_nano','pe_e_crimson_reactor_sentinel','eb_e_crimson_core']),
  ...ids('thor', ['gs12_e_thunder_astral_bridge','ct8_e_storm_guardian','ae11_e_storm_dimension','ls11_e_thunder_current','pe_e_storm_prince_guardian','eb_e_thunder_guard','pm_e_thunder_hammer']),
  ...ids('doctor_strange', ['gs12_e_mirror_sanctum','ct8_e_dimensional_mystic','ls12_e_arcane_seam','pe_e_dimensional_mystic','eb_e_dimensional_sanctum']),
  ...ids('scarlet_witch', ['gs12_e_crimson_reality_garden','ae11_e_crimson_chaos','ls11_e_crimson_chaos','pe_e_crimson_chaos_witch']),
  ...ids('spider_man', ['gs12_e_spider_dimension_city','ct8_e_web_tech','ae11_e_spider_rift','ls12_e_spider_tension','eb_e_web_mobility']),
  ...ids('black_panther', ['gs12_e_vibranium_kingdom','ct8_e_kinetic_alloy','ae11_e_vibranium_guard','eb_e_black_vibration']),

  ...ids('zhuge_liang', ['gs12_r_wolong_formation','ct8_r_wolong_silk','ae11_r_eight_formation','ls11_r_wolong_feather','pe_r_jade_fan_strategist','eb_r_wolong_trigram','pm_r_feather_stratagem']),
  ...ids('lu_bu', ['ct8_r_red_hare_lacquer','pe_r_crimson_flying_general','eb_r_red_hare_armor']),
  ...ids('guan_yu', ['gs12_r_crescent_dragon_shrine','ct8_r_crescent_dragon','ae11_r_crescent_dragon','pe_r_crescent_beard_general','eb_r_crescent_dragon']),
  ...ids('zhao_yun', ['gs12_r_silver_spear_pass','pe_r_silver_spear_dragon']),

  ...ids('doosan_main', ['gs12_u_navy_bear_dugout','ct8_u_bear_dugout','ae11_u_navy_bear_victory','ls11_u_champion_stitch','pe_u_blue_bear_slugger','eb_u_bear_batter','pm_u_bears_signature']),
  ...ids('doosan_sub', ['pe_u_soft_bear_fan','pm_u_softbear_signature']),
  ...ids('lg_main', ['gs12_u_twin_night_stadium','ct8_u_twin_stadium','ae11_u_twin_night_game','pe_u_twin_cheer_pair','eb_u_twin_stadium','pm_u_twins_signature']),
  ...ids('kia', ['gs12_u_tiger_bullpen','ct8_u_tiger_clubhouse','ae11_u_tiger_homerun','pe_u_red_tiger_pitcher','eb_u_tiger_dugout']),
  ...ids('hanwha', ['gs12_u_orange_eagle_skybox','pe_u_orange_eagle_cheer']),
];

export const SHOWROOM_ITEM_MOTIFS = Object.freeze(Object.fromEntries(ITEM_MOTIF_PAIRS));
export const RETIRED_SHOWROOM_ITEM_IDS = Object.freeze(['pe_r_roaring_tiger_general']);

export function showroomTaxonomyFor(item) {
  const motifId = SHOWROOM_ITEM_MOTIFS[item?.id] || null;
  const meta = motifId ? SHOWROOM_MOTIFS[motifId] : null;
  return Object.freeze({
    motifId,
    motifName: meta?.displayName || null,
    sourceCategory: meta?.sourceCategory || 'other',
    setId: meta?.setId || null,
    setName: meta?.setName || null,
    fullSet: Boolean(meta?.fullSet),
  });
}

export function enrichShowroomItem(item) {
  return Object.freeze({ ...item, ...showroomTaxonomyFor(item) });
}

export function showroomFullSets(catalog) {
  return Object.values(SHOWROOM_MOTIFS)
    .filter(entry => entry.fullSet)
    .map(entry => {
      const items = catalog.filter(item => item.setId === entry.setId);
      const categoryMap = Object.fromEntries(SHOWROOM_FULL_SET_CATEGORIES.map(category => [
        category,
        items.filter(item => item.category === category),
      ]));
      const filled = SHOWROOM_FULL_SET_CATEGORIES.filter(category => categoryMap[category].length > 0).length;
      return Object.freeze({ ...entry, items:Object.freeze(items), categoryMap:Object.freeze(categoryMap), filled, total:SHOWROOM_FULL_SET_CATEGORIES.length });
    });
}
