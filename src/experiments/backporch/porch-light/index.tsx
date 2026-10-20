// Porch Light: the sample BackPorch experiment.
// Drag the evening from late afternoon to nightfall: the sun sets behind the
// ridges, the layers deepen toward the BackPorch's night colour, stars come out,
// and the porch lantern comes on. Pure SVG and one range input: no data, no
// timers, nothing moves unless you move it.
import { useId, useMemo, useState } from 'react';
import './porchLight.css';

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const mix = (a: RGB, b: RGB, t: number): string =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
/** Interpolate along a list of stops spread evenly over 0..1. */
function ramp(stops: string[], t: number): string {
  const pts = stops.map(hex);
  const x = Math.min(0.9999, Math.max(0, t)) * (pts.length - 1);
  const i = Math.floor(x);
  return mix(pts[i], pts[i + 1], x - i);
}

// Colours sampled from the BackPorch view, late afternoon -> sunset -> night.
const SKY_TOP = ['#8fb3d1', '#c9a9b8', '#5b4a6b', '#1f1b26'];
const SKY_LOW = ['#f3d9a7', '#f0a46a', '#b0605a', '#2b2533'];
const RIDGES = [
  ['#9fb0c4', '#9a8ea6', '#5b5468', '#2e2a38'],
  ['#7d90a8', '#7a6f8a', '#463f55', '#25212e'],
  ['#5f7189', '#5c5370', '#363044', '#1f1b26'],
  ['#45546b', '#433c55', '#2a2535', '#19161f'],
];
const RIDGE_PATHS = [
  'M0 300 C 120 260, 220 280, 330 250 S 560 230, 700 262 S 960 236, 1200 258 V 500 H 0 Z',
  'M0 330 C 150 300, 260 318, 380 296 S 620 300, 760 312 S 1010 288, 1200 304 V 500 H 0 Z',
  'M0 362 C 110 344, 240 360, 360 342 S 600 356, 760 344 S 1020 360, 1200 340 V 500 H 0 Z',
  'M0 400 C 160 384, 300 398, 460 386 S 760 396, 900 384 S 1100 398, 1200 390 V 500 H 0 Z',
];
const STARS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 263) % 1200,
  y: 20 + ((i * 97) % 200),
  r: 0.8 + ((i * 7) % 10) / 10,
}));

function clockLabel(t: number): string {
  // 4:30 p.m. to 8:00 p.m.
  const minutes = 16 * 60 + 30 + Math.round(t * 210);
  const h = Math.floor(minutes / 60) - 12;
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, '0')} p.m.`;
}

export default function PorchLight() {
  const [t, setT] = useState(0.35);
  const id = useId();
  const sunY = 150 + t * 260; // sinks behind the ridges
  const night = Math.max(0, (t - 0.62) / 0.38);
  const lantern = Math.max(0, (t - 0.5) / 0.5);
  const sky = useMemo(() => ({ top: ramp(SKY_TOP, t), low: ramp(SKY_LOW, t) }), [t]);

  return (
    <figure className="pl">
      <svg viewBox="0 0 1200 500" className="pl-scene" role="img" aria-label={`The ridges at ${clockLabel(t)}`}>
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky.top} />
            <stop offset="1" stopColor={sky.low} />
          </linearGradient>
          <radialGradient id={`${id}-sun`}>
            <stop offset="0" stopColor="#fff3cf" />
            <stop offset="0.35" stopColor="#f6c463" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f2b632" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f2b632" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="500" fill={`url(#${id}-sky)`} />
        <g opacity={night}>
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#f6efe3" />
          ))}
        </g>
        <circle cx={860} cy={sunY} r={120} fill={`url(#${id}-sun)`} />
        <circle cx={860} cy={sunY} r={26} fill="#fff1c4" opacity={1 - night} />
        {RIDGE_PATHS.map((d, i) => (
          <path key={i} d={d} fill={ramp(RIDGES[i], t)} />
        ))}
        {/* valley mist, thinning as it gets dark */}
        <path d="M0 372 C 300 360, 600 376, 900 364 S 1150 370, 1200 366 V 384 H 0 Z" fill="#f6efe3" opacity={0.22 * (1 - night)} />
        {/* the porch: rail and post in silhouette, lantern hanging from the eave */}
        <g fill="#15121a">
          <rect x="0" y="0" width="1200" height="34" />
          <rect x="70" y="0" width="34" height="500" />
          <rect x="0" y="430" width="1200" height="14" />
          {Array.from({ length: 24 }, (_, i) => (
            <rect key={i} x={120 + i * 46} y="444" width="12" height="56" />
          ))}
        </g>
        <circle cx="180" cy="120" r={110} fill={`url(#${id}-glow)`} opacity={lantern} />
        <g transform="translate(180 120)">
          <line x1="0" y1="-86" x2="0" y2="-26" stroke="#15121a" strokeWidth="3" />
          <path d="M-16 -26 h32 l-4 44 h-24 Z" fill="#15121a" />
          <rect x="-11" y="-20" width="22" height="34" fill="#ffd98a" opacity={0.15 + 0.85 * lantern} />
        </g>
      </svg>
      <div className="pl-controls">
        <label htmlFor={`${id}-time`}>Evening on the porch</label>
        <input
          id={`${id}-time`}
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          aria-valuetext={clockLabel(t)}
        />
        <output htmlFor={`${id}-time`}>{clockLabel(t)}</output>
      </div>
    </figure>
  );
}
