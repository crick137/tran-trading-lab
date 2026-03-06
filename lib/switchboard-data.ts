export interface SwitchboardSignal {
    id: string;
    asset: string;
    signal: 'bullish' | 'bearish' | 'neutral' | 'caution';
    level: string;
    support: string;
    resistance: string;
    note: string;
}

export interface SwitchboardSnapshot {
    date: string;
    locale: 'ko' | 'en';
    marketState: string;   // A-E
    marketStateLabel: string;
    fearGreedIndex: number;
    fearGreedLabel: string;
    signals: SwitchboardSignal[];
    weeklyNote: string;
}

export const switchboardSnapshots: SwitchboardSnapshot[] = [
    // ─── KO Snapshot ───────────────────────────────────────────
    {
        date: "2026-03-06",
        locale: "ko",
        marketState: "C",
        marketStateLabel: "조정 — 반등 후 방향 탐색",
        fearGreedIndex: 35,
        fearGreedLabel: "공포",
        signals: [
            {
                id: "kospi-ko",
                asset: "KOSPI",
                signal: "caution",
                level: "5,584",
                support: "5,094",
                resistance: "5,800",
                note: "서킷브레이커 후 반등. 바닥 확인 필요. 5,094 유지 여부가 핵심.",
            },
            {
                id: "samsung-ko",
                asset: "삼성전자",
                signal: "neutral",
                level: "191,600",
                support: "172,200",
                resistance: "200,000",
                note: "반등 중이지만 2주 전 218,000원 대비 -12%. 200,000원 회복이 추세 전환 신호.",
            },
            {
                id: "hynix-ko",
                asset: "SK하이닉스",
                signal: "neutral",
                level: "941,000",
                support: "849,000",
                resistance: "1,000,000",
                note: "100만원 돌파 후 -14%. HBM4 펀더멘털 여전히 강하나 심리적 저항 큼.",
            },
            {
                id: "btc-ko",
                asset: "BTC",
                signal: "bullish",
                level: "$73,000",
                support: "$65,000",
                resistance: "$76,000",
                note: "지정학 위기에서 안전자산 역할 입증. 디지털 골드 내러티브 강화 중.",
            },
            {
                id: "gold-ko",
                asset: "금",
                signal: "bullish",
                level: "$5,065",
                support: "$4,900",
                resistance: "$5,300",
                note: "지정학 프리미엄 유지. 안전자산 수요 지속.",
            },
            {
                id: "vix-ko",
                asset: "VIX",
                signal: "caution",
                level: "23.75",
                support: "20",
                resistance: "30",
                note: "여전히 공포 영역. 20 이하 복귀 시 정상화 확인.",
            },
        ],
        weeklyNote: "서킷브레이커 후 반등이 나왔지만, 진짜 바닥인지 데드캣 바운스인지 아직 확인되지 않았습니다. 핵심 관전 포인트: ① KOSPI 5,094 유지 여부, ② 외국인 순매수 전환, ③ 호르무즈 지정학 완화. 현금 비중 유지하며 관망이 현명합니다. 덜 잃고, 더 오래 버텨라.",
    },
    // ─── EN Snapshot ───────────────────────────────────────────
    {
        date: "2026-03-06",
        locale: "en",
        marketState: "C",
        marketStateLabel: "Correction — Post-bounce direction finding",
        fearGreedIndex: 35,
        fearGreedLabel: "Fear",
        signals: [
            {
                id: "kospi-en",
                asset: "KOSPI",
                signal: "caution",
                level: "5,584",
                support: "5,094",
                resistance: "5,800",
                note: "Post circuit breaker bounce. Bottom needs confirmation. 5,094 holding is key.",
            },
            {
                id: "samsung-en",
                asset: "Samsung",
                signal: "neutral",
                level: "191,600",
                support: "172,200",
                resistance: "200,000",
                note: "Bouncing but still -12% from 218,000 two weeks ago. 200K recovery signals trend reversal.",
            },
            {
                id: "hynix-en",
                asset: "SK Hynix",
                signal: "neutral",
                level: "941,000",
                support: "849,000",
                resistance: "1,000,000",
                note: "Down -14% from million-won breakthrough. HBM4 fundamentals strong but psychological resistance heavy.",
            },
            {
                id: "btc-en",
                asset: "BTC",
                signal: "bullish",
                level: "$73,000",
                support: "$65,000",
                resistance: "$76,000",
                note: "Safe haven role validated during geopolitical crisis. Digital gold narrative strengthening.",
            },
            {
                id: "gold-en",
                asset: "Gold",
                signal: "bullish",
                level: "$5,065",
                support: "$4,900",
                resistance: "$5,300",
                note: "Geopolitical premium holding. Safe haven demand persists.",
            },
            {
                id: "vix-en",
                asset: "VIX",
                signal: "caution",
                level: "23.75",
                support: "20",
                resistance: "30",
                note: "Still in fear territory. Return below 20 confirms normalization.",
            },
        ],
        weeklyNote: "The post-circuit-breaker bounce arrived, but whether it's a real bottom or a dead cat bounce remains unconfirmed. Key watchpoints: ① KOSPI holding 5,094, ② foreign net buying, ③ Hormuz de-escalation. Maintaining cash and watching is prudent. Lose less. Last longer.",
    },
];

export const getLatestSnapshot = (locale: 'ko' | 'en'): SwitchboardSnapshot | undefined => {
    return switchboardSnapshots.find(s => s.locale === locale);
};
