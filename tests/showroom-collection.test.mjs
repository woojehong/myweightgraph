import assert from 'node:assert/strict';
import { SHOWROOM_CATALOG_V2 } from '../js/showroom-catalog-v2.js';
import { ALL_CATALOG_V2 } from '../js/showroom-v2.js';
import { showroomFullSets } from '../js/showroom-taxonomy.js';
import {
  SHOWROOM_PRESET_LIMIT,normalizeShowroomFavorites,normalizeShowroomPresets,showroomCollectionStats,
} from '../js/showroom-collection.js';

const ids=new Set(ALL_CATALOG_V2.map(item=>item.id));
assert.deepEqual(normalizeShowroomFavorites(['bad',ALL_CATALOG_V2[0].id,ALL_CATALOG_V2[0].id],ids),[ALL_CATALOG_V2[0].id]);
assert.equal(normalizeShowroomPresets(Array.from({length:8},(_,i)=>({name:`P${i}`}))).length,SHOWROOM_PRESET_LIMIT);
const sets=showroomFullSets(ALL_CATALOG_V2);
assert.ok(sets.every(set=>Object.values(set.presetMap).every(Boolean)),'every approved full set needs deterministic canonical members');
const owned=new Set(SHOWROOM_CATALOG_V2.slice(0,5).map(item=>item.id));
const stats=showroomCollectionStats(ALL_CATALOG_V2,owned,sets);
assert.equal(stats.owned,5);
assert.ok(stats.total>stats.owned);
assert.equal(stats.sets.length,17);
console.log('showroom collection tests: PASS');
