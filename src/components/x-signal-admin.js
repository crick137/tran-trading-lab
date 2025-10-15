import { loadSignalsLS, upsertSignal, removeSignal, exportJSON, importJSON } from '../data/store.js';
import { loadBrief, saveBrief, todayStr } from '../data/store_posts.js';

class XSignalAdmin extends HTMLElement {
  connectedCallback() { this.render(); this.bind(); this.refresh(); }

  render() {
    const b = loadBrief();
    this.innerHTML = `
      <section class="container" id="admin">
        <div class="card">
          <h3 class="m0">每日录入（信号 + 简报）</h3>
          <p class="mt8" style="color:#9aa0aa">数据保存到浏览器本地（localStorage）。</p>

          <!-- A. 交易信号 -->
          <h4 class="mt12">A. 交易信号</h4>
          <form id="f" class="mt8" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
            <input type="hidden" name="id" />
            <label>品种
              <input name="symbol" required placeholder="XAUUSD / EURUSD ..." class="card" />
            </label>
            <label>方向
              <select name="side" class="card"><option>BUY</option><option>SELL</option></select>
            </label>
            <label>周期(TF)
              <input name="tf" placeholder="M15/H1…" class="card" />
            </label>
            <label>日期
              <input name="date" type="date" class="card" value="${todayStr()}" />
            </label>

            <label>入场(Entry)
              <input name="entry" type="number" step="0.00001" class="card" />
            </label>
            <label>止盈(TP)
              <input name="tp" type="number" step="0.00001" class="card" />
            </label>
            <label>止损(SL)
              <input name="sl" type="number" step="0.00001" class="card" />
            </label>
            <label>R:R
              <input name="rr" type="number" step="0.01" class="card" value="1.5" />
            </label>

            <label style="grid-column:1/3">状态
              <select name="result" class="card">
                <option value="open">进行中</option>
                <option value="win">已盈利</option>
                <option value="loss">已亏损</option>
              </select>
            </label>
            <label style="grid-column:1/-1">逻辑/备注
              <input name="logic" placeholder="例：FVG回补 + 结构反转" class="card" />
            </label>
          </form>
          <div class="row mt8">
            <button id="save" class="badge">保存信号</button>
            <button id="reset" class="badge">清空表单</button>
            <button id="export" class="badge">导出信号(JSON)</button>
            <label class="badge" style="cursor:pointer">导入信号(JSON)
              <input id="import" type="file" accept="application/json" style="display:none" />
            </label>
          </div>

          <!-- B. 早报/简报（用于自动生成发布文本） -->
          <h4 class="mt16">B. 每日简报（发布所需）</h4>
          <form id="brief" class="mt8" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <label style="grid-column:1/-1">标题
              <input name="title" class="card" placeholder="如：早安市场简报" value="${b.title||''}" />
            </label>
            <label>宏观要点（多条用；分隔）
              <input name="macro" class="card" placeholder="美元回落；欧洲通胀放缓；..." value="${b.macro||''}" />
            </label>
            <label>重要事件（日程/数据）
              <input name="events" class="card" placeholder="20:30 美国CPI；23:00 EIA ..." value="${b.events||''}" />
            </label>
            <label style="grid-column:1/-1">三大品种看点（用换行分隔）
              <textarea name="assets" rows="3" class="card" placeholder="XAUUSD：...&#10;NAS100：...&#10;BTCUSD：..." >${b.assets||''}</textarea>
            </label>
            <label style="grid-column:1/-1">今日小知识（一句话）
              <input name="tip" class="card" placeholder="止损是保险费，不是惩罚。" value="${b.tip||''}" />
            </label>
          </form>
          <div class="row mt8">
            <button id="saveBrief" class="badge">保存简报</button>
          </div>
        </div>

        <div class="card mt16">
          <h3 class="m0">我的信号</h3>
          <div id="list" class="mt12" style="display:grid;gap:8px"></div>
        </div>
      </section>
    `;
  }

  bind() {
    const $ = s => this.querySelector(s);
    const f = $('#f');
    const fb = $('#brief');

    $('#save').onclick = () => {
      const data = Object.fromEntries(new FormData(f).entries());
      ['entry','tp','sl','rr'].forEach(k => data[k] = data[k] ? Number(data[k]) : '');
      if (!data.date) data.date = todayStr();
      // 状态中文转英简码
      if (data.result === '进行中') data.result = 'open';
      if (data.result === '已盈利') data.result = 'win';
      if (data.result === '已亏损') data.result = 'loss';
      upsertSignal(data);
      this.refresh(); 
      f.reset();
    };
    $('#reset').onclick = () => f.reset();
    $('#export').onclick = () => exportJSON();
    $('#import').onchange = async (e) => {
      if (e.target.files?.[0]) { await importJSON(e.target.files[0]); this.refresh(); }
      e.target.value = '';
    };

    $('#saveBrief').onclick = () => {
      const data = Object.fromEntries(new FormData(fb).entries());
      saveBrief(data);
      alert('已保存今日简报 ✅');
      window.dispatchEvent(new CustomEvent('ttl:brief-updated'));
    };
  }

  refresh() {
    const list = loadSignalsLS();
    const wrap = this.querySelector('#list');
    wrap.innerHTML = list.length ? '' : `<p style="color:#9aa0aa">暂无数据，请先在上方录入并保存。</p>`;
    list.forEach(it => {
      const row = document.createElement('div');
      row.className = 'card';
      row.style.padding = '10px';
      row.innerHTML = `
        <div class="row" style="justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
          <div class="row" style="gap:12px">
            <strong>${it.symbol}</strong>
            <span class="badge">${it.side}</span>
            <span class="badge">${it.tf || '-'}</span>
            <span class="badge">${it.date || '-'}</span>
            <span class="badge">R:${it.rr ?? '-'}</span>
            <span class="badge">${it.result || 'open'}</span>
          </div>
          <div class="row">
            <button class="badge" data-act="edit">修改</button>
            <button class="badge" data-act="win">标记盈利</button>
            <button class="badge" data-act="loss">标记亏损</button>
            <button class="badge" data-act="del">删除</button>
          </div>
        </div>
        <div class="mt8" style="color:#9aa0aa">${it.logic || ''} 
          <span style="margin-left:8px">E:${it.entry ?? '-'} / TP:${it.tp ?? '-'} / SL:${it.sl ?? '-'}</span>
        </div>
      `;
      row.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          const act = btn.dataset.act;
          if (act === 'edit') {
            const f = this.querySelector('#f');
            Object.entries(it).forEach(([k,v]) => { const el = f.elements[k]; if (el) el.value = v ?? ''; });
          } else if (act === 'del') {
            removeSignal(it.id); this.refresh();
          } else if (act === 'win' || act === 'loss') {
            upsertSignal({...it, result: act}); this.refresh();
          }
        };
      });
      wrap.appendChild(row);
    });

    window.dispatchEvent(new CustomEvent('ttl:signals-updated'));
  }
}
customElements.define('x-signal-admin', XSignalAdmin);
