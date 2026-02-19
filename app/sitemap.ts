import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";
import { researchArticles } from "@/lib/research-data";

const SITE_URL = "https://trantradinglab.com";
const locales = ["en", "ko"] as const;

const staticPages = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/dashboard", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/switchboard", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/bold-calls", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/blog", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/start", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/research", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/reports", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/briefings", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/academy", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/playbooks", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/glossary", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/community", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/subscribe", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/tools", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/tools/position-sizing", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/tools/rr-calculator", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/tools/templates", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/plans", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/faq", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/changelog", changeFrequency: "weekly" as const, priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    // Static pages × locales
    for (const page of staticPages) {
        for (const locale of locales) {
            entries.push({
                url: `${SITE_URL}/${locale}${page.path}`,
                lastModified: new Date(),
                changeFrequency: page.changeFrequency,
                priority: page.priority,
                alternates: {
                    languages: {
                        en: `${SITE_URL}/en${page.path}`,
                        ko: `${SITE_URL}/ko${page.path}`,
                    },
                },
            });
        }
    }

    // Dynamic blog posts
    for (const post of blogPosts) {
        for (const locale of locales) {
            entries.push({
                url: `${SITE_URL}/${locale}/blog/${post.slug}`,
                lastModified: new Date(post.date),
                changeFrequency: "weekly",
                priority: 0.7,
                alternates: {
                    languages: {
                        en: `${SITE_URL}/en/blog/${post.slug}`,
                        ko: `${SITE_URL}/ko/blog/${post.slug}`,
                    },
                },
            });
        }
    }

    // Dynamic research articles
    for (const article of researchArticles) {
        for (const locale of locales) {
            entries.push({
                url: `${SITE_URL}/${locale}/research/${article.slug}`,
                lastModified: new Date(article.date),
                changeFrequency: "weekly",
                priority: 0.8,
                alternates: {
                    languages: {
                        en: `${SITE_URL}/en/research/${article.slug}`,
                        ko: `${SITE_URL}/ko/research/${article.slug}`,
                    },
                },
            });
        }
    }

    return entries;
}
