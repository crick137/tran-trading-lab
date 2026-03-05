"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { BookOpen, GraduationCap, Target, ArrowRight, Layers, TrendingUp, Clock } from "lucide-react";

const moduleIcons = [Layers, Target, TrendingUp];

export function AcademyContent() {
    const locale = useLocale();
    const t = useTranslations("academy");
    const modules = [
        { id: "foundations", titleKey: "foundationsTitle", descKey: "foundationsDesc", topicsKey: "foundationsTopics", lessons: 8, durationKey: "foundationsDuration" },
        { id: "smc", titleKey: "smcTitle", descKey: "smcDesc", topicsKey: "smcTopics", lessons: 12, durationKey: "smcDuration" },
        { id: "advanced", titleKey: "advancedTitle", descKey: "advancedDesc", topicsKey: "advancedTopics", lessons: 10, durationKey: "advancedDuration" },
    ];

    const quickLinks = [
        { href: `/${locale}/playbooks`, labelKey: "linkPlaybooks", descKey: "linkPlaybooksDesc" },
        { href: `/${locale}/glossary`, labelKey: "linkGlossary", descKey: "linkGlossaryDesc" },
        { href: `/${locale}/tools`, labelKey: "linkTools", descKey: "linkToolsDesc" },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-16 pb-16 min-h-screen">
                {/* Compact header */}
                <section className="border-b border-[var(--border-subtle)]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cv-elevated border border-[var(--border-default)] text-sm text-[var(--text-secondary)] mb-6">
                            <GraduationCap className="w-4 h-4" />
                            {t("badge")}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-base text-[var(--text-tertiary)] max-w-[600px] mx-auto leading-relaxed">
                            {t("subtitle")}
                        </p>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Learning Path */}
                    <section className="py-12">
                        <h2 className="text-section text-[var(--text-primary)] mb-8 flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-accent" />
                            {t("learningPath")}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {modules.map((mod, index) => {
                                const Icon = moduleIcons[index];
                                const topics: string[] = t.raw(mod.topicsKey) as string[];
                                return (
                                    <TiltCard key={mod.id}>
                                        <div className="relative p-6 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] h-full">
                                            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-[#0a0a0f] font-bold flex items-center justify-center text-sm">
                                                {index + 1}
                                            </div>
                                            <Icon className="w-10 h-10 text-accent mb-4" />
                                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{t(mod.titleKey)}</h3>
                                            <p className="text-[var(--text-tertiary)] text-sm mb-4">{t(mod.descKey)}</p>
                                            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-4">
                                                <span className="flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3" />
                                                    {mod.lessons} {t("lessonsLabel")}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {t(mod.durationKey)}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                {topics.map((topic: string) => (
                                                    <div key={topic} className="text-sm text-[var(--text-tertiary)] flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-accent/50" />
                                                        {topic}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TiltCard>
                                );
                            })}
                        </div>
                    </section>

                    {/* Quick Links */}
                    <section className="py-12">
                        <h2 className="text-section text-[var(--text-primary)] mb-8">{t("quickLinks")}</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="p-4 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-all group flex items-center justify-between"
                                >
                                    <div>
                                        <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-accent transition-colors">
                                            {t(link.labelKey)}
                                        </h3>
                                        <p className="text-sm text-[var(--text-tertiary)]">{t(link.descKey)}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-[var(--text-ghost)] group-hover:text-accent transition-all group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center bg-cv-elevated border border-[var(--border-subtle)] rounded-2xl p-8 mb-12">
                        <h2 className="text-section text-[var(--text-primary)] mb-4">
                            {t("ctaTitle")}
                        </h2>
                        <p className="text-[var(--text-tertiary)] mb-6 max-w-xl mx-auto">
                            {t("ctaDesc")}
                        </p>
                        <a
                            href="https://t.me/TranTradingLabEN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[#0a0a0f] font-semibold transition-all hover:brightness-110 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            {t("ctaButton")}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        <p className="text-xs text-accent/60 font-medium mt-6">
                            {t("disclaimer")}
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
