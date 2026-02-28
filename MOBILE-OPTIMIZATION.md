# Mobile Optimization Log (Phase One Pre-Flight)

Date: 2026-02-28  
Branch: codex/mobile_opt  
Repo: /Users/jeffbannister/Code/sparkpoint/sparkpointv15

## Testing Setup
- Tooling: Puppeteer scripted audit (headless), local Vite dev server (`PUBLIC_BASE='/' npm run dev -- --host 127.0.0.1 --port 4174`)
- Output artifacts: `/Users/jeffbannister/Code/sparkpoint/sparkpointv15/docs/mobile-audit/2026-02-28/`
- Routes tested:
  - `/`
  - `/mission`
  - `/stories`
  - `/impact`
  - `/get-involved`
  - `/volunteer` (redirects to `/intake?intent=volunteer`)
  - `/about`
  - `/contact` (redirects to `/intake?intent=contact`)
- Viewports tested (portrait + landscape for each):
  - `430x932` (iPhone 16 Pro Max proxy)
  - `390x844` (iPhone 13/14 proxy)
  - `360x800` (small Android)
  - `768x1024` (tablet portrait proxy)
- Capture types:
  - Per route+viewport+orientation: top-fold and full-page screenshots
  - Mobile menu state screenshots (home route)
  - Focused team-hero screenshots on About page
  - Console warnings/errors, request failures, layout-overflow checks, tap-target heuristics

## Issue Checklist (Status = OPEN)

| ID | Priority | Issue | Route/Section | Status |
|---|---|---|---|---|
| P0-01 | P0 | Mobile menu requires vertical scrolling; key nav items are hidden below fold (especially landscape, small devices). | Header drawer | FIXED |
| P0-02 | P0 | Bottom menu CTA label is visually unreadable (Newsletter text appears white on white button). | Header drawer footer CTA | FIXED |
| P1-01 | P1 | About page primary hero group photo is heavily cropped on mobile portrait. | `/about` top hero | FIXED |
| P1-02 | P1 | About team hero image crops out/partially cuts participants on mobile. | `/about` team hero | FIXED |
| P1-03 | P1 | Mobile pages feel excessively long, especially Home and About (high scroll-length ratio). | `/`, `/about` | FIXED |
| P1-04 | P1 | Impact quick stats can display as `0` on first paint in landscape until scrolled enough to trigger counter observer. | `/impact` hero quick stats | FIXED |
| P2-01 | P2 | Story carousel dot controls are below recommended touch target size (<44x44). | Home story carousel | OPEN |
| P2-02 | P2 | React warning in Mission page (`unique "key" prop`) during mobile render pass. | `/mission` Listen/Learn/Lead diagram | OPEN |
| P2-03 | P2 | One 404 resource warning observed (likely favicon/static asset), low user impact. | Home route console | OPEN |

## Notes / Hypotheses (Suspected Causes)

### P0-01 Mobile menu discoverability
- Suspected files/components:
  - `src/components/Header.tsx`
- Hypothesis:
  - Mobile nav item spacing is too tall (`mb-6`, `py-4`, `fontSize: 20px`) for 9 links.
  - Footer panel (`Trust & Accountability`, `Donate`, `Newsletter`) consumes a large fixed area (`p-6`, `space-y-4`).
  - Combined layout forces scroll even in portrait; in landscape many key links are initially off-screen.

### P0-02 Unreadable bottom button label
- Suspected files/components:
  - `src/components/Header.tsx`
  - `src/components/ui/button.tsx` (outline variant defaults)
- Hypothesis:
  - Footer Newsletter button uses `variant="outline"` + `text-white`, while outline variant applies `bg-background` (white), creating white text on white background.

### P1-01 About hero crop
- Suspected files/components:
  - `src/pages/AboutPage.tsx`
- Hypothesis:
  - Hero uses `h-screen min-h-[650px]` with `object-cover object-top`; portrait aspect ratio forces aggressive side/bottom cropping.

### P1-02 Team hero crop
- Suspected files/components:
  - `src/pages/AboutPage.tsx`
