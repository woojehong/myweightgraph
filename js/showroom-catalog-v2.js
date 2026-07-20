// Maweg showroom catalog v2. Code-native CSS/SVG assets only.
const categorySpecs = {
  graph_skin: [
    ['ink-grid','먹빛 격자','짙은 남청 바탕과 가는 사각 격자'],['slate-lines','슬레이트 선로','회청 바탕과 강조된 수평선'],['mint-trace','민트 궤적','선 뒤에 얇은 민트 잔광'],['ember-ticks','불씨 눈금','주황 눈금점과 무채색 격자'],['moon-paper','달빛 장지','청회색 종이결 SVG 패턴'],['frost-panel','서리 패널','가장자리 서리와 고대비 중앙'],['moss-map','이끼 지도','암록 등고선형 보조선'],['copper-rule','구리 자선','구리색 세로 눈금과 얇은 프레임'],
    ['crystal-grid','수정 격자','마름모형 반투명 결정 격자'],['aurora-band','오로라 띠','하단 청록 그라데이션 띠'],['rune-axis','룬 축척','문자 없는 기하문양 축 캡'],['lava-fault','용암 단층','저농도 균열형 SVG 배경'],['tidal-chart','해류 도표','잔물결형 수평 안내선'],['sunstone','태양석 판','금빛 모서리와 온색 면 채움'],['night-forest','밤숲 기록지','하단 침엽수 저농도 실루엣'],
    ['void-lattice','공허 격자','보라 원근 격자와 중심 심도'],['storm-scope','폭풍 관측판','원형 레이더 링과 번개 눈금'],['dragon-glass','용린 유리','비늘형 유리 패턴과 무채색 반사'],['celestial-map','천구 지도','별자리 없는 점과 원호 천문도'],['arcane-prism','비전 프리즘','삼각 프리즘 굴절선'],['iron-citadel','철성 계기판','리벳 모서리와 금속 계기 눈금'],
    ['phoenix-wake','불사조의 항적','선 뒤에 짧은 불꽃 꼬리'],['leviathan-depth','심해거수의 수심계','심도 그라데이션과 기포 눈금'],['worldroot','세계뿌리 맥락','플롯 외곽 뿌리형 분기선'],['thunder-throne','뇌광 옥좌도','각진 전기 프레임과 순간 섬광'],['eclipse-dial','일식 측정환','중앙 암환과 금빛 원호 눈금'],
    ['astral-forge','성좌 대장간','별불꽃과 단조 금속 격자'],['primordial-sea','태초의 바다','청록 심해층과 느린 파면'],['crimson-cataclysm','진홍 대격변','가장자리 붉은 균열 맥동'],['crown-of-dawn','여명의 왕관','금빛 방사선과 백색 중심광']
  ],
  card_theme: [
    ['dark-canvas','어둠 천막','무광 흑청 카드와 얇은 테두리'],['field-leather','야전 가죽','갈색 가죽결과 단순 봉제선'],['silver-plate','은빛 철판','냉회색 금속판과 네 모서리 못'],['oak-board','참나무 게시판','짙은 목재결과 종이형 헤더'],['mist-glass','안개 유리','반투명 유리와 흐린 외곽광'],['desert-cloth','사막 천문','베이지 직물결과 청동 테두리'],['moss-stone','이끼 석판','돌결과 이끼 모서리'],['navy-banner','남빛 군기','남색 천과 하단 삼각 절개'],
    ['emerald-lodge','에메랄드 숙영지','녹색 천막과 황동 고리'],['frost-keep','서리 성채','얼음 모서리와 석재 헤더'],['ember-forge','불씨 제련소','검은 철판과 붉은 내부광'],['arcane-archive','비전 서고','보랏빛 장정과 금속 책귀'],['tidal-shell','해류 패각','청록 패각층과 진주점'],['sun-temple','태양 신전','사암 기둥형 좌우 프레임'],['wild-hunt','야생 추적대','가죽끈과 잎사귀 코너'],
    ['obsidian-gate','흑요 관문','검은 결정 기둥과 자주 균열'],['storm-bastion','폭풍 보루','강철 장갑과 푸른 전기 홈'],['crystal-palace','수정 궁정','다면 결정 프레임과 굴절광'],['moonlit-crypt','달빛 묘실','회색 아치와 달빛 상단창'],['drake-aerie','비룡 둥지','절벽석과 추상 날개 코너'],['clockwork-hall','태엽 전당','황동 기어와 계기판 헤더'],
    ['phoenix-court','불사조 궁정','적금 깃털 프레임과 온광'],['abyssal-sanctum','심연 성소','청흑 촉수형 외곽선'],['world-tree-hall','거목의 전당','나뭇가지 기둥과 잎빛 헤더'],['celestial-citadel','천공 요새','백금 아치와 부유석 코너'],['eclipse-chamber','일식 회랑','흑금 원환과 양분된 명암'],
    ['astral-throne','성계의 옥좌','별빛 왕좌형 외곽 실루엣'],['eternal-forge','영원의 용광로','용융 금속 홈의 느린 순환'],['primordial-grove','태초의 성림','거대 뿌리 아치와 생명광'],['dawn-sovereign','여명 군주의 전당','백금 방사관과 왕관형 상단']
  ],
  point_marker: [
    ['ring','정찰 고리','이중 원환'],['diamond','수정 마름모','각진 마름모'],['shield','수호 방패','소형 방패 윤곽'],['arrow','길잡이 화살','위치 방향 화살촉'],['hex','육각 인장','속 빈 육각형'],['leaf','생명 잎새','한 장의 잎 실루엣'],['drop','해류 물방울','물방울형 핀'],['spark','작은 불꽃','네 갈래 불꽃'],
    ['rune-disc','기하 룬판','추상 선각 원판'],['ice-shard','얼음 파편','세로 결정편'],['ember-core','불씨 핵','겹친 불꽃 원핵'],['gear','태엽 표식','8톱니 기어'],['moon','초승달 표식','초승달과 점'],['claw','야수 발톱','세 줄 발톱흔'],['wing','바람 날개','한쪽 날개핀'],
    ['prism','비전 프리즘','삼각 결정과 내부광'],['storm-eye','폭풍의 눈','소용돌이 원환'],['drake-scale','비룡 비늘','방패형 비늘'],['sun-seal','태양 인장','8방향 태양광'],['void-orb','공허 구체','검은 코어와 보라 링'],['crown','승전 왕관','세 봉우리 왕관'],
    ['phoenix-feather','불사조 깃','휘어진 불꽃 깃털'],['leviathan-eye','심해거수의 눈','타원 동공과 물결'],['worldroot-seed','세계뿌리 씨앗','씨앗과 세 뿌리'],['thunder-hammer','뇌광 망치','작은 망치와 섬광'],['eclipse','일식 인장','흑원과 금빛 코로나'],
    ['astral-compass','성계 나침반','8각 나침별의 느린 회전'],['eternal-flame','영원의 불꽃','삼중 불꽃의 1회 점화'],['primordial-eye','태초의 시선','동심원 눈과 맥동'],['dawn-relic','여명의 성물','백금 성배형 광표식']
  ],
  companion: [
    ['firefly','길잡이 반딧불','빛점 세 개가 완만히 부유'],['scroll','졸린 두루마리','말린 지도와 눈 두 점'],['moss-slime','이끼 젤리','둥근 초록 점액 생물'],['cave-bat','동굴 박쥐','짧게 날갯짓하는 검은 박쥐'],['camp-owl','야영 올빼미','횃대에 앉은 갈색 올빼미'],['spring-sprite','샘물 정령','물방울 몸체와 작은 팔'],['brass-beetle','황동 딱정벌레','금속 등딱지 곤충'],['grumpy-cloud','투덜 구름','작은 먹구름과 빗방울'],
    ['fox-wisp','여우불 꼬리','여우 머리형 청록 불꽃'],['frost-imp','서리 꼬마정령','얼음뿔을 단 소형 정령'],['ember-lizard','불씨 도마뱀','꼬리 끝이 빛나는 도마뱀'],['pebble-golem','조약돌 골렘','세 돌로 된 작은 골렘'],['moon-moth','달빛 나방','반달 날개 나방'],['wind-ray','바람 가오리','공중 유영 소형 가오리'],['sage-mushroom','현자 버섯','두건 같은 갓과 지팡이'],
    ['crystal-drake','수정 꼬마비룡','결정날개 소형 비룡'],['storm-raven','폭풍 까마귀','푸른 섬광을 두른 까마귀'],['arcane-eye','비전 감시구','부유하는 단안 구체'],['sun-scarab','태양 풍뎅이','금빛 날개를 편 풍뎅이'],['void-jelly','공허 해파리','별점 촉수의 해파리'],['clockwork-hawk','태엽 매','황동 날개 기계매'],
    ['phoenix-chick','불사조 새끼','불꽃 꼬리의 둥근 새'],['abyss-seahorse','심연 해마','청색 발광 해마'],['root-guardian','뿌리 수호령','잎뿔을 가진 나무정령'],['thunder-wolf','뇌광 늑대령','번개선으로 된 늑대 머리'],['eclipse-hare','일식 토끼령','검은 토끼와 금빛 귀끝'],
    ['astral-dragonet','성계 용령','별자리 점으로 된 소룡'],['eternal-grifflet','영원의 그리핀 새끼','독수리와 사자형 단일 실루엣'],['primordial-serpent','태초의 소사룡','원환을 그리는 작은 뱀용'],['dawn-lion','여명의 사자령','빛 갈기의 사자 머리']
  ],
  ambient_effect: [
    ['dust','떠도는 먼지','느린 미세 입자 8개'],['mist','옅은 안개','하단 저속 안개띠'],['leaf','한낮의 잎새','잎 3장의 대각 낙하'],['ash','꺼진 재','회색 재 입자'],['bubble','잔물방울','우측 작은 기포 상승'],['snow','가벼운 눈','저밀도 눈송이'],['firefly','초원 반딧불','황록 점광 6개'],['workshop-spark','작업장 불티','모서리 주황 불티'],
    ['blue-rain','푸른 빗줄기','가느다란 비 10줄'],['moon-petal','달꽃 잎','백보라 꽃잎 낙하'],['ember','화톳불 불씨','하단 불씨 상승'],['frost-breath','서리 숨결','가장자리 성에 변화'],['geo-rune','기하 문양','추상 원형 문양 2개 부유'],['wind-trail','바람 자취','곡선 세 줄의 좌우 통과'],['forest-spore','숲의 포자','녹금 포자 점광'],
    ['crystal-shard','수정 파편','반투명 다각 파편 회전'],['storm-flash','폭풍 잔광','외곽의 짧은 번개 1회'],['starlight','별빛 유영','작은 별점과 긴 잔광'],['gold-sand','황금 모래바람','하단 금빛 모래 흐름'],['void-rift','공허 균열','외곽 보라 균열 맥동'],['gear-march','태엽 행진','모서리 기어 3개 저속 회전'],
    ['phoenix-featherfall','불사조 깃비','불꽃 깃털 4개 낙하'],['abyss-current','심해 발광류','청색 생물광 입자와 파면'],['life-pulse','생명의 맥동','모서리 뿌리선 발광'],['thunder-ring','뇌운의 고리','카드 외곽 전기 고리'],['eclipse-corona','일식 코로나','상단 암환과 금빛 코로나'],
    ['astral-vortex','성계 소용돌이','카드 외곽 별입자 회전'],['eternal-flame','영원의 화염막','하단 저농도 화염 실루엣'],['primordial-storm','태초의 폭풍','절제된 비와 바람과 번개'],['dawn-blessing','여명의 축복','상단 금빛 광선 1회 확산']
  ],
  trophy: [
    ['wood-medal','목각 메달','나뭇결 원형 메달'],['iron-badge','철제 휘장','방패형 철 배지'],['copper-cup','구리 잔','작은 양손잡이 잔'],['scout-pin','정찰 핀','나침 화살 모양 핀'],['leaf-wreath','잎새 화환','두 갈래 잎 화환'],['wave-shell','물결 패각','소용돌이 조개 메달'],['ember-token','불씨 징표','불꽃 각인 동전'],['moon-pin','달빛 핀','초승달 핀'],
    ['silver-chalice','은빛 성배','가느다란 은잔'],['frost-medal','서리 메달','육각 설결정 메달'],['hunter-horn','추적자의 뿔피리','휘어진 소형 뿔피리'],['arcane-tablet','비전 석판','기하문양 각인 석판'],['sun-disc','태양 원반','황동 태양 원반'],['storm-pin','폭풍 핀','구름과 번개 핀'],['grove-crown','숲의 관','나뭇가지 소관'],
    ['crystal-cup','수정 우승잔','다면 수정잔'],['drake-emblem','비룡 문장','추상 날개와 뿔 방패'],['void-orb','공허 보주','받침 위 검은 구체'],['clockwork-laurel','태엽 월계관','기어와 금속 잎 화환'],['celestial-astrolabe','천구의','교차 원환 천구 모형'],['obsidian-crown','흑요 소관','뾰족 흑요 왕관'],
    ['phoenix-relic','불사조 성물','불꽃 날개 성배'],['leviathan-pearl','심해거수의 진주','파도 받침의 청색 진주'],['worldroot-idol','세계뿌리 성상','뿌리와 새싹 토템'],['thunder-scepter','뇌광 홀','번개 코어 소형 홀'],['eclipse-crown','일식 왕관','흑금 원환 왕관'],
    ['astral-throne','성계 옥좌','별빛 소형 옥좌'],['eternal-standard','영원의 군기','불꽃 문양 독립 깃발'],['primordial-heart','태초의 심장','결정 심장과 생명맥'],['dawn-regalia','여명의 제관','백금 제관과 주황 보석']
  ],
  profile_emoji: [
    ['squire','새내기 종자','둥근 투구 얼굴'],['scout','숲길 정찰자','후드와 한쪽 깃'],['alchemist','견습 연금술사','고글과 작은 병'],['miner','수정 광부','램프 투구 얼굴'],['fisher','해류 낚시꾼','챙모자와 낚싯바늘'],['camp-cook','야영 요리사','조리모와 국자'],['rune-scholar','룬 학자','둥근 안경과 책'],['bard','길거리 음유가','깃모자와 작은 류트'],
    ['frost-mage','서리술사','얼음관과 청색 눈빛'],['ember-knight','불씨 기사','검은 투구와 불꽃 술'],['grove-druid','수풀 현자','잎뿔과 녹색 얼굴'],['storm-shaman','폭풍 주술사','구름 머리장식과 번개귀걸이'],['tide-guard','해류 수호자','패각 투구와 청록 깃'],['sun-cleric','태양 사제','원반 후광과 흰 두건'],['shadow-rogue','그림자 척후','복면과 은빛 눈'],
    ['crystal-seer','수정 예언자','다면 관과 세 번째 보석'],['drake-rider','비룡 기수','비늘 투구와 고글'],['void-warlock','공허 계약자','자주 뿔관과 검은 눈'],['clockwork-lord','태엽 군주','기어 단안경과 황동관'],['moon-huntress','달빛 사냥꾼','초승 머리장식과 은발'],['obsidian-guard','흑요 수문장','검은 각면 투구'],
    ['phoenix-hero','불사조 영웅','불꽃 깃관과 금빛 눈'],['abyss-oracle','심연의 신탁','해파리 관과 발광 문양'],['worldroot-keeper','세계뿌리 지기','큰 가지뿔과 꽃눈'],['thunder-champion','뇌광 투사','번개 볏투구와 청백 눈'],['eclipse-queen','일식 여왕','흑금 원환관과 베일'],
    ['astral-archon','성계 집정관','별관과 우주빛 얼굴'],['eternal-warmaster','영원의 전쟁군주','용광 투구와 불빛 틈'],['primordial-sage','태초의 대현자','원시석 관과 이중 후광'],['dawn-sovereign','여명의 군주','백금 왕관과 태양 후광']
  ],
  emoji_border: [
    ['rope-knot','야영 매듭','원형 밧줄과 하단 매듭'],['iron-buckle','철제 버클','사각 모서리 버클 프레임'],['leaf-wreath','잎새 화환','비대칭 잎 두 갈래'],['wave-ring','물결 고리','세 겹 파도형 원환'],['stone-arch','석문 아치','상단 아치와 하단 받침돌'],['scroll-frame','두루마리 틀','상하로 말린 양피지'],['gear-basic','작업장 톱니','12톱니 단일 기어'],['feather-loop','여행자 깃고리','좌측 긴 깃털이 원을 감쌈'],
    ['frost-spikes','서리 가시','8방향 얼음 가시 실루엣'],['ember-chain','불씨 사슬','사슬 원환과 하단 불꽃'],['mushroom-crown','버섯 숲관','상단 버섯 셋과 하단 뿌리'],['storm-cloud','폭풍운 틀','상단 구름과 양옆 번개'],['shell-fan','패각 부채','방사형 조개껍질 프레임'],['sun-rays','태양 광륜','장단 교차 16방사광'],['hunter-claws','추적자 발톱','세 갈래 발톱의 대각 포위'],
    ['crystal-cluster','수정 군락','비대칭 다면 결정 7개'],['drake-wings','비룡 날개','양옆 날개의 1회 펼침'],['arcane-orbit','비전 궤도환','기울어진 이중 고리의 저속 공전'],['clockwork-dial','태엽 문자판','비원형 계기판과 회전 바늘'],['moon-phase','달의 위상','상단 초승과 반달과 보름 배열'],['obsidian-fangs','흑요 송곳니','상하 맞물린 검은 결정 송곳니'],
    ['phoenix-plume','불사조 깃관','상단 거대 깃과 하단 불꽃 꼬리'],['abyss-tentacles','심연 촉수환','네 촉수의 느린 굽이침'],['worldroot-arch','세계뿌리 아치','굵은 뿌리 아치의 발아'],['thunder-totem','뇌광 토템','좌우 각진 토템과 전기 가교'],['eclipse-halo','일식 후광','후면 암원과 전면 코로나 회전'],
    ['astral-portal','성계 관문','원근 타원문으로 별입자 유입'],['eternal-forge','영원의 용광환','팔각 금속환 홈의 용융광 순환'],['primordial-serpent','태초의 쌍사룡','두 뱀용이 이루는 원형 실루엣'],['dawn-throne','여명 옥좌관','하단 옥좌 받침과 상단 삼중 왕관광']
  ]
};

