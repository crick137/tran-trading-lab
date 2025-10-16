// ===== src/main.js (router-safe, optional TV component, background K-lines) =====

// 1) 样式
import './styles/global.css'

// 2) 组件：动态可选（避免 404 时整份脚本失效）
;(async () => {
  try {
    await import('./components/x-tv-chart.js')
    console.log('[main] x-tv-chart loaded')
  } catch (e) {
    console.warn('[main] x-tv-chart optional load failed:', e?.message || e)
  }
})()

// 3) 启动标记
document.documentElement.classList.remove('no-js')
console.log('[main] loaded, hash=', location.hash)

/* ========== 路由表 ========== */
const routes = {
  '': 'home',
  '#/': 'home',
  '#/daily-brief': 'daily-brief',
  '#/trade-journal': 'trade-journal',
  '#/knowledge-lab': 'knowledge-lab',
  '#/market-news': 'market-news',
  '#/articles': 'articles',
  '#/about': 'about',
}

/* ========== 导航激活态 ========== */
function setActive() {
  const h = location.hash || ''
  document.querySelectorAll('.nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === h)
  })
}

/* ========== 显示指定路由 ========== */
function show(routeId) {
  const sections = [...document.querySelectorAll('section[data-route]')]
  if (!sections.length) return
  const target =
    sections.find(s => s.dataset.route === routeId) ||
    sections.find(s => s.dataset.route === 'home') ||
    sections[0]

  sections.forEach(s => {
    const on = s === target
    s.classList.toggle('active', on)
    s.classList.toggle('hidden', !on)
    s.style.display = on ? '' : 'none'
  })
  setActive()
}

