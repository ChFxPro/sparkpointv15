// SparkPoint Resource Directory — data model + seed entries.
//
// This is the structured, code-authored source for the Resource Directory (the
// browsable half of the Resilience Hub "digital twin") and the future Needs
// Finder. It follows the same convention as src/data/stories.ts: typed
// interfaces + a plain exported array that pages import directly and that
// scripts/prerender.mjs derives static /directory/:id routes from.
//
// PROVENANCE: seeded from the RuralHealthSim simulator taxonomy
// (public/databases/resource_hub_seed.json) and enriched 2026-07-23 with public
// contact info verified against each org's official website / official county
// pages. Simulator-only abstractions (journey points, composites, "do not name"
// entries) and all _internal.* staff fields were dropped. `verified` reflects
// how well each entry is confirmed for PUBLIC use — never show an unconfirmed
// entry as if it were confirmed.
//
// SEC-007: content is code/data-authored with structured plain-text fields.
// Nothing here is rendered as raw HTML.

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

// How confident we are that this entry is accurate and safe to publish.
// - confirmed:         verified against the org's official source
// - partner-input:     provided by the partner org
// - needs-verification: seeded/enriched but not yet confirmed with the org
// - estimate:          rough/modeled — do not present as authoritative
export type VerificationStatus =
  | 'confirmed'
  | 'partner-input'
  | 'needs-verification'
  | 'estimate';

export interface NeedCategory {
  id: NeedCategoryId;
  /** Public, plain-language label. */
  label: string;
  /** One-line description shown on category chips / browse tiles. */
  blurb: string;
  /** lucide-react icon name. */
  icon: string;
  /** Free-text terms the Needs Finder (Phase 2) maps to this category. */
  synonyms: string[];
}

export interface ResourceAddress {
  street?: string;
  city: string;
  state: string;
  zip: string;
}

export interface ResourceContact {
  phone?: string;
  /** 24/7 crisis line, where one exists (e.g. behavioral-health crisis). */
  crisisPhone?: string;
  tollFree?: string;
  email?: string;
  website?: string;
  address?: ResourceAddress;
  /** e.g. "Mailing address only — no public walk-in address published." */
  addressNote?: string;
}

/** The warm next action — a concrete first step, never just a bare link. */
export interface ResourceNextStep {
  label: string;
  /** https:, tel:, or mailto: */
  url?: string;
  note?: string;
}

/** Structured access frictions carried over from the simulator model. */
export interface ResourceAccess {
  referralRequired?: boolean;
  appointmentDelayDays?: number;
  transportationRequired?: boolean;
  digitalAccessRequired?: boolean;
  paperworkRequired?: boolean;
}

export interface ResourceEntry {
  /** Stable slug → /directory/:id (used for SEO prerender). */
  id: string;
  /** Service / program name as a resident would recognize it. */
  name: string;
  /** Parent organization. */
  org: string;
  categories: NeedCategoryId[];
  /** Plain-text public description. */
  summary: string;
  serviceArea: {
    county: string;
    towns?: string[];
    /** Is the service inside Transylvania County? */
    inCounty: boolean;
    note?: string;
  };
  eligibility?: string;
  hours?: string;
  contact: ResourceContact;
  nextStep: ResourceNextStep;
  verified: VerificationStatus;
  /** ISO date the entry was last reviewed/enriched. */
  lastReviewed?: string;
  featured?: boolean;
  access?: ResourceAccess;
}

// ─── Need categories (browse taxonomy + Needs Finder synonyms) ───

