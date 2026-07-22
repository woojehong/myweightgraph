import { SHOWROOM_V4_RUNTIME } from './showroom-catalog-v4.generated.js';
import { GRAPH_SKIN_ITEMS } from './showroom-graph-skins.js';
import { CARD_THEME_ITEMS } from './showroom-card-themes.js';
import { LINE_STYLE_ITEMS, AMBIENT_EFFECT_ITEMS } from './showroom-fx.js';

// Maweg showroom catalog: V4 fully replaces V3 only after a validated 108-item runtime module exists.
const item = (category, id, name, rarity, price, asset, visual) => Object.freeze({
  id, category, name, rarity, price, asset, visual, implKey:`${category}:${id}`,
  testOnly:true, purchasable:false,
  ...(category==='trophy'?{acquisition:'achievement_only'}:{}),
});

const specs = Object.freeze({
  graph_skin: [
    ['gs_explorer_parchment','탐험가의 양피지','uncommon',500,'webp','지도와 황동 장식이 둘러싼 탐험가의 그래프'],
    ['gs_frost_runestone','서리 룬석','rare',1000,'webp','푸른 서리와 룬 문양이 새겨진 돌판'],
    ['gs_dragonbone_slab','용골 석판','epic',1800,'webp','고대 용의 뼈가 감싼 흑요석 판'],
    ['gs_cosmic_timekeeper','우주 시계판','legendary',3500,'webp','황금 천체 장치가 움직이는 별빛 판'],
  ],
  line_style: [],
  card_theme: [
    ['ct_alpine_dawn','설산의 여명','uncommon',500,'webp','새벽 설산이 펼쳐지는 카드 테마'],
    ['ct_sunken_temple','침몰한 신전','rare',1000,'webp','심해 유적과 푸른 빛의 카드 테마'],
    ['ct_moonlit_grove','달빛 숲','epic',1800,'webp','고목과 달빛 폭포가 둘러싼 카드 테마'],
    ['ct_cosmic_observatory','우주 관측소','legendary',3500,'webp','행성과 성운이 보이는 황금 관측소'],
  ],
  point_marker: [
    ['pm_expedition_compass','원정 나침반','uncommon',500,'png','원정대를 안내하는 황동 나침반'],
    ['pm_moon_crystal','달빛 수정','rare',1000,'png','은빛 달빛이 맺힌 푸른 수정'],
    ['pm_watcher_eye','감시자의 눈','epic',1800,'png','변화를 놓치지 않는 신비한 눈'],
    ['pm_phoenix_seal','불사조 인장','legendary',3500,'png','불사조 불꽃이 새겨진 황금 인장'],
  ],
  companion: [
    ['cp_sleepy_golem','졸린 골렘','common',200,'png','그래프 곁을 지키는 작은 돌 골렘'],
    ['cp_candle_wisp','촛불 위습','common',220,'png','따뜻한 불빛을 품은 꼬마 위습'],
    ['cp_satchel_mimic','주머니 미믹','common',240,'png','짐가방으로 위장한 장난꾸러기 미믹'],
    ['cp_lantern_moth','등불 나방','common',260,'png','은은하게 빛나는 밤의 나방'],
  ],
  ambient_effect: [
    ['ae_forest_breath','숲의 숨결','uncommon',500,'webp','잎과 반딧불이 감도는 숲의 기운'],
    ['ae_deep_caustics','심해 빛물결','rare',1000,'webp','물결빛과 기포가 흐르는 심해의 기운'],
    ['ae_dimensional_breach','차원 균열','epic',1800,'webp','보랏빛 에너지가 일렁이는 차원의 틈'],
    ['ae_ancient_dragon','고대룡의 그림자','legendary',3500,'webp','구름 사이 고대룡이 드리운 장엄한 기운'],
  ],
  trophy: [
    ['tr_summit_compass','정상 나침반','uncommon',500,'png','정상에 오른 원정대의 나침반'],
    ['tr_sea_chalice','바다 성배','rare',1000,'png','심해의 빛을 품은 푸른 성배'],
    ['tr_giant_horn','거인 뿔','epic',1800,'png','거인 사냥의 증표로 남은 뿔'],
    ['tr_cosmic_goblet','우주 고블릿','legendary',3500,'png','별빛과 행성을 담은 황금 고블릿'],
  ],
  profile_emoji: [
    ['pe_archive_spirit','기록보관소 정령','uncommon',500,'png','기록을 지키는 푸른 정령'],
    ['pe_forest_goblin','숲 고블린','rare',1000,'png','모험을 좋아하는 숲의 고블린'],
    ['pe_dragonblood','용혈 전사','epic',1800,'png','용의 힘을 이어받은 붉은 전사'],
    ['pe_celestial_oracle','천상의 예언자','legendary',3500,'png','별의 흐름을 읽는 천상의 예언자'],
  ],
  emoji_border: [
    ['eb_forged_iron','단조 철테','uncommon',500,'png','묵직하게 벼린 철제 프로필 테두리'],
    ['eb_worldroot','세계수 테두리','rare',1000,'png','잎과 뿌리가 자라난 세계수 테두리'],
    ['eb_giant_hunter','거인 사냥꾼','epic',1800,'png','거인의 뿔과 룬으로 만든 테두리'],
    ['eb_twin_dragon','쌍룡 고리','legendary',3500,'png','두 마리 용이 보석을 감싼 황금 고리'],
  ],
});

