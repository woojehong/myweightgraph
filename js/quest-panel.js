// ─────────────────────────────────────────────────────────────────────────────
// 퀘스트 트래커 UI — 일간/주간/월간, 상한선을 명확히 보여준다.
// 주간·월간은 퀘스트가 많으므로 (1)달성 (2)진행중 순으로 정렬해 상위만 접어 보여준다.
// ─────────────────────────────────────────────────────────────────────────────
import {
  DAILY_QUESTS, DAILY_BONUS, dailyProgress, dailyBonusProgress,
  weeklyProgress, monthlyProgress,
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
  // 이름이 길어도 잘리지 않도록 2줄 구조: 위=이름/배점, 아래=진행바
  return `
    <div class="q-row${done?' is-done':''}">
      <div class="q-line">
        <span class="q-ico" style="${done?`color:${color}`:''}">${done?'✔':'○'}</span>
        ${q.tier?`<em class="q-tier t-${q.tier}">${TIER_LABEL[q.tier]}</em>`:''}
        <span class="q-name" title="${esc(q.label)}">${esc(q.label)}</span>
        <span class="q-val">${valueText}</span>
        <span class="q-pt" style="${done?`color:${color}`:''}">${q.points}P</span>
      </div>
      <span class="q-bar"><i style="width:${bar}%;background:${done?color:'#5a6672'}"></i></span>
    </div>`;
}

// 기본은 펼침. 사용자가 접으면 그 상태를 기억한다.
const COLLAPSE_KEY = 'quest_collapsed';
function collapsedSet(){
  try { return new Set(JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '[]')); }
  catch { return new Set(); }
}
function saveCollapsed(set){
  try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify([...set])); } catch {}
}

function section({key, title, note, color, list, cap, bonus, collapsed}){
  const bonusEarned = bonus ? rawEarned(bonus) : 0;
  const bonusTotal  = bonus ? sumPoints(bonus) : 0;
  const earned = cappedEarned(list, cap) + bonusEarned;
  const raw    = rawEarned(list);
  const total  = (cap ?? sumPoints(list)) + bonusTotal;
  const capped = cap != null && raw > cap;
  const left   = cap != null ? remainingToCap(list, cap) : 0;
  const doneN  = list.filter(q=>q.done).length;

  // 난이도순(쉬움→보통→어려움), 같은 난이도면 배점 낮은 순
  const ORDER = { easy:0, normal:1, hard:2 };
  const sorted = [...list].sort((a,b)=>
    (ORDER[a.tier] ?? 0) - (ORDER[b.tier] ?? 0) || a.points - b.points);

  return `
    <div class="q-sec${collapsed?'':' open'}" data-key="${key}">
      <button class="q-head" onclick="toggleQuestSection('${key}')" aria-expanded="${collapsed?'false':'true'}">
        <span class="q-hl">
          <span class="q-title" style="color:${color}">${title}</span>
          <span class="q-caret">${collapsed?'▸':'▾'}</span>
        </span>
        <span class="q-sum" style="color:${color}">${earned}<em>/${total}P</em></span>
        <span class="q-mini"><i style="width:${pct(earned/total)}%;background:${color}"></i></span>
        <span class="q-cnt">달성 ${doneN}/${list.length}</span>
      </button>
      <div class="q-body"${collapsed?' hidden':''}>
        <div class="q-capinfo">
          <span>${esc(note)}</span>
          ${cap!=null?`<span>상한 <b style="color:${color}">${cap}P</b></span>
          <span>${capped?`상한 도달 · 초과분 ${raw-cap}P 미지급`:`상한까지 ${left}P 남음`}</span>`
          :`<span>다 하면 <b style="color:${color}">${total}P</b></span>`}
        </div>
        ${sorted.map(q=>questRow(q,color)).join('')}
        ${bonus && bonus.length ? `
          <div class="q-bonus-h">선택 보너스 · 완주와 무관</div>
          ${bonus.map(q=>questRow(q,'#4fc3f7')).join('')}` : ''}
      </div>
    </div>`;
}

