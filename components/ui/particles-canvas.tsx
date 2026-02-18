"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
}

interface ParticlesCanvasProps {
    className?: string;
    particleCount?: number;
    connectionDistance?: number;
}

const COLORS = [
    "rgba(255, 165, 0, ALPHA)",  // gold
    "rgba(0, 200, 81, ALPHA)",   // green
    "rgba(255, 59, 59, ALPHA)",  // red
    "rgba(255, 255, 255, ALPHA)", // white
];

export function ParticlesCanvas({
    className,
    particleCount,
    connectionDistance = 120,
}: ParticlesCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const isVisibleRef = useRef(true);
    const dimsRef = useRef({ w: 0, h: 0 });

    const getParticleCount = useCallback(() => {
        if (particleCount) return particleCount;
        if (typeof window === "undefined") return 60;
        return window.innerWidth < 768 ? 25 : 70;
    }, [particleCount]);

    const initParticles = useCallback(
        (width: number, height: number) => {
            const count = getParticleCount();
            const particles: Particle[] = [];
            for (let i = 0; i < count; i++) {
                const colorTemplate =
                    COLORS[Math.floor(Math.random() * COLORS.length)];
                const alpha = 0.15 + Math.random() * 0.25;
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: 1 + Math.random() * 1.5,
                    color: colorTemplate.replace("ALPHA", String(alpha)),
                });
            }
            return particles;
        },
        [getParticleCount]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Respect prefers-reduced-motion
        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );
        if (mediaQuery.matches) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            dimsRef.current = { w: rect.width, h: rect.height };
            particlesRef.current = initParticles(rect.width, rect.height);
        };

        resize();

        // IntersectionObserver to pause when off-screen
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );
        observer.observe(canvas);

        // Mouse tracking for parallax
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);

            if (!isVisibleRef.current) return;

            const { w, h } = dimsRef.current;

            ctx.clearRect(0, 0, w, h);

            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            // Pre-compute squared thresholds (avoid sqrt in hot loop)
            const connDistSq = connectionDistance * connectionDistance;
            const mouseDistSq = 40000; // 200 * 200

            // Update + draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Drift
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                // Mouse parallax — subtle push (squared distance check)
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < mouseDistSq) {
                    const dist = Math.sqrt(distSq);
                    const force = (200 - dist) / 200;
                    p.x -= dx * force * 0.008;
                    p.y -= dy * force * 0.008;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            // Draw connections (squared distance — sqrt only when drawing)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connDistSq) {
                        const dist = Math.sqrt(distSq);
                        const opacity =
                            (1 - dist / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        animate();

        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            observer.disconnect();
        };
    }, [initParticles, connectionDistance]);

    return (
        <canvas
            ref={canvasRef}
            role="presentation"
            className={cn("pointer-events-auto absolute inset-0", className)}
            style={{ width: "100%", height: "100%" }}
        />
    );
}
