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

// The plane is drawn nose-left in a 1200 × 900 box with roughly airliner
// proportions: the fuselage is ~7× longer than it is wide, and the wingspan
// is ~0.75× the length. The centreline is y = 450; the cabin runs y 381–519.
// Phones get the same drawing rotated nose-up and cropped to the cabin.
const W = 1200;
const H = 900;

function buildSeats(): Seat[] {
  const seats: Seat[] = [];
  const add = (cabin: Cabin, rowCount: number, x0: number, pitch: number, ys: number[], letters: string, size: number, firstRow: number) => {
    for (let row = 0; row < rowCount; row += 1) {
      ys.forEach((y, seatIndex) => {
        seats.push({ id: `${firstRow + row}${letters[seatIndex]}`, cabin, x: x0 + row * pitch, y, size });
      });
    }
  };
  add('first', 3, 236, 46, [412, 488], 'AF', 30, 1);
  add('business', 4, 398, 40, [398, 425, 475, 502], 'ACDF', 24, 5);
  add('main', 11, 592, 35, [393, 412, 431, 469, 488, 507], 'ABCDEF', 17, 10);
  return seats;
}

// Reflect a path drawn above the centreline to below it (y → H − y).
const mirror = (path: string) =>
  path.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${x} ${H - Number(y)}`);

const FUSELAGE =
  'M232 372 L1010 372 C1080 372 1138 410 1166 444 L1166 456 C1138 490 1080 528 1010 528 L232 528 C118 528 40 496 40 450 C40 404 118 372 232 372 Z';
// Swept wing with a trailing-edge kink and a winglet at the tip.
const WING = 'M508 374 L846 48 L852 30 L888 30 L898 48 L816 196 L744 330 L740 374 Z';
const STABILIZER = 'M1032 376 L1118 268 L1150 268 L1114 376 Z';
// Engine nacelle (a top-down capsule) under each wing; its front pokes out
// ahead of the leading edge.
const ENGINE = { x: 552, y: 252, w: 150, h: 36 };
const FIN = 'M1018 450 L1150 445 L1168 450 L1150 455 Z';

interface DrawingProps {
  id: string;
  seats: Seat[];
  active: Seat | null;
  onEnter: (seat: Seat) => void;
  onLeave: (seat: Seat) => void;
}

function Drawing({ id, seats, active, onEnter, onLeave }: DrawingProps) {
  // Gradient ids are per drawing: a gradient defined inside a display:none
  // <svg> doesn't paint, so the two variants can't share one.
  const body = `gala-fuselage-${id}`;
  const metal = `gala-metal-${id}`;
  return (
    <>
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6dece" />
          <stop offset="0.2" stopColor="#fffdf7" />
          <stop offset="0.55" stopColor="#fffdf7" />
          <stop offset="1" stopColor="#ded4c0" />
        </linearGradient>
        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d6cab0" />
          <stop offset="1" stopColor="#ebe3d0" />
        </linearGradient>
      </defs>

      {/* Engines sit under the wings, so they're drawn first. */}
      {[ENGINE.y, H - ENGINE.y - ENGINE.h].map((y) => (
        <g key={y} className="gala-seatmap-engine">
          <rect x={ENGINE.x} y={y} width={ENGINE.w} height={ENGINE.h} rx={ENGINE.h / 2} fill={`url(#${metal})`} />
          <ellipse cx={ENGINE.x + 7} cy={y + ENGINE.h / 2} rx="5" ry={ENGINE.h / 2 - 5} className="gala-seatmap-intake" />
        </g>
      ))}

      <path className="gala-seatmap-wing" d={WING} fill={`url(#${metal})`} />
      <path className="gala-seatmap-wing" d={mirror(WING)} fill={`url(#${metal})`} />
      <path className="gala-seatmap-wing" d={STABILIZER} fill={`url(#${metal})`} />
      <path className="gala-seatmap-wing" d={mirror(STABILIZER)} fill={`url(#${metal})`} />

      <path className="gala-seatmap-fuselage" d={FUSELAGE} fill={`url(#${body})`} />
      <path className="gala-seatmap-fin" d={FIN} />

      {/* Four-pane windscreen */}
      <g className="gala-seatmap-cockpit">
        <path d="M74 428 Q66 450 74 472 L92 466 Q86 450 92 434 Z" />
        <line x1="70" y1="439" x2="90" y2="443" />
        <line x1="70" y1="461" x2="90" y2="457" />
        <line x1="68" y1="450" x2="88" y2="450" />
      </g>

      {/* Cabin windows, just inside the fuselage outline */}
      {Array.from({ length: 26 }, (_, index) => 232 + index * 30).map((x) => (
        <g key={x} className="gala-seatmap-window">
          <rect x={x} y="375.5" width="11" height="3.5" rx="1.75" />
          <rect x={x} y="521" width="11" height="3.5" rx="1.75" />
        </g>
      ))}

      {/* Doors, front and rear */}
      {[204, 1004].map((x) => (
        <g key={x} className="gala-seatmap-door">
          <rect x={x} y="373.5" width="16" height="5" rx="1" />
          <rect x={x} y="521.5" width="16" height="5" rx="1" />
        </g>
      ))}

      <line className="gala-seatmap-divider" x1="378" y1="384" x2="378" y2="516" />
      <line className="gala-seatmap-divider" x1="574" y1="384" x2="574" y2="516" />

      {seats.map((seat, index) => (
        <g
          key={seat.id}
          className={`gala-seat gala-seat-${seat.cabin}${active?.id === seat.id ? ' is-active' : ''}`}
          style={{ '--i': index } as CSSProperties}
          transform={`translate(${seat.x} ${seat.y - seat.size / 2})`}
          onPointerEnter={() => onEnter(seat)}
          onPointerLeave={() => onLeave(seat)}
          onClick={() => window.open(GALA_PARTNER_FORM_URL, '_blank', 'noopener,noreferrer')}
        >
          {/* Passengers face the nose, so the seat back sits on the tail side. */}
          <rect className="gala-seat-cushion" x="0" y="0" width={seat.size * 0.8} height={seat.size} rx={seat.size * 0.22} />
          <rect className="gala-seat-back" x={seat.size * 0.66} y="0" width={seat.size * 0.3} height={seat.size} rx={seat.size * 0.14} />
        </g>
      ))}
    </>
  );
}

export function GalaSeatMap() {
  const seats = useMemo(buildSeats, []);
  const [active, setActive] = useState<Seat | null>(null);
  const onEnter = (seat: Seat) => setActive(seat);
  const onLeave = (seat: Seat) => setActive((current) => (current?.id === seat.id ? null : current));

  return (
    <div className="gala-seatmap">
      <div className="gala-seatmap-frame" aria-hidden="true">
        <svg className="gala-seatmap-wide" viewBox={`0 0 ${W} ${H}`}>
          <Drawing id="wide" seats={seats} active={active} onEnter={onEnter} onLeave={onLeave} />
        </svg>
        {/* Nose-up, cropped to the cabin so seats stay a usable size on phones;
            the wings run off the frame edges, as in airline seat maps. */}
        <svg className="gala-seatmap-tall" viewBox={`${H / 2 - 190} 20 380 ${W - 40}`}>
          <g transform={`translate(${H} 0) rotate(90)`}>
            <Drawing id="tall" seats={seats} active={active} onEnter={onEnter} onLeave={onLeave} />
          </g>
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
