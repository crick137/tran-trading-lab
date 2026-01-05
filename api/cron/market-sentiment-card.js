/**
 * 🌡️ TRAN 시장 심리 카드 (Premium)
 * Vercel Cron: 매일 08:00 (KST) 실행
 * 채널: @http4477
 * 
 * 공포/탐욕 지수를 시각화한 카드와 분석 제공
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

async function getFearAndGreed() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=1')
        const data = await res.json()
        const item = data.data[0]
        return {
            value: parseInt(item.value),
            classification: item.value_classification
        }
    } catch (e) {
        return { value: 50, classification: 'Neutral' }
    }
}

async function generateSentimentImage(value) {
    let visualDesc = ''
    if (value <= 25) visualDesc = 'A frozen, icy wasteland, blue cold lighting, abandoned technological ruins, depicting Extreme Fear'
    else if (value <= 45) visualDesc = 'A foggy, grey day, cautious atmosphere, dim lighting, depicting Fear'
    else if (value <= 55) visualDesc = 'A perfectly balanced golden scale, calm water reflecting the sky, harmonic lighting, depicting Neutrality'
    else if (value <= 75) visualDesc = 'A lush green digital forest, growth, rising sun, energetic atmosphere, depicting Greed'
    else visualDesc = 'A blazing rocket launch, intense red and orange fire, overheating machinery, explosive energy, depicting Extreme Greed'

    const prompt = `3D Abstract Art representing Crypto Market Sentiment.
    Value: ${value}/100.
    Scene: ${visualDesc}. 
    Style: High-end 3D render, glassmorphism, cinematic lighting.
    Centerpiece: A glowing holographic number "${value}" integrated into the environment. 
    (If text generation fails, just the environment is fine).`

    try {
        const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3', // DALL-E 3 
                prompt: prompt,
                n: 1,
                size: '1024x1024'
            })
        })
        const json = await res.json()
        return json.data?.[0]?.url || null
    } catch (e) {
        console.error('DALL-E 3 error:', e.message)
        return null
    }
}

async function generateSentimentAnalysis(fng) {
    const systemPrompt = `당신은 행동경제학자이자 시장 심리 전문가입니다.
공포/탐욕 지수를 해석하고 투자자들의 심리 상태를 분석합니다.
규칙:
1. 한국어 사용.
2. 현재 심리 상태가 매수 기회인지, 관망세인지, 과열 구간인지 냉철하게 분석.`

    const userPrompt = `현재 암호화폐 공포/탐욕 지수는 ${fng.value} (${fng.classification})입니다.
이 수치가 의미하는 바와 투자자 행동 가이드를 짧게(3-4문장) 작성해 주세요.

출력 형식:
"현재 시장은 [심리상태]에 있습니다. [해석]. [조언]"`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.2',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_completion_tokens: 500
            })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim() || `시장 심리는 현재 ${fng.classification} 상태입니다.`
    } catch (e) {
        return `시장 심리는 현재 ${fng.classification} 상태입니다.`
    }
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Generating sentiment card...')
        const fng = await getFearAndGreed()

        const [analysis, imageUrl] = await Promise.all([
            generateSentimentAnalysis(fng),
            generateSentimentImage(fng.value)
        ])

        const message = `🌡️ TRAN 시장 심리 알림
━━━━━━━━━━━━━━━━━━━━

심리지수: ${fng.value} (${fng.classification})

${analysis}

━━━━━━━━━━━━━━━━━━━━
📱 WhatsApp: whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t
🐦 X: x.com/TranTradingLab
🌐 웹: trantradinglab.com

#시장심리 #공포탐욕지수 #TranTradingLab`

        let result
        if (imageUrl) {
            const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    photo: imageUrl,
                    caption: message,
                    parse_mode: 'Markdown'
                })
            })
            result = await telegramRes.json()
        } else {
            const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: message
                })
            })
            result = await telegramRes.json()
        }

        if (!result.ok) {
            console.error('Telegram error:', result)
            return res.status(500).json({ error: result.description })
        }

        return res.status(200).json({ success: true, messageId: result.result?.message_id })

    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: error.message })
    }
}
