export default function Loading() {
    return (
        <div className="min-h-screen bg-cv-void">
            {/* Navbar skeleton */}
            <div className="h-16 border-b border-[var(--border-subtle)] bg-cv-primary/80">
                <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="h-6 w-40 rounded bg-[var(--bg-wash)] animate-pulse" />
                    <div className="hidden md:flex gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-4 w-16 rounded bg-[var(--bg-wash)] animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Hero skeleton */}
            <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <div className="space-y-4 max-w-2xl">
                    <div className="h-3 w-24 rounded bg-accent/20 animate-pulse" />
                    <div className="h-10 w-3/4 rounded bg-[var(--bg-wash)] animate-pulse" />
                    <div className="h-10 w-1/2 rounded bg-[var(--bg-wash)] animate-pulse" />
                    <div className="h-5 w-full rounded bg-[var(--bg-wash)] animate-pulse mt-4" />
                    <div className="h-5 w-2/3 rounded bg-[var(--bg-wash)] animate-pulse" />
                </div>

                <div className="flex gap-4 mt-8">
                    <div className="h-11 w-36 rounded-lg bg-accent/10 animate-pulse" />
                    <div className="h-11 w-32 rounded-lg bg-[var(--bg-wash)] animate-pulse" />
                </div>
            </div>

            {/* Content grid skeleton */}
            <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-[var(--border-subtle)] bg-cv-elevated p-6 space-y-4"
                        >
                            <div className="h-4 w-20 rounded bg-[var(--bg-wash)] animate-pulse" />
                            <div className="h-6 w-3/4 rounded bg-[var(--bg-wash)] animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-full rounded bg-[var(--bg-wash)] animate-pulse" />
                                <div className="h-4 w-5/6 rounded bg-[var(--bg-wash)] animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gold accent loading bar at top */}
            <div className="fixed top-0 left-0 right-0 h-0.5 z-50 overflow-hidden">
                <div
                    className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]"
                />
            </div>
        </div>
    );
}
