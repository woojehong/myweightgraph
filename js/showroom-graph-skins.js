import { SHOWROOM_V4_RUNTIME } from './showroom-catalog-v4.generated.js';

// Graph skins are promoted independently from the staging manifest after
// asset QA. Keeping the generated manifest staging-only prevents accidental
// release of other unfinished V4 categories.
export const GRAPH_SKIN_PRICE_BY_RARITY = Object.freeze({
  uncommon: 900,
  rare: 1800,
  epic: 3600,
  legendary: 7200,
});

export const GRAPH_SKIN_SAFE_AREA = Object.freeze({
  x: 0.12,
  y: 0.15,
  width: 0.76,
  height: 0.70,
});

const graphSkinItems = SHOWROOM_V4_RUNTIME.items.filter(entry => entry.category === 'graph_skin');
if (graphSkinItems.length !== 12) throw new Error(`graph_skin: expected 12 generated items, got ${graphSkinItems.length}`);

export const GRAPH_SKIN_ITEMS = Object.freeze(graphSkinItems.map(entry => Object.freeze({
  ...entry,
  price: GRAPH_SKIN_PRICE_BY_RARITY[entry.rarity],
  testOnly: false,
  purchasable: true,
  persistable: true,
  releaseStatus: 'released',
  safeArea: GRAPH_SKIN_SAFE_AREA,
})));

export default GRAPH_SKIN_ITEMS;
