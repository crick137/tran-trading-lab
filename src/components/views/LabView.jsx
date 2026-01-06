import React, { useState, useEffect } from 'react'
import { BookOpen, ChevronRight, TrendingUp, Inbox, FlaskConical, ArrowRight, FileText, Calculator, Target, Percent } from 'lucide-react'
import { db, TABLES, supabase } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'
import { useAppState } from '../../context/AppContext'
import CourseDetailView from './CourseDetailView'
import KellySimulator from '../experiments/KellySimulator'
import KellyArticle from '../experiments/KellyArticle'
import { PositionSizeCalculator, RiskRewardCalculator, CompoundCalculator } from '../tools/TradingCalculators'

// 互动实验工具列表 - 包含完整的凯利公式模块和交易计算器
const INTERACTIVE_TOOLS = [
    {
        id: 'kelly-complete',
        titleZh: '凯利公式完整教程',
        titleEn: 'Kelly Criterion Complete Guide',
        titleKo: '켈리 공식 완전 가이드',
        descZh: '包含深度文章解析和蒙特卡洛模拟器，完整掌握凯利公式的数学原理与实战应用。',
        descEn: 'Complete package with in-depth article and Monte Carlo simulator. Master Kelly Criterion math and practical application.',
        descKo: '심층 분석 문서와 몬테카를로 시뮬레이터를 포함. 켈리 공식의 수학적 원리와 실전 적용을 완벽하게 마스터하세요.',
        icon: Calculator,
        color: '#3b82f6',
        type: 'bundle',
        subTools: [
            { id: 'article', labelZh: '📖 理论文章', labelEn: '📖 Theory Article', labelKo: '📖 이론 문서', type: 'article' },
            { id: 'simulator', labelZh: '🧮 模拟器', labelEn: '🧮 Simulator', labelKo: '🧮 시뮬레이터', type: 'simulator' }
        ]
    },
    {
        id: 'position-size',
        titleZh: '仓位大小计算器',
        titleEn: 'Position Size Calculator',
        titleKo: '포지션 사이즈 계산기',
        descZh: '根据风险比例和止损点快速计算最优仓位大小',
        descEn: 'Calculate optimal position size based on risk percentage and stop loss',
        descKo: '리스크 비율과 스탑로스를 기반으로 최적의 포지션 사이즈 계산',
        icon: Calculator,
        color: '#3b82f6',
        type: 'position-calc'
    },
    {
        id: 'risk-reward',
        titleZh: '风险回报计算器',
        titleEn: 'Risk/Reward Calculator',
        titleKo: '리스크/리워드 계산기',
        descZh: '计算交易的盈亏比和盈亏平衡胜率',
        descEn: 'Calculate R:R ratio and break-even win rate for your trades',
        descKo: 'R:R 비율과 손익분기 승률을 계산하세요',
        icon: Target,
        color: '#fbbf24',
        type: 'rr-calc'
    },
    {
        id: 'compound',
        titleZh: '复利计算器',
        titleEn: 'Compound Growth Calculator',
        titleKo: '복리 계산기',
        descZh: '模拟复利增长，看看长期稳定收益的威力',
        descEn: 'Simulate compound growth and see the power of consistent returns',
        descKo: '복리 성장을 시뮬레이션하고 꾸준한 수익의 힘을 확인하세요',
        icon: Percent,
        color: '#a855f7',
        type: 'compound-calc'
    }
]