/* ========== 解析路由（含日报详情） ========== */
function matchRoute() {
  const h = location.hash || ''
  const m = h.match(/^#\/daily-brief\/([\w-]+)$/)
  if (m) return { id: 'daily-brief-detail', slug: m[1] }

  let id = routes[h]
  const available = [...document.querySelectorAll('section[data-route]')].map(
    s => s.dataset.route
  )
  if (!id || !available.includes(id)) {
    id = available.includes('home') ? 'home' : available[0] || 'home'
    const first = Object.entries(routes).find(([, v]) => v === id)?.[0] || '#/'
    if (first && location.hash !== first) history.replaceState(null, '', first)
  }
  return { id }
}

/* ========== 工具：读取查询串中的 slug（只保留这一份！） ========== */
function currentSlugFromQuery() {
  const m = location.hash.match(/^[^?]+\?(.+)$/)
  if (!m) return ''
  const p = new URLSearchParams(m[1])
  return p.get('slug') || ''
}

/* ===== Daily Brief 列表/详情 ===== */
async function renderDailyBriefList() {
  const ul = document.getElementById('brief-list')
  if (!ul) return
  ul.innerHTML = '<li class="muted">불러오는 중…</li>'
  try {
    const res = await fetch('/daily-brief/index.json?_=' + Date.now())
    const items = await res.json()
    ul.innerHTML =
      Array.isArray(items) && items.length
        ? items.map(s => `<li><a href="#/daily-brief/${s}">${s}</a></li>`).join('')
        : '<li class="muted">자료가 없습니다</li>'
  } catch {
    ul.innerHTML = '<li class="muted">자료가 없습니다</li>'
  }
}

async function renderDailyBriefDetail(slug) {
  const wrap = document.getElementById('daily-brief-detail')
  if (!wrap) return
  wrap.innerHTML = `<div class="card"><h2>불러오는 중…</h2></div>`
  try {
    const res = await fetch(`/daily-brief/${slug}.json?_=${Date.now()}`)
    if (!res.ok) throw 0
    const d = await res.json()
    wrap.innerHTML = `
      <div class="grid">
        <section class="card" style="grid-column: span 8;">
          <h2>${d.title || 'Daily Brief'}</h2>
          <p class="muted">매일 아침 시장을 읽는 시간</p>
          ${
            d.bullets?.length
              ? `<h3>📌 핵심 요약</h3><ul>${d.bullets.map(i => `<li>${i}</li>`).join('')}</ul>`
              : ''
          }
          ${
            d.schedule?.length
              ? `<h3 style="margin-top:12px">🕒 오늘 일정</h3><ul>${d.schedule
                  .map(i => `<li>${i}</li>`)
                  .join('')}</ul>`
              : ''
          }
        </section>
        <aside class="card" style="grid-column: span 4;">
          <h2>퀵 차트</h2>
          <x-tv-chart symbol="${d.chart?.symbol || d.symbol || 'FX:XAUUSD'}" interval="${
      d.chart?.interval || d.interval || '60'
    }" ratio="16:9" min_height="420"></x-tv-chart>
        </aside>
      </div>
      <p class="muted" style="margin-top:12px"><a href="#/daily-brief">← 목록으로</a></p>
    `
  } catch {
    wrap.innerHTML = `<div class="card"><h2>자료를 찾지 못했습니다</h2></div>`
  }
}

/* ===== Trade Journal ===== */
const AIDX = '/analyses/index.json'

function koBias(b) {
  return b === 'bullish' ? '상승' : b === 'bearish' ? '하락' : '중립'
}
function badge(bias) {
  return `<span class="badge ${bias}">${koBias(bias || 'neutral')}</span>`
}
function pillS(v) {
  return `<span class="pill level">지지 ${v}</span>`
}
function pillR(v) {
  return `<span class="pill res">저항 ${v}</span>`
}

async function fetchJSON(path) {
  const res = await fetch(path + '?_=' + Date.now())
  if (!res.ok) throw 0
  return res.json()
}

async function loadAnalysesList() {
  const list = document.getElementById('anal-list')
  if (!list) return
  list.innerHTML = `<p class="muted">불러오는 중…</p>`
  try {
    const items = await fetchJSON(AIDX) // [{slug,title,symbol,tf,date,tags,bias}]
    list.dataset.raw = JSON.stringify(items)
    renderAnalysesListFiltered()

    const slugInUrl = currentSlugFromQuery()
    if (!slugInUrl && items.length) {
      await renderAnalysisDetailBySlug(items[0].slug)
      const first = items[0]
      const host = document.getElementById(`pv-${first.slug}`)
      if (host && !host.dataset.rendered) {
        host.innerHTML = `<x-tv-chart symbol="${first.symbol}" interval="60" ratio="16:9" min_height="220"></x-tv-chart>`
        host.dataset.rendered = '1'
        const btn = document.querySelector(`.pv-btn[data-slug="${first.slug}"]`)
        if (btn) btn.textContent = '차트 닫기'
      }
    }
  } catch {
    list.innerHTML = `<p class="muted">자료가 없습니다</p>`
  }
}

function renderAnalysesListFiltered() {
  const list = document.getElementById('anal-list')
  if (!list) return
  const q = (document.getElementById('anal-search')?.value || '').toLowerCase()
  const bias = document.getElementById('anal-bias')?.value || ''
  const raw = JSON.parse(list.dataset.raw || '[]')
  const items = raw.filter(it => {
    const hay = [it.title, it.symbol, it.tf, it.date, ...(it.tags || [])].join(' ').toLowerCase()
    const hit = hay.includes(q)
    const okBias = !bias || it.bias === bias
    return hit && okBias
  })

  list.innerHTML =
    items
      .map(
        it => `
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
      ${
        it.tags?.length
          ? `<div class="row" style="margin-top:6px">${it.tags
              .map(t => `<span class="pill">#${t}</span>`)
              .join('')}</div>`
          : ''
      }
      <div class="preview" id="pv-${it.slug}" style="margin-top:10px;"></div>
    </article>
  `
      )
      .join('') || `<p class="muted">검색 결과가 없습니다</p>`

  list.querySelectorAll('.pv-btn').forEach(btn => {
    btn.onclick = () => {
      const slug = btn.dataset.slug
      const symbol = btn.dataset.symbol
      const host = document.getElementById(`pv-${slug}`)
      if (!host) return
      if (host.dataset.rendered === '1') {
        host.innerHTML = ''
        host.dataset.rendered = '0'
        btn.textContent = '미리보기 차트'
      } else {
        host.innerHTML = `<x-tv-chart symbol="${symbol}" interval="${btn.dataset.ivl}" ratio="16:9" min_height="220"></x-tv-chart>`
        host.dataset.rendered = '1'
        btn.textContent = '차트 닫기'
      }
    }
  })
}

async function renderAnalysisDetailBySlug(slug) {
  const box = document.getElementById('anal-detail')
  if (!box) return
  if (!slug) {
    box.innerHTML = `<p class="muted">좌측에서 항목을 선택하면 상세 내용을 볼 수 있습니다.</p>`
    return
  }

  box.innerHTML = `<p class="muted">불러오는 중…</p>`
  try {
    const d = await fetchJSON(`/analyses/${slug}.json`)
    const ivl = d.chart?.interval || '60'
    const sym = d.chart?.symbol || d.symbol

    box.innerHTML = `
      <h2>${d.title} ${badge(d.bias)}</h2>
      <p class="muted">${d.symbol} · ${d.tf} · ${d.date}</p>

      <h3>지지 / 저항</h3>
      <div class="row" style="margin-top:6px">
        ${(d.supports || []).map(pillS).join('')}
        ${(d.resistances || []).map(pillR).join('')}
      </div>

      ${d.tags?.length ? `<div class="row" style="margin-top:6px">${d.tags.map(t => `#${t}`).join(' ')}</div>` : ''}

      ${d.context ? `<h3 style="margin-top:12px">배경</h3><p>${d.context}</p>` : ''}
      ${d.view ? `<h3 style="margin-top:12px">관점</h3><p>${d.view}</p>` : ''}
      ${d.invalidation ? `<p class="meta" style="margin-top:6px">무효화 조건: ${d.invalidation}</p>` : ''}

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
    `

    const sel = document.getElementById('detail-interval')
    if (sel) {
      Array.from(sel.options).forEach(o => {
        o.selected = o.value === ivl
      })
      sel.onchange = () => {
        const chart = document.getElementById('detail-chart')
        if (chart) chart.setAttribute('interval', sel.value)
      }
    }
  } catch {
    box.innerHTML = `<p class="muted">자료를 찾지 못했습니다</p>`
  }
}

/* ===== 背景动效：K 线网格（低占用） ===== */
;(() => {
  if (window.__homeFxInit) return
  window.__homeFxInit = true

  // 卡片入场
  const cards = document.querySelectorAll('.card')
  cards.forEach((c, i) => {
    c.classList.add('reveal')
    c.style.transitionDelay = i * 60 + 'ms'
  })
  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          entries => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                e.target.classList.add('in')
                io.unobserve(e.target)
              }
            })
          },
          { threshold: 0.12 }
        )
      : null
  if (io) cards.forEach(c => io.observe(c))
  else cards.forEach(c => c.classList.add('in'))

  // 背景画布
  const cvs = document.getElementById('bgfx')
  if (!cvs || cvs.dataset.enabled !== 'true') return
  const ctx = cvs.getContext('2d')
  let w = 0,
    h = 0,
    dpr = 1

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = cvs.width = Math.floor(innerWidth * dpr)
    h = cvs.height = Math.floor(innerHeight * dpr)
    cvs.style.width = innerWidth + 'px'
    cvs.style.height = innerHeight + 'px'
    setupSeries()
  }
  addEventListener('resize', resize)
  resize()

  const COL_GRID = 'rgba(255,255,255,0.05)'
  function cssVar(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
  }
  function colors() {
    return {
      up: cssVar('--success', '#16c784'),
      down: cssVar('--danger', '#ea3943'),
      wick: 'rgba(200,210,235,0.30)',
    }
  }

  let cw, gap, step, N, padTop, padBot, minY, maxY, mid, seq
  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v
  }

  function setupSeries() {
    cw = Math.max(6 * dpr, Math.min(10 * dpr, Math.floor(w / 140)))
    gap = Math.max(3 * dpr, Math.min(6 * dpr, Math.floor(cw * 0.6)))
    step = cw + gap
    N = Math.ceil(w / step) + 4

    padTop = 40 * dpr
    padBot = 40 * dpr
    minY = padTop
    maxY = h - padBot
    mid = (minY + maxY) / 2

    seq = []
    let p0 = mid + (Math.random() - 0.5) * 60 * dpr
    for (let i = 0; i < N; i++) {
      const c = makeCandle(p0)
      seq.push(c)
      p0 = c.c
    }
  }

  function makeCandle(prevClose) {
    const drift = (mid - prevClose) * 0.02
    const noise = (Math.random() - 0.5) * 18 * dpr
    const open = prevClose + (Math.random() - 0.5) * 6 * dpr
    let close = open + drift + noise
    close = clamp(close, minY + 6 * dpr, maxY - 6 * dpr)

    const body = Math.abs(close - open)
    const vol = Math.max(12 * dpr, Math.min(38 * dpr, body * 2 + 14 * dpr))
    const high = clamp(Math.max(open, close) + vol * (0.4 + Math.random() * 0.6), minY, maxY)
    const low = clamp(Math.min(open, close) - vol * (0.4 + Math.random() * 0.6), minY, maxY)

    return { o: open, h: high, l: low, c: close }
  }

  function drawGrid() {
    const gridGap = 72 * dpr
    ctx.save()
    ctx.strokeStyle = COL_GRID
    ctx.lineWidth = 1
    for (let x = 0; x <= w; x += gridGap) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y <= h; y += gridGap) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    ctx.restore()
  }

  function drawCandle(c, x, col) {
    const up = c.c < c.o // y 向下
    const bodyTop = Math.min(c.o, c.c)
    const bodyBot = Math.max(c.o, c.c)

    ctx.strokeStyle = col.wick
    ctx.lineWidth = Math.max(1, Math.floor(1 * dpr))
    ctx.beginPath()
    ctx.moveTo(x + cw / 2, c.h)
    ctx.lineTo(x + cw / 2, c.l)
    ctx.stroke()

    ctx.fillStyle = up ? col.up : col.down
    const bh = Math.max(2 * dpr, bodyBot - bodyTop)
    ctx.globalAlpha = 0.55
    ctx.fillRect(Math.floor(x), Math.floor(bodyTop), Math.floor(cw), Math.floor(bh))
    ctx.globalAlpha = 1
  }

  const barMs = 550
  let offset = 0,
    lastT = 0,
    running = true
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden
  })

  function frame(t) {
    if (!running) {
      requestAnimationFrame(frame)
      return
    }
    if (!lastT) lastT = t
    const dt = t - lastT
    lastT = t

    const pxPerMs = step / barMs
    offset += pxPerMs * dt

    if (offset >= step) {
      offset -= step
      seq.shift()
      const prev = seq[seq.length - 1].c
      seq.push(makeCandle(prev))
      mid += (Math.random() - 0.5) * 2 * dpr
      mid = clamp(mid, minY + (maxY - minY) * 0.35, maxY - (maxY - minY) * 0.35)
    }

    ctx.clearRect(0, 0, w, h)
    drawGrid()

    const gradTop = ctx.createLinearGradient(0, 0, 0, padTop * 2)
    gradTop.addColorStop(0, 'rgba(0,0,0,0.45)')
    gradTop.addColorStop(1, 'rgba(0,0,0,0.0)')
    ctx.fillStyle = gradTop
    ctx.fillRect(0, 0, w, padTop * 2)

    const gradBot = ctx.createLinearGradient(0, h - padBot * 2, 0, h)
    gradBot.addColorStop(0, 'rgba(0,0,0,0.0)')
    gradBot.addColorStop(1, 'rgba(0,0,0,0.45)')
    ctx.fillStyle = gradBot
    ctx.fillRect(0, h - padBot * 2, w, padBot * 2)

    const col = colors()
    let x = -offset
    for (let i = 0; i < seq.length; i++) drawCandle(seq[i], x + i * step, col)

    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
})()

