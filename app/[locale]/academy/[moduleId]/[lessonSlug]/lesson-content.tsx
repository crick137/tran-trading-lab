"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { MarkdownRenderer } from "@/components/content/markdown-renderer";
import { academyModules, getLesson } from "@/lib/academy-data";
import { ArrowLeft, ArrowRight, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function LessonContent() {
    const params = useParams();
    const locale = useLocale();
    const moduleId = params.moduleId as string;
    const lessonSlug = params.lessonSlug as string;

    const result = getLesson(moduleId, lessonSlug);

    if (!result) {
        notFound();
    }

    const { module: mod, lesson, index } = result;

    const prevLesson = index > 0 ? mod.lessons[index - 1] : null;
    const nextLesson = index < mod.lessons.length - 1 ? mod.lessons[index + 1] : null;

    // If last lesson of current module, link to next module's first lesson
    const modIndex = academyModules.findIndex((m) => m.id === moduleId);
    const nextModule = modIndex < academyModules.length - 1 ? academyModules[modIndex + 1] : null;
    const prevModule = modIndex > 0 ? academyModules[modIndex - 1] : null;

    const nextNav = nextLesson
        ? { href: `/${locale}/academy/${moduleId}/${nextLesson.slug}`, label: nextLesson.title, sub: `레슨 ${index + 2}` }
        : nextModule
            ? { href: `/${locale}/academy/${nextModule.id}/${nextModule.lessons[0].slug}`, label: nextModule.lessons[0].title, sub: `${nextModule.title} →` }
            : null;

    const prevNav = prevLesson
        ? { href: `/${locale}/academy/${moduleId}/${prevLesson.slug}`, label: prevLesson.title, sub: `레슨 ${index}` }
        : prevModule
            ? { href: `/${locale}/academy/${prevModule.id}/${prevModule.lessons[prevModule.lessons.length - 1].slug}`, label: prevModule.lessons[prevModule.lessons.length - 1].title, sub: `← ${prevModule.title}` }
            : null;

    return (
        <>
            <ReadingProgress />
            <Navbar />
            <main className="pt-16 min-h-screen">
                <TableOfContents content={lesson.content} />

                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
                        <Link href={`/${locale}/academy`} className="hover:text-[var(--text-primary)] transition-colors">
                            아카데미
                        </Link>
                        <span>/</span>
                        <Link href={`/${locale}/academy/${moduleId}`} className="hover:text-[var(--text-primary)] transition-colors">
                            {mod.title}
                        </Link>
                        <span>/</span>
                        <span className="text-[var(--text-secondary)]">{lesson.title}</span>
                    </div>

                    {/* Back */}
                    <Link
                        href={`/${locale}/academy/${moduleId}`}
                        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {mod.title}로 돌아가기
                    </Link>

                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent mb-4">
                            모듈 {modIndex + 1} · 레슨 {index + 1}
                        </span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                            {lesson.title}
                        </h1>

                        <p className="text-base text-[var(--text-tertiary)] mb-4">{lesson.description}</p>

                        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {lesson.duration}
                            </span>
                            <span className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                레슨 {index + 1} / {mod.lessons.length}
                            </span>
                        </div>
                    </motion.header>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <MarkdownRenderer content={lesson.content} />
                    </motion.div>

                    {/* Lesson Navigation */}
                    <div className="mt-12 pt-8 border-t border-[var(--border-default)] grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {prevNav ? (
                            <Link
                                href={prevNav.href}
                                className="group flex items-center gap-3 p-4 rounded-xl border border-[var(--border-subtle)] bg-cv-elevated hover:border-[var(--accent)]/30 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 text-[var(--text-muted)] group-hover:text-accent transition-colors flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-[var(--text-muted)]">{prevNav.sub}</p>
                                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 group-hover:text-accent transition-colors">{prevNav.label}</p>
                                </div>
                            </Link>
                        ) : <div />}
                        {nextNav ? (
                            <Link
                                href={nextNav.href}
                                className="group flex items-center justify-end gap-3 p-4 rounded-xl border border-[var(--border-subtle)] bg-cv-elevated hover:border-[var(--accent)]/30 transition-colors text-right"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs text-[var(--text-muted)]">{nextNav.sub}</p>
                                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 group-hover:text-accent transition-colors">{nextNav.label}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-accent transition-colors flex-shrink-0" />
                            </Link>
                        ) : <div />}
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
