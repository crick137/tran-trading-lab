import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { PositionSizingContent } from "./position-sizing-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/tools/position-sizing",
        title: t.positionSizingCalc.title,
        description: t.positionSizingCalc.subtitle,
    });
}

export default function PositionSizingPage() {
    return <PositionSizingContent />;
}
