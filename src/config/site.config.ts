// =============================================================================
// SITE CONFIGURATION — Central config for TranTradingLab
// =============================================================================

export const siteConfig = {
    name: "TRAN TRADING LAB",
    tagline: "SMC · Liquidity · Timing",
    description: "한국 투자자를 위한 기관급 시장 리서치 플랫폼",
    url: "https://trantradinglab.com",
    riskDisclaimer: "Edu only – NFA.",
    lastUpdated: "2026-01-22T00:05:00+09:00",

    nav: [
        { label: "홈", href: "/" },
        { label: "리서치", href: "/research" },
        { label: "플레이북", href: "/playbooks" },
        { label: "도구", href: "/tools" },
        { label: "아카데미", href: "/academy" },
        { label: "커뮤니티", href: "/community" },
        { label: "소개", href: "/about" },
    ],

    cta: {
        primary: { label: "구독하기", href: "/subscribe" },
        secondary: { label: "샘플 리포트", href: "/research/sample-report" },
        telegram: { label: "Telegram", href: "https://t.me/TranTradingLab" },
    },

    social: {
        telegram: "https://t.me/TranTradingLab",
        twitter: "https://x.com/TranTradingLab",
        email: "contact@trantradinglab.com",
    },

    stats: {
        followers: "2,700+",
        briefings: "29",
    },

    tradingview: {
        defaultSymbol: "KRX:005930",
        watchlist: [
            "KRX:005930",   // 삼성전자
            "KRX:000660",   // SK하이닉스
            "KRX:035420",   // NAVER
            "BITSTAMP:BTCUSD",
            "FX_IDC:USDKRW",
        ],
    },

    footer: {
        links: [
            { label: "개인정보처리방침", href: "/privacy" },
            { label: "이용약관", href: "/terms" },
            { label: "문의", href: "/contact" },
        ],
    },
};

export type SiteConfig = typeof siteConfig;
