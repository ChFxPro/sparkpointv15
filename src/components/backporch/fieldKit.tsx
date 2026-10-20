// The BackPorch's field kit: a few pieces borrowed, for feel rather than fidelity,
// from the Rural Health Field Simulator (RuralHealthSim Fable: blazes.mjs,
// FieldIcons.tsx, FieldSheetKit.tsx, and its porch hero plate). The BackPorch
// stays SparkPoint (plum, pink, Manrope); these add the warmth.
//
// Trail blazes mark what kind of post you're looking at, the way the simulator's
// blazes told a room which table was theirs. Same inks, same shapes, and the same
// rule: A BLAZE NEVER APPEARS WITHOUT ITS NAME. Colour catches the eye, the shape
// confirms it, and the word is what a screen reader, a greyscale printout, and a
// colour-blind reader all get. A mark on its own would be the bug that rule exists
// to prevent, so every mark here is aria-hidden and sits beside its label.
import type { ReactNode } from 'react';
import type { PorchKind } from '../../lib/backporch';

// ── Blazes ──────────────────────────────────────────────────────────────
// Inks and shapes copied from the simulator's blazes.mjs (the 6 inks that stay
// distinct under red-green colour blindness, each deep enough for a white mark).
const INK = {
  green: '#2F4A3C',
  red: '#AE503A',
  gold: '#B08928',
  blue: '#3A6186',
  pink: '#C67988',
  sky: '#5887AB',
} as const;

const SHAPE = {
  circle: '<circle cx="50" cy="50" r="40"/>',
  triangle: '<path d="M50 8 L93 86 H7 Z"/>',
  square: '<rect x="13" y="13" width="74" height="74"/>',
  star: '<path d="M50 4 L61.8 36.8 L96.6 37.6 L69 58.8 L79 92 L50 72.4 L21 92 L31 58.8 L3.4 37.6 L38.2 36.8 Z"/>',
  crescent: '<path d="M72 14.2 A42 42 0 1 0 72 85.8 A36 36 0 0 1 72 14.2 Z"/>',
} as const;

export interface PorchBlaze {
  name: string; // "Gold Circle"
  label: string; // what it marks: "Gathering"
  hex: string;
  shape: string;
}

/** One blaze per kind of post, plus Pinned. Fixed, so readers can learn them. */
export const KIND_BLAZE: Record<PorchKind, PorchBlaze> = {
  gathering: { name: 'Gold Circle', label: 'Gathering', hex: INK.gold, shape: SHAPE.circle },
  news: { name: 'Blue Square', label: 'News', hex: INK.blue, shape: SHAPE.square },
  ask: { name: 'Red Triangle', label: 'Ask', hex: INK.red, shape: SHAPE.triangle },
  story: { name: 'Green Crescent', label: 'Story', hex: INK.green, shape: SHAPE.crescent },
};
export const PINNED_BLAZE: PorchBlaze = { name: 'Pink Star', label: 'Pinned', hex: INK.pink, shape: SHAPE.star };

/** The mark alone. Always render its label beside it (see the note at the top). */
export function BlazeMark({ blaze, size = 16, halo = false }: { blaze: PorchBlaze; size?: number; halo?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" className="fk-blaze" overflow="visible">
      {halo && (
        <g
          fill="none"
          stroke="#F5EFDD"
          strokeWidth="14"
          strokeLinejoin="round"
          // A fixed shape constant from this file, never user content.
          dangerouslySetInnerHTML={{ __html: blaze.shape }}
        />
      )}
      <g fill={blaze.hex} dangerouslySetInnerHTML={{ __html: blaze.shape }} />
    </svg>
  );
}

/** Mark + word, as the simulator prints it: "● Gathering". */
export function BlazeTag({ blaze, size = 14, children }: { blaze: PorchBlaze; size?: number; children?: ReactNode }) {
  return (
    <span className="fk-tag">
      <BlazeMark blaze={blaze} size={size} />
      <span>{children ?? blaze.label}</span>
    </span>
  );
}

