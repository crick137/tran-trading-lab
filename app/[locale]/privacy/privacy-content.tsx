"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useTranslations } from "next-intl";

export function PrivacyContent() {
    const t = useTranslations("privacy");

    const section1Items = t.raw("section1Items") as string[];
    const section2Items = t.raw("section2Items") as string[];

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
                        <p className="text-[var(--text-secondary)] mb-4">
                            {t("section1Body")}
                        </p>
                        <ul className="list-disc list-inside text-[var(--text-secondary)] mb-6 space-y-2">
                            {section1Items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4">{t("section2Title")}</h2>
                        <ul className="list-disc list-inside text-[var(--text-secondary)] mb-6 space-y-2">
                            {section2Items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4">{t("section3Title")}</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            {t("section3Body")}
                        </p>

                        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4">{t("section4Title")}</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            {t("section4Body")}
                        </p>

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
