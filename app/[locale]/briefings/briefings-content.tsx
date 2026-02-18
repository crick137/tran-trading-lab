"use client";

import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { FileText, Send, ArrowRight } from "lucide-react";

export function BriefingsContent() {
    const t = useTranslations("briefings");
    const tc = useTranslations("common");
    const heroRef = useGsapScroll<HTMLDivElement>();
    const contentRef = useGsapScroll<HTMLDivElement>();

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <div ref={heroRef}>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <FileText className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
                        <p className="text-white/40 mb-12 max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>
                    <div ref={contentRef} className="bg-cv-elevated/50 border border-white/5 rounded-2xl p-12 max-w-2xl mx-auto">
                        <p className="text-white/40 text-lg mb-6">
                            {t("noBriefings")}<br />
                            {t("telegramCta")}
                        </p>
                        <a
                            href="https://t.me/TranTradingLabEN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-cv-primary font-bold transition-all hover:shadow-lg hover:shadow-gold/20"
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