export const SHOWROOM_CATEGORIES = Object.freeze(Object.keys(specs));
export const SHOWROOM_DEFAULTS = Object.freeze({
  graph_skin:null, line_style:null, card_theme:null, point_marker:null, companion:null,
  ambient_effect:null, trophy:[], profile_emoji:null, emoji_border:null,
});

const SHOWROOM_CATALOG_V3_FALLBACK = Object.freeze(SHOWROOM_CATEGORIES.flatMap(category =>
  specs[category].map(([id,name,rarity,price,ext,visual]) => item(
    category,id,name,rarity,price,`./assets/showroom-v3/${category}/${id}.${ext}`,visual,
  )),
));
// 코드 네이티브 범주: 이미지 에셋 없이 renderSpec으로 그린다.
export const CODE_NATIVE_CATEGORIES = Object.freeze(['line_style','ambient_effect']);
const isCodeNative = category => CODE_NATIVE_CATEGORIES.includes(category);
// 생성 파일(showroom-catalog-v4.generated.js)은 GPT 스크립트가 덮어쓰므로 건드리지 않고 여기서 병합한다.
const v4Items=[
  ...(Array.isArray(SHOWROOM_V4_RUNTIME?.items)?SHOWROOM_V4_RUNTIME.items.filter(entry=>entry.category!=='graph_skin'):[]),
  ...GRAPH_SKIN_ITEMS,
  ...CARD_THEME_ITEMS,
  ...LINE_STYLE_ITEMS, ...AMBIENT_EFFECT_ITEMS,
].filter((item,i,arr)=>arr.findIndex(x=>x.id===item.id)===i);
// v4 승격 조건: 12개 이상 & 4등급 균등(4의 배수)
const completeV4Category=category=>{const entries=v4Items.filter(item=>item.category===category);return entries.length>=12&&entries.length%4===0&&entries.every(item=>(isCodeNative(category)?item.asset===null&&item.renderSpec:item.asset?.startsWith(`./assets/showroom-v4/${category}/`)))};
export const SHOWROOM_V4_ACTIVE_CATEGORIES=Object.freeze(SHOWROOM_CATEGORIES.filter(completeV4Category));
export const SHOWROOM_CATALOG_VERSION=SHOWROOM_V4_ACTIVE_CATEGORIES.length?`v4-mixed:${SHOWROOM_V4_ACTIVE_CATEGORIES.join(',')}`:'v3-fallback';
// ── 가격 정책 ────────────────────────────────────────────────────────────
// 가격 = 등급 기본가 × 카테고리 비중(화면 지배력). 10원 단위 반올림.
// 하루 최대 획득 44점 / 3,000점 ≈ 70일 기준으로 잡았다.
//   주역(1.5): 그래프스킨·공간효과   기본(1.0): 그래프선·카드테마·프로필초상
//   악센트(0.6): 포인트마커·이모티콘테두리·동반자   트로피: 업적 전용(판매 안 함)
export const CATEGORY_PRICE_WEIGHT = Object.freeze({
  graph_skin:1.5, ambient_effect:1.5,
  line_style:1.0, card_theme:1.0, profile_emoji:1.0,
  point_marker:0.6, emoji_border:0.6, companion:0.6,
  trophy:null,
});
export const RARITY_BASE_PRICE = Object.freeze({
  common:80, uncommon:120, rare:260, epic:550, legendary:1100,
});
export function showroomPriceOf(category, rarity){
  const w = CATEGORY_PRICE_WEIGHT[category];
  if (w == null) return null;                       // 트로피 = 비매품
  const base = RARITY_BASE_PRICE[rarity] ?? 120;
  return Math.round(base * w / 10) * 10;
}
// 테스트 잠금 해제 + 가격 부여 (생성 파일을 수정하지 않고 조립 시점에 적용)
const retail = entry => {
  if (entry.category === 'trophy')
    return Object.freeze({ ...entry, price:null, purchasable:false, testOnly:false,
                           persistable:true, acquisition:'achievement_only' });
  return Object.freeze({ ...entry, price: showroomPriceOf(entry.category, entry.rarity),
                         purchasable:true, testOnly:false, persistable:true });
};

