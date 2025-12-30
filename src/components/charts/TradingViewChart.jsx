import React, { memo, useRef, useEffect } from 'react'
import { useI18n } from '../../hooks/useI18n'
import { ExternalLink } from 'lucide-react'

/**
 * TradingViewChart - Super Pro Terminal Configuration
 * Uses the Advanced Chart Widget with EVERY professional feature enabled.
 */
const TradingViewChart = memo(function TradingViewChart({ symbol = 'BTCUSDT', height = '100%' }) {
    const containerRef = useRef(null)
    const { language } = useI18n()

    const getTVSymbol = (s) => {
        let clean = String(s || 'BTCUSDT').replace('BINANCE:', '');
        return `BINANCE:${clean}`;
    };

    const tvSymbol = getTVSymbol(symbol);

    useEffect(() => {
        if (!containerRef.current) return

        const timeoutId = setTimeout(() => {
            if (!containerRef.current) return
            containerRef.current.innerHTML = ''

            const locale = language === 'zh' ? 'zh_CN' : language === 'ko' ? 'ko' : 'en'

            const script = document.createElement('script')
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
            script.type = 'text/javascript'
            script.async = true
            script.innerHTML = JSON.stringify({
                autosize: true,
                symbol: tvSymbol,
                interval: "60",
                timezone: "Etc/UTC",
                theme: "dark",
                style: "1",
                locale: locale,
                enable_publishing: false,
                backgroundColor: "rgba(19, 23, 34, 1)",
                gridColor: "rgba(42, 46, 57, 0.5)",
                hide_top_toolbar: false,
                hide_legend: false,
                save_image: true,
                calendar: true,
                hide_volume: false,
                hide_side_toolbar: false, // Enable all drawing tools
                allow_symbol_change: true,
                withdateranges: true,
                details: true, // Right side panel
                hotlist: true,
                news: ["stock", "crypto"],
                show_popup_button: true,
                popup_width: "1000",
                popup_height: "650",
                support_host: "https://www.tradingview.com"
            })

            containerRef.current.appendChild(script)
        }, 50)

        return () => {
            clearTimeout(timeoutId)
            if (containerRef.current) {
                containerRef.current.innerHTML = ''
            }
        }
    }, [tvSymbol, language])

    return (
        <div style={{ width: '100%', height: height, position: 'relative', overflow: 'hidden', background: '#131722' }}>
            <div id="tradingview_widget" ref={containerRef} style={{ width: '100%', height: '100%' }} />

            {/* Quick Access to Main Site */}
            <a
                href={`https://www.tradingview.com/chart/?symbol=${tvSymbol}`}
                target="_blank"
                rel="noreferrer"
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '60px',
                    zIndex: 10,
                    background: 'rgba(41, 98, 255, 0.9)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <ExternalLink size={12} />
                {language === 'zh' ? '开启全站分析' : language === 'ko' ? '전체 사이트 열기' : 'Full Site Mode'}
            </a>
        </div>
    )
})

export default TradingViewChart
