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
    isFeatured?: boolean;
}

export const blogPosts: BlogPost[] = [];

export const categoryLabels: Record<string, string> = {
    "market-analysis": "시장 분석",
    "education": "교육",
    "macro": "매크로",
    "risk-management": "리스크 관리",
    "cognitive-bias": "인지 편향",
    "korean-market": "한국 시장",
    analysis: "시장 분석",
    strategy: "트레이딩 전략",
    news: "뉴스 번역",
};
