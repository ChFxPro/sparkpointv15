import '@fontsource-variable/fraunces';

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Ticket,
  Utensils,
} from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import uncHealthPardeeLogo from '../assets/sponsors/unc_health.png';
import pisgahHealthFoundationLogo from '../assets/sponsors/phf.png';
import './ruralHealthConvening.css';

const PAGE_PATH = '/rural-health-convening';
const PRIORITY_REGISTRATION_URL =
  'https://forms.monday.com/forms/a206690ce2304f99b5130fbdd2e0825b?r=use1';
const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;

function ruralHealthAsset(filename: string) {
  return `${BASE}assets/Rural%20Health/${encodeURIComponent(filename)}`;
}

const eventDetails = [
  {
    icon: CalendarDays,
    label: 'Date',
    primary: 'Thursday, October 1, 2026',
  },
  {
    icon: Clock3,
    label: 'Time',
    primary: '8:30 a.m.–3:00 p.m.',
  },
  {
    icon: MapPin,
    label: 'Location',
    primary: 'Deerwoode Reserve',
    secondary: '395 Riversedge Rd, Brevard, NC',
  },
  {
    icon: Ticket,
    label: 'Registration',
    primary: 'Priority list receives the first invitation',
    secondary: 'Only 200 seats will be available',
  },
  {
    icon: Utensils,
    label: 'Included',
    primary: 'Light breakfast and full lunch',
  },
];

const simulatorSteps = [
  {
    number: '1',
    title: 'Carry the story',
    body: 'Step into a fictional family’s circumstances and make the choices they face.',
  },
  {
    number: '2',
    title: 'Walk the system',
    body: 'Move through the doors, delays, and handoffs that shape whether care is reached.',
  },
  {
    number: '3',
    title: 'Read the map together',
    body: 'See what each journey reveals about burden, trust, and the connections a stronger system needs.',
  },
];

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: '2026 WNC Regional Rural Health Convening',
  description:
    'A day of connection, collaboration, and shared learning for rural health leaders across Western North Carolina, featuring the Rural Health Field Simulator.',
  startDate: '2026-10-01T08:30:00-04:00',
  endDate: '2026-10-01T15:00:00-04:00',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  image: `https://yoursparkpoint.org/assets/Rural%20Health/rural%20sim%20hero.webp`,
  location: {
    '@type': 'Place',
    name: 'Deerwoode Reserve',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '395 Riversedge Rd',
      addressLocality: 'Brevard',
      addressRegion: 'NC',
      addressCountry: 'US',
    },
  },
  organizer: [
    {
      '@type': 'NGO',
      name: 'SparkPoint',
      url: 'https://yoursparkpoint.org',
    },
    {
      '@type': 'Organization',
      name: 'North Carolina Rural Health Association',
    },
  ],
  sponsor: [
    {
      '@type': 'Organization',
      name: 'UNC Health Pardee',
    },
    {
      '@type': 'Organization',
      name: 'Pisgah Health Foundation',
    },
  ],
};