// These ids existed as released, purchasable effects before the code-native
// ambient catalog replaced the image catalog. Keep their commercial contract
// (including saveability) while all genuinely new ambient effects stay staged.
export const GRANDFATHERED_RELEASED_ITEM_IDS = Object.freeze([
  'ae_dust','ae_firefly','ae_bubble','ae_thunder',
]);
const grandfatheredReleasedIds = new Set(GRANDFATHERED_RELEASED_ITEM_IDS);

export const SHOWROOM_CATALOG_V2=Object.freeze(SHOWROOM_CATEGORIES.flatMap(category=>{
  const staged=completeV4Category(category);
  const entries=staged?v4Items.filter(item=>item.category===category):SHOWROOM_CATALOG_V3_FALLBACK.filter(item=>item.category===category);
  return staged?entries.map(entry=>grandfatheredReleasedIds.has(entry.id)?retail(entry):entry):entries.map(retail);
}));

// Exact V2 ids are retained only as a compatibility index. They are not active catalog entries.
const LEGACY_IDS_BY_CATEGORY = Object.freeze({
  graph_skin:['gs_ink_grid','gs_slate_lines','gs_mint_trace','gs_ember_ticks','gs_moon_paper','gs_frost_panel','gs_moss_map','gs_copper_rule','gs_crystal_grid','gs_aurora_band','gs_rune_axis','gs_lava_fault','gs_tidal_chart','gs_sunstone','gs_night_forest','gs_void_lattice','gs_storm_scope','gs_dragon_glass','gs_celestial_map','gs_arcane_prism','gs_iron_citadel','gs_phoenix_wake','gs_leviathan_depth','gs_worldroot','gs_thunder_throne','gs_eclipse_dial','gs_astral_forge','gs_primordial_sea','gs_crimson_cataclysm','gs_crown_of_dawn'],
  line_style:[],
  card_theme:['ct_dark_canvas','ct_field_leather','ct_silver_plate','ct_oak_board','ct_mist_glass','ct_desert_cloth','ct_moss_stone','ct_navy_banner','ct_emerald_lodge','ct_frost_keep','ct_ember_forge','ct_arcane_archive','ct_tidal_shell','ct_sun_temple','ct_wild_hunt','ct_obsidian_gate','ct_storm_bastion','ct_crystal_palace','ct_moonlit_crypt','ct_drake_aerie','ct_clockwork_hall','ct_phoenix_court','ct_abyssal_sanctum','ct_world_tree_hall','ct_celestial_citadel','ct_eclipse_chamber','ct_astral_throne','ct_eternal_forge','ct_primordial_grove','ct_dawn_sovereign'],
  point_marker:['pm_ring','pm_diamond','pm_shield','pm_arrow','pm_hex','pm_leaf','pm_drop','pm_spark','pm_rune_disc','pm_ice_shard','pm_ember_core','pm_gear','pm_moon','pm_claw','pm_wing','pm_prism','pm_storm_eye','pm_drake_scale','pm_sun_seal','pm_void_orb','pm_crown','pm_phoenix_feather','pm_leviathan_eye','pm_worldroot_seed','pm_thunder_hammer','pm_eclipse','pm_astral_compass','pm_eternal_flame','pm_primordial_eye','pm_dawn_relic'],
  companion:['cp_firefly','cp_scroll','cp_moss_slime','cp_cave_bat','cp_camp_owl','cp_spring_sprite','cp_brass_beetle','cp_grumpy_cloud'],
  ambient_effect:['ae_dust','ae_mist','ae_leaf','ae_ash','ae_bubble','ae_snow','ae_firefly','ae_workshop_spark','ae_blue_rain','ae_moon_petal','ae_ember','ae_frost_breath','ae_rune','ae_wind','ae_forest_spore','ae_crystal','ae_storm_flash','ae_starlight','ae_gold_sand','ae_void','ae_gear_march','ae_phoenix_featherfall','ae_abyss','ae_life_pulse','ae_thunder','ae_eclipse_corona','ae_astral','ae_eternal_flame','ae_primordial_storm','ae_dawn_blessing'],
  trophy:['tr_wood_medal','tr_iron_badge','tr_copper_cup','tr_scout_pin','tr_leaf_wreath','tr_wave_shell','tr_ember_token','tr_moon_pin','tr_silver_chalice','tr_frost_medal','tr_hunter_horn','tr_arcane_tablet','tr_sun_disc','tr_storm_pin','tr_grove_crown','tr_crystal_cup','tr_drake_emblem','tr_void_orb','tr_clockwork_laurel','tr_celestial_astrolabe','tr_obsidian_crown','tr_phoenix_relic','tr_leviathan_pearl','tr_worldroot_idol','tr_thunder_scepter','tr_eclipse_crown','tr_astral_throne','tr_eternal_standard','tr_primordial_heart','tr_dawn_regalia'],
  profile_emoji:['pe_squire','pe_scout','pe_alchemist','pe_miner','pe_fisher','pe_camp_cook','pe_rune_scholar','pe_bard','pe_frost_mage','pe_ember_knight','pe_grove_druid','pe_storm_shaman','pe_tide_guard','pe_sun_cleric','pe_shadow_rogue','pe_crystal_seer','pe_drake_rider','pe_void_warlock','pe_clockwork_lord','pe_moon_huntress','pe_obsidian_guard','pe_phoenix_hero','pe_abyss_oracle','pe_worldroot_keeper','pe_thunder_champion','pe_eclipse_queen','pe_astral_archon','pe_eternal_warmaster','pe_primordial_sage','pe_dawn_sovereign'],
  emoji_border:['eb_rope_knot','eb_iron_buckle','eb_leaf_wreath','eb_wave_ring','eb_stone_arch','eb_scroll_frame','eb_gear_basic','eb_feather_loop','eb_frost_spikes','eb_ember_chain','eb_mushroom_crown','eb_storm_cloud','eb_shell_fan','eb_sun_rays','eb_hunter_claws','eb_crystal_cluster','eb_drake_wings','eb_arcane_orbit','eb_clockwork_dial','eb_moon_phase','eb_obsidian_fangs','eb_phoenix_plume','eb_abyss_tentacles','eb_worldroot_arch','eb_thunder_totem','eb_eclipse_halo','eb_astral_portal','eb_eternal_forge','eb_primordial_serpent','eb_dawn_throne'],
});

