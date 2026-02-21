export interface MarketOverviewItem {
    asset: string;
    last: string;
    change: string;
    signal: string;
}

export interface KeyLevel {
    asset: string;
    support: string;
    resistance: string;
    bias: string;
}

export interface Scenario {
    id: string;
    probability: string;
    condition: string;
    result: string;
}

export interface DailyBrief {
    date: string; // YYYY-MM-DD, also used as slug
    title: string;
    description: string;
    tags: string[];
    readingTime: string;
    marketState?: string; // e.g. "B_DATA_DAY"
    catalyst?: string; // e.g. "PCE Price Index (Dec)"
    events?: string[]; // e.g. ["08:30 ET — PCE Price Index (Dec)"]
    tldr: string[];
    marketOverview: MarketOverviewItem[];
    sections: {
        title: string;
        content: string; // markdown
    }[];
    keyLevels: KeyLevel[];
    scenarios: Scenario[];
    ttlTake: string; // markdown
    locale: "en" | "ko";
}

// ─── EN Briefs ──────────────────────────────────────────
export const dailyBriefsEN: DailyBrief[] = [
    {
        date: "2026-02-21",
        title: "PCE Day: The Stagflation Math Nobody Wants to Do",
        description:
            "Core PCE printed 3.0% YoY while GDP came in at 1.4% — the widest inflation-growth divergence since Q3 2022. The soft landing narrative is under serious pressure.",
        tags: ["PCE", "inflation", "GDP", "stagflation", "fed-policy"],
        readingTime: "4 min",
        marketState: "E",
        catalyst: "PCE Price Index (Jan) + GDP Miss",
        events: [
            "08:30 ET — Core PCE Price Index (Jan): 3.0% YoY, 0.4% MoM",
            "08:30 ET — GDP Q4 2nd Estimate: 1.4% (missed 2.5% consensus)",
        ],
        tldr: [
            "Core PCE printed 3.0% YoY — back above the psychologically critical 3% threshold",
            "Core PCE MoM at 0.4% (vs 0.3% expected) — annualized run rate well above Fed's 2% target",
            "GDP came in at 1.4%, badly missing 2.5% consensus — private sector weakness was the real story",
            "Widest inflation-growth divergence since Q3 2022 — stagflation warning",
            "Gold hit ATH at $5,027 — safe haven bid accelerating",
            "BTC at ~$67K, down 30% from ATH — risk-off macro pressure",
        ],
        marketOverview: [
            { asset: "SPX", last: "~6,950", change: "-0.1%", signal: "Muted reaction — for now" },
            { asset: "US10Y", last: "4.2%+", change: "+11bp this week", signal: "Higher for longer" },
            { asset: "Gold", last: "$5,027", change: "ATH", signal: "Safe haven bid" },
            { asset: "DXY", last: "97.6", change: "Surged", signal: "Dollar strength" },
            { asset: "BTC", last: "~$67K", change: "-30% from ATH", signal: "Risk-off pressure" },
        ],
        sections: [
            {
                title: "Two Numbers That Shouldn't Coexist",
                content: `Friday delivered two numbers that should not coexist in a "soft landing" scenario:

**Inflation accelerating**: Core PCE MoM at 0.4% (vs 0.3% expected) puts the annualized run rate well above the Fed's 2% target. Year-over-year at 3.0% breaks back above the psychologically important threshold.

**Growth decelerating**: GDP at 1.4% badly missed the 2.5% consensus. Government shutdown effects contributed, but private sector weakness was the real story.

This is the widest inflation-growth divergence since Q3 2022. The textbook definition of stagflation risk.`,
            },
            {
                title: "The Fed's Policy Dilemma",
                content: `The Fed now faces a genuine policy dilemma:

- **Cut into hot inflation?** Core PCE at 3% makes this politically and economically difficult. The market is already repricing rate cuts further out.

- **Hold into weakening growth?** GDP at 1.4% with private sector softening means the real economy is already feeling pressure.

There's no clean answer. The 10Y yield surging +11bp this week to above 4.2% tells you the bond market is pricing "higher for longer" as the base case. Gold's ATH at $5,027 tells you real money is hedging the worst-case scenario.`,
            },
        ],
        keyLevels: [
            { asset: "SPX", support: "6,900 / 6,850", resistance: "7,000 / 7,050", bias: "Neutral-bearish" },
            { asset: "US10Y", support: "4.15%", resistance: "4.30%", bias: "Bearish for equities" },
            { asset: "Gold", support: "$5,000 / $4,950", resistance: "$5,100", bias: "Bullish" },
            { asset: "BTC", support: "$64,000 / $60,000", resistance: "$70,000 / $76,000", bias: "Bearish" },
        ],
        scenarios: [
            {
                id: "A",
                probability: "55%",
                condition: "Monday opens with digestion — no follow-through selling",
                result: "SPX holds 6,900, 10Y stabilizes near 4.20% → range-bound week",
            },
            {
                id: "B",
                probability: "45%",
                condition: "Stagflation narrative gains traction over weekend",
                result: "SPX tests 6,850, 10Y pushes toward 4.30% → risk-off acceleration",
            },
        ],
        ttlTake: `Core PCE at 3.0% and GDP at 1.4% in the same week. The soft landing narrative just took a serious hit.

The market's muted Friday reaction doesn't mean the data has been priced in — it means the weekend gives portfolio managers time to rethink positioning. Monday's open will tell the real story.

**Active Bold Call**: BTC → $56,000 within 30 days (from Feb 20). Currently ~$67K. Macro thesis strengthened by PCE/GDP data. Invalidation: weekly close above $76K.

*Lose less. Last longer.*`,
        locale: "en",
    },
    {
        date: "2026-02-20",
        title: "PCE Day: The Number That Decides Everything",
        description:
            "December PCE data drops today. Here's the 3-step framework to read it — and what it means for SPX, bonds, and your trades.",
        tags: ["PCE", "inflation", "Fed", "KOSPI", "Walmart", "Deere", "10Y yield"],
        readingTime: "4 min",
        marketState: "B_DATA_DAY",
        catalyst: "PCE Price Index (Dec)",
        events: [
            "08:30 ET — PCE Price Index (Dec)",
            "08:30 ET — Personal Income (Dec)",
            "08:30 ET — Personal Spending (Dec)",
        ],
        tldr: [
            "PCE inflation data (Dec) releases today 08:30 ET — Fed's preferred measure",
            "Watch Core PCE MoM, not headline YoY",
            "10Y yield rising to 4.09% after hawkish FOMC minutes",
            "KOSPI hits record 5,677 but breadth is narrowing dangerously",
            "Walmart beat revenue but guided lower — consumer softening signal",
            "Deere beat by 19.8% and raised guidance — manufacturing divergence",
        ],
        marketOverview: [
            { asset: "SPX", last: "~6,000", change: "-0.5%", signal: "Data dependent — PCE reaction" },
            { asset: "NDX", last: "—", change: "—", signal: "Tech continues to lag" },
            { asset: "US10Y", last: "4.09%", change: "+5bps", signal: "FOMC hawkish repricing" },
            { asset: "VIX", last: "20.29", change: "-4.3%", signal: "Down from 22.7 but still elevated" },
            { asset: "BTC", last: "~$60K", change: "-17% YTD", signal: "-17% YTD, risk-off environment" },
            { asset: "Gold", last: "<$5,000", change: "Off highs", signal: "Off $5,700 highs" },
            { asset: "KOSPI", last: "5,677", change: "+3.09%", signal: "Record high but narrow breadth" },
            { asset: "DXY", last: "Elevated", change: "—", signal: "Hawkish FOMC supports dollar" },
        ],
        sections: [
            {
                title: "Today's Catalyst: PCE Price Index",
                content: `The Personal Consumption Expenditures price index is the Federal Reserve's preferred inflation gauge. Today's release covers December 2025 data.

### The 3-Step PCE Framework

**Step 1: Core PCE MoM**
Year-over-year is backward-looking noise. Month-over-month tells you the current inflation trend. Last reading was +0.1% MoM. Below that signals disinflation. Above 0.3% signals trouble.

**Step 2: Services ex-Housing PCE**
This is what Chair Powell focuses on. If this component is falling, the Fed pivot narrative is intact. If sticky, rate cuts get pushed further out.

**Step 3: Personal Spending vs Income Gap**
When spending exceeds income, consumers are borrowing to maintain lifestyle. Last reading showed spending at +0.5% vs income at +0.3%. The gap is widening.`,
            },
            {
                title: "Earnings Divergence: Walmart vs Deere",
                content: `A fascinating split emerged in yesterday's earnings:

**Walmart** beat on revenue ($190.66B) and comp sales (+4.6%), but guided FY EPS at $2.75-2.85 vs $2.96 expected. The consumer is spending today but the outlook is weakening.

**Deere** beat EPS by 19.8% ($2.42 vs $2.02), revenue by 26.6%, and raised full-year guidance to $4.5-5B. Manufacturing is accelerating.

This divergence — consumer softening while manufacturing strengthens — suggests a rotation is underway.`,
            },
            {
                title: "KOSPI: Record High, Narrow Breadth",
                content: `KOSPI hit 5,677 yesterday, up 3.09%. But the internals tell a different story:

- Samsung Electronics: +0.90% (index driver)
- SK Hynix: -0.79%
- Hyundai Motor: -1.28%
- LG Energy Solution: -3.54%

One stock is driving the index. This is a narrow market, not a strong market.`,
            },
        ],
        keyLevels: [
            { asset: "SPX", support: "5,920", resistance: "6,050", bias: "Neutral (data dependent)" },
            { asset: "10Y", support: "4.00%", resistance: "4.15%", bias: "Rising" },
            { asset: "BTC", support: "$58,000", resistance: "$63,000", bias: "Bearish until $63K reclaim" },
            { asset: "KOSPI", support: "5,500", resistance: "5,700", bias: "Bullish but narrow" },
        ],
        scenarios: [
            {
                id: "A",
                probability: "55%",
                condition: "Core PCE MoM ≤0.1%",
                result: "Bond rally → Equity relief → SPX tests 6,050",
            },
            {
                id: "B",
                probability: "45%",
                condition: "Core PCE MoM ≥0.3%",
                result: "10Y spikes above 4.15% → Equity pain deepens",
            },
        ],
        ttlTake: `PCE is today's market-mover. The bond market has already started repricing after hawkish FOMC minutes pushed 10Y from 4.04% to 4.09%.

The Walmart-Deere earnings divergence adds another layer. The rotation from consumer to manufacturing names may accelerate regardless of today's PCE print.

*Lose less. Last longer.*`,
        locale: "en",
    },
];

