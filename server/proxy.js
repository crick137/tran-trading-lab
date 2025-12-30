import express from 'express'
import cors from 'cors'
import * as cheerio from 'cheerio'
import { translate } from 'google-translate-api-x'
import nlp from 'compromise'

// 尝试加载 dotenv（如果安装了）
try {
    const dotenv = await import('dotenv')
    dotenv.config()
} catch (e) {
    // dotenv 未安装，使用默认值
}

const app = express()
const PORT = process.env.PORT || 3001

// Supabase客户端（用于订阅者同步）
import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gswikdqcptfdnzmigsnl.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdzd2lrZHFjcHRmZG56bWlnc25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3NzcxMDAsImV4cCI6MjA0NTM1MzEwMH0.sBhAHPxvJQ47x9iZQ0hFCxjIAOCpyKLCpjjnaS3OK8Y'
let supabase = null
try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    console.log('✅ Supabase initialized for newsletter sync')
} catch (e) {
    console.warn('⚠️ Supabase not available, using file storage only')
}

// CORS 配置
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}))

app.use(express.json())

// 请求日志中间件
app.use((req, res, next) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${req.method} ${req.path}`)
    next()
})

// ============================================
// Admin Authentication Middleware
// ============================================
const ADMIN_KEY = process.env.ADMIN_KEY || '147258369.q'
const SENTIMENT_API_URL = process.env.SENTIMENT_API_URL || 'http://localhost:5000'

const adminAuth = (req, res, next) => {
    const adminKey = req.headers['x-admin-key']
    if (adminKey !== ADMIN_KEY) {
        return res.status(403).json({
            success: false,
            error: 'Admin access required. Please provide valid x-admin-key header.'
        })
    }
    next()
}

// Yahoo Finance 符号映射
const YAHOO_SYMBOLS = {
    'KOSPI': '^KS11',
    'KOSDAQ': '^KQ11',
    'SPY': 'SPY',
    'QQQ': 'QQQ',
    'DIA': 'DIA',
    'NIKKEI': '^N225',
    'HSI': '^HSI',
    'SSE': '000001.SS',
    'DAX': '^GDAXI',
    'FTSE': '^FTSE',
    'GOLD': 'GC=F',
    'SILVER': 'SI=F',
    'WTI': 'CL=F',
    'BRENT': 'BZ=F',
    'NG': 'NG=F',
    'COPPER': 'HG=F',
}

// 获取Yahoo Finance报价（使用v8 chart API）
app.get('/api/yahoo/quotes', async (req, res) => {
    try {
        const result = {}

        // 并行获取所有符号
        const promises = Object.entries(YAHOO_SYMBOLS).map(async ([ourSymbol, yahooSymbol]) => {
            try {
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                })

                if (!response.ok) return null

                const data = await response.json()
                const meta = data.chart?.result?.[0]?.meta

                if (meta) {
                    const price = meta.regularMarketPrice
                    const prevClose = meta.previousClose || meta.chartPreviousClose
                    const change = prevClose ? ((price - prevClose) / prevClose * 100) : 0

                    result[ourSymbol] = {
                        price: price,
                        change: change,
                        volume: meta.regularMarketVolume,
                        high24h: meta.regularMarketDayHigh,
                        low24h: meta.regularMarketDayLow,
                        name: meta.shortName || meta.symbol,
                    }
                }
            } catch (err) {
                // 静默失败，继续其他请求
            }
        })

        await Promise.all(promises)

        res.json({ success: true, data: result })
    } catch (error) {
        console.error('Yahoo API error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
})

// 获取外汇汇率
app.get('/api/forex/rates', async (req, res) => {
    try {
        // 使用 frankfurter.app (更稳定且免费)
        const response = await fetch('https://api.frankfurter.app/latest?from=USD')
        const data = await response.json()

        if (!data.rates) {
            throw new Error('No rates found')
        }

        const rates = data.rates
        const result = {
            'EUR/USD': { price: 1 / rates.EUR, change: 0 },
            'GBP/USD': { price: 1 / rates.GBP, change: 0 },
            'USD/JPY': { price: rates.JPY, change: 0 },
            'USD/CNH': { price: rates.CNY || 7.28, change: 0 },
            'AUD/USD': { price: 1 / rates.AUD, change: 0 },
            'KRW/USD': { price: rates.KRW || 1300, change: 0 },
        }

        res.json({ success: true, data: result })
    } catch (error) {
        console.error('Forex API error:', error.message)
        // 软兜底，返回之前的模拟数据以防止500错误
        const fallback = {
            'EUR/USD': { price: 1.085, change: 0.12 },
            'GBP/USD': { price: 1.265, change: -0.05 },
            'USD/JPY': { price: 151.2, change: 0.34 },
            'USD/CNH': { price: 7.24, change: 0.08 },
            'AUD/USD': { price: 0.654, change: -0.21 },
            'KRW/USD': { price: 1345, change: 0.15 },
        }
        res.json({ success: true, data: fallback, mock: true })
    }
})

// 获取所有市场数据
app.get('/api/market/all', async (req, res) => {
    try {
        const [yahooRes, forexRes] = await Promise.all([
            fetch(`http://localhost:${PORT}/api/yahoo/quotes`),
            fetch(`http://localhost:${PORT}/api/forex/rates`),
        ])

        const yahooData = await yahooRes.json()
        const forexData = await forexRes.json()

        res.json({
            success: true,
            data: {
                ...yahooData.data,
                ...forexData.data,
            }
        })
    } catch (error) {
        console.error('Market API error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
})

