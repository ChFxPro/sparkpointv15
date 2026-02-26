# SparkPoint Agent Guide

## Project Status Overview (2026 Programs Update)
- The Programs page is now content-complete for 2026 and uses a structured program data model.
- Pathways are organized as `Listen`, `Learn`, and `Lead`.
- Canonical programs data source: `src/pages/programs/programsData.ts`.
- Program details render inside the split-view `PathwayModal` list -> detail architecture.
- The page includes an engine explainer section: `How Listen • Learn • Lead Works`.
- Program cards are fully clickable (keyboard accessible) in grid and modal list contexts.
- Placeholder boilerplate copy has been removed from program detail views.

## Programs Architecture

### Data Location
- `src/pages/programs/programsData.ts`
- Exports program types, pathway metadata, full program catalog, filters, and label helpers.

### Pathway Definitions
- `Listen` = Community insight infrastructure.
- `Learn` = Relational capacity building.
- `Lead` = Cross-sector coordination.

### Program Schema
Each program must include:
- `id`
- `slug`
- `title`
- `pathway: "listen" | "learn" | "lead"`
- `tagline`
- `overview`
- `whyItExists?`
- `whoItsFor: string[]`
- `whatYoullExperience: string[]`
- `outcomes: string[]`
- `idealPartners: string[]`
- `format: { type: "workshop" | "series" | "cohort" | "event" | "ongoing" | "project" | "collaborative"; cadence?: string }`
- `offeringType: "community" | "partner" | "fee-based"`
- `tags: string[]`
- `contactCTA: { label: string; href: string }`

### Component Map
- `ProgramsPage` = route-level state, deep-link sync, section composition.
- `ProgramsHero` = hero framing + audience starter control.
- `EngineSection` = feedback-loop explainer (`Listen -> Learn -> Lead -> Measure -> Repeat`).
- `EcosystemSection` = pathway previews and featured cards.
- `AllProgramsSection` = searchable/filterable grid.
- `PathwayModal` = list/detail modal and full structured detail rendering.

### Safe Content Editing Workflow
1. Update structured entries in `programsData.ts` only.
2. Preserve stable `id`/`slug` values when adjusting copy.
3. Keep pathway assignment aligned with the three pathway definitions.
4. Keep CTA routes valid (`/intake` or `/get-involved`).
5. Run `npm run build` before merging.

### Add a New Program
1. Add a new `Program` object to the correct pathway list in `programsData.ts`.
2. Provide every required schema field with specific copy.
3. Ensure `id` is unique and URL-safe; `slug` should remain stable.
4. Add meaningful `tags` for grid filters and recommendations.
5. Verify card rendering, modal detail rendering, and deep-link open behavior.

## Content Governance Rules
- Do not ship placeholder or repeated boilerplate copy.
- Every program entry must include the full structured schema.
- Avoid generic “facilitated experience” language; content must be specific.
- Keep pathway definitions consistent:
  - Listen = community insight infrastructure
  - Learn = resilience + relational capacity
  - Lead = cross-sector coordination

## Development Standards
- Always branch before feature work.
- Never modify `main` directly.
- All Programs updates must pass `npm run build`.
- `programsData.ts` must remain type-safe.
- Update `AGENTS.md` whenever architecture/schema/structure changes.

## Future Codex Instructions
When running Codex in this repo:
- Read `AGENTS.md` first.
- Confirm architecture alignment before modifying.
- Update `AGENTS.md` when schema or structure changes.

## Related Legacy Documentation
- Intake + Edge Function operations guide remains in `agents.md`.
