import React, { useState, useEffect, useMemo } from 'react'
import {
    LayoutDashboard, FileText, Newspaper, FlaskConical, StickyNote,
    Plus, Search, Trash2, Edit, Eye, EyeOff, RefreshCw,
    ChevronLeft, ChevronRight, Save, X, AlertCircle, CheckCircle,
    Zap, Settings, LogOut, Menu, Filter, Download, Lock, Key,
    Users, Activity, TrendingUp, BarChart2, Database, Shield,
    Clock, CalendarDays, Sparkles, Crown, Globe, ImagePlus, Upload
} from 'lucide-react'
import { db, TABLES, storage, auth } from '../lib/supabase'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

// 权限配置 (实际应用中应在数据库中配置角色)
const ADMIN_EMAILS = ['izuowangdaozi@gmail.com', 'admin@trantrading.com', 'admin@example.com']

// 登录界面
// 登录界面
function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { user } = await auth.signIn(email, password)
            if (user) {
                // 简单的管理员检查 (实际应检查 role)
                // if (!ADMIN_EMAILS.includes(user.email)) {
                //     await auth.signOut()
                //     throw new Error('该账户没有管理员权限')
                // }
                onLogin()
            } else {
                throw new Error('登录失败')
            }
        } catch (err) {
            setError(err.message || '登录失败，请检查邮箱和密码')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={loginStyles.container}>
            {/* 背景光效 */}
            <div style={loginStyles.bgGlow1} />
            <div style={loginStyles.bgGlow2} />

            <div style={loginStyles.card}>
                <div style={loginStyles.iconWrap}>
                    <Shield size={36} />
                </div>
                <h1 style={loginStyles.title}>TRAN 管理后台</h1>
                <p style={loginStyles.subtitle}>请登录管理员账户</p>

                <form onSubmit={handleSubmit} style={loginStyles.form}>
                    <div style={loginStyles.inputWrap}>
                        <Users size={18} style={loginStyles.inputIcon} />
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            style={loginStyles.input}
                            autoFocus
                        />
                    </div>
                    <div style={loginStyles.inputWrap}>
                        <Key size={18} style={loginStyles.inputIcon} />
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            style={loginStyles.input}
                        />
                    </div>
                    {error && <div style={loginStyles.error}>{error}</div>}
                    <button type="submit" style={loginStyles.btn} disabled={loading}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                验证中...
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Lock size={16} />
                                登录后台
                            </span>
                        )}
                    </button>
                    <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        默认测试账号: admin@example.com / password
                    </div>
                </form>

                <a href="/" style={loginStyles.backLink}>
                    <ChevronLeft size={14} />
                    返回主站
                </a>
            </div>
        </div>
    )
}

