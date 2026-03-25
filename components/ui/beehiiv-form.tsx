"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// ─── Config ──────────────────────────────────────────────
// beehiiv publication ID — find in beehiiv Dashboard → Settings → General
// The embed URL is: https://embeds.beehiiv.com/{PUBLICATION_ID}
const BEEHIIV_PUBLICATION_ID = ""; // TODO: Rick fill this in from beehiiv dashboard
const BEEHIIV_SUBSCRIBE_URL = "https://trantradinglab.beehiiv.com/subscribe";
// ─────────────────────────────────────────────────────────

type Status = "idle" | "loading" | "success" | "error";

interface BeehiivFormProps {
    layout?: "inline" | "stacked";
}

export function BeehiivForm({ layout = "inline" }: BeehiivFormProps) {
    const locale = useLocale();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");

    const isKo = locale === "ko";
    const placeholderText = isKo ? "이메일 주소" : "Email address";
    const buttonText = isKo ? "구독하기" : "Subscribe";
    const successText = isKo
        ? "구독 완료! 이메일을 확인해주세요."
        : "Success! Check your email to confirm.";
    const errorText = isKo
        ? "오류가 발생했습니다. 다시 시도해주세요."
        : "Something went wrong. Please try again.";

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!email || status === "loading") return;

        setStatus("loading");

        // Method 1: Use beehiiv API (requires publication ID)
        if (BEEHIIV_PUBLICATION_ID) {
            try {
                const res = await fetch(
                    `https://embeds.beehiiv.com/api/v1/subscriptions`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            publication_id: BEEHIIV_PUBLICATION_ID,
                            email,
                            utm_source: "website",
                            utm_medium: "subscribe_form",
                        }),
                    }
                );

                if (res.ok) {
                    setStatus("success");
                    setEmail("");
                    return;
                }
            } catch {
                // Fall through to Method 2
            }
        }

        // Method 2: Open beehiiv subscribe page with pre-filled email
        try {
            const url = `${BEEHIIV_SUBSCRIBE_URL}?email=${encodeURIComponent(email)}`;
            window.open(url, "_blank", "noopener,noreferrer");
            setStatus("success");
            setEmail("");
        } catch {
            setStatus("error");
        }
    }

    if (status === "success") {
        return (
            <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-sm font-medium text-emerald-400">{successText}</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-red-400/10 border border-red-400/20">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-red-400">{errorText}</p>
                </div>
                <button
                    onClick={() => setStatus("idle")}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                    {isKo ? "다시 시도" : "Try again"}
                </button>
            </div>
        );
    }

    const isStacked = layout === "stacked";

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex ${isStacked ? "flex-col" : "flex-col sm:flex-row"} gap-2 w-full`}
        >
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholderText}
                required
                aria-label={placeholderText}
                className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all"
            />
            <button
                type="submit"
                disabled={status === "loading"}
                className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-bold text-[#0a0a0f] transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-cta)" }}
            >
                {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    buttonText
                )}
            </button>
        </form>
    );
}
