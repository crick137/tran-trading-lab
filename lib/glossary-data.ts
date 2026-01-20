export interface GlossaryTerm {
    id: string;
    term_en: string;
    term_kr: string;
    abbreviation?: string;
    category: "SMC" | "ORB" | "리스크 관리" | "시장 구조" | "주문/유동성" | "기초/차트";
    one_liner: string;
    definition: string;
    how_to_use: string[];
    common_mistakes: string[];
    related_terms: string[];
    examples: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
    // ===================== SMC (Smart Money Concept) =====================
    {
        id: "order-block",
        term_en: "Order Block",
        term_kr: "오더 블록",
        abbreviation: "OB",
        category: "SMC",
        one_liner: "기관 주문이 집중된 가격대로, 되돌림 시 진입 구간으로 활용됩니다.",
        definition: "오더 블록은 큰 가격 움직임이 시작되기 직전에 형성된 반대 방향의 캔들 또는 캔들 영역을 말합니다. 예를 들어, 강한 상승이 시작되기 전 마지막으로 나타난 음봉이 상승 OB가 됩니다.\n\n기관 투자자들은 대량 주문을 한 번에 체결하기 어렵기 때문에, 특정 가격대에서 나눠서 매수/매도합니다. 이런 주문이 집중된 곳이 바로 오더 블록입니다.\n\n가격이 오더 블록으로 되돌아올 때, 기관들의 미체결 주문이 남아있을 가능성이 높아 반등/반락이 일어나기 쉽습니다.",
        how_to_use: [
            "강한 상승 전 마지막 음봉 영역을 표시하고, 가격이 되돌아오면 매수 진입 고려",
            "OB 상단/하단을 손절 기준으로 설정하여 리스크 관리",
            "FVG나 유동성 스윕과 함께 나타날 때 신뢰도가 높아짐"
        ],
        common_mistakes: [
            "모든 음봉/양봉을 OB로 보는 실수 - 반드시 강한 가격 움직임이 뒤따라야 함",
            "이미 여러 번 터치된 OB를 계속 유효하다고 보는 것",
            "상위 타임프레임 추세를 무시하고 OB만 보고 진입하는 것"
        ],
        related_terms: ["fair-value-gap", "mitigation-block", "breaker-block", "liquidity"],
        examples: [
            "KOSPI 선물 15분봉에서 강한 상승 전 마지막 음봉 영역(2,450~2,455)을 OB로 표시. 가격이 2,452까지 되돌림 후 반등하여 상승 추세 지속.",
            "비트코인 1시간봉에서 급락 전 마지막 양봉 구간을 매도 OB로 활용, 되돌림 시 숏 진입."
        ]
    },
    {
        id: "fair-value-gap",
        term_en: "Fair Value Gap",
        term_kr: "공정가치갭",
        abbreviation: "FVG",
        category: "SMC",
        one_liner: "급격한 가격 변동으로 생긴 '공백 구간'으로, 가격이 채우러 돌아올 확률이 높습니다.",
        definition: "FVG는 연속된 3개 캔들에서 첫 번째 캔들의 위크(꼬리)와 세 번째 캔들의 위크가 서로 겹치지 않을 때 생기는 가격 공백입니다.\n\n이 구간은 매수/매도 주문이 불균형하게 체결되어 '효율적인 가격 발견'이 이루어지지 않은 영역입니다. 시장은 이런 비효율 구간을 메우려는 경향이 있습니다.\n\n상승 FVG(Bullish FVG)는 강세 움직임에서 생기며, 가격이 하락해 이 갭을 채우면 매수 기회가 될 수 있습니다.",
        how_to_use: [
            "FVG 영역으로 되돌림 시 진입 타이밍으로 활용",
            "50% 되돌림(Consequent Encroachment)을 정밀 진입점으로 사용",
            "OB와 겹치는 FVG는 더 강력한 지지/저항 역할"
        ],
        common_mistakes: [
            "모든 갭을 FVG로 보는 것 - 3캔들 조건을 정확히 확인해야 함",
            "100% 채워질 것이라 가정하고 무작정 진입하는 것",
            "상위 타임프레임 추세를 무시하고 하위 FVG에만 집중"
        ],
        related_terms: ["order-block", "imbalance", "displacement", "premium-discount"],
        examples: [
            "1분봉에서 급등 후 생긴 FVG 영역(10,200~10,220)으로 가격이 되돌아와 10,210에서 반등.",
            "일봉 FVG가 50% 지점까지만 채워지고 추세 방향으로 재출발하는 패턴 자주 관찰됨."
        ]
    },
    {
        id: "liquidity",
        term_en: "Liquidity",
        term_kr: "유동성",
        category: "SMC",
        one_liner: "스탑로스와 진입 주문이 집중된 가격대로, 기관의 주요 타겟이 됩니다.",
        definition: "유동성은 특정 가격대에 모여 있는 스탑로스와 대기 주문을 의미합니다. 기술적 분석에서 많은 트레이더가 같은 곳에 스탑을 설정하기 때문에, 이 영역은 대량 주문을 체결하려는 기관들의 '사냥터'가 됩니다.\n\n유동성은 주로 스윙 고점/저점, 동일 고가/저가(Equal Highs/Lows), 추세선, 라운드 넘버 등에 형성됩니다.\n\n'Liquidity Sweep'은 가격이 이런 유동성을 잠깐 뚫고 스탑을 터뜨린 뒤 반전하는 현상입니다.",
        how_to_use: [
            "스윙 고점/저점 위아래에 유동성이 모여있다고 가정하고, 스윕 후 반전을 노림",
            "유동성 스윕 + OB 진입 조합으로 확률 높은 셋업 구성",
            "Equal Highs/Lows 형성 시 유동성 사냥 가능성 대비"
        ],
        common_mistakes: [
            "모든 고점/저점 돌파를 진짜 돌파로 착각하는 것 - 스윕일 수 있음",
            "유동성만 보고 진입하는 것 - 반드시 반전 확인 캔들 필요",
            "유동성 영역에 스탑을 두는 것 - 쉽게 사냥당함"
        ],
        related_terms: ["liquidity-sweep", "stop-hunt", "equal-high-low", "inducement"],
        examples: [
            "여러 번 같은 고점(25,000)을 찍은 후, 가격이 25,050까지 순간 돌파 후 급락 → 유동성 스윕 발생.",
            "중요 지지선 아래에 스탑이 밀집 → 해당 가격 터치 후 V자 반등."
        ]
    },
    {
        id: "bos",
        term_en: "Break of Structure",
        term_kr: "구조 이탈",
        abbreviation: "BOS",
        category: "시장 구조",
        one_liner: "이전 스윙 고점/저점을 돌파하여 추세 지속을 확인하는 움직임입니다.",
        definition: "BOS는 현재 추세 방향으로 이전 스윙 포인트를 넘어서는 가격 움직임입니다. 상승 추세에서는 이전 스윙 고점을 돌파할 때, 하락 추세에서는 이전 스윙 저점을 이탈할 때 BOS가 발생합니다.\n\nBOS는 추세가 계속된다는 신호로, 추세 추종 트레이더에게 진입 또는 포지션 유지 근거가 됩니다.\n\nCHOCH와 구분해야 합니다 - CHOCH는 추세 '반대' 방향으로의 첫 구조 이탈입니다.",
        how_to_use: [
            "상승 추세에서 BOS 발생 후 OB/FVG로 되돌림 시 롱 진입",
            "BOS 확인 전까지는 추세 전환으로 섣불리 판단하지 않기",
            "상위 타임프레임 BOS를 하위 타임프레임 진입 기준으로 활용"
        ],
        common_mistakes: [
            "위크가 살짝 넘은 것을 BOS로 오판 - 캔들 종가 기준으로 확인",
            "모든 BOS에서 바로 진입 - 되돌림을 기다려야 리스크 관리 가능",
            "하위 타임프레임 노이즈를 상위 추세 전환으로 착각"
        ],
        related_terms: ["choch", "market-structure", "swing-high-low", "internal-structure"],
        examples: [
            "KOSDAQ 15분봉에서 이전 고점 840 돌파하며 BOS 확인 → 되돌림 후 매수 진입.",
            "다우 지수 1시간봉에서 연속 BOS 발생하며 상승 추세 유지 확인."
        ]
    },
    {
        id: "choch",
        term_en: "Change of Character",
        term_kr: "성격 변화",
        abbreviation: "CHOCH",
        category: "시장 구조",
        one_liner: "기존 추세 '반대' 방향으로 처음 구조를 이탈하며 추세 전환 가능성을 알립니다.",
        definition: "CHOCH는 현재 추세 내에서 반대 방향으로 첫 번째 구조 이탈이 발생하는 것을 말합니다. 예를 들어, 계속 낮은 고점-낮은 저점을 만들던 하락 추세에서 처음으로 이전 고점을 돌파하면 CHOCH입니다.\n\nCHOCH는 잠재적 추세 전환의 첫 신호로, 기존 포지션 정리나 신규 반대 포지션 검토의 근거가 됩니다.\n\n단, CHOCH 하나만으로 완전한 추세 전환을 확신할 순 없으며, 후속 가격 행동(연속 BOS 등)을 확인해야 합니다.",
        how_to_use: [
            "CHOCH 발생 시 기존 추세 포지션의 부분 청산 또는 스탑 조정 고려",
            "CHOCH 후 되돌림에서 새로운 추세 방향으로 진입 기회 탐색",
            "유동성 스윕 + CHOCH 조합은 강력한 반전 신호"
        ],
        common_mistakes: [
            "모든 CHOCH를 확정적 추세 전환으로 믿는 것",
            "하위 타임프레임 CHOCH만 보고 상위 추세에 против 역행 진입",
            "CHOCH 없이 감으로 '이제 반전이다'라고 판단"
        ],
        related_terms: ["bos", "market-structure", "mss", "trend"],
        examples: [
            "EUR/USD 4시간봉에서 하락 추세 중 처음으로 이전 고점 1.0850 돌파 → CHOCH 발생, 상승 전환 검토.",
            "비트코인 일봉 하락 추세에서 CHOCH 발생 후 추가 BOS로 상승 추세 확정."
        ]
    },
    {
        id: "mss",
        term_en: "Market Structure Shift",
        term_kr: "시장 구조 전환",
        abbreviation: "MSS",
        category: "시장 구조",
        one_liner: "CHOCH와 비슷하게, 시장 구조가 완전히 전환되는 결정적 순간을 의미합니다.",
        definition: "MSS는 시장 구조가 상승에서 하락으로, 또는 하락에서 상승으로 완전히 바뀌는 것을 나타냅니다. 일부 트레이더는 CHOCH와 동일하게 사용하고, 일부는 더 명확한 전환(연속 BOS 포함)을 MSS로 구분합니다.\n\n핵심은 '고점-저점 연속성'의 변화입니다. Higher High/Higher Low 패턴이 Lower High/Lower Low로 바뀌거나 그 반대일 때 MSS가 발생합니다.",
        how_to_use: [
            "MSS 확인 후 새로운 추세 방향으로만 거래",
            "MSS 지점 아래/위에 스탑 설정으로 추세 전환 실패 대비",
            "상위 타임프레임 MSS를 하위에서 정밀 진입 타이밍으로 활용"
        ],
        common_mistakes: [
            "횡보장에서 발생하는 가짜 MSS에 속는 것",
            "MSS 전에 미리 반전을 예측하고 진입하는 것",
            "한 번의 캔들로 MSS를 확정짓는 것 - 확인 캔들 필요"
        ],
        related_terms: ["choch", "bos", "trend", "swing-high-low"],
        examples: [
            "골드 1시간봉에서 Lower Low 만들다가 갑자기 Higher High 형성 → MSS 발생.",
            "KOSPI 200 선물에서 상승 추세 중 Lower Low 확정되며 하락 MSS."
        ]
    },
    {
        id: "mitigation-block",
        term_en: "Mitigation Block",
        term_kr: "완화 블록",
        category: "SMC",
        one_liner: "이미 한 번 반응했지만 아직 유효한 오더 블록으로, 재진입 기회를 제공합니다.",
        definition: "Mitigation Block은 가격이 한 번 터치하고 반응했지만, 해당 OB 영역이 완전히 무너지지 않아 여전히 미체결 주문이 남아있을 수 있는 구간입니다.\n\n첫 번째 터치에서 진입하지 못했을 때, 두 번째 되돌림에서 진입 기회로 활용됩니다. 다만 첫 터치보다 신뢰도가 떨어지므로 작은 포지션으로 접근하는 것이 좋습니다.",
        how_to_use: [
            "첫 OB 진입을 놓쳤을 때 두 번째 터치에서 더 작은 포지션으로 진입",
            "Mitigation 후에도 추세 방향이 유지되는지 확인",
            "두 번 이상 터치된 구간은 효력 상실로 판단"
        ],
        common_mistakes: [
            "무한정 같은 OB에서 반복 진입하는 것",
            "Mitigation Block과 Breaker Block을 혼동하는 것",
            "터치 횟수에 상관없이 계속 OB로 보는 것"
        ],
        related_terms: ["order-block", "breaker-block", "fair-value-gap"],
        examples: [
            "OB 영역 2,300~2,310에서 첫 반등 후, 재하락해 2,305에서 두 번째 반등 → Mitigation Block 활용.",
            "EUR/USD OB에서 20핍 반등 후 재진입 시 10핍만 반등 → 약해진 Mitigation 효과."
        ]
    },
    {
        id: "breaker-block",
        term_en: "Breaker Block",
        term_kr: "브레이커 블록",
        category: "SMC",
        one_liner: "기존 OB가 실패(돌파)한 후 역할이 반전되어 새로운 지지/저항이 되는 구간입니다.",
        definition: "Breaker Block은 원래 지지(또는 저항) 역할을 하던 OB가 돌파당한 후, 반대 역할로 전환된 구간입니다. 지지였던 OB가 무너지면 이제 저항으로 작용합니다.\n\n이는 '지지-저항 전환' 원리와 비슷하지만, SMC 관점에서는 해당 영역의 기관 주문이 청산되고 새로운 방향의 주문이 들어왔다고 해석합니다.",
        how_to_use: [
            "OB 실패 후 해당 영역으로 되돌림 시 반대 방향 진입",
            "Breaker Block과 FVG가 겹치면 강력한 반전 구간",
            "상위 타임프레임 Breaker가 더 신뢰도 높음"
        ],
        common_mistakes: [
            "OB가 무너졌는데 여전히 같은 방향 진입을 기대하는 것",
            "모든 실패한 OB를 Breaker로 보는 것 - 가격 행동 확인 필요",
            "Breaker 영역을 너무 넓게 잡는 것"
        ],
        related_terms: ["order-block", "mitigation-block", "support-resistance"],
        examples: [
            "상승 OB(51,000~51,500)가 뚫린 후, 되돌림에서 저항으로 작용 → Breaker Block에서 숏 진입.",
            "KOSPI 선물 지지 OB 붕괴 후, 해당 가격대가 저항으로 전환."
        ]
    },
    {
        id: "imbalance",
        term_en: "Imbalance",
        term_kr: "불균형",
        category: "SMC",
        one_liner: "매수/매도 주문의 급격한 불균형으로 생긴 가격 영역으로, FVG와 유사한 개념입니다.",
        definition: "Imbalance는 한쪽 방향의 주문이 압도적으로 많아 가격이 급격히 움직이며 생긴 '효율적 가격 발견이 안 된' 구간입니다. FVG와 거의 동일하게 사용되며, 시장은 이런 불균형을 메우려는 경향이 있습니다.\n\n트레이딩에서는 Imbalance 영역으로 되돌림을 기다렸다가 진입하는 전략이 일반적입니다.",
        how_to_use: [
            "Imbalance 영역 50% 되돌림에서 진입 타이밍 잡기",
            "여러 타임프레임의 Imbalance가 겹치는 구간 주목",
            "추세 방향의 Imbalance만 진입 구간으로 활용"
        ],
        common_mistakes: [
            "역추세 Imbalance에서 진입하는 것",
            "Imbalance가 100% 채워질 것이라 가정하는 것",
            "너무 작은 Imbalance에 집착하는 것"
        ],
        related_terms: ["fair-value-gap", "displacement", "order-block"],
        examples: [
            "급등 후 생긴 Imbalance(10,000~10,100) 구간으로 되돌림 → 10,050에서 매수.",
            "50% 지점까지만 채워지고 추세 재개되는 패턴 관찰."
        ]
    },
    {
        id: "displacement",
        term_en: "Displacement",
        term_kr: "변위",
        category: "SMC",
        one_liner: "기관의 공격적인 주문으로 발생하는 강하고 빠른 가격 움직임입니다.",
        definition: "Displacement는 연속된 강한 캔들(큰 몸통, 같은 방향)로 나타나는 급격한 가격 이동입니다. 이는 기관들이 적극적으로 시장에 개입하고 있다는 신호이며, FVG와 Imbalance를 동반합니다.\n\nDisplacement 방향이 곧 '스마트 머니'가 원하는 방향으로 해석되어, 되돌림 후 해당 방향으로 진입하는 전략에 활용됩니다.",
        how_to_use: [
            "Displacement 발생 후 되돌림 영역(OB, FVG)에서 같은 방향 진입",
            "Displacement 강도로 기관 개입 여부 판단 - 강할수록 신뢰도↑",
            "Displacement 없는 느린 움직임은 진입 근거로 약함"
        ],
        common_mistakes: [
            "약한 움직임을 Displacement로 오해하는 것",
            "Displacement 방향에 역행하여 진입하는 것",
            "뉴스 이벤트 Displacement와 구조적 Displacement를 구분하지 않는 것"
        ],
        related_terms: ["fair-value-gap", "imbalance", "order-block", "bos"],
        examples: [
            "3개 연속 대양봉이 나오며 저항 돌파 → 강한 Displacement, 되돌림 매수 대기.",
            "Displacement 후 생긴 FVG로 가격이 돌아와 50% 지점에서 반등."
        ]
    },
    {
        id: "premium-discount",
        term_en: "Premium/Discount",
        term_kr: "프리미엄/디스카운트",
        category: "SMC",
        one_liner: "가격 범위의 상단 50%는 고평가(프리미엄), 하단 50%는 저평가(디스카운트) 영역입니다.",
        definition: "Premium/Discount 개념은 특정 가격 범위(스윙 구간, 일일 범위 등)를 반으로 나눠, 매수는 디스카운트(하단 50%)에서, 매도는 프리미엄(상단 50%)에서 하는 것이 확률적으로 유리하다는 원리입니다.\n\n피보나치 50% 레벨이 경계선이 됩니다. 상승 추세에서는 가격이 디스카운트 영역으로 내려올 때 매수하고, 하락 추세에서는 프리미엄 영역까지 올라올 때 매도합니다.",
        how_to_use: [
            "롱 진입은 디스카운트 영역의 OB/FVG에서만",
            "숏 진입은 프리미엄 영역의 OB/FVG에서만",
            "Equilibrium(50%)을 넘어가면 방향에 역행하는 진입은 자제"
        ],
        common_mistakes: [
            "상승 추세에서 프리미엄 영역에서 추격 매수하는 것",
            "하락 추세에서 디스카운트 영역에서 추격 매도하는 것",
            "모든 구간에 Premium/Discount를 적용하는 것 - 추세 맥락 필요"
        ],
        related_terms: ["equilibrium", "fibonacci", "order-block", "fair-value-gap"],
        examples: [
            "일일 범위가 2,400~2,500이면, 2,450 아래가 디스카운트 → 매수 유리.",
            "단기 스윙 고점에서 저점까지 구간 설정 후, 50% 위 프리미엄에서 매도 진입."
        ]
    },
    {
        id: "liquidity-sweep",
        term_en: "Liquidity Sweep",
        term_kr: "유동성 스윕",
        category: "SMC",
        one_liner: "스탑로스가 밀집된 가격대를 순간적으로 돌파한 뒤 반전하는 현상입니다.",
        definition: "Liquidity Sweep은 가격이 유동성(스탑로스)이 모여있는 영역을 잠깐 뚫고 들어갔다가 빠르게 반전하는 움직임입니다.\n\n이는 기관들이 대량 주문을 체결하기 위해 개인 트레이더들의 스탑을 일부러 터트리는 것으로 해석됩니다. 스윕 후 나타나는 반전 캔들과 함께 진입 기회로 활용합니다.",
        how_to_use: [
            "스윙 고점/저점 너머로 순간 돌파 후 빠른 반전 캔들 확인 시 반대 방향 진입",
            "스윕 + OB/FVG 진입 조합으로 확률 높은 셋업 구성",
            "스윕 발생 시 즉시 진입하지 말고 반전 캔들 완성 기다리기"
        ],
        common_mistakes: [
            "모든 돌파를 스윕으로 착각하는 것 - 진짜 돌파일 수도 있음",
            "반전 캔들 없이 바로 진입하는 것",
            "스윕 예상 지점에 스탑을 두는 것"
        ],
        related_terms: ["liquidity", "stop-hunt", "equal-high-low", "inducement"],
        examples: [
            "직전 고점 2,520을 순간 돌파해 2,525까지 갔다가 음봉으로 2,510까지 하락 → 스윕 완성.",
            "트리플 탑 형성 후 살짝 위로 돌파했다가 급락하는 전형적인 스윕 패턴."
        ]
    },
    {
        id: "stop-hunt",
        term_en: "Stop Hunt",
        term_kr: "스탑 헌팅",
        category: "SMC",
        one_liner: "기관이 개인 트레이더의 스탑로스를 터트려 유동성을 확보하는 현상입니다.",
        definition: "Stop Hunt는 대형 플레이어들이 소매 트레이더들의 스탑로스가 밀집된 곳으로 의도적으로 가격을 움직여 스탑을 터트리고, 그 유동성으로 자신의 대량 주문을 체결하는 것을 말합니다.\n\n기술적 분석에서 뻔한 곳(스윙 고점/저점, 라운드 넘버, 추세선)에 스탑이 모이기 때문에 이런 현상이 자주 발생합니다.",
        how_to_use: [
            "뻔한 스탑 위치를 피해 스탑 설정 - OB/FVG 아래에 여유 있게",
            "스탑 헌팅 후 반전을 노리는 진입 전략 활용",
            "스탑 헌팅이 자주 일어나는 시간대(런던/뉴욕 세션 초반) 주의"
        ],
        common_mistakes: [
            "스탑을 너무 타이트하게 설정하여 쉽게 헌팅당하는 것",
            "스탑 헌팅을 진짜 돌파로 오해하고 추격하는 것",
            "스탑 헌팅 예상만으로 스탑을 아예 안 두는 것"
        ],
        related_terms: ["liquidity-sweep", "liquidity", "equal-high-low"],
        examples: [
            "중요 지지선 2,400 아래 2,395까지 순간 하락 후 V자 반등 → 스탑 헌팅.",
            "런던 세션 오픈 직후 아시아 세션 저점 아래로 스탑 헌팅 빈번."
        ]
    },
    {
        id: "equal-high-low",
        term_en: "Equal High/Low",
        term_kr: "동일 고점/저점",
        abbreviation: "EQH/EQL",
        category: "SMC",
        one_liner: "같은 가격에서 여러 번 고점/저점을 형성한 구간으로, 유동성이 밀집됩니다.",
        definition: "Equal Highs(EQH)는 같은 가격대에서 두 번 이상 고점이 형성된 것이고, Equal Lows(EQL)는 같은 가격대에서 저점이 형성된 것입니다.\n\n이런 가격대는 스탑로스가 집중되어 있어 유동성이 풍부하며, 기관의 타겟이 되기 쉽습니다. 종종 스윕 후 반전이 일어납니다.",
        how_to_use: [
            "EQH/EQL 형성 시 해당 가격대 위/아래로 스탑 헌팅 예상",
            "EQH/EQL 스윕 후 반전 캔들과 함께 진입 기회 포착",
            "자신의 스탑을 EQH/EQL 바로 위/아래에 두지 않기"
        ],
        common_mistakes: [
            "EQH/EQL 돌파를 진짜 추세 돌파로 오해하는 것",
            "모든 더블탑/바텀을 EQH/EQL로 보는 것 - 정확한 가격대 필요",
            "EQH/EQL만 보고 다른 맥락 무시"
        ],
        related_terms: ["liquidity", "liquidity-sweep", "stop-hunt"],
        examples: [
            "2,500에서 세 번 고점 형성 → EQH, 위로 스윕되면 매도 기회.",
            "48,000에서 더블바텀 → EQL 아래로 스탑 헌팅 후 강한 반등."
        ]
    },
    {
        id: "inducement",
        term_en: "Inducement",
        term_kr: "유인",
        category: "SMC",
        one_liner: "트레이더들을 잘못된 방향으로 유인하여 스탑을 걸게 만드는 함정 구간입니다.",
        definition: "Inducement는 가격이 일시적으로 특정 방향으로 움직여 트레이더들이 진입하거나 스탑을 설정하게 유도한 뒤, 반대 방향으로 움직이는 현상입니다.\n\n이는 더 높은 타임프레임의 유동성을 만들기 위한 '미끼'로 해석됩니다. 하위 타임프레임의 BOS나 CHOCH가 Inducement일 수 있습니다.",
        how_to_use: [
            "하위 타임프레임 신호만 보고 섣불리 진입하지 않기",
            "상위 타임프레임의 유동성 위치와 맥락 확인",
            "Inducement 후 진짜 BOS가 나올 때까지 대기"
        ],
        common_mistakes: [
            "모든 되돌림을 Inducement로 보는 것",
            "Inducement 자체에서 진입하려는 것",
            "상위 타임프레임 맥락 없이 하위에서만 판단"
        ],
        related_terms: ["liquidity", "bos", "choch", "stop-hunt"],
        examples: [
            "15분봉에서 BOS 발생했지만 1시간 OB 위에 유동성 남아있음 → Inducement 가능성.",
            "작은 되돌림 고점이 스탑 사냥당한 후 진짜 하락 시작."
        ]
    },
    // ===================== ORB =====================
    {
        id: "opening-range",
        term_en: "Opening Range",
        term_kr: "시가 범위",
        abbreviation: "OR",
        category: "ORB",
        one_liner: "장 시작 후 일정 시간 동안 형성된 가격 범위로, 돌파 전략의 기준이 됩니다.",
        definition: "Opening Range는 시장 개장 후 정해진 시간(보통 15분, 30분, 또는 1시간) 동안 형성된 고점과 저점 사이의 가격 범위입니다.\n\n이 범위는 당일 거래의 중요한 기준점이 됩니다. 많은 기관들이 시장 개방 초기에 의견을 표출하기 때문에, 이 범위를 돌파하는 방향이 당일의 추세가 될 가능성이 높습니다.",
        how_to_use: [
            "개장 후 15~30분의 고점/저점을 차트에 표시",
            "이 범위를 위로 돌파하면 롱, 아래로 돌파하면 숏 고려",
            "범위가 좁을수록 돌파 시 변동성이 클 수 있음"
        ],
        common_mistakes: [
            "범위 내에서 미리 방향을 예측하고 진입하는 것",
            "시간대를 일관되게 적용하지 않는 것",
            "뉴스 이벤트가 있는 날 평소 OR 전략을 그대로 적용"
        ],
        related_terms: ["orb-setup", "orb-breakout", "time-window", "volatility"],
        examples: [
            "KOSPI 200 선물 09:00~09:30 구간의 고점 339.50, 저점 338.20 형성 → OR.",
            "나스닥 선물 09:30~10:00(현지시간) OR 설정 후 돌파 대기."
        ]
    },
    {
        id: "orb-setup",
        term_en: "ORB Setup",
        term_kr: "ORB 셋업",
        category: "ORB",
        one_liner: "Opening Range 돌파를 기반으로 한 구체적인 진입 조건과 규칙입니다.",
        definition: "ORB Setup은 Opening Range가 형성된 후, 어떤 조건에서 진입하고, 스탑과 목표가를 어디에 설정할지 정의한 구체적인 거래 계획입니다.\n\n일반적인 셋업은 OR 고점 돌파 시 롱, 저점 이탈 시 숏이지만, 추가 필터(거래량, 변동성, 이전 날 패턴)를 적용하여 확률을 높입니다.",
        how_to_use: [
            "OR 형성 후 돌파 방향 확인 → 진입, 반대편 끝을 스탑으로 설정",
            "ATR이나 OR 크기의 1~2배를 목표가로 설정",
            "첫 돌파 실패 시(페이크아웃) 반대 방향 셋업 검토"
        ],
        common_mistakes: [
            "OR 크기가 너무 클 때도 무조건 진입하는 것",
            "돌파 직후 바로 진입 - 되돌림(리테스트) 대기가 안전",
            "경제지표 발표 직전/직후 ORB 진입"
        ],
        related_terms: ["opening-range", "orb-breakout", "orb-fakeout", "risk-reward"],
        examples: [
            "09:30 OR 고점 340.00 돌파 시 롱 진입, 스탑 338.50(OR 저점), 목표 341.50.",
            "OR 폭이 50포인트라 당일은 ORB 대신 관망 선택."
        ]
    },
    {
        id: "orb-breakout",
        term_en: "ORB Breakout",
        term_kr: "ORB 돌파",
        category: "ORB",
        one_liner: "Opening Range의 고점 또는 저점을 확실히 이탈하는 가격 움직임입니다.",
        definition: "ORB Breakout은 가격이 Opening Range의 상단(고점)을 위로 돌파하거나, 하단(저점)을 아래로 이탈하는 것을 말합니다.\n\n이 돌파가 당일의 주요 방향을 결정할 수 있으며, 돌파 후 추세가 이어지면 수익을, 실패하면(페이크아웃) 반대 방향 셋업이 됩니다.",
        how_to_use: [
            "강한 캔들(큰 몸통)로 돌파 확인 시 진입 신뢰도 상승",
            "돌파 후 리테스트(OR 레벨로 되돌림)를 기다려 진입하면 더 좋은 R:R",
            "거래량 동반 돌파가 더 신뢰도 높음"
        ],
        common_mistakes: [
            "위크만 살짝 넘은 것을 돌파로 오판",
            "돌파 직후 FOMO로 추격 진입",
            "거래량 없는 돌파에 올인"
        ],
        related_terms: ["opening-range", "orb-fakeout", "orb-retest", "confirmation"],
        examples: [
            "OR 고점 1,850을 1,855까지 강한 양봉으로 돌파 → 롱 진입 신호.",
            "돌파 후 1,850으로 되돌림(리테스트), 지지 확인 후 재진입."
        ]
    },
    {
        id: "orb-fakeout",
        term_en: "ORB Fakeout",
        term_kr: "ORB 페이크아웃",
        category: "ORB",
        one_liner: "OR 돌파처럼 보였지만 실패하고 반대 방향으로 움직이는 속임수 패턴입니다.",
        definition: "ORB Fakeout은 가격이 Opening Range를 한쪽으로 돌파하는 듯했지만, 다시 범위 안으로 돌아오거나 반대 방향으로 강하게 움직이는 것입니다.\n\n이는 위에서 언급한 유동성 스윕과 비슷한 원리로, 돌파에 진입한 트레이더들의 스탑을 터트립니다. 페이크아웃을 인식하면 반대 방향 트레이드 기회가 됩니다.",
        how_to_use: [
            "첫 돌파 실패 시 반대 방향으로 진입 고려 - '페이크아웃 플레이'",
            "돌파 후 2~3개 캔들 내에 OR 안으로 복귀하면 페이크아웃 의심",
            "거래량 없는 돌파는 페이크아웃 가능성 높음"
        ],
        common_mistakes: [
            "모든 실패한 돌파를 페이크아웃으로 보는 것 - 재돌파 가능",
            "페이크아웃 확정 전에 반대 방향 뇌동매매",
            "페이크아웃 발생 후 같은 방향 다시 진입"
        ],
        related_terms: ["orb-breakout", "opening-range", "liquidity-sweep", "stop-hunt"],
        examples: [
            "OR 저점 2,380 이탈 후 2,375까지 내려갔다가 2,390으로 복귀 → 페이크아웃, 롱 기회.",
            "첫 30분 상방 돌파 시도 실패 후 하방으로 진짜 움직임 발생."
        ]
    },
    {
        id: "orb-retest",
        term_en: "ORB Retest",
        term_kr: "ORB 리테스트",
        category: "ORB",
        one_liner: "돌파 후 OR 레벨로 다시 되돌아와 지지/저항 역할을 확인하는 움직임입니다.",
        definition: "ORB Retest는 OR 고점 또는 저점을 돌파한 후, 가격이 해당 레벨로 되돌아와 테스트하는 것입니다. 돌파가 진짜라면 이전 저항이 지지로, 또는 이전 지지가 저항으로 작용해야 합니다.\n\n리테스트에서 진입하면 돌파 직후 진입보다 더 좋은 가격에 들어갈 수 있고, 손절까지 거리도 짧아 R:R이 좋아집니다.",
        how_to_use: [
            "돌파 후 바로 진입하지 말고 OR 레벨로 리테스트 기다리기",
            "리테스트에서 지지/저항 역할 확인(반전 캔들) 후 진입",
            "리테스트가 없이 계속 가면 추격 대신 다음 기회 대기"
        ],
        common_mistakes: [
            "리테스트 전에 미리 진입 주문 넣는 것",
            "리테스트를 실패(OR 안으로 복귀)와 구분하지 못하는 것",
            "모든 돌파에서 리테스트가 올 것이라 가정"
        ],
        related_terms: ["orb-breakout", "opening-range", "confirmation", "support-resistance"],
        examples: [
            "OR 고점 15,200 돌파 후 15,200까지 되돌림, 지지 확인 후 롱 진입.",
            "리테스트에서 OR 고점 아래로 다시 들어가면 페이크아웃으로 판정."
        ]
    },
    {
        id: "time-window",
        term_en: "Time Window",
        term_kr: "시간창",
        category: "ORB",
        one_liner: "OR을 형성하거나 돌파를 기다리는 특정 시간 구간입니다.",
        definition: "Time Window는 ORB 전략에서 Opening Range를 어느 시간까지 기다릴지, 또는 돌파 트레이드를 언제까지 할지 정의하는 시간 범위입니다.\n\n예를 들어, 09:00~09:30을 OR 형성 구간으로, 09:30~11:00을 돌파 트레이드 구간으로, 오후에는 거래하지 않는 식의 규칙을 세웁니다.",
        how_to_use: [
            "자신의 시장에 맞는 OR 시간 설정 - KOSPI는 09:00~09:30, 미국 선물은 현지 09:30~10:00 등",
            "점심시간이나 변동성 낮은 시간대는 거래 자제",
            "세션 전환기(런던/뉴욕 오픈)에 새로운 움직임 가능성 인지"
        ],
        common_mistakes: [
            "시간 규칙 없이 하루 종일 ORB 시도",
            "다른 시장의 시간대를 그대로 적용",
            "중요 경제지표 발표 시간을 무시"
        ],
        related_terms: ["opening-range", "session", "volatility"],
        examples: [
            "KOSPI: 09:00~09:30 OR 형성, 09:30~11:30 돌파 트레이드, 점심 피함, 14:00~15:00 막판 모멘텀.",
            "ES 선물: 09:30~10:00 OR 형성, 오후 3시 이후 거래 종료."
        ]
    },
    // ===================== 리스크 관리 =====================
    {
        id: "risk-reward",
        term_en: "Risk-Reward Ratio",
        term_kr: "리스크 리워드 비율",
        abbreviation: "R:R",
        category: "리스크 관리",
        one_liner: "잠재 손실(리스크) 대비 잠재 이익(리워드)의 비율입니다.",
        definition: "R:R은 거래에서 손절까지의 거리(리스크)와 목표가까지의 거리(리워드)를 비교한 비율입니다. 예를 들어, 10포인트 손절, 30포인트 목표면 R:R은 3:1입니다.\n\n높은 R:R 거래는 승률이 낮아도 장기적으로 수익을 낼 수 있게 해줍니다. 최소 2:1 이상의 R:R을 권장하는 경우가 많습니다.",
        how_to_use: [
            "진입 전 반드시 스탑과 목표를 정하고 R:R 계산",
            "R:R이 최소 2:1 이상인 셋업만 거래",
            "R:R과 승률을 함께 고려하여 기대값 계산"
        ],
        common_mistakes: [
            "R:R 무시하고 '감'으로 익절/손절",
            "비현실적인 목표로 높은 R:R 가장하기",
            "R:R만 좋으면 아무 자리서나 진입"
        ],
        related_terms: ["position-sizing", "stop-loss", "take-profit", "risk-per-trade"],
        examples: [
            "진입 100, 스탑 95, 목표 115 → R:R = 15/5 = 3:1.",
            "승률 40%라도 R:R 3:1이면 장기적으로 수익."
        ]
    },
    {
        id: "position-sizing",
        term_en: "Position Sizing",
        term_kr: "포지션 사이징",
        category: "리스크 관리",
        one_liner: "한 거래에 투입할 금액/수량을 계좌 크기와 리스크에 맞게 결정하는 것입니다.",
        definition: "포지션 사이징은 '얼마나 살/팔 것인가'를 결정하는 과정입니다. 보통 1~2% 리스크 원칙을 따라, 한 번 거래에서 잃어도 되는 금액을 정하고, 손절까지 거리에 맞춰 수량을 계산합니다.\n\n예: 계좌 1,000만원, 리스크 2% → 최대 손실 20만원 → 스탑까지 100원이면 2,000주 매수.",
        how_to_use: [
            "계좌의 1~2%만 한 거래에 리스크",
            "스탑까지 거리가 멀면 포지션 크기 줄이기",
            "연패 시 포지션을 더 줄여 드로우다운 관리"
        ],
        common_mistakes: [
            "매번 같은 수량/금액으로 거래 - 리스크가 일정하지 않음",
            "높은 확신에 과도한 레버리지/사이즈",
            "손익 상황에 따라 감정적으로 사이즈 변경"
        ],
        related_terms: ["risk-reward", "risk-per-trade", "max-drawdown", "stop-loss"],
        examples: [
            "계좌 500만원, 1% 리스크 → 거래당 최대 손실 5만원.",
            "스탑까지 50원 → 5만원 / 50원 = 1,000주."
        ]
    },
    {
        id: "stop-loss",
        term_en: "Stop Loss",
        term_kr: "손절",
        abbreviation: "SL",
        category: "리스크 관리",
        one_liner: "손실을 제한하기 위해 미리 정해둔 청산 가격입니다.",
        definition: "손절(Stop Loss)은 거래가 예상과 반대로 움직일 때 손실을 제한하기 위해 미리 설정해두는 주문입니다. 가격이 이 레벨에 도달하면 자동으로 포지션이 청산됩니다.\n\n손절은 '틀렸을 때 얼마나 잃을 것인가'를 정의하며, 리스크 관리의 핵심입니다. 손절 없이 거래하면 한 번의 큰 손실로 계좌가 날아갈 수 있습니다.",
        how_to_use: [
            "진입 전 반드시 손절 가격 결정",
            "OB/FVG 아래(롱) 또는 위(숏)에 여유 있게 설정",
            "손절이 너무 멀면 포지션 사이즈를 줄이기"
        ],
        common_mistakes: [
            "손절 없이 거래하거나, 손절에 도달해도 임의로 움직이는 것",
            "유동성이 많은 뻔한 곳에 스탑 두기",
            "손절이 너무 타이트해서 노이즈에 걸리는 것"
        ],
        related_terms: ["take-profit", "break-even", "trailing-stop", "risk-reward"],
        examples: [
            "롱 진입 2,400, OB 하단 2,390 → 스탑 2,385 (OB 아래 5포인트 여유).",
            "ATR의 1.5배를 스탑 거리로 사용하는 방법도 있음."
        ]
    },
    {
        id: "take-profit",
        term_en: "Take Profit",
        term_kr: "익절",
        abbreviation: "TP",
        category: "리스크 관리",
        one_liner: "이익을 실현하기 위해 미리 정해둔 목표 가격입니다.",
        definition: "익절(Take Profit)은 거래가 예상대로 움직일 때 이익을 확정하기 위해 설정하는 목표 가격입니다. 이 가격에 도달하면 자동으로 수익이 실현됩니다.\n\n익절 목표는 보통 다음 저항/지지 레벨, FVG, 피보나치 확장, 또는 R:R 기반으로 설정합니다.",
        how_to_use: [
            "진입 전 목표가를 R:R 기준으로 미리 설정",
            "분할 익절 - 목표 1에서 절반, 목표 2에서 나머지",
            "주요 저항/지지 레벨 직전에 익절 목표 설정"
        ],
        common_mistakes: [
            "익절 목표 없이 '더 가겠지' 기대",
            "목표 도달 전에 너무 일찍 청산",
            "욕심에 목표를 비현실적으로 멀리 설정"
        ],
        related_terms: ["stop-loss", "partial-take-profit", "risk-reward", "trailing-stop"],
        examples: [
            "진입 100, 스탑 95, TP1 110(2:1), TP2 115(3:1).",
            "다음 OB/FVG 직전에 익절 목표 설정."
        ]
    },
    {
        id: "break-even",
        term_en: "Break-Even",
        term_kr: "본전",
        abbreviation: "BE",
        category: "리스크 관리",
        one_liner: "스탑을 진입가로 옮겨 최소한 손실 없이 거래를 종료하는 것입니다.",
        definition: "Break-Even은 거래가 어느 정도 수익 방향으로 움직인 후, 스탑을 진입가(또는 진입가 + 수수료)로 옮기는 것을 말합니다. 이렇게 하면 이후 가격이 반대로 가도 손실 없이(또는 최소 손실로) 거래를 종료할 수 있습니다.\n\n이는 '이미 수익 중인 거래를 손실로 끝내지 않는다'는 심리적 안정감과 추가 상승 여력을 기대할 수 있게 해줍니다.",
        how_to_use: [
            "R:R 1:1 달성 시 스탑을 BE로 이동 고려",
            "첫 번째 목표 달성 후 잔여 물량은 BE 스탑",
            "BE 이동 시점을 미리 규칙으로 정해두기"
        ],
        common_mistakes: [
            "너무 빨리 BE 이동 → 정상적인 되돌림에 청산됨",
            "BE 이동 후 더 이상 관리하지 않는 것",
            "모든 거래에 BE 적용 - 전략에 따라 다름"
        ],
        related_terms: ["stop-loss", "trailing-stop", "partial-take-profit"],
        examples: [
            "진입 2,400, 스탑 2,390, 가격이 2,420 도달 → 스탑을 2,400(BE)으로 이동.",
            "TP1 달성 후 절반 청산, 나머지 BE 스탑 적용."
        ]
    },
    {
        id: "trailing-stop",
        term_en: "Trailing Stop",
        term_kr: "추적 손절",
        category: "리스크 관리",
        one_liner: "가격이 유리한 방향으로 움직일 때 스탑도 따라 움직여 수익을 보호합니다.",
        definition: "Trailing Stop은 가격이 수익 방향으로 움직일 때 스탑도 함께 조정하여, 되돌림이 와도 이미 확보한 수익의 일부를 지키는 방법입니다.\n\n예를 들어, 롱 포지션에서 최고가에서 20포인트 아래에 항상 스탑을 유지하면, 가격이 오르면 스탑도 올라갑니다. 수동으로 조정하거나 자동 트레일링 주문을 사용합니다.",
        how_to_use: [
            "상위 스윙 저점/고점 아래/위로 스탑을 계속 조정",
            "ATR 기반 트레일링 - 최고가에서 ATR의 1~2배 아래",
            "추세가 강할 때 트레일링, 횡보 시 고정 TP가 나을 수 있음"
        ],
        common_mistakes: [
            "너무 타이트한 트레일링으로 정상적인 되돌림에 청산",
            "스탑을 뒤로(불리하게) 옮기는 것 - 트레일링의 목적에 반함",
            "모든 거래에 트레일링 적용 - 급등/급락 시에는 고정 TP가 나을 수 있음"
        ],
        related_terms: ["stop-loss", "break-even", "take-profit", "atr"],
        examples: [
            "롱 진입 후 최고가에서 50포인트 아래에 트레일링 스탑 유지.",
            "각 새로운 스윙 저점 아래로 스탑 조정."
        ]
    },
    {
        id: "partial-take-profit",
        term_en: "Partial Take Profit",
        term_kr: "분할 익절",
        category: "리스크 관리",
        one_liner: "여러 목표에서 포지션을 나눠 청산하여 확정 수익과 추가 이익 기회를 모두 잡습니다.",
        definition: "분할 익절은 전체 포지션을 한 번에 청산하지 않고, 첫 번째 목표에서 일부(예: 50%)를 익절하고 나머지는 더 먼 목표를 노리는 방법입니다.\n\n이렇게 하면 '확정 수익'을 먼저 챙기면서도, 추세가 계속될 경우 추가 이익을 얻을 수 있습니다. 남은 포지션은 보통 BE 스탑으로 보호합니다.",
        how_to_use: [
            "TP1에서 50%, TP2에서 30%, 나머지 트레일링",
            "분할 비율과 목표를 미리 규칙으로 정해두기",
            "첫 분할 후 남은 물량은 BE 또는 트레일링 스탑"
        ],
        common_mistakes: [
            "첫 분할 후 남은 물량에 스탑 설정 안 함",
            "분할 비율이 너무 적어 의미 없는 수익 확정",
            "분할 익절 후 추가 진입으로 포지션 다시 키우기"
        ],
        related_terms: ["take-profit", "break-even", "trailing-stop", "position-sizing"],
        examples: [
            "1,000주 롱: TP1에서 500주 청산, 나머지 500주 TP2 또는 트레일링.",
            "R:R 2:1에서 절반 익절, 남은 물량 BE 스탑 후 더 큰 목표 추구."
        ]
    },
    {
        id: "risk-per-trade",
        term_en: "Risk per Trade",
        term_kr: "단일 거래 리스크",
        category: "리스크 관리",
        one_liner: "한 번의 거래에서 감수할 수 있는 최대 손실 금액(보통 계좌의 1~2%)입니다.",
        definition: "Risk per Trade는 한 번 거래에서 잃어도 괜찮은(또는 잃을 의향이 있는) 최대 금액입니다. 일반적으로 계좌 잔고의 1~2%로 설정하여, 연속 손실이 와도 계좌가 크게 훼손되지 않게 합니다.\n\n예: 계좌 1,000만원, 1% 리스크 → 거래당 최대 손실 10만원.",
        how_to_use: [
            "모든 거래에서 일관된 퍼센티지 리스크 적용",
            "연패 시 리스크 퍼센티지를 낮춰 드로우다운 제한",
            "리스크 금액과 스탑 거리로 포지션 사이즈 계산"
        ],
        common_mistakes: [
            "'이번은 확실해'라며 리스크를 5~10%로 늘리는 것",
            "거래마다 리스크 금액이 들쭉날쭉한 것",
            "리스크 없는 '꽁짜 돈'이라며 큰 금액 배팅"
        ],
        related_terms: ["position-sizing", "max-drawdown", "stop-loss", "risk-reward"],
        examples: [
            "계좌 2,000만원, 2% 리스크 → 거래당 최대 손실 40만원.",
            "3연패 후 1%로 줄여 심리적 회복 기간 확보."
        ]
    },
    {
        id: "max-drawdown",
        term_en: "Max Drawdown",
        term_kr: "최대 낙폭",
        abbreviation: "MDD",
        category: "리스크 관리",
        one_liner: "계좌 고점에서 저점까지의 최대 손실 폭을 뜻합니다.",
        definition: "Max Drawdown(MDD)은 계좌가 최고점을 찍은 후 최저점까지 떨어진 비율(또는 금액)을 말합니다. 예를 들어, 1,000만원에서 1,200만원까지 올랐다가 900만원까지 떨어지면 MDD는 300만원(25%)입니다.\n\nMDD는 전략의 리스크를 평가하는 중요한 지표입니다. 심리적으로 감당할 수 있는 MDD를 미리 정해두고, 초과 시 거래를 중단하거나 전략을 재검토해야 합니다.",
        how_to_use: [
            "미리 감당 가능한 MDD 상한선 설정 (예: 20%)",
            "MDD 도달 시 거래 중단 및 전략 점검",
            "백테스트 시 MDD 확인하여 전략의 최악 상황 파악"
        ],
        common_mistakes: [
            "MDD 개념 없이 무한정 손실 누적",
            "MDD 도달 후 '본전 만들자'며 더 큰 리스크",
            "MDD만 보고 수익률/샤프 비율은 무시"
        ],
        related_terms: ["risk-per-trade", "position-sizing", "overtrading"],
        examples: [
            "전략 백테스트 결과 MDD 15%로, 감당 가능 수준이면 실전 적용.",
            "계좌 1,500만원 → 1,200만원 = 20% MDD, 거래 일시 중단."
        ]
    },
    {
        id: "overtrading",
        term_en: "Overtrading",
        term_kr: "과매매",
        category: "리스크 관리",
        one_liner: "규칙 없이 너무 자주 거래하여 수수료와 손실을 키우는 행위입니다.",
        definition: "과매매(Overtrading)는 명확한 셋업이나 규칙 없이 지나치게 많은 거래를 하는 것입니다. 지루함, 손실 만회 욕구, FOMO 등에서 비롯되며, 수수료 증가와 낮은 품질의 거래로 인해 계좌에 해롭습니다.\n\n하루 거래 횟수나 손실 한도를 정해두고, 자신의 규칙에 맞는 셋업이 없으면 거래하지 않는 것이 중요합니다.",
        how_to_use: [
            "하루 최대 거래 횟수 또는 손실 한도 설정",
            "셋업이 없으면 관망 - '거래하지 않는 것도 거래'",
            "거래 일지 작성으로 과매매 패턴 인식"
        ],
        common_mistakes: [
            "'손실 만회해야지'라며 계속 진입 반복",
            "세션 내내 화면 보며 모든 움직임에 반응",
            "중간 휴식 없이 8시간 이상 연속 트레이딩"
        ],
        related_terms: ["revenge-trade", "risk-per-trade", "max-drawdown"],
        examples: [
            "하루 3회 거래 제한 설정 후 초과 시 강제 종료.",
            "연속 3패 후 당일 거래 중단 규칙 적용."
        ]
    },
    {
        id: "revenge-trade",
        term_en: "Revenge Trade",
        term_kr: "복수 매매",
        category: "리스크 관리",
        one_liner: "손실 후 감정적으로 본전을 만들려 하는 충동적인 거래입니다.",
        definition: "복수 매매(Revenge Trading)는 손실을 입은 후 '빨리 만회하겠다'는 감정에서 규칙을 어기고 즉시 다시 진입하는 것입니다. 보통 더 큰 포지션이나 낮은 품질의 셋업으로 이어지며, 추가 손실의 원인이 됩니다.\n\n손실 후에는 감정을 식히고 다시 차분하게 분석한 후 거래해야 합니다.",
        how_to_use: [
            "손실 거래 후 최소 15~30분 휴식 규칙",
            "연속 2~3패 시 당일 거래 종료",
            "거래 일지에 감정 상태 기록"
        ],
        common_mistakes: [
            "'이번엔 맞을 거야'라며 리스크 2배로 진입",
            "손절당한 방향 그대로 재진입",
            "분석 없이 '느낌'으로 바로 다음 거래"
        ],
        related_terms: ["overtrading", "risk-per-trade", "max-drawdown"],
        examples: [
            "롱 손절 후 바로 같은 자리 롱 재진입 → 전형적인 복수 매매.",
            "손실 후 30분 산책 후 복귀, 새로운 셋업 대기."
        ]
    },
    // ===================== 시장 구조 =====================
    { id: "market-structure", term_en: "Market Structure", term_kr: "시장 구조", category: "시장 구조", one_liner: "고점과 저점의 연속적인 패턴으로 추세를 정의합니다.", definition: "시장 구조는 스윙 고점과 저점이 어떻게 형성되는지를 분석하여 현재 추세를 파악하는 방법입니다. Higher High/Higher Low는 상승 추세, Lower High/Lower Low는 하락 추세를 나타냅니다.", how_to_use: ["차트에 스윙 고점/저점 표시하기", "HH/HL 패턴이면 롱만, LH/LL 패턴이면 숏만 거래", "구조 변화(CHOCH) 감지 시 방향 재평가"], common_mistakes: ["타임프레임별 구조를 혼동", "노이즈를 구조로 오판", "구조 무시하고 역추세 거래"], related_terms: ["bos", "choch", "swing-high-low", "trend"], examples: ["연속 HH/HL 형성 → 상승 추세 확인, 되돌림 매수만 고려."] },
    { id: "swing-high-low", term_en: "Swing High/Low", term_kr: "스윙 고점/저점", category: "시장 구조", one_liner: "양쪽에 더 낮은/높은 캔들이 있는 국소적 고점/저점입니다.", definition: "스윙 고점은 양옆에 더 낮은 고점을 가진 캔들이고, 스윙 저점은 양옆에 더 높은 저점을 가진 캔들입니다. 시장 구조 분석의 기본 단위입니다.", how_to_use: ["차트에 스윙 포인트 표시", "BOS/CHOCH 판단의 기준점으로 활용", "유동성이 모이는 위치로 인식"], common_mistakes: ["모든 로컬 고점/저점을 스윙으로 표시", "타임프레임에 맞지 않는 스윙 식별", "스윙 완성 전에 미리 표시"], related_terms: ["market-structure", "bos", "choch"], examples: ["5개 캔들 중 가장 높은 고점을 스윙 고점으로 표시."] },
    { id: "trend", term_en: "Trend", term_kr: "추세", category: "시장 구조", one_liner: "가격이 일정 방향으로 지속적으로 움직이는 경향입니다.", definition: "추세는 상승(HH/HL), 하락(LH/LL), 또는 횡보(범위 내 움직임)로 구분됩니다. 추세를 따라 거래하는 것이 확률적으로 유리합니다.", how_to_use: ["상위 타임프레임 추세 방향으로만 거래", "추세 반대 진입은 피하거나 작은 포지션", "추세 전환 신호(CHOCH) 전까지 추세 유지 가정"], common_mistakes: ["역추세 거래 선호", "작은 되돌림을 추세 전환으로 오해", "추세 없는 횡보장에서 추세 거래 시도"], related_terms: ["market-structure", "bos", "choch"], examples: ["일봉 상승 추세에서 15분봉 되돌림 매수 전략."] },
    { id: "internal-structure", term_en: "Internal Structure", term_kr: "내부 구조", category: "시장 구조", one_liner: "더 큰 스윙 안에서 형성되는 작은 스윙 구조입니다.", definition: "Internal Structure는 상위 타임프레임의 한 레그(파동) 안에서 하위 타임프레임에 보이는 더 작은 고점/저점 패턴입니다. 정밀 진입 타이밍을 잡는 데 활용됩니다.", how_to_use: ["상위 OB/FVG 도달 후 하위에서 내부 CHOCH 확인 후 진입", "내부 구조로 리스크 줄이기", "상위 방향과 일치하는 내부 BOS 활용"], common_mistakes: ["내부 구조만 보고 상위 맥락 무시", "모든 타임프레임에서 같은 가중치 부여", "내부 노이즈에 휘둘림"], related_terms: ["market-structure", "bos", "choch"], examples: ["1시간 OB 도달 후 5분봉 CHOCH로 정밀 롱 진입."] },
    { id: "range", term_en: "Range", term_kr: "범위/박스권", category: "시장 구조", one_liner: "가격이 일정 구간 내에서 횡보하는 상태입니다.", definition: "Range는 뚜렷한 추세 없이 가격이 상단과 하단 사이를 오가는 구간입니다. 레인지 상단/하단에서 반전 거래를 하거나, 돌파를 기다립니다.", how_to_use: ["레인지 상단에서 숏, 하단에서 롱 (평균 회귀)", "돌파 시 돌파 방향으로 추세 거래 전환", "레인지 중앙에서는 거래 자제"], common_mistakes: ["레인지 안에서 추세 거래 시도", "돌파 전에 미리 방향 예측", "좁은 레인지에서 과도한 거래"], related_terms: ["consolidation", "support-resistance", "breakout"], examples: ["2,400~2,450 레인지에서 하단 매수, 상단 매도 반복."] },
    { id: "consolidation", term_en: "Consolidation", term_kr: "횡보/조정", category: "시장 구조", one_liner: "강한 움직임 후 가격이 쉬어가며 좁은 범위에서 움직이는 구간입니다.", definition: "Consolidation은 추세 중 잠시 멈추거나 에너지를 모으는 구간입니다. 보통 삼각형, 깃발, 쐐기 등의 패턴으로 나타나며, 돌파 후 추세가 재개됩니다.", how_to_use: ["조정 후 추세 방향 돌파 대기", "조정 중 포지션 추가보다 관망", "조정 패턴의 돌파 방향 확인 후 진입"], common_mistakes: ["조정 중에 계속 진입 시도", "조정을 추세 전환으로 오해", "조정 폭이 너무 클 때 무시"], related_terms: ["range", "expansion", "retracement"], examples: ["상승 후 깃발 패턴 조정 → 상방 돌파 시 추가 상승."] },
    { id: "expansion", term_en: "Expansion", term_kr: "확장", category: "시장 구조", one_liner: "조정/횡보 후 가격이 한 방향으로 강하게 움직이는 구간입니다.", definition: "Expansion은 Consolidation의 반대로, 가격이 적극적으로 움직이며 새로운 고점/저점을 만드는 구간입니다. 이 구간에서는 추세 추종 거래가 유리합니다.", how_to_use: ["확장 구간에서는 되돌림 진입 후 추세 타기", "확장 중 역추세 진입 자제", "확장 끝(과열 신호)에서 이익 실현 고려"], common_mistakes: ["확장 끝에서 추격 진입", "확장을 조정으로 착각하고 역방향 진입", "확장 구간 전체를 잡으려는 욕심"], related_terms: ["consolidation", "displacement", "trend"], examples: ["횡보 돌파 후 연속 3개 대양봉 → 확장 구간 진입 중."] },
    { id: "retracement", term_en: "Retracement", term_kr: "되돌림", category: "시장 구조", one_liner: "추세 방향 움직임 후 일시적으로 반대 방향으로 조정되는 것입니다.", definition: "Retracement는 주 추세 방향으로 움직인 후, 잠시 반대 방향으로 당기는 것입니다. 되돌림은 추세 방향 진입의 좋은 기회이며, 보통 피보나치 38.2%, 50%, 61.8%를 참고합니다.", how_to_use: ["추세 방향으로 되돌림 시 진입 기회 포착", "OB/FVG와 피보나치 되돌림이 겹치는 영역 주목", "되돌림 없이 가면 추격 대신 다음 되돌림 대기"], common_mistakes: ["되돌림을 추세 전환으로 오해", "되돌림 중 너무 일찍 진입", "되돌림 폭을 예측하려는 것"], related_terms: ["fibonacci", "premium-discount", "fair-value-gap"], examples: ["상승 후 50% 되돌림(FVG 영역)에서 매수 진입."] },
    { id: "supply-demand", term_en: "Supply/Demand", term_kr: "수요·공급", category: "시장 구조", one_liner: "매수세(수요)와 매도세(공급)가 집중된 가격 영역입니다.", definition: "Supply Zone은 매도세가 강해 가격이 하락할 가능성이 높은 영역이고, Demand Zone은 매수세가 강해 가격이 상승할 가능성이 높은 영역입니다. OB와 유사한 개념입니다.", how_to_use: ["Demand Zone 도달 시 롱, Supply Zone 도달 시 숏 고려", "거래량 동반 Zone이 더 신뢰도 높음", "한 번 터치된 Zone은 약화됨"], common_mistakes: ["너무 많은 Zone 표시", "모든 Zone에서 반전을 기대", "Zone 크기를 너무 넓게 설정"], related_terms: ["order-block", "support-resistance", "premium-discount"], examples: ["강한 상승 시작점의 마지막 음봉 → Demand Zone으로 표시."] },
    // ===================== 주문/유동성 =====================
    { id: "bid-ask", term_en: "Bid/Ask", term_kr: "매수호가/매도호가", category: "주문/유동성", one_liner: "현재 매수자가 사려는 가격(Bid)과 매도자가 팔려는 가격(Ask)입니다.", definition: "Bid는 매수자들이 제시하는 최고 가격이고, Ask는 매도자들이 제시하는 최저 가격입니다. 시장가 매수는 Ask에, 시장가 매도는 Bid에 체결됩니다.", how_to_use: ["스프레드가 좁을 때 거래 유리", "급변동 시 스프레드 확대 주의", "지정가 주문으로 유리한 가격에 체결 시도"], common_mistakes: ["스프레드 무시하고 빈번한 시장가 주문", "변동성 높을 때 시장가 올인", "Bid/Ask 의미 혼동"], related_terms: ["spread", "slippage", "limit-order"], examples: ["Bid 100, Ask 101 → 시장가 매수 시 101에 체결."] },
    { id: "spread", term_en: "Spread", term_kr: "스프레드", category: "주문/유동성", one_liner: "Bid와 Ask 사이의 가격 차이입니다.", definition: "스프레드는 매수호가와 매도호가의 차이로, 거래의 숨은 비용입니다. 유동성이 높은 종목은 스프레드가 좁고, 낮은 종목은 넓습니다.", how_to_use: ["스프레드가 좁은 종목/시간대 선호", "스프레드 비용을 수익 계산에 포함", "뉴스 발표 직후 스프레드 확대 대비"], common_mistakes: ["스프레드 무시하고 수익률 계산", "비유동 종목에서 잦은 매매", "스프레드 확대 시 시장가 주문"], related_terms: ["bid-ask", "slippage", "liquidity"], examples: ["평소 스프레드 1포인트가 뉴스 시 10포인트로 확대."] },
    { id: "slippage", term_en: "Slippage", term_kr: "슬리피지", category: "주문/유동성", one_liner: "주문 가격과 실제 체결 가격의 차이입니다.", definition: "슬리피지는 시장가 주문이나 스탑 주문이 예상 가격이 아닌 다른 가격에 체결되는 것입니다. 변동성이 높거나 유동성이 낮을 때 자주 발생합니다.", how_to_use: ["슬리피지 감안하여 스탑/진입 가격 설정", "중요 뉴스 시 슬리피지 예상하고 포지션 축소", "지정가 주문으로 슬리피지 방지"], common_mistakes: ["슬리피지 무시한 백테스트", "변동성 높을 때 대량 시장가 주문", "스탑 가격과 청산 가격이 같을 것이라 기대"], related_terms: ["spread", "market-order", "stop-loss"], examples: ["스탑 100 설정 → 급락으로 98에 체결 = 2포인트 슬리피지."] },
    { id: "limit-order", term_en: "Limit Order", term_kr: "지정가 주문", category: "주문/유동성", one_liner: "지정한 가격 또는 그보다 유리한 가격에만 체결되는 주문입니다.", definition: "지정가 주문은 원하는 가격을 지정해두고, 그 가격에 도달하면 체결되는 주문입니다. 슬리피지 방지와 원하는 진입점 확보에 유리하지만, 가격이 도달하지 않으면 체결되지 않습니다.", how_to_use: ["OB/FVG 영역에 지정가 진입 주문 설정", "목표가에 이익 실현 지정가 주문", "체결되지 않을 수 있음을 감안"], common_mistakes: ["너무 좋은 가격에 지정 → 미체결", "지정가에 집착하여 좋은 기회 놓침", "지정가 걸어두고 관리 안 함"], related_terms: ["market-order", "stop-order", "bid-ask"], examples: ["OB 하단 2,380에 롱 지정가 주문 설정."] },
    { id: "market-order", term_en: "Market Order", term_kr: "시장가 주문", category: "주문/유동성", one_liner: "현재 시장에서 즉시 체결되는 주문입니다.", definition: "시장가 주문은 최우선 호가에 즉시 체결됩니다. 빠른 진입/청산이 필요할 때 사용하지만, 스프레드와 슬리피지 비용이 발생합니다.", how_to_use: ["빠른 청산이 필요할 때 사용", "진입은 가급적 지정가 선호", "시장가 사용 시 스프레드 확인"], common_mistakes: ["습관적으로 시장가만 사용", "변동성 높을 때 대량 시장가", "스프레드 넓은 종목에서 시장가"], related_terms: ["limit-order", "slippage", "spread"], examples: ["급반전 시 빠른 손절을 위해 시장가 청산."] },
    { id: "stop-order", term_en: "Stop Order", term_kr: "스탑 주문", category: "주문/유동성", one_liner: "특정 가격에 도달하면 시장가로 전환되는 주문입니다.", definition: "스탑 주문은 지정한 트리거 가격에 도달하면 시장가 주문으로 바뀌어 체결됩니다. 손절이나 돌파 진입에 사용되며, 슬리피지가 발생할 수 있습니다.", how_to_use: ["손절 자동화에 스탑 주문 사용", "돌파 진입에 스탑 주문 활용", "슬리피지 감안하여 여유 있게 설정"], common_mistakes: ["스탑 가격에 정확히 체결될 것이라 기대", "스탑 주문을 지정가처럼 착각", "유동성 적은 곳에 스탑 설정"], related_terms: ["stop-loss", "limit-order", "slippage"], examples: ["롱 손절: 2,380 스탑 주문 → 2,380 터치 시 시장가 매도."] },
    { id: "volume", term_en: "Volume", term_kr: "거래량", category: "주문/유동성", one_liner: "특정 기간 동안 체결된 총 거래 수량입니다.", definition: "거래량은 시장 참여자들의 관심과 활동을 나타냅니다. 거래량 증가와 함께하는 가격 움직임은 더 신뢰도가 높고, 거래량 없는 움직임은 의심해야 합니다.", how_to_use: ["돌파 시 거래량 동반 여부 확인", "거래량 급증은 중요 움직임 신호", "거래량 감소 추세에서 방향 전환 주의"], common_mistakes: ["거래량 무시하고 가격만 보기", "모든 거래량 급증을 매수 신호로", "거래량 없는 돌파에 큰 포지션"], related_terms: ["volume-spike", "vwap", "delta"], examples: ["저항 돌파 + 거래량 2배 증가 → 신뢰도 높은 돌파."] },
    { id: "volume-spike", term_en: "Volume Spike", term_kr: "거래량 급증", category: "주문/유동성", one_liner: "평소보다 급격히 증가한 거래량입니다.", definition: "Volume Spike는 평균 거래량 대비 2~3배 이상 급증하는 것으로, 기관 활동이나 중요 이벤트를 나타낼 수 있습니다. 가격 방향과 함께 해석해야 합니다.", how_to_use: ["거래량 급증 + 강한 캔들 = 중요 레벨", "거래량 급증 + 긴 꼬리 = 반전 가능성", "고점/저점에서의 거래량 급증 주목"], common_mistakes: ["모든 거래량 급증을 추세 시작으로", "거래량 급증 후 바로 추격", "뉴스 거래량과 기술적 거래량 구분 안 함"], related_terms: ["volume", "climax", "exhaustion"], examples: ["저점에서 거래량 3배 급증 + 긴 아래꼬리 → 반등 신호."] },
    { id: "open-interest", term_en: "Open Interest", term_kr: "미결제 약정", abbreviation: "OI", category: "주문/유동성", one_liner: "선물/옵션 시장에서 아직 청산되지 않은 계약 수입니다.", definition: "Open Interest는 열려있는 포지션의 총합입니다. OI 증가는 새로운 돈이 유입되는 것이고, OI 감소는 포지션이 정리되는 것입니다. 가격과 함께 분석하여 추세 강도를 파악합니다.", how_to_use: ["가격 상승 + OI 증가 = 강세 지속 가능", "가격 상승 + OI 감소 = 숏 커버링, 약세 전환 주의", "극단적 OI에서 청산 러시 대비"], common_mistakes: ["OI만 보고 거래 결정", "OI와 거래량 혼동", "OI 변화 방향만 보고 절대값 무시"], related_terms: ["funding-rate", "liquidation", "volume"], examples: ["비트코인 가격 상승 중 OI 최고치 갱신 → 롱 포지션 축적 중."] },
    { id: "funding-rate", term_en: "Funding Rate", term_kr: "펀딩비", category: "주문/유동성", one_liner: "선물 가격을 현물과 맞추기 위해 롱/숏 간에 주기적으로 교환하는 비용입니다.", definition: "Funding Rate는 무기한 선물에서 롱과 숏 간에 8시간마다 정산되는 비용입니다. 양수면 롱이 숏에게, 음수면 숏이 롱에게 지불합니다. 극단적 펀딩은 과열 신호입니다.", how_to_use: ["고펀딩 + 고점권 = 롱 과열, 조정 주의", "음수 펀딩 + 저점권 = 숏 과열, 반등 가능성", "장기 포지션 시 펀딩 비용 고려"], common_mistakes: ["펀딩만 보고 역방향 진입", "펀딩 비용 무시하고 장기 보유", "펀딩 정산 시간 전후 변동성 무시"], related_terms: ["open-interest", "liquidation", "perpetual"], examples: ["펀딩 0.1% 지속 → 롱 과열, 스퀴즈 가능성."] },
    { id: "liquidation", term_en: "Liquidation", term_kr: "청산", category: "주문/유동성", one_liner: "레버리지 포지션이 마진 부족으로 강제 청산되는 것입니다.", definition: "Liquidation은 레버리지 거래에서 증거금이 유지증거금 이하로 떨어지면 거래소가 포지션을 강제로 청산하는 것입니다. 대량 청산은 급격한 가격 움직임을 유발합니다.", how_to_use: ["청산 맵으로 유동성 밀집 가격대 파악", "대량 청산 후 반전 포착", "레버리지 관리로 본인 청산 방지"], common_mistakes: ["과도한 레버리지로 쉽게 청산", "청산 레벨 관리 안 함", "청산 캐스케이드 중 추격 진입"], related_terms: ["leverage", "margin", "open-interest"], examples: ["48,000에 대량 롱 청산 예상 → 해당 레벨 터치 후 급등 반전."] },
    { id: "vwap", term_en: "VWAP", term_kr: "거래량 가중 평균 가격", category: "주문/유동성", one_liner: "거래량을 가중치로 한 평균 가격으로, 기관의 평균 체결가를 나타냅니다.", definition: "VWAP는 거래량 가중 평균 가격으로, 하루 동안 기관들이 평균적으로 어느 가격에 체결했는지를 보여줍니다. 가격이 VWAP 위면 매수세 우위, 아래면 매도세 우위로 해석합니다.", how_to_use: ["VWAP 위에서 롱 바이어스, 아래에서 숏 바이어스", "VWAP으로 되돌림 시 진입 기회", "세션 VWAP vs 일간 VWAP 구분"], common_mistakes: ["VWAP만으로 진입 결정", "VWAP 터치마다 반전 기대", "레인지장에서 VWAP 중시"], related_terms: ["volume", "moving-average", "anchored-vwap"], examples: ["가격이 VWAP 위로 복귀 → 롱 바이어스로 전환."] },
    // ===================== 기초/차트 =====================
    { id: "candlestick", term_en: "Candlestick", term_kr: "캔들스틱", category: "기초/차트", one_liner: "시가, 고가, 저가, 종가를 시각적으로 표현한 차트 요소입니다.", definition: "캔들스틱은 일정 시간 동안의 가격 움직임을 표현합니다. 몸통은 시가-종가, 꼬리(wick)는 고가-저가를 나타냅니다. 양봉은 상승 마감, 음봉은 하락 마감입니다.", how_to_use: ["캔들 패턴으로 반전/지속 신호 파악", "긴 꼬리는 거부 신호", "캔들 크기로 모멘텀 판단"], common_mistakes: ["캔들 패턴만으로 거래 결정", "맥락 없이 단일 캔들 해석", "모든 캔들 패턴 암기에 집착"], related_terms: ["wick-body", "support-resistance", "price-action"], examples: ["지지선에서 긴 아래꼬리 양봉 → 매수세 유입 신호."] },
    { id: "wick-body", term_en: "Wick/Body", term_kr: "꼬리/몸통", category: "기초/차트", one_liner: "캔들의 꼬리는 고가-저가, 몸통은 시가-종가 범위입니다.", definition: "Wick(Shadow)은 캔들의 고점에서 종가(또는 시가)까지, 저점에서 시가(또는 종가)까지의 선입니다. Body는 시가와 종가 사이의 두꺼운 부분입니다.", how_to_use: ["긴 꼬리 = 해당 방향 거부/반전 신호", "큰 몸통 = 강한 방향성", "꼬리 대 몸통 비율로 심리 파악"], common_mistakes: ["꼬리 무시하고 종가만 보기", "모든 긴 꼬리를 반전으로 해석", "몸통 없는 도지 과대해석"], related_terms: ["candlestick", "pin-bar", "rejection"], examples: ["저항선에서 긴 위꼬리 = 매도세 강함, 하락 가능성."] },
    { id: "support-resistance", term_en: "Support/Resistance", term_kr: "지지/저항", category: "기초/차트", one_liner: "가격이 반복적으로 멈추거나 반전하는 수평 가격대입니다.", definition: "지지(Support)는 하락이 멈추고 반등하는 가격대이고, 저항(Resistance)은 상승이 멈추고 하락하는 가격대입니다. 과거에 여러 번 반응한 레벨일수록 중요합니다.", how_to_use: ["지지에서 롱, 저항에서 숏 고려", "뚫린 지지는 저항으로 전환 가능", "여러 번 테스트된 레벨 = 강한 레벨"], common_mistakes: ["너무 많은 S/R 표시", "S/R을 정확한 선이 아닌 영역으로 보지 않음", "돌파 시 무조건 추격"], related_terms: ["order-block", "supply-demand", "breakout"], examples: ["2,500 저항 3회 테스트 → 돌파 시 강한 상승 기대."] },
    { id: "atr", term_en: "ATR", term_kr: "평균 진폭", abbreviation: "ATR", category: "기초/차트", one_liner: "일정 기간 동안의 평균 가격 변동폭입니다.", definition: "ATR(Average True Range)은 변동성을 측정하는 지표로, 최근 N기간의 평균 진폭을 계산합니다. 스탑 설정, 목표가 설정, 포지션 사이징에 활용됩니다.", how_to_use: ["스탑 = 진입가 ± ATR×1.5~2", "ATR 높으면 포지션 줄이기", "ATR 기반 목표가 설정"], common_mistakes: ["고정 스탑만 사용, ATR 무시", "ATR 높을 때 평소 사이즈 유지", "ATR을 방향 지표로 착각"], related_terms: ["volatility", "stop-loss", "position-sizing"], examples: ["ATR 14기간 = 50포인트 → 스탑 75포인트(1.5배) 설정."] },
    { id: "volatility", term_en: "Volatility", term_kr: "변동성", category: "기초/차트", one_liner: "가격이 얼마나 크게, 빠르게 움직이는지를 나타냅니다.", definition: "변동성은 가격 변동의 정도입니다. 높은 변동성은 기회와 리스크를 모두 높이고, 낮은 변동성은 조용한 시장을 의미합니다. ATR, 볼린저 밴드 폭 등으로 측정합니다.", how_to_use: ["고변동성: 포지션 축소, 스탑 넓게", "저변동성: 돌파 대기, 레인지 거래", "변동성 사이클 인식"], common_mistakes: ["변동성에 맞지 않는 스탑 설정", "저변동성에서 추세 거래 고집", "고변동성에서 과거 리스크 수준 유지"], related_terms: ["atr", "bollinger-bands", "range"], examples: ["ATR 2배 증가 → 포지션 50% 축소, 스탑 넓게 조정."] },
    { id: "gap", term_en: "Gap", term_kr: "갭", category: "기초/차트", one_liner: "이전 캔들과 현재 캔들 사이에 가격이 비어있는 구간입니다.", definition: "갭은 장 마감과 개장 사이, 또는 급격한 뉴스로 인해 발생하는 가격 공백입니다. 갭은 채워지는 경향이 있어(Gap Fill), 되돌림 거래에 활용됩니다.", how_to_use: ["갭 발생 시 갭 방향 추세 인식", "갭 채우기 전략 고려", "갭 위/아래 레벨로 지지/저항 설정"], common_mistakes: ["모든 갭이 채워질 것이라 확신", "갭 채우기 전에 역방향 올인", "runaway 갭과 exhaustion 갭 구분 안 함"], related_terms: ["fair-value-gap", "opening-range", "support-resistance"], examples: ["월요일 상승갭 → 갭 하단을 지지로 활용."] },
    { id: "session", term_en: "Session", term_kr: "세션", category: "기초/차트", one_liner: "전 세계 시장의 주요 거래 시간대(아시아/유럽/미국)입니다.", definition: "Session은 아시아(도쿄), 런던(유럽), 뉴욕(미국) 등 주요 시장이 열리는 시간대입니다. 각 세션마다 유동성과 변동성 특성이 다르며, 세션 전환 시 새로운 움직임이 시작될 수 있습니다.", how_to_use: ["자신의 거래 세션 선택 및 집중", "세션 시작/종료 시 변동성 증가 주의", "아시아 범위 돌파 전략 등 세션 특성 활용"], common_mistakes: ["모든 세션에서 같은 전략 적용", "세션 전환 시간대 무시", "자신의 생활과 맞지 않는 세션 무리하게 거래"], related_terms: ["time-window", "volatility", "opening-range"], examples: ["아시아 세션 레인지 → 런던 오픈에 돌파 대기."] },
    { id: "fibonacci", term_en: "Fibonacci", term_kr: "피보나치", category: "기초/차트", one_liner: "자연에서 발견되는 비율을 차트에 적용한 지지/저항 도구입니다.", definition: "피보나치 되돌림(38.2%, 50%, 61.8%)과 확장(127.2%, 161.8%)은 가격 조정 및 목표 레벨을 찾는 데 사용됩니다. 다른 분석 도구와 함께 사용하면 효과적입니다.", how_to_use: ["되돌림: 조정 진입점 찾기", "확장: 목표가 설정", "OB/FVG와 피보나치 겹침 영역 주목"], common_mistakes: ["피보나치만으로 거래 결정", "모든 레벨에 동일 가중치", "피보나치 그리기 시작점/끝점 임의 설정"], related_terms: ["retracement", "premium-discount", "take-profit"], examples: ["상승파 61.8% 되돌림 + OB 겹침 → 강력한 매수 영역."] },
    { id: "correlation", term_en: "Correlation", term_kr: "상관관계", category: "기초/차트", one_liner: "두 자산이 같은 방향(양) 또는 반대 방향(음)으로 움직이는 정도입니다.", definition: "상관관계는 두 자산의 가격 움직임이 얼마나 비슷한지를 나타냅니다. +1은 완전 동행, -1은 완전 역행, 0은 무관계입니다. 포트폴리오 분산과 헤지에 활용됩니다.", how_to_use: ["높은 상관 자산 동시 보유 피하기 (집중 리스크)", "역상관 자산으로 헤지", "상관관계 변화 모니터링"], common_mistakes: ["과거 상관관계가 유지될 것이라 가정", "상관관계만 보고 거래 결정", "단기 상관관계와 장기 혼동"], related_terms: ["diversification", "hedge", "portfolio"], examples: ["KOSPI와 나스닥 높은 양의 상관 → 동시 롱 포지션 리스크 집중."] },
    { id: "dxy", term_en: "DXY", term_kr: "달러 인덱스", category: "기초/차트", one_liner: "미국 달러의 주요 6개 통화 대비 가치를 나타내는 지수입니다.", definition: "DXY(US Dollar Index)는 유로, 엔, 파운드 등 6개 주요 통화 대비 달러 가치를 종합 지수화한 것입니다. DXY 상승은 달러 강세, 하락은 달러 약세를 의미합니다.", how_to_use: ["DXY 강세 → 위험자산(주식, 크립토) 약세 경향", "DXY 약세 → 원자재, 신흥국 자산 강세 경향", "DXY와 USDKRW 함께 분석"], common_mistakes: ["DXY만으로 개별 통화 예측", "DXY 방향이 즉시 다른 자산에 반영될 것이라 기대", "DXY 과거 레벨에 집착"], related_terms: ["usdkrw", "correlation", "risk-on-off"], examples: ["DXY 102 저항 돌파 → 전반적 달러 강세, 원화 약세 예상."] },
    { id: "usdkrw", term_en: "USD/KRW", term_kr: "달러/원 환율", category: "기초/차트", one_liner: "1미국 달러를 한국 원화로 환산한 가격입니다.", definition: "USD/KRW 환율은 미국 달러 대비 한국 원화의 가치를 나타냅니다. 환율 상승은 원화 약세(달러 강세), 하락은 원화 강세(달러 약세)입니다. KOSPI와 역상관 경향이 있습니다.", how_to_use: ["환율 급등 → KOSPI 하락 압력 예상", "해외 투자 시 환율 변동 리스크 인식", "환율과 주가 지수 디커플링 시 주의"], common_mistakes: ["환율 무시하고 해외 자산 투자", "환율과 주가 항상 역행할 것이라 가정", "단기 환율 변동에 과민 반응"], related_terms: ["dxy", "correlation", "forex"], examples: ["USDKRW 1,350원 돌파 → 외국인 매도 가속화 우려."] },
    // Additional SMC terms
    { id: "poi", term_en: "Point of Interest", term_kr: "관심 영역", abbreviation: "POI", category: "SMC", one_liner: "거래 기회가 있을 것으로 예상되는 특정 가격 영역입니다.", definition: "POI는 OB, FVG, 유동성 등이 겹치는 가격대로, 높은 확률의 진입 기회가 예상되는 곳입니다. 차트에 미리 표시해두고 가격이 도달하면 반응을 확인합니다.", how_to_use: ["OB + FVG + 피보나치가 겹치는 곳을 POI로 설정", "가격이 POI 도달 시 하위 타임프레임에서 확인 진입", "POI에서 반응 없으면 패스"], common_mistakes: ["너무 많은 POI 표시", "POI 도달 시 무조건 진입", "POI 간 우선순위 없이 동일 취급"], related_terms: ["order-block", "fair-value-gap", "confluence"], examples: ["1시간 OB + 4시간 FVG + 피보 61.8% 겹침 = 강력한 POI."] },
    { id: "confluence", term_en: "Confluence", term_kr: "합류/컨플루언스", category: "SMC", one_liner: "여러 기술적 요소가 같은 가격대에서 겹치는 것입니다.", definition: "Confluence는 OB, FVG, 피보나치, 지지/저항 등 여러 분석 도구가 동일한 영역을 가리킬 때 발생합니다. 합류 지점일수록 반전/반응 확률이 높아집니다.", how_to_use: ["2개 이상의 요소가 겹치는 구간만 거래 고려", "합류가 많을수록 확신과 포지션 사이즈 증가", "합류 없는 단독 신호는 경계"], common_mistakes: ["합류 없이 단일 신호로 진입", "모든 합류가 동등하다고 가정", "합류점에서도 확인 없이 진입"], related_terms: ["poi", "order-block", "fibonacci"], examples: ["OB + EQH 유동성 + Premium 영역 = 3중 합류, 숏 셋업."] },
    { id: "equilibrium", term_en: "Equilibrium", term_kr: "균형점", abbreviation: "EQ", category: "SMC", one_liner: "가격 범위의 정중앙(50%) 지점으로, Premium과 Discount를 나누는 경계입니다.", definition: "Equilibrium은 특정 스윙의 50% 되돌림 레벨입니다. 이 레벨 위는 Premium(고평가), 아래는 Discount(저평가)로 나뉩니다. 롱은 EQ 아래서, 숏은 EQ 위에서 진입하는 것이 확률적으로 유리합니다.", how_to_use: ["롱은 항상 EQ 아래에서만 진입 시도", "숏은 항상 EQ 위에서만 진입 시도", "EQ 근처에서는 방향 판단 어려움"], common_mistakes: ["EQ 정확히 50%에서 반전 기대", "EQ 개념 없이 아무 데서나 진입", "추세 무시하고 EQ만 고려"], related_terms: ["premium-discount", "fibonacci", "retracement"], examples: ["스윙 저점 100, 고점 200 → EQ = 150, 150 이하에서 롱 진입 선호."] },
    // Additional ORB terms  
    { id: "orb-volatility-filter", term_en: "Volatility Filter", term_kr: "변동성 필터", category: "ORB", one_liner: "OR 폭이 너무 크거나 작을 때 거래를 피하는 필터입니다.", definition: "Volatility Filter는 OR의 크기가 평소 대비 너무 넓으면(리스크 과다) 또는 너무 좁으면(돌파 후 추세 약함) 당일 ORB 거래를 스킵하는 규칙입니다.", how_to_use: ["OR 폭이 ATR의 0.5~1.5배일 때만 거래", "OR 폭이 너무 크면 당일 패스", "OR 폭이 너무 좁으면 돌파 후 확장 기대하되 조심"], common_mistakes: ["모든 OR 크기에서 동일 전략", "ATR 대비 OR 폭 계산 안 함", "변동성 무시한 고정 스탑"], related_terms: ["opening-range", "atr", "volatility"], examples: ["평소 ATR 30포인트, OR 폭 60포인트 → 당일 ORB 패스."] },
    { id: "orb-confirmation", term_en: "Confirmation", term_kr: "확인", category: "ORB", one_liner: "돌파가 진짜인지 확인하는 추가 신호입니다.", definition: "Confirmation은 OR 돌파 후 진입 전에 확인하는 추가 조건입니다. 강한 캔들 종가, 거래량 증가, 리테스트 성공 등이 해당됩니다.", how_to_use: ["돌파 캔들 종가가 OR 외부에서 마감 확인", "거래량 동반 돌파 선호", "리테스트 후 지지/저항 전환 확인"], common_mistakes: ["돌파 즉시 진입", "위크만 돌파해도 진입", "확인 없이 큰 포지션"], related_terms: ["orb-breakout", "orb-retest", "volume"], examples: ["OR 고점 돌파 후 종가가 OR 위에서 마감 + 거래량 증가 = 확인 완료."] },
    // Additional Risk Management
    { id: "expectancy", term_en: "Expectancy", term_kr: "기대값", category: "리스크 관리", one_liner: "장기적으로 거래당 평균 수익 또는 손실을 나타내는 지표입니다.", definition: "기대값은 (승률 × 평균 수익) - (패률 × 평균 손실)로 계산합니다. 양수면 장기적으로 수익, 음수면 장기적으로 손실입니다.", how_to_use: ["기대값 양수인 전략만 거래", "기대값 계산을 위해 거래 기록 필수", "기대값이 낮아지면 전략 점검"], common_mistakes: ["기대값 모르고 거래", "승률만 보고 기대값 무시", "샘플 수 부족으로 기대값 과신"], related_terms: ["risk-reward", "win-rate", "trading-journal"], examples: ["승률 40%, 평균 수익 3R, 평균 손실 1R → 기대값 = 0.4×3 - 0.6×1 = 0.6R (양수)."] },
    { id: "win-rate", term_en: "Win Rate", term_kr: "승률", category: "리스크 관리", one_liner: "전체 거래 중 수익 거래의 비율입니다.", definition: "승률은 수익 거래 수 / 전체 거래 수 × 100%입니다. 승률이 낮아도 R:R이 높으면 수익을 낼 수 있습니다. 승률과 R:R을 함께 고려해야 합니다.", how_to_use: ["승률과 R:R 조합으로 기대값 계산", "승률 60% + R:R 1:1 vs 승률 40% + R:R 3:1 비교", "거래 일지로 실제 승률 측정"], common_mistakes: ["높은 승률만 추구, R:R 무시", "적은 샘플로 승률 확정", "승률에 따라 감정적 반응"], related_terms: ["expectancy", "risk-reward", "trading-journal"], examples: ["50번 거래 중 25번 수익 → 승률 50%."] },
    { id: "trading-journal", term_en: "Trading Journal", term_kr: "거래 일지", category: "리스크 관리", one_liner: "모든 거래를 기록하고 분석하는 문서입니다.", definition: "거래 일지는 진입/청산 가격, 셋업, 스크린샷, 감정 상태, 결과 등을 기록합니다. 패턴 인식, 실수 파악, 전략 개선에 필수적입니다.", how_to_use: ["모든 거래 즉시 기록", "주간/월간 리뷰로 패턴 파악", "감정 상태와 결과 상관관계 분석"], common_mistakes: ["거래 일지 안 쓰기", "수익 거래만 기록", "기록만 하고 리뷰 안 함"], related_terms: ["win-rate", "expectancy", "overtrading"], examples: ["주간 리뷰: 금요일 오후 거래 승률 낮음 → 금요일 오후 거래 중단 결정."] },
    // Additional 주문/유동성
    { id: "delta", term_en: "Delta", term_kr: "델타", category: "주문/유동성", one_liner: "일정 기간 동안의 매수 거래량 - 매도 거래량입니다.", definition: "Delta는 시장가 매수량에서 시장가 매도량을 뺀 것으로, 적극적인 매수/매도세의 강도를 보여줍니다. 양수 Delta는 매수세 우위, 음수는 매도세 우위입니다.", how_to_use: ["가격 상승 + 양수 Delta = 건강한 상승", "가격 상승 + 음수 Delta = 약한 상승, 주의", "극단적 Delta 후 반전 가능성"], common_mistakes: ["Delta만으로 거래 결정", "Delta 방향과 가격 방향 혼동", "Delta 도구 없이 분석"], related_terms: ["volume", "footprint", "order-flow"], examples: ["신고점 + 음수 누적 Delta = 다이버전스, 하락 경고."] },
    { id: "order-flow", term_en: "Order Flow", term_kr: "주문 흐름", category: "주문/유동성", one_liner: "시장에서 실제로 체결되는 주문의 흐름을 분석하는 것입니다.", definition: "Order Flow 분석은 호가창, Delta, 풋프린트 차트 등을 통해 실제 매수/매도 압력을 파악합니다. 캔들만으로는 보이지 않는 '왜 가격이 움직이는지'를 이해할 수 있습니다.", how_to_use: ["주요 레벨에서 Order Flow로 수요/공급 확인", "대량 주문 체결 위치 파악", "Order Flow 도구 활용 (Footprint, Bookmap 등)"], common_mistakes: ["Order Flow 없이 블라인드 거래", "너무 복잡하게 분석", "Order Flow만 의존, 구조 무시"], related_terms: ["delta", "volume", "footprint", "liquidity"], examples: ["저항에서 대량 매도 흡수(Absorption) → 돌파 가능성."] },
    { id: "iceberg-order", term_en: "Iceberg Order", term_kr: "빙산 주문", category: "주문/유동성", one_liner: "대량 주문을 작은 단위로 나눠 시장에 노출시키는 주문 방식입니다.", definition: "Iceberg Order는 전체 주문량의 일부만 호가창에 보이게 하고, 체결될 때마다 새로운 주문을 올리는 방식입니다. 기관들이 대량 주문을 숨기기 위해 사용합니다.", how_to_use: ["같은 가격에서 계속 체결되는 패턴 주목", "Iceberg 탐지 시 해당 레벨의 중요성 인식", "호가창 분석 도구 활용"], common_mistakes: ["호가창 표면만 보기", "Iceberg 미탐지로 유동성 과소평가", "모든 반복 주문을 Iceberg로 착각"], related_terms: ["order-flow", "liquidity", "volume"], examples: ["1,000에서 100주씩 계속 체결 → Iceberg 존재 가능성."] },
    // Additional 시장 구조
    { id: "higher-timeframe", term_en: "Higher Timeframe", term_kr: "상위 타임프레임", abbreviation: "HTF", category: "시장 구조", one_liner: "현재 분석 중인 시간보다 더 큰 시간 단위의 차트입니다.", definition: "HTF는 일봉, 4시간봉, 1시간봉 등 더 넓은 시간 범위의 차트입니다. 상위 타임프레임의 추세와 구조가 하위 타임프레임보다 우선합니다.", how_to_use: ["HTF 추세 방향으로만 거래", "HTF에서 POI/유동성 위치 파악", "HTF 구조 변화 시 하위 재평가"], common_mistakes: ["HTF 무시하고 하위에서만 분석", "HTF와 LTF 신호 충돌 시 LTF 선택", "HTF 분석 없이 거래"], related_terms: ["lower-timeframe", "market-structure", "trend"], examples: ["일봉 상승 추세 → 15분봉에서 되돌림 롱만 거래."] },
    { id: "lower-timeframe", term_en: "Lower Timeframe", term_kr: "하위 타임프레임", abbreviation: "LTF", category: "시장 구조", one_liner: "현재 분석 중인 시간보다 더 작은 시간 단위의 차트입니다.", definition: "LTF는 5분봉, 1분봉 등 더 짧은 시간 범위의 차트입니다. 정밀 진입과 스탑 설정에 사용되며, HTF 방향과 일치할 때만 신뢰합니다.", how_to_use: ["HTF POI 도달 후 LTF에서 확인 진입", "LTF로 스탑 좁히기", "LTF 구조가 HTF와 일치할 때 진입"], common_mistakes: ["LTF만으로 추세 판단", "LTF 노이즈에 휘둘림", "HTF 맥락 없이 LTF 거래"], related_terms: ["higher-timeframe", "market-structure", "internal-structure"], examples: ["4시간 OB 도달 → 15분 CHOCH 확인 후 진입."] },
    { id: "multi-timeframe", term_en: "Multi-Timeframe Analysis", term_kr: "멀티 타임프레임 분석", abbreviation: "MTF", category: "시장 구조", one_liner: "여러 시간대를 함께 분석하여 거래 결정을 내리는 방법입니다.", definition: "MTF 분석은 HTF에서 추세와 주요 레벨을, LTF에서 정밀 진입을 찾는 방식입니다. 예: 일봉 추세 → 4시간 POI → 15분 확인 진입.", how_to_use: ["최소 2~3개 타임프레임 동시 분석", "HTF → 중간 TF → LTF 순서로 분석", "각 TF 역할 명확히 정의"], common_mistakes: ["너무 많은 TF 분석 (분석 마비)", "TF 간 일관성 없는 분석", "특정 TF만 고집"], related_terms: ["higher-timeframe", "lower-timeframe", "trend"], examples: ["일봉 상승 + 4시간 Demand Zone + 15분 CHOCH = MTF 합류."] },
    // Additional 기초/차트
    { id: "pin-bar", term_en: "Pin Bar", term_kr: "핀바", category: "기초/차트", one_liner: "긴 꼬리와 작은 몸통을 가진 반전 캔들 패턴입니다.", definition: "Pin Bar는 한쪽에 긴 꼬리, 반대쪽에 작은 몸통이 있는 캔들입니다. 긴 꼬리 방향으로의 거부를 의미하며, 반대 방향 반전 신호로 해석됩니다.", how_to_use: ["중요 레벨에서 Pin Bar 발생 시 반전 고려", "꼬리가 유동성 스윕한 경우 더 신뢰", "Pin Bar 고점/저점을 스탑으로 사용"], common_mistakes: ["아무 곳에서나 Pin Bar 거래", "맥락 없이 패턴만 보기", "Pin Bar 크기가 너무 작음"], related_terms: ["candlestick", "wick-body", "rejection"], examples: ["지지선에서 긴 아래꼬리 Pin Bar → 매수 신호."] },
    { id: "engulfing", term_en: "Engulfing", term_kr: "장악형", category: "기초/차트", one_liner: "이전 캔들을 완전히 감싸는 큰 캔들 패턴입니다.", definition: "Engulfing 패턴은 현재 캔들의 몸통이 이전 캔들의 몸통을 완전히 감싸는 것입니다. 상승 장악형(음봉 → 큰 양봉)은 매수, 하락 장악형(양봉 → 큰 음봉)은 매도 신호입니다.", how_to_use: ["중요 레벨에서 Engulfing 발생 시 반전 신호", "Engulfing 캔들 크기가 클수록 신뢰도↑", "Engulfing 저점/고점을 스탑으로 설정"], common_mistakes: ["작은 Engulfing을 과대평가", "맥락 없이 모든 Engulfing 거래", "위크 포함 여부 혼동"], related_terms: ["candlestick", "pin-bar", "displacement"], examples: ["저항에서 하락 Engulfing → 숏 진입 고려."] },
    { id: "doji", term_en: "Doji", term_kr: "도지", category: "기초/차트", one_liner: "시가와 종가가 거의 같아 몸통이 없는 캔들입니다.", definition: "Doji는 매수세와 매도세가 균형을 이뤄 몸통이 거의 없는 캔들입니다. 단독으로는 방향성이 없으며, 다음 캔들로 방향이 결정됩니다. 추세 중 Doji는 인디시전(우유부단)을 의미합니다.", how_to_use: ["중요 레벨에서 Doji → 다음 캔들 방향 관찰", "Doji 후 확인 캔들로 진입", "추세 끝에서 Doji = 반전 가능성"], common_mistakes: ["Doji만으로 진입", "모든 Doji를 반전 신호로", "Doji 크기(ATR 대비) 무시"], related_terms: ["candlestick", "indecision", "reversal"], examples: ["저항에서 Doji 후 음봉 = 하락 확인, 숏 진입."] },
    { id: "moving-average", term_en: "Moving Average", term_kr: "이동평균선", abbreviation: "MA", category: "기초/차트", one_liner: "일정 기간 동안의 평균 가격을 연결한 선입니다.", definition: "이동평균선은 과거 N기간 종가의 평균을 나타냅니다. 추세 방향, 지지/저항, 모멘텀 판단에 사용됩니다. SMA(단순), EMA(지수) 등 종류가 있습니다.", how_to_use: ["가격이 MA 위면 롱 바이어스, 아래면 숏 바이어스", "MA 크로스오버로 추세 전환 감지", "MA를 동적 지지/저항으로 활용"], common_mistakes: ["MA만으로 진입 결정", "후행 지표임을 무시", "너무 많은 MA 사용"], related_terms: ["vwap", "trend", "support-resistance"], examples: ["가격이 20 EMA 위에서 지지 확인 → 롱 바이어스 유지."] },
    { id: "breakout", term_en: "Breakout", term_kr: "돌파", category: "기초/차트", one_liner: "중요한 지지/저항 또는 패턴을 넘어서는 가격 움직임입니다.", definition: "Breakout은 가격이 레인지, 지지/저항선, 차트 패턴 등을 돌파하는 것입니다. 진짜 돌파는 추세 시작 신호이지만, 가짜 돌파(Fakeout)도 많습니다.", how_to_use: ["돌파 후 리테스트에서 진입이 더 안전", "거래량 동반 돌파 선호", "돌파 실패(복귀) 시 반대 방향 셋업"], common_mistakes: ["모든 돌파에 추격 진입", "거래량 확인 안 함", "돌파 전에 방향 예측"], related_terms: ["support-resistance", "range", "fakeout"], examples: ["레인지 상단 돌파 + 거래량 증가 → 롱 진입."] },
    { id: "fakeout", term_en: "Fakeout", term_kr: "페이크아웃/가짜 돌파", category: "기초/차트", one_liner: "돌파처럼 보였지만 다시 범위 안으로 돌아오는 속임수입니다.", definition: "Fakeout은 가격이 중요 레벨을 잠깐 돌파했다가 빠르게 반전하는 것입니다. 돌파에 진입한 트레이더들의 스탑을 터트리고 반대로 움직입니다.", how_to_use: ["첫 돌파보다 리테스트나 두 번째 시도 선호", "돌파 실패 시 반대 방향 진입 고려", "유동성 스윕 관점에서 Fakeout 해석"], common_mistakes: ["모든 돌파에 즉시 진입", "Fakeout 후 같은 방향 재진입", "리스크 관리 없이 돌파 거래"], related_terms: ["breakout", "liquidity-sweep", "stop-hunt"], examples: ["저항 돌파 후 2캔들 내 저항 아래로 복귀 → Fakeout, 숏 기회."] }
];

export const glossaryCategories = ["전체", "SMC", "ORB", "리스크 관리", "시장 구조", "주문/유동성", "기초/차트"] as const;

