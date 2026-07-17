// shop-data.js — purchasable titles for the point shop.
// Titles are stored in Firestore as plain strings (purchasedTitles / earnedTitles),
// so `name` is the canonical key. Keep names free of quotes.

export const SHOP_TITLES = [
  // ── everyday fun (80~200) ────────────────────────────────────────
  { name: '물배 챔피언',        price: 80,  desc: '물만 마셔도 배부른 경지' },
  { name: '광합성 다이어터',    price: 80,  desc: '햇빛과 샐러드만으로 삽니다' },
  { name: '만성 헬스장 등록러', price: 90,  desc: '등록은 12개월, 출석은 2회' },
  { name: '치킨 파이터',        price: 100, desc: '치킨과 싸우는 중 (지는 중)' },
  { name: '침대 밖은 위험해',   price: 100, desc: '오늘의 운동: 이불 개기' },
  { name: '국밥 한 그릇의 여유', price: 120, desc: '뜨끈한 국밥이면 다 됩니다' },
  { name: '프로 다이어터',      price: 120, desc: '다이어트 경력 10년차 (진행형)' },
  { name: '유산소 혐오자',      price: 130, desc: '러닝머신 위에서만 철학자' },
  { name: '헬창',               price: 150, desc: '3대 얼마 물어보면 신남' },
  { name: '단백질 성애자',      price: 150, desc: '닭가슴살 월 30kg 소비' },
  { name: '치팅데이 감별사',    price: 160, desc: '오늘도 치팅데이일 확률 100%' },
  { name: '새벽의 러너',        price: 180, desc: '해 뜨기 전에 5km 완주' },
  { name: '계단 정복자',        price: 180, desc: '엘리베이터는 나약한 자의 것' },
  { name: '샐러드의 왕',        price: 200, desc: '풀만 먹어도 왕은 왕' },
  { name: '식단표 설계자',      price: 200, desc: '엑셀로 짜는 일주일 식단' },
  { name: '리코타의 기사',      price: 220, desc: '샐러드 위 치즈를 수호하라' },
  // ── serious grind (250~400) ──────────────────────────────────────
  { name: '작심삼일 브레이커',  price: 250, desc: '4일째에도 살아남은 자' },
  { name: '인바디 전사',        price: 250, desc: '측정 결과지를 액자에 보관' },
  { name: '야식 파괴자',        price: 300, desc: '밤 10시의 유혹을 이겨냄' },
  { name: '체지방 저격수',      price: 350, desc: '한 발, 한 발, 1kg씩' },
  { name: '갓생 루틴러',        price: 400, desc: '기상-운동-기록-반복' },
  // ── flex (800+) ──────────────────────────────────────────────────
  { name: '전설의 몸무게',      price: 800,  desc: '전설은 저울 위에 있다' },
  { name: '살은 내일부터',      price: 1000, desc: '가장 비싼 핑계, 이제는 훈장' },
];
