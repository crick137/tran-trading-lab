"use client";

import { useTranslations } from "next-intl";
import { Mail, Zap } from "lucide-react";
import { KitForm } from "@/components/ui/kit-form";

interface SubscribeCTAProps {
    variant?: "default" | "compact";
}

export function SubscribeCTA({ variant = "default" }: SubscribeCTAProps) {
    const t = useTranslations("home");

    if (variant === "compact") {
        return (
            <div className="rounded-2xl border border-[var(--border-default)] bg-cv-elevated overflow-hidden">
                {/* Accent top line */}
                <div className="h-[2px] bg-gradient-to-r from-[var(--accent)]/60 via-[var(--accent)] to-[var(--accent)]/60" />
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-[var(--accent)]" />
                        </div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">
                            {t("subscribeCta")}
                        </h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {t("subscribeDescription")}
                    </p>
                    <KitForm layout="stacked" />
                    <div className="flex items-center justify-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                            <Zap className="w-2.5 h-2.5" />
                            FREE
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                            {t("subscribeDisclaimer")}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

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
