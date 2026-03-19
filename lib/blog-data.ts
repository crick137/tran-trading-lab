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
    // ─── 2026-03-13 사회초년생 투자 원칙 ─────────────────────────
    {
        slug: "investment-rules-for-beginners",
        title: "사회초년생을 위한 투자 원칙 8가지 — 적금만 하던 내가 배운 것들",
        description: "월급 받기 시작한 사회초년생이 꼭 알아야 할 투자 원칙 8가지. ETF 정기매수, 자산배분, 비상금 확보까지.",
        excerpt: "적금만 하다 3년 날린 내가 직접 부딪히며 배운 투자 원칙 8가지. 월급날마다 꺼내서 대조하라.",
        image: "/images/blog/spy-monthly.jpg",
        category: "education",
        date: "2026-03-13",
        readingTime: "7분",
        tags: ["투자원칙", "사회초년생", "ETF", "자산배분", "정기매수", "주린이"],
        locale: "ko",
        isFeatured: true,
        content: `## 적금만 하던 내가 배운 것들

월급 받기 시작한 사회초년생들 주목.

나도 처음엔 적금만 했음. 솔직히 투자가 무서웠거든.
근데 3년 지나고 보니까 적금 이자로는 물가도 못 따라감.
직접 부딪히면서 배운 투자 원칙 8가지를 정리함.

## 1. 월급 들어오면 먼저 떼어놔라

남는 돈으로 투자하겠다? 남는 돈은 없음.
월급일에 자동이체 걸어서 최소 10% 먼저 빼.

월급 300만원이면 30만원을 월급일 당일에 투자 계좌로 자동이체 걸어놔. "이번 달은 쓸 데가 많아서..." 이러면 영원히 못 시작함. 강제 저축이 습관이 되면 나머지 90%로 생활하는 게 자연스러워짐.

## 2. 비상금 3개월치는 절대 투자하지 마라

직장 잘리거나, 아프거나, 차 고장나면?
생활비 3개월치는 CMA나 파킹통장에 묶어놔.
이거 없이 투자하면 급할 때 손해 보고 팔게 됨.

비상금이 없으면 투자한 주식을 손절해서 생활비를 만들어야 되는 상황이 옴. 그게 보통 시장이 가장 안 좋을 때임. 최악의 타이밍에 파는 거. 비상금 = 투자를 지키는 보험이라고 생각하면 됨.

## 3. 첫 투자는 미국 지수 ETF 정기매수

VOO(S&P500) 또는 QQQ(나스닥100).
매달 정해진 날짜에 정해진 금액만큼 사.
타이밍 잡으려 하지 마. 그건 신의 영역임.

S&P500은 지난 30년간 연평균 약 10%의 수익률을 기록해왔음. 개별 종목은 고를 수 있는 사람이 따로 있는데, 초보가 그걸 하면 거의 잃음. 정기매수는 시장이 올라도 사고, 내려도 사기 때문에 평균 매입가가 자연스럽게 낮아짐.

## 4. 수수료 비싼 상품은 피해라

펀드 수수료 1%면 별거 아닌 것 같지?
30년 복리로 계산하면 수익의 25%가 날아감.
ETF 수수료 0.03~0.1% vs 펀드 1~2%. 답 나옴.

월 30만원을 30년간 연 8% 수익률로 투자하면:
- ETF (수수료 0.03%): 최종 약 4억 4천만원
- 액티브 펀드 (수수료 1.5%): 최종 약 3억 3천만원
- 차이: 약 1억 800만원이 수수료로 증발

1%의 차이가 30년이면 1억이 됨.

## 5. 계란을 한 바구니에 담지 마라

주식 100%는 위험함.
미국 지수 60% + 채권 ETF 20% + 금 ETF 10% + 현금 10%.
지루하지만 이게 살아남는 방법임.

2022년처럼 주식이 -20% 빠질 때 채권과 금이 방어 역할을 해줌. 전체 포트폴리오 낙폭이 줄어드니까 멘탈이 버텨지고, 멘탈이 버텨야 손절을 안 함. 화려한 수익률보다 중요한 건 시장에서 퇴장당하지 않는 것임.

월 30만원 기준 구체적 배분:
- VOO(미국지수): 18만원/월
- TLT 또는 채권 ETF: 6만원/월
- GLD 또는 금 ETF: 3만원/월
- 비상금/현금: 3만원/월 → CMA에 적립

## 6. 비트코인? 포트폴리오의 5% 이하로

블랙록도 모델 포트폴리오에 BTC 1~2% 넣음.
변동성 크니까 잃어도 멘탈 안 흔들릴 금액만.
근데 10년 뒤에 이걸 안 샀다고 후회할 수도 있음.

비트코인은 2024년 현물 ETF 승인 이후 기관 자산으로 편입되고 있음. 하지만 여전히 60% 이상 하락할 수 있는 자산임. 포트폴리오의 5% 이하로 배분하면 빠져도 전체에 큰 충격이 없고, 올라가면 보너스임.

## 7. 매일 차트 보지 마라

진짜로. 확인 많이 할수록 손실 구간에서 팔 확률 올라감.
정기매수 걸어놓고 한 달에 한 번만 봐.

행동경제학에서 이걸 '근시안적 손실 회피'라고 부름. 확인 빈도가 높을수록 손실을 볼 확률이 체감으로 커지고, 참을 수 없어서 팔게 됨. 분기 또는 반기에 한 번 리밸런싱하는 것만으로 충분함.

## 8. 지금 시작해라. 지금이 제일 빠름.

"좀 더 공부하고..." "시장 안 좋으니까..."
이러다 3년 지남. 나도 그랬음.
매달 10만원이라도 지금 시작하면 5년 뒤 달라짐.

완벽한 타이밍은 없음. 2020년 코로나 폭락 때도 "더 빠진다"고 기다린 사람이 있었고, 그때 그냥 시작한 사람은 3년 뒤 +80% 이상 수익을 보고 있음. 시작하지 않는 것이 가장 큰 리스크임.

## 시작 전 체크리스트

| 단계 | 할 일 | 기한 |
|------|--------|------|
| 1일차 | 증권사 계좌 개설 (토스증권 추천) | 오늘 |
| 2일차 | CMA 계좌 개설 + 비상금 3개월치 계산 | 내일 |
| 3일차 | 해외주식 자동매수 설정 (VOO, 매월 15일) | 이번 주 |
| 1주차 | 비상금 부족분 파악 → 매월 적립 계획 | 다음 주 |
| 2주차 | 채권+금 ETF 추가 매수 설정 | 2주 내 |
| 1개월차 | 전체 포트폴리오 1회 점검 | 한 달 뒤 |

---

저장하고 월급날에 대조하라.

틀릴 수도 있는데, 이 8개 중에 하나도 안 하고 있으면 그건 진짜 위험한 거임.

*덜 잃고. 더 오래 버텨라.*`
    },
    // ─── 2026-03-14 하락장 생존 체크리스트 (S+ 41K views) ─────────
    {
        slug: "bear-market-survival-checklist-ko",
        title: "하락장 생존 체크리스트 10가지 — 이 10개 중에 하나도 안 하고 있으면 그건 투자가 아니라 도박이다",
        description: "공포탐욕지수 19.9, 7개 지표 전부 공포. 하락장에서 돈 잃는 사람은 패턴이 똑같다. 이 10가지 체크리스트로 점검하라.",
        excerpt: "공포탐욕지수 19.9. 극단적 공포. 이런 날 계좌를 지키는 건 감이 아니라 규칙이다.",
        image: "/images/blog/bear-market-checklist.jpg",
        category: "risk-management",
        date: "2026-03-14",
        readingTime: "5분",
        tags: ["하락장", "체크리스트", "공포탐욕지수", "리스크관리", "손절", "주린이"],
        locale: "ko",
        isFeatured: true,
        content: `## 하락장에서 돈 잃는 사람은 패턴이 똑같다

"공포에 사라"를 믿고 물타기 하거나
"더 빠지기 전에"라며 바닥에서 던지거나.

공포탐욕지수 19.9. 7개 지표 전부 공포.
이런 날 계좌를 지키는 건 감이 아니라 규칙이다.

## 하락장 생존 체크리스트 10가지

### 1. 손절 마지노선은 -7%. -20%까지 버티면 회복에 +25% 필요하다.
매수할 때 이미 정해놔야 함. "좀 더 기다려볼까"가 -7%를 -20%로 만듦. 수학적으로 -20% 손실은 +25% 수익이 필요함. -50%면 +100%가 필요함. 일찍 끊는 게 수학적으로 유리함.

### 2. 한 종목에 자산의 20% 이상 넣지 마라.
"이건 확신 있으니까" — 그 확신이 깨질 때 인생이 같이 깨짐. 분산이 지루한 건 맞지만, 그 지루함이 계좌를 살림.

### 3. 현금비중 최소 30% 유지.
상승장에서 현금 들고 있으면 나만 뒤처지는 느낌이라 더 힘든데, 그게 결국 하락장에서 살아남는 차이를 만들더라고요. 현금이 없으면 기회가 와도 못 삼.

### 4. 레버리지 쓰고 있으면 지금 당장 줄여라.
레버리지가 심리까지 무너뜨리는 게 진짜 무서운 부분이죠. 청산 → 패닉 → 추가 청산 구조는 한번 시작되면 멈추기가 어렵고요. 결국 생존이 수익보다 먼저입니다.

### 5. 반등 오면 물량 줄여라. 반등 = 탈출 기회지 추매 기회가 아니다.
하락장의 반등은 보통 데드캣 바운스. 트레이더들의 숏커버링이거나 기술적 반등일 뿐. 진짜 바닥은 "아무도 관심 없을 때" 옴. 반등에서 물량 줄이는 건 리스크 관리.

### 6. 매일 차트 보지 마라. 확인 빈도가 높을수록 손실 회피 편향에 당한다.
행동경제학에서 이걸 '근시안적 손실 회피'라고 부름. 확인 빈도가 높을수록 손실을 볼 확률이 체감으로 커지고, 참을 수 없어서 팔게 됨.

### 7. "이번엔 다를 거야"라는 생각이 들면 그게 제일 위험한 신호.
모든 버블과 폭락에서 등장하는 4글자: "이번은 다르다." 역사적으로 이 말이 맞았던 적이 없음.

### 8. 이번엔 다르다고 생각하면 틀렸다. 시장은 항상 회복했다. 문제는 당신이 그때까지 버틸 수 있느냐.
5번은 단기 대응이고 8번은 장기 마인드. 반등에서 물량 줄이는 건 리스크 관리고, 결국 시장은 회복한다는 건 큰 그림 얘기. 시간축이 다름.

### 9. 공포에 사라? 맞는 말이지만 "어디서"가 빠졌다. 지지선 확인 없이 사면 물타기일 뿐.
"Buy the fear"는 원칙이지 전략이 아님. 구체적인 진입 근거(지지선, 거래량 확인, 기술적 반전 신호) 없이 사면 그냥 떨어지는 칼날 잡기.

### 10. 지금 멘탈이 흔들리면 거래하지 마라. 최악의 매매는 감정이 만든다.
공포 상태에서 내리는 결정은 거의 다 틀림. 멘탈이 흔들릴 때 가장 좋은 매매는 "아무것도 안 하는 것". 화면 끄고 산책 다녀와.

---

저장하고 대조하라.

이 10개 중에 하나도 안 하고 있으면
그건 투자가 아니라 도박이다.

*덜 잃고. 더 오래 버텨라.*`
    },
    // ─── 2026-03-06 단타 매매 철칙 (S+ 90K views, 1193 bookmarks) ─────────
    {
        slug: "day-trading-rules-ko",
        title: "단타 매매 철칙 — 90K 조회, 1,193명이 저장한 단타 체크리스트",
        description: "단타 매매 전에 이 체크리스트를 먼저 확인하라. 진입 전, 진입 중, 청산 후 각 단계별 철칙.",
        excerpt: "단타는 감으로 하는 게 아니다. 규칙으로 하는 거다. 1,193명이 저장한 체크리스트.",
        image: "/images/blog/day-trading-rules.jpg",
        category: "strategy",
        date: "2026-03-06",
        readingTime: "8분",
        tags: ["단타", "매매철칙", "체크리스트", "리스크관리", "진입", "청산"],
        locale: "ko",
        isFeatured: true,
        content: `## 단타는 감이 아니라 규칙이다

"감이 좋아서 샀어요" — 이 말 하는 사람 치고 계좌 플러스인 사람 거의 못 봤음.

단타는 속도의 게임이 아니라 규율의 게임. 매매 전에 규칙을 세우고, 규칙대로 실행하고, 규칙을 어겼으면 복기하는 것. 이게 전부임.

## 진입 전 체크리스트

- 오늘의 추세는? (상승/하락/횡보)
- 핵심 지지/저항선 표시했는가?
- 진입 근거가 2개 이상인가? (1개면 안 함)
- 손절 라인을 먼저 정했는가?
- 목표가를 정했는가?
- 포지션 사이즈는 계좌의 2% 이내인가?
- 중요 뉴스/이벤트 일정을 확인했는가?

## 진입 중 체크리스트

- 계획한 가격에 진입했는가? (추격매수 금지)
- 손절 주문을 실제로 걸었는가? (머릿속 손절은 손절이 아님)
- 포지션 잡고 나서 추가 매수 충동 없는가?
- 확증편향에 빠지지 않았는가? (내 방향만 확인하는 뉴스 찾기)

## 청산 후 체크리스트

- 목표가 또는 손절가에서 청산했는가?
- 감정적으로 청산하지 않았는가?
- 매매일지에 기록했는가?
- 복수매매 충동은 없는가? (손절 후 바로 반대 포지션 = 최악)
- 오늘 최대 손실 한도를 넘기지 않았는가?

## 절대 하면 안 되는 것

1. **물타기** — 단타에서 물타기는 자살 행위
2. **손절 미루기** — "조금만 더 기다리면..." 이 말이 -2%를 -15%로 만듦
3. **복수매매** — 잃은 돈 바로 복구하려는 매매는 90% 더 잃음
4. **오버트레이딩** — 하루 3번 이상 매매하면 수수료만 벌어다 줌
5. **뉴스 매매** — 뉴스 나왔을 때는 이미 늦음. 선반영 끝남.

## 핵심

단타의 목표는 큰 수익이 아님. **작은 손실**임.
수익은 시장이 주는 것이고, 손실은 내가 관리하는 것.

100번 매매해서 55번 맞고 45번 틀려도,
55번의 평균 수익이 45번의 평균 손실보다 크면 돈을 벌 수 있음.

이걸 가능하게 하는 게 체크리스트.

---

저장하고 대조하라.

*덜 잃고. 더 오래 버텨라.*`
    },
    // ─── 2026-03-10 BTC 2022 vs 2026 비교 (S+ 40K views) ─────────
    {
        slug: "btc-2022-vs-2026-ko",
        title: "BTC 2022 vs 2026 — 4년 전 폭락과 지금, 뭐가 같고 뭐가 다른가",
        description: "2022년 LUNA 사태 때와 2026년 지금. 공포탐욕지수, 가격 구조, 매크로 환경을 비교 분석한다.",
        excerpt: "2022년에도 '이번엔 끝이다'라고 했다. 2026년에도 같은 말이 나온다. 데이터로 비교해본다.",
        image: "/images/blog/btc-comparison.jpg",
        category: "market-analysis",
        date: "2026-03-10",
        readingTime: "6분",
        tags: ["BTC", "비트코인", "2022", "2026", "비교분석", "공포탐욕지수", "매크로"],
        locale: "ko",
        isFeatured: true,
        content: `## "이번엔 끝이다"

2022년 6월. LUNA/UST 붕괴 직후. BTC $17,600. 공포탐욕지수 6.
모든 커뮤니티에서 같은 말이 나왔음: "이번엔 진짜 끝이다."

2026년 3월. 글로벌 관세 전쟁 격화. BTC $69,000대. 공포탐욕지수 20.
역시 같은 말이 나오고 있음: "이번엔 다르다."

## 같은 점

### 1. 공포탐욕지수 극단적 공포
- 2022년 6월: F&G 6 (Extreme Fear)
- 2026년 3월: F&G 20 (Extreme Fear)
- 둘 다 7개 지표 중 대부분이 공포 영역

### 2. "이번엔 다르다" 내러티브
- 2022: "스테이블코인 신뢰 붕괴 → 크립토 자체가 끝"
- 2026: "글로벌 무역 체계 붕괴 → 위험자산 전체가 끝"
- 둘 다 구조적 변화를 근거로 영구 하락을 주장

### 3. 개인 투자자 패닉 매도
- 2022: 온체인 데이터 기준 개인 지갑 대량 이동 → 거래소 입금 급증
- 2026: X/커뮤니티에서 "다 팔았다" 인증 급증

### 4. 레버리지 청산 연쇄
- 2022: 3AC, Celsius 연쇄 파산 → 강제 청산
- 2026: 관세 충격 → 위험자산 전반 마진콜 → 연쇄 청산

## 다른 점

### 1. BTC 현물 ETF
- 2022: 없었음
- 2026: BlackRock, Fidelity 등 기관 ETF 승인. 기관 자금 유입 구조 존재
- 이건 진짜 구조적 차이. 2022년에는 "누가 살 것인가?"의 답이 불분명했는데, 2026년에는 기관 매수 채널이 존재함

### 2. 금리 사이클 위치
- 2022: 금리 인상 초기 (0.25% → 5.5%로 가는 중)
- 2026: 금리 인하 사이클 진행 중
- 유동성 환경이 정반대

### 3. BTC 가격 레벨
- 2022: $17,600 (전고점 $69K 대비 -75%)
- 2026: $69,000 (전고점 $108K 대비 -36%)
- 하락 폭 자체가 다름. 2026년은 아직 구조적 하락이 아닌 조정 범위

### 4. 매크로 트리거
- 2022: 크립토 내부 문제 (LUNA, 3AC, FTX)
- 2026: 외부 매크로 충격 (관세, 지정학)
- 외부 충격은 해소되면 반등이 빠름. 내부 문제는 신뢰 회복에 시간이 더 걸림

## 결론

같은 공포, 다른 구조.

2022년에 F&G 6에서 BTC를 산 사람은 2년 뒤 +290%를 봤음.
2026년에 F&G 20에서 무슨 일이 일어날지는 아무도 모름.

하지만 데이터가 말하는 건 이것:
- 극단적 공포에서 매도한 사람은 거의 항상 후회했다
- 극단적 공포에서 매수한 사람은 대부분 수익을 봤다
- 단, "어디서"가 중요. 분할매수 + 지지선 확인 필수

패닉에 팔지 마라. 하지만 무작정 사지도 마라.
체크리스트 대로 움직여라.

---

저장하고 대조하라.

*덜 잃고. 더 오래 버텨라.*`
    },
    // ─── 인지편향 시리즈 1편: 편향 사각지대 ─────────────────────────
    {
        slug: "bias-blind-spot-ko",
        title: "편향 사각지대: 인지편향을 공부한 사람이 더 많이 잃는 이유",
        description: "카너먼도 앵커링에 매번 당한다고 했다. '나는 편향을 안다'는 생각 자체가 편향인 이유.",
        excerpt: "인지편향을 공부한 사람이 더 많이 잃는다. 이상한 소리 같지만 카너먼 본인이 증명했다.",
        image: "/images/blog/bias-blind-spot.png",
        category: "cognitive-bias",
        date: "2026-03-19",
        readingTime: "4분",
        tags: ["인지편향", "편향사각지대", "카너먼", "행동경제학", "매매심리"],
        locale: "ko",
        isFeatured: false,
        content: `## 인지편향을 공부한 사람이 더 많이 잃는다

이상한 소리 같지? 근데 진짜다.

다니엘 카너먼. 행동경제학을 만든 사람. 노벨 경제학상 수상자.

그가 인터뷰에서 이렇게 말했다:

> "나도 앵커링에 매번 당한다."

행동경제학을 **만든** 사람이 자기가 발견한 편향에 매번 당한다.

## 왜 그럴까?

"나는 편향을 안다"는 생각 자체가 편향이다. 이름이 있다. **편향 사각지대(Bias Blind Spot).**

프린스턴 대학의 에밀리 프로닌(Emily Pronin) 연구팀이 2002년에 발표한 연구에 따르면, 사람들은 자신이 편향에 덜 영향을 받는다고 체계적으로 과대평가한다.

아는 순간 방심한다.

"나는 확증편향 알아, 나는 안 당해."

→ 이미 당하고 있다.

## 트레이딩에서 편향 사각지대가 작동하는 방식

1. **과신**: "나는 행동경제학 책을 읽었으니까 다른 투자자보다 합리적이다"
2. **경계 해제**: 편향을 '안다'는 사실이 편향에 대한 경계를 낮춘다
3. **자기 면제**: 다른 사람의 판단 오류는 잘 보이는데, 자기 것은 못 본다
4. **이중 기준**: 남의 FOMO 매수는 비웃으면서 자기 FOMO 매수는 "분석에 기반한 판단"이라 합리화

## 극복법

매수 버튼 누르기 전에 종이에 3줄만 적어라.

1. **이걸 사는 이유** (1줄)
2. **이게 틀리면 어떻게 되는지** (1줄)
3. **얼마에 손절할 건지** (숫자)

적기 싫으면 사지 마라. 적기 싫다는 건 근거가 없다는 것이다.

## 솔직한 고백

나도 매번 당한다. 근데 적기 시작하고 나서 분위기 매수가 반으로 줄었다.

이 시리즈는 앞으로 매주 하나씩 올린다.

- **1편: 편향 사각지대** (지금 이 글)
- 2편: 확증편향
- 3편: 앵커링
- 4편: 손실회피
- 5편: 군중심리

---

저장하고 대조하라.

*덜 잃고. 더 오래 버텨라.*`
    },
    // ─── 인지편향 시리즈 2편: 확증편향 ─────────────────────────
    {
        slug: "confirmation-bias-trading-checklist-ko",
        title: "확증편향이 투자 수익을 망치는 과학적 이유 — 매수 전 점검 4가지",
        description: "롱 잡으면 불장 분석만 찾는다. 1960년 웨이슨 실험이 증명한 확증편향의 구조와 매수 전 점검법.",
        excerpt: "롱 잡으면 불장 분석만 찾고, 숏 잡으면 폭락론만 리트윗한다. 지금 네 타임라인이 증거다.",
        image: "/images/blog/confirmation-bias.png",
        category: "cognitive-bias",
        date: "2026-03-19",
        readingTime: "5분",
        tags: ["확증편향", "인지편향", "행동경제학", "매매심리", "웨이슨", "에코챔버"],
        locale: "ko",
        isFeatured: true,
        content: `## 네 타임라인이 증거다

롱 잡으면 불장 분석만 찾는다. 숏 잡으면 폭락론만 리트윗한다.

부정할 수 있는가? 지금 당장 자기 타임라인을 열어보라.

이것이 **확증편향(Confirmation Bias)**이다. 뇌가 내 편만 들어주는 현상.

## 웨이슨의 2-4-6 실험 (1960)

심리학자 피터 웨이슨이 참가자들에게 숫자 세 개를 보여줬다: **2, 4, 6.**

"이 숫자의 규칙을 맞춰보라."

대부분 "짝수가 2씩 증가한다"고 추측했다. 그리고 8, 10, 12를 시도했다. "맞다"고 나왔다. 확신했다.

하지만 정답은 **"아무 오름차순 숫자"**였다. 3, 7, 15도 맞았다. 1, 50, 999도 맞았다.

아무도 자기 가설을 반증하는 숫자를 시도하지 않았다. 맞는 것만 확인하고 끝냈다.

Nickerson(1998)의 종합 리뷰에 따르면, 확증편향은 "가장 파괴력이 큰 인지편향 중 하나"다.

## 트레이딩에서 확증편향이 작동하는 방식

- **롱 포지션**: 불장 분석만 찾는다. 숏 분석은 눈에 안 들어온다.
- **매수 근거**: 3개를 찾으면 확신한다. 매도 근거는 찾아보지도 않는다.
- **에코챔버**: 트위터, 텔레그램에서 같은 방향 의견만 모인 커뮤니티에서 서로 확신을 강화한다.
- **기술 분석**: 지지선을 그으면 지지 근거만 찾고, 이탈 시그널은 무시한다.

## 매수 전 확증편향 점검 4가지

### 1. 반대 의견 카운트
내가 최근 본 분석 중 반대 의견이 몇 개였는지 세어보라. **0개면 뇌가 검열하고 있는 것이다.**

### 2. 악재 테스트
이 종목의 악재를 3가지 말할 수 있는가? **못 하면 그건 리서치가 아니라 확인작업이다.**

### 3. 에코챔버 점검
팔로우한 트레이더들이 전부 같은 방향을 말하고 있는가? **그건 합의가 아니라 에코챔버 안에 있다는 뜻이다.**

### 4. "이번엔 다르다" 경보
"이번엔 다르다"는 역사상 가장 비싼 문장이다. 이 문장이 머릿속에 떠오르면 확증편향이 최고조에 달했다는 신호다.

## 실전 적용법

매수 버튼을 누르기 전에, **반대 의견 3개를 찾아라.** 찾을 수 없으면 그 매수는 분석이 아니라 도박이다.

## 솔직한 고백

나도 롱 잡으면 불장 분석만 봤다. 근데 매수 전에 반대 의견 3개를 찾는 습관을 만들었다. 찾을 수 없으면 안 산다. 그것만으로 충동매수가 반으로 줄었다.

---

- 1편: [편향 사각지대](/ko/blog/bias-blind-spot-ko)
- **2편: 확증편향** (지금 이 글)
- 3편: 앵커링 (예정)
- 4편: 손실회피 (예정)
- 5편: 군중심리 (예정)

---

저장하고 대조하라. 매수 버튼 누르기 전에 이 4가지를 점검해라.

*덜 잃고. 더 오래 버텨라.*`
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
