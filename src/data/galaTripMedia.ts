// Each Gala trip's web video, as written by `npm run gala:trip-media`
// (scripts/gala-trip-media/sync.mjs) from the trip kit's `<id>/pack/web/`.
// Don't edit galaTripMedia.json by hand: re-run the sync.
//
// A trip that isn't listed has no video yet, and its card shows its poster still.
// Files live in public/assets/events/gala/trips/video/.
import manifest from './galaTripMedia.json';

/**
 * One Creative Commons BY / BY-SA work in a loop, credited with its author, licence
 * and source. Only work whose licence requires credit is published: the stock
 * footage and music (Envato Elements) and CC0 work are not credited on the site.
 */
export type GalaCreditPart = { label: string; author: string; sourceUrl: string; license: string; licenseUrl: string | null };

export interface GalaLoopSources {
  webm?: string;
  mp4?: string;
  /** The CC BY work in this loop, from the pack's web.json `creditLine` and `sources`; absent when there is none. */
  credit?: GalaCreditPart[];
}

/**
 * A film's caption track. The films are music only, so the captions repeat the
 * text burned into the picture: they start off, and `text` (every cue, as one
 * paragraph) is read to screen readers instead. `speech` is set when the pack
 * marks the film as having a voiceover; its captions then start on.
 */
export interface GalaCaptionTrack {
  file: string;
  lang: string;
  text?: string;
  speech?: boolean;
}

export type GalaFilmCredit = { shows: string; author: string; license: string; licenseUrl: string; sourceUrl: string };

export interface GalaTripMedia {
  /** Silent 16:9 card loop (960×540). */
  loopWide?: GalaLoopSources;
  /** Silent 4:5 card loop (720×900). */
  loopTall?: GalaLoopSources;
  /** A still from the loop; the card uses the credited photo as its poster either way. */
  poster?: string;
  /** The full promo with music, loaded only when someone asks to watch it. */
  film?: string;
  captions?: GalaCaptionTrack[];
  /** The vertical (9:16) cut, about 30 s, played on phones held upright. */
  filmVertical?: string;
  captionsVertical?: GalaCaptionTrack[];
  /** CC BY work in the film (from the pack's LICENSES.md), credited in the film player. */
  /** CC BY work in the 16:9 film, credited in the player while it plays. */
  filmCredits?: GalaFilmCredit[];
  /** CC BY work in the vertical cut, which often has none of the 16:9's. */
  filmCreditsVertical?: GalaFilmCredit[];
}

const MEDIA = manifest as Record<string, GalaTripMedia>;

export const tripMedia = (id: string): GalaTripMedia | undefined => MEDIA[id];

export const tripVideoSrc = (file: string) => `${import.meta.env.BASE_URL}assets/events/gala/trips/video/${file}`;
