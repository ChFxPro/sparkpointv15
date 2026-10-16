import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { LitSentence } from './home/LitSentence';
import { STORY_COLLECTIONS } from '../data/storyCollections';

import storyWebp from '../assets/connection_happens/story1.webp';
import connectorsWebp from '../assets/commconn/imgs/comcon_group_elev-1200.webp';
import hub800 from '../assets/hub/hub-day-800.webp';
import hub1600 from '../assets/hub/hub-day-1600.webp';
// TrailHead's own lockup (the double blaze and wordmark, cream for dark grounds),
// from the logo kit in Branding/TrailHead; see that folder's README.
import trailheadLockup from '../assets/trailhead/trailhead-lockup-horizontal-reversed.svg';

// What SparkPoint is building now, one program per pathway it belongs to,
// in the program pages' pathway colours (Listen, Lead, Connect; see
// src/pages/programs/programsData.ts). On large screens the list on the
// left stays put and lights the program whose card is in view while the
// cards stack on the right; on smaller screens the cards simply follow
// one another.

// The simulator's name (2026-10-15), written joined and capitalised like
// SparkPoint. Until it's widely known, introduce it alongside SparkPoint
// ("a SparkPoint simulation"): said aloud it's the same word as Salesforce's
// Trailhead. Scenarios are editions of it, e.g. "TrailHead: Rural Health".
const SIMULATOR_NAME = 'TrailHead';

// `color` is the pathway colour from the programs page; `deep` is a darker
// shade of it that each card is drawn in, dark enough for white text.
const PATHWAY = {
  listen: { label: 'Listen', color: '#9E509F', deep: '#5e2a63' },
  lead: { label: 'Lead', color: '#E03694', deep: '#9c1a5e' },
  connect: { label: 'Connect', color: '#F15F48', deep: '#a8392a' },
} as const;

const recapPhoto = (width: 800 | 1600) =>
  `${import.meta.env.BASE_URL}assets/Rural%20Health/recap/highlights/simulator-tablet-${width}.webp`;

const activeCollection = STORY_COLLECTIONS.find((c) => c.status === 'active');

type Program = {
  id: string;
  pathway: keyof typeof PATHWAY;
  title: string;
  body: string;
  tags: string[];
  image: { src: string; srcSet?: string; alt: string; position?: string };
  links: { label: string; to: string }[];
  /** Card colour when it shouldn't be its pathway's `deep` shade (two Connect cards sit back to back). */
  tone?: string;
  /** A program with its own brand shows its logo in place of the set title. */
  logo?: string;
};