const activeByCategory = Object.fromEntries(SHOWROOM_CATEGORIES.map(category => [
  category, SHOWROOM_CATALOG_V2.filter(entry=>entry.category===category).map(entry=>entry.id),
]));
const activeIds = new Set(Object.values(activeByCategory).flat());
const aliasPairs=[];
for(const category of SHOWROOM_CATEGORIES){
  const legacy=LEGACY_IDS_BY_CATEGORY[category];
  legacy.forEach((id,index)=>{
    const _n=activeByCategory[category].length;
    const _per=_n>=12&&_n%4===0?_n/4:1;
    const rarityOffsets=[0,_per,_per*2,_per*3];
    const targetIndex=category==='companion' ? Math.min(activeByCategory[category].length-1,Math.floor(index/2))
      : index<15 ? rarityOffsets[0] : index<21 ? rarityOffsets[1]
      : index<26 ? rarityOffsets[2] : rarityOffsets[3];
    // Retained ids such as ae_dust/ae_bubble/ae_firefly must keep their own
    // identity. Aliasing one active id to another loses historical ownership.
    aliasPairs.push([id,activeIds.has(id)?id:activeByCategory[category][targetIndex]]);
  });
}
// The four V3 fallback items were also publicly purchasable. When a category
// graduates to V4, keep those ownership ids loadable by mapping each one to
// the first active item of the same rarity. Categories still on V3 map to self.
const knownAliasIds=new Set(aliasPairs.map(([id])=>id));
for(const [category,entries] of Object.entries(specs))for(const [id,,rarity] of entries){
  if(knownAliasIds.has(id))continue;
  const target=activeIds.has(id)?id:SHOWROOM_CATALOG_V2.find(entry=>entry.category===category&&entry.rarity===rarity)?.id;
  if(target){aliasPairs.push([id,target]);knownAliasIds.add(id)}
}
export const LEGACY_SHOWROOM_ID_ALIASES = Object.freeze(Object.fromEntries(aliasPairs));
export const resolveShowroomItemIdV2 = id => typeof id==='string' ? (LEGACY_SHOWROOM_ID_ALIASES[id]||id) : id;

