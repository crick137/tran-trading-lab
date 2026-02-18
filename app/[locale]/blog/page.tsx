import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/get-messages";
import { BlogContent } from "./blog-content";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = getMessages(locale);
    return createPageMetadata({
        locale,
        path: "/blog",
        title: t.blog.title,
        description: t.blog.subtitle,
    });
}

export default function BlogPage() {
    return <BlogContent />;
}
