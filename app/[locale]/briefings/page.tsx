import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { getContentByType } from "@/lib/content-utils.server";
import { BriefingsContent } from "./briefings-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/briefings",
        title: t.briefings.title,
        description: t.briefings.subtitle,
    });
}

export default function BriefingsPage({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const items = getContentByType(locale as "en" | "ko", "briefing");
    return <BriefingsContent items={items} />;
}
