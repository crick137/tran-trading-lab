"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { Target, Trophy, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

type CallStatus = "active" | "won" | "lost";

interface BoldCall {
    id: string;
    date: string;
    prediction: string;
    deadline: string;
    status: CallStatus;
    currentValue?: string;
    result?: string;
}

const boldCalls: BoldCall[] = [
    {
        id: "BC-047",
        date: "Feb 15, 2026",
        prediction: "SPX will NOT break 6,200 before March",
        deadline: "Mar 1, 2026",
        status: "active",
        currentValue: "SPX: 6,117",
    },
    {
        id: "BC-046",
        date: "Feb 10, 2026",
        prediction: "BTC will retest 90,000 before 110,000",
        deadline: "Mar 10, 2026",
        status: "active",
        currentValue: "BTC: 95,432",
    },
    {
        id: "BC-045",
        date: "Feb 3, 2026",
        prediction: "VIX will spike above 20 within 2 weeks",
        deadline: "Feb 17, 2026",
        status: "lost",
        result: "VIX stayed below 18. Low vol persisted.",
    },
    {
        id: "BC-044",
        date: "Jan 27, 2026",
        prediction: "Gold will break 2,900 by mid-February",
        deadline: "Feb 15, 2026",
        status: "won",
        result: "Gold hit 2,931 on Feb 12. Target achieved.",
    },
    {
        id: "BC-043",
        date: "Jan 20, 2026",
        prediction: "10Y yield will stay above 4.40% through January",
        deadline: "Jan 31, 2026",
        status: "won",
        result: "10Y closed at 4.48% on Jan 31. Call correct.",
    },
    {
        id: "BC-042",
        date: "Jan 13, 2026",
        prediction: "KOSPI will not reclaim 2,700 in January",
        deadline: "Jan 31, 2026",
        status: "won",
        result: "KOSPI peaked at 2,648. Stayed below target.",
    },
    {
        id: "BC-041",
        date: "Jan 6, 2026",
        prediction: "DXY will break 107 before end of January",
        deadline: "Jan 31, 2026",
        status: "lost",
        result: "DXY peaked at 106.9. Missed by 0.1.",
    },
    {
        id: "BC-040",
        date: "Dec 30, 2025",
        prediction: "Oil will drop below 70 in the first week of January",
        deadline: "Jan 7, 2026",
        status: "lost",
        result: "Oil held 70.8 support. Bounced to 72.",
    },
];

const statusConfig: Record<CallStatus, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    active: { icon: Clock, color: "text-gold", bg: "bg-gold/10", label: "Active" },
    won: { icon: CheckCircle, color: "text-bullish", bg: "bg-bullish/10", label: "Won" },
    lost: { icon: XCircle, color: "text-bearish", bg: "bg-bearish/10", label: "Lost" },
};

export default function BoldCallsPage() {
    const locale = useLocale();
    const t = useTranslations("boldCalls");
    const heroRef = useGsapScroll<HTMLDivElement>();
    const activeRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.1 });
    const historyRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.08 });

    const activeCalls = boldCalls.filter((c) => c.status === "active");
    const closedCalls = boldCalls.filter((c) => c.status !== "active");
    const wins = boldCalls.filter((c) => c.status === "won").length;
    const losses = boldCalls.filter((c) => c.status === "lost").length;
    const totalClosed = wins + losses;
    const winRate = totalClosed > 0 ? Math.round((wins / totalClosed) * 100) : 0;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-content mx-auto">
                    {/* Hero */}
                    <div ref={heroRef} className="mb-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                <Target className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {t("title")}
                                </h1>
                                <p className="text-sm text-white/40">{t("subtitle")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Banner */}
                    <MovingBorder className="p-5 mb-10" borderColor="rgba(255,165,0,0.25)" duration={8}>
                        <div className="flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-gold" />
                                <div>
                                    <p className="text-2xl font-bold font-data text-gold">{winRate}%</p>
                                    <p className="text-xs text-white/40">{t("winRate")}</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <p className="text-2xl font-bold font-data text-white">{boldCalls.length}</p>
                                <p className="text-xs text-white/40">{t("totalCalls")}</p>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <p className="text-2xl font-bold font-data text-bullish">{wins}</p>
                                <p className="text-xs text-white/40">{t("wins")}</p>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <p className="text-2xl font-bold font-data text-bearish">{losses}</p>
                                <p className="text-xs text-white/40">{t("losses")}</p>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <p className="text-2xl font-bold font-data text-gold">{activeCalls.length}</p>
                                <p className="text-xs text-white/40">{t("activeCalls")}</p>
                            </div>
                        </div>
                    </MovingBorder>

                    {/* Active Calls */}
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-5">
                        ⏳ {t("activeSection")}
                    </h2>
                    <div ref={activeRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {activeCalls.map((call) => {
                            const cfg = statusConfig[call.status];
                            return (
                                <TiltCard key={call.id}>
                                    <div className="p-5 rounded-xl bg-cv-elevated border border-gold/20 h-full">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-data text-white/30">{call.id}</span>
                                                <span className="text-xs text-white/20">|</span>
                                                <span className="text-xs text-white/30">{call.date}</span>
                                            </div>
                                            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                                                <cfg.icon className="w-3 h-3" />
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <p className="text-white/90 font-medium mb-3">
                                            &ldquo;{call.prediction}&rdquo;
                                        </p>
                                        <div className="flex flex-wrap gap-3 text-xs">
                                            <span className="text-white/30">{t("deadline")}: {call.deadline}</span>
                                            {call.currentValue && (
                                                <span className="text-white/30">{t("current")}: <span className="font-data text-white/60">{call.currentValue}</span></span>
                                            )}
                                        </div>
                                    </div>
                                </TiltCard>
                            );
                        })}
                    </div>

                    {/* Closed Calls */}
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-5">
                        📋 {t("historySection")}
                    </h2>
                    <div ref={historyRef} className="space-y-3 mb-12">
                        {closedCalls.map((call) => {
                            const cfg = statusConfig[call.status];
                            return (
                                <div
                                    key={call.id}
                                    className="p-4 rounded-xl bg-cv-elevated border border-white/5 flex flex-col sm:flex-row sm:items-center gap-3"
                                >
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                                            <cfg.icon className="w-3 h-3" />
                                            {cfg.label}
                                        </span>
                                        <span className="text-xs font-data text-white/30">{call.id}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white/80 truncate">&ldquo;{call.prediction}&rdquo;</p>
                                        {call.result && (
                                            <p className="text-xs text-white/40 mt-1">{call.result}</p>
                                        )}
                                    </div>

                                    <span className="text-xs text-white/20 shrink-0">{call.date}</span>
                                </div>
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
