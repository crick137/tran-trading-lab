// ===== src/main.js (KO, boards = left-image/right-title; Home restored to hero+feature cards) =====
import './styles/global.css'
import './components/x-tv-chart.js'
import './components/x-market-news.js'
import { DEFAULT_SYLLABUS } from '../data/syllabus.js'

/* ---------- 隐藏黑名单（方案A） ---------- */
const HIDE_SLUGS = new Set([
  'xauusd-h1-2025-10-31',  // ← 要隐藏的这条；继续加即可
]);

function makeSlugFromObj(x) {
  const sym  = (x.symbol || x.sym || '').toString().toLowerCase();
  const tf   = (x.tf || x.timeframe || '').toString().toLowerCase();
  const date = (x.date || x.day || '').toString().replaceAll(/[./]/g, '-');
  return (x.slug || [sym, tf, date].filter(Boolean).join('-')).toString();
}

function shouldHide(x) {
  const s = typeof x === 'string' ? x : makeSlugFromObj(x || {});
  return HIDE_SLUGS.has(s) || x?.hidden === true || x?.status === 'deleted';
}

// 兜底：即使脚本后续步骤没跑，也强制把这些 data-slug 隐藏
(function injectHideStyle() {
  if (!HIDE_SLUGS.size) return;
  const css = [...HIDE_SLUGS].map(s => `[data-slug="${s}"]{display:none!important}`).join('');
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
})();
/* -------------------------------------- */

const routes = {
  '': 'home',
  '#/': 'home',
  '#/daily-brief': 'daily-brief',
  '#/trade-journal': 'trade-journal',   // 공개 분석
  '#/knowledge-lab': 'knowledge-lab',
  '#/market-news': 'market-news',
  '#/articles': 'articles',
  '#/about': 'about',
};

const outlet = document.getElementById('app');

function setActive(){
  const hash = location.hash || '#/';
  document.querySelectorAll('.nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if (!href) return;
    const isHomeLink = href === '#/' || href === '#';
    const normalizedHash = hash || '#/';
    const active = isHomeLink
      ? (!location.hash || normalizedHash === '#/' || normalizedHash === '#')
      : normalizedHash.startsWith(href);
    a.classList.toggle('active', active);
  });
}

// ---- 数据缓存 ----
let dailyBriefIndexCache = null;
const dailyBriefCache = new Map();
let analysesIndexCache = null;
const analysesDetailCache = new Map();
let marketNewsIndexCache = null;
const marketNewsCache = new Map();
let articlesIndexCache = null;
const articlesDetailCache = new Map();

// ---- 通用规范化工具 ----
function sanitizeSlug(v){ return String(v||'').replace(/[\\/]+/g, '-'); }