- Hypothesis:
  - Team hero uses `h-[60vh]` + `object-cover object-[50%_25%]`; mobile portrait/landscape framing crops participants at edges and lower body area.

### P1-03 Excessive mobile page length
- Suspected files/components:
  - `src/imports/InteractiveSparkPointInfographic.tsx`
  - `src/components/ImpactSection.tsx`
  - `src/components/CTAFinal.tsx`
  - `src/pages/AboutPage.tsx`
- Evidence snapshot (390x844 portrait):
  - `/about`: ~27.86 viewport-heights
  - `/`: ~24.69 viewport-heights
  - Next tier: `/mission` ~12.02, `/impact` ~9.95
- Hypothesis:
  - Large fixed/min heights and large vertical rhythm on mobile (`min-h-[1040px]`, large `pt/pb`, repeated `mb-20/24/32`, `space-y-32` patterns) stack into very long scroll journeys.

### P1-04 Impact quick stats initial zeros
- Suspected files/components:
  - `src/pages/ImpactPage.tsx` (`Counter` component)
- Hypothesis:
  - Counter starts at `0` and only animates when IntersectionObserver threshold (`0.5`) is met.
  - On short landscape heights, stats can appear as zero until user scrolls deeper into that section.

### P2-01 Story dot tap targets
- Suspected files/components:
  - `src/components/StoryCarousel.tsx`
- Hypothesis:
  - Dot controls use `w-3 h-3` without enlarged hit area; likely difficult on touch devices.

### P2-02 Mission key warning
- Suspected files/components:
  - `src/pages/MissionPage.tsx` (`ListenLearnLeadDiagram`)
- Hypothesis:
  - A rendered list in diagram markup is missing stable `key` props.

## Planned Fix Approach (High-Level, Phase Two)
- Keep scope minimal and mobile-specific; avoid architecture or route changes.
- Prioritize P0 items in `Header.tsx` first:
  - Compress mobile menu vertical rhythm while preserving 44px tap targets.
  - Ensure all key links are visible with minimal/no scroll on common portrait devices.
  - Fix Newsletter CTA contrast explicitly (do not rely on inherited variant defaults).
- Address About image framing with minimal class-level updates:
  - Adjust mobile hero framing (`height`/`object-position`) and/or mobile-specific art direction.
  - Preserve overall tone and composition intent; avoid copy rewrites.
- Reduce excessive mobile page length by tuning vertical spacing only at mobile breakpoints:
  - Target largest offenders first (`InteractiveSparkPointInfographic`, About long sections, CTA/Impact section rhythm).
  - Avoid compressing content into cramped blocks; maintain readability and calm pacing.
- Improve Impact stat perception:
  - Lower observer threshold or start counters when section enters viewport more reliably on short heights.
- Follow-up hardening:
  - Expand dot tap area for carousel controls.
  - Clear Mission key warning if it is in the touched area or queued as small follow-up.

## Do-Not-Change Warnings
- Do not alter route behavior or nav IA without explicit need.
- Preserve SparkPoint language framework and meaning (Purpose/Mission/Vision/Listen•Learn•Lead).
- Avoid broad restyling/refactors; use local mobile overrides only.
- Keep mission tone calm, accessible, spacious, but reduce unnecessary mobile length/padding.

## Phase 2 — P0 Fixes
Date: 2026-02-28 (local run)  
Scope: P0 only (`P0-01`, `P0-02`)  
Validation artifacts:
- `/Users/jeffbannister/Code/sparkpoint/sparkpointv15/docs/mobile-audit/2026-02-28/p0-phase2/p0-menu-validation.json`
- `/Users/jeffbannister/Code/sparkpoint/sparkpointv15/docs/mobile-audit/2026-02-28/p0-phase2/*__menu.png`

### P0-02 — Drawer Newsletter CTA readability/contrast
- What changed:
  - File: `src/components/Header.tsx`
  - Replaced the mobile drawer Newsletter CTA styling from conflicting `outline` defaults to explicit mobile-safe visual styles (custom border/background/text/focus classes).
  - CTA keeps button semantics and remains in the same menu location/order.
  - Updated Newsletter CTA click target to `navigate('/newsletter')`, which uses the existing app redirect route to the Squarespace newsletter endpoint.
