"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { BarChart3, ArrowRight, Info, AlertCircle } from "lucide-react";

type Signal = "bullish" | "bearish" | "neutral";

interface SwitchboardAsset {
    symbol: string;
    name: string;
    signal: Signal;
    analysis: string;
}

const switchboardData: SwitchboardAsset[] = [
    {
        symbol: "SPX",
        name: "S&P 500",
        signal: "bullish",
        analysis: "Holding above 20-day MA. Breadth improving. Risk-on bias maintained.",
    },
    {
        symbol: "BTC",
        name: "Bitcoin",
        signal: "bearish",
        analysis: "Rejected at psychological level. Funding rates elevated. Watch key support.",
    },
    {
        symbol: "Gold",
        name: "Gold",
        signal: "neutral",
        analysis: "Consolidating near ATH. Central bank buying continues.",
    },
    {
        symbol: "10Y",
        name: "10Y Yield",
        signal: "bullish",
        analysis: "Rising yields but orderly. Curve steepening.",
    },
    {
        symbol: "DXY",
        name: "US Dollar",
        signal: "bullish",
        analysis: "Strong trend. Rate differential widening. Headwind for EM and commodities.",
    },
    {
        symbol: "Oil",
        name: "Crude Oil",
        signal: "bearish",
        analysis: "Demand concerns outweighing supply cuts.",
    },
    {
        symbol: "VIX",
        name: "VIX",
        signal: "bullish",
        analysis: "Low vol environment. Term structure in contango. Risk-on signal.",
    },
    {
        symbol: "KOSPI",
        name: "KOSPI",
        signal: "neutral",
        analysis: "Sideways range. Foreign flows mixed. Earnings key catalyst.",
    },
];

const signalConfig: Record<Signal, { label: string; color: string; bg: string; dot: string; border: string }> = {
    bullish: { label: "Risk-On", color: "text-bullish", bg: "bg-bullish/10", dot: "bg-bullish shadow-[0_0_8px_rgba(0,200,81,0.5)]", border: "signal-bullish" },
    bearish: { label: "Risk-Off", color: "text-bearish", bg: "bg-bearish/10", dot: "bg-bearish shadow-[0_0_8px_rgba(255,59,59,0.5)]", border: "signal-bearish" },
    neutral: { label: "Neutral", color: "text-neutral", bg: "bg-neutral/10", dot: "bg-neutral shadow-[0_0_8px_rgba(255,165,0,0.5)]", border: "signal-neutral" },
};

/* Risk score: bullish=+1, bearish=-1, neutral=0, normalize to 0-100 */
function computeRiskScore(data: SwitchboardAsset[]): number {
    let raw = 0;
    data.forEach((a) => {
        if (a.signal === "bullish") raw += 1;
        else if (a.signal === "bearish") raw -= 1;
    });
    // raw range: [-N, +N] with N = data.length
    // normalize to 0-100: 50 is neutral
    return Math.round(50 + (raw / data.length) * 50);
}

function getRiskLabel(score: number): string {
    if (score <= 30) return "Risk-Off";
    if (score <= 45) return "Cautious";
    if (score <= 55) return "Neutral";
    if (score <= 70) return "Risk-On";
    return "Strong Risk-On";
}

function getRiskColor(score: number): string {
    if (score <= 30) return "#ff3b3b";
    if (score <= 45) return "#ff8c00";
    if (score <= 55) return "#ffa500";
    if (score <= 70) return "#7ec850";
    return "#00c851";
}

function getRiskInsight(counts: { bullish: number; bearish: number; neutral: number }): string {
    if (counts.bullish > counts.bearish + counts.neutral) {
        return "Broad risk-on sentiment across asset classes. Equities and DXY leading. Watch for complacency signals in VIX.";
    } else if (counts.bearish > counts.bullish) {
        return "Risk-off signals dominating. Defensive positioning recommended. Monitor support levels closely.";
    }
    return "Mixed signals across the board. Selective positioning preferred. Key levels and catalysts will determine direction.";
}

