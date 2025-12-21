import React, { useEffect, useRef } from 'react'

/**
 * Ultimate Cyberpunk Grid Background
 * 
 * Features:
 * - Deep Void Gradient Background
 * - Perspective Retro-Wave Grid with neon glow
 * - Dynamic Wave Animation
 * - Floating Particles with breathing effect
 * - High-speed Data Streams (Packets) traveling along grid lines
 * - Subtle color shifting (Cyan <-> Purple)
 */
function Background3D() {
    const canvasRef = useRef(null)
    const animationRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { alpha: true })
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

        // Configuration
        const CONFIG = {
            horizon: 0.32,
            gridCols: 30,
            gridRows: 24,
            waveAmplitude: 30,
            waveFrequency: 0.06,
            waveSpeed: 0.02,
            flowSpeed: 0.003,
            baseColor: { r: 0, g: 255, b: 136 }, // Neon Green #00ff88
            accentColor: { r: 168, g: 85, b: 247 }, // Purple #a855f7
        }

        let flowOffset = 0

        // ========================
        // Data Packet Class
        // ========================
        class DataPacket {
            constructor() {
                this.reset()
            }

            reset() {
                this.col = Math.floor(Math.random() * (CONFIG.gridCols + 1))
                this.rowProgress = 0 // 0 to 1 (start to end)
                this.speed = Math.random() * 0.015 + 0.01
                this.size = Math.random() * 2 + 1.5
                this.active = Math.random() > 0.3 // Not all are active at once
                this.color = Math.random() > 0.5 ? CONFIG.baseColor : CONFIG.accentColor
            }

            update() {
                if (!this.active) {
                    if (Math.random() < 0.005) this.active = true
                    return
                }
                this.rowProgress += this.speed
                if (this.rowProgress > 1) {
                    this.reset()
                    this.active = false // Wait to respawn
                }
            }
        }

        const packets = Array.from({ length: 15 }, () => new DataPacket())

        // ========================
        // Grid & Packets Drawing
        // ========================
        function drawScene() {
            const horizonY = height * CONFIG.horizon
            const centerX = width / 2
            const gridHeight = height - horizonY + 200

            // 1. Calculate Grid Points
            const points = [] // 2D array [row][col]

            for (let row = 0; row <= CONFIG.gridRows; row++) {
                const rowPoints = []

                // Perspective flow logic
                // Map row index to 0..1 progress, add flow offset
                let t = ((row / CONFIG.gridRows) + flowOffset) % 1.0
                if (t < 0) t += 1

                // Exponential perspective for depth
                const perspective = Math.pow(t, 2.5)
                const baseY = horizonY + perspective * gridHeight

                // Row width expands with perspective
                const rowWidth = width * (0.1 + perspective * 3.0)

                for (let col = 0; col <= CONFIG.gridCols; col++) {
                    const colRatio = (col / CONFIG.gridCols) * 2 - 1 // -1 to 1
                    const x = centerX + colRatio * rowWidth / 2

                    // Wave Effect
                    const wave = Math.sin(
                        col * CONFIG.waveFrequency +
                        time * CONFIG.waveSpeed +
                        row * 0.2
                    ) * CONFIG.waveAmplitude * perspective

                    const y = baseY + wave

                    rowPoints.push({ x, y, perspective, colRatio })
                }
                points.push(rowPoints)
            }

            // 2. Draw Vertical Lines
            for (let col = 0; col <= CONFIG.gridCols; col++) {
                const colRatio = (col / CONFIG.gridCols) * 2 - 1
                const centerDist = Math.abs(colRatio)
                const alphaFade = 1 - Math.pow(centerDist, 3)
                if (alphaFade < 0.05) continue

                ctx.beginPath()
                let started = false

                // Color variation based on column
                const isAccent = col % 5 === 0
                const c = isAccent ? CONFIG.accentColor : CONFIG.baseColor

                for (let row = 0; row < points.length; row++) {
                    if (col >= points[row].length) continue
                    const p = points[row][col]
                    if (p.perspective < 0.01) continue

                    if (!started) {
                        ctx.moveTo(p.x, p.y)
                        started = true
                    } else {
                        ctx.lineTo(p.x, p.y)
                    }
                }

                // Gradient stroke usually expensive, use solid with alpha
                ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.15 * alphaFade})`
                ctx.lineWidth = isAccent ? 1.5 : 0.8
                ctx.stroke()
            }

            // 3. Draw Horizontal Lines
            for (let row = 0; row < points.length; row++) {
                const rowPoints = points[row]
                if (rowPoints.length === 0) continue
                const p0 = rowPoints[0]
                if (p0.perspective < 0.01) continue

                const alpha = 0.1 + p0.perspective * 0.4

                ctx.beginPath()
                ctx.strokeStyle = `rgba(${CONFIG.baseColor.r}, ${CONFIG.baseColor.g}, ${CONFIG.baseColor.b}, ${alpha})`
                ctx.lineWidth = 1 + p0.perspective * 2

                for (let col = 0; col < rowPoints.length; col++) {
                    const p = rowPoints[col]
                    // Fade edges
                    if (Math.abs(p.colRatio) > 0.98) continue
                    if (col === 0) ctx.moveTo(p.x, p.y)
                    else ctx.lineTo(p.x, p.y)
                }
                ctx.stroke()
            }

            // 4. Draw Data Packets
            packets.forEach(pkt => {
                if (!pkt.active) return

                // Interpolate position based on rowProgress
                // rowProgress maps to points array index floating point
                const totalRows = points.length - 1
                const idx = pkt.rowProgress * totalRows
                const rowIdx = Math.floor(idx)
                const nextRowIdx = Math.min(rowIdx + 1, totalRows)
                const frac = idx - rowIdx

                // Column is fixed
                if (pkt.col >= points[0].length) return

                const p1 = points[rowIdx]?.[pkt.col]
                const p2 = points[nextRowIdx]?.[pkt.col]

                if (p1 && p2 && p1.perspective > 0.01) {
                    const x = p1.x + (p2.x - p1.x) * frac
                    const y = p1.y + (p2.y - p1.y) * frac

                    const pScale = p1.perspective // Scale size by perspective
                    const size = pkt.size * (1 + pScale * 4)
                    const alpha = (1 - pkt.rowProgress) * 0.8 // Fade out as it gets closer? No, fade in maybe?
                    // Actually let's keep it bright

                    // Draw Glow
                    const g = ctx.createRadialGradient(x, y, 0, x, y, size * 4)
                    g.addColorStop(0, `rgba(${pkt.color.r}, ${pkt.color.g}, ${pkt.color.b}, 1)`)
                    g.addColorStop(0.4, `rgba(${pkt.color.r}, ${pkt.color.g}, ${pkt.color.b}, 0.2)`)
                    g.addColorStop(1, 'transparent')

                    ctx.fillStyle = g
                    ctx.beginPath()
                    ctx.arc(x, y, size * 4, 0, Math.PI * 2)
                    ctx.fill()

                    // Core
                    ctx.fillStyle = '#fff'
                    ctx.beginPath()
                    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
                    ctx.fill()
                }
            })

            // 5. Horizon Glow
            const horizonGlow = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY + 100)
            horizonGlow.addColorStop(0, 'transparent')
            horizonGlow.addColorStop(0.4, `rgba(${CONFIG.baseColor.r}, ${CONFIG.baseColor.g}, ${CONFIG.baseColor.b}, 0.15)`)
            horizonGlow.addColorStop(1, 'transparent')
            ctx.fillStyle = horizonGlow
            ctx.fillRect(0, horizonY - 50, width, 150)
        }

        // ========================
        // Particles Class
        // ========================
        class Particle {
            constructor() { this.reset() }

            reset() {
                this.x = Math.random() * width
                this.y = Math.random() * height * CONFIG.horizon // Only above horizon (sky)
                this.size = Math.random() * 1.5
                this.alpha = Math.random() * 0.5 + 0.1
                this.vy = -(Math.random() * 0.2 + 0.05) // Float up
            }

            update() {
                this.y += this.vy
                if (this.y < 0) this.reset()
                this.alpha = Math.max(0, this.alpha - 0.001)
                if (this.alpha <= 0) this.reset()
            }

            draw(ctx) {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const particles = Array.from({ length: 40 }, () => new Particle())

        // Animation Loop
        const animate = () => {
            time++
            flowOffset = (flowOffset + CONFIG.flowSpeed) % 1
            packets.forEach(p => p.update())
            particles.forEach(p => p.update())

            // Background Fill (Deep Gradient)
            const bg = ctx.createLinearGradient(0, 0, 0, height)
            bg.addColorStop(0, '#020408') // Deep Void
            bg.addColorStop(CONFIG.horizon, '#050a14') // Slightly lighter near horizon
            bg.addColorStop(1, '#000000') // Black bottom
            ctx.fillStyle = bg
            ctx.fillRect(0, 0, width, height)

            particles.forEach(p => p.draw(ctx))
            drawScene()

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationRef.current)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <div style={styles.container}>
            <canvas ref={canvasRef} style={styles.canvas} />
            <div style={styles.overlays}>
                <div style={styles.vignette} />
                <div style={styles.scanline} />
            </div>
        </div>
    )
}

const styles = {
    container: {
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: '#020408',
        overflow: 'hidden',
    },
    canvas: {
        position: 'absolute',
        inset: 0,
    },
    overlays: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
    },
    vignette: {
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)',
    },
    scanline: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
        backgroundSize: '100% 4px',
        opacity: 0.15,
        pointerEvents: 'none',
    }
}

export default Background3D
