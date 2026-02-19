"use client";

import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { KitForm } from "@/components/ui/kit-form";

export function SubscribeCTA() {
    const t = useTranslations("home");

    return (
        <section className="py-24 lg:py-40 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="relative p-8 md:p-16 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] overflow-hidden">
                    {/* Ambient glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" aria-hidden="true" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-[60px]" aria-hidden="true" />

                    <div className="relative z-10 max-w-xl mx-auto text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-6">
                            <Mail className="w-5 h-5 text-accent" />
                        </div>

                        <h2 className="text-section text-[var(--text-primary)] mb-4">
                            {t("subscribeCta")}
                        </h2>

                        <p className="text-sm text-[var(--text-tertiary)] mb-10 leading-relaxed max-w-[680px] mx-auto">
                            {t("subscribeDescription")}
                        </p>

                        {/* Kit Newsletter Form */}
                        <KitForm />

                        <p className="text-[13px] text-[var(--text-muted)] mt-6">
                            {t("subscribeDisclaimer")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
