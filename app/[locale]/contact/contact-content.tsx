"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Send, Mail, MessageCircle, Check, Loader2 } from "lucide-react";

export function ContactContent() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
    const t = useTranslations("contact");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        await new Promise(r => setTimeout(r, 1500));
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
    };

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                            <MessageCircle className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
                        <p className="text-lg text-[var(--text-tertiary)]">{t("subtitle")}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Contact Methods */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white mb-4">{t("quickContact")}</h2>

                            <a
                                href="https://t.me/TranTradingLabEN"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-lg bg-cv-elevated border border-[var(--border-subtle)] hover:border-[#29b6f6]/30 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-[#29b6f6]/10 flex items-center justify-center">
                                    <Send className="w-6 h-6 text-[#29b6f6]" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-[var(--text-primary)] group-hover:text-accent transition-colors">{t("telegram")}</h3>
                                    <p className="text-sm text-[var(--text-tertiary)]">{t("telegramDesc")}</p>
                                </div>
                            </a>

                            <a
                                href="mailto:contact@trantradinglab.com"
                                className="flex items-center gap-4 p-4 rounded-lg bg-cv-elevated border border-[var(--border-subtle)] hover:border-accent/30 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-[var(--text-primary)] group-hover:text-accent transition-colors">{t("email")}</h3>
                                    <p className="text-sm text-[var(--text-tertiary)]">contact@trantradinglab.com</p>
                                </div>
                            </a>

                            <div className="p-4 rounded-lg bg-cv-elevated/50 border border-[var(--border-subtle)] mt-6">
                                <p className="text-sm text-[var(--text-tertiary)]">{t("responseTime")}</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-xl font-semibold text-white mb-4">{t("sendMessage")}</h2>

                            <div>
                                <label className="block text-sm text-[var(--text-tertiary)] mb-2">{t("nameLabel")}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-cv-elevated border border-[var(--border-default)] text-white placeholder:text-[var(--text-ghost)] focus:outline-none focus:border-accent/40 transition-colors"
                                    placeholder={t("namePlaceholder")}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[var(--text-tertiary)] mb-2">{t("emailLabel")}</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-cv-elevated border border-[var(--border-default)] text-white placeholder:text-[var(--text-ghost)] focus:outline-none focus:border-accent/40 transition-colors"
                                    placeholder={t("emailPlaceholder")}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[var(--text-tertiary)] mb-2">{t("messageLabel")}</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg bg-cv-elevated border border-[var(--border-default)] text-white placeholder:text-[var(--text-ghost)] focus:outline-none focus:border-accent/40 transition-colors resize-none"
                                    placeholder={t("messagePlaceholder")}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status !== "idle"}
                                className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                    status === "success"
                                        ? "bg-bullish text-white"
                                        : "text-cv-primary hover:shadow-lg hover:shadow-accent/20"
                                }`}
                                style={status !== "success" ? { background: "var(--gradient-cta)" } : undefined}
                            >
                                {status === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
                                {status === "success" && <Check className="w-5 h-5" />}
                                {status === "idle" && t("submitIdle")}
                                {status === "loading" && t("submitLoading")}
                                {status === "success" && t("submitSuccess")}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
