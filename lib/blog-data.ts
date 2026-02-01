export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    excerpt: string;  // Short excerpt for card display
    image: string;    // Thumbnail image for card
    category: string;
    date: string;
    readingTime: string;
    tags: string[];
    content: string;
}

export const blogPosts: BlogPost[] = [];

export const categoryLabels: Record<string, string> = {
    analysis: "시장 분석",
    strategy: "트레이딩 전략",
    news: "뉴스 번역",
};
