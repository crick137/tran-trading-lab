// ===== src/main.js (KO, preview + auto-open 1st, clickable lessons + News + Remote Syllabus) =====
import './styles/global.css'
import './components/x-tv-chart.js'

const routes = {
  '': 'home',
  '#/daily-brief': 'daily-brief',
  '#/trade-journal': 'trade-journal',   // 公开分析
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

// -------- Daily Brief 路由 ----------
function matchRoute() {
  const h = location.hash;
  const m = h.match(/^#\/daily-brief\/([\w-]+)$/);
  if (m) return { id: 'daily-brief-detail', slug: m[1] };
  return { id: (routes[h] || 'home') };
}

// 列表
async function renderDailyBriefList(){
  const ul = document.getElementById('brief-list');
  if (!ul) return;
  ul.innerHTML = '<li class="muted">加载中…</li>';
  try{
    const res = await fetch('/api/daily-brief/index.json?_=' + Date.now());
    const items = await res.json();
    ul.innerHTML = Array.isArray(items)&&items.length
      ? items.map(s=>`<li><a href="#/daily-brief/${s}">${s}</a></li>`).join('')
      : '<li class="muted">暂无数据</li>';
  }catch{ ul.innerHTML = '<li class="muted">暂无数据</li>'; }
}

// 详情
async function renderDailyBriefDetail(slug){
  const wrap = document.getElementById('daily-brief-detail');
  if (!wrap) return;
  wrap.innerHTML = `<div class="card"><h2>加载中…</h2></div>`;
  try {
    const res = await fetch(`/api/daily-brief/${slug}.json?_=${Date.now()}`);
    if (!res.ok) throw 0;
    const d = await res.json();
    wrap.innerHTML = `
      <div class="grid grid-12">
        <section class="card" style="grid-column: span 8;">
          <h2>${d.title || 'Daily Brief'}</h2>
          <p class="muted">每日早读市场节奏</p>
          ${d.bullets?.length?`<h3>📌 关键看点</h3><ul>${d.bullets.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
          ${d.schedule?.length?`<h3 style="margin-top:12px">🕒 今日日程</h3><ul>${d.schedule.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}
        </section>
        <aside class="card" style="grid-column: span 4;">
          <h2>快览图表</h2>
          <x-tv-chart symbol="${(d.chart?.symbol)||d.symbol||'FX:XAUUSD'}" interval="${(d.chart?.interval)||d.interval||'60'}" ratio="16:9" min_height="420"></x-tv-chart>
        </aside>
      </div>
      <p class="muted" style="margin-top:12px"><a href="#/daily-brief">← 返回列表</a></p>
    `;
  } catch {
    wrap.innerHTML = `<div class="card"><h2>未找到内容</h2></div>`;
  }
}

// -------- Trade Journal = 公开“分析档案” ----------
const AIDX = '/api/analyses/index.json';

function koBias(b){
  return b==='bullish'?'看多':b==='bearish'?'看空':'中性';
}
function badge(bias){ return `<span class="badge ${bias}">${koBias(bias||'neutral')}</span>`; }
function pillS(v){ return `<span class="pill level">支撑 ${v}</span>`; }
function pillR(v){ return `<span class="pill res">阻力 ${v}</span>`; }

async function fetchJSON(path){
  const res = await fetch(path + '?_=' + Date.now());
  if (!res.ok) throw 0;
  return res.json();
}

async function loadAnalysesList(){
  const list = document.getElementById('anal-list');
  if (!list) return;
  list.innerHTML = `<p class="muted">加载中…</p>`;
  try{
    const items = await fetchJSON(AIDX); // [{slug,title,symbol,tf,date,tags,bias}]
    list.dataset.raw = JSON.stringify(items);
    renderAnalysesListFiltered();

    // 👉 若 URL 未携带 slug，自动展开第一个条目并加载预览图表
    const slugInUrl = currentSlugFromQuery();
    if (!slugInUrl && items.length){
      await renderAnalysisDetailBySlug(items[0].slug);
      const first = items[0];
      const host = document.getElementById(`pv-${first.slug}`);
      if (host && !host.dataset.rendered){
        host.innerHTML = `<x-tv-chart symbol="${first.symbol}" interval="60" ratio="16:9" min_height="220"></x-tv-chart>`;
        host.dataset.rendered = '1';
        const btn = document.querySelector(`.pv-btn[data-slug="${first.slug}"]`);
        if (btn) btn.textContent = '收起图表';
      }
    }
  }catch{
    list.innerHTML = `<p class="muted">暂无数据</p>`;
  }
}

// 列表 + 预览图表按钮
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
          <a class="icon-btn" href="#/trade-journal?slug=${encodeURIComponent(it.slug)}">查看</a>
          <button class="icon-btn pv-btn" data-slug="${it.slug}" data-symbol="${it.symbol}" data-ivl="60">预览图表</button>
        </div>
      </div>
      ${it.tags?.length?`<div class="row" style="margin-top:6px">${it.tags.map(t=>`<span class="pill">#${t}</span>`).join('')}</div>`:''}
      <div class="preview" id="pv-${it.slug}" style="margin-top:10px;"></div>
    </article>
  `).join('') || `<p class="muted">没有符合搜索的结果</p>`;

  // 预览图表切换（按需加载/卸载）
  list.querySelectorAll('.pv-btn').forEach(btn=>{
    btn.onclick = ()=>{
      const slug = btn.dataset.slug;
      const symbol = btn.dataset.symbol;
      const host = document.getElementById(`pv-${slug}`);
      if (!host) return;
      if (host.dataset.rendered === '1') {
        host.innerHTML = ''; host.dataset.rendered = '0';
        btn.textContent = '预览图表';
      } else {
        host.innerHTML = `<x-tv-chart symbol="${symbol}" interval="${btn.dataset.ivl}" ratio="16:9" min_height="220"></x-tv-chart>`;
        host.dataset.rendered = '1';
        btn.textContent = '收起图表';
      }
    };
  });
}

// 详情（右侧面板）+ 周期选择
async function renderAnalysisDetailBySlug(slug){
  const box = document.getElementById('anal-detail');
  if (!box) return;
  if (!slug){ box.innerHTML = `<p class="muted">在左侧选择条目即可查看详细内容。</p>`; return; }

  box.innerHTML = `<p class="muted">加载中…</p>`;
  try{
    const d = await fetchJSON(`/api/analyses/${slug}.json`);
    const ivl = (d.chart?.interval) || '60';
    const sym  = (d.chart?.symbol)   || d.symbol;

    box.innerHTML = `
      <h2>${d.title} ${badge(d.bias)}</h2>
      <p class="muted">${d.symbol} · ${d.tf} · ${d.date}</p>

      <h3>支撑 / 阻力</h3>
      <div class="row" style="margin-top:6px">
        ${(d.supports||[]).map(pillS).join('')}
        ${(d.resistances||[]).map(pillR).join('')}
      </div>

      ${d.tags?.length?`<div class="row" style="margin-top:6px">${d.tags.map(t=>`<span class="pill">#${t}</span>`).join('')}</div>`:''}

      ${d.context?`<h3 style="margin-top:12px">背景</h3><p>${d.context}</p>`:''}
      ${d.view?`<h3 style="margin-top:12px">交易思路</h3><p>${d.view}</p>`:''}
      ${d.invalidation?`<p class="meta" style="margin-top:6px">失效条件: ${d.invalidation}</p>`:''}

      <div class="card" style="margin-top:12px">
        <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">
          <h3 style="margin:0">参考图表</h3>
          <div class="row">
            <label class="meta">周期&nbsp;</label>
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
    box.innerHTML = `<p class="muted">未找到内容</p>`;
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

  // 1) 卡片阶梯式进入动画
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

  // 2) 背景蜡烛/网格的轻量动画
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
let KL_QUERY = '';   // 搜索关键词

// ★ 改为 let，后面可被远程覆盖
let SYLLABUS = [
  {
    level: 'Starter · 入门地基',
    icon: '🌱',
    desc: '认识外汇市场的结构、参与者与运作方式。',
    lessons: [
      { name: '外汇市场是什么', link: '#/articles/what-is-forex', type: '概念', duration: '5m', desc: '了解市场规模、参与者与交易特点。' },
      { name: '如何交易外汇', link: '#/articles/how-to-trade-forex', type: '概念', duration: '8m', desc: '下单、撮合、杠杆与交割的基础流程。' },
      { name: '何时可以交易', link: '#/articles/when-to-trade-forex', type: '节奏', duration: '6m', desc: '主要交易时段与流动性节奏。' },
      { name: '谁在交易外汇', link: '#/articles/who-trades-forex', type: '概念', duration: '6m', desc: '央行、机构与个人的角色与动机。' },
      { name: '为什么交易外汇', link: '#/articles/why-trade-forex', type: '概念', duration: '7m', desc: '收益来源与适合外汇的策略优势。' },
      { name: '保证金交易 101', link: '#/articles/margin-101', type: '机制', duration: '8m', desc: '理解保证金、杠杆与强平机制。' }
    ]
  },
  {
    level: 'Framework · 基础工具',
    icon: '🧰',
    desc: '准备交易所需的基本工具与分析框架。',
    lessons: [
      { name: '外汇经纪商 101', link: '#/articles/forex-brokers-101', type: '工具', duration: '8m', desc: '如何选择经纪商与辨别监管等级。' },
      { name: '三类市场分析方法', link: '#/articles/three-types-of-analysis', type: '框架', duration: '10m', desc: '技术、基本面与情绪分析的分工。' },
      { name: '常见图表类型', link: '#/articles/types-of-charts', type: '工具', duration: '7m', desc: '线图、柱状图与烛图的优势与适用场景。' }
    ]
  },
  {
    level: 'Structure · 价格结构',
    icon: '📘',
    desc: '从结构与价差的角度理解行情骨架。',
    lessons: [
      { name: '支撑与阻力级别', link: '#/articles/support-resistance', type: '结构', duration: '10m', desc: '识别关键价位并制定反应策略。' },
      { name: '日本蜡烛图', link: '#/articles/japanese-candlesticks', type: '结构', duration: '12m', desc: '用烛形阅读市场行为与心理。' },
      { name: '斐波那契工具', link: '#/articles/fibonacci', type: '工具', duration: '9m', desc: '利用黄金分割定位回撤与扩展目标。' },
      { name: '移动平均线', link: '#/articles/moving-averages', type: '工具', duration: '8m', desc: '趋势判断与均线组合的配合方式。' },
      { name: '常用指标组合', link: '#/articles/popular-indicators', type: '工具', duration: '9m', desc: 'MACD、RSI 等指标与结构如何协同。' }
    ]
  },
  {
    level: 'Pattern · 结构延伸',
    icon: '🌀',
    desc: '深化对价格形态与动量的理解。',
    lessons: [
      { name: '摆动指标与动量', link: '#/articles/oscillators', type: '结构', duration: '9m', desc: '解读动量信号的优势与局限。' },
      { name: '关键图形形态', link: '#/articles/chart-patterns', type: '结构', duration: '11m', desc: '旗形、楔形、头肩顶等结构的使用。' },
      { name: '枢轴点应用', link: '#/articles/pivot-points', type: '工具', duration: '7m', desc: '日内定位支撑与阻力的快捷方式。' }
    ]
  },
  {
    level: 'Liquidity · 流动性视角',
    icon: '🌊',
    desc: '从聪明资金角度观察价格与定位。',
    lessons: [
      { name: 'Heikin Ashi 解读', link: '#/articles/heikin-ashi', type: '流动性', duration: '7m', desc: '平滑波动以捕捉趋势骨架。' },
      { name: '艾略特波浪基础', link: '#/articles/elliott-wave', type: '流动性', duration: '12m', desc: '用波浪结构辅助方向与节奏判断。' },
      { name: '谐波形态进阶', link: '#/articles/harmonic-patterns', type: '流动性', duration: '14m', desc: '比例组合与入场区域的设计技巧。' }
    ]
  },
  {
    level: 'Strategy · 策略设计',
    icon: '🎯',
    desc: '把结构、流动性与基本面整合为可执行策略。',
    lessons: [
      { name: '背离交易', link: '#/articles/divergences', type: '策略', duration: '10m', desc: '动量与价格错位下的入场逻辑。' },
      { name: '市场环境分类', link: '#/articles/market-environment', type: '策略', duration: '8m', desc: '趋势、震荡与过渡阶段的应对。' },
      { name: '突破与假突破', link: '#/articles/breakouts-fakeouts', type: '策略', duration: '9m', desc: '定义可靠的突破条件与过滤方式。' },
      { name: '基本面分析入门', link: '#/articles/fundamental-analysis', type: '策略', duration: '12m', desc: '经济指标与央行预期如何融入计划。' },
      { name: '货币对交叉交易', link: '#/articles/currency-crosses', type: '策略', duration: '8m', desc: '用交叉货币构建多空对冲思路。' },
      { name: '多周期分析', link: '#/articles/mtf-analysis', type: '策略', duration: '7m', desc: '同步高低周期，避免信息孤岛。' }
    ]
  },
  {
    level: 'Mindset · 心态与资讯',
    icon: '🧠',
    desc: '稳固认知、处理信息噪音并保持执行力。',
    lessons: [
      { name: '市场情绪与定位', link: '#/articles/market-sentiment', type: '心理', duration: '8m', desc: '读取极端情绪与资金流向。' },
      { name: '新闻交易手册', link: '#/articles/trading-the-news', type: '资讯', duration: '10m', desc: '数据发布前后的准备与执行。' },
      { name: '套息交易框架', link: '#/articles/carry-trade', type: '策略', duration: '9m', desc: '利差驱动的长期配置思路。' }
    ]
  },
  {
    level: 'Macro Mesh · 宏观关联',
    icon: '🧭',
    desc: '从跨市场角度构建对货币对的理解。',
    lessons: [
      { name: '美元指数导航', link: '#/articles/us-dollar-index', type: '宏观', duration: '8m', desc: 'DXY 如何牵引主要货币。' },
      { name: '跨市场关联', link: '#/articles/intermarket-correlations', type: '宏观', duration: '10m', desc: '债券、股指与商品的联动线索。' },
      { name: '从股票看外汇', link: '#/articles/equities-to-trade-fx', type: '宏观', duration: '7m', desc: '用行业或龙头股验证外汇假设。' },
      { name: '国家画像速查', link: '#/articles/country-profiles', type: '宏观', duration: '9m', desc: 'GDP、通胀、政策如何影响货币。' }
    ]
  },
  {
    level: 'System Lab · 系统养成',
    icon: '🛠️',
    desc: '搭建可复现的流程与记录系统。',
    lessons: [
      { name: '交易计划搭建', link: '#/articles/trading-plan', type: '系统', duration: '10m', desc: '制定目标、流程与评估方式。' },
      { name: '识别你的交易者类型', link: '#/articles/trader-types', type: '系统', duration: '7m', desc: '确认适配的节奏与策略框架。' },
      { name: '打造个人交易系统', link: '#/articles/build-your-system', type: '系统', duration: '12m', desc: '把规则写成可执行的 Playbook。' },
      { name: '交易日志实操', link: '#/articles/trading-journal', type: '系统', duration: '8m', desc: '通过记录提炼反馈循环。' },
      { name: 'MetaTrader 4 使用手册', link: '#/articles/mt4-howto', type: '工具', duration: '9m', desc: '熟悉常用功能与快捷操作。' }
    ]
  },
  {
    level: 'Risk Engine · 风险矩阵',
    icon: '🧮',
    desc: '风险控制、仓位设计与资金曲线管理。',
    lessons: [
      { name: '风险管理基石', link: '#/articles/risk-management', type: '风险', duration: '9m', desc: '用指标衡量风险并制定边界。' },
      { name: '交易者爆仓的首要原因', link: '#/articles/cause-of-death', type: '风险', duration: '6m', desc: '识别常见的风险积累路径。' },
      { name: '仓位规模设计', link: '#/articles/position-sizing', type: '风险', duration: '8m', desc: 'R 值、账户权益与仓位计算。' },
      { name: '止损设置策略', link: '#/articles/stop-loss', type: '风险', duration: '7m', desc: '结构、波动与时间三种止损方式。' },
      { name: '分批进出场', link: '#/articles/scaling', type: '风险', duration: '7m', desc: '25/25/25/25 的心理与资金管理。' },
      { name: '货币相关性应用', link: '#/articles/currency-correlations', type: '风险', duration: '8m', desc: '利用相关性避免重复风险敞口。' }
    ]
  },
  {
    level: 'Graduation · 巩固与反思',
    icon: '🏆',
    desc: '总结经验、警惕陷阱并规划下一阶段。',
    lessons: [
      { name: '新手最常见的错误', link: '#/articles/common-mistakes', type: '复盘', duration: '7m', desc: '列举高频失误并给出修正方法。' },
      { name: '外汇骗局速查', link: '#/articles/forex-scams', type: '复盘', duration: '6m', desc: '识别高收益诱饵与庞氏结构。' },
      { name: '交易偏好测验', link: '#/articles/personality-quizzes', type: '复盘', duration: '10m', desc: '评估自身优势与改进方向。' },
      { name: '毕业复盘', link: '#/articles/graduation-speech', type: '复盘', duration: '6m', desc: '总结方法论并规划下一步成长。' }
    ]
  }
];

function klLoad(){ try{ return JSON.parse(localStorage.getItem(KL_KEY)||'{}'); }catch{return{}} }
function klSave(obj){ localStorage.setItem(KL_KEY, JSON.stringify(obj)); }

// ★ 远程覆盖本地 SYLLABUS（存在且为数组才覆盖）
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
      <input id="kl-q" class="search" placeholder="搜索课程…" style="min-width:220px">
      <button id="kl-expand" class="btn">全部展开</button>
      <button id="kl-collapse" class="btn">全部收起</button>
      <button id="kl-start" class="btn" style="font-weight:700">开始学习</button>
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
  if (stats){ stats.textContent = `${done} / ${total} 课程`; }

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
          <button class="kl-dot-btn" data-key="${key}" aria-label="标记完成" title="标记完成" style="all:unset">
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

  // 分类折叠/展开
  host.querySelectorAll('.lv-head').forEach(h=>{
    h.onclick = ()=>{
      const sec = document.querySelector(h.dataset.toggle);
      if (sec) sec.classList.toggle('collapsed');
    };
  });

  // 完成标记：仅通过左侧圆点按钮切换
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

  // 进度重置
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
  host.innerHTML = '<p class="muted">加载中…</p>';
  try{
    const res = await fetch('/api/market-news/index.json?_=' + Date.now());
    const rows = await res.json(); // [{id}]
    if (!Array.isArray(rows) || !rows.length) {
      host.innerHTML = '<p class="muted">暂无快讯</p>';
      return;
    }
    const html = await Promise.all(rows.map(async r=>{
      try{
        const dres = await fetch(`/api/market-news/${encodeURIComponent(r.id)}.json?_=${Date.now()}`);
        const d = await dres.json();
        const bullets = (d.bullets||[]).map(b=>`<li>${b}</li>`).join('');
        const link = d.url ? `<a href="${d.url}" target="_blank" rel="noopener">查看原文</a>` : '';
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
    host.innerHTML = '<p class="muted">加载失败</p>';
  }
}

// -------- 路由驱动 ----------
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

