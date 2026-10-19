import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

// A split-flap departures board. Each cell flips through random characters
// before settling on its letter, staggered left to right, and every few
// seconds one destination row "re-checks" itself so the board feels live.
//
// When the trip lineup is announced, put each destination in `DEPARTURES`
// (16 characters max) — the board needs no other change.

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

type Column = 'flight' | 'destination' | 'time' | 'status';

const WIDTHS: Record<Column, number> = { flight: 7, destination: 16, time: 7, status: 10 };

interface Row {
  flight: string;
  destination: string;
  time: string;
  status: string;
  highlight?: boolean;
}

const GALA_ROW: Row = {
  flight: 'SPK1211',
  destination: 'ATLAS OF WONDERS',
  time: 'DEC 11',
  status: 'ON TIME',
  highlight: true,
};

const DEPARTURES: Row[] = Array.from({ length: 8 }, (_, index) => ({
  flight: `SPK10${index + 1}`,
  destination: 'REVEALING SOON',
  time: 'ANYTIME',
  status: 'AT AUCTION',
}));

const ROWS = [GALA_ROW, ...DEPARTURES];

function pad(text: string, width: number) {
  return text.toUpperCase().padEnd(width, ' ').slice(0, width);
}

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function FlapText({
  text,
  width,
  play,
  delay,
  nonce,
}: {
  text: string;
  width: number;
  play: boolean;
  delay: number;
  nonce: number;
}) {
  const target = pad(text, width);
  const [shown, setShown] = useState(() => (play ? ' '.repeat(width) : target));
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!play) {
      setShown(target);
      return;
    }
    // Each cell settles a few frames after its left neighbour.
    const settleAt = Array.from(target, (char, index) =>
      char === ' ' ? 0 : 6 + index * 1.4 + Math.random() * 4
    );
    let frame = 0;
    const start = window.setTimeout(() => {
      timer.current = window.setInterval(() => {
        frame += 1;
        const next = Array.from(target, (char, index) =>
          frame >= settleAt[index] ? char : randomGlyph()
        ).join('');
        setShown(next);
        if (next === target) window.clearInterval(timer.current);
      }, 55);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer.current);
    };
  }, [target, play, delay, nonce]);

  return (
    <span className="gala-flap-group">
      {Array.from(shown).map((char, index) => (
        <span key={index} className={char === ' ' ? 'gala-flap is-blank' : 'gala-flap'}>
          {char}
        </span>
      ))}
    </span>
  );
}

export function GalaDepartureBoard() {
  const reduceMotion = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // Per-row replay counters; they only ever increase, so a row replays once
  // per bump and never again when another row takes a turn.
  const [replays, setReplays] = useState<number[]>(() => ROWS.map(() => 0));

  useEffect(() => {
    const node = boardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const interval = window.setInterval(() => {
      const row = 1 + Math.floor(Math.random() * DEPARTURES.length);
      setReplays((previous) => previous.map((count, index) => (index === row ? count + 1 : count)));
    }, 3800);
    return () => window.clearInterval(interval);
  }, [inView, reduceMotion]);

  const play = inView && !reduceMotion;

  return (
    <div className="gala-board" ref={boardRef}>
      <p className="sr-only">
        Departures board: An Atlas of Wonders, the SparkPoint Gala, flight SPK 1211, departs December 11 and is on
        time. Eight travel experiences are listed, with destinations revealed soon, available
        anytime with no blackout dates, and sold at auction.
      </p>
      <div className="gala-board-inner" aria-hidden="true">
        <div className="gala-board-title">
          <span>Departures</span>
          <span className="gala-board-clock">Transylvania County · Home base</span>
        </div>
        <div className="gala-board-row gala-board-head">
          <span className="col-flight">Flight</span>
          <span className="col-destination">Destination</span>
          <span className="col-time">Departs</span>
          <span className="col-status">Status</span>
        </div>
        {ROWS.map((row, rowIndex) => {
          const replay = replays[rowIndex];
          const baseDelay = rowIndex * 120;
          return (
            <div
              key={row.flight}
              className={row.highlight ? 'gala-board-row is-highlight' : 'gala-board-row'}
            >
              {(Object.keys(WIDTHS) as Column[]).map((column) => (
                <span key={column} className={`col-${column}`}>
                  <FlapText
                    text={row[column]}
                    width={WIDTHS[column]}
                    play={play}
                    delay={column === 'destination' && replay ? 0 : baseDelay}
                    // Only the destination column re-checks itself.
                    nonce={column === 'destination' ? replay : 0}
                  />
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
