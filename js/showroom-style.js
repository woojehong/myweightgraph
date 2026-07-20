import { normalizeShowroomLoadout } from './showroom-data.js';

const CARD_CLASSES = ['showroom-card','theme-snow-paper','theme-dusk-glass','theme-cosmic-mesh','theme-obsidian-gold'];

const classFor = {
  ct_snow_paper: 'theme-snow-paper',
  ct_dusk_glass: 'theme-dusk-glass',
  ct_cosmic_mesh: 'theme-cosmic-mesh',
  ct_obsidian_gold: 'theme-obsidian-gold',
};

const companionSvg = {
  cp_sprout: '<svg viewBox="0 0 80 80" role="img" aria-label="새싹 친구"><path d="M40 65c-13 0-22-9-22-21s9-20 22-20 22 8 22 20-9 21-22 21Z" fill="#d9b68c"/><path d="M40 29C34 15 21 12 17 13c2 13 11 19 23 16Zm1 0c5-14 18-18 23-16-2 12-11 18-23 16Z" fill="#61d58b"/><circle cx="33" cy="43" r="2.5"/><circle cx="48" cy="43" r="2.5"/><path d="M35 51c3 3 8 3 11 0" fill="none" stroke="#5b4636" stroke-width="2" stroke-linecap="round"/></svg>',
  cp_cloud: '<svg viewBox="0 0 100 70" role="img" aria-label="구름 친구"><path d="M20 57c-11 0-16-8-13-16 2-7 8-10 15-9 2-13 13-21 26-18 9 2 15 8 17 16 13-2 23 6 23 15 0 7-6 12-14 12Z" fill="#eaf7ff" stroke="#9ad9ef" stroke-width="3"/><circle cx="42" cy="41" r="2.5" fill="#39576b"/><circle cx="57" cy="41" r="2.5" fill="#39576b"/><path d="M44 49c4 3 8 3 12 0" fill="none" stroke="#39576b" stroke-width="2" stroke-linecap="round"/></svg>',
  cp_moon_cat: '<svg viewBox="0 0 86 86" role="img" aria-label="달고양이"><path d="M61 13a31 31 0 1 0 8 55A27 27 0 0 1 61 13Z" fill="#ffd36b"/><path d="m29 34 7-12 8 10 11-9 4 14c8 16-1 31-15 31S22 52 29 34Z" fill="#6f62bd"/><circle cx="38" cy="44" r="2" fill="#fff"/><circle cx="50" cy="44" r="2" fill="#fff"/><path d="M41 51h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
  cp_tiny_dragon: '<svg viewBox="0 0 92 86" role="img" aria-label="꼬마 용"><path d="M28 27 19 13l18 8m27 8 10-14-18 7" fill="#8ee6c5" stroke="#51ad8d" stroke-width="3"/><path d="M24 45c0-17 11-27 25-27s25 11 25 28c0 18-12 28-27 28S24 62 24 45Z" fill="#63cba5"/><path d="M25 50 9 58l17 7m47-14 12 11-14 4" fill="#8ee6c5" stroke="#51ad8d" stroke-width="3"/><circle cx="40" cy="42" r="3"/><circle cx="59" cy="42" r="3"/><path d="M44 54c5 3 10 3 14-1" fill="none" stroke="#265c4a" stroke-width="2"/><path d="m50 8 4 9h-9Z" fill="#ffd26a"/></svg>',
};

const trophyGlyph = {
  tr_copper_leaf: '<span class="trophy trophy-copper" title="코퍼 리프">❧</span>',
  tr_blue_orbit: '<span class="trophy trophy-blue" title="블루 오빗">⊚</span>',
  tr_gold_comet: '<span class="trophy trophy-gold" title="골드 코멧">☄</span>',
  tr_prism_crown: '<span class="trophy trophy-prism" title="프리즘 크라운">♛</span>',
};

export function getChartDecorations(rawLoadout) {
  const loadout = normalizeShowroomLoadout(rawLoadout);
  const skins = {
    gs_mint_grid: { actualColor:'#16e3b1', maColor:'#9cffdf', gridColor:'rgba(42,239,190,.16)', canvasColor:'#081713' },
    gs_sunset_duo: { actualColor:'#ff7a74', maColor:'#ffc267', gridColor:'rgba(255,154,104,.15)', canvasColor:'#1b1018' },
    gs_midnight_neon: { actualColor:'#31d7ff', maColor:'#d16cff', gridColor:'rgba(91,115,255,.18)', canvasColor:'#08091c' },
    gs_aurora_prism: { actualColor:'#88ffc8', maColor:'#d992ff', gridColor:'rgba(116,255,208,.16)', canvasColor:'#08141b' },
  };
  const markers = {
    pm_halo_ring:'circle', pm_blue_diamond:'rectRot', pm_gold_star:'star', pm_comet_gem:'triangle',
  };
  const stamps = {
    rs_flag:'flag', rs_spark:'spark', rs_crown:'crown', rs_meteor:'meteor',
  };
  return {
    ...(skins[loadout.graph_skin] || {}),
    pointStyle: markers[loadout.point_marker] || 'circle',
    pointRadius: loadout.point_marker ? 2.4 : null,
    stampStyle: stamps[loadout.record_stamp] || 'circle',
  };
}

export function applyShowroomStyle(element, rawLoadout) {
  if (!element) return normalizeShowroomLoadout(rawLoadout);
  const loadout = normalizeShowroomLoadout(rawLoadout);
  element.classList.remove(...CARD_CLASSES);
  element.classList.add('showroom-card');
  if (classFor[loadout.card_theme]) element.classList.add(classFor[loadout.card_theme]);
  element.dataset.graphSkin = loadout.graph_skin || '';
  element.dataset.ambient = loadout.ambient_effect || '';

  element.querySelector(':scope > .showroom-decor-layer')?.remove();
  const layer = document.createElement('div');
  layer.className = 'showroom-decor-layer';
  layer.setAttribute('aria-hidden', 'true');
  if (loadout.ambient_effect) {
    const ambient = document.createElement('span');
    ambient.className = `ambient ${loadout.ambient_effect}`;
    ambient.innerHTML = '<i></i><i></i><i></i><i></i><i></i><i></i>';
    layer.appendChild(ambient);
  }
  if (loadout.companion && companionSvg[loadout.companion]) {
    const companion = document.createElement('span');
    companion.className = `showroom-companion ${loadout.companion}`;
    companion.innerHTML = companionSvg[loadout.companion];
    layer.appendChild(companion);
  }
  if (loadout.trophy.length) {
    const shelf = document.createElement('span');
    shelf.className = 'showroom-trophy-shelf';
    shelf.innerHTML = loadout.trophy.map(id => trophyGlyph[id] || '').join('');
    layer.appendChild(shelf);
  }
  element.appendChild(layer);
  return loadout;
}
