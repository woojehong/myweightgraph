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
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t,
           nx: -(b.y - a.y) / (Math.hypot(b.x - a.x, b.y - a.y) || 1),
           ny:  (b.x - a.x) / (Math.hypot(b.x - a.x, b.y - a.y) || 1) };
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
  afterDatasetsDraw(chart, _a, opts) {
    const cfg = opts || chart.options?.plugins?.showroomFx || {};
    const lineSpec = LINE_FX[cfg.lineFx], ambSpec = AMB_FX[cfg.ambientFx];
    if (!lineSpec && !ambSpec) { liveCharts.delete(chart); return; }
    const ctx = chart.ctx, area = chart.chartArea;
    if (!area || area.right <= area.left) return;
    const T = reduceMotion() ? 0 : performance.now();
    const small = !!cfg.gridCell;

    // 공간효과 — 데이터 뒤에 그린다
    if (ambSpec) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath(); ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top); ctx.clip();
      const layers = small ? ambSpec.layers.slice(0, 2) : ambSpec.layers;
      for (const L of layers) {
        const fn = AMB_LAYER[L.k]; if (!fn) continue;
        const scaled = small && L.count ? { ...L, count: Math.max(3, Math.round(L.count * .5)) } : L;
        try { fn(ctx, area, scaled, T); } catch {}
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

export const LINE_FX_IDS = Object.freeze(Object.keys(LINE_FX));
export const AMBIENT_FX_IDS = Object.freeze(Object.keys(AMB_FX));

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
