import { SHOWROOM_CATALOG_V2, SHOWROOM_CATEGORIES, SHOWROOM_DEFAULTS } from './showroom-catalog-v2.js';
import { TITLES_CATALOG_V2, TITLE_RARITY_COLORS } from './titles-catalog-v2.js';

export const RARITY_META = Object.freeze({
  common:{label:'일반',color:'#FFFFFF'}, uncommon:{label:'고급',color:'#1EFF00'},
  rare:{label:'희귀',color:'#0070DD'}, epic:{label:'영웅',color:'#A335EE'},
  legendary:{label:'전설',color:'#FF8000'},
});
export const CATEGORY_META = Object.freeze({
  graph_skin:{name:'그래프 스킨',icon:'▦'}, card_theme:{name:'카드 테마',icon:'▣'},
  point_marker:{name:'포인트 마커',icon:'◆'}, companion:{name:'동반자',icon:'♧'},
  ambient_effect:{name:'공간 효과',icon:'✦'}, trophy:{name:'트로피',icon:'♜',multi:true,max:4},
  profile_emoji:{name:'프로필 이모티콘',icon:'◉'}, emoji_border:{name:'이모티콘 테두리',icon:'⬡'},
  title:{name:'칭호',icon:'🏷'},
});
export const ALL_CATALOG_V2 = Object.freeze([
  ...SHOWROOM_CATALOG_V2,
  ...TITLES_CATALOG_V2.map(item=>Object.freeze({...item,category:'title',visual:item.description,implKey:`title:${item.id}`})),
]);
const BY_ID = new Map(ALL_CATALOG_V2.map(item=>[item.id,item]));
const indexInCategory = item => ALL_CATALOG_V2.filter(x=>x.category===item.category).findIndex(x=>x.id===item.id);
export const getCatalogItemV2 = id => BY_ID.get(id)||null;
export const itemsByCategoryV2 = category => ALL_CATALOG_V2.filter(item=>item.category===category);
export const V2_CATEGORIES = Object.freeze([...SHOWROOM_CATEGORIES,'title']);

export function normalizeLoadoutV2(raw){
  const src=raw&&typeof raw==='object'?raw:{};
  const out={...SHOWROOM_DEFAULTS,trophy:[],title:null};
  for(const category of V2_CATEGORIES){
    const meta=CATEGORY_META[category];
    if(meta?.multi){
      out[category]=[...new Set(Array.isArray(src[category])?src[category]:[])]
        .filter(id=>BY_ID.get(id)?.category===category).slice(0,meta.max);
    }else{
      const id=src[category];
      out[category]=BY_ID.get(id)?.category===category?id:(category==='title'?null:SHOWROOM_DEFAULTS[category]);
    }
  }
  return out;
}

export function ownedItemIdsV2(user){
  return new Set([
    ...Object.values(SHOWROOM_DEFAULTS).flat(),
    ...(user?.purchasedItemsV2||[]), ...(user?.achievementRewardItems||[]), ...(user?.adminGrantedItems||[]),
  ]);
}
export const ownsItemV2=(user,id)=>id==null||ownedItemIdsV2(user).has(id);
export function selectedItemIdsV2(raw){
  const loadout=normalizeLoadoutV2(raw);
  return V2_CATEGORIES.flatMap(category=>Array.isArray(loadout[category])?loadout[category]:(loadout[category]?[loadout[category]]:[]));
}
export function unownedSelectionV2(user,raw){return selectedItemIdsV2(raw).filter(id=>!ownsItemV2(user,id)).map(getCatalogItemV2).filter(Boolean)}

function hashSeed(text){let n=2166136261;for(const ch of text)n=Math.imul(n^ch.charCodeAt(0),16777619);return n>>>0}
function hueFor(item,offset=0){return (hashSeed(item?.implKey||'default')+offset)%360}

