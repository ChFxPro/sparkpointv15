import '@fontsource-variable/fraunces';

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { RecapMedia, hasRecapMedia, hasRecapVideo, recapPhotoCount } from './RuralHealthRecap';
import { SponsorFlyover } from './RuralHealthSponsorFlyover';
import uncHealthPardeeLogo from '../assets/sponsors/unc_health.png';
import pisgahHealthFoundationLogo from '../assets/sponsors/phf.png';
import transylvaniaRegionalHospitalLogo from '../assets/sponsors/trh.webp';
import transylvaniaTdaLogo from '../assets/sponsors/brevard_tda.webp';
import dogwoodHealthTrustLogo from '../assets/sponsors/dogwood.png';
import vayaHealthLogo from '../assets/sponsors/vaya_health.webp';
import firstCitizensBankLogo from '../assets/sponsors/first_citizens.webp';
import hendersonvillePediatricsLogo from '../assets/sponsors/hendersonville_peds.webp';
import adventHealthLogo from '../assets/sponsors/advent_health.webp';
import unitedHealthcareLogo from '../assets/sponsors/united_healthcare.webp';
import comporiumLogo from '../assets/sponsors/comporium.webp';
import './ruralHealthConvening.css';

const PAGE_PATH = '/rural-health-convening';
const IMPACT_HEALTH_URL = 'https://impacthealth.org';
const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;

// Highlight photos placed through the recap (one per section, not a gallery). Each is
// an `-800` / `-1600` WebP pair in public/assets/Rural Health/recap/highlights/, all
// 1600×1067 at full size, selected from the October 1 event photography.
function highlightSrc(name: string, width: 800 | 1600) {
  return `${BASE}assets/Rural%20Health/recap/highlights/${name}-${width}.webp`;
}

function highlightSrcSet(name: string) {
  return `${highlightSrc(name, 800)} 800w, ${highlightSrc(name, 1600)} 1600w`;
}

const outcomes = [
  {
    title: 'Connected across roles',
    body: 'Relationships that bridge organizations and communities, started at the same table.',
    photo: 'across-the-table',
    alt: 'Two attendees in conversation across a round table in the event hall, one leaning in to listen.',
  },
  {
    title: 'Walked the system',
    body: 'Rural health access, explored together through the Field Simulator.',
    photo: 'simulator-tablet',
    alt: 'A small group gathers around a tablet as one participant points to the screen while working through the Rural Health Field Simulator.',
  },
  {
    title: 'Carrying insight forward',
    body: 'Through the Connection to Action cards, 30 new collaborative groups formed, each moving toward better access and care for rural communities.',
    photo: 'action-cards',
    alt: 'A hand-lettered “Connection to Action Cards” sign above rows of filled-in cards taped to a window, with the gravel patio and Adirondack chairs outside.',
  },
];

function ruralHealthAsset(filename: string) {
  return `${BASE}assets/Rural%20Health/${encodeURIComponent(filename)}`;
}

// The convening took place October 1, 2026 and this page is now its recap. The photo
// and video section lives in ./RuralHealthRecap.tsx.

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
  {
    name: 'First Citizens Bank',
    href: 'https://www.firstcitizens.com',
    src: firstCitizensBankLogo,
    stageClassName: 'rh-logo-stage-first-citizens',
    width: 340,
    height: 160,
  },
  {
    name: 'Hendersonville Pediatrics',
    href: 'https://www.hendersonvillepediatrics.com/',
    src: hendersonvillePediatricsLogo,
    stageClassName: 'rh-logo-stage-hendersonville-peds',
    width: 497,
    height: 129,
  },
];

