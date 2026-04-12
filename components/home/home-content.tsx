"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChannelHeader } from "@/components/home/channel-header";
import { LiveTicker } from "@/components/home/live-ticker";
import { TabNavigation, type ContentTab } from "@/components/home/tab-navigation";
import { FeaturedContent } from "@/components/home/featured-content";
import { ContentFeed } from "@/components/home/content-feed";
import { PopularRanking } from "@/components/home/popular-ranking";
import { CategorySidebar } from "@/components/home/category-sidebar";
import { SubscribeCTA } from "@/components/home/subscribe-cta";
import type { UnifiedContentItem } from "@/lib/content-utils";

interface HomeContentProps {
    allContent: UnifiedContentItem[];
    stats: { total: number; briefings: number; blogs: number; research: number };
}

export function HomeContent({ allContent, stats }: HomeContentProps) {
    const [activeTab, setActiveTab] = useState<ContentTab>("all");

    return (
        <>
            <Navbar />
            <main id="main-content" className="pt-16">
                <ChannelHeader stats={stats} />
                <LiveTicker />

                {/* Featured section (always visible, unaffected by tab filter) */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                    <FeaturedContent items={allContent} />
                </section>

                {/* Tab filter — sits between featured and content feed */}
                <div id="content-feed-anchor" />
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Main content area with sidebar */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Content Feed - 70% */}
                        <div className="flex-1 min-w-0">
                            <ContentFeed activeTab={activeTab} allContent={allContent} />
                        </div>

                        {/* Sidebar - 30% */}
                        <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
                            <PopularRanking items={allContent} />
                            <CategorySidebar allContent={allContent} />
                            <SubscribeCTA variant="compact" />
                        </aside>
                    </div>
                </section>
                {/* Full-width Subscribe CTA — fills the gap before footer */}
                <SubscribeCTA variant="full" />
            </main>
            <Footer />
        </>
    );
}
