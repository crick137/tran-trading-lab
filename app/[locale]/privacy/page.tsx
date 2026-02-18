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
        path: "/privacy",
        title: (t as any).meta.privacyTitle,
        description: (t as any).meta.privacyDescription,
    });
}

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-white mb-8">개인정보 처리방침</h1>

                    <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
                        <p className="text-muted-foreground mb-6">
                            최종 수정일: 2024년 1월 1일
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. 수집하는 개인정보</h2>
                        <p className="text-muted-foreground mb-4">
                            TranTradingLab은 서비스 제공을 위해 다음과 같은 정보를 수집할 수 있습니다:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                            <li>이메일 주소 (뉴스레터 구독 시)</li>
                            <li>사이트 이용 기록 및 접속 로그</li>
                            <li>쿠키 및 유사 기술을 통해 수집되는 정보</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. 개인정보의 이용 목적</h2>
                        <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                            <li>뉴스레터 및 시장 분석 콘텐츠 발송</li>
                            <li>서비스 개선 및 사용자 경험 향상</li>
                            <li>사이트 이용 통계 분석</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. 개인정보의 보유 기간</h2>
                        <p className="text-muted-foreground mb-6">
                            수집된 개인정보는 수집 목적이 달성된 후 지체 없이 파기됩니다.
                            단, 관련 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관됩니다.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. 개인정보의 제3자 제공</h2>
                        <p className="text-muted-foreground mb-6">
                            TranTradingLab은 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. 이용자의 권리</h2>
                        <p className="text-muted-foreground mb-6">
                            이용자는 언제든지 자신의 개인정보에 대해 열람, 수정, 삭제를 요청할 수 있습니다.
                            관련 문의는 텔레그램 채널을 통해 연락해 주시기 바랍니다.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. 쿠키 사용</h2>
                        <p className="text-muted-foreground mb-6">
                            본 사이트는 사용자 경험 향상을 위해 쿠키를 사용합니다.
                            브라우저 설정을 통해 쿠키 수집을 거부할 수 있습니다.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. 문의처</h2>
                        <p className="text-muted-foreground mb-6">
                            개인정보 관련 문의: <a href="https://t.me/TranTradingLab" className="text-gold hover:underline">텔레그램 채널</a>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
