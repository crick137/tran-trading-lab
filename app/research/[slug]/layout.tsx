import type { Metadata } from "next";
import { getResearchBySlug, researchArticles } from "@/lib/research-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trantradinglab.com";

// Generate static params for all research articles
export async function generateStaticParams() {
    return researchArticles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const article = getResearchBySlug(params.slug);

    if (!article) {
        return {
            title: "Research Not Found | TRAN Trading Lab",
            description: "요청하신 리서치를 찾을 수 없습니다.",
        };
    }

    const url = `${SITE_URL}/research/${article.slug}`;

    // Build OG image URL with article data as query params
    const ogImageParams = new URLSearchParams({
        title: article.title,
        subtitle: article.subtitle || '',
        symbol: article.symbol,
        timeframe: article.timeframe,
        bias: article.bias,
        date: article.date,
    });
    const ogImageUrl = `${SITE_URL}/api/og?${ogImageParams.toString()}`;

    return {
        title: `${article.title} | TRAN Trading Lab`,
        description: article.description,
        keywords: [...article.tags, article.symbol, "SMC", "트레이딩", "환율 분석"],
        authors: [{ name: "TRAN Trading Lab" }],
        openGraph: {
            title: article.title,
            description: article.description,
            type: "article",
            url,
            siteName: "TRAN Trading Lab",
            locale: "ko_KR",
            publishedTime: article.date,
            tags: article.tags,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
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
        },
    };
}

export default function ResearchArticleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
