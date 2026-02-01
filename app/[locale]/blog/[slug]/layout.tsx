import type { Metadata } from "next";
import { blogPosts, categoryLabels } from "@/lib/blog-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trantradinglab.com";

// Generate static params for all blog posts
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const article = blogPosts.find((p) => p.slug === params.slug);

    if (!article) {
        return {
            title: "Article Not Found | TRAN Trading Lab",
            description: "요청하신 글을 찾을 수 없습니다.",
        };
    }

    const url = `${SITE_URL}/blog/${article.slug}`;

    // Build OG image URL with article data as query params
    const ogImageParams = new URLSearchParams({
        title: article.title,
        subtitle: article.excerpt?.slice(0, 80) || '',
        symbol: article.tags?.[0] || '',
        timeframe: categoryLabels[article.category] || article.category,
        bias: 'neutral', // Default bias for blog posts
        date: article.date,
    });
    const ogImageUrl = `${SITE_URL}/api/og?${ogImageParams.toString()}`;

    return {
        title: `${article.title} | TRAN Trading Lab`,
        description: article.excerpt,
        keywords: [...(article.tags || []), "트레이딩", "금융교육", "시장분석"],
        authors: [{ name: "TRAN Trading Lab" }],
        openGraph: {
            title: article.title,
            description: article.excerpt,
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
            description: article.excerpt,
            site: "@TranTradingLab",
            // Use static image for Twitter to avoid robots.txt API blocking
            images: article.image ? [`${SITE_URL}${article.image}`] : [ogImageUrl],
        },
        alternates: {
            canonical: url,
        },
    };
}

export default function BlogArticleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
