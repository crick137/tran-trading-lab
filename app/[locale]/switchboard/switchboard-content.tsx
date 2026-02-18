"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { BarChart3, ArrowRight, Info } from "lucide-react";

type Signal = "bullish" | "bearish" | "neutral";

interface SwitchboardAsset {
    symbol: string;
    name: string;
    price: string;
    change: string;
    signal: Signal;
    analysis: string;
}

const switchboardData: SwitchboardAsset[] = [
    {
        symbol: "SPX",
        name: "S&P 500",
        price: "6,117",
        change: "+0.24%",
        signal: "bullish",
        analysis: "Holding above 20-day MA. Breadth improving. Risk-on bias maintained above 6,050.",
    },
    {
        symbol: "BTC",
        name: "Bitcoin",
        price: "95,432",
        change: "-1.20%",
        signal: "bearish",
        analysis: "Rejected at 100K psychological level. Funding rates elevated. Watch 90K support.",
    },
    {
        symbol: "Gold",
        name: "Gold",
        price: "2,931",
        change: "+0.50%",
        signal: "neutral",
        analysis: "Consolidating near ATH. Central bank buying continues. Range 2,880-2,960.",
    },
    {
        symbol: "10Y",
        name: "10Y Yield",
        price: "4.52%",
        change: "+2bp",
        signal: "bullish",
        analysis: "Rising yields but orderly. Watch 4.65% for equity pressure. Curve steepening.",
    },
    {
        symbol: "DXY",
        name: "US Dollar",
        price: "106.8",
        change: "+0.30%",
        signal: "bullish",
        analysis: "Strong above 106. Rate differential widening. Headwind for EM and commodities.",
    },
    {
        symbol: "Oil",
        name: "Crude Oil",
        price: "71.2",
        change: "-1.50%",
        signal: "bearish",
        analysis: "Demand concerns outweighing supply cuts. Break below 70 targets 65 zone.",
    },
    {
        symbol: "VIX",
        name: "VIX",
        price: "15.2",
        change: "-3.10%",
        signal: "bullish",
        analysis: "Low vol = complacency or calm? Below 16 is risk-on. Term structure in contango.",
    },
    {
        symbol: "KOSPI",
        name: "KOSPI",
        price: "2,612",
        change: "+0.30%",
        signal: "neutral",
        analysis: "Sideways between 2,550-2,680. Foreign flows mixed. Samsung earnings key catalyst.",
    },
];

const signalConfig: Record<Signal, { label: string; color: string; bg: string; dot: string; border: string }> = {
    bullish: { label: "Risk-On", color: "text-bullish", bg: "bg-bullish/10", dot: "bg-bullish shadow-[0_0_8px_rgba(0,200,81,0.5)]", border: "signal-bullish" },
    bearish: { label: "Risk-Off", color: "text-bearish", bg: "bg-bearish/10", dot: "bg-bearish shadow-[0_0_8px_rgba(255,59,59,0.5)]", border: "signal-bearish" },
    neutral: { label: "Neutral", color: "text-neutral", bg: "bg-neutral/10", dot: "bg-neutral shadow-[0_0_8px_rgba(255,165,0,0.5)]", border: "signal-neutral" },
};

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
                        <p className="text-xs text-white/30 mt-4">{t("week")}</p>
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
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                                                {cfg.label}
                                            </span>
                                        </div>

                                        <div className="flex items-end justify-between mb-3">
                                            <p className="text-2xl font-bold font-data text-white">{asset.price}</p>
                                            <p className={`text-sm font-data ${cfg.color}`}>
                                                {asset.change.startsWith("-") ? "▼" : "▲"} {asset.change}
                                            </p>
                                        </div>

                                        <p className="text-xs text-white/40 leading-relaxed">{asset.analysis}</p>
                                    </div>
                                </TiltCard>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div ref={legendRef} className="p-5 rounded-xl bg-cv-elevated border border-white/5 mb-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-white/40" />
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
