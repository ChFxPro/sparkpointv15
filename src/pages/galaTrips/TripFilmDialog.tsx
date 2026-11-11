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
// A trip with a vertical cut (`<id>-film-9x16-web.mp4`) plays it when the
// visitor opens the player from the card's photo (any screen), or from Watch the
// film on a phone held upright. A bar at the foot of the vertical player switches
// to the full 16:9 film. On a phone held upright the vertical cut fills the
// screen; elsewhere it sits centred at its own shape, uncropped.

const LANG_LABEL: Record<string, string> = { en: 'English', es: 'Español' };

// Phones held upright get the vertical (9:16) cut full screen, chosen once when
// the player opens. Nothing is preloaded either way.
const PORTRAIT_PHONE = '(orientation: portrait) and (max-width: 767px)';
// Below this height (a phone on its side) a boxed 9:16 film would be too small
// to watch, so the 16:9 plays instead.
const MIN_BOXED_HEIGHT = 520;

function startVertical(hasVertical: boolean, preferVertical: boolean) {
  if (!hasVertical || typeof window === 'undefined') return false;
  if (window.matchMedia(PORTRAIT_PHONE).matches) return true;
  return preferVertical && window.innerHeight >= MIN_BOXED_HEIGHT;
}

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

interface TripFilmDialogProps {
  trip: GalaTrip;
  // True when opened from the card's photo: play the vertical cut on any screen.
  preferVertical?: boolean;
  onClose: () => void;
}

export default function TripFilmDialog({ trip, preferVertical = false, onClose }: TripFilmDialogProps) {
  const media = tripMedia(trip.id);
  const [vertical, setVertical] = useState(() => startVertical(Boolean(media?.filmVertical), preferVertical));
  const [fullScreen] = useState(() => typeof window !== 'undefined' && window.matchMedia(PORTRAIT_PHONE).matches);
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
          className={`gala-film${vertical ? (fullScreen ? ' is-vertical' : ' is-vertical-boxed') : ''}`}
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
          {vertical ? (
            <div className="gala-film-foot">
              <button
                type="button"
                className="gala-film-full"
                onClick={() => {
                  setVertical(false);
                  setShowCredits(false);
                  // This bar goes away with the switch: keep keyboard focus in the player.
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
          ) : (
            <FilmCredits media={media} />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
