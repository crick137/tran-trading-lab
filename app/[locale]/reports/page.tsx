import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { ReportsContent } from "./reports-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/reports",
        title: t.reports.title,
        description: t.reports.subtitle,
    });
}

export default function ReportsPage() {
    return <ReportsContent />;
}
