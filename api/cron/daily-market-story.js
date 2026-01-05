/**
 * 📖 TRAN 每日市场故事
 * Vercel Cron: 每天 21:00 (KST) 执行 = UTC 12:00
 * 频道: @http4477
 * 
 * 用故事化的方式讲述当天的市场动态
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
// 获取市场数据
// ============================================

async function getMarketStoryData() {
    try {
        const [cryptoRes, fngRes, stocksRes, newsRes] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=' + JSON.stringify(['BTCUSDT', 'ETHUSDT'])),
            fetch('https://api.alternative.me/fng/?limit=2'),
            fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&range=2d', {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            }),
            fetch('https://www.hankyung.com/feed/finance', {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                signal: AbortSignal.timeout(5000)
            }).catch(() => null)
        ])

        const cryptoData = await cryptoRes.json()
        const fngData = await fngRes.json()
        const stocksData = await stocksRes.json()

        const btc = cryptoData.find(c => c.symbol === 'BTCUSDT')
        const eth = cryptoData.find(c => c.symbol === 'ETHUSDT')

        const sp500Closes = stocksData.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.filter(c => c !== null) || []
        const sp500Change = sp500Closes.length >= 2 
            ? ((sp500Closes[sp500Closes.length - 1] - sp500Closes[sp500Closes.length - 2]) / sp500Closes[sp500Closes.length - 2] * 100)
            : 0

        // 解析新闻标题（简单版本）
        let topNewsTitle = '시장 뉴스 없음'
        if (newsRes && newsRes.ok) {
            try {
                const newsXml = await newsRes.text()
                const titleMatch = newsXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
                if (titleMatch) {
                    topNewsTitle = titleMatch[1].trim().slice(0, 100)
                }
            } catch {}
        }

        return {
            btc: {
                price: parseFloat(btc?.lastPrice || 95000),
                change: parseFloat(btc?.priceChangePercent || 0),
                volume: parseFloat(btc?.quoteVolume || 0) / 1e9
            },
            eth: {
                price: parseFloat(eth?.lastPrice || 3000),
                change: parseFloat(eth?.priceChangePercent || 0)
            },
            fearGreed: {
                current: parseInt(fngData.data?.[0]?.value || 50),
                previous: parseInt(fngData.data?.[1]?.value || 50),
                change: parseInt(fngData.data?.[0]?.value || 50) - parseInt(fngData.data?.[1]?.value || 50)
            },
            sp500Change: sp500Change,
            topNews: topNewsTitle
        }
    } catch (e) {
        console.warn('Failed to fetch market data:', e.message)
        return {
            btc: { price: 95000, change: 0, volume: 1 },
            eth: { price: 3000, change: 0 },
            fearGreed: { current: 50, previous: 50, change: 0 },
            sp500Change: 0,
            topNews: '시장 데이터 수집 중...'
        }
    }
}

// ============================================
// 生成市场故事
// ============================================

async function generateMarketStory(marketData) {
    const koreaTime = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })

    const systemPrompt = `당신은 TRAN Trading Lab의 스토리텔러입니다.
시장 데이터를 흥미롭고 이해하기 쉬운 이야기로 변환합니다.

【핵심 규칙】
1. 오직 한국어만 사용
2. 이야기 형식으로 작성 (소설의 한 장면처럼)
3. 비유와 은유 적극 활용
4. "황소(상승)"와 "곰(하락)" 같은 시장 은유 사용
5. 긴장감과 드라마 있게
6. "AI", "분석 결과" 같은 단어 사용 금지
7. 구체적인 숫자 반드시 언급`

    const userPrompt = `아래 오늘의 시장 데이터를 바탕으로 시장 이야기를 작성하세요.

【오늘의 시장 - ${koreaTime}】

₿ 비트코인:
- 가격: $${marketData.btc.price.toLocaleString()}
- 24h 변동: ${marketData.btc.change >= 0 ? '+' : ''}${marketData.btc.change.toFixed(2)}%
- 거래량: $${marketData.btc.volume.toFixed(1)}B

Ξ 이더리움:
- 가격: $${marketData.eth.price.toLocaleString()}
- 24h 변동: ${marketData.eth.change >= 0 ? '+' : ''}${marketData.eth.change.toFixed(2)}%

🌡️ 공포/탐욕:
- 현재: ${marketData.fearGreed.current}/100
- 전일 대비: ${marketData.fearGreed.change >= 0 ? '+' : ''}${marketData.fearGreed.change}점

📈 S&P500: ${marketData.sp500Change >= 0 ? '+' : ''}${marketData.sp500Change.toFixed(2)}%

📰 주요 뉴스: ${marketData.topNews}

【출력 형식】
📖 TRAN 오늘의 시장 이야기

━━━━━━━━━━━━━━━━━━━━

"[창의적인 이야기 제목]"

오늘, 시장은 우리에게 이런 이야기를 들려주고 있다.

[2-3문장으로 오늘 시장의 전체적인 분위기와 주요 이벤트를 이야기 형식으로 묘사]

━━━━━━━━━━━━━━━━━━━━

🎭 등장인물

• 황소 (상승 세력): [상승을 이끄는 요인이나 자산을 이야기 형식으로]
• 곰 (하락 세력): [하락 압력을 가하는 요인을 이야기 형식으로]
• 관망자: [중립적이거나 기다리는 세력]

━━━━━━━━━━━━━━━━━━━━

📖 이야기의 전개

[오늘 하루 시장이 어떻게 움직였는지, 어떤 갈등이나 협력이 있었는지 이야기 형식으로 설명]

━━━━━━━━━━━━━━━━━━━━

🔮 내일의 예고편

[내일 주목할 포인트를 이야기 형식으로 제시]

━━━━━━━━━━━━━━━━━━━━

📱 WhatsApp: whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t
🐦 X: x.com/TranTradingLab
🌐 웹: trantradinglab.com

#시장이야기 #스토리텔링 #TranTradingLab

【중요】
- 총 길이는 600-800자 정도
- 이야기 형식 유지
- 구체적인 숫자 반드시 언급
- 흥미롭고 읽기 쉽게`

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
                temperature: 0.9,
                max_completion_tokens: 1200
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
        console.log('Generating daily market story...')

        // 获取市场数据
        const marketData = await getMarketStoryData()
        console.log('Market data:', marketData)

        // 生成故事
        const story = await generateMarketStory(marketData)

        if (!story) {
            return res.status(500).json({ error: 'Failed to generate market story' })
        }

        // 发送到Telegram
        const result = await sendToTelegram(story)

        if (result.ok) {
            console.log('✅ Market story sent successfully')
            return res.status(200).json({
                success: true,
                messageId: result.result?.message_id,
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
