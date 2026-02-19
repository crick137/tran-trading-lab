"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Activity, TrendingDown, Percent } from "lucide-react";
import { Lamp } from "@/components/ui/aceternity/lamp";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import useSWR from "swr";

interface MarketData {
    fearGreed: { value: number; classification: string } | null;
    vix: { value: number; change: number } | null;
    treasury: { value: number } | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Fallback data in case API is down
const FALLBACK_DATA: MarketData = {
    fearGreed: { value: 62, classification: "Greed" },
    vix: { value: 15.2, change: -3.2 },
    treasury: { value: 4.52 },
};

function getEmoji(value: number): string {
    if (value <= 25) return "😨";
    if (value <= 45) return "😟";
    if (value <= 55) return "😐";
    if (value <= 75) return "😏";
    return "🤑";
}

function getSignal(classification: string): "bullish" | "bearish" | "neutral" {
    const lower = classification.toLowerCase();
    if (lower.includes("extreme fear") || lower.includes("fear")) return "bearish";
    if (lower.includes("extreme greed") || lower.includes("greed")) return "bullish";
    return "neutral";
}

function MiniSparkline({ signal }: { signal: string }) {
    const color = signal === "bullish" ? "var(--bullish)" : signal === "bearish" ? "var(--bearish)" : "var(--neutral)";
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

function SkeletonCard() {
    return (
        <div className="block p-6 rounded-xl bg-cv-elevated border border-white/5 animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white/10" />
                    <div className="w-20 h-4 rounded bg-white/10" />
                </div>
                <div className="w-6 h-6 rounded bg-white/10" />
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <div className="w-16 h-8 rounded bg-white/10 mb-2" />
                    <div className="w-12 h-4 rounded bg-white/10" />
                </div>
                <div className="w-20 h-6 rounded bg-white/5" />
            </div>
        </div>
    );
}

export function MarketPulse() {
    const locale = useLocale();
    const t = useTranslations("home");
    const gridRef = useGsapScroll<HTMLDivElement>({
        children: true,
        stagger: 0.1,
    });

    const { data, isLoading } = useSWR<MarketData>("/api/market-data", fetcher, {
        refreshInterval: 300_000,
        revalidateOnFocus: false,
        dedupingInterval: 60_000,
    });

    // Use API data → fallback data (never show "—")
    const resolved = data ?? (isLoading ? null : FALLBACK_DATA);
    const fearGreed = resolved?.fearGreed ?? FALLBACK_DATA.fearGreed;
    const vix = resolved?.vix ?? FALLBACK_DATA.vix;
    const treasury = resolved?.treasury ?? FALLBACK_DATA.treasury;

    const cards = [
        {
            id: "fear-greed",
            icon: Activity,
            value: fearGreed ? String(fearGreed.value) : "—",
            label: "Fear & Greed",
            change: fearGreed ? fearGreed.classification : "—",
            emoji: fearGreed ? getEmoji(fearGreed.value) : "📊",
            signal: fearGreed ? getSignal(fearGreed.classification) : ("neutral" as const),
        },
        {
            id: "vix",
            icon: TrendingDown,
            value: vix ? vix.value.toFixed(1) : "—",
            label: "VIX",
            change: vix ? `${vix.change >= 0 ? "▲" : "▼"} ${vix.change >= 0 ? "+" : ""}${vix.change.toFixed(1)}%` : "—",
            emoji: vix ? (vix.value < 15 ? "😌" : vix.value < 20 ? "😐" : vix.value < 30 ? "😟" : "😨") : "📊",
            signal: vix ? (vix.value < 15 ? "bullish" : vix.value < 25 ? "neutral" : "bearish") as "bullish" | "bearish" | "neutral" : "neutral" as const,
        },
        {
            id: "yield",
            icon: Percent,
            value: treasury ? `${treasury.value.toFixed(2)}%` : "—",
            label: "10Y Yield",
            change: treasury ? "Daily" : "—",
            emoji: "📈",
            signal: "neutral" as const,
        },
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto">
                <Lamp className="mb-8">
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider text-center">
                        {t("marketPulseTitle")}
                    </h2>
                </Lamp>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isLoading && !data ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : (
                        cards.map((card) => (
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
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
