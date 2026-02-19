import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { GsapProvider } from "@/components/providers/gsap-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BackToTop } from "@/components/ui/back-to-top";
import { RouteProgress } from "@/components/ui/route-progress";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "../globals.css";

const siteUrl = "https://trantradinglab.com";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const titles: Record<string, string> = {
        en: "Tran Trading Lab — Risk-First Market Analysis | Lose Less. Last Longer.",
        ko: "Tran Trading Lab — 리스크 우선 시장 분석 | Lose Less. Last Longer.",
    };

    const descriptions: Record<string, string> = {
        en: "Risk-first trading analysis. Weekly Switchboard, public Bold Calls, and daily market insights in English & 한국어. Free.",
        ko: "리스크 우선 트레이딩 분석. 주간 스위치보드, 공개 Bold Calls, 매일 시장 인사이트. English & 한국어. 무료.",
    };

    const title = titles[locale] || titles.en;
    const description = descriptions[locale] || descriptions.en;

    return {
        title: {
            default: title,
            template: `%s | Tran Trading Lab`,
        },
        description,
        keywords: [
            "trading", "risk management", "market analysis", "switchboard",
            "bold calls", "VIX", "S&P 500", "Bitcoin", "yield curve",
            "fear greed index", "weekly market outlook", "financial education",
        ],
        authors: [{ name: "TranTradingLab" }],
        metadataBase: new URL(siteUrl),
        alternates: {
            canonical: `${siteUrl}/${locale}`,
            languages: {
                en: `${siteUrl}/en`,
                ko: `${siteUrl}/ko`,
            },
        },
        openGraph: {
            title,
            description,
            url: `${siteUrl}/${locale}`,
            siteName: "Tran Trading Lab",
            type: "website",
            locale: locale === "ko" ? "ko_KR" : "en_US",
            images: [
                {
                    url: `${siteUrl}/api/og`,
                    width: 1200,
                    height: 630,
                    alt: "Tran Trading Lab — Lose Less. Last Longer.",
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
        <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
                <link
                    rel="preload"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
                    as="style"
                />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
                />
                <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Tran Trading Lab" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body className="noise-overlay min-h-screen antialiased">
                <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gold focus:text-cv-void focus:rounded-lg focus:font-semibold">
                    Skip to main content
                </a>
                <ThemeProvider>
                    <NextIntlClientProvider messages={messages}>
                        <MotionProvider>
                            <GsapProvider>
                                <SmoothScrollProvider>
                                    <RouteProgress />
                                    {children}
                                    <BackToTop />
                                </SmoothScrollProvider>
                            </GsapProvider>
                        </MotionProvider>
                    </NextIntlClientProvider>
                </ThemeProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
