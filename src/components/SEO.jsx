import React from 'react'
import { Helmet } from 'react-helmet-async'

/**
 * SEO 组件 - 动态设置页面 meta 标签
 * 支持 Open Graph (Facebook/Telegram) 和 Twitter Cards
 */
function SEO({
    title = 'TRAN Trading Lab',
    description = '전문 트레이딩 인사이트와 시장 분석',
    image = 'https://trantradinglab.com/og-default.png',
    url = 'https://trantradinglab.com',
    type = 'website',
    article = null // 文章特有信息
}) {
    const siteName = 'TRAN Trading Lab'
    const twitterHandle = '@TranTradingLab'

    // 文章页面的特殊处理
    const finalTitle = article?.title || title
    const finalDescription = article?.summary || description
    const finalImage = article?.image_url || image
    const finalUrl = article?.id ? `${url}/analysis/${article.id}` : url
    const finalType = article ? 'article' : type

    return (
        <Helmet>
            {/* 基础 Meta */}
            <title>{finalTitle} | {siteName}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={finalUrl} />

            {/* Open Graph (Facebook, Telegram, KakaoTalk 等) */}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:type" content={finalType} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:locale" content="ko_KR" />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:creator" content={twitterHandle} />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />

            {/* 文章特有标签 */}
            {article && (
                <>
                    <meta property="article:published_time" content={article.created_at} />
                    <meta property="article:author" content={article.author || 'TRAN Research'} />
                    {article.category && <meta property="article:section" content={article.category} />}
                </>
            )}
        </Helmet>
    )
}

export default SEO
