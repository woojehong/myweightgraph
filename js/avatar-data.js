// avatar-data.js — chibi avatar item catalog + SVG renderer.
// Pure data module: no imports, no side effects (safe to import anywhere).
//
// Canvas: viewBox 0 0 100 100.
// Layer order (bottom → top): body skin → outfit → head skin (face) → hair → accessory.
// Skin items carry two layers (svgBody / svgHead) because the outfit is drawn
// between them; all other items carry a single `svg` layer.

export const AVATAR_SLOTS = [
  { id: 'skin',   name: '피부',     required: true  },
  { id: 'hair',   name: '머리',     required: false },
  { id: 'outfit', name: '옷',       required: false },
  { id: 'acc',    name: '액세서리', required: false },
];

export const DEFAULT_AVATAR = { skin: 'skin-peach', hair: 'hair-bowl', outfit: 'outfit-tee', acc: null };

/* ── shared shape helpers ─────────────────────────────────────────── */

// Body in skin tone: torso + arms (hands peek out under sleeves) + feet.
const bodySkin = (base, shade) => `
<ellipse cx="42.5" cy="90" rx="5.6" ry="3.6" fill="${shade}"/>
<ellipse cx="57.5" cy="90" rx="5.6" ry="3.6" fill="${shade}"/>
<path d="M36 62 Q36 58 40.5 58 L59.5 58 Q64 58 64 62 L65 82 Q65 88 50 88 Q35 88 35 82 Z" fill="${base}"/>
<ellipse cx="31" cy="72.5" rx="5" ry="6" fill="${base}"/>
<ellipse cx="69" cy="72.5" rx="5" ry="6" fill="${base}"/>`;

// Head + face. Big round head, dot eyes with a highlight, tiny mouth, blush.
const headSkin = (base, shade, eye) => `
<circle cx="50" cy="40" r="25" fill="${base}"/>
<path d="M25.5 45 A25 25 0 0 0 74.5 45 A25 25 0 0 1 25.5 45 Z" fill="${shade}" opacity=".25"/>
<circle cx="41.5" cy="43" r="2.4" fill="${eye}"/>
<circle cx="58.5" cy="43" r="2.4" fill="${eye}"/>
<circle cx="42.4" cy="42.1" r=".85" fill="#fff" opacity=".9"/>
<circle cx="59.4" cy="42.1" r=".85" fill="#fff" opacity=".9"/>
<path d="M46.8 50 Q50 53.2 53.2 50" stroke="${eye}" stroke-width="1.6" stroke-linecap="round" fill="none"/>
<ellipse cx="34.5" cy="48.5" rx="3.9" ry="2.4" fill="#ff8fa3" opacity=".38"/>
<ellipse cx="65.5" cy="48.5" rx="3.9" ry="2.4" fill="#ff8fa3" opacity=".38"/>`;

// Outfit torso base (slightly larger than the skin torso so it fully covers it).
const torso = fill => `<path d="M35.4 62.5 Q35.4 57.6 40.2 57.6 L59.8 57.6 Q64.6 57.6 64.6 62.5 L65.6 82 Q65.6 88.6 50 88.6 Q34.4 88.6 34.4 82 Z" fill="${fill}"/>`;
// Short sleeves covering the top of the arms.
const sleeves = fill => `<ellipse cx="31" cy="69.5" rx="5.9" ry="5" fill="${fill}"/><ellipse cx="69" cy="69.5" rx="5.9" ry="5" fill="${fill}"/>`;
// Hair cap: covers the top of the head with a soft fringe above the eyes.
const hairCap = fill => `<path d="M24.1 44 A26 26 0 0 1 75.9 44 L75.9 47 Q63 35.6 50 35.6 Q37 35.6 24.1 47 Z" fill="${fill}"/>`;

/* ── skins (all free) ─────────────────────────────────────────────── */

