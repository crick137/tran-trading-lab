import React, { useState, useEffect, memo, useMemo } from 'react'
import {
    ComposedChart, Line, Area, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, ReferenceLine, Brush
} from 'recharts'
import { RefreshCw, TrendingUp, TrendingDown, Settings, Layers } from 'lucide-react'

const PROXY_URL = import.meta.env.DEV ? 'http://localhost:3001' : ''

/**
 * TRAN自研专业K线图
 * 支持: 技术指标 (MA, EMA, RSI, MACD)、实时数据、自定义策略
 */
const TranChart = memo(function TranChart({
    symbol = 'BTCUSDT',
    interval = '1h',
    indicators = ['MA20', 'MA50'],  // 可启用的指标
    onSignal = null  // 策略信号回调
}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showIndicatorPanel, setShowIndicatorPanel] = useState(false)
    const [activeIndicators, setActiveIndicators] = useState(indicators)

    // 获取K线数据（通过代理）
    const fetchKlines = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `${PROXY_URL}/api/binance/klines?symbol=${symbol}&interval=${interval}&limit=200`
            )

            if (!response.ok) throw new Error(`HTTP ${response.status}`)

            const result = await response.json()

            if (!result.success) throw new Error(result.error)

            // 计算技术指标
            const enrichedData = calculateIndicators(result.data)
            setData(enrichedData)

            // 调用策略信号
            if (onSignal && enrichedData.length > 0) {
                const latest = enrichedData[enrichedData.length - 1]
                onSignal(latest)
            }
        } catch (err) {
            console.error('Chart fetch error:', err)
            setError(err.message)
        }

        setLoading(false)
    }

    // 计算技术指标
    const calculateIndicators = (rawData) => {
        if (!rawData || rawData.length === 0) return []

        return rawData.map((d, i, arr) => {
            const result = {
                ...d,
                timeStr: new Date(d.time).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
            }

            // MA (Simple Moving Average)
            if (activeIndicators.includes('MA20')) {
                result.ma20 = calculateMA(arr, i, 20)
            }
            if (activeIndicators.includes('MA50')) {
                result.ma50 = calculateMA(arr, i, 50)
            }
            if (activeIndicators.includes('MA200')) {
                result.ma200 = calculateMA(arr, i, 200)
            }

            // EMA (Exponential Moving Average)
            if (activeIndicators.includes('EMA12')) {
                result.ema12 = calculateEMA(arr, i, 12)
            }
            if (activeIndicators.includes('EMA26')) {
                result.ema26 = calculateEMA(arr, i, 26)
            }

            // Bollinger Bands
            if (activeIndicators.includes('BB')) {
                const bb = calculateBollingerBands(arr, i, 20)
                result.bbUpper = bb.upper
                result.bbMiddle = bb.middle
                result.bbLower = bb.lower
            }

            return result
        })
    }

    // MA 计算
    const calculateMA = (data, index, period) => {
        if (index < period - 1) return null
        let sum = 0
        for (let i = index - period + 1; i <= index; i++) {
            sum += data[i].close
        }
        return sum / period
    }

    // EMA 计算
    const calculateEMA = (data, index, period) => {
        if (index < period - 1) return null
        const multiplier = 2 / (period + 1)

        // 首次计算使用 SMA
        if (index === period - 1) {
            return calculateMA(data, index, period)
        }

        const prevEMA = calculateEMA(data, index - 1, period)
        if (prevEMA === null) return null

        return (data[index].close - prevEMA) * multiplier + prevEMA
    }

    // Bollinger Bands 计算
    const calculateBollingerBands = (data, index, period) => {
        if (index < period - 1) return { upper: null, middle: null, lower: null }

        const ma = calculateMA(data, index, period)
        let variance = 0
        for (let i = index - period + 1; i <= index; i++) {
            variance += Math.pow(data[i].close - ma, 2)
        }
        const stdDev = Math.sqrt(variance / period)

        return {
            upper: ma + stdDev * 2,
            middle: ma,
            lower: ma - stdDev * 2
        }
    }

    useEffect(() => {
        fetchKlines()
        const timer = setInterval(fetchKlines, 30000)
        return () => clearInterval(timer)
    }, [symbol, interval, activeIndicators.join(',')])

    // 计算价格变化
    const priceInfo = useMemo(() => {
        if (data.length < 2) return { price: 0, change: 0 }
        const latest = data[data.length - 1]
        const first = data[0]
        const change = ((latest.close - first.open) / first.open) * 100
        return { price: latest.close, change }
    }, [data])

    // 指标列表
    const availableIndicators = [
        { id: 'MA20', name: 'MA 20', color: '#fbbf24' },
        { id: 'MA50', name: 'MA 50', color: '#60a5fa' },
        { id: 'MA200', name: 'MA 200', color: '#f472b6' },
        { id: 'EMA12', name: 'EMA 12', color: '#34d399' },
        { id: 'EMA26', name: 'EMA 26', color: '#a78bfa' },
        { id: 'BB', name: 'Bollinger Bands', color: '#94a3b8' },
    ]

    const toggleIndicator = (id) => {
        setActiveIndicators(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        )
    }

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null
        const d = payload[0].payload

        return (
            <div style={styles.tooltip}>
                <div style={styles.tooltipTime}>{d.timeStr}</div>
                <div style={styles.tooltipGrid}>
                    <span style={{ color: '#94a3b8' }}>O</span>
                    <span>${d.open?.toLocaleString()}</span>
                    <span style={{ color: '#00ff88' }}>H</span>
                    <span style={{ color: '#00ff88' }}>${d.high?.toLocaleString()}</span>
                    <span style={{ color: '#ff4757' }}>L</span>
                    <span style={{ color: '#ff4757' }}>${d.low?.toLocaleString()}</span>
                    <span style={{ color: '#0ea5e9' }}>C</span>
                    <span style={{ color: '#0ea5e9' }}>${d.close?.toLocaleString()}</span>
                </div>
                {d.ma20 && <div style={styles.tooltipIndicator}><span style={{ color: '#fbbf24' }}>MA20:</span> ${d.ma20.toFixed(2)}</div>}
                {d.ma50 && <div style={styles.tooltipIndicator}><span style={{ color: '#60a5fa' }}>MA50:</span> ${d.ma50.toFixed(2)}</div>}
            </div>
        )
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <p style={{ color: '#ff4757' }}>⚠️ {error}</p>
                <button style={styles.retryBtn} onClick={fetchKlines}>
                    <RefreshCw size={14} /> 다시 시도
                </button>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.symbolInfo}>
                    <span style={styles.symbol}>{symbol}</span>
                    <span style={{ ...styles.price, color: priceInfo.change >= 0 ? '#00ff88' : '#ff4757' }}>
                        ${priceInfo.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span style={{ ...styles.change, background: priceInfo.change >= 0 ? 'rgba(0,255,136,0.1)' : 'rgba(255,71,87,0.1)', color: priceInfo.change >= 0 ? '#00ff88' : '#ff4757' }}>
                        {priceInfo.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {priceInfo.change >= 0 ? '+' : ''}{priceInfo.change.toFixed(2)}%
                    </span>
                </div>
                <div style={styles.controls}>
                    <span style={styles.interval}>{interval}</span>
                    <button
                        style={{ ...styles.indicatorBtn, background: showIndicatorPanel ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.05)' }}
                        onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
                    >
                        <Layers size={14} />
                        <span>지표</span>
                    </button>
                    <button style={styles.refreshBtn} onClick={fetchKlines} disabled={loading}>
                        <RefreshCw size={14} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Indicator Panel */}
            {showIndicatorPanel && (
                <div style={styles.indicatorPanel}>
                    {availableIndicators.map(ind => (
                        <button
                            key={ind.id}
                            style={{
                                ...styles.indicatorChip,
                                background: activeIndicators.includes(ind.id) ? `${ind.color}20` : 'rgba(255,255,255,0.05)',
                                borderColor: activeIndicators.includes(ind.id) ? ind.color : 'rgba(255,255,255,0.1)',
                                color: activeIndicators.includes(ind.id) ? ind.color : '#94a3b8'
                            }}
                            onClick={() => toggleIndicator(ind.id)}
                        >
                            {ind.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Chart */}
            <div style={styles.chartWrapper}>
                {loading && data.length === 0 ? (
                    <div style={styles.loadingContainer}>
                        <RefreshCw size={24} className="spin" style={{ color: '#0ea5e9' }} />
                        <span>차트 로딩 중...</span>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={priceInfo.change >= 0 ? '#00ff88' : '#ff4757'} stopOpacity={0.3} />
                                    <stop offset="100%" stopColor={priceInfo.change >= 0 ? '#00ff88' : '#ff4757'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="timeStr"
                                tick={{ fill: '#475569', fontSize: 10 }}
                                axisLine={{ stroke: '#1e293b' }}
                                tickLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tick={{ fill: '#475569', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}
                                orientation="right"
                                width={55}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            {/* Bollinger Bands */}
                            {activeIndicators.includes('BB') && (
                                <>
                                    <Line type="monotone" dataKey="bbUpper" stroke="#94a3b8" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                                    <Line type="monotone" dataKey="bbLower" stroke="#94a3b8" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                                    <Area type="monotone" dataKey="bbMiddle" stroke="transparent" fill="rgba(148,163,184,0.1)" />
                                </>
                            )}

                            {/* Price Area */}
                            <Area type="monotone" dataKey="close" stroke="transparent" fill="url(#priceGradient)" />

                            {/* Price Line */}
                            <Line
                                type="monotone"
                                dataKey="close"
                                stroke={priceInfo.change >= 0 ? '#00ff88' : '#ff4757'}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: '#fff' }}
                            />

                            {/* Moving Averages */}
                            {activeIndicators.includes('MA20') && (
                                <Line type="monotone" dataKey="ma20" stroke="#fbbf24" strokeWidth={1.5} dot={false} />
                            )}
                            {activeIndicators.includes('MA50') && (
                                <Line type="monotone" dataKey="ma50" stroke="#60a5fa" strokeWidth={1.5} dot={false} />
                            )}
                            {activeIndicators.includes('MA200') && (
                                <Line type="monotone" dataKey="ma200" stroke="#f472b6" strokeWidth={1.5} dot={false} />
                            )}
                            {activeIndicators.includes('EMA12') && (
                                <Line type="monotone" dataKey="ema12" stroke="#34d399" strokeWidth={1.5} dot={false} />
                            )}
                            {activeIndicators.includes('EMA26') && (
                                <Line type="monotone" dataKey="ema26" stroke="#a78bfa" strokeWidth={1.5} dot={false} />
                            )}

                            {/* Current Price Line */}
                            {priceInfo.price > 0 && (
                                <ReferenceLine
                                    y={priceInfo.price}
                                    stroke={priceInfo.change >= 0 ? '#00ff88' : '#ff4757'}
                                    strokeDasharray="3 3"
                                    strokeWidth={1}
                                />
                            )}

                            {/* Volume */}
                            <Bar dataKey="volume" fill="rgba(14,165,233,0.15)" yAxisId="volume" barSize={3} />
                            <YAxis yAxisId="volume" orientation="left" domain={[0, 'auto']} hide />

                            {/* Brush for zooming */}
                            <Brush dataKey="timeStr" height={20} stroke="#334155" fill="#0f172a" />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
})

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f15 100%)',
        borderRadius: 12,
        overflow: 'hidden'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
    symbolInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
    },
    symbol: {
        fontSize: 16,
        fontWeight: 700,
        color: '#fff',
        fontFamily: "'Space Grotesk', sans-serif"
    },
    price: {
        fontSize: 18,
        fontWeight: 800,
        fontFamily: "'JetBrains Mono', monospace"
    },
    change: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        padding: '4px 8px',
        borderRadius: 6
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
    },
    interval: {
        fontSize: 11,
        fontWeight: 600,
        color: '#64748b',
        padding: '4px 8px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 4
    },
    indicatorBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 10px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6,
        color: '#94a3b8',
        fontSize: 11,
        cursor: 'pointer'
    },
    refreshBtn: {
        padding: 6,
        background: 'rgba(255,255,255,0.05)',
        border: 'none',
        borderRadius: 6,
        color: '#64748b',
        cursor: 'pointer',
        display: 'flex'
    },
    indicatorPanel: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)'
    },
    indicatorChip: {
        padding: '5px 10px',
        border: '1px solid',
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    chartWrapper: {
        flex: 1,
        minHeight: 0,
        padding: '8px 8px 0 0'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 12,
        color: '#64748b',
        fontSize: 13
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 12,
        padding: 20
    },
    retryBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        background: 'rgba(14, 165, 233, 0.1)',
        border: '1px solid rgba(14, 165, 233, 0.3)',
        borderRadius: 6,
        color: '#0ea5e9',
        fontSize: 12,
        cursor: 'pointer'
    },
    tooltip: {
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
    },
    tooltipTime: {
        fontSize: 10,
        color: '#64748b',
        marginBottom: 8,
        fontWeight: 600
    },
    tooltipGrid: {
        display: 'grid',
        gridTemplateColumns: '20px 1fr',
        gap: '4px 8px',
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace"
    },
    tooltipIndicator: {
        fontSize: 10,
        marginTop: 6,
        fontFamily: "'JetBrains Mono', monospace"
    }
}

export default TranChart
