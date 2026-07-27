const trophy = (id, name, visual) => Object.freeze({
  id,
  category: 'trophy',
  name,
  rarity: 'artifact',
  price: null,
  asset: `./assets/showroom-v10/trophy/${id}.png`,
  visual,
  implKey: `trophy:${id}`,
  testOnly: false,
  purchasable: false,
  persistable: true,
  acquisition: 'achievement_only',
});

export const TROPHY_ITEMS_V10 = Object.freeze([
  trophy('tr_a_world_series_constellation', '별들의 월드시리즈', '월드시리즈 우승 트로피를 연상시키는 금빛 깃발 군상'),
  trophy('tr_a_big_ears', '은하의 빅이어', '유럽 챔피언의 빅이어를 연상시키는 은빛 귀형 성배'),
  trophy('tr_a_world_cup_orb', '세계의 황금구', '월드컵 우승 트로피를 연상시키는 황금 지구상'),
  trophy('tr_a_club_world_orbit', '세계클럽 궤도패', '클럽 월드 챔피언 트로피를 연상시키는 황금 궤도상'),
  trophy('tr_a_golden_ball', '황금 축구성', '발롱도르를 연상시키는 보석면 황금 축구공'),
  trophy('tr_a_summoners_cup', '소환사의 성배', '세계 최정상 e스포츠 성배를 연상시키는 푸른 왕관형 컵'),
  trophy('tr_a_stanley_tower', '영원의 은빛탑', '스탠리컵을 연상시키는 장대한 은빛 연대기 탑'),
  trophy('tr_a_golden_gramophone', '황금 선율기', '그래미를 연상시키는 고전 황금 축음기'),
  trophy('tr_a_cinema_guardian', '황금 영화수호상', '세계 영화 시상식을 연상시키는 황금 수호자상'),
  trophy('tr_a_frostmourne_statue', '빙혼 룬검상', '서리 저주 룬검을 전시한 빙혼 스태츄'),
  trophy('tr_a_doomhammer_statue', '대지울림 망치상', '폭풍과 늑대 문양의 대지울림 전쟁망치 스태츄'),
  trophy('tr_a_aegis_shield', '고대 수호방패', '세계 정상급 투기장의 아이기스를 연상시키는 고대 방패상'),
]);
