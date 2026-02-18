"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { FileText, TrendingUp, Shield, Send, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SubscribePage() {
    const locale = useLocale();
    const t = useTranslations("subscribe");
    const heroRef = useGsapScroll<HTMLDivElement>();
    const benefitsRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.1 });
    const ctaRef = useGsapScroll<HTMLDivElement>();

    const benefits = [
        { icon: FileText, textKey: "benefit1" as const },
        { icon: TrendingUp, textKey: "benefit2" as const },
        { icon: Shield, textKey: "benefit3" as const },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <div ref={heroRef} className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            {t("title")} <span className="text-gradient-gold">{t("titleHighlight")}</span>
                        </h1>
                        <p className="text-lg text-white/40 max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Benefits */}
                    <div ref={benefitsRef} className="grid md:grid-cols-3 gap-6 mb-12">
                        {benefits.map((benefit) => (
                            <TiltCard key={benefit.textKey}>
                                <div className="p-6 rounded-xl bg-cv-elevated border border-white/5 card-hover border-glow h-full">
                                    <benefit.icon className="w-8 h-8 text-gold mb-4" />
                                    <p className="text-white/80 font-medium">{t(benefit.textKey)}</p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>

                    {/* Main CTA Card */}
                    <div ref={ctaRef} className="bg-cv-elevated border border-white/5 rounded-2xl p-8 mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">{t("ctaTitle")}</h2>
                            <p className="text-white/40">{t("ctaSubtitle")}</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 mb-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-bullish shrink-0" />
                                    <span className="text-white/50 text-sm">{t(`feature${i}`)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://t.me/TranTradingLabEN"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group px-8 py-4 rounded-lg text-cv-primary font-semibold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold/20"
                                style={{ background: "var(--gradient-cta)" }}
                            >
                                <Send className="w-5 h-5" />
                                {t("telegramCta")}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                            <Link
                                href={`/${locale}/research`}
                                className="px-8 py-4 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 font-semibold transition-all text-center"
                            >
                                {t("sampleCta")}
                            </Link>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="text-center">
                        <p className="text-sm text-gold/60 font-medium">
                            {t("disclaimerMain")}
                        </p>
                        <p className="text-xs text-white/20 mt-2">
                            {t("disclaimerSub")}
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