// ── Trail icons ─────────────────────────────────────────────────────────
// The simulator's icon language: 24-box, 2px strokes, currentColor, a little
// hand-set irregularity, never perfectly symmetric. Lantern is new for the porch.
function Icon({ size = 18, children, label }: { size?: number; children: ReactNode; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="fk-icon"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {children}
    </svg>
  );
}

/** Porch lantern: the BackPorch's own mark. */
export function Lantern({ size, label }: { size?: number; label?: string }) {
  return (
    <Icon size={size} label={label}>
      <path d="M12 2.6 v2.2" />
      <path d="M8.6 7.2 l3.3 -2.3 l3.5 2.4" />
      <path d="M8.3 7.4 h7.5 l-0.6 9.6 h-6.4 Z" />
      <path d="M7.4 17.1 h9.3" />
      <path d="M12.1 10.2 c1.1 1.2 1.3 2.4 0.1 3.6 c-1.3 -1.1 -1.1 -2.4 -0.1 -3.6 Z" fill="currentColor" stroke="none" />
      <path d="M10 19.6 h4.1" strokeWidth={1.5} />
    </Icon>
  );
}

/** Waymark arrow: "go this way". */
export function Waymark({ size }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M4.5 12.2 h12.5" />
      <path d="M13.4 7.6 l4.8 4.6 -4.8 4.7" />
      <path d="M4.5 12.2 c0 0 -0.8 -3.4 -1 -4.9" strokeWidth={1.2} opacity={0.5} />
    </Icon>
  );
}

/** Back along the trail. */
export function WaymarkBack({ size }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M19.5 12.2 h-12.5" />
      <path d="M10.6 7.6 l-4.8 4.6 4.8 4.7" />
    </Icon>
  );
}

/** Signal: the map symbol for a radio station. Used for feeds. */
export function Signal({ size }: { size?: number }) {
  return (
    <Icon size={size}>
      <circle cx="12" cy="15" r="2.2" fill="currentColor" stroke="none" />
      <path d="M7.4 11.4 a6.4 6.4 0 0 1 9.2 0 M4.6 8.4 a10.2 10.2 0 0 1 14.8 0" />
    </Icon>
  );
}

/** Field journal: updates by email. */
export function Journal({ size }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M6.5 3.8 h10 a1.2 1.2 0 0 1 1.2 1.2 v14 a1.2 1.2 0 0 1 -1.2 1.2 h-10 a1.4 1.4 0 0 1 -1.4 -1.4 v-13.6 a1.4 1.4 0 0 1 1.4 -1.4 Z" />
      <path d="M8.6 3.9 v16.2" strokeWidth={1.5} />
      <path d="M11 8.4 h4.4 M11 11.6 h4.4 M11 14.8 h3" strokeWidth={1.5} />
    </Icon>
  );
}

/** Topo pin: where a gathering is. */
export function TopoPin({ size }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M12 3.5 c-2.9 0 -5 2.1 -5 4.8 c0 3.4 5 8.7 5 8.7 s5 -5.4 5 -8.8 c0 -2.7 -2.1 -4.7 -5 -4.7 Z" />
      <circle cx="12" cy="8.4" r="1.7" fill="currentColor" stroke="none" />
      <path d="M3 20.4 c3 -1.6 6 0.8 9 -0.6 s6 0.4 9 -1" strokeWidth={1.4} />
    </Icon>
  );
}

/** Cairn: the stones that mark a way. Used for the short address. */
export function Cairn({ size }: { size?: number }) {
  return (
    <Icon size={size}>
      <ellipse cx="12" cy="18.6" rx="7" ry="2.2" />
      <ellipse cx="11.7" cy="14.4" rx="5" ry="1.9" transform="rotate(-2 11.7 14.4)" />
      <ellipse cx="12.2" cy="10.8" rx="3.4" ry="1.6" transform="rotate(2 12.2 10.8)" />
      <ellipse cx="11.9" cy="7.8" rx="2" ry="1.2" />
    </Icon>
  );
}

// ── Paper and scenery ───────────────────────────────────────────────────

