import { useState, useEffect, useCallback, useMemo } from 'react'

// 初始虚拟资金
const INITIAL_BALANCE = 100000

// 订单状态
export const ORDER_STATUS = {
    PENDING: 'pending',     // 挂单中
    FILLED: 'filled',       // 已成交
    CANCELLED: 'cancelled', // 已取消
    PARTIAL: 'partial',     // 部分成交
}

// 订单类型
export const ORDER_TYPE = {
    MARKET: 'market',       // 市价单
    LIMIT: 'limit',         // 限价单
    STOP_LOSS: 'stop_loss', // 止损单
    TAKE_PROFIT: 'take_profit', // 止盈单
}

/**
 * 专业交易模拟器Hook
 * 提供完整的交易功能：多种订单、持仓管理、风控、历史记录
 */
export function useTradingSimulator() {
    // 从localStorage加载状态
    const loadState = () => {
        try {
            const saved = localStorage.getItem('trading_simulator_v2')
            if (saved) return JSON.parse(saved)
        } catch (e) { }
        return {
            balance: INITIAL_BALANCE,
            positions: [],
            orders: [],      // 挂单
            history: [],     // 历史交易
            stats: {
                totalTrades: 0,
                winningTrades: 0,
                losingTrades: 0,
                totalPnl: 0,
                maxDrawdown: 0,
                bestTrade: 0,
                worstTrade: 0,
            }
        }
    }

    const [state, setState] = useState(loadState)
    const { balance, positions, orders, history, stats } = state

    // 保存到localStorage
    useEffect(() => {
        localStorage.setItem('trading_simulator_v2', JSON.stringify(state))
    }, [state])

    // 获取当前价格（从外部传入）
    const [currentPrices, setCurrentPrices] = useState({})

    // 更新价格
    const updatePrices = useCallback((prices) => {
        setCurrentPrices(prices)
    }, [])

    // ===================== 订单管理 =====================

    // 创建订单
    const createOrder = useCallback((params) => {
        const {
            symbol,
            side,           // 'long' | 'short'
            size,
            price,          // 当前价格或限价
            orderType = ORDER_TYPE.MARKET,
            leverage = 1,
            stopLoss,
            takeProfit,
            limitPrice,     // 限价单价格
        } = params

        // 验证输入
        if (!symbol || !side || !size || size <= 0) {
            return { success: false, error: '参数无效' }
        }

        const margin = (size * price) / leverage
        if (margin > state.balance) {
            return { success: false, error: '余额不足' }
        }

        const order = {
            id: Date.now(),
            symbol,
            side,
            size,
            price: orderType === ORDER_TYPE.LIMIT ? limitPrice : price,
            orderType,
            leverage,
            margin,
            stopLoss,
            takeProfit,
            status: orderType === ORDER_TYPE.MARKET ? ORDER_STATUS.FILLED : ORDER_STATUS.PENDING,
            createTime: new Date().toISOString(),
            fillTime: orderType === ORDER_TYPE.MARKET ? new Date().toISOString() : null,
        }

        // 市价单立即成交
        if (orderType === ORDER_TYPE.MARKET) {
            const position = {
                id: order.id,
                symbol,
                side,
                size,
                entryPrice: price,
                leverage,
                margin,
                stopLoss,
                takeProfit,
                openTime: new Date().toISOString(),
                pnl: 0,
                roe: 0,
            }

            setState(prev => ({
                ...prev,
                balance: prev.balance - margin,
                positions: [...prev.positions, position],
                stats: {
                    ...prev.stats,
                    totalTrades: prev.stats.totalTrades + 1,
                }
            }))

            return { success: true, position, order }
        }

        // 限价单/止损单添加到挂单列表
        setState(prev => ({
            ...prev,
            orders: [...prev.orders, order],
        }))

        return { success: true, order }
    }, [state.balance])

    // 开仓 (简化版市价单)
    const openPosition = useCallback((params) => {
        return createOrder({ ...params, orderType: ORDER_TYPE.MARKET })
    }, [createOrder])

    // 取消挂单
    const cancelOrder = useCallback((orderId) => {
        const order = state.orders.find(o => o.id === orderId)
        if (!order) return { success: false, error: '订单不存在' }

        setState(prev => ({
            ...prev,
            orders: prev.orders.filter(o => o.id !== orderId),
        }))

        return { success: true }
    }, [state.orders])

    // ===================== 持仓管理 =====================

    // 平仓
    const closePosition = useCallback((positionId, currentPrice, closeSize = null) => {
        const position = state.positions.find(p => p.id === positionId)
        if (!position) return { success: false, error: '持仓不存在' }

        // 部分平仓或全部平仓
        const sizeToClose = closeSize || position.size
        if (sizeToClose > position.size) {
            return { success: false, error: '平仓数量超过持仓' }
        }

        const isPartial = sizeToClose < position.size
        const ratio = sizeToClose / position.size

        const priceDiff = currentPrice - position.entryPrice
        const pnl = position.side === 'long'
            ? priceDiff * sizeToClose * position.leverage
            : -priceDiff * sizeToClose * position.leverage

        const marginToReturn = position.margin * ratio

        // 统计更新
        const isWin = pnl > 0

        const historyItem = {
            ...position,
            closePrice: currentPrice,
            closeTime: new Date().toISOString(),
            realizedPnl: pnl,
            closedSize: sizeToClose,
        }

        setState(prev => {
            const newBalance = prev.balance + marginToReturn + pnl
            const newStats = {
                ...prev.stats,
                totalPnl: prev.stats.totalPnl + pnl,
                winningTrades: isWin ? prev.stats.winningTrades + 1 : prev.stats.winningTrades,
                losingTrades: !isWin ? prev.stats.losingTrades + 1 : prev.stats.losingTrades,
                bestTrade: Math.max(prev.stats.bestTrade, pnl),
                worstTrade: Math.min(prev.stats.worstTrade, pnl),
            }

            // 部分平仓：更新持仓
            // 全部平仓：移除持仓
            const newPositions = isPartial
                ? prev.positions.map(p => p.id === positionId ? {
                    ...p,
                    size: p.size - sizeToClose,
                    margin: p.margin - marginToReturn,
                } : p)
                : prev.positions.filter(p => p.id !== positionId)

            return {
                ...prev,
                balance: newBalance,
                positions: newPositions,
                history: [historyItem, ...prev.history].slice(0, 100),
                stats: newStats,
            }
        })

        return { success: true, pnl, isPartial }
    }, [state.positions])

    // 修改止损止盈
    const modifyPosition = useCallback((positionId, { stopLoss, takeProfit }) => {
        const position = state.positions.find(p => p.id === positionId)
        if (!position) return { success: false, error: '持仓不存在' }

        setState(prev => ({
            ...prev,
            positions: prev.positions.map(p => p.id === positionId ? {
                ...p,
                stopLoss: stopLoss !== undefined ? stopLoss : p.stopLoss,
                takeProfit: takeProfit !== undefined ? takeProfit : p.takeProfit,
            } : p)
        }))

        return { success: true }
    }, [state.positions])

    // 检查止损止盈触发
    const checkStopLossTakeProfit = useCallback((prices) => {
        const triggeredPositions = []

        state.positions.forEach(position => {
            const currentPrice = prices[position.symbol]
            if (!currentPrice) return

            // 检查止损
            if (position.stopLoss) {
                const slTriggered = position.side === 'long'
                    ? currentPrice <= position.stopLoss
                    : currentPrice >= position.stopLoss

                if (slTriggered) {
                    triggeredPositions.push({ position, type: 'sl', price: currentPrice })
                }
            }

            // 检查止盈
            if (position.takeProfit) {
                const tpTriggered = position.side === 'long'
                    ? currentPrice >= position.takeProfit
                    : currentPrice <= position.takeProfit

                if (tpTriggered) {
                    triggeredPositions.push({ position, type: 'tp', price: currentPrice })
                }
            }
        })

        // 自动平仓
        triggeredPositions.forEach(({ position, type, price }) => {
            closePosition(position.id, price)
            console.log(`🔔 ${type === 'sl' ? '止损' : '止盈'}触发: ${position.symbol} @ ${price}`)
        })

        return triggeredPositions
    }, [state.positions, closePosition])

    // ===================== 账户管理 =====================

    // 更新持仓盈亏
    const updatePositionsPnl = useCallback((prices) => {
        setState(prev => ({
            ...prev,
            positions: prev.positions.map(pos => {
                const currentPrice = prices[pos.symbol]
                if (!currentPrice) return pos

                const priceDiff = currentPrice - pos.entryPrice
                const pnl = pos.side === 'long'
                    ? priceDiff * pos.size * pos.leverage
                    : -priceDiff * pos.size * pos.leverage
                const roe = (pnl / pos.margin) * 100

                return { ...pos, pnl, roe, currentPrice }
            })
        }))

        // 同时检查止损止盈
        checkStopLossTakeProfit(prices)
    }, [checkStopLossTakeProfit])

    // 重置账户
    const resetAccount = useCallback(() => {
        setState({
            balance: INITIAL_BALANCE,
            positions: [],
            orders: [],
            history: [],
            stats: {
                totalTrades: 0,
                winningTrades: 0,
                losingTrades: 0,
                totalPnl: 0,
                maxDrawdown: 0,
                bestTrade: 0,
                worstTrade: 0,
            }
        })
    }, [])

    // 计算总资产
    const equity = useMemo(() => {
        return balance + positions.reduce((sum, p) => sum + p.margin + p.pnl, 0)
    }, [balance, positions])

    const unrealizedPnl = useMemo(() => {
        return positions.reduce((sum, p) => sum + p.pnl, 0)
    }, [positions])

    const usedMargin = useMemo(() => {
        return positions.reduce((sum, p) => sum + p.margin, 0)
    }, [positions])

    const availableBalance = useMemo(() => {
        return balance
    }, [balance])

    const winRate = useMemo(() => {
        const total = stats.winningTrades + stats.losingTrades
        return total > 0 ? (stats.winningTrades / total * 100).toFixed(1) : 0
    }, [stats])

    return {
        // 账户状态
        balance,
        equity,
        availableBalance,
        usedMargin,
        unrealizedPnl,
        positions,
        orders,
        history,
        stats,
        winRate,

        // 订单操作
        createOrder,
        openPosition,
        cancelOrder,

        // 持仓操作
        closePosition,
        modifyPosition,
        updatePositionsPnl,

        // 账户操作
        resetAccount,
        updatePrices,
        checkStopLossTakeProfit,
    }
}

export default useTradingSimulator