// ============================================
// Binance Klines Proxy (for custom chart)
// Fallback: Binance.US -> Mock Data
// ============================================
app.get('/api/binance/klines', async (req, res) => {
    const { symbol = 'BTCUSDT', interval = '1h', limit = 100 } = req.query

    // Try multiple data sources
    const sources = [
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
        `https://api.binance.us/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    ]

    for (const url of sources) {
        try {
            console.log(`Trying: ${url.split('/api')[0]}`)
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            })

            if (!response.ok) continue

            const klines = await response.json()
            const data = klines.map(k => ({
                time: k[0],
                open: parseFloat(k[1]),
                high: parseFloat(k[2]),
                low: parseFloat(k[3]),
                close: parseFloat(k[4]),
                volume: parseFloat(k[5]),
            }))

            console.log(`✅ Klines: ${data.length} candles`)
            return res.json({ success: true, data })
        } catch (e) {
            continue
        }
    }

    // All failed - mock data
    console.log('⚠️ Using mock data')
    const mockData = generateMockKlines(parseInt(limit), symbol)
    res.json({ success: true, data: mockData, mock: true })
})

function generateMockKlines(count, symbol) {
    const now = Date.now()
    const interval = 3600000
    const basePrice = symbol.includes('BTC') ? 95000 : symbol.includes('ETH') ? 3300 : 100
    const data = []
    let price = basePrice

    for (let i = count - 1; i >= 0; i--) {
        const vol = basePrice * 0.005
        const change = (Math.random() - 0.5) * 2 * vol
        const open = price, close = price + change
        const high = Math.max(open, close) + Math.random() * vol
        const low = Math.min(open, close) - Math.random() * vol
        data.push({ time: now - i * interval, open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2), volume: Math.random() * 1e6 })
        price = close
    }
    return data
}

// ============================================
// Korean Financial News RSS Crawler
// ============================================

// 한국 금융 뉴스 RSS 소스
const KOREAN_NEWS_FEEDS = [
    { id: 'hankyung-finance', url: 'https://www.hankyung.com/feed/finance', name: '한국경제 증권', category: 'finance' },
    { id: 'hankyung-economy', url: 'https://www.hankyung.com/feed/economy', name: '한국경제 경제', category: 'economy' },
    { id: 'etoday', url: 'https://rss.etoday.co.kr/eto/etoday_news_all.xml', name: '이투데이', category: 'all' },
]

// 뉴스 캐시 (5분 TTL)
let newsCache = { data: null, timestamp: 0 }
const NEWS_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// 간단한 XML 파싱 함수 (외부 의존성 없음)
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
        const description = getTagContent('description')
        const pubDate = getTagContent('pubDate')

        if (title && link) {
            items.push({
                id: `${feedInfo.id}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
                title,
                summary: description.replace(/<[^>]*>/g, '').slice(0, 200),
                source: feedInfo.name,
                source_url: link,
                category: feedInfo.category,
                created_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
                sentiment: 'neutral'
            })
        }
    }
    return items
}

