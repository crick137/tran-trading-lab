import React, { useState, useEffect } from 'react'
import { Check, Zap, Crown, Star, Loader } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAppState } from '../../context/AppContext'
import { useI18n } from '../../hooks/useI18n'

/**
 * 会员定价页面
 */
function PricingView() {
    const { user } = useAppState()
    const { language } = useI18n()
    const [plans, setPlans] = useState([])
    const [currentPlan, setCurrentPlan] = useState('free')
    const [loading, setLoading] = useState(true)
    const [billingCycle, setBillingCycle] = useState('monthly')

    useEffect(() => {
        loadPlans()
        if (user) loadUserMembership()
    }, [user])

    const loadPlans = async () => {
        const { data } = await supabase
            .from('membership_plans')
            .select('*')
            .eq('is_active', true)
            .order('price_monthly', { ascending: true })

        setPlans(data || getDefaultPlans())
        setLoading(false)
    }

    const loadUserMembership = async () => {
        const { data } = await supabase
            .from('memberships')
            .select('plan_type')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single()

        if (data) setCurrentPlan(data.plan_type)
    }

    const getDefaultPlans = () => [
        {
            name: 'Free',
            name_ko: '무료',
            price_monthly: 0,
            price_yearly: 0,
            features: ['news', 'basic_articles', 'newsletter']
        },
        {
            name: 'Pro',
            name_ko: '프로',
            price_monthly: 9.99,
            price_yearly: 99,
            features: ['news', 'all_articles', 'tools', 'priority_alerts', 'monthly_report']
        },
        {
            name: 'Premium',
            name_ko: '프리미엄',
            price_monthly: 29.99,
            price_yearly: 299,
            features: ['news', 'all_articles', 'tools', 'courses', '1on1_consultation', 'private_group']
        }
    ]

    const featureLabels = {
        news: language === 'ko' ? '실시간 뉴스' : 'Real-time News',
        basic_articles: language === 'ko' ? '기본 분석 글' : 'Basic Articles',
        all_articles: language === 'ko' ? '모든 분석 글' : 'All Analysis',
        newsletter: language === 'ko' ? '주간 뉴스레터' : 'Weekly Newsletter',
        tools: language === 'ko' ? '프리미엄 도구' : 'Premium Tools',
        priority_alerts: language === 'ko' ? '우선 알림' : 'Priority Alerts',
        monthly_report: language === 'ko' ? '월간 리포트' : 'Monthly Report',
        courses: language === 'ko' ? '전체 코스 접근' : 'All Courses',
        '1on1_consultation': language === 'ko' ? '1:1 상담' : '1:1 Consultation',
        private_group: language === 'ko' ? '프라이빗 그룹' : 'Private Group'
    }

    const getPlanIcon = (name) => {
        if (name === 'Free' || name === '무료') return Zap
        if (name === 'Pro' || name === '프로') return Star
        return Crown
    }

    const getPlanColor = (name) => {
        if (name === 'Free' || name === '무료') return '#00ff88'
        if (name === 'Pro' || name === '프로') return '#fbbf24'
        return '#a855f7'
    }

    const handleSubscribe = async (plan) => {
        if (!user) {
            // 需要先登录
            alert(language === 'ko' ? '로그인이 필요합니다' : 'Please login first')
            return
        }

        // TODO: 接入 Stripe 支付
        alert(`Stripe payment coming soon for ${plan.name}`)
    }

    if (loading) {
        return (
            <div style={styles.loading}>
                <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>
                    <span style={styles.titleGradient}>
                        {language === 'ko' ? '멤버십 플랜' : 'Membership Plans'}
                    </span>
                </h1>
                <p style={styles.subtitle}>
                    {language === 'ko'
                        ? '더 깊은 시장 인사이트를 얻으세요'
                        : 'Get deeper market insights'
                    }
                </p>

                {/* Billing Toggle */}
                <div style={styles.billingToggle}>
                    <button
                        style={{
                            ...styles.toggleBtn,
                            background: billingCycle === 'monthly' ? '#00ff88' : 'transparent',
                            color: billingCycle === 'monthly' ? '#000' : '#fff'
                        }}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        {language === 'ko' ? '월간' : 'Monthly'}
                    </button>
                    <button
                        style={{
                            ...styles.toggleBtn,
                            background: billingCycle === 'yearly' ? '#00ff88' : 'transparent',
                            color: billingCycle === 'yearly' ? '#000' : '#fff'
                        }}
                        onClick={() => setBillingCycle('yearly')}
                    >
                        {language === 'ko' ? '연간 (17% 할인)' : 'Yearly (Save 17%)'}
                    </button>
                </div>
            </header>

            <div style={styles.plansGrid}>
                {plans.map((plan) => {
                    const Icon = getPlanIcon(plan.name)
                    const color = getPlanColor(plan.name)
                    const isCurrentPlan = currentPlan === plan.name.toLowerCase()
                    const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly
                    const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features

                    return (
                        <div
                            key={plan.name}
                            style={{
                                ...styles.planCard,
                                border: isCurrentPlan ? `2px solid ${color}` : '1px solid rgba(255,255,255,0.08)',
                                boxShadow: isCurrentPlan ? `0 0 30px ${color}20` : 'none'
                            }}
                        >
                            {isCurrentPlan && (
                                <div style={{ ...styles.currentBadge, background: color }}>
                                    {language === 'ko' ? '현재 플랜' : 'Current Plan'}
                                </div>
                            )}

                            <div style={{ ...styles.planIcon, background: `${color}15`, color }}>
                                <Icon size={28} />
                            </div>

                            <h3 style={styles.planName}>
                                {language === 'ko' ? plan.name_ko : plan.name}
                            </h3>

                            <div style={styles.priceRow}>
                                <span style={styles.currency}>$</span>
                                <span style={styles.price}>{price}</span>
                                <span style={styles.period}>
                                    /{billingCycle === 'monthly' ? (language === 'ko' ? '월' : 'mo') : (language === 'ko' ? '년' : 'yr')}
                                </span>
                            </div>

                            <ul style={styles.featureList}>
                                {features.map((f) => (
                                    <li key={f} style={styles.featureItem}>
                                        <Check size={16} style={{ color, flexShrink: 0 }} />
                                        <span>{featureLabels[f] || f}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                style={{
                                    ...styles.subscribeBtn,
                                    background: isCurrentPlan ? 'rgba(255,255,255,0.1)' : color,
                                    color: isCurrentPlan ? '#fff' : '#000',
                                    cursor: isCurrentPlan ? 'default' : 'pointer'
                                }}
                                onClick={() => !isCurrentPlan && handleSubscribe(plan)}
                                disabled={isCurrentPlan}
                            >
                                {isCurrentPlan
                                    ? (language === 'ko' ? '현재 사용 중' : 'Current Plan')
                                    : (language === 'ko' ? '구독하기' : 'Subscribe')
                                }
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const styles = {
    container: {
        padding: '32px 40px',
        maxWidth: 1200,
        margin: '0 auto',
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        color: '#fff'
    },
    header: {
        textAlign: 'center',
        marginBottom: 48,
    },
    title: {
        margin: 0,
        fontSize: 36,
        fontWeight: 800,
    },
    titleGradient: {
        background: 'linear-gradient(135deg, #fff 0%, #00ff88 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        marginTop: 12,
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
    },
    billingToggle: {
        display: 'inline-flex',
        gap: 4,
        padding: 4,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        marginTop: 24,
    },
    toggleBtn: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    plansGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24,
    },
    planCard: {
        position: 'relative',
        padding: 32,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.3s ease',
    },
    currentBadge: {
        position: 'absolute',
        top: -12,
        padding: '6px 16px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        color: '#000',
    },
    planIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    planName: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        color: '#fff',
    },
    priceRow: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 2,
        marginTop: 12,
    },
    currency: {
        fontSize: 18,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.6)',
    },
    price: {
        fontSize: 48,
        fontWeight: 800,
        color: '#fff',
    },
    period: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
    },
    featureList: {
        listStyle: 'none',
        padding: 0,
        margin: '24px 0',
        width: '100%',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    subscribeBtn: {
        width: '100%',
        padding: '14px 24px',
        border: 'none',
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 700,
        transition: 'all 0.2s',
        marginTop: 'auto',
    },
}

export default PricingView
