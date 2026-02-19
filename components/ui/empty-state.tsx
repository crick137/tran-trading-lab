import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    cta?: {
        label: string;
        href: string;
    };
}

export function EmptyState({ icon, title, subtitle, cta }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-24 px-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-wash)] border border-[var(--border-subtle)] flex items-center justify-center mb-8">
                {icon}
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                {title}
            </h2>
            <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-8">
                {subtitle}
            </p>
            {cta && (
                <Link
                    href={cta.href}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "var(--gradient-cta)", color: "var(--bg-void, #050810)" }}
                >
                    {cta.label}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            )}
        </div>
    );
}
