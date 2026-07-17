import { esc } from './util.js';
import { playAvatar3D } from './avatar-3d.js';

export const DEFAULT_AVATAR_V2 = Object.freeze({
  body: 'basic', headgear: null, hair: 'default', face: 'default',
  top: 'white-tee', bottom: 'black-track', shoes: null,
  rightHand: null, leftHand: null, pose: 'neutral', effect: null, animation: 'idle',
});

export const AVATAR_V2_CATEGORIES = [
  { id: 'body', name: '체형', icon: '◇' },
  { id: 'face', name: '얼굴', icon: '◉' },
  { id: 'hair', name: '헤어', icon: '⌁' },
  { id: 'headgear', name: '헤어 액세서리', icon: '♢' },
  { id: 'top', name: '상의', icon: '▱' },
  { id: 'bottom', name: '하의', icon: '▥' },
  { id: 'shoes', name: '신발', icon: '⌞' },
  { id: 'rightHand', name: '오른손', icon: '╱' },
  { id: 'leftHand', name: '왼손', icon: '╲' },
  { id: 'pose', name: '포즈', icon: '♙' },
  { id: 'effect', name: '이펙트', icon: '✦' },
  { id: 'animation', name: '애니메이션', icon: '▶' },
];

export const AVATAR_V2_ITEMS = [
  { id:'basic', slot:'body', name:'기본형', note:'운동하지 않은 평범한 일반인 체형', price:0, asset:'assets/avatar-v2/body-basic.png' },
  { id:'slim', slot:'body', name:'슬림형', note:'군더더기 없이 가벼운 체형', price:3600, asset:'assets/avatar-v2/body-slim.png' },
  { id:'toned', slot:'body', name:'탄탄형', note:'균형 잡힌 운동선수 체형', price:4800, asset:'assets/avatar-v2/body-toned.png' },
  { id:'power', slot:'body', name:'근돼형', note:'두껍고 강한 파워 체형', price:4200, minTier:'diamond', asset:'assets/avatar-v2/body-power.png' },
  { id:'physique', slot:'body', name:'피지크형', note:'넓은 어깨와 역삼각형', price:5200, minTier:'diamond', asset:'assets/avatar-v2/body-physique.png' },
  { id:'default', slot:'face', name:'기본 얼굴', note:'단정한 기본 프리셋', price:0 },
  { id:'default', slot:'hair', name:'내추럴 가르마', note:'기본 헤어스타일', price:0 },
  { id:null, slot:'headgear', name:'미착용', note:'헤어 액세서리 없음', price:0 },
  { id:'white-tee', slot:'top', name:'흰 티셔츠', note:'기본 지급', price:0 },
  { id:'bare-chest', slot:'top', name:'상의 탈의', note:'특수 외형', price:8500, locked:true },
  { id:'black-track', slot:'bottom', name:'검정 트레이닝 팬츠', note:'기본 지급', price:0 },
  { id:null, slot:'shoes', name:'맨발', note:'기본 지급', price:0 },
  { id:null, slot:'rightHand', name:'미착용', note:'오른손 비움', price:0 },
  { id:null, slot:'leftHand', name:'미착용', note:'왼손 비움', price:0 },
  { id:'neutral', slot:'pose', name:'차렷', note:'기본 정면 포즈', price:0 },
  { id:'relaxed', slot:'pose', name:'편안하게', note:'힘을 뺀 자연스러운 자세', price:300 },
  { id:'lean-left', slot:'pose', name:'왼쪽 기대기', note:'무게중심을 왼쪽으로', price:450 },
  { id:'lean-right', slot:'pose', name:'오른쪽 기대기', note:'무게중심을 오른쪽으로', price:450 },
  { id:'hero', slot:'pose', name:'히어로', note:'가슴을 펴고 당당하게', price:700 },
  { id:'guard', slot:'pose', name:'경계', note:'전투 전의 긴장된 자세', price:850 },
  { id:'victory', slot:'pose', name:'승리', note:'승리를 자축하는 자세', price:900 },
  { id:'runner', slot:'pose', name:'러너', note:'출발 직전의 자세', price:750 },
  { id:'power', slot:'pose', name:'파워', note:'힘을 과시하는 자세', price:1000 },
  { id:'cool', slot:'pose', name:'시크', note:'살짝 비튼 여유로운 자세', price:650 },
  { id:null, slot:'effect', name:'이펙트 없음', note:'기본 상태', price:0 },
  { id:'idle', slot:'animation', name:'기본 대기', note:'차분한 호흡 모션', price:0 },
  { id:'salute', slot:'animation', name:'승리 인사', note:'클릭 시 짧은 인사', price:0 },
];

