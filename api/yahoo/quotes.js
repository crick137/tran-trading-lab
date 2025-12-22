// Yahoo Finance 股票/指数/商品报价 API
// Vercel Serverless Function

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

export default async function handler(req, res) {
    // CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' })
    }

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

        res.status(200).json({ success: true, data: result })
    } catch (error) {
        console.error('Yahoo API error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
}
