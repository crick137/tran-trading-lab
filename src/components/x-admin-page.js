import './x-signal-admin.js';
import './x-publisher.js';

// 本地存储键
const PASS_FLAG_KEY = 'ttl_pass_ok';
const PASS_STORE_KEY = 'ttl_admin_pass';
// 默认口令（可在界面里改）
const DEFAULT_PASS = 'tranlab2025';

class XAdminPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  get currentPass() {
    return localStorage.getItem(PASS_STORE_KEY) || DEFAULT_PASS;
  }

  render() {
    const authed = localStorage.getItem(PASS_FLAG_KEY) === '1';
    this.innerHTML = authed ? this.authedTpl() : this.lockTpl();
    this.bind(authed);
  }

  lockTpl() {
    return `
      <section class="admin-wrap">
        <div class="admin-card">
          <h2 class="title">后台登录</h2>
          <label class="lbl">🔑 访问口令</label>
          <input id="pw" type="password" class="inp" placeholder="请输入后台密码…" />
          <button id="login" class="btn">进入后台</button>
          <p class="hint">默认口令：<code>${DEFAULT_PASS}</code></p>

          <details class="mt12">
            <summary class="lbl">修改口令（可选）</summary>
            <div class="row">
              <input id="newpw" class="inp" placeholder="新口令…" />
              <button id="setpw" class="btn ghost">保存新口令</button>
            </div>
          </details>
        </div>
      </section>
      ${this.styles()}
    `;
  }

  authedTpl() {
    return `
      <section class="admin-wrap">
        <div class="admin-card">
          <div class="row space">
            <h2 class="title">后台 · 仅站长可见</h2>
            <button id="logout" class="btn warn">退出</button>
          </div>
          <p class="hint">口令可在“登录页 → 修改口令”里更改。</p>
        </div>

        <div class="admin-card mt12">
          <h3 class="subtitle">① 每日录入</h3>
          <x-signal-admin></x-signal-admin>
        </div>

        <div class="admin-card mt12">
          <h3 class="subtitle">② 一键发布中心</h3>
          <x-publisher></x-publisher>
        </div>
      </section>
      ${this.styles()}
    `;
  }

  bind(authed) {
    if (authed) {
      this.querySelector('#logout')?.addEventListener('click', () => {
        localStorage.removeItem(PASS_FLAG_KEY);
        this.render();
      });
      return;
    }
    const $ = s => this.querySelector(s);
    $('#login')?.addEventListener('click', () => {
      const input = ($('#pw')?.value || '').trim();
      if (!input) return alert('请输入口令');
      if (input === this.currentPass) {
        localStorage.setItem(PASS_FLAG_KEY, '1');
        this.render();
      } else {
        alert('口令错误');
      }
    });
    $('#setpw')?.addEventListener('click', () => {
      const v = ($('#newpw')?.value || '').trim();
      if (!v) return alert('请输入新口令');
      localStorage.setItem(PASS_STORE_KEY, v);
      alert('已保存新口令：' + v);
    });
  }

  styles() {
    // 亮度对比充足，深底亮字；输入/按钮更易读
    return `
      <style>
        :host { display:block; }
        .admin-wrap { max-width: 1200px; margin: 32px auto; padding: 0 20px; }
        .admin-card {
          background: #141824;
          border: 1px solid #22283a;
          border-radius: 14px;
          padding: 16px;
          color: #e9eef7;
          box-shadow: 0 6px 18px rgba(0,0,0,.35);
        }
        .title { margin: 0 0 8px; color: #ffffff; letter-spacing:.3px; }
        .subtitle { margin: 0 0 8px; color: #ffffff; }
        .lbl { color: #c4ccdd; font-size: 14px; }
        .hint { color: #9aa3b2; font-size: 13px; margin: 8px 0 0; }
        code { color: #7ab8ff; }

        .row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
        .space { justify-content: space-between; }

        .inp {
          width: 100%;
          background: #1b2030;
          border: 1px solid #2a3146;
          color: #f2f6ff;
          border-radius: 10px;
          padding: 10px 12px;
          outline: none;
          margin: 6px 0 10px;
        }
        .inp:focus { border-color:#6ea8fe; box-shadow: 0 0 0 2px rgba(110,168,254,.25); }

        .btn {
          background: linear-gradient(135deg, #4f9cff, #3dd5f3);
          color: #081018;
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn:hover { filter: brightness(1.05); }
        .btn.ghost { background: #243048; color:#d9e6ff; }
        .btn.warn { background: #ff6b6b; color: #1a0f0f; }
        .mt12 { margin-top: 12px; }
      </style>
    `;
  }
}
customElements.define('x-admin-page', XAdminPage);