const categoryPrefixes = { graph_skin:'gs', card_theme:'ct', point_marker:'pm', companion:'cp', ambient_effect:'ae', trophy:'tr', profile_emoji:'pe', emoji_border:'eb' };
const rarityPlan = [
  ...Array(8).fill('common'), ...Array(7).fill('uncommon'), ...Array(6).fill('rare'),
  ...Array(5).fill('epic'), ...Array(4).fill('legendary')
];
const pricePlan = [200,220,240,260,300,320,360,400,500,550,600,650,700,750,800,1000,1100,1200,1300,1400,1500,1800,2000,2200,2400,2600,3500,4000,4500,5000];

export const SHOWROOM_CATEGORIES = Object.freeze(Object.keys(categorySpecs));
export const SHOWROOM_DEFAULTS = Object.freeze({ graph_skin:null, card_theme:null, point_marker:null, companion:null, ambient_effect:null, trophy:[], profile_emoji:null, emoji_border:null });
const stableIdAliases={
  'ambient_effect:wind-trail':'ae_wind','ambient_effect:astral-vortex':'ae_astral','ambient_effect:void-rift':'ae_void','ambient_effect:abyss-current':'ae_abyss','ambient_effect:thunder-ring':'ae_thunder','ambient_effect:geo-rune':'ae_rune','ambient_effect:crystal-shard':'ae_crystal',
};
export const SHOWROOM_CATALOG_V2 = Object.freeze(SHOWROOM_CATEGORIES.flatMap(category => categorySpecs[category].slice(0,category==='companion'?8:30).map(([slug,name,visual], index) => Object.freeze({ id:stableIdAliases[`${category}:${slug}`]||`${categoryPrefixes[category]}_${slug.replaceAll('-','_')}`, category, name, rarity:rarityPlan[index], price:pricePlan[index], visual, implKey:`${category}:${slug}` }))));