export function renderProfileEmojiV2(id,size=42){
  const item=getCatalogItemV2(id)||getCatalogItemV2(SHOWROOM_DEFAULTS.profile_emoji);
  const i=indexInCategory(item),h=hueFor(item),hat=10+(i%6)*2,eye=2+(i%3);
  return `<svg class="v2-profile-emoji" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="${item.name}"><defs><linearGradient id="pe${i}" x2="1" y2="1"><stop stop-color="hsl(${h} 72% 64%)"/><stop offset="1" stop-color="hsl(${(h+55)%360} 62% 36%)"/></linearGradient></defs><circle cx="32" cy="35" r="20" fill="url(#pe${i})"/><path d="M${12+i%5} ${30-i%4} Q32 ${hat} ${52-i%4} ${30-i%4} L${46-i%3} 18 Q32 ${6+i%5} ${18+i%3} 18Z" fill="hsl(${(h+180)%360} 45% 25%)" stroke="hsl(${h} 75% 75%)" stroke-width="2"/><circle cx="24" cy="36" r="${eye}" fill="#fff"/><circle cx="40" cy="36" r="${eye}" fill="#fff"/><path d="M25 47 Q32 ${51+i%3} 39 47" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M32 7 L${36+i%5} ${17+i%4} L28 17Z" fill="hsl(${(h+40)%360} 85% 58%)"/></svg>`;
}

