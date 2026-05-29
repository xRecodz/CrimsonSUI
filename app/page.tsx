import { LandingNav } from '@/components/landing/landing-nav';
import { HeroSection } from '@/components/hero-section';
import { PoweredByMarquee } from '@/components/landing/powered-by-marquee';
import { LandingStatsStrip } from '@/components/landing/landing-stats-strip';
import { HowItWorks } from '@/components/how-it-works';
import { QuestTypes } from '@/components/quest-types';
import { LandingFeedback } from '@/components/landing/landing-feedback';
import { FaqSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/cta-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <LandingNav />
      <main className="w-full bg-background">
        <HeroSection />
        <PoweredByMarquee />
        <LandingStatsStrip />
        <HowItWorks />
        <QuestTypes />
        <LandingFeedback />
        <FaqSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}
