import {
  ArrowRight,
  Award,
  Coffee,
  ExternalLink,
  Home,
  Landmark,
  MapPin,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
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
const COFFEE_PURCHASE_URL = COMMON_GROUND_PURCHASE_URL;
const PISGAH_STORY_URL = 'https://pisgahroasters.com/pages/our-story';

const heroImage = `${ASSET_BASE}pisgah-coffee-hero-poster.webp?v=2026-08-09-3`;
const packageImage = `${ASSET_BASE}SparkPoint - Common Ground.webp`;
const hubImage = `${ASSET_BASE}ChatGPT Image May 28, 2026 at 03_24_30 PM.webp`;
const pisgahLogo = `${ASSET_BASE}PisgahCoffeeRoasters.webp`;
const productDetailImage = `${ASSET_BASE}Sparkpoint Photos-1.webp`;
const HERO_LOOP_VERSION = '2026-08-09-2';
const heroLoopWebm = `${ASSET_BASE}pisgah-coffee-hero-loop.webm?v=${HERO_LOOP_VERSION}`;
const heroLoopMp4 = `${ASSET_BASE}pisgah-coffee-hero-loop.mp4?v=${HERO_LOOP_VERSION}`;
const highlightVideoWebm = `${ASSET_BASE}pisgah-coffee-highlight.webm`;
const highlightVideoMp4 = `${ASSET_BASE}pisgah-coffee-highlight.mp4`;
const highlightVideoPoster = `${ASSET_BASE}pisgah-coffee-highlight-poster.webp`;

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Common Ground Resilience Roast',
  description:
    'A limited-edition light roast micro-lot created by Pisgah Coffee Roasters and SparkPoint, benefiting the new Resilience Hub in Transylvania County.',
  image: [canonicalUrl('/assets/events/pisgah_coffee_fundraiser/Sparkpoint Photos-2.webp')],
  brand: {
    '@type': 'Brand',
    name: 'Pisgah Coffee Roasters',
  },
  manufacturer: {
    '@type': 'Organization',
    name: 'Pisgah Coffee Roasters',
    url: 'https://pisgahroasters.com/',
  },
  url: canonicalUrl(EVENT_PATH),
};

const highlightVideoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Thrive @ Five 2026: Common Ground Resilience Roast release highlights',
  description:
    'Highlights from the July 31, 2026 Thrive @ Five release party at Pisgah Coffee Roasters, celebrating the Common Ground Resilience Roast and SparkPoint’s Resilience Hub fundraiser in Transylvania County, NC.',
  thumbnailUrl: [
    canonicalUrl('/assets/events/pisgah_coffee_fundraiser/pisgah-coffee-highlight-poster.webp'),
  ],
  uploadDate: '2026-08-09',
  duration: 'PT1M15S',
  contentUrl: canonicalUrl('/assets/events/pisgah_coffee_fundraiser/pisgah-coffee-highlight.mp4'),
  publisher: {
    '@type': 'Organization',
    name: 'SparkPoint',
    logo: {
      '@type': 'ImageObject',
      url: canonicalUrl('/logo-wordmark.webp'),
    },
  },
};

