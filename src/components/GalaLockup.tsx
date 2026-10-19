import '@fontsource-variable/fraunces';
import './galaLockup.css';

import type { ReactNode } from 'react';
import { Sparkmark } from './Sparkmark';

// The Gala's name, An Atlas of Wonders, set as its atlas-cover lockup: a
// faint globe behind a small italic "An", ATLAS in heavy spaced capitals,
// "of Wonders" in brass italic, a sparkmark rule, and the byline. Drawn for
// night-blue backgrounds. Size it with `font-size` on the wrapper (via
// `className`); everything inside scales from it.
//
// Pass `headingId` to make the name the page's h1 (the Gala page hero);
// leave it out where a separate heading already names the event, and the
// whole lockup is hidden from screen readers.
export const GALA_NAME = 'An Atlas of Wonders';
export const GALA_BYLINE = 'The SparkPoint Gala';

export function GalaLockup({
  headingId,
  byline = GALA_BYLINE,
  className = '',
}: {
  headingId?: string;
  byline?: ReactNode;
  className?: string;
}) {
  const name = (
    <>
      <span className="gl-an" aria-hidden="true">An</span>
      <span className="gl-atlas" aria-hidden="true">Atlas</span>
      <em className="gl-wonders" aria-hidden="true">of Wonders</em>
    </>
  );

  return (
    <div className={`gl ${className}`} aria-hidden={headingId ? undefined : true}>
      <svg className="gl-globe" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="96" />
        <ellipse cx="100" cy="100" rx="64" ry="96" />
        <ellipse cx="100" cy="100" rx="30" ry="96" />
        <ellipse cx="100" cy="100" rx="96" ry="40" />
        <path d="M100 4v192M4 100h192" />
      </svg>
      {headingId ? (
        <h1 id={headingId} className="gl-name" aria-label={`${GALA_NAME}, ${GALA_BYLINE.replace(/^The /, 'the ')}`}>
          {name}
        </h1>
      ) : (
        <p className="gl-name">{name}</p>
      )}
      <p className="gl-rule" aria-hidden="true">
        <span />
        <Sparkmark size="1.25em" />
        <span />
      </p>
      <p className="gl-byline">{byline}</p>
    </div>
  );
}
