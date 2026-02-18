"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-cv-void flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-6xl font-bold text-gold/30 mb-4">!</div>
                <h1 className="text-2xl font-bold text-white mb-3">
                    Something went wrong
                </h1>
                <p className="text-white/50 mb-8">
                    An unexpected error occurred. Please try again.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-2.5 rounded-lg bg-gold text-cv-primary font-semibold hover:bg-gold-light transition-colors"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-2.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
