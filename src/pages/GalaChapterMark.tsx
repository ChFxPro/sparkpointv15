import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { FlapText } from './GalaDepartureBoard';
import { useTripLoungeEnv } from './galaTrips/useTripLoungeEnv';

// The Gala page's three chapter marks (Option B, Jeff's picks 2026-11-12), in
// place of eyebrow labels: the page keeps a label only where a chapter opens,
// and draws it as the travel object that chapter already is.
//
// - departures (over the trips): the hero board's own split-flap cells, with
//   amber glyphs like a classic Solari board, flipping into place once when the
//   heading comes into view (still under reduced motion), and a note beside it.
// - entry (over "How it works"): a visa stamp with a ring of eight stars, one
//   per trip, around the sparkmark, drawn by the passport stamp engine
//   (galaJoinMe/chapterStamps.ts) and inked pink here with a CSS mask.
// - postage (over "The return trip"): an engraved postage stamp, the Hub under
//   a Deco sunburst over the Blue Ridge, struck with a Brevard postmark.
//
// The stamp images are exported by `npm run gala:stamps` to
// public/assets/events/gala/stamps/chapter-*.webp; re-run it after changing them.
// Each mark is the section's label: its words are given to screen readers as
// text, and the drawing is hidden from them.

type Kind = 'departures' | 'entry' | 'postage';

const BASE = import.meta.env.BASE_URL;
const stamp = (id: string) => `${BASE}assets/events/gala/stamps/chapter-${id}.webp`;

const LABEL: Record<Kind, string> = {
  departures: 'Departures: the trips',
  entry: 'How it works',
  postage: 'The return trip',
};

/** Flip once, when the heading first comes into view; still under reduced motion. */
function useFlipOnView() {
  const ref = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState(false);
  const { motion } = useTripLoungeEnv();
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, play: seen && motion };
}

function Departures() {
  const { ref, play } = useFlipOnView();
  return (
    <span ref={ref} className="gala-mark-board" aria-hidden="true">
      <FlapText text="DEPARTURES" width={10} play={play} delay={0} nonce={0} />
      <span className="gala-mark-board-note">
        <b>Gates 01–08</b>
        <span>Boarding Dec 11 · 6 p.m.</span>
      </span>
    </span>
  );
}

export function GalaChapterMark({ kind, className = '' }: { kind: Kind; className?: string }) {
  return (
    <p className={`gala-mark gala-mark-is-${kind} ${className}`.trim()}>
      <span className="sr-only">{LABEL[kind]}</span>
      {kind === 'departures' ? <Departures /> : null}
      {kind === 'entry' ? (
        <span
          className="gala-mark-ink gala-mark-visa"
          style={{ '--stamp': `url("${stamp('entry-visa')}")` } as CSSProperties}
          aria-hidden="true"
        />
      ) : null}
      {kind === 'postage' ? (
        <img
          className="gala-mark-postage"
          src={stamp('return-postage')}
          alt=""
          aria-hidden="true"
          width={280}
          height={192}
          loading="lazy"
          decoding="async"
        />
      ) : null}
    </p>
  );
}
