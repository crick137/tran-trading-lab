/**
 * 💡 TRAN 每日交易小贴士
 * Vercel Cron: 每天 12:00 (KST) 执行 = UTC 03:00
 * 频道: @http4477
 * 
 * AI生成每日交易智慧、心理学建议、风险管理技巧
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required')
}

if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required')
}

// ============================================
// 获取市场数据上下文
// ============================================

async function getMarketContext() {
    try {
        // 获取BTC价格和24h变化
        const btcRes = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
        const btcData = await btcRes.json()
        
        // 获取恐惧贪婪指数
        const fngRes = await fetch('https://api.alternative.me/fng/?limit=1')
        const fngData = await fngRes.json()
        
        // 获取VIX
        const vixRes = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=1d', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        const vixData = await vixRes.json()
        const vix = vixData.chart?.result?.[0]?.meta?.regularMarketPrice || 15

        return {
            btcPrice: parseFloat(btcData.lastPrice),
            btcChange: parseFloat(btcData.priceChangePercent),
            fearGreed: parseInt(fngData.data[0]?.value || 50),
            vix: vix
        }
    } catch (e) {
        console.warn('Failed to fetch market context:', e.message)
        return {
            btcPrice: 95000,
            btcChange: 0,
            fearGreed: 50,
            vix: 15
        }
    }
}

// ============================================
// AI生成交易小贴士
// ============================================

async function generateTradingTip(marketContext) {
    const koreaTime = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })

    const marketInfo = `
【当前市场状况 - ${koreaTime}】
- BTC价格: $${marketContext.btcPrice.toLocaleString()} (${marketContext.btcChange >= 0 ? '+' : ''}${marketContext.btcChange.toFixed(2)}%)
- 恐惧/贪婪指数: ${marketContext.fearGreed}/100
- VIX恐慌指数: ${marketContext.vix.toFixed(2)}
`

    const systemPrompt = `당신은 TRAN Trading Lab의 수석 트레이딩 멘토입니다. 
매일 투자자들에게 실용적이고 영감을 주는 트레이딩 지혜를 제공합니다.

【핵심 규칙】
1. 오직 한국어만 사용
2. 실용적이고 실행 가능한 조언
3. 심리학, 리스크 관리, 시장 이해에 초점
4. 짧고 명확하게 (Telegram 메시지에 적합)
5. "AI", "분석 결과" 같은 단어 사용 금지
6. 구체적인 예시나 비유 활용

【스타일】
- 전문적이지만 친근한 톤
- 실제 트레이더의 경험에서 나온 것처럼
- 때로는 경고, 때로는 격려
- 숫자나 구체적인 예시 포함`

    const tipCategories = [
        '리스크 관리',
        '심리학',
        '시장 타이밍',
        '포지션 관리',
        '감정 컨트롤',
        '패턴 인식',
        '손절 전략',
        '수익 실현'
    ]

    // 根据市场状况选择主题
    let selectedCategory = tipCategories[Math.floor(Math.random() * tipCategories.length)]
    
    if (marketContext.fearGreed <= 25) {
        selectedCategory = '심리학' // 极度恐惧时，强调心理学
    } else if (marketContext.fearGreed >= 75) {
        selectedCategory = '리스크 관리' // 极度贪婪时，强调风险管理
    } else if (marketContext.vix > 25) {
        selectedCategory = '감정 컨트롤' // 高波动时，强调情绪控制
    }

    const userPrompt = `아래 현재 시장 상황을 바탕으로, "${selectedCategory}" 주제의 트레이딩 팁을 작성하세요.

${marketInfo}

【출력 형식】
💡 TRAN 트레이딩 팁

━━━━━━━━━━━━━━━━━━━━

[핵심 메시지 - 1-2문장으로 강력하고 기억에 남는 조언]

━━━━━━━━━━━━━━━━━━━━

📌 왜 중요한가?
[1-2문장으로 이유 설명]

🎯 실전 적용
[구체적인 실행 방법이나 예시]

💭 오늘의 시장
[현재 시장 상황(${marketContext.fearGreed}점의 공포/탐욕, VIX ${marketContext.vix.toFixed(1)})에 맞는 조언]

━━━━━━━━━━━━━━━━━━━━

📱 WhatsApp: whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t
🐦 X: x.com/TranTradingLab
🌐 웹: trantradinglab.com

#트레이딩팁 #투자지혜 #TranTradingLab

【중요】
- 위 형식을 정확히 따르세요
- 총 길이는 300-400자 정도로 제한
- 실용적이고 실행 가능한 조언만 제공
- 현재 시장 상황을 반영하되, 너무 구체적인 예측은 피하세요`

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-5.1',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.8,
                max_completion_tokens: 600
            })
        })

        const json = await res.json()
        const content = json.choices?.[0]?.message?.content?.trim()

        if (!content) {
            console.error('OpenAI returned empty content:', json)
            return null
        }

        return content
    } catch (e) {
        console.error('OpenAI API error:', e.message)
        return null
    }
}

// ============================================
// 发送到Telegram
// ============================================

async function sendToTelegram(message) {
    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHANNEL_ID,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: false
            })
        })

        const result = await res.json()
        return result
    } catch (e) {
        console.error('Telegram send error:', e.message)
        return { ok: false, error: e.message }
    }
}

// ============================================
// Handler
// ============================================

export default async function handler(req, res) {
    // Vercel Cron 认证
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        console.log('Generating daily trading tip...')

        // 获取市场上下文
        const marketContext = await getMarketContext()
        console.log('Market context:', marketContext)

        // 生成交易小贴士
        const tip = await generateTradingTip(marketContext)

        if (!tip) {
            console.error('Failed to generate tip')
            return res.status(500).json({ error: 'Failed to generate trading tip' })
        }

        console.log('Tip generated:', tip.substring(0, 100) + '...')

        // 发送到Telegram
        const telegramResult = await sendToTelegram(tip)

        if (telegramResult.ok) {
            console.log('✅ Trading tip sent successfully')
            return res.status(200).json({
                success: true,
                messageId: telegramResult.result?.message_id,
                timestamp: new Date().toISOString()
            })
        } else {
            console.error('❌ Telegram send failed:', telegramResult.description)
            return res.status(500).json({
                error: 'Failed to send to Telegram',
                details: telegramResult.description
            })
        }

    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: error.message })
    }
}
