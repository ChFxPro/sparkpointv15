'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router';
import {
  GraduationCap,
  HeartHandshake,
  Landmark,
  Stethoscope,
  Handshake,
  Sparkles,
  Users,
  ArrowRight,
  ArrowUpRight,
  X,
  MessageCircle,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import brevardMusicCenterLogo from '../assets/sponsors/brevard_music_center.png';
import brevardTCDALogo from '../assets/sponsors/brevard_tcda.png';
import comporiumLogo from '../assets/sponsors/comporium.png';
import dogwoodLogo from '../assets/sponsors/dogwood.png';
import phfLogo from '../assets/sponsors/phf.png';
import redCrossLogo from '../assets/sponsors/red_cross.png';
import selfHelpLogo from '../assets/sponsors/self_help.png';
import sponsorHeroJpg from '../assets/sponsors/sponsor_hero.jpg';
import sponsorHeroWebp from '../assets/sponsors/sponsor_hero.webp';
import uncHealthLogo from '../assets/sponsors/unc_health.png';
import { KeepExploringLinks } from '../components/KeepExploringLinks';
import { SEOHead } from '../components/SEOHead';
import { Button } from '../components/ui/button';
import { useAccessibility } from '../context/AccessibilityContext';
import { PARTNER_SECTORS, FEATURED_PARTNERS, type PartnerSector } from '../data/partners';

// --- PARTNER ECOSYSTEM DATA — shared with the homepage diagram, see src/data/partners.ts ---

const SECTOR_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  HeartHandshake,
  Landmark,
  Stethoscope,
  Handshake,
  Sparkles,
};

// Logo images stay bundled here (this page already had proven, working imports of
// these exact files) — src/data/partners.ts only stores the string `logoKey`.
const PARTNER_LOGOS: Record<string, string> = {
  dogwood: dogwoodLogo,
  phf: phfLogo,
  'unc-health': uncHealthLogo,
  'red-cross': redCrossLogo,
  'brevard-music-center': brevardMusicCenterLogo,
  'brevard-tcda': brevardTCDALogo,
  comporium: comporiumLogo,
  'self-help': selfHelpLogo,
};

// --- HOW WE PARTNER ---

const howWePartner = [
  {
    icon: MessageCircle,
    title: 'Listen',
    description: 'We start with the community. Partnership begins by understanding what people need, what already works, and where gaps remain.',
    color: '#FDB515',
  },
  {
    icon: Users,
    title: 'Align',
    description: 'We bring partners together across sectors — connecting resources, knowledge, and effort so support moves with more clarity.',
    color: '#9E509F',
  },
  {
    icon: Shield,
    title: 'Sustain',
    description: 'We invest in relationships over time, building trust and shared capacity so the work holds beyond any single initiative.',
    color: '#E03694',
  },
];

const keepExploringLinks = [
  {
    to: '/mission',
    label: 'Mission',
    description: 'See how connection, resilience, and shared leadership shape the work.',
  },
  {
    to: '/programs',
    label: 'Programs',
    description: 'Explore how SparkPoint turns community priorities into practical pathways.',
  },
  {
    to: '/trust',
    label: 'Trust & Accountability',
    description: 'Review the transparency and stewardship commitments behind the work.',
  },
];

