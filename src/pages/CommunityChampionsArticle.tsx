import React from 'react';
import { motion } from 'motion/react';
import imgPoster from "figma:asset/e3f8a2b021eb0d337580338dd10e709a1762494c.png";
import imgCrowd from "figma:asset/081f67bc0043a989fd3bbe690f2bc36895e2ae29.png";
import imgJenga from "figma:asset/03643ed23c45475ef78b3e0f363a5b886b5679a9.png";
import imgConversation from "figma:asset/acc45b75e300283fd839e68a5d16299f663b13b6.png";
import { SEOHead } from '../components/SEOHead';
import { CONTACT_INFO } from '../data/contactInfo';
import { HELENE_ONE_YEAR_DATE_ISO, HELENE_ONE_YEAR_DATE_LABEL } from '../data/impact2025';

// Image URLs 
const images = {
  scale: imgCrowd,
  interaction: imgConversation,
  action: imgPoster,
  connection: imgJenga
};

export default function CommunityChampionsArticle() {
  const articleTitle = 'When a Community Shows Up';
  const articleDescription =
    'Honoring volunteers from Helene: One Year of Healing whose service strengthened community resilience across Transylvania County and Western North Carolina.';
  const articlePath = '/community-champions/helene-one-year';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleTitle,
    description: articleDescription,
    image: [images.scale, images.interaction, images.action, images.connection],
    datePublished: HELENE_ONE_YEAR_DATE_ISO,
    author: {
      '@type': 'Organization',
      name: CONTACT_INFO.organizationName,
    },
    publisher: {
      '@id': CONTACT_INFO.organizationSchemaId,
    },
    mainEntityOfPage: `https://yoursparkpoint.org${articlePath}`,
    inLanguage: 'en-US',
  };

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Helene: One Year of Healing',
    description: 'A community tribute gathering honoring one year of recovery and connection after Hurricane Helene.',
    startDate: HELENE_ONE_YEAR_DATE_ISO,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventCompleted',
    image: [images.scale, images.action],
    location: {
      '@type': 'Place',
      name: 'Brevard Music Center',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Brevard',
        addressRegion: 'NC',
        addressCountry: 'US',
      },
    },
    organizer: {
      '@id': CONTACT_INFO.organizationSchemaId,
    },
  };

  return (
    <>
      <SEOHead
        title={`${articleTitle} | SparkPoint`}
        description={articleDescription}
        path={articlePath}
        canonicalPath="/stories/community-champions/helene-anniversary"
        type="article"
        image={images.scale}
        imageAlt="Community members gathering at Brevard Music Center for Helene: One Year of Healing"
        publishedTime={HELENE_ONE_YEAR_DATE_ISO}
        noindex
        jsonLd={[articleSchema, eventSchema]}
      />

      <div className="min-h-screen bg-[#0F0F0F] text-[#E5E5E5] pt-32 pb-24 font-serif selection:bg-[#E03694]/30">
        <article className="max-w-[760px] mx-auto px-6">
          
          {/* Header Section */}
          <header className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="block text-[#E03694] text-sm font-bold tracking-widest uppercase mb-6"
            >
              Community Champions
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-8 tracking-tight"
            >
              When a Community Shows Up
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl leading-relaxed text-[#A0A0A0] max-w-2xl mx-auto"
            >
              It started with a question: How do we honor a year of recovery without losing sight of the work that remains? The answer wasn’t in the programming. It was in the people who stood at the gates.
            </motion.p>
          </header>

          {/* Image 1: Event/Scale */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-16 rounded-lg overflow-hidden"
          >
            <img 
              src={images.scale} 
              alt="Brevard Music Center at dusk, filled with community members" 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </motion.div>

          {/* Body Section 1 */}
          <div className="space-y-8 mb-16 text-lg md:text-[19px] leading-[1.75] text-[#D4D4D4]">
            <p>
              On {HELENE_ONE_YEAR_DATE_LABEL}, the air at Brevard Music Center felt heavy with memory but light with presence. A year had passed since Hurricane Helene reshaped our landscape, and while the physical scars on the mountains were healing, the human story was still being written.
            </p>
            <p>
              We expected a crowd. What we didn’t fully anticipate was the spirit in which they would arrive. From the moment the gates opened, the atmosphere wasn’t one of spectacle, but of reunion. And the first faces they saw weren’t staff or security—they were neighbors.
            </p>
          </div>

          {/* Image 2: Interaction */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 rounded-lg overflow-hidden"
          >
            <img 
              src={images.interaction} 
              alt="Neighbors talking and connecting on the lawn" 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </motion.div>

          {/* Body Section 2 */}
          <div className="space-y-8 mb-16 text-lg md:text-[19px] leading-[1.75] text-[#D4D4D4]">
            <p>
              Dozens of volunteers stepped forward to steward this space. They directed parking with patience, handed out programs with genuine warmth, and simply stood present as hundreds of residents gathered on the lawn.
            </p>
            <p>
              In a year defined by rebuilding, the act of showing up for one another has become a quiet rhythm in Transylvania County. It’s no longer about emergency response; it’s about the sustained, often invisible work of holding space.
            </p>
          </div>

          {/* Pull Quote */}
          <motion.figure 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="my-20 text-center px-4 md:px-12"
          >
            <blockquote className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed opacity-90">
              “These moments don’t always make headlines—but they are the connective tissue that makes resilience possible.”
            </blockquote>
          </motion.figure>

          {/* Image 3: Action */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 rounded-lg overflow-hidden"
          >
            <img 
              src={images.action} 
              alt="Volunteers assisting attendees" 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </motion.div>

          {/* Body Section 3 */}
          <div className="space-y-8 mb-16 text-lg md:text-[19px] leading-[1.75] text-[#D4D4D4]">
            <p>
              Throughout the evening, we watched these champions move through the crowd. They weren’t looking for recognition. They were looking for gaps—someone who needed a chair, a family looking for a spot on the grass, a neighbor who just needed a hand to hold.
            </p>
            <p>
              This is what community infrastructure looks like in practice. It isn't just systems and funding; it is the willingness of individuals to extend themselves for the comfort of a stranger.
            </p>
          </div>

          {/* Image 4: Connection/Close */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 rounded-lg overflow-hidden"
          >
            <img 
              src={images.connection} 
              alt="A quiet moment of connection between generations" 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </motion.div>

          {/* Closing Section */}
          <footer className="pt-12 border-t border-white/10 text-center">
            <p className="text-xl md:text-2xl font-medium text-white mb-8 max-w-2xl mx-auto leading-relaxed">
              To every volunteer who wore a badge, pointed a way, or shared a smile: Thank you. You turned an event into a gathering, and a gathering into a community.
            </p>
            
            <p className="text-[#888] text-sm font-medium tracking-wide uppercase opacity-70">
              Helene: One Year of Healing · {HELENE_ONE_YEAR_DATE_LABEL} · Brevard Music Center
            </p>
            <p className="mt-8 text-sm text-[#BDBDBD]">
              Continue reading in{' '}
              <a href="/stories" className="text-[#E03694] hover:underline">
                SparkPoint Stories
              </a>{' '}
              or{' '}
              <a href="/intake?intent=contact" className="text-[#E03694] hover:underline">
                connect with our team
              </a>
              .
            </p>
          </footer>

        </article>
      </div>
    </>
  );
}
