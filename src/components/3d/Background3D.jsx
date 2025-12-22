import React, { useEffect, useRef } from 'react'
import { useAppState } from '../../context/AppContext'

/**
 * Deep Space Background with Day/Night Mode
 * 深邃宇宙背景 - 支持日夜模式切换
 */
function Background3D() {
    const canvasRef = useRef(null)
    const animationRef = useRef(null)
    const { theme } = useAppState()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { alpha: false })
        let width, height
        let time = 0

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.scale(dpr, dpr)
        }

        resize()
        window.addEventListener('resize', resize)

        // Stars
        const stars = Array.from({ length: 600 }, () => ({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 2.5 + 0.3,
            alpha: Math.random() * 0.9 + 0.1,
            twinkleSpeed: Math.random() * 0.02 + 0.003,
            twinkleOffset: Math.random() * Math.PI * 2,
            color: Math.random() > 0.9 ? 'cyan' : Math.random() > 0.95 ? 'purple' : 'white',
        }))

        // Nebula clouds (subtle colored areas)
        const nebulae = Array.from({ length: 5 }, () => ({
            x: Math.random(),
            y: Math.random(),
            radius: Math.random() * 300 + 150,
            color: ['rgba(100, 50, 150, 0.03)', 'rgba(50, 100, 150, 0.02)', 'rgba(0, 150, 150, 0.02)'][Math.floor(Math.random() * 3)],
        }))

        // Shooting stars
        const shootingStars = []
        const spawnShootingStar = () => {
            if (shootingStars.length < 2 && Math.random() < 0.003) {
                shootingStars.push({
                    x: Math.random() * width,
                    y: Math.random() * height * 0.5,
                    length: Math.random() * 100 + 50,
                    speed: Math.random() * 8 + 4,
                    angle: Math.PI * 0.25 + Math.random() * 0.2,
                    alpha: 1,
                })
            }
        }

        // Animation loop
        const animate = () => {
            time++
            const isDark = theme === 'dark'

            // Background
            if (isDark) {
                // Night mode - Deep space
                const bg = ctx.createRadialGradient(
                    width * 0.3, height * 0.2, 0,
                    width * 0.5, height * 0.5, Math.max(width, height) * 0.9
                )
                bg.addColorStop(0, '#0a0d15')
                bg.addColorStop(0.4, '#050810')
                bg.addColorStop(0.7, '#020306')
                bg.addColorStop(1, '#000001')
                ctx.fillStyle = bg
            } else {
                // Day mode - Soft gradient
                const bg = ctx.createLinearGradient(0, 0, 0, height)
                bg.addColorStop(0, '#e8f4fc')
                bg.addColorStop(0.3, '#d0e8f5')
                bg.addColorStop(0.7, '#b8d8ed')
                bg.addColorStop(1, '#a0c8e0')
                ctx.fillStyle = bg
            }
            ctx.fillRect(0, 0, width, height)

            if (isDark) {
                // Draw nebulae (night only)
                nebulae.forEach(n => {
                    const gradient = ctx.createRadialGradient(
                        n.x * width, n.y * height, 0,
                        n.x * width, n.y * height, n.radius
                    )
                    gradient.addColorStop(0, n.color)
                    gradient.addColorStop(1, 'transparent')
                    ctx.fillStyle = gradient
                    ctx.fillRect(0, 0, width, height)
                })

                // Draw stars (night only)
                stars.forEach(star => {
                    const twinkle = 0.6 + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.4
                    const alpha = star.alpha * twinkle

                    // Star glow
                    if (star.size > 1.5) {
                        const glow = ctx.createRadialGradient(
                            star.x * width, star.y * height, 0,
                            star.x * width, star.y * height, star.size * 3
                        )
                        const glowColor = star.color === 'cyan' ? '0, 220, 220' :
                            star.color === 'purple' ? '180, 100, 255' : '255, 255, 255'
                        glow.addColorStop(0, `rgba(${glowColor}, ${alpha * 0.5})`)
                        glow.addColorStop(1, 'transparent')
                        ctx.fillStyle = glow
                        ctx.beginPath()
                        ctx.arc(star.x * width, star.y * height, star.size * 3, 0, Math.PI * 2)
                        ctx.fill()
                    }

                    // Star core
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                    ctx.beginPath()
                    ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2)
                    ctx.fill()
                })

                // Shooting stars
                spawnShootingStar()
                shootingStars.forEach((ss, i) => {
                    ss.x += Math.cos(ss.angle) * ss.speed
                    ss.y += Math.sin(ss.angle) * ss.speed
                    ss.alpha -= 0.015

                    if (ss.alpha > 0) {
                        const gradient = ctx.createLinearGradient(
                            ss.x, ss.y,
                            ss.x - Math.cos(ss.angle) * ss.length,
                            ss.y - Math.sin(ss.angle) * ss.length
                        )
                        gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`)
                        gradient.addColorStop(1, 'transparent')
                        ctx.strokeStyle = gradient
                        ctx.lineWidth = 2
                        ctx.beginPath()
                        ctx.moveTo(ss.x, ss.y)
                        ctx.lineTo(
                            ss.x - Math.cos(ss.angle) * ss.length,
                            ss.y - Math.sin(ss.angle) * ss.length
                        )
                        ctx.stroke()
                    } else {
                        shootingStars.splice(i, 1)
                    }
                })
            } else {
                // Day mode - subtle floating particles
                for (let i = 0; i < 50; i++) {
                    const x = (Math.sin(time * 0.001 + i * 0.5) * 0.3 + 0.5 + i * 0.02) % 1 * width
                    const y = (Math.cos(time * 0.0008 + i * 0.3) * 0.2 + 0.5 + i * 0.015) % 1 * height
                    const alpha = 0.1 + Math.sin(time * 0.01 + i) * 0.05
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                    ctx.beginPath()
                    ctx.arc(x, y, 2, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationRef.current)
            window.removeEventListener('resize', resize)
        }
    }, [theme])

    return (
        <div style={styles.container}>
            <canvas ref={canvasRef} style={styles.canvas} />
            <div style={{
                ...styles.vignette,
                background: theme === 'dark'
                    ? 'radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 100%)'
                    : 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.05) 100%)'
            }} />
        </div>
    )
}

const styles = {
    container: {
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: '#000',
        overflow: 'hidden',
    },
    canvas: {
        position: 'absolute',
        inset: 0,
    },
    vignette: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
    },
}

export default Background3D
