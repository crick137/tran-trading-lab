"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Rocket, TrendingUp, Globe, ArrowRight, CheckCircle2 } from "lucide-react";

export default function StartPage() {
    const locale = useLocale();
    const t = useTranslations("start");
    const tc = useTranslations("common");

    const paths = [
        {
            id: "beginner",
            icon: Rocket,
            title: t("beginnerTitle"),
            subtitle: t("beginnerSubtitle"),
            color: "from-emerald-500/20 to-emerald-500/5",
            borderColor: "border-emerald-500/30",
            steps: [
                { label: t("beginnerStep1"), href: `/${locale}/research` },
                { label: t("beginnerStep2"), href: `/${locale}/glossary` },
                { label: t("beginnerStep3"), href: `/${locale}/playbooks` },
                { label: t("beginnerStep4"), href: "https://t.me/TranTradingLab" },
            ],
        },
        {
            id: "trader",
            icon: TrendingUp,
            title: t("traderTitle"),
            subtitle: t("traderSubtitle"),
            color: "from-gold/20 to-gold/5",
            borderColor: "border-gold/30",
            steps: [
                { label: t("traderStep1"), href: `/${locale}/playbooks` },
                { label: t("traderStep2"), href: `/${locale}/tools` },
                { label: t("traderStep3"), href: `/${locale}/briefings` },
                { label: t("traderStep4"), href: "https://t.me/TranTradingLab" },
            ],
        },
        {
            id: "macro",
            icon: Globe,
            title: t("macroTitle"),
            subtitle: t("macroSubtitle"),
            color: "from-blue-500/20 to-blue-500/5",
            borderColor: "border-blue-500/30",
            steps: [
                { label: t("macroStep1"), href: `/${locale}/reports` },
                { label: t("macroStep2"), href: `/${locale}/blog` },
                { label: t("macroStep3"), href: `/${locale}/briefings` },
                { label: t("macroStep4"), href: `/${locale}#subscribe` },
            ],
        },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: tc("start") }]} />

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                            <span className="text-gradient-gold">{t("title")}</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </motion.div>

                    {/* Paths */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {paths.map((path, index) => (
                            <motion.div
                                key={path.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 rounded-xl bg-gradient-to-b ${path.color} border ${path.borderColor}`}
                            >
                                <div className="w-14 h-14 rounded-lg bg-card flex items-center justify-center mb-4">
                                    <path.icon className="w-7 h-7 text-gold" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground mb-1">{path.title}</h2>
                                <p className="text-sm text-muted-foreground mb-6">{path.subtitle}</p>

                                <div className="space-y-3">
                                    {path.steps.map((step, i) => (
                                        <Link
                                            key={i}
                                            href={step.href}
                                            target={step.href.startsWith("http") ? "_blank" : undefined}
                                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-card border border-border/50 flex items-center justify-center text-xs font-medium group-hover:border-gold/50 group-hover:text-gold transition-colors">
                                                {i + 1}
                                            </span>
                                            {step.label}
                                            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* What We Provide */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid md:grid-cols-2 gap-8"
                    >
                        <div className="p-6 rounded-xl bg-card/50 border border-border/50">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                {t("whatWeProvide")}
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>✓ {t("provide1")}</li>
                                <li>✓ {t("provide2")}</li>
                                <li>✓ {t("provide3")}</li>
                                <li>✓ {t("provide4")}</li>
                                <li>✓ {t("provide5")}</li>
                                <li>✓ {t("provide6")}</li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-xl bg-card/50 border border-red-500/20">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <span className="text-red-500">✕</span>
                                {t("whatWeDoNotProvide")}
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>✕ {t("notProvide1")}</li>
                                <li>✕ {t("notProvide2")}</li>
                                <li>✕ {t("notProvide3")}</li>
                                <li>✕ {t("notProvide4")}</li>
                            </ul>
                            <p className="mt-4 text-xs text-muted-foreground/70">
                                ⚠️ {t("disclaimer")}
                            </p>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 text-center"
                    >
                        <p className="text-muted-foreground mb-4">{t("readFirstReport")}</p>
                        <Link
                            href={`/${locale}/research`}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-gold to-gold-light text-background font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all"
                        >
                            {t("viewSampleReport")}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
