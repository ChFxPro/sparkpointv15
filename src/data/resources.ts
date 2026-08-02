// SparkPoint Resource Directory — data model + seed entries.
//
// Structured, code-authored source for the Resource Directory (browsable half of
// the Resilience Hub "digital twin") and the future Needs Finder. Mirrors the
// src/data/stories.ts convention: typed interfaces + a plain exported array that
// pages import directly and that scripts/prerender.mjs derives /directory/:id
// routes from.
//
// PROVENANCE: seeded from the RuralHealthSim simulator taxonomy
// (public/databases/resource_hub_seed.json), enriched 2026-07-23 with public
// contact info + intake/apply links verified against each org's official site.
// Simulator-only abstractions and all _internal.* staff fields were dropped.
// `verified` reflects how well each entry is confirmed for PUBLIC use.
//
// Category colors: each NeedCategory carries a { tint, ink } pair. All 12 pairs
// pass WCAG AA (>=4.5:1) for small text on both the tint and white. Color always
// travels with an icon + text label (never color alone).
//
// SEC-007: content is code/data-authored with structured plain-text fields.

export type NeedCategoryId =
  | 'food'
  | 'housing'
  | 'health'
  | 'mental-health'
  | 'transportation'
  | 'benefits'
  | 'legal'
  | 'disaster-recovery'
  | 'employment'
  | 'digital-access'
  | 'language-access'
  | 'navigation';

export type VerificationStatus =
  | 'confirmed'
  | 'partner-input'
  | 'needs-verification'
  | 'estimate';

export interface NeedCategory {
  id: NeedCategoryId;
  /** Public, plain-language label. */
  label: string;
  /** One-line description shown on category tiles. */
  blurb: string;
  /** lucide-react icon name. */
  icon: string;
  /** Light background tint for chips/badges (AA-safe with `ink`). */
  tint: string;
  /** Accent + text color (AA-safe on `tint` and on white). */
  ink: string;
  /** Free-text terms the Needs Finder (Phase 2) maps to this category. */
  synonyms: string[];
}

export interface ResourceAddress {
  street?: string;
  city: string;
  state: string;
  zip: string;
}

/** A labelled URL: an application/intake form, a program page, a social channel. */
export interface ResourceLink {
  label: string;
  url: string;
}

export interface ResourceContact {
  phone?: string;
  /** 24/7 crisis line, where one exists. */
  crisisPhone?: string;
  tollFree?: string;
  email?: string;
  website?: string;
  /** The single best online "apply / request help / intake" form or page. */
  applyUrl?: string;
  /** Other useful public links (programs, volunteer, donate, social, portal). */
  links?: ResourceLink[];
  address?: ResourceAddress;
  addressNote?: string;
}

/** The warm next action — a concrete first step, never just a bare link. */
export interface ResourceNextStep {
  label: string;
  /** https:, tel:, mailto:, or an internal path like "/intake". */
  url?: string;
  note?: string;
}

export interface ResourceAccess {
  referralRequired?: boolean;
  appointmentDelayDays?: number;
  transportationRequired?: boolean;
  digitalAccessRequired?: boolean;
  paperworkRequired?: boolean;
}

export interface ResourceEntry {
  id: string;
  name: string;
  org: string;
  categories: NeedCategoryId[];
  summary: string;
  /**
   * Optional SEO-friendly override for the directory entry page's <title>.
   * Leads with the actual service/need in plain language plus real location
   * context, while keeping the org's real name for attribution. Falls back to
   * the generic `name — org | SparkPoint Resource Directory` template when
   * absent.
   */
  seoTitle?: string;
  serviceArea: {
    county: string;
    towns?: string[];
    inCounty: boolean;
    note?: string;
  };
  eligibility?: string;
  hours?: string;
  contact: ResourceContact;
  nextStep: ResourceNextStep;
  verified: VerificationStatus;
  lastReviewed?: string;
  featured?: boolean;
  access?: ResourceAccess;
  /**
   * Optional org logo, as a path under /assets/directory-logos/ (e.g.
   * "/assets/directory-logos/the-sharing-house.png"). When absent — or if the
   * file fails to load — the UI shows a category-colored monogram instead.
   * Use official logos only (see IP-001); nominative use to identify the org.
   */
  logo?: string;
}

// ─── Need categories (browse taxonomy + colors + Needs Finder synonyms) ───

