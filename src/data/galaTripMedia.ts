// Each Gala trip's web video, as written by `npm run gala:trip-media`
// (scripts/gala-trip-media/sync.mjs) from the trip kit's `<id>/pack/web/`.
// Don't edit galaTripMedia.json by hand: re-run the sync.
//
// A trip that isn't listed has no video yet, and its card shows its poster still.
// Files live in public/assets/events/gala/trips/video/.
import manifest from './galaTripMedia.json';

export interface GalaLoopSources {
  webm?: string;
  mp4?: string;
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
  /** Credit for the footage, from the pack's web.json. */
  credit?: string;
}

const MEDIA = manifest as Record<string, GalaTripMedia>;

export const tripMedia = (id: string): GalaTripMedia | undefined => MEDIA[id];

export const tripVideoSrc = (file: string) => `${import.meta.env.BASE_URL}assets/events/gala/trips/video/${file}`;
