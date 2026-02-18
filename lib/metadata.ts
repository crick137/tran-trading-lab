import type { Metadata } from "next";

const SITE_URL = "https://trantradinglab.com";

interface PageMetadataParams {
    locale: string;
    path: string;
    title: string;
    description: string;
    keywords?: string[];
    ogSubtitle?: string;
}

export function createPageMetadata({
    locale,
    path,
    title,
    description,
    keywords = [],
    ogSubtitle,
}: PageMetadataParams): Metadata {
    const url = `${SITE_URL}/${locale}${path}`;
    const ogParams = new URLSearchParams({ title });
    if (ogSubtitle) ogParams.set("subtitle", ogSubtitle);

    const ogImageUrl = `${SITE_URL}/api/og?${ogParams.toString()}`;

    return {
        title,
        description,
        ...(keywords.length > 0 && { keywords }),
        alternates: {
            canonical: url,
            languages: {
                en: `${SITE_URL}/en${path}`,
                ko: `${SITE_URL}/ko${path}`,
            },
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Tran Trading Lab",
            type: "website",
            locale: locale === "ko" ? "ko_KR" : "en_US",
            images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            site: "@TranTradingLab",
            title,
            description,
            images: [ogImageUrl],
        },
    };
}
