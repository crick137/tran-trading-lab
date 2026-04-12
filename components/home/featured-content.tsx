"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { ContentCard } from "@/components/content/content-card";
import type { UnifiedContentItem } from "@/lib/content-utils";

interface FeaturedContentProps {
    items: UnifiedContentItem[];
}

export function FeaturedContent({ items }: FeaturedContentProps) {
    const t = useTranslations("home");

    const featured = useMemo(() => {
        const feat = items.filter((item) => item.isFeatured);
        if (feat.length >= 3) return feat.slice(0, 3);
        return items.slice(0, 3);
    }, [items]);

    if (featured.length === 0) return null;

    return (
        <section className="relative">
            {/* Ambient glow behind featured section */}
            <div className="ambient-glow ambient-glow-gold absolute top-1/2 left-1/4 -translate-y-1/2 z-0 opacity-30" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                    <h2 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider animated-underline active">
                        {t("featuredTitle")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Main featured card (large) — with gradient border */}
                    <div className="md:row-span-2 [&>a]:h-full gradient-border-animated rounded-2xl">
                        <ContentCard
                            item={featured[0]}
                            variant="featured"
                        />
                    </div>

                {/* Side featured cards (stacked) */}
                {featured.slice(1, 3).map((item) => (
                    <ContentCard
                        key={item.id}
                        item={item}
                        variant="vertical"
                    />
                ))}
                </div>
            </div>
        </section>
    );
}
