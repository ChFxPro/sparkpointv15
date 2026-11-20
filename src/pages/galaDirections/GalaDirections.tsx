// "Getting there" (#getting-there): the drive from the Dollar General on US 276 to
// the Clubhouse parking by the East Fork Gate, as the venue asked (Oct 26 planning
// meeting; Jeff confirmed the Dollar General comes before the turn, 2026-11-20).
//
// The map looks like the navigation app guests use every day, already run (Jeff,
// 2026-11-20): north up, night mode, a turn banner at the top, a trip bar at the
// foot, and a car that drives the route once when the map comes into view, with
// pause and replay. The written steps beside it are the real content; the map is
// a picture of them. The 3D map (scene.ts, three.js) loads only when this section
// nears the screen; a flat drawing of the same route stands in until then, or if
// WebGL isn't available. Under reduced motion (OS or the site's toggle) nothing
// plays by itself; the play button still runs it on request.

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import data from '../../data/galaDirections.json';
import type { GalaDirectionsData } from './types';
import type { NavState, SceneHandle, SceneLabel } from './scene';

const DIRECTIONS = data as unknown as GalaDirectionsData;
const GATE = `${DIRECTIONS.places.gate[1]},${DIRECTIONS.places.gate[0]}`;
const GOOGLE = `https://www.google.com/maps/dir/?api=1&destination=${GATE}`;
const APPLE = `https://maps.apple.com/?daddr=${GATE}&q=East%20Fork%20Gate`;

const mid = (a: number[], b: number[]): [number, number] => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const along = (line: number[][], t: number) => line[Math.min(line.length - 1, Math.floor(line.length * t))] as [number, number];

const LABELS: SceneLabel[] = [
  { text: '276', kind: 'shield', at: along(DIRECTIONS.approach, 0.45) },
  { text: 'Main entrance', kind: 'quiet', at: DIRECTIONS.places.mainEntrance },
  { text: 'Dollar General', kind: 'poi', at: DIRECTIONS.places.dollarGeneral },
  { text: 'East Fork Rd', kind: 'road', at: mid(DIRECTIONS.places.eastForkTurn, DIRECTIONS.places.gate) },
  { text: 'East Fork Gate', kind: 'gate', at: DIRECTIONS.places.gate },
  { text: 'Connestee Trl', kind: 'road', at: along(DIRECTIONS.drive, 0.62) },
  { text: 'Ticoa Lake', kind: 'quiet', at: [-82.736, 35.1527] },
  { text: 'Clubhouse · Parking', kind: 'destination', at: DIRECTIONS.places.clubhouse },
];

// The turn banner, one per maneuver (the scene reports which one is next).
const MANEUVERS = [
  { icon: 'right', text: 'Turn right onto East Fork Rd', sub: 'Just past the Dollar General' },
  { icon: 'right', text: 'Turn right at the East Fork Gate', sub: 'A security guard will welcome Gala guests' },
  { icon: 'flag', text: 'Connestee Falls Clubhouse', sub: 'Follow the yellow line on Connestee Trail' },
  { icon: 'park', text: 'You’ve arrived', sub: 'Park behind the wellness center, or in the golf parking' },
] as const;

const STEPS = [
  { title: 'US 276 South', body: 'From Brevard, take Greenville Highway (US 276) south about 7 miles. Pass Connestee Falls’ main entrance and keep going.' },
  { title: 'Right on East Fork Road', body: 'Just past the Dollar General, turn right onto East Fork Road.' },
  { title: 'Right through the East Fork Gate', body: 'In about a quarter mile, turn right through the gate. A security guard will be there to welcome Gala guests.' },
  { title: 'Follow the yellow line', body: 'Stay on the yellow line 1.4 miles to the Clubhouse, 98 Overlook Clubhouse Dr.' },
  { title: 'Park', body: 'Park anywhere. The closest spaces are right behind the wellness center, and the golf parking is open in the evening.' },
];

// Nav-style distances: feet under a tenth of a mile.
function navDistance(miles: number) {
  if (miles < 0.095) return `${Math.max(50, Math.round((miles * 5280) / 50) * 50)} ft`;
  return `${miles.toFixed(1)} mi`;
}

function ManeuverIcon({ icon }: { icon: (typeof MANEUVERS)[number]['icon'] }) {
  if (icon === 'flag')
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M9 28V5M9 6h14l-3 5 3 5H9" />
      </svg>
    );
  if (icon === 'park')
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="5" width="22" height="22" rx="4" />
        <path d="M13 23V10h5a4 4 0 0 1 0 8h-5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M10 28V16a5 5 0 0 1 5-5h10M20 6l5 5-5 5" />
    </svg>
  );
}

function siteReducesMotion() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('reduce-motion');
}

