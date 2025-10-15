import './x-signal-admin.js';   // 中文录入面板
import './x-publisher.js';      // 一键发布中心

const PASS_KEY = 'ttl_pass_ok';
const PASS = localStorage.getItem('ttl_admin_pass') || 'ttl123'; // 你可以提前改

class XAdminPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="admin-container">
        <h2 class="admin-title">관리자 패널 / 管理面板</h2>

        <div class="admin-box">
          <label>🔑 访问口令 / Access Key</label>
          <input id="admin-pass" type="password" placeholder="请输入后台密码…" />
          <button id="login-btn">进入后台</button>
        </div>

        <p class="admin-hint">提示：默认密码为 <code>tranlab2025</code></p>

        <style>
          :host {
            display: block;
            background: #111;               /* 深底 */
            color: #f2f2f2;                 /* 亮字 */
            min-height: 100vh;
            font-family: 'Segoe UI', 'Noto Sans KR', sans-serif;
          }
          .admin-container {
            max-width: 420px;
            margin: 80px auto;
            padding: 32px;
            background: rgba(255,255,255,0.05);
            border-radius: 16px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
          }
          .admin-title {
            text-align: center;
            font-size: 1.6rem;
            color: #fff;
            margin-bottom: 24px;
          }
          .admin-box {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          label {
            color: #ccc;
            font-weight: 500;
          }
          input {
            background: #222;
            border: 1px solid #555;
            color: #fff;
            padding: 10px 14px;
            border-radius: 8px;
            outline: none;
          }
          input:focus {
            border-color: #0af;
            box-shadow: 0 0 8px #0af;
          }
          button {
            background: linear-gradient(135deg, #0078ff, #00bcd4);
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.25s;
          }
          button:hover {
            background: linear-gradient(135deg, #00bcd4, #0078ff);
          }
          .admin-hint {
            text-align: center;
            color: #aaa;
            font-size: 0.85rem;
            margin-top: 20px;
          }
          code {
            color: #0af;
          }
        </style>
      </section>
    `;
  }
}
customElements.define('x-admin-page', XAdminPage);
