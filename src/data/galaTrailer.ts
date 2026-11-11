// The Gala's all-trips trailer, as written by `npm run gala:trailer`
// (scripts/gala-trip-media/trailer.mjs) from the trip kit's `_trailer/` folder.
// Don't edit galaTrailer.json by hand: re-run the import.
//
// While the file is `null` there is no trailer yet, and the #trailer slot on the
// Gala page isn't rendered at all. Files live in public/assets/events/gala/trips/video/.
import data from './galaTrailer.json';
import type { GalaTripMedia } from './galaTripMedia';

export type GalaTrailer = Required<Pick<GalaTripMedia, 'film'>> & Pick<GalaTripMedia, 'captions' | 'poster' | 'filmCredits'>;

const trailer = data as GalaTrailer | null;

export const GALA_TRAILER: GalaTrailer | null = trailer?.film ? trailer : null;

/** The anchor the newsletter links to: /events/sparkpoint-gala#trailer. Don't rename it. */
export const GALA_TRAILER_ANCHOR = 'trailer';
