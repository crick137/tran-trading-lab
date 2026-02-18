"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const locales = [
    { code: "en", label: "EN" },
    { code: "ko", label: "한국어" },
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const switchTo = useCallback(
        (targetLocale: string) => {
            if (targetLocale === locale) return;
            const segments = pathname.split("/");
            segments[1] = targetLocale;
            router.push(segments.join("/"));
        },
        [locale, pathname, router]
    );

    return (
        <div className="flex items-center rounded-lg border border-white/10 dark:border-white/10 overflow-hidden text-xs">
            {locales.map((l, i) => (
                <button
                    key={l.code}
                    onClick={() => switchTo(l.code)}
                    className={`px-2.5 py-1.5 transition-all ${
                        locale === l.code
                            ? "bg-gold/20 text-gold font-semibold"
                            : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    } ${i > 0 ? "border-l border-white/10" : ""}`}
                    aria-label={`Switch to ${l.label}`}
                    aria-current={locale === l.code ? "true" : undefined}
                >
                    {l.label}
                </button>
            ))}
        </div>
    );
}
