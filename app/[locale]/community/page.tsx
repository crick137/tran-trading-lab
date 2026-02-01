"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Send, MessageCircle, ArrowRight, Sparkles, Globe, Rocket } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CommunityPage() {
    const t = useTranslations("community");
    const tc = useTranslations("common");

    const links = [
        {
            name: t("tgEnName"),
            label: t("tgEnLabel"),
            description: t("tgEnDesc"),
            descriptionKr: t("tgEnDescKr"),
            icon: Send,
            href: "https://t.me/TranTradingLabEN",
            color: "from-blue-500 to-cyan-400",
            bgGlow: "bg-blue-500/20",
        },
        {
            name: t("tgKrName"),
            label: t("tgKrLabel"),
            description: t("tgKrDesc"),
            descriptionKr: t("tgKrDescKr"),
            icon: Send,
            href: "https://t.me/http4477",
            color: "from-sky-400 to-blue-500",
            bgGlow: "bg-sky-500/20",
        },
        {
            name: t("kakaoName"),
            label: t("kakaoLabel"),
            description: t("kakaoDesc"),
            descriptionKr: t("kakaoDescKr"),
            icon: MessageCircle,
            href: "https://invite.kakao.com/tc/luxHFht3xL",
            color: "from-yellow-400 to-amber-500",
            bgGlow: "bg-yellow-500/20",
        },
        {
            name: t("startName"),
            label: t("startLabel"),
            description: t("startDesc"),
            descriptionKr: t("startDescKr"),
            icon: Rocket,
            href: "/start",
            color: "from-gold to-gold-light",
            bgGlow: "bg-gold/20",
            isInternal: true,
        },
    ];

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-20">
                {/* Hero Section */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-2xl mx-auto"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-gold-light mb-6 shadow-lg shadow-gold/30">
                                <Globe className="w-10 h-10 text-background" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                                    TRAN Trading Lab
                                </span>
                            </h1>

                            <p className="text-lg text-muted-foreground mb-2">
                                {t("title")} · {t("subtitle")}
                            </p>
                            <p className="text-sm text-muted-foreground/70">
                                {t("joinOurCommunity")}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Link Cards */}
                <section className="py-8 pb-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col gap-4 max-w-md mx-auto">
                            {links.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        target={link.isInternal ? "_self" : "_blank"}
                                        rel={link.isInternal ? undefined : "noopener noreferrer"}
                                        className="block group"
                                    >
                                        <div className="relative p-5 rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:border-gold/50 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(212,175,55,0.15)] hover:-translate-y-1 overflow-hidden">
                                            <div className={`absolute top-0 right-0 w-32 h-32 ${link.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl`} />

                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg flex-shrink-0 transition-transform group-hover:scale-110`}>
                                                    <link.icon className="w-6 h-6 text-white" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="text-lg font-bold text-foreground group-hover:text-gold transition-colors">
                                                            {link.name}
                                                        </h2>
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-gold/10 text-gold border border-gold/30">
                                                            {link.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {link.description} · {link.descriptionKr}
                                                    </p>
                                                </div>

                                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-all group-hover:translate-x-1 flex-shrink-0" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-12 text-center"
                        >
                            <div className="inline-flex items-center gap-2 text-gold text-sm mb-4">
                                <Sparkles className="w-4 h-4" />
                                <span>{tc("freeToJoin")} · 免费加入 · 무료 가입</span>
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <p className="text-xs text-muted-foreground/60">
                                © {new Date().getFullYear()} TRAN Trading Lab · {tc("allRightsReserved")}
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