- Why:
  - Original mobile CTA was visually unreadable (white text on near-white button surface).
  - Local explicit styles avoid variant conflicts from shared button defaults.
- How to test:
  1. Start dev server: `PUBLIC_BASE='/' npm run dev -- --host 127.0.0.1 --port 4174`.
  2. Open `/` and tap mobile menu.
  3. Confirm Newsletter text is readable in portrait + landscape.
  4. Trigger keyboard focus (`Tab`) and verify visible focus indication on CTA.
- Tradeoffs/notes:
  - CTA now has stronger visual separation from Donate while preserving hierarchy and readability.
  - No desktop drawer styles were changed.

### P0-01 — Mobile drawer discoverability / fold visibility
- What changed:
  - File: `src/components/Header.tsx`
  - Mobile-only compaction in drawer:
    - Reduced top close-row padding.
    - Reduced nav row margin rhythm (`mb` compaction) and tightened typography with mobile clamp.
    - Enforced per-link minimum hit area with `min-h-[44px]`.
    - Reduced footer block padding and tightened trust text sizing on small screens.
    - Enforced CTA minimum hit areas (`Donate`, `Newsletter` at `min-h-[44px]`).
  - Added explicit `focus-visible` classes on mobile nav links, trust link, close button, and CTAs.
- Why:
  - Previous mobile spacing forced users to scroll the menu to discover key links on common portrait sizes.
  - Footer consumed too much vertical space relative to nav links.
- How to test:
  1. Open mobile menu on:
     - `360x800` portrait + landscape
     - `390x844` portrait + landscape
     - `430x932` portrait
  2. Confirm primary nav links are visible without deep scroll on portrait.
  3. Confirm touch target heights are at least 44px.
  4. Confirm focus state is visible when tabbing through nav links.
- Tradeoffs/notes:
  - This implementation was superseded by a follow-up compact grid pass in the next phase entry below.
  - Desktop menu layout is unchanged.

## Phase 2B/3A Combined — P0 + P1 Implementation Pass
Date: 2026-02-28 (follow-up implementation + validation)  
Scope: `P0-01`, `P0-02`, `P1-01`, `P1-02`, `P1-03`, `P1-04`  
Validation artifacts:
- `/Users/jeffbannister/Code/sparkpoint/sparkpointv15/docs/mobile-audit/2026-02-28-postfix/postfix-validation.json`
- `/Users/jeffbannister/Code/sparkpoint/sparkpointv15/docs/mobile-audit/2026-02-28-postfix/*__menu.png`
- `/Users/jeffbannister/Code/sparkpoint/sparkpointv15/docs/mobile-audit/2026-02-28-postfix/*__about_top.png`
- `/Users/jeffbannister/Code/sparkpoint/sparkpointv15/docs/mobile-audit/2026-02-28-postfix/*__about_teamhero.png`
- `/Users/jeffbannister/Code/sparkpoint/sparkpointv15/docs/mobile-audit/2026-02-28-postfix/*__impact_top.png`

### P0-01 — Mobile menu discoverability (FIXED)
- What changed:
  - File: `src/components/Header.tsx`
  - Mobile drawer nav now uses an explicit responsive grid template (`auto-fit` minmax) so portrait and landscape viewports show all primary nav links without fold clipping.
  - Mobile drawer spacing was compacted (header close row, nav spacing, footer spacing), while preserving `min-h-[44px]` link/button targets.
  - Focus-visible support was retained and verified via keyboard tab checks in the drawer.
- Why:
  - Key links (especially Contact) were hidden below fold on small heights and landscape.
- How to test:
  1. Start dev server (`PUBLIC_BASE='/' npm run dev -- --host 127.0.0.1 --port 4174`).
  2. Open menu on `360x800`, `390x844`, and `430x932` portrait, then rotate to landscape.
  3. Confirm all primary links are visible without scrolling and each row remains >=44px tall.
- Files changed:
  - `src/components/Header.tsx`

