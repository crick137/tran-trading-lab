"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BarChart3, Target, Shield, Globe } from "lucide-react";

const features = [
    { icon: BarChart3, titleKey: "whatYouGet1Title", descKey: "whatYouGet1Desc", href: "/dashboard" },
    { icon: Target, titleKey: "whatYouGet2Title", descKey: "whatYouGet2Desc", href: "/bold-calls" },
    { icon: Shield, titleKey: "whatYouGet3Title", descKey: "whatYouGet3Desc", href: "/dashboard" },
    { icon: Globe, titleKey: "whatYouGet4Title", descKey: "whatYouGet4Desc", href: null },
] as const;

export function WhatYouGet() {
    const locale = useLocale();
    const t = useTranslations("home");
    return (
        <section className="py-24 lg:py-40 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-section text-[var(--text-primary)] text-center mb-16">
                    {t("whatYouGetTitle")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => {
                        const content = (
                            <div className="p-6 md:p-8 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--border-default)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] h-full">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                                    <feature.icon className="w-5 h-5 text-accent" />
                                </div>
                                <h3 className="text-card-title text-[var(--text-primary)] mb-3">
                                    {t(feature.titleKey)}
                                </h3>
                                <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">
                                    {t(feature.descKey)}
                                </p>
                            </div>
                        );

                        return feature.href ? (
                            <Link key={feature.titleKey} href={`/${locale}${feature.href}`} className="block h-full">
                                {content}
                            </Link>
                        ) : (
                            <div key={feature.titleKey}>{content}</div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
