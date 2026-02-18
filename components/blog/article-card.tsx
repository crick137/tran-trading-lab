"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { Clock, Calendar } from "lucide-react";

interface ArticleCardProps {
    title: string;
    excerpt: string;
    slug: string;
    category: string;
    date: string;
    readingTime: string;
    image?: string;
    index?: number;
}

// Unified gold color scheme with different opacities
const categoryColors: Record<string, string> = {
    analysis: "bg-gold/30 text-gold-light",
    strategy: "bg-gold/20 text-gold",
    news: "bg-gold/15 text-gold-dark border border-gold/30",
};

export function ArticleCard({
    title,
    excerpt,
    slug,
    category,
    date,
    readingTime,
    image,
    index = 0,
}: ArticleCardProps) {
    const t = useTranslations("blog");
    const ref = useGsapScroll<HTMLElement>();

    const categoryLabelKeys: Record<string, string> = {
        analysis: "categoryAnalysis",
        strategy: "categoryStrategy",
        news: "categoryNews",
    };

    return (
        <article ref={ref} className="group">
            <Link href={`/blog/${slug}`} className="block">
                <div className="relative overflow-hidden rounded-xl bg-cv-elevated border border-white/5 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:border-gold/50 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(212,175,55,0.15)]">
                    {/* Image */}
                    {image && (
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cv-elevated to-transparent" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {/* Category Badge */}
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${categoryColors[category] || "bg-white/10 text-white/40"
                                }`}
                        >
                            {categoryLabelKeys[category] ? t(categoryLabelKeys[category]) : category}
                        </span>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-white/90 mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                            {title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-white/40 line-clamp-2 mb-4">
                            {excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-white/30">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {readingTime}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}
