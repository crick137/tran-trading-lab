import React, { useState } from 'react'
import {
    LayoutDashboard, FileText, LineChart, Newspaper,
    FlaskConical, StickyNote, Wrench, ChevronLeft,
    ChevronRight, Terminal, Zap, Star, Crown,
    Sparkles, TrendingUp, Globe, Cpu, BookOpen
} from 'lucide-react'

// 最高等级侧边栏
function Sidebar({ navItems, activeView, onNavClick, collapsed, onToggle }) {
    const [hoveredItem, setHoveredItem] = useState(null)

    const mainNavItems = [
        { id: 'dashboard', label: 'Overview', labelKr: '대시보드', icon: LayoutDashboard, shortcut: '⌘1' },
        { id: 'analysis', label: 'Analysis', labelKr: '분석', icon: LineChart, shortcut: '⌘2', isPro: true },
        { id: 'news', label: 'News', labelKr: '뉴스', icon: Newspaper, shortcut: '⌘3' },
        { id: 'lab', label: 'Research', labelKr: '연구', icon: FlaskConical, shortcut: '⌘4', isPro: true },
        { id: 'column', label: 'Column', labelKr: '칼럼', icon: BookOpen, shortcut: '⌘L' },
        { id: 'systems', label: 'Systems', labelKr: '시스템', icon: Cpu, shortcut: '⌘5', isHot: true },
        { id: 'about', label: 'About', labelKr: '소개', icon: Globe, shortcut: '⌘6' },
    ]

    return (
        <aside style={{
            ...styles.sidebar,
            width: collapsed ? 64 : 220,
        }}>
            {/* 用户信息 */}
            <div style={styles.navLabel}>NAVIGATION</div>

            <nav style={styles.nav}>
                <ul style={styles.navList}>
                    {mainNavItems.map((item) => {
                        const isActive = activeView === item.id
                        const isHovered = hoveredItem === item.id
                        const Icon = item.icon

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onNavClick(item.id)}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    style={{
                                        ...styles.navItem,
                                        background: isActive
                                            ? 'linear-gradient(90deg, rgba(0, 210, 106, 0.12) 0%, rgba(0, 210, 106, 0.04) 50%, transparent 100%)'
                                            : isHovered
                                                ? 'rgba(255, 255, 255, 0.02)'
                                                : 'transparent',
                                        borderLeft: isActive ? '2px solid #00d26a' : '2px solid transparent',
                                    }}
                                >
                                    {isActive && <div style={styles.activeGlow} />}
                                    <div style={{
                                        ...styles.iconBox,
                                        background: isActive
                                            ? 'linear-gradient(135deg, rgba(0, 210, 106, 0.2) 0%, rgba(0, 210, 106, 0.1) 100%)'
                                            : 'rgba(255, 255, 255, 0.02)',
                                        border: isActive
                                            ? '1px solid rgba(0, 210, 106, 0.3)'
                                            : '1px solid rgba(255, 255, 255, 0.04)',
                                    }}>
                                        <Icon
                                            size={16}
                                            style={{
                                                color: isActive ? '#00d26a' : 'rgba(255,255,255,0.4)',
                                                filter: isActive ? 'drop-shadow(0 0 4px rgba(0, 210, 106, 0.5))' : 'none'
                                            }}
                                        />
                                    </div>
                                    {!collapsed && (
                                        <>
                                            <div style={styles.labelSection}>
                                                <div style={styles.labelMain}>
                                                    <span style={{
                                                        ...styles.label,
                                                        color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                                                    }}>{item.label}</span>
                                                    {item.isPro && (
                                                        <div style={styles.proBadge}>
                                                            <Star size={8} />
                                                        </div>
                                                    )}
                                                    {item.isHot && (
                                                        <div style={styles.hotBadge}>
                                                            <Sparkles size={8} />
                                                        </div>
                                                    )}
                                                </div>
                                                <span style={styles.labelKr}>{item.labelKr}</span>
                                            </div>
                                            <span style={{
                                                ...styles.shortcut,
                                                opacity: isActive || isHovered ? 1 : 0.3,
                                            }}>{item.shortcut}</span>
                                        </>
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div style={styles.bottomSection}>
                {!collapsed && (
                    <>
                        <div style={styles.statsCard}>
                            <div style={styles.statRow}>
                                <TrendingUp size={12} style={{ color: '#00d26a' }} />
                                <span>포트폴리오</span>
                                <span style={{ color: '#00d26a', fontWeight: 700 }}>+12.5%</span>
                            </div>
                        </div>
                        <div style={styles.versionInfo}>
                            <Terminal size={12} style={{ color: '#00d26a' }} />
                            <span>TRAN v2.1.0</span>
                            <div style={styles.versionDot} />
                        </div>
                    </>
                )}
                <button onClick={onToggle} style={styles.collapseBtn}>
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>
        </aside>
    )
}

const styles = {
    sidebar: {
        position: 'fixed',
        top: 52,
        left: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(6, 12, 20, 0.98) 0%, rgba(4, 8, 16, 0.98) 100%)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.04)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 900,
        overflow: 'hidden',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    },
    userAvatar: {
        position: 'relative',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff7f 100%)',
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 800,
        color: '#000',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#00d26a',
        border: '2px solid #060c14',
        boxShadow: '0 0 8px rgba(0, 210, 106, 0.6)',
    },
    userInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
    userName: { fontSize: 14, fontWeight: 700, color: '#fff' },
    userPlan: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#fbbf24' },
    navLabel: {
        padding: '16px 20px 8px',
        fontSize: 9,
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.25)',
        letterSpacing: '0.1em',
    },
    nav: { flex: 1 },
    navList: { listStyle: 'none' },
    navItem: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '10px 16px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
    },
    activeGlow: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 100,
        background: 'linear-gradient(90deg, rgba(0, 210, 106, 0.2), rgba(0, 255, 127, 0.05), transparent)',
        pointerEvents: 'none',
        animation: 'fade-in 0.3s ease',
    },
    iconBox: {
        width: 38,
        height: 38,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    labelSection: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 },
    labelMain: { display: 'flex', alignItems: 'center', gap: 6 },
    label: { fontSize: 13, fontWeight: 600 },
    labelKr: { fontSize: 10, color: 'rgba(255,255,255,0.3)' },
    proBadge: {
        width: 16,
        height: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        borderRadius: 4,
        color: '#000',
    },
    hotBadge: {
        width: 16,
        height: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff3860 0%, #ff5274 100%)',
        borderRadius: 4,
        color: '#fff',
    },
    shortcut: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace", transition: 'opacity 0.2s' },
    bottomSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 16,
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    },
    statsCard: {
        padding: 14,
        background: 'linear-gradient(135deg, rgba(0, 210, 106, 0.08) 0%, rgba(0, 210, 106, 0.03) 100%)',
        border: '1px solid rgba(0, 210, 106, 0.15)',
        borderRadius: 12,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease',
    },
    statRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
    versionInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
    },
    versionDot: {
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: '#00d26a',
        boxShadow: '0 0 8px rgba(0, 210, 106, 0.7)',
    },
    collapseBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 10,
        color: 'rgba(255,255,255,0.5)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(4px)',
    },
}

export default Sidebar
