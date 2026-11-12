import '@fontsource-variable/josefin-sans';
import '@fontsource-variable/josefin-sans/wght-italic.css';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CalendarDays, Clock3, MapPin, Ticket } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { Sparkmark } from '../components/Sparkmark';
import { GALA_BYLINE, GALA_FULL_TITLE, GALA_NAME, GalaLockup } from '../components/GalaLockup';
import {
  GALA_PARTNER_FORM_URL,
  GALA_TICKETS_URL,
  GALA_TICKET_PRICE,
  GALA_TICKET_PRICE_LABEL,
  GALA_VENUE,
} from '../data/events';
import { canonicalUrl } from '../lib/siteOrigin';
import { GALA_TRIP_COUNT, GALA_TRIP_COUNT_WORD, GALA_TRIP_NAMES, GALA_TRIPS, tripAnchor } from '../data/galaTrips';
import { GalaBoardingPass } from './GalaBoardingPass';
import { GalaChapterMark } from './GalaChapterMark';
import { GalaDepartureBoard } from './GalaDepartureBoard';
import { GalaPostcardJourney } from './GalaPostcard';
import { GalaSeatMap } from './GalaSeatMap';
import { GalaRouteMap } from './GalaRouteMap';
import { GalaTrips } from './GalaTrips';
import { GalaTrailer } from './GalaTrailer';
import { GalaTravelPartner } from './GalaTravelPartner';
import { markReturn, type JoinMeReturn } from './galaJoinMe/returnTo';
import './gala.css';

const BASE = import.meta.env.BASE_URL;
const GALA_PATH = '/events/sparkpoint-gala';
// "Issue my passport" (GalaJoinMePage). Three ways in from this page: the hero's
// "Invite a friend", the passport's bearer photo, and the button under the passport;
// each trip card also has "Stamp this trip" (GalaTrips.tsx), which adds #trip=<id>.
const JOIN_ME_PATH = `${GALA_PATH}/join-me`;
// Back from the maker lands on the passport section (see galaJoinMe/returnTo.ts).
const PASSPORT_RETURN: JoinMeReturn = { returnTo: 'passport', returnLabel: 'the passport' };

// A small passport book, drawn to match the page's line icons.
function PassportIcon() {
  return (
    <svg className="gala-passport-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 16h6" />
    </svg>
  );
}
// Rendered by scripts/gala-print (the print session's PR), 1200×630.
const GALA_SHARE_IMAGE = '/assets/events/gala/gala-share-world-of-connections.jpg';
// Hero photo: Astra Liu on Unsplash (photo-1539612793508, Unsplash License), with a
// faint airline emblem on the winglet retouched out.
const heroPhoto = (width: number) => `${BASE}assets/events/gala/hero-wing-${width}.webp`;
// Passport photo: Age Cymru on Unsplash (photo-1674140731715, Unsplash License).
const passportPhoto = (width: number) => `${BASE}assets/events/gala/passport-bearer-${width}.webp`;

// The eight trips (board vote 2026-11-09) live in src/data/galaTrips.ts, which
// follows the trip kit's rules. On this page that means: no auction or bid
// language; every trip at a set price, open to every guest; land only, booked
// with a travel specialist, travel within three years. Never say the trips can
// be bought after the Gala, and don't state payment timing, child pricing,
// insurance or transferability. Keep off this page any giveback percentage
// until it's confirmed.
// AmFund (the American Fundraising Foundation) arranges the trips and has its
// own "Our travel partner" section under them (GalaTravelPartner.tsx; owner's
// call, 2026-11-12, at AmFund's request, so guests see it as a partner rather
// than a vendor). No AmFund staff names or contact details.
const STAMPS = [
  { shape: 'round', top: String(GALA_TRIP_COUNT), middle: 'Trips', bottom: 'Choose at the Gala', tilt: -8 },
  { shape: 'rect', top: 'Set', middle: 'Price', bottom: 'Every guest', tilt: 5 },
  { shape: 'oval', top: 'Land', middle: 'Only', bottom: 'Airfare not included', tilt: -3 },
  { shape: 'rect', top: '3 years', middle: 'to travel', bottom: 'Your dates', tilt: -6 },
  { shape: 'round', top: 'For two', middle: 'Travelers', bottom: 'Cortona: four', tilt: 7 },
  { shape: 'oval', top: 'Gives', middle: 'Back home', bottom: 'Resilience Hub', tilt: -4 },
];

