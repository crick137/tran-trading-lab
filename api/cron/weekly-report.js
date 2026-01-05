/**
 * 📅 TRAN 위클리 리포트 (Premium)
 * Vercel Cron: 매주 월요일 09:00 (KST) 실행
 * 채널: @http4477
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) {
    throw new Error('Missing environment variables')
}

// ============================================
// 데이터 수집
// ============================================

async function getWeeklyData() {
    try {
        const [btc, eth, sol] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT').then(r => r.json()),
            fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT').then(r => r.json()),
            fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT').then(r => r.json())
        ])
        return {
            BTC: { p: parseFloat(btc.lastPrice), c: parseFloat(btc.priceChangePercent) },
            ETH: { p: parseFloat(eth.lastPrice), c: parseFloat(eth.priceChangePercent) },
            SOL: { p: parseFloat(sol.lastPrice), c: parseFloat(sol.priceChangePercent) }
        }
    } catch { return {} }
}

// ============================================
// DALL-E 3 이미지
// ============================================

async function generateWeeklyBanner(marketState) {
    const mood = marketState === 'bull' ? 'Grand golden bull statue in a futuristic museum, spotlight, crowd admiring'
        : 'A sturdy lighthouse standing against a massive dark tsunami, resilience, hope'

    const prompt = `Premium financial magazine cover. 
    Subject: ${mood}.
    Style: Time Magazine or The Economist cover style, artistic, thought-provoking.
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
    } catch { return null }
}

// ============================================
// AI 위클리 분석 (GPT-5.2)
// ============================================

async function generateWeeklyReport(data) {
    const marketState = data.BTC.c > 0 ? 'bull' : 'bear'
    const koreaTime = new Date().toLocaleDateString('ko-KR')

    const systemPrompt = `당신은 글로벌 매크로 전략가입니다.
지난 한 주간의 시장 흐름을 큰 그림에서 조망하고, 이번 주의 핵심 테마를 선정합니다.

【집필 가이드】
- '이코노미스트(The Economist)' 잡지의 칼럼 스타일.
- 지엽적인 등락보다는 거시적인 흐름(내러티브)에 집중.
- 독자에게 "아, 지금 세상이 이렇게 돌아가는구나"라는 통찰을 줄 것.
- 문체: 지적이고, 세련되며, 통찰력 있는.
- "한 주간 정리입니다" 같은 서두 삭제.`

    const userPrompt = `지난주 데이터: BTC ${data.BTC.c}%, ETH ${data.ETH.c}%, SOL ${data.SOL.c}%

위클리 리포트를 작성해.

【출력 형식】
📅 TRAN 위클리 인사이트
${koreaTime}

━━━━━━━━━━━━━━━━━━━━

[이번 주를 관통하는 철학적인/통찰력 있는 제목]

🌍 The Big Picture
[지난주 시장을 움직인 거대한 흐름 설명. 2문단.]

🔍 Key Narratives
• [핵심 내러티브 1]: [해설]
• [핵심 내러티브 2]: [해설]

🗓️ This Week's Radar
- [이번 주 주목할 이벤트/지표 1]
- [이번 주 주목할 이벤트/지표 2]

🧭 Strategist's Note
"[독자들에게 던지는 질문이나 메시지]"

━━━━━━━━━━━━━━━━━━━━
#위클리 #매크로 #TranTradingLab`

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
                temperature: 0.7,
                max_completion_tokens: 1500
            })
        })
        const json = await res.json()
        return {
            content: json.choices?.[0]?.message?.content?.trim(),
            state: marketState
        }
    } catch { return null }
}

export default async function handler(req, res) {
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const data = await getWeeklyData()
        const report = await generateWeeklyReport(data)

        if (!report || !report.content) return res.status(500).json({ error: 'AI failed' })

        const imageUrl = await generateWeeklyBanner(report.state)

        if (imageUrl) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    photo: imageUrl,
                    caption: report.content,
                })
            })
        } else {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: report.content
                })
            })
        }
        return res.status(200).json({ success: true })
    } catch (e) {
        return res.status(500).json({ error: e.message })
    }
}
