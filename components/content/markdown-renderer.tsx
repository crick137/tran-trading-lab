"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

/* ─── Custom component overrides for TTL brand styling ────────── */
const components: Components = {
    /* Headings — gold accent, anchor IDs */
    h1: ({ children, ...props }) => {
        const id = toId(children);
        return (
            <h1
                id={id}
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent mb-6"
                {...props}
            >
                {children}
            </h1>
        );
    },
    h2: ({ children, ...props }) => {
        const id = toId(children);
        return (
            <h2
                id={id}
                className="mt-12 mb-6 text-2xl font-bold text-[var(--text-primary)] border-l-4 border-[var(--accent)] pl-4"
                {...props}
            >
                {children}
            </h2>
        );
    },
    h3: ({ children, ...props }) => {
        const id = toId(children);
        return (
            <h3
                id={id}
                className="mt-8 mb-4 text-xl font-semibold text-[var(--accent)]/90"
                {...props}
            >
                {children}
            </h3>
        );
    },

    /* Paragraphs */
    p: ({ children, ...props }) => (
        <p className="my-4 leading-relaxed text-[var(--text-secondary)]" {...props}>
            {children}
        </p>
    ),

    /* Emphasis */
    strong: ({ children, ...props }) => (
        <strong className="text-[var(--text-primary)] font-semibold" {...props}>
            {children}
        </strong>
    ),
    em: ({ children, ...props }) => (
        <em className="text-[var(--accent)]/80 italic" {...props}>
            {children}
        </em>
    ),

    /* Lists */
    ul: ({ children, ...props }) => (
        <ul
            className="my-6 ml-4 space-y-2 border-l-2 border-[var(--border-subtle)] pl-6"
            {...props}
        >
            {children}
        </ul>
    ),
    ol: ({ children, ...props }) => (
        <ol
            className="my-6 ml-4 space-y-2 border-l-2 border-[var(--border-subtle)] pl-6 list-decimal list-inside"
            {...props}
        >
            {children}
        </ol>
    ),
    li: ({ children, ...props }) => (
        <li
            className="relative pl-2 text-[var(--text-secondary)] before:absolute before:left-[-1rem] before:top-[0.6rem] before:w-1.5 before:h-1.5 before:bg-[var(--accent)] before:rounded-full"
            {...props}
        >
            {children}
        </li>
    ),

    /* Links */
    a: ({ children, href, ...props }) => (
        <a
            href={href}
            className="text-[var(--accent)] no-underline hover:underline"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            {...props}
        >
            {children}
        </a>
    ),

    /* Code */
    code: ({ children, className, ...props }) => {
        const isBlock = className?.includes("language-");
        if (isBlock) {
            return (
                <code className={`${className} text-sm`} {...props}>
                    {children}
                </code>
            );
        }
        return (
            <code
                className="text-[var(--accent)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded text-sm"
                {...props}
            >
                {children}
            </code>
        );
    },
    pre: ({ children, ...props }) => (
        <pre
            className="my-6 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-x-auto text-sm"
            {...props}
        >
            {children}
        </pre>
    ),

    /* Blockquote */
    blockquote: ({ children, ...props }) => (
        <blockquote
            className="my-6 pl-4 border-l-4 border-[var(--accent)]/40 text-[var(--text-secondary)] italic"
            {...props}
        >
            {children}
        </blockquote>
    ),

    /* Horizontal rule */
    hr: () => (
        <div className="my-12 flex items-center justify-center gap-4">
            <span className="w-2 h-2 bg-[var(--accent)]/50 rounded-full" />
            <span className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent" />
            <span className="w-2 h-2 bg-[var(--accent)]/50 rounded-full" />
        </div>
    ),

    /* Images */
    img: ({ src, alt, ...props }) => (
        <figure className="my-8 rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-lg shadow-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt || ""} className="w-full" {...props} />
            {alt && (
                <figcaption className="bg-[var(--bg-elevated)]/80 px-4 py-3 text-center text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)]">
                    {alt}
                </figcaption>
            )}
        </figure>
    ),

    /* Tables (GFM) */
    table: ({ children, ...props }) => (
        <div className="my-8 overflow-x-auto rounded-xl border border-[var(--border-default)]">
            <table className="w-full border-collapse min-w-[500px]" {...props}>
                {children}
            </table>
        </div>
    ),
    thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
    tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => (
        <tr className="even:bg-[var(--bg-wash)]" {...props}>
            {children}
        </tr>
    ),
    th: ({ children, ...props }) => (
        <th
            className="border-b border-[var(--border-default)] px-4 py-3 bg-[var(--accent)]/10 text-[var(--accent)] text-left font-semibold text-sm"
            {...props}
        >
            {children}
        </th>
    ),
    td: ({ children, ...props }) => (
        <td
            className="border-b border-[var(--border-subtle)] px-4 py-3 text-sm text-[var(--text-secondary)]"
            {...props}
        >
            {children}
        </td>
    ),
};

/* ─── Heading ID helper ────────────────────────────────────────── */
function toId(children: React.ReactNode): string {
    const text = typeof children === "string"
        ? children
        : Array.isArray(children)
            ? children.map((c) => (typeof c === "string" ? c : "")).join("")
            : "";
    return text
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/* ─── Public API ───────────────────────────────────────────────── */
interface MarkdownRendererProps {
    /** Raw markdown string */
    content: string;
    /** Additional className on the wrapper */
    className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    return (
        <div className={`markdown-content ${className}`.trim()}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {content}
            </ReactMarkdown>
        </div>
    );
}

/**
 * Lightweight inline-only renderer (bold + italic only).
 * Use for single-line text like TL;DR bullet items.
 */
export function MarkdownInline({ content, className = "" }: MarkdownRendererProps) {
    return (
        <span className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ children }) => <>{children}</>,
                    strong: ({ children, ...props }) => (
                        <strong className="text-[var(--text-primary)] font-semibold" {...props}>
                            {children}
                        </strong>
                    ),
                    em: ({ children, ...props }) => (
                        <em className="text-[var(--accent)]/80 italic" {...props}>
                            {children}
                        </em>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </span>
    );
}
