// Compatibility facade for pre-V2 imports. New code should import showroom-v2.js.
export { ALL_CATALOG_V2 as SHOWROOM_ITEMS, V2_CATEGORIES as SHOWROOM_CATEGORIES,
  normalizeLoadoutV2 as normalizeShowroomLoadout, getCatalogItemV2 as getShowroomItem,
  ownsItemV2 as isShowroomItemOwned, unownedSelectionV2 as unownedLoadoutItems } from './showroom-v2.js';
