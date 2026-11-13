import { useCallback, useEffect, useRef, useState, type CSSProperties, type MutableRefObject, type ReactNode, type Ref } from 'react';
import { frame, motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { Link } from 'react-router';
import { Sparkmark } from '../components/Sparkmark';
import { useTripLoungeEnv } from './galaTrips/useTripLoungeEnv';
import { GalaPostcardCredits, WORLD_TRIPS, WorldFront } from './galaPostcard/WorldFront';

const BASE = import.meta.env.BASE_URL;
// The Hub on its own stamp, unused: the card strikes its own postmark.
const stampImage = `${BASE}assets/events/gala/stamps/chapter-return-postage-mint.webp`;

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
// The card is the guest's, sent home from their trip (Jeff, 2026-11-13): no
// named destination, and the Hub named as what this journey helps bring to life.
const GREETING = 'Dear Home,';
const MESSAGE_A =
  'The world is every bit as wonderful as they said. Still, every journey connects back to you, and this one is helping bring the';
const MESSAGE_LINK = 'Transylvania Resilience Hub';
const MESSAGE_B = 'to life.';
const SIGN_A = 'Wish you were here!';
const SIGN_B = 'A Gala traveler';
const ADDRESS = ['Home', 'Transylvania County', 'North Carolina'];

const words = (text: string) => text.split(/\s+/).filter(Boolean);
const PIECES = [GREETING, MESSAGE_A, MESSAGE_LINK, MESSAGE_B, SIGN_A, SIGN_B, ...ADDRESS];
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
          <WorldFront />
        </div>
        <figcaption className="gala-postcard-credit">
          {WORLD_TRIPS.map((trip) => trip.label).join(' · ')} · five of the Gala's eight trips
        </figcaption>
      </figure>

      <div className="gala-postcard-back">
        <header className="gala-postcard-head" aria-hidden="true">
          <span>Post card</span>
          <Sparkmark variant="ink" size="16px" />
          <span>Carte postale</span>
        </header>

        <div className="gala-postcard-grid">
          <div className="gala-postcard-message">
            <p className="gala-postcard-dear">
              <Handwritten text={GREETING} piece={0} />
            </p>
            <p>
              <Handwritten text={MESSAGE_A} piece={1} />{' '}
              <Link to="/resilience-hub">
                <Handwritten text={MESSAGE_LINK} piece={2} />
              </Link>{' '}
              <Handwritten text={MESSAGE_B} piece={3} />
            </p>
            <p className="gala-postcard-sign">
              <span className="gala-postcard-sign-line">
                <Handwritten text={SIGN_A} piece={4} />
              </span>
              <span>
                <Handwritten text={SIGN_B} piece={5} /> <Sparkmark size="0.8em" />
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
                  <textPath href="#gala-postmark-ring" startOffset="2%">A WORLD OF CONNECTIONS ·</textPath>
                </text>
                <text x="124" y="37" className="is-date">DEC 11</text>
                <text x="124" y="47">2026</text>
              </svg>
              <img className="gala-postcard-stamp" src={stampImage} alt="" loading="lazy" decoding="async" />
            </div>

            <p className="gala-postcard-to">
              <span className="gala-postcard-to-label">To:</span> <Handwritten text={ADDRESS[0]} piece={6} />
              <br />
              <Handwritten text={ADDRESS[1]} piece={7} />
              <br />
              <Handwritten text={ADDRESS[2]} piece={8} />
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
// A tall track with a sticky stage set as a travel desk: a photographed desk
// (wood, the Gala folder and invitation, ink, a wax seal), with the raised
// things on it (passport, watch, camera, coffee) as their own layers, which
// move a little further than the desk as the view drifts, in proportion to
// their height, while their shadows stay put (Jeff approved the prototype at
// depth strength 1.0, 2026-11-13: more and the layers come apart). The lamp's
// light is part of the desk, and a copy of it falls on the card, locked to the
// desk as the card slides beneath it. As the visitor scrolls:
//   1. the postcard is lifted onto the desk from the lower right, its shadow
//      long and soft, and settles into the lamp's pool as the shadow tightens;
//   2. on narrow screens, where the card is one column, it turns over;
//   3. the dip pen is picked up off the desk and writes the message and
//      address, word by word, its nib following the word being written;
//   4. the stamp comes down from above and lands with a thud (the card jumps,
//      the ink blooms), then the postmark rolls across it;
//   5. the card lifts and flies home along a dashed airmail route to a pin
//      marked Home, Transylvania County.
// The desk images are Envato Elements stock composed for the Gala (no credit
// needed or given; the kit is in Graphic Library 2026/Envato/Travel Desk
// Extracted, with the build scripts in its _build folder).
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
/**
 * A smooth path through keyframes: a monotone cubic (Fritsch–Carlson) that
 * eases in at the first key and out at the last, and passes through the ones
 * between without stopping (unless the motion turns back there). Easing every
 * segment separately made things stop dead at each key: "bouncy" (Jeff,
 * 2026-11-13). Monotone, so it never overshoots a key.
 */
function keys(t: number, at: number[], values: number[]) {
  const n = at.length;
  if (t <= at[0]) return values[0];
  if (t >= at[n - 1]) return values[n - 1];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((values[i + 1] - values[i]) / (at[i + 1] - at[i]));
  const m: number[] = [0];
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(0);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const r = a * a + b * b;
    if (r > 9) {
      const k = 3 / Math.sqrt(r);
      m[i] = k * a * d[i];
      m[i + 1] = k * b * d[i];
    }
  }
  let i = 0;
  while (t > at[i + 1]) i++;
  const h = at[i + 1] - at[i];
  const u = (t - at[i]) / h;
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    (2 * u3 - 3 * u2 + 1) * values[i] +
    (u3 - 2 * u2 + u) * h * m[i] +
    (-2 * u3 + 3 * u2) * values[i + 1] +
    (u3 - u2) * h * m[i + 1]
  );
}