function LabView() {
    const { t, language } = useI18n()
    const { user } = useAppState()
    const [labCourses, setLabCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCourseId, setSelectedCourseId] = useState(null)
    const [activeTool, setActiveTool] = useState(null)
    const [userProgress, setUserProgress] = useState({})

    useEffect(() => {
        loadCourses()
    }, [])

    useEffect(() => {
        if (user) loadUserProgress()
    }, [user])

    const loadCourses = async () => {
        try {
            const data = await db.getAll(TABLES.LAB_COURSES, { orderBy: 'order_index' })
            setLabCourses(data || [])
        } catch (err) {
            console.error('Failed to load courses:', err)
            setLabCourses([])
        }
        setLoading(false)
    }

    const loadUserProgress = async () => {
        if (!user) return
        try {
            const { data } = await supabase
                .from('user_course_progress')
                .select('course_id, progress')
                .eq('user_id', user.id)

            if (data) {
                const progressMap = {}
                data.forEach(p => { progressMap[p.course_id] = p.progress })
                setUserProgress(progressMap)
            }
        } catch (err) {
            // Progress table might not exist yet
        }
    }

    const getLevelConfig = (level) => {
        const beginner = t('views.lab.beginner')
        const intermediate = t('views.lab.intermediate')
        const advanced = t('views.lab.advanced')

        if (level === beginner || level === '초급' || level === '初级' || level === 'Beginner') {
            return { color: 'var(--accent-bull)', bg: 'var(--accent-bull-dim)', label: beginner }
        }
        if (level === intermediate || level === '중급' || level === '中级' || level === 'Intermediate') {
            return { color: 'var(--accent-gold)', bg: 'var(--accent-gold-dim)', label: intermediate }
        }
        if (level === advanced || level === '고급' || level === '高级' || level === 'Advanced') {
            return { color: 'var(--accent-bear)', bg: 'var(--accent-bear-dim)', label: advanced }
        }
        return { color: 'var(--text-tertiary)', bg: 'rgba(255,255,255,0.05)', label: level || beginner }
    }

    const getProgressPercent = (courseId, totalLessons) => {
        const progress = userProgress[courseId] || 0
        return Math.round(((progress + 1) / (totalLessons || 1)) * 100)
    }

    const getToolTitle = (tool) => {
        if (language === 'zh') return tool.titleZh
        if (language === 'ko') return tool.titleKo
        return tool.titleEn
    }

    const getToolDesc = (tool) => {
        if (language === 'zh') return tool.descZh
        if (language === 'ko') return tool.descKo
        return tool.descEn
    }

    // 如果选中了课程，显示详情
    if (selectedCourseId) {
        return (
            <CourseDetailView
                courseId={selectedCourseId}
                onBack={() => {
                    setSelectedCourseId(null)
                    loadUserProgress()
                }}
            />
        )
    }

    // 如果选中了互动工具，根据类型显示不同组件
    if (activeTool) {
        // 直接显示文章
        if (activeTool.type === 'article' || activeTool.subType === 'article') {
            return (
                <KellyArticle
                    onBack={() => setActiveTool(null)}
                    onOpenSimulator={() => setActiveTool({ ...activeTool, subType: 'simulator' })}
                />
            )
        }
        // 直接显示模拟器
        if (activeTool.type === 'simulator' || activeTool.subType === 'simulator') {
            return <KellySimulator onBack={() => setActiveTool(null)} />
        }
        // 仓位计算器
        if (activeTool.type === 'position-calc') {
            return (
                <div style={styles.container}>
                    <button onClick={() => setActiveTool(null)} style={styles.backButton}>
                        ← {language === 'zh' ? '返回' : language === 'ko' ? '돌아가기' : 'Back'}
                    </button>
                    <PositionSizeCalculator />
                </div>
            )
        }
        // 风险收益计算器
        if (activeTool.type === 'rr-calc') {
            return (
                <div style={styles.container}>
                    <button onClick={() => setActiveTool(null)} style={styles.backButton}>
                        ← {language === 'zh' ? '返回' : language === 'ko' ? '돌아가기' : 'Back'}
                    </button>
                    <RiskRewardCalculator />
                </div>
            )
        }
        // 复利计算器
        if (activeTool.type === 'compound-calc') {
            return (
                <div style={styles.container}>
                    <button onClick={() => setActiveTool(null)} style={styles.backButton}>
                        ← {language === 'zh' ? '返回' : language === 'ko' ? '돌아가기' : 'Back'}
                    </button>
                    <CompoundCalculator />
                </div>
            )
        }
        // bundle类型 - 显示选择界面
        if (activeTool.type === 'bundle' && !activeTool.subType) {
            return (
                <div style={styles.container}>
                    <button onClick={() => setActiveTool(null)} style={styles.backButton}>
                        ← {language === 'zh' ? '返回' : language === 'ko' ? '돌아가기' : 'Back'}
                    </button>
                    <div style={styles.bundleSelector}>
                        <div style={styles.bundleHeader}>
                            <activeTool.icon size={48} style={{ color: activeTool.color }} />
                            <h2 style={styles.bundleTitle}>
                                {language === 'zh' ? activeTool.titleZh : language === 'ko' ? activeTool.titleKo : activeTool.titleEn}
                            </h2>
                            <p style={styles.bundleDesc}>
                                {language === 'zh' ? activeTool.descZh : language === 'ko' ? activeTool.descKo : activeTool.descEn}
                            </p>
                        </div>
                        <div style={styles.subToolsGrid}>
                            {activeTool.subTools.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => setActiveTool({ ...activeTool, subType: sub.type })}
                                    style={styles.subToolCard}
                                >
                                    <span style={styles.subToolLabel}>
                                        {language === 'zh' ? sub.labelZh : language === 'ko' ? sub.labelKo : sub.labelEn}
                                    </span>
                                    <ChevronRight size={20} style={{ color: '#64748b' }} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}><span style={styles.titleGradient}>{t('views.lab.title')}</span></h1>
                    <span style={styles.subtitle}>{t('views.lab.subtitle')}</span>
                </div>
            </header>

            {loading ? (
                <div style={styles.emptyState}><div style={styles.spinner} /><span>{t('common.loading')}</span></div>
            ) : (
                <div style={styles.contentWrapper}>
                    {/* 互动实验工具区块 */}
                    <section style={styles.toolsSection}>
                        <h2 style={styles.sectionHeader}>
                            <FlaskConical size={18} style={{ color: '#3b82f6' }} />
                            {language === 'ko' ? '인터랙티브 도구' : language === 'zh' ? '互动实验工具' : 'Interactive Tools'}
                        </h2>
                        <div style={styles.toolsGrid}>
                            {INTERACTIVE_TOOLS.map((tool) => {
                                const IconComponent = tool.icon
                                return (
                                    <article
                                        key={tool.id}
                                        style={styles.toolCard}
                                        onClick={() => setActiveTool(tool)}
                                    >
                                        <div style={{ ...styles.toolIcon, background: `${tool.color}20`, color: tool.color }}>
                                            <IconComponent size={24} />
                                        </div>
                                        <div style={styles.toolContent}>
                                            <h3 style={styles.toolTitle}>{getToolTitle(tool)}</h3>
                                            <p style={styles.toolDesc}>{getToolDesc(tool)}</p>
                                        </div>
                                        <ArrowRight size={16} style={styles.toolArrow} />
                                    </article>
                                )
                            })}
                        </div>
                    </section>

                    {/* 课程区块 */}
                    {labCourses.length > 0 && (
                        <section style={styles.coursesSection}>
                            <h2 style={styles.sectionHeader}>
                                <BookOpen size={18} style={{ color: 'var(--accent-gold)' }} />
                                {language === 'ko' ? '학습 과정' : language === 'zh' ? '学习课程' : 'Courses'}
                            </h2>
                            <div style={styles.coursesGrid}>
                                {labCourses.map((course, index) => {
                                    const levelConfig = getLevelConfig(course.level)
                                    const progress = userProgress[course.id] || 0
                                    const progressPercent = getProgressPercent(course.id, course.lessons)
                                    const hasStarted = progress > 0 || userProgress[course.id] !== undefined

                                    return (
                                        <article
                                            key={course.id}
                                            style={{ ...styles.courseCard, animationDelay: `${index * 100}ms` }}
                                            onClick={() => setSelectedCourseId(course.id)}
                                        >
                                            {course.image_url && (
                                                <div style={{
                                                    width: '100%',
                                                    height: 160,
                                                    borderRadius: 'var(--radius-lg)',
                                                    backgroundImage: `url(${course.image_url})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    marginBottom: 'var(--space-2)'
                                                }} />
                                            )}
                                            <div style={styles.courseHeader}>
                                                <div style={{ ...styles.levelBadge, background: levelConfig.bg, color: levelConfig.color }}>
                                                    {levelConfig.label}
                                                </div>
                                                <div style={styles.lessonCount}>
                                                    <BookOpen size={12} />
                                                    <span>{course.lessons || 0} {t('views.lab.lessons')}</span>
                                                </div>
                                            </div>
                                            <h3 style={styles.courseTitle}>{course.title}</h3>
                                            <p style={styles.courseDesc}>{course.description}</p>

                                            {user && hasStarted && (
                                                <div style={styles.progressSection}>
                                                    <div style={styles.progressInfo}>
                                                        <span>{language === 'ko' ? '진행률' : language === 'zh' ? '进度' : 'Progress'}</span>
                                                        <span style={styles.progressPercent}>{progressPercent}%</span>
                                                    </div>
                                                    <div style={styles.progressBar}>
                                                        <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
                                                    </div>
                                                </div>
                                            )}

                                            <div style={styles.courseFooter}>
                                                <button style={styles.startBtn}>
                                                    <span>
                                                        {hasStarted
                                                            ? (language === 'ko' ? '계속하기' : language === 'zh' ? '继续学习' : 'Continue')
                                                            : t('views.lab.startCourse')
                                                        }
                                                    </span>
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                </div>
            )}
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
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)', gap: 'var(--space-4)', flex: 1, minHeight: 0 },
    spinner: { width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    contentWrapper: { display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', overflow: 'auto', flex: 1 },
    toolsSection: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' },
    toolsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' },
    toolCard: { display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.3s ease' },
    toolIcon: { width: 48, height: 48, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    toolContent: { flex: 1, minWidth: 0 },
    toolTitle: { margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' },
    toolDesc: { margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 },
    toolArrow: { color: 'var(--text-muted)', flexShrink: 0 },
    coursesSection: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
    coursesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' },
    courseCard: { background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', animation: 'slide-up 0.4s ease forwards', opacity: 0, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(8px)', cursor: 'pointer' },
    courseHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    levelBadge: { padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '700', boxShadow: '0 0 12px currentColor' },
    lessonCount: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' },
    courseTitle: { margin: 0, fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.4 },
    courseDesc: { margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 },
    progressSection: { padding: 'var(--space-3) 0' },
    progressInfo: { display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 6 },
    progressPercent: { color: '#00ff88', fontWeight: 600, fontFamily: 'var(--font-mono)' },
    progressBar: { height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', background: 'linear-gradient(90deg, #00d26a, #00ff88)', borderRadius: 2, transition: 'width 0.4s ease' },
    courseFooter: { paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-light)' },
    startBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-5)', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: '600', color: '#fff', cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)' },
    // Bundle selector styles
    backButton: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', marginBottom: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' },
    bundleSelector: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 40px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24 },
    bundleHeader: { textAlign: 'center', marginBottom: 40 },
    bundleTitle: { margin: '20px 0 12px', fontSize: '2rem', fontWeight: 800, color: '#fff' },
    bundleDesc: { margin: 0, fontSize: '1rem', color: '#94a3b8', lineHeight: 1.8, maxWidth: 500 },
    subToolsGrid: { display: 'flex', gap: 20 },
    subToolCard: { display: 'flex', alignItems: 'center', gap: 16, padding: '20px 32px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, cursor: 'pointer', transition: 'all 0.3s ease' },
    subToolLabel: { fontSize: '1.1rem', fontWeight: 600, color: '#fff' }
}

export default LabView
