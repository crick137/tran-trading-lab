import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { LiveTicker } from "@/components/home/live-ticker";
import { MarketPulse } from "@/components/home/market-pulse";
import { SwitchboardPreview } from "@/components/home/switchboard-preview";
import { LatestArticles } from "@/components/home/latest-articles";
import { BoldCallSpotlight } from "@/components/home/bold-call-spotlight";
import { CommunitySection } from "@/components/home/community-section";
import { SubscribeCTA } from "@/components/home/subscribe-cta";
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
            <main>
                <Hero />
                <LiveTicker />
                <MarketPulse />
                <SwitchboardPreview />
                <LatestArticles />
                <BoldCallSpotlight />
                <CommunitySection />
                <SubscribeCTA />
            </main>
            <Footer />
            <ExitIntentPopup />
        </>
    );
}
