import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AppProvider } from './context/AppContext'

import ErrorBoundary from './components/ErrorBoundary'
import { FullScreenLoader } from './components/LoadingState'
import { ToastContainer } from './components/Toast'
import { NotificationCenter } from './components/NotificationCenter'
import SEO from './components/SEO'

// 核心组件 - 静态导入以避免 Lazy Load 错误
import TranTradingTerminal from './components/TranTradingTerminal'
import ContentLibrary from './pages/ContentLibrary'

// 独立可分享页面
import { KellyCompletePage, KellyArticlePage, KellySimulatorPage } from './pages/KellyPages'

function App() {
    return (
        <ErrorBoundary>
            <HelmetProvider>
                <AppProvider>
                    <SEO /> {/* Default SEO */}
                    <ToastContainer>
                        <BrowserRouter>
                            {/* Suspense removed for static imports */}
                            <Routes>
                                <Route path="/" element={<TranTradingTerminal />} />

                                {/* Main Pages with unique URLs */}
                                <Route path="/dashboard" element={<TranTradingTerminal />} />
                                <Route path="/news" element={<TranTradingTerminal />} />
                                <Route path="/lab" element={<TranTradingTerminal />} />
                                <Route path="/about" element={<TranTradingTerminal />} />
                                <Route path="/systems" element={<TranTradingTerminal />} />
                                <Route path="/profile" element={<TranTradingTerminal />} />
                                <Route path="/analysis" element={<TranTradingTerminal />} />
                                <Route path="/curated" element={<TranTradingTerminal />} />
                                <Route path="/commentary" element={<TranTradingTerminal />} />
                                <Route path="/pricing" element={<TranTradingTerminal initialView="pricing" />} />

                                {/* Article Routes */}
                                <Route path="/analysis/:articleId" element={<TranTradingTerminal initialView="article-detail" />} />
                                <Route path="/article/:articleId" element={<TranTradingTerminal initialView="article-detail" />} />

                                {/* Content Library */}
                                <Route path="/column" element={<ContentLibrary />} />
                                <Route path="/library" element={<ContentLibrary />} />

                                {/* Kelly Pages */}
                                <Route path="/kelly" element={<KellyCompletePage />} />
                                <Route path="/article/kelly-criterion" element={<KellyArticlePage />} />
                                <Route path="/tools/kelly-simulator" element={<KellySimulatorPage />} />

                                {/* Admin Pages */}
                                <Route path="/admin" element={<TranTradingTerminal initialView="admin-sentiment" />} />

                                {/* Catch-all route for SPA */}
                                <Route path="*" element={<TranTradingTerminal />} />
                            </Routes>
                        </BrowserRouter>
                        <NotificationCenter />
                    </ToastContainer>
                </AppProvider>
            </HelmetProvider>
        </ErrorBoundary>
    )
}

export default App


