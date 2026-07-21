// ─────────────────────────────────────────────────────────────────────────────
// 퀘스트 트래커 UI — 일간/주간/월간, 상한선을 명확히 보여준다.
// 주간·월간은 퀘스트가 많으므로 (1)달성 (2)진행중 순으로 정렬해 상위만 접어 보여준다.
// ─────────────────────────────────────────────────────────────────────────────
import {
  DAILY_QUESTS, dailyProgress, weeklyProgress, monthlyProgress,
  WEEKLY_CAP, MONTHLY_CAP, cappedEarned, rawEarned, sumPoints,
  daysLeftInWeek, daysLeftInMonth, remainingToCap,
} from './quests.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pct = r => Math.round(Math.max(0, Math.min(1, r)) * 100);

const TIER_LABEL = { easy:'쉬움', normal:'보통', hard:'어려움' };

function questRow(q, color){
  const done = q.done;
  const bar = pct(q.ratio);
  const valueText = q.goal > 1 ? `${q.value}/${q.goal}` : (done ? '완료' : '미완');
  return `
    <div class="q-row${done?' is-done':''}">
      <span class="q-ico" style="${done?`color:${color}`:''}">${done?'✔':'○'}</span>
      <span class="q-name">${esc(q.label)}${q.tier?`<em class="q-tier t-${q.tier}">${TIER_LABEL[q.tier]}</em>`:''}</span>
      <span class="q-bar"><i style="width:${bar}%;background:${done?color:'#5a6672'}"></i></span>
      <span class="q-val">${valueText}</span>
      <span class="q-pt" style="${done?`color:${color}`:''}">${q.points}P</span>
    </div>`;
}

function section({key, title, note, color, list, cap, open}){
  const earned = cappedEarned(list, cap);
  const raw    = rawEarned(list);
  const total  = cap ?? sumPoints(list);
  const capped = cap != null && raw > cap;
  const left   = cap != null ? remainingToCap(list, cap) : 0;
  const doneN  = list.filter(q=>q.done).length;

  // 달성 → 진행도 높은 순
  const sorted = [...list].sort((a,b)=> (b.done-a.done) || (b.ratio-a.ratio));

  return `
    <div class="q-sec" data-key="${key}">
      <button class="q-head" onclick="toggleQuestSection('${key}')" aria-expanded="${open?'true':'false'}">
        <span class="q-caret">${open?'▾':'▸'}</span>
        <span class="q-title" style="color:${color}">${title}</span>
        <span class="q-note">${esc(note)}</span>
        <span class="q-sum" style="color:${color}">${earned} <em>/ ${total}P</em></span>
      </button>
      <div class="q-capbar"><i style="width:${pct(earned/total)}%;background:${color}"></i></div>
      ${cap!=null?`<div class="q-capinfo">
        <span>상한 <b style="color:${color}">${cap}P</b></span>
        <span>${capped?`상한 도달 · 초과분 ${raw-cap}P는 지급 안 됨`:`상한까지 ${left}P 남음`}</span>
        <span>달성 ${doneN}/${list.length}</span>
      </div>`:''}
      <div class="q-body" ${open?'':'hidden'}>${sorted.map(q=>questRow(q,color)).join('')}</div>
    </div>`;
}

