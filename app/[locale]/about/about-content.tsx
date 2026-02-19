"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { BarChart3, Target, Newspaper, Users, ArrowRight } from "lucide-react";
import { XIcon, ThreadsIcon, TelegramIcon, KakaoIcon } from "@/lib/social-icons";

const socialLinksEn = [
    { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X", hoverColor: "hover:text-white" },
    { href: "https://www.threads.com/@_trantradinglab_", icon: <ThreadsIcon />, label: "Threads", hoverColor: "hover:text-white" },
    { href: "https://t.me/TranTradingLabEN", icon: <TelegramIcon />, label: "Telegram EN", hoverColor: "hover:text-[#26A5E4]" },
    { href: "https://t.me/TranTradingLabKR", icon: <TelegramIcon />, label: "Telegram KR", hoverColor: "hover:text-[#26A5E4]" },
    { href: "https://invite.kakao.com/tc/luxHFht3xL", icon: <KakaoIcon />, label: "KakaoTalk", hoverColor: "hover:text-[#FEE500]" },
];

const socialLinksKo = [
    { href: "https://invite.kakao.com/tc/luxHFht3xL", icon: <KakaoIcon />, label: "KakaoTalk", hoverColor: "hover:text-[#FEE500]" },
    { href: "https://t.me/TranTradingLabKR", icon: <TelegramIcon />, label: "Telegram KR", hoverColor: "hover:text-[#26A5E4]" },
    { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X", hoverColor: "hover:text-white" },
    { href: "https://www.threads.com/@_trantradinglab_", icon: <ThreadsIcon />, label: "Threads", hoverColor: "hover:text-white" },
    { href: "https://t.me/TranTradingLabEN", icon: <TelegramIcon />, label: "Telegram EN", hoverColor: "hover:text-[#26A5E4]" },
];

export function AboutContent() {
    const locale = useLocale();
    const t = useTranslations("about");
    const heroRef = useGsapScroll<HTMLDivElement>();
    const statsRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.1 });
    const servicesRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.12 });
    const philosophyRef = useGsapScroll<HTMLDivElement>();
    const missionRef = useGsapScroll<HTMLDivElement>();
    const socialRef = useGsapScroll<HTMLDivElement>();
    const ctaRef = useGsapScroll<HTMLDivElement>();

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
                <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center py-16" ref={heroRef}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cv-elevated border border-[var(--border-default)] text-sm text-[var(--text-secondary)] mb-8">
                        <Users className="w-4 h-4" />
                        {t("badge")}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        {t("heroLine1")}
                        <br />
                        <span className="text-gradient-gold">{t("heroLine2")}</span>
                    </h1>
                    <p className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto leading-relaxed">
                        {t("heroDescription")}
                    </p>
                </section>

                {/* Stats */}
                <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div ref={statsRef} className="grid grid-cols-3 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.valueKey} className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold text-gradient-gold font-data mb-2">
                                    {t(stat.valueKey)}
                                </p>
                                <p className="text-sm text-[var(--text-tertiary)]">{t(stat.labelKey)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Philosophy */}
                <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16" ref={philosophyRef}>
                    <div className="text-center">
                        <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-8">
                            {t("philosophyTitle")}
                        </h2>
                        <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gradient-gold tracking-tight mb-6">
                            {t("philosophyQuote")}
                        </p>
                        <p className="text-lg text-[var(--text-tertiary)] max-w-xl mx-auto leading-relaxed">
                            {t("philosophyDesc")}
                        </p>
                    </div>
                </section>

                {/* Services */}
                <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-2xl font-bold text-white text-center mb-12">
                        {t("servicesTitle")}
                    </h2>
                    <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <TiltCard key={service.titleKey}>
                                <div className="p-6 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] text-center h-full card-hover border-glow">
                                    <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                                        <service.icon className="w-6 h-6 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                                        {t(service.titleKey)}
                                    </h3>
                                    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
                                        {t(service.descKey)}
                                    </p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </section>

                {/* Mission */}
                <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16" ref={missionRef}>
                    <div className="p-8 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] border-l-4 border-l-accent/40">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {t("missionTitle")}
                        </h2>
                        <p className="text-[var(--text-tertiary)] leading-relaxed mb-6">
                            {t("missionP1")}
                        </p>
                        <p className="text-[var(--text-tertiary)] leading-relaxed">
                            {t("missionP2")}
                        </p>
                    </div>
                </section>

                {/* Social Links */}
                <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center" ref={socialRef}>
                    <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-6">
                        {t("connectTitle")}
                    </h2>
                    <div className="flex justify-center gap-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group relative w-12 h-12 rounded-xl bg-[var(--bg-wash)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-tertiary)] ${social.hoverColor} hover:border-[var(--border-strong)] hover:bg-[var(--border-default)] hover:scale-110 hover:shadow-md transition-all duration-200`}
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

                {/* CTA */}
                <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center" ref={ctaRef}>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {t("ctaTitle")}
                    </h2>
                    <p className="text-[var(--text-tertiary)] mb-8">
                        {t("ctaDescription")}
                    </p>
                    <Link
                        href={`/${locale}/community`}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-cv-primary font-semibold transition-all hover:shadow-lg hover:shadow-accent/20"
                        style={{ background: "var(--gradient-cta)" }}
                    >
                        {t("ctaButton")}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>
            </main>
            <Footer />
        </>
    );
}
