'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Compass,
  Cpu,
  GraduationCap,
  Handshake,
  HeartHandshake,
  House,
  Layers,
  MapPin,
  MessageCircle,
  Mic,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import hubAutumnImage from '../assets/hub/_0001_Resilience Hub Autumn.jpg';
import hubWinterImage from '../assets/hub/_0002_Resilience Hub Winter.jpg';
import hubDayImage from '../assets/hub/_0003_Resilience Hub Day.jpg';
import hubSpringImage from '../assets/hub/_0000_Resilience Hub Spring.jpg';
import hubNightImage from '../assets/hub/_0005_Resilience Hub Night.jpg';
import { KeepExploringLinks } from '../components/KeepExploringLinks';
import { SEOHead } from '../components/SEOHead';
import { Button } from '../components/ui/button';
import { useAccessibility } from '../context/AccessibilityContext';

// ─── TYPES ───

type HubHeroViewId = 'spring' | 'day' | 'autumn' | 'winter' | 'night';

type HubHeroView = {
  id: HubHeroViewId;
  label: string;
  image: string;
  description: string;
};

type DetailCard = {
  title: string;
  body: string;
  icon: LucideIcon;
  accent: string;
};

type PracticeCard = {
  label: 'Listen' | 'Learn' | 'Lead';
  title: string;
  body: string;
  points: string[];
  icon: LucideIcon;
  accent: string;
};

type AudienceCard = {
  title: string;
  body: string;
  prompt: string;
  icon: LucideIcon;
  accent: string;
};

// ─── DATA ───

const HUB_HERO_VIEWS: HubHeroView[] = [
  {
    id: 'spring',
    label: 'Spring',
    image: hubSpringImage,
    description: 'Spring view of the SparkPoint Resiliency Hub exterior in Brevard.',
  },
  {
    id: 'day',
    label: 'Day',
    image: hubDayImage,
    description: 'Daytime view of the SparkPoint Resiliency Hub exterior in Brevard.',
  },
  {
    id: 'autumn',
    label: 'Autumn',
    image: hubAutumnImage,
    description: 'Autumn view of the SparkPoint Resiliency Hub exterior in Brevard.',
  },
  {
    id: 'winter',
    label: 'Winter',
    image: hubWinterImage,
    description: 'Winter view of the SparkPoint Resiliency Hub exterior in Brevard.',
  },
  {
    id: 'night',
    label: 'Night',
    image: hubNightImage,
    description: 'Night view of the SparkPoint Resiliency Hub exterior in Brevard.',
  },
];

const HUB_HIGHLIGHTS: DetailCard[] = [
  {
    title: 'Shared support system',
    body: 'A welcoming third space for connection, coordination, and practical support throughout the year.',
    icon: HeartHandshake,
    accent: '#E03694',
  },
  {
    title: 'Learning hub',
    body: 'Workshops, meetings, and initiatives can grow here through shared learning and community feedback.',
    icon: BookOpen,
    accent: '#9E509F',
  },
  {
    title: 'Place-based and local',
    body: '94 S. Caldwell Street in Brevard, near Hendersonville Pediatrics, MAHEC, and The Sharing House.',
    icon: MapPin,
    accent: '#F15F48',
  },
];

const WHY_SPACE_EXISTS: DetailCard[] = [
  {
    title: 'Trusted relationships matter',
    body: 'Resilience grows through people knowing where to go, who to call, and how to stay connected before a crisis and after it.',
    icon: Users,
    accent: '#FDB515',
  },
  {
    title: 'Lower barriers to support',
    body: 'The hub helps make information, referrals, and collaboration easier to reach without adding another maze to navigate.',
    icon: Compass,
    accent: '#E03694',
  },
  {
    title: 'Year-round community capacity',
    body: 'It is meant for everyday support and shared learning, not just moments of urgency, so trust and readiness can build over time.',
    icon: Shield,
    accent: '#9E509F',
  },
];

