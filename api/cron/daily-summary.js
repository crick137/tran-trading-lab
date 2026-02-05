/**
 * 📊 TRAN 매일 시장 요약 (Daily Summary)
 * Vercel Cron: 매일 20:00 KST (11:00 UTC)
 * 채널: @TranTradingLabNewsKR
 * 
 * 구조: TL;DR + 3대 요점(공포지수 포함) + 핵심 가격 + 리스크 경고 + CTA
 */

import {
    getKSTDisplayDate,
    getKSTTimeString,
    canSendRegular,
    incrementRegular,
    getFearGreedData,
    getFearGreedKR,
    sendTelegram,
    CTA_KR
} from '../../lib/telegram-utils.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@TranTradingLabNewsKR';

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
    const [btc, eth, usdkrw, kospi] = await Promise.all([
        fetchYahooFinance('BTC-USD'),
        fetchYahooFinance('ETH-USD'),
        fetchYahooFinance('USDKRW=X'),
        fetchYahooFinance('^KS11')
    ]);

    return { btc, eth, usdkrw, kospi };
}

// ============================================
// Message Generation
// ============================================

function generateTLDR(btc, fng) {
    if (!btc) return '시장 데이터 수집 중...';

    const trend = btc.change > 1 ? '강세' : btc.change < -1 ? '약세' : '횡보';
    const sentiment = fng ? (fng.value < 30 ? '공포 우세' : fng.value > 70 ? '탐욕 과열' : '중립 심리') : '';

    return `BTC ${trend} 흐름${sentiment ? `, ${sentiment}` : ''} — 주요 지지/저항 근접 시 변동성 확대 주의`;
}

function formatPrice(price, decimals = 0) {
    if (!price) return 'N/A';
    return price.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

function generateMessage(marketData, fng) {
    const { btc, eth, usdkrw } = marketData;
    const dateStr = getKSTDisplayDate();

    // TL;DR
    const tldr = generateTLDR(btc, fng);

    // Build message
    let msg = `📊 <b>매일 시장 요약</b> | ${dateStr}\n\n`;
    msg += `💡 <b>TL;DR:</b> ${tldr}\n\n`;
    msg += `━━━━━━━━━━━━━━━━\n\n`;

    // 3대 요점
    msg += `📌 <b>3대 요점</b>\n`;

    // 1. 가격 동향
    if (btc) {
        const btcEmoji = btc.change > 0 ? '🔺' : '🔻';
        msg += `• <b>BTC:</b> $${formatPrice(btc.price)} ${btcEmoji}${btc.change > 0 ? '+' : ''}${btc.change.toFixed(1)}%\n`;
    }
    if (eth) {
        const ethEmoji = eth.change > 0 ? '🔺' : '🔻';
        msg += `• <b>ETH:</b> $${formatPrice(eth.price)} ${ethEmoji}${eth.change > 0 ? '+' : ''}${eth.change.toFixed(1)}%\n`;
    }

    // 2. 심리/자금면 (공포지수)
    if (fng) {
        const changeStr = fng.change > 0 ? `+${fng.change}` : fng.change.toString();
        msg += `• <b>심리:</b> 공포지수 ${fng.value} ${fng.emoji} (${getFearGreedKR(fng.classification)}, 어제 대비 ${changeStr})\n`;
    }

    // 3. 환율
    if (usdkrw) {
        const krwEmoji = usdkrw.change > 0 ? '📈' : '📉';
        msg += `• <b>USD/KRW:</b> ${formatPrice(usdkrw.price, 2)}원 ${krwEmoji}\n`;
    }

    msg += `\n`;

    // 핵심 가격 레벨
    msg += `📍 <b>핵심 가격</b>\n`;
    if (btc) {
        // 간단한 지지/저항 계산 (실제로는 더 정교한 로직 필요)
        const resistance = Math.ceil(btc.price / 1000) * 1000 + 2000;
        const support = Math.floor(btc.price / 1000) * 1000 - 2000;
        msg += `• 상단 돌파: $${formatPrice(resistance)} → 추가 상승 여력\n`;
        msg += `• 하단 이탈: $${formatPrice(support)} → 조정 확대 가능\n`;
        msg += `• 당일 레인지: $${formatPrice(btc.low24)} - $${formatPrice(btc.high24)}\n`;
    }

    msg += `\n`;

    // 리스크 경고
    msg += `⚠️ <b>리스크:</b> `;
    if (fng && fng.value < 25) {
        msg += `극심한 공포 구간 — 패닉 매도 자제, 분할 매수 고려`;
    } else if (fng && fng.value > 75) {
        msg += `과열 구간 — 추격 매수 자제, 일부 익절 고려`;
    } else {
        msg += `주요 이벤트 전후 변동성 확대 가능 — 레버리지 축소 권장`;
    }

    msg += `\n\n━━━━━━━━━━━━━━━━\n`;
    msg += `⏰ ${getKSTTimeString()}\n`;
    msg += CTA_KR;
    msg += `\n\n#매일요약 #BTC #ETH #TranTradingLab`;

    return msg;
}

// ============================================
// Handler
// ============================================

export default async function handler(req, res) {
    // Auth check
    const authHeader = req.headers.authorization;
    const isTest = req.url?.includes('test=true');

    if (!isTest && authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Rate limit check
        const canSend = await canSendRegular(CHANNEL_ID);
        if (!canSend && !isTest) {
            console.log('Daily summary: Rate limit reached');
            return res.status(200).json({
                success: false,
                reason: 'Rate limit reached (regular ≤2/day)'
            });
        }

        console.log('📊 Generating daily summary...');

        // Fetch data
        const [marketData, fng] = await Promise.all([
            getMarketData(),
            getFearGreedData()
        ]);

        // Generate message
        const message = generateMessage(marketData, fng);

        // Send to Telegram
        const result = await sendTelegram(CHANNEL_ID, message, TELEGRAM_BOT_TOKEN);

        if (result.ok) {
            await incrementRegular(CHANNEL_ID);
            console.log('✅ Daily summary sent successfully');
        }

        return res.status(200).json({
            success: result.ok,
            channel: CHANNEL_ID,
            messageId: result.result?.message_id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Daily summary error:', error);
        return res.status(500).json({ error: error.message });
    }
}
