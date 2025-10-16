// ===== src/main.js (KO, preview + auto-open 1st, clickable lessons) =====
import './styles/global.css'
import './components/x-tv-chart.js'

const routes = {
  '': 'home',
  '#/daily-brief': 'daily-brief',
  '#/trade-journal': 'trade-journal',   // 공개 분석
  '#/knowledge-lab': 'knowledge-lab',
  '#/market-news': 'market-news',
  '#/articles': 'articles',
  '#/about': 'about',
};

function setActive(){
  document.querySelectorAll('.nav a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href')===location.hash);
  });
}
function show(routeId){
  document.querySelectorAll('section[data-route]').forEach(s=>{
    s.classList.toggle('hidden', s.dataset.route!==routeId);
  });
  setActive();
}

// -------- Daily Brief 라우팅 ----------
function matchRoute() {
  const h = location.hash;
  const m = h.match(/^#\/daily-brief\/([\w-]+)$/);
  if (m) return { id: 'daily-brief-detail', slug: m[1] };
  return { id: (routes[h] || 'home') };
}

// 목록
async function renderDailyBriefList(){
  const ul = document.getElementById('brief-list');
  if (!ul) return;
  ul.innerHTML = '<li class="muted">불러오는 중…</li>';
  try{
    const res = await fetch('/daily-brief/index.json?_=' + Date.now());
    const items = await res.json();
    ul.innerHTML = Array.isArray(items)&&items.length
      ? items.map(s=>`<li><a href="#/daily-brief/${s}">${s}</a></li>`).join('')
      : '<li class="muted">자료가 없습니다</li>';
  }catch{ ul.innerHTML = '<li class="muted">자료가 없습니다</li>'; }
}

// 상세
async function renderDailyBriefDetail(slug){
  const wrap = document.getElementById('daily-brief-detail');
  if (!wrap) return;
  wrap.innerHTML = `<div class="card"><h2>불러오는 중…</h2></div>`;
  try {
    const res = await fetch(`/daily-brief/${slug}.json?_=${Date.now()}`);
    if (!res.ok) throw 0;
    const d = await res.json();
    wrap.innerHTML = `
      <div class="grid">
        <section class="card" style="grid-column: span 8;">
          <h2>${d.title || 'Daily Brief'}</h2>
          <p class="muted">매일 아침 시장을 읽는 시간</p>
          ${d.bullets?.length?`<h3>📌 핵심 요약</h3><ul>${d.bullets.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
          ${d.schedule?.length?`<h3 style="margin-top:12px">🕒 오늘 일정</h3><ul>${d.schedule.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
        </section>
        <aside class="card" style="grid-column: span 4;">
          <h2>퀵 차트</h2>
          <x-tv-chart symbol="${(d.chart?.symbol)||d.symbol||'FX:XAUUSD'}" interval="${(d.chart?.interval)||d.interval||'60'}" ratio="16:9" min_height="420"></x-tv-chart>
        </aside>
      </div>
      <p class="muted" style="margin-top:12px"><a href="#/daily-brief">← 목록으로</a></p>
    `;
  } catch {
    wrap.innerHTML = `<div class="card"><h2>자료를 찾지 못했습니다</h2></div>`;
  }
}

// -------- Trade Journal = 공개 “분석 아카이브” ----------
const AIDX = '/analyses/index.json';

function koBias(b){
  return b==='bullish'?'상승':b==='bearish'?'하락':'중립';
}
function badge(bias){ return `<span class="badge ${bias}">${koBias(bias||'neutral')}</span>`; }
function pillS(v){ return `<span class="pill level">지지 ${v}</span>`; }
function pillR(v){ return `<span class="pill res">저항 ${v}</span>`; }

async function fetchJSON(path){
  const res = await fetch(path + '?_=' + Date.now());
  if (!res.ok) throw 0;
  return res.json();
}

async function loadAnalysesList(){
  const list = document.getElementById('anal-list');
  if (!list) return;
  list.innerHTML = `<p class="muted">불러오는 중…</p>`;
  try{
    const items = await fetchJSON(AIDX); // [{slug,title,symbol,tf,date,tags,bias}]
    list.dataset.raw = JSON.stringify(items);
    renderAnalysesListFiltered();

    // 👉 자동으로 첫 항목 열기 & 미리보기 차트 활성화 (URL에 slug가 없을 때)
    const slugInUrl = currentSlugFromQuery();
    if (!slugInUrl && items.length){
      await renderAnalysisDetailBySlug(items[0].slug);
      const first = items[0];
      const host = document.getElementById(`pv-${first.slug}`);
      if (host && !host.dataset.rendered){
        host.innerHTML = `<x-tv-chart symbol="${first.symbol}" interval="60" ratio="16:9" min_height="220"></x-tv-chart>`;
        host.dataset.rendered = '1';
        const btn = document.querySelector(`.pv-btn[data-slug="${first.slug}"]`);
        if (btn) btn.textContent = '차트 닫기';
      }
    }
  }catch{
    list.innerHTML = `<p class="muted">자료가 없습니다</p>`;
  }
}

// 목록 + 미리보기 차트 버튼
function renderAnalysesListFiltered(){
  const list = document.getElementById('anal-list');
  const q = (document.getElementById('anal-search')?.value||'').toLowerCase();
  const bias = (document.getElementById('anal-bias')?.value||'');
  const raw = JSON.parse(list.dataset.raw||'[]');
  const items = raw.filter(it=>{
    const hay = [it.title, it.symbol, it.tf, it.date, ...(it.tags||[])].join(' ').toLowerCase();
    const hit = hay.includes(q);
    const okBias = !bias || it.bias===bias;
    return hit && okBias;
  });

  list.innerHTML = items.map(it=>`
    <article class="entry" id="entry-${it.slug}">
      <div class="row">
        <h3 style="margin-right:6px">${it.title}</h3>
        ${badge(it.bias)}
        <span class="meta">· ${it.symbol} · ${it.tf} · ${it.date}</span>
        <div class="actions">
          <a class="icon-btn" href="#/trade-journal?slug=${encodeURIComponent(it.slug)}">열기</a>
          <button class="icon-btn pv-btn" data-slug="${it.slug}" data-symbol="${it.symbol}" data-ivl="60">미리보기 차트</button>
        </div>
      </div>
      ${it.tags?.length?`<div class="row" style="margin-top:6px">${it.tags.map(t=>`<span class="pill">#${t}</span>`).join('')}</div>`:''}
      <div class="preview" id="pv-${it.slug}" style="margin-top:10px;"></div>
    </article>
  `).join('') || `<p class="muted">검색 결과가 없습니다</p>`;

  // 미리보기 차트 토글 (on-demand 로드/해제)
  list.querySelectorAll('.pv-btn').forEach(btn=>{
    btn.onclick = ()=>{
      const slug = btn.dataset.slug;
      const symbol = btn.dataset.symbol;
      const host = document.getElementById(`pv-${slug}`);
      if (!host) return;
      if (host.dataset.rendered === '1') {
        host.innerHTML = ''; host.dataset.rendered = '0';
        btn.textContent = '미리보기 차트';
      } else {
        host.innerHTML = `<x-tv-chart symbol="${symbol}" interval="${btn.dataset.ivl}" ratio="16:9" min_height="220"></x-tv-chart>`;
        host.dataset.rendered = '1';
        btn.textContent = '차트 닫기';
      }
    };
  });
}

// 상세(우측 패널) + 주기 선택
async function renderAnalysisDetailBySlug(slug){
  const box = document.getElementById('anal-detail');
  if (!box) return;
  if (!slug){ box.innerHTML = `<p class="muted">좌측에서 항목을 선택하면 상세 내용을 볼 수 있습니다.</p>`; return; }

  box.innerHTML = `<p class="muted">불러오는 중…</p>`;
  try{
    const d = await fetchJSON(`/analyses/${slug}.json`);
    const ivl = (d.chart?.interval) || '60';
    const sym  = (d.chart?.symbol)   || d.symbol;

    box.innerHTML = `
      <h2>${d.title} ${badge(d.bias)}</h2>
      <p class="muted">${d.symbol} · ${d.tf} · ${d.date}</p>

      <h3>지지 / 저항</h3>
      <div class="row" style="margin-top:6px">
        ${(d.supports||[]).map(pillS).join('')}
        ${(d.resistances||[]).map(pillR).join('')}
      </div>

      ${d.tags?.length?`<div class="row" style="margin-top:6px">${d.tags.map(t=>`<span class="pill">#${t}</span>`).join('')}</div>`:''}

      ${d.context?`<h3 style="margin-top:12px">배경</h3><p>${d.context}</p>`:''}
      ${d.view?`<h3 style="margin-top:12px">관점</h3><p>${d.view}</p>`:''}
      ${d.invalidation?`<p class="meta" style="margin-top:6px">무효화 조건: ${d.invalidation}</p>`:''}

      <div class="card" style="margin-top:12px">
        <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">
          <h3 style="margin:0">참고 차트</h3>
          <div class="row">
            <label class="meta">주기&nbsp;</label>
            <select id="detail-interval" class="search">
              <option value="15">15m</option>
              <option value="60" selected>1H</option>
              <option value="240">4H</option>
              <option value="1D">1D</option>
            </select>
          </div>
        </div>
        <div id="detail-chart-wrap">
          <x-tv-chart id="detail-chart" symbol="${sym}" interval="${ivl}" ratio="16:9" min_height="420"></x-tv-chart>
        </div>
      </div>
    `;

    const sel = document.getElementById('detail-interval');
    if (sel){
      Array.from(sel.options).forEach(o=>{ o.selected = (o.value === ivl); });
      sel.onchange = ()=>{
        const chart = document.getElementById('detail-chart');
        if (chart){ chart.setAttribute('interval', sel.value); }
      };
    }
  }catch{
    box.innerHTML = `<p class="muted">자료를 찾지 못했습니다</p>`;
  }
}

function currentSlugFromQuery(){
  const m = location.hash.match(/^[^?]+\?(.+)$/);
  if (!m) return '';
  const p = new URLSearchParams(m[1]);
  return p.get('slug') || '';
}

/* ===== Reveal & Canvas FX (safe, idempotent) ===== */
(() => {
  if (window.__homeFxInit) return;
  window.__homeFxInit = true;

  // 1) 카드 계단식 입장
  const cards = document.querySelectorAll('.card');
  cards.forEach((c, i) => {
    c.classList.add('reveal');
    c.style.transitionDelay = (i * 60) + 'ms';
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  cards.forEach(c => revealObserver.observe(c));

  // 2) 배경 캔들/그리드 저부하 애니메이션
  const cvs = document.getElementById('bgfx');
  if (!cvs || cvs.dataset.enabled !== 'true' || cvs.__inited) return;
  cvs.__inited = true;

  const ctx = cvs.getContext('2d');
  let w, h, dpr;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cvs.width  = Math.floor(innerWidth  * dpr);
    h = cvs.height = Math.floor(innerHeight * dpr);
    cvs.style.width = innerWidth + 'px';
    cvs.style.height = innerHeight + 'px';
  }
  resize(); addEventListener('resize', resize);

  const candles = Array.from({length: 32}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    body: 14 + Math.random()*28,
    w: 3 + Math.random()*3,
    v: .15 + Math.random()*.25,
    phase: Math.random()*Math.PI*2
  }));

  function grid(){
    const gap = 64 * dpr;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x=0; x<w; x+=gap){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    for (let y=0; y<h; y+=gap){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    ctx.restore();
  }

  function drawCandles(t){
    ctx.save();
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'#66e0ff'); g.addColorStop(1,'#7a7dff');
    candles.forEach(c=>{
      const float = Math.sin(t*0.001 + c.phase)*2*dpr;
      ctx.strokeStyle = 'rgba(150,180,255,.25)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(c.x, c.y - c.body/2 + float); ctx.lineTo(c.x, c.y + c.body/2 + float); ctx.stroke();
      ctx.fillStyle = g; ctx.globalAlpha = 0.35;
      ctx.fillRect(c.x - c.w/2, c.y - (c.body/2)*.6 + float, c.w, c.body*.6);
      c.x += c.v * dpr; if (c.x > w + 40) c.x = -40;
    });
    ctx.restore();
  }

  let last=0;
  function tick(t){
    if (t - last < 1000/30) { requestAnimationFrame(tick); return; }
    last = t;
    ctx.clearRect(0,0,w,h);
    grid(); drawCandles(t);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ===== Knowledge Lab: syllabus + renderer (clickable) ===== */

const KL_KEY = 'kl.progress.v1';
let KL_QUERY = '';   // 검색어

// ——— 커리큘럼（韩文 + 可点击示例，按需补充 link）———
const SYLLABUS = [
  { level:'Preschool', icon:'🎓', desc:'입문 준비',
    lessons:[
      { name:'외환거래란 무엇인가?', link:'#/articles/what-is-forex' },
      { name:'외환은 어떻게 거래하나?', link:'#/articles/how-to-trade-forex' },
      { name:'언제 거래할 수 있나?', link:'#/articles/when-to-trade-forex' },
      { name:'누가 외환을 거래하나?', link:'#/articles/who-trades-forex' },
      { name:'왜 외환을 거래하나?', link:'#/articles/why-trade-forex' },
      { name:'마진거래 101: 마진계좌의 동작 원리', link:'#/articles/margin-101' }
    ]
  },
  { level:'Kindergarten', icon:'🧩', desc:'기초 개념',
    lessons:[
      { name:'포렉스 브로커 101', link:'#/articles/forex-brokers-101' },
      { name:'세 가지 분석 방법', link:'#/articles/three-types-of-analysis' },
      { name:'차트의 종류', link:'#/articles/types-of-charts' }
    ]
  },
  { level:'Elementary', icon:'📘', desc:'기술적 분석 I',
    lessons:[
      { name:'지지와 저항 레벨', link:'#/articles/support-resistance' },
      { name:'일본식 캔들', link:'#/articles/japanese-candlesticks' },
      { name:'피보나치', link:'#/articles/fibonacci' },
      { name:'이동평균', link:'#/articles/moving-averages' },
      { name:'인기 보조지표', link:'#/articles/popular-indicators' }
    ]
  },
  { level:'Middle School', icon:'🏫', desc:'기술적 분석 II',
    lessons:[
      { name:'오실레이터와 모멘텀 지표', link:'#/articles/oscillators' },
      { name:'중요 차트 패턴', link:'#/articles/chart-patterns' },
      { name:'피벗 포인트', link:'#/articles/pivot-points' }
    ]
  },
  { level:'Summer School', icon:'🌞', desc:'심화 도구',
    lessons:[
      { name:'헤이킨 아시', link:'#/articles/heikin-ashi' },
      { name:'엘리엇 파동이론', link:'#/articles/elliott-wave' },
      { name:'하모닉 패턴', link:'#/articles/harmonic-patterns' }
    ]
  },
  { level:'High School', icon:'🎯', desc:'거래 전략 I',
    lessons:[
      { name:'다이버전스 트레이딩', link:'#/articles/divergences' },
      { name:'시장 환경', link:'#/articles/market-environment' },
      { name:'돌파와 페이크아웃', link:'#/articles/breakouts-fakeouts' },
      { name:'펀더멘털 분석', link:'#/articles/fundamental-analysis' },
      { name:'통화 크로스', link:'#/articles/currency-crosses' },
      { name:'멀티 타임프레임 분석', link:'#/articles/mtf-analysis' }
    ]
  },
  { level:'대학 1학년', icon:'🧠', desc:'심리와 뉴스',
    lessons:[
      { name:'시장 심리', link:'#/articles/market-sentiment' },
      { name:'뉴스 트레이딩', link:'#/articles/trading-the-news' },
      { name:'캐리 트레이드', link:'#/articles/carry-trade' }
    ]
  },
  { level:'대학 2학년', icon:'🧭', desc:'시장 연동',
    lessons:[
      { name:'달러 인덱스', link:'#/articles/us-dollar-index' },
      { name:'인터마켓 상관관계', link:'#/articles/intermarket-correlations' },
      { name:'주식으로 FX 읽기', link:'#/articles/equities-to-trade-fx' },
      { name:'국가별 프로필', link:'#/articles/country-profiles' }
    ]
  },
  { level:'대학 3학년', icon:'🛠️', desc:'시스템 구축',
    lessons:[
      { name:'트레이딩 계획 수립', link:'#/articles/trading-plan' },
      { name:'나는 어떤 유형의 트레이더인가?', link:'#/articles/trader-types' },
      { name:'나만의 트레이딩 시스템 만들기', link:'#/articles/build-your-system' },
      { name:'트레이딩 저널 작성', link:'#/articles/trading-journal' },
      { name:'MetaTrader 4 사용법', link:'#/articles/mt4-howto' }
    ]
  },
  { level:'대학 4학년', icon:'🧮', desc:'리스크와 포지션',
    lessons:[
      { name:'리스크 관리', link:'#/articles/risk-management' },
      { name:'트레이더 파산의 1순위 원인', link:'#/articles/cause-of-death' },
      { name:'포지션 사이징', link:'#/articles/position-sizing' },
      { name:'손절(Stop Loss) 설정', link:'#/articles/stop-loss' },
      { name:'분할 진입·분할 청산', link:'#/articles/scaling' },
      { name:'통화 상관관계', link:'#/articles/currency-correlations' }
    ]
  },
  { level:'Graduation', icon:'🏆', desc:'마무리와 점검',
    lessons:[
      { name:'초보자가 가장 많이 하는 실수', link:'#/articles/common-mistakes' },
      { name:'포렉스 사기 유형', link:'#/articles/forex-scams' },
      { name:'성향 테스트', link:'#/articles/personality-quizzes' },
      { name:'졸업 연설', link:'#/articles/graduation-speech' }
    ]
  },
];

function klLoad(){ try{ return JSON.parse(localStorage.getItem(KL_KEY)||'{}'); }catch{return{}} }
function klSave(obj){ localStorage.setItem(KL_KEY, JSON.stringify(obj)); }

function ensureKLControls(){
  const host = document.getElementById('kl-syllabus');
  if (!host) return;
  if (document.getElementById('kl-controls')) return;

  const bar = document.createElement('div');
  bar.id = 'kl-controls';
  bar.className = 'card';
  bar.style.marginBottom = '14px';
  bar.innerHTML = `
    <div class="toolbar" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <input id="kl-q" class="search" placeholder="강의 검색…" style="min-width:220px">
      <button id="kl-expand" class="btn">전체 펼치기</button>
      <button id="kl-collapse" class="btn">전체 접기</button>
      <button id="kl-start" class="btn" style="font-weight:700">학습 시작</button>
    </div>
  `;
  host.parentElement.insertBefore(bar, host);

  document.getElementById('kl-q').oninput = (e)=>{ KL_QUERY = (e.target.value||'').toLowerCase(); renderKnowledgeLab(); };
  document.getElementById('kl-expand').onclick = ()=>{ document.querySelectorAll('.kl-level').forEach(s=>s.classList.remove('collapsed')); };
  document.getElementById('kl-collapse').onclick = ()=>{ document.querySelectorAll('.kl-level').forEach(s=>s.classList.add('collapsed')); };
  document.getElementById('kl-start').onclick = jumpToFirstIncomplete;
}

function renderKnowledgeLab(){
  const host = document.getElementById('kl-syllabus');
  if (!host) return;

  ensureKLControls();

  const progress = klLoad();
  const total = SYLLABUS.reduce((acc,g)=>acc+g.lessons.length,0);
  const done  = Object.values(progress).filter(Boolean).length;
  const pct   = total? Math.round(done/total*100) : 0;

  const bar = document.getElementById('kl-progress');
  const label = document.getElementById('kl-progress-label');
  const stats = document.getElementById('kl-stats');
  if (bar){ bar.style.width = pct+'%'; }
  if (label){ label.textContent = pct+'%'; }
  if (stats){ stats.textContent = `${done} / ${total} 강의`; }

  host.innerHTML = SYLLABUS.map(group=>{
    const lid = group.level.replace(/\s+/g,'-').toLowerCase();
    const list = group.lessons.map(item=>{
      const obj = typeof item === 'string' ? { name:item, link:'' } : item;
      const name = obj.name;
      const link = obj.link || '';
      const visible = !KL_QUERY || name.toLowerCase().includes(KL_QUERY) || group.level.toLowerCase().includes(KL_QUERY);
      const key = `${group.level}:${name}`;
      const isDone = !!progress[key];

      const start = link
        ? `<a class="kl-item ${isDone?'done':''}" href="${link}" ${link.startsWith('#')?'':'target="_blank" rel="noopener"'} data-key="${key}" style="${visible?'':'display:none'}">`
        : `<div class="kl-item ${isDone?'done':''}" data-key="${key}" style="${visible?'':'display:none'}">`;

      const end = link ? `</a>` : `</div>`;

      return `
        <div class="kl-item-row" style="${visible?'':'display:none'}">
          <button class="kl-dot-btn" data-key="${key}" aria-label="완료 표시" title="완료 표시" style="all:unset">
            <span class="kl-dot">${isDone?'✓':''}</span>
          </button>
          ${start}
            <div class="kl-name">${name}</div>
            <span class="kl-tag">Lesson</span>
          ${end}
        </div>
      `;
    }).join('');

    return `
      <section class="card kl-level" id="lv-${lid}">
        <div class="lv-head" data-toggle="#lv-${lid}">
          <span class="lv-badge">${group.icon}</span>
          <div class="lv-title">${group.level}</div>
          <div class="lv-sub">${group.desc}</div>
          <svg class="kl-toggle" width="14" height="14" viewBox="0 0 24 24" style="margin-left:8px;opacity:.8">
            <path d="M7 10l5 5 5-5" fill="none" stroke="#cfd6e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="kl-list">${list}</div>
      </section>
    `;
  }).join('');

  // 분류 접기/펼치기
  host.querySelectorAll('.lv-head').forEach(h=>{
    h.onclick = ()=>{
      const sec = document.querySelector(h.dataset.toggle);
      if (sec) sec.classList.toggle('collapsed');
    };
  });

  // 완료 체크: 왼쪽 점 버튼만 토글
  host.querySelectorAll('.kl-dot-btn').forEach(btn=>{
    btn.onclick = (e)=>{
      e.preventDefault();
      e.stopPropagation();
      const key = btn.dataset.key;
      const p = klLoad();
      p[key] = !p[key];
      klSave(p);
      renderKnowledgeLab();
    };
  });

  // 진행도 초기화
  const resetBtn = document.getElementById('kl-reset');
  if (resetBtn){
    resetBtn.onclick = ()=>{
      localStorage.removeItem(KL_KEY);
      renderKnowledgeLab();
    };
  }
}

function jumpToFirstIncomplete(){
  const progress = klLoad();
  for (const g of SYLLABUS){
    for (const item of g.lessons){
      const obj = typeof item === 'string' ? { name:item, link:'' } : item;
      const key = `${g.level}:${obj.name}`;
      if (!progress[key]){
        const lid = g.level.replace(/\s+/g,'-').toLowerCase();
        const sec = document.getElementById(`lv-${lid}`);
        if (sec) sec.classList.remove('collapsed');

        const row = [...document.querySelectorAll(`#lv-${lid} .kl-item-row`)]
          .find(e=>e.querySelector('[data-key]')?.dataset.key===key);
        if (row){
          row.scrollIntoView({behavior:'smooth', block:'center'});
          row.animate(
            [{boxShadow:'0 0 0 rgba(0,0,0,0)'},{boxShadow:'0 0 0 6px rgba(122,125,255,.25)'}],
            {duration:600, direction:'alternate', iterations:2}
          );
        }
        if (obj.link){
          if (obj.link.startsWith('#')) {
            location.hash = obj.link;
          } else {
            window.open(obj.link, '_blank', 'noopener');
          }
        }
        return;
      }
    }
  }
}

// -------- 라우터 구동 ----------
window.addEventListener('hashchange', async ()=>{
  const m = matchRoute();
  const routeId = m.id;
  show(routeId);

  if (routeId === 'daily-brief') renderDailyBriefList();
  if (routeId === 'daily-brief-detail') renderDailyBriefDetail(m.slug);

  if (routeId === 'trade-journal'){
    await loadAnalysesList();
    const s = document.getElementById('anal-search');
    const b = document.getElementById('anal-bias');
    if (s) s.oninput = renderAnalysesListFiltered;
    if (b) b.onchange = renderAnalysesListFiltered;
    await renderAnalysisDetailBySlug(currentSlugFromQuery());
  }

  if (routeId === 'knowledge-lab') renderKnowledgeLab();
});

document.addEventListener('DOMContentLoaded', async ()=>{
  const m = matchRoute();
  const routeId = m.id;
  show(routeId);

  if (routeId === 'daily-brief') renderDailyBriefList();
  if (routeId === 'daily-brief-detail') renderDailyBriefDetail(m.slug);

  if (routeId === 'trade-journal'){
    await loadAnalysesList();
    const s = document.getElementById('anal-search');
    const b = document.getElementById('anal-bias');
    if (s) s.oninput = renderAnalysesListFiltered;
    if (b) b.onchange = renderAnalysesListFiltered;
    await renderAnalysisDetailBySlug(currentSlugFromQuery());
  }

  if (routeId === 'knowledge-lab') renderKnowledgeLab();
});

function localizeKnowledgeLabKO(){
  const sec = document.querySelector('section[data-route="knowledge-lab"]');
  if (!sec) return;
  // 标题/副标题
  const h1 = sec.querySelector('.hero h1');
  if (h1) h1.textContent = '체계적 외환 지식 · 로드맵';
  const sub = sec.querySelector('.hero .muted');
  if (sub) sub.textContent = 'Preschool부터 Graduation까지, 아래에서 위로 쌓아 가는 체계적 학습 경로.';
  // 进度标题
  const progressTitle = sec.querySelector('.card h2');
  if (progressTitle && /进度|进度|总体|总体进度|整体|전체 진행도/.test(progressTitle.textContent)) {
    progressTitle.textContent = '전체 진행도';
  }
  // 重置按钮
  const resetBtn = sec.querySelector('#kl-reset, .progress-reset, .kl-reset');
  if (resetBtn) resetBtn.textContent = '진행도 초기화';

  // 控件区：占位与按钮（以防早期版本）
  const q = document.getElementById('kl-q');
  if (q) q.placeholder = '강의 검색…';
  const exp = document.getElementById('kl-expand');   if (exp) exp.textContent = '전체 펼치기';
  const col = document.getElementById('kl-collapse'); if (col) col.textContent = '전체 접기';
  const start = document.getElementById('kl-start');  if (start) start.textContent = '학습 시작';
}

// 进入知识页时调用一次（以及首次加载时）
window.addEventListener('hashchange', ()=>{
  if (location.hash === '#/knowledge-lab') localizeKnowledgeLabKO();
});
document.addEventListener('DOMContentLoaded', ()=>{
  if (!location.hash || location.hash === '#/knowledge-lab') localizeKnowledgeLabKO();
});
