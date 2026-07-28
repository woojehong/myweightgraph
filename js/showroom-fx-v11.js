const item = (category, id, name, rarity, visual, renderSpec) => Object.freeze({
  id, category, name, rarity, price:null, asset:null, visual,
  implKey:`${category}:${id}`,
  testOnly:true, purchasable:false, persistable:false,
  renderSpec:Object.freeze(renderSpec),
});

export const LINE_STYLE_ITEMS_V11 = Object.freeze([
  item('line_style','ls11_u_champion_stitch','챔피언 실밥선','uncommon','직접 고른 색으로 표현되는 짧은 실밥 점선. 움직임 없는 기본형',{fx:'ls11_u_champion_stitch',width:2.4,tension:.12,dash:[9,5],color:'#f5f7fa',colorMode:'custom'}),
  item('line_style','ls11_u_ink_tactics','묵향 병법선','uncommon','직접 고른 색으로 표현되는 붓질형 일점쇄선. 움직임 없는 기본형',{fx:'ls11_u_ink_tactics',width:2.6,tension:.08,dash:[16,4,2,4],color:'#d6e0e8',colorMode:'custom'}),
  item('line_style','ls11_r_wolong_feather','와룡 깃털선','rare','직접 고른 색의 이중 깃결과 고정된 책략 각인이 겹치는 정적 선',{fx:'ls11_r_wolong_feather',width:2.7,tension:.16,color:'#8ce8df',colorMode:'custom'}),
  item('line_style','ls11_r_red_cliff_fire','적벽 화공선','rare','적벽의 숯결과 불씨 마디를 고정 문양으로 새긴 정적 테마선',{fx:'ls11_r_red_cliff_fire',width:2.8,tension:.12,color:'#ff7a3d',colorMode:'fixed'}),
  item('line_style','ls11_e_thunder_current','천둥신 전류선','epic','고정된 청백 금속선 위를 전류와 황금 스파크가 질주하는 영웅 연출',{fx:'ls11_e_thunder_current',width:2.9,tension:.12,color:'#9ddcff',colorMode:'fixed'}),
  item('line_style','ls11_e_crimson_chaos','진홍 혼돈선','epic','진홍 본선을 따라 혼돈 리본과 룬 파편이 교차해 흐르는 영웅 연출',{fx:'ls11_e_crimson_chaos',width:2.9,tension:.18,color:'#ff477e',colorMode:'fixed'}),
  item('line_style','ls11_m_frozen_runeblade','빙혼 룬검선','mythic','빙철 검날·룬 점등·서리 결정·영혼광이 연속 전개되는 신화 연출',{fx:'ls11_m_frozen_runeblade',width:3.2,tension:.14,color:'#bdefff',colorMode:'fixed'}),
  item('line_style','ls11_m_nether_twinblade','황천 쌍날선','mythic','황천 쌍날의 두 궤적과 균열광·지옥불이 순환하는 신화 연출',{fx:'ls11_m_nether_twinblade',width:3.2,tension:.16,color:'#8cff68',colorMode:'fixed'}),
].sort((a,b)=>({uncommon:0,rare:1,epic:2,mythic:3}[a.rarity]-({uncommon:0,rare:1,epic:2,mythic:3}[b.rarity]))));

