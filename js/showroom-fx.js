// ─────────────────────────────────────────────────────────────────────────────
// 쇼룸 코드 네이티브 이펙트 엔진 (그래프선 12종 + 공간효과 12종)
//
// 설계 원칙
//  - 각 이펙트는 "지배적 형태(dominant primitive)"가 서로 달라 한눈에 구분된다.
//    리본 / 평면테이프 / 불꽃 / 이중선 / 직조 / 전기 / 결정가시 / 무지개구간 / 스윕 ...
//  - 등급 = 동시에 도는 레이어 수 (고급1~2 / 희귀2~3 / 영웅3~4 / 전설5~6)
//  - 상시 루프. 레이어 주기는 서로소로 잡아 반복 티가 안 나게 한다.
//  - 공간효과는 중앙 데이터 영역에서 알파가 0으로 수렴(bandFactor)하여 가독성 보장.
// ─────────────────────────────────────────────────────────────────────────────

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (i, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const TAU = Math.PI * 2;

function withAlpha(color, a) {
  a = clamp(a, 0, 1);
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

// ── 경로 유틸 ────────────────────────────────────────────────────────────────
function polyline(meta) {
  const pts = [];
  for (const el of meta?.data || []) {
    if (!el || !Number.isFinite(el.x) || !Number.isFinite(el.y) || el.skip) continue;
    pts.push({ x: el.x, y: el.y });
  }
  return pts;
}
function cumulative(pts) {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return acc;
}
function atDistance(pts, acc, d) {
  const total = acc[acc.length - 1] || 1;
  d = clamp(d, 0, total);
  let i = 1; while (i < acc.length && acc[i] < d) i++;
  const a = pts[i - 1], b = pts[i] || pts[i - 1];
  const seg = (acc[i] ?? total) - acc[i - 1] || 1;
  const t = (d - acc[i - 1]) / seg;
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t,
           tx: (b.x - a.x) / len, ty: (b.y - a.y) / len,
           nx: -(b.y - a.y) / len, ny: (b.x - a.x) / len };
}
function normalAt(pts, i) {
  const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
  const L = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { nx: -(b.y - a.y) / L, ny: (b.x - a.x) / L };
}
function tracePath(ctx, pts) {
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
}

// ═══════════════════════════════════════════════════════════════════════════
// 선 이펙트 프리미티브 — 각각 형태가 확연히 다르다
// ═══════════════════════════════════════════════════════════════════════════
const LINE_LAYER = {
  // ① 리본: 위치마다 두께가 변하는 유기적 획 (먹/붓 느낌)
  ribbon(ctx, pts, _acc, L, T, base) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ph = T / (L.period || 5300);
    for (let i = 1; i < pts.length; i++) {
      const w = base.width * ((L.mult ?? 2.4) * (.55 + .45 * Math.sin(i * .5 + ph * TAU)));
      ctx.strokeStyle = withAlpha(L.color || base.color, L.alpha ?? .5);
      ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
    }
    ctx.restore();
  },
  // ② 평면 테이프: 광택 없는 굵고 각진 띠 (그래픽 디자인 느낌)
  tape(ctx, pts, _acc, L, T, base) {
    ctx.save(); ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
    ctx.setLineDash(L.dash || [18, 9]);
    ctx.lineDashOffset = -(T / (L.period || 9000)) * 40;
    ctx.strokeStyle = withAlpha(L.color || base.color, L.alpha ?? .95);
    ctx.lineWidth = base.width * (L.mult ?? 2.2);
    tracePath(ctx, pts); ctx.stroke();
    ctx.restore();
  },
  // ③ 평행 이중선: 본선 양옆으로 떨어진 두 줄
  parallel(ctx, pts, _acc, L, T, base) {
    const off = (L.offset ?? 5) * (.7 + .3 * Math.sin(T / (L.period || 4100) * TAU));
    ctx.save(); ctx.lineCap = 'round';
    for (const s of [-1, 1]) {
      ctx.strokeStyle = withAlpha(L.color || base.color, L.alpha ?? .55);
      ctx.lineWidth = base.width * (L.mult ?? .5);
      ctx.beginPath();
      pts.forEach((p, i) => { const n = normalAt(pts, i);
        const x = p.x + n.nx * off * s, y = p.y + n.ny * off * s;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
    }
    ctx.restore();
  },
  // ④ 직조: 두 가닥이 서로 꼬이며 교차
  weave(ctx, pts, _acc, L, T, base) {
    const amp = L.amp ?? 6, ph = T / (L.period || 3100) * TAU;
    ctx.save(); ctx.lineCap = 'round';
    for (const s of [0, Math.PI]) {
      ctx.strokeStyle = withAlpha(L.color || base.color, L.alpha ?? .7);
      ctx.lineWidth = base.width * (L.mult ?? .55);
      ctx.beginPath();
      pts.forEach((p, i) => { const n = normalAt(pts, i);
        const o = Math.sin(i * .45 + ph + s) * amp;
        const x = p.x + n.nx * o, y = p.y + n.ny * o;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
    }
    ctx.restore();
  },
  // ⑤ 전기 지그재그: 선 위에 각진 번개가 덧씌워짐
  zigzag(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1;
    const n = L.count || 2;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let k = 0; k < n; k++) {
      const ph = ((T / (L.period || 2300)) + k / n) % 1;
      const head = ph * total, len = total * (L.len ?? .22), steps = 10;
      ctx.strokeStyle = withAlpha(L.color || '#fff', L.alpha ?? .9);
      ctx.lineWidth = base.width * (L.mult ?? .6);
      ctx.shadowColor = withAlpha(L.color || '#fff', .9); ctx.shadowBlur = L.blur ?? 8;
      ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const d = head - len * (s / steps); if (d < 0) continue;
        const p = atDistance(pts, acc, d);
        const j = (rnd(s + k * 31 + Math.floor(T / 90), 7) - .5) * (L.jitter ?? 9);
        const x = p.x + p.nx * j, y = p.y + p.ny * j;
        s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  },
  // ⑥ 결정 가시: 데이터 지점에서 수직으로 자라는 결정
  spikes(ctx, pts, _acc, L, T, base) {
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < pts.length; i += (L.every ?? 2)) {
      const ph = ((T / (L.period || 4700)) + rnd(i, 5)) % 1;
      const g = Math.sin(ph * Math.PI);
      if (g < .08) continue;
      const n = normalAt(pts, i), len = (L.len ?? 11) * g, s = rnd(i, 6) < .5 ? -1 : 1;
      ctx.strokeStyle = withAlpha(L.color || '#cfefff', (L.alpha ?? .85) * g);
      ctx.lineWidth = L.width ?? 1.6;
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(pts[i].x + n.nx * len * s, pts[i].y + n.ny * len * s); ctx.stroke();
    }
    ctx.restore();
  },
  // ⑦ 무지개 구간: 구간마다 다른 색이 흐름
  segments(ctx, pts, _acc, L, T, base) {
    const cols = L.colors || ['#ff5f6d','#ffb457','#ffe66d','#6bffb8','#5fd0ff','#c9a7ff'];
    const shift = (T / (L.period || 5900)) % 1;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = base.width * (L.mult ?? 1.5);
    if (L.blur) { ctx.shadowBlur = L.blur; }
    for (let i = 1; i < pts.length; i++) {
      const c = cols[(i + Math.floor(shift * cols.length * 4)) % cols.length];
      ctx.strokeStyle = withAlpha(c, L.alpha ?? .95);
      if (L.blur) ctx.shadowColor = withAlpha(c, .8);
      ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
    }
    ctx.restore();
  },
  // ⑧ 스윕: 밝은 띠가 선 위를 훑고 지나감
  sweep(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1;
    const ph = (T / (L.period || 3700)) % 1, head = ph * total, len = total * (L.len ?? .16);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const steps = 16;
    for (let s = 0; s < steps; s++) {
      const d0 = head - len * s / steps, d1 = head - len * (s + 1) / steps;
      if (d1 < 0) continue;
      const a = atDistance(pts, acc, d0), b = atDistance(pts, acc, d1);
      const f = 1 - s / steps;
      ctx.strokeStyle = withAlpha(L.color || '#fff', (L.alpha ?? .95) * f);
      ctx.lineWidth = base.width * (L.mult ?? 2.2) * f;
      ctx.shadowColor = withAlpha(L.color || '#fff', .9); ctx.shadowBlur = (L.blur ?? 14) * f;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.restore();
  },
  // ⑨ 잔상: 세로로 어긋난 복제선 여러 겹
  echo(ctx, pts, _acc, L, T, base) {
    const n = L.count ?? 3;
    ctx.save(); ctx.lineCap = 'round';
    for (let k = 1; k <= n; k++) {
      const dy = k * (L.gap ?? 5) * (.6 + .4 * Math.sin(T / ((L.period || 4300) + k * 370) * TAU));
      ctx.strokeStyle = withAlpha(L.color || base.color, (L.alpha ?? .38) / k);
      ctx.lineWidth = base.width * (L.mult ?? .9);
      ctx.beginPath();
      pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y + dy) : ctx.moveTo(p.x, p.y + dy));
      ctx.stroke();
    }
    ctx.restore();
  },
  // ⑩ 불티 상승: 선에서 위로 떠오르는 입자
  embers(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1, n = L.count || 16;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 2600) * (.6 + rnd(i, 3) * .9);
      const ph = ((T / sp) + rnd(i, 1)) % 1;
      const p = atDistance(pts, acc, rnd(i, 2) * total);
      const rise = ph * (L.rise ?? 22);
      const sway = Math.sin(ph * 6 + i) * 3;
      ctx.fillStyle = withAlpha(L.color || '#ffb457', (L.alpha ?? .9) * (1 - ph));
      const r = (L.size ?? 1.9) * (1 - ph * .5);
      ctx.beginPath(); ctx.arc(p.x + sway, p.y - rise, r, 0, TAU); ctx.fill();
    }
    ctx.restore();
  },
  // ⑪ 불꽃 끝: 마지막 지점에 흔들리는 불꽃
  flameTip(ctx, pts, _acc, L, T, base) {
    const p = pts[pts.length - 1]; if (!p) return;
    ctx.save();
    for (let k = 0; k < 3; k++) {
      const ph = T / ((L.period || 620) + k * 130);
      const h = (L.size ?? 13) * (.7 + .3 * Math.sin(ph * TAU)) * (1 - k * .22);
      const w = h * .5, sway = Math.sin(ph * TAU + k) * 2.5;
      ctx.fillStyle = withAlpha(k === 0 ? (L.color || '#ff9d3a') : k === 1 ? '#ffd08a' : '#fff6d0', (L.alpha ?? .9) - k * .2);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - h);
      ctx.quadraticCurveTo(p.x + w + sway, p.y - h * .35, p.x, p.y + 1);
      ctx.quadraticCurveTo(p.x - w + sway, p.y - h * .35, p.x, p.y - h);
      ctx.fill();
    }
    ctx.restore();
  },
  // ⑫ 광맥 맥동: 밝은 점들이 선을 따라 빠르게 흐름
  pulse(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1, n = L.count || 5;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const ph = ((T / (L.period || 1900)) + i / n) % 1;
      const p = atDistance(pts, acc, ph * total);
      ctx.fillStyle = withAlpha(L.color || base.color, L.alpha ?? .95);
      ctx.shadowColor = withAlpha(L.color || base.color, .95); ctx.shadowBlur = L.blur ?? 12;
      ctx.beginPath(); ctx.arc(p.x, p.y, L.size ?? 3.2, 0, TAU); ctx.fill();
    }
    ctx.restore();
  },
  // ⑬ 클립 채움: 선 굵기 안쪽에만 다른 것이 흐른다 (물/별/성운)
  clipFill(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1;
    ctx.save();
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.lineWidth = base.width * (L.mult ?? 3.2);
    tracePath(ctx, pts);
    ctx.strokeStyle = '#000';
    ctx.stroke();                      // 경로를 굵게 그린 뒤
    ctx.globalCompositeOperation = 'source-atop';  // 그 안쪽에만 채운다
    if (L.mode === 'stars') {
      for (let i = 0; i < (L.count ?? 26); i++) {
        const ph = ((T / ((L.period || 6100) * (.6 + rnd(i, 3)))) + rnd(i, 1)) % 1;
        const p = atDistance(pts, acc, ph * total);
        ctx.fillStyle = withAlpha(L.color || '#fff', (L.alpha ?? .95) * Math.sin(ph * Math.PI));
        ctx.beginPath(); ctx.arc(p.x, p.y + (rnd(i, 2) - .5) * base.width * 2, L.size ?? 1.2, 0, TAU); ctx.fill();
      }
    } else {                            // 물결 채움
      const lvl = .5 + .5 * Math.sin(T / (L.period || 3700) * TAU);
      for (const p of pts) {
        const g = ctx.createLinearGradient(0, p.y - base.width * 2, 0, p.y + base.width * 2);
        g.addColorStop(0, withAlpha(L.color || '#4fc3f7', 0));
        g.addColorStop(clamp(lvl, .05, .95), withAlpha(L.color || '#4fc3f7', L.alpha ?? .9));
        g.addColorStop(1, withAlpha(L.color2 || '#00e5aa', L.alpha ?? .9));
        ctx.fillStyle = g;
        ctx.fillRect(p.x - 3, p.y - base.width * 2.5, 6, base.width * 5);
      }
    }
    ctx.restore();
  },
  // ⑭ 가산 블룸: 겹칠수록 밝아지는 다중 패스
  bloom(ctx, pts, _acc, L, T, base) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineJoin = ctx.lineCap = 'round';
    const passes = L.passes ?? 3;
    const pulse = .65 + .35 * Math.sin(T / (L.period || 3100) * TAU);
    for (let k = passes; k >= 1; k--) {
      ctx.strokeStyle = withAlpha(L.color || base.color, (L.alpha ?? .22) * pulse / k);
      ctx.lineWidth = base.width * (L.mult ?? 1.4) * k * 1.5;
      tracePath(ctx, pts); ctx.stroke();
    }
    ctx.restore();
  },
  // ⑮ 파형 왜곡: 선 자체가 일렁인다
  wobble(ctx, pts, _acc, L, T, base) {
    const amp = L.amp ?? 4, ph = T / (L.period || 2600) * TAU;
    ctx.save(); ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = withAlpha(L.color || base.color, L.alpha ?? .8);
    ctx.lineWidth = base.width * (L.mult ?? 1);
    ctx.beginPath();
    pts.forEach((p, i) => {
      const n = normalAt(pts, i);
      const o = Math.sin(i * (L.freq ?? .5) + ph) * amp;
      const x = p.x + n.nx * o, y = p.y + n.ny * o;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke(); ctx.restore();
  },
  // ⑯ 사슬/비늘: 경로를 따라 도형이 반복된다
  chain(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1;
    const gap = L.gap ?? 16, n = Math.floor(total / gap);
    const drift = (T / (L.period || 5300)) % 1;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const d = ((i + drift) * gap) % total;
      const p = atDistance(pts, acc, d);
      const tw = .6 + .4 * Math.sin(i * .7 + T / 900);
      ctx.strokeStyle = withAlpha(L.color || base.color, (L.alpha ?? .8) * tw);
      ctx.lineWidth = L.width ?? 1.4;
      ctx.beginPath();
      if (L.shape === 'scale') ctx.arc(p.x, p.y, (L.size ?? 5) * tw, Math.PI * .15, Math.PI * .85);
      else ctx.arc(p.x, p.y, (L.size ?? 4) * tw, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  },
  // ⑰ 다중 대시 레이스: 서로 다른 속도의 대시가 경주
  race(ctx, pts, _acc, L, T, base) {
    const lanes = L.lanes || [{ o: -4, s: 1 }, { o: 0, s: 1.7 }, { o: 4, s: 2.6 }];
    ctx.save(); ctx.lineCap = 'round';
    lanes.forEach((ln, k) => {
      ctx.setLineDash(L.dash || [7, 15]);
      ctx.lineDashOffset = -(T / (L.period || 2200)) * 60 * ln.s;
      ctx.strokeStyle = withAlpha(L.colors?.[k] || L.color || base.color, L.alpha ?? .85);
      ctx.lineWidth = base.width * (L.mult ?? .45);
      ctx.beginPath();
      pts.forEach((p, i) => { const nn = normalAt(pts, i);
        const x = p.x + nn.nx * ln.o, y = p.y + nn.ny * ln.o;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
    });
    ctx.restore();
  },
  // ⑱ 물리 입자: 중력·바람을 받는 흩날림
  physics(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1, n = L.count || 26;
    ctx.save();
    if (L.additive) ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 3200) * (.5 + rnd(i, 3));
      const ph = ((T / sp) + rnd(i, 1)) % 1;
      const p = atDistance(pts, acc, rnd(i, 2) * total);
      const t = ph * 2;
      const vx = (rnd(i, 4) - .5) * (L.wind ?? 26);
      const vy = -(L.lift ?? 30);
      const x = p.x + vx * t, y = p.y + vy * t + (L.grav ?? 22) * t * t;
      ctx.fillStyle = withAlpha(L.colors ? L.colors[i % L.colors.length] : (L.color || '#ffb457'),
        (L.alpha ?? .9) * (1 - ph));
      ctx.beginPath(); ctx.arc(x, y, (L.size ?? 2) * (1 - ph * .4), 0, TAU); ctx.fill();
    }
    ctx.restore();
  },
  // ⑲ 칼날 섬광: 4갈래 별빛 번쩍임 (천본앵 칼날 반사)
  glint(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1, n = L.count || 5;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const ph = ((T / ((L.period || 2600) * (.7 + rnd(i, 3) * .6))) + rnd(i, 1)) % 1;
      const s = Math.sin(ph * Math.PI); if (s < .1) continue;
      const p = atDistance(pts, acc, rnd(i, 2) * total);
      const r = (L.size ?? 9) * s;
      ctx.strokeStyle = withAlpha(L.color || '#fff', (L.alpha ?? .95) * s);
      ctx.lineWidth = L.width ?? 1.4;
      ctx.beginPath();
      ctx.moveTo(p.x - r, p.y); ctx.lineTo(p.x + r, p.y);
      ctx.moveTo(p.x, p.y - r); ctx.lineTo(p.x, p.y + r);
      ctx.stroke();
      ctx.fillStyle = withAlpha(L.color || '#fff', (L.alpha ?? .95) * s);
      ctx.beginPath(); ctx.arc(p.x, p.y, (L.core ?? 1.6) * s, 0, TAU); ctx.fill();
    }
    ctx.restore();
  },
  // ⑳ 이탈 꽃잎/파편: 선에서 떨어져 회전하며 흩어짐
  detach(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1, n = L.count || 24;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 3400) * (.55 + rnd(i, 3) * .9);
      const ph = ((T / sp) + rnd(i, 1)) % 1;
      const p = atDistance(pts, acc, rnd(i, 2) * total);
      const ang = rnd(i, 4) * TAU;
      const dist = ph * (L.spread ?? 34);
      const x = p.x + Math.cos(ang) * dist + Math.sin(ph * 5 + i) * 4;
      const y = p.y + Math.sin(ang) * dist * .7 - ph * (L.lift ?? 8);
      ctx.save();
      ctx.translate(x, y); ctx.rotate(ang + ph * (L.spin ?? 5));
      ctx.globalAlpha = (L.alpha ?? .9) * (1 - ph);
      ctx.fillStyle = L.colors ? L.colors[i % L.colors.length] : (L.color || '#ffb7d5');
      const s = L.size ?? 4;
      // 꽃잎 모양
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * .7, 0, 0, s);
      ctx.quadraticCurveTo(-s * .7, 0, 0, -s);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  },
  // ㉑ 룬 각인: 선을 따라 룬 문양이 점등
  runeMarks(ctx, pts, acc, L, T, base) {
    const total = acc[acc.length - 1] || 1;
    const gap = L.gap ?? 34, n = Math.max(1, Math.floor(total / gap));
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const ph = ((T / (L.period || 4300)) + i / n) % 1;
      const g = Math.max(0, Math.sin(ph * Math.PI));
      if (g < .08) continue;
      const p = atDistance(pts, acc, (i + .5) * gap);
      const r = (L.size ?? 6) * (.7 + .3 * g);
      ctx.strokeStyle = withAlpha(L.color || '#9fe8ff', (L.alpha ?? .9) * g);
      ctx.lineWidth = L.width ?? 1.3;
      ctx.shadowColor = withAlpha(L.color || '#9fe8ff', .9); ctx.shadowBlur = 8 * g;
      // 육각 룬
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * TAU + i;
        const x = p.x + Math.cos(a) * r, y = p.y + Math.sin(a) * r;
        k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p.x - r * .5, p.y); ctx.lineTo(p.x + r * .5, p.y); ctx.stroke();
    }
    ctx.restore();
  },
  // 부드러운 발광 배경 (보조)
  aura(ctx, pts, _acc, L, T, base) {
    ctx.save(); ctx.lineJoin = ctx.lineCap = 'round';
    const pulse = L.pulse ? .6 + .4 * Math.sin(T / (L.period || 3100) * TAU) : 1;
    ctx.strokeStyle = withAlpha(L.color || base.color, (L.alpha ?? .3) * pulse);
    ctx.lineWidth = base.width * (L.mult ?? 3);
    if (L.blur) { ctx.shadowColor = withAlpha(L.color || base.color, .9); ctx.shadowBlur = L.blur; }
    tracePath(ctx, pts); ctx.stroke();
    ctx.restore();
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 공간효과 프리미티브 — 중앙(데이터)에서 알파가 0으로 수렴
// ═══════════════════════════════════════════════════════════════════════════
// 중앙 안전영역: 알파를 0으로, 가장자리로 갈수록 1
function bandFactor(x, y, area) {
  const w = area.right - area.left, h = area.bottom - area.top;
  const dx = Math.abs(x - (area.left + w / 2)) / (w / 2);
  const dy = Math.abs(y - (area.top + h / 2)) / (h / 2);
  const d = Math.max(dx, dy);            // 사각형 기준 거리 0(중앙)~1(가장자리)
  return clamp((d - 0.52) / 0.34, 0, 1); // 중앙 52%는 완전 차단
}

const AMB_LAYER = {
  // 느리게 부유하는 먼지
  motes(ctx, area, L, T) {
    const n = L.count || 14, w = area.right - area.left, h = area.bottom - area.top;
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 11000) * (.5 + rnd(i, 1));
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const x = area.left + ((rnd(i, 3) + ph * .25) % 1) * w;
      const y = area.top + ((rnd(i, 4) + ph * .12) % 1) * h;
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      ctx.fillStyle = withAlpha(L.color || '#d8c9a8', (L.alpha ?? .5) * bf * Math.sin(ph * Math.PI));
      ctx.beginPath(); ctx.arc(x, y, (L.size ?? 1.8) * (.5 + rnd(i, 5)), 0, TAU); ctx.fill();
    }
  },
  // 기둥처럼 솟아오르는 입자 (좌우 가장자리)
  columns(ctx, area, L, T) {
    const n = L.count || 22, w = area.right - area.left, h = area.bottom - area.top;
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 6300) * (.6 + rnd(i, 1) * .8);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const side = i % 2;
      const x = side ? area.right - rnd(i, 3) * w * .22 : area.left + rnd(i, 3) * w * .22;
      const y = area.bottom - ph * h;
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      const sway = Math.sin(ph * 8 + i) * 5;
      ctx.fillStyle = withAlpha(L.color || '#9cf0b0', (L.alpha ?? .55) * bf * Math.sin(ph * Math.PI));
      ctx.beginPath(); ctx.arc(x + sway, y, (L.size ?? 2.2) * (.5 + rnd(i, 5)), 0, TAU); ctx.fill();
    }
  },
  // 회전하며 떨어지는 큰 조각 (깃털/색종이)
  confetti(ctx, area, L, T) {
    const n = L.count || 16, w = area.right - area.left, h = area.bottom - area.top;
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 7000) * (.6 + rnd(i, 1) * .9);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const x = area.left + ((rnd(i, 3) + Math.sin(ph * 4 + i) * .06) % 1) * w;
      const y = area.top + ph * h;
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      const cols = L.colors || [L.color || '#ffd76b'];
      ctx.save();
      ctx.translate(x, y); ctx.rotate(ph * 12 + i);
      ctx.globalAlpha = (L.alpha ?? .8) * bf;
      ctx.fillStyle = cols[i % cols.length];
      const s = L.size ?? 4;
      ctx.fillRect(-s / 2, -s / 4, s, s * (L.ratio ?? .5));
      ctx.restore();
    }
  },
  // 대각선 유성 (꼬리 포함)
  meteors(ctx, area, L, T) {
    const n = L.count || 5, w = area.right - area.left, h = area.bottom - area.top;
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 3300) * (.7 + rnd(i, 1) * .7);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const x = area.left - w * .1 + ph * w * 1.2;
      const y = area.top + rnd(i, 3) * h * .35 + ph * h * .55;
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      const len = L.len ?? 34;
      const g = ctx.createLinearGradient(x, y, x - len, y - len * .55);
      g.addColorStop(0, withAlpha(L.color || '#ffb15c', (L.alpha ?? .95) * bf));
      g.addColorStop(1, withAlpha(L.color || '#ffb15c', 0));
      ctx.strokeStyle = g; ctx.lineWidth = L.width ?? 2.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len, y - len * .55); ctx.stroke();
    }
  },
  // 스캔하는 격자 (홀로그램)
  grid(ctx, area, L, T) {
    const w = area.right - area.left, h = area.bottom - area.top;
    const gap = L.gap ?? 26, ph = (T / (L.period || 4700)) % 1;
    ctx.save(); ctx.lineWidth = L.width ?? 1;
    for (let gx = area.left; gx <= area.right; gx += gap) {
      const bf = bandFactor(gx, area.top + 6, area); if (bf <= 0) continue;
      ctx.strokeStyle = withAlpha(L.color || '#ffe08a', (L.alpha ?? .35) * bf);
      ctx.beginPath(); ctx.moveTo(gx, area.top); ctx.lineTo(gx, area.bottom); ctx.stroke();
    }
    for (let gy = area.top; gy <= area.bottom; gy += gap) {
      const bf = bandFactor(area.left + 6, gy, area); if (bf <= 0) continue;
      ctx.strokeStyle = withAlpha(L.color || '#ffe08a', (L.alpha ?? .35) * bf);
      ctx.beginPath(); ctx.moveTo(area.left, gy); ctx.lineTo(area.right, gy); ctx.stroke();
    }
    // 스캔 라인
    const sy = area.top + ph * h;
    const g = ctx.createLinearGradient(0, sy - 18, 0, sy + 18);
    g.addColorStop(0, withAlpha(L.scan || '#fff3c4', 0));
    g.addColorStop(.5, withAlpha(L.scan || '#fff3c4', (L.alpha ?? .35)));
    g.addColorStop(1, withAlpha(L.scan || '#fff3c4', 0));
    ctx.fillStyle = g; ctx.fillRect(area.left, sy - 18, w, 36);
    ctx.restore();
  },
  // 하단에서 흔들리는 잔디/갈대
  blades(ctx, area, L, T) {
    const n = L.count || 26, w = area.right - area.left, h = area.bottom - area.top;
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const x = area.left + (i / n) * w + rnd(i, 3) * 8;
      const bh = (L.size ?? 26) * (.5 + rnd(i, 4));
      const bf = bandFactor(x, area.bottom - bh, area); if (bf <= 0) continue;
      const sway = Math.sin(T / (L.period || 2900) * TAU + i * .6) * (L.amp ?? 7);
      ctx.strokeStyle = withAlpha(L.color || '#8fd98f', (L.alpha ?? .5) * bf);
      ctx.lineWidth = L.width ?? 1.6;
      ctx.beginPath(); ctx.moveTo(x, area.bottom);
      ctx.quadraticCurveTo(x + sway * .5, area.bottom - bh * .6, x + sway, area.bottom - bh);
      ctx.stroke();
    }
    ctx.restore();
  },
  // 확산하는 원형 파동
  ripples(ctx, area, L, T) {
    const n = L.count || 3;
    const cx = (area.left + area.right) / 2, cy = (area.top + area.bottom) / 2;
    const rMax = Math.hypot(area.right - cx, area.bottom - cy);
    ctx.save(); ctx.lineWidth = L.width ?? 2;
    for (let i = 0; i < n; i++) {
      const ph = ((T / (L.period || 5300)) + i / n) % 1;
      const r = rMax * (.5 + ph * .55);
      ctx.strokeStyle = withAlpha(L.color || '#ffd98a', (L.alpha ?? .5) * (1 - ph) * .9);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    }
    ctx.restore();
  },
  // 크게 번지는 색 덩어리 (성운)
  blobs(ctx, area, L, T) {
    const n = L.count || 4, w = area.right - area.left, h = area.bottom - area.top;
    const cols = L.colors || ['#c9a7ff', '#7fd4ff', '#ffd9f5'];
    ctx.save();
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 12000) * (.7 + rnd(i, 1) * .6);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const ang = ph * TAU + i * 1.7;
      const x = area.left + w * (.5 + Math.cos(ang) * .42);
      const y = area.top + h * (.5 + Math.sin(ang) * .40);
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      const r = (L.size ?? 60) * (.7 + .3 * Math.sin(ph * TAU));
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, withAlpha(cols[i % cols.length], (L.alpha ?? .3) * bf));
      g.addColorStop(1, withAlpha(cols[i % cols.length], 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    ctx.restore();
  },
  // 스포트라이트 원뿔
  cones(ctx, area, L, T) {
    const n = L.count || 2, w = area.right - area.left, h = area.bottom - area.top;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const ph = (T / ((L.period || 6700) + i * 900)) % 1;
      const sweep = Math.sin(ph * TAU) * w * .3;
      const apexX = area.left + w * (i ? .78 : .22), apexY = area.top;
      ctx.globalAlpha = (L.alpha ?? .16);
      const g = ctx.createLinearGradient(apexX, apexY, apexX + sweep, area.bottom);
      g.addColorStop(0, withAlpha(L.color || '#fff3c4', .55));
      g.addColorStop(1, withAlpha(L.color || '#fff3c4', 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(apexX, apexY);
      ctx.lineTo(apexX + sweep - 40, area.bottom); ctx.lineTo(apexX + sweep + 40, area.bottom);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  },
  // 가장자리 광휘
  edgeGlow(ctx, area, L, T) {
    const h = area.bottom - area.top;
    const pulse = .55 + .45 * Math.sin(T / (L.period || 5200) * TAU);
    const band = h * .28;
    const bottom = L.from === 'bottom';
    const y0 = bottom ? area.bottom : area.top;
    const y1 = bottom ? area.bottom - band : area.top + band;
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, withAlpha(L.color || '#8cf', (L.alpha ?? .32) * pulse));
    g.addColorStop(1, withAlpha(L.color || '#8cf', 0));
    ctx.fillStyle = g;
    ctx.fillRect(area.left, bottom ? area.bottom - band : area.top, area.right - area.left, band);
  },
  // 빗줄기 (사선 낙하 + 하단 튐)
  rain(ctx, area, L, T) {
    const n = L.count || 30, w = area.right - area.left, h = area.bottom - area.top;
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 1400) * (.6 + rnd(i, 1) * .6);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const x = area.left + ((rnd(i, 3) + ph * .08) % 1) * w;
      const y = area.top + ph * h;
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      ctx.strokeStyle = withAlpha(L.color || '#9fd4ff', (L.alpha ?? .55) * bf);
      ctx.lineWidth = L.width ?? 1.2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 2, y - (L.len ?? 13)); ctx.stroke();
    }
    ctx.restore();
  },
  // 보케: 초점 나간 큰 빛망울
  bokeh(ctx, area, L, T) {
    const n = L.count || 8, w = area.right - area.left, h = area.bottom - area.top;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 13000) * (.6 + rnd(i, 1));
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const x = area.left + ((rnd(i, 3) + ph * .18) % 1) * w;
      const y = area.top + ((rnd(i, 4) + ph * .1) % 1) * h;
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      const r = (L.size ?? 16) * (.6 + rnd(i, 5));
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const c = L.colors ? L.colors[i % L.colors.length] : (L.color || '#ffe9a8');
      g.addColorStop(0, withAlpha(c, (L.alpha ?? .3) * bf));
      g.addColorStop(.75, withAlpha(c, (L.alpha ?? .3) * bf * .35));
      g.addColorStop(1, withAlpha(c, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    ctx.restore();
  },
  // 나선 성운: 팔이 회전하는 은하
  spiral(ctx, area, L, T) {
    const cx = (area.left + area.right) / 2, cy = (area.top + area.bottom) / 2;
    const rMax = Math.hypot(area.right - cx, area.bottom - cy) * .95;
    const arms = L.arms ?? 3, per = L.per ?? 44;
    const rot = (T / (L.period || 26000)) * TAU;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let a = 0; a < arms; a++) {
      for (let i = 1; i <= per; i++) {
        const t = i / per;
        const ang = rot + a * TAU / arms + t * (L.twist ?? 3.2);
        const r = rMax * (.28 + t * .72);
        const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r * .62;
        const bf = bandFactor(x, y, area); if (bf <= 0) continue;
        const c = L.colors ? L.colors[(a + i) % L.colors.length] : (L.color || '#c9a7ff');
        ctx.fillStyle = withAlpha(c, (L.alpha ?? .5) * bf * (1 - t * .5));
        ctx.beginPath(); ctx.arc(x, y, (L.size ?? 2.4) * (1 - t * .5), 0, TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
  // 폭죽: 한 점에서 방사형 폭발 후 낙하
  burst(ctx, area, L, T) {
    const shells = L.shells ?? 3, per = L.per ?? 22;
    const w = area.right - area.left, h = area.bottom - area.top;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let s = 0; s < shells; s++) {
      const ph = ((T / ((L.period || 3600) + s * 640)) + rnd(s, 9)) % 1;
      const ox = area.left + w * (.12 + rnd(s, 1) * .76);
      const oy = area.top + h * (.14 + rnd(s, 2) * .34);
      const R = (L.radius ?? 46) * ph;
      for (let i = 0; i < per; i++) {
        const ang = (i / per) * TAU + rnd(s, 3);
        const x = ox + Math.cos(ang) * R;
        const y = oy + Math.sin(ang) * R + (L.grav ?? 34) * ph * ph;
        const bf = bandFactor(x, y, area); if (bf <= 0) continue;
        const c = L.colors ? L.colors[(i + s) % L.colors.length] : (L.color || '#ffd76b');
        ctx.fillStyle = withAlpha(c, (L.alpha ?? .95) * (1 - ph) * bf);
        ctx.beginPath(); ctx.arc(x, y, (L.size ?? 2.2) * (1 - ph * .5), 0, TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
  // 연기 기둥: 위로 커지며 흩어짐
  smoke(ctx, area, L, T) {
    const n = L.count || 14, w = area.right - area.left, h = area.bottom - area.top;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 9000) * (.6 + rnd(i, 1) * .7);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const baseX = area.left + w * (rnd(i, 3) < .5 ? .1 + rnd(i, 4) * .12 : .78 + rnd(i, 4) * .12);
      const x = baseX + Math.sin(ph * 3 + i) * 12;
      const y = area.bottom - ph * h * .9;
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      const r = (L.size ?? 14) * (.4 + ph * 1.3);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, withAlpha(L.color || '#8a8f9a', (L.alpha ?? .3) * bf * (1 - ph)));
      g.addColorStop(1, withAlpha(L.color || '#8a8f9a', 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    ctx.restore();
  },
  // 무리 비행: 함께 몰려다니는 점들
  swarm(ctx, area, L, T) {
    const n = L.count || 22, w = area.right - area.left, h = area.bottom - area.top;
    const lead = T / (L.period || 8000) * TAU;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const lag = i * .12;
      const ang = lead - lag;
      const x = area.left + w * (.5 + Math.cos(ang) * .43 + Math.sin(ang * 2.3 + i) * .04);
      const y = area.top + h * (.5 + Math.sin(ang) * .40 + Math.cos(ang * 1.7 + i) * .05);
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      ctx.fillStyle = withAlpha(L.color || '#cfe3ff', (L.alpha ?? .7) * bf);
      ctx.beginPath(); ctx.arc(x, y, L.size ?? 1.8, 0, TAU); ctx.fill();
    }
    ctx.restore();
  },
  // 섬광: 화면 가장자리가 번쩍
  flash(ctx, area, L, T) {
    const ph = (T / (L.period || 5200)) % 1;
    const hit = ph < .06 ? 1 - ph / .06 : (ph > .14 && ph < .19 ? 1 - (ph - .14) / .05 : 0);
    if (hit <= 0) return;
    const g = ctx.createRadialGradient(
      (area.left + area.right) / 2, area.top, 10,
      (area.left + area.right) / 2, area.top, Math.hypot(area.right - area.left, area.bottom - area.top) * .7);
    g.addColorStop(0, withAlpha(L.color || '#dff0ff', (L.alpha ?? .45) * hit));
    g.addColorStop(1, withAlpha(L.color || '#dff0ff', 0));
    ctx.fillStyle = g;
    ctx.fillRect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  },
  // 빙정 파편: 각진 얼음 조각이 회전하며 흩날림
  shards(ctx, area, L, T) {
    const n = L.count || 18, w = area.right - area.left, h = area.bottom - area.top;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 4200) * (.5 + rnd(i, 1) * .8);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const x = area.left + ((rnd(i, 3) + ph * (L.drift ?? .26)) % 1) * w;
      const y = area.top + ph * h;
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      const s = (L.size ?? 5) * (.5 + rnd(i, 5));
      ctx.save();
      ctx.translate(x, y); ctx.rotate(ph * (L.spin ?? 7) + i);
      ctx.globalAlpha = (L.alpha ?? .7) * bf;
      ctx.fillStyle = L.color || '#dff2ff';
      ctx.beginPath();                       // 마름모 결정
      ctx.moveTo(0, -s); ctx.lineTo(s * .45, 0); ctx.lineTo(0, s); ctx.lineTo(-s * .45, 0);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  },
  // 귀화(鬼火): 물방울 모양 혼불이 흔들리며 떠오름
  wisps(ctx, area, L, T) {
    const n = L.count || 10, w = area.right - area.left, h = area.bottom - area.top;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 7400) * (.6 + rnd(i, 1) * .8);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const x = area.left + ((rnd(i, 3)) % 1) * w + Math.sin(ph * 5 + i) * 14;
      const y = area.bottom - ph * h * .95;
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      const flick = .7 + .3 * Math.sin(T / 140 + i * 2);
      const s = (L.size ?? 7) * flick * Math.sin(ph * Math.PI);
      const g = ctx.createRadialGradient(x, y, 0, x, y, s * 2.4);
      g.addColorStop(0, withAlpha(L.core || '#eaffff', (L.alpha ?? .85) * bf));
      g.addColorStop(.45, withAlpha(L.color || '#7fffd4', (L.alpha ?? .85) * bf * .7));
      g.addColorStop(1, withAlpha(L.color || '#7fffd4', 0));
      ctx.fillStyle = g;
      ctx.beginPath();                        // 아래로 늘어진 불꽃
      ctx.ellipse(x, y, s, s * 1.7, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  },
  // 꽃잎 소용돌이: 중심을 향해 휘몰아치는 꽃잎 (천본앵)
  vortex(ctx, area, L, T) {
    const n = L.count || 44;
    const cx = (area.left + area.right) / 2, cy = (area.top + area.bottom) / 2;
    const rMax = Math.hypot(area.right - cx, area.bottom - cy);
    ctx.save();
    for (let i = 0; i < n; i++) {
      const sp = (L.period || 5200) * (.6 + rnd(i, 1) * .8);
      const ph = ((T / sp) + rnd(i, 2)) % 1;
      const r = rMax * (L.inward ? (1 - ph) : ph) * (.55 + rnd(i, 6) * .6);
      const ang = rnd(i, 3) * TAU + ph * (L.twist ?? 4.2);
      const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r * .72;
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(ang + ph * 6);
      ctx.globalAlpha = (L.alpha ?? .85) * bf * Math.sin(ph * Math.PI);
      ctx.fillStyle = L.colors ? L.colors[i % L.colors.length] : (L.color || '#ffb7d5');
      const s = (L.size ?? 5) * (.6 + rnd(i, 5) * .7);
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * .72, 0, 0, s);
      ctx.quadraticCurveTo(-s * .72, 0, 0, -s);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  },
  // 피안화: 가장자리에 방사형 실꽃이 피고 짐
  lily(ctx, area, L, T) {
    const n = L.count || 5, w = area.right - area.left, h = area.bottom - area.top;
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const ph = ((T / (L.period || 9000)) + rnd(i, 1)) % 1;
      const bloom = Math.sin(ph * Math.PI);
      if (bloom < .06) continue;
      const x = area.left + w * (rnd(i, 2) < .5 ? .06 + rnd(i, 3) * .16 : .78 + rnd(i, 3) * .16);
      const y = area.top + h * (.55 + rnd(i, 4) * .4);
      const bf = bandFactor(x, y, area); if (bf <= 0) continue;
      const R = (L.size ?? 14) * bloom;
      ctx.strokeStyle = withAlpha(L.color || '#ff3355', (L.alpha ?? .8) * bf * bloom);
      ctx.lineWidth = L.width ?? 1.3;
      for (let k = 0; k < (L.petals ?? 8); k++) {
        const a = (k / (L.petals ?? 8)) * TAU + i;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + Math.cos(a) * R * .7, y + Math.sin(a) * R * .5 - R * .4,
                             x + Math.cos(a) * R, y + Math.sin(a) * R);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
  // 룬 서클: 마법진이 서서히 떠올랐다 사라짐 (회전 없음)
  runeRing(ctx, area, L, T) {
    const n = L.count || 2;
    ctx.save();
    for (let i = 0; i < n; i++) {
      const ph = ((T / (L.period || 8300)) + i / n) % 1;
      const fade = Math.sin(ph * Math.PI);
      if (fade < .05) continue;
      const w = area.right - area.left, h = area.bottom - area.top;
      const cx = area.left + w * (i ? .82 : .18), cy = area.top + h * (i ? .26 : .74);
      const R = (L.size ?? 28) * (.85 + .15 * fade);
      const bf = bandFactor(cx, cy, area); if (bf <= 0) continue;
      const a = (L.alpha ?? .55) * fade * bf;
      ctx.strokeStyle = withAlpha(L.color || '#9fe8ff', a);
      ctx.lineWidth = L.width ?? 1.2;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, R * .72, 0, TAU); ctx.stroke();
      for (let k = 0; k < (L.ticks ?? 8); k++) {
        const ang = (k / (L.ticks ?? 8)) * TAU;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * R * .72, cy + Math.sin(ang) * R * .72);
        ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
  // 느리게 지나가는 거대 실루엣
  silhouette(ctx, area, L, T) {
    const ph = (T / (L.period || 15000)) % 1;
    const w = area.right - area.left, h = area.bottom - area.top;
    const x = area.left - w * .3 + ph * w * 1.6;
    const y = area.top + h * (L.y ?? .84);
    ctx.save(); ctx.globalAlpha = L.alpha ?? .12; ctx.fillStyle = L.color || '#9df';
    ctx.beginPath(); ctx.ellipse(x, y, w * .2, h * .11, 0, 0, TAU); ctx.fill();
    ctx.restore();
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 그래프선 12종 — 지배적 형태가 전부 다르다
// ═══════════════════════════════════════════════════════════════════════════
const LINE_FX = {
  // 고급 (1~2레이어)
  ls_ink:      { layers:[{k:'ribbon',mult:2.6,alpha:.45,period:5300}] },
  ls_tape:     { layers:[{k:'tape',mult:2.1,alpha:.9,dash:[20,10],period:9000}] },
  ls_candle:   { layers:[{k:'aura',mult:2.6,alpha:.3,blur:10,period:4100,pulse:1,color:'#ffb457'},
                         {k:'flameTip',size:14,period:620,color:'#ff9d3a',alpha:.95}] },
  // 희귀 (2~3레이어)
  ls_vein:     { layers:[{k:'aura',mult:3,alpha:.28,blur:10,period:3700,pulse:1},
                         {k:'pulse',count:5,size:3.4,blur:14,period:1900,alpha:.95}] },
  ls_psi:      { layers:[{k:'parallel',offset:6,mult:.5,alpha:.6,period:4100,color:'#9fe8ff'},
                         {k:'aura',mult:2.4,alpha:.24,blur:9,period:5300,color:'#7fd4ff'},
                         {k:'spikes',len:7,every:3,alpha:.5,period:3100,color:'#cfefff',width:1.2}] },
  ls_netthread:{ layers:[{k:'weave',amp:7,mult:.6,alpha:.75,period:3100},
                         {k:'aura',mult:2,alpha:.2,period:4700}] },
  // 영웅 (3~4레이어)
  ls_heatline: { layers:[{k:'aura',mult:3.4,alpha:.3,blur:12,period:3100,pulse:1,color:'#ff6a2a'},
                         {k:'sweep',color:'#ffd08a',len:.14,period:4300,alpha:.95,mult:2,blur:16},
                         {k:'embers',color:'#ffb457',count:20,period:2600,rise:26,size:2,alpha:.95},
                         {k:'segments',colors:['#ff4d2a','#ff8a3a','#ffb457','#ff6a2a'],period:6100,alpha:.5,mult:.8}] },
  ls_current:  { layers:[{k:'aura',mult:3,alpha:.26,blur:11,period:2900,pulse:1,color:'#7fd4ff'},
                         {k:'zigzag',count:2,color:'#ffffff',len:.24,period:2300,jitter:10,blur:10,alpha:.95,mult:.6},
                         {k:'pulse',count:3,size:2.8,blur:12,period:1700,alpha:.9,color:'#cfefff'}] },
  ls_afterimage:{layers:[{k:'echo',count:3,gap:6,alpha:.4,mult:.9,period:4300},
                         {k:'aura',mult:2.4,alpha:.22,blur:9,period:3700,pulse:1},
                         {k:'pulse',count:2,size:2.6,blur:10,period:5900,alpha:.75}] },
  // 전설 (5~6레이어)
  ls_frost:    { layers:[{k:'aura',mult:3.6,alpha:.3,blur:14,period:4300,pulse:1,color:'#9fe8ff'},
                         {k:'spikes',len:13,every:1,alpha:.9,period:4700,color:'#e8faff',width:1.8},
                         {k:'sweep',color:'#ffffff',len:.13,period:5900,alpha:.9,mult:1.8,blur:16},
                         {k:'parallel',offset:8,mult:.4,alpha:.4,period:6700,color:'#bfeaff'},
                         {k:'embers',color:'#cfefff',count:14,period:7300,rise:-16,size:1.5,alpha:.7}] },
  ls_gem_trail:{ layers:[{k:'segments',period:5900,alpha:.98,mult:1.7,blur:12},
                         {k:'aura',mult:3.4,alpha:.24,blur:14,period:4700,pulse:1,color:'#c9a7ff'},
                         {k:'sweep',color:'#ffffff',len:.11,period:3700,alpha:.9,mult:1.6,blur:14},
                         {k:'pulse',count:4,size:3,blur:14,period:4300,alpha:.9,color:'#fff2a8'},
                         {k:'embers',color:'#ffd9f5',count:18,period:5300,rise:20,size:1.6,alpha:.8}] },
  ls_spotlight:{ layers:[{k:'aura',mult:3.8,alpha:.3,blur:16,period:5300,pulse:1,color:'#ffe9a8'},
                         {k:'sweep',color:'#ffffff',len:.22,period:4700,alpha:.98,mult:2.6,blur:20},
                         {k:'tape',mult:1.3,alpha:.5,dash:[26,12],period:11000,color:'#ffe9a8'},
                         {k:'pulse',count:3,size:3.4,blur:16,period:2900,alpha:.95},
                         {k:'embers',color:'#fff6cf',count:20,period:6700,rise:24,size:1.8,alpha:.85}] },

  // ── 확장 12종 (신규 기법: 클립채움 / 가산블룸 / 파형왜곡 / 물리입자) ──
  // 고급 — 가볍고 단순
  ls_thread:   { layers:[{k:'wobble',amp:2.2,freq:.7,period:3100,alpha:.85,mult:.9}] },
  ls_ringchain:{ layers:[{k:'chain',gap:18,size:4,alpha:.75,period:5300,width:1.3}] },
  ls_beat:     { layers:[{k:'race',lanes:[{o:0,s:1}],dash:[3,13],period:2600,alpha:.9,mult:.8}] },
  // 희귀 — 2~3레이어
  ls_scale:    { layers:[{k:'chain',shape:'scale',gap:11,size:6,alpha:.8,period:6100,width:1.4,color:'#8fe3b0'},
                         {k:'aura',mult:2.2,alpha:.22,period:4300,color:'#57c98a'}] },
  ls_race:     { layers:[{k:'race',colors:['#ff8a8a','#ffd76b','#7fd4ff'],dash:[6,16],period:2200,alpha:.9,mult:.45},
                         {k:'aura',mult:2,alpha:.18,period:5300}] },
  ls_ripplewave:{layers:[{k:'wobble',amp:5,freq:.42,period:2600,alpha:.85,mult:1},
                         {k:'wobble',amp:3,freq:.7,period:3700,alpha:.5,mult:.6,color:'#9fe8ff'},
                         {k:'aura',mult:2.4,alpha:.2,period:4700,color:'#7fd4ff'}] },
  // 영웅 — 클립 채움·물리 (무거워짐)
  ls_aqua:     { layers:[{k:'aura',mult:3,alpha:.24,blur:10,period:4300,color:'#4fc3f7'},
                         {k:'clipFill',mult:3.2,period:3700,color:'#4fc3f7',color2:'#00e5aa',alpha:.9},
                         {k:'wobble',amp:2.4,freq:.6,period:2900,alpha:.5,mult:.6,color:'#bfe9ff'}] },
  ls_starfield:{ layers:[{k:'aura',mult:3,alpha:.22,blur:10,period:5300,color:'#9fb8ff'},
                         {k:'clipFill',mode:'stars',mult:3.4,count:30,period:6100,color:'#ffffff',size:1.3,alpha:.95},
                         {k:'pulse',count:2,size:2.6,blur:12,period:4700,alpha:.8,color:'#cfd8ff'}] },
  ls_windborne:{ layers:[{k:'aura',mult:2.6,alpha:.2,period:4100,color:'#b0e8c0'},
                         {k:'physics',count:28,period:3200,wind:34,lift:26,grav:18,size:2,alpha:.9,color:'#c8f0a8'},
                         {k:'wobble',amp:3,freq:.5,period:3700,alpha:.6,mult:.7}] },
  // 전설 — 가산블룸 + 클립채움 + 물리 (가장 무거움)
  ls_prism_bloom:{layers:[{k:'bloom',passes:4,mult:1.5,alpha:.26,period:3100,color:'#c9a7ff'},
                         {k:'segments',colors:['#ff6b9d','#ffd76b','#8affa8','#7fd4ff','#c9a7ff'],period:5300,alpha:.95,mult:1.5,blur:12},
                         {k:'race',colors:['#ffffff','#ffd9f5'],dash:[5,17],period:2600,alpha:.75,mult:.4},
                         {k:'pulse',count:4,size:3,blur:16,period:3700,alpha:.95,color:'#ffffff'},
                         {k:'physics',count:22,period:4300,wind:20,lift:22,grav:14,size:1.7,alpha:.8,additive:1,
                          colors:['#ff6b9d','#ffd76b','#7fd4ff','#c9a7ff']}] },
  ls_dragon:   { layers:[{k:'bloom',passes:3,mult:1.4,alpha:.24,period:3700,color:'#ff7b3a'},
                         {k:'chain',shape:'scale',gap:9,size:7,alpha:.85,period:5900,width:1.5,color:'#ffcf6b'},
                         {k:'sweep',color:'#fff0c0',len:.15,period:4300,alpha:.95,mult:1.8,blur:16},
                         {k:'physics',count:26,period:2800,wind:30,lift:34,grav:20,size:2.1,alpha:.95,additive:1,
                          colors:['#ff4d2a','#ff9d3a','#ffd08a']},
                         {k:'spikes',len:9,every:2,alpha:.6,period:5300,color:'#ffe1a8',width:1.4}] },
  ls_cosmos:   { layers:[{k:'bloom',passes:4,mult:1.6,alpha:.24,period:4700,color:'#8a7bff'},
                         {k:'clipFill',mode:'stars',mult:3.6,count:34,period:7300,color:'#ffffff',size:1.4,alpha:.95},
                         {k:'segments',colors:['#3a2b8f','#7b5cff','#c9a7ff','#5fd0ff'],period:8300,alpha:.6,mult:1.2},
                         {k:'sweep',color:'#e8dcff',len:.12,period:5900,alpha:.9,mult:1.6,blur:18},
                         {k:'physics',count:24,period:5300,wind:16,lift:18,grav:10,size:1.6,alpha:.85,additive:1,
                          colors:['#c9a7ff','#7fd4ff','#ffffff']},
                         {k:'chain',gap:24,size:3,alpha:.5,period:9700,width:1,color:'#b0a0ff'}] },

  // ── 테마 확장 12종: 얼음왕관 / 황천 / 천본앵 ──
  // 고급
  ls_frostbite:{ layers:[{k:'spikes',len:6,every:3,alpha:.7,period:4300,color:'#cfefff',width:1.3},
                         {k:'aura',mult:2.2,alpha:.2,period:5300,color:'#9fe8ff'}] },
  ls_soulthread:{layers:[{k:'wobble',amp:2.6,freq:.5,period:3700,alpha:.7,mult:.9,color:'#7fffd4'},
                         {k:'aura',mult:2.4,alpha:.2,blur:8,period:4700,color:'#4fd9a8'}] },
  ls_petal_light:{layers:[{k:'detach',count:10,period:4300,spread:20,size:3.2,alpha:.8,color:'#ffb7d5'},
                         {k:'aura',mult:2,alpha:.18,period:5900,color:'#ff9ec4'}] },
  // 희귀
  ls_icecrown_rune:{layers:[{k:'aura',mult:2.8,alpha:.24,blur:10,period:4300,color:'#7fd4ff'},
                         {k:'runeMarks',gap:36,size:6,alpha:.9,period:4300,color:'#bfe9ff'},
                         {k:'spikes',len:8,every:3,alpha:.6,period:5300,color:'#e8faff',width:1.4}] },
  ls_sanzu:    { layers:[{k:'clipFill',mult:3,period:4700,color:'#3a6f8f',color2:'#7fffd4',alpha:.8},
                         {k:'pulse',count:3,size:2.6,blur:12,period:3700,alpha:.85,color:'#aaffe8'},
                         {k:'wobble',amp:2.2,freq:.45,period:3100,alpha:.5,mult:.6,color:'#9fe8d8'}] },
  ls_senbon_light:{layers:[{k:'detach',count:20,period:3400,spread:30,size:4,alpha:.9,
                          colors:['#ffb7d5','#ff8ab4','#ffd6e8']},
                         {k:'glint',count:3,size:7,period:3100,alpha:.8,color:'#fff0f6'},
                         {k:'aura',mult:2.2,alpha:.2,period:5300,color:'#ff9ec4'}] },
  // 영웅
  ls_frostmourne:{layers:[{k:'bloom',passes:3,mult:1.4,alpha:.22,period:4300,color:'#5fd0ff'},
                         {k:'spikes',len:12,every:2,alpha:.9,period:4700,color:'#e8faff',width:1.7},
                         {k:'runeMarks',gap:40,size:6,alpha:.8,period:5300,color:'#9fe8ff'},
                         {k:'physics',count:20,period:4200,wind:14,lift:-18,grav:-8,size:1.8,alpha:.75,
                          additive:1,colors:['#bfe9ff','#7fd4ff','#eaffff']}] },
  ls_hellgate: { layers:[{k:'bloom',passes:3,mult:1.4,alpha:.22,period:3700,color:'#b0304f'},
                         {k:'clipFill',mult:3.2,period:4300,color:'#5c0f2a',color2:'#ff3355',alpha:.85},
                         {k:'physics',count:24,period:3000,wind:22,lift:28,grav:16,size:2,alpha:.85,
                          additive:1,colors:['#ff3355','#ff7a4a','#3a1030']},
                         {k:'glint',count:3,size:8,period:3700,alpha:.7,color:'#ffd0d8'}] },
  ls_senbonzakura:{layers:[{k:'bloom',passes:3,mult:1.3,alpha:.2,period:4100,color:'#ff8ab4'},
                         {k:'detach',count:30,period:2800,spread:40,size:4.6,alpha:.95,spin:7,
                          colors:['#ffb7d5','#ff7aa8','#ffd6e8','#ffffff']},
                         {k:'glint',count:5,size:9,period:2300,alpha:.95,color:'#ffffff'},
                         {k:'sweep',color:'#ffe0ee',len:.12,period:3700,alpha:.85,mult:1.6,blur:14}] },
  // 전설
  ls_icecrown_throne:{layers:[{k:'bloom',passes:4,mult:1.6,alpha:.26,period:4700,color:'#5fd0ff'},
                         {k:'clipFill',mode:'stars',mult:3.4,count:26,period:6700,color:'#eaffff',size:1.3,alpha:.9},
                         {k:'spikes',len:14,every:1,alpha:.95,period:4300,color:'#ffffff',width:1.9},
                         {k:'runeMarks',gap:32,size:7,alpha:.9,period:5300,color:'#9fe8ff'},
                         {k:'sweep',color:'#ffffff',len:.13,period:5900,alpha:.95,mult:1.8,blur:18},
                         {k:'physics',count:26,period:5300,wind:18,lift:-22,grav:-10,size:1.9,alpha:.85,
                          additive:1,colors:['#bfe9ff','#7fd4ff','#ffffff']}] },
  ls_yomotsu:  { layers:[{k:'bloom',passes:4,mult:1.5,alpha:.24,period:5300,color:'#7a2b4f'},
                         {k:'clipFill',mult:3.4,period:5900,color:'#2a0a20',color2:'#7fffd4',alpha:.85},
                         {k:'runeMarks',gap:38,size:6,alpha:.75,period:6100,color:'#ff5577'},
                         {k:'physics',count:28,period:4300,wind:16,lift:24,grav:12,size:2,alpha:.9,
                          additive:1,colors:['#ff3355','#7fffd4','#c0a0ff']},
                         {k:'glint',count:4,size:9,period:4700,alpha:.8,color:'#ffe0e8'},
                         {k:'wobble',amp:3,freq:.42,period:3700,alpha:.5,mult:.7,color:'#9fe8d8'}] },
  ls_senbon_kageyoshi:{layers:[{k:'bloom',passes:4,mult:1.6,alpha:.26,period:3700,color:'#ff7aa8'},
                         {k:'detach',count:44,period:2400,spread:52,size:5.2,alpha:.98,spin:9,
                          colors:['#ffb7d5','#ff6f9f','#ffd6e8','#ffffff','#ff9ec4']},
                         {k:'glint',count:7,size:11,period:1900,alpha:.98,color:'#ffffff',width:1.6},
                         {k:'sweep',color:'#fff0f6',len:.14,period:3100,alpha:.95,mult:2,blur:18},
                         {k:'segments',colors:['#ff6f9f','#ffb7d5','#ffffff','#ff9ec4'],period:5300,alpha:.7,mult:1.2},
                         {k:'physics',count:22,period:3400,wind:26,lift:20,grav:14,size:1.8,alpha:.85,
                          additive:1,colors:['#ffb7d5','#ffffff']}] },
};

// ═══════════════════════════════════════════════════════════════════════════
// 공간효과 12종 — 움직임 형태가 전부 다르다
// ═══════════════════════════════════════════════════════════════════════════
const AMB_FX = {
  // 고급
  ae_dust:      { layers:[{k:'motes',count:16,color:'#e0d2b0',alpha:.5,size:2,period:11000}] },
  ae_ink_mote:  { layers:[{k:'confetti',count:10,color:'#8fa8c0',alpha:.45,size:3,ratio:1,period:9000}] },
  ae_firefly:   { layers:[{k:'motes',count:9,color:'#d4ff8a',alpha:.85,size:2.6,period:7000}] },
  // 희귀
  ae_spore:     { layers:[{k:'columns',count:24,color:'#9cf0b0',alpha:.55,size:2.2,period:6300},
                          {k:'edgeGlow',color:'#6fc98a',alpha:.28,period:6700,from:'bottom'}] },
  ae_feather:   { layers:[{k:'confetti',count:12,color:'#f0e2c4',alpha:.55,size:7,ratio:.35,period:9700},
                          {k:'motes',count:8,color:'#fff4dc',alpha:.35,size:1.4,period:13000}] },
  ae_grass:     { layers:[{k:'blades',count:30,color:'#8fd98f',alpha:.5,size:28,period:2900,amp:8},
                          {k:'edgeGlow',color:'#7ec97e',alpha:.24,period:5900,from:'bottom'}] },
  // 영웅
  ae_roar:      { layers:[{k:'ripples',count:3,color:'#ffd98a',alpha:.45,period:5300,width:2.2},
                          {k:'edgeGlow',color:'#ffc46b',alpha:.3,period:4300,from:'bottom'},
                          {k:'meteors',count:2,color:'#fff3c4',alpha:.6,period:5900,len:22,width:1.6},
                          {k:'motes',count:10,color:'#ffe9b8',alpha:.35,size:1.6,period:11000}] },
  ae_firearrow: { layers:[{k:'meteors',count:6,color:'#ff9d3a',alpha:.95,period:3300,len:38,width:2.4},
                          {k:'edgeGlow',color:'#ff7a2a',alpha:.28,period:5300},
                          {k:'confetti',count:12,color:'#ffcf9a',alpha:.4,size:3,ratio:.8,period:7300},
                          {k:'motes',count:10,color:'#ffdcae',alpha:.3,size:1.4,period:12000}] },
  ae_holo:      { layers:[{k:'grid',gap:28,color:'#ffd76b',alpha:.32,period:4700,scan:'#fff3c4',width:1},
                          {k:'motes',count:12,color:'#ffe9b0',alpha:.4,size:1.6,period:9400},
                          {k:'edgeGlow',color:'#ffc94a',alpha:.24,period:6100}] },
  // 전설
  ae_blizzard:  { layers:[{k:'confetti',count:26,color:'#eefaff',alpha:.6,size:3.2,ratio:.9,period:4300},
                          {k:'meteors',count:5,color:'#cfefff',alpha:.5,period:3700,len:30,width:1.4},
                          {k:'columns',count:14,color:'#ffffff',alpha:.3,size:1.6,period:6900},
                          {k:'edgeGlow',color:'#9fe8ff',alpha:.3,period:6700},
                          {k:'ripples',count:2,color:'#bfeaff',alpha:.22,period:9700,width:1.4}] },
  ae_gem_nebula:{ layers:[{k:'blobs',count:5,colors:['#c9a7ff','#7fd4ff','#ffd9f5','#a7ffd9'],alpha:.34,size:70,period:12000},
                          {k:'motes',count:16,color:'#ffffff',alpha:.5,size:1.6,period:10700},
                          {k:'ripples',count:2,color:'#c9a7ff',alpha:.2,period:8900,width:1.6},
                          {k:'edgeGlow',color:'#b08aff',alpha:.26,period:7300},
                          {k:'silhouette',color:'#d0b0ff',alpha:.1,period:17000,y:.2}] },
  ae_ceremony:  { layers:[{k:'confetti',count:30,colors:['#ffd76b','#7fd4ff','#ff8ac4','#8affa8','#fff3c4'],alpha:.85,size:6,ratio:.45,period:6100},
                          {k:'cones',count:2,color:'#fff3c4',alpha:.18,period:6700},
                          {k:'meteors',count:3,color:'#ffffff',alpha:.55,period:4700,len:26,width:1.6},
                          {k:'edgeGlow',color:'#ffe9a8',alpha:.28,period:5900,from:'bottom'},
                          {k:'ripples',count:2,color:'#fff2c0',alpha:.22,period:8300,width:1.6}] },

  // ── 확장 12종 (신규 기법: 보케 / 나선 / 폭죽 / 연기 / 무리 / 섬광) ──
  // 고급
  ae_snowlight: { layers:[{k:'confetti',count:14,color:'#eefaff',alpha:.5,size:2.6,ratio:1,period:8300}] },
  ae_petal:     { layers:[{k:'confetti',count:12,color:'#ffc2dd',alpha:.6,size:6,ratio:.4,period:9700}] },
  ae_bokeh:     { layers:[{k:'bokeh',count:8,colors:['#ffe9a8','#ffd0e8','#bfe9ff'],alpha:.28,size:18,period:13000}] },
  // 희귀
  ae_rain:      { layers:[{k:'rain',count:34,color:'#9fd4ff',alpha:.55,period:1400,len:14,width:1.2},
                          {k:'edgeGlow',color:'#6fa8d8',alpha:.22,period:6700,from:'bottom'}] },
  ae_leaffall:  { layers:[{k:'confetti',count:14,colors:['#e8a04a','#d98f4a','#c96a3a','#e8c07a'],alpha:.6,size:7,ratio:.45,period:9000},
                          {k:'motes',count:8,color:'#e8c07a',alpha:.3,size:1.4,period:12000}] },
  ae_bubble:    { layers:[{k:'columns',count:20,color:'#bfe9ff',alpha:.5,size:3,period:7300},
                          {k:'bokeh',count:5,color:'#bfe9ff',alpha:.18,size:14,period:11000}] },
  // 영웅
  ae_thunder:   { layers:[{k:'flash',color:'#dff0ff',alpha:.4,period:5200},
                          {k:'rain',count:26,color:'#a8c8e8',alpha:.5,period:1200,len:16,width:1.2},
                          {k:'meteors',count:2,color:'#ffffff',alpha:.5,period:4300,len:24,width:1.8},
                          {k:'edgeGlow',color:'#8fb4d8',alpha:.24,period:5900}] },
  ae_smokestack:{ layers:[{k:'smoke',count:16,color:'#8a8f9a',alpha:.32,size:15,period:9000},
                          {k:'motes',count:10,color:'#c0c6d0',alpha:.3,size:1.5,period:11000},
                          {k:'edgeGlow',color:'#6f7580',alpha:.2,period:7300,from:'bottom'}] },
  ae_swarm:     { layers:[{k:'swarm',count:26,color:'#cfe3ff',alpha:.7,size:1.9,period:8000},
                          {k:'swarm',count:16,color:'#9fb8ff',alpha:.45,size:1.5,period:10300},
                          {k:'motes',count:8,color:'#e0e8ff',alpha:.28,size:1.3,period:12700}] },
  // 전설 — 가장 무겁고 화려
  ae_galaxy:    { layers:[{k:'spiral',arms:3,per:46,colors:['#c9a7ff','#7fd4ff','#ffd9f5'],alpha:.5,size:2.5,period:26000,twist:3.2},
                          {k:'bokeh',count:7,colors:['#c9a7ff','#7fd4ff'],alpha:.24,size:20,period:15000},
                          {k:'motes',count:18,color:'#ffffff',alpha:.55,size:1.5,period:10700},
                          {k:'edgeGlow',color:'#8a7bff',alpha:.24,period:8300},
                          {k:'silhouette',color:'#c0a0ff',alpha:.09,period:19000,y:.18}] },
  ae_volcano:   { layers:[{k:'burst',shells:2,per:18,radius:40,colors:['#ff6a2a','#ffb457'],alpha:.85,period:4300,size:2.2,grav:40},
                          {k:'smoke',count:14,color:'#6a5a55',alpha:.34,size:16,period:8300},
                          {k:'columns',count:18,color:'#ff9d3a',alpha:.55,size:2.4,period:5300},
                          {k:'edgeGlow',color:'#ff5a1a',alpha:.3,period:5900,from:'bottom'},
                          {k:'meteors',count:3,color:'#ffcf9a',alpha:.6,period:3700,len:30,width:2}] },
  ae_finale:    { layers:[{k:'burst',shells:4,per:24,radius:52,colors:['#ffd76b','#ff8ac4','#7fd4ff','#8affa8','#ffffff'],alpha:.95,period:3600,size:2.4,grav:34},
                          {k:'confetti',count:26,colors:['#ffd76b','#7fd4ff','#ff8ac4','#8affa8'],alpha:.8,size:5,ratio:.45,period:6100},
                          {k:'cones',count:2,color:'#fff3c4',alpha:.16,period:6700},
                          {k:'flash',color:'#fff6d0',alpha:.3,period:7300},
                          {k:'bokeh',count:6,colors:['#ffe9a8','#ffd0e8'],alpha:.24,size:16,period:12000},
                          {k:'edgeGlow',color:'#ffe9a8',alpha:.26,period:5900,from:'bottom'}] },

  // ── 테마 확장 12종: 얼음왕관 / 황천 / 천본앵 ──
  // 고급
  ae_frostair:  { layers:[{k:'shards',count:12,color:'#dff2ff',alpha:.55,size:4,period:5200}] },
  ae_soulmote:  { layers:[{k:'wisps',count:5,color:'#7fffd4',core:'#eaffff',alpha:.7,size:6,period:8200}] },
  ae_sakura_light:{layers:[{k:'confetti',count:14,colors:['#ffb7d5','#ffd6e8'],alpha:.6,size:6,ratio:.5,period:9000}] },
  // 희귀
  ae_icefall:   { layers:[{k:'shards',count:20,color:'#eaf8ff',alpha:.65,size:5.5,period:4200,drift:.3},
                          {k:'edgeGlow',color:'#7fd4ff',alpha:.22,period:6700}] },
  ae_ghostflame:{ layers:[{k:'wisps',count:9,color:'#7fffd4',core:'#eaffff',alpha:.8,size:7,period:7400},
                          {k:'motes',count:8,color:'#aaffe8',alpha:.35,size:1.4,period:11000}] },
  ae_petalstream:{layers:[{k:'vortex',count:34,colors:['#ffb7d5','#ff8ab4','#ffd6e8'],alpha:.7,size:4.5,period:6200,twist:3.4},
                          {k:'edgeGlow',color:'#ff9ec4',alpha:.2,period:6100}] },
  // 영웅
  ae_icecrown:  { layers:[{k:'shards',count:26,color:'#eaf8ff',alpha:.7,size:6,period:3600,drift:.34},
                          {k:'confetti',count:22,color:'#ffffff',alpha:.5,size:2.8,ratio:1,period:4200},
                          {k:'runeRing',count:2,color:'#9fe8ff',alpha:.45,period:8300,size:26},
                          {k:'edgeGlow',color:'#5fd0ff',alpha:.3,period:5900}] },
  ae_sanzu:     { layers:[{k:'wisps',count:12,color:'#7fffd4',core:'#eaffff',alpha:.8,size:8,period:7000},
                          {k:'smoke',count:10,color:'#4a5a6a',alpha:.28,size:16,period:9700},
                          {k:'lily',count:4,color:'#ff3355',alpha:.6,period:9000,size:12},
                          {k:'edgeGlow',color:'#3f7f7a',alpha:.24,period:6700,from:'bottom'}] },
  ae_senbon:    { layers:[{k:'vortex',count:44,colors:['#ffb7d5','#ff7aa8','#ffd6e8','#ffffff'],alpha:.85,size:5,period:5200,twist:4.2},
                          {k:'meteors',count:3,color:'#ffffff',alpha:.5,period:3700,len:22,width:1.4},
                          {k:'edgeGlow',color:'#ff8ab4',alpha:.26,period:5300},
                          {k:'bokeh',count:5,colors:['#ffd6e8','#ffffff'],alpha:.2,size:15,period:11000}] },
  // 전설
  ae_lichking:  { layers:[{k:'shards',count:34,color:'#eaf8ff',alpha:.75,size:7,period:3200,drift:.4},
                          {k:'confetti',count:28,color:'#ffffff',alpha:.55,size:3,ratio:1,period:3800},
                          {k:'runeRing',count:2,color:'#9fe8ff',alpha:.6,period:7600,size:32,ticks:10},
                          {k:'wisps',count:7,color:'#7fd4ff',core:'#ffffff',alpha:.6,size:6,period:8600},
                          {k:'silhouette',color:'#bfe9ff',alpha:.11,period:16000,y:.24},
                          {k:'edgeGlow',color:'#5fd0ff',alpha:.32,period:5600}] },
  ae_yomi:      { layers:[{k:'lily',count:6,color:'#ff3355',alpha:.75,period:8600,size:16,petals:9},
                          {k:'wisps',count:13,color:'#7fffd4',core:'#eaffff',alpha:.8,size:8,period:6800},
                          {k:'smoke',count:14,color:'#3a2a3a',alpha:.34,size:18,period:9000},
                          {k:'runeRing',count:2,color:'#ff5577',alpha:.45,period:9400,size:26},
                          {k:'confetti',count:16,color:'#6a4a5a',alpha:.4,size:3,ratio:.9,period:7300},
                          {k:'edgeGlow',color:'#5a1030',alpha:.3,period:6100,from:'bottom'}] },
  ae_senbon_kageyoshi:{layers:[{k:'vortex',count:58,colors:['#ffb7d5','#ff6f9f','#ffd6e8','#ffffff','#ff9ec4'],alpha:.9,size:5.6,period:4400,twist:5},
                          {k:'vortex',count:30,colors:['#ffffff','#ffd6e8'],alpha:.6,size:3.4,period:6800,twist:-3.6,inward:1},
                          {k:'meteors',count:4,color:'#ffffff',alpha:.6,period:3100,len:26,width:1.6},
                          {k:'bokeh',count:7,colors:['#ffd6e8','#ffffff','#ff9ec4'],alpha:.26,size:18,period:12000},
                          {k:'flash',color:'#fff0f6',alpha:.24,period:7900},
                          {k:'edgeGlow',color:'#ff7aa8',alpha:.3,period:5300}] },
};

// ── 애니메이션 드라이버 ─────────────────────────────────────────────────────
const liveCharts = new Set();
let rafId = null, lastTick = 0;
const V11_AMBIENT_IDS = new Set([
  'ae11_u_champion_stadium','ae11_u_ink_battlefield','ae11_u_navy_bear_victory','ae11_u_twin_night_game','ae11_u_tiger_homerun',
  'ae11_r_eight_formation','ae11_r_red_cliff','ae11_r_crescent_dragon','ae11_r_imperial_jade_seal','ae11_r_moon_archive',
  'ae11_e_storm_dimension','ae11_e_crimson_chaos','ae11_e_starforged_reactor','ae11_e_spider_rift','ae11_e_vibranium_guard',
  'ae11_m_frozen_crown','ae11_m_black_sanctuary','ae11_m_banshee_dirge','ae11_m_iron_warchief','ae11_m_raven_arcane',
  'ae12_m_tidal_archmage_blizzard',
  'ae13_m_azshara_maelstrom','ae13_m_sunwell_phoenix','ae13_e_star_shield_salute',
  'ae13_u_softbear_cheer','ae13_u_loopy_party',
]);
const V11_LINE_FX = Object.freeze({
  ls11_u_champion_stitch:{renderer:'stitch',layers:[]},
  ls11_u_ink_tactics:{renderer:'dryBrush',layers:[]},
  ls12_u_pace_tape:{renderer:'paceTape',layers:[]},
  ls12_u_measure_cable:{renderer:'measureCable',layers:[]},
  ls12_u_dawn_reflector:{renderer:'reflector',layers:[]},
  ls11_r_wolong_feather:{renderer:'feather',layers:[]},
  ls11_r_red_cliff_fire:{renderer:'emberInk',layers:[]},
  ls12_r_moon_bronze:{renderer:'bronze',layers:[]},
  ls12_r_glasshouse_vein:{renderer:'leafVein',layers:[]},
  ls12_r_constellation_chart:{renderer:'constellation',layers:[]},
  ls11_e_thunder_current:{renderer:'thunder',layers:[
    {k:'aura',color:'#5aa7ff',alpha:.28,mult:4.2,period:4800},{k:'zigzag',color:'#eaf6ff',alpha:.9,period:2900,amp:4},
    {k:'race',colors:['#ffffff','#65b8ff','#ffd66b'],alpha:.75,period:3500},{k:'glint',color:'#ffffff',count:5,period:4100},
  ]},
  ls12_e_spider_tension:{renderer:'spider',layers:[]},
  ls11_e_crimson_chaos:{renderer:'crimson',layers:[
    {k:'echo',color:'#4b0a26',alpha:.34,offset:5,period:5700},{k:'weave',color:'#ff356f',alpha:.78,period:4200,amp:4},
    {k:'runeMarks',color:'#ff9dbc',alpha:.72,count:10,period:5300},{k:'bloom',color:'#ffffff',alpha:.32,period:7100},
  ]},
  ls12_e_starforged_nano:{renderer:'nano',layers:[]},
  ls12_e_arcane_seam:{renderer:'arcaneSeam',layers:[]},
  ls11_m_frozen_runeblade:{renderer:'soulHarvest',layers:[
    {k:'aura',color:'#1c6da8',alpha:.3,mult:5.2,period:7200},{k:'parallel',color:'#dff8ff',alpha:.5,offset:3,period:5100},
    {k:'spikes',color:'#9eeaff',alpha:.68,count:18,period:6700},{k:'runeMarks',color:'#dffcff',alpha:.8,count:12,period:5900},
    {k:'sweep',color:'#ffffff',alpha:.9,period:4400,width:72},{k:'detach',color:'#6ddcff',alpha:.55,count:10,period:7900},
  ]},
  ls11_m_nether_twinblade:{renderer:'eyeBeam',layers:[
    {k:'echo',color:'#160b22',alpha:.5,offset:7,period:6900},{k:'parallel',color:'#84ff5c',alpha:.72,offset:4,period:4700},
    {k:'weave',color:'#39d353',alpha:.7,period:5300,amp:5},{k:'runeMarks',color:'#c4ff9a',alpha:.65,count:12,period:6100},
    {k:'sweep',color:'#edffdf',alpha:.85,period:3900,width:76},{k:'detach',color:'#9c4dff',alpha:.5,count:12,period:8300},
  ]},
  ls12_m_domination_chain:{renderer:'domination',layers:[]},
  ls12_m_corrupted_ironstar:{renderer:'ironStar',layers:[]},
  ls12_m_flamewreath_paradox:{renderer:'flameWreath',layers:[]},
  ls12_m_tidal_archmage_frost:{renderer:'frostTide',layers:[]},
  ls13_m_azshara_tide:{renderer:'queenTide',layers:[]},
  ls13_m_sunwell_phoenix:{renderer:'phoenixRise',layers:[]},
  ls13_e_star_shield_rally:{renderer:'shieldRally',layers:[]},
  ls13_u_softbear_stitch:{renderer:'softBearStitch',layers:[]},
  ls13_u_twins_pinstripe:{renderer:'twinsStripe',layers:[]},
  ls13_u_loopy_bounce:{renderer:'loopyBounce',layers:[]},
});

function v11Stroke(ctx,pts,color,width,alpha=1,dash=[]){
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=withAlpha(color,alpha);ctx.lineWidth=width;
  ctx.setLineDash(dash);tracePath(ctx,pts);ctx.stroke();ctx.restore();
}
function v11PathMark(ctx,p,angle,draw){
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(angle);draw(ctx);ctx.restore();
}
function v11MarkAngle(p){return Math.atan2(p.ty||0,p.tx||1);}
const V11_LINE_RENDERERS=Object.freeze({
  stitch(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,base.color,Math.max(1,base.width*.52),.62,[2,8]);
    const total=acc.at(-1)||1,gap=15,shift=Math.sin(T/1800)*1.2;
    for(let d=gap*.5;d<total;d+=gap){const p=atDistance(pts,acc,d),side=Math.floor(d/gap)%2?1:-1,a=v11MarkAngle(p);
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha(base.color,.92);c.lineWidth=Math.max(1.2,base.width*.68);c.lineCap='round';
        c.beginPath();c.moveTo(-5,-3.5*side+shift);c.quadraticCurveTo(0,1.2*side,5,3.5*side-shift);c.stroke();
        c.fillStyle=withAlpha(base.color,.75);c.beginPath();c.arc(-5,-3.5*side+shift,1.1,0,TAU);c.arc(5,3.5*side-shift,1.1,0,TAU);c.fill();});
    }
  },
  dryBrush(ctx,pts,acc,T,base){
    const breath=.94+.06*Math.sin(T/2400);
    for(let pass=0;pass<5;pass++){ctx.save();ctx.lineCap='butt';ctx.lineJoin='round';
      ctx.strokeStyle=withAlpha(base.color,(.3-pass*.035)*breath);ctx.lineWidth=base.width*(1.9-pass*.24);
      ctx.setLineDash([20+pass*5,3+pass*2,2,5+pass]);ctx.lineDashOffset=pass*7;tracePath(ctx,pts);ctx.stroke();ctx.restore();}
    const total=acc.at(-1)||1;for(let d=11;d<total;d+=27){const p=atDistance(pts,acc,d),a=v11MarkAngle(p);
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha(base.color,.35);c.lineWidth=.7;
        for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(-7,k*1.15);c.lineTo(6+(k%2)*4,k*.8);c.stroke();}});}
  },
  paceTape(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,base.color,base.width*2.45,.78);
    v11Stroke(ctx,pts,'#ffffff',Math.max(.8,base.width*.34),.32);
    const total=acc.at(-1)||1;for(let d=22;d<total;d+=44){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),fold=.75+.25*Math.sin(T/2600+d);
      v11PathMark(ctx,p,a,c=>{c.fillStyle=withAlpha('#071018',.54);c.beginPath();c.moveTo(-6,-base.width*1.25);c.lineTo(6,0);c.lineTo(-6,base.width*1.25);c.closePath();c.fill();
        c.strokeStyle=withAlpha('#ffffff',.42*fold);c.lineWidth=.8;c.beginPath();c.moveTo(-5,-base.width);c.lineTo(5,0);c.lineTo(-5,base.width);c.stroke();});}
  },
  measureCable(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,'#05090d',base.width*3.25,.82);v11Stroke(ctx,pts,base.color,base.width*1.42,.88);
    const total=acc.at(-1)||1;for(let d=18;d<total;d+=36){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),pulse=.84+.16*Math.sin(T/2100+d*.08);
      v11PathMark(ctx,p,a,c=>{c.fillStyle=withAlpha('#121a22',.96);c.strokeStyle=withAlpha(base.color,.9*pulse);c.lineWidth=1;
        c.beginPath();c.roundRect(-5,-5,10,10,2);c.fill();c.stroke();for(let k=-3;k<=3;k+=3){c.beginPath();c.moveTo(k,-4);c.lineTo(k,4);c.stroke();}});}
  },
  reflector(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,base.color,base.width*1.18,.52,[13,8]);v11Stroke(ctx,pts,'#dce8ee',base.width*.44,.62,[4,17]);
    const total=acc.at(-1)||1,head=((T/5200)%1)*total;
    for(let i=0;i<4;i++){const p=atDistance(pts,acc,(head-i*12+total)%total),a=v11MarkAngle(p),fade=1-i/4;
      v11PathMark(ctx,p,a,c=>{const g=c.createLinearGradient(-9,0,9,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,withAlpha('#ffffff',.9*fade));g.addColorStop(1,'rgba(255,255,255,0)');
        c.strokeStyle=g;c.lineWidth=base.width*(2.5-i*.35);c.beginPath();c.moveTo(-9,0);c.lineTo(9,0);c.stroke();});}
  },
  feather(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,'#f5f0df',base.width*1.15,.88);v11Stroke(ctx,pts,base.color,base.width*.42,.9);
    const total=acc.at(-1)||1;for(let d=13;d<total;d+=13){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),side=Math.floor(d/13)%2?1:-1,sway=Math.sin(T/2900+d*.05)*1.2;
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha(base.color,.55);c.lineWidth=.9;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-5,side*(5+sway),-11,side*(7+sway));c.stroke();
        c.strokeStyle=withAlpha('#ffffff',.38);c.beginPath();c.moveTo(-2,side*2);c.lineTo(-8,side*(6+sway));c.stroke();});}
  },
  emberInk(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#120b0a',7.2,.78);v11Stroke(ctx,pts,'#512118',3.6,.9);
    const total=acc.at(-1)||1;for(let d=9;d<total;d+=17){const p=atDistance(pts,acc,d),hot=.15+.85*Math.max(0,Math.sin(T/1500+d*.11));
      ctx.save();ctx.fillStyle=withAlpha(d%34<18?'#ff602e':'#ffc04a',.32+.5*hot);ctx.shadowColor='#ff3d1f';ctx.shadowBlur=7*hot;
      ctx.beginPath();ctx.arc(p.x,p.y,1.1+hot*1.1,0,TAU);ctx.fill();ctx.restore();}
  },
  bronze(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#23170f',8,.92);v11Stroke(ctx,pts,'#9b6b32',5.1,.94);v11Stroke(ctx,pts,'#57c9b8',1.55,.82);
    const total=acc.at(-1)||1;for(let d=20;d<total;d+=40){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),gleam=.68+.32*Math.sin(T/3100+d);
      v11PathMark(ctx,p,a,c=>{c.fillStyle=withAlpha('#d6aa57',.9);c.strokeStyle=withAlpha('#fff0b0',.5*gleam);c.lineWidth=1;
        c.beginPath();c.arc(0,0,3.2,0,TAU);c.fill();c.stroke();c.fillStyle='#365f58';c.beginPath();c.arc(0,0,1.15,0,TAU);c.fill();});}
  },
  leafVein(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,base.color,base.width*1.25,.7);v11Stroke(ctx,pts,'#e9fff1',base.width*.34,.64);
    const total=acc.at(-1)||1;for(let d=16;d<total;d+=24){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),side=Math.floor(d/24)%2?1:-1,g=.82+.18*Math.sin(T/2700+d);
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha(base.color,.52);c.lineWidth=1;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(4,-side*5,10,-side*7);c.stroke();
        c.fillStyle=withAlpha(base.color,.28);c.beginPath();c.ellipse(10,-side*7,4.8,2.4,-side*.45,0,TAU);c.fill();
        c.fillStyle=withAlpha('#eaffff',.75*g);c.beginPath();c.arc(4,side*2,1.4,0,TAU);c.fill();});}
  },
  constellation(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,base.color,Math.max(1,base.width*.48),.52);
    const total=acc.at(-1)||1,nodes=[.04,.13,.25,.39,.51,.66,.79,.91,.98];
    nodes.forEach((q,i)=>{const p=atDistance(pts,acc,total*q),a=v11MarkAngle(p),tw=.55+.45*Math.sin(T/1700+i*1.7);
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha(base.color,.5+.4*tw);c.fillStyle=withAlpha(i%3===0?'#ffe6a6':'#ffffff',.7+.28*tw);c.lineWidth=1;
        if(i%3===0){c.beginPath();c.arc(0,0,4.2,0,TAU);c.stroke();c.beginPath();c.arc(0,0,1.5,0,TAU);c.fill();}
        else{const r=i%2?3.8:2.6;c.beginPath();c.moveTo(-r,0);c.lineTo(r,0);c.moveTo(0,-r);c.lineTo(0,r);c.stroke();c.beginPath();c.arc(0,0,1.2,0,TAU);c.fill();}
        c.strokeStyle=withAlpha(base.color,.25);c.beginPath();c.moveTo(0,-6);c.lineTo(0,6);c.stroke();});});
  },
  thunder(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#173f72',9,.35);v11Stroke(ctx,pts,'#9edcff',2.2,.94);
    const total=acc.at(-1)||1;for(let lane=0;lane<3;lane++){const head=(((T/(1800+lane*470))+lane*.29)%1)*total;
      ctx.save();ctx.strokeStyle=withAlpha(lane===2?'#ffd66b':'#eefaff',.75);ctx.lineWidth=1.1+lane*.25;ctx.shadowColor=lane===2?'#ffd66b':'#6abfff';ctx.shadowBlur=9;
      ctx.beginPath();for(let k=0;k<12;k++){const d=head-k*8;if(d<0)continue;const p=atDistance(pts,acc,d),j=(rnd(k+lane*17+Math.floor(T/120),4)-.5)*8;
        k?ctx.lineTo(p.x+p.nx*j,p.y+p.ny*j):ctx.moveTo(p.x+p.nx*j,p.y+p.ny*j);}ctx.stroke();ctx.restore();}
  },
  spider(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#0d1d38',8,.56);v11Stroke(ctx,pts,'#75baff',1.5,.9);
    const total=acc.at(-1)||1;for(let d=18;d<total;d+=29){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),pull=.72+.28*Math.sin(T/900+d);
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha(Math.floor(d/29)%2?'#ef445d':'#82c7ff',.7);c.lineWidth=1;c.beginPath();
        c.moveTo(-8,0);c.lineTo(0,-7*pull);c.lineTo(8,0);c.lineTo(0,7*pull);c.closePath();c.moveTo(-5,-4*pull);c.lineTo(5,4*pull);c.moveTo(-5,4*pull);c.lineTo(5,-4*pull);c.stroke();});}
  },
  crimson(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#3a071d',10,.48);v11Stroke(ctx,pts,'#ff477e',2.3,.92);
    const total=acc.at(-1)||1;for(let d=24;d<total;d+=48){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),phase=Math.sin(T/1100+d*.07);
      v11PathMark(ctx,p,a,c=>{for(const side of [-1,1]){c.strokeStyle=withAlpha(side>0?'#ff99bd':'#bb2dff',.55);c.lineWidth=1.2;c.beginPath();c.moveTo(-10,0);
        c.quadraticCurveTo(0,side*(5+phase*3),11,side*(8+phase*2));c.stroke();}c.fillStyle=withAlpha('#ffd0df',.8);c.save();c.rotate(T/1800+d);c.fillRect(-2.2,-2.2,4.4,4.4);c.restore();});}
  },
  nano(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#29110a',10,.7);v11Stroke(ctx,pts,'#ffb347',1.6,.9);
    const total=acc.at(-1)||1;for(let d=12;d<total;d+=18){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),on=.55+.45*Math.sin(T/700-d*.05);
      v11PathMark(ctx,p,a,c=>{c.fillStyle=withAlpha(Math.floor(d/18)%2?'#8c1e16':'#b66a24',.82);c.strokeStyle=withAlpha('#ffe4a3',.34+.4*on);c.lineWidth=.9;
        c.beginPath();c.moveTo(-7,-3);c.lineTo(4,-4);c.lineTo(7,0);c.lineTo(4,4);c.lineTo(-7,3);c.closePath();c.fill();c.stroke();
        c.fillStyle=withAlpha('#bffcff',.45+.45*on);c.beginPath();c.arc(0,0,1.4,0,TAU);c.fill();});}
  },
  arcaneSeam(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#29164c',8,.54);v11Stroke(ctx,pts,'#c4a5ff',1.8,.9);
    const total=acc.at(-1)||1;for(let d=17;d<total;d+=34){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),spin=T/1300+d*.03;
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha('#e6d8ff',.66);c.lineWidth=1;c.beginPath();c.arc(0,0,5.5,spin,spin+Math.PI*1.42);c.stroke();
        c.strokeStyle=withAlpha('#7ce5ff',.62);for(const s of [-1,1]){c.beginPath();c.moveTo(-7,s*4);c.lineTo(0,-s*2);c.lineTo(7,s*4);c.stroke();}});}
  },
  soulHarvest(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#061522',14,.66);v11Stroke(ctx,pts,'#5ac7ed',4,.78);v11Stroke(ctx,pts,'#e3fbff',1.5,.96);
    const total=acc.at(-1)||1,cycle=(T/6200)%1;
    for(let d=16;d<total;d+=22){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),frost=.55+.45*Math.sin(T/1300+d);
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha('#9feaff',.45+.35*frost);c.lineWidth=1;c.beginPath();c.moveTo(0,0);c.lineTo(-4,-8*frost);c.lineTo(1,-5);c.lineTo(5,-11*frost);c.stroke();});}
    const head=cycle*total;for(let k=0;k<7;k++){const p=atDistance(pts,acc,(head-k*13+total)%total),fade=1-k/7;ctx.save();ctx.fillStyle=withAlpha('#dfffff',.75*fade);ctx.shadowColor='#61d6ff';ctx.shadowBlur=14;
      ctx.beginPath();ctx.arc(p.x,p.y-(k%2)*5,4.2*fade,0,TAU);ctx.fill();ctx.restore();}
  },
  eyeBeam(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#071507',15,.58);for(const off of [-4,4]){ctx.save();ctx.strokeStyle=withAlpha(off<0?'#b4ff54':'#38e673',.82);ctx.lineWidth=2.4;ctx.shadowColor='#6cff43';ctx.shadowBlur=13;
      ctx.beginPath();pts.forEach((p,i)=>{const n=normalAt(pts,i);i?ctx.lineTo(p.x+n.nx*off,p.y+n.ny*off):ctx.moveTo(p.x+n.nx*off,p.y+n.ny*off);});ctx.stroke();ctx.restore();}
    const total=acc.at(-1)||1,head=((T/3000)%1)*total;for(let k=0;k<9;k++){const p=atDistance(pts,acc,(head-k*10+total)%total),a=v11MarkAngle(p);
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha('#e8ffd1',.72*(1-k/9));c.lineWidth=1.6;c.beginPath();c.moveTo(-8,-7);c.lineTo(8,7);c.moveTo(-8,7);c.lineTo(8,-7);c.stroke();});}
  },
  domination(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#120d20',13,.72);const total=acc.at(-1)||1;
    for(let d=9;d<total;d+=13){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),tw=.75+.25*Math.sin(T/850+d);
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha('#c8b1e9',.76);c.lineWidth=1.7;c.beginPath();c.ellipse(0,0,6,3.2*tw,Math.floor(d/13)%2?0:.7,0,TAU);c.stroke();});}
    const arrow=atDistance(pts,acc,((T/3900)%1)*total),a=v11MarkAngle(arrow);v11PathMark(ctx,arrow,a,c=>{c.fillStyle='#ff294d';c.shadowColor='#ff294d';c.shadowBlur=16;c.beginPath();c.moveTo(12,0);c.lineTo(-4,-5);c.lineTo(0,0);c.lineTo(-4,5);c.closePath();c.fill();});
  },
  ironStar(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#1d0905',15,.72);v11Stroke(ctx,pts,'#ff5b24',3.3,.83);
    const total=acc.at(-1)||1;for(let q=.1;q<1;q+=.2){const p=atDistance(pts,acc,total*((q+T/8500)%1)),a=v11MarkAngle(p),spin=T/420;
      v11PathMark(ctx,p,a,c=>{c.rotate(spin);c.fillStyle='#32140e';c.strokeStyle='#ff8a3d';c.lineWidth=1.4;c.shadowColor='#ff431f';c.shadowBlur=12;c.beginPath();
        for(let k=0;k<12;k++){const r=k%2?4.5:10,ang=k/12*TAU;c.lineTo(Math.cos(ang)*r,Math.sin(ang)*r);}c.closePath();c.fill();c.stroke();});}
    for(let d=18;d<total;d+=39){const p=atDistance(pts,acc,d);ctx.fillStyle=withAlpha('#5d123b',.65);ctx.beginPath();ctx.arc(p.x,p.y,3+2*Math.sin(T/900+d),0,TAU);ctx.fill();}
  },
  flameWreath(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#24112f',14,.62);v11Stroke(ctx,pts,'#d69cff',2.4,.9);
    const total=acc.at(-1)||1;for(let d=21;d<total;d+=42){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),spin=T/1700+d;
      v11PathMark(ctx,p,a,c=>{for(let ring=0;ring<2;ring++){c.strokeStyle=withAlpha(ring?'#ff8a32':'#e8b3ff',.72-ring*.12);c.lineWidth=1.3;c.beginPath();c.arc(0,0,6+ring*4,spin*(ring?-.7:1),spin*(ring?-.7:1)+Math.PI*1.55);c.stroke();}
        c.fillStyle=withAlpha('#8ee8ff',.72);c.beginPath();c.moveTo(0,-7);c.lineTo(3,0);c.lineTo(0,7);c.lineTo(-3,0);c.closePath();c.fill();});}
    const reverse=((T/5200)%1)*total;for(let k=0;k<6;k++){const p=atDistance(pts,acc,total-((reverse+k*17)%total));ctx.fillStyle=withAlpha('#ffffff',.55*(1-k/6));ctx.beginPath();ctx.arc(p.x,p.y,2.4,0,TAU);ctx.fill();}
  },
  frostTide(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,'#0b3558',base.width*4.8,.42);
    v11Stroke(ctx,pts,'#5bcce8',base.width*2.15,.76);
    v11Stroke(ctx,pts,'#effdff',Math.max(1,base.width*.48),.92);
    const total=acc.at(-1)||1,head=((T/5600)%1)*total;
    for(let trail=0;trail<8;trail++){
      const p=atDistance(pts,acc,(head-trail*13+total)%total),fade=1-trail/8;
      ctx.save();ctx.fillStyle=withAlpha(trail%2?'#7ee8ff':'#ffffff',fade*.72);ctx.shadowColor='#67dfff';ctx.shadowBlur=10*fade;
      ctx.beginPath();ctx.ellipse(p.x,p.y,4.4*fade,2.1*fade,v11MarkAngle(p),0,TAU);ctx.fill();ctx.restore();
    }
    for(let d=28;d<total;d+=56){
      const p=atDistance(pts,acc,d),pulse=.78+.22*Math.sin(T/1050+d*.08);
      v11Snowflake(ctx,p.x,p.y,5.5*pulse,'#dcfaff',.7,T/4000+d);
    }
  },
  queenTide(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,'#082c3d',base.width*5,.5);v11Stroke(ctx,pts,'#36cbbb',base.width*2.2,.76);v11Stroke(ctx,pts,'#c9fff8',Math.max(1,base.width*.42),.9);
    const total=acc.at(-1)||1,head=((T/4300)%1)*total;
    for(let k=0;k<9;k++){const p=atDistance(pts,acc,(head-k*12+total)%total),fade=1-k/9,a=v11MarkAngle(p);
      v11PathMark(ctx,p,a,c=>{c.strokeStyle=withAlpha(k%2?'#7df5e8':'#ffd08a',.72*fade);c.lineWidth=1.3;c.beginPath();c.arc(0,0,3+5*fade,-1.2,1.2);c.stroke();});}
    for(let d=24;d<total;d+=48){const p=atDistance(pts,acc,d),pulse=.76+.24*Math.sin(T/900+d);ctx.save();ctx.fillStyle=withAlpha('#e9ffff',.72);ctx.shadowColor='#55ead8';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(p.x,p.y,2.2*pulse,0,TAU);ctx.fill();ctx.restore();}
  },
  phoenixRise(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#3a1008',15,.54);v11Stroke(ctx,pts,'#f06b24',5.6,.82);v11Stroke(ctx,pts,'#ffd66c',1.45,.95);
    const total=acc.at(-1)||1,head=((T/3900)%1)*total;
    for(let k=0;k<11;k++){const p=atDistance(pts,acc,(head-k*14+total)%total),fade=1-k/11,a=v11MarkAngle(p),side=k%2?1:-1;
      v11PathMark(ctx,p,a,c=>{c.fillStyle=withAlpha(k<3?'#fff2a8':'#ff7c35',.72*fade);c.beginPath();c.moveTo(7,0);c.quadraticCurveTo(-1,side*7,-10,side*(3+fade*3));c.quadraticCurveTo(-5,side*1,7,0);c.fill();});}
    for(let d=35;d<total;d+=70){const p=atDistance(pts,acc,d);ctx.fillStyle='#57db86';ctx.shadowColor='#9cffbd';ctx.shadowBlur=9;ctx.beginPath();ctx.moveTo(p.x,p.y-4);ctx.lineTo(p.x+3,p.y);ctx.lineTo(p.x,p.y+4);ctx.lineTo(p.x-3,p.y);ctx.closePath();ctx.fill();}
  },
  shieldRally(ctx,pts,acc,T){
    v11Stroke(ctx,pts,'#08162d',11,.7);v11Stroke(ctx,pts,'#b6c9dd',4.2,.84);v11Stroke(ctx,pts,'#7aa6df',1.3,.92);
    const total=acc.at(-1)||1;for(let d=26;d<total;d+=52){const p=atDistance(pts,acc,d),a=v11MarkAngle(p),pulse=.84+.16*Math.sin(T/1100+d);
      v11PathMark(ctx,p,a,c=>{c.save();c.scale(pulse,pulse);c.fillStyle=withAlpha('#f3f6fa',.8);c.beginPath();for(let i=0;i<10;i++){const r=i%2?2.4:5.4,ang=-Math.PI/2+i*Math.PI/5;c.lineTo(Math.cos(ang)*r,Math.sin(ang)*r);}c.closePath();c.fill();c.restore();});}
    const q=((T/5000)%1)*total,p=atDistance(pts,acc,q);ctx.strokeStyle=withAlpha('#b84b55',.72);ctx.lineWidth=5;ctx.beginPath();ctx.arc(p.x,p.y,8,0,TAU);ctx.stroke();
  },
  softBearStitch(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,'#15203f',base.width*2.8,.8,[12,5]);v11Stroke(ctx,pts,base.color,Math.max(1,base.width*.45),.78,[4,13]);
    const total=acc.at(-1)||1;for(let d=30;d<total;d+=60){const p=atDistance(pts,acc,d),a=v11MarkAngle(p);
      v11PathMark(ctx,p,a,c=>{c.fillStyle=withAlpha('#f5dfb8',.88);c.beginPath();c.arc(0,1,3.5,0,TAU);c.arc(-3,-3,1.4,0,TAU);c.arc(0,-4,1.4,0,TAU);c.arc(3,-3,1.4,0,TAU);c.fill();});}
  },
  twinsStripe(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,'#f5f5f2',base.width*2.8,.82);v11Stroke(ctx,pts,base.color,base.width*.72,.92,[18,7]);
    const total=acc.at(-1)||1;for(let d=24;d<total;d+=48){const p=atDistance(pts,acc,d),a=v11MarkAngle(p);
      v11PathMark(ctx,p,a,c=>{for(const side of [-1,1]){c.fillStyle=withAlpha(side<0?'#d52952':'#f4f4f4',.9);c.beginPath();for(let i=0;i<10;i++){const r=i%2?1.7:3.7,ang=-Math.PI/2+i*Math.PI/5;c.lineTo(side*4+Math.cos(ang)*r,Math.sin(ang)*r);}c.closePath();c.fill();}});}
  },
  loopyBounce(ctx,pts,acc,T,base){
    v11Stroke(ctx,pts,'#17131b',base.width*3.3,.78);v11Stroke(ctx,pts,base.color,base.width*1.25,.92,[10,7]);
    const total=acc.at(-1)||1,shift=((T/3600)%1)*total;for(let d=0;d<total;d+=44){const p=atDistance(pts,acc,(d+shift)%total),a=v11MarkAngle(p),hop=Math.abs(Math.sin(T/520+d)) * 4;
      v11PathMark(ctx,p,a,c=>{c.translate(0,-hop);c.fillStyle='#fff8ee';c.strokeStyle='#e9639b';c.lineWidth=1;c.beginPath();c.roundRect(-4,-3,3.2,6,1);c.roundRect(.8,-3,3.2,6,1);c.fill();c.stroke();});}
  },
});

