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
  /** The vertical (9:16) cut. Plays on phones held upright only when `verticalFull` is set. */
  filmVertical?: string;
  /**
   * The vertical cut is the full film reframed upright, on the 16:9's timeline
   * second for second, so the player can swap cuts when the phone turns. The
   * 30 s social cuts don't have it and don't play in the player.
   */
  verticalFull?: boolean;
  captionsVertical?: GalaCaptionTrack[];
  /** CC BY work in the film (from the pack's LICENSES.md), credited in the film player. */
  /** CC BY work in the 16:9 film, credited in the player while it plays. */
  filmCredits?: GalaFilmCredit[];
  /** CC BY work in the vertical cut, which often has none of the 16:9's. */
  filmCreditsVertical?: GalaFilmCredit[];
}

const MEDIA = manifest as Record<string, GalaTripMedia>;

export const tripMedia = (id: string): GalaTripMedia | undefined => MEDIA[id];

// Where the trip videos are served from. By default the site's own
// public/assets/events/gala/trips/video/ (GitHub Pages). GitHub Pages delivers
// large media slowly (measured 2026-11-11 at about 70 KB/s per connection, under
// the 16:9 films' 350 KB/s), so the files can live on a media host instead: set
// VITE_GALA_MEDIA_BASE at build time to that folder's URL (with a trailing
// slash), holding the same file names the sync copies into public/. Captions are
// then fetched cross-origin, so the host must send CORS headers.
const MEDIA_BASE: string | undefined = import.meta.env.VITE_GALA_MEDIA_BASE || undefined;

export const tripVideoSrc = (file: string) =>
  MEDIA_BASE ? `${MEDIA_BASE.replace(/\/?$/, '/')}${file}` : `${import.meta.env.BASE_URL}assets/events/gala/trips/video/${file}`;

/** `crossOrigin` for a <video> whose captions come from the media host; none when served by the site itself. */
export const tripVideoCrossOrigin = (): 'anonymous' | undefined => (MEDIA_BASE ? 'anonymous' : undefined);
