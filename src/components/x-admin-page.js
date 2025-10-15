import './x-signal-admin.js';   // 中文录入面板
import './x-publisher.js';      // 一键发布中心

const PASS_KEY = 'ttl_pass_ok';
const PASS = localStorage.getItem('ttl_admin_pass') || 'ttl123'; // 你可以提前改

class XAdminPage extends HTMLElement {
  connectedCallback() { this.render(); }
  render() {
    const ok = localStorage.getItem(PASS_KEY) === '1';
    this.innerHTML = ok ? this.authedTpl() : this.lockTpl();
    this.bind();
  }
  lockTpl() {
    return `
      <section class="container">
        <div class="card">
          <h3 class="m0">后台登录</h3>
          <p class="mt8" style="color:#9aa0aa">此页面仅站长使用，数据保存在本机浏览器。</p>
          <form id="login" class="mt12" style="display:flex;gap:8px;align-items:center">
            <input id="pw" class="card" type="password" placeholder="输入口令" />
            <button class="badge" type="submit">进入</button>
          </form>
          <details class="mt12" style="color:#9aa0aa">
            <summary>修改口令（可选）</summary>
            <div class="row mt8">
              <input id="newpw" class="card" placeholder="新口令" />
              <button id="setpw" class="badge">保存新口令</button>
            </div>
          </details>
        </div>
      </section>
    `;
  }
  authedTpl() {
    return `
      <section class="container">
        <div class="row" style="justify-content:space-between;align-items:center">
          <h3 class="m0">后台 · 仅站长可见</h3>
          <button id="logout" class="badge">退出</button>
        </div>
        <div class="mt16"><x-signal-admin></x-signal-admin></div>
        <div class="mt16"><x-publisher></x-publisher></div>
      </section>
    `;
  }
  bind() {
    const $ = s => this.querySelector(s);
    const login = $('#login');
    if (login) {
      login.onsubmit = (e) => {
        e.preventDefault();
        if (($('#pw').value || '') === PASS) {
          localStorage.setItem(PASS_KEY, '1');
          this.render();
        } else {
          alert('口令错误');
        }
      };
      $('#setpw').onclick = () => {
        const v = ($('#newpw').value || '').trim();
        if (!v) return alert('请输入新口令');
        localStorage.setItem('ttl_admin_pass', v);
        alert('已保存新口令');
      };
    }
    const logout = $('#logout');
    if (logout) {
      logout.onclick = () => { localStorage.removeItem(PASS_KEY); this.render(); };
    }
  }
}
customElements.define('x-admin-page', XAdminPage);
