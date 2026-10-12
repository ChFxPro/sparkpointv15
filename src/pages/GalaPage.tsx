import '@fontsource-variable/fraunces';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CalendarDays, Clock3, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { GalaDepartureBoard } from './GalaDepartureBoard';
import { GalaRouteMap } from './GalaRouteMap';
import './gala.css';

const BASE = import.meta.env.BASE_URL;
const GALA_PATH = '/events/sparkpoint-gala';
const postcardImage = `${BASE}assets/events/gala/hub-winter-postcard.webp`;
// Hero photo: Astra Liu on Unsplash (photo-1539612793508, Unsplash License), with a
// faint airline emblem on the winglet retouched out.
const heroPhoto = (width: number) => `${BASE}assets/events/gala/hero-wing-${width}.webp`;
// Passport photo: Age Cymru on Unsplash (photo-1674140731715, Unsplash License).
const passportPhoto = (width: number) => `${BASE}assets/events/gala/passport-bearer-${width}.webp`;

// Auction facts come from Sarah's travel-auction notes (2026-10-11). Keep off
// this page: that board members may bid (internal), the AmFund contact, and
// any giveback percentage until one is confirmed.
const STAMPS = [
  { shape: 'round', top: '8', middle: 'Travel experiences', bottom: 'Worldwide', tilt: -8 },
  { shape: 'rect', top: '3 years', middle: 'to travel', bottom: 'From purchase', tilt: 5 },
  { shape: 'oval', top: 'No', middle: 'Blackout dates', bottom: 'Go when you like', tilt: -3 },
  { shape: 'rect', top: 'Live', middle: 'Auction', bottom: 'Professional auctioneer', tilt: -6 },
  { shape: 'round', top: '2+', middle: 'Winners per trip', bottom: 'Same price', tilt: 7 },
  { shape: 'oval', top: '1 year', middle: 'Gala price locked', bottom: 'After the event', tilt: -4 },
];

const TAGS = [
  { occasion: 'Anniversary', line: 'Celebrate the years somewhere new.' },
  { occasion: 'Milestone birthday', line: 'Mark the big one with a bigger view.' },
  { occasion: 'Honeymoon', line: 'Begin forever far from ordinary.' },
  { occasion: 'Family vacation', line: 'The memories everyone brings home.' },
  { occasion: 'Bucket list', line: 'The trip you’ve always talked about.' },
];

const GIVES_BACK = [
  {
    title: 'Every adventure makes a difference',
    copy: 'A portion of each travel package purchased supports SparkPoint’s mission of strengthening community well-being through collaboration and connection.',
  },
  {
    title: 'Help bring the Resilience Hub to life',
    copy: 'Gala support helps advance this new community resource, designed to bring people, organizations, and services together under one roof.',
  },
  {
    title: 'Invest in a more connected community',
    copy: 'The Hub will provide space for collaboration, leadership development, community resources, and programs that strengthen resilience and address local needs.',
  },
  {
    title: 'A vacation with a lasting impact',
    copy: 'Make unforgettable travel memories while helping SparkPoint build a healthier, more connected, and resilient Transylvania County.',
  },
];

function useReveal(delay = 0) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return {};
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function Stamp({ stamp, index }: { stamp: (typeof STAMPS)[number]; index: number }) {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 1.6, rotate: stamp.tilt * 2 },
        whileInView: { opacity: 1, scale: 1, rotate: stamp.tilt },
        viewport: { once: true, margin: '-40px' },
        transition: { type: 'spring' as const, stiffness: 420, damping: 18, delay: 0.15 + index * 0.16 },
      };
  return (
    <motion.li
      className={`gala-stamp gala-stamp-${stamp.shape} gala-stamp-ink-${index % 3}`}
      style={{ rotate: stamp.tilt }}
      {...motionProps}
    >
      <strong>{stamp.top}</strong>
      <span>{stamp.middle}</span>
      <small>{stamp.bottom}</small>
    </motion.li>
  );
}