export function assertShowroomCatalogV2(catalog = SHOWROOM_CATALOG_V2) {
  const expectedRarities = { common:8, uncommon:7, rare:6, epic:5, legendary:4 };
  const priceRanges = { common:[200,400], uncommon:[500,800], rare:[1000,1500], epic:[1800,2600], legendary:[3500,5000] };
  if (catalog.length !== 218) throw new Error(`showroom catalog: expected 218 items, got ${catalog.length}`);
  const ids = new Set();
  for (const category of SHOWROOM_CATEGORIES) {
    const items = catalog.filter(item => item.category === category);
    const expectedCount=category==='companion'?8:30;
    if (items.length !== expectedCount) throw new Error(`${category}: expected ${expectedCount} items, got ${items.length}`);
    const counts = Object.fromEntries(Object.keys(expectedRarities).map(rarity => [rarity,0]));
    for (const item of items) {
      for (const key of ['id','category','name','rarity','price','visual','implKey']) if (item[key] === undefined || item[key] === '') throw new Error(`${item.id || category}: missing ${key}`);
      if (ids.has(item.id)) throw new Error(`duplicate catalog id: ${item.id}`);
      ids.add(item.id);
      if (!(item.rarity in counts)) throw new Error(`${item.id}: invalid rarity ${item.rarity}`);
      counts[item.rarity]++;
      const [min,max] = priceRanges[item.rarity];
      if (item.price < min || item.price > max) throw new Error(`${item.id}: price ${item.price} outside ${min}-${max}`);
    }
    for (const [rarity,count] of Object.entries(expectedRarities)) {const expected=category==='companion'?(rarity==='common'?8:0):count;if(counts[rarity] !== expected) throw new Error(`${category}: ${rarity} expected ${expected}, got ${counts[rarity]}`);}
  }
  for (const [category,value] of Object.entries(SHOWROOM_DEFAULTS)) {
    const defaults = Array.isArray(value) ? value : [value];
    for (const id of defaults) if (id != null && !catalog.some(item => item.category === category && item.id === id)) throw new Error(`${category}: invalid default ${id}`);
  }
  return true;
}

assertShowroomCatalogV2();
export default SHOWROOM_CATALOG_V2;
