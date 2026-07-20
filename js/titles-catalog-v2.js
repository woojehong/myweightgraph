export const TITLE_RARITY_COLORS = Object.freeze({
  common: "#FFFFFF",
  uncommon: "#1EFF00",
  rare: "#0070DD",
  epic: "#A335EE",
  legendary: "#FF8000",
});

export const TITLES_CATALOG_V2 = Object.freeze([
  { id: "title_dawn_watch", name: "새벽 경계병", rarity: "common", price: 200, acquisition: "purchasable", achievementRecommendation: null, description: "긴 밤의 마지막 보초를 홀로 견딘 이에게 붙는 이름." },
  { id: "title_runeflame_apprentice", name: "룬불꽃 견습생", rarity: "common", price: 250, acquisition: "purchasable", achievementRecommendation: null, description: "아직 서툴지만 첫 주문에 불꽃을 피워 낸 마도 수련자." },
  { id: "title_shieldline_rookie", name: "방패줄의 막내", rarity: "common", price: 250, acquisition: "purchasable", achievementRecommendation: null, description: "거대한 적 앞에서도 방패 대열을 떠나지 않은 신병." },
  { id: "title_stariron_novice", name: "별철 수습공", rarity: "common", price: 300, acquisition: "purchasable", achievementRecommendation: null, description: "별빛을 머금은 광석에 처음 망치를 올린 제작자." },
  { id: "title_ashwind_tracker", name: "잿바람 추적자", rarity: "common", price: 300, acquisition: "purchasable", achievementRecommendation: null, description: "불탄 들판에 남은 희미한 발자국까지 놓치지 않는다." },
  { id: "title_healing_circle_touch", name: "회복진의 손길", rarity: "common", price: 350, acquisition: "purchasable", achievementRecommendation: null, description: "쓰러질 듯한 동료를 치유의 빛으로 다시 일으킨 자." },
  { id: "title_dungeon_pathfinder", name: "던전 길잡이", rarity: "common", price: 350, acquisition: "purchasable", achievementRecommendation: null, description: "갈림길과 함정을 기억해 일행을 출구로 이끈다." },
  { id: "title_campfire_beacon", name: "야영지의 횃불", rarity: "common", price: 400, acquisition: "achievement_only", achievementRecommendation: "초행 파티원과 함께 협동 콘텐츠를 완주하는 환영형 업적", description: "지친 원정대가 다시 모여드는 따뜻한 불빛." },

  { id: "title_ironwall_vanguard", name: "철벽 선봉장", rarity: "uncommon", price: 500, acquisition: "purchasable", achievementRecommendation: null, description: "첫 돌진을 받아 내고 전장의 중심을 지켜 낸 방벽." },
  { id: "title_leyline_tuner", name: "마력맥 조율사", rarity: "uncommon", price: 550, acquisition: "purchasable", achievementRecommendation: null, description: "뒤엉킨 마력의 흐름을 읽어 주문의 박자를 되찾는다." },
  { id: "title_venom_alchemist", name: "맹독의 연금술사", rarity: "uncommon", price: 600, acquisition: "purchasable", achievementRecommendation: null, description: "한 방울의 독과 해독제 사이에서 승부를 결정하는 조제사." },
  { id: "title_beastpath_companion", name: "야수길 동행자", rarity: "uncommon", price: 650, acquisition: "purchasable", achievementRecommendation: null, description: "발톱 자국만 남은 길에서도 야수와 나란히 걷는다." },
  { id: "title_holylance_sentinel", name: "성창의 파수꾼", rarity: "uncommon", price: 700, acquisition: "purchasable", achievementRecommendation: null, description: "빛을 두른 창끝으로 무너지는 전열을 붙든 수호자." },
  { id: "title_shadow_pactbearer", name: "그림자 계약자", rarity: "uncommon", price: 750, acquisition: "purchasable", achievementRecommendation: null, description: "어둠의 대가를 알면서도 그 힘에 자신의 이름을 새겼다." },
  { id: "title_stormstring_marksman", name: "폭풍시위 명사수", rarity: "uncommon", price: 800, acquisition: "achievement_only", achievementRecommendation: "원거리 역할로 지정 표적을 연속 정확히 처리하는 전투 업적", description: "천둥보다 먼저 날아간 화살이 적의 숨을 끊는다." },

  { id: "title_rift_stitcher", name: "균열 봉합자", rarity: "rare", price: 1000, acquisition: "purchasable", achievementRecommendation: null, description: "찢어진 차원의 가장자리를 꿰매 세계의 붕괴를 늦춘 자." },
  { id: "title_abyssbell_hunter", name: "심연종 사냥꾼", rarity: "rare", price: 1100, acquisition: "purchasable", achievementRecommendation: null, description: "깊은 곳의 종소리가 울리면 사냥을 시작하는 추격자." },
  { id: "title_thunderhammer_artisan", name: "천둥망치 대장인", rarity: "rare", price: 1200, acquisition: "purchasable", achievementRecommendation: null, description: "벼락을 모루 삼아 전쟁의 무구를 벼려 낸 장인." },
  { id: "title_phoenix_array_healer", name: "불사조진 치유사", rarity: "rare", price: 1300, acquisition: "achievement_only", achievementRecommendation: "치유 역할로 전멸 위기의 공격대를 회복시켜 우두머리를 처치하는 업적", description: "재가 된 전열조차 다시 날아오르게 만드는 치유사." },
  { id: "title_eclipse_infiltrator", name: "월식의 잠행자", rarity: "rare", price: 1400, acquisition: "purchasable", achievementRecommendation: null, description: "달빛이 끊기는 한순간에 적진의 심장을 지나간다." },
  { id: "title_ancient_script_decoder", name: "고대문자 해독가", rarity: "rare", price: 1500, acquisition: "achievement_only", achievementRecommendation: "탐험·수집 계열 기록물을 한 묶음 완성하는 업적", description: "돌에 잠든 문장을 깨워 잊힌 시대의 길을 연 학자." },

  { id: "title_throneless_warmarshal", name: "왕좌 없는 군단장", rarity: "epic", price: 1800, acquisition: "purchasable", achievementRecommendation: null, description: "왕관 없이도 수천의 전사가 그 깃발 아래 진군한다." },
  { id: "title_doomclock_breaker", name: "종말시계 파괴자", rarity: "epic", price: 2000, acquisition: "achievement_only", achievementRecommendation: "제한 시간 내 고난도 우두머리를 처치하는 속도 공략 업적", description: "패배를 예고하던 마지막 초침을 산산이 부순 자." },
  { id: "title_stargrave_guide", name: "별무덤의 인도자", rarity: "epic", price: 2200, acquisition: "purchasable", achievementRecommendation: null, description: "빛을 잃은 별들 사이에서 원정대의 귀환로를 찾아낸다." },
  { id: "title_soulcitadel_gatekeeper", name: "영혼성채 수문장", rarity: "epic", price: 2400, acquisition: "achievement_only", achievementRecommendation: "방어 역할로 치명적인 공격을 통제하며 공격대 전원을 생존시키는 업적", description: "산 자와 죽은 자의 경계에서 단 하나의 문을 지킨다." },
  { id: "title_crimson_moon_arbiter", name: "붉은 달의 심판관", rarity: "epic", price: 2600, acquisition: "achievement_only", achievementRecommendation: "고난도 공격대의 선택형 추가 조건을 충족하는 업적", description: "핏빛 달이 뜨는 밤, 전장의 죄와 대가를 판결한다." },

  { id: "title_skycleaver", name: "천공을 가른 자", rarity: "legendary", price: 3500, acquisition: "purchasable", achievementRecommendation: null, description: "한 번의 일격으로 구름과 운명의 장막을 함께 갈랐다." },
  { id: "title_dead_god_witness", name: "죽은 신의 증언자", rarity: "legendary", price: 4000, acquisition: "achievement_only", achievementRecommendation: "최상위 공격대의 최종 우두머리를 처치하는 업적", description: "신의 마지막 숨을 보고도 이성을 잃지 않은 유일한 목격자." },
  { id: "title_last_beacon_bearer", name: "마지막 봉화를 든 자", rarity: "legendary", price: 4500, acquisition: "achievement_only", achievementRecommendation: "불리한 전투에서 다수의 파티원을 생환시키는 영웅적 업적", description: "모든 불빛이 꺼진 뒤에도 홀로 귀환의 신호를 들었다." },
  { id: "title_infinite_hall_returnee", name: "무한회랑의 귀환자", rarity: "legendary", price: 5000, acquisition: "achievement_only", achievementRecommendation: "반복 심화형 던전의 최고 단계 또는 장기 연속 완주 업적", description: "끝없이 되감기는 전장을 뚫고 현실로 돌아온 생존자." },
]);
