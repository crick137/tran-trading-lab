import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
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

export default function BriefingsPage() {
    return <BriefingsContent />;
}
