/**
 * 🧠 TRAN 트레이딩 심리 퀴즈 (Premium)
 * Vercel Cron: 매주 화/목 15:00 (KST) 실행
 * 채널: @http4477
 * 
 * 트레이딩 시나리오를 제시하고 독자의 선택을 유도하는 참여형 콘텐츠
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

async function generateQuiz() {
    const systemPrompt = `당신은 트레이딩 코치입니다.
실전 트레이딩에서 겪을 수 있는 심리적 딜레마 상황을 퀴즈로 만듭니다.
규칙:
1. 한국어 사용.
2. 상황은 매우 구체적이고 현실적이어야 함 (예: 손절가를 쳤는데 반등하는 상황).
3. 3-4개의 선택지를 제공.
4. JSON 형식으로 출력.`

    const userPrompt = `트레이딩 심리 테스트 문제를 하나 만들어 주세요.
주제: 포모(FOMO), 손절, 익절, 물타기 중 하나 랜덤.

형식:
{
    "scenario": "비트코인이 5% 급등하고 있습니다. 당신은 포지션이 없습니다. 이때 당신의 생각은?",
    "options": ["당장 추격 매수한다", "조정을 기다린다", "다른 코인을 찾는다"],
    "visual_desc": "A trader looking nervously at a green candle chart on multiple monitors, sweating, intense atmosphere"
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
                temperature: 0.9
            })
        })
        const json = await res.json()
        return JSON.parse(json.choices?.[0]?.message?.content || '{}')
    } catch (e) {
        return null
    }
}

async function generateQuizImage(description) {
    if (!description) return null

    const prompt = `Digital art illustration of a trading scenario.
    Description: ${description}.
    Style: Comic book style or stylized vector art.
    Mood: Tense, dramatic, relatable.
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
        return null
    }
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const quiz = await generateQuiz()
        if (!quiz) return res.status(500).json({ error: 'Quiz generation failed' })

        const imageUrl = await generateQuizImage(quiz.visual_desc)

        const optionsText = quiz.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')

        const message = `🧠 TRAN 트레이딩 심리 퀴즈
━━━━━━━━━━━━━━━━━━━━

Q. ${quiz.scenario}

${optionsText}

━━━━━━━━━━━━━━━━━━━━
👇 아래 버튼을 눌러 투표하세요! (댓글로 정답 공유)

#트레이딩심리 #퀴즈 #TranTradingLab`

        // Sending Poll is better for engagement, but Image + Caption is requested.
        // Can't send Photo + Poll in one message.
        // Strategy: Send Photo with Caption (Scenario), followed by a Poll.

        // 1. Send Photo (Context)
        if (imageUrl) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    photo: imageUrl,
                    caption: message
                })
            })
        } else {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: message
                })
            })
        }

        // 2. Send Poll (Actual interaction)
        // Telegram API sendPoll
        const pollRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPoll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                question: '당신의 선택은?',
                options: quiz.options,
                is_anonymous: true
            })
        })

        const result = await pollRes.json()

        return res.status(200).json({ success: true, result })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
