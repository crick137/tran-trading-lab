import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/terms",
        title: (t as any).meta.termsTitle,
        description: (t as any).meta.termsDescription,
    });
}

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-white mb-8">이용약관</h1>

                    <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
                        <p className="text-muted-foreground mb-6">
                            최종 수정일: 2024년 1월 1일
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. 서비스 개요</h2>
                        <p className="text-muted-foreground mb-6">
                            TranTradingLab은 금융 교육 콘텐츠, 시장 분석, 트레이딩 전략 교육을 제공하는 플랫폼입니다.
                            본 서비스는 정보 제공 목적으로만 운영되며, 투자 권유가 아닙니다.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. 면책 조항</h2>
                        <div className="bg-card border border-border/50 rounded-lg p-4 mb-6">
                            <p className="text-gold font-medium mb-2">⚠️ 투자 위험 경고</p>
                            <p className="text-muted-foreground text-sm">
                                본 사이트에서 제공하는 모든 정보는 교육 목적으로만 제공됩니다.
                                금융 상품 투자에는 원금 손실의 위험이 있으며, 과거 수익률이 미래 수익을 보장하지 않습니다.
                                모든 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
                            </p>
                        </div>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. 지적 재산권</h2>
                        <p className="text-muted-foreground mb-6">
                            본 사이트의 모든 콘텐츠(텍스트, 이미지, 차트 등)는 TranTradingLab의 지적 재산입니다.
                            무단 복제, 배포, 수정은 금지됩니다.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. 이용자의 의무</h2>
                        <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                            <li>본 서비스를 불법적인 목적으로 사용하지 않습니다.</li>
                            <li>타인의 개인정보를 침해하지 않습니다.</li>
                            <li>서비스의 정상적인 운영을 방해하지 않습니다.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. 서비스 변경 및 중단</h2>
                        <p className="text-muted-foreground mb-6">
                            TranTradingLab은 서비스의 내용을 변경하거나 중단할 권리를 보유합니다.
                            중요한 변경 사항은 사이트 공지를 통해 안내됩니다.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. 준거법</h2>
                        <p className="text-muted-foreground mb-6">
                            본 약관은 대한민국 법률에 따라 해석되며, 관련 분쟁은 대한민국 법원의 관할에 따릅니다.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. 문의</h2>
                        <p className="text-muted-foreground mb-6">
                            이용약관 관련 문의: <a href="https://t.me/TranTradingLab" className="text-gold hover:underline">텔레그램 채널</a>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
