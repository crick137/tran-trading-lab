"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Shield } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aceternity/aurora-background";
import { XIcon, TelegramIcon } from "@/lib/social-icons";

const socialLinks = [
    { href: "https://x.com/TranTradingLab", icon: <XIcon />, label: "X" },
    { href: "https://t.me/TranTradingLabEN", icon: <TelegramIcon />, label: "TG EN" },
    { href: "https://t.me/TranTradingLabKR", icon: <TelegramIcon />, label: "TG KR" },
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

    // Lightweight scroll parallax (kept — no JS animation, just transform binding)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
        >
            {/* Aurora background — low opacity */}
            <div aria-hidden="true">
                <AuroraBackground className="absolute inset-0 opacity-[0.6]" />
            </div>

            {/* Content with scroll parallax */}
            <motion.div
                style={{ y: contentY, opacity: contentOpacity }}
                className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center"
            >
                {/* Badge */}
                <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-wash)] mb-8">
                    <Shield className="w-3.5 h-3.5 text-accent" />
                    <span className="text-overline text-[var(--text-secondary)]">
                        {t("heroBadge")}
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="hero-title text-display text-gradient-gold mb-8">
                    {t("heroTitle")}
                </h1>

                {/* Subtitle */}
                <p className="hero-subtitle text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed text-[var(--text-secondary)]">
                    {t("heroSubtitle")}
                </p>

                {/* Tagline — italic, subtle */}
                <p className="hero-tagline text-[13px] italic text-[var(--text-muted)] mb-12">
                    {t("heroTagline")}
                </p>

                {/* CTA Buttons */}
                <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                    <Link
                        href={`/${locale}/subscribe`}
                        className="group h-12 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 text-[#0a0a0f] hover:brightness-110 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
                        style={{ background: "var(--gradient-cta)" }}
                    >
                        {t("heroPrimaryCta")}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href={`/${locale}/about`}
                        className="h-12 px-8 rounded-xl border border-[var(--border-default)] font-semibold text-[var(--text-secondary)] transition-all duration-200 flex items-center hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] hover:-translate-y-px"
                    >
                        {t("heroSecondaryCta")}
                    </Link>
                </div>

                {/* Social Platform Icons — icon only, 20px, white → gold hover */}
                <div className="hero-social flex justify-center gap-4 mb-8">
                    {socialLinks.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-accent transition-colors duration-200"
                            aria-label={social.label}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>

                {/* Stats Row — overline style */}
                <div className="hero-stats flex justify-center items-center gap-6 sm:gap-8">
                    {stats.map((stat, index) => (
                        <div key={stat.label} className="flex items-center gap-6 sm:gap-8">
                            {index > 0 && (
                                <div className="h-8 w-px bg-[var(--border-default)]" />
                            )}
                            <div className="text-center">
                                <p className="text-xl sm:text-2xl font-bold tabular-nums font-data text-gradient-gold">
                                    {stat.numericTarget !== null ? (
                                        <CountUp target={stat.numericTarget} suffix={stat.suffix} />
                                    ) : (
                                        stat.value
                                    )}
                                </p>
                                <p className="text-overline text-[var(--text-muted)] mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
