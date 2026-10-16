import { getNextGathering } from './events';
import { ACTIVE_STORY_COLLECTIONS } from './storyCollections';

// The homepage spotlight: one or two things featured on the bottom edge of the
// hero. To change what's featured, edit SPOTLIGHT below. Items show from
// `from` (optional) until the end of `until` (optional), Eastern time; at most
// two show, in order. If none are active, the next event on the calendar
// (src/data/events.ts) is featured automatically.
export interface SpotlightItem {
  id: string;
  title: string;
  /** One or two plain sentences. */
  body: string;
  cta: { label: string; href: string };
  /** Optional date, shown as the first chip, e.g. 'Fri, Dec 11 · 6 p.m.'. */
  when?: string;
  /** Short facts shown as chips after the date. */
  tags?: string[];
  /** The card is drawn like the programs cards: this photo fills it under a wash of `tone`. */
  image?: { src: string; srcSet?: string; alt: string; position?: string };
  /** A dark colour for the wash behind the words; white text must read on it. */
  tone?: string;
  from?: string; // YYYY-MM-DD
  until?: string; // YYYY-MM-DD, last day shown
}

const storyCollection = ACTIVE_STORY_COLLECTIONS[0];
// A file in public/, with each path segment URL-encoded.
const asset = (path: string) => `${import.meta.env?.BASE_URL ?? '/'}${path.split('/').map(encodeURIComponent).join('/')}`;

export const SPOTLIGHT: SpotlightItem[] = [
  {
    id: 'gala-2026',
    title: 'The SparkPoint Gala',
    body: 'Friday, December 11, 6 p.m. A live auction of eight travel experiences, with part of every trip supporting the Transylvania Resilience Hub. Venue and tickets coming soon.',
    cta: { label: 'Gala details', href: '/events/sparkpoint-gala' },
    when: 'Fri, Dec 11 · 6 p.m.',
    tags: ['Live travel auction', 'Supports the Resilience Hub'],
    image: {
      src: asset('assets/events/gala/hero-wing-800.webp'),
      srcSet: `${asset('assets/events/gala/hero-wing-800.webp')} 800w, ${asset('assets/events/gala/hero-wing-1400.webp')} 1400w`,
      alt: 'Sunset over the clouds from an airplane window, the wing in silhouette',
      position: '40% 40%',
    },
    tone: '#132036', // the Gala page's midnight, a step lighter
    until: '2026-12-11',
  },
  ...(storyCollection?.formPath
    ? [
        {
          id: `story-${storyCollection.id}`,
          title: 'Share your healthcare story',
          body: 'Tell us what getting care in Transylvania County is really like. It takes about five minutes, stays anonymous, and enters you to win a $100 gift card.',
          cta: { label: 'Share your story', href: storyCollection.formPath },
          tags: ['About five minutes', 'Anonymous', '$100 gift card drawing'],
          image: {
            src: asset('assets/behind_story/IMG_0199.webp'),
            alt: 'A storyteller seated in a living room, his face on the recording monitor in front',
            position: '30% 25%',
          },
          tone: '#5e2a63', // Listen purple, as on the Story Collection programs card
        },
      ]
    : []),
];

const easternDay = (d: Date) =>
  d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // YYYY-MM-DD

export function getActiveSpotlight(now = new Date()): SpotlightItem[] {
  const today = easternDay(now);
  const active = SPOTLIGHT.filter((item) => (!item.from || item.from <= today) && (!item.until || today <= item.until)).slice(0, 2);
  if (active.length > 0) return active;

  const next = getNextGathering(now);
  if (!next) return [];
  const start = new Date(next.startDate);
  return [
    {
      id: `event-${next.id}`,
      title: next.title,
      body: `${next.dateLabel}, ${next.timeLabel}. ${next.summary}`,
      cta: { label: 'Event details', href: next.detailPath ?? '/events' },
      when: start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' }),
      image: next.imagePath ? { src: asset(next.imagePath), alt: next.imageAlt ?? '' } : undefined,
    },
  ];
}
