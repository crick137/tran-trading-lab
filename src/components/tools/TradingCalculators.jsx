import React, { useState, useMemo } from 'react'
import { Calculator, TrendingUp, Percent, DollarSign, RotateCcw, AlertTriangle, Target, Sparkles } from 'lucide-react'

/**
 * 仓位计算器
 * 根据风险比例计算下单数量
 */
export function PositionSizeCalculator() {
    const [accountSize, setAccountSize] = useState(10000)
    const [riskPercent, setRiskPercent] = useState(2)
    const [entryPrice, setEntryPrice] = useState(100)
    const [stopLoss, setStopLoss] = useState(95)

    const result = useMemo(() => {
        const riskAmount = accountSize * (riskPercent / 100)
        const stopDistance = Math.abs(entryPrice - stopLoss)
        const positionSize = stopDistance > 0 ? riskAmount / stopDistance : 0
        const totalValue = positionSize * entryPrice

        return {
            riskAmount: riskAmount.toFixed(2),
            positionSize: positionSize.toFixed(4),
            totalValue: totalValue.toFixed(2),
            stopDistance: stopDistance.toFixed(2)
        }
    }, [accountSize, riskPercent, entryPrice, stopLoss])

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <Calculator size={20} style={{ color: '#00ff88' }} />
                <h3 style={styles.title}>포지션 사이즈 계산기</h3>
            </div>

            <div style={styles.inputGrid}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>계좌 잔고 ($)</label>
                    <input
                        type="number"
                        value={accountSize}
                        onChange={(e) => setAccountSize(Number(e.target.value))}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>리스크 (%)</label>
                    <input
                        type="number"
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(Number(e.target.value))}
                        step="0.5"
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>진입가</label>
                    <input
                        type="number"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(Number(e.target.value))}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>스탑로스</label>
                    <input
                        type="number"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(Number(e.target.value))}
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.resultGrid}>
                <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>리스크 금액</span>
                    <span style={styles.resultValue}>${result.riskAmount}</span>
                </div>
                <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>포지션 수량</span>
                    <span style={{ ...styles.resultValue, color: '#00ff88' }}>{result.positionSize}</span>
                </div>
                <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>총 포지션 가치</span>
                    <span style={styles.resultValue}>${result.totalValue}</span>
                </div>
            </div>
        </div>
    )
}

/**
 * 리스크/리워드 계산기
 */
export function RiskRewardCalculator() {
    const [entryPrice, setEntryPrice] = useState(100)
    const [stopLoss, setStopLoss] = useState(95)
    const [takeProfit, setTakeProfit] = useState(115)

    const result = useMemo(() => {
        const risk = Math.abs(entryPrice - stopLoss)
        const reward = Math.abs(takeProfit - entryPrice)
        const ratio = risk > 0 ? reward / risk : 0
        const winRate = 100 / (1 + ratio) // Break-even win rate

        return {
            risk: risk.toFixed(2),
            reward: reward.toFixed(2),
            ratio: ratio.toFixed(2),
            winRate: winRate.toFixed(1)
        }
    }, [entryPrice, stopLoss, takeProfit])

    const isGoodRatio = parseFloat(result.ratio) >= 2

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <Target size={20} style={{ color: '#fbbf24' }} />
                <h3 style={styles.title}>리스크/리워드 계산기</h3>
            </div>

            <div style={styles.inputGrid}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>진입가</label>
                    <input
                        type="number"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(Number(e.target.value))}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>스탑로스</label>
                    <input
                        type="number"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(Number(e.target.value))}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>목표가 (TP)</label>
                    <input
                        type="number"
                        value={takeProfit}
                        onChange={(e) => setTakeProfit(Number(e.target.value))}
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.resultGrid}>
                <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>리스크</span>
                    <span style={{ ...styles.resultValue, color: '#ff4757' }}>${result.risk}</span>
                </div>
                <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>리워드</span>
                    <span style={{ ...styles.resultValue, color: '#00ff88' }}>${result.reward}</span>
                </div>
                <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>R:R 비율</span>
                    <span style={{
                        ...styles.resultValue,
                        color: isGoodRatio ? '#00ff88' : '#fbbf24'
                    }}>
                        1:{result.ratio} {isGoodRatio ? '✓' : ''}
                    </span>
                </div>
                <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>손익분기 승률</span>
                    <span style={styles.resultValue}>{result.winRate}%</span>
                </div>
            </div>
        </div>
    )
}