export const NEED_CATEGORIES: NeedCategory[] = [
  {
    id: 'food',
    label: 'Food & meals',
    blurb: 'Food pantries, hot meals, and home-delivered meals.',
    icon: 'Utensils',
    synonyms: ['hungry', 'food', 'groceries', 'food pantry', 'meals', 'snap', 'ebt', 'food stamps', 'nutrition', 'wic', 'hot meal', 'baby formula'],
  },
  {
    id: 'housing',
    label: 'Housing & shelter',
    blurb: 'Emergency shelter and home repair.',
    icon: 'Home',
    synonyms: ['homeless', 'shelter', 'housing', 'place to stay', 'rent', 'eviction', 'repairs', 'roof', 'home repair', 'nowhere to go'],
  },
  {
    id: 'health',
    label: 'Health care',
    blurb: 'Primary care, pediatrics, and public health.',
    icon: 'Stethoscope',
    synonyms: ['doctor', 'clinic', 'sick', 'medical', 'primary care', 'pediatrician', 'checkup', 'uninsured', 'prescription', 'health', 'wic', 'immunization', 'vaccine'],
  },
  {
    id: 'mental-health',
    label: 'Mental & behavioral health',
    blurb: 'Counseling, substance-use support, and crisis help.',
    icon: 'HeartPulse',
    synonyms: ['counseling', 'therapy', 'depression', 'anxiety', 'substance', 'addiction', 'recovery', 'crisis', 'mental health', 'behavioral health', 'grief', 'stress'],
  },
  {
    id: 'transportation',
    label: 'Transportation',
    blurb: 'Rides to appointments and around the county.',
    icon: 'Bus',
    synonyms: ['ride', 'bus', 'transport', 'transportation', 'car', 'get to appointment', 'van', 'no car', "can't drive"],
  },
  {
    id: 'benefits',
    label: 'Benefits & assistance',
    blurb: 'Medicaid, SNAP, energy and child-care assistance.',
    icon: 'ClipboardList',
    synonyms: ['medicaid', 'snap', 'benefits', 'energy assistance', 'heating', 'child care', 'apply', 'enroll', 'financial help', 'dss', 'assistance', 'workfirst'],
  },
  {
    id: 'legal',
    label: 'Legal aid',
    blurb: 'Free civil legal help and benefits appeals.',
    icon: 'Scale',
    synonyms: ['lawyer', 'legal', 'eviction', 'appeal', 'denied', 'benefits appeal', 'custody', 'immigration', 'court', 'legal aid'],
  },
  {
    id: 'disaster-recovery',
    label: 'Disaster recovery',
    blurb: 'Storm and flood recovery, repairs, and case management.',
    icon: 'CloudRain',
    synonyms: ['helene', 'flood', 'storm', 'disaster', 'recovery', 'damage', 'fema', 'hurricane', 'rebuild'],
  },
  {
    id: 'employment',
    label: 'Jobs & workforce',
    blurb: 'Job training and workforce development.',
    icon: 'Briefcase',
    synonyms: ['job', 'work', 'career', 'training', 'employment', 'resume', 'workforce', 'hiring', 'unemployed'],
  },
  {
    id: 'digital-access',
    label: 'Digital access',
    blurb: 'Devices, internet help, and digital skills.',
    icon: 'Laptop',
    synonyms: ['computer', 'laptop', 'internet', 'wifi', 'device', 'online', 'digital', 'tablet', 'phone', 'email help'],
  },
  {
    id: 'language-access',
    label: 'Language & newcomer support',
    blurb: 'Spanish-language help and newcomer navigation.',
    icon: 'Languages',
    synonyms: ['spanish', 'espanol', 'latino', 'hispanic', 'translation', 'interpreter', 'newcomer', 'immigrant', 'english', 'idioma'],
  },
  {
    id: 'navigation',
    label: 'Get help navigating',
    blurb: 'Not sure where to start? A person will help you find it.',
    icon: 'Compass',
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
// Contact info verified 2026-07-23 against each org's official website/pages.
// Entries marked needs-verification still need a direct confirmation with the org.

export const RESOURCES: ResourceEntry[] = [
  // ── Get help navigating ──
  {
    id: 'sparkpoint-resilience-hub-navigation',
    name: 'Resilience Hub Navigation',
    org: 'SparkPoint',
    categories: ['navigation'],
    summary:
      "Not sure where to start? SparkPoint's Resilience Hub is an open door — talk with someone who will help you figure out what you need and connect you to the right local resource and a concrete first step. No eligibility screening to talk.",
    serviceArea: { county: 'Transylvania', inCounty: true, note: 'Countywide' },
    eligibility: 'Open door. No eligibility screening to talk with a navigator.',
    hours: 'Weekdays 9am–5pm, some evenings',
    contact: {
      email: 'info@yoursparkpoint.org',
      website: 'https://yoursparkpoint.org',
      address: { street: '94 S. Caldwell Street', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Email the Resilience Hub',
      url: 'mailto:info@yoursparkpoint.org',
      note: 'Or stop by 94 S. Caldwell Street in Brevard during weekday hours.',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Weekday outreach and by referral. Confirm current program capacity and intake with DSS.',
    contact: {
      phone: '(828) 884-3174',
      website: 'https://www.transylvaniacounty.org/departments/social-services',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Short intake; household-size based. Confirm the current pickup schedule with the pantry.',
    hours: 'Mon–Fri 9am–12pm & 1–4pm; extended Tuesdays until 6pm',
    contact: {
      phone: '(828) 884-2866',
      email: 'tcm@sharinghouse.org',
      website: 'https://www.sharinghouse.org',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Name and household size only. No documentation required.',
    hours: 'Mon–Fri 9am–2pm; hot meals & groceries served 12pm–2pm',
    contact: {
      phone: '(828) 877-3577',
      email: 'breadoflifetc@gmail.com',
      website: 'https://www.breadoflifetc.org',
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
      'A rotating pantry at a different location each Thursday, partnering with MANNA FoodBank and the Transylvania Farmers Market to reach neighbors across the county.',
    serviceArea: { county: 'Transylvania', inCounty: true, note: 'Location rotates weekly' },
    eligibility: 'Open to county residents. Pantry location rotates — confirm the current weekly schedule.',
    hours: 'First through fourth Thursdays — location rotates',
    contact: {
      email: 'hungerctc@gmail.com',
      website: 'https://www.hungerfreetc.org',
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
    serviceArea: { county: 'Transylvania', inCounty: true, towns: ['Brevard'] },
    eligibility: 'Homebound residents who cannot easily shop or cook. Confirm current capacity and any waitlist.',
    hours: 'Program office Mon–Fri 9am–1pm; meals delivered weekdays ~11am–12pm',
    contact: {
      phone: '(828) 883-3743',
      website: 'https://www.mealsonwheelsbrevard.org',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'For those who are literally homeless with no other place to go. Intake interviews by appointment, Mon–Thu.',
    hours: 'Intake interviews Monday–Thursday, by appointment',
    contact: {
      phone: '(828) 877-2040',
      email: 'office@havenoftc.org',
      website: 'https://havenoftc.org',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Homeowners with repair or storm/flood-damage needs. Apply through the Housing Programs section of the website.',
    hours: 'ReStore: Tue–Fri 9:30am–5pm, Sat 9:30am–4pm. Program inquiries by phone.',
    contact: {
      phone: '(828) 884-3464',
      email: 'info@transylvaniahabitat.org',
      website: 'https://transylvaniahabitat.org',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Open to all; sliding-scale fees for uninsured/underinsured patients (FQHC).',
    hours: 'Mon & Wed 8am–8pm; Tue, Thu, Fri 8am–5pm',
    contact: {
      phone: '(828) 883-5550',
      email: 'info@brchs.com',
      website: 'https://www.brchs.com/locations/blue-ridge-health-transylvania',
      address: { street: '29 West French Broad Street, Suite 203', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Blue Ridge Health',
      url: 'tel:+18288835550',
      note: 'Ask to become a patient or book a visit.',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Open to all; sliding-scale fees for uninsured/underinsured families (FQHC).',
    hours: 'Mon & Wed 8am–8pm; Tue, Thu, Fri 8am–5pm',
    contact: {
      phone: '(828) 883-5550',
      email: 'info@brchs.com',
      website: 'https://www.brchs.com/locations/blue-ridge-health-transylvania',
      address: { street: '29 West French Broad Street, Suite 203', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Blue Ridge Health',
      url: 'tel:+18288835550',
      note: 'Ask about pediatric appointments.',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Open to county residents.',
    hours: 'Mon–Thu 8:30am–12pm & 1–5pm; Fri 8:30am–5pm',
    contact: {
      phone: '(828) 884-3135',
      website: 'https://transylvaniahealth.org',
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
    serviceArea: { county: 'Transylvania', inCounty: true, note: 'Regional (western NC)' },
    eligibility: 'Open access line for anyone needing behavioral-health help; crisis line is available to all, 24/7.',
    hours: 'Member & Recipient Services Mon–Sat 7am–6pm; crisis line 24/7',
    contact: {
      phone: '(800) 962-9003',
      crisisPhone: '(800) 849-6127',
      email: 'member.services@vayahealth.com',
      website: 'https://www.vayahealth.com',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Adults seeking outpatient behavioral-health support. Confirm current intake with the office.',
    hours: 'Mon–Fri 8:30am–5pm',
    contact: {
      phone: '(828) 883-2708',
      email: 'info@brchs.com',
      website: 'https://www.brchs.com/locations/meridian-behavioral-health-services-brevard/',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Enrolled students; parent consent required for skills groups.',
    hours: 'School days',
    contact: {
      phone: '(828) 884-6173',
      website: 'https://www.tcsnc.org',
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
    serviceArea: { county: 'Transylvania', inCounty: true, towns: ['Brevard', 'Rosman'] },
    eligibility:
      'Fixed route weekdays ~6:30am–4:30pm, $1 exact cash per boarding. Off-route, medical, and out-of-county trips are demand-response and must be reserved ~24–48 hours ahead.',
    hours: 'Fixed route weekdays ~6:30am–4:30pm; medical transportation by request',
    contact: {
      phone: '(828) 884-3203',
      website: 'https://www.transylvaniacounty.org/departments/transportation',
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
      'The county Department of Social Services administers Medicaid, SNAP (Food and Nutrition Services), WorkFirst, Child Care Subsidy, and Energy Assistance for residents.',
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'County residents. Program eligibility varies — DSS staff can screen and help you apply.',
    contact: {
      phone: '(828) 884-3174',
      website: 'https://www.transylvaniacounty.org/departments/social-services',
      address: { street: '106 E. Morgan St.', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Transylvania County DSS',
      url: 'tel:+18288843174',
      note: 'Ask which benefits you may qualify for and how to apply.',
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
    serviceArea: { county: 'Transylvania', inCounty: true, note: 'Regional (western NC)' },
    eligibility: 'Low-income western NC residents. Apply through the intake line or the "Apply for Help" page.',
    hours: 'Intake Mon–Fri 8:30am–5pm; Brevard office by appointment',
    contact: {
      phone: '(828) 253-0406',
      tollFree: '(800) 489-6144',
      website: 'https://www.pisgahlegal.org',
      address: { street: '130 S. Broad St.', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Pisgah Legal Services',
      url: 'tel:+18004896144',
      note: 'Toll-free intake: (800) 489-6144, or (828) 253-0406.',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Households affected by Hurricane Helene. Request help via the "Get HELP" link or by phone.',
    contact: {
      phone: '(828) 214-5021',
      email: 'info@gofwrd.org',
      website: 'https://gofwrd.org',
      address: { street: '153 West Jordan Street', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call FWRD Transylvania',
      url: 'tel:+18282145021',
      note: 'Ask to be connected with a disaster case manager.',
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
    serviceArea: { county: 'Transylvania', inCounty: true },
    eligibility: 'Contact the Chamber to learn about current workforce programs and eligibility.',
    contact: {
      phone: '(828) 883-3700',
      email: 'chamber@brevardncchamber.org',
      website: 'https://brevardncchamber.org',
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
    serviceArea: { county: 'Transylvania', inCounty: true, towns: ['Brevard'] },
    eligibility: 'Open door; free device requests and affordable sales.',
    hours: 'Wed–Fri 10am–5pm; Sat 12pm–5pm',
    contact: {
      phone: '(828) 209-8872',
      website: 'https://www.throughthetrees.us',
      address: { street: '120 W Main St', city: 'Brevard', state: 'NC', zip: '28712' },
    },
    nextStep: {
      label: 'Call Through the Trees',
      url: 'tel:+18282098872',
      note: 'Ask about a refurbished device or internet-cost help.',
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
    serviceArea: { county: 'Transylvania', inCounty: true, towns: ['Brevard'] },
    eligibility: 'Open door; serves the Hispanic/Latino community and connects families to county resources.',
    hours: 'Mon–Thu 10am–5pm',
    contact: {
      phone: '(828) 585-7018',
      email: 'info@elcentrobrevard.com',
      website: 'https://elcentrobrevard.com',
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
