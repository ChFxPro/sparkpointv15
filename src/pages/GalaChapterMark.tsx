import { useId } from 'react';
import { Plane } from 'lucide-react';

// The Gala page's three chapter marks (Option B, Jeff's pick 2026-11-12), in
// place of eyebrow labels: the page keeps a label only where a chapter opens,
// and draws it as the travel object that chapter already is.
//
// - departures: a split-flap DEPARTURES row over the trips, like the hero's board.
// - entry: a passport entry stamp over "How it works", in the style of the
//   trip stamps on the "Join me" page (src/pages/galaJoinMe/stamps.ts):
//   double frame, worn ink, a machine-type date.
// - postmark: a round postmark with cancel waves over the return trip,
//   matching the postcard's own.
//
// Each mark is the section's label: the words are given to screen readers as
// text, and the drawing is hidden from them. The ink is worn with an SVG
// turbulence mask so it reads as stamped, not printed.
// First drafts: the stamp art is due a design pass with Jeff (WORKLIST).

type Kind = 'departures' | 'entry' | 'postmark';

const LABEL: Record<Kind, string> = {
  departures: 'Departures: the trips',
  entry: 'How it works',
  postmark: 'The return trip',
};

function WornInk({ id, seed }: { id: string; seed: number }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      {/* Uneven edges */}
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} result="grain" />
      <feDisplacementMap in="SourceGraphic" in2="grain" scale="0.9" result="rough" />
      {/* Speckled gaps where the ink didn't take */}
      <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="3" seed={seed + 7} result="blot" />
      <feColorMatrix in="blot" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.85" result="mask" />
      <feComposite in="rough" in2="mask" operator="in" />
    </filter>
  );
}

function Departures() {
  return (
    <span className="gala-mark-flaps" aria-hidden="true">
      {[...'DEPARTURES'].map((letter, index) => (
        <span key={index} className="gala-mark-flap">
          {letter}
        </span>
      ))}
    </span>
  );
}

function EntryStamp({ ink }: { ink: string }) {
  return (
    <svg className="gala-mark-svg gala-mark-entry" viewBox="0 0 248 92" aria-hidden="true">
      <defs>
        <WornInk id={ink} seed={4} />
      </defs>
      <g filter={`url(#${ink})`} fill="none" stroke="currentColor">
        <rect x="3" y="3" width="242" height="86" rx="7" strokeWidth="3" />
        <rect x="9" y="9" width="230" height="74" rx="4" strokeWidth="1.2" />
        <g stroke="none" fill="currentColor">
          {/* The page folio, as on the passport spread below */}
          <circle cx="44" cy="46" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="44" cy="46" r="20" fill="none" stroke="currentColor" strokeWidth="0.9" />
          <text x="44" y="53" textAnchor="middle" className="gala-mark-num">
            02
          </text>
          <text x="80" y="38" className="gala-mark-word">
            ADMITTED
          </text>
          <text x="80" y="60" className="gala-mark-words">
            HOW IT WORKS
          </text>
          <text x="80" y="76" className="gala-mark-date">
            11.12.26 · SPK
          </text>
        </g>
        {/* A small plane, as on the trip stamps */}
        <Plane x={208} y={16} width={26} height={26} strokeWidth={1.8} transform="rotate(-20 221 29)" />
      </g>
    </svg>
  );
}

function Postmark({ ink }: { ink: string }) {
  const ring = `${ink}-ring`;
  return (
    <svg className="gala-mark-svg gala-mark-postmark" viewBox="0 0 250 92" aria-hidden="true">
      <defs>
        <WornInk id={ink} seed={11} />
        <path id={ring} d="M46 46 m-33 0 a33 33 0 1 1 66 0 a33 33 0 1 1 -66 0" />
      </defs>
      <g filter={`url(#${ink})`} fill="none" stroke="currentColor">
        <circle cx="46" cy="46" r="42" strokeWidth="2.6" />
        <circle cx="46" cy="46" r="26" strokeWidth="1.2" />
        <g stroke="none" fill="currentColor">
          <text className="gala-mark-ring">
            <textPath href={`#${ring}`} startOffset="2%">
              TRANSYLVANIA CO · NC · HOME ·
            </textPath>
          </text>
          <text x="46" y="44" textAnchor="middle" className="gala-mark-date">
            DEC 11
          </text>
          <text x="46" y="56" textAnchor="middle" className="gala-mark-date">
            2026
          </text>
        </g>
        {/* Cancel waves, then the words between them */}
        {[22, 70].map((y) => (
          <path key={y} d={`M96 ${y} q 9 -6 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0`} strokeWidth="2" />
        ))}
        <text x="98" y="54" stroke="none" fill="currentColor" className="gala-mark-words">
          THE RETURN TRIP
        </text>
      </g>
    </svg>
  );
}

export function GalaChapterMark({ kind, className = '' }: { kind: Kind; className?: string }) {
  const ink = `gala-ink-${useId().replace(/:/g, '')}`;
  return (
    <p className={`gala-mark gala-mark-is-${kind} ${className}`.trim()}>
      <span className="sr-only">{LABEL[kind]}</span>
      {kind === 'departures' ? <Departures /> : null}
      {kind === 'entry' ? <EntryStamp ink={ink} /> : null}
      {kind === 'postmark' ? <Postmark ink={ink} /> : null}
    </p>
  );
}
