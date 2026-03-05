/**
 * Server-side content utilities.
 * Reads content from MDX files and returns UnifiedContentItem arrays.
 *
 * IMPORTANT: This file uses the server-side content reader (fs/path).
 * It can ONLY be imported in Server Components or server-side code.
 * Do NOT import this in any file with "use client" directive.
 */

import { getDailyBriefs } from "./content-reader.server";
import type { DailyBrief } from "./daily-brief-data";
import type { UnifiedContentItem, ContentCategory } from "./content-utils";
export type { UnifiedContentItem, ContentCategory } from "./content-utils";
export { CONTENT_CATEGORIES } from "./content-utils";

// ─── Mappers ────────────────────────────────────────────
function briefToContentItem(brief: DailyBrief, locale: string): UnifiedContentItem {
    return {
        id: `briefing-${brief.date}-${brief.locale}`,
        type: "briefing",
        slug: brief.date,
        title: brief.title,
        excerpt: brief.description,
        date: brief.date,
        readTime: brief.readingTime,
        category: "market-analysis",
        tags: brief.tags,
        href: `/${locale}/briefings/${brief.date}`,
    };
}

// ─── Public API ─────────────────────────────────────────
export function getAllContent(locale: "en" | "ko"): UnifiedContentItem[] {
    const briefs = getDailyBriefs(locale).map((b) => briefToContentItem(b, locale));
    // Blog and research are empty for now — add when MDX content is created
    return briefs.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getFeaturedContent(locale: "en" | "ko", count = 3): UnifiedContentItem[] {
    const all = getAllContent(locale);
    const featured = all.filter((item) => item.isFeatured);
    if (featured.length >= count) return featured.slice(0, count);
    return all.slice(0, count);
}

export function getContentByType(
    locale: "en" | "ko",
    type: "briefing" | "research" | "blog"
): UnifiedContentItem[] {
    return getAllContent(locale).filter((item) => item.type === type);
}

export function getContentByCategory(
    locale: "en" | "ko",
    category: string
): UnifiedContentItem[] {
    if (category === "all") return getAllContent(locale);
    return getAllContent(locale).filter((item) => item.category === category);
}

export function getPopularContent(locale: "en" | "ko", count = 5): UnifiedContentItem[] {
    return getAllContent(locale).slice(0, count);
}

export function getContentStats(locale: "en" | "ko") {
    const all = getAllContent(locale);
    return {
        total: all.length,
        briefings: all.filter((i) => i.type === "briefing").length,
        blogs: all.filter((i) => i.type === "blog").length,
        research: all.filter((i) => i.type === "research").length,
    };
}
