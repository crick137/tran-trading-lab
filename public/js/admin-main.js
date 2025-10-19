// public/js/admin-main.js
// Enhanced admin interactions: tabs, diagnostics, CRUD helpers

const Admin = window.Admin || {};
const $ = Admin.$ || ((selector, root = document) => root.querySelector(selector));
const $$ = Admin.$$ || ((selector, root = document) => Array.from(root.querySelectorAll(selector)));

let __ADMIN_TOKEN = sessionStorage.getItem('tran_admin_token') || '';
function __setToken(value) {
  __ADMIN_TOKEN = value || '';
  if (value) {
    sessionStorage.setItem('tran_admin_token', value);
  } else {
    sessionStorage.removeItem('tran_admin_token');
  }
}

async function __apiFetch(url, init = {}) {
  if (window.Admin && typeof window.Admin.apiFetch === 'function') {
    return window.Admin.apiFetch(url, init);
  }
  const opts = { credentials: 'include', cache: 'no-store', ...init };
  if (!opts.method) opts.method = 'GET';
  const headers = new Headers(opts.headers || {});
  if (__ADMIN_TOKEN) headers.set('Authorization', 'Bearer ' + __ADMIN_TOKEN);
  opts.headers = headers;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(new DOMException('timeout', 'AbortError')), 12000);
  opts.signal = ctrl.signal;
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch (_) {}
    return { res, ok: res.ok, status: res.status, data, text };
  } finally {
    clearTimeout(timer);
  }
}

function unwrapResponse(response, context) {
  if (!response.ok) {
    const message = (response.data && (response.data.error || response.data.message)) || response.text || context || ('HTTP ' + response.status);
    throw new Error(message);
  }
  return response.data;
}

const today = () => new Date().toISOString().slice(0, 10);
const splitLines = (value) => (value || '').split('\n').map((line) => line.trim()).filter((line) => line.length);
const joinLines = (arr) => (Array.isArray(arr) ? arr.join('\n') : '');
const safeStringify = (value) => {
  try { return JSON.stringify(value, null, 2); }
  catch { return ''; }
};

async function fetchIndex(prefix) {
  const r = await __apiFetch(`/api/${prefix}/index.json?_=${Date.now()}`);
  return unwrapResponse(r, 'FETCH_INDEX_FAILED');
}

async function fetchDocument(prefix, slug) {
  const r = await __apiFetch(`/api/${prefix}/${encodeURIComponent(slug)}.json?_=${Date.now()}`);
  return unwrapResponse(r, 'FETCH_DOCUMENT_FAILED');
}

async function refreshIndexView(prefix, target) {
  if (!target) return;
  target.textContent = '正在加载...';
  try {
    const list = await fetchIndex(prefix);
    target.textContent = JSON.stringify(list, null, 2);
  } catch (e) {
    target.textContent = '失败: ' + (e.message || e);
  }
}

function setupTabs() {
  const buttons = $$('.tab-btn');
  const panels = $$('.tab-panel');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === 'tab-' + btn.dataset.tab);
      });
    });
  });
}

function bindDiagnostics() {
  const btn = $('#run-diag');
  const wrap = $('#diag-wrap');
  const status = $('#diag-status');
  const output = $('#diag-output');
  if (!btn || !wrap) return;
  btn.addEventListener('click', async () => {
    wrap.style.display = 'block';
    if (status) status.textContent = '正在运行诊断...';
    if (output) output.textContent = '';
    try {
      const res = await fetch('/api/admin/diag?_=' + Date.now(), { credentials: 'include', cache: 'no-store' });
      const text = await res.text();
      let json = null;
      try { json = JSON.parse(text); } catch (_) {}
      if (!res.ok) throw new Error((json && json.error) || text || 'HTTP ' + res.status);
      if (status) {
        const env = json.env?.vercelEnv || '未知';
        const token = json.tokenDetected ? '令牌正常' : '令牌缺失';
        const conn = json.connectivity?.ok ? '连通正常' : ('连接异常: ' + (json.connectivity?.error || 'n/a'));
        status.textContent = `Env: ${env} · ${token} · ${conn}`;
      }
      if (output) output.textContent = JSON.stringify(json, null, 2);
    } catch (e) {
      if (status) status.textContent = '诊断失败: ' + (e.message || e);
    }
  });
}

