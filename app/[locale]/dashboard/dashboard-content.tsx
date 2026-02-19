"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import {
    Activity,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Target,
    ArrowRight,
    AlertTriangle,
} from "lucide-react";

type Signal = "bullish" | "bearish" | "neutral";

interface MarketAsset {
    symbol: string;
    name: string;
    price: string;
    change: string;
    signal: Signal;
    sparkline: string;
}

interface KeyLevel {
    asset: string;
    support: string;
    resistance: string;
    note: string;
}

const marketAssets: MarketAsset[] = [
    { symbol: "SPX", name: "S&P 500", price: "6,117", change: "+0.24%", signal: "bullish", sparkline: "0,20 12,18 24,15 36,16 48,12 60,10 72,11 80,8" },
    { symbol: "NDQ", name: "Nasdaq 100", price: "19,843", change: "+0.41%", signal: "bullish", sparkline: "0,18 12,16 24,17 36,14 48,11 60,12 72,9 80,6" },
    { symbol: "BTC", name: "Bitcoin", price: "95,432", change: "-1.20%", signal: "bearish", sparkline: "0,8 12,10 24,9 36,12 48,14 60,13 72,16 80,18" },
    { symbol: "ETH", name: "Ethereum", price: "2,684", change: "-0.80%", signal: "bearish", sparkline: "0,10 12,11 24,9 36,13 48,15 60,14 72,17 80,18" },
    { symbol: "Gold", name: "Gold", price: "2,931", change: "+0.50%", signal: "neutral", sparkline: "0,16 12,14 24,15 36,13 48,12 60,13 72,11 80,10" },
    { symbol: "Oil", name: "Crude Oil", price: "71.2", change: "-1.50%", signal: "bearish", sparkline: "0,8 12,10 24,12 36,11 48,14 60,16 72,15 80,18" },
    { symbol: "DXY", name: "US Dollar", price: "106.8", change: "+0.30%", signal: "bullish", sparkline: "0,18 12,16 24,14 36,15 48,12 60,11 72,10 80,8" },
    { symbol: "KOSPI", name: "KOSPI", price: "2,612", change: "+0.30%", signal: "neutral", sparkline: "0,14 12,16 24,14 36,12 48,14 60,13 72,12 80,11" },
];

const keyLevels: KeyLevel[] = [
    { asset: "SPX", support: "6,050", resistance: "6,200", note: "Range-bound near ATH" },
    { asset: "BTC", support: "90,000", resistance: "100,000", note: "Testing psychological level" },
    { asset: "Gold", support: "2,880", resistance: "2,960", note: "Consolidating in uptrend" },
    { asset: "10Y Yield", support: "4.40%", resistance: "4.65%", note: "Rising trend pressuring equities" },
];

const signalColor: Record<Signal, string> = {
    bullish: "text-bullish",
    bearish: "text-bearish",
    neutral: "text-neutral",
};

const signalBorder: Record<Signal, string> = {
    bullish: "signal-bullish",
    bearish: "signal-bearish",
    neutral: "signal-neutral",
};

function MiniSparkline({ signal, points }: { signal: Signal; points: string }) {
    const color = signal === "bullish" ? "#00c851" : signal === "bearish" ? "#ff3b3b" : "#ffa500";
    return (
        <svg width="80" height="24" viewBox="0 0 80 24" className="opacity-40" aria-hidden="true">
            <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
        </svg>
    );
}

/* SVG semi-circle gauge for Fear & Greed */
function FearGreedGauge({ value }: { value: number }) {
    const clampedValue = Math.min(100, Math.max(0, value));
    const angle = -90 + (clampedValue / 100) * 180; // -90 (left) to 90 (right)

    // Gradient: 0=red, 25=orange, 50=gold, 75=lime, 100=green
    const getColor = (v: number) => {
        if (v <= 25) return "#ff3b3b";
        if (v <= 45) return "#ff8c00";
        if (v <= 55) return "#ffa500";
        if (v <= 75) return "#7ec850";
        return "#00c851";
    };

    return (
        <svg viewBox="0 0 120 70" className="w-full max-w-[200px]">
            {/* Background arc */}
            <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="8"
                strokeLinecap="round"
            />
            {/* Colored arc */}
            <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="157"
                strokeDashoffset={157 - (clampedValue / 100) * 157}
                className="transition-all duration-1000 ease-out"
            />
            {/* Needle */}
            <line
                x1="60"
                y1="60"
                x2={60 + 38 * Math.cos((angle * Math.PI) / 180)}
                y2={60 + 38 * Math.sin((angle * Math.PI) / 180)}
                stroke={getColor(value)}
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
            />
            {/* Center dot */}
            <circle cx="60" cy="60" r="3" fill={getColor(value)} />
            {/* Gradient def */}
            <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff3b3b" />
                    <stop offset="25%" stopColor="#ff8c00" />
                    <stop offset="50%" stopColor="#ffa500" />
                    <stop offset="75%" stopColor="#7ec850" />
                    <stop offset="100%" stopColor="#00c851" />
                </linearGradient>
            </defs>
        </svg>
    );
}

