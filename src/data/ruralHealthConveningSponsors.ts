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

// Sponsor and partner billing for the 2026 convening, as used by the unlisted
// photo-share page (/rural-health-convening/photos). The recap page,
// RuralHealthConveningPage.tsx, keeps its own copy of these arrays and was left
// untouched when this page was added — if billing ever changes, update both.
//
// Tier order is billing order (Summit $3,500 → Friends). `optical` nudges a logo's
// rendered height: stacked or multi-line lockups need a taller box than one-line
// wordmarks to read at the same weight within a tier.

const BASE = import.meta.env.BASE_URL;
const ruralHealthAsset = (file: string) => `${BASE}assets/Rural%20Health/${encodeURIComponent(file)}`;

export type ConveningLogo = {
  name: string;
  href: string;
  src: string;
  width: number;
  height: number;
  optical?: number;
};

export type SponsorTier = {
  id: 'summit' | 'ridgeline' | 'highlands' | 'foothills' | 'friends';
  label: string;
  sponsors: ConveningLogo[];
};

export const sponsorTiers: SponsorTier[] = [
  {
    id: 'summit',
    label: 'Presented by',
    sponsors: [
      { name: 'UNC Health Pardee', href: 'https://www.pardeehospital.org/', src: uncHealthPardeeLogo, width: 1200, height: 560 },
      {
        name: 'Transylvania Regional Hospital',
        href: 'https://www.missionhealth.org/locations/transylvania-regional-hospital',
        src: transylvaniaRegionalHospitalLogo,
        width: 1200,
        height: 429,
      },
    ],
  },
  {
    id: 'ridgeline',
    label: 'With support from',
    sponsors: [
      { name: 'Pisgah Health Foundation', href: 'https://pisgahhealthfoundation.org/', src: pisgahHealthFoundationLogo, width: 1200, height: 560 },
    ],
  },
  {
    id: 'highlands',
    label: 'Also supported by',
    sponsors: [
      {
        name: 'Transylvania County Tourism Development Authority',
        href: 'https://www.explorebrevard.com/',
        src: transylvaniaTdaLogo,
        width: 422,
        height: 107,
      },
    ],
  },
  {
    id: 'foothills',
    label: 'Foothills sponsors',
    sponsors: [
      { name: 'Dogwood Health Trust', href: 'https://dogwoodhealthtrust.org', src: dogwoodHealthTrustLogo, width: 454, height: 119 },
      { name: 'Vaya Health', href: 'https://www.vayahealth.com', src: vayaHealthLogo, width: 576, height: 346, optical: 1.35 },
      { name: 'First Citizens Bank', href: 'https://www.firstcitizens.com', src: firstCitizensBankLogo, width: 340, height: 160, optical: 1.2 },
      {
        name: 'Hendersonville Pediatrics',
        href: 'https://www.hendersonvillepediatrics.com/',
        src: hendersonvillePediatricsLogo,
        width: 497,
        height: 129,
        optical: 1.1,
      },
    ],
  },
  {
    id: 'friends',
    label: 'Friends of the convening',
    sponsors: [
      { name: 'AdventHealth', href: 'https://www.adventhealth.com', src: adventHealthLogo, width: 1226, height: 309, optical: 1.1 },
      { name: 'UnitedHealthcare', href: 'https://www.uhc.com', src: unitedHealthcareLogo, width: 1280, height: 403, optical: 1.45 },
      { name: 'Comporium', href: 'https://www.comporium.com', src: comporiumLogo, width: 280, height: 189, optical: 1.85 },
    ],
  },
];

export const conveningPartners: ConveningLogo[] = [
  {
    name: 'North Carolina Rural Health Association',
    href: 'https://www.ruralhealthnc.org',
    src: ruralHealthAsset('NCRHA-Logo.webp'),
    width: 2064,
    height: 331,
  },
  {
    name: 'Foundation for Health Leadership and Innovation',
    href: 'https://foundationhli.org',
    src: ruralHealthAsset('FHLI Logo.webp'),
    width: 1600,
    height: 438,
    optical: 1.3,
  },
  {
    name: 'NC Department of Health and Human Services, Office of Rural Health',
    href: 'https://www.ncdhhs.gov/divisions/office-rural-health',
    src: ruralHealthAsset('ORH-NCDHHS-Logo.webp'),
    width: 480,
    height: 170,
    optical: 1.3,
  },
];
