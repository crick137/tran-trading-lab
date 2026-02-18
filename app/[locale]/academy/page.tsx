"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { BookOpen, GraduationCap, Target, ArrowRight, Layers, TrendingUp, Clock } from "lucide-react";

const moduleIcons = [Layers, Target, TrendingUp];

export default function AcademyPage() {
    const locale = useLocale();
    const t = useTranslations("academy");
    const heroRef = useGsapScroll<HTMLDivElement>();
    const modulesRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.12 });
    const linksRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.1 });
    const ctaRef = useGsapScroll<HTMLDivElement>();

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
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div ref={heroRef} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-6">
                            <GraduationCap className="w-4 h-4" />
                            {t("badge")}
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-lg text-white/40 max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Learning Path */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-gold" />
                            {t("learningPath")}
                        </h2>
                        <div ref={modulesRef} className="grid md:grid-cols-3 gap-6">
                            {modules.map((mod, index) => {
                                const Icon = moduleIcons[index];
                                const topics: string[] = t.raw(mod.topicsKey) as string[];
                                return (
                                    <TiltCard key={mod.id}>
                                        <div className="relative p-6 rounded-xl bg-cv-elevated border border-white/5 card-hover border-glow h-full">
                                            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gold text-cv-primary font-bold flex items-center justify-center text-sm">
                                                {index + 1}
                                            </div>
                                            <Icon className="w-10 h-10 text-gold mb-4" />
                                            <h3 className="text-xl font-bold text-white/90 mb-2">{t(mod.titleKey)}</h3>
                                            <p className="text-white/40 text-sm mb-4">{t(mod.descKey)}</p>
                                            <div className="flex items-center gap-4 text-xs text-white/30 mb-4">
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
                                                    <div key={topic} className="text-sm text-white/40 flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-gold/50" />
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
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-8">{t("quickLinks")}</h2>
                        <div ref={linksRef} className="grid md:grid-cols-3 gap-4">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="p-4 rounded-lg bg-cv-elevated border border-white/5 hover:border-gold/30 transition-all group flex items-center justify-between"
                                >
                                    <div>
                                        <h3 className="font-semibold text-white/90 group-hover:text-gold transition-colors">
                                            {t(link.labelKey)}
                                        </h3>
                                        <p className="text-sm text-white/40">{t(link.descKey)}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-gold transition-all group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section ref={ctaRef} className="text-center bg-cv-elevated border border-white/5 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {t("ctaTitle")}
                        </h2>
                        <p className="text-white/40 mb-6 max-w-xl mx-auto">
                            {t("ctaDesc")}
                        </p>
                        <a
                            href="https://t.me/TranTradingLabEN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg text-cv-primary font-semibold transition-all hover:shadow-xl hover:shadow-gold/30"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            {t("ctaButton")}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        <p className="text-xs text-gold/60 font-medium mt-6">
                            {t("disclaimer")}
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
