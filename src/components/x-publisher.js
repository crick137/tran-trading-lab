import { loadSignalsLS } from '../data/store.js';
import { loadBrief, todayStr } from '../data/store_posts.js';

function fmtSignals(list) {
  return list.slice(0,5).map(s =>
    `• ${s.symbol} ${s.side} ${s.tf} | 入:${s.entry??'-'} / TP:${s.tp??'-'} / SL:${s.sl??'-'} | R:${s.rr??'-'} ${s.logic?'- '+s.logic:''}`
  ).join('\n');
}
function copy(txt) { navigator.clipboard.writeText(txt); }

class XPublisher extends HTMLElement {
  connectedCallback() { this.render(); this.update(); 
    window.addEventListener('ttl:signals-updated', () => this.update());
    window.addEventListener('ttl:brief-updated', () => this.update());
  }

  render() {
    this.innerHTML = `
      <section class="container" id="publish">
        <div class="card">
          <h3 class="m0">一键发布中心</h3>
          <p class="mt8" style="color:#9aa0aa">根据每日录入的简报与信号，自动生成可复制的中文文案。</p>

          <div class="grid mt12" style="grid-template-columns: repeat(3,1fr); gap:12px;">
            <div class="card"><h4 class="m0">Telegram</h4><textarea id="tg" rows="12" class="card mt8"></textarea><button id="copy-tg" class="badge mt8">复制TG</button></div>
            <div class="card"><h4 class="m0">WhatsApp</h4><textarea id="wa" rows="12" class="card mt8"></textarea><button id="copy-wa" class="badge mt8">复制WS</button></div>
            <div class="card"><h4 class="m0">X / Twitter</h4>
              <textarea id="tw" rows="12" class="card mt8"></textarea>
              <div class="row mt8"><button id="copy-tw" class="badge">复制X</button><span id="count" class="badge">0/280</span></div>
            </div>
          </div>
        </div>
      </section>
    `;
        // Build DOM instead of string templates to avoid unsafe interpolation
        this.innerHTML = '';

        const section = document.createElement('section');
        section.className = 'container';
        section.id = 'publish';

        const card = document.createElement('div'); card.className = 'card';
        const h3 = document.createElement('h3'); h3.className = 'm0'; h3.textContent = '一键发布中心';
        const p = document.createElement('p'); p.className = 'mt8'; p.style.color = '#9aa0aa';
        p.textContent = '根据每日录入的简报与信号，自动生成可复制的中文文案。';
        card.appendChild(h3); card.appendChild(p);

        const grid = document.createElement('div'); grid.className = 'grid mt12'; grid.style.gridTemplateColumns = 'repeat(3,1fr)'; grid.style.gap = '12px';

        // Telegram column
        const colTg = document.createElement('div'); colTg.className = 'card';
        const h4Tg = document.createElement('h4'); h4Tg.className = 'm0'; h4Tg.textContent = 'Telegram';
        const taTg = document.createElement('textarea'); taTg.id = 'tg'; taTg.rows = 12; taTg.className = 'card mt8';
        const btnCopyTg = document.createElement('button'); btnCopyTg.id = 'copy-tg'; btnCopyTg.className = 'badge mt8'; btnCopyTg.type = 'button'; btnCopyTg.textContent = '复制TG';
        colTg.appendChild(h4Tg); colTg.appendChild(taTg); colTg.appendChild(btnCopyTg);

        // WhatsApp column
        const colWa = document.createElement('div'); colWa.className = 'card';
        const h4Wa = document.createElement('h4'); h4Wa.className = 'm0'; h4Wa.textContent = 'WhatsApp';
        const taWa = document.createElement('textarea'); taWa.id = 'wa'; taWa.rows = 12; taWa.className = 'card mt8';
        const btnCopyWa = document.createElement('button'); btnCopyWa.id = 'copy-wa'; btnCopyWa.className = 'badge mt8'; btnCopyWa.type = 'button'; btnCopyWa.textContent = '复制WS';
        colWa.appendChild(h4Wa); colWa.appendChild(taWa); colWa.appendChild(btnCopyWa);

        // X / Twitter column
        const colTw = document.createElement('div'); colTw.className = 'card';
        const h4Tw = document.createElement('h4'); h4Tw.className = 'm0'; h4Tw.textContent = 'X / Twitter';
        const taTw = document.createElement('textarea'); taTw.id = 'tw'; taTw.rows = 12; taTw.className = 'card mt8';
        const row = document.createElement('div'); row.className = 'row mt8';
        const btnCopyTw = document.createElement('button'); btnCopyTw.id = 'copy-tw'; btnCopyTw.className = 'badge'; btnCopyTw.type = 'button'; btnCopyTw.textContent = '复制X';
        const spanCount = document.createElement('span'); spanCount.id = 'count'; spanCount.className = 'badge'; spanCount.textContent = '0/280';
        row.appendChild(btnCopyTw); row.appendChild(spanCount);
        colTw.appendChild(h4Tw); colTw.appendChild(taTw); colTw.appendChild(row);

        grid.appendChild(colTg); grid.appendChild(colWa); grid.appendChild(colTw);
        card.appendChild(grid);
        section.appendChild(card);
        this.appendChild(section);

        // Event wiring
        btnCopyTg.addEventListener('click', () => copy(taTg.value));
        btnCopyWa.addEventListener('click', () => copy(taWa.value));
        btnCopyTw.addEventListener('click', () => copy(taTw.value));
        taTw.addEventListener('input', () => this.updateCount());
  }

  updateCount() {
    const t = this.querySelector('#tw').value;
    this.querySelector('#count').textContent = `${t.length}/280`;
  }

  update() {
    const sig = loadSignalsLS();
    const brief = loadBrief();
    const date = todayStr();
    const sigText = fmtSignals(sig);

    const T = {
      title: brief.title || '早安市场简报',
      macro: (brief.macro||'').split(/；|\n/).filter(Boolean).map(x=>`- ${x}`).join('\n'),
      events:(brief.events||'').split(/；|\n/).filter(Boolean).map(x=>`- ${x}`).join('\n'),
      assets:(brief.assets||'').split('\n').filter(Boolean).map(x=>`- ${x}`).join('\n'),
      tip: brief.tip || '止损是保险费。'
    };

    const tg = `📅 ${date} | ${T.title}

📌 宏观要点
${T.macro || '- 待补充'}

🗓️ 重点日程
${T.events || '- 待补充'}

📊 关注资产
${T.assets || '- 待补充'}

🧭 今日信号（Top5）
${sigText || '- 暂无'}

🎓 今日小知识
- ${T.tip}

#TranTradingLab`;

    const wa = `${date} ｜ ${T.title}
• 宏观要点
${T.macro || '- 待补充'}
• 重点日程
${T.events || '- 待补充'}
• 关注资产
${T.assets || '- 待补充'}
• 今日信号
${sigText || '- 暂无'}
• 今日小知识
${T.tip}
#TranTradingLab`;

    const tw = `${date} ${T.title}
${T.assets ? T.assets.replace(/\n/g,' ') : ''} | ${T.tip} #TranTradingLab`;

    this.querySelector('#tg').value = tg;
    this.querySelector('#wa').value = wa;
    this.querySelector('#tw').value = tw.slice(0, 280);
    this.updateCount();
  }
}
customElements.define('x-publisher', XPublisher);
