'use client';

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { EVENTS, eventAssetUrl } from '../data/events';
import { ACTIVE_STORY_COLLECTIONS } from '../data/storyCollections';

const BASE = import.meta.env.BASE_URL;

const drOraEvent = EVENTS.find((event) => event.id === 'dr-ora-brain-healthy-habits-2026');
const ruralHealthEvent = EVENTS.find((event) => event.id === 'rural-health-convening-2026');
const storyCollection = ACTIVE_STORY_COLLECTIONS[0];

const coffeeImage = `${BASE}assets/events/pisgah_coffee_fundraiser/Sparkpoint Photos-1.webp`;

interface TileProps {
  image: string;
  kicker: string;
  title: string;
  copy: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
  featured?: boolean;
  delay?: number;
}

function HighlightTile({ image, kicker, title, copy, ctaLabel, ctaHref, external, featured, delay = 0 }: TileProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.45, 0, 0.55, 1] }}
      className={`group relative overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-xl ${featured ? 'md:row-span-3' : ''}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.05) 100%)' }}
          aria-hidden="true"
        />
      </div>
      <div
        className={`relative flex h-full flex-col justify-end p-6 md:p-8 ${
          featured ? 'min-h-[440px] md:min-h-[620px]' : 'min-h-[240px] md:min-h-[180px]'
        }`}
      >
        <span className="mb-2 inline-flex w-fit items-center text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FDB515]">
          {kicker}
        </span>
        <h3 className={`font-bold text-white ${featured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>{title}</h3>
        <p className={`mt-2 text-white/75 ${featured ? 'max-w-md text-base' : 'max-w-sm text-sm'}`}>{copy}</p>
        {external ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-white transition-colors hover:text-[#FDB515]"
          >
            {ctaLabel} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : (
          <Link
            to={ctaHref}
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-white transition-colors hover:text-[#FDB515]"
          >
            {ctaLabel} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </motion.article>
  );
}

export function StoryHighlights() {
  return (
    <section id="stories" className="relative overflow-hidden bg-white px-6 py-16 md:py-24">
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
          className="mb-10 text-center md:mb-14"
        >
          <h2
            className="mb-4"
            style={{ color: '#1A1A1A', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: '1.2', letterSpacing: '-1px' }}
          >
            Every story strengthens our community.
          </h2>
          <p
            className="mx-auto max-w-3xl"
            style={{ color: '#666666', fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: '1.5' }}
          >
            What&rsquo;s happening right now — upcoming talks, community-powered fundraisers, and the voices we&rsquo;re collecting along the way.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-[1.3fr_1fr] md:grid-rows-3">
          {drOraEvent && (
            <HighlightTile
              featured
              image={eventAssetUrl(drOraEvent)}
              kicker="Upcoming · Aug 10"
              title={drOraEvent.title}
              copy="Dr. Ora returns to the Transylvania County Library with the Alzheimer’s Association and NC Cooperative Extension — brain health, nutrition, and hands-on wellness for everyone."
              ctaLabel="Register now"
              ctaHref={drOraEvent.registrationPath ?? drOraEvent.detailPath}
              external
              delay={0.1}
            />
          )}
          {ruralHealthEvent && (
            <HighlightTile
              image={eventAssetUrl(ruralHealthEvent)}
              kicker="Oct 1 · Convening"
              title="Experience the Rural Health Field Simulator"
              copy="WNC's rural health leaders gather at Deerwoode Reserve to connect, collaborate, and step inside the Field Simulator together."
              ctaLabel="Explore the convening"
              ctaHref={ruralHealthEvent.detailPath}
              delay={0.2}
            />
          )}
          {storyCollection && (
            <HighlightTile
              image={storyCollection.image}
              kicker="Now collecting"
              title="Every voice counts"
              copy="Share your healthcare story — help us understand what's working, and what's not, across Transylvania County. Enter to win $100."
              ctaLabel="Share your story"
              ctaHref={storyCollection.formPath ?? '/stories'}
              delay={0.3}
            />
          )}
          <HighlightTile
            image={coffeeImage}
            kicker="Available now"
            title="The story behind the roast"
            copy="A family-owned roastery, a third annual collaboration, and a coffee that's building SparkPoint's Resilience Hub."
            ctaLabel="Read the story"
            ctaHref="/events/thrive-at-five"
            delay={0.4}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center md:mt-14"
        >
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] transition-colors"
            style={{ color: '#E03694' }}
          >
            Explore all stories <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
