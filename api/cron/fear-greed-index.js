/**
 * 😱😈 TRAN 공포/탐욕 지수
 * Vercel Cron: 매일 08:00 (KST) 실행
 * 채널: @TranTradingLabKR
 * 
 * 암호화폐 시장의 공포/탐욕 지수를 알립니다
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@TranTradingLabKR'

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

function getBasicInsight(value) {
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

async function getAIInsight(fng) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) return getBasicInsight(fng.value)

    try {
        const prompt = `현재 암호화폐 공포/탐욕 지수: ${fng.value}/100 (${fng.classification})
어제: ${fng.yesterdayValue} → 오늘: ${fng.value} (${fng.change > 0 ? '+' : ''}${fng.change})

위 데이터를 바탕으로 투자자에게 도움이 될 1-2문장의 통찰을 한국어로 작성하세요.
- 현재 심리 상태의 의미
- 행동 가이드 (매수/관망/주의)
- 이모지 포함

예시: "📉 극심한 공포 구간에서는 역발상 매수가 효과적일 수 있습니다. 단, 추가 하락 가능성도 열어두세요."`

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: '당신은 암호화폐 시장 심리 전문가입니다. 간결하고 실용적인 조언을 제공합니다.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        })

        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim() || getBasicInsight(fng.value)
    } catch (e) {
        console.error('AI insight error:', e.message)
        return getBasicInsight(fng.value)
    }
}

function formatMessage(fng, insight) {
    const emoji = getEmoji(fng.value)
    const koreanClass = getKoreanClassification(fng.classification)
    const gauge = getGaugeBar(fng.value)
    const changeEmoji = fng.change > 0 ? '📈' : fng.change < 0 ? '📉' : '➡️'
    const changeText = fng.change > 0 ? `+${fng.change}` : fng.change.toString()

    return `${emoji} TRAN 공포/탐욕 지수
━━━━━━━━━━━━━━━━━━━━

🎯 현재: ${fng.value} (${koreanClass})

${gauge}
0 ────────────────── 100
공포                    탐욕

${changeEmoji} 어제 대비: ${changeText} (${fng.yesterdayValue} → ${fng.value})

💡 AI 시장 인사이트:
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

        // 获取AI洞察
        const insight = await getAIInsight(fng)
        const message = formatMessage(fng, insight)

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