// ─── KO Briefs ──────────────────────────────────────────
export const dailyBriefsKO: DailyBrief[] = [
    {
        date: "2026-02-21",
        title: "PCE 데이: 아무도 하고 싶지 않은 스태그플레이션 계산",
        description:
            "Core PCE 3.0% YoY, GDP 1.4% — 2022년 3분기 이후 가장 큰 인플레이션-성장 괴리. 연착륙 내러티브에 심각한 압박.",
        tags: ["PCE", "인플레이션", "GDP", "스태그플레이션", "연준정책"],
        readingTime: "4분",
        marketState: "E",
        catalyst: "PCE 물가지수 (1월) + GDP 부진",
        events: [
            "08:30 ET — Core PCE 물가지수 (1월): 3.0% YoY, 0.4% MoM",
            "08:30 ET — GDP Q4 2차 추정: 1.4% (컨센서스 2.5% 대폭 하회)",
        ],
        tldr: [
            "Core PCE 3.0% YoY 기록 — 심리적 핵심 임계치 3% 재돌파",
            "Core PCE MoM 0.4% (예상 0.3%) — 연환산 추세율 연준 목표 2% 크게 상회",
            "GDP 1.4%, 컨센서스 2.5% 대폭 하회 — 민간부문 약세가 핵심",
            "2022년 3분기 이후 가장 큰 인플레이션-성장 괴리 — 스태그플레이션 경고",
            "금 사상 최고 $5,027 — 안전자산 수요 가속",
            "BTC ~$67K, ATH 대비 -30% — 리스크오프 매크로 압력",
        ],
        marketOverview: [
            { asset: "SPX", last: "~6,950", change: "-0.1%", signal: "일단 반응 억제 — 아직은" },
            { asset: "US10Y", last: "4.2%+", change: "주간 +11bp", signal: "Higher for longer" },
            { asset: "Gold", last: "$5,027", change: "ATH", signal: "안전자산 수요" },
            { asset: "DXY", last: "97.6", change: "급등", signal: "달러 강세" },
            { asset: "BTC", last: "~$67K", change: "ATH 대비 -30%", signal: "리스크오프 압력" },
        ],
        sections: [
            {
                title: "공존해서는 안 되는 두 숫자",
                content: `금요일 "연착륙" 시나리오에서 공존해서는 안 되는 두 숫자가 나왔습니다:

**인플레이션 가속**: Core PCE MoM 0.4% (예상 0.3%)로 연환산 추세율이 연준의 2% 목표를 크게 상회합니다. YoY 3.0%는 심리적으로 중요한 임계치를 재돌파했습니다.

**성장 감속**: GDP 1.4%로 컨센서스 2.5%를 대폭 하회했습니다. 정부 셧다운 효과가 일부 기여했지만, 민간부문 약세가 본질적인 문제입니다.

이는 2022년 3분기 이후 가장 큰 인플레이션-성장 괴리입니다. 교과서적인 스태그플레이션 리스크 정의입니다.`,
            },
            {
                title: "연준의 정책 딜레마",
                content: `연준이 이제 진정한 정책 딜레마에 직면했습니다:

- **뜨거운 인플레이션에 금리 인하?** Core PCE 3%에서 이는 정치적으로나 경제적으로 어렵습니다. 시장은 이미 금리 인하를 더 먼 미래로 재평가하고 있습니다.

- **약해지는 성장에 금리 동결?** 민간부문 둔화와 함께 GDP 1.4%는 실물경제가 이미 압박을 받고 있다는 의미입니다.

깔끔한 답은 없습니다. 10년물 금리가 이번 주 +11bp 급등하여 4.2%를 넘긴 것은 채권시장이 "higher for longer"를 기본 시나리오로 가격에 반영하고 있음을 보여줍니다. 금의 사상 최고 $5,027은 실질 자금이 최악의 시나리오를 헤지하고 있음을 의미합니다.`,
            },
        ],
        keyLevels: [
            { asset: "SPX", support: "6,900 / 6,850", resistance: "7,000 / 7,050", bias: "중립-약세" },
            { asset: "US10Y", support: "4.15%", resistance: "4.30%", bias: "주식에 약세" },
            { asset: "Gold", support: "$5,000 / $4,950", resistance: "$5,100", bias: "강세" },
            { asset: "BTC", support: "$64,000 / $60,000", resistance: "$70,000 / $76,000", bias: "약세" },
        ],
        scenarios: [
            {
                id: "A",
                probability: "55%",
                condition: "월요일 소화 장세로 개장 — 추가 매도 없음",
                result: "SPX 6,900 유지, 10Y 4.20% 안정 → 박스권 주간",
            },
            {
                id: "B",
                probability: "45%",
                condition: "주말 동안 스태그플레이션 내러티브 확산",
                result: "SPX 6,850 테스트, 10Y 4.30% 향해 상승 → 리스크오프 가속",
            },
        ],
        ttlTake: `Core PCE 3.0%와 GDP 1.4%가 같은 주에. 연착륙 내러티브가 심각한 타격을 받았습니다.

금요일 시장의 억제된 반응이 데이터가 가격에 반영되었다는 의미는 아닙니다 — 주말이 포트폴리오 매니저들에게 포지션 재고의 시간을 준다는 의미입니다. 월요일 개장이 진짜 이야기를 해줄 것입니다.

**활성 Bold Call**: BTC → $56,000 (30일 내, 2월 20일 기준). 현재 ~$67K. PCE/GDP 데이터로 매크로 논리 강화. 무효화: 주간 종가 $76K 상회.

*덜 잃고. 더 오래 버텨라.*`,
        locale: "ko",
    },
    {
        date: "2026-02-20",
        title: "PCE 데이: 모든 것을 결정하는 숫자",
        description:
            "12월 PCE 데이터가 오늘 발표됩니다. 이를 읽는 3단계 프레임워크와 SPX, 채권, 트레이딩에 미치는 영향을 정리합니다.",
        tags: ["PCE", "인플레이션", "Fed", "KOSPI", "월마트", "디어", "10년물 금리"],
        readingTime: "4분",
        marketState: "B_DATA_DAY",
        catalyst: "PCE 물가지수 (12월)",
        events: [
            "08:30 ET — PCE 물가지수 (12월)",
            "08:30 ET — 개인소득 (12월)",
            "08:30 ET — 개인지출 (12월)",
        ],
        tldr: [
            "12월 PCE 인플레이션 데이터 오늘 08:30 ET 발표 — 연준의 선호 지표",
            "헤드라인 YoY가 아닌 Core PCE MoM을 주목",
            "매파적 FOMC 의사록 이후 10년물 금리 4.09%로 상승",
            "KOSPI 사상 최고 5,677 기록 — 그러나 시장 폭이 위험하게 좁아지는 중",
            "월마트 매출 상회, 하지만 가이던스 하향 — 소비 둔화 신호",
            "디어 EPS 19.8% 상회 및 가이던스 상향 — 제조업 디커플링",
        ],
        marketOverview: [
            { asset: "SPX", last: "~6,000", change: "-0.5%", signal: "데이터 의존 — PCE 반응 대기" },
            { asset: "NDX", last: "—", change: "—", signal: "기술주 계속 부진" },
            { asset: "US10Y", last: "4.09%", change: "+5bps", signal: "FOMC 매파적 재평가" },
            { asset: "VIX", last: "20.29", change: "-4.3%", signal: "22.7에서 하락, 여전히 높음" },
            { asset: "BTC", last: "~$60K", change: "-17% YTD", signal: "YTD -17%, 리스크오프 환경" },
            { asset: "Gold", last: "<$5,000", change: "고점 대비 하락", signal: "$5,700 고점 대비 후퇴" },
            { asset: "KOSPI", last: "5,677", change: "+3.09%", signal: "사상 최고이나 시장 폭 좁음" },
            { asset: "DXY", last: "상승", change: "—", signal: "매파적 FOMC가 달러 지지" },
        ],
        sections: [
            {
                title: "오늘의 촉매: PCE 물가지수",
                content: `개인소비지출(PCE) 물가지수는 연준이 선호하는 인플레이션 지표입니다. 오늘 발표는 2025년 12월 데이터입니다.

### PCE 3단계 프레임워크

**1단계: Core PCE MoM (전월 대비)**
전년 대비(YoY)는 후행지표입니다. 전월 대비(MoM)가 현재 인플레이션 추세를 알려줍니다. 지난 발표는 +0.1% MoM이었습니다. 이 이하면 디스인플레이션, 0.3% 이상이면 경고 신호입니다.

**2단계: 주거 제외 서비스 PCE**
파월 의장이 집중하는 항목입니다. 이 구성요소가 하락하면 연준 피봇 내러티브가 유효합니다. 고착되면 금리 인하가 더 밀립니다.

**3단계: 개인지출 vs 소득 격차**
지출이 소득을 초과하면 소비자가 생활수준 유지를 위해 차입하는 것입니다. 지난 발표에서 지출 +0.5% vs 소득 +0.3%로 격차가 벌어지고 있습니다.`,
            },
            {
                title: "실적 디커플링: 월마트 vs 디어",
                content: `어제 실적에서 흥미로운 분화가 나타났습니다:

**월마트** 매출($1,906.6억) 및 동일점포 매출(+4.6%) 상회, 하지만 연간 EPS 가이던스 $2.75-2.85로 예상치 $2.96 하회. 소비자는 현재 지출 중이지만 전망이 약화되고 있습니다.

**디어** EPS 19.8% 상회($2.42 vs $2.02), 매출 26.6% 상회, 연간 가이던스 $45-50억으로 상향. 제조업이 가속하고 있습니다.

이 디커플링 — 소비 둔화 vs 제조업 강세 — 은 로테이션이 진행 중임을 시사합니다.`,
            },
            {
                title: "KOSPI: 사상 최고, 좁은 시장 폭",
                content: `KOSPI가 어제 5,677에서 3.09% 상승하며 사상 최고가를 기록했습니다. 하지만 내부는 다른 이야기를 합니다:

- 삼성전자: +0.90% (지수 상승 주도)
- SK하이닉스: -0.79%
- 현대자동차: -1.28%
- LG에너지솔루션: -3.54%

한 종목이 지수를 끌고 있습니다. 이것은 강한 시장이 아니라 좁은 시장입니다.`,
            },
        ],
        keyLevels: [
            { asset: "SPX", support: "5,920", resistance: "6,050", bias: "중립 (데이터 의존)" },
            { asset: "10Y", support: "4.00%", resistance: "4.15%", bias: "상승" },
            { asset: "BTC", support: "$58,000", resistance: "$63,000", bias: "$63K 회복 전까지 약세" },
            { asset: "KOSPI", support: "5,500", resistance: "5,700", bias: "강세이나 폭 좁음" },
        ],
        scenarios: [
            {
                id: "A",
                probability: "55%",
                condition: "Core PCE MoM ≤0.1%",
                result: "채권 반등 → 주식 안도 → SPX 6,050 테스트",
            },
            {
                id: "B",
                probability: "45%",
                condition: "Core PCE MoM ≥0.3%",
                result: "10년물 4.15% 돌파 → 주식 추가 하락",
            },
        ],
        ttlTake: `PCE가 오늘 시장을 움직일 핵심 이벤트입니다. 채권 시장은 매파적 FOMC 의사록 이후 10년물이 4.04%에서 4.09%로 상승하며 이미 재평가를 시작했습니다.

월마트-디어 실적 디커플링이 또 다른 레이어를 추가합니다. 소비주에서 제조업주로의 로테이션은 오늘 PCE 결과와 무관하게 가속될 수 있습니다.

*덜 잃고. 더 오래 버텨라.*`,
        locale: "ko",
    },
];

// ─── Helpers ────────────────────────────────────────────
export function getDailyBriefs(locale: "en" | "ko"): DailyBrief[] {
    const briefs = locale === "ko" ? dailyBriefsKO : dailyBriefsEN;
    return [...briefs].sort((a, b) => b.date.localeCompare(a.date));
}

export function getDailyBriefByDate(
    date: string,
    locale: "en" | "ko"
): DailyBrief | undefined {
    const briefs = locale === "ko" ? dailyBriefsKO : dailyBriefsEN;
    return briefs.find((b) => b.date === date);
}

export function getAllBriefDates(): string[] {
    return Array.from(new Set([...dailyBriefsEN, ...dailyBriefsKO].map((b) => b.date)));
}
