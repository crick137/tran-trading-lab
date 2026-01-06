import React, { useState, useEffect } from 'react'
import {
    Shield, Zap, Brain, Globe, BarChart3,
    ArrowRight, CheckCircle2, ChevronRight, Terminal,
    Activity, Lock, Server
} from 'lucide-react'
import { useAppActions } from '../../context/AppContext'
import { useI18n } from '../../hooks/useI18n'

function IntroductionView() {
    const { openAuthModal } = useAppActions()
    const { t } = useI18n()
    const [typedText, setTypedText] = useState('')
    const [bootLines, setBootLines] = useState([])

    // Typing effect for title
    useEffect(() => {
        const text = "GLOBAL MARKET INSIGHTS"
        let index = 0
        const interval = setInterval(() => {
            setTypedText(text.substring(0, index))
            index++
            if (index > text.length) clearInterval(interval)
        }, 100)
        return () => clearInterval(interval)
    }, [])

    // Boot sequence animation
    useEffect(() => {
        const lines = [
            "> Initializing Market Data Feeds...",
            "> Loading Technical Indicators...",
            "> Syncing On-Chain Analytics...",
            "> Fetching Latest Macro News...",
            "> READY FOR ANALYSIS."
        ]
        let currentLine = 0
        const interval = setInterval(() => {
            if (currentLine < lines.length) {
                setBootLines(prev => [...prev, lines[currentLine]])
                currentLine++
            } else {
                clearInterval(interval)
            }
        }, 600)
        return () => clearInterval(interval)
    }, [])

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.heroSection}>
                <div style={styles.logoWrapper}>
                    <div style={styles.logoRing} />
                    <img src="/tran-logo.png" alt="Tran Logo" style={styles.heroLogo} />
                    <div style={styles.logoGlow} />
                </div>

                <div style={styles.brandTitle}>
                    <span style={styles.titlePrefix}>TRAN TRADING LAB</span>
                    <span style={styles.titleText}>{typedText}<span style={styles.cursor}>_</span></span>
                </div>

                <p style={styles.heroSubtitle}>
                    {t('intro.subtitle')}
                </p>

                {/* Terminal Boot Window */}
                <div style={styles.terminalWindow}>
                    <div style={styles.terminalHeader}>
                        <div style={styles.terminalDot} />
                        <div style={styles.terminalDot} />
                        <div style={styles.terminalDot} />
                        <span style={styles.terminalTitle}>MARKET_DATA.LOG</span>
                    </div>
                    <div style={styles.terminalBody}>
                        {bootLines.map((line, i) => (
                            <div key={i} style={{ color: i === bootLines.length - 1 ? '#3b82f6' : 'rgba(59, 130, 246, 0.6)' }}>
                                {line}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.ctaGroup}>
                    <button style={styles.primaryBtn} onClick={openAuthModal}>
                        <span>ACCESS INSIGHTS</span>
                        <ArrowRight size={20} />
                    </button>
                    <button style={styles.secondaryBtn} onClick={() => window.open('https://t.me/http4477', '_blank')}>
                        <span>JOIN TELEGRAM</span>
                        <Globe size={20} />
                    </button>
                </div>
            </div>

            {/* Holographic Stats */}
            <div style={styles.statsBar}>
                <div style={styles.statItem}>
                    <Activity size={20} color="#10b981" />
                    <div>
                        <span style={styles.statValue}>DAILY</span>
                        <span style={styles.statLabel}>UPDATES</span>
                    </div>
                </div>
                <div style={styles.divider} />
                <div style={styles.statItem}>
                    <Brain size={20} color="#00d4ff" />
                    <div>
                        <span style={styles.statValue}>CUSTOM</span>
                        <span style={styles.statLabel}>INDICATORS</span>
                    </div>
                </div>
                <div style={styles.divider} />
                <div style={styles.statItem}>
                    <Shield size={20} color="#fbbf24" />
                    <div>
                        <span style={styles.statValue}>PRO</span>
                        <span style={styles.statLabel}>STRATEGIES</span>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <h2 style={styles.sectionTitle}>LAB RESOURCES</h2>
            <div style={styles.grid}>
                <FeatureCard
                    icon={<Brain size={32} color="#60a5fa" />}
                    title="Deep Analysis"
                    desc="Comprehensive market breakdowns combining technical and fundamental data."
                />
                <FeatureCard
                    icon={<Zap size={32} color="#00d4ff" />}
                    title="Custom Indicators"
                    desc="Proprietary trading viewing indicators developed for precision entries."
                />
                <FeatureCard
                    icon={<Lock size={32} color="#fbbf24" />}
                    title="Risk Strategies"
                    desc="Professional risk management frameworks to protect your portfolio."
                />
                <FeatureCard
                    icon={<Terminal size={32} color="#a855f7" />}
                    title="Strategy Lab"
                    desc="Learn and test institutional-grade trading setups."
                />
                <FeatureCard
                    icon={<Globe size={32} color="#ff3860" />}
                    title="Macro Insights"
                    desc="Global economic news interpretation and crypto correlation analysis."
                />
                <FeatureCard
                    icon={<Server size={32} color="#ffffff" />}
                    title="Active Community"
                    desc="Join thousands of traders discussing setups in real-time."
                />
            </div>

            <div style={{ height: 100 }} />
        </div>
    )
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div style={styles.card} className="card-tilt">
            <div style={styles.cardGlow} />
            <div style={styles.cardHeader}>
                <div style={styles.iconBox}>{icon}</div>
                <div style={styles.techDecoration}>
                    <div style={{ width: 4, height: 4, background: '#fff', borderRadius: '50%' }} />
                    <div style={{ width: 4, height: 4, background: '#fff', borderRadius: '50%', opacity: 0.5 }} />
                </div>
            </div>
            <h3 style={styles.cardTitle}>{title}</h3>
            <p style={styles.cardDesc}>{desc}</p>
        </div>
    )
}

