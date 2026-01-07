/**
 * 😱😈 TRAN 공포/탐욕 지수
 * Vercel Cron: 매일 08:00 (KST) 실행
 * 채널: @http4477
 * 
 * 암호화폐 시장의 공포/탐욕 지수를 알립니다
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'

async function getFearAndGreed() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=2')
        const data = await res.json()
        const today = data.data[0]
        const yesterday = data.data[1]

        return {
            value: parseInt(today.value),
            classification: today.value_classification,
            yesterdayValue: parseInt(yesterday.value),
            change: parseInt(today.value) - parseInt(yesterday.value)
        }
    } catch (e) {
        console.error('Fear & Greed API error:', e.message)
        return null
    }
}

function getEmoji(value) {
    if (value <= 25) return '😱'      // Extreme Fear
    if (value <= 45) return '😰'      // Fear
    if (value <= 55) return '😐'      // Neutral
    if (value <= 75) return '😏'      // Greed
    return '🤑'                        // Extreme Greed
}

function getKoreanClassification(classification) {
    const map = {
        'Extreme Fear': '극심한 공포',
        'Fear': '공포',
        'Neutral': '중립',
        'Greed': '탐욕',
        'Extreme Greed': '극심한 탐욕'
    }
    return map[classification] || classification
}

function getGaugeBar(value) {
    const total = 20
    const filled = Math.round(value / 100 * total)
    const bar = '█'.repeat(filled) + '░'.repeat(total - filled)
    return bar
}

function getMarketInsight(value) {
    if (value <= 25) {
        return '📉 시장이 과도하게 두려워하고 있습니다. 역발상 매수 기회일 수 있습니다.'
    } else if (value <= 45) {
        return '🔍 조심스러운 분위기입니다. 신중한 관찰이 필요합니다.'
    } else if (value <= 55) {
        return '⚖️ 시장이 균형 상태입니다. 뚜렷한 방향성이 없습니다.'
    } else if (value <= 75) {
        return '📈 낙관적인 분위기입니다. 과열 징후를 주시하세요.'
    } else {
        return '⚠️ 시장이 과열되어 있습니다. 갑작스러운 조정에 주의하세요.'
    }
}

function formatMessage(fng) {
    const emoji = getEmoji(fng.value)
    const koreanClass = getKoreanClassification(fng.classification)
    const gauge = getGaugeBar(fng.value)
    const changeEmoji = fng.change > 0 ? '📈' : fng.change < 0 ? '📉' : '➡️'
    const changeText = fng.change > 0 ? `+${fng.change}` : fng.change.toString()
    const insight = getMarketInsight(fng.value)

    return `${emoji} TRAN 공포/탐욕 지수
━━━━━━━━━━━━━━━━━━━━

🎯 현재: ${fng.value} (${koreanClass})

${gauge}
0 ────────────────── 100
공포                    탐욕

${changeEmoji} 어제 대비: ${changeText} (${fng.yesterdayValue} → ${fng.value})

${insight}

━━━━━━━━━━━━━━━━━━━━
🌐 trantradinglab.com`
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Fetching Fear & Greed Index...')
        const fng = await getFearAndGreed()

        if (!fng) {
            return res.status(500).json({ error: 'Failed to fetch Fear & Greed data' })
        }

        const message = formatMessage(fng)

        const telegramRes = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: message
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
            value: fng.value,
            messageId: result.result?.message_id
        })

    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: error.message })
    }
}
