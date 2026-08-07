import '@fontsource-variable/fraunces';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Copy,
  ExternalLink,
  Info,
  Mail,
  MapPin,
  Ticket,
  Utensils,
} from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import uncHealthPardeeLogo from '../assets/sponsors/unc_health.png';
import pisgahHealthFoundationLogo from '../assets/sponsors/phf.png';
import transylvaniaRegionalHospitalLogo from '../assets/sponsors/trh.webp';
import transylvaniaTdaLogo from '../assets/sponsors/brevard_tda.webp';
import dogwoodHealthTrustLogo from '../assets/sponsors/dogwood.png';
import vayaHealthLogo from '../assets/sponsors/vaya_health.webp';
import impactHealthLogoDark from '../assets/rural_health/impact_health_dk.webp';
import wncrrhcLogoLight from '../assets/rural_health/wncrrhc_logo_lt.webp';
import './ruralHealthConvening.css';

const PAGE_PATH = '/rural-health-convening';
const REGISTRATION_URL =
  'https://secure.yoursparkpoint.org/store/p/2026-rural-health-convening';
const TICKET_STOCK_ENDPOINT = `https://${projectId}.supabase.co/functions/v1/rh-ticket-stock`;
const GENERAL_REGISTRATION_TOTAL = 150;
const IMPACT_HEALTH_URL = 'https://impacthealth.org';
const IMPACT_DISCOUNT_CODE = 'IMPACT-REG';
const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;

function ruralHealthAsset(filename: string) {
  return `${BASE}assets/Rural%20Health/${encodeURIComponent(filename)}`;
}

