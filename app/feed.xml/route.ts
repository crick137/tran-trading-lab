import { blogPosts } from "@/lib/blog-data";
import { researchArticles } from "@/lib/research-data";

const SITE_URL = "https://trantradinglab.com";

function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export async function GET() {
    const allItems = [
        ...blogPosts.map((p) => ({
            title: p.title,
            link: `${SITE_URL}/en/blog/${p.slug}`,
            description: p.excerpt,
            pubDate: new Date(p.date).toUTCString(),
            category: "Blog",
        })),
        ...researchArticles.map((a) => ({
            title: a.title,
            link: `${SITE_URL}/en/research/${a.slug}`,
            description: a.description,
            pubDate: new Date(a.date).toUTCString(),
            category: "Research",
        })),
    ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tran Trading Lab</title>
    <link>${SITE_URL}</link>
    <description>Risk-first trading analysis. Weekly Switchboard, public Bold Calls, and daily market insights.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${allItems
        .map(
            (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <category>${item.category}</category>
      <guid isPermaLink="true">${item.link}</guid>
    </item>`
        )
        .join("")}
  </channel>
</rss>`;

    return new Response(rssXml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
    });
}
