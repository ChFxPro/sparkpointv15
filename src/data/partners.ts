// Canonical partner/sponsor directory — the single source both the homepage
// "Community Built in Transylvania County" diagram and /partners read from.
//
// To add a real link for a partner once one is confirmed, add `url` and a
// `logoKey` (a short slug of your choosing). Then, in whichever component
// needs the logo image, add that same key to its local logo-asset map
// (see SponsorsPage.tsx's PARTNER_LOGOS) — this file never imports binary
// assets directly, so it stays a plain, portable data module.
//
// Icon names are lucide-react component names, resolved by each consumer via
// a local `Record<string, LucideIcon>` map (mirrors the existing convention
// in src/data/resources.ts + src/pages/DirectoryPage.tsx's CATEGORY_ICONS).

export interface Partner {
  name: string;
  /** Only set for the small, confirmed set of orgs with a real external URL. Never fabricate. */
  url?: string;
  /** Key into a consumer-local logo image map. Only set alongside `url`. */
  logoKey?: string;
  /** Sort priority for the curated featured-partners strip; only meaningful when `url` is set. */
  featuredOrder?: number;
}

export interface PartnerSector {
  id: string;
  title: string;
  description: string;
  color: string;
  /** lucide-react icon name — resolve via a local Record<string, LucideIcon> map per consumer. */
  icon: string;
  examples?: string[];
  /** Percent position for the homepage diagram's desktop corner layout. */
  homePosition: { x: number; y: number };
  partners: Partner[];
}

