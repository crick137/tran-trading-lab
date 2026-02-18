import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { AcademyContent } from "./academy-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/academy",
        title: t.academy.title,
        description: t.academy.subtitle,
    });
}

export default function AcademyPage() {
    return <AcademyContent />;
}
