"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import useSWR from "swr";
import {
    Activity,
    TrendingDown,
    TrendingUp,
    BarChart3,
    Target,
    ArrowRight,
    AlertTriangle,
} from "lucide-react";

interface MarketApiData {
    fearGreed: { value: number; classification: string } | null;
    vix: { value: number; change: number } | null;
    treasury: { value: number } | null;
    coins: { symbol: string; usd: number; usd_24h_change: number }[] | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/* SVG semi-circle gauge for Fear & Greed */
function FearGreedGauge({ value }: { value: number }) {
    const clampedValue = Math.min(100, Math.max(0, value));
    const angle = 180 + (clampedValue / 100) * 180; // SVG Y-down: 180°=left(fear) → 270°=up(neutral) → 360°=right(greed)

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

function getClassificationLabel(classification: string): string {
    const lower = classification.toLowerCase();
    if (lower.includes("extreme fear")) return "Extreme Fear";
    if (lower.includes("fear")) return "Fear";
    if (lower.includes("extreme greed")) return "Extreme Greed";
    if (lower.includes("greed")) return "Greed";
    return "Neutral";
}

function getClassificationColor(classification: string): string {
    const lower = classification.toLowerCase();
    if (lower.includes("extreme fear") || lower.includes("fear")) return "text-bearish";
    if (lower.includes("extreme greed") || lower.includes("greed")) return "text-bullish";
    return "text-neutral";
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
        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-[var(--border-subtle)]">
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

function SkeletonCard() {
    return (
        <div className="p-5 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] animate-pulse">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded bg-[var(--border-default)]" />
                <div className="w-20 h-4 rounded bg-[var(--border-default)]" />
            </div>
            <div className="w-16 h-10 rounded bg-[var(--border-default)] mb-2" />
            <div className="w-12 h-4 rounded bg-[var(--border-default)]" />
        </div>
    );
}

export function DashboardContent() {
    const locale = useLocale();
    const t = useTranslations("dashboard");
    const [activeChart, setActiveChart] = useState("SPX");

    const { data, isLoading } = useSWR<MarketApiData>("/api/market-data", fetcher, {
        refreshInterval: 300_000,
        revalidateOnFocus: false,
        dedupingInterval: 60_000,
    });

    const fearGreed = data?.fearGreed;
    const vix = data?.vix;
    const treasury = data?.treasury;
    const hasAnyMarketData = fearGreed || vix || treasury;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-content mx-auto">
                    {/* Hero */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {t("title")}
                                </h1>
                                <p className="text-sm text-[var(--text-tertiary)]">{t("subtitle")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Market Data Cards — only show cards with real API data */}
                    {(isLoading || hasAnyMarketData) && (
                        <div className={`grid grid-cols-1 gap-4 mb-10 ${[fearGreed, vix, treasury].filter(Boolean).length === 1 ? "md:grid-cols-1 max-w-md" :
                                [fearGreed, vix, treasury].filter(Boolean).length === 2 ? "md:grid-cols-2 max-w-2xl" :
                                    "md:grid-cols-3"
                            }`}>
                            {isLoading && !data ? (
                                <>
                                    <SkeletonCard />
                                    <SkeletonCard />
                                    <SkeletonCard />
                                </>
                            ) : (
                                <>
                                    {/* Fear & Greed — SVG Gauge */}
                                    {fearGreed && (
                                        <div className="p-5 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] signal-neutral flex flex-col items-center">
                                            <div className="flex items-center gap-2 mb-3 self-start">
                                                <Activity className="w-4 h-4 text-neutral" />
                                                <span className="text-sm text-[var(--text-secondary)]">{t("fearGreed")}</span>
                                            </div>
                                            <FearGreedGauge value={fearGreed.value} />
                                            <p className="text-3xl font-bold font-data text-white mt-2">{fearGreed.value}</p>
                                            <p className={`text-sm font-data mt-1 ${getClassificationColor(fearGreed.classification)}`}>
                                                {getClassificationLabel(fearGreed.classification)}
                                            </p>
                                        </div>
                                    )}
                                    {/* VIX */}
                                    {vix && (
                                        <div className={`p-5 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] ${vix.value < 15 ? "signal-bullish" : vix.value < 25 ? "signal-neutral" : "signal-bearish"}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingDown className={`w-4 h-4 ${vix.value < 15 ? "text-bullish" : vix.value < 25 ? "text-neutral" : "text-bearish"}`} />
                                                <span className="text-sm text-[var(--text-secondary)]">VIX</span>
                                            </div>
                                            <p className="text-4xl font-bold font-data text-white">{vix.value.toFixed(1)}</p>
                                            <p className={`text-sm font-data mt-1 ${vix.change < 0 ? "text-bullish" : "text-bearish"}`}>
                                                {vix.change >= 0 ? "▲" : "▼"} {vix.change >= 0 ? "+" : ""}{vix.change.toFixed(1)}%
                                            </p>
                                        </div>
                                    )}
                                    {/* 10Y Yield */}
                                    {treasury && (
                                        <div className="p-5 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] signal-neutral">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="w-4 h-4 text-neutral" />
                                                <span className="text-sm text-[var(--text-secondary)]">10Y Yield</span>
                                            </div>
                                            <p className="text-4xl font-bold font-data text-white">{treasury.value.toFixed(2)}%</p>
                                            <p className="text-sm font-data text-neutral mt-1">Daily</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* TradingView Chart Area — real embeds, always available */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
                            {tvTabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveChart(tab)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeChart === tab
                                        ? "bg-accent/20 text-accent border border-accent/30"
                                        : "bg-[var(--bg-wash)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-wash)]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <TradingViewChart symbol={activeChart} />
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/${locale}/switchboard`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cv-elevated border border-[var(--border-subtle)] text-sm text-accent hover:border-accent/30 transition-colors group"
                        >
                            <Target className="w-4 h-4" />
                            {t("viewSwitchboard")}
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href={`/${locale}/bold-calls`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cv-elevated border border-[var(--border-subtle)] text-sm text-accent hover:border-accent/30 transition-colors group"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            {t("viewBoldCalls")}
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-[var(--text-ghost)] mt-10 leading-relaxed">
                        {t("disclaimer")}
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
