import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";

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
        keywords: ["trading tools", "position sizing", "risk reward calculator"],
    });
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
