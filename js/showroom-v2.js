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
    ...Object.values(SHOWROOM_DEFAULTS).flat().filter(Boolean),
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
const SHAPES30=[
'M12 32q8-16 16 0t16 0 8 0 8-8M18 41l5-4m18 4-5-4','M9 16h38l5 8-5 8v19H9V32l-5-8zM14 20h28M14 46h28','M8 42q8-26 24-26t24 26q-8 12-24 12T8 42M20 35q12 8 24 0','M5 28l18-13 9 12 9-12 18 13-14 8-13-6-13 6z','M14 47V23q0-14 18-14t18 14v24M19 26h26M25 34h3m8 0h3','M32 5q18 22 0 48Q14 27 32 5M19 38l-8 5m34-5 8 5','M32 9l9 8 12 2-5 10 3 12-12 1-7 8-7-8-12-1 3-12-5-10 12-2z','M8 24q8-15 18 0l6-9 6 9q10-15 18 0l-10 15H18zM24 45h16','M32 5l8 16 17 2-13 12 4 17-16-8-16 8 4-17L7 23l17-2z','M10 49q2-25 22-39 20 14 22 39M18 44l14-22 14 22','M7 44q8-28 25-35 17 7 25 35l-14-8-11 14-11-14z','M13 51V22l8-10 11 8 11-8 8 10v29M20 30h24M25 39h14','M8 32q12-20 24 0 12-20 24 0-12 20-24 20T8 32','M7 40q10-30 25-30t25 30l-16-7-9 16-9-16z','M12 51q-4-23 20-42 24 19 20 42M20 40l12-18 12 18','M32 4l9 17 18 4-13 12 3 19-17-9-17 9 3-19L5 25l18-4zM22 31h20','M5 35q13-26 27-10 14-16 27 10-15 2-27 16Q20 37 5 35','M32 6c16 0 25 12 25 25S48 56 32 56 7 44 7 31 16 6 32 6zm-12 25q12-12 24 0-12 12-24 0','M32 5l6 12 13-4-4 13 12 6-12 6 4 13-13-4-6 12-6-12-13 4 4-13-12-6 12-6-4-13 13 4z','M6 39q7-24 26-30 19 6 26 30l-10 14-16-7-16 7zM18 31h28','M10 50V23l10-14 12 12L44 9l10 14v27M18 42h28','M8 47q12-30 24-38 12 8 24 38l-14-9-10 15-10-15zM25 29h14','M12 49q-6-25 20-42 26 17 20 42M18 28q14 14 28 0','M7 53q5-34 25-46 20 12 25 46l-17-9-8 12-8-12z','M5 45l13-32 14 13 14-13 13 32-18-5-9 15-9-15z','M32 4l8 17 18 3-13 13 4 19-17-9-17 9 4-19L6 24l18-3zM12 32h40','M8 48q3-29 24-40 21 11 24 40l-12-8-12 14-12-14zM19 24l13 8 13-8','M9 51V17l12-9 11 14L43 8l12 9v34M18 39h28','M6 42q9-28 26-34 17 6 26 34l-13 11-13-8-13 8zM23 30h18','M8 51l7-26 10 7 7-25 7 25 10-7 7 26zM18 44h28'];
function svgGlyph(item,kind,size=48){if(!item)return'';const i=indexInCategory(item),h=hueFor(item),d=SHAPES30[i];return `<svg class="v2-${kind}-glyph" data-layout="${item.implKey}" viewBox="0 0 64 64" width="${size}" height="${size}" aria-label="${item.name}"><path d="${d}" fill="hsl(${h} 70% 45% / .72)" stroke="hsl(${(h+55)%360} 90% 75%)" stroke-width="2"/><circle cx="${18+i%29}" cy="${17+(i*7)%29}" r="${1+i%4}" fill="#fff"/></svg>`}
export const markerPathV2=id=>{const item=getCatalogItemV2(id);return item?.category==='point_marker'?SHAPES30[indexInCategory(item)]:null};
export const renderCompanionV2=id=>svgGlyph(getCatalogItemV2(id),'companion');
export const renderTrophyV2=id=>svgGlyph(getCatalogItemV2(id),'trophy');
export const renderMarkerV2=id=>svgGlyph(getCatalogItemV2(id),'marker');
export function renderAmbientV2(id){const item=getCatalogItemV2(id);if(!item)return'';const i=indexInCategory(item),family=i%15,count=3+(i%8);return `<span class="v2-ambient ambient-family-${family}" data-layout="${item.implKey}" style="--ambient-h:${hueFor(item)};--ambient-seed:${i}">${Array.from({length:count},(_,n)=>`<i class="ambient-shape-${(family+n)%10}" style="--n:${n}"></i>`).join('')}</span>`}

