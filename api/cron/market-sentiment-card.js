/**
 * 📊 TRAN 市场情绪可视化卡片
 * Vercel Cron: 每天 14:00 (KST) 执行 = UTC 05:00
 * 频道: @http4477
 * 
 * 生成市场情绪总结卡片，包含可视化数据
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import FormData from 'form-data'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_MAIN_CHANNEL_ID || '@http4477'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required')
}

if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required')
}

// ============================================
// 获取市场数据
// ============================================

async function getMarketData() {
    try {
        const [cryptoRes, fngRes, vixRes, stocksRes] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=' + JSON.stringify(['BTCUSDT', 'ETHUSDT', 'SOLUSDT'])),
            fetch('https://api.alternative.me/fng/?limit=1'),
            fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=1d', {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            }),
            fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&range=2d', {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            })
        ])

        const cryptoData = await cryptoRes.json()
        const fngData = await fngRes.json()
        const vixData = await vixRes.json()
        const stocksData = await stocksRes.json()

        const btc = cryptoData.find(c => c.symbol === 'BTCUSDT')
        const eth = cryptoData.find(c => c.symbol === 'ETHUSDT')
        const sol = cryptoData.find(c => c.symbol === 'SOLUSDT')

        const sp500Closes = stocksData.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.filter(c => c !== null) || []
        const sp500Change = sp500Closes.length >= 2 
            ? ((sp500Closes[sp500Closes.length - 1] - sp500Closes[sp500Closes.length - 2]) / sp500Closes[sp500Closes.length - 2] * 100)
            : 0

        return {
            btc: {
                price: parseFloat(btc?.lastPrice || 95000),
                change: parseFloat(btc?.priceChangePercent || 0)
            },
            eth: {
                price: parseFloat(eth?.lastPrice || 3000),
                change: parseFloat(eth?.priceChangePercent || 0)
            },
            sol: {
                price: parseFloat(sol?.lastPrice || 150),
                change: parseFloat(sol?.priceChangePercent || 0)
            },
            fearGreed: {
                value: parseInt(fngData.data?.[0]?.value || 50),
                classification: fngData.data?.[0]?.value_classification || 'Neutral'
            },
            vix: vixData.chart?.result?.[0]?.meta?.regularMarketPrice || 15,
            sp500Change: sp500Change
        }
    } catch (e) {
        console.warn('Failed to fetch market data:', e.message)
        return {
            btc: { price: 95000, change: 0 },
            eth: { price: 3000, change: 0 },
            sol: { price: 150, change: 0 },
            fearGreed: { value: 50, classification: 'Neutral' },
            vix: 15,
            sp500Change: 0
        }
    }
}

// ============================================
// 生成市场情绪图片（使用Gemini）
// ============================================

async function generateSentimentImage(marketData) {
    if (!GEMINI_API_KEY) {
        console.log('Gemini API Key missing, skipping image generation')
        return null
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp-image-generation',
        })

        const fgValue = marketData.fearGreed.value
        const mood = fgValue <= 25 ? 'dramatic dark bearish red tones' :
            fgValue >= 75 ? 'bright golden bullish celebration' : 
            'calm neutral balanced blue tones'

        const prompt = `A professional financial market sentiment dashboard card. 
${mood} mood. 
Features: Fear & Greed Index gauge at ${fgValue}/100, Bitcoin price chart visualization, 
market sentiment indicators. 
Style: modern minimalist dashboard, clean typography, data visualization elements. 
Dark background with accent colors. 
Horizontal 16:9 aspect ratio. 
No text labels, just visual elements.`

        console.log('Generating sentiment image...')

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['image', 'text'] }
        })

        const imagePart = result.response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)

        if (imagePart?.inlineData?.data) {
            return Buffer.from(imagePart.inlineData.data, 'base64')
        }
    } catch (e) {
        console.error('Gemini image generation error:', e.message)
    }
    return null
}

// ============================================
// 生成市场情绪分析文本
// ============================================

async function generateSentimentAnalysis(marketData) {
    const koreaTime = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const systemPrompt = `당신은 TRAN Trading Lab의 시장 센티먼트 분석가입니다.
시장 데이터를 분석하여 투자자에게 명확하고 실용적인 인사이트를 제공합니다.

【핵심 규칙】
1. 오직 한국어만 사용
2. 구체적인 숫자와 데이터 언급
3. 객관적이고 균형잡힌 분석
4. "AI", "분석 결과" 같은 단어 사용 금지
5. 짧고 명확하게 (Telegram 메시지에 적합)`

    const userPrompt = `아래 시장 데이터를 분석하여 시장 센티먼트 카드를 작성하세요.

【시장 데이터 - ${koreaTime}】

📊 암호화폐:
- BTC: $${marketData.btc.price.toLocaleString()} (${marketData.btc.change >= 0 ? '+' : ''}${marketData.btc.change.toFixed(2)}%)
- ETH: $${marketData.eth.price.toLocaleString()} (${marketData.eth.change >= 0 ? '+' : ''}${marketData.eth.change.toFixed(2)}%)
- SOL: $${marketData.sol.price.toLocaleString()} (${marketData.sol.change >= 0 ? '+' : ''}${marketData.sol.change.toFixed(2)}%)

🌡️ 시장 센티먼트:
- 공포/탐욕 지수: ${marketData.fearGreed.value}/100 (${marketData.fearGreed.classification})
- VIX: ${marketData.vix.toFixed(2)}
- S&P500: ${marketData.sp500Change >= 0 ? '+' : ''}${marketData.sp500Change.toFixed(2)}%

【출력 형식】
📊 TRAN 시장 센티먼트 카드

━━━━━━━━━━━━━━━━━━━━

🌡️ 현재 시장 심리
[공포/탐욕 지수 ${marketData.fearGreed.value}점의 의미를 1-2문장으로 설명]

━━━━━━━━━━━━━━━━━━━━

📈 주요 자산 현황
• BTC: $${marketData.btc.price.toLocaleString()} (${marketData.btc.change >= 0 ? '▲' : '▼'} ${Math.abs(marketData.btc.change).toFixed(2)}%)
• ETH: $${marketData.eth.price.toLocaleString()} (${marketData.eth.change >= 0 ? '▲' : '▼'} ${Math.abs(marketData.eth.change).toFixed(2)}%)
• SOL: $${marketData.sol.price.toLocaleString()} (${marketData.sol.change >= 0 ? '▲' : '▼'} ${Math.abs(marketData.sol.change).toFixed(2)}%)

━━━━━━━━━━━━━━━━━━━━

💡 시장 해석
[VIX ${marketData.vix.toFixed(1)}와 공포/탐욕 지수 ${marketData.fearGreed.value}점의 조합이 의미하는 바를 설명]

🎯 투자자 관점
[현재 시장 상황에서 투자자가 주목해야 할 포인트]

━━━━━━━━━━━━━━━━━━━━

📱 WhatsApp: whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t
🐦 X: x.com/TranTradingLab
🌐 웹: trantradinglab.com

#시장센티먼트 #투자인사이트 #TranTradingLab

【중요】
- 총 길이는 400-500자 정도
- 구체적인 숫자 반드시 언급
- 실용적이고 실행 가능한 조언`

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
                temperature: 0.7,
                max_completion_tokens: 700
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
// 发送到Telegram
// ============================================

async function sendToTelegram(text, imageBuffer = null) {
    try {
        // 如果有图片，先发送图片
        if (imageBuffer) {
            const form = new FormData()
            form.append('chat_id', TELEGRAM_CHANNEL_ID)
            form.append('photo', imageBuffer, { filename: 'sentiment.png' })
            form.append('caption', '📊 TRAN 시장 센티먼트 카드')

            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: form.getHeaders(),
                body: form
            })
        }

        // 发送文本
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHANNEL_ID,
                text: text,
                parse_mode: 'HTML',
                disable_web_page_preview: false
            })
        })

        return await res.json()
    } catch (e) {
        console.error('Telegram send error:', e.message)
        return { ok: false, error: e.message }
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
        console.log('Generating market sentiment card...')

        // 获取市场数据
        const marketData = await getMarketData()
        console.log('Market data:', marketData)

        // 生成图片（可选）
        const imageBuffer = await generateSentimentImage(marketData)

        // 生成分析文本
        const analysis = await generateSentimentAnalysis(marketData)

        if (!analysis) {
            return res.status(500).json({ error: 'Failed to generate sentiment analysis' })
        }

        // 发送到Telegram
        const result = await sendToTelegram(analysis, imageBuffer)

        if (result.ok) {
            console.log('✅ Sentiment card sent successfully')
            return res.status(200).json({
                success: true,
                messageId: result.result?.message_id,
                imageGenerated: !!imageBuffer,
                timestamp: new Date().toISOString()
            })
        } else {
            console.error('❌ Telegram send failed:', result.description)
            return res.status(500).json({
                error: 'Failed to send to Telegram',
                details: result.description
            })
        }

    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: error.message })
    }
}
