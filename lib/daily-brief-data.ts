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
        date: "2026-02-23",
        title: "Capital Rotation: Gold Hits $5,100, KOSPI at All-Time Highs While Bitcoin ETFs Bleed $250M Daily",
        description:
            "Gold crossed $5,100 with a 74% YoY gain. KOSPI hit all-time highs. Meanwhile, Bitcoin spot ETFs saw 4 consecutive days of outflows totaling $250M per day. Here's what the capital rotation means.",
        tags: ["capital-rotation", "gold", "KOSPI", "Bitcoin-ETF", "outflows", "HBM4", "SK-Hynix"],
        readingTime: "4 min",
        marketState: "E",
        catalyst: "Capital Rotation — Gold ATH $5,109 + KOSPI ATH + BTC ETF 4-Day Outflows",
        events: [
            "Monday — Housing data, consumer confidence",
            "Tuesday — $8B Treasury injection",
            "Thursday — Weekly jobless claims, GDP revision",
            "Friday — PCE (consensus 2.5% YoY — key for June rate cut pricing)",
        ],
        tldr: [
            "Gold at $5,109/oz — up 74% in 12 months, safe haven bid accelerating",
            "KOSPI at 5,808 near ATH — Korean institutions bought $1B+ while foreigners sold $920M",
            "Bitcoin spot ETF: 4 consecutive days of outflows at $250M/day",
            "Ethereum spot ETF: $180M/day outflows",
            "Fear & Greed Index at 43 — firmly in Fear territory",
            "SK Hynix at PER 11x vs Micron 29x despite earning 3x more — HBM4 value play",
            "Gold-to-Bitcoin historical lag: 100-150 days — Bitcoin's move could begin Q3 2026",
        ],
        marketOverview: [
            { asset: "Gold", last: "$5,109", change: "+74% YoY", signal: "ATH — safe haven bid" },
            { asset: "SPX", last: "6,862", change: "Steady", signal: "Resilient" },
            { asset: "KOSPI", last: "5,808", change: "Near ATH", signal: "Institutional buying $1B+" },
            { asset: "BTC", last: "$68,198", change: "Weak", signal: "ETF outflows $250M/day" },
            { asset: "ETH", last: "$3,097", change: "Weak", signal: "ETF outflows $180M/day" },
            { asset: "10Y", last: "4.09%", change: "Stable", signal: "PCE Friday key" },
        ],
        sections: [
            {
                title: "The Divergence That Defines February 2026",
                content: `The numbers tell a clear story: traditional assets are at all-time highs while crypto struggles.

**Where capital is flowing:**
- Gold: $5,109/oz, up 74% in 12 months
- S&P 500: 6,862, steady gains
- KOSPI: 5,808, near all-time highs with institutional buying of $1B+

**Where capital is leaving:**
- Bitcoin spot ETF: 4 consecutive days of outflows, $250M/day
- Ethereum spot ETF: $180M/day outflows
- Fear & Greed Index: 43 (Fear territory)`,
            },
            {
                title: "The Korean Equity Story",
                content: `The KOSPI story is particularly interesting. Foreign investors sold $920M, but Korean institutions stepped in with over $1B in net buying. The sectors leading the charge: semiconductors, nuclear, defense, and shipbuilding.

SK Hynix at 544,000 KRW with a PER of 11x versus Micron's 29x — despite earning 3x more. The HBM4 supercycle with chip prices at $700 (up 30% from HBM3E) and operating margins of 50-60% make Korean semis the value play of 2026.`,
            },
            {
                title: "What ETF Outflows Actually Mean",
                content: `Not all outflows are bearish. The current streak is largely driven by:

- Basis trade unwinding (hedge funds closing arbitrage positions)
- Quarterly portfolio rebalancing
- Tax-loss harvesting

The August 2024 precedent: a 7-day outflow streak at $58,000 preceded a rally to $108,000 in four months.`,
            },
            {
                title: "The Gold-to-Bitcoin Lag",
                content: `Historically, major gold breakouts precede Bitcoin's next leg by 100-150 days. Gold broke out in October 2025. If the pattern holds, Bitcoin's move begins in Q3 2026.`,
            },
        ],
        keyLevels: [
            { asset: "BTC", support: "$65,000", resistance: "$72,000", bias: "Neutral — ETF flow dependent" },
            { asset: "ETH", support: "$3,000", resistance: "$3,300", bias: "Bearish until outflows stop" },
            { asset: "KOSPI", support: "5,500", resistance: "6,000", bias: "Bullish — institutional support" },
            { asset: "Gold", support: "$4,800", resistance: "$5,300", bias: "Bullish" },
            { asset: "10Y", support: "4.00%", resistance: "4.15%", bias: "PCE Friday = catalyst" },
        ],
        scenarios: [
            {
                id: "A",
                probability: "55%",
                condition: "ETF outflows stabilize + gold momentum continues + PCE in-line Friday",
                result: "BTC reclaims $70K, KOSPI tests 6,000 → rotation narrative shifts to risk-on",
            },
            {
                id: "B",
                probability: "45%",
                condition: "ETF outflows accelerate + hot PCE print Friday",
                result: "BTC loses $65K support, gold extends to $5,300 → capital rotation deepens into safe havens",
            },
        ],
        ttlTake: `Gold at $5,109 and KOSPI near ATH while Bitcoin ETFs bleed $250M daily. The capital rotation is undeniable.

But context matters. The August 2024 precedent showed that a 7-day ETF outflow streak at $58,000 preceded a rally to $108,000. Current outflows are largely mechanical — basis trades, rebalancing, tax harvesting — not panic selling.

The gold-to-Bitcoin lag of 100-150 days suggests patience. Gold broke out in October 2025. If the historical pattern holds, Bitcoin's next major move begins Q3 2026.

**This week's key**: Friday's PCE at consensus 2.5% YoY will determine whether June rate cut pricing holds. That's the macro catalyst that could break the current range.

*Lose less. Last longer. Grow faster.*`,
        locale: "en",
    },
    {
        date: "2026-02-22",
        title: "Stagflation Signals Intensify: GDP 1.4%, Core PCE 3.0%, While KOSPI Hits ATH",
        description:
            "US GDP missed at 1.4% while Core PCE rose to 3.0%. Meanwhile, KOSPI hit 5,809 ATH driven by Samsung's HBM4. A stagflation framework for traders.",
        tags: ["GDP", "PCE", "stagflation", "KOSPI", "Samsung", "HBM4", "Fed"],
        readingTime: "4 min",
        marketState: "E",
        catalyst: "GDP Q4 Miss + Core PCE 3.0% + KOSPI ATH",
        events: [
            "08:30 ET — GDP Q4 2025: 1.4% (missed 3.0% consensus)",
            "08:30 ET — Core PCE: 3.0% YoY (vs 2.9% expected, prior 2.8%)",
            "KRX — KOSPI: 5,809 ATH (+2.3%)",
            "KRX — Samsung Electronics: 190,900 KRW ATH",
        ],
        tldr: [
            "GDP Q4 2025 printed 1.4% — sharpest deceleration since the pandemic, missing 3.0% consensus",
            "Core PCE rose to 3.0% YoY from 2.8%, topping 2.9% consensus — monthly core at 0.4%",
            "Growth slowing + inflation rising = textbook stagflation signal",
            "KOSPI hit ATH at 5,809 — up 34% YTD, world's best-performing major index",
            "Samsung hit ATH on HBM4 chips priced ~$700/unit with 50-60% operating margins",
            "BTC range-bound at $67,584 — macro headwinds from rising real rates",
            "Oil (WTI) +2% on Iran geopolitical tensions",
        ],
        marketOverview: [
            { asset: "GDP Q4", last: "1.4%", change: "Missed 3.0%", signal: "Sharpest deceleration since pandemic" },
            { asset: "Core PCE", last: "3.0% YoY", change: "+0.4% MoM", signal: "Above 3% threshold" },
            { asset: "KOSPI", last: "5,809", change: "ATH (+34% YTD)", signal: "World's best major index" },
            { asset: "Samsung", last: "190,900 KRW", change: "ATH", signal: "HBM4 pricing power" },
            { asset: "BTC", last: "$67,584", change: "Range-bound", signal: "Real rate pressure" },
            { asset: "Oil (WTI)", last: "+2%", change: "Rising", signal: "Iran tensions" },
        ],
        sections: [
            {
                title: "The Setup: Two Numbers That Changed the Narrative",
                content: `Two data points released on February 20 changed the macro narrative:

**GDP Q4 2025 printed 1.4%** — the sharpest deceleration since the pandemic. Wall Street expected 3.0%. The government shutdown subtracted approximately 1.0 percentage points, but even adjusting for that, underlying growth came in around 2.4% — below trend.

**Core PCE rose to 3.0%** from 2.8%, topping the 2.9% consensus. Monthly core PCE increased 0.4%, the strongest gain in months.

Growth slowing. Inflation rising. The textbook definition of stagflation.`,
            },
            {
                title: "The Divergence: KOSPI ATH Amid US Macro Weakness",
                content: `While US macro deteriorates, KOSPI hit an all-time high at 5,809 — up 34% year-to-date, making it the world's best-performing major index.

The driver: Samsung Electronics hit a record high after HBM4 chips were priced at approximately $700 per unit — a 30% premium over HBM3E. Operating margins are expected at 50-60%.

Samsung and SK Hynix together control roughly 80% of global HBM market share. The AI infrastructure buildout is creating structural demand regardless of US macro conditions.`,
            },
            {
                title: "Stagflation Framework: 3 Phases",
                content: `**Phase 1 — Data Divergence (Current):** Growth metrics declining while inflation metrics rising simultaneously. GDP at 1.4% vs Core PCE at 3.0% is the clearest signal.

**Phase 2 — Policy Paralysis:** Central bank unable to cut rates (inflation too hot) or hike (growth too weak). This phase typically lasts 6-18 months. The Fed is entering this phase now.

**Phase 3 — Forced Resolution:** A crisis catalyst triggers decisive policy response. History shows this phase is where the biggest dislocations — and opportunities — occur.`,
            },
        ],
        keyLevels: [
            { asset: "SPX", support: "50-day MA", resistance: "7,000", bias: "Neutral-bearish" },
            { asset: "KOSPI", support: "5,677", resistance: "6,000", bias: "Overbought — watch RSI divergence" },
            { asset: "BTC", support: "$66,000", resistance: "$70,000", bias: "Range-bound" },
            { asset: "USD/KRW", support: "—", resistance: "—", bias: "FX vol = key risk for KR equity" },
        ],
        scenarios: [
            {
                id: "A",
                probability: "50%",
                condition: "Stagflation narrative digested — market focuses on KOSPI momentum and AI demand",
                result: "SPX holds 50-day MA, KOSPI tests 6,000 psychological level → rotation into Asia continues",
            },
            {
                id: "B",
                probability: "50%",
                condition: "Fed minutes reinforce higher-for-longer — stagflation fears escalate",
                result: "SPX breaks below 50-day MA, BTC loses $66K support → risk-off deepens",
            },
        ],
        ttlTake: `GDP at 1.4% and Core PCE at 3.0%. The stagflation math is now undeniable.

But the KOSPI divergence tells an important story: structural demand drivers (AI/HBM) can override macro headwinds. Samsung's HBM4 pricing power at $700/unit with 50-60% margins is a genuine paradigm shift.

**Next week's watchlist**: Fed minutes for March rate outlook, KOSPI 6,000 psychological test, BTC $66K support, Iran oil risk premium.

*Markets move on Liquidity + Positioning. Lose less. Last longer.*`,
        locale: "en",
    },
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
        date: "2026-02-23",
        title: "자본 로테이션: 금 $5,100 돌파, KOSPI 사상 최고 — 비트코인 ETF는 매일 $2.5억 유출",
        description:
            "금이 YoY 74% 상승하며 $5,100을 돌파했습니다. KOSPI는 사상 최고. 한편 비트코인 현물 ETF는 4일 연속 일평균 $2.5억 유출. 자본 로테이션의 의미를 분석합니다.",
        tags: ["자본로테이션", "금", "KOSPI", "비트코인ETF", "유출", "HBM4", "SK하이닉스"],
        readingTime: "4분",
        marketState: "E",
        catalyst: "자본 로테이션 — 금 ATH $5,109 + KOSPI ATH + BTC ETF 4일 연속 유출",
        events: [
            "월요일 — 주택 데이터, 소비자 신뢰지수",
            "화요일 — $80억 국채 투입",
            "목요일 — 주간 실업수당 청구, GDP 수정치",
            "금요일 — PCE (컨센서스 2.5% YoY — 6월 금리 인하 가격에 핵심)",
        ],
        tldr: [
            "금 $5,109/oz — 12개월간 74% 상승, 안전자산 수요 가속",
            "KOSPI 5,808 ATH 근접 — 기관 순매수 $10억+ vs 외국인 $9.2억 순매도",
            "비트코인 현물 ETF: 4일 연속 유출, 일평균 $2.5억",
            "이더리움 현물 ETF: 일평균 $1.8억 유출",
            "Fear & Greed Index 43 — 공포 영역",
            "SK하이닉스 PER 11배 vs 마이크론 29배 — 수익은 3배 더 많음 — HBM4 밸류 플레이",
            "금→비트코인 역사적 래그: 100-150일 — BTC 움직임 Q3 2026 시작 가능",
        ],
        marketOverview: [
            { asset: "금", last: "$5,109", change: "YoY +74%", signal: "ATH — 안전자산 수요" },
            { asset: "SPX", last: "6,862", change: "안정", signal: "회복력 유지" },
            { asset: "KOSPI", last: "5,808", change: "ATH 근접", signal: "기관 순매수 $10억+" },
            { asset: "BTC", last: "$68,198", change: "약세", signal: "ETF 유출 $2.5억/일" },
            { asset: "ETH", last: "$3,097", change: "약세", signal: "ETF 유출 $1.8억/일" },
            { asset: "10Y", last: "4.09%", change: "안정", signal: "금요일 PCE가 핵심" },
        ],
        sections: [
            {
                title: "2026년 2월을 정의하는 디커플링",
                content: `숫자가 명확한 이야기를 합니다: 전통 자산은 사상 최고인 반면 크립토는 고전 중입니다.

**자본이 흘러가는 곳:**
- 금: $5,109/oz, 12개월간 74% 상승
- S&P 500: 6,862, 꾸준한 상승
- KOSPI: 5,808, 기관 순매수 $10억+ 으로 사상 최고 근접

**자본이 빠져나가는 곳:**
- 비트코인 현물 ETF: 4일 연속 유출, 일평균 $2.5억
- 이더리움 현물 ETF: 일평균 $1.8억 유출
- Fear & Greed Index: 43 (공포 영역)`,
            },
            {
                title: "한국 주식 스토리",
                content: `KOSPI 스토리가 특히 흥미롭습니다. 외국인이 $9.2억을 매도했지만, 한국 기관이 $10억 이상 순매수로 대응했습니다. 주도 업종: 반도체, 원자력, 방산, 조선.

SK하이닉스 544,000원, PER 11배 vs 마이크론 29배 — 수익은 3배 더 많음에도. HBM4 슈퍼사이클 — 칩 단가 $700 (HBM3E 대비 30% 상승), 영업이익률 50-60% — 한국 반도체가 2026년의 밸류 플레이입니다.`,
            },
            {
                title: "ETF 유출이 실제로 의미하는 것",
                content: `모든 유출이 약세 신호는 아닙니다. 현재 유출은 주로 다음에 의해 발생:

- 베이시스 트레이드 청산 (헤지펀드의 차익거래 포지션 해소)
- 분기별 포트폴리오 리밸런싱
- 세금 손실 매도

2024년 8월 선례: $58,000에서 7일간 유출 후 4개월 만에 $108,000까지 상승.`,
            },
            {
                title: "금→비트코인 래그",
                content: `역사적으로 금의 주요 돌파는 비트코인의 다음 상승을 100-150일 앞섭니다. 금은 2025년 10월에 돌파했습니다. 패턴이 유지된다면 비트코인의 움직임은 2026년 Q3에 시작됩니다.`,
            },
        ],
        keyLevels: [
            { asset: "BTC", support: "$65,000", resistance: "$72,000", bias: "중립 — ETF 자금 흐름 의존" },
            { asset: "ETH", support: "$3,000", resistance: "$3,300", bias: "유출 중단 전까지 약세" },
            { asset: "KOSPI", support: "5,500", resistance: "6,000", bias: "강세 — 기관 지지" },
            { asset: "금", support: "$4,800", resistance: "$5,300", bias: "강세" },
            { asset: "10Y", support: "4.00%", resistance: "4.15%", bias: "금요일 PCE = 촉매" },
        ],
        scenarios: [
            {
                id: "A",
                probability: "55%",
                condition: "ETF 유출 안정화 + 금 모멘텀 지속 + 금요일 PCE 컨센서스 부합",
                result: "BTC $70K 회복, KOSPI 6,000 테스트 → 로테이션 내러티브가 리스크온으로 전환",
            },
            {
                id: "B",
                probability: "45%",
                condition: "ETF 유출 가속 + 금요일 PCE 상회",
                result: "BTC $65K 지지 이탈, 금 $5,300으로 연장 → 안전자산으로 자본 로테이션 심화",
            },
        ],
        ttlTake: `금 $5,109, KOSPI ATH 근접, 비트코인 ETF는 매일 $2.5억 유출. 자본 로테이션은 부인할 수 없습니다.

하지만 맥락이 중요합니다. 2024년 8월 선례는 $58,000에서 7일간 ETF 유출 후 $108,000까지 상승했음을 보여줍니다. 현재 유출은 대부분 기계적 — 베이시스 트레이드, 리밸런싱, 세금 매도 — 이지 패닉 셀링이 아닙니다.

금→비트코인 100-150일 래그가 인내를 요구합니다. 금은 2025년 10월에 돌파했습니다. 역사적 패턴이 유지된다면 비트코인의 다음 주요 움직임은 Q3 2026에 시작됩니다.

**이번 주 핵심**: 금요일 PCE 컨센서스 2.5% YoY가 6월 금리 인하 가격 유지 여부를 결정합니다. 현재 레인지를 깨뜨릴 매크로 촉매입니다.

*덜 잃고. 더 오래 버텨라.*`,
        locale: "ko",
    },
    {
        date: "2026-02-22",
        title: "스태그플레이션 신호 강화: GDP 1.4%, Core PCE 3.0%, KOSPI 사상 최고",
        description:
            "미국 GDP 1.4% 부진, Core PCE 3.0% 상승. 한편 KOSPI 5,809 ATH — 삼성 HBM4가 견인. 트레이더를 위한 스태그플레이션 프레임워크.",
        tags: ["GDP", "PCE", "스태그플레이션", "KOSPI", "삼성", "HBM4", "연준"],
        readingTime: "4분",
        marketState: "E",
        catalyst: "GDP Q4 부진 + Core PCE 3.0% + KOSPI ATH",
        events: [
            "08:30 ET — GDP Q4 2025: 1.4% (컨센서스 3.0% 하회)",
            "08:30 ET — Core PCE: 3.0% YoY (예상 2.9%, 이전 2.8%)",
            "KRX — KOSPI: 5,809 ATH (+2.3%)",
            "KRX — 삼성전자: 190,900원 ATH",
        ],
        tldr: [
            "GDP Q4 2025 1.4% — 팬데믹 이후 가장 급격한 감속, 컨센서스 3.0% 대폭 하회",
            "Core PCE 3.0% YoY (2.8%→3.0%), 컨센서스 2.9% 상회 — 월간 0.4%",
            "성장 둔화 + 인플레이션 상승 = 교과서적 스태그플레이션 신호",
            "KOSPI 5,809 ATH — YTD +34%, 세계 주요 지수 중 최고 수익률",
            "삼성전자 ATH — HBM4 칩 단가 ~$700, 영업이익률 50-60% 전망",
            "BTC $67,584 박스권 — 실질금리 상승 압박",
            "원유(WTI) +2% — 이란 지정학적 긴장",
        ],
        marketOverview: [
            { asset: "GDP Q4", last: "1.4%", change: "3.0% 하회", signal: "팬데믹 이후 최대 감속" },
            { asset: "Core PCE", last: "3.0% YoY", change: "MoM +0.4%", signal: "3% 임계치 돌파" },
            { asset: "KOSPI", last: "5,809", change: "ATH (YTD +34%)", signal: "세계 최고 주요 지수" },
            { asset: "삼성전자", last: "190,900원", change: "ATH", signal: "HBM4 가격결정력" },
            { asset: "BTC", last: "$67,584", change: "박스권", signal: "실질금리 압박" },
            { asset: "원유(WTI)", last: "+2%", change: "상승", signal: "이란 긴장" },
        ],
        sections: [
            {
                title: "셋업: 내러티브를 바꾼 두 숫자",
                content: `2월 20일 발표된 두 데이터가 매크로 내러티브를 바꿨습니다:

**GDP Q4 2025 1.4%** — 팬데믹 이후 가장 급격한 감속. 월가 컨센서스는 3.0%였습니다. 정부 셧다운이 약 1.0%p를 차감했지만, 이를 조정해도 기저 성장률은 약 2.4%로 추세 이하입니다.

**Core PCE 3.0%** — 2.8%에서 상승, 컨센서스 2.9%를 상회. 월간 Core PCE는 0.4% 상승으로 수개월 내 최고치입니다.

성장 둔화. 인플레이션 상승. 스태그플레이션의 교과서적 정의.`,
            },
            {
                title: "디커플링: 미국 매크로 약세 속 KOSPI ATH",
                content: `미국 매크로가 악화되는 가운데, KOSPI는 5,809에서 사상 최고가를 경신했습니다 — YTD +34%로 세계 주요 지수 중 최고 수익률.

핵심 동력: 삼성전자가 HBM4 칩 단가 약 $700 — HBM3E 대비 30% 프리미엄 — 으로 사상 최고가를 기록했습니다. 영업이익률 50-60% 전망.

삼성과 SK하이닉스가 글로벌 HBM 시장의 약 80%를 점유하고 있습니다. AI 인프라 구축이 미국 매크로 상황과 무관하게 구조적 수요를 창출하고 있습니다.`,
            },
            {
                title: "스태그플레이션 프레임워크: 3단계",
                content: `**1단계 — 데이터 괴리 (현재):** 성장 지표 하락과 인플레이션 지표 상승이 동시 진행. GDP 1.4% vs Core PCE 3.0%가 가장 명확한 신호.

**2단계 — 정책 마비:** 중앙은행이 금리 인하(인플레이션 과열)도 인상(성장 약세)도 할 수 없는 상태. 통상 6-18개월 지속. 연준이 이 단계에 진입 중.

**3단계 — 강제 해소:** 위기 촉매가 결정적 정책 대응을 유발. 역사적으로 이 단계에서 가장 큰 혼란과 기회가 발생합니다.`,
            },
        ],
        keyLevels: [
            { asset: "SPX", support: "50일 이평선", resistance: "7,000", bias: "중립-약세" },
            { asset: "KOSPI", support: "5,677", resistance: "6,000", bias: "과매수 — RSI 다이버전스 주목" },
            { asset: "BTC", support: "$66,000", resistance: "$70,000", bias: "박스권" },
            { asset: "USD/KRW", support: "—", resistance: "—", bias: "환율 변동성 = 한국 주식 핵심 리스크" },
        ],
        scenarios: [
            {
                id: "A",
                probability: "50%",
                condition: "스태그플레이션 내러티브 소화 — 시장이 KOSPI 모멘텀과 AI 수요에 집중",
                result: "SPX 50일선 유지, KOSPI 6,000 심리적 레벨 테스트 → 아시아 로테이션 지속",
            },
            {
                id: "B",
                probability: "50%",
                condition: "연준 의사록이 higher-for-longer 강화 — 스태그플레이션 우려 확대",
                result: "SPX 50일선 하회, BTC $66K 지지 이탈 → 리스크오프 심화",
            },
        ],
        ttlTake: `GDP 1.4%와 Core PCE 3.0%. 스태그플레이션 계산은 이제 부정할 수 없습니다.

하지만 KOSPI 디커플링은 중요한 이야기를 합니다: 구조적 수요 동력(AI/HBM)이 매크로 역풍을 상쇄할 수 있습니다. 삼성의 HBM4 가격결정력 — 단가 $700, 영업이익률 50-60% — 은 진정한 패러다임 전환입니다.

**다음 주 워치리스트**: 3월 금리 전망을 위한 연준 의사록, KOSPI 6,000 심리적 테스트, BTC $66K 지지, 이란 원유 리스크 프리미엄.

*덜 잃고. 더 오래 버텨라.*`,
        locale: "ko",
    },
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
