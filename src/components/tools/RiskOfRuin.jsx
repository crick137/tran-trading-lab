import React, { useState, useEffect } from 'react'
import { AlertOctagon, RefreshCw } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

function RiskOfRuin() {
    const [winRate, setWinRate] = useState(50)
    const [riskReward, setRiskReward] = useState(1.5)
    const [riskPerTrade, setRiskPerTrade] = useState(2)
    const [riskOfRuin, setRiskOfRuin] = useState(0)

    useEffect(() => {
        // Simplified Formula for Risk of Ruin (0% to 100%)
        // RoR = ((1 - W) / (1 + W)) ^ U
        // Where W = Win Probability
        // U = Units of Capital (1 / RiskPerTrade)

        // P(win) * Reward - P(loss) * Risk > 0 for +EV

        const winP = parseFloat(winRate) / 100
        const lossP = 1 - winP
        const rr = parseFloat(riskReward)

        // Expected Value
        const ev = (winP * rr) - (lossP * 1)

        let ror = 0
        if (ev <= 0) {
            ror = 100
        } else {
            // Using Kelly Criterion base logical curve for visualization
            const kelly = winP - (lossP / rr)
            if (kelly <= 0) ror = 100
            else {
                // The higher the risk per trade vs Kelly, the higher the RoR
                const risk = parseFloat(riskPerTrade) / 100
                const fraction = risk / kelly
                if (fraction > 1) ror = 99 // Overbetting
                else ror = Math.pow(Math.E, -2 * ev * (100 / parseFloat(riskPerTrade))) * 100 // Rough heuristic
            }
        }

        // Clamp
        if (ror > 100) ror = 100
        if (ror < 0) ror = 0
        if (ror < 1 && ror > 0) ror = 1

        setRiskOfRuin(Math.round(ror))
    }, [winRate, riskReward, riskPerTrade])

    const data = [
        { name: 'Safe', value: 100 - riskOfRuin },
        { name: 'Ruin', value: riskOfRuin },
    ]

    const COLORS = ['#00d26a', '#ff3860']

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.iconBox}>
                    <AlertOctagon size={24} />
                </div>
                <div>
                    <h2 style={styles.title}>파산 확률 (Risk of Ruin)</h2>
                    <p style={styles.desc}>현재 전략의 장기적 생존 가능성 분석</p>
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={styles.centerText}>
                        <span style={{ ...styles.centerValue, color: riskOfRuin > 50 ? '#ff3860' : '#00d26a' }}>
                            {riskOfRuin}%
                        </span>
                        <span style={styles.centerLabel}>Ruin</span>
                    </div>
                </div>

                <div style={styles.inputs}>
                    <Input label="승률 (%)" value={winRate} onChange={setWinRate} />
                    <Input label="손익비 (1:N)" value={riskReward} onChange={setRiskReward} />
                    <Input label="거래당 리스크 (%)" value={riskPerTrade} onChange={setRiskPerTrade} accent="bear" />
                </div>
            </div>

            <div style={styles.footer}>
                <div style={{
                    ...styles.badge,
                    background: riskOfRuin < 1 ? 'rgba(0, 210, 106, 0.1)' : riskOfRuin > 10 ? 'rgba(255, 56, 96, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                    color: riskOfRuin < 1 ? '#00d26a' : riskOfRuin > 10 ? '#ff3860' : '#fbbf24'
                }}>
                    {riskOfRuin < 1 ? '전략 안전함 (Safe)' : riskOfRuin > 10 ? '파산 위험 높음 (High Risk)' : '주의 필요 (Caution)'}
                </div>
            </div>
        </div>
    )
}

function Input({ label, value, onChange, accent }) {
    return (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label}</label>
            <input
                type="number"
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{
                    ...styles.input,
                    borderColor: accent === 'bear' ? 'rgba(255, 56, 96, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                }}
            />
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
        background: 'rgba(255, 56, 96, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#ff3860',
    },
    title: { fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' },
    desc: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', margin: '2px 0 0' },
    content: {
        display: 'flex',
        alignItems: 'center',
        gap: 20,
    },
    chartWrapper: {
        width: 160,
        height: 160,
        position: 'relative',
        flexShrink: 0,
    },
    centerText: {
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
    },
    centerValue: { fontSize: 24, fontWeight: 800 },
    centerLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
    inputs: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    inputGroup: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    label: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
    input: {
        width: 80,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid',
        borderRadius: 8,
        padding: '6px 10px',
        color: '#fff',
        textAlign: 'right',
        fontSize: 14,
        outline: 'none',
        fontFamily: "'JetBrains Mono', monospace",
    },
    footer: {
        display: 'flex',
        justifyContent: 'center',
    },
    badge: {
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
    }
}

export default RiskOfRuin
