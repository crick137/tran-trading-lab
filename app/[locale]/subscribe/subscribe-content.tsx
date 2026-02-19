"use client";

import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionReveal } from "@/components/ui/section-reveal";
import { KitForm } from "@/components/ui/kit-form";
import { FileText, TrendingUp, Shield } from "lucide-react";

export function SubscribeContent() {
    const t = useTranslations("subscribe");
    const benefits = [
        { icon: FileText, textKey: "benefit1" as const },
        { icon: TrendingUp, textKey: "benefit2" as const },
        { icon: Shield, textKey: "benefit3" as const },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                {/* Hero */}
                <section className="max-w-5xl mx-auto px-6 text-center py-16">
                    <h1 className="text-display text-[var(--text-primary)] mb-4">
                        {t("title")} <span className="text-gradient-gold">{t("titleHighlight")}</span>
                    </h1>
                    <p className="text-lg text-[var(--text-tertiary)] max-w-[680px] mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </section>

                {/* Benefits */}
                <SectionReveal>
                    <section className="max-w-5xl mx-auto px-6 pb-16">
                        <div className="grid md:grid-cols-3 gap-6">
                            {benefits.map((benefit) => (
                                <div key={benefit.textKey} className="p-6 md:p-8 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--border-default)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                                    <benefit.icon className="w-8 h-8 text-accent mb-4" />
                                    <p className="text-[var(--text-primary)] font-medium">{t(benefit.textKey)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </SectionReveal>

                {/* Kit Newsletter Form */}
                <SectionReveal>
                    <section className="max-w-3xl mx-auto px-6 pb-16">
                        <div className="p-8 md:p-12 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)]">
                            <div className="text-center mb-8">
                                <h2 className="text-section text-[var(--text-primary)] mb-2">{t("ctaTitle")}</h2>
                                <p className="text-[var(--text-tertiary)]">{t("ctaSubtitle")}</p>
                            </div>
                            <KitForm />
                        </div>
                    </section>
                </SectionReveal>

                {/* Disclaimer */}
                <section className="max-w-5xl mx-auto px-6 text-center pb-16">
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
