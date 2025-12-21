import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Calendar, Award, Target, Plus, Filter, ArrowUpRight, ArrowDownRight, Inbox } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { db, TABLES } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'

function NoteView() {
    const { t, language } = useI18n()
    const [tradeNotes, setTradeNotes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadNotes = async () => {
            try {
                const data = await db.getAll(TABLES.TRADE_NOTES, { orderBy: 'trade_date' })
                setTradeNotes(data || [])
            } catch (err) {
                console.error('Failed to load notes:', err)
                setTradeNotes([])
            }
            setLoading(false)
        }
        loadNotes()
    }, [])

    const getDateLocale = () => {
        switch (language) {
            case 'ko': return 'ko-KR'
            case 'zh': return 'zh-CN'
            default: return 'en-US'
        }
    }

    const totalPnl = tradeNotes.reduce((acc, note) => acc + (note.pnl || 0), 0)
    const winCount = tradeNotes.filter(n => n.pnl > 0).length
    const winRate = tradeNotes.length > 0 ? Math.round((winCount / tradeNotes.length) * 100) : 0

    const equityData = tradeNotes.map((note, idx) => ({
        trade: `#${idx + 1}`,
        equity: tradeNotes.slice(0, idx + 1).reduce((a, n) => a + (n.pnl || 0), 0)
    }))

    const getGradeConfig = (grade) => {
        switch (grade) {
            case 'A': return { color: 'var(--accent-bull)', bg: 'var(--accent-bull-dim)' }
            case 'B': return { color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-dim)' }
            case 'C': return { color: 'var(--accent-gold)', bg: 'var(--accent-gold-dim)' }
            case 'D': return { color: 'var(--accent-bear)', bg: 'var(--accent-bear-dim)' }
            default: return { color: 'var(--text-tertiary)', bg: 'rgba(255,255,255,0.05)' }
        }
    }

    // Labels
    const labels = {
        totalPnl: language === 'ko' ? '총 손익' : language === 'zh' ? '总盈亏' : 'Total PnL',
        winRate: language === 'ko' ? '승률' : language === 'zh' ? '胜率' : 'Win Rate',
        trades: language === 'ko' ? '거래 횟수' : language === 'zh' ? '交易次数' : 'Trades',
        equityCurve: language === 'ko' ? '누적 손익 곡선' : language === 'zh' ? '累计盈亏曲线' : 'Equity Curve',
        entry: language === 'ko' ? '진입' : language === 'zh' ? '入场' : 'Entry',
        exit: language === 'ko' ? '청산' : language === 'zh' ? '出场' : 'Exit',
        long: language === 'ko' ? '롱' : language === 'zh' ? '做多' : 'Long',
        short: language === 'ko' ? '숏' : language === 'zh' ? '做空' : 'Short',
        win: language === 'ko' ? '승' : language === 'zh' ? '胜' : 'W',
        loss: language === 'ko' ? '패' : language === 'zh' ? '负' : 'L',
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}><span style={styles.titleGradient}>{t('views.note.title')}</span></h1>
                    <span style={styles.subtitle}>{t('views.note.subtitle')}</span>
                </div>
            </header>

            <div style={styles.statsGrid}>
                <StatCard label={labels.totalPnl} value={`$${Math.abs(totalPnl).toLocaleString()}`} prefix={totalPnl >= 0 ? '+' : '-'} trend={totalPnl >= 0 ? 'up' : 'down'} icon={<Target size={18} />} accentColor={totalPnl >= 0 ? 'bull' : 'bear'} />
                <StatCard label={labels.winRate} value={`${winRate}%`} subValue={`${winCount}${labels.win} / ${tradeNotes.length - winCount}${labels.loss}`} icon={<Award size={18} />} accentColor="gold" />
                <StatCard label={labels.trades} value={tradeNotes.length} icon={<TrendingUp size={18} />} accentColor="cyan" />
            </div>

            {loading ? (
                <div style={styles.emptyState}><div style={styles.spinner} /><span>{t('common.loading')}</span></div>
            ) : tradeNotes.length === 0 ? (
                <div style={styles.emptyState}>
                    <Inbox size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <h3 style={styles.emptyTitle}>{t('views.note.noData')}</h3>
                    <p style={styles.emptyDesc}>{t('views.note.noDataDesc')}</p>
                </div>
            ) : (
                <>
                    <div style={styles.chartCard}>
                        <div style={styles.chartHeader}>
                            <h2 style={styles.chartTitle}>{labels.equityCurve}</h2>
                            <span style={{ ...styles.chartValue, color: totalPnl >= 0 ? 'var(--accent-bull)' : 'var(--accent-bear)' }}>
                                {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
                            </span>
                        </div>
                        <div style={{ height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={equityData}>
                                    <defs>
                                        <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={totalPnl >= 0 ? '#00ff88' : '#ff4466'} stopOpacity={0.3} />
                                            <stop offset="100%" stopColor={totalPnl >= 0 ? '#00ff88' : '#ff4466'} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="trade" tick={false} axisLine={false} />
                                    <YAxis hide />
                                    <Area type="monotone" dataKey="equity" stroke={totalPnl >= 0 ? '#00ff88' : '#ff4466'} fill="url(#equityGradient)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div style={styles.notesList}>
                        {tradeNotes.map((note, index) => {
                            const gradeConfig = getGradeConfig(note.grade)
                            const isProfitable = note.pnl >= 0
                            return (
                                <article key={note.id} style={{ ...styles.noteCard, animationDelay: `${index * 80}ms` }}>
                                    <div style={styles.noteLeft}>
                                        <div style={{ ...styles.pnlIndicator, background: isProfitable ? 'var(--accent-bull)' : 'var(--accent-bear)' }} />
                                        <div style={styles.noteInfo}>
                                            <div style={styles.noteHeader}>
                                                <span style={styles.notePair}>{note.pair}</span>
                                                <span style={{ ...styles.noteType, color: note.type === 'Long' ? 'var(--accent-bull)' : 'var(--accent-bear)' }}>
                                                    {note.type === 'Long' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                    {note.type === 'Long' ? labels.long : labels.short}
                                                </span>
                                                <span style={{ ...styles.gradeBadge, background: gradeConfig.bg, color: gradeConfig.color }}>{note.grade}</span>
                                            </div>
                                            <div style={styles.noteDetails}>
                                                <span>{labels.entry}: ${note.entry?.toLocaleString()}</span>
                                                <span>{labels.exit}: ${note.exit?.toLocaleString()}</span>
                                                <span><Calendar size={10} /> {new Date(note.trade_date).toLocaleDateString(getDateLocale())}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={styles.noteRight}>
                                        <span style={{ ...styles.pnlValue, color: isProfitable ? 'var(--accent-bull)' : 'var(--accent-bear)' }}>
                                            {isProfitable ? '+' : ''}{note.pnl_percent?.toFixed(2)}%
                                        </span>
                                        <span style={{ ...styles.pnlAmount, color: isProfitable ? 'var(--accent-bull)' : 'var(--accent-bear)' }}>
                                            {isProfitable ? '+' : ''}${note.pnl?.toLocaleString()}
                                        </span>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

function StatCard({ label, value, prefix = '', subValue, trend, icon, accentColor }) {
    const colors = { bull: '#00ff88', bear: '#ff4466', gold: '#fbbf24', cyan: '#00d4ff' }
    const color = colors[accentColor] || colors.cyan
    return (
        <div style={{ ...styles.statCard, borderColor: `${color}30` }}>
            <div style={{ ...styles.statIcon, background: `${color}15`, color }}>{icon}</div>
            <div style={styles.statContent}>
                <span style={styles.statLabel}>{label}</span>
                <span style={{ ...styles.statValue, color }}>{prefix}{value}</span>
                {subValue && <span style={styles.statSub}>{subValue}</span>}
            </div>
        </div>
    )
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fade-in 0.4s ease', height: '100%' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 },
    headerLeft: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' },
    title: { margin: 0, fontSize: '1.75rem', fontWeight: '700' },
    titleGradient: { background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '0.875rem', color: 'var(--text-tertiary)' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', flexShrink: 0 },
    statCard: { display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-5)', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid', borderRadius: 'var(--radius-xl)', transition: 'all 0.3s ease', backdropFilter: 'blur(8px)' },
    statIcon: { width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', boxShadow: '0 0 16px currentColor' },
    statContent: { display: 'flex', flexDirection: 'column', gap: 2 },
    statLabel: { fontSize: '0.75rem', color: 'var(--text-muted)' },
    statValue: { fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-mono)' },
    statSub: { fontSize: '0.75rem', color: 'var(--text-tertiary)' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)', gap: 'var(--space-4)', flex: 1, minHeight: 0 },
    emptyTitle: { margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-secondary)' },
    emptyDesc: { margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' },
    spinner: { width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    chartCard: { background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', backdropFilter: 'blur(8px)' },
    chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' },
    chartTitle: { margin: 0, fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' },
    chartValue: { fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-mono)' },
    notesList: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
    noteCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', animation: 'slide-up 0.4s ease forwards', opacity: 0, transition: 'all 0.3s ease', backdropFilter: 'blur(8px)' },
    noteLeft: { display: 'flex', gap: 'var(--space-4)', alignItems: 'center' },
    pnlIndicator: { width: 4, height: 40, borderRadius: 2 },
    noteInfo: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
    noteHeader: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    notePair: { fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' },
    noteType: { display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.75rem', fontWeight: '600' },
    gradeBadge: { padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.625rem', fontWeight: '700' },
    noteDetails: { display: 'flex', gap: 'var(--space-4)', fontSize: '0.75rem', color: 'var(--text-muted)' },
    noteRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 },
    pnlValue: { fontSize: '1.125rem', fontWeight: '700', fontFamily: 'var(--font-mono)' },
    pnlAmount: { fontSize: '0.75rem', fontFamily: 'var(--font-mono)' },
}

export default NoteView
