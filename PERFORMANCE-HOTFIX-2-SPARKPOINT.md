# SparkPoint Homepage Performance Hotfix 2

Date: 2026-03-09
Branch: codex/perf-homepage-hotfix-2

## Executive Summary
This pass targeted homepage FCP/LCP bottlenecks from the latest Lighthouse run without changing layout or voice.

Primary actions completed:
- Optimized the homepage logo delivery path and LCP hints.
- Removed active homepage/story references to the 1.76 MB `0835779...png` and replaced with optimized WebP assets.
- Reduced font render-blocking by removing CSS `@import` font loading and shifting Manrope loading to preconnected/preloaded links in `index.html`.
- Removed a known forced reflow source in hero CTA hover handlers (`offsetWidth` reads/writes).
- Added explicit image dimensions on key logo surfaces and story carousel media.

## Root Cause: Remaining Giant PNG
Asset flagged in Lighthouse context:
- `src/assets/0835779aef52124bf5c00840473e8285f8e0f937.png` (1.76 MB)

Where it was still active:
- `src/pages/HomePage.tsx` (homepage story carousel data)
- `src/data/stories.ts` (stories/category data)

Fix:
- Added optimized WebP derivative:
  - `src/assets/compd/0835779aef52124bf5c00840473e8285f8e0f937.webp` (~133 KB)
- Rewired active imports in both files to use optimized WebP.

Related story assets were also optimized and rewired:
- `e4e8c9f...png` -> WebP (~307 KB)
- `20c2a90...png` -> WebP (~142 KB)

## Logo LCP Fixes
LCP element was the hero SparkPoint logo.

Fixes applied:
- Introduced optimized logo WebP:
  - `src/assets/compd/35bb889d1f4d0b05ae6753439b58199640858447.webp` (~17 KB)
- Updated homepage hero logo source to WebP.
- Added explicit `width`/`height` on hero logo and key logo usages.
- Added `fetchpriority="high"` and `loading="eager"` to hero logo.

## Font Loading Improvements
Previous behavior:
- External font CSS loaded via blocking `@import` in `src/index.css`.
- External Helvetica Neue import was also blocking and unnecessary.

Changes:
- Removed external font `@import` lines from `src/index.css`.
- Added preconnect + preload + non-blocking Manrope stylesheet loading in `index.html`.
- Switched global body stack to system-native fallbacks (kept Manrope available where explicitly used).
- Mirrored fallback update in `src/styles/globals.css` for consistency.

## Forced Reflow Review
Found in homepage hero CTA hover handlers:
- `offsetWidth` reads + inline width writes in `src/components/Hero.tsx`.

Fix:
- Removed width mutation logic from hover handlers while preserving hover color behavior.

## Files Changed
- `index.html`
- `src/index.css`
- `src/styles/globals.css`
- `src/components/Hero.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/StoryCarousel.tsx`
- `src/pages/HomePage.tsx`
- `src/data/stories.ts`
- `src/imports/InteractiveSparkPointInfographic.tsx`
- `src/assets/compd/0835779aef52124bf5c00840473e8285f8e0f937.webp`
- `src/assets/compd/e4e8c9f59f3a2b2ee1533f1f427ca4a4cb3693a5.webp`
- `src/assets/compd/20c2a905251c86d5a4f9333b83199204b6928c7d.webp`
- `src/assets/compd/35bb889d1f4d0b05ae6753439b58199640858447.webp`

## Build Verification
Command:
- `npm run build`

Result:
- Build completed successfully.

Notable output evidence:
- New WebP outputs are emitted for the prior heavy story images and logo.
- The original `0835779...png` is no longer emitted as an active built asset from current route references.

## Expected Impact
- Faster LCP on homepage due to:
  - smaller logo payload,
  - explicit dimensions + fetch priority,
  - removal of logo-related reflow triggers.
- Better FCP/first render stability from non-blocking font loading path and removal of external Helvetica import.
- Lower critical network pressure by replacing the prior 1.76 MB homepage story PNG reference with ~133 KB WebP.

## Remaining Risks / Follow-ups (Out of Scope for this pass)
- Several very large non-homepage images remain elsewhere in the bundle and can still affect route-level performance.
- Additional route-specific image right-sizing and modern-format conversions would yield further gains.
