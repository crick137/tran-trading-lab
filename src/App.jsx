import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

import ErrorBoundary from './components/ErrorBoundary'
import { FullScreenLoader } from './components/LoadingState'
import { ToastContainer } from './components/Toast'
import { NotificationCenter } from './components/NotificationCenter'

// 路由懒加载
const TranTradingTerminal = lazy(() => import('./components/TranTradingTerminal'))
const ContentLibrary = lazy(() => import('./pages/ContentLibrary'))

// 独立可分享页面 - 直接导入（避免懒加载问题）
import { KellyCompletePage, KellyArticlePage, KellySimulatorPage } from './pages/KellyPages'

function App() {
    return (
        <ErrorBoundary>
            <AppProvider>
                <ToastContainer>
                    <BrowserRouter>
                        <Suspense fallback={<FullScreenLoader message="TRAN Terminal 로딩 중..." />}>
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
                        </Suspense>
                        <NotificationCenter />
                    </BrowserRouter>
                </ToastContainer>
            </AppProvider>
        </ErrorBoundary>
    )
}

export default App


