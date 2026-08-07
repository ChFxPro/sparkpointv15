// Content source for the internal status dashboard (/internal/status) and for the
// public Rural Health Convening page's seats-remaining ticker visibility. This page is
// shared with partners — keep content here presentable and free of internal-only detail
// (staff contacts, budgets, security/engineering backlog).

// Flip to `true` to bring the public seats-remaining ticker back on the convening page.
export const SHOW_RURAL_HEALTH_SEATS_TICKER = false;

// 2026 WNC Regional Rural Health Convening.
export const RURAL_HEALTH_EVENT_DATE = '2026-10-01T08:30:00-04:00';

export type MondayStatus = 'In Progress' | 'Done' | 'Stuck' | 'Not Started' | null;

export interface EventPlanningItem {
  id: string;
  name: string;
  status: MondayStatus;
  dueDate?: string;
}

export interface EventPlanningGroup {
  title: string;
  items: EventPlanningItem[];
}

// Manually-refreshed snapshot of the "NCRHA Fall 2026 Convening" Monday.com board.
// Source: https://yoursparkpoint-company.monday.com/boards/18414150575
// Assignees, notes, files, and budget are intentionally excluded — this board mixes
// internal-only detail (staff contacts, dollar figures) with planning status, and only
// the status is appropriate to show here. Re-sync by pulling the board again and
// updating this list; there's no live connection.
//
// Grouped by actual status rather than Monday's lane placement — Monday's own board
// still has some Done items sitting in the "In Progress" lane (lane is a manual kanban
// placement, not auto-synced to status), so anything marked Done lives under Completed
// here regardless of which lane it's in on the board itself.
export const EVENT_PLANNING_SYNCED_AT = '2026-08-07';

export const EVENT_PLANNING_BOARD: EventPlanningGroup[] = [
  {
    title: 'In Progress',
    items: [
      { id: '12067962885', name: 'Confirm Sponsorships', status: 'In Progress' },
      { id: '12183326799', name: 'Finalize Day-of Agenda', status: 'In Progress' },
      { id: '12202262990', name: 'Send Personal Invites', status: 'In Progress' },
      { id: '12067931260', name: 'Establish Event Planning Committee', status: 'In Progress' },
      { id: '12067870694', name: 'Develop Event Marketing Plan', status: 'In Progress' },
      {
        id: '12602019125',
        name: 'Prep Resilience Hub info and ways for attendees to support/sponsor',
        status: null,
      },
      { id: '12602046324', name: 'Prep promo of Simulator model', status: 'In Progress' },
    ],
  },
  {
    title: 'To Do',
    items: [
      { id: '12067866068', name: 'Confirm speaker(s)', status: 'In Progress' },
      { id: '12067960512', name: 'Open tickets/registration', status: 'In Progress' },
      { id: '12068343974', name: 'Design Simulator', status: 'In Progress' },
      { id: '12068340560', name: 'Confirm event volunteers', status: null },
      { id: '12068366339', name: 'Identify breakfast & lunch vendors', status: null },
      { id: '12068334030', name: 'Brainstorm Hub after-party', status: 'Stuck' },
      { id: '12068374286', name: 'Figure out story collection / PNI', status: null },
    ],
  },
  {
    title: 'Completed',
    items: [
      { id: '12067571516', name: 'Brainstorming', status: 'Done' },
      { id: '12067892526', name: 'Develop Event Budget', status: 'Done' },
      { id: '12067890654', name: 'Book Venue', status: 'Done' },
      { id: '12067489054', name: 'Year-end networking meetup', status: 'Done', dueDate: '2026-05-21' },
      { id: '12067910421', name: 'Confirm event date — 10/1', status: 'Done', dueDate: '2026-06-12' },
    ],
  },
];
