"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Activity, TrendingDown, Percent } from "lucide-react";
import { Lamp } from "@/components/ui/aceternity/lamp";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

interface PulseCard {
    id: string;
    icon: React.ElementType;
    value: string;
    label: string;
    change: string;
    emoji: string;
    signal: "bullish" | "bearish" | "neutral";
}

const pulseData: PulseCard[] = [
    {
        id: "fear-greed",
        icon: Activity,
        value: "62",
        label: "Fear & Greed",
        change: "Greed",
        emoji: "😏",
        signal: "neutral",
    },
    {
        id: "vix",
        icon: TrendingDown,
        value: "15.2",
        label: "VIX",
        change: "▼ -3.2%",
        emoji: "😌",
        signal: "bullish",
    },
    {
        id: "yield",
        icon: Percent,
        value: "4.52%",
        label: "10Y Yield",
        change: "▲ +2bp",
        emoji: "📈",
        signal: "neutral",
    },
];

function MiniSparkline({ signal }: { signal: string }) {
    const color = signal === "bullish" ? "#00c851" : signal === "bearish" ? "#ff3b3b" : "#ffa500";
    return (
        <svg width="80" height="24" viewBox="0 0 80 24" className="opacity-40" aria-hidden="true">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                points="0,18 10,15 20,16 30,12 40,14 50,10 60,11 70,8 80,6"
            />
        </svg>
    );
}

export function MarketPulse() {
    const locale = useLocale();
    const t = useTranslations("home");
    const gridRef = useGsapScroll<HTMLDivElement>({
        children: true,
        stagger: 0.1,
    });

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto">
                <Lamp className="mb-8">
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider text-center">
                        {t("marketPulseTitle")}
                    </h2>
                </Lamp>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pulseData.map((card) => (
                        <TiltCard key={card.id}>
                            <Link
                                href={`/${locale}/dashboard`}
                                className={`block p-6 rounded-xl bg-cv-elevated border border-white/5 card-hover signal-${card.signal}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <card.icon className="w-4 h-4 text-white/40" />
                                        <span className="text-sm text-white/50">{card.label}</span>
                                    </div>
                                    <span className="text-lg">{card.emoji}</span>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-3xl font-bold font-data text-white">{card.value}</p>
                                        <p className={`text-sm font-data mt-1 ${card.signal === "bullish" ? "text-bullish" :
                                                card.signal === "bearish" ? "text-bearish" :
                                                    "text-neutral"
                                            }`}>
                                            {card.change}
                                        </p>
                                    </div>
                                    <MiniSparkline signal={card.signal} />
                                </div>
                            </Link>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
