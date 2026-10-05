import '@fontsource-variable/fraunces';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Users,
  X,
} from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
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

function ruralHealthAsset(filename: string) {
  return `${BASE}assets/Rural%20Health/${encodeURIComponent(filename)}`;
}

// The convening took place October 1, 2026 and this page is now its recap.
//
// Photos: each entry is a pair of WebP files in public/assets/Rural Health/recap/ —
// `<id>-800.webp` for the grid and `<id>-1600.webp` for the enlarged view, both 1600
// px wide at full size (`height` is the 1600-wide height, used to reserve layout
// space). The first photo leads the gallery full width, so keep the strongest image
// there. Order is display order. Alt text describes the scene; people are not named
// unless they are a named speaker on the program.
type RecapPhoto = { id: string; height: number; alt: string; caption?: string };

const recapPhotos: RecapPhoto[] = [
  {
    id: 'rhc-2026-01',
    height: 1103,
    alt: 'Laurie Stradley, CEO of Impact Health, speaks from the podium beside a slide quoting Virginia Burden—“Cooperation is the thorough conviction that nobody can get there unless everybody gets there”—as a full room listens.',
    caption: 'Laurie Stradley, CEO of Impact Health, shares the regional update on NC ROOTS with a full room.',
  },
  {
    id: 'rhc-2026-02',
    height: 1067,
    alt: 'Four attendees talk under the open-air pavilion at Deerwoode Reserve, with trees and mountains behind them.',
  },
  {
    id: 'rhc-2026-03',
    height: 900,
    alt: 'Three attendees look over handouts and a tablet together at a table on the pavilion.',
  },
  {
    id: 'rhc-2026-04',
    height: 1067,
    alt: 'A small group compares printed materials in conversation under the pavilion roof.',
  },
  {
    id: 'rhc-2026-05',
    height: 900,
    alt: 'Attendees with handouts gather at a resource table under the pavilion.',
  },
  {
    id: 'rhc-2026-06',
    height: 900,
    alt: 'Three women lean in over a tablet inside the timber-walled event hall.',
  },
  {
    id: 'rhc-2026-07',
    height: 1134,
    alt: 'A smiling attendee in a quilted vest stands on the lawn, a vintage teal pickup truck behind him.',
  },
  {
    id: 'rhc-2026-08',
    height: 900,
    alt: 'Four attendees work through handouts and a tablet together inside the hall.',
  },
  {
    id: 'rhc-2026-09',
    height: 900,
    alt: 'Two women laugh as they look at a tablet together in the event hall.',
  },
  {
    id: 'rhc-2026-10',
    height: 1067,
    alt: 'A group crowds around a tablet held by one attendee, studying the screen closely.',
  },
  {
    id: 'rhc-2026-11',
    height: 900,
    alt: 'Three women review a tablet and printed pages together under the pavilion.',
  },
  {
    id: 'rhc-2026-12',
    height: 900,
    alt: 'Two women at a round table listen intently, a tablet in front of them.',
  },
  {
    id: 'rhc-2026-13',
    height: 900,
    alt: 'Three attendees read printed pages and a tablet in the event hall.',
  },
  {
    id: 'rhc-2026-14',
    height: 900,
    alt: 'An attendee beside a window listens closely to a conversation.',
  },
  {
    id: 'rhc-2026-15',
    height: 1067,
    alt: 'Three women talk beside a wooden wall, one gesturing as she speaks.',
  },
  {
    id: 'rhc-2026-16',
    height: 900,
    alt: 'A group of attendees chats outdoors on the sunny gravel patio.',
  },
  {
    id: 'rhc-2026-17',
    height: 900,
    alt: 'Two attendees talk through a tablet outdoors on the sunny patio.',
  },
  {
    id: 'rhc-2026-18',
    height: 900,
    alt: 'Attendees gather around a table on the lawn, pines and hills behind them.',
  },
  {
    id: 'rhc-2026-19',
    height: 1067,
    alt: 'Two men talk under the pavilion, one holding a tablet, as others visit resource tables behind them.',
  },
  {
    id: 'rhc-2026-20',
    height: 900,
    alt: 'An attendee writes at a table inside the hall.',
  },
  {
    id: 'rhc-2026-21',
    height: 900,
    alt: 'A smiling attendee in a UNC Health Pardee polo in the timber-walled hall.',
  },
  {
    id: 'rhc-2026-22',
    height: 900,
    alt: 'Three women talk in front of a SparkPoint banner.',
  },
  {
    id: 'rhc-2026-23',
    height: 900,
    alt: 'An attendee laughs during a conversation, a SparkPoint banner behind her.',
  },
  {
    id: 'rhc-2026-24',
    height: 900,
    alt: 'An attendee gestures as she speaks with others in the hall.',
  },
  {
    id: 'rhc-2026-25',
    height: 900,
    alt: 'Two men listen closely during a discussion, one resting his chin on his hand.',
  },
  {
    id: 'rhc-2026-26',
    height: 900,
    alt: 'An attendee smiles in conversation near a SparkPoint banner.',
  },
  {
    id: 'rhc-2026-27',
    height: 900,
    alt: 'Two women talk at the edge of the pavilion, the bright lawn behind them.',
  },
];

// Video: set to an embeddable URL (e.g. https://www.youtube-nocookie.com/embed/<id>
// or https://player.vimeo.com/video/<id>) once the recap video is published.
const RECAP_VIDEO_EMBED_URL: string | null = null;

const RECAP_PHOTO_WIDTH = 1600;

