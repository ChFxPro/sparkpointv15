/* 2026 WNC Regional Rural Health Convening — shared co-organizer workspace.
 *
 * SparkPoint, NCRHA, and FHLI co-organize this event. This is deliberately ONE
 * shared surface rather than a room per organization: they are co-leads on the
 * same event, not separate audiences, so splitting them would hide each partner's
 * work from the others.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT MAY GO HERE
 *
 * This workspace sits behind Backstage sign-in and is reachable by accounts on
 * the `partner` role, so it may carry more than an open share — sponsor names,
 * tiers, and registration counts.
 *
 * It still MAY NOT carry: dollar figures (sponsorship amounts, event budget),
 * personal data, or staff contact detail. That matches the existing rule in
 * opsStatus.ts, which deliberately strips assignees and budget from the Monday
 * board before it reaches a partner-facing surface. Keep the two consistent.
 *
 * Files under public/downloads/ are served WITHOUT authentication — anyone with
 * the URL can fetch them. Only mass-distribution material (the invitations,
 * which are printed and QR-shared) belongs there. Anything that needs the gate
 * must be rendered from this file, not linked as a static asset.
 * ───────────────────────────────────────────────────────────────────────────── */

import { PARTNER_SECTORS } from './partners';

const BASE = import.meta.env.BASE_URL;
const DOWNLOADS = `${BASE}downloads/convening/`;

export const CONVENING_EVENT_DATE = '2026-10-01T08:30:00-04:00';
export const CONVENING_VENUE = 'Deerwoode Reserve, Brevard NC';
export const CONVENING_EXPECTED_ATTENDANCE = '150–200 people, roughly 40 groups';

/** Where the decision list was last reconciled against Monday + project notes. */
export const CONVENING_DECISIONS_SYNCED_AT = '2026-08-07';

export interface ConveningDecision {
  id: string;
  question: string;
  detail: string;
  /** Left undefined on purpose when nobody owns it yet — that is the signal. */
  owner?: string;
  neededBy?: string;
  source: string;
}

/* Sourced from the Monday board snapshot (synced 2026-08-07) and the convening
   project notes. Owners and dates are intentionally blank where none has been
   set — an unowned decision showing "Needs an owner" is the useful signal. */
export const CONVENING_DECISIONS: ConveningDecision[] = [
  {
    id: 'sparkpoint-role',
    question: 'What is SparkPoint’s role on the day?',
    detail:
      'Host, co-host, or presenter — never explicitly settled. It shapes the run of show, the printed program, and how all three organizations are introduced.',
    source: 'Convening project notes',
  },
  {
    id: 'day-of-agenda',
    question: 'Finalize the day-of agenda',
    detail:
      'Four program segments are named in the invitation: Maggie Sauer’s NCDHHS rural-health briefing, Laurie Stradley’s NC ROOTS regional update, story collection, and the Field Simulator. Order, timings, and transitions are still open.',
    source: 'Monday — In Progress',
  },
  {
    id: 'display-wording',
    question: 'Final display wording',
    detail:
      'Signage and on-screen wording for the day. Blocked behind the agenda and the role question above.',
    source: 'Convening project notes',
  },
  {
    id: 'speakers',
    question: 'Confirm speakers',
    detail: 'Named segments exist in the invitation; formal confirmation is still in progress.',
    source: 'Monday — In Progress',
  },
  {
    id: 'sponsorships',
    question: 'Confirm remaining sponsorships',
    detail:
      'Four sponsors are committed and two more sit in the Foothills tier. Whether the roster is closed or still open shapes the printed materials.',
    source: 'Monday — In Progress',
  },
  {
    id: 'org-outreach',
    question: 'Real-org outreach — eight named partners not yet contacted',
    detail:
      'Blue Ridge Health, The Sharing House, El Centro, DSS, The Haven, Meridian BH, Through the Trees, and FWRD Transylvania. These are the organizations the Field Simulator scenarios are built around, and none has been approached.',
    source: 'Convening project notes',
  },
  {
    id: 'vendors',
    question: 'Identify breakfast and lunch vendors',
    detail: 'Not started. Needed well ahead of the date for a group this size.',
    source: 'Monday — Not started',
  },
  {
    id: 'volunteers',
    question: 'Confirm event volunteers',
    detail: 'Not started. Roughly 40 groups will need floor support during the simulator.',
    source: 'Monday — Not started',
  },
];

