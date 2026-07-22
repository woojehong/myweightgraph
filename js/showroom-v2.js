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
  graph_skin:{name:'그래프 스킨',icon:'📈'}, line_style:{name:'그래프 선',icon:'〰️'}, card_theme:{name:'카드 테마',icon:'🖼️'},
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
        .map(canonicalId).filter(id=>BY_ID.get(id)?.category===category).slice(0,meta.max);
    }else{
      const id=canonicalId(src[category]);
      out[category]=BY_ID.get(id)?.category===category?id:(category==='title'?null:SHOWROOM_DEFAULTS[category]);
    }
  }
  return out;
}

export function ownedItemIdsV2(user){
  const permanent=[...Object.values(SHOWROOM_DEFAULTS).flat().filter(Boolean),...(user?.purchasedItemsV2||[])];
  const rewardOrAdmin=[...(user?.achievementRewardItems||[]),...(user?.adminGrantedItems||[])];
  // Ownership is historical data and must not disappear when an active item
  // temporarily carries staging flags. Purchase/persistence remain separately
  // blocked by validateCatalogPurchaseV2 and persistableLoadoutV2.
  const owned=new Set([...permanent,...rewardOrAdmin].map(canonicalId).filter(id=>BY_ID.has(id)));
  return owned;
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
    if(Array.isArray(clean[category]))clean[category]=clean[category].filter(id=>{
      const entry=getCatalogItemV2(id);return entry&&!entry.testOnly||entry?.category==='trophy'&&entry.acquisition==='achievement_only';
    });
    else if(getCatalogItemV2(clean[category])?.testOnly)clean[category]=SHOWROOM_DEFAULTS[category];
  }
  return clean;
}
export function validateCatalogPurchaseV2(itemIds){
  const requested=[...new Set(Array.isArray(itemIds)?itemIds:[itemIds])];
  const entries=requested.map(getCatalogItemV2);
  if(!entries.length||entries.some(entry=>!entry))throw new Error('구매할 수 없는 아이템입니다.');
  if(entries.some(entry=>entry.category==='trophy'))throw new Error('트로피는 구매할 수 없으며 업적 달성 또는 관리자 지급으로만 획득할 수 있습니다.');
  if(entries.some(entry=>entry.testOnly||entry.purchasable===false))throw new Error('테스트 아이템은 구매할 수 없습니다.');
  if(entries.some(entry=>!Number.isFinite(entry.price)||entry.price<0))throw new Error('구매할 수 없는 아이템입니다.');
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
  gs_explorer_parchment:['#ffd166','#f4a261','rgba(255,209,102,.24)','#302719'],
  gs_frost_runestone:['#67e8f9','#93c5fd','rgba(103,232,249,.22)','#17283a'],
  gs_dragonbone_slab:['#e7d8c5','#f59e0b','rgba(231,216,197,.20)','#211b18'],
  gs_cosmic_timekeeper:['#fbbf24','#c4b5fd','rgba(251,191,36,.22)','#17152d'],
});
const validHex=color=>typeof color==='string'&&/^#[a-f0-9]{6}$/i.test(color);
const rgbOf=color=>validHex(color)?[1,3,5].map(index=>parseInt(color.slice(index,index+2),16)):null;
const luminance=color=>{const rgb=rgbOf(color);if(!rgb)return null;const linear=rgb.map(value=>{const channel=value/255;return channel<=.04045?channel/12.92:((channel+.055)/1.055)**2.4});return .2126*linear[0]+.7152*linear[1]+.0722*linear[2]};
export function contrastRatioV2(foreground,background){const a=luminance(foreground),b=luminance(background);if(a===null||b===null)return null;return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)}
export function lineContrastAdviceV2(foreground,background='#070b12'){
  const ratio=contrastRatioV2(foreground,background),candidates=['#ffffff','#facc15','#22d3ee','#34d399','#fb7185','#111827'];
  const recommended=candidates.map(color=>({color,ratio:contrastRatioV2(color,background)})).sort((a,b)=>b.ratio-a.ratio)[0];
  return {ratio,passes:ratio!==null&&ratio>=3,recommended:recommended.color,recommendedRatio:recommended.ratio};
}
export function getChartDecorationsV2(raw){
  const loadout=normalizeLoadoutV2(raw),skin=getCatalogItemV2(loadout.graph_skin),marker=getCatalogItemV2(loadout.point_marker),line=getCatalogItemV2(loadout.line_style);
  const ambient=getCatalogItemV2(loadout.ambient_effect);
  if(!skin&&!marker&&!line&&!ambient)return {};
  const colors=graphColors[skin?.id];
  const lineSpec=line?.renderSpec||{},lineColor=validHex(raw?.lineColor)?raw.lineColor:(lineSpec.color||colors?.[0]);
  const requestedWidth=Number(raw?.lineWidth),lineWidth=Number.isFinite(requestedWidth)?Math.max(1,Math.min(6,requestedWidth)):lineSpec.width;
  const rarityBackground={uncommon:'#293039',rare:'#17283a',epic:'#211630',legendary:'#2b1d0d'};
  const backgroundColor=colors?.[3]||rarityBackground[skin?.rarity]||'#070b12';
  return {
    actualColor:lineColor||colors?.[0], maColor:colors?.[1], gridColor:colors?.[2],
    lineColor,lineWidth,lineDash:Array.isArray(lineSpec.dash)?lineSpec.dash:undefined,
    lineGlowBlur:lineSpec.glowBlur,lineTension:lineSpec.tension,
    lineContrast:lineColor?lineContrastAdviceV2(lineColor,backgroundColor):null,
    markerPreset:marker?.id||null, markerAsset:marker?.asset||null,
    // 코드 네이티브 이펙트 id (showroom-fx.js가 해석)
    lineFx:lineSpec.fx||null, ambientFx:ambient?.renderSpec?.fx||null,
  };
}

