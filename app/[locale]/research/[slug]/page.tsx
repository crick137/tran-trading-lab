import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getResearchBySlug, researchArticles } from "@/lib/research-data";
import { ResearchArticleContent } from "./research-article-content";

export async function generateMetadata({
    params: { locale, slug },
}: {
    params: { locale: string; slug: string };
}): Promise<Metadata> {
    const article = getResearchBySlug(slug);
    if (!article) {
        return createPageMetadata({ locale, path: `/research/${slug}`, title: "Not Found", description: "" });
    }
    return createPageMetadata({
        locale,
        path: `/research/${slug}`,
        title: article.title,
        description: article.description,
    });
}

export function generateStaticParams() {
    return researchArticles.map((article) => ({ slug: article.slug }));
}

export default function ResearchArticlePage() {
    return <ResearchArticleContent />;
}
