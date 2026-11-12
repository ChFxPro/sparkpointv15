import { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { GALA_TRAILER, GALA_TRAILER_ANCHOR } from '../data/galaTrailer';
import { tripVideoSrc } from '../data/galaTripMedia';
import { GALA_TRIP_COUNT_WORD } from '../data/galaTrips';
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
//   poster and a play button, and plays only when asked, with sound.
// - It pauses when scrolled away and picks up again on return, unless the
//   visitor paused it.
// - Controls (Jeff, 2026-11-12: subtle, glassy, out of the way): a slim frosted
//   strip at the bottom right, clear of the film's burned-in trip label at the
//   bottom left. While the film plays and nobody touches it, the strip folds
//   down to just play/pause and sound (so pause is always on screen, WCAG
//   2.2.2); any pointer movement, tap, key press or focus brings back the
//   scrubber and full screen. "Sound on" restarts the film from the top so the
//   voiceover is heard from "Connection one".
// - No captions on this trailer (Jeff's call): the voiceover repeats the
//   burned-in title cards, and the whole voiceover is on the page as text under
//   "Read the film" (from the captions' `text` in galaTrailer.json). The .vtt
//   stays in the repo and is not loaded here.
//
// Nothing renders until `npm run gala:trailer` has imported the files.

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);
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
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // The visitor pressed pause: don't start it again by scrolling.
  const userPaused = useRef(false);
  // The visitor pressed play (or sound): resume it when scrolled back to.
  const userStarted = useRef(false);
  const soundStarted = useRef(false);

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
    void video.play().catch(() => setPlaying(false));
  }, [near]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      // Played by hand (e.g. under reduced motion): with sound, from where it is.
      if (!autoplayAllowed && !userStarted.current) {
        video.muted = false;
        setMuted(false);
        soundStarted.current = true;
      }
      start();
    } else {
      userPaused.current = true;
      video.pause();
    }
  }, [autoplayAllowed, start]);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      video.muted = false;
      setMuted(false);
      // The first time, from the top, so the voiceover starts at "Connection one".
      if (!soundStarted.current) {
        soundStarted.current = true;
        video.currentTime = 0;
      }
      start();
    } else {
      video.muted = true;
      setMuted(true);
    }
  }, [start]);

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
  const transcript = trailer.captions?.[0]?.text;
  const showStartButton = !playing && !userStarted.current && !autoplayAllowed;

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
        {transcript ? (
          <details className="gala-trailer-read">
            <summary>Read the film</summary>
            <p>{transcript}</p>
          </details>
        ) : null}
      </div>

      <div className="gala-trailer-stage">
        <video
          ref={videoRef}
          className="gala-trailer-video"
          src={near ? tripVideoSrc(trailer.film) : undefined}
          poster={trailer.poster ? tripVideoSrc(trailer.poster) : undefined}
          preload="none"
          muted={muted}
          playsInline
          loop={muted}
          aria-label="The trailer: A World of Connections, eight trips in one film"
          onClick={wake}
          onPlay={() => {
            setPlaying(true);
            wake();
          }}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onDurationChange={(event) => setDuration(event.currentTarget.duration)}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
        />
        <div className="gala-trailer-shade" aria-hidden="true" />

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
            <button type="button" className="gala-trailer-btn" onClick={fullScreen} aria-label="Full screen">
              <Maximize aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>
    </section>
  );
}
