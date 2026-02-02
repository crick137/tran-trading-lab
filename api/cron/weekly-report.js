// Vercel Cron - 주간/월간 리포트
// api/cron/weekly-report.js
// 每周日发送周报总结

export const config = {
    runtime: 'edge',
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7850025643:AAGdBsxu9XgKOkYf3g5bXOHjTgpNh6frVJ8';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@TranTradingLabKR';

const SYMBOLS = {
    crypto: ['BTC-USD', 'ETH-USD', 'XRP-USD'],
    forex: ['USDKRW=X', 'EURUSD=X'],
    korean: ['^KS11', '005930.KS'],
};

const NAMES = {
    'BTC-USD': 'BTC',
    'ETH-USD': 'ETH',
    'XRP-USD': 'XRP',
    'USDKRW=X': 'USD/KRW',
    'EURUSD=X': 'EUR/USD',
    '^KS11': 'KOSPI',
    '005930.KS': '삼성전자',
};

async function fetchWeeklyData(symbol) {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=7d`;
        const resp = await fetch(url);
        const data = await resp.json();

        if (data.chart?.result?.[0]) {
            const quotes = data.chart.result[0].indicators.quote[0];
            const closes = quotes.close.filter(c => c !== null);
            const highs = quotes.high.filter(h => h !== null);
            const lows = quotes.low.filter(l => l !== null);

            if (closes.length >= 2) {
                const weekStart = closes[0];
                const weekEnd = closes[closes.length - 1];
                const weekChange = ((weekEnd - weekStart) / weekStart) * 100;
                const weekHigh = Math.max(...highs);
                const weekLow = Math.min(...lows);

                return {
                    current: weekEnd,
                    change: weekChange,
                    high: weekHigh,
                    low: weekLow,
                };
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

async function generateWeeklyReport() {
    const today = new Date();
    const weekNum = Math.ceil(today.getDate() / 7);
    const month = today.getMonth() + 1;

    let report = `📊 주간 시장 리뷰\n`;
    report += `${month}월 ${weekNum}주차 (${today.toISOString().split('T')[0]})\n`;
    report += `${'='.repeat(35)}\n\n`;

    // 암호화폐
    report += `₿ 암호화폐 주간 성과\n`;
    for (const symbol of SYMBOLS.crypto) {
        const data = await fetchWeeklyData(symbol);
        if (data) {
            const emoji = data.change > 0 ? '🔺' : '🔻';
            const name = NAMES[symbol];
            report += `• ${name}: ${emoji}${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}%\n`;
            report += `  고가: $${data.high.toLocaleString('en-US', { maximumFractionDigits: 0 })} / 저가: $${data.low.toLocaleString('en-US', { maximumFractionDigits: 0 })}\n`;
        }
    }

    // 외환
    report += `\n💱 외환 주간 성과\n`;
    for (const symbol of SYMBOLS.forex) {
        const data = await fetchWeeklyData(symbol);
        if (data) {
            const emoji = data.change > 0 ? '🔺' : '🔻';
            const name = NAMES[symbol];
            if (name.includes('KRW')) {
                report += `• ${name}: ${emoji}${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}% (현재 ${data.current.toFixed(2)}원)\n`;
            } else {
                report += `• ${name}: ${emoji}${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}%\n`;
            }
        }
    }

    // 한국 주식
    report += `\n🇰🇷 한국 주식 주간 성과\n`;
    for (const symbol of SYMBOLS.korean) {
        const data = await fetchWeeklyData(symbol);
        if (data) {
            const emoji = data.change > 0 ? '🔺' : '🔻';
            const name = NAMES[symbol];
            report += `• ${name}: ${emoji}${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}%\n`;
        }
    }

    // 주간 분석
    report += `\n📝 주간 요약\n`;

    const btcData = await fetchWeeklyData('BTC-USD');
    if (btcData) {
        if (btcData.change > 5) {
            report += `• 비트코인 강세 주간, 상승 모멘텀 지속\n`;
        } else if (btcData.change < -5) {
            report += `• 비트코인 약세 주간, 조정 국면\n`;
        } else {
            report += `• 비트코인 횡보 주간, 방향성 탐색 중\n`;
        }
    }

    report += `\n${'='.repeat(35)}\n`;
    report += `💡 다음 주도 성공적인 트레이딩 되세요!\n`;
    report += `📱 @trantradinglab_bot\n\n`;
    report += `#주간리뷰 #암호화폐 #외환 #한국주식 #트레이딩`;

    return report;
}

async function sendTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
    return resp.json();
}

export default async function handler(request) {
    try {
        const report = await generateWeeklyReport();
        const result = await sendTelegram(report);

        return new Response(JSON.stringify({
            success: true,
            telegram: result,
            report,
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}
