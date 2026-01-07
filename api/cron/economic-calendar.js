/**
 * 📅 TRAN 경제 일정 알림
 * Vercel Cron: 매일 07:30 (KST) 실행
 * 채널: @http4477
 * 
 * 오늘의 주요 경제 이벤트를 알립니다 (모든 금융 시장 대상)
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'

// 중요도 이모지
const IMPORTANCE_EMOJI = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
}

// 국가 플래그
const COUNTRY_FLAGS = {
    'US': '🇺🇸',
    'EU': '🇪🇺',
    'JP': '🇯🇵',
    'CN': '🇨🇳',
    'KR': '🇰🇷',
    'GB': '🇬🇧',
    'DE': '🇩🇪',
    'AU': '🇦🇺',
    'CA': '🇨🇦',
    'CH': '🇨🇭',
    'NZ': '🇳🇿'
}

async function fetchEconomicCalendar() {
    try {
        // Finnhub API (무료 티어 사용 가능)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const fromDate = today.toISOString().split('T')[0]
        const toDate = tomorrow.toISOString().split('T')[0]

        const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY

        if (!FINNHUB_API_KEY) {
            console.log('Finnhub API key not set, using fallback data')
            return getFallbackEvents()
        }

        const res = await fetch(
            `https://finnhub.io/api/v1/calendar/economic?from=${fromDate}&to=${toDate}&token=${FINNHUB_API_KEY}`
        )
        const data = await res.json()

        if (data.economicCalendar && data.economicCalendar.length > 0) {
            return data.economicCalendar
                .filter(e => e.impact === 'high' || e.impact === 'medium')
                .map(e => ({
                    time: e.time || 'TBD',
                    country: e.country || 'US',
                    event: e.event,
                    impact: e.impact || 'medium',
                    actual: e.actual,
                    estimate: e.estimate,
                    previous: e.previous
                }))
        }

        return getFallbackEvents()
    } catch (e) {
        console.error('Error fetching calendar:', e.message)
        return getFallbackEvents()
    }
}

function getFallbackEvents() {
    // 주요 정기 이벤트 (API 실패 시 폴백)
    const dayOfWeek = new Date().getDay()
    const events = []

    // 월요일: 아시아 시장 개장
    if (dayOfWeek === 1) {
        events.push({ time: '09:00', country: 'JP', event: '도쿄 증시 개장', impact: 'medium' })
        events.push({ time: '09:00', country: 'KR', event: 'KOSPI 개장', impact: 'medium' })
    }

    // 수요일: FOMC 관련 (필요시)
    // 금요일: 고용 지표 (매월 첫 금요일)
    const date = new Date().getDate()
    if (dayOfWeek === 5 && date <= 7) {
        events.push({ time: '21:30', country: 'US', event: '비농업 고용지수 (NFP)', impact: 'high' })
        events.push({ time: '21:30', country: 'US', event: '실업률', impact: 'high' })
    }

    return events
}

function formatMessage(events) {
    const today = new Date()
    const dateStr = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })

    let message = `📅 TRAN 경제 일정\n`
    message += `━━━━━━━━━━━━━━━━━━━━\n`
    message += `📆 ${dateStr}\n\n`

    if (events.length === 0) {
        message += `✨ 오늘은 주요 경제 이벤트가 없습니다.\n`
        message += `평온한 시장을 예상합니다.\n`
    } else {
        // 중요도순 정렬
        events.sort((a, b) => {
            const order = { high: 0, medium: 1, low: 2 }
            return order[a.impact] - order[b.impact]
        })

        message += `⚠️ 주요 이벤트 ${events.length}건\n\n`

        for (const event of events) {
            const flag = COUNTRY_FLAGS[event.country] || '🌍'
            const importance = IMPORTANCE_EMOJI[event.impact] || '⚪'

            message += `${importance} ${flag} ${event.time} (현지)\n`
            message += `   ${event.event}\n`

            if (event.estimate !== undefined && event.estimate !== null) {
                message += `   예상: ${event.estimate}`
                if (event.previous !== undefined && event.previous !== null) {
                    message += ` | 이전: ${event.previous}`
                }
                message += `\n`
            }
            message += `\n`
        }
    }

    message += `━━━━━━━━━━━━━━━━━━━━\n`
    message += `🔴 높음 🟡 중간 🟢 낮음\n`
    message += `\n🌐 trantradinglab.com`

    return message
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Fetching economic calendar...')
        const events = await fetchEconomicCalendar()
        const message = formatMessage(events)

        const telegramRes = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            }
        )

        const result = await telegramRes.json()

        if (!result.ok) {
            console.error('Telegram error:', result)
            return res.status(500).json({ error: result.description })
        }

        return res.status(200).json({
            success: true,
            eventsCount: events.length,
            messageId: result.result?.message_id
        })

    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: error.message })
    }
}
