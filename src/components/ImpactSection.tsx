'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { IMPACT_2025 } from '../data/impact2025';
import { DotField } from './home/DotField';
import { useAccessibility } from '../context/AccessibilityContext';

// Testimonials Data
type TestimonialPhase = 'listen' | 'learn' | 'lead';

type Testimonial = {
  quote: string;
  author: string;
  affiliation: string;
  phase: TestimonialPhase;
};
const testimonials: Testimonial[] = [
  {
    quote:
      "Your presence on campus today was wonderful and really made a lot of students and staff smile, so we all thank you so much for your time. You made a great impact on campus.",
    author: "Marion Hawsey",
    affiliation: "BRCC Student",
    phase: "lead",
  },
  {
    quote: "You made the group feel comfortable.",
    author: "GH",
    affiliation: "SparkPurpose Participant",
    phase: "listen",
  },
  {
    quote: "The session exceeded our expectations!",
    author: "Alison C.",
    affiliation: "Gaia Herbs",
    phase: "lead",
  },
  {
    quote: "Grounds me to remember my why so I can stay true to myself.",
    author: "GH",
    affiliation: "SparkPurpose Participant",
    phase: "learn",
  },
  {
    quote: "This session got our juices flowing and opened the conversation for dialogue.",
    author: "GH",
    affiliation: "SparkPurpose Participant",
    phase: "learn",
  },
  {
    quote:
      "Growth through understanding more about each other so that we can make informed decisions.",
    author: "GH",
    affiliation: "SparkPurpose Participant",
    phase: "learn",
  },
  {
    quote:
      "We are a stronger team because we are better aligned, all moving in the same direction.",
    author: "GH",
    affiliation: "SparkPurpose Participant",
    phase: "lead",
  },
  {
    quote:
      "This workshop was a reminder of how human we are… while we connect, laugh & give grace to each other.",
    author: "GH",
    affiliation: "SparkPurpose Participant",
    phase: "listen",
  },
  {
    quote:
      "This group (SparkPoint) is one of our favorites. They put feet in motion to back up their words, all with the hope of building our community up.",
    author: "Dan Courtine",
    affiliation: "Jameson’s Joy Founder",
    phase: "lead",
  },
  {
    quote:
      "Your dedication to enlivening community spaces for social wellness in Brevard is truly commendable and inspiring.",
    author: "Grace Champion",
    affiliation: "UNC Asheville",
    phase: "lead",
  },
  // The following testimonial is long-form, moved out of the carousel for later reuse:
  // {
  //   quote:
  //     "I walked into this workshop hoping to find a sense of direction that has been lacking recently. I came away with clarity, a feeling of connection, and an affirmation of my purpose. This was two hours very well spent in an environment that encouraged honesty, transparency, and vulnerability without judgment. I would recommend this workshop for anyone who needs to find or reaffirm their own purpose.",
  //   author: "Karen Tilson Pearce",
  //   affiliation: "SparkPurpose Participant",
  //   phase: "learn",
  // },
  {
    quote: "It was absolutely wonderful! I can’t recommend it highly enough.",
    author: "Vickie Baker",
    affiliation: "SparkPurpose Participant",
    phase: "lead",
  },
];

const longFormTestimonials: Testimonial[] = [
  {
    quote:
      "I walked into this workshop hoping to find a sense of direction that has been lacking recently. I came away with clarity, a feeling of connection, and an affirmation of my purpose. This was two hours very well spent in an environment that encouraged honesty, transparency, and vulnerability without judgment. I would recommend this workshop for anyone who needs to find or reaffirm their own purpose.",
    author: "Karen Tilson Pearce",
    affiliation: "SparkPurpose Participant",
    phase: "learn",
  },
];

// The homepage shows four named voices; the full set stays in `testimonials`.
const HOMEPAGE_VOICES = ['Karen Tilson Pearce', 'Marion Hawsey', 'Grace Champion', 'Vickie Baker'];
const carouselTestimonials: Testimonial[] = HOMEPAGE_VOICES.map(
  (name) => [...longFormTestimonials, ...testimonials].find((t) => t.author === name)!
).filter(Boolean);


