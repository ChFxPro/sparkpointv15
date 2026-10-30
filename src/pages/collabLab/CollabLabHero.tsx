import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import collabIcon from '../../assets/collab-lab/collab-lab-icon.webp';
import collabWordmarkReversed from '../../assets/collab-lab/collab-lab-wordmark-reversed.webp';

// The hero: a silent slow-motion pan of the room, looping behind the title. The loop is
// a ~3 MB 1280px preview, so it costs little; it plays only while the hero is on
// screen, never for visitors who prefer reduced motion (the OS setting or the site's
// own toggle), and has a visible pause control (WCAG 2.2.2). The poster frame stands
// in whenever it isn't playing.

export const ACTS = [
  { id: 'connect', number: '01', word: 'Connect' },
  { id: 'share', number: '02', word: 'Share' },
  { id: 'create', number: '03', word: 'Create' },
] as const;

export function CollabLabHero({ loopSrc, posterSrc }: { loopSrc: string; posterSrc: string }) {
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const reducedMotion = Boolean(systemReducedMotion) || motionPreference === 'reduce';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Set once the visitor presses pause or play, so scrolling never overrides them.
  const userChoice = useRef<'play' | 'pause' | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    if (typeof IntersectionObserver === 'undefined') {
      void video.play().catch(() => {});
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (userChoice.current !== 'pause') void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) videoRef.current?.pause();
  }, [reducedMotion]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userChoice.current = 'play';
      void video.play().catch(() => {});
    } else {
      userChoice.current = 'pause';
      video.pause();
    }
  };

  return (
    <section className="clb-hero" aria-labelledby="clb-title">
      <div className="clb-hero-media" aria-hidden="true">
        {reducedMotion ? (
          <img src={posterSrc} alt="" width={1280} height={720} />
        ) : (
          <video
            ref={videoRef}
            src={loopSrc}
            poster={posterSrc}
            muted
            loop
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        )}
      </div>

      <div className="rh-shell clb-hero-inner">
        <p className="clb-lockup clb-lockup-reversed">
          <img className="clb-lockup-icon" src={collabIcon} alt="" width={215} height={215} />
          <img
            className="clb-lockup-wordmark"
            src={collabWordmarkReversed}
            alt="Collaboration: connect, share, create"
            width={935}
            height={120}
          />
        </p>
        <p className="clb-kicker">Collaboration Lab · October 23, 2026</p>
        <h1 id="clb-title">
          <span>Building partnerships</span>
          <span className="clb-title-accent">that last.</span>
        </h1>
        <p className="clb-hero-lede">
          Nonprofits from across Transylvania County spent a morning trading practical tools and local success
          stories. This is that morning, told in three parts, with every photo and clip ready for you to use.
        </p>

        <nav className="clb-acts-nav" aria-label="The morning in three parts">
          {ACTS.map((act) => (
            <a key={act.id} href={`#${act.id}`}>
              <span>{act.number}</span>
              {act.word}
            </a>
          ))}
        </nav>
      </div>

      {!reducedMotion && (
        <button
          type="button"
          className="clb-hero-pause"
          onClick={toggle}
          aria-label={playing ? 'Pause the background video' : 'Play the background video'}
        >
          {playing ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
          <span aria-hidden="true">{playing ? 'Pause' : 'Play'}</span>
        </button>
      )}
    </section>
  );
}
