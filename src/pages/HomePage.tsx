import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/Hero';
import InteractiveSparkPointInfographic from '../imports/InteractiveSparkPointInfographic';
import { MissionGrid } from '../components/MissionGrid';
import { StoryCarousel } from '../components/StoryCarousel';
import { ImpactSection } from '../components/ImpactSection';
import { ConnectionSection } from '../components/ConnectionSection';
import { CTAFinal } from '../components/CTAFinal';
import heleneImage from 'figma:asset/0835779aef52124bf5c00840473e8285f8e0f937.png';
import echoesImage from 'figma:asset/e4e8c9f59f3a2b2ee1533f1f427ca4a4cb3693a5.png';
import { canonicalUrl } from '../lib/siteOrigin';

const stories = [
  {
    title: 'Helene: One Year of Healing',
    image: heleneImage,
    caption: 'A journey of resilience and community support through the recovery process, demonstrating the power of collective healing.'
  },
  {
    title: 'Echoes from the Community',
    image: echoesImage,
    caption: 'Voices sharing experiences of connection and belonging that define our community\'s strength and spirit.'
  },
  {
    title: 'Community Champions',
    image: 'https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJzJTIwaGVscGluZ3xlbnwxfHx8fDE3NjEwNzA2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Celebrating the volunteers and partners who work tirelessly to bring hope, resources, and action to those in need.'
  }
];

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>SparkPoint | Connection Is the Foundation of Community Well-Being</title>
        <meta name="description" content="Brief overview of SparkPoint’s role in fostering connection, storytelling, and shared resources in Western North Carolina." />
        <link rel="canonical" href={canonicalUrl('/')} />
      </Helmet>

      <Hero 
        heroImage="https://images.unsplash.com/photo-1629812205627-222da4a73816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwbGlnaHQlMjBtb3VudGFpbnxlbnwxfHx8fDE3NjEwODkwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
      />
      
      <MissionGrid />
      <InteractiveSparkPointInfographic />
      <StoryCarousel stories={stories} />
      <ImpactSection />
      <ConnectionSection />
      
      {/* Contextual SEO Content - Visually Subtle */}
      <section className="py-12 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-slate-500 text-sm leading-relaxed space-y-4 font-medium">
            <h2 className="text-base font-bold text-slate-700 mb-2">Rooted in Community, Growing Through Connection</h2>
            <p>
              SparkPoint serves as a vital connector for Transylvania County and the surrounding Western North Carolina region. Born from a collective desire to strengthen community well-being, we work to bridge gaps between individuals, resources, and opportunities. Our approach is grounded in the simple but powerful belief that resilience is built through relationships. When neighbors know neighbors, and when organizations collaborate rather than compete, the entire community thrives. We understand that true health extends beyond medical care—it encompasses where we live, how we connect, and the support systems that hold us up during challenging times.
            </p>
            <p>
              We operate not just as a service provider, but as a platform for engagement. From the Blue Zones Project roots to our current countywide initiatives, our mission remains focused on listening to local voices and responding with action. Whether it’s coordinating emergency response efforts, facilitating wellness workshops, or simply creating spaces for meaningful conversation, SparkPoint is dedicated to fostering a culture of belonging. By bringing together diverse partners—from healthcare systems to grassroots volunteers—we create a cohesive network that can adapt to the evolving needs of our residents.
            </p>
            <p>
              Our work is driven by the stories and experiences of the people who live here. By amplifying community voices and supporting peer-led initiatives, we are building a network of care that extends beyond any single program. We believe that every person has a role to play in shaping the health of our community. Through partnerships with local schools, healthcare providers, and civic groups, we ensure that support is accessible and responsive to real-world needs. In a time where isolation is common, SparkPoint stands as a reminder that we are stronger together. Join us in weaving a tighter fabric of community support that holds us all, ensuring that no one in Transylvania County has to navigate their journey alone.
            </p>
        </div>
      </section>

      <CTAFinal 
        backgroundImage="https://images.unsplash.com/photo-1694350461777-1519e03ef70a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBuYXR1cmUlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NjEwOTcyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
      />
    </>
  );
}
