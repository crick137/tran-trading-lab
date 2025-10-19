// ===== src/main.js (KO, preview + auto-open 1st, clickable lessons + News + Remote Syllabus) =====
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
    const res = await fetch('/api/daily-brief/index.json?_=' + Date.now());
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
    const res = await fetch(`/api/daily-brief/${slug}.json?_=${Date.now()}`);
    if (!res.ok) throw 0;
    const d = await res.json();
    wrap.innerHTML = `
      <div class="grid grid-12">
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
const AIDX = '/api/analyses/index.json';

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

    // 👉 URL에 slug가 없으면 첫 번째 항목을 자동으로 열고 미리보기 차트를 로드
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
    const d = await fetchJSON(`/api/analyses/${slug}.json`);
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

// ★ let으로 정의해 원격 데이터를 불러오면 덮어씌울 수 있도록 유지
let SYLLABUS = [
  {
    level: 'Starter · 입문 토대',
    icon: '🌱',
    desc: '외환 시장의 구조와 참여자를 이해합니다.',
    lessons: [
      { name: '외환거래란 무엇인가?', link: '#/articles/what-is-forex', type: '개념', duration: '5m', desc: '시장 규모와 참가자, 특징을 한눈에 정리합니다.' },
      { name: '외환은 어떻게 거래하나?', link: '#/articles/how-to-trade-forex', type: '개념', duration: '8m', desc: '주문·체결·레버리지·결제 구조를 이해합니다.' },
      { name: '언제 거래할 수 있나?', link: '#/articles/when-to-trade-forex', type: '세션', duration: '6m', desc: '주요 세션과 유동성 패턴을 살펴봅니다.' },
      { name: '누가 외환을 거래하나?', link: '#/articles/who-trades-forex', type: '개념', duration: '6m', desc: '중앙은행, 기관, 개인 트레이더의 역할과 동기.' },
      { name: '왜 외환을 거래하나?', link: '#/articles/why-trade-forex', type: '개념', duration: '7m', desc: '수익 구조와 FX가 적합한 전략을 정리합니다.' },
      { name: '마진거래 101: 마진계좌의 동작 원리', link: '#/articles/margin-101', type: '메커니즘', duration: '8m', desc: '마진, 레버리지, 마진콜 개념을 이해합니다.' }
    ]
  },
  {
    level: 'Framework · 기초 도구',
    icon: '🧰',
    desc: '분석을 위한 기본 도구와 프레임을 준비합니다.',
    lessons: [
      { name: '포렉스 브로커 101', link: '#/articles/forex-brokers-101', type: '도구', duration: '8m', desc: '브로커 선택과 규제 등급을 체크합니다.' },
      { name: '세 가지 분석 방법', link: '#/articles/three-types-of-analysis', type: '프레임', duration: '10m', desc: '기술·기본·심리 분석의 역할을 구분합니다.' },
      { name: '차트의 종류', link: '#/articles/types-of-charts', type: '도구', duration: '7m', desc: '라인, 바, 캔들 차트의 장단점을 비교합니다.' }
    ]
  },
  {
    level: 'Structure · 가격 구조',
    icon: '📘',
    desc: '구조와 밸류를 통해 시장의 뼈대를 읽습니다.',
    lessons: [
      { name: '지지와 저항 레벨', link: '#/articles/support-resistance', type: '구조', duration: '10m', desc: '핵심 레벨을 정의하고 반응 전략을 세웁니다.' },
      { name: '일본식 캔들', link: '#/articles/japanese-candlesticks', type: '구조', duration: '12m', desc: '캔들 모양으로 심리와 흐름을 해석합니다.' },
      { name: '피보나치', link: '#/articles/fibonacci', type: '도구', duration: '9m', desc: '황금비를 활용해 되돌림과 확장 목표를 찾습니다.' },
      { name: '이동평균', link: '#/articles/moving-averages', type: '도구', duration: '8m', desc: '추세 판단과 평균선 조합을 설계합니다.' },
      { name: '인기 보조지표', link: '#/articles/popular-indicators', type: '도구', duration: '9m', desc: 'MACD·RSI 등 지표와 구조를 결합합니다.' }
    ]
  },
  {
    level: 'Pattern · 패턴 확장',
    icon: '🌀',
    desc: '가격 패턴과 모멘텀을 확장해 해석합니다.',
    lessons: [
      { name: '오실레이터와 모멘텀 지표', link: '#/articles/oscillators', type: '구조', duration: '9m', desc: '모멘텀 신호의 장단점을 이해합니다.' },
      { name: '중요 차트 패턴', link: '#/articles/chart-patterns', type: '구조', duration: '11m', desc: '깃발·쐐기·헤드앤숄더 패턴을 적용합니다.' },
      { name: '피벗 포인트', link: '#/articles/pivot-points', type: '도구', duration: '7m', desc: '일중 지지·저항을 빠르게 파악합니다.' }
    ]
  },
  {
    level: 'Liquidity · 유동성 관점',
    icon: '🌊',
    desc: '스마트 머니 관점에서 가격을 바라봅니다.',
    lessons: [
      { name: '헤이킨 아시', link: '#/articles/heikin-ashi', type: '유동성', duration: '7m', desc: '노이즈를 낮추고 추세 뼈대를 포착합니다.' },
      { name: '엘리엇 파동 기초', link: '#/articles/elliott-wave', type: '유동성', duration: '12m', desc: '파동 구조로 방향과 템포를 해석합니다.' },
      { name: '하모닉 패턴', link: '#/articles/harmonic-patterns', type: '유동성', duration: '14m', desc: '비율과 조합으로 고확률 구역을 찾습니다.' }
    ]
  },
  {
    level: 'Strategy · 전략 설계',
    icon: '🎯',
    desc: '구조·유동성·펀더멘털을 실행 전략으로 묶습니다.',
    lessons: [
      { name: '다이버전스 트레이딩', link: '#/articles/divergences', type: '전략', duration: '10m', desc: '모멘텀과 가격의 괴리를 활용한 진입 로직.' },
      { name: '시장 환경', link: '#/articles/market-environment', type: '전략', duration: '8m', desc: '추세·박스·전환 국면을 구분하고 대응합니다.' },
      { name: '돌파와 페이크아웃', link: '#/articles/breakouts-fakeouts', type: '전략', duration: '9m', desc: '신뢰할 수 있는 돌파 조건과 필터를 정의합니다.' },
      { name: '펀더멘털 분석', link: '#/articles/fundamental-analysis', type: '전략', duration: '12m', desc: '경제 지표와 중앙은행 시나리오를 전략에 반영합니다.' },
      { name: '통화 크로스', link: '#/articles/currency-crosses', type: '전략', duration: '8m', desc: '교차 통화로 헤지와 상대 강도를 활용합니다.' },
      { name: '멀티 타임프레임 분석', link: '#/articles/mtf-analysis', type: '전략', duration: '7m', desc: '상·하위 주기를 동기화해 정보 단절을 방지합니다.' }
    ]
  },
  {
    level: 'Mindset · 심리와 인사이트',
    icon: '🧠',
    desc: '심리와 정보 노이즈를 관리해 실행력을 지킵니다.',
    lessons: [
      { name: '시장 심리', link: '#/articles/market-sentiment', type: '심리', duration: '8m', desc: '극단적 심리와 자금 흐름을 해석합니다.' },
      { name: '뉴스 트레이딩', link: '#/articles/trading-the-news', type: '인사이트', duration: '10m', desc: '지표 발표 전후 준비와 실행을 정리합니다.' },
      { name: '캐리 트레이드', link: '#/articles/carry-trade', type: '전략', duration: '9m', desc: '금리 차이를 활용한 중장기 운용 전략.' }
    ]
  },
  {
    level: 'Macro Mesh · 거시 연결',
    icon: '🧭',
    desc: '크로스 마켓 관점으로 통화를 읽습니다.',
    lessons: [
      { name: '달러 인덱스', link: '#/articles/us-dollar-index', type: '거시', duration: '8m', desc: 'DXY가 주요 통화에 주는 영향을 이해합니다.' },
      { name: '인터마켓 상관관계', link: '#/articles/intermarket-correlations', type: '거시', duration: '10m', desc: '채권·주식·원자재의 연동 신호를 해석합니다.' },
      { name: '주식으로 FX 읽기', link: '#/articles/equities-to-trade-fx', type: '거시', duration: '7m', desc: '섹터/대표 종목으로 FX 시나리오를 검증합니다.' },
      { name: '국가별 프로필', link: '#/articles/country-profiles', type: '거시', duration: '9m', desc: 'GDP·물가·정책 변수로 통화 특성을 파악합니다.' }
    ]
  },
  {
    level: 'System Lab · 시스템 구축',
    icon: '🛠️',
    desc: '재현 가능한 프로세스와 기록 시스템을 만듭니다.',
    lessons: [
      { name: '트레이딩 계획 수립', link: '#/articles/trading-plan', type: '시스템', duration: '10m', desc: '목표·프로세스·평가 체계를 문서화합니다.' },
      { name: '나는 어떤 유형의 트레이더인가?', link: '#/articles/trader-types', type: '시스템', duration: '7m', desc: '리듬과 전략에 맞는 타입을 점검합니다.' },
      { name: '나만의 트레이딩 시스템 만들기', link: '#/articles/build-your-system', type: '시스템', duration: '12m', desc: '규칙을 실행 가능한 플레이북으로 정리합니다.' },
      { name: '트레이딩 저널 작성', link: '#/articles/trading-journal', type: '시스템', duration: '8m', desc: '기록을 통해 피드백 루프를 설계합니다.' },
      { name: 'MetaTrader 4 사용법', link: '#/articles/mt4-howto', type: '도구', duration: '9m', desc: '자주 쓰는 기능과 단축키를 익힙니다.' }
    ]
  },
  {
    level: 'Risk Engine · 리스크 매트릭스',
    icon: '🧮',
    desc: '리스크 통제, 포지션 설계, 자금 곡선을 관리합니다.',
    lessons: [
      { name: '리스크 관리', link: '#/articles/risk-management', type: '리스크', duration: '9m', desc: '지표로 리스크를 측정하고 경계를 세웁니다.' },
      { name: '트레이더 파산의 1순위 원인', link: '#/articles/cause-of-death', type: '리스크', duration: '6m', desc: '자주 반복되는 위험 누적 패턴을 인지합니다.' },
      { name: '포지션 사이징', link: '#/articles/position-sizing', type: '리스크', duration: '8m', desc: '계좌 규모와 R 값을 활용해 포지션을 계산합니다.' },
      { name: '손절(Stop Loss) 설정', link: '#/articles/stop-loss', type: '리스크', duration: '7m', desc: '구조·변동성·시간 기반 손절 방식을 설계합니다.' },
      { name: '분할 진입·분할 청산', link: '#/articles/scaling', type: '리스크', duration: '7m', desc: '25/25/25/25 분할의 심리와 자금 관리.' },
      { name: '통화 상관관계', link: '#/articles/currency-correlations', type: '리스크', duration: '8m', desc: '상관관계를 이용해 중복 리스크를 줄입니다.' }
    ]
  },
  {
    level: 'Graduation · 점검과 복기',
    icon: '🏆',
    desc: '경험을 정리하고 함정을 경계하며 다음 단계를 설계합니다.',
    lessons: [
      { name: '초보자가 가장 많이 하는 실수', link: '#/articles/common-mistakes', type: '복기', duration: '7m', desc: '자주 반복되는 실수를 살펴보고 교정합니다.' },
      { name: '포렉스 사기 유형', link: '#/articles/forex-scams', type: '복기', duration: '6m', desc: '고수익 미끼와 폰지 구조를 판별합니다.' },
      { name: '성향 테스트', link: '#/articles/personality-quizzes', type: '복기', duration: '10m', desc: '내 성향과 보완할 지점을 진단합니다.' },
      { name: '졸업 연설', link: '#/articles/graduation-speech', type: '복기', duration: '6m', desc: '방법론을 정리하고 다음 성장 계획을 세웁니다.' }
    ]
  }
];

function klLoad(){ try{ return JSON.parse(localStorage.getItem(KL_KEY)||'{}'); }catch{return{}} }
function klSave(obj){ localStorage.setItem(KL_KEY, JSON.stringify(obj)); }

// ★ 원격 syllabus가 존재하면 위 배열을 덮어씁니다
let __syllabusLoaded = false;
async function tryLoadRemoteSyllabus(){
  if (__syllabusLoaded) return;
  __syllabusLoaded = true;
  try{
    const r = await fetch('/api/research/syllabus.json?_=' + Date.now());
    if (!r.ok) return;
    const j = await r.json();
    if (Array.isArray(j.syllabus) && j.syllabus.length){
      SYLLABUS = j.syllabus;
    }
  }catch{}
}

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
    const levelTitle = group.level || '';
    const lid = levelTitle.replace(/\s+/g,'-').toLowerCase();
    const groupDesc = group.desc || '';
    const levelTotal = Array.isArray(group.lessons) ? group.lessons.length : 0;
    const levelDone = Array.isArray(group.lessons) ? group.lessons.reduce((acc, item) => {
      const lesson = typeof item === 'string' ? { name:item } : item || {};
      const key = `${levelTitle}:${lesson.name}`;
      return progress[key] ? acc + 1 : acc;
    }, 0) : 0;
    const list = (group.lessons || []).map(item=>{
      const obj = typeof item === 'string' ? { name:item, link:'' } : item;
      const name = obj.name;
      const link = obj.link || '';
      const desc = obj.desc || '';
      const type = obj.type || '';
      const duration = obj.duration || '';
      const haystack = [name, levelTitle, type, desc].join(' ').toLowerCase();
      const visible = !KL_QUERY || haystack.includes(KL_QUERY);
      const key = `${levelTitle}:${name}`;
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
            <div class="kl-item-content">
              <div class="kl-name">${name}</div>
              ${desc ? `<p class="kl-desc">${desc}</p>` : ''}
            </div>
            <div class="kl-meta">
              ${type ? `<span class="kl-tag kl-type">${type}</span>` : ''}
              ${duration ? `<span class="kl-tag kl-duration">${duration}</span>` : ''}
            </div>
          ${end}
        </div>
      `;
    }).join('');

    return `
      <section class="card kl-level" id="lv-${lid}">
        <div class="lv-head" data-toggle="#lv-${lid}">
          <span class="lv-badge">${group.icon}</span>
          <div class="lv-title">${levelTitle}</div>
          <div class="lv-sub">${groupDesc}</div>
          <span class="lv-progress">${levelDone}/${levelTotal}</span>
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
    const level = g.level || '';
    const lid = level.replace(/\s+/g,'-').toLowerCase();
    for (const item of g.lessons){
      const obj = typeof item === 'string' ? { name:item, link:'' } : item;
      const key = `${level}:${obj.name}`;
      if (!progress[key]){
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

/* ===== Market News: render list (text version) ===== */
async function renderMarketNews(){
  const host = document.querySelector('section[data-route="market-news"] #news');
  if (!host) return;
  host.innerHTML = '<p class="muted">불러오는 중…</p>';
  try{
    const res = await fetch('/api/market-news/index.json?_=' + Date.now());
    const rows = await res.json(); // [{id}]
    if (!Array.isArray(rows) || !rows.length) {
      host.innerHTML = '<p class="muted">뉴스가 없습니다</p>';
      return;
    }
    const html = await Promise.all(rows.map(async r=>{
      try{
        const dres = await fetch(`/api/market-news/${encodeURIComponent(r.id)}.json?_=${Date.now()}`);
        const d = await dres.json();
        const bullets = (d.bullets||[]).map(b=>`<li>${b}</li>`).join('');
        const link = d.url ? `<a href="${d.url}" target="_blank" rel="noopener">원문 보기</a>` : '';
        const when = d.date ? new Date(d.date).toLocaleString() : '';
        return `
          <li class="card">
            <h3 style="margin:0 0 6px">${d.title||r.id}</h3>
            <p class="meta">${[d.source||'', when].filter(Boolean).join(' · ')}</p>
            ${d.summary?`<p style="margin:8px 0">${d.summary}</p>`:''}
            ${bullets?`<ul style="margin-top:6px">${bullets}</ul>`:''}
            <p class="muted" style="margin-top:8px">${(d.tags||[]).map(t=>`#${t}`).join(' ')}</p>
            ${link}
          </li>`;
      }catch{ return `<li class="card"><h3>${r.id}</h3></li>`; }
    }));
    host.innerHTML = `<ul style="display:grid;gap:12px">${html.join('')}</ul>`;
  }catch{
    host.innerHTML = '<p class="muted">불러오기에 실패했습니다</p>';
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

  if (routeId === 'market-news') renderMarketNews();

  if (routeId === 'knowledge-lab'){
    await tryLoadRemoteSyllabus();
    renderKnowledgeLab();
  }
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

  if (routeId === 'market-news') renderMarketNews();

  if (routeId === 'knowledge-lab'){
    await tryLoadRemoteSyllabus();
    renderKnowledgeLab();
  }
});