const PROGRAMS: Program[] = [
  {
    id: 'story-collection',
    pathway: 'listen',
    title: 'Community Story Collection',
    body: activeCollection
      ? `We gather residents’ stories on one question at a time and take what we hear to the people making local decisions. Right now: ${activeCollection.title.toLowerCase()}.`
      : 'We gather residents’ stories on one question at a time and take what we hear to the people making local decisions.',
    tags: ['Open to every resident', 'Anonymous'],
    image: {
      src: storyWebp,
      alt: 'A resident tells her story on camera, seen both in the room behind and on the recording monitor in front.',
      // The storyteller herself sits behind the monitor at the top left; keep her in frame.
      position: '0% 30%',
    },
    links: activeCollection
      ? [
          { label: 'Share your story', to: `/stories/collections/${activeCollection.id}` },
          { label: 'Read community stories', to: '/stories' },
        ]
      : [{ label: 'Read community stories', to: '/stories' }],
  },
  {
    id: 'simulator',
    pathway: 'lead',
    title: SIMULATOR_NAME,
    body: 'A SparkPoint simulation that turns a room into a system: small groups carry a fictional family through its doors, delays, and handoffs. It filled the room on October 1, and it can be rebuilt around the system your group works on.',
    tags: ['Facilitated session', 'For organizations and coalitions'],
    image: {
      src: recapPhoto(800),
      srcSet: `${recapPhoto(800)} 800w, ${recapPhoto(1600)} 1600w`,
      alt: 'A small group gathers around a tablet as one participant points to the screen, working through the simulator.',
    },
    links: [
      { label: 'Bring it to your group', to: '/intake?intent=partner' },
      { label: 'See it at the convening', to: '/rural-health-convening#simulator' },
    ],
    // TrailHead has its own brand: its logo, drawn on its own forest green.
    logo: trailheadLockup,
    tone: '#2F4A3C',
  },
  {
    id: 'community-connectors',
    pathway: 'connect',
    title: 'Community Connectors',
    body: 'Neighbors people already trust, with the training and tools to help their communities get ready for hard days and recover from them. Born from what we heard after Helene.',
    tags: ['With the American Red Cross and FWRD Transylvania'],
    image: { src: connectorsWebp, alt: 'Community Connectors gathered around long tables, talking in small groups.', position: '50% 40%' },
    links: [{ label: 'Meet the Connectors', to: '/community-connectors' }],
  },
  {
    id: 'resilience-hub',
    pathway: 'connect',
    title: 'The Resilience Hub',
    body: 'We’re about to start building out the Resilience Hub at 94 S. Caldwell Street in Brevard: a shared front door where residents, nonprofits, and partners will meet, learn, and find the help they need. Help us make it real.',
    tags: ['Build-out starting soon', 'Brevard'],
    image: {
      src: hub800,
      srcSet: `${hub800} 800w, ${hub1600} 1600w`,
      alt: 'The brick front of the SparkPoint Resilience Hub, its sign over the entrance.',
      // hub-day-*.webp is cropped from the left of the full render so the sign and
      // door sit right of centre, clear of the words on the left of this card.
    },
    links: [
      { label: 'Help build the Hub', to: '/donations' },
      { label: 'See the plans', to: '/resilience-hub' },
    ],
    tone: '#7a2a20',
  },
];

// Each card pins a little lower than the last, so the earlier ones still show
// their top edge (and their pathway colour) as the next one slides over.
const STICKY_TOP = ['lg:top-24', 'lg:top-[7.25rem]', 'lg:top-[8.5rem]', 'lg:top-[9.75rem]'];

