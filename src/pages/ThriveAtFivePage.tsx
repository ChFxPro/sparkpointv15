import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Coffee,
  ExternalLink,
  MapPin,
  Music2,
  Play,
  UsersRound,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { canonicalUrl } from '../lib/siteOrigin';
import { COMMON_GROUND_PURCHASE_URL } from '../data/events';
import './thrive-at-five.css';

const BASE = import.meta.env.BASE_URL;
const ASSET_BASE = `${BASE}assets/events/pisgah_coffee_fundraiser/`;
const EVENT_PATH = '/events/thrive-at-five';
const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=6283+Asheville+Highway+Pisgah+Forest+NC+28768';
const FACEBOOK_EVENT_URL = 'https://www.facebook.com/share/1BaHvsc1p3/';
const COFFEE_PURCHASE_URL = COMMON_GROUND_PURCHASE_URL;
const CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Thrive+%40+Five%3A+Common+Ground+Release+Party&dates=20260731T210000Z%2F20260731T230000Z&details=Celebrate+the+release+of+Common+Ground+Resilience+Roast+with+SparkPoint+and+Pisgah+Coffee+Roasters.+Live+music%2C+food%2C+drinks%2C+and+friends.&location=Pisgah+Coffee+Roasters%2C+6283+Asheville+Highway%2C+Pisgah+Forest%2C+NC+28768';

const heroImage = `${ASSET_BASE}Sparkpoint Photos-2.webp`;
const packageImage = `${ASSET_BASE}SparkPoint - Common Ground.webp`;
const hubImage = `${ASSET_BASE}ChatGPT Image May 28, 2026 at 03_24_30 PM.webp`;
const pisgahLogo = `${ASSET_BASE}PisgahCoffeeRoasters.webp`;
const productDetailImage = `${ASSET_BASE}Sparkpoint Photos-1.webp`;

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Thrive @ Five: Common Ground Release Party',
  description:
    'Celebrate the Common Ground Resilience Roast release with SparkPoint and Pisgah Coffee Roasters, featuring live music from Mark and Sally Wingate, food, drinks, and friends.',
  startDate: '2026-07-31T17:00:00-04:00',
  endDate: '2026-07-31T19:00:00-04:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Pisgah Coffee Roasters',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '6283 Asheville Highway',
      addressLocality: 'Pisgah Forest',
      addressRegion: 'NC',
      postalCode: '28768',
      addressCountry: 'US',
    },
  },
  image: [canonicalUrl('/assets/events/pisgah_coffee_fundraiser/Sparkpoint Photos-2.webp')],
  organizer: [
    {
      '@type': 'Organization',
      name: 'SparkPoint',
      url: canonicalUrl('/'),
    },
    {
      '@type': 'Organization',
      name: 'Pisgah Coffee Roasters',
      url: 'https://pisgahroasters.com/',
    },
  ],
  url: canonicalUrl(EVENT_PATH),
};

