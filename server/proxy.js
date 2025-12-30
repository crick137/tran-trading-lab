import express from 'express'
import cors from 'cors'

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
        // 使用 exchangerate.host
        const response = await fetch('https://api.exchangerate.host/latest?base=USD')
        const data = await response.json()

        if (!data.rates) {
            // 备选：使用 frankfurter.app
            const fallbackResponse = await fetch('https://api.frankfurter.app/latest?from=USD')
            const fallbackData = await fallbackResponse.json()

            const rates = fallbackData.rates || {}
            const result = {
                'EUR/USD': { price: 1 / rates.EUR, change: 0 },
                'GBP/USD': { price: 1 / rates.GBP, change: 0 },
                'USD/JPY': { price: rates.JPY, change: 0 },
                'USD/CNH': { price: rates.CNY || 7.28, change: 0 },
                'AUD/USD': { price: 1 / rates.AUD, change: 0 },
                'KRW/USD': { price: 1 / rates.KRW, change: 0 },
            }
            return res.json({ success: true, data: result })
        }

        const rates = data.rates
        const result = {
            'EUR/USD': { price: 1 / rates.EUR, change: 0 },
            'GBP/USD': { price: 1 / rates.GBP, change: 0 },
            'USD/JPY': { price: rates.JPY, change: 0 },
            'USD/CNH': { price: rates.CNY || 7.28, change: 0 },
            'AUD/USD': { price: 1 / rates.AUD, change: 0 },
            'KRW/USD': { price: 1 / rates.KRW, change: 0 },
        }

        res.json({ success: true, data: result })
    } catch (error) {
        console.error('Forex API error:', error.message)
        res.status(500).json({ success: false, error: error.message })
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

// 한국 금융 뉴스 API
app.get('/api/news/korean', async (req, res) => {
    try {
        const now = Date.now()

        // 캐시 확인
        if (newsCache.data && (now - newsCache.timestamp) < NEWS_CACHE_TTL) {
            console.log('📰 Returning cached Korean news')
            return res.json({ success: true, data: newsCache.data, cached: true })
        }

        console.log('📰 Fetching fresh Korean news from RSS feeds...')
        const allNews = []

        // 모든 피드에서 뉴스 가져오기
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

        // 날짜순 정렬 (최신순)
        allNews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        // 캐시 업데이트
        newsCache = { data: allNews, timestamp: now }

        console.log(`📰 Total Korean news fetched: ${allNews.length}`)
        res.json({ success: true, data: allNews, cached: false })
    } catch (error) {
        console.error('Korean news API error:', error.message)
        res.status(500).json({ success: false, error: error.message })
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

// 批量分析新闻情绪统计 (仅管理员)
app.post('/api/admin/sentiment/analyze-news', adminAuth, async (req, res) => {
    try {
        // 获取缓存的新闻
        if (!newsCache.data || newsCache.data.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No cached news. Please fetch Korean news first.'
            })
        }

        // 提取新闻标题
        const titles = newsCache.data.slice(0, 50).map(n => n.title)

        // 调用情绪分析 API
        const response = await fetch(`${SENTIMENT_API_URL}/api/sentiment/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: titles })
        })

        if (!response.ok) {
            throw new Error(`Sentiment API error: ${response.status}`)
        }

        const analysis = await response.json()

        res.json({
            success: true,
            data: {
                ...analysis,
                news_sample: newsCache.data.slice(0, 5).map(n => ({ title: n.title, source: n.source })),
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

// ============================================
// Newsletter Subscription APIs
// ============================================
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { randomBytes } from 'crypto'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SUBSCRIBERS_FILE = join(__dirname, 'data', 'subscribers.json')

// 确保数据目录存在
if (!existsSync(join(__dirname, 'data'))) {
    mkdirSync(join(__dirname, 'data'), { recursive: true })
}

// 读取订阅者列表
function getSubscribers() {
    try {
        if (!existsSync(SUBSCRIBERS_FILE)) {
            return { subscribers: [], lastUpdated: null }
        }
        const data = readFileSync(SUBSCRIBERS_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (e) {
        return { subscribers: [], lastUpdated: null }
    }
}

// 保存订阅者列表
function saveSubscribers(data) {
    data.lastUpdated = new Date().toISOString()
    writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// 订阅API
app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
        const { email, name, language } = req.body

        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, error: 'Valid email required' })
        }

        const data = getSubscribers()

        // 检查是否已订阅（文件存储）
        if (data.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ success: false, error: 'Email already subscribed' })
        }

        // 生成退订token
        const token = randomBytes(32).toString('hex')
        const subscriber = {
            email: email.toLowerCase(),
            name: name || email.split('@')[0],
            language: language || 'ko',
            subscribedAt: new Date().toISOString(),
            token
        }

        // 保存到文件存储
        data.subscribers.push(subscriber)
        saveSubscribers(data)

        // 同步到Supabase（如果可用）
        if (supabase) {
            try {
                await supabase.from('newsletter_subscribers').upsert({
                    email: subscriber.email,
                    name: subscriber.name,
                    language: subscriber.language,
                    unsubscribe_token: token,
                    is_active: true,
                    subscribed_at: subscriber.subscribedAt
                }, { onConflict: 'email' })
                console.log('📦 Synced to Supabase:', email)
            } catch (dbErr) {
                console.warn('Supabase sync failed (continuing):', dbErr.message)
            }
        }

        // 发送确认邮件
        try {
            const { sendEmail, emailTemplates } = await import('./emailService.js')
            const appUrl = process.env.APP_URL || 'https://www.trantradinglab.com'
            const unsubscribeUrl = `${appUrl}/api/newsletter/unsubscribe?token=${token}`
            const template = emailTemplates.confirmSubscription(subscriber.name, unsubscribeUrl, subscriber.language)
            await sendEmail(email, template)
            console.log('✉️ Confirmation email sent to:', email)
        } catch (emailErr) {
            console.error('Failed to send confirmation email:', emailErr.message)
        }

        console.log(`📧 New subscriber: ${email}`)
        res.json({ success: true, message: 'Subscribed successfully' })
    } catch (error) {
        console.error('Subscribe error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
})

// 退订API
app.get('/api/newsletter/unsubscribe', async (req, res) => {
    try {
        const { token } = req.query

        if (!token) {
            return res.status(400).send('<h2>Invalid unsubscribe link</h2>')
        }

        const data = getSubscribers()
        const index = data.subscribers.findIndex(s => s.token === token)

        if (index === -1) {
            return res.status(404).send('<h2>Subscription not found</h2>')
        }

        const subscriber = data.subscribers[index]
        data.subscribers.splice(index, 1)
        saveSubscribers(data)

        // 发送退订确认邮件
        try {
            const { sendEmail, emailTemplates } = await import('./emailService.js')
            const template = emailTemplates.unsubscribeConfirm(subscriber.language)
            await sendEmail(subscriber.email, template)
        } catch (emailErr) {
            console.error('Failed to send unsubscribe confirmation:', emailErr.message)
        }

        console.log(`📧 Unsubscribed: ${subscriber.email}`)

        // 返回友好的HTML页面
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Unsubscribed - TRAN Trading Lab</title>
                <style>
                    body { font-family: 'Inter', sans-serif; background: #0d1117; color: #fff; display: flex; 
                           align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                    .container { text-align: center; padding: 40px; }
                    h1 { color: #00ff88; }
                    a { color: #00d4ff; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>✓ 退订成功</h1>
                    <p>您已成功退订 TRAN Trading Lab 邮件通知。</p>
                    <p><a href="${process.env.APP_URL || 'https://www.trantradinglab.com'}">返回首页</a></p>
                </div>
            </body>
            </html>
        `)
    } catch (error) {
        console.error('Unsubscribe error:', error.message)
        res.status(500).send('<h2>Error processing request</h2>')
    }
})

// 获取订阅者列表（管理员）
app.get('/api/newsletter/subscribers', async (req, res) => {
    try {
        const data = getSubscribers()
        res.json({
            success: true,
            count: data.subscribers.length,
            subscribers: data.subscribers.map(s => ({
                email: s.email,
                name: s.name,
                language: s.language,
                subscribedAt: s.subscribedAt
            })),
            lastUpdated: data.lastUpdated
        })
    } catch (error) {
        console.error('Get subscribers error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
})

// 发送群发邮件（管理员）
app.post('/api/newsletter/send', async (req, res) => {
    try {
        const { title, content, adminKey } = req.body

        // 简单的管理员验证（生产环境应使用更安全的方式）
        const validAdminKey = process.env.ADMIN_KEY || 'tran-admin-2024'
        if (adminKey !== validAdminKey) {
            return res.status(403).json({ success: false, error: 'Unauthorized' })
        }

        if (!title || !content) {
            return res.status(400).json({ success: false, error: 'Title and content required' })
        }

        const { sendEmail, emailTemplates } = await import('./emailService.js')
        const data = getSubscribers()
        const appUrl = process.env.APP_URL || 'https://www.trantradinglab.com'

        let successCount = 0
        let failCount = 0

        for (const subscriber of data.subscribers) {
            try {
                const unsubscribeUrl = `${appUrl}/api/newsletter/unsubscribe?token=${subscriber.token}`
                const template = emailTemplates.contentUpdate(title, content, unsubscribeUrl, subscriber.language)
                await sendEmail(subscriber.email, template)
                successCount++
                // 避免发送过快
                await new Promise(r => setTimeout(r, 200))
            } catch (e) {
                failCount++
                console.error(`Failed to send to ${subscriber.email}:`, e.message)
            }
        }

        console.log(`📧 Newsletter sent: ${successCount} success, ${failCount} failed`)
        res.json({
            success: true,
            message: `Newsletter sent to ${successCount} subscribers`,
            stats: { success: successCount, failed: failCount, total: data.subscribers.length }
        })
    } catch (error) {
        console.error('Send newsletter error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
})

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '2.0.0'
    })
})

// 全局错误处理
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message)
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    })
})

// 404 处理
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' })
})

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║      🚀 TRAN Market API Proxy v2.0                  ║
╠══════════════════════════════════════════════════════╣
║  Server running at http://localhost:${PORT}            ║
╠══════════════════════════════════════════════════════╣
║  📊 Endpoints:                                       ║
║     GET  /api/yahoo/quotes  - Stock/Commodities     ║
║     GET  /api/forex/rates   - Forex Rates           ║
║     GET  /api/market/all    - All Market Data       ║
║     POST /api/email/send    - Send Email            ║
║     POST /api/email/test    - Test Email            ║
║     GET  /api/health        - Health Check          ║
╚══════════════════════════════════════════════════════╝
    `)
})
