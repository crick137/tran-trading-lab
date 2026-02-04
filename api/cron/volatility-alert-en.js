/**
 * ⚡ TRAN Volatility Alert (English)
 * Vercel Cron: Hourly (30 * * * * UTC)
 * Channel: @TranTradingLabEN
 * 
 * Trigger conditions:
 * - 1H change ≥ 2.5% (L1)
 * - 4H change ≥ 4.0% (L2)
 * 
 * Limits:
 * - Max 2/day (volatility type)
 * - Max 4/day trigger total (whale + volatility)
 * - 2-hour dedup window (coin:timeframe:direction:level)
 */

import {
    getKSTDisplayDateEN,
    getKSTTimeString,
    canSendTrigger,
    incrementTrigger,
    isDuplicate,
    markSent,
    getVolatilityDedupKey,
    selectHighestPriorityAlert,
    sendTelegram,
    CTA_EN
} from '../../lib/telegram-utils.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@TranTradingLabEN';

const COINS = [
    { symbol: 'BTC-USD', name: 'BTC' },
    { symbol: 'ETH-USD', name: 'ETH' },
    { symbol: 'SOL-USD', name: 'SOL' },
    { symbol: 'XRP-USD', name: 'XRP' }
];

const THRESHOLDS = {
    '1h': 2.5,
    '4h': 4.0
};

// ============================================
// Data Fetching
// ============================================

async function fetchPriceData(symbol, interval, range) {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        const resp = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(10000)
        });
        const data = await resp.json();

        if (data.chart?.result?.[0]) {
            const quotes = data.chart.result[0].indicators.quote[0];
            const closes = quotes.close.filter(c => c !== null);

            if (closes.length >= 2) {
                const current = closes[closes.length - 1];
                const compare = closes[0];
                const change = ((current - compare) / compare) * 100;
                return { price: current, change };
            }
        }
        return null;
    } catch (e) {
        console.error(`Price fetch error for ${symbol}:`, e.message);
        return null;
    }
}

async function checkVolatility() {
    const alerts = [];

    for (const coin of COINS) {
        const data1h = await fetchPriceData(coin.symbol, '5m', '1h');
        if (data1h && Math.abs(data1h.change) >= THRESHOLDS['1h']) {
            alerts.push({
                coin: coin.name,
                price: data1h.price,
                change: data1h.change,
                timeframe: '1h',
                level: Math.abs(data1h.change) >= THRESHOLDS['4h'] ? 'L2' : 'L1'
            });
        }

        const data4h = await fetchPriceData(coin.symbol, '15m', '4h');
        if (data4h && Math.abs(data4h.change) >= THRESHOLDS['4h']) {
            alerts.push({
                coin: coin.name,
                price: data4h.price,
                change: data4h.change,
                timeframe: '4h',
                level: 'L2'
            });
        }
    }

    return alerts;
}

// ============================================
// Message Generation
// ============================================

function getActionSuggestion(change, timeframe) {
    const direction = change > 0 ? 'up' : 'down';
    const magnitude = Math.abs(change);

    if (direction === 'up') {
        if (magnitude >= 5) {
            return '⚠️ Sharp rally — avoid chasing, wait for pullback before entry';
        }
        return '💡 Bullish momentum — beware FOMO, consider partial profit-taking';
    } else {
        if (magnitude >= 5) {
            return '⚠️ Sharp drop — avoid panic selling, watch support levels for DCA';
        }
        return '💡 Bearish pressure — check stop-losses, reduce leverage';
    }
}

function getPossibleReasons(change, coin) {
    const direction = change > 0 ? 'up' : 'down';
    const reasons = [];

    if (direction === 'up') {
        reasons.push('• Short liquidation cascade (estimated)');
        reasons.push('• Breaking key resistance level');
        if (coin === 'BTC') {
            reasons.push('• Possible ETF inflows');
        }
    } else {
        reasons.push('• Long liquidation cascade (estimated)');
        reasons.push('• Breaking key support level');
        reasons.push('• Large sell orders detected');
    }

    return reasons.slice(0, 2).join('\n');
}

function generateMessage(alert) {
    const { coin, price, change, timeframe } = alert;
    const dateStr = getKSTDisplayDateEN();
    const direction = change > 0 ? 'Surge' : 'Drop';
    const emoji = change > 0 ? '🚀' : '📉';
    const changeStr = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    const timeframeStr = timeframe === '1h' ? '1 Hour' : '4 Hours';

    let msg = `${emoji} <b>${direction} Alert</b> | ${coin}\n\n`;
    msg += `━━━━━━━━━━━━━━━━\n\n`;

    msg += `📊 <b>${timeframeStr}:</b> ${changeStr}\n`;
    msg += `💵 <b>Current:</b> $${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}\n\n`;

    msg += `📌 <b>Possible Reasons:</b>\n`;
    msg += getPossibleReasons(change, coin);
    msg += `\n\n`;

    msg += getActionSuggestion(change, timeframe);
    msg += `\n\n`;

    msg += `<i>※ This is for informational purposes only, not investment advice.</i>\n\n`;

    msg += `━━━━━━━━━━━━━━━━\n`;
    msg += `⏰ ${getKSTTimeString()}\n`;
    msg += CTA_EN;
    msg += `\n\n#${direction}Alert #${coin} #TranTradingLab`;

    return msg;
}

// ============================================
// Handler
// ============================================

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    const isTest = req.url?.includes('test=true');

    if (!isTest && authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log('⚡ Checking for volatility (EN)...');

        const canSend = await canSendTrigger(CHANNEL_ID, 'volatility');
        if (!canSend && !isTest) {
            console.log('Volatility alert EN: Rate limit reached');
            return res.status(200).json({
                success: false,
                reason: 'Rate limit reached'
            });
        }

        const allAlerts = await checkVolatility();

        if (allAlerts.length === 0) {
            return res.status(200).json({
                success: true,
                alertsSent: 0,
                message: 'No volatility detected'
            });
        }

        const coinGroups = {};
        for (const alert of allAlerts) {
            if (!coinGroups[alert.coin]) {
                coinGroups[alert.coin] = [];
            }
            coinGroups[alert.coin].push(alert);
        }

        let alertsSent = 0;

        for (const coin of Object.keys(coinGroups)) {
            const bestAlert = selectHighestPriorityAlert(coinGroups[coin]);
            if (!bestAlert) continue;

            const dedupKey = getVolatilityDedupKey(
                bestAlert.coin,
                bestAlert.timeframe,
                bestAlert.change
            );

            const isDup = await isDuplicate(dedupKey);
            if (isDup) {
                console.log(`Skipping duplicate: ${dedupKey}`);
                continue;
            }

            const stillCanSend = await canSendTrigger(CHANNEL_ID, 'volatility');
            if (!stillCanSend && !isTest) {
                break;
            }

            const message = generateMessage(bestAlert);
            const result = await sendTelegram(CHANNEL_ID, message, TELEGRAM_BOT_TOKEN);

            if (result.ok) {
                await Promise.all([
                    incrementTrigger(CHANNEL_ID, 'volatility'),
                    markSent(dedupKey)
                ]);
                alertsSent++;
                console.log(`✅ Sent volatility alert (EN) for ${bestAlert.coin}`);
            }
        }

        return res.status(200).json({
            success: true,
            alertsSent,
            totalDetected: allAlerts.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Volatility alert EN error:', error);
        return res.status(500).json({ error: error.message });
    }
}
