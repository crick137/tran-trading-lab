import React, { useState, useEffect } from 'react'
import {
    Brain, TrendingUp, TrendingDown, Minus, RefreshCw,
    Lock, Activity, AlertCircle, CheckCircle, BarChart3,
    ArrowLeft, Newspaper
} from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'

const PROXY_API_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001'

/**
 * 管理员情绪分析仪表板
 * Admin Sentiment Analysis Dashboard
 */
function AdminSentimentView({ onBack }) {
    const { language } = useI18n()
    const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || '')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [apiHealth, setApiHealth] = useState(null)
    const [sentimentData, setSentimentData] = useState(null)
    const [error, setError] = useState(null)

    const texts = {
        zh: {
            title: '情绪分析仪表板',
            subtitle: '使用 FinBERT 分析新闻情绪趋势',
            adminKeyLabel: '管理员密钥',
            adminKeyPlaceholder: '请输入管理员密钥',
            authenticate: '验证',
            checkHealth: '检查 API 状态',
            analyzeNews: '分析新闻情绪',
            apiOnline: 'FinBERT API 在线',
            apiOffline: 'FinBERT API 离线',
            positive: '正面',
            negative: '负面',
            neutral: '中性',
            totalAnalyzed: '分析条数',
            lastUpdate: '最后更新',
            back: '返回',
            error: '错误',
            hint: '提示：确保已运行 python sentiment_api.py'
        },
        ko: {
            title: '감정 분석 대시보드',
            subtitle: 'FinBERT를 사용한 뉴스 감정 트렌드 분석',
            adminKeyLabel: '관리자 키',
            adminKeyPlaceholder: '관리자 키를 입력하세요',
            authenticate: '인증',
            checkHealth: 'API 상태 확인',
            analyzeNews: '뉴스 감정 분석',
            apiOnline: 'FinBERT API 온라인',
            apiOffline: 'FinBERT API 오프라인',
            positive: '긍정적',
            negative: '부정적',
            neutral: '중립',
            totalAnalyzed: '분석 건수',
            lastUpdate: '마지막 업데이트',
            back: '돌아가기',
            error: '오류',
            hint: '힌트: python sentiment_api.py 실행 확인'
        },
        en: {
            title: 'Sentiment Analysis Dashboard',
            subtitle: 'Analyze news sentiment trends using FinBERT',
            adminKeyLabel: 'Admin Key',
            adminKeyPlaceholder: 'Enter admin key',
            authenticate: 'Authenticate',
            checkHealth: 'Check API Health',
            analyzeNews: 'Analyze News Sentiment',
            apiOnline: 'FinBERT API Online',
            apiOffline: 'FinBERT API Offline',
            positive: 'Positive',
            negative: 'Negative',
            neutral: 'Neutral',
            totalAnalyzed: 'Total Analyzed',
            lastUpdate: 'Last Update',
            back: 'Back',
            error: 'Error',
            hint: 'Hint: Make sure python sentiment_api.py is running'
        }
    }

    const t = texts[language] || texts.en

    const fetchWithAuth = async (url, method = 'GET', body = null) => {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-admin-key': adminKey
            }
        }
        if (body) options.body = JSON.stringify(body)
        return fetch(url, options)
    }

    const handleAuthenticate = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetchWithAuth(`${PROXY_API_URL}/api/admin/sentiment/health`)
            const data = await response.json()

            if (response.status === 403) {
                setError('Invalid admin key')
                setIsAuthenticated(false)
            } else {
                setIsAuthenticated(true)
                setApiHealth(data)
                localStorage.setItem('adminKey', adminKey)
            }
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    }

    const checkHealth = async () => {
        setLoading(true)
        try {
            const response = await fetchWithAuth(`${PROXY_API_URL}/api/admin/sentiment/health`)
            const data = await response.json()
            setApiHealth(data)
        } catch (err) {
            setApiHealth({ success: false, status: 'offline' })
        }
        setLoading(false)
    }

    const analyzeNews = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetchWithAuth(
                `${PROXY_API_URL}/api/admin/sentiment/analyze-news`,
                'POST'
            )
            const data = await response.json()
            if (data.success) {
                setSentimentData(data.data)
            } else {
                setError(data.error || 'Analysis failed')
            }
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    }

    // 自动验证（如果有保存的 key）
    useEffect(() => {
        if (adminKey && !isAuthenticated) {
            handleAuthenticate()
        }
    }, [])

    const getSentimentColor = (type) => {
        switch (type) {
            case 'positive': return '#00ff88'
            case 'negative': return '#ff4757'
            default: return '#94a3b8'
        }
    }

    // 登录界面
    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <div style={styles.loginCard}>
                    <div style={styles.loginIcon}>
                        <Lock size={48} />
                    </div>
                    <h2 style={styles.loginTitle}>{t.title}</h2>
                    <p style={styles.loginSubtitle}>{t.subtitle}</p>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>{t.adminKeyLabel}</label>
                        <input
                            type="password"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            placeholder={t.adminKeyPlaceholder}
                            style={styles.input}
                            onKeyDown={(e) => e.key === 'Enter' && handleAuthenticate()}
                        />
                    </div>

                    {error && (
                        <div style={styles.errorBox}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        style={styles.authButton}
                        onClick={handleAuthenticate}
                        disabled={loading || !adminKey}
                    >
                        {loading ? <RefreshCw size={18} className="spin" /> : <Lock size={18} />}
                        <span>{t.authenticate}</span>
                    </button>
                </div>
            </div>
        )
    }

    // 仪表板
    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <button style={styles.backBtn} onClick={onBack}>
                    <ArrowLeft size={18} />
                    <span>{t.back}</span>
                </button>
                <div style={styles.headerContent}>
                    <h1 style={styles.title}>
                        <Brain size={28} style={{ color: '#a855f7' }} />
                        <span>{t.title}</span>
                    </h1>
                    <p style={styles.subtitle}>{t.subtitle}</p>
                </div>
            </header>

            {/* API Status */}
            <div style={styles.statusBar}>
                <div style={{
                    ...styles.statusBadge,
                    background: apiHealth?.success ? 'rgba(0,255,136,0.1)' : 'rgba(255,71,87,0.1)',
                    borderColor: apiHealth?.success ? 'rgba(0,255,136,0.3)' : 'rgba(255,71,87,0.3)',
                    color: apiHealth?.success ? '#00ff88' : '#ff4757'
                }}>
                    {apiHealth?.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>{apiHealth?.success ? t.apiOnline : t.apiOffline}</span>
                </div>
                <div style={styles.actionButtons}>
                    <button style={styles.actionBtn} onClick={checkHealth} disabled={loading}>
                        <Activity size={16} />
                        <span>{t.checkHealth}</span>
                    </button>
                    <button style={styles.primaryBtn} onClick={analyzeNews} disabled={loading}>
                        {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Newspaper size={16} />}
                        <span>{t.analyzeNews}</span>
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div style={styles.errorBox}>
                    <AlertCircle size={16} />
                    <span>{t.error}: {error}</span>
                    <p style={styles.hint}>{t.hint}</p>
                </div>
            )}

            {/* Sentiment Results */}
            {sentimentData && (
                <div style={styles.resultsGrid}>
                    {/* 情绪分布卡片 */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            <BarChart3 size={20} />
                            <span>{language === 'zh' ? '情绪分布' : language === 'ko' ? '감정 분포' : 'Sentiment Distribution'}</span>
                        </h3>
                        <div style={styles.sentimentBars}>
                            {['positive', 'negative', 'neutral'].map(type => (
                                <div key={type} style={styles.sentimentRow}>
                                    <div style={styles.sentimentLabel}>
                                        {type === 'positive' ? <TrendingUp size={16} style={{ color: getSentimentColor(type) }} /> :
                                            type === 'negative' ? <TrendingDown size={16} style={{ color: getSentimentColor(type) }} /> :
                                                <Minus size={16} style={{ color: getSentimentColor(type) }} />}
                                        <span>{t[type]}</span>
                                    </div>
                                    <div style={styles.barContainer}>
                                        <div style={{
                                            ...styles.bar,
                                            width: `${sentimentData.percentages[type]}%`,
                                            background: getSentimentColor(type)
                                        }} />
                                    </div>
                                    <span style={{ ...styles.percentage, color: getSentimentColor(type) }}>
                                        {sentimentData.percentages[type]}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 统计卡片 */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>{t.totalAnalyzed}</h3>
                        <div style={styles.bigNumber}>{sentimentData.total_analyzed}</div>
                        <div style={styles.statGrid}>
                            <div style={styles.statItem}>
                                <TrendingUp size={20} style={{ color: '#00ff88' }} />
                                <span style={styles.statValue}>{sentimentData.counts.positive}</span>
                            </div>
                            <div style={styles.statItem}>
                                <TrendingDown size={20} style={{ color: '#ff4757' }} />
                                <span style={styles.statValue}>{sentimentData.counts.negative}</span>
                            </div>
                            <div style={styles.statItem}>
                                <Minus size={20} style={{ color: '#94a3b8' }} />
                                <span style={styles.statValue}>{sentimentData.counts.neutral}</span>
                            </div>
                        </div>
                        {sentimentData.analyzed_at && (
                            <div style={styles.timestamp}>
                                {t.lastUpdate}: {new Date(sentimentData.analyzed_at).toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        padding: 'var(--space-6)',
        height: '100%',
        overflow: 'auto'
    },
    // Login styles
    loginCard: {
        maxWidth: 400,
        margin: '100px auto',
        padding: 40,
        background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(99,102,241,0.05) 100%)',
        border: '1px solid rgba(168,85,247,0.2)',
        borderRadius: 24,
        textAlign: 'center'
    },
    loginIcon: { color: '#a855f7', marginBottom: 24 },
    loginTitle: { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#fff' },
    loginSubtitle: { margin: '8px 0 32px', color: '#94a3b8', fontSize: '0.9rem' },
    inputGroup: { marginBottom: 20, textAlign: 'left' },
    label: { display: 'block', marginBottom: 8, fontSize: '0.875rem', color: '#94a3b8' },
    input: {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        color: '#fff',
        fontSize: '1rem',
        outline: 'none'
    },
    authButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
        border: 'none',
        borderRadius: 12,
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer'
    },
    // Dashboard styles
    header: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
    backBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        color: '#94a3b8',
        fontSize: '0.875rem',
        cursor: 'pointer',
        width: 'fit-content'
    },
    headerContent: {},
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: 0,
        fontSize: '1.75rem',
        fontWeight: 700,
        color: '#fff'
    },
    subtitle: { margin: '8px 0 0', color: '#64748b', fontSize: '0.9rem' },
    statusBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-4)',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)'
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 20,
        border: '1px solid',
        fontSize: '0.875rem',
        fontWeight: 600
    },
    actionButtons: { display: 'flex', gap: 12 },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 20px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        color: '#94a3b8',
        fontSize: '0.875rem',
        cursor: 'pointer'
    },
    primaryBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
        border: 'none',
        borderRadius: 10,
        color: '#fff',
        fontSize: '0.875rem',
        fontWeight: 600,
        cursor: 'pointer'
    },
    errorBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 16,
        background: 'rgba(255,71,87,0.1)',
        border: '1px solid rgba(255,71,87,0.2)',
        borderRadius: 12,
        color: '#ff4757',
        fontSize: '0.875rem'
    },
    hint: { margin: 0, opacity: 0.7, fontSize: '0.8rem' },
    resultsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24
    },
    card: {
        padding: 24,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20
    },
    cardTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '0 0 20px',
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#fff'
    },
    sentimentBars: { display: 'flex', flexDirection: 'column', gap: 16 },
    sentimentRow: { display: 'flex', alignItems: 'center', gap: 12 },
    sentimentLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        width: 80,
        fontSize: '0.875rem',
        color: '#94a3b8'
    },
    barContainer: {
        flex: 1,
        height: 8,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 4,
        overflow: 'hidden'
    },
    bar: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
    percentage: { width: 50, textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' },
    bigNumber: {
        fontSize: '3rem',
        fontWeight: 800,
        color: '#fff',
        fontFamily: 'var(--font-mono)',
        textAlign: 'center',
        marginBottom: 20
    },
    statGrid: { display: 'flex', justifyContent: 'center', gap: 32 },
    statItem: { display: 'flex', alignItems: 'center', gap: 8 },
    statValue: { fontSize: '1.25rem', fontWeight: 700, color: '#fff' },
    timestamp: { marginTop: 16, textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }
}

export default AdminSentimentView