export default function ThriveAtFivePage() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="taf-page">
      <SEOHead
        title="Thrive @ Five: Common Ground Release Party | SparkPoint"
        description="Join SparkPoint and Pisgah Coffee Roasters July 31 for Common Ground Resilience Roast, live music, food, drinks, and friends in support of the Resilience Hub."
        path={EVENT_PATH}
        image="/assets/events/pisgah_coffee_fundraiser/Sparkpoint Photos-2.webp"
        imageAlt="Common Ground Resilience Roast coffee, created by SparkPoint and Pisgah Coffee Roasters."
        jsonLd={eventJsonLd}
      />

      <section className="taf-hero" aria-labelledby="taf-title">
        <img className="taf-hero-image" src={heroImage} alt="" />
        <div className="taf-hero-shade" aria-hidden="true" />
        <div className="taf-shell taf-hero-inner">
          <div className="taf-hero-copy">
            <Link className="taf-back-link" to="/events">
              <span aria-hidden="true">←</span> All events
            </Link>
            <p className="taf-eyebrow">SparkPoint + Pisgah Coffee Roasters present</p>
            <h1 id="taf-title">
              <span>Thrive @ Five</span>
              Common Ground
              <small>Release Party</small>
            </h1>
            <p className="taf-hero-lede">
              Coffee roasted for connection. Join us for the first pour of a limited
              resilience roast—and an evening built around music, food, drinks, and friends.
            </p>
            <div className="taf-hero-actions">
              <a className="taf-button taf-button-light" href={MAP_URL} target="_blank" rel="noreferrer">
                Get directions <ArrowRight aria-hidden="true" />
              </a>
              <a
                className="taf-button taf-button-ghost"
                href={CALENDAR_URL}
                target="_blank"
                rel="noreferrer"
              >
                Add to calendar <CalendarDays aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="taf-event-ticket" aria-label="Event details">
            <p>Friday</p>
            <strong>July 31</strong>
            <dl>
              <div>
                <Clock3 aria-hidden="true" />
                <dt className="sr-only">Time</dt>
                <dd>5:00–7:00 p.m.</dd>
              </div>
              <div>
                <MapPin aria-hidden="true" />
                <dt className="sr-only">Location</dt>
                <dd>
                  Pisgah Coffee Roasters
                  <span>6283 Asheville Highway, Pisgah Forest</span>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="taf-intro" aria-labelledby="taf-intro-title">
        <div className="taf-shell taf-intro-grid">
          <div className="taf-package-wrap">
            <span aria-hidden="true">Limited release</span>
            <img
              src={packageImage}
              alt="Common Ground Resilience Roast package art featuring SparkPoint’s planned Resilience Hub."
            />
          </div>
          <div className="taf-intro-copy">
            <p className="taf-section-kicker">The third annual collaboration</p>
            <h2 id="taf-intro-title">Meet Common Ground Resilience Roast.</h2>
            <p className="taf-large-copy">
              A light roast micro-lot created by Pisgah Coffee Roasters and SparkPoint to
              celebrate the connections that make our community stronger.
            </p>
            <p>
              Sample the new roast, pick up a limited-edition bag, hear the vision for
              SparkPoint’s Resilience Hub, and spend a summer evening with neighbors,
              partners, and friends.
            </p>
            <div className="taf-split-callout" aria-label="Fundraiser impact">
              <strong>50%</strong>
              <p>
                of all profits from August sales of Common Ground will be donated by Pisgah Coffee Roasters
                to help complete SparkPoint’s new Resilience Hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="taf-lineup" aria-labelledby="taf-lineup-title">
        <div className="taf-shell">
          <p className="taf-section-kicker">What’s brewing</p>
          <div className="taf-lineup-heading">
            <h2 id="taf-lineup-title">A good reason to gather.</h2>
            <p>No formal program. Just an easy evening with people who care about this place.</p>
          </div>
          <div className="taf-lineup-grid">
            <article>
              <Music2 aria-hidden="true" />
              <p>Live music</p>
              <h3>Mark &amp; Sally Wingate</h3>
              <span>A soundtrack for the first pour.</span>
            </article>
            <article>
              <Coffee aria-hidden="true" />
              <p>Taste the roast</p>
              <h3>Common Ground</h3>
              <span>Sample it, meet the roasters, take home a bag.</span>
            </article>
            <article>
              <UsersRound aria-hidden="true" />
              <p>Come as you are</p>
              <h3>Food, drinks &amp; friends</h3>
              <span>Connect with neighbors and the people behind the project.</span>
            </article>
          </div>
        </div>
      </section>

      <section className="taf-purchase" aria-labelledby="taf-purchase-title">
        <div className="taf-shell taf-purchase-grid">
          <div className="taf-purchase-art">
            <img
              src={packageImage}
              alt="Common Ground Resilience Roast bag art."
              loading="lazy"
            />
            <span aria-label="Available now">Available<br />now</span>
          </div>
          <div className="taf-purchase-copy">
            <p className="taf-section-kicker">Take home the roast</p>
            <h2 id="taf-purchase-title">Buy a bag. Build the Hub.</h2>
            <p>
              Common Ground Resilience Roast will be available through Pisgah Coffee
              Roasters beginning August 1. For the full month, half of the profits from
              every bag help SparkPoint build the new Resilience Hub in downtown Brevard.
            </p>
            <a
              className="taf-button taf-button-dark taf-purchase-button"
              href={COFFEE_PURCHASE_URL}
              target="_blank"
              rel="noreferrer"
            >
              Purchase the coffee <ExternalLink aria-hidden="true" />
              <span aria-hidden="true">Available now</span>
            </a>
          </div>
        </div>
      </section>

      <section className="taf-music" aria-labelledby="taf-music-title">
        <div className="taf-shell taf-music-grid">
          <div className="taf-music-copy">
            <p className="taf-section-kicker">Meet the musicians</p>
            <h2 id="taf-music-title">Mark &amp; Sally Wingate</h2>
            <p>
              Get a feel for the evening with Mark and Sally performing alongside acclaimed
              singer-songwriter Sarah Siskind.
            </p>
            <a href="https://youtu.be/DCcg_p2q7_U" target="_blank" rel="noreferrer">
              Watch on YouTube <ExternalLink aria-hidden="true" />
            </a>
          </div>
          <div className="taf-video-frame">
            {videoLoaded ? (
              <iframe
                src="https://www.youtube-nocookie.com/embed/DCcg_p2q7_U?autoplay=1"
                title="Mark and Sally Wingate performing with Sarah Siskind"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className="taf-video-poster"
                onClick={() => setVideoLoaded(true)}
                aria-label="Play Mark and Sally Wingate performing with Sarah Siskind"
              >
                <img src={productDetailImage} alt="" />
                <span>
                  <Play aria-hidden="true" fill="currentColor" />
                </span>
                <strong>Watch the performance</strong>
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="taf-hub" aria-labelledby="taf-hub-title">
        <div className="taf-hub-image">
          <img
            src={hubImage}
            alt="Conceptual illustration of SparkPoint’s future Resilience Hub at sunset."
            loading="lazy"
          />
          <span>Concept vision</span>
        </div>
        <div className="taf-hub-copy">
          <p className="taf-section-kicker">What your coffee helps build</p>
          <h2 id="taf-hub-title">A permanent home for connection.</h2>
          <p>
            The Resilience Hub is being shaped as a welcoming community resource center:
            a place to find services, discover ways to volunteer, bring organizations
            together, and turn shared challenges into coordinated action.
          </p>
          <p>
            Every bag of Common Ground sold in August helps move that vision forward.
          </p>
          <Link className="taf-text-link" to="/resilience-hub">
            Explore the Resilience Hub <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="taf-partners" aria-labelledby="taf-partners-title">
        <div className="taf-shell">
          <div className="taf-partners-card">
            <div>
              <p className="taf-section-kicker">Coffee roasted for connection</p>
              <h2 id="taf-partners-title">Two local organizations. One shared table.</h2>
              <p>
                This limited release brings SparkPoint’s connection-first mission together
                with the craft and community spirit of a local, family-owned roaster.
              </p>
            </div>
            <div className="taf-partner-logos" aria-label="Collaboration partners">
              <img src={`${BASE}logo-wordmark.webp`} alt="SparkPoint" />
              <span aria-hidden="true">+</span>
              <img src={pisgahLogo} alt="Pisgah Coffee Roasters" />
            </div>
          </div>
        </div>
      </section>

      <section className="taf-final" aria-labelledby="taf-final-title">
        <img src={productDetailImage} alt="" loading="lazy" />
        <div className="taf-final-shade" aria-hidden="true" />
        <div className="taf-shell taf-final-inner">
          <p className="taf-section-kicker">Friday, July 31 · 5–7 p.m.</p>
          <h2 id="taf-final-title">Meet us at five.</h2>
          <p>
            Pisgah Coffee Roasters<br />
            6283 Asheville Highway, Pisgah Forest
          </p>
          <div className="taf-hero-actions">
            <a className="taf-button taf-button-light" href={MAP_URL} target="_blank" rel="noreferrer">
              Get directions <MapPin aria-hidden="true" />
            </a>
            <a
              className="taf-button taf-button-ghost"
              href={FACEBOOK_EVENT_URL}
              target="_blank"
              rel="noreferrer"
            >
              Facebook event <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
