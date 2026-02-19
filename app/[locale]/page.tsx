import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { LiveTicker } from "@/components/home/live-ticker";
import { ValueProposition } from "@/components/home/value-proposition";
import { MarketPulse } from "@/components/home/market-pulse";
import { WhatYouGet } from "@/components/home/what-you-get";
import { LatestArticles } from "@/components/home/latest-articles";
import { CommunitySection } from "@/components/home/community-section";
import { SubscribeCTA } from "@/components/home/subscribe-cta";
import { SectionReveal } from "@/components/ui/section-reveal";
import dynamic from "next/dynamic";
import { websiteJsonLd, organizationJsonLd } from "@/lib/json-ld";

const ExitIntentPopup = dynamic(
    () => import("@/components/ui/exit-intent-popup").then((mod) => mod.ExitIntentPopup),
    { ssr: false }
);

export default function Home() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
            />
            <Navbar />
            <main id="main-content">
                <Hero />
                <LiveTicker />
                <ValueProposition />
                <SectionReveal>
                    <MarketPulse />
                </SectionReveal>
                <SectionReveal>
                    <WhatYouGet />
                </SectionReveal>
                <SectionReveal>
                    <LatestArticles />
                </SectionReveal>
                <SectionReveal>
                    <CommunitySection />
                </SectionReveal>
                <SectionReveal>
                    <SubscribeCTA />
                </SectionReveal>
            </main>
            <Footer />
            <ExitIntentPopup />
        </>
    );
}
