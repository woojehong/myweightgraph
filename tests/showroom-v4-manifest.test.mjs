import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  V4_CATEGORIES, V4_DEFAULTS, V4_ITEM_COUNT, V4_QUALITY_TIERS, V4_RARITIES,
  createInventoryTemplateV4, expectedSlotsV4, registerAssetsV4,
  runtimeCatalogV4, runtimeCatalogModuleSourceV4, validateManifestFilesV4, validateManifestV4,
} from '../scripts/showroom-v4-manifest.mjs';
import { assertShowroomCatalogV2 } from '../js/showroom-catalog-v2.js';

assert.equal(V4_ITEM_COUNT,108);
assert.equal(V4_CATEGORIES.length,9);
assert.equal(V4_RARITIES.length,4);
const slots=expectedSlotsV4();
assert.equal(slots.length,108);
assert.equal(new Set(slots.map(entry=>entry.slot)).size,108);
for(const category of V4_CATEGORIES)for(const rarity of V4_RARITIES){
  const group=slots.filter(entry=>entry.category===category&&entry.rarity===rarity);
  assert.equal(group.length,3,`${category}:${rarity}`);
  assert.deepEqual(group.map(entry=>entry.variant),[1,2,3]);
  assert.equal(new Set(group.map(entry=>entry.qualityTier)).size,1);
}
assert.deepEqual(Object.keys(V4_QUALITY_TIERS),V4_RARITIES);
assert.deepEqual(Object.values(V4_QUALITY_TIERS).map(tier=>tier.rank),[1,2,3,4]);

const schema=JSON.parse(await readFile(new URL('../scripts/showroom-v4-manifest.schema.json',import.meta.url),'utf8'));
assert.equal(schema.$schema,'https://json-schema.org/draft/2020-12/schema');
assert.equal(schema.properties.items.minItems,108);
assert.equal(schema.properties.items.maxItems,108);
for(const flag of ['testOnly','purchasable','persistable'])assert.ok(schema.$defs.item.required.includes(flag));
assert.ok(schema.$defs.item.required.includes('motionLayer'));
assert.ok(schema.$defs.item.required.includes('qualityTier'));

function png(width=512,height=512){
  const bytes=Buffer.alloc(32);Buffer.from('89504e470d0a1a0a','hex').copy(bytes);bytes.writeUInt32BE(width,16);bytes.writeUInt32BE(height,20);return bytes;
}
function webp(width=1600,height=900){
  const bytes=Buffer.alloc(32);bytes.write('RIFF',0);bytes.writeUInt32LE(24,4);bytes.write('WEBP',8);bytes.write('VP8 ',12);bytes.writeUInt32LE(12,16);bytes.set([0,0,0,0x9d,0x01,0x2a],20);bytes.writeUInt16LE(width,26);bytes.writeUInt16LE(height,28);return bytes;
}

const root=await mkdtemp(path.join(os.tmpdir(),'showroom-v4-test-'));
try{
  const assets=path.join(root,'assets'),inventory=createInventoryTemplateV4();
  assert.deepEqual(inventory.defaults,V4_DEFAULTS,'defaults are outside the 108 item inventory');
  for(const entry of inventory.items){
    entry.name=`테스트 ${entry.slot}`;entry.visual=`생성 에셋 ${entry.slot}`;
    if(entry.category==='line_style')continue;
    const target=path.join(assets,...entry.file.split('/'));await mkdir(path.dirname(target),{recursive:true});
    await writeFile(target,entry.expectedExtension==='png'?png():webp());
  }
  const animated=inventory.items[0],motionFile=`${animated.category}/${animated.id}_motion.webp`;
  animated.motionLayer={enabled:true,kind:'sprite-sheet',file:motionFile,loop:true,durationMs:1800,opacity:.75,blendMode:'screen'};
  await writeFile(path.join(assets,...motionFile.split('/')),webp());

  const manifest=await registerAssetsV4({inventory,assetDirectory:assets});
  assert.equal(validateManifestV4(manifest),true);
  assert.equal(await validateManifestFilesV4(manifest,assets),true);
  assert.equal(manifest.items.length,108);
  assert.deepEqual(manifest.defaults,V4_DEFAULTS);
  assert.equal(manifest.items.some(entry=>entry.id.includes('default')),false);
  for(const entry of manifest.items){
    assert.equal(entry.testOnly,true);assert.equal(entry.purchasable,false);assert.equal(entry.persistable,false);assert.equal(entry.price,null);
    assert.equal(entry.qualityTier,V4_QUALITY_TIERS[entry.rarity].id);
    assert.ok(entry.motionLayer&&typeof entry.motionLayer.enabled==='boolean');
    if(entry.category==='graph_skin')assert.equal(entry.width*9,entry.height*16);
  }
  assert.equal(manifest.items.filter(entry=>entry.motionLayer.enabled).length,1);
  const runtime=runtimeCatalogV4(manifest);
  assert.equal(runtime.length,108);
  assert.equal(assertShowroomCatalogV2(runtime),true);
  const lineStyles=runtime.filter(entry=>entry.category==='line_style'&&entry.asset===null&&entry.renderSpec);
  assert.equal(lineStyles.length,12);
  assert.equal(new Set(lineStyles.map(entry=>JSON.stringify(entry.renderSpec))).size,12,'all code-native line styles must render differently');
  assert.equal(new Set(lineStyles.map(entry=>entry.renderSpec.color)).size,12);
  assert.equal(runtime.filter(entry=>entry.category==='trophy'&&entry.acquisition==='achievement_only').length,12);
  for(const entry of runtime){assert.equal(entry.testOnly,true);assert.equal(entry.purchasable,false);assert.equal(entry.persistable,false)}
  assert.match(runtimeCatalogModuleSourceV4(manifest),/SHOWROOM_V4_RUNTIME/);

  const unsafe=structuredClone(manifest);unsafe.items[0].purchasable=true;
  assert.throws(()=>validateManifestV4(unsafe),/staging safety flags/);
  const wrongRatio=structuredClone(manifest);const graph=wrongRatio.items.find(entry=>entry.category==='graph_skin');graph.width=1599;
  assert.throws(()=>validateManifestV4(wrongRatio),/exactly 16:9/);
  const missing=structuredClone(manifest);missing.items.pop();
  assert.throws(()=>validateManifestV4(missing),/expected 108 items/);

  const inventoryFile=path.join(root,'inventory.json'),manifestFile=path.join(root,'manifest.json'),templateFile=path.join(root,'template.json'),runtimeFile=path.join(root,'showroom-catalog-v4.generated.js');
  await writeFile(inventoryFile,`${JSON.stringify(inventory)}\n`);
  execFileSync(process.execPath,['scripts/register-showroom-v4-assets.mjs','--inventory',inventoryFile,'--assets',assets,'--output',manifestFile,'--runtime',runtimeFile],{cwd:new URL('..',import.meta.url),stdio:'pipe'});
  execFileSync(process.execPath,['scripts/register-showroom-v4-assets.mjs','--check',manifestFile,'--assets',assets],{cwd:new URL('..',import.meta.url),stdio:'pipe'});
  execFileSync(process.execPath,['scripts/register-showroom-v4-assets.mjs','--template',templateFile],{cwd:new URL('..',import.meta.url),stdio:'pipe'});
  assert.equal(JSON.parse(await readFile(templateFile,'utf8')).items.length,108);
  assert.match(await readFile(runtimeFile,'utf8'),/catalogVersion/);
} finally { await rm(root,{recursive:true,force:true}); }

console.log('showroom v4 manifest foundation tests: PASS');