/* ===== Knowledge Lab: syllabus + renderer (保持) ===== */

const KL_KEY = 'kl.progress.v1'
let KL_QUERY = '' // 검색어

// ——— 커리큘럼（可继续补充 link）———
const SYLLABUS = [
  { level: 'Preschool', icon: '🎓', desc: '입문 준비',
    lessons: [
      { name: '외환거래란 무엇인가?', link: '#/articles/what-is-forex' },
      { name: '외환은 어떻게 거래하나?', link: '#/articles/how-to-trade-forex' },
      { name: '언제 거래할 수 있나?', link: '#/articles/when-to-trade-forex' },
      { name: '누가 외환을 거래하나?', link: '#/articles/who-trades-forex' },
      { name: '왜 외환을 거래하나?', link: '#/articles/why-trade-forex' },
      { name: '마진거래 101: 마진계좌의 동작 원리', link: '#/articles/margin-101' },
    ] },
  { level: 'Kindergarten', icon: '🧩', desc: '기초 개념',
    lessons: [
      { name: '포렉스 브로커 101', link: '#/articles/forex-brokers-101' },
      { name: '세 가지 분석 방법', link: '#/articles/three-types-of-analysis' },
      { name: '차트의 종류', link: '#/articles/types-of-charts' },
    ] },
  // ……其余分组保持你原来的……
]

