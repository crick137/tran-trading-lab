"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TrendingUp, BookOpen, Activity, Globe, Shield, Brain, Tag } from "lucide-react";
import { CONTENT_CATEGORIES } from "@/lib/content-utils";
import type { UnifiedContentItem } from "@/lib/content-utils";

const iconMap: Record<string, typeof TrendingUp> = {
    LayoutGrid: Tag,
    TrendingUp: TrendingUp,
    BookOpen: BookOpen,
    Activity: Activity,
    Globe: Globe,
    Shield: Shield,
    Brain: Brain,
};

interface CategorySidebarProps {
    allContent?: UnifiedContentItem[];
}

export function CategorySidebar({ allContent = [] }: CategorySidebarProps) {
    const locale = useLocale() as "en" | "ko";
    const t = useTranslations("home");

    const categories = useMemo(() => {
        return CONTENT_CATEGORIES.filter(c => c.id !== "all").map(cat => {
            const count = allContent.filter(item => item.category === cat.id).length;
            return { ...cat, count };
        }).filter(c => c.count > 0);
    }, [allContent]);

    if (categories.length === 0) return null;

    return (
        <div className="rounded-2xl border border-[var(--border-default)] bg-cv-elevated overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/15 flex items-center justify-center">
                        <Tag className="w-3.5 h-3.5 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        {t("categoryTitle")}
                    </h3>
                </div>
            </div>

            <div className="px-2 py-2 space-y-0.5">
                {categories.map((cat) => {
                    const Icon = iconMap[cat.icon] || Tag;
                    return (
                        <div
                            key={cat.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-wash)] transition-all duration-200 cursor-pointer group"
                        >
                            <Icon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-200" />
                            <span className="flex-1 text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-200">
                                {locale === "ko" ? cat.labelKO : cat.labelEN}
                            </span>
                            <span className="text-[11px] font-medium text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 py-0.5 rounded-full min-w-[24px] text-center">
                                {cat.count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
