import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { frame, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { Link } from 'react-router';
import { Sparkmark } from '../components/Sparkmark';
import { useTripLoungeEnv } from './galaTrips/useTripLoungeEnv';

const BASE = import.meta.env.BASE_URL;
const postcardImage = `${BASE}assets/events/gala/hub-winter-postcard.webp`;

// USPS POSTNET for 28712, SparkPoint's mailing ZIP: a frame
// bar, five bars per digit (two tall, three short), a check digit, and a
// closing frame bar. 1 = tall bar.
const POSTNET_DIGITS: Record<string, string> = {
  '0': '11000', '1': '00011', '2': '00101', '3': '00110', '4': '01001',
  '5': '01010', '6': '01100', '7': '10001', '8': '10010', '9': '10100',
};

function postnet(zip: string) {
  const sum = [...zip].reduce((total, digit) => total + Number(digit), 0);
  const check = String((10 - (sum % 10)) % 10);
  return `1${[...zip, check].map((digit) => POSTNET_DIGITS[digit]).join('')}1`;
}

const ZIP_BARS = postnet('28712');

// The handwriting. The message, signature and address are real text at all
// times (screen readers and search read them whole); only each word's opacity
// follows `--write` (0 → 1) on the card, so the words appear in order as if
// being written. With no `--write` set (reduced motion) every word is shown.
const MESSAGE_A =
  'Every great trip ends with coming home. A portion of every trip chosen at the Gala, from Santorini to Skagway, comes back to SparkPoint, helping bring the';
const MESSAGE_LINK = 'Transylvania Resilience Hub';
const MESSAGE_B = 'to life: one roof where people, organizations, and services come together.';
const SIGN_A = 'With love from home,';
const SIGN_B = 'SparkPoint';
const ADDRESS = ['Home', 'Transylvania County', 'North Carolina'];

const words = (text: string) => text.split(/\s+/).filter(Boolean);
const PIECES = [MESSAGE_A, MESSAGE_LINK, MESSAGE_B, SIGN_A, SIGN_B, ...ADDRESS];
const WORD_COUNT = PIECES.reduce((total, piece) => total + words(piece).length, 0);
// Where each piece's first word falls in the whole hand-written sequence.
const START = PIECES.reduce<number[]>((starts, piece, index) => {
  starts.push(index === 0 ? 0 : starts[index - 1] + words(PIECES[index - 1]).length);
  return starts;
}, []);

function Handwritten({ text, piece }: { text: string; piece: number }) {
  const list = words(text);
  return (
    <>
      {list.map((word, index) => (
        <span key={index}>
          <span className="gala-w" style={{ '--at': (START[piece] + index) / WORD_COUNT } as CSSProperties}>
            {word}
          </span>
          {index < list.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  );
}

export function GalaPostcard({ style }: { style?: Record<string, MotionValue<number>> }) {
  return (
    <motion.article className="gala-postcard" style={{ '--n': WORD_COUNT, ...style } as never}>
      <span className="gala-postcard-sheen" aria-hidden="true" />
      <span className="gala-tape gala-tape-left" aria-hidden="true" />
      <span className="gala-tape gala-tape-right" aria-hidden="true" />

      <figure className="gala-postcard-front">
        <div className="gala-postcard-print">
          <img
            src={postcardImage}
            alt="Concept rendering of the Transylvania Resilience Hub in winter: a brick building with a glowing SparkPoint sign, lit windows, and snow on the ground."
            loading="lazy"
          />
          <figcaption>
            <span className="gala-postcard-greet">Greetings from</span>
            <strong className="gala-postcard-big" data-text="Home">Home</strong>
            <span className="gala-postcard-place">Transylvania County · North Carolina</span>
          </figcaption>
        </div>
        <small className="gala-postcard-credit">Transylvania Resilience Hub · concept rendering</small>
      </figure>

      <div className="gala-postcard-back">
        <header className="gala-postcard-head" aria-hidden="true">
          <span>Post card</span>
          <Sparkmark variant="ink" size="16px" />
          <span>Carte postale</span>
        </header>

        <div className="gala-postcard-grid">
          <div className="gala-postcard-message">
            <p>
              <Handwritten text={MESSAGE_A} piece={0} />{' '}
              <Link to="/resilience-hub">
                <Handwritten text={MESSAGE_LINK} piece={1} />
              </Link>{' '}
              <Handwritten text={MESSAGE_B} piece={2} />
            </p>
            <p className="gala-postcard-sign">
              <span className="gala-postcard-sign-line">
                <Handwritten text={SIGN_A} piece={3} />
              </span>
              <span>
                <Handwritten text={SIGN_B} piece={4} /> <Sparkmark size="1em" />
              </span>
            </p>
          </div>

          <span className="gala-postcard-divider" aria-hidden="true">
            A World of Connections · Travel that gives back · Transylvania County, NC
          </span>

          <div className="gala-postcard-address">
            <div className="gala-postcard-postage" aria-hidden="true">
              <svg className="gala-postcard-postmark" viewBox="0 0 170 80">
                <g className="gala-postcard-waves">
                  {[18, 28, 38, 48, 58].map((y) => (
                    <path key={y} d={`M0 ${y} q 9 -5 18 0 t 18 0 t 18 0 t 18 0 t 18 0`} />
                  ))}
                </g>
                <defs>
                  <path id="gala-postmark-ring" d="M124 38 m-27 0 a27 27 0 1 1 54 0 a27 27 0 1 1 -54 0" />
                </defs>
                <circle cx="124" cy="38" r="33" />
                <circle cx="124" cy="38" r="20" />
                <text className="is-ring">
                  <textPath href="#gala-postmark-ring" startOffset="25%">TRANSYLVANIA CO · NC ·</textPath>
                </text>
                <text x="124" y="37" className="is-date">DEC 11</text>
                <text x="124" y="47">2026</text>
              </svg>
              <div className="gala-postcard-stamp">
                <div>
                  <Sparkmark size="30px" />
                  <b>SparkPoint</b>
                  <small>Gives back</small>
                </div>
              </div>
            </div>

            <p className="gala-postcard-to">
              <span className="gala-postcard-to-label">To:</span> <Handwritten text={ADDRESS[0]} piece={5} />
              <br />
              <Handwritten text={ADDRESS[1]} piece={6} />
              <br />
              <Handwritten text={ADDRESS[2]} piece={7} />
            </p>
            <svg
              className="gala-postcard-zip"
              viewBox={`0 0 ${ZIP_BARS.length * 4} 12`}
              aria-hidden="true"
            >
              {[...ZIP_BARS].map((bar, index) => (
                <rect key={index} x={index * 4} y={bar === '1' ? 0 : 7} width="1.8" height={bar === '1' ? 12 : 5} />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </motion.article>
  );
}


// "The return trip", told with scroll (Jeff, 2026-11-12: all five ideas).
// A tall track with a sticky stage set as a writing desk: trip photos and a cup
// of coffee drift past at their own speeds, and a fountain pen lies on the desk.
// As the visitor scrolls:
//   1. the postcard slides onto the desk, in perspective (CSS 3D, so the card
//      stays real text; a light sheen crosses it as it turns);
//   2. on narrow screens, where the card is one column, it turns over;
//   3. the pen picks itself up and writes the message and address, word by
//      word, its nib following the word being written;
//   4. the stamp comes down from above and lands with a thud (the card jumps,
//      the ink blooms), then the postmark rolls across it;
//   5. the card lifts and flies home along a dashed airmail route to a pin
//      marked Home, Transylvania County.
// Under reduced motion (the OS setting or the site's toggle) none of this runs:
// the card sits still and fully written, with no desk.
//
// Progress through the track (0 → 1):
const T = {
  slideIn: [0, 0.12],
  flip: [0.12, 0.21], // narrow screens only (CSS)
  pickUp: [0.21, 0.26],
  write: [0.26, 0.58],
  putDown: [0.58, 0.62],
  stamp: [0.63, 0.69],
  cancel: [0.7, 0.76],
  send: [0.8, 0.97],
  arrive: [0.92, 1],
} as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (v: number, [a, b]: readonly [number, number]) => clamp01((v - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Piecewise-linear through keyframes. */
function keys(t: number, at: number[], values: number[]) {
  if (t <= at[0]) return values[0];
  for (let i = 1; i < at.length; i++) {
    if (t <= at[i]) return lerp(values[i - 1], values[i], ease((t - at[i - 1]) / (at[i] - at[i - 1])));
  }
  return values[values.length - 1];
}

interface Geometry {
  w: number;
  h: number;
  /** The card's resting centre in the stage, untransformed. */
  cx: number;
  cy: number;
  /** Where the pen lies on the desk (nib point). */
  restX: number;
  restY: number;
  /** The Home pin. */
  pinX: number;
  pinY: number;
}

const BLANK: Geometry = { w: 0, h: 0, cx: 0, cy: 0, restX: 0, restY: 0, pinX: 0, pinY: 0 };

const DESK_PHOTOS = [
  { id: 'greece', file: 'greece-01-santorini-oia', place: 'Santorini', tilt: -9, drift: [60, -70], className: 'is-a' },
  { id: 'iceland', file: 'iceland-01-gullfoss', place: 'Gullfoss', tilt: 7, drift: [90, -90], className: 'is-b' },
  { id: 'cortona', file: 'cortona-01-cortona-hilltop', place: 'Cortona', tilt: 6, drift: [40, -60], className: 'is-c' },
] as const;

function FountainPen() {
  // Drawn upright with the nib at the bottom centre (the element's transform origin).
  return (
    <svg viewBox="0 0 28 230" aria-hidden="true">
      <defs>
        <linearGradient id="gala-pen-body" x1="0" x2="1">
          <stop offset="0" stopColor="#0d1526" />
          <stop offset="0.38" stopColor="#2a3a5c" />
          <stop offset="0.55" stopColor="#14213a" />
          <stop offset="1" stopColor="#070b14" />
        </linearGradient>
        <linearGradient id="gala-pen-brass" x1="0" x2="1">
          <stop offset="0" stopColor="#8c6a2e" />
          <stop offset="0.45" stopColor="#f1d9a0" />
          <stop offset="1" stopColor="#8c6a2e" />
        </linearGradient>
      </defs>
      {/* cap end and barrel */}
      <rect x="6" y="0" width="16" height="12" rx="8" fill="url(#gala-pen-body)" />
      <rect x="5" y="8" width="18" height="140" rx="5" fill="url(#gala-pen-body)" />
      <rect x="5" y="26" width="18" height="4" fill="url(#gala-pen-brass)" />
      <rect x="5" y="140" width="18" height="6" fill="url(#gala-pen-brass)" />
      {/* clip */}
      <rect x="20" y="12" width="3" height="58" rx="1.5" fill="url(#gala-pen-brass)" />
      {/* grip */}
      <path d="M6 146 L22 146 L19 192 L9 192 Z" fill="url(#gala-pen-body)" />
      {/* nib */}
      <path d="M9 192 L19 192 L14.6 229 L13.4 229 Z" fill="url(#gala-pen-brass)" />
      <path d="M14 200 L14 228" stroke="#5a4520" strokeWidth="0.7" />
      <circle cx="14" cy="203" r="1.4" fill="#5a4520" />
    </svg>
  );
}

function CoffeeCup() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id="gala-coffee" cx="0.42" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#6b4325" />
          <stop offset="0.7" stopColor="#3a2414" />
          <stop offset="1" stopColor="#24160c" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="#f4ede0" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="#d9b56a" strokeWidth="2" opacity="0.7" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#e5dccb" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="58" fill="#fbf7ef" />
      <circle cx="100" cy="100" r="50" fill="url(#gala-coffee)" />
      <ellipse cx="86" cy="86" rx="14" ry="7" fill="#fff" opacity="0.18" transform="rotate(-30 86 86)" />
      <path d="M156 92 q24 0 24 18 q0 18 -24 18" fill="none" stroke="#f4ede0" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

export function GalaPostcardJourney({ children }: { children?: ReactNode }) {
  const { motion: animate } = useTripLoungeEnv();
  const track = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const geo = useRef<Geometry>(BLANK);
  const [size, setSize] = useState({ w: 0, h: 0, pinX: 0, pinY: 0, cx: 0, cy: 0, narrow: false });
  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] });

  // Measure the stage and the card's resting place (untransformed offsets).
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const cx = scene.offsetLeft + scene.offsetWidth / 2;
    const cy = scene.offsetTop + scene.offsetHeight / 2;
    const narrow = w < 1021;
    const right = scene.offsetLeft + scene.offsetWidth;
    geo.current = {
      w,
      h,
      cx,
      cy,
      restX: narrow ? Math.min(w - 40, right - 30) : Math.min(w - 70, right + 46),
      restY: scene.offsetTop + scene.offsetHeight * (narrow ? 0.9 : 0.78),
      pinX: w * (narrow ? 0.82 : 0.84),
      pinY: h * (narrow ? 0.17 : 0.22),
    };
    setSize({ w, h, pinX: geo.current.pinX, pinY: geo.current.pinY, cx, cy, narrow });
  }, []);

  useEffect(() => {
    if (!animate) return undefined;
    measure();
    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    if (sceneRef.current) observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, [animate, measure]);

  // The card: slides in (in perspective), holds, then flies home along an arc.
  const x = useTransform(p, (v) => {
    const g = geo.current;
    const dx = g.pinX - g.cx;
    if (v < T.send[0]) return keys(v, [T.slideIn[0], T.slideIn[1]], [-g.w * 1.05, 0]);
    return keys(span(v, T.send), [0, 0.18, 0.6, 1], [0, -g.w * 0.02, dx * 0.62, dx]);
  });
  const y = useTransform(p, (v) => {
    const g = geo.current;
    const dy = g.pinY - g.cy;
    if (v < T.send[0]) return keys(v, [T.slideIn[0], T.slideIn[1]], [g.h * 0.12, 0]);
    return keys(span(v, T.send), [0, 0.18, 0.6, 1], [0, 8, dy * 1.05, dy]);
  });
  const scale = useTransform(p, (v) =>
    v < T.send[0] ? 1 : keys(span(v, T.send), [0, 0.18, 0.6, 1], [1, 1.04, 0.36, 0.04])
  );
  const rotate = useTransform(p, (v) =>
    v < T.send[0]
      ? keys(v, [T.slideIn[0], T.slideIn[1]], [-16, 0])
      : keys(span(v, T.send), [0, 0.18, 0.6, 1], [0, -3, 12, 26])
  );
  const rotateX = useTransform(p, (v) =>
    v < T.send[0] ? keys(v, [T.slideIn[0], T.slideIn[1], T.write[0]], [24, 8, 5]) : keys(span(v, T.send), [0, 0.3], [5, 0])
  );
  const rotateY = useTransform(p, (v) => keys(v, [T.slideIn[0], T.slideIn[1]], [-28, 0]));
  const opacity = useTransform(p, (v) => 1 - span(v, [T.send[1] - 0.02, T.send[1]]));

  // CSS variables on the card.
  const flip = useTransform(p, (v) => span(v, T.flip));
  const write = useTransform(p, (v) => span(v, T.write));
  const stamp = useTransform(p, (v) => span(v, T.stamp));
  const thud = useTransform(p, (v) => keys(v, [T.stamp[1] - 0.004, T.stamp[1], T.stamp[1] + 0.012], [0, 1, 0]));
  const cancel = useTransform(p, (v) => span(v, T.cancel));
  const lift = useTransform(p, (v) => keys(span(v, T.send), [0, 0.2], [0, 1]));
  const sheen = useTransform(p, (v) => keys(v, [T.slideIn[0], T.slideIn[1], T.flip[1], T.send[0], T.send[0] + 0.06], [0, 0.55, 1, 1, 0]));

  // The pen: lies on the desk, picks up to write, follows the word being
  // written, and is put down again.
  const penX = useMotionValue(0);
  const penY = useMotionValue(0);
  const penTilt = useMotionValue(0);
  const penLift = useMotionValue(0);
  const words = useRef<HTMLElement[]>([]);
  const placePen = useCallback(
    (v: number) => {
      const stage = stageRef.current;
      const g = geo.current;
      if (!stage || !g.w) return;
      if (!words.current.length) {
        words.current = Array.from(stage.querySelectorAll<HTMLElement>('.gala-postcard-back .gala-w'));
      }
      const list = words.current;
      if (!list.length) return;
      const sr = stage.getBoundingClientRect();
      const at = (el: HTMLElement, f: number) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - sr.left + r.width * f, y: r.bottom - sr.top - r.height * 0.22 };
      };
      let px = g.restX;
      let py = g.restY;
      let tilt = 0;
      let liftAmount = 0;
      if (v >= T.pickUp[0] && v < T.write[0]) {
        const first = at(list[0], 0);
        const t = ease(span(v, T.pickUp));
        px = lerp(g.restX, first.x, t);
        py = lerp(g.restY, first.y, t);
        liftAmount = Math.sin(t * Math.PI) * 0.9 + t * 0.1;
      } else if (v >= T.write[0] && v <= T.write[1]) {
        const i = span(v, T.write) * list.length;
        const k = Math.min(list.length - 1, Math.floor(i));
        const point = at(list[k], i - k);
        px = point.x;
        py = point.y + Math.sin(i * Math.PI * 2) * 1.5;
        tilt = Math.sin(i * Math.PI) * 4;
        liftAmount = 0.1;
      } else if (v > T.write[1] && v < T.putDown[1]) {
        const last = at(list[list.length - 1], 1);
        const t = ease(span(v, T.putDown));
        px = lerp(last.x, g.restX, t);
        py = lerp(last.y, g.restY, t);
        liftAmount = Math.sin(t * Math.PI) * 0.9;
      }
      penX.set(px);
      penY.set(py);
      penTilt.set(tilt);
      penLift.set(liftAmount);
    },
    [penX, penY, penTilt, penLift]
  );
  // Measure after motion has drawn this frame's card, so the nib sits on the word as drawn.
  useMotionValueEvent(p, 'change', (v) => frame.postRender(() => placePen(v)));
  useEffect(() => {
    if (!animate) return;
    words.current = [];
    placePen(p.get());
  }, [animate, size, placePen, p]);
  const penTransform = useTransform(
    [penX, penY, penTilt, penLift] as MotionValue<number>[],
    ([px, py, tilt, liftAmount]: number[]) =>
      `translate(${px - 14}px, ${py - 230 - liftAmount * 10}px) rotate(${34 + tilt}deg)`
  );
  const penShadow = useTransform(penLift, (l) => `drop-shadow(${6 + l * 14}px ${8 + l * 18}px ${4 + l * 8}px rgba(0, 0, 0, ${0.45 - l * 0.15}))`);

  // Desk: things drift at their own speeds.
  const driftA = useTransform(p, [0, 1], [DESK_PHOTOS[0].drift[0], DESK_PHOTOS[0].drift[1]]);
  const driftB = useTransform(p, [0, 1], [DESK_PHOTOS[1].drift[0], DESK_PHOTOS[1].drift[1]]);
  const driftC = useTransform(p, [0, 1], [DESK_PHOTOS[2].drift[0], DESK_PHOTOS[2].drift[1]]);
  const driftCup = useTransform(p, [0, 1], [30, -40]);
  const drifts = [driftA, driftB, driftC];

  // The airmail route home, drawn behind the card as it flies.
  const route = useTransform(p, (v) => keys(span(v, T.send), [0.15, 0.9], [0, 1]));
  const arrive = useTransform(p, (v) => span(v, T.arrive));
  const arriveScale = useTransform(arrive, [0, 1], [0.6, 1]);
  const { w, h, pinX, pinY, cx, cy, narrow } = size;
  // Phones: the pin's label reads to its left, so the route comes up into it from below.
  const routePath = narrow
    ? `M ${cx} ${cy} C ${lerp(cx, pinX, 0.2)} ${cy - h * 0.12}, ${pinX} ${pinY + h * 0.2}, ${pinX} ${pinY}`
    : `M ${cx} ${cy} C ${lerp(cx, pinX, 0.25)} ${cy - h * 0.06}, ${lerp(cx, pinX, 0.55)} ${pinY - h * 0.12}, ${pinX} ${pinY}`;

  if (!animate) {
    return (
      <div ref={track} className="gala-postcard-track">
        <div className="gala-postcard-stage">
          <div className="gala-postcard-scene">
            <GalaPostcard />
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={track} className="gala-postcard-track is-scroll">
      <div ref={stageRef} className="gala-postcard-stage">
        <div className="gala-desk" aria-hidden="true">
          {DESK_PHOTOS.map((photo, index) => (
            <motion.figure
              key={photo.id}
              className={`gala-desk-photo ${photo.className}`}
              style={{ y: drifts[index], rotate: photo.tilt }}
            >
              <img src={`${BASE}assets/events/gala/trips/${photo.file}-800.webp`} alt="" loading="lazy" decoding="async" />
              <figcaption>{photo.place}</figcaption>
            </motion.figure>
          ))}
          <motion.div className="gala-desk-cup" style={{ y: driftCup }}>
            <CoffeeCup />
          </motion.div>
          <span className="gala-desk-ring" />
        </div>

        {w ? (
          <svg className="gala-route" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
            <defs>
              <mask id="gala-route-mask" maskUnits="userSpaceOnUse">
                <motion.path d={routePath} stroke="#fff" strokeWidth="8" fill="none" style={{ pathLength: route }} />
              </mask>
            </defs>
            <path d={routePath} className="gala-route-line" mask="url(#gala-route-mask)" />
          </svg>
        ) : null}

        <motion.div ref={sceneRef} className="gala-postcard-scene" style={{ x, y, scale, rotate, rotateX, rotateY, opacity }}>
          <GalaPostcard
            style={{ '--flip': flip, '--write': write, '--stamp': stamp, '--thud': thud, '--cancel': cancel, '--lift': lift, '--sheen': sheen }}
          />
        </motion.div>

        <motion.div className="gala-pen" style={{ transform: penTransform, filter: penShadow }} aria-hidden="true">
          <FountainPen />
        </motion.div>

        {w ? (
          <motion.div
            className="gala-home-pin"
            style={{ left: pinX, top: pinY, opacity: arrive, scale: arriveScale }}
            aria-hidden="true"
          >
            <span className="gala-home-pin-dot" />
            <span className="gala-home-pin-label">
              <b>Home</b>
              <small>Transylvania County, NC</small>
              <em>
                Delivered <Sparkmark size="0.95em" />
              </em>
            </span>
          </motion.div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
