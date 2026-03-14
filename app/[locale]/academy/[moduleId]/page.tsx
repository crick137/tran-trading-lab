import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { academyModules } from "@/lib/academy-data";
import { ModuleContent } from "./module-content";

export async function generateMetadata({
    params: { locale, moduleId },
}: {
    params: { locale: string; moduleId: string };
}): Promise<Metadata> {
    const mod = academyModules.find((m) => m.id === moduleId);
    return createPageMetadata({
        locale,
        path: `/academy/${moduleId}`,
        title: mod?.title ?? "Module",
        description: mod?.description ?? "",
    });
}

export function generateStaticParams() {
    return academyModules.map((mod) => ({ moduleId: mod.id }));
}

export default function ModulePage() {
    return <ModuleContent />;
}
