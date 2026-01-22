"use client";

import { motion } from "framer-motion";

interface ChartImageProps {
    src: string;
    alt: string;
}

export function ChartImage({ src, alt }: ChartImageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-8 rounded-xl overflow-hidden"
        >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 blur-xl -z-10" />

            {/* Image container with shadow */}
            <div className="relative rounded-xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-auto rounded-xl"
                />
            </div>

            {/* Caption */}
            <p className="text-center text-xs text-muted-foreground mt-3">
                {alt} | TradingView
            </p>
        </motion.div>
    );
}

interface TradingViewQuoteProps {
    symbol: string;
}

export function TradingViewQuote({ symbol }: TradingViewQuoteProps) {
    // Convert symbol format for TradingView (USD/KRW -> FX:USDKRW)
    const tvSymbol = `FX:${symbol.replace('/', '')}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
        >
            <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden">
                <iframe
                    src={`https://www.tradingview.com/widgetembed/?symbol=${tvSymbol}&interval=240&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=1a1a2e&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC`}
                    width="100%"
                    height="400"
                    frameBorder="0"
                    allowTransparency
                    scrolling="no"
                    className="w-full"
                />
            </div>
        </motion.div>
    );
}

interface ChecklistProps {
    items: string[];
}

export function Checklist({ items }: ChecklistProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
        >
            <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-foreground mb-4">
                <span className="text-2xl">📍</span>
                오늘의 핵심 체크리스트
            </h2>
            <div className="bg-card/30 border border-border/50 rounded-xl p-6">
                <ul className="space-y-3">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-muted-foreground">
                            <span className="text-gold/60 mt-0.5">■</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}

interface ConclusionProps {
    text: string;
}

export function Conclusion({ text }: ConclusionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
        >
            <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-foreground mb-4">
                <span className="text-2xl">🎯</span>
                결론
            </h2>
            <p className="text-muted-foreground leading-relaxed">
                {text}
            </p>
            <p className="text-sm text-muted-foreground/60 mt-4 italic">
                Edu only — NFA.
            </p>
        </motion.div>
    );
}
