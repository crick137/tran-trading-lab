import React, { memo, useRef, useEffect } from 'react'

const TradingViewChart = memo(function TradingViewChart({ symbol }) {
    const containerRef = useRef(null)
    const widgetRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        // 延迟执行以确保DOM完全就绪
        const timeoutId = setTimeout(() => {
            if (!containerRef.current) return

            // 清理
            if (containerRef.current.firstChild) {
                containerRef.current.innerHTML = ''
            }

            const script = document.createElement('script')
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
            script.type = 'text/javascript'
            script.async = true
            script.innerHTML = JSON.stringify({
                autosize: true,
                symbol: symbol,
                interval: "60",
                timezone: "Asia/Seoul",
                theme: "dark",
                style: "1",
                locale: "kr",
                enable_publishing: false,
                backgroundColor: "rgba(2, 4, 8, 1)",
                gridColor: "rgba(0, 210, 106, 0.03)",
                hide_top_toolbar: false,
                hide_legend: false,
                save_image: true,
                calendar: false,
                hide_volume: false,
                hide_side_toolbar: false,
                allow_symbol_change: true,
                withdateranges: true,
                details: true,
                hotlist: false,
                studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
                support_host: "https://www.tradingview.com"
            })

            containerRef.current.appendChild(script)
            widgetRef.current = script
        }, 100)

        return () => {
            clearTimeout(timeoutId)
            if (containerRef.current) {
                containerRef.current.innerHTML = ''
            }
        }
    }, [symbol])

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
})

export default TradingViewChart
