import { Link } from 'react-router';
import { Sparkmark } from '../components/Sparkmark';

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

export function GalaPostcard() {
  return (
    <article className="gala-postcard">
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
              Every great trip ends with coming home. A portion of every travel package sold at
              the Gala comes back to SparkPoint, helping bring the{' '}
              <Link to="/resilience-hub">Transylvania Resilience Hub</Link> to life: one roof
              where people, organizations, and services come together.
            </p>
            <p className="gala-postcard-sign">
              With love from home,
              <span>
                SparkPoint <Sparkmark size="1em" />
              </span>
            </p>
          </div>

          <span className="gala-postcard-divider" aria-hidden="true">
            An Atlas of Wonders · Travel that gives back · Transylvania County, NC
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
              <span>To:</span> Home
              <br />
              Transylvania County
              <br />
              North Carolina
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
    </article>
  );
}
