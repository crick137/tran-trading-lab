// ===== public/js/admin-main.js =====
// Enhanced Tran Admin Console (fixed login overlay, regex bug, input lag, CRUD)

// --- Utilities ---
const Admin = window.Admin || {};
const $ = (sel, root = document) => (root || document).querySelector(sel);
const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));

let __ADMIN_TOKEN = sessionStorage.getItem("tran_admin_token") || "";
function __setToken(v) {
  __ADMIN_TOKEN = v || "";
  if (v) sessionStorage.setItem("tran_admin_token", v);
  else sessionStorage.removeItem("tran_admin_token");
}

async function __apiFetch(url, init = {}) {
  const opts = { credentials: "include", cache: "no-store", ...init };
  if (!opts.method) opts.method = "GET";
  const headers = new Headers(opts.headers || {});
  if (__ADMIN_TOKEN) headers.set("Authorization", "Bearer " + __ADMIN_TOKEN);
  opts.headers = headers;
  const ctrl = new AbortController();
  opts.signal = ctrl.signal;
  const timeout = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, opts);
    clearTimeout(timeout);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json().catch(() => ({}));
  } catch (err) {
    console.error("[API]", url, err);
    return null;
  }
}

// --- Login Overlay ---
function renderLogin() {
  const box = document.createElement("div");
  box.id = "pw-overlay";
  box.style = `
    position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
    background:#0c0f12;color:#e5e7eb;z-index:9999;`;
  box.innerHTML = `
    <div class="login-box" style="background:#11141a;padding:32px 40px;border-radius:14px;
      box-shadow:0 0 20px #0008;display:flex;flex-direction:column;gap:12px;min-width:280px;">
      <h2 style="margin:0 0 8px;font-weight:600;">🔐 Tran Admin</h2>
      <input id="pw-input" type="password" placeholder="Enter admin password"
        style="padding:10px 12px;border-radius:8px;background:#0c0f12;
        border:1px solid #23262b;color:#e5e7eb;outline:none;">
      <button id="pw-btn" style="padding:10px;border:none;border-radius:8px;
        background:#3b82f6;color:white;cursor:pointer;">Login</button>
      <div id="pw-msg" style="font-size:13px;color:#9ca3af;height:18px;"></div>
    </div>`;
  document.body.appendChild(box);

  $("#pw-btn", box).onclick = async () => {
    const pw = $("#pw-input", box).value.trim();
    $("#pw-msg", box).textContent = "Verifying...";
    const r = await __apiFetch("/api/admin/verify?pw=" + encodeURIComponent(pw));
    if (r && r.token) {
      __setToken(r.token);
      $("#pw-msg", box).textContent = "✅ Verified";
      setTimeout(() => box.remove(), 300);
      loadAdminUI();
    } else {
      $("#pw-msg", box).textContent = "❌ Invalid password";
    }
  };
}

// --- Admin UI Skeleton ---
function renderTabs() {
  const root = document.createElement("div");
  root.id = "admin-root";
  root.style = "padding:20px;color:#e5e7eb;font-family:sans-serif;";

  root.innerHTML = `
    <div class="bar" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
      <button class="tab" data-tab="daily-brief">📊 Daily Brief</button>
      <button class="tab" data-tab="market-news">📰 Market News</button>
      <button class="tab" data-tab="research">📚 Research</button>
      <button class="tab" data-tab="articles">✍️ Articles</button>
      <button class="danger" id="logout-btn" style="margin-left:auto;background:#ef4444;color:#fff;border:none;border-radius:6px;padding:8px 10px;">Logout</button>
    </div>
    <div id="tab-content"></div>
  `;
  document.body.innerHTML = "";
  document.body.appendChild(root);

  $$(".tab", root).forEach(btn =>
    btn.addEventListener("click", () => {
      $$(".tab").forEach(b => (b.style.background = ""));
      btn.style.background = "#2563eb";
      loadSection(btn.dataset.tab);
    })
  );

  $("#logout-btn").onclick = () => {
    __setToken("");
    location.reload();
  };

  // default tab
  $$(".tab")[0].click();
}

// --- Load Section Data ---
async function loadSection(tab) {
  const content = $("#tab-content");
  content.innerHTML = `<p style="opacity:.7">Loading ${tab}...</p>`;
  let url = "";
  if (tab === "daily-brief") url = "/api/daily-brief/index.json";
  if (tab === "market-news") url = "/api/market-news/index.json";
  if (tab === "research") url = "/api/research/syllabus.json";
  if (tab === "articles") url = "/api/research/articles/index.json";

  const data = await __apiFetch(url);
  if (!data) {
    content.innerHTML = `<p style="color:#f87171">Failed to load ${tab}</p>`;
    return;
  }

  renderEditor(content, tab, data);
}

// --- Editor UI ---
function renderEditor(container, section, data) {
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "grid";
  wrap.style = "display:grid;grid-template-columns:1fr 1fr;gap:12px;";

  const jsonBox = document.createElement("textarea");
  jsonBox.value = JSON.stringify(data, null, 2);
  jsonBox.style = `
    background:#0c0f12;color:#e5e7eb;border:1px solid #23262b;
    border-radius:10px;padding:10px;min-height:480px;resize:vertical;font-family:monospace;`;

  const right = document.createElement("div");
  right.innerHTML = `
    <button id="save-btn" style="background:#3b82f6;color:white;padding:10px 14px;border:none;border-radius:8px;margin-bottom:8px;cursor:pointer;">💾 Save</button>
    <button id="refresh-btn" style="background:#1f2937;color:white;padding:10px 14px;border:none;border-radius:8px;margin-bottom:8px;cursor:pointer;">🔄 Reload</button>
    <button id="delete-btn" style="background:#ef4444;color:white;padding:10px 14px;border:none;border-radius:8px;cursor:pointer;">🗑 Delete index</button>
    <div id="msg" style="margin-top:10px;color:#9ca3af;font-size:13px;"></div>
  `;

  right.querySelector("#save-btn").onclick = async () => {
    const txt = jsonBox.value.trim();
    try {
      JSON.parse(txt);
    } catch {
      $("#msg", right).textContent = "❌ Invalid JSON";
      return;
    }
    $("#msg", right).textContent = "Saving...";
    const res = await __apiFetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, data: txt }),
    });
    $("#msg", right).textContent = res ? "✅ Saved" : "❌ Save failed";
  };

  right.querySelector("#refresh-btn").onclick = () => loadSection(section);
  right.querySelector("#delete-btn").onclick = async () => {
    if (!confirm("Delete index for " + section + "?")) return;
    const res = await __apiFetch("/api/admin/delete?section=" + section, { method: "POST" });
    $("#msg", right).textContent = res ? "🗑 Deleted" : "❌ Delete failed";
  };

  wrap.appendChild(jsonBox);
  wrap.appendChild(right);
  container.appendChild(wrap);
}

// --- Boot sequence ---
async function loadAdminUI() {
  renderTabs();
}

(async function init() {
  console.log("[admin] booting...");
  const r = await __apiFetch("/api/admin/verify");
  if (r && r.ok) loadAdminUI();
  else renderLogin();
})();