// Leather luggage tags. `code` is a playful airport-style code; `tilt` and
// `drop` (strap length) vary so the row hangs naturally from its rail.
// Each occasion is paired with one of the eight trips (`trip` is its id).
const TAGS = [
  { occasion: 'Anniversary', code: 'ANV', trip: 'portugal', line: 'Celebrate the years in Lisbon and Porto.', tone: 'cognac', tilt: -3, drop: 34 },
  { occasion: 'Milestone birthday', code: 'BDY', trip: 'iceland', line: 'Mark the big one beside Gullfoss.', tone: 'navy', tilt: 2, drop: 58 },
  { occasion: 'Honeymoon', code: 'HNY', trip: 'greece', line: 'Begin forever on Santorini.', tone: 'plum', tilt: -1.5, drop: 22 },
  { occasion: 'Family and friends', code: 'FAM', trip: 'cortona', line: 'A Tuscan suite with room for four.', tone: 'forest', tilt: 3, drop: 50 },
  { occasion: 'Bucket list', code: 'BKT', trip: 'south-africa', line: 'The Big Five, at last.', tone: 'tan', tilt: -2.5, drop: 30 },
].map((tag) => ({ ...tag, to: GALA_TRIPS.find((trip) => trip.id === tag.trip)! }));

const GIVES_BACK = [
  {
    title: 'Every adventure makes a difference',
    copy: 'A portion of every trip chosen at the Gala supports SparkPoint’s mission of strengthening community well-being through collaboration and connection.',
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

// Now that the venue and price are set, the page carries schema.org Event
// data so search engines can show it as an event.
const galaEventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: GALA_NAME,
  alternateName: GALA_BYLINE,
  description: `An evening of connection and ${GALA_TRIP_COUNT_WORD} trips that give back: ${GALA_TRIP_NAMES}. Every trip is available to every guest at a set price, with a portion supporting the Transylvania Resilience Hub.`,
  startDate: '2026-12-11T18:00:00-05:00',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  image: [canonicalUrl(GALA_SHARE_IMAGE)],
  url: canonicalUrl(GALA_PATH),
  location: {
    '@type': 'Place',
    name: GALA_VENUE.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: GALA_VENUE.street,
      addressLocality: GALA_VENUE.city,
      addressRegion: GALA_VENUE.region,
      postalCode: GALA_VENUE.postalCode,
      addressCountry: 'US',
    },
  },
  offers: {
    '@type': 'Offer',
    price: String(GALA_TICKET_PRICE),
    priceCurrency: 'USD',
    availability: GALA_TICKETS_URL ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
    ...(GALA_TICKETS_URL ? { url: GALA_TICKETS_URL } : {}),
  },
  organizer: { '@type': 'NGO', name: 'SparkPoint', url: canonicalUrl('/') },
};

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
        title={`${GALA_FULL_TITLE} | December 11, 2026`}
        description={`Every journey connects back home. Join us for A World of Connections, the SparkPoint Gala, on Friday, December 11, 2026 at 6 p.m. at Connestee Falls Clubhouse, and choose from ${GALA_TRIP_COUNT_WORD} trips that give back to Transylvania County’s Resilience Hub: ${GALA_TRIP_NAMES}. Tickets $100.`}
        path={GALA_PATH}
        image={GALA_SHARE_IMAGE}
        imageAlt="A World of Connections, the SparkPoint Gala: the title over an airplane wing above golden clouds at sunset."
        imageType="image/jpeg"
        imageWidth={1200}
        imageHeight={630}
        jsonLd={galaEventJsonLd}
        keywords={['A World of Connections', 'SparkPoint Gala', 'Gala travel packages', ...GALA_TRIPS.map((trip) => `${trip.name} trip`), 'Resilience Hub', 'Transylvania County', 'Western North Carolina']}
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
            <GalaLockup headingId="gala-title" className="gala-hero-lockup" />
            <p className="gala-hero-tagline">
              Every journey <em>connects back home.</em>
            </p>
            <p className="gala-hero-lede">
              One evening, eight journeys around the world, and a portion of every one of them
              coming back to the place we call home.
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
                <dd>
                  <a href={GALA_VENUE.mapUrl} target="_blank" rel="noopener noreferrer">
                    {GALA_VENUE.name}
                  </a>
                </dd>
              </div>
              <div>
                <Ticket aria-hidden="true" />
                <dt className="sr-only">Tickets</dt>
                <dd>
                  {GALA_TICKET_PRICE_LABEL}
                  {GALA_TICKETS_URL ? null : <span className="gala-hero-soon"> · on sale soon</span>}
                </dd>
              </div>
            </dl>
            <div className="gala-actions">
              {GALA_TICKETS_URL ? (
                <a
                  className="gala-button gala-button-gold"
                  href={GALA_TICKETS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get tickets · ${GALA_TICKET_PRICE} <ArrowRight aria-hidden="true" />
                </a>
              ) : (
                <Link className="gala-button gala-button-gold" to="/newsletter">
                  Get boarding updates <ArrowRight aria-hidden="true" />
                </Link>
              )}
              <a className="gala-button gala-button-ghost" href="#trips">
                See the eight trips
              </a>
              <Link className="gala-button gala-button-ghost gala-hero-invite" to={JOIN_ME_PATH}>
                <PassportIcon /> Invite a friend
              </Link>
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
            <h2 id="routes-title">
              Eight connections. <em>One home base.</em>
            </h2>
            <p>
              Your next adventure could change lives. Every trip at the Gala leaves from here. And a portion of every one comes right
              back to Transylvania County.
            </p>
          </motion.div>
          <GalaRouteMap />
        </div>
      </section>

      {/* The all-trips trailer (#trailer, linked from the newsletter), full screen,
          as the opening of the trips; renders only once imported. */}
      <GalaTrailer />

      {/* 3 — The trips */}
      <section id="trips" className="gala-trips-section" aria-labelledby="trips-title">
        <div className="gala-shell">
          <motion.div className="gala-section-head" {...reveal}>
            <GalaChapterMark kind="departures" />
            <h2 id="trips-title">
              Eight trips. <em>Choose yours at the Gala.</em>
            </h2>
            <p>
              Every trip is available to every guest at a set price, and more than one guest
              can choose the same one.
            </p>
          </motion.div>
          <GalaTrips />
          <p className="gala-fine-print gala-trips-fine">
            Land only: hotels, tours and transfers on the ground; airfare isn’t included.
            You book your dates with a travel specialist and travel within three years.
            Travelers or extra nights can be added on request.
          </p>
          <GalaTravelPartner />
        </div>
      </section>

      {/* 4 — Passport: how it works */}
      <section id="passport" className="gala-passport-section" aria-labelledby="passport-title">
        <div className="gala-shell">
          <motion.div className="gala-section-head" {...reveal}>
            <GalaChapterMark kind="entry" />
            <h2 id="passport-title">
              Your passport to <em>the world.</em>
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
                  </svg>
                  <Sparkmark variant="ink" size="58%" className="gala-passport-emblem-mark" />
                </span>
                <span className="gala-passport-title">
                  <b>World of Connections</b>
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

              {/* The bearer photo is the way in: tap it to put yourself in the passport. */}
              <Link className="gala-passport-photo is-link" to={JOIN_ME_PATH} state={PASSPORT_RETURN} onClick={() => markReturn(PASSPORT_RETURN.returnTo)} aria-label="Put your photo in the passport: issue my passport">
                <img src={passportPhoto(300)} srcSet={`${passportPhoto(300)} 300w, ${passportPhoto(600)} 600w`} sizes="150px" alt="" loading="lazy" />
                <span className="gala-passport-yours" aria-hidden="true">
                  <PassportIcon /> Your photo here
                </span>
                <span className="gala-passport-holo" />
                <span className="gala-passport-seal">
                  <svg viewBox="0 0 100 100">
                    <defs>
                      <path id="gala-seal-ring" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
                    </defs>
                    <circle cx="50" cy="50" r="47" />
                    <text>
                      <textPath href="#gala-seal-ring">SPARKPOINT · TRANSYLVANIA CO · 2026 ·</textPath>
                    </text>
                  </svg>
                  <Sparkmark variant="ink" size="36%" className="gala-passport-seal-mark" />
                </span>
              </Link>

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
                  <dt>Destination</dt>
                  <dd>Your choice of eight</dd>
                </div>
                <div className="is-wide">
                  <dt>Purpose of travel</dt>
                  <dd>Connection, and coming home.</dd>
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
                EVERY&lt;JOURNEY&lt;CONNECTS&lt;BACK&lt;HOME&lt;&lt;
              </p>
              <span className="gala-passport-folio" aria-hidden="true">02</span>
            </div>
            <div className="gala-passport-page gala-passport-visas">
              <header className="gala-passport-issuer">
                <span className="gala-passport-title">
                  <b>Visas · Entries</b>
                  <small>Admitted to the Gala</small>
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
              <strong>Choose your trip at the Gala.</strong> Every one of the eight trips is
              available to every guest at a set price, and more than one guest can choose the
              same trip. Each is for two travelers, except Cortona, which is for four.
            </motion.p>
            <motion.p {...revealLate}>
              <strong>Land only, on your dates.</strong> Packages cover hotels, tours and
              transfers on the ground; airfare isn’t included. You book with a travel
              specialist and travel within three years.
            </motion.p>
          </div>
          <p className="gala-fine-print">
            A portion of every trip comes home to help bring the Transylvania Resilience Hub to life.
          </p>
          <motion.div className="gala-passport-cta" {...reveal}>
            <p>
              <strong>Going? Bring someone along.</strong> Add your photo, stamp your dream trip,
              and share a ready-made “Join me” post, caption included. Your photo stays on your device.
            </p>
            <Link className="gala-button gala-button-gold" to={JOIN_ME_PATH} state={PASSPORT_RETURN} onClick={() => markReturn(PASSPORT_RETURN.returnTo)}>
              Issue my passport
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5 — Luggage tags */}
      <section className="gala-tags-section" aria-labelledby="tags-title">
        <div className="gala-shell">
          <motion.div className="gala-section-head gala-section-head-center" {...reveal}>
            <h2 id="tags-title">
              Where will yours <em>take you?</em>
            </h2>
          </motion.div>
          <ul className="gala-tags">
            {TAGS.map((tag, index) => (
              <motion.li
                key={tag.occasion}
                className={`gala-tag gala-tag-${tag.tone}`}
                style={{ '--tilt': `${tag.tilt}deg`, '--drop': `${tag.drop}px` } as CSSProperties}
                {...staggerReveal(index)}
              >
                <div className="gala-tag-swing">
                  <span className="gala-tag-strap" aria-hidden="true" />
                  <div className="gala-tag-body">
                    <span className="gala-tag-eyelet" aria-hidden="true" />
                    <Sparkmark variant="ink" size="22px" className="gala-tag-mark" />
                    <div className="gala-tag-window">
                    <div className="gala-tag-card">
                      <div className="gala-tag-card-head">
                        <small>Occasion</small>
                        <b aria-hidden="true">{tag.code}</b>
                      </div>
                      <strong>{tag.occasion}</strong>
                      <p>{tag.line}</p>
                      <a className="gala-tag-trip" href={`#${tripAnchor(tag.to)}`}>
                        {tag.to.name}, connection {tag.to.connection}
                      </a>
                      <div className="gala-tag-route" aria-hidden="true">
                        <span>TCN</span>
                        <i />
                        <span>{tag.to.code}</span>
                      </div>
                    </div>
                    </div>
                    <span className="gala-tag-brand" aria-hidden="true">
                      <Sparkmark size="14px" />
                      World of Connections
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6 — The return trip */}
      <section className="gala-return" aria-labelledby="return-title">
        <div className="gala-shell">
          <motion.div className="gala-section-head" {...reveal}>
            <GalaChapterMark kind="postage" />
            <h2 id="return-title">
              Travel that gives back <em>to our community.</em>
            </h2>
          </motion.div>

          <GalaPostcardJourney />

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

      {/* 7 — Travel partners (sponsor teaser) */}
      <section id="travel-partners" className="gala-partners" aria-labelledby="partners-title">
        <div className="gala-shell">
          <div className="gala-partners-head">
            <motion.div className="gala-section-head" {...reveal}>
              <h2 id="partners-title">
                Your brand, cleared <em>for takeoff.</em>
              </h2>
              <p>
                The Gala puts your business in front of the people who travel, give, and lead
                in Transylvania County. Partnership seats are being finalized now.
              </p>
            </motion.div>
            <motion.aside className="gala-partners-cta" {...revealLate}>
              <p className="gala-partners-cta-label">Early boarding</p>
              <p>
                Want first pick of seats? Tell us you’re interested, and we’ll reach out before
                the seat map opens.
              </p>
              <a
                className="gala-button gala-button-plum"
                href={GALA_PARTNER_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Request early boarding <ArrowRight aria-hidden="true" />
              </a>
            </motion.aside>
          </div>

          <motion.div {...reveal}>
            <ul className="gala-seatmap-legend">
              <li className="is-first">First Class</li>
              <li className="is-business">Business</li>
              <li className="is-main">Main Cabin</li>
              <li className="is-status">Seat map opening soon</li>
            </ul>
            <GalaSeatMap />
          </motion.div>
          <p className="gala-fine-print">
            Illustrative seat map. Partnership levels and benefits will be announced soon.
          </p>
        </div>
      </section>

      {/* 8 — Boarding pass */}
      <section className="gala-close" aria-labelledby="close-title">
        <div className="gala-shell">
          <motion.div className="gala-section-head gala-section-head-center" {...reveal}>
            <h2 id="close-title">
              Your seat <em>is waiting.</em>
            </h2>
            <p className="gala-close-where">
              {GALA_VENUE.name} · {GALA_TICKETS_URL ? GALA_TICKET_PRICE_LABEL : 'Tickets on sale soon'}
            </p>
          </motion.div>

          <motion.div {...reveal}>
            <GalaBoardingPass />
          </motion.div>

          <motion.p className="gala-partner" {...reveal}>
            Want your business on board? <a href="#travel-partners">Become a Gala travel partner</a>
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
