import { toggleTheme, setTheme } from '../utils/theme.js';

class XHeader extends HTMLElement {
  connectedCallback() {
    // build header DOM safely
    this.innerHTML = '';
    const header = document.createElement('header');
    header.style.position = 'sticky';
    header.style.top = '0';
    header.style.backdropFilter = 'blur(6px)';
    header.style.background = 'rgba(0,0,0,.06)';
    header.style.padding = '14px 20px';
    header.style.borderBottom = '1px solid var(--border-color)';
    header.style.zIndex = '10';

    const container = document.createElement('div');
    container.style.maxWidth = '1200px'; container.style.margin = '0 auto'; container.style.display = 'flex'; container.style.justifyContent = 'space-between'; container.style.alignItems = 'center';
    const h2 = document.createElement('h2'); h2.style.margin = '0'; h2.style.color = 'var(--text-primary)'; h2.style.fontWeight = '700'; h2.style.letterSpacing = '.4px'; h2.textContent = 'TRAN TRADING LAB';
    const nav = document.createElement('nav'); nav.className = 'row'; nav.style.display = 'flex'; nav.style.gap = '14px'; nav.style.alignItems = 'center';
    const a1 = document.createElement('a'); a1.href = '#dashboard'; a1.textContent = '대시보드';
    const a2 = document.createElement('a'); a2.href = '#about'; a2.textContent = 'About';
    const a3 = document.createElement('a'); a3.href = '#articles'; a3.textContent = '글 모음';
    const themeBtn = document.createElement('button'); themeBtn.id = 'themeBtn'; themeBtn.className = 'badge'; themeBtn.style.width='40px'; themeBtn.style.justifyContent='center'; themeBtn.title = '테마 전환'; themeBtn.textContent = '🌙';
    const sel = document.createElement('select'); sel.id = 'themeSel'; sel.className = 'badge'; sel.title = '테마 선택'; sel.style.width = 'auto'; ['system','light','dark'].forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent = v==='system'?'시스템':v==='light'?'라이트':'다크'; sel.appendChild(o); });
    nav.appendChild(a1); nav.appendChild(a2); nav.appendChild(a3); nav.appendChild(themeBtn); nav.appendChild(sel);
    container.appendChild(h2); container.appendChild(nav); header.appendChild(container); this.appendChild(header);

    const selEl = this.querySelector('#themeSel') || sel;
    const saved = localStorage.getItem('ttl_theme') || 'system';
    selEl.value = saved;
    this.updateIcon();

    const btnEl = this.querySelector('#themeBtn') || themeBtn;
    btnEl.onclick = () => { toggleTheme(); this.updateIcon(); };
    selEl.onchange = () => { setTheme(selEl.value); this.updateIcon(); };
    window.addEventListener('ttl:theme-changed', () => this.updateIcon());
  }

  updateIcon(){
    const btn = this.querySelector('#themeBtn');
    const current = document.documentElement.dataset.theme || 'light';
    btn.textContent = current === 'dark' ? '☀️' : '🌙';
  }
}
customElements.define('x-header', XHeader);