function v11Ellipse(ctx,x,y,rx,ry,color,alpha,blur=0){
  ctx.save();ctx.fillStyle=withAlpha(color,alpha);ctx.shadowColor=withAlpha(color,alpha);ctx.shadowBlur=blur;
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill();ctx.restore();
}
function v11Particle(ctx,x,y,size,color,alpha,kind='orb',rotation=0){
  ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.fillStyle=withAlpha(color,alpha);
  if(kind==='petal'){ctx.beginPath();ctx.moveTo(0,-size);ctx.bezierCurveTo(size*.8,-size*.4,size*.7,size*.7,0,size);ctx.bezierCurveTo(-size*.7,size*.7,-size*.8,-size*.4,0,-size);ctx.fill();}
  else if(kind==='shard'){ctx.beginPath();ctx.moveTo(0,-size);ctx.lineTo(size*.45,0);ctx.lineTo(0,size);ctx.lineTo(-size*.25,0);ctx.closePath();ctx.fill();}
  else {ctx.beginPath();ctx.arc(0,0,size,0,TAU);ctx.fill();}
  ctx.restore();
}
function v11Snowflake(ctx,x,y,radius,color,alpha,rotation=0){
  ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.strokeStyle=withAlpha(color,alpha);ctx.lineWidth=Math.max(.65,radius*.12);ctx.lineCap='round';
  for(let arm=0;arm<6;arm++){ctx.rotate(TAU/6);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(radius,0);ctx.moveTo(radius*.58,0);ctx.lineTo(radius*.78,-radius*.2);ctx.moveTo(radius*.58,0);ctx.lineTo(radius*.78,radius*.2);ctx.stroke();}
  ctx.restore();
}
function v11Bolt(ctx,x0,y0,x1,y1,color,alpha,seed,width=1.4){
  const segments=9;ctx.save();ctx.strokeStyle=withAlpha(color,alpha);ctx.lineWidth=width;ctx.shadowColor=color;ctx.shadowBlur=8;
  ctx.beginPath();ctx.moveTo(x0,y0);
  for(let i=1;i<segments;i++){const p=i/segments;ctx.lineTo(x0+(x1-x0)*p+(rnd(seed+i,3)-.5)*18,y0+(y1-y0)*p+(rnd(seed+i,4)-.5)*9);}
  ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();
}
function v11ProtectCenter(ctx,area){
  const w=area.right-area.left,h=area.bottom-area.top;
  const g=ctx.createRadialGradient(area.left+w*.52,area.top+h*.5,0,area.left+w*.52,area.top+h*.5,Math.max(w,h)*.48);
  g.addColorStop(0,'rgba(4,8,14,.18)');g.addColorStop(.55,'rgba(4,8,14,.06)');g.addColorStop(1,'rgba(4,8,14,0)');
  ctx.fillStyle=g;ctx.fillRect(area.left,area.top,w,h);
}
const v11ArtCache=new Map();
function v11Art(id,index){
  const key=`${id}_${String(index).padStart(2,'0')}`;
  if(v11ArtCache.has(key))return v11ArtCache.get(key);
  const image=new Image();image.decoding='async';
  image.src=`./assets/showroom-v11/ambient_effect/${key}.png`;
  v11ArtCache.set(key,image);return image;
}
function v11DrawArt(ctx,id,index,x,y,size,alpha,rotation=0,blend='screen'){
  const image=v11Art(id,index);if(!image.complete||!image.naturalWidth)return;
  ctx.save();ctx.globalCompositeOperation=blend;ctx.globalAlpha=clamp(alpha,0,1);
  ctx.translate(x,y);ctx.rotate(rotation);ctx.drawImage(image,-size/2,-size/2,size,size);ctx.restore();
}
function v11ArtStream(ctx,a,id,t,{count=14,indices=[1,2],speed=.08,size=.07,alpha=.42,wave=.12,reverse=false,trail=2,seed=1}={}){
  const w=a.right-a.left,h=a.bottom-a.top,unit=Math.min(w,h);
  for(let i=0;i<count;i++){
    const velocity=speed*(.7+rnd(i+seed,2)*.65),phase=(rnd(i+seed,3)+t*velocity)%1,p=reverse?1-phase:phase;
    const x=a.left+w*(-.08+p*1.16),baseY=a.top+h*(.12+.76*rnd(i+seed,4));
    const y=baseY+Math.sin(p*TAU*(1.2+rnd(i,5))+i+t*.45)*h*wave;
    const s=unit*size*(.7+rnd(i+seed,6)*.75),rot=Math.atan2(Math.cos(p*TAU*1.4+i)*h*wave,w)+t*.12*(i%2?1:-1);
    for(let k=trail;k>=0;k--){
      const lag=k*.018*(reverse?-1:1),tx=x-w*lag,ta=alpha*(1-k/(trail+1))*.55;
      v11DrawArt(ctx,id,indices[i%indices.length],tx,y,s*(1-k*.08),k?ta:alpha,rot);
    }
  }
}
function v11ArtOrbit(ctx,a,id,t,{count=8,indices=[1,2],cx=.5,cy=.5,rx=.3,ry=.28,size=.1,alpha=.5,speed=.25,seed=1}={}){
  const w=a.right-a.left,h=a.bottom-a.top,unit=Math.min(w,h);
  for(let i=0;i<count;i++){
    const angle=t*speed+(i/count)*TAU+rnd(i+seed,1)*.35;
    const x=a.left+w*(cx+Math.cos(angle)*rx),y=a.top+h*(cy+Math.sin(angle)*ry);
    v11DrawArt(ctx,id,indices[i%indices.length],x,y,unit*size*(.8+rnd(i,3)*.45),alpha,angle+Math.PI/2);
  }
}
function v11LayeredAmbient(ctx,a,id,t,{anchors=[1,2],stream=[3,4],orbit=[5,6],accent=[7,8],speed=.04,alpha=.42,wave=.1,seed=1,mythic=false}={}){
  const w=a.right-a.left,h=a.bottom-a.top,unit=Math.min(w,h);
  const breathe=.94+.06*Math.sin(t*(mythic?.75:.42)+seed);
  v11DrawArt(ctx,id,anchors[0],a.left+w*.11,a.top+h*(.2+.025*Math.sin(t*.38+seed)),unit*(mythic?.42:.32)*breathe,alpha,-.08+.025*Math.sin(t*.22));
  v11DrawArt(ctx,id,anchors[1],a.right-w*.1,a.bottom-h*(.17+.025*Math.cos(t*.34+seed)),unit*(mythic?.4:.3)*breathe,alpha,.08-.025*Math.sin(t*.2));
  v11ArtStream(ctx,a,id,t,{count:mythic?18:11,indices:stream,speed,size:mythic?.065:.052,alpha:alpha*.9,wave,trail:mythic?2:1,seed});
  v11ArtOrbit(ctx,a,id,t,{count:mythic?9:5,indices:orbit,cx:.78,cy:.3,rx:.14,ry:.2,size:mythic?.06:.047,alpha:alpha*.82,speed:mythic?.34:.16,seed:seed+17});
  for(let i=0;i<(mythic?5:3);i++){
    const x=a.left+w*(.16+i*(mythic?.17:.29)),y=a.top+h*(.18+.62*rnd(i+seed,8));
    v11DrawArt(ctx,id,accent[i%accent.length],x,y,unit*(mythic?.085:.065),alpha*(.52+.18*Math.sin(t*(mythic?.8:.45)+i)),t*(mythic?.09:.035)*(i%2?1:-1));
  }
}
const V11_AMBIENT_RENDERERS = Object.freeze({
  ae11_u_champion_stadium(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top;
    const sway=Math.sin(t*.34)*h*.018;
    v11DrawArt(ctx,'ae11_u_champion_stadium',1,a.left+w*.1,a.top+h*.1+sway,h*.38,.48,-.28+Math.sin(t*.22)*.025);
    v11DrawArt(ctx,'ae11_u_champion_stadium',2,a.right-w*.1,a.top+h*.1-sway,h*.38,.48,.28-Math.sin(t*.22)*.025);
    v11DrawArt(ctx,'ae11_u_champion_stadium',3,a.left+w*.17,a.bottom-h*.06,h*.34,.3,0,'source-over');
    v11DrawArt(ctx,'ae11_u_champion_stadium',4,a.right-w*.12,a.top+h*.2,h*.18,.52,0);
    for(const side of [0,1]){const x=a.left+w*(side?.88:.12),g=ctx.createLinearGradient(x,a.top,x+(side?-1:1)*w*.18,a.top+h*.58);g.addColorStop(0,'rgba(255,224,132,.2)');g.addColorStop(1,'rgba(255,224,132,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,a.top);ctx.lineTo(x+(side?-1:1)*w*.2,a.top+h*.65);ctx.lineTo(x+(side?-1:1)*w*.05,a.top+h*.65);ctx.closePath();ctx.fill();}
    for(let i=0;i<18;i++){const p=(rnd(i,1)+t*(.008+rnd(i,7)*.006))%1;v11Particle(ctx,a.left+rnd(i,2)*w,a.top+h*(.96-p*.24),1+rnd(i,3)*1.6,'#e7c56b',.11+.07*Math.sin(t*.5+i));}
  },
  ae11_u_ink_battlefield(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top;
    const drift=Math.sin(t*.24)*w*.012;
    v11DrawArt(ctx,'ae11_u_ink_battlefield',1,a.left+w*.08+drift,a.top+h*.18,h*.5,.34,-.2+Math.sin(t*.18)*.018,'source-over');
    v11DrawArt(ctx,'ae11_u_ink_battlefield',2,a.right-w*.08-drift,a.bottom-h*.16,h*.5,.34,.2-Math.sin(t*.18)*.018,'source-over');
    v11DrawArt(ctx,'ae11_u_ink_battlefield',3,a.left+w*.12,a.top+h*.55,h*.3,.3,-.08,'source-over');
    v11DrawArt(ctx,'ae11_u_ink_battlefield',4,a.right-w*.15,a.top+h*.14,h*.2,.28,.1,'source-over');
    for(let i=0;i<7;i++)v11Ellipse(ctx,a.left+(i%2?rnd(i,2)*w*.24:w*(.76+rnd(i,2)*.24))+Math.sin(t*.16+i)*w*.01,a.top+rnd(i,3)*h+Math.cos(t*.14+i)*h*.018,w*(.05+rnd(i,4)*.07),h*(.07+rnd(i,5)*.12),'#10151a',.25+.04*Math.sin(t*.2+i),18);
    ctx.save();ctx.strokeStyle='rgba(178,192,190,.13)';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(a.left,a.top+h*(.16+i*.23));ctx.bezierCurveTo(a.left+w*.18,a.top+h*(.05+i*.25),a.left+w*.2,a.top+h*(.35+i*.13),a.left+w*.36,a.top+h*(.24+i*.18));ctx.stroke();}ctx.restore();
  },
  ae11_r_eight_formation(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top,pulse=.82+.18*Math.sin(t*.32);
    v11ArtStream(ctx,a,'ae11_r_eight_formation',t,{count:11,indices:[1,2],speed:.018,size:.055,alpha:.42,wave:.09,trail:1,seed:31});
    v11DrawArt(ctx,'ae11_r_eight_formation',3,a.left+w*.2,a.top+h*.72,h*.34,.3,t*.018);
    v11DrawArt(ctx,'ae11_r_eight_formation',4,a.right-w*.16,a.top+h*.24,h*.3,.28,-t*.015);
    v11DrawArt(ctx,'ae11_r_eight_formation',5,a.left+w*.18,a.top+h*.74,Math.min(w,h)*.31,.2*pulse,t*.025);
    v11DrawArt(ctx,'ae11_r_eight_formation',6,a.left+w*.83,a.top+h*.24,Math.min(w,h)*.25,.18*pulse,-t*.022);
    for(let i=0;i<16;i++){const p=(rnd(i,2)+t*.008)%1,x=a.left+p*w,y=a.top+h*(.12+.76*rnd(i,3));v11Particle(ctx,x,y,2.2,'#dffbf5',.18,'petal',rnd(i,4)*TAU);}
  },
  ae11_r_red_cliff(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top,breath=.8+.2*Math.sin(t*.45);
    v11ArtStream(ctx,a,'ae11_r_red_cliff',t,{count:10,indices:[1,2],speed:.022,size:.065,alpha:.42,wave:.045,trail:1,seed:47});
    v11DrawArt(ctx,'ae11_r_red_cliff',3,a.left+w*.12,a.bottom-h*.12,h*.36,.34,0);
    v11DrawArt(ctx,'ae11_r_red_cliff',4,a.right-w*.11,a.bottom-h*.11,h*.34,.36,0);
    const g=ctx.createLinearGradient(0,a.bottom-h*.35,0,a.bottom);g.addColorStop(0,'rgba(255,70,25,0)');g.addColorStop(1,`rgba(185,36,8,${.2*breath})`);ctx.fillStyle=g;ctx.fillRect(a.left,a.bottom-h*.35,w,h*.35);
    for(let i=0;i<22;i++){const p=(rnd(i,1)+t*.012*(.4+rnd(i,2)))%1,x=a.left+rnd(i,3)*w,y=a.bottom-p*h*.48;v11Particle(ctx,x,y,1.2+rnd(i,4)*2,'#ffad45',.18+.2*(1-p));}
  },
  ae11_e_storm_dimension(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top;
    v11DrawArt(ctx,'ae11_e_storm_dimension',3,a.right-w*.14,a.top+h*.25,h*.52,.45,t*.09);
    v11ArtOrbit(ctx,a,'ae11_e_storm_dimension',t,{count:7,indices:[4,7,8],cx:.78,cy:.28,rx:.16,ry:.21,size:.055,alpha:.38,speed:.42,seed:63});
    for(let i=0;i<34;i++){const p=(rnd(i,1)+t*(.18+rnd(i,2)*.13))%1,x=a.left+((rnd(i,3)+p*.18)%1)*w,y=a.top+p*h;ctx.strokeStyle=withAlpha('#9bd7ff',.1+.18*rnd(i,4));ctx.lineWidth=.7+rnd(i,5);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-w*.025,y+h*.09);ctx.stroke();}
    const cycle=t%7.2,flash=cycle>5.55&&cycle<5.78?1-Math.abs(cycle-5.665)/.115:0;if(flash>0){ctx.fillStyle=withAlpha('#b9e6ff',flash*.14);ctx.fillRect(a.left,a.top,w,h);v11DrawArt(ctx,'ae11_e_storm_dimension',cycle<5.665?1:2,a.left+w*.62,a.top+h*.38,h*.92,.72*flash,-.08);v11Bolt(ctx,a.left+w*.73,a.top,a.left+w*.56,a.top+h*.75,'#e8f7ff',.82*flash,17,2.2);v11Bolt(ctx,a.left+w*.73,a.top+h*.02,a.left+w*.86,a.top+h*.42,'#79bfff',.55*flash,29,1.2);}
    v11DrawArt(ctx,'ae11_e_storm_dimension',5,a.left+w*.78,a.top+h*.32,Math.min(w,h)*.32,.2,t*.12);
  },
  ae11_e_crimson_chaos(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top;
    v11DrawArt(ctx,'ae11_e_crimson_chaos',3,a.left+w*.8,a.top+h*.28,h*.48,.42,t*.13);
    v11ArtStream(ctx,a,'ae11_e_crimson_chaos',t,{count:13,indices:[1,2,4,7],speed:.075,size:.065,alpha:.46,wave:.16,trail:2,seed:79});
    v11DrawArt(ctx,'ae11_e_crimson_chaos',5,a.left+w*.82,a.top+h*.28,Math.min(w,h)*.36,.24,t*.11);
    for(let i=0;i<18;i++){const p=(rnd(i,1)+t*(.025+rnd(i,2)*.04))%1,x=a.left+w*(.08+.84*rnd(i,3)),y=a.top+h*((rnd(i,4)+p*.25)%1);v11Particle(ctx,x,y,3+rnd(i,5)*4,i%2?'#ff4d88':'#b46cff',.24,'shard',t*.2+i);}
  },
  ae11_m_frozen_crown(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top;
    v11DrawArt(ctx,'ae11_m_frozen_crown',4,a.left+w*.5,a.bottom-h*.08,h*.55,.44,Math.sin(t*.2)*.025);
    v11DrawArt(ctx,'ae11_m_frozen_crown',1,a.left+w*.08,a.bottom-h*.08,h*.48,.38,-.05);
    v11DrawArt(ctx,'ae11_m_frozen_crown',2,a.right-w*.08,a.bottom-h*.08,h*.48,.38,.05);
    v11ArtStream(ctx,a,'ae11_m_frozen_crown',t,{count:17,indices:[3,5,6,7,8],speed:.085,size:.045,alpha:.46,wave:.19,trail:2,seed:97});
    for(let depth=0;depth<3;depth++)for(let i=0;i<(depth+1)*18;i++){const speed=.05+depth*.055+rnd(i,2)*.04,p=(rnd(i+depth*73,1)+t*speed)%1,x=a.left+((rnd(i+depth*41,3)+p*.34)%1)*w,y=a.top+p*h,size=1+depth*1.15+rnd(i,4)*2;v11Particle(ctx,x,y,size,depth===2?'#ffffff':'#9de8ff',.16+depth*.1,'shard',t*.4+i);}
    for(let i=0;i<3;i++){const y=a.top+h*(.3+i*.24+Math.sin(t*.24+i)*.035);const g=ctx.createLinearGradient(a.left,y,a.right,y);g.addColorStop(0,'rgba(87,210,255,0)');g.addColorStop(.35,'rgba(87,210,255,.12)');g.addColorStop(.7,'rgba(190,245,255,.08)');g.addColorStop(1,'rgba(87,210,255,0)');ctx.fillStyle=g;ctx.fillRect(a.left,y,a.right-a.left,h*.09);}
    v11DrawArt(ctx,'ae11_m_frozen_crown',8,a.left+w*.5,a.top+h*.73,Math.min(w,h)*.42,.28,t*.075);
    for(let i=0;i<5;i++)v11Ellipse(ctx,a.left+w*(.08+i*.21),a.top+h*(.18+.1*Math.sin(t*.7+i)),3,7,'#69e7ff',.42,12);
  },
  ae11_m_black_sanctuary(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top,cycle=t%8,open=.55+.45*Math.sin(Math.min(1,cycle/2.2)*Math.PI);
    v11DrawArt(ctx,'ae11_m_black_sanctuary',3,a.right-w*.16,a.top+h*.42,h*.62,.52,t*.12);
    v11ArtOrbit(ctx,a,'ae11_m_black_sanctuary',t,{count:9,indices:[1,2,4,6,7,8],cx:.82,cy:.42,rx:.16,ry:.29,size:.065,alpha:.46,speed:.36,seed:113});
    v11ArtStream(ctx,a,'ae11_m_black_sanctuary',t,{count:14,indices:[1,2,4,5],speed:.1,size:.05,alpha:.38,wave:.2,reverse:true,trail:2,seed:127});
    ctx.save();ctx.translate(a.left+w*.82,a.top+h*.43);ctx.scale(open,1);ctx.translate(-a.left-w*.82,-a.top-h*.43);v11DrawArt(ctx,'ae11_m_black_sanctuary',8,a.left+w*.82,a.top+h*.43,Math.min(w,h)*.42,.42,t*.18);ctx.restore();
    for(let i=0;i<20;i++){const p=(rnd(i,1)+t*(.06+rnd(i,2)*.08))%1,x=a.left+w*((rnd(i,3)+p*.5)%1),y=a.top+h*(1-p);v11Particle(ctx,x,y,2+rnd(i,4)*4,i%3?'#8cff5b':'#b05cff',.26,'shard',-t*.5+i);}
    const meteor=(t*.17)%1;if(meteor>.72){const q=(meteor-.72)/.28,x=a.left+w*(.15+q*.62),y=a.top+h*(q*.7);v11Bolt(ctx,x-w*.14,y-h*.18,x,y,'#c0ff72',(1-q)*.65,44,2);}
  },
  ae11_u_navy_bear_victory(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_u_navy_bear_victory',t,{anchors:[1,4],stream:[2,3,6],orbit:[7,8],accent:[5,7],speed:.018,alpha:.38,wave:.045,seed:151});
  },
  ae11_u_twin_night_game(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_u_twin_night_game',t,{anchors:[1,2],stream:[3,7],orbit:[4,8],accent:[5,6],speed:.02,alpha:.37,wave:.055,seed:163});
  },
  ae11_u_tiger_homerun(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_u_tiger_homerun',t,{anchors:[1,3],stream:[2,6,7],orbit:[4,8],accent:[5,4],speed:.022,alpha:.4,wave:.06,seed:179});
  },
  ae11_r_crescent_dragon(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_r_crescent_dragon',t,{anchors:[1,2],stream:[3,4,7],orbit:[5,8],accent:[6,5],speed:.03,alpha:.42,wave:.075,seed:191});
  },
  ae11_r_imperial_jade_seal(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_r_imperial_jade_seal',t,{anchors:[1,6],stream:[3,5],orbit:[4,8],accent:[2,7],speed:.028,alpha:.41,wave:.065,seed:211});
  },
  ae11_r_moon_archive(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_r_moon_archive',t,{anchors:[1,4],stream:[3,7,8],orbit:[2,6],accent:[5,8],speed:.032,alpha:.4,wave:.09,seed:227});
  },
  ae11_e_starforged_reactor(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_e_starforged_reactor',t,{anchors:[1,2],stream:[3,4,6],orbit:[7,8],accent:[5,6],speed:.075,alpha:.48,wave:.12,seed:241});
  },
  ae11_e_spider_rift(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_e_spider_rift',t,{anchors:[2,7],stream:[1,3,5],orbit:[4,8],accent:[6,8],speed:.082,alpha:.5,wave:.15,seed:257});
  },
  ae11_e_vibranium_guard(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_e_vibranium_guard',t,{anchors:[1,5],stream:[2,6,8],orbit:[3,7],accent:[4,7],speed:.072,alpha:.48,wave:.12,seed:271});
  },
  ae11_m_banshee_dirge(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_m_banshee_dirge',t,{anchors:[1,7],stream:[2,3,6],orbit:[4,8],accent:[5,8],speed:.11,alpha:.56,wave:.19,seed:283,mythic:true});
  },
  ae11_m_iron_warchief(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_m_iron_warchief',t,{anchors:[1,6],stream:[2,3,5],orbit:[4,7],accent:[8,5],speed:.12,alpha:.57,wave:.17,seed:307,mythic:true});
  },
  ae11_m_raven_arcane(ctx,a,t){
    v11LayeredAmbient(ctx,a,'ae11_m_raven_arcane',t,{anchors:[1,3],stream:[2,4,6],orbit:[5,7],accent:[8,6],speed:.115,alpha:.56,wave:.2,seed:331,mythic:true});
  },
  ae12_m_tidal_archmage_blizzard(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top,unit=Math.min(w,h),gust=(Math.sin(t*.42)+1)*.5;
    for(let band=0;band<4;band++){
      const y=a.top+h*(.14+band*.22+.035*Math.sin(t*.55+band));
      ctx.save();ctx.strokeStyle=withAlpha(band%2?'#bfefff':'#65cbe8',.1+gust*.08);ctx.lineWidth=2+band*.55;ctx.shadowColor='#65dfff';ctx.shadowBlur=8;
      ctx.beginPath();ctx.moveTo(a.left-w*.04,y);ctx.bezierCurveTo(a.left+w*.22,y-h*.16,a.left+w*.58,y+h*.13,a.right+w*.04,y-h*.08);ctx.stroke();ctx.restore();
    }
    for(let depth=0;depth<3;depth++)for(let i=0;i<18+depth*12;i++){
      const speed=.045+depth*.035+rnd(i+depth*71,2)*.035,p=(rnd(i+depth*97,1)+t*speed)%1;
      const x=a.left+w*((rnd(i+depth*31,3)+p*(.32+.13*depth))%1),y=a.top+h*p+Math.sin(t*.7+i)*h*.025;
      const size=2.2+depth*1.35+rnd(i,4)*3.2,alpha=.16+depth*.1;
      if((i+depth)%3===0)v11Snowflake(ctx,x,y,size*1.35,depth===2?'#ffffff':'#9be9ff',alpha,t*(i%2?.28:-.22)+i);
      else v11Particle(ctx,x,y,size,depth===2?'#effdff':'#7adbf5',alpha,'shard',t*.35+i);
    }
    const cx=a.left+w*(.72+.04*Math.sin(t*.23)),cy=a.top+h*(.34+.04*Math.cos(t*.29));
    ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.12);for(let ring=0;ring<3;ring++){ctx.strokeStyle=withAlpha(ring===1?'#ffffff':'#69d9ff',.12+ring*.05);ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(0,0,unit*(.12+ring*.055),ring*.6,TAU-ring*.35);ctx.stroke();}ctx.restore();
    for(let i=0;i<6;i++){const angle=t*.18+i*TAU/6,r=unit*(.13+(i%2)*.08);v11Snowflake(ctx,cx+Math.cos(angle)*r,cy+Math.sin(angle)*r,4.8+(i%3)*1.7,'#e7fbff',.5,-angle+t*.2);}
    const fog=ctx.createLinearGradient(0,a.bottom-h*.34,0,a.bottom);fog.addColorStop(0,'rgba(95,211,242,0)');fog.addColorStop(1,'rgba(88,190,225,.18)');ctx.fillStyle=fog;ctx.fillRect(a.left,a.bottom-h*.34,w,h*.34);
  },
  ae13_m_azshara_maelstrom(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top,u=Math.min(w,h),cx=a.left+w*.72,cy=a.top+h*.42;
    ctx.save();ctx.translate(cx,cy);for(let ring=0;ring<4;ring++){ctx.rotate((ring%2?-.16:.11)*t);ctx.strokeStyle=withAlpha(ring%2?'#6bf5e6':'#d5b06a',.13+ring*.035);ctx.lineWidth=1.2+ring*.5;ctx.beginPath();ctx.ellipse(0,0,u*(.1+ring*.055),u*(.045+ring*.028),ring*.4,0,TAU);ctx.stroke();}ctx.restore();
    for(let depth=0;depth<3;depth++)for(let i=0;i<12+depth*8;i++){const p=(rnd(i+depth*31,1)+t*(.025+depth*.018))%1,ang=p*TAU*(1.4+depth*.25)+rnd(i,2)*TAU,r=u*(.08+p*(.25+depth*.035)),x=cx+Math.cos(ang)*r,y=cy+Math.sin(ang)*r*.52;
      v11Particle(ctx,x,y,1.8+depth*1.25,i%4?'#6ff3e5':'#ffd58a',.18+depth*.085,i%3?'orb':'shard',ang);}
    for(let i=0;i<11;i++){const p=(rnd(i,1)+t*(.02+rnd(i,2)*.018))%1,x=a.left+w*(.04+.92*rnd(i,3)),y=a.bottom-p*h*.86;v11Ellipse(ctx,x,y,2+rnd(i,4)*3,2+rnd(i,4)*3,'#bafff5',.18+(1-p)*.2,7);}
    ctx.save();ctx.strokeStyle=withAlpha('#55dbc9',.18);ctx.lineWidth=4;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(a.left-w*.04,a.top+h*(.2+i*.29));ctx.bezierCurveTo(a.left+w*.22,a.top+h*(.02+i*.3),a.left+w*.66,a.top+h*(.42+i*.08),a.right+w*.04,a.top+h*(.15+i*.28));ctx.stroke();}ctx.restore();
  },
  ae13_m_sunwell_phoenix(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top,u=Math.min(w,h),pulse=.82+.18*Math.sin(t*.72);
    for(let i=0;i<34;i++){const p=(rnd(i,1)+t*(.045+rnd(i,2)*.05))%1,x=a.left+w*((rnd(i,3)+p*.35)%1),y=a.bottom-p*h,size=2+rnd(i,4)*5;v11Particle(ctx,x,y,size,i%5===0?'#62e58b':i%2?'#ffbd4f':'#ff6331',.18+.18*(1-p),'petal',-t*.45+i);}
    ctx.save();ctx.translate(a.left+w*.78,a.top+h*.38);ctx.rotate(Math.sin(t*.35)*.08);ctx.strokeStyle=withAlpha('#ff9d35',.28*pulse);ctx.lineWidth=5;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(0,u*.1);ctx.bezierCurveTo(side*u*.09,-u*.02,side*u*.18,-u*.16,side*u*.28,-u*.1);ctx.stroke();}ctx.restore();
    for(let i=0;i<5;i++){const angle=t*.28+i*TAU/5,r=u*(.11+i*.018),x=a.left+w*.78+Math.cos(angle)*r,y=a.top+h*.38+Math.sin(angle)*r*.55;v11Particle(ctx,x,y,5,'#5ee58b',.4,'shard',angle);}
    const g=ctx.createRadialGradient(a.left+w*.78,a.top+h*.4,0,a.left+w*.78,a.top+h*.4,u*.36);g.addColorStop(0,withAlpha('#ff9a32',.16*pulse));g.addColorStop(1,'rgba(255,100,30,0)');ctx.fillStyle=g;ctx.fillRect(a.left,a.top,w,h);
  },
  ae13_e_star_shield_salute(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top,u=Math.min(w,h);
    for(let i=0;i<18;i++){const p=(rnd(i,1)+t*(.04+rnd(i,2)*.035))%1,x=a.left+w*((rnd(i,3)+p*.22)%1),y=a.top+h*(.08+.84*rnd(i,4));v11Particle(ctx,x,y,2.2+rnd(i,5)*2.7,i%3===0?'#b94c59':i%3===1?'#eef3f8':'#7aa4d4',.2,'shard',t*.25+i);}
    const cx=a.left+w*.78,cy=a.top+h*.32,phase=(t*.18)%1;for(let ring=0;ring<3;ring++){const r=u*((phase+ring*.24)%1)*.32,alpha=(1-((phase+ring*.24)%1))*.22;ctx.strokeStyle=withAlpha(ring===1?'#b94c59':'#d8e7f5',alpha);ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();}
    for(let i=0;i<6;i++){const angle=t*.22+i*TAU/6,r=u*.18;ctx.save();ctx.translate(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r*.62);ctx.rotate(angle);ctx.fillStyle=withAlpha('#edf4ff',.38);ctx.beginPath();for(let k=0;k<10;k++){const rr=k%2?1.8:4.2,aa=-Math.PI/2+k*Math.PI/5;ctx.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr);}ctx.closePath();ctx.fill();ctx.restore();}
  },
  ae13_u_softbear_cheer(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top;
    for(let i=0;i<20;i++){const p=(rnd(i,1)+t*(.014+rnd(i,2)*.012))%1,x=a.left+w*((rnd(i,3)+Math.sin(t*.35+i)*.025)%1),y=a.top+p*h;v11Particle(ctx,x,y,2.4+rnd(i,4)*2.6,i%3?'#f2dfb8':'#1f2d55',.18,'petal',t*.2+i);}
    for(let i=0;i<5;i++){const x=a.left+w*(.08+i*.21),y=a.top+h*(.14+.68*rnd(i,3));ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*.25+i)*.12);ctx.strokeStyle=withAlpha('#f4dfb7',.23);ctx.lineWidth=1.3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(0,0,8,0,TAU);ctx.stroke();ctx.restore();}
  },
  ae13_u_loopy_party(ctx,a,t){
    const w=a.right-a.left,h=a.bottom-a.top;
    for(let i=0;i<23;i++){const p=(rnd(i,1)+t*(.02+rnd(i,2)*.02))%1,x=a.left+w*((rnd(i,3)+Math.sin(t*.55+i)*.035)%1),y=a.bottom-p*h,size=2+rnd(i,4)*3;v11Particle(ctx,x,y,size,i%4===0?'#f5f5f5':i%3===0?'#c82e48':'#f18bb5',.22,i%2?'petal':'shard',t*.35+i);}
    for(let i=0;i<5;i++){const x=a.left+w*(.12+i*.19),y=a.top+h*(.2+.55*rnd(i,2)),hop=Math.abs(Math.sin(t*.8+i))*h*.035;ctx.fillStyle=withAlpha('#fff5ea',.28);ctx.beginPath();ctx.roundRect(x-4,y-hop-3,3.2,6,1);ctx.roundRect(x+.8,y-hop-3,3.2,6,1);ctx.fill();}
  },
});
function drawV11Ambient(ctx, area, id, T, small) {
  const renderer=V11_AMBIENT_RENDERERS[id];if(!renderer)return;
  const time=reduceMotion()?0:T/1000;
  ctx.save();ctx.globalAlpha=small?.7:1;renderer(ctx,area,time,small);v11ProtectCenter(ctx,area);ctx.restore();
}
function loop(ts) {
  rafId = requestAnimationFrame(loop);
  const budget = liveCharts.size >= 4 ? 42 : liveCharts.size >= 2 ? 30 : 20;
  if (ts - lastTick < budget) return;
  lastTick = ts;
  if (document.hidden) return;
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
  beforeDatasetsDraw(chart, _a, opts) {
    const cfg=opts||chart.options?.plugins?.showroomFx||{};
    if(!V11_AMBIENT_IDS.has(cfg.ambientFx))return;
    const area=chart.chartArea;
    if(!area||area.right<=area.left)return;
    const ctx=chart.ctx,T=reduceMotion()?0:performance.now();
    ctx.save();
    ctx.globalCompositeOperation='source-over';
    ctx.beginPath();ctx.rect(area.left,area.top,area.right-area.left,area.bottom-area.top);ctx.clip();
    drawV11Ambient(ctx,area,cfg.ambientFx,T,!!cfg.gridCell);
    ctx.restore();
  },
  afterDatasetsDraw(chart, _a, opts) {
    const cfg = opts || chart.options?.plugins?.showroomFx || {};
    const lineSpec = V11_LINE_FX[cfg.lineFx] || LINE_FX[cfg.lineFx], ambSpec = AMB_FX[cfg.ambientFx];
    const hasV11Ambient=V11_AMBIENT_IDS.has(cfg.ambientFx);
    if (!lineSpec && !ambSpec && !hasV11Ambient) { liveCharts.delete(chart); return; }
    const ctx = chart.ctx, area = chart.chartArea;
    if (!area || area.right <= area.left) return;
    const T = reduceMotion() ? 0 : performance.now();
    const small = !!cfg.gridCell;

    // 공간효과 — 데이터 뒤에 그린다
    if (ambSpec && !V11_AMBIENT_IDS.has(cfg.ambientFx)) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath(); ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top); ctx.clip();
      if(V11_AMBIENT_IDS.has(cfg.ambientFx)){
        drawV11Ambient(ctx,area,cfg.ambientFx,T,small);
      }else{
        const layers = small ? ambSpec.layers.slice(0, 2) : ambSpec.layers;
        for (const L of layers) {
          const fn = AMB_LAYER[L.k]; if (!fn) continue;
          const scaled = small && L.count ? { ...L, count: Math.max(3, Math.round(L.count * .5)) } : L;
          try { fn(ctx, area, scaled, T); } catch {}
        }
      }
      ctx.restore();
    }

    // 선 이펙트
    if (lineSpec) {
      const idx = chart.data.datasets.findIndex(d => d.label === '실제 체중');
      const meta = idx >= 0 ? chart.getDatasetMeta(idx) : null;
      const pts = polyline(meta);
      if (pts.length > 1) {
        const acc = cumulative(pts);
        const base = { color: chart.data.datasets[idx]?.borderColor || '#00e5aa',
                       width: chart.data.datasets[idx]?.borderWidth || 2.2 };
        ctx.save();
        ctx.beginPath();
        ctx.rect(area.left - 6, area.top - 6, area.right - area.left + 12, area.bottom - area.top + 12);
        ctx.clip();
        const customRenderer = lineSpec.renderer && V11_LINE_RENDERERS[lineSpec.renderer];
        if (customRenderer) {
          try { customRenderer(ctx, pts, acc, T, base); } catch {}
        }
        const layers = small ? lineSpec.layers.slice(0, 3) : lineSpec.layers;
        for (const L of layers) {
          const fn = LINE_LAYER[L.k]; if (!fn) continue;
          const scaled = small && L.count ? { ...L, count: Math.max(2, Math.round(L.count * .5)) } : L;
          try { fn(ctx, pts, acc, scaled, T, base); } catch {}
        }
        ctx.restore();
      }
    }

    if (!reduceMotion()) { liveCharts.add(chart); ensureLoop(); }
  },
  afterDestroy(chart) { liveCharts.delete(chart); },
};

