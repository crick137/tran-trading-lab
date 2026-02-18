import type { Metadata } from "next";
import { getResearchBySlug, researchArticles } from "@/lib/research-data";
import { articleJsonLd } from "@/lib/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trantradinglab.com";

export async function generateStaticParams() {
    return researchArticles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string; locale: string };
}): Promise<Metadata> {
    const article = getResearchBySlug(params.slug);

    if (!article) {
        return {
            title: "Research Not Found",
            description: "The requested research could not be found.",
        };
    }

    const url = `${SITE_URL}/${params.locale}/research/${article.slug}`;

    const ogImageParams = new URLSearchParams({
        title: article.title,
        subtitle: article.subtitle || "",
        symbol: article.symbol,
        timeframe: article.timeframe,
        bias: article.bias,
        date: article.date,
    });
    const ogImageUrl = `${SITE_URL}/api/og?${ogImageParams.toString()}`;

    return {
        title: article.title,
        description: article.description,
        keywords: [...article.tags, article.symbol, "SMC", "trading", "market analysis"],
        authors: [{ name: "TRAN Trading Lab" }],
        openGraph: {
            title: article.title,
            description: article.description,
            type: "article",
            url,
            siteName: "Tran Trading Lab",
            locale: params.locale === "ko" ? "ko_KR" : "en_US",
            publishedTime: article.date,
            tags: article.tags,
            images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.description,
            site: "@TranTradingLab",
            images: [ogImageUrl],
        },
        alternates: {
            canonical: url,
            languages: {
                en: `${SITE_URL}/en/research/${article.slug}`,
                ko: `${SITE_URL}/ko/research/${article.slug}`,
            },
        },
    };
}

export default function ResearchArticleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string; locale: string };
}) {
    const article = getResearchBySlug(params.slug);
    if (!article) return <>{children}</>;

    const ogImageParams = new URLSearchParams({
        title: article.title,
        symbol: article.symbol,
        bias: article.bias,
    });
    const ogImageUrl = `${SITE_URL}/api/og?${ogImageParams.toString()}`;

    const jsonLd = articleJsonLd({
        title: article.title,
        description: article.description,
        url: `${SITE_URL}/${params.locale}/research/${article.slug}`,
        datePublished: article.date,
        imageUrl: ogImageUrl,
        tags: article.tags,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
