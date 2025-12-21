import { useState, useEffect, useCallback } from 'react'
import { fetchAllMarketData, fetchBinancePrices, subscribeBinanceWebSocket } from '../lib/marketApi'

/**
 * 实时市场数据Hook
 * 自动获取并更新所有市场数据
 */
export function useMarketData() {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastUpdate, setLastUpdate] = useState(null)

    // 初始加载所有数据
    useEffect(() => {
        let mounted = true

        const loadData = async () => {
            try {
                const allData = await fetchAllMarketData()
                if (mounted) {
                    setData(allData)
                    setLastUpdate(new Date())
                    setLoading(false)
                }
            } catch (err) {
                if (mounted) {
                    setError(err.message)
                    setLoading(false)
                }
            }
        }

        loadData()

        // 每30秒刷新非WebSocket数据（股指、外汇、商品）
        const interval = setInterval(loadData, 30000)

        return () => {
            mounted = false
            clearInterval(interval)
        }
    }, [])

    // Binance WebSocket实时更新加密货币
    useEffect(() => {
        const unsubscribe = subscribeBinanceWebSocket((symbol, priceData) => {
            setData(prev => ({
                ...prev,
                [symbol]: { ...prev[symbol], ...priceData }
            }))
            setLastUpdate(new Date())
        })

        return unsubscribe
    }, [])

    // 获取特定品种的价格
    const getPrice = useCallback((symbol) => {
        return data[symbol] || null
    }, [data])

    // 获取所有价格的数组格式
    const getAllPrices = useCallback(() => {
        return Object.entries(data).map(([symbol, info]) => ({
            symbol,
            ...info
        }))
    }, [data])

    return {
        data,
        loading,
        error,
        lastUpdate,
        getPrice,
        getAllPrices,
    }
}

/**
 * 仅加密货币实时数据Hook
 */
export function useCryptoData() {
    const [prices, setPrices] = useState({})

    useEffect(() => {
        // 初始加载
        fetchBinancePrices().then(setPrices)

        // WebSocket实时更新
        const unsubscribe = subscribeBinanceWebSocket((symbol, priceData) => {
            setPrices(prev => ({
                ...prev,
                [symbol]: priceData
            }))
        })

        return unsubscribe
    }, [])

    return prices
}

export default useMarketData