const loginStyles = {
    container: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #020408 0%, #0a1420 100%)',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
    },
    bgGlow1: {
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(0, 210, 106, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'pulse 4s ease-in-out infinite',
    },
    bgGlow2: {
        position: 'absolute',
        bottom: '20%',
        right: '20%',
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'pulse 5s ease-in-out infinite reverse',
    },
    card: {
        position: 'relative',
        width: 420,
        padding: '48px 40px',
        background: 'rgba(10, 20, 32, 0.9)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    iconWrap: {
        width: 80,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 28px',
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        borderRadius: 24,
        color: '#000',
        boxShadow: '0 8px 32px rgba(0, 210, 106, 0.4)',
    },
    title: { margin: '0 0 8px', fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' },
    subtitle: { margin: '0 0 36px', fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    form: { display: 'flex', flexDirection: 'column', gap: 16 },
    inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIcon: { position: 'absolute', left: 18, color: 'rgba(255,255,255,0.3)' },
    input: {
        width: '100%',
        padding: '18px 18px 18px 52px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        fontSize: 15,
        color: '#fff',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    error: {
        padding: '12px 16px',
        background: 'rgba(255, 56, 96, 0.1)',
        border: '1px solid rgba(255, 56, 96, 0.3)',
        borderRadius: 10,
        fontSize: 13,
        color: '#ff3860',
        textAlign: 'left',
    },
    btn: {
        padding: '18px',
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        border: 'none',
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 700,
        color: '#000',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0, 210, 106, 0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    backLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 28,
        color: 'rgba(255,255,255,0.4)',
        textDecoration: 'none',
        fontSize: 13,
        transition: 'color 0.2s',
    },
}

// 管理后台主组件
function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [dashboardData, setDashboardData] = useState(null)

    // 检查登录状态
    useEffect(() => {
        const checkAuth = async () => {
            const user = await auth.getUser()
            if (user) {
                setIsAuthenticated(true)
            } else {
                const session = await auth.getSession()
                setIsAuthenticated(!!session)
            }
        }
        checkAuth()
    }, [])

    const [activeModule, setActiveModule] = useState('dashboard')
    const [searchQuery, setSearchQuery] = useState('')
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [notification, setNotification] = useState(null)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [stats, setStats] = useState({})
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({})
    const [editItem, setEditItem] = useState(null)


    const modules = [
        { id: 'dashboard', label: '仪表盘', labelSub: '数据概览', icon: LayoutDashboard, color: '#6366f1' },
        { id: 'briefs', label: '实况快讯', labelSub: '实时新闻', icon: Zap, table: TABLES.BRIEFS, color: '#00ff88' },
        { id: 'analysis', label: '分析文章', labelSub: '深度报告', icon: FileText, table: TABLES.ANALYSIS, color: '#00d4ff' },
        { id: 'news', label: '市场新闻', labelSub: '行业资讯', icon: Newspaper, table: TABLES.NEWS, color: '#fbbf24' },
        { id: 'lab', label: '研究课程', labelSub: '学习资料', icon: FlaskConical, table: TABLES.LAB_COURSES, color: '#a855f7' },
        { id: 'notes', label: '交易笔记', labelSub: '交易日志', icon: StickyNote, table: TABLES.TRADE_NOTES, color: '#f43f5e' },
    ]

    const currentModule = modules.find(m => m.id === activeModule) || modules[0]

    // 加载数据
    const loadData = async () => {
        setLoading(true)
        try {
            if (activeModule === 'dashboard') {
                // 加载仪表盘数据
                const statsPromises = Object.values(TABLES).map(async (table) => {
                    const data = await db.getAll(table)
                    return { table, count: data?.length || 0, published: data?.filter(d => d.is_published).length || 0 }
                })
                const results = await Promise.all(statsPromises)
                const newStats = {}
                results.forEach(r => {
                    const key = Object.keys(TABLES).find(k => TABLES[k] === r.table)?.toLowerCase()
                    if (key) newStats[key] = { total: r.count, published: r.published }
                })
                // Map keys to module ids
                const mappedStats = {
                    briefs: newStats.briefs,
                    analysis: newStats.analysis,
                    news: newStats.news,
                    lab: newStats.lab_courses, // Note: TABLES key is LAB_COURSES but module id is lab
                    notes: newStats.trade_notes
                }
                // Fix mapping manually
                mappedStats.lab = newStats.lab_courses
                mappedStats.notes = newStats.trade_notes

                setStats(mappedStats)
                setDashboardData(mappedStats)
            } else {
                const result = await db.getAll(currentModule.table, { orderBy: 'created_at' })
                setData(result || [])

                // 更新统计
                const published = (result || []).filter(d => d.is_published).length
                setStats(prev => ({
                    ...prev,
                    [activeModule]: { total: (result || []).length, published }
                }))
            }
        } catch (err) {
            showNotification('数据加载失败: ' + err.message, 'error')
        }
        setLoading(false)
    }

    useEffect(() => {
        if (isAuthenticated) {
            loadData()
            setSelectedItems([])
            setSearchQuery('')
        }
    }, [activeModule, isAuthenticated])

    // 通知
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3000)
    }

    // 过滤数据
    const filteredData = useMemo(() => {
        if (!searchQuery) return data
        const query = searchQuery.toLowerCase()
        return data.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(query)
            )
        )
    }, [data, searchQuery])

    // 删除
    const handleDelete = async (id) => {
        if (!confirm('确定要删除这条记录吗？')) return
        try {
            await db.delete(currentModule.table, id)
            showNotification('删除成功')
            loadData()
        } catch (err) {
            showNotification('删除失败: ' + err.message, 'error')
        }
    }

    // 批量删除
    const handleBulkDelete = async () => {
        if (!selectedItems.length) return
        if (!confirm(`确定要删除选中的 ${selectedItems.length} 条记录吗？`)) return
        try {
            await db.deleteMany(currentModule.table, selectedItems)
            showNotification(`成功删除 ${selectedItems.length} 条记录`)
            setSelectedItems([])
            loadData()
        } catch (err) {
            showNotification('删除失败: ' + err.message, 'error')
        }
    }

    // 切换发布状态
    const handleTogglePublish = async (item) => {
        try {
            await db.togglePublish(currentModule.table, item.id, item.is_published)
            showNotification(item.is_published ? '已设为私密' : '已公开发布')
            loadData()
        } catch (err) {
            showNotification('状态更新失败', 'error')
        }
    }

    // 保存
    const handleSave = async (formData) => {
        try {
            if (editItem) {
                await db.update(currentModule.table, editItem.id, formData)
                showNotification('修改成功')
            } else {
                await db.create(currentModule.table, formData)
                showNotification('创建成功')
            }
            setShowForm(false)
            setEditItem(null)
            loadData()
        } catch (err) {
            showNotification('保存失败: ' + err.message, 'error')
        }
    }

    // 退出登录
    const handleLogout = async () => {
        await auth.signOut()
        setIsAuthenticated(false)
    }

    // 未登录显示登录页
    if (!isAuthenticated) {
        return <LoginScreen onLogin={() => setIsAuthenticated(true)} />
    }

    return (
        <div style={styles.container}>
            {/* 侧边栏 */}
            <aside style={{ ...styles.sidebar, width: sidebarCollapsed ? 72 : 260 }}>
                <div style={styles.sidebarHeader}>
                    {!sidebarCollapsed && (
                        <div style={styles.logo}>
                            <div style={styles.logoIcon}>
                                <Crown size={20} />
                            </div>
                            <div style={styles.logoText}>
                                <span style={styles.logoTitle}>TRAN</span>
                                <span style={styles.logoSub}>管理中心</span>
                            </div>
                        </div>
                    )}
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={styles.collapseBtn}>
                        {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* 统计卡片 */}
                {!sidebarCollapsed && (
                    <div style={styles.sidebarStats}>
                        <div style={styles.statCard}>
                            <Database size={16} style={{ color: '#00d4ff' }} />
                            <div style={styles.statInfo}>
                                <span style={styles.statLabel}>全部内容</span>
                                <span style={styles.statValue}>{Object.values(stats).reduce((a, s) => a + (s?.total || 0), 0)}</span>
                            </div>
                        </div>
                    </div>
                )}

                <nav style={styles.nav}>
                    <div style={styles.navLabel}>{!sidebarCollapsed && '内容管理'}</div>
                    {modules.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setActiveModule(m.id)}
                            style={{
                                ...styles.navItem,
                                background: activeModule === m.id
                                    ? `linear-gradient(90deg, ${m.color}15 0%, transparent 100%)`
                                    : 'transparent',
                                borderLeft: `3px solid ${activeModule === m.id ? m.color : 'transparent'}`,
                            }}
                        >
                            <div style={{
                                ...styles.navIcon,
                                background: activeModule === m.id ? `${m.color}20` : 'rgba(255,255,255,0.02)',
                                color: activeModule === m.id ? m.color : 'rgba(255,255,255,0.4)',
                            }}>
                                <m.icon size={16} />
                            </div>
                            {!sidebarCollapsed && (
                                <div style={styles.navText}>
                                    <span style={{
                                        color: activeModule === m.id ? '#fff' : 'rgba(255,255,255,0.7)',
                                        fontWeight: activeModule === m.id ? 600 : 500,
                                    }}>
                                        {m.label}
                                    </span>
                                    {stats[m.id] && (
                                        <span style={styles.navBadge}>{stats[m.id].total}</span>
                                    )}
                                </div>
                            )}
                        </button>
                    ))}
                </nav>

                <div style={styles.sidebarFooter}>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <LogOut size={16} />
                        {!sidebarCollapsed && <span>退出登录</span>}
                    </button>
                    <a href="/" style={styles.backLink}>
                        <Globe size={16} />
                        {!sidebarCollapsed && <span>返回主站</span>}
                    </a>
                </div>
            </aside>

            {/* 主内容区 */}
            <main style={styles.main}>
                {/* 头部工具栏 */}
                <header style={styles.toolbar}>
                    <div style={styles.toolbarLeft}>
                        <div style={{
                            ...styles.moduleIcon,
                            background: `${currentModule?.color}20`,
                            color: currentModule?.color,
                        }}>
                            {currentModule && <currentModule.icon size={20} />}
                        </div>
                        <div style={styles.titleSection}>
                            <h1 style={styles.pageTitle}>{currentModule?.label}</h1>
                            <span style={styles.pageSubtitle}>{currentModule?.labelSub}</span>
                        </div>
                        <span style={{
                            ...styles.countBadge,
                            background: `${currentModule?.color}15`,
                            color: currentModule?.color,
                        }}>
                            {data.length} 条记录
                        </span>
                    </div>
                    <div style={styles.toolbarRight}>
                        <div style={styles.searchBox}>
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="搜索..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        <button onClick={loadData} style={styles.iconBtn} title="刷新">
                            <RefreshCw size={16} />
                        </button>
                        {selectedItems.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                style={{
                                    ...styles.iconBtn,
                                    background: 'rgba(255, 56, 96, 0.1)',
                                    borderColor: 'rgba(255, 56, 96, 0.2)',
                                    color: '#ff3860'
                                }}
                            >
                                <Trash2 size={16} />
                                <span style={{ fontSize: 12 }}>{selectedItems.length}</span>
                            </button>
                        )}
                        <button
                            onClick={() => { setEditItem(null); setShowForm(true) }}
                            style={styles.primaryBtn}
                        >
                            <Plus size={16} />
                            <span>新增</span>
                        </button>
                    </div>
                </header>



                {/* Dashboard View */}
                {activeModule === 'dashboard' ? (
                    <div style={{ padding: 32, overflow: 'auto' }}>
                        <div style={styles.dashboardGrid}>
                            {/* Overview Cards */}
                            {modules.slice(1).map(m => {
                                const stat = stats[m.id] || { total: 0, published: 0 }
                                return (
                                    <div key={m.id} style={{ ...styles.dashCard, borderTop: `4px solid ${m.color}` }}>
                                        <div style={{ ...styles.dashIcon, color: m.color, background: `${m.color}15` }}>
                                            <m.icon size={24} />
                                        </div>
                                        <div style={styles.dashContent}>
                                            <span style={styles.dashLabel}>{m.label}</span>
                                            <div style={styles.dashValue}>{stat.total}</div>
                                            <div style={styles.dashSub}>
                                                <span style={{ color: '#00ff88' }}>{stat.published}</span> 已发布
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div style={styles.chartsGrid}>
                            <div style={styles.chartCard}>
                                <h3 style={styles.chartTitle}>内容分布</h3>
                                <div style={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={modules.slice(1).map(m => ({ name: m.label, value: (stats[m.id]?.total || 0), color: m.color }))}
                                                cx="50%" cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {modules.slice(1).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ background: '#0d1117', border: '1px solid #333', borderRadius: 8 }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div style={styles.chartCard}>
                                <h3 style={styles.chartTitle}>发布状态统计</h3>
                                <div style={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={modules.slice(1).map(m => ({
                                                name: m.label,
                                                total: stats[m.id]?.total || 0,
                                                published: stats[m.id]?.published || 0,
                                                amt: 2400
                                            }))}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} />
                                            <YAxis stroke="#666" fontSize={12} tickLine={false} />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                contentStyle={{ background: '#0d1117', border: '1px solid #333', borderRadius: 8 }}
                                            />
                                            <Bar dataKey="total" name="总数" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="published" name="已发布" fill="#00ff88" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Data Table View */
                    <div style={styles.tableContainer}>
                        {loading ? (
                            <div style={styles.loading}>
                                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: currentModule?.color }} />
                                <span>加载中...</span>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div style={styles.empty}>
                                <div style={{
                                    ...styles.emptyIcon,
                                    background: `${currentModule?.color}15`,
                                    color: currentModule?.color,
                                }}>
                                    {currentModule && <currentModule.icon size={48} />}
                                </div>
                                <h3 style={styles.emptyTitle}>暂无数据</h3>
                                <p style={styles.emptyDesc}>创建第一条内容开始使用</p>
                                <button
                                    onClick={() => { setEditItem(null); setShowForm(true) }}
                                    style={{
                                        ...styles.emptyBtn,
                                        background: `${currentModule?.color}15`,
                                        borderColor: `${currentModule?.color}30`,
                                        color: currentModule?.color,
                                    }}
                                >
                                    <Plus size={16} />
                                    创建第一条
                                </button>
                            </div>
                        ) : (
                            <DataTable
                                module={activeModule}
                                data={filteredData}
                                selectedItems={selectedItems}
                                onSelect={setSelectedItems}
                                onEdit={(item) => { setEditItem(item); setShowForm(true) }}
                                onDelete={handleDelete}
                                onTogglePublish={handleTogglePublish}
                                moduleColor={currentModule?.color}
                            />
                        )}

                    </div>
                )}
            </main>

            {/* 表单弹窗 */}
            {
                showForm && (
                    <FormModal
                        module={activeModule}
                        item={editItem}
                        onSave={handleSave}
                        onClose={() => { setShowForm(false); setEditItem(null) }}
                        moduleColor={currentModule?.color}
                    />
                )
            }

            {/* 通知 */}
            {
                notification && (
                    <div style={{
                        ...styles.notification,
                        background: notification.type === 'error'
                            ? 'linear-gradient(135deg, rgba(255, 56, 96, 0.95), rgba(255, 100, 130, 0.95))'
                            : 'linear-gradient(135deg, rgba(0, 210, 106, 0.95), rgba(0, 255, 136, 0.95))'
                    }}>
                        {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                        <span>{notification.message}</span>
                    </div>
                )
            }
        </div >
    )
}

// 数据表格组件
function DataTable({ module, data, selectedItems, onSelect, onEdit, onDelete, onTogglePublish, moduleColor }) {
    const allSelected = data.length > 0 && selectedItems.length === data.length

    const toggleAll = () => {
        onSelect(allSelected ? [] : data.map(d => d.id))
    }

    const toggleOne = (id) => {
        onSelect(selectedItems.includes(id)
            ? selectedItems.filter(i => i !== id)
            : [...selectedItems, id]
        )
    }

    const columns = {
        briefs: ['title', 'importance', 'tags', 'is_published', 'created_at'],
        analysis: ['title', 'category', 'author', 'is_featured', 'is_published', 'created_at'],
        news: ['title', 'source', 'sentiment', 'is_breaking', 'is_published', 'created_at'],
        lab: ['title', 'level', 'lessons', 'order_index', 'is_published'],
        notes: ['pair', 'type', 'entry', 'exit', 'pnl', 'pnl_percent', 'grade', 'trade_date'],
    }

    const labels = {
        title: '标题', importance: '重要性', tags: '标签', is_published: '公开',
        created_at: '创建时间', category: '分类', author: '作者', is_featured: '推荐',
        source: '来源', sentiment: '市场情绪', is_breaking: '突发', level: '难度',
        lessons: '课时', order_index: '排序', pair: '交易对', type: '方向',
        entry: '入场价', exit: '出场价', pnl: '盈亏', pnl_percent: '收益率',
        grade: '评级', trade_date: '交易日期'
    }

    const formatValue = (key, value) => {
        if (value === null || value === undefined) return '-'
        if (key === 'is_published' || key === 'is_featured' || key === 'is_breaking') {
            return value
                ? <span style={{ color: '#00ff88' }}>●</span>
                : <span style={{ color: 'rgba(255,255,255,0.2)' }}>○</span>
        }
        if (key === 'created_at' || key === 'trade_date') {
            return new Date(value).toLocaleDateString('zh-CN')
        }
        if (key === 'tags' && Array.isArray(value)) {
            return value.slice(0, 2).join(', ') + (value.length > 2 ? '...' : '')
        }
        if (key === 'importance') {
            const map = { high: '紧急', medium: '重要', low: '普通' }
            const colors = { high: '#ff3860', medium: '#fbbf24', low: '#6b7280' }
            return <span style={{
                padding: '3px 8px',
                background: `${colors[value]}20`,
                borderRadius: 4,
                fontSize: 11,
                color: colors[value]
            }}>{map[value] || value}</span>
        }
        if (key === 'sentiment') {
            const map = { bullish: '看涨', bearish: '看跌', neutral: '中性' }
            const colors = { bullish: '#00ff88', bearish: '#ff3860', neutral: '#6b7280' }
            return <span style={{ color: colors[value] }}>{map[value] || value}</span>
        }
        if (key === 'level') {
            const map = { '초급': '初级', '중급': '中级', '고급': '高级' }
            const colors = { '初级': '#00ff88', '中级': '#fbbf24', '高级': '#ff3860' }
            const displayValue = map[value] || value
            return <span style={{ color: colors[displayValue] || '#fff' }}>{displayValue}</span>
        }
        if (key === 'pnl' || key === 'pnl_percent') {
            const color = parseFloat(value) >= 0 ? '#00ff88' : '#ff3860'
            const prefix = parseFloat(value) >= 0 ? '+' : ''
            return <span style={{ color, fontWeight: 600 }}>{prefix}{key === 'pnl_percent' ? `${value}%` : value}</span>
        }
        return String(value).substring(0, 40) + (String(value).length > 40 ? '...' : '')
    }

    const cols = columns[module] || columns.briefs

    return (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleAll}
                            style={styles.checkbox}
                        />
                    </th>
                    {cols.map(col => (
                        <th key={col} style={styles.th}>{labels[col] || col}</th>
                    ))}
                    <th style={styles.th}>操作</th>
                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <tr key={item.id} style={{
                        ...styles.tr,
                        background: selectedItems.includes(item.id) ? `${moduleColor}08` : 'transparent',
                    }}>
                        <td style={styles.td}>
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleOne(item.id)}
                                style={styles.checkbox}
                            />
                        </td>
                        {cols.map(col => (
                            <td key={col} style={styles.td}>{formatValue(col, item[col])}</td>
                        ))}
                        <td style={styles.td}>
                            <div style={styles.actions}>
                                <button onClick={() => onEdit(item)} style={styles.actionBtn} title="编辑">
                                    <Edit size={14} />
                                </button>
                                {item.is_published !== undefined && (
                                    <button
                                        onClick={() => onTogglePublish(item)}
                                        style={{
                                            ...styles.actionBtn,
                                            color: item.is_published ? '#00ff88' : 'rgba(255,255,255,0.4)',
                                        }}
                                        title={item.is_published ? '设为私密' : '公开发布'}
                                    >
                                        {item.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(item.id)}
                                    style={{ ...styles.actionBtn, color: '#ff3860' }}
                                    title="删除"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

// 表单弹窗组件
function FormModal({ module, item, onSave, onClose, moduleColor }) {
    // 默认模板
    const defaultTemplates = {
        briefs: {
            title: '',
            content: '',
            importance: 'medium',
            tags: '',
            is_published: true,
        },
        analysis: {
            title: '',
            summary: '',
            content: `## 市场概况

当前市场处于...

## 技术分析

### 关键价位
- **阻力位**: $XX,XXX
- **支撑位**: $XX,XXX

### 指标分析
- RSI: 
- MACD: 
- 成交量: 

## 链上数据

- 大户流入: 
- 交易所余额: 

## 总结与策略

### 短期 (1-7天)
...

### 中长期 (1-3个月)
...

---
*免责声明：本分析仅供参考，不构成投资建议。*`,
            category: '技术分析',
            author: 'TRAN Research',
            read_time: '5分钟',
            is_featured: false,
            is_published: true,
        },
        news: {
            title: '',
            summary: '',
            source: '',
            source_url: '',
            sentiment: 'neutral',
            category: 'BTC',
            is_breaking: false,
            is_published: true,
        },
        lab: {
            title: '',
            description: '',
            content: `# 课程简介

本课程将帮助你掌握...

## 学习目标

1. 理解...
2. 掌握...
3. 能够...

## 课程大纲

### 第1课：入门基础
- 核心概念
- 基本操作

### 第2课：进阶技巧
- 高级策略
- 实战案例

### 第3课：实战演练
- 模拟交易
- 复盘分析

## 适合人群

- 对加密货币交易感兴趣的新手
- 想要系统学习的交易者

## 课程亮点

✅ 理论与实践结合
✅ 真实案例分析
✅ 完整的交易系统`,
            level: '初级',
            lessons: 3,
            order_index: 1,
            is_published: true,
        },
        notes: {
            pair: 'BTC/USDT',
            type: 'Long',
            entry: null,
            exit: null,
            pnl: null,
            pnl_percent: null,
            trade_date: new Date().toISOString().split('T')[0],
            grade: 'B',
            notes: `## 交易计划

**入场理由**: 

**止损位置**: 

**止盈目标**: 

## 执行情况

**实际入场**: 

**实际出场**: 

## 复盘总结

**做得好的地方**: 

**需要改进的地方**: 

**下次注意**: `,
        },
    }

    const [formData, setFormData] = useState(item || defaultTemplates[module] || {})

    const fields = {
        briefs: [
            { key: 'title', label: '标题', type: 'text', required: true, placeholder: '输入快讯标题...' },
            { key: 'content', label: '内容', type: 'textarea', required: true, placeholder: '输入快讯内容...' },
            { key: 'importance', label: '重要性', type: 'select', options: [{ v: 'high', l: '🔴 紧急' }, { v: 'medium', l: '🟡 重要' }, { v: 'low', l: '🟢 普通' }] },
            { key: 'tags', label: '标签（逗号分隔）', type: 'text', placeholder: 'BTC, ETH, 市场动态' },
            { key: 'is_published', label: '公开发布', type: 'checkbox' },
        ],
        analysis: [
            { key: 'title', label: '标题', type: 'text', required: true, placeholder: '输入分析报告标题...' },
            { key: 'image_url', label: '封面图片', type: 'image' },
            { key: 'summary', label: '摘要', type: 'textarea', placeholder: '简短描述本文核心观点（2-3句话）' },
            { key: 'content', label: '正文', type: 'textarea', placeholder: '支持Markdown格式...' },
            { key: 'category', label: '分类', type: 'select', options: [{ v: '技术分析', l: '📊 技术分析' }, { v: '链上分析', l: '⛓️ 链上分析' }, { v: '市场分析', l: '📈 市场分析' }, { v: '宏观分析', l: '🌍 宏观分析' }] },
            { key: 'author', label: '作者', type: 'text', placeholder: 'TRAN Research' },
            { key: 'read_time', label: '阅读时长', type: 'text', placeholder: '5分钟' },
            { key: 'is_featured', label: '🌟 推荐到首页', type: 'checkbox' },
            { key: 'is_published', label: '公开发布', type: 'checkbox' },
        ],
        news: [
            { key: 'title', label: '标题', type: 'text', required: true, placeholder: '输入新闻标题...' },
            { key: 'image_url', label: '新闻配图', type: 'image' },
            { key: 'summary', label: '摘要', type: 'textarea', placeholder: '新闻要点概述...' },
            { key: 'source', label: '来源', type: 'text', placeholder: 'Bloomberg, Reuters, CoinDesk...' },
            { key: 'source_url', label: '原文链接', type: 'text', placeholder: 'https://...' },
            { key: 'sentiment', label: '市场情绪', type: 'select', options: [{ v: 'bullish', l: '🟢 看涨' }, { v: 'bearish', l: '🔴 看跌' }, { v: 'neutral', l: '⚪ 中性' }] },
            { key: 'category', label: '分类', type: 'text', placeholder: 'BTC, ETH, DeFi, NFT...' },
            { key: 'is_breaking', label: '⚡ 突发新闻', type: 'checkbox' },
            { key: 'is_published', label: '公开发布', type: 'checkbox' },
        ],
        lab: [
            { key: 'title', label: '标题', type: 'text', required: true, placeholder: '输入课程标题...' },
            { key: 'image_url', label: '课程封面', type: 'image' },
            { key: 'description', label: '描述', type: 'textarea', placeholder: '简短介绍课程内容...' },
            { key: 'level', label: '难度', type: 'select', options: [{ v: '初级', l: '🌱 初级' }, { v: '中级', l: '🌿 中级' }, { v: '高级', l: '🌲 高级' }] },
            { key: 'lessons', label: '课时数', type: 'number', placeholder: '3' },
            { key: 'order_index', label: '排序', type: 'number', placeholder: '1' },
            { key: 'content', label: '内容', type: 'textarea', placeholder: '支持Markdown格式...' },
            { key: 'is_published', label: '公开发布', type: 'checkbox' },
        ],
        notes: [
            { key: 'pair', label: '交易对', type: 'text', required: true, placeholder: 'BTC/USDT' },
            { key: 'type', label: '方向', type: 'select', options: [{ v: 'Long', l: '📈 做多' }, { v: 'Short', l: '📉 做空' }] },
            { key: 'entry', label: '入场价', type: 'number', placeholder: '50000' },
            { key: 'exit', label: '出场价', type: 'number', placeholder: '52000' },
            { key: 'pnl', label: '盈亏 (USDT)', type: 'number', placeholder: '200' },
            { key: 'pnl_percent', label: '收益率 (%)', type: 'number', placeholder: '4.0' },
            { key: 'trade_date', label: '交易日期', type: 'date' },
            { key: 'grade', label: '评级', type: 'select', options: [{ v: 'A', l: '⭐ A - 完美执行' }, { v: 'B', l: '✅ B - 良好' }, { v: 'C', l: '➖ C - 一般' }, { v: 'D', l: '⚠️ D - 待改进' }, { v: 'F', l: '❌ F - 失败' }] },
            { key: 'notes', label: '笔记', type: 'textarea', placeholder: '支持Markdown格式...' },
        ],
    }

    const currentFields = fields[module] || fields.briefs

    const handleChange = (key, value, type) => {
        let processedValue = value
        if (type === 'checkbox') {
            processedValue = value
        } else if (type === 'number') {
            processedValue = value === '' ? null : parseFloat(value)
        } else if (key === 'tags' && typeof value === 'string') {
            processedValue = value.split(',').map(t => t.trim()).filter(Boolean)
        }
        setFormData({ ...formData, [key]: processedValue })
    }

    // 图片上传状态
    const [uploadingImage, setUploadingImage] = useState(false)
    const [uploadError, setUploadError] = useState('')

    // 图片上传处理
    const handleImageUpload = async (key, file) => {
        if (!file) return

        setUploadingImage(true)
        setUploadError('')

        try {
            const url = await storage.uploadImage(file, module)
            setFormData({ ...formData, [key]: url })
        } catch (err) {
            setUploadError(err.message)
        } finally {
            setUploadingImage(false)
        }
    }

    // 移除图片
    const handleRemoveImage = (key) => {
        setFormData({ ...formData, [key]: null })
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        const submitData = { ...formData }
        if (typeof submitData.tags === 'string') {
            submitData.tags = submitData.tags.split(',').map(t => t.trim()).filter(Boolean)
        }
        onSave(submitData)
    }

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modal}>
                <div style={{
                    ...styles.modalHeader,
                    borderBottom: `1px solid ${moduleColor}30`,
                }}>
                    <div style={styles.modalTitle}>
                        <div style={{
                            ...styles.modalIcon,
                            background: `${moduleColor}20`,
                            color: moduleColor,
                        }}>
                            {item ? <Edit size={18} /> : <Plus size={18} />}
                        </div>
                        <span>{item ? '编辑' : '新增'}</span>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGrid}>
                        {currentFields.map(field => (
                            <div
                                key={field.key}
                                style={{
                                    ...styles.formGroup,
                                    gridColumn: field.type === 'textarea' ? '1 / -1' : 'auto',
                                }}
                            >
                                <label style={styles.label}>
                                    {field.label}
                                    {field.required && <span style={{ color: moduleColor, marginLeft: 4 }}>*</span>}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={field.key === 'tags' && Array.isArray(formData[field.key])
                                            ? formData[field.key].join(', ')
                                            : formData[field.key] || ''}
                                        onChange={e => handleChange(field.key, e.target.value, field.type)}
                                        style={styles.textarea}
                                        required={field.required}
                                        placeholder={field.placeholder || ''}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        value={formData[field.key] || ''}
                                        onChange={e => handleChange(field.key, e.target.value, field.type)}
                                        style={styles.select}
                                    >
                                        <option value="">请选择...</option>
                                        {field.options.map(opt => (
                                            <option key={opt.v} value={opt.v}>{opt.l}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'image' ? (
                                    <div style={styles.imageUploadArea}>
                                        {formData[field.key] ? (
                                            <div style={styles.imagePreviewContainer}>
                                                <img
                                                    src={formData[field.key]}
                                                    alt="预览"
                                                    style={styles.imagePreview}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(field.key)}
                                                    style={styles.imageRemoveBtn}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label style={styles.imageUploadLabel}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(field.key, e.target.files[0])}
                                                    style={{ display: 'none' }}
                                                    disabled={uploadingImage}
                                                />
                                                {uploadingImage ? (
                                                    <div style={styles.uploadingState}>
                                                        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                                                        <span>上传中...</span>
                                                    </div>
                                                ) : (
                                                    <div style={styles.uploadPrompt}>
                                                        <ImagePlus size={32} style={{ color: moduleColor }} />
                                                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>点击上传图片</span>
                                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>支持 JPG、PNG、GIF、WebP (最大5MB)</span>
                                                    </div>
                                                )}
                                            </label>
                                        )}
                                        {uploadError && (
                                            <div style={styles.uploadError}>
                                                <AlertCircle size={14} />
                                                <span>{uploadError}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : field.type === 'checkbox' ? (
                                    <label style={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={formData[field.key] || false}
                                            onChange={e => handleChange(field.key, e.target.checked, field.type)}
                                            style={styles.checkboxInput}
                                        />
                                        <span style={styles.checkboxCustom}></span>
                                        启用
                                    </label>
                                ) : (
                                    <input
                                        type={field.type}
                                        value={field.key === 'tags' && Array.isArray(formData[field.key])
                                            ? formData[field.key].join(', ')
                                            : formData[field.key] || ''}
                                        onChange={e => handleChange(field.key, e.target.value, field.type)}
                                        style={styles.input}
                                        required={field.required}
                                        placeholder={field.placeholder || ''}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div style={styles.formActions}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>取消</button>
                        <button
                            type="submit"
                            style={{
                                ...styles.saveBtn,
                                background: `linear-gradient(135deg, ${moduleColor} 0%, ${moduleColor}cc 100%)`,
                            }}
                        >
                            <Save size={16} />
                            <span>保存</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// 样式
const styles = {
    container: { display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #020408 0%, #0a1420 100%)', fontFamily: "'Inter', sans-serif" },
    sidebar: { display: 'flex', flexDirection: 'column', background: 'rgba(6, 12, 20, 0.98)', borderRight: '1px solid rgba(255,255,255,0.04)', transition: 'width 0.25s ease', backdropFilter: 'blur(20px)' },
    sidebarHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottom: '1px solid rgba(255,255,255,0.04)' },
    logo: { display: 'flex', alignItems: 'center', gap: 12 },
    logoIcon: { width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)', borderRadius: 12, color: '#000' },
    logoText: { display: 'flex', flexDirection: 'column' },
    logoTitle: { fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' },
    logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' },
    collapseBtn: { width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' },
    sidebarStats: { padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    statCard: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: 10 },
    statInfo: { display: 'flex', flexDirection: 'column' },
    statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
    statValue: { fontSize: 18, fontWeight: 700, color: '#fff' },
    nav: { flex: 1, padding: '16px 0' },
    navLabel: { padding: '8px 20px', fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' },
    navItem: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 20px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
    navIcon: { width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, transition: 'all 0.2s' },
    navText: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 },
    navBadge: { padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 10, color: 'rgba(255,255,255,0.5)' },
    sidebarFooter: { padding: 16, borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: 8 },
    logoutBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', background: 'rgba(255, 56, 96, 0.1)', border: '1px solid rgba(255, 56, 96, 0.2)', borderRadius: 10, color: '#ff3860', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' },
    backLink: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', background: 'rgba(6, 12, 20, 0.6)', borderBottom: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' },
    toolbarLeft: { display: 'flex', alignItems: 'center', gap: 16 },
    toolbarRight: { display: 'flex', alignItems: 'center', gap: 12 },
    moduleIcon: { width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
    titleSection: { display: 'flex', flexDirection: 'column' },
    pageTitle: { margin: 0, fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' },
    pageSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
    countBadge: { padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
    searchBox: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, color: 'rgba(255,255,255,0.4)' },
    searchInput: { width: 200, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#fff' },
    iconBtn: { width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.2s' },
    primaryBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#000', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0, 210, 106, 0.3)', transition: 'all 0.2s' },
    tableContainer: { flex: 1, overflow: 'auto', padding: 32 },
    loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 16, color: 'rgba(255,255,255,0.5)' },
    empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 16 },
    emptyIcon: { width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 24, marginBottom: 8 },
    emptyTitle: { margin: 0, fontSize: 20, fontWeight: 600, color: '#fff' },
    emptyDesc: { margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' },
    emptyBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', border: '1px solid', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 8 },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    th: { padding: '16px 18px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
    tr: { borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' },
    td: { padding: '16px 18px', color: 'rgba(255,255,255,0.8)' },
    checkbox: { width: 18, height: 18, accentColor: '#00ff88' },
    actions: { display: 'flex', gap: 8 },
    actionBtn: { width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' },
    modal: { width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'auto', background: 'linear-gradient(180deg, #0a1420 0%, #060c14 100%)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
    modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px' },
    modalTitle: { display: 'flex', alignItems: 'center', gap: 14, fontSize: 18, fontWeight: 600, color: '#fff' },
    modalIcon: { width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
    closeBtn: { width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' },
    form: { padding: '0 28px 28px' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    formGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
    label: { fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' },
    input: { width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 14, color: '#fff', outline: 'none', transition: 'border-color 0.2s' },
    textarea: { width: '100%', minHeight: 120, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 14, color: '#fff', outline: 'none', resize: 'vertical' },
    select: { width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 14, color: '#fff', outline: 'none' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
    checkboxInput: { width: 20, height: 20, accentColor: '#00ff88' },
    formActions: { display: 'flex', gap: 14, marginTop: 32 },
    cancelBtn: { flex: 1, padding: '14px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
    saveBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#000', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0, 210, 106, 0.3)' },
    notification: { position: 'fixed', bottom: 28, right: 28, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', borderRadius: 14, color: '#000', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 2000 },
    // 图片上传样式
    imageUploadArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
    },
    imagePreviewContainer: {
        position: 'relative',
        width: '100%',
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(0, 210, 106, 0.3)',
        boxShadow: '0 0 20px rgba(0, 210, 106, 0.1)'
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    imageRemoveBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 56, 96, 0.9)',
        border: 'none',
        borderRadius: 8,
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 10px rgba(255, 56, 96, 0.4)'
    },
    imageUploadLabel: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 180,
        background: 'rgba(255,255,255,0.02)',
        border: '2px dashed rgba(255,255,255,0.1)',
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    uploadPrompt: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8
    },
    uploadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        color: 'rgba(255,255,255,0.5)'
    },
    uploadError: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        background: 'rgba(255, 56, 96, 0.1)',
        border: '1px solid rgba(255, 56, 96, 0.3)',
        borderRadius: 8,
        fontSize: 12,
        color: '#ff3860'
    },
    uploadError: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        background: 'rgba(255, 56, 96, 0.1)',
        border: '1px solid rgba(255, 56, 96, 0.3)',
        borderRadius: 8,
        fontSize: 12,
        color: '#ff3860'
    },
    // Dashboard Styles
    dashboardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 24,
        marginBottom: 32,
    },
    dashCard: {
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
    },
    dashIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    dashLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: 600,
        marginBottom: 4,
    },
    dashValue: {
        fontSize: 28,
        fontWeight: 700,
        color: '#fff',
        lineHeight: 1.1,
    },
    dashSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
        marginTop: 4,
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 24,
    },
    chartCard: {
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: 24,
    },
    chartTitle: {
        margin: '0 0 24px 0',
        fontSize: 16,
        fontWeight: 600,
        color: '#fff',
    },
}

// CSS动画
const styleSheet = document.createElement('style')
styleSheet.textContent = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
@keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}
`
document.head.appendChild(styleSheet)

export default AdminPage