// GLB 안에 실제로 존재하는 조합형 3D 노드 카탈로그.
const addItems = (slot, rows) => rows.forEach(([id,name,note,price,minTier]) => {
  if (!AVATAR_V2_ITEMS.some(item => item.slot === slot && item.id === id)) AVATAR_V2_ITEMS.push({id,slot,name,note,price,...(minTier?{minTier}:{})});
});
addItems('face', Array.from({length:9},(_,i)=>[`face-${String(i+2).padStart(2,'0')}`,['강인한 인상','부드러운 인상','날카로운 인상','차분한 인상','굵은 눈썹','짧은 수염','전사형 얼굴','도회적 얼굴','베테랑 얼굴'][i],'이목구비와 눈썹 프리셋',500+i*90]));
addItems('hair', Array.from({length:9},(_,i)=>[`hair-${String(i+2).padStart(2,'0')}`,['스파이크','장발','버즈컷','리젠트','가르마','크롭컷','웨이브','포마드','소프트 모히칸'][i],'독립 3D 헤어 메시',550+i*110]));
addItems('headgear', Array.from({length:10},(_,i)=>[`head-${String(i+1).padStart(2,'0')}`,['검은 머리띠','황금 머리띠','진홍 머리띠','흑각','은각','청광 링','황금 링','전술 바이저','심안 바이저','마웨그 바이저'][i],'헤어와 함께 장착 가능',900+i*180]));
addItems('top', Array.from({length:9},(_,i)=>[`top-${String(i+2).padStart(2,'0')}`,['블랙 컴프레션','마웨그 저지','크림슨 아머','아케인 재킷','필드 유니폼','골드 챔피언','실버 플레이트','보이드 코트','레더 베스트'][i],'상의 독립 3D 메시',800+i*220]));
addItems('bottom', Array.from({length:9},(_,i)=>[`bottom-${String(i+2).padStart(2,'0')}`,['네이비 조거','필드 쇼츠','레더 팬츠','실버 팬츠','블랙 쇼츠','아케인 팬츠','필드 팬츠','챔피언 쇼츠','전술 팬츠'][i],'하의 독립 3D 메시',650+i*160]));
addItems('shoes', Array.from({length:10},(_,i)=>[`shoes-${String(i+1).padStart(2,'0')}`,['화이트 러너','블랙 러너','크림슨 하이','아케인 하이','골드 워커','오프화이트 러너','나이트 부츠','레드 스프린터','블루 코트화','챔피언 부츠'][i],'양발 3D 신발 세트',700+i*170]));
addItems('rightHand', Array.from({length:10},(_,i)=>[`right-${String(i+1).padStart(2,'0')}`,['서리빛 대검','황혼궁','빙결검','전술 도구','공허 구체','태양 대검','수호궁','강철 도구','룬 대검','성운 구체'][i],'오른손 장비 소켓',2600+i*520,i>=7?'diamond':null]));
addItems('leftHand', Array.from({length:10},(_,i)=>[`left-${String(i+1).padStart(2,'0')}`,['서리빛 단검','황혼궁','빙결검','전술 방패','공허 구체','태양검','수호궁','강철 도구','룬 블레이드','성운 구체'][i],'왼손 장비 소켓',2400+i*500,i>=7?'diamond':null]));
addItems('effect', Array.from({length:10},(_,i)=>[`effect-${String(i+1).padStart(2,'0')}`,['빙결 파동','화염 입자','공허 고리','황금 오라','마웨그 오라','설원 입자','열기 고리','심연 입자','승리의 빛','초월 오라'][i],'회전·호흡 반응 3D 이펙트',4200+i*650,i>=5?'diamond':null]));
addItems('animation', Array.from({length:8},(_,i)=>[`anim-${String(i+3).padStart(2,'0')}`,['도발','무기 경례','승리 포효','준비 자세','짧은 춤','전투 점검','챔피언 인사','초월 모션'][i],'클릭 재생 모션',900+i*260]));

export function normalizeAvatarV2(value) {
  return { ...DEFAULT_AVATAR_V2, ...(value && typeof value === 'object' ? value : {}) };
}

export function avatarV2Item(slot, id) {
  return AVATAR_V2_ITEMS.find(item => item.slot === slot && item.id === id) || null;
}

export function avatarV2Asset(value) {
  const avatar = normalizeAvatarV2(value);
  return avatarV2Item('body', avatar.body)?.asset || AVATAR_V2_ITEMS[0].asset;
}

export function renderAvatarV2(value, options = {}) {
  const avatar = normalizeAvatarV2(value);
  const size = Math.max(80, Number(options.size) || 280);
  const label = esc(options.label || '아바타');
  const classes = ['avatar-v2', options.className || '', `avatar-pose-${avatar.pose || 'neutral'}`, `avatar-motion-${avatar.animation || 'idle'}`].filter(Boolean).join(' ');
  const avatarData = esc(encodeURIComponent(JSON.stringify(avatar)));
  return `<div class="${classes}" style="--avatar-v2-size:${size}px" data-avatar-motion="${esc(avatar.animation || 'idle')}">
    <div class="avatar-3d-host" data-avatar="${avatarData}" aria-label="${label} 3D"></div>
    <div class="avatar-v2-aura" aria-hidden="true"></div>
    <img src="${esc(avatarV2Asset(avatar))}" alt="${label}" draggable="false">
    <div class="avatar-v2-floor" aria-hidden="true"></div>
  </div>`;
}

export function ownedAvatarV2Item(user, item) {
  if (!item || item.price === 0) return true;
  return Array.isArray(user?.avatarItemsV2) && user.avatarItemsV2.includes(`${item.slot}:${item.id}`);
}

export function playAvatarV2(element, motion) {
  if (!element) return;
  const host = element.querySelector('.avatar-3d-host');
  if (host?.classList.contains('avatar-3d-ready')) playAvatar3D(host);
  const chosen = motion || element.dataset.avatarMotion || 'idle';
  element.classList.remove('avatar-v2-playing', 'avatar-play-salute');
  void element.offsetWidth;
  element.classList.add('avatar-v2-playing', `avatar-play-${chosen}`);
  window.setTimeout(() => element.classList.remove('avatar-v2-playing', `avatar-play-${chosen}`), 1050);
}
