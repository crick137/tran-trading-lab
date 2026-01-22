"use client";

import { ResearchArticle } from "@/lib/research-data";
import { Calendar, Globe, Clock, BookOpen, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface ResearchHeaderProps {
    article: ResearchArticle;
}

export function ResearchHeader({ article }: ResearchHeaderProps) {
    const biasConfig = {
        long: { label: "Long Bias", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50", icon: TrendingUp },
        short: { label: "Short Bias", color: "bg-red-500/20 text-red-400 border-red-500/50", icon: TrendingDown },
        neutral: { label: "Neutral", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50", icon: Minus }
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
                        className="px-3 py-1 text-xs font-medium rounded-full border border-white/20 bg-white/5 text-white/80"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
                {article.title}
            </h1>
            {article.subtitle && (
                <p className="text-xl text-muted-foreground mb-6">{article.subtitle}</p>
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    {article.date}
                </span>
                <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gold" />
                    {article.symbol}
                </span>
                <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold" />
                    {article.timeframe}
                </span>
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full border ${bias.color}`}>
                    <BiasIcon className="w-4 h-4" />
                    {bias.label}
                </span>
                <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gold" />
                    {article.readingTime} read
                </span>
            </div>
        </motion.header>
    );
}
