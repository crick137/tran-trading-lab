import React, { useState, useEffect } from 'react'
import { Globe, Clock } from 'lucide-react'

function MarketSessions() {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const sessions = [
        { name: 'Sydney', utcStart: 22, utcEnd: 7, color: '#3b82f6', code: 'SYD' },
        { name: 'Tokyo', utcStart: 0, utcEnd: 9, color: '#a855f7', code: 'TKY' },
        { name: 'London', utcStart: 8, utcEnd: 16, color: '#fbbf24', code: 'LDN' },
        { name: 'New York', utcStart: 13, utcEnd: 22, color: '#00d26a', code: 'NYC' },
    ]

    const getStatus = (start, end) => {
        const utcHour = currentTime.getUTCHours() + currentTime.getUTCMinutes() / 60
        let isActive = false

        if (start < end) {
            isActive = utcHour >= start && utcHour < end
        } else {
            // Crosses midnight (e.g. Sydney 22 - 7)
            isActive = utcHour >= start || utcHour < end
        }
        return isActive
    }

    const currentUtcHour = currentTime.getUTCHours() + currentTime.getUTCMinutes() / 60

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.iconBox}>
                    <Globe size={24} />
                </div>
                <div>
                    <h2 style={styles.title}>마켓 세션 (Market Sessions)</h2>
                    <p style={styles.desc}>주요 금융 시장의 개장 현황 (UTC {currentTime.toISOString().substr(11, 5)})</p>
                </div>
            </div>

            <div style={styles.sessionsGrid}>
                {sessions.map(session => {
                    const isActive = getStatus(session.utcStart, session.utcEnd)
                    return (
                        <div key={session.name} style={{
                            ...styles.sessionCard,
                            borderColor: isActive ? session.color : 'rgba(255,255,255,0.05)',
                            background: isActive ? `linear-gradient(135deg, ${session.color}11 0%, transparent 100%)` : 'rgba(255,255,255,0.02)'
                        }}>
                            <div style={styles.sessionHeader}>
                                <span style={styles.sessionCode}>{session.code}</span>
                                <div style={{
                                    ...styles.statusBadge,
                                    background: isActive ? session.color : 'transparent',
                                    color: isActive ? '#000' : 'rgba(255,255,255,0.3)',
                                    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    {isActive ? 'OPEN' : 'CLOSED'}
                                </div>
                            </div>
                            <div style={styles.sessionCily}>{session.name}</div>

                            {/* Visual Progress Bar */}
                            <div style={styles.progressBarBg}>
                                <div style={{
                                    ...styles.progressBar,
                                    width: isActive ? '60%' : '0%', // Mock for now, could be calculated
                                    background: session.color,
                                    opacity: isActive ? 1 : 0
                                }} />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Timeline Visual */}
            <div style={styles.timelineContainer}>
                <div style={styles.currentTimeMarker} style={{ left: `${(currentUtcHour / 24) * 100}%` }}>
                    <div style={styles.markerLine} />
                    <div style={styles.markerLabel}>NOW</div>
                </div>
                {/* Simple 24h Grid */}
                {[0, 6, 12, 18, 24].map(h => (
                    <div key={h} style={{ ...styles.gridLine, left: `${(h / 24) * 100}%` }}>
                        <span style={styles.gridLabel}>{h}:00</span>
                    </div>
                ))}

                {/* Session Bars */}
                {sessions.map((s, idx) => (
                    <div key={s.name} style={{
                        ...styles.timelineBar,
                        top: 20 + (idx * 12),
                        left: `${(s.utcStart / 24) * 100}%`,
                        width: `${((s.utcEnd < s.utcStart ? 24 - s.utcStart + s.utcEnd : s.utcEnd - s.utcStart) / 24) * 100}%`,
                        background: s.color,
                        opacity: 0.3
                    }} />
                ))}
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
        background: 'rgba(59, 130, 246, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#3b82f6',
    },
    title: { fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' },
    desc: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', margin: '2px 0 0' },
    sessionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
    },
    sessionCard: {
        border: '1px solid',
        borderRadius: 16,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'all 0.3s',
    },
    sessionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sessionCode: {
        fontSize: 10,
        fontWeight: 800,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.05em',
    },
    statusBadge: {
        fontSize: 9,
        fontWeight: 700,
        padding: '2px 6px',
        borderRadius: 4,
    },
    sessionCily: {
        fontSize: 14,
        fontWeight: 600,
        color: '#fff',
    },
    progressBarBg: {
        height: 3,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    timelineContainer: {
        height: 80,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        position: 'relative',
        marginTop: 10,
        overflow: 'hidden',
    },
    currentTimeMarker: {
        position: 'absolute',
        top: 0, bottom: 0,
        width: 2,
        background: '#ff3860',
        zIndex: 10,
        boxShadow: '0 0 10px rgba(255, 56, 96, 0.5)',
    },
    markerLine: { height: '100%' },
    markerLabel: {
        position: 'absolute',
        top: 0,
        left: 4,
        fontSize: 9,
        fontWeight: 700,
        color: '#ff3860',
    },
    gridLine: {
        position: 'absolute',
        top: 0, bottom: 0,
        width: 1,
        background: 'rgba(255,255,255,0.05)',
    },
    gridLabel: {
        position: 'absolute',
        bottom: 2, left: 4,
        fontSize: 9,
        color: 'rgba(255,255,255,0.2)',
    },
    timelineBar: {
        position: 'absolute',
        height: 8,
        borderRadius: 4,
    }
}

export default MarketSessions
