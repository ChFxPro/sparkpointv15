// Quick-edit source for the internal status dashboard (/internal/status) and for the
// public Rural Health Convening page's seats-remaining ticker visibility. Edit this file
// directly — no other code changes needed for routine updates.

// Flip to `true` to bring the public seats-remaining ticker back on the convening page.
export const SHOW_RURAL_HEALTH_SEATS_TICKER = false;

// 2026 WNC Regional Rural Health Convening.
export const RURAL_HEALTH_EVENT_DATE = '2026-10-01T08:30:00-04:00';

export type OpsStatus = 'Now' | 'Next' | 'Blocked' | 'Monitoring' | 'Done';

export interface OpsItem {
  id: string;
  status: OpsStatus;
  title: string;
  note?: string;
}

// Terse mirror of WORKLIST.md's active items — not a replacement for it. WORKLIST.md
// stays the detailed audit trail; this is the at-a-glance version for this dashboard.
export const ONGOING_PROJECTS: OpsItem[] = [
  { id: 'RH-015', status: 'Done', title: 'Impact Health-supported Inclusive Registration rate' },
  {
    id: 'TICKET-001',
    status: 'Next',
    title: 'Branded ticket checkout cleanup',
    note: 'Disconnect leftover tickets. subdomain; repoint /donations and /newsletter.',
  },
  {
    id: 'SEC-008',
    status: 'Now',
    title: 'Privacy/retention disclosure',
    note: 'Owner/counsel sign-off on retention window + data owner.',
  },
  {
    id: 'PERF-001',
    status: 'Next',
    title: 'Mobile performance',
    note: 'Re-run production PageSpeed; Cloudflare edge tier still open.',
  },
  { id: 'PROG-001', status: 'Next', title: 'Distill active programs list under Listen/Learn/Lead' },
  { id: 'DATA-001', status: 'Next', title: 'Single source of truth for partner/resource/impact data' },
];

export const HIGH_PRIORITY: OpsItem[] = [
  { id: 'SEC-004', status: 'Next', title: 'Rate limiting + bot challenge on public intake form' },
  { id: 'SEC-005', status: 'Next', title: 'Browser security headers at the edge (CSP, frame protection)' },
  { id: 'SEC-006', status: 'Next', title: 'Restrict allowed GitHub Actions + configure Dependabot updates' },
];
