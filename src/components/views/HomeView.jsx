import React, { useState, useEffect } from 'react'
import {
    BarChart3, Globe, GraduationCap,
    ArrowRight, TrendingUp, Star,
    FileText, BookOpen, Newspaper, ChevronRight,
    Play, Clock, Eye, Flame, Zap, Award, Target
} from 'lucide-react'
import { db, TABLES } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'
import { useAppState } from '../../context/AppContext'
import NewsletterSubscribe from '../NewsletterSubscribe'

/**
 * HomeView - Premium Korean Style v3
 * 깔끔하고 고급스러운 한국 스타일
 */

function AnimatedCounter({ value, duration = 1500 }) {
    const [displayValue, setDisplayValue] = useState(0)
    useEffect(() => {
        if (value === 0) { setDisplayValue(0); return }
        let startTime
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            setDisplayValue(Math.floor((1 - Math.pow(1 - progress, 3)) * value))
            if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }, [value, duration])
    return <span>{displayValue}</span>
}

function HomeView({ onNavigate }) {
    const { t } = useI18n()
    const { theme } = useAppState()
    const isDark = theme === 'dark'

    const [stats, setStats] = useState({ brief: 0, analysis: 0, lab: 0, news: 0 })
    const [recentArticles, setRecentArticles] = useState([])
    const [hoveredCard, setHoveredCard] = useState(null)

    // 메인 모듈
    const modules = [
        { id: 'dashboard', icon: BarChart3, title: '대시보드', desc: '실시간 시장 데이터', color: '#3b82f6' },
        { id: 'analysis', icon: TrendingUp, title: '분석 리포트', desc: '전문가 시장 분석', color: '#10b981' },
        { id: 'news', icon: Newspaper, title: '마켓 뉴스', desc: '글로벌 시장 소식', color: '#f59e0b' },
        { id: 'lab', icon: GraduationCap, title: '트레이딩 학습', desc: '체계적인 교육 과정', color: '#8b5cf6' },
    ]

    // 인기 콘텐츠 (더미 데이터)
    const popularContent = [
        { title: '비트코인 기술적 분석: 2024년 전망', views: '1.2K', category: '분석', hot: true },
        { title: '리스크 관리의 기본 원칙', views: '856', category: '학습', hot: false },
        { title: '이더리움 업그레이드 영향 분석', views: '723', category: '분석', hot: true },
        { title: '초보자를 위한 차트 읽기', views: '645', category: '학습', hot: false },
    ]

    useEffect(() => {
        const loadData = async () => {
            try {
                const [briefs, analysis, news, courses] = await Promise.all([
                    db.getAll(TABLES.BRIEFS, { filters: { is_published: true } }),
                    db.getAll(TABLES.ANALYSIS, { filters: { is_published: true } }),
                    db.getAll(TABLES.NEWS, { filters: { is_published: true } }),
                    db.getAll(TABLES.LAB_COURSES, { filters: { is_published: true } }),
                ])
                setStats({
                    brief: briefs?.length || 0,
                    analysis: analysis?.length || 0,
                    news: news?.length || 0,
                    lab: courses?.length || 0,
                })
                setRecentArticles(analysis?.slice(0, 3) || [])
            } catch (err) {
                console.error('Failed to load data:', err)
            }
        }
        loadData()
    }, [])

    const c = {
        bg: isDark ? '#0a0a0f' : '#ffffff',
        cardBg: isDark ? '#12121a' : '#f8fafc',
        cardBorder: isDark ? '#1e1e2d' : '#e2e8f0',
        text: isDark ? '#ffffff' : '#0f172a',
        textSec: isDark ? '#94a3b8' : '#64748b',
        accent: '#3b82f6',
    }

    return (
        <div style={{ ...styles.container, background: c.bg }}>
            {/* 히어로 섹션 */}
            <section style={styles.hero}>
                <div style={styles.heroInner}>
                    {/* 왼쪽: 텍스트 */}
                    <div style={styles.heroText}>
                        <div style={styles.badge}>
                            <Zap size={14} style={{ color: '#f59e0b' }} />
                            <span>실시간 업데이트</span>
                        </div>

                        <h1 style={{ ...styles.heroTitle, color: c.text }}>
                            스마트한 투자의 시작,<br />
                            <span style={styles.heroGradient}>TRAN Trading Lab</span>
                        </h1>

                        <p style={{ ...styles.heroDesc, color: c.textSec }}>
                            전문가의 시장 분석, 체계적인 학습 콘텐츠,<br />
                            실시간 뉴스까지 한 곳에서 만나보세요.
                        </p>

                        {/* 통계 */}
                        <div style={styles.statsInline}>
                            <div style={styles.statInline}>
                                <span style={{ ...styles.statNum, color: c.text }}>
                                    <AnimatedCounter value={stats.analysis + stats.brief} />+
                                </span>
                                <span style={{ color: c.textSec }}>분석 리포트</span>
                            </div>
                            <div style={styles.statDivider} />
                            <div style={styles.statInline}>
                                <span style={{ ...styles.statNum, color: c.text }}>
                                    <AnimatedCounter value={stats.lab} />+
                                </span>
                                <span style={{ color: c.textSec }}>강의 콘텐츠</span>
                            </div>
                            <div style={styles.statDivider} />
                            <div style={styles.statInline}>
                                <span style={{ ...styles.statNum, color: c.text }}>24/7</span>
                                <span style={{ color: c.textSec }}>실시간 업데이트</span>
                            </div>
                        </div>

                        <div style={styles.heroButtons}>
                            <button style={styles.btnPrimary} onClick={() => onNavigate?.('dashboard')}>
                                시작하기 <ArrowRight size={18} />
                            </button>
                            <button style={{ ...styles.btnSecondary, color: c.text, borderColor: c.cardBorder }}>
                                <Play size={16} /> 소개 영상
                            </button>
                        </div>
                    </div>

                    {/* 오른쪽: 카드 그리드 */}
                    <div style={styles.heroCards}>
                        {modules.map((mod, i) => (
                            <div
                                key={mod.id}
                                style={{
                                    ...styles.miniCard,
                                    background: c.cardBg,
                                    borderColor: hoveredCard === mod.id ? mod.color : c.cardBorder,
                                    transform: hoveredCard === mod.id ? 'translateY(-4px)' : 'none',
                                }}
                                onClick={() => onNavigate?.(mod.id)}
                                onMouseEnter={() => setHoveredCard(mod.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div style={{ ...styles.miniIcon, background: `${mod.color}15`, color: mod.color }}>
                                    <mod.icon size={22} />
                                </div>
                                <div>
                                    <div style={{ ...styles.miniTitle, color: c.text }}>{mod.title}</div>
                                    <div style={{ ...styles.miniDesc, color: c.textSec }}>{mod.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 콘텐츠 그리드 */}
            <div style={styles.contentGrid}>
                {/* 인기 콘텐츠 */}
                <section style={{ ...styles.section, background: c.cardBg, borderColor: c.cardBorder }}>
                    <div style={styles.sectionHeader}>
                        <h2 style={{ ...styles.sectionTitle, color: c.text }}>
                            <Flame size={20} style={{ color: '#ef4444' }} />
                            인기 콘텐츠
                        </h2>
                        <button style={{ ...styles.viewAll, color: c.accent }}>
                            전체보기 <ChevronRight size={16} />
                        </button>
                    </div>
                    <div style={styles.contentList}>
                        {popularContent.map((item, i) => (
                            <div key={i} style={{ ...styles.contentItem, borderColor: c.cardBorder }}>
                                <div style={styles.contentInfo}>
                                    {item.hot && <span style={styles.hotBadge}>HOT</span>}
                                    <span style={{ ...styles.categoryBadge, color: c.textSec }}>{item.category}</span>
                                </div>
                                <div style={{ ...styles.contentTitle, color: c.text }}>{item.title}</div>
                                <div style={{ ...styles.contentMeta, color: c.textSec }}>
                                    <Eye size={14} /> {item.views} views
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 빠른 시작 */}
                <section style={{ ...styles.section, background: c.cardBg, borderColor: c.cardBorder }}>
                    <div style={styles.sectionHeader}>
                        <h2 style={{ ...styles.sectionTitle, color: c.text }}>
                            <Target size={20} style={{ color: '#10b981' }} />
                            빠른 시작
                        </h2>
                    </div>
                    <div style={styles.quickLinks}>
                        {[
                            { icon: BarChart3, label: '시장 현황 보기', route: 'dashboard', color: '#3b82f6' },
                            { icon: TrendingUp, label: '최신 분석 읽기', route: 'analysis', color: '#10b981' },
                            { icon: BookOpen, label: '학습 시작하기', route: 'lab', color: '#8b5cf6' },
                            { icon: Newspaper, label: '오늘의 뉴스', route: 'news', color: '#f59e0b' },
                        ].map((link, i) => (
                            <button
                                key={i}
                                style={{ ...styles.quickLink, borderColor: c.cardBorder }}
                                onClick={() => onNavigate?.(link.route)}
                            >
                                <div style={{ ...styles.quickIcon, background: `${link.color}15`, color: link.color }}>
                                    <link.icon size={18} />
                                </div>
                                <span style={{ color: c.text }}>{link.label}</span>
                                <ChevronRight size={16} style={{ color: c.textSec }} />
                            </button>
                        ))}
                    </div>
                </section>

                {/* 통계 카드 */}
                <section style={{ ...styles.section, background: c.cardBg, borderColor: c.cardBorder }}>
                    <div style={styles.sectionHeader}>
                        <h2 style={{ ...styles.sectionTitle, color: c.text }}>
                            <Award size={20} style={{ color: '#f59e0b' }} />
                            플랫폼 현황
                        </h2>
                    </div>
                    <div style={styles.statsGrid}>
                        {[
                            { label: '분석 리포트', value: stats.analysis, color: '#10b981' },
                            { label: '마켓 브리핑', value: stats.brief, color: '#3b82f6' },
                            { label: '뉴스 기사', value: stats.news, color: '#f59e0b' },
                            { label: '학습 강의', value: stats.lab, color: '#8b5cf6' },
                        ].map((stat, i) => (
                            <div key={i} style={{ ...styles.statBox, borderColor: c.cardBorder }}>
                                <div style={{ ...styles.statBoxValue, color: stat.color }}>
                                    <AnimatedCounter value={stat.value} />
                                </div>
                                <div style={{ ...styles.statBoxLabel, color: c.textSec }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* 뉴스레터 */}
            <section style={{ marginTop: 40, marginBottom: 40 }}>
                <NewsletterSubscribe />
            </section>

            {/* 푸터 */}
            <footer style={{ ...styles.footer, borderColor: c.cardBorder }}>
                <div style={styles.footerInner}>
                    <div style={styles.footerBrand}>
                        <Star size={18} style={{ color: '#f59e0b' }} />
                        <span style={{ color: c.text }}>TRAN Trading Lab</span>
                    </div>
                    <p style={{ color: c.textSec, margin: 0, fontSize: 13 }}>
                        © 2024 TRAN Trading Lab. 당신의 성공적인 투자를 응원합니다.
                    </p>
                </div>
            </footer>
        </div>
    )
}

const styles = {
    container: { padding: '24px 32px', height: '100%', overflow: 'auto', maxWidth: 1400, margin: '0 auto' },

    // 히어로
    hero: { marginBottom: 32 },
    heroInner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' },
    heroText: { maxWidth: 560 },
    badge: {
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', background: 'rgba(245, 158, 11, 0.1)',
        borderRadius: 20, fontSize: 13, fontWeight: 500, color: '#f59e0b', marginBottom: 20
    },
    heroTitle: { fontSize: 40, fontWeight: 700, lineHeight: 1.3, margin: '0 0 20px', letterSpacing: '-1px' },
    heroGradient: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
    },
    heroDesc: { fontSize: 16, lineHeight: 1.7, margin: '0 0 28px' },
    statsInline: { display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 },
    statInline: { display: 'flex', flexDirection: 'column', gap: 2 },
    statNum: { fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" },
    statDivider: { width: 1, height: 36, background: 'rgba(148, 163, 184, 0.2)' },
    heroButtons: { display: 'flex', gap: 12 },
    btnPrimary: {
        display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600,
        cursor: 'pointer', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
    },
    btnSecondary: {
        display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
        background: 'transparent', border: '1.5px solid', borderRadius: 10,
        fontSize: 15, fontWeight: 500, cursor: 'pointer'
    },

    // 히어로 카드
    heroCards: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    miniCard: {
        display: 'flex', alignItems: 'center', gap: 14, padding: 18,
        borderRadius: 14, border: '1px solid', cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    miniIcon: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    miniTitle: { fontSize: 15, fontWeight: 600, marginBottom: 2 },
    miniDesc: { fontSize: 13 },

    // 콘텐츠 그리드
    contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 },
    section: { padding: 24, borderRadius: 16, border: '1px solid' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, fontWeight: 600, margin: 0 },
    viewAll: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' },

    // 인기 콘텐츠
    contentList: { display: 'flex', flexDirection: 'column', gap: 12 },
    contentItem: { padding: 14, borderRadius: 10, border: '1px solid' },
    contentInfo: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
    hotBadge: { padding: '2px 8px', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 4 },
    categoryBadge: { fontSize: 12 },
    contentTitle: { fontSize: 14, fontWeight: 500, marginBottom: 8, lineHeight: 1.4 },
    contentMeta: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 },

    // 빠른 시작
    quickLinks: { display: 'flex', flexDirection: 'column', gap: 10 },
    quickLink: {
        display: 'flex', alignItems: 'center', gap: 12, padding: 14,
        borderRadius: 10, border: '1px solid', background: 'transparent',
        cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: 14, fontWeight: 500,
        transition: 'all 0.2s ease'
    },
    quickIcon: { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },

    // 통계 그리드
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
    statBox: { padding: 16, borderRadius: 10, border: '1px solid', textAlign: 'center' },
    statBoxValue: { fontSize: 28, fontWeight: 700, marginBottom: 4, fontFamily: "'Space Grotesk', sans-serif" },
    statBoxLabel: { fontSize: 12 },

    // 푸터
    footer: { padding: '32px 0', borderTop: '1px solid', marginTop: 20 },
    footerInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
    footerBrand: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600 },
}

// 애니메이션
const sheet = document.createElement('style')
sheet.textContent = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 1100px) { .hero-inner { grid-template-columns: 1fr !important; } }
@media (max-width: 900px) { .content-grid { grid-template-columns: 1fr !important; } }
`
if (!document.head.querySelector('#home-v3')) { sheet.id = 'home-v3'; document.head.appendChild(sheet) }

export default HomeView
