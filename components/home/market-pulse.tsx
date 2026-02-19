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

interface CardData {
    id: string;
    icon: React.ElementType;
    value: string;
    label: string;
    change: string;
    signal: "bullish" | "bearish" | "neutral";
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

    // Build cards array — only include cards with real API data
    const cards: CardData[] = [];

    const fearGreed = data?.fearGreed;
    if (fearGreed) {
        cards.push({
            id: "fear-greed",
            icon: Activity,
            value: String(fearGreed.value),
            label: "Fear & Greed",
            change: fearGreed.classification,
            signal: getSignal(fearGreed.classification),
        });
    }

    const vix = data?.vix;
    if (vix) {
        cards.push({
            id: "vix",
            icon: TrendingDown,
            value: vix.value.toFixed(1),
            label: "VIX",
            change: `${vix.change >= 0 ? "▲" : "▼"} ${vix.change >= 0 ? "+" : ""}${vix.change.toFixed(1)}%`,
            signal: vix.value < 15 ? "bullish" : vix.value < 25 ? "neutral" : "bearish",
        });
    }

    const treasury = data?.treasury;
    if (treasury) {
        cards.push({
            id: "yield",
            icon: Percent,
            value: `${treasury.value.toFixed(2)}%`,
            label: "10Y Yield",
            change: "Daily",
            signal: "neutral",
        });
    }

    // If loading and no data yet, show skeletons
    // If loaded but no cards (all API calls returned null), hide the section entirely
    if (!isLoading && cards.length === 0) return null;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto">
                <Lamp className="mb-8">
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider text-center">
                        {t("marketPulseTitle")}
                    </h2>
                </Lamp>

                <div ref={gridRef} className={`grid grid-cols-1 gap-4 ${cards.length === 1 ? "md:grid-cols-1 max-w-md mx-auto" : cards.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto" : "md:grid-cols-3"}`}>
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
