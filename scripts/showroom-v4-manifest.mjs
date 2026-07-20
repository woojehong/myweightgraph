import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export const V4_SCHEMA_VERSION = 'showroom-v4/1';
export const V4_CATEGORIES = Object.freeze([
  'graph_skin', 'card_theme', 'point_marker', 'companion',
  'ambient_effect', 'trophy', 'profile_emoji', 'emoji_border',
]);
export const V4_RARITIES = Object.freeze(['uncommon', 'rare', 'epic', 'legendary']);
export const V4_VARIANTS_PER_RARITY = 3;
export const V4_ITEM_COUNT = V4_CATEGORIES.length * V4_RARITIES.length * V4_VARIANTS_PER_RARITY;

export const V4_DEFAULTS = Object.freeze({
  graph_skin:null, card_theme:null, point_marker:null, companion:null,
  ambient_effect:null, trophy:[], profile_emoji:null, emoji_border:null,
});

export const V4_QUALITY_TIERS = Object.freeze({
  uncommon:Object.freeze({ id:'quality_1', rank:1, label:'정제', renderScale:1, compressionTarget:82, reviewGate:'standard' }),
  rare:Object.freeze({ id:'quality_2', rank:2, label:'고급', renderScale:1.25, compressionTarget:86, reviewGate:'enhanced' }),
  epic:Object.freeze({ id:'quality_3', rank:3, label:'영웅', renderScale:1.5, compressionTarget:90, reviewGate:'premium' }),
  legendary:Object.freeze({ id:'quality_4', rank:4, label:'전설', renderScale:2, compressionTarget:94, reviewGate:'hero' }),
});

const PREFIX_BY_CATEGORY = Object.freeze({
  graph_skin:'gs', card_theme:'ct', point_marker:'pm', companion:'cp',
  ambient_effect:'ae', trophy:'tr', profile_emoji:'pe', emoji_border:'eb',
});
const EXT_BY_CATEGORY = Object.freeze({
  graph_skin:'webp', card_theme:'webp', point_marker:'png', companion:'png',
  ambient_effect:'webp', trophy:'png', profile_emoji:'png', emoji_border:'png',
});
const MIME_BY_EXT = Object.freeze({ png:'image/png', webp:'image/webp' });
const MOTION_KINDS = new Set(['none', 'css-loop', 'sprite-sheet']);
const BLEND_MODES = new Set(['normal', 'screen', 'multiply', 'overlay', 'soft-light']);

export const slotIdV4 = (category, rarity, variant) => `${category}:${rarity}:${String(variant).padStart(2, '0')}`;

export function expectedSlotsV4() {
  return V4_CATEGORIES.flatMap(category => V4_RARITIES.flatMap(rarity =>
    Array.from({ length:V4_VARIANTS_PER_RARITY }, (_, index) => {
      const variant=index+1, prefix=PREFIX_BY_CATEGORY[category], ext=EXT_BY_CATEGORY[category];
      return Object.freeze({
        slot:slotIdV4(category,rarity,variant), category, rarity, variant,
        suggestedId:`${prefix}_v4_${rarity}_${String(variant).padStart(2,'0')}`,
        expectedExtension:ext, qualityTier:V4_QUALITY_TIERS[rarity].id,
      });
    }),
  ));
}

export function createInventoryTemplateV4() {
  return {
    schemaVersion:V4_SCHEMA_VERSION,
    note:'Generation inventory only. This file is not an active showroom catalog.',
    defaults:{ ...V4_DEFAULTS, trophy:[] },
    items:expectedSlotsV4().map(slot => ({
      ...slot, id:slot.suggestedId, name:'', visual:'',
      file:`${slot.category}/${slot.suggestedId}.${slot.expectedExtension}`,
      motionLayer:{ enabled:false, kind:'none', file:null, loop:false, durationMs:null, opacity:1, blendMode:'normal' },
    })),
  };
}

