// Each Gala trip's web video, as written by `npm run gala:trip-media`
// (scripts/gala-trip-media/sync.mjs) from the trip kit's `<id>/pack/web/`.
// Don't edit galaTripMedia.json by hand: re-run the sync.
//
// A trip that isn't listed has no video yet, and its card shows its poster still.
// Files live in public/assets/events/gala/trips/video/.
import manifest from './galaTripMedia.json';

/** One part of a loop's credit line: plain text, or a linked CC source. */
export type GalaCreditPart =
  | { text: string }
  | { label: string; author: string; sourceUrl: string; license: string; licenseUrl: string | null };

export interface GalaLoopSources {
  webm?: string;
  mp4?: string;
  /** This loop's own footage credit, from the pack's web.json `creditLine` and `sources`. */
  credit?: GalaCreditPart[];
}

export interface GalaTripMedia {
  /** Silent 16:9 card loop (960×540). */
  loopWide?: GalaLoopSources;
  /** Silent 4:5 card loop (720×900). */
  loopTall?: GalaLoopSources;
  /** A still from the loop; the card uses the credited photo as its poster either way. */
  poster?: string;
  /** The full promo with music, loaded only when someone asks to watch it. */
  film?: string;
  captions?: { file: string; lang: string }[];
  /** Credit for the footage and music, from the pack's web.json (no licensee's name). */
  credit?: string;
  /** Creative Commons work in the film (from the pack's LICENSES.md), credited in the film player. */
  filmCredits?: { shows: string; author: string; license: string; licenseUrl: string; sourceUrl: string }[];
}

const MEDIA = manifest as Record<string, GalaTripMedia>;

export const tripMedia = (id: string): GalaTripMedia | undefined => MEDIA[id];

/** The short footage credit for a card: "Envato Elements", plus a pointer to the film's CC credits. */
export const cardVideoCredit = (media: GalaTripMedia | undefined) => {
  if (!media?.credit) return null;
  const sources = /envato/i.test(media.credit) ? 'Envato Elements' : media.credit.replace(/\.$/, '');
  return media.film && media.filmCredits?.length ? `${sources}, with Wikimedia Commons work credited in the film` : sources;
};

export const tripVideoSrc = (file: string) => `${import.meta.env.BASE_URL}assets/events/gala/trips/video/${file}`;