function recapAsset(id: string, width: 800 | 1600) {
  return `${BASE}assets/Rural%20Health/recap/${id}-${width}.webp`;
}

function recapSrcSet(id: string) {
  return `${recapAsset(id, 800)} 800w, ${recapAsset(id, 1600)} 1600w`;
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

function RecapLightbox({
  index,
  onClose,
  onStep,
}: {
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = recapPhotos[index];

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') onStep(1);
      else if (event.key === 'ArrowLeft') onStep(-1);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onStep]);

  return (
    <div
      className="rh-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${recapPhotos.length}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="rh-lightbox-close"
        onClick={onClose}
        aria-label="Close photo"
      >
        <X aria-hidden="true" size={26} />
      </button>
      <button
        type="button"
        className="rh-lightbox-step rh-lightbox-prev"
        onClick={() => onStep(-1)}
        aria-label="Previous photo"
      >
        <ChevronLeft aria-hidden="true" size={30} />
      </button>
      <figure>
        <img
          src={recapAsset(photo.id, 1600)}
          alt={photo.alt}
          width={RECAP_PHOTO_WIDTH}
          height={photo.height}
        />
        <figcaption>
          <span>
            {index + 1} / {recapPhotos.length}
          </span>
          {photo.caption ?? photo.alt}
        </figcaption>
      </figure>
      <button
        type="button"
        className="rh-lightbox-step rh-lightbox-next"
        onClick={() => onStep(1)}
        aria-label="Next photo"
      >
        <ChevronRight aria-hidden="true" size={30} />
      </button>
    </div>
  );
}

function RecapMedia() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? current : (current + delta + recapPhotos.length) % recapPhotos.length,
      ),
    [],
  );
  const [leadPhoto, ...morePhotos] = recapPhotos;

  return (
    <section id="recap-media" className="rh-recap-media" aria-labelledby="rh-recap-media-title">
      <div className="rh-shell">
        <div className={`rh-recap-intro${leadPhoto ? '' : ' rh-recap-intro-solo'}`}>
          <div className="rh-recap-media-heading">
            <p className="rh-recap-eyebrow">From the day · October 1, 2026</p>
            <h2 id="rh-recap-media-title">October 1, in pictures.</h2>
            <div className="rh-star-rule rh-star-rule-short" aria-hidden="true">
              <span />
              <b>✦</b>
              <span />
            </div>
            <p>
              A full house at Deerwoode Reserve—and a day of conversations between people
              who don’t usually share a room. Select any photo to see it larger.
            </p>
          </div>

          {leadPhoto ? (
            <figure className="rh-recap-lead">
              <button
                type="button"
                onClick={() => setOpenIndex(0)}
                aria-label={`Enlarge photo: ${leadPhoto.caption ?? leadPhoto.alt}`}
              >
                <img
                  src={recapAsset(leadPhoto.id, 1600)}
                  srcSet={recapSrcSet(leadPhoto.id)}
                  sizes="(max-width: 960px) calc(100vw - 48px), 66vw"
                  alt={leadPhoto.alt}
                  width={RECAP_PHOTO_WIDTH}
                  height={leadPhoto.height}
                />
              </button>
              {leadPhoto.caption ? <figcaption>{leadPhoto.caption}</figcaption> : null}
            </figure>
          ) : null}
        </div>

        {RECAP_VIDEO_EMBED_URL ? (
          <div className="rh-recap-video">
            <iframe
              src={RECAP_VIDEO_EMBED_URL}
              title="2026 WNC Regional Rural Health Convening recap video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : null}

        {morePhotos.length > 0 ? (
          <ul className="rh-recap-gallery">
            {morePhotos.map((photo, offset) => (
              <li key={photo.id}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(offset + 1)}
                  aria-label={`Enlarge photo: ${photo.caption ?? photo.alt}`}
                >
                  <img
                    src={recapAsset(photo.id, 800)}
                    srcSet={recapSrcSet(photo.id)}
                    sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1100px) 50vw, 500px"
                    alt={photo.alt}
                    width={RECAP_PHOTO_WIDTH}
                    height={photo.height}
                    loading="lazy"
                  />
                </button>
                {photo.caption ? <p>{photo.caption}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {openIndex !== null ? <RecapLightbox index={openIndex} onClose={close} onStep={step} /> : null}
    </section>
  );
}

const hasRecapMedia = recapPhotos.length > 0 || RECAP_VIDEO_EMBED_URL !== null;

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
                  {recapPhotos.length > 0 ? 'See photos from the day' : 'See the recap'}
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

        <section className="rh-network-intro" aria-labelledby="rh-network-title">
          <div className="rh-shell rh-network-grid">
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
            <div className="rh-network-outcomes" aria-label="What the convening made possible">
              <p>
                <strong>Connected across roles</strong>
                Relationships that bridge organizations and communities.
              </p>
              <p>
                <strong>Walked the system</strong>
                Rural health access, explored together through the Field Simulator.
              </p>
              <p>
                <strong>Carrying insight forward</strong>
                Clearer connections and practical next steps to build on.
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
                <p>Every seat filled. So many connections made.</p>
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
                    {recapPhotos.length > 0 ? 'See photos from the day' : 'Watch the recap'}
                    <ArrowRight aria-hidden="true" size={19} />
                  </a>
                  {!RECAP_VIDEO_EMBED_URL ? (
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
            <h2 id="rh-final-title">Thank you for filling the room.</h2>
            <p>
              The connections made on October 1 are where the work continues. Stay close
              for photos, video, and what comes next for rural health in Western North
              Carolina.
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
