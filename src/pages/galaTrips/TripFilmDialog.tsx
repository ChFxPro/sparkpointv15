import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog@1.1.6';
import { Captions, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import type { GalaTrip } from '../../data/galaTrips';
import { tripMedia, tripVideoCrossOrigin, tripVideoSrc, type GalaFilmCredit, type GalaTripMedia } from '../../data/galaTripMedia';

// The film player, with sound, for a trip's film and the all-trips trailer.
// Loaded lazily: neither this code nor the film is fetched until someone asks
// to watch. Radix keeps focus inside and closes on Esc; the browser's own video
// controls carry play, volume, captions and full screen.
//
// Two presentations (reworked 2026-11-11, Jeff: "a full screen experience"):
//
// - Phones and tablets (a touch screen without a mouse): the film opens straight
//   into full screen, black edge to edge, with nothing over it but a small Close,
//   a title that fades once the film plays, and Credits when the cut has any.
//   Where the browser allows it (Android, iPad, desktop browsers) the player asks
//   for real full screen, which hides the browser's own bars, and turns a 16:9
//   film sideways by itself (screen orientation lock). iPhone allows neither to a
//   web page, so there the player already fills the screen, the 16:9 film sits
//   letterboxed until the phone is turned, and a short hint says so. Leaving full
//   screen (the back gesture) closes the player.
//   Controls here are our own (Jeff, 2026-11-12: the browser's were too dark and
//   stayed too long, and a page can't restyle or retime them): a slim glass
//   strip at the foot (play/pause, position, sound, captions) and a light title
//   band. Both slip away 1.6 s after the film plays and come back with a tap
//   anywhere on the film, for 2.2 s, or while it's paused. Close always stays.
// - Computers: the framed player in the middle of the page, as before; the video's
//   own full-screen button is there for anyone who wants it.
//
// Which cut plays: the 16:9 film, unless the trip has a full-length vertical cut
// (`verticalFull` in the manifest: the whole story reframed upright, on the same
// timeline second for second). Then a phone held upright plays the vertical, a
// phone on its side plays the 16:9, and turning the phone swaps between them at
// the same moment, playing or paused as it was. The 30 s vertical cuts are for
// social and no longer play here: a 30 s cut with a "watch the full film" bar
// under it was not a full-screen experience.
//
// Captions: a film the pack marks as voiced has real speech in its captions, so
// they start on; music-only films start with them off (their text repeats what
// is burned into the picture) and give that text to screen readers instead.
// When shown, cues sit in a band near the top that the burned-in type leaves clear.

const LANG_LABEL: Record<string, string> = { en: 'English', es: 'Español' };

// A touch screen with no mouse: phones and tablets get the full-screen player.
const TOUCH_ONLY = '(hover: none) and (pointer: coarse)';
const PORTRAIT = '(orientation: portrait)';

// Where caption cues sit, as a percentage of the video's height from the top.
const CUE_LINE = { vertical: 17, wide: 10 };
// Height of one caption line in px, matching `.gala-film-video::cue` in gala.css.
const CUE_LINE_PX = 18;
// How long the title stays over a playing film before it fades.
const TITLE_MS = 1600;
// How long the controls stay after a tap on the film.
const TAP_MS = 2200;

const clock = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

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

const matches = (query: string) => typeof window !== 'undefined' && window.matchMedia(query).matches;

// Screen Orientation lock: Chrome on Android (in full screen only); absent or
// refused elsewhere, which is fine.
type LockableOrientation = ScreenOrientation & { lock?: (o: 'landscape' | 'portrait') => Promise<void> };
const orientation = () => (typeof screen !== 'undefined' ? (screen.orientation as LockableOrientation | undefined) : undefined);

// The CC BY work in the cut being played. A cut without any shows nothing.
function FilmCredits({ credits }: { credits?: GalaFilmCredit[] }) {
  if (!credits?.length) return null;
  return (
    <div className="gala-film-credit">
      <ul>
        {credits.map((c) => (
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
    </div>
  );
}

interface TripFilmDialogProps {
  trip?: GalaTrip;
  // A film that isn't one trip's (the all-trips trailer): its own media and title.
  film?: { id: string; media: GalaTripMedia; title: ReactNode };
  onClose: () => void;
}

export default function TripFilmDialog({ trip, film, onClose }: TripFilmDialogProps) {
  const media = film?.media ?? (trip ? tripMedia(trip.id) : undefined);
  const filmId = film?.id ?? trip?.id ?? 'film';
  // Only a full-length vertical cut on the 16:9's timeline plays here.
  const hasVertical = Boolean(media?.filmVertical && media.verticalFull);
  const [touch] = useState(() => matches(TOUCH_ONLY));
  const [portrait, setPortrait] = useState(() => matches(PORTRAIT));
  const vertical = touch && hasVertical && portrait;

  const [showCredits, setShowCredits] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [loading, setLoading] = useState(true);
  const [rotateHint, setRotateHint] = useState(false);
  const creditsId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  // State, not a ref: the dialog's content mounts after this component does.
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  // Where to pick up when the cut changes with the phone's orientation.
  const resume = useRef<{ time: number; playing: boolean } | null>(null);
  const closing = useRef(false);

  const src = media && (vertical && media.filmVertical ? media.filmVertical : media.film);
  // Credits follow the cut on screen.
  const credits = media && (vertical ? media.filmCreditsVertical : media.filmCredits);
  const cueLine = vertical ? CUE_LINE.vertical : CUE_LINE.wide;
  const crossOrigin = tripVideoCrossOrigin();

  // Leave full screen and release the orientation lock, then close.
  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    try {
      orientation()?.unlock?.();
    } catch {
      /* not locked */
    }
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    onClose();
  }, [onClose]);

  // Phones and tablets: real full screen where the browser allows it, and the
  // 16:9 turned sideways where it can be. The tap that opened the player still
  // counts as the user's gesture here.
  useEffect(() => {
    if (!touch) return undefined;
    const el = contentRef.current;
    let entered = false;
    if (el?.requestFullscreen && document.fullscreenEnabled) {
      el.requestFullscreen({ navigationUI: 'hide' })
        .then(() => {
          entered = true;
          // With no vertical cut, the 16:9 turns the screen sideways itself.
          if (!hasVertical) return orientation()?.lock?.('landscape');
          return undefined;
        })
        .catch(() => undefined);
    }
    // Leaving full screen (back gesture, the browser's own control) closes the player.
    const onChange = () => {
      if (entered && !document.fullscreenElement) close();
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [touch, hasVertical, close]);

  // Phones: follow the orientation. With a vertical cut, turning the phone
  // swaps cuts at the same moment; without one, a 16:9 film on an upright
  // phone that couldn't be turned for it (iPhone) gets a short hint.
  useEffect(() => {
    if (!touch) return undefined;
    const mq = window.matchMedia(PORTRAIT);
    const onTurn = () => {
      if (hasVertical && video) resume.current = { time: video.currentTime, playing: !video.paused };
      setPortrait(mq.matches);
    };
    mq.addEventListener('change', onTurn);
    return () => mq.removeEventListener('change', onTurn);
  }, [touch, hasVertical, video]);

  useEffect(() => {
    if (!touch || hasVertical || !portrait) {
      setRotateHint(false);
      return undefined;
    }
    // Give the orientation lock a moment to turn the screen before hinting.
    const show = window.setTimeout(() => setRotateHint(matches(PORTRAIT)), 900);
    const hide = window.setTimeout(() => setRotateHint(false), 5200);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [touch, hasVertical, portrait]);

  // A new cut (or the first): pick up where the last one was.
  useEffect(() => {
    if (!video) return undefined;
    setLoading(true);
    const onMeta = () => {
      const at = resume.current;
      if (!at) return;
      resume.current = null;
      video.currentTime = Math.min(at.time, Math.max(0, video.duration - 0.1));
      if (at.playing) void video.play().catch(() => undefined);
      else video.pause();
    };
    const onReady = () => setLoading(false);
    const onWait = () => setLoading(true);
    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('playing', onReady);
    video.addEventListener('canplay', onReady);
    video.addEventListener('waiting', onWait);
    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('playing', onReady);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('waiting', onWait);
    };
  }, [video, src]);

  // The title (and, full screen, the controls) show on open and whenever the
  // film pauses, and slip away while it plays; a tap brings them back.
  const hideTimer = useRef(0);
  const reveal = useCallback(
    (ms: number) => {
      window.clearTimeout(hideTimer.current);
      setShowTitle(true);
      if (video && !video.paused) hideTimer.current = window.setTimeout(() => setShowTitle(false), ms);
    },
    [video]
  );
  useEffect(() => {
    if (!video) return undefined;
    const onPlay = () => reveal(TITLE_MS);
    const onPause = () => {
      window.clearTimeout(hideTimer.current);
      setShowTitle(true);
    };
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => {
      window.clearTimeout(hideTimer.current);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [video, reveal]);

  // Full screen: our own controls' state, read from the video.
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [captionsOn, setCaptionsOn] = useState<boolean | null>(null);
  useEffect(() => {
    if (!video) return undefined;
    const sync = () => {
      setPlaying(!video.paused);
      setMuted(video.muted);
      setTime(video.currentTime);
      setDuration(video.duration || 0);
    };
    const events = ['play', 'pause', 'timeupdate', 'durationchange', 'loadedmetadata', 'volumechange'];
    events.forEach((e) => video.addEventListener(e, sync));
    sync();
    return () => events.forEach((e) => video.removeEventListener(e, sync));
  }, [video]);
  // Captions follow the CC button once it's used; until then, the track's default.
  useEffect(() => {
    if (!video || captionsOn === null) return;
    for (const track of Array.from(video.textTracks)) track.mode = captionsOn ? 'showing' : 'hidden';
  }, [video, captionsOn, src]);

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
  }, [video, cueLine, src]);

  if (!media?.film || !src) return null;
  const titleId = `trip-film-${filmId}-title`;
  const tracks = (vertical ? media.captionsVertical : media.captions) ?? [];
  // Music-only films: the caption text describes the dialog for screen readers.
  // A voiceover's captions are speech, start on, and are heard anyway.
  const description = tracks[0]?.speech ? undefined : tracks[0]?.text;
  const theatre = touch;
  const ccShown = captionsOn ?? Boolean(tracks[0]?.speech);

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => (open ? undefined : close())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="gala-film-overlay" />
        <DialogPrimitive.Content
          ref={contentRef}
          className={`gala-film${theatre ? ' is-theatre' : ''}${vertical ? ' is-vertical' : ''}`}
          aria-labelledby={titleId}
          {...(description ? {} : { 'aria-describedby': undefined })}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <div className={`gala-film-head${theatre && !showTitle ? ' is-faded' : ''}`}>
            <DialogPrimitive.Close className="gala-film-close" aria-label="Close the film">
              <X aria-hidden="true" size={18} />
              <span aria-hidden="true">Close</span>
            </DialogPrimitive.Close>
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
            {theatre && credits?.length ? (
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
          {description ? (
            <DialogPrimitive.Description className="sr-only">Text in the film: {description}</DialogPrimitive.Description>
          ) : null}
          {theatre ? (
            <div id={creditsId} className="gala-film-credits-sheet" hidden={!showCredits}>
              <FilmCredits credits={credits} />
            </div>
          ) : null}
          {/* The browser's own video controls swallow Esc when the video has focus,
              so catch it here and close the player as Esc does everywhere else. */}
          <div
            className="gala-film-frame"
            onKeyDownCapture={(event) => {
              if (event.key === 'Escape' && !document.fullscreenElement) {
                event.preventDefault();
                close();
              }
            }}
          >
            {/* Sound on: the visitor asked for the film. Keyed on the source so
                switching cuts loads the new one (and the resume effect seeks it). */}
            <video
              ref={setVideo}
              key={src}
              className="gala-film-video"
              src={tripVideoSrc(src)}
              controls={!theatre}
              autoPlay
              onClick={theatre ? () => (showTitle && playing ? setShowTitle(false) : reveal(TAP_MS)) : undefined}
              playsInline
              preload="auto"
              crossOrigin={crossOrigin}
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
            {loading ? (
              <span className="gala-film-loading" role="status">
                <span className="gala-film-spinner" aria-hidden="true" />
                <span className="sr-only">Loading the film</span>
              </span>
            ) : null}
            {rotateHint ? (
              <span className="gala-film-rotate" aria-hidden="true">
                <span className="gala-film-rotate-icon" />
                Turn your phone for the full picture
              </span>
            ) : null}
            {theatre ? (
              <div
                className={`gala-film-bar${showTitle ? '' : ' is-hidden'}`}
                role="group"
                aria-label="Film controls"
                onFocus={() => reveal(TAP_MS * 2)}
                onPointerDown={() => reveal(TAP_MS)}
              >
                <button
                  type="button"
                  className="gala-film-btn"
                  onClick={() => (video?.paused ? void video.play() : video?.pause())}
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                </button>
                <span className="gala-film-time" aria-hidden="true">
                  {clock(time)}
                </span>
                <input
                  className="gala-film-scrub"
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(time, duration || 0)}
                  onChange={(event) => {
                    if (video) video.currentTime = Number(event.target.value);
                  }}
                  aria-label="Position in the film"
                  aria-valuetext={`${clock(time)} of ${clock(duration)}`}
                  disabled={!duration}
                />
                <span className="gala-film-time" aria-hidden="true">
                  {clock(duration)}
                </span>
                <button
                  type="button"
                  className="gala-film-btn"
                  onClick={() => {
                    if (video) video.muted = !video.muted;
                  }}
                  aria-label="Sound"
                  aria-pressed={!muted}
                >
                  {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
                </button>
                {tracks.length ? (
                  <button
                    type="button"
                    className="gala-film-btn"
                    onClick={() => setCaptionsOn(!ccShown)}
                    aria-label="Captions"
                    aria-pressed={ccShown}
                  >
                    <Captions aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
          {theatre ? null : <FilmCredits credits={credits} />}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