const styles = {
    container: {
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '80px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'transparent',
    },
    heroSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 100,
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 800,
    },
    logoWrapper: {
        position: 'relative',
        marginBottom: 40,
        width: 140,
        height: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoRing: {
        position: 'absolute',
        inset: -20,
        border: '1px dashed rgba(59, 130, 246, 0.3)',
        borderRadius: '50%',
        animation: 'spin 10s linear infinite',
    },
    heroLogo: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        position: 'relative',
        zIndex: 2,
        boxShadow: '0 0 40px rgba(0,0,0,0.5)',
    },
    logoGlow: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 200,
        height: 200,
        background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
        zIndex: 1,
        animation: 'pulse 3s ease-in-out infinite',
    },
    brandTitle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 24,
        fontFamily: "'Space Grotesk', sans-serif",
    },
    titlePrefix: {
        fontSize: 16,
        letterSpacing: '0.5em',
        color: 'rgba(255,255,255,0.4)',
        marginBottom: 8,
    },
    titleText: {
        fontSize: 64,
        fontWeight: 900,
        background: 'linear-gradient(180deg, #fff 0%, #aaa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.02em',
        textShadow: '0 0 20px rgba(255,255,255,0.2)',
        minHeight: 76,
    },
    cursor: {
        color: '#3b82f6',
        animation: 'pulse 0.8s infinite',
    },
    heroSubtitle: {
        fontSize: 20,
        color: '#3b82f6',
        fontWeight: 500,
        marginBottom: 40,
        maxWidth: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        textShadow: '0 0 10px rgba(59, 130, 246, 0.4)',
    },
    terminalWindow: {
        width: '100%',
        maxWidth: 500,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: 8,
        marginBottom: 48,
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        textAlign: 'left',
    },
    terminalHeader: {
        background: 'rgba(59, 130, 246, 0.1)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    },
    terminalDot: { width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' },
    terminalTitle: { marginLeft: 8, color: 'rgba(255,255,255,0.4)' },
    terminalBody: {
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minHeight: 120,
    },
    ctaGroup: {
        display: 'flex',
        gap: 20,
    },
    primaryBtn: {
        padding: '18px 48px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        border: 'none',
        borderRadius: 0,
        clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)',
        color: '#fff',
        fontSize: 16,
        fontWeight: 800,
        cursor: 'pointer',
        boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'transform 0.2s',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    secondaryBtn: {
        padding: '18px 48px',
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 0,
        clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)',
        color: '#fff',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        backdropFilter: 'blur(10px)',
        transition: 'background 0.2s',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    statsBar: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px 40px',
        background: 'rgba(8, 16, 24, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16,
        gap: 40,
        marginBottom: 100,
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    statValue: {
        display: 'block',
        fontSize: 18,
        fontWeight: 800,
        color: '#fff',
        fontFamily: "'JetBrains Mono', monospace",
        lineHeight: 1,
    },
    statLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 600,
    },
    divider: {
        width: 1,
        height: 24,
        background: 'rgba(255,255,255,0.1)',
    },
    featuresSection: {
        width: '100%',
        maxWidth: 1200,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 60,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 32,
        width: '100%',
        maxWidth: 1200,
    },
    card: {
        background: 'rgba(10, 20, 30, 0.6)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
    },
    cardGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
    },
    techDecoration: {
        display: 'flex',
        gap: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: '#fff',
        marginBottom: 12,
        letterSpacing: '0.02em',
        fontFamily: "'Space Grotesk', sans-serif",
    },
    cardDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.6,
    },
}

export default IntroductionView
