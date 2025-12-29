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

// 独立可分享页面 - 使用命名导出
const KellyArticlePage = lazy(() => import('./pages/KellyPages').then(m => ({ default: m.KellyArticlePage })))
const KellySimulatorPage = lazy(() => import('./pages/KellyPages').then(m => ({ default: m.KellySimulatorPage })))

function App() {
    return (
        <ErrorBoundary>
            <AppProvider>
                <ToastContainer>
                    <BrowserRouter>
                        <Suspense fallback={<FullScreenLoader message="TRAN Terminal 로딩 중..." />}>
                            <Routes>
                                <Route path="/" element={<TranTradingTerminal />} />
                                <Route path="/analysis/:articleId" element={<TranTradingTerminal initialView="article-detail" />} />
                                <Route path="/library" element={<ContentLibrary />} />

                                {/* 可独立分享的文章和工具页面 */}
                                <Route path="/article/kelly-criterion" element={<KellyArticlePage />} />
                                <Route path="/tools/kelly-simulator" element={<KellySimulatorPage />} />

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


