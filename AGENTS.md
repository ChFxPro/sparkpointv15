# SparkPoint Agent Guide
Last updated: 2026-07-27

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
- Unified menu drawer includes a `Sponsors` link under the `About SparkPoint` group.
- Permanent press portal is available at `/press`, with reusable release pages under `/press/:slug`.
- Press releases are single-sourced in `src/data/pressReleases.json`, feed `/news-media` via `showOnMediaPage`, and generate downloadable media kits during builds.
- Events hub is available at `/events`, with reusable upcoming/past event listings driven by `src/data/events.ts`.
- Rural Health Convening landing page is available at `/rural-health-convening`, with a priority registration list for the limited 200-seat event, partner/sponsor attribution, and a public introduction to the Rural Health Field Simulator.

## Routes
- `/` home
- `/about`
- `/mission`
- `/impact`
- `/events` (SparkPoint events hub, titled “Where We Gather”)
- `/get-involved`
- `/programs`
- `/sponsors`
- `/resilience-hub`
- `/directory` (Resource Directory — browsable/filterable local resource & partner-org listings; content in `src/data/resources.ts`, prerendered per entry)
- `/directory/:id` (individual resource/org detail page)
- `/news-media`
- `/press`
- `/press/:slug`
- `/resources/know-your-numbers`
- `/rural-health-convening` (2026 WNC Regional Rural Health Convening event portal and Rural Health Field Simulator introduction)
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

## 2025 Impact Metrics Source
- Canonical file for 2025 website totals: `src/data/impact2025.ts`.
- If launch metrics change, update constants there first, then verify:
  - `src/pages/ImpactPage.tsx`
  - `src/components/ImpactSection.tsx`
  - `src/supabase/functions/server/index.tsx` (seeded API payload)
- Do not hardcode new 2025 rollup totals directly in page components.

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
