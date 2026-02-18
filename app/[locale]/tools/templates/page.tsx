import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { TemplatesContent } from "./templates-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/tools/templates",
        title: t.templatesPage.title,
        description: t.templatesPage.subtitle,
    });
}

export default function TemplatesPage() {
    return <TemplatesContent />;
}
