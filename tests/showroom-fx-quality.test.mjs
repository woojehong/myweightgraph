import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ambientSafeRectV11, showroomFxPlugin } from '../js/showroom-fx.js';

const ambientIds=[
  'ae11_u_navy_bear_victory','ae11_u_twin_night_game','ae11_u_tiger_homerun',
  'ae11_r_crescent_dragon','ae11_r_imperial_jade_seal','ae11_r_moon_archive',
  'ae11_e_starforged_reactor','ae11_e_spider_rift','ae11_e_vibranium_guard',
  'ae11_m_banshee_dirge','ae11_m_iron_warchief','ae11_m_raven_arcane',
];
const lineIds=[
  'ls12_e_spider_tension','ls12_e_arcane_seam','ls12_m_flamewreath_paradox',
  'ls13_e_star_shield_rally','ls13_u_twins_pinstripe',
];

function canvasRecorder(){
  const calls=[];
  const gradient={addColorStop(){}};
  const ctx=new Proxy({}, {
    get(_target,key){
      if(key==='createLinearGradient'||key==='createRadialGradient')return()=>gradient;
      return(...args)=>{calls.push([key,...args]);};
    },
    set(target,key,value){target[key]=value;return true;},
  });
  return {ctx,calls};
}

function chartFor(ctx){
  return {
    ctx,chartArea:{left:0,top:0,right:640,bottom:360},
    data:{datasets:[{label:'실제 체중',borderColor:'#e2012d',borderWidth:3}]},
    getDatasetMeta:()=>({data:[{x:32,y:190},{x:150,y:120},{x:280,y:214},{x:430,y:104},{x:610,y:168}]}),
  };
}

test('ambient safe zone is an exact centered 72 by 68 percent exclusion',()=>{
  const safe=ambientSafeRectV11({left:0,top:0,right:640,bottom:360});
  assert.deepEqual(safe,{left:89.60000000000002,right:550.4,top:57.599999999999994,bottom:302.4,width:460.79999999999995,height:244.8});
});

test('all differentiated ambient renderers apply an even-odd center exclusion clip',()=>{
  const previousWindow=globalThis.window,previousImage=globalThis.Image;
  globalThis.window={matchMedia:()=>({matches:true})};
  globalThis.Image=class { complete=false;naturalWidth=0;set src(value){this._src=value;} };
  try{
    for(const ambientFx of ambientIds){
      const {ctx,calls}=canvasRecorder();
      assert.doesNotThrow(()=>showroomFxPlugin.beforeDatasetsDraw(chartFor(ctx),null,{ambientFx}),ambientFx);
      assert.ok(calls.some(([method,rule])=>method==='clip'&&rule==='evenodd'),`${ambientFx}: missing center exclusion clip`);
    }
  }finally{
    if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;
    if(previousImage===undefined)delete globalThis.Image;else globalThis.Image=previousImage;
  }
});

test('replacement line renderers execute as layered continuous animations',()=>{
  const previousWindow=globalThis.window;
  globalThis.window={matchMedia:()=>({matches:true})};
  try{
    for(const lineFx of lineIds){
      const {ctx,calls}=canvasRecorder();
      assert.doesNotThrow(()=>showroomFxPlugin.afterDatasetsDraw(chartFor(ctx),null,{lineFx}),lineFx);
      assert.ok(calls.filter(([method])=>method==='stroke').length>=3,`${lineFx}: insufficient layered strokes`);
    }
  }finally{
    if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;
  }
});

test('quality source contracts prevent common ambient template and fixed-distance icon stamping',async()=>{
  const source=await readFile(new URL('../js/showroom-fx.js',import.meta.url),'utf8');
  assert.equal(source.includes('v11LayeredAmbient'),false);
  assert.ok(source.includes("ctx.clip('evenodd')"));
  const lineRanges={
    spider:['  spider(ctx','  crimson(ctx'],
    arcaneSeam:['  arcaneSeam(ctx','  soulHarvest(ctx'],
    flameWreath:['  flameWreath(ctx','  frostTide(ctx'],
    shieldRally:['  shieldRally(ctx','  softBearStitch(ctx'],
    twinsStripe:['  twinsStripe(ctx','  loopyBounce(ctx'],
  };
  for(const [name,[start,end]] of Object.entries(lineRanges)){
    const body=source.slice(source.indexOf(start),source.indexOf(end));
    assert.ok(body.length>300,`${name}: renderer body is too shallow`);
    assert.equal(body.includes('for(let d='),false,`${name}: fixed-distance icon stamping returned`);
  }
  for(const id of ambientIds){
    const start=source.indexOf(`  ${id}(ctx`),next=source.indexOf('\n  },',start);
    const body=source.slice(start,next);
    assert.ok(start>=0&&body.length>420,`${id}: must retain a product-specific event renderer`);
  }
});
