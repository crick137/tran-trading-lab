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

// CORS 配置
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// 请求日志中间件
app.use((req, res, next) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${req.method} ${req.path}`)
    next()
})

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
