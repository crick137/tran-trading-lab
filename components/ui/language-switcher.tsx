"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useCallback, useTransition } from "react";

const locales = [
    { code: "en", label: "EN" },
    { code: "ko", label: "한국어" },
] as const;

export function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const switchTo = useCallback(
        (targetLocale: string) => {
            if (targetLocale === locale) return;
            startTransition(() => {
                router.replace(pathname, { locale: targetLocale as "en" | "ko" });
            });
        },
        [locale, pathname, router]
    );

    return (
        <div
            className={`relative flex items-center rounded-lg border border-[var(--border-default)] overflow-hidden text-xs transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
            role="radiogroup"
            aria-label="Language"
        >
            {/* Sliding active indicator */}
            <div
                className="absolute top-0 bottom-0 w-1/2 bg-accent/15 border-r-0 transition-transform duration-300 ease-out"
                style={{ transform: locale === "en" ? "translateX(0)" : "translateX(100%)" }}
            />
            {locales.map((l) => (
                <button
                    key={l.code}
                    onClick={() => switchTo(l.code)}
                    disabled={isPending}
                    role="radio"
                    aria-checked={locale === l.code}
                    className={`relative z-10 px-3 py-1.5 transition-colors duration-200 ${locale === l.code
                            ? "text-accent font-semibold"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                    aria-label={`Switch to ${l.label}`}
                >
                    {l.label}
                </button>
            ))}
        </div>
    );
}
