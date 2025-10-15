import { closedSignals } from '../data/signals.js';

function calcMetrics(list) {
  const n = list.length || 0;
  const wins = list.filter(s => s.result === 'win').length;
  const losses = list.filter(s => s.result === 'loss').length;

  const avgR = n
    ? (list.reduce((sum, s) => sum + (s.result === 'win' ? s.rr : -1), 0) / n).toFixed(2)
    : '0.00';

  const winRate = n ? Math.round((wins / n) * 100) : 0;

  // 기대값(Expectancy) = p(win)*AvgWinR - p(loss)*AvgLossR
  const avgWinR  = wins   ? (list.filter(s=>s.result==='win').reduce((a,b)=>a+b.rr,0)/wins)   : 0;
  const avgLossR = losses ? 1 : 0; // 손절은 항상 -1R 가정
  const pWin = n ? wins/n : 0, pLoss = 1 - pWin;
  const expectancy = (pWin*avgWinR - pLoss*avgLossR).toFixed(2);

  // 간단 Equity Curve로 MDD
  let equity = 0, peak = 0, mdd = 0;
  list.forEach(s => {
    equity += (s.result === 'win' ? s.rr : -1);
    peak = Math.max(peak, equity);
    mdd  = Math.min(mdd, equity - peak);
  });

  return { n, wins, losses, winRate, avgR, expectancy, mdd: mdd.toFixed(2) };
}

class XMetrics extends HTMLElement {
  connectedCallback() {
    const m = calcMetrics(closedSignals);
    this.innerHTML = `
      <section class="card">
        <h3 class="m0">성과 통계</h3>
        <p class="mt8" style="color:#9aa0aa">닫힌 포지션 기준 (1R 고정)</p>
        <div class="grid mt12" style="grid-template-columns: repeat(4,1fr); gap:12px;">
          ${this.box('승률', m.winRate + '%')}
          ${this.box('평균 R', m.avgR)}
          ${this.box('기대값(Expectancy)', m.expectancy)}
          ${this.box('최대 낙폭(MDD)', m.mdd + ' R')}
        </div>
        <p class="mt12" style="color:#9aa0aa">표본: ${m.n}개 | 승: ${m.wins} / 패: ${m.losses}</p>
      </section>
    `;
  }
  box(label, value) {
    return `
      <div class="card" style="padding:12px; text-align:center;">
        <div style="font-size:13px;color:#9aa0aa">${label}</div>
        <div style="font-size:22px;font-weight:700;margin-top:4px">${value}</div>
      </div>
    `;
  }
}
customElements.define('x-metrics', XMetrics);
