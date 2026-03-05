/**
 * Server-side content reader for MDX files.
 * Reads briefing/blog/research content from the `content/` directory.
 *
 * IMPORTANT: This file uses Node.js `fs` and `path` modules.
 * It can ONLY be imported in Server Components or server-side code (generateMetadata, generateStaticParams, etc.)
 * Do NOT import this in any file with "use client" directive.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { DailyBrief, MarketOverviewItem, KeyLevel, Scenario } from "./daily-brief-data";

// ─── Content Directory ──────────────────────────────────
const CONTENT_DIR = path.join(process.cwd(), "content");

// ─── Briefings Reader ──────────────────────────────────

interface BriefingFrontmatter {
    date: string;
    title: string;
    description: string;
    tags: string[];
    readingTime: string;
    marketState?: string;
    catalyst?: string;
    events?: string[];
    tldr: string[];
    marketOverview: MarketOverviewItem[];
    sections: { title: string; content: string }[];
    keyLevels: KeyLevel[];
    scenarios: Scenario[];
}

/**
 * Read a single briefing MDX file and return a DailyBrief object.
 */
function parseBriefingFile(filePath: string, locale: "en" | "ko"): DailyBrief | null {
    try {
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContents);
        const fm = data as BriefingFrontmatter;

        return {
            date: fm.date,
            title: fm.title,
            description: fm.description,
            tags: fm.tags || [],
            readingTime: fm.readingTime,
            marketState: fm.marketState,
            catalyst: fm.catalyst,
            events: fm.events,
            tldr: fm.tldr || [],
            marketOverview: fm.marketOverview || [],
            sections: (fm.sections || []).map((s) => ({
                title: s.title,
                content: typeof s.content === "string" ? s.content.trim() : "",
            })),
            keyLevels: fm.keyLevels || [],
            scenarios: fm.scenarios || [],
            ttlTake: content.trim(),
            locale,
        };
    } catch (err) {
        console.error(`Error reading briefing file ${filePath}:`, err);
        return null;
    }
}

/**
 * Get all briefings for a locale, sorted by date (newest first).
 */
export function getDailyBriefs(locale: "en" | "ko"): DailyBrief[] {
    const briefingsDir = path.join(CONTENT_DIR, "briefings", locale);

    if (!fs.existsSync(briefingsDir)) {
        return [];
    }

    const files = fs.readdirSync(briefingsDir).filter((f) => f.endsWith(".mdx"));

    const briefs: DailyBrief[] = [];
    for (const file of files) {
        const filePath = path.join(briefingsDir, file);
        const brief = parseBriefingFile(filePath, locale);
        if (brief) {
            briefs.push(brief);
        }
    }

    return briefs.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Get a single briefing by date and locale.
 */
export function getDailyBriefByDate(
    date: string,
    locale: "en" | "ko"
): DailyBrief | undefined {
    const filePath = path.join(CONTENT_DIR, "briefings", locale, `${date}.mdx`);

    if (!fs.existsSync(filePath)) {
        return undefined;
    }

    const brief = parseBriefingFile(filePath, locale);
    return brief || undefined;
}

/**
 * Get all unique briefing dates across both locales (for generateStaticParams).
 */
export function getAllBriefDates(): string[] {
    const dates = new Set<string>();

    for (const locale of ["en", "ko"]) {
        const briefingsDir = path.join(CONTENT_DIR, "briefings", locale);
        if (!fs.existsSync(briefingsDir)) continue;

        const files = fs.readdirSync(briefingsDir).filter((f) => f.endsWith(".mdx"));
        for (const file of files) {
            // Extract date from filename: "2026-02-20.mdx" → "2026-02-20"
            dates.add(file.replace(".mdx", ""));
        }
    }

    return Array.from(dates);
}
