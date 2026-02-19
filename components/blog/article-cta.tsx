"use client";

import { useLocale, useTranslations } from "next-intl";
import { siteStats } from "@/lib/site-stats";
import Link from "next/link";
import { Send } from "lucide-react";

export function ArticleCTA() {
    const locale = useLocale();
    const t = useTranslations("blogPost");

    return (
        <section className="my-16 p-8 rounded-2xl bg-gradient-to-br from-cv-elevated to-cv-elevated/50 border border-accent/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        {t("subscribeCta")}
                    </h3>
                    <p className="text-[var(--text-secondary)] max-w-lg">
                        {t("subscribeCtaDesc")}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href={siteStats.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accent-hover text-[#0a0a0f] font-bold hover:shadow-lg hover:shadow-accent/20 transition-all flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        {t("telegramJoin")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
