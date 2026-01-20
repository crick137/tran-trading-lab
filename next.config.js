/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // Ignore server and api directories (they're for Telegram publisher)
    webpack: (config) => {
        config.externals = [...(config.externals || [])];
        return config;
    },
};

module.exports = nextConfig;
