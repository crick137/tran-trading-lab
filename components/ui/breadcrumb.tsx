"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    const locale = useLocale();
    const t = useTranslations("common");

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center flex-wrap gap-1 text-sm">
                <li>
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-1 text-[var(--text-tertiary)] hover:text-accent transition-colors"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>{t("home")}</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-ghost)]" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-[var(--text-tertiary)] hover:text-accent transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-white font-medium truncate max-w-[200px]">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
