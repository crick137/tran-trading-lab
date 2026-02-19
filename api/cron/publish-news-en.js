/**
 * Vercel Cron Job: English News Publisher
 * Schedule: 30 * * * * (every hour at :30)
 * Publishes latest English financial news to Telegram @TranTradingLabNewsEN
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL_EN || '@TranTradingLabNewsEN'

const ENGLISH_NEWS_FEEDS = [
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk' },
    { id: 'cointelegraph', url: 'https://cointelegraph.com/rss', name: 'CoinTelegraph' },
    { id: 'investing', url: 'https://www.investing.com/rss/news.rss', name: 'Investing.com' },
    { id: 'ft-markets', url: 'https://www.ft.com/markets?format=rss', name: 'FT Markets' },
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

async function fetchEnglishNews() {
    const allNews = []
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    const results = await Promise.all(
        ENGLISH_NEWS_FEEDS.map(async (feed) => {
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

    return allNews
        .filter(n => n.pubDate >= oneHourAgo)
        .sort((a, b) => b.pubDate - a.pubDate)
        .slice(0, 5)
}

async function sendToTelegram(news) {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'Asia/Seoul' })
    let message = `📰 <b>Market News</b>        ${today}\n\n`

    news.forEach(n => {
        const title = n.title.length > 55 ? n.title.slice(0, 55) + '...' : n.title
        message += `- ${n.source} | ${title} <a href="${n.link}">read</a>\n`
    })

    message += `\n#News #Markets #TranTradingLab`

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
        const news = await fetchEnglishNews()

        if (news.length === 0) {
            console.log('No new English articles in the last hour')
            return res.status(200).json({ success: true, message: 'No new articles', published: 0 })
        }

        const result = await sendToTelegram(news)

        if (result.ok) {
            console.log(`✅ Published ${news.length} EN news to ${TELEGRAM_CHANNEL}`)
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