function klLoad() {
  try {
    return JSON.parse(localStorage.getItem(KL_KEY) || '{}')
  } catch {
    return {}
  }
}
function klSave(obj) {
  localStorage.setItem(KL_KEY, JSON.stringify(obj))
}
function ensureKLControls() {
  const host = document.getElementById('kl-syllabus')
  if (!host) return
  if (document.getElementById('kl-controls')) return

  const bar = document.createElement('div')
  bar.id = 'kl-controls'
  bar.className = 'card'
  bar.style.marginBottom = '14px'
  bar.innerHTML = `
    <div class="toolbar" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <input id="kl-q" class="search" placeholder="강의 검색…" style="min-width:220px">
      <button id="kl-expand" class="btn">전체 펼치기</button>
      <button id="kl-collapse" class="btn">전체 접기</button>
      <button id="kl-start" class="btn" style="font-weight:700">학습 시작</button>
    </div>`
  host.parentElement.insertBefore(bar, host)

  document.getElementById('kl-q').oninput = e => {
    KL_QUERY = (e.target.value || '').toLowerCase()
    renderKnowledgeLab()
  }
  document.getElementById('kl-expand').onclick = () =>
    document.querySelectorAll('.kl-level').forEach(s => s.classList.remove('collapsed'))
  document.getElementById('kl-collapse').onclick = () =>
    document.querySelectorAll('.kl-level').forEach(s => s.classList.add('collapsed'))
  document.getElementById('kl-start').onclick = jumpToFirstIncomplete
}
function renderKnowledgeLab() {
  const host = document.getElementById('kl-syllabus')
  if (!host) return
  ensureKLControls()

  const progress = klLoad()
  const total = SYLLABUS.reduce((acc, g) => acc + g.lessons.length, 0)
  const done = Object.values(progress).filter(Boolean).length
  const pct = total ? Math.round((done / total) * 100) : 0

  const bar = document.getElementById('kl-progress')
  const label = document.getElementById('kl-progress-label')
  const stats = document.getElementById('kl-stats')
  if (bar) bar.style.width = pct + '%'
  if (label) label.textContent = pct + '%'
  if (stats) stats.textContent = `${done} / ${total} 강의`

  host.innerHTML = SYLLABUS.map(group => {
    const lid = group.level.replace(/\s+/g, '-').toLowerCase()
    const list = group.lessons
      .map(item => {
        const obj = typeof item === 'string' ? { name: item, link: '' } : item
        const name = obj.name
        const link = obj.link || ''
        const visible =
          !KL_QUERY ||
          name.toLowerCase().includes(KL_QUERY) ||
          group.level.toLowerCase().includes(KL_QUERY)
        const key = `${group.level}:${name}`
        const isDone = !!progress[key]

        const start = link
          ? `<a class="kl-item ${isDone ? 'done' : ''}" href="${link}" ${
              link.startsWith('#') ? '' : 'target="_blank" rel="noopener"'
            } data-key="${key}" style="${visible ? '' : 'display:none'}">`
          : `<div class="kl-item ${isDone ? 'done' : ''}" data-key="${key}" style="${
              visible ? '' : 'display:none'
            }">`
        const end = link ? `</a>` : `</div>`

        return `
        <div class="kl-item-row" style="${visible ? '' : 'display:none'}">
          <button class="kl-dot-btn" data-key="${key}" aria-label="완료 표시" title="완료 표시" style="all:unset">
            <span class="kl-dot">${isDone ? '✓' : ''}</span>
          </button>
          ${start}
            <div class="kl-name">${name}</div>
            <span class="kl-tag">Lesson</span>
          ${end}
        </div>`
      })
      .join('')

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
      </section>`
  }).join('')

  host.querySelectorAll('.lv-head').forEach(h => {
    h.onclick = () => {
      const sec = document.querySelector(h.dataset.toggle)
      if (sec) sec.classList.toggle('collapsed')
    }
  })

  host.querySelectorAll('.kl-dot-btn').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault()
      e.stopPropagation()
      const key = btn.dataset.key
      const p = klLoad()
      p[key] = !p[key]
      klSave(p)
      renderKnowledgeLab()
    }
  })

  const resetBtn = document.getElementById('kl-reset')
  if (resetBtn) {
    resetBtn.onclick = () => {
      localStorage.removeItem(KL_KEY)
      renderKnowledgeLab()
    }
  }
}
function jumpToFirstIncomplete() {
  const progress = klLoad()
  for (const g of SYLLABUS) {
    for (const item of g.lessons) {
      const obj = typeof item === 'string' ? { name: item, link: '' } : item
      const key = `${g.level}:${obj.name}`
      if (!progress[key]) {
        const lid = g.level.replace(/\s+/g, '-').toLowerCase()
        const sec = document.getElementById(`lv-${lid}`)
        if (sec) sec.classList.remove('collapsed')

        const row = [...document.querySelectorAll(`#lv-${lid} .kl-item-row`)].find(
          e => e.querySelector('[data-key]')?.dataset.key === key
        )
        if (row) {
          row.scrollIntoView({ behavior: 'smooth', block: 'center' })
          row.animate(
            [{ boxShadow: '0 0 0 rgba(0,0,0,0)' }, { boxShadow: '0 0 0 6px rgba(122,125,255,.25)' }],
            { duration: 600, direction: 'alternate', iterations: 2 }
          )
        }
        if (obj.link) {
          if (obj.link.startsWith('#')) location.hash = obj.link
          else window.open(obj.link, '_blank', 'noopener')
        }
        return
      }
    }
  }
}

