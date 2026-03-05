import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getDailyBriefByDate, getAllBriefDates } from "@/lib/content-reader.server";
import { breadcrumbJsonLd, articleJsonLd } from "@/lib/json-ld";
import { BriefingDetailContent } from "./briefing-detail-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trantradinglab.com";

export async function generateMetadata({
    params: { locale, date },
}: {
    params: { locale: string; date: string };
}): Promise<Metadata> {
    const brief = getDailyBriefByDate(date, locale as "en" | "ko");
    if (!brief) {
        return createPageMetadata({
            locale,
            path: `/briefings/${date}`,
            title: "Not Found",
            description: "",
        });
    }

    const url = `${SITE_URL}/${locale}/briefings/${date}`;
    const ogParams = new URLSearchParams({
        title: brief.title,
        subtitle: brief.description.slice(0, 80),
    });
    const ogImageUrl = `${SITE_URL}/api/og?${ogParams.toString()}`;

    return {
        title: brief.title,
        description: brief.description,
        keywords: [...brief.tags, "daily brief", "market analysis", "trading"],
        authors: [{ name: "Tran Trading Lab" }],
        openGraph: {
            title: brief.title,
            description: brief.description,
            type: "article",
            url,
            siteName: "Tran Trading Lab",
            locale: locale === "ko" ? "ko_KR" : "en_US",
            publishedTime: brief.date,
            tags: brief.tags,
            images: [{ url: ogImageUrl, width: 1200, height: 630, alt: brief.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: brief.title,
            description: brief.description,
            site: "@TranTradingLab",
            images: [ogImageUrl],
        },
        alternates: {
            canonical: url,
            languages: {
                en: `${SITE_URL}/en/briefings/${date}`,
                ko: `${SITE_URL}/ko/briefings/${date}`,
            },
        },
    };
}

export function generateStaticParams() {
    return getAllBriefDates().map((date) => ({ date }));
}

export default function BriefingDetailPage({
    params: { locale, date },
}: {
    params: { locale: string; date: string };
}) {
    const brief = getDailyBriefByDate(date, locale as "en" | "ko");

    const breadcrumb = breadcrumbJsonLd([
        { name: "Home", url: `/${locale}` },
        { name: "Briefings", url: `/${locale}/briefings` },
        ...(brief ? [{ name: brief.title, url: `/${locale}/briefings/${date}` }] : []),
    ]);

    const articleLd = brief
        ? articleJsonLd({
              title: brief.title,
              description: brief.description,
              url: `${SITE_URL}/${locale}/briefings/${date}`,
              datePublished: brief.date,
              imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent(brief.title)}`,
              tags: brief.tags,
          })
        : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
            />
            {articleLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
                />
            )}
            <BriefingDetailContent brief={brief || null} />
        </>
    );
}
