'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router';
import { Users, MessageCircle, Shield } from 'lucide-react';
import sponsorHeroJpg from '../assets/sponsors/sponsor_hero.jpg';
import sponsorHeroWebp from '../assets/sponsors/sponsor_hero.webp';
import { CommunityNetworkDiagram } from '../components/CommunityNetworkDiagram';
import { KeepExploringLinks } from '../components/KeepExploringLinks';
import { ProgramPartners } from '../components/partners/ProgramPartners';
import { PartnerDirectory } from '../components/partners/PartnerDirectory';
import { SEOHead } from '../components/SEOHead';
import { Button } from '../components/ui/button';
import { useAccessibility } from '../context/AccessibilityContext';


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
              { label: 'Our Partners', target: 'section-directory' },
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

      {/* ──── Partner network: the county at the center, sectors around it (moved here from the homepage) ──── */}
      <section className="relative z-10 px-6 pt-20 md:pt-24" style={{ backgroundColor: '#2A1430' }}>
        <div className="mx-auto max-w-7xl">
          <CommunityNetworkDiagram />
        </div>
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

      {/* ──── 4. PARTNERS IN OUR PROGRAMS, THEN EVERY PARTNER BY SECTOR ──── */}
      <ProgramPartners />
      <PartnerDirectory />

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

    </div>
  );
}
