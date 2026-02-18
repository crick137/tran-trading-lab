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
import { ExitIntentPopup } from "@/components/ui/exit-intent-popup";

export default function Home() {
    return (
        <>
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
