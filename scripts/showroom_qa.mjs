import { access,stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ALL_CATALOG_V2,RETIRED_SHOWROOM_CATEGORIES } from '../js/showroom-v2.js';
import { showroomFullSets,SHOWROOM_FULL_SET_CATEGORIES } from '../js/showroom-taxonomy.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const errors=[];
const warnings=[];
const ids=new Set();

for(const item of ALL_CATALOG_V2){
  if(ids.has(item.id))errors.push(`${item.id}: duplicate id`);
  ids.add(item.id);
  if(RETIRED_SHOWROOM_CATEGORIES.includes(item.category))errors.push(`${item.id}: retired category active`);
  if(item.asset){
    const local=path.resolve(root,item.asset.replace(/^\.\//,''));
    try{
      await access(local);
      if((await stat(local)).size===0)errors.push(`${item.id}: empty asset`);
    }catch{errors.push(`${item.id}: missing ${item.asset}`)}
  }
}

for(const set of showroomFullSets(ALL_CATALOG_V2)){
  for(const category of SHOWROOM_FULL_SET_CATEGORIES){
    const item=set.presetMap[category];
    if(!item)errors.push(`${set.displayName}: missing canonical ${category}`);
    else if(item.category!==category)errors.push(`${set.displayName}: ${item.id} belongs to ${item.category}, not ${category}`);
  }
}

const rarityCounts=Object.groupBy
  ? Object.fromEntries(Object.entries(Object.groupBy(ALL_CATALOG_V2,item=>item.rarity)).map(([key,value])=>[key,value.length]))
  : ALL_CATALOG_V2.reduce((result,item)=>({...result,[item.rarity]:(result[item.rarity]||0)+1}),{});
if((rarityCounts.mythic||0)>(rarityCounts.epic||0)*1.5)warnings.push('신화 수집품 비중이 영웅 대비 1.5배를 넘었습니다.');

console.log(JSON.stringify({
  status:errors.length?'FAIL':'PASS',
  items:ALL_CATALOG_V2.length,
  sets:showroomFullSets(ALL_CATALOG_V2).length,
  rarityCounts,
  warnings,
  errors,
},null,2));
if(errors.length)process.exitCode=1;
