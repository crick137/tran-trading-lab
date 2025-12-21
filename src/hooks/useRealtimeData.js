import React, { useState, useEffect, useRef } from 'react'

// Real-time market data simulation hook
export function useRealtimeData() {
    const [indicators, setIndicators] = useState({
        btcPrice: 100850,
        btcChange: 2.45,
        ethPrice: 3820,
        ethChange: 1.85,
        fearGreed: 72,
        fearGreedLabel: '탐욕',
        btcDominance: 52.3,
        totalMarketCap: '$3.52T',
        volume24h: '$128.5B',
    })

    const [orders, setOrders] = useState([])
    const [currentTime, setCurrentTime] = useState(new Date())

    // Generate random order flow
    const generateOrder = () => {
        const types = ['buy', 'sell']
        const basePrice = indicators.btcPrice
        return {
            time: new Date().toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            type: types[Math.floor(Math.random() * types.length)],
            size: Math.random() * 2 + 0.1,
            price: basePrice + (Math.random() - 0.5) * 200,
        }
    }

    // Update time every second
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timeInterval)
    }, [])

    // Update prices every 2 seconds
    useEffect(() => {
        const priceInterval = setInterval(() => {
            setIndicators(prev => {
                const btcDelta = (Math.random() - 0.5) * 150
                const ethDelta = (Math.random() - 0.5) * 25
                const newBtcPrice = prev.btcPrice + btcDelta
                const newEthPrice = prev.ethPrice + ethDelta

                return {
                    ...prev,
                    btcPrice: Math.round(newBtcPrice),
                    btcChange: parseFloat((((newBtcPrice - 98500) / 98500) * 100).toFixed(2)),
                    ethPrice: Math.round(newEthPrice),
                    ethChange: parseFloat((((newEthPrice - 3750) / 3750) * 100).toFixed(2)),
                    fearGreed: Math.max(1, Math.min(100, prev.fearGreed + Math.round((Math.random() - 0.5) * 3))),
                    fearGreedLabel: prev.fearGreed > 75 ? '극단적 탐욕' :
                        prev.fearGreed > 55 ? '탐욕' :
                            prev.fearGreed > 45 ? '중립' :
                                prev.fearGreed > 25 ? '공포' : '극단적 공포',
                    btcDominance: parseFloat((prev.btcDominance + (Math.random() - 0.5) * 0.2).toFixed(1)),
                }
            })
        }, 2000)
        return () => clearInterval(priceInterval)
    }, [])

    // Generate orders every 500ms
    useEffect(() => {
        const orderInterval = setInterval(() => {
            setOrders(prev => {
                const newOrder = generateOrder()
                return [newOrder, ...prev].slice(0, 50)
            })
        }, 500)
        return () => clearInterval(orderInterval)
    }, [indicators])

    // Format time
    const formatTime = (date) => {
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        })
    }

    // Format date
    const formatDate = (date) => {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    }

    return {
        indicators,
        orders,
        currentTime,
        formatTime,
        formatDate,
    }
}

// Risk/Reward Calculator Hook
export function useRiskReward() {
    const [inputs, setInputs] = useState({
        entryPrice: '',
        stopLoss: '',
        takeProfit: '',
        positionSize: '',
        accountBalance: '',
        riskPercent: '',
    })

    const [results, setResults] = useState({
        riskAmount: 0,
        rewardAmount: 0,
        riskRewardRatio: 0,
        recommendedSize: 0,
        potentialProfit: 0,
        potentialLoss: 0,
    })

    const updateInput = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }))
    }

    // Calculate on input change
    useEffect(() => {
        const entry = parseFloat(inputs.entryPrice) || 0
        const sl = parseFloat(inputs.stopLoss) || 0
        const tp = parseFloat(inputs.takeProfit) || 0
        const size = parseFloat(inputs.positionSize) || 0
        const balance = parseFloat(inputs.accountBalance) || 0
        const riskPct = parseFloat(inputs.riskPercent) || 0

        if (entry && sl && tp) {
            const risk = Math.abs(entry - sl)
            const reward = Math.abs(tp - entry)
            const ratio = risk > 0 ? (reward / risk) : 0

            const riskAmountUSD = risk * size
            const rewardAmountUSD = reward * size

            const maxRiskAmount = balance * (riskPct / 100)
            const recommendedSize = risk > 0 ? (maxRiskAmount / risk) : 0

            setResults({
                riskAmount: riskAmountUSD,
                rewardAmount: rewardAmountUSD,
                riskRewardRatio: ratio,
                recommendedSize: recommendedSize,
                potentialProfit: rewardAmountUSD,
                potentialLoss: riskAmountUSD,
            })
        }
    }, [inputs])

    return {
        inputs,
        results,
        updateInput,
    }
}

export default useRealtimeData
