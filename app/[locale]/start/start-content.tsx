"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { Rocket, TrendingUp, Globe, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

export function StartContent() {
    const locale = useLocale();
    const t = useTranslations("start");
    const paths = [
        {
            id: "beginner",
            icon: Rocket,
            title: t("beginnerTitle"),
            subtitle: t("beginnerSubtitle"),
            gradient: "from-bullish/10 to-transparent",
            border: "border-bullish/20 hover:border-bullish/40",
            steps: [
                { label: t("beginnerStep1"), href: `/${locale}/research` },
                { label: t("beginnerStep2"), href: `/${locale}/glossary` },
                { label: t("beginnerStep3"), href: `/${locale}/playbooks` },
                { label: t("beginnerStep4"), href: `/${locale}/community` },
            ],
        },
        {
            id: "trader",
            icon: TrendingUp,
            title: t("traderTitle"),
            subtitle: t("traderSubtitle"),
            gradient: "from-accent/10 to-transparent",
            border: "border-accent/20 hover:border-accent/40",
            steps: [
                { label: t("traderStep1"), href: `/${locale}/playbooks` },
                { label: t("traderStep2"), href: `/${locale}/tools` },
                { label: t("traderStep3"), href: `/${locale}/briefings` },
                { label: t("traderStep4"), href: `/${locale}/community` },
            ],
        },
        {
            id: "macro",
            icon: Globe,
            title: t("macroTitle"),
            subtitle: t("macroSubtitle"),
            gradient: "from-blue-500/10 to-transparent",
            border: "border-blue-500/20 hover:border-blue-500/40",
            steps: [
                { label: t("macroStep1"), href: `/${locale}/reports` },
                { label: t("macroStep2"), href: `/${locale}/blog` },
                { label: t("macroStep3"), href: `/${locale}/briefings` },
                { label: t("macroStep4"), href: `/${locale}/subscribe` },
            ],
        },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-display text-[var(--text-primary)] mb-4">
                            <span className="text-gradient-gold">{t("title")}</span>
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] max-w-[680px] mx-auto leading-relaxed">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Paths */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {paths.map((path) => (
                            <TiltCard key={path.id}>
                                <div className={`p-6 rounded-xl bg-gradient-to-b ${path.gradient} bg-cv-elevated border ${path.border} transition-colors h-full`}>
                                    <div className="w-14 h-14 rounded-lg bg-cv-surface flex items-center justify-center mb-4">
                                        <path.icon className="w-7 h-7 text-accent" />
                                    </div>
                                    <h2 className="text-card-title text-[var(--text-primary)] mb-1">{path.title}</h2>
                                    <p className="text-sm text-[var(--text-tertiary)] mb-6">{path.subtitle}</p>

                                    <div className="space-y-3">
                                        {path.steps.map((step, i) => (
                                            <Link
                                                key={i}
                                                href={step.href}
                                                className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
                                            >
                                                <span className="w-6 h-6 rounded-full bg-cv-surface border border-[var(--border-default)] flex items-center justify-center text-xs font-medium group-hover:border-accent/40 group-hover:text-accent transition-colors">
                                                    {i + 1}
                                                </span>
                                                {step.label}
                                                <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </TiltCard>
                        ))}
                    </div>

                    {/* What We Provide / Don't Provide */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-6 rounded-xl bg-cv-elevated border border-[var(--border-subtle)]">
                            <h3 className="text-card-title text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-bullish" />
                                {t("whatWeProvide")}
                            </h3>
                            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-bullish mt-0.5">✓</span>
                                        {t(`provide${i}`)}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 rounded-xl bg-cv-elevated border border-bearish/20">
                            <h3 className="text-card-title text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-bearish" />
                                {t("whatWeDoNotProvide")}
                            </h3>
                            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
                                {[1, 2, 3, 4].map((i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-bearish mt-0.5">✕</span>
                                        {t(`notProvide${i}`)}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-[var(--text-ghost)]">
                                {t("disclaimer")}
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <p className="text-[var(--text-tertiary)] mb-4">{t("readFirstReport")}</p>
                        <Link
                            href={`/${locale}/research`}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-[#0a0a0f] font-semibold transition-all hover:shadow-lg hover:shadow-accent/20"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            {t("viewSampleReport")}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