// Every card is the same size, the photo filling it. The words sit straight
// on the photo over a wash of the pathway's colour that fades in from one
// side (from the bottom on phones), the side swapping from card to card.
function ProgramCard({ program, index }: { program: Program; index: number }) {
  const pathway = PATHWAY[program.pathway];
  const last = index === PROGRAMS.length - 1;
  const side = index % 2 === 0 ? 'right' : 'left';
  const tone = program.tone ?? pathway.deep;
  const [primary, ...secondary] = program.links;
  return (
    <article
      id={`program-${program.id}`}
      data-program={program.id}
      data-side={side}
      aria-labelledby={`program-${program.id}-title`}
      className={`home-program group relative flex h-[32rem] scroll-mt-28 overflow-hidden rounded-[1.75rem] bg-[var(--home-plum)] text-white sm:h-[31rem] lg:sticky lg:h-[min(72vh,33rem)] ${side === 'right' ? 'sm:justify-end' : ''} ${STICKY_TOP[index]} ${last ? '' : 'lg:mb-8'}`}
      style={{ ['--tone' as string]: tone, boxShadow: '0 -18px 40px -22px rgba(20,8,24,0.6)' }}
    >
      <img
        src={program.image.src}
        srcSet={program.image.srcSet}
        sizes="(min-width: 1024px) 62vw, 100vw"
        alt={program.image.alt}
        loading="lazy"
        decoding="async"
        className="home-program-photo absolute inset-0 h-full w-full object-cover"
        style={program.image.position ? { objectPosition: program.image.position } : undefined}
      />
      <div aria-hidden="true" className="home-program-scrim pointer-events-none absolute inset-0" />
      <div className="relative flex w-full flex-col justify-end p-6 sm:w-[52%] sm:justify-center md:p-9 lg:w-[50%]">
        <h3 id={`program-${program.id}-title`} className="text-[1.75rem] font-extrabold leading-[1.08] tracking-[-0.01em] md:text-[2.1rem]" style={{ textWrap: 'balance' }}>
          {program.logo ? (
            <img src={program.logo} alt={program.title} className="h-11 w-auto max-w-full md:h-14" />
          ) : (
            program.title
          )}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-white/90">{program.body}</p>
        <ul className="mt-5 hidden flex-wrap gap-2 sm:flex" aria-label="About this program">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[0.8rem] font-bold" style={{ color: tone }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pathway.color }} aria-hidden="true" />
            {pathway.label}
          </li>
          {program.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-white/40 px-3 py-1 text-[0.8rem] font-semibold text-white">
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 md:mt-6">
          <Link
            to={primary.to}
            className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 text-base font-bold transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            style={{ color: tone, ['--tw-ring-offset-color' as string]: tone }}
          >
            {primary.label} <ArrowRight size={16} aria-hidden="true" />
          </Link>
          {secondary.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-base font-bold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ConnectionSection() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(PROGRAMS[0].id);

  // Light the list entry for the card on top of the stack: the last one whose
  // top edge has come up past 40% of the view.
  useEffect(() => {
    const cards = Array.from(cardsRef.current?.querySelectorAll<HTMLElement>('[data-program]') ?? []);
    if (!cards.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = cards[0];
      for (const card of cards) if (card.getBoundingClientRect().top <= line) current = card;
      setActive(current.dataset.program!);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="what-we-do" aria-labelledby="what-we-do-heading" className="relative scroll-mt-24 overflow-x-clip bg-white px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24">
          <LitSentence />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-14">
          {/* Heading and the pathway list; it stays in view beside the cards on large screens. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 id="what-we-do-heading" className="home-h2 text-[var(--home-ink)]">
              From a story to a front door
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--home-muted)]">
              Our programs follow four pathways: Listen, Learn, Lead, and Connect. This is
              what&rsquo;s growing right now.
            </p>
            <ol className="mt-8 hidden space-y-1.5 lg:block" aria-label="Programs in this section">
              {PROGRAMS.map((p) => {
                const pathway = PATHWAY[p.pathway];
                const on = p.id === active;
                return (
                  <li key={p.id}>
                    <a
                      href={`#program-${p.id}`}
                      aria-current={on ? 'true' : undefined}
                      className="home-path-step flex min-h-[44px] items-center gap-3 rounded-xl border px-3.5 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--home-pink)]"
                      style={{
                        borderColor: on ? `${pathway.color}66` : 'rgba(0,0,0,0.06)',
                        backgroundColor: on ? `${pathway.color}12` : '#fff',
                      }}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: pathway.color, opacity: on ? 1 : 0.45 }}
                        aria-hidden="true"
                      />
                      <span className={`min-w-0 flex-1 text-[0.95rem] ${on ? 'font-extrabold text-[var(--home-ink)]' : 'font-semibold text-[var(--home-muted)]'}`}>
                        {p.title}
                      </span>
                      <span className="text-[0.8rem] font-semibold text-[var(--home-muted)]">{pathway.label}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
            <p className="mt-8 text-base leading-relaxed text-[var(--home-muted)]">
              <Link to="/programs" className="home-link inline-flex min-h-[44px] items-center gap-1.5 font-bold text-[var(--home-pink-deep)]">
                All programs <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <span aria-hidden="true" className="mx-2">·</span>
              <Link to="/mission" className="home-link inline-flex min-h-[44px] items-center font-bold text-[var(--home-pink-deep)]">
                How we work
              </Link>
            </p>
          </div>

          <div ref={cardsRef} className="flex flex-col gap-8 lg:gap-0 lg:pb-6">
            {PROGRAMS.map((p, i) => (
              <ProgramCard key={p.id} program={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
