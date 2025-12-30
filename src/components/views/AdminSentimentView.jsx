import React, { useState, useEffect } from 'react'
import {
    Brain, TrendingUp, TrendingDown, Minus, RefreshCw,
    Lock, Activity, AlertCircle, CheckCircle, BarChart3,
    ArrowLeft, Newspaper, ExternalLink, Filter, Flame, BookOpen, X,
    Monitor, FileText, LineChart, ChevronDown, ChevronUp
} from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'
import TradingViewChart from '../charts/TradingViewChart'

const PROXY_API_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001'

function ArticleModal({ article, onClose, t }) {
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    useEffect(() => {
        const fetchContent = async () => {
            if (!article?.source_url) return
            setLoading(true)
            setError(null)
            try {
                // Use proxy to avoid CORS and parse content
                const url = `${PROXY_API_URL}/api/proxy/article?url=${encodeURIComponent(article.source_url)}`
                console.log('Fetching article:', url)

                const response = await fetch(url)

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
                }

                const text = await response.text()
                try {
                    const data = JSON.parse(text)
                    if (data.success) {
                        setContent(data.data)
                    } else {
                        setError(data.error || 'Failed to load content')
                    }
                } catch (e) {
                    throw new Error('Invalid JSON response: ' + text.substring(0, 50))
                }
            } catch (err) {
                console.error('Article fetch error:', err)
                setError(err.message)
            }
            setLoading(false)
        }
        fetchContent()
    }, [article])

    if (!article) return null


    return (

        <div style={styles.modalOverlay} className="article-modal-overlay" onClick={onClose}>
            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; backdrop-filter: blur(0px); }
                    to { opacity: 1; backdrop-filter: blur(16px); }
                }
                @keyframes modalContentSlide {
                    from { opacity: 0; transform: translateY(40px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                
                .article-modal-overlay {
                    animation: modalFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .article-modal-content {
                    animation: modalContentSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards;
                    background: linear-gradient(180deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%) !important;
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.7), 
                                0 30px 60px -30px rgba(0,0,0,0.5),
                                inset 0 1px 0 rgba(255,255,255,0.1) !important;
                    border: 1px solid rgba(255,255,255,0.08) !important;
                }

                /* Typography System */
                .article-content {
                    font-family: "Songti SC", "Noto Serif SC", "Merriweather", "Georgia", serif;
                    font-size: 1.25rem;
                    line-height: 2.1;
                    color: #cbd5e1;
                    text-align: justify;
                    text-justify: inter-ideograph;
                    padding: 0 20px 80px 20px;
                }

                /* Drop Cap */
                .article-content > p:first-of-type::first-letter {
                    float: left;
                    font-size: 3.8rem;
                    line-height: 0.85;
                    font-weight: 700;
                    margin: 0.1em 0.25em 0 0;
                    color: #a855f7;
                    font-family: "Times New Roman", serif;
                }

                .article-content h1, .article-content h2, .article-content h3 {
                    margin-top: 64px;
                    margin-bottom: 24px;
                    color: #f8fafc;
                    font-weight: 800;
                    font-family: "PingFang SC", "Inter", sans-serif;
                    letter-spacing: -0.01em;
                    line-height: 1.35;
                    position: relative;
                }
                
                .article-content h2::before {
                    content: '';
                    position: absolute;
                    left: -24px;
                    top: 6px;
                    bottom: 6px;
                    width: 4px;
                    background: linear-gradient(180deg, #a855f7, transparent);
                    border-radius: 2px;
                }

                .article-content p {
                    margin-bottom: 32px;
                    letter-spacing: 0.01em;
                }

                .article-content img {
                    width: 100% !important;
                    height: auto !important;
                    border-radius: 8px;
                    margin: 56px 0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
                    transition: transform 0.5s ease;
                }
                .article-content img:hover {
                    transform: scale(1.01);
                }

                .article-content blockquote {
                    position: relative;
                    margin: 48px 0;
                    padding: 8px 0 8px 48px;
                    font-style: italic;
                    color: #e2e8f0;
                    font-size: 1.4rem;
                    font-family: "Georgia", serif;
                    line-height: 1.6;
                    border: none;
                    background: transparent;
                }
                .article-content blockquote::before {
                    content: '“';
                    position: absolute;
                    left: 0;
                    top: -20px;
                    font-size: 6rem;
                    color: rgba(168,85,247, 0.4);
                    font-family: serif;
                    line-height: 1;
                }

                .article-content a {
                    color: #fff;
                    text-decoration: none;
                    background-image: linear-gradient(#d8b4fe, #d8b4fe);
                    background-size: 100% 1px;
                    background-position: 0 100%;
                    background-repeat: no-repeat;
                    transition: background-size 0.3s;
                }
                .article-content a:hover {
                    background-size: 100% 100%;
                    color: #0f172a;
                }

                .article-content strong {
                    color: #fff;
                    font-weight: 700;
                    background: rgba(255,255,255,0.1);
                    padding: 0 4px;
                    border-radius: 4px;
                }

                /* Scrollbar */
                .article-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .article-scroll::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.1);
                }
                .article-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
                .article-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.25);
                }
            `}</style>
            <div style={styles.modalContent} className="article-modal-content" onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <div style={styles.modalTitleMeta}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h2 style={styles.articleTitle}>{content?.title || article.title}</h2>
                            <a href={article.source_url} target="_blank" rel="noopener noreferrer" style={styles.externalLink}>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                        <span style={styles.articleDate}>
                            {new Date(article.created_at).toLocaleString()} | {article.source}
                        </span>
                    </div>
                    <button style={styles.closeButton} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div style={styles.modalBody} className="article-scroll">
                    {loading ? (
                        <div style={styles.loadingState}>
                            <RefreshCw size={32} className="spin" style={{ color: '#a855f7' }} />
                            <p>{t.loadingContent}</p>
                        </div>
                    ) : error ? (
                        <div style={styles.errorState}>
                            <AlertCircle size={32} style={{ color: '#ff4757' }} />
                            <p>{error}</p>
                            <a href={article.source_url} target="_blank" rel="noopener noreferrer" style={styles.fallbackLink}>
                                {t.readOriginal}
                            </a>
                        </div>
                    ) : (
                        <div className="article-content" dangerouslySetInnerHTML={{ __html: content?.content }} />
                    )}
                </div>
            </div>
        </div>
    )
}

/**
 * Admin Sentiment Analysis Dashboard with Hot Topics and Embedded Reader
 */
function AdminSentimentView({ onBack }) {
    const { language } = useI18n()
    const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || '')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [apiHealth, setApiHealth] = useState(null)
    const [sentimentData, setSentimentData] = useState(null)
    const [error, setError] = useState(null)
    const [filterType, setFilterType] = useState('all')
    const [expandedTopic, setExpandedTopic] = useState(null)

    const [selectedArticle, setSelectedArticle] = useState(null)
    const [studioMode, setStudioMode] = useState(false)
    const [copySuccess, setCopySuccess] = useState(null)
    const [showChart, setShowChart] = useState(true)
    const [chartSymbol, setChartSymbol] = useState('BTCUSDT')

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
            hint: '提示：确保已运行 python sentiment_api.py',
            newsList: '新闻详细分析',
            filterBy: '筛选:',
            all: '全部',
            readMore: '阅读全文',
            score: '置信度',
            clickToFilter: '点击条形图筛选列表',
            hotTopics: '🔥 热点话题聚合',
            topicCount: '篇报道',
            expand: '展开',
            collapse: '收起',
            loadingContent: '正在提取正文...',
            readOriginal: '无法提取，前往原网页',
            close: '关闭',
            studioMode: '演播室模式',
            generateBrief: '生成日报简报',
            briefCopied: '简报已复制！',
            exitStudio: '退出演播模式',
            chartPanel: '📈 实时行情图表',
            hideChart: '收起图表',
            showChartBtn: '展开图表'
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
            hint: '힌트: python sentiment_api.py 실행 확인',
            newsList: '뉴스 상세 분석',
            filterBy: '필터:',
            all: '전체',
            readMore: '기사 읽기',
            score: '신뢰도',
            clickToFilter: '그래프를 클릭하여 필터링',
            hotTopics: '🔥 핫 토픽 클러스터링',
            topicCount: '개 기사',
            expand: '펼치기',
            collapse: '접기',
            loadingContent: '본문 추출 중...',
            readOriginal: '원문 보기',
            close: '닫기',
            studioMode: '스튜디오 모드',
            generateBrief: '데일리 브리핑 생성',
            briefCopied: '브리핑 복사됨!',
            exitStudio: '스튜디오 모드 종료',
            chartPanel: '📈 실시간 차트',
            hideChart: '차트 숨기기',
            showChartBtn: '차트 보기'
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
            hint: 'Hint: Make sure python sentiment_api.py is running',
            newsList: 'Detailed Analysis',
            filterBy: 'Filter:',
            all: 'All',
            readMore: 'Read Article',
            score: 'Confidence',
            clickToFilter: 'Click bars to filter list',
            hotTopics: '🔥 Hot Topics',
            topicCount: 'articles',
            expand: 'Expand',
            collapse: 'Collapse',
            loadingContent: 'Extracting content...',
            readOriginal: 'View Original Source',
            close: 'Close',
            studioMode: 'Studio Mode',
            generateBrief: 'Generate Brief',
            briefCopied: 'Copied!',
            exitStudio: 'Exit Studio',
            chartPanel: '📈 Live Charts',
            hideChart: 'Hide Chart',
            showChartBtn: 'Show Chart'
        }
    }

    const t = texts[language] || texts.en

    // ... (keep authentication and API logic same as before)
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
                setFilterType('all')
                setExpandedTopic(null)
            } else {
                setError(data.error || 'Analysis failed')
            }
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    }

    const generateBrief = () => {
        if (!sentimentData) return

        const date = new Date().toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        let brief = `# 📰 Market Daily Briefing - ${date}\n\n`

        // Sentiment Overview
        brief += `## 📊 Sentiment Overview\n`
        brief += `- Bullish: ${sentimentData.percentages.positive}%\n`
        brief += `- Bearish: ${sentimentData.percentages.negative}%\n`
        brief += `- Neutral: ${sentimentData.percentages.neutral}%\n\n`

        // Hot Topics
        if (sentimentData.hot_topics && sentimentData.hot_topics.length > 0) {
            brief += `## 🔥 Hot Topics\n`
            sentimentData.hot_topics.slice(0, 5).forEach((topic, i) => {
                brief += `${i + 1}. **${topic.title}** (${t[topic.sentiment]})\n`
                if (topic.articles[0].tickers && topic.articles[0].tickers.length > 0) {
                    brief += `   - Focused: ${topic.articles[0].tickers.join(', ')}\n`
                }
            })
            brief += `\n`
        }

        // Top News
        brief += `## 🗞️ Key Headlines\n`
        sentimentData.news_list.slice(0, 10).forEach(news => {
            brief += `- ${news.title}`
            if (news.tickers && news.tickers.length > 0) brief += ` [${news.tickers.join(', ')}]`
            brief += `\n`
        })

        navigator.clipboard.writeText(brief)
        setCopySuccess(t.briefCopied)
        setTimeout(() => setCopySuccess(null), 2000)
    }

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

    if (!isAuthenticated) return (
        <div style={styles.container}>
            <div style={styles.loginCard}>
                <div style={styles.loginIcon}><Lock size={48} /></div>
                <h2 style={styles.loginTitle}>{t.title}</h2>
                <p style={styles.loginSubtitle}>{t.subtitle}</p>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>{t.adminKeyLabel}</label>
                    <input type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} placeholder={t.adminKeyPlaceholder} style={styles.input} onKeyDown={(e) => e.key === 'Enter' && handleAuthenticate()} />
                </div>
                {error && <div style={styles.errorBox}><AlertCircle size={16} /><span>{error}</span></div>}
                <button style={styles.authButton} onClick={handleAuthenticate} disabled={loading || !adminKey}>
                    {loading ? <RefreshCw size={18} className="spin" /> : <Lock size={18} />}
                    <span>{t.authenticate}</span>
                </button>
            </div>
        </div>
    )

    const filteredNews = sentimentData?.news_list?.filter(item =>
        filterType === 'all' || item.sentiment === filterType
    ) || []

    return (
        <div style={styles.container}>
            {!studioMode && (
                <header style={styles.header}>
                    <button style={styles.backBtn} onClick={onBack}><ArrowLeft size={18} /><span>{t.back}</span></button>
                    <div style={styles.headerContent}>
                        <h1 style={styles.title}><Brain size={28} style={{ color: '#a855f7' }} /><span>{t.title}</span></h1>
                        <p style={styles.subtitle}>{t.subtitle}</p>
                    </div>
                </header>
            )}

            <div style={styles.statusBar}>
                {!studioMode && (
                    <div style={{ ...styles.statusBadge, background: apiHealth?.success ? 'rgba(0,255,136,0.1)' : 'rgba(255,71,87,0.1)', borderColor: apiHealth?.success ? 'rgba(0,255,136,0.3)' : 'rgba(255,71,87,0.3)', color: apiHealth?.success ? '#00ff88' : '#ff4757' }}>
                        {apiHealth?.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        <span>{apiHealth?.success ? t.apiOnline : t.apiOffline}</span>
                    </div>
                )}
                <div style={styles.actionButtons}>
                    {!studioMode && <button style={styles.actionBtn} onClick={checkHealth} disabled={loading}><Activity size={16} /><span>{t.checkHealth}</span></button>}
                    {!studioMode && (
                        <button style={styles.primaryBtn} onClick={analyzeNews} disabled={loading}>
                            {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Newspaper size={16} />}
                            <span>{t.analyzeNews}</span>
                        </button>
                    )}
                    {sentimentData && (
                        <>
                            <button style={{ ...styles.actionBtn, background: studioMode ? '#a855f7' : '#334155', color: studioMode ? '#fff' : '#cbd5e1' }} onClick={() => setStudioMode(!studioMode)}>
                                <Monitor size={16} /><span>{studioMode ? t.exitStudio : t.studioMode}</span>
                            </button>
                            <button style={{ ...styles.actionBtn, background: '#0ea5e9', color: '#fff', border: 'none' }} onClick={generateBrief}>
                                {copySuccess ? <CheckCircle size={16} /> : <FileText size={16} />}
                                <span>{copySuccess || t.generateBrief}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {error && <div style={styles.errorBox}><AlertCircle size={16} /><span>{t.error}: {error}</span><p style={styles.hint}>{t.hint}</p></div>}

            {sentimentData && (
                <div style={styles.contentWrapper}>
                    <div style={styles.resultsGrid}>
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}><BarChart3 size={20} /><span>{language === 'zh' ? '情绪分布' : language === 'ko' ? '감정 분포' : 'Sentiment Distribution'}</span></h3>
                                <span style={styles.cardHint}>{t.clickToFilter}</span>
                            </div>
                            <div style={styles.sentimentBars}>
                                {['positive', 'negative', 'neutral'].map(type => {
                                    const isSelected = filterType === type
                                    return (
                                        <div key={type}
                                            style={{ ...styles.sentimentRow, opacity: (filterType === 'all' || isSelected) ? 1 : 0.4, cursor: 'pointer' }}
                                            onClick={() => setFilterType(filterType === type ? 'all' : type)}
                                        >
                                            <div style={styles.sentimentLabel}>
                                                {type === 'positive' ? <TrendingUp size={16} style={{ color: getSentimentColor(type) }} /> : type === 'negative' ? <TrendingDown size={16} style={{ color: getSentimentColor(type) }} /> : <Minus size={16} style={{ color: getSentimentColor(type) }} />}
                                                <span style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{t[type]}</span>
                                            </div>
                                            <div style={styles.barContainer}>
                                                <div style={{ ...styles.bar, width: `${sentimentData.percentages[type]}%`, background: getSentimentColor(type) }} />
                                            </div>
                                            <span style={{ ...styles.percentage, color: getSentimentColor(type) }}>{sentimentData.percentages[type]}%</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>{t.totalAnalyzed}</h3>
                            <div style={styles.bigNumber}>{sentimentData.total_analyzed}</div>
                            <div style={styles.statGrid}>
                                <div style={styles.statItem}><TrendingUp size={20} style={{ color: '#00ff88' }} /><span style={styles.statValue}>{sentimentData.counts.positive}</span></div>
                                <div style={styles.statItem}><TrendingDown size={20} style={{ color: '#ff4757' }} /><span style={styles.statValue}>{sentimentData.counts.negative}</span></div>
                                <div style={styles.statItem}><Minus size={20} style={{ color: '#94a3b8' }} /><span style={styles.statValue}>{sentimentData.counts.neutral}</span></div>
                            </div>
                            {sentimentData.analyzed_at && <div style={styles.timestamp}>{t.lastUpdate}: {new Date(sentimentData.analyzed_at).toLocaleTimeString()}</div>}
                        </div>
                    </div>

                    {/* 📈 Chart Panel */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader} onClick={() => setShowChart(!showChart)}>
                            <h3 style={styles.cardTitle}><LineChart size={20} style={{ color: '#0ea5e9' }} /><span>{t.chartPanel}</span></h3>
                            <button style={{ ...styles.toggleBtn, background: 'transparent' }}>
                                {showChart ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                <span style={{ fontSize: 11 }}>{showChart ? t.hideChart : t.showChartBtn}</span>
                            </button>
                        </div>
                        {showChart && (
                            <>
                                <div style={styles.chartSymbolBar}>
                                    {[
                                        // Crypto (Binance)
                                        { label: 'BTC', symbol: 'BTCUSDT' },
                                        { label: 'ETH', symbol: 'ETHUSDT' },
                                        { label: 'SOL', symbol: 'SOLUSDT' },
                                        { label: 'BNB', symbol: 'BNBUSDT' },
                                        { label: 'XRP', symbol: 'XRPUSDT' },
                                        { label: 'DOGE', symbol: 'DOGEUSDT' },
                                        { label: 'ADA', symbol: 'ADAUSDT' },
                                        { label: 'AVAX', symbol: 'AVAXUSDT' },
                                        { label: 'LINK', symbol: 'LINKUSDT' },
                                        { label: 'DOT', symbol: 'DOTUSDT' },
                                        { label: 'MATIC', symbol: 'MATICUSDT' },
                                        { label: 'ATOM', symbol: 'ATOMUSDT' },
                                        { label: 'UNI', symbol: 'UNIUSDT' },
                                        { label: 'APT', symbol: 'APTUSDT' },
                                        { label: 'OP', symbol: 'OPUSDT' },
                                        { label: 'ARB', symbol: 'ARBUSDT' },
                                        { label: 'LTC', symbol: 'LTCUSDT' },
                                        { label: 'BCH', symbol: 'BCHUSDT' },
                                    ].map(item => (
                                        <button
                                            key={item.symbol}
                                            style={{ ...styles.chartSymbolBtn, ...(chartSymbol === item.symbol ? styles.chartSymbolBtnActive : {}) }}
                                            onClick={() => setChartSymbol(item.symbol)}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                                <div style={styles.chartContainer}>
                                    <TradingViewChart symbol={chartSymbol} height="100%" />
                                </div>
                            </>
                        )}
                    </div>

                    {/* 🔥 Hot Topics Section */}
                    {sentimentData.hot_topics && sentimentData.hot_topics.length > 0 && (
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}><Flame size={20} style={{ color: '#fbbf24' }} /><span>{t.hotTopics}</span></h3>
                            <div style={styles.topicGrid}>
                                {sentimentData.hot_topics.map((topic, idx) => (
                                    <div key={idx} style={styles.topicCard}>
                                        <div style={styles.topicHeader} onClick={() => setExpandedTopic(expandedTopic === idx ? null : idx)}>
                                            <div style={styles.topicInfo}>
                                                <div style={{ ...styles.badge, background: `${getSentimentColor(topic.sentiment)}20`, color: getSentimentColor(topic.sentiment) }}>
                                                    {t[topic.sentiment]}
                                                </div>
                                                <span style={styles.topicTitle}>{topic.title}</span>
                                            </div>
                                            <div style={styles.topicMeta}>
                                                <span>{topic.count} {t.topicCount}</span>
                                                <div style={{ transform: expandedTopic === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</div>
                                            </div>
                                        </div>
                                        {expandedTopic === idx && (
                                            <div style={styles.topicContent}>
                                                {topic.articles.map((article, aIdx) => (
                                                    <div key={aIdx} style={styles.miniArticle} onClick={() => setSelectedArticle(article)}>
                                                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: getSentimentColor(article.sentiment) }} />
                                                        <span style={styles.miniLink}>{article.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={styles.newsListCard}>
                        {/* News List Header */}
                        <div style={styles.newsListHeader}>
                            <h3 style={styles.cardTitle}><Filter size={20} /><span>{t.newsList} ({filteredNews.length})</span></h3>
                            <div style={styles.filterBadges}>
                                <span style={styles.filterLabel}>{t.filterBy}</span>
                                <button style={{ ...styles.filterBadge, ...(filterType === 'all' ? styles.activeFilter : {}) }} onClick={() => setFilterType('all')}>{t.all}</button>
                                <button style={{ ...styles.filterBadge, ...(filterType === 'positive' ? styles.activeFilter : {}) }} onClick={() => setFilterType('positive')}>{t.positive}</button>
                                <button style={{ ...styles.filterBadge, ...(filterType === 'negative' ? styles.activeFilter : {}) }} onClick={() => setFilterType('negative')}>{t.negative}</button>
                            </div>
                        </div>

                        <div style={styles.newsGrid}>
                            {filteredNews.length > 0 ? (
                                filteredNews.map((item, index) => (
                                    <div key={index} style={styles.newsItem}>
                                        <div style={styles.newsHeader}>
                                            <div style={{ ...styles.sentimentBadge, color: getSentimentColor(item.sentiment), borderColor: `${getSentimentColor(item.sentiment)}40`, background: `${getSentimentColor(item.sentiment)}10` }}>
                                                {item.sentiment === 'positive' ? <TrendingUp size={12} /> : item.sentiment === 'negative' ? <TrendingDown size={12} /> : <Minus size={12} />}
                                                <span>{t[item.sentiment]}</span>
                                            </div>
                                            <span style={styles.confidence}>{t.score}: {Math.round(item.confidence * 100)}%</span>
                                            <span style={styles.source}>{item.source}</span>
                                        </div>

                                        <h4 style={styles.newsTitle}>{item.title}</h4>
                                        {/* Tickers Tags */}
                                        {item.tickers && item.tickers.length > 0 && (
                                            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                                                {item.tickers.map((ticker, tIdx) => (
                                                    <span key={tIdx} style={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        color: '#e2e8f0',
                                                        background: 'rgba(148, 163, 184, 0.1)',
                                                        padding: '2px 8px',
                                                        borderRadius: 4,
                                                        border: '1px solid rgba(148, 163, 184, 0.2)',
                                                        fontFamily: '"JetBrains Mono", monospace'
                                                    }}>
                                                        {ticker}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div style={styles.newsFooter}>
                                            <span style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</span>
                                            <button style={styles.readMoreBtn} onClick={() => setSelectedArticle(item)}>
                                                <BookOpen size={12} />
                                                <span>{t.readMore}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (<div style={styles.emptyState}>No news found for this filter</div>)}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Reading */}
            {selectedArticle && (
                <ArticleModal
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                    t={t}
                />
            )}
        </div>
    )
}

const styles = {
    // ... (keep previous styles)
    container: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', padding: 'var(--space-6)', height: '100%', overflow: 'auto' },
    loginCard: { maxWidth: 400, margin: '100px auto', padding: 40, background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(99,102,241,0.05) 100%)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 24, textAlign: 'center' },
    loginIcon: { color: '#a855f7', marginBottom: 24 },
    loginTitle: { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#fff' },
    loginSubtitle: { margin: '8px 0 32px', color: '#94a3b8', fontSize: '0.9rem' },
    inputGroup: { marginBottom: 20, textAlign: 'left' },
    label: { display: 'block', marginBottom: 8, fontSize: '0.875rem', color: '#94a3b8' },
    input: { width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: '1rem', outline: 'none' },
    authButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', border: 'none', borderRadius: 12, color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
    header: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
    backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#94a3b8', fontSize: '0.875rem', cursor: 'pointer', width: 'fit-content' },
    title: { display: 'flex', alignItems: 'center', gap: 12, margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#fff' },
    subtitle: { margin: '8px 0 0', color: '#64748b', fontSize: '0.9rem' },
    statusBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' },
    statusBadge: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, border: '1px solid', fontSize: '0.875rem', fontWeight: 600 },
    actionButtons: { display: 'flex', gap: 12 },
    actionBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: '0.875rem', cursor: 'pointer' },
    primaryBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', border: 'none', borderRadius: 10, color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' },
    errorBox: { display: 'flex', flexDirection: 'column', gap: 8, padding: 16, background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: 12, color: '#ff4757', fontSize: '0.875rem' },
    hint: { margin: 0, opacity: 0.7, fontSize: '0.8rem' },
    contentWrapper: { display: 'flex', flexDirection: 'column', gap: 24 },
    resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 },
    card: { padding: 24, background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20 },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    cardTitle: { display: 'flex', alignItems: 'center', gap: 10, margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#fff' },
    cardHint: { fontSize: '0.75rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 4 },
    sentimentBars: { display: 'flex', flexDirection: 'column', gap: 16 },
    sentimentRow: { display: 'flex', alignItems: 'center', gap: 12, transition: 'opacity 0.2s' },
    sentimentLabel: { display: 'flex', alignItems: 'center', gap: 6, width: 80, fontSize: '0.875rem', color: '#94a3b8' },
    barContainer: { flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' },
    bar: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
    percentage: { width: 50, textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' },
    bigNumber: { fontSize: '3rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', textAlign: 'center', marginBottom: 20 },
    statGrid: { display: 'flex', justifyContent: 'center', gap: 32 },
    statItem: { display: 'flex', alignItems: 'center', gap: 8 },
    statValue: { fontSize: '1.25rem', fontWeight: 700, color: '#fff' },
    timestamp: { marginTop: 16, textAlign: 'center', fontSize: '0.75rem', color: '#64748b' },
    // News List Styles
    newsListCard: { padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, minHeight: 400 },
    newsListHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
    filterBadges: { display: 'flex', alignItems: 'center', gap: 8 },
    filterLabel: { fontSize: '0.875rem', color: '#64748b', marginRight: 4 },
    filterBadge: { padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' },
    activeFilter: { background: 'rgba(255,255,255,0.1)', borderColor: '#a855f7', color: '#fff' },
    newsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 },
    newsItem: { padding: 16, background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default', ':hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' } },
    newsHeader: { display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.75rem' },
    sentimentBadge: { display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 12, border: '1px solid', fontWeight: 600, fontSize: '0.7rem' },
    confidence: { color: '#64748b' },
    source: { color: '#94a3b8', marginLeft: 'auto' },
    newsTitle: { margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    newsFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' },
    date: { fontSize: '0.75rem', color: '#64748b' },
    readMoreLink: { display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#a855f7', textDecoration: 'none', ':hover': { textDecoration: 'underline' } },
    emptyState: { gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: '#64748b', fontStyle: 'italic' },
    // Topic Styles
    topicGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 },
    topicCard: { background: 'rgba(0,0,0,0.2)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' },
    topicHeader: { padding: 16, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', ':hover': { background: 'rgba(255,255,255,0.02)' } },
    topicInfo: { display: 'flex', alignItems: 'center', gap: 12 },
    badge: { padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 },
    topicTitle: { fontSize: '1rem', fontWeight: 600, color: '#e2e8f0' },
    topicMeta: { display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#94a3b8' },
    topicContent: { padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 },
    miniArticle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer', ':hover': { opacity: 0.8 } },
    miniLink: { color: '#94a3b8', textDecoration: 'underline', ':hover': { color: '#a855f7' } },

    // Read More Button
    readMoreBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: 'rgba(168,85,247,0.1)',
        border: '1px solid rgba(168,85,247,0.2)',
        borderRadius: 8,
        color: '#a855f7',
        fontSize: '0.75rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        ':hover': { background: 'rgba(168,85,247,0.2)' }
    },

    // Modal Styles
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40
    },
    modalContent: {
        width: '100%',
        maxWidth: 800,
        height: '90vh',
        background: '#1a1b26',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
    },
    modalHeader: {
        padding: 24,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        background: 'rgba(0,0,0,0.2)'
    },
    modalTitleMeta: { flex: 1 },
    articleTitle: { margin: '0 0 8px', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 },
    articleDate: { fontSize: '0.875rem', color: '#94a3b8' },
    externalLink: { color: '#a855f7', opacity: 0.7, ':hover': { opacity: 1 } },
    closeButton: {
        background: 'transparent',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: 8,
        borderRadius: 8,
        ':hover': { background: 'rgba(255,255,255,0.1)', color: '#fff' }
    },

    modalBody: {
        padding: 40,
        overflowY: 'auto',
        flex: 1,
        // Improved Typography
        lineHeight: 1.85,
        fontSize: '1.15rem',
        color: '#e2e8f0',
        fontFamily: "'Merriweather', 'Georgia', serif", // Premium serif for reading
        letterSpacing: '0.01em',
        maxWidth: '100%'
    },
    loadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 16,
        color: '#94a3b8'
    },
    errorState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 16,
        color: '#ff4757'
    },
    fallbackLink: {
        color: '#a855f7',
        textDecoration: 'underline',
        fontSize: '1rem'
    },
    // Article formatting
    articleText: {
        ' img': { maxWidth: '100%', height: 'auto', borderRadius: 12, margin: '20px 0' },
        ' p': { marginBottom: 24 },
        ' h1, h2, h3': { color: '#fff', marginTop: 40, marginBottom: 16 },
        ' a': { color: '#a855f7', textDecoration: 'underline' },
        ' ul, ol': { paddingLeft: 24, marginBottom: 24 },
        ' li': { marginBottom: 8 }
    },
    // Chart Panel
    chartSymbolBar: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
    chartSymbolBtn: {
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    chartSymbolBtnActive: {
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)',
        borderColor: 'rgba(14, 165, 233, 0.5)',
        color: '#0ea5e9',
        boxShadow: '0 0 12px rgba(14, 165, 233, 0.2)'
    },
    chartContainer: {
        height: 800,
        width: '100%',
        background: '#0a0a0f'
    },
    toggleBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        cursor: 'pointer'
    }
}

export default AdminSentimentView