/**
 * 복리 계산기
 */
export function CompoundCalculator() {
    const [principal, setPrincipal] = useState(10000)
    const [monthlyReturn, setMonthlyReturn] = useState(5)
    const [months, setMonths] = useState(12)

    const result = useMemo(() => {
        const rate = monthlyReturn / 100
        const finalValue = principal * Math.pow(1 + rate, months)
        const totalProfit = finalValue - principal
        const totalReturnPercent = ((finalValue - principal) / principal) * 100

        // Monthly breakdown
        const breakdown = []
        let current = principal
        for (let i = 1; i <= Math.min(months, 12); i++) {
            current = current * (1 + rate)
            breakdown.push({
                month: i,
                value: current.toFixed(0)
            })
        }

        return {
            finalValue: finalValue.toFixed(2),
            totalProfit: totalProfit.toFixed(2),
            totalReturnPercent: totalReturnPercent.toFixed(1),
            breakdown
        }
    }, [principal, monthlyReturn, months])

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <Percent size={20} style={{ color: '#a855f7' }} />
                <h3 style={styles.title}>복리 계산기</h3>
            </div>

            <div style={styles.inputGrid}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>초기 자본 ($)</label>
                    <input
                        type="number"
                        value={principal}
                        onChange={(e) => setPrincipal(Number(e.target.value))}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>월 수익률 (%)</label>
                    <input
                        type="number"
                        value={monthlyReturn}
                        onChange={(e) => setMonthlyReturn(Number(e.target.value))}
                        step="0.5"
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>기간 (개월)</label>
                    <input
                        type="number"
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.resultGrid}>
                <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>최종 자산</span>
                    <span style={{ ...styles.resultValue, color: '#00ff88' }}>${result.finalValue}</span>
                </div>
                <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>총 수익</span>
                    <span style={styles.resultValue}>${result.totalProfit}</span>
                </div>
                <div style={styles.resultItem}>
                    <span style={styles.resultLabel}>총 수익률</span>
                    <span style={{ ...styles.resultValue, color: '#a855f7' }}>{result.totalReturnPercent}%</span>
                </div>
            </div>

            {/* Mini Chart */}
            <div style={styles.miniChart}>
                {result.breakdown.map((item, i) => (
                    <div key={i} style={styles.chartBar}>
                        <div style={{
                            ...styles.chartBarFill,
                            height: `${(parseFloat(item.value) / parseFloat(result.finalValue)) * 100}%`
                        }} />
                        <span style={styles.chartLabel}>{item.month}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const styles = {
    card: {
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 700,
        color: '#fff',
        margin: 0,
    },
    inputGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 20,
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    label: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
    input: {
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        color: '#fff',
        fontSize: 14,
        outline: 'none',
    },
    resultGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 16,
        padding: 16,
        background: 'rgba(0,255,136,0.03)',
        borderRadius: 12,
        border: '1px solid rgba(0,255,136,0.1)',
    },
    resultItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    resultLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
    },
    resultValue: {
        fontSize: 18,
        fontWeight: 700,
        color: '#fff',
    },
    miniChart: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 4,
        height: 60,
        marginTop: 16,
        padding: '8px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    chartBar: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
    },
    chartBarFill: {
        width: '100%',
        background: 'linear-gradient(180deg, #a855f7, #00ff88)',
        borderRadius: 2,
        minHeight: 4,
    },
    chartLabel: {
        fontSize: 9,
        color: 'rgba(255,255,255,0.3)',
        marginTop: 4,
    },
}

export default { PositionSizeCalculator, RiskRewardCalculator, CompoundCalculator }
