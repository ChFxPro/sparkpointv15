'use client';

import '@fontsource-variable/fraunces';
import './galaPromo.css';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useReducedMotion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Sparkmark } from './Sparkmark';
import { GALA_TICKETS_URL, GALA_TICKET_PRICE, GALA_VENUE } from '../data/events';

// Homepage promo for An Atlas of Wonders, the SparkPoint Gala (December 11,
// 2026), drawn as a first-class boarding pass to match the Gala page: a navy
// foil header, a window-seat view of the hero photo, the TCN → ANY route with a
// plane that flies it on scroll, the pass fields, a perforated tear line, and a
// stub with the button and the real PDF417 code. With a mouse it tilts toward the
// pointer under a foil sheen. It sits beside the Rural Health recap card and
// keeps its overall height flexible so the two cards stay equal.
export const GALA_PATH = '/events/sparkpoint-gala';

const ASSETS = `${import.meta.env.BASE_URL}assets/events/gala/`;
const ROUTE = 'M6 34 Q90 -6 174 34';
// Lucide's "plane" outline (points up-right).
const PLANE =
  'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z';

// The card retires once the evening is over; move this if a recap should run.
const PROMO_EXPIRES = new Date('2026-12-12T00:00:00-05:00');

export function isGalaPromoActive(now = new Date()) {
  return now < PROMO_EXPIRES;
}

const FIELDS = [
  ['Date', '11 Dec 2026'],
  ['Boarding', '6:00 p.m.'],
  ['Fare', `$${GALA_TICKET_PRICE}`],
  ['Seat', 'Yours'],
];

export function GalaPromoCard() {
  const reduceMotion = useReducedMotion();
  const passRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    setCanTilt(!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, [reduceMotion]);

  useEffect(() => {
    const node = passRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canTilt) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    const style = event.currentTarget.style;
    style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
    style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`);
    style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    const style = event.currentTarget.style;
    style.setProperty('--ry', '0deg');
    style.setProperty('--rx', '0deg');
    style.setProperty('--mx', '50%');
    style.setProperty('--my', '0%');
  };

  return (
    <div className="gpromo group">
      <div
        ref={passRef}
        className={canTilt ? 'gpromo-tilt can-tilt' : 'gpromo-tilt'}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ '--rx': '0deg', '--ry': '0deg', '--mx': '50%', '--my': '0%' } as CSSProperties}
      >
        <article className="gpromo-pass">
          <header className="gpromo-band">
            <h2 className="gpromo-brand">
              <Sparkmark size="24px" />
              An Atlas of Wonders
            </h2>
            <p className="gpromo-class">
              <small>Boarding pass</small>
              <b>First class</b>
            </p>
          </header>

          <div className="gpromo-main">
            <div className="gpromo-intro">
              <div className="gpromo-window" aria-hidden="true">
                <img src={`${ASSETS}hero-wing-800.webp`} alt="" width={800} height={533} loading="lazy" />
                <span className="gpromo-shade" />
              </div>
              <div>
                <p className="gpromo-kicker">The SparkPoint Gala · Live travel auction</p>
                <p className="gpromo-headline">
                  See the world. <em>Strengthen home.</em>
                </p>
                <p className="gpromo-lede">
                  Eight journeys up for bid, and a portion of every trip comes home to the
                  Transylvania Resilience Hub.
                </p>
              </div>
            </div>

            <div className="gpromo-route" aria-hidden="true">
              <div>
                <strong>TCN</strong>
                <span>Transylvania Co.</span>
              </div>
              <svg viewBox="0 0 180 40">
                <path className="gpromo-arc" d={ROUTE} />
                <circle cx="6" cy="34" r="3" />
                <circle cx="174" cy="34" r="3" />
                {inView && !reduceMotion ? (
                  <g>
                    <g transform="rotate(45) scale(0.62) translate(-12 -12)">
                      <path className="gpromo-plane" d={PLANE} />
                    </g>
                    <animateMotion dur="3.4s" begin="0.4s" fill="freeze" rotate="auto" path={ROUTE} keyPoints="0;0.88" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
                  </g>
                ) : (
                  <g transform="translate(90 14) rotate(45) scale(0.62) translate(-12 -12)">
                    <path className="gpromo-plane" d={PLANE} />
                  </g>
                )}
              </svg>
              <div>
                <strong>ANY</strong>
                <span>Anywhere</span>
              </div>
            </div>

            <dl className="gpromo-fields">
              {FIELDS.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="gpromo-stub">
            {GALA_TICKETS_URL ? (
              <a className="gpromo-button" href={GALA_TICKETS_URL} target="_blank" rel="noopener noreferrer">
                Get tickets · ${GALA_TICKET_PRICE} <ArrowRight size={18} aria-hidden="true" />
              </a>
            ) : (
              <Link className="gpromo-button" to={GALA_PATH}>
                Explore the gala <ArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
            <img className="gpromo-code" src={`${ASSETS}pass-pdf417.svg`} alt="" loading="lazy" />
            {GALA_TICKETS_URL ? (
              <p className="gpromo-note">
                {GALA_VENUE.name} · <Link to={GALA_PATH}>Explore the gala</Link>
              </p>
            ) : (
              <p className="gpromo-note">{GALA_VENUE.name} · Tickets on sale soon</p>
            )}
          </div>

          <span className="gpromo-foil" aria-hidden="true" />
        </article>
      </div>

      {/* Keepsake: a passport stamp inked across the corner. */}
      <svg className="gpromo-stamp" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id="gpromo-stamp-ring" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
        </defs>
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="28" />
        <text className="is-ring">
          <textPath href="#gpromo-stamp-ring" startOffset="22%">
            ATLAS OF WONDERS · ADMITTED ·
          </textPath>
        </text>
        <text x="50" y="49" className="is-day">DEC 11</text>
        <text x="50" y="62" className="is-year">2026</text>
      </svg>
    </div>
  );
}
