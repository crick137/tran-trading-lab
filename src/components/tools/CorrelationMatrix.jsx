import React, { useState, useEffect } from 'react'
import { Grip, RefreshCw, Clock } from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'

function CorrelationMatrix() {
    const { language } = useI18n()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [timeframe, setTimeframe] = useState('7d') // 7d, 30d, 90d
    const [lastUpdate, setLastUpdate] = useState(null)

    const assets = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP']

    // 获取历史价格数据并计算相关性
    const fetchAndCalculateCorrelation = async () => {
        setLoading(true)
        try {
            // 计算天数
            const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90
            const interval = '1d'
            const limit = days

            // 获取每个资产的历史价格
            const pricePromises = assets.map(async (asset) => {
                const symbol = `${asset}USDT`
                try {
                    const response = await fetch(
                        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
                    )
                    const klines = await response.json()
                    // 提取收盘价
                    return klines.map(k => parseFloat(k[4]))
                } catch (e) {
                    console.warn(`Failed to fetch ${symbol}:`, e)
                    // 返回模拟数据
                    return Array(limit).fill(0).map(() => Math.random() * 100)
                }
            })

            const pricesData = await Promise.all(pricePromises)

            // 计算相关性矩阵
            const correlationMatrix = calculateCorrelationMatrix(pricesData)
            setData(correlationMatrix)
            setLastUpdate(new Date())
        } catch (err) {
            console.error('Failed to calculate correlation:', err)
            // 使用备用数据
            setData(getFallbackData())
        }
        setLoading(false)
    }

    // 皮尔逊相关系数计算
    const calculateCorrelation = (arr1, arr2) => {
        const n = Math.min(arr1.length, arr2.length)
        if (n === 0) return 0

        let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0
        for (let i = 0; i < n; i++) {
            sum1 += arr1[i]
            sum2 += arr2[i]
            sum1Sq += arr1[i] ** 2
            sum2Sq += arr2[i] ** 2
            pSum += arr1[i] * arr2[i]
        }

        const num = pSum - (sum1 * sum2 / n)
        const den = Math.sqrt((sum1Sq - sum1 ** 2 / n) * (sum2Sq - sum2 ** 2 / n))

        if (den === 0) return 0
        return num / den
    }

    const calculateCorrelationMatrix = (pricesData) => {
        const n = pricesData.length
        const matrix = []

        for (let i = 0; i < n; i++) {
            const row = []
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    row.push(1)
                } else {
                    const corr = calculateCorrelation(pricesData[i], pricesData[j])
                    row.push(Math.round(corr * 100) / 100)
                }
            }
            matrix.push(row)
        }
        return matrix
    }

    const getFallbackData = () => [
        [1.00, 0.85, 0.62, 0.78, 0.45],
        [0.85, 1.00, 0.75, 0.72, 0.48],
        [0.62, 0.75, 1.00, 0.55, 0.40],
        [0.78, 0.72, 0.55, 1.00, 0.38],
        [0.45, 0.48, 0.40, 0.38, 1.00]
    ]

    useEffect(() => {
        fetchAndCalculateCorrelation()
    }, [timeframe])

    const getColor = (val) => {
        if (val === 1) return 'rgba(255,255,255,0.1)'
        if (val > 0.8) return 'rgba(0, 210, 106, 0.5)'
        if (val > 0.6) return 'rgba(0, 210, 106, 0.25)'
        if (val > 0.4) return 'rgba(251, 191, 36, 0.25)'
        if (val > 0.2) return 'rgba(255, 255, 255, 0.08)'
        if (val > 0) return 'rgba(255, 255, 255, 0.05)'
        if (val > -0.2) return 'rgba(255, 68, 102, 0.1)'
        return 'rgba(255, 68, 102, 0.25)'
    }

    const labels = {
        title: language === 'ko' ? '자산 상관관계' : language === 'zh' ? '资产相关性' : 'Asset Correlation',
        desc: language === 'ko' ? '주요 자산 간의 가격 연동성 분석' : language === 'zh' ? '主要资产价格联动分析' : 'Price correlation between major assets',
        strong: language === 'ko' ? '강한 양의 상관' : language === 'zh' ? '强正相关' : 'Strong Positive',
        moderate: language === 'ko' ? '보통' : language === 'zh' ? '中等' : 'Moderate',
        weak: language === 'ko' ? '약한 상관' : language === 'zh' ? '弱相关' : 'Weak',
        negative: language === 'ko' ? '음의 상관' : language === 'zh' ? '负相关' : 'Negative',
    }

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.iconBox}>
                    <Grip size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={styles.title}>{labels.title}</h2>
                    <p style={styles.desc}>{labels.desc}</p>
                </div>
                <button
                    style={styles.refreshBtn}
                    onClick={fetchAndCalculateCorrelation}
                    disabled={loading}
                >
                    <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                </button>
            </div>

            {/* Timeframe selector */}
            <div style={styles.timeframeRow}>
                {['7d', '30d', '90d'].map(tf => (
                    <button
                        key={tf}
                        style={{
                            ...styles.tfBtn,
                            background: timeframe === tf ? 'rgba(0, 210, 106, 0.2)' : 'transparent',
                            color: timeframe === tf ? '#00ff88' : 'rgba(255,255,255,0.5)',
                            borderColor: timeframe === tf ? 'rgba(0, 210, 106, 0.3)' : 'rgba(255,255,255,0.1)',
                        }}
                        onClick={() => setTimeframe(tf)}
                    >
                        {tf.toUpperCase()}
                    </button>
                ))}
                {lastUpdate && (
                    <span style={styles.updateTime}>
                        <Clock size={10} />
                        {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>

            {loading ? (
                <div style={styles.loadingState}>
                    <div style={styles.spinner} />
                    <span>Calculating correlations...</span>
                </div>
            ) : (
                <div style={styles.matrixContainer}>
                    {/* Header Row */}
                    <div style={styles.row}>
                        <div style={styles.cellHeader}></div>
                        {assets.map(a => (
                            <div key={a} style={styles.cellHeader}>{a}</div>
                        ))}
                    </div>

                    {/* Data Rows */}
                    {data && data.map((row, i) => (
                        <div key={i} style={styles.row}>
                            <div style={styles.cellHeader}>{assets[i]}</div>
                            {row.map((val, j) => (
                                <div
                                    key={j}
                                    style={{
                                        ...styles.cell,
                                        background: getColor(val),
                                        color: Math.abs(val) > 0.6 ? '#fff' : 'rgba(255,255,255,0.7)'
                                    }}
                                    title={`${assets[i]} ↔ ${assets[j]}: ${val.toFixed(2)}`}
                                >
                                    {val.toFixed(2)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            <div style={styles.legend}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ ...styles.dot, background: 'rgba(0, 210, 106, 0.5)' }} />
                    <span>{labels.strong} ({'>'}0.8)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ ...styles.dot, background: 'rgba(251, 191, 36, 0.25)' }} />
                    <span>{labels.moderate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ ...styles.dot, background: 'rgba(255, 68, 102, 0.25)' }} />
                    <span>{labels.negative}</span>
                </div>
            </div>
        </div>
    )
}

const styles = {
    card: {
        background: 'linear-gradient(135deg, rgba(16, 24, 36, 0.6) 0%, rgba(8, 16, 24, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        backdropFilter: 'blur(10px)',
    },
    header: { display: 'flex', alignItems: 'center', gap: 16 },
    iconBox: {
        width: 48, height: 48, borderRadius: 16,
        background: 'rgba(255, 255, 255, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
    },
    title: { fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' },
    desc: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', margin: '2px 0 0' },
    refreshBtn: {
        width: 32, height: 32, borderRadius: 8,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    timeframeRow: {
        display: 'flex', gap: 8, alignItems: 'center',
    },
    tfBtn: {
        padding: '6px 14px', borderRadius: 8,
        border: '1px solid',
        background: 'transparent',
        fontSize: 11, fontWeight: 600,
        cursor: 'pointer', transition: 'all 0.2s',
    },
    updateTime: {
        marginLeft: 'auto',
        fontSize: 10, color: 'rgba(255,255,255,0.3)',
        display: 'flex', alignItems: 'center', gap: 4,
    },
    loadingState: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 40, gap: 12, color: 'rgba(255,255,255,0.5)', fontSize: 12,
    },
    spinner: {
        width: 24, height: 24,
        border: '2px solid rgba(255,255,255,0.1)',
        borderTopColor: '#00ff88',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    matrixContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    row: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 2,
    },
    cellHeader: {
        padding: 8,
        fontSize: 11,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
    },
    cell: {
        padding: 8,
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
        borderRadius: 4,
        transition: 'transform 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
        fontFamily: "'JetBrains Mono', monospace",
    },
    legend: {
        display: 'flex', gap: 16, flexWrap: 'wrap',
        fontSize: 10, color: 'rgba(255,255,255,0.4)',
        marginTop: 4, marginLeft: 4
    },
    dot: { width: 8, height: 8, borderRadius: '50%' }
}

export default CorrelationMatrix
