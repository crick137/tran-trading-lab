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
    this.querySelector('#copy-tg').onclick = () => copy(this.querySelector('#tg').value);
    this.querySelector('#copy-wa').onclick = () => copy(this.querySelector('#wa').value);
    this.querySelector('#copy-tw').onclick = () => copy(this.querySelector('#tw').value);
    this.querySelector('#tw').addEventListener('input', () => this.updateCount());
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