export function renderProfileEmojiV2(id,size=42){
  const item=getCatalogItemV2(id);
  if(!item)return `<span class="v2-profile-base" style="font-size:${Math.round(size*.66)}px" aria-label="기본 프로필">⚖️</span>`;
  const i=indexInCategory(item),h=hueFor(item),hat=10+(i%6)*2,eye=2+(i%3);
  return `<svg class="v2-profile-emoji" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="${item.name}"><defs><linearGradient id="pe${i}" x2="1" y2="1"><stop stop-color="hsl(${h} 72% 64%)"/><stop offset="1" stop-color="hsl(${(h+55)%360} 62% 36%)"/></linearGradient></defs><circle cx="32" cy="35" r="20" fill="url(#pe${i})"/><path d="M${12+i%5} ${30-i%4} Q32 ${hat} ${52-i%4} ${30-i%4} L${46-i%3} 18 Q32 ${6+i%5} ${18+i%3} 18Z" fill="hsl(${(h+180)%360} 45% 25%)" stroke="hsl(${h} 75% 75%)" stroke-width="2"/><circle cx="24" cy="36" r="${eye}" fill="#fff"/><circle cx="40" cy="36" r="${eye}" fill="#fff"/><path d="M25 47 Q32 ${51+i%3} 39 47" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M32 7 L${36+i%5} ${17+i%4} L28 17Z" fill="hsl(${(h+40)%360} 85% 58%)"/></svg>`;
}

export function renderEmojiBorderV2(id,size=52){
  const item=getCatalogItemV2(id);
  if(!item)return '';
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
  if(!skin&&!marker)return {};
  const h=hueFor(skin),mi=marker?indexInCategory(marker):-1;
  return {actualColor:skin?`hsl(${h} 78% 56%)`:undefined,maColor:skin?`hsl(${(h+55)%360} 82% 64%)`:undefined,gridColor:skin?`hsl(${h} 55% 55% / .16)`:undefined,canvasColor:skin?`hsl(${h} 32% 8%)`:undefined,graphFamily:skin?indexInCategory(skin)%15:null,markerPreset:marker?.implKey||null,markerIndex:marker?mi:-1,markerPath:markerPathV2(marker?.id)};
}

export function applyCardV2(card,raw){
  if(!card)return;const l=normalizeLoadoutV2(raw),theme=getCatalogItemV2(l.card_theme);card.classList.remove('showroom-v2-card');card.removeAttribute('data-card-preset');card.removeAttribute('data-card-family');if(!theme)return;const i=indexInCategory(theme),h=hueFor(theme);
  card.classList.add('showroom-v2-card');card.style.setProperty('--v2h',h);card.style.setProperty('--v2seed',i);card.dataset.cardPreset=theme.implKey;card.dataset.cardFamily=String(i%15);
}
export function decoratePlotV2(plot,raw){
  if(!plot)return;plot.querySelector(':scope > .v2-plot-decor')?.remove();const l=normalizeLoadoutV2(raw),host=document.createElement('div');host.className='v2-plot-decor';
  const companion=getCatalogItemV2(l.companion),ambient=getCatalogItemV2(l.ambient_effect);
  host.innerHTML=`${renderAmbientV2(ambient?.id)}${companion?`<span class="v2-companion">${renderCompanionV2(companion.id)}</span>`:''}<span class="v2-trophies">${l.trophy.map(id=>renderTrophyV2(id)).join('')}</span>`;
  if(host.innerHTML)plot.appendChild(host);
}
export function renderCatalogPreviewV2(item){
  if(item.category==='profile_emoji')return renderProfileEmojiV2(item.id,54);
  if(item.category==='emoji_border')return `<span class="v2-profile" style="width:58px;height:58px">${renderEmojiBorderV2(item.id,62)}${renderProfileEmojiV2(SHOWROOM_DEFAULTS.profile_emoji,42)}</span>`;
  if(item.category==='title')return `<span style="color:${TITLE_RARITY_COLORS[item.rarity]};font-weight:800">${item.name}</span>`;
  if(item.category==='companion')return renderCompanionV2(item.id);
  if(item.category==='trophy')return renderTrophyV2(item.id);
  if(item.category==='point_marker')return renderMarkerV2(item.id);
  if(item.category==='ambient_effect')return renderAmbientV2(item.id);
  return `<span class="v2-item-glyph" data-layout="${item.implKey}" data-family="${indexInCategory(item)%15}" style="--item-h:${hueFor(item)};--item-seed:${Math.max(0,indexInCategory(item))}">${svgGlyph(item,item.category)}</span>`;
}
