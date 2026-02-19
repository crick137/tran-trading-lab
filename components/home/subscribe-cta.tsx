"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SubscribeCTA() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [shake, setShake] = useState(false);
    const t = useTranslations("home");

    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => setStatus("idle"), 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!email) {
            setStatus("error");
            setErrorMsg(t("subscribeErrorEmpty"));
            triggerShake();
            return;
        }

        if (!EMAIL_RE.test(email)) {
            setStatus("error");
            setErrorMsg(t("subscribeErrorInvalid"));
            triggerShake();
            return;
        }

        setStatus("loading");
        // Placeholder — integrate Beehiiv/ConvertKit later
        setTimeout(() => {
            setStatus("success");
            setEmail("");
        }, 1000);
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    return (
        <section className="py-24 lg:py-40 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="relative p-8 md:p-16 rounded-2xl bg-cv-elevated border border-[var(--border-subtle)] overflow-hidden">
                    {/* Ambient glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" aria-hidden="true" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-[60px]" aria-hidden="true" />

                    <div className="relative z-10 max-w-xl mx-auto text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-6">
                            <Mail className="w-5 h-5 text-accent" />
                        </div>

                        <h2 className="text-section text-[var(--text-primary)] mb-4">
                            {t("subscribeCta")}
                        </h2>

                        <p className="text-sm text-[var(--text-tertiary)] mb-10 leading-relaxed max-w-[680px] mx-auto">
                            {t("subscribeDescription")}
                        </p>

                        {/* Form */}
                        {status === "success" ? (
                            <div className="flex items-center justify-center gap-2 py-3 text-bullish animate-fade-in">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">{t("subscribeSuccess")}</span>
                            </div>
                        ) : (
                            <>
                                <form
                                    onSubmit={handleSubmit}
                                    className={`flex flex-col sm:flex-row gap-3 max-w-md mx-auto ${shake ? "animate-shake" : ""}`}
                                >
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (status === "error") setStatus("idle");
                                        }}
                                        placeholder={t("subscribePlaceholder")}
                                        className={`flex-1 h-14 px-6 rounded-xl bg-[var(--bg-surface)] border text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none transition-colors ${status === "error"
                                            ? "border-bearish/50 focus:border-bearish/70"
                                            : "border-[var(--border-default)] focus:border-accent focus:ring-2 focus:ring-accent/20"
                                            }`}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="h-14 px-8 rounded-xl font-semibold text-sm text-[#0a0a0f] transition-all duration-200 hover:brightness-110 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                        style={{ background: "var(--gradient-cta)" }}
                                    >
                                        {status === "loading" ? "..." : t("subscribeButton")}
                                        {status !== "loading" && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </form>
                                {status === "error" && errorMsg && (
                                    <div className="flex items-center justify-center gap-1.5 mt-3 text-bearish text-sm animate-fade-in">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>{errorMsg}</span>
                                    </div>
                                )}
                            </>
                        )}

                        <p className="text-[13px] text-[var(--text-muted)] mt-6">
                            {t("subscribeDisclaimer")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
