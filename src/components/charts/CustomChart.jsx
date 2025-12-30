import React, { useState, useEffect, memo } from 'react'
import {
    ComposedChart, Line, Area, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, ReferenceLine
} from 'recharts'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

/**
 * 自研K线图组件
 * 支持加密货币（Binance）和传统市场（代理API）
 */
const CustomChart = memo(function CustomChart({ symbol = 'BTC/USDT', interval = '1h' }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPrice, setCurrentPrice] = useState(null)
    const [priceChange, setPriceChange] = useState(0)

    // Binance Klines API
    const fetchKlines = async () => {
        setLoading(true)
        setError(null)

        try {
            // Convert symbol format: BTC/USDT -> BTCUSDT
            const binanceSymbol = symbol.replace('/', '')

            // Binance Klines API (public, no auth needed)
            const response = await fetch(
                `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=100`
            )

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const klines = await response.json()

            // Transform to chart format
            // [openTime, open, high, low, close, volume, closeTime, ...]
            const chartData = klines.map(k => ({
                time: new Date(k[0]).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                timestamp: k[0],
                open: parseFloat(k[1]),
                high: parseFloat(k[2]),
                low: parseFloat(k[3]),
                close: parseFloat(k[4]),
                volume: parseFloat(k[5]),
            }))

            setData(chartData)

            // Calculate current price and change
            if (chartData.length >= 2) {
                const latest = chartData[chartData.length - 1]
                const first = chartData[0]
                setCurrentPrice(latest.close)
                setPriceChange(((latest.close - first.open) / first.open) * 100)
            }
        } catch (err) {
            console.error('Chart fetch error:', err)
            setError(err.message)
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchKlines()

        // Auto-refresh every 30 seconds
        const interval_id = setInterval(fetchKlines, 30000)
        return () => clearInterval(interval_id)
    }, [symbol, interval])

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null
        const d = payload[0].payload

        return (
            <div style={styles.tooltip}>
                <div style={styles.tooltipTime}>{d.time}</div>
                <div style={styles.tooltipRow}>
                    <span style={{ color: '#94a3b8' }}>Open</span>
                    <span style={{ color: '#fff' }}>${d.open?.toLocaleString()}</span>
                </div>
                <div style={styles.tooltipRow}>
                    <span style={{ color: '#00ff88' }}>High</span>
                    <span style={{ color: '#00ff88' }}>${d.high?.toLocaleString()}</span>
                </div>
                <div style={styles.tooltipRow}>
                    <span style={{ color: '#ff4757' }}>Low</span>
                    <span style={{ color: '#ff4757' }}>${d.low?.toLocaleString()}</span>
                </div>
                <div style={styles.tooltipRow}>
                    <span style={{ color: '#0ea5e9' }}>Close</span>
                    <span style={{ color: '#0ea5e9' }}>${d.close?.toLocaleString()}</span>
                </div>
                <div style={styles.tooltipRow}>
                    <span style={{ color: '#94a3b8' }}>Vol</span>
                    <span style={{ color: '#94a3b8' }}>{(d.volume / 1e6).toFixed(2)}M</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <p style={{ color: '#ff4757' }}>⚠️ {error}</p>
                <button style={styles.retryBtn} onClick={fetchKlines}>
                    <RefreshCw size={14} /> Retry
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
                    {currentPrice && (
                        <span style={{ ...styles.price, color: priceChange >= 0 ? '#00ff88' : '#ff4757' }}>
                            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: currentPrice < 10 ? 4 : 2 })}
                        </span>
                    )}
                    {priceChange !== 0 && (
                        <span style={{ ...styles.change, color: priceChange >= 0 ? '#00ff88' : '#ff4757' }}>
                            {priceChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                        </span>
                    )}
                </div>
                <div style={styles.controls}>
                    <span style={styles.interval}>{interval}</span>
                    <button style={styles.refreshBtn} onClick={fetchKlines} disabled={loading}>
                        <RefreshCw size={14} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div style={styles.chartWrapper}>
                {loading && data.length === 0 ? (
                    <div style={styles.loadingContainer}>
                        <RefreshCw size={24} className="spin" style={{ color: '#0ea5e9' }} />
                        <span>Loading chart...</span>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={priceChange >= 0 ? '#00ff88' : '#ff4757'} stopOpacity={0.3} />
                                    <stop offset="100%" stopColor={priceChange >= 0 ? '#00ff88' : '#ff4757'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
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
                                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(2)}
                                orientation="right"
                                width={60}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {currentPrice && (
                                <ReferenceLine
                                    y={currentPrice}
                                    stroke={priceChange >= 0 ? '#00ff88' : '#ff4757'}
                                    strokeDasharray="3 3"
                                    strokeWidth={1}
                                />
                            )}
                            <Area
                                type="monotone"
                                dataKey="close"
                                stroke="transparent"
                                fill="url(#areaGradient)"
                            />
                            <Line
                                type="monotone"
                                dataKey="close"
                                stroke={priceChange >= 0 ? '#00ff88' : '#ff4757'}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: '#fff', stroke: priceChange >= 0 ? '#00ff88' : '#ff4757' }}
                            />
                            {/* Volume bars at bottom */}
                            <Bar
                                dataKey="volume"
                                fill="rgba(14, 165, 233, 0.2)"
                                yAxisId="volume"
                                barSize={4}
                            />
                            <YAxis
                                yAxisId="volume"
                                orientation="left"
                                domain={[0, 'auto']}
                                hide
                            />
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
        fontSize: 12,
        fontWeight: 600,
        padding: '4px 8px',
        borderRadius: 6,
        background: 'rgba(255,255,255,0.05)'
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
    refreshBtn: {
        padding: 6,
        background: 'rgba(255,255,255,0.05)',
        border: 'none',
        borderRadius: 6,
        color: '#64748b',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chartWrapper: {
        flex: 1,
        minHeight: 0,
        padding: '8px 8px 8px 0'
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
    tooltipRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 4
    }
}

export default CustomChart
