'use client';

import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Activity, Users, TrendingUp, Target, ChevronLeft, ChevronRight, GraduationCap, Mic, Heart, Sparkles } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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

function CountUp({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
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
    },
    learn: {
      label: 'Learn',
      icon: Sparkles,
      gold: 'rgba(253,181,21,0.92)',
    },
    lead: {
      label: 'Lead',
      icon: Mic,
      gold: 'rgba(253,181,21,0.92)',
    },
  } as const;
  const phaseLabel = phaseMeta[current.phase].label;
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
        style={GLASS_CARD}
      >
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

        {/* Watermark overlay (wordmark + glints) */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          {/* Big phase word watermark (consistent scale + legibility) */}
          <div
            className="absolute select-none"
            style={{
              right: '-6%',
              bottom: '-22%',
              transform: 'rotate(-12deg)',
              fontSize: 'clamp(140px, 18vw, 230px)',
              fontWeight: 900,
              letterSpacing: '0.12em',
              lineHeight: 0.9,
              color: 'rgba(255,255,255,0.10)',
              textTransform: 'uppercase',
              textShadow:
                'inset 0 1px 0 rgba(255,255,255,0.10), 0 18px 48px rgba(0,0,0,0.35)',
              WebkitMaskImage:
                'radial-gradient(circle at 60% 60%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 78%)',
              maskImage:
                'radial-gradient(circle at 60% 60%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 78%)',
              opacity: 0.9,
            }}
          >
            {phaseLabel}
          </div>

          {/* Subtle inner edge */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          />

          {/* Gold corner glints (quiet, premium) */}
          <div
            className="absolute -top-10 -left-10 h-40 w-40 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(253,181,21,0.16), rgba(253,181,21,0) 65%)',
              filter: 'blur(14px)',
              opacity: 0.85,
            }}
          />
          <div
            className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 70% 70%, rgba(253,181,21,0.12), rgba(253,181,21,0) 68%)',
              filter: 'blur(16px)',
              opacity: 0.8,
            }}
          />
        </div>

        <div className="relative flex flex-col" style={{ minHeight: 'clamp(220px, 22vw, 280px)' }}>
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
                  marginTop: '0.25rem',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.38)',
                }}
              >
                <span className="sr-only">Quote: </span>
                “{current.quote}”
              </blockquote>

              <figcaption className="mt-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3">
                <span
                  style={{
                    fontSize: '1.16rem',
                    fontWeight: 820 as any,
                    color: 'rgba(255,255,255,0.98)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.15,
                  }}
                >
                  {current.author}
                </span>

                <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  •
                </span>

                <span
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 420 as any,
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.62)',
                    lineHeight: 1.25,
                  }}
                >
                  {current.affiliation}
                </span>
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


  // WRC Partner Network - 8 verified partners organized by focus area
  const partners = [
    // Top Left Quadrant: Health & Wellness (gold/violet)
    { name: 'UNC Health Pardee', focus: 'Health', color: '#FDB515', x: 25, y: 20, quadrant: 'Health & Wellness' },
    { name: 'Pisgah Health Foundation', focus: 'Wellness', color: '#9E509F', x: 15, y: 35, quadrant: 'Health & Wellness' },
    
    // Top Right Quadrant: Community Resilience (coral/pink)
    { name: 'American Red Cross', focus: 'Preparedness', color: '#F15F48', x: 75, y: 20, quadrant: 'Community Resilience' },
    { name: 'FWRD Transylvania', focus: 'Recovery', color: '#E03694', x: 85, y: 35, quadrant: 'Community Resilience' },
    
    // Bottom Left Quadrant: Equity & Access (orange/red)
    { name: 'El Centro Brevard', focus: 'Equity', color: '#F15F48', x: 15, y: 65, quadrant: 'Equity & Access' },
    { name: 'Just Economics WNC', focus: 'Economy', color: '#FDB515', x: 25, y: 80, quadrant: 'Equity & Access' },
    
    // Bottom Right Quadrant: Youth & Engagement (violet/magenta)
    { name: 'TC Strong', focus: 'Youth', color: '#9E509F', x: 75, y: 80, quadrant: 'Youth & Engagement' },
    { name: 'Hunger Coalition of Transylvania County', focus: 'Food Security', color: '#E03694', x: 85, y: 65, quadrant: 'Youth & Engagement' },
  ];

  const impactBreakdown = [
    {
      title: "Youth & Education",
      icon: GraduationCap,
      color: "#9E509F", // Purple
      stats: [
        "34+ Youth-Focused Events & Sessions",
        "~2,100 youth engagement moments",
        "6 school & college campuses served",
        "Primary partners: TC Strong, CARE"
      ]
    },
    {
      title: "Community & Adult Engagement",
      icon: Users,
      color: "#F15F48", // Coral
      stats: [
        "43+ adult/community events",
        "Community conversations, leadership talks, recovery events",
        "Coalition and partner-hosted sessions included"
      ]
    },
    {
      title: "Education, Training & Capacity Building",
      icon: Sparkles,
      color: "#FDB515", // Gold
      stats: [
        "20+ education & training sessions",
        "LEAD, SupportEd, Y2Y, workforce-aligned trainings",
        "College and community-based formats"
      ]
    },
    {
      title: "Story & Voice Infrastructure",
      icon: Mic,
      color: "#E03694", // Pink
      stats: [
        "10 story collection stops",
        "120+ verified resident interviews",
        "Countywide, multi-partner locations"
      ]
    }
  ];

  return (
    <section
      id="impact"
      ref={ref}
      className="relative py-20 px-6 overflow-hidden"
    >
      {/* Background with Parallax */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src="https://images.unsplash.com/photo-1632580254134-94c4a73dab76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBwZW9wbGV8ZW58MXx8fHwxNzYxMDE5NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt=""
          className="w-full h-full object-cover opacity-30"
          style={{ willChange: 'transform' }}
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
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-white mb-12"
            style={{
              fontSize: '3.5rem',
              lineHeight: '1.2',
              letterSpacing: '-1px',
              textShadow: '0px 4px 12px rgba(0, 0, 0, 0.8), 0px 2px 6px rgba(0, 0, 0, 0.6)'
            }}
          >
            Trust built through visibility and shared success.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 1.2 }}
            className="p-8 rounded-xl"
            style={GLASS_CARD_STRONG}
          >
              <div className="text-white mb-2" style={{ fontSize: '4rem', fontWeight: '700', textShadow: '0 3px 8px rgba(0, 0, 0, 0.6)' }}>
                <CountUp end={7700} duration={1.5} suffix="+" />
              </div>
              <p className="text-white" style={{ fontSize: '1.25rem', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Residents Supported
              </p>
            </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 1.2 }}
            className="p-8 rounded-xl"
            style={GLASS_CARD_STRONG}
          >
              <div className="text-white mb-2" style={{ fontSize: '4rem', fontWeight: '700', textShadow: '0 3px 8px rgba(0, 0, 0, 0.6)' }}>
                <CountUp end={45} duration={1.5} suffix="+" />
              </div>
              <p className="text-white" style={{ fontSize: '1.25rem', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Partnerships Formed
              </p>
            </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="p-8 rounded-xl"
            style={GLASS_CARD_STRONG}
          >
              <div className="text-white mb-2" style={{ fontSize: '4rem', fontWeight: '700', textShadow: '0 3px 8px rgba(0, 0, 0, 0.6)' }}>
                100%
              </div>
              <p className="text-white" style={{ fontSize: '1.25rem', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Local Volunteers
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
          className="mb-24"
        >
          {/* Header */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 
              className="text-white mb-6"
              style={{
                fontSize: '3rem',
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
                fontSize: '1.25rem',
                lineHeight: '1.6',
                fontWeight: '400',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
              }}
            >
              In a rural county of approximately 33,000 residents, SparkPoint focuses on sustained presence, shared infrastructure, and meaningful connection across youth, families, and partners.
            </p>
          </div>

          {/* Impact At-A-Glance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
  {[
    {
      value: 79,
      label: "Total Events & Sessions (2025)",
      note: "Includes December community-wide events and public gatherings",
    },
    {
      value: 4477,
      label: "Verified Attendance Moments",
      note: "Attendance-based count, consistent methodology (Jan–Dec)",
    },
    {
      value: 2100,
      label: "Youth Attendance (Estimated)",
      note: "School programs, VOS sessions, festivals, convocation",
      suffix: "+",
    },
    {
      value: 12,
      label: "Months of Active Programming",
      note: "January–December (full-year reporting)",
    },
  ].map((metric, index) => (
    <motion.div
      key={metric.label}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-8 rounded-xl flex flex-col justify-between"
      style={GLASS_CARD}
    >
      <div className="mb-4">
        <div
          className="text-white mb-2"
          style={{ fontSize: "3.5rem", fontWeight: "700", lineHeight: 1 }}
        >
          <CountUp
            end={metric.value}
            duration={1.5}
            suffix={metric.suffix || ""}
          />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {impactBreakdown.map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="p-8 rounded-xl h-full"
                style={{
                  ...GLASS_CARD,
                  borderTop: `4px solid ${group.color}`,
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${group.color}20`, color: group.color }}
                  >
                    <group.icon size={28} />
                  </div>
                  <h3 className="text-white text-xl font-bold">{group.title}</h3>
                </div>
                <ul className="space-y-4">
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
            className="p-10 rounded-2xl mb-8 relative overflow-hidden"
            style={{
              ...GLASS_CARD,
              background: 'linear-gradient(135deg, rgba(224, 54, 148, 0.14), rgba(253, 181, 21, 0.06))',
            }}
          >
            <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center justify-between">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-[#FDB515]/20 text-[#FDB515] border border-[#FDB515]/30">
                    <Target size={28} />
                  </div>
                  <h3 className="text-white text-2xl md:text-3xl font-bold">Anchor Moments & Momentum</h3>
                </div>
                
                <div className="bg-black/20 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                  <p className="text-[#FDB515] font-bold text-sm uppercase tracking-wider mb-3">
                    3 Major Anchor Events
                  </p>
                  <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-y-2 gap-x-6">
                    {['Juneteenth Festival', 'Helene: One Year of Healing', 'TCS Convocation'].map((event, i) => (
                      <li key={i} className="text-white text-lg font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FDB515]" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-row gap-8 sm:gap-12 w-full lg:w-auto mt-4 lg:mt-0 pl-0 lg:pl-10 lg:border-l border-white/10">
                <div className="flex-1 sm:flex-none min-w-[140px]">
                  <div className="text-5xl font-bold text-white mb-2 tracking-tight" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                    700
                  </div>
                  <div className="text-white/70 font-medium text-sm uppercase tracking-wide leading-snug">
                    Largest Event<br/>Attendance
                  </div>
                </div>
                <div className="flex-1 sm:flex-none min-w-[140px]">
                  <div className="text-5xl font-bold text-white mb-2 tracking-tight" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                    ~13.5%
                  </div>
                  <div className="text-white/70 font-medium text-sm uppercase tracking-wide leading-snug">
                    Nov. Share of<br/>Annual Reach
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <div className="text-center">
            <p className="text-white/50 text-sm">
              Data shown reflects verified totals through November 2025. December 2025 activity will be added as final reporting is completed.
            </p>
          </div>
        </motion.div>

        {/* F. "Why It Matters" Panel (Retained) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-white text-center mb-12" style={{ fontSize: '2.5rem', fontWeight: '700', textShadow: '0 3px 8px rgba(0, 0, 0, 0.6)' }}>
            Why It Matters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-8 rounded-xl"
              style={{
                ...GLASS_CARD_STRONG,
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.78), rgba(224, 54, 148, 0.22), rgba(158, 80, 159, 0.18))',
                border: '1px solid rgba(224, 54, 148, 0.42)',
                boxShadow: '0 18px 60px rgba(0, 0, 0, 0.55), 0 10px 26px rgba(224, 54, 148, 0.18), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <div style={{ fontSize: '4rem', fontWeight: '700', color: 'white', textShadow: '0 3px 8px rgba(0, 0, 0, 0.7)' }}>51%</div>
              <p style={{ color: 'white', fontSize: '1.25rem', marginTop: '8px', textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>
                of residents report loneliness
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-8 rounded-xl"
              style={{
                ...GLASS_CARD_STRONG,
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.78), rgba(253, 181, 21, 0.18), rgba(241, 95, 72, 0.16))',
                border: '1px solid rgba(253, 181, 21, 0.42)',
                boxShadow: '0 18px 60px rgba(0, 0, 0, 0.55), 0 10px 26px rgba(253, 181, 21, 0.16), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <div style={{ fontSize: '4rem', fontWeight: '700', color: 'white', textShadow: '0 3px 8px rgba(0, 0, 0, 0.7)' }}>37%</div>
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
            className="text-center mt-8"
            style={{ color: 'white', fontSize: '1.125rem', lineHeight: '1.7', textShadow: '0 2px 6px rgba(0, 0, 0, 0.7)' }}
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
          className="mb-20"
        >
          <PartnerNetworkHub />
        </motion.div>

        {/* G. Community Built in Transylvania County (Refined) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pb-20"
        >
          {/* Headline moved outside container */}
          <div className="text-center mb-16 px-6">
            <h3 className="text-white mb-6 leading-tight" style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}>
              Community Built in Transylvania County
            </h3>
            <p className="max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.25rem', lineHeight: '1.6', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
              Shaped through lived experience, sustained partnership, and an ongoing cycle of Listen • Learn • Lead.
            </p>
          </div>

          <div className="relative w-full max-w-5xl mx-auto mb-16 px-6">
            {/* Diagram Container - Softened & Open */}
            <div className="relative rounded-[40px] overflow-visible" style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.92), rgba(40, 20, 35, 0.88))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 0 120px rgba(224, 54, 148, 0.1)', // Ambient glow instead of hard shadow
              minHeight: '480px'
            }}>
              
              {/* Diagram Area */}
              <div className="absolute inset-0 flex items-center justify-center p-8 overflow-hidden rounded-[40px]">
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