export function renderEmojiBorderV2(id,size=52){
  const item=getCatalogItemV2(id)||getCatalogItemV2(SHOWROOM_DEFAULTS.emoji_border);
  const i=indexInCategory(item),h=hueFor(item),c=`hsl(${h} 78% 62%)`,a=`hsl(${(h+48)%360} 88% 70%)`;
  const shapes=[
    `<circle cx="32" cy="31" r="25"/><path d="M19 53c7-8 19-8 26 0l-7-2-6 8-6-8z"/>`,
    `<rect x="7" y="7" width="50" height="50" rx="7"/><path d="M7 18h9V7m32 0v11h9M7 46h9v11m32 0V46h9"/>`,
    `<path d="M8 51C4 30 12 12 28 5M56 51C60 30 52 12 36 5"/><path d="M11 39l-8-5 10-3m4-7-8-5 11-2m33 22 8-5-10-3m-4-7 8-5-11-2"/>`,
    `<path d="M5 31q7-9 14 0t14 0t14 0t12 0M7 39q7-9 14 0t14 0t14 0"/>`,
    `<path d="M8 55V27Q9 7 32 5q23 2 24 22v28H44V29q-1-12-12-13Q21 17 20 29v26z"/>`,
    `<path d="M12 13q-8 0-8 8t8 8v22q0 8 8 8h24q8 0 8-8V29q8 0 8-8t-8-8zM12 21h40M12 51h40"/>`,
    `<path d="M27 3h10l2 7 7-3 6 8-5 6 7 4v10l-7 3 5 7-6 7-7-3-2 9H27l-2-9-7 3-6-7 5-7-7-3V25l7-4-5-6 6-8 7 3z"/>`,
    `<ellipse cx="34" cy="33" rx="24" ry="27"/><path d="M11 49Q2 25 25 4 20 23 11 49m1-9 12-11m-15 5 10-9"/>`,
    `<path d="M32 1l5 14 10-11-2 16 15-5-11 12 14 5-14 5 11 12-15-5 2 16-10-11-5 14-5-14-10 11 2-16-15 5 11-12-14-5 14-5L4 15l15 5-2-16 10 11z"/>`,
    `<path d="M32 6C15 6 6 17 6 32s9 26 26 26 26-11 26-26S49 6 32 6z"/><path d="M16 13l8 8-7 8 8 8-7 9m30-33-8 8 7 8-8 8 7 9M28 57l4-12 5 7-5 9z"/>`,
    `<path d="M9 52q1-19 10-30 13-15 26 0 9 11 10 30M15 23q0-14 9-14t9 14m0 0q0-16 9-16t8 18M14 53l8-8 5 11 6-10 7 10 5-11 7 8"/>`,
    `<path d="M10 21q4-14 17-9 8-15 18 0 15-3 14 12-1 8-10 8H14Q4 31 10 21zM17 35l-6 13 11-4-3 13m25-22-6 13 11-4-3 13"/>`,
    `<path d="M5 45Q7 8 32 4q25 4 27 41L49 23 43 52 32 20 21 52 15 23z"/>`,
    `<circle cx="32" cy="32" r="22"/><path d="M32 1v14M32 49v14M1 32h14m34 0h14M10 10l10 10m24 24 10 10M54 10 44 20M20 44 10 54"/>`,
    `<path d="M5 12l18 17-14 3 19 7M59 12 41 29l14 3-19 7M9 52l17-12m29 12L38 40"/>`,
    `<path d="M7 52l8-25 7 10 6-31 7 27 8-20 14 39zM11 52h45"/>`,
    `<path d="M5 43Q9 16 27 9L18 31 5 43zm54 0Q55 16 37 9l9 22 13 12zM18 31l10-8m18 8-10-8"/>`,
    `<ellipse cx="32" cy="32" rx="29" ry="14" transform="rotate(-20 32 32)"/><ellipse cx="32" cy="32" rx="14" ry="29" transform="rotate(25 32 32)"/><circle cx="8" cy="39" r="3"/>`,
    `<path d="M13 9h38l7 12-3 33H9L6 21zM17 15v8m10-8v5m10-5v8m10-8v5M32 32v18m-7-10 7-8 7 8"/>`,
    `<path d="M9 19a11 11 0 0 1 11-11 11 11 0 0 0 0 22M27 12a8 8 0 1 1 0 16M41 8a11 11 0 1 1 0 22M8 43q24 16 48 0"/>`,
    `<path d="M6 5l17 19-12 2 19 8-16 5 18 20m26-54L41 24l12 2-19 8 16 5-18 20"/>`,
    `<path d="M32 2q13 14 4 26 17 5 11 20-8 13-19 2-8 11-17 0-7-14 10-22Q12 15 32 2zM32 10v45"/>`,
    `<path d="M7 49Q3 30 16 23 5 12 18 7q12 2 8 18M57 49q4-19-9-26 11-11-2-16-12 2-8 18M10 51q10-12 17 4m27-4q-10-12-17 4"/>`,
    `<path d="M7 55Q9 13 32 5q23 8 25 50M13 47q4-14 13-17L20 9m31 38q-4-14-13-17l6-21M17 55l8-8 7 10 7-10 8 8"/>`,
    `<path d="M4 48V13l12-8 10 8v35M60 48V13L48 5l-10 8v35M16 18l10 8-10 8m32-16-10 8 10 8M26 26h12"/>`,
    `<circle cx="32" cy="32" r="24" fill="currentColor"/><path d="M32 3l4 12 8-10-1 13 13-5-10 9 14 2-14 5 12 7-14-1 7 11-12-6 1 14-8-11-8 11 1-14-12 6 7-11-14 1 12-7-14-5 14-2-10-9 13 5-1-13 8 10z"/>`,
    `<ellipse cx="32" cy="32" rx="26" ry="18"/><ellipse cx="32" cy="32" rx="18" ry="26"/><path d="M5 32h54M32 5v54"/><circle cx="14" cy="19" r="2"/><circle cx="51" cy="42" r="3"/>`,
    `<path d="M32 3l10 8 12-1-1 13 8 9-8 9 1 13-12-1-10 8-10-8-12 1 1-13-8-9 8-9-1-13 12 1zM13 32h38M32 13v38"/>`,
    `<path d="M32 4Q8 8 8 29q0 17 18 25M32 4q24 4 24 25 0 17-18 25M10 29q9-16 22-8 13-8 22 8M26 54l6-10 6 10"/>`,
    `<path d="M9 55h46l-5-14-8 5-4-22-6 10-6-10-4 22-8-5zM17 12l7 5 8-14 8 14 7-5 5 15H12z"/>`,
  ];
  return `<svg class="v2-emoji-border eb-variant-${i}" data-variant="${i}" data-layout="${item.implKey}" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><g fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="color:${c}">${shapes[i]||shapes[0]}</g><circle cx="32" cy="32" r="22" fill="none" stroke="${a}" stroke-width=".8" opacity=".38"/></svg>`;
}

