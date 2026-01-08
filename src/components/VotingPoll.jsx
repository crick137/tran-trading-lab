import React, { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'

/**
 * VotingPoll Component
 * Interactive voting poll with multi-language support
 * Stores votes in localStorage for persistence
 */
function VotingPoll({ pollConfig, articleId }) {
    const { language } = useI18n()
    const [votes, setVotes] = useState({})
    const [selectedOption, setSelectedOption] = useState(null)
    const [hasVoted, setHasVoted] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    const storageKey = `poll_${articleId}_${pollConfig.id}`
    const votesKey = `poll_votes_${pollConfig.id}`

    // Load existing votes and user's vote status
    useEffect(() => {
        // Check if user has voted
        const userVote = localStorage.getItem(storageKey)
        if (userVote) {
            setSelectedOption(userVote)
            setHasVoted(true)
        }

        // Load vote counts
        const storedVotes = localStorage.getItem(votesKey)
        if (storedVotes) {
            setVotes(JSON.parse(storedVotes))
        } else {
            // Initialize with random base votes for visual appeal
            const initialVotes = {}
            pollConfig.options.forEach(opt => {
                initialVotes[opt.id] = Math.floor(Math.random() * 50) + 20
            })
            setVotes(initialVotes)
            localStorage.setItem(votesKey, JSON.stringify(initialVotes))
        }
    }, [storageKey, votesKey, pollConfig])

    const handleVote = (optionId) => {
        if (hasVoted) return

        setIsAnimating(true)
        setSelectedOption(optionId)

        // Update votes
        const newVotes = { ...votes }
        newVotes[optionId] = (newVotes[optionId] || 0) + 1
        setVotes(newVotes)

        // Save to localStorage
        localStorage.setItem(storageKey, optionId)
        localStorage.setItem(votesKey, JSON.stringify(newVotes))

        setTimeout(() => {
            setHasVoted(true)
            setIsAnimating(false)
        }, 600)
    }

    const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0)

    const getPercentage = (optionId) => {
        if (totalVotes === 0) return 0
        return Math.round((votes[optionId] || 0) / totalVotes * 100)
    }

    const getText = (textObj) => textObj[language] || textObj.en || textObj.ko

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.question}>{getText(pollConfig.question)}</h3>
                <div style={styles.totalVotes}>
                    <span style={styles.voteIcon}>📊</span>
                    <span>{totalVotes} {language === 'ko' ? '투표' : language === 'zh' ? '票' : 'votes'}</span>
                </div>
            </div>

            <div style={styles.options}>
                {pollConfig.options.map((option, index) => {
                    const percentage = getPercentage(option.id)
                    const isSelected = selectedOption === option.id
                    const isWinning = hasVoted && percentage === Math.max(...pollConfig.options.map(o => getPercentage(o.id)))

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleVote(option.id)}
                            disabled={hasVoted}
                            style={{
                                ...styles.option,
                                ...(isSelected ? styles.optionSelected : {}),
                                ...(hasVoted && !isSelected ? styles.optionDisabled : {}),
                                ...(isWinning ? styles.optionWinning : {}),
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            {/* Progress bar background */}
                            {hasVoted && (
                                <div
                                    style={{
                                        ...styles.progressBar,
                                        width: `${percentage}%`,
                                        background: isWinning
                                            ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)'
                                            : 'linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)'
                                    }}
                                />
                            )}

                            <div style={styles.optionContent}>
                                <span style={styles.emoji}>{option.emoji}</span>
                                <span style={styles.label}>{getText(option.label)}</span>
                            </div>

                            {hasVoted && (
                                <div style={styles.resultInfo}>
                                    <span style={{
                                        ...styles.percentage,
                                        color: isWinning ? '#22c55e' : '#60a5fa'
                                    }}>
                                        {percentage}%
                                    </span>
                                    <span style={styles.voteCount}>
                                        ({votes[option.id] || 0})
                                    </span>
                                </div>
                            )}

                            {isSelected && !hasVoted && isAnimating && (
                                <div style={styles.loadingDot} />
                            )}

                            {isSelected && hasVoted && (
                                <span style={styles.checkmark}>✓</span>
                            )}
                        </button>
                    )
                })}
            </div>

            {hasVoted && (
                <div style={styles.thankYou}>
                    <span style={styles.sparkle}>✨</span>
                    <span>
                        {language === 'ko' ? '투표해 주셔서 감사합니다!'
                            : language === 'zh' ? '感谢您的投票！'
                                : 'Thanks for voting!'}
                    </span>
                </div>
            )}

            {!hasVoted && (
                <p style={styles.hint}>
                    {language === 'ko' ? '옵션을 클릭하여 투표하세요'
                        : language === 'zh' ? '点击选项进行投票'
                            : 'Click an option to vote'}
                </p>
            )}
        </div>
    )
}

const styles = {
    container: {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: 'var(--radius-xl, 16px)',
        padding: 'var(--space-6, 24px)',
        marginTop: 'var(--space-8, 32px)',
        marginBottom: 'var(--space-8, 32px)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-5, 20px)',
        flexWrap: 'wrap',
        gap: 'var(--space-3, 12px)',
    },
    question: {
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: '700',
        color: 'var(--text-primary, #fff)',
        background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    totalVotes: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2, 8px)',
        fontSize: '0.875rem',
        color: 'var(--text-tertiary, #94a3b8)',
        fontFamily: 'var(--font-mono)',
    },
    voteIcon: {
        fontSize: '1rem',
    },
    options: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3, 12px)',
    },
    option: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-4, 16px) var(--space-5, 20px)',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-lg, 12px)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        animation: 'fadeIn 0.4s ease forwards',
        opacity: 0,
    },
    optionSelected: {
        borderColor: 'rgba(59, 130, 246, 0.5)',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
    },
    optionDisabled: {
        cursor: 'default',
        opacity: 0.7,
    },
    optionWinning: {
        borderColor: 'rgba(34, 197, 94, 0.4)',
    },
    progressBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        transition: 'width 0.6s ease',
        borderRadius: 'var(--radius-lg, 12px)',
    },
    optionContent: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3, 12px)',
        position: 'relative',
        zIndex: 1,
    },
    emoji: {
        fontSize: '1.5rem',
    },
    label: {
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--text-primary, #fff)',
    },
    resultInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2, 8px)',
        position: 'relative',
        zIndex: 1,
    },
    percentage: {
        fontSize: '1.125rem',
        fontWeight: '700',
        fontFamily: 'var(--font-mono)',
    },
    voteCount: {
        fontSize: '0.75rem',
        color: 'var(--text-muted, #64748b)',
        fontFamily: 'var(--font-mono)',
    },
    loadingDot: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid transparent',
        borderTopColor: '#3b82f6',
        animation: 'spin 0.6s linear infinite',
    },
    checkmark: {
        fontSize: '1.25rem',
        color: '#22c55e',
        fontWeight: '700',
    },
    thankYou: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2, 8px)',
        marginTop: 'var(--space-4, 16px)',
        padding: 'var(--space-3, 12px)',
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
        borderRadius: 'var(--radius-md, 8px)',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#22c55e',
    },
    sparkle: {
        fontSize: '1rem',
        animation: 'pulse 1.5s ease infinite',
    },
    hint: {
        margin: 0,
        marginTop: 'var(--space-4, 16px)',
        textAlign: 'center',
        fontSize: '0.8125rem',
        color: 'var(--text-muted, #64748b)',
    },
}

// Add keyframe animations via style tag
if (typeof document !== 'undefined') {
    const styleId = 'voting-poll-animations'
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `
        document.head.appendChild(style)
    }
}

export default VotingPoll
