"use client";

import { ResearchArticle } from "@/lib/research-data";
import { Calendar, Globe, Clock, BookOpen, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ResearchHeaderProps {
    article: ResearchArticle;
}

export function ResearchHeader({ article }: ResearchHeaderProps) {
    const t = useTranslations("researchPost");

    const biasConfig = {
        long: { label: t("longBias"), color: "bg-bullish/20 text-bullish border-bullish/50", icon: TrendingUp },
        short: { label: t("shortBias"), color: "bg-bearish/20 text-bearish border-bearish/50", icon: TrendingDown },
        neutral: { label: t("neutralBias"), color: "bg-neutral/20 text-neutral border-neutral/50", icon: Minus }
    };

    const bias = biasConfig[article.bias];
    const BiasIcon = bias.icon;

    return (
        <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
        >
            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {article.tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full border border-[var(--border-strong)] bg-[var(--bg-wash)] text-[var(--text-primary)]"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-3 leading-tight">
                {article.title}
            </h1>
            {article.subtitle && (
                <p className="text-xl text-[var(--text-secondary)] mb-6">{article.subtitle}</p>
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    {article.date}
                </span>
                <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-accent" />
                    {article.symbol}
                </span>
                <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    {article.timeframe}
                </span>
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full border ${bias.color}`}>
                    <BiasIcon className="w-4 h-4" />
                    {bias.label}
                </span>
                <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent" />
                    {article.readingTime}{t("readSuffix")}
                </span>
            </div>
        </motion.header>
    );
}
