// Branded ticket checkout host — Squarespace commerce site fronted by our domain.
export const TICKETS_BASE = 'https://secure.yoursparkpoint.org';

// Where /tickets sends visitors (all available events/tickets).
export const TICKETS_ALL_URL = `${TICKETS_BASE}/store`;

// Event-specific deep links. Key = vanity slug used at /tickets/<slug> (lowercase).
// Value = full destination URL on the branded checkout host.
// Add one line per event; unknown slugs fall back to TICKETS_ALL_URL.
// The 2026 WNC Regional Rural Health Convening (`wncrrhc`) has ended; that slug is now
// routed to the recap page in App.tsx rather than to checkout.
export const TICKET_EVENTS: Record<string, string> = {};
