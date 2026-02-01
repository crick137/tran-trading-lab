// Vercel Cron - Economic Calendar (English)
// api/cron/economic-calendar-en.js
// Weekly economic events for @TranTradingLabEN

export const config = {
    runtime: 'edge',
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '@TranTradingLabEN';

// Important economic events database
const RECURRING_EVENTS = {
    // United States
    'US_NFP': { name: '🇺🇸 Non-Farm Payrolls (NFP)', day: 'first_friday', impact: 'high' },
    'US_CPI': { name: '🇺🇸 Consumer Price Index (CPI)', day: 'mid_month', impact: 'high' },
    'US_FOMC': { name: '🇺🇸 FOMC Interest Rate Decision', day: 'variable', impact: 'high' },
    'US_GDP': { name: '🇺🇸 GDP Growth Rate', day: 'end_month', impact: 'high' },
    'US_PMI': { name: '🇺🇸 ISM Manufacturing PMI', day: 'first_business', impact: 'medium' },

    // Europe
    'ECB_RATE': { name: '🇪🇺 ECB Interest Rate Decision', day: 'variable', impact: 'high' },
    'EU_CPI': { name: '🇪🇺 Eurozone CPI', day: 'end_month', impact: 'medium' },

    // Asia
    'CN_PMI': { name: '🇨🇳 China Manufacturing PMI', day: 'end_month', impact: 'high' },
    'JP_BOJ': { name: '🇯🇵 BOJ Interest Rate Decision', day: 'variable', impact: 'high' },
    'KR_RATE': { name: '🇰🇷 Bank of Korea Rate Decision', day: 'variable', impact: 'medium' },

    // Crypto
    'CRYPTO_ETF': { name: '₿ Bitcoin ETF Flows', day: 'daily', impact: 'medium' },
};

// Get weekly events
async function getWeeklyEvents() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const events = [];

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek + 1);

    const dayOfMonth = today.getDate();

    // First week events
    if (dayOfMonth <= 7) {
        events.push({ day: 'Mon', event: '🇺🇸 ISM Manufacturing PMI', impact: '⭐⭐' });
        events.push({ day: 'Mon', event: '🇨🇳 Caixin Manufacturing PMI', impact: '⭐⭐' });
    }

    // Mid-month events
    if (dayOfMonth >= 10 && dayOfMonth <= 15) {
        events.push({ day: 'Wed', event: '🇺🇸 CPI Release', impact: '⭐⭐⭐' });
    }

    // First Friday of month
    const firstFriday = new Date(weekStart);
    firstFriday.setDate(firstFriday.getDate() + (5 - firstFriday.getDay() + 7) % 7);
    if (firstFriday.getDate() <= 7) {
        events.push({ day: 'Fri', event: '🇺🇸 Non-Farm Payrolls (NFP)', impact: '⭐⭐⭐' });
    }

    // Fixed weekly events
    events.push({ day: 'Daily', event: '₿ Bitcoin ETF Flows', impact: '⭐⭐' });
    events.push({ day: 'Thu', event: '🇺🇸 Initial Jobless Claims', impact: '⭐' });

    return events;
}

async function generateCalendarReport() {
    const events = await getWeeklyEvents();
    const today = new Date();
    const weekNum = Math.ceil((today.getDate() + new Date(today.getFullYear(), today.getMonth(), 1).getDay()) / 7);
    const monthName = today.toLocaleString('en-US', { month: 'long' });

    let report = `📅 This Week's Economic Calendar\n`;
    report += `${monthName} Week ${weekNum}\n`;
    report += `${'='.repeat(30)}\n\n`;

    // Sort by impact
    events.sort((a, b) => b.impact.length - a.impact.length);

    for (const event of events) {
        report += `${event.impact} ${event.day}: ${event.event}\n`;
    }

    report += `\n${'='.repeat(30)}\n`;
    report += `💡 Watch for volatility around key events\n`;
    report += `📱 @TranTradingLabEN\n\n`;
    report += `#EconomicCalendar #Trading #Forex #Stocks`;

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
        const report = await generateCalendarReport();
        const result = await sendTelegram(report);

        return new Response(JSON.stringify({
            success: true,
            telegram: result,
            report,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
        });
    }
}
