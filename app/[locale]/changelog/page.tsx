import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { ChangelogContent } from "./changelog-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/changelog",
        title: t.changelog.title,
        description: t.changelog.subtitle,
    });
}

export default function ChangelogPage() {
    return <ChangelogContent />;
}
