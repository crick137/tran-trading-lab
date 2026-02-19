"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Shield, ChevronDown } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aceternity/aurora-background";
import { XIcon, ThreadsIcon, TelegramIcon, KakaoIcon } from "@/lib/social-icons";

const socialLinks = [
    { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X", brandColor: "rgba(255,255,255,0.85)" },
    { href: "https://www.threads.com/@_trantradinglab_", icon: <ThreadsIcon />, label: "Threads", brandColor: "rgba(255,255,255,0.85)" },
    { href: "https://t.me/TranTradingLabEN", icon: <TelegramIcon />, label: "TG EN", brandColor: "#26A5E4" },
    { href: "https://t.me/TranTradingLabKR", icon: <TelegramIcon />, label: "TG KR", brandColor: "#26A5E4" },
    { href: "https://invite.kakao.com/tc/luxHFht3xL", icon: <KakaoIcon />, label: "KakaoTalk", brandColor: "#FEE500" },
];

const stats = [
    { value: "2022", numericTarget: null, suffix: "", label: "Since" },
    { value: "5", numericTarget: 5, suffix: "", label: "Platforms" },
    { value: "EN/KR", numericTarget: null, suffix: "", label: "Bilingual" },
];

function CountUp({ target, suffix, duration = 1500 }: { target: number; suffix: string; duration?: number }) {
    const [value, setValue] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration]);

    return <>{value}{suffix}</>;
}

export function Hero() {
    const locale = useLocale();
    const t = useTranslations("home");
    const sectionRef = useRef<HTMLElement>(null);

    // Framer Motion scroll-based parallax for content
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[75vh] flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div aria-hidden="true">
                <AuroraBackground className="absolute inset-0" />
            </div>

            {/* Content with scroll parallax */}
            <motion.div
                style={{ y: contentY, opacity: contentOpacity }}
                className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8"
                    style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                    }}
                >
                    <Shield className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs text-[var(--text-secondary)] font-medium tracking-wide uppercase">
                        {t("heroBadge")}
                    </span>
                </motion.div>

                {/* Main Heading */}
                <h1 className="text-display text-gradient-gold mb-6">
                    {t("heroTitle")}
                </h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                >
                    {t("heroSubtitle")}
                </motion.p>

                {/* Sub-tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="text-sm mb-8"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {t("heroTagline")}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
                >
                    <Link
                        href={`/${locale}/subscribe`}
                        className="group px-8 py-3.5 rounded-lg font-semibold transition-all flex items-center gap-2 text-cv-void hover:shadow-xl hover:shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: "var(--gradient-cta)" }}
                    >
                        {t("heroPrimaryCta")}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href={`/${locale}/about`}
                        className="px-8 py-3.5 rounded-lg border font-semibold transition-all hover:bg-[var(--bg-wash)] hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            borderColor: "rgba(255, 255, 255, 0.10)",
                            color: "rgba(255, 255, 255, 0.8)",
                        }}
                    >
                        {t("heroSecondaryCta")}
                    </Link>
                </motion.div>

                {/* Social Proof */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                    className="text-sm mb-5"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {t("heroSocialProof")}
                </motion.p>

                {/* Social Platform Icons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                    className="flex justify-center gap-3 mb-6"
                >
                    {socialLinks.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-1 group"
                            aria-label={social.label}
                        >
                            <span
                                className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all group-hover:scale-110"
                                style={{
                                    background: `${social.brandColor}08`,
                                    borderColor: `${social.brandColor}20`,
                                    color: `${social.brandColor}99`,
                                }}
                            >
                                {social.icon}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                                {social.label}
                            </span>
                        </a>
                    ))}
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    className="flex justify-center items-center gap-6 sm:gap-8"
                >
                    {stats.map((stat, index) => (
                        <>
                            {index > 0 && (
                                <div key={`divider-${index}`} className="h-8 w-px bg-[var(--border-default)]" />
                            )}
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl sm:text-3xl font-bold font-data text-gradient-gold">
                                    {stat.numericTarget !== null ? (
                                        <CountUp target={stat.numericTarget} suffix={stat.suffix} />
                                    ) : (
                                        stat.value
                                    )}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{stat.label}</p>
                            </div>
                        </>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <div
                id="scroll-indicator"
                aria-hidden="true"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <ChevronDown
                        className="w-6 h-6"
                        style={{ color: "var(--text-tertiary)" }}
                    />
                </motion.div>
            </div>
        </section>
    );
}