export const LINE_FX_IDS = Object.freeze([...Object.keys(LINE_FX),...Object.keys(V11_LINE_FX)]);
export const AMBIENT_FX_IDS = Object.freeze([...Object.keys(AMB_FX),...V11_AMBIENT_IDS]);

// ── 카탈로그 등록용 아이템 (code-native) ────────────────────────────────────
const mk = (category, id, name, rarity, visual, renderSpec) => Object.freeze({
  id, category, name, rarity, price: null, asset: null,
  visual, implKey: `${category}:${id}`,
  testOnly: true, purchasable: false, persistable: false,
  renderSpec: Object.freeze(renderSpec),
});

export const LINE_STYLE_ITEMS = Object.freeze([
  // 고급 6
  mk('line_style','ls_ink','먹선','uncommon','붓처럼 두께가 살아 움직이는 획',{fx:'ls_ink',width:2.2,tension:.15}),
  mk('line_style','ls_tape','라인테이프','uncommon','광택 없는 굵고 각진 띠',{fx:'ls_tape',width:2.4,tension:.05}),
  mk('line_style','ls_candle','촛불선','uncommon','끝에서 실제로 흔들리는 불꽃',{fx:'ls_candle',width:2.2,tension:.2}),
  mk('line_style','ls_thread','떨림 실선','uncommon','가늘게 진동하는 실 같은 선',{fx:'ls_thread',width:2,tension:.2}),
  mk('line_style','ls_ringchain','고리 사슬','uncommon','작은 고리가 선을 따라 이어짐',{fx:'ls_ringchain',width:2.2,tension:.18}),
  mk('line_style','ls_beat','비트 파선','uncommon','짧은 대시가 규칙적으로 내달림',{fx:'ls_beat',width:2.3,tension:.12}),
  mk('line_style','ls_frostbite','서리 맺힘','uncommon','선 위에 작은 서리 결정이 돋음',{fx:'ls_frostbite',width:2.2,tension:.18}),
  mk('line_style','ls_soulthread','혼선(魂線)','uncommon','청록 혼불빛이 일렁이는 실',{fx:'ls_soulthread',width:2.2,tension:.2}),
  // 희귀 9
  mk('line_style','ls_vein','흐르는 광맥','rare','밝은 광점이 선을 빠르게 주파',{fx:'ls_vein',width:2.4,tension:.2}),
  mk('line_style','ls_psi','사이오닉 선','rare','양옆 평행선과 결정 가시',{fx:'ls_psi',width:2.3,tension:.18}),
  mk('line_style','ls_netthread','골망 실','rare','두 가닥이 꼬이며 직조',{fx:'ls_netthread',width:2.2,tension:.22}),
  mk('line_style','ls_scale','비늘 선','rare','반달 비늘이 선을 덮고 반짝임',{fx:'ls_scale',width:2.3,tension:.2}),
  mk('line_style','ls_race','삼색 레이스','rare','세 대시가 다른 속도로 경주',{fx:'ls_race',width:2.3,tension:.18}),
  mk('line_style','ls_ripplewave','물결 파동','rare','선 자체가 물결처럼 일렁임',{fx:'ls_ripplewave',width:2.3,tension:.2}),
  mk('line_style','ls_icecrown_rune','얼음왕관 룬각인','rare','룬이 점등되며 서리가 돋음',{fx:'ls_icecrown_rune',width:2.4,tension:.18}),
  mk('line_style','ls_sanzu','삼도천','rare','선 안으로 혼불 강물이 흐름',{fx:'ls_sanzu',width:2.4,tension:.2}),
  // 영웅 9
  mk('line_style','ls_heatline','화공 열선','epic','열대가 훑고 불티가 위로 솟음',{fx:'ls_heatline',width:2.6,tension:.18}),
  mk('line_style','ls_current','심장로 전류','epic','각진 번개가 선 위를 내달림',{fx:'ls_current',width:2.4,tension:.15}),
  mk('line_style','ls_afterimage','기억의 잔상','epic','어긋난 복제선 3겹의 잔상',{fx:'ls_afterimage',width:2.4,tension:.2}),
  mk('line_style','ls_aqua','유수 관로','epic','선 안쪽에 물이 차오르며 출렁임',{fx:'ls_aqua',width:2.6,tension:.2}),
  mk('line_style','ls_starfield','별의 강','epic','선 내부를 별이 흘러 지나감',{fx:'ls_starfield',width:2.6,tension:.2}),
  mk('line_style','ls_windborne','풍매','epic','바람 물리로 입자가 흩날림',{fx:'ls_windborne',width:2.4,tension:.2}),
  mk('line_style','ls_frostmourne','서릿날','epic','룬검의 냉기가 위로 피어오름',{fx:'ls_frostmourne',width:2.6,tension:.18}),
  mk('line_style','ls_hellgate','황천문','epic','핏빛 강물과 재가 솟구침',{fx:'ls_hellgate',width:2.6,tension:.2}),
  // 전설 9
  mk('line_style','ls_frost','서리 결정선','legendary','선 전체에서 결정 가시가 자람',{fx:'ls_frost',width:2.6,tension:.18}),
  mk('line_style','ls_gem_trail','여섯 보석 궤적','legendary','구간마다 색이 바뀌는 무지개 궤적',{fx:'ls_gem_trail',width:2.6,tension:.2}),
  mk('line_style','ls_spotlight','우승 스포트라이트','legendary','조명 띠가 선을 훑는 시상식',{fx:'ls_spotlight',width:2.8,tension:.2}),
  mk('line_style','ls_prism_bloom','프리즘 블룸','legendary','빛이 누적되며 폭발하는 무지개',{fx:'ls_prism_bloom',width:2.8,tension:.2}),
  mk('line_style','ls_dragon','용린 화염','legendary','비늘과 화염 물리가 함께 타오름',{fx:'ls_dragon',width:2.8,tension:.2}),
  mk('line_style','ls_cosmos','우주의 강','legendary','별·성운·궤도 입자가 한꺼번에',{fx:'ls_cosmos',width:2.8,tension:.2}),
  mk('line_style','ls_icecrown_throne','얼음왕관 옥좌','legendary','룬·결정·냉기 폭풍이 총동원',{fx:'ls_icecrown_throne',width:2.8,tension:.18}),
  mk('line_style','ls_yomotsu','황천비도','legendary','혼불과 핏빛 룬이 뒤섞인 저승길',{fx:'ls_yomotsu',width:2.8,tension:.2}),
]);

