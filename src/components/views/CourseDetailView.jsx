import React, { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, CheckCircle, Clock, Star, Award, ChevronRight, ChevronLeft, PlayCircle, FileText } from 'lucide-react'
import { db, TABLES, supabase } from '../../lib/supabase'
import { useAppState } from '../../context/AppContext'
import { useI18n } from '../../hooks/useI18n'

function CourseDetailView({ courseId, onBack }) {
    const { t, language } = useI18n()
    const { user } = useAppState()
    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [currentLesson, setCurrentLesson] = useState(0)

    useEffect(() => {
        loadCourse()
        if (user) loadProgress()
    }, [courseId, user])

    const loadCourse = async () => {
        try {
            const data = await db.getById(TABLES.LAB_COURSES, courseId)
            setCourse(data)
        } catch (err) {
            console.error('Failed to load course:', err)
        }
        setLoading(false)
    }

    const loadProgress = async () => {
        if (!user) return
        try {
            const { data } = await supabase
                .from('user_course_progress')
                .select('progress')
                .eq('user_id', user.id)
                .eq('course_id', courseId)
                .single()
            if (data) {
                setProgress(data.progress)
                setCurrentLesson(data.progress)
            }
        } catch (err) {
            // No progress yet, that's fine
        }
    }

    const saveProgress = async (lessonIndex) => {
        if (!user) return
        try {
            const { data: existing } = await supabase
                .from('user_course_progress')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', courseId)
                .single()

            if (existing) {
                await supabase
                    .from('user_course_progress')
                    .update({ progress: lessonIndex, updated_at: new Date().toISOString() })
                    .eq('id', existing.id)
            } else {
                await supabase
                    .from('user_course_progress')
                    .insert({ user_id: user.id, course_id: courseId, progress: lessonIndex })
            }
            setProgress(lessonIndex)
        } catch (err) {
            console.error('Failed to save progress:', err)
        }
    }

    const handleNextLesson = () => {
        if (currentLesson < (course?.lessons || 1) - 1) {
            const nextLesson = currentLesson + 1
            setCurrentLesson(nextLesson)
            if (nextLesson > progress) {
                saveProgress(nextLesson)
            }
        }
    }

    const handlePrevLesson = () => {
        if (currentLesson > 0) {
            setCurrentLesson(currentLesson - 1)
        }
    }

    const labels = {
        back: language === 'ko' ? '뒤로' : language === 'zh' ? '返回' : 'Back',
        lesson: language === 'ko' ? '레슨' : language === 'zh' ? '课时' : 'Lesson',
        progress: language === 'ko' ? '진행률' : language === 'zh' ? '进度' : 'Progress',
        complete: language === 'ko' ? '완료' : language === 'zh' ? '完成' : 'Complete',
        next: language === 'ko' ? '다음' : language === 'zh' ? '下一课' : 'Next',
        prev: language === 'ko' ? '이전' : language === 'zh' ? '上一课' : 'Previous',
        notFound: language === 'ko' ? '과정을 찾을 수 없습니다' : language === 'zh' ? '未找到课程' : 'Course not found',
    }

    const getLevelConfig = (level) => {
        if (level === '초급' || level === '初级' || level === 'Beginner') {
            return { color: '#00ff88', bg: 'rgba(0, 255, 136, 0.1)', label: language === 'ko' ? '초급' : language === 'zh' ? '初级' : 'Beginner' }
        }
        if (level === '중급' || level === '中级' || level === 'Intermediate') {
            return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', label: language === 'ko' ? '중급' : language === 'zh' ? '中级' : 'Intermediate' }
        }
        if (level === '고급' || level === '高级' || level === 'Advanced') {
            return { color: '#ff4466', bg: 'rgba(255, 68, 102, 0.1)', label: language === 'ko' ? '고급' : language === 'zh' ? '高级' : 'Advanced' }
        }
        return { color: 'var(--text-tertiary)', bg: 'rgba(255,255,255,0.05)', label: level }
    }

    if (loading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner} />
                <span>{t('common.loading')}</span>
            </div>
        )
    }

    if (!course) {
        return (
            <div style={styles.container}>
                <button style={styles.backBtn} onClick={onBack}>
                    <ArrowLeft size={18} />
                    <span>{labels.back}</span>
                </button>
                <div style={styles.notFound}>
                    <BookOpen size={48} style={{ opacity: 0.3 }} />
                    <p>{labels.notFound}</p>
                </div>
            </div>
        )
    }

    const levelConfig = getLevelConfig(course.level)
    const totalLessons = course.lessons || 1
    const progressPercent = Math.round(((progress + 1) / totalLessons) * 100)

    // 模拟课程内容（实际应从course.content解析）
    const lessonContent = course.content || `
# ${course.title}

${course.description}

---

## ${labels.lesson} ${currentLesson + 1}

这是课程内容的占位符。实际内容应该从数据库的 \`content\` 字段中获取并以 Markdown 格式渲染。

### 核心概念

1. **风险管理** - 保护您的资本是交易中最重要的方面
2. **技术分析** - 学习如何阅读图表和识别模式
3. **交易心理** - 控制情绪，保持纪律

### 实践练习

尝试在模拟账户中应用这些概念，记录您的交易并分析结果。

> 💡 **提示**: 每次交易前都问自己：我的止损在哪里？我的目标是什么？

---

完成本课后，继续下一课以深入学习更多高级概念。
`

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <button style={styles.backBtn} onClick={onBack}>
                    <ArrowLeft size={18} />
                    <span>{labels.back}</span>
                </button>
                <div style={styles.headerInfo}>
                    <div style={{ ...styles.levelBadge, background: levelConfig.bg, color: levelConfig.color }}>
                        {levelConfig.label}
                    </div>
                    <span style={styles.lessonCount}>
                        <BookOpen size={14} />
                        {totalLessons} {labels.lesson}
                    </span>
                </div>
            </header>

            {/* Course Title */}
            <div style={styles.titleSection}>
                <h1 style={styles.title}>{course.title}</h1>
                <p style={styles.description}>{course.description}</p>
            </div>

            {/* Progress Bar */}
            <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                    <span style={styles.progressLabel}>{labels.progress}</span>
                    <span style={styles.progressValue}>{progressPercent}%</span>
                </div>
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
                </div>
                <div style={styles.lessonDots}>
                    {Array.from({ length: totalLessons }, (_, i) => (
                        <button
                            key={i}
                            style={{
                                ...styles.lessonDot,
                                background: i <= progress ? '#00ff88' : 'rgba(255,255,255,0.1)',
                                border: i === currentLesson ? '2px solid #fff' : 'none',
                                transform: i === currentLesson ? 'scale(1.3)' : 'scale(1)'
                            }}
                            onClick={() => {
                                setCurrentLesson(i)
                                if (i > progress) saveProgress(i)
                            }}
                            title={`${labels.lesson} ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div style={styles.contentCard}>
                <div style={styles.contentHeader}>
                    <FileText size={20} color="#00d4ff" />
                    <span style={styles.contentTitle}>{labels.lesson} {currentLesson + 1}</span>
                    {currentLesson < progress && (
                        <CheckCircle size={18} color="#00ff88" />
                    )}
                </div>
                <div style={styles.contentBody}>
                    {/* 简单渲染内容 - 实际应使用markdown渲染库 */}
                    <div style={styles.markdownContent}>
                        {lessonContent.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) {
                                return <h1 key={i} style={styles.mdH1}>{line.slice(2)}</h1>
                            }
                            if (line.startsWith('## ')) {
                                return <h2 key={i} style={styles.mdH2}>{line.slice(3)}</h2>
                            }
                            if (line.startsWith('### ')) {
                                return <h3 key={i} style={styles.mdH3}>{line.slice(4)}</h3>
                            }
                            if (line.startsWith('> ')) {
                                return <blockquote key={i} style={styles.mdBlockquote}>{line.slice(2)}</blockquote>
                            }
                            if (line.startsWith('---')) {
                                return <hr key={i} style={styles.mdHr} />
                            }
                            if (line.trim()) {
                                return <p key={i} style={styles.mdP}>{line}</p>
                            }
                            return null
                        })}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div style={styles.navigation}>
                <button
                    style={{ ...styles.navBtn, opacity: currentLesson === 0 ? 0.4 : 1 }}
                    onClick={handlePrevLesson}
                    disabled={currentLesson === 0}
                >
                    <ChevronLeft size={20} />
                    {labels.prev}
                </button>
                <span style={styles.lessonIndicator}>
                    {currentLesson + 1} / {totalLessons}
                </span>
                <button
                    style={{
                        ...styles.navBtn,
                        ...styles.navBtnPrimary,
                        opacity: currentLesson === totalLessons - 1 ? 0.4 : 1
                    }}
                    onClick={handleNextLesson}
                    disabled={currentLesson === totalLessons - 1}
                >
                    {currentLesson === totalLessons - 1 ? labels.complete : labels.next}
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    )
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', height: '100%', animation: 'fade-in 0.4s ease' },
    loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 'var(--space-4)', color: 'var(--text-muted)' },
    spinner: { width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    notFound: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 'var(--space-4)', color: 'var(--text-muted)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' },
    backBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' },
    headerInfo: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    levelBadge: { padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 },
    lessonCount: { display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--text-muted)' },
    titleSection: { padding: 'var(--space-4) 0' },
    title: { margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: 'var(--space-2)' },
    description: { margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 },
    progressSection: { background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid rgba(255,255,255,0.05)' },
    progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' },
    progressLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' },
    progressValue: { fontSize: '0.875rem', fontWeight: 600, color: '#00ff88', fontFamily: 'var(--font-mono)' },
    progressBar: { height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', marginBottom: 'var(--space-3)' },
    progressFill: { height: '100%', background: 'linear-gradient(90deg, #00d26a, #00ff88)', borderRadius: 3, transition: 'width 0.4s ease' },
    lessonDots: { display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' },
    lessonDot: { width: 12, height: 12, borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s' },
    contentCard: { flex: 1, background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.95) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    contentHeader: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' },
    contentTitle: { fontSize: '1rem', fontWeight: 600, color: '#fff', flex: 1 },
    contentBody: { flex: 1, padding: 'var(--space-5) var(--space-6)', overflow: 'auto' },
    markdownContent: { lineHeight: 1.8 },
    mdH1: { fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 var(--space-4) 0', paddingBottom: 'var(--space-3)', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    mdH2: { fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: 'var(--space-5) 0 var(--space-3) 0' },
    mdH3: { fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 'var(--space-4) 0 var(--space-2) 0' },
    mdP: { margin: '0 0 var(--space-3) 0', color: 'var(--text-secondary)', fontSize: '0.95rem' },
    mdBlockquote: { margin: 'var(--space-4) 0', padding: 'var(--space-4)', background: 'rgba(0, 212, 255, 0.05)', borderLeft: '3px solid #00d4ff', borderRadius: '0 var(--radius-md) var(--radius-md) 0', color: 'var(--text-primary)', fontStyle: 'normal' },
    mdHr: { border: 'none', height: 1, background: 'rgba(255,255,255,0.1)', margin: 'var(--space-5) 0' },
    navigation: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) 0' },
    navBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' },
    navBtnPrimary: { background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)', border: 'none', color: '#000', fontWeight: 600, boxShadow: '0 4px 16px rgba(0, 210, 106, 0.3)' },
    lessonIndicator: { fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
}

export default CourseDetailView
