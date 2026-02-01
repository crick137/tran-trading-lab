import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trantradinglab.com";

export const metadata: Metadata = {
    title: "Market Research | TRAN Trading Lab",
    description: "Smart Money Concepts 기반의 심층 시장 분석 리포트. 외환, 지수, 상품 시장의 구조 분석과 트레이딩 시나리오를 제공합니다.",
    openGraph: {
        title: "Market Research | TRAN Trading Lab",
        description: "Smart Money Concepts 기반의 심층 시장 분석 리포트",
        type: "website",
        url: `${SITE_URL}/research`,
        siteName: "TRAN Trading Lab",
        locale: "ko_KR",
        images: [
            {
                url: `${SITE_URL}/api/og?title=Market%20Research&subtitle=Institutional%20Grade%20Analysis&bias=neutral&theme=dark`,
                width: 1200,
                height: 630,
                alt: "TRAN Trading Lab Research",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Market Research | TRAN Trading Lab",
        description: "Smart Money Concepts 기반의 심층 시장 분석 리포트",
        images: [`${SITE_URL}/api/og?title=Market%20Research&subtitle=Institutional%20Grade%20Analysis&bias=neutral&theme=dark`],
    },
};

export default function ResearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
