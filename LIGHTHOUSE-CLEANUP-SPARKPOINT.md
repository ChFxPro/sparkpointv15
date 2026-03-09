# SparkPoint Lighthouse Cleanup (Homepage)

Date: 2026-03-09
Branch: codex/lighthouse-homepage-cleanup

## Scope
Focused remediation pass for homepage Lighthouse issues only (mobile), with small and reversible changes.

## Files Changed
- `index.html`
- `public/logo-wordmark.webp` (new)
- `src/components/Hero.tsx`
- `src/components/CTAFinal.tsx`
- `src/components/ConnectionSection.tsx`
- `src/components/Footer.tsx`
- `src/pages/HomePage.tsx`
- `src/assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9-1400.webp` (new)

## Issues Fixed

### 1) Image elements missing explicit width/height
Fixed explicit dimensions on homepage-relevant image surfaces that were still missing intrinsic sizing:
- Connection cards in `ConnectionSection` (`sparkpurpose`, `story`, `vos` images): `2000x1333`.
- Footer trust badges (`candidSeal`, `livingWageLogo`): `600x600`, `1200x1200`.
- CTA final SparkPoint logo image: `839x290` plus responsive `sizes`.

### 2) LCP request discovery (homepage logo)
Latest Lighthouse indicated logo as current LCP element. Improved discoverability and priority:
- Added static HTML preload in `index.html`:
  - `<link rel="preload" as="image" href="%BASE_URL%logo-wordmark.webp" fetchpriority="high" />`
- Added `public/logo-wordmark.webp` and switched hero logo to this stable URL.
- Kept hero logo `fetchPriority="high"`, `loading="eager"`, and explicit intrinsic dimensions.

### 3) Improve image delivery (~150 KiB target area)
Reduced mobile critical hero background payload by introducing a smaller variant and mobile-aware selection:
- Added optimized `1400w` hero background WebP (`~198 KB`) from the original source.
- Wired hero and CTA background selection to use the smaller WebP on mobile viewports.
- Kept PNG fallback only for non-`image-set` support paths.

### 4) Non-composited animation fixes
Converted paint-heavy hero animation behavior to transform/opacity animation paths:
- Removed animated `background` color-shift sequence on hero drift layer.
- Replaced animated text `backgroundPosition` shimmer with transform/opacity motion.
- Added `willChange: 'transform, opacity'` on affected hero animated layers.

### 5) Reduce unused JS / long-task pressure (safe deferral)
Deferred one non-critical homepage section to post-initial render:
- `InteractiveSparkPointInfographic` is now lazy-loaded and mounted after initial delay (`~650ms`).
- This preserves layout intent while reducing initial parse/execute pressure for first paint/LCP windows.

### 6) Forced reflow risk reduction
Applied a safe mobile guard to reduce runtime animation overhead:
- Disabled hero parallax transforms on mobile viewport.
- Kept desktop behavior intact.

## Build Verification
Command:
- `npm run build`

Result:
- Build succeeded.
- New outputs include:
  - `/build/logo-wordmark.webp`
  - `/build/assets/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9-1400-*.webp`
  - deferred chunk `/build/assets/InteractiveSparkPointInfographic-*.js`

## Remaining Platform-Level Constraints
- Main app chunk remains large (`index-*.js` > 500 KB minified). Further meaningful reduction likely needs broader route/component splitting beyond this scoped pass.
- Several large image assets still exist on non-home routes and in lazy chunks; they still affect route-level performance outside homepage critical path.
- Google Fonts CSS is still an external dependency (already non-blocking loaded), but network latency can still influence typography swap timing.

## Expected Impact
- Better LCP discovery and priority for current logo-based LCP.
- Lower mobile hero background transfer when `image-set` path is used.
- Reduced layout-shift risk from missing intrinsic image dimensions.
- Lower chance of non-composited animation warnings from hero effects.
- Small reduction in initial JS execution burden through deferred infographic loading.