function fail(message) { throw new Error(`showroom v4 manifest: ${message}`); }
function isRecord(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function assertExactDefaults(defaults) {
  if (!isRecord(defaults)) fail('defaults must be an object');
  if (JSON.stringify(defaults) !== JSON.stringify(V4_DEFAULTS)) fail('defaults must remain separate null/empty selections');
}
function assertMotionLayer(motion, itemId) {
  if (!isRecord(motion)) fail(`${itemId}: missing motionLayer`);
  for (const key of ['enabled','kind','asset','loop','durationMs','opacity','blendMode']) if (!(key in motion)) fail(`${itemId}: motionLayer missing ${key}`);
  if (typeof motion.enabled !== 'boolean' || !MOTION_KINDS.has(motion.kind)) fail(`${itemId}: invalid motionLayer state`);
  if (motion.enabled !== (motion.kind !== 'none')) fail(`${itemId}: motionLayer enabled/kind mismatch`);
  if (motion.enabled && (typeof motion.asset !== 'string' || !motion.asset)) fail(`${itemId}: enabled motionLayer requires asset`);
  if (!motion.enabled && motion.asset !== null) fail(`${itemId}: disabled motionLayer asset must be null`);
  if (typeof motion.loop !== 'boolean' || !BLEND_MODES.has(motion.blendMode)) fail(`${itemId}: invalid motionLayer playback metadata`);
  if (!Number.isFinite(motion.opacity) || motion.opacity < 0 || motion.opacity > 1) fail(`${itemId}: invalid motionLayer opacity`);
  if (motion.durationMs !== null && (!Number.isInteger(motion.durationMs) || motion.durationMs <= 0)) fail(`${itemId}: invalid motionLayer durationMs`);
}

export function validateManifestV4(manifest) {
  if (!isRecord(manifest)) fail('manifest must be an object');
  if (manifest.schemaVersion !== V4_SCHEMA_VERSION || manifest.catalogVersion !== 'v4' || manifest.status !== 'staging') fail('invalid version or status');
  if (manifest.assetRoot !== './assets/showroom-v4') fail('assetRoot must be ./assets/showroom-v4');
  if (manifest.variantsPerRarity !== V4_VARIANTS_PER_RARITY) fail('variantsPerRarity must be 3');
  if (JSON.stringify(manifest.categories) !== JSON.stringify(V4_CATEGORIES)) fail('invalid category order');
  if (JSON.stringify(manifest.rarities) !== JSON.stringify(V4_RARITIES)) fail('invalid rarity order');
  assertExactDefaults(manifest.defaults);
  if (JSON.stringify(manifest.qualityTiers) !== JSON.stringify(V4_QUALITY_TIERS)) fail('qualityTiers metadata mismatch');
  if (!Array.isArray(manifest.items) || manifest.items.length !== V4_ITEM_COUNT) fail(`expected ${V4_ITEM_COUNT} items`);
  const expected=new Set(expectedSlotsV4().map(entry=>entry.slot)), ids=new Set(), assets=new Set();
  for (const entry of manifest.items) {
    for (const key of ['slot','id','category','rarity','variant','name','visual','asset','mimeType','width','height','byteLength','sha256','qualityTier','motionLayer','testOnly','purchasable','persistable']) {
      if (!(key in entry) || entry[key] === '') fail(`${entry.id || entry.slot || 'item'}: missing ${key}`);
    }
    if (!expected.delete(entry.slot)) fail(`${entry.slot}: unexpected or duplicate slot`);
    if (!V4_CATEGORIES.includes(entry.category) || !V4_RARITIES.includes(entry.rarity)) fail(`${entry.id}: invalid category or rarity`);
    if (entry.slot !== slotIdV4(entry.category,entry.rarity,entry.variant)) fail(`${entry.id}: slot fields mismatch`);
    if (!entry.id.startsWith(`${PREFIX_BY_CATEGORY[entry.category]}_`) || !/^[a-z0-9_]+$/.test(entry.id)) fail(`${entry.id}: invalid id`);
    if (ids.has(entry.id)) fail(`duplicate id ${entry.id}`); ids.add(entry.id);
    if (assets.has(entry.asset)) fail(`duplicate asset ${entry.asset}`); assets.add(entry.asset);
    const ext=EXT_BY_CATEGORY[entry.category];
    if (!entry.asset.startsWith(`./assets/showroom-v4/${entry.category}/`) || path.extname(entry.asset).toLowerCase() !== `.${ext}`) fail(`${entry.id}: invalid asset path`);
    if (entry.mimeType !== MIME_BY_EXT[ext]) fail(`${entry.id}: invalid mimeType`);
    if (!Number.isInteger(entry.width) || entry.width <= 0 || !Number.isInteger(entry.height) || entry.height <= 0 || !Number.isInteger(entry.byteLength) || entry.byteLength <= 0 || !/^[a-f0-9]{64}$/.test(entry.sha256)) fail(`${entry.id}: invalid file metadata`);
    if (entry.category==='graph_skin' && entry.width*9!==entry.height*16) fail(`${entry.id}: graph skin source must be exactly 16:9`);
    if (entry.qualityTier !== V4_QUALITY_TIERS[entry.rarity].id) fail(`${entry.id}: qualityTier mismatch`);
    if (entry.testOnly !== true || entry.purchasable !== false || entry.persistable !== false) fail(`${entry.id}: staging safety flags must block purchase and save`);
    if (entry.price !== null) fail(`${entry.id}: staging price must remain null`);
    assertMotionLayer(entry.motionLayer,entry.id);
  }
  if (expected.size) fail(`missing slots: ${[...expected].slice(0,3).join(', ')}`);
  return true;
}

function canonicalRelativeFile(file, category, expectedExt, itemId) {
  if (typeof file !== 'string' || !file) fail(`${itemId}: missing file`);
  const normalized=file.replaceAll('\\','/').replace(/^\.\//,'');
  if (normalized.includes('..') || !normalized.startsWith(`${category}/`) || path.posix.extname(normalized).toLowerCase() !== `.${expectedExt}`) fail(`${itemId}: invalid source file`);
  return normalized;
}
function detectMime(bytes, ext, itemId) {
  const png=bytes.length>=8&&bytes.subarray(0,8).toString('hex')==='89504e470d0a1a0a';
  const webp=bytes.length>=12&&bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP';
  if ((ext==='png'&&!png)||(ext==='webp'&&!webp)) fail(`${itemId}: file signature does not match .${ext}`);
}
function imageDimensions(bytes,ext,itemId) {
  if (ext==='png' && bytes.length>=24) return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
  if (ext==='webp' && bytes.length>=30) {
    const kind=bytes.subarray(12,16).toString();
    if (kind==='VP8 ') return {width:bytes.readUInt16LE(26)&0x3fff,height:bytes.readUInt16LE(28)&0x3fff};
    if (kind==='VP8X') return {width:1+bytes.readUIntLE(24,3),height:1+bytes.readUIntLE(27,3)};
    if (kind==='VP8L' && bytes.length>=25) {
      const b1=bytes[21],b2=bytes[22],b3=bytes[23],b4=bytes[24];
      return {width:1+(b1|((b2&0x3f)<<8)),height:1+((b2>>6)|(b3<<2)|((b4&0x0f)<<10))};
    }
  }
  fail(`${itemId}: unsupported or truncated image header`);
}
async function fileMetadata(absolute, ext, itemId) {
  const [bytes,info]=await Promise.all([readFile(absolute),stat(absolute)]);
  if (!info.isFile() || !bytes.length) fail(`${itemId}: asset is not a non-empty file`);
  detectMime(bytes,ext,itemId);
  return { ...imageDimensions(bytes,ext,itemId), byteLength:bytes.length, sha256:createHash('sha256').update(bytes).digest('hex') };
}

export async function registerAssetsV4({ inventory, assetDirectory }) {
  if (!isRecord(inventory) || !Array.isArray(inventory.items)) fail('inventory.items must be an array');
  assertExactDefaults(inventory.defaults);
  if (inventory.items.length !== V4_ITEM_COUNT) fail(`inventory expected ${V4_ITEM_COUNT} items`);
  const items=[];
  for (const source of inventory.items) {
    const ext=EXT_BY_CATEGORY[source.category], relative=canonicalRelativeFile(source.file,source.category,ext,source.id);
    const metadata=await fileMetadata(path.resolve(assetDirectory,relative),ext,source.id);
    const motion=source.motionLayer || { enabled:false,kind:'none',file:null,loop:false,durationMs:null,opacity:1,blendMode:'normal' };
    let motionAsset=null;
    if (motion.enabled) {
      const motionRelative=canonicalRelativeFile(motion.file,source.category,path.posix.extname(motion.file).slice(1).toLowerCase(),`${source.id}:motion`);
      const motionExt=path.posix.extname(motionRelative).slice(1).toLowerCase();
      if (!['png','webp'].includes(motionExt)) fail(`${source.id}: unsupported motion asset extension`);
      await fileMetadata(path.resolve(assetDirectory,motionRelative),motionExt,`${source.id}:motion`);
      motionAsset=`./assets/showroom-v4/${motionRelative}`;
    }
    items.push({
      slot:source.slot, id:source.id, category:source.category, rarity:source.rarity, variant:source.variant,
      name:source.name, visual:source.visual, asset:`./assets/showroom-v4/${relative}`, mimeType:MIME_BY_EXT[ext],
      ...metadata, price:null, qualityTier:V4_QUALITY_TIERS[source.rarity]?.id,
      motionLayer:{ enabled:!!motion.enabled, kind:motion.kind, asset:motionAsset, loop:!!motion.loop, durationMs:motion.durationMs??null, opacity:motion.opacity??1, blendMode:motion.blendMode||'normal' },
      testOnly:true, purchasable:false, persistable:false,
    });
  }
  const manifest={
    schemaVersion:V4_SCHEMA_VERSION, catalogVersion:'v4', status:'staging', assetRoot:'./assets/showroom-v4',
    categories:[...V4_CATEGORIES], rarities:[...V4_RARITIES], variantsPerRarity:V4_VARIANTS_PER_RARITY,
    defaults:{ ...V4_DEFAULTS, trophy:[] }, qualityTiers:JSON.parse(JSON.stringify(V4_QUALITY_TIERS)), items,
  };
  validateManifestV4(manifest);
  return manifest;
}

export async function validateManifestFilesV4(manifest, assetDirectory) {
  validateManifestV4(manifest);
  for (const entry of manifest.items) {
    const relative=entry.asset.slice(`${manifest.assetRoot}/`.length),ext=path.posix.extname(relative).slice(1);
    const metadata=await fileMetadata(path.resolve(assetDirectory,relative),ext,entry.id);
    if (metadata.byteLength!==entry.byteLength||metadata.sha256!==entry.sha256) fail(`${entry.id}: asset metadata changed`);
    if (entry.motionLayer.enabled) {
      const motionRelative=entry.motionLayer.asset.slice(`${manifest.assetRoot}/`.length),motionExt=path.posix.extname(motionRelative).slice(1);
      await fileMetadata(path.resolve(assetDirectory,motionRelative),motionExt,`${entry.id}:motion`);
    }
  }
  return true;
}
