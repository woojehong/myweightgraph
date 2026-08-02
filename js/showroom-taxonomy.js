export const SHOWROOM_SOURCE_CATEGORIES = Object.freeze({
  wow: Object.freeze({ id: 'wow', label: 'WoW' }),
  marvel: Object.freeze({ id: 'marvel', label: '마블' }),
  kbo: Object.freeze({ id: 'kbo', label: 'KBO' }),
  esports: Object.freeze({ id: 'esports', label: 'e스포츠' }),
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

  daesanghyeok: motif('daesanghyeok', '대상혁', 'esports', true),
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

// A preset must be deterministic even when a motif gains alternate items in the
// same category. These are the approved "one-click set" members, not whichever
// catalog item happens to be declared first.
export const SHOWROOM_CANONICAL_SET_ITEMS = Object.freeze({
  arthas:Object.freeze(['gs_v4_legendary_01','ct8_legendary_frozen_throne','ae11_m_frozen_crown','ls11_m_frozen_runeblade','pe_l_fallen_frost_prince','eb_l_frozen_oath','pm_l_frozen_runeblade']),
  jaina:Object.freeze(['gs12_m_tide_sage_fortress','ct12_m_tide_admiral_cabin','ae12_m_tidal_archmage_blizzard','ls12_m_tidal_archmage_frost','pe_l_tideglass_archmage','eb13_m_tide_admiral','pm_l_tidal_archmage']),
  illidan:Object.freeze(['gs_v4_legendary_02','ct8_legendary_nether_sanctum','ae11_m_black_sanctuary','ls11_m_nether_twinblade','pe_l_netherblade_betrayer','eb_l_nether_twinblade','pm_l_fel_twinblade']),
  sylvanas:Object.freeze(['gs12_m_banshee_black_wall','ct8_l_dark_ranger_requiem','ae11_m_banshee_dirge','ls12_m_domination_chain','pe_l_dark_ranger_queen','eb13_m_banshee_valkyr','pm13_m_banshee_arrow']),
  garrosh:Object.freeze(['gs12_m_iron_warchief_siege','ct12_m_iron_warchief_command','ae11_m_iron_warchief','ls12_m_corrupted_ironstar','pe_l_ironjaw_warchief','eb_l_rediron_warchief','pm_l_iron_warchief']),
  medivh:Object.freeze(['gs12_m_raven_time_corridor','ct8_l_raven_arcane','ae11_m_raven_arcane','ls12_m_flamewreath_paradox','pe_l_raven_tower_guardian','eb13_m_raven_timegate','pm_l_raven_tower']),
  azshara:Object.freeze(['gs_v4_epic_03','ct12_m_deepsea_coral_court','ae13_m_azshara_maelstrom','ls13_m_azshara_tide','pe13_m_tideborn_queen','eb13_m_azshara_coral','pm13_m_azshara_tiara']),
  kaelthas:Object.freeze(['gs_v4_epic_01','ct8_l_sun_crystal_regalia','ae13_m_sunwell_phoenix','ls13_m_sunwell_phoenix','pe13_m_sunwell_prince','eb_l_sunwell_bloodcrystal','pm13_m_sunwell_orb']),
  iron_man:Object.freeze(['gs13_e_arc_reactor_hangar','ct8_e_crimson_reactor','ae11_e_starforged_reactor','ls12_e_starforged_nano','pe_e_crimson_reactor_sentinel','eb_e_crimson_core','pm13_e_arc_reactor']),
  thor:Object.freeze(['gs12_e_thunder_astral_bridge','ct8_e_storm_guardian','ae11_e_storm_dimension','ls11_e_thunder_current','pe_e_storm_prince_guardian','eb_e_thunder_guard','pm_e_thunder_hammer']),
  scarlet_witch:Object.freeze(['gs12_e_crimson_reality_garden','ct13_e_crimson_hex_chamber','ae11_e_crimson_chaos','ls11_e_crimson_chaos','pe_e_crimson_chaos_witch','eb13_e_crimson_hex','pm13_e_crimson_hex']),
  captain_america:Object.freeze(['gs13_e_star_shield_command','ct13_e_star_shield_bastion','ae13_e_star_shield_salute','ls13_e_star_shield_rally','pe13_e_star_shield_captain','eb13_e_star_shield','pm13_e_star_shield']),
  doosan_main:Object.freeze(['gs12_u_navy_bear_dugout','ct8_u_bear_dugout','ae11_u_navy_bear_victory','ls11_u_champion_stitch','pe_u_blue_bear_slugger','eb_u_bear_batter','pm_u_bears_signature']),
  doosan_sub:Object.freeze(['gs13_u_softbear_ballpark','ct13_u_softbear_dugout','ae13_u_softbear_cheer','ls13_u_softbear_stitch','pe_u_soft_bear_fan','eb13_u_softbear','pm_u_softbear_signature']),
  lg_main:Object.freeze(['gs12_u_twin_night_stadium','ct8_u_twin_stadium','ae11_u_twin_night_game','ls13_u_twins_pinstripe','pe_u_twin_cheer_pair','eb_u_twin_stadium','pm_u_twins_signature']),
  lg_sub:Object.freeze(['gs13_u_loopy_twins_party','ct13_u_loopy_cheer_lounge','ae13_u_loopy_party','ls13_u_loopy_bounce','pe13_u_loopy_cheer','eb13_u_loopy','pm13_u_loopy_cheer']),
  daesanghyeok:Object.freeze(['gs14_l_daesanghyeok_stage','ct14_l_daesanghyeok_goat','ae14_l_daesanghyeok_dynasty','ls14_l_daesanghyeok_legacy','pe14_l_daesanghyeok','eb14_l_daesanghyeok_hall','pm14_l_daesanghyeok_crown']),
});

const ids = (motifId, values) => values.map(id => [id, motifId]);
const ITEM_MOTIF_PAIRS = [
  ...ids('arthas', ['gs_v4_legendary_01','ct8_legendary_frozen_throne','ae11_m_frozen_crown','ls11_m_frozen_runeblade','pe_l_fallen_frost_prince','eb_l_frozen_oath','pm_l_frozen_runeblade']),
  ...ids('jaina', ['gs12_m_tide_sage_fortress','ct12_m_tide_admiral_cabin','ae12_m_tidal_archmage_blizzard','ls12_m_tidal_archmage_frost','pe_l_tideglass_archmage','eb13_m_tide_admiral','pm_l_tidal_archmage']),
  ...ids('illidan', ['gs_v4_legendary_02','ct8_legendary_nether_sanctum','ae11_m_black_sanctuary','ls11_m_nether_twinblade','pe_l_netherblade_betrayer','eb_l_nether_twinblade','pm_l_fel_twinblade']),
  ...ids('sylvanas', ['gs12_m_banshee_black_wall','ct8_l_dark_ranger_requiem','ae11_m_banshee_dirge','ls12_m_domination_chain','pe_l_dark_ranger_queen','eb13_m_banshee_valkyr','pm13_m_banshee_arrow']),
  ...ids('garrosh', ['gs12_m_iron_warchief_siege','ct12_r_rediron_warchief_hall','ct12_m_iron_warchief_command','ae11_m_iron_warchief','ls12_m_corrupted_ironstar','pe_l_ironjaw_warchief','eb_l_rediron_warchief','pm_l_iron_warchief']),
  ...ids('medivh', ['gs12_m_raven_time_corridor','ct8_l_raven_arcane','ae11_m_raven_arcane','ls12_m_flamewreath_paradox','pe_l_raven_tower_guardian','eb13_m_raven_timegate','pm_l_raven_tower']),
  ...ids('azshara', ['gs_v4_epic_03','ct12_m_deepsea_coral_court','ae13_m_azshara_maelstrom','ls13_m_azshara_tide','pe13_m_tideborn_queen','eb13_m_azshara_coral','pm13_m_azshara_tiara']),
  ...ids('tyrande', ['gs12_m_moon_priestess_sanctuary','ct12_m_moon_priestess_altar']),
  ...ids('kaelthas', ['gs_v4_epic_01','ct8_l_sun_crystal_regalia','ae13_m_sunwell_phoenix','ls13_m_sunwell_phoenix','pe13_m_sunwell_prince','eb_l_sunwell_bloodcrystal','pm13_m_sunwell_orb']),
  ...ids('varian', ['gs_v4_rare_02','ct12_m_storm_lion_hall','eb_l_storm_lion_gate']),
  ...ids('thrall', ['pe_l_worldsoul_stormcaller']),
  ...ids('guldan', ['pe_l_felskull_warlock']),
  ...ids('deathwing', ['pe_l_cataclysm_black_dragon']),
  ...ids('alexstrasza', ['gs_v4_legendary_03','ct12_m_dragonfire_council','pe_l_red_dragon_lifequeen']),

  ...ids('iron_man', ['gs13_e_arc_reactor_hangar','ct8_e_crimson_reactor','ct12_e_starforged_observatory','ae11_e_starforged_reactor','ls12_e_starforged_nano','pe_e_crimson_reactor_sentinel','eb_e_crimson_core','pm13_e_arc_reactor']),
  ...ids('thor', ['gs12_e_thunder_astral_bridge','ct8_e_storm_guardian','ae11_e_storm_dimension','ls11_e_thunder_current','pe_e_storm_prince_guardian','eb_e_thunder_guard','pm_e_thunder_hammer']),
  ...ids('doctor_strange', ['gs12_e_mirror_sanctum','ct8_e_dimensional_mystic','ls12_e_arcane_seam','pe_e_dimensional_mystic','eb_e_dimensional_sanctum']),
  ...ids('scarlet_witch', ['gs12_e_crimson_reality_garden','ct13_e_crimson_hex_chamber','ae11_e_crimson_chaos','ls11_e_crimson_chaos','pe_e_crimson_chaos_witch','eb13_e_crimson_hex','pm13_e_crimson_hex']),
  ...ids('captain_america', ['gs13_e_star_shield_command','ct13_e_star_shield_bastion','ae13_e_star_shield_salute','ls13_e_star_shield_rally','pe13_e_star_shield_captain','eb13_e_star_shield','pm13_e_star_shield']),
  ...ids('spider_man', ['gs12_e_spider_dimension_city','ct8_e_web_tech','ae11_e_spider_rift','ls12_e_spider_tension','eb_e_web_mobility']),
  ...ids('black_panther', ['gs12_e_vibranium_kingdom','ct8_e_kinetic_alloy','ae11_e_vibranium_guard','eb_e_black_vibration']),

  ...ids('zhuge_liang', ['gs12_r_wolong_formation','ct8_r_wolong_silk','ae11_r_eight_formation','ls11_r_wolong_feather','pe_r_jade_fan_strategist','eb_r_wolong_trigram','pm_r_feather_stratagem']),
  ...ids('lu_bu', ['ct8_r_red_hare_lacquer','pe_r_crimson_flying_general','eb_r_red_hare_armor']),
  ...ids('guan_yu', ['gs12_r_crescent_dragon_shrine','ct8_r_crescent_dragon','ae11_r_crescent_dragon','pe_r_crescent_beard_general','eb_r_crescent_dragon']),
  ...ids('zhao_yun', ['gs12_r_silver_spear_pass','pe_r_silver_spear_dragon']),

  ...ids('doosan_main', ['gs12_u_navy_bear_dugout','ct8_u_bear_dugout','ae11_u_navy_bear_victory','ls11_u_champion_stitch','pe_u_blue_bear_slugger','eb_u_bear_batter','pm_u_bears_signature']),
  ...ids('doosan_sub', ['gs13_u_softbear_ballpark','ct13_u_softbear_dugout','ae13_u_softbear_cheer','ls13_u_softbear_stitch','pe_u_soft_bear_fan','eb13_u_softbear','pm_u_softbear_signature']),
  ...ids('lg_main', ['gs12_u_twin_night_stadium','ct8_u_twin_stadium','ae11_u_twin_night_game','ls13_u_twins_pinstripe','pe_u_twin_cheer_pair','eb_u_twin_stadium','pm_u_twins_signature']),
  ...ids('lg_sub', ['gs13_u_loopy_twins_party','ct13_u_loopy_cheer_lounge','ae13_u_loopy_party','ls13_u_loopy_bounce','pe13_u_loopy_cheer','eb13_u_loopy','pm13_u_loopy_cheer']),
  ...ids('kia', ['gs12_u_tiger_bullpen','ct8_u_tiger_clubhouse','ae11_u_tiger_homerun','pe_u_red_tiger_pitcher','eb_u_tiger_dugout']),
  ...ids('hanwha', ['gs12_u_orange_eagle_skybox','pe_u_orange_eagle_cheer']),

  ...ids('daesanghyeok', ['gs14_l_daesanghyeok_stage','ct14_l_daesanghyeok_goat','ae14_l_daesanghyeok_dynasty','ls14_l_daesanghyeok_legacy','pe14_l_daesanghyeok','eb14_l_daesanghyeok_hall','pm14_l_daesanghyeok_crown']),
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

const SHOWROOM_SET_RARITY_ORDER=Object.freeze([
  'artifact','legendary','transcendent','mythic','epic','rare','uncommon','common',
]);
const showroomSetRarityRank=rarity=>{
  const rank=SHOWROOM_SET_RARITY_ORDER.indexOf(rarity);
  return rank<0?SHOWROOM_SET_RARITY_ORDER.length:rank;
};

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
      const approved=SHOWROOM_CANONICAL_SET_ITEMS[entry.id]||[];
      const presetMap=Object.fromEntries(SHOWROOM_FULL_SET_CATEGORIES.map((category,index)=>{
        const expectedId=approved[index];
        return [category,categoryMap[category].find(item=>item.id===expectedId)||categoryMap[category][0]||null];
      }));
      const rarity=Object.values(presetMap).filter(Boolean)
        .map(item=>item.rarity).sort((a,b)=>showroomSetRarityRank(a)-showroomSetRarityRank(b))[0]||'common';
      return Object.freeze({ ...entry, rarity, items:Object.freeze(items), categoryMap:Object.freeze(categoryMap), presetMap:Object.freeze(presetMap), filled, total:SHOWROOM_FULL_SET_CATEGORIES.length });
    })
    .sort((a,b)=>showroomSetRarityRank(a.rarity)-showroomSetRarityRank(b.rarity));
}
