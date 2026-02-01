// Vercel Cron - Price Alerts (English)
// api/cron/price-alert-en.js
// BTC/ETH/USD-KRW/KOSPI price breakout alerts for @TranTradingLabEN

export const config = {
    runtime: 'edge',
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '@TranTradingLabEN';

// Price Alert Thresholds
const PRICE_ALERTS = {
    'BTC-USD': {
        name: 'BTC',
        breakout_high: 100000,
        breakout_low: 85000,
        daily_change_alert: 5, // 5% daily change alert
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
    '^GSPC': {
        name: 'S&P 500',
        breakout_high: 6000,
        breakout_low: 5500,
        daily_change_alert: 2,
    },
    '^DJI': {
        name: 'Dow Jones',
        breakout_high: 45000,
        breakout_low: 42000,
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

        // Check breakouts
        if (price >= config.breakout_high) {
            alerts.push({
                type: 'breakout_high',
                symbol: config.name,
                price,
                threshold: config.breakout_high,
                message: `🚀 ${config.name} Resistance Breakout!\nCurrent: ${price.toLocaleString()}\nBreakout Level: ${config.breakout_high.toLocaleString()}`,
            });
        } else if (price <= config.breakout_low) {
            alerts.push({
                type: 'breakout_low',
                symbol: config.name,
                price,
                threshold: config.breakout_low,
                message: `⚠️ ${config.name} Support Break!\nCurrent: ${price.toLocaleString()}\nSupport Level: ${config.breakout_low.toLocaleString()}`,
            });
        }

        // Check daily change
        if (Math.abs(change) >= config.daily_change_alert) {
            const emoji = change > 0 ? '📈' : '📉';
            const direction = change > 0 ? 'Surge' : 'Plunge';
            alerts.push({
                type: 'volatility',
                symbol: config.name,
                change,
                message: `${emoji} ${config.name} ${direction} Alert!\nChange: ${change > 0 ? '+' : ''}${change.toFixed(2)}%\nCurrent: ${price.toLocaleString()}`,
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
            let report = `🔔 Price Alert\n${'='.repeat(25)}\n\n`;

            for (const alert of alerts) {
                report += `${alert.message}\n\n`;
            }

            report += `${'='.repeat(25)}\n`;
            report += `📱 @TranTradingLabEN\n`;
            report += `#PriceAlert #Trading`;

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
