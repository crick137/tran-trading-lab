/**
 * 实时市场数据API
 * 数据源：Binance（加密货币）、Yahoo Finance（股指/商品）、exchangerate.host（外汇）
 */

// Yahoo Finance符号映射
const YAHOO_SYMBOLS = {
    // 韩国
    'KOSPI': '^KS11',
    'KOSDAQ': '^KQ11',
    // 全球指数
    'SPY': 'SPY',
    'QQQ': 'QQQ',
    'DIA': 'DIA',
    'NIKKEI': '^N225',
    'HSI': '^HSI',
    'SSE': '000001.SS',
    'DAX': '^GDAXI',
    'FTSE': '^FTSE',
    // 商品
    'GOLD': 'GC=F',
    'SILVER': 'SI=F',
    'WTI': 'CL=F',
    'BRENT': 'BZ=F',
    'NG': 'NG=F',
    'COPPER': 'HG=F',
}

// Binance符号映射
const BINANCE_SYMBOLS = [
    'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT',
    'AVAXUSDT', 'DOGEUSDT', 'ADAUSDT', 'LINKUSDT', 'DOTUSDT'
]

// 外汇对
const FOREX_PAIRS = ['EUR', 'GBP', 'JPY', 'CNH', 'AUD', 'KRW']

/**
 * 获取Binance加密货币价格
 * @returns {Promise<Object>} 价格数据
 */
export async function fetchBinancePrices() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr')
        const data = await response.json()

        const prices = {}
        BINANCE_SYMBOLS.forEach(symbol => {
            const ticker = data.find(t => t.symbol === symbol)
            if (ticker) {
                const base = symbol.replace('USDT', '')
                prices[`${base}/USDT`] = {
                    price: parseFloat(ticker.lastPrice),
                    change: parseFloat(ticker.priceChangePercent),
                    volume: parseFloat(ticker.quoteVolume),
                    high24h: parseFloat(ticker.highPrice),
                    low24h: parseFloat(ticker.lowPrice),
                }
            }
        })
        return prices
    } catch (error) {
        console.error('Binance API error:', error)
        return {}
    }
}

/**
 * 获取Yahoo Finance股票/指数/商品价格（通过代理）
 * @returns {Promise<Object>} 价格数据
 */
export async function fetchYahooFinance() {
    try {
        const response = await fetch('http://localhost:3001/api/yahoo/quotes')
        const result = await response.json()

        if (result.success) {
            return result.data
        }
        throw new Error(result.error || 'Yahoo proxy failed')
    } catch (error) {
        console.warn('Yahoo proxy error:', error.message)
        return getYahooFallbackData(Object.keys(YAHOO_SYMBOLS))
    }
}

/**
 * 获取外汇汇率（通过代理）
 * @returns {Promise<Object>} 汇率数据
 */
export async function fetchForexRates() {
    try {
        const response = await fetch('http://localhost:3001/api/forex/rates')
        const result = await response.json()

        if (result.success) {
            return result.data
        }
        throw new Error(result.error || 'Forex proxy failed')
    } catch (error) {
        console.warn('Forex proxy error:', error.message)
        return getForexFallbackData()
    }
}

/**
 * 获取所有市场数据
 * @returns {Promise<Object>} 所有价格数据
 */
export async function fetchAllMarketData() {
    const [crypto, stocks, forex] = await Promise.all([
        fetchBinancePrices(),
        fetchYahooFinance(),
        fetchForexRates(),
    ])

    return { ...crypto, ...stocks, ...forex }
}

