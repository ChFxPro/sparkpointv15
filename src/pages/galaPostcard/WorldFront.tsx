import { useEffect, useId, useRef, useState } from 'react';
import { SPARKMARK_URL } from '../../components/Sparkmark';
import { GALA_TRIPS, tripImageSrc } from '../../data/galaTrips';

// The front of the return-trip postcard (Jeff, 2026-11-13): a vintage
// big-letter card, "Greetings from the WORLD", with each letter of WORLD cut
// from one of the five featured trips' photos. WORLD is the Gala lockup's own
// letter (Josefin 700, a night gap line at 0.045em and a brass edge at 0.07em,
// as galaLockup.css), with three departures Jeff approved in the mock: a cream
// rim round each letter so the word reads over busy photos, tighter letter
// spacing, and letters drawn a little taller than wide (Deco) so the photos
// are big enough to read. Below it, the lockup's "OF CONNECTIONS", rule and
// byline; behind it, the lockup's 25-ray sunburst, faint globe and three
// dashed routes meeting at a ringed home node.
//
// The photos are CC BY / CC BY-SA: GalaPostcardCredits credits them in full
// under the postcard.

/** The five featured trips, in the order of the letters W, O, R, L, D. */
const LETTERS = [
  { ch: 'W', id: 'greece', label: 'Greece', align: 'xMaxYMid' },
  { ch: 'O', id: 'iceland', label: 'Iceland', align: 'xMidYMid' },
  { ch: 'R', id: 'cortona', label: 'Cortona', align: 'xMidYMid' },
  { ch: 'L', id: 'scotland', label: 'Scotland', align: 'xMaxYMid' },
  { ch: 'D', id: 'south-africa', label: 'South Africa', align: 'xMaxYMid' },
] as const;

export const WORLD_TRIPS = LETTERS.map((letter) => {
  const trip = GALA_TRIPS.find((t) => t.id === letter.id);
  if (!trip?.image) throw new Error(`Postcard: trip ${letter.id} has no image`);
  return { ...letter, image: trip.image };
});

/** Josefin Sans 700 advance widths, per 1000 units (measured in the browser). */
const ADVANCE: Record<string, number> = { W: 1023, O: 852, R: 686, L: 641, D: 771 };
const adv = (ch: string, fs: number) => (ADVANCE[ch] / 1000) * fs;

const BRASS = '#d9b56a';
const BRASS_LIGHT = '#f1d9a0';
const NIGHT = '#0b1322';
const IVORY = '#f7f1e5';
const PINK = '#e03694';

function layout(width: number, height: number) {
  const wide = height < width * 1.15;
  const W = 1000;
  const H = Math.max(400, Math.round((1000 * height) / width));
  const SP = wide ? 0.11 : 0.06; // letter spacing, ems
  const CAP = 0.75; // cap height, ems
  const FAT = 0.04; // added weight, ems
  const K = wide ? 1.38 : 1.45; // Deco-tall
  const ems = LETTERS.reduce((t, l) => t + ADVANCE[l.ch] / 1000, 0) + SP * (LETTERS.length - 1) + 0.07;
  const fs = (W - (wide ? 70 : 34)) / ems;
  const cap = fs * CAP * K;
  const fat = fs * FAT;
  const rim = fs * 0.026;
  const gH = wide ? 66 : 88;
  const block = gH + 22 + cap + fat * K + 32 + 46 + 36 + 38;
  const top = (H - block) / 2 + (wide ? 0 : -H * 0.02);
  const gy = top + gH * 0.8;
  const base = top + gH + 22 + cap;
  const ly = base + fat * K + rim * K + 38;
  const cy = ly + 46;
  const ry = cy + 36;
  const sy = ry + 38;
  const word = LETTERS.reduce((t, l) => t + adv(l.ch, fs), 0) + SP * fs * (LETTERS.length - 1);
  const hx = W / 2;
  const hy = wide ? Math.min(H - 40, sy + 70) : H - 110;
  let x = (W - word) / 2 - fs * 0.035;
  const letters = LETTERS.map((l) => {
    const w = adv(l.ch, fs);
    const at = x;
    x += w + SP * fs;
    return { ...l, x: at, w };
  });
  return { wide, W, H, K, fs, cap, fat, rim, gy, base, ly, cy, ry, sy, hx, hy, letters };
}

