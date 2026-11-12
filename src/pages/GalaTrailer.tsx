import { useCallback, useEffect, useRef, useState } from 'react';
import { Captions, Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { GALA_TRAILER, GALA_TRAILER_ANCHOR } from '../data/galaTrailer';
import { tripVideoCrossOrigin, tripVideoSrc } from '../data/galaTripMedia';
import { GALA_TRIP_COUNT_WORD } from '../data/galaTrips';
import { GalaLockup } from '../components/GalaLockup';
import { useTripLoungeEnv } from './galaTrips/useTripLoungeEnv';

// The all-trips trailer, at #trailer (the newsletter links here, so keep the id),
// as a full-screen "second hero" just above the trips.
//
// Video rules, keep all of them:
// - No video file is requested until the section is near the viewport (the
//   <video> has no src before then, and preload="none" after).
// - It plays muted, by itself, only while at least half of it is on screen, and
//   only when motion and data allow (no autoplay under the OS reduce-motion
//   setting, the site's own motion toggle, Save-Data or 2G). Then it shows its
//   still title scene and a play button, and plays only when asked, with sound.
// - It pauses when scrolled away and picks up again on return, unless the
//   visitor paused it.
// - Controls (Jeff, 2026-11-12: subtle, glassy, out of the way): a slim frosted
//   strip at the bottom right, clear of the film's burned-in trip label at the
//   bottom left. While the film plays and nobody touches it, the strip folds
//   down to just play/pause and sound (so pause is always on screen, WCAG
//   2.2.2); any pointer movement, tap, key press or focus brings back the
//   scrubber and full screen. Play/pause and "Sound on" sit at the right end of
//   the strip, so the strip opening out never moves them under a finger.
// - "Sound on" is one tap: the film carries on where it is and the sound fades
//   in (Jeff, 2026-11-12, like a streaming service's autoplay). After the end
//   card plays out with sound, it mutes itself and goes back to the silent loop.
// - The still (Jeff, 2026-11-12: a static section that comes to life): our own
//   lockup, live and crisp, on a background matched to the film's title card,
//   covers the film's title card at the start and end (whose sparkmark renders
//   as a blur). Before it plays, and between loops, the section is that still;
//   as the footage begins (5.35 s) the still dissolves into the film, and it
//   dissolves back before the footage ends (52.55 s). The silent loop skips the
//   rest of the end card and the opening, so the "pause" between loops is a
//   few seconds of the still.
// - Captions start off (Jeff, 2026-11-12): the voiceover repeats the burned-in
//   title cards. A small CC button in the strip turns them on; they sit about
//   two-thirds down the frame, above the bottom shade and the burned-in label.
//
// Nothing renders until `npm run gala:trailer` has imported the files.

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

// The film's timeline (gala-trips-trailer-16x9-web.mp4): title card until the
// cut to Greece at 5.35 s; the trips until the cut to the end card at 52.55 s.
/** Where playback starts, a moment before the footage, so the still comes to life soon after. */
const START_AT = 4.0;
/** The still dissolves away from here... */
const STILL_OUT = 5.3;
/** ...and back from here, ahead of the cut to the end card. */
const STILL_IN = 51.8;
/** The silent loop goes round from here (the end card's voiceover isn't heard muted). */
const LOOP_AT = 55;
/** How long the sound takes to fade in. */
const FADE_MS = 1200;
// How long the full strip stays after the last pointer or key activity.
const IDLE_MS = 2600;

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
type LockableOrientation = ScreenOrientation & { lock?: (o: 'landscape') => Promise<void> };

export function GalaTrailer() {
  const { video: autoplayAllowed } = useTripLoungeEnv();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false); // attach the source once close to the viewport
  const [inView, setInView] = useState(false); // at least half on screen
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [idle, setIdle] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // The visitor pressed pause: don't start it again by scrolling.
  const userPaused = useRef(false);
  // The visitor pressed play (or sound): resume it when scrolled back to.
  const userStarted = useRef(false);
  const fade = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          nearObserver.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    const viewObserver = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.5), {
      threshold: [0, 0.5, 1],
    });
    nearObserver.observe(el);
    viewObserver.observe(el);
    return () => {
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, []);

  // Play while on screen (muted autoplay, or the visitor's own play); pause when away.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !near) return;
    const wants = inView && !userPaused.current && (autoplayAllowed || userStarted.current);
    if (wants && video.paused) {
      void video.play().catch(() => setPlaying(false));
    } else if (!wants && !video.paused) {
      video.pause();
    }
  }, [inView, near, autoplayAllowed]);

  // If motion is turned off while it's playing on its own, stop it.
  useEffect(() => {
    const video = videoRef.current;
    if (video && !autoplayAllowed && !userStarted.current && !video.paused) video.pause();
  }, [autoplayAllowed]);

  // Captions: off unless asked for; set about two-thirds down the frame.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !near) return undefined;
    const apply = () => {
      for (const track of Array.from(video.textTracks)) {
        track.mode = captionsOn ? 'showing' : 'disabled';
        for (const cue of Array.from(track.cues ?? [])) {
          if (cue instanceof VTTCue) {
            // Above the bottom shade and the film's burned-in trip label.
            cue.snapToLines = false;
            cue.line = 64;
          }
        }
      }
    };
    apply();
    const trackEls = Array.from(video.querySelectorAll('track'));
    trackEls.forEach((el) => el.addEventListener('load', apply));
    return () => trackEls.forEach((el) => el.removeEventListener('load', apply));
  }, [captionsOn, near]);

  // Fold the strip down after a moment without activity; any activity brings it back.
  const idleTimer = useRef<number>();
  const wake = useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS);
  }, []);
  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  const start = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    userPaused.current = false;
    userStarted.current = true;
    if (!near) setNear(true);
    if (video.currentTime < START_AT) video.currentTime = START_AT;
    void video.play().catch(() => setPlaying(false));
  }, [near]);

  /** Unmute and bring the volume up gently (where the browser allows; iPhone's volume is fixed). */
  const soundIn = useCallback((video: HTMLVideoElement) => {
    window.cancelAnimationFrame(fade.current);
    video.volume = 0;
    video.muted = false;
    setMuted(false);
    const began = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - began) / FADE_MS);
      video.volume = t * t;
      if (t < 1) fade.current = window.requestAnimationFrame(step);
    };
    fade.current = window.requestAnimationFrame(step);
  }, []);
  useEffect(() => () => window.cancelAnimationFrame(fade.current), []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      // Played by hand (e.g. under reduced motion): with sound.
      if (!autoplayAllowed && !userStarted.current) soundIn(video);
      start();
    } else {
      userPaused.current = true;
      video.pause();
    }
  }, [autoplayAllowed, start, soundIn]);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      soundIn(video);
      if (video.paused) start();
    } else {
      window.cancelAnimationFrame(fade.current);
      video.muted = true;
      setMuted(true);
    }
  }, [start, soundIn]);

  const fullScreen = useCallback(() => {
    const video = videoRef.current as FullscreenVideo | null;
    if (!video) return;
    if (video.paused) start();
    if (video.requestFullscreen && document.fullscreenEnabled) {
      video
        .requestFullscreen({ navigationUI: 'hide' })
        .then(() => (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape'))
        .catch(() => undefined);
    } else {
      // iPhone: the system player.
      video.webkitEnterFullscreen?.();
    }
  }, [start]);

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) {
        try {
          screen.orientation?.unlock?.();
        } catch {
          /* not locked */
        }
      }
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const seek = (value: number) => {
    const video = videoRef.current;
    if (video && Number.isFinite(value)) video.currentTime = value;
  };

  if (!GALA_TRAILER) return null;
  const trailer = GALA_TRAILER;
  const tracks = trailer.captions ?? [];
  const showStartButton = !playing && !userStarted.current && !autoplayAllowed;
  // The still shows before the film first plays, and over the title cards.
  const started = playing || time > 0;
  const still = !started || time < STILL_OUT || time >= STILL_IN;

  return (
    <section
      ref={sectionRef}
      id={GALA_TRAILER_ANCHOR}
      className={`gala-trailer${playing ? ' is-playing' : ''}${playing && idle ? ' is-idle' : ''}`}
      aria-labelledby="trailer-title"
      onPointerMove={wake}
      onPointerDown={wake}
      onKeyDown={wake}
      onFocus={wake}
    >
      <div className="gala-shell gala-trailer-head">
        <h2 id="trailer-title">
          {capitalize(GALA_TRIP_COUNT_WORD)} trips. <em>One film.</em>
        </h2>
      </div>

      <div className="gala-trailer-stage">
        <video
          ref={videoRef}
          className="gala-trailer-video"
          src={near ? tripVideoSrc(trailer.film) : undefined}
          crossOrigin={tripVideoCrossOrigin()}
          preload="none"
          muted={muted}
          playsInline
          aria-label="The trailer: A World of Connections, eight trips in one film"
          onClick={wake}
          onPlay={() => {
            setPlaying(true);
            wake();
          }}
          onPause={() => setPlaying(false)}
          onEnded={(event) => {
            // The end card has played out with sound: mute, and back to the
            // silent loop. Under reduced motion it simply stops at the end.
            const video = event.currentTarget;
            window.cancelAnimationFrame(fade.current);
            video.muted = true;
            setMuted(true);
            video.currentTime = START_AT;
            if (autoplayAllowed && !userPaused.current) void video.play().catch(() => setPlaying(false));
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            // The silent loop: round again from the still.
            if (video.muted && video.currentTime >= LOOP_AT) video.currentTime = START_AT;
            setTime(video.currentTime);
          }}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onDurationChange={(event) => setDuration(event.currentTarget.duration)}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
        >
          {near
            ? tracks.map((track) => (
                <track
                  key={track.file}
                  kind="captions"
                  src={tripVideoSrc(track.file)}
                  srcLang={track.lang}
                  label={track.lang === 'en' ? 'English' : track.lang}
                />
              ))
            : null}
        </video>
        <div className="gala-trailer-shade" aria-hidden="true" />

        <div className={`gala-trailer-still${still ? ' is-on' : ''}`} aria-hidden="true">
          <GalaLockup className="gala-trailer-lockup" />
          <p className="gala-trailer-still-tag">
            Every journey <em>connects back home.</em>
          </p>
          <p className="gala-trailer-still-date">Eight connections · Friday, December 11</p>
        </div>

        {showStartButton ? (
          <button type="button" className="gala-trailer-start" onClick={togglePlay}>
            <span className="gala-trailer-icon" aria-hidden="true">
              <Play size={22} />
            </span>
            Play the trailer
            <span className="sr-only"> with sound</span>
          </button>
        ) : null}
      </div>

      <div className="gala-shell gala-trailer-controls">
        <div className="gala-trailer-bar" role="group" aria-label="Trailer controls">
          <span className="gala-trailer-more">
            <span className="gala-trailer-time" aria-hidden="true">
              {formatTime(time)} / {formatTime(duration)}
            </span>
            <input
              className="gala-trailer-scrub"
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(time, duration || 0)}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label="Trailer position"
              aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
              disabled={!duration}
            />
            {tracks.length ? (
              <button
                type="button"
                className="gala-trailer-btn gala-trailer-cc"
                onClick={() => setCaptionsOn((on) => !on)}
                aria-label="Captions"
                aria-pressed={captionsOn}
              >
                <Captions aria-hidden="true" />
              </button>
            ) : null}
            <button type="button" className="gala-trailer-btn" onClick={fullScreen} aria-label="Full screen">
              <Maximize aria-hidden="true" />
            </button>
          </span>
          <button
            type="button"
            className="gala-trailer-btn"
            onClick={togglePlay}
            aria-label={playing ? 'Pause the trailer' : 'Play the trailer'}
          >
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
          <button
            type="button"
            className={`gala-trailer-btn gala-trailer-sound${muted ? ' is-muted' : ''}`}
            onClick={toggleSound}
            aria-label={muted ? 'Sound on' : 'Sound off'}
          >
            {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
            {muted ? <span aria-hidden="true">Sound on</span> : null}
          </button>
        </div>
      </div>
    </section>
  );
}
