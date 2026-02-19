"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useTranslations } from "next-intl";

export function TermsContent() {
    const t = useTranslations("terms");

    const section4Items = t.raw("section4Items") as string[];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8">{t("title")}</h1>

                    <div className="prose prose-invert max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)]">
                        <p className="text-[var(--text-secondary)] mb-6">
                            {t("lastUpdated")}
                        </p>

                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4">{t("section1Title")}</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            {t("section1Body")}
                        </p>

                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4">2. {t("warningTitle")}</h2>
                        <div className="bg-cv-elevated border border-[var(--border-default)] rounded-lg p-4 mb-6">
                            <p className="text-accent font-medium mb-2">⚠️ {t("warningTitle")}</p>
                            <p className="text-[var(--text-secondary)] text-sm">
                                {t("warningBody")}
                            </p>
                        </div>

                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4">{t("section3Title")}</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            {t("section3Body")}
                        </p>

                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4">{t("section4Title")}</h2>
                        <ul className="list-disc list-inside text-[var(--text-secondary)] mb-6 space-y-2">
                            {section4Items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4">{t("section5Title")}</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            {t("section5Body")}
                        </p>

                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4">{t("section6Title")}</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            {t("section6Body")}
                        </p>

                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4">{t("section7Title")}</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            {t("section7Body")} <a href="https://t.me/TranTradingLab" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Telegram</a>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
