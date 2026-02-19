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
                // Crypto-V Signal Colors
                bullish: "#00c851",
                bearish: "#ff3b3b",
                neutral: "#ffa500",
                gold: {
                    DEFAULT: "#ffa500",
                    light: "#ffcc00",
                    dark: "#ff8c00",
                },
                // Crypto-V Backgrounds — 5-level depth scale
                "cv-void": "#050810",
                "cv-primary": "#0a0e17",
                "cv-elevated": "#0f1420",
                "cv-secondary": "#0f1420", // alias for cv-elevated
                "cv-surface": "#141b2d",
                "cv-tertiary": "#141b2d",  // alias for cv-surface
                "cv-overlay": "#1a2235",
                // Border glow colors
                "border-glow-green": "rgba(0, 200, 81, 0.3)",
                "border-glow-red": "rgba(255, 59, 59, 0.3)",
                "border-glow-gold": "rgba(255, 165, 0, 0.3)",
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
                    "0%, 100%": { boxShadow: "0 0 20px rgba(255, 165, 0, 0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(255, 165, 0, 0.6)" },
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
                "moving-border-spin": {
                    "0%": { "--border-angle": "0deg" },
                    "100%": { "--border-angle": "360deg" },
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
                "section": "120px",
                "section-mobile": "80px",
            },
            fontSize: {
                "hero": ["clamp(3rem, 6vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
                "section-title": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],
                "card-title": ["clamp(1.125rem, 1.5vw, 1.375rem)", { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" }],
                "label": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em", fontWeight: "500" }],
            },
        },
    },
    plugins: [],
};

export default config;