const friendsSponsors = [
  {
    name: 'AdventHealth',
    href: 'https://www.adventhealth.com',
    src: adventHealthLogo,
    stageClassName: 'rh-logo-stage-advent',
    width: 1226,
    height: 309,
  },
  {
    name: 'UnitedHealthcare',
    href: 'https://www.uhc.com',
    src: unitedHealthcareLogo,
    stageClassName: 'rh-logo-stage-uhc',
    width: 1280,
    height: 403,
  },
  {
    name: 'Comporium',
    href: 'https://www.comporium.com',
    src: comporiumLogo,
    stageClassName: 'rh-logo-stage-comporium',
    width: 280,
    height: 189,
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
    icon: Users,
    label: 'Attendance',
    primary: 'A full house',
    secondary: 'Care, community, philanthropy, and government in one room',
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

// Resources Maggie Sauer (Director, NC DHHS Office of Rural Health) asked us to share
// with attendees, from Sarah's follow-up email. The block renders only while every
// entry has a confirmed `href` — never fill one in with a guess. The NCMJ link is the
// newsletter announcing the Fall 2026 issue, with the email's per-recipient `?e=`
// tracking parameter removed.
const briefingResources: { title: string; source: string; href: string | null }[] = [
  {
    title: 'New from the NC Medical Journal',
    source: 'North Carolina Medical Journal · Fall 2026 issue',
    href: 'https://mailchi.mp/nciom/new-from-the-nc-medical-journal-61777',
  },
  {
    title: 'National Academies Initiative on Rural Well-Being',
    source: 'National Academies of Sciences, Engineering, and Medicine',
    href: 'https://nap.nationalacademies.org/resource/other/initiative-on-rural-wellbeing/',
  },
];
const showBriefingResources = briefingResources.every((resource) => resource.href);

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
    'A full-house day of connection, collaboration, and shared learning for rural health leaders across Western North Carolina, featuring the Rural Health Field Simulator.',
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
    {
      '@type': 'Organization',
      name: 'Vaya Health',
    },
    {
      '@type': 'Organization',
      name: 'First Citizens Bank',
    },
    {
      '@type': 'Organization',
      name: 'Hendersonville Pediatrics',
    },
    {
      '@type': 'Organization',
      name: 'AdventHealth',
    },
    {
      '@type': 'Organization',
      name: 'UnitedHealthcare',
    },
    {
      '@type': 'Organization',
      name: 'Comporium',
    },
  ],
};

