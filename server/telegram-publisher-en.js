/**
 * TRAN Trading Lab - English Auto News Publisher
 * 自动定时发布英语新闻到 @TranTradingLabEN
 * 
 * Usage: node telegram-publisher-en.js
 * 每小时自动发布 3-5 条新闻
 */

import cron from 'node-cron'

// ============================================
// Configuration
// ============================================

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL_ID = '@TranTradingLabEN'

if (!TELEGRAM_BOT_TOKEN) {
    console.error('⚠️ TELEGRAM_BOT_TOKEN environment variable is required')
    process.exit(1)
}

// Expanded English/Global News Sources (22 sources)
const ENGLISH_NEWS_FEEDS = [
    // Crypto & Digital Assets
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk', category: 'Crypto' },
    { id: 'cointelegraph', url: 'https://cointelegraph.com/rss', name: 'Cointelegraph', category: 'Crypto' },
    { id: 'theblock', url: 'https://www.theblock.co/rss.xml', name: 'The Block', category: 'Crypto' },
    { id: 'decrypt', url: 'https://decrypt.co/feed', name: 'Decrypt', category: 'Crypto' },
    { id: 'bitcoinmag', url: 'https://bitcoinmagazine.com/feed', name: 'Bitcoin Mag', category: 'Crypto' },

    // Global Markets & Finance
    { id: 'investing-news', url: 'https://www.investing.com/rss/news.rss', name: 'Investing.com', category: 'Markets' },
    { id: 'marketwatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/', name: 'MarketWatch', category: 'Markets' },
    { id: 'yahoofinance', url: 'https://finance.yahoo.com/news/rssindex', name: 'Yahoo Finance', category: 'Markets' },
    { id: 'seekingalpha', url: 'https://seekingalpha.com/market_currents.xml', name: 'SeekingAlpha', category: 'Markets' },
    { id: 'benzinga', url: 'https://www.benzinga.com/feed', name: 'Benzinga', category: 'Markets' },

    // Business & Economy
    { id: 'cnbc', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', name: 'CNBC', category: 'Business' },
    { id: 'businessinsider', url: 'https://www.businessinsider.com/rss', name: 'Business Insider', category: 'Business' },
    { id: 'forbes', url: 'https://www.forbes.com/innovation/feed/', name: 'Forbes', category: 'Business' },

    // Asia Pacific Focus
    { id: 'scmp-economy', url: 'https://www.scmp.com/rss/91/feed', name: 'SCMP', category: 'Asia' },
    { id: 'nikkei', url: 'https://asia.nikkei.com/rss/feed/nar', name: 'Nikkei Asia', category: 'Asia' },
    { id: 'channelnewsasia', url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6511', name: 'CNA', category: 'Asia' },

    // Tech & Innovation
    { id: 'techcrunch', url: 'https://techcrunch.com/feed/', name: 'TechCrunch', category: 'Tech' },
    { id: 'theverge', url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge', category: 'Tech' },
    { id: 'wired', url: 'https://www.wired.com/feed/rss', name: 'Wired', category: 'Tech' },

    // Forex & Commodities
    { id: 'fxstreet', url: 'https://www.fxstreet.com/rss/news', name: 'FXStreet', category: 'Forex' },
    { id: 'dailyfx', url: 'https://www.dailyfx.com/feeds/all', name: 'DailyFX', category: 'Forex' },
]

// Track published news IDs to prevent duplicates
const publishedNewsIds = new Set()

// ============================================
// Telegram API Functions
// ============================================

async function sendTelegramMessage(text, parseMode = 'HTML') {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHANNEL_ID,
                text: text,
                parse_mode: parseMode,
                disable_web_page_preview: false
            })
        })

        const result = await response.json()
        if (result.ok) {
            console.log('✅ Telegram message sent successfully')
        } else {
            console.error('❌ Telegram error:', result.description)
        }
        return result
    } catch (error) {
        console.error('❌ Telegram API error:', error.message)
        return { ok: false, error: error.message }
    }
}

