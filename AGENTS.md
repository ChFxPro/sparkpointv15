# SparkPoint Agent Guide
Last updated: 2026-08-10

## Read First
- Read this file before modifying code in this repo.
- Read `WORKLIST.md` immediately after this file. It is the canonical, living source of truth for priorities, active work, blockers, and completion evidence.
- Confirm architecture alignment before implementing UI or data-model changes.
- Update `WORKLIST.md` at the start and end of substantive work; use its priority and bundle structure to keep changes focused.
- Update this document when routes, schema, or feature behavior changes, and add or revise the corresponding worklist item.

## Current Status
- Main website is integrated and buildable.
- Programs feature is integrated at `/programs`.
- Programs cards open details from all contexts (pathway preview, all-programs grid, modal list).
- Programs content is actively being refined; ongoing editorial pass is still expected for some entries.
- Launch recon fixes are in progress on a dedicated launch branch.
- 2025 impact totals are centralized in `src/data/impact2025.ts` and consumed in impact surfaces.
- Mission and partner network groupings are aligned to the latest partner update source.
- Mailing address boilerplate now uses `SparkPoint P.O. Box 2452, Brevard, NC 28712` across UI + structured data.
- SEO metadata is standardized through `src/components/SEOHead.tsx` across route pages.
- Structured data now includes Organization/NGO, WebSite, WebPage, and BreadcrumbList globally, plus page-level Article/Event schema where applicable.
- Canonical site origin defaults to `https://www.yoursparkpoint.org` (see `src/lib/siteOrigin.ts` and `vite.config.ts`).
- `public/robots.txt` and `public/sitemap.xml` use `__SITE_ORIGIN__` placeholders replaced during postbuild.
- Unified menu drawer includes a `Partners` link under the `About SparkPoint` group, pointing to `/partners`.
- Permanent press portal is available at `/press`, with reusable release pages under `/press/:slug`.
- Press releases are single-sourced in `src/data/pressReleases.json`, feed `/news-media` via `showOnMediaPage`, and generate downloadable media kits during builds.
- Events hub is available at `/events`, with reusable upcoming/past event listings driven by `src/data/events.ts`.
- Rural Health Convening landing page is available at `/rural-health-convening`, with a priority registration list for the limited 200-seat event, partner/sponsor attribution, and a public introduction to the Rural Health Field Simulator. Sponsor logos link to each org's website; sponsor billing follows five active tiers — Summit ($3,500: UNC Health Pardee, Transylvania Regional Hospital, equal size/prominence), Ridgeline ($2,500: Pisgah Health Foundation, visibly smaller/secondary), Highlands ($1,500: Transylvania County Tourism Development Authority, tertiary), Foothills (Dogwood Health Trust, Vaya Health, First Citizens Bank), and Friends (AdventHealth, UnitedHealthcare, lowest billing) — reflected in the hero credit line and partnership-section logo hierarchy. Each tier is one array in `RuralHealthConveningPage.tsx` (`summitSponsors` … `friendsSponsors`) rendered in both places; per-logo height overrides in `ruralHealthConvening.css` (keyed on `rh-logo-stage-*`) exist because stacked/multi-line lockups need more box height than single-line wordmarks to read at the same optical weight, so tier order alone does not determine rendered size.
- Thrive @ Five: Common Ground Release Party is available at `/events/thrive-at-five`, with the July 31 event details, August coffee fundraiser, August 1 purchase CTA, performance video, and Resilience Hub story; it is the current featured event on `/events`.
- Internal social media reports portal is available at `/internal/reports`, gated by real Supabase Auth (not obscurity) — `/internal/login`, `/internal/reports`, and `/internal/reports/:reportType/:period` are excluded from static prerendering by design, so the login gate is enforced client-side rather than by hiding a public route. Reports live in the `report_snapshots` table (RLS restricted to `authenticated`), refreshed monthly via `scripts/internal-reports/ingest.mjs` (CSV parsing and the Supabase upsert are two separate stages so the CSV-pull step alone can be automated later). The report dashboard itself is a scroll-driven visual narrative (`src/pages/InternalReportDashboardPage.tsx` + `internalReportDashboard.css`); the login/reports-list pages share a calmer system in `internalReports.css`.

