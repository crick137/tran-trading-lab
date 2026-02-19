const SITE_URL = "https://trantradinglab.com";

export function websiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Tran Trading Lab",
        alternateName: "TTL",
        url: SITE_URL,
        inLanguage: ["en", "ko"],
        description: "Risk-first market analysis. Weekly Switchboard, public Bold Calls, and daily market insights in English & Korean.",
        publisher: {
            "@type": "Organization",
            name: "Tran Trading Lab",
        },
    };
}

export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Tran Trading Lab",
        alternateName: "TranTradingLab",
        url: SITE_URL,
        logo: `${SITE_URL}/api/og?title=TRAN+TRADING+LAB`,
        description: "Risk-first trading analysis platform providing daily insights in English & Korean.",
        sameAs: [
            "https://x.com/TranTradingLab",
            "https://t.me/TranTradingLabEN",
            "https://t.me/TranTradingLabKR",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            url: "https://t.me/TranTradingLabEN",
            availableLanguage: ["English", "Korean"],
        },
    };
}

export function articleJsonLd(params: {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    imageUrl: string;
    tags?: string[];
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: params.title,
        description: params.description,
        url: params.url,
        datePublished: params.datePublished,
        image: params.imageUrl,
        author: {
            "@type": "Organization",
            name: "Tran Trading Lab",
            url: SITE_URL,
        },
        publisher: {
            "@type": "Organization",
            name: "Tran Trading Lab",
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/api/og?title=TRAN+TRADING+LAB`,
            },
        },
        ...(params.tags && { keywords: params.tags.join(", ") }),
    };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
        })),
    };
}