// ============================================
// News Fetching & Formatting
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
            if (m) return (m[1] || m[2] || '').trim()
            return ''
        }

        const title = getTagContent('title')
        const link = getTagContent('link')
        const pubDate = getTagContent('pubDate')

        if (title && link) {
            const id = `${feedInfo.id}-${Buffer.from(link).toString('base64').slice(0, 16)}`
            items.push({
                id,
                title: title.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(),
                source: feedInfo.name,
                source_url: link,
                category: feedInfo.category,
                created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString()
            })
        }
    }
    return items
}

async function fetchAllNews() {
    console.log('📰 Fetching news from all sources...')
    const allNews = []

    const fetchPromises = ENGLISH_NEWS_FEEDS.map(async (feed) => {
        try {
            const response = await fetch(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/rss+xml, application/xml, text/xml'
                },
                signal: AbortSignal.timeout(10000)
            })

            if (!response.ok) {
                console.warn(`  ⚠️ ${feed.name}: HTTP ${response.status}`)
                return []
            }

            const xml = await response.text()
            const items = parseRssXml(xml, feed)
            console.log(`  ✓ ${feed.name}: ${items.length} items`)
            return items
        } catch (err) {
            console.warn(`  ✗ ${feed.name}: ${err.message}`)
            return []
        }
    })

    const results = await Promise.all(fetchPromises)
    results.forEach(items => allNews.push(...items))

    // Sort by time, newest first
    allNews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    console.log(`📰 Total news fetched: ${allNews.length}`)
    return allNews
}

function formatNewsForTelegram(newsArray) {
    // Aggregated format: Top N news list (same as Korean version)
    let message = `📰 <b>Market News (Top ${newsArray.length})</b>\n\n`

    newsArray.forEach((news) => {
        // Truncate title to appropriate length
        const shortTitle = news.title.length > 45 ? news.title.slice(0, 42) + '...' : news.title
        message += `- ${news.source} ${shortTitle} <a href="${news.source_url}">Link</a>\n`
    })

    message += `\n#News #Markets #TranTradingLab`

    return message
}

// ============================================
// Main Publishing Logic
// ============================================

async function publishNewsToTelegram(count = 5) {
    console.log(`\n🚀 [${new Date().toISOString()}] Starting English news publishing job...`)

    try {
        const allNews = await fetchAllNews()

        // Filter already published news
        const freshNews = allNews.filter(n => !publishedNewsIds.has(n.id))
        console.log(`📋 Fresh news available: ${freshNews.length}`)

        if (freshNews.length === 0) {
            console.log('ℹ️ No new articles to publish')
            return
        }

        // Select top N with source diversity
        const seen = new Set()
        const toPublish = []

        for (const n of freshNews) {
            const sourceCount = toPublish.filter(s => s.source === n.source).length
            if (sourceCount < 2 && !seen.has(n.title)) {
                toPublish.push(n)
                seen.add(n.title)
                if (toPublish.length >= count) break
            }
        }

        // Create aggregated message
        const message = formatNewsForTelegram(toPublish)
        const result = await sendTelegramMessage(message)

        if (result.ok) {
            // Mark all published news
            toPublish.forEach(news => publishedNewsIds.add(news.id))
            console.log(`✅ Published aggregated news (${toPublish.length} items) to ${TELEGRAM_CHANNEL_ID}`)
        }

    } catch (error) {
        console.error('❌ Publishing error:', error.message)
    }
}

// ============================================
// Scheduler Setup
// ============================================

function startScheduler() {
    console.log('⏰ Starting English Auto News Publisher...')
    console.log(`   Bot Token: ${TELEGRAM_BOT_TOKEN.slice(0, 10)}...`)
    console.log(`   Channel ID: ${TELEGRAM_CHANNEL_ID}`)

    // Run every hour at :30 (offset from Korean version which runs at :00)
    cron.schedule('30 * * * *', () => {
        publishNewsToTelegram(5)
    })

    console.log('✅ Scheduler started: Publishing 5 news every hour at :30')
    console.log('💡 Run initial publish now...\n')

    // Run immediately
    publishNewsToTelegram(5)
}

// ============================================
// Exports & CLI
// ============================================

export {
    publishNewsToTelegram,
    fetchAllNews,
    sendTelegramMessage,
    startScheduler,
    ENGLISH_NEWS_FEEDS
}

// If running this file directly
if (import.meta.url === `file://${process.argv[1]}`) {
    startScheduler()
}
