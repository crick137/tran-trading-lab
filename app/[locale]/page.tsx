import { getAllContent, getContentStats } from "@/lib/content-utils.server";
import { websiteJsonLd, organizationJsonLd } from "@/lib/json-ld";
import { HomeContent } from "@/components/home/home-content";

export default function Home({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const allContent = getAllContent(locale as "en" | "ko");
    const stats = getContentStats(locale as "en" | "ko");

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
            />
            <HomeContent allContent={allContent} stats={stats} />
        </>
    );
}
