import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, Newspaper, BarChart3, Globe,
    GraduationCap, BookOpen, Wrench, Home, Info, FlaskConical
} from 'lucide-react'
import Background3D from './3d/Background3D'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import HomeView from './views/HomeView'
import DashboardView from './views/DashboardView'
import BriefView from './views/BriefView'
import AnalysisView from './views/AnalysisView'
import NewsView from './views/NewsView'
import LabView from './views/LabView'
import NoteView from './views/NoteView'
import ToolsView from './views/ToolsView'
import IntroductionView from './views/IntroductionView'
import ExperimentsView from './views/ExperimentsView'
import ProfileView from './views/ProfileView'
import CommandPalette from './CommandPalette'
import AIAssistant from './AIAssistant'
import { useAppState, useAppActions } from '../context/AppContext'
import { useGlobalKeyboard } from '../hooks/useKeyboard.jsx'
import { Bot } from 'lucide-react'
import { useI18n } from '../hooks/useI18n.jsx'

function TranTradingTerminal({ initialView }) {
    const { articleId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [activeView, setActiveView] = useState(() => {
        // 如果 URL 中有 articleId，直接显示分析页面
        if (articleId || initialView === 'article-detail') {
            return 'analysis'
        }
        return 'home'
    })
    const [tradeSymbol, setTradeSymbol] = useState('BTC/USDT')
    const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
    const [directArticleId, setDirectArticleId] = useState(articleId || null)

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

    // Navigation Items with I18n
    const navItems = useMemo(() => [
        { id: 'home', label: t('nav.home'), icon: Home },
        { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { id: 'brief', label: t('nav.brief'), icon: Newspaper },
        { id: 'analysis', label: t('nav.analysis'), icon: BarChart3 },
        { id: 'news', label: t('nav.news'), icon: Globe },
        { id: 'lab', label: t('nav.lab'), icon: GraduationCap },
        { id: 'experiments', label: t('nav.experiments') || '实验室', icon: FlaskConical },
        { id: 'note', label: t('nav.note'), icon: BookOpen },
        { id: 'tools', label: t('nav.tools'), icon: Wrench },
        { id: 'about', label: t('nav.about'), icon: Info }, // Changed icon to Info
    ], [t])

    // Handle Navigation - 更新 URL
    const handleNavigate = useCallback((view) => {
        setActiveView(view)
        setDirectArticleId(null) // 清除直接打开的文章
        // 更新 URL 但不重新加载页面
        if (view === 'home') {
            navigate('/', { replace: true })
        }
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
            case 'brief': return <BriefView />
            case 'analysis': return <AnalysisView directArticleId={directArticleId} onClearDirectArticle={() => setDirectArticleId(null)} />
            case 'news': return <NewsView />
            case 'lab': return <LabView />
            case 'experiments': return <ExperimentsView />
            case 'note': return <NoteView />
            case 'tools': return <ToolsView />
            case 'about': return <IntroductionView />
            case 'profile': return <ProfileView onNavigate={handleNavigate} />
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
