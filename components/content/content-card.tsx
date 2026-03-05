"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Calendar, Clock, TrendingUp, BookOpen, FileText, ArrowUpRight } from "lucide-react";
import type { UnifiedContentItem } from "@/lib/content-utils";

interface ContentCardProps {
    item: UnifiedContentItem;
    variant?: "horizontal" | "vertical" | "featured";
    showExcerpt?: boolean;
    rank?: number;
}

const typeConfig = {
    briefing: {
        label: "Briefing",
        labelKO: "브리핑",
        icon: TrendingUp,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-l-emerald-400",
        accentGlow: "group-hover:shadow-emerald-400/10",
    },
    research: {
        label: "Research",
        labelKO: "리서치",
        icon: FileText,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-l-blue-400",
        accentGlow: "group-hover:shadow-blue-400/10",
    },
    blog: {
        label: "Blog",
        labelKO: "블로그",
        icon: BookOpen,
        color: "text-[var(--accent)]",
        bg: "bg-[var(--accent)]/10",
        border: "border-l-[var(--accent)]",
        accentGlow: "group-hover:shadow-[var(--accent)]/10",
    },
};

const biasColors = {
    long: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20",
    short: "text-red-400 bg-red-400/10 border border-red-400/20",
    neutral: "text-amber-400 bg-amber-400/10 border border-amber-400/20",
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
}

export function ContentCard({ item, variant = "horizontal", showExcerpt = true, rank }: ContentCardProps) {
    const locale = useLocale();
    const config = typeConfig[item.type];
    const Icon = config.icon;

    if (variant === "featured") {
        return (
            <Link
                href={item.href}
                className="group relative flex flex-col justify-end rounded-2xl overflow-hidden border border-[var(--border-default)] bg-cv-elevated transition-all duration-500 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-2xl hover:shadow-[var(--accent)]/8"
            >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)]/60 via-[var(--accent)] to-[var(--accent)]/60" />
                {/* Decorative background pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    {/* Corner accent glow */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-[var(--accent)]/[0.06] rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[var(--accent)]/[0.04] rounded-full blur-3xl" />
                    {/* Grid lines */}
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03]"
                        style={{ backgroundImage: "linear-gradient(rgba(var(--accent-rgb),0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.5) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
                    />
                </div>
                {/* Hover glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[var(--accent)]/[0.06] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10 p-6 md:p-8 space-y-4 flex flex-col justify-end">
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border.replace('border-l-', 'border-')}/20`}>
                            <Icon className="w-3.5 h-3.5" />
                            {locale === "ko" ? config.labelKO : config.label}
                        </span>
                        {item.bias && (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${biasColors[item.bias]}`}>
                                {item.bias.toUpperCase()}
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight line-clamp-3 group-hover:text-[var(--accent)] transition-colors duration-300">
                        {item.title}
                    </h3>
                    {showExcerpt && (
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                            {item.excerpt}
                        </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] pt-2">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(item.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {item.readTime}
                        </span>
                    </div>
                </div>
                <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 z-20">
                    <ArrowUpRight className="w-4 h-4 text-[var(--accent)]" />
                </div>
            </Link>
        );
    }

    if (variant === "vertical") {
        return (
            <Link
                href={item.href}
                className={`group flex flex-col rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-cv-elevated transition-all duration-400 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-lg hover:shadow-black/10 ${config.accentGlow}`}
            >
                <div className="p-5 space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                            <Icon className="w-3 h-3" />
                            {locale === "ko" ? config.labelKO : config.label}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">{formatDate(item.date)}</span>
                    </div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-300">
                        {item.title}
                    </h3>
                    {showExcerpt && (
                        <p className="text-sm text-[var(--text-tertiary)] line-clamp-2 leading-relaxed">
                            {item.excerpt}
                        </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] pt-1">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.readTime}
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    // horizontal (default) — with left accent border + thumbnail
    return (
        <Link
            href={item.href}
            className={`group flex items-start gap-4 p-4 rounded-xl border-l-[3px] ${config.border} border border-[var(--border-subtle)] bg-cv-elevated transition-all duration-400 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-lg hover:shadow-black/10 ${config.accentGlow}`}
        >
            {rank !== undefined && (
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${rank <= 3 ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-[var(--bg-surface)] text-[var(--text-muted)]"}`}>
                    {rank}
                </div>
            )}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {locale === "ko" ? config.labelKO : config.label}
                    </span>
                    {item.bias && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${biasColors[item.bias]}`}>
                            {item.bias.toUpperCase()}
                        </span>
                    )}
                    <span className="text-xs text-[var(--text-muted)]">{formatDate(item.date)}</span>
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-300">
                    {item.title}
                </h3>
                {showExcerpt && (
                    <p className="text-sm text-[var(--text-tertiary)] line-clamp-2 leading-relaxed">
                        {item.excerpt}
                    </p>
                )}
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.readTime}
                    </span>
                </div>
            </div>
            {/* Thumbnail visual block */}
            <div className={`hidden sm:flex flex-shrink-0 w-16 h-16 rounded-xl ${config.bg} items-center justify-center self-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${config.color} opacity-60`} />
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "8px 8px" }}
                />
            </div>
        </Link>
    );
}
