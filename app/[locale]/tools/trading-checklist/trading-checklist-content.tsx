"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Check, RotateCcw, ChevronDown, ChevronUp, Shield, TrendingUp, Target, BarChart3, Scissors, Calculator, Maximize2, LogIn, LogOut, PlusCircle } from "lucide-react";

interface Step {
    id: number;
    icon: React.ElementType;
    phase: "analyze" | "execute";
    color: string;
    title: string;
    desc: string;
    details: string[];
}

const steps: Step[] = [
    {
        id: 1, icon: TrendingUp, phase: "analyze", color: "#00b894",
        title: "추세 판단",
        desc: "상승 / 하락 / 횡보 — 추세가 틀리면 모든 신호는 소음",
        details: [
            "4시간봉 기준 고점/저점 방향 확인",
            "고점↑ 저점↑ = 상승추세",
            "고점↓ 저점↓ = 하락추세",
            "판단 안 되면 = 횡보 → 관망",
            "원칙: 장기 우선, 단기 다음"
        ]
    },
    {
        id: 2, icon: Target, phase: "analyze", color: "#00b894",
        title: "방향 결정",
        desc: "주매수 / 주매도 / 관망 — 한 방향만. 매매 중 입장 바꾸지 않는다",
        details: [
            "3가지 중 하나만 선택",
            "주요 매수 (추세 추종 → 전환/지속)",
            "주요 매도 (추세 역행 → 전환/지속)",
            "주요 박스권 (관망)",
            "금지: 동시에 두 방향 베팅"
        ]
    },
    {
        id: 3, icon: Maximize2, phase: "analyze", color: "#00b894",
        title: "자리 선정",
        desc: "아무 자리에서 매매하지 않는다. 위치가 손익비를 결정한다",
        details: [
            "순추세: 되돌림과 연속만",
            "전환: 공명 지지점 · 극한 지지점 · 추세선 · 이동평균선",
            "지속: 장대 양봉 · 원내 돌파 · 직전 K선",
            "역추세: 구조적 전환만",
            "이중바닥/천장 · 헤드앤숄더"
        ]
    },
    {
        id: 4, icon: BarChart3, phase: "analyze", color: "#00b894",
        title: "신호 확인",
        desc: "강한 신호 → 진입 허용. 약한 신호 → 관망. 고수의 매매 빈도는 낮다",
        details: [
            "강한 상승: 3캔들 돌파 · 상승 장악형 · 관통형 · 역삼존",
            "강한 하락: 3캔들 붕괴 · 하락 장악형 · 먹구름형 · 삼존",
            "약한 신호: 장신 캔들 · 하라미 · 집게",
            "약한 신호에서는 절대 진입하지 않습니다"
        ]
    },
    {
        id: 5, icon: Shield, phase: "execute", color: "#d63031",
        title: "손절매 설정",
        desc: "\"얼마 벌까\"보다 \"얼마 잃을 수 있나\"가 먼저. 손절 없는 진입은 진입이 아니다",
        details: [
            "기술적: 전고점/전저점 · 공명 지지점 · 수렴/저항",
            "신호적: 신호 캔들 지점 · 최초 돌파 노선",
            "차트에 손절 라인을 먼저 그립니다",
            "안 보이면 매매하지 않습니다"
        ]
    },
    {
        id: 6, icon: Calculator, phase: "execute", color: "#fdcb6e",
        title: "포지션 사이즈 계산",
        desc: "감이 아니라 공식. 단일 매매 리스크 ≤ 1~1.5%. 생존이 수익보다 중요하다",
        details: [
            "손 위험 = 원금 × 1.5% (최대)",
            "손실 공간 = 진입가 − 손절가",
            "계약당 위험 = 공간 × 레버리지",
            "포지션 수량 = 총 위험 ÷ 계약당 위험",
            "예: 1000만원 → 최대 손실 15만원"
        ]
    },
    {
        id: 7, icon: Maximize2, phase: "execute", color: "#fdcb6e",
        title: "공간 확인 (손익비)",
        desc: "손익비 2:1 미만이면 아무리 확신해도 패스. 프로가 가장 잔인하게 지키는 규칙",
        details: [
            "최소 2:1 손익비 만족",
            "전고점/전저점 · 과거 중요 지점 · 대주기 저항선",
            "공간 부족 시 아무리 좋은 자리여도 진입 금지",
            "이것이 프로와 아마추어의 차이입니다"
        ]
    },
    {
        id: 8, icon: LogIn, phase: "execute", color: "#0984e3",
        title: "진입 실행",
        desc: "진입은 감정이 아니라 규칙. 시장은 \"버티기\"를 보상하지 않는다",
        details: [
            "분할 진입: 피라미딩 — 리스크 분산",
            "일괄 진입: 손실 기반 수량 — 확신 높을 때",
            "금지: 감정에 의한 진입",
            "\"이번은 확실하니까\"라는 생각 = 위험 신호"
        ]
    },
    {
        id: 9, icon: LogOut, phase: "execute", color: "#6c5ce7",
        title: "청산 규칙 설정",
        desc: "손절가 도달 → 즉시 청산. 목표가 도달 → 분할 익절",
        details: [
            "손절 도달: 즉시 단호히 청산. 예외 없음",
            "손익비 2:1 도달: 절반 청산 (이익 확보)",
            "포지션 유지 시: 트레일링 스톱",
            "청산 규칙을 진입 전에 정합니다"
        ]
    },
    {
        id: 10, icon: PlusCircle, phase: "execute", color: "#e17055",
        title: "추가 매수 규칙",
        desc: "물타기 = 계좌가 죽는 가장 빠른 방법. 이익에만 추가, 손실에 절대 추가 금지",
        details: [
            "포지션 추가 = 신규 진입과 동일한 기준",
            "절대 금지: 부유 손실 상태에서 추가 매수",
            "허용: 매수 조건이 다시 충족될 때만",
            "물타기는 \"평균 단가를 낮추는 전략\"이 아니라 \"손실을 키우는 함정\""
        ]
    }
];

