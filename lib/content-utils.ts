import { blogPosts, type BlogPost } from './blog-data';
import { researchArticles, type ResearchArticle } from './research-data';
import { getDailyBriefs, type DailyBrief } from './daily-brief-data';

// ─── Unified Content Item ───────────────────────────────
export interface UnifiedContentItem {
    id: string;
    type: 'briefing' | 'research' | 'blog';
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    tags: string[];
    href: string;
    isFeatured?: boolean;
    bias?: 'long' | 'short' | 'neutral';
    image?: string;
}

// ─── Categories ─────────────────────────────────────────
export const CONTENT_CATEGORIES = [
    { id: 'all', labelEN: 'All', labelKO: '전체', icon: 'LayoutGrid' },
    { id: 'market-analysis', labelEN: 'Market Analysis', labelKO: '시장 분석', icon: 'TrendingUp' },
    { id: 'education', labelEN: 'Education', labelKO: '교육', icon: 'BookOpen' },
    { id: 'macro', labelEN: 'Macro & Flows', labelKO: '매크로', icon: 'Activity' },
    { id: 'korean-market', labelEN: 'Korean Market', labelKO: '한국 시장', icon: 'Globe' },
    { id: 'risk-management', labelEN: 'Risk Management', labelKO: '리스크 관리', icon: 'Shield' },
    { id: 'cognitive-bias', labelEN: 'Cognitive Biases', labelKO: '인지 편향', icon: 'Brain' },
] as const;

export type ContentCategory = typeof CONTENT_CATEGORIES[number]['id'];

// ─── Mappers ────────────────────────────────────────────
function briefToContentItem(brief: DailyBrief, locale: string): UnifiedContentItem {
    return {
        id: `briefing-${brief.date}-${brief.locale}`,
        type: 'briefing',
        slug: brief.date,
        title: brief.title,
        excerpt: brief.description,
        date: brief.date,
        readTime: brief.readingTime,
        category: 'market-analysis',
        tags: brief.tags,
        href: `/${locale}/briefings/${brief.date}`,
    };
}

function blogToContentItem(post: BlogPost, locale: string): UnifiedContentItem {
    return {
        id: `blog-${post.slug}`,
        type: 'blog',
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || post.description,
        date: post.date,
        readTime: post.readingTime,
        category: post.category || 'market-analysis',
        tags: post.tags,
        href: `/${locale}/blog/${post.slug}`,
        isFeatured: post.isFeatured,
        image: post.image,
    };
}

function researchToContentItem(article: ResearchArticle, locale: string): UnifiedContentItem {
    return {
        id: `research-${article.slug}`,
        type: 'research',
        slug: article.slug,
        title: article.title,
        excerpt: article.description,
        date: article.date,
        readTime: article.readingTime,
        category: article.articleType === 'education' ? 'education' : 'market-analysis',
        tags: article.tags,
        href: `/${locale}/research/${article.slug}`,
        bias: article.bias,
        image: article.image,
    };
}

// ─── Public API ─────────────────────────────────────────
export function getAllContent(locale: 'en' | 'ko'): UnifiedContentItem[] {
    const briefs = getDailyBriefs(locale).map(b => briefToContentItem(b, locale));
    const blogs = blogPosts
        .filter(p => p.locale === locale)
        .map(p => blogToContentItem(p, locale));
    const research = researchArticles
        .filter(a => a.locale === locale)
        .map(a => researchToContentItem(a, locale));

    return [...briefs, ...blogs, ...research].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getFeaturedContent(locale: 'en' | 'ko', count = 3): UnifiedContentItem[] {
    const all = getAllContent(locale);
    const featured = all.filter(item => item.isFeatured);
    if (featured.length >= count) return featured.slice(0, count);
    // Fill with most recent if not enough featured
    return all.slice(0, count);
}

export function getContentByType(
    locale: 'en' | 'ko',
    type: 'briefing' | 'research' | 'blog'
): UnifiedContentItem[] {
    return getAllContent(locale).filter(item => item.type === type);
}

export function getContentByCategory(
    locale: 'en' | 'ko',
    category: string
): UnifiedContentItem[] {
    if (category === 'all') return getAllContent(locale);
    return getAllContent(locale).filter(item => item.category === category);
}

export function getPopularContent(locale: 'en' | 'ko', count = 5): UnifiedContentItem[] {
    // Since we don't have view counts, use recency as proxy
    return getAllContent(locale).slice(0, count);
}

export function getContentStats(locale: 'en' | 'ko') {
    const all = getAllContent(locale);
    return {
        total: all.length,
        briefings: all.filter(i => i.type === 'briefing').length,
        blogs: all.filter(i => i.type === 'blog').length,
        research: all.filter(i => i.type === 'research').length,
    };
}
