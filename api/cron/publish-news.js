/**
 * Vercel Cron: 每小时自动发布 Top 5 新闻到 Telegram
 * 配置在 vercel.json 中设置 cron 表达式
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@TranTradingLabNews'

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required')
}

// 扩展的韩国金融新闻源
const NEWS_FEEDS = [
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한경 증권' },
    { id: 'hankyung-economy', url: 'https://www.hankyung.com/feed/economy', name: '한경 경제' },
    { id: 'etoday', url: 'https://rss.etoday.co.kr/eto/etoday_news_all.xml', name: '이투데이' },
    { id: 'mk-economy', url: 'https://www.mk.co.kr/rss/30100041/', name: '매경 경제' },
    { id: 'mk-stock', url: 'https://www.mk.co.kr/rss/30200030/', name: '매경 증시' },
]

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

        if (title && link) {
            items.push({
                id: `${feedInfo.id}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
                title,
                source: feedInfo.name,
                source_url: link,
            })
        }
    }
    return items
}

async function fetchAllNews() {
    const allNews = []

    const fetchPromises = NEWS_FEEDS.map(async (feed) => {
        try {
            const response = await fetch(feed.url, {
                headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/rss+xml, application/xml, text/xml' },
                signal: AbortSignal.timeout(8000)
            })
            if (!response.ok) return []
            const xml = await response.text()
            return parseRssXml(xml, feed)
        } catch {
            return []
        }
    })

    const results = await Promise.all(fetchPromises)
    results.forEach(items => allNews.push(...items))
    allNews.sort((a, b) => Math.random() - 0.5) // 随机排序获取多样性

    return allNews.slice(0, 100) // 限制数量
}

function formatNewsForTelegram(newsArray) {
    const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })

    let message = `📰 <b>마켓 뉴스 (Top ${newsArray.length})</b>        ${today}\n\n`

    newsArray.forEach((news) => {
        const shortTitle = news.title.length > 40 ? news.title.slice(0, 40) + '...' : news.title
        message += `- ${news.source} ${shortTitle} <a href="${news.source_url}">원문</a>\n`
    })

    message += `\n#뉴스 #마켓 #TranTradingLab`
    return message
}

async function sendTelegramMessage(text) {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHANNEL_ID,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: false
        })
    })
    return response.json()
}

export default async function handler(req, res) {
    // 验证 Vercel cron 调用
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    // 环境变量验证
    if (!TELEGRAM_BOT_TOKEN) {
        return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN environment variable is required' })
    }

    try {
        console.log('📰 Fetching news...')
        const allNews = await fetchAllNews()

        if (allNews.length === 0) {
            return res.status(200).json({ message: 'No news available' })
        }

        // 随机选择 5 条新闻
        const toPublish = allNews.slice(0, 5)
        const message = formatNewsForTelegram(toPublish)
        const result = await sendTelegramMessage(message)

        return res.status(200).json({
            success: result.ok,
            published: toPublish.length,
            time: new Date().toISOString()
        })
    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: error.message })
    }
}
