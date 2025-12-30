import React, { useEffect, useRef, memo, useState, useCallback } from 'react'
import { init, dispose } from 'klinecharts'
import {
    RefreshCw, Clock, Minus, TrendingUp, Hash, Trash2, BarChart3, ChevronDown, MousePointer,
    Circle, Square, Type
} from 'lucide-react'

const PROXY_URL = import.meta.env.DEV ? 'http://localhost:3001' : ''

const TIMEFRAMES = [
    { label: '1m', value: '1m', ms: 60000 },
    { label: '5m', value: '5m', ms: 300000 },
    { label: '15m', value: '15m', ms: 900000 },
    { label: '1H', value: '1h', ms: 3600000 },
    { label: '4H', value: '4h', ms: 14400000 },
    { label: '1D', value: '1d', ms: 86400000 },
]

const SIDE_TOOLS = [
    { id: 'pointer', icon: MousePointer, name: '커서' },
    { id: 'horizontalStraightLine', icon: Minus, name: '수평선' },
    { id: 'segment', icon: TrendingUp, name: '추세선' },
    { id: 'fibonacciLine', icon: Hash, name: '피보나치' },
    { id: 'rect', icon: Square, name: '사각형' },
    { id: 'circle', icon: Circle, name: '원' },
    { id: 'simpleAnnotation', icon: Type, name: '텍스트' },
]

const COMMON_INDICATORS = [
    { id: 'MA', name: 'MA', paneId: 'candle_pane' },
    { id: 'VOL', name: 'Volume', paneId: 'vol_pane' },
    { id: 'MACD', name: 'MACD', paneId: 'macd_pane' },
    { id: 'RSI', name: 'RSI', paneId: 'rsi_pane' },
]

