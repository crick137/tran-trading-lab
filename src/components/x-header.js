import { toggleTheme, loadTheme, setTheme } from '../utils/theme.js';

class XHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header style="position:sticky;top:0;backdrop-filter:blur(6px);
      background:rgba(0,0,0,.06);padding:14px 20px;border-bottom:1px solid var(--border-color);z-index:10">
        <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
          <h2 style="margin:0;color:var(--text-primary);font-weight:700;letter-spacing:.4px">TRAN TRADING LAB</h2>
          <nav class="row" style="display:flex;gap:14px;align-items:center;">
            <a href="#dashboard">대시보드</a>
            <a href="#about">About</a>
            <a href="#articles">글 모음</a>
            <div class="badge" id="themeCtl" style="cursor:pointer" title="切换主题">🌙 深色</div>
            <select id="themeSel" class="badge" title="主题模式">
              <option value="system">系统</option>
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </nav>
        </div>
      </header>
    `;

    // 初始化按钮文本 & 下拉框
    const sel = this.querySelector('#themeSel');
    const saved = localStorage.getItem('ttl_theme') || 'system';
    sel.value = saved;
    this.updateBadge();

    this.querySelector('#themeCtl').onclick = () => { toggleTheme(); this.updateBadge(); };
    sel.onchange = () => { setTheme(sel.value); this.updateBadge(); };
    window.addEventListener('ttl:theme-changed', () => this.updateBadge());
  }

  updateBadge() {
    const badge = this.querySelector('#themeCtl');
    const current = document.documentElement.dataset.theme;
    badge.textContent = current === 'dark' ? '☀️ 浅色' : '🌙 深色';
  }
}
customElements.define('x-header', XHeader);
