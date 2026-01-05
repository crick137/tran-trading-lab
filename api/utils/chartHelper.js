/**
 * 图表生成辅助模块
 * 使用 QuickChart API 生成专业数据可视化图表
 * https://quickchart.io/
 */

const QUICKCHART_BASE_URL = 'https://quickchart.io/chart'

/**
 * 生成图表 URL
 * @param {Object} chartConfig - Chart.js 配置对象
 * @param {Object} options - 额外选项 (width, height, backgroundColor)
 * @returns {string} - 图表图片 URL
 */
export function generateChartUrl(chartConfig, options = {}) {
    const { width = 800, height = 400, backgroundColor = '#0d1117' } = options

    const config = {
        ...chartConfig,
        options: {
            ...chartConfig.options,
            plugins: {
                ...chartConfig.options?.plugins,
                legend: {
                    labels: { color: '#ffffff', font: { size: 12 } }
                }
            },
            scales: {
                ...chartConfig.options?.scales,
                x: {
                    ...chartConfig.options?.scales?.x,
                    ticks: { color: '#888888' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                y: {
                    ...chartConfig.options?.scales?.y,
                    ticks: { color: '#888888' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    }

    const params = new URLSearchParams({
        c: JSON.stringify(config),
        w: width,
        h: height,
        bkg: backgroundColor
    })

    return `${QUICKCHART_BASE_URL}?${params.toString()}`
}

/**
 * 生成比特币价格走势图
 * @param {Array} prices - 价格数组 [{ date: 'Mon', price: 95000 }, ...]
 * @param {number} change - 涨跌幅百分比
 */
export function generateBTCPriceChart(prices, change = 0) {
    const labels = prices.map(p => p.date || p.label)
    const data = prices.map(p => p.price || p.value)
    const color = change >= 0 ? '#00ff88' : '#ff4757'

    return generateChartUrl({
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'BTC/USD',
                data,
                borderColor: color,
                backgroundColor: `${color}33`,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Bitcoin Price (${change >= 0 ? '+' : ''}${change.toFixed(2)}%)`,
                    color: '#ffffff',
                    font: { size: 16 }
                }
            }
        }
    })
}

/**
 * 生成多资产对比柱状图
 * @param {Object} assets - { 'BTC': 2.5, 'ETH': -1.2, 'SOL': 5.3 }
 */
export function generateAssetComparisonChart(assets) {
    const labels = Object.keys(assets)
    const data = Object.values(assets)
    const colors = data.map(v => v >= 0 ? '#00ff88' : '#ff4757')

    return generateChartUrl({
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: '24h Change %',
                data,
                backgroundColor: colors,
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: '24시간 가격 변동률',
                    color: '#ffffff',
                    font: { size: 16 }
                }
            }
        }
    }, { height: 300 })
}

/**
 * 生成恐惧贪婪指数仪表盘
 * @param {number} value - 0-100
 */
export function generateFearGreedGauge(value) {
    const color = value <= 25 ? '#ff4757' : value >= 75 ? '#00ff88' : '#ffd700'
    const label = value <= 25 ? 'Extreme Fear' : value <= 45 ? 'Fear' : value <= 55 ? 'Neutral' : value <= 75 ? 'Greed' : 'Extreme Greed'

    return generateChartUrl({
        type: 'gauge',
        data: {
            datasets: [{
                value,
                data: [25, 45, 55, 75, 100],
                backgroundColor: ['#ff4757', '#ff9f43', '#ffd700', '#7bed9f', '#00ff88']
            }]
        },
        options: {
            valueLabel: {
                display: true,
                formatter: () => `${value} - ${label}`,
                color: '#ffffff',
                fontSize: 20
            }
        }
    }, { width: 400, height: 250 })
}

/**
 * 生成市场概览饼图
 * @param {Object} data - { 'BTC Dom': 52, 'ETH': 18, 'Others': 30 }
 */
export function generateMarketShareChart(data) {
    return generateChartUrl({
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: ['#f7931a', '#627eea', '#00ff88', '#ff4757', '#a855f7']
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '시장 점유율',
                    color: '#ffffff',
                    font: { size: 16 }
                },
                legend: {
                    position: 'right',
                    labels: { color: '#ffffff' }
                }
            }
        }
    }, { width: 500, height: 300 })
}

/**
 * 生成综合市场仪表板图
 * @param {Object} marketData - 市场数据
 */
export function generateMarketDashboardChart(marketData) {
    const { btc, eth, sp500, vix } = marketData

    return generateChartUrl({
        type: 'bar',
        data: {
            labels: ['BTC', 'ETH', 'S&P500', 'VIX'],
            datasets: [{
                label: '24h Change %',
                data: [btc?.change || 0, eth?.change || 0, sp500?.change || 0, vix?.change || 0],
                backgroundColor: [
                    (btc?.change || 0) >= 0 ? '#00ff88' : '#ff4757',
                    (eth?.change || 0) >= 0 ? '#00ff88' : '#ff4757',
                    (sp500?.change || 0) >= 0 ? '#00ff88' : '#ff4757',
                    (vix?.change || 0) >= 0 ? '#ff4757' : '#00ff88' // VIX inverse
                ],
                borderRadius: 8
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '📊 TRAN Market Dashboard',
                    color: '#ffffff',
                    font: { size: 18, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => value + '%'
                    }
                }
            }
        }
    }, { width: 700, height: 400 })
}
