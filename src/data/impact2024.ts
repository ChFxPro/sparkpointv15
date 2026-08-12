/**
 * Canonical 2024 impact totals.
 *
 * Provenance: these figures previously existed in exactly one place —
 * the `/make-server-535d8907/impact/init` seed payload inside
 * `src/supabase/functions/server/index.tsx`, a copy of the edge function that
 * is not the deploy path (the Supabase CLI deploys from `supabase/functions/`)
 * and that nothing in the app imports. They are lifted here so the 2024 numbers
 * survive independently of that file's fate, and so they sit beside
 * `impact2025.ts` where the 2025 totals already live.
 *
 * Values are preserved exactly as authored. See the note on `averageAttendance`
 * below — it is recorded, not derived, and does not round-trip cleanly.
 */

export const IMPACT_2024 = {
  year: 2024,
  communityEvents: 37,
  workshops: 29,
  youthEvents: 18,
  presentations: 13,
  totalEvents: 97,
  attendance: 7000,
  uniquePartners: 40,
  individualsTrained: 500,
  /**
   * Recorded as 72.1 in the original payload. Note that
   * `attendance / totalEvents` is 72.16…, which rounds to 72.2 — so this figure
   * was either truncated or computed against a different denominator. Kept as
   * authored rather than silently recomputed; treat as approximate.
   */
  averageAttendance: 72.1,
  readyGroups: 8,
  notes:
    'Foundational year — post-Helene recovery efforts; outreach built through schools, food access, and trauma-informed training.',
} as const;

/**
 * The four event categories sum to `totalEvents` (37 + 29 + 18 + 13 = 97).
 * Exported so the invariant is checkable rather than assumed.
 */
export const IMPACT_2024_EVENT_BREAKDOWN_TOTAL =
  IMPACT_2024.communityEvents +
  IMPACT_2024.workshops +
  IMPACT_2024.youthEvents +
  IMPACT_2024.presentations;
