'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';
import {
  GraduationCap,
  HeartHandshake,
  Landmark,
  Stethoscope,
  Handshake,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { PARTNER_SECTORS, type PartnerSector } from '../data/partners';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';

// Transylvania County map lives in /public/assets/impact and is referenced by URL
// (optimized down from a 6.7MB source scan — see public/assets/impact/Transylvania County Map.webp).
const transylvaniaMapSrc = `${import.meta.env.BASE_URL}assets/impact/transylvania-county-map.webp`;

const SECTOR_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  HeartHandshake,
  Landmark,
  Stethoscope,
  Handshake,
  Sparkles,
};

type ListenLearnLeadPhase = 'Listen' | 'Learn' | 'Lead';

const PHASE_DETAIL: Record<ListenLearnLeadPhase, string> = {
  Listen: 'We start by listening deeply to residents and lived experience.',
  Learn: 'We learn alongside our partners before assuming solutions.',
  Lead: 'We lead only when the community asks us to.',
};

const WNC_DETAIL =
  "We share what we've learned with communities that reach out — led by relationships, not expansion targets.";

// Two points on the outer ring (r=45% around 50/50 center) that carry a slow "signal ping" —
// atmosphere only, not a claim about any specific place or partnership.
const RING_PING_POINTS = [
  { x: 95, y: 50 },
  { x: 7.7, y: 65.4 },
];

