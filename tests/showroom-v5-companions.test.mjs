import assert from 'node:assert/strict';
import { SHOWROOM_CATALOG_V2, SHOWROOM_DEFAULTS } from '../js/showroom-catalog-v2.js';
import {
  ALL_CATALOG_V2, V2_CATEGORIES, RETIRED_SHOWROOM_CATEGORIES,
  getCatalogItemV2, normalizeLoadoutV2, ownedItemIdsV2,
  persistableLoadoutV2, renderCompanionV2, validateCatalogPurchaseV2,
} from '../js/showroom-v2.js';

assert.deepEqual(RETIRED_SHOWROOM_CATEGORIES,['companion']);
assert.equal(SHOWROOM_CATALOG_V2.filter(item=>item.category==='companion').length,44,'historical records remain available only for migration safety');
assert.equal(ALL_CATALOG_V2.some(item=>item.category==='companion'),false,'retired companions must not enter the public catalog');
assert.equal(V2_CATEGORIES.includes('companion'),false,'showroom must not expose a companion tab');
assert.equal(getCatalogItemV2('cp_sleepy_golem'),null);
assert.equal(getCatalogItemV2('cp_l01'),null);
assert.equal(renderCompanionV2('cp_l01'),'');
assert.throws(()=>validateCatalogPurchaseV2(['cp_l01']));
assert.equal(normalizeLoadoutV2({...SHOWROOM_DEFAULTS,companion:'cp_l01'}).companion,null);
assert.equal(persistableLoadoutV2({...SHOWROOM_DEFAULTS,companion:'cp_l01'}).companion,null);
assert.deepEqual([...ownedItemIdsV2({purchasedItemsV2:['cp_l01']})],[],'retired ownership must be ignored without damaging stored user data');

console.log('retired companion system tests: PASS');