const LISTEN_LEARN_LEAD: PracticeCard[] = [
  {
    label: 'Listen',
    title: 'Ground the space in community voice',
    body: 'SparkPoint uses the hub to stay close to lived experience, hear what residents and partners are navigating, and shape support around real conditions in Transylvania County.',
    points: [
      'Story-informed conversations and resident feedback',
      'Practical insight into gaps, strengths, and next steps',
      'A welcoming setting for people to be heard without pressure',
    ],
    icon: MessageCircle,
    accent: '#FDB515',
  },
  {
    label: 'Learn',
    title: 'Make shared learning easier',
    body: 'The hub functions as a learning lab for programs and initiatives, where workshops, partner meetings, and resource navigation can turn information into action.',
    points: [
      'Workshops and small-group learning',
      'Cross-sector meetings and collaborative problem-solving',
      'Usable tools for health, well-being, and preparedness',
    ],
    icon: BookOpen,
    accent: '#9E509F',
  },
  {
    label: 'Lead',
    title: 'Strengthen collective capacity',
    body: 'SparkPoint stewards the hub as a connector, convener, and capacity-builder, helping people and organizations align around what the community needs most.',
    points: [
      'Coordinated preparedness and recovery support',
      'Youth and leadership development that grows local confidence',
      'Shared momentum that outlasts any single event or initiative',
    ],
    icon: Handshake,
    accent: '#F15F48',
  },
];

const WHAT_HAPPENS_HERE: DetailCard[] = [
  {
    title: 'Workshops and shared learning',
    body: 'Practical sessions on resilience, well-being, community health, and everyday preparedness.',
    icon: BookOpen,
    accent: '#9E509F',
  },
  {
    title: 'Partner coordination',
    body: 'Space for nonprofits, agencies, schools, and other community-serving organizations to plan together and share updates.',
    icon: Handshake,
    accent: '#E03694',
  },
  {
    title: 'Resource navigation',
    body: 'A more human path into information, referrals, and next steps when people are unsure where to begin.',
    icon: Compass,
    accent: '#FDB515',
  },
  {
    title: 'Community gatherings',
    body: 'Low-barrier gatherings that reinforce belonging, connection, and community self-determination.',
    icon: House,
    accent: '#F15F48',
  },
  {
    title: 'Youth and leadership support',
    body: 'Room for youth mental health initiatives, leadership development, and connective programming that invests in the next generation.',
    icon: Sparkles,
    accent: '#E03694',
  },
  {
    title: 'Preparedness and emotional recovery',
    body: 'A practical setting for coordinated preparedness efforts, emotional recovery support, and steady care after difficult seasons.',
    icon: Shield,
    accent: '#9E509F',
  },
];

const STORYLAB_CARDS: DetailCard[] = [
  {
    title: 'Ethical story collection',
    body: 'Community stories are gathered with care \u2014 using trauma-informed consent, accessible formats, and dignity-centered practices across the county.',
    icon: Mic,
    accent: '#FDB515',
  },
  {
    title: 'Community sensemaking',
    body: 'Stories are reviewed collaboratively to surface patterns, unmet needs, and shared strengths \u2014 turning lived experience into structured insight that can inform action.',
    icon: Layers,
    accent: '#9E509F',
  },
  {
    title: 'Returning insight to the community',
    body: 'What is learned goes back to the people who shared it \u2014 through convenings, shared summaries, and dialogue that keeps the feedback loop honest.',
    icon: RefreshCw,
    accent: '#E03694',
  },
];

const MEDIA_NAV_CARDS: DetailCard[] = [
  {
    title: 'Learn by doing',
    body: 'Navigators contribute to real SparkPoint and partner projects \u2014 video, audio, editing, and community-facing outputs \u2014 not simulated coursework.',
    icon: Video,
    accent: '#FDB515',
  },
  {
    title: 'Ethical media practice',
    body: 'Every project is grounded in informed consent, trauma-informed storytelling, and accountability to the people and communities represented.',
    icon: ShieldCheck,
    accent: '#E03694',
  },
  {
    title: 'Accessibility and AI-assisted workflows',
    body: 'Participants build fluency in captioning, transcription, and responsible AI tools \u2014 always with strong human-in-the-loop standards.',
    icon: Cpu,
    accent: '#9E509F',
  },
  {
    title: 'Pathways into nonprofit and civic roles',
    body: 'Navigators build portfolios and applied experience aligned with the communications needs of nonprofits, schools, clinics, and local government.',
    icon: GraduationCap,
    accent: '#F15F48',
  },
];

