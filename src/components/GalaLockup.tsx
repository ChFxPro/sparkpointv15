import '@fontsource-variable/josefin-sans';
import '@fontsource-variable/josefin-sans/wght-italic.css';
import './galaLockup.css';

import { Sparkmark } from './Sparkmark';

// The Gala's name, A World of Connections, set as its Art Deco lockup. Ported
// from the approved kit's master (Branding/Gala/WorldOfConnections/lockup.html,
// 2026-10-28): a faint globe, sunburst and three dashed routes meeting at a
// ringed home node behind; a small italic "A"; WORLD as a dimensional letter
// (face, offset gap line, edge line); "— OF CONNECTIONS —" in spaced capitals
// between bars; a double-hairline sparkmark rule; and the two-line byline.
// Everything is Josefin Sans and sized in em from the wrapper's font-size,
// which is the cap size of WORLD. Drawn for night-blue backgrounds.
//
// `tone="light"` recolours it for cream or paper backgrounds.
//
// Pass `headingId` to make the name the page's h1 (the Gala page hero);
// leave it out where a separate heading already names the event, and the
// whole lockup is hidden from screen readers.
export const GALA_NAME = 'A World of Connections';
export const GALA_BYLINE = 'The SparkPoint Gala';
export const GALA_SUBLINE = 'Live travel auction';
export const GALA_FULL_TITLE = 'A World of Connections: SparkPoint Gala & Travel Auction';
const GALA_LABEL = `${GALA_NAME}, the SparkPoint Gala`;

// Sunburst: 25 rays fanning up from below the name, alternating long and short
// (the kit draws these in a script; the same numbers, computed once here).
const RAYS = Array.from({ length: 25 }, (_, i) => {
  const a = Math.PI * (i / 24);
  const r2 = i % 2 ? 98 : 112;
  const f = (n: number) => +n.toFixed(2);
  return {
    x1: f(100 - Math.cos(a) * 20),
    y1: f(132 - Math.sin(a) * 20),
    x2: f(100 - Math.cos(a) * r2),
    y2: f(132 - Math.sin(a) * r2),
  };
});

export function GalaLockup({
  headingId,
  tone = 'dark',
  className = '',
}: {
  headingId?: string;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const name = (
    <>
      <span className="gl-a" aria-hidden="true">A</span>
      <span className="gl-world" aria-hidden="true">World</span>
      <span className="gl-conn" aria-hidden="true">of Connections</span>
    </>
  );

  return (
    <div
      className={`gl ${tone === 'light' ? 'gl-light ' : ''}${className}`}
      aria-hidden={headingId ? undefined : true}
    >
      <svg className="gl-art" viewBox="0 0 200 200" aria-hidden="true">
        <g className="gl-rays">
          {RAYS.map((ray, index) => (
            <line key={index} {...ray} />
          ))}
        </g>
        <g className="gl-globe">
          <circle cx="100" cy="100" r="78" />
          <ellipse cx="100" cy="100" rx="52" ry="78" />
          <ellipse cx="100" cy="100" rx="24" ry="78" />
          <ellipse cx="100" cy="100" rx="78" ry="32" />
          <path d="M100 22v156M22 100h156" />
        </g>
        <path className="gl-route" d="M38 62 Q 62 32 100 30" />
        <path className="gl-route" d="M100 30 Q 138 32 162 62" />
        <path className="gl-route" d="M100 30 Q 124 16 142 40" />
        <circle className="gl-node" cx="38" cy="62" r="1.8" />
        <circle className="gl-node" cx="162" cy="62" r="1.8" />
        <circle className="gl-node" cx="142" cy="40" r="1.8" />
        <circle className="gl-home" cx="100" cy="30" r="3.6" />
        <circle className="gl-node" cx="100" cy="30" r="1.6" />
      </svg>
      {headingId ? (
        <h1 id={headingId} className="gl-name" aria-label={GALA_LABEL}>
          {name}
        </h1>
      ) : (
        <p className="gl-name">{name}</p>
      )}
      <span className="gl-rule" aria-hidden="true">
        <i />
        <b />
        <Sparkmark size="1.5em" />
        <b />
        <i />
      </span>
      <span className="gl-by" aria-hidden="true">{GALA_BYLINE}</span>
      <span className="gl-by2" aria-hidden="true">{GALA_SUBLINE}</span>
    </div>
  );
}
