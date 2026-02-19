"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, BarChart3 } from "lucide-react";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

interface SignalAsset {
    name: string;
    signal: "bullish" | "bearish" | "neutral";
}

const switchboardData: SignalAsset[] = [
    { name: "SPX", signal: "bullish" },
    { name: "BTC", signal: "bearish" },
    { name: "Gold", signal: "neutral" },
    { name: "10Y", signal: "bullish" },
    { name: "DXY", signal: "bullish" },
    { name: "Oil", signal: "bearish" },
    { name: "VIX", signal: "bullish" },
    { name: "KOSPI", signal: "neutral" },
];

function SignalDot({ signal }: { signal: string }) {
    const color = signal === "bullish" ? "bg-bullish" : signal === "bearish" ? "bg-bearish" : "bg-neutral";
    const glow = signal === "bullish" ? "shadow-[0_0_8px_rgba(0,200,81,0.5)]" :
        signal === "bearish" ? "shadow-[0_0_8px_rgba(255,59,59,0.5)]" :
            "shadow-[0_0_8px_rgba(255,165,0,0.5)]";
    return <div className={`w-2.5 h-2.5 rounded-full ${color} ${glow} animate-glow-pulse`} />;
}

function MiniRiskBar({ data }: { data: SignalAsset[] }) {
    const bullish = data.filter((a) => a.signal === "bullish").length;
    const bearish = data.filter((a) => a.signal === "bearish").length;
    const neutral = data.filter((a) => a.signal === "neutral").length;
    const total = data.length;

    // Risk score: 0 (all bearish) to 100 (all bullish)
    const score = Math.round(50 + ((bullish - bearish) / total) * 50);
    const label = score <= 30 ? "Risk-Off" : score <= 45 ? "Cautious" : score <= 55 ? "Neutral" : score <= 70 ? "Risk-On" : "Strong Risk-On";
    const barColor = score <= 30 ? "bg-bearish" : score <= 45 ? "bg-orange-400" : score <= 55 ? "bg-neutral" : score <= 70 ? "bg-lime-400" : "bg-bullish";

    return (
        <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40 uppercase tracking-wider">Risk Meter</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-data font-bold text-white/70">{score}</span>
                    <span className="text-[10px] text-white/30">/ 100</span>
                </div>
            </div>
            {/* Track */}
            <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                    className={`absolute left-0 top-0 h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${score}%` }}
                />
            </div>
            <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-bullish">{bullish} On</span>
                    <span className="text-bearish">{bearish} Off</span>
                    <span className="text-neutral">{neutral} Ntrl</span>
                </div>
                <span className="text-[10px] text-white/40 font-medium">{label}</span>
            </div>
        </div>
    );
}

export function SwitchboardPreview() {
    const locale = useLocale();
    const t = useTranslations("home");
    const sectionRef = useGsapScroll<HTMLDivElement>();

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto" ref={sectionRef}>
                <MovingBorder
                    className="p-6 md:p-8"
                    borderColor="rgba(255, 165, 0, 0.3)"
                    duration={6}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                {t("switchboardTitle")}
                            </h3>
                            <p className="text-xs text-white/40">{t("switchboardWeek")}</p>
                        </div>
                    </div>

                    {/* Mini Risk Meter */}
                    <MiniRiskBar data={switchboardData} />

                    {/* Signal Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {switchboardData.map((asset) => (
                            <div
                                key={asset.name}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5 transition-colors hover:bg-white/[0.04] hover:border-white/10"
                            >
                                <SignalDot signal={asset.signal} />
                                <span className="text-sm font-medium text-white/70">{asset.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <Link
                        href={`/${locale}/switchboard`}
                        className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors group"
                    >
                        {t("switchboardCta")}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </MovingBorder>
            </div>
        </section>
    );
}
