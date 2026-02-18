"use client";

import { useLocale, useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { FileSpreadsheet, ExternalLink, CheckCircle2 } from "lucide-react";

interface Template {
    id: string;
    title: string;
    description: string;
    format: string;
    includes: string[];
}

export function TemplatesContent() {
    const locale = useLocale();
    const t = useTranslations("templatesPage");
    const tc = useTranslations("common");

    const templates = t.raw("templates") as Template[];

    const heroRef = useGsapScroll<HTMLDivElement>();
    const gridRef = useGsapScroll<HTMLDivElement>({ children: true, stagger: 0.1 });
    const ctaRef = useGsapScroll<HTMLDivElement>();

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb
                        items={[
                            { label: tc("tools"), href: `/${locale}/tools` },
                            { label: t("title") },
                        ]}
                    />

                    <div ref={heroRef} className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
                            <FileSpreadsheet className="w-8 h-8 text-gold" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">{t("title")}</h1>
                        <p className="text-white/40">{t("subtitle")}</p>
                    </div>

                    {/* Templates Grid */}
                    <div ref={gridRef} className="grid gap-6">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="p-6 rounded-xl bg-cv-elevated border border-white/5 card-hover border-glow"
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-white/90">{template.title}</h3>
                                            <span className="px-2 py-0.5 rounded text-xs bg-gold/10 text-gold">{template.format}</span>
                                        </div>
                                        <p className="text-white/40 mb-4">{template.description}</p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            {template.includes.map((item) => (
                                                <span key={item} className="flex items-center gap-1.5 text-xs text-white/50">
                                                    <CheckCircle2 className="w-3 h-3 text-gold" />
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <a
                                        href="https://t.me/TranTradingLab"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gold/10 text-gold font-medium hover:bg-gold/20 transition-all shrink-0"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        {t("download")}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div ref={ctaRef} className="mt-12 p-6 rounded-xl bg-cv-elevated/50 border border-white/5 text-center">
                        <p className="text-white/40 mb-4">
                            {t("requestMissing")}
                        </p>
                        <a
                            href="https://t.me/TranTradingLab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:underline"
                        >
                            {t("requestLink")} →
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
