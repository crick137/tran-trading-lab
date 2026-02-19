"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SubscribeCTA() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [shake, setShake] = useState(false);
    const t = useTranslations("home");
    const sectionRef = useGsapScroll<HTMLDivElement>({
        from: { opacity: 0, y: 30, scale: 0.97 },
        to: { opacity: 1, y: 0, scale: 1 },
    });

    // Auto-reset success state after 5s
    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => {
                setStatus("idle");
            }, 5000);
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
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto" ref={sectionRef}>
                <div
                    className="relative p-8 md:p-12 rounded-2xl bg-cv-elevated border border-gold/20 overflow-hidden"
                >
                    {/* Ambient glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px]" aria-hidden="true" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-[60px]" aria-hidden="true" />

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
                                        className={`flex-1 px-4 py-3 rounded-lg bg-white/5 border text-white text-sm placeholder:text-white/30 focus-visible:outline-none transition-colors ${status === "error"
                                                ? "border-bearish/50 focus:border-bearish/70"
                                                : "border-white/10 focus:border-gold/40"
                                            }`}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="px-6 py-3 rounded-lg font-semibold text-sm text-cv-void transition-[box-shadow,transform] hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
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

                        <p className="text-xs text-white/20 mt-4">
                            {t("subscribeDisclaimer")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
