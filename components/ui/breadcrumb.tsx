import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center flex-wrap gap-1 text-sm">
                <li>
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>홈</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-muted-foreground hover:text-gold transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground font-medium truncate max-w-[200px]">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
