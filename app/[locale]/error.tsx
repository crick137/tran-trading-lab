"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const locale = useLocale();
    const t = useTranslations("error");

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-cv-void flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-6xl font-bold text-accent/30 mb-4">!</div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                    {t("title")}
                </h1>
                <p className="text-[var(--text-secondary)] mb-8">
                    {t("description")}
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-2.5 rounded-lg bg-accent text-cv-primary font-semibold hover:bg-accent-light transition-colors"
                    >
                        {t("tryAgain")}
                    </button>
                    <Link
                        href={`/${locale}`}
                        className="px-6 py-2.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
                    >
                        {t("goHome")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