export function assertShowroomCatalogV2(catalog=SHOWROOM_CATALOG_V2){
  if(!Array.isArray(catalog)||catalog.length===0)throw new Error('showroom catalog: empty catalog');
  const ids=new Set(),assets=new Set();
  for(const category of SHOWROOM_CATEGORIES){
    const entries=catalog.filter(entry=>entry.category===category);
    const isV4Tier=entries.length>=12&&entries.length%4===0;
    const expectedPerCategory=isV4Tier?entries.length:(isCodeNative(category)?0:4);
    if(entries.length!==expectedPerCategory)throw new Error(`${category}: expected ${expectedPerCategory} items, got ${entries.length}`);
    const perRarity=isV4Tier?entries.length/4:1;
    const expected=expectedPerCategory===0?[]:isV4Tier
      ? ['uncommon','rare','epic','legendary'].flatMap(r=>Array(perRarity).fill(r))
      : category==='companion'?['common','common','common','common']:['uncommon','rare','epic','legendary'];
    if(entries.map(entry=>entry.rarity).join(',')!==expected.join(','))throw new Error(`${category}: invalid rarity order`);
    for(const entry of entries){
      for(const key of ['id','category','name','rarity','price','visual','implKey','asset','testOnly','purchasable'])if(entry[key]===undefined||entry[key]==='')throw new Error(`${entry.id}: missing ${key}`);
      // 판매 정책: 트로피는 업적 전용(비매품), 그 외는 가격이 붙은 판매품이어야 한다.
      if(category==='trophy'){
        if(entry.purchasable!==false||entry.price!==null)throw new Error(`${entry.id}: trophies must stay achievement-only`);
      }else if(entry.testOnly===true){
        if(entry.purchasable!==false||entry.price!==null||entry.persistable!==false)throw new Error(`${entry.id}: invalid staging safety flags`);
      }else if(entry.purchasable!==true||!Number.isFinite(entry.price)||entry.price<=0){
        throw new Error(`${entry.id}: released item needs a positive price`);
      }
      if(ids.has(entry.id))throw new Error(`duplicate catalog id: ${entry.id}`);ids.add(entry.id);
      if(entry.asset!==null){if(assets.has(entry.asset))throw new Error(`duplicate catalog asset: ${entry.asset}`);assets.add(entry.asset)}
      const expectedRoot=isV4Tier?'./assets/showroom-v4':'./assets/showroom-v3';
      if(isCodeNative(category)&&entry.asset===null){
        if(!entry.renderSpec)throw new Error(`${entry.id}: invalid code-native item`);
      }else if(!entry.asset||!entry.asset.startsWith(`${expectedRoot}/${category}/`))throw new Error(`${entry.id}: invalid asset path`);
    }
  }
  if(catalog===SHOWROOM_CATALOG_V2){
    if(Object.keys(LEGACY_SHOWROOM_ID_ALIASES).length<218)throw new Error('legacy alias coverage regressed below the original 218 ids');
    for(const [legacy,target] of Object.entries(LEGACY_SHOWROOM_ID_ALIASES)){
      const targetItem=catalog.find(entry=>entry.id===target);
      if(!targetItem)throw new Error(`${legacy}: missing alias target ${target}`);
      if(!legacy.startsWith(`${({graph_skin:'gs',card_theme:'ct',point_marker:'pm',companion:'cp',ambient_effect:'ae',trophy:'tr',profile_emoji:'pe',emoji_border:'eb'})[targetItem.category]}_`))throw new Error(`${legacy}: cross-category alias`);
    }
  }
  return true;
}

assertShowroomCatalogV2();
export default SHOWROOM_CATALOG_V2;