export const AMBIENT_EFFECT_ITEMS_V11 = Object.freeze([
  item('ambient_effect','ae11_u_navy_bear_victory','남색 곰의 승리비','uncommon','남색 응원 리본과 은빛 실밥, 구장 조명이 살랑이는 승리 연출',{fx:'ae11_u_navy_bear_victory',motionTier:'gentle'}),
  item('ambient_effect','ae11_u_twin_night_game','쌍별 야간경기','uncommon','쌍별 잔광과 적백 리본이 밤 구장을 천천히 가르는 연출',{fx:'ae11_u_twin_night_game',motionTier:'gentle'}),
  item('ambient_effect','ae11_u_tiger_homerun','호랑이의 홈런 불꽃','uncommon','호랑이 발톱 불씨와 홈런 축포가 가장자리를 밝히는 연출',{fx:'ae11_u_tiger_homerun',motionTier:'gentle'}),
  item('ambient_effect','ae11_r_crescent_dragon','월아청룡의 행진','rare','월아의 잔광과 청룡 비늘 바람이 유영하는 희귀 연출',{fx:'ae11_r_crescent_dragon',motionTier:'subtle'}),
  item('ambient_effect','ae11_r_imperial_jade_seal','황실 옥새의 금진','rare','옥새와 황금 운문이 느리게 맥동하는 황실 진법 연출',{fx:'ae11_r_imperial_jade_seal',motionTier:'subtle'}),
  item('ambient_effect','ae11_r_moon_archive','월하 서고의 지령','rare','달빛 문서와 먹구름, 청색 반딧불이 흐르는 서고 연출',{fx:'ae11_r_moon_archive',motionTier:'subtle'}),
  item('ambient_effect','ae11_e_starforged_reactor','별벼림 반응로','epic','적금 장갑 잔광과 반응로 파동이 전개되는 영웅 연출',{fx:'ae11_e_starforged_reactor',motionTier:'heroic'}),
  item('ambient_effect','ae11_e_spider_rift','거미차원의 균열','epic','거미줄 차원문과 적청 도시 잔광이 교차하는 영웅 연출',{fx:'ae11_e_spider_rift',motionTier:'heroic'}),
  item('ambient_effect','ae11_e_vibranium_guard','흑진동 수호장','epic','보랏빛 운동에너지와 흑금속 파편이 폭발하는 영웅 연출',{fx:'ae11_e_vibranium_guard',motionTier:'heroic'}),
  item('ambient_effect','ae11_m_banshee_dirge','밴시 여왕의 장송곡','mythic','혼령 비단과 검은 깃털, 진홍 화살비가 겹치는 신화 연출',{fx:'ae11_m_banshee_dirge',motionTier:'mythic'}),
  item('ambient_effect','ae11_m_iron_warchief','강철 대족장의 전쟁터','mythic','강철 사슬과 용암 도끼, 전장의 충격파가 휘몰아치는 신화 연출',{fx:'ae11_m_iron_warchief',motionTier:'mythic'}),
  item('ambient_effect','ae11_m_raven_arcane','까마귀탑의 비전폭풍','mythic','까마귀 군무와 비전 번개, 시간 파동이 중첩되는 신화 연출',{fx:'ae11_m_raven_arcane',motionTier:'mythic'}),
  item('ambient_effect','ae11_u_champion_stadium','챔피언의 구장','uncommon','구장 조명과 먼지가 외곽에서 잔잔하게 호흡하는 공간 연출',{fx:'ae11_u_champion_stadium',motionTier:'gentle'}),
  item('ambient_effect','ae11_u_ink_battlefield','먹빛 전장','uncommon','먹 번짐과 군기 그림자가 가장자리에서 살랑이는 공간 연출',{fx:'ae11_u_ink_battlefield',motionTier:'gentle'}),
  item('ambient_effect','ae11_r_eight_formation','팔진도의 바람','rare','청옥 진형과 깃털 흔적이 아주 느리게 호흡하는 저동적 공간 연출',{fx:'ae11_r_eight_formation',motionTier:'subtle'}),
  item('ambient_effect','ae11_r_red_cliff','적벽의 화공','rare','화선과 재가 간헐적으로만 반응하는 저동적 적벽 공간 연출',{fx:'ae11_r_red_cliff',motionTier:'subtle'}),
  item('ambient_effect','ae11_e_storm_dimension','폭풍 차원','epic','폭우·예고광·낙뢰·잔류 전류가 단계적으로 발생하는 영웅 연출',{fx:'ae11_e_storm_dimension',motionTier:'heroic'}),
  item('ambient_effect','ae11_e_crimson_chaos','진홍 혼돈장','epic','혼돈 리본·마법진·수정 파편이 다층 흐름장을 이루는 영웅 연출',{fx:'ae11_e_crimson_chaos',motionTier:'heroic'}),
  item('ambient_effect','ae11_m_frozen_crown','얼음왕관 눈보라','mythic','전후경 눈보라·냉기 안개·룬진·영혼불이 연속 전개되는 신화 연출',{fx:'ae11_m_frozen_crown',motionTier:'mythic'}),
  item('ambient_effect','ae11_m_black_sanctuary','검은 성소의 균열','mythic','황천 균열·지옥 유성·에너지 파도·흑요 파편이 폭발하는 신화 연출',{fx:'ae11_m_black_sanctuary',motionTier:'mythic'}),
].sort((a,b)=>({uncommon:0,rare:1,epic:2,mythic:3}[a.rarity]-({uncommon:0,rare:1,epic:2,mythic:3}[b.rarity]))));
