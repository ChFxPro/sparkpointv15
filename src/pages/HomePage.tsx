import '../components/home/home.css';
import { HomeHero } from '../components/home/HomeHero';
import { HomeRoomStory } from '../components/home/HomeRoomStory';
import { HomeBackdrop } from '../components/home/HomeBackdrop';
import { HomeRegion } from '../components/home/HomeRegion';
import { HomePartners } from '../components/home/HomePartners';
import { HomeSpotlight } from '../components/home/HomeSpotlight';
import { HomeDoors } from '../components/HomeDoors';
import { ConnectionSection } from '../components/ConnectionSection';
import { ImpactSection } from '../components/ImpactSection';
import { CTAFinal } from '../components/CTAFinal';
import { SEOHead } from '../components/SEOHead';

// "In the same room": arrive among real faces, see what's featured, choose a
// door, zoom from home out to the region, see the programs, walk through a
// gathering, trust it (the number, then the partners), then pull up a chair.
// The county photo is pinned behind it all. What's featured lives in
// src/data/homeSpotlight.ts; styles live in components/home/home.css.
export function HomePage() {
  return (
    <div className="home">
      <SEOHead
        title="SparkPoint | Building Connection Across Western North Carolina"
        description="SparkPoint builds community connection and resilience in Transylvania County and Western North Carolina through stories, programs, and local collaboration."
        path="/"
        keywords={[
          'community connection',
          'Western North Carolina nonprofit',
          'community resilience',
          'Transylvania County collaboration',
          'SparkPoint',
        ]}
      />

      <HomeBackdrop />
      <HomeHero />
      <HomeSpotlight />
      <HomeDoors />
      <HomeRegion />
      <ConnectionSection />
      <HomeRoomStory />
      <ImpactSection />
      <HomePartners />
      <CTAFinal />
    </div>
  );
}
