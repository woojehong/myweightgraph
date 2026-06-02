// chart-render.js

export function renderChart(records, userProfile, canvasMain, canvasBar = null, options = {}) {
  const goal = userProfile?.goal ?? 80;
  const {
    show7dayMA        = true,
    showWeeklyBar     = true,
    showPrediction    = false,
    showDietGraph     = false,
    showExerciseGraph = false,
    annotOpacity      = 0.88,
    showMaxMarker     = true,
    showMinMarker     = true,
    showCurMarker     = true,
  } = options;

  if (canvasMain._chartInstance) canvasMain._chartInstance.destroy();
  if (canvasBar?._chartInstance) canvasBar._chartInstance.destroy();

  const pts = records
    .filter(r => r.weight != null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(r => ({ t: new Date(r.date).getTime(), date: new Date(r.date), w: r.weight }));
  if (!pts.length) return;

  const ws     = pts.map(p => p.w);
  const maxW   = Math.max(...ws), minW = Math.min(...ws), curW = pts[pts.length - 1].w;
  const yMin   = Math.floor(goal * 0.9), yMax = Math.ceil(maxW) + 3;
  const maxIdx = ws.indexOf(maxW);
  const minIndices = ws.reduce((a, w, i) => w === minW ? [...a, i] : a, []);

  const fmt      = d => `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  const isMobile = window.innerWidth < 768;
  const Y_AXIS_W = isMobile ? 42 : 52;

  // ── 7일 이동평균 ─────────────────────────────────────────────────────
  const ma7 = pts.map(p => {
    const sl = pts.filter(q => q.t >= p.t - 7*86400000 && q.t <= p.t);
    return { x: p.t, y: +(sl.reduce((s, q) => s + q.w, 0) / sl.length).toFixed(1) };
  });

  // ── 예상 그래프 ──────────────────────────────────────────────────────
  let predData = [];
  const recent = pts.filter(p => p.t >= pts[pts.length-1].t - 42*86400000);
  if (recent.length >= 2) {
    const loss = recent[0].w - recent[recent.length-1].w;
    const span = (recent[recent.length-1].t - recent[0].t) / 86400000;
    const rate = span > 0 ? loss / span : 0;
    const last = pts[pts.length - 1];
    predData.push({ x: last.t, y: last.w });
    for (let w = 1; w <= 8; w++)
      predData.push({ x: last.t + w*7*86400000, y: +(last.w - rate*w*7).toFixed(1) });
  }

  // ── 주간 막대 데이터 ─────────────────────────────────────────────────
  function getSun(d) {
    const dt = new Date(d); dt.setDate(dt.getDate() - dt.getDay()); dt.setHours(0,0,0,0); return dt.getTime();
  }
  function wkLabel(ts) {
    const d = new Date(ts), mo = d.getMonth() + 1;
    const fs = new Date(d.getFullYear(), d.getMonth(), 1); fs.setDate(fs.getDate() - fs.getDay());
    return `${String(d.getFullYear()).slice(2)}년 ${mo}월 ${Math.round((d - fs) / (7*86400000)) + 1}주`;
  }
  const byWeek = new Map();
  pts.forEach(p => { const wk = getSun(p.date); if (!byWeek.has(wk)) byWeek.set(wk, []); byWeek.get(wk).push(p); });
  const wkAvg = new Map();
  byWeek.forEach((wp, wk) => {
    if (wp.length < 4) return;
    wkAvg.set(wk, { avg: +(wp.reduce((s, p) => s + p.w, 0) / wp.length).toFixed(2), label: wkLabel(wk), x: Math.max(...wp.map(p => p.t)) });
  });
  const sortedWks = [...byWeek.keys()].sort((a, b) => a - b);
  const weeklyData = [];
  for (let i = 1; i < sortedWks.length; i++) {
    const prev = wkAvg.get(sortedWks[i-1]), curr = wkAvg.get(sortedWks[i]);
    if (!prev || !curr) continue;
    const raw = +(curr.avg - prev.avg).toFixed(1);
    weeklyData.push({ x: curr.x, y: -raw, raw, label: curr.label });
  }

  const hasWeeklyBar = showWeeklyBar && weeklyData.length > 0;
  const barMax = weeklyData.length ? Math.max(...weeklyData.map(d => Math.abs(d.y)), 0.1) : 1;

  // ── 레이아웃 상수 ────────────────────────────────────────────────────
  const CELL_H       = 18;   // 동적 셀 높이 최대값 (레이아웃 여백 할당용)
  const WEEKLY_BAR_H = 104;
  const SUB_GAP      = 6;
  const X_AXIS_H     = 28;
  const BOTTOM_PAD   = 10;

  let BAR_AREA_H = BOTTOM_PAD + X_AXIS_H;
  if (hasWeeklyBar)      BAR_AREA_H += WEEKLY_BAR_H + SUB_GAP;
  if (showDietGraph)     BAR_AREA_H += 3 * CELL_H + SUB_GAP;
  if (showExerciseGraph) BAR_AREA_H += CELL_H + SUB_GAP;

  // ── x축 범위 ─────────────────────────────────────────────────────────
  const lastT  = pts[pts.length - 1].t;
  const endTs  = showPrediction && predData.length > 0 ? lastT + 8*7*86400000 + 7*86400000 : lastT + 12*86400000;
  const startTs = pts[0].t - 6*86400000;

  // ── 색상 ─────────────────────────────────────────────────────────────
  const TEAL   = '#00e5aa', ORANGE = '#ffa726', RED = '#ef5350';
  const BLUE   = '#4fc3f7', GREEN  = '#66bb6a', BG  = '#0d1117';
  const PURPLE = 'rgba(180,130,255,0.85)', GRID = 'rgba(255,255,255,0.07)', TICK = 'rgba(255,255,255,0.6)';

  // ── 말풍선 유틸 ──────────────────────────────────────────────────────
  const BP = 5, BLH = 15, BOFF = 100;
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x+r, y); ctx.arcTo(x+w, y, x+w, y+h, r); ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r); ctx.arcTo(x, y, x+w, y, r); ctx.closePath();
  }
  function drawBox(ctx, dotX, dotY, bx, by, lines, col, chart, bp=BP, blh=BLH, f0=10, f1=9) {
    ctx.save(); let tw = 0;
    lines.forEach((l, i) => { ctx.font = i === 0 ? `bold ${f0}px sans-serif` : `${f1}px sans-serif`; tw = Math.max(tw, ctx.measureText(l).width); });
    const BW = tw + bp*2 + 2, H = lines.length*blh + bp*2, area = chart.chartArea;
    bx = Math.max(area.left, Math.min(bx, chart.width - BW - 4));
    by = Math.max(4, Math.min(by, chart.height - H - 4));
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
    rrect(ctx, bx, by, BW, H, 5); ctx.fillStyle = `rgba(${col},${annotOpacity})`; ctx.fill();
    ctx.shadowColor = 'transparent';
    let cx, cy;
    if (dotX < bx) { cx = bx; cy = Math.min(by+H, Math.max(by, dotY)); }
    else if (dotX > bx+BW) { cx = bx+BW; cy = Math.min(by+H, Math.max(by, dotY)); }
    else { cx = bx+BW/2; cy = dotY < by ? by : by+H; }
    ctx.beginPath(); ctx.strokeStyle = `rgba(${col},${annotOpacity})`; ctx.lineWidth = 1;
    ctx.moveTo(cx, cy); ctx.bezierCurveTo(cx, cy+(dotY-cy)*.55, dotX, cy+(dotY-cy)*.45, dotX, dotY); ctx.stroke();
    lines.forEach((l, i) => {
      ctx.fillStyle = '#fff';
      ctx.font = i === 0 ? `bold ${f0}px sans-serif` : `${f1}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(l, bx+bp, by+bp+blh*i+blh*0.67);
    });
    ctx.restore();
  }
  function dot(ctx, px, py, color, r) {
    ctx.save(); ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI*2);
    ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = BG; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  }

  // ── 어노테이션 플러그인 ──────────────────────────────────────────────
  const annotPlugin = { id: 'annot', afterDatasetsDraw(chart) {
    const ctx = chart.ctx, xs = chart.scales.x, ys = chart.scales.y;
    const gx = v => xs.getPixelForValue(v), gy = v => ys.getPixelForValue(v), area = chart.chartArea;
    const scale = Math.max(0.6, Math.min(2.0, (endTs - startTs) / (xs.max - xs.min)));
    const sBP = Math.round(BP*scale), sBLH = Math.round(BLH*scale), sBOFF = Math.round(BOFF*scale);
    const sFont0 = Math.round(10*scale), sFont1 = Math.round(9*scale);

    if (showMaxMarker) {
      const mp = pts[maxIdx];
      dot(ctx, gx(mp.t), gy(mp.w), RED, 7);
      drawBox(ctx, gx(mp.t), gy(mp.w), gx(mp.t)+12, gy(mp.w)+Math.round(14*scale), [`최고  ${maxW.toFixed(1)} kg`, fmt(mp.date)], '195,65,42', chart, sBP, sBLH, sFont0, sFont1);
    }
    if (showMinMarker) {
      const lastIdx = pts.length - 1;
      const drawMinIdx = minIndices.filter(i => i !== lastIdx);
      if (drawMinIdx.length > 0) {
        const mi = pts[drawMinIdx[drawMinIdx.length-1]], mix = gx(mi.t), miy = gy(mi.w);
        dot(ctx, mix, miy, GREEN, 7);
        const minLines = [`최저  ${minW.toFixed(1)} kg`, ...drawMinIdx.slice(0, 2).map(i => fmt(pts[i].date))];
        drawBox(ctx, mix, miy, mix+12, miy+Math.round(14*scale), minLines, '34,128,50', chart, sBP, sBLH, sFont0, sFont1);
      }
    }
    if (showCurMarker) {
      const cp = pts[pts.length-1], cpx = gx(cp.t), cpy = gy(cp.w);
      dot(ctx, cpx, cpy, BLUE, 8); dot(ctx, cpx, cpy, GREEN, 5);
      drawBox(ctx, cpx, cpy, cpx-sBOFF-10, cpy+Math.round(16*scale), [`현재  ${curW.toFixed(1)} kg`, fmt(cp.date)], '20,98,152', chart, sBP, sBLH, sFont0, sFont1);
    }
    if (!isMobile) {
      ctx.save(); ctx.fillStyle = 'rgba(235,75,75,.9)'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(`목표 ${goal} kg`, area.right + Y_AXIS_W/2 + 5, gy(goal) + 4); ctx.restore();
    }
  }};

  // ── 주간 막대 플러그인 ───────────────────────────────────────────────
  const weeklyBarPlugin = { id: 'weeklyBar', afterDraw(chart) {
    if (!hasWeeklyBar) return;
    const { ctx, chartArea, scales: { x } } = chart;
    const xBottom  = x.bottom;
    const top      = xBottom + SUB_GAP;
    const baseline = top + WEEKLY_BAR_H - 8; // 바 하단 기준선
    const maxBarH  = baseline - top - 2;
    const midY     = (top + baseline) / 2;

    const xPos = weeklyData.map(d => x.getPixelForValue(d.x));
    let barW = 14;
    if (xPos.length > 1) {
      const gaps = xPos.slice(1).map((p, i) => p - xPos[i]).filter(g => g > 2);
      if (gaps.length) barW = Math.max(4, Math.min(20, Math.min(...gaps) * 0.45));
    }

    ctx.save();
    // 구분선
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(chartArea.left, xBottom); ctx.lineTo(chartArea.right, xBottom); ctx.stroke();

    ctx.beginPath();
    ctx.rect(chartArea.left, top - 2, chartArea.right - chartArea.left, baseline - top + 6);
    ctx.clip();

    // 바닥 기준선
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(chartArea.left, baseline); ctx.lineTo(chartArea.right, baseline); ctx.stroke();

    // 모든 막대 위로 확장 — 감량(초록), 증량(빨강)
    weeklyData.forEach((d, i) => {
      const cx = xPos[i];
      if (cx < chartArea.left - barW || cx > chartArea.right + barW) return;
      const h       = Math.max(2, Math.abs(d.y) / barMax * maxBarH);
      const isLoss  = d.y >= 0;
      ctx.fillStyle = isLoss ? 'rgba(102,187,106,.82)' : 'rgba(239,83,80,.82)';
      ctx.beginPath();
      ctx.roundRect(cx - barW/2, baseline - h, barW, h, [2, 2, 0, 0]);
      ctx.fill();
    });
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText('주간', chartArea.left - 3, midY);
    ctx.restore();
  }};

  // ── 주간 막대 툴팁 플러그인 ──────────────────────────────────────────
  let _barTooltipIdx = -1;
  const weeklyBarTooltipPlugin = { id: 'weeklyBarTooltip',
    afterEvent(chart, args) {
      if (!hasWeeklyBar) return;
      const { event } = args;
      if (!['mousemove','touchstart','click'].includes(event.type)) return;
      const { chartArea, scales: { x } } = chart;
      const xBottom = x.bottom;
      const top = xBottom + SUB_GAP;
      const bot = top + WEEKLY_BAR_H - 8;
      const ey = event.y, ex = event.x;
      if (ey < top || ey > bot) {
        if (_barTooltipIdx !== -1) { _barTooltipIdx = -1; args.changed = true; }
        return;
      }
      const xPos = weeklyData.map(d => x.getPixelForValue(d.x));
      let barW = 14;
      if (xPos.length > 1) {
        const gaps = xPos.slice(1).map((p, i) => p - xPos[i]).filter(g => g > 2);
        if (gaps.length) barW = Math.max(4, Math.min(20, Math.min(...gaps) * 0.45));
      }
      const hit = weeklyData.findIndex((d, i) => Math.abs(ex - xPos[i]) <= barW + 4);
      if (hit !== _barTooltipIdx) { _barTooltipIdx = hit; args.changed = true; }
    },
    afterDraw(chart) {
      if (!hasWeeklyBar || _barTooltipIdx < 0) return;
      const d = weeklyData[_barTooltipIdx]; if (!d) return;
      const { ctx, chartArea, scales: { x } } = chart;
      const cx       = x.getPixelForValue(d.x);
      const xBottom  = x.bottom;
      const top      = xBottom + SUB_GAP;
      const baseline = top + WEEKLY_BAR_H - 8;
      const midY     = (top + baseline) / 2;
      const text1 = d.label;
      const text2 = d.raw < 0 ? `감량  ${Math.abs(d.raw).toFixed(1)} kg` : `증량  +${d.raw.toFixed(1)} kg`;
      ctx.save();
      ctx.font = 'bold 10px sans-serif';
      const w1 = ctx.measureText(text1).width;
      ctx.font = '9px sans-serif';
      const w2 = ctx.measureText(text2).width;
      const bw = Math.max(w1, w2) + 12, bh = 30;
      let bx = cx - bw/2;
      bx = Math.max(chartArea.left, Math.min(bx, chartArea.right - bw));
      const by = midY - bh - 6;
      ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 6;
      rrect(ctx, bx, by, bw, bh, 5);
      ctx.fillStyle = 'rgba(10,18,32,.95)'; ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left';
      ctx.font = 'bold 10px sans-serif'; ctx.fillText(text1, bx+6, by+11);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = d.raw < 0 ? '#66bb6a' : '#ef5350';
      ctx.fillText(text2, bx+6, by+23);
      ctx.restore();
    }
  };

  // ── 식단·운동 히트맵 플러그인 ────────────────────────────────────────
  const EMPTY_CLR = 'rgba(255,255,255,.05)';
  const MEAL_CLR  = { green: 'rgba(102,187,106,.88)', yellow: 'rgba(255,167,38,.88)', red: 'rgba(239,83,80,.88)' };
  const EX_CLR    = { yes: 'rgba(102,187,106,.88)', no: 'rgba(239,83,80,.88)' };
  const toDs = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const subGraphPlugin = { id: 'subGraph', afterDraw(chart) {
    if (!showDietGraph && !showExerciseGraph) return;
    const { ctx, chartArea, scales: { x } } = chart;

    const allRecs = [...records].sort((a, b) => a.date.localeCompare(b.date));
    if (!allRecs.length) return;
    const recMap    = Object.fromEntries(allRecs.map(r => [r.date, r]));
    const firstDate = allRecs[0].date;
    const lastDate  = allRecs[allRecs.length - 1].date;

    // 첫~마지막 날짜 사이 모든 날 생성 (빈 날도 포함 → seamless 직사각형)
    const allDays = [];
    const dCur  = new Date(firstDate);
    const dLast = new Date(lastDate);
    while (dCur <= dLast) {
      const ds = toDs(dCur);
      allDays.push(recMap[ds] || { date: ds });
      dCur.setDate(dCur.getDate() + 1);
    }

    // 가시 범위 필터
    const buf     = 4 * 86400000;
    const visible = allDays.filter(r => {
      const t = new Date(r.date).getTime();
      return t >= x.min - buf && t <= x.max + buf;
    });
    if (!visible.length) return;

    const pixels = visible.map(r => x.getPixelForValue(new Date(r.date).getTime()));
    const n      = visible.length;

    // 평균 셀 간격 기반 경계 (첫/마지막 셀도 동일 크기 — 차트 끝까지 늘어나지 않음)
    const avgSpacing = n > 1 ? (pixels[n-1] - pixels[0]) / (n - 1) : dynH;
    const halfW      = avgSpacing / 2;
    const cellL = visible.map((_, i) =>
      i === 0 ? Math.max(chartArea.left, pixels[0] - halfW) : (pixels[i-1] + pixels[i]) / 2);
    const cellR = visible.map((_, i) =>
      i === n-1 ? Math.min(chartArea.right, pixels[n-1] + halfW) : (pixels[i] + pixels[i+1]) / 2);

    // ── 동적 셀 높이 (날짜 수에 따라 정사각형 유지) ─────────────────
    const avgCellW = n > 1
      ? Math.abs(cellR[n-1] - cellL[0]) / n
      : CELL_H;
    const dynH = Math.max(6, Math.min(CELL_H, Math.round(avgCellW)));

    // Y 시작점: x축 하단 + 주간막대 섹션 바로 아래
    const xBottom = x.bottom;
    let sY = xBottom + SUB_GAP;
    if (hasWeeklyBar) sY += WEEKLY_BAR_H + 2; // 주간막대에 바짝 붙임

    // ── 식단 ──────────────────────────────────────────────────────────
    if (showDietGraph) {
      const dietTop = sY;
      ctx.save();
      ctx.beginPath();
      ctx.rect(chartArea.left, dietTop, chartArea.right - chartArea.left, 3 * dynH);
      ctx.clip();
      ['morning', 'lunch', 'dinner'].forEach((meal, ri) => {
        const rowY = dietTop + ri * dynH;
        visible.forEach((r, i) => {
          const l  = Math.round(cellL[i]);
          const rr = Math.round(cellR[i]);
          ctx.fillStyle = MEAL_CLR[r.meal?.[meal]] || EMPTY_CLR;
          ctx.fillRect(l, rowY, Math.max(1, rr - l), dynH);
        });
      });
      ctx.restore();
      // "식단" 레이블 — 3행 중앙
      ctx.save();
      ctx.font = '9px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,.3)';
      ctx.fillText('식단', chartArea.left - 3, dietTop + dynH * 1.5);
      ctx.restore();
      sY += 3 * dynH + 2;
    }

    // ── 운동 ──────────────────────────────────────────────────────────
    if (showExerciseGraph) {
      const exTop = sY;
      ctx.save();
      ctx.beginPath();
      ctx.rect(chartArea.left, exTop, chartArea.right - chartArea.left, dynH);
      ctx.clip();
      visible.forEach((r, i) => {
        const l  = Math.round(cellL[i]);
        const rr = Math.round(cellR[i]);
        ctx.fillStyle = r.exercise === true  ? EX_CLR.yes :
                        r.exercise === false ? EX_CLR.no  : EMPTY_CLR;
        ctx.fillRect(l, exTop, Math.max(1, rr - l), dynH);
      });
      ctx.restore();
      ctx.save();
      ctx.font = '9px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,.3)';
      ctx.fillText('운동', chartArea.left - 3, exTop + dynH / 2);
      ctx.restore();
    }
  }};

  // ── 데이터셋 ─────────────────────────────────────────────────────────
  const datasets = [
    { label: '목표', data: [{ x: startTs, y: goal }, { x: endTs, y: goal }],
      borderColor: 'rgba(235,60,60,.55)', backgroundColor: 'rgba(180,30,30,.05)',
      borderWidth: 1.5, borderDash: [6,4], pointRadius: 0, fill: 'end', order: 5 },
  ];
  if (show7dayMA)
    datasets.push({ label: '7일 이동평균', data: ma7, borderColor: ORANGE, backgroundColor: 'transparent', borderWidth: 1.8, borderDash: [7,4], pointRadius: 0, tension: .3, order: 2 });
  datasets.push({ label: '실제 체중', data: pts.map(p => ({ x: p.t, y: p.w })), borderColor: TEAL, backgroundColor: 'transparent', borderWidth: 2.2, pointRadius: 0, pointHoverRadius: 5, tension: .15, spanGaps: false, order: 1 });
  if (showPrediction && predData.length > 1)
    datasets.push({ label: '예상 체중', data: predData, borderColor: PURPLE, backgroundColor: 'transparent', borderWidth: 1.5, borderDash: [4,6], pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: PURPLE, tension: .2, order: 3 });

  const sharedX = {
    type: 'time', min: startTs, max: endTs,
    time: { unit: 'month', displayFormats: { month: 'yyyy.MM' } },
    grid: { color: GRID }, border: { color: 'rgba(255,255,255,.15)' }
  };

  canvasMain._chartInstance = new Chart(canvasMain.getContext('2d'), {
    type: 'line', data: { datasets },
    options: {
      responsive: true,
      aspectRatio: isMobile ? 1.4 : 1.65,
      layout: { padding: { top: 12, right: isMobile ? 4 : 70, bottom: 4 + BAR_AREA_H, left: isMobile ? 5 : 70 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index', intersect: false,
          backgroundColor: 'rgba(10,18,32,.95)', titleColor: '#fff', bodyColor: 'rgba(255,255,255,.75)', padding: 9,
          filter: item => item.dataset.label !== '목표' && item.parsed.y != null,
          callbacks: {
            title: items => { if (!items.length) return ''; const maxX = Math.max(...items.map(i => i.parsed.x)); return fmt(new Date(maxX)); },
            label: item => ` ${item.dataset.label}: ${item.parsed.y?.toFixed(1)} kg`
          }
        },
        zoom: {
          zoom: { wheel: { enabled: true, speed: 0.15 }, pinch: { enabled: true }, mode: 'x' },
          pan:  { enabled: true, mode: 'x' },
          limits: { x: { min: startTs, max: endTs, minRange: 7*86400000 } }
        }
      },
      scales: {
        x: { ...sharedX, ticks: { color: TICK, font: { size: 11 }, maxTicksLimit: 8 } },
        y: { min: yMin, max: yMax, grid: { color: GRID },
          ticks: { color: TICK, font: { size: 11 }, stepSize: 5, callback: v => v },
          border: { color: 'rgba(255,255,255,.15)' },
          title: { display: true, text: '체중 (kg)', color: TICK, font: { size: 11 } },
          afterFit(s) { s.width = Y_AXIS_W; } },
        y2: { min: yMin, max: yMax, position: 'right', grid: { drawOnChartArea: false },
          ticks: { color: TICK, font: { size: 11 }, stepSize: 5, callback: v => v },
          border: { color: 'rgba(255,255,255,.15)' },
          afterFit(s) { s.width = isMobile ? 0 : Y_AXIS_W; } }
      },
      interaction: { mode: 'index', intersect: false }
    },
    plugins: [annotPlugin, weeklyBarPlugin, weeklyBarTooltipPlugin, subGraphPlugin]
  });
  canvasMain._startTs = startTs;
  canvasMain._endTs   = endTs;
}

