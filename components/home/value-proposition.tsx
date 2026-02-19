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
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)]">
            <div className="flex items-center justify-center gap-8 sm:gap-10 max-w-2xl mx-auto">
                {propositions.map((prop, i) => (
                    <div key={prop.labelKey} className="flex items-center gap-2.5">
                        {i > 0 && (
                            <div className="w-px h-5 bg-[var(--border-default)] -ml-4 mr-1 sm:-ml-5 sm:mr-0" />
                        )}
                        <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                            <prop.icon className="w-3.5 h-3.5 text-accent" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">{t(prop.labelKey)}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
