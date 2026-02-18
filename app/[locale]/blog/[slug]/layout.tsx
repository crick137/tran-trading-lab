import type { Metadata } from "next";
import { blogPosts, categoryLabels } from "@/lib/blog-data";
import { articleJsonLd } from "@/lib/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trantradinglab.com";

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string; locale: string };
}): Promise<Metadata> {
    const article = blogPosts.find((p) => p.slug === params.slug);

    if (!article) {
        return {
            title: "Article Not Found",
            description: "The requested article could not be found.",
        };
    }

    const url = `${SITE_URL}/${params.locale}/blog/${article.slug}`;

    const ogImageParams = new URLSearchParams({
        title: article.title,
        subtitle: article.excerpt?.slice(0, 80) || "",
        symbol: article.tags?.[0] || "",
        timeframe: categoryLabels[article.category] || article.category,
        bias: "neutral",
        date: article.date,
    });
    const ogImageUrl = `${SITE_URL}/api/og?${ogImageParams.toString()}`;

    return {
        title: article.title,
        description: article.excerpt,
        keywords: [...(article.tags || []), "trading", "financial education", "market analysis"],
        authors: [{ name: "TRAN Trading Lab" }],
        openGraph: {
            title: article.title,
            description: article.excerpt,
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
            description: article.excerpt,
            site: "@TranTradingLab",
            images: article.image ? [`${SITE_URL}${article.image}`] : [ogImageUrl],
        },
        alternates: {
            canonical: url,
            languages: {
                en: `${SITE_URL}/en/blog/${article.slug}`,
                ko: `${SITE_URL}/ko/blog/${article.slug}`,
            },
        },
    };
}

export default function BlogArticleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string; locale: string };
}) {
    const article = blogPosts.find((p) => p.slug === params.slug);
    if (!article) return <>{children}</>;

    const ogImageParams = new URLSearchParams({ title: article.title });
    const ogImageUrl = `${SITE_URL}/api/og?${ogImageParams.toString()}`;

    const jsonLd = articleJsonLd({
        title: article.title,
        description: article.excerpt,
        url: `${SITE_URL}/${params.locale}/blog/${article.slug}`,
        datePublished: article.date,
        imageUrl: article.image ? `${SITE_URL}${article.image}` : ogImageUrl,
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
