// 外汇汇率 API
// Vercel Serverless Function

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
        // 使用 frankfurter.app（免费且可靠）
        const response = await fetch('https://api.frankfurter.app/latest?from=USD')
        const data = await response.json()

        if (!data.rates) {
            throw new Error('Failed to fetch forex rates')
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

        res.status(200).json({ success: true, data: result })
    } catch (error) {
        console.error('Forex API error:', error.message)
        res.status(500).json({ success: false, error: error.message })
    }
}