export const NEED_CATEGORIES: NeedCategory[] = [
  {
    id: 'food',
    label: 'Food & meals',
    blurb: 'Food pantries, hot meals, and home-delivered meals.',
    icon: 'Utensils',
    tint: '#ECFDF5',
    ink: '#047857',
    synonyms: ['hungry', 'food', 'groceries', 'food pantry', 'meals', 'snap', 'ebt', 'food stamps', 'nutrition', 'wic', 'hot meal', 'baby formula'],
  },
  {
    id: 'housing',
    label: 'Housing & shelter',
    blurb: 'Emergency shelter and home repair.',
    icon: 'Home',
    tint: '#EFF6FF',
    ink: '#1D4ED8',
    synonyms: ['homeless', 'shelter', 'housing', 'place to stay', 'rent', 'eviction', 'repairs', 'roof', 'home repair', 'nowhere to go'],
  },
  {
    id: 'health',
    label: 'Health care',
    blurb: 'Primary care, pediatrics, and public health.',
    icon: 'Stethoscope',
    tint: '#ECFEFF',
    ink: '#0E7490',
    synonyms: ['doctor', 'clinic', 'sick', 'medical', 'primary care', 'pediatrician', 'checkup', 'uninsured', 'prescription', 'health', 'wic', 'immunization', 'vaccine'],
  },
  {
    id: 'mental-health',
    label: 'Mental & behavioral health',
    blurb: 'Counseling, substance-use support, and crisis help.',
    icon: 'HeartPulse',
    tint: '#F5F3FF',
    ink: '#6D28D9',
    synonyms: ['counseling', 'therapy', 'depression', 'anxiety', 'substance', 'addiction', 'recovery', 'crisis', 'mental health', 'behavioral health', 'grief', 'stress'],
  },
  {
    id: 'transportation',
    label: 'Transportation',
    blurb: 'Rides to appointments and around the county.',
    icon: 'Bus',
    tint: '#FFF7ED',
    ink: '#C2410C',
    synonyms: ['ride', 'bus', 'transport', 'transportation', 'car', 'get to appointment', 'van', 'no car', "can't drive"],
  },
  {
    id: 'benefits',
    label: 'Benefits & assistance',
    blurb: 'Medicaid, SNAP, energy and child-care assistance.',
    icon: 'ClipboardList',
    tint: '#F0F9FF',
    ink: '#0369A1',
    synonyms: ['medicaid', 'snap', 'benefits', 'energy assistance', 'heating', 'child care', 'apply', 'enroll', 'financial help', 'dss', 'assistance', 'workfirst'],
  },
  {
    id: 'legal',
    label: 'Legal aid',
    blurb: 'Free civil legal help and benefits appeals.',
    icon: 'Scale',
    tint: '#FEFCE8',
    ink: '#A16207',
    synonyms: ['lawyer', 'legal', 'eviction', 'appeal', 'denied', 'benefits appeal', 'custody', 'immigration', 'court', 'legal aid'],
  },
  {
    id: 'disaster-recovery',
    label: 'Disaster recovery',
    blurb: 'Storm and flood recovery, repairs, and case management.',
    icon: 'CloudRain',
    tint: '#FEF2F2',
    ink: '#B91C1C',
    synonyms: ['helene', 'flood', 'storm', 'disaster', 'recovery', 'damage', 'fema', 'hurricane', 'rebuild'],
  },
  {
    id: 'employment',
    label: 'Jobs & workforce',
    blurb: 'Job training and workforce development.',
    icon: 'Briefcase',
    tint: '#EEF2FF',
    ink: '#4338CA',
    synonyms: ['job', 'work', 'career', 'training', 'employment', 'resume', 'workforce', 'hiring', 'unemployed'],
  },
  {
    id: 'digital-access',
    label: 'Digital access',
    blurb: 'Devices, internet help, and digital skills.',
    icon: 'Laptop',
    tint: '#FDF4FF',
    ink: '#A21CAF',
    synonyms: ['computer', 'laptop', 'internet', 'wifi', 'device', 'online', 'digital', 'tablet', 'phone', 'email help'],
  },
  {
    id: 'language-access',
    label: 'Language & newcomer support',
    blurb: 'Spanish-language help and newcomer navigation.',
    icon: 'Languages',
    tint: '#FFF1F2',
    ink: '#BE123C',
    synonyms: ['spanish', 'espanol', 'latino', 'hispanic', 'translation', 'interpreter', 'newcomer', 'immigrant', 'english', 'idioma'],
  },
  {
    id: 'navigation',
    label: 'Get help navigating',
    blurb: 'Not sure where to start? A person will help you find it.',
    icon: 'Compass',
    tint: '#FDF2F8',
    ink: '#B0246F',
    synonyms: ['help', 'where to start', 'connect', 'navigate', "don't know", 'overwhelmed', 'resource', 'someone to talk to', 'guidance'],
  },
];

export const NEED_CATEGORY_BY_ID: Record<NeedCategoryId, NeedCategory> = NEED_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<NeedCategoryId, NeedCategory>,
);

// ─── Directory entries ───
// Contact info + apply/intake links verified 2026-07-23 against official sources.

