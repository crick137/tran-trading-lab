import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

/**
 * ORB (Opening Range Breakout) 分析 Hook
 * 实现开盘范围突破策略的核心逻辑
 */
export function useORBAnalysis(marketData, selectedSymbol) {
    // ORB 配置
    const [config, setConfig] = useState({
        orbMinutes: 15,           // ORB时间窗口（5/15/30/60分钟）
        breakoutBuffer: 0.2,      // 突破缓冲区 (%)
        atrMultiplier: 1.5,       // ATR止损倍数
        showTP1: true,
        showTP2: true,
        showTP3: false,
    })

    // ORB 状态
    const [orbState, setOrbState] = useState({
        high: null,
        low: null,
        mid: null,
        range: null,
        rangePct: null,
        isBuilding: true,
        isComplete: false,
        completionTime: null,
        breakoutUp: false,
        breakoutDown: false,
        breakoutPrice: null,
        breakoutTime: null,
        cyclesUp: 0,
        cyclesDown: 0,
        retests: 0,
    })

    // 交易信号
    const [signals, setSignals] = useState([])

    // 目标价和止损
    const [targets, setTargets] = useState({
        entry: null,
        sl: null,
        tp1: null,
        tp2: null,
        tp3: null,
        riskReward: null,
    })

    // 会话统计
    const [stats, setStats] = useState({
        totalBreakouts: 0,
        successfulBreakouts: 0,
        failedBreakouts: 0,
        winRate: 0,
        bestR: 0,
        worstR: 0,
    })

    // 用于追踪上一次的symbol
    const prevSymbolRef = useRef(selectedSymbol)

    // 获取当前选中的市场数据
    const currentData = useMemo(() => {
        if (!marketData || !selectedSymbol) return null
        return marketData.find(m => m.symbol === selectedSymbol)
    }, [marketData, selectedSymbol])

    // 当选中的品种变化时，重置ORB
    useEffect(() => {
        if (prevSymbolRef.current !== selectedSymbol) {
            prevSymbolRef.current = selectedSymbol
            // 重置状态
            setOrbState({
                high: null,
                low: null,
                mid: null,
                range: null,
                rangePct: null,
                isBuilding: true,
                isComplete: false,
                completionTime: null,
                breakoutUp: false,
                breakoutDown: false,
                breakoutPrice: null,
                breakoutTime: null,
                cyclesUp: 0,
                cyclesDown: 0,
                retests: 0,
            })
            setSignals([])
            setTargets({
                entry: null,
                sl: null,
                tp1: null,
                tp2: null,
                tp3: null,
                riskReward: null,
            })
        }
    }, [selectedSymbol])

    // 主更新逻辑
    useEffect(() => {
        if (!currentData) return

        const price = currentData.price

        // 如果ORB仍在构建中，模拟ORB范围
        if (orbState.isBuilding) {
            // 模拟ORB范围（实际应用中应使用历史K线数据）
            const volatility = 0.015 // 1.5%波动
            const high = price * (1 + volatility)
            const low = price * (1 - volatility)
            const mid = (high + low) / 2
            const range = high - low
            const rangePct = (range / low) * 100

            setOrbState(prev => ({
                ...prev,
                high,
                low,
                mid,
                range,
                rangePct,
                isComplete: true,
                isBuilding: false,
                completionTime: new Date().toLocaleTimeString(),
            }))
        }

        // 检测突破
        if (orbState.isComplete && !orbState.breakoutUp && !orbState.breakoutDown) {
            const buffer = orbState.high * (config.breakoutBuffer / 100)

            let breakout = null
            if (price > orbState.high + buffer) {
                breakout = { direction: 'up', level: orbState.high }
            } else if (price < orbState.low - buffer) {
                breakout = { direction: 'down', level: orbState.low }
            }

            if (breakout) {
                const isBullish = breakout.direction === 'up'
                const atr = price * 0.02 // 简化ATR
                const multiplier = config.atrMultiplier
                const sl = isBullish ? price - (atr * multiplier) : price + (atr * multiplier)
                const risk = Math.abs(price - sl)
                const tp1 = isBullish ? price + risk : price - risk
                const tp2 = isBullish ? price + (risk * 2) : price - (risk * 2)
                const tp3 = isBullish ? price + (risk * 3) : price - (risk * 3)
                const reward = Math.abs(tp2 - price)

                setOrbState(prev => ({
                    ...prev,
                    breakoutUp: isBullish,
                    breakoutDown: !isBullish,
                    breakoutPrice: price,
                    breakoutTime: new Date().toLocaleTimeString(),
                    cyclesUp: isBullish ? prev.cyclesUp + 1 : prev.cyclesUp,
                    cyclesDown: !isBullish ? prev.cyclesDown + 1 : prev.cyclesDown,
                }))

                setTargets({
                    entry: price,
                    sl,
                    tp1,
                    tp2,
                    tp3,
                    riskReward: (reward / risk).toFixed(2),
                })

                const signal = {
                    id: Date.now(),
                    type: 'breakout',
                    direction: breakout.direction,
                    price,
                    time: new Date().toLocaleTimeString(),
                    sl,
                    tp1,
                    tp2,
                }
                setSignals(prev => [signal, ...prev].slice(0, 10))

                setStats(prev => ({
                    ...prev,
                    totalBreakouts: prev.totalBreakouts + 1,
                }))
            }
        }
    }, [currentData, orbState.isBuilding, orbState.isComplete, orbState.high, orbState.low,
        orbState.breakoutUp, orbState.breakoutDown, config.breakoutBuffer, config.atrMultiplier])

    // 更新配置
    const updateConfig = useCallback((newConfig) => {
        setConfig(prev => ({ ...prev, ...newConfig }))
    }, [])

    // 重置ORB
    const resetORB = useCallback(() => {
        setOrbState({
            high: null,
            low: null,
            mid: null,
            range: null,
            rangePct: null,
            isBuilding: true,
            isComplete: false,
            completionTime: null,
            breakoutUp: false,
            breakoutDown: false,
            breakoutPrice: null,
            breakoutTime: null,
            cyclesUp: 0,
            cyclesDown: 0,
            retests: 0,
        })
        setSignals([])
        setTargets({
            entry: null,
            sl: null,
            tp1: null,
            tp2: null,
            tp3: null,
            riskReward: null,
        })
    }, [])

    // 获取当前状态描述
    const getStatusText = useCallback(() => {
        if (orbState.isBuilding) return '构建中...'
        if (!orbState.isComplete) return '等待开盘'
        if (orbState.breakoutUp) return '上突破'
        if (orbState.breakoutDown) return '下突破'
        return '范围内'
    }, [orbState.isBuilding, orbState.isComplete, orbState.breakoutUp, orbState.breakoutDown])

    // 获取风险评估
    const getRiskAssessment = useCallback(() => {
        if (!targets.riskReward) return null
        const rr = parseFloat(targets.riskReward)
        if (rr >= 2) return { level: 'good', text: '良好', color: '#00ff88' }
        if (rr >= 1.5) return { level: 'acceptable', text: '可接受', color: '#fbbf24' }
        return { level: 'poor', text: '不佳', color: '#ff4466' }
    }, [targets.riskReward])

    // 计算属性
    const hasBreakout = orbState.breakoutUp || orbState.breakoutDown
    const isLong = orbState.breakoutUp
    const isShort = orbState.breakoutDown

    return {
        // 状态
        orbState,
        signals,
        targets,
        stats,
        config,
        currentData,

        // 方法
        updateConfig,
        resetORB,
        getStatusText,
        getRiskAssessment,

        // 计算属性
        hasBreakout,
        isLong,
        isShort,
    }
}

export default useORBAnalysis
