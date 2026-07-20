import {
  SHOWROOM_CATALOG_V2, SHOWROOM_CATEGORIES, SHOWROOM_DEFAULTS,
  resolveShowroomItemIdV2,
} from './showroom-catalog-v2.js';
import { TITLES_CATALOG_V2, TITLE_RARITY_COLORS } from './titles-catalog-v2.js';

export const RARITY_META=Object.freeze({
  common:{label:'일반',color:'#FFFFFF'}, uncommon:{label:'고급',color:'#1EFF00'},
  rare:{label:'희귀',color:'#0070DD'}, epic:{label:'영웅',color:'#A335EE'},
  legendary:{label:'전설',color:'#FF8000'},
});
export const CATEGORY_META=Object.freeze({
  graph_skin:{name:'그래프 스킨',icon:'📈'}, card_theme:{name:'카드 테마',icon:'🖼️'},
  point_marker:{name:'포인트 마커',icon:'📍'}, companion:{name:'동반자',icon:'🐾'},
  ambient_effect:{name:'공간 효과',icon:'✨'}, trophy:{name:'트로피',icon:'🏆',multi:true,max:4},
  profile_emoji:{name:'프로필 이모티콘',icon:'🙂'}, emoji_border:{name:'이모티콘 테두리',icon:'⭕'},
  title:{name:'칭호',icon:'🏷️'},
});
export const ALL_CATALOG_V2=Object.freeze([
  ...SHOWROOM_CATALOG_V2,
  ...TITLES_CATALOG_V2.map(entry=>Object.freeze({...entry,category:'title',visual:entry.description,implKey:`title:${entry.id}`})),
]);
const BY_ID=new Map(ALL_CATALOG_V2.map(entry=>[entry.id,entry]));
const canonicalId=id=>resolveShowroomItemIdV2(id);
export const getCatalogItemV2=id=>BY_ID.get(canonicalId(id))||null;
export const itemsByCategoryV2=category=>ALL_CATALOG_V2.filter(entry=>entry.category===category);
export const V2_CATEGORIES=Object.freeze([...SHOWROOM_CATEGORIES,'title']);

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

const rawOwnershipIds=user=>[
  ...Object.values(SHOWROOM_DEFAULTS).flat().filter(Boolean),
  ...(Array.isArray(user?.purchasedItemsV2)?user.purchasedItemsV2:[]),
  ...(Array.isArray(user?.achievementRewardItems)?user.achievementRewardItems:[]),
  ...(Array.isArray(user?.adminGrantedItems)?user.adminGrantedItems:[]),
];
export function ownedItemIdsV2(user){
  return new Set(rawOwnershipIds(user).map(canonicalId).filter(id=>{
    const entry=BY_ID.get(id);return entry&&!entry.testOnly;
  }));
}
export const ownsItemV2=(user,id)=>id==null||ownedItemIdsV2(user).has(canonicalId(id));
export function selectedItemIdsV2(raw){
  const loadout=normalizeLoadoutV2(raw);
  return V2_CATEGORIES.flatMap(category=>Array.isArray(loadout[category])?loadout[category]:(loadout[category]?[loadout[category]]:[]));
}
export function unownedSelectionV2(user,raw){
  return selectedItemIdsV2(raw).filter(id=>!ownsItemV2(user,id)).map(getCatalogItemV2).filter(Boolean);
}
export function persistableLoadoutV2(raw){
  const clean=normalizeLoadoutV2(raw);
  for(const category of SHOWROOM_CATEGORIES){
    if(Array.isArray(clean[category]))clean[category]=clean[category].filter(id=>!getCatalogItemV2(id)?.testOnly);
    else if(getCatalogItemV2(clean[category])?.testOnly)clean[category]=SHOWROOM_DEFAULTS[category];
  }
  return clean;
}
export function validateCatalogPurchaseV2(itemIds){
  const requested=[...new Set(Array.isArray(itemIds)?itemIds:[itemIds])];
  const entries=requested.map(getCatalogItemV2);
  if(!entries.length||entries.some(entry=>!entry||!Number.isFinite(entry.price)||entry.price<0))throw new Error('구매할 수 없는 아이템입니다.');
  if(entries.some(entry=>entry.testOnly||entry.purchasable===false))throw new Error('테스트 아이템은 구매할 수 없습니다.');
  if(entries.some(entry=>entry.acquisition==='achievement_only'))throw new Error('업적으로만 획득할 수 있는 칭호입니다.');
  return entries;
}

const img=(entry,className,attrs='')=>entry?.asset
  ? `<img class="${className}" src="${entry.asset}" alt="" aria-hidden="true" draggable="false" decoding="async" ${attrs}>`
  : '';
export const markerPathV2=()=>null;
export const markerAssetV2=id=>{const entry=getCatalogItemV2(id);return entry?.category==='point_marker'?entry.asset:null};
export const renderCompanionV2=id=>img(getCatalogItemV2(id),'v3-companion-image');
export const renderTrophyV2=id=>img(getCatalogItemV2(id),'v3-trophy-image');
export const renderMarkerV2=id=>img(getCatalogItemV2(id),'v3-marker-image');
export const renderAmbientV2=id=>img(getCatalogItemV2(id),'v3-ambient-preview');

