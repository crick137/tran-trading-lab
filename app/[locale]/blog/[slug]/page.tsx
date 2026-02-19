import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { blogPosts } from "@/lib/blog-data";
import { breadcrumbJsonLd, articleJsonLd } from "@/lib/json-ld";
import { BlogPostContent } from "./blog-post-content";

export async function generateMetadata({
    params: { locale, slug },
}: {
    params: { locale: string; slug: string };
}): Promise<Metadata> {
    const article = blogPosts.find((p) => p.slug === slug);
    if (!article) {
        return createPageMetadata({ locale, path: `/blog/${slug}`, title: "Not Found", description: "" });
    }
    return createPageMetadata({
        locale,
        path: `/blog/${slug}`,
        title: article.title,
        description: article.excerpt,
    });
}

export function generateStaticParams() {
    return blogPosts.map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({
    params: { locale, slug },
}: {
    params: { locale: string; slug: string };
}) {
    const article = blogPosts.find((p) => p.slug === slug);

    const breadcrumb = breadcrumbJsonLd([
        { name: "Home", url: `/${locale}` },
        { name: "Blog", url: `/${locale}/blog` },
        ...(article ? [{ name: article.title, url: `/${locale}/blog/${slug}` }] : []),
    ]);

    const articleLd = article
        ? articleJsonLd({
            title: article.title,
            description: article.excerpt,
            url: `https://trantradinglab.com/${locale}/blog/${slug}`,
            datePublished: article.date,
            imageUrl: article.image || `https://trantradinglab.com/api/og?title=${encodeURIComponent(article.title)}`,
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
            <BlogPostContent />
        </>
    );
}