export function RuralHealthConveningPage() {
  return (
    <div className="rh-page">
      <SEOHead
        title="2026 Rural Health Convening Recap | SparkPoint"
        description="A full house of rural health leaders gathered in Brevard, NC on Oct. 1, 2026, presented by UNC Health Pardee & Transylvania Regional Hospital."
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
        Skip to the recap
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
              <p className="rh-past-kicker">
                <span aria-hidden="true">✦</span>
                October 1, 2026 · A full house
              </p>
              <h1 id="rh-hero-title">
                <span>Where rural</span>
                <span>health came</span>
                <span>together.</span>
              </h1>
              <div className="rh-star-rule" aria-hidden="true">
                <span />
                <b>✦</b>
                <span />
              </div>
              <p className="rh-hero-lede">
                Rural health leaders from across Western North Carolina filled the room at
                Deerwoode Reserve for a day of connection, collaboration, and shared
                learning—with the Rural Health Field Simulator at the center. Thank you to
                everyone who came, listened, and left with new people to call.
              </p>

              <dl className="rh-hero-facts">
                <div>
                  <dt>Date</dt>
                  <dd>Thursday, October 1, 2026</dd>
                </div>
                <div>
                  <dt>Attendance</dt>
                  <dd>A full house</dd>
                </div>
                <div>
                  <dt>Place</dt>
                  <dd>Deerwoode Reserve · Brevard, NC</dd>
                </div>
              </dl>

              <div className="rh-actions">
                <a
                  className="rh-button rh-button-primary"
                  href={hasRecapMedia ? '#recap-media' : '#event-details'}
                >
                  {recapPhotoCount > 0 ? 'See photos from the day' : 'See the recap'}
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
                    <div className="rh-hero-logo-tier">
                      {friendsSponsors.map((sponsor) => (
                        <a
                          key={sponsor.name}
                          className={`rh-hero-logo-link tier-friends ${sponsor.stageClassName}`}
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
                    <a
                      className="rh-hero-partner-link"
                      href="https://www.ncdhhs.gov/divisions/office-rural-health"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit NC DHHS Office of Rural Health"
                    >
                      <img
                        className="rh-hero-partner-logo logo-orh"
                        src={ruralHealthAsset('ORH-NCDHHS-Logo.webp')}
                        alt="NC Department of Health and Human Services, Office of Rural Health"
                        width={480}
                        height={170}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {hasRecapMedia ? <RecapMedia /> : null}

        <SponsorFlyover />

        <section className="rh-network-intro" aria-labelledby="rh-network-title">
          <div className="rh-shell rh-network-grid rh-network-grid-photos">
            <div className="rh-compass" aria-hidden="true">
              ✦
            </div>
            <div>
              <h2 id="rh-network-title">One day. A stronger rural health network.</h2>
              <p>
                The convening brought together people working across care, community,
                philanthropy, and government to see the system together and strengthen the
                relationships that help rural communities thrive.
              </p>
            </div>
            <ul className="rh-outcome-plates" aria-label="What the convening made possible">
              {outcomes.map((outcome) => (
                <li key={outcome.title}>
                  <figure>
                    <img
                      src={highlightSrc(outcome.photo, 800)}
                      srcSet={highlightSrcSet(outcome.photo)}
                      sizes="(max-width: 720px) calc(100vw - 60px), (max-width: 1180px) 30vw, 440px"
                      alt={outcome.alt}
                      width={1600}
                      height={1067}
                      loading="lazy"
                    />
                  </figure>
                  <h3>{outcome.title}</h3>
                  <p>{outcome.body}</p>
                </li>
              ))}
            </ul>
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
                The October 1 program
              </p>
              <h2 id="rh-regional-update-title">
                A historic moment for rural health in North Carolina.
              </h2>
              <p>
                North Carolina’s rural health community is calling this a historic
                moment—and on October 1, Western North Carolina stepped into it together.
                The day brought a statewide briefing from NCDHHS, a special regional
                update on NC ROOTS, a first look at how story collection is helping us
                understand and connect our community, and the participatory Rural
                Health Field Simulator.
              </p>
            </div>

            <figure className="rh-program-photo">
              <img
                src={highlightSrc('morning-program', 1600)}
                srcSet={highlightSrcSet('morning-program')}
                sizes="(max-width: 1528px) calc(100vw - 48px), 1480px"
                alt="Seen from the back of the hall, a full room at round tables faces a speaker at the podium beneath wagon-wheel chandeliers."
                width={1600}
                height={1067}
                loading="lazy"
              />
              <figcaption>The program, from the back of a full hall.</figcaption>
            </figure>

            <div className="rh-program-list-heading">
              <p>What the day held</p>
            </div>
            <ol className="rh-program-list" aria-label="The October 1 program">
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

            {showBriefingResources ? (
              <aside className="rh-resources" aria-labelledby="rh-resources-title">
                <div className="rh-resources-copy">
                  <p className="rh-resources-eyebrow">Shared by Maggie Sauer</p>
                  <h3 id="rh-resources-title">Keep learning, together.</h3>
                  <p>
                    Maggie Sauer, Director of the NC DHHS Office of Rural Health, asked us to
                    share two resources with attendees as we continue learning and moving this
                    work forward together.
                  </p>
                </div>
                <ul className="rh-resources-list">
                  {briefingResources.map((resource) => (
                    <li key={resource.title}>
                      <a href={resource.href ?? undefined} target="_blank" rel="noopener noreferrer">
                        <span className="rh-resources-source">{resource.source}</span>
                        <strong>{resource.title}</strong>
                        <ExternalLink aria-hidden="true" size={18} />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="rh-resources-thanks">
                  We are grateful to Maggie for sharing these resources and for her continued
                  leadership and partnership in strengthening rural health across North
                  Carolina.
                </p>
              </aside>
            ) : null}
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
                A full house, and a room full of new connections.
              </h2>
              <div className="rh-star-rule rh-star-rule-short" aria-hidden="true">
                <span />
                <b>✦</b>
                <span />
              </div>
              <p>
                Healthcare providers, nonprofits, public and behavioral health
                professionals, funders, government partners, and community leaders filled
                every seat—and spent the day meeting the people on the other side of the
                handoffs they navigate every week. Those connections are what the convening
                was built for, and they are where the work goes next.
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

            <aside className="rh-ticket-panel rh-recap-panel" aria-label="Convening recap">
              <img
                className="rh-ticket-event-mark"
                src={ruralHealthAsset('NC Rural Health Convening copy.webp')}
                alt=""
                width={3300}
                height={2550}
              />
              <div className="rh-priority-note rh-recap-stamp">
                <span>October 1, 2026</span>
                <strong>Full house</strong>
                <p>Every seat filled. 30 new collaborative groups formed.</p>
              </div>

              {!hasRecapMedia ? (
                <p className="rh-scholarship-note rh-recap-coming">
                  <Camera aria-hidden="true" size={22} strokeWidth={1.7} />
                  <span>
                    Photos and video from the day are on their way. Have a photo you’d
                    like to share? Send it to{' '}
                    <a href="mailto:info@yoursparkpoint.org">info@yoursparkpoint.org</a>.
                  </span>
                </p>
              ) : (
                <>
                  <a className="rh-button rh-button-primary rh-recap-media-link" href="#recap-media">
                    {recapPhotoCount > 0 ? 'See photos from the day' : 'Watch the recap'}
                    <ArrowRight aria-hidden="true" size={19} />
                  </a>
                  {!hasRecapVideo ? (
                    <p className="rh-scholarship-note rh-recap-coming">
                      <Camera aria-hidden="true" size={22} strokeWidth={1.7} />
                      <span>
                        A recap video is on its way. Have a photo from the day to share? Send it
                        to <a href="mailto:info@yoursparkpoint.org">info@yoursparkpoint.org</a>.
                      </span>
                    </p>
                  ) : null}
                </>
              )}

              <p className="rh-recap-thanks">
                With thanks to{' '}
                <a href={IMPACT_HEALTH_URL} target="_blank" rel="noopener noreferrer">
                  Impact Health
                </a>
                , whose support of a $40 Inclusive Registration Rate helped make sure cost
                wasn’t a barrier to being in the room.
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
                  The simulator now continues as a SparkPoint program for facilitated
                  learning, partnership-building, and rural health systems insight.
                </p>
                <Link className="rh-text-link" to="/intake?intent=partner">
                  Bring the simulator to your organization
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
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
                together, learn across roles, and leave with stronger connections. Thank you
                to every sponsor and partner who made the day possible.
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
                  UNC Health Pardee and Transylvania Regional Hospital were Summit sponsors of
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
                    Come back and spend more time in Transylvania County.{' '}
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

                <div className="rh-friends-field">
                  <p className="rh-logo-label rh-logo-label-tertiary">
                    With Friends support from
                  </p>
                  <div className="rh-friends-logos">
                    {friendsSponsors.map((sponsor) => (
                      <a
                        key={sponsor.name}
                        className={`rh-logo-stage rh-logo-stage-friends ${sponsor.stageClassName}`}
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
                <div className="rh-affiliate-logos">
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
                  <a
                    className="rh-orh-link"
                    href="https://www.ncdhhs.gov/divisions/office-rural-health"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit NC DHHS Office of Rural Health"
                  >
                    <img
                      className="rh-orh-logo"
                      src={ruralHealthAsset('ORH-NCDHHS-Logo.webp')}
                      alt="NC Department of Health and Human Services, Office of Rural Health"
                      width={480}
                      height={170}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rh-final-cta" aria-labelledby="rh-final-title">
          <div className="rh-shell">
            <figure className="rh-final-photo">
              <img
                src={highlightSrc('every-connection-tent', 1600)}
                srcSet={highlightSrcSet('every-connection-tent')}
                sizes="(max-width: 1528px) calc(100vw - 48px), 1480px"
                alt="Attendees gather under a SparkPoint tent whose banner reads “Every connection makes us stronger,” with the mountains behind them."
                width={1600}
                height={1067}
                loading="lazy"
              />
            </figure>
            <h2 id="rh-final-title">Thank you for filling the room.</h2>
            <p>
              The connections made on October 1 are where the work continues. Stay close
              for what comes next for rural health in Western North Carolina.
            </p>
            <div className="rh-actions rh-actions-centered">
              <Link className="rh-button rh-button-primary" to="/newsletter">
                Get SparkPoint updates
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
              <Link className="rh-button rh-button-secondary" to="/intake?intent=partner">
                Partner with us
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
            </div>
            <a className="rh-final-email" href="mailto:info@yoursparkpoint.org">
              <Mail aria-hidden="true" size={16} />
              Have photos from the day? Send them to info@yoursparkpoint.org
            </a>
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
