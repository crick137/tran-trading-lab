import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { ToolsContent } from "./tools-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/tools",
        title: t.tools.title,
        description: t.tools.subtitle,
    });
}

export default function ToolsPage() {
    return <ToolsContent />;
}