/* TradingView widget embed */
const TV_SYMBOLS: Record<string, string> = {
    SPX: "OANDA:SPX500USD",
    NDQ: "NASDAQ:NDX",
    BTC: "BINANCE:BTCUSDT",
    ETH: "BINANCE:ETHUSDT",
    Gold: "TVC:GOLD",
    VIX: "TVC:VIX",
};

const tvTabs = Object.keys(TV_SYMBOLS);

function TradingViewChart({ symbol }: { symbol: string }) {
    const tvSymbol = TV_SYMBOLS[symbol] || "OANDA:SPX500USD";
    return (
        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/5">
            <iframe
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${encodeURIComponent(tvSymbol)}&interval=D&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=0a0e17&studies=[]&theme=dark&style=1&timezone=Etc/UTC&withdateranges=1&hide_top_toolbar=0&hide_legend=0&allow_symbol_change=0&locale=en&colorTheme=dark&width=100%25&height=100%25`}
                style={{ width: "100%", height: "100%" }}
                allowTransparency
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
    );
}

export function DashboardContent() {
    const locale = useLocale();
    const t = useTranslations("dashboard");
    const heroRef = useGsapScroll<HTMLDivElement>();
    const gridRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.08 });
    const levelsRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.1 });
    const [activeChart, setActiveChart] = useState("SPX");

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-content mx-auto">
                    {/* Hero */}
                    <div ref={heroRef} className="mb-12">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {t("title")}
                                </h1>
                                <p className="text-sm text-white/40">{t("subtitle")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Fear & Greed Gauge + VIX + 10Y in cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {/* Fear & Greed — SVG Gauge */}
                        <div className="p-5 rounded-xl bg-cv-elevated border border-white/5 signal-neutral flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-3 self-start">
                                <Activity className="w-4 h-4 text-neutral" />
                                <span className="text-sm text-white/50">{t("fearGreed")}</span>
                            </div>
                            <FearGreedGauge value={62} />
                            <p className="text-3xl font-bold font-data text-white mt-2">62</p>
                            <p className="text-sm font-data text-neutral mt-1">{t("greed")} 😏</p>
                        </div>
                        <div className="p-5 rounded-xl bg-cv-elevated border border-white/5 signal-bullish">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-4 h-4 text-bullish" />
                                <span className="text-sm text-white/50">VIX</span>
                            </div>
                            <p className="text-4xl font-bold font-data text-white">15.2</p>
                            <p className="text-sm font-data text-bullish mt-1">▼ -3.2% 😌</p>
                        </div>
                        <div className="p-5 rounded-xl bg-cv-elevated border border-white/5 signal-neutral">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-neutral" />
                                <span className="text-sm text-white/50">10Y Yield</span>
                            </div>
                            <p className="text-4xl font-bold font-data text-white">4.52%</p>
                            <p className="text-sm font-data text-neutral mt-1">▲ +2bp 📈</p>
                        </div>
                    </div>

                    {/* TradingView Chart Area */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
                            {tvTabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveChart(tab)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeChart === tab
                                            ? "bg-gold/20 text-gold border border-gold/30"
                                            : "bg-white/[0.03] text-white/40 border border-white/5 hover:text-white/60 hover:bg-white/[0.06]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <TradingViewChart symbol={activeChart} />
                    </div>

                    {/* Market Overview Grid */}
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-5">
                        {t("marketOverview")}
                    </h2>
                    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {marketAssets.map((asset) => (
                            <TiltCard key={asset.symbol}>
                                <div className={`p-5 rounded-xl bg-cv-elevated border border-white/5 h-full ${signalBorder[asset.signal]}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <span className="text-xs text-white/40 uppercase tracking-wider">{asset.symbol}</span>
                                            <p className="text-sm text-white/60">{asset.name}</p>
                                        </div>
                                        <MiniSparkline signal={asset.signal} points={asset.sparkline} />
                                    </div>
                                    <p className="text-2xl font-bold font-data text-white">{asset.price}</p>
                                    <p className={`text-sm font-data mt-1 ${signalColor[asset.signal]}`}>
                                        {asset.change.startsWith("-") ? "▼" : "▲"} {asset.change}
                                    </p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>

                    {/* Key Levels */}
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-5">
                        {t("keyLevels")}
                    </h2>
                    <div ref={levelsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {keyLevels.map((level) => (
                            <div
                                key={level.asset}
                                className="p-5 rounded-xl bg-cv-elevated border border-white/5"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-white/90">{level.asset}</span>
                                    <span className="text-xs text-white/30">{level.note}</span>
                                </div>
                                <div className="flex gap-6">
                                    <div>
                                        <span className="text-xs text-white/40 uppercase">{t("support")}</span>
                                        <p className="text-lg font-data text-bullish font-semibold">{level.support}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-white/40 uppercase">{t("resistance")}</span>
                                        <p className="text-lg font-data text-bearish font-semibold">{level.resistance}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/${locale}/switchboard`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cv-elevated border border-white/5 text-sm text-gold hover:border-gold/30 transition-colors group"
                        >
                            <Target className="w-4 h-4" />
                            {t("viewSwitchboard")}
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href={`/${locale}/bold-calls`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cv-elevated border border-white/5 text-sm text-gold hover:border-gold/30 transition-colors group"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            {t("viewBoldCalls")}
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-white/20 mt-10 leading-relaxed">
                        {t("disclaimer")}
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