export function profileVisualV2(raw,size=48){
  const loadout=normalizeLoadoutV2(raw);
  return `<span class="v2-profile" style="width:${size}px;height:${size}px">${renderEmojiBorderV2(loadout.emoji_border,size+12)}${renderProfileEmojiV2(loadout.profile_emoji,size-8)}</span>`;
}
export function titleInfoV2(raw){const l=normalizeLoadoutV2(raw),item=getCatalogItemV2(l.title);return item?{...item,color:TITLE_RARITY_COLORS[item.rarity]}:null}

export function getChartDecorationsV2(raw){
  const l=normalizeLoadoutV2(raw),skin=getCatalogItemV2(l.graph_skin),marker=getCatalogItemV2(l.point_marker);
  const h=hueFor(skin),mi=indexInCategory(marker);
  return {actualColor:`hsl(${h} 78% 56%)`,maColor:`hsl(${(h+55)%360} 82% 64%)`,gridColor:`hsl(${h} 55% 55% / .16)`,canvasColor:`hsl(${h} 32% 8%)`,markerPreset:marker?.implKey||'point_marker:ring',markerIndex:Math.max(0,mi)};
}

export function applyCardV2(card,raw){
  if(!card)return;const l=normalizeLoadoutV2(raw),theme=getCatalogItemV2(l.card_theme),i=indexInCategory(theme),h=hueFor(theme);
  card.classList.add('showroom-v2-card');card.style.setProperty('--v2h',h);card.style.setProperty('--v2seed',i);card.dataset.cardPreset=theme?.implKey||'';
}
function plotGlyph(item,index){const h=hueFor(item);return `<svg viewBox="0 0 48 48"><path d="M24 ${5+index%7} L${39-index%5} 18 L${35+index%4} 39 L13 39 L${8+index%5} 18Z" fill="hsl(${h} 72% 50% / .9)" stroke="hsl(${(h+55)%360} 90% 75%)" stroke-width="2"/><circle cx="24" cy="24" r="${4+index%7}" fill="none" stroke="#fff" stroke-width="2"/></svg>`}
export function decoratePlotV2(plot,raw){
  if(!plot)return;plot.querySelector(':scope > .v2-plot-decor')?.remove();const l=normalizeLoadoutV2(raw),host=document.createElement('div');host.className='v2-plot-decor';
  const companion=getCatalogItemV2(l.companion),ambient=getCatalogItemV2(l.ambient_effect);
  host.innerHTML=`<span class="v2-ambient" style="--ambient-h:${hueFor(ambient)};--ambient-seed:${Math.max(0,indexInCategory(ambient))}">${'<i></i>'.repeat(8)}</span><span class="v2-companion" style="--companion-h:${hueFor(companion)}">${plotGlyph(companion,Math.max(0,indexInCategory(companion)))}</span><span class="v2-trophies">${l.trophy.map((id,n)=>plotGlyph(getCatalogItemV2(id),n+indexInCategory(getCatalogItemV2(id)))).join('')}</span>`;
  plot.appendChild(host);
}
export function renderCatalogPreviewV2(item){
  if(item.category==='profile_emoji')return renderProfileEmojiV2(item.id,54);
  if(item.category==='emoji_border')return `<span class="v2-profile" style="width:58px;height:58px">${renderEmojiBorderV2(item.id,62)}${renderProfileEmojiV2(SHOWROOM_DEFAULTS.profile_emoji,42)}</span>`;
  if(item.category==='title')return `<span style="color:${TITLE_RARITY_COLORS[item.rarity]};font-weight:800">${item.name}</span>`;
  return `<span class="v2-item-glyph" style="--item-h:${hueFor(item)};--item-seed:${Math.max(0,indexInCategory(item))}">${plotGlyph(item,Math.max(0,indexInCategory(item)))}</span>`;
}
