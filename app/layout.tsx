import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "TranTradingLab | 전문 금융 교육",
    description: "한국 개인 투자자를 위한 전문 금융 교육 플랫폼. 시장 분석, 트레이딩 전략, 중국 금융 뉴스 한국어 번역.",
    keywords: ["트레이딩", "주식", "투자", "금융 교육", "시장 분석", "SMC", "ORB"],
    authors: [{ name: "TranTradingLab" }],
    openGraph: {
        title: "TranTradingLab | 전문 금융 교육",
        description: "한국 개인 투자자를 위한 전문 금융 교육 플랫폼",
        type: "website",
        locale: "ko_KR",
    },
    twitter: {
        card: "summary_large_image",
        title: "TranTradingLab",
        description: "전문 금융 교육 플랫폼",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="dark">
            <body className="min-h-screen bg-background antialiased">
                {children}
            </body>
        </html>
    );
}
