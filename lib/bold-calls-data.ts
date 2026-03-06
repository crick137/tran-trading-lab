export interface BoldCall {
    id: string;
    locale: 'ko' | 'en';
    title: string;
    date: string;           // 발표일
    asset: string;
    direction: 'long' | 'short' | 'neutral';
    entry: string;
    target: string;
    stopLoss: string;
    status: 'active' | 'hit' | 'stopped' | 'expired';
    thesis: string;
    result?: string;
    returnPct?: string;
    closedDate?: string;
}

export const boldCalls: BoldCall[] = [
    // ─── KO Bold Calls ─────────────────────────────────────────
    {
        id: "bc-001-ko",
        locale: "ko",
        title: "KOSPI 기술적 반등 예측",
        date: "2026-03-04",
        asset: "KOSPI",
        direction: "long",
        entry: "5,094 (서킷브레이커 종가)",
        target: "5,500+",
        stopLoss: "4,800",
        status: "hit",
        thesis: "서킷브레이커 발동 후 다음 거래일 기술적 반등 확률이 역사적으로 85% 이상. 2020년 코로나, 2008년 금융위기 모두 서킷브레이커 다음 날 +5~10% 반등을 기록했습니다. -12%는 펀더멘털이 아닌 패닉에 의한 과매도. 구조적 악재(호르무즈)가 있지만, 기술적 반등은 높은 확률로 발생.",
        result: "3월 5일 KOSPI +9.6% 반등으로 5,584 도달. 목표(5,500+) 달성.",
        returnPct: "+9.6%",
        closedDate: "2026-03-05",
    },
    {
        id: "bc-002-ko",
        locale: "ko",
        title: "BTC 지정학 헤지 매수",
        date: "2026-02-28",
        asset: "BTC",
        direction: "long",
        entry: "$66,996 (호르무즈 위기 시작)",
        target: "$72,000+",
        stopLoss: "$62,000",
        status: "hit",
        thesis: "호르무즈 위기 발생 시 한국 시장은 3일간 휴장. BTC는 24/7 거래 가능한 유일한 유동성 자산. 지정학 리스크 → 전통 시장 위기 → BTC 안전자산 내러티브 작동 패턴. 한국 시장 대비 BTC의 디커플링 가능성.",
        result: "3월 4일 BTC $72,711 도달 (+8.5%). 한국 폭락일에 +6.5% 급등하며 안전자산 역할 입증.",
        returnPct: "+8.5%",
        closedDate: "2026-03-04",
    },

    // ─── EN Bold Calls ─────────────────────────────────────────
    {
        id: "bc-001-en",
        locale: "en",
        title: "KOSPI Technical Bounce Prediction",
        date: "2026-03-04",
        asset: "KOSPI",
        direction: "long",
        entry: "5,094 (circuit breaker close)",
        target: "5,500+",
        stopLoss: "4,800",
        status: "hit",
        thesis: "After circuit breaker events, the next trading day has historically seen a technical bounce 85%+ of the time. Both COVID 2020 and GFC 2008 saw +5-10% bounces the day after circuit breakers. The -12% drop was panic-driven overselling, not fundamental deterioration. Despite structural headwinds (Hormuz), a technical bounce was highly probable.",
        result: "March 5: KOSPI bounced +9.6% to reach 5,584. Target (5,500+) achieved.",
        returnPct: "+9.6%",
        closedDate: "2026-03-05",
    },
    {
        id: "bc-002-en",
        locale: "en",
        title: "BTC Geopolitical Hedge Buy",
        date: "2026-02-28",
        asset: "BTC",
        direction: "long",
        entry: "$66,996 (Hormuz crisis start)",
        target: "$72,000+",
        stopLoss: "$62,000",
        status: "hit",
        thesis: "With the Hormuz crisis emerging and Korean markets closed for 3 consecutive days, BTC was the only liquid 24/7 tradeable asset. Geopolitical risk → traditional market stress → BTC safe haven narrative activation. Expected decoupling of BTC from Korean market downside.",
        result: "March 4: BTC reached $72,711 (+8.5%). Surged +6.5% on Korea's crash day, validating its safe haven role.",
        returnPct: "+8.5%",
        closedDate: "2026-03-04",
    },
];

export const getBoldCallsByLocale = (locale: 'ko' | 'en'): BoldCall[] => {
    return boldCalls.filter(call => call.locale === locale);
};

export const getActiveBoldCalls = (locale: 'ko' | 'en'): BoldCall[] => {
    return boldCalls.filter(call => call.locale === locale && call.status === 'active');
};

export const getCompletedBoldCalls = (locale: 'ko' | 'en'): BoldCall[] => {
    return boldCalls.filter(call => call.locale === locale && call.status !== 'active');
};
