import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import {
    BarChart3, Settings, Camera, MousePointer2, TrendingUp,
    Minus, LayoutGrid, Trash2, ChevronDown, Zap, AlertCircle, RefreshCw
} from 'lucide-react';

const PROXY_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

/**
 * Robust Technical Indicator Logic
 */
const Calc = {
    sma(data, period) {
        if (!data || data.length < period) return [];
        const results = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) continue;
            let sum = 0;
            for (let j = 0; j < period; j++) sum += data[i - j].close;
            results.push({ time: data[i].time, value: sum / period });
        }
        return results;
    },
    bollinger(data, period = 20, stdDev = 2) {
        if (!data || data.length < period) return [];
        const results = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) continue;
            let sum = 0;
            let subset = [];
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
                subset.push(data[i - j].close);
            }
            const avg = sum / period;
            const squareDiffs = subset.map(v => Math.pow(v - avg, 2));
            const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / period;
            const std = Math.sqrt(avgSquareDiff);
            results.push({ time: data[i].time, middle: avg, upper: avg + (stdDev * std), lower: avg - (stdDev * std) });
        }
        return results;
    }
};

const ProTradingChart = ({ symbol = 'BTCUSDT', interval: initialInterval = '1h', height = 600 }) => {
    const containerRef = useRef(null);
    const chartInstance = useRef(null);
    const candleSeries = useRef(null);
    const volumeSeries = useRef(null);
    const extraSeries = useRef({});

    const [interval, setIntervalState] = useState(initialInterval);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [priceData, setPriceData] = useState({ current: 0, change: 0 });
    const [activeIndicators, setActiveIndicators] = useState(['MA20', 'Volume', 'Bollinger']);
    const [showMenu, setShowMenu] = useState(false);

    const cleanSymbol = (s) => String(s || 'BTCUSDT').replace('BINANCE:', '');

    // Data Fetching
    const fetchKLines = useCallback(async () => {
        try {
            const sym = cleanSymbol(symbol);
            const url = `${PROXY_URL}/api/binance/klines?symbol=${sym}&interval=${interval}&limit=1000`;
            const response = await fetch(url);
            const res = await response.json();
            if (!res.success) throw new Error(res.error || 'Fetch failed');
            return res.data.map(d => ({
                time: Number(d.time) / 1000,
                open: parseFloat(d.open), high: parseFloat(d.high),
                low: parseFloat(d.low), close: parseFloat(d.close),
                volume: parseFloat(d.volume)
            }));
        } catch (e) {
            console.error('[ProChart] Data Error:', e);
            return null;
        }
    }, [symbol, interval]);

    // Strategy Markers
    const getMarkers = (data) => {
        if (!data || data.length < 60) return [];
        const ma20 = Calc.sma(data, 20);
        const ma50 = Calc.sma(data, 50);
        const ma20Map = new Map(ma20.map(d => [d.time, d.value]));
        const ma50Map = new Map(ma50.map(d => [d.time, d.value]));

        const markers = [];
        for (let i = 1; i < data.length; i++) {
            const t = data[i].time;
            const pt = data[i - 1].time;
            const c20 = ma20Map.get(t);
            const p20 = ma20Map.get(pt);
            const c50 = ma50Map.get(t);
            const p50 = ma50Map.get(pt);

            if (c20 && p20 && c50 && p50) {
                if (p20 <= p50 && c20 > c50) markers.push({ time: t, position: 'belowBar', color: '#26a69a', shape: 'arrowUp', text: 'BUY' });
                if (p20 >= p50 && c20 < c50) markers.push({ time: t, position: 'aboveBar', color: '#ef5350', shape: 'arrowDown', text: 'SELL' });
            }
        }
        return markers;
    };

    // Main Effect
    useEffect(() => {
        if (!containerRef.current) return;

        // Create Chart Instance
        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth || 800,
            height: height - 48,
            layout: { background: { type: ColorType.Solid, color: '#131722' }, textColor: '#d1d4dc' },
            grid: { vertLines: { color: 'rgba(42, 46, 57, 0.2)' }, horzLines: { color: 'rgba(42, 46, 57, 0.2)' } },
            rightPriceScale: { borderColor: 'rgba(197, 203, 206, 0.1)' },
            timeScale: { borderColor: 'rgba(197, 203, 206, 0.1)', timeVisible: true }
        });

        const candles = chart.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350'
        });

        const volume = chart.addHistogramSeries({
            color: '#26a69a', priceFormat: { type: 'volume' }, priceScaleId: ''
        });
        volume.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

        chartInstance.current = chart;
        candleSeries.current = candles;
        volumeSeries.current = volume;

        const updateData = async () => {
            setLoading(true);
            const data = await fetchKLines();
            if (data && data.length > 30) {
                candles.setData(data);
                volume.setData(data.map(d => ({
                    time: d.time, value: d.volume,
                    color: d.close >= d.open ? 'rgba(38, 166, 154, 0.2)' : 'rgba(239, 83, 80, 0.2)'
                })));

                // Reset indicators
                Object.values(extraSeries.current).forEach(s => s && chart.removeSeries(s));
                extraSeries.current = {};

                if (activeIndicators.includes('MA20')) {
                    const ma = chart.addLineSeries({ color: '#2962ff', lineWidth: 2, priceLineVisible: false });
                    ma.setData(Calc.sma(data, 20));
                    extraSeries.current.ma = ma;
                }

                if (activeIndicators.includes('Bollinger')) {
                    const bb = Calc.bollinger(data);
                    const u = chart.addLineSeries({ color: 'rgba(33, 150, 243, 0.3)', lineWidth: 1, lineStyle: 2, priceLineVisible: false });
                    const m = chart.addLineSeries({ color: 'rgba(33, 150, 243, 0.1)', lineWidth: 1, priceLineVisible: false });
                    const l = chart.addLineSeries({ color: 'rgba(33, 150, 243, 0.3)', lineWidth: 1, lineStyle: 2, priceLineVisible: false });
                    u.setData(bb.map(d => ({ time: d.time, value: d.upper })));
                    m.setData(bb.map(d => ({ time: d.time, value: d.middle })));
                    l.setData(bb.map(d => ({ time: d.time, value: d.lower })));
                    extraSeries.current.bbu = u;
                    extraSeries.current.bbm = m;
                    extraSeries.current.bbl = l;
                }

                candles.setMarkers(getMarkers(data));
                const last = data[data.length - 1];
                setPriceData({ current: last.close, change: ((last.close - data[0].open) / data[0].open) * 100 });
                chart.timeScale().fitContent();
                setError(null);
            } else {
                setError('Waiting for market data...');
            }
            setLoading(false);
        };

        updateData();
        const sub = setInterval(updateData, 60000);

        const resize = new ResizeObserver(entries => {
            if (entries.length && chart) {
                chart.applyOptions({
                    width: entries[0].contentRect.width,
                    height: Math.max(height - 48, 300)
                });
            }
        });
        resize.observe(containerRef.current);

        return () => {
            clearInterval(sub);
            resize.disconnect();
            chart.remove();
            chartInstance.current = null;
        };
    }, [symbol, interval, height, activeIndicators, fetchKLines]);

    return (
        <div style={{ ...styles.wrapper, height }}>
            {/* Top Bar */}
            <div style={styles.topBar}>
                <div style={styles.symbolInfo}>
                    <span style={styles.symbolName}>{cleanSymbol(symbol)}</span>
                    <div style={styles.priceContainer}>
                        <span style={{ ...styles.price, color: priceData.change >= 0 ? '#26a69a' : '#ef5350' }}>{priceData.current.toFixed(2)}</span>
                        <span style={{ ...styles.change, background: priceData.change >= 0 ? 'rgba(38,166,154,0.1)' : 'rgba(239,83,80,0.1)', color: priceData.change >= 0 ? '#26a69a' : '#ef5350' }}>
                            {priceData.change >= 0 ? '+' : ''}{priceData.change.toFixed(2)}%
                        </span>
                    </div>
                </div>
                <div style={styles.divider} />
                <div style={styles.timeframes}>
                    {['1m', '5m', '15m', '1H', '4H', '1D'].map(tf => (
                        <button key={tf} onClick={() => setIntervalState(tf.toLowerCase())} style={{ ...styles.tfBtn, ...(interval === tf.toLowerCase() ? styles.tfBtnActive : {}) }}>{tf}</button>
                    ))}
                </div>
                <div style={styles.actions}>
                    <button style={styles.actionBtn} onClick={() => setShowMenu(!showMenu)}>
                        <Zap size={16} color="#fbbf24" />
                        <span>Strategies</span>
                        <ChevronDown size={14} />
                    </button>
                    {showMenu && (
                        <div style={styles.dropdown}>
                            {['MA20', 'Volume', 'Bollinger'].map(i => (
                                <div key={i} style={styles.menuItem} onClick={() => setActiveIndicators(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}>
                                    <input type="checkbox" checked={activeIndicators.includes(i)} readOnly style={{ cursor: 'pointer' }} />
                                    <span>{i}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <button style={styles.actionBtn}><Settings size={18} /></button>
                </div>
            </div>

            <div style={styles.main}>
                {/* Sidebar */}
                <div style={styles.sidebar}>
                    <button style={styles.sideBtnActive}><MousePointer2 size={18} /></button>
                    <button style={styles.sideBtn}><TrendingUp size={18} /></button>
                    <button style={styles.sideBtn}><Minus size={18} /></button>
                    <button style={styles.sideBtn}><LayoutGrid size={18} /></button>
                    <div style={{ flex: 1 }} />
                    <button style={styles.sideBtn}><Trash2 size={18} /></button>
                </div>

                {/* Chart Window */}
                <div style={styles.chartArea}>
                    {loading && <div style={styles.loader}><RefreshCw className="spin" /> Init Pro Engine...</div>}
                    {error && !loading && (
                        <div style={styles.errorOverlay}>
                            <AlertCircle size={32} />
                            <span>{error}</span>
                            <button onClick={() => window.location.reload()} style={styles.retryBtn}>Retry</button>
                        </div>
                    )}
                    <div ref={containerRef} style={styles.container} />
                </div>
            </div>
        </div>
    );
};

const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', background: '#131722', borderRadius: '12px', border: '1px solid #2a2e39', overflow: 'hidden', color: '#d1d4dc', position: 'relative' },
    topBar: { height: '48px', borderBottom: '1px solid #2a2e39', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px', zIndex: 20 },
    symbolInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    symbolName: { fontSize: '15px', fontWeight: '700', color: '#fff' },
    priceContainer: { display: 'flex', alignItems: 'center', gap: 8 },
    price: { fontFamily: 'monospace', fontSize: '15px', fontWeight: '600' },
    change: { fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 4 },
    divider: { width: 1, height: 20, background: '#2a2e39' },
    timeframes: { display: 'flex', gap: 4 },
    tfBtn: { padding: '4px 8px', background: 'transparent', border: 'none', color: '#787b86', fontSize: 11, cursor: 'pointer', borderRadius: 4, fontWeight: 600 },
    tfBtnActive: { background: '#2a2e39', color: '#2962ff' },
    actions: { marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center', position: 'relative' },
    actionBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#787b86', fontSize: 12, cursor: 'pointer', fontWeight: 600 },
    dropdown: { position: 'absolute', top: 38, right: 0, background: '#1e222d', border: '1px solid #2a2e39', borderRadius: 8, padding: 4, zIndex: 100, width: 140, boxShadow: '0 8px 16px rgba(0,0,0,0.4)' },
    menuItem: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', fontSize: '12px', borderRadius: 4 },
    main: { display: 'flex', flex: 1, minHeight: 0 },
    sidebar: { width: 48, borderRight: '1px solid #2a2e39', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 12, background: '#131722' },
    sideBtn: { background: 'transparent', border: 'none', color: '#787b86', padding: 8, cursor: 'pointer', borderRadius: 6 },
    sideBtnActive: { background: 'rgba(41,98,255,0.1)', color: '#2962ff', borderRadius: 8, padding: 8, border: 'none' },
    chartArea: { flex: 1, position: 'relative', overflow: 'hidden' },
    container: { width: '100%', height: '100%' },
    loader: { position: 'absolute', inset: 0, background: 'rgba(19, 23, 34, 0.9)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', color: '#787b86' },
    errorOverlay: { position: 'absolute', inset: 0, background: '#131722', zIndex: 15, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', color: '#ef5350' },
    retryBtn: { padding: '8px 24px', background: '#2962ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }
};

export default memo(ProTradingChart);
