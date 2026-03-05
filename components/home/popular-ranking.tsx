"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Flame, Clock, TrendingUp, FileText, BookOpen } from "lucide-react";
import type { UnifiedContentItem } from "@/lib/content-utils";

const typeIcons = {
    briefing: TrendingUp,
    research: FileText,
    blog: BookOpen,
};

const typeColors = {
    briefing: "text-emerald-400",
    research: "text-blue-400",
    blog: "text-[var(--accent)]",
};

interface PopularRankingProps {
    items?: UnifiedContentItem[];
}

export function PopularRanking({ items: allItems }: PopularRankingProps) {
    const t = useTranslations("home");
    const [period, setPeriod] = useState<"today" | "week">("today");

    const items = useMemo(() => (allItems || []).slice(0, 5), [allItems]);

    if (items.length === 0) return null;

    return (
        <div className="rounded-2xl border border-[var(--border-default)] bg-cv-elevated overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/15 flex items-center justify-center">
                        <Flame className="w-3.5 h-3.5 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        {t("popularTitle")}
                    </h3>
                </div>
                <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--bg-surface)]">
                    <button
                        onClick={() => setPeriod("today")}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                            period === "today"
                                ? "bg-[var(--accent)] text-[var(--bg-primary)] shadow-sm"
                                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                        }`}
                    >
                        {t("popularToday")}
                    </button>
                    <button
                        onClick={() => setPeriod("week")}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                            period === "week"
                                ? "bg-[var(--accent)] text-[var(--bg-primary)] shadow-sm"
                                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                        }`}
                    >
                        {t("popularWeek")}
                    </button>
                </div>
            </div>

            {/* List */}
            <div>
                {items.map((item, index) => {
                    const rank = index + 1;
                    const Icon = typeIcons[item.type];
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="flex items-start gap-3 px-4 py-3.5 hover:bg-[var(--bg-wash)] transition-all duration-200 group border-b border-[var(--border-subtle)] last:border-b-0"
                        >
                            <span
                                className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                                    rank <= 3
                                        ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                                        : "text-[var(--text-muted)]"
                                }`}
                            >
                                {rank}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-[var(--text-primary)] leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-200">
                                    {item.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <Icon className={`w-3 h-3 ${typeColors[item.type]}`} />
                                    <span className="text-[11px] text-[var(--text-muted)]">{item.readTime}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
