"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Globe } from "lucide-react";

const locales = [
    { code: "en", label: "EN", flag: "🇺🇸" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const currentLocale = locales.find((l) => l.code === locale) || locales[0];
    const otherLocale = locales.find((l) => l.code !== locale) || locales[1];

    const handleLocaleChange = () => {
        const segments = pathname.split("/");
        segments[1] = otherLocale.code;
        const newPath = segments.join("/");
        router.push(newPath);
    };

    return (
        <button
            onClick={handleLocaleChange}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-gold/30 transition-all text-xs text-white/50 hover:text-white/80"
            title={`Switch to ${otherLocale.label}`}
        >
            <Globe className="w-3.5 h-3.5" />
            <span>{otherLocale.flag} {otherLocale.label}</span>
        </button>
    );
}
