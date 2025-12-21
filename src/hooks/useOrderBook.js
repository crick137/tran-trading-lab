/**
 * 实时订单簿数据Hook
 * Real-time Order Book WebSocket
 */
import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 订单簿Hook
 * @param {string} symbol - 交易对，如 'BTCUSDT'
 * @param {number} depth - 深度等级 (5, 10, 20)
 */
export function useOrderBook(symbol = 'BTCUSDT', depth = 10) {
    const [orderBook, setOrderBook] = useState({
        asks: [],
        bids: [],
        lastUpdateId: 0,
        spread: 0,
        spreadPercent: 0,
    })
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState(null)
    const wsRef = useRef(null)
    const reconnectCountRef = useRef(0)
    const maxReconnects = 3

    // 格式化价格
    const formatPrice = useCallback((price) => {
        const p = parseFloat(price)
        if (p >= 1000) return p.toFixed(2)
        if (p >= 1) return p.toFixed(4)
        return p.toFixed(6)
    }, [])

    // 格式化数量
    const formatSize = useCallback((size) => {
        const s = parseFloat(size)
        if (s >= 1000) return (s / 1000).toFixed(2) + 'K'
        if (s >= 1) return s.toFixed(4)
        return s.toFixed(6)
    }, [])

    // 处理订单簿数据
    const processOrderBook = useCallback((data) => {
        const asks = data.asks.slice(0, depth).map((ask, i) => {
            const price = parseFloat(ask[0])
            const size = parseFloat(ask[1])
            const total = data.asks.slice(0, i + 1).reduce((acc, a) => acc + parseFloat(a[1]), 0)
            return {
                price: formatPrice(price),
                size: formatSize(size),
                total: formatSize(total),
                rawPrice: price,
                rawSize: size,
                rawTotal: total,
            }
        }).reverse() // 卖单从低到高

        const bids = data.bids.slice(0, depth).map((bid, i) => {
            const price = parseFloat(bid[0])
            const size = parseFloat(bid[1])
            const total = data.bids.slice(0, i + 1).reduce((acc, b) => acc + parseFloat(b[1]), 0)
            return {
                price: formatPrice(price),
                size: formatSize(size),
                total: formatSize(total),
                rawPrice: price,
                rawSize: size,
                rawTotal: total,
            }
        })

        // 计算spread
        const bestAsk = data.asks[0] ? parseFloat(data.asks[0][0]) : 0
        const bestBid = data.bids[0] ? parseFloat(data.bids[0][0]) : 0
        const spread = bestAsk - bestBid
        const spreadPercent = bestBid > 0 ? (spread / bestBid) * 100 : 0

        setOrderBook({
            asks,
            bids,
            lastUpdateId: data.lastUpdateId,
            spread: spread.toFixed(2),
            spreadPercent: spreadPercent.toFixed(4),
            bestAsk: formatPrice(bestAsk),
            bestBid: formatPrice(bestBid),
        })
    }, [depth, formatPrice, formatSize])

    // 连接WebSocket
    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return

        const cleanSymbol = symbol.replace('/', '').toUpperCase()
        const wsUrl = `wss://stream.binance.com:9443/ws/${cleanSymbol.toLowerCase()}@depth${depth}@100ms`

        try {
            wsRef.current = new WebSocket(wsUrl)

            wsRef.current.onopen = () => {
                setConnected(true)
                setError(null)
                reconnectCountRef.current = 0
            }

            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    if (data.asks && data.bids) {
                        processOrderBook(data)
                    }
                } catch (e) {
                    // 忽略解析错误
                }
            }

            wsRef.current.onerror = () => {
                setError('WebSocket connection error')
            }

            wsRef.current.onclose = () => {
                setConnected(false)
                // 自动重连
                if (reconnectCountRef.current < maxReconnects) {
                    reconnectCountRef.current++
                    setTimeout(connect, 3000 * reconnectCountRef.current)
                }
            }
        } catch (e) {
            setError(e.message)
        }
    }, [symbol, depth, processOrderBook])

    // 断开连接
    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
    }, [])

    useEffect(() => {
        connect()
        return disconnect
    }, [symbol, depth])

    return {
        ...orderBook,
        connected,
        error,
        reconnect: connect,
    }
}

/**
 * 实时成交流Hook
 * @param {string} symbol - 交易对
 * @param {number} limit - 保留的成交记录数
 */
export function useTrades(symbol = 'BTCUSDT', limit = 30) {
    const [trades, setTrades] = useState([])
    const [connected, setConnected] = useState(false)
    const [lastPrice, setLastPrice] = useState(0)
    const [priceDirection, setPriceDirection] = useState(null) // 'up' | 'down'
    const wsRef = useRef(null)
    const tradesRef = useRef([])
    const lastPriceRef = useRef(0)

    // 格式化时间
    const formatTime = useCallback((timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }, [])

    // 处理成交数据
    const processTrade = useCallback((data) => {
        const trade = {
            id: data.t,
            price: parseFloat(data.p),
            size: parseFloat(data.q),
            time: formatTime(data.T),
            timestamp: data.T,
            side: data.m ? 'sell' : 'buy', // m=true表示卖方是maker
            value: parseFloat(data.p) * parseFloat(data.q),
        }

        // 更新价格方向
        if (lastPriceRef.current !== 0) {
            setPriceDirection(trade.price > lastPriceRef.current ? 'up' : trade.price < lastPriceRef.current ? 'down' : null)
        }
        lastPriceRef.current = trade.price
        setLastPrice(trade.price)

        // 添加到列表
        tradesRef.current = [trade, ...tradesRef.current].slice(0, limit)
        setTrades([...tradesRef.current])
    }, [formatTime, limit])

    // 连接WebSocket
    useEffect(() => {
        const cleanSymbol = symbol.replace('/', '').toUpperCase()
        const wsUrl = `wss://stream.binance.com:9443/ws/${cleanSymbol.toLowerCase()}@trade`

        try {
            wsRef.current = new WebSocket(wsUrl)

            wsRef.current.onopen = () => {
                setConnected(true)
            }

            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    if (data.e === 'trade') {
                        processTrade(data)
                    }
                } catch (e) {
                    // 忽略解析错误
                }
            }

            wsRef.current.onclose = () => {
                setConnected(false)
            }
        } catch (e) {
            console.warn('Trades WebSocket error:', e)
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close()
                wsRef.current = null
            }
        }
    }, [symbol, processTrade])

    return {
        trades,
        connected,
        lastPrice,
        priceDirection,
    }
}

/**
 * 聚合行情数据Hook（价格 + 订单簿 + 成交）
 */
export function useMarketDepth(symbol = 'BTCUSDT') {
    const orderBook = useOrderBook(symbol)
    const tradesData = useTrades(symbol)

    return {
        orderBook,
        trades: tradesData.trades,
        connected: orderBook.connected && tradesData.connected,
        lastPrice: tradesData.lastPrice,
        priceDirection: tradesData.priceDirection,
    }
}

export default useOrderBook
