/**
 * 💡 TRAN 데일리 트레이딩 팁 (Premium)
 * Vercel Cron: 매일 09:00 (KST) 실행
 * 채널: @http4477
 * 
 * 성공적인 트레이딩을 위한 한 마디 조언과 시각 자료
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) {
    throw new Error('Missing environment variables')
}

// ============================================
// DALL-E 3 이미지 생성 (Zen Style)
// ============================================

async function generateTipImage(topic) {
    // topic은 영어로 번역해서 쓰는게 좋겠지만, 간단히 키워드 조합으로
    // DALL-E 3는 영어를 잘 알아들음. GPT가 주제를 영어로도 줬으면 좋겠는데, 번거로우니 무난한 프롬프트 사용

    const prompt = `A minimalist, zen-style artistic illustration. 
	Subject: Abstract concept of '${topic}' in the context of wisdom and patience.
	Style: Japanese ink wash painting or modern minimalist vector art. 
	Mood: Calm, focused, disciplined.
	No text.`

    try {
        const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3',
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

// ============================================
// Tip 생성 (GPT-5.2)
// ============================================

async function generateTradingTip() {
    const systemPrompt = `당신은 전설적인 트레이딩 멘토입니다.
투자의 대가(워렌 버핏, 제시 리버모어 등)의 지혜를 빌려 짧고 강력한 조언을 해줍니다.
규칙:
1. 한국어 사용.
2. 명언 하나와 그에 대한 간결한 해설.
3. 어조는 부드럽지만 단호하게.`

    // 주제를 매일 다르게 선정하기 위해 날짜 기반 해시나 랜덤 사용 가능하지만,
    // GPT에게 "오늘의 주제를 랜덤하게 선정해달라"고 요청하는게 가장 자연스러움.
    const userPrompt = `오늘 트레이더들에게 필요한 '트레이딩 심리' 또는 '리스크 관리' 관련 명언 하나와 해설을 작성해 주세요.
주제(영어)도 함께 JSON 형식으로 출력해 주세요.

형식:
{
	"topic": "patience",
	"content": "..."
}`

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
                response_format: { type: "json_object" },
                mod: 0.8
            })
        })
        const json = await res.json()
        return JSON.parse(json.choices?.[0]?.message?.content || '{}')
    } catch (e) {
        console.error('GPT error:', e.message)
        return null
    }
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
        console.log('Generating trading tip...')

        const tipData = await generateTradingTip()
        if (!tipData || !tipData.content) {
            return res.status(500).json({ error: 'Failed to generate tip' })
        }

        console.log('Topic:', tipData.topic)
        const imageUrl = await generateTipImage(tipData.topic || 'trading wisdom')

        const message = `💡 TRAN 데일리 트레이딩 팁
━━━━━━━━━━━━━━━━━━━━

${tipData.content}

━━━━━━━━━━━━━━━━━━━━
📱 WhatsApp: whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t
🐦 X: x.com/TranTradingLab
🌐 웹: trantradinglab.com

#트레이딩명언 #투자심리 #TranTradingLab`

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
            // Fallback text only
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
