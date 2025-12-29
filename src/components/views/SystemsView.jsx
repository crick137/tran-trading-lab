import React, { useState } from 'react'
import {
    Cpu, TrendingUp, Shield, Target, ArrowRight, ArrowLeft,
    Clock, BarChart3, Zap, BookOpen, ChevronRight, CheckCircle, ExternalLink
} from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'

/**
 * SystemsView - 交易系统专栏
 * 展示各种交易系统的研究和分析
 */
function SystemsView() {
    const { language } = useI18n()
    const [hoveredSystem, setHoveredSystem] = useState(null)
    const [selectedSystem, setSelectedSystem] = useState(null)

    // 多语言文本
    const texts = {
        zh: {
            title: '交易系统',
            subtitle: '系统化交易策略研究与实战分析',
            comingSoon: '即将推出更多交易系统...',
            learnMore: '了解详情',
            features: '特点',
            performance: '绩效',
            winRate: '胜率',
            riskReward: '盈亏比'
        },
        en: {
            title: 'Trading Systems',
            subtitle: 'Systematic trading strategy research and analysis',
            comingSoon: 'More trading systems coming soon...',
            learnMore: 'Learn More',
            features: 'Features',
            performance: 'Performance',
            winRate: 'Win Rate',
            riskReward: 'Risk/Reward'
        },
        ko: {
            title: '트레이딩 시스템',
            subtitle: '체계적인 트레이딩 전략 연구 및 분석',
            comingSoon: '더 많은 트레이딩 시스템이 곧 출시됩니다...',
            learnMore: '자세히 보기',
            features: '특징',
            performance: '성과',
            winRate: '승률',
            riskReward: '손익비'
        }
    }

    const t = texts[language] || texts.en

    // 交易系统列表
    const tradingSystems = [
        {
            id: 'orb-strategy',
            nameZh: 'ORB 开盘区间突破战法',
            nameEn: 'ORB - Opening Range Breakout',
            nameKo: 'ORB 시가 범위 돌파 전략',
            version: 'v3.0 Professional Edition',
            updateDate: '2025-12-01',
            difficulty: {
                zh: '中级到高级',
                en: 'Intermediate to Advanced',
                ko: '중급~고급'
            },
            descZh: '基于开盘后5/15/30/60分钟建立的价格区间，捕捉突破行情。包含多时间框架ORB、成交量过滤、趋势确认、FVG检测、动态止损止盈系统。适用于美股、期货、加密货币等各类市场。',
            descEn: 'Captures breakout moves from the opening range established in the first 5/15/30/60 minutes. Features multi-timeframe ORB, volume filter, trend confirmation, FVG detection, and dynamic TP/SL. Works on stocks, futures, crypto, and forex.',
            descKo: '시장 개장 후 5/15/30/60분 동안 형성된 가격 범위의 돌파를 포착합니다. 다중 시간프레임 ORB, 거래량 필터, 추세 확인, FVG 감지, 동적 TP/SL 시스템을 포함합니다. 주식, 선물, 암호화폐, 외환 등 다양한 시장에 적용 가능합니다.',
            icon: TrendingUp,
            color: '#00ff88',
            stats: { winRate: '45-55%', rr: '2:1 ~ 3:1', timeframe: '5m/15m' },
            // 核心价值主张
            coreValues: [
                {
                    titleZh: '精准性', titleEn: 'Precision', titleKo: '정밀성',
                    descZh: '5/15/30/60分钟多周期验证,减少假突破',
                    descEn: '5/15/30/60min multi-period verification, reduces false breakouts',
                    descKo: '5/15/30/60분 다중 주기 검증, 허위 돌파 감소'
                },
                {
                    titleZh: '系统性', titleEn: 'Systematic', titleKo: '체계성',
                    descZh: '从信号识别到仓位管理全流程覆盖',
                    descEn: 'Full coverage from signal identification to position management',
                    descKo: '신호 인식부터 포지션 관리까지 전 과정 커버'
                },
                {
                    titleZh: '适应性', titleEn: 'Adaptability', titleKo: '적응성',
                    descZh: '自动识别市场类型,动态调整参数',
                    descEn: 'Auto-detects market type, dynamically adjusts parameters',
                    descKo: '시장 유형 자동 인식, 파라미터 동적 조정'
                },
                {
                    titleZh: '可复制性', titleEn: 'Reproducibility', titleKo: '복제 가능성',
                    descZh: '规则明确,可完全量化回测',
                    descEn: 'Clear rules, fully quantifiable backtesting',
                    descKo: '명확한 규칙, 완전한 백테스팅 가능'
                }
            ],
            // 四大时间周期
            timeframes: [
                { name: 'ORB5', styleZh: '超短线', styleEn: 'Ultra-short', styleKo: '초단기', prosZh: '信号频繁,快速获利', prosEn: 'Frequent signals, quick profits', prosKo: '신호 빈번, 빠른 수익', consZh: '假突破多,需要盯盘', consEn: 'More false breakouts, requires monitoring', consKo: '허위 돌파 많음, 모니터링 필요' },
                { name: 'ORB15', styleZh: '日内交易', styleEn: 'Day trading', styleKo: '데이 트레이딩', prosZh: '最常用,平衡性好', prosEn: 'Most common, well-balanced', prosKo: '가장 일반적, 균형 잡힘', consZh: '需要验证,中等频率', consEn: 'Needs verification, medium frequency', consKo: '검증 필요, 중간 빈도', recommended: true },
                { name: 'ORB30', styleZh: '短线波段', styleEn: 'Short swing', styleKo: '단기 스윙', prosZh: '准确性高,趋势明显', prosEn: 'High accuracy, clear trends', prosKo: '정확도 높음, 추세 명확', consZh: '信号较少,等待时间长', consEn: 'Fewer signals, longer wait', consKo: '신호 적음, 대기 시간 길음' },
                { name: 'ORB60', styleZh: '中线趋势', styleEn: 'Medium trend', styleKo: '중기 추세', prosZh: '高胜率,适合新手', prosEn: 'High win rate, beginner-friendly', prosKo: '높은 승률, 초보자 적합', consZh: '信号稀少,需要耐心', consEn: 'Rare signals, patience required', consKo: '신호 드묾, 인내심 필요' }
            ],
            // Cycle追踪 - 4阶段
            cyclePhases: [
                {
                    numZh: '阶段1', numEn: 'Phase 1', numKo: '1단계',
                    titleZh: '初始突破 (Initial Breakout)', titleEn: 'Initial Breakout', titleKo: '초기 돌파 (Initial Breakout)',
                    descZh: '价格突破ORB High(做多)或ORB Low(做空),通常伴随成交量放大',
                    descEn: 'Price breaks ORB High (long) or ORB Low (short), usually with increased volume',
                    descKo: '가격이 ORB High(롱) 또는 ORB Low(숏)를 돌파, 보통 거래량 증가 동반',
                    color: '#22c55e'
                },
                {
                    numZh: '阶段2', numEn: 'Phase 2', numKo: '2단계',
                    titleZh: '回踩确认 (Retest)', titleEn: 'Retest', titleKo: '되돌림 확인 (Retest)',
                    descZh: '价格回踩ORB区间,测试支撑/阻力转换。健康的回踩不会完全跌破ORB边界',
                    descEn: 'Price retests ORB zone, tests support/resistance flip. Healthy retest stays within ORB boundary',
                    descKo: '가격이 ORB 구간으로 되돌림, 지지/저항 전환 테스트. 건강한 되돌림은 ORB 경계를 완전히 이탈하지 않음',
                    color: '#3b82f6'
                },
                {
                    numZh: '阶段3', numEn: 'Phase 3', numKo: '3단계',
                    titleZh: '再次突破 (Continuation)', titleEn: 'Continuation', titleKo: '재돌파 (Continuation)',
                    descZh: '价格再次沿原方向突破,确认趋势延续。这是最佳的加仓时机',
                    descEn: 'Price breaks again in original direction, confirms trend continuation. Best time to add positions',
                    descKo: '가격이 다시 원래 방향으로 돌파, 추세 지속 확인. 최적의 포지션 추가 시점',
                    color: '#a855f7'
                },
                {
                    numZh: '阶段4', numEn: 'Phase 4', numKo: '4단계',
                    titleZh: '循环或反转 (Repeat or Reverse)', titleEn: 'Repeat or Reverse', titleKo: '반복 또는 반전',
                    descZh: '重复阶段2-3(趋势延续)或出现反向突破(开启新Cycle)',
                    descEn: 'Repeat phases 2-3 (trend continues) or reverse breakout (new Cycle begins)',
                    descKo: '2-3단계 반복(추세 지속) 또는 반대 방향 돌파(새 사이클 시작)',
                    color: '#ef4444'
                }
            ],
            // 做多5大条件
            longConditions: [
                { zh: '价格突破: 收盘价 > ORB High + (ORB High × 突破缓冲%) [默认0.2%]', en: 'Price Breakout: Close > ORB High + (ORB High × Buffer%) [default 0.2%]', ko: '가격 돌파: 종가 > ORB High + (ORB High × 돌파 버퍼%) [기본 0.2%]' },
                { zh: '成交量确认: 当前成交量 > 20周期均量 × 1.5倍 [强劲: >2.0倍]', en: 'Volume Confirmation: Volume > 20-period MA × 1.5x [Strong: >2.0x]', ko: '거래량 확인: 현재 거래량 > 20주기 평균 × 1.5배 [강세: >2.0배]' },
                { zh: '趋势确认: 价格 > VWAP 且 价格 > EMA20 > EMA50', en: 'Trend Confirmation: Price > VWAP and Price > EMA20 > EMA50', ko: '추세 확인: 가격 > VWAP 및 가격 > EMA20 > EMA50' },
                { zh: 'FVG支撑: 存在看涨FVG在ORB Low附近 ±2.0倍FVG高度范围内', en: 'FVG Support: Bullish FVG exists near ORB Low within ±2.0x FVG height', ko: 'FVG 지지: ORB Low 근처 ±2.0배 FVG 높이 범위 내 상승 FVG 존재' },
                { zh: '时间窗口: 在ORB完成后的2小时内,避免临近收盘(最后30分钟)', en: 'Time Window: Within 2 hours after ORB completion, avoid last 30 minutes', ko: '시간 창: ORB 완성 후 2시간 이내, 마지막 30분 피하기' }
            ],
            // 做空5大条件
            shortConditions: [
                { zh: '价格突破: 收盘价 < ORB Low - (ORB Low × 突破缓冲%) [默认0.2%]', en: 'Price Breakout: Close < ORB Low - (ORB Low × Buffer%) [default 0.2%]', ko: '가격 돌파: 종가 < ORB Low - (ORB Low × 돌파 버퍼%) [기본 0.2%]' },
                { zh: '成交量确认: 当前成交量 > 20周期均量 × 1.5倍 [强劲: >2.0倍]', en: 'Volume Confirmation: Volume > 20-period MA × 1.5x [Strong: >2.0x]', ko: '거래량 확인: 현재 거래량 > 20주기 평균 × 1.5배 [강세: >2.0배]' },
                { zh: '趋势确认: 价格 < VWAP 且 价格 < EMA20 < EMA50', en: 'Trend Confirmation: Price < VWAP and Price < EMA20 < EMA50', ko: '추세 확인: 가격 < VWAP 및 가격 < EMA20 < EMA50' },
                { zh: 'FVG压力: 存在看跌FVG在ORB High附近 ±2.0倍FVG高度范围内', en: 'FVG Pressure: Bearish FVG exists near ORB High within ±2.0x FVG height', ko: 'FVG 저항: ORB High 근처 ±2.0배 FVG 높이 범위 내 하락 FVG 존재' },
                { zh: '时间窗口: 在ORB完成后的2小时内,避免临近收盘', en: 'Time Window: Within 2 hours after ORB completion, avoid market close', ko: '시간 창: ORB 완성 후 2시간 이내, 장 마감 피하기' }
            ],
            features: [
                { zh: '多时间框架ORB (5/15/30/60分钟)', en: 'Multi-timeframe ORB (5/15/30/60min)', ko: '다중 시간프레임 ORB (5/15/30/60분)' },
                { zh: '成交量确认过滤器', en: 'Volume confirmation filter', ko: '거래량 확인 필터' },
                { zh: '趋势方向过滤 (VWAP/EMA/SuperTrend)', en: 'Trend filter (VWAP/EMA/SuperTrend)', ko: '추세 필터 (VWAP/EMA/슈퍼트렌드)' },
                { zh: 'FVG (公允价值缺口) 检测', en: 'FVG (Fair Value Gap) detection', ko: 'FVG (공정 가치 갭) 감지' },
                { zh: '智能自适应止损', en: 'Smart adaptive stop-loss', ko: '스마트 적응형 손절' },
                { zh: '多目标止盈 (TP1/TP1.5/TP2/TP3)', en: 'Multi-target take profit (TP1/TP1.5/TP2/TP3)', ko: '다중 목표 익절 (TP1/TP1.5/TP2/TP3)' },
                { zh: '仓位管理计算器', en: 'Position sizing calculator', ko: '포지션 사이징 계산기' },
                { zh: '回测与再突破检测', en: 'Retest & re-breakout detection', ko: '재시도 및 재돌파 감지' }
            ],
            platform: 'TradingView',
            hasIndicator: true
        }
    ]

    const getName = (system) => language === 'zh' ? system.nameZh : language === 'ko' ? system.nameKo : system.nameEn
    const getDesc = (system) => language === 'zh' ? system.descZh : language === 'ko' ? system.descKo : system.descEn
    const getFeature = (feature) => language === 'zh' ? feature.zh : language === 'ko' ? feature.ko : feature.en

    // 如果选中了某个系统，显示详情视图
    if (selectedSystem) {
        const system = tradingSystems.find(s => s.id === selectedSystem)
        if (!system) return null

        const IconComponent = system.icon

        return (
            <div style={styles.container}>
                {/* Back Button */}
                <button
                    onClick={() => setSelectedSystem(null)}
                    style={styles.backBtn}
                >
                    <ArrowLeft size={20} />
                    <span>{language === 'zh' ? '返回列表' : language === 'ko' ? '목록으로 돌아가기' : 'Back to List'}</span>
                </button>

                {/* Detail Header */}
                <div style={styles.detailHeader}>
                    <div style={{
                        ...styles.detailIcon,
                        background: `linear-gradient(135deg, ${system.color}20 0%, ${system.color}08 100%)`,
                        border: `1px solid ${system.color}30`
                    }}>
                        <IconComponent size={48} style={{ color: system.color }} />
                    </div>
                    <div style={styles.detailInfo}>
                        {system.platform && (
                            <div style={styles.platformBadge}>
                                <Cpu size={12} />
                                <span>{system.platform}</span>
                            </div>
                        )}
                        <h1 style={styles.detailTitle}>{getName(system)}</h1>
                        <p style={styles.detailDesc}>{getDesc(system)}</p>

                        {/* Stats Row */}
                        <div style={styles.detailStats}>
                            <div style={styles.detailStatItem}>
                                <Target size={18} style={{ color: '#00ff88' }} />
                                <div>
                                    <div style={styles.statLabel}>{t.winRate}</div>
                                    <div style={styles.statValue}>{system.stats.winRate}</div>
                                </div>
                            </div>
                            <div style={styles.detailStatItem}>
                                <Shield size={18} style={{ color: '#00d4ff' }} />
                                <div>
                                    <div style={styles.statLabel}>{t.riskReward}</div>
                                    <div style={styles.statValue}>{system.stats.rr}</div>
                                </div>
                            </div>
                            <div style={styles.detailStatItem}>
                                <Clock size={18} style={{ color: '#fbbf24' }} />
                                <div>
                                    <div style={styles.statLabel}>{language === 'zh' ? '时间周期' : language === 'ko' ? '시간프레임' : 'Timeframe'}</div>
                                    <div style={styles.statValue}>{system.stats.timeframe}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Version Info Bar */}
                {system.version && (
                    <div style={styles.versionBar}>
                        <span>📦 {system.version}</span>
                        <span>📅 {system.updateDate}</span>
                        <span>📊 {language === 'zh' ? `难度: ${system.difficulty.zh}` : language === 'ko' ? `난이도: ${system.difficulty.ko}` : `Difficulty: ${system.difficulty.en}`}</span>
                    </div>
                )}

                {/* Core Values */}
                {system.coreValues && (
                    <section style={styles.detailSection}>
                        <h2 style={styles.sectionTitle}>
                            <Zap size={20} style={{ color: '#fbbf24' }} />
                            <span>{language === 'zh' ? '核心价值主张' : language === 'ko' ? '핵심 가치 제안' : 'Core Value Proposition'}</span>
                        </h2>
                        <div style={styles.coreValuesGrid}>
                            {system.coreValues.map((value, idx) => (
                                <div key={idx} style={styles.coreValueCard}>
                                    <div style={styles.coreValueTitle}>
                                        ✓ {language === 'zh' ? value.titleZh : language === 'ko' ? value.titleKo : value.titleEn}
                                    </div>
                                    <div style={styles.coreValueDesc}>
                                        {language === 'zh' ? value.descZh : language === 'ko' ? value.descKo : value.descEn}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Timeframes */}
                {system.timeframes && (
                    <section style={styles.detailSection}>
                        <h2 style={styles.sectionTitle}>
                            <Clock size={20} style={{ color: '#00d4ff' }} />
                            <span>{language === 'zh' ? '四大时间周期' : language === 'ko' ? '4대 시간 주기' : 'Four Timeframes'}</span>
                        </h2>
                        <div style={styles.timeframeTable}>
                            {system.timeframes.map((tf, idx) => (
                                <div key={idx} style={{
                                    ...styles.timeframeRow,
                                    background: tf.recommended ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255,255,255,0.02)',
                                    border: tf.recommended ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={styles.timeframeName}>
                                        {tf.name} {tf.recommended && '⭐'}
                                    </div>
                                    <div style={styles.timeframeStyle}>
                                        {language === 'zh' ? tf.styleZh : language === 'ko' ? tf.styleKo : tf.styleEn}
                                    </div>
                                    <div style={styles.timeframePros}>
                                        ✅ {language === 'zh' ? tf.prosZh : language === 'ko' ? tf.prosKo : tf.prosEn}
                                    </div>
                                    <div style={styles.timeframeCons}>
                                        ⚠️ {language === 'zh' ? tf.consZh : language === 'ko' ? tf.consKo : tf.consEn}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Cycle Phases */}
                {system.cyclePhases && (
                    <section style={styles.detailSection}>
                        <h2 style={styles.sectionTitle}>
                            <BarChart3 size={20} style={{ color: '#a855f7' }} />
                            <span>{language === 'zh' ? '周期理论 (Cycle Tracking)' : language === 'ko' ? '주기 이론 (Cycle Tracking)' : 'Cycle Tracking Theory'}</span>
                        </h2>
                        <div style={styles.cyclePhases}>
                            {system.cyclePhases.map((phase, idx) => (
                                <div key={idx} style={{
                                    ...styles.cyclePhase,
                                    borderLeft: `4px solid ${phase.color}`
                                }}>
                                    <div style={{ ...styles.cyclePhaseNum, background: phase.color }}>
                                        {language === 'zh' ? phase.numZh : language === 'ko' ? phase.numKo : phase.numEn}
                                    </div>
                                    <div style={styles.cyclePhaseContent}>
                                        <div style={styles.cyclePhaseTitle}>
                                            {language === 'zh' ? phase.titleZh : language === 'ko' ? phase.titleKo : phase.titleEn}
                                        </div>
                                        <div style={styles.cyclePhaseDesc}>
                                            {language === 'zh' ? phase.descZh : language === 'ko' ? phase.descKo : phase.descEn}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Long Conditions */}
                {system.longConditions && (
                    <section style={styles.detailSection}>
                        <h2 style={styles.sectionTitle}>
                            <TrendingUp size={20} style={{ color: '#22c55e' }} />
                            <span>{language === 'zh' ? '做多5大条件 (Long)' : language === 'ko' ? '롱 진입 5대 조건' : '5 Long Entry Conditions'}</span>
                        </h2>
                        <div style={styles.conditionsList}>
                            {system.longConditions.map((cond, idx) => (
                                <div key={idx} style={{ ...styles.conditionItem, background: 'rgba(34, 197, 94, 0.08)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
                                    <div style={{ ...styles.conditionNumber, background: '#22c55e' }}>{idx + 1}</div>
                                    <span>{language === 'zh' ? cond.zh : language === 'ko' ? cond.ko : cond.en}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Short Conditions */}
                {system.shortConditions && (
                    <section style={styles.detailSection}>
                        <h2 style={styles.sectionTitle}>
                            <ArrowRight size={20} style={{ color: '#ef4444', transform: 'rotate(90deg)' }} />
                            <span>{language === 'zh' ? '做空5大条件 (Short)' : language === 'ko' ? '숏 진입 5대 조건' : '5 Short Entry Conditions'}</span>
                        </h2>
                        <div style={styles.conditionsList}>
                            {system.shortConditions.map((cond, idx) => (
                                <div key={idx} style={{ ...styles.conditionItem, background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                    <div style={{ ...styles.conditionNumber, background: '#ef4444' }}>{idx + 1}</div>
                                    <span>{language === 'zh' ? cond.zh : language === 'ko' ? cond.ko : cond.en}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* All Features */}
                <section style={styles.detailSection}>
                    <h2 style={styles.sectionTitle}>
                        <CheckCircle size={20} style={{ color: '#00ff88' }} />
                        <span>{language === 'zh' ? '核心功能' : language === 'ko' ? '핵심 기능' : 'Core Features'}</span>
                    </h2>
                    <div style={styles.allFeatures}>
                        {system.features.map((feature, idx) => (
                            <div key={idx} style={styles.detailFeatureItem}>
                                <div style={styles.featureNumber}>{idx + 1}</div>
                                <span>{getFeature(feature)}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How to Use */}
                <section style={styles.detailSection}>
                    <h2 style={styles.sectionTitle}>
                        <BookOpen size={20} style={{ color: '#00d4ff' }} />
                        <span>{language === 'zh' ? '使用方法' : language === 'ko' ? '사용 방법' : 'How to Use'}</span>
                    </h2>
                    <div style={styles.howToUse}>
                        <div style={styles.stepItem}>
                            <div style={styles.stepNumber}>1</div>
                            <div style={styles.stepContent}>
                                <div style={styles.stepTitle}>
                                    {language === 'zh' ? '打开TradingView' : language === 'ko' ? 'TradingView 열기' : 'Open TradingView'}
                                </div>
                                <div style={styles.stepDesc}>
                                    {language === 'zh'
                                        ? '登录TradingView.com，打开任意股票/期货/加密货币图表'
                                        : language === 'ko'
                                            ? 'TradingView.com에 로그인하고 주식/선물/암호화폐 차트 열기'
                                            : 'Login to TradingView.com and open any stock/futures/crypto chart'}
                                </div>
                            </div>
                        </div>
                        <div style={styles.stepItem}>
                            <div style={styles.stepNumber}>2</div>
                            <div style={styles.stepContent}>
                                <div style={styles.stepTitle}>
                                    {language === 'zh' ? '添加指标' : language === 'ko' ? '지표 추가' : 'Add Indicator'}
                                </div>
                                <div style={styles.stepDesc}>
                                    {language === 'zh'
                                        ? '点击"指标"按钮，搜索"TranTradingLab ORB"添加到图表'
                                        : language === 'ko'
                                            ? '"지표" 버튼 클릭, "TranTradingLab ORB" 검색 후 차트에 추가'
                                            : 'Click "Indicators", search "TranTradingLab ORB" and add to chart'}
                                </div>
                            </div>
                        </div>
                        <div style={styles.stepItem}>
                            <div style={styles.stepNumber}>3</div>
                            <div style={styles.stepContent}>
                                <div style={styles.stepTitle}>
                                    {language === 'zh' ? '配置参数' : language === 'ko' ? '파라미터 설정' : 'Configure Settings'}
                                </div>
                                <div style={styles.stepDesc}>
                                    {language === 'zh'
                                        ? '根据需要调整ORB时间段(5/15/30/60分钟)、过滤器、止损止盈参数'
                                        : language === 'ko'
                                            ? '필요에 따라 ORB 기간(5/15/30/60분), 필터, TP/SL 파라미터 조정'
                                            : 'Adjust ORB periods (5/15/30/60min), filters, and TP/SL parameters as needed'}
                                </div>
                            </div>
                        </div>
                        <div style={styles.stepItem}>
                            <div style={styles.stepNumber}>4</div>
                            <div style={styles.stepContent}>
                                <div style={styles.stepTitle}>
                                    {language === 'zh' ? '等待信号' : language === 'ko' ? '신호 대기' : 'Wait for Signals'}
                                </div>
                                <div style={styles.stepDesc}>
                                    {language === 'zh'
                                        ? '开盘后等待ORB区间形成，出现突破信号后根据系统提示进行交易'
                                        : language === 'ko'
                                            ? '시장 개장 후 ORB 범위 형성 대기, 돌파 신호 발생 시 시스템 표시에 따라 거래'
                                            : 'Wait for ORB range to form after market open, trade when breakout signals appear'}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* External Link */}
                <a
                    href="https://www.tradingview.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.externalLink}
                >
                    <ExternalLink size={18} />
                    <span>{language === 'zh' ? '在TradingView中打开' : language === 'ko' ? 'TradingView에서 열기' : 'Open in TradingView'}</span>
                </a>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.badge}>
                        <Cpu size={16} />
                        <span>TranTradingLab</span>
                    </div>
                    <h1 style={styles.title}>{t.title}</h1>
                    <p style={styles.subtitle}>{t.subtitle}</p>
                </div>
            </header>


            {/* Systems Grid */}
            <section style={styles.systemsGrid}>
                {tradingSystems.map((system, index) => {
                    const IconComponent = system.icon
                    const isHovered = hoveredSystem === system.id

                    return (
                        <article
                            key={system.id}
                            style={{
                                ...styles.systemCard,
                                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                                boxShadow: isHovered
                                    ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${system.color}40`
                                    : '0 4px 20px rgba(0,0,0,0.3)',
                                borderColor: isHovered ? `${system.color}50` : 'rgba(255,255,255,0.06)'
                            }}
                            onMouseEnter={() => setHoveredSystem(system.id)}
                            onMouseLeave={() => setHoveredSystem(null)}
                        >
                            {/* Glow Effect */}
                            <div style={{
                                ...styles.cardGlow,
                                background: `radial-gradient(circle at 50% 0%, ${system.color}15 0%, transparent 70%)`,
                                opacity: isHovered ? 1 : 0
                            }} />

                            {/* Icon */}
                            <div style={{
                                ...styles.iconBox,
                                background: `linear-gradient(135deg, ${system.color}20 0%, ${system.color}08 100%)`,
                                border: `1px solid ${system.color}30`
                            }}>
                                <IconComponent size={32} style={{ color: system.color }} />
                            </div>

                            {/* Content */}
                            <div style={styles.cardContent}>
                                {/* Platform Badge */}
                                {system.platform && (
                                    <div style={styles.platformBadge}>
                                        <Cpu size={12} />
                                        <span>{system.platform}</span>
                                    </div>
                                )}

                                <h3 style={styles.systemName}>{getName(system)}</h3>
                                <p style={styles.systemDesc}>{getDesc(system)}</p>

                                {/* Features */}
                                {system.features && system.features.length > 0 && (
                                    <div style={styles.featuresSection}>
                                        <div style={styles.featuresTitle}>✨ {t.features}</div>
                                        <div style={styles.featuresList}>
                                            {system.features.slice(0, 4).map((feature, idx) => (
                                                <div key={idx} style={styles.featureItem}>
                                                    <span style={styles.featureDot}>•</span>
                                                    <span>{language === 'zh' ? feature.zh : language === 'ko' ? feature.ko : feature.en}</span>
                                                </div>
                                            ))}
                                            {system.features.length > 4 && (
                                                <div style={styles.featureMore}>
                                                    +{system.features.length - 4} more...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                <div style={styles.statsRow}>
                                    <div style={styles.statItem}>
                                        <Target size={14} style={{ color: '#00ff88' }} />
                                        <span>{t.winRate}: {system.stats.winRate}</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <Shield size={14} style={{ color: '#00d4ff' }} />
                                        <span>{t.riskReward}: {system.stats.rr}</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <Clock size={14} style={{ color: '#fbbf24' }} />
                                        <span>{system.stats.timeframe}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <button
                                onClick={() => setSelectedSystem(system.id)}
                                style={{
                                    ...styles.learnMoreBtn,
                                    background: isHovered
                                        ? `linear-gradient(135deg, ${system.color} 0%, ${system.color}cc 100%)`
                                        : 'rgba(255,255,255,0.05)',
                                    color: isHovered ? '#000' : system.color
                                }}>
                                <BookOpen size={16} />
                                <span>{t.learnMore}</span>
                                <ChevronRight size={16} />
                            </button>
                        </article>
                    )
                })}
            </section>

            {/* Coming Soon */}
            <div style={styles.comingSoon}>
                <Cpu size={20} style={{ color: '#64748b' }} />
                <span>{t.comingSoon}</span>
            </div>
        </div>
    )
}

const styles = {
    container: {
        padding: '32px',
        height: '100%',
        overflow: 'auto'
    },
    header: {
        marginBottom: 40
    },
    headerContent: {
        maxWidth: 600
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        borderRadius: 20,
        fontSize: '0.85rem',
        color: '#94a3b8',
        marginBottom: 20
    },
    title: {
        margin: 0,
        fontSize: '2.2rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        margin: '12px 0 0',
        fontSize: '1rem',
        color: '#64748b',
        lineHeight: 1.6
    },
    systemsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 24
    },
    systemCard: {
        position: 'relative',
        padding: 28,
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
    },
    cardGlow: {
        position: 'absolute',
        inset: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none'
    },
    iconBox: {
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        marginBottom: 20
    },
    cardContent: {
        position: 'relative',
        zIndex: 1
    },
    platformBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        marginBottom: 12,
        background: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 8,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#818cf8'
    },
    systemName: {
        margin: '0 0 12px',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#fff'
    },
    systemDesc: {
        margin: '0 0 20px',
        fontSize: '0.9rem',
        color: '#94a3b8',
        lineHeight: 1.7
    },
    featuresSection: {
        marginBottom: 20,
        padding: 16,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.05)'
    },
    featuresTitle: {
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#cbd5e1',
        marginBottom: 10
    },
    featuresList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
    },
    featureItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        fontSize: '0.8rem',
        color: '#94a3b8'
    },
    featureDot: {
        color: '#00ff88',
        fontWeight: 700
    },
    featureMore: {
        fontSize: '0.75rem',
        color: '#64748b',
        fontStyle: 'italic',
        marginTop: 4
    },
    statsRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.8rem',
        color: '#cbd5e1'
    },
    learnMoreBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        padding: '12px 20px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    comingSoon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 48,
        padding: 24,
        fontSize: '0.95rem',
        color: '#64748b'
    },
    // Detail view styles
    backBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        marginBottom: 24,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        color: '#94a3b8',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    detailHeader: {
        display: 'flex',
        gap: 24,
        marginBottom: 32,
        padding: 24,
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20
    },
    detailIcon: {
        width: 80,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        flexShrink: 0
    },
    detailInfo: {
        flex: 1
    },
    detailTitle: {
        margin: '12px 0',
        fontSize: '1.8rem',
        fontWeight: 800,
        color: '#fff'
    },
    detailDesc: {
        margin: '0 0 20px',
        fontSize: '1rem',
        color: '#94a3b8',
        lineHeight: 1.8
    },
    detailStats: {
        display: 'flex',
        gap: 32,
        marginTop: 16
    },
    detailStatItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
    },
    statLabel: {
        fontSize: '0.75rem',
        color: '#64748b',
        marginBottom: 2
    },
    statValue: {
        fontSize: '1rem',
        fontWeight: 700,
        color: '#fff'
    },
    detailSection: {
        marginBottom: 32,
        padding: 24,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '0 0 20px',
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#fff'
    },
    allFeatures: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12
    },
    detailFeatureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: 'rgba(0, 255, 136, 0.05)',
        border: '1px solid rgba(0, 255, 136, 0.1)',
        borderRadius: 10,
        fontSize: '0.9rem',
        color: '#cbd5e1'
    },
    featureNumber: {
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#00ff88',
        color: '#000',
        borderRadius: 6,
        fontSize: '0.75rem',
        fontWeight: 700,
        flexShrink: 0
    },
    howToUse: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },
    stepItem: {
        display: 'flex',
        gap: 16,
        padding: 16,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 12
    },
    stepNumber: {
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        color: '#fff',
        borderRadius: 8,
        fontSize: '0.9rem',
        fontWeight: 700,
        flexShrink: 0
    },
    stepContent: {
        flex: 1
    },
    stepTitle: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: 4
    },
    stepDesc: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        lineHeight: 1.6
    },
    externalLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
        border: 'none',
        borderRadius: 12,
        color: '#000',
        fontSize: '1rem',
        fontWeight: 600,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    // New documentation section styles
    versionBar: {
        display: 'flex',
        gap: 24,
        padding: '12px 20px',
        marginBottom: 24,
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: 12,
        color: '#a5b4fc',
        fontSize: '0.85rem'
    },
    coreValuesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16
    },
    coreValueCard: {
        padding: 16,
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.02) 100%)',
        border: '1px solid rgba(251, 191, 36, 0.2)',
        borderRadius: 12
    },
    coreValueTitle: {
        fontSize: '1rem',
        fontWeight: 700,
        color: '#fbbf24',
        marginBottom: 8
    },
    coreValueDesc: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        lineHeight: 1.6
    },
    timeframeTable: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
    },
    timeframeRow: {
        display: 'grid',
        gridTemplateColumns: '80px 100px 1fr 1fr',
        gap: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center'
    },
    timeframeName: {
        fontSize: '1rem',
        fontWeight: 700,
        color: '#00d4ff'
    },
    timeframeStyle: {
        fontSize: '0.85rem',
        color: '#cbd5e1'
    },
    timeframePros: {
        fontSize: '0.8rem',
        color: '#22c55e'
    },
    timeframeCons: {
        fontSize: '0.8rem',
        color: '#f59e0b'
    },
    cyclePhases: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },
    cyclePhase: {
        display: 'flex',
        gap: 16,
        padding: 16,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '0 12px 12px 0'
    },
    cyclePhaseNum: {
        padding: '6px 12px',
        borderRadius: 8,
        color: '#fff',
        fontSize: '0.8rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        height: 'fit-content'
    },
    cyclePhaseContent: {
        flex: 1
    },
    cyclePhaseTitle: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: 6
    },
    cyclePhaseDesc: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        lineHeight: 1.6
    },
    conditionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
    },
    conditionItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: 16,
        border: '1px solid',
        borderRadius: 12,
        fontSize: '0.9rem',
        color: '#cbd5e1',
        lineHeight: 1.6
    },
    conditionNumber: {
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        borderRadius: 8,
        fontSize: '0.85rem',
        fontWeight: 700,
        flexShrink: 0
    }
}

export default SystemsView