export function SponsorsPage() {
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';
  const [selectedSector, setSelectedSector] = useState<PartnerSector | null>(null);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : 200]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <SEOHead
        title="Partners | SparkPoint"
        description="Explore the partner ecosystem that supports SparkPoint's community-centered work — across education, health, civic leadership, nonprofits, business, and funding in Western North Carolina."
        path="/partners"
      />

      {/* ──── FIXED STICKY BACKGROUND (same pattern as MissionPage) ──── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 w-full"
          // Taller to allow parallax movement
        >
          <picture>
            <source srcSet={sponsorHeroWebp} type="image/webp" />
            <img
              src={sponsorHeroJpg}
              alt=""
              className="h-full w-full object-cover object-center"
              style={{ minHeight: '120%' }}
            />
          </picture>
          {/* Dark gradient overlay for text legibility — matches Mission page */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.20) 40%, rgba(0,0,0,0.60) 100%)',
            }}
          />
        </motion.div>
      </div>

      {/* ──── 1. HERO (transparent — white text on scenic background) ──── */}
      <section className="relative z-10 px-6 flex flex-col justify-center items-center text-center" style={{ paddingTop: 160, paddingBottom: 100, minHeight: '70vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Glass scrim card — like Mission hero */}
          <div
            className="max-w-2xl mx-auto"
            style={{
              borderRadius: 16,
              padding: '32px 28px',
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.55) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 18px 50px rgba(0,0,0,0.40)',
            }}
          >
            {/* Subtle highlight ring */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: 16,
                boxShadow: 'inset 0 0 0 1px rgba(224,54,148,0.12), inset 0 0 40px rgba(224,54,148,0.06)',
              }}
            />

            <div className="relative">
              <p
                className="text-xs font-semibold uppercase"
                style={{
                  letterSpacing: '0.26em',
                  color: 'rgba(255,255,255,0.60)',
                  textShadow: '0 1px 0 rgba(0,0,0,0.55)',
                  marginBottom: 20,
                }}
              >
                Community Ecosystem
              </p>
              <h1
                className="text-3xl font-bold tracking-tight leading-tight text-white"
                style={{ textShadow: '0 8px 28px rgba(0,0,0,0.55)', marginBottom: 20 }}
              >
                Stronger together, across every sector.
              </h1>
              <p
                className="text-lg leading-relaxed font-light"
                style={{
                  color: 'rgba(255,255,255,0.86)',
                  textShadow: '0 4px 16px rgba(0,0,0,0.50)',
                }}
              >
                SparkPoint connects nonprofits, schools, health systems, civic leaders, businesses,
                and neighbors into a shared ecosystem — so community support moves with more
                clarity, trust, and less duplication.
              </p>
            </div>
          </div>

          {/* Micro-nav — like Mission page */}
          <div className="flex flex-wrap items-center justify-center gap-4" style={{ marginTop: 40 }}>
            {[
              { label: 'How We Partner', target: 'section-how' },
              { label: 'Our Partners', target: 'section-ecosystem' },
              { label: 'Sponsors', target: 'section-sponsors' },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => {
                  const el = document.getElementById(btn.target);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2 text-white text-sm font-semibold transition-all"
                style={{
                  borderRadius: 9999,
                  border: '1px solid rgba(255,255,255,0.20)',
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  letterSpacing: '0.04em',
                }}
              >
                {btn.label} &darr;
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ──── 2. HOW WE PARTNER (dark glass — like Mission "Feedback Loop" section) ──── */}
      <section
        id="section-how"
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(18, 18, 20, 0.90)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
            style={{ marginBottom: 48 }}
          >
            <h2
              className="text-3xl font-bold tracking-tight text-white"
              style={{ marginBottom: 16 }}
            >
              How partnership works at SparkPoint
            </h2>
            <p
              className="text-lg leading-relaxed max-w-3xl mx-auto"
              style={{ color: 'rgba(255,255,255,0.60)' }}
            >
              We don&apos;t just list partners — we work alongside them. Every relationship
              is rooted in listening, shared alignment, and long-term commitment.
            </p>
          </motion.div>

          <style>{`@media (min-width: 768px) { .sp-how-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }`}</style>
          <div className="sp-how-grid grid grid-cols-1 gap-6">
            {howWePartner.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.10)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: 32,
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 9999,
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                      marginBottom: 20,
                    }}
                  >
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <h3
                    className="text-xl font-bold flex items-center gap-2"
                    style={{ color: item.color, marginBottom: 12 }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 9999,
                        backgroundColor: item.color,
                        display: 'inline-block',
                      }}
                    />
                    {item.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.70)' }}
                  >
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-lg font-light"
            style={{
              color: 'rgba(255,255,255,0.50)',
              fontStyle: 'italic',
              marginTop: 48,
            }}
          >
            This isn&apos;t just a process — it&apos;s a living commitment to the people we serve.
          </motion.p>
        </div>
      </section>

      {/* ──── 3. PARTNER ECOSYSTEM (light glass — like Mission "In Practice" section) ──── */}
      <section
        id="section-ecosystem"
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(250, 250, 248, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.50)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
            style={{ marginBottom: 48 }}
          >
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: '#111827', marginBottom: 16 }}
            >
              Working together across sectors
            </h2>
            <p
              className="text-lg leading-relaxed max-w-3xl mx-auto"
              style={{ color: '#4B5563' }}
            >
              These are the organizations and partners SparkPoint works alongside — grouped by
              sector, not by rank. Each relationship reflects shared commitment to community well-being.
            </p>
          </motion.div>

          <style>{`
            @media (min-width: 640px) { .sp-sector-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
            @media (min-width: 1280px) { .sp-sector-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }
          `}</style>
          <div className="sp-sector-grid grid grid-cols-1 gap-6">
            {PARTNER_SECTORS.map((sector, index) => {
              const Icon = SECTOR_ICONS[sector.icon] ?? Sparkles;
              return (
                <motion.div
                  key={sector.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group"
                >
                  <button
                    onClick={() => setSelectedSector(sector)}
                    className="w-full h-full text-left bg-white hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                    style={{ borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <div className="w-full" style={{ height: 3, backgroundColor: sector.color }} />
                    <div className="p-6 flex-1 flex flex-col">
                      <div
                        className="flex items-center justify-center transition-transform duration-300"
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 9999,
                          backgroundColor: `${sector.color}15`,
                          color: sector.color,
                          marginBottom: 16,
                        }}
                      >
                        <Icon size={24} strokeWidth={2.5} />
                      </div>
                      <h3
                        className="text-lg font-bold leading-tight"
                        style={{ color: '#111827', marginBottom: 8 }}
                      >
                        {sector.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed flex-1"
                        style={{ color: '#6B7280', marginBottom: 20 }}
                      >
                        {sector.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-semibold px-2 py-1"
                          style={{ borderRadius: 9999, backgroundColor: '#F3F4F6', color: '#6B7280' }}
                        >
                          {sector.partners.length} Partners
                        </span>
                        <span
                          className="text-xs font-bold uppercase flex items-center gap-1"
                          style={{ letterSpacing: '0.1em', color: sector.color }}
                        >
                          View <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── 4. SPONSORS & FUNDERS (near-white glass — like Mission "Sectors" section) ──── */}
      <section
        id="section-sponsors"
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          paddingTop: 64,
          paddingBottom: 64,
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 36 }}
          >
            <p
              className="text-xs font-semibold uppercase"
              style={{ letterSpacing: '0.2em', color: '#14B8A6', marginBottom: 12 }}
            >
              Financial &amp; Strategic Support
            </p>
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ color: '#111827', marginBottom: 12 }}
            >
              Sponsors &amp; Funders
            </h2>
            <p
              className="text-base leading-relaxed max-w-2xl mx-auto"
              style={{ color: '#6B7280' }}
            >
              These organizations provide financial and strategic support that helps sustain
              SparkPoint&apos;s community-centered work over time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <ul
              aria-label="SparkPoint sponsors and funders"
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-6"
            >
              {FEATURED_PARTNERS.map((sponsor) => (
                <li key={sponsor.name}>
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${sponsor.name} website`}
                    className="group inline-flex items-center justify-center transition duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      borderRadius: 6,
                      /* Fixed bounding box — equalizes visual weight across all aspect ratios */
                      width: 140,
                      height: 52,
                    }}
                  >
                    <img
                      src={PARTNER_LOGOS[sponsor.logoKey]}
                      alt={sponsor.name}
                      className="object-contain transition duration-300 ease-out"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        opacity: 0.75,
                      }}
                      loading="lazy"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ──── 5. STEWARDSHIP BRIDGE (dark glass reveal — like Mission "Rooted" section) ──── */}
      <section
        className="relative z-10 px-6 text-center"
        style={{
          backgroundColor: 'rgba(26, 26, 26, 0.80)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2
            className="text-3xl font-bold text-white"
            style={{ marginBottom: 24 }}
          >
            Stewardship &amp; Trust
          </h2>
          <div className="space-y-6 text-lg leading-relaxed font-light" style={{ color: 'rgba(255,255,255,0.80)' }}>
            <p>
              Partnership should be transparent, fair, and accountable to community.
            </p>
            <p>
              SparkPoint approaches every partnership as shared stewardship — not a transaction.
              We listen first, learn alongside partners, and lead with care so support
              can move where it matters most.
            </p>
            <p className="text-white font-medium text-xl" style={{ paddingTop: 8, fontStyle: 'italic' }}>
              The work only holds when trust does.
            </p>
          </div>
          <Link
            to="/trust"
            className="inline-flex font-semibold underline underline-offset-4"
            style={{
              marginTop: 28,
              color: '#F0B8D6',
              textDecorationColor: 'rgba(240,184,214,0.5)',
            }}
          >
            See our Trust &amp; Accountability commitments
          </Link>
        </motion.div>
      </section>

      {/* ──── 6. CTA (light glass) ──── */}
      <section
        className="relative z-10 px-6"
        style={{
          backgroundColor: 'rgba(250, 250, 248, 0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.50)',
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
            style={{
              borderRadius: 24,
              border: '1px solid rgba(0,0,0,0.06)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: 40,
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            }}
          >
            <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
              <div className="max-w-2xl">
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ letterSpacing: '0.2em', color: '#FDB515', marginBottom: 16 }}
                >
                  Partnership Conversation
                </p>
                <h2
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: '#111827', marginBottom: 16 }}
                >
                  If this feels aligned, let&apos;s talk.
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: '#4B5563' }}>
                  We welcome conversations with organizations that want to strengthen connection,
                  resilience, and community voice in practical, long-term ways.
                </p>
              </div>

              <style>{`@media (min-width: 640px) { .sp-cta-buttons { flex-direction: row !important; } } @media (min-width: 1024px) { .sp-cta-buttons { margin-top: 0 !important; } }`}</style>
              <div className="sp-cta-buttons flex flex-col gap-4" style={{ marginTop: 32 }}>
                <Button
                  asChild
                  size="lg"
                  className="text-white px-8"
                  style={{ backgroundColor: '#E03694' }}
                >
                  <Link to="/intake?intent=partner">Start a conversation</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8"
                  style={{ borderColor: '#D1D5DB', color: '#111827' }}
                >
                  <Link to="/mission">See how SparkPoint works</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──── 7. KEEP EXPLORING ──── */}
      <div className="relative z-10" style={{ backgroundColor: '#F8F6F3' }}>
        <KeepExploringLinks
          title="Keep Exploring"
          intro="Learn more about how SparkPoint works, what it is building, and how trust shows up in practice."
          links={keepExploringLinks}
        />
      </div>

      {/* ──── SECTOR DETAIL MODAL ──── */}
      <AnimatePresence>
        {selectedSector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSector(null)}
              className="absolute inset-0 z-0"
              style={{
                backgroundColor: 'rgba(0,0,0,0.60)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative z-10 w-full bg-white overflow-hidden flex flex-col"
              style={{
                maxWidth: 640,
                maxHeight: '85vh',
                borderRadius: 24,
                boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              }}
            >
              <div
                className="p-8 pb-6 relative overflow-hidden"
                style={{ backgroundColor: `${selectedSector.color}10` }}
              >
                <button
                  onClick={() => setSelectedSector(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white transition-colors z-20"
                  style={{ borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.5)' }}
                >
                  <X size={20} style={{ color: '#6B7280' }} />
                </button>

                <div className="flex items-center gap-4" style={{ marginBottom: 16 }}>
                  <div
                    className="p-3 bg-white"
                    style={{
                      borderRadius: 12,
                      color: selectedSector.color,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    {(() => {
                      const ModalIcon = SECTOR_ICONS[selectedSector.icon] ?? Sparkles;
                      return <ModalIcon size={32} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>
                      {selectedSector.title}
                    </h3>
                    <p
                      className="text-sm font-medium uppercase"
                      style={{
                        letterSpacing: '0.1em',
                        color: selectedSector.color,
                        opacity: 0.7,
                      }}
                    >
                      Sector Hub
                    </p>
                  </div>
                </div>
                <p className="text-lg" style={{ color: '#374151' }}>
                  {selectedSector.description}
                </p>

                {/* Decorative glow */}
                <div
                  className="absolute -top-10 -right-10"
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 9999,
                    backgroundColor: selectedSector.color,
                    opacity: 0.15,
                    filter: 'blur(48px)',
                  }}
                />
              </div>

              <div className="p-8 pt-6 overflow-y-auto">
                {selectedSector.examples && (
                  <div
                    className="p-6 border border-gray-100"
                    style={{
                      borderRadius: 12,
                      backgroundColor: '#F9FAFB',
                      marginBottom: 24,
                    }}
                  >
                    <h4
                      className="text-xs font-bold uppercase"
                      style={{
                        letterSpacing: '0.15em',
                        color: '#9CA3AF',
                        marginBottom: 12,
                      }}
                    >
                      Examples of Collaboration
                    </h4>
                    <ul className="space-y-2">
                      {selectedSector.examples.map((ex, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm font-medium"
                          style={{ color: '#374151' }}
                        >
                          <span
                            className="flex-shrink-0"
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 9999,
                              backgroundColor: selectedSector.color,
                              marginTop: 7,
                            }}
                          />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <h4
                  className="text-xs font-bold uppercase"
                  style={{
                    letterSpacing: '0.15em',
                    color: '#9CA3AF',
                    marginBottom: 16,
                  }}
                >
                  Active Partners
                </h4>
                <style>{`@media (min-width: 640px) { .sp-partner-list { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }`}</style>
                <div className="sp-partner-list grid grid-cols-1 gap-3">
                  {selectedSector.partners.map((partner) =>
                    partner.url ? (
                      <a
                        key={partner.name}
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 border border-gray-100 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-between gap-2"
                        style={{ borderRadius: 10, color: '#374151' }}
                      >
                        {partner.name}
                        <ArrowUpRight size={14} style={{ color: selectedSector.color, flexShrink: 0 }} />
                      </a>
                    ) : (
                      <div
                        key={partner.name}
                        className="p-3 border border-gray-100 hover:bg-gray-50 transition-colors text-sm font-medium"
                        style={{ borderRadius: 10, color: '#374151' }}
                      >
                        {partner.name}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div
                className="p-4 text-center border-t border-gray-100"
                style={{ backgroundColor: '#F9FAFB' }}
              >
                <Button
                  onClick={() => setSelectedSector(null)}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