/**
 * Contour terrain behind a sheet: three nests of contours, the French Broad as a
 * slate double line, and a pair of benchmark crosses. Drawn at a whisper so type
 * on top reads cleanly. No lettering: text behind text can't be read through.
 */
export function ContourTerrain({ className = '' }: { className?: string }) {
  return (
    <svg className={`fk-terrain ${className}`} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g stroke="#AE503A" strokeWidth="1" opacity="0.05">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={`v${i}`} x1={i * 230 - 60} y1="-40" x2={i * 230 - 20} y2="1040" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1="-40" y1={i * 250 - 30} x2="1640" y2={i * 250 + 10} />
        ))}
      </g>
      <g fill="#667243" opacity="0.035">
        <path d="M-50 80 C 200 20, 420 140, 560 90 C 700 40, 780 160, 700 260 C 620 360, 380 320, 240 360 C 100 400, -60 320, -50 200 Z" />
        <path d="M1100 560 C 1260 500, 1460 560, 1560 640 C 1660 720, 1560 880, 1400 900 C 1240 920, 1080 860, 1060 740 C 1040 660, 1040 600, 1100 560 Z" />
      </g>
      <g fill="none" stroke="#6B4226" strokeWidth="1">
        <g opacity="0.2">
          {[1, 0.82, 0.64, 0.47, 0.31].map((s, i) => (
            <path
              key={i}
              transform={`translate(1150 220) scale(${s})`}
              strokeWidth={i === 2 ? 1.8 : 1}
              d="M-320 40 C -300 -80, -180 -150, -40 -140 C 110 -130, 250 -90, 290 10 C 330 110, 240 180, 90 200 C -60 220, -240 190, -300 120 C -330 80, -330 70, -320 40 Z"
            />
          ))}
        </g>
        <g opacity="0.18">
          {[1, 0.8, 0.6, 0.42].map((s, i) => (
            <path
              key={i}
              transform={`translate(280 820) scale(${s})`}
              strokeWidth={i === 1 ? 1.8 : 1}
              d="M-360 20 C -280 -70, -80 -110, 120 -90 C 300 -70, 400 -20, 380 50 C 360 120, 160 150, -40 140 C -220 130, -380 100, -360 20 Z"
            />
          ))}
        </g>
        <g opacity="0.16">
          {[1, 0.68, 0.4].map((s, i) => (
            <path
              key={i}
              transform={`translate(180 380) scale(${s})`}
              d="M-140 10 C -120 -60, -20 -90, 60 -70 C 140 -50, 170 0, 140 50 C 110 100, -20 110, -90 80 C -140 60, -150 40, -140 10 Z"
            />
          ))}
        </g>
      </g>
      <path
        d="M-40 640 C 200 600, 340 660, 520 620 C 720 575, 820 640, 1020 600 C 1240 556, 1400 620, 1660 570"
        fill="none"
        stroke="#5C6B73"
        strokeWidth="5"
        opacity="0.28"
      />
      <g stroke="#87671F" strokeWidth="1.6" opacity="0.45">
        <path d="M1210 214 v14 M1203 221 h14" />
        <path d="M300 806 v14 M293 813 h14" />
      </g>
    </svg>
  );
}

/**
 * The porch at dusk: the simulator's finished hero plate (sepia line study,
 * one goldenrod lantern). Transparent, so it floats on the paper.
 */
export function PorchPlate({ className = '', eager = false }: { className?: string; eager?: boolean }) {
  const base = import.meta.env.BASE_URL;
  return (
    <img
      className={`fk-porch ${className}`}
      src={`${base}assets/backporch/porch-700.webp`}
      srcSet={`${base}assets/backporch/porch-700.webp 700w, ${base}assets/backporch/porch-1200.webp 1200w`}
      sizes="(min-width: 900px) 520px, 90vw"
      width={1200}
      height={800}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

/** A contour-line divider; four rhythms so repeats never look templated. */
export function ContourRule({ variant = 0 }: { variant?: 0 | 1 | 2 | 3 }) {
  return <div className={`fk-rule fk-rule-${variant}`} aria-hidden="true" />;
}