function useRemainingSeats() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(TICKET_STOCK_ENDPOINT, {
      headers: { apikey: publicAnonKey, Authorization: `Bearer ${publicAnonKey}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { remaining?: unknown }) => {
        if (!cancelled && typeof data.remaining === 'number') {
          setRemaining(data.remaining);
        }
      })
      .catch(() => {
        // Live count unavailable — callers fall back to the static total.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return remaining;
}

const summitSponsors = [
  {
    name: 'UNC Health Pardee',
    href: 'https://www.pardeehospital.org/',
    src: uncHealthPardeeLogo,
    stageClassName: 'rh-logo-stage-unc',
    width: 1200,
    height: 560,
  },
  {
    name: 'Transylvania Regional Hospital',
    href: 'https://www.missionhealth.org/locations/transylvania-regional-hospital',
    src: transylvaniaRegionalHospitalLogo,
    stageClassName: 'rh-logo-stage-trh',
    width: 1200,
    height: 429,
  },
];

const ridgelineSponsors = [
  {
    name: 'Pisgah Health Foundation',
    href: 'https://pisgahhealthfoundation.org/',
    src: pisgahHealthFoundationLogo,
    stageClassName: 'rh-logo-stage-pisgah',
    width: 1200,
    height: 560,
  },
];

const highlandsSponsors = [
  {
    name: 'Transylvania County Tourism Development Authority',
    creditName: 'Transylvania TDA',
    href: 'https://www.explorebrevard.com/',
    src: transylvaniaTdaLogo,
    stageClassName: 'rh-logo-stage-tda',
    width: 422,
    height: 107,
  },
];

const foothillsSponsors = [
  {
    name: 'Dogwood Health Trust',
    href: 'https://dogwoodhealthtrust.org',
    src: dogwoodHealthTrustLogo,
    stageClassName: 'rh-logo-stage-dogwood',
    width: 454,
    height: 119,
  },
  {
    name: 'Vaya Health',
    href: 'https://www.vayahealth.com',
    src: vayaHealthLogo,
    stageClassName: 'rh-logo-stage-vaya',
    width: 576,
    height: 346,
  },
];

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
    primary: '$65 Standard Rate or $40 Impact Health-Supported Inclusive Rate',
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

const programLineup = [
  {
    number: '1',
    title: 'Rural Health Briefing',
    body: 'A short statewide update from Maggie Sauer, NC Department of Health and Human Services, Office of Rural Health.',
  },
  {
    number: '2',
    title: 'Special Regional Update',
    body: 'Laurie Stradley, CEO of Impact Health, on the NC Rural Health Transformation Program (NC ROOTS) and what it means for Region 1.',
  },
  {
    number: '3',
    title: 'Story Collection: Listening to Build Connection',
    body: 'How SparkPoint uses story collection to understand our community and strengthen the connections between us.',
  },
  {
    number: '4',
    title: 'Rural Health Field Simulator',
    body: 'Step into the system rural families navigate every day—see it, walk it, and talk through what you find.',
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
    {
      '@type': 'Organization',
      name: 'Transylvania Regional Hospital',
    },
    {
      '@type': 'Organization',
      name: 'Transylvania County Tourism Development Authority',
    },
    {
      '@type': 'Organization',
      name: 'Dogwood Health Trust',
    },
  ],
};

export function RuralHealthConveningPage() {
  const remainingSeats = useRemainingSeats();
  const [impactCodeStatus, setImpactCodeStatus] = useState<'idle' | 'copied' | 'manual'>('idle');

  function handleCopyImpactCode(event: React.MouseEvent<HTMLAnchorElement>) {
    // Once the manual-copy fallback has been shown, let the link navigate normally—
    // the user has already seen the code and doesn't need another intercepted click.
    if (impactCodeStatus === 'manual') {
      return;
    }

    event.preventDefault();

    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setImpactCodeStatus('manual');
      return;
    }

    navigator.clipboard
      .writeText(IMPACT_DISCOUNT_CODE)
      .then(() => {
        setImpactCodeStatus('copied');
        window.open(REGISTRATION_URL, '_blank', 'noopener');
      })
      .catch(() => {
        setImpactCodeStatus('manual');
      });
  }

  const impactCodeStatusMessage =
    impactCodeStatus === 'copied'
      ? `Code ${IMPACT_DISCOUNT_CODE} copied—paste it in the Promo Code field at checkout to bring your total to $40.`
      : impactCodeStatus === 'manual'
        ? `Copy code ${IMPACT_DISCOUNT_CODE} and paste it in the Promo Code field at checkout to bring your total to $40.`
        : `Enter code ${IMPACT_DISCOUNT_CODE} in the Promo Code field at checkout to bring your total to $40.`;

  const seatsAvailableLabel =
    remainingSeats === null
      ? `Only ${GENERAL_REGISTRATION_TOTAL} seats available`
      : remainingSeats > 0
        ? `Only ${remainingSeats} seat${remainingSeats === 1 ? '' : 's'} left`
        : 'Registration full — email us about the waitlist';

  return (
    <div className="rh-page">
      <SEOHead
        title="2026 Rural Health Convening | SparkPoint"
        description="Join rural health leaders in Brevard, NC on Oct. 1, 2026, presented by UNC Health Pardee & Transylvania Regional Hospital, with Pisgah Health Foundation."
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
          'UNC Health Pardee',
          'Pisgah Health Foundation',
          'Transylvania Regional Hospital',
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
                <a className="rh-button rh-button-primary" href="#event-details">
                  Register now
                  <ArrowRight aria-hidden="true" size={19} />
                </a>
                <a className="rh-button rh-button-secondary" href="#simulator">
                  Meet the simulator
                  <ArrowRight aria-hidden="true" size={19} />
                </a>
              </div>

            </div>

            <div className="rh-hero-plate-wrap">
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

              <div className="rh-hero-sponsors" aria-label="Event sponsors and partners">
                <div className="rh-hero-sponsors-group">
                  <span className="rh-hero-sponsors-label">Presented by</span>
                  <div className="rh-hero-sponsors-logos">
                    <div className="rh-hero-logo-tier">
                      {summitSponsors.map((sponsor) => (
                        <a
                          key={sponsor.name}
                          className="rh-hero-logo-link tier-summit"
                          href={sponsor.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${sponsor.name}`}
                        >
                          <img src={sponsor.src} alt={sponsor.name} width={sponsor.width} height={sponsor.height} />
                        </a>
                      ))}
                    </div>
                    <span className="rh-hero-logo-divider" aria-hidden="true" />
                    <div className="rh-hero-logo-tier">
                      {ridgelineSponsors.map((sponsor) => (
                        <a
                          key={sponsor.name}
                          className="rh-hero-logo-link tier-ridgeline"
                          href={sponsor.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${sponsor.name}`}
                        >
                          <img src={sponsor.src} alt={sponsor.name} width={sponsor.width} height={sponsor.height} />
                        </a>
                      ))}
                    </div>
                    <span className="rh-hero-logo-divider" aria-hidden="true" />
                    <div className="rh-hero-logo-tier">
                      {highlandsSponsors.map((sponsor) => (
                        <a
                          key={sponsor.name}
                          className="rh-hero-logo-link tier-highlands"
                          href={sponsor.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${sponsor.name}`}
                        >
                          <img src={sponsor.src} alt={sponsor.creditName} width={sponsor.width} height={sponsor.height} />
                        </a>
                      ))}
                    </div>
                    <span className="rh-hero-logo-divider" aria-hidden="true" />
                    <div className="rh-hero-logo-tier">
                      {foothillsSponsors.map((sponsor) => (
                        <a
                          key={sponsor.name}
                          className={`rh-hero-logo-link tier-foothills ${sponsor.stageClassName}`}
                          href={sponsor.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${sponsor.name}`}
                        >
                          <img src={sponsor.src} alt={sponsor.name} width={sponsor.width} height={sponsor.height} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <span className="rh-hero-sponsors-divider" aria-hidden="true" />

                <div className="rh-hero-sponsors-group rh-hero-partners-group">
                  <span className="rh-hero-sponsors-label">In partnership with</span>
                  <div className="rh-hero-partner-logos">
                    <a
                      className="rh-hero-partner-link"
                      href="https://www.ruralhealthnc.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit North Carolina Rural Health Association"
                    >
                      <img
                        className="rh-hero-partner-logo logo-ncrha"
                        src={ruralHealthAsset('NCRHA-Logo.webp')}
                        alt="North Carolina Rural Health Association"
                        width={2064}
                        height={331}
                      />
                    </a>
                    <a
                      className="rh-hero-partner-link"
                      href="https://foundationhli.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit Foundation for Health Leadership and Innovation"
                    >
                      <img
                        className="rh-hero-partner-logo logo-fhli"
                        src={ruralHealthAsset('FHLI Logo.webp')}
                        alt="Foundation for Health Leadership and Innovation"
                        width={1600}
                        height={438}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
          id="regional-update"
          className="rh-regional-update"
          aria-labelledby="rh-regional-update-title"
        >
          <div className="rh-shell">
            <div className="rh-regional-update-copy">
              <p className="rh-regional-update-eyebrow">
                What to expect · October 1 program
              </p>
              <h2 id="rh-regional-update-title">
                A historic moment for rural health in North Carolina.
              </h2>
              <p>
                North Carolina’s rural health community is calling this a historic
                moment—and on October 1, Western North Carolina steps into it together.
                The day brings a statewide briefing from NCDHHS, a special regional
                update on NC ROOTS, a first look at how story collection is helping us
                understand and connect our community, and the participatory Rural
                Health Field Simulator.
              </p>
            </div>

            <div className="rh-program-list-heading">
              <p>What you’ll experience</p>
            </div>
            <ol className="rh-program-list" aria-label="What you'll experience on October 1">
              {programLineup.map((item) => (
                <li key={item.number}>
                  <span aria-hidden="true">{item.number}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
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
                      {label === 'Registration' ? (
                        <span>{seatsAvailableLabel}</span>
                      ) : secondary ? (
                        <span>{secondary}</span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className="rh-ticket-panel" aria-label="Registration">
              <img
                className="rh-ticket-event-mark"
                src={ruralHealthAsset('NC Rural Health Convening copy.webp')}
                alt=""
                width={3300}
                height={2550}
              />
              <div className="rh-rate-intro">
                <p className="rh-rate-eyebrow-lead">
                  Inclusive Registration, supported by Impact Health
                </p>
                <p>
                  Impact Health is helping make the Rural Health Convening more accessible by
                  supporting a $40 Inclusive Registration Rate—so cost isn't a barrier to
                  attending. Choose the registration rate that works for you—no application or
                  explanation required. Both registration options include the complete
                  convening experience.
                </p>
              </div>

              <div className="rh-rate-grid">
                <div className="rh-rate-card rh-rate-card-standard">
                  <img
                    className="rh-rate-card-mark"
                    src={wncrrhcLogoLight}
                    alt="2026 WNC Regional Rural Health Convening"
                    width={3300}
                    height={1744}
                  />
                  <p className="rh-rate-eyebrow">Standard Registration</p>
                  <p className="rh-rate-price">$65</p>
                  <div className="rh-rate-note rh-rate-note-pointer">
                    <span className="rh-rate-note-pointer-text">Barrier-free $40 rate</span>
                    <ArrowRight aria-hidden="true" size={14} />
                  </div>
                  <a
                    className="rh-button rh-button-secondary rh-rate-button"
                    href={REGISTRATION_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Continue to registration
                    <ExternalLink aria-hidden="true" size={16} />
                  </a>
                  <p className="rh-rate-status">Pay $65 at checkout.</p>
                </div>

                <div className="rh-rate-card rh-rate-card-inclusive">
                  <a
                    className="rh-rate-impact-link"
                    href={IMPACT_HEALTH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Impact Health"
                  >
                    <img
                      className="rh-rate-card-mark"
                      src={impactHealthLogoDark}
                      alt="Impact Health"
                      width={3300}
                      height={1744}
                    />
                  </a>
                  <p className="rh-rate-eyebrow">Inclusive Registration</p>
                  <p className="rh-rate-price">$40</p>
                  <div className="rh-rate-note">
                    <span>Code</span>
                    <span className="rh-rate-note-value">
                      <code>{IMPACT_DISCOUNT_CODE}</code>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="rh-rate-info-trigger"
                            aria-label="Where do I enter this code?"
                          >
                            <Info aria-hidden="true" size={11} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-52 text-left">
                          You'll fill out a short registration form first. The Promo Code
                          field is on the final checkout step.
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </div>
                  <a
                    className="rh-button rh-button-primary rh-rate-button"
                    href={REGISTRATION_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleCopyImpactCode}
                  >
                    <Copy aria-hidden="true" size={16} />
                    Copy code &amp; continue
                    <ExternalLink aria-hidden="true" size={16} />
                  </a>
                  <p className="rh-rate-status" role="status" aria-live="polite">
                    {impactCodeStatusMessage}
                  </p>
                </div>
              </div>

              <div className="rh-priority-note rh-seats-panel">
                <strong>
                  {remainingSeats === null ? GENERAL_REGISTRATION_TOTAL : remainingSeats}
                </strong>
                <span>{remainingSeats === null ? 'seats available' : 'seats left'}</span>
                <p>Reserve your seat at the 2026 Rural Health Convening.</p>
              </div>

              <p className="rh-scholarship-note">
                <Mail aria-hidden="true" size={22} strokeWidth={1.7} />
                <span>
                  Questions about registration or accessibility? Email{' '}
                  <a href="mailto:info@yoursparkpoint.org">info@yoursparkpoint.org</a>. If the
                  Impact Health-supported credit doesn't apply at checkout, send us your order
                  confirmation and we'll make it right.
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
                    src={ruralHealthAsset('simulator_screencap.webp')}
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
              <div className="rh-sponsor-field">
                <p className="rh-logo-label">Summit sponsors</p>
                <div className="rh-summit-logos">
                  {summitSponsors.flatMap((sponsor, index) => [
                    index > 0 ? (
                      <span aria-hidden="true" key={`${sponsor.name}-divider`} />
                    ) : null,
                    <a
                      key={sponsor.name}
                      className={`rh-logo-stage rh-logo-stage-summit ${sponsor.stageClassName}`}
                      href={sponsor.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${sponsor.name}`}
                    >
                      <img
                        src={sponsor.src}
                        alt={sponsor.name}
                        width={sponsor.width}
                        height={sponsor.height}
                      />
                    </a>,
                  ])}
                </div>
                <p className="rh-relationship">
                  UNC Health Pardee and Transylvania Regional Hospital are Summit sponsors of
                  the 2026 WNC Regional Rural Health Convening, providing lead support for a
                  day of connection and shared learning.
                </p>

                <div className="rh-ridgeline-field">
                  <p className="rh-logo-label rh-logo-label-secondary">
                    With Ridgeline support from
                  </p>
                  <div className="rh-ridgeline-logos">
                    {ridgelineSponsors.map((sponsor) => (
                      <a
                        key={sponsor.name}
                        className={`rh-logo-stage rh-logo-stage-ridgeline ${sponsor.stageClassName}`}
                        href={sponsor.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${sponsor.name}`}
                      >
                        <img
                          src={sponsor.src}
                          alt={sponsor.name}
                          width={sponsor.width}
                          height={sponsor.height}
                        />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rh-highlands-field">
                  <p className="rh-logo-label rh-logo-label-tertiary">
                    With Highlands support from
                  </p>
                  <div className="rh-highlands-logos">
                    {highlandsSponsors.map((sponsor) => (
                      <a
                        key={sponsor.name}
                        className={`rh-logo-stage rh-logo-stage-highlands ${sponsor.stageClassName}`}
                        href={sponsor.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${sponsor.name}`}
                      >
                        <img
                          src={sponsor.src}
                          alt={sponsor.name}
                          width={sponsor.width}
                          height={sponsor.height}
                        />
                      </a>
                    ))}
                  </div>
                  <p className="rh-visit-invitation">
                    Make a little more of your time in Transylvania County.{' '}
                    <a
                      href="https://www.explorebrevard.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Plan your visit with Explore Brevard
                      <ArrowRight aria-hidden="true" size={16} />
                    </a>
                  </p>
                </div>

                <div className="rh-foothills-field">
                  <p className="rh-logo-label rh-logo-label-tertiary">
                    With Foothills support from
                  </p>
                  <div className="rh-foothills-logos">
                    {foothillsSponsors.map((sponsor) => (
                      <a
                        key={sponsor.name}
                        className={`rh-logo-stage rh-logo-stage-foothills ${sponsor.stageClassName}`}
                        href={sponsor.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${sponsor.name}`}
                      >
                        <img
                          src={sponsor.src}
                          alt={sponsor.name}
                          width={sponsor.width}
                          height={sponsor.height}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rh-host-field">
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
                  <a
                    className="rh-logo-stage rh-logo-stage-ncrha"
                    href="https://www.ruralhealthnc.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit North Carolina Rural Health Association"
                  >
                    <img
                      className="rh-ncrha-logo"
                      src={ruralHealthAsset('NCRHA-Logo.webp')}
                      alt="North Carolina Rural Health Association"
                      width={2064}
                      height={331}
                    />
                  </a>
                </div>
                <p className="rh-relationship">
                  Hosted by SparkPoint in partnership with the North Carolina Rural Health
                  Association, a program of the Foundation for Health Leadership &amp;
                  Innovation.
                </p>
                <a
                  className="rh-fhli-link"
                  href="https://foundationhli.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Foundation for Health Leadership and Innovation"
                >
                  <img
                    className="rh-fhli-logo"
                    src={ruralHealthAsset('FHLI Logo.webp')}
                    alt="Foundation for Health Leadership and Innovation"
                    width={1600}
                    height={438}
                  />
                </a>
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
              <a className="rh-button rh-button-primary" href="#event-details">
                Register now
                <ArrowRight aria-hidden="true" size={19} />
              </a>
              <a className="rh-final-email" href="mailto:info@yoursparkpoint.org">
                Accessibility questions? Email info@yoursparkpoint.org
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