/* SVG gauge for Risk Meter */
function RiskGauge({ score }: { score: number }) {
    const clampedScore = Math.min(100, Math.max(0, score));
    const angle = 180 + (clampedScore / 100) * 180; // SVG Y-down: 180°=left → 270°=up → 360°=right
    const color = getRiskColor(score);

    return (
        <svg viewBox="0 0 200 110" className="w-full max-w-[280px]">
            {/* Background arc */}
            <path
                d="M 15 100 A 85 85 0 0 1 185 100"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="12"
                strokeLinecap="round"
            />
            {/* Colored arc segment */}
            <path
                d="M 15 100 A 85 85 0 0 1 185 100"
                fill="none"
                stroke="url(#riskGaugeGrad)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="267"
                strokeDashoffset={267 - (clampedScore / 100) * 267}
                className="transition-all duration-1000 ease-out"
            />
            {/* Needle */}
            <line
                x1="100"
                y1="100"
                x2={100 + 65 * Math.cos((angle * Math.PI) / 180)}
                y2={100 + 65 * Math.sin((angle * Math.PI) / 180)}
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
            />
            {/* Center dot */}
            <circle cx="100" cy="100" r="5" fill={color} />
            {/* Score text */}
            <text x="100" y="88" textAnchor="middle" className="text-3xl font-bold font-data" fill="white" fontSize="28">
                {score}
            </text>
            {/* Label */}
            <text x="100" y="70" textAnchor="middle" fill={color} fontSize="10" fontWeight="600">
                {getRiskLabel(score)}
            </text>
            {/* Scale labels */}
            <text x="15" y="108" textAnchor="start" fill="rgba(255,255,255,0.2)" fontSize="8">0</text>
            <text x="185" y="108" textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="8">100</text>
            <defs>
                <linearGradient id="riskGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
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

export function SwitchboardContent() {
    const locale = useLocale();
    const t = useTranslations("switchboard");
    const heroRef = useGsapScroll<HTMLDivElement>();
    const gridRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.08 });
    const legendRef = useGsapScroll<HTMLDivElement>();

    const counts = {
        bullish: switchboardData.filter((a) => a.signal === "bullish").length,
        bearish: switchboardData.filter((a) => a.signal === "bearish").length,
        neutral: switchboardData.filter((a) => a.signal === "neutral").length,
    };

    const riskScore = computeRiskScore(switchboardData);
    const insight = getRiskInsight(counts);

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-content mx-auto">
                    {/* Hero */}
                    <div ref={heroRef} className="mb-10">
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
                        <p className="text-sm text-white/50 mt-3 max-w-2xl">{t("description")}</p>
                        <p className="text-xs text-white/30 mt-2">{t("week")}</p>
                    </div>

                    {/* TTL Risk Meter */}
                    <div className="p-6 rounded-2xl bg-cv-elevated border border-gold/10 mb-10">
                        <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4 text-center">
                            TTL Risk Meter
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-shrink-0">
                                <RiskGauge score={riskScore} />
                            </div>
                            <div className="flex-1">
                                <div className="flex gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-bullish shadow-[0_0_6px_rgba(0,200,81,0.5)]" />
                                        <span className="text-sm font-data text-bullish">{counts.bullish} Risk-On</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-bearish shadow-[0_0_6px_rgba(255,59,59,0.5)]" />
                                        <span className="text-sm font-data text-bearish">{counts.bearish} Risk-Off</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-neutral shadow-[0_0_6px_rgba(255,165,0,0.5)]" />
                                        <span className="text-sm font-data text-neutral">{counts.neutral} Neutral</span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/50 leading-relaxed">
                                    <strong className="text-white/70">Key Insight:</strong> {insight}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How to Read Signals — Legend (always visible) */}
                    <div className="p-5 rounded-xl bg-cv-elevated border border-gold/10 mb-10">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 text-gold" />
                            <h3 className="text-sm font-semibold text-white/70">{t("legendTitle")}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/40">
                            <div className="flex items-start gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-bullish mt-0.5 shrink-0" />
                                <span><strong className="text-bullish">Risk-On:</strong> {t("legendBullish")}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-bearish mt-0.5 shrink-0" />
                                <span><strong className="text-bearish">Risk-Off:</strong> {t("legendBearish")}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-neutral mt-0.5 shrink-0" />
                                <span><strong className="text-neutral">Neutral:</strong> {t("legendNeutral")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Bar */}
                    <MovingBorder className="p-4 mb-10" borderColor="rgba(255,165,0,0.2)" duration={8}>
                        <div className="flex flex-wrap items-center gap-6">
                            <span className="text-sm text-white/50">{t("summary")}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-bullish shadow-[0_0_6px_rgba(0,200,81,0.5)]" />
                                <span className="text-sm font-data text-bullish">{counts.bullish} {t("riskOn")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-bearish shadow-[0_0_6px_rgba(255,59,59,0.5)]" />
                                <span className="text-sm font-data text-bearish">{counts.bearish} {t("riskOff")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-neutral shadow-[0_0_6px_rgba(255,165,0,0.5)]" />
                                <span className="text-sm font-data text-neutral">{counts.neutral} {t("neutralLabel")}</span>
                            </div>
                        </div>
                    </MovingBorder>

                    {/* Signal Grid */}
                    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {switchboardData.map((asset) => {
                            const cfg = signalConfig[asset.signal];
                            return (
                                <TiltCard key={asset.symbol}>
                                    <div className={`p-5 rounded-xl bg-cv-elevated border border-white/5 h-full ${cfg.border}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${cfg.dot} animate-glow-pulse`} />
                                                <div>
                                                    <span className="text-xs text-white/40 uppercase tracking-wider">{asset.symbol}</span>
                                                    <p className="text-sm text-white/70">{asset.name}</p>
                                                </div>
                                            </div>
                                            <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                                                {cfg.label}
                                            </span>
                                        </div>



                                        <p className="text-xs text-white/40 leading-relaxed">{asset.analysis}</p>
                                    </div>
                                </TiltCard>
                            );
                        })}
                    </div>


                    {/* CTA */}
                    <Link
                        href={`/${locale}/dashboard`}
                        className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors group"
                    >
                        {t("backToDashboard")}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>

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
