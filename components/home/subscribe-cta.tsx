"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";

export function SubscribeCTA() {
    const t = useTranslations("home");
    const tc = useTranslations("common");
    const ts = useTranslations("stats");

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
            <div className="absolute inset-0 bg-grid opacity-50" />

            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Primary CTA: Telegram */}
                    <div className="flex flex-col items-center gap-4 mb-12">
                        <Link
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            className="group px-10 py-5 rounded-lg bg-gradient-to-r from-[#229ED9] to-[#1E88C2] text-white font-bold text-lg transition-all hover:shadow-xl hover:shadow-[#229ED9]/30 flex items-center gap-3"
                        >
                            <Send className="w-5 h-5" />
                            {tc("joinTelegram")}
                        </Link>
                        <span className="text-muted-foreground text-sm">
                            {tc("freeToJoin")}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 max-w-md mx-auto mb-10">
                        <div className="flex-1 h-px bg-border/50" />
                        <span className="text-muted-foreground text-sm">or</span>
                        <div className="flex-1 h-px bg-border/50" />
                    </div>

                    {/* Secondary CTA: Newsletter */}
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        {t("subscribeCta")}
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        {t("subscribeDescription")}
                    </p>
                    <div className="mb-8">
                        <NewsletterForm />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
