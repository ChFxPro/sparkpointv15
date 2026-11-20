// "Getting there" (#getting-there): the drive from the Dollar General on US 276 to
// the Clubhouse parking by the East Fork Gate, as the venue asked (Oct 26 planning
// meeting; Jeff confirmed the Dollar General comes before the turn, 2026-11-20).
// The steps are the real content; the map is a picture of them. The 3D map
// (scene.ts, three.js) loads only when this section nears the screen, and a flat
// drawing of the same route stands in until then, or if WebGL isn't available.
// Under reduced motion (OS or the site's toggle) the route is drawn at once.

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import data from '../../data/galaDirections.json';
import type { GalaDirectionsData } from './types';
import type { MapLabel } from './scene';

const DIRECTIONS = data as unknown as GalaDirectionsData;
const GATE = `${DIRECTIONS.places.gate[1]},${DIRECTIONS.places.gate[0]}`;
const GOOGLE = `https://www.google.com/maps/dir/?api=1&destination=${GATE}`;
const APPLE = `https://maps.apple.com/?daddr=${GATE}&q=East%20Fork%20Gate`;

const LABELS: MapLabel[] = [
  { key: 'main', text: 'Main entrance: keep going', tone: 'ivory', at: DIRECTIONS.places.mainEntrance },
  // The Dollar General and the turn are a tenth of a mile apart: one pin, one label.
  { key: 'dg', text: 'Dollar General · right on East Fork Rd', tone: 'brass', at: DIRECTIONS.places.eastForkTurn },
  { key: 'gate', text: 'East Fork Gate', tone: 'pink', at: DIRECTIONS.places.gate },
  { key: 'club', text: 'Clubhouse & parking', tone: 'brass', at: DIRECTIONS.places.clubhouse },
];

const STEPS = [
  { title: 'US 276 South', body: 'From Brevard, take Greenville Highway (US 276) south about 7 miles. Pass Connestee Falls’ main entrance and keep going.' },
  { title: 'Right on East Fork Road', body: 'Just past the Dollar General, turn right onto East Fork Road.' },
  { title: 'Right through the East Fork Gate', body: 'In about a quarter mile, turn right through the gate. A security guard will be there to welcome Gala guests.' },
  { title: 'Follow the yellow line', body: 'Stay on the yellow line 1.4 miles to the Clubhouse, 98 Overlook Clubhouse Dr.' },
  { title: 'Park', body: 'Park anywhere. The closest spaces are right behind the wellness center, and the golf parking is open in the evening.' },
];

function siteReducesMotion() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('reduce-motion');
}

// The flat stand-in: the same route, top-down, in SVG.
function FlatMap() {
  const { bbox } = DIRECTIONS;
  const w = 400;
  const h = (w * (bbox.north - bbox.south) * 110_540) / ((bbox.east - bbox.west) * 111_320 * Math.cos((35.15 * Math.PI) / 180));
  const pt = ([lon, lat]: number[]) => `${(((lon - bbox.west) / (bbox.east - bbox.west)) * w).toFixed(1)},${(((bbox.north - lat) / (bbox.north - bbox.south)) * h).toFixed(1)}`;
  return (
    <svg className="gala-dirmap-flat" viewBox={`0 0 ${w} ${h.toFixed(0)}`} aria-hidden="true">
      <polyline points={DIRECTIONS.approach.map(pt).join(' ')} className="is-approach" />
      <polyline points={DIRECTIONS.drive.map(pt).join(' ')} className="is-drive" />
      {LABELS.map((label) => {
        const [x, y] = pt(label.at).split(',').map(Number);
        return <circle key={label.key} cx={x} cy={y} r={label.tone === 'pink' ? 6 : 4.5} className={`is-${label.tone}`} />;
      })}
    </svg>
  );
}

export function GalaDirections() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const layer = labelsRef.current;
    if (!section || !canvas || !layer) return;
    let handle: { dispose: () => void } | null = null;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        import('./scene').then(({ createDirectionsScene }) => {
          if (cancelled) return;
          handle = createDirectionsScene(canvas, layer, DIRECTIONS, LABELS, Boolean(prefersReduced) || siteReducesMotion());
          if (handle) setReady(true);
        });
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(section);
    return () => {
      cancelled = true;
      io.disconnect();
      handle?.dispose();
    };
  }, [prefersReduced]);

  const reveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section id="getting-there" ref={sectionRef} className="gala-directions" aria-labelledby="directions-title">
      <div className="gala-shell gala-directions-grid">
        <figure className={`gala-dirmap${ready ? ' is-ready' : ''}`}>
          <FlatMap />
          <canvas ref={canvasRef} className="gala-dirmap-canvas" aria-hidden="true" />
          <div ref={labelsRef} className="gala-dirmap-labels" aria-hidden="true" />
          <figcaption className="gala-dirmap-credit">
            The route from the Dollar General on US 276 to the Clubhouse, by the East Fork Gate. Map data ©{' '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
              OpenStreetMap contributors
            </a>
            .
          </figcaption>
        </figure>

        <div className="gala-directions-copy">
          <motion.div className="gala-section-head" {...reveal}>
            <h2 id="directions-title">
              Getting there: <em>the East Fork Gate.</em>
            </h2>
            <p>
              Please come in by the East Fork Gate, not the main entrance. A guard will be there for
              Gala guests.
            </p>
          </motion.div>
          <ol className="gala-directions-steps">
            {STEPS.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </li>
            ))}
          </ol>
          <p className="gala-directions-links">
            <a className="gala-button gala-button-gold" href={GOOGLE} target="_blank" rel="noopener noreferrer">
              Google Maps<span className="sr-only"> directions to the East Fork Gate (opens in a new tab)</span>
            </a>
            <a className="gala-button gala-button-ghost" href={APPLE} target="_blank" rel="noopener noreferrer">
              Apple Maps<span className="sr-only"> directions to the East Fork Gate (opens in a new tab)</span>
            </a>
          </p>
          <p className="gala-directions-address">Connestee Falls Clubhouse · 98 Overlook Clubhouse Dr, Brevard, NC 28712</p>
        </div>
      </div>
    </section>
  );
}
