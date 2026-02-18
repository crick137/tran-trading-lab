"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function NotFound() {
    const locale = useLocale();
    const t = useTranslations("notFound");

    return (
        <div className="min-h-screen bg-cv-void flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl font-bold text-gold/20 mb-6 font-mono">
                    {t("code")}
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">
                    {t("title")}
                </h1>
                <p className="text-white/50 mb-8">
                    {t("description")}
                </p>
                <Link
                    href={`/${locale}`}
                    className="inline-flex px-6 py-2.5 rounded-lg bg-gold text-cv-primary font-semibold hover:bg-gold-light transition-colors"
                >
                    {t("backHome")}
                </Link>
            </div>
        </div>
    );
}