export interface ConveningAsset {
  id: string;
  title: string;
  description: string;
  /** Print-resolution PDF. */
  href: string;
  format: string;
  /** Web/social image, where one exists — for dropping into a post or email. */
  pngHref?: string;
}

/* Print masters. These are the same files already sent to FHLI, NCRHA, and
   preregistrants, so serving them unauthenticated from public/downloads/ is
   appropriate — they are public material by the time they reach this page.
   Layered .psd sources are deliberately NOT here; they live on the NAS. */
export const CONVENING_ASSETS: ConveningAsset[] = [
  {
    id: 'invitation-5x7',
    title: 'Official invitation',
    description:
      'The invitation as sent to FHLI, NCRHA, and preregistrants. Deliberately unchanged across all print rounds.',
    href: `${DOWNLOADS}2026-WNC-Rural-Health-Convening-Official-Invitation-5x7.pdf`,
    pngHref: `${DOWNLOADS}2026-WNC-Rural-Health-Convening-Official-Invitation-5x7.png`,
    format: '5 × 7 PDF + PNG',
  },
  {
    id: 'invitation-full',
    title: 'Full-page invitation',
    description: 'Letter-size version for posting on a board or door.',
    href: `${DOWNLOADS}2026-WNC-Rural-Health-Convening-Official-Invitation-8x11.pdf`,
    pngHref: `${DOWNLOADS}2026-WNC-Rural-Health-Convening-Official-Invitation-8x11.png`,
    format: '8.5 × 11 PDF + PNG',
  },
  {
    id: 'invitation-lg',
    title: 'Large-format invitation',
    description: 'Oversize master for a poster or display board.',
    href: `${DOWNLOADS}2026-WNC-Rural-Health-Convening-Official-Invitation-lg.pdf`,
    pngHref: `${DOWNLOADS}2026-WNC-Rural-Health-Convening-Official-Invitation-lg.png`,
    format: 'Large-format PDF + PNG',
  },
  {
    id: 'invitation-half',
    title: 'Half-page invitation',
    description:
      'Native 5.5 × 8.5 master with larger copy, QR treatment, and all sponsor marks including the Foothills tier. Carries the evergreen “seating is limited” line rather than a fixed seat count.',
    href: `${DOWNLOADS}2026-WNC-Rural-Health-Convening-Invitation-Half-Page-5.5x8.5.pdf`,
    format: '5.5 × 8.5 PDF',
  },
  {
    id: 'invitation-two-up',
    title: 'Two-up print sheet',
    description:
      'Two exact half-page panels meeting at the centerline — no gutter or cut guide. Print, cut once, done.',
    href: `${DOWNLOADS}2026-WNC-Rural-Health-Convening-Invitation-Two-Up-Letter-Landscape.pdf`,
    format: '11 × 8.5 landscape PDF',
  },
  {
    id: 'flyer-bilingual',
    title: 'Bilingual flyer',
    description: 'English and Spanish flyer for reaching Spanish-speaking community members.',
    href: `${DOWNLOADS}2026-WNC-Rural-Health-Convening-Bilingual-Flyer-Print.pdf`,
    format: 'Print PDF',
  },
];

export interface ConveningSponsor {
  name: string;
  /** Resolved from partners.ts, so a URL never drifts between the two files. */
  url?: string;
  tier: 'Committed' | 'Foothills';
}

/* partners.ts is the single source of truth for a partner's name and URL; the
   convening-specific tier lives here because it exists nowhere else. If a name
   is ever changed there, the lookup misses and the sponsor renders as plain
   text rather than a broken link — visible, but not wrong. */
const PARTNER_URL_BY_NAME = new Map(
  PARTNER_SECTORS.flatMap((sector) => sector.partners).map((partner) => [partner.name, partner.url])
);

