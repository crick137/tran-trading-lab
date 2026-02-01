/**
 * TRAN Trading Lab - English News Publisher
 * Publish global financial news to @TranTradingLabEN
 * 
 * Usage: node publish-english-news.js [count]
 * Example: node publish-english-news.js 5
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = '@TranTradingLabEN'

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required')
}

// Expanded English/Global News Sources
const ENGLISH_NEWS_FEEDS = [
    // ============================================
    // Crypto & Digital Assets
    // ============================================
    { id: 'coindesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk', category: 'Crypto' },
    { id: 'cointelegraph', url: 'https://cointelegraph.com/rss', name: 'Cointelegraph', category: 'Crypto' },
    { id: 'theblock', url: 'https://www.theblock.co/rss.xml', name: 'The Block', category: 'Crypto' },
    { id: 'decrypt', url: 'https://decrypt.co/feed', name: 'Decrypt', category: 'Crypto' },
    { id: 'bitcoinmag', url: 'https://bitcoinmagazine.com/feed', name: 'Bitcoin Mag', category: 'Crypto' },

    // ============================================
    // Global Markets & Finance
    // ============================================
    { id: 'investing-news', url: 'https://www.investing.com/rss/news.rss', name: 'Investing.com', category: 'Markets' },
    { id: 'marketwatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/', name: 'MarketWatch', category: 'Markets' },
    { id: 'yahoofinance', url: 'https://finance.yahoo.com/news/rssindex', name: 'Yahoo Finance', category: 'Markets' },
    { id: 'seekingalpha', url: 'https://seekingalpha.com/market_currents.xml', name: 'SeekingAlpha', category: 'Markets' },
    { id: 'benzinga', url: 'https://www.benzinga.com/feed', name: 'Benzinga', category: 'Markets' },

    // ============================================
    // Business & Economy
    // ============================================
    { id: 'cnbc', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', name: 'CNBC', category: 'Business' },
    { id: 'businessinsider', url: 'https://www.businessinsider.com/rss', name: 'Business Insider', category: 'Business' },
    { id: 'forbes', url: 'https://www.forbes.com/innovation/feed/', name: 'Forbes', category: 'Business' },

    // ============================================
    // Asia Pacific Focus
    // ============================================
    { id: 'scmp-economy', url: 'https://www.scmp.com/rss/91/feed', name: 'SCMP', category: 'Asia' },
    { id: 'nikkei', url: 'https://asia.nikkei.com/rss/feed/nar', name: 'Nikkei Asia', category: 'Asia' },
    { id: 'channelnewsasia', url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6511', name: 'CNA', category: 'Asia' },

    // ============================================
    // Tech & Innovation
    // ============================================
    { id: 'techcrunch', url: 'https://techcrunch.com/feed/', name: 'TechCrunch', category: 'Tech' },
    { id: 'theverge', url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge', category: 'Tech' },
    { id: 'wired', url: 'https://www.wired.com/feed/rss', name: 'Wired', category: 'Tech' },

    // ============================================
    // Forex & Commodities
    // ============================================
    { id: 'fxstreet', url: 'https://www.fxstreet.com/rss/news', name: 'FXStreet', category: 'Forex' },
    { id: 'dailyfx', url: 'https://www.dailyfx.com/feeds/all', name: 'DailyFX', category: 'Forex' },
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
        const pubDate = getTagContent('pubDate')

        if (title && link) {
            items.push({
                title: title.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(),
                source: feedInfo.name,
                source_url: link,
                category: feedInfo.category,
                pubDate: pubDate ? new Date(pubDate) : new Date()
            })
        }
    }
    return items
}

async function fetchEnglishNews() {
    console.log('📰 Fetching news from global sources...')
    const allNews = []

    for (const feed of ENGLISH_NEWS_FEEDS) {
        try {
            const res = await fetch(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/rss+xml, application/xml, text/xml'
                },
                signal: AbortSignal.timeout(8000)
            })
            if (res.ok) {
                const xml = await res.text()
                const items = parseRssXml(xml, feed)
                allNews.push(...items)
                console.log(`  ✓ ${feed.name}: ${items.length} articles`)
            } else {
                console.log(`  ⚠ ${feed.name}: HTTP ${res.status}`)
            }
        } catch (e) {
            console.log(`  ✗ ${feed.name}: ${e.message}`)
        }
    }

    // Sort by date, newest first
    allNews.sort((a, b) => b.pubDate - a.pubDate)

    return allNews
}

// Send message with link preview (same format as Korean version)
async function sendMessage(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHANNEL_ID,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: false  // Enable link preview
        })
    })
    return res.json()
}

async function publishEnglishNews(count = 5) {
    console.log(`\n🚀 Market News (Top ${count}) - Publishing to ${CHANNEL_ID}...\n`)

    const news = await fetchEnglishNews()
    console.log(`\n📋 Total ${news.length} articles collected`)

    if (news.length === 0) {
        console.log('❌ No news found to publish')
        return
    }

    // Select top N, ensuring source diversity (max 2 per source)
    const seen = new Set()
    const selected = []

    for (const n of news) {
        const sourceCount = selected.filter(s => s.source === n.source).length
        if (sourceCount < 2 && !seen.has(n.title)) {
            selected.push(n)
            seen.add(n.title)
            if (selected.length >= count) break
        }
    }

    // Build message - Match Korean format: 📰 마켓 뉴스 (Top N)
    const lines = [`📰 <b>Market News (Top ${selected.length})</b>\n`]

    for (const n of selected) {
        // Format: - Source Title 원문 (same style as Korean)
        const shortTitle = n.title.length > 45 ? n.title.slice(0, 42) + '...' : n.title
        lines.push(`- ${n.source} ${shortTitle} <a href="${n.source_url}">Link</a>`)
    }

    lines.push('')
    lines.push('#News #Markets #TranTradingLab')

    const message = lines.join('\n')

    console.log('\n📝 Message to publish:')
    console.log('─'.repeat(60))
    console.log(message.replace(/<[^>]*>/g, ''))  // Preview without HTML
    console.log('─'.repeat(60))

    const result = await sendMessage(message)

    if (result.ok) {
        console.log(`\n✅ Success! (Message ID: ${result.result.message_id})`)
        console.log(`📍 Posted to: ${CHANNEL_ID}`)
    } else {
        console.log(`\n❌ Failed: ${result.description}`)
    }
}

// CLI: node publish-english-news.js [count]
const count = parseInt(process.argv[2]) || 5
publishEnglishNews(count).catch(console.error)
