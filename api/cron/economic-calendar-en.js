/**
 * 📅 TRAN Economic Calendar (English)
 * Vercel Cron: Daily 08:00 KST (23:00 UTC)
 * Channel: @TranTradingLabEN
 * 
 * Features:
 * - Top 3 events only
 * - Score-based ranking (importance + risk asset/USD/rate impact)
 * - Direction hint for each event
 */

import {
    getKSTDisplayDateEN,
    getKSTTimeString,
    canSendRegular,
    incrementRegular,
    sendTelegram,
    CTA_EN
} from '../../lib/telegram-utils.js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@TranTradingLabEN';

// ============================================
// Event Database
// ============================================

const EVENT_LIBRARY = {
    'FOMC': {
        nameEN: '🇺🇸 FOMC Rate Decision',
        importance: 3,
        affectsRiskAssets: true,
        affectsUSD: true,
        affectsRates: true,
        cryptoRelevant: true,
        hint: 'Hold/cut → risk assets up; hike → downward pressure'
    },
    'CPI': {
        nameEN: '🇺🇸 Consumer Price Index (CPI)',
        importance: 3,
        affectsRiskAssets: true,
        affectsUSD: true,
        affectsRates: true,
        cryptoRelevant: true,
        hint: 'Below expectations → rate cut hopes ↑ → risk assets up'
    },
    'NFP': {
        nameEN: '🇺🇸 Non-Farm Payrolls (NFP)',
        importance: 3,
        affectsRiskAssets: true,
        affectsUSD: true,
        affectsRates: true,
        cryptoRelevant: false,
        hint: 'Above expectations → USD strong, rate hike concerns'
    },
    'GDP': {
        nameEN: '🇺🇸 GDP Growth Rate',
        importance: 2,
        affectsRiskAssets: true,
        affectsUSD: true,
        affectsRates: true,
        cryptoRelevant: false,
        hint: 'Strong GDP → economic recovery hopes, stocks may rise'
    },
    'PMI': {
        nameEN: '🇺🇸 ISM Manufacturing PMI',
        importance: 2,
        affectsRiskAssets: true,
        affectsUSD: false,
        affectsRates: false,
        cryptoRelevant: false,
        hint: 'Above 50 = expansion signal, below 50 = contraction'
    },
    'JOBLESS': {
        nameEN: '🇺🇸 Initial Jobless Claims',
        importance: 1,
        affectsRiskAssets: false,
        affectsUSD: false,
        affectsRates: false,
        cryptoRelevant: false,
        hint: 'Higher than expected → labor market weakness'
    },
    'BOK': {
        nameEN: '🇰🇷 Bank of Korea Rate Decision',
        importance: 3,
        affectsRiskAssets: false,
        affectsUSD: false,
        affectsRates: true,
        cryptoRelevant: false,
        hint: 'Hold/cut → KRW weakness, positive for Korean stocks'
    },
    'KR_CPI': {
        nameEN: '🇰🇷 Consumer Price Index',
        importance: 2,
        affectsRiskAssets: false,
        affectsUSD: false,
        affectsRates: true,
        cryptoRelevant: false,
        hint: 'Lower inflation → rate cut expectations'
    },
    'KR_TRADE': {
        nameEN: '🇰🇷 Trade Balance',
        importance: 2,
        affectsRiskAssets: false,
        affectsUSD: false,
        affectsRates: false,
        cryptoRelevant: false,
        hint: 'Surplus expansion → potential KRW strength'
    },
    'ETF_FLOW': {
        nameEN: '₿ BTC ETF Flows',
        importance: 2,
        affectsRiskAssets: true,
        affectsUSD: false,
        affectsRates: false,
        cryptoRelevant: true,
        hint: 'Net inflows → bullish momentum; outflows → correction risk'
    }
};

// ============================================
// Event Scoring
// ============================================

function calculateEventScore(event) {
    let score = 0;
    score += event.importance * 10;
    if (event.affectsRiskAssets) score += 15;
    if (event.affectsUSD) score += 10;
    if (event.affectsRates) score += 10;
    if (event.cryptoRelevant) score += 5;
    return score;
}

// ============================================
// Get Today's Events
// ============================================

function getTodayEvents() {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const dayOfWeek = today.getDay();

    const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const kstDay = kstDate.getDate();

    const events = [];

    events.push({
        ...EVENT_LIBRARY['ETF_FLOW'],
        time: 'Daily update'
    });

    if (kstDay <= 7) {
        const firstFriday = 1 + ((5 - new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 7) % 7);
        if (kstDay === firstFriday) {
            events.push({
                ...EVENT_LIBRARY['NFP'],
                time: '8:30 AM ET'
            });
        }

        if (dayOfWeek >= 1 && dayOfWeek <= 5 && kstDay <= 3) {
            events.push({
                ...EVENT_LIBRARY['PMI'],
                time: '10:00 AM ET'
            });
        }

        if (kstDay <= 3) {
            events.push({
                ...EVENT_LIBRARY['KR_TRADE'],
                time: '09:00 KST'
            });
        }
    }

    if (kstDay >= 10 && kstDay <= 15) {
        events.push({
            ...EVENT_LIBRARY['CPI'],
            time: '8:30 AM ET'
        });
    }

    if (dayOfWeek === 4) {
        events.push({
            ...EVENT_LIBRARY['JOBLESS'],
            time: '8:30 AM ET'
        });
    }

    if (kstDay >= 25 && kstDay <= 31) {
        events.push({
            ...EVENT_LIBRARY['GDP'],
            time: '8:30 AM ET'
        });
    }

    return events;
}

// ============================================
// Message Generation
// ============================================

function generateMessage() {
    const dateStr = getKSTDisplayDateEN();
    const events = getTodayEvents();

    const scoredEvents = events.map(e => ({
        ...e,
        score: calculateEventScore(e)
    }));
    scoredEvents.sort((a, b) => b.score - a.score);

    const top3 = scoredEvents.slice(0, 3);

    let msg = `📅 <b>Today's Economic Events</b> | ${dateStr}\n\n`;
    msg += `━━━━━━━━━━━━━━━━\n\n`;

    const emojis = ['1️⃣', '2️⃣', '3️⃣'];

    top3.forEach((event, i) => {
        msg += `${emojis[i]} <b>${event.nameEN}</b>`;
        if (event.time) {
            msg += ` (${event.time})`;
        }
        msg += `\n`;
        msg += `   → ${event.hint}\n\n`;
    });

    msg += `━━━━━━━━━━━━━━━━\n`;
    msg += `⚠️ Expect volatility around these events\n`;
    msg += `⏰ ${getKSTTimeString()}\n`;
    msg += CTA_EN;
    msg += `\n\n#EconomicCalendar #Macro #TranTradingLab`;

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
            console.log('Economic calendar EN: Rate limit reached');
            return res.status(200).json({
                success: false,
                reason: 'Rate limit reached (regular ≤2/day)'
            });
        }

        console.log('📅 Generating economic calendar (EN)...');

        const message = generateMessage();
        const result = await sendTelegram(CHANNEL_ID, message, TELEGRAM_BOT_TOKEN);

        if (result.ok) {
            await incrementRegular(CHANNEL_ID);
            console.log('✅ Economic calendar (EN) sent successfully');
        }

        return res.status(200).json({
            success: result.ok,
            channel: CHANNEL_ID,
            messageId: result.result?.message_id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Economic calendar EN error:', error);
        return res.status(500).json({ error: error.message });
    }
}
