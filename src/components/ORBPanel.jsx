import React, { useState, memo } from 'react'
import {
    TrendingUp, TrendingDown, Target, Shield, Zap,
    BarChart2, Clock, RefreshCw, Settings, ChevronDown,
    AlertTriangle, CheckCircle, XCircle, Activity
} from 'lucide-react'

/**
 * ORB (Opening Range Breakout) 분석 패널
 * ORB 범위, 돌파 신호, 목표가 및 손절 표시
 */
const ORBPanel = memo(function ORBPanel({
    orbState,
    signals,
    targets,
    stats,
    config,
    currentData,
    onConfigChange,
    onReset,
    getStatusText,
    getRiskAssessment,
    hasBreakout,
    isLong,
    isShort,
}) {
    const [showSettings, setShowSettings] = useState(false)
    const [showSignals, setShowSignals] = useState(true)

    const formatPrice = (price) => {
        if (!price) return '-'
        return price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 10 ? 4 : 2
        })
    }

    const formatPercent = (pct) => {
        if (!pct) return '-'
        return pct.toFixed(2) + '%'
    }

    // 한국어 상태 텍스트
    const getKoreanStatus = () => {
        const status = getStatusText()
        const map = {
            '构建中...': '빌딩 중...',
            '等待开盘': '시작 대기',
            '上突破': '상향 돌파',
            '下突破': '하향 돌파',
            '范围内': '범위 내',
        }
        return map[status] || status
    }

    const riskAssessment = getRiskAssessment()

    return (
        <div style={styles.container}>
            {/* 헤더 */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerIcon}>
                        <Activity size={14} />
                    </div>
                    <span style={styles.headerTitle}>ORB 분석</span>
                    <span style={{
                        ...styles.statusBadge,
                        background: hasBreakout
                            ? (isLong ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 68, 102, 0.2)')
                            : 'rgba(255, 255, 255, 0.1)',
                        color: hasBreakout
                            ? (isLong ? '#00ff88' : '#ff4466')
                            : 'rgba(255,255,255,0.6)'
                    }}>
                        {getKoreanStatus()}
                    </span>
                </div>
                <div style={styles.headerRight}>
                    <button
                        style={styles.iconBtn}
                        onClick={() => setShowSettings(!showSettings)}
                        title="설정"
                    >
                        <Settings size={14} />
                    </button>
                    <button
                        style={styles.iconBtn}
                        onClick={onReset}
                        title="초기화"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* 설정 패널 */}
            {showSettings && (
                <div style={styles.settingsPanel}>
                    <div style={styles.settingRow}>
                        <span>ORB 시간 윈도우</span>
                        <select
                            style={styles.select}
                            value={config.orbMinutes}
                            onChange={(e) => onConfigChange({ orbMinutes: parseInt(e.target.value) })}
                        >
                            <option value={5}>5분</option>
                            <option value={15}>15분</option>
                            <option value={30}>30분</option>
                            <option value={60}>60분</option>
                        </select>
                    </div>
                    <div style={styles.settingRow}>
                        <span>돌파 버퍼 (%)</span>
                        <input
                            type="number"
                            style={styles.input}
                            value={config.breakoutBuffer}
                            onChange={(e) => onConfigChange({ breakoutBuffer: parseFloat(e.target.value) })}
                            min={0}
                            max={2}
                            step={0.1}
                        />
                    </div>
                    <div style={styles.settingRow}>
                        <span>ATR 배수</span>
                        <input
                            type="number"
                            style={styles.input}
                            value={config.atrMultiplier}
                            onChange={(e) => onConfigChange({ atrMultiplier: parseFloat(e.target.value) })}
                            min={0.5}
                            max={3}
                            step={0.1}
                        />
                    </div>
                </div>
            )}

            {/* ORB 범위 */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>
                    <BarChart2 size={12} />
                    <span>ORB 범위 ({config.orbMinutes}분)</span>
                </div>
                <div style={styles.rangeGrid}>
                    <div style={styles.rangeItem}>
                        <span style={styles.rangeLabel}>고점</span>
                        <span style={{ ...styles.rangeValue, color: '#00ff88' }}>
                            ${formatPrice(orbState.high)}
                        </span>
                    </div>
                    <div style={styles.rangeItem}>
                        <span style={styles.rangeLabel}>저점</span>
                        <span style={{ ...styles.rangeValue, color: '#ff4466' }}>
                            ${formatPrice(orbState.low)}
                        </span>
                    </div>
                    <div style={styles.rangeItem}>
                        <span style={styles.rangeLabel}>중점</span>
                        <span style={styles.rangeValue}>
                            ${formatPrice(orbState.mid)}
                        </span>
                    </div>
                    <div style={styles.rangeItem}>
                        <span style={styles.rangeLabel}>범위</span>
                        <span style={{ ...styles.rangeValue, color: '#00d4ff' }}>
                            {formatPercent(orbState.rangePct)}
                        </span>
                    </div>
                </div>
            </div>

            {/* 돌파 정보 */}
            {hasBreakout && (
                <div style={{
                    ...styles.section,
                    background: isLong ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 68, 102, 0.05)',
                    border: `1px solid ${isLong ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 68, 102, 0.2)'}`,
                    borderRadius: 8,
                }}>
                    <div style={styles.sectionTitle}>
                        {isLong ? <TrendingUp size={12} color="#00ff88" /> : <TrendingDown size={12} color="#ff4466" />}
                        <span style={{ color: isLong ? '#00ff88' : '#ff4466' }}>
                            {isLong ? '롱 신호' : '숏 신호'}
                        </span>
                    </div>
                    <div style={styles.breakoutInfo}>
                        <div style={styles.breakoutRow}>
                            <span>돌파 가격</span>
                            <span style={{ color: isLong ? '#00ff88' : '#ff4466', fontWeight: 700 }}>
                                ${formatPrice(orbState.breakoutPrice)}
                            </span>
                        </div>
                        <div style={styles.breakoutRow}>
                            <span>돌파 시간</span>
                            <span>{orbState.breakoutTime || '-'}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 목표가 & 손절 */}
            {hasBreakout && targets.entry && (
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <Target size={12} />
                        <span>거래 설정</span>
                        {riskAssessment && (
                            <span style={{
                                marginLeft: 'auto',
                                fontSize: 10,
                                color: riskAssessment.color
                            }}>
                                R/R: {targets.riskReward} {riskAssessment.text}
                            </span>
                        )}
                    </div>
                    <div style={styles.targetsGrid}>
                        <div style={styles.targetItem}>
                            <div style={{ ...styles.targetDot, background: '#00d4ff' }} />
                            <span style={styles.targetLabel}>진입</span>
                            <span style={styles.targetValue}>${formatPrice(targets.entry)}</span>
                        </div>
                        <div style={styles.targetItem}>
                            <div style={{ ...styles.targetDot, background: '#ff4466' }} />
                            <span style={styles.targetLabel}>손절</span>
                            <span style={{ ...styles.targetValue, color: '#ff4466' }}>
                                ${formatPrice(targets.sl)}
                            </span>
                        </div>
                        {config.showTP1 && (
                            <div style={styles.targetItem}>
                                <div style={{ ...styles.targetDot, background: '#00ff88' }} />
                                <span style={styles.targetLabel}>TP1 (1R)</span>
                                <span style={{ ...styles.targetValue, color: '#00ff88' }}>
                                    ${formatPrice(targets.tp1)}
                                </span>
                            </div>
                        )}
                        {config.showTP2 && (
                            <div style={styles.targetItem}>
                                <div style={{ ...styles.targetDot, background: '#00ff88' }} />
                                <span style={styles.targetLabel}>TP2 (2R)</span>
                                <span style={{ ...styles.targetValue, color: '#00ff88' }}>
                                    ${formatPrice(targets.tp2)}
                                </span>
                            </div>
                        )}
                        {config.showTP3 && (
                            <div style={styles.targetItem}>
                                <div style={{ ...styles.targetDot, background: '#00ff88' }} />
                                <span style={styles.targetLabel}>TP3 (3R)</span>
                                <span style={{ ...styles.targetValue, color: '#00ff88' }}>
                                    ${formatPrice(targets.tp3)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 신호 기록 */}
            <div style={styles.section}>
                <div
                    style={{ ...styles.sectionTitle, cursor: 'pointer' }}
                    onClick={() => setShowSignals(!showSignals)}
                >
                    <Zap size={12} />
                    <span>신호 기록</span>
                    <span style={styles.signalCount}>{signals.length}</span>
                    <ChevronDown
                        size={12}
                        style={{
                            marginLeft: 'auto',
                            transform: showSignals ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s ease'
                        }}
                    />
                </div>
                {showSignals && (
                    <div style={styles.signalsList}>
                        {signals.length === 0 ? (
                            <div style={styles.noSignals}>신호 없음</div>
                        ) : (
                            signals.map(signal => (
                                <div key={signal.id} style={styles.signalItem}>
                                    <div style={{
                                        ...styles.signalIcon,
                                        background: signal.direction === 'up'
                                            ? 'rgba(0, 255, 136, 0.2)'
                                            : 'rgba(255, 68, 102, 0.2)',
                                        color: signal.direction === 'up' ? '#00ff88' : '#ff4466'
                                    }}>
                                        {signal.type === 'breakout' && (signal.direction === 'up' ? '🔼' : '🔽')}
                                        {signal.type === 'retest' && '🔁'}
                                        {signal.type === 'failed' && '⚠️'}
                                        {signal.type === 'tp_hit' && '✅'}
                                        {signal.type === 'sl_hit' && '❌'}
                                    </div>
                                    <div style={styles.signalContent}>
                                        <div style={styles.signalTitle}>
                                            {signal.type === 'breakout' && (signal.direction === 'up' ? '상향 돌파' : '하향 돌파')}
                                            {signal.type === 'retest' && '재테스트'}
                                            {signal.type === 'failed' && '실패'}
                                            {signal.type === 'tp_hit' && 'TP 도달'}
                                            {signal.type === 'sl_hit' && 'SL 실행'}
                                        </div>
                                        <div style={styles.signalMeta}>
                                            ${formatPrice(signal.price)} · {signal.time}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* 통계 */}
            <div style={styles.statsBar}>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>상향 돌파</span>
                    <span style={{ ...styles.statValue, color: '#00ff88' }}>{orbState.cyclesUp}</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>하향 돌파</span>
                    <span style={{ ...styles.statValue, color: '#ff4466' }}>{orbState.cyclesDown}</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>재테스트</span>
                    <span style={styles.statValue}>{orbState.retests}</span>
                </div>
            </div>
        </div>
    )
})

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(4, 8, 16, 0.95)',
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    headerIcon: {
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 210, 106, 0.1)',
        borderRadius: 6,
        color: '#00d26a',
    },
    headerTitle: {
        fontSize: 13,
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    statusBadge: {
        padding: '3px 8px',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 600,
    },
    headerRight: {
        display: 'flex',
        gap: 4,
    },
    iconBtn: {
        padding: 6,
        background: 'rgba(255, 255, 255, 0.05)',
        border: 'none',
        borderRadius: 6,
        color: 'rgba(255, 255, 255, 0.5)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    settingsPanel: {
        padding: '10px 14px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    settingRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    select: {
        padding: '4px 8px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        color: '#fff',
        fontSize: 11,
    },
    input: {
        width: 60,
        padding: '4px 8px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        color: '#fff',
        fontSize: 11,
        textAlign: 'right',
    },
    section: {
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 10,
    },
    rangeGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
    },
    rangeItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 10px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 6,
    },
    rangeLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    rangeValue: {
        fontSize: 12,
        fontWeight: 700,
        color: '#fff',
        fontFamily: "'JetBrains Mono', monospace",
    },
    breakoutInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    breakoutRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    targetsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    targetItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 6,
    },
    targetDot: {
        width: 6,
        height: 6,
        borderRadius: '50%',
    },
    targetLabel: {
        flex: 1,
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    targetValue: {
        fontSize: 12,
        fontWeight: 700,
        color: '#fff',
        fontFamily: "'JetBrains Mono', monospace",
    },
    signalCount: {
        padding: '2px 6px',
        background: 'rgba(0, 210, 106, 0.1)',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 600,
        color: '#00d26a',
    },
    signalsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        maxHeight: 150,
        overflow: 'auto',
    },
    noSignals: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.3)',
        textAlign: 'center',
        padding: 12,
    },
    signalItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 6,
    },
    signalIcon: {
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        fontSize: 12,
    },
    signalContent: {
        flex: 1,
    },
    signalTitle: {
        fontSize: 11,
        fontWeight: 600,
        color: '#fff',
    },
    signalMeta: {
        fontSize: 9,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    statsBar: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 14px',
        background: 'rgba(0, 0, 0, 0.2)',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
    },
    statLabel: {
        fontSize: 9,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 700,
        color: '#fff',
        fontFamily: "'JetBrains Mono', monospace",
    },
}

export default ORBPanel
