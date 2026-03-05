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
        <section>
            <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
                    {t("featuredTitle")}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Main featured card (large) */}
                <div className="md:row-span-2 [&>a]:h-full">
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
        </section>
    );
}
