#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { V4_ITEM_COUNT, createInventoryTemplateV4, registerAssetsV4, runtimeCatalogModuleSourceV4, validateManifestFilesV4 } from './showroom-v4-manifest.mjs';

function usage(message) {
  if (message) console.error(message);
  console.error('Usage:');
  console.error('  node scripts/register-showroom-v4-assets.mjs --template <inventory.json>');
  console.error('  node scripts/register-showroom-v4-assets.mjs --inventory <inventory.json> --assets <dir> --output <manifest.json> [--runtime <module.js>]');
  console.error('  node scripts/register-showroom-v4-assets.mjs --check <manifest.json> --assets <dir>');
  process.exitCode=2;
}
function argsOf(argv) {
  const result={};
  for (let index=0;index<argv.length;index+=2) {
    const key=argv[index],value=argv[index+1];
    if (!key?.startsWith('--')||!value) return null;
    result[key.slice(2)]=value;
  }
  return result;
}
async function readJson(file) { return JSON.parse(await readFile(path.resolve(file),'utf8')); }
async function writeJson(file,value) { await writeFile(path.resolve(file),`${JSON.stringify(value,null,2)}\n`,'utf8'); }

const args=argsOf(process.argv.slice(2));
if (!args) usage('Invalid arguments.');
else if (args.template && Object.keys(args).length===1) {
  await writeJson(args.template,createInventoryTemplateV4());
  console.log(`showroom v4 inventory template: ${V4_ITEM_COUNT} staging slots written`);
} else if (args.inventory && args.assets && args.output && Object.keys(args).every(key=>['inventory','assets','output','runtime'].includes(key))) {
  const manifest=await registerAssetsV4({inventory:await readJson(args.inventory),assetDirectory:path.resolve(args.assets)});
  await writeJson(args.output,manifest);
  const runtimeFile=path.resolve(args.runtime||'js/showroom-catalog-v4.generated.js');
  await writeFile(runtimeFile,runtimeCatalogModuleSourceV4(manifest),'utf8');
  console.log(`showroom v4 manifest: ${manifest.items.length} assets registered (staging only); runtime catalog replaced`);
} else if (args.check && args.assets && Object.keys(args).length===2) {
  const manifest=await readJson(args.check);
  await validateManifestFilesV4(manifest,path.resolve(args.assets));
  console.log(`showroom v4 manifest: ${manifest.items.length} assets verified`);
} else usage('Choose exactly one mode.');
