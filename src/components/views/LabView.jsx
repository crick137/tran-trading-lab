import React, { useState, useEffect } from 'react'
import { BookOpen, CheckCircle, Circle, Lock, Award, ChevronRight, Sparkles, Clock, Star, TrendingUp, Inbox } from 'lucide-react'
import { db, TABLES } from '../../lib/supabase'
import { useI18n } from '../../hooks/useI18n'

function LabView() {
    const { t, language } = useI18n()
    const [labCourses, setLabCourses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await db.getAll(TABLES.LAB_COURSES, { orderBy: 'order_index', filters: { is_published: true } })
                setLabCourses(data || [])
            } catch (err) {
                console.error('Failed to load courses:', err)
                setLabCourses([])
            }
            setLoading(false)
        }
        loadCourses()
    }, [])

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
            ) : labCourses.length === 0 ? (
                <div style={styles.emptyState}>
                    <Inbox size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <h3 style={styles.emptyTitle}>{t('views.lab.noData')}</h3>
                    <p style={styles.emptyDesc}>{t('views.lab.noDataDesc')}</p>
                </div>
            ) : (
                <div style={styles.coursesGrid}>
                    {labCourses.map((course, index) => {
                        const levelConfig = getLevelConfig(course.level)
                        return (
                            <article key={course.id} style={{ ...styles.courseCard, animationDelay: `${index * 100}ms` }}>
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
                                <div style={styles.courseFooter}>
                                    <button style={styles.startBtn}>
                                        <span>{t('views.lab.startCourse')}</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </article>
                        )
                    })}
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
    emptyTitle: { margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-secondary)' },
    emptyDesc: { margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' },
    spinner: { width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    coursesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' },
    courseCard: { background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', animation: 'slide-up 0.4s ease forwards', opacity: 0, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(8px)' },
    courseHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    levelBadge: { padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '700', boxShadow: '0 0 12px currentColor' },
    lessonCount: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' },
    courseTitle: { margin: 0, fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.4 },
    courseDesc: { margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 },
    courseFooter: { paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-light)' },
    startBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-5)', background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: '600', color: '#000', cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(0, 210, 106, 0.3)' },
}

export default LabView
