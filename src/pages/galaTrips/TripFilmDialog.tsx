import { useId, useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog@1.1.6';
import { X } from 'lucide-react';
import type { GalaTrip } from '../../data/galaTrips';
import { tripMedia, tripVideoSrc, type GalaTripMedia } from '../../data/galaTripMedia';

// The full trip film, with sound, in a modal player. Loaded lazily: neither this
// code nor the film is fetched until someone presses Watch the film. Radix keeps
// focus inside the dialog and closes it on Esc; the player's own controls carry
// play, volume, captions and full screen. Caption tracks come from the pack
// (`<id>-film-16x9-web.vtt`) when it has them.
//
// On a phone held upright, a trip with a vertical cut (`<id>-film-9x16-web.mp4`)
// plays it full screen instead, with a "Watch the full film" switch to the 16:9.

const LANG_LABEL: Record<string, string> = { en: 'English', es: 'Español' };

// Phones held upright get the vertical (9:16) cut when the trip has one, chosen
// once when the player opens. Nothing is preloaded either way.
const PORTRAIT_PHONE = '(orientation: portrait) and (max-width: 767px)';

function FilmCredits({ media }: { media: GalaTripMedia }) {
  if (!media.credit && !media.filmCredits?.length) return null;
  return (
    <div className="gala-film-credit">
      {media.credit ? <p>{media.credit}</p> : null}
      {media.filmCredits?.length ? (
        <ul>
          {media.filmCredits.map((c) => (
            <li key={c.sourceUrl}>
              {c.shows}:{' '}
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">
                {c.author}
              </a>{' '}
              /{' '}
              <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer license">
                {c.license}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function TripFilmDialog({ trip, onClose }: { trip: GalaTrip; onClose: () => void }) {
  const media = tripMedia(trip.id);
  const [vertical, setVertical] = useState(
    () => Boolean(media?.filmVertical) && typeof window !== 'undefined' && window.matchMedia(PORTRAIT_PHONE).matches
  );
  const [showCredits, setShowCredits] = useState(false);
  const creditsId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  if (!media?.film) return null;
  const titleId = `trip-film-${trip.id}-title`;
  const src = vertical && media.filmVertical ? media.filmVertical : media.film;
  const tracks = (vertical ? media.captionsVertical : media.captions) ?? [];

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="gala-film-overlay" />
        <DialogPrimitive.Content
          className={`gala-film${vertical ? ' is-vertical' : ''}`}
          aria-labelledby={titleId}
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <div className="gala-film-head">
            <div className="gala-film-heading">
              <DialogPrimitive.Title id={titleId} className="gala-film-title">
                <span>Connection {trip.connection}</span>
                <span className="sr-only">: </span>
                {trip.title}
              </DialogPrimitive.Title>
            </div>
            <DialogPrimitive.Close ref={closeRef} className="gala-film-close" aria-label="Close the film">
              <X aria-hidden="true" size={18} />
              <span aria-hidden="true">Close</span>
            </DialogPrimitive.Close>
            {vertical ? (
              <div className="gala-film-tools">
                <button
                  type="button"
                  className="gala-film-switch"
                  onClick={() => {
                    setVertical(false);
                    setShowCredits(false);
                    // This button goes away with the switch: keep keyboard focus in the player.
                    window.requestAnimationFrame(() => closeRef.current?.focus());
                  }}
                >
                  Watch the full film
                </button>
                {media.credit || media.filmCredits?.length ? (
                  <button
                    type="button"
                    className="gala-film-switch"
                    aria-expanded={showCredits}
                    aria-controls={creditsId}
                    onClick={() => setShowCredits((v) => !v)}
                  >
                    Credits
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
          {vertical ? (
            <div id={creditsId} className="gala-film-credits-sheet" hidden={!showCredits}>
              <FilmCredits media={media} />
            </div>
          ) : null}
          {/* The browser's own video controls swallow Esc when the video has focus,
              so catch it here and close the player as Esc does everywhere else. */}
          <div
            className="gala-film-frame"
            onKeyDownCapture={(event) => {
              if (event.key === 'Escape' && !document.fullscreenElement) {
                event.preventDefault();
                onClose();
              }
            }}
          >
            {/* Sound on: the visitor asked for the film. Keyed on the source so
                switching cuts starts the new one from the top. */}
            <video
              key={src}
              className="gala-film-video"
              src={tripVideoSrc(src)}
              controls
              autoPlay
              playsInline
              preload="auto"
              poster={!vertical && media.poster ? tripVideoSrc(media.poster) : undefined}
            >
              {tracks.map((track, index) => (
                <track
                  key={track.file}
                  kind="captions"
                  src={tripVideoSrc(track.file)}
                  srcLang={track.lang}
                  label={LANG_LABEL[track.lang] ?? track.lang}
                  default={index === 0}
                />
              ))}
            </video>
          </div>
          {vertical ? null : <FilmCredits media={media} />}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