### P0-02 — Newsletter CTA readability (FIXED)
- What changed:
  - File: `src/components/Header.tsx`
  - Drawer Newsletter CTA now uses explicit foreground/background/border colors via local style override (`#4F1845` text on `#FFF4FB`) plus focus ring classes.
  - CTA target remains `navigate('/newsletter')` so route semantics/redirect behavior are unchanged.
- Why:
  - Prior outline/utility combination could collapse into low-contrast or unreadable CTA text.
- How to test:
  1. Open mobile menu on `360x800` and `390x844` portrait.
  2. Confirm Newsletter label remains legible with strong contrast.
  3. Use keyboard `Tab` to verify visible focus behavior.
- Files changed:
  - `src/components/Header.tsx`

### P1-01 + P1-02 — About hero and team framing (FIXED)
- What changed:
  - File: `src/pages/AboutPage.tsx`
  - Top hero moved to a shorter mobile height (`h-[560px]`) while preserving desktop behavior (`md:h-screen md:min-h-[650px]`) and existing messaging/overlay.
  - Team hero now uses mobile-friendly fixed heights (`h-[400px] sm:h-[450px] md:h-[60vh]`) and explicit `objectPosition: '50% 24%'` to reduce participant clipping in portrait.
- Why:
  - Mobile portrait framing was over-cropped, reducing visibility of key subjects.
- How to test:
  1. Open `/about` in `360x800`, `390x844`, `430x932` portrait.
  2. Verify top hero group remains materially more visible than baseline.
  3. Scroll to team hero and verify no participant is fully cropped out.
  4. Check one landscape viewport (`844x390`) for acceptable framing.
- Files changed:
  - `src/pages/AboutPage.tsx`

### P1-03 — Mobile vertical rhythm reduction (FIXED)
- What changed:
  - Files:
    - `src/imports/InteractiveSparkPointInfographic.tsx`
    - `src/components/ImpactSection.tsx`
    - `src/components/CTAFinal.tsx`
    - `src/pages/AboutPage.tsx`
  - Reduced high mobile vertical padding/gaps/section block heights while preserving `md+` spacing patterns.
  - Tightened select mobile card paddings and headline spacing to reduce scroll fatigue without dense compression.
- Why:
  - Home/About mobile journeys were overly long and felt oversized compared with desktop rhythm.
- Verification snapshot (postfix run):
  - `/` at `390x844`: ~`21.71` viewport-heights (down from baseline ~`24.69`)
  - `/about` at `390x844`: ~`25.23` viewport-heights (down from baseline ~`27.86`)
- How to test:
  1. Compare `/` and `/about` portrait captures in `docs/mobile-audit/2026-02-28` vs `docs/mobile-audit/2026-02-28-postfix`.
  2. Confirm sections still read clearly and are not visually cramped.

### P1-04 — Impact quick stats trigger reliability (FIXED)
- What changed:
  - File: `src/pages/ImpactPage.tsx`
  - Counter observer trigger adjusted from `threshold: 0.5` to `threshold: 0.15` with `rootMargin: '0px 0px 20% 0px'`.
- Why:
  - Short-height landscape viewports could show initial zeros until user scrolled.
- How to test:
  1. Open `/impact` in `800x360`, `844x390`, and `932x430`.
  2. Confirm quick stats populate without requiring scroll.
- Files changed:
  - `src/pages/ImpactPage.tsx`

### Risks / Follow-ups
- P2 items remain open and were intentionally not implemented in this pass.
- A utility-generation quirk was observed during implementation (some ad-hoc classes are not available in generated CSS); fixes were normalized to supported utility tokens or explicit local styles to avoid runtime drift.

## Phase Two Execution Log (Template)

| Issue ID | Fix Applied | Files Changed | Verification | Follow-ups |
|---|---|---|---|---|
| P0-01 |  |  |  |  |
| P0-02 |  |  |  |  |
| P1-01 |  |  |  |  |
| P1-02 |  |  |  |  |
| P1-03 |  |  |  |  |
| P1-04 |  |  |  |  |
| P2-01 |  |  |  |  |
| P2-02 |  |  |  |  |
| P2-03 |  |  |  |  |
