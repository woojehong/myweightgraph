import * as THREE from './vendor/three/three.module.js';
import { GLTFLoader } from './vendor/three/loaders/GLTFLoader.js';

const MODEL_URL = './assets/avatar-3d/maweg-avatar.glb';
const loader = new GLTFLoader();
let modelPromise;
const mounted = new WeakMap();

const SLOT = {
  body: ['Body', v => ({basic:'basic',slim:'slim',toned:'toned',power:'power',physique:'physique'}[v] || 'basic')],
  face: ['Face', v => v === 'default' ? 'face-01' : v],
  hair: ['Hair', v => v === 'default' ? 'hair-01' : v],
  headgear: ['HeadAccessory', v => v],
  top: ['Top', v => v === 'white-tee' ? 'top-01' : (v === 'bare-chest' ? null : v)],
  bottom: ['Bottom', v => v === 'black-track' ? 'bottom-01' : v],
  shoes: ['Shoes', v => v],
  rightHand: ['RightHand', v => v],
  leftHand: ['LeftHand', v => v],
  effect: ['Effect', v => v],
};

function sourceModel() {
  if (!modelPromise) modelPromise = loader.loadAsync(MODEL_URL).then(gltf => gltf.scene);
  return modelPromise;
}

function cloneGraph(source) {
  const clone = source.clone(true);
  clone.traverse(obj => {
    if (obj.isMesh) {
      obj.material = obj.material.clone();
      obj.frustumCulled = false;
    }
  });
  return clone;
}

function selectedId(value, transform) {
  const id = transform(value);
  return id == null ? null : String(id);
}

function applyAvatar(scene, avatar = {}) {
  Object.entries(SLOT).forEach(([slot, [prefix, transform]]) => {
    const selected = selectedId(avatar[slot], transform);
    scene.traverse(obj => {
      if (obj.name.startsWith(prefix)) {
        obj.visible = selected !== null && obj.name.startsWith(`${prefix}${selected}`);
      }
    });
  });
  applyPose(scene, avatar.pose || 'neutral');
}

const POSES = {
  neutral: {},
  relaxed: {'upperArm.L':[0,0,-.10],'upperArm.R':[0,0,.10],hips:[0,0,.025]},
  'lean-left': {hips:[0,0,.10],chest:[0,0,-.06]},
  'lean-right': {hips:[0,0,-.10],chest:[0,0,.06]},
  hero: {'upperArm.L':[0,0,-.32],'upperArm.R':[0,0,.32],chest:[-.06,0,0]},
  guard: {'upperArm.L':[.25,0,-.55],'upperArm.R':[.25,0,.55],'forearm.L':[0,0,-.45],'forearm.R':[0,0,.45]},
  victory: {'upperArm.L':[0,0,-2.35],'forearm.L':[0,0,-.25],'upperArm.R':[0,0,.25]},
  runner: {'upperArm.L':[.55,0,-.55],'upperArm.R':[-.55,0,.55],'thigh.L':[.5,0,0],'thigh.R':[-.35,0,0]},
  power: {'upperArm.L':[0,0,-1.25],'upperArm.R':[0,0,1.25],'forearm.L':[0,0,-1.0],'forearm.R':[0,0,1.0]},
  cool: {'upperArm.L':[0,0,-.18],'upperArm.R':[0,0,.42],'forearm.R':[0,0,.75],head:[0,0,-.08]},
};

function applyPose(scene, pose) {
  const all = ['hips','chest','head','upperArm.L','upperArm.R','forearm.L','forearm.R','thigh.L','thigh.R'];
  const node = name => scene.getObjectByName(name) || scene.getObjectByName(name.replace(/[._]/g, ''));
  all.forEach(name => node(name)?.rotation.set(0,0,0));
  Object.entries(POSES[pose] || POSES.neutral).forEach(([name, xyz]) => node(name)?.rotation.set(...xyz));
}

function buildRenderer(host, scene, avatar) {
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  host.append(renderer.domElement);

  const world = new THREE.Scene();
  world.add(scene);
  world.add(new THREE.HemisphereLight(0xbfefff, 0x07101a, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 3.1); key.position.set(-2,-3,4); world.add(key);
  const rim = new THREE.DirectionalLight(0x00e5b0, 2.0); rim.position.set(2,1,2); world.add(rim);
  const camera = new THREE.PerspectiveCamera(28, 1, .01, 50);
  camera.position.set(0,1.12,7.0); camera.lookAt(0,1.10,0);

  let raf = 0, start = performance.now(), burst = 0;
  const resize = () => {
    const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize); ro.observe(host); resize();
  const tick = now => {
    const t=(now-start)/1000;
    scene.position.y = Math.sin(t*1.7)*.009;
    const effect=scene.getObjectByName(`Effecteffect-${avatar.effect}`) || scene.getObjectByName(`Effect${avatar.effect}`);
    if(effect){effect.rotation.y=t*.42;effect.scale.setScalar(1+Math.sin(t*2.2)*.025)}
    if(burst>0){
      const p=1-Math.max(0,(burst-now)/950); scene.rotation.y=Math.sin(p*Math.PI)*.22;
      if(now>=burst) burst=0;
    }
    renderer.render(world,camera); raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);
  return {renderer,scene,world,camera,ro,play(){burst=performance.now()+950},destroy(){cancelAnimationFrame(raf);ro.disconnect();renderer.dispose()}};
}

export async function mountAvatar3D(host, avatar = {}) {
  if (!host || mounted.has(host)) return mounted.get(host);
  host.classList.add('avatar-3d-loading');
  const pending = (async () => { try {
    const scene = cloneGraph(await sourceModel());
    applyAvatar(scene, avatar);
    const api=buildRenderer(host,scene,avatar);
    mounted.set(host,api); host.classList.remove('avatar-3d-loading'); host.classList.add('avatar-3d-ready');
    return api;
  } catch (error) {
    host.classList.remove('avatar-3d-loading'); host.classList.add('avatar-3d-failed');
    console.warn('3D avatar fallback:', error);
    return null;
  } })();
  mounted.set(host,pending);
  return pending;
}

export function playAvatar3D(host) { Promise.resolve(mounted.get(host)).then(api => api?.play()); }

export function hydrateAvatar3D(root=document) {
  root.querySelectorAll('.avatar-3d-host:not([data-avatar-3d-mounted])').forEach(host => {
    host.dataset.avatar3dMounted='1';
    let avatar={}; try{avatar=JSON.parse(decodeURIComponent(host.dataset.avatar || '%7B%7D'))}catch{}
    mountAvatar3D(host,avatar);
  });
}

function releaseAvatar3D(root) {
  if (!(root instanceof Element)) return;
  const hosts = root.matches('.avatar-3d-host') ? [root] : [...root.querySelectorAll('.avatar-3d-host')];
  hosts.forEach(host => Promise.resolve(mounted.get(host)).then(api => api?.destroy()));
}

if (typeof document !== 'undefined') {
  queueMicrotask(() => hydrateAvatar3D());
  new MutationObserver(records => {
    if (records.some(r => r.addedNodes.length)) hydrateAvatar3D();
    records.forEach(r => r.removedNodes.forEach(releaseAvatar3D));
  }).observe(document.documentElement,{subtree:true,childList:true});
}
