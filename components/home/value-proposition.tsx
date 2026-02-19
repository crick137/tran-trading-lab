"use client";

import { useTranslations } from "next-intl";
import { Shield, BarChart3, Globe } from "lucide-react";

const propositions = [
    { icon: Shield, labelKey: "vpRiskFirst" },
    { icon: BarChart3, labelKey: "vpDataDriven" },
    { icon: Globe, labelKey: "vpBilingual" },
] as const;

export function ValueProposition() {
    const t = useTranslations("home");

    return (
        <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-white/5">
            <div className="flex items-center justify-center gap-6 sm:gap-8 max-w-2xl mx-auto">
                {propositions.map((prop, i) => (
                    <div key={prop.labelKey} className="flex items-center gap-2">
                        {i > 0 && (
                            <div className="w-px h-4 bg-white/10 -ml-3 mr-1 sm:-ml-4 sm:mr-0 hidden sm:block" />
                        )}
                        <prop.icon className="w-4 h-4 text-gold shrink-0" />
                        <span className="text-sm text-white/50 whitespace-nowrap">{t(prop.labelKey)}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
