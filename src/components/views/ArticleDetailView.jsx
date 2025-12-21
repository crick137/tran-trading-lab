import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Calendar, Share2, Tag, ThumbsUp, MessageSquare, Bookmark } from 'lucide-react'
// Assuming no external markdown lib for now, will implement a simple renderer or just display text.
// Actually, let's just make a nice layout first.

function ArticleDetailView({ articleId, onBack, initialData }) {
    const [article, setArticle] = useState(initialData || null)
    const [loading, setLoading] = useState(!initialData)

    useEffect(() => {
        if (initialData) return

        // Simulate fetch if no initial data provided
        setTimeout(() => {
            setArticle({
                id: articleId,
                title: "비트코인 반감기 이후 시장 전망 분석",
                subtitle: "과거 데이터를 통한 패턴 분석과 2024년 시장 예측",
                author: {
                    name: "Kim Chartist",
                    avatar: "https://i.pravatar.cc/150?u=kim",
                    role: "Chief Analyst"
                },
                date: "2024. 04. 15",
                readTime: "5 min read",
                tags: ["Bitcoin", "Market Analysis", "Halving"],
                content: `
# 비트코인 반감기의 역사적 패턴

비트코인 반감기는 암호화폐 시장에서 가장 중요한 이벤트 중 하나입니다. 약 4년마다 발생하는 이 현상은 채굴 보상을 절반으로 줄여 공급 충격을 야기합니다.

## 과거 사이클 분석

1. **2012년 반감기**: 
   - 반감기 전: 횡보
   - 반감기 후: 12개월간 급격한 상승

2. **2016년 반감기**:
   - 반감기 전: 소폭 상승
   - 반감기 후: 18개월간의 불장

3. **2020년 반감기**:
   - 거시경제 변수와 맞물려 새로운 패턴 형성

## 2024년 전망

현재 기관 투자자들의 유입(ETF)과 맞물려 과거와는 다른 양상을 보일 가능성이 높습니다. 공급 쇼크는 여전히 유효하지만, 수요 측면의 변화가 더 큰 변수입니다.

### 주목해야 할 지표
- 현물 ETF 유입량
- 채굴자들의 보유량 변화
- 거시경제 금리 정책

### 결론
단기적인 변동성은 있겠지만, 장기적으로는 공급 감소에 따른 가격 상승 압력이 우세할 것으로 보입니다.
                `,
                likes: 124,
                comments: 45
            })
            setLoading(false)
        }, 800)
    }, [])

    if (loading) return (
        <div style={styles.loading}>
            <div style={styles.spinner} />
        </div>
    )

    return (
        <div style={styles.container}>
            <button style={styles.backBtn} onClick={onBack}>
                <ArrowLeft size={18} />
                <span>Back to Analysis</span>
            </button>

            <article style={styles.article}>
                <header style={styles.header}>
                    <div style={styles.tags}>
                        {article.tags.map(tag => (
                            <span key={tag} style={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                    <h1 style={styles.title}>{article.title}</h1>
                    <p style={styles.subtitle}>{article.subtitle}</p>

                    <div style={styles.meta}>
                        <div style={styles.author}>
                            <img src={article.author.avatar} alt={article.author.name} style={styles.avatar} />
                            <div style={styles.authorInfo}>
                                <span style={styles.authorName}>{article.author.name}</span>
                                <span style={styles.authorRole}>{article.author.role}</span>
                            </div>
                        </div>
                        <div style={styles.metaRight}>
                            <div style={styles.metaItem}>
                                <Calendar size={14} />
                                <span>{article.date}</span>
                            </div>
                            <div style={styles.metaItem}>
                                <Clock size={14} />
                                <span>{article.readTime}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={styles.content}>
                    {article.content.split('\n').map((line, i) => {
                        if (line.startsWith('# ')) return <h1 key={i} style={styles.h1}>{line.replace('# ', '')}</h1>
                        if (line.startsWith('## ')) return <h2 key={i} style={styles.h2}>{line.replace('## ', '')}</h2>
                        if (line.startsWith('### ')) return <h3 key={i} style={styles.h3}>{line.replace('### ', '')}</h3>
                        if (line.startsWith('- ')) return <li key={i} style={styles.li}>{line.replace('- ', '')}</li>
                        if (line.trim() === '') return <br key={i} />
                        return <p key={i} style={styles.p}>{line}</p>
                    })}
                </div>

                <footer style={styles.footer}>
                    <div style={styles.actions}>
                        <button style={styles.actionBtn}>
                            <ThumbsUp size={18} />
                            <span>{article.likes}</span>
                        </button>
                        <button style={styles.actionBtn}>
                            <MessageSquare size={18} />
                            <span>{article.comments}</span>
                        </button>
                        <button style={styles.actionBtn}>
                            <Bookmark size={18} />
                        </button>
                        <button style={styles.actionBtn}>
                            <Share2 size={18} />
                        </button>
                    </div>
                </footer>
            </article>
        </div>
    )
}

const styles = {
    container: {
        height: '100%',
        overflow: 'auto',
        background: '#020408',
        padding: '20px 40px',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
    },
    loading: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        width: 30,
        height: 30,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#00ff88',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        fontSize: 14,
        marginBottom: 30,
        transition: 'color 0.2s',
    },
    article: {
        maxWidth: 800,
        margin: '0 auto',
        paddingBottom: 60,
    },
    header: {
        marginBottom: 40,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: 30,
    },
    tags: {
        display: 'flex',
        gap: 10,
        marginBottom: 20,
    },
    tag: {
        fontSize: 12,
        color: '#00ff88',
        background: 'rgba(0, 255, 136, 0.1)',
        padding: '4px 10px',
        borderRadius: 20,
        fontWeight: 600,
    },
    title: {
        fontSize: 36,
        fontWeight: 800,
        marginBottom: 16,
        lineHeight: 1.3,
        background: 'linear-gradient(90deg, #fff, #a5b4fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: 20,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 30,
        lineHeight: 1.5,
    },
    meta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    author: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '2px solid rgba(0,255,136,0.3)',
    },
    authorInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    authorName: {
        fontSize: 14,
        fontWeight: 700,
        color: '#fff',
    },
    authorRole: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },
    metaRight: {
        display: 'flex',
        gap: 20,
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
    },
    content: {
        fontSize: 16,
        lineHeight: 1.8,
        color: 'rgba(255,255,255,0.9)',
    },
    h1: { fontSize: 28, fontWeight: 700, marginTop: 40, marginBottom: 20, color: '#fff' },
    h2: { fontSize: 24, fontWeight: 700, marginTop: 30, marginBottom: 16, color: '#e2e8f0' },
    h3: { fontSize: 20, fontWeight: 600, marginTop: 24, marginBottom: 12, color: '#cbd5e1' },
    p: { marginBottom: 16 },
    li: { marginLeft: 20, marginBottom: 8, listStyleType: 'disc' },
    footer: {
        marginTop: 60,
        paddingTop: 30,
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    actions: {
        display: 'flex',
        gap: 20,
        justifyContent: 'center',
    },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        color: 'rgba(255,255,255,0.8)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: 14,
        fontWeight: 600,
    },
}

export default ArticleDetailView