export default function GalaPage() {
  const reveal = useReveal();
  const revealLate = useReveal(0.12);

  return (
    <div className="gala-page">
      <SEOHead
        title="The SparkPoint Gala & Travel Auction | December 11, 2026"
        description="See the world. Strengthen home. Join the SparkPoint Gala on Friday, December 11, 2026 at 6 p.m. and bid on eight travel experiences in a live auction that gives back to Transylvania County’s Resilience Hub."
        path={GALA_PATH}
        image="/assets/events/gala/gala-share.jpg"
        imageAlt="An airplane wing above a sea of golden clouds at sunset."
        imageType="image/jpeg"
        imageWidth={1200}
        imageHeight={630}
        keywords={['SparkPoint Gala', 'travel auction', 'Resilience Hub', 'Brevard', 'Transylvania County']}
      />

      {/* 1 — Departures */}
      <section className="gala-hero" aria-labelledby="gala-title">
        <div className="gala-hero-photo" aria-hidden="true">
          <img
            src={heroPhoto(1400)}
            srcSet={`${heroPhoto(800)} 800w, ${heroPhoto(1400)} 1400w, ${heroPhoto(2400)} 2400w`}
            sizes="100vw"
            alt=""
            // React 18 drops camelCase fetchPriority; the spread emits the real attribute.
            {...{ fetchpriority: 'high' }}
          />
        </div>
        <div className="gala-shell gala-hero-inner">
          <motion.div className="gala-hero-copy" {...reveal}>
            <p className="gala-kicker">
              <span>The SparkPoint Gala</span>
              <span aria-hidden="true">✦</span>
              <span>Live travel auction</span>
            </p>
            <h1 id="gala-title">
              See the world.
              <em>Strengthen home.</em>
            </h1>
            <p className="gala-hero-lede">
              One evening, eight journeys around the world, and every one of them giving back
              to the place we call home.
            </p>
            <dl className="gala-hero-facts">
              <div>
                <CalendarDays aria-hidden="true" />
                <dt className="sr-only">Date</dt>
                <dd>Friday, December 11, 2026</dd>
              </div>
              <div>
                <Clock3 aria-hidden="true" />
                <dt className="sr-only">Time</dt>
                <dd>6:00 p.m.</dd>
              </div>
              <div>
                <MapPin aria-hidden="true" />
                <dt className="sr-only">Location</dt>
                <dd>Venue to be announced</dd>
              </div>
            </dl>
            <div className="gala-actions">
              <Link className="gala-button gala-button-gold" to="/newsletter">
                Get boarding updates <ArrowRight aria-hidden="true" />
              </Link>
              <a className="gala-button gala-button-ghost" href="#passport">
                How the auction works
              </a>
            </div>
          </motion.div>
          <motion.div {...revealLate}>
            <GalaDepartureBoard />
          </motion.div>
        </div>
      </section>

      {/* 2 — Routes */}
      <section className="gala-routes" aria-labelledby="routes-title">
        <div className="gala-shell">
          <motion.div className="gala-routes-head" {...reveal}>
            <p className="gala-label">Your next adventure could change lives</p>
            <h2 id="routes-title">
              Eight departures. <em>One home base.</em>
            </h2>
            <p>
              Every trip auctioned at the Gala leaves from here. And a portion of every
              package comes right back to Transylvania County.
            </p>
          </motion.div>
          <GalaRouteMap />
        </div>
      </section>

      {/* 3 — Passport */}
      <section id="passport" className="gala-passport-section" aria-labelledby="passport-title">
        <div className="gala-shell">
          <motion.div className="gala-section-head" {...reveal}>
            <p className="gala-label gala-label-ink">How the auction works</p>
            <h2 id="passport-title">
              Your passport to <em>the auction.</em>
            </h2>
          </motion.div>

          <motion.div className="gala-passport" {...reveal}>
            <span className="gala-passport-ribbon" aria-hidden="true" />
            <div className="gala-passport-page gala-passport-data">
              <header className="gala-passport-issuer">
                <span className="gala-passport-emblem" aria-hidden="true">
                  <svg viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" />
                    <circle cx="20" cy="20" r="14.5" />
                    <path d="M20 9 L22.6 17.4 L31 20 L22.6 22.6 L20 31 L17.4 22.6 L9 20 L17.4 17.4 Z" />
                  </svg>
                </span>
                <span className="gala-passport-title">
                  <b>SparkPoint Gala</b>
                  <small>Passport · Passeport · Pasaporte</small>
                </span>
                <dl className="gala-passport-codes">
                  <div>
                    <dt>Type</dt>
                    <dd>P</dd>
                  </div>
                  <div>
                    <dt>Code</dt>
                    <dd>SPK</dd>
                  </div>
                  <div>
                    <dt>Passport No.</dt>
                    <dd>GALA1211</dd>
                  </div>
                </dl>
              </header>

              <div className="gala-passport-photo" aria-hidden="true">
                <img src={passportPhoto(300)} srcSet={`${passportPhoto(300)} 300w, ${passportPhoto(600)} 600w`} sizes="150px" alt="" loading="lazy" />
                <span className="gala-passport-holo" />
                <span className="gala-passport-seal">
                  <svg viewBox="0 0 100 100">
                    <defs>
                      <path id="gala-seal-ring" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
                    </defs>
                    <circle cx="50" cy="50" r="47" />
                    <text>
                      <textPath href="#gala-seal-ring">SPARKPOINT ✦ BREVARD NC ✦ 2026 ✦</textPath>
                    </text>
                    <path d="M50 34 L53.5 46.5 L66 50 L53.5 53.5 L50 66 L46.5 53.5 L34 50 L46.5 46.5 Z" />
                  </svg>
                </span>
              </div>

              <dl className="gala-passport-fields">
                <div className="is-wide">
                  <dt>Bearer · Titulaire</dt>
                  <dd className="is-name">You</dd>
                </div>
                <div>
                  <dt>Nationality</dt>
                  <dd>Curious</dd>
                </div>
                <div>
                  <dt>Home port</dt>
                  <dd>Transylvania County, NC</dd>
                </div>
                <div>
                  <dt>Date of issue</dt>
                  <dd>11 Dec 2026</dd>
                </div>
                <div>
                  <dt>Valid for</dt>
                  <dd>3 years from purchase</dd>
                </div>
                <div className="is-wide">
                  <dt>Restrictions</dt>
                  <dd>None. No blackout dates.</dd>
                </div>
              </dl>

              <div className="gala-passport-sign">
                <div>
                  <span className="gala-passport-signature">Bon voyage!</span>
                  <small>Signature of bearer</small>
                </div>
                <img className="gala-passport-ghost" src={passportPhoto(300)} alt="" aria-hidden="true" loading="lazy" />
              </div>

              <p className="gala-passport-mrz" aria-hidden="true">
                P&lt;SPK&lt;&lt;GALA&lt;&lt;DEC&lt;11&lt;2026&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                <br />
                SEE&lt;THE&lt;WORLD&lt;&lt;STRENGTHEN&lt;HOME&lt;&lt;
              </p>
              <span className="gala-passport-folio" aria-hidden="true">02</span>
            </div>
            <div className="gala-passport-page gala-passport-visas">
              <header className="gala-passport-issuer">
                <span className="gala-passport-title">
                  <b>Visas · Entries</b>
                  <small>Admitted to the auction</small>
                </span>
              </header>
              <ul className="gala-stamps">
                {STAMPS.map((stamp, index) => (
                  <Stamp key={stamp.middle} stamp={stamp} index={index} />
                ))}
              </ul>
              <span className="gala-passport-folio" aria-hidden="true">03</span>
            </div>
          </motion.div>

          <div className="gala-passport-notes">
            <motion.p {...reveal}>
              <strong>Eight trips, one live auction.</strong> A professional auctioneer leads
              the bidding on eight travel experiences to destinations around the world.
            </motion.p>
            <motion.p {...revealLate}>
              <strong>More than one winner.</strong> Several guests can buy the same trip at its
              auction price, and more travelers can lock in that Gala price for up to a year
              after the event.
            </motion.p>
          </div>
          <p className="gala-fine-print">
            The trip lineup and each package’s details and terms are shared before the Gala.
          </p>
        </div>
      </section>

      {/* 4 — Luggage tags */}
      <section className="gala-tags-section" aria-labelledby="tags-title">
        <div className="gala-shell">
          <motion.div className="gala-section-head gala-section-head-center" {...reveal}>
            <p className="gala-label gala-label-ink">Made for the moments that matter</p>
            <h2 id="tags-title">
              Where will yours <em>take you?</em>
            </h2>
          </motion.div>
          <ul className="gala-tags">
            {TAGS.map((tag, index) => (
              <motion.li key={tag.occasion} className="gala-tag" {...staggerReveal(index)}>
                <span className="gala-tag-string" aria-hidden="true" />
                <div className="gala-tag-body">
                  <span className="gala-tag-hole" aria-hidden="true" />
                  <small>Destination: anywhere</small>
                  <strong>{tag.occasion}</strong>
                  <p>{tag.line}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5 — The return trip */}
      <section className="gala-return" aria-labelledby="return-title">
        <div className="gala-shell">
          <motion.div className="gala-section-head" {...reveal}>
            <p className="gala-label">The return trip</p>
            <h2 id="return-title">
              Travel that gives back <em>to our community.</em>
            </h2>
          </motion.div>

          <motion.article className="gala-postcard" {...reveal}>
            <figure className="gala-postcard-front">
              <img
                src={postcardImage}
                alt="Concept rendering of the Transylvania Resilience Hub in winter: a brick building with a glowing SparkPoint sign, lit windows, and snow on the ground."
                loading="lazy"
              />
              <figcaption>
                <span>Greetings from</span>
                <strong>Home</strong>
                <small>Transylvania Resilience Hub · concept rendering</small>
              </figcaption>
            </figure>
            <div className="gala-postcard-back">
              <div className="gala-postcard-message">
                <p>
                  Every great trip ends with coming home. A portion of every travel package
                  sold at the Gala comes back to SparkPoint, helping bring the{' '}
                  <Link to="/resilience-hub">Transylvania Resilience Hub</Link> to life: one
                  roof where people, organizations, and services come together.
                </p>
                <p className="gala-postcard-sign">With love from home, SparkPoint</p>
              </div>
              <div className="gala-postcard-address">
                <div className="gala-postcard-stamp" aria-hidden="true">
                  <span>✦</span>
                  <small>Gives back</small>
                </div>
                <div className="gala-postcard-postmark" aria-hidden="true">
                  <span>Brevard NC</span>
                  <span>Dec 11 2026</span>
                </div>
                <p>
                  <span>To:</span> Home
                  <br />
                  Transylvania County
                  <br />
                  North Carolina
                </p>
              </div>
            </div>
          </motion.article>

          <ol className="gala-gives">
            {GIVES_BACK.map((item, index) => (
              <motion.li key={item.title} {...staggerReveal(index)}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — Boarding pass */}
      <section className="gala-close" aria-labelledby="close-title">
        <div className="gala-shell">
          <motion.div className="gala-section-head gala-section-head-center" {...reveal}>
            <p className="gala-label">Venue, tickets, and destinations coming soon</p>
            <h2 id="close-title">
              Your seat <em>is waiting.</em>
            </h2>
          </motion.div>

          <motion.div className="gala-boarding" {...reveal}>
            <div className="gala-boarding-main">
              <div className="gala-boarding-top">
                <span>✦ SparkPoint Gala</span>
                <span>Boarding pass</span>
              </div>
              <div className="gala-boarding-route">
                <div>
                  <small>From</small>
                  <strong>BRV</strong>
                  <span>Brevard, NC</span>
                </div>
                <svg viewBox="0 0 120 24" aria-hidden="true">
                  <path d="M2 20 Q60 -8 118 20" />
                </svg>
                <div>
                  <small>To</small>
                  <strong>ANY</strong>
                  <span>Anywhere</span>
                </div>
              </div>
              <dl className="gala-boarding-fields">
                <div>
                  <dt>Passenger</dt>
                  <dd>You</dd>
                </div>
                <div>
                  <dt>Flight</dt>
                  <dd>SPK 1211</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>11 Dec 2026</dd>
                </div>
                <div>
                  <dt>Boarding</dt>
                  <dd>6:00 p.m.</dd>
                </div>
                <div>
                  <dt>Gate</dt>
                  <dd>TBA</dd>
                </div>
                <div>
                  <dt>Seat</dt>
                  <dd>Yours</dd>
                </div>
              </dl>
            </div>
            <div className="gala-boarding-stub">
              <p>Be first to know when tickets and destinations are announced.</p>
              <Link className="gala-button gala-button-gold" to="/newsletter">
                Get boarding updates <ArrowRight aria-hidden="true" />
              </Link>
              <span className="gala-barcode" aria-hidden="true" />
            </div>
          </motion.div>

          <motion.p className="gala-partner" {...reveal}>
            Want your business on board? <Link to="/intake?intent=partner">Become a Gala travel partner</Link>
          </motion.p>
        </div>
      </section>
    </div>
  );
}

// Staggered reveal for list items. A plain function so it can be
// called inside .map; it reads reduced motion from the media query directly.
function staggerReveal(index: number) {
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return {};
  }
  return {
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  };
}