const WHO_IT_SERVES: AudienceCard[] = [
  {
    title: 'Residents',
    body: 'People looking for connection, practical information, or a trusted place to learn what support may be available.',
    prompt: 'Come with a question, an idea, or simply a need for clearer next steps.',
    icon: Users,
    accent: '#FDB515',
  },
  {
    title: 'Nonprofits',
    body: 'Organizations that need a place to collaborate, host learning, align referrals, or strengthen countywide coordination.',
    prompt: 'Use the space to reduce duplication and build stronger handoffs.',
    icon: Building2,
    accent: '#9E509F',
  },
  {
    title: 'Volunteers',
    body: 'Community members who want to help with gatherings, resource-sharing, preparedness efforts, or other practical support.',
    prompt: 'Step into a role that fits your time, skills, and comfort level.',
    icon: HeartHandshake,
    accent: '#E03694',
  },
  {
    title: 'Partners',
    body: 'Schools, clinics, agencies, and community-serving teams seeking a grounded place for coordination and shared learning.',
    prompt: 'Reach out to co-host, coordinate, or explore what the hub can support together.',
    icon: Handshake,
    accent: '#F15F48',
  },
];

const KEEP_EXPLORING_LINKS = [
  {
    to: '/mission',
    label: 'Mission',
    description: 'See how Listen \u2022 Learn \u2022 Lead shapes SparkPoint\u2019s work across the county.',
  },
  {
    to: '/programs',
    label: 'Programs',
    description: 'Explore the initiatives and learning pathways connected to community resilience.',
  },
  {
    to: '/get-involved',
    label: 'Get involved',
    description: 'Find practical ways to volunteer, support, or partner with SparkPoint.',
  },
];

// ─── HELPERS ───

