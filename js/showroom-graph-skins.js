import { SHOWROOM_V4_RUNTIME } from './showroom-catalog-v4.generated.js';
import { GRAPH_SKIN_ITEMS_V12 } from './showroom-graph-skins-v12.js';

// Graph skins are promoted independently from the staging manifest after
// asset QA. Keeping the generated manifest staging-only prevents accidental
// release of other unfinished V4 categories.
export const GRAPH_SKIN_PRICE_BY_RARITY = Object.freeze({
  uncommon: 600,
  rare: 1200,
  epic: 1950,
  legendary: 3000,
});

export const GRAPH_SKIN_SAFE_AREA = Object.freeze({
  x: 0.12,
  y: 0.15,
  width: 0.76,
  height: 0.70,
});

const graphSkinItems = SHOWROOM_V4_RUNTIME.items.filter(entry => entry.category === 'graph_skin');
if (graphSkinItems.length !== 12) throw new Error(`graph_skin: expected 12 generated items, got ${graphSkinItems.length}`);

const promotedRarity = Object.freeze({
  gs_v4_rare_02: 'legendary',
  gs_v4_epic_01: 'legendary',
  gs_v4_epic_03: 'legendary',
});

const releasedItems = graphSkinItems.map(entry => {
  const rarity = promotedRarity[entry.id] ?? entry.rarity;
  return Object.freeze({
  ...entry,
  rarity,
  price: GRAPH_SKIN_PRICE_BY_RARITY[rarity],
  testOnly: false,
  purchasable: true,
  persistable: true,
  releaseStatus: 'released',
  safeArea: GRAPH_SKIN_SAFE_AREA,
  });
});

export const GRAPH_SKIN_ITEMS = Object.freeze([...releasedItems, ...GRAPH_SKIN_ITEMS_V12]);

export default GRAPH_SKIN_ITEMS;
