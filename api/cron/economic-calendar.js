/**
 * 📅 TRAN 경제 일정 알림
 * Vercel Cron: 매일 07:30 (KST) 실행
 * 채널: @TranTradingLabNews
 * 
 * 오늘의 주요 경제 이벤트 안내
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const NEWS_CHANNEL_ID = process.env.NEWS_CHANNEL_ID || '@TranTradingLabNews'

// ============================================
// 주요 경제 이벤트 DB (정적 데이터)
// 실제 운영시 Investing.com API 또는 Trading Economics API 사용 권장
// ============================================

function getRecurringEvents() {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday
    const dayOfMonth = now.getDate()
    const events = []

    // 매주 수요일: FOMC 관련
    if (dayOfWeek === 3) {
        events.push({
            time: '03:00 (KST)',
            event: 'FOMC 회의록 공개 (해당 주)',
            importance: 'high',
            currency: 'USD'
        })
    }

    // 매주 목요일: 신규 실업수당 청구건수
    if (dayOfWeek === 4) {
        events.push({
            time: '22:30 (KST)',
            event: '미국 신규 실업수당 청구건수',
            importance: 'medium',
            currency: 'USD'
        })
    }

    // 매월 첫째 금요일: 비농업 고용
    if (dayOfWeek === 5 && dayOfMonth <= 7) {
        events.push({
            time: '22:30 (KST)',
            event: '🔥 미국 비농업 고용지표 (NFP)',
            importance: 'critical',
            currency: 'USD'
        })
    }

    // 매월 둘째 수요일: CPI
    if (dayOfWeek === 3 && dayOfMonth >= 8 && dayOfMonth <= 14) {
        events.push({
            time: '22:30 (KST)',
            event: '🔥 미국 소비자물가지수 (CPI)',
            importance: 'critical',
            currency: 'USD'
        })
    }

    // 매월 셋째 주: FOMC 금리 결정 (격월)
    const month = now.getMonth()
    if ([0, 2, 4, 6, 8, 10].includes(month) && dayOfWeek === 3 && dayOfMonth >= 15 && dayOfMonth <= 21) {
        events.push({
            time: '03:00 (다음날 KST)',
            event: '🔥🔥 FOMC 금리 결정',
            importance: 'critical',
            currency: 'USD'
        })
    }

    return events
}

// ============================================
// 암호화폐 이벤트
// ============================================

function getCryptoEvents() {
    const now = new Date()
    const dayOfMonth = now.getDate()
    const month = now.getMonth()
    const events = []

    // BTC 옵션 만기 (매월 마지막 금요일)
    const lastFriday = getLastFridayOfMonth(now)
    if (now.toDateString() === lastFriday.toDateString()) {
        events.push({
            time: '17:00 (KST)',
            event: '₿ BTC 월간 옵션 만기',
            importance: 'high',
            currency: 'BTC'
        })
    }

    // ETH 이벤트 예시
    // 실제로는 동적으로 가져와야 함

    return events
}

function getLastFridayOfMonth(date) {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    const dayOfWeek = lastDay.getDay()
    const diff = dayOfWeek >= 5 ? dayOfWeek - 5 : dayOfWeek + 2
    lastDay.setDate(lastDay.getDate() - diff)
    return lastDay
}

// ============================================
// 메시지 생성
// ============================================

function formatCalendarMessage(economicEvents, cryptoEvents) {
    const koreaDate = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric', month: 'long', day: 'numeric',
        weekday: 'long'
    })

    const allEvents = [...economicEvents, ...cryptoEvents]

    if (allEvents.length === 0) {
        return `📅 오늘의 경제 일정
━━━━━━━━━━━━━━━━━━━━
📆 ${koreaDate}

✅ 오늘은 주요 경제 발표가 없습니다.

평온한 하루, 트레이딩에 집중하세요! 📊

━━━━━━━━━━━━━━━━━━━━
📰 뉴스: @TranTradingLabNews
🌐 웹: trantradinglab.com

#경제일정 #TranTradingLab`
    }

    const importanceEmoji = {
        critical: '🔴',
        high: '🟠',
        medium: '🟡',
        low: '🟢'
    }

    const eventList = allEvents.map(e => {
        const emoji = importanceEmoji[e.importance] || '⚪'
        return `${emoji} ${e.time}\n   ${e.event}`
    }).join('\n\n')

    const criticalCount = allEvents.filter(e => e.importance === 'critical').length
    const warning = criticalCount > 0
        ? `\n⚠️ 오늘 ${criticalCount}개의 주요 이벤트가 예정되어 있습니다!\n변동성에 유의하세요.\n`
        : ''

    return `📅 오늘의 경제 일정
━━━━━━━━━━━━━━━━━━━━
📆 ${koreaDate}
${warning}
${eventList}

━━━━━━━━━━━━━━━━━━━━

💡 중요도 안내
🔴 매우 중요 | 🟠 중요 | 🟡 보통

━━━━━━━━━━━━━━━━━━━━
📰 뉴스: @TranTradingLabNews
🌐 웹: trantradinglab.com

#경제일정 #TranTradingLab`
}

// ============================================
// Handler
// ============================================

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Generating economic calendar...')

        const economicEvents = getRecurringEvents()
        const cryptoEvents = getCryptoEvents()

        const message = formatCalendarMessage(economicEvents, cryptoEvents)

        const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: NEWS_CHANNEL_ID,
                text: message
            })
        })

        const result = await telegramRes.json()
        console.log('Economic calendar sent:', result.ok ? 'Success' : result.description)

        return res.status(200).json({
            success: true,
            messageId: result.result?.message_id,
            eventsCount: economicEvents.length + cryptoEvents.length
        })

    } catch (error) {
        console.error('Economic calendar error:', error)
        return res.status(500).json({ error: error.message })
    }
}
