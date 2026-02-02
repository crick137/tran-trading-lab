// Vercel Cron Job - 전문 금융 리포트 자동 전송
// api/cron/market-report.js
// 每天自动发送外汇、加密货币、韩国股票快报到 Telegram

export const config = {
  runtime: 'edge',
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7850025643:AAGdBsxu9XgKOkYf3g5bXOHjTgpNh6frVJ8';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@TranTradingLabKR';

// Yahoo Finance API 获取数据
async function fetchYahooFinance(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.chart?.result?.[0]) {
      const result = data.chart.result[0];
      const quotes = result.indicators.quote[0];
      const closes = quotes.close.filter(c => c !== null);

      if (closes.length >= 2) {
        const latest = closes[closes.length - 1];
        const prev = closes[closes.length - 2];
        const change = ((latest - prev) / prev) * 100;
        return { price: latest, change };
      }
    }
    return null;
  } catch (e) {
    console.error(`Error fetching ${symbol}:`, e);
    return null;
  }
}

async function generateReport() {
  const today = new Date().toISOString().split('T')[0];

  // 获取数据
  const forex = {
    'USD/KRW': await fetchYahooFinance('USDKRW=X'),
    'EUR/USD': await fetchYahooFinance('EURUSD=X'),
    'USD/JPY': await fetchYahooFinance('USDJPY=X'),
  };

  const crypto = {
    'BTC': await fetchYahooFinance('BTC-USD'),
    'ETH': await fetchYahooFinance('ETH-USD'),
    'XRP': await fetchYahooFinance('XRP-USD'),
    'SOL': await fetchYahooFinance('SOL-USD'),
  };

  const korean = {
    'KOSPI': await fetchYahooFinance('^KS11'),
    '삼성전자': await fetchYahooFinance('005930.KS'),
    'SK하이닉스': await fetchYahooFinance('000660.KS'),
  };

  // 生成报告
  let report = `📊 전문 시장 리포트 | ${today}\n`;
  report += `${'='.repeat(35)}\n\n`;

  // 外汇
  report += `💱 외환 시장 (Forex)\n`;
  for (const [name, data] of Object.entries(forex)) {
    if (data) {
      const emoji = data.change > 0 ? '🔺' : '🔻';
      if (name.includes('KRW')) {
        report += `• ${name}: ${data.price.toFixed(2)}원 ${emoji}${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}%\n`;
      } else {
        report += `• ${name}: ${data.price.toFixed(4)} ${emoji}${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}%\n`;
      }
    }
  }

  // 加密货币
  report += `\n₿ 암호화폐 (Crypto)\n`;
  for (const [name, data] of Object.entries(crypto)) {
    if (data) {
      const emoji = data.change > 0 ? '🔺' : '🔻';
      report += `• ${name}: $${data.price.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${emoji}${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}%\n`;
    }
  }

  // 韩国股票
  report += `\n🇰🇷 한국 주식\n`;
  for (const [name, data] of Object.entries(korean)) {
    if (data) {
      const emoji = data.change > 0 ? '🔺' : '🔻';
      if (name === 'KOSPI') {
        report += `• ${name}: ${data.price.toFixed(2)} ${emoji}${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}%\n`;
      } else {
        report += `• ${name}: ${data.price.toLocaleString('ko-KR')}원 ${emoji}${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}%\n`;
      }
    }
  }

  report += `\n${'='.repeat(35)}\n`;
  report += `💡 본 데이터는 참고용이며 투자 조언이 아닙니다\n`;
  report += `📱 @trantradinglab_bot\n\n`;
  report += `#외환 #암호화폐 #한국주식 #KOSPI #비트코인`;

  return report;
}

async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
    }),
  });
  return resp.json();
}

export default async function handler(request) {
  // 验证是否是 Vercel Cron 调用
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // 开发模式允许访问
    if (process.env.NODE_ENV === 'production' && !request.url.includes('test=true')) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    const report = await generateReport();
    const result = await sendTelegram(report);

    return new Response(JSON.stringify({
      success: true,
      telegram: result,
      report: report,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
