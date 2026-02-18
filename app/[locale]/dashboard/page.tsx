import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { DashboardContent } from "./dashboard-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/dashboard",
        title: t.dashboard.title,
        description: t.dashboard.subtitle,
    });
}

export default function DashboardPage() {
    return <DashboardContent />;
}
