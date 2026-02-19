/**
 * Vercel Cron Job: Korean News Publisher
 * Schedule: 0 * * * * (every hour at :00)
 * Publishes latest Korean financial news to Telegram @TranTradingLabNewsKR
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL_KR || '@TranTradingLabNewsKR'

const KOREAN_NEWS_FEEDS = [
    { id: 'etoday-finance', url: 'https://rss.etoday.co.kr/eto/finance_news.xml', name: '이투데이 증권' },
    { id: 'etoday-economy', url: 'https://rss.etoday.co.kr/eto/economy_news.xml', name: '이투데이 경제' },
    { id: 'etoday-global', url: 'https://rss.etoday.co.kr/eto/global_news.xml', name: '이투데이 국제' },
    { id: 'mk-economy', url: 'https://www.mk.co.kr/rss/30100041/', name: '매일경제 경제' },
    { id: 'mk-stock', url: 'https://www.mk.co.kr/rss/30200030/', name: '매일경제 증시' },
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한국경제 증권' },
    { id: 'sedaily', url: 'https://www.sedaily.com/rss/NewsList/GK', name: '서울경제' },
]

function parseRssXml(xml, feedId, feedName) {
    const items = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1]
        const getTag = (tag) => {
            const m = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`).exec(itemXml)
            return m ? (m[1] || m[2] || '').trim() : ''
        }

        const title = getTag('title')
        const link = getTag('link')
        const pubDate = getTag('pubDate')

        if (title && link) {
            items.push({
                id: `${feedId}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
                title,
                link,
                source: feedName,
                pubDate: pubDate ? new Date(pubDate) : new Date()
            })
        }
    }
    return items
}

async function fetchKoreanNews() {
    const allNews = []
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    const results = await Promise.all(
        KOREAN_NEWS_FEEDS.map(async (feed) => {
            try {
                const res = await fetch(feed.url, {
                    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/rss+xml, text/xml' },
                    signal: AbortSignal.timeout(8000)
                })
                if (!res.ok) return []
                const xml = await res.text()
                return parseRssXml(xml, feed.id, feed.name)
            } catch {
                return []
            }
        })
    )

    results.forEach(items => allNews.push(...items))

    // 最近1小时内的新闻
    return allNews
        .filter(n => n.pubDate >= oneHourAgo)
        .sort((a, b) => b.pubDate - a.pubDate)
        .slice(0, 5)
}

async function sendToTelegram(news) {
    const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', timeZone: 'Asia/Seoul' })
    let message = `📰 <b>마켓 뉴스</b>        ${today}\n\n`

    news.forEach(n => {
        const title = n.title.length > 45 ? n.title.slice(0, 45) + '...' : n.title
        const source = n.source.replace('이투데이 ', '').replace('매일경제 ', '매경 ').replace('한국경제 ', '한경 ')
        message += `- ${source} ${title} <a href="${n.link}">원문</a>\n`
    })

    message += `\n#뉴스 #마켓 #TranTradingLab`

    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHANNEL,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
    })

    return res.json()
}

export default async function handler(req, res) {
    // Vercel cron 보안 확인
    const authHeader = req.headers['authorization']
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!TELEGRAM_BOT_TOKEN) {
        return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN not set' })
    }

    try {
        const news = await fetchKoreanNews()

        if (news.length === 0) {
            console.log('No new Korean articles in the last hour')
            return res.status(200).json({ success: true, message: 'No new articles', published: 0 })
        }

        const result = await sendToTelegram(news)

        if (result.ok) {
            console.log(`✅ Published ${news.length} KR news to ${TELEGRAM_CHANNEL}`)
            return res.status(200).json({ success: true, published: news.length })
        } else {
            console.error('Telegram error:', result.description)
            return res.status(500).json({ success: false, error: result.description })
        }
    } catch (error) {
        console.error('Cron error:', error.message)
        return res.status(500).json({ success: false, error: error.message })
    }
}