function getDarkAppearance() {
  if (typeof window === 'undefined') return false;
  const root = document.documentElement;
  if (root.classList.contains('dark')) return true;
  if (root.classList.contains('light')) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// ─── PAGE ───

export function ResiliencyHubPage() {
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';
  const [darkAppearance, setDarkAppearance] = useState(() => getDarkAppearance());
  const [selectedHeroId, setSelectedHeroId] = useState<HubHeroViewId | null>(null);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : 150]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateAppearance = () => setDarkAppearance(getDarkAppearance());
    updateAppearance();
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateAppearance);
    } else {
      mediaQuery.addListener(updateAppearance);
    }
    const observer = new MutationObserver(updateAppearance);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', updateAppearance);
      } else {
        mediaQuery.removeListener(updateAppearance);
      }
      observer.disconnect();
    };
  }, []);

  const defaultHeroId: HubHeroViewId = darkAppearance ? 'night' : 'day';
  const activeHeroId = selectedHeroId ?? defaultHeroId;
  const activeHero = HUB_HERO_VIEWS.find((v) => v.id === activeHeroId) ?? HUB_HERO_VIEWS[1];

  const reveal = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: 'easeOut' as const };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SEOHead
        title="Resiliency Hub | SparkPoint"
        description="Explore SparkPoint's Resiliency Hub at 94 S. Caldwell Street in Brevard, NC: a welcoming shared space for connection, learning, resource navigation, and coordinated community support."
        path="/resiliency-hub"
      />

      {/* ──── FIXED STICKY BACKGROUND ──── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div style={{ y: backgroundY }} className="absolute inset-0 w-full">
          <motion.div
            key={activeHero.id}
            className="absolute inset-0"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
          >
            <img
              src={activeHero.image}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: 'center 58%', minHeight: '120%' }}
            />
          </motion.div>
          {/* Lighter gradient — heavier at top for text, minimal in middle to show facade, gentle at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.18) 25%, rgba(0,0,0,0.04) 45%, rgba(0,0,0,0.06) 70%, rgba(0,0,0,0.45) 100%)',
            }}
          />
        </motion.div>
      </div>

      {/* ──── 1. HERO — open, facade-forward ──── */}
      <section
        className="relative z-10 px-6 flex flex-col justify-between"
        style={{ paddingTop: 120, paddingBottom: 32, minHeight: '92vh' }}
      >
        {/* Top: headline text directly on image — no card blocking the view */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p
            className="text-xs font-semibold uppercase"
            style={{
              letterSpacing: '0.26em',
              color: 'rgba(255,255,255,0.60)',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              marginBottom: 16,
            }}
          >
            Resiliency Hub
          </p>
          <h1
            className="text-4xl font-bold tracking-tight leading-tight text-white"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)',
              marginBottom: 14,
            }}
          >
            A shared place for connection, learning, and coordinated support.
          </h1>
          <p
            className="text-lg font-light"
            style={{
              color: 'rgba(255,255,255,0.80)',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            94 S. Caldwell Street, Brevard, NC
          </p>
        </motion.div>

        {/* Bottom: facade selector — anchored to bottom, minimal footprint */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2"
          role="group"
          aria-label="Hub image views"
        >
          <span
            className="text-xs font-medium"
            style={{
              color: 'rgba(255,255,255,0.45)',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              marginRight: 4,
            }}
          >
            View:
          </span>
          {HUB_HERO_VIEWS.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setSelectedHeroId(view.id)}
              aria-pressed={activeHeroId === view.id}
              className="px-4 py-1.5 text-xs font-semibold transition-all"
              style={{
                borderRadius: 9999,
                border:
                  activeHeroId === view.id
                    ? '1px solid rgba(158,80,159,0.6)'
                    : '1px solid rgba(255,255,255,0.15)',
                backgroundColor:
                  activeHeroId === view.id
                    ? 'rgba(158,80,159,0.85)'
                    : 'rgba(0,0,0,0.25)',
                color: activeHeroId === view.id ? '#fff' : 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                letterSpacing: '0.04em',
              }}
            >
              {view.label}
            </button>
          ))}
          {selectedHeroId && (
            <button
              type="button"
              onClick={() => setSelectedHeroId(null)}
              className="px-3 py-1.5 text-xs font-medium underline underline-offset-4"
              style={{ color: 'rgba(255,255,255,0.45)', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
            >
              Reset
            </button>
          )}
        </motion.div>
        <span className="sr-only">{activeHero.description}</span>
      </section>

      {/* ──── 2. INTRO + HIGHLIGHTS (dark glass) ──── */}
      <section
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(18, 18, 20, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reveal}
            className="max-w-3xl"
          >
            <h2
              className="text-2xl font-bold text-white"
              style={{ marginBottom: 16 }}
            >
              More than a building — a shared foundation for community care.
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.72)', marginBottom: 12 }}
            >
              At 94 S. Caldwell Street, SparkPoint is stewarding a welcoming space where
              residents, nonprofits, volunteers, and partners can gather, learn, navigate
              resources, and strengthen resilience together.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.50)' }}
            >
              SparkPoint uses the space as a connector, convener, and capacity-builder —
              helping people and partners find one another, share what they know, and strengthen
              what the community can do together.
            </p>
          </motion.div>

          <style>{`@media (min-width: 768px) { .rh-highlights-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }`}</style>
          <div className="rh-highlights-grid grid grid-cols-1 gap-5" style={{ marginTop: 40 }}>
            {HUB_HIGHLIGHTS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.5, delay: index * 0.08 }
                  }
                  whileHover={prefersReducedMotion ? {} : { y: -4 }}
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: 28,
                    transition: 'box-shadow 0.3s, border-color 0.3s',
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 9999,
                      backgroundColor: `${item.accent}20`,
                      color: item.accent,
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: '#fff', marginBottom: 8 }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.60)' }}
                  >
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── 3. WHY THIS SPACE EXISTS (light glass) ──── */}
      <section
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(250, 250, 248, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.50)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reveal}
            className="max-w-3xl"
          >
            <p
              className="text-xs font-semibold uppercase"
              style={{ letterSpacing: '0.22em', color: '#9E509F', marginBottom: 16 }}
            >
              Why this space exists
            </p>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: '#111827', marginBottom: 20 }}
            >
              Connection is the foundation of healthy, resilient communities.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#4B5563' }}>
              The Resiliency Hub exists because resilience is built through trusted relationships,
              access to resources, shared learning, and practical support that people can return
              to over time.
            </p>
          </motion.div>

          <style>{`@media (min-width: 768px) { .rh-why-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }`}</style>
          <div className="rh-why-grid grid grid-cols-1 gap-5" style={{ marginTop: 36 }}>
            {WHY_SPACE_EXISTS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.5, delay: index * 0.06 }
                  }
                  whileHover={prefersReducedMotion ? {} : { y: -4 }}
                  className="bg-white"
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(0,0,0,0.06)',
                    padding: 28,
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 9999,
                      backgroundColor: `${item.accent}15`,
                      color: item.accent,
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: '#111827', marginBottom: 8 }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── 4. LISTEN • LEARN • LEAD (dark glass reveal) ──── */}
      <section
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(26, 26, 26, 0.82)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reveal}
            className="max-w-3xl"
          >
            <p
              className="text-xs font-semibold uppercase"
              style={{ letterSpacing: '0.22em', color: '#9E509F', marginBottom: 16 }}
            >
              Listen • Learn • Lead in practice
            </p>
            <h2
              className="text-3xl font-bold tracking-tight text-white"
              style={{ marginBottom: 20 }}
            >
              The space reflects how SparkPoint works.
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              The hub turns SparkPoint&apos;s framework into something tangible: a place where
              community voice can shape action, learning can stay close to real needs, and
              collaboration can build long-term capacity.
            </p>
          </motion.div>

          <style>{`@media (min-width: 1024px) { .rh-lll-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }`}</style>
          <div className="rh-lll-grid grid grid-cols-1 gap-6" style={{ marginTop: 40 }}>
            {LISTEN_LEARN_LEAD.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.5, delay: index * 0.1 }
                  }
                  className="h-full flex flex-col"
                  style={{
                    borderRadius: 20,
                    border: '1px solid rgba(255,255,255,0.10)',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    padding: 28,
                  }}
                >
                  <div className="flex items-start gap-4" style={{ marginBottom: 20 }}>
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 9999,
                        backgroundColor: `${item.accent}20`,
                        color: item.accent,
                        marginTop: 2,
                      }}
                    >
                      <Icon size={22} strokeWidth={2.2} />
                    </div>
                    <div>
                      <p
                        className="text-xs font-semibold uppercase"
                        style={{ letterSpacing: '0.16em', color: item.accent, marginBottom: 6 }}
                      >
                        {item.label}
                      </p>
                      <h3
                        className="text-xl font-semibold text-white"
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}
                  >
                    {item.body}
                  </p>
                  <ul className="space-y-3 mt-auto">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                      >
                        <span
                          className="flex-shrink-0"
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 9999,
                            backgroundColor: item.accent,
                            marginTop: 7,
                          }}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── 5. WHAT HAPPENS HERE (near-white glass) ──── */}
      <section
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reveal}
            className="max-w-3xl"
          >
            <p
              className="text-xs font-semibold uppercase"
              style={{ letterSpacing: '0.22em', color: '#9E509F', marginBottom: 16 }}
            >
              What happens here
            </p>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: '#111827', marginBottom: 20 }}
            >
              A flexible place for practical community work.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#4B5563' }}>
              The Resiliency Hub supports the kinds of activities that help people stay
              informed, connected, and better equipped to care for one another over time.
            </p>
          </motion.div>

          <style>{`
            @media (min-width: 768px) { .rh-what-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
            @media (min-width: 1280px) { .rh-what-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }
          `}</style>
          <div className="rh-what-grid grid grid-cols-1 gap-5" style={{ marginTop: 36 }}>
            {WHAT_HAPPENS_HERE.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.45, delay: index * 0.04 }
                  }
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(0,0,0,0.06)',
                    backgroundColor: '#F9FAFB',
                    padding: 24,
                  }}
                >
                  <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 9999,
                        backgroundColor: `${item.accent}15`,
                        color: item.accent,
                      }}
                    >
                      <Icon size={18} strokeWidth={2.2} />
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: '#111827' }}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── 5b. STORYLAB STUDIO (dark glass) ──── */}
      <section
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(18, 18, 20, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reveal}
            className="max-w-3xl"
          >
            <p
              className="text-xs font-semibold uppercase"
              style={{ letterSpacing: '0.22em', color: '#FDB515', marginBottom: 16 }}
            >
              StoryLab Studio
            </p>
            <h2
              className="text-3xl font-bold tracking-tight text-white"
              style={{ marginBottom: 20 }}
            >
              Where community voice becomes shared learning.
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              The Resiliency Hub includes a dedicated StoryLab Studio &mdash; a space for
              collecting, stewarding, and learning from community stories ethically. Grounded in
              Participatory Narrative Inquiry, the StoryLab supports a repeatable cycle: listen to
              lived experience, learn what it reveals, lead with what the community needs, and
              return what was learned.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.45)', marginTop: 12 }}
            >
              Story work here is not about awareness alone. It informs programs, partnerships,
              convenings, and funding priorities &mdash; connecting what people share to what
              the community does next.
            </p>
          </motion.div>

          <style>{`@media (min-width: 768px) { .rh-storylab-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }`}</style>
          <div className="rh-storylab-grid grid grid-cols-1 gap-5" style={{ marginTop: 40 }}>
            {STORYLAB_CARDS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.5, delay: index * 0.08 }
                  }
                  whileHover={prefersReducedMotion ? {} : { y: -4 }}
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: 28,
                    transition: 'box-shadow 0.3s, border-color 0.3s',
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 9999,
                      backgroundColor: `${item.accent}20`,
                      color: item.accent,
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: '#fff', marginBottom: 8 }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.60)' }}
                  >
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── 5c. MEDIA NAVIGATORS (light glass) ──── */}
      <section
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(250, 250, 248, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.50)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reveal}
            className="max-w-3xl"
          >
            <p
              className="text-xs font-semibold uppercase"
              style={{ letterSpacing: '0.22em', color: '#9E509F', marginBottom: 16 }}
            >
              Media Navigators
            </p>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: '#111827', marginBottom: 20 }}
            >
              Building practical skills through real community work.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#4B5563' }}>
              Media Navigators is a cohort-based apprenticeship pathway for people interested in
              media, communications, and ethical storytelling. Participants learn by supporting
              real SparkPoint and partner projects &mdash; building transferable skills while
              helping nonprofits, schools, and civic organizations that lack in-house media
              capacity.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: '#6B7280', marginTop: 12 }}
            >
              The goal is not to train specialists for large agencies, but to prepare versatile media
              generalists who can support organizations where one person often wears many hats.
            </p>
          </motion.div>

          <style>{`
            @media (min-width: 640px) { .rh-medianav-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
            @media (min-width: 1280px) { .rh-medianav-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; } }
          `}</style>
          <div className="rh-medianav-grid grid grid-cols-1 gap-5" style={{ marginTop: 36 }}>
            {MEDIA_NAV_CARDS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.45, delay: index * 0.06 }
                  }
                  whileHover={prefersReducedMotion ? {} : { y: -4 }}
                  className="bg-white"
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(0,0,0,0.06)',
                    padding: 24,
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 9999,
                      backgroundColor: `${item.accent}15`,
                      color: item.accent,
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: '#111827', marginBottom: 8 }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── 6. WHO IT SERVES (near-white glass) ──── */}
      <section
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reveal}
            className="max-w-3xl"
          >
            <p
              className="text-xs font-semibold uppercase"
              style={{ letterSpacing: '0.22em', color: '#9E509F', marginBottom: 16 }}
            >
              Who it serves
            </p>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: '#111827', marginBottom: 20 }}
            >
              A shared place for residents, nonprofits, volunteers, and partners.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#4B5563' }}>
              The hub is meant to hold many kinds of community-facing work, with each group
              able to engage in a way that feels useful, practical, and rooted in local
              relationships.
            </p>
          </motion.div>

          <style>{`
            @media (min-width: 640px) { .rh-who-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
            @media (min-width: 1280px) { .rh-who-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; } }
          `}</style>
          <div className="rh-who-grid grid grid-cols-1 gap-5" style={{ marginTop: 36 }}>
            {WHO_IT_SERVES.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.45, delay: index * 0.06 }
                  }
                  whileHover={prefersReducedMotion ? {} : { y: -4 }}
                  className="bg-white h-full flex flex-col"
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(0,0,0,0.06)',
                    padding: 24,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 9999,
                      backgroundColor: `${item.accent}15`,
                      color: item.accent,
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: '#111827', marginBottom: 8 }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: '#6B7280', marginBottom: 16 }}
                  >
                    {item.body}
                  </p>
                  <p
                    className="text-sm font-medium leading-relaxed"
                    style={{ color: '#374151' }}
                  >
                    {item.prompt}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── 7. PLACE-BASED + STEWARDSHIP (dark glass reveal) ──── */}
      <section
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(26, 26, 26, 0.80)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <style>{`@media (min-width: 1024px) { .rh-place-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }`}</style>
        <div className="rh-place-grid max-w-6xl mx-auto grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reveal}
            style={{
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.10)',
              backgroundColor: 'rgba(255,255,255,0.06)',
              padding: 32,
            }}
          >
            <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 9999,
                  backgroundColor: 'rgba(224,54,148,0.15)',
                  color: '#E03694',
                }}
              >
                <MapPin size={20} strokeWidth={2.2} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ letterSpacing: '0.16em', color: '#9E509F' }}
                >
                  Place-based note
                </p>
                <h3 className="text-xl font-semibold text-white" style={{ marginTop: 2 }}>
                  Rooted in a real corridor of care.
                </h3>
              </div>
            </div>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.70)' }}
            >
              The hub is located at 94 S. Caldwell Street, Brevard, NC, near Hendersonville
              Pediatrics, MAHEC, and The Sharing House. That location matters. It places the
              building within a familiar part of town where care, support, and community-serving
              work are already part of the landscape.
            </p>
            <div
              className="flex items-center gap-3"
              style={{
                marginTop: 20,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                padding: '12px 16px',
              }}
            >
              <CalendarDays size={16} style={{ color: '#F15F48', flexShrink: 0 }} />
              <span
                className="text-sm"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                The hub is intended for year-round use, with activity and stewardship shaped
                by changing community needs.
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.55, delay: 0.06 }
            }
            style={{
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.10)',
              backgroundColor: 'rgba(255,255,255,0.06)',
              padding: 32,
            }}
          >
            <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 9999,
                  backgroundColor: 'rgba(158,80,159,0.15)',
                  color: '#9E509F',
                }}
              >
                <Building2 size={20} strokeWidth={2.2} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ letterSpacing: '0.16em', color: '#9E509F' }}
                >
                  Stewardship
                </p>
                <h3 className="text-xl font-semibold text-white" style={{ marginTop: 2 }}>
                  Flexible, shared, and guided by community voice.
                </h3>
              </div>
            </div>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.70)' }}
            >
              SparkPoint is holding the Resiliency Hub as a flexible community asset. Uses and
              room arrangements can adapt over time depending on workshops, partner coordination,
              youth gatherings, or preparedness-related support. What stays constant is the
              intention: keep the space welcoming, readable, and useful.
            </p>
            <ul className="space-y-3" style={{ marginTop: 20 }}>
              {[
                'Shared use over siloed ownership',
                'Practical coordination over spectacle',
                'Belonging and collective care over transaction',
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  <span
                    className="flex-shrink-0"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 9999,
                      backgroundColor: '#9E509F',
                      marginTop: 7,
                    }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ──── 8. CTA (light glass) ──── */}
      <section
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(250, 250, 248, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.50)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={reveal}
          className="mx-auto max-w-4xl text-center"
          style={{
            borderRadius: 24,
            border: '1px solid rgba(0,0,0,0.06)',
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: '40px 32px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.05)',
          }}
        >
          <p
            className="text-xs font-semibold uppercase"
            style={{ letterSpacing: '0.22em', color: '#9E509F', marginBottom: 16 }}
          >
            Stay connected
          </p>
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: '#111827', marginBottom: 20 }}
          >
            Want to ask about the space or explore what it could support?
          </h2>
          <p
            className="mx-auto max-w-2xl text-lg leading-relaxed"
            style={{ color: '#4B5563', marginBottom: 32 }}
          >
            Reach out if you have a question, a partnership idea, or a community use in mind.
            We can start with a simple conversation and figure out what makes sense from there.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild style={{ backgroundColor: '#E03694', color: 'white' }}>
              <Link to="/intake?intent=contact">
                Start a conversation
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              style={{ borderColor: '#D1D5DB', color: '#111827' }}
            >
              <Link to="/programs">Explore programs</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ──── 9. KEEP EXPLORING ──── */}
      <div className="relative z-10" style={{ backgroundColor: '#F8F6F3' }}>
        <KeepExploringLinks
          className="relative z-10"
          title="Keep Exploring"
          intro="Learn more about SparkPoint's framework, programs, and ways to stay involved."
          links={KEEP_EXPLORING_LINKS}
        />
      </div>
    </div>
  );
}
