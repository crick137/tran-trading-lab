"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentCard } from "@/components/content/content-card";
import type { UnifiedContentItem } from "@/lib/content-utils";
import type { ContentTab } from "./tab-navigation";

const MAX_ITEMS = 5;

const tabHrefMap: Record<ContentTab, string> = {
    all: "",
    briefings: "/briefings",
    blog: "/blog",
    research: "/research",
};

interface ContentFeedProps {
    activeTab: ContentTab;
    allContent: UnifiedContentItem[];
}

export function ContentFeed({ activeTab, allContent }: ContentFeedProps) {
    const t = useTranslations("home");

    const allItems = useMemo(() => {
        if (activeTab === "all") return allContent;
        const typeMap: Record<string, string> = { briefings: "briefing", blog: "blog", research: "research" };
        return allContent.filter((item) => item.type === typeMap[activeTab]);
    }, [allContent, activeTab]);

    const visibleItems = allItems.slice(0, MAX_ITEMS);
    const hasMore = allItems.length > MAX_ITEMS;
    const moreHref = tabHrefMap[activeTab];

    if (allItems.length === 0) {
        return (
            <div className="py-16 text-center">
                <p className="text-[var(--text-tertiary)]">
                    {t("noArticles")}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {visibleItems.map((item) => (
                <ContentCard
                    key={item.id}
                    item={item}
                    variant="horizontal"
                    showExcerpt={true}
                />
            ))}

            {hasMore && moreHref && (
                <Link
                    href={moreHref}
                    className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-[var(--border-default)] text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-all duration-300 bg-cv-elevated"
                >
                    {t("viewAll")}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            )}
        </div>
    );
}