/* ========== 路由绑定（只保留一份） ========== */
window.addEventListener('hashchange', async () => {
  const m = matchRoute()
  const routeId = m.id
  console.log('[router] hashchange ->', location.hash, '=>', routeId)
  show(routeId)

  if (routeId === 'daily-brief') renderDailyBriefList()
  if (routeId === 'daily-brief-detail') renderDailyBriefDetail(m.slug)
  if (routeId === 'trade-journal') {
    await loadAnalysesList()
    const s = document.getElementById('anal-search')
    const b = document.getElementById('anal-bias')
    if (s) s.oninput = renderAnalysesListFiltered
    if (b) b.onchange = renderAnalysesListFiltered
    await renderAnalysisDetailBySlug(currentSlugFromQuery())
  }
  if (routeId === 'knowledge-lab') renderKnowledgeLab()
})

document.addEventListener('DOMContentLoaded', async () => {
  const m = matchRoute()
  const routeId = m.id
  console.log('[router] DOMContentLoaded ->', location.hash, '=>', routeId)
  show(routeId)

  if (routeId === 'daily-brief') renderDailyBriefList()
  if (routeId === 'daily-brief-detail') renderDailyBriefDetail(m.slug)
  if (routeId === 'trade-journal') {
    await loadAnalysesList()
    const s = document.getElementById('anal-search')
    const b = document.getElementById('anal-bias')
    if (s) s.oninput = renderAnalysesListFiltered
    if (b) b.onchange = renderAnalysesListFiltered
    await renderAnalysisDetailBySlug(currentSlugFromQuery())
  }
  if (routeId === 'knowledge-lab') renderKnowledgeLab()
})

