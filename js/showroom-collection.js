import { normalizeLoadoutV2 } from './showroom-v2.js?v=96';

export const SHOWROOM_PRESET_LIMIT=5;

export function normalizeShowroomFavorites(raw,catalogIds){
  const valid=catalogIds instanceof Set?catalogIds:new Set(catalogIds||[]);
  return [...new Set(Array.isArray(raw)?raw:[])].filter(id=>valid.has(id));
}

export function normalizeShowroomPresets(raw){
  return (Array.isArray(raw)?raw:[]).slice(0,SHOWROOM_PRESET_LIMIT).map((entry,index)=>Object.freeze({
    id:String(entry?.id||`preset-${index+1}`),
    name:String(entry?.name||`조합 ${index+1}`).trim().slice(0,20)||`조합 ${index+1}`,
    loadout:normalizeLoadoutV2(entry?.loadout),
  }));
}

export function showroomCollectionStats(catalog,ownedIds,fullSets=[]){
  const owned=ownedIds instanceof Set?ownedIds:new Set(ownedIds||[]);
  const eligible=catalog.filter(item=>item.category!=='title'||item.acquisition!=='achievement_only');
  const byCategory=Object.fromEntries([...new Set(catalog.map(item=>item.category))].map(category=>{
    const items=catalog.filter(item=>item.category===category);
    return [category,Object.freeze({owned:items.filter(item=>owned.has(item.id)).length,total:items.length})];
  }));
  const byRarity=Object.fromEntries([...new Set(catalog.map(item=>item.rarity))].map(rarity=>{
    const items=catalog.filter(item=>item.rarity===rarity);
    return [rarity,Object.freeze({owned:items.filter(item=>owned.has(item.id)).length,total:items.length})];
  }));
  const sets=fullSets.map(set=>{
    const canonical=Object.values(set.presetMap||{}).filter(Boolean);
    const count=canonical.filter(item=>owned.has(item.id)).length;
    return Object.freeze({id:set.id,name:set.displayName,owned:count,total:canonical.length,complete:canonical.length>0&&count===canonical.length});
  });
  return Object.freeze({
    owned:eligible.filter(item=>owned.has(item.id)).length,
    total:eligible.length,
    percent:eligible.length?Math.round(eligible.filter(item=>owned.has(item.id)).length/eligible.length*100):0,
    byCategory:Object.freeze(byCategory),
    byRarity:Object.freeze(byRarity),
    sets:Object.freeze(sets),
  });
}
