import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { PlansContent } from "./plans-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/plans",
        title: t.plans.title,
        description: t.plans.subtitle,
    });
}

export default function PlansPage() {
    return <PlansContent />;
}
