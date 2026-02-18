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
        path: "/subscribe",
        title: `${t.subscribe.title} ${t.subscribe.titleHighlight}`,
        description: t.subscribe.subtitle,
    });
}

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
    return children;
}