const SKIN_TONES = [
  { id: 'skin-ivory',   name: '아이보리', base: '#ffe3c9', shade: '#f2c9a6', eye: '#33261f' },
  { id: 'skin-peach',   name: '피치',     base: '#ffd2a6', shade: '#eeb886', eye: '#33261f' },
  { id: 'skin-caramel', name: '카라멜',   base: '#d99a63', shade: '#c08349', eye: '#2a1c12' },
  { id: 'skin-cocoa',   name: '코코아',   base: '#9c6640', shade: '#84522f', eye: '#20130a' },
];

const skinItems = SKIN_TONES.map(t => {
  const svgBody = bodySkin(t.base, t.shade);
  const svgHead = headSkin(t.base, t.shade, t.eye);
  return { id: t.id, slot: 'skin', name: t.name, price: 0, svgBody, svgHead, svg: svgBody + svgHead };
});

/* ── hair (8 styles, 2 free) ──────────────────────────────────────── */

const hairItems = [
  { id: 'hair-bowl', slot: 'hair', name: '바가지 컷', price: 0, svg:
    hairCap('#5b4232') +
    `<path d="M50 14.5 Q54.5 8 59 10.5 Q53.5 10.5 52.3 15.5 Z" fill="#5b4232"/>` },

  { id: 'hair-sport', slot: 'hair', name: '스포츠 컷', price: 0, svg:
    `<path d="M25.8 37 A25.7 25.7 0 0 1 74.2 37 Q73 34 68 32.5 Q60 27.6 50 27.6 Q40 27.6 32 32.5 Q27 34 25.8 37 Z" fill="#34302d"/>` },

  { id: 'hair-pony', slot: 'hair', name: '포니테일', price: 150, svg:
    hairCap('#8a5a33') +
    `<path d="M71.5 31 Q86 33 84.5 50 Q83.5 62 75.5 69 Q80 55 76.5 45.5 Q74 37.5 68.5 34.5 Z" fill="#8a5a33"/>
     <circle cx="72.8" cy="32.8" r="2.4" fill="#e6608a"/>` },

  { id: 'hair-bun', slot: 'hair', name: '당고머리', price: 150, svg:
    hairCap('#3c332e') +
    `<circle cx="50" cy="12.5" r="7" fill="#3c332e"/>
     <rect x="44.5" y="17.2" width="11" height="3.2" rx="1.6" fill="#e6608a"/>` },

  { id: 'hair-curly', slot: 'hair', name: '뽀글머리', price: 200, svg:
    hairCap('#6b4a2f') +
    `<circle cx="28.5" cy="32" r="7" fill="#6b4a2f"/><circle cx="38" cy="24.5" r="7.5" fill="#6b4a2f"/>
     <circle cx="50" cy="21.5" r="8" fill="#6b4a2f"/><circle cx="62" cy="24.5" r="7.5" fill="#6b4a2f"/>
     <circle cx="71.5" cy="32" r="7" fill="#6b4a2f"/><circle cx="24.5" cy="40" r="5.5" fill="#6b4a2f"/>
     <circle cx="75.5" cy="40" r="5.5" fill="#6b4a2f"/>` },

  { id: 'hair-long', slot: 'hair', name: '긴 생머리', price: 250, svg:
    `<path d="M23.5 40 Q20.5 62 25.5 73.5 Q32.5 70.5 30.8 51 L30.5 41 Z" fill="#d9a441"/>
     <path d="M76.5 40 Q79.5 62 74.5 73.5 Q67.5 70.5 69.2 51 L69.5 41 Z" fill="#d9a441"/>` +
    hairCap('#d9a441') },

  { id: 'hair-mintbob', slot: 'hair', name: '민트 단발', price: 300, svg:
    `<path d="M23.8 40 Q21.5 55 27.5 60.5 Q32.5 56.5 30.5 45.5 L30 40 Z" fill="#7fe0cf"/>
     <path d="M76.2 40 Q78.5 55 72.5 60.5 Q67.5 56.5 69.5 45.5 L70 40 Z" fill="#7fe0cf"/>` +
    hairCap('#8ceada') },

  { id: 'hair-twintail', slot: 'hair', name: '핑크 트윈테일', price: 350, svg:
    `<path d="M23.5 33 Q11 43 15.5 62.5 Q22.5 58 24.5 46.5 L25.5 36 Z" fill="#ff9ec7"/>
     <path d="M76.5 33 Q89 43 84.5 62.5 Q77.5 58 75.5 46.5 L74.5 36 Z" fill="#ff9ec7"/>` +
    hairCap('#ffb1d2') +
    `<circle cx="25" cy="34.5" r="2.3" fill="#ffd54f"/><circle cx="75" cy="34.5" r="2.3" fill="#ffd54f"/>` },
];

