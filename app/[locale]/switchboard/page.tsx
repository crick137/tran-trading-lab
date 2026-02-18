import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { SwitchboardContent } from "./switchboard-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/switchboard",
        title: t.switchboard.title,
        description: t.switchboard.subtitle,
    });
}

export default function SwitchboardPage() {
    return <SwitchboardContent />;
}
