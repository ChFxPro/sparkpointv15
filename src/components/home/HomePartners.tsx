import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PARTNER_SECTORS } from '../../data/partners';
import { useAccessibility } from '../../context/AccessibilityContext';
import { partnerLogo, type PartnerLogo } from '../partnerLogos';

// Partner logos in one strip, with the partners listed by sector below. Every
// few seconds each logo slot crossfades to the next set, so all the logos get a
// turn; each set mixes regional/state/national organizations with local ones.

// Organizations whose reach is regional, statewide, national, or wider.
const WIDE = new Set([
  'Dogwood Health Trust',
  'American Red Cross',
  'UNC Health Pardee',
  'Vaya Health',
  'First Citizens Bank',
  'AdventHealth',
  'UnitedHealthcare',
  'Self-Help Credit Union',
  'North Carolina Rural Health Association',
  'Foundation for Health Leadership and Innovation',
  'NC DHHS Office of Rural Health',
  'UNC Chapel Hill, Gillings School of Public Health',
  'WNC Bridge Foundation',
  'AAUW',
  'Blue Ridge Community College',
  'Pisgah Legal Services',
  'Just Economics of Western North Carolina',
  'Center for Trauma Resilient Communities',
]);

const ALL_PARTNERS = Array.from(new Map(PARTNER_SECTORS.flatMap((s) => s.partners).map((p) => [p.name, p])).values());
const WITH_LOGO = ALL_PARTNERS.filter((p) => partnerLogo(p.name));
const WIDE_LOGOS = WITH_LOGO.filter((p) => WIDE.has(p.name));
const LOCAL_LOGOS = WITH_LOGO.filter((p) => !WIDE.has(p.name));

const SLOTS = 8;
// Three regional/state/national logos and five local ones in every view, in
// fixed spots spread across the strip (and across both rows on phones).
const WIDE_SLOTS = new Set([1, 4, 6]);
const SLOT_KIND: ('wide' | 'local')[] = Array.from({ length: SLOTS }, (_, i) => (WIDE_SLOTS.has(i) ? 'wide' : 'local'));
const POOL = { wide: WIDE_LOGOS, local: LOCAL_LOGOS };
const INITIAL: Partner[] = (() => {
  const used = { wide: 0, local: 0 };
  return SLOT_KIND.map((k) => POOL[k][used[k]++ % POOL[k].length]);
})();
// One logo changes at a time, in this slot order, so the strip never jumps.
const SWAP_ORDER = [5, 0, 6, 3, 1, 7, 2, 4];
const SWAP_EVERY_MS = 3200;

type Partner = (typeof ALL_PARTNERS)[number];

// Optical sizing: every logo gets about the same visual area, so a round seal
// shows taller and a long wordmark shorter, instead of all sharing one height.
const LOGO_AREA = 8200; // px²
const MIN_H = 34;
const MAX_H = 76;
const ratios = new Map<string, number>();

function SizedLogo({ src, alt, className, hidden }: { src: string; alt: string; className: string; hidden?: boolean }) {
  const [ratio, setRatio] = useState(() => ratios.get(src) ?? 2.4);
  const height = Math.round(Math.max(MIN_H, Math.min(MAX_H, Math.sqrt(LOGO_AREA / ratio))));
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={hidden || undefined}
      className={className}
      style={{ height, width: Math.round(height * ratio) }}
      decoding="async"
      onLoad={(e) => {
        const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
        if (w && h) {
          ratios.set(src, w / h);
          setRatio(w / h);
        }
      }}
    />
  );
}

