/* Backstage — the contents of the internal parallel site at /internal.
 *
 * This file is the one place to add a new internal destination. Lanes are
 * grouped by AUDIENCE rather than by artifact type, because the first thing a
 * visitor needs to know is "can I open this?" — type-based grouping (reports vs
 * media vs docs) belongs one level down, inside each destination. */

export type BackstageAccess =
  /** No sign-in. Unlisted + noindex only — never put anything sensitive here. */
  | 'open'
  /** Any signed-in account, including external co-organizers on `partner`. */
  | 'shared'
  /** Any signed-in staff or board member. */
  | 'member'
  /** Board members only. */
  | 'board';

export type BackstageAccent = 'pink' | 'gold' | 'purple' | 'orange';

export interface BackstageDestination {
  id: string;
  title: string;
  description: string;
  /** Internal route. Omit (with `status: 'soon'`) for a placeholder. */
  to?: string;
  /** External destination — used for systems that live off this site entirely. */
  href?: string;
  /** Small line under the title — who it's shared with, how fresh it is. */
  meta?: string;
  /** Network or client prerequisite, e.g. 'Tailscale'. Rendered as a badge. */
  requires?: string;
  status?: 'live' | 'soon';
}

export interface BackstageLane {
  id: string;
  name: string;
  tagline: string;
  access: BackstageAccess;
  accent: BackstageAccent;
  destinations: BackstageDestination[];
}

export const BACKSTAGE_LANES: BackstageLane[] = [
  {
    id: 'shares',
    name: 'Open shares',
    tagline: 'Live boards we hand to partners by link. No sign-in needed.',
    access: 'open',
    accent: 'gold',
    destinations: [
      {
        id: 'rural-health-status',
        title: 'Rural Health Convening — planning status',
        description:
          'Live planning board for the 2026 WNC Regional Rural Health Convening: workstreams, owners, seat count, and countdown.',
        to: '/internal/status',
        meta: 'Shared with FHLI + NCRHA',
        status: 'live',
      },
    ],
  },
  {
    id: 'convening',
    name: 'Convening workspace',
    tagline:
      'Shared working surface for SparkPoint, NCRHA, and FHLI on the Oct 1 convening. Co-organizers sign in — it is not a forwardable link.',
    access: 'shared',
    accent: 'orange',
    destinations: [
      {
        id: 'convening-workspace',
        title: '2026 WNC Regional Rural Health Convening',
        description:
          'Open decisions needing a call, the current print and promo package, sponsor roster, and live registration count.',
        to: '/internal/convening',
        meta: 'SparkPoint · NCRHA · FHLI',
        status: 'live',
      },
    ],
  },
  {
    id: 'systems',
    name: 'Team systems',
    tagline:
      'Tools that live on SparkPoint’s own hardware. These stay on the private network — they are linked from here, not hosted here.',
    access: 'member',
    accent: 'pink',
    destinations: [
      {
        id: 'brain',
        title: 'The Brain — document search',
        description:
          'Keyword and AI semantic search across the full SparkPoint document library on the NAS. Separate login from Backstage.',
        href: 'http://100.102.143.81:8808',
        requires: 'Tailscale',
        meta: '14,000+ documents',
        status: 'live',
      },
    ],
  },
  {
    id: 'library',
    name: 'Reports library',
    tagline: 'Recurring data snapshots for leadership, funders, and partners.',
    access: 'member',
    accent: 'orange',
    destinations: [
      {
        id: 'reports',
        title: 'All published reports',
        description:
          'Every report snapshot we have published, newest first — open one to see the full dashboard and download it.',
        to: '/internal/reports',
        meta: 'Social media reporting live now',
        status: 'live',
      },
      {
        id: 'program-outcomes',
        title: 'Program outcomes',
        description:
          'Participation, retention, and outcome measures across SparkPoint programs.',
        status: 'soon',
      },
      {
        id: 'development',
        title: 'Development + fundraising',
        description: 'Giving trends, grant pipeline, and campaign progress.',
        status: 'soon',
      },
    ],
  },
  {
    id: 'board',
    name: 'Board room',
    tagline: 'Governance material for the SparkPoint board of directors.',
    access: 'board',
    accent: 'purple',
    destinations: [
      {
        id: 'board-packet',
        title: 'Meeting packets',
        description: 'Agendas, minutes, and pre-reads for upcoming board meetings.',
        status: 'soon',
      },
      {
        id: 'financials',
        title: 'Financial dashboard',
        description: 'Budget vs. actual, reserves, and the current-year financial picture.',
        status: 'soon',
      },
    ],
  },
  {
    id: 'lab',
    name: 'The lab',
    tagline:
      'Working ground for concepts, media, and design experiments — things being tested before they reach the public site.',
    access: 'member',
    accent: 'gold',
    destinations: [
      {
        id: 'prototypes',
        title: 'Prototypes',
        description:
          'In-progress page concepts and interaction tests, parked here so they can be shared and reacted to without shipping.',
        status: 'soon',
      },
      {
        id: 'media',
        title: 'Media + assets',
        description: 'Working photo, video, and brand material not yet cleared for public release.',
        status: 'soon',
      },
    ],
  },
];

export const OPEN_LANES = BACKSTAGE_LANES.filter((lane) => lane.access === 'open');
export const GATED_LANES = BACKSTAGE_LANES.filter((lane) => lane.access !== 'open');