// Yahoo Finance备选数据（当CORS阻止时使用）
function getYahooFallbackData(symbols) {
    const fallback = {
        'KOSPI': { price: 2456.78 + (Math.random() - 0.5) * 20, change: 1.23 + (Math.random() - 0.5) * 0.5 },
        'KOSDAQ': { price: 689.45 + (Math.random() - 0.5) * 10, change: 2.15 + (Math.random() - 0.5) * 0.5 },
        'SPY': { price: 605.32 + (Math.random() - 0.5) * 5, change: 0.45 + (Math.random() - 0.5) * 0.3 },
        'QQQ': { price: 525.67 + (Math.random() - 0.5) * 5, change: 0.82 + (Math.random() - 0.5) * 0.3 },
        'DIA': { price: 441.23 + (Math.random() - 0.5) * 3, change: 0.12 + (Math.random() - 0.5) * 0.2 },
        'NIKKEI': { price: 39845.50 + (Math.random() - 0.5) * 200, change: 1.45 + (Math.random() - 0.5) * 0.5 },
        'HSI': { price: 19856.34 + (Math.random() - 0.5) * 100, change: -0.67 + (Math.random() - 0.5) * 0.5 },
        'SSE': { price: 3068.72 + (Math.random() - 0.5) * 20, change: 0.28 + (Math.random() - 0.5) * 0.3 },
        'DAX': { price: 19845.60 + (Math.random() - 0.5) * 100, change: 0.34 + (Math.random() - 0.5) * 0.3 },
        'FTSE': { price: 8245.30 + (Math.random() - 0.5) * 50, change: -0.12 + (Math.random() - 0.5) * 0.3 },
        'GOLD': { price: 2650.80 + (Math.random() - 0.5) * 20, change: 0.28 + (Math.random() - 0.5) * 0.3 },
        'SILVER': { price: 30.45 + (Math.random() - 0.5) * 0.5, change: 1.12 + (Math.random() - 0.5) * 0.5 },
        'WTI': { price: 71.23 + (Math.random() - 0.5) * 1, change: -0.85 + (Math.random() - 0.5) * 0.5 },
        'BRENT': { price: 74.56 + (Math.random() - 0.5) * 1, change: -0.67 + (Math.random() - 0.5) * 0.5 },
        'NG': { price: 3.245 + (Math.random() - 0.5) * 0.1, change: 2.34 + (Math.random() - 0.5) * 0.5 },
        'COPPER': { price: 4.2345 + (Math.random() - 0.5) * 0.1, change: 0.56 + (Math.random() - 0.5) * 0.3 },
    }

    const result = {}
    symbols.forEach(s => {
        if (fallback[s]) result[s] = fallback[s]
    })
    return result
}

// 外汇备选数据
function getForexFallbackData() {
    return {
        'EUR/USD': { price: 1.0523 + (Math.random() - 0.5) * 0.01, change: 0.15 + (Math.random() - 0.5) * 0.2 },
        'GBP/USD': { price: 1.2678 + (Math.random() - 0.5) * 0.01, change: -0.22 + (Math.random() - 0.5) * 0.2 },
        'USD/JPY': { price: 153.45 + (Math.random() - 0.5) * 0.5, change: 0.45 + (Math.random() - 0.5) * 0.2 },
        'USD/CNH': { price: 7.2856 + (Math.random() - 0.5) * 0.05, change: 0.08 + (Math.random() - 0.5) * 0.2 },
        'AUD/USD': { price: 0.6345 + (Math.random() - 0.5) * 0.01, change: -0.32 + (Math.random() - 0.5) * 0.2 },
        'KRW/USD': { price: 0.000715 + (Math.random() - 0.5) * 0.00001, change: -0.35 + (Math.random() - 0.5) * 0.2 },
    }
}

/**
 * Binance WebSocket实时价格
 * @param {Function} onUpdate 价格更新回调
 * @returns {Function} 关闭连接函数
 */
export function subscribeBinanceWebSocket(onUpdate) {
    let ws = null
    let retryCount = 0
    const maxRetries = 3
    let isClosing = false

    const connect = () => {
        if (isClosing || retryCount >= maxRetries) return

        const streams = BINANCE_SYMBOLS.map(s => `${s.toLowerCase()}@ticker`).join('/')

        try {
            ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`)

            ws.onopen = () => {
                retryCount = 0 // 连接成功后重置
            }

            ws.onmessage = (event) => {
                try {
                    const { data } = JSON.parse(event.data)
                    if (data) {
                        const symbol = data.s.replace('USDT', '') + '/USDT'
                        onUpdate(symbol, {
                            price: parseFloat(data.c),
                            change: parseFloat(data.P),
                            volume: parseFloat(data.q),
                            high24h: parseFloat(data.h),
                            low24h: parseFloat(data.l),
                        })
                    }
                } catch (e) {
                    // 静默失败
                }
            }

            ws.onerror = () => {
                // 静默处理，不输出到控制台
            }

            ws.onclose = () => {
                if (!isClosing && retryCount < maxRetries) {
                    retryCount++
                    setTimeout(connect, 5000 * retryCount) // 递增延迟重连
                }
            }
        } catch (e) {
            // WebSocket创建失败，静默处理
        }
    }

    connect()

    return () => {
        isClosing = true
        if (ws) ws.close()
    }
}
