import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Sparkmark } from '../components/Sparkmark';
import { GALA_TICKETS_URL, GALA_TICKET_PRICE, GALA_TICKET_PRICE_LABEL, GALA_VENUE } from '../data/events';

// The closing call to action, styled as a first-class boarding pass. On a
// mouse or trackpad the pass tilts toward the pointer with a moving foil
// sheen; a small plane flies the route once the pass scrolls into view. Both
// are skipped under reduced motion, and the tilt is skipped on touch screens.

const ROUTE = 'M6 34 Q90 -6 174 34';

// Lucide's "plane" outline, which points up and to the right.
const PLANE =
  'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z';

const FIELDS = [
  ['Passenger', 'You'],
  ['Flight', 'SPK 1211'],
  ['Date', '11 Dec 2026'],
  ['Boarding', '6:00 p.m.'],
  ['Fare', `$${GALA_TICKET_PRICE}`],
  ['Seat', 'Yours'],
  ['Class', 'First'],
  ['Zone', 'Everyone'],
];

// A real PDF417 code (the format printed on paper boarding passes) that
// encodes https://yoursparkpoint.org/events/sparkpoint-gala, so it scans.
// Generated once with bwip-js; regenerate it if the page URL changes.
const BARCODE = `${import.meta.env.BASE_URL}assets/events/gala/pass-pdf417.svg`;

export function GalaBoardingPass() {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    setCanTilt(!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, [reduceMotion]);

  useEffect(() => {
    const node = wrapRef.current;
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
    style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
    style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    const style = event.currentTarget.style;
    for (const name of ['--ry', '--rx']) style.setProperty(name, '0deg');
    style.setProperty('--mx', '50%');
    style.setProperty('--my', '0%');
  };

  return (
    <div
      ref={wrapRef}
      className={canTilt ? 'gala-pass-wrap can-tilt' : 'gala-pass-wrap'}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ '--rx': '0deg', '--ry': '0deg', '--mx': '50%', '--my': '0%' } as CSSProperties}
    >
      <div className="gala-pass">
        <div className="gala-pass-main">
          <header className="gala-pass-band">
            <span className="gala-pass-brand">
              <Sparkmark size="26px" />
              Atlas of Wonders
            </span>
            <span className="gala-pass-class">
              <small>Boarding pass</small>
              <b>First class</b>
            </span>
          </header>

          <div className="gala-pass-body">
            <Sparkmark variant="ink" size="260px" className="gala-pass-watermark" />

            <div className="gala-pass-route">
              <div>
                <small>From</small>
                <strong>TCN</strong>
                <span>
                  Transylvania County, <span className="gala-pass-long">North Carolina</span>
                  <span className="gala-pass-short">NC</span>
                </span>
              </div>
              <svg viewBox="0 0 180 40" aria-hidden="true">
                <path className="gala-pass-arc" d={ROUTE} />
                <circle cx="6" cy="34" r="3" />
                <circle cx="174" cy="34" r="3" />
                {inView && !reduceMotion ? (
                  <g>
                    <g transform="rotate(45) scale(0.62) translate(-12 -12)">
                      <path className="gala-pass-plane" d={PLANE} />
                    </g>
                    <animateMotion dur="3.6s" begin="0.3s" fill="freeze" rotate="auto" path={ROUTE} keyPoints="0;0.88" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
                  </g>
                ) : (
                  <g transform="translate(90 14) rotate(45) scale(0.62) translate(-12 -12)">
                    <path className="gala-pass-plane" d={PLANE} />
                  </g>
                )}
              </svg>
              <div>
                <small>To</small>
                <strong>ANY</strong>
                <span>
                  Anywhere<span className="gala-pass-long"> in the world</span>
                </span>
              </div>
            </div>

            <dl className="gala-pass-fields">
              {FIELDS.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <p className="gala-pass-note" aria-hidden="true">
              Gate: {GALA_VENUE.name} · {GALA_VENUE.street}, {GALA_VENUE.city}, {GALA_VENUE.region}
            </p>
          </div>
          <span className="gala-pass-foil" aria-hidden="true" />
        </div>

        <div className="gala-pass-stub">
          <header className="gala-pass-band gala-pass-band-stub">
            <span>SPK 1211</span>
            <span>Seat: Yours</span>
          </header>
          <div className="gala-pass-stub-body">
            <p className="gala-pass-stub-route" aria-hidden="true">
              <b>TCN</b>
              <span />
              <b>ANY</b>
            </p>
            {GALA_TICKETS_URL ? (
              <>
                <p>{GALA_TICKET_PRICE_LABEL}. Destinations revealed before boarding.</p>
                <a
                  className="gala-button gala-button-gold"
                  href={GALA_TICKETS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get tickets <ArrowRight aria-hidden="true" />
                </a>
              </>
            ) : (
              <>
                <p>Tickets are {GALA_TICKET_PRICE_LABEL}. Be first to know when they go on sale.</p>
                <Link className="gala-button gala-button-gold" to="/newsletter">
                  Get boarding updates <ArrowRight aria-hidden="true" />
                </Link>
              </>
            )}
            <figure className="gala-pass-code">
              <img src={BARCODE} alt="" loading="lazy" />
              <figcaption>Scan to open this page</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}
