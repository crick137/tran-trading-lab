"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowRight, CheckCircle } from "lucide-react";

const COOLDOWN_KEY = "ttl-exit-intent-dismissed";
const COOLDOWN_DAYS = 7;

function isCooldownActive(): boolean {
    if (typeof window === "undefined") return true;
    const dismissed = localStorage.getItem(COOLDOWN_KEY);
    if (!dismissed) return false;
    const dismissedAt = parseInt(dismissed, 10);
    const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    return daysSince < COOLDOWN_DAYS;
}

function setCooldown() {
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
}

export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
    const [mounted, setMounted] = useState(false);
    const t = useTranslations("home");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDismiss = useCallback(() => {
        setIsVisible(false);
        setCooldown();
    }, []);

    useEffect(() => {
        if (isCooldownActive()) return;

        let hasTriggered = false;

        const handleMouseLeave = (e: MouseEvent) => {
            if (hasTriggered) return;
            // Only trigger when mouse moves to top of viewport
            if (e.clientY <= 5 && e.relatedTarget === null) {
                hasTriggered = true;
                setIsVisible(true);
            }
        };

        // Delay listener registration so it doesn't fire on page load
        const timer = setTimeout(() => {
            document.addEventListener("mouseleave", handleMouseLeave);
        }, 5000);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        // Placeholder — integrate Beehiiv/ConvertKit later
        setTimeout(() => {
            setStatus("success");
            setTimeout(() => {
                handleDismiss();
            }, 2000);
        }, 1000);
    };

    const popupContent = (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    onClick={handleDismiss}
                    style={{ isolation: "isolate" }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative w-full max-w-md p-8 rounded-2xl bg-cv-elevated border border-gold/20 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Ambient glow */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-[60px]" aria-hidden="true" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/3 rounded-full blur-[40px]" aria-hidden="true" />

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="relative z-10 text-center">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/10 mb-5">
                                <Mail className="w-5 h-5 text-gold" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                                {t("exitIntentTitle")}
                            </h3>
                            <p className="text-sm text-white/40 mb-6 leading-relaxed">
                                {t("exitIntentSubtitle")}
                            </p>

                            {/* Form */}
                            {status === "success" ? (
                                <div className="flex items-center justify-center gap-2 py-3 text-bullish">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">{t("exitIntentSuccess")}</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t("exitIntentPlaceholder")}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full px-6 py-3 rounded-lg font-semibold text-sm text-cv-void transition-all hover:shadow-lg hover:shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                        style={{ background: "var(--gradient-cta)" }}
                                    >
                                        {status === "loading" ? "..." : t("exitIntentButton")}
                                        {status !== "loading" && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </form>
                            )}

                            {/* Dismiss link */}
                            {status !== "success" && (
                                <button
                                    onClick={handleDismiss}
                                    className="mt-4 text-xs text-white/20 hover:text-white/40 transition-colors"
                                >
                                    {t("exitIntentDismiss")}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Use React Portal to render outside DOM flow, preventing layout interference with Hero
    if (!mounted) return null;
    return createPortal(popupContent, document.body);
}
