// Vercel Cron - 가격 알림
// api/cron/price-alert.js
// BTC/ETH/韩元等价格突破警报

export const config = {
    runtime: 'edge',
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7850025643:AAGdBsxu9XgKOkYf3g5bXOHjTgpNh6frVJ8';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@TranTradingLabKR';

// 价格警报阈值
const PRICE_ALERTS = {
    'BTC-USD': {
        name: 'BTC',
        breakout_high: 100000,
        breakout_low: 85000,
        daily_change_alert: 5, // 5% 日涨跌幅警报
    },
    'ETH-USD': {
        name: 'ETH',
        breakout_high: 4000,
        breakout_low: 2800,
        daily_change_alert: 7,
    },
    'USDKRW=X': {
        name: 'USD/KRW',
        breakout_high: 1500,
        breakout_low: 1400,
        daily_change_alert: 1,
    },
    '^KS11': {
        name: 'KOSPI',
        breakout_high: 5000,
        breakout_low: 4200,
        daily_change_alert: 2,
    },
};

async function fetchPrice(symbol) {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`;
        const resp = await fetch(url);
        const data = await resp.json();

        if (data.chart?.result?.[0]) {
            const quotes = data.chart.result[0].indicators.quote[0];
            const closes = quotes.close.filter(c => c !== null);

            if (closes.length >= 2) {
                const current = closes[closes.length - 1];
                const prev = closes[closes.length - 2];
                const change = ((current - prev) / prev) * 100;
                return { price: current, change, prev };
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

async function checkAlerts() {
    const alerts = [];

    for (const [symbol, config] of Object.entries(PRICE_ALERTS)) {
        const data = await fetchPrice(symbol);
        if (!data) continue;

        const { price, change } = data;

        // 检查突破
        if (price >= config.breakout_high) {
            alerts.push({
                type: 'breakout_high',
                symbol: config.name,
                price,
                threshold: config.breakout_high,
                message: `🚀 ${config.name} 저항선 돌파!\n현재가: ${price.toLocaleString()}\n돌파 레벨: ${config.breakout_high.toLocaleString()}`,
            });
        } else if (price <= config.breakout_low) {
            alerts.push({
                type: 'breakout_low',
                symbol: config.name,
                price,
                threshold: config.breakout_low,
                message: `⚠️ ${config.name} 지지선 하락!\n현재가: ${price.toLocaleString()}\n하락 레벨: ${config.breakout_low.toLocaleString()}`,
            });
        }

        // 检查日涨跌幅
        if (Math.abs(change) >= config.daily_change_alert) {
            const emoji = change > 0 ? '📈' : '📉';
            const direction = change > 0 ? '급등' : '급락';
            alerts.push({
                type: 'volatility',
                symbol: config.name,
                change,
                message: `${emoji} ${config.name} ${direction} 알림!\n변동률: ${change > 0 ? '+' : ''}${change.toFixed(2)}%\n현재가: ${price.toLocaleString()}`,
            });
        }
    }

    return alerts;
}

async function sendTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
}

export default async function handler(request) {
    try {
        const alerts = await checkAlerts();

        if (alerts.length > 0) {
            let report = `🔔 가격 알림\n${'='.repeat(25)}\n\n`;

            for (const alert of alerts) {
                report += `${alert.message}\n\n`;
            }

            report += `${'='.repeat(25)}\n`;
            report += `📱 @trantradinglab_bot\n`;
            report += `#가격알림 #트레이딩`;

            await sendTelegram(report);

            return new Response(JSON.stringify({
                success: true,
                alertsSent: alerts.length,
                alerts,
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({
            success: true,
            alertsSent: 0,
            message: 'No alerts triggered',
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}