export const QUEST_PANEL_CSS = `
.q-wrap{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px;margin-bottom:12px}
.q-cards{display:flex;gap:8px;margin-bottom:10px}
.q-card{flex:1;background:var(--surface2);border-radius:9px;padding:8px 10px;min-width:0}
.q-card .l{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px}
.q-card .n{font-size:11px;font-weight:700}
.q-card .v{font-size:15px;font-weight:800;color:var(--text)}
.q-card .v em{font-size:10px;font-weight:600;color:var(--muted);font-style:normal}
.q-card .t{height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden}
.q-card .t i{display:block;height:100%;border-radius:3px}
.q-sec{background:var(--surface2);border-radius:9px;padding:9px 10px;margin-bottom:7px}
.q-sec:last-child{margin-bottom:0}
.q-head{display:flex;align-items:center;gap:7px;width:100%;background:none;border:none;padding:0;cursor:pointer;text-align:left}
.q-caret{color:var(--muted);font-size:11px;width:10px}
.q-title{font-size:13px;font-weight:800}
.q-note{font-size:10px;color:var(--muted)}
.q-sum{margin-left:auto;font-size:12px;font-weight:800;white-space:nowrap}
.q-sum em{font-size:10px;font-weight:600;color:var(--muted);font-style:normal}
.q-capbar{height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;margin:7px 0 5px}
.q-capbar i{display:block;height:100%;border-radius:3px}
.q-capinfo{display:flex;gap:10px;flex-wrap:wrap;font-size:10px;color:var(--muted);margin-bottom:6px}
.q-capinfo b{font-weight:800}
.q-body{display:grid;gap:5px;padding-top:4px;border-top:1px solid var(--border)}
.q-row{display:flex;align-items:center;gap:7px}
.q-ico{width:12px;font-size:11px;color:var(--muted);flex-shrink:0}
.q-name{font-size:11px;color:var(--muted);width:118px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.q-row.is-done .q-name{color:var(--text)}
.q-tier{font-size:8px;font-style:normal;margin-left:4px;padding:1px 4px;border-radius:4px}
.t-easy{background:rgba(102,187,106,.16);color:#66bb6a}
.t-normal{background:rgba(79,195,247,.16);color:#4fc3f7}
.t-hard{background:rgba(239,83,80,.16);color:#ef5350}
.q-bar{flex:1;height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;min-width:30px}
.q-bar i{display:block;height:100%;border-radius:3px}
.q-val{font-size:10px;color:var(--muted);width:42px;text-align:right;flex-shrink:0}
.q-pt{font-size:11px;font-weight:700;color:var(--muted);width:36px;text-align:right;flex-shrink:0}
@media(max-width:767px){.q-name{width:96px;font-size:10px}.q-tier{display:none}}
`;

/** 퀘스트 패널 HTML 생성 */
export function questPanelHTML(records, todayRecord, buddyDates){
  const d = dailyProgress(todayRecord);
  const w = weeklyProgress(records);
  const m = monthlyProgress(records, undefined, buddyDates);

  const dEarned = rawEarned(d), dTotal = sumPoints(DAILY_QUESTS);
  const wEarned = cappedEarned(w, WEEKLY_CAP);
  const mEarned = cappedEarned(m, MONTHLY_CAP);

  const card = (name, color, val, tot) => `
    <div class="q-card">
      <div class="l"><span class="n" style="color:${color}">${name}</span>
        <span class="v">${val}<em>/${tot}</em></span></div>
      <div class="t"><i style="width:${pct(val/tot)}%;background:${color}"></i></div>
    </div>`;

  return `
    <div class="q-wrap">
      <div class="q-cards">
        ${card('일간','#00e5aa',dEarned,dTotal)}
        ${card('주간','#4fc3f7',wEarned,WEEKLY_CAP)}
        ${card('월간','#ffa726',mEarned,MONTHLY_CAP)}
      </div>
      ${section({key:'d',title:'일간 퀘스트',note:'오전 6시 초기화',color:'#00e5aa',list:d,cap:null,open:true})}
      ${section({key:'w',title:'주간 퀘스트',note:`일요일 초기화 · ${daysLeftInWeek()}일 남음`,color:'#4fc3f7',list:w,cap:WEEKLY_CAP,open:false})}
      ${section({key:'m',title:'월간 퀘스트',note:`${daysLeftInMonth()}일 남음`,color:'#ffa726',list:m,cap:MONTHLY_CAP,open:false})}
    </div>`;
}

/** 펼치기/접기 — 전역 등록 */
export function installQuestToggle(){
  if (window.toggleQuestSection) return;
  window.toggleQuestSection = key => {
    const sec = document.querySelector(`.q-sec[data-key="${key}"]`);
    if (!sec) return;
    const body = sec.querySelector('.q-body');
    const head = sec.querySelector('.q-head');
    const caret = sec.querySelector('.q-caret');
    const open = body.hasAttribute('hidden');
    if (open) body.removeAttribute('hidden'); else body.setAttribute('hidden','');
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    caret.textContent = open ? '▾' : '▸';
  };
}
