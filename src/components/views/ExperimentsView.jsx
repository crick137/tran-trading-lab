import React, { useState } from 'react'
import { FlaskConical, Cpu, TrendingUp, Sparkles, ArrowRight, Beaker, ChartBar } from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'
import KellySimulator from '../experiments/KellySimulator'

// 实验项目列表
const EXPERIMENTS = [
    {
        id: 'kelly-simulator',
        title: 'Kelly Criterion Simulator',
        titleZh: '凯利公式模拟器',
        titleKo: '켈리 기준 시뮬레이터',
        description: 'Visualize optimal position sizing using Kelly Criterion with Monte Carlo simulation.',
        descriptionZh: '使用蒙特卡洛模拟可视化凯利公式的最优仓位管理。',
        descriptionKo: '몬테카를로 시뮬레이션을 통해 켈리 기준의 최적 포지션 사이징을 시각화합니다.',
        icon: TrendingUp,
        color: '#00ff88',
        tags: ['资金管理', '风险控制', '模拟'],
        component: KellySimulator
    },
    // 未来可以在这里添加更多实验项目
]

function ExperimentsView() {
    const { language, t } = useI18n()
    const [activeExperiment, setActiveExperiment] = useState(null)

    // 如果选择了实验，显示实验组件
    if (activeExperiment) {
        const ExperimentComponent = activeExperiment.component
        return <ExperimentComponent onBack={() => setActiveExperiment(null)} />
    }

    const getLocalizedTitle = (exp) => {
        if (language === 'zh') return exp.titleZh || exp.title
        if (language === 'ko') return exp.titleKo || exp.title
        return exp.title
    }

    const getLocalizedDesc = (exp) => {
        if (language === 'zh') return exp.descriptionZh || exp.description
        if (language === 'ko') return exp.descriptionKo || exp.description
        return exp.description
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>
                        <FlaskConical size={28} style={{ color: 'var(--accent-primary)' }} />
                        <span style={styles.titleGradient}>
                            {language === 'zh' ? '实验室' : language === 'ko' ? '실험실' : 'Experiments'}
                        </span>
                    </h1>
                    <p style={styles.subtitle}>
                        {language === 'zh'
                            ? '探索交易概念的互动工具与可视化实验'
                            : language === 'ko'
                                ? '트레이딩 개념을 탐구하는 인터랙티브 도구와 시각화 실험'
                                : 'Interactive tools and visualizations to explore trading concepts'}
                    </p>
                </div>
                <div style={styles.badge}>
                    <Beaker size={14} />
                    <span>{EXPERIMENTS.length} {language === 'zh' ? '个实验' : language === 'ko' ? '개 실험' : 'experiments'}</span>
                </div>
            </header>

            {/* Experiments Grid */}
            <div style={styles.grid}>
                {EXPERIMENTS.map((exp, index) => {
                    const IconComponent = exp.icon
                    return (
                        <article
                            key={exp.id}
                            style={{ ...styles.card, animationDelay: `${index * 100}ms` }}
                            onClick={() => setActiveExperiment(exp)}
                        >
                            <div style={styles.cardHeader}>
                                <div style={{ ...styles.iconWrapper, background: `${exp.color}20` }}>
                                    <IconComponent size={24} style={{ color: exp.color }} />
                                </div>
                                <div style={styles.tags}>
                                    {exp.tags.map(tag => (
                                        <span key={tag} style={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <h3 style={styles.cardTitle}>{getLocalizedTitle(exp)}</h3>
                            <p style={styles.cardDesc}>{getLocalizedDesc(exp)}</p>

                            <button style={styles.launchBtn}>
                                <span>{language === 'zh' ? '启动实验' : language === 'ko' ? '실험 시작' : 'Launch'}</span>
                                <ArrowRight size={14} />
                            </button>
                        </article>
                    )
                })}

                {/* Coming Soon Card */}
                <article style={styles.comingSoonCard}>
                    <div style={styles.comingSoonContent}>
                        <Sparkles size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                        <h3 style={styles.comingSoonTitle}>
                            {language === 'zh' ? '更多实验即将推出' : language === 'ko' ? '더 많은 실험 예정' : 'More Coming Soon'}
                        </h3>
                        <p style={styles.comingSoonDesc}>
                            {language === 'zh'
                                ? '我们正在开发更多互动实验...'
                                : language === 'ko'
                                    ? '더 많은 인터랙티브 실험을 개발 중입니다...'
                                    : 'We\'re building more interactive experiments...'}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        height: '100%',
        padding: 'var(--space-6)',
        overflow: 'auto',
        animation: 'fade-in 0.4s ease'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexShrink: 0
    },
    headerLeft: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        margin: 0,
        fontSize: '1.75rem',
        fontWeight: '700'
    },
    titleGradient: {
        background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: { margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 500 },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-4)',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-light)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
    },

    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 'var(--space-5)',
        flex: 1
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-6)',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(8, 16, 24, 0.9) 100%)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'slide-up 0.4s ease forwards',
        opacity: 0
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tags: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' },
    tag: {
        padding: '4px 10px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.7rem',
        color: 'var(--text-muted)'
    },
    cardTitle: { margin: 0, fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' },
    cardDesc: { margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 },
    launchBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        color: '#000',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0, 210, 106, 0.3)',
        transition: 'all 0.2s'
    },

    comingSoonCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        background: 'var(--bg-card)',
        border: '2px dashed var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        minHeight: 200
    },
    comingSoonContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', textAlign: 'center' },
    comingSoonTitle: { margin: 0, fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)' },
    comingSoonDesc: { margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', opacity: 0.7 }
}

export default ExperimentsView