// 提取新闻抓取逻辑为独立函数
async function fetchKoreanNews() {
    const now = Date.now()

    // 检查缓存
    if (newsCache.data && (now - newsCache.timestamp) < NEWS_CACHE_TTL) {
        console.log('📰 Returning cached Korean news')
        return { data: newsCache.data, cached: true }
    }

    console.log('📰 Fetching fresh Korean news from RSS feeds...')
    const allNews = []

    const fetchPromises = KOREAN_NEWS_FEEDS.map(async (feed) => {
        try {
            const response = await fetch(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/rss+xml, application/xml, text/xml'
                },
                timeout: 10000
            })

            if (!response.ok) {
                console.warn(`Failed to fetch ${feed.name}: ${response.status}`)
                return []
            }

            const xml = await response.text()
            const items = parseRssXml(xml, feed)
            console.log(`  ✓ ${feed.name}: ${items.length} items`)
            return items
        } catch (err) {
            console.warn(`Error fetching ${feed.name}:`, err.message)
            return []
        }
    })

    const results = await Promise.all(fetchPromises)
    results.forEach(items => allNews.push(...items))

    // 按日期排序
    allNews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    // 更新缓存
    newsCache = { data: allNews, timestamp: now }
    console.log(`📰 Total Korean news fetched: ${allNews.length}`)

    return { data: allNews, cached: false }
}

// 한국 금융 뉴스 API
app.get('/api/news/korean', async (req, res) => {
    try {
        const result = await fetchKoreanNews()
        res.json({ success: true, ...result })
    } catch (error) {
        console.error('Korean news API error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
})

// ============================================
// Article Content Crawler (Using Readability & Cheerio)
// ============================================

const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
        const response = await fetch(url, { ...options, signal: controller.signal })
        clearTimeout(id)
        return response
    } catch (error) {
        clearTimeout(id)
        throw error
    }
}

