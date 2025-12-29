import React, { useState, useEffect } from 'react'
import { BookOpen, ChevronRight, TrendingUp, Inbox, FlaskConical, ArrowRight, FileText, Calculator } from 'lucide-react'
import { db, TABLES, supabase } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'
import { useAppState } from '../../context/AppContext'
import CourseDetailView from './CourseDetailView'
import KellySimulator from '../experiments/KellySimulator'
import KellyArticle from '../experiments/KellyArticle'

// 互动实验工具列表 - 现在包含文章和模拟器两个模式
const INTERACTIVE_TOOLS = [
    {
        id: 'kelly-article',
        titleZh: '凯利公式：资金管理的秘密',
        titleEn: 'Kelly Criterion: Secret of Money Management',
        titleKo: '켈리 공식: 자금 관리의 비밀',
        descZh: '为什么胜率60%账户还是会归零？深入理解凯利公式的数学原理和实战应用。',
        descEn: 'Why does a 60% win rate still lead to zero? Deep dive into Kelly math and practical application.',
        descKo: '왜 승률 60%인데 계좌는 0원이 될까? 켈리 공식의 수학적 원리와 실전 적용.',
        icon: FileText,
        color: '#818cf8',
        type: 'article'
    },
    {
        id: 'kelly-simulator',
        titleZh: '凯利公式模拟器',
        titleEn: 'Kelly Criterion Simulator',
        titleKo: '켈리 기준 시뮬레이터',
        descZh: '使用蒙特卡洛模拟可视化凯利公式的最优仓位管理策略。',
        descEn: 'Visualize optimal position sizing using Kelly Criterion with Monte Carlo simulation.',
        descKo: '몬테카를로 시뮬레이션을 통해 켈리 기준의 최적 포지션 사이징을 시각화합니다.',
        icon: Calculator,
        color: '#00ff88',
        type: 'simulator'
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
        if (activeTool.type === 'article') {
            return (
                <KellyArticle
                    onBack={() => setActiveTool(null)}
                    onOpenSimulator={() => setActiveTool(INTERACTIVE_TOOLS.find(t => t.type === 'simulator'))}
                />
            )
        } else if (activeTool.type === 'simulator') {
            return <KellySimulator onBack={() => setActiveTool(null)} />
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
                            <FlaskConical size={18} style={{ color: 'var(--accent-primary)' }} />
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
    spinner: { width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' },
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
    startBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-5)', background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: '600', color: '#000', cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(0, 210, 106, 0.3)' },
}

export default LabView