/* Names and tiers only — no dollar figures, per the content rule above. */
export const CONVENING_SPONSORS: ConveningSponsor[] = (
  [
    { name: 'UNC Health Pardee', tier: 'Committed' },
    { name: 'Pisgah Health Foundation', tier: 'Committed' },
    { name: 'Dogwood Health Trust', tier: 'Foothills' },
    { name: 'Vaya Health', tier: 'Foothills' },
  ] as const
).map((sponsor) => ({ ...sponsor, url: PARTNER_URL_BY_NAME.get(sponsor.name) }));

/* ── Joint communications plan ─────────────────────────────────────────────
 * Transcribed from the NCRHA/FHLI + SparkPoint comms plan PDF (as of 07/23/26)
 * so it can render as a live schedule instead of a flat attachment. Rendered
 * inside the sign-in gate rather than served as a file, because it names
 * individuals and their assignments — see the content rule at the top.
 *
 * If the plan is revised, update these rows and bump COMMS_PLAN_AS_OF. */

export const COMMS_PLAN_AS_OF = '2026-07-23';

export interface CommsItem {
  id: string;
  date: string;
  channel: string;
  label: string;
  owner?: string;
  note?: string;
  /** Set where the source PDF could not be read with confidence. */
  needsConfirmation?: boolean;
}

export const COMMS_PLAN: CommsItem[] = [
  {
    id: 'hew',
    date: '2026-08-05',
    channel: 'Health Equity Workgroup',
    label: 'Verbal share during the HEW meeting',
    owner: 'Kelsey',
    note: 'Send registration with the follow-up notes.',
  },
  {
    id: 'member-email-1',
    date: '2026-08-06',
    channel: 'Member email',
    label: 'Member email 1 of 2',
    note: 'The source PDF did not extract cleanly here — confirm which membership list this goes to.',
    needsConfirmation: true,
  },
  {
    id: 'intro-post',
    date: '2026-08-14',
    channel: 'LinkedIn · Instagram · Facebook',
    label: 'Intro post',
    owner: 'Abby',
    note: 'NCRHA tags SparkPoint, SparkPoint reposts NCRHA. Instagram prioritizes stories over posts.',
  },
  {
    id: 'member-email-2',
    date: '2026-08-24',
    channel: 'Member email',
    label: 'Member email 2 of 2',
    needsConfirmation: true,
  },
  {
    id: 'what-post',
    date: '2026-08-26',
    channel: 'LinkedIn · Instagram · Facebook',
    label: '“What” post',
    owner: 'Kelsey',
  },
  {
    id: 'sparkpoint-email-1',
    date: '2026-08-26',
    channel: 'SparkPoint email',
    label: 'SparkPoint blast 1 of 3',
  },
  {
    id: 'ncrha-newsletter',
    date: '2026-08-31',
    channel: 'NCRHA newsletter',
    label: 'Save the date + Zoom registration link',
    owner: 'Kelsey creates · Abby distributes',
  },
  {
    id: 'nccare360',
    date: '2026-08-31',
    channel: 'NCCARE360 newsletter',
    label: 'Newsletter placement',
    owner: 'Amari',
  },
  {
    id: 'simulator-post',
    date: '2026-09-07',
    channel: 'LinkedIn · Instagram · Facebook',
    label: 'Rural Health Simulator focus',
    owner: 'Abby',
  },
  {
    id: 'sparkpoint-email-2',
    date: '2026-09-07',
    channel: 'SparkPoint email',
    label: 'SparkPoint blast 2 of 3',
  },
  {
    id: 'reserve-post',
    date: '2026-09-21',
    channel: 'LinkedIn · Instagram · Facebook',
    label: '“Reserve your seat” post',
    owner: 'Kelsey',
  },
  {
    id: 'sparkpoint-email-3',
    date: '2026-09-21',
    channel: 'SparkPoint email',
    label: 'SparkPoint blast 3 of 3',
  },
];

/* Graphics the plan calls for. */
export const COMMS_GRAPHICS = ['Intro post', 'Rural Health Simulator', 'Reserve Your Seat'];

export const CONVENING_REGISTRATION_NOTE =
  '$40 Inclusive Registration is available with code IMPACT-REG.';