// The flat stand-in: the same route, top-down and north up, in SVG.
function FlatMap() {
  const { bbox } = DIRECTIONS;
  const w = 400;
  const h = (w * (bbox.north - bbox.south) * 110_540) / ((bbox.east - bbox.west) * 111_320 * Math.cos((35.15 * Math.PI) / 180));
  const pt = ([lon, lat]: number[]) => `${(((lon - bbox.west) / (bbox.east - bbox.west)) * w).toFixed(1)},${(((bbox.north - lat) / (bbox.north - bbox.south)) * h).toFixed(1)}`;
  return (
    <svg className="gala-nav-flat" viewBox={`0 0 ${w} ${h.toFixed(0)}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <polyline points={DIRECTIONS.approach.map(pt).join(' ')} className="is-road" />
      <polyline points={DIRECTIONS.drive.map(pt).join(' ')} className="is-casing" />
      <polyline points={DIRECTIONS.drive.map(pt).join(' ')} className="is-drive" />
    </svg>
  );
}

export function GalaDirections() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<SceneHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [nav, setNav] = useState<NavState>({
    progress: 0,
    step: 0,
    toNext: DIRECTIONS.miles.toGate,
    left: DIRECTIONS.miles.toGate + DIRECTIONS.miles.gateToClubhouse,
    playing: false,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!section || !canvas || !overlay) return;
    let cancelled = false;
    let lastReport = 0;
    let start: IntersectionObserver | null = null;
    const reduce = Boolean(prefersReduced) || siteReducesMotion();
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        import('./scene').then(({ createDirectionsScene }) => {
          if (cancelled) return;
          const handle = createDirectionsScene(canvas, overlay, DIRECTIONS, LABELS, {
            reduceMotion: reduce,
            onUpdate: (state) => {
              // About ten updates a second is plenty for the banner.
              const now = performance.now();
              if (state.playing && now - lastReport < 100) return;
              lastReport = now;
              setNav(state);
            },
          });
          if (!handle) return;
          handleRef.current = handle;
          setReady(true);
          // Run it once by itself when it first comes into view, unless motion is reduced.
          if (!reduce) {
            start = new IntersectionObserver(
              (seen) => {
                if (!seen.some((entry) => entry.intersectionRatio >= 0.5)) return;
                start?.disconnect();
                handle.play();
              },
              { threshold: [0.5] },
            );
            start.observe(canvas);
          }
        });
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(section);
    return () => {
      cancelled = true;
      io.disconnect();
      start?.disconnect();
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [prefersReduced]);

  const maneuver = MANEUVERS[Math.min(nav.step, MANEUVERS.length - 1)];
  const arrived = nav.step >= 3;
  const minutes = Math.max(1, Math.round((nav.left / 22) * 60));
  const done = nav.progress >= 0.999 && !nav.playing;

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
        <figure className={`gala-nav${ready ? ' is-ready' : ''}`}>
          <FlatMap />
          <canvas ref={canvasRef} className="gala-nav-canvas" aria-hidden="true" />
          <div ref={overlayRef} className="gala-nav-overlay" aria-hidden="true" />

          {/* The turn banner, as in a nav app. */}
          <div className="gala-nav-banner" aria-hidden="true">
            <span className="gala-nav-banner-icon">
              <ManeuverIcon icon={maneuver.icon} />
            </span>
            <span className="gala-nav-banner-text">
              {arrived ? null : <b>{navDistance(nav.toNext)}</b>}
              <strong>{maneuver.text}</strong>
              <small>{maneuver.sub}</small>
            </span>
          </div>

          <span className="gala-nav-compass" aria-hidden="true">
            N
          </span>

          {/* The trip bar, with the controls. */}
          <div className="gala-nav-trip">
            <span className="gala-nav-trip-figures" aria-hidden="true">
              {arrived ? (
                <strong>Arrived</strong>
              ) : (
                <>
                  <strong>{minutes} min</strong>
                  <span>{nav.left.toFixed(1)} mi · Connestee Falls Clubhouse</span>
                </>
              )}
            </span>
            {ready ? (
              <span className="gala-nav-controls">
                {nav.playing ? (
                  <button type="button" onClick={() => handleRef.current?.pause()} aria-label="Pause the drive">
                    <Pause aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRef.current?.play()}
                    aria-label={nav.progress > 0 && !done ? 'Resume the drive' : 'Play the drive'}
                  >
                    <Play aria-hidden="true" />
                  </button>
                )}
                <button type="button" onClick={() => handleRef.current?.replay()} aria-label="Replay the drive from the Dollar General">
                  <RotateCcw aria-hidden="true" />
                </button>
              </span>
            ) : null}
          </div>

          <figcaption className="gala-nav-credit">
            Map ©{' '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
              OpenStreetMap
            </a>
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
