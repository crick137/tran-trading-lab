import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
    title: "TranTradingLab | Professional Trading Education",
    description: "Institutional-grade market research platform for investors. SMC, Liquidity, Timing.",
    keywords: ["trading", "stocks", "investing", "financial education", "market analysis", "SMC", "ORB"],
    authors: [{ name: "TranTradingLab" }],
    openGraph: {
        title: "TranTradingLab | Professional Trading Education",
        description: "Institutional-grade market research platform",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "TranTradingLab",
        description: "Professional Trading Education Platform",
    },
};

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
