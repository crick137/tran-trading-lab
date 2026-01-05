/**
 * 📈 TRAN AI 기술 분석
 * Vercel Cron: 매일 12:00 (KST) 실행
 * 채널: @http4477
 * 
 * 주요 자산의 기술적 지지/저항선 분석
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// ============================================
// 기술적 지표 계산
// ============================================

async function getTechnicalData(symbol) {
    try {
        // 최근 50일 캔들 데이터
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=50`)
        const data = await res.json()

        const closes = data.map(d => parseFloat(d[4]))
        const highs = data.map(d => parseFloat(d[2]))
        const lows = data.map(d => parseFloat(d[3]))
        const volumes = data.map(d => parseFloat(d[5]))

        // 현재가
        const currentPrice = closes[closes.length - 1]

        // 이동평균선
        const ma7 = closes.slice(-7).reduce((a, b) => a + b, 0) / 7
        const ma25 = closes.slice(-25).reduce((a, b) => a + b, 0) / 25
        const ma50 = closes.reduce((a, b) => a + b, 0) / 50

        // RSI (14일)
        const rsi = calculateRSI(closes, 14)

        // 볼린저 밴드 (20일, 2 표준편차)
        const bb = calculateBollingerBands(closes.slice(-20))

        // 지지/저항선 (최근 50일 고저점)
        const recentHighs = highs.slice(-14)
        const recentLows = lows.slice(-14)
        const resistance = Math.max(...recentHighs)
        const support = Math.min(...recentLows)

        // 거래량 트렌드
        const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20
        const recentVolume = volumes.slice(-3).reduce((a, b) => a + b, 0) / 3
        const volumeTrend = recentVolume > avgVolume * 1.2 ? '증가' : recentVolume < avgVolume * 0.8 ? '감소' : '보통'

        return {
            currentPrice,
            ma7, ma25, ma50,
            rsi,
            bb,
            support, resistance,
            volumeTrend,
            trend: currentPrice > ma25 ? 'bullish' : 'bearish'
        }
    } catch (e) {
        console.error(`Technical data error for ${symbol}:`, e.message)
        return null
    }
}

function calculateRSI(closes, period = 14) {
    if (closes.length < period + 1) return 50

    let gains = 0, losses = 0
    for (let i = closes.length - period; i < closes.length; i++) {
        const diff = closes[i] - closes[i - 1]
        if (diff > 0) gains += diff
        else losses -= diff
    }

    const avgGain = gains / period
    const avgLoss = losses / period

    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
}

function calculateBollingerBands(closes) {
    const avg = closes.reduce((a, b) => a + b, 0) / closes.length
    const variance = closes.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / closes.length
    const stdDev = Math.sqrt(variance)

    return {
        upper: avg + (2 * stdDev),
        middle: avg,
        lower: avg - (2 * stdDev)
    }
}

// ============================================
// AI 분석 생성
// ============================================

async function generateTechnicalAnalysis() {
    const btcData = await getTechnicalData('BTCUSDT')
    const ethData = await getTechnicalData('ETHUSDT')

    if (!btcData || !ethData) return null

    const koreaTime = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })

    const technicalContext = `
【기술적 분석 데이터】

₿ 비트코인 (BTC):
- 현재가: $${btcData.currentPrice.toLocaleString()}
- MA7: $${btcData.ma7.toFixed(0)} | MA25: $${btcData.ma25.toFixed(0)} | MA50: $${btcData.ma50.toFixed(0)}
- RSI(14): ${btcData.rsi.toFixed(1)} (${btcData.rsi > 70 ? '과매수' : btcData.rsi < 30 ? '과매도' : '중립'})
- 볼린저: 상단 $${btcData.bb.upper.toFixed(0)} | 하단 $${btcData.bb.lower.toFixed(0)}
- 단기 지지: $${btcData.support.toFixed(0)} | 저항: $${btcData.resistance.toFixed(0)}
- 거래량: ${btcData.volumeTrend}
- 추세: ${btcData.trend === 'bullish' ? '상승' : '하락'}

Ξ 이더리움 (ETH):
- 현재가: $${ethData.currentPrice.toLocaleString()}
- MA7: $${ethData.ma7.toFixed(0)} | MA25: $${ethData.ma25.toFixed(0)}
- RSI(14): ${ethData.rsi.toFixed(1)}
- 단기 지지: $${ethData.support.toFixed(0)} | 저항: $${ethData.resistance.toFixed(0)}
- 추세: ${ethData.trend === 'bullish' ? '상승' : '하락'}
`

    const systemPrompt = `당신은 TRAN Trading Lab의 테크니컬 애널리스트입니다.
기술적 분석을 기반으로 트레이딩 인사이트를 제공합니다.
오직 한국어만 사용. 🔴🔵 금지, ▲▼ 사용.`

    const userPrompt = `아래 기술적 데이터로 분석 리포트를 작성하세요.

${technicalContext}

【출력 형식】
📈 TRAN 기술적 분석 리포트
📅 ${koreaTime}

━━━━━━━━━━━━━━━━━━━━

₿ 비트코인 기술 분석

📊 주요 지표
• RSI(14): [값] ([해석])
• 이동평균: [MA 분석]
• 볼린저: [위치 분석]

🎯 핵심 레벨
• 저항선: $[값] | $[값]
• 지지선: $[값] | $[값]

📝 분석
[2-3문장 기술적 분석]

━━━━━━━━━━━━━━━━━━━━

Ξ 이더리움 기술 분석

📊 주요 지표
• RSI(14): [값] ([해석])
• 추세: [상승/하락/횡보]

🎯 핵심 레벨
• 저항선: $[값]
• 지지선: $[값]

━━━━━━━━━━━━━━━━━━━━

🎯 트레이딩 아이디어

[구체적인 진입/손절/목표가 제시]

⚠️ 리스크 관리
[리스크 관리 팁]

━━━━━━━━━━━━━━━━━━━━
📱 WhatsApp: whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t
🐦 X: x.com/TranTradingLab
📰 뉴스: @TranTradingLabNews
🌐 웹: trantradinglab.com

#기술분석 #비트코인 #TranTradingLab`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gpt-5.1',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_completion_tokens: 1500
            })
        })
        const json = await res.json()
        return json.choices?.[0]?.message?.content?.trim() || null
    } catch (e) {
        console.error('OpenAI API error:', e.message)
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
        console.log('Generating technical analysis...')

        const message = await generateTechnicalAnalysis()

        if (!message) {
            return res.status(500).json({ error: 'AI generation failed' })
        }

        const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: message
            })
        })

        const result = await telegramRes.json()
        console.log('Technical analysis sent:', result.ok ? 'Success' : result.description)

        return res.status(200).json({ success: true, messageId: result.result?.message_id })

    } catch (error) {
        console.error('Technical analysis error:', error)
        return res.status(500).json({ error: error.message })
    }
}
