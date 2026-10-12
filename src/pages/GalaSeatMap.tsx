import { useMemo, useState, type CSSProperties } from 'react';
import { GALA_PARTNER_FORM_URL } from '../data/events';

// A teaser seat map for Gala sponsorships ("travel partners"). Levels, prices
// and seat counts aren't set yet, so every seat is "opening soon" and the
// layout is illustrative: three cabins, not a real inventory. Once levels are
// decided, give each seat a status (and a sponsor logo when claimed).

type Cabin = 'first' | 'business' | 'main';

interface Seat {
  id: string;
  cabin: Cabin;
  x: number;
  y: number;
  size: number;
}

export const CABIN_LABELS: Record<Cabin, string> = {
  first: 'First Class',
  business: 'Business',
  main: 'Main Cabin',
};

// Geometry is drawn nose-left in a 1000 × 420 box; phones get the same drawing
// rotated nose-up.
function buildSeats(): Seat[] {
  const seats: Seat[] = [];
  const add = (cabin: Cabin, rows: number[], x0: number, pitch: number, ys: number[], letters: string, size: number, firstRow: number) => {
    rows.forEach((_, rowIndex) => {
      ys.forEach((y, seatIndex) => {
        seats.push({
          id: `${firstRow + rowIndex}${letters[seatIndex]}`,
          cabin,
          x: x0 + rowIndex * pitch,
          y,
          size,
        });
      });
    });
  };
  add('first', [0, 1, 2], 196, 46, [150, 240], 'AF', 34, 1);
  add('business', [0, 1, 2, 3], 352, 42, [138, 172, 226, 260], 'ACDF', 28, 5);
  add('main', [0, 1, 2, 3, 4, 5, 6, 7, 8], 548, 38, [132, 154, 176, 222, 244, 266], 'ABCDEF', 19, 10);
  return seats;
}

const FUSELAGE =
  'M160 110 H880 C930 110 960 150 985 210 C960 270 930 310 880 310 H160 C80 310 34 262 34 210 C34 158 80 110 160 110 Z';
const WING_TOP = 'M470 112 L590 112 L700 14 L640 14 Z';
const WING_BOTTOM = 'M470 308 L590 308 L700 406 L640 406 Z';
const TAIL_TOP = 'M890 118 L950 118 L985 66 L960 66 Z';
const TAIL_BOTTOM = 'M890 302 L950 302 L985 354 L960 354 Z';

export function GalaSeatMap() {
  const seats = useMemo(buildSeats, []);
  const [active, setActive] = useState<Seat | null>(null);

  const drawing = (
    <>
      <path className="gala-seatmap-wing" d={WING_TOP} />
      <path className="gala-seatmap-wing" d={WING_BOTTOM} />
      <path className="gala-seatmap-wing" d={TAIL_TOP} />
      <path className="gala-seatmap-wing" d={TAIL_BOTTOM} />
      <path className="gala-seatmap-fuselage" d={FUSELAGE} />
      {/* Cockpit windows */}
      <path className="gala-seatmap-cockpit" d="M70 190 Q60 210 70 230 L92 224 Q86 210 92 196 Z" />
      {/* Cabin dividers */}
      <line className="gala-seatmap-divider" x1="330" y1="122" x2="330" y2="298" />
      <line className="gala-seatmap-divider" x1="526" y1="122" x2="526" y2="298" />
      {/* Cabin windows along both sides */}
      {Array.from({ length: 20 }, (_, index) => 190 + index * 36).map((x) => (
        <g key={x} className="gala-seatmap-window">
          <rect x={x} y="116" width="14" height="4" rx="2" />
          <rect x={x} y="300" width="14" height="4" rx="2" />
        </g>
      ))}
      {seats.map((seat, index) => (
        <g
          key={seat.id}
          className={`gala-seat gala-seat-${seat.cabin}${active?.id === seat.id ? ' is-active' : ''}`}
          style={{ '--i': index } as CSSProperties}
          transform={`translate(${seat.x} ${seat.y - seat.size / 2})`}
          onPointerEnter={() => setActive(seat)}
          onPointerLeave={() => setActive((current) => (current?.id === seat.id ? null : current))}
          onClick={() => window.open(GALA_PARTNER_FORM_URL, '_blank', 'noopener,noreferrer')}
        >
          {/* Passengers face the nose, so the seat back sits on the tail side. */}
          <rect className="gala-seat-cushion" x="0" y="0" width={seat.size * 0.8} height={seat.size} rx={seat.size * 0.22} />
          <rect className="gala-seat-back" x={seat.size * 0.66} y="0" width={seat.size * 0.3} height={seat.size} rx={seat.size * 0.14} />
        </g>
      ))}
    </>
  );

  return (
    <div className="gala-seatmap">
      <div className="gala-seatmap-frame" aria-hidden="true">
        <svg className="gala-seatmap-wide" viewBox="0 0 1000 420">
          {drawing}
        </svg>
        <svg className="gala-seatmap-tall" viewBox="0 0 420 1000">
          <g transform="translate(420 0) rotate(90)">{drawing}</g>
        </svg>
      </div>
      <p className="gala-seatmap-status" aria-hidden="true">
        {active ? (
          <>
            <b>{CABIN_LABELS[active.cabin]}</b> · Seat {active.id} · Partner seat opening soon
          </>
        ) : (
          <>Every seat is opening soon. Choose one to request early boarding.</>
        )}
      </p>
    </div>
  );
}
