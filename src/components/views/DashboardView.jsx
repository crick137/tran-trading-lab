import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    TrendingUp, TrendingDown, Activity, BarChart2, Clock,
    Zap, Target, Star, Globe, Search, BarChart, Flame,
    ArrowUpRight, ArrowDownRight, Wifi, Shield,
    Layers, Crown, CheckCircle2, DollarSign, Percent,
    Wallet, Lock, RefreshCw, Trash2
} from 'lucide-react'
import {
    AreaChart, Area, ResponsiveContainer
} from 'recharts'
import useRealtimeData from '../../hooks/useRealtimeData'
import { useMarketData } from '../../hooks/useMarketData'
import { useOrderBook, useTrades } from '../../hooks/useOrderBook'
import { useTradingSimulator } from '../../hooks/useTradingSimulator'
import { useWatchlist } from '../../hooks/useWatchlist'
import { useORBAnalysis } from '../../hooks/useORBAnalysis'
import TradingPanel from '../TradingPanel'
import ORBPanel from '../ORBPanel'
import TradingViewChart from '../charts/TradingViewChart'
import { useAppState, useAppActions } from '../../context/AppContext'
import { useI18n } from '../../hooks/useI18n'

// Mini Sparkline Component
const MiniSparkline = React.memo(function MiniSparkline({ data, color, id }) {
    if (!data || data.length === 0) {
        return (
            <div style={{
                width: 70, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.2)', fontSize: 8
            }}>—</div>
        )
    }

    return (
        <div style={{ width: 70, height: 28, minWidth: 70, minHeight: 28 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                    <defs>
                        <linearGradient id={`sparkline-${id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sparkline-${id})`} dot={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
})

function DashboardView() {
    const { indicators } = useRealtimeData()
    const { isAuthenticated } = useAppState()
    const { openAuthModal } = useAppActions()
    const { t, language } = useI18n()

    const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT')
    const [time, setTime] = useState(new Date())
    const [searchQuery, setSearchQuery] = useState('')
    const [priceFlash, setPriceFlash] = useState({})
    const [activeCategory, setActiveCategory] = useState('all')
    const [showTradePanel, setShowTradePanel] = useState(false)
    const [closingPosition, setClosingPosition] = useState(null)
    const [showCloseAllConfirm, setShowCloseAllConfirm] = useState(false)

    // Simulator
    const trading = useTradingSimulator()
    // Watchlist
    const { toggleWatchlist, isInWatchlist } = useWatchlist()
    // Live Market Data
    const { data: liveData } = useMarketData()

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            const keys = ['BTC', 'ETH', 'SOL']
            const key = keys[Math.floor(Math.random() * keys.length)]
            const dir = Math.random() > 0.5 ? 'up' : 'down'
            setPriceFlash({ [key]: dir })
            setTimeout(() => setPriceFlash({}), 400)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const btcPrice = indicators?.btcPrice || 101234.56

    // Symbol Categories (Logic only)
    const symbolCategories = {
        'SPY': 'index', 'QQQ': 'index', 'DIA': 'index', 'NIKKEI': 'index', 'HSI': 'index', 'SSE': 'index', 'DAX': 'index', 'FTSE': 'index', 'CAC40': 'index', 'STOXX50': 'index',
        'BTC/USDT': 'crypto', 'ETH/USDT': 'crypto', 'SOL/USDT': 'crypto', 'BNB/USDT': 'crypto', 'XRP/USDT': 'crypto', 'AVAX/USDT': 'crypto', 'DOGE/USDT': 'crypto', 'ADA/USDT': 'crypto', 'LINK/USDT': 'crypto', 'DOT/USDT': 'crypto', 'MATIC/USDT': 'crypto', 'UNI/USDT': 'crypto', 'ATOM/USDT': 'crypto', 'LTC/USDT': 'crypto', 'APT/USDT': 'crypto', 'OP/USDT': 'crypto', 'ARB/USDT': 'crypto',
        'EUR/USD': 'forex', 'GBP/USD': 'forex', 'USD/JPY': 'forex', 'USD/CNH': 'forex', 'AUD/USD': 'forex', 'USD/CHF': 'forex', 'NZD/USD': 'forex', 'EUR/GBP': 'forex',
        'GOLD': 'commodity', 'SILVER': 'commodity', 'WTI': 'commodity', 'BRENT': 'commodity', 'NG': 'commodity', 'COPPER': 'commodity', 'PLATINUM': 'commodity', 'PALLADIUM': 'commodity',
    }

    const marketData = useMemo(() => {
        const orderedSymbols = Object.keys(symbolCategories)
        return orderedSymbols.map((symbol, index) => {
            const live = liveData[symbol] || {}
            return {
                symbol,
                name: t(`symbols.${symbol}`) || symbol,
                category: symbolCategories[symbol],
                price: live.price ?? 0,
                change: live.change ?? 0,
                volume: live.volume,
                high24h: live.high24h,
                low24h: live.low24h,
                rank: index + 1,
                sparkData: null,
            }
        })
    }, [liveData, t])

    const orderBook = useOrderBook(selectedSymbol)
    const { trades, connected: tradesConnected } = useTrades(selectedSymbol)

    const positions = useMemo(() => {
        return trading.positions.map(p => {
            const market = marketData.find(m => m.symbol === p.symbol)
            const currentPrice = market?.price || p.entryPrice
            const priceDiff = currentPrice - p.entryPrice
            const pnl = p.side === 'long' ? priceDiff * p.size * p.leverage : -priceDiff * p.size * p.leverage
            const roe = (pnl / p.margin) * 100
            return {
                ...p,
                side: p.side.toUpperCase(),
                leverage: `${p.leverage}x`,
                entry: p.entryPrice,
                mark: currentPrice,
                pnl,
                roe,
            }
        })
    }, [trading.positions, marketData])

    const maxAskTotal = Math.max(...orderBook.asks.map(a => parseFloat(a.total))) || 1
    const maxBidTotal = Math.max(...orderBook.bids.map(b => parseFloat(b.total))) || 1
    const selected = marketData.find(m => m.symbol === selectedSymbol) || marketData[0]

    // ORB Analysis
    const orb = useORBAnalysis(marketData, selectedSymbol)
    const totalPnl = positions.reduce((a, p) => a + p.pnl, 0)

    const tvSymbol = {
        'KOSPI': 'AMEX:EWY', 'KOSDAQ': 'AMEX:EWY', 'KRW/USD': 'FX:USDKRW',
        'SPY': 'AMEX:SPY', 'QQQ': 'NASDAQ:QQQ', 'DIA': 'AMEX:DIA',
        'NIKKEI': 'INDEX:NKY', 'HSI': 'HSI:HSI', 'SSE': 'SSE:000001',
        'DAX': 'XETR:DAX', 'FTSE': 'SPREADEX:FTSE',
        'BTC/USDT': 'BINANCE:BTCUSDT', 'ETH/USDT': 'BINANCE:ETHUSDT',
        'SOL/USDT': 'BINANCE:SOLUSDT', 'BNB/USDT': 'BINANCE:BNBUSDT',
        'XRP/USDT': 'BINANCE:XRPUSDT', 'AVAX/USDT': 'BINANCE:AVAXUSDT',
        'DOGE/USDT': 'BINANCE:DOGEUSDT', 'ADA/USDT': 'BINANCE:ADAUSDT',
        'LINK/USDT': 'BINANCE:LINKUSDT', 'DOT/USDT': 'BINANCE:DOTUSDT',
        'EUR/USD': 'FX:EURUSD', 'GBP/USD': 'FX:GBPUSD', 'USD/JPY': 'FX:USDJPY',
        'USD/CNH': 'FX:USDCNH', 'AUD/USD': 'FX:AUDUSD',
        'GOLD': 'COMEX:GC1!', 'SILVER': 'COMEX:SI1!', 'WTI': 'NYMEX:CL1!',
        'BRENT': 'ICEEUR:BRN1!', 'NG': 'NYMEX:NG1!', 'COPPER': 'COMEX:HG1!',
    }[selectedSymbol] || 'BINANCE:BTCUSDT'

    const getDateLocale = () => {
        switch (language) {
            case 'ko': return 'ko-KR'
            case 'zh': return 'zh-CN'
            default: return 'en-US'
        }
    }

    return (
        <div style={{ ...styles.container, position: 'relative', overflow: 'hidden' }}>
            {!isAuthenticated && (
                <div style={styles.authMask}>
                    <div style={styles.maskContent}>
                        <div style={styles.maskIconGlow}>
                            <Lock size={48} color="#00d26a" />
                        </div>
                        <h2 style={styles.maskTitle}>{t('auth.mask.title')}</h2>
                        <p style={styles.maskDesc}>{t('auth.mask.desc')}</p>
                        <div style={styles.maskFeatures}>
                            {(Array.isArray(t('auth.mask.features')) ? t('auth.mask.features') : []).map((feature, i) => (
                                <div key={i} style={styles.maskFeature}>
                                    <CheckCircle2 size={16} color="#00ff88" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                        <button style={styles.maskBtn} onClick={openAuthModal}>
                            <span>{t('auth.mask.btn')}</span>
                            <ArrowUpRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            <div style={styles.heroBar}>
                <div style={styles.heroLeft}>
                    <div style={styles.symbolCard}>
                        <div style={styles.symbolIconLarge}>
                            <span style={styles.symbolLetter}>{selectedSymbol.charAt(0)}</span>
                            <div style={styles.iconGlow} />
                        </div>
                        <div style={styles.symbolInfo}>
                            <div style={styles.symbolRow}>
                                <span style={styles.symbolMain}>{selectedSymbol}</span>
                                <span style={styles.perpBadge}>PERP</span>
                                {selected.rank <= 3 && <div style={styles.topBadge}><Crown size={10} /> TOP {selected.rank}</div>}
                            </div>
                            <div style={styles.priceHero}>
                                <span style={{ ...styles.priceValue, color: selected.change >= 0 ? '#00ff88' : '#ff4466', textShadow: selected.change >= 0 ? '0 0 30px rgba(0, 255, 136, 0.4)' : '0 0 30px rgba(255, 68, 102, 0.4)' }}>
                                    ${selected.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: selected.price < 10 ? 4 : 2 })}
                                </span>
                                <div style={{ ...styles.changePill, background: selected.change >= 0 ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 210, 106, 0.08) 100%)' : 'linear-gradient(135deg, rgba(255, 68, 102, 0.15) 0%, rgba(255, 56, 96, 0.08) 100%)', color: selected.change >= 0 ? '#00ff88' : '#ff4466' }}>
                                    {selected.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    <span>{Math.abs(selected.change).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><TrendingUp size={14} /></div>
                        <div style={styles.statContent}>
                            <span style={styles.statLabel}>{t('dashboard_ui.marketStats.high')}</span>
                            <span style={styles.statNum}>${selected.high24h ? selected.high24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><TrendingDown size={14} /></div>
                        <div style={styles.statContent}>
                            <span style={styles.statLabel}>{t('dashboard_ui.marketStats.low')}</span>
                            <span style={styles.statNum}>${selected.low24h ? selected.low24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><BarChart2 size={14} /></div>
                        <div style={styles.statContent}>
                            <span style={styles.statLabel}>{t('dashboard_ui.marketStats.vol')}</span>
                            <span style={styles.statNum}>{selected.volume ? (selected.volume >= 1e9 ? (selected.volume / 1e9).toFixed(2) + 'B' : selected.volume >= 1e6 ? (selected.volume / 1e6).toFixed(2) + 'M' : selected.volume.toLocaleString()) : '--'}</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><Layers size={14} /></div>
                        <div style={styles.statContent}>
                            <span style={styles.statLabel}>{t('dashboard_ui.marketStats.rank')}</span>
                            <span style={styles.statNum}>#{selected.rank || '--'}</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><Percent size={14} /></div>
                        <div style={styles.statContent}>
                            <span style={styles.statLabel}>{t('dashboard_ui.marketStats.change')}</span>
                            <span style={{ ...styles.statNum, color: selected.change >= 0 ? '#00ff88' : '#ff4466' }}>{selected.change >= 0 ? '+' : ''}{selected.change?.toFixed(2) || '0.00'}%</span>
                        </div>
                    </div>
                </div>

                <div style={styles.heroRight}>
                    <div style={styles.clockCard}>
                        <div style={styles.clockTime}>{time.toLocaleTimeString(getDateLocale(), { hour12: false })}</div>
                        <div style={styles.clockDate}>{time.toLocaleDateString(getDateLocale(), { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    </div>
                </div>
            </div>

            {showTradePanel && (
                <div style={styles.tradePanelOverlay} onClick={() => setShowTradePanel(false)}>
                    <div style={styles.tradePanelWrapper} onClick={e => e.stopPropagation()}>
                        <TradingPanel
                            symbol={selectedSymbol}
                            currentPrice={selected.price}
                            balance={trading.balance}
                            onClose={() => setShowTradePanel(false)}
                            onTrade={(order) => {
                                const result = trading.openPosition(order)
                                if (result.success) console.log('✅ Trade Executed:', result.position)
                                else alert(result.error)
                            }}
                        />
                    </div>
                </div>
            )}

            <div style={styles.mainGrid}>
                {/* Left - Markets */}
                <div style={styles.marketPanel}>
                    <div style={styles.panelHead}>
                        <div style={styles.headLeft}>
                            <div style={styles.headIcon}><BarChart2 size={14} /></div>
                            <span>{t('dashboard_ui.sections.markets')}</span>
                            <span style={styles.countBadge}>{marketData.length}</span>
                        </div>
                        <div style={styles.searchWrap}>
                            <Search size={12} />
                            <input
                                type="text"
                                placeholder={t('dashboard_ui.actions.search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div style={styles.categoryTabs}>
                        {[
                            { key: 'all', label: t('dashboard_ui.categories.all'), icon: Globe },
                            { key: 'watchlist', label: t('dashboard_ui.categories.watchlist'), icon: Star },
                            { key: 'index', label: t('dashboard_ui.categories.index'), icon: BarChart2 },
                            { key: 'crypto', label: t('dashboard_ui.categories.crypto'), icon: Zap },
                            { key: 'forex', label: t('dashboard_ui.categories.forex'), icon: DollarSign },
                            { key: 'commodity', label: t('dashboard_ui.categories.commodity'), icon: Flame },
                        ].map(cat => (
                            <button
                                key={cat.key}
                                style={{ ...styles.categoryBtn, ...(activeCategory === cat.key ? styles.categoryBtnActive : {}) }}
                                onClick={() => setActiveCategory(cat.key)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <div style={styles.tableHead}>
                        <span style={styles.thCol}>{t('dashboard_ui.cols.symbol')}</span>
                        <span style={{ ...styles.thCol, textAlign: 'right' }}>{t('dashboard_ui.cols.price')}</span>
                        <span style={{ ...styles.thCol, textAlign: 'right' }}>{t('dashboard_ui.cols.change24h')}</span>
                        <span style={{ ...styles.thCol, textAlign: 'center' }}>{t('dashboard_ui.cols.change7d')}</span>
                    </div>
                    <div style={styles.marketList}>
                        {marketData
                            .filter(m => {
                                if (searchQuery && !m.symbol.toLowerCase().includes(searchQuery.toLowerCase())) return false
                                if (activeCategory === 'watchlist') return isInWatchlist(m.symbol)
                                if (activeCategory !== 'all' && m.category !== activeCategory) return false
                                return true
                            })
                            .map((item, i) => {
                                const isSelected = selectedSymbol === item.symbol
                                const flashDir = priceFlash[item.symbol.split('/')[0]]
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            ...styles.marketRow,
                                            background: flashDir === 'up' ? 'rgba(0, 255, 136, 0.08)' :
                                                flashDir === 'down' ? 'rgba(255, 68, 102, 0.08)' :
                                                    isSelected ? 'linear-gradient(90deg, rgba(0, 210, 106, 0.12) 0%, transparent 100%)' : 'transparent',
                                            borderLeft: isSelected ? '2px solid #00ff88' : '2px solid transparent',
                                        }}
                                        onClick={() => setSelectedSymbol(item.symbol)}
                                    >
                                        <div style={styles.symbolCell}>
                                            <div style={styles.symbolDot}>{item.symbol.charAt(0)}</div>
                                            <div style={styles.symbolText}>
                                                <span style={styles.symbolName}>{item.symbol.split('/')[0]}</span>
                                                <span style={styles.symbolSub}>{item.name}</span>
                                            </div>
                                        </div>
                                        <span style={{ ...styles.priceCell, color: item.change >= 0 ? '#00ff88' : '#ff4466' }}>
                                            ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: item.price < 10 ? 4 : 2 })}
                                        </span>
                                        <span style={{ ...styles.changeCell, color: item.change >= 0 ? '#00ff88' : '#ff4466' }}>
                                            {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                                        </span>
                                        <div style={styles.chartAndActions}>
                                            <MiniSparkline data={item.sparkData} color={item.change >= 0 ? '#00ff88' : '#ff4466'} id={i} />
                                            <button
                                                style={{ ...styles.watchlistBtn, color: isInWatchlist(item.symbol) ? '#fbbf24' : 'rgba(255,255,255,0.3)' }}
                                                onClick={(e) => { e.stopPropagation(); toggleWatchlist(item.symbol) }}
                                                title={isInWatchlist(item.symbol) ? t('dashboard_ui.actions.removeFromWatchlist') : t('dashboard_ui.actions.addToWatchlist')}
                                            >
                                                <Star size={12} fill={isInWatchlist(item.symbol) ? '#fbbf24' : 'none'} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>

                {/* Center - Chart */}
                <div style={styles.chartPanel}>
                    <div style={styles.chartContainer}>
                        <TradingViewChart symbol={tvSymbol} />
                    </div>
                    {/* Positions */}
                    <div style={styles.posPanel}>
                        <div style={styles.posHead}>
                            <div style={styles.headLeft}>
                                <div style={{ ...styles.headIcon, background: 'rgba(0, 255, 136, 0.1)' }}><Target size={14} /></div>
                                <span>{t('dashboard_ui.sections.positions')}</span>
                                <span style={styles.posBadge}>{positions.length}</span>
                            </div>
                            <div style={{ ...styles.pnlTotal, color: totalPnl >= 0 ? '#00ff88' : '#ff4466' }}>
                                <DollarSign size={14} />
                                <span>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}</span>
                            </div>
                        </div>
                        <div style={styles.posTable}>
                            <div style={styles.positionHead}>
                                <span>{t('dashboard_ui.sections.positions')} ({positions.length})</span>
                                {positions.length > 0 && (
                                    <button style={styles.closeAllBtn} onClick={() => setShowCloseAllConfirm(true)}>
                                        {t('dashboard_ui.actions.closeAll')}
                                    </button>
                                )}
                            </div>
                            <div style={styles.posTableHead}>
                                <span>{t('dashboard_ui.cols.symbol')}</span>
                                <span>{t('dashboard_ui.cols.side')}</span>
                                <span>{t('dashboard_ui.cols.size')}</span>
                                <span style={{ textAlign: 'right' }}>{t('dashboard_ui.cols.entry')}</span>
                                <span style={{ textAlign: 'right' }}>{t('dashboard_ui.cols.mark')}</span>
                                <span style={{ textAlign: 'right' }}>{t('dashboard_ui.cols.pnl')}</span>
                                <span style={{ textAlign: 'right' }}>{t('dashboard_ui.cols.action')}</span>
                            </div>
                            {positions.length === 0 ? (
                                <div style={styles.noPositions}>{t('dashboard_ui.msg.noPositions')}</div>
                            ) : (
                                positions.map((p, i) => (
                                    <div key={p.id || i} style={styles.posTableRow}>
                                        <span style={{ fontWeight: 600 }}>{p.symbol}</span>
                                        <span style={{ ...styles.sideBadge, background: p.side === 'LONG' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 102, 0.1)', color: p.side === 'LONG' ? '#00ff88' : '#ff4466' }}>
                                            {p.side} {p.leverage}
                                        </span>
                                        <span>{p.size}</span>
                                        <span style={{ textAlign: 'right' }}>{p.entry?.toLocaleString()}</span>
                                        <span style={{ textAlign: 'right' }}>{p.mark?.toLocaleString()}</span>
                                        <span style={{ textAlign: 'right', fontWeight: 700, color: p.pnl >= 0 ? '#00ff88' : '#ff4466' }}>
                                            {p.pnl >= 0 ? '+' : ''}{p.pnl?.toFixed(2)} ({p.roe?.toFixed(2)}%)
                                        </span>
                                        <span style={{ textAlign: 'right' }}>
                                            <button style={styles.closeBtn} onClick={() => setClosingPosition(p)}>
                                                {t('dashboard_ui.actions.close')}
                                            </button>
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div style={styles.bottomAccountBar}>
                        <div style={styles.accountCard}>
                            <div style={styles.accountHeader}>
                                <Wallet size={14} />
                                <span>{t('dashboard_ui.account.simulation')}</span>
                                <button style={styles.resetBtn} onClick={trading.resetAccount} title={t('dashboard_ui.account.reset')}>
                                    <RefreshCw size={10} />
                                </button>
                            </div>
                            <div style={styles.accountBalance}>
                                <span style={styles.balanceLabel}>{t('dashboard_ui.account.balance')}</span>
                                <span style={styles.balanceValue}>${trading.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                        <div style={styles.accountStatItem}>
                            <span style={styles.statItemLabel}>{t('dashboard_ui.account.equity')}</span>
                            <span style={{ ...styles.statItemValue, color: '#00d4ff' }}>${trading.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={styles.accountStatItem}>
                            <span style={styles.statItemLabel}>{t('dashboard_ui.account.usedMargin')}</span>
                            <span style={{ ...styles.statItemValue, color: '#fbbf24' }}>${trading.usedMargin?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div style={styles.accountStatItem}>
                            <span style={styles.statItemLabel}>{t('dashboard_ui.account.unrealized')}</span>
                            <span style={{ ...styles.statItemValue, color: trading.unrealizedPnl >= 0 ? '#00ff88' : '#ff4466' }}>
                                {trading.unrealizedPnl >= 0 ? '+' : ''}{trading.unrealizedPnl?.toFixed(2) || '0.00'}
                            </span>
                        </div>
                        <div style={styles.accountStatItem}>
                            <span style={styles.statItemLabel}>{t('dashboard_ui.account.cumulative')}</span>
                            <span style={{ ...styles.statItemValue, color: trading.stats?.totalPnl >= 0 ? '#00ff88' : '#ff4466' }}>
                                {trading.stats?.totalPnl >= 0 ? '+' : ''}{trading.stats?.totalPnl?.toFixed(2) || '0.00'}
                            </span>
                        </div>
                        <div style={styles.accountStatItem}>
                            <span style={styles.statItemLabel}>{t('dashboard_ui.account.winRate')}</span>
                            <span style={{ ...styles.statItemValue, color: '#00d4ff' }}>{trading.winRate || 0}%</span>
                        </div>
                        <button style={styles.tradeBtn} onClick={() => setShowTradePanel(!showTradePanel)}>
                            <Zap size={14} />
                            <span>{t('dashboard_ui.actions.trade')} {selectedSymbol}</span>
                        </button>
                    </div>
                </div>

                {/* Right - Order Book + Trades */}
                <div style={styles.rightPanel}>
                    {/* Order Book */}
                    <div style={styles.bookPanel}>
                        <div style={styles.panelHead}>
                            <div style={styles.headLeft}>
                                <div style={styles.headIcon}><BarChart size={14} /></div>
                                <span>{t('dashboard_ui.sections.orderBook')}</span>
                            </div>
                            <span style={styles.spreadVal}>{t('dashboard_ui.cols.spread')}: {orderBook.spread || '0.00'} ({orderBook.spreadPercent || '0.00'}%)</span>
                        </div>
                        <div style={styles.bookLabels}>
                            <span>{t('dashboard_ui.cols.price')}</span>
                            <span style={{ textAlign: 'center' }}>{t('dashboard_ui.cols.size')}</span>
                            <span style={{ textAlign: 'right' }}>{t('dashboard_ui.cols.total')}</span>
                        </div>
                        <div style={styles.asksWrap}>
                            {orderBook.asks.map((ask, i) => (
                                <div key={i} style={styles.bookRow}>
                                    <div style={{ ...styles.bookDepth, width: `${(parseFloat(ask.total) / maxAskTotal) * 100}%`, background: 'linear-gradient(90deg, transparent, rgba(255, 68, 102, 0.15))' }} />
                                    <span style={{ ...styles.bookPrice, color: '#ff4466' }}>{parseFloat(ask.price).toFixed(2)}</span>
                                    <span style={styles.bookSize}>{ask.size}</span>
                                    <span style={styles.bookTotal}>{ask.total}</span>
                                </div>
                            ))}
                        </div>
                        <div style={styles.midBar}>
                            <span style={styles.midPrice}>${btcPrice.toFixed(2)}</span>
                            <span style={styles.midUsd}>≈ {btcPrice.toFixed(2)} USD</span>
                        </div>
                        <div style={styles.bidsWrap}>
                            {orderBook.bids.map((bid, i) => (
                                <div key={i} style={styles.bookRow}>
                                    <div style={{ ...styles.bookDepth, width: `${(parseFloat(bid.total) / maxBidTotal) * 100}%`, background: 'linear-gradient(270deg, transparent, rgba(0, 255, 136, 0.15))' }} />
                                    <span style={{ ...styles.bookPrice, color: '#00ff88' }}>{parseFloat(bid.price).toFixed(2)}</span>
                                    <span style={styles.bookSize}>{bid.size}</span>
                                    <span style={styles.bookTotal}>{bid.total}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ORB Panel */}
                    <ORBPanel
                        orbState={orb.orbState}
                        signals={orb.signals}
                        targets={orb.targets}
                        stats={orb.stats}
                        config={orb.config}
                        currentData={orb.currentData}
                        onConfigChange={orb.updateConfig}
                        onReset={orb.resetORB}
                        getStatusText={orb.getStatusText}
                        getRiskAssessment={orb.getRiskAssessment}
                        hasBreakout={orb.hasBreakout}
                        isLong={orb.isLong}
                        isShort={orb.isShort}
                    />

                    {/* Trades */}
                    <div style={styles.tradesPanel}>
                        <div style={styles.panelHead}>
                            <div style={styles.headLeft}>
                                <div style={styles.headIcon}><Activity size={14} /></div>
                                <span>{t('dashboard_ui.sections.trades')}</span>
                            </div>
                            <div style={styles.liveBadge}>
                                {tradesConnected && <div style={styles.liveGlow} />}
                                <span>{tradesConnected ? t('dashboard_ui.status.live') : t('dashboard_ui.status.connecting')}</span>
                            </div>
                        </div>
                        <div style={styles.tradesLabels}>
                            <span>{t('dashboard_ui.cols.time')}</span>
                            <span style={{ textAlign: 'center' }}>{t('dashboard_ui.cols.price')}</span>
                            <span style={{ textAlign: 'right' }}>{t('dashboard_ui.cols.size')}</span>
                        </div>
                        <div style={styles.tradesList}>
                            {trades.map((t, i) => (
                                <div key={i} style={{ ...styles.tradeRow, animation: i === 0 ? 'slideIn 0.3s ease' : 'none' }}>
                                    <span style={styles.tradeTime}>{t.time}</span>
                                    <span style={{ ...styles.tradePrice, color: t.side === 'buy' ? '#00ff88' : '#ff4466' }}>{t.price}</span>
                                    <span style={styles.tradeSize}>{t.size}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.statusBar}>
                <div style={styles.statusLeft}>
                    <div style={styles.connBadge}>
                        <div style={styles.connGlow} />
                        <span>{t('dashboard_ui.status.connected')}</span>
                    </div>
                    <span style={styles.sep}>|</span>
                    <span style={styles.latency}><Wifi size={10} /> 12ms</span>
                    <span style={styles.sep}>|</span>
                    <span><Shield size={10} /> {t('dashboard_ui.status.secure')}</span>
                    <span style={styles.sep}>|</span>
                    <span>{t('dashboard_ui.status.server')}: BINANCE-WS</span>
                </div>
                <div style={styles.statusRight}>
                    <span>⌘K Command</span>
                    <span>F5 Refresh</span>
                    <span>ESC Close</span>
                </div>
            </div>
        </div>
    )
}

const styles = {
    authMask: { position: 'absolute', inset: 0, zIndex: 900, background: 'rgba(5, 10, 20, 0.8)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    maskContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 560, padding: 40 },
    maskIconGlow: { width: 100, height: 100, borderRadius: '50%', background: 'rgba(0, 210, 106, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, boxShadow: '0 0 60px rgba(0, 210, 106, 0.15)' },
    maskTitle: { fontSize: 36, fontWeight: 800, marginBottom: 16, color: '#fff', letterSpacing: '-0.02em' },
    maskDesc: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 48, lineHeight: 1.6 },
    maskFeatures: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 48, width: '100%' },
    maskFeature: { display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 500 },
    maskBtn: { display: 'flex', alignItems: 'center', gap: 12, padding: '18px 48px', background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)', border: 'none', borderRadius: 100, color: '#000', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 30px rgba(0, 210, 106, 0.3)', transition: 'all 0.2s' },

    container: { display: 'flex', flexDirection: 'column', height: '100%', background: 'linear-gradient(180deg, #020408 0%, #040810 50%, #020408 100%)', fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden' },
    heroBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'linear-gradient(180deg, rgba(0, 210, 106, 0.06) 0%, rgba(0, 144, 255, 0.02) 50%, transparent 100%)', borderBottom: '1px solid rgba(0, 210, 106, 0.1)', backdropFilter: 'blur(20px)' },
    heroLeft: { display: 'flex', alignItems: 'center' },
    symbolCard: { display: 'flex', alignItems: 'center', gap: 16 },
    symbolIconLarge: { position: 'relative', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #00ff88 0%, #00d26a 100%)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0, 255, 136, 0.4)', animation: 'neon-breathe 3s ease-in-out infinite' },
    symbolLetter: { fontSize: 20, fontWeight: 900, color: '#000' },
    iconGlow: { position: 'absolute', inset: -12, background: 'radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, rgba(0, 210, 106, 0.1) 40%, transparent 70%)', borderRadius: 24, zIndex: -1, animation: 'pulse 3s ease-in-out infinite' },
    symbolInfo: { display: 'flex', flexDirection: 'column', gap: 4 },
    symbolRow: { display: 'flex', alignItems: 'center', gap: 10 },
    symbolMain: { fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" },
    perpBadge: { padding: '3px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 4, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)' },
    topBadge: { display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', borderRadius: 4, fontSize: 9, fontWeight: 800, color: '#000' },
    priceHero: { display: 'flex', alignItems: 'center', gap: 14 },
    priceValue: { fontSize: 26, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em' },
    changePill: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: '1px solid rgba(255,255,255,0.05)' },
    statsGrid: { display: 'flex', gap: 8 },
    statCard: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' },
    statIcon: { width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 210, 106, 0.15) 0%, rgba(0, 210, 106, 0.08) 100%)', borderRadius: 8, color: '#00ff88', transition: 'all 0.3s ease' },
    statContent: { display: 'flex', flexDirection: 'column' },
    statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 500 },
    statNum: { fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono', monospace" },
    heroRight: { display: 'flex', alignItems: 'center', gap: 16 },
    clockCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 16px', background: 'rgba(0, 210, 106, 0.08)', border: '1px solid rgba(0, 210, 106, 0.2)', borderRadius: 10 },
    clockTime: { fontSize: 22, fontWeight: 800, color: '#00ff88', fontFamily: "'JetBrains Mono', monospace", textShadow: '0 0 20px rgba(0, 255, 136, 0.5)' },
    clockDate: { fontSize: 9, color: 'rgba(255,255,255,0.4)' },
    mainGrid: { display: 'grid', gridTemplateColumns: '300px 1fr 320px', flex: 1, gap: 2, background: 'rgba(0,210,106,0.02)', overflow: 'hidden' },
    marketPanel: { display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, rgba(8,12,20,0.98) 0%, rgba(4,8,16,0.98) 100%)', overflow: 'hidden', borderRight: '1px solid rgba(0,210,106,0.08)' },
    chartPanel: { display: 'flex', flexDirection: 'column', background: '#040810', overflow: 'hidden' },
    closeAllBtn: { background: 'rgba(255, 68, 102, 0.1)', color: '#ff4466', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 10, cursor: 'pointer', transition: 'all 0.2s' },
    rightPanel: { display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, rgba(8,12,20,0.98) 0%, rgba(4,8,16,0.98) 100%)', overflow: 'hidden', borderLeft: '1px solid rgba(0,210,106,0.08)' },
    panelHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'linear-gradient(180deg, rgba(0,210,106,0.06) 0%, rgba(0,0,0,0.3) 100%)', borderBottom: '1px solid rgba(0,210,106,0.1)' },
    headLeft: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' },
    headIcon: { width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 210, 106, 0.2) 0%, rgba(0, 210, 106, 0.1) 100%)', borderRadius: 8, color: '#00ff88', boxShadow: '0 0 20px rgba(0,210,106,0.15)' },
    countBadge: { padding: '3px 10px', background: 'linear-gradient(135deg, rgba(0, 210, 106, 0.15) 0%, rgba(0, 210, 106, 0.08) 100%)', borderRadius: 12, fontSize: 11, fontWeight: 700, color: '#00ff88', border: '1px solid rgba(0,210,106,0.2)' },
    searchWrap: { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, color: 'rgba(255,255,255,0.3)' },
    searchInput: { width: 100, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: '#fff' },
    tableHead: { display: 'grid', gridTemplateColumns: '1fr 80px 60px 70px', padding: '10px 18px', fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.03)' },
    thCol: {},
    marketList: { flex: 1, overflow: 'auto' },
    marketRow: { display: 'grid', gridTemplateColumns: '1fr 80px 60px 70px', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', background: 'transparent' },
    symbolCell: { display: 'flex', alignItems: 'center', gap: 12 },
    symbolDot: { width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0, 210, 106, 0.25) 0%, rgba(0, 180, 100, 0.1) 100%)', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#00ff88', boxShadow: '0 2px 8px rgba(0,210,106,0.15)' },
    symbolText: { display: 'flex', flexDirection: 'column' },
    symbolName: { fontSize: 13, fontWeight: 700, color: '#fff' },
    symbolSub: { fontSize: 9, color: 'rgba(255,255,255,0.35)' },
    priceCell: { fontSize: 12, fontWeight: 700, textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" },
    changeCell: { fontSize: 11, fontWeight: 600, textAlign: 'right' },
    chartContainer: { flex: 1, minHeight: 0 },
    posPanel: { borderTop: '1px solid rgba(255,255,255,0.03)' },
    posHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(0,0,0,0.2)' },
    posBadge: { padding: '2px 8px', background: 'rgba(0, 210, 106, 0.1)', borderRadius: 10, fontSize: 10, fontWeight: 700, color: '#00d26a' },
    pnlTotal: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 16, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" },
    posTable: {},
    positionHead: { display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.4)', fontSize: 11, padding: '10px 18px', alignItems: 'center' },
    posTableHead: { display: 'grid', gridTemplateColumns: '1fr 0.9fr 0.6fr 0.8fr 0.8fr 1.2fr 0.7fr', padding: '10px 18px', fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.03)' },
    posTableRow: { display: 'grid', gridTemplateColumns: '1fr 0.9fr 0.6fr 0.8fr 0.8fr 1.2fr 0.7fr', padding: '12px 18px', fontSize: 11, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.02)', fontFamily: "'JetBrains Mono', monospace" },
    sideBadge: { padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 },
    bookPanel: { flex: 1, display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.03)', overflow: 'hidden' },
    spreadVal: { fontSize: 10, fontWeight: 600, color: '#fbbf24' },
    bookLabels: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 16px', fontSize: 9, color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.03)' },
    asksWrap: { display: 'flex', flexDirection: 'column-reverse' },
    bidsWrap: { display: 'flex', flexDirection: 'column' },
    bookRow: { position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '4px 16px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" },
    bookDepth: { position: 'absolute', top: 0, bottom: 0, right: 0 },
    bookPrice: { fontWeight: 600, zIndex: 1 },
    bookSize: { textAlign: 'center', color: 'rgba(255,255,255,0.5)', zIndex: 1 },
    bookTotal: { textAlign: 'right', color: 'rgba(255,255,255,0.3)', zIndex: 1 },
    midBar: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '12px', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' },
    midPrice: { fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: "'JetBrains Mono', monospace" },
    midUsd: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
    tradesPanel: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    liveBadge: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: '#00ff88' },
    liveGlow: { width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 12px rgba(0, 255, 136, 0.8)', animation: 'pulse 2s infinite' },
    tradesLabels: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 16px', fontSize: 9, color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.03)' },
    tradesList: { flex: 1, overflow: 'auto' },
    tradeRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '6px 16px', fontSize: 11, borderBottom: '1px solid rgba(255,255,255,0.015)', fontFamily: "'JetBrains Mono', monospace" },
    tradeTime: { color: 'rgba(255,255,255,0.35)' },
    tradePrice: { textAlign: 'center', fontWeight: 600 },
    tradeSize: { textAlign: 'right', color: 'rgba(255,255,255,0.5)' },
    statusBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px', background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 50%, #00d4ff 100%)', color: '#000', boxShadow: '0 -4px 20px rgba(0,210,106,0.2)' },
    statusLeft: { display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, fontWeight: 600 },
    connBadge: { display: 'flex', alignItems: 'center', gap: 6 },
    connGlow: { width: 6, height: 6, borderRadius: '50%', background: '#000' },
    sep: { opacity: 0.3 },
    latency: { display: 'flex', alignItems: 'center', gap: 4 },
    statusRight: { display: 'flex', gap: 20, fontSize: 11, fontWeight: 600, opacity: 0.6 },
    accountCard: { display: 'flex', flexDirection: 'column', gap: 6, padding: 16, background: 'rgba(0, 210, 106, 0.06)', border: '1px solid rgba(0, 210, 106, 0.15)', borderRadius: 12, minWidth: 200, maxWidth: 220 },
    accountHeader: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)' },
    resetBtn: { marginLeft: 'auto', padding: 4, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 4, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' },
    accountBalance: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 },
    balanceLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' },
    balanceValue: { fontSize: 16, fontWeight: 800, color: '#00ff88', fontFamily: "'JetBrains Mono', monospace" },
    accountStatItem: { display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, minWidth: 80 },
    statItemLabel: { fontSize: 9, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statItemValue: { fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" },
    tradeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6, padding: '10px 16px', background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)', border: 'none', borderRadius: 8, color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' },
    categoryTabs: { display: 'flex', gap: 4, padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', flexWrap: 'wrap' },
    categoryBtn: { padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s ease', backdropFilter: 'blur(4px)' },
    categoryBtnActive: { background: 'linear-gradient(135deg, rgba(0, 210, 106, 0.2) 0%, rgba(0, 210, 106, 0.08) 100%)', borderColor: 'rgba(0, 210, 106, 0.4)', color: '#00ff88', boxShadow: '0 0 20px rgba(0, 210, 106, 0.2)' },
    chartAndActions: { display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' },
    watchlistBtn: { padding: 4, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' },
    tradePanelOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
    tradePanelWrapper: { width: 360, maxHeight: '90vh', overflow: 'auto' },
    closeBtn: { padding: '4px 10px', background: 'linear-gradient(135deg, #ff4466 0%, #ff6b35 100%)', border: 'none', borderRadius: 4, color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' },
    noPositions: { padding: 20, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12 },
    bottomAccountBar: { display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)', borderRadius: 14, marginTop: 12, flexWrap: 'wrap', border: '1px solid rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(8px)' },
}

export default DashboardView