/* ── outfits (10, 2 free) ─────────────────────────────────────────── */

const outfitItems = [
  { id: 'outfit-tee', slot: 'outfit', name: '기본 티셔츠', price: 0, svg:
    torso('#19b394') + sleeves('#19b394') +
    `<path d="M44.5 58 Q50 62 55.5 58" stroke="#0e8a72" stroke-width="1.6" fill="none"/>` },

  { id: 'outfit-track', slot: 'outfit', name: '트레이닝복', price: 0, svg:
    torso('#37474f') + sleeves('#37474f') +
    `<path d="M50 58.5 L50 88" stroke="#cfd8dc" stroke-width="1.3"/>
     <path d="M37.5 61 Q36.4 74 37 84" stroke="#ef5350" stroke-width="2" fill="none"/>
     <path d="M62.5 61 Q63.6 74 63 84" stroke="#ef5350" stroke-width="2" fill="none"/>
     <rect x="47.6" y="58.5" width="4.8" height="3.4" rx="1.4" fill="#cfd8dc"/>` },

  { id: 'outfit-tank', slot: 'outfit', name: '헬스 나시', price: 100, svg:
    `<path d="M39.5 57.8 L60.5 57.8 L64.5 82 Q64.5 88.4 50 88.4 Q35.5 88.4 35.5 82 Z" fill="#263238"/>
     <path d="M46 72.5 L54 72.5" stroke="#00e5aa" stroke-width="2"/>
     <rect x="42.8" y="69.8" width="2.6" height="5.4" rx="1.2" fill="#00e5aa"/>
     <rect x="54.6" y="69.8" width="2.6" height="5.4" rx="1.2" fill="#00e5aa"/>` },

  { id: 'outfit-hoodie', slot: 'outfit', name: '후드티', price: 120, svg:
    torso('#78909c') + sleeves('#78909c') +
    `<path d="M38 61 Q50 68.5 62 61 Q62.5 55.5 50 54.8 Q37.5 55.5 38 61 Z" fill="#607d8b"/>
     <path d="M46.5 63.5 L46 71" stroke="#eceff1" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M53.5 63.5 L54 71" stroke="#eceff1" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M42.5 78.5 L57.5 78.5 L55.8 86 L44.2 86 Z" fill="#607d8b"/>` },

  { id: 'outfit-pajama', slot: 'outfit', name: '구름 잠옷', price: 150, svg:
    torso('#b39ddb') + sleeves('#b39ddb') +
    `<circle cx="43" cy="66" r="1.7" fill="#fff" opacity=".55"/><circle cx="56" cy="70" r="1.7" fill="#fff" opacity=".55"/>
     <circle cx="45" cy="79" r="1.7" fill="#fff" opacity=".55"/><circle cx="58" cy="82" r="1.7" fill="#fff" opacity=".55"/>
     <circle cx="38" cy="73" r="1.4" fill="#fff" opacity=".45"/>
     <path d="M45 58 Q50 61.5 55 58" stroke="#9575cd" stroke-width="1.5" fill="none"/>` },

  { id: 'outfit-taekwondo', slot: 'outfit', name: '태권도복', price: 200, svg:
    torso('#eceff1') + sleeves('#eceff1') +
    `<path d="M43 57.8 L50 68.5 L57 57.8" stroke="#b0bec5" stroke-width="2" fill="none"/>
     <rect x="35" y="76" width="30" height="4.6" fill="#212121"/>
     <path d="M48 80.6 L46.5 86.5 M52 80.6 L53.5 86.5" stroke="#212121" stroke-width="2.4" stroke-linecap="round"/>` },

  { id: 'outfit-suit', slot: 'outfit', name: '정장', price: 250, svg:
    torso('#2c3a47') + sleeves('#2c3a47') +
    `<path d="M44 57.8 L50 69.5 L56 57.8 Z" fill="#eceff1"/>
     <path d="M49 61 L51 61 L52.2 71.5 L50 74.5 L47.8 71.5 Z" fill="#c62828"/>
     <path d="M44 57.8 L47.5 64.5 L44 69 Z" fill="#22303c"/>
     <path d="M56 57.8 L52.5 64.5 L56 69 Z" fill="#22303c"/>` },

  { id: 'outfit-hanbok', slot: 'outfit', name: '한복', price: 300, svg:
    `<path d="M35.4 62.5 Q35.4 57.6 40.2 57.6 L59.8 57.6 Q64.6 57.6 64.6 62.5 L65 72 L35 72 Z" fill="#f48fb1"/>` +
    sleeves('#f48fb1') +
    `<path d="M34.6 72 L65.4 72 Q67 88.6 50 88.6 Q33 88.6 34.6 72 Z" fill="#5c6bc0"/>
     <path d="M45 57.8 L50 65.5 L55 57.8" stroke="#fff" stroke-width="2.2" fill="none"/>
     <path d="M47.5 64 Q44.5 70 46.5 77" stroke="#c2185b" stroke-width="2.2" fill="none" stroke-linecap="round"/>` },

  { id: 'outfit-robe', slot: 'outfit', name: '마법사 로브', price: 400, svg:
    `<path d="M36 62.5 Q36 57.6 40.5 57.6 L59.5 57.6 Q64 57.6 64 62.5 L68.5 84.5 Q69 89 50 89 Q31 89 31.5 84.5 Z" fill="#5e35b1"/>` +
    sleeves('#5e35b1') +
    `<path d="M40 76 Q50 80 60 76" stroke="#ffd54f" stroke-width="1.6" fill="none"/>
     <path d="M44.5 64.5 L45.6 67 L48.3 67.2 L46.2 68.9 L46.9 71.5 L44.5 70 L42.1 71.5 L42.8 68.9 L40.7 67.2 L43.4 67 Z" fill="#ffd54f"/>
     <path d="M57.5 69 A3.4 3.4 0 1 0 60 74.5 A2.7 2.7 0 1 1 57.5 69 Z" fill="#ffd54f"/>` },

  { id: 'outfit-armor', slot: 'outfit', name: '기사 갑옷', price: 450, svg:
    torso('#90a4ae') +
    `<ellipse cx="30.5" cy="67.5" rx="7" ry="6" fill="#78909c"/>
     <ellipse cx="69.5" cy="67.5" rx="7" ry="6" fill="#78909c"/>
     <path d="M41 62 Q50 66.5 59 62 L59 70 Q50 74 41 70 Z" fill="#b0bec5"/>
     <rect x="35.6" y="77" width="28.8" height="4.2" fill="#546e7a"/>
     <rect x="47.4" y="76.2" width="5.2" height="5.8" rx="1.2" fill="#ffd54f"/>
     <circle cx="43" cy="65" r=".9" fill="#546e7a"/><circle cx="57" cy="65" r=".9" fill="#546e7a"/>` },
];

