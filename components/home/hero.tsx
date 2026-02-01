"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, TrendingUp, BarChart3, Newspaper } from "lucide-react";

export function Hero() {
    const locale = useLocale();
    const t = useTranslations("home");
    const tc = useTranslations("common");

    const features = [
        {
            icon: TrendingUp,
            titleKey: "research",
            descKey: "researchDesc",
        },
        {
            icon: BarChart3,
            titleKey: "strategy",
            descKey: "strategyDesc",
        },
        {
            icon: Newspaper,
            titleKey: "news",
            descKey: "newsDesc",
        },
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 text-sm text-muted-foreground mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {t("heroDescription")}
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
                    >
                        <span className="text-gradient-gold">{t("heroTitle")}</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
                    >
                        {t("heroSubtitle")}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link
                            href={`/${locale}/blog`}
                            className="group px-8 py-4 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-semibold transition-all hover:shadow-xl hover:shadow-gold/30 flex items-center gap-2"
                        >
                            {tc("blog")}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            className="px-8 py-4 rounded-lg border border-border hover:border-gold/50 text-foreground font-semibold transition-all hover:bg-card"
                        >
                            {tc("joinTelegram")}
                        </Link>
                    </motion.div>
                </div>

                {/* Feature Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        {
                            icon: TrendingUp,
                            title: tc("research"),
                            description: t("heroDescription"),
                        },
                        {
                            icon: BarChart3,
                            title: tc("playbooks"),
                            description: t("heroSubtitle"),
                        },
                        {
                            icon: Newspaper,
                            title: tc("blog"),
                            description: t("heroDescription"),
                        },
                    ].map((feature) => (
                        <div
                            key={feature.title}
                            className="group p-6 rounded-xl bg-card/50 border border-border/50 card-hover border-glow"
                        >
                            <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-4 service-icon">
                                <feature.icon className="w-8 h-8 text-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
