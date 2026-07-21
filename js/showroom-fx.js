// ─────────────────────────────────────────────────────────────────────────────
// 쇼룸 코드 네이티브 이펙트 엔진 (그래프선 12종 + 공간효과 12종)
//
// 설계
//  - 등급 = 동시에 살아 움직이는 레이어 수 (고급1~2 / 희귀2~3 / 영웅3~5 / 전설5~7)
//  - 모든 이펙트는 상시 루프. 조건부·트리거 발동 없음.
//  - 레이어 주기는 서로소로 잡아 전체 반복 주기를 길게 만든다(안 질리게).
//  - 데이터 가독성 우선: 선 이펙트는 선 주변만, 공간효과는 플롯 바깥 band만.
// ─────────────────────────────────────────────────────────────────────────────

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// 결정적 의사난수 (프레임마다 값이 튀지 않게 인덱스 기반)
const rnd = (i, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

// ── 경로 유틸 ────────────────────────────────────────────────────────────────
function polyline(meta) {
  const pts = [];
  for (const el of meta?.data || []) {
    if (!el || !Number.isFinite(el.x) || !Number.isFinite(el.y)) continue;
    if (el.skip) continue;
    pts.push({ x: el.x, y: el.y });
  }
  return pts;
}
function cumulative(pts) {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) {
    acc.push(acc[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  return acc;
}
function atDistance(pts, acc, d) {
  const total = acc[acc.length - 1] || 1;
  d = clamp(d, 0, total);
  let i = 1;
  while (i < acc.length && acc[i] < d) i++;
  const a = pts[i - 1], b = pts[i] || pts[i - 1];
  const seg = (acc[i] ?? total) - acc[i - 1] || 1;
  const t = (d - acc[i - 1]) / seg;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
function tracePath(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
}
function withAlpha(color, a) {
  if (typeof color !== 'string') return `rgba(0,229,170,${a})`;
  if (color.startsWith('#')) {
    const h = color.slice(1);
    const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const num = parseInt(n, 16);
    return `rgba(${(num >> 16) & 255},${(num >> 8) & 255},${num & 255},${a})`;
  }
  if (color.startsWith('rgb(')) return color.replace('rgb(', 'rgba(').replace(')', `,${a})`);
  return color;
}

// ── 선 이펙트 레이어 렌더러 ─────────────────────────────────────────────────
const LINE_LAYER = {
  // 넓고 흐린 보조 스트로크 (번짐·발광)
  aura(ctx, pts, L, T, base) {
    ctx.save();
    ctx.strokeStyle = withAlpha(L.color || base.color, (L.alpha ?? .25) * (L.pulse ? .6 + .4 * Math.sin(T / (L.period || 3100) * Math.PI * 2) : 1));
    ctx.lineWidth = base.width * (L.mult ?? 3);
    ctx.lineJoin = ctx.lineCap = 'round';
    if (L.blur) { ctx.shadowColor = withAlpha(L.color || base.color, .9); ctx.shadowBlur = L.blur; }
    tracePath(ctx, pts); ctx.stroke();
    ctx.restore();
  },
  // 흐르는 대시
  flow(ctx, pts, L, T, base) {
    ctx.save();
    ctx.strokeStyle = withAlpha(L.color || base.color, L.alpha ?? .85);
    ctx.lineWidth = base.width * (L.mult ?? .6);
    ctx.setLineDash(L.dash || [10, 12]);
    ctx.lineDashOffset = -(T / (L.period || 1700)) * (L.dist || 60);
    ctx.lineCap = 'round';
    tracePath(ctx, pts); ctx.stroke();
    ctx.restore();
  },
  // 경로를 따라 이동하는 발광 구간
  travel(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1;
    const n = L.count || 1;
    ctx.save(); ctx.lineJoin = ctx.lineCap = 'round';
    for (let k = 0; k < n; k++) {
      const phase = ((T / (L.period || 4300)) + k / n) % 1;
      const head = phase * total;
      const len = total * (L.len ?? .18);
      const steps = 14;
      for (let s = 0; s < steps; s++) {
        const d0 = head - (len * s) / steps, d1 = head - (len * (s + 1)) / steps;
        if (d1 < 0) continue;
        const a = atDistance(pts, acc, d0), b = atDistance(pts, acc, d1);
        const fade = (1 - s / steps) * (L.alpha ?? .9);
        ctx.strokeStyle = withAlpha(L.color || base.color, fade);
        ctx.lineWidth = base.width * (L.mult ?? 1.5) * (1 - s / steps * .5);
        if (L.blur) { ctx.shadowColor = withAlpha(L.color || base.color, .9); ctx.shadowBlur = L.blur; }
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    ctx.restore();
  },
  // 지연 잔상
  ghost(ctx, pts, L, T, base) {
    const lag = Math.round((L.lag ?? 6) + 3 * Math.sin(T / (L.period || 3700) * Math.PI * 2));
    if (pts.length <= lag + 1) return;
    ctx.save();
    ctx.strokeStyle = withAlpha(L.color || base.color, L.alpha ?? .3);
    ctx.lineWidth = base.width * (L.mult ?? .9);
    ctx.lineJoin = ctx.lineCap = 'round';
    const sub = pts.slice(0, pts.length - lag);
    if (sub.length > 1) { tracePath(ctx, sub); ctx.stroke(); }
    ctx.restore();
  },
  // 선을 따라 흩어지는 입자
  motes(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1;
    const n = L.count || 12;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 5300) * (.6 + rnd(i, 3) * .8);
      const ph = ((T / sp) + rnd(i, 1)) % 1;
      const d = ph * total;
      const p = atDistance(pts, acc, d);
      const off = (rnd(i, 2) - .5) * (L.spread ?? 14);
      const life = Math.sin(ph * Math.PI);
      ctx.fillStyle = withAlpha(L.color || base.color, (L.alpha ?? .8) * life);
      const r = (L.size ?? 1.6) * (.6 + rnd(i, 4) * .8);
      ctx.beginPath(); ctx.arc(p.x, p.y + off, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
  // 구간별 색 전이 (다색 궤적)
  spectrum(ctx, pts, L, T, base) {
    if (pts.length < 2) return;
    const cols = L.colors || ['#7cf', '#9f7', '#ff7', '#f97', '#f7c', '#a7f'];
    const g = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[pts.length - 1].x, pts[pts.length - 1].y);
    const shift = (T / (L.period || 6100)) % 1;
    for (let i = 0; i <= cols.length; i++) {
      const stop = i / cols.length;
      g.addColorStop(stop, withAlpha(cols[(i + Math.floor(shift * cols.length)) % cols.length], L.alpha ?? .9));
    }
    ctx.save();
    ctx.strokeStyle = g; ctx.lineWidth = base.width * (L.mult ?? 1.1);
    ctx.lineJoin = ctx.lineCap = 'round';
    if (L.blur) { ctx.shadowColor = withAlpha(cols[0], .7); ctx.shadowBlur = L.blur; }
    tracePath(ctx, pts); ctx.stroke();
    ctx.restore();
  },
  // 데이터 지점에 맺히는 결정/장식
  nodes(ctx, pts, L, T, base) {
    ctx.save();
    for (let i = 0; i < pts.length; i++) {
      const ph = ((T / (L.period || 4700)) + rnd(i, 5)) % 1;
      const s = Math.sin(ph * Math.PI);
      if (s < .05) continue;
      const r = (L.size ?? 2.2) * s;
      ctx.fillStyle = withAlpha(L.color || base.color, (L.alpha ?? .7) * s);
      ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
};

// ── 공간효과 레이어 렌더러 (플롯 바깥 band만) ───────────────────────────────
// band: 데이터 안전영역(중앙) 밖 테두리 영역
function inSafeZone(x, y, area) {
  const w = area.right - area.left, h = area.bottom - area.top;
  const mx = area.left + w / 2, my = area.top + h / 2;
  return Math.abs(x - mx) < w * .36 && Math.abs(y - my) < h * .34;
}
const AMB_LAYER = {
  drift(ctx, area, L, T) {
    const n = L.count || 10;
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 9000) * (.5 + rnd(i, 1));
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const x = area.left + ((rnd(i, 3) + ph * (L.dx ?? .3)) % 1) * (area.right - area.left);
      const y = area.top + ((rnd(i, 4) + ph * (L.dy ?? .1)) % 1) * (area.bottom - area.top);
      if (inSafeZone(x, y, area)) continue;
      const a = (L.alpha ?? .1) * Math.sin(ph * Math.PI);
      ctx.fillStyle = withAlpha(L.color || '#fff', a);
      ctx.beginPath(); ctx.arc(x, y, (L.size ?? 1.5) * (.5 + rnd(i, 5)), 0, Math.PI * 2); ctx.fill();
    }
  },
  rise(ctx, area, L, T) {
    const n = L.count || 10;
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 7000) * (.6 + rnd(i, 1) * .8);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const side = rnd(i, 6) < .5 ? 0 : 1;
      const x = side ? area.right - rnd(i, 3) * (area.right - area.left) * .16
                     : area.left + rnd(i, 3) * (area.right - area.left) * .16;
      const y = area.bottom - ph * (area.bottom - area.top);
      if (inSafeZone(x, y, area)) continue;
      ctx.fillStyle = withAlpha(L.color || '#8f8', (L.alpha ?? .12) * Math.sin(ph * Math.PI));
      ctx.beginPath(); ctx.arc(x, y, (L.size ?? 2) * (.5 + rnd(i, 5)), 0, Math.PI * 2); ctx.fill();
    }
  },
  fall(ctx, area, L, T) {
    const n = L.count || 12;
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 6500) * (.6 + rnd(i, 1) * .9);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const x = area.left + ((rnd(i, 3) + ph * (L.drift ?? .12)) % 1) * (area.right - area.left);
      const y = area.top + ph * (area.bottom - area.top);
      if (inSafeZone(x, y, area)) continue;
      ctx.save();
      ctx.globalAlpha = (L.alpha ?? .14) * Math.sin(ph * Math.PI);
      ctx.fillStyle = L.color || '#fff';
      ctx.beginPath(); ctx.ellipse(x, y, (L.size ?? 1.6), (L.size ?? 1.6) * 1.7, ph * 6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  },
  edgeGlow(ctx, area, L, T) {
    const ph = (T / (L.period || 5200)) % 1;
    const pulse = .5 + .5 * Math.sin(ph * Math.PI * 2);
    const g = ctx.createLinearGradient(0, L.from === 'bottom' ? area.bottom : area.top, 0,
      L.from === 'bottom' ? area.bottom - (area.bottom - area.top) * .3 : area.top + (area.bottom - area.top) * .3);
    g.addColorStop(0, withAlpha(L.color || '#8cf', (L.alpha ?? .12) * pulse));
    g.addColorStop(1, withAlpha(L.color || '#8cf', 0));
    ctx.fillStyle = g;
    ctx.fillRect(area.left, L.from === 'bottom' ? area.bottom - (area.bottom - area.top) * .3 : area.top,
      area.right - area.left, (area.bottom - area.top) * .3);
  },
  streak(ctx, area, L, T) {
    const n = L.count || 3;
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 4300) * (.7 + rnd(i, 1) * .7);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const w = area.right - area.left, h = area.bottom - area.top;
      const x0 = area.left + w * (rnd(i, 3) * .3 - .1) + ph * w * 1.2;
      const y0 = area.top + h * (rnd(i, 4) * .25) + ph * h * .5;
      const len = L.len ?? 26;
      ctx.save();
      ctx.globalAlpha = (L.alpha ?? .5) * Math.sin(ph * Math.PI);
      ctx.strokeStyle = L.color || '#fff'; ctx.lineWidth = L.width ?? 1.4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 - len, y0 - len * .55); ctx.stroke();
      ctx.restore();
    }
  },
  ring(ctx, area, L, T) {
    const n = L.count || 3;
    const cx = (area.left + area.right) / 2, cy = (area.top + area.bottom) / 2;
    const rMax = Math.hypot(area.right - cx, area.bottom - cy);
    for (let i = 0; i < n; i++) {
      const ph = ((T / (L.period || 6700)) + i / n) % 1;
      const r = rMax * (.55 + ph * .5);
      ctx.save();
      ctx.strokeStyle = withAlpha(L.color || '#9cf', (L.alpha ?? .1) * (1 - ph));
      ctx.lineWidth = L.width ?? 1.6;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  },
  silhouette(ctx, area, L, T) {
    const ph = (T / (L.period || 14000)) % 1;
    const w = area.right - area.left, h = area.bottom - area.top;
    const x = area.left - w * .3 + ph * w * 1.6;
    ctx.save();
    ctx.globalAlpha = L.alpha ?? .06;
    ctx.fillStyle = L.color || '#9df';
    ctx.beginPath();
    ctx.ellipse(x, area.top + h * (L.y ?? .82), w * .18, h * .1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};

// ── 이펙트 정의 (그래프선 12) ───────────────────────────────────────────────
// tier: 레이어 수로 등급 표현
const LINE_FX = {
  ls_ink:      { layers:[{k:'aura',mult:2.6,alpha:.18,period:5300,pulse:1}] },
  ls_tape:     { layers:[{k:'flow',dash:[14,10],period:9200,dist:24,alpha:.5,mult:.5}] },
  ls_candle:   { layers:[{k:'aura',mult:2.2,alpha:.16,blur:6,period:4100,pulse:1},
                         {k:'nodes',size:1.8,alpha:.5,period:5900}] },
  ls_vein:     { layers:[{k:'aura',mult:3,alpha:.2,blur:8,period:3700,pulse:1},
                         {k:'flow',dash:[8,14],period:2300,dist:70,alpha:.8,mult:.55}] },
  ls_psi:      { layers:[{k:'aura',mult:2.4,alpha:.16,blur:7,period:4700},
                         {k:'flow',dash:[4,10],period:1900,dist:80,alpha:.7,mult:.5,color:'#9fe8ff'},
                         {k:'nodes',size:1.6,alpha:.45,period:3100,color:'#9fe8ff'}] },
  ls_netthread:{ layers:[{k:'ghost',lag:2,alpha:.3,mult:.7,period:4300},
                         {k:'flow',dash:[6,8],period:2900,dist:50,alpha:.6,mult:.5}] },
  ls_heatline: { layers:[{k:'aura',mult:3.2,alpha:.18,blur:10,period:3100,pulse:1,color:'#ff7b3a'},
                         {k:'travel',color:'#ffb457',len:.16,period:4300,alpha:.85,mult:1.4,blur:10},
                         {k:'motes',color:'#ffd08a',count:14,period:5300,spread:12,size:1.4,alpha:.7},
                         {k:'nodes',color:'#ff9a4a',size:1.6,alpha:.4,period:6100}] },
  ls_current:  { layers:[{k:'aura',mult:2.8,alpha:.16,blur:9,period:2900,pulse:1,color:'#7fd4ff'},
                         {k:'travel',color:'#ffffff',len:.10,period:2300,alpha:.9,mult:1.2,blur:12,count:2},
                         {k:'motes',color:'#cfefff',count:16,period:1700,spread:10,size:1.2,alpha:.75}] },
  ls_afterimage:{layers:[{k:'ghost',lag:9,alpha:.22,mult:1,period:5900},
                         {k:'ghost',lag:4,alpha:.32,mult:.9,period:4100},
                         {k:'aura',mult:2.4,alpha:.14,blur:7,period:3700,pulse:1},
                         {k:'nodes',size:1.5,alpha:.4,period:5300}] },
  ls_frost:    { layers:[{k:'aura',mult:3.4,alpha:.2,blur:12,period:4300,pulse:1,color:'#9fe8ff'},
                         {k:'travel',color:'#ffffff',len:.14,period:5900,alpha:.8,mult:1.3,blur:14},
                         {k:'nodes',color:'#e8faff',size:2.6,alpha:.75,period:3700},
                         {k:'motes',color:'#cfefff',count:18,period:7300,spread:16,size:1.3,alpha:.6},
                         {k:'flow',dash:[3,9],period:6100,dist:40,alpha:.45,mult:.5,color:'#bfeaff'}] },
  ls_gem_trail:{ layers:[{k:'spectrum',period:6100,alpha:.9,mult:1.15,blur:10},
                         {k:'aura',mult:3.2,alpha:.16,blur:12,period:4700,pulse:1,color:'#c9a7ff'},
                         {k:'travel',color:'#ffffff',len:.12,period:3700,alpha:.85,mult:1.2,blur:12,count:2},
                         {k:'motes',color:'#ffd9f5',count:20,period:5300,spread:18,size:1.4,alpha:.7},
                         {k:'nodes',color:'#fff2a8',size:2,alpha:.6,period:4300}] },
  ls_spotlight:{ layers:[{k:'aura',mult:3.6,alpha:.18,blur:14,period:5300,pulse:1,color:'#ffe9a8'},
                         {k:'travel',color:'#ffffff',len:.20,period:4700,alpha:.9,mult:1.5,blur:16},
                         {k:'flow',dash:[5,11],period:2900,dist:66,alpha:.55,mult:.5,color:'#ffe9a8'},
                         {k:'motes',color:'#fff6cf',count:22,period:6700,spread:20,size:1.5,alpha:.75},
                         {k:'nodes',color:'#ffffff',size:2.2,alpha:.65,period:3100}] },
};

// ── 이펙트 정의 (공간효과 12) ───────────────────────────────────────────────
const AMB_FX = {
  ae_dust:      { layers:[{k:'drift',count:8,color:'#d8c9a8',alpha:.10,size:1.4,period:11000}] },
  ae_ink_mote:  { layers:[{k:'fall',count:8,color:'#9fb4c8',alpha:.08,size:1.2,period:12000,drift:.05}] },
  ae_firefly:   { layers:[{k:'drift',count:6,color:'#c8ff9a',alpha:.16,size:1.8,period:9000,dx:.2,dy:.16}] },
  ae_spore:     { layers:[{k:'rise',count:12,color:'#9cf0b0',alpha:.11,size:1.8,period:8300},
                          {k:'edgeGlow',color:'#7fd49a',alpha:.07,period:6700,from:'bottom'}] },
  ae_feather:   { layers:[{k:'fall',count:9,color:'#e8dcc0',alpha:.12,size:2,period:9700,drift:.18},
                          {k:'drift',count:5,color:'#f0e6cc',alpha:.07,size:1.2,period:13000}] },
  ae_grass:     { layers:[{k:'edgeGlow',color:'#8fd98f',alpha:.10,period:5900,from:'bottom'},
                          {k:'drift',count:7,color:'#bdf0a8',alpha:.08,size:1.3,period:10300,dy:.06}] },
  ae_roar:      { layers:[{k:'ring',count:3,color:'#ffd98a',alpha:.09,period:6700,width:1.6},
                          {k:'edgeGlow',color:'#ffc46b',alpha:.09,period:4300},
                          {k:'streak',count:2,color:'#fff3c4',alpha:.35,period:5300,len:20},
                          {k:'drift',count:6,color:'#ffe9b8',alpha:.07,size:1.2,period:11000}] },
  ae_firearrow: { layers:[{k:'streak',count:4,color:'#ffb15c',alpha:.45,period:3700,len:30,width:1.6},
                          {k:'edgeGlow',color:'#ff8a3a',alpha:.08,period:5300},
                          {k:'fall',count:10,color:'#ffcf9a',alpha:.10,size:1.3,period:7300,drift:.1},
                          {k:'drift',count:6,color:'#ffdcae',alpha:.06,size:1,period:12000}] },
  ae_holo:      { layers:[{k:'ring',count:2,color:'#ffe08a',alpha:.08,period:7900,width:1.2},
                          {k:'drift',count:10,color:'#ffe9b0',alpha:.09,size:1.4,period:9400,dx:.16},
                          {k:'edgeGlow',color:'#ffd76b',alpha:.07,period:6100},
                          {k:'streak',count:2,color:'#fff0c0',alpha:.25,period:8300,len:18}] },
  ae_blizzard:  { layers:[{k:'fall',count:16,color:'#e8faff',alpha:.13,size:1.5,period:5300,drift:.22},
                          {k:'fall',count:10,color:'#ffffff',alpha:.09,size:1,period:7900,drift:.14},
                          {k:'edgeGlow',color:'#9fe8ff',alpha:.09,period:6700},
                          {k:'drift',count:8,color:'#cfefff',alpha:.07,size:1.2,period:11300},
                          {k:'ring',count:2,color:'#bfeaff',alpha:.06,period:9700,width:1.2}] },
  ae_gem_nebula:{ layers:[{k:'ring',count:3,color:'#c9a7ff',alpha:.07,period:8900,width:1.4},
                          {k:'drift',count:12,color:'#ffd9f5',alpha:.10,size:1.5,period:10700,dx:.14},
                          {k:'drift',count:9,color:'#a7d9ff',alpha:.08,size:1.2,period:13100,dx:-.1},
                          {k:'edgeGlow',color:'#b08aff',alpha:.08,period:7300},
                          {k:'silhouette',color:'#d0b0ff',alpha:.05,period:17000,y:.2}] },
  ae_ceremony:  { layers:[{k:'fall',count:18,color:'#ffd76b',alpha:.16,size:2,period:6100,drift:.2},
                          {k:'fall',count:12,color:'#7fd4ff',alpha:.13,size:1.8,period:7700,drift:.16},
                          {k:'streak',count:3,color:'#ffffff',alpha:.30,period:4700,len:24},
                          {k:'edgeGlow',color:'#ffe9a8',alpha:.10,period:5900},
                          {k:'ring',count:2,color:'#fff2c0',alpha:.07,period:8300,width:1.4}] },
};

// ── 애니메이션 드라이버 (성능 가드 포함) ────────────────────────────────────
const liveCharts = new Set();
let rafId = null, lastTick = 0;
function loop(ts) {
  rafId = requestAnimationFrame(loop);
  // 셀이 많을수록 프레임 제한 (모아보기 성능 보호)
  const budget = liveCharts.size >= 4 ? 40 : liveCharts.size >= 2 ? 30 : 22; // ms
  if (ts - lastTick < budget) return;
  lastTick = ts;
  if (document.hidden) return;                       // 백그라운드 탭 정지
  for (const c of [...liveCharts]) {
    if (!c.ctx || !c.canvas?.isConnected) { liveCharts.delete(c); continue; }
    try { c.draw(); } catch { liveCharts.delete(c); }
  }
  if (!liveCharts.size && rafId) { cancelAnimationFrame(rafId); rafId = null; }
}
function ensureLoop() { if (!rafId) rafId = requestAnimationFrame(loop); }

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

// ── Chart.js 플러그인 ───────────────────────────────────────────────────────
export const showroomFxPlugin = {
  id: 'showroomFx',
  afterDatasetsDraw(chart, _a, opts) {
    const cfg = opts || chart.options?.plugins?.showroomFx || {};
    const lineId = cfg.lineFx, ambId = cfg.ambientFx;
    const lineSpec = LINE_FX[lineId], ambSpec = AMB_FX[ambId];
    if (!lineSpec && !ambSpec) { liveCharts.delete(chart); return; }

    const ctx = chart.ctx, area = chart.chartArea;
    if (!area || area.right <= area.left) return;
    const T = reduceMotion() ? 0 : performance.now();
    // 모아보기(작은 셀)는 레이어 수를 줄여 성능·가독성 확보
    const dense = cfg.gridCell ? 2 : 99;

    // 공간효과 — 데이터보다 뒤로 보이도록 destination-over 합성
    if (ambSpec) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath(); ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top); ctx.clip();
      ambSpec.layers.slice(0, dense === 2 ? 2 : ambSpec.layers.length).forEach(L => {
        const fn = AMB_LAYER[L.k]; if (fn) { try { fn(ctx, area, L, T); } catch {} }
      });
      ctx.restore();
    }

    // 선 이펙트 — 선 주변에만
    if (lineSpec) {
      const idx = chart.data.datasets.findIndex(d => d.label === '실제 체중');
      const meta = idx >= 0 ? chart.getDatasetMeta(idx) : null;
      const pts = polyline(meta);
      if (pts.length > 1) {
        const acc = cumulative(pts);
        const base = {
          color: chart.data.datasets[idx]?.borderColor || '#00e5aa',
          width: chart.data.datasets[idx]?.borderWidth || 2.2,
        };
        ctx.save();
        ctx.beginPath();
        ctx.rect(area.left - 4, area.top - 4, area.right - area.left + 8, area.bottom - area.top + 8);
        ctx.clip();
        const layers = lineSpec.layers.slice(0, dense === 2 ? 3 : lineSpec.layers.length);
        for (const L of layers) {
          const fn = LINE_LAYER[L.k]; if (!fn) continue;
          try {
            if (L.k === 'travel' || L.k === 'motes') fn(ctx, pts, acc, L, T, base);
            else fn(ctx, pts, L, T, base);
          } catch {}
        }
        ctx.restore();
      }
    }

    if (!reduceMotion()) { liveCharts.add(chart); ensureLoop(); }
  },
  afterDestroy(chart) { liveCharts.delete(chart); },
};

export const LINE_FX_IDS = Object.freeze(Object.keys(LINE_FX));
export const AMBIENT_FX_IDS = Object.freeze(Object.keys(AMB_FX));

// ── 카탈로그 등록용 아이템 (code-native) ────────────────────────────────────
const mk = (category, id, name, rarity, visual, renderSpec) => Object.freeze({
  id, category, name, rarity, price: null,
  asset: null,
  visual, implKey: `${category}:${id}`,
  testOnly: true, purchasable: false, persistable: false,
  renderSpec: Object.freeze(renderSpec),
});

export const LINE_STYLE_ITEMS = Object.freeze([
  mk('line_style','ls_ink','먹선','uncommon','먹이 번진 듯한 부드러운 외곽',{fx:'ls_ink',width:2.2,tension:.15}),
  mk('line_style','ls_tape','라인테이프','uncommon','경기장 라인 같은 단정한 파선',{fx:'ls_tape',width:2.4,dash:[14,10],tension:.05}),
  mk('line_style','ls_candle','촛불선','uncommon','따뜻한 미광이 지점마다 맺힘',{fx:'ls_candle',width:2.2,glowBlur:4,tension:.2}),
  mk('line_style','ls_vein','흐르는 광맥','rare','대시가 선을 따라 흐르고 발광이 맥동',{fx:'ls_vein',width:2.4,glowBlur:6,tension:.2}),
  mk('line_style','ls_psi','사이오닉 선','rare','청백 에너지가 흐르는 결정질 선',{fx:'ls_psi',width:2.3,glowBlur:6,tension:.18}),
  mk('line_style','ls_netthread','골망 실','rare','두 가닥이 그물처럼 엮이며 진행',{fx:'ls_netthread',width:2.2,tension:.22}),
  mk('line_style','ls_heatline','화공 열선','epic','발열대가 선을 훑고 불티가 피어오름',{fx:'ls_heatline',width:2.6,glowBlur:8,tension:.18}),
  mk('line_style','ls_current','심장로 전류','epic','전류가 끊임없이 선을 주파',{fx:'ls_current',width:2.4,glowBlur:8,tension:.15}),
  mk('line_style','ls_afterimage','기억의 잔상','epic','지연 잔상 2겹이 본선을 따라붙음',{fx:'ls_afterimage',width:2.4,tension:.2}),
  mk('line_style','ls_frost','서리 결정선','legendary','결정이 맺혔다 부서지는 냉기 궤적',{fx:'ls_frost',width:2.6,glowBlur:10,tension:.18}),
  mk('line_style','ls_gem_trail','여섯 보석 궤적','legendary','육색 광파가 순차 통과하는 궤적',{fx:'ls_gem_trail',width:2.6,glowBlur:10,tension:.2}),
  mk('line_style','ls_spotlight','우승 스포트라이트','legendary','조명이 선을 훑고 광채가 번짐',{fx:'ls_spotlight',width:2.8,glowBlur:12,tension:.2}),
]);

export const AMBIENT_EFFECT_ITEMS = Object.freeze([
  mk('ambient_effect','ae_dust','경기장 먼지','uncommon','외곽에 흙먼지가 느리게 부유',{fx:'ae_dust'}),
  mk('ambient_effect','ae_ink_mote','먹 티끌','uncommon','미세 먹입자가 천천히 가라앉음',{fx:'ae_ink_mote'}),
  mk('ambient_effect','ae_firefly','마법 반딧불','uncommon','모서리를 떠도는 반딧불',{fx:'ae_firefly'}),
  mk('ambient_effect','ae_spore','포자 유동','rare','좌우에서 포자가 상승',{fx:'ae_spore'}),
  mk('ambient_effect','ae_feather','부엉이 깃털','rare','깃털이 사선으로 낙하',{fx:'ae_feather'}),
  mk('ambient_effect','ae_grass','잔디 바람','rare','하단 잔디 결이 물결침',{fx:'ae_grass'}),
  mk('ambient_effect','ae_roar','함성 파동','epic','관중 함성이 빛 파동으로 밀려옴',{fx:'ae_roar'}),
  mk('ambient_effect','ae_firearrow','불화살비','epic','불화살 궤적과 잔열, 재가 흩날림',{fx:'ae_firearrow'}),
  mk('ambient_effect','ae_holo','홀로 격자','epic','황금 격자와 스캔라인이 순환',{fx:'ae_holo'}),
  mk('ambient_effect','ae_blizzard','서리폭풍','legendary','눈보라 2겹과 냉기 광휘',{fx:'ae_blizzard'}),
  mk('ambient_effect','ae_gem_nebula','보석 성운','legendary','육색 성운이 반대로 흐르며 간섭',{fx:'ae_gem_nebula'}),
  mk('ambient_effect','ae_ceremony','우승 세리머니','legendary','색종이와 스포트라이트, 플래시',{fx:'ae_ceremony'}),
]);
