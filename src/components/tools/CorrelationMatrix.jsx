import React from 'react'
import { Grip } from 'lucide-react'

function CorrelationMatrix() {
    // Mock Data for Correlation Matrix
    const assets = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP']
    const data = [
        [1.00, 0.85, 0.62, 0.78, 0.45],
        [0.85, 1.00, 0.75, 0.72, 0.48],
        [0.62, 0.75, 1.00, 0.55, 0.40],
        [0.78, 0.72, 0.55, 1.00, 0.38],
        [0.45, 0.48, 0.40, 0.38, 1.00]
    ]

    const getColor = (val) => {
        if (val === 1) return 'rgba(255,255,255,0.1)'
        if (val > 0.8) return 'rgba(0, 210, 106, 0.4)'
        if (val > 0.6) return 'rgba(0, 210, 106, 0.2)'
        if (val > 0.4) return 'rgba(251, 191, 36, 0.2)'
        return 'rgba(255, 255, 255, 0.05)'
    }

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.iconBox}>
                    <Grip size={24} />
                </div>
                <div>
                    <h2 style={styles.title}>자산 상관관계 (Correlation)</h2>
                    <p style={styles.desc}>주요 자산 간의 가격 연동성 분석 (30D)</p>
                </div>
            </div>

            <div style={styles.matrixContainer}>
                {/* Header Row */}
                <div style={styles.row}>
                    <div style={styles.cellHeader}></div>
                    {assets.map(a => (
                        <div key={a} style={styles.cellHeader}>{a}</div>
                    ))}
                </div>

                {/* Data Rows */}
                {data.map((row, i) => (
                    <div key={i} style={styles.row}>
                        <div style={styles.cellHeader}>{assets[i]}</div>
                        {row.map((val, j) => (
                            <div
                                key={j}
                                style={{
                                    ...styles.cell,
                                    background: getColor(val),
                                    color: val > 0.8 ? '#fff' : 'rgba(255,255,255,0.7)'
                                }}
                            >
                                {val.toFixed(2)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div style={styles.legend}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ ...styles.dot, background: 'rgba(0, 210, 106, 0.4)' }} />
                    <span>Strong Positive ({'>'}0.8)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ ...styles.dot, background: 'rgba(251, 191, 36, 0.2)' }} />
                    <span>Moderate</span>
                </div>
            </div>
        </div>
    )
}

const styles = {
    card: {
        background: 'linear-gradient(135deg, rgba(16, 24, 36, 0.6) 0%, rgba(8, 16, 24, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        backdropFilter: 'blur(10px)',
    },
    header: { display: 'flex', alignItems: 'center', gap: 16 },
    iconBox: {
        width: 48, height: 48, borderRadius: 16,
        background: 'rgba(255, 255, 255, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
    },
    title: { fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' },
    desc: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', margin: '2px 0 0' },

    matrixContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    row: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 2,
    },
    cellHeader: {
        padding: 8,
        fontSize: 11,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
    },
    cell: {
        padding: 8,
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
        borderRadius: 4,
        transition: 'transform 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
    },
    legend: {
        display: 'flex', gap: 16,
        fontSize: 10, color: 'rgba(255,255,255,0.4)',
        marginTop: 4, marginLeft: 4
    },
    dot: { width: 8, height: 8, borderRadius: '50%' }
}

export default CorrelationMatrix
