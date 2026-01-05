import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, BarChart3, Globe,
    GraduationCap, Home, Info, Cpu, BookOpen, MessageSquare, Sparkles
} from 'lucide-react'
import Background3D from './3d/Background3D'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import HomeView from './views/HomeView'
import DashboardView from './views/DashboardView'
import AnalysisView from './views/AnalysisView'
import NewsView from './views/NewsView'
import LabView from './views/LabView'
import SystemsView from './views/SystemsView'
import IntroductionView from './views/IntroductionView'
import ProfileView from './views/ProfileView'
import AdminSentimentView from './views/AdminSentimentView'
import CuratedArticlesView from './views/CuratedArticlesView'
import NewsCommentaryView from './views/NewsCommentaryView'
import PricingView from './views/PricingView'
import CommandPalette from './CommandPalette'
import AIAssistant from './AIAssistant'
import { SubscribePopup } from './EmailSubscribe'
import { useAppState, useAppActions } from '../context/AppContext'
import { useGlobalKeyboard } from '../hooks/useKeyboard.jsx'
import { Bot } from 'lucide-react'
import { useI18n } from '../hooks/useI18n.jsx'
import { initGA, useAnalytics } from '../lib/analytics'

function TranTradingTerminal({ initialView }) {
    const { articleId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [activeView, setActiveView] = useState(() => {
        // 根据 URL 路径设置初始视图
        const path = window.location.pathname
        if (initialView === 'admin-sentiment') return 'admin-sentiment'
        if (articleId || initialView === 'article-detail') return 'analysis'
        if (path === '/dashboard') return 'dashboard'
        if (path === '/news') return 'news'
        if (path === '/lab') return 'lab'
        if (path === '/about') return 'about'
        if (path === '/systems') return 'systems'
        if (path === '/analysis') return 'analysis'
        if (path === '/curated') return 'curated'
        if (path === '/commentary') return 'commentary'
        return 'home'
    })
    const [tradeSymbol, setTradeSymbol] = useState('BTC/USDT')
    const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
    const [directArticleId, setDirectArticleId] = useState(articleId || null)

    // Google Analytics - 页面追踪
    useAnalytics()
    useEffect(() => {
        initGA()
    }, [])

    // Global State
    const {
        sidebarCollapsed,
        commandPaletteOpen,
        theme,
        tradePanelOpen
    } = useAppState()

    const {
        toggleSidebar,
        toggleCommandPalette,
        setTheme,
        openTradePanel,
        closeTradePanel
    } = useAppActions()

    // I18n
    const { language, setLanguage, t } = useI18n()

    // Navigation - 6 core pages + Systems
    const navItems = useMemo(() => [
        { id: 'home', label: t('nav.home'), icon: Home },
        { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { id: 'analysis', label: t('nav.analysis'), icon: BarChart3 },
        { id: 'news', label: t('nav.news'), icon: Globe },
        { id: 'curated', label: '정선 아티클', icon: Sparkles },
        { id: 'commentary', label: 'AI 코멘터리', icon: MessageSquare },
        { id: 'lab', label: t('nav.lab'), icon: GraduationCap },
        { id: 'library', label: t('nav.library') || 'Library', icon: BookOpen },
        { id: 'systems', label: t('nav.systems') || 'Systems', icon: Cpu },
        { id: 'about', label: t('nav.about'), icon: Info },
    ], [t])

    // Handle Navigation - 更新 URL
    const handleNavigate = useCallback((view) => {
        if (view === 'column' || view === 'library') {
            navigate('/column')
            return
        }

        setActiveView(view)
        setDirectArticleId(null) // 清除直接打开的文章

        // 更新 URL 为对应页面路径
        const pathMap = {
            'home': '/',
            'dashboard': '/dashboard',
            'analysis': '/analysis',
            'news': '/news',
            'curated': '/curated',
            'commentary': '/commentary',
            'lab': '/lab',
            'systems': '/systems',
            'about': '/about',
            'profile': '/profile',
        }
        const newPath = pathMap[view] || '/'
        navigate(newPath, { replace: false })
    }, [navigate])

    // Handle Trade Panel
    const handleTrade = useCallback((symbol) => {
        setTradeSymbol(symbol)
        openTradePanel(symbol)
    }, [openTradePanel])

    // Handle Theme Toggle
    const handleThemeToggle = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }, [theme, setTheme])

    // Global Keyboard Shortcuts
    useGlobalKeyboard({
        onCommandPalette: toggleCommandPalette,
        onNavigate: handleNavigate,
        onEscape: useCallback(() => {
            if (commandPaletteOpen) toggleCommandPalette()
            if (tradePanelOpen) closeTradePanel()
        }, [commandPaletteOpen, tradePanelOpen, toggleCommandPalette, closeTradePanel]),
        onToggleSidebar: toggleSidebar,
        onToggleTheme: handleThemeToggle,
        onTrade: () => handleTrade(tradeSymbol),
    })

    const renderView = () => {
        switch (activeView) {
            case 'home': return <HomeView onNavigate={handleNavigate} />
            case 'dashboard': return <DashboardView />
            case 'analysis': return <AnalysisView directArticleId={directArticleId} onClearDirectArticle={() => setDirectArticleId(null)} />
            case 'news': return <NewsView />
            case 'curated': return <CuratedArticlesView />
            case 'commentary': return <NewsCommentaryView />
            case 'lab': return <LabView />
            case 'pricing': return <PricingView />
            case 'systems': return <SystemsView />
            case 'about': return <IntroductionView />
            case 'profile': return <ProfileView onNavigate={handleNavigate} />
            case 'admin-sentiment': return <AdminSentimentView onBack={() => handleNavigate('home')} />
            default: return <HomeView onNavigate={handleNavigate} />
        }
    }

    return (
        <div style={styles.terminal} data-theme={theme}>
            {/* 3D Animated Background */}
            <Background3D />

            {/* Top Navigation Bar */}
            <TopBar
                onCommandPalette={toggleCommandPalette}
                theme={theme}
                onThemeToggle={handleThemeToggle}
                language={language}
                onLanguageChange={setLanguage}
                onProfileClick={() => handleNavigate('profile')}
            />

            {/* Sidebar Navigation */}
            <Sidebar
                navItems={navItems}
                activeView={activeView}
                onNavClick={handleNavigate}
                collapsed={sidebarCollapsed}
                onToggle={toggleSidebar}
            />

            {/* Main Content Area */}
            <main style={{
                ...styles.main,
                marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
            }}>
                <div style={styles.content} key={activeView}>
                    {renderView()}
                </div>
            </main>

            {/* Command Palette */}
            <CommandPalette
                isOpen={commandPaletteOpen}
                onClose={toggleCommandPalette}
                onNavigate={handleNavigate}
                onTrade={handleTrade}
                onThemeToggle={handleThemeToggle}
                onLanguageChange={setLanguage}
                language={language}
            />

            {/* AI Assistant */}
            <AIAssistant
                isOpen={aiAssistantOpen}
                onClose={() => setAiAssistantOpen(false)}
            />

            {/* AI Floating Button */}
            {!aiAssistantOpen && (
                <button
                    onClick={() => setAiAssistantOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0, 210, 106, 0.4)',
                        color: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 999,
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Bot size={24} />
                </button>
            )}
        </div>
    )
}

const styles = {
    terminal: {
        position: 'relative',
        height: '100vh',
        background: 'var(--bg-void)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
    },
    main: {
        position: 'relative',
        marginTop: 'var(--topbar-height)',
        height: 'calc(100vh - var(--topbar-height))',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 10,
        overflow: 'hidden',
    },
    content: {
        height: '100%',
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease',
    },
}

export default TranTradingTerminal
