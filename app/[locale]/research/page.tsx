"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { researchArticles } from "@/lib/research-data";
import { Calendar, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

export default function ResearchPage() {
    const locale = useLocale();
    const t = useTranslations("research");

    const biasConfig = {
        long: { label: "Long", color: "bg-bullish/20 text-bullish", icon: TrendingUp },
        short: { label: "Short", color: "bg-bearish/20 text-bearish", icon: TrendingDown },
        neutral: { label: "Neutral", color: "bg-neutral/20 text-neutral", icon: Minus }
    };

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            {t("title")}
                        </h1>
                        <p className="text-white/50 max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Articles Grid */}
                    {researchArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {researchArticles.map((article, index) => {
                                const bias = biasConfig[article.bias];
                                const BiasIcon = bias.icon;

                                return (
                                    <motion.div
                                        key={article.slug}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={`/${locale}/research/${article.slug}`}
                                            className="block group"
                                        >
                                            <article className="bg-cv-elevated/50 border border-white/10 rounded-xl overflow-hidden hover:border-gold/50 transition-all duration-300 card-hover">
                                                {/* Image */}
                                                <div className="relative aspect-video overflow-hidden">
                                                    <Image
                                                        src={article.image}
                                                        alt={article.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    {/* Bias Badge */}
                                                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${bias.color}`}>
                                                        <BiasIcon className="w-3 h-3" />
                                                        {bias.label}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5">
                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {article.tags.slice(0, 3).map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Title */}
                                                    <h2 className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors line-clamp-2">
                                                        {article.title}
                                                    </h2>

                                                    {/* Meta */}
                                                    <div className="flex items-center gap-4 text-xs text-white/50">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {article.date}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {article.readingTime}
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-white/50">
                                {t("noResearch")}
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