app.get('/api/proxy/article', async (req, res) => {
    try {
        const { url } = req.query
        if (!url) {
            return res.status(400).json({ success: false, error: 'URL required' })
        }

        console.log(`🕷️ Crawling article: ${url}`)

        const response = await fetchWithTimeout(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.status}`)
        }

        const html = await response.text()

        // ---------------------------------------------------------
        // 1. Advanced Extraction with Mozilla Readability
        // ---------------------------------------------------------
        let contentObj = null
        let title = ''
        let rawContent = ''

        try {
            const { JSDOM } = await import('jsdom')
            const { Readability } = await import('@mozilla/readability')

            const dom = new JSDOM(html, { url })
            const reader = new Readability(dom.window.document)
            const article = reader.parse()

            if (article) {
                console.log('✅ Readability successfully extracted content')
                title = article.title
                rawContent = article.content
            } else {
                console.warn('⚠️ Readability returned null, falling back.')
            }
        } catch (readErr) {
            console.warn('⚠️ Readability failed, falling back:', readErr.message)
        }

        // ---------------------------------------------------------
        // 2. Fallback / Post-Processing Logic
        // ---------------------------------------------------------

        // If Readability failed or returned null, try site-specific fallback
        if (!rawContent) {
            console.log('🔄 Performing fallback manual extraction')
            const $raw = cheerio.load(html)

            if (url.includes('hankyung.com')) {
                rawContent = $raw('#article-body, .article-body, .txt_article').html()
                title = $raw('.article-title, .title').text()
            } else if (url.includes('etoday.co.kr')) {
                rawContent = $raw('.article_view, .view_body').html()
                title = $raw('.main_title, .view_top h1').text()
            } else {
                rawContent = $raw('article, main, .content, body').first().html()
                title = $raw('h1').first().text() || $raw('title').text()
            }
        }

        // Load targeted content into Cheerio for processing & translation
        const $ = cheerio.load(rawContent || '')
        contentObj = $('body') // Cheerio wraps fragments in body

        // Clean title
        title = (title || '').trim()

        // ---------------------------------------------------------
        // Image & Link Processing
        // ---------------------------------------------------------
        try {
            // Fix lazy loaded images
            contentObj.find('img').each((i, el) => {
                const $img = $(el)
                const realSrc = $img.attr('data-src') || $img.attr('data-original') || $img.attr('data-url')
                if (realSrc) {
                    $img.attr('src', realSrc)
                }

                // Fix relative URLs
                const src = $img.attr('src')
                if (src && src.startsWith('/')) {
                    const urlObj = new URL(url)
                    $img.attr('src', `${urlObj.origin}${src}`)
                }

                // Remove tiny icons
                if ($img.attr('width') && parseInt($img.attr('width')) < 20) $img.remove()
            })

            // Fix relative links
            contentObj.find('a').each((i, el) => {
                const $a = $(el)
                const href = $a.attr('href')
                if (href && href.startsWith('/')) {
                    const urlObj = new URL(url)
                    $a.attr('href', `${urlObj.origin}${href}`)
                }
            })
        } catch (e) {
            console.warn('Image processing error:', e.message)
        }

        // ---------------------------------------------------------
        // Translation Logic
        // ---------------------------------------------------------
        const logMsg = (m) => {
            console.log(m)
            try {
                // Quick hack to append to file
                import('fs').then(fs => {
                    const logFile = 'server/translation.log'
                    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${m}\n`)
                }).catch(() => { })
            } catch (e) { }
        }

        logMsg(`🔤 STARTING TRANSLATION for: ${title}`)
        try {
            // 1. Translate Title
            if (title) {
                try {
                    logMsg('  -> Translating title...')
                    const tTitle = await translate(title, { to: 'zh-CN', client: 'gtx', rejectOnPartialFail: false })
                    logMsg(`  ✅ Title translated: ${tTitle.text}`)
                    title = tTitle.text
                } catch (e) {
                    logMsg(`  ❌ Title translation failed: ${e.message}`)
                }
            }

            // 2. Translate Content (Paragraph by Paragraph)
            const textNodes = []


            // Collect text nodes from P, headers, lists, and divs (for diverse layouts)
            contentObj.find('p, h1, h2, h3, h4, h5, li, div').each((i, el) => {
                // Ignore divs that are just wrappers for other captured elements
                if (el.tagName === 'div' && $(el).find('p').length > 0) return

                let text = $(el).text().trim()

                // --- Aggressive Cleaning for Translation ---
                // 1. Remove emails
                text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')

                // 2. Filter out junk lines
                // Common reporter signatures: "Hong Gil-dong reporter", "name@email.com"
                if (text.match(/기자\s*=|기자\s*$/)) return
                if (text.includes('무단전재') || text.includes('재배포 금지')) return
                if (text.match(/copyright|all rights reserved|ⓒ/i)) return

                // 3. Clean up bullets
                text = text.replace(/△/g, '• ').replace(/▲/g, '• ').replace(/■/g, '• ')

                // 4. Skip empty or too short text (increased threshold to skip menu items/dates)
                if (text.length > 8) {
                    textNodes.push({ el, text })
                }
            })

            logMsg(`  -> Found ${textNodes.length} text nodes to translate`)

            // Batch translate to save requests
            const BATCH_SIZE = 10
            for (let i = 0; i < textNodes.length; i += BATCH_SIZE) {
                const batch = textNodes.slice(i, i + BATCH_SIZE)
                const batchTexts = batch.map(n => n.text)

                try {
                    logMsg(`  -> Processing batch ${i / BATCH_SIZE + 1}...`)
                    const res = await translate(batchTexts, { to: 'zh-CN', client: 'gtx', rejectOnPartialFail: false })
                    // result can be array or single object depending on input
                    const results = Array.isArray(res) ? res : [res]

                    if (results.length > 0 && results[0].text) {
                        logMsg(`  -> Sample: "${results[0].text.substring(0, 10)}..."`)
                    }

                    batch.forEach((node, idx) => {
                        if (results[idx] && results[idx].text) {
                            $(node.el).text(results[idx].text)
                        }
                    })
                } catch (e) {
                    logMsg(`  ❌ Translation batch ${i} failed: ${e.message}`)
                }
            }
            logMsg('✅ Translation loop complete')

        } catch (transError) {
            logMsg(`❌ FATAL Translation setup error: ${transError.message}`)
        }

        // Final extraction
        let content = contentObj.html()

        // Fallback clean if empty
        if (!content || content.length < 50) {
            const paragraphs = []
            $('p').each((i, el) => {
                const text = $(el).text().trim()
                if (text.length > 20) paragraphs.push(`<p>${text}</p>`)
            })
            content = paragraphs.join('')
        }

        if (!title) title = $('title').text()

        res.json({
            success: true,
            data: {
                title: title.trim(),
                content: content || '<p>无法自动提取内容，请查看原文。</p>',
                source_url: url,
                translated: true
            }
        })

    } catch (error) {
        console.error('Crawler error:', error.message)
        res.status(500).json({
            success: false,
            error: 'Failed to load article content',
            details: error.message
        })
    }
})

