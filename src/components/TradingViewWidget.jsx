import React, { useEffect, useRef, memo } from 'react'

// TradingView 高级实时图表组件
function TradingViewWidget({ symbol = 'BINANCE:BTCUSDT', theme = 'dark' }) {
    const containerRef = useRef(null)
    const scriptRef = useRef(null)

    useEffect(() => {
        // 清除旧的widget
        if (containerRef.current) {
            containerRef.current.innerHTML = ''
        }

        // 创建script元素
        const script = document.createElement('script')
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
        script.type = 'text/javascript'
        script.async = true
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": symbol,
            "interval": "60",
            "timezone": "Asia/Seoul",
            "theme": theme,
            "style": "1",
            "locale": "kr",
            "enable_publishing": false,
            "backgroundColor": "rgba(3, 5, 8, 1)",
            "gridColor": "rgba(0, 210, 106, 0.03)",
            "hide_top_toolbar": false,
            "hide_legend": false,
            "save_image": false,
            "calendar": false,
            "hide_volume": false,
            "support_host": "https://www.tradingview.com",
            "container_id": "tradingview-widget",
            "studies": [
                "MASimple@tv-basicstudies",
                "Volume@tv-basicstudies"
            ],
            "overrides": {
                "mainSeriesProperties.candleStyle.upColor": "#00d26a",
                "mainSeriesProperties.candleStyle.downColor": "#ff3860",
                "mainSeriesProperties.candleStyle.borderUpColor": "#00d26a",
                "mainSeriesProperties.candleStyle.borderDownColor": "#ff3860",
                "mainSeriesProperties.candleStyle.wickUpColor": "#00d26a",
                "mainSeriesProperties.candleStyle.wickDownColor": "#ff3860"
            }
        })

        if (containerRef.current) {
            containerRef.current.appendChild(script)
            scriptRef.current = script
        }

        return () => {
            if (scriptRef.current && containerRef.current) {
                try {
                    containerRef.current.removeChild(scriptRef.current)
                } catch (e) { }
            }
        }
    }, [symbol, theme])

    return (
        <div style={styles.wrapper}>
            <div
                id="tradingview-widget"
                ref={containerRef}
                style={styles.container}
                className="tradingview-widget-container"
            >
                <div className="tradingview-widget-container__widget" style={styles.widget}></div>
            </div>
        </div>
    )
}

const styles = {
    wrapper: {
        width: '100%',
        height: '100%',
        minHeight: '400px',
        background: 'rgba(3, 5, 8, 1)',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    container: {
        width: '100%',
        height: '100%',
    },
    widget: {
        width: '100%',
        height: '100%',
    },
}

export default memo(TradingViewWidget)
