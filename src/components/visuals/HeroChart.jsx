/**
 * HeroChart.jsx
 * "High Visibility" Version
 * - Brighter colors (Opaque)
 * - Improved fitContent logic
 * - Background gradient hint
 */
import React, { useEffect, useRef } from 'react'
import { createChart, AreaSeries, CandlestickSeries } from 'lightweight-charts'

function HeroChart({ theme = 'dark', accentColor = '#00f2ff' }) {
    const chartContainerRef = useRef(null)
    const isDark = theme === 'dark'

    useEffect(() => {
        if (!chartContainerRef.current) return

        let chart
        let interval
        let resizeObserver
        let fitLoop

        try {
            // 1. Initialize Chart - Premium Mode
            chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: 'solid', color: 'transparent' },
                    textColor: isDark ? '#6B7280' : '#9CA3AF',
                },
                grid: {
                    vertLines: { visible: true, color: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' },
                    horzLines: { visible: true, color: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' },
                },
                width: chartContainerRef.current.clientWidth || 600,
                height: 400, // Explicit height
                timeScale: {
                    visible: true,
                    timeVisible: true,
                    secondsVisible: false,
                    borderVisible: false,
                    fixLeftEdge: true,
                    fixRightEdge: true,
                    tickMarkFormatter: () => '', // Hide ticks but keep space
                },
                rightPriceScale: {
                    visible: true,
                    borderVisible: false,
                    scaleMargins: {
                        top: 0.2,
                        bottom: 0.2,
                    },
                    textColor: 'rgba(255, 255, 255, 0.3)', // Subtle axis labels
                },
                crosshair: {
                    mode: 1, // Magnet
                    vertLine: {
                        width: 1,
                        color: `${accentColor}4D`, // 30% alpha
                        style: 3, // Dashed
                        labelBackgroundColor: accentColor,
                    },
                    horzLine: {
                        width: 1,
                        color: `${accentColor}4D`, // 30% alpha
                        style: 3, // Dashed
                        labelBackgroundColor: accentColor,
                    },
                },
                handleScale: {
                    mouseWheel: true,
                    pinch: true,
                    axisPressedMouseMove: false,
                },
                handleScroll: {
                    mouseWheel: true,
                    pressedMouseMove: true,
                    horzTouchDrag: true,
                    vertTouchDrag: false,
                },
            })

            // 2. Add Series - High Visibility Colors
            // Area series for the "Glow"
            const areaSeries = chart.addSeries(AreaSeries, {
                lineColor: accentColor,
                topColor: `${accentColor}33`, // 20% alpha
                bottomColor: `${accentColor}00`, // Transparent
                lineWidth: 2,
                priceScaleId: 'right',
                crosshairMarkerVisible: true,
                crosshairMarkerRadius: 6,
                crosshairMarkerBorderColor: accentColor,
                crosshairMarkerBackgroundColor: `${accentColor}33`,
            })

            // Candlestick series - Neon & Opaque
            const candleSeries = chart.addSeries(CandlestickSeries, {
                upColor: accentColor,
                downColor: isDark ? '#ff0055' : '#e91e63', // Neon Red vs Pink/Red
                borderVisible: false,
                wickUpColor: accentColor,
                wickDownColor: isDark ? '#ff0055' : '#e91e63',
                priceScaleId: 'right',
            })

            // 3. Generate "Aesthetic" Bullish Trend Data
            const initialData = []
            const areaData = []

            let currentPrice = 65000 // Start at a realistic BTC price
            let time = Math.floor(Date.now() / 1000) - (100 * 60) // Start 100 mins ago

            for (let i = 0; i < 100; i++) {
                // Bullish bias: Random drift + slight upward trend
                const volatility = 150
                const trend = 30 // Positive bias
                const change = (Math.random() - 0.45) * volatility + trend

                const open = currentPrice
                const close = open + change
                // Ensure high/low contain open/close
                const high = Math.max(open, close) + Math.random() * volatility * 0.5
                const low = Math.min(open, close) - Math.random() * volatility * 0.5

                initialData.push({ time, open, high, low, close })
                areaData.push({ time, value: close })

                currentPrice = close
                time += 60
            }

            candleSeries.setData(initialData)
            areaSeries.setData(areaData)

            // Force fit initially
            chart.timeScale().fitContent()

            // 4. Resize Observer - CRITICAL FIX
            resizeObserver = new ResizeObserver(entries => {
                if (!chart) return
                if (!entries[0]?.contentRect) return
                const { width, height } = entries[0].contentRect

                // Only resize if dimensions are meaningful
                if (width > 50 && height > 50) {
                    chart.applyOptions({ width, height })
                    // Defer fitContent to allow layout to settle
                    requestAnimationFrame(() => chart.timeScale().fitContent())
                }
            })
            resizeObserver.observe(chartContainerRef.current)

            // Force fit loop to ensure visibility after layout settlements
            fitLoop = setInterval(() => {
                if (chart) chart.timeScale().fitContent()
            }, 500)
            setTimeout(() => clearInterval(fitLoop), 2000)

            console.log('HeroChart Initialized with', initialData.length, 'candles')

            // 5. Animation - Simulate "Live" ticks
            let lastCandle = { ...initialData[initialData.length - 1] }

            interval = setInterval(() => {
                if (!chart) return

                const volatility = 50
                const trend = Math.random() > 0.4 ? 10 : -5 // Still slightly bullish on average
                const delta = (Math.random() - 0.5) * volatility + trend
                const newPrice = lastCandle.close + delta

                // Update current candle
                lastCandle.close = newPrice
                lastCandle.high = Math.max(lastCandle.high, newPrice)
                lastCandle.low = Math.min(lastCandle.low, newPrice)

                candleSeries.update(lastCandle)
                areaSeries.update({ time: lastCandle.time, value: newPrice })
            }, 200)

        } catch (err) {
            console.error('Chart Error:', err)
        }

        return () => {
            if (interval) clearInterval(interval)
            if (fitLoop) clearInterval(fitLoop)
            if (resizeObserver) resizeObserver.disconnect()
            if (chart) chart.remove()
        }
    }, [theme, accentColor]) // Re-run on theme or accent change

    return (
        <div
            ref={chartContainerRef}
            className="hero-chart-canvas"
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: isDark
                    ? 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%)'
                    : 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f0f4f8 100%)',
                borderRadius: '12px',
                overflow: 'hidden',
            }}
        >
        </div>
    )
}

export default HeroChart
