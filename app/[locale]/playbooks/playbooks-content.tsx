"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { GraduationCap, ArrowRight, CheckCircle2, Clock } from "lucide-react";

export function PlaybooksContent() {
    const locale = useLocale();
    const t = useTranslations("playbooks");
    const tc = useTranslations("common");
    const heroRef = useGsapScroll<HTMLDivElement>();
    const gridRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.1 });

    const modules = [
        { id: "smc-101", titleKey: "smcTitle", descKey: "smcDesc", topicsKey: "smcTopics", lessons: 5, duration: "45min", available: true },
        { id: "order-block", titleKey: "obTitle", descKey: "obDesc", topicsKey: "obTopics", lessons: 4, duration: "40min", available: true },
        { id: "fvg-mastery", titleKey: "fvgTitle", descKey: "fvgDesc", topicsKey: "fvgTopics", lessons: 4, duration: "35min", available: true },
        { id: "liquidity", titleKey: "liquidityTitle", descKey: "liquidityDesc", topicsKey: "liquidityTopics", lessons: 5, duration: "50min", available: false },
        { id: "orb-strategy", titleKey: "orbTitle", descKey: "orbDesc", topicsKey: "orbTopics", lessons: 6, duration: "55min", available: true },
        { id: "risk-management", titleKey: "riskTitle", descKey: "riskDesc", topicsKey: "riskTopics", lessons: 4, duration: "30min", available: true },
    ] as const;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <div ref={heroRef} className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <GraduationCap className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
                        <p className="text-lg text-white/40 max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Modules Grid */}
                    <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((module) => {
                            const topics = t.raw(module.topicsKey) as string[];
                            return (
                                <TiltCard key={module.id}>
                                    <div className="p-6 rounded-xl bg-cv-elevated border border-white/5 card-hover border-glow h-full flex flex-col">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-white/90">
                                                {t(module.titleKey)}
                                            </h3>
                                            {module.available ? (
                                                <span className="px-2 py-1 rounded text-xs bg-bullish/10 text-bullish shrink-0">{tc("free")}</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded text-xs bg-white/5 text-white/30 flex items-center gap-1 shrink-0">
                                                    <Clock className="w-3 h-3" /> {tc("preparing")}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-white/40 mb-4">{t(module.descKey)}</p>
                                        <div className="flex items-center gap-3 text-xs text-white/30 mb-4">
                                            <span>{module.lessons}{tc("lessons")}</span>
                                            <span className="text-white/10">|</span>
                                            <span>{module.duration}</span>
                                        </div>
                                        <div className="space-y-1.5 mb-5 flex-1">
                                            {topics.slice(0, 3).map((topic) => (
                                                <div key={topic} className="flex items-center gap-2 text-sm text-white/50">
                                                    <CheckCircle2 className="w-3 h-3 text-gold shrink-0" />
                                                    {topic}
                                                </div>
                                            ))}
                                            {topics.length > 3 && (
                                                <div className="text-sm text-white/30">
                                                    +{topics.length - 3}{tc("more")}
                                                </div>
                                            )}
                                        </div>
                                        {module.available ? (
                                            <Link
                                                href={`/${locale}/playbooks/${module.id}`}
                                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all bg-gold/10 text-gold hover:bg-gold/20"
                                            >
                                                {tc("startLearning")}
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium bg-white/5 text-white/30 cursor-not-allowed">
                                                {tc("contentPreparing")}
                                            </div>
                                        )}
                                    </div>
                                </TiltCard>
                            );
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
