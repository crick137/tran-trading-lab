import React, { useState } from 'react'
import {
    Calculator, Target, TrendingUp, TrendingDown,
    DollarSign, Percent, Scale, AlertTriangle, Bell, Trash2
} from 'lucide-react'
import { useAppState, useAppActions } from '../../context/AppContext'
import { useI18n } from '../../hooks/useI18n'
import CompoundGrowth from '../tools/CompoundGrowth'
import MarketSessions from '../tools/MarketSessions'
import RiskOfRuin from '../tools/RiskOfRuin'
import ImpermanentLoss from '../tools/ImpermanentLoss'
import CorrelationMatrix from '../tools/CorrelationMatrix'

function ToolsView() {
    const { t, language } = useI18n()
    // R:R Calculator
    const [rrEntry, setRrEntry] = useState('100000')
    const [rrSL, setRrSL] = useState('95000')
    const [rrTP, setRrTP] = useState('115000')
    const [rrSize, setRrSize] = useState('1')

    // Position Calculator
    const [posBalance, setPosBalance] = useState('10000')
    const [posRisk, setPosRisk] = useState('2')
    const [posEntry, setPosEntry] = useState('100000')
    const [posSL, setPosSL] = useState('95000')

    // Price Alerts
    const { priceAlerts = [] } = useAppState()
    const { addPriceAlert, removePriceAlert, notify } = useAppActions()
    const [alertSymbol, setAlertSymbol] = useState('BTC/USDT')
    const [alertPrice, setAlertPrice] = useState('')
    const [alertType, setAlertType] = useState('above') // 'above' | 'below'

    const handleAddAlert = () => {
        if (!alertPrice) return
        addPriceAlert({
            symbol: alertSymbol,
            price: parseFloat(alertPrice),
            type: alertType,
            active: true
        })
        notify(language === 'ko' ? `${alertSymbol} ${alertType === 'above' ? '>' : '<'} ${alertPrice} 알림 설정됨` :
            language === 'zh' ? `${alertSymbol} ${alertType === 'above' ? '>' : '<'} ${alertPrice} 提醒已设置` :
                `Alert set for ${alertSymbol} ${alertType === 'above' ? '>' : '<'} ${alertPrice}`)
        setAlertPrice('')
    }

    // R:R Calculation
    const calculateRR = () => {
        const entry = parseFloat(rrEntry) || 0
        const sl = parseFloat(rrSL) || 0
        const tp = parseFloat(rrTP) || 0
        const size = parseFloat(rrSize) || 0

        if (!entry || !sl || !tp || !size) return null

        const isLong = tp > entry
        const risk = Math.abs(entry - sl) * size
        const reward = Math.abs(tp - entry) * size
        const ratio = risk > 0 ? (reward / risk).toFixed(2) : 0

        return { risk, reward, ratio, isLong }
    }

    // Position Calculation
    const calculatePosition = () => {
        const balance = parseFloat(posBalance) || 0
        const riskPct = parseFloat(posRisk) || 0
        const entry = parseFloat(posEntry) || 0
        const sl = parseFloat(posSL) || 0

        if (!balance || !riskPct || !entry || !sl) return null

        const riskAmount = balance * (riskPct / 100)
        const priceDiff = Math.abs(entry - sl)
        const size = priceDiff > 0 ? (riskAmount / priceDiff).toFixed(6) : 0

        return { riskAmount, size, priceDiff }
    }

    const rrResult = calculateRR()
    const posResult = calculatePosition()

    // I18n labels
    const labels = {
        direction: language === 'ko' ? '방향' : language === 'zh' ? '方向' : 'Direction',
        estPnl: language === 'ko' ? '예상 손익' : language === 'zh' ? '预期盈亏' : 'Est. PnL',
        riskAmount: language === 'ko' ? '리스크 금액' : language === 'zh' ? '风险金额' : 'Risk Amount',
        recSize: language === 'ko' ? '권장 수량' : language === 'zh' ? '建议仓位' : 'Rec. Size',
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>
                        <span style={styles.titleGradient}>{t('views.tools.title')}</span>
                    </h1>
                    <span style={styles.subtitle}>{t('views.tools.subtitle')}</span>
                </div>
            </header>

            <div style={styles.grid}>
                {/* Visual Tools Column (New) */}
                <div style={styles.column}>
                    <MarketSessions />
                    <CompoundGrowth />
                    <CorrelationMatrix />
                </div>

                {/* Calculators Column (Existing + New) */}
                <div style={styles.column}>
                    <RiskOfRuin />
                    <ImpermanentLoss />

                    {/* Risk/Reward Calculator */}
                    <div style={styles.toolCard}>
                        <div style={styles.toolHeader}>
                            <div style={styles.toolIconBox}>
                                <Target size={24} />
                            </div>
                            <div>
                                <h2 style={styles.toolTitle}>{t('views.tools.riskReward')}</h2>
                                <p style={styles.toolDesc}>{t('views.tools.riskRewardDesc')}</p>
                            </div>
                        </div>

                        <div style={styles.inputGrid}>
                            <InputField label={t('tools_ui.entry')} value={rrEntry} onChange={setRrEntry} icon={<DollarSign size={14} />} />
                            <InputField label={t('tools_ui.sl')} value={rrSL} onChange={setRrSL} icon={<AlertTriangle size={14} />} accentColor="bear" />
                            <InputField label={t('tools_ui.tp')} value={rrTP} onChange={setRrTP} icon={<Target size={14} />} accentColor="bull" />
                            <InputField label={t('tools_ui.size')} value={rrSize} onChange={setRrSize} icon={<Scale size={14} />} />
                        </div>

                        {rrResult && (
                            <div style={styles.resultCard}>
                                <div style={styles.resultRow}>
                                    <span style={styles.resultLabel}>{labels.direction}</span>
                                    <div style={{
                                        ...styles.directionBadge,
                                        background: rrResult.isLong ? 'var(--accent-bull-dim)' : 'var(--accent-bear-dim)',
                                        color: rrResult.isLong ? 'var(--accent-bull)' : 'var(--accent-bear)',
                                    }}>
                                        {rrResult.isLong ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        <span>{rrResult.isLong ? 'LONG' : 'SHORT'}</span>
                                    </div>
                                </div>
                                <div style={styles.resultRow}>
                                    <span style={styles.resultLabel}>{labels.estPnl}</span>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <span style={{ color: 'var(--accent-bear)', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>-${rrResult.risk.toLocaleString()}</span>
                                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
                                        <span style={{ color: 'var(--accent-bull)', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>+${rrResult.reward.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div style={styles.ratioDisplay}>
                                    <span style={styles.ratioLabel}>R:R Ratio</span>
                                    <span style={{
                                        ...styles.ratioValue,
                                        color: rrResult.ratio >= 2 ? 'var(--accent-bull)' :
                                            rrResult.ratio >= 1 ? 'var(--accent-gold)' : 'var(--accent-bear)',
                                    }}>
                                        1 : {rrResult.ratio}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Position Sizing Calculator */}
                    <div style={styles.toolCard}>
                        <div style={styles.toolHeader}>
                            <div style={styles.toolIconBox}>
                                <Calculator size={24} />
                            </div>
                            <div>
                                <h2 style={styles.toolTitle}>{t('views.tools.positionCalc')}</h2>
                                <p style={styles.toolDesc}>{t('views.tools.positionDesc')}</p>
                            </div>
                        </div>

                        <div style={styles.inputGrid}>
                            <InputField label={t('tools_ui.balance')} value={posBalance} onChange={setPosBalance} icon={<DollarSign size={14} />} />
                            <InputField label={t('tools_ui.risk') + '%'} value={posRisk} onChange={setPosRisk} icon={<Percent size={14} />} />
                            <InputField label={t('tools_ui.entry')} value={posEntry} onChange={setPosEntry} icon={<DollarSign size={14} />} />
                            <InputField label={t('tools_ui.sl')} value={posSL} onChange={setPosSL} icon={<AlertTriangle size={14} />} accentColor="bear" />
                        </div>

                        {posResult && (
                            <div style={styles.resultCard}>
                                <div style={styles.resultRow}>
                                    <span style={styles.resultLabel}>{labels.riskAmount}</span>
                                    <span style={styles.resultValue}>${posResult.riskAmount.toLocaleString()}</span>
                                </div>
                                <div style={styles.ratioDisplay}>
                                    <span style={styles.ratioLabel}>{labels.recSize}</span>
                                    <span style={{ ...styles.ratioValue, color: 'var(--accent-cyan)' }}>
                                        {posResult.size} BTC
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price Alerts */}
                    <div style={styles.toolCard}>
                        <div style={styles.toolHeader}>
                            <div style={{ ...styles.toolIconBox, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)' }}>
                                <Bell size={24} />
                            </div>
                            <div>
                                <h2 style={styles.toolTitle}>Price Alerts</h2>
                                <p style={styles.toolDesc}>{t('views.tools.alertDesc') || 'Set price alerts'}</p>
                            </div>
                        </div>

                        <div style={styles.inputGrid}>
                            <InputField label={t('tools_ui.symbol')} value={alertSymbol} onChange={setAlertSymbol} icon={<Target size={14} />} />
                            <InputField label={t('tools_ui.target')} value={alertPrice} onChange={setAlertPrice} icon={<DollarSign size={14} />} />
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <button
                                onClick={() => setAlertType('above')}
                                style={{
                                    ...styles.toggleBtn,
                                    background: alertType === 'above' ? 'var(--accent-bull-dim)' : 'transparent',
                                    color: alertType === 'above' ? 'var(--accent-bull)' : 'var(--text-muted)',
                                    border: alertType === 'above' ? '1px solid var(--accent-bull)' : '1px solid var(--border-subtle)',
                                }}
                            >
                                Above {'>'}
                            </button>
                            <button
                                onClick={() => setAlertType('below')}
                                style={{
                                    ...styles.toggleBtn,
                                    background: alertType === 'below' ? 'var(--accent-bear-dim)' : 'transparent',
                                    color: alertType === 'below' ? 'var(--accent-bear)' : 'var(--text-muted)',
                                    border: alertType === 'below' ? '1px solid var(--accent-bear)' : '1px solid var(--border-subtle)',

                                }}
                            >
                                Below {'<'}
                            </button>
                            <button onClick={handleAddAlert} style={styles.actionBtn}>
                                {t('tools_ui.addAlert')}
                            </button>
                        </div>

                        <div style={styles.alertList}>
                            <h4 style={styles.listTitle}>{t('tools_ui.activeAlerts')} ({priceAlerts.length})</h4>
                            {priceAlerts.length === 0 ? (
                                <div style={styles.emptyState}>{t('tools_ui.noAlerts')}</div>
                            ) : (
                                <div style={styles.alertScroll}>
                                    {priceAlerts.map(alert => (
                                        <div key={alert.id} style={styles.alertItem}>
                                            <div style={styles.alertInfo}>
                                                <span style={styles.alertSymbol}>{alert.symbol}</span>
                                                <span style={{
                                                    ...styles.alertCondition,
                                                    color: alert.type === 'above' ? 'var(--accent-bull)' : 'var(--accent-bear)'
                                                }}>
                                                    {alert.type === 'above' ? '>' : '<'} {alert.price.toLocaleString()}
                                                </span>
                                            </div>
                                            <button onClick={() => removePriceAlert(alert.id)} style={styles.deleteBtn}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Tips */}
            <div style={styles.tipsSection}>
                <h3 style={styles.tipsTitle}>💡 {t('tools_ui.tradingTips')}</h3>
                <div style={styles.tipsGrid}>
                    <TipCard
                        title={t('tools_ui.tips.rrTitle')}
                        tips={[
                            t('tools_ui.tips.rr1'),
                            t('tools_ui.tips.rr2'),
                            t('tools_ui.tips.rr3'),
                        ]}
                        accent="bull"
                    />
                    <TipCard
                        title={t('tools_ui.tips.riskTitle')}
                        tips={[
                            t('tools_ui.tips.risk1'),
                            t('tools_ui.tips.risk2'),
                            t('tools_ui.tips.risk3'),
                        ]}
                        accent="primary"
                    />
                    <TipCard
                        title={t('tools_ui.tips.posTitle')}
                        tips={[
                            t('tools_ui.tips.pos1'),
                            t('tools_ui.tips.pos2'),
                            t('tools_ui.tips.pos3'),
                        ]}
                        accent="gold"
                    />
                </div>
            </div>
        </div>
    )
}

// Input Field Component
function InputField({ label, value, onChange, icon, accentColor }) {
    const borderColors = {
        bull: 'rgba(0, 255, 136, 0.3)',
        bear: 'rgba(255, 45, 85, 0.3)',
    }

    return (
        <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>{label}</label>
            <div style={{
                ...styles.inputWrapper,
                borderColor: accentColor ? borderColors[accentColor] : 'var(--border-subtle)',
            }}>
                <span style={styles.inputIcon}>{icon}</span>
                <input
                    type={label === 'Symbol' || label === '심볼' || label === '币种' ? 'text' : 'number'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={styles.input}
                    placeholder="0"
                />
            </div>
        </div>
    )
}

// Tip Card Component
function TipCard({ title, tips, accent }) {
    const accentColors = {
        bull: { bg: 'var(--accent-bull-dim)', border: 'rgba(0, 255, 136, 0.2)' },
        primary: { bg: 'var(--accent-primary-dim)', border: 'rgba(99, 102, 241, 0.2)' },
        gold: { bg: 'var(--accent-gold-dim)', border: 'rgba(255, 215, 0, 0.2)' },
    }
    const colors = accentColors[accent] || accentColors.bull

    return (
        <div style={{
            ...styles.tipCard,
            background: colors.bg,
            borderColor: colors.border,
        }}>
            <h4 style={styles.tipTitle}>{title}</h4>
            <ul style={styles.tipList}>
                {tips.map((tip, i) => (
                    <li key={i} style={styles.tipItem}>{tip}</li>
                ))}
            </ul>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        animation: 'fade-in 0.4s ease',
        paddingBottom: 40,
        height: '100%',
        overflowY: 'auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 10,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
    headerLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
    },
    title: {
        margin: 0,
        fontSize: '1.75rem',
        fontWeight: '700',
    },
    titleGradient: {
        background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: '0.875rem',
        color: 'var(--text-tertiary)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
    },
    toolCard: {
        background: 'linear-gradient(135deg, rgba(16, 24, 36, 0.6) 0%, rgba(8, 16, 24, 0.8) 100%)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        backdropFilter: 'blur(8px)',
    },
    toolHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
    },
    toolIconBox: {
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(0, 210, 106, 0.2) 0%, rgba(0, 210, 106, 0.08) 100%)',
        borderRadius: 16,
        color: '#00ff88',
        boxShadow: '0 0 20px rgba(0, 210, 106, 0.1)',
    },
    toolTitle: {
        margin: 0,
        fontSize: '1rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    toolDesc: {
        margin: '2px 0 0',
        fontSize: '0.75rem',
        color: 'var(--text-tertiary)',
    },
    inputGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-3)',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    inputLabel: {
        fontSize: '0.7rem',
        fontWeight: '600',
        color: 'var(--text-secondary)',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        transition: 'all 0.2s ease',
    },
    inputIcon: {
        color: 'var(--text-muted)',
    },
    input: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
        fontWeight: '500',
        width: '100%',
    },
    resultCard: {
        padding: 'var(--space-4)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        border: '1px solid var(--border-subtle)',
    },
    resultRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resultLabel: {
        fontSize: '0.75rem',
        color: 'var(--text-tertiary)',
    },
    resultValue: {
        fontSize: '0.9rem',
        fontWeight: '600',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-primary)',
    },
    directionBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: '0.7rem',
        fontWeight: '700',
        fontFamily: 'var(--font-mono)',
    },
    ratioDisplay: {
        paddingTop: 12,
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratioLabel: {
        fontSize: '0.8rem',
        fontWeight: '600',
        color: 'var(--text-secondary)',
    },
    ratioValue: {
        fontSize: '1.25rem',
        fontWeight: '700',
        fontFamily: 'var(--font-mono)',
    },
    toggleBtn: {
        flex: 1,
        height: 36,
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 11,
        fontWeight: 600,
        transition: 'all 0.2s',
    },
    actionBtn: {
        height: 36,
        padding: '0 16px',
        borderRadius: 8,
        background: 'var(--accent-primary)',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: 12,
    },
    alertList: {
        marginTop: 12,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        padding: 12,
    },
    listTitle: {
        margin: '0 0 8px 0',
        fontSize: 11,
        color: 'var(--text-muted)',
    },
    emptyState: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        textAlign: 'center',
        padding: 8,
    },
    alertScroll: {
        maxHeight: 120,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    alertItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 10px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
    },
    alertInfo: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
    },
    alertSymbol: {
        fontWeight: 700,
        fontSize: 12,
    },
    alertCondition: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
    },
    deleteBtn: {
        background: 'transparent',
        border: 'none',
        color: 'var(--text-tertiary)',
        cursor: 'pointer',
        padding: 2,
    },
    tipsSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
    },
    tipsTitle: {
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    tipsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-4)',
    },
    tipCard: {
        padding: 'var(--space-5)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
    },
    tipTitle: {
        margin: 0,
        fontSize: '0.9375rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    tipList: {
        margin: 0,
        padding: '0 0 0 var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
    },
    tipItem: {
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
    },
}

export default ToolsView