interface Geometry {
  w: number;
  h: number;
  /** The card's resting centre in the stage, untransformed, and its size. */
  cx: number;
  cy: number;
  cardW: number;
  cardH: number;
  /** Where the pen lies on the desk (nib point). */
  restX: number;
  restY: number;
  /** Where the card leaves from, in desk pixels (the route starts here). */
  fromX: number;
  fromY: number;
  /** The desk's box in stage coordinates (it bleeds to the screen's edges). */
  deskX: number;
  deskY: number;
  dw: number;
  dh: number;
  narrow: boolean;
}

const BLANK: Geometry = {
  w: 0, h: 0, cx: 0, cy: 0, cardW: 0, cardH: 0, restX: 0, restY: 0, fromX: 0, fromY: 0,
  deskX: 0, deskY: 0, dw: 0, dh: 0, narrow: false,
};

// The desk, in its own pixels (the layers' coordinates come from the kit's layers.json).
const DESK_SRC = `${BASE}assets/events/gala/desk`;
const DESK_W = 2400;
const DESK_H = 1600;
/** Where the card's centre lands: the brightest part of the lamp's pool. */
const DESK_REST = { x: 1057, y: 1029 };
/** Home: Brevard on the Transylvania County map, where the card flies to. */
const DESK_HOME = { x: 1490, y: 1371 };
/** The county map lies flat on the desk (Jeff's map element, 2026-11-13), so it doesn't move. */
const DESK_MAP: readonly [number, number, number, number] = [1069, 1136, 727, 464];
/** How far a raised thing moves per unit of height, relative to the desk (strength 1.0). */
const DEPTH = 1 / 90;
type Box = readonly [x: number, y: number, w: number, h: number];
// In drawing order: the passport lies lowest, the coffee over everything near it.
// The watch was moved up beside the invitation to keep the map clear.
const DESK_THINGS: readonly { name: string; depth: number; obj: Box; shadow: Box }[] = [
  { name: 'passport', depth: 10, obj: [198, 8, 709, 477], shadow: [115, 0, 913, 566] },
  { name: 'watch', depth: 22, obj: [1680, 290, 276, 354], shadow: [1659, 272, 311, 392] },
  { name: 'camera', depth: 60, obj: [1924, 88, 307, 391], shadow: [1916, 81, 334, 417] },
  { name: 'compass', depth: 30, obj: [1650, 1052, 157, 203], shadow: [1659, 1063, 174, 215] },
  { name: 'coffee', depth: 48, obj: [1960, 1180, 440, 420], shadow: [1960, 1180, 440, 420] },
];
/** The lamp's light on the card: a 800×533 copy of the desk's light (an alpha shade). */
const LAMP_SCALE = DESK_W / 800;
/** The dip pen, photographed lying on the desk with its nib at the top left. */
const PEN = { w: 418, h: 779, nibX: 4, nibY: 4, length: 880, writeAngle: -118 };

