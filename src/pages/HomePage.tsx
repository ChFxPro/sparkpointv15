import { Link } from 'react-router';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Hero } from '../components/Hero';
import { MissionGrid } from '../components/MissionGrid';
import { StoryHighlights } from '../components/StoryHighlights';
import { ImpactSection } from '../components/ImpactSection';
import { ConnectionSection } from '../components/ConnectionSection';
import { HomePromoShowcase } from '../components/HomePromoShowcase';
import { CTAFinal } from '../components/CTAFinal';
import { SEOHead } from '../components/SEOHead';

const InteractiveSparkPointInfographic = lazy(() => import('../imports/InteractiveSparkPointInfographic'));

export function HomePage() {
  const [showInfographic, setShowInfographic] = useState(false);
  const infographicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = infographicRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setShowInfographic(true);
        io.disconnect();
      }
    }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
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

      <Hero />
      <HomePromoShowcase />

      <MissionGrid />
      <div
        ref={infographicRef}
        className="min-h-[720px] lg:min-h-[1040px] bg-[#FFFDF9]/30"
        aria-hidden={showInfographic ? undefined : true}
      >
        {showInfographic && (
          <Suspense
            fallback={<div className="min-h-[720px] lg:min-h-[1040px] bg-[#FFFDF9]/30" aria-hidden="true" />}
          >
            <InteractiveSparkPointInfographic />
          </Suspense>
        )}
      </div>
      <StoryHighlights />
      <ImpactSection />
      <ConnectionSection />
      
      {/* Contextual SEO Content - Visually Subtle */}
      <section className="py-12 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-slate-500 text-sm leading-relaxed space-y-4 font-medium">
            <h2 className="text-base font-bold text-slate-700 mb-2">Rooted in Community, Growing Through Connection</h2>
            <p>
              SparkPoint serves as a vital connector for Transylvania County and the surrounding Western North Carolina region. Born from a collective desire to strengthen community well-being, we work to bridge gaps between individuals, resources, and opportunities. Our approach is grounded in the simple but powerful belief that resilience is built through relationships. When neighbors know neighbors, and when organizations collaborate rather than compete, the entire community thrives. We understand that true health extends beyond medical care. It includes where we live, how we connect, and the support systems that hold us up during challenging times.
            </p>
            <p>
              We operate not just as a service provider, but as a platform for engagement. From the Blue Zones Project roots to our current countywide initiatives, our mission remains focused on listening to local voices and responding with action. Whether it is coordinating emergency response efforts, facilitating wellness workshops, or creating spaces for meaningful conversation, SparkPoint is dedicated to fostering a culture of belonging. Learn how this approach guides our <Link to="/mission" className="text-[#E03694] underline hover:no-underline">mission framework</Link> and <Link to="/programs" className="text-[#E03694] underline hover:no-underline">community programs</Link>.
            </p>
            <p>
              Our work is driven by the stories and experiences of the people who live here. By amplifying community voices and supporting peer-led initiatives, we are building a network of care that extends beyond any single program. We believe every person has a role in shaping the health of our community. Through partnerships with local schools, healthcare providers, and civic groups, we keep support accessible and responsive to real-world needs. In a time when isolation is common, SparkPoint is a reminder that we are stronger together. Join us in <Link to="/get-involved" className="text-[#E03694] underline hover:no-underline">getting involved</Link> and strengthening collaboration across Transylvania County.
            </p>
        </div>
      </section>

      <CTAFinal />
    </>
  );
}
