/**
 * 📈 TRAN 기술적 분석 (Premium)
 * Vercel Cron: 매일 12:00 (KST) 실행
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

async function getTechnicalData() {
    try {
        const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=4h&limit=30')
        const data = await res.json()
        // Simple data packet: Open, High, Low, Close, Volume
        return data.map(candle => ({
            o: parseFloat(candle[1]),
            h: parseFloat(candle[2]),
            l: parseFloat(candle[3]),
            c: parseFloat(candle[4]),
            v: parseFloat(candle[5])
        }))
    } catch { return [] }
}

// ============================================
// DALL-E 3 차트 이미지
// ============================================

async function generateTechnicalBanner(trend) {
    const mood = trend === 'bullish' ? 'green neon charts, upward momentum, futuristic hud'
        : trend === 'bearish' ? 'red warning signals, downward breakdown, glitch effect'
            : 'blue symmetrical patterns, balance, calm interface'

    const prompt = `Advanced technical analysis dashboard background. 
	Theme: ${mood}.
	Style: Cybersecurity interface, glowing wireframe, 8k resolution.
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

// ============================================
// AI 분석 (GPT-5.2)
// ============================================

async function generateAnalysis(candles) {
    const currentPrice = candles[candles.length - 1].c
    const openPrice = candles[0].o
    const trend = currentPrice > openPrice ? 'bullish' : 'bearish'

    const systemPrompt = `당신은 30년 경력의 월스트리트 수석 차티스트(CMT)입니다.
캔들 패턴, 보조지표, 거래량 분석을 통해 시장의 방향성을 진단합니다.

【분석 스타일】
- 감정을 배제한 냉철한 어조.
- "제 생각에는", "같습니다" 같은 추측성 발언 금지. 데이터에 근거해 "관측된다", "시사한다"로 표현.
- 전문 용어 적절히 사용 (다이버전스, 오더블럭, 리테스트, 손익비 등).
- 그러나 결론은 명확하게 (매수 우위/매도 우위).`

    const userPrompt = `비트코인 4시간봉 30개 데이터가 주어졌다.
시가: ${openPrice}, 현재가: ${currentPrice}
전체 데이터(요약): ${JSON.stringify(candles.slice(-5))}

기술적 분석 리포트를 작성해.

【출력 형식】
📈 TRAN 기술적 분석 (BTC/USDT 4H)
━━━━━━━━━━━━━━━━━━━━

🔍 패턴 분석
[현재 발견되는 주요 패턴 (예: 수렴, 이탈, 다이버전스) 설명]

📊 주요 지지/저항 레벨
• 1차 저항: $[가격] (설명)
• 1차 지지: $[가격] (설명)

🎯 트레이딩 셋업
• 진입 타점: [가격대/조건]
• 손절 라인: [가격]
• 방향성: [상승/하락/횡보] 우위

💬 분석가 코멘트
"[한 줄 요약]"

━━━━━━━━━━━━━━━━━━━━
#차트분석 #비트코인 #TranTradingLab`

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
                temperature: 0.5, // Lower temperature for precision
                max_completion_tokens: 1500
            })
        })
        const json = await res.json()
        return {
            content: json.choices?.[0]?.message?.content?.trim(),
            trend
        }
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
        const candles = await getTechnicalData()
        if (candles.length === 0) return res.status(500).json({ error: 'No data' })

        const analysis = await generateAnalysis(candles)
        if (!analysis || !analysis.content) return res.status(500).json({ error: 'AI failed' })

        const imageUrl = await generateTechnicalBanner(analysis.trend)

        if (imageUrl) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    photo: imageUrl,
                    caption: analysis.content,
                })
            })
        } else {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHANNEL_ID,
                    text: analysis.content
                })
            })
        }
        return res.status(200).json({ success: true })
    } catch (e) {
        return res.status(500).json({ error: e.message })
    }
}