interface DeskView {
  s: number;
  tx: number;
  ty: number;
  camX: number;
  camY: number;
}

/** One camera over the desk: it drifts across and eases in a touch as the card lands. */
function deskView(v: number, g: Geometry, swayX: number, swayY: number): DeskView {
  const zoom = lerp(1.06, 1, ease(v));
  const s = Math.max(g.dw / DESK_W, g.dh / DESK_H) * zoom;
  const camX = lerp(-34, 34, v) + swayX * 8;
  const camY = lerp(-26, 30, v) + swayY * 6;
  // Upright screens frame the card's landing spot under the card, then follow
  // the card home to the map; wide ones the middle of the desk, which shows
  // the map. Either way the desk's edges stay out of view.
  const upright = g.dw < g.dh;
  const home = upright ? ease(span(v, [T.send[0], T.send[0] + 0.1])) : 0;
  const fx = upright ? lerp(DESK_REST.x, DESK_HOME.x, home) : DESK_W / 2;
  const fy = upright ? lerp(DESK_REST.y, DESK_HOME.y, home) : DESK_H / 2;
  const ax = upright ? lerp(g.cx - g.deskX, g.dw / 2, home) : g.dw / 2;
  const ay = upright ? lerp(g.cy - g.deskY, g.dh * 0.45, home) : g.dh / 2;
  const clampTo = (value: number, low: number) => Math.min(0, Math.max(low, value));
  return {
    s,
    tx: clampTo(ax - (fx + camX) * s, g.dw - DESK_W * s),
    ty: clampTo(ay - (fy + camY) * s, g.dh - DESK_H * s),
    camX,
    camY,
  };
}

const placeBox = ([left, top, width, height]: Box): CSSProperties => ({ left, top, width, height });

/** Home on screen (stage coordinates) for a given view. */
const homeOnStage = (g: Geometry, view: DeskView) => ({
  x: g.deskX + view.tx + DESK_HOME.x * view.s,
  y: g.deskY + view.ty + DESK_HOME.y * view.s,
});

function Desk({
  worldRef,
  thingRefs,
  children,
}: {
  worldRef: Ref<HTMLDivElement>;
  thingRefs: MutableRefObject<(HTMLImageElement | null)[]>;
  children?: ReactNode;
}) {
  return (
    <div className="gala-desk" aria-hidden="true">
      <div ref={worldRef} className="gala-desk-world">
        <img src={`${DESK_SRC}/desk.webp`} alt="" width={DESK_W} height={DESK_H} style={placeBox([0, 0, DESK_W, DESK_H])} loading="lazy" decoding="async" />
        <img src={`${DESK_SRC}/map.webp`} alt="" style={placeBox(DESK_MAP)} loading="lazy" decoding="async" />
        {DESK_THINGS.map((thing) => (
          <img key={`${thing.name}-shadow`} src={`${DESK_SRC}/${thing.name}-shadow.webp`} alt="" style={placeBox(thing.shadow)} loading="lazy" decoding="async" />
        ))}
        {DESK_THINGS.map((thing, index) => (
          <img
            key={thing.name}
            ref={(el) => {
              thingRefs.current[index] = el;
            }}
            className="is-raised"
            src={`${DESK_SRC}/${thing.name}-obj.webp`}
            alt=""
            style={placeBox(thing.obj)}
            loading="lazy"
            decoding="async"
          />
        ))}
        {children}
      </div>
    </div>
  );
}

