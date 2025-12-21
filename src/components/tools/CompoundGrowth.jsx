import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { DollarSign, Percent, Calendar, TrendingUp } from 'lucide-react'

function CompoundGrowth() {
    const [initial, setInitial] = useState(10000)
    const [monthly, setMonthly] = useState(100)
    const [years, setYears] = useState(10)
    const [rate, setRate] = useState(12)
    const [data, setData] = useState([])

    useEffect(() => {
        const calculateData = () => {
            const newData = []
            let balance = parseFloat(initial) || 0
            let totalPrincipal = parseFloat(initial) || 0
            const monthlyContribution = parseFloat(monthly) || 0
            const annualRate = parseFloat(rate) || 0
            const months = (parseFloat(years) || 1) * 12

            for (let i = 0; i <= months; i++) {
                if (i > 0) {
                    balance += monthlyContribution
                    balance *= (1 + (annualRate / 100 / 12))
                    totalPrincipal += monthlyContribution
                }

                if (i % 12 === 0) {
                    newData.push({
                        year: `Year ${i / 12}`,
                        balance: Math.round(balance),
                        principal: Math.round(totalPrincipal),
                        interest: Math.round(balance - totalPrincipal)
                    })
                }
            }
            setData(newData)
        }
        calculateData()
    }, [initial, monthly, years, rate])

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.iconBox}>
                    <TrendingUp size={24} />
                </div>
                <div>
                    <h2 style={styles.title}>복리 계산기 (Compound Growth)</h2>
                    <p style={styles.desc}>시간과 복리의 힘을 시각화합니다</p>
                </div>
            </div>

            <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00d26a" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00d26a" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={val => `$${val / 1000}k`} tickLine={false} />
                        <Tooltip
                            contentStyle={{ background: 'rgba(13, 17, 23, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(val) => [`$${val.toLocaleString()}`, '']}
                        />
                        <Area type="monotone" dataKey="balance" stroke="#00d26a" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" name="Total Balance" />
                        <Area type="monotone" dataKey="principal" stroke="#3b82f6" strokeWidth={2} fill="transparent" strokeDasharray="5 5" name="Principal" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div style={styles.inputs}>
                <Input label="초기 투자금 ($)" value={initial} onChange={setInitial} icon={<DollarSign size={14} />} />
                <Input label="월 적립금 ($)" value={monthly} onChange={setMonthly} icon={<Calendar size={14} />} />
                <Input label="연 수익률 (%)" value={rate} onChange={setRate} icon={<Percent size={14} />} accent="bull" />
                <Input label="투자 기간 (년)" value={years} onChange={setYears} icon={<Calendar size={14} />} />
            </div>

            <div style={styles.summary}>
                <div style={styles.summaryItem}>
                    <span style={styles.label}>총 만기 금액</span>
                    <span style={{ ...styles.value, color: '#00d26a' }}>
                        ${data[data.length - 1]?.balance.toLocaleString()}
                    </span>
                </div>
                <div style={styles.summaryItem}>
                    <span style={styles.label}>투입 원금</span>
                    <span style={styles.value}>
                        ${data[data.length - 1]?.principal.toLocaleString()}
                    </span>
                </div>
                <div style={styles.summaryItem}>
                    <span style={styles.label}>이자 수익</span>
                    <span style={{ ...styles.value, color: '#fbbf24' }}>
                        ${data[data.length - 1]?.interest.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    )
}

function Input({ label, value, onChange, icon, accent }) {
    const borderColor = accent === 'bull' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 255, 255, 0.1)'
    return (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label}</label>
            <div style={{ ...styles.inputWrapper, borderColor }}>
                <span style={styles.inputIcon}>{icon}</span>
                <input
                    type="number"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    style={styles.input}
                />
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
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        background: 'rgba(0, 210, 106, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00d26a',
        boxShadow: '0 0 15px rgba(0, 210, 106, 0.15)',
    },
    title: {
        fontSize: 16,
        fontWeight: 700,
        margin: 0,
        color: '#fff',
    },
    desc: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        margin: '2px 0 0',
    },
    chartContainer: {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 16,
        padding: '20px 0 0 0',
        marginBottom: 8,
    },
    inputs: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    label: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: 600,
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid',
        borderRadius: 12,
        transition: 'all 0.2s',
    },
    input: {
        background: 'transparent',
        border: 'none',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        width: '100%',
        outline: 'none',
        fontFamily: "'JetBrains Mono', monospace",
    },
    inputIcon: {
        color: 'rgba(255, 255, 255, 0.3)',
    },
    summary: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        background: 'rgba(255, 255, 255, 0.03)',
        padding: 16,
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    summaryItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    value: {
        fontSize: 15,
        fontWeight: 700,
        color: '#fff',
        fontFamily: "'JetBrains Mono', monospace",
    },
}

export default CompoundGrowth