function LogoSlot({ current, previous }: { current: Partner; previous: Partner | null }) {
  const logo = (p: Partner, cls: string) => {
    const art = partnerLogo(p.name) as PartnerLogo;
    const className = `home-logo-${cls} absolute inset-0 m-auto max-w-full object-contain`;
    // All-white logos (`-ink` files) are drawn as their shape in near-black.
    return art.ink ? (
      <span
        key={`${p.name}-${cls}`}
        role={cls === 'out' ? undefined : 'img'}
        aria-label={cls === 'out' ? undefined : p.name}
        aria-hidden={cls === 'out' || undefined}
        className={`home-logo-${cls} absolute inset-0 block`}
        style={{ backgroundColor: 'var(--home-ink-logo)', mask: `url("${art.src}") center / contain no-repeat`, WebkitMask: `url("${art.src}") center / contain no-repeat` }}
      />
    ) : (
      <SizedLogo key={`${p.name}-${cls}`} src={art.src} alt={cls === 'out' ? '' : p.name} hidden={cls === 'out'} className={className} />
    );
  };
  const layers = (
    <span className="relative block h-full w-full">
      {previous && logo(previous, 'out')}
      {logo(current, 'in')}
    </span>
  );
  return current.url ? (
    <a
      href={current.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full w-full items-center justify-center rounded-lg p-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--home-pink)]"
    >
      {layers}
    </a>
  ) : (
    <span className="flex h-full w-full items-center justify-center p-2">{layers}</span>
  );
}

export function HomePartners() {
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const reducedMotion = Boolean(systemReducedMotion) || motionPreference === 'reduce';
  const [shown, setShown] = useState<Partner[]>(INITIAL);
  const [previous, setPrevious] = useState<(Partner | null)[]>(() => INITIAL.map(() => null));
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const rotates = !reducedMotion && WITH_LOGO.length > SLOTS;

  useEffect(() => {
    if (!rotates || paused || hovering) return;
    const id = window.setTimeout(() => {
      const slot = SWAP_ORDER[tick % SWAP_ORDER.length];
      const kind = SLOT_KIND[slot];
      const onScreen = new Set(shown.map((p) => p.name));
      const pool = POOL[kind];
      const start = pool.findIndex((p) => p.name === shown[slot].name);
      // Next logo of the same kind that isn't already on screen.
      let next = shown[slot];
      for (let step = 1; step <= pool.length; step++) {
        const candidate = pool[(start + step) % pool.length];
        if (!onScreen.has(candidate.name)) {
          next = candidate;
          break;
        }
      }
      setPrevious((prev) => prev.map((p, i) => (i === slot ? shown[slot] : p)));
      setShown((cur) => cur.map((p, i) => (i === slot ? next : p)));
      setTick((t) => t + 1);
    }, SWAP_EVERY_MS);
    return () => window.clearTimeout(id);
  }, [rotates, paused, hovering, tick, shown]);

  return (
    <section aria-labelledby="home-partners-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-16">
          <h2 id="home-partners-heading" className="home-h2 text-[var(--home-ink)]">
            {ALL_PARTNERS.length} partner organizations
          </h2>
          <p className="text-lg leading-relaxed text-[var(--home-muted)] md:text-xl">
            Schools, nonprofits, county and town government, health care, local business, and
            funders from across Western North Carolina and beyond.
          </p>
        </div>

        <div
          className="mb-14 border-y border-[var(--home-ink)]/10 py-10"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocusCapture={() => setHovering(true)}
          onBlurCapture={() => setHovering(false)}
        >
          <ul className="grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:grid-cols-4">
            {shown.map((p, slot) => (
              <li key={slot} className="flex h-20 items-center justify-center">
                <LogoSlot current={p} previous={previous[slot]} />
              </li>
            ))}
          </ul>
          {rotates && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                aria-pressed={paused}
                className="min-h-[44px] rounded px-2 text-sm font-semibold text-[var(--home-muted)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--home-pink)]"
              >
                {paused ? 'Play logos' : 'Pause logos'}
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNER_SECTORS.map((sector) => (
            <div key={sector.id}>
              <h3 className="mb-2 flex items-center gap-2 text-base font-extrabold text-[var(--home-ink)]">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sector.color }} aria-hidden="true" />
                {sector.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
                {sector.partners.map((p) => p.name).join(' · ')}
              </p>
            </div>
          ))}
        </div>

        <Link
          to="/partners"
          className="home-link mt-12 inline-flex min-h-[44px] items-center gap-2 text-lg font-bold text-[var(--home-pink-deep)]"
        >
          Meet our partners <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
