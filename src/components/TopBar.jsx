import React, { useState, useEffect, useMemo } from 'react'
import {
    Activity, Clock, Wifi, TrendingUp, TrendingDown,
    Bell, Settings, Search, Command, Shield,
    Zap, Globe, Layers, Radio, ChevronDown,
    Sun, Moon, Globe2, User, LogOut, Twitter, Send, MessageCircle, MessageSquare
} from 'lucide-react'
import UserAuthModal from './UserAuthModal'
import { useAppState, useAppActions } from '../context/AppContext'
import { useI18n } from '../hooks/useI18n'
import { useMarketData } from '../hooks/useMarketData'

// 语言选项
const LANGUAGES = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
]

// 最高等级 TopBar
function TopBar() {
    const [time, setTime] = useState(new Date())
    const [flash, setFlash] = useState({})
    const [showLangMenu, setShowLangMenu] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showNotifMenu, setShowNotifMenu] = useState(false)

    // Use Global State
    const {
        user, isAuthenticated, authModalOpen,
        theme, language, notifications
    } = useAppState()

    // Use Global Actions
    const {
        setUser, logout, openAuthModal, closeAuthModal,
        toggleTheme, setLanguage, toggleCommandPalette,
        dismissNotification
    } = useAppActions()

    const { t } = useI18n()

    // 获取实时市场数据
    const { data: liveData } = useMarketData()

    // 将实时数据转换为TopBar需要的格式
    const marketData = useMemo(() => {
        const btcData = liveData['BTC/USDT'] || {}
        const ethData = liveData['ETH/USDT'] || {}
        const spyData = liveData['SPY'] || {}
        const goldData = liveData['GOLD'] || {}

        return {
            btc: { price: btcData.price || 0, change: btcData.change || 0 },
            eth: { price: ethData.price || 0, change: ethData.change || 0 },
            spy: { price: spyData.price || 0, change: spyData.change || 0 },
            dxy: { price: liveData['DXY']?.price || 0, change: liveData['DXY']?.change || 0 },
            gold: { price: goldData.price || 0, change: goldData.change || 0 },
            vix: { price: liveData['VIX']?.price || 0, change: liveData['VIX']?.change || 0 },
        }
    }, [liveData])

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const tickers = [
        { key: 'btc', sym: 'BTC', dec: 2 },
        { key: 'eth', sym: 'ETH', dec: 2 },
        { key: 'spy', sym: 'SPY', dec: 2 },
        { key: 'dxy', sym: 'DXY', dec: 3 },
        { key: 'gold', sym: 'GOLD', dec: 2, isGold: true },
        { key: 'vix', sym: 'VIX', dec: 2, isVol: true },
    ]

    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]
    const unreadCount = notifications.length

    return (
        <header style={styles.header}>
            {/* Brand */}
            <div style={styles.brandSection}>
                <div style={styles.logoWrapper}>
                    <div style={styles.logo}>
                        <img src="/tran-logo.png" alt="Tran Trading Lab" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
                    </div>
                    <div style={styles.logoGlow} />
                </div>
                <div style={styles.brandInfo}>
                    <span style={styles.brandName}>TRAN</span>
                    <span style={styles.brandType}>TRADING LAB</span>
                </div>
                <div style={styles.proBadge}>PRO</div>
            </div>

            <div style={styles.divider} />

            {/* Status */}
            <div style={styles.statusSection}>
                <div style={styles.statusItem}>
                    <div style={styles.statusDot} />
                    <span style={styles.statusText}>LIVE</span>
                </div>
                <div style={styles.latencyBox}>
                    <Wifi size={10} />
                    <span>12ms</span>
                </div>
            </div>

            <div style={styles.divider} />

            {/* Ticker Tape */}
            <div style={styles.tickerSection}>
                <div style={styles.tickerTrack}>
                    {[...tickers, ...tickers].map((t, idx) => {
                        const data = marketData[t.key]
                        const isUp = data.change >= 0
                        const flashClass = flash[t.key]

                        return (
                            <div
                                key={`${t.key}-${idx}`}
                                style={{
                                    ...styles.ticker,
                                    background: flashClass === 'up' ? 'rgba(0, 210, 106, 0.08)' :
                                        flashClass === 'down' ? 'rgba(255, 56, 96, 0.08)' : 'transparent'
                                }}
                            >
                                <span style={{
                                    ...styles.tickerSym,
                                    color: t.isGold ? '#fbbf24' : t.isVol ? '#a855f7' : 'rgba(255,255,255,0.5)'
                                }}>{t.sym}</span>
                                <span style={{
                                    ...styles.tickerPrice,
                                    color: t.isGold ? '#fbbf24' :
                                        t.isVol ? (isUp ? '#ff3860' : '#00d26a') :
                                            (isUp ? '#00d26a' : '#ff3860')
                                }}>
                                    {data.price.toLocaleString('en-US', { minimumFractionDigits: t.dec, maximumFractionDigits: t.dec })}
                                </span>
                                <span style={{
                                    ...styles.tickerChange,
                                    color: isUp ? '#00d26a' : '#ff3860'
                                }}>
                                    {isUp ? '▲' : '▼'}{Math.abs(data.change).toFixed(2)}%
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Right Section */}
            <div style={styles.rightSection}>
                <div style={styles.socialLinks}>
                    <a href="https://x.com/TranTradingLab" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="X (Twitter)">
                        <Twitter size={18} />
                    </a>
                    <a href="https://t.me/http4477" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="Telegram Group">
                        <Send size={18} />
                    </a>
                    <a href="https://t.me/TranTradingLabNews" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="News Channel">
                        <MessageSquare size={18} />
                    </a>
                    <a href="https://whatsapp.com/channel/0029Vb6DoUnHltY5bgndxT1t" target="_blank" rel="noopener noreferrer" style={styles.socialLink} title="WhatsApp Channel">
                        <MessageCircle size={18} />
                    </a>
                </div>
                <div style={styles.divider} />

                <div style={styles.marketsInfo}>
                    <div style={styles.marketTag}>
                        <Globe size={10} />
                        <span>NYSE</span>
                        <span style={styles.marketOpen}>OPEN</span>
                    </div>
                    <div style={styles.marketTag}>
                        <Layers size={10} />
                        <span>CRYPTO</span>
                        <span style={styles.marketOpen}>24/7</span>
                    </div>
                </div>

                <div style={styles.divider} />

                <div style={styles.timeSection}>
                    <div style={styles.timeValue}>
                        {time.toLocaleTimeString('en-US', { hour12: false })}
                    </div>
                    <div style={styles.dateValue}>
                        {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                </div>

                <div style={styles.actions}>
                    {/* Command Palette */}
                    <button
                        style={styles.actionBtn}
                        onClick={toggleCommandPalette}
                        title="命令面板 (⌘K)"
                    >
                        <Command size={14} />
                        <span style={styles.shortcutBadge}>⌘K</span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        style={styles.actionBtn}
                        onClick={toggleTheme}
                        title={theme === 'dark' ? '浅色模式' : '深色模式'}
                    >
                        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                    </button>

                    {/* Language Selector */}
                    <div style={styles.langWrapper}>
                        <button
                            style={styles.actionBtn}
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            title="语言"
                        >
                            <span style={styles.langFlag}>{currentLang.flag}</span>
                        </button>
                        {showLangMenu && (
                            <div style={styles.langMenu}>
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        style={{
                                            ...styles.langMenuItem,
                                            background: lang.code === language ? 'rgba(0, 210, 106, 0.1)' : 'transparent'
                                        }}
                                        onClick={() => {
                                            setLanguage(lang.code)
                                            setShowLangMenu(false)
                                        }}
                                    >
                                        <span>{lang.flag}</span>
                                        <span>{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div style={{ position: 'relative' }}>
                        <button
                            style={styles.actionBtn}
                            onClick={() => setShowNotifMenu(!showNotifMenu)}
                        >
                            <Bell size={14} />
                            {unreadCount > 0 && <div style={styles.notifDot} />}
                        </button>
                        {showNotifMenu && (
                            <div style={styles.dropMenu}>
                                <div style={styles.dropHeader}>Notifications</div>
                                {notifications.length === 0 ? (
                                    <div style={styles.dropEmpty}>No new notifications</div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif.id} style={styles.dropItem} onClick={() => dismissNotification(notif.id)}>
                                            <div style={styles.dropTitle}>{notif.message}</div>
                                            <div style={styles.dropTime}>{new Date(notif.timestamp).toLocaleTimeString()}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Settings */}
                    <button style={styles.actionBtn} onClick={() => alert('Settings module coming soon!')}>
                        <Settings size={14} />
                    </button>

                    <div style={styles.divider} />

                    {/* User Profile */}
                    <div style={{ position: 'relative' }}>
                        {isAuthenticated && user ? (
                            <button
                                style={styles.userBtn}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <div style={styles.avatar}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} style={styles.avatarImg} />
                                    ) : (
                                        <span style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <span style={styles.userName}>{user.name}</span>
                                <ChevronDown size={12} />
                            </button>
                        ) : (
                            <button
                                style={styles.loginBtn}
                                onClick={openAuthModal}
                            >
                                <User size={14} />
                                <span>{t('nav.login')}</span>
                            </button>
                        )}

                        {showUserMenu && isAuthenticated && (
                            <div style={styles.userMenu}>
                                <div style={styles.userMenuHeader}>
                                    <span style={styles.userMenuName}>{user.name}</span>
                                    <span style={styles.userMenuEmail}>{user.email}</span>
                                </div>
                                <div style={styles.userMenuDivider} />
                                <button style={styles.userMenuItem}>
                                    <User size={14} /> {t('nav.profile')}
                                </button>
                                <button style={styles.userMenuItem}>
                                    <Settings size={14} /> {t('nav.settings')}
                                </button>
                                <div style={styles.userMenuDivider} />
                                <button
                                    style={{ ...styles.userMenuItem, color: '#ff3860' }}
                                    onClick={() => {
                                        logout()
                                        setShowUserMenu(false)
                                    }}
                                >
                                    <LogOut size={14} /> {t('nav.logout')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <UserAuthModal
                isOpen={authModalOpen}
                onClose={closeAuthModal}
                onLogin={(userData) => {
                    setUser(userData)
                }}
            />
        </header>
    )
}

const styles = {
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        background: 'linear-gradient(180deg, rgba(8, 16, 24, 0.98) 0%, rgba(4, 8, 16, 0.98) 100%)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        zIndex: 1000,
    },
    brandSection: { display: 'flex', alignItems: 'center', gap: 12 },
    logoWrapper: { position: 'relative' },
    logo: {
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // background: 'linear-gradient(135deg, #00d26a 0%, #00ff7f 100%)', // Removed background to show png
        borderRadius: 10,
        // color: '#000',
        // boxShadow: '0 4px 20px rgba(0, 210, 106, 0.4)',
        // animation: 'neon-breathe 3s ease-in-out infinite',
    },
    logoGlow: {
        position: 'absolute',
        inset: -6,
        background: 'radial-gradient(circle, rgba(0, 210, 106, 0.25) 0%, rgba(0, 255, 127, 0.1) 40%, transparent 70%)',
        borderRadius: 16,
        zIndex: -1,
        animation: 'pulse 3s ease-in-out infinite',
    },
    brandInfo: { display: 'flex', flexDirection: 'column', lineHeight: 1 },
    brandName: { fontSize: 16, fontWeight: 900, color: '#00d26a', letterSpacing: '-0.03em' },
    brandType: { fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' },
    proBadge: {
        padding: '3px 8px',
        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 800,
        color: '#000',
        letterSpacing: '0.05em',
    },
    divider: { width: 1, height: 28, background: 'rgba(255, 255, 255, 0.06)', margin: '0 16px' },
    statusSection: { display: 'flex', alignItems: 'center', gap: 10 },
    statusItem: { display: 'flex', alignItems: 'center', gap: 5 },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00ff7f 0%, #00d26a 100%)',
        boxShadow: '0 0 8px rgba(0, 210, 106, 0.6), 0 0 16px rgba(0, 255, 127, 0.4), 0 0 24px rgba(0, 210, 106, 0.2)',
        animation: 'pulse 2s ease-in-out infinite',
    },
    statusText: { fontSize: 10, fontWeight: 700, color: '#00ff7f', letterSpacing: '0.08em', textShadow: '0 0 10px rgba(0, 255, 127, 0.5)' },
    latencyBox: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        background: 'rgba(0, 210, 106, 0.08)',
        border: '1px solid rgba(0, 210, 106, 0.15)',
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 600,
        color: '#00d26a',
    },
    tickerSection: {
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        maskImage: 'linear-gradient(90deg, transparent, black 40px, black calc(100% - 40px), transparent)',
    },
    tickerTrack: {
        display: 'flex',
        alignItems: 'center',
        animation: 'tickerScroll 30s linear infinite',
        width: 'fit-content',
    },
    ticker: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 20px',
        borderRight: '1px solid rgba(255, 255, 255, 0.04)',
        transition: 'background 0.3s ease',
        flexShrink: 0,
    },
    tickerSym: { fontSize: 10, fontWeight: 600 },
    tickerPrice: { fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" },
    tickerChange: { fontSize: 10, fontWeight: 600 },
    rightSection: { display: 'flex', alignItems: 'center', gap: 12 },
    marketsInfo: { display: 'flex', gap: 8 },
    marketTag: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 9,
        color: 'rgba(255,255,255,0.4)',
    },
    marketOpen: { color: '#00d26a', fontWeight: 700 },
    timeSection: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.1 },
    timeValue: { fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono', monospace" },
    dateValue: { fontSize: 9, color: 'rgba(255,255,255,0.4)' },
    socialLinks: { display: 'flex', alignItems: 'center', gap: 12, marginRight: 16 },
    socialLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 10,
        color: '#fff',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    actions: { display: 'flex', gap: 4 },
    actionBtn: {
        position: 'relative',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 10,
        color: 'rgba(255,255,255,0.5)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(8px)',
    },
    notifDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#ff3860',
        boxShadow: '0 0 8px rgba(255, 56, 96, 0.6)',
    },
    shortcutBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        padding: '1px 3px',
        fontSize: 7,
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.4)',
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 3,
    },
    langWrapper: {
        position: 'relative',
    },
    langFlag: {
        fontSize: 16,
    },
    langMenu: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 8,
        minWidth: 120,
        padding: 4,
        background: 'rgba(16, 24, 36, 0.98)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    },
    langMenuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '10px 12px',
        border: 'none',
        borderRadius: 8,
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
    },
    loginBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: 'rgba(0, 210, 106, 0.1)',
        border: '1px solid rgba(0, 210, 106, 0.2)',
        borderRadius: 8,
        color: '#00d26a',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
            background: 'rgba(0, 210, 106, 0.2)',
        }
    },
    userBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'transparent',
        border: 'none',
        padding: 4,
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.8)',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)',
    },
    avatarText: {
        color: '#fff',
        fontWeight: 700,
        fontSize: 12,
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    userName: {
        fontSize: 13,
        fontWeight: 500,
    },
    userMenu: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 12,
        width: 200,
        background: '#0d1117',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        padding: 6,
        zIndex: 100,
        overflow: 'hidden',
    },
    userMenuHeader: {
        padding: '12px 12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    userMenuName: {
        fontSize: 14,
        fontWeight: 700,
        color: '#fff',
    },
    userMenuEmail: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
    },
    userMenuDivider: {
        height: 1,
        background: 'rgba(255,255,255,0.05)',
        margin: '6px 0',
    },
    userMenuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '10px 12px',
        background: 'transparent',
        border: 'none',
        borderRadius: 8,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        cursor: 'pointer',
        transition: 'background 0.2s',
        '&:hover': {
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
        }
    },
    dropMenu: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 8,
        width: 300,
        background: '#0d1117',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        zIndex: 100,
        overflow: 'hidden',
    },
    dropHeader: {
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        fontSize: 12,
        fontWeight: 700,
        color: '#fff',
        background: 'rgba(255,255,255,0.02)',
    },
    dropItem: {
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        cursor: 'pointer',
        transition: 'background 0.2s',
        '&:hover': {
            background: 'rgba(255,255,255,0.05)',
        }
    },
    dropTitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
    dropTime: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
    dropEmpty: { padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 },
}

export default TopBar
