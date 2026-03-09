# IMAGE-REMEDIATION-SPARKPOINT

Date: 2026-03-09
Scope: Focused remediation pass based on `IMAGE-AUDIT-SPARKPOINT.md` (no redesign, scoped technical fixes)

## Root causes fixed

1. **Hero prop mismatch fixed**
- `Hero` no longer accepts an unused `heroImage` prop.
- Home page callsite now matches runtime behavior.
- Added explicit fallback layering so PNG is available if `image-set(...)` is unsupported.
- Files:
  - `src/components/Hero.tsx`
  - `src/pages/HomePage.tsx`

2. **CTAFinal prop mismatch fixed**
- `CTAFinal` no longer accepts an unused `backgroundImage` prop.
- Replaced hardcoded external Unsplash background with local optimized assets (`image-set` + PNG fallback).
- Files:
  - `src/components/CTAFinal.tsx`
  - `src/pages/HomePage.tsx`

3. **Dead-end postbuild derivative flow removed**
- Removed automatic postbuild derivative generation that was producing mostly unreferenced AVIF/WebP files.
- `postbuild` now only runs site-origin replacement.
- File:
  - `package.json`

## Critical-path and major-surface improvements

### Homepage / major section external dependencies localized

Replaced external homepage/primary section backgrounds with local assets:
- `src/components/MissionGrid.tsx`
- `src/components/StoryCarousel.tsx`
- `src/components/ImpactSection.tsx`
- `src/components/CTAFinal.tsx`
- `src/pages/HomePage.tsx` (story card image)
- `src/data/stories.ts` (volunteer-impact category/article images)

### About / Mission / Impact heavyweight PNG delivery improved

Added explicit WebP-first runtime delivery with fallback for highest-risk surfaces:
- About hero: `src/pages/AboutPage.tsx` (WebP + fallback)
- About team hero: `src/pages/AboutPage.tsx` (WebP + fallback)
- About 2026 timeline gallery assets: `src/pages/AboutPage.tsx` via `TimelinePhotoStack`
- Mission sticky background: `src/pages/MissionPage.tsx` via `image-set(WebP, PNG)`
- Impact major community image: `src/pages/ImpactPage.tsx` (`<picture>` + fallback)

New optimized assets added:
- `src/assets/compd/0c7f5d615ddb7365345eec2cd86bf98d3be9ca22.webp`
- `src/assets/compd/c88e8fd418fa5de2d8271a01eff7835b8bc45301.webp`
- `src/assets/compd/63f606372ec6e500e9a7547d300fb9f0d31dae7e.webp`
- `src/assets/compd/7c67e828e47be75e27ecc6de02db283be5ae7589.webp`
- `src/assets/compd/c4e1406ca17d5d9941f67714b4ad381639235894.webp`
- `src/assets/compd/c468599141a487a1168ff53b1f6de665f3b4be9d.webp`

### Responsive handling improvements

- Added `sizes` to key `<source srcSet>` elements in critical surfaces.
- Added width/height metadata on newly-updated critical `<img>` elements where safe.
- Files:
  - `src/pages/AboutPage.tsx`
  - `src/pages/ImpactPage.tsx`
  - `src/components/TimelinePhotoStack.tsx`
  - `src/components/MissionGrid.tsx`
  - `src/components/StoryCarousel.tsx`
  - `src/components/ImpactSection.tsx`

## Measurable improvements

- Build status: **success** (`npm run build`).
- Postbuild derivative waste removed:
  - Before remediation audit: 227 built images, 120 unreferenced.
  - After remediation: 113 built images, **0 unreferenced**.
- External image dependencies in app code reduced from prior audit set:
  - Now only 6 external image URLs remain, concentrated in `GetInvolvedPage` and one About staff headshot.

Selected source asset reductions (PNG -> WebP variant):
- `0c7f...`: 646 KB -> 204 KB (-68.5%)
- `c88e...`: 3,312 KB -> 127 KB (-96.2%)
- `63f6...`: 13,178 KB -> 1,134 KB (-91.4%)
- `7c67...`: 6,108 KB -> 267 KB (-95.6%)
- `c4e1...`: 1,014 KB -> 500 KB (-50.8%)
- `c468...`: 3,078 KB -> 802 KB (-74.0%)

## Files changed

- `package.json`
- `src/components/Hero.tsx`
- `src/components/CTAFinal.tsx`
- `src/components/MissionGrid.tsx`
- `src/components/StoryCarousel.tsx`
- `src/components/ImpactSection.tsx`
- `src/components/TimelinePhotoStack.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/MissionPage.tsx`
- `src/pages/ImpactPage.tsx`
- `src/data/stories.ts`
- `src/assets/compd/0c7f5d615ddb7365345eec2cd86bf98d3be9ca22.webp`
- `src/assets/compd/c88e8fd418fa5de2d8271a01eff7835b8bc45301.webp`
- `src/assets/compd/63f606372ec6e500e9a7547d300fb9f0d31dae7e.webp`
- `src/assets/compd/7c67e828e47be75e27ecc6de02db283be5ae7589.webp`
- `src/assets/compd/c4e1406ca17d5d9941f67714b4ad381639235894.webp`
- `src/assets/compd/c468599141a487a1168ff53b1f6de665f3b4be9d.webp`

## Remaining manual/high-touch items

1. `GetInvolvedPage` still uses multiple Unsplash-hosted images (`src/pages/GetInvolvedPage.tsx`).
2. One About staff headshot remains externally hosted on Squarespace CDN (`src/pages/AboutPage.tsx`, Olivia profile).
3. Some very large original PNG/JPG fallback files still exist in source and build output as fallback paths; additional quality-reviewed replacement/export work is still recommended for long-term payload reduction.

## Changelog-ready summary

- Resolved Hero and CTA image wiring mismatches by aligning component APIs and runtime behavior.
- Removed ineffective postbuild image derivative generation that produced unreferenced assets.
- Localized homepage/major-section external backgrounds to local assets.
- Added WebP-first delivery with fallback for high-impact About, Mission, and Impact surfaces.
- Improved responsive image metadata (`sizes`, width/height) on updated critical image paths.
