"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { academyModules } from "@/lib/academy-data";
import { ArrowLeft, ArrowRight, BookOpen, Clock, CheckCircle } from "lucide-react";

export function ModuleContent() {
    const params = useParams();
    const locale = useLocale();
    const moduleId = params.moduleId as string;

    const modIndex = academyModules.findIndex((m) => m.id === moduleId);
    const mod = academyModules[modIndex];

    if (!mod) {
        notFound();
    }

    const prevMod = modIndex > 0 ? academyModules[modIndex - 1] : null;
    const nextMod = modIndex < academyModules.length - 1 ? academyModules[modIndex + 1] : null;

    return (
        <>
            <Navbar />
            <main className="pt-16 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back */}
                    <Link
                        href={`/${locale}/academy`}
                        className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mt-8 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        아카데미로 돌아가기
                    </Link>

                    {/* Header */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent mb-4">
                            모듈 {modIndex + 1}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                            {mod.title}
                        </h1>
                        <p className="text-base text-[var(--text-tertiary)] mb-4">{mod.description}</p>
                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                            <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {mod.lessons.length} 레슨
                            </span>
                        </div>
                    </div>

                    {/* Lesson List */}
                    <div className="space-y-3">
                        {mod.lessons.map((lesson, index) => (
                            <Link
                                key={lesson.slug}
                                href={`/${locale}/academy/${moduleId}/${lesson.slug}`}
                                className="group flex items-center gap-4 p-4 rounded-xl bg-cv-elevated border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm flex-shrink-0 text-[#0a0a0f]" style={{ background: "var(--gradient-cta)" }}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-accent transition-colors">
                                        {lesson.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-tertiary)] line-clamp-1">
                                        {lesson.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                        <Clock className="w-3 h-3" />
                                        {lesson.duration}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-[var(--text-ghost)] group-hover:text-accent transition-all group-hover:translate-x-1" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Module Navigation */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {prevMod ? (
                            <Link
                                href={`/${locale}/academy/${prevMod.id}`}
                                className="group flex items-center gap-3 p-4 rounded-xl border border-[var(--border-subtle)] bg-cv-elevated hover:border-[var(--accent)]/30 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 text-[var(--text-muted)] group-hover:text-accent transition-colors flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-[var(--text-muted)]">이전 모듈</p>
                                    <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-accent transition-colors">{prevMod.title}</p>
                                </div>
                            </Link>
                        ) : <div />}
                        {nextMod ? (
                            <Link
                                href={`/${locale}/academy/${nextMod.id}`}
                                className="group flex items-center justify-end gap-3 p-4 rounded-xl border border-[var(--border-subtle)] bg-cv-elevated hover:border-[var(--accent)]/30 transition-colors text-right"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs text-[var(--text-muted)]">다음 모듈</p>
                                    <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-accent transition-colors">{nextMod.title}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-accent transition-colors flex-shrink-0" />
                            </Link>
                        ) : <div />}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
