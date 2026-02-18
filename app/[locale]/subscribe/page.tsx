import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { SubscribeContent } from "./subscribe-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/subscribe",
        title: t.subscribe.ctaTitle,
        description: t.subscribe.subtitle,
    });
}

export default function SubscribePage() {
    return <SubscribeContent />;
}