const ProChart = memo(function ProChart({
    symbol = 'BTCUSDT',
    interval: initialInterval = '1h',
    height = 600
}) {
    const containerRef = useRef(null)
    const chartRef = useRef(null)

    const [loading, setLoading] = useState(true)
    const [currentPrice, setCurrentPrice] = useState(null)
    const [priceChange, setPriceChange] = useState(0)
    const [interval, setInterval_] = useState(initialInterval)
    const [countdown, setCountdown] = useState('')
    const [activeTool, setActiveTool] = useState('pointer')
    const [activeIndicators, setActiveIndicators] = useState(['MA', 'VOL'])
    const [showIndicatorMenu, setShowIndicatorMenu] = useState(false)

    // Data Fetching
    const fetchKlines = useCallback(async () => {
        try {
            const res = await fetch(`${PROXY_URL}/api/binance/klines?symbol=${symbol}&interval=${interval}&limit=500`)
            const result = await res.json()
            if (!result.success) return []

            const bars = result.data.map(d => ({
                timestamp: Number(d.time),
                open: Number(d.open),
                high: Number(d.high),
                low: Number(d.low),
                close: Number(d.close),
                volume: Number(d.volume)
            }))

            if (bars.length > 0) {
                const latest = bars[bars.length - 1]
                setCurrentPrice(latest.close)
                setPriceChange(((latest.close - bars[0].open) / bars[0].open) * 100)
            }
            return bars
        } catch (err) {
            console.error('[ProChart] API Fetch Error:', err)
            return []
        }
    }, [symbol, interval])

    // Timer logic
    useEffect(() => {
        const update = () => {
            const tfMs = TIMEFRAMES.find(t => t.value === interval)?.ms || 3600000
            const remaining = (Math.floor(Date.now() / tfMs) + 1) * tfMs - Date.now()
            const m = Math.floor(remaining / 60000)
            const s = Math.floor((remaining % 60000) / 1000)
            setCountdown(`${m}:${String(s).padStart(2, '0')}`)
        }
        update()
        const timer = setInterval(update, 1000)
        return () => clearInterval(timer)
    }, [interval])

    // Lifecycle
    useEffect(() => {
        if (!containerRef.current) return

        console.log('[ProChart] Initializing KlineCharts v10...')
        const chart = init(containerRef.current, {
            styles: {
                grid: { horizontal: { color: '#161823' }, vertical: { color: '#161823' } },
                candle: {
                    type: 'candle_solid',
                    bar: {
                        upColor: '#26a69a', downColor: '#ef5350',
                        upBorderColor: '#26a69a', downBorderColor: '#ef5350',
                        upWickColor: '#26a69a', downWickColor: '#ef5350'
                    }
                }
            }
        })

        if (!chart) return
        chartRef.current = chart

        // Set mandatory properties for v10
        chart.setSymbol({ ticker: symbol })
        const periodType = interval.includes('d') ? 'day' : interval.includes('h') ? 'hour' : 'minute'
        chart.setPeriod({ span: 1, type: periodType })

        // v10: Use setDataLoader instead of applyNewData
        chart.setDataLoader({
            getBars: async ({ callback }) => {
                const bars = await fetchKlines()
                callback(bars)
                setLoading(false)
            }
        })

        // Re-apply indicators
        activeIndicators.forEach(ind => {
            const conf = COMMON_INDICATORS.find(i => i.id === ind)
            if (conf) {
                try {
                    chart.createIndicator(ind, conf.paneId !== 'candle_pane', { id: conf.paneId })
                } catch (e) { }
            }
        })

        const refreshTimer = setInterval(async () => {
            // For v10 updates, we can either re-trigger data loader or use updateData if it exists
            const bars = await fetchKlines()
            if (chartRef.current && bars.length > 0) {
                // In v10, for pushing new data, applyNewData might be replaced by updateData or similar
                // Let's try updateData as it's common in v10 beta docs for incremental updates
                if (chartRef.current.updateData) {
                    chartRef.current.updateData(bars[bars.length - 1])
                } else if (chartRef.current.applyNewData) {
                    chartRef.current.applyNewData(bars)
                }
            }
        }, 10000)

        const resizeObserver = new ResizeObserver(() => chart.resize())
        resizeObserver.observe(containerRef.current)

        return () => {
            clearInterval(refreshTimer)
            resizeObserver.disconnect()
            dispose(containerRef.current)
        }
    }, [symbol, interval])

    // Handlers
    const toggleIndicator = useCallback((indId) => {
        const config = COMMON_INDICATORS.find(i => i.id === indId)
        if (!config || !chartRef.current) return
        if (activeIndicators.includes(indId)) {
            chartRef.current.removeIndicator(config.paneId, indId)
            setActiveIndicators(prev => prev.filter(id => id !== indId))
        } else {
            chartRef.current.createIndicator(indId, config.paneId !== 'candle_pane', { id: config.paneId })
            setActiveIndicators(prev => [...prev, indId])
        }
    }, [activeIndicators])

    return (
        <div style={{ ...styles.outerContainer, height }}>
            {/* Toolbar */}
            <div style={styles.topBar}>
                <div style={styles.symbolSection}>
                    <span style={styles.symbolName}>{symbol}</span>
                    <span style={{ ...styles.priceText, color: priceChange >= 0 ? '#26a69a' : '#ef5350' }}>{currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span style={{ ...styles.changeText, color: priceChange >= 0 ? '#26a69a' : '#ef5350' }}>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
                    <div style={styles.countdownBadge}><Clock size={12} /> {countdown}</div>
                </div>
                <div style={styles.timeframeSection}>
                    {TIMEFRAMES.map(tf => (
                        <button key={tf.value} style={{ ...styles.tfBtn, ...(interval === tf.value ? styles.tfBtnActive : {}) }}
                            onClick={() => setInterval_(tf.value)}>{tf.label}</button>
                    ))}
                </div>
                <div style={styles.indicatorDropdown}>
                    <button style={styles.iconBtn} onClick={() => setShowIndicatorMenu(!showIndicatorMenu)}><BarChart3 size={18} /><span>지표</span></button>
                    {showIndicatorMenu && (
                        <div style={styles.dropdownMenu}>
                            {COMMON_INDICATORS.map(ind => (
                                <div key={ind.id} style={{ ...styles.menuItem, color: activeIndicators.includes(ind.id) ? '#2196f3' : '#d1d4dc' }}
                                    onClick={() => toggleIndicator(ind.id)}>{ind.name}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div style={styles.mainLayout}>
                <div style={styles.leftSidebar}>
                    {SIDE_TOOLS.map(tool => (
                        <button key={tool.id} style={{ ...styles.sideBtn, ...(activeTool === tool.id ? styles.sideBtnActive : {}) }}
                            onClick={() => {
                                setActiveTool(tool.id)
                                if (tool.id === 'pointer') chartRef.current?.removeOverlay()
                                else chartRef.current?.createOverlay(tool.id)
                            }} title={tool.name}><tool.icon size={18} /></button>
                    ))}
                    <button style={styles.sideBtn} onClick={() => chartRef.current?.removeOverlay()}><Trash2 size={18} /></button>
                </div>
                <div style={styles.chartArea}>
                    {loading && <div style={styles.loader}>PRO Chart Initializing...</div>}
                    <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 450, background: '#131722' }} />
                </div>
            </div>
        </div>
    )
})

const styles = {
    outerContainer: { display: 'flex', flexDirection: 'column', width: '100%', background: '#131722', border: '1px solid #2a2e39', overflow: 'hidden', borderRadius: 8 },
    topBar: { height: 44, borderBottom: '1px solid #2a2e39', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 16 },
    symbolSection: { display: 'flex', gap: 12, alignItems: 'center', marginRight: 'auto' },
    symbolName: { fontWeight: 700, fontSize: 16, color: '#fff' },
    priceText: { fontWeight: 700, fontSize: 16, fontFamily: 'monospace' },
    changeText: { fontSize: 13, fontWeight: 600 },
    countdownBadge: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, background: '#1e222d', padding: '3px 8px', borderRadius: 4, color: '#ff9800' },
    timeframeSection: { display: 'flex', background: '#1e222d', padding: 2, borderRadius: 6 },
    tfBtn: { padding: '4px 10px', fontSize: 12, border: 'none', background: 'transparent', color: '#787b86', cursor: 'pointer', borderRadius: 4 },
    tfBtnActive: { background: '#2a2e39', color: '#ffffff' },
    iconBtn: { background: 'transparent', border: 'none', color: '#787b86', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' },
    indicatorDropdown: { position: 'relative' },
    dropdownMenu: { position: 'absolute', top: 40, right: 0, background: '#1e222d', border: '1px solid #2a2e39', borderRadius: 6, zIndex: 1000, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' },
    menuItem: { padding: '10px 16px', fontSize: 13, cursor: 'pointer' },
    mainLayout: { display: 'flex', flex: 1, minHeight: 0 },
    leftSidebar: { width: 44, borderRight: '1px solid #2a2e39', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12, gap: 12 },
    sideBtn: { width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: '#787b86', cursor: 'pointer' },
    sideBtnActive: { color: '#2196f3' },
    chartArea: { flex: 1, position: 'relative', overflow: 'hidden' },
    loader: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#131722', zIndex: 5, color: '#787b86', fontSize: 14 }
}

export default ProChart
