"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TiltCard } from "@/components/ui/tilt-card";
import { Check, Sparkles, ArrowRight, Send } from "lucide-react";

export function PlansContent() {
    const locale = useLocale();
    const t = useTranslations("plans");
    const features: string[] = t.raw("features") as string[];
    const roadmapItems: Array<{ status: string; title: string; description: string }> = t.raw("roadmap") as Array<{ status: string; title: string; description: string }>;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Free Features Card */}
                    <div className="p-8 rounded-2xl bg-cv-elevated border border-accent/30 shadow-lg shadow-accent/5 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{t("freeTitle")}</h2>
                                <p className="text-[var(--text-tertiary)] text-sm">{t("freeSubtitle")}</p>
                            </div>
                        </div>
                        <ul className="grid md:grid-cols-2 gap-3 mb-8">
                            {features.map((feature: string) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                    <span className="text-[var(--text-primary)]">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <a
                            href="https://t.me/TranTradingLabEN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg text-cv-primary font-bold transition-all hover:shadow-lg hover:shadow-accent/20"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            <Send className="w-4 h-4" />
                            {t("telegramCta")}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>

                    {/* Roadmap Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            {t("roadmapTitle")}
                        </h2>
                        <p className="text-[var(--text-tertiary)] text-center mb-8">
                            {t("roadmapSubtitle")}
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {roadmapItems.map((item) => (
                                <TiltCard key={item.title}>
                                    <div className="p-4 rounded-lg bg-cv-elevated/50 border border-[var(--border-subtle)] h-full">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.status === t("statusPreparing")
                                                    ? "bg-accent/20 text-accent"
                                                    : "bg-[var(--bg-wash)] text-[var(--text-muted)]"
                                                }`}>
                                                {item.status}
                                            </span>
                                            <h3 className="font-semibold text-[var(--text-primary)]">{item.title}</h3>
                                        </div>
                                        <p className="text-sm text-[var(--text-tertiary)]">{item.description}</p>
                                    </div>
                                </TiltCard>
                            ))}
                        </div>
                    </div>

                    {/* FAQ CTA */}
                    <div className="text-center">
                        <p className="text-[var(--text-tertiary)] mb-4">
                            {t("faqQuestion")}
                        </p>
                        <Link
                            href={`/${locale}/faq`}
                            className="text-accent hover:underline"
                        >
                            {t("faqLink")}
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
