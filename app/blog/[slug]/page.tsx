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
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";

// Mock article data - will be replaced with MDX
const articles: Record<string, {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readingTime: string;
    content: string;
    tags?: string[];
}> = {
    "2024-q1-korea-market-outlook": {
        title: "2024년 1분기 한국 시장 전망: 코스피 방향성 분석",
        excerpt: "미국 금리 인하 기대감과 반도체 사이클 회복이 한국 시장에 미치는 영향을 분석합니다.",
        category: "analysis",
        date: "2024-01-15",
        readingTime: "8분",
        tags: ["코스피", "반도체", "금리"],
        content: `
## 핵심 요약

2024년 1분기 한국 시장은 여러 긍정적 요인들이 복합적으로 작용하며 상승 모멘텀을 이어갈 것으로 전망됩니다.

### 주요 포인트

1. **미국 금리 인하 기대감**: 연준의 비둘기파적 스탠스가 글로벌 유동성 개선으로 이어질 전망
2. **반도체 사이클 회복**: 메모리 반도체 가격 상승세가 삼성전자, SK하이닉스 실적 개선으로 연결
3. **외국인 수급 개선**: 2023년 하반기부터 이어진 외국인 순매수 기조 지속 예상

## 섹터별 전망

### 반도체
- 삼성전자: HBM 수요 급증으로 메모리 가격 상승 수혜
- SK하이닉스: AI 서버용 HBM 시장 선점 효과

### 2차전지
- 단기 조정 후 하반기 회복 전망
- 미국 IRA 보조금 불확실성 주의 필요

## 리스크 요인

- 중국 경기 둔화 지속
- 지정학적 리스크 (중동, 대만해협)
- 원화 약세 압력

## 투자 전략

**추천 포지션**: 반도체 비중 확대, 2차전지 관망, 금융 선별적 접근

---

*본 분석은 정보 제공 목적이며, 투자 권유가 아닙니다.*
    `,
    },
    "smc-strategy-guide": {
        title: "SMC 전략 완벽 가이드: Order Block과 Fair Value Gap",
        excerpt: "Smart Money Concept의 핵심 개념인 Order Block과 FVG를 활용한 트레이딩 전략을 상세히 설명합니다.",
        category: "strategy",
        date: "2024-01-12",
        readingTime: "12분",
        tags: ["SMC", "Order Block", "FVG", "기술적분석"],
        content: `
## Smart Money Concept이란?

SMC(Smart Money Concept)는 대형 기관 투자자들의 트레이딩 패턴을 분석하여 개인 투자자도 동일한 방향으로 포지션을 잡을 수 있도록 돕는 기술적 분석 방법론입니다.

### 핵심 개념

1. **Order Block (OB)**: 기관 주문이 집중된 가격대
2. **Fair Value Gap (FVG)**: 급격한 가격 변동으로 생긴 가격 공백
3. **Liquidity**: 스탑로스와 진입 주문이 집중된 가격대

## Order Block 활용법

### Order Block 정의
강한 상승/하락 전 마지막 반대 방향 캔들을 Order Block이라 합니다.

### 트레이딩 규칙
1. 상승 Order Block: 하락 후 해당 가격대에서 매수
2. 하락 Order Block: 상승 후 해당 가격대에서 매도

## Fair Value Gap (FVG) 전략

### FVG 식별
- 3개 캔들 중 첫 번째와 세 번째 캔들이 겹치지 않는 경우
- 가격이 해당 갭을 메우러 돌아올 가능성 높음

### 실전 적용
1. FVG 영역 식별
2. 가격이 FVG 영역에 진입할 때까지 대기
3. FVG 50% 되돌림 시 진입

## 실전 체크리스트

- 일봉 추세 확인
- Order Block 식별
- FVG 확인
- 유동성 영역 파악
- 리스크/리워드 비율 계산

---

*다음 글에서는 SMC를 활용한 실제 트레이딩 사례를 다루겠습니다.*
    `,
    },
};

const categoryLabels: Record<string, string> = {
    analysis: "시장 분석",
    strategy: "트레이딩 전략",
    news: "뉴스 번역",
};

function parseMarkdownToHtml(content: string): string {
    let html = content;

    // Parse headings and add IDs
    html = html.replace(/^## (.+)$/gm, (match, text) => {
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/(^-|-$)/g, "");
        return `<h2 id="${id}">${text}</h2>`;
    });
    html = html.replace(/^### (.+)$/gm, (match, text) => {
        const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/(^-|-$)/g, "");
        return `<h3 id="${id}">${text}</h3>`;
    });

    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Lists
    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>");

    // Paragraphs
    html = html.replace(/\n\n/g, "</p><p>");
    html = `<p>${html}</p>`;

    // Horizontal rule
    html = html.replace(/---/g, "<hr />");

    return html;
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const article = articles[slug];

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
                            { label: "블로그", href: "/blog" },
                            { label: categoryLabels[article.category] || article.category, href: `/blog?category=${article.category}` },
                            { label: article.title },
                        ]}
                    />

                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        블로그로 돌아가기
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
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                            {article.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {article.readingTime} 읽기
                            </span>
                        </div>

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mb-6">
                                <Tag className="w-4 h-4 text-muted-foreground" />
                                {article.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs rounded-md bg-card border border-border/50 text-muted-foreground hover:border-gold/50 hover:text-gold transition-colors cursor-pointer"
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
                        className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-code:text-gold prose-code:bg-card prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-card prose-pre:border prose-pre:border-border/50 prose-li:text-muted-foreground prose-blockquote:border-gold prose-blockquote:text-muted-foreground prose-hr:border-border/50"
                        dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(article.content) }}
                    />

                    {/* Bottom Share */}
                    <div className="mt-12 pt-8 border-t border-border/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-muted-foreground">이 글이 도움이 되셨나요?</p>
                            <SocialShare title={article.title} />
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="my-12 border-border/50" />

                    {/* Related Articles */}
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-6">관련 글</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(articles)
                                .filter(([key]) => key !== slug)
                                .slice(0, 2)
                                .map(([key, art]) => (
                                    <Link
                                        key={key}
                                        href={`/blog/${key}`}
                                        className="p-4 rounded-lg bg-card border border-border/50 hover:border-gold/50 transition-all group card-hover"
                                    >
                                        <span className="text-xs text-gold mb-2 block">
                                            {categoryLabels[art.category] || art.category}
                                        </span>
                                        <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-2">
                                            {art.title}
                                        </h3>
                                        {art.tags && (
                                            <div className="mt-2 flex gap-1 flex-wrap">
                                                {art.tags.slice(0, 2).map((tag) => (
                                                    <span key={tag} className="text-xs text-muted-foreground">
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
