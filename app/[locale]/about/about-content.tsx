"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionReveal } from "@/components/ui/section-reveal";
import { BarChart3, Target, Newspaper, Users, ArrowRight } from "lucide-react";
import { XIcon, ThreadsIcon, TelegramIcon, KakaoIcon } from "@/lib/social-icons";

const socialLinksEn = [
    { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X" },
    { href: "https://www.threads.com/@_trantradinglab_", icon: <ThreadsIcon />, label: "Threads" },
    { href: "https://t.me/TranTradingLabEN", icon: <TelegramIcon />, label: "Telegram EN" },
    { href: "https://t.me/TranTradingLabKR", icon: <TelegramIcon />, label: "Telegram KR" },
    { href: "https://invite.kakao.com/tc/luxHFht3xL", icon: <KakaoIcon />, label: "KakaoTalk" },
];

const socialLinksKo = [
    { href: "https://invite.kakao.com/tc/luxHFht3xL", icon: <KakaoIcon />, label: "KakaoTalk" },
    { href: "https://t.me/TranTradingLabKR", icon: <TelegramIcon />, label: "Telegram KR" },
    { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X" },
    { href: "https://www.threads.com/@_trantradinglab_", icon: <ThreadsIcon />, label: "Threads" },
    { href: "https://t.me/TranTradingLabEN", icon: <TelegramIcon />, label: "Telegram EN" },
];

export function AboutContent() {
    const locale = useLocale();
    const t = useTranslations("about");
    const socialLinks = locale === "ko" ? socialLinksKo : socialLinksEn;

    const services = [
        { icon: BarChart3, titleKey: "serviceAnalysis" as const, descKey: "serviceAnalysisDesc" as const },
        { icon: Target, titleKey: "serviceStrategy" as const, descKey: "serviceStrategyDesc" as const },
        { icon: Newspaper, titleKey: "serviceNews" as const, descKey: "serviceNewsDesc" as const },
    ];

    const stats = [
        { valueKey: "statMembers" as const, labelKey: "statMembersLabel" as const },
        { valueKey: "statContent" as const, labelKey: "statContentLabel" as const },
        { valueKey: "statYears" as const, labelKey: "statYearsLabel" as const },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                {/* Hero */}
                <section className="max-w-5xl mx-auto px-6 text-center py-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cv-elevated border border-[var(--border-default)] text-sm text-[var(--text-secondary)] mb-8">
                        <Users className="w-4 h-4" />
                        {t("badge")}
                    </div>
                    <h1 className="text-display text-[var(--text-primary)] mb-6">
                        {t("heroLine1")}
                        <br />
                        <span className="text-gradient-gold">{t("heroLine2")}</span>
                    </h1>
                    <p className="text-lg text-[var(--text-tertiary)] max-w-[680px] mx-auto leading-relaxed">
                        {t("heroDescription")}
                    </p>
                </section>

                {/* Stats */}
                <SectionReveal>
                    <section className="max-w-5xl mx-auto px-6 py-12">
                        <div className="grid grid-cols-3 gap-8">
                            {stats.map((stat) => (
                                <div key={stat.valueKey} className="text-center">
                                    <p className="text-3xl sm:text-4xl font-bold text-gradient-gold tabular-nums font-data mb-2">
                                        {t(stat.valueKey)}
                                    </p>
                                    <p className="text-sm text-[var(--text-tertiary)]">{t(stat.labelKey)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </SectionReveal>

                {/* Philosophy */}
                <SectionReveal>
                    <section className="max-w-5xl mx-auto px-6 py-24">
                        <div className="text-center">
                            <h2 className="text-overline text-[var(--text-muted)] mb-8">
                                {t("philosophyTitle")}
                            </h2>
                            <p className="text-display text-gradient-gold mb-8">
                                {t("philosophyQuote")}
                            </p>
                            <p className="text-lg text-[var(--text-tertiary)] max-w-[680px] mx-auto leading-relaxed">
                                {t("philosophyDesc")}
                            </p>
                        </div>
                    </section>
                </SectionReveal>

                {/* Services */}
                <SectionReveal>
                    <section className="max-w-5xl mx-auto px-6 py-16">
                        <h2 className="text-section text-[var(--text-primary)] text-center mb-16">
                            {t("servicesTitle")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.titleKey} className="p-6 md:p-8 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] text-center transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--border-default)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                                    <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                                        <service.icon className="w-6 h-6 text-accent" />
                                    </div>
                                    <h3 className="text-card-title text-[var(--text-primary)] mb-3">
                                        {t(service.titleKey)}
                                    </h3>
                                    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
                                        {t(service.descKey)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </SectionReveal>

                {/* Mission */}
                <SectionReveal>
                    <section className="max-w-5xl mx-auto px-6 py-16">
                        <div className="p-8 md:p-12 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] border-l-4 border-l-accent/40">
                            <h2 className="text-section text-[var(--text-primary)] mb-6">
                                {t("missionTitle")}
                            </h2>
                            <p className="text-[var(--text-tertiary)] leading-relaxed mb-4 max-w-[680px]">
                                {t("missionP1")}
                            </p>
                            <p className="text-[var(--text-tertiary)] leading-relaxed max-w-[680px]">
                                {t("missionP2")}
                            </p>
                        </div>
                    </section>
                </SectionReveal>

                {/* Social Links */}
                <SectionReveal>
                    <section className="max-w-5xl mx-auto px-6 py-12 text-center">
                        <h2 className="text-overline text-[var(--text-muted)] mb-8">
                            {t("connectTitle")}
                        </h2>
                        <div className="flex justify-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative w-11 h-11 rounded-xl bg-[var(--bg-wash)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-accent hover:border-[var(--border-strong)] hover:scale-110 transition-all duration-200"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-cv-surface text-[10px] text-[var(--text-secondary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {social.label}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </section>
                </SectionReveal>

                {/* CTA */}
                <SectionReveal>
                    <section className="max-w-5xl mx-auto px-6 py-16 text-center">
                        <h2 className="text-section text-[var(--text-primary)] mb-4">
                            {t("ctaTitle")}
                        </h2>
                        <p className="text-[var(--text-tertiary)] mb-10">
                            {t("ctaDescription")}
                        </p>
                        <Link
                            href={`/${locale}/community`}
                            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-[#0a0a0f] font-semibold transition-all duration-200 hover:brightness-110 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            {t("ctaButton")}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </section>
                </SectionReveal>
            </main>
            <Footer />
        </>
    );
}
