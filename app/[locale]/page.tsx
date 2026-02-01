import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { LatestArticles } from "@/components/home/latest-articles";
import { SubscribeCTA } from "@/components/home/subscribe-cta";

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <LatestArticles />
                <SubscribeCTA />
            </main>
            <Footer />
        </>
    );
}