export const RESOURCES: ResourceEntry[] = [
  // ── Get help navigating ──
  {
    id: 'sparkpoint-resilience-hub-navigation',
    name: 'Resilience Hub Navigation',
    org: 'SparkPoint',
    categories: ['navigation'],
    summary:
      "Not sure where to start? SparkPoint's Resilience Hub is an open door — talk with someone who will help you figure out what you need and connect you to the right local resource and a concrete first step. No eligibility screening to talk.",
    seoTitle: 'Not Sure Where to Start? Talk to a Navigator in Transylvania County | SparkPoint Resilience Hub',
    serviceArea: { county: 'Transylvania', inCounty: true, note: 'Countywide' },
    eligibility: 'Open door. No eligibility screening to talk with a navigator.',
    hours: 'Weekdays 9am–5pm, some evenings',
    contact: {
      email: 'info@yoursparkpoint.org',
      website: 'https://yoursparkpoint.org',
      applyUrl: '/intake',
      links: [
        { label: 'Contact / intake form', url: '/intake' },
        { label: 'Get involved', url: '/get-involved' },
      ],
      address: { street: '94 S. Caldwell Street', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Contact the Resilience Hub',
      url: '/intake',
      note: 'Or email info@yoursparkpoint.org, or stop by 94 S. Caldwell Street during weekday hours.',
    },
    verified: 'confirmed',
    lastReviewed: '2026-07-23',
    featured: true,
    access: { referralRequired: false },
  },
  {
    id: 'dss-community-health-worker-navigation',
    name: 'Community Health Worker Navigation',
    org: 'Transylvania County DSS',
    categories: ['navigation', 'benefits'],
    summary:
      'Trained community health workers provide hands-on navigation — help enrolling in benefits, coordinating appointments and transportation, and connecting to the right services across the county.',
    seoTitle: 'Help Enrolling in Benefits & Coordinating Appointments in Transylvania County | Transylvania County DSS',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Weekday outreach and by referral. Confirm current program capacity and intake with DSS.',
    contact: {
      phone: '(828) 884-3174',
      website: 'https://www.transylvaniacounty.org/departments/social-services',
      links: [
        { label: 'Transylvania County DSS', url: 'https://www.transylvaniacounty.org/departments/social-services' },
      ],
      address: { street: '106 E. Morgan St.', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Transylvania County DSS',
      url: 'tel:+18288843174',
      note: 'Ask about community health worker navigation.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
    access: { referralRequired: false },
  },

  // ── Food ──
  {
    id: 'sharing-house-food-pantry',
    name: 'Community Food Pantry',
    org: 'The Sharing House',
    categories: ['food', 'benefits'],
    summary:
      'A community food pantry with a short, household-size-based intake. Dietary needs (low-sodium and similar) can be accommodated. The Sharing House also provides clothing and other basic supplies and financial assistance.',
    seoTitle: 'Food Pantry, Clothing & Financial Assistance in Transylvania County | The Sharing House',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Short intake; household-size based. Food help is by monthly appointment — call or visit the "how to get food" page.',
    hours: 'Mon–Fri 9am–12pm & 1–4pm; extended Tuesdays until 6pm',
    contact: {
      phone: '(828) 884-2866',
      email: 'tcm@sharinghouse.org',
      website: 'https://www.sharinghouse.org',
      applyUrl: 'https://www.sharinghouse.org/food-access',
      links: [
        { label: 'How to get food', url: 'https://www.sharinghouse.org/food-access' },
        { label: 'Donate', url: 'https://www.sharinghouse.org/donate' },
        { label: 'Facebook', url: 'https://www.facebook.com/SharingHouseBrevard/' },
      ],
      address: { street: '164 Duckworth Avenue', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call The Sharing House',
      url: 'tel:+18288842866',
      note: 'Confirm current pantry hours and what to bring.',
    },
    verified: 'confirmed',
    lastReviewed: '2026-07-23',
    featured: true,
  },
  {
    id: 'bread-of-life-meals',
    name: 'Emergency Hot Meals & Food',
    org: 'The Bread of Life',
    categories: ['food'],
    summary:
      'Hot meals and pantry groceries with no documentation and no questions asked — just a name and household size. Emergency food boxes and delivery are available by phone request, and a food truck reaches remote areas of the county.',
    seoTitle: 'Hot Meals & Food Pantry, No Documentation Needed, in Transylvania County | The Bread of Life',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Name and household size only. No documentation required. Walk-in.',
    hours: 'Mon–Fri 9am–2pm; hot meals & groceries served 12pm–2pm',
    contact: {
      phone: '(828) 877-3577',
      email: 'breadoflifetc@gmail.com',
      website: 'https://www.breadoflifetc.org',
      applyUrl: 'https://www.breadoflifetc.org/programs',
      links: [
        { label: 'Programs (meals & groceries)', url: 'https://www.breadoflifetc.org/programs' },
        { label: 'Volunteer', url: 'https://www.breadoflifetc.org/volunteer' },
        { label: 'Facebook', url: 'https://www.facebook.com/breadoflifetc/' },
      ],
      address: { street: '238 S. Caldwell St.', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call The Bread of Life',
      url: 'tel:+18288773577',
      note: 'Ask about hot meals, food boxes, or delivery.',
    },
    verified: 'confirmed',
    lastReviewed: '2026-07-23',
  },
  {
    id: 'hunger-coalition-rotating-pantry',
    name: 'Rotating Food Pantry',
    org: 'The Hunger Coalition of Transylvania County',
    categories: ['food'],
    summary:
      'A rotating pantry and mobile markets at a different location each Thursday, partnering with MANNA FoodBank and the Transylvania Farmers Market to reach neighbors across the county.',
    seoTitle: 'Weekly Mobile Food Markets & Rotating Pantry Across Transylvania County | The Hunger Coalition',
    serviceArea: { county: 'Transylvania', inCounty: true, note: 'Location rotates weekly' },
    eligibility: 'Open to county residents. Attend a weekly mobile market — check the current schedule.',
    hours: 'First through fourth Thursdays — location rotates',
    contact: {
      email: 'hungerctc@gmail.com',
      website: 'https://www.hungerfreetc.org',
      applyUrl: 'https://www.hungerfreetc.org/programs',
      links: [
        { label: 'Mobile markets & pantry schedule', url: 'https://www.hungerfreetc.org/programs' },
        { label: 'Facebook', url: 'https://www.facebook.com/transylvaniahungercoalition/' },
      ],
      address: { city: 'Brevard', state: 'NC', zip: '28712' },
      addressNote: 'Mailing address is PO Box 1695, Brevard. Pantry locations rotate weekly — no fixed walk-in address.',
    },
    nextStep: {
      label: 'Email the Hunger Coalition',
      url: 'mailto:hungerctc@gmail.com',
      note: 'Ask where this week’s pantry is set up.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },
  {
    id: 'meals-on-wheels-brevard',
    name: 'Home-Delivered Meals',
    org: 'Meals on Wheels of Brevard',
    categories: ['food'],
    summary:
      'Weekday home-delivered meals for homebound residents — often older adults or people with disabilities — who cannot easily shop or prepare food. Sliding-scale suggested donation; someone must be home to receive the meal.',
    seoTitle: 'Home-Delivered Meals for Homebound Older Adults & People With Disabilities in Brevard | Meals on Wheels of Brevard',
    serviceArea: { county: 'Transylvania', inCounty: true, towns: ['Brevard'] },
    eligibility: 'Homebound residents who cannot easily shop or cook. Submit a meal request or call.',
    hours: 'Program office Mon–Fri 9am–1pm; meals delivered weekdays ~11am–12pm',
    contact: {
      phone: '(828) 883-3743',
      website: 'https://www.mealsonwheelsbrevard.org',
      applyUrl: 'https://www.mealsonwheelsbrevard.org/how-to-receive-meals',
      links: [
        { label: 'Request meals', url: 'https://www.mealsonwheelsbrevard.org/how-to-receive-meals' },
        { label: 'Volunteer', url: 'https://www.mealsonwheelsbrevard.org/volunteer' },
        { label: 'Facebook', url: 'https://www.facebook.com/mealsonwheelsbrevardnc' },
      ],
      address: { city: 'Brevard', state: 'NC', zip: '28712' },
      addressNote: 'Mailing address is PO Box 485, Brevard. No public walk-in address.',
    },
    nextStep: {
      label: 'Call Meals on Wheels of Brevard',
      url: 'tel:+18288833743',
      note: 'Ask how to start receiving meals.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },

  // ── Housing & shelter ──
  {
    id: 'haven-emergency-shelter',
    name: 'Emergency Shelter',
    org: 'The Haven of Transylvania County',
    categories: ['housing'],
    summary:
      'An overnight shelter for people experiencing homelessness — single adults, women, and children — with intake interviews by appointment and case management toward stable housing. The Haven works with community agencies for referrals.',
    seoTitle: 'Emergency Overnight Shelter for People Experiencing Homelessness in Transylvania County | The Haven',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'For those who are literally homeless with no other place to go. Intake interviews by appointment, Mon–Thu.',
    hours: 'Intake interviews Monday–Thursday, by appointment',
    contact: {
      phone: '(828) 877-2040',
      email: 'office@havenoftc.org',
      website: 'https://havenoftc.org',
      links: [
        { label: 'Community services list', url: 'https://havenoftc.org/social-services-list/' },
        { label: 'Donate', url: 'https://havenoftc.org/donate/' },
      ],
      address: { city: 'Brevard', state: 'NC', zip: '28712' },
      addressNote: 'Contact the office to arrange an intake interview; the shelter address is shared at intake.',
    },
    nextStep: {
      label: 'Call The Haven',
      url: 'tel:+18288772040',
      note: 'Ask to schedule an intake interview.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },
  {
    id: 'habitat-home-repair',
    name: 'Home Repair & Recovery Repairs',
    org: 'Transylvania Habitat for Humanity',
    categories: ['housing', 'disaster-recovery'],
    summary:
      'Critical home repair and storm/flood recovery repairs for homeowners, including Hurricane Helene disaster recovery work. Scheduling depends on volunteer labor and donated materials, so plan ahead.',
    seoTitle: 'Home Repair & Hurricane Helene Recovery Repairs for Homeowners in Transylvania County | Transylvania Habitat for Humanity',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Homeowners with repair or storm/flood-damage needs. Start with the Critical Home Repair program.',
    hours: 'ReStore: Tue–Fri 9:30am–5pm, Sat 9:30am–4pm. Program inquiries by phone.',
    contact: {
      phone: '(828) 884-3464',
      email: 'info@transylvaniahabitat.org',
      website: 'https://transylvaniahabitat.org',
      applyUrl: 'https://transylvaniahabitat.org/critical-home-repair/',
      links: [
        { label: 'Critical Home Repair program', url: 'https://transylvaniahabitat.org/critical-home-repair/' },
        { label: 'Volunteer', url: 'https://transylvaniahabitat.org/how-to-help/volunteer/' },
      ],
      address: { street: '692 Ecusta Road', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Transylvania Habitat',
      url: 'tel:+18288843464',
      note: 'Ask about the Critical Home Repair and disaster recovery programs.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },

  // ── Health care ──
  {
    id: 'blue-ridge-health-family-medicine',
    name: 'Family Medicine',
    org: 'Blue Ridge Health — Transylvania',
    categories: ['health'],
    summary:
      'A community health center (FQHC) offering family medicine on a sliding-scale for uninsured and underinsured patients. The same location also provides nutrition services and medication for opioid use disorder treatment.',
    seoTitle: 'Sliding-Scale Family Medicine for the Uninsured in Transylvania County | Blue Ridge Health — Transylvania',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Open to all; sliding-scale fees for uninsured/underinsured patients (FQHC).',
    hours: 'Mon & Wed 8am–8pm; Tue, Thu, Fri 8am–5pm',
    contact: {
      phone: '(828) 883-5550',
      email: 'info@brchs.com',
      website: 'https://www.brchs.com/locations/blue-ridge-health-transylvania',
      applyUrl: 'https://www.brchs.com/patients/new-patient/',
      links: [
        { label: 'New patient info', url: 'https://www.brchs.com/patients/new-patient/' },
        { label: 'Find a provider', url: 'https://www.brchs.com/patients/find-a-provider/' },
        { label: 'Patient portal', url: 'https://21884-1.portal.athenahealth.com/' },
      ],
      address: { street: '29 West French Broad Street, Suite 203', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Blue Ridge Health',
      url: 'tel:+18288835550',
      note: 'Appointments are by phone. Ask to become a patient or book a visit.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },
  {
    id: 'blue-ridge-health-pediatrics',
    name: 'Pediatrics',
    org: 'Blue Ridge Health — Transylvania',
    categories: ['health'],
    summary:
      'Sliding-scale pediatric care through the community health center (FQHC). The same organization runs the county’s school-based health centers.',
    seoTitle: 'Sliding-Scale Pediatric Care for Kids in Transylvania County | Blue Ridge Health — Transylvania',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Open to all; sliding-scale fees for uninsured/underinsured families (FQHC).',
    hours: 'Mon & Wed 8am–8pm; Tue, Thu, Fri 8am–5pm',
    contact: {
      phone: '(828) 883-5550',
      email: 'info@brchs.com',
      website: 'https://www.brchs.com/locations/blue-ridge-health-transylvania',
      applyUrl: 'https://www.brchs.com/patients/new-patient/',
      links: [
        { label: 'New patient info', url: 'https://www.brchs.com/patients/new-patient/' },
        { label: 'Find a provider', url: 'https://www.brchs.com/patients/find-a-provider/' },
        { label: 'Patient portal', url: 'https://21884-1.portal.athenahealth.com/' },
      ],
      address: { street: '29 West French Broad Street, Suite 203', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Blue Ridge Health',
      url: 'tel:+18288835550',
      note: 'Appointments are by phone. Ask about pediatric care.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },
  {
    id: 'transylvania-public-health',
    name: 'Public Health Services',
    org: 'Transylvania Public Health',
    categories: ['health'],
    summary:
      'The county health department: immunizations, WIC, environmental health, and home-visiting programs for county residents.',
    seoTitle: 'Immunizations, WIC & Environmental Health Services in Transylvania County | Transylvania Public Health',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Open to county residents.',
    hours: 'Mon–Thu 8:30am–12pm & 1–5pm; Fri 8:30am–5pm',
    contact: {
      phone: '(828) 884-3135',
      website: 'https://transylvaniahealth.org',
      applyUrl: 'https://transylvaniahealth.org/contact/',
      links: [
        { label: 'Personal health services', url: 'https://transylvaniahealth.org/my-health/' },
        { label: 'WIC program', url: 'https://transylvaniahealth.org/wic-program/' },
      ],
      address: { street: '106 East Morgan Street', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Transylvania Public Health',
      url: 'tel:+18288843135',
      note: 'Ask about immunizations, WIC, or home-visiting programs.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },

  // ── Mental & behavioral health ──
  {
    id: 'vaya-health-behavioral-access-crisis',
    name: 'Behavioral Health Access & 24/7 Crisis Line',
    org: 'Vaya Health',
    categories: ['mental-health'],
    summary:
      'The public managed-care organization for behavioral health, mental health, substance use, intellectual/developmental disabilities, and TBI across western NC. Runs a 24/7 behavioral-health crisis line and connects people to local services and care management.',
    seoTitle: '24/7 Behavioral Health Crisis Line Serving Transylvania County & Western NC | Vaya Health',
    serviceArea: { county: 'Transylvania', inCounty: true, note: 'Regional (western NC)' },
    eligibility: 'Open access line for anyone needing behavioral-health help; crisis line is available to all, 24/7.',
    hours: 'Member & Recipient Services Mon–Sat 7am–6pm; crisis line 24/7',
    contact: {
      phone: '(800) 962-9003',
      crisisPhone: '(800) 849-6127',
      email: 'member.services@vayahealth.com',
      website: 'https://www.vayahealth.com',
      links: [
        { label: 'Access to care', url: 'https://www.vayahealth.com/available-services/access-to-care/' },
        { label: 'Find a provider', url: 'https://www.vayahealth.com/get-help/provider-search/' },
      ],
    },
    nextStep: {
      label: 'Call the 24/7 crisis line',
      url: 'tel:+18008496127',
      note: 'For non-crisis access to services, call (800) 962-9003.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },
  {
    id: 'meridian-adult-behavioral-health',
    name: 'Adult Behavioral Health — Outpatient',
    org: 'Meridian Behavioral Health Services (Brevard)',
    categories: ['mental-health'],
    summary:
      'Outpatient counseling — individual, group, and family — and care coordination for adults, including substance-use concerns and medication for opioid use disorder treatment. Operated locally under Blue Ridge Health.',
    seoTitle: 'Outpatient Counseling & Substance-Use Support for Adults in Transylvania County | Meridian Behavioral Health Services',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Adults seeking outpatient behavioral-health support. Confirm current intake with the office.',
    hours: 'Mon–Fri 8:30am–5pm',
    contact: {
      phone: '(828) 883-2708',
      email: 'info@brchs.com',
      website: 'https://www.brchs.com/locations/meridian-behavioral-health-services-brevard/',
      applyUrl: 'https://www.brchs.com/services/behavioral-health-counseling/',
      links: [
        { label: 'Behavioral health & counseling', url: 'https://www.brchs.com/services/behavioral-health-counseling/' },
        { label: 'New patient info', url: 'https://www.brchs.com/patients/new-patient/' },
      ],
      address: { street: '69 North Broad Street', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Meridian Behavioral Health',
      url: 'tel:+18288832708',
      note: 'Ask about outpatient counseling or a first appointment.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },
  {
    id: 'transylvania-schools-counseling',
    name: 'School Counseling & Skills Groups',
    org: 'Transylvania County Schools',
    categories: ['mental-health'],
    summary:
      'Counseling and skills groups for enrolled students, delivered at individual schools. Reach the district office to be pointed to your school’s counselor.',
    seoTitle: 'School Counseling & Skills Groups for Students in Transylvania County | Transylvania County Schools',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Enrolled students; parent consent required for skills groups.',
    hours: 'School days',
    contact: {
      phone: '(828) 884-6173',
      website: 'https://www.tcsnc.org',
      links: [
        { label: 'Student services', url: 'https://www.tcsnc.org/page/student-services' },
      ],
      address: { street: '225 Rosenwald Lane', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Transylvania County Schools',
      url: 'tel:+18288846173',
      note: 'Ask to reach your student’s school counselor.',
    },
    verified: 'confirmed',
    lastReviewed: '2026-07-23',
  },

  // ── Transportation ──
  {
    id: 'transylvania-county-transportation',
    name: 'County Transportation & Medical Rides',
    org: 'Transylvania County Transportation',
    categories: ['transportation'],
    summary:
      'The county transportation service (Transylvania in Motion) runs a fixed weekday route through Brevard and Rosman for $1 per boarding. Trips off the route or out of county are demand-response rides that must be booked in advance for a higher fee; dedicated medical transportation prioritizes ages 60+ and those with no other way to travel.',
    seoTitle: '$1 Bus Rides & Medical Transportation in Brevard and Rosman | Transylvania County Transportation',
    serviceArea: { county: 'Transylvania', inCounty: true, towns: ['Brevard', 'Rosman'] },
    eligibility:
      'Fixed route weekdays ~6:30am–4:30pm, $1 exact cash per boarding. Off-route, medical, and out-of-county trips are demand-response and must be reserved ~24–48 hours ahead.',
    hours: 'Fixed route weekdays ~6:30am–4:30pm; medical transportation by request',
    contact: {
      phone: '(828) 884-3203',
      website: 'https://www.transylvaniacounty.org/departments/transportation',
      links: [
        { label: 'Transportation department', url: 'https://www.transylvaniacounty.org/departments/transportation' },
      ],
      address: { city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call County Transportation',
      url: 'tel:+18288843203',
      note: 'Press option 2 for medical transportation. Book off-route trips ahead.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
    access: { appointmentDelayDays: 4, referralRequired: false },
  },

  // ── Benefits & assistance ──
  {
    id: 'dss-benefits-enrollment',
    name: 'Benefits & Enrollment',
    org: 'Transylvania County DSS',
    categories: ['benefits'],
    summary:
      'The county Department of Social Services administers Medicaid, SNAP (Food and Nutrition Services), WorkFirst, Child Care Subsidy, and Energy Assistance for residents. Apply online statewide through NC ePASS or in person.',
    seoTitle: 'Apply for Medicaid, SNAP & Energy Assistance in Transylvania County | Transylvania County DSS',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'County residents. Program eligibility varies — DSS staff can screen and help you apply.',
    contact: {
      phone: '(828) 884-3174',
      website: 'https://www.transylvaniacounty.org/departments/social-services',
      applyUrl: 'https://epass.nc.gov/',
      links: [
        { label: 'Apply online — NC ePASS (Medicaid/SNAP)', url: 'https://epass.nc.gov/' },
        { label: 'County DSS department', url: 'https://www.transylvaniacounty.org/departments/social-services' },
      ],
      address: { street: '106 E. Morgan St.', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Apply online with NC ePASS',
      url: 'https://epass.nc.gov/',
      note: 'Or call DSS at (828) 884-3174 to ask which benefits you may qualify for.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
    access: { paperworkRequired: true },
  },

  // ── Legal aid ──
  {
    id: 'pisgah-legal-services',
    name: 'Free Civil Legal Aid & Benefits Appeals',
    org: 'Pisgah Legal Services',
    categories: ['legal', 'benefits'],
    summary:
      'Free civil legal assistance for low-income western NC residents — benefits denials and appeals (Medicaid, disability, SNAP), housing and eviction, domestic-violence protection, and more. Serves Transylvania County from a Brevard office and regional clinics.',
    seoTitle: 'Free Legal Help With Benefits Appeals & Evictions in Transylvania County | Pisgah Legal Services',
    serviceArea: { county: 'Transylvania', inCounty: true, note: 'Regional (western NC)' },
    eligibility: 'Low-income western NC residents. Apply online, by phone, or through the "Apply for Help" page.',
    hours: 'Intake Mon–Fri 8:30am–5pm; Brevard office by appointment',
    contact: {
      phone: '(828) 253-0406',
      tollFree: '(800) 489-6144',
      website: 'https://www.pisgahlegal.org',
      applyUrl: 'https://plsoi.legalserver.org/modules/matter/extern_intake.php?pid=129&h=daa817&',
      links: [
        { label: 'Free legal assistance / Apply', url: 'https://www.pisgahlegal.org/free-legal-assistance/' },
        { label: 'Hurricane Helene legal help', url: 'https://www.pisgahlegal.org/helene/' },
      ],
      address: { street: '130 S. Broad St.', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Pisgah Legal Services',
      url: 'tel:+18004896144',
      note: 'Toll-free intake: (800) 489-6144, or (828) 253-0406. You can also apply online.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },

  // ── Disaster recovery ──
  {
    id: 'fwrd-long-term-recovery',
    name: 'Long-Term Recovery Group',
    org: 'FWRD Transylvania',
    categories: ['disaster-recovery', 'navigation'],
    summary:
      'The county’s long-term recovery group for Hurricane Helene: disaster case management, unmet-needs identification, and cross-agency support across housing, construction, legal advocacy, economic recovery, and emotional support.',
    seoTitle: 'Hurricane Helene Disaster Case Management & Recovery Help in Transylvania County | FWRD Transylvania',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Households affected by Hurricane Helene. Request help via the "Get Help" form or by phone.',
    contact: {
      phone: '(828) 214-5021',
      email: 'info@gofwrd.org',
      website: 'https://gofwrd.org',
      applyUrl: 'https://gofwrd.org/get-help',
      links: [
        { label: 'Get help / request support', url: 'https://gofwrd.org/get-help' },
        { label: 'Get involved', url: 'https://gofwrd.org/get-involved/' },
      ],
      address: { street: '153 West Jordan Street', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call FWRD Transylvania',
      url: 'tel:+18282145021',
      note: 'Ask to be connected with a disaster case manager, or use the online Get Help form.',
    },
    verified: 'confirmed',
    lastReviewed: '2026-07-23',
  },

  // ── Jobs & workforce ──
  {
    id: 'chamber-workforce-development',
    name: 'Workforce Development',
    org: 'Brevard/Transylvania Chamber of Commerce',
    categories: ['employment'],
    summary:
      'Workforce development connecting job seekers to training and employers, delivered with Blue Ridge Community College — including youth-focused and customized training pathways.',
    seoTitle: 'Job Training & Workforce Development in Transylvania County | Brevard/Transylvania Chamber of Commerce',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Contact the Chamber to learn about current workforce programs and eligibility.',
    contact: {
      phone: '(828) 883-3700',
      email: 'chamber@brevardncchamber.org',
      website: 'https://brevardncchamber.org',
      links: [
        { label: 'Jobs & employment', url: 'https://brevardncchamber.org/employment/' },
        { label: 'NCWorks jobs portal', url: 'https://www.ncworks.gov/' },
      ],
      address: { street: '175 East Main St.', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call the Chamber of Commerce',
      url: 'tel:+18288833700',
      note: 'Ask about workforce development and training programs.',
    },
    verified: 'needs-verification',
    lastReviewed: '2026-07-23',
  },

  // ── Digital access ──
  {
    id: 'through-the-trees-digital-access',
    name: 'Digital Access Assistance',
    org: 'Through the Trees',
    categories: ['digital-access'],
    summary:
      'Refurbished device matching (laptops, phones, tablets), digital-literacy training, and help enrolling in internet-cost assistance programs — from a storefront on Main Street in Brevard.',
    seoTitle: 'Free Device Requests & Digital Skills Help in Brevard | Through the Trees',
    serviceArea: { county: 'Transylvania', inCounty: true, towns: ['Brevard'] },
    eligibility: 'Open door; free device requests and affordable sales. Check the qualifications page.',
    hours: 'Wed–Fri 10am–5pm; Sat 12pm–5pm',
    contact: {
      phone: '(828) 209-8872',
      website: 'https://www.throughthetrees.us',
      applyUrl: 'https://www.throughthetrees.us/device-request',
      links: [
        { label: 'Request a device', url: 'https://www.throughthetrees.us/device-request' },
        { label: 'Who qualifies', url: 'https://www.throughthetrees.us/qualifications' },
      ],
      address: { street: '120 W Main St', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Request a device online',
      url: 'https://www.throughthetrees.us/device-request',
      note: 'Or call (828) 209-8872 to ask about a device or internet-cost help.',
    },
    verified: 'confirmed',
    lastReviewed: '2026-07-23',
  },

  // ── Language & newcomer support ──
  {
    id: 'el-centro-latino-resource-center',
    name: 'Latino Community Resource Center',
    org: 'El Centro Comunitario Hispano-Americano',
    categories: ['language-access', 'navigation'],
    summary:
      'An open-door resource center serving the Hispanic community — connecting families to broader county resources and running programs like a Homework Club. Spanish-language help.',
    seoTitle: 'Spanish-Language Help & Resources for Hispanic Families in Brevard | El Centro Comunitario Hispano-Americano',
    serviceArea: { county: 'Transylvania', inCounty: true, towns: ['Brevard'] },
    eligibility: 'Open door; serves the Hispanic/Latino community and connects families to county resources.',
    hours: 'Mon–Thu 10am–5pm',
    contact: {
      phone: '(828) 585-7018',
      email: 'info@elcentrobrevard.com',
      website: 'https://elcentrobrevard.com',
      applyUrl: 'https://elcentrobrevard.com/contact/',
      links: [
        { label: 'Programs', url: 'https://elcentrobrevard.com/programs/' },
        { label: 'Facebook', url: 'https://www.facebook.com/ElCentroBrevard/' },
      ],
      address: { street: '249 E Main St', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call El Centro',
      url: 'tel:+18285857018',
      note: 'Se habla español. Ask what help is available for your family.',
    },
    verified: 'confirmed',
    lastReviewed: '2026-07-23',
  },
];

// Convenience: only the categories that actually have at least one entry.
export const ACTIVE_NEED_CATEGORIES: NeedCategory[] = NEED_CATEGORIES.filter((c) =>
  RESOURCES.some((r) => r.categories.includes(c.id)),
);
