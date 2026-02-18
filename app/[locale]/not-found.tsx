import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-cv-void flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl font-bold text-gold/20 mb-6 font-mono">
                    404
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">
                    Page not found
                </h1>
                <p className="text-white/50 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex px-6 py-2.5 rounded-lg bg-gold text-cv-primary font-semibold hover:bg-gold-light transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
