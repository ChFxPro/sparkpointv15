import { useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
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

// "The return trip", told with scroll. A tall track with a sticky stage: as the
// visitor scrolls, the postcard slides in, (on narrow screens, where the card
// is one column, it turns over to its back), the message and address are
// written word by word, the stamp lands and the postmark cancels it, and then
// the card is sent off to the right. Under reduced motion (the OS setting or
// the site's toggle) none of that happens: the card sits still, fully written.
//
// Progress through the track (0 → 1):
const T = {
  slideIn: [0, 0.14],
  flip: [0.14, 0.25], // narrow screens only (CSS)
  write: [0.27, 0.62],
  stamp: [0.64, 0.7],
  cancel: [0.7, 0.76],
  send: [0.84, 1],
} as const;

export function GalaPostcardJourney({ children }: { children?: ReactNode }) {
  const { motion: animate } = useTripLoungeEnv();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] });

  const x = useTransform(p, [T.slideIn[0], T.slideIn[1], T.send[0], T.send[1]], ['-105vw', '0vw', '0vw', '110vw']);
  const y = useTransform(p, [T.send[0], T.send[1]], [0, -60]);
  const rotate = useTransform(p, [T.slideIn[0], T.slideIn[1], T.send[0], T.send[1]], [-12, 0, 0, 9]);
  const flip = useTransform(p, [...T.flip], [0, 1]);
  const write = useTransform(p, [...T.write], [0, 1]);
  const stamp = useTransform(p, [...T.stamp], [0, 1]);
  const cancel = useTransform(p, [...T.cancel], [0, 1]);
  const sent = useTransform(p, [0.92, 1], [0, 1]);

  return (
    <div ref={track} className={`gala-postcard-track${animate ? ' is-scroll' : ''}`}>
      <div className="gala-postcard-stage">
        {animate ? (
          <motion.div className="gala-postcard-scene" style={{ x, y, rotate }}>
            <GalaPostcard style={{ '--flip': flip, '--write': write, '--stamp': stamp, '--cancel': cancel }} />
          </motion.div>
        ) : (
          <div className="gala-postcard-scene">
            <GalaPostcard />
          </div>
        )}
        {animate ? (
          <motion.p className="gala-postcard-sent" style={{ opacity: sent }} aria-hidden="true">
            Sent home <Sparkmark size="0.9em" />
          </motion.p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