## Routes
- `/` home
- `/about`
- `/mission`
- `/impact`
- `/events` (SparkPoint events hub, titled “Where We Gather”)
- `/events/thrive-at-five` (2026 Common Ground Resilience Roast release party, August 1 purchase CTA, and Resilience Hub fundraiser)
- `/get-involved`
- `/programs`
- `/partners` (Partner Ecosystem — partner & sponsor directory, canonical; shares `src/data/partners.ts` with the homepage `#impact` network diagram)
- `/sponsors` -> redirect to `/partners` (old URL kept working via a static prerender stub; don't restore or validate this as a live route)
- `/resilience-hub`
- `/directory` (Resource Directory — browsable/filterable local resource & partner-org listings; content in `src/data/resources.ts`, prerendered per entry)
- `/directory/:id` (individual resource/org detail page)
- `/news-media`
- `/press`
- `/press/:slug`
- `/resources/know-your-numbers`
- `/rural-health-convening` (2026 WNC Regional Rural Health Convening event portal and Rural Health Field Simulator introduction)
- `/internal/status` (unlisted, noindexed status dashboard — days to the convening, live seat count, event-planning board snapshot; not linked from any nav/footer, excluded from the sitemap/prerender by construction — don't add inbound links to it)
- `/internal/login` (sign-in for the internal reports portal; real Supabase Auth — access is granted per-person via the Supabase Dashboard, no self-serve signup)
- `/internal/reports` (internal reports portal home — lists available reports for the signed-in user; redirects to `/internal/login` if unauthenticated)
- `/internal/reports/:reportType/:period` (one report's dashboard, e.g. `/internal/reports/social_media/2026-07`; requires an authenticated session, same as above)
- `/rh_tickets` -> direct external redirect to the 2026 Rural Health Convening purchase page
- `/pcr_collab` -> redirect to `/events/thrive-at-five` (branded vanity URL; static prerender stub, same pattern as `/sponsors`)
- `/newsletter` -> external redirect to Squarespace newsletter
- `/donations` -> external redirect to Squarespace donations
- `/intake` (`?intent=contact|volunteer|partner`)
- `/partner` -> redirect to `/intake?intent=partner`
- `/volunteer` -> redirect to `/intake?intent=volunteer`
- `/contact` -> redirect to `/intake?intent=contact`

## Programs Page
### Code Location
- `src/pages/programs/ProgramsPage.tsx`
- `src/pages/programs/ProgramsHero.tsx`
- `src/pages/programs/EcosystemSection.tsx`
- `src/pages/programs/AllProgramsSection.tsx`
- `src/pages/programs/PathwayModal.tsx`
- `src/pages/programs/programsData.ts`
- `src/pages/programs/programs.css`

### Data Source
- Canonical program content/model lives in `src/pages/programs/programsData.ts`.
- Program schema includes `id`, `title`, `pathway`, `shortDescription`, `longDescription`, `tags`, `whatYoullExperience`, `idealPartners`, plus modal-support fields and CTA.

### UX Behavior
- Role switcher options in hero: `Community`, `Volunteer`, `Partner`.
- Hero secondary CTA behavior:
  - Community -> contact route
  - Volunteer -> `/get-involved`
  - Partner -> `/intake?intent=partner`
- Listen/Learn/Lead explainer section is removed from Programs page composition (Mission page covers this).
- Program cards are fully clickable and keyboard accessible (`button` semantics).
- Modal detail renders real content sections (who it is for, experience, outcomes, ideal partners).

## Local Development
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`

## Known Warnings
- Vite build warns about large JS chunks (>500kB) after minification.
- Postbuild image optimizer prints Node warning about module type for `scripts/optimize-hero-images.js`.

## Launch Changes (2026-02-27)
- Added centralized 2025 metrics constants in `src/data/impact2025.ts`.
- Updated `/impact` and home impact section metrics to use canonical 2025 totals.
- Removed/qualified absolute `100%` claims in launch-facing content.
- Aligned Helene one-year date references to September 27, 2025.
- Added minimal launch pages for sponsors, resilience hub, and news/media.
- Added Stories top tabs with Programs navigation.

## Impact Metrics Source
- Canonical file for 2025 website totals: `src/data/impact2025.ts`.
- Canonical file for 2024 totals: `src/data/impact2024.ts`.
- If launch metrics change, update constants there first, then verify:
  - `src/pages/ImpactPage.tsx`
  - `src/components/ImpactSection.tsx`
- Do not hardcode new rollup totals directly in page components.

### Supabase edge functions — where they actually live
**`supabase/functions/README.md` is the canonical inventory.** Read it before deploying,
adding, or deleting a function. Kept there rather than duplicated here, because a fact
stated in two places drifts — this section already went stale once.

The short version:

- `supabase/functions/<slug>/` is the **only** path the Supabase CLI reads. Anything under
  `src/` or inside a worktree is not a deploy path.
- This repo deploys two functions: `make-server-393f2b0a` (health + public intake) and
  `rh-ticket-stock` (read-only seat-count proxy for the convening page). The frontend calls
  exactly those two.
- **Ship functions from that directory through a PR — never by passing source inline to an
  MCP `deploy_edge_function` call.** Four live functions were deployed that way and ended up
  with no source in any repo; recovering them is what PR #132 was for. Inline deploys also
  bypass the build check and the secret scan.
- The deployed function named `server` is **owned by a different repo**
  (`DataAdmin/Spwebdatahandlingapp`, same project ref). Do not add a
  `supabase/functions/server/` directory here — deploying it would overwrite that project's
  live function.
- Read secrets from `Deno.env.get(...)`. Note that `gitleaks` will **not** catch a homemade
  shared password like `"orgname2026"` — it matches no provider format and no entropy rule.
  That class of secret has to be caught in review.
- A second copy of the intake handler used to sit at `src/supabase/functions/server/`
  (the original Figma Make scaffold layout). It was never a deploy path, nothing imported
  it, and its `make-server-535d8907` routes were never deployed — but it was being patched
  in parallel, so security fixes had to be written twice. Removed; see git history if the
  old `/impact/*` or `/volunteer` handlers are ever needed.

## Development Standards
- Always branch before feature work.
- Never modify `main` directly.
- Publish website changes through a pull request. Before merging, confirm the production build/deployment checks pass; do not bypass branch protections.
- Treat any GitHub secret-scanning or push-protection finding as a stop-and-remediate event: do not suppress it without confirming the value is not a credential, and rotate exposed credentials before continuing.
- Keep changes scoped and reversible.
- Use `WORKLIST.md` as the master queue: work `P0` before `P1`, bundle related changes, and record verification/PR information when an item is done.
- Maintain type safety for `src/pages/programs/*`.
- Avoid placeholder/repetitive copy in program content.

## Current Work Queue
- See `WORKLIST.md`. Do not maintain a competing TODO list here.
