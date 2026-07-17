// borders-data.js — single source of truth for border frames, rarity, prices,
// and automatic achievement→reward mappings.
// Border visual classes live in css/borders.css (class name: `border-<id>`).

export const BORDER_NAMES = {
  'pulse-glow':'펄스 글로우','rotating-gradient':'회전 그라데이션','rainbow':'레인보우',
  'shimmer':'샤이머','flame':'화염','ice':'얼음','lightning':'번개','neon':'네온',
  'energy-wave':'에너지 파동','gold-shine':'골드 샤인','platinum':'플래티넘',
  'aurora':'오로라','double-ring':'더블 링','dashed-spin':'대시 회전','corona':'코로나',
  'gradient-shift':'그라데이션 시프트','starlight':'별빛','hologram':'홀로그램',
  'diamond':'다이아몬드','challenger':'챌린저','plasma':'플라즈마','magma':'마그마',
  'void-rift':'보이드 리프트','matrix':'매트릭스','cosmic':'코스믹','supernova':'슈퍼노바',
  'solar-flare':'솔라 플레어','frostbite':'프로스트바이트','toxic':'톡식','blood-moon':'블러드문',
  'galaxy':'갤럭시','phoenix':'피닉스','cyber':'사이버펑크','prism':'프리즘','royal-gold':'로열 골드',
  'nebula':'네뷸라','electric-storm':'일렉트릭 스톰','sakura':'사쿠라','obsidian':'옵시디언',
  'radiance':'레디언스','venom':'베놈','inferno':'인페르노','starfall':'스타폴','dragon-scale':'드래곤 스케일',
  'wow-legendary':'전설(레전더리)','wow-fel':'지옥불(펠)','wow-arcane':'비전','wow-frostmourne':'프로스트모운',
  'wow-pyroblast':'불덩이 작렬','wow-holy':'신성한 빛','wow-void':'공허','wow-shadowflame':'암흑불길',
  'wow-stormstrike':'폭풍의 일격','wow-anima':'아니마',
  'epic-orbit':'궤도(오빗)','epic-comet':'혜성','epic-burst':'대폭발',
  'sword-slash':'검무(강철검)','flame-blade':'화염검','holy-greatsword':'성스러운 대검',
  'tier-heartbeat':'하트비트','tier-breathe':'브리딩','tier-satellite':'위성','tier-sparkle':'스파클',
  'tier-ripple':'리플','tier-comet':'혜성(티어)','tier-pulse-rings':'펄스 링','tier-electric':'일렉트릭(티어)',
  'tier-halo':'후광','tier-beam':'라이트 빔','tier-shockwave':'충격파','tier-dual-orbit':'듀얼 오빗',
  'tier-aura':'오라','tier-blade':'검무(티어색)','tier-glitch':'글리치','tier-meteor':'메테오',
  'tier-rune':'룬 서클','tier-firefly':'반딧불','tier-starburst':'스타버스트','tier-vortex':'보텍스',
};

// Rarity → default price (coins)
export const RARITY_INFO = {
  common:    { label:'커먼',    color:'#9aa4b2', price:100  },
  rare:      { label:'레어',    color:'#4fc3f7', price:250  },
  epic:      { label:'에픽',    color:'#b06ef2', price:450  },
  legendary: { label:'레전더리', color:'#ffd700', price:700  },
  mythic:    { label:'신화',    color:'#ff5e7e', price:1200 },
};

const R = (ids, rarity) => ids.map(id => ({ id, rarity }));

