/**
 * 📊 TRAN Weekly Market Review (English)
 * Vercel Cron: Sunday 20:30 KST (11:30 UTC Sunday)
 * Channel: @TranTradingLabEN
 * 
 * Structure:
 * - This week summary (events/flows)
 * - Key price levels
 * - Next week scenarios (up/down/range)
 * - Risk event calendar
 */

import {
    getKSTTimeString,
    sendTelegram,
    getFearGreedData,
    CTA_EN
} from '../../lib/telegram-utils.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@TranTradingLabEN';

// ============================================
// Data Fetching
// ============================================

async function fetchWeeklyData(symbol) {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=7d`;
        const resp = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(10000)
        });
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
                    low: weekLow
                };
            }
        }
        return null;
    } catch (e) {
        console.error(`Weekly data error for ${symbol}:`, e.message);
        return null;
    }
}

// ============================================
// Message Generation
// ============================================

function getWeekInfo() {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const month = kst.toLocaleDateString('en-US', { month: 'long' });
    const weekNum = Math.ceil(kst.getDate() / 7);
    return { month, weekNum };
}

function formatPrice(price, decimals = 0) {
    if (!price) return 'N/A';
    return price.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

function generateScenarios(btc) {
    if (!btc) return [];

    const current = btc.current;
    const resistance = Math.ceil(current / 1000) * 1000 + 3000;
    const support = Math.floor(current / 1000) * 1000 - 3000;

    return [
        {
            type: 'Bullish',
            condition: `Break $${formatPrice(resistance)} with volume`,
            target: `$${formatPrice(resistance + 5000)} first target`
        },
        {
            type: 'Bearish',
            condition: `Lose $${formatPrice(support)} + F&G below 25`,
            target: `$${formatPrice(support - 5000)} support test`
        },
        {
            type: 'Range',
            condition: `Hold $${formatPrice(support)} - $${formatPrice(resistance)}`,
            target: `Consolidation, await catalyst`
        }
    ];
}

function getNextWeekEvents() {
    const events = [];
    const now = new Date();
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const nextWeekStart = new Date(kstNow.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextDay = nextWeekStart.getDate();

    if (nextDay <= 7) {
        events.push('Mon: ISM Manufacturing PMI');
    }
    if (nextDay >= 10 && nextDay <= 15) {
        events.push('Wed: 🇺🇸 CPI Release');
    }
    events.push('Thu: Initial Jobless Claims');
    events.push('Fri: BTC ETF Weekly Flow Summary');

    return events.slice(0, 3);
}

async function generateMessage() {
    const { month, weekNum } = getWeekInfo();

    const [btc, eth, dxy, fng] = await Promise.all([
        fetchWeeklyData('BTC-USD'),
        fetchWeeklyData('ETH-USD'),
        fetchWeeklyData('DX-Y.NYB'),
        getFearGreedData()
    ]);

    let msg = `📊 <b>Weekly Market Review</b> | ${month} Week ${weekNum}\n\n`;
    msg += `━━━━━━━━━━━━━━━━\n\n`;

    // This week summary
    msg += `📌 <b>This Week Summary</b>\n`;

    if (btc) {
        const btcEmoji = btc.change > 0 ? '🔺' : '🔻';
        const trend = btc.change > 3 ? 'bullish' : btc.change < -3 ? 'bearish' : 'ranging';
        msg += `• BTC ${trend} week (${btcEmoji}${btc.change > 0 ? '+' : ''}${btc.change.toFixed(1)}%)\n`;
    }
    if (eth) {
        const ethEmoji = eth.change > 0 ? '🔺' : '🔻';
        msg += `• ETH: ${ethEmoji}${eth.change > 0 ? '+' : ''}${eth.change.toFixed(1)}%\n`;
    }
    if (fng) {
        const sentimentTrend = fng.change > 5 ? 'recovering' : fng.change < -5 ? 'deteriorating' : 'stable';
        msg += `• Sentiment ${sentimentTrend} (F&G: ${fng.value} ${fng.emoji})\n`;
    }
    if (dxy) {
        const dxyEmoji = dxy.change > 0 ? '📈' : '📉';
        msg += `• DXY ${dxyEmoji} ${formatPrice(dxy.current, 2)}\n`;
    }

    msg += `\n`;

    // Key levels
    msg += `📍 <b>Key Levels</b>\n`;
    if (btc) {
        msg += `• BTC Resistance: $${formatPrice(btc.high)} / Support: $${formatPrice(btc.low)}\n`;
    }
    if (eth) {
        msg += `• ETH Resistance: $${formatPrice(eth.high)} / Support: $${formatPrice(eth.low)}\n`;
    }

    msg += `\n`;

    // Next week scenarios
    msg += `🎯 <b>Next Week Scenarios</b>\n`;
    const scenarios = generateScenarios(btc);
    scenarios.forEach((s, i) => {
        const icons = ['1️⃣', '2️⃣', '3️⃣'];
        msg += `${icons[i]} <b>${s.type}:</b> ${s.condition}\n`;
        msg += `   → ${s.target}\n`;
    });

    msg += `\n`;

    // Risk events
    msg += `📅 <b>Key Risk Events</b>\n`;
    const nextEvents = getNextWeekEvents();
    nextEvents.forEach(e => {
        msg += `• ${e}\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━\n`;
    msg += `💡 Good luck trading next week!\n`;
    msg += `⏰ ${getKSTTimeString()}\n`;
    msg += CTA_EN;
    msg += `\n\n#WeeklyReview #BTC #ETH #TranTradingLab`;

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
        console.log('📊 Generating weekly report (EN)...');

        const message = await generateMessage();
        const result = await sendTelegram(CHANNEL_ID, message, TELEGRAM_BOT_TOKEN);

        if (result.ok) {
            console.log('✅ Weekly report (EN) sent successfully');
        }

        return res.status(200).json({
            success: result.ok,
            channel: CHANNEL_ID,
            messageId: result.result?.message_id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Weekly report EN error:', error);
        return res.status(500).json({ error: error.message });
    }
}
