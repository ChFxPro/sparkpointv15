/* Partner share rooms — one room per partner organization.
 *
 * WHY ONE ROOM PER PARTNER rather than one page several partners read: the
 * problem these solve is addressing, not secrecy. A partner landing on a shared
 * page has to work out which parts apply to them; a room addressed to their org
 * removes the question. The same underlying board appearing in two rooms is
 * correct, not duplication.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CONTENT RULE — read before adding anything to a room.
 *
 * These rooms are UNLISTED, NOT PRIVATE. The URL is the only thing standing
 * between the content and anyone who receives a forwarded email. Treat every
 * item here as though it could become public, because it can.
 *
 * MAY go in a room:
 *   - Published or publishable material
 *   - Planning status, schedules, agendas, workstream ownership
 *   - Aggregate numbers already cleared for partners
 *
 * MAY NOT go in a room:
 *   - Personal data of any kind, or anything about a named private individual
 *   - Financials, budgets, reserves
 *   - Unpublished grant, donor, or funder information
 *   - Anything you would not read aloud at a public meeting
 *
 * If something fails that test, it does not belong in an open share. It belongs
 * behind Backstage sign-in — the `partner` role exists for exactly that case.
 * ───────────────────────────────────────────────────────────────────────────── */

const BASE = import.meta.env.BASE_URL;

export interface PartnerShareItem {
  title: string;
  description: string;
  to: string;
}

export interface PartnerShare {
  slug: string;
  org: string;
  shortName: string;
  logo?: string;
  intro: string;
  contactName: string;
  contactEmail: string;
  /** When this room should be re-examined — open links otherwise live forever. */
  reviewOn: string;
  items: PartnerShareItem[];
}

/* Currently empty by design.
 *
 * FHLI and NCRHA were the obvious first candidates, but they are CO-ORGANIZERS
 * of the Oct 1 convening rather than separate audiences — they co-lead the same
 * event and need to see each other's work. Splitting them into two rooms would
 * have created exactly the confusion this pattern exists to remove, so they use
 * the shared workspace at /internal/convening instead (see data/convening.ts).
 *
 * This pattern is the right one for a partner who genuinely IS a separate
 * audience: a funder receiving a report, or a partner on a different program
 * with no overlap. Add an entry here and the room exists at
 * /internal/share/<slug> — no other wiring needed. */
export const PARTNER_SHARES: PartnerShare[] = [];

export function findPartnerShare(slug: string | undefined): PartnerShare | undefined {
  if (!slug) return undefined;
  return PARTNER_SHARES.find((share) => share.slug === slug.toLowerCase());
}
