"use client";

import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FileText, Send, ArrowRight } from "lucide-react";

export function BriefingsContent() {
    const t = useTranslations("briefings");
    const tc = useTranslations("common");
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <div>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                            <FileText className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
                        <p className="text-[var(--text-tertiary)] mb-12 max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>
                    <div className="bg-cv-elevated/50 border border-[var(--border-subtle)] rounded-2xl p-12 max-w-2xl mx-auto">
                        <p className="text-[var(--text-tertiary)] text-lg mb-6">
                            {t("noBriefings")}<br />
                            {t("telegramCta")}
                        </p>
                        <a
                            href="https://t.me/TranTradingLabEN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-cv-primary font-bold transition-all hover:shadow-lg hover:shadow-accent/20"
                            style={{ background: "var(--gradient-cta)" }}
                        >
                            <Send className="w-4 h-4" />
                            {tc("joinTelegramChannel")}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