// -------- 路由匹配 ----------
function matchRoute() {
  const raw = location.hash || '#/';
  const detailDaily = raw.match(/^#\/daily-brief\/([\w-]+)$/);
  if (detailDaily) return { id: 'daily-brief-detail', slug: decodeURIComponent(detailDaily[1]) };
  const detailNews = raw.match(/^#\/market-news\/([\w-]+)$/);
  if (detailNews) return { id: 'market-news-detail', slug: decodeURIComponent(detailNews[1]) };
  const detailArticle = raw.match(/^#\/articles\/([\w%-]+)$/);
  if (detailArticle) return { id: 'article-detail', slug: decodeURIComponent(detailArticle[1]) };
  const detailJournal = raw.match(/^#\/trade-journal\/([\w%-]+)$/);
  if (detailJournal) return { id: 'trade-journal-detail', slug: decodeURIComponent(detailJournal[1]) };
  const base = raw.includes('?') ? raw.split('?')[0] : raw;
  return { id: (routes[base] || 'home'), slug: '' };
}

// ===================== 公用工具（媒体列表） =====================
function _esc(s){ return String(s??'')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

function _mediaItem({href, title, desc, meta, img}){
  return `
    <li class="media-item">
      ${img ? `<a class="media-thumb" href="${href}"><img src="${_esc(img)}" alt="${_esc(title)}" loading="lazy"></a>` : ''}
      <div class="media-body">
        <a class="media-title" href="${href}">${_esc(title)}</a>
        ${desc ? `<p class="media-desc">${_esc(desc)}</p>` : ''}
        ${meta ? `<div class="media-meta">${_esc(meta)}</div>` : ''}
      </div>
    </li>
  `;
}

// ===================== 主页（恢复原样：Hero + 功能卡片） =====================
function renderHomeView(){
  outlet.innerHTML = `
    <section aria-labelledby="home-hero-title">
      <div class="hero">
        <div class="badge">TRAN TRADING LAB</div>
        <h1 id="home-hero-title">매일 더 똑똑하게, 더 가볍게 시장을 읽다</h1>
        <p>한 눈에 들어오는 데일리 브리프, 구조적 분석, 지식 탐구, 그리고 글로벌 마켓 뉴스.</p>
      </div>

      <div class="feature-grid home-feature-grid" role="list">
        <a href="#/daily-brief" class="card" role="listitem" aria-label="데일리 브리프로 이동">
          <span class="glow" aria-hidden="true"></span>
          <div class="title">
            <span class="icon-wrap" aria-hidden="true">
              <svg class="icon" viewBox="0 0 24 24">
                <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#66e0ff" /><stop offset="1" stop-color="#7a7dff" />
                </linearGradient></defs>
                <g class="float">
                  <line x1="6" y1="4" x2="6" y2="20" class="stroke" />
                  <rect x="4.5" y="9" width="3" height="6" rx="1.2" fill="url(#grad)" />
                </g>
                <g class="float" style="animation-delay:.2s">
                  <line x1="12" y1="6" x2="12" y2="18" class="stroke" />
                  <rect x="10.5" y="8" width="3" height="5" rx="1.2" fill="url(#grad)" />
                </g>
                <g class="float" style="animation-delay:.4s">
                  <line x1="18" y1="3" x2="18" y2="21" class="stroke" />
                  <rect x="16.5" y="11" width="3" height="6" rx="1.2" fill="url(#grad)" />
                </g>
              </svg>
            </span>데일리 브리프
          </div>
          <p>매일 아침 시장을 읽는 시간.</p>
        </a>

        <a href="#/trade-journal" class="card" role="listitem" aria-label="분석 아카이브로 이동">
          <span class="glow" aria-hidden="true"></span>
          <div class="title">
            <span class="icon-wrap" aria-hidden="true">
              <svg class="icon" viewBox="0 0 24 24">
                <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#66e0ff" /><stop offset="1" stop-color="#7a7dff" />
                </linearGradient></defs>
                <polyline class="stroke" points="2,16 7,10 11,13 15,7 22,12" />
                <circle cx="7" cy="10" r="1.6" fill="url(#grad)" class="pulse" />
              </svg>
            </span>분석 아카이브
          </div>
          <p>지지·저항과 시나리오를 공개 기록한 라이브러리.</p>
        </a>

        <a href="#/knowledge-lab" class="card" role="listitem" aria-label="지식 연구소로 이동">
          <span class="glow" aria-hidden="true"></span>
          <div class="title">
            <span class="icon-wrap" aria-hidden="true">
              <svg class="icon" viewBox="0 0 24 24">
                <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#66e0ff" /><stop offset="1" stop-color="#7a7dff" />
                </linearGradient></defs>
                <g class="spin">
                  <circle cx="12" cy="12" r="6" class="stroke" />
                  <path d="M12 6v-2M12 20v-2M6 12H4M20 12h-2M16.2 7.8l1.4-1.4M6.4 18.6l1.4-1.4M7.8 7.8 6.4 6.4M17.6 17.6l-1.4-1.4" class="stroke" />
                </g>
              </svg>
            </span>지식 연구소
          </div>
          <p>Preschool부터 Graduation까지 단계별 로드맵.</p>
        </a>

        <a href="#/market-news" class="card" role="listitem" aria-label="마켓 뉴스로 이동">
          <span class="glow" aria-hidden="true"></span>
          <div class="title">
            <span class="icon-wrap" aria-hidden="true">
              <svg class="icon" viewBox="0 0 24 24">
                <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#66e0ff" /><stop offset="1" stop-color="#7a7dff" />
                </linearGradient></defs>
                <rect x="3" y="5" width="18" height="14" rx="2" class="stroke" />
                <line x1="6" y1="10" x2="18" y2="10" class="stroke" style="animation-delay:.3s" />
                <line x1="6" y1="14" x2="15" y2="14" class="stroke" style="animation-delay:.6s" />
              </svg>
            </span>마켓 뉴스
          </div>
          <p>글로벌 거시 이벤트와 핵심 포인트 요약.</p>
        </a>

        <a href="#/articles" class="card" role="listitem" aria-label="아티클로 이동">
          <span class="glow" aria-hidden="true"></span>
          <div class="title">
            <span class="icon-wrap" aria-hidden="true">
              <svg class="icon" viewBox="0 0 24 24">
                <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#66e0ff" /><stop offset="1" stop-color="#7a7dff" />
                </linearGradient></defs>
                <path d="M3 20l5-1 11-11a2.5 2.5 0 0 0-3.5-3.5L4.5 15l-1.5 5z" class="stroke" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="url(#grad)" class="pulse" />
              </svg>
            </span>아티클
          </div>
          <p>거래 사고, 리스크 복기, 전략 인사이트 모음.</p>
        </a>

        <a href="#/about" class="card" role="listitem" aria-label="About로 이동">
          <span class="glow" aria-hidden="true"></span>
          <div class="title">
            <span class="icon-wrap" aria-hidden="true">
              <svg class="icon" viewBox="0 0 24 24">
                <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#66e0ff" /><stop offset="1" stop-color="#7a7dff" />
                </linearGradient></defs>
                <circle cx="12" cy="12" r="8" class="stroke" />
                <polygon points="12,7 9,15 12,13 15,15" fill="url(#grad)" class="float" />
              </svg>
            </span>About
          </div>
          <p>TRAN TRADING LAB의 철학과 다음 목표.</p>
        </a>
      </div>
    </section>
  `;
  window.__registerCards?.(outlet);
}

// ===================== 其它页面渲染 =====================
function renderTradeJournalDetailView(){
  outlet.innerHTML = `
    <section aria-label="거래 분석 상세">
      <article class="card" id="anal-detail" style="padding:24px"></article>
      <p class="muted" style="margin-top:12px"><a href="#/trade-journal">← 목록으로</a></p>
    </section>
  `;
  window.__registerCards?.(outlet);
}

/* ========== Daily Brief 列表页：左图右标题 ========== */
function renderDailyBriefListView(){
  outlet.innerHTML = `
    <section aria-labelledby="daily-brief-title" data-route="daily-brief">
      <div class="card">
        <h2 id="daily-brief-title">데일리 브리프</h2>
        <ul id="brief-list" class="media-list"><li class="media-empty">불러오는 중…</li></ul>
      </div>
    </section>
  `;
  window.__registerCards?.(outlet);
}

function renderDailyBriefDetailView(){
  outlet.innerHTML = `
    <section aria-live="polite">
      <div id="daily-brief-detail"></div>
    </section>
  `;
}

/* ========== Trade Journal 列表视图（保持原样） ========== */
function renderTradeJournalView(){
  outlet.innerHTML = `
    <section aria-labelledby="journal-title" data-route="trade-journal">
      <div class="grid grid-12">
        <section class="card" style="grid-column: span 12;">
          <div class="toolbar">
            <h2 id="journal-title" style="margin:0">분석 목록</h2>
            <input id="anal-search" class="search" placeholder="심볼·태그·제목 검색" aria-label="검색" />
            <select id="anal-bias" class="search" aria-label="관점 필터">
              <option value="">전체 관점</option>
              <option value="bullish">상승</option>
              <option value="bearish">하락</option>
              <option value="neutral">중립</option>
            </select>
          </div>
          <div id="anal-list" aria-live="polite"></div>
        </section>
      </div>
    </section>
  `;
  window.__registerCards?.(outlet);
}

function renderKnowledgeLabView(){
  outlet.innerHTML = `
    <section aria-labelledby="kl-hero-title">
      <div class="hero">
        <div class="badge">Knowledge Lab</div>
        <h1 id="kl-hero-title">체계적인 외환 지식 로드맵</h1>
        <p class="muted">Preschool부터 Graduation까지, 전략·구조·복기를 단계적으로 쌓아 올립니다.</p>
      </div>

      <div class="card" style="margin-bottom:14px">
        <div class="row" style="justify-content:space-between;align-items:center">
          <h2 style="margin:0">전체 진행도</h2>
          <button id="kl-reset" class="btn" style="padding:6px 10px;font-weight:600">진행도 초기화</button>
        </div>
        <div class="progress-wrap" aria-label="전체 진행도">
          <div id="kl-progress" class="progress-bar">
            <span id="kl-progress-label" aria-live="polite">0%</span>
          </div>
        </div>
        <p class="meta" id="kl-stats" aria-live="polite">0 / 0 강의</p>
      </div>

      <div id="kl-syllabus" class="kl-grid" aria-live="polite"></div>
    </section>
  `;
  window.__registerCards?.(outlet);
}

/* ========== Market News 列表页：左图右标题 ========== */
function renderMarketNewsView(){
  outlet.innerHTML = `
    <section aria-labelledby="news-title" data-route="market-news">
      <div class="card">
        <h2 id="news-title">마켓 뉴스</h2>
        <x-market-news></x-market-news>
      </div>
    </section>
  `;
  window.__registerCards?.(outlet);
}

/* ========== Articles 列表页：左图右标题 ========== */
function renderArticlesView(){
  outlet.innerHTML = `
    <section aria-labelledby="articles-title" data-route="articles">
      <div class="card">
        <h2 id="articles-title">아티클</h2>
        <ul id="articles-list" class="media-list"><li class="media-empty">불러오는 중…</li></ul>
      </div>
    </section>
  `;
  window.__registerCards?.(outlet);
}

function renderArticleDetailView(){
  outlet.innerHTML = `
    <section aria-live="polite">
      <div id="article-detail"></div>
    </section>
  `;
  window.__registerCards?.(outlet);
}

// ===== 通用工具 =====
function escapeHtml(text){
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== Articles 数据 =====
async function loadArticleDetail(slug){
  if (!slug) throw new Error('INVALID_SLUG');
  const safe = sanitizeSlug(slug);
  if (!articlesDetailCache.has(safe)){
    const res = await fetch(`/api/research/articles/${encodeURIComponent(safe)}.json?_=${Date.now()}`);
    if (!res.ok) throw new Error('NOT_FOUND');
    const data = await res.json();
    articlesDetailCache.set(safe, data || {});
  }
  return articlesDetailCache.get(safe) || {};
}

/* ========== Articles 列表渲染（媒体列表） ========== */
async function renderArticlesList(){
  const host = document.getElementById('articles-list');
  if (!host) return;
  host.innerHTML = '<li class="media-empty">불러오는 중…</li>';
  try{
    const res = await fetch('/api/research/articles/index.json?_=' + Date.now());
    const data = await res.json();
    articlesIndexCache = Array.isArray(data) ? data : [];
    const slugs = articlesIndexCache
      .map(item => typeof item === 'string' ? item : (item && item.slug) ? item.slug : '')
      .map(sanitizeSlug)
      .filter(Boolean).slice(0, 60);

    if (!slugs.length){ host.innerHTML = '<li class="media-empty">등록된 아티클이 없습니다</li>'; return; }

    const rows = await Promise.all(slugs.map(async slug=>{
      try{
        const d = await loadArticleDetail(slug);
        const meta = [d.date ? new Date(d.date).toLocaleDateString() : '', Array.isArray(d.tags)? d.tags.slice(0,3).map(t=>`#${t}`).join(' ') : ''].filter(Boolean).join(' · ');
        const safeSlug = sanitizeSlug(slug);
        return _mediaItem({
          href: `#/articles/${encodeURIComponent(safeSlug)}`,
          title: d.title || slug,
          desc: d.excerpt || (d.body ? String(d.body).slice(0,120)+'…' : ''),
          meta,
          img: d.hero || d.image || ''
        });
      }catch{ return null; }
    }));

    host.innerHTML = rows.filter(Boolean).join('') || '<li class="media-empty">등록된 아티클이 없습니다</li>';
  }catch{
    host.innerHTML = '<li class="media-empty">아티클을 불러오지 못했습니다</li>';
  }
}

/* ========== Article 详情 ========== */
async function renderArticleDetail(slug){
  const host = document.getElementById('article-detail');
  if (!host) return;
  if (!slug){
    host.innerHTML = `<div class="card"><h2>유효한 슬러그가 필요합니다</h2><p class="muted" style="margin-top:8px"><a href="#/articles">← 목록으로</a></p></div>`;
    window.__registerCards?.(host); return;
  }
  host.innerHTML = `<div class="card"><h2>불러오는 중…</h2></div>`;
  try{
    const detail = await loadArticleDetail(sanitizeSlug(slug));
    const title = detail?.title || slug;
    const date = detail?.date ? new Date(detail.date).toLocaleString() : '';
    const tags = Array.isArray(detail?.tags) && detail.tags.length ? detail.tags.map(t=>`#${t}`).join(' ') : '';
    const body = detail?.body || '';
    const paragraphs = body
      ? body.split(/\n{2,}/).map(block=>`<p>${escapeHtml(block).replace(/\n/g, '<br/>')}</p>`).join('')
      : '<p>내용이 없습니다.</p>';
    host.innerHTML = `
      <article class="card" style="padding:24px">
        <h2 style="margin:0 0 8px">${escapeHtml(title)}</h2>
        <p class="muted">${[date, tags].filter(Boolean).join(' · ')}</p>
        ${detail?.hero ? `<img src="${detail.hero}" alt="${escapeHtml(title)}" style="width:100%;border-radius:12px;margin:18px 0;">` : ''}
        <div class="article-body" style="display:flex;flex-direction:column;gap:12px">${paragraphs}</div>
        <p class="muted" style="margin-top:16px"><a href="#/articles">← 아티클 목록으로</a></p>
      </article>
    `;
    window.__registerCards?.(host);
  }catch(e){
    host.innerHTML = `<div class="card"><h2>아티클을 불러올 수 없습니다</h2><p class="muted">${escapeHtml(e?.message || '')}</p><p class="muted" style="margin-top:8px"><a href="#/articles">← 목록으로</a></p></div>`;
    window.__registerCards?.(host);
  }
}

/* ========== About ========== */
function renderAboutView(){
  outlet.innerHTML = `
    <section aria-labelledby="about-hero-title">
      <div class="hero">
        <div class="badge">About TRAN</div>
        <h1 id="about-hero-title">나는 ‘구조로 시장을 읽는 사람’입니다</h1>
        <p class="muted">숫자보다 맥락, 운보다 준비. TRAN TRADING LAB의 출발과 원칙, 그리고 다음 여정을 기록합니다.</p>
      </div>

      <div class="feature-grid">
        <section class="card" aria-labelledby="about-start">
          <h2 id="about-start">어디서 시작됐나</h2>
          <p>시장은 처음엔 ‘정답 맞히기’ 같았습니다. 올라갈까? 내려갈까? 수많은 실패가 알려준 건 <strong>가격은 결과</strong>, <strong>구조는 이유</strong>라는 사실. 그래서 차트를 사진이 아닌 <em>사건과 흔적의 연속</em>으로 읽기 시작했습니다.</p>
          <p class="muted">— “가격은 마지막 문장, 문법은 구조다.”</p>
        </section>

        <section class="card" aria-labelledby="about-turning">
          <h2 id="about-turning">전환점</h2>
          <ul>
            <li><strong>Loss Journal</strong> — 손실을 숨기지 않고 기록, ‘왜?’를 집요하게 추적.</li>
            <li><strong>Structure First</strong> — HH/HL/LL/LH, BOS·CHoCH, FVG·OB로 맥락 정리.</li>
            <li><strong>Risk Engine</strong> — 1~2% 고정 리스크, 25/25/25/25 분할, 일일 DD 제한.</li>
            <li><strong>공개 분석</strong> — 기록을 밖으로 내보내자 피드백이 들어오고 더 단단해짐.</li>
          </ul>
        </section>

        <section class="card" aria-labelledby="about-rules">
          <h2 id="about-rules">내가 지키는 다섯 가지 원칙</h2>
          <ol>
            <li><strong>구조 &gt; 시그널</strong> — 신호는 구조 위에서만 의미가 있다.</li>
            <li><strong>시나리오 2개</strong> — 주 시나리오와 반대 시나리오를 모두 적는다.</li>
            <li><strong>트리거는 단순하게</strong> — 엔트리·SL·TP는 숫자로 명확하게.</li>
            <li><strong>리스크가 먼저</strong> — 감정보다 규칙을 우선한다.</li>
            <li><strong>기록은 자산</strong> — 좋은 손실은 다음 승리를 위한 조건이다.</li>
          </ol>
        </section>

        <section class="card" aria-labelledby="about-next">
          <h2 id="about-next">지금과 다음</h2>
          <p>지금 나는 매일 <strong>데일리 브리프</strong>로 시장을 정리하고, <strong>분석 아카이브</strong>에 관점과 레벨을 공개합니다. 다음 목표는 <strong>자동화 체크리스트</strong>와 <strong>백테스트-라이브 일체화</strong> 워크플로우를 구축해 누구나 재현 가능한 시스템을 만드는 것입니다.</p>
        </section>

        <section class="card" aria-labelledby="about-one-line">
          <h2 id="about-one-line">한 문장으로</h2>
          <blockquote style="margin:8px 0 0; color:#cfd6e3">
            “큰 수익은 <strong>예측</strong>이 아니라 <strong>반응</strong>에서 나온다.
            준비된 원칙으로 <em>천천히</em>, 그러나 <em>끊임없이</em>.”
          </blockquote>
        </section>

        <section class="card" aria-labelledby="about-socials">
          <h2 id="about-socials">채널 & 커뮤니티</h2>
          <p class="muted" style="margin:6px 0 14px">실시간 브리프, 공개 분석, 투표와 Q&A는 여기서 이어집니다.</p>
          <div class="socials">
            <a class="btn" href="https://x.com/TranTradingLab" target="_blank" rel="noopener">X / Twitter @TranTradingLab</a>
            <a class="btn" href="https://t.me/http4477" target="_blank" rel="noopener">Telegram 채널</a>
            <a class="btn" href="https://whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t" target="_blank" rel="noopener">WhatsApp 채널</a>
          </div>
          <p class="muted" style="margin-top:10px">— 하루를 가볍게 시작하는 가장 빠른 길.</p>
        </section>
      </div>
    </section>
  `;
  window.__registerCards?.(outlet);
}

// ===== 数据与工具 =====
async function renderRoute(routeId, slug){
  window.scrollTo({ top: 0, behavior: 'auto' });
  switch (routeId) {
    case 'home':
      renderHomeView(); break;

    case 'daily-brief':
      renderDailyBriefListView();
      await renderDailyBriefList();
      break;
    case 'daily-brief-detail':
      renderDailyBriefDetailView();
      await renderDailyBriefDetail(slug);
      break;

    case 'trade-journal':
      renderTradeJournalView();
      await loadAnalysesList();
      {
        const search = document.getElementById('anal-search');
        const bias = document.getElementById('anal-bias');
        if (search) search.oninput = renderAnalysesListFiltered;
        if (bias) bias.onchange = renderAnalysesListFiltered;
      }
      break;
    case 'trade-journal-detail':
      renderTradeJournalDetailView();
      await renderAnalysisDetailBySlug(slug);
      break;

    case 'knowledge-lab':
      renderKnowledgeLabView();
      await tryLoadRemoteSyllabus();
      renderKnowledgeLab();
      break;

    case 'market-news':
      renderMarketNewsView();
      break;
    case 'market-news-detail':
      renderMarketNewsDetailView();
      await renderMarketNewsDetail(slug);
      break;

    case 'articles':
      renderArticlesView();
      await renderArticlesList();
      break;
    case 'article-detail':
      renderArticleDetailView();
      await renderArticleDetail(slug);
      break;

    case 'about':
      renderAboutView();
      break;
    default:
      renderHomeView();
  }
  window.__registerCards?.(outlet);
}

// ===== Daily Brief 列表（媒体列表） =====
async function renderDailyBriefList(){
  const ul = document.getElementById('brief-list');
  if (!ul) return;
  ul.innerHTML = '<li class="media-empty">불러오는 중…</li>';
  try{
    if (!dailyBriefIndexCache){
      const res = await fetch('/api/daily-brief/index.json?_=' + Date.now());
      const items = await res.json();
      if (Array.isArray(items)) dailyBriefIndexCache = items;
    }
    const ids = (Array.isArray(dailyBriefIndexCache) ? dailyBriefIndexCache : []).slice(0,60);
    if (!ids.length){ ul.innerHTML = '<li class="media-empty">자료가 없습니다</li>'; return; }

    const rows = await Promise.all(ids.map(async id=>{
      try{
        if (!dailyBriefCache.has(id)){
          const r = await fetch(`/api/daily-brief/${encodeURIComponent(id)}.json?_=${Date.now()}`);
          dailyBriefCache.set(id, await r.json());
        }
        const d = dailyBriefCache.get(id) || {};
        return _mediaItem({
          href: `#/daily-brief/${encodeURIComponent(id)}`,
          title: d.title || id,
          desc: (Array.isArray(d.bullets) && d.bullets[0]) ? d.bullets[0] : '',
          meta: d.date || id,
          img: d.hero || d.image || (d.chart && d.chart.thumb) || ''
        });
      }catch{ return null; }
    }));

    ul.innerHTML = rows.filter(Boolean).join('') || '<li class="media-empty">자료가 없습니다</li>';
  }catch{
    ul.innerHTML = '<li class="media-empty">불러오기 실패</li>';
  }
}

// ===== Daily Brief 详情 =====
async function renderDailyBriefDetail(slug){
  const wrap = document.getElementById('daily-brief-detail');
  if (!wrap) return;
  if (!slug){
    wrap.innerHTML = `<div class="card"><h2>유효한 슬러그가 필요합니다</h2><p class="muted" style="margin-top:8px"><a href="#/daily-brief">← 목록으로</a></p></div>`;
    window.__registerCards?.(wrap); return;
  }
  wrap.innerHTML = `<div class="card"><h2>불러오는 중…</h2></div>`;
  try {
    if (!dailyBriefCache.has(slug)){
      const res = await fetch(`/api/daily-brief/${slug}.json?_=${Date.now()}`);
      if (!res.ok) throw 0;
      const data = await res.json();
      dailyBriefCache.set(slug, data);
    }
    const d = dailyBriefCache.get(slug) || {};
    wrap.innerHTML = `
      <div class="grid grid-12">
        <section class="card" style="grid-column: span 8;">
          <h2>${escapeHtml(d.title || 'Daily Brief')}</h2>
          <p class="muted">매일 아침 시장을 읽는 시간</p>
          ${d.bullets?.length?`<h3>📌 핵심 요약</h3><ul>${d.bullets.map(i=>`<li>${escapeHtml(i)}</li>`).join('')}</ul>`:''}
          ${d.schedule?.length?`<h3 style="margin-top:12px">🕒 오늘 일정</h3><ul>${d.schedule.map(i=>`<li>${escapeHtml(i)}</li>`).join('')}</ul>`:''}
        </section>
        <aside class="card" style="grid-column: span 4;">
          <h2>퀵 차트</h2>
          <x-tv-chart symbol="${escapeHtml((d.chart && d.chart.symbol) || d.symbol || 'FX:XAUUSD')}" interval="${escapeHtml((d.chart && d.chart.interval) || d.interval || '60')}" ratio="16:9" min_height="420"></x-tv-chart>
        </aside>
      </div>
      <p class="muted" style="margin-top:12px"><a href="#/daily-brief">← 목록으로</a></p>
    `;
    window.__registerCards?.(wrap);
  } catch {
    wrap.innerHTML = `<div class="card"><h2>자료를 찾지 못했습니다</h2></div>`;
    window.__registerCards?.(wrap);
  }
}

// -------- Trade Journal = 공개 “분석 아카이브” ----------
const AIDX = '/api/analyses/index.json';

function koBias(b){
  return b==='bullish'?'상승':b==='bearish'?'하락':'중립';
}
function badge(b){
  const cls = String(b || 'neutral').replace(/[^a-z0-9_-]/gi, '');
  return `<span class="badge ${cls}">${escapeHtml(koBias(b || 'neutral'))}</span>`;
}
function pillS(v){ return `<span class="pill level">지지 ${escapeHtml(String(v || ''))}</span>`; }
function pillR(v){ return `<span class="pill res">저항 ${escapeHtml(String(v || ''))}</span>`; }

async function fetchJSON(path){
  const res = await fetch(path + '?_=' + Date.now());
  if (!res.ok) throw 0;
  return res.json();
}

// Fetch many slugs with a concurrency limit to avoid overwhelming network
async function fetchDetailsForSlugs(slugs, concurrency = 6){
  const results = new Array(slugs.length);
  let idx = 0;

  async function worker(){
    while (idx < slugs.length){
      const i = idx++;
      const slug = String(slugs[i]);
      if (shouldHide(slug)) { results[i] = null; continue; }
      try{
        const detail = await fetchJSON(`/api/analyses/${encodeURIComponent(slug)}.json`);
        analysesDetailCache.set(slug, detail || {});
        const obj = Object.assign({ slug }, (detail && typeof detail === 'object') ? detail : {});
        results[i] = shouldHide(obj) ? null : obj;
      }catch(_){
        results[i] = { slug, title: slug, symbol: '', tf: '', date: '', tags: [], bias: '' };
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, slugs.length) }, () => worker());
  await Promise.all(workers);
  return results.filter(Boolean);
}

// Like fetchDetailsForSlugs but invoke onDetail(index, slug, detail) as each detail is fetched
async function fetchDetailsForSlugsWithCallback(slugs, onDetail, concurrency = 6){
  let idx = 0;
  async function worker(){
    while (idx < slugs.length){
      const i = idx++;
      const slug = String(slugs[i]);
      if (shouldHide(slug)) { try{ onDetail?.(i, slug, null); }catch{} continue; }
      try{
        const detail = await fetchJSON(`/api/analyses/${encodeURIComponent(slug)}.json`);
        analysesDetailCache.set(slug, detail || {});
        const obj = Object.assign({ slug }, (detail && typeof detail === 'object') ? detail : {});
        if (!shouldHide(obj)) try{ onDetail?.(i, slug, obj); }catch{}
      }catch(_){
        const obj = { slug, title: slug, symbol: '', tf: '', date: '', tags: [], bias: '' };
        if (!shouldHide(obj)) try{ onDetail?.(i, slug, obj); }catch{}
      }
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, slugs.length) }, () => worker());
  await Promise.all(workers);
}

async function loadAnalysesList(){
  const list = document.getElementById('anal-list');
  if (!list) return;
  list.innerHTML = `<p class="muted">불러오는 중…</p>`;
  try{
    if (!analysesIndexCache){
      analysesIndexCache = await fetchJSON(AIDX);
      if (Array.isArray(analysesIndexCache) && analysesIndexCache.length && typeof analysesIndexCache[0] === 'string'){
        const slugs = analysesIndexCache.filter(s => !shouldHide(s)).slice();
        const enriched = await fetchDetailsForSlugs(slugs, 6);
        analysesIndexCache = enriched;
      }
    }
    const itemsRaw = Array.isArray(analysesIndexCache) ? analysesIndexCache : [];
    const items = itemsRaw.filter(it => !shouldHide(it));
    list.dataset.raw = JSON.stringify(items);
    renderAnalysesListFiltered();

    function updateEntryDOM(i, slug, obj){
      try{
        if (!obj || shouldHide(obj)) {
          const gone = document.getElementById(`entry-${slug}`);
          if (gone) gone.remove();
          return;
        }
        const host = document.getElementById('anal-list');
        if (!host) return;
        const entry = document.getElementById(`entry-${slug}`);
        const img = obj.hero || obj.image || '';
        const html = `
          <article class="entry" id="entry-${slug}" data-slug="${slug}">
            <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap">
              ${img ? `<div style="flex:0 0 140px"><img src="${escapeHtml(img)}" alt="${escapeHtml(obj.title||slug)}" style="width:100%;height:88px;object-fit:cover;border-radius:8px;display:block"></div>` : ''}
              <div style="flex:1;min-width:0">
                <div class="row">
                  <h3 style="margin-right:6px">${escapeHtml(obj.title || slug)}</h3>
                  ${badge(obj.bias)}
                  <span class="meta">· ${escapeHtml(obj.symbol||'')} · ${escapeHtml(obj.tf||'')} · ${escapeHtml(obj.date||'')}</span>
                  <div class="actions">
                    <a class="icon-btn" href="#/trade-journal/${encodeURIComponent(slug)}" aria-label="자세히 보기 ${escapeHtml(obj.title || slug)}">자세히 보기 →</a>
                    <button class="icon-btn pv-btn" data-slug="${slug}" data-symbol="${escapeHtml(obj.symbol||'')}" data-ivl="60" aria-label="미리보기 차트 ${escapeHtml(obj.symbol || obj.title || slug)}">미리보기 차트</button>
                  </div>
                </div>
                ${(obj.tags && obj.tags.length)? `<div class="row" style="margin-top:6px">${(obj.tags||[]).map(t=>`<span class="pill">#${escapeHtml(t)}</span>`).join('')}</div>`: ''}
                <div class="preview" id="pv-${slug}" style="margin-top:10px;"></div>
              </div>
            </div>
          </article>
        `;
        if (entry){ entry.outerHTML = html; }
        else { host.insertAdjacentHTML('beforeend', html); }
        try{
          const newEntry = document.getElementById(`entry-${slug}`);
          if (newEntry) bindAnalysesEntryActions(newEntry);
        }catch(e){}
      }catch(e){ console.warn('updateEntryDOM', e); }
    }

    const originalRaw = JSON.parse(list.dataset.raw || '[]');
    const maybeSlugs = originalRaw
      .map(it => it && it.slug ? it.slug : it && typeof it==='string' ? it : null)
      .filter(Boolean)
      .filter(s => !shouldHide(s));

    if (maybeSlugs.length){
      // 骨架可选：略
      fetchDetailsForSlugsWithCallback(maybeSlugs, (i, slug, obj)=>{ updateEntryDOM(i, slug, obj); }, 6).catch(()=>{});
    }

    const slugInUrl = currentSlugFromQuery();
    const detailHost = document.getElementById('anal-detail');
    const visibleItems = originalRaw.filter(it => !shouldHide(it));
    if (!slugInUrl && visibleItems.length && detailHost){
      await renderAnalysisDetailBySlug(visibleItems[0].slug);
      const first = visibleItems[0];
      const host = document.getElementById(`pv-${first.slug}`);
      if (host && !host.dataset.rendered){
        host.innerHTML = `<x-tv-chart symbol="${escapeHtml(first.symbol || '')}" interval="60" ratio="16:9" min_height="220"></x-tv-chart>`;
        host.dataset.rendered = '1';
        const btn = document.querySelector(`.pv-btn[data-slug="${first.slug}"]`);
        if (btn) btn.textContent = '차트 닫기';
      }
    }
  }catch{
    list.innerHTML = `<p class="muted">자료가 없습니다</p>`;
  }
}

function renderAnalysesListFiltered(){
  const list = document.getElementById('anal-list');
  const q = (document.getElementById('anal-search')?.value||'').toLowerCase();
  const bias = (document.getElementById('anal-bias')?.value||'');
  const raw = JSON.parse(list.dataset.raw||'[]');

  const items = raw
    .filter(it => !shouldHide(it))
    .filter(it=>{
      const hay = [it.title, it.symbol, it.tf, it.date, ...(it.tags||[])].join(' ').toLowerCase();
      const hit = hay.includes(q);
      const okBias = !bias || it.bias===bias;
      return hit && okBias;
    });

  const htmlItems = items.map(it=>{
    const img = it.hero || it.image || '';
    return `
    <article class="entry" id="entry-${it.slug}" data-slug="${it.slug}">
      <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap">
        ${img ? `<div style="flex:0 0 140px"><img src="${escapeHtml(img)}" alt="${escapeHtml(it.title||it.slug)}" style="width:100%;height:88px;object-fit:cover;border-radius:8px;display:block"></div>` : ''}
        <div style="flex:1;min-width:0">
          <div class="row">
            <h3 style="margin-right:6px">${escapeHtml(it.title || it.slug)}</h3>
            ${badge(it.bias)}
            <span class="meta">· ${escapeHtml(it.symbol || '')} · ${escapeHtml(it.tf || '')} · ${escapeHtml(it.date || '')}</span>
            <div class="actions">
              <a class="icon-btn" href="#/trade-journal/${encodeURIComponent(it.slug)}" aria-label="자세히 보기 ${escapeHtml(it.title || it.slug)}">자세히 보기 →</a>
              <button class="icon-btn pv-btn" data-slug="${it.slug}" data-symbol="${escapeHtml(it.symbol||'')}" data-ivl="60" aria-label="미리보기 차트 ${escapeHtml(it.symbol || it.title || it.slug)}">미리보기 차트</button>
            </div>
          </div>
          ${it.tags?.length?`<div class="row" style="margin-top:6px">${it.tags.map(t=>`<span class="pill">#${escapeHtml(t)}</span>`).join('')}</div>`:''}
          <div class="preview" id="pv-${it.slug}" style="margin-top:10px;"></div>
        </div>
      </div>
    </article>
  `}).join('');

  if (htmlItems && htmlItems.trim()) {
    list.innerHTML = htmlItems;
  } else {
    if (!q) {
      list.innerHTML = Array.from({length:4}).map(()=>`
        <article class="entry skeleton">
          <div class="row">
            <h3 style="margin-right:6px"><span class="skeleton-text" style="width:220px;display:inline-block;height:18px;background:#2a2e36;border-radius:6px"></span></h3>
            <span class="meta"><span class="skeleton-text" style="width:120px;display:inline-block;height:14px;background:#2a2e36;border-radius:6px"></span></span>
          </div>
          <div style="margin-top:8px"><span class="skeleton-box" style="display:block;width:100%;height:220px;background:#202226;border-radius:8px"></span></div>
        </article>
      `).join('');
    } else {
      list.innerHTML = `<p class="muted">검색 결과가 없습니다</p>`;
    }
  }

  function bindEntryActions(root=document){
    root.querySelectorAll('.pv-btn').forEach(btn=>{
      btn.onclick = ()=>{
        const slug = btn.dataset.slug;
        const symbol = btn.dataset.symbol;
        const host = document.getElementById(`pv-${slug}`);
        if (!host) return;
        if (host.dataset.rendered === '1') {
          host.innerHTML = ''; host.dataset.rendered = '0';
          btn.textContent = '미리보기 차트';
        } else {
          host.innerHTML = `<x-tv-chart symbol="${escapeHtml(symbol || '')}" interval="${escapeHtml(btn.dataset.ivl || '60')}" ratio="16:9" min_height="220"></x-tv-chart>`;
          host.dataset.rendered = '1';
          btn.textContent = '차트 닫기';
        }
      };
    });

    root.querySelectorAll('.entry .icon-btn[href^="#/trade-journal/"]').forEach(a=>{
      a.onclick = (e)=>{
        e.preventDefault();
        const href = a.getAttribute('href') || '';
        const m = href.match(/#\/trade-journal\/([^?]+)/);
        if (!m) return;
        const slug = decodeURIComponent(m[1]);
        renderEntryDetailInline(slug);
      };
    });
  }

  bindEntryActions(list);
}

function bindAnalysesEntryActions(entryNode){
  if (!entryNode) return;
  entryNode.querySelectorAll('.pv-btn').forEach(btn=>{
    btn.onclick = ()=>{
      const slug = btn.dataset.slug;
      const symbol = btn.dataset.symbol;
      const host = document.getElementById(`pv-${slug}`);
      if (!host) return;
      if (host.dataset.rendered === '1') {
        host.innerHTML = ''; host.dataset.rendered = '0';
        btn.textContent = '미리보기 차트';
      } else {
        host.innerHTML = `<x-tv-chart symbol="${escapeHtml(symbol||'')}" interval="${escapeHtml(btn.dataset.ivl||'60')}" ratio="16:9" min_height="220"></x-tv-chart>`;
        host.dataset.rendered = '1';
        btn.textContent = '차트 닫기';
      }
    };
  });

  entryNode.querySelectorAll('.entry .icon-btn[href^="#/trade-journal/"]').forEach(a=>{
    a.onclick = (e)=>{
      e.preventDefault();
      const href = a.getAttribute('href') || '';
      const m = href.match(/#\/trade-journal\/([^?]+)/);
      if (!m) return;
      const slug = decodeURIComponent(m[1]);
      renderEntryDetailInline(slug);
    };
  });
}

async function renderEntryDetailInline(slug){
  const host = document.getElementById(`pv-${slug}`);
  if (!host) return;
  if (host.dataset.rendered === '1'){
    host.innerHTML = ''; host.dataset.rendered = '0';
    const btn = document.querySelector(`.pv-btn[data-slug="${slug}"]`);
    if (btn) btn.textContent = '미리보기 차트';
    return;
  }
  host.innerHTML = `<p class="muted">불러오는 중…</p>`;
  try{
    if (!analysesDetailCache.has(slug)){
      analysesDetailCache.set(slug, await fetchJSON(`/api/analyses/${slug}.json`));
    }
    const d = analysesDetailCache.get(slug) || {};
    if (shouldHide({ ...d, slug })) { host.innerHTML = ''; return; }

    const ivl = (d.chart?.interval) || '60';
    const sym = (d.chart?.symbol) || d.symbol || '';
    const title = escapeHtml(d.title || slug);
    const meta = [escapeHtml(d.symbol||''), escapeHtml(d.tf||''), escapeHtml(d.date||'')].filter(Boolean).join(' · ');

    host.innerHTML = `
        <div class="entry-detail">
        <h4 style="margin:6px 0 8px">${title}</h4>
        <p class="meta">${meta}</p>
        ${(d.supports||[]).length|| (d.resistances||[]).length ? `<div class="row" style="margin-top:8px">${(d.supports||[]).map(pillS).join('')}${(d.resistances||[]).map(pillR).join('')}</div>` : ''}
        ${d.context?`<p style="margin-top:10px">${escapeHtml((d.context||'').slice(0,240))}${(d.context||'').length>240? '...':''}</p>`:''}
        <div style="margin-top:10px"><x-tv-chart symbol="${escapeHtml(sym || '')}" interval="${escapeHtml(ivl || '60')}" ratio="16:9" min_height="260"></x-tv-chart></div>
      </div>
    `;
    host.dataset.rendered = '1';
    const btn = document.querySelector(`.pv-btn[data-slug="${slug}"]`);
    if (btn) btn.textContent = '차트 닫기';
    window.__registerCards?.(host);
  }catch(e){ host.innerHTML = `<p class="muted">자료를 불러올 수 없습니다</p>`; }
}

async function renderAnalysisDetailBySlug(slug){
  const box = document.getElementById('anal-detail');
  if (!box) return;
  if (!slug){ box.innerHTML = `<p class="muted">좌측에서 항목을 선택하면 상세 내용을 볼 수 있습니다。</p>`; return; }
  if (shouldHide(slug)) { box.innerHTML = `<p class="muted">표시할 수 없는 항목입니다</p>`; return; }
  box.innerHTML = `<p class="muted">불러오는 중…</p>`;
  try{
    if (!analysesDetailCache.has(slug)){
      analysesDetailCache.set(slug, await fetchJSON(`/api/analyses/${encodeURIComponent(slug)}.json`));
    }
    const d = analysesDetailCache.get(slug) || {};
    if (shouldHide({ ...d, slug })) { box.innerHTML = `<p class="muted">표시할 수 없는 항목입니다</p>`; return; }

    const ivl = (d.chart?.interval) || '60';
    const sym  = (d.chart?.symbol)   || d.symbol || '';
    const title = d.title || slug;
    const symbolLabel = d.symbol || sym || '';
    const tfLabel = d.tf || '';
    const dateLabel = d.date || '';

    box.innerHTML = `
      <h2>${escapeHtml(title)} ${badge(d.bias)}</h2>
      <p class="muted">${escapeHtml(symbolLabel)}${symbolLabel && tfLabel? ' · ' : ''}${escapeHtml(tfLabel)}${(symbolLabel||tfLabel) && dateLabel? ' · ' : ''}${escapeHtml(dateLabel)}</p>

      <h3>지지 / 저항</h3>
      <div class="row" style="margin-top:6px">
        ${(d.supports||[]).map(s=>`<span class="pill level">지지 ${escapeHtml(s)}</span>`).join('')}
        ${(d.resistances||[]).map(r=>`<span class="pill res">저항 ${escapeHtml(r)}</span>`).join('')}
      </div>

      ${d.tags?.length?`<div class="row" style="margin-top:6px">${d.tags.map(t=>`<span class="pill">#${escapeHtml(t)}</span>`).join('')}</div>`:''}

      ${d.context?`<h3 style="margin-top:12px">배경</h3><p>${escapeHtml(d.context)}</p>`:''}
      ${d.view?`<h3 style="margin-top:12px">관점</h3><p>${escapeHtml(d.view)}</p>`:''}
      ${d.invalidation?`<p class="meta" style="margin-top:6px">무효화 조건: ${escapeHtml(d.invalidation)}</p>`:''}

      <div class="card" style="margin-top:12px">
        <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">
          <h3 style="margin:0">참고 차트</h3>
          <div class="row">
            <label class="meta">주기&nbsp;</label>
            <select id="detail-interval" class="search">
              <option value="15">15m</option>
              <option value="60" ${ivl==='60'?'selected':''}>1H</option>
              <option value="240" ${ivl==='240'?'selected':''}>4H</option>
              <option value="1D" ${ivl==='1D'?'selected':''}>1D</option>
            </select>
          </div>
        </div>
        <div id="detail-chart-wrap">
            <x-tv-chart id="detail-chart" symbol="${escapeHtml(sym)}" interval="${escapeHtml(ivl)}" ratio="16:9" min_height="420"></x-tv-chart>
        </div>
      </div>
    `;

    const sel = document.getElementById('detail-interval');
    if (sel){
      sel.onchange = ()=>{
        const chart = document.getElementById('detail-chart');
        if (chart){ chart.setAttribute('interval', sel.value); }
      };
    }
    window.__registerCards?.(box);
  }catch{
    box.innerHTML = `<p class="muted">자료를 찾지 못했습니다</p>`;
    window.__registerCards?.(box);
  }
}

function currentSlugFromQuery(){
  const hash = location.hash || '';
  const matchPath = hash.match(/^#\/trade-journal\/([^?]+)/);
  if (matchPath) return decodeURIComponent(matchPath[1]);
  const matchQuery = hash.match(/^[^?]+\?(.+)$/);
  if (!matchQuery) return '';
  const params = new URLSearchParams(matchQuery[1]);
  return params.get('slug') || '';
}

/* ===== 背景与卡片出现效果 ===== */
(()=>{
  if (!window.__cardRevealObserver) {
    let revealCounter = 0;
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });

    window.__cardRevealObserver = observer;
    window.__registerCards = (root=document)=>{
      const cards = root.querySelectorAll('.card');
      cards.forEach(card=>{
        if (card.dataset.revealInit === '1') return;
        card.dataset.revealInit = '1';
        card.classList.add('reveal');
        card.style.transitionDelay = (revealCounter * 60) + 'ms';
        revealCounter += 1;
        observer.observe(card);
      });
    };
  }

  window.__registerCards?.();

  if (window.__homeFxInit) return;
  window.__homeFxInit = true;

  const cvs = document.getElementById('bgfx');
  if (!cvs || cvs.dataset.enabled !== 'true' || cvs.__inited) return;
  cvs.__inited = true;

  const ctx = cvs.getContext('2d');
  let w,h,dpr;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cvs.width  = Math.floor(innerWidth  * dpr);
    h = cvs.height = Math.floor(innerHeight * dpr);
    cvs.style.width = innerWidth + 'px';
    cvs.style.height = innerHeight + 'px';
  }
  resize(); addEventListener('resize', resize);

  const candles = Array.from({length:32},()=>({
    x: Math.random()*w, y: Math.random()*h,
    body: 14+Math.random()*28, w: 3+Math.random()*3,
    v: .15+Math.random()*.25, phase: Math.random()*Math.PI*2
  }));

  function grid(){
    const gap = 64*dpr;
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
    if (t - last < 1000/30){ requestAnimationFrame(tick); return; }
    last = t;
    ctx.clearRect(0,0,w,h);
    grid(); drawCandles(t);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ===== Knowledge Lab ===== */
const KL_KEY = 'kl.progress.v1';
let KL_QUERY = '';
let SYLLABUS = JSON.parse(JSON.stringify(DEFAULT_SYLLABUS));

function klLoad(){ try{ return JSON.parse(localStorage.getItem(KL_KEY)||'{}'); }catch{return{}} }
function klSave(obj){ localStorage.setItem(KL_KEY, JSON.stringify(obj)); }

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

  window.__registerCards?.(host.parentElement || host);

  host.querySelectorAll('.lv-head').forEach(h=>{
    h.onclick = ()=>{
      const sec = document.querySelector(h.dataset.toggle);
      if (sec) sec.classList.toggle('collapsed');
    };
  });

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

/* ===== Market News：媒体列表 + 详情 ===== */
async function renderMarketNewsList(){
  const host = document.getElementById('news-list');
  if (!host) return;
  host.innerHTML = '<li class="media-empty">불러오는 중…</li>';
  try{
    if (!marketNewsIndexCache){
      const res = await fetch('/api/market-news/index.json?_=' + Date.now());
      const rows = await res.json();
      if (Array.isArray(rows)) marketNewsIndexCache = rows;
    }
    const ids = (Array.isArray(marketNewsIndexCache) ? marketNewsIndexCache : [])
      .map(r => typeof r === 'string' ? r : (r && (r.id || r.slug) ? (r.id || r.slug) : ''))
      .filter(Boolean).slice(0, 60);

    if (!ids.length){ host.innerHTML = '<li class="media-empty">뉴스가 없습니다</li>'; return; }

    const html = await Promise.all(ids.map(async id=>{
      try{
        if (!marketNewsCache.has(id)){
          const dres = await fetch(`/api/market-news/${encodeURIComponent(id)}.json?_=${Date.now()}`);
          if (!dres.ok) throw new Error('NOT_FOUND');
          marketNewsCache.set(id, await dres.json());
        }
        const d = marketNewsCache.get(id) || {};
        const meta = [d.source, d.date ? new Date(d.date).toLocaleString() : ''].filter(Boolean).join(' · ');
        return _mediaItem({
          href: `#/market-news/${encodeURIComponent(id)}`,
          title: d.title || id,
          desc: d.summary || (Array.isArray(d.bullets) ? d.bullets[0] : ''),
          meta,
          img: d.hero || d.image || d.thumbnail || d.thumb || ''
        });
      }catch{ return null; }
    }));

    host.innerHTML = html.filter(Boolean).join('') || '<li class="media-empty">뉴스가 없습니다</li>';
  }catch{
    host.innerHTML = '<li class="media-empty">불러오기에 실패했습니다</li>';
  }
}

function renderMarketNewsDetailView(){
  outlet.innerHTML = `
    <section aria-live="polite" data-route="market-news-detail">
      <div id="news-detail"></div>
    </section>
  `;
}

async function renderMarketNewsDetail(id){
  const host = document.getElementById('news-detail');
  if (!host) return;
  if (!id){ host.innerHTML = `<div class="card"><h2>유효한 ID가 필요합니다</h2><p class="muted"><a href="#/market-news">← 목록으로</a></p></div>`; return; }
  host.innerHTML = `<div class="card"><h2>불러오는 중…</h2></div>`;
  try{
    if (!marketNewsCache.has(id)){
      const r = await fetch(`/api/market-news/${encodeURIComponent(id)}.json?_=${Date.now()}`);
      if (!r.ok) throw 0;
      marketNewsCache.set(id, await r.json());
    }
    const d = marketNewsCache.get(id) || {};
    const meta = [d.source, d.date ? new Date(d.date).toLocaleString() : ''].filter(Boolean).join(' · ');
    const bullets = Array.isArray(d.bullets) && d.bullets.length
      ? `<ul>${d.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul>` : '';
    host.innerHTML = `
      <article class="card" style="padding:24px">
        <h2 style="margin:0 0 6px">${escapeHtml(d.title || id)}</h2>
        <p class="muted">${escapeHtml(meta)}</p>
        ${d.hero || d.image ? `<img src="${escapeHtml(d.hero||d.image)}" alt="${escapeHtml(d.title||id)}" style="width:100%;border-radius:12px;margin:14px 0">` : ''}
        ${d.summary ? `<p>${escapeHtml(d.summary)}</p>` : ''}
        ${bullets}
        ${d.url ? `<p style="margin-top:10px"><a class="icon-btn" href="${escapeHtml(d.url)}" target="_blank" rel="noopener">원문 보기</a></p>` : ''}
        <p class="muted" style="margin-top:16px"><a href="#/market-news">← 뉴스 목록으로</a></p>
      </article>
    `;
    window.__registerCards?.(host);
  }catch{
    host.innerHTML = `<div class="card"><h2>뉴스를 불러올 수 없습니다</h2><p class="muted"><a href="#/market-news">← 목록으로</a></p></div>`;
    window.__registerCards?.(host);
  }
}

// -------- 路由启动 ----------
async function handleRouteChange(){
  const { id, slug } = matchRoute();
  await renderRoute(id, slug);
  setActive();
}

window.addEventListener('hashchange', () => {
  handleRouteChange().catch(err => console.error(err));
});

document.addEventListener('DOMContentLoaded', () => {
  handleRouteChange().catch(err => console.error(err));
});