// ============================================
// Admin Sentiment Analysis API (FinBERT)
// ============================================

// 情绪分析 - 分析单条或多条文本 (仅管理员)
app.post('/api/admin/sentiment', adminAuth, async (req, res) => {
    try {
        const { texts } = req.body

        if (!texts || !Array.isArray(texts) || texts.length === 0) {
            return res.status(400).json({ success: false, error: 'texts array required' })
        }

        const response = await fetch(`${SENTIMENT_API_URL}/api/sentiment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts })
        })

        if (!response.ok) {
            throw new Error(`Sentiment API error: ${response.status}`)
        }

        const data = await response.json()
        res.json({ success: true, data })
    } catch (error) {
        console.error('Sentiment API error:', error.message)
        res.status(500).json({
            success: false,
            error: error.message,
            hint: 'Make sure sentiment_api.py is running: python sentiment_api.py'
        })
    }
})

// 字符串相似度计算 (Dice Coefficient implementation)

// 字符串相似度计算 (Hybrid: Token Jaccard + Bigram Dice)
// Optimized for mixed English/Korean/Chinese titles
function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0

    // Normalize: lowercase, standard spaces
    const s1 = str1.toLowerCase().trim()
    const s2 = str2.toLowerCase().trim()

    if (s1 === s2) return 1

    // 1. Token Jaccard Strategy (Focus on shared keywords)
    // Split by non-word characters (catching English words and Korean chunks)
    const tokens1 = new Set(s1.split(/[^a-zA-Z0-9가-힣]+/).filter(w => w.length > 1))
    const tokens2 = new Set(s2.split(/[^a-zA-Z0-9가-힣]+/).filter(w => w.length > 1))

    let tokenIntersection = 0
    tokens1.forEach(t => { if (tokens2.has(t)) tokenIntersection++ })

    const tokenUnion = tokens1.size + tokens2.size - tokenIntersection
    const jaccard = tokenUnion === 0 ? 0 : tokenIntersection / tokenUnion

    // 2. Character Bigram Strategy (Focus on structural similarity/typos)
    // Remove all spaces for dense matching
    const clean1 = s1.replace(/\s+/g, '')
    const clean2 = s2.replace(/\s+/g, '')

    if (clean1.length < 2 || clean2.length < 2) return 0

    const bigrams1 = new Set()
    for (let i = 0; i < clean1.length - 1; i++) {
        bigrams1.add(clean1.substring(i, i + 2))
    }

    let bigramIntersect = 0
    // iterate s2 chunks
    for (let i = 0; i < clean2.length - 1; i++) {
        const bg = clean2.substring(i, i + 2)
        if (bigrams1.has(bg)) bigramIntersect++
    }

    const bigramUnion = bigrams1.size + (clean2.length - 1) // Approximation for Dice denominator usually 2*overlap? 
    // Standard Dice: 2 * |A n B| / (|A| + |B|)
    const dice = (2 * bigramIntersect) / (bigrams1.size + clean2.length - 1)

    // Weighted Score: 40% Keywords + 60% Structure
    // This allows different titles discussing the same "keywords" to match, 
    // while also letting similar sentences match.
    return (0.4 * jaccard) + (0.6 * dice)
}

// 提取关键词作为主题 (Centroid Title Strategy)
// Instead of synthetic keywords, pick the most representative title
function extractTopicKeywords(titles) {
    if (!titles || titles.length === 0) return ''
    if (titles.length === 1) return titles[0]

    // Find the title that determines the "center" of the cluster
    let bestTitle = titles[0]
    let maxTotalSim = -1

    titles.forEach(candidate => {
        let currentSimSum = 0
        titles.forEach(other => {
            if (candidate !== other) {
                currentSimSum += calculateSimilarity(candidate, other)
            }
        })

        if (currentSimSum > maxTotalSim) {
            maxTotalSim = currentSimSum
            bestTitle = candidate
        }
    })

    return bestTitle
}



// Helper: Extract Financial Entities (Crypto, Stocks)
const FINANCIAL_TICKERS = {
    'bitcoin': 'BTC', 'btc': 'BTC', '비트코인': 'BTC',
    'ethereum': 'ETH', 'eth': 'ETH', '이더리움': 'ETH',
    'ripple': 'XRP', 'xrp': 'XRP', '리플': 'XRP',
    'nvidia': 'NVDA', 'nvda': 'NVDA', '엔비디아': 'NVDA',
    'tesla': 'TSLA', 'tsla': 'TSLA', '테슬라': 'TSLA',
    'apple': 'AAPL', 'aapl': 'AAPL', '애플': 'AAPL',
    'samsung': '005930.KS', '삼성전자': '005930.KS',
    'sk hynix': '000660.KS', 'sk하이닉스': '000660.KS',
    'gold': 'GC=F', '금': 'GC=F',
    'usd': 'USD', '달러': 'USD'
}

function extractFinancialEntities(text) {
    if (!text) return []
    const doc = nlp(text)
    const entities = new Set()

    // 1. NLP extracted Organizations (Companies)
    doc.organizations().out('array').forEach(org => {
        entities.add(org)
    })

    // 2. Custom Ticker matching (Multi-lingual)
    const lowerText = text.toLowerCase()
    Object.keys(FINANCIAL_TICKERS).forEach(key => {
        if (lowerText.includes(key)) {
            entities.add(FINANCIAL_TICKERS[key])
        }
    })

    // 3. Regex for explicit tickers like $BTC or [BTC]
    const tickers = text.match(/[\$\[]([A-Z]{2,5})[\]]?/g)
    if (tickers) {
        tickers.forEach(t => entities.add(t.replace(/[\$\[\]]/g, '')))
    }

    return Array.from(entities)
}

// 批量分析新闻情绪统计 (仅管理员)
app.post('/api/admin/sentiment/analyze-news', adminAuth, async (req, res) => {
    try {
        // 获取缓存的新闻，如果为空则自动抓取
        if (!newsCache.data || newsCache.data.length === 0) {
            console.log('📰 Cache empty, auto-fetching news for analysis...')
            await fetchKoreanNews()

            if (!newsCache.data || newsCache.data.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No news available to analyze.'
                })
            }
        }

        // 提取新闻标题 (最多50条)
        const newsToAnalyze = newsCache.data.slice(0, 50)
        const titles = newsToAnalyze.map(n => n.title)

        // 调用情绪分析 API (使用详细分析接口)
        const response = await fetch(`${SENTIMENT_API_URL}/api/sentiment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: titles })
        })

        if (!response.ok) {
            throw new Error(`Sentiment API error: ${response.status}`)
        }

        const sentimentResults = await response.json()

        // 1. 整理详细列表
        const sentiment_counts = { positive: 0, negative: 0, neutral: 0 }
        const news_list = []

        sentimentResults.forEach((result, index) => {
            const originalNews = newsToAnalyze[index]
            if (result.sentiment) {
                sentiment_counts[result.sentiment]++
            }

            // Extract Tags via NLP
            const tags = extractFinancialEntities(originalNews.title)

            news_list.push({
                ...originalNews,
                sentiment: result.sentiment,
                confidence: result.confidence,
                scores: result.scores,
                tickers: tags
            })
        })

        // 2. 聚类生成热点话题 (Clustering)
        const clusters = []
        const THRESHOLD = 0.3

        news_list.forEach(item => {
            let bestCluster = null
            let maxSim = 0

            for (const cluster of clusters) {
                const sim = calculateSimilarity(item.title, cluster.items[0].title)
                if (sim > maxSim) {
                    maxSim = sim
                    bestCluster = cluster
                }
            }

            if (bestCluster && maxSim >= THRESHOLD) {
                bestCluster.items.push(item)
                bestCluster.sentiments.push(item.sentiment)
            } else {
                clusters.push({
                    items: [item],
                    sentiments: [item.sentiment]
                })
            }
        })

        // 3. 处理聚类结果 (生成 Hot Topics)
        const hot_topics = clusters
            .filter(c => c.items.length >= 2)
            .map(c => {
                const sCounts = { positive: 0, negative: 0, neutral: 0 }
                c.sentiments.forEach(s => sCounts[s]++)
                const dominantSentiment = Object.keys(sCounts).reduce((a, b) => sCounts[a] > sCounts[b] ? a : b)

                const topicTitle = extractTopicKeywords(c.items.map(i => i.title))

                return {
                    title: topicTitle,
                    count: c.items.length,
                    sentiment: dominantSentiment,
                    articles: c.items,
                    updated_at: c.items[0].created_at
                }
            })
            .sort((a, b) => b.count - a.count)

        const total = sentimentResults.length

        const statistics = {
            total_analyzed: total,
            counts: sentiment_counts,
            percentages: {
                positive: total > 0 ? Math.round((sentiment_counts.positive / total) * 1000) / 10 : 0,
                negative: total > 0 ? Math.round((sentiment_counts.negative / total) * 1000) / 10 : 0,
                neutral: total > 0 ? Math.round((sentiment_counts.neutral / total) * 1000) / 10 : 0
            }
        }

        res.json({
            success: true,
            data: {
                ...statistics,
                hot_topics: hot_topics,
                news_list: news_list,
                analyzed_at: new Date().toISOString()
            }
        })
    } catch (error) {
        console.error('News sentiment analysis error:', error.message)
        res.status(500).json({
            success: false,
            error: error.message,
            hint: 'Make sure sentiment_api.py is running: python sentiment_api.py'
        })
    }
})

// 情绪 API 健康检查 (仅管理员)
app.get('/api/admin/sentiment/health', adminAuth, async (req, res) => {
    try {
        const response = await fetch(`${SENTIMENT_API_URL}/api/health`)
        const data = await response.json()
        res.json({ success: true, data })
    } catch (error) {
        res.json({
            success: false,
            status: 'offline',
            error: 'Sentiment API not reachable',
            hint: 'Start with: python sentiment_api.py'
        })
    }
})

// 邮件发送 API
app.post('/api/email/send', async (req, res) => {
    try {
        const { sendEmail } = await import('./emailService.js')
        const { to, template, data } = req.body

        if (!to) {
            return res.status(400).json({ success: false, error: 'Email address required' })
        }

        const result = await sendEmail(to, template || 'welcome', data || {})
        res.json(result)
    } catch (error) {
        console.error('Email API error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
})

// 邮件测试 API
app.post('/api/email/test', async (req, res) => {
    try {
        const { sendTestEmail } = await import('./emailService.js')
        const { to } = req.body

        if (!to) {
            return res.status(400).json({ success: false, error: 'Email address required' })
        }

        const result = await sendTestEmail(to)
        res.json(result)
    } catch (error) {
        console.error('Email test error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
})

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`)
})