/* ── accessories (10, none free) ──────────────────────────────────── */

const accItems = [
  { id: 'acc-sweatband', slot: 'acc', name: '스웨트밴드', price: 80, svg:
    `<path d="M26.3 30 Q50 21.5 73.7 30 L73.7 35.5 Q50 27 26.3 35.5 Z" fill="#ef5350"/>
     <path d="M26.3 32.7 Q50 24.3 73.7 32.7" stroke="#fff" stroke-width="1.4" fill="none" opacity=".85"/>` },

  { id: 'acc-glasses', slot: 'acc', name: '뿔테 안경', price: 100, svg:
    `<circle cx="41.5" cy="43" r="6.6" fill="rgba(140,210,255,.12)" stroke="#2e2a28" stroke-width="2"/>
     <circle cx="58.5" cy="43" r="6.6" fill="rgba(140,210,255,.12)" stroke="#2e2a28" stroke-width="2"/>
     <path d="M48.1 42 Q50 40.8 51.9 42" stroke="#2e2a28" stroke-width="1.8" fill="none"/>
     <path d="M34.9 42.2 L26.5 40.5 M65.1 42.2 L73.5 40.5" stroke="#2e2a28" stroke-width="1.8"/>` },

  { id: 'acc-scarf', slot: 'acc', name: '목도리', price: 120, svg:
    `<path d="M36.5 56.5 Q50 63 63.5 56.5 L63.5 62.5 Q50 69 36.5 62.5 Z" fill="#ef5350"/>
     <rect x="55" y="60.5" width="7" height="16" rx="3" fill="#ef5350"/>
     <path d="M56 73.5 L61 73.5 M56 70.5 L61 70.5" stroke="#ffcdd2" stroke-width="1.2"/>
     <path d="M38 59.5 Q50 65 62 59.5" stroke="#ffcdd2" stroke-width="1.2" fill="none"/>` },

  { id: 'acc-shaker', slot: 'acc', name: '프로틴 쉐이커', price: 150, svg:
    `<rect x="73.5" y="61.5" width="9.5" height="14" rx="3" fill="#4fc3f7"/>
     <rect x="75" y="57.8" width="6.5" height="4.4" rx="1.6" fill="#90a4ae"/>
     <circle cx="78.2" cy="56.8" r="1.7" fill="#90a4ae"/>
     <path d="M75 66 L81.5 66 M75 69.5 L81.5 69.5" stroke="#0d47a1" stroke-width=".9" opacity=".55"/>` },

  { id: 'acc-headphones', slot: 'acc', name: '헤드폰', price: 180, svg:
    `<path d="M26.8 37 A23.5 23.5 0 0 1 73.2 37" stroke="#ff6f91" stroke-width="4" fill="none" stroke-linecap="round"/>
     <rect x="20.8" y="33.5" width="8.4" height="13.5" rx="4.2" fill="#ff6f91"/>
     <rect x="70.8" y="33.5" width="8.4" height="13.5" rx="4.2" fill="#ff6f91"/>
     <rect x="23" y="36" width="4" height="8.5" rx="2" fill="#d94f73"/>
     <rect x="73" y="36" width="4" height="8.5" rx="2" fill="#d94f73"/>` },

  { id: 'acc-gloves', slot: 'acc', name: '복싱 글러브', price: 200, svg:
    `<circle cx="30.5" cy="73.5" r="7" fill="#e53950"/>
     <circle cx="69.5" cy="73.5" r="7" fill="#e53950"/>
     <ellipse cx="35" cy="71.5" rx="2.6" ry="3.4" fill="#e53950"/>
     <ellipse cx="65" cy="71.5" rx="2.6" ry="3.4" fill="#e53950"/>
     <path d="M26.5 67.5 Q30.5 65.8 34.5 67.5" stroke="#b71c3c" stroke-width="2.6" fill="none"/>
     <path d="M65.5 67.5 Q69.5 65.8 73.5 67.5" stroke="#b71c3c" stroke-width="2.6" fill="none"/>
     <circle cx="28" cy="72" r="1.6" fill="#fff" opacity=".5"/><circle cx="67" cy="72" r="1.6" fill="#fff" opacity=".5"/>` },

  { id: 'acc-catears', slot: 'acc', name: '고양이 귀', price: 220, svg:
    `<path d="M29.5 23 L33 7.5 L43 16.5 Z" fill="#4a3a30"/>
     <path d="M32.2 19.5 L34.2 10.8 L40 16 Z" fill="#ff9ec7"/>
     <path d="M70.5 23 L67 7.5 L57 16.5 Z" fill="#4a3a30"/>
     <path d="M67.8 19.5 L65.8 10.8 L60 16 Z" fill="#ff9ec7"/>` },

  { id: 'acc-halo', slot: 'acc', name: '천사의 링', price: 300, svg:
    `<ellipse cx="50" cy="8.5" rx="15" ry="4.6" fill="none" stroke="#ffd700" stroke-width="5" opacity=".28"/>
     <ellipse cx="50" cy="8.5" rx="13.5" ry="4" fill="none" stroke="#ffd700" stroke-width="2.6"/>` },

  { id: 'acc-sword', slot: 'acc', name: '등에 멘 검', price: 350, svg:
    `<path d="M25.5 55 L16.5 36.5" stroke="#8d6e63" stroke-width="4.6" stroke-linecap="round"/>
     <path d="M25.5 55 L16.5 36.5" stroke="#5d4037" stroke-width="4.6" stroke-linecap="round" stroke-dasharray="2.6 2.2"/>
     <path d="M10.8 39.5 L21.5 34.3" stroke="#c9a24b" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M14.5 32.5 L18 30.8" stroke="#eceff1" stroke-width="3.4" stroke-linecap="round"/>
     <circle cx="15" cy="34.5" r="2.9" fill="#c9a24b"/><circle cx="15" cy="34.5" r="1.2" fill="#ff5e7e"/>` },

  { id: 'acc-crown', slot: 'acc', name: '황금 왕관', price: 500, svg:
    `<path d="M36 20.5 L39 9 L45.5 16 L50 6 L54.5 16 L61 9 L64 20.5 Z" fill="#ffd700"/>
     <rect x="35.4" y="19.4" width="29.2" height="4.8" rx="2.2" fill="#f4b400"/>
     <circle cx="50" cy="12.5" r="1.7" fill="#ff5e7e"/>
     <circle cx="41.5" cy="15.5" r="1.2" fill="#4fc3f7"/>
     <circle cx="58.5" cy="15.5" r="1.2" fill="#4fc3f7"/>` },
];

