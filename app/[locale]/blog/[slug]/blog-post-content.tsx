"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { SocialShare } from "@/components/blog/social-share";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { blogPosts, categoryLabels } from "@/lib/blog-data";
import { ArticleCTA } from "@/components/blog/article-cta";

// Helper to parse simple markdown with premium styling
function parseMarkdownToHtml(content: string): string {
    let html = content;

    // Parse images first - ![alt](src) - with premium styling
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
        '<figure class="my-8 rounded-xl overflow-hidden border border-white/5 shadow-lg shadow-black/20">' +
        '<img src="$2" alt="$1" class="w-full" />' +
        '<figcaption class="bg-cv-elevated/80 px-4 py-3 text-center text-sm text-white/50 border-t border-white/5">$1</figcaption>' +
        '</figure>');

    // Parse tables with premium styling
    html = html.replace(/(\|.+\|\r?\n)+/g, (tableBlock) => {
        const rows = tableBlock.trim().split(/\r?\n/);
        if (rows.length < 2) return tableBlock;

        let tableHtml = '<div class="my-8 overflow-hidden rounded-xl border border-white/10"><table class="w-full border-collapse"><thead><tr>';
        const headerCells = rows[0].split('|').filter(cell => cell.trim());
        headerCells.forEach(cell => {
            tableHtml += `<th class="border-b border-white/10 px-4 py-3 bg-gold/10 text-gold text-left font-semibold">${cell.trim()}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';

        for (let i = 2; i < rows.length; i++) {
            const cells = rows[i].split('|').filter(cell => cell.trim());
            tableHtml += `<tr class="${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.04]'}">`;
            cells.forEach(cell => {
                tableHtml += `<td class="border-b border-white/5 px-4 py-3">${cell.trim()}</td>`;
            });
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table></div>';
        return tableHtml;
    });

    // Parse H1 with special title styling (emoji support)
    html = html.replace(/^# (.+)$/gm, (match, text) => {
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/(^-|-$)/g, "");
        return `<h1 id="${id}" class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent mb-6">${text}</h1>`;
    });

    // Parse H2 as major section headers with decorative styling
    html = html.replace(/^## (.+)$/gm, (match, text) => {
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/(^-|-$)/g, "");
        const firstChar = text.codePointAt(0) || 0;
        const isEmoji = (firstChar >= 0x1F300 && firstChar <= 0x1F9FF) ||
            (firstChar >= 0x2600 && firstChar <= 0x26FF) ||
            (firstChar >= 0x2700 && firstChar <= 0x27BF);
        if (isEmoji) {
            const emojiEnd = text.codePointAt(0)! > 0xFFFF ? 2 : 1;
            const emoji = text.slice(0, emojiEnd);
            const title = text.slice(emojiEnd).trim();
            return `<div class="mt-12 mb-6 flex items-center gap-3" id="${id}">
                <span class="text-3xl">${emoji}</span>
                <h2 class="text-2xl font-bold text-white m-0">${title}</h2>
            </div>`;
        }
        return `<h2 id="${id}" class="mt-12 mb-6 text-2xl font-bold text-white border-l-4 border-gold pl-4">${text}</h2>`;
    });

    // Parse H3 as subsection headers
    html = html.replace(/^### (.+)$/gm, (match, text) => {
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/(^-|-$)/g, "");
        return `<h3 id="${id}" class="mt-8 mb-4 text-xl font-semibold text-gold/90">${text}</h3>`;
    });

    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em class="text-gold/80">$1</em>');

    // Lists - wrap consecutive list items in ul with premium styling
    html = html.replace(/((?:^- .+$\r?\n?)+)/gm, (match) => {
        const items = match.replace(/^- (.+)$/gm, '<li class="relative pl-2 before:absolute before:left-[-1rem] before:top-[0.6rem] before:w-1.5 before:h-1.5 before:bg-gold before:rounded-full">$1</li>');
        return `<ul class="my-6 ml-4 space-y-2 border-l-2 border-white/5 pl-6">${items}</ul>`;
    });

    // Horizontal rule as decorative divider
    html = html.replace(/^---$/gm, '<div class="my-12 flex items-center justify-center gap-4"><span class="w-2 h-2 bg-gold/50 rounded-full"></span><span class="w-16 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></span><span class="w-2 h-2 bg-gold/50 rounded-full"></span></div>');

    // Paragraphs - split by double newlines but preserve block elements
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') ||
            trimmed.startsWith('<div') || trimmed.startsWith('<table') ||
            trimmed.startsWith('<figure')) {
            return trimmed;
        }
        return `<p class="my-4 leading-relaxed">${trimmed}</p>`;
    }).join('\n');

    return html;
}


export function BlogPostContent() {
    const params = useParams();
    const locale = useLocale();
    const t = useTranslations("blogPost");
    const slug = params.slug as string;
    const article = blogPosts.find((p) => p.slug === slug);

    if (!article) {
        notFound();
    }

    return (
        <>
            <ReadingProgress />
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                {/* TOC Sidebar */}
                <TableOfContents content={article.content} />

                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <Breadcrumb
                        items={[
                            { label: t("blogBreadcrumb"), href: `/${locale}/blog` },
                            { label: categoryLabels[article.category] || article.category, href: `/${locale}/blog?category=${article.category}` },
                            { label: article.title },
                        ]}
                    />

                    {/* Back Link */}
                    <Link
                        href={`/${locale}/blog`}
                        className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t("backToBlog")}
                    </Link>

                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        {/* Category */}
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold mb-4">
                            {categoryLabels[article.category] || article.category}
                        </span>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {article.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-white/50 mb-6">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {article.readingTime}{t("readSuffix")}
                            </span>
                        </div>

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mb-6">
                                <Tag className="w-4 h-4 text-white/50" />
                                {article.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs rounded-md bg-cv-elevated border border-white/10 text-white/50 hover:border-gold/50 hover:text-gold transition-colors cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Social Share */}
                        <SocialShare title={article.title} />
                    </motion.header>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-white/60 prose-strong:text-white prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-code:text-gold prose-code:bg-cv-elevated prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-cv-elevated prose-pre:border prose-pre:border-white/10 prose-li:text-white/60 prose-blockquote:border-gold prose-blockquote:text-white/60 prose-hr:border-white/10"
                        dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(article.content) }}
                    />

                    {/* CTA */}
                    <ArticleCTA />

                    {/* Bottom Share */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-white/50">{t("sharePrompt")}</p>
                            <SocialShare title={article.title} />
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="my-12 border-white/10" />

                    {/* Related Articles */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6">{t("relatedPosts")}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {blogPosts
                                .filter((p) => p.slug !== slug)
                                .slice(0, 2)
                                .map((art) => (
                                    <Link
                                        key={art.slug}
                                        href={`/${locale}/blog/${art.slug}`}
                                        className="p-4 rounded-lg bg-cv-elevated border border-white/10 hover:border-gold/50 transition-all group card-hover"
                                    >
                                        <span className="text-xs text-gold mb-2 block">
                                            {categoryLabels[art.category] || art.category}
                                        </span>
                                        <h3 className="font-semibold text-white group-hover:text-gold transition-colors line-clamp-2">
                                            {art.title}
                                        </h3>
                                        {art.tags && (
                                            <div className="mt-2 flex gap-1 flex-wrap">
                                                {art.tags.slice(0, 2).map((tag: string) => (
                                                    <span key={tag} className="text-xs text-white/50">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                        </div>
                    </section>
                </article>
            </main>
            <Footer />
        </>
    );
}