export const QUEST_PANEL_CSS = `
/* 지난 기록(.past-list)과 동일한 3열 그리드 — 가로폭 통일 */
.q-wrap{display:grid;grid-template-columns:1fr;gap:5px;margin:14px 0 12px;align-items:start}
@media(min-width:768px){.q-wrap{grid-template-columns:repeat(3,1fr);gap:8px}}
.q-sec{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:9px 10px;min-width:0}
.q-head{display:grid;gap:5px;width:100%;background:none;border:none;padding:0;cursor:pointer;text-align:left}
.q-hl{display:flex;align-items:center;justify-content:space-between}
.q-caret{color:var(--muted);font-size:10px}
.q-title{font-size:12px;font-weight:800}
.q-sum{font-size:15px;font-weight:800;white-space:nowrap}
.q-sum em{font-size:10px;font-weight:600;color:var(--muted);font-style:normal}
.q-mini{display:block;height:6px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden}
.q-mini i{display:block;height:100%;border-radius:4px}
.q-cnt{font-size:10px;color:var(--muted)}
.q-capinfo{display:flex;gap:10px;flex-wrap:wrap;font-size:10px;color:var(--muted);margin-bottom:7px}
.q-capinfo b{font-weight:800}
.q-body{display:grid;gap:5px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)}
.q-body[hidden]{display:none}
.q-bonus-h{font-size:9px;color:var(--muted);margin-top:6px;padding-top:6px;border-top:1px dashed var(--border)}
.q-row{display:grid;gap:4px}
.q-line{display:flex;align-items:center;gap:6px}
.q-ico{font-size:11px;color:var(--muted);flex-shrink:0}
.q-name{font-size:11px;color:var(--muted);flex:1;min-width:0;line-height:1.35;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.q-row.is-done .q-name{color:var(--text)}
.q-tier{font-size:9px;font-style:normal;padding:1px 5px;border-radius:4px;flex-shrink:0;white-space:nowrap}
.t-easy{background:rgba(102,187,106,.16);color:#66bb6a}
.t-normal{background:rgba(79,195,247,.16);color:#4fc3f7}
.t-hard{background:rgba(239,83,80,.16);color:#ef5350}
.q-bar{height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden}
.q-bar i{display:block;height:100%;border-radius:3px}
.q-val{font-size:10px;color:var(--muted);flex-shrink:0;white-space:nowrap}
.q-pt{font-size:11px;font-weight:700;color:var(--muted);min-width:34px;text-align:right;flex-shrink:0}
`;

/** 퀘스트 패널 HTML 생성 */
export function questPanelHTML(records, todayRecord, buddyDates, waterGoal){
  const d  = dailyProgress(todayRecord);
  const db = dailyBonusProgress(todayRecord, waterGoal);
  const w = weeklyProgress(records);
  const m = monthlyProgress(records, undefined, buddyDates);

  const col = collapsedSet();
  return `
    <div class="q-wrap">
      ${section({key:'d',title:'일간',note:'오전 6시 초기화 · 완주 44P + 보너스 6P',color:'#00e5aa',list:d,cap:null,bonus:db,collapsed:col.has('d')})}
      ${section({key:'w',title:'주간',note:`일요일 초기화 · ${daysLeftInWeek()}일 남음`,color:'#4fc3f7',list:w,cap:WEEKLY_CAP,collapsed:col.has('w')})}
      ${section({key:'m',title:'월간',note:`${daysLeftInMonth()}일 남음`,color:'#ffa726',list:m,cap:MONTHLY_CAP,collapsed:col.has('m')})}
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
    sec.classList.toggle('open', open);
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    caret.textContent = open ? '▾' : '▸';
    const set = collapsedSet();
    if (open) set.delete(key); else set.add(key);
    saveCollapsed(set);
  };
}
