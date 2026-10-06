import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';

// Sponsor highlight loop for the 2026 convening recap: an aerial flyover of
// Deerwoode Reserve with each sponsor's logo set into the landscape, ending at the
// venue doors. Silent (the source's audio track was empty and was dropped).
//
// Files in public/assets/Rural Health/recap/: `sponsor-loop.webm` (VP9) first, with
// `sponsor-loop.mp4` (H.264) as the fallback for browsers without VP9 WebM, and
// `sponsor-loop-poster.webp` shown before playback and under reduced motion. Both
// videos are 1280×720 at 30 fps, re-encoded from the owner's 60 fps master.
//
// Nothing downloads until the section nears the viewport (`preload="none"` plus an
// IntersectionObserver), it pauses again when scrolled away, and it never autoplays
// for visitors who prefer reduced motion. The pause control is required: the loop
// moves for well over five seconds (WCAG 2.2.2).

const BASE = `${import.meta.env.BASE_URL}assets/Rural%20Health/recap/`;
const WEBM = `${BASE}sponsor-loop.webm`;
const MP4 = `${BASE}sponsor-loop.mp4`;
const POSTER = `${BASE}sponsor-loop-poster.webp`;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function SponsorFlyover() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Set once the visitor presses pause or play, so scrolling never overrides them.
  const userChoice = useRef<'play' | 'pause' | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const wantsPlay =
            userChoice.current === 'play' || (userChoice.current === null && !prefersReducedMotion());
          if (wantsPlay) video.play().catch(() => setPlaying(false));
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userChoice.current = 'play';
      video.play().catch(() => setPlaying(false));
    } else {
      userChoice.current = 'pause';
      video.pause();
    }
  }

  return (
    <section className="rh-flyover" aria-labelledby="rh-flyover-title">
      <div className="rh-shell">
        <div className="rh-flyover-heading">
          <div>
            <p className="rh-flyover-eyebrow">With thanks to our sponsors</p>
            <h2 id="rh-flyover-title">The partners who held the day up.</h2>
          </div>
          <p>
            A flight over Deerwoode Reserve, the convening’s home for the day, with each
            sponsor who made it possible.{' '}
            <a href="#event-partners">
              See every sponsor and partner
              <ArrowRight aria-hidden="true" size={16} />
            </a>
          </p>
        </div>

        <figure className="rh-flyover-plate">
          <div className="rh-plate-label rh-flyover-label">
            <span>Deerwoode Reserve · Brevard, NC</span>
            <span>Sponsor flyover</span>
          </div>
          <div className="rh-flyover-frame">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              poster={POSTER}
              width={1280}
              height={720}
              aria-label="Aerial flyover of Deerwoode Reserve in Brevard, with each convening sponsor’s logo shown over the landscape in turn, ending at the venue doors."
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src={WEBM} type="video/webm" />
              <source src={MP4} type="video/mp4" />
            </video>
            <button
              type="button"
              className="rh-flyover-toggle"
              onClick={toggle}
              aria-label={playing ? 'Pause sponsor flyover' : 'Play sponsor flyover'}
            >
              {playing ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}
              <span aria-hidden="true">{playing ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </figure>
      </div>
    </section>
  );
}
