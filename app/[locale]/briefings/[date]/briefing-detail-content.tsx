"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SocialShare } from "@/components/blog/social-share";
import { ArticleCTA } from "@/components/blog/article-cta";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
    ArrowLeft,
    Calendar,
    CalendarClock,
    Clock,
    Tag,
    TrendingUp,
    TrendingDown,
    Minus,
    Target,
    Zap,
    AlertTriangle,
    Radio,
} from "lucide-react";
import { motion } from "framer-motion";
import type { DailyBrief, MarketOverviewItem, KeyLevel, Scenario } from "@/lib/daily-brief-data";
import { MarkdownRenderer, MarkdownInline } from "@/components/content/markdown-renderer";

function MarketOverviewTable({ items, t }: { items: MarketOverviewItem[]; t: (key: string) => string }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-[var(--border-default)]">
            <table className="w-full border-collapse text-sm min-w-[500px]">
                <thead>
                    <tr>
                        <th className="border-b border-[var(--border-default)] px-4 py-3 bg-accent/10 text-accent text-left font-semibold">
                            {t("asset")}
                        </th>
                        <th className="border-b border-[var(--border-default)] px-4 py-3 bg-accent/10 text-accent text-left font-semibold">
                            {t("last")}
                        </th>
                        <th className="border-b border-[var(--border-default)] px-4 py-3 bg-accent/10 text-accent text-left font-semibold">
                            {t("change")}
                        </th>
                        <th className="border-b border-[var(--border-default)] px-4 py-3 bg-accent/10 text-accent text-left font-semibold">
                            {t("signal")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr key={item.asset} className={i % 2 === 0 ? "bg-[var(--bg-wash)]" : ""}>
                            <td className="border-b border-[var(--border-subtle)] px-4 py-3 font-semibold text-[var(--text-primary)]">
                                {item.asset}
                            </td>
                            <td className="border-b border-[var(--border-subtle)] px-4 py-3 text-[var(--text-secondary)]">
                                {item.last}
                            </td>
                            <td className="border-b border-[var(--border-subtle)] px-4 py-3">
                                <span
                                    className={
                                        item.change.startsWith("+")
                                            ? "text-green-400"
                                            : item.change.startsWith("-")
                                              ? "text-red-400"
                                              : "text-[var(--text-secondary)]"
                                    }
                                >
                                    {item.change}
                                </span>
                            </td>
                            <td className="border-b border-[var(--border-subtle)] px-4 py-3 text-[var(--text-tertiary)]">
                                {item.signal}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function KeyLevelsTable({ levels, t }: { levels: KeyLevel[]; t: (key: string) => string }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-[var(--border-default)]">
            <table className="w-full border-collapse text-sm min-w-[500px]">
                <thead>
                    <tr>
                        <th className="border-b border-[var(--border-default)] px-4 py-3 bg-accent/10 text-accent text-left font-semibold">
                            {t("asset")}
                        </th>
                        <th className="border-b border-[var(--border-default)] px-4 py-3 bg-accent/10 text-accent text-left font-semibold">
                            {t("support")}
                        </th>
                        <th className="border-b border-[var(--border-default)] px-4 py-3 bg-accent/10 text-accent text-left font-semibold">
                            {t("resistance")}
                        </th>
                        <th className="border-b border-[var(--border-default)] px-4 py-3 bg-accent/10 text-accent text-left font-semibold">
                            {t("bias")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {levels.map((level, i) => (
                        <tr key={level.asset} className={i % 2 === 0 ? "bg-[var(--bg-wash)]" : ""}>
                            <td className="border-b border-[var(--border-subtle)] px-4 py-3 font-semibold text-[var(--text-primary)]">
                                {level.asset}
                            </td>
                            <td className="border-b border-[var(--border-subtle)] px-4 py-3 text-red-400">
                                {level.support}
                            </td>
                            <td className="border-b border-[var(--border-subtle)] px-4 py-3 text-green-400">
                                {level.resistance}
                            </td>
                            <td className="border-b border-[var(--border-subtle)] px-4 py-3 text-[var(--text-secondary)]">
                                {level.bias}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ScenarioCard({ scenario }: { scenario: Scenario }) {
    const isPositive = scenario.id === "A";
    return (
        <div
            className={`p-5 rounded-xl border ${
                isPositive
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
            }`}
        >
            <div className="flex items-center gap-2 mb-3">
                {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                    Scenario {scenario.id} ({scenario.probability})
                </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-2">
                <span className="font-medium text-[var(--text-primary)]">If:</span> {scenario.condition}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">Then:</span> {scenario.result}
            </p>
        </div>
    );
}

interface BriefingDetailContentProps {
    brief: DailyBrief | null;
}

export function BriefingDetailContent({ brief }: BriefingDetailContentProps) {
    const locale = useLocale();
    const t = useTranslations("briefingDetail");

    if (!brief) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <Breadcrumb
                        items={[
                            { label: t("briefingsBreadcrumb"), href: `/${locale}/briefings` },
                            { label: brief.title },
                        ]}
                    />

                    {/* Back Link */}
                    <Link
                        href={`/${locale}/briefings`}
                        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t("backToBriefings")}
                    </Link>

                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent mb-4">
                            {t("dailyBrief")}
                        </span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                            {brief.title}
                        </h1>

                        <p className="text-lg text-[var(--text-secondary)] mb-6 max-w-3xl">
                            {brief.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-[var(--text-secondary)] mb-6">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {brief.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {brief.readingTime}
                            </span>
                        </div>

                        {brief.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mb-6">
                                <Tag className="w-4 h-4 text-[var(--text-secondary)]" />
                                {brief.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs rounded-md bg-cv-elevated border border-[var(--border-default)] text-[var(--text-secondary)]"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <SocialShare title={brief.title} />
                    </motion.header>

                    {/* Catalyst & Events */}
                    {(brief.catalyst || (brief.events && brief.events.length > 0)) && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.08 }}
                            className="mb-12 p-5 rounded-xl bg-cv-elevated border border-[var(--border-default)] flex flex-col sm:flex-row gap-6"
                        >
                            {brief.catalyst && (
                                <div className="flex items-start gap-3">
                                    <Radio className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                                            {t("catalyst")}
                                        </p>
                                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                                            {brief.catalyst}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {brief.events && brief.events.length > 0 && (
                                <div className="flex items-start gap-3 sm:border-l sm:border-[var(--border-subtle)] sm:pl-6">
                                    <CalendarClock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                                            {t("events")}
                                        </p>
                                        <ul className="space-y-0.5">
                                            {brief.events.map((event, i) => (
                                                <li key={i} className="text-sm text-[var(--text-secondary)]">
                                                    {event}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </motion.section>
                    )}

                    {/* TL;DR */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-12 p-6 rounded-xl bg-accent/5 border border-accent/20"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 text-accent" />
                            <h2 className="text-lg font-bold text-accent">TL;DR</h2>
                        </div>
                        <ul className="space-y-2">
                            {brief.tldr.map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 text-[var(--text-secondary)]"
                                >
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                    <MarkdownInline content={item} />
                                </li>
                            ))}
                        </ul>
                    </motion.section>

                    {/* Market Overview */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-accent" />
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                {t("marketOverview")}
                            </h2>
                        </div>
                        <MarketOverviewTable items={brief.marketOverview} t={t} />
                    </motion.section>

                    {/* Content Sections */}
                    {brief.sections.map((section, i) => (
                        <motion.section
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                            className="mb-12"
                        >
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] border-l-4 border-accent pl-4 mb-6">
                                {section.title}
                            </h2>
                            <MarkdownRenderer content={section.content} />
                        </motion.section>
                    ))}

                    {/* Key Levels */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Target className="w-5 h-5 text-accent" />
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                {t("keyLevels")}
                            </h2>
                        </div>
                        <KeyLevelsTable levels={brief.keyLevels} t={t} />
                    </motion.section>

                    {/* Scenarios */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <AlertTriangle className="w-5 h-5 text-accent" />
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                {t("scenarios")}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {brief.scenarios.map((scenario) => (
                                <ScenarioCard key={scenario.id} scenario={scenario} />
                            ))}
                        </div>
                    </motion.section>

                    {/* TTL Take */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                        className="mb-12 p-6 rounded-xl bg-cv-elevated border border-[var(--border-default)]"
                    >
                        <h2 className="text-2xl font-bold text-accent mb-4">{t("ttlTake")}</h2>
                        <MarkdownRenderer content={brief.ttlTake} />
                    </motion.section>

                    {/* CTA */}
                    <ArticleCTA />

                    {/* Bottom Share */}
                    <div className="mt-12 pt-8 border-t border-[var(--border-default)]">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-[var(--text-secondary)]">{t("sharePrompt")}</p>
                            <SocialShare title={brief.title} />
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
