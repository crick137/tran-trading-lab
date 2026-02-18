import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { AboutContent } from "./about-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/about",
        title: t.about.badge,
        description: t.about.heroDescription,
    });
}

export default function AboutPage() {
    return <AboutContent />;
}
