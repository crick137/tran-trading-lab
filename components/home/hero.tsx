"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Shield, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import dynamic from "next/dynamic";
import { AuroraBackground } from "@/components/ui/aceternity/aurora-background";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { TextGenerateEffect } from "@/components/ui/aceternity/text-generate-effect";

const ParticlesCanvas = dynamic(
    () => import("@/components/ui/particles-canvas").then((mod) => mod.ParticlesCanvas),
    { ssr: false }
);

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

    // GSAP scroll indicator fade
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const indicator = document.getElementById("scroll-indicator");
        if (!indicator) return;

        const tween = gsap.to(indicator, {
            opacity: 0,
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "20% top",
                scrub: true,
            },
        });

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Layer 1: Aurora Background */}
            <div aria-hidden="true">
                <AuroraBackground className="absolute inset-0">
                    {/* Layer 2: Particle Network */}
                    <ParticlesCanvas className="z-[1]" />
                </AuroraBackground>

                {/* Layer 3: Spotlight (desktop only) */}
                <div className="hidden md:block">
                    <Spotlight size={500} />
                </div>
            </div>

            {/* Content with scroll parallax */}
            <motion.div
                style={{ y: contentY, opacity: contentOpacity }}
                className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center"
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
                    <Shield className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs text-white/60 font-medium tracking-wide uppercase">
                        {t("heroBadge")}
                    </span>
                </motion.div>

                {/* Main Heading — word-by-word reveal */}
                <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tightest mb-6">
                    <TextGenerateEffect
                        words={t("heroTitle")}
                        className="text-gradient-gold"
                        delay={0.3}
                        staggerDelay={0.12}
                    />
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
                    className="text-sm mb-10"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {t("heroTagline")}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
                >
                    <Link
                        href={`/${locale}/dashboard`}
                        className="group px-8 py-3.5 rounded-lg font-semibold transition-all flex items-center gap-2 text-cv-void hover:shadow-xl hover:shadow-gold/20 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: "var(--gradient-cta)" }}
                    >
                        {t("heroPrimaryCta")}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href={`/${locale}/subscribe`}
                        className="px-8 py-3.5 rounded-lg border font-semibold transition-all hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98]"
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
                    className="text-sm"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {t("heroSocialProof")}
                </motion.p>
            </motion.div>

            {/* Scroll Indicator */}
            <div
                id="scroll-indicator"
                aria-hidden="true"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
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
                        className="w-5 h-5"
                        style={{ color: "var(--text-tertiary)" }}
                    />
                </motion.div>
            </div>
        </section>
    );
}
