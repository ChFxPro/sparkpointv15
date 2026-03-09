'use client';

import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Activity, Users, TrendingUp, Target, ChevronLeft, ChevronRight, GraduationCap, Mic, Heart, Sparkles } from 'lucide-react';
import {
  IMPACT_2025,
  IMPACT_2025_ANCHOR_ATTENDANCE_TOTAL,
  IMPACT_2025_NOVEMBER_SHARE_PERCENT,
} from '../data/impact2025';
import impactBg from '../assets/connection_happens/vos1.webp';

// Shared glass card styles (keeps Impact section cohesive)
const GLASS_CARD = {
  background: 'linear-gradient(135deg, rgba(25, 25, 35, 0.65), rgba(15, 15, 25, 0.55))',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.28)',
  boxShadow: '0 20px 70px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255,255,255,0.25)',
} as const;

const GLASS_CARD_STRONG = {
  ...GLASS_CARD,
  background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.78), rgba(20, 20, 20, 0.68))',
  border: '1px solid rgba(255, 255, 255, 0.32)',
} as const;

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

const carouselTestimonials: Testimonial[] = testimonials;

function CountUp({
  end,
  duration = 2,
  suffix = '',
  start = false,
}: {
  end: number;
  duration?: number;
  suffix?: string;
  start?: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!start || hasStarted.current) return;
    hasStarted.current = true;

    let startTime: number | null = null;
    let rafId = 0;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [start, end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}


function TestimonialCarousel({
  items,
  intervalMs = 7000,
}: {
  items: Testimonial[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const total = items.length;
  const safeIndex = ((index % total) + total) % total;

  const goTo = (next: number) => setIndex(((next % total) + total) % total);
  const next = () => goTo(safeIndex + 1);
  const prev = () => goTo(safeIndex - 1);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (isPaused) return;
    if (total <= 1) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, isPaused, prefersReducedMotion, total]);

  const current = items[safeIndex];
  const phaseMeta = {
    listen: {
      label: 'Listen',
      icon: Heart,
      gold: 'rgba(253,181,21,0.92)',
      tint: 'rgba(224,54,148,0.92)',
    },
    learn: {
      label: 'Learn',
      icon: Sparkles,
      gold: 'rgba(253,181,21,0.92)',
      tint: 'rgba(158,80,159,0.92)',
    },
    lead: {
      label: 'Lead',
      icon: Mic,
      gold: 'rgba(253,181,21,0.92)',
      tint: 'rgba(253,181,21,0.95)',
    },
  } as const;
  const phaseLabel = phaseMeta[current.phase].label;
  const PhaseIcon = phaseMeta[current.phase].icon;
  const phaseTint = phaseMeta[current.phase].tint;

  const seconds = Math.round(intervalMs / 1000);
  const carouselHelp = prefersReducedMotion
    ? 'Carousel. Use Previous and Next to navigate.'
    : `Carousel. Advances every ${seconds} seconds. Hover or focus to pause.`;

  const pointerStartX = useRef<number | null>(null);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    pointerStartX.current = e.clientX;
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const start = pointerStartX.current;
    pointerStartX.current = null;
    if (start == null) return;

    const delta = e.clientX - start;
    // Ignore tiny moves
    if (Math.abs(delta) < 40) return;
    if (delta < 0) next();
    else prev();
  };

  return (
    <div
      className="relative max-w-5xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{ touchAction: 'pan-y' }}
      aria-roledescription="carousel"
      aria-label="Testimonials"
      aria-describedby="testimonial-carousel-help"
    >
      <p id="testimonial-carousel-help" className="sr-only">
        {carouselHelp}
      </p>
      <div
        className="relative rounded-2xl p-7 md:p-10 overflow-hidden"
        style={GLASS_CARD_STRONG}
      >
        {/* Phase badge (consistent anchor) */}
        <div className="absolute left-5 top-5 z-20">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              background: 'rgba(0,0,0,0.18)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            }}
          >
            <span
              className="inline-flex items-center justify-center rounded-full"
              style={{
                width: 30,
                height: 30,
                background: 'rgba(253,181,21,0.16)',
                border: `1px solid ${phaseTint}`,
                boxShadow: '0 0 18px rgba(253,181,21,0.18)',
                color: phaseTint,
              }}
              aria-hidden="true"
            >
              <PhaseIcon className="w-4 h-4" />
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800 as any,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.80)',
              }}
            >
              {phaseLabel}
            </span>
          </div>
        </div>
        {/* Progress line (quiet, calm) */}
        {!prefersReducedMotion && total > 1 && (
          <div className="absolute left-0 right-0 top-0 h-[3px] bg-white/10">
            <motion.div
              key={safeIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: intervalMs / 1000, ease: 'linear' }}
              className="h-full"
              style={{ background: 'rgba(255, 255, 255, 0.45)' }}
            />
          </div>
        )}

        {/* Subtle gold grazing light (adds depth without noise) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(800px 280px at 20% 22%, rgba(253,181,21,0.12), rgba(253,181,21,0) 62%), radial-gradient(900px 340px at 80% 72%, rgba(224,54,148,0.10), rgba(224,54,148,0) 64%)',
          }}
        />

        {/* Watermark + subtle structure (consistent placement) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Watermark word (consistent anchor + mostly readable) */}
          <div
            className="absolute select-none"
            style={{
              right: '-2%',
              bottom: '-8%',
              transform: 'rotate(-12deg)',
              fontSize: 'clamp(130px, 16vw, 230px)',
              fontWeight: 900,
              letterSpacing: '0.10em',
              lineHeight: 0.9,
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.12)',
              textShadow: '0 18px 48px rgba(0,0,0,0.35)',
            }}
          >
            {phaseLabel}
          </div>

          {/* Inner edge */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          />

          {/* Soft corner glints */}
          <div
            className="absolute -top-10 -left-10 h-40 w-40 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(253,181,21,0.14), rgba(253,181,21,0) 66%)',
              filter: 'blur(16px)',
              opacity: 0.85,
            }}
          />
          <div
            className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 70% 70%, rgba(224,54,148,0.12), rgba(224,54,148,0) 68%)',
              filter: 'blur(18px)',
              opacity: 0.8,
            }}
          />
        </div>

        <div className="relative flex flex-col" style={{ minHeight: 'clamp(190px, 18vw, 240px)' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={safeIndex}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-left"
            >
              <blockquote
                className="text-white/95"
                style={{
                  fontSize: 'clamp(1.1rem, 2.0vw, 1.55rem)',
                  lineHeight: 1.65,
                  fontWeight: 520 as any,
                  maxWidth: '60ch',
                  paddingTop: '56px',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.38)',
                }}
              >
                <span className="sr-only">Quote: </span>
                “{current.quote}”
              </blockquote>

              <figcaption className="mt-6">
                {/* Name + affiliation lockup (baseline-aligned, all-caps, thick/thin) */}
                <div
                  className="inline-flex flex-wrap"
                  style={{
                    alignItems: 'center',
                    gap: '0.55rem',
                    rowGap: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.16rem',
                      fontWeight: 860 as any,
                      color: 'rgba(255,255,255,0.98)',
                      letterSpacing: '0.02em',
                      lineHeight: 1.05,
                      textShadow: '0 2px 10px rgba(0,0,0,0.35)',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      textTransform: 'uppercase',
                    }}
                  >
                    {current.author.toUpperCase()}
                  </span>

                  <span
                    style={{
                      fontSize: '1.16rem',
                      fontWeight: 360 as any,
                      letterSpacing: '0.30em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.62)',
                      lineHeight: 1.05,
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      // tiny optical nudge for consistent cap-height alignment across weights
                      transform: 'translateY(0.02em)',
                    }}
                  >
                    {current.affiliation.toUpperCase()}
                  </span>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ marginTop: 'auto' }}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                className="inline-flex items-center justify-center rounded-full px-3.5 py-2 text-sm text-white/80 hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(0,0,0,0.10)' }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={next}
                className="inline-flex items-center justify-center rounded-full px-3.5 py-2 text-sm text-white/80 hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(0,0,0,0.10)' }}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-4" aria-label="Testimonial progress">
              <div className="text-white/85" style={{ fontSize: '0.95rem', letterSpacing: '0.06em' }}>
                {safeIndex + 1} <span className="text-white/35">/</span> {total}
              </div>
              <div className="h-[2px] w-40 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.14)' }}>
                <div
                  className="h-full"
                  style={{
                    width: `${((safeIndex + 1) / total) * 100}%`,
                    background:
                      'linear-gradient(90deg, rgba(253,181,21,0), rgba(253,181,21,0.85), rgba(253,181,21,0))',
                    boxShadow: '0 0 14px rgba(253,181,21,0.22)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { PartnerNetworkHub } from './PartnerNetworkHub';

export function ImpactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const impactBreakdown = [
    {
      title: "Youth & Education",
      icon: GraduationCap,
      color: "#9E509F", // Purple
      stats: [
        "School and youth-centered sessions throughout 2025",
        "Story and leadership activities for students countywide",
        "Partnerships spanning schools, colleges, and youth programs"
      ]
    },
    {
      title: "Community & Adult Engagement",
      icon: Users,
      color: "#F15F48", // Coral
      stats: [
        "Community conversations and leadership gatherings",
        "Community conversations, leadership talks, recovery events",
        "Coalition and partner-hosted sessions included"
      ]
    },
    {
      title: "Education, Training & Capacity Building",
      icon: Sparkles,
      color: "#FDB515", // Gold
      stats: [
        "Training and facilitation for partner and community groups",
        "LEAD, SupportEd, Y2Y, workforce-aligned trainings",
        "College and community-based formats"
      ]
    },
    {
      title: "Story & Voice Infrastructure",
      icon: Mic,
      color: "#E03694", // Pink
      stats: [
        "Countywide story collection touchpoints",
        "Resident interviews captured through story sessions",
        "Countywide, multi-partner locations"
      ]
    }
  ];

  return (
    <section
      id="impact"
      ref={ref}
      className="relative py-12 md:py-20 px-6 overflow-hidden"
    >
      {/* Background with Parallax */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={impactBg}
          alt=""
          className="w-full h-full object-cover opacity-30"
          style={{ willChange: 'transform' }}
          width={2000}
          height={1333}
          loading="lazy"
          decoding="async"
          initial={{ y: 0 }}
          whileInView={{ y: -20 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, ease: [0.45, 0, 0.55, 1] }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(158, 80, 159, 0.92) 0%, rgba(224, 54, 148, 0.92) 50%, rgba(253, 181, 21, 0.88) 100%)'
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* A. Hero Section */}
        <div className="text-center mb-12 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-white mb-8 md:mb-12"
            style={{
              fontSize: 'clamp(2.2rem, 8.5vw, 3.5rem)',
              lineHeight: '1.2',
              letterSpacing: '-1px',
              textShadow: '0px 4px 12px rgba(0, 0, 0, 0.8), 0px 2px 6px rgba(0, 0, 0, 0.6)'
            }}
          >
            Trust built through visibility and shared success.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 1.2 }}
            className="p-6 md:p-8 rounded-xl"
            style={GLASS_CARD_STRONG}
          >
              <div className="text-white mb-2" style={{ fontSize: 'clamp(2.6rem, 11vw, 4rem)', fontWeight: '700', textShadow: '0 3px 8px rgba(0, 0, 0, 0.6)' }}>
                <CountUp end={IMPACT_2025.attendanceTotalRecordedMinimum} duration={1.5} suffix="+" start={isInView} />
              </div>
              <p className="text-white" style={{ fontSize: 'clamp(1rem, 3.7vw, 1.25rem)', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Recorded Attendance (2025 minimum)
              </p>
            </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 1.2 }}
            className="p-6 md:p-8 rounded-xl"
            style={GLASS_CARD_STRONG}
          >
              <div className="text-white mb-2" style={{ fontSize: 'clamp(2.6rem, 11vw, 4rem)', fontWeight: '700', textShadow: '0 3px 8px rgba(0, 0, 0, 0.6)' }}>
                <CountUp end={IMPACT_2025.uniqueCollaboratingOrganizationCount} duration={1.5} start={isInView} />
              </div>
              <p className="text-white" style={{ fontSize: 'clamp(1rem, 3.7vw, 1.25rem)', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Collaborating Organizations (2025)
              </p>
            </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="p-6 md:p-8 rounded-xl"
            style={GLASS_CARD_STRONG}
          >
              <div className="text-white mb-2" style={{ fontSize: 'clamp(2.6rem, 11vw, 4rem)', fontWeight: '700', textShadow: '0 3px 8px rgba(0, 0, 0, 0.6)' }}>
                <CountUp end={IMPACT_2025.monthsActiveProgramming} duration={1.5} start={isInView} />
              </div>
              <p className="text-white" style={{ fontSize: 'clamp(1rem, 3.7vw, 1.25rem)', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Months Active in 2025
              </p>
            </motion.div>
          </div>

          {/* Testimonial Carousel */}
          <TestimonialCarousel items={carouselTestimonials} />
        </div>

        {/* B. Impact Overview (REPLACED SECTION) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
            <h2 
              className="text-white mb-6"
              style={{
                fontSize: 'clamp(2rem, 7.5vw, 3rem)',
                lineHeight: '1.1',
                fontWeight: '700',
                letterSpacing: '-1px',
                textShadow: '0px 4px 12px rgba(0, 0, 0, 0.6)'
              }}
            >
              Community Impact, at County Scale
            </h2>
            <p 
              className="text-white/90"
              style={{
                fontSize: 'clamp(1rem, 3.8vw, 1.25rem)',
                lineHeight: '1.6',
                fontWeight: '400',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
              }}
            >
              In a rural county of approximately 33,000 residents, SparkPoint focuses on sustained presence, shared infrastructure, and meaningful connection across youth, families, and partners.
            </p>
          </div>

          {/* Impact At-A-Glance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-12 md:mb-16">
  {[
    {
      value: IMPACT_2025.eventsLogged,
      label: "Total Events & Sessions (2025)",
      note: "Canonical annual total from SparkPoint 2025 impact tracking",
    },
    {
      value: IMPACT_2025.attendanceTotalRecordedMinimum,
      label: "Verified Attendance Moments",
      note: "Minimum recorded attendance across events with attendance data",
    },
    {
      value: IMPACT_2025.uniqueCollaboratingOrganizationCount,
      label: "Collaborating Organizations (2025)",
      note: "Unique collaborating organization tokens in 2025 tracking data",
    },
    {
      value: IMPACT_2025.monthsActiveProgramming,
      label: "Months of Active Programming",
      note: "January–December (full-year reporting)",
    },
  ].map((metric, index) => (
    <motion.div
      key={metric.label}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 md:p-8 rounded-xl flex flex-col justify-between"
      style={GLASS_CARD}
    >
      <div className="mb-4">
        <div
          className="text-white mb-2"
          style={{ fontSize: "clamp(2.4rem, 10.5vw, 3.5rem)", fontWeight: "700", lineHeight: 1 }}
        >
          <CountUp end={metric.value} duration={1.5} suffix={metric.suffix || ""} start={isInView} />
        </div>
        <h3 className="text-white/90 font-bold text-lg leading-tight mb-2">
          {metric.label}
        </h3>
      </div>
      <p className="text-white/60 text-sm leading-snug">
        {metric.note}
      </p>
    </motion.div>
  ))}
</div>


          {/* Impact Breakdown Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 mb-12 md:mb-16">
            {impactBreakdown.map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="p-6 md:p-8 rounded-xl h-full"
                style={{
                  ...GLASS_CARD,
                  borderTop: `4px solid ${group.color}`,
                }}
              >
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${group.color}20`, color: group.color }}
                  >
                    <group.icon size={28} />
                  </div>
                  <h3 className="text-white text-xl font-bold">{group.title}</h3>
                </div>
                <ul className="space-y-3 md:space-y-4">
                  {group.stats.map((stat, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/90">
                      <span 
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: group.color }} 
                      />
                      <span className="text-base leading-relaxed">{stat}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Anchor Moments */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-6 md:p-10 rounded-2xl mb-8 relative overflow-hidden"
            style={{
              ...GLASS_CARD,
              background: 'linear-gradient(135deg, rgba(224, 54, 148, 0.14), rgba(253, 181, 21, 0.06))',
            }}
          >
            <div className="relative z-10 flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-16 items-start lg:items-center justify-between">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-[#FDB515]/20 text-[#FDB515] border border-[#FDB515]/30">
                    <Target size={28} />
                  </div>
                  <h3 className="text-white text-2xl md:text-3xl font-bold">Anchor Moments & Momentum</h3>
                </div>
                
                <div className="bg-black/20 rounded-xl p-5 md:p-6 border border-white/10 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
                    <p className="text-[#FDB515] font-bold text-sm uppercase tracking-wider">
                      3 Anchor Program Highlights
                    </p>
                    <p className="text-white/60 text-xs uppercase tracking-wider">
                      2025 total attendance
                    </p>
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 md:gap-y-4 gap-x-8">
                    <li className="text-white text-lg font-semibold flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FDB515] flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="leading-snug">Helene: One Year of Healing</span>
                        <span className="mt-1 inline-flex items-center gap-2 text-white/70 text-xs uppercase tracking-[0.18em]">
                          <span className="inline-flex items-center justify-center rounded-full px-2 py-0.5"
                            style={{ background: 'rgba(253,181,21,0.14)', border: '1px solid rgba(253,181,21,0.28)' }}
                          >
                            Attendance
                          </span>
                          <span className="text-white/90" style={{ letterSpacing: '0.06em' }}>
                            {IMPACT_2025.anchorProgramAttendance.heleneOneYearOfHealing.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </li>

                    <li className="text-white text-lg font-semibold flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FDB515] flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="leading-snug">Dr. Ora Brain Health Talks</span>
                        <span className="mt-1 inline-flex items-center gap-2 text-white/70 text-xs uppercase tracking-[0.18em]">
                          <span className="inline-flex items-center justify-center rounded-full px-2 py-0.5"
                            style={{ background: 'rgba(253,181,21,0.14)', border: '1px solid rgba(253,181,21,0.28)' }}
                          >
                            Attendance
                          </span>
                          <span className="text-white/90" style={{ letterSpacing: '0.06em' }}>
                            {IMPACT_2025.anchorProgramAttendance.drOraBrainHealthSeries.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </li>

                    <li className="text-white text-lg font-semibold flex items-start gap-3 sm:col-span-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FDB515] flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="leading-snug">VOS Events & Programming</span>
                        <span className="mt-1 inline-flex items-center gap-2 text-white/70 text-xs uppercase tracking-[0.18em]">
                          <span className="inline-flex items-center justify-center rounded-full px-2 py-0.5"
                            style={{ background: 'rgba(253,181,21,0.14)', border: '1px solid rgba(253,181,21,0.28)' }}
                          >
                            Attendance
                          </span>
                          <span className="text-white/90" style={{ letterSpacing: '0.06em' }}>
                            {IMPACT_2025.anchorProgramAttendance.vosEventsAndProgramming.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="w-full lg:w-auto mt-4 lg:mt-0 pl-0 lg:pl-10 lg:border-l border-white/10">
                <div className="rounded-xl p-5 md:p-6 bg-black/10 border border-white/10 backdrop-blur-sm">
                  <div
                    className="text-white tracking-tight"
                    style={{ fontSize: 'clamp(3.2rem, 6vw, 4.6rem)', fontWeight: 800, lineHeight: 1, textShadow: '0 6px 22px rgba(0,0,0,0.45)' }}
                  >
                    {IMPACT_2025_ANCHOR_ATTENDANCE_TOTAL.toLocaleString()}
                  </div>
                  <div className="mt-3 text-white/80 font-semibold text-sm uppercase tracking-[0.16em] leading-snug">
                    Total Anchor Attendance
                  </div>
                  <div className="mt-1 text-white/55 text-xs uppercase tracking-[0.18em]">
                    2025 combined programs
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* F. "Why It Matters" Panel (Retained) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-20"
        >
          <h3 className="text-white text-center mb-8 md:mb-12" style={{ fontSize: 'clamp(2rem, 7vw, 2.5rem)', fontWeight: '700', textShadow: '0 3px 8px rgba(0, 0, 0, 0.6)' }}>
            Why It Matters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-6 md:p-8 rounded-xl"
              style={{
                ...GLASS_CARD_STRONG,
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.78), rgba(224, 54, 148, 0.22), rgba(158, 80, 159, 0.18))',
                border: '1px solid rgba(224, 54, 148, 0.42)',
                boxShadow: '0 18px 60px rgba(0, 0, 0, 0.55), 0 10px 26px rgba(224, 54, 148, 0.18), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <div style={{ fontSize: 'clamp(2.6rem, 11vw, 4rem)', fontWeight: '700', color: 'white', textShadow: '0 3px 8px rgba(0, 0, 0, 0.7)' }}>51%</div>
              <p style={{ color: 'white', fontSize: '1.25rem', marginTop: '8px', textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>
                of residents report loneliness
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-6 md:p-8 rounded-xl"
              style={{
                ...GLASS_CARD_STRONG,
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.78), rgba(253, 181, 21, 0.18), rgba(241, 95, 72, 0.16))',
                border: '1px solid rgba(253, 181, 21, 0.42)',
                boxShadow: '0 18px 60px rgba(0, 0, 0, 0.55), 0 10px 26px rgba(253, 181, 21, 0.16), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <div style={{ fontSize: 'clamp(2.6rem, 11vw, 4rem)', fontWeight: '700', color: 'white', textShadow: '0 3px 8px rgba(0, 0, 0, 0.7)' }}>37%</div>
              <p style={{ color: 'white', fontSize: '1.25rem', marginTop: '8px', textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>
                report anxiety or trauma
              </p>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-6 md:mt-8"
            style={{ color: 'white', fontSize: 'clamp(1rem, 3.4vw, 1.125rem)', lineHeight: '1.7', textShadow: '0 2px 6px rgba(0, 0, 0, 0.7)' }}
          >
            These challenges make our work more critical than ever. Through connection, 
            preparedness, and wellness programs, SparkPoint is building a resilient, 
            supported community where no one faces hardship alone.
          </motion.p>
        </motion.div>

        {/* E. Partner Network Map (Moved) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-20"
        >
          <PartnerNetworkHub />
        </motion.div>

        {/* G. Community Built in Transylvania County (Refined) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pb-12 md:pb-20"
        >
          {/* Headline moved outside container */}
          <div className="text-center mb-12 md:mb-16 px-4 md:px-6">
            <h3 className="text-white mb-5 md:mb-6 leading-tight" style={{ fontSize: 'clamp(2rem, 7.5vw, 3rem)', fontWeight: '700', letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}>
              Community Built in Transylvania County
            </h3>
            <p className="max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'clamp(1rem, 3.8vw, 1.25rem)', lineHeight: '1.6', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
              Shaped through lived experience, sustained partnership, and an ongoing cycle of Listen • Learn • Lead.
            </p>
          </div>

          <div className="relative w-full max-w-5xl mx-auto mb-12 md:mb-16 px-4 md:px-6">
            {/* Diagram Container - Softened & Open */}
            <div className="relative rounded-[40px] overflow-visible h-[400px] md:h-[560px]" style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.92), rgba(40, 20, 35, 0.88))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 0 120px rgba(224, 54, 148, 0.1)', // Ambient glow instead of hard shadow
            }}>
              
              {/* Diagram Area */}
	              <div className="absolute inset-0 flex items-center justify-center p-5 md:p-8 overflow-hidden rounded-[40px]">
	                <div className="relative w-full h-full max-w-[500px] max-h-[500px] flex items-center justify-center scale-95 md:scale-100">
                  
                  {/* 1. Outer Ring: Regional Awareness (Subtle & Open) */}
                  {/* Allowed to feel expansive but contained within the view for clarity */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_120s_linear_infinite]" style={{ opacity: 0.15 }}>
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6 8" strokeLinecap="round" className="origin-center" />
                  </svg>
                  
                  <div className="absolute top-[5%] left-1/2 -translate-x-1/2 text-center w-full px-4">
                    <div className="text-white/50 text-[10px] tracking-[0.25em] uppercase font-semibold mb-1">Western North Carolina</div>
                    <div className="text-white/30 text-[9px] tracking-wide">Shared learning & regional interest</div>
                  </div>

                  {/* 2. Inner Ring: Feedback Loop */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Ring Gradient */}
                    <svg className="w-full h-full animate-[spin_60s_linear_infinite]">
                      <defs>
                        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FDB515" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="#E03694" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#9E509F" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                      <circle cx="50%" cy="50%" r="30%" fill="none" stroke="url(#ringGradient)" strokeWidth="1" />
                    </svg>
                    
                    {/* Nodes: Listen, Learn, Lead - Static relative to container to maintain readability */}
                    {[
                      { label: "Listen", angle: -90 },
                      { label: "Learn", angle: 30 },
                      { label: "Lead", angle: 150 }
                    ].map((node) => {
                      const radius = 30; // percent
                      const x = 50 + radius * Math.cos(node.angle * Math.PI / 180);
                      const y = 50 + radius * Math.sin(node.angle * Math.PI / 180);
                      
                      return (
                        <div 
                          key={node.label}
                          className="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10"
                          style={{ left: `${x}%`, top: `${y}%` }}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FDB515] shadow-[0_0_20px_rgba(253,181,21,0.5)] mb-3" />
                          <span className="text-white font-bold tracking-[0.15em] text-xs uppercase opacity-90">{node.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 3. Central Hub - Grounded & Clear */}
                  <div 
                    className="relative z-20 w-44 h-44 rounded-full flex flex-col items-center justify-center text-center px-4 shadow-[0_0_60px_rgba(224,54,148,0.15)]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(241, 95, 72, 0.9), rgba(224, 54, 148, 0.9))',
                      border: '1px solid rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <div className="text-white font-bold text-lg leading-tight mb-1.5 drop-shadow-md">
                      Transylvania<br/>County
                    </div>
                    <div className="text-white/80 text-[10px] font-semibold tracking-wider uppercase border-t border-white/20 pt-1.5 mt-0.5">
                      Our Home Community
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Copy Block - Reflective & Clear */}
            <div className="max-w-2xl mx-auto text-center px-4">
              <p className="text-white/80 text-lg leading-[1.8] mb-8 font-light">
                SparkPoint was built in Transylvania County—by listening deeply, learning alongside our partners, and leading only when the community asked us to.
              </p>
              <p className="text-white/80 text-lg leading-[1.8] mb-10 font-light">
                That feedback loop continues to shape our work today. As neighboring communities express interest, we remain focused on stewardship—sharing what we’ve learned while honoring the relationships and values that made this work possible.
              </p>
              <p className="text-white/50 text-base italic tracking-wide">
                Growth follows trust, not the other way around.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
