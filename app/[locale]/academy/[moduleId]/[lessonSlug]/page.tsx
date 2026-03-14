import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { academyModules, getAllLessons } from "@/lib/academy-data";
import { LessonContent } from "./lesson-content";

export async function generateMetadata({
    params: { locale, moduleId, lessonSlug },
}: {
    params: { locale: string; moduleId: string; lessonSlug: string };
}): Promise<Metadata> {
    const mod = academyModules.find((m) => m.id === moduleId);
    const lesson = mod?.lessons.find((l) => l.slug === lessonSlug);
    return createPageMetadata({
        locale,
        path: `/academy/${moduleId}/${lessonSlug}`,
        title: lesson?.title ?? "Lesson",
        description: lesson?.description ?? "",
    });
}

export function generateStaticParams() {
    return getAllLessons().map((item) => ({
        moduleId: item.moduleId,
        lessonSlug: item.lesson.slug,
    }));
}

export default function LessonPage() {
    return <LessonContent />;
}
