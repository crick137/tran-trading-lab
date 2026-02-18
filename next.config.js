const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.jsdelivr.net',
            },
            {
                protocol: 'https',
                hostname: 'trantradinglab.com',
            },
        ],
    },
    // Ignore server and api directories (they're for Telegram publisher)
    webpack: (config) => {
        config.externals = [...(config.externals || [])];
        return config;
    },
};

module.exports = withNextIntl(nextConfig);