export const AMBIENT_EFFECT_ITEMS = Object.freeze([
  // 고급 6
  mk('ambient_effect','ae_dust','경기장 먼지','uncommon','흙먼지가 느리게 부유',{fx:'ae_dust'}),
  mk('ambient_effect','ae_ink_mote','먹 티끌','uncommon','먹 조각이 회전하며 낙하',{fx:'ae_ink_mote'}),
  mk('ambient_effect','ae_firefly','마법 반딧불','uncommon','밝은 반딧불이 떠다님',{fx:'ae_firefly'}),
  mk('ambient_effect','ae_snowlight','가랑눈','uncommon','작은 눈송이가 조용히 내림',{fx:'ae_snowlight'}),
  mk('ambient_effect','ae_petal','꽃잎 흩날림','uncommon','분홍 꽃잎이 회전하며 떨어짐',{fx:'ae_petal'}),
  mk('ambient_effect','ae_bokeh','빛망울','uncommon','초점 나간 빛망울이 떠다님',{fx:'ae_bokeh'}),
  mk('ambient_effect','ae_frostair','서릿바람','uncommon','얼음 결정이 흩날림',{fx:'ae_frostair'}),
  mk('ambient_effect','ae_soulmote','혼불','uncommon','청록 혼불이 조용히 떠오름',{fx:'ae_soulmote'}),
  mk('ambient_effect','ae_sakura_light','벚꽃','uncommon','연분홍 꽃잎이 내려앉음',{fx:'ae_sakura_light'}),
  // 희귀 9
  mk('ambient_effect','ae_spore','포자 유동','rare','포자가 기둥처럼 솟아오름',{fx:'ae_spore'}),
  mk('ambient_effect','ae_feather','부엉이 깃털','rare','큰 깃털이 회전하며 떨어짐',{fx:'ae_feather'}),
  mk('ambient_effect','ae_grass','잔디 바람','rare','하단 잔디가 바람에 눕는다',{fx:'ae_grass'}),
  mk('ambient_effect','ae_rain','빗줄기','rare','사선 비가 촘촘히 내림',{fx:'ae_rain'}),
  mk('ambient_effect','ae_leaffall','낙엽','rare','가을 잎이 회전하며 떨어짐',{fx:'ae_leaffall'}),
  mk('ambient_effect','ae_bubble','기포','rare','물방울이 흔들리며 상승',{fx:'ae_bubble'}),
  mk('ambient_effect','ae_icefall','빙정 낙하','rare','얼음 파편이 회전하며 떨어짐',{fx:'ae_icefall'}),
  mk('ambient_effect','ae_ghostflame','귀화(鬼火)','rare','도깨비불이 흔들리며 떠오름',{fx:'ae_ghostflame'}),
  mk('ambient_effect','ae_petalstream','화류(花流)','rare','꽃잎이 소용돌이치며 흐름',{fx:'ae_petalstream'}),
  // 영웅 9
  mk('ambient_effect','ae_roar','함성 파동','epic','원형 파동이 밖으로 확산',{fx:'ae_roar'}),
  mk('ambient_effect','ae_firearrow','불화살비','epic','꼬리를 단 불화살이 쏟아짐',{fx:'ae_firearrow'}),
  mk('ambient_effect','ae_holo','홀로 격자','epic','격자와 스캔라인이 훑고 지나감',{fx:'ae_holo'}),
  mk('ambient_effect','ae_thunder','뇌우','epic','섬광이 번쩍이고 비가 몰아침',{fx:'ae_thunder'}),
  mk('ambient_effect','ae_smokestack','연무','epic','연기 기둥이 피어올라 흩어짐',{fx:'ae_smokestack'}),
  mk('ambient_effect','ae_swarm','군무','epic','무리가 함께 몰려다님',{fx:'ae_swarm'}),
  mk('ambient_effect','ae_icecrown','얼음왕관 서리폭풍','epic','빙정과 눈보라, 룬 마법진',{fx:'ae_icecrown'}),
  mk('ambient_effect','ae_sanzu','삼도천','epic','혼불과 안개, 피안화가 핀 강가',{fx:'ae_sanzu'}),
  mk('ambient_effect','ae_senbon','천본앵','epic','꽃잎이 소용돌이치며 번뜩임',{fx:'ae_senbon'}),
  // 전설 9
  mk('ambient_effect','ae_blizzard','서리폭풍','legendary','눈보라와 바람줄기가 몰아침',{fx:'ae_blizzard'}),
  mk('ambient_effect','ae_gem_nebula','보석 성운','legendary','거대한 색 덩어리가 유영',{fx:'ae_gem_nebula'}),
  mk('ambient_effect','ae_ceremony','우승 세리머니','legendary','색종이와 스포트라이트가 쏟아짐',{fx:'ae_ceremony'}),
  mk('ambient_effect','ae_galaxy','나선 은하','legendary','은하 팔이 천천히 회전',{fx:'ae_galaxy'}),
  mk('ambient_effect','ae_volcano','화산','legendary','분출과 연기, 불티가 뒤섞임',{fx:'ae_volcano'}),
  mk('ambient_effect','ae_finale','대미의 불꽃','legendary','폭죽이 연달아 터지는 피날레',{fx:'ae_finale'}),
  mk('ambient_effect','ae_lichking','얼음왕관 성채','legendary','폭설·빙정·룬진·성채 실루엣',{fx:'ae_lichking'}),
  mk('ambient_effect','ae_yomi','황천(黃泉)','legendary','피안화와 혼불이 뒤덮은 저승',{fx:'ae_yomi'}),
  mk('ambient_effect','ae_senbon_kageyoshi','천본앵 경신','legendary','이중 소용돌이 꽃잎 폭풍',{fx:'ae_senbon_kageyoshi'}),
]);
