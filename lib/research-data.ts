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

export const researchArticles: ResearchArticle[] = [
    {
        slug: "usdkrw-supply-zone-2026-01-21",
        title: "USD/KRW | 공급 존 테스트 임박",
        subtitle: "양방향 시나리오 점검",
        description: "USD/KRW 환율 SMC 분석: 1,483~1,485원 공급 존 테스트 임박. 다중 BOS 상승 구조 확인, CHOCH 약화 신호 포착. 돌파 시 1,495원, 저항 시 1,445원 시나리오 점검.",
        symbol: "USD/KRW",
        timeframe: "4H",
        bias: "neutral",
        date: "2026년 1월 21일",
        readingTime: "5분",
        tags: ["SMC", "Supply Zone", "BOS", "CHOCH"],
        image: "/usdkrw-chart-2026-01-21.png",
        quickSummary: [
            { icon: "✅", text: "다중 BOS 발생으로 상승 구조 확인, CHOCH 출현으로 약화 신호 포착" },
            { icon: "📍", text: "핵심 구간: 공급 존(Supply Zone) 1,483~1,485원 테스트 대기" },
            { icon: "🎯", text: "Scenario A: 공급 존 상향 돌파 시 1,490~1,495원 목표" },
            { icon: "⚠️", text: "Scenario B: 공급 존 저항 반응 시 1,450~1,445원 조정" },
            { icon: "💡", text: "원칙: 공급 존 반응 확인 후에만 진입 고려" }
        ],
        sections: [
            {
                icon: "📋",
                title: "요약",
                content: "미국 달러/한국 원화(USD/KRW) 환율이 **1,469원** 부근에서 거래되고 있습니다. 지난 11월 1,430원대 저점에서 시작된 상승 흐름이 현재 핵심 저항 구간에 도달했으며, 향후 방향성 결정을 앞두고 있습니다."
            },
            {
                icon: "📈",
                title: "구조 분석 (Market Structure)",
                content: "차트상 다중 **BOS(Break of Structure)**가 확인되며, 이는 스마트 머니의 매수 의도를 나타냅니다. 그러나 최근 **CHOCH(Change of Character)**가 출현하면서 기존 상승 추세의 약화 신호가 포착되었습니다.",
                highlights: [
                    "BOS: 상승 구조가 확인되며 매수세 우위",
                    "CHOCH: 구조 전환 신호로 추세 약화 가능성"
                ]
            },
            {
                icon: "📍",
                title: "핵심 프라이스 레벨",
                content: "현재 가격 대비 핵심 구간은 다음과 같습니다:",
                highlights: [
                    "공급 존 (Supply Zone): 1,483~1,485원 — 매도세 집중 예상 구간",
                    "현재가: 1,469원",
                    "1차 지지: 1,460원 — BOS 확인 레벨",
                    "2차 지지: 1,450원 — 시나리오2 타겟"
                ]
            },
            {
                icon: "📊",
                title: "모멘텀 참고 (보조지표)",
                content: "보조지표는 방향만 참고하고, 실행은 구조+구간으로 결정합니다.",
                highlights: [
                    "RSI: 51.41 / 47.15로 중립 구간이나 약세 전환 조짐",
                    "MACD: 0선 부근에서 모멘텀 약화, 데드크로스 경계"
                ]
            }
        ],
        scenarios: [
            {
                type: "bullish",
                title: "시나리오 A — 상방 돌파 (Bullish Continuation)",
                condition: "공급 존(1,483~1,485)을 강한 모멘텀으로 돌파",
                meaning: "추가 상승 여력이 열리며 더 높은 가격대 탐색 가능",
                expectedFlow: "돌파 → 1,490원 테스트 → 1,495원 확장 가능",
                strategy: "4시간봉 종가 기준 1,485원 상향 돌파 확인 후 진입, 손절 1,475원"
            },
            {
                type: "bearish",
                title: "시나리오 B — 하방 전환 (Bearish Reversal)",
                condition: "공급 존에서 명확한 저항 반응(거부 캔들, 하락 장악형 등) 출현",
                meaning: "구조 이탈과 함께 하락 전환 가능성 증가",
                expectedFlow: "저항 반응 → 1,460원 이탈 → 1,450~1,445원 조정",
                strategy: "공급 존 내 저항 캔들 확인 + 1,460원 이탈 시 숏, 손절 1,475원"
            }
        ],
        checklist: [
            "공급 존(1,483~1,485원)에서 어떤 반응이 나오는가?",
            "강한 돌파 캔들이 형성되는가, 아니면 저항 반응이 나오는가?",
            "1,460원 지지가 유지되는가?",
            "중간 자리 추격 진입은 하지 않았는가?"
        ],
        conclusion: "현재 USD/KRW는 핵심 공급 존 테스트를 앞두고 있으며, 해당 구간의 반응에 따라 양방향 시나리오가 모두 유효합니다. 트럼프 2기 행정부 출범에 따른 달러 정책 변화와 한국 경제 지표를 함께 모니터링하며 대응하시기 바랍니다."
    }
];

export const getResearchBySlug = (slug: string): ResearchArticle | undefined => {
    return researchArticles.find(article => article.slug === slug);
};
