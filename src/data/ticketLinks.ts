// Branded ticket checkout host — Squarespace commerce site fronted by our domain.
export const TICKETS_BASE = 'https://secure.yoursparkpoint.org';

// Where /tickets sends visitors (all available events/tickets).
export const TICKETS_ALL_URL = `${TICKETS_BASE}/store`;

export const RURAL_HEALTH_CONVENING_TICKET_URL =
  `${TICKETS_BASE}/store/p/2026-rural-health-convening`;

// Event-specific deep links. Key = vanity slug used at /tickets/<slug> (lowercase).
// Value = full destination URL on the branded checkout host.
// Add one line per event; unknown slugs fall back to TICKETS_ALL_URL.
export const TICKET_EVENTS: Record<string, string> = {
  // WNC Regional Rural Health Convening (2026)
  wncrrhc: RURAL_HEALTH_CONVENING_TICKET_URL,
};
