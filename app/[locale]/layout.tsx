import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const siteUrl = "https://trantradinglab.com";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const titles: Record<string, string> = {
        en: "Tran Trading Lab — Daily Liquidity Analysis & Risk-First Trading",
        ko: "Tran Trading Lab — 매일 유동성 분석 & 리스크 우선 트레이딩",
        zh: "Tran Trading Lab — 每日流动性分析 & 风险优先交易",
    };

    const descriptions: Record<string, string> = {
        en: "Free trading education platform. Daily liquidity analysis, SMC & ORB strategy guides, and a 5,000+ global trader community.",
        ko: "무료 트레이딩 교육 플랫폼. 매일 유동성 분석, SMC & ORB 전략 가이드, 5,000+ 글로벌 트레이더 커뮤니티.",
        zh: "免费交易教育平台。每日流动性分析、SMC & ORB策略指南、5,000+全球交易者社群。",
    };

    const title = titles[locale] || titles.en;
    const description = descriptions[locale] || descriptions.en;

    return {
        title: {
            default: title,
            template: `%s | Tran Trading Lab`,
        },
        description,
        keywords: ["trading", "SMC", "Smart Money Concept", "ORB", "liquidity analysis", "market research", "financial education", "trading community"],
        authors: [{ name: "TranTradingLab" }],
        metadataBase: new URL(siteUrl),
        alternates: {
            canonical: `${siteUrl}/${locale}`,
            languages: {
                en: `${siteUrl}/en`,
                ko: `${siteUrl}/ko`,
                zh: `${siteUrl}/zh`,
            },
        },
        openGraph: {
            title,
            description,
            url: `${siteUrl}/${locale}`,
            siteName: "Tran Trading Lab",
            type: "website",
            locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : "en_US",
            images: [
                {
                    url: `${siteUrl}/api/og`,
                    width: 1200,
                    height: 630,
                    alt: "Tran Trading Lab",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            site: "@TranTradingLab",
            title,
            description,
            images: [`${siteUrl}/api/og`],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    if (!routing.locales.includes(locale as typeof routing.locales[number])) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} className="dark">
            <body className="min-h-screen bg-background antialiased">
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
