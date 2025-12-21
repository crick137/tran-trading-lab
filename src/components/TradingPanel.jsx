import React, { useState, memo, useCallback } from 'react'
import {
    TrendingUp, TrendingDown, Target, Shield, Zap, X,
    Percent, DollarSign, AlertCircle, CheckCircle, Clock,
    ChevronDown, Settings, ArrowUpRight, ArrowDownRight
} from 'lucide-react'

/**
 * 프로페셔널 트레이딩 패널 컴포넌트
 * 시장가/지정가 주문, 손절/익절, 레버리지 선택 지원
 */
const TradingPanel = memo(function TradingPanel({
    symbol,
    currentPrice,
    onClose,
    onTrade,
    balance = 100000,
}) {
    // 주문 유형
    const [orderType, setOrderType] = useState('market') // 'market' | 'limit'

    // 거래 방향
    const [side, setSide] = useState('long') // 'long' | 'short'

    // 거래 파라미터
    const [amount, setAmount] = useState('')
    const [limitPrice, setLimitPrice] = useState(currentPrice?.toString() || '')
    const [leverage, setLeverage] = useState(10)

    // 리스크 관리 파라미터
    const [useStopLoss, setUseStopLoss] = useState(false)
    const [useTakeProfit, setUseTakeProfit] = useState(false)
    const [stopLossPercent, setStopLossPercent] = useState(2)
    const [takeProfitPercent, setTakeProfitPercent] = useState(4)

    // 확인 팝업
    const [showConfirm, setShowConfirm] = useState(false)

    // 계산
    const price = orderType === 'market' ? currentPrice : parseFloat(limitPrice) || currentPrice
    const size = parseFloat(amount) || 0
    const notionalValue = size * price
    const margin = notionalValue / leverage
    const marginPercent = balance > 0 ? (margin / balance * 100).toFixed(1) : 0

    // 손절/익절 가격
    const stopLossPrice = side === 'long'
        ? price * (1 - stopLossPercent / 100)
        : price * (1 + stopLossPercent / 100)
    const takeProfitPrice = side === 'long'
        ? price * (1 + takeProfitPercent / 100)
        : price * (1 - takeProfitPercent / 100)

    // 예상 손익
    const potentialLoss = useStopLoss ? margin * (stopLossPercent / 100) * leverage : margin
    const potentialProfit = useTakeProfit ? margin * (takeProfitPercent / 100) * leverage : margin * 2
    const riskReward = potentialProfit / potentialLoss

    // 빠른 금액 버튼
    const quickAmounts = [
        { label: '25%', value: balance * 0.25 / price * leverage * 0.95 },
        { label: '50%', value: balance * 0.5 / price * leverage * 0.95 },
        { label: '75%', value: balance * 0.75 / price * leverage * 0.95 },
        { label: 'MAX', value: balance * 0.95 / price * leverage * 0.95 },
    ]

    // 레버리지 옵션
    const leverageOptions = [1, 2, 3, 5, 10, 20, 50, 100, 125]

    // 주문 제출
    const handleSubmit = useCallback(() => {
        if (size <= 0) return
        if (margin > balance) {
            alert('잔고 부족!')
            return
        }
        setShowConfirm(true)
    }, [size, margin, balance])

    // 주문 확인
    const confirmOrder = useCallback(() => {
        const order = {
            symbol,
            side,
            size,
            price,
            orderType,
            leverage,
            stopLoss: useStopLoss ? stopLossPrice : null,
            takeProfit: useTakeProfit ? takeProfitPrice : null,
            limitPrice: orderType === 'limit' ? parseFloat(limitPrice) : null,
        }
        onTrade(order)
        setShowConfirm(false)
        onClose?.()
    }, [symbol, side, size, price, orderType, leverage, useStopLoss, useTakeProfit, stopLossPrice, takeProfitPrice, limitPrice, onTrade, onClose])

    return (
        <div style={styles.container}>
            {/* 헤더 */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <span style={styles.headerTitle}>{symbol} 거래</span>
                    <span style={styles.currentPrice}>
                        ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <button style={styles.closeBtn} onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            {/* 주문 유형 탭 */}
            <div style={styles.orderTypeTabs}>
                <button
                    style={{
                        ...styles.orderTypeBtn,
                        ...(orderType === 'market' ? styles.orderTypeBtnActive : {})
                    }}
                    onClick={() => setOrderType('market')}
                >
                    <Zap size={12} />
                    시장가
                </button>
                <button
                    style={{
                        ...styles.orderTypeBtn,
                        ...(orderType === 'limit' ? styles.orderTypeBtnActive : {})
                    }}
                    onClick={() => setOrderType('limit')}
                >
                    <Clock size={12} />
                    지정가
                </button>
            </div>

            {/* 방향 선택 */}
            <div style={styles.sideSelector}>
                <button
                    style={{
                        ...styles.sideBtn,
                        ...(side === 'long' ? styles.sideBtnLong : styles.sideBtnInactive)
                    }}
                    onClick={() => setSide('long')}
                >
                    <TrendingUp size={16} />
                    <span>매수 / 롱</span>
                </button>
                <button
                    style={{
                        ...styles.sideBtn,
                        ...(side === 'short' ? styles.sideBtnShort : styles.sideBtnInactive)
                    }}
                    onClick={() => setSide('short')}
                >
                    <TrendingDown size={16} />
                    <span>매도 / 숏</span>
                </button>
            </div>

            {/* 지정가 입력 */}
            {orderType === 'limit' && (
                <div style={styles.inputGroup}>
                    <label style={styles.label}>지정가</label>
                    <div style={styles.inputWrapper}>
                        <DollarSign size={14} style={styles.inputIcon} />
                        <input
                            type="number"
                            style={styles.input}
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                            placeholder={currentPrice?.toString()}
                        />
                    </div>
                </div>
            )}

            {/* 수량 입력 */}
            <div style={styles.inputGroup}>
                <div style={styles.labelRow}>
                    <label style={styles.label}>수량</label>
                    <span style={styles.balanceHint}>사용 가능: ${balance.toLocaleString()}</span>
                </div>
                <div style={styles.inputWrapper}>
                    <input
                        type="number"
                        style={styles.input}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                    />
                    <span style={styles.inputSuffix}>{symbol.split('/')[0]}</span>
                </div>
                <div style={styles.quickBtns}>
                    {quickAmounts.map(q => (
                        <button
                            key={q.label}
                            style={styles.quickBtn}
                            onClick={() => setAmount(q.value.toFixed(4))}
                        >
                            {q.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 레버리지 선택 */}
            <div style={styles.inputGroup}>
                <div style={styles.labelRow}>
                    <label style={styles.label}>레버리지</label>
                    <span style={styles.leverageValue}>{leverage}x</span>
                </div>
                <div style={styles.leverageSlider}>
                    <input
                        type="range"
                        min="1"
                        max="125"
                        value={leverage}
                        onChange={(e) => setLeverage(parseInt(e.target.value))}
                        style={styles.slider}
                    />
                    <div style={styles.leverageMarks}>
                        {leverageOptions.map(l => (
                            <button
                                key={l}
                                style={{
                                    ...styles.leverageMark,
                                    ...(leverage === l ? styles.leverageMarkActive : {})
                                }}
                                onClick={() => setLeverage(l)}
                            >
                                {l}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 손절/익절 */}
            <div style={styles.riskSection}>
                <div style={styles.riskRow}>
                    <button
                        style={styles.riskToggle}
                        onClick={() => setUseStopLoss(!useStopLoss)}
                    >
                        <div style={{
                            ...styles.checkbox,
                            ...(useStopLoss ? styles.checkboxActive : {})
                        }}>
                            {useStopLoss && <CheckCircle size={12} />}
                        </div>
                        <Shield size={14} color="#ff4466" />
                        <span>손절</span>
                    </button>
                    {useStopLoss && (
                        <div style={styles.riskInputs}>
                            <input
                                type="number"
                                style={styles.riskInput}
                                value={stopLossPercent}
                                onChange={(e) => setStopLossPercent(parseFloat(e.target.value) || 0)}
                            />
                            <span style={styles.riskPercent}>%</span>
                            <span style={styles.riskPrice}>≈ ${stopLossPrice.toFixed(2)}</span>
                        </div>
                    )}
                </div>
                <div style={styles.riskRow}>
                    <button
                        style={styles.riskToggle}
                        onClick={() => setUseTakeProfit(!useTakeProfit)}
                    >
                        <div style={{
                            ...styles.checkbox,
                            ...(useTakeProfit ? styles.checkboxActiveGreen : {})
                        }}>
                            {useTakeProfit && <CheckCircle size={12} />}
                        </div>
                        <Target size={14} color="#00ff88" />
                        <span>익절</span>
                    </button>
                    {useTakeProfit && (
                        <div style={styles.riskInputs}>
                            <input
                                type="number"
                                style={styles.riskInput}
                                value={takeProfitPercent}
                                onChange={(e) => setTakeProfitPercent(parseFloat(e.target.value) || 0)}
                            />
                            <span style={styles.riskPercent}>%</span>
                            <span style={{ ...styles.riskPrice, color: '#00ff88' }}>≈ ${takeProfitPrice.toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 주문 요약 */}
            <div style={styles.orderSummary}>
                <div style={styles.summaryRow}>
                    <span>증거금</span>
                    <span>${margin.toFixed(2)} ({marginPercent}%)</span>
                </div>
                <div style={styles.summaryRow}>
                    <span>명목 가치</span>
                    <span>${notionalValue.toFixed(2)}</span>
                </div>
                {(useStopLoss || useTakeProfit) && (
                    <div style={styles.summaryRow}>
                        <span>손익비</span>
                        <span style={{
                            color: riskReward >= 2 ? '#00ff88' : riskReward >= 1 ? '#fbbf24' : '#ff4466'
                        }}>
                            1:{riskReward.toFixed(2)}
                        </span>
                    </div>
                )}
            </div>

            {/* 주문 버튼 */}
            <button
                style={{
                    ...styles.submitBtn,
                    ...(side === 'long' ? styles.submitBtnLong : styles.submitBtnShort),
                    ...(size <= 0 || margin > balance ? styles.submitBtnDisabled : {})
                }}
                onClick={handleSubmit}
                disabled={size <= 0 || margin > balance}
            >
                {side === 'long' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                {orderType === 'limit' ? '지정가 주문 생성' : `${symbol} ${side === 'long' ? '매수' : '매도'}`}
            </button>

            {/* 확인 팝업 */}
            {showConfirm && (
                <div style={styles.confirmOverlay}>
                    <div style={styles.confirmModal}>
                        <div style={styles.confirmHeader}>
                            <AlertCircle size={24} color={side === 'long' ? '#00ff88' : '#ff4466'} />
                            <span>{orderType === 'limit' ? '지정가' : '시장가'} 주문 확인</span>
                        </div>
                        <div style={styles.confirmBody}>
                            <div style={styles.confirmRow}>
                                <span>거래쌍</span>
                                <strong>{symbol}</strong>
                            </div>
                            <div style={styles.confirmRow}>
                                <span>방향</span>
                                <strong style={{ color: side === 'long' ? '#00ff88' : '#ff4466' }}>
                                    {side === 'long' ? '롱 LONG' : '숏 SHORT'}
                                </strong>
                            </div>
                            <div style={styles.confirmRow}>
                                <span>수량</span>
                                <strong>{size}</strong>
                            </div>
                            <div style={styles.confirmRow}>
                                <span>{orderType === 'limit' ? '지정가' : '시장가'}</span>
                                <strong>${price.toFixed(2)}</strong>
                            </div>
                            <div style={styles.confirmRow}>
                                <span>레버리지</span>
                                <strong>{leverage}x</strong>
                            </div>
                            <div style={styles.confirmRow}>
                                <span>증거금</span>
                                <strong>${margin.toFixed(2)}</strong>
                            </div>
                            {useStopLoss && (
                                <div style={styles.confirmRow}>
                                    <span>손절</span>
                                    <strong style={{ color: '#ff4466' }}>${stopLossPrice.toFixed(2)}</strong>
                                </div>
                            )}
                            {useTakeProfit && (
                                <div style={styles.confirmRow}>
                                    <span>익절</span>
                                    <strong style={{ color: '#00ff88' }}>${takeProfitPrice.toFixed(2)}</strong>
                                </div>
                            )}
                        </div>
                        <div style={styles.confirmActions}>
                            <button style={styles.cancelBtn} onClick={() => setShowConfirm(false)}>
                                취소
                            </button>
                            <button
                                style={{
                                    ...styles.confirmBtn,
                                    background: side === 'long'
                                        ? 'linear-gradient(135deg, #00d26a, #00ff88)'
                                        : 'linear-gradient(135deg, #ff4466, #ff6b35)'
                                }}
                                onClick={confirmOrder}
                            >
                                주문 확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
})

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(8, 12, 20, 0.98) 0%, rgba(2, 4, 8, 0.98) 100%)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 16, fontWeight: 700, color: '#fff' },
    currentPrice: { fontSize: 14, fontWeight: 600, color: '#00ff88' },
    closeBtn: {
        padding: 6,
        background: 'rgba(255,255,255,0.05)',
        border: 'none',
        borderRadius: 6,
        color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer'
    },
    orderTypeTabs: {
        display: 'flex',
        gap: 8,
        padding: '12px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    },
    orderTypeBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    orderTypeBtnActive: {
        background: 'rgba(0, 210, 106, 0.1)',
        borderColor: 'rgba(0, 210, 106, 0.3)',
        color: '#00ff88',
    },
    sideSelector: {
        display: 'flex',
        gap: 8,
        padding: '0 20px 16px',
    },
    sideBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '14px 16px',
        border: 'none',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    sideBtnLong: {
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        color: '#000',
        boxShadow: '0 4px 20px rgba(0, 210, 106, 0.3)',
    },
    sideBtnShort: {
        background: 'linear-gradient(135deg, #ff4466 0%, #ff6b35 100%)',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(255, 68, 102, 0.3)',
    },
    sideBtnInactive: {
        background: 'rgba(255,255,255,0.05)',
        color: 'rgba(255,255,255,0.4)',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '0 20px 16px',
    },
    labelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    balanceHint: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        overflow: 'hidden',
    },
    inputIcon: {
        marginLeft: 12,
        color: 'rgba(255,255,255,0.3)',
    },
    input: {
        flex: 1,
        padding: '12px',
        background: 'transparent',
        border: 'none',
        color: '#fff',
        fontSize: 16,
        fontWeight: 600,
        outline: 'none',
    },
    inputSuffix: {
        padding: '0 12px',
        fontSize: 12,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.4)',
    },
    quickBtns: {
        display: 'flex',
        gap: 6,
    },
    quickBtn: {
        flex: 1,
        padding: '6px 8px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6,
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    leverageValue: {
        fontSize: 14,
        fontWeight: 700,
        color: '#00d4ff',
    },
    leverageSlider: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    slider: {
        width: '100%',
        height: 4,
        appearance: 'none',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        outline: 'none',
    },
    leverageMarks: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 4,
    },
    leverageMark: {
        padding: '4px 8px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 4,
        color: 'rgba(255,255,255,0.4)',
        fontSize: 9,
        fontWeight: 600,
        cursor: 'pointer',
    },
    leverageMarkActive: {
        background: 'rgba(0, 212, 255, 0.15)',
        borderColor: 'rgba(0, 212, 255, 0.4)',
        color: '#00d4ff',
    },
    riskSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '16px 20px',
        background: 'rgba(0,0,0,0.2)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
    },
    riskRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    riskToggle: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: 0,
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
    },
    checkbox: {
        width: 18,
        height: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 4,
        color: 'transparent',
    },
    checkboxActive: {
        background: 'rgba(255, 68, 102, 0.2)',
        borderColor: '#ff4466',
        color: '#ff4466',
    },
    checkboxActiveGreen: {
        background: 'rgba(0, 255, 136, 0.2)',
        borderColor: '#00ff88',
        color: '#00ff88',
    },
    riskInputs: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    },
    riskInput: {
        width: 50,
        padding: '6px 8px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 4,
        color: '#fff',
        fontSize: 12,
        textAlign: 'right',
        outline: 'none',
    },
    riskPercent: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
    },
    riskPrice: {
        fontSize: 11,
        color: '#ff4466',
        marginLeft: 8,
    },
    orderSummary: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '16px 20px',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
    submitBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        margin: '0 20px 20px',
        padding: '16px',
        border: 'none',
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    submitBtnLong: {
        background: 'linear-gradient(135deg, #00d26a 0%, #00ff88 100%)',
        color: '#000',
        boxShadow: '0 4px 20px rgba(0, 210, 106, 0.4)',
    },
    submitBtnShort: {
        background: 'linear-gradient(135deg, #ff4466 0%, #ff6b35 100%)',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(255, 68, 102, 0.4)',
    },
    submitBtnDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    confirmOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001,
        backdropFilter: 'blur(8px)',
    },
    confirmModal: {
        width: 340,
        background: 'linear-gradient(180deg, #0d1117 0%, #010204 100%)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    confirmHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 20,
        fontSize: 16,
        fontWeight: 700,
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    confirmBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 20,
    },
    confirmRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
    },
    confirmActions: {
        display: 'flex',
        gap: 10,
        padding: '16px 20px 20px',
    },
    cancelBtn: {
        flex: 1,
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
    },
    confirmBtn: {
        flex: 1,
        padding: '12px 16px',
        border: 'none',
        borderRadius: 8,
        color: '#000',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
    },
}

export default TradingPanel
