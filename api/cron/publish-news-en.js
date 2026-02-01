/**
 * Vercel Cron: 每小时自动发布 Top 5 英语新闻到 Telegram
 * 目标频道: https://t.me/TranTradingLabEN
 * 配置在 vercel.json 中设置 cron 表达式
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL_ID = '@TranTradingLabNewsEN'

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required')
}

// 全球金融新闻源 (22个源)
const ENGLISH_NEWS_FEEDS = [
    // Crypto & Digital Assets
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk' },
    { id: 'cointelegraph', url: 'https://cointelegraph.com/rss', name: 'Cointelegraph' },
    { id: 'theblock', url: 'https://www.theblock.co/rss.xml', name: 'The Block' },
    { id: 'decrypt', url: 'https://decrypt.co/feed', name: 'Decrypt' },
    { id: 'bitcoinmag', url: 'https://bitcoinmagazine.com/feed', name: 'Bitcoin Mag' },

    // Global Markets & Finance
    { id: 'investing-news', url: 'https://www.investing.com/rss/news.rss', name: 'Investing.com' },
    { id: 'marketwatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/', name: 'MarketWatch' },
    { id: 'yahoofinance', url: 'https://finance.yahoo.com/news/rssindex', name: 'Yahoo Finance' },
    { id: 'seekingalpha', url: 'https://seekingalpha.com/market_currents.xml', name: 'SeekingAlpha' },
    { id: 'benzinga', url: 'https://www.benzinga.com/feed', name: 'Benzinga' },

    // Business & Economy
    { id: 'cnbc', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', name: 'CNBC' },
    { id: 'businessinsider', url: 'https://www.businessinsider.com/rss', name: 'Business Insider' },
    { id: 'forbes', url: 'https://www.forbes.com/innovation/feed/', name: 'Forbes' },

    // Asia Pacific Focus
    { id: 'scmp-economy', url: 'https://www.scmp.com/rss/91/feed', name: 'SCMP' },
    { id: 'nikkei', url: 'https://asia.nikkei.com/rss/feed/nar', name: 'Nikkei Asia' },
    { id: 'channelnewsasia', url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6511', name: 'CNA' },

    // Tech & Innovation
    { id: 'techcrunch', url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
    { id: 'theverge', url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge' },
    { id: 'wired', url: 'https://www.wired.com/feed/rss', name: 'Wired' },

    // Forex & Commodities
    { id: 'fxstreet', url: 'https://www.fxstreet.com/rss/news', name: 'FXStreet' },
    { id: 'dailyfx', url: 'https://www.dailyfx.com/feeds/all', name: 'DailyFX' },
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
                title: title.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(),
                source: feedInfo.name,
                source_url: link,
            })
        }
    }
    return items
}

async function fetchAllNews() {
    const allNews = []

    const fetchPromises = ENGLISH_NEWS_FEEDS.map(async (feed) => {
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
    allNews.sort((a, b) => Math.random() - 0.5) // Randomize for diversity

    return allNews.slice(0, 100) // Limit
}

function formatNewsForTelegram(newsArray) {
    let message = `📰 <b>Market News (Top ${newsArray.length})</b>\n\n`

    newsArray.forEach((news) => {
        const shortTitle = news.title.length > 45 ? news.title.slice(0, 42) + '...' : news.title
        message += `- ${news.source} ${shortTitle} <a href="${news.source_url}">Link</a>\n`
    })

    message += `\n#News #Markets #TranTradingLab`
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
    // Verify Vercel cron call
    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!TELEGRAM_BOT_TOKEN) {
        return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN environment variable is required' })
    }

    try {
        console.log('📰 Fetching English news...')
        const allNews = await fetchAllNews()

        if (allNews.length === 0) {
            return res.status(200).json({ message: 'No news available' })
        }

        // Select 5 news with source diversity
        const seen = new Set()
        const toPublish = []
        for (const n of allNews) {
            const sourceCount = toPublish.filter(s => s.source === n.source).length
            if (sourceCount < 2 && !seen.has(n.title)) {
                toPublish.push(n)
                seen.add(n.title)
                if (toPublish.length >= 5) break
            }
        }

        const message = formatNewsForTelegram(toPublish)

        console.log('📤 Sending to @TranTradingLabEN...')
        const result = await sendTelegramMessage(message)

        return res.status(200).json({
            success: result.ok,
            published: toPublish.length,
            channel: TELEGRAM_CHANNEL_ID,
            time: new Date().toISOString()
        })
    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ error: error.message })
    }
}
