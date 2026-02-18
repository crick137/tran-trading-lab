"use client";

import { useTranslations } from "next-intl";

export function ValueProposition() {
    const t = useTranslations("home");

    return (
        <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-white/5">
            <p className="text-center text-sm sm:text-base text-white/40 max-w-2xl mx-auto">
                {t("valueProposition")}
            </p>
        </section>
    );
}
