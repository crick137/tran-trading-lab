"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ReportsPage() {
    const t = useTranslations("reports");
    const tc = useTranslations("common");

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <h1 className="text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
                    <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                    <div className="bg-card/30 border border-border/50 rounded-2xl p-12 max-w-2xl mx-auto">
                        <p className="text-muted-foreground text-lg mb-6">
                            {t("noReports")}<br />
                            {t("telegramCta")}
                        </p>
                        <Link
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"
                        >
                            {tc("joinTelegramChannel")}
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
