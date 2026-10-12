import { motion } from 'motion/react';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Gavel,
  HeartHandshake,
  MapPin,
  Plane,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import './gala.css';

const GALA_PATH = '/events/sparkpoint-gala';

// The four numbers on the boarding pass. Source: Sarah's travel-auction notes
// (2026-10-11). Don't state the giveback percentage until it's confirmed.
const AUCTION_FACTS = [
  { value: '8', label: 'travel experiences', detail: 'Trips to destinations around the world' },
  { value: '3', label: 'years to travel', detail: 'Plenty of time to plan the trip' },
  { value: '0', label: 'blackout dates', detail: 'Go when it works for you' },
  { value: '1', label: 'year at the Gala price', detail: 'Extra buyers lock in the same price' },
];

const OCCASIONS = [
  'Anniversaries',
  'Milestone birthdays',
  'Honeymoons',
  'Family vacations',
  'Bucket-list adventures',
];

const GIVES_BACK = [
  {
    title: 'Every adventure makes a difference',
    copy: 'A portion of each travel package purchased supports SparkPoint’s mission of strengthening community well-being through collaboration and connection.',
  },
  {
    title: 'Help bring the Transylvania Resilience Hub to life',
    copy: 'Gala support helps advance this new community resource, designed to bring people, organizations, and services together under one roof.',
  },
  {
    title: 'Invest in a stronger, more connected community',
    copy: 'The Resilience Hub will provide space for collaboration, leadership development, community resources, and programs that strengthen resilience and address local needs.',
  },
  {
    title: 'Your vacation can have a lasting impact',
    copy: 'Make unforgettable travel memories while helping SparkPoint build a healthier, more connected, and resilient Transylvania County.',
  },
];

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55 },
};

export default function GalaPage() {
  return (
    <div className="gala-page">
      <SEOHead
        title="The SparkPoint Gala & Travel Auction | December 11, 2026"
        description="Save the date for the SparkPoint Gala on Friday, December 11, 2026 at 6 p.m. Bid on eight travel experiences in a live auction—travel that gives back to Transylvania County’s Resilience Hub."
        path={GALA_PATH}
        keywords={['SparkPoint Gala', 'travel auction', 'Resilience Hub', 'Brevard', 'Transylvania County']}
      />

      <section className="gala-hero" aria-labelledby="gala-title">
        <div className="gala-hero-sky" aria-hidden="true">
          <span className="gala-hero-ring" />
          <span className="gala-hero-ring gala-hero-ring-2" />
          <svg className="gala-hero-route" viewBox="0 0 600 240" preserveAspectRatio="none">
            <path d="M10 210 C 160 40, 400 10, 590 90" />
          </svg>
        </div>
        <div className="gala-shell gala-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <p className="gala-kicker">Save the date</p>
            <h1 id="gala-title">The SparkPoint Gala</h1>
            <p className="gala-hero-lede">
              An evening of connection, celebration, and a live travel auction where your
              next adventure could change lives.
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
              <Link className="gala-button gala-button-primary" to="/newsletter">
                Get gala updates <ArrowRight aria-hidden="true" />
              </Link>
              <a className="gala-button gala-button-ghost" href="#travel-auction">
                See the travel auction
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="travel-auction" className="gala-auction" aria-labelledby="auction-title">
        <div className="gala-shell">
          <motion.div className="gala-section-head" {...reveal}>
            <p className="gala-label">The travel auction</p>
            <h2 id="auction-title">Your next adventure could change lives!</h2>
            <p>
              Eight trips to destinations around the world go up for bid during the Gala,
              led by a professional live auctioneer. Each one is travel that gives back:
              part of every package purchased supports SparkPoint and its mission.
            </p>
          </motion.div>

          <motion.div className="gala-pass" {...reveal}>
            <div className="gala-pass-main">
              <div className="gala-pass-top">
                <span>
                  <Plane aria-hidden="true" /> SparkPoint Gala · Travel Auction
                </span>
                <span>Dec 11 · 2026</span>
              </div>
              <ul className="gala-pass-facts">
                {AUCTION_FACTS.map((fact) => (
                  <li key={fact.label}>
                    <strong>{fact.value}</strong>
                    <b>{fact.label}</b>
                    <span>{fact.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gala-pass-stub" aria-hidden="true">
              <span>Destination</span>
              <strong>Anywhere</strong>
              <span>Gives back to</span>
              <strong>Transylvania County</strong>
            </div>
          </motion.div>

          <div className="gala-auction-notes">
            <motion.article {...reveal}>
              <Gavel aria-hidden="true" />
              <h3>Live, with a professional auctioneer</h3>
              <p>
                An experienced auctioneer leads the bidding during the Gala, so the
                room gets to share the excitement.
              </p>
            </motion.article>
            <motion.article {...reveal}>
              <Users aria-hidden="true" />
              <h3>More than one winner per trip</h3>
              <p>
                More than one guest can buy the same trip at its auction price, and more
                buyers can lock in that Gala price for up to a year after the event.
              </p>
            </motion.article>
          </div>

          <motion.div className="gala-occasions" {...reveal}>
            <p>Made for</p>
            <ul>
              {OCCASIONS.map((occasion) => (
                <li key={occasion}>{occasion}</li>
              ))}
            </ul>
          </motion.div>

          <p className="gala-fine-print">
            The trip lineup and the details and terms for each package will be shared before
            the Gala.
          </p>
        </div>
      </section>

      <section className="gala-gives" aria-labelledby="gives-title">
        <div className="gala-shell gala-gives-inner">
          <motion.div className="gala-gives-head" {...reveal}>
            <HeartHandshake aria-hidden="true" />
            <p className="gala-label">Travel that gives back</p>
            <h2 id="gives-title">Travel that gives back to our community.</h2>
            <p>
              Gala support helps bring the{' '}
              <Link to="/resilience-hub">Transylvania Resilience Hub</Link> to life.
            </p>
          </motion.div>
          <ol className="gala-gives-list">
            {GIVES_BACK.map((item, index) => (
              <motion.li key={item.title} {...reveal} transition={{ duration: 0.55, delay: index * 0.06 }}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gala-next" aria-labelledby="gala-next-title">
        <div className="gala-shell gala-next-inner">
          <div>
            <p className="gala-label">More to come</p>
            <h2 id="gala-next-title">Venue, tickets, and the trip lineup are on the way.</h2>
            <p>
              Join the newsletter to hear first. Businesses and organizations interested
              in sponsoring the Gala can reach out now.
            </p>
          </div>
          <div className="gala-next-actions">
            <Link className="gala-button gala-button-primary" to="/newsletter">
              Get gala updates <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="gala-button gala-button-outline" to="/intake?intent=partner">
              Ask about sponsoring
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