export function GalaPostcardJourney({ children }: { children?: ReactNode }) {
  const { motion: animate } = useTripLoungeEnv();
  const track = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const thingRefs = useRef<(HTMLImageElement | null)[]>([]);
  const lampRef = useRef<HTMLSpanElement>(null);
  const lampImgRef = useRef<HTMLImageElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const penImgRef = useRef<HTMLImageElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const geo = useRef<Geometry>(BLANK);
  const sway = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const [size, setSize] = useState({ w: 0, h: 0, fromX: 0, fromY: 0, cx: 0, cy: 0, narrow: false });
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  // Everything follows the scroll through a heavily damped spring, so a mouse
  // wheel's steps glide instead of jumping the scene forward a notch at a time.
  // Overdamped (no bounce); it trails the scroll by about a fifth of a second.
  const p = useSpring(scrollYProgress, { stiffness: 170, damping: 40, mass: 0.7, restDelta: 0.0001 });
  // The pen eases toward where the scroll puts it, so it glides from word to
  // word and back along to the next line rather than snapping there.
  const penNow = useRef<{ x: number; y: number; a: number; l: number; s: number } | null>(null);
  const penGoal = useRef({ x: 0, y: 0, a: 0, l: 0, s: 1 });
  const penRaf = useRef(0);

  // Measure the stage and the card's resting place (untransformed offsets).
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const desk = deskRef.current?.parentElement;
    if (!stage || !scene || !desk) return;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const cardW = scene.offsetWidth;
    const cardH = scene.offsetHeight;
    const cx = scene.offsetLeft + cardW / 2;
    const cy = scene.offsetTop + cardH / 2;
    const narrow = w < 1021;
    const right = scene.offsetLeft + cardW;
    const deskX = desk.offsetLeft;
    const deskY = desk.offsetTop;
    const dw = desk.clientWidth;
    const dh = desk.clientHeight;
    // The route home starts under the card, where the desk is as the card leaves.
    const leave = deskView(T.send[0], { ...geo.current, cx, cy, deskX, deskY, dw, dh }, 0, 0);
    geo.current = {
      w,
      h,
      cx,
      cy,
      cardW,
      cardH,
      // The pen lies on the desk just off the card's right edge, running out of frame.
      restX: narrow ? Math.min(deskX + dw - 8, right + 4) : Math.min(deskX + dw - 24, right + 28),
      restY: scene.offsetTop + cardH * (narrow ? 0.62 : 0.5),
      fromX: (cx - deskX - leave.tx) / leave.s,
      fromY: (cy - deskY - leave.ty) / leave.s,
      deskX,
      deskY,
      dw,
      dh,
      narrow,
    };
    setSize({ w, h, fromX: geo.current.fromX, fromY: geo.current.fromY, cx, cy, narrow });
  }, []);

  useEffect(() => {
    if (!animate) return undefined;
    measure();
    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    if (sceneRef.current) observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, [animate, measure]);

  // Wide screens have the track to themselves until the pen is picked up (the
  // card only turns over on narrow ones), so the card comes in over more of it.
  const slideIn = (): readonly [number, number] => (geo.current.narrow ? T.slideIn : [0, 0.2]);

  // The card: lifted in from the lower right (in perspective), holds, then flies home along an arc.
  const x = useTransform(p, (v) => {
    const g = geo.current;
    const dx = homeOnStage(g, deskView(v, g, 0, 0)).x - g.cx;
    if (v < T.send[0]) return keys(v, [slideIn()[0], slideIn()[1]], [g.w * 1.0, 0]);
    return keys(span(v, T.send), [0, 0.18, 0.6, 1], [0, -g.w * 0.02, dx * 0.62, dx]);
  });
  const y = useTransform(p, (v) => {
    const g = geo.current;
    const dy = homeOnStage(g, deskView(v, g, 0, 0)).y - g.cy;
    if (v < T.send[0]) return keys(v, [slideIn()[0], slideIn()[1]], [g.h * 0.32, 0]);
    return keys(span(v, T.send), [0, 0.18, 0.6, 1], [0, 8, dy * 1.05, dy]);
  });
  // How high the card is as it comes in: 1 off the desk, 0 at rest.
  const land = useTransform(p, (v) => 1 - ease(span(v, slideIn())));
  const scale = useTransform(p, (v) =>
    v < T.send[0]
      ? 1 + (1 - ease(span(v, slideIn()))) * 0.05
      : keys(span(v, T.send), [0, 0.18, 0.6, 1], [1, 1.04, 0.36, 0.04])
  );
  const rotate = useTransform(p, (v) =>
    v < T.send[0]
      ? keys(v, [slideIn()[0], slideIn()[1]], [18, 0])
      : keys(span(v, T.send), [0, 0.18, 0.6, 1], [0, -3, 12, 26])
  );
  const rotateX = useTransform(p, (v) =>
    v < T.send[0] ? keys(v, [slideIn()[0], slideIn()[1], T.write[0]], [24, 8, 5]) : keys(span(v, T.send), [0, 0.3], [5, 0])
  );
  const rotateY = useTransform(p, (v) => keys(v, [slideIn()[0], slideIn()[1]], [20, 0]));
  const opacity = useTransform(p, (v) => 1 - span(v, [T.send[1] - 0.02, T.send[1]]));

  // CSS variables on the card.
  const flip = useTransform(p, (v) => span(v, T.flip));
  const write = useTransform(p, (v) => span(v, T.write));
  const stamp = useTransform(p, (v) => span(v, T.stamp));
  const thud = useTransform(p, (v) => keys(v, [T.stamp[1] - 0.004, T.stamp[1], T.stamp[1] + 0.012], [0, 1, 0]));
  const cancel = useTransform(p, (v) => span(v, T.cancel));
  const lift = useTransform(p, (v) => keys(span(v, T.send), [0, 0.2], [0, 1]));
  const sheen = useTransform(p, (v) => keys(v, [slideIn()[0], slideIn()[1], T.flip[1], T.send[0], T.send[0] + 0.06], [0, 0.55, 1, 1, 0]));

  // Everything that follows the camera, drawn after motion has drawn this
  // frame's card (so the lamp and the nib sit on the card as drawn):
  //   the desk and its raised things; the lamp's light on the card, locked to
  //   the desk; and the pen, which lies on the desk, is picked up to write,
  //   follows the word being written, and is put down again.
  const words = useRef<HTMLElement[]>([]);
  const drawPen = useCallback(() => {
    const pen = penRef.current;
    const penImg = penImgRef.current;
    const n = penNow.current;
    if (!pen || !penImg || !n) return;
    penImg.style.transform =
      `translate(${n.x - PEN.nibX}px, ${n.y - PEN.nibY - n.l * 10}px) rotate(${n.a}deg) scale(${n.s * (1 + n.l * 0.06)})`;
    // The shadow is drawn on the unturned wrapper, so it always falls the same way.
    pen.style.filter = `drop-shadow(${4 + n.l * 14}px ${6 + n.l * 18}px ${3 + n.l * 8}px rgba(20, 11, 6, ${0.5 - n.l * 0.15}))`;
  }, []);
  const glidePen = useCallback(() => {
    const n = penNow.current;
    const goal = penGoal.current;
    if (!n) {
      penRaf.current = 0;
      return;
    }
    // Slow enough that a fast scroll through several lines reads as the pen
    // drifting down the card, not zigzagging across it (Jeff: "shakes").
    const k = 0.09;
    n.x += (goal.x - n.x) * k;
    n.y += (goal.y - n.y) * k;
    n.a += (goal.a - n.a) * k;
    n.l += (goal.l - n.l) * k;
    n.s += (goal.s - n.s) * k;
    drawPen();
    const far = Math.abs(goal.x - n.x) + Math.abs(goal.y - n.y) + Math.abs(goal.a - n.a) > 0.15;
    penRaf.current = far ? requestAnimationFrame(glidePen) : 0;
  }, [drawPen]);
  useEffect(() => () => cancelAnimationFrame(penRaf.current), []);
  const paint = useCallback(
    (v: number) => {
      const stage = stageRef.current;
      const g = geo.current;
      if (!stage || !g.w) return;
      const { sx, sy } = sway.current;
      const view = deskView(v, g, sx, sy);

      // The desk, and the raised things moving further than it.
      if (deskRef.current) deskRef.current.style.transform = `translate(${view.tx}px, ${view.ty}px) scale(${view.s})`;
      DESK_THINGS.forEach((thing, index) => {
        const el = thingRefs.current[index];
        if (el) el.style.transform = `translate(${-view.camX * thing.depth * DEPTH}px, ${-view.camY * thing.depth * DEPTH}px)`;
      });

      // The Home pin sits on Brevard, on the map.
      const pin = pinRef.current;
      if (pin) {
        const home = homeOnStage(g, view);
        pin.style.left = `${home.x}px`;
        pin.style.top = `${home.y}px`;
      }

      // The lamp on the card: undo the card's own move, so the light stays with the desk.
      const lamp = lampRef.current;
      const lampImg = lampImgRef.current;
      if (lamp && lampImg) {
        const r = rotate.get();
        const sc = Math.max(0.01, scale.get());
        const ox = g.deskX + view.tx - g.cx - x.get();
        const oy = g.deskY + view.ty - g.cy - y.get();
        lampImg.style.transform =
          `translate(${g.cardW / 2}px, ${g.cardH / 2}px) rotate(${-r}deg) scale(${1 / sc}) ` +
          `translate(${ox}px, ${oy}px) scale(${view.s * LAMP_SCALE})`;
        const turning = g.narrow ? Math.abs(Math.cos(Math.PI * flip.get())) : 1;
        lamp.style.opacity = String(turning * (1 - lift.get()));
      }

      // The pen.
      const pen = penRef.current;
      const penImg = penImgRef.current;
      if (!pen || !penImg) return;
      if (!words.current.length) {
        words.current = Array.from(stage.querySelectorAll<HTMLElement>('.gala-postcard-back .gala-w'));
      }
      const list = words.current;
      if (!list.length) return;
      const sr = stage.getBoundingClientRect();
      const at = (el: HTMLElement, f: number) => {
        const rect = el.getBoundingClientRect();
        return { x: rect.left - sr.left + rect.width * f, y: rect.bottom - sr.top - rect.height * 0.22 };
      };
      // Lying on the desk it moves with the desk, as a raised thing would.
      const restX = g.restX - view.camX * view.s * (1 + 26 * DEPTH);
      const restY = g.restY - view.camY * view.s * (1 + 26 * DEPTH);
      const penScale = Math.min(view.s, (g.cardW * 0.75) / PEN.length);
      let px = restX;
      let py = restY;
      let angle = 0;
      let liftAmount = 0;
      if (v >= T.pickUp[0] && v < T.write[0]) {
        const first = at(list[0], 0);
        const t = ease(span(v, T.pickUp));
        px = lerp(restX, first.x, t);
        py = lerp(restY, first.y, t);
        angle = lerp(0, PEN.writeAngle, t);
        liftAmount = Math.sin(t * Math.PI) * 0.9 + t * 0.1;
      } else if (v >= T.write[0] && v <= T.write[1]) {
        const i = span(v, T.write) * list.length;
        const k = Math.min(list.length - 1, Math.floor(i));
        const point = at(list[k], i - k);
        px = point.x;
        py = point.y;
        angle = PEN.writeAngle + Math.sin(i * Math.PI) * 2;
        liftAmount = 0.1;
      } else if (v > T.write[1] && v < T.putDown[1]) {
        const last = at(list[list.length - 1], 1);
        const t = ease(span(v, T.putDown));
        px = lerp(last.x, restX, t);
        py = lerp(last.y, restY, t);
        angle = lerp(PEN.writeAngle, 0, t);
        liftAmount = Math.sin(t * Math.PI) * 0.9;
      }
      penGoal.current = { x: px, y: py, a: angle, l: liftAmount, s: penScale };
      if (!penNow.current) {
        penNow.current = { ...penGoal.current };
        drawPen();
      } else if (!penRaf.current) {
        penRaf.current = requestAnimationFrame(glidePen);
      }
    },
    [rotate, scale, x, y, flip, lift, drawPen, glidePen]
  );
  useMotionValueEvent(p, 'change', (v) => frame.postRender(() => paint(v)));
  useEffect(() => {
    if (!animate) return;
    words.current = [];
    paint(p.get());
  }, [animate, size, paint, p]);

  // With a mouse, the view sways a little toward the pointer, eased.
  useEffect(() => {
    if (!animate) return undefined;
    let raf = 0;
    const settle = () => {
      const s = sway.current;
      s.sx += (s.x - s.sx) * 0.06;
      s.sy += (s.y - s.sy) * 0.06;
      paint(p.get());
      raf = Math.abs(s.x - s.sx) + Math.abs(s.y - s.sy) > 0.002 ? requestAnimationFrame(settle) : 0;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = track.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
      sway.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      sway.current.y = (event.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(settle);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [animate, paint, p]);

  // The airmail route home, drawn behind the card as it flies.
  const route = useTransform(p, (v) => keys(span(v, T.send), [0.15, 0.9], [0, 1]));
  const arrive = useTransform(p, (v) => span(v, T.arrive));
  const arriveScale = useTransform(arrive, [0, 1], [0.6, 1]);
  const { w, fromX, fromY } = size;
  // Drawn on the desk, in desk pixels, from under the card to Brevard, arcing up.
  const arc = Math.hypot(DESK_HOME.x - fromX, DESK_HOME.y - fromY) * 0.35;
  const routePath =
    `M ${fromX} ${fromY} C ${lerp(fromX, DESK_HOME.x, 0.25)} ${fromY - arc}, ` +
    `${lerp(fromX, DESK_HOME.x, 0.75)} ${DESK_HOME.y - arc}, ${DESK_HOME.x} ${DESK_HOME.y}`;

  if (!animate) {
    return (
      <>
        <div ref={track} className="gala-postcard-track">
          <div className="gala-postcard-stage">
            <div className="gala-postcard-scene">
              <GalaPostcard />
            </div>
            {children}
          </div>
        </div>
        <GalaPostcardCredits />
      </>
    );
  }

  return (
    <>
      <div ref={track} className="gala-postcard-track is-scroll">
        <div ref={stageRef} className="gala-postcard-stage">
          <Desk worldRef={deskRef} thingRefs={thingRefs}>
            {w ? (
              <svg className="gala-route" viewBox={`0 0 ${DESK_W} ${DESK_H}`}>
                <defs>
                  <mask id="gala-route-mask" maskUnits="userSpaceOnUse">
                    <motion.path d={routePath} stroke="#fff" strokeWidth="24" fill="none" style={{ pathLength: route }} />
                  </mask>
                </defs>
                <path d={routePath} className="gala-route-line" mask="url(#gala-route-mask)" vectorEffect="non-scaling-stroke" />
              </svg>
            ) : null}
          </Desk>

          <motion.div ref={sceneRef} className="gala-postcard-scene" style={{ x, y, scale, rotate, rotateX, rotateY, opacity }}>
            <GalaPostcard
              style={{ '--flip': flip, '--write': write, '--stamp': stamp, '--thud': thud, '--cancel': cancel, '--lift': lift, '--land': land, '--sheen': sheen }}
            />
            <span ref={lampRef} className="gala-postcard-lamp" aria-hidden="true">
              <img ref={lampImgRef} src={`${DESK_SRC}/card-light.webp`} alt="" loading="lazy" decoding="async" />
            </span>
          </motion.div>

          <div ref={penRef} className="gala-pen" aria-hidden="true">
            <img ref={penImgRef} src={`${DESK_SRC}/pen.webp`} alt="" loading="lazy" decoding="async" />
          </div>

          {w ? (
            <motion.div
              ref={pinRef}
              className="gala-home-pin"
              style={{ opacity: arrive, scale: arriveScale }}
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
      <GalaPostcardCredits />
    </>
  );
}
