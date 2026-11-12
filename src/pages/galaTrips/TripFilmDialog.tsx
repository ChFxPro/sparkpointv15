import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
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
//
// Captions: the films are music only, and their captions repeat the text burned
// into the picture, so they start off (the player's CC control turns them on)
// and their text is the dialog's description for screen readers instead. When
// shown, they sit in a band near the top that the burned-in text leaves clear
// (the trip tag is at the very top; titles, place lines and fact cards are in
// the middle and lower third). A film the pack marks as having a voiceover has
// real speech in its captions, so they start on, in that same band.
//
// The same player plays the all-trips trailer (`film` instead of `trip`): its
// media and title are passed in, and it has no vertical cut.

const LANG_LABEL: Record<string, string> = { en: 'English', es: 'Español' };

// Phones held upright get the vertical (9:16) cut full screen, chosen once when
// the player opens. Nothing is preloaded either way.
const PORTRAIT_PHONE = '(orientation: portrait) and (max-width: 767px)';
// Below this height (a phone on its side) a boxed 9:16 film would be too small
// to watch, so the 16:9 plays instead.
const MIN_BOXED_HEIGHT = 520;

// Where caption cues sit, as a percentage of the video's height from the top.
// Phone (full screen): below the player's own title bar. Boxed 9:16: just under
// the trip tag. 16:9: under the tag, above the title cards.
const CUE_LINE = { fullScreen: 17, boxed: 9, wide: 10 };

// Height of one caption line in px, matching `.gala-film-video::cue` in gala.css.
const CUE_LINE_PX = 18;

// Cues stay snapped to lines (Chrome stops wrapping a cue placed by percentage),
// so the band's percentage becomes a line number counted from the top.
function placeCues(video: HTMLVideoElement, percent: number) {
  const line = Math.max(1, Math.round((video.clientHeight * percent) / 100 / CUE_LINE_PX));
  for (const track of Array.from(video.textTracks)) {
    let moved = false;
    for (const cue of Array.from(track.cues ?? [])) {
      if (!(cue instanceof VTTCue) || (cue.snapToLines && cue.line === line)) continue;
      cue.snapToLines = true;
      cue.line = line;
      moved = true;
    }
    // A cue already on screen keeps its old spot until the track is redrawn.
    if (moved && track.mode === 'showing' && track.activeCues?.length) {
      track.mode = 'hidden';
      window.requestAnimationFrame(() => {
        track.mode = 'showing';
      });
    }
  }
}

function startVertical(hasVertical: boolean, preferVertical: boolean) {
  if (!hasVertical || typeof window === 'undefined') return false;
  if (window.matchMedia(PORTRAIT_PHONE).matches) return true;
  return preferVertical && window.innerHeight >= MIN_BOXED_HEIGHT;
}

function FilmCredits({ media }: { media: GalaTripMedia }) {
  if (!media.filmCredits?.length) return null;
  return (
    <div className="gala-film-credit">
      {media.filmCredits.length ? (
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
  trip?: GalaTrip;
  // A film that isn't one trip's (the all-trips trailer): its own media and title.
  film?: { id: string; media: GalaTripMedia; title: ReactNode };
  // True when opened from the card's photo: play the vertical cut on any screen.
  preferVertical?: boolean;
  onClose: () => void;
}

export default function TripFilmDialog({ trip, film, preferVertical = false, onClose }: TripFilmDialogProps) {
  const media = film?.media ?? (trip ? tripMedia(trip.id) : undefined);
  const filmId = film?.id ?? trip?.id ?? 'film';
  const [vertical, setVertical] = useState(() => startVertical(Boolean(media?.filmVertical), preferVertical));
  const [fullScreen] = useState(() => typeof window !== 'undefined' && window.matchMedia(PORTRAIT_PHONE).matches);
  const [showCredits, setShowCredits] = useState(false);
  const creditsId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  // State, not a ref: the dialog's content mounts after this component does.
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const src = media && (vertical && media.filmVertical ? media.filmVertical : media.film);
  const cueLine = vertical ? (fullScreen ? CUE_LINE.fullScreen : CUE_LINE.boxed) : CUE_LINE.wide;

  // Cues load only once a track is turned on, so place them whenever one loads.
  useEffect(() => {
    if (!video) return undefined;
    const place = () => placeCues(video, cueLine);
    const trackEls = Array.from(video.querySelectorAll('track'));
    const textTracks = Array.from(video.textTracks);
    trackEls.forEach((el) => el.addEventListener('load', place));
    // cuechange fires as a cue becomes active, so even a cue that loaded before
    // the listener is moved before it is drawn for long.
    textTracks.forEach((t) => t.addEventListener('cuechange', place));
    place();
    return () => {
      trackEls.forEach((el) => el.removeEventListener('load', place));
      textTracks.forEach((t) => t.removeEventListener('cuechange', place));
    };
  }, [video, cueLine]);

  if (!media?.film || !src) return null;
  const titleId = `trip-film-${filmId}-title`;
  const tracks = (vertical ? media.captionsVertical : media.captions) ?? [];
  // Music-only films: the caption text describes the dialog for screen readers.
  // A voiceover's captions are speech, start on, and are heard anyway.
  const description = tracks[0]?.speech ? undefined : tracks[0]?.text;

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="gala-film-overlay" />
        <DialogPrimitive.Content
          className={`gala-film${vertical ? (fullScreen ? ' is-vertical' : ' is-vertical-boxed') : ''}`}
          aria-labelledby={titleId}
          {...(description ? {} : { 'aria-describedby': undefined })}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <div className="gala-film-head">
            <div className="gala-film-heading">
              <DialogPrimitive.Title id={titleId} className="gala-film-title">
                {film ? (
                  film.title
                ) : trip ? (
                  <>
                    <span>Connection {trip.connection}</span>
                    <span className="sr-only">: </span>
                    {trip.title}
                  </>
                ) : null}
              </DialogPrimitive.Title>
            </div>
            {description ? (
              <DialogPrimitive.Description className="sr-only">
                Text in the film: {description}
              </DialogPrimitive.Description>
            ) : null}
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
              ref={setVideo}
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
                  default={index === 0 && Boolean(track.speech)}
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
              {media.filmCredits?.length ? (
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
