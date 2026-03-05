"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionReveal } from "@/components/ui/section-reveal";
import { KitForm } from "@/components/ui/kit-form";
import { FileText, TrendingUp, Shield, CheckCircle } from "lucide-react";

export function SubscribeContent() {
    const locale = useLocale();
    const t = useTranslations("subscribe");

    const benefits = [
        { icon: FileText, textKey: "benefit1" as const },
        { icon: TrendingUp, textKey: "benefit2" as const },
        { icon: Shield, textKey: "benefit3" as const },
    ];

    const features = locale === "ko"
        ? ["매일 시장 브리핑", "주간 리서치 리포트", "인지 편향 분석", "KOSPI & 글로벌 마켓 인사이트", "트레이딩 교육 콘텐츠"]
        : ["Daily market briefings", "Weekly research reports", "Cognitive bias analysis", "KOSPI & global market insights", "Trading education content"];

    return (
        <>
            <Navbar />
            <main className="pt-16 pb-16">
                {/* Header */}
                <section className="border-b border-[var(--border-subtle)]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-400/10 text-green-400 border border-green-400/20 mb-6">
                            FREE
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                            {t("title")} <span className="text-gradient-gold">{t("titleHighlight")}</span>
                        </h1>
                        <p className="text-base text-[var(--text-tertiary)] max-w-[600px] mx-auto leading-relaxed">
                            {t("subtitle")}
                        </p>
                    </div>
                </section>

                {/* Benefits */}
                <SectionReveal>
                    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid md:grid-cols-3 gap-6">
                            {benefits.map((benefit) => (
                                <div key={benefit.textKey} className="p-6 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/20">
                                    <benefit.icon className="w-8 h-8 text-accent mb-4" />
                                    <p className="text-[var(--text-primary)] font-medium">{t(benefit.textKey)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </SectionReveal>

                {/* What you get + Form */}
                <SectionReveal>
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Feature list */}
                            <div className="p-6 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)]">
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                                    {locale === "ko" ? "무료로 받을 수 있는 것" : "What you get for free"}
                                </h2>
                                <ul className="space-y-3">
                                    {features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Form */}
                            <div className="p-6 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)]">
                                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">{t("ctaTitle")}</h2>
                                <p className="text-sm text-[var(--text-tertiary)] mb-6">{t("ctaSubtitle")}</p>
                                <KitForm />
                            </div>
                        </div>
                    </section>
                </SectionReveal>

                {/* Disclaimer */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8">
                    <p className="text-sm text-accent/60 font-medium">
                        {t("disclaimerMain")}
                    </p>
                    <p className="text-xs text-[var(--text-ghost)] mt-2">
                        {t("disclaimerSub")}
                    </p>
                </section>
            </main>
            <Footer />
        </>
    );
}
