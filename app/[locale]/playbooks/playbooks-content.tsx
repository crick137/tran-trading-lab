"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { GraduationCap, ArrowRight, CheckCircle2, Clock } from "lucide-react";

export function PlaybooksContent() {
    const locale = useLocale();
    const t = useTranslations("playbooks");
    const tc = useTranslations("common");
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
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                            <GraduationCap className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-display text-[var(--text-primary)] mb-4">{t("title")}</h1>
                        <p className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Modules Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((module) => {
                            const topics = t.raw(module.topicsKey) as string[];
                            return (
                                <TiltCard key={module.id}>
                                    <div className={`p-6 rounded-xl bg-cv-elevated border card-hover border-glow h-full flex flex-col ${module.available ? "border-[var(--border-subtle)]" : "border-accent/10"
                                        }`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                                {t(module.titleKey)}
                                            </h3>
                                            {module.available ? (
                                                <span className="px-2 py-1 rounded text-xs bg-bullish/10 text-bullish shrink-0">{tc("free")}</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded text-xs bg-accent/10 text-accent/70 flex items-center gap-1 shrink-0">
                                                    <Clock className="w-3 h-3" /> {tc("preparing")}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[var(--text-tertiary)] mb-4">{t(module.descKey)}</p>
                                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4">
                                            <span>{module.lessons}{tc("lessons")}</span>
                                            <span className="text-[var(--text-ghost)]">|</span>
                                            <span>{module.duration}</span>
                                        </div>
                                        <div className="space-y-1.5 mb-5 flex-1">
                                            {topics.slice(0, 3).map((topic) => (
                                                <div key={topic} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                    <CheckCircle2 className="w-3 h-3 text-accent shrink-0" />
                                                    {topic}
                                                </div>
                                            ))}
                                            {topics.length > 3 && (
                                                <div className="text-sm text-[var(--text-muted)]">
                                                    +{topics.length - 3}{tc("more")}
                                                </div>
                                            )}
                                        </div>
                                        {module.available ? (
                                            <Link
                                                href={`/${locale}/playbooks/${module.id}`}
                                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all bg-accent/10 text-accent hover:bg-accent/20"
                                            >
                                                {tc("startLearning")}
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        ) : (
                                            <div className="relative overflow-hidden flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium bg-accent/5 text-accent/40 cursor-not-allowed">
                                                <Clock className="w-3.5 h-3.5" />
                                                {tc("contentPreparing")}
                                                {/* Shimmer overlay */}
                                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent animate-shimmer-slide" />
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