// Compact, anchored popover card for a sector's partners — replaces an earlier full-height
// bottom sheet that felt heavy for a quick "who's in this sector" glance.
function SectorPopoverContent({ sector }: { sector: PartnerSector }) {
  const Icon = SECTOR_ICONS[sector.icon] ?? Sparkles;
  return (
    <>
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="flex items-center justify-center rounded-full flex-none"
          style={{ width: 32, height: 32, background: sector.color, color: 'white' }}
        >
          <Icon size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-white font-bold text-sm leading-tight">{sector.title}</div>
          <div className="text-white/50 text-[11px] leading-snug">{sector.description}</div>
        </div>
      </div>

      <div className="max-h-[42vh] overflow-y-auto -mx-1 px-1">
        {sector.partners.map((partner) => (
          <div key={partner.name} className="py-1.5 border-b border-white/8 flex items-center justify-between gap-2 last:border-b-0">
            <span className="text-[13px] text-white/85 leading-snug">{partner.name}</span>
            {partner.url && (
              <a
                href={partner.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-[11px] font-semibold flex-none"
                style={{ color: sector.color }}
              >
                Visit <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        ))}
      </div>

      <Link
        to="/partners"
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white"
      >
        See the full partner directory <ArrowUpRight size={13} />
      </Link>
    </>
  );
}

const POPOVER_CARD_CLASS =
  'w-72 rounded-2xl border border-white/15 p-4 shadow-2xl outline-none bg-[rgba(16,14,20,0.97)] backdrop-blur-xl';

export function CommunityNetworkDiagram() {
  const prefersReducedMotion = useReducedMotion();
  const [activePhase, setActivePhase] = useState<ListenLearnLeadPhase | null>(null);
  const [wncActive, setWncActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="pb-12 md:pb-20"
    >
      {/* Headline */}
      <div className="text-center mb-12 md:mb-16 px-4 md:px-6">
        <h3
          className="text-white mb-5 md:mb-6 leading-tight"
          style={{ fontSize: 'clamp(2rem, 7.5vw, 3rem)', fontWeight: '700', letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}
        >
          Community Built in Transylvania County
        </h3>
        <p className="max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'clamp(1rem, 3.8vw, 1.25rem)', lineHeight: '1.6', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
          Shaped through lived experience, sustained partnership, and an ongoing cycle of Listen • Learn • Lead. Tap a sector to meet who makes it happen.
        </p>
      </div>

      <div className="relative w-full max-w-5xl mx-auto mb-6 md:mb-8 px-4 md:px-6">
        {/* Diagram Container - Softened & Open */}
        <div className="relative rounded-[40px] overflow-visible h-[400px] md:h-[560px]" style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.92), rgba(40, 20, 35, 0.88))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 0 120px rgba(224, 54, 148, 0.1)', // Ambient glow instead of hard shadow
        }}>

          {/* Layered ridgeline silhouettes — literal atmospheric-perspective depth, "home in the mountains" */}
          <svg
            className="absolute inset-x-0 bottom-0 w-full pointer-events-none rounded-b-[40px]"
            style={{ height: '38%' }}
            viewBox="0 0 400 140"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,140 L0,95 L45,58 L85,82 L135,38 L185,72 L235,28 L285,68 L335,42 L400,88 L400,140 Z" fill="rgba(60,35,55,0.30)" />
            <path d="M0,140 L0,115 L60,85 L110,105 L160,68 L210,100 L260,62 L310,95 L360,72 L400,105 L400,140 Z" fill="rgba(30,18,32,0.42)" />
          </svg>

          {/* Topographic backdrop — grounds the county shape instead of leaving it floating on a flat gradient */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" aria-hidden="true">
            <defs>
              <pattern id="topoContours" width="140" height="90" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
                <path d="M-10 20 Q 25 -5, 60 20 T 150 20" fill="none" stroke="white" strokeWidth="1" />
                <path d="M-10 45 Q 25 20, 60 45 T 150 45" fill="none" stroke="white" strokeWidth="1" />
                <path d="M-10 70 Q 25 45, 60 70 T 150 70" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topoContours)" />
          </svg>

          {/* Vignette — keeps the map/center sharp, edges hazier: home in focus, region beyond is periphery */}
          <div
            className="absolute inset-0 rounded-[40px] pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 45%, transparent 40%, rgba(10,8,14,0.5) 100%)' }}
            aria-hidden="true"
          />

          {/* Diagram Area — clipped, unchanged from the verified county-map redesign */}
          <div className="absolute inset-0 flex items-center justify-center p-5 md:p-8 overflow-hidden rounded-[40px]">
            <div className="relative w-full h-full max-w-[500px] max-h-[500px] flex items-center justify-center scale-95 md:scale-100">

              {/* 1. Outer Ring: Regional Awareness — now tappable, carries two slow "signal ping" points */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_120s_linear_infinite]" style={{ opacity: 0.15 }}>
                <circle cx="50%" cy="50%" r="45%" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6 8" strokeLinecap="round" className="origin-center" />
                {!prefersReducedMotion && RING_PING_POINTS.map((p, i) => (
                  <g key={i}>
                    <circle cx={`${p.x}%`} cy={`${p.y}%`} r="2.5" fill="#FDB515" />
                    <motion.circle
                      cx={`${p.x}%`}
                      cy={`${p.y}%`}
                      r="2.5"
                      fill="#FDB515"
                      animate={{ r: [2.5, 9], opacity: [0.6, 0] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: i * 1.3 }}
                    />
                  </g>
                ))}
              </svg>

              <button
                type="button"
                onClick={() => setWncActive((v) => !v)}
                className="absolute top-[5%] left-1/2 -translate-x-1/2 text-center w-full px-4 pointer-events-auto outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg"
                aria-pressed={wncActive}
                aria-describedby="wnc-detail"
              >
                <div className="text-white/50 text-[10px] tracking-[0.25em] uppercase font-semibold mb-1">Western North Carolina</div>
                <div className="text-white/30 text-[9px] tracking-wide">Shared learning & regional interest</div>
                <AnimatePresence>
                  {wncActive && (
                    <motion.p
                      id="wnc-detail"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 text-white/70 text-[9.5px] leading-snug max-w-[220px] mx-auto"
                    >
                      {WNC_DETAIL}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>

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

                {/* Nodes: Listen, Learn, Lead - interactive, reveal what each phase means */}
                {([
                  { label: "Listen" as const, angle: -90 },
                  { label: "Learn" as const, angle: 30 },
                  { label: "Lead" as const, angle: 150 }
                ]).map((node) => {
                  // Listen sits close to the outer ring text, so it keeps a tighter radius;
                  // Learn/Lead sit lower and need to clear the taller map hub beneath them.
                  const radius = node.label === "Listen" ? 30 : 42; // percent
                  const x = 50 + radius * Math.cos(node.angle * Math.PI / 180);
                  const y = 50 + radius * Math.sin(node.angle * Math.PI / 180);
                  const isActive = activePhase === node.label;
                  const tooltipAbove = node.angle !== -90; // Learn/Lead sit low — open upward so the tooltip clears the caption below the map
                  // Learn/Lead tooltips also shift away from center so they clear the map caption chip instead of covering it
                  const tooltipSideOffset = node.label === 'Lead' ? -40 : node.label === 'Learn' ? 40 : 0;

                  return (
                    <button
                      key={node.label}
                      type="button"
                      onMouseEnter={() => setActivePhase(node.label)}
                      onMouseLeave={() => setActivePhase((p) => (p === node.label ? null : p))}
                      onFocus={() => setActivePhase(node.label)}
                      onBlur={() => setActivePhase((p) => (p === node.label ? null : p))}
                      onClick={() => setActivePhase(node.label)}
                      className="absolute w-24 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-auto outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg"
                      style={{ left: `${x}%`, top: `${y}%`, zIndex: isActive ? 30 : 10 }}
                      aria-pressed={isActive}
                      aria-describedby={`phase-detail-${node.label.toLowerCase()}`}
                    >
                      <motion.span
                        animate={{
                          scale: isActive ? 1.35 : 1,
                          boxShadow: isActive
                            ? '0 0 0 8px rgba(253,181,21,0.18), 0 0 24px rgba(253,181,21,0.7)'
                            : '0 0 20px rgba(253,181,21,0.5)',
                        }}
                        transition={{ duration: 0.25 }}
                        className="w-2.5 h-2.5 rounded-full bg-[#FDB515] mb-3"
                      />
                      <span className="text-white font-bold tracking-[0.15em] text-xs uppercase" style={{ opacity: isActive ? 1 : 0.9 }}>
                        {node.label}
                      </span>

                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            id={`phase-detail-${node.label.toLowerCase()}`}
                            role="tooltip"
                            initial={{ opacity: 0, y: tooltipAbove ? 4 : -4, x: tooltipSideOffset }}
                            animate={{ opacity: 1, y: 0, x: tooltipSideOffset }}
                            exit={{ opacity: 0, y: tooltipAbove ? 4 : -4, x: tooltipSideOffset }}
                            transition={{ duration: 0.2 }}
                            className={`absolute w-32 sm:w-40 text-[10px] leading-snug text-white/90 bg-black/70 backdrop-blur-md rounded-lg px-3 py-2 border border-white/15 shadow-xl pointer-events-none ${tooltipAbove ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                          >
                            {PHASE_DETAIL[node.label]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>

              {/* 3. Central Hub - the county itself, not an abstraction */}
              <div className="relative z-20 flex flex-col items-center">
                <motion.div
                  className="relative inline-block"
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.02, 1] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div
                    className="pointer-events-none absolute rounded-full"
                    style={{
                      inset: '-25%',
                      background: 'radial-gradient(circle, rgba(224,54,148,0.35), rgba(253,181,21,0.12) 45%, rgba(224,54,148,0) 72%)',
                      filter: 'blur(18px)',
                    }}
                    aria-hidden="true"
                  />
                  {/* Contact shadow — reads as resting on ground, not floating */}
                  <div
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2"
                    style={{
                      bottom: '6%',
                      width: '80%',
                      height: '16%',
                      borderRadius: '100%',
                      background: 'radial-gradient(ellipse, rgba(0,0,0,0.5), rgba(0,0,0,0) 70%)',
                      filter: 'blur(6px)',
                    }}
                    aria-hidden="true"
                  />
                  <img
                    src={transylvaniaMapSrc}
                    alt="Outline map of Transylvania County, North Carolina, showing Brevard, Pisgah Forest, Rosman, Lake Toxaway, and surrounding national forest land"
                    className="relative w-28 sm:w-32 md:w-40 h-auto select-none"
                    style={{ filter: 'drop-shadow(0 10px 34px rgba(0,0,0,0.55)) drop-shadow(0 0 30px rgba(224,54,148,0.25))' }}
                    draggable={false}
                    width={1100}
                    height={1031}
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Home marker: Brevard, SparkPoint HQ */}
                  <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: '65%', top: '46%' }}>
                    <span className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-[#FDB515]" style={{ boxShadow: '0 0 12px rgba(253,181,21,0.8)' }} />
                    {!prefersReducedMotion && (
                      <motion.span
                        className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-[#FDB515]"
                        animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    <span className="sr-only">Brevard, North Carolina — SparkPoint's home base</span>
                  </div>

                  {/* Caption overlays the map itself so the hub stays compact enough to clear the Listen/Learn/Lead nodes */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-1 sm:bottom-1.5 md:bottom-2 inline-flex flex-col items-center rounded-md bg-black/55 backdrop-blur-md border border-white/15 px-2.5 py-1 whitespace-nowrap">
                    <span className="text-white font-bold text-[9px] sm:text-[10px] tracking-wide leading-none">Transylvania County</span>
                    <span className="text-white/70 text-[6.5px] sm:text-[7px] font-semibold tracking-[0.15em] uppercase mt-0.5 leading-none">Our Home Community</span>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>

          {/* Sector nodes — desktop/tablet only, sibling of the clipped Diagram Area so they aren't cut off */}
          <div className="hidden md:block">
            {PARTNER_SECTORS.map((sector, i) => {
              const Icon = SECTOR_ICONS[sector.icon] ?? Sparkles;
              return (
                <Popover key={sector.id}>
                  <PopoverTrigger asChild>
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 outline-none group"
                      style={{ left: `${sector.homePosition.x}%`, top: `${sector.homePosition.y}%` }}
                      aria-label={`Show ${sector.title} partners`}
                    >
                      <span
                        className="flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-white/70"
                        style={{
                          width: 60,
                          height: 60,
                          background: 'white',
                          border: `3px solid ${sector.color}`,
                          boxShadow: '0 10px 26px rgba(0,0,0,0.35)',
                          color: sector.color,
                        }}
                      >
                        <Icon size={24} strokeWidth={2.25} />
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-sm border border-white/10 text-white text-[11px] font-semibold tracking-wide whitespace-nowrap">
                        {sector.title}
                      </span>
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent className={POPOVER_CARD_CLASS} sideOffset={10}>
                    <SectorPopoverContent sector={sector} />
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
        </div>

        {/* Sector chips — mobile: a compact row below the diagram instead of a second radial layout */}
        <div className="md:hidden flex flex-wrap justify-center gap-2 mt-4">
          {PARTNER_SECTORS.map((sector) => {
            const Icon = SECTOR_ICONS[sector.icon] ?? Sparkles;
            return (
              <Popover key={sector.id}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    style={{ background: `${sector.color}33`, border: `1.5px solid ${sector.color}` }}
                  >
                    <Icon size={14} strokeWidth={2.5} />
                    {sector.title}
                  </button>
                </PopoverTrigger>
                <PopoverContent className={POPOVER_CARD_CLASS} align="center" sideOffset={10}>
                  <SectorPopoverContent sector={sector} />
                </PopoverContent>
              </Popover>
            );
          })}
        </div>

        {/* Copy Block - Reflective & Clear */}
        <div className="max-w-2xl mx-auto text-center px-4 mt-8 md:mt-10">
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
  );
}
