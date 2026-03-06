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
    locale: 'ko' | 'en';
}

export const blogPosts: BlogPost[] = [
    // ─── KO Blog Posts ─────────────────────────────────────────
    {
        slug: "fomo-math-ko",
        title: "FOMO의 수학: SK하이닉스 100만원 돌파일에 산 사람들의 운명",
        description: "SK하이닉스가 100만원을 돌파한 날, 모두가 샀다. 하지만 6거래일 후 -23%. FOMO의 수학이 말하는 것.",
        excerpt: "SK하이닉스 100만원 돌파일에 산 사람들은 6거래일 후 -23%를 겪었다. FOMO는 왜 항상 고점에서 작동하는가.",
        image: "/images/blog/sk-hynix-3month.png",
        category: "cognitive-bias",
        date: "2026-03-01",
        readingTime: "5분",
        tags: ["FOMO", "SK하이닉스", "인지편향", "HBM4", "반도체"],
        locale: "ko",
        isFeatured: true,
        content: `## 100만원의 마법

2026년 2월 26일. SK하이닉스가 1,099,000원으로 마감했습니다. 역사적인 100만원 돌파. 뉴스는 축제 분위기였고, 증권사 리포트는 목표가를 상향했으며, 커뮤니티에는 "아직 안 늦었다"는 글이 넘쳤습니다.

그리고 정확히 6거래일 후, SK하이닉스는 849,000원이었습니다. **-23%.**

## FOMO는 고점에서 가장 강하다

FOMO(Fear Of Missing Out)는 독특한 편향입니다. 주가가 내릴 때는 작동하지 않습니다. 오직 주가가 오를 때만 — 그것도 급격하게 오를 때만 — 우리의 뇌를 장악합니다.

100만원이라는 숫자의 심리적 의미를 생각해보세요:

- **앵커링**: 6자리에서 7자리로. "이제 다른 단계다"라는 착각
- **사회적 증거**: "다들 사고 있다"는 뉴스. 실제로는 그 주에 개인 순매수가 역대급
- **후회 회피**: "여기서 안 사면 영원히 놓친다"는 공포

하지만 데이터는 다른 이야기를 합니다. 심리적 가격 돌파 후 30일 내에 **68%의 종목이 돌파 당일 상승분의 절반 이상을 되돌렸습니다.**

## 수학은 거짓말하지 않는다

1,099,000원에 산 투자자가 849,000원에서 원금을 회복하려면 얼마나 올라야 할까요?

> (1,099,000 - 849,000) / 849,000 = **+29.4%**

맞습니다. 23% 잃으면, 회복에는 29.4%가 필요합니다. 퍼센트 수학의 비대칭입니다.

이것이 FOMO가 위험한 진짜 이유입니다. 고점에서 사면, 회복의 수학이 당신에게 불리하게 작동합니다.

## 그렇다면 언제 사야 했나

답은 단순합니다: **아무도 이야기하지 않을 때.**

2월 24일, SK하이닉스가 1,005,000원이었을 때 — 뉴스는 있었지만 축제는 아니었습니다. 2월 20일, 950,000원이었을 때 — HBM4 테마는 이미 시작되었지만 "100만원 돌파" 내러티브는 없었습니다.

FOMO의 반대는 준비입니다. 시장이 조용할 때 리서치하고, 매수 계획을 세우고, 기다리는 것.

## 교훈

1. **심리적 가격 돌파는 매수 신호가 아니다** — 그것은 FOMO 경보
2. **"다들 사고 있다"는 매도 신호에 가깝다** — 마지막 매수자가 들어오는 중
3. **퍼센트 수학은 비대칭이다** — 큰 손실은 더 큰 회복을 요구한다
4. **최고의 매수는 지루한 날에 일어난다** — 흥분이 아니라 분석으로

*덜 잃고. 더 오래 버텨라.*`
    },
    {
        slug: "circuit-breaker-paradox-ko",
        title: "서킷브레이커의 역설: 패닉을 막으려는 장치가 패닉을 증폭시키는 이유",
        description: "2026년 3월 4일, KOSPI -12.06%. 서킷브레이커 2회 발동. 거래 정지가 오히려 매도 경쟁을 만든 아이러니.",
        excerpt: "서킷브레이커는 공포를 멈추기 위해 설계됐다. 하지만 3월 4일, 두 번의 거래 정지는 오히려 공포를 키웠다.",
        image: "/images/blog/kospi-year.png",
        category: "education",
        date: "2026-03-04",
        readingTime: "6분",
        tags: ["서킷브레이커", "KOSPI", "폭락", "시장구조", "교육"],
        locale: "ko",
        isFeatured: true,
        content: `## 2026년 3월 4일, 14시 23분

KOSPI가 -8%를 터치한 순간, 첫 번째 서킷브레이커가 발동됩니다. 20분간 거래 정지. 모든 주문이 취소됩니다.

투자자들은 그 20분 동안 무엇을 했을까요? "침착하게 분석했다"고 답하고 싶지만, 현실은 달랐습니다.

## 거래 정지 중에 일어나는 일

학술 연구에 따르면, 서킷브레이커 발동 중 투자자 행동은 다음과 같습니다:

1. **뉴스 과다 소비**: 20분간 끊임없이 뉴스를 확인. 이미 공포에 빠진 상태에서 부정적 정보만 선택적으로 흡수
2. **매도 주문 준비**: "재개되면 바로 팔아야 한다"는 결심. 거래 정지가 '생각할 시간'이 아니라 '매도 준비 시간'
3. **사회적 공포 증폭**: 단톡방, 커뮤니티에서 공포가 전염. "다 팔았어?" "나도 팔아야 하나?"

그래서 거래 재개 후 매도 물량이 폭발하며, 두 번째 서킷브레이커까지 이어진 것입니다.

## 서킷브레이커의 설계 vs 현실

**설계 의도:**
- 과열된 감정에 냉각 시간 제공
- 비합리적 매도 방지
- 시장 안정화

**실제 효과:**
- 거래 재개 전 매도 주문 집중 → 재개 직후 급락
- "다음 서킷브레이커 전에 팔아야 한다"는 경쟁 → 매도 가속
- 유동성 소실 → 호가 갭 확대 → 더 큰 가격 변동

이것이 서킷브레이커의 역설입니다. 공포를 멈추려는 장치가 공포를 증폭합니다.

## 3월 4일의 특수성

이 날의 폭락은 더 특이했습니다. 같은 날:
- S&P 500: **+0.8%** (상승)
- BTC: **+6.5%** (급등)
- VIX: **하락** (글로벌 공포 감소)

전 세계가 올랐는데 한국만 무너졌습니다. 서킷브레이커가 필요한 수준의 공포가 한국 시장에만 존재했다는 뜻입니다.

원인은 구조적이었습니다:
- 3일 연속 휴장(주말 + 삼일절)으로 매도 진공
- 원유 100% 수입 의존 → 호르무즈 리스크 과대 반영
- 랠리 주간 레버리지 매수의 마진콜 연쇄

## 투자자가 배워야 할 것

서킷브레이커가 발동되면, 그것은 "시장이 위험하다"는 신호가 아닙니다. 그것은 **"시장 참여자들이 패닉 상태다"**는 신호입니다.

패닉 상태의 시장은 비합리적입니다. 비합리적 시장에서 비합리적 결정을 내리면, 결과는 예측 가능합니다 — 손실.

서킷브레이커일에 해야 할 일:
1. **아무것도 하지 않는다** — 패닉에서 내린 결정은 거의 항상 틀리다
2. **계획을 확인한다** — 사전에 세운 계획이 있다면, 그것을 따른다
3. **현금 비중을 점검한다** — 내일의 기회를 위해 현금이 있는가?

3월 4일에 패닉에 팔은 사람은 3월 5일의 +9.6% 반등을 놓쳤습니다.

*덜 잃고. 더 오래 버텨라.*`
    },
    {
        slug: "bounce-math-ko",
        title: "반등의 수학: +9.6%는 왜 충분하지 않은가",
        description: "-12% 후 +9.6% 반등. '거의 회복'이라고 느끼지만, 수학은 여전히 -3.6% 아래라고 말합니다.",
        excerpt: "-12% 폭락 후 +9.6% 반등. 감정은 회복을 느끼지만, 계좌 잔고는 여전히 마이너스. 왜?",
        image: "/images/blog/samsung-3month.png",
        category: "education",
        date: "2026-03-05",
        readingTime: "4분",
        tags: ["반등", "수학", "닻내림효과", "KOSPI", "리스크관리"],
        locale: "ko",
        content: `## 숫자가 말하는 것

2026년 3월 4일: KOSPI -12.06%
2026년 3월 5일: KOSPI +9.6%

뉴스는 "역사적 반등"이라고 보도합니다. +9.6%라는 숫자만 보면 거의 다 회복한 것 같습니다. 하지만 계산기를 켜보면:

> 100 × 0.88 = 88 (12% 하락 후)
> 88 × 1.096 = 96.45 (9.6% 반등 후)

**여전히 -3.55% 아래입니다.**

## 퍼센트 수학의 비대칭

이것이 투자에서 가장 중요하면서도 가장 간과되는 수학적 사실입니다:

| 손실 | 회복에 필요한 수익률 |
|------|---------------------|
| -5% | +5.3% |
| -10% | +11.1% |
| -20% | +25.0% |
| -30% | +42.9% |
| -50% | +100.0% |

12% 잃으면, 원래로 돌아가려면 12%가 아니라 **13.65%**가 필요합니다. 산술적으로 대칭이 아닙니다.

이것이 "덜 잃는 것이 더 버는 것보다 중요하다"는 말의 수학적 근거입니다.

## 닻내림 효과가 만드는 착각

우리의 뇌는 -12%라는 숫자에 닻을 내립니다. 그 극단을 기준점으로 삼기 때문에, +9.6%가 거대한 회복처럼 느껴집니다.

하지만 올바른 기준점은 폭락 전입니다:

- 7거래일 전 KOSPI: 6,307
- 반등 후 KOSPI: 5,584
- 실제 변화: **-11.5%**

"거의 회복"이 아니라 "아직 -11.5%"가 현실입니다.

## 드로우다운 컨트롤의 중요성

이 수학은 하나의 핵심 교훈으로 귀결됩니다: **드로우다운(최대 낙폭) 컨트롤이 수익률 추구보다 중요합니다.**

-12%를 -6%로 줄였다면, 회복에 +6.4%만 필요했습니다. 반등 날의 +9.6%로 이미 수익 구간이었을 것입니다.

어떻게 드로우다운을 줄이는가:
1. **포지션 사이징** — 전체 자산의 일정 비율만 투자
2. **손절 규칙** — 사전에 정한 손실 한도에서 자동 매도
3. **현금 비중** — 항상 일정 현금을 유지

## 결론

감정은 회복했습니다. 계좌는 아직입니다.

+9.6%는 뉴스에는 대문이지만, 계좌에는 여전히 빨간색입니다. 퍼센트 수학의 비대칭을 이해하는 것이 장기 투자의 첫 걸음입니다.

*덜 잃고. 더 오래 버텨라.*`
    },
    {
        slug: "korea-decoupling-ko",
        title: "한국 디커플링: 세계는 올랐는데 왜 한국만 폭락했나",
        description: "3월 4일, S&P +0.8%, BTC +6.5%인데 KOSPI -12%. 한국 시장의 구조적 취약점 분석.",
        excerpt: "세계가 오르는 날 한국만 -12% 폭락. 글로벌 위기가 아니라 한국 고유의 구조적 문제가 터진 것.",
        image: "/images/blog/btc-1month.png",
        category: "korean-market",
        date: "2026-03-04",
        readingTime: "5분",
        tags: ["디커플링", "KOSPI", "한국시장", "구조적리스크", "원유"],
        locale: "ko",
        content: `## 같은 날, 다른 세계

2026년 3월 4일의 스코어보드:

| 시장 | 변동 |
|------|------|
| KOSPI | **-12.06%** 🔥 |
| KOSDAQ | **-14.0%** |
| S&P 500 | **+0.8%** |
| BTC | **+6.5%** |
| VIX | **하락** |

세계 시장은 올랐습니다. 심지어 공포 지수(VIX)는 내렸습니다. 오직 한국만 무너졌습니다.

이것은 "글로벌 위기"가 아닙니다. 한국 시장 고유의 구조적 취약점이 동시에 폭발한 것입니다.

## 4가지 구조적 취약점

### 1. 원유 100% 수입 의존

한국은 원유를 한 방울도 생산하지 않습니다. 호르무즈 해협이 위협받는 순간, 한국 경제의 생명선이 위험해집니다.

같은 지정학 이벤트에 대해:
- 미국: 셰일오일 자급 → 영향 제한적
- 한국: 원유 100% 수입 → 경제 전체에 충격

### 2. 3일 연속 휴장의 매도 진공

2월 28일(토) → 3월 1일(일, 삼일절) → 3월 2일(월, 대체공휴일). 3일 연속 한국 시장은 닫혀 있었습니다.

그 사이 지정학 위기가 발생하고, 글로벌 시장은 반응했지만, 한국 투자자들은 아무것도 할 수 없었습니다. 3일간의 불안이 하루에 쏟아졌습니다.

### 3. 레버리지 마진콜 연쇄

2월 마지막 주는 축제였습니다. SK하이닉스 100만원 돌파, 삼성 +7%, KOSPI 역대 최고. 많은 개인 투자자들이 레버리지(신용매수)로 참여했습니다.

주가가 급락하면 신용매수 포지션에 마진콜이 발생합니다. 마진콜은 강제 매도를 의미합니다. 강제 매도가 주가를 더 내리고, 더 많은 마진콜을 촉발합니다. 악순환.

### 4. 외국인 자본 이탈

원화가 1,483원으로 폭락했습니다. 외국인 투자자에게 한국 자산의 달러 기준 가치가 급감한다는 뜻입니다. 이중 손실(주가 하락 + 환율 손실)을 피하기 위해 외국인이 대량 매도합니다.

## 디커플링이 말하는 것

세계가 오르는데 내 시장만 폭락하면, 문제는 순환적이 아니라 **구조적**입니다.

순환적 문제(글로벌 경기 둔화 등)는 시간이 해결합니다. 구조적 문제(에너지 의존, 시장 구조, 자본 이동)는 시간이 해결하지 않습니다.

## 투자자의 대응

한국 시장에 투자하면서 이 구조적 리스크를 무시할 수는 없습니다. 대응 방법:

1. **지역 분산**: 한국 비중을 전체 포트폴리오의 일부로 제한
2. **환율 리스크 인식**: 원화 약세 시나리오 항상 고려
3. **휴장 리스크**: 연휴 전 포지션 조정 또는 헤지
4. **레버리지 자제**: 신용매수 비중을 전체의 20% 이하로

*덜 잃고. 더 오래 버텨라.*`
    },
    {
        slug: "hormuz-risk-ko",
        title: "호르무즈 리스크: 원유 한 방울 안 나는 나라의 지정학적 취약점",
        description: "Operation Epic Fury와 호르무즈 해협 위기가 한국 시장에 미친 충격. 원유 100% 수입국의 지정학 리스크.",
        excerpt: "미-이 군사작전이 호르무즈 해협을 위협할 때, 원유를 한 방울도 생산하지 않는 한국은 가장 큰 타격을 받았다.",
        image: "/images/blog/gold-1month.png",
        category: "macro",
        date: "2026-02-28",
        readingTime: "5분",
        tags: ["호르무즈", "지정학", "원유", "매크로", "한국시장"],
        locale: "ko",
        content: `## 2월 28일, 토요일 새벽

한국 시장이 닫혀 있는 토요일 새벽, 뉴스가 터졌습니다. 미-이 연합의 이란 군사작전 "Operation Epic Fury". 호르무즈 해협의 지정학적 긴장이 급상승했습니다.

한국 투자자들은 아무것도 할 수 없었습니다. 시장은 닫혀 있었고, 다음 개장은 3월 3일(화요일). 꼬박 3일을 기다려야 했습니다.

## 왜 한국이 가장 취약한가

호르무즈 해협은 전 세계 원유 해상 운송의 약 21%가 통과하는 곳입니다. 한국에게 이 해협은 경제의 생명선입니다.

한국의 에너지 구조:
- 원유 생산량: **0** (제로)
- 원유 수입 의존도: **100%**
- 중동 원유 비중: **약 70%**
- 호르무즈 경유 비중: 중동 수입의 대부분

비교:
- 미국: 셰일혁명 이후 순수출국. 호르무즈 봉쇄 시 오히려 유가 상승 수혜
- 일본: 한국과 유사하나 전략비축유 비중이 높음
- 한국: 가장 취약. 대안 해상 루트 거의 없음

## 정상화 편향의 함정

이번 위기에서 가장 위험한 인지편향은 정상화 편향(Normalcy Bias)이었습니다.

"설마 호르무즈가 진짜 봉쇄되겠어?"
"전에도 이런 적 있었는데 아무 일 없었잖아."
"미국이 알아서 하겠지."

정상화 편향은 이전에 일어나지 않은 일은 앞으로도 일어나지 않을 거라는 착각입니다. 하지만 2026년의 지정학적 환경은 이전과 달랐습니다.

## 시장의 반응: 3일간의 기록

| 날짜 | BTC | 금 | S&P | 한국 |
|------|-----|-----|-----|------|
| 2/28(토) | +1.7% | 보합 | 휴장 | 휴장 |
| 3/1(일) | -1.9% | — | 휴장 | 휴장 |
| 3/2(월) | +4.6% | +1.2% | -0.1% | 휴장(대체공휴일) |
| 3/3(화) | — | — | — | **-7.2%** 개장 |

크립토(24/7 거래)가 가장 먼저 반응했고, 금이 따랐으며, 미국 시장은 상대적으로 침착했습니다. 한국은 3일 후 열렸을 때 모든 충격을 한 번에 흡수해야 했습니다.

## 교훈

1. **지정학 리스크는 확률이 아니라 영향으로 평가해야 한다** — 발생 확률이 낮아도 영향이 치명적이면 대비가 필요
2. **휴장 리스크를 과소평가하지 말라** — 연휴 전 포지션 점검은 필수
3. **한국 투자 = 호르무즈 리스크 내재** — 한국 주식에 투자한다는 것은 간접적으로 호르무즈의 안전에 베팅하는 것

*덜 잃고. 더 오래 버텨라.*`
    },
    {
        slug: "cognitive-bias-guide-ko",
        title: "투자자의 인지편향 가이드: 한 주간 6가지 편향이 계좌를 파괴한 방법",
        description: "2026년 2월 마지막 주~3월 첫 주. 모멘텀편향→FOMO→처분효과→정상화편향→군집행동→닻내림. 실전 사례 분석.",
        excerpt: "한 주간 시장에서 작동한 6가지 인지편향을 실제 사례로 분석. 당신의 계좌를 파괴하는 것은 시장이 아니라 당신의 뇌.",
        image: "/api/og?title=인지편향 투자 가이드",
        category: "cognitive-bias",
        date: "2026-03-06",
        readingTime: "7분",
        tags: ["인지편향", "행동경제학", "FOMO", "군집행동", "투자심리"],
        locale: "ko",
        isFeatured: true,
        content: `## 당신의 적은 시장이 아니다

2026년 2월 24일 ~ 3월 5일. 단 10거래일 동안 한국 시장은 역대급 랠리와 역대급 폭락을 모두 경험했습니다. 이 기간 투자자들의 계좌를 파괴한 것은 시장 자체가 아니라, 투자자들 자신의 뇌에 내장된 인지편향이었습니다.

## 1. 모멘텀 편향 (2월 24일)

KOSPI +2.1%, 4연속 상승. "오르고 있으니 계속 오를 것이다."

모멘텀 편향은 최근의 추세가 계속될 거라 믿는 경향입니다. 4일 연속 상승을 본 투자자들은 추세가 영원할 것처럼 행동했습니다.

**실전**: 이 날 매수한 사람 중 다수가 2주 후 -20% 이상 손실.

## 2. FOMO (2월 26일)

SK하이닉스 100만원 돌파. "나만 못 사고 있다!"

남들이 돈 벌고 있다는 느낌은 돈을 잃는 것보다 더 고통스럽습니다. 100만원이라는 심리적 돌파가 트리거가 되어, 마지막 매수자들이 몰렸습니다.

**실전**: 100만원 돌파일 매수 → 6거래일 후 -23%. FOMO의 정확한 대가.

## 3. 처분효과 (2월 27일)

첫 번째 하락 -1.0%. "이익난 건 빨리 팔고, 손실난 건 버텨보자."

처분효과는 이익은 빨리 실현하고 손실은 오래 버티는 편향입니다. 2월 27일, 이익 중인 포지션만 팔고 손실 중인 포지션은 유지한 투자자들이 많았습니다.

**실전**: 이익 실현한 종목은 이후 더 올랐고, 손실 버틴 종목은 더 떨어졌습니다.

## 4. 정상화 편향 (2월 28일~3월 2일)

지정학 위기 발생. "설마 진짜 문제가 되겠어?"

정상화 편향은 "이전에 큰 일이 없었으니 이번에도 없을 것"이라는 착각입니다. 호르무즈 위기가 터졌지만, 많은 투자자들이 과거 경험에 기대어 위험을 무시했습니다.

**실전**: 3월 3일 개장 시 -7.2% 갭다운. 대비하지 않은 자의 충격.

## 5. 군집행동 (3월 4일)

KOSPI -12.06%. "다들 팔고 있다. 나도 팔아야 한다!"

군집행동은 폭락에서 가장 파괴적입니다. "다들 팔고 있다"는 말은 자기 실현적 예언이 됩니다. 기관 매도 → 개인 마진콜 → 추가 매도의 악순환.

**실전**: 이 날 패닉에 매도한 투자자는 다음 날의 +9.6% 반등을 놓쳤습니다.

## 6. 닻내림 효과 (3월 5일)

KOSPI +9.6% 반등. "거의 다 회복했다!"

-12%를 본 뇌는 그 극단에 닻을 내립니다. +9.6%가 거대한 회복처럼 느껴지지만, 수학적으로 여전히 -3.6% 아래입니다.

**실전**: "회복했다"고 느끼며 추가 매수한 투자자들. 하지만 계좌 잔고는 여전히 마이너스.

## 어떻게 대응하는가

인지편향은 제거할 수 없습니다. 인간의 뇌에 내장되어 있으니까요. 하지만 **인식**할 수 있습니다.

1. **사전 계획**: 매수/매도 기준을 미리 정해두기
2. **체크리스트**: 거래 전 "이 결정이 편향에 의한 것은 아닌가?" 점검
3. **냉각 기간**: 충동적 결정 전 최소 1시간 대기
4. **기록**: 모든 거래의 이유를 기록하고, 나중에 복기

*덜 잃고. 더 오래 버텨라.*`
    },

    // ─── EN Blog Posts ─────────────────────────────────────────
    {
        slug: "fomo-math-en",
        title: "The Math of FOMO: What Happened to Everyone Who Bought SK Hynix at 1 Million Won",
        description: "SK Hynix broke through 1 million won. Everyone bought. 6 trading days later: -23%. The mathematics of FOMO.",
        excerpt: "Everyone who bought SK Hynix on its million-won breakthrough saw -23% in 6 trading days. Why does FOMO always peak at the top?",
        image: "/images/blog/sk-hynix-3month.png",
        category: "cognitive-bias",
        date: "2026-03-01",
        readingTime: "5 min",
        tags: ["FOMO", "SK-Hynix", "cognitive-bias", "HBM4", "semiconductors"],
        locale: "en",
        isFeatured: true,
        content: `## The Magic of 1 Million Won

February 26, 2026. SK Hynix closed at 1,099,000 won — a historic breakthrough above the million-won threshold. News outlets celebrated. Analyst reports raised price targets. Forums overflowed with posts saying "it's not too late."

Exactly 6 trading days later, SK Hynix was at 849,000 won. **Down 23%.**

## FOMO Is Strongest at the Top

FOMO (Fear Of Missing Out) is a peculiar bias. It doesn't activate when prices are falling. It only hijacks our brain when prices are rising — and rising fast.

Consider the psychology behind the million-won number:

- **Anchoring**: From 6 digits to 7 digits. "This is a different league now."
- **Social proof**: "Everyone is buying." Individual net purchases hit record levels that week.
- **Regret aversion**: "If I don't buy now, I'll miss it forever."

But the data tells a different story. Within 30 days of breaking psychological price milestones, **68% of stocks gave back at least half their breakthrough-day gains.**

## The Math Doesn't Lie

If you bought at 1,099,000 won and it fell to 849,000 won, how much does the stock need to rise for you to break even?

> (1,099,000 - 849,000) / 849,000 = **+29.4%**

That's right. Lose 23%, and you need a 29.4% gain just to get back to zero. This is the asymmetry of percentage math.

This is the real reason FOMO is dangerous. When you buy at the top, recovery math works against you.

## When Should You Have Bought?

The answer is simple: **when nobody was talking about it.**

On February 24, SK Hynix was at 1,005,000 won — news existed but no celebration. On February 20, at 950,000 won — the HBM4 theme had already started, but the "million-won breakthrough" narrative didn't exist yet.

The opposite of FOMO is preparation. Research when the market is quiet. Set a buy plan. Wait.

## Lessons

1. **Psychological price breakthroughs are not buy signals** — they're FOMO alarms
2. **"Everyone is buying" is closer to a sell signal** — the last buyers are entering
3. **Percentage math is asymmetric** — large losses require even larger recoveries
4. **The best buys happen on boring days** — driven by analysis, not excitement

*Lose less. Last longer.*`
    },
    {
        slug: "circuit-breaker-paradox-en",
        title: "The Circuit Breaker Paradox: Why a Device Designed to Stop Panic Actually Amplifies It",
        description: "March 4, 2026: KOSPI -12.06%, circuit breaker triggered twice. How trading halts create a race to sell.",
        excerpt: "Circuit breakers are designed to stop fear. But on March 4th, two trading halts made the panic worse. Here's why.",
        image: "/images/blog/kospi-year.png",
        category: "education",
        date: "2026-03-04",
        readingTime: "6 min",
        tags: ["circuit-breaker", "KOSPI", "crash", "market-structure", "education"],
        locale: "en",
        isFeatured: true,
        content: `## March 4, 2026, 2:23 PM KST

The moment KOSPI touched -8%, the first circuit breaker was triggered. Trading halted for 20 minutes. All orders cancelled.

What did investors do during those 20 minutes? We'd like to say "calmly analyzed the situation." Reality was different.

## What Happens During a Trading Halt

Academic research shows that investor behavior during circuit breaker halts follows a predictable pattern:

1. **News overconsumption**: 20 minutes of obsessive news checking. Already in a fearful state, investors selectively absorb only negative information.
2. **Sell order preparation**: "I need to sell the moment trading resumes." The halt becomes not "thinking time" but "sell preparation time."
3. **Social fear amplification**: Group chats, forums, and communities become echo chambers of panic. "Did you sell?" "Should I sell too?"

The result: a wave of sell orders the moment trading resumes, driving the market down to the second circuit breaker.

## Design vs. Reality

**Design Intent:**
- Provide a cooling period for overheated emotions
- Prevent irrational selling
- Stabilize markets

**Actual Effect:**
- Concentrated sell orders before and after the halt → immediate post-resumption crash
- "Must sell before the next halt" creates a race → accelerated selling
- Liquidity evaporates → wider bid-ask spreads → larger price swings

This is the circuit breaker paradox. A device designed to stop panic amplifies it.

## What Made March 4th Unique

The crash had an unusual feature. On the same day:
- S&P 500: **+0.8%** (up)
- BTC: **+6.5%** (surging)
- VIX: **down** (global fear decreasing)

The entire world went up while Korea collapsed. Circuit-breaker-level panic existed only in the Korean market.

The causes were structural:
- 3 consecutive days of market closure (weekend + national holiday) created a selling vacuum
- 100% oil import dependence amplified Hormuz Strait risk
- Leveraged retail positions from the rally week triggered cascading margin calls
- Foreign capital flight as the won crashed to 1,483

## What Investors Should Learn

When a circuit breaker triggers, it's not a signal that "the market is dangerous." It's a signal that **"market participants are in a state of panic."**

A panicked market is irrational. Making irrational decisions in an irrational market leads to predictable outcomes — losses.

What to do on a circuit breaker day:
1. **Do nothing** — decisions made in panic are almost always wrong
2. **Check your plan** — if you had a pre-made plan, follow it
3. **Check your cash** — do you have cash for tomorrow's opportunity?

Those who panic-sold on March 4th missed the +9.6% bounce on March 5th.

*Lose less. Last longer.*`
    },
    {
        slug: "bounce-math-en",
        title: "The Math of Bounces: Why +9.6% Isn't Enough",
        description: "After -12%, a +9.6% bounce feels like recovery. But math says you're still -3.6% underwater.",
        excerpt: "A -12% crash followed by a +9.6% bounce. Emotions feel recovered. The account hasn't. Here's the math.",
        image: "/images/blog/samsung-3month.png",
        category: "education",
        date: "2026-03-05",
        readingTime: "4 min",
        tags: ["bounce", "math", "anchoring", "KOSPI", "risk-management"],
        locale: "en",
        content: `## What the Numbers Say

March 4, 2026: KOSPI -12.06%
March 5, 2026: KOSPI +9.6%

Headlines read "historic bounce." Looking at +9.6% alone, it seems like nearly full recovery. But open a calculator:

> 100 × 0.88 = 88 (after 12% loss)
> 88 × 1.096 = 96.45 (after 9.6% bounce)

**Still 3.55% below where you started.**

## The Asymmetry of Percentage Math

This is the most important — and most overlooked — mathematical fact in investing:

| Loss | Recovery Needed |
|------|-----------------|
| -5% | +5.3% |
| -10% | +11.1% |
| -20% | +25.0% |
| -30% | +42.9% |
| -50% | +100.0% |

Lose 12%, and you need **+13.65%** to recover — not 12%. It's arithmetically asymmetric.

This is the mathematical proof behind "losing less matters more than gaining more."

## The Anchoring Illusion

Our brains anchor to the -12% extreme. Using that as the reference point, +9.6% feels like a massive recovery.

But the correct reference point is pre-crash:

- KOSPI 7 trading days ago: 6,307
- KOSPI after bounce: 5,584
- Actual change: **-11.5%**

Not "nearly recovered." Still "-11.5%" is the reality.

## Why Drawdown Control Matters More Than Returns

This math leads to one core lesson: **drawdown control matters more than return chasing.**

If you had limited the drop to -6% instead of -12%, you would have needed only +6.4% to recover. The bounce day's +9.6% would have already put you in profit.

How to control drawdowns:
1. **Position sizing** — invest only a fixed percentage of total assets
2. **Stop-loss rules** — automatic sell at pre-defined loss limits
3. **Cash allocation** — always maintain a cash cushion

## Conclusion

Emotions recovered. The account hasn't.

+9.6% makes headlines, but your account is still red. Understanding percentage math asymmetry is the first step toward long-term investing.

*Lose less. Last longer.*`
    },
    {
        slug: "korea-decoupling-en",
        title: "Korea Decoupling: Why Korea Crashed While the World Went Up",
        description: "March 4: S&P +0.8%, BTC +6.5%, but KOSPI -12%. Analyzing Korea's structural market vulnerabilities.",
        excerpt: "The world went up while Korea crashed -12%. Not a global crisis — Korea's structural vulnerabilities exploding.",
        image: "/images/blog/btc-1month.png",
        category: "korean-market",
        date: "2026-03-04",
        readingTime: "5 min",
        tags: ["decoupling", "KOSPI", "Korean-market", "structural-risk", "oil"],
        locale: "en",
        content: `## Same Day, Different Worlds

March 4, 2026 scoreboard:

| Market | Change |
|--------|--------|
| KOSPI | **-12.06%** 🔥 |
| KOSDAQ | **-14.0%** |
| S&P 500 | **+0.8%** |
| BTC | **+6.5%** |
| VIX | **Down** |

World markets went up. The fear index (VIX) actually fell. Only Korea collapsed.

This was not a "global crisis." It was Korea's structural vulnerabilities exploding simultaneously.

## Four Structural Vulnerabilities

### 1. 100% Oil Import Dependence

Korea produces zero barrels of oil. The moment Hormuz Strait security is threatened, Korea's economic lifeline is at risk.

For the same geopolitical event:
- US: Shale oil self-sufficient → limited impact
- Korea: 100% oil import dependent → economy-wide shock

### 2. The 3-Day Closure Selling Vacuum

Feb 28 (Sat) → Mar 1 (Sun, Independence Movement Day) → Mar 2 (Mon, Substitute Holiday). Three consecutive days of market closure.

During this time, a geopolitical crisis erupted and global markets reacted, but Korean investors couldn't do anything. Three days of anxiety compressed into one trading session.

### 3. Leveraged Margin Call Cascade

The last week of February was euphoric. SK Hynix breaking 1 million won, Samsung +7%, KOSPI at all-time highs. Many retail investors participated with leverage (margin buying).

When prices plunge, margin positions trigger forced selling. Forced selling pushes prices lower, triggering more margin calls. A doom loop.

### 4. Foreign Capital Flight

The won crashed to 1,483 per dollar. For foreign investors, the dollar value of Korean assets plummeted. To avoid double losses (price decline + currency loss), foreign investors sold aggressively.

## What Decoupling Tells Us

When the world goes up but your market alone crashes, the problem isn't cyclical — it's **structural.**

Cyclical problems (global slowdown, etc.) resolve with time. Structural problems (energy dependence, market structure, capital flows) don't.

## The Investor's Response

You can't invest in Korea while ignoring these structural risks. Response strategies:

1. **Geographic diversification**: Limit Korea to a portion of total portfolio
2. **Currency risk awareness**: Always consider won-weakening scenarios
3. **Holiday risk**: Adjust positions or hedge before long weekends
4. **Leverage restraint**: Keep margin below 20% of total exposure

*Lose less. Last longer.*`
    },
    {
        slug: "hormuz-risk-en",
        title: "Hormuz Risk: The Geopolitical Vulnerability of a Country That Produces Zero Oil",
        description: "Operation Epic Fury and the Hormuz Strait crisis hit Korea hardest. Analyzing the geopolitical risks of 100% oil import dependence.",
        excerpt: "When US-Israel strikes threatened the Hormuz Strait, Korea — which produces zero oil — took the biggest market hit.",
        image: "/images/blog/gold-1month.png",
        category: "macro",
        date: "2026-02-28",
        readingTime: "5 min",
        tags: ["Hormuz", "geopolitics", "oil", "macro", "Korean-market"],
        locale: "en",
        content: `## Saturday, February 28, Predawn

While the Korean market was closed for the weekend, news broke. A US-Israel joint operation against Iran — "Operation Epic Fury." Geopolitical tensions around the Hormuz Strait surged.

Korean investors could do nothing. The market was closed, and wouldn't reopen until Tuesday, March 3rd. Three full days of waiting.

## Why Korea Is Most Vulnerable

The Hormuz Strait carries roughly 21% of global seaborne oil transport. For Korea, this strait is an economic lifeline.

Korea's energy profile:
- Domestic oil production: **Zero**
- Oil import dependence: **100%**
- Middle East oil share: **~70%**
- Hormuz transit share: Majority of Middle East imports

Comparison:
- US: Net exporter since the shale revolution. Actually benefits from oil price spikes.
- Japan: Similar dependency but larger strategic petroleum reserves.
- Korea: Most vulnerable. Almost no alternative shipping routes.

## The Normalcy Bias Trap

The most dangerous cognitive bias during this crisis was normalcy bias.

"Surely Hormuz won't actually be blocked?"
"We've had scares like this before and nothing happened."
"The US will handle it."

Normalcy bias is the belief that because something hasn't happened before, it won't happen now. But the 2026 geopolitical environment was fundamentally different from previous precedents.

## Market Response: A 3-Day Record

| Date | BTC | Gold | S&P | Korea |
|------|-----|------|-----|-------|
| 2/28 (Sat) | +1.7% | Flat | Closed | Closed |
| 3/1 (Sun) | -1.9% | — | Closed | Closed |
| 3/2 (Mon) | +4.6% | +1.2% | -0.1% | Closed (holiday) |
| 3/3 (Tue) | — | — | — | **-7.2%** at open |

Crypto (24/7 trading) reacted first, gold followed, and US markets remained relatively calm. Korea, opening 3 days later, had to absorb all shocks at once.

## Lessons

1. **Evaluate geopolitical risk by impact, not probability** — low probability but catastrophic impact still demands preparation
2. **Don't underestimate closure risk** — pre-holiday position review is essential
3. **Investing in Korea = inheriting Hormuz risk** — buying Korean stocks is an indirect bet on Hormuz Strait security

*Lose less. Last longer.*`
    },
    {
        slug: "cognitive-bias-guide-en",
        title: "The Investor's Cognitive Bias Guide: How 6 Biases Destroyed Portfolios in One Week",
        description: "Feb-Mar 2026: Momentum bias → FOMO → Disposition effect → Normalcy bias → Herding → Anchoring. Real-world case studies.",
        excerpt: "6 cognitive biases that played out in real-time over 10 trading days. It's not the market that destroys your portfolio — it's your brain.",
        image: "/api/og?title=Cognitive Bias Guide",
        category: "cognitive-bias",
        date: "2026-03-06",
        readingTime: "7 min",
        tags: ["cognitive-bias", "behavioral-economics", "FOMO", "herding", "investing-psychology"],
        locale: "en",
        isFeatured: true,
        content: `## Your Enemy Isn't the Market

February 24 to March 5, 2026. In just 10 trading days, the Korean market experienced both a record-breaking rally and a record-breaking crash. What destroyed investor portfolios wasn't the market itself — it was the cognitive biases hardwired into investors' own brains.

## 1. Momentum Bias (February 24)

KOSPI +2.1%, four consecutive days of gains. "It's going up, so it will keep going up."

Momentum bias is the tendency to believe recent trends will continue. After 4 straight days of gains, investors acted as if the trend would last forever.

**In practice**: Many who bought this day saw -20%+ losses within two weeks.

## 2. FOMO (February 26)

SK Hynix breaks 1 million won. "I'm the only one not buying!"

The feeling that others are making money hurts more than actually losing money. The psychological breakthrough of 1 million won triggered the last wave of buyers.

**In practice**: Bought at the million-won breakthrough → -23% within 6 trading days. The exact cost of FOMO.

## 3. Disposition Effect (February 27)

First pullback, -1.0%. "Sell winners quickly, hold losers longer."

The disposition effect is the bias toward realizing gains early and holding losses too long. On Feb 27, many investors sold winning positions while keeping losing ones.

**In practice**: Sold winners went on to rise further. Held losers fell further.

## 4. Normalcy Bias (February 28 - March 2)

Geopolitical crisis erupts. "Surely this won't be a real problem?"

Normalcy bias is the belief that because extreme events haven't happened before, they won't happen now. The Hormuz crisis emerged, but many investors relied on past experience and dismissed the risk.

**In practice**: March 3 open at -7.2% gap down. The cost of not preparing.

## 5. Herding (March 4)

KOSPI -12.06%. "Everyone is selling. I need to sell too!"

Herding is the most destructive bias in a crash. "Everyone is selling" becomes a self-fulfilling prophecy. Institutional selling → retail margin calls → more selling — a doom loop.

**In practice**: Those who panic-sold this day missed the next day's +9.6% bounce.

## 6. Anchoring (March 5)

KOSPI +9.6% bounce. "Almost fully recovered!"

After seeing -12%, our brains anchor to that extreme. +9.6% feels like a massive recovery, but mathematically we're still -3.6% below pre-crash.

**In practice**: Investors who felt "recovered" and bought more. But account balances were still negative.

## How to Fight Back

Cognitive biases cannot be eliminated. They're hardwired into the human brain. But they can be **recognized.**

1. **Pre-made plans**: Set buy/sell criteria before you need them
2. **Checklists**: Before every trade, ask "Is this decision driven by a bias?"
3. **Cooling periods**: Wait at least 1 hour before any impulsive decision
4. **Journaling**: Record the reasoning behind every trade, review later

*Lose less. Last longer.*`
    },
];

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

export const categoryLabelsEN: Record<string, string> = {
    "market-analysis": "Market Analysis",
    "education": "Education",
    "macro": "Macro & Flows",
    "risk-management": "Risk Management",
    "cognitive-bias": "Cognitive Biases",
    "korean-market": "Korean Market",
    analysis: "Market Analysis",
    strategy: "Trading Strategy",
    news: "News Translation",
};