export default function ThriveAtFivePage() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    // Belt-and-suspenders for Safari: setting `muted` only as a JSX/HTML
    // attribute doesn't always land as the DOM property in time for the
    // browser's autoplay check. Set it explicitly and kick off play()
    // ourselves. If a browser still blocks it, fail silently and let the
    // poster frame stand in — no stuck "blocked" UI.
    video.muted = true;
    video.defaultMuted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — poster frame remains visible as the fallback.
      });
    }
  }, []);

  return (
    <div className="taf-page">
      <SEOHead
        title="Common Ground Resilience Roast | SparkPoint × Pisgah Coffee Roasters"
        description="A limited-edition coffee from Pisgah Coffee Roasters and SparkPoint, supporting the new Resilience Hub. Meet the family behind the roast and get your bag."
        path={EVENT_PATH}
        image="/assets/events/pisgah_coffee_fundraiser/Sparkpoint Photos-2.webp"
        imageAlt="Common Ground Resilience Roast coffee, created by SparkPoint and Pisgah Coffee Roasters."
        jsonLd={[productJsonLd, highlightVideoJsonLd]}
      />

      <section className="taf-hero" aria-labelledby="taf-title">
        <video
          ref={heroVideoRef}
          className="taf-hero-video"
          poster={heroImage}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onError={(event) => {
            // eslint-disable-next-line no-console
            console.error('Hero video failed to load', event.currentTarget.error, {
              mp4: heroLoopMp4,
              webm: heroLoopWebm,
            });
          }}
          onCanPlay={() => {
            // eslint-disable-next-line no-console
            console.info('Hero video can play');
          }}
        >
          <source src={heroLoopMp4} type="video/mp4" />
          <source src={heroLoopWebm} type="video/webm" />
        </video>
        <div className="taf-hero-shade" aria-hidden="true" />
        <div className="taf-shell taf-hero-inner">
          <div className="taf-hero-copy">
            <Link className="taf-back-link" to="/events">
              <span aria-hidden="true">←</span> All events
            </Link>
            <p className="taf-eyebrow">A SparkPoint &times; Pisgah Coffee Roasters collaboration</p>
            <h1 id="taf-title">
              <span>Thrive @ Five &middot; Third annual release</span>
              Common Ground
              <small>Resilience Roast</small>
            </h1>
            <p className="taf-hero-lede">
              Coffee roasted for connection. A limited-edition micro-lot from Pisgah Coffee
              Roasters — a family-owned roastery in the Blue Ridge Mountains — supporting
              SparkPoint&rsquo;s new Resilience Hub all August long.
            </p>
            <div className="taf-hero-actions">
              <a className="taf-button taf-button-cta" href={COFFEE_PURCHASE_URL} target="_blank" rel="noreferrer">
                <Coffee aria-hidden="true" /> Buy now
              </a>
              <a className="taf-button taf-button-ghost" href={MAP_URL} target="_blank" rel="noreferrer">
                Visit Pisgah Coffee Roasters <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="taf-event-ticket" aria-label="About Pisgah Coffee Roasters">
            <p>Family-owned since</p>
            <strong>2010</strong>
            <dl>
              <div>
                <MapPin aria-hidden="true" />
                <dt className="sr-only">Location</dt>
                <dd>
                  Pisgah Coffee Roasters
                  <span>6283 Asheville Highway, Pisgah Forest</span>
                </dd>
              </div>
              <div>
                <Coffee aria-hidden="true" />
                <dt className="sr-only">Roasting philosophy</dt>
                <dd>
                  Global Coffee. Local Flavor.
                  <span>Family-owned &amp; roasted in the Blue Ridge Mountains</span>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="taf-highlights" aria-labelledby="taf-highlights-title">
        <div className="taf-shell taf-highlights-grid">
          <div className="taf-highlights-video">
            <video
              className="taf-highlights-player"
              poster={highlightVideoPoster}
              controls
              playsInline
              preload="metadata"
            >
              <source src={highlightVideoWebm} type="video/webm" />
              <source src={highlightVideoMp4} type="video/mp4" />
              Your browser doesn&rsquo;t support embedded video.{' '}
              <a href={highlightVideoMp4}>Download the video</a> instead.
            </video>
          </div>
          <div className="taf-highlights-copy">
            <p className="taf-section-kicker">Friday, July 31 &middot; Full recap</p>
            <h2 id="taf-highlights-title">Watch the night in full.</h2>
            <p>
              From the first pour to the last song, this is what a season of
              connection looks like in Transylvania County — neighbors, coffee,
              and Mark &amp; Sally Wingate closing out the night alongside Sarah
              Siskind.
            </p>
            <p>
              Every bag of Common Ground sold through August helps fund
              SparkPoint&rsquo;s new Resilience Hub — Pisgah Coffee Roasters is
              giving half of August&rsquo;s profits straight to the build.
            </p>
            <div className="taf-hero-actions">
              <a className="taf-button taf-button-cta" href={COFFEE_PURCHASE_URL} target="_blank" rel="noreferrer">
                <Coffee aria-hidden="true" /> Buy now
              </a>
              <a className="taf-button taf-button-ghost" href={MAP_URL} target="_blank" rel="noreferrer">
                Visit Pisgah Coffee Roasters <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
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
              Pick up a limited-edition bag, taste what a season of collaboration tastes
              like, and help move SparkPoint&rsquo;s Resilience Hub one step closer to open.
            </p>
            <div className="taf-split-callout" aria-label="Fundraiser impact">
              <strong>50%</strong>
              <p>
                of all profits from August sales of Common Ground will be donated by Pisgah Coffee Roasters
                to help complete SparkPoint&rsquo;s new Resilience Hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="taf-story" aria-labelledby="taf-story-title">
        <div className="taf-shell taf-story-grid">
          <div className="taf-story-copy">
            <p className="taf-section-kicker">The roasters behind the roast</p>
            <h2 id="taf-story-title">Coffee runs in the Lipsi family.</h2>
            <p>
              Jotham Lipsi grew up on his family&rsquo;s coffee estate in Minas Gerais, Brazil
              — over 300,000 trees, tended by a lineage that traces back to ancestors who
              emigrated from Italy to Brazil&rsquo;s coffee country in the late 1800s. His
              father, Jonathan, an agronomist, ran the farm and supplied wholesale beans long
              before either of them roasted a cup for the public.
            </p>
            <p>
              In 2004, Jotham came to Brevard College and fell for the mountains. Six years
              later, father and son opened Pisgah Coffee Roasters in Pisgah Forest — a
              family-owned roastery built on the same values they&rsquo;d always worked by,
              just an ocean away. Their beans still come from Brazil&rsquo;s Cerrado region,
              where familial bonds endure with the land. Their motto says the rest:
              Global Coffee. Local Flavor.
            </p>
            <a className="taf-story-link" href={PISGAH_STORY_URL} target="_blank" rel="noreferrer">
              Read more from Pisgah Coffee Roasters <ExternalLink aria-hidden="true" />
            </a>
          </div>
          <div className="taf-stat-stack" aria-label="Pisgah Coffee Roasters at a glance">
            <div className="taf-stat-card">
              <strong>2010</strong>
              <span>Founded in Pisgah Forest, NC</span>
            </div>
            <div className="taf-stat-card">
              <strong>300,000+</strong>
              <span>Coffee trees on the family&rsquo;s estate in Minas Gerais, Brazil</span>
            </div>
            <div className="taf-stat-card">
              <strong>100+ years</strong>
              <span>Of family coffee-growing heritage</span>
            </div>
          </div>
        </div>
      </section>

      <section className="taf-lineup" aria-labelledby="taf-lineup-title">
        <div className="taf-shell">
          <p className="taf-section-kicker">Three years, three roasts</p>
          <div className="taf-lineup-heading">
            <h2 id="taf-lineup-title">A collaboration that keeps giving back.</h2>
            <p>
              Every August, Pisgah Coffee Roasters and SparkPoint release a limited coffee
              honoring someone — or something — building Transylvania County&rsquo;s future.
            </p>
          </div>
          <div className="taf-lineup-grid">
            <article>
              <Award aria-hidden="true" />
              <p>2023</p>
              <h3>Pipin&rsquo; Hot Blend</h3>
              <span>Honoring Dr. Ora Wells&rsquo;s impact on Transylvania County.</span>
            </article>
            <article>
              <Landmark aria-hidden="true" />
              <p>2024</p>
              <h3>The Mayor&rsquo;s Daily Grind</h3>
              <span>Honoring Brevard Mayor Maureen Copelof.</span>
            </article>
            <article>
              <Home aria-hidden="true" />
              <p>2026</p>
              <h3>Common Ground Resilience Roast</h3>
              <span>
                After a 2025 pause for Hurricane Helene recovery, investing in SparkPoint&rsquo;s
                new Resilience Hub.
              </span>
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
                This limited release brings SparkPoint&rsquo;s connection-first mission
                together with the craft and community spirit of a family-owned roaster
                that&rsquo;s called Pisgah Forest home since 2010.
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
          <p className="taf-section-kicker">Pisgah Forest, North Carolina</p>
          <h2 id="taf-final-title">Stop by the roastery.</h2>
          <p>
            Pisgah Coffee Roasters<br />
            6283 Asheville Highway, Pisgah Forest
          </p>
          <div className="taf-hero-actions">
            <a className="taf-button taf-button-light" href={MAP_URL} target="_blank" rel="noreferrer">
              Get directions <MapPin aria-hidden="true" />
            </a>
            <a className="taf-button taf-button-ghost" href={COFFEE_PURCHASE_URL} target="_blank" rel="noreferrer">
              Buy the roast <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
