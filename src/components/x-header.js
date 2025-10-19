import { toggleTheme, setTheme } from '../utils/theme.js';

class XHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header style="position:sticky;top:0;backdrop-filter:blur(6px);
      background:rgba(0,0,0,.06);padding:14px 20px;border-bottom:1px solid var(--border-color);z-index:10">
        <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
          <h2 style="margin:0;color:var(--text-primary);font-weight:700;letter-spacing:.4px">TRAN TRADING LAB</h2>
          <nav class="row" style="display:flex;gap:14px;align-items:center;">
            <a href="#dashboard">控制面板</a>
            <a href="#about">关于</a>
            <a href="#articles">文章</a>
            <button id="themeBtn" class="badge" style="width:40px;justify-content:center" title="切换主题">
              🌙
            </button>
            <select id="themeSel" class="badge" title="选择主题" style="width:auto">
              <option value="system">跟随系统</option>
              <option value="light">亮色</option>
              <option value="dark">暗色</option>
            </select>
          </nav>
        </div>
      </header>
    `;

    const sel = this.querySelector('#themeSel');
    const saved = localStorage.getItem('ttl_theme') || 'system';
    sel.value = saved;
    this.updateIcon();

    this.querySelector('#themeBtn').onclick = () => { toggleTheme(); this.updateIcon(); };
    sel.onchange = () => { setTheme(sel.value); this.updateIcon(); };
    window.addEventListener('ttl:theme-changed', () => this.updateIcon());
  }

  updateIcon(){
    const btn = this.querySelector('#themeBtn');
    const current = document.documentElement.dataset.theme || 'light';
    btn.textContent = current === 'dark' ? '☀️' : '🌙';
  }
}
customElements.define('x-header', XHeader);
