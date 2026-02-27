# SparkPoint Agent Guide

## Read First
- Always read this file before making code changes in this repository.
- Confirm architecture alignment before editing.
- Update this file when route structure, schema, or feature composition changes.

## Current Route Map (Web App)
- `/` home page
- `/about`
- `/mission`
- `/impact`
- `/get-involved`
- `/programs`
- `/intake` (query intents used: `contact`, `volunteer`, `partner`)
- `/partner` redirects to `/intake?intent=partner`
- `/volunteer` redirects to `/intake?intent=volunteer`
- `/contact` redirects to `/intake?intent=contact`

## Programs Feature Location
- Main feature directory: `src/pages/programs/*`
- Key files:
  - `ProgramsPage.tsx`
  - `ProgramsHero.tsx`
  - `EcosystemSection.tsx`
  - `AllProgramsSection.tsx`
  - `PathwayModal.tsx`
  - `programsData.ts`
  - `programs.css`

## Programs Architecture Status
- `/programs` is integrated into the main site router and builds clean.
- Programs use a structured data model in `programsData.ts` with pathway-based grouping.
- Pathways are fixed as:
  - Listen = Community insight infrastructure
  - Learn = Relational capacity building
  - Lead = Cross-sector coordination
- Program cards are fully clickable and open the same detail flow in:
  - pathway preview cards
  - modal list cards
  - All Programs grid cards
- The Listen/Learn/Lead explainer section is disabled in `ProgramsPage` via feature flag (`SHOW_LLL_EXPLAINER = false`) to avoid duplication with Mission content.

## Programs Data Model (Current)
Each program entry must remain type-safe and include:
- `id`
- `slug`
- `title`
- `pathway`
- `tagline`
- `overview`
- `whyItExists?`
- `whoItsFor[]`
- `whatYoullExperience[]`
- `outcomes[]`
- `idealPartners[]`
- `format: { type, cadence? }`
- `offeringType`
- `tags[]`
- `contactCTA: { label, href }`

## Development Standards
- Always branch before feature work.
- Never modify `main` directly.
- Keep changes scoped and reversible.
- Preserve TypeScript safety for Programs data and components.
- Remove placeholder/repetitive copy when touched.

## Runbook
- Install: `npm install`
- Dev server: `npm run dev`
- Production build check: `npm run build`

## Known Issues / Ongoing Work
- Some program entries still need deeper editorial pass and content enrichment.
- Placeholder-level copy may still exist in select areas during ongoing content fill cycles.
- Continue content QA against source planning docs before final publication.
