"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { GraduationCap, ArrowRight, CheckCircle2, Clock } from "lucide-react";

export default function PlaybooksPage() {
    const locale = useLocale();
    const t = useTranslations("playbooks");
    const tc = useTranslations("common");

    const modules = [
        {
            id: "smc-101",
            title: t("smcTitle"),
            description: t("smcDesc"),
            lessons: 5,
            duration: "45min",
            available: true,
            topics: t.raw("smcTopics") as string[],
        },
        {
            id: "order-block",
            title: t("obTitle"),
            description: t("obDesc"),
            lessons: 4,
            duration: "40min",
            available: true,
            topics: t.raw("obTopics") as string[],
        },
        {
            id: "fvg-mastery",
            title: t("fvgTitle"),
            description: t("fvgDesc"),
            lessons: 4,
            duration: "35min",
            available: true,
            topics: t.raw("fvgTopics") as string[],
        },
        {
            id: "liquidity",
            title: t("liquidityTitle"),
            description: t("liquidityDesc"),
            lessons: 5,
            duration: "50min",
            available: false,
            topics: t.raw("liquidityTopics") as string[],
        },
        {
            id: "orb-strategy",
            title: t("orbTitle"),
            description: t("orbDesc"),
            lessons: 6,
            duration: "55min",
            available: true,
            topics: t.raw("orbTopics") as string[],
        },
        {
            id: "risk-management",
            title: t("riskTitle"),
            description: t("riskDesc"),
            lessons: 4,
            duration: "30min",
            available: true,
            topics: t.raw("riskTopics") as string[],
        },
    ];

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={[{ label: tc("playbooks") }]} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <GraduationCap className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </motion.div>

                    {/* Modules Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((module, index) => (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-6 rounded-xl bg-card border border-border/50 hover:border-gold/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                                        {module.title}
                                    </h3>
                                    {module.available ? (
                                        <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-500">{tc("free")}</span>
                                    ) : (
                                        <span className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {tc("preparing")}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                                    <span>{module.lessons}{tc("lessons")}</span>
                                    <span>•</span>
                                    <span>{module.duration}</span>
                                </div>
                                <div className="space-y-1 mb-4">
                                    {module.topics.slice(0, 3).map((topic) => (
                                        <div key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="w-3 h-3 text-gold" />
                                            {topic}
                                        </div>
                                    ))}
                                    {module.topics.length > 3 && (
                                        <div className="text-sm text-muted-foreground">
                                            +{module.topics.length - 3}{tc("more")}
                                        </div>
                                    )}
                                </div>
                                {module.available ? (
                                    <Link
                                        href={`/${locale}/playbooks/${module.id}`}
                                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium transition-all bg-gold/10 text-gold hover:bg-gold/20"
                                    >
                                        {tc("startLearning")}
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium bg-muted text-muted-foreground cursor-not-allowed">
                                        {tc("contentPreparing")}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
