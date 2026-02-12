"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Check, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const t = useTranslations("newsletter");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            setStatus("error");
            return;
        }

        setStatus("loading");

        // Simulate API call - Replace with actual newsletter service integration
        // For production, integrate with Mailchimp, ConvertKit, or Supabase
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Store locally for now (in production, send to backend)
            const subscribers = JSON.parse(localStorage.getItem("newsletter_subscribers") || "[]");
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem("newsletter_subscribers", JSON.stringify(subscribers));
            }

            setStatus("success");
            setEmail("");
            setTimeout(() => setStatus("idle"), 3000);
        } catch (error) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto"
        >
            <div className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="email"
                            placeholder={t("emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === "loading" || status === "success"}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all disabled:opacity-50"
                        />
                    </div>
                    <motion.button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
                        whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
                        className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${status === "success"
                            ? "bg-green-500 text-white"
                            : status === "error"
                                ? "bg-red-500/20 text-red-500 border border-red-500/50"
                                : "bg-gradient-to-r from-gold to-gold-light text-background hover:shadow-lg hover:shadow-gold/30"
                            }`}
                    >
                        <AnimatePresence mode="wait">
                            {status === "loading" ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </motion.div>
                            ) : status === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    <span>{t("success")}</span>
                                </motion.div>
                            ) : status === "error" ? (
                                <motion.div
                                    key="error"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{t("error")}</span>
                                </motion.div>
                            ) : (
                                <motion.span
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {t("subscribeButton")}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground text-center">
                    {t("description")}
                </p>
            </div>
        </motion.form>
    );
}