// Participant voices: the quote on the left, the people on the right. All
// quotes share one grid cell, so the block is always as tall as the longest
// quote and nothing below it moves when the quote changes. It advances slowly
// on its own (a gold line fills under the current name), stops on hover,
// focus, or the pause button, and any name can be picked directly.
function Voices({ items, intervalMs = 9000 }: { items: Testimonial[]; intervalMs?: number }) {
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const reducedMotion = Boolean(systemReducedMotion) || motionPreference === 'reduce';
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const running = !reducedMotion && !paused && !holding && items.length > 1;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % items.length), intervalMs);
    return () => window.clearTimeout(id);
  }, [running, active, intervalMs, items.length]);

  return (
    <div
      className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16"
      onMouseEnter={() => setHolding(true)}
      onMouseLeave={() => setHolding(false)}
      onFocusCapture={() => setHolding(true)}
      onBlurCapture={() => setHolding(false)}
    >
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)]" aria-live={running ? 'off' : 'polite'}>
        {items.map((t, i) => (
          <figure
            key={t.author}
            className="home-voice col-start-1 row-start-1"
            data-active={i === active ? 'true' : 'false'}
            aria-hidden={i !== active || undefined}
          >
            <span aria-hidden="true" className="block text-7xl font-extrabold leading-none text-[#FDB515]" style={{ fontFamily: 'var(--home-display)' }}>
              &ldquo;
            </span>
            <blockquote
              className="mt-2 text-white"
              style={{
                fontSize: t.quote.length > 220 ? 'clamp(1.2rem, 1.8vw, 1.5rem)' : 'clamp(1.5rem, 2.6vw, 2.25rem)',
                lineHeight: t.quote.length > 220 ? 1.55 : 1.35,
                fontWeight: 600,
                maxWidth: '44ch',
              }}
            >
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 text-base">
              <span className="font-bold text-white">{t.author}</span>
              <span className="text-white/75"> · {t.affiliation}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="min-w-0 lg:self-end">
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
          {items.map((t, i) => (
            <li key={t.author} className="flex-none lg:border-t lg:border-white/15">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className="home-voice-name group relative block min-h-[44px] w-full rounded-full px-4 py-2 text-left lg:rounded-none lg:px-0 lg:py-4"
                data-active={i === active ? 'true' : 'false'}
              >
                <span className="block font-bold text-white">{t.author}</span>
                <span className="hidden text-sm text-white/70 lg:block">{t.affiliation}</span>
                {i === active && running && (
                  <span
                    key={`${active}-${running}`}
                    aria-hidden="true"
                    className="home-voice-timer absolute bottom-0 left-0 hidden h-[2px] w-full origin-left bg-[#FDB515] lg:block"
                    style={{ animationDuration: `${intervalMs}ms` }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
        {!reducedMotion && items.length > 1 && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded text-sm font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            {paused ? 'Play quotes' : 'Pause quotes'}
          </button>
        )}
      </div>
    </div>
  );
}

const numberFormat = new Intl.NumberFormat('en-US');

// The homepage proof band: one honest number in context, one participant
// voice, and the partner network. The full 2025 breakdown lives on /impact.
export function ImpactSection() {
  return (
    <section
      id="impact"
      aria-labelledby="impact-heading"
      className="relative overflow-hidden px-6 py-16 md:py-24"
      style={{ backgroundColor: '#2A1430' }}
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 grid gap-12 md:mb-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <h2 id="impact-heading" className="home-h2 mb-8 text-white">
              Our 2025, in one number
            </h2>
            <p
              className="text-white"
              style={{ fontFamily: '"Manrope", sans-serif', fontSize: 'clamp(4rem, 12vw, 7.5rem)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em' }}
            >
              {numberFormat.format(IMPACT_2025.attendanceTotalRecordedMinimum)}
            </p>
            <p className="mt-4 max-w-md text-2xl font-semibold leading-snug text-white">
              times neighbors showed up to a SparkPoint gathering.
            </p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">
              Across {IMPACT_2025.eventsLogged} events in 2025, in a county of about 33,000 people.
              That count is a floor: {IMPACT_2025.eventsMissingAttendance} events had no headcount.
            </p>
            <Link
              to="/impact"
              className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-base font-bold text-white underline underline-offset-4 hover:text-[#FDB515]"
            >
              See the full 2025 impact <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <figure>
            <DotField total={IMPACT_2025.attendanceTotalRecordedMinimum} />
            <figcaption className="mt-4 flex items-center gap-2 text-sm text-white/75">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FDB515]" aria-hidden="true" />
              Each dot is 10 times someone showed up.
            </figcaption>
          </figure>
        </div>

        <div className="border-t border-white/15 pt-14 md:pt-20">
          <Voices items={carouselTestimonials} />
        </div>
      </div>
    </section>
  );
}