function bindDailyBrief() {
  const fields = {
    slug: $('#b-slug'),
    title: $('#b-title'),
    bullets: $('#b-bullets'),
    schedule: $('#b-schedule'),
    symbol: $('#b-symbol'),
    interval: $('#b-interval')
  };
  const msg = $('#b-msg');
  const indexView = $('#b-index');
  const btnPublish = $('#b-publish');
  const btnDelete = $('#b-delete');
  const btnReuse = $('#b-reuse');
  const btnPreview = $('#b-preview');
  const btnClear = $('#b-clear');
  const btnRefresh = $('#b-refresh');

  const ensureDefaultSlug = () => {
    if (fields.slug && !fields.slug.value) fields.slug.value = today();
  };

  const clearForm = () => {
    if (fields.slug) fields.slug.value = today();
    if (fields.title) fields.title.value = '';
    if (fields.bullets) fields.bullets.value = '';
    if (fields.schedule) fields.schedule.value = '';
    if (fields.symbol) fields.symbol.value = '';
    if (fields.interval) fields.interval.value = '60';
  };

  const populate = (doc) => {
    if (!doc) return;
    if (fields.slug) fields.slug.value = doc.slug || today();
    if (fields.title) fields.title.value = doc.title || '';
    if (fields.bullets) fields.bullets.value = joinLines(doc.bullets);
    if (fields.schedule) fields.schedule.value = joinLines(doc.schedule);
    if (fields.symbol) fields.symbol.value = (doc.chart && doc.chart.symbol) || doc.symbol || '';
    if (fields.interval) fields.interval.value = (doc.chart && doc.chart.interval) || '60';
  };

  ensureDefaultSlug();
  refreshIndexView('daily-brief', indexView);

  if (btnPublish) btnPublish.addEventListener('click', async () => {
    ensureDefaultSlug();
    if (msg) msg.textContent = '正在发布...';
    try {
      const payload = {
        slug: fields.slug?.value?.trim() || today(),
        title: fields.title?.value?.trim() || undefined,
        bullets: splitLines(fields.bullets?.value || ''),
        schedule: splitLines(fields.schedule?.value || ''),
        chart: {
          symbol: fields.symbol?.value?.trim() || undefined,
          interval: fields.interval?.value || '60'
        }
      };
      const r = await __apiFetch(`/api/daily-brief/${encodeURIComponent(payload.slug)}.json`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      unwrapResponse(r, 'PUBLISH_FAILED');
      if (msg) msg.textContent = '发布成功';
      await refreshIndexView('daily-brief', indexView);
    } catch (e) {
      if (msg) msg.textContent = '发布失败: ' + (e.message || e);
    }
  });

  if (btnDelete) btnDelete.addEventListener('click', async () => {
    ensureDefaultSlug();
    const slug = fields.slug?.value?.trim();
    if (!slug) return;
    if (!confirm(`确认删除每日简报：${slug}？`)) return;
    if (msg) msg.textContent = '正在删除...';
    try {
      const r = await __apiFetch(`/api/daily-brief/${encodeURIComponent(slug)}.json`, { method: 'DELETE' });
      unwrapResponse(r, 'DELETE_FAILED');
      if (msg) msg.textContent = '删除成功';
      await refreshIndexView('daily-brief', indexView);
    } catch (e) {
      if (msg) msg.textContent = '删除失败: ' + (e.message || e);
    }
  });

  if (btnReuse) btnReuse.addEventListener('click', async () => {
    if (msg) msg.textContent = '正在载入线上数据...';
    try {
      const list = await fetchIndex('daily-brief');
      if (!Array.isArray(list) || !list.length) throw new Error('暂无历史数据');
      const latest = typeof list[0] === 'string' ? list[0] : list[0]?.slug;
      if (!latest) throw new Error('索引数据无效');
      const doc = await fetchDocument('daily-brief', latest);
      populate(doc || {});
      if (fields.slug) fields.slug.value = today();
      if (msg) msg.textContent = `已载入 ${latest}，Slug 自动改为今日。`;
    } catch (e) {
      if (msg) msg.textContent = '载入线上数据失败: ' + (e.message || e);
    }
  });

  if (btnPreview) btnPreview.addEventListener('click', () => {
    ensureDefaultSlug();
    const slug = fields.slug?.value?.trim() || today();
    window.open(`/#/daily-brief/${encodeURIComponent(slug)}`, '_blank', 'noopener');
  });

  if (btnClear) btnClear.addEventListener('click', () => {
    clearForm();
    if (msg) msg.textContent = '';
  });

  if (btnRefresh) btnRefresh.addEventListener('click', () => {
    refreshIndexView('daily-brief', indexView);
  });
}

function bindAnalyses() {
  const fields = {
    slug: $('#a-slug'), title: $('#a-title'), symbol: $('#a-symbol'), tf: $('#a-tf'), date: $('#a-date'), bias: $('#a-bias'),
    tags: $('#a-tags'), supports: $('#a-supports'), resistances: $('#a-resistances'), context: $('#a-context'), view: $('#a-view'),
    invalidation: $('#a-invalidation'), chartSymbol: $('#a-chart-symbol'), chartInterval: $('#a-chart-interval')
  };
  const msg = $('#a-msg');
  const indexView = $('#a-index');
  const buttons = {
    publish: $('#a-publish'), delete: $('#a-delete'), reuse: $('#a-reuse'), preview: $('#a-preview'), clear: $('#a-clear'), refresh: $('#a-refresh')
  };

  const clearForm = () => {
    if (fields.slug) fields.slug.value = '';
    if (fields.title) fields.title.value = '';
    if (fields.symbol) fields.symbol.value = '';
    if (fields.tf) fields.tf.value = '';
    if (fields.date) fields.date.value = today();
    if (fields.bias) fields.bias.value = 'neutral';
    if (fields.tags) fields.tags.value = '';
    if (fields.supports) fields.supports.value = '';
    if (fields.resistances) fields.resistances.value = '';
    if (fields.context) fields.context.value = '';
    if (fields.view) fields.view.value = '';
    if (fields.invalidation) fields.invalidation.value = '';
    if (fields.chartSymbol) fields.chartSymbol.value = '';
    if (fields.chartInterval) fields.chartInterval.value = '60';
  };

  const populate = (doc) => {
    if (!doc) return;
    if (fields.slug) fields.slug.value = doc.slug || '';
    if (fields.title) fields.title.value = doc.title || '';
    if (fields.symbol) fields.symbol.value = doc.symbol || '';
    if (fields.tf) fields.tf.value = doc.tf || doc.interval || '';
    if (fields.date) fields.date.value = doc.date || today();
    if (fields.bias) fields.bias.value = doc.bias || 'neutral';
    if (fields.tags) fields.tags.value = Array.isArray(doc.tags) ? doc.tags.join(', ') : '';
    if (fields.supports) fields.supports.value = joinLines(doc.supports);
    if (fields.resistances) fields.resistances.value = joinLines(doc.resistances);
    if (fields.context) fields.context.value = doc.context || '';
    if (fields.view) fields.view.value = doc.view || '';
    if (fields.invalidation) fields.invalidation.value = doc.invalidation || '';
    if (fields.chartSymbol) fields.chartSymbol.value = (doc.chart && doc.chart.symbol) || doc.chartSymbol || doc.symbol || '';
    if (fields.chartInterval) fields.chartInterval.value = (doc.chart && doc.chart.interval) || doc.chartInterval || '60';
  };

  refreshIndexView('analyses', indexView);

  if (buttons.publish) buttons.publish.addEventListener('click', async () => {
    const slug = fields.slug?.value?.trim();
    if (!slug) return msg && (msg.textContent = '请输入 slug');
    if (msg) msg.textContent = '正在发布...';
    try {
      const payload = {
        slug,
        title: fields.title?.value?.trim() || undefined,
        symbol: fields.symbol?.value?.trim() || undefined,
        tf: fields.tf?.value?.trim() || undefined,
        date: fields.date?.value?.trim() || today(),
        bias: fields.bias?.value || 'neutral',
        tags: splitLines((fields.tags?.value || '').replace(/,/g, '\n')),
        supports: splitLines(fields.supports?.value || ''),
        resistances: splitLines(fields.resistances?.value || ''),
        context: fields.context?.value?.trim() || undefined,
        view: fields.view?.value?.trim() || undefined,
        invalidation: fields.invalidation?.value?.trim() || undefined,
        chart: {
          symbol: fields.chartSymbol?.value?.trim() || undefined,
          interval: fields.chartInterval?.value || '60'
        }
      };
      const r = await __apiFetch(`/api/analyses/${encodeURIComponent(slug)}.json`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      unwrapResponse(r, 'PUBLISH_FAILED');
      if (msg) msg.textContent = '发布成功';
      await refreshIndexView('analyses', indexView);
    } catch (e) {
      if (msg) msg.textContent = '发布失败: ' + (e.message || e);
    }
  });

  if (buttons.delete) buttons.delete.addEventListener('click', async () => {
    const slug = fields.slug?.value?.trim();
    if (!slug) return msg && (msg.textContent = '请输入 slug');
    if (!confirm(`确认删除市场分析：${slug}？`)) return;
    if (msg) msg.textContent = '正在删除...';
    try {
      const r = await __apiFetch(`/api/analyses/${encodeURIComponent(slug)}.json`, { method: 'DELETE' });
      unwrapResponse(r, 'DELETE_FAILED');
      if (msg) msg.textContent = '删除成功';
      await refreshIndexView('analyses', indexView);
    } catch (e) {
      if (msg) msg.textContent = '删除失败: ' + (e.message || e);
    }
  });

  if (buttons.reuse) buttons.reuse.addEventListener('click', async () => {
    if (msg) msg.textContent = '正在载入线上数据...';
    try {
      const list = await fetchIndex('analyses');
      if (!Array.isArray(list) || !list.length) throw new Error('暂无历史数据');
      const latest = typeof list[0] === 'string' ? list[0] : list[0]?.slug;
      if (!latest) throw new Error('索引数据无效');
      const doc = await fetchDocument('analyses', latest);
      populate(doc || {});
      if (fields.slug && doc?.slug) fields.slug.value = `${doc.slug}-${today()}`;
      if (msg) msg.textContent = `已载入 ${latest}，Slug 已追加今日日期。`;
    } catch (e) {
      if (msg) msg.textContent = '载入线上数据失败: ' + (e.message || e);
    }
  });

  if (buttons.preview) buttons.preview.addEventListener('click', () => {
    const slug = fields.slug?.value?.trim();
    if (!slug) return;
    window.open(`/#/trade-journal?slug=${encodeURIComponent(slug)}`, '_blank', 'noopener');
  });

  if (buttons.clear) buttons.clear.addEventListener('click', () => {
    clearForm();
    if (msg) msg.textContent = '';
  });

  if (buttons.refresh) buttons.refresh.addEventListener('click', () => {
    refreshIndexView('analyses', indexView);
  });
}

function bindNews() {
  const fields = {
    id: $('#n-id'), title: $('#n-title'), source: $('#n-source'), url: $('#n-url'), date: $('#n-date'), tags: $('#n-tags'), summary: $('#n-summary'), bullets: $('#n-bullets')
  };
  const msg = $('#n-msg');
  const indexView = $('#n-index');
  const buttons = {
    publish: $('#n-publish'), delete: $('#n-delete'), reuse: $('#n-reuse'), preview: $('#n-preview'), clear: $('#n-clear'), refresh: $('#n-refresh')
  };

  const clearForm = () => {
    if (fields.id) fields.id.value = `${today()}-1`;
    if (fields.title) fields.title.value = '';
    if (fields.source) fields.source.value = '';
    if (fields.url) fields.url.value = '';
    if (fields.date) fields.date.value = new Date().toISOString();
    if (fields.tags) fields.tags.value = '';
    if (fields.summary) fields.summary.value = '';
    if (fields.bullets) fields.bullets.value = '';
  };

  const populate = (doc) => {
    if (fields.id) fields.id.value = doc.id || `${today()}-1`;
    if (fields.title) fields.title.value = doc.title || '';
    if (fields.source) fields.source.value = doc.source || '';
    if (fields.url) fields.url.value = doc.url || '';
    if (fields.date) fields.date.value = doc.date || new Date().toISOString();
    if (fields.tags) fields.tags.value = Array.isArray(doc.tags) ? doc.tags.join(', ') : '';
    if (fields.summary) fields.summary.value = doc.summary || '';
    if (fields.bullets) fields.bullets.value = joinLines(doc.bullets);
  };

  clearForm();
  refreshIndexView('market-news', indexView);

  if (buttons.publish) buttons.publish.addEventListener('click', async () => {
    const id = fields.id?.value?.trim();
    if (!id) return msg && (msg.textContent = '请输入 ID');
    if (msg) msg.textContent = '正在发布...';
    try {
      const payload = {
        id,
        title: fields.title?.value?.trim() || undefined,
        source: fields.source?.value?.trim() || undefined,
        url: fields.url?.value?.trim() || undefined,
        date: fields.date?.value?.trim() || new Date().toISOString(),
        tags: splitLines((fields.tags?.value || '').replace(/,/g, '\n')),
        summary: fields.summary?.value?.trim() || undefined,
        bullets: splitLines(fields.bullets?.value || '')
      };
      const r = await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      unwrapResponse(r, 'PUBLISH_FAILED');
      if (msg) msg.textContent = '发布成功';
      await refreshIndexView('market-news', indexView);
    } catch (e) {
      if (msg) msg.textContent = '发布失败: ' + (e.message || e);
    }
  });

  if (buttons.delete) buttons.delete.addEventListener('click', async () => {
    const id = fields.id?.value?.trim();
    if (!id) return msg && (msg.textContent = '请输入 ID');
    if (!confirm(`确认删除市场快讯：${id}？`)) return;
    if (msg) msg.textContent = '正在删除...';
    try {
      const r = await __apiFetch(`/api/market-news/${encodeURIComponent(id)}.json`, { method: 'DELETE' });
      unwrapResponse(r, 'DELETE_FAILED');
      if (msg) msg.textContent = '删除成功';
      await refreshIndexView('market-news', indexView);
    } catch (e) {
      if (msg) msg.textContent = '删除失败: ' + (e.message || e);
    }
  });

  if (buttons.reuse) buttons.reuse.addEventListener('click', async () => {
    if (msg) msg.textContent = '正在载入线上数据...';
    try {
      const list = await fetchIndex('market-news');
      if (!Array.isArray(list) || !list.length) throw new Error('暂无历史数据');
      const latest = typeof list[0] === 'string' ? list[0] : list[0]?.id;
      if (!latest) throw new Error('索引数据无效');
      const doc = await fetchDocument('market-news', latest);
      populate(doc || {});
      if (fields.id) fields.id.value = `${today()}-1`;
      if (msg) msg.textContent = `已载入 ${latest}，ID 已更新为今日。`;
    } catch (e) {
      if (msg) msg.textContent = '载入线上数据失败: ' + (e.message || e);
    }
  });

  if (buttons.preview) buttons.preview.addEventListener('click', () => {
    window.open('/#/market-news', '_blank', 'noopener');
  });

  if (buttons.clear) buttons.clear.addEventListener('click', () => {
    clearForm();
    if (msg) msg.textContent = '';
  });

  if (buttons.refresh) buttons.refresh.addEventListener('click', () => {
    refreshIndexView('market-news', indexView);
  });
}

function bindResearchSyllabus() {
  const textarea = $('#r-json');
  const host = $('#r-structured');
  const msg = $('#r-msg');
  const btnLoad = $('#r-load');
  const btnSave = $('#r-save');
  const btnClear = $('#r-clear');
  const btnPreview = $('#r-preview');
  const btnAddLevel = $('#r-add-level');
  const btnExpandAll = $('#r-expand-all');
  const btnCollapseAll = $('#r-collapse-all');
  const btnSyncJson = $('#r-sync-json');

  if (!textarea && !host) return;

  let syllabusData = [];

  const setMessage = (text) => { if (msg) msg.textContent = text || ''; };

  const ensureLessonShape = (lesson = {}) => ({
    name: lesson.name || '',
    link: lesson.link || '',
    type: lesson.type || '',
    desc: lesson.desc || ''
  });

  const ensureLevelShape = (level = {}) => {
    const shaped = {
      level: level.level || '',
      desc: level.desc || '',
      icon: level.icon || '',
      lessons: Array.isArray(level.lessons) && level.lessons.length ? level.lessons.map(ensureLessonShape) : [ensureLessonShape()],
      _collapsed: !!level._collapsed
    };
    return shaped;
  };

  const sanitize = (data) => data.map((level) => ({
    level: level.level || '',
    desc: level.desc || '',
    icon: level.icon || '',
    lessons: (Array.isArray(level.lessons) ? level.lessons : []).map((lesson) => ({
      name: lesson.name || '',
      link: lesson.link || '',
      type: lesson.type || '',
      desc: lesson.desc || ''
    }))
  }));

  const syncTextarea = () => { if (textarea) textarea.value = safeStringify(sanitize(syllabusData)); };

  const moveLevel = (from, to) => {
    if (to < 0 || to >= syllabusData.length) return;
    const [item] = syllabusData.splice(from, 1);
    syllabusData.splice(to, 0, item);
    renderStructured();
    syncTextarea();
  };

  const moveLesson = (levelIdx, from, to) => {
    const level = syllabusData[levelIdx];
    if (!level) return;
    if (to < 0 || to >= level.lessons.length) return;
    const [item] = level.lessons.splice(from, 1);
    level.lessons.splice(to, 0, item);
    renderStructured();
    syncTextarea();
  };

  const renderStructured = () => {
    if (!host) return;
    host.innerHTML = '';
    syllabusData.forEach((level, levelIndex) => {
      syllabusData[levelIndex] = ensureLevelShape(level);
      const current = syllabusData[levelIndex];

      const card = document.createElement('div');
      card.className = 'syllabus-level';
      if (current._collapsed) card.classList.add('collapsed');

      const header = document.createElement('div');
      header.className = 'syllabus-level-header';

      const levelInput = document.createElement('input');
      levelInput.placeholder = 'Level name';
      levelInput.value = current.level;
      levelInput.addEventListener('input', (e) => {
        current.level = e.target.value;
        syncTextarea();
      });
      header.appendChild(levelInput);

      const descInput = document.createElement('input');
      descInput.placeholder = 'Description';
      descInput.value = current.desc;
      descInput.addEventListener('input', (e) => {
        current.desc = e.target.value;
        syncTextarea();
      });
      header.appendChild(descInput);

      const iconInput = document.createElement('input');
      iconInput.placeholder = 'Icon (emoji)';
      iconInput.value = current.icon;
      iconInput.addEventListener('input', (e) => {
        current.icon = e.target.value;
        syncTextarea();
      });
      header.appendChild(iconInput);

      const actions = document.createElement('div');
      actions.className = 'syllabus-level-actions';

      const addLessonBtn = document.createElement('button');
      addLessonBtn.textContent = '新增课程';
      addLessonBtn.addEventListener('click', () => {
        current.lessons.push(ensureLessonShape());
        renderStructured();
        syncTextarea();
      });
      actions.appendChild(addLessonBtn);

      const upBtn = document.createElement('button');
      upBtn.textContent = '上移';
      upBtn.disabled = levelIndex === 0;
      upBtn.addEventListener('click', () => moveLevel(levelIndex, levelIndex - 1));
      actions.appendChild(upBtn);

      const downBtn = document.createElement('button');
      downBtn.textContent = '下移';
      downBtn.disabled = levelIndex === syllabusData.length - 1;
      downBtn.addEventListener('click', () => moveLevel(levelIndex, levelIndex + 1));
      actions.appendChild(downBtn);

      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = current._collapsed ? '展开' : '收起';
      toggleBtn.addEventListener('click', () => {
        current._collapsed = !current._collapsed;
        renderStructured();
      });
      actions.appendChild(toggleBtn);

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '删除';
      removeBtn.addEventListener('click', () => {
        if (!confirm(`删除级别 "${current.level}"?`)) return;
        syllabusData.splice(levelIndex, 1);
        renderStructured();
        syncTextarea();
      });
      actions.appendChild(removeBtn);

      header.appendChild(actions);
      card.appendChild(header);

      const lessonsWrap = document.createElement('div');
      lessonsWrap.className = 'syllabus-lessons';
      current.lessons.forEach((lesson, lessonIndex) => {
        current.lessons[lessonIndex] = ensureLessonShape(lesson);
        const lessonData = current.lessons[lessonIndex];

        const row = document.createElement('div');
        row.className = 'lesson-row';

        const nameInput = document.createElement('input');
        nameInput.placeholder = '课程标题';
        nameInput.value = lessonData.name;
        nameInput.addEventListener('input', (e) => {
          lessonData.name = e.target.value;
          syncTextarea();
        });
        row.appendChild(nameInput);

        const linkInput = document.createElement('input');
        linkInput.placeholder = '课程链接 (#/articles/...)';
        linkInput.value = lessonData.link;
        linkInput.addEventListener('input', (e) => {
          lessonData.link = e.target.value;
          syncTextarea();
        });
        row.appendChild(linkInput);

        const typeInput = document.createElement('input');
        typeInput.placeholder = '标签/类别 (可选)';
        typeInput.value = lessonData.type;
        typeInput.addEventListener('input', (e) => {
          lessonData.type = e.target.value;
          syncTextarea();
        });
        row.appendChild(typeInput);

        const lessonActions = document.createElement('div');
        lessonActions.className = 'lesson-actions';

        const lessonUp = document.createElement('button');
        lessonUp.textContent = '上移';
        lessonUp.disabled = lessonIndex === 0;
        lessonUp.addEventListener('click', () => moveLesson(levelIndex, lessonIndex, lessonIndex - 1));
        lessonActions.appendChild(lessonUp);

        const lessonDown = document.createElement('button');
        lessonDown.textContent = '下移';
        lessonDown.disabled = lessonIndex === current.lessons.length - 1;
        lessonDown.addEventListener('click', () => moveLesson(levelIndex, lessonIndex, lessonIndex + 1));
        lessonActions.appendChild(lessonDown);

        const lessonRemove = document.createElement('button');
        lessonRemove.textContent = '删除';
        lessonRemove.addEventListener('click', () => {
          if (current.lessons.length <= 1) {
            lessonData.name = '';
            lessonData.link = '';
            lessonData.type = '';
            lessonData.desc = '';
          } else {
            current.lessons.splice(lessonIndex, 1);
          }
          renderStructured();
          syncTextarea();
        });
        lessonActions.appendChild(lessonRemove);

        row.appendChild(lessonActions);
        lessonsWrap.appendChild(row);

        const descArea = document.createElement('textarea');
        descArea.className = 'lesson-desc';
        descArea.placeholder = '课程简介 (可选)';
        descArea.value = lessonData.desc;
        descArea.addEventListener('input', (e) => {
          lessonData.desc = e.target.value;
          syncTextarea();
        });
        lessonsWrap.appendChild(descArea);
      });

      card.appendChild(lessonsWrap);
      host.appendChild(card);
    });
  };

  const loadOnline = async () => {
    setMessage('正在加载...');
    try {
      const res = await __apiFetch('/api/research/syllabus.json?_=' + Date.now());
      const data = unwrapResponse(res, 'FETCH_FAILED');
      const raw = Array.isArray(data?.syllabus) ? data.syllabus : Array.isArray(data) ? data : [];
      syllabusData = raw.map(ensureLevelShape);
      renderStructured();
      syncTextarea();
      setMessage('已加载线上课程数据。');
    } catch (e) {
      syllabusData = [];
      renderStructured();
      syncTextarea();
      setMessage('加载失败: ' + (e.message || e));
    }
  };

  const applyJsonToStructured = () => {
    if (!textarea) return;
    try {
      const parsed = JSON.parse(textarea.value || '[]');
      if (!Array.isArray(parsed)) throw new Error('JSON 数据必须为数组。');
      syllabusData = parsed.map(ensureLevelShape);
      renderStructured();
      syncTextarea();
      setMessage('结构视图已根据 JSON 更新。');
    } catch (e) {
      setMessage('Apply 失败: ' + (e.message || e));
    }
  };

  const saveOnline = async () => {
    setMessage('正在保存...');
    try {
      const payload = { syllabus: sanitize(syllabusData) };
      const res = await __apiFetch('/api/research/syllabus', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      unwrapResponse(res, 'SAVE_FAILED');
      setMessage('保存成功。');
    } catch (e) {
      setMessage('Save 失败: ' + (e.message || e));
    }
  };

  if (btnLoad) btnLoad.addEventListener('click', () => loadOnline());
  if (btnSave) btnSave.addEventListener('click', () => saveOnline());
  if (btnClear) btnClear.addEventListener('click', () => {
    syllabusData = [];
    renderStructured();
    syncTextarea();
    setMessage('已清空编辑器。');
  });
  if (btnPreview) btnPreview.addEventListener('click', () => window.open('/#/knowledge-lab', '_blank', 'noopener'));
  if (btnAddLevel) btnAddLevel.addEventListener('click', () => {
    syllabusData.push(ensureLevelShape({ level: '新课程阶段', lessons: [ensureLessonShape({ name: '课程标题' })] }));
    renderStructured();
    syncTextarea();
  });
  if (btnExpandAll) btnExpandAll.addEventListener('click', () => {
    syllabusData.forEach((level) => { level._collapsed = false; });
    renderStructured();
  });
  if (btnCollapseAll) btnCollapseAll.addEventListener('click', () => {
    syllabusData.forEach((level) => { level._collapsed = true; });
    renderStructured();
  });
  if (btnSyncJson) btnSyncJson.addEventListener('click', applyJsonToStructured);

  renderStructured();
  loadOnline().catch(() => {});
}

function bindResearchArticles() {
  const fields = {
    slug: $('#ra-slug'), title: $('#ra-title'), excerpt: $('#ra-excerpt'), tags: $('#ra-tags'), hero: $('#ra-hero'), body: $('#ra-body')
  };
  const msg = $('#ra-msg');
  const indexView = $('#ra-index');
  const buttons = {
    publish: $('#ra-publish'), delete: $('#ra-delete'), reuse: $('#ra-reuse'), preview: $('#ra-preview'), clear: $('#ra-clear'), refresh: $('#ra-refresh')
  };

  const clearForm = () => {
    if (fields.slug) fields.slug.value = '';
    if (fields.title) fields.title.value = '';
    if (fields.excerpt) fields.excerpt.value = '';
    if (fields.tags) fields.tags.value = '';
    if (fields.hero) fields.hero.value = '';
    if (fields.body) fields.body.value = '';
  };

  const populate = (doc) => {
    if (!doc) return;
    if (fields.slug) fields.slug.value = doc.slug || '';
    if (fields.title) fields.title.value = doc.title || '';
    if (fields.excerpt) fields.excerpt.value = doc.excerpt || '';
    if (fields.tags) fields.tags.value = Array.isArray(doc.tags) ? doc.tags.join(', ') : '';
    if (fields.hero) fields.hero.value = doc.hero || '';
    if (fields.body) fields.body.value = doc.body || '';
  };

  refreshIndexView('research/articles', indexView);

  if (buttons.publish) buttons.publish.addEventListener('click', async () => {
    const slug = fields.slug?.value?.trim();
    if (!slug) return msg && (msg.textContent = '请输入 slug');
    if (msg) msg.textContent = '正在发布...';
    try {
      const payload = {
        slug,
        title: fields.title?.value?.trim() || undefined,
        excerpt: fields.excerpt?.value?.trim() || undefined,
        tags: splitLines((fields.tags?.value || '').replace(/,/g, '\n')),
        hero: fields.hero?.value?.trim() || undefined,
        date: new Date().toISOString(),
        body: fields.body?.value || ''
      };
      const r = await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      unwrapResponse(r, 'PUBLISH_FAILED');
      if (msg) msg.textContent = '发布成功';
      await refreshIndexView('research/articles', indexView);
    } catch (e) {
      if (msg) msg.textContent = '发布失败: ' + (e.message || e);
    }
  });

  if (buttons.delete) buttons.delete.addEventListener('click', async () => {
    const slug = fields.slug?.value?.trim();
    if (!slug) return msg && (msg.textContent = '请输入 slug');
    if (!confirm(`确认删除研究文章：${slug}？`)) return;
    if (msg) msg.textContent = '正在删除...';
    try {
      const r = await __apiFetch(`/api/research/articles/${encodeURIComponent(slug)}.json`, { method: 'DELETE' });
      unwrapResponse(r, 'DELETE_FAILED');
      if (msg) msg.textContent = '删除成功';
      await refreshIndexView('research/articles', indexView);
    } catch (e) {
      if (msg) msg.textContent = '删除失败: ' + (e.message || e);
    }
  });

  if (buttons.reuse) buttons.reuse.addEventListener('click', async () => {
    if (msg) msg.textContent = '正在载入线上数据...';
    try {
      const list = await fetchIndex('research/articles');
      if (!Array.isArray(list) || !list.length) throw new Error('暂无历史数据');
      const latest = typeof list[0] === 'string' ? list[0] : list[0]?.slug;
      if (!latest) throw new Error('索引数据无效');
      const doc = await fetchDocument('research/articles', latest);
      populate(doc || {});
      if (fields.slug && doc?.slug) fields.slug.value = `${doc.slug}-${today()}`;
      if (msg) msg.textContent = `已载入 ${latest}，Slug 已追加今日日期。`;
    } catch (e) {
      if (msg) msg.textContent = '载入线上数据失败: ' + (e.message || e);
    }
  });

  if (buttons.preview) buttons.preview.addEventListener('click', () => {
    const slug = fields.slug?.value?.trim();
    if (!slug) return;
    window.open(`/api/research/articles/${encodeURIComponent(slug)}.json`, '_blank', 'noopener');
  });

  if (buttons.clear) buttons.clear.addEventListener('click', () => {
    clearForm();
    if (msg) msg.textContent = '';
  });

  if (buttons.refresh) buttons.refresh.addEventListener('click', () => {
    refreshIndexView('research/articles', indexView);
  });
}

(function init() {
  setupTabs();
  bindDiagnostics();
  bindDailyBrief();
  bindAnalyses();
  bindNews();
  bindResearchSyllabus();
  bindResearchArticles();
})();