export function calcStats(records, userProfile) {
  const goal = userProfile?.goal ?? 80, height = userProfile?.height ?? null;
  const pts = records.filter(r => r.weight != null).sort((a, b) => a.date.localeCompare(b.date));
  if (pts.length < 2) return null;
  const ws = pts.map(p => p.weight), maxW = Math.max(...ws), minW = Math.min(...ws), curW = pts[pts.length-1].weight;
  const start = new Date(pts[0].date), end = new Date(pts[pts.length-1].date);
  const days = Math.round((end - start) / 86400000), loss = maxW - curW;
  const bmi = height ? +(curW / Math.pow(height/100, 2)).toFixed(1) : null;

  function getSun(d) { const dt = new Date(d); dt.setDate(dt.getDate() - dt.getDay()); dt.setHours(0,0,0,0); return dt.getTime(); }
  const byW = new Map();
  pts.forEach(p => { const wk = getSun(new Date(p.date)); if (!byW.has(wk)) byW.set(wk, []); byW.get(wk).push(p.weight); });
  const avgs = new Map();
  byW.forEach((w, k) => { if (w.length >= 4) avgs.set(k, w.reduce((s, v) => s + v, 0) / w.length); });
  const vk = [...avgs.keys()].sort((a, b) => a - b);
  const changes = [];
  for (let i = 1; i < vk.length; i++) changes.push(avgs.get(vk[i]) - avgs.get(vk[i-1]));
  let cur = 0, max2 = 0, tmp = 0;
  changes.forEach(c => { if (c < 0) { tmp++; max2 = Math.max(max2, tmp); } else tmp = 0; });
  for (let i = changes.length - 1; i >= 0; i--) { if (changes[i] < 0) cur++; else break; }

  const r6 = pts.filter(p => new Date(p.date).getTime() >= end.getTime() - 42*86400000);
  let eta = '계산불가';
  if (r6.length >= 2 && curW > goal) {
    const rl   = r6[0].weight - r6[r6.length-1].weight;
    const rd   = (new Date(r6[r6.length-1].date) - new Date(r6[0].date)) / 86400000;
    const rate = rd > 0 ? rl / rd : 0;
    if (rate > 0) {
      const d = new Date(end.getTime() + Math.round((curW - goal) / rate) * 86400000);
      eta = `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
    }
  }
  return {
    startW: maxW, curW, minW, goal, days, loss: +loss.toFixed(1),
    daily:  +(loss / days).toFixed(2),
    weekly: +(loss / days * 7).toFixed(2),
    ratio:  +(loss / maxW * 100).toFixed(1),
    remaining: +(curW - goal).toFixed(1),
    etaStr: curW <= goal ? '🎉 목표 달성!' : eta,
    bmi, currentStreak: cur, maxStreak: max2,
    startDate: pts[0].date, endDate: pts[pts.length-1].date
  };
}
