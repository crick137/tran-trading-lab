"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";

const locales = [
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const currentLocale = locales.find((l) => l.code === locale) || locales[0];

    const handleLocaleChange = (newLocale: string) => {
        // Replace current locale in pathname with new locale
        const segments = pathname.split("/");
        segments[1] = newLocale;
        const newPath = segments.join("/");
        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border/50 hover:border-gold/50 transition-colors text-sm"
            >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span>{currentLocale.flag}</span>
                <span className="hidden sm:inline text-muted-foreground">{currentLocale.label}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 py-2 bg-card border border-border/50 rounded-lg shadow-xl min-w-[140px] z-50">
                        {locales.map((loc) => (
                            <button
                                key={loc.code}
                                onClick={() => handleLocaleChange(loc.code)}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${loc.code === locale
                                        ? "text-gold bg-gold/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    }`}
                            >
                                <span>{loc.flag}</span>
                                <span>{loc.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