/* ── catalog + renderer ───────────────────────────────────────────── */

export const AVATAR_ITEMS = [...skinItems, ...hairItems, ...outfitItems, ...accItems];

const ITEM_MAP = Object.fromEntries(AVATAR_ITEMS.map(i => [i.id, i]));

export function getAvatarItem(id) { return ITEM_MAP[id] || null; }
export function getItemsBySlot(slot) { return AVATAR_ITEMS.filter(i => i.slot === slot); }

// Render the composed chibi avatar as an SVG string.
// `avatar` = { skin, hair, outfit, acc } (ids; null/undefined = slot empty).
export function renderAvatarSVG(avatar = {}, size = 180) {
  const pick = (id, slot) => {
    const it = id && ITEM_MAP[id];
    return it && it.slot === slot ? it : null;
  };
  const skin   = pick(avatar.skin, 'skin') || ITEM_MAP[DEFAULT_AVATAR.skin];
  const hair   = pick(avatar.hair, 'hair');
  const outfit = pick(avatar.outfit, 'outfit');
  const acc    = pick(avatar.acc, 'acc');

  const layers =
    skin.svgBody +
    (outfit ? outfit.svg : '') +
    skin.svgHead +
    (hair ? hair.svg : '') +
    (acc ? acc.svg : '');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="avatar">${layers}</svg>`;
}
