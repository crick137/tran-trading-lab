/**
 * 🔍 TRAN 新闻深度解读
 * Vercel Cron: 每天 18:00 (KST) 执行 = UTC 09:00
 * 频道: @http4477
 * 
 * 对重要新闻进行AI深度分析和市场影响评估
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
// 新闻源
// ============================================

const NEWS_FEEDS = [
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한경 증권' },
    { id: 'hankyung-economy', url: 'https://www.hankyung.com/feed/economy', name: '한경 경제' },
    { id: 'mk-economy', url: 'https://www.mk.co.kr/rss/30100041/', name: '매경 경제' },
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk' }
]

// ============================================
// RSS解析
// ============================================

function parseRssXml(xml, feedInfo) {
    const items = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1]
        const getTagContent = (tag) => {
            const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)
            const m = regex.exec(itemXml)
            return m ? (m[1] || m[2] || '').trim() : ''
        }

        const title = getTagContent('title')
        const link = getTagContent('link')
        const description = getTagContent('description')
        const pubDate = getTagContent('pubDate')

        if (title && link) {
            items.push({
                id: `${feedInfo.id}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
                title,
                link,
                description: description.replace(/<[^>]*>/g, '').slice(0, 200),
                source: feedInfo.name,
                pubDate: pubDate ? new Date(pubDate).getTime() : Date.now()
            })
        }
    }
    return items
}

async function fetchTopNews() {
    const allNews = []
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    const fetchPromises = NEWS_FEEDS.map(async (feed) => {
        try {
            const response = await fetch(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/rss+xml, application/xml, text/xml'
                },
                signal: AbortSignal.timeout(8000)
            })
            if (!response.ok) return []
            const xml = await response.text()
            const items = parseRssXml(xml, feed)
            // 只取24小时内的新闻
            return items.filter(item => item.pubDate >= oneDayAgo)
        } catch {
            return []
        }
    })

    const results = await Promise.all(fetchPromises)
    results.forEach(items => allNews.push(...items))

    // 按时间排序，最新的在前
    allNews.sort((a, b) => b.pubDate - a.pubDate)

    // 选择最重要的3条新闻
    return allNews.slice(0, 3)
}

// ============================================
// 判断新闻重要性
// ============================================

function isImportantNews(news) {
    const importantKeywords = [
        '비트코인', 'BTC', '이더리움', 'ETH',
        '금리', '인플레이션', 'CPI', 'FOMC',
        '주식', '증시', '코스피', '나스닥',
        '규제', 'ETF', '승인', '거부',
        '폭락', '폭등', '급등', '급락',
        '중국', '미국', '연준', 'ECB'
    ]

    const titleLower = news.title.toLowerCase()
    const descLower = (news.description || '').toLowerCase()
    const combined = titleLower + ' ' + descLower

    return importantKeywords.some(keyword => 
        combined.includes(keyword.toLowerCase())
    )
}

// ============================================
// AI生成新闻分析
// ============================================

async function generateNewsAnalysis(news) {
    const koreaTime = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const systemPrompt = `당신은 TRAN Trading Lab의 수석 시장 분석가입니다.
뉴스를 깊이 있게 분석하고 투자자에게 실용적인 인사이트를 제공합니다.

【핵심 규칙】
1. 오직 한국어만 사용
2. 객관적이고 균형잡힌 분석
3. 구체적인 숫자와 데이터 언급
4. 시장 영향도 명확히 설명
5. "AI", "분석 결과" 같은 단어 사용 금지
6. 과도한 예측이나 확신 표현 피하기`

    const userPrompt = `아래 뉴스를 깊이 있게 분석하세요.

📰 뉴스 제목: ${news.title}
📝 요약: ${news.description || '요약 없음'}
🔗 출처: ${news.source}
🔗 링크: ${news.link}

【출력 형식】
🔍 TRAN 뉴스 심층 분석

━━━━━━━━━━━━━━━━━━━━

📰 핵심 내용
[뉴스의 핵심 내용을 2-3문장으로 요약]

━━━━━━━━━━━━━━━━━━━━

💡 시장 영향 분석

1. 단기 영향 (1-3일)
[시장에 미칠 즉각적인 영향]

2. 중기 영향 (1-4주)
[향후 몇 주간 예상되는 영향]

3. 관련 자산
[영향을 받을 주요 자산 (BTC, ETH, 주식 등)]

━━━━━━━━━━━━━━━━━━━━

🎯 투자자 액션 아이템
[투자자가 취해야 할 구체적인 행동]

⚠️ 주의사항
[주의해야 할 점이나 리스크]

━━━━━━━━━━━━━━━━━━━━

📱 WhatsApp: whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t
🐦 X: x.com/TranTradingLab
🌐 웹: trantradinglab.com

#뉴스분석 #시장인사이트 #TranTradingLab

【중요】
- 객관적이고 균형잡힌 분석 제공
- 과도한 예측이나 확신 표현 피하기
- 구체적인 데이터와 숫자 언급
- 총 길이는 500-700자 정도`

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
                max_completion_tokens: 1000
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
                disable_web_page_preview: true
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
        console.log('Fetching and analyzing news...')

        // 获取重要新闻
        const topNews = await fetchTopNews()
        console.log(`Found ${topNews.length} recent news items`)

        if (topNews.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No recent important news found',
                timestamp: new Date().toISOString()
            })
        }

        // 选择最重要的新闻
        const importantNews = topNews.filter(isImportantNews)
        const newsToAnalyze = importantNews.length > 0 ? importantNews[0] : topNews[0]

        console.log('Analyzing news:', newsToAnalyze.title)

        // 生成分析
        const analysis = await generateNewsAnalysis(newsToAnalyze)

        if (!analysis) {
            console.error('Failed to generate analysis')
            return res.status(500).json({ error: 'Failed to generate news analysis' })
        }

        // 发送到Telegram
        const telegramResult = await sendToTelegram(analysis)

        if (telegramResult.ok) {
            console.log('✅ News analysis sent successfully')
            return res.status(200).json({
                success: true,
                messageId: telegramResult.result?.message_id,
                newsTitle: newsToAnalyze.title,
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
