import React, { useState, useEffect } from 'react'
import { MessageSquare, TrendingUp, TrendingDown, Minus, Star, ExternalLink, RefreshCw } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useI18n } from '../../hooks/useI18n'

// Supabase client for read-only access
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

function NewsCommentaryView() {
    const { language } = useI18n()
    const [commentaries, setCommentaries] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, green, red, neutral

    useEffect(() => {
        loadCommentaries()
    }, [])

    const loadCommentaries = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('news_commentary')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (!error && data) {
                setCommentaries(data)
            }
        } catch (err) {
            console.error('Failed to load commentaries:', err)
        }
        setLoading(false)
    }

    const filteredItems = filter === 'all'
        ? commentaries
        : commentaries.filter(c => c.signal === filter)

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffHours = Math.floor((now - date) / (1000 * 60 * 60))

        if (diffHours < 1) return '방금 전'
        if (diffHours < 24) return `${diffHours}시간 전`
        return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
            month: 'short', day: 'numeric'
        })
    }

    const getSignalInfo = (signal) => {
        switch (signal) {
            case 'green':
                return { icon: TrendingUp, color: '#00ff88', label: '매수기회', bg: 'rgba(0, 255, 136, 0.1)' }
            case 'red':
                return { icon: TrendingDown, color: '#ff4757', label: '리스크', bg: 'rgba(255, 71, 87, 0.1)' }
            default:
                return { icon: Minus, color: '#ffa502', label: '관망', bg: 'rgba(255, 165, 2, 0.1)' }
        }
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerIcon}>💬</div>
                    <div>
                        <h1 style={styles.title}>AI 뉴스 코멘터리</h1>
                        <p style={styles.subtitle}>실시간 금융 뉴스에 대한 AI 분석과 시장 시그널</p>
                    </div>
                </div>
                <button style={styles.refreshBtn} onClick={loadCommentaries}>
                    <RefreshCw size={16} />
                    새로고침
                </button>
            </header>

            {/* Filter Tabs */}
            <div style={styles.filters}>
                {[
                    { id: 'all', label: '전체' },
                    { id: 'green', label: '🟢 매수기회' },
                    { id: 'red', label: '🔴 리스크' },
                    { id: 'neutral', label: '⚪ 관망' }
                ].map(f => (
                    <button
                        key={f.id}
                        style={{
                            ...styles.filterBtn,
                            ...(filter === f.id ? styles.filterBtnActive : {})
                        }}
                        onClick={() => setFilter(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={styles.loading}>
                    <div style={styles.spinner} />
                </div>
            ) : filteredItems.length === 0 ? (
                <div style={styles.empty}>
                    <MessageSquare size={48} style={{ opacity: 0.3 }} />
                    <p>아직 분석된 뉴스가 없습니다</p>
                </div>
            ) : (
                <div style={styles.list}>
                    {filteredItems.map(item => {
                        const signal = getSignalInfo(item.signal)
                        const SignalIcon = signal.icon

                        return (
                            <div key={item.id} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <div style={{ ...styles.signalBadge, background: signal.bg, color: signal.color }}>
                                        <SignalIcon size={14} />
                                        {signal.label}
                                    </div>
                                    <div style={styles.importance}>
                                        {Array(item.importance || 3).fill(0).map((_, i) => (
                                            <Star key={i} size={12} fill="#ffd700" color="#ffd700" />
                                        ))}
                                    </div>
                                </div>

                                <h3 style={styles.cardTitle}>{item.title}</h3>

                                <div style={styles.oneliner}>
                                    💬 "{item.oneliner}"
                                </div>

                                <p style={styles.analysis}>{item.analysis}</p>

                                <div style={styles.cardFooter}>
                                    <span style={styles.source}>{item.source}</span>
                                    <span style={styles.time}>{formatDate(item.created_at)}</span>
                                    {item.source_url && (
                                        <a href={item.source_url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                            원문 <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        height: '100%',
        overflow: 'auto',
        background: '#020408',
        padding: '30px 40px',
        color: '#fff',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 25,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
    },
    headerIcon: {
        fontSize: 40,
    },
    title: {
        fontSize: 26,
        fontWeight: 800,
        margin: 0,
        background: 'linear-gradient(90deg, #fff, #fbbf24)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
    },
    refreshBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        color: 'rgba(255,255,255,0.7)',
        cursor: 'pointer',
        fontSize: 13,
    },
    filters: {
        display: 'flex',
        gap: 10,
        marginBottom: 30,
    },
    filterBtn: {
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        fontSize: 13,
        transition: 'all 0.2s',
    },
    filterBtnActive: {
        background: 'rgba(0, 255, 136, 0.1)',
        borderColor: 'rgba(0, 255, 136, 0.3)',
        color: '#00ff88',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        padding: 80,
    },
    spinner: {
        width: 40,
        height: 40,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#00ff88',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    empty: {
        textAlign: 'center',
        padding: 80,
        color: 'rgba(255,255,255,0.4)',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
    },
    card: {
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 24,
        transition: 'all 0.2s',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    signalBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
    },
    importance: {
        display: 'flex',
        gap: 2,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 700,
        marginBottom: 12,
        lineHeight: 1.4,
    },
    oneliner: {
        fontSize: 15,
        fontStyle: 'italic',
        color: '#00ff88',
        marginBottom: 12,
        padding: '10px 14px',
        background: 'rgba(0, 255, 136, 0.05)',
        borderRadius: 8,
        borderLeft: '3px solid #00ff88',
    },
    analysis: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 1.7,
        marginBottom: 16,
    },
    cardFooter: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },
    source: {
        padding: '3px 8px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 4,
    },
    time: {},
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        color: '#00ff88',
        textDecoration: 'none',
        marginLeft: 'auto',
    },
}

export default NewsCommentaryView
