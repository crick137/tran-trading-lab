"use client";

import { useTranslations } from "next-intl";
import { BarChart3, Target, Shield, Globe } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

const features = [
    { icon: BarChart3, titleKey: "whatYouGet1Title", descKey: "whatYouGet1Desc" },
    { icon: Target, titleKey: "whatYouGet2Title", descKey: "whatYouGet2Desc" },
    { icon: Shield, titleKey: "whatYouGet3Title", descKey: "whatYouGet3Desc" },
    { icon: Globe, titleKey: "whatYouGet4Title", descKey: "whatYouGet4Desc" },
] as const;

export function WhatYouGet() {
    const t = useTranslations("home");
    const gridRef = useGsapScroll<HTMLDivElement>({
        children: true,
        stagger: 0.1,
    });

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-content mx-auto">
                <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider text-center mb-8">
                    {t("whatYouGetTitle")}
                </h2>

                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature) => (
                        <TiltCard key={feature.titleKey}>
                            <div className="p-6 rounded-xl bg-cv-elevated border border-white/5 card-hover h-full">
                                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                                    <feature.icon className="w-5 h-5 text-gold" />
                                </div>
                                <h3 className="text-base font-semibold text-white/90 mb-2">
                                    {t(feature.titleKey)}
                                </h3>
                                <p className="text-sm text-white/40 leading-relaxed">
                                    {t(feature.descKey)}
                                </p>
                            </div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
