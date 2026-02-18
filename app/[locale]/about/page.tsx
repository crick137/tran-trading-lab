"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { BarChart3, Target, Newspaper, Users, ArrowRight } from "lucide-react";

export default function AboutPage() {
    const locale = useLocale();
    const t = useTranslations("about");
    const heroRef = useGsapScroll<HTMLDivElement>();
    const statsRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.1 });
    const servicesRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.12 });
    const missionRef = useGsapScroll<HTMLDivElement>();
    const ctaRef = useGsapScroll<HTMLDivElement>();

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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cv-elevated border border-white/10 text-sm text-white/50 mb-8">
                        <Users className="w-4 h-4" />
                        {t("badge")}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        {t("heroLine1")}
                        <br />
                        <span className="text-gradient-gold">{t("heroLine2")}</span>
                    </h1>
                    <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
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
                                <p className="text-sm text-white/40">{t(stat.labelKey)}</p>
                            </div>
                        ))}
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
                                <div className="p-6 rounded-xl bg-cv-elevated border border-white/5 text-center h-full card-hover border-glow">
                                    <div className="w-12 h-12 mx-auto rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                                        <service.icon className="w-6 h-6 text-gold" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white/90 mb-2">
                                        {t(service.titleKey)}
                                    </h3>
                                    <p className="text-sm text-white/40 leading-relaxed">
                                        {t(service.descKey)}
                                    </p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </section>

                {/* Mission */}
                <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16" ref={missionRef}>
                    <div className="p-8 rounded-2xl bg-cv-elevated border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {t("missionTitle")}
                        </h2>
                        <p className="text-white/40 leading-relaxed mb-6">
                            {t("missionP1")}
                        </p>
                        <p className="text-white/40 leading-relaxed">
                            {t("missionP2")}
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center" ref={ctaRef}>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {t("ctaTitle")}
                    </h2>
                    <p className="text-white/40 mb-8">
                        {t("ctaDescription")}
                    </p>
                    <Link
                        href={`/${locale}/community`}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-cv-primary font-semibold transition-all hover:shadow-lg hover:shadow-gold/20"
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
