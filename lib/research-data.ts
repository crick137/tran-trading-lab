export interface ResearchArticle {
    slug: string;
    title: string;
    subtitle?: string;
    description: string; // 用于 meta description 和 OG 预览
    symbol: string;
    timeframe: string;
    bias: 'long' | 'short' | 'neutral';
    date: string;
    readingTime: string;
    tags: string[];
    image: string;
    // Optional fields for education articles
    articleType?: 'analysis' | 'education';
    fullContent?: string; // Markdown content for long-form articles
    contentImages?: { src: string; alt: string; caption?: string }[];
    quickSummary: {
        icon: string;
        text: string;
    }[];
    sections: {
        icon: string;
        title: string;
        content: string;
        highlights?: string[];
    }[];
    scenarios: {
        type: 'bullish' | 'bearish';
        title: string;
        condition: string;
        meaning?: string;
        expectedFlow: string;
        strategy?: string;
    }[];
    checklist: string[];
    conclusion: string;
}

export const researchArticles: ResearchArticle[] = [];

export const getResearchBySlug = (slug: string): ResearchArticle | undefined => {
    return researchArticles.find(article => article.slug === slug);
};
