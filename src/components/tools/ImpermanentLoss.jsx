import React, { useState, useEffect } from 'react'
import { Droplet, ArrowRightLeft } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function ImpermanentLoss() {
    const [priceChange, setPriceChange] = useState(50) // % change
    const [il, setIl] = useState(0)
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        // Calculate IL based on price change ratio (k)
        // IL(k) = 2 * sqrt(k) / (1 + k) - 1

        const calculateIL = (pctChange) => {
            const k = (100 + parseFloat(pctChange)) / 100
            if (k <= 0) return -100
            const ilVal = (2 * Math.sqrt(k) / (1 + k)) - 1
            return Math.abs(ilVal * 100) // Display as positive loss %
        }

        setIl(calculateIL(priceChange))

        // Generate chart data for curve -50% to +200%
        const data = []
        for (let i = -50; i <= 200; i += 10) {
            data.push({
                change: `${i}%`,
                loss: calculateIL(i).toFixed(2)
            })
        }
        setChartData(data)
    }, [priceChange])

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.iconBox}>
                    <Droplet size={24} />
                </div>
                <div>
                    <h2 style={styles.title}>비영구적 손실 (Impermanent Loss)</h2>
                    <p style={styles.desc}>유동성 공급(LP) 시 예상되는 손실 계산</p>
                </div>
            </div>

            <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorIl" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff3860" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ff3860" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="change" hide />
                        <Tooltip
                            contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="loss" stroke="#ff3860" fill="url(#colorIl)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
                <div style={styles.overlayText}>
                    <div style={styles.ilValue}>{il.toFixed(2)}%</div>
                    <div style={styles.ilLabel}>Estimated Loss</div>
                </div>
            </div>

            <div style={styles.inputSection}>
                <label style={styles.label}>가격 변동 ({priceChange > 0 ? '+' : ''}{priceChange}%)</label>
                <input
                    type="range"
                    min="-90"
                    max="500"
                    value={priceChange}
                    onChange={e => setPriceChange(e.target.value)}
                    style={styles.slider}
                />
                <div style={styles.rangeLabels}>
                    <span>-90%</span>
                    <span>0%</span>
                    <span>+500%</span>
                </div>
            </div>

            <div style={styles.infoBox}>
                <ArrowRightLeft size={14} style={{ marginTop: 2 }} />
                <p style={styles.infoText}>
                    가격이 <strong>{priceChange}%</strong> 변동하면 단순히 보유(HODL)하는 것보다 <strong>{il.toFixed(2)}%</strong>의 자산 가치가 감소합니다.
                </p>
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
        gap: 20,
        backdropFilter: 'blur(10px)',
    },
    header: { display: 'flex', alignItems: 'center', gap: 16 },
    iconBox: {
        width: 48, height: 48, borderRadius: 16,
        background: 'rgba(168, 85, 247, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#a855f7',
    },
    title: { fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' },
    desc: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', margin: '2px 0 0' },
    chartContainer: {
        position: 'relative',
        height: 150,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 16,
        overflow: 'hidden',
        paddingTop: 10,
    },
    overlayText: {
        position: 'absolute',
        top: 20, right: 20,
        textAlign: 'right',
    },
    ilValue: { fontSize: 24, fontWeight: 800, color: '#ff3860' },
    ilLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
    inputSection: {
        display: 'flex', flexDirection: 'column', gap: 10
    },
    label: { fontSize: 13, fontWeight: 600, color: '#fff' },
    slider: {
        width: '100%',
        accentColor: '#a855f7',
        cursor: 'pointer',
    },
    rangeLabels: {
        display: 'flex', justifyContent: 'space-between',
        fontSize: 10, color: 'rgba(255,255,255,0.3)'
    },
    infoBox: {
        display: 'flex', gap: 10,
        padding: 12,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        color: 'rgba(255,255,255,0.7)',
        alignItems: 'flex-start',
    },
    infoText: { fontSize: 12, margin: 0, lineHeight: 1.4 }
}

export default ImpermanentLoss
