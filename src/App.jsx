import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

import ErrorBoundary from './components/ErrorBoundary'
import { FullScreenLoader } from './components/LoadingState'
import { ToastContainer } from './components/Toast'
import { NotificationCenter } from './components/NotificationCenter'

// 路由懒加载
const TranTradingTerminal = lazy(() => import('./components/TranTradingTerminal'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

function App() {
    return (
        <ErrorBoundary>
            <AppProvider>
                <ToastContainer>
                    <BrowserRouter>
                        <Suspense fallback={<FullScreenLoader message="TRAN Terminal 로딩 중..." />}>
                            <Routes>
                                <Route path="/" element={<TranTradingTerminal />} />
                                <Route path="/admin" element={<AdminPage />} />
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