export function renderProfileEmojiV2(id,size=42){
  const entry=getCatalogItemV2(id);
  if(!entry)return `<span class="v3-profile-base" style="font-size:${Math.round(size*.66)}px" aria-label="기본 프로필">⚖️</span>`;
  return `<img class="v3-profile-emoji" src="${entry.asset}" width="${size}" height="${size}" alt="${entry.name}" draggable="false" decoding="async">`;
}
export function renderEmojiBorderV2(id,size=52){
  const entry=getCatalogItemV2(id);
  return entry?`<img class="v3-emoji-border" src="${entry.asset}" width="${size}" height="${size}" alt="" aria-hidden="true" draggable="false" decoding="async">`:'';
}
export function profileVisualV2(raw,size=48){
  const loadout=normalizeLoadoutV2(raw);
  return `<span class="v2-profile" style="width:${size}px;height:${size}px">${renderEmojiBorderV2(loadout.emoji_border,size+14)}${renderProfileEmojiV2(loadout.profile_emoji,size-8)}</span>`;
}
export function titleInfoV2(raw){
  const loadout=normalizeLoadoutV2(raw),entry=getCatalogItemV2(loadout.title);
  return entry?{...entry,color:TITLE_RARITY_COLORS[entry.rarity]}:null;
}

const graphColors=Object.freeze({
  gs_explorer_parchment:['#ffd166','#f4a261','rgba(255,209,102,.24)'],
  gs_frost_runestone:['#67e8f9','#93c5fd','rgba(103,232,249,.22)'],
  gs_dragonbone_slab:['#e7d8c5','#f59e0b','rgba(231,216,197,.20)'],
  gs_cosmic_timekeeper:['#fbbf24','#c4b5fd','rgba(251,191,36,.22)'],
});
export function getChartDecorationsV2(raw){
  const loadout=normalizeLoadoutV2(raw),skin=getCatalogItemV2(loadout.graph_skin),marker=getCatalogItemV2(loadout.point_marker);
  if(!skin&&!marker)return {};
  const colors=graphColors[skin?.id];
  return {
    actualColor:colors?.[0], maColor:colors?.[1], gridColor:colors?.[2],
    markerPreset:marker?.id||null, markerAsset:marker?.asset||null,
  };
}

export function applyCardV2(card,raw){
  if(!card)return;
  const loadout=normalizeLoadoutV2(raw),theme=getCatalogItemV2(loadout.card_theme);
  card.classList.remove('showroom-v2-card');
  card.style.removeProperty('--v3-card-image');
  card.removeAttribute('data-card-preset');
  if(!theme)return;
  card.classList.add('showroom-v2-card');
  card.style.setProperty('--v3-card-image',`url("${theme.asset}")`);
  card.dataset.cardPreset=theme.id;
}

export function decorateMainPlotV2(plot,raw){
  if(!plot?.matches?.('[data-main-weight-plot="true"]'))return false;
  plot.querySelector(':scope > .v3-main-plot-decor')?.remove();
  const loadout=normalizeLoadoutV2(raw),graph=getCatalogItemV2(loadout.graph_skin),ambient=getCatalogItemV2(loadout.ambient_effect);
  const companion=getCatalogItemV2(loadout.companion);
  const trophies=loadout.trophy.map(getCatalogItemV2).filter(Boolean);
  if(!graph&&!ambient&&!companion&&!trophies.length)return false;
  const host=document.createElement('div');
  host.className='v3-main-plot-decor';host.setAttribute('aria-hidden','true');host.dataset.showroomMainPlot='true';host.dataset.aspectRatio='16:9';
  host.innerHTML=`${img(graph,'v3-graph-layer')}${img(ambient,'v3-ambient-layer')}<span class="v3-plot-scrim"></span>${companion?`<span class="v2-companion">${renderCompanionV2(companion.id)}</span>`:''}<span class="v2-trophies">${trophies.map(entry=>renderTrophyV2(entry.id)).join('')}</span>`;
  plot.prepend(host);
  return true;
}
// Compatibility wrapper: callers must explicitly opt into the main 16:9 weight plot.
export function decoratePlotV2(plot,raw,options={}){return options.mainPlot===true?decorateMainPlotV2(plot,raw):false}

export function renderCatalogPreviewV2(entry){
  if(entry.category==='profile_emoji')return renderProfileEmojiV2(entry.id,64);
  if(entry.category==='emoji_border')return `<span class="v2-profile v3-catalog-profile" style="width:68px;height:68px">${renderEmojiBorderV2(entry.id,76)}${renderProfileEmojiV2(SHOWROOM_DEFAULTS.profile_emoji,46)}</span>`;
  if(entry.category==='title')return `<span style="color:${TITLE_RARITY_COLORS[entry.rarity]};font-weight:800">${entry.name}</span>`;
  if(entry.category==='companion')return renderCompanionV2(entry.id);
  if(entry.category==='trophy')return renderTrophyV2(entry.id);
  if(entry.category==='point_marker')return renderMarkerV2(entry.id);
  if(entry.category==='ambient_effect')return `<span class="v3-landscape-preview">${renderAmbientV2(entry.id)}</span>`;
  return `<span class="v3-landscape-preview">${img(entry,'v3-catalog-landscape')}</span>`;
}
