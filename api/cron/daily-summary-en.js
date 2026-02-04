/**
 * 📊 TRAN Daily Market Summary (English)
 * Vercel Cron: Daily 20:30 KST (11:30 UTC)
 * Channel: @TranTradingLabEN
 * 
 * Structure: TL;DR + 3 Key Points (incl. Fear/Greed) + Key Levels + Risk Warning + CTA
 */

import {
    getKSTDisplayDateEN,
    getKSTTimeString,
    canSendRegular,
    incrementRegular,
    getFearGreedData,
    sendTelegram,
    CTA_EN
} from '../../lib/telegram-utils.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@TranTradingLabEN';

// ============================================
// Data Fetching
// ============================================

async function fetchYahooFinance(symbol) {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`;
        const resp = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(10000)
        });
        const data = await resp.json();

        if (data.chart?.result?.[0]) {
            const result = data.chart.result[0];
            const quotes = result.indicators.quote[0];
            const closes = quotes.close.filter(c => c !== null);
            const highs = quotes.high.filter(h => h !== null);
            const lows = quotes.low.filter(l => l !== null);

            if (closes.length >= 2) {
                const latest = closes[closes.length - 1];
                const prev = closes[closes.length - 2];
                const change = ((latest - prev) / prev) * 100;
                const high24 = Math.max(...highs.slice(-1));
                const low24 = Math.min(...lows.slice(-1));

                return { price: latest, change, high24, low24 };
            }
        }
        return null;
    } catch (e) {
        console.error(`Yahoo Finance error for ${symbol}:`, e.message);
        return null;
    }
}

async function getMarketData() {
    const [btc, eth, dxy] = await Promise.all([
        fetchYahooFinance('BTC-USD'),
        fetchYahooFinance('ETH-USD'),
        fetchYahooFinance('DX-Y.NYB')
    ]);

    return { btc, eth, dxy };
}

// ============================================
// Message Generation
// ============================================

function generateTLDR(btc, fng) {
    if (!btc) return 'Market data loading...';

    const trend = btc.change > 1 ? 'bullish' : btc.change < -1 ? 'bearish' : 'ranging';
    const sentiment = fng ? (fng.value < 30 ? 'fear dominates' : fng.value > 70 ? 'greed overheated' : 'neutral sentiment') : '';

    return `BTC ${trend}${sentiment ? `, ${sentiment}` : ''} — watch for volatility near key S/R levels`;
}

function formatPrice(price, decimals = 0) {
    if (!price) return 'N/A';
    return price.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

function generateMessage(marketData, fng) {
    const { btc, eth, dxy } = marketData;
    const dateStr = getKSTDisplayDateEN();

    const tldr = generateTLDR(btc, fng);

    let msg = `📊 <b>Daily Market Summary</b> | ${dateStr}\n\n`;
    msg += `💡 <b>TL;DR:</b> ${tldr}\n\n`;
    msg += `━━━━━━━━━━━━━━━━\n\n`;

    // 3 Key Points
    msg += `📌 <b>3 Key Points</b>\n`;

    if (btc) {
        const btcEmoji = btc.change > 0 ? '🔺' : '🔻';
        msg += `• <b>BTC:</b> $${formatPrice(btc.price)} ${btcEmoji}${btc.change > 0 ? '+' : ''}${btc.change.toFixed(1)}%\n`;
    }
    if (eth) {
        const ethEmoji = eth.change > 0 ? '🔺' : '🔻';
        msg += `• <b>ETH:</b> $${formatPrice(eth.price)} ${ethEmoji}${eth.change > 0 ? '+' : ''}${eth.change.toFixed(1)}%\n`;
    }

    if (fng) {
        const changeStr = fng.change > 0 ? `+${fng.change}` : fng.change.toString();
        msg += `• <b>Sentiment:</b> Fear & Greed ${fng.value} ${fng.emoji} (${fng.classification}, ${changeStr} from yesterday)\n`;
    }

    if (dxy) {
        const dxyEmoji = dxy.change > 0 ? '📈' : '📉';
        msg += `• <b>DXY:</b> ${formatPrice(dxy.price, 2)} ${dxyEmoji}\n`;
    }

    msg += `\n`;

    // Key Levels
    msg += `📍 <b>Key Levels</b>\n`;
    if (btc) {
        const resistance = Math.ceil(btc.price / 1000) * 1000 + 2000;
        const support = Math.floor(btc.price / 1000) * 1000 - 2000;
        msg += `• Break above: $${formatPrice(resistance)} → upside potential\n`;
        msg += `• Break below: $${formatPrice(support)} → correction risk\n`;
        msg += `• Daily range: $${formatPrice(btc.low24)} - $${formatPrice(btc.high24)}\n`;
    }

    msg += `\n`;

    // Risk Warning
    msg += `⚠️ <b>Risk:</b> `;
    if (fng && fng.value < 25) {
        msg += `Extreme fear zone — avoid panic selling, consider DCA`;
    } else if (fng && fng.value > 75) {
        msg += `Overheated zone — avoid FOMO, consider taking profits`;
    } else {
        msg += `Volatility ahead of key events — reduce leverage`;
    }

    msg += `\n\n━━━━━━━━━━━━━━━━\n`;
    msg += `⏰ ${getKSTTimeString()}\n`;
    msg += CTA_EN;
    msg += `\n\n#DailySummary #BTC #ETH #TranTradingLab`;

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
        const canSend = await canSendRegular(CHANNEL_ID);
        if (!canSend && !isTest) {
            console.log('Daily summary EN: Rate limit reached');
            return res.status(200).json({
                success: false,
                reason: 'Rate limit reached (regular ≤2/day)'
            });
        }

        console.log('📊 Generating daily summary (EN)...');

        const [marketData, fng] = await Promise.all([
            getMarketData(),
            getFearGreedData()
        ]);

        const message = generateMessage(marketData, fng);
        const result = await sendTelegram(CHANNEL_ID, message, TELEGRAM_BOT_TOKEN);

        if (result.ok) {
            await incrementRegular(CHANNEL_ID);
            console.log('✅ Daily summary (EN) sent successfully');
        }

        return res.status(200).json({
            success: result.ok,
            channel: CHANNEL_ID,
            messageId: result.result?.message_id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Daily summary EN error:', error);
        return res.status(500).json({ error: error.message });
    }
}
