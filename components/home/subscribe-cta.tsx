"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export function SubscribeCTA() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const t = useTranslations("home");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        // Placeholder — integrate Beehiiv/ConvertKit later
        setTimeout(() => {
            setStatus("success");
            setEmail("");
        }, 1000);
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative p-8 md:p-12 rounded-2xl bg-cv-secondary border border-gold/20 overflow-hidden"
                >
                    {/* Ambient glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/3 rounded-full blur-[60px]" />

                    <div className="relative z-10 max-w-xl mx-auto text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/10 mb-6">
                            <Mail className="w-5 h-5 text-gold" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            {t("subscribeCta")}
                        </h2>

                        <p className="text-sm text-white/40 mb-8 leading-relaxed">
                            {t("subscribeDescription")}
                        </p>

                        {/* Form */}
                        {status === "success" ? (
                            <div className="flex items-center justify-center gap-2 py-3 text-bullish">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">{t("subscribeSuccess")}</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("subscribePlaceholder")}
                                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="px-6 py-3 rounded-lg font-semibold text-sm text-cv-primary transition-all hover:shadow-lg hover:shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                    style={{ background: "var(--gradient-cta)" }}
                                >
                                    {status === "loading" ? "..." : t("subscribeButton")}
                                    {status !== "loading" && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </form>
                        )}

                        <p className="text-xs text-white/20 mt-4">
                            {t("subscribeDisclaimer")}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