/* ========== 知识页本地化（可选） ========== */
function localizeKnowledgeLabKO() {
  const sec = document.querySelector('section[data-route="knowledge-lab"]')
  if (!sec) return
  const h1 = sec.querySelector('.hero h1')
  if (h1) h1.textContent = '체계적 외환 지식 · 로드맵'
  const sub = sec.querySelector('.hero .muted')
  if (sub) sub.textContent = 'Preschool부터 Graduation까지, 아래에서 위로 쌓아 가는 체계적 학습 경로.'
  const progressTitle = sec.querySelector('.card h2')
  if (progressTitle && /进度|总体|整体|전체 진행도/.test(progressTitle.textContent)) {
    progressTitle.textContent = '전체 진행도'
  }
  const resetBtn = sec.querySelector('#kl-reset, .progress-reset, .kl-reset')
  if (resetBtn) resetBtn.textContent = '진행도 초기화'
  const q = document.getElementById('kl-q')
  if (q) q.placeholder = '강의 검색…'
  const exp = document.getElementById('kl-expand')
  if (exp) exp.textContent = '전체 펼치기'
  const col = document.getElementById('kl-collapse')
  if (col) col.textContent = '전체 접기'
  const start = document.getElementById('kl-start')
  if (start) start.textContent = '학습 시작'
}
window.addEventListener('hashchange', () => {
  if (location.hash === '#/knowledge-lab') localizeKnowledgeLabKO()
})
document.addEventListener('DOMContentLoaded', () => {
  if (!location.hash || location.hash === '#/knowledge-lab') localizeKnowledgeLabKO()
})