// Full catalog. Entries with `reward` are unlocked ONLY via that achievement
// (not purchasable). Everything else is purchasable at RARITY_INFO price
// unless a custom `price` is set.
export const BORDER_CATALOG = [
  // ── tier line (uses current tier color) ─────────────────────────────
  ...R(['tier-heartbeat','tier-breathe','tier-ripple','tier-firefly','tier-sparkle','tier-halo'], 'common'),
  ...R(['tier-satellite','tier-pulse-rings','tier-electric','tier-beam','tier-shockwave','tier-dual-orbit',
        'tier-aura','tier-blade','tier-glitch','tier-meteor','tier-rune','tier-starburst','tier-comet','tier-vortex'], 'rare'),
  // ── standard effects ────────────────────────────────────────────────
  ...R(['pulse-glow','shimmer','dashed-spin','double-ring','gradient-shift','ice','neon','starlight','corona'], 'common'),
  ...R(['rotating-gradient','lightning','energy-wave','rainbow','hologram','gold-shine','platinum','toxic',
        'plasma','venom','obsidian','cyber','matrix','solar-flare','frostbite','magma'], 'rare'),
  ...R(['diamond','prism','void-rift','blood-moon','electric-storm','nebula','cosmic','starfall','radiance',
        'inferno','dragon-scale','epic-orbit','epic-comet','epic-burst','sword-slash','flame-blade','holy-greatsword'], 'epic'),
  ...R(['wow-legendary','wow-fel','wow-arcane','wow-frostmourne','wow-pyroblast','wow-holy','wow-void',
        'wow-shadowflame','wow-stormstrike','wow-anima'], 'legendary'),
  // ── achievement rewards (not purchasable) ───────────────────────────
  { id:'flame',       rarity:'rare',      reward:'record_streak_30' },
  { id:'sakura',      rarity:'epic',      reward:'allgreen_10' },
  { id:'aurora',      rarity:'epic',      reward:'weekly_30' },
  { id:'phoenix',     rarity:'legendary', reward:'loss_30pct' },
  { id:'supernova',   rarity:'legendary', reward:'goal_achieved' },
  { id:'galaxy',      rarity:'legendary', reward:'monthly_20x12' },
  { id:'royal-gold',  rarity:'legendary', reward:'record_365' },
  { id:'challenger',  rarity:'mythic',    reward:'grade_challenger' },
];

// Achievement id → border id (auto-unlocked, shown on achievement cards)
export const ACH_BORDER_REWARDS = {
  record_streak_30 : 'flame',
  allgreen_10      : 'sakura',
  weekly_30        : 'aurora',
  loss_30pct       : 'phoenix',
  goal_achieved    : 'supernova',
  monthly_20x12    : 'galaxy',
  record_365       : 'royal-gold',
  grade_challenger : 'challenger',
  // grade tiers → tier-line borders
  grade_bronze     : 'tier-breathe',
  grade_silver     : 'tier-ripple',
  grade_gold       : 'tier-sparkle',
  grade_platinum   : 'tier-halo',
  grade_emerald    : 'tier-aura',
  grade_diamond    : 'tier-comet',
  grade_master     : 'tier-meteor',
  grade_grandmaster: 'tier-vortex',
  // big cumulative feats
  daily_100        : 'starfall',
  monthly_dec_3    : 'blood-moon',
  diet_week_12     : 'nebula',
  ex_week_12       : 'electric-storm',
  diet_month_3     : 'prism',
  ex_month_3       : 'inferno',
  ex_300           : 'wow-stormstrike',
  ach_100          : 'cosmic',
  steps_total_1m   : 'epic-comet',
  water_goal_30    : 'frostbite',
  journal_clean_30 : 'radiance',
  mood_100         : 'hologram',
};

// Achievement id → title (auto-granted)
export const ACH_TITLE_REWARDS = {
  loss_30pct       : '환골탈태',
  goal_achieved    : '목표 정복자',
  record_365       : '1년 개근',
  ex_300           : '강철 육체',
  allgreen_10      : '클린 이터',
  record_streak_30 : '꾸준함의 화신',
  grade_challenger : '챌린저',
  ach_100          : '업적 사냥꾼',
  monthly_20x12    : '개근왕',
  daily_100        : '한계 돌파자',
  steps_total_1m   : '백만 보 원정대',
  water_goal_30    : '수분 마스터',
  journal_clean_30 : '절제의 달인',
  mood_100         : '감정 기록가',
};

// Set of border ids that can be bought (reward-only ones excluded)
const rewardBorderIds = new Set(Object.values(ACH_BORDER_REWARDS));
export function getShopBorders() {
  const seen = new Set();
  return BORDER_CATALOG.filter(b => {
    if (seen.has(b.id)) return false;
    seen.add(b.id);
    return !b.reward && !rewardBorderIds.has(b.id);
  }).map(b => ({ ...b, name: BORDER_NAMES[b.id] || b.id, price: b.price ?? RARITY_INFO[b.rarity].price }));
}
export function getRewardBorders() {
  const out = [];
  const seen = new Set();
  BORDER_CATALOG.forEach(b => {
    if (seen.has(b.id)) return;
    if (rewardBorderIds.has(b.id)) { seen.add(b.id); out.push({ ...b, name: BORDER_NAMES[b.id] || b.id }); }
  });
  return out;
}
