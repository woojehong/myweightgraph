const item = (category, id, name, rarity, visual, renderSpec) => Object.freeze({
  id, category, name, rarity, price:null, asset:null, visual,
  implKey:`${category}:${id}`,
  testOnly:true, purchasable:false, persistable:false,
  renderSpec:Object.freeze(renderSpec),
});

export const LINE_STYLE_ITEMS_V11 = Object.freeze([
  item('line_style','ls11_u_champion_stitch','챔피언 실밥선','uncommon','흰 본선 위로 붉은 실밥과 금빛 반사가 흐르는 야구 시그니처',{fx:'ls11_u_champion_stitch',width:2.25,tension:.16}),
  item('line_style','ls11_u_ink_tactics','묵향 병법선','uncommon','종이 섬유 위 먹의 농담이 호흡하는 절제된 병법선',{fx:'ls11_u_ink_tactics',width:2.35,tension:.12}),
  item('line_style','ls11_r_wolong_feather','와룡 깃털선','rare','백색 깃결과 청옥 책략 문양이 위상차로 흐르는 선',{fx:'ls11_r_wolong_feather',width:2.5,tension:.18}),
  item('line_style','ls11_r_red_cliff_fire','적벽 화공선','rare','불씨가 본선을 주파하고 뒤로 냉각 잔열이 남는 화공선',{fx:'ls11_r_red_cliff_fire',width:2.6,tension:.16}),
  item('line_style','ls11_e_thunder_current','천둥신 전류선','epic','금속 본선 안에서 청백 전류와 황금 스파크가 다중 속도로 주파',{fx:'ls11_e_thunder_current',width:2.8,tension:.12}),
  item('line_style','ls11_e_crimson_chaos','진홍 혼돈선','epic','진홍 마력 리본과 주문 파편이 교차하는 다층 혼돈선',{fx:'ls11_e_crimson_chaos',width:2.8,tension:.2}),
  item('line_style','ls11_m_frozen_runeblade','빙혼 룬검선','mythic','냉철 검날 본선과 룬 점등, 서리 결정, 영혼 잔광이 겹치는 신화선',{fx:'ls11_m_frozen_runeblade',width:3.1,tension:.16}),
  item('line_style','ls11_m_nether_twinblade','황천 쌍날선','mythic','두 겹 월도 궤적과 황천 불꽃, 검은 잔상 균열이 순환하는 신화선',{fx:'ls11_m_nether_twinblade',width:3.1,tension:.18}),
]);

export const AMBIENT_EFFECT_ITEMS_V11 = Object.freeze([
  item('ambient_effect','ae11_u_champion_stadium','챔피언의 구장','uncommon','외곽 조명과 잔디 먼지, 작은 금빛 환호가 살아 있는 구장',{fx:'ae11_u_champion_stadium'}),
  item('ambient_effect','ae11_u_ink_battlefield','먹빛 전장','uncommon','먹 안개와 군기 그림자, 종이 티끌이 외곽을 흐르는 전장',{fx:'ae11_u_ink_battlefield'}),
  item('ambient_effect','ae11_r_eight_formation','팔진도의 바람','rare','전략 깃발과 청옥 진형, 깃털 바람이 위상차로 순환',{fx:'ae11_r_eight_formation'}),
  item('ambient_effect','ae11_r_red_cliff','적벽의 화공','rare','외곽 화선과 재, 붉은 군선의 잔상이 겹치는 화공 장면',{fx:'ae11_r_red_cliff'}),
  item('ambient_effect','ae11_e_storm_dimension','폭풍 차원','epic','번개문과 구름층, 금속 전기 파편이 다층으로 움직이는 차원',{fx:'ae11_e_storm_dimension'}),
  item('ambient_effect','ae11_e_crimson_chaos','진홍 혼돈장','epic','혼돈환과 진홍 수정, 현실 왜곡이 서로 다른 속도로 맥동',{fx:'ae11_e_crimson_chaos'}),
  item('ambient_effect','ae11_m_frozen_crown','얼음왕관 눈보라','mythic','빙정과 영혼불, 냉기 안개와 룬 파편이 기승전결로 순환',{fx:'ae11_m_frozen_crown'}),
  item('ambient_effect','ae11_m_black_sanctuary','검은 성소의 균열','mythic','황천문과 지옥불 유성, 흑요 파편과 연무가 겹치는 신화 효과',{fx:'ae11_m_black_sanctuary'}),
]);
