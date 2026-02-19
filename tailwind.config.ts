import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Accent — uses CSS variable RGB for alpha support
                accent: {
                    DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
                    hover: "var(--accent-hover)",
                    dim: "var(--accent-dim)",
                },
                // Signal Colors — RGB for alpha support
                bullish: "rgb(var(--bullish-rgb) / <alpha-value>)",
                bearish: "rgb(var(--bearish-rgb) / <alpha-value>)",
                neutral: "rgb(var(--neutral-rgb) / <alpha-value>)",
                info: "rgb(var(--info-rgb) / <alpha-value>)",
                // Legacy alias — maps to accent
                gold: {
                    DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
                    light: "var(--accent-hover)",
                    dark: "var(--accent-dim)",
                },
                // Backgrounds — 5-level depth scale (CSS var for auto theme switching)
                "cv-void": "var(--bg-void)",
                "cv-primary": "var(--bg-primary)",
                "cv-elevated": "var(--bg-elevated)",
                "cv-secondary": "var(--bg-elevated)", // alias
                "cv-surface": "var(--bg-surface)",
                "cv-tertiary": "var(--bg-surface)", // alias
                "cv-overlay": "var(--bg-overlay)",
                // Border glow colors
                "border-glow-green": "var(--border-glow-green)",
                "border-glow-red": "var(--border-glow-red)",
                "border-glow-gold": "var(--border-glow-gold)",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "'Pretendard'", "system-ui", "sans-serif"],
                mono: ["var(--font-jetbrains)", "'SF Mono'", "monospace"],
                kr: ["'Pretendard'", "'Noto Sans KR'", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "fade-up": "fadeUp 0.6s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "glow": "glow 2s ease-in-out infinite",
                "glow-pulse": "glowPulse 2s ease-in-out infinite",
                "count-up": "countUp 0.5s ease-out",
                "ticker": "ticker-scroll 30s linear infinite",
                "shake": "shake 0.5s ease-in-out",
                "shimmer-slide": "shimmerSlide 2s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                glow: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(212, 168, 67, 0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(212, 168, 67, 0.6)" },
                },
                glowPulse: {
                    "0%, 100%": { opacity: "0.6" },
                    "50%": { opacity: "1" },
                },
                "aurora-drift-1": {
                    "0%, 100%": { transform: "translate(0%, 0%) rotate(0deg)" },
                    "25%": { transform: "translate(5%, -3%) rotate(1deg)" },
                    "50%": { transform: "translate(-3%, 5%) rotate(-1deg)" },
                    "75%": { transform: "translate(-5%, -2%) rotate(0.5deg)" },
                },
                "aurora-drift-2": {
                    "0%, 100%": { transform: "translate(0%, 0%) rotate(0deg)" },
                    "33%": { transform: "translate(-4%, 4%) rotate(-1deg)" },
                    "66%": { transform: "translate(4%, -3%) rotate(1deg)" },
                },
                "aurora-drift-3": {
                    "0%, 100%": { transform: "translate(0%, 0%)" },
                    "50%": { transform: "translate(3%, 3%)" },
                },
                shake: {
                    "0%, 100%": { transform: "translateX(0)" },
                    "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
                    "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
                },
                shimmerSlide: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            letterSpacing: {
                tightest: "-0.03em",
            },
            maxWidth: {
                "content": "1400px",
            },
            spacing: {
                "section": "var(--space-section)",
                "section-mobile": "var(--space-section-mobile)",
            },
            fontSize: {
                "display": ["clamp(3.25rem, 7vw, 5.5rem)", { lineHeight: "1.04", letterSpacing: "-0.03em", fontWeight: "800" }],
                "headline": ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "700" }],
                "title-1": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "700" }],
                "title-2": ["clamp(1.375rem, 2vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" }],
                "title-3": ["clamp(1.125rem, 1.5vw, 1.375rem)", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
                "body-lg": ["1.125rem", { lineHeight: "1.7", letterSpacing: "0", fontWeight: "400" }],
                // Legacy aliases
                "hero": ["clamp(3.25rem, 7vw, 5.5rem)", { lineHeight: "1.04", letterSpacing: "-0.03em", fontWeight: "800" }],
                "section-title": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "700" }],
                "card-title": ["clamp(1.125rem, 1.5vw, 1.375rem)", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
                "label": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.06em", fontWeight: "600" }],
            },
            boxShadow: {
                "xs": "var(--shadow-xs)",
                "sm": "var(--shadow-sm)",
                "md": "var(--shadow-md)",
                "lg": "var(--shadow-lg)",
                "xl": "var(--shadow-xl)",
            },
        },
    },
    plugins: [],
};

export default config;