export function TradingChecklistContent() {
    const [checked, setChecked] = useState<Set<number>>(new Set());
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    const toggleCheck = (id: number) => {
        setChecked(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleExpand = (id: number) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const reset = () => {
        setChecked(new Set());
        setExpanded(new Set());
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const count = checked.size;
    const pct = (count / 10) * 100;

    const getStatus = () => {
        if (count === 10) return { text: "✅ 진입 준비 완료", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" };
        if (count >= 7) return { text: `⚠️ ${10 - count}단계 미확인`, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" };
        return { text: "⛔ 진입 금지", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };
    };

    const status = getStatus();

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-24">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                            매매 10단계 체크리스트
                        </h1>
                        <p className="text-sm text-[var(--text-tertiary)]">
                            매매 전 반드시 확인 — 하나라도 빠지면 진입하지 않습니다
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="mb-6 p-4 rounded-xl bg-cv-elevated border border-[var(--border-subtle)]">
                        <div className="flex justify-between text-sm mb-2">
                            <span className={count >= 7 ? (count === 10 ? "text-green-400 font-bold" : "text-yellow-400 font-bold") : "text-red-400 font-bold"}>
                                {count} / 10
                            </span>
                            <span className="text-[var(--text-ghost)]">매매 준비도</span>
                        </div>
                        <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${pct}%`,
                                    background: `linear-gradient(90deg, #FF1744, #FFD600, #00C853)`
                                }}
                            />
                        </div>
                        <div className="text-center mt-3">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${status.bg} ${status.color}`}>
                                {status.text}
                            </span>
                        </div>
                    </div>

                    {/* Phase: Analyze */}
                    <div className="text-center text-xs font-bold tracking-widest text-green-400 uppercase my-4">
                        ── 분석 단계 ──
                    </div>

                    {steps.filter(s => s.phase === "analyze").map(step => (
                        <StepCard
                            key={step.id}
                            step={step}
                            isChecked={checked.has(step.id)}
                            isExpanded={expanded.has(step.id)}
                            onToggleCheck={() => toggleCheck(step.id)}
                            onToggleExpand={() => toggleExpand(step.id)}
                        />
                    ))}

                    {/* Phase: Execute */}
                    <div className="text-center text-xs font-bold tracking-widest text-red-400 uppercase my-4">
                        ── 실행 단계 ──
                    </div>

                    {steps.filter(s => s.phase === "execute").map(step => (
                        <StepCard
                            key={step.id}
                            step={step}
                            isChecked={checked.has(step.id)}
                            isExpanded={expanded.has(step.id)}
                            onToggleCheck={() => toggleCheck(step.id)}
                            onToggleExpand={() => toggleExpand(step.id)}
                        />
                    ))}

                    {/* Reset */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={reset}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-red-400 hover:border-red-500/30 transition-all"
                        >
                            <RotateCcw className="w-4 h-4" />
                            새 매매 시작 (초기화)
                        </button>
                    </div>

                    {/* Footer note */}
                    <div className="mt-8 text-center text-xs text-[var(--text-ghost)]">
                        저장하고 대조하라. | 이 콘텐츠는 투자 조언이 아닙니다.
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function StepCard({
    step,
    isChecked,
    isExpanded,
    onToggleCheck,
    onToggleExpand,
}: {
    step: Step;
    isChecked: boolean;
    isExpanded: boolean;
    onToggleCheck: () => void;
    onToggleExpand: () => void;
}) {
    const Icon = step.icon;
    return (
        <div className={`mb-3 rounded-xl border transition-all ${
            isChecked
                ? "bg-green-500/5 border-green-500/20"
                : "bg-cv-elevated border-[var(--border-subtle)]"
        }`}>
            <div
                className={`flex items-start gap-3 p-4 cursor-pointer select-none transition-opacity ${isChecked ? "opacity-60" : ""}`}
                onClick={onToggleCheck}
            >
                {/* Checkbox */}
                <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isChecked
                        ? "bg-green-500 border-green-500"
                        : "border-[var(--border-default)]"
                }`}>
                    {isChecked && <Check className="w-4 h-4 text-black" strokeWidth={3} />}
                </div>

                {/* Number */}
                <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: step.color }}
                >
                    {String(step.id).padStart(2, "0")}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-[15px] transition-all ${
                        isChecked ? "line-through text-green-400" : "text-[var(--text-primary)]"
                    }`}>
                        {step.title}
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1 leading-relaxed">
                        {step.desc}
                    </div>
                </div>
            </div>

            {/* Expand toggle */}
            <button
                onClick={onToggleExpand}
                className="w-full text-center py-1.5 text-[10px] text-[var(--text-ghost)] hover:text-[var(--text-tertiary)] transition-colors flex items-center justify-center gap-1"
            >
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {isExpanded ? "접기" : "상세"}
            </button>

            {/* Detail */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-60" : "max-h-0"}`}>
                <div className="px-4 pb-3 pt-1 border-t border-[var(--border-subtle)]">
                    <ul className="space-y-1">
                        {step.details.map((d, i) => (
                            <li key={i} className="text-[11px] text-[var(--text-tertiary)] leading-relaxed flex gap-2">
                                <span className="text-[var(--text-ghost)] shrink-0">•</span>
                                {d}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
