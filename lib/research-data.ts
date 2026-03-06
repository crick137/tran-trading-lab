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
    locale: 'ko' | 'en';
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
    // ─── KO Research Articles ──────────────────────────────────
    {
        slug: "kospi-post-crash-analysis-ko",
        title: "KOSPI 폭락 후 분석: 바닥인가, 데드캣 바운스인가",
        subtitle: "서킷브레이커 이후 시장 방향 탐색",
        description: "KOSPI -12% 폭락 + 서킷브레이커 후 +9.6% 반등. 역사적 패턴과 현재 구조를 분석하여 진짜 바닥 여부를 판단합니다.",
        symbol: "KOSPI",
        timeframe: "2-4주",
        bias: "neutral",
        date: "2026-03-05",
        readingTime: "8분",
        tags: ["KOSPI", "폭락", "서킷브레이커", "반등", "기술적분석"],
        image: "/images/research/kospi-3m.png",
        locale: "ko",
        articleType: "analysis",
        quickSummary: [
            { icon: "📉", text: "KOSPI 3월 4일 -12.06% — 역사상 최악의 단일일 하락 중 하나" },
            { icon: "📈", text: "3월 5일 +9.6% 반등 — 하지만 수학적으로 여전히 -3.6% 미달" },
            { icon: "🌍", text: "한국 고유의 위기 — 같은 날 S&P +0.8%, BTC +6.5%" },
            { icon: "⚠️", text: "서킷브레이커 후 2-4주 내 저점 재테스트 확률 60%" },
        ],
        sections: [
            {
                icon: "📊",
                title: "폭락의 해부",
                content: "3월 4일의 -12.06%는 단순한 하락이 아니었습니다. 서킷브레이커가 2회 발동되며 각 20분씩 거래가 중단됐습니다. 장중 최저점에서 KOSPI는 -14% 이상 하락했습니다.\n\n핵심 수치:\n- KOSPI: 6,307 → 5,094 (7거래일 만에 -19.2%)\n- 삼성전자: 218,000 → 172,200 (-21%)\n- SK하이닉스: 1,099,000 → 849,000 (-23%)\n- USD/KRW: 1,427 → 1,483 (원화 -3.8%)",
                highlights: [
                    "7거래일 만에 KOSPI -19.2%",
                    "삼성전자 -21%, SK하이닉스 -23%",
                    "원화 1,483원으로 급락",
                ]
            },
            {
                icon: "📈",
                title: "반등의 질 분석",
                content: "+9.6% 반등의 질을 평가하는 3가지 기준:\n\n1. **거래량**: 반등일 거래량이 폭락일 대비 80% 이상이면 강한 반등. 이번 반등은 약 75% 수준.\n2. **업종 확산**: 모든 업종이 고르게 반등했는지, 특정 업종만 반등했는지. 이번에는 반도체 주도 반등으로 편중.\n3. **외국인 동향**: 외국인이 순매수로 전환했는지. 아직 순매도 지속 중.",
                highlights: [
                    "거래량 75% — 보통 수준",
                    "반도체 편중 반등 — 확산 부족",
                    "외국인 순매도 지속 — 경고 신호",
                ]
            },
            {
                icon: "📜",
                title: "역사적 선례",
                content: "한국 시장 서킷브레이커 발동 후 패턴:\n\n- **2020년 3월 코로나**: -8% 서킷브레이커 → 다음 날 +8.6% 반등 → 2주 후 재하락 후 진짜 바닥\n- **2008년 10월 금융위기**: 서킷브레이커 → 반등 → 3주 후 새로운 저점\n\n공통 패턴: 서킷브레이커 직후 강한 반등 → 2-4주 내 저점 재테스트 → 재테스트 후 진짜 바닥 확인.\n\n첫 번째 반등이 바닥인 경우는 역사적으로 약 40%에 불과합니다.",
            },
            {
                icon: "🎯",
                title: "핵심 기술적 레벨",
                content: "향후 2-4주간 주시해야 할 핵심 가격대:\n\n**지지선:**\n- 5,094 (3월 4일 종가) — 이 레벨 유지 시 바닥 확인\n- 4,800 — 다음 주요 지지\n\n**저항선:**\n- 5,800 — 첫 번째 저항\n- 6,100 — 추세 회복 확인 레벨\n\nKOSPI가 5,094를 유지하면 바닥이 확인됩니다. 유지하지 못하면 4,800까지 추가 하락 가능.",
                highlights: [
                    "5,094 유지 = 바닥 확인",
                    "5,094 이탈 = 4,800 테스트",
                    "5,800 회복 = 정상화 시작",
                ]
            },
        ],
        scenarios: [
            {
                type: "bullish",
                title: "바닥 확인 시나리오",
                condition: "KOSPI가 5,094 위를 유지 + 외국인 순매수 전환 + 지정학 완화",
                meaning: "이번 폭락은 과매도였으며, 반등이 진짜 바닥",
                expectedFlow: "5,094 → 5,800 → 6,100 (2-4주)",
                strategy: "5,094-5,200 구간에서 분할 매수. 반도체 우량주 중심.",
            },
            {
                type: "bearish",
                title: "데드캣 바운스 시나리오",
                condition: "반등 후 재하락 + 외국인 매도 지속 + 원화 추가 약세",
                meaning: "첫 번째 반등은 기술적 반등에 불과, 진짜 바닥은 아래",
                expectedFlow: "5,584 → 5,094 재테스트 → 4,800 가능",
                strategy: "현금 비중 확대. 반등 시 포지션 축소. 4,800에서 관심 매수 재검토.",
            },
        ],
        checklist: [
            "KOSPI 5,094 레벨 일간 종가 확인",
            "외국인 순매수/순매도 일간 확인",
            "USD/KRW 1,500원 이탈 여부 모니터링",
            "호르무즈 해협 관련 뉴스 추적",
            "VIX 25 이상 유지 여부 확인",
            "삼성전자/SK하이닉스 개별 지지선 확인",
        ],
        conclusion: "역사적으로 서킷브레이커 직후의 첫 번째 반등이 바닥인 경우는 40%입니다. 60%는 2-4주 내에 저점을 재테스트합니다. 현재 외국인 순매도 지속 + 반도체 편중 반등 + 원화 약세를 고려하면, 저점 재테스트 가능성이 더 높습니다. 분할 매수 + 현금 보유가 현명한 전략입니다. 덜 잃고. 더 오래 버텨라.",
    },
    {
        slug: "sk-hynix-hbm4-thesis-ko",
        title: "SK하이닉스 HBM4 투자 논문: 100만원은 시작인가 끝인가",
        subtitle: "HBM4 슈퍼사이클과 밸류에이션 분석",
        description: "SK하이닉스 HBM4 칩렛 가격 $700, 영업이익률 50-60%, PER 11x. Micron PER 29x 대비 3배 저평가. 펀더멘털 심층 분석.",
        symbol: "SK Hynix",
        timeframe: "6-12개월",
        bias: "long",
        date: "2026-02-26",
        readingTime: "10분",
        tags: ["SK하이닉스", "HBM4", "반도체", "밸류에이션", "AI"],
        image: "/images/research/sk-hynix-daily.png",
        locale: "ko",
        articleType: "analysis",
        quickSummary: [
            { icon: "💰", text: "HBM4 칩렛 가격 $700 — HBM3E 대비 +30% 프리미엄" },
            { icon: "📊", text: "영업이익률 50-60% — 반도체 역사상 최고 수준" },
            { icon: "🏷️", text: "PER 11x — Micron(29x)의 1/3 밸류에이션" },
            { icon: "🤖", text: "AI 데이터센터 수요 → HBM 시장 2027년까지 연 40% 성장" },
        ],
        sections: [
            {
                icon: "🧪",
                title: "HBM4가 게임체인저인 이유",
                content: "HBM4(High Bandwidth Memory 4)는 AI 가속기에 필수적인 차세대 고대역폭 메모리입니다.\n\nHBM3E 대비 핵심 차별점:\n- **대역폭**: 1.65TB/s → 2.0TB/s+ (20% 향상)\n- **용량**: 칩당 24GB → 36GB (50% 향상)\n- **가격**: $540 → $700 (30% 프리미엄)\n- **공급**: SK하이닉스가 70%+ 시장점유율\n\nAI 모델이 커질수록 HBM 수요는 선형이 아니라 기하급수적으로 증가합니다. GPT-5급 모델은 GPT-4 대비 4-8배의 HBM을 필요로 합니다.",
                highlights: [
                    "대역폭 20% 향상, 용량 50% 향상",
                    "칩당 $700 — 역대 최고 ASP",
                    "SK하이닉스 시장점유율 70%+",
                ]
            },
            {
                icon: "💹",
                title: "밸류에이션 비교",
                content: "SK하이닉스의 현재 밸류에이션은 글로벌 반도체 동종업 대비 극도로 저평가되어 있습니다.\n\n| 지표 | SK하이닉스 | Micron | NVIDIA |\n|------|-----------|--------|--------|\n| PER | 11x | 29x | 45x |\n| 영업이익률 | 55% | 28% | 65% |\n| 매출 성장률(YoY) | +45% | +25% | +80% |\n| HBM 매출 비중 | 50%+ | 20% | N/A |\n\nSK하이닉스는 Micron보다 2배 높은 이익률로 3배 싼 밸류에이션에 거래되고 있습니다. 이 격차는 '한국 디스카운트'로 설명되지만, HBM4 슈퍼사이클에서 디스카운트가 축소될 가능성이 높습니다.",
                highlights: [
                    "PER 11x — 동종업 평균 25x 대비 56% 할인",
                    "이익률은 Micron의 2배",
                    "한국 디스카운트 축소 가능성",
                ]
            },
            {
                icon: "⚠️",
                title: "리스크 요인",
                content: "모든 강세 논문에는 리스크가 있습니다:\n\n1. **기술 리스크**: HBM4 양산 수율이 기대에 못 미칠 가능성. 현재 수율은 70% 수준으로 추정.\n2. **경쟁 리스크**: Samsung의 HBM4 인증이 확보되면 시장점유율 압박.\n3. **수요 리스크**: AI 투자 사이클이 예상보다 빨리 정점을 찍을 가능성.\n4. **지정학 리스크**: 호르무즈 위기 재발 시 한국 시장 전체 리스크.\n5. **환율 리스크**: 원화 약세 시 외국인 매도 압력 증가.",
                highlights: [
                    "HBM4 수율 리스크 — 70% 수준",
                    "Samsung 경쟁 — HBM4 인증 시 점유율 압박",
                    "AI 사이클 정점 가능성",
                ]
            },
            {
                icon: "🎯",
                title: "목표 가격과 전략",
                content: "**기본 시나리오 (PER 15x 적용)**\n- 2026 예상 EPS: ~100,000원\n- 목표 가격: 1,500,000원 (+36%)\n\n**낙관 시나리오 (PER 18x 적용)**\n- 글로벌 리레이팅 + 한국 디스카운트 축소\n- 목표 가격: 1,800,000원 (+64%)\n\n**현재 주가 (3월 5일 기준)**: 941,000원 (100만원에서 -16%)\n\n전략: 현재 레벨에서 30% 분할 매수 시작. 850,000원까지 추가 하락 시 추가 30% 매수. 나머지 40%는 바닥 확인 후.",
            },
        ],
        scenarios: [
            {
                type: "bullish",
                title: "HBM4 슈퍼사이클 확장",
                condition: "HBM4 양산 수율 80%+ + AI 데이터센터 투자 지속 + 한국 디스카운트 축소",
                meaning: "100만원은 시작에 불과. 멀티플 리레이팅으로 150만원+ 가능",
                expectedFlow: "941,000 → 1,100,000 → 1,300,000 → 1,500,000 (6-12개월)",
                strategy: "현재 레벨에서 분할 매수. 목표 PER 15x.",
            },
            {
                type: "bearish",
                title: "AI 사이클 정점 + 수율 문제",
                condition: "HBM4 수율 60% 이하 + AI 투자 둔화 신호 + Samsung 인증 성공",
                meaning: "100만원이 이번 사이클의 고점이었을 가능성",
                expectedFlow: "941,000 → 800,000 → 700,000 (3-6개월)",
                strategy: "800,000원 이탈 시 손절. 700,000원에서 재평가.",
            },
        ],
        checklist: [
            "HBM4 양산 수율 업데이트 확인 (분기별)",
            "NVIDIA/AMD/Google HBM 주문 동향 추적",
            "Samsung HBM4 인증 뉴스 모니터링",
            "외국인 SK하이닉스 순매수/순매도 일간 확인",
            "USD/KRW 환율 동향 — 1,500원 이상 시 경고",
            "AI 데이터센터 CAPEX 가이던스 (분기별)",
            "100만원 레벨 회복 여부 — 심리적 저항선",
        ],
        conclusion: "SK하이닉스의 HBM4 펀더멘털은 명확합니다. PER 11x에 55% 영업이익률은 글로벌 동종업 대비 극도로 저평가입니다. 단기적으로 지정학 리스크와 폭락 후유증이 주가를 누르고 있지만, HBM4 슈퍼사이클의 구조적 수혜는 변하지 않았습니다. 100만원 돌파가 FOMO의 정점이었다면, 현재의 941,000원은 펀더멘털 매수의 기회입니다. 다만, 분할 매수와 현금 비중 유지는 필수. 덜 잃고. 더 오래 버텨라.",
    },
    {
        slug: "btc-safe-haven-thesis-ko",
        title: "BTC 안전자산 논문: 한국 폭락에서 비트코인이 +6.5% 급등한 이유",
        subtitle: "디지털 골드 내러티브의 실전 검증",
        description: "KOSPI -12% 폭락일에 BTC는 +6.5% 급등. 비트코인의 안전자산 내러티브가 실제로 작동한 사례 분석.",
        symbol: "BTC",
        timeframe: "3-6개월",
        bias: "long",
        date: "2026-03-04",
        readingTime: "7분",
        tags: ["BTC", "비트코인", "안전자산", "디커플링", "크립토"],
        image: "/images/research/btc-safe-haven.png",
        locale: "ko",
        articleType: "analysis",
        quickSummary: [
            { icon: "🪙", text: "3월 4일: KOSPI -12% vs BTC +6.5% — 완벽한 디커플링" },
            { icon: "📊", text: "2월 28일~3월 4일: BTC $66,996 → $72,711 (+8.5%)" },
            { icon: "🏦", text: "24/7 거래 → 지정학 위기 시 가장 빠른 반응 자산" },
            { icon: "⚖️", text: "한국 시장 헤지 수단으로서의 BTC 역할 부각" },
        ],
        sections: [
            {
                icon: "🔍",
                title: "디커플링의 증거",
                content: "3월 4일의 데이터는 BTC의 안전자산 내러티브를 강력하게 뒷받침합니다.\n\n| 자산 | 변동 | 방향 |\n|------|------|------|\n| KOSPI | -12.06% | 폭락 |\n| 삼성전자 | -11.7% | 폭락 |\n| 금 | +0.2% | 보합 |\n| S&P 500 | +0.8% | 상승 |\n| BTC | +6.5% | 급등 |\n\nBTC는 한국 시장 폭락에도 불구하고 급등했습니다. 이는 BTC가 한국 시장 리스크와 음의 상관관계를 보인 첫 번째 대규모 사례입니다.",
                highlights: [
                    "한국 폭락일에 BTC는 오히려 급등",
                    "전통적 안전자산(금)보다 강한 반응",
                    "음의 상관관계 최초 대규모 확인",
                ]
            },
            {
                icon: "🕐",
                title: "24/7 거래의 가치",
                content: "호르무즈 위기가 토요일에 터졌을 때:\n- 한국 시장: **닫힘** (3일 연속)\n- 미국 시장: **닫힘** (주말)\n- 금 선물: **닫힘** (주말)\n- BTC: **열림** ✅\n\nBTC는 전통 시장이 모두 닫힌 주말에 유일하게 거래 가능한 유동성 높은 자산이었습니다. 지정학 리스크에 대한 헤지가 필요한 투자자들에게 BTC가 유일한 출구였습니다.\n\n이것은 BTC의 구조적 우위입니다. 위기는 시장이 열려 있을 때만 오지 않습니다.",
                highlights: [
                    "주말 위기 시 유일한 거래 가능 자산",
                    "지정학 헤지의 유일한 출구",
                    "24/7 유동성 = 구조적 프리미엄",
                ]
            },
            {
                icon: "⚠️",
                title: "주의사항",
                content: "BTC 안전자산 논문에는 중요한 제한이 있습니다:\n\n1. **모든 위기에서 안전하지 않음**: 2022년 FTX 붕괴, 2020년 3월 코로나 초기에 BTC도 급락. BTC가 안전자산으로 작동하는 것은 '전통 금융 외부'의 위기일 때.\n2. **변동성 자체가 리스크**: 안전자산치고는 변동성이 너무 높음. 하루 -10%도 가능.\n3. **규제 리스크**: 한국 크립토 규제 강화 시 접근성 제한 가능.\n4. **상관관계 지속성 불확실**: 이번 디커플링이 구조적인지, 일시적인지 아직 판단 불가.",
            },
            {
                icon: "💡",
                title: "포트폴리오 전략",
                content: "BTC를 한국 시장 포트폴리오의 헤지 수단으로 활용하는 전략:\n\n**추천 배분**: 전체 포트폴리오의 5-10%\n- 5%: 보수적 — 폭락 시 포트폴리오 손실 완충\n- 10%: 공격적 — 디커플링 시나리오 적극 활용\n\n**진입 전략**: 현재 $73,000 수준에서 분할 매수. $65,000까지 하락 시 추가 매수.\n\n**주의**: BTC는 헤지 수단이지, 메인 포지션이 아닙니다. 전체 포트폴리오의 10%를 초과하지 않을 것을 권장합니다.",
                highlights: [
                    "포트폴리오의 5-10% 배분 권장",
                    "한국 시장 리스크 헤지 목적",
                    "10% 초과 배분 비권장",
                ]
            },
        ],
        scenarios: [
            {
                type: "bullish",
                title: "디지털 골드 내러티브 강화",
                condition: "지정학 리스크 지속 + BTC ETF 자금 유입 + 금리 인하 기대",
                meaning: "BTC가 안전자산으로 재평가되며 프리미엄 확대",
                expectedFlow: "$73,000 → $80,000 → $90,000 (3-6개월)",
                strategy: "현재 레벨에서 5% 배분. $80,000에서 일부 차익 실현.",
            },
            {
                type: "bearish",
                title: "크립토 고유 리스크 발현",
                condition: "규제 강화 + 크립토 거래소 문제 + 글로벌 유동성 축소",
                meaning: "안전자산 내러티브 후퇴, 위험자산으로 재분류",
                expectedFlow: "$73,000 → $60,000 → $50,000 (3-6개월)",
                strategy: "$65,000 이탈 시 포지션 50% 축소. $50,000에서 재평가.",
            },
        ],
        checklist: [
            "BTC-KOSPI 상관계수 주간 업데이트",
            "BTC ETF 자금 유입/유출 일간 확인",
            "호르무즈/지정학 뉴스 추적",
            "한국 크립토 규제 동향 모니터링",
            "$65,000 지지선 유지 여부 확인",
            "금 vs BTC 상대 강도 비교",
        ],
        conclusion: "3월 4일은 BTC 안전자산 논문의 실전 검증이었습니다. KOSPI가 -12% 폭락하는 동안 BTC는 +6.5% 급등 — 완벽한 디커플링. 특히 24/7 거래가 가능한 BTC는 주말 위기 시 유일한 헤지 수단이었습니다. 다만, 모든 위기에서 작동하는 것은 아니며, 포트폴리오의 5-10%를 초과하지 않는 것이 현명합니다. 덜 잃고. 더 오래 버텨라.",
    },

    // ─── EN Research Articles ──────────────────────────────────
    {
        slug: "kospi-post-crash-analysis-en",
        title: "KOSPI Post-Crash Analysis: Real Bottom or Dead Cat Bounce?",
        subtitle: "Navigating Market Direction After the Circuit Breaker",
        description: "KOSPI crashed -12% with circuit breakers, then bounced +9.6%. Analyzing historical patterns and current structure to determine if the bottom is in.",
        symbol: "KOSPI",
        timeframe: "2-4 weeks",
        bias: "neutral",
        date: "2026-03-05",
        readingTime: "8 min",
        tags: ["KOSPI", "crash", "circuit-breaker", "bounce", "technical-analysis"],
        image: "/images/research/kospi-3m.png",
        locale: "en",
        articleType: "analysis",
        quickSummary: [
            { icon: "📉", text: "KOSPI fell -12.06% on March 4 — one of the worst single-day drops in history" },
            { icon: "📈", text: "March 5 bounce of +9.6% — but mathematically still -3.6% below pre-crash" },
            { icon: "🌍", text: "Korea-specific crisis — same day S&P was +0.8%, BTC +6.5%" },
            { icon: "⚠️", text: "60% probability of retesting lows within 2-4 weeks post circuit breaker" },
        ],
        sections: [
            {
                icon: "📊",
                title: "Anatomy of the Crash",
                content: "March 4th's -12.06% was not a simple decline. Circuit breakers triggered twice, halting trading for 20 minutes each time. At its worst intraday point, KOSPI was down over 14%.\n\nKey numbers:\n- KOSPI: 6,307 → 5,094 (-19.2% in 7 trading days)\n- Samsung: 218,000 → 172,200 won (-21%)\n- SK Hynix: 1,099,000 → 849,000 won (-23%)\n- USD/KRW: 1,427 → 1,483 (won -3.8%)",
                highlights: [
                    "KOSPI down -19.2% in 7 trading days",
                    "Samsung -21%, SK Hynix -23%",
                    "Won crashed to 1,483 per dollar",
                ]
            },
            {
                icon: "📈",
                title: "Quality of the Bounce",
                content: "Three criteria to evaluate the +9.6% bounce quality:\n\n1. **Volume**: Bounce-day volume should be 80%+ of crash-day volume for a strong bounce. This bounce was approximately 75%.\n2. **Sector breadth**: Did all sectors bounce evenly? This bounce was semiconductor-led and concentrated.\n3. **Foreign flows**: Did foreigners switch to net buying? Still net selling.",
                highlights: [
                    "Volume at 75% — moderate level",
                    "Semiconductor-concentrated bounce — lacking breadth",
                    "Foreigners still net selling — warning signal",
                ]
            },
            {
                icon: "📜",
                title: "Historical Precedents",
                content: "Post-circuit-breaker patterns in the Korean market:\n\n- **March 2020 (COVID)**: -8% circuit breaker → next day +8.6% bounce → retest 2 weeks later → real bottom\n- **October 2008 (GFC)**: Circuit breaker → bounce → new low 3 weeks later\n\nCommon pattern: Strong bounce immediately after circuit breaker → retest of lows within 2-4 weeks → real bottom confirmed after retest.\n\nHistorically, the first bounce is the actual bottom only about 40% of the time.",
            },
            {
                icon: "🎯",
                title: "Key Technical Levels",
                content: "Critical price levels to monitor over the next 2-4 weeks:\n\n**Support:**\n- 5,094 (March 4 close) — if held, bottom confirmed\n- 4,800 — next major support\n\n**Resistance:**\n- 5,800 — first resistance\n- 6,100 — trend recovery confirmation\n\nIf KOSPI holds 5,094, the bottom is confirmed. If it breaks below, a decline to 4,800 is possible.",
                highlights: [
                    "5,094 holds = bottom confirmed",
                    "5,094 breaks = 4,800 test",
                    "5,800 recovery = normalization begins",
                ]
            },
        ],
        scenarios: [
            {
                type: "bullish",
                title: "Bottom Confirmed",
                condition: "KOSPI holds above 5,094 + foreigners turn net buyers + geopolitical de-escalation",
                meaning: "The crash was an overshoot and the bounce marks a genuine bottom",
                expectedFlow: "5,094 → 5,800 → 6,100 (2-4 weeks)",
                strategy: "Scale in at 5,094-5,200. Focus on quality semiconductor names.",
            },
            {
                type: "bearish",
                title: "Dead Cat Bounce",
                condition: "Bounce fades + foreign selling continues + won weakness persists",
                meaning: "First bounce was technical only — real bottom is lower",
                expectedFlow: "5,584 → retest 5,094 → possible 4,800",
                strategy: "Raise cash. Reduce on bounces. Reassess at 4,800.",
            },
        ],
        checklist: [
            "Monitor KOSPI daily close relative to 5,094",
            "Track daily foreign net buy/sell data",
            "Watch USD/KRW for breach above 1,500",
            "Follow Hormuz Strait geopolitical developments",
            "Check if VIX stays above 25",
            "Monitor Samsung/SK Hynix individual support levels",
        ],
        conclusion: "Historically, only 40% of first bounces after circuit breakers mark the real bottom. 60% see a retest within 2-4 weeks. Given persistent foreign selling, semiconductor-concentrated bounce, and won weakness, the probability of a retest is elevated. Scale-in buying with cash reserves is the prudent strategy. Lose less. Last longer.",
    },
    {
        slug: "sk-hynix-hbm4-thesis-en",
        title: "SK Hynix HBM4 Investment Thesis: Is 1 Million Won the Beginning or the End?",
        subtitle: "HBM4 Supercycle and Valuation Analysis",
        description: "SK Hynix HBM4 chiplet pricing at $700, operating margins at 50-60%, PER 11x vs Micron's 29x. Deep fundamental analysis.",
        symbol: "SK Hynix",
        timeframe: "6-12 months",
        bias: "long",
        date: "2026-02-26",
        readingTime: "10 min",
        tags: ["SK-Hynix", "HBM4", "semiconductors", "valuation", "AI"],
        image: "/images/research/sk-hynix-daily.png",
        locale: "en",
        articleType: "analysis",
        quickSummary: [
            { icon: "💰", text: "HBM4 chiplet price $700 — 30% premium over HBM3E" },
            { icon: "📊", text: "Operating margins 50-60% — highest in semiconductor history" },
            { icon: "🏷️", text: "PER 11x — one-third of Micron's 29x valuation" },
            { icon: "🤖", text: "AI datacenter demand → HBM market growing 40% annually through 2027" },
        ],
        sections: [
            {
                icon: "🧪",
                title: "Why HBM4 Is a Game Changer",
                content: "HBM4 (High Bandwidth Memory 4) is the next-generation high-bandwidth memory essential for AI accelerators.\n\nKey advantages over HBM3E:\n- **Bandwidth**: 1.65TB/s → 2.0TB/s+ (20% improvement)\n- **Capacity**: 24GB per stack → 36GB (50% increase)\n- **Price**: $540 → $700 (30% premium)\n- **Supply**: SK Hynix holds 70%+ market share\n\nAs AI models grow larger, HBM demand increases not linearly but exponentially. GPT-5 class models require 4-8x the HBM of GPT-4.",
                highlights: [
                    "20% bandwidth improvement, 50% capacity increase",
                    "$700 per chiplet — record ASP",
                    "SK Hynix 70%+ market share",
                ]
            },
            {
                icon: "💹",
                title: "Valuation Comparison",
                content: "SK Hynix's current valuation is deeply discounted versus global semiconductor peers.\n\n| Metric | SK Hynix | Micron | NVIDIA |\n|--------|----------|--------|--------|\n| PER | 11x | 29x | 45x |\n| Operating Margin | 55% | 28% | 65% |\n| Revenue Growth (YoY) | +45% | +25% | +80% |\n| HBM Revenue Share | 50%+ | 20% | N/A |\n\nSK Hynix trades at one-third of Micron's valuation while delivering twice the margin. The gap is explained by the 'Korea Discount,' but HBM4 supercycle dynamics may narrow this discount significantly.",
                highlights: [
                    "PER 11x — 56% discount to peer average of 25x",
                    "Margins 2x Micron's",
                    "Korea Discount likely to narrow",
                ]
            },
            {
                icon: "⚠️",
                title: "Risk Factors",
                content: "Every bullish thesis has risks:\n\n1. **Technology risk**: HBM4 mass production yields may fall short. Current estimates suggest ~70% yields.\n2. **Competition risk**: Samsung's HBM4 certification could pressure market share.\n3. **Demand risk**: AI investment cycle could peak earlier than expected.\n4. **Geopolitical risk**: Hormuz crisis recurrence threatens the entire Korean market.\n5. **Currency risk**: Won weakness increases foreign selling pressure.",
                highlights: [
                    "HBM4 yield risk — estimated 70%",
                    "Samsung competition — certification pressure",
                    "AI cycle peak possibility",
                ]
            },
            {
                icon: "🎯",
                title: "Price Targets and Strategy",
                content: "**Base case (PER 15x)**\n- 2026 estimated EPS: ~100,000 won\n- Target price: 1,500,000 won (+36%)\n\n**Bull case (PER 18x)**\n- Global re-rating + Korea Discount narrowing\n- Target price: 1,800,000 won (+64%)\n\n**Current price (as of March 5)**: 941,000 won (-16% from peak)\n\nStrategy: Begin with 30% position at current levels. Add another 30% if it dips to 850,000. Reserve 40% for post-bottom confirmation.",
            },
        ],
        scenarios: [
            {
                type: "bullish",
                title: "HBM4 Supercycle Extension",
                condition: "HBM4 yields reach 80%+ + AI datacenter spending continues + Korea Discount narrows",
                meaning: "1 million won was just the start. Multiple re-rating to 1.5M+ possible",
                expectedFlow: "941,000 → 1,100,000 → 1,300,000 → 1,500,000 (6-12 months)",
                strategy: "Scale in at current levels. Target PER 15x.",
            },
            {
                type: "bearish",
                title: "AI Cycle Peak + Yield Issues",
                condition: "HBM4 yields below 60% + AI investment slowdown + Samsung certification success",
                meaning: "1 million won was this cycle's peak",
                expectedFlow: "941,000 → 800,000 → 700,000 (3-6 months)",
                strategy: "Stop loss at 800,000. Re-evaluate at 700,000.",
            },
        ],
        checklist: [
            "Track HBM4 production yield updates (quarterly)",
            "Monitor NVIDIA/AMD/Google HBM order trends",
            "Watch for Samsung HBM4 certification news",
            "Check daily foreign net buy/sell for SK Hynix",
            "Monitor USD/KRW — warning above 1,500",
            "Track AI datacenter CAPEX guidance (quarterly)",
            "Watch 1M won level recovery — psychological resistance",
        ],
        conclusion: "SK Hynix's HBM4 fundamentals are clear. PER 11x with 55% operating margins represents extreme undervaluation versus global peers. Short-term geopolitical risk and post-crash aftershocks weigh on the stock, but the structural tailwind from the HBM4 supercycle remains intact. If the million-won breakthrough was the peak of FOMO, the current 941,000 won level is a fundamental buying opportunity. Scale in with discipline. Lose less. Last longer.",
    },
    {
        slug: "btc-safe-haven-thesis-en",
        title: "BTC Safe Haven Thesis: Why Bitcoin Surged +6.5% While Korea Crashed",
        subtitle: "Real-World Validation of the Digital Gold Narrative",
        description: "On the day KOSPI crashed -12%, BTC surged +6.5%. Analyzing the case for Bitcoin as a safe haven during regional market crises.",
        symbol: "BTC",
        timeframe: "3-6 months",
        bias: "long",
        date: "2026-03-04",
        readingTime: "7 min",
        tags: ["BTC", "Bitcoin", "safe-haven", "decoupling", "crypto"],
        image: "/images/research/btc-safe-haven.png",
        locale: "en",
        articleType: "analysis",
        quickSummary: [
            { icon: "🪙", text: "March 4: KOSPI -12% vs BTC +6.5% — perfect decoupling" },
            { icon: "📊", text: "Feb 28 to Mar 4: BTC $66,996 → $72,711 (+8.5%)" },
            { icon: "🏦", text: "24/7 trading → fastest-reacting asset during geopolitical crisis" },
            { icon: "⚖️", text: "BTC's role as Korea market hedge highlighted" },
        ],
        sections: [
            {
                icon: "🔍",
                title: "Evidence of Decoupling",
                content: "March 4th data strongly supports BTC's safe haven narrative.\n\n| Asset | Change | Direction |\n|-------|--------|-----------|\n| KOSPI | -12.06% | Crash |\n| Samsung | -11.7% | Crash |\n| Gold | +0.2% | Flat |\n| S&P 500 | +0.8% | Up |\n| BTC | +6.5% | Surge |\n\nBTC surged despite the Korean market crash. This represents the first large-scale case of BTC showing negative correlation with Korean market risk.",
                highlights: [
                    "BTC surged on Korea's crash day",
                    "Stronger reaction than traditional safe havens (gold)",
                    "First major negative correlation event confirmed",
                ]
            },
            {
                icon: "🕐",
                title: "The Value of 24/7 Trading",
                content: "When the Hormuz crisis hit on Saturday:\n- Korean market: **Closed** (3 consecutive days)\n- US market: **Closed** (weekend)\n- Gold futures: **Closed** (weekend)\n- BTC: **Open** ✅\n\nBTC was the only liquid, tradeable asset when all traditional markets were closed. For investors needing to hedge geopolitical risk, BTC was the only exit.\n\nThis is BTC's structural advantage. Crises don't only happen during market hours.",
                highlights: [
                    "Only tradeable asset during weekend crisis",
                    "Only exit for geopolitical hedging",
                    "24/7 liquidity = structural premium",
                ]
            },
            {
                icon: "⚠️",
                title: "Important Caveats",
                content: "The BTC safe haven thesis has important limitations:\n\n1. **Not safe in all crises**: During the 2022 FTX collapse and early March 2020 COVID panic, BTC crashed too. BTC acts as safe haven mainly during crises external to crypto.\n2. **Volatility is itself a risk**: For a safe haven, BTC's volatility is extremely high. -10% in a single day is possible.\n3. **Regulatory risk**: Korean crypto regulation tightening could limit accessibility.\n4. **Correlation persistence uncertain**: Whether this decoupling is structural or temporary remains unclear.",
            },
            {
                icon: "💡",
                title: "Portfolio Strategy",
                content: "Using BTC as a hedge within a Korea-focused portfolio:\n\n**Recommended allocation**: 5-10% of total portfolio\n- 5%: Conservative — cushions portfolio losses during crashes\n- 10%: Aggressive — actively exploits decoupling scenarios\n\n**Entry strategy**: Scale in at current $73,000 level. Add more if it dips to $65,000.\n\n**Important**: BTC is a hedge, not a core position. Do not exceed 10% of total portfolio.",
                highlights: [
                    "5-10% portfolio allocation recommended",
                    "Purpose: Korean market risk hedging",
                    "Do not exceed 10% allocation",
                ]
            },
        ],
        scenarios: [
            {
                type: "bullish",
                title: "Digital Gold Narrative Strengthens",
                condition: "Geopolitical risks persist + BTC ETF inflows + rate cut expectations",
                meaning: "BTC re-rated as safe haven with expanding premium",
                expectedFlow: "$73,000 → $80,000 → $90,000 (3-6 months)",
                strategy: "5% allocation at current levels. Partial profit at $80,000.",
            },
            {
                type: "bearish",
                title: "Crypto-Specific Risk Materializes",
                condition: "Regulatory crackdown + exchange issues + global liquidity tightening",
                meaning: "Safe haven narrative retreats, reclassified as risk asset",
                expectedFlow: "$73,000 → $60,000 → $50,000 (3-6 months)",
                strategy: "Reduce position 50% if $65,000 breaks. Reassess at $50,000.",
            },
        ],
        checklist: [
            "Update BTC-KOSPI correlation weekly",
            "Track BTC ETF daily inflows/outflows",
            "Follow Hormuz/geopolitical news",
            "Monitor Korean crypto regulation developments",
            "Check $65,000 support holding",
            "Compare gold vs BTC relative strength",
        ],
        conclusion: "March 4th was a real-world validation of the BTC safe haven thesis. While KOSPI crashed -12%, BTC surged +6.5% — a perfect decoupling. BTC's 24/7 trading made it the only hedge available during the weekend crisis. However, this doesn't work in all scenarios, and portfolio allocation should not exceed 5-10%. Lose less. Last longer.",
    },
];

export const getResearchBySlug = (slug: string): ResearchArticle | undefined => {
    return researchArticles.find(article => article.slug === slug);
};