export function RuralHealthConveningPage() {
  return (
    <div className="rh-page">
      <SEOHead
        title="2026 Rural Health Convening | SparkPoint"
        description="Join rural health leaders in Brevard, NC, on October 1, 2026, for a day of connection, shared learning, and the Rural Health Field Simulator."
        path={PAGE_PATH}
        image="/assets/Rural%20Health/rural%20sim%20hero.webp"
        imageAlt="A field-atlas connection map showing the many doors, barriers, and handoffs that shape rural health access."
        imageType="image/webp"
        imageWidth={1536}
        imageHeight={1024}
        keywords={[
          'WNC Rural Health Convening',
          'rural health',
          'Western North Carolina',
          'Rural Health Field Simulator',
          'SparkPoint',
          'NCRHA',
        ]}
        jsonLd={eventJsonLd}
      />

      <a className="rh-skip-link" href="#main-content">
        Skip to event details
      </a>

      <header className="rh-masthead">
        <div className="rh-shell rh-masthead-inner">
          <Link className="rh-back-link" to="/" aria-label="Back to SparkPoint home">
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>Back to SparkPoint</span>
          </Link>

          <div className="rh-brand-lockup" aria-label="SparkPoint presents the 2026 WNC Regional Rural Health Convening">
            <img
              className="rh-back-logo"
              src={SPARKPOINT_LOGO}
              alt="SparkPoint"
              width={839}
              height={290}
            />
            <span aria-hidden="true">presents</span>
            <img
              className="rh-event-mark"
              src={ruralHealthAsset('NC Rural Health Convening trimmed.webp')}
              alt="2026 WNC Regional Rural Health Convening"
              width={2677}
              height={1494}
            />
          </div>

          <div className="rh-masthead-date" aria-label="Event date and location">
            <strong>October 1, 2026</strong>
            <span>Deerwoode Reserve</span>
            <span>Brevard, North Carolina</span>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="rh-hero" aria-labelledby="rh-hero-title">
          <div className="rh-shell rh-hero-grid">
            <div className="rh-hero-copy">
              <h1 id="rh-hero-title">
                <span>Where rural</span>
                <span>health comes</span>
                <span>together.</span>
              </h1>
              <div className="rh-star-rule" aria-hidden="true">
                <span />
                <b>✦</b>
                <span />
              </div>
              <p className="rh-hero-lede">
                Join rural health leaders from across Western North Carolina for a day of
                connection, collaboration, and shared learning—with the Rural Health Field
                Simulator at the center.
              </p>

              <dl className="rh-hero-facts">
                <div>
                  <dt>Date</dt>
                  <dd>Thursday, October 1, 2026</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>8:30 a.m.–3:00 p.m.</dd>
                </div>
                <div>
                  <dt>Place</dt>
                  <dd>Deerwoode Reserve · Brevard, NC</dd>
                </div>
              </dl>

              <div className="rh-actions">
                <a
                  className="rh-button rh-button-primary"
                  href={PRIORITY_REGISTRATION_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join the priority registration list
                  <ArrowRight aria-hidden="true" size={19} />
                </a>
                <a className="rh-button rh-button-secondary" href="#simulator">
                  Meet the simulator
                  <ArrowRight aria-hidden="true" size={19} />
                </a>
              </div>
            </div>

            <figure className="rh-hero-plate">
              <div className="rh-plate-label">
                <span>System map · not to scale</span>
                <span>Distance here is burden, not miles</span>
              </div>
              <img
                src={ruralHealthAsset('rural sim hero.webp')}
                alt="The Rural Health Field Simulator connection map, showing trusted doors, waiting gaps, warm handoffs, crisis points, and the Resilience Hub connected across a rural health system."
                width={1536}
                height={1024}
              />
              <figcaption>
                The Connection Map makes the invisible network visible: every door, every
                delay, and the route a family actually travels.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="rh-network-intro" aria-labelledby="rh-network-title">
          <div className="rh-shell rh-network-grid">
            <div className="rh-compass" aria-hidden="true">
              ✦
            </div>
            <div>
              <h2 id="rh-network-title">One day. A stronger rural health network.</h2>
              <p>
                The convening brings together people working across care, community,
                philanthropy, and government to see the system together and strengthen the
                relationships that help rural communities thrive.
              </p>
            </div>
            <div className="rh-network-outcomes" aria-label="What the convening offers">
              <p>
                <strong>Connect across roles</strong>
                Build relationships that bridge organizations and communities.
              </p>
              <p>
                <strong>Walk the system</strong>
                Explore rural health access through the Field Simulator.
              </p>
              <p>
                <strong>Carry insight forward</strong>
                Leave with clearer connections and practical next steps.
              </p>
            </div>
          </div>
        </section>

        <section
          id="event-details"
          className="rh-event-section"
          aria-labelledby="rh-event-title"
        >
          <div className="rh-shell rh-event-grid">
            <div className="rh-event-copy">
              <h2 id="rh-event-title">
                Gather with the people building rural health from the ground up.
              </h2>
              <div className="rh-star-rule rh-star-rule-short" aria-hidden="true">
                <span />
                <b>✦</b>
                <span />
              </div>
              <p>
                A day for healthcare providers, nonprofits, public and behavioral health
                professionals, funders, government partners, and community leaders to
                connect, collaborate, and learn together.
              </p>

              <dl className="rh-detail-list">
                {eventDetails.map(({ icon: Icon, label, primary, secondary }) => (
                  <div key={label}>
                    <dt>
                      <Icon aria-hidden="true" size={24} strokeWidth={1.7} />
                      <span>{label}</span>
                    </dt>
                    <dd>
                      <strong>{primary}</strong>
                      {secondary ? <span>{secondary}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className="rh-ticket-panel" aria-label="Priority registration">
              <img
                className="rh-ticket-event-mark"
                src={ruralHealthAsset('NC Rural Health Convening copy.webp')}
                alt=""
                width={3300}
                height={2550}
              />
              <div className="rh-ticket-row">
                <a
                  className="rh-ticket-stub"
                  href={PRIORITY_REGISTRATION_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Priority registration</span>
                  <strong>Join the list</strong>
                  <small>
                    Be among the first invited to register when the 200 available seats
                    open.
                  </small>
                  <ArrowRight aria-hidden="true" size={30} />
                </a>

                <div className="rh-priority-note">
                  <strong>200</strong>
                  <span>total seats</span>
                  <p>
                    The priority list will receive the first invitation before
                    registration opens more broadly.
                  </p>
                </div>
              </div>

              <p className="rh-scholarship-note">
                <Mail aria-hidden="true" size={22} strokeWidth={1.7} />
                <span>
                  Questions about registration or scholarships? Email{' '}
                  <a href="mailto:info@yoursparkpoint.org">info@yoursparkpoint.org</a>.
                </span>
              </p>
            </aside>
          </div>
        </section>

        <section id="simulator" className="rh-simulator" aria-labelledby="rh-simulator-title">
          <div className="rh-shell">
            <div className="rh-simulator-heading">
              <div>
                <h2 id="rh-simulator-title">The room becomes the rural health system.</h2>
                <div className="rh-star-rule rh-star-rule-short" aria-hidden="true">
                  <span />
                  <b>✦</b>
                  <span />
                </div>
              </div>
              <p>
                The Rural Health Field Simulator puts participants in the path of fictional
                composite families navigating real access barriers—time, transportation,
                paperwork, cost, trust, and the distance between one door and the next.
              </p>
            </div>

            <div className="rh-simulator-gallery" aria-label="Inside the Rural Health Field Simulator">
              <figure className="rh-sim-shot rh-sim-shot-entry">
                <div className="rh-sim-shot-frame">
                  <img
                    src={ruralHealthAsset('Screenshot 2026-07-27 at 2.20.40 PM.webp')}
                    alt="The Rural Health Field Simulator trailhead screen, where participants can begin a live simulation or enter demo mode."
                    width={1896}
                    height={1642}
                  />
                </div>
                <figcaption>
                  <span>01 · Enter the system</span>
                  Begin with a family, a need, and the first choice on the path.
                </figcaption>
              </figure>

              <figure className="rh-sim-shot rh-sim-shot-path">
                <div className="rh-sim-shot-frame">
                  <img
                    src={ruralHealthAsset('Screenshot 2026-07-27 at 2.21.02 PM.webp')}
                    alt="A simulator journey screen directing a fictional household to a trusted first door at the county schools."
                    width={1146}
                    height={1558}
                  />
                </div>
                <figcaption>
                  <span>02 · Walk the path</span>
                  Make each handoff and feel what distance, delay, and trust change.
                </figcaption>
              </figure>

              <figure className="rh-sim-shot rh-sim-shot-results">
                <div className="rh-sim-shot-frame">
                  <img
                    src={ruralHealthAsset('Screenshot 2026-07-27 at 2.21.23 PM.webp')}
                    alt="The simulator results screen showing the combined cost, time, work hours, care delays, and human outcomes across completed journeys."
                    width={1720}
                    height={1584}
                  />
                </div>
                <figcaption>
                  <span>03 · See the system</span>
                  Bring every journey together to reveal the burdens and connections no
                  single organization can see alone.
                </figcaption>
              </figure>
            </div>

            <ol className="rh-simulator-steps">
              {simulatorSteps.map((step) => (
                <li key={step.number}>
                  <span aria-hidden="true">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rh-thesis-row">
              <blockquote>
                Connection isn’t a nice-to-have.
                <strong>It’s infrastructure.</strong>
              </blockquote>
              <div className="rh-ongoing">
                <h3>Built for this convening. Designed to keep learning.</h3>
                <p>
                  After October 1, the simulator will continue as a SparkPoint program for
                  facilitated learning, partnership-building, and rural health systems
                  insight.
                </p>
                <a className="rh-text-link" href="#event-partners">
                  Explore the simulator at the convening
                  <ArrowRight aria-hidden="true" size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="event-partners"
          className="rh-partners"
          aria-labelledby="rh-partners-title"
        >
          <div className="rh-shell rh-partners-grid">
            <div className="rh-partners-copy">
              <h2 id="rh-partners-title">A convening built through partnership.</h2>
              <div className="rh-star-rule rh-star-rule-short" aria-hidden="true">
                <span />
                <b>✦</b>
                <span />
              </div>
              <p>
                Rural health changes when the people closest to the work can see the system
                together, learn across roles, and leave with stronger connections.
              </p>
            </div>

            <div className="rh-logo-field">
              <p className="rh-logo-label">Hosted in partnership by</p>
              <div className="rh-host-logos">
                <div className="rh-logo-stage rh-logo-stage-sparkpoint">
                  <img
                    className="rh-sparkpoint-logo"
                    src={SPARKPOINT_LOGO}
                    alt="SparkPoint"
                    width={839}
                    height={290}
                  />
                </div>
                <span aria-hidden="true" />
                <div className="rh-logo-stage rh-logo-stage-ncrha">
                  <img
                    className="rh-ncrha-logo"
                    src={ruralHealthAsset('NCRHA-Logo.webp')}
                    alt="North Carolina Rural Health Association"
                    width={2064}
                    height={331}
                  />
                </div>
              </div>
              <p className="rh-relationship">
                Hosted by SparkPoint in partnership with the North Carolina Rural Health
                Association, a program of the Foundation for Health Leadership &amp;
                Innovation.
              </p>
              <img
                className="rh-fhli-logo"
                src={ruralHealthAsset('FHLI Logo.webp')}
                alt="Foundation for Health Leadership and Innovation"
                width={1600}
                height={438}
              />

              <div className="rh-sponsor-field">
                <p className="rh-logo-label">With support from</p>
                <div className="rh-sponsor-logos">
                  <div className="rh-logo-stage rh-logo-stage-unc">
                    <img
                      src={uncHealthPardeeLogo}
                      alt="UNC Health Pardee"
                      width={1200}
                      height={560}
                    />
                  </div>
                  <span aria-hidden="true" />
                  <div className="rh-logo-stage rh-logo-stage-pisgah">
                    <img
                      src={pisgahHealthFoundationLogo}
                      alt="Pisgah Health Foundation"
                      width={1200}
                      height={560}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rh-final-cta" aria-labelledby="rh-final-title">
          <div className="rh-shell">
            <h2 id="rh-final-title">Join us on October 1.</h2>
            <p>
              Come ready to listen, share, and see the rural health system from a new point
              of view.
            </p>
            <div className="rh-actions rh-actions-centered">
              <a
                className="rh-button rh-button-primary"
                href={PRIORITY_REGISTRATION_URL}
                target="_blank"
                rel="noreferrer"
              >
                Join the priority registration list
                <ArrowRight aria-hidden="true" size={19} />
              </a>
              <a className="rh-final-email" href="mailto:info@yoursparkpoint.org">
                Scholarship questions? Email info@yoursparkpoint.org
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="rh-colophon">
        <div className="rh-shell">
          <Link to="/">
            <ArrowLeft aria-hidden="true" size={16} />
            Back to SparkPoint
          </Link>
          <p>The social infrastructure of rural health.</p>
        </div>
      </footer>
    </div>
  );
}

export default RuralHealthConveningPage;
