import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { blogPosts } from "@/lib/blog-data";
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

export default function BlogPostPage() {
    return <BlogPostContent />;
}