export const PARTNER_SECTORS: PartnerSector[] = [
  {
    id: 'edu-youth',
    title: 'Education & Youth',
    description: 'Learning, youth leadership, and school-connected support.',
    color: '#FDB515',
    icon: 'GraduationCap',
    examples: ['School and youth coordination', 'Community leadership development'],
    homePosition: { x: 15, y: 20 },
    partners: [
      { name: 'TCS', url: 'https://www.tcsnc.org/' },
      { name: 'Blue Ridge Community College', url: 'https://www.blueridge.edu/' },
      { name: 'Brevard College', url: 'https://brevard.edu/' },
      { name: 'TC Strong' },
      { name: 'Boys & Girls Club of Transylvania County', url: 'https://www.bgctransylvania.org/' },
      { name: 'El Centro', url: 'https://elcentrobrevard.com/' },
      { name: 'Brevard Academy', url: 'https://www.brevardacademy.org/' },
      { name: 'Mountain Sun Community School', url: 'https://mountainsunschool.org/' },
      { name: 'Rise & Shine Afterschool Program' },
      { name: 'Brevard Music Center Institute', url: 'https://www.brevardmusic.org/institute/' },
      { name: 'Eagles Nest Camp', url: 'https://www.eaglesnestcamp.org/' },
      { name: 'UNC Chapel Hill, Gillings School of Public Health', url: 'https://sph.unc.edu/' },
      { name: 'Mountain Roots', url: 'https://mountainroots.org/' },
      { name: 'Smart Start of Transylvania County', url: 'https://www.smartstarttransylvania.org/' },
      { name: 'VISION Transylvania', url: 'https://www.visiontc.org/' },
      { name: 'Transylvania County Education Foundation', url: 'https://www.tcsef.org/' },
      { name: 'Brevard Music Center', url: 'https://www.brevardmusic.org', logoKey: 'brevard-music-center', featuredOrder: 5 },
    ],
  },
  {
    id: 'nonprofit-community',
    title: 'Nonprofit & Community',
    description: 'Community-serving organizations working together on access and support.',
    color: '#E03694',
    icon: 'HeartHandshake',
    examples: ['Resource sharing and referral', 'Community recovery collaboration'],
    homePosition: { x: 85, y: 20 },
    partners: [
      { name: 'The Hunger Coalition', url: 'https://www.hungerfreetc.org/' },
      { name: 'Just Economics of Western North Carolina', url: 'https://www.justeconomicswnc.org/' },
      { name: 'FWRD Transylvania (LTRG)' },
      { name: 'Through the Trees' },
      { name: 'Housing Assistance', url: 'https://www.housing-assistance.com/' },
      { name: 'Camp Bluebird', url: 'https://www.campbluebirdwnc.org/' },
      { name: 'Friends of Rosman' },
      { name: 'Meals on Wheels' },
      { name: 'Bread of Life', url: 'https://breadoflifetc.org/' },
      { name: 'The Sharing House', url: 'https://sharinghouse.org/' },
      { name: 'Pisgah Legal Services', url: 'https://www.pisgahlegal.org/' },
      { name: 'Habitat for Humanity Transylvania County', url: 'https://transylvaniahabitat.org/' },
      { name: 'Center for Trauma Resilient Communities' },
      { name: "Jameson's Joy" },
      { name: 'Transylvania County Arts Council', url: 'https://www.tcarts.org/' },
      { name: 'Transylvania County Tourism Development Authority', url: 'https://www.explorebrevard.com', logoKey: 'brevard-tcda', featuredOrder: 6 },
    ],
  },
  {
    id: 'civic-government',
    title: 'Civic & Government',
    description: 'Public and civic leadership supporting countywide resilience.',
    color: '#F15F48',
    icon: 'Landmark',
    examples: ['Civic partnerships', 'Local leadership coordination'],
    homePosition: { x: 10, y: 65 },
    partners: [
      { name: 'Transylvania County', url: 'https://www.transylvaniacounty.org/' },
      { name: 'City of Brevard', url: 'https://www.cityofbrevard.com/' },
      { name: 'Town of Rosman' },
      { name: "Transylvania County Sheriff's Office", url: 'https://www.tcsonc.org/' },
      { name: 'Brevard/Transylvania Chamber of Commerce', url: 'https://brevardncchamber.org/' },
      { name: 'Rotary Club of Pisgah Forest', url: 'https://www.pisgahforestrotary.org/' },
      { name: 'AAUW', url: 'https://brevard-nc.aauw.net/' },
      { name: 'Mary C Jenkins Community & Cultural Center', url: 'https://www.marycjenkins.org/' },
      { name: 'Looking Glass, CPA' },
    ],
  },
  {
    id: 'health-wellness',
    title: 'Health & Wellness',
    description: 'Health systems and wellness partners strengthening community care.',
    color: '#9E509F',
    icon: 'Stethoscope',
    examples: ['Whole-person wellness collaboration', 'Community mental health support'],
    homePosition: { x: 90, y: 65 },
    partners: [
      { name: 'UNC Health Pardee', url: 'https://www.pardeehospital.org', logoKey: 'unc-health', featuredOrder: 3 },
      { name: 'Transylvania Regional Hospital', url: 'https://www.missionhealth.org/locations/transylvania-regional-hospital' },
      { name: 'Transylvania Public Health Department', url: 'https://transylvaniahealth.org/' },
      // No distinct program site confirmed; links to parent Transylvania Public Health per verification notes.
      { name: 'TREND 2.0 - Mental Health', url: 'https://transylvaniahealth.org/' },
      { name: 'Hendersonville Pediatrics', url: 'https://www.hendersonvillepediatrics.com/' },
      { name: 'CARE Coalition' },
    ],
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Business partners supporting workforce and opportunity pathways.',
    color: '#4F46E5',
    icon: 'Handshake',
    examples: ['Workforce and opportunity partnerships', 'Industry collaboration'],
    homePosition: { x: 25, y: 88 },
    partners: [
      { name: 'Alulua (formally TVS)' },
      { name: 'Schenck Job Corps Civilian Conservation Center', url: 'https://schenck.jobcorps.gov/' },
      { name: 'Comporium', url: 'https://www.comporium.com', logoKey: 'comporium', featuredOrder: 7 },
      { name: 'Self-Help Credit Union', url: 'https://www.self-help.org', logoKey: 'self-help', featuredOrder: 8 },
    ],
  },
  {
    id: 'sponsors-funders',
    title: 'Sponsors & Funders',
    description: 'Funders and sponsors helping sustain long-term impact.',
    color: '#14B8A6',
    icon: 'Sparkles',
    examples: ['Sustained funding partnerships', 'Strategic investment in resilience'],
    homePosition: { x: 75, y: 88 },
    partners: [
      { name: 'Dogwood Health Trust', url: 'https://dogwoodhealthtrust.org', logoKey: 'dogwood', featuredOrder: 1 },
      { name: 'Lake Toxaway Charities', url: 'https://laketoxawaycharities.org/' },
      { name: 'WNC Bridge Foundation', url: 'https://wncbridge.org/' },
      { name: 'Vaya Health', url: 'https://www.vayahealth.com/' },
      { name: 'American Red Cross', url: 'https://www.redcross.org', logoKey: 'red-cross', featuredOrder: 4 },
      { name: 'St. Philips Episcopal Church', url: 'https://www.stphilipsbrevardnc.org/' },
      { name: 'Pisgah Health Foundation', url: 'https://pisgahhealthfoundation.org', logoKey: 'phf', featuredOrder: 2 },
    ],
  },
];

export const PARTNER_SECTOR_BY_ID: Record<string, PartnerSector> = Object.fromEntries(
  PARTNER_SECTORS.map((s) => [s.id, s])
);

export const FEATURED_PARTNERS: Array<Partner & { url: string; logoKey: string }> = PARTNER_SECTORS
  .flatMap((s) => s.partners)
  .filter((p): p is Partner & { url: string; logoKey: string } => Boolean(p.url && p.logoKey))
  .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