export function applyCardV2(card,raw){
  if(!card)return false;
  const loadout=normalizeLoadoutV2(raw),theme=getCatalogItemV2(loadout.card_theme);
  const profile=card.matches?.('.cmp-profile,.sr-profile-head')?card:card.querySelector?.(':scope > .cmp-profile, :scope > .sr-profile-head');
  profile?.querySelectorAll?.(':scope > .v3-card-theme-frame, :scope > .v4-card-theme-frame')?.forEach(node=>node.remove());
  profile?.querySelectorAll?.('.mk > .v4-card-badge-frame')?.forEach(node=>node.remove());
  for(const attribute of ['data-card-preset','data-card-theme','data-card-rarity','data-card-effect'])profile?.removeAttribute(attribute);
  if(!theme||!profile)return false;
  const frame=document.createElement('img');
  frame.className=theme.cardAssets?.header?'v4-card-theme-frame':'v3-card-theme-frame';
  frame.src=theme.cardAssets?.header||theme.asset;frame.alt='';frame.setAttribute('aria-hidden','true');
  profile.prepend(frame);
  profile.dataset.cardPreset=theme.id;
  profile.dataset.cardTheme=theme.id;
  profile.dataset.cardRarity=theme.rarity;
  profile.dataset.cardEffect=theme.typography?.effect||'default';
  const badgeAssets=theme.cardAssets||{};
  const badgeMap=[['.mk-max',badgeAssets.max],['.mk-min',badgeAssets.min],['.mk-cur',badgeAssets.current]];
  for(const [selector,asset] of badgeMap){
    const badge=profile.querySelector?.(selector);
    if(!badge||!asset)continue;
    const badgeFrame=document.createElement('img');
    badgeFrame.className='v4-card-badge-frame';badgeFrame.src=asset;badgeFrame.alt='';badgeFrame.setAttribute('aria-hidden','true');
    badge.prepend(badgeFrame);
  }
  return true;
}

export function decorateMainPlotV2(plot,raw){
  if(!plot?.matches?.('[data-main-weight-plot="true"]'))return false;
  plot.querySelector(':scope > .v3-main-plot-decor')?.remove();
  const loadout=normalizeLoadoutV2(raw),graph=getCatalogItemV2(loadout.graph_skin),ambient=getCatalogItemV2(loadout.ambient_effect);
  const companion=getCatalogItemV2(loadout.companion);
  const trophies=loadout.trophy.map(getCatalogItemV2).filter(Boolean);
  if(!graph&&!ambient&&!companion&&!trophies.length)return false;
  const host=document.createElement('div');
  host.className='v3-main-plot-decor';host.setAttribute('aria-hidden','true');host.dataset.showroomMainPlot='true';host.dataset.aspectRatio='16:9';host.dataset.hasGraph=graph?'true':'false';
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
  if(entry.category==='line_style'){const spec=entry.renderSpec||{};return `<span class="v4-line-preview" aria-hidden="true"><span style="border-color:${spec.color||'#00e5aa'};border-top-width:${spec.width||2}px;border-top-style:${spec.dash?.length?'dashed':'solid'};box-shadow:0 0 ${spec.glowBlur||0}px ${spec.color||'#00e5aa'}"></span></span>`}
  if(entry.category==='card_theme'&&entry.cardAssets?.header)return `<span class="v4-card-theme-preview" data-card-theme="${entry.id}" aria-hidden="true"><img class="v4-card-preview-header" src="${entry.cardAssets.header}" alt=""><span class="v4-card-preview-name" data-card-theme="${entry.id}" data-card-effect="${entry.typography?.effect||'default'}">마웨그</span><span class="v4-card-preview-badges"><img src="${entry.cardAssets.max}" alt=""><img src="${entry.cardAssets.min}" alt=""><img src="${entry.cardAssets.current}" alt=""></span></span>`;
  return `<span class="v3-landscape-preview">${img(entry,'v3-catalog-landscape')}</span>`;
}
