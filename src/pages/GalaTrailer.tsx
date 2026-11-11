import { lazy, Suspense, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { GALA_TRAILER, GALA_TRAILER_ANCHOR } from '../data/galaTrailer';
import { tripVideoSrc } from '../data/galaTripMedia';
import { GALA_TRIP_COUNT_WORD } from '../data/galaTrips';

// The same lazily loaded player as the trip films: neither its code nor the
// trailer is fetched until someone presses play.
const TripFilmDialog = lazy(() => import('./galaTrips/TripFilmDialog'));

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

// The all-trips trailer, at #trailer (the newsletter links here, so keep the id).
// A poster and a play button; the film, with sound and its voiceover captions on,
// plays only in the player. Nothing renders until `npm run gala:trailer` has
// imported the files, so the slot never shows an empty player.
export function GalaTrailer() {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  if (!GALA_TRAILER) return null;
  const trailer = GALA_TRAILER;

  return (
    <section id={GALA_TRAILER_ANCHOR} className="gala-trailer" aria-labelledby="trailer-title">
      <div className="gala-shell gala-trailer-inner">
        <div className="gala-trailer-head">
          <p className="gala-label">The trailer</p>
          <h2 id="trailer-title">
            {capitalize(GALA_TRIP_COUNT_WORD)} trips. <em>One film.</em>
          </h2>
        </div>
        <button ref={opener} type="button" className="gala-trailer-play" onClick={() => setOpen(true)}>
          {trailer.poster ? (
            <img
              className="gala-trailer-poster"
              src={tripVideoSrc(trailer.poster)}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : null}
          {/* The email's poster draws its own play button; then the cue is for screen readers only. */}
          <span className={trailer.posterHasCue ? 'sr-only' : 'gala-trailer-cue'}>
            {trailer.posterHasCue ? null : (
              <span className="gala-trailer-icon" aria-hidden="true">
                <Play size={22} />
              </span>
            )}
            Play the trailer
          </span>
          <span className="sr-only">: A World of Connections, with sound and captions</span>
        </button>
      </div>
      {open ? (
        <Suspense fallback={null}>
          <TripFilmDialog
            film={{
              id: 'trailer',
              // The poster is page art (it may carry its own play button), not a frame of the film.
              media: { ...trailer, poster: undefined },
              title: (
                <>
                  <span>The trailer</span>
                  <span className="sr-only">: </span>A World of Connections
                </>
              ),
            }}
            onClose={() => {
              setOpen(false);
              // Back to the button that opened it.
              window.requestAnimationFrame(() => opener.current?.focus());
            }}
          />
        </Suspense>
      ) : null}
    </section>
  );
}