export function WorldFront() {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 600, height: 560 });
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      if (el.clientWidth && el.clientHeight) setBox({ width: el.clientWidth, height: el.clientHeight });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const L = layout(box.width, box.height);
  const { wide, W, H, K, fs, cap, fat, rim, gy, base, ly, cy, ry, sy, hx, hy } = L;
  const tall = `translate(0 ${base}) scale(1 ${K}) translate(0 ${-base})`;
  const glyph = (ch: string, x: number, props: Record<string, string | number>, strokeWidth = fat * 2) => (
    <g transform={tall}>
      <text
        x={x}
        y={base}
        fontSize={fs}
        fontWeight={700}
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
        strokeMiterlimit={2.2}
        {...props}
      >
        {ch}
      </text>
    </g>
  );
  const routes = [
    [-0.05, 0.08],
    [0.5, -0.02],
    [1.05, 0.12],
  ].map(([fx, fy]) => {
    const sx = W * fx;
    const sy0 = H * fy;
    return `M${sx} ${sy0} Q ${(sx + hx) / 2} ${Math.min(sy0, hy) - H * 0.12} ${hx} ${hy}`;
  });
  const gcy = base - cap / 2;
  const gr = Math.min(W * 0.46, H * 0.42);

  return (
    <div ref={ref} className="gala-postcard-world">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Greetings from the WORLD of Connections. Each letter of WORLD holds one of the Gala's trips: Greece, Iceland, Cortona, Scotland, and South Africa."
      >
        <defs>
          <radialGradient id={`${uid}-sky`} cx="50%" cy={`${(hy / H) * 100}%`} r={wide ? '90%' : '75%'}>
            <stop offset="0" stopColor="#2e2440" />
            <stop offset=".5" stopColor="#142037" />
            <stop offset="1" stopColor={NIGHT} />
          </radialGradient>
          <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".1" />
            <stop offset=".55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor={NIGHT} stopOpacity=".22" />
          </linearGradient>
          {L.letters.map((l, i) => (
            <mask key={l.ch} id={`${uid}-m${i}`} maskUnits="userSpaceOnUse">
              {glyph(l.ch, l.x, { fill: '#fff', stroke: '#fff' })}
            </mask>
          ))}
        </defs>

        <rect width={W} height={H} fill={`url(#${uid}-sky)`} />
        {Array.from({ length: 25 }, (_, i) => {
          const a = Math.PI + ((i + 0.5) / 25) * Math.PI;
          const r = 1600;
          const d = 0.02;
          return (
            <path
              key={i}
              d={`M${hx} ${hy} L${hx + Math.cos(a - d) * r} ${hy + Math.sin(a - d) * r} L${hx + Math.cos(a + d) * r} ${hy + Math.sin(a + d) * r}Z`}
              fill={BRASS}
              opacity={i % 2 ? 0.045 : 0.08}
            />
          );
        })}
        <g fill="none" stroke={BRASS} strokeOpacity=".12" strokeWidth="1.2">
          <circle cx={hx} cy={gcy} r={gr} />
          <ellipse cx={hx} cy={gcy} rx={gr * 0.62} ry={gr} />
          <ellipse cx={hx} cy={gcy} rx={gr * 0.22} ry={gr} />
          <ellipse cx={hx} cy={gcy} rx={gr} ry={gr * 0.34} />
        </g>
        <g fill="none" stroke={BRASS_LIGHT} strokeOpacity=".35" strokeWidth="1.6" strokeDasharray="2 9" strokeLinecap="round">
          {routes.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <circle cx={hx} cy={hy} r="13" fill="none" stroke={BRASS} strokeOpacity=".7" />
        <circle cx={hx} cy={hy} r="5" fill={PINK} />

        <g fontFamily="'Josefin Sans Variable', 'Josefin Sans', sans-serif">
          <text x={hx} y={gy} textAnchor="middle" fontSize={wide ? 54 : 70} fontStyle="italic" fontWeight={300} fill={IVORY}>
            Greetings from the
          </text>

          {/* WORLD: brass edge, night gap line, cream rim, then the photo face. */}
          {L.letters.map((l) => (
            <g key={`e${l.ch}`} transform={`translate(${fs * 0.07} ${fs * 0.07})`}>
              {glyph(l.ch, l.x, { fill: BRASS, stroke: BRASS }, fat * 2 + rim * 2)}
            </g>
          ))}
          {L.letters.map((l) => (
            <g key={`g${l.ch}`} transform={`translate(${fs * 0.045} ${fs * 0.045})`}>
              {glyph(l.ch, l.x, { fill: NIGHT, stroke: NIGHT }, fat * 2 + rim * 2)}
            </g>
          ))}
          {L.letters.map((l) => (
            <g key={`r${l.ch}`}>{glyph(l.ch, l.x, { fill: IVORY, stroke: IVORY }, fat * 2 + rim * 2)}</g>
          ))}
          {WORLD_TRIPS.map((trip, i) => {
            const l = L.letters[i];
            const y = base - cap - fat * 2 * K;
            const h = cap + fat * 4 * K;
            const box = { x: l.x - fat, y, width: l.w + fat * 2, height: h };
            return (
              <g key={`f${l.ch}`} mask={`url(#${uid}-m${i})`}>
                <rect {...box} fill={IVORY} />
                <image href={tripImageSrc(trip.image.file, 800)} {...box} preserveAspectRatio={`${l.align} slice`} />
                <rect {...box} fill="#fff4dc" opacity=".14" />
                <rect {...box} fill={`url(#${uid}-shade)`} />
              </g>
            );
          })}

          {wide
            ? L.letters.map((l) => (
                <text
                  key={`l${l.ch}`}
                  x={l.x + l.w / 2}
                  y={ly}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight={600}
                  letterSpacing="2.6"
                  fill={BRASS_LIGHT}
                  opacity=".85"
                >
                  {l.label.toUpperCase()}
                </text>
              ))
            : null}

          <text x={hx + 7} y={cy} textAnchor="middle" fontSize={wide ? 20 : 24} fontWeight={400} letterSpacing={wide ? 12 : 13} fill={BRASS_LIGHT}>
            OF CONNECTIONS
          </text>
          <g stroke={BRASS_LIGHT} strokeOpacity=".7">
            <line x1={hx - (wide ? 210 : 250)} x2={hx - (wide ? 140 : 168)} y1={cy - 7} y2={cy - 7} />
            <line x1={hx + (wide ? 150 : 178)} x2={hx + (wide ? 220 : 260)} y1={cy - 7} y2={cy - 7} />
          </g>
          <g stroke={BRASS} strokeOpacity=".75" strokeWidth="1">
            {[-1, 1].map((side) => (
              <g key={side}>
                <line x1={hx + side * 34} x2={hx + side * 230} y1={ry - 3} y2={ry - 3} />
                <line x1={hx + side * 34} x2={hx + side * 230} y1={ry + 3} y2={ry + 3} />
              </g>
            ))}
          </g>
          <g fill={BRASS}>
            {[-1, 1].map((side) => (
              <rect key={side} x={hx + side * 232 - 4} y={ry - 4} width="8" height="8" transform={`rotate(45 ${hx + side * 232} ${ry})`} />
            ))}
          </g>
          <image href={SPARKMARK_URL} x={hx - 16} y={ry - 16} width="32" height="32" />
          <text x={hx + 3} y={sy} textAnchor="middle" fontSize={wide ? 15 : 18} fontWeight={600} letterSpacing={wide ? 6 : 7} fill={BRASS_LIGHT}>
            THE SPARKPOINT GALA
          </text>
        </g>
      </svg>
    </div>
  );
}

/** Full credits for the five photos in WORLD (CC BY / CC BY-SA need visible attribution). */
export function GalaPostcardCredits() {
  return (
    <p className="gala-postcard-credits">
      Postcard photos:{' '}
      {WORLD_TRIPS.map((trip, i) => {
        const [author, rest] = trip.image.credit.split(' / ');
        const licence = (rest ?? '').replace(/, via Wikimedia Commons$/, '');
        return (
          <span key={trip.id}>
            {trip.label} by{' '}
            <a href={trip.image.sourceUrl} target="_blank" rel="noreferrer">
              {author}
            </a>{' '}
            (
            <a href={trip.image.licenseUrl} target="_blank" rel="noreferrer">
              {licence}
            </a>
            ){i < WORLD_TRIPS.length - 1 ? '; ' : ', via Wikimedia Commons.'}
          </span>
        );
      })}
    </p>
  );
}
