import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Calendar, Award, Target, Plus, Filter, ArrowUpRight, ArrowDownRight, Inbox, X, Edit2, Trash2, Check, ChevronDown } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { db, TABLES } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'

function NoteView() {
    const { t, language } = useI18n()
    const [tradeNotes, setTradeNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingNote, setEditingNote] = useState(null)
    const [filterType, setFilterType] = useState('all') // all, Long, Short
    const [sortBy, setSortBy] = useState('date') // date, pnl
    const [showFilterMenu, setShowFilterMenu] = useState(false)

    // 表单状态
    const [formData, setFormData] = useState({
        pair: 'BTC/USDT',
        type: 'Long',
        entry: '',
        exit: '',
        trade_date: new Date().toISOString().split('T')[0],
        grade: 'B',
        notes: ''
    })

    useEffect(() => {
        loadNotes()
    }, [])

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

    const getDateLocale = () => {
        switch (language) {
            case 'ko': return 'ko-KR'
            case 'zh': return 'zh-CN'
            default: return 'en-US'
        }
    }

    // 计算盈亏
    const calculatePnL = (entry, exit, type) => {
        const entryPrice = parseFloat(entry)
        const exitPrice = parseFloat(exit)
        if (!entryPrice || !exitPrice) return { pnl: 0, pnl_percent: 0 }

        const pnl = type === 'Long'
            ? exitPrice - entryPrice
            : entryPrice - exitPrice
        const pnl_percent = (pnl / entryPrice) * 100

        return { pnl: Math.round(pnl * 100) / 100, pnl_percent: Math.round(pnl_percent * 100) / 100 }
    }

    // 保存交易记录
    const handleSave = async () => {
        try {
            const { pnl, pnl_percent } = calculatePnL(formData.entry, formData.exit, formData.type)
            const noteData = {
                ...formData,
                entry: parseFloat(formData.entry),
                exit: parseFloat(formData.exit),
                pnl,
                pnl_percent
            }

            if (editingNote) {
                await db.update(TABLES.TRADE_NOTES, editingNote.id, noteData)
            } else {
                await db.create(TABLES.TRADE_NOTES, noteData)
            }

            await loadNotes()
            resetForm()
        } catch (err) {
            console.error('Failed to save note:', err)
            alert(language === 'zh' ? '保存失败' : language === 'ko' ? '저장 실패' : 'Save failed')
        }
    }

    // 删除交易记录
    const handleDelete = async (id) => {
        const confirmMsg = language === 'zh' ? '确定删除这条记录吗？'
            : language === 'ko' ? '이 기록을 삭제하시겠습니까?'
                : 'Delete this record?'

        if (!window.confirm(confirmMsg)) return

        try {
            await db.delete(TABLES.TRADE_NOTES, id)
            await loadNotes()
        } catch (err) {
            console.error('Failed to delete:', err)
        }
    }

    // 编辑交易记录
    const handleEdit = (note) => {
        setEditingNote(note)
        setFormData({
            pair: note.pair,
            type: note.type,
            entry: note.entry?.toString() || '',
            exit: note.exit?.toString() || '',
            trade_date: note.trade_date,
            grade: note.grade || 'B',
            notes: note.notes || ''
        })
        setShowModal(true)
    }

    const resetForm = () => {
        setShowModal(false)
        setEditingNote(null)
        setFormData({
            pair: 'BTC/USDT',
            type: 'Long',
            entry: '',
            exit: '',
            trade_date: new Date().toISOString().split('T')[0],
            grade: 'B',
            notes: ''
        })
    }

    // 筛选和排序
    const filteredNotes = tradeNotes
        .filter(note => filterType === 'all' || note.type === filterType)
        .sort((a, b) => {
            if (sortBy === 'pnl') return (b.pnl || 0) - (a.pnl || 0)
            return new Date(b.trade_date) - new Date(a.trade_date)
        })

    const totalPnl = filteredNotes.reduce((acc, note) => acc + (note.pnl || 0), 0)
    const winCount = filteredNotes.filter(n => n.pnl > 0).length
    const winRate = filteredNotes.length > 0 ? Math.round((winCount / filteredNotes.length) * 100) : 0

    const equityData = filteredNotes.map((note, idx) => ({
        trade: `#${idx + 1}`,
        equity: filteredNotes.slice(0, idx + 1).reduce((a, n) => a + (n.pnl || 0), 0)
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
        addTrade: language === 'ko' ? '거래 추가' : language === 'zh' ? '添加交易' : 'Add Trade',
        editTrade: language === 'ko' ? '거래 수정' : language === 'zh' ? '编辑交易' : 'Edit Trade',
        pair: language === 'ko' ? '거래쌍' : language === 'zh' ? '交易对' : 'Pair',
        type: language === 'ko' ? '유형' : language === 'zh' ? '类型' : 'Type',
        date: language === 'ko' ? '날짜' : language === 'zh' ? '日期' : 'Date',
        grade: language === 'ko' ? '등급' : language === 'zh' ? '评级' : 'Grade',
        notes: language === 'ko' ? '메모' : language === 'zh' ? '笔记' : 'Notes',
        save: language === 'ko' ? '저장' : language === 'zh' ? '保存' : 'Save',
        cancel: language === 'ko' ? '취소' : language === 'zh' ? '取消' : 'Cancel',
        filter: language === 'ko' ? '필터' : language === 'zh' ? '筛选' : 'Filter',
        all: language === 'ko' ? '전체' : language === 'zh' ? '全部' : 'All',
        sortByDate: language === 'ko' ? '날짜순' : language === 'zh' ? '按日期' : 'By Date',
        sortByPnl: language === 'ko' ? '손익순' : language === 'zh' ? '按盈亏' : 'By PnL',
    }

    const commonPairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'DOGE/USDT', 'ADA/USDT']

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}><span style={styles.titleGradient}>{t('views.note.title')}</span></h1>
                    <span style={styles.subtitle}>{t('views.note.subtitle')}</span>
                </div>
                <div style={styles.headerActions}>
                    {/* 筛选按钮 */}
                    <div style={{ position: 'relative' }}>
                        <button
                            style={styles.filterBtn}
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                        >
                            <Filter size={16} />
                            <span>{labels.filter}</span>
                            <ChevronDown size={14} />
                        </button>
                        {showFilterMenu && (
                            <div style={styles.filterMenu}>
                                <div style={styles.filterSection}>
                                    <span style={styles.filterLabel}>{labels.type}</span>
                                    {['all', 'Long', 'Short'].map(type => (
                                        <button
                                            key={type}
                                            style={{
                                                ...styles.filterOption,
                                                background: filterType === type ? 'rgba(0, 210, 106, 0.2)' : 'transparent'
                                            }}
                                            onClick={() => { setFilterType(type); setShowFilterMenu(false) }}
                                        >
                                            {type === 'all' ? labels.all : type === 'Long' ? labels.long : labels.short}
                                        </button>
                                    ))}
                                </div>
                                <div style={styles.filterSection}>
                                    <span style={styles.filterLabel}>Sort</span>
                                    <button
                                        style={{
                                            ...styles.filterOption,
                                            background: sortBy === 'date' ? 'rgba(0, 210, 106, 0.2)' : 'transparent'
                                        }}
                                        onClick={() => { setSortBy('date'); setShowFilterMenu(false) }}
                                    >
                                        {labels.sortByDate}
                                    </button>
                                    <button
                                        style={{
                                            ...styles.filterOption,
                                            background: sortBy === 'pnl' ? 'rgba(0, 210, 106, 0.2)' : 'transparent'
                                        }}
                                        onClick={() => { setSortBy('pnl'); setShowFilterMenu(false) }}
                                    >
                                        {labels.sortByPnl}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* 添加按钮 */}
                    <button style={styles.addBtn} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        <span>{labels.addTrade}</span>
                    </button>
                </div>
            </header>

            <div style={styles.statsGrid}>
                <StatCard label={labels.totalPnl} value={`$${Math.abs(totalPnl).toLocaleString()}`} prefix={totalPnl >= 0 ? '+' : '-'} trend={totalPnl >= 0 ? 'up' : 'down'} icon={<Target size={18} />} accentColor={totalPnl >= 0 ? 'bull' : 'bear'} />
                <StatCard label={labels.winRate} value={`${winRate}%`} subValue={`${winCount}${labels.win} / ${filteredNotes.length - winCount}${labels.loss}`} icon={<Award size={18} />} accentColor="gold" />
                <StatCard label={labels.trades} value={filteredNotes.length} icon={<TrendingUp size={18} />} accentColor="cyan" />
            </div>

            {loading ? (
                <div style={styles.emptyState}><div style={styles.spinner} /><span>{t('common.loading')}</span></div>
            ) : filteredNotes.length === 0 ? (
                <div style={styles.emptyState}>
                    <Inbox size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <h3 style={styles.emptyTitle}>{t('views.note.noData')}</h3>
                    <p style={styles.emptyDesc}>{t('views.note.noDataDesc')}</p>
                    <button style={styles.emptyAddBtn} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        {labels.addTrade}
                    </button>
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
                                    <Tooltip
                                        contentStyle={{ background: 'rgba(13, 17, 23, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                                        labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                                        formatter={(val) => [`$${val.toLocaleString()}`, 'Equity']}
                                    />
                                    <Area type="monotone" dataKey="equity" stroke={totalPnl >= 0 ? '#00ff88' : '#ff4466'} fill="url(#equityGradient)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div style={styles.notesList}>
                        {filteredNotes.map((note, index) => {
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
                                            {note.notes && <p style={styles.noteText}>{note.notes}</p>}
                                        </div>
                                    </div>
                                    <div style={styles.noteRight}>
                                        <div style={styles.noteActions}>
                                            <button style={styles.actionBtn} onClick={() => handleEdit(note)} title="Edit">
                                                <Edit2 size={14} />
                                            </button>
                                            <button style={{ ...styles.actionBtn, color: 'var(--accent-bear)' }} onClick={() => handleDelete(note.id)} title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
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

            {/* 添加/编辑模态框 */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={resetForm}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>{editingNote ? labels.editTrade : labels.addTrade}</h2>
                            <button style={styles.closeBtn} onClick={resetForm}><X size={20} /></button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>{labels.pair}</label>
                                    <select
                                        style={styles.formSelect}
                                        value={formData.pair}
                                        onChange={e => setFormData({ ...formData, pair: e.target.value })}
                                    >
                                        {commonPairs.map(pair => (
                                            <option key={pair} value={pair}>{pair}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>{labels.type}</label>
                                    <div style={styles.typeToggle}>
                                        <button
                                            style={{
                                                ...styles.typeBtn,
                                                background: formData.type === 'Long' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                                                borderColor: formData.type === 'Long' ? '#00ff88' : 'rgba(255,255,255,0.1)',
                                                color: formData.type === 'Long' ? '#00ff88' : 'rgba(255,255,255,0.5)'
                                            }}
                                            onClick={() => setFormData({ ...formData, type: 'Long' })}
                                        >
                                            <ArrowUpRight size={14} /> {labels.long}
                                        </button>
                                        <button
                                            style={{
                                                ...styles.typeBtn,
                                                background: formData.type === 'Short' ? 'rgba(255, 68, 102, 0.2)' : 'transparent',
                                                borderColor: formData.type === 'Short' ? '#ff4466' : 'rgba(255,255,255,0.1)',
                                                color: formData.type === 'Short' ? '#ff4466' : 'rgba(255,255,255,0.5)'
                                            }}
                                            onClick={() => setFormData({ ...formData, type: 'Short' })}
                                        >
                                            <ArrowDownRight size={14} /> {labels.short}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>{labels.entry}</label>
                                    <input
                                        type="number"
                                        style={styles.formInput}
                                        value={formData.entry}
                                        onChange={e => setFormData({ ...formData, entry: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>{labels.exit}</label>
                                    <input
                                        type="number"
                                        style={styles.formInput}
                                        value={formData.exit}
                                        onChange={e => setFormData({ ...formData, exit: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>{labels.date}</label>
                                    <input
                                        type="date"
                                        style={styles.formInput}
                                        value={formData.trade_date}
                                        onChange={e => setFormData({ ...formData, trade_date: e.target.value })}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>{labels.grade}</label>
                                    <div style={styles.gradeSelect}>
                                        {['A', 'B', 'C', 'D', 'F'].map(g => {
                                            const config = getGradeConfig(g)
                                            return (
                                                <button
                                                    key={g}
                                                    style={{
                                                        ...styles.gradeBtn,
                                                        background: formData.grade === g ? config.bg : 'transparent',
                                                        color: formData.grade === g ? config.color : 'rgba(255,255,255,0.4)',
                                                        borderColor: formData.grade === g ? config.color : 'transparent'
                                                    }}
                                                    onClick={() => setFormData({ ...formData, grade: g })}
                                                >
                                                    {g}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>{labels.notes}</label>
                                <textarea
                                    style={styles.formTextarea}
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder={language === 'zh' ? '交易心得、复盘总结...' : language === 'ko' ? '거래 메모, 복기 요약...' : 'Trade notes, review summary...'}
                                    rows={3}
                                />
                            </div>
                            {/* 预览盈亏 */}
                            {formData.entry && formData.exit && (
                                <div style={styles.pnlPreview}>
                                    <span style={styles.pnlPreviewLabel}>
                                        {language === 'zh' ? '预计盈亏' : language === 'ko' ? '예상 손익' : 'Expected PnL'}:
                                    </span>
                                    {(() => {
                                        const { pnl, pnl_percent } = calculatePnL(formData.entry, formData.exit, formData.type)
                                        const isProfit = pnl >= 0
                                        return (
                                            <span style={{ color: isProfit ? '#00ff88' : '#ff4466', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                                {isProfit ? '+' : ''}{pnl_percent.toFixed(2)}% (${pnl.toLocaleString()})
                                            </span>
                                        )
                                    })()}
                                </div>
                            )}
                        </div>
                        <div style={styles.modalFooter}>
                            <button style={styles.cancelBtn} onClick={resetForm}>{labels.cancel}</button>
                            <button
                                style={styles.saveBtn}
                                onClick={handleSave}
                                disabled={!formData.entry || !formData.exit}
                            >
                                <Check size={16} />
                                {labels.save}
                            </button>
                        </div>
                    </div>
                </div>
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
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0, flexWrap: 'wrap', gap: 'var(--space-4)' },
    headerLeft: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' },
    headerActions: { display: 'flex', gap: 'var(--space-3)', alignItems: 'center' },
    title: { margin: 0, fontSize: '1.75rem', fontWeight: '700' },
    titleGradient: { background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '0.875rem', color: 'var(--text-tertiary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)', border: 'none', borderRadius: 'var(--radius-md)', color: '#000', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(0, 210, 106, 0.3)' },
    filterBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' },
    filterMenu: { position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'rgba(13, 17, 23, 0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)', zIndex: 100, minWidth: 160, backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' },
    filterSection: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' },
    filterLabel: { fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 var(--space-2)', marginBottom: 4 },
    filterOption: { padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: 'var(--text-secondary)', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.15s' },
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
    emptyAddBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-5)', marginTop: 'var(--space-4)', background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)', border: 'none', borderRadius: 'var(--radius-md)', color: '#000', fontWeight: 600, cursor: 'pointer' },
    spinner: { width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    chartCard: { background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', backdropFilter: 'blur(8px)' },
    chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' },
    chartTitle: { margin: 0, fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' },
    chartValue: { fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-mono)' },
    notesList: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', overflow: 'auto', flex: 1 },
    noteCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--space-4) var(--space-5)', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', animation: 'slide-up 0.4s ease forwards', opacity: 0, transition: 'all 0.3s ease', backdropFilter: 'blur(8px)' },
    noteLeft: { display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', flex: 1 },
    pnlIndicator: { width: 4, height: 50, borderRadius: 2, flexShrink: 0 },
    noteInfo: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 },
    noteHeader: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' },
    notePair: { fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' },
    noteType: { display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.75rem', fontWeight: '600' },
    gradeBadge: { padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.625rem', fontWeight: '700' },
    noteDetails: { display: 'flex', gap: 'var(--space-4)', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' },
    noteText: { margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic', lineHeight: 1.5 },
    noteRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 },
    noteActions: { display: 'flex', gap: 8, marginBottom: 8 },
    actionBtn: { background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 6, padding: 6, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center' },
    pnlValue: { fontSize: '1.125rem', fontWeight: '700', fontFamily: 'var(--font-mono)' },
    pnlAmount: { fontSize: '0.75rem', fontFamily: 'var(--font-mono)' },
    // Modal styles
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
    modal: { background: 'linear-gradient(135deg, rgba(16, 24, 36, 0.98) 0%, rgba(8, 12, 20, 0.98) 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid rgba(255,255,255,0.08)' },
    modalTitle: { margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' },
    closeBtn: { background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8 },
    modalBody: { padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', padding: 'var(--space-5) var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.08)' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
    formLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' },
    formInput: { padding: 'var(--space-3) var(--space-4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--font-mono)' },
    formSelect: { padding: 'var(--space-3) var(--space-4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' },
    formTextarea: { padding: 'var(--space-3) var(--space-4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', minHeight: 80 },
    typeToggle: { display: 'flex', gap: 'var(--space-2)' },
    typeBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 'var(--space-3)', border: '1px solid', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' },
    gradeSelect: { display: 'flex', gap: 'var(--space-2)' },
    gradeBtn: { flex: 1, padding: 'var(--space-2) var(--space-3)', border: '1px solid transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s', background: 'transparent' },
    pnlPreview: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' },
    pnlPreviewLabel: { fontSize: '0.85rem', color: 'var(--text-muted)' },
    cancelBtn: { padding: 'var(--space-3) var(--space-5)', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' },
    saveBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-5)', background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)', border: 'none', borderRadius: 'var(--radius-md)', color: '#000', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(0, 210, 106, 0.3)' },
}

export default NoteView
