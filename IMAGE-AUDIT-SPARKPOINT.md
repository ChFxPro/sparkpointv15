# IMAGE-AUDIT-SPARKPOINT

Date: 2026-03-09
Repo: `sparkpointv15`
Scope: Audit-only (no code changes)

## Executive summary

- Scanned image usage across `src/pages/*`, `src/components/*`, `src/data/*`, `src/assets/*`, and `public/*`.
- Found **124 unique image references** (110 local, 14 external) and **269 total references**.
- Local asset set contains **111 image files** in source; **2 local assets appear unused**.
- Build output (`npm run build`) emitted **227 image files** in `build/assets`; only **107 were referenced** by built HTML/CSS/JS. The **120 unreferenced files are all postbuild-generated derivatives** (60 AVIF + 60 WebP).
- Fallback patterns exist in some places (`<picture><source>` and one `image-set`), but many key surfaces still serve single-format PNG or external JPEG URLs.
- Responsive delivery is limited: `<picture>` exists on select components, but **no `sizes` attributes** were found and many large images still render as single-source assets.

## Audit methodology

- Static code crawl with `rg` and scripted extraction for:
  - image imports and string references
  - `<img>`, `<picture>`, `<source>` usage
  - CSS `backgroundImage`, `url(...)`, and `image-set(...)`
  - external URL dependencies (Unsplash, Squarespace CDN)
- Production delivery verification using `npm run build` and a reference scan of generated HTML/CSS/JS.

## Key metrics

- Unique images: 124
- Local unique images: 110
- External unique images: 14
- Formats referenced:
  - PNG: 40
  - JPG/JPEG: 36
  - WebP: 35
  - AVIF: 1
  - External URLs with `fm=jpg`: 12
- Tag usage snapshot:
  - `<img>` tags: 61
  - `<picture>` tags: 12
  - `<source>` tags: 12
  - `<img loading=...>`: 15 (14 lazy, 1 eager)
  - `<img>` with explicit `width` and `height`: 0

## Critical-path / homepage images

| Surface | File reference | Current delivery | Approx size | Risk |
|---|---|---|---:|---|
| Home hero background | `src/components/Hero.tsx:79-83` | CSS `image-set(AVIF, WebP, PNG)` | 931 KB AVIF / 595 KB WebP / 1.1 MB PNG | Likely homepage LCP; no explicit non-`image-set` fallback declaration for older browsers |
| Home hero logo | `src/components/Hero.tsx:152-155` | `<img>` PNG | 60.9 KB | LCP-adjacent on first viewport |
| MissionGrid background | `src/components/MissionGrid.tsx:12-16` | External Unsplash JPG URL | remote | External dependency, no local fallback |
| StoryCarousel background | `src/components/StoryCarousel.tsx:51-55` | External Unsplash JPG URL | remote | External dependency, no local fallback |
| ImpactSection background | `src/components/ImpactSection.tsx:562-566` | External Unsplash JPG URL | remote | External dependency, no local fallback |
| CTAFinal background | `src/components/CTAFinal.tsx:20` | External Unsplash JPG URL | remote | External dependency and prop override bug (see mismatches) |

## Critical-path / major route assets (non-home)

| Route area | File reference | Asset | Approx size | Delivery pattern |
|---|---|---|---:|---|
| About hero | `src/pages/AboutPage.tsx:476-481` | `figma:asset/0c7f...png` | 661 KB | single PNG `<img>` |
| About “SparkPoint Commons” media | `src/pages/AboutPage.tsx:39` data used via timeline stack | `figma:asset/63f6...png` | 13 MB | large PNG source |
| About “Media Studio” media | `src/pages/AboutPage.tsx:40` data used via timeline stack | `figma:asset/7c67...png` | 6.0 MB | large PNG source |
| About team hero | `src/pages/AboutPage.tsx:1000-1004` | `figma:asset/c88e...png` | 3.2 MB | single PNG `<img>` |
| Mission sticky background | `src/pages/MissionPage.tsx:891` | `figma:asset/c4e1...png` | 1.0 MB | CSS `backgroundImage: url(...)` |
| Impact community moments image | `src/pages/ImpactPage.tsx:488-492` | `figma:asset/c468...png` | 3.0 MB | single PNG `<img>` |

## Delivery mismatches and root causes

### 1) Passed image props are not used in rendering

- `Hero` accepts `heroImage` but does not render it.
  - Pass site: `src/pages/HomePage.tsx:47-49`
  - Render behavior: hardcoded local mountain `image-set` in `src/components/Hero.tsx:79-83`
  - Effect: production serves local mountain assets, not the URL passed from the page.
- `CTAFinal` accepts `backgroundImage` but uses a hardcoded Unsplash URL.
  - Pass site: `src/pages/HomePage.tsx:73-75`
  - Render behavior: hardcoded background in `src/components/CTAFinal.tsx:20`
  - Effect: intended page-level image control is bypassed.

### 2) Postbuild format generation is mostly unused

- Postbuild script creates AVIF/WebP derivatives for large `build/assets` JPG/PNG files:
  - `scripts/optimize-hero-images.js:29-50`
- Build audit result:
  - 227 image files in `build/assets`
  - 107 referenced by built HTML/CSS/JS
  - 120 unreferenced (all 60 AVIF + 60 WebP)
- Root cause:
  - Derivatives are generated after bundling but markup/CSS references are not rewritten to use them (except where source already explicitly uses `<picture>` or `image-set`).

### 3) PNG-heavy delivery on major sections

- Several large PNG assets are used directly in route-critical sections (`AboutPage`, `MissionPage`, `ImpactPage`) without responsive variants in markup.
- Root cause:
  - Figma export PNGs are imported as final render assets in many components.

## Fallback issues

### Working fallback patterns

- `<picture><source type="image/webp"> + <img jpg/png fallback>` is used in:
  - `src/components/ConnectionSection.tsx:202-210`, `243-251`, `284-292`
  - `src/pages/AboutPage.tsx:628-634`, `667-673`, and team/board cards around `1039-1159`
  - `src/pages/ImpactPage.tsx:192-200`
  - `src/components/TimelinePhotoStack.tsx:113-123`, `186-196`
- `image-set(AVIF, WebP, PNG)` is used in:
  - `src/components/Hero.tsx:79-83`

### Gaps / likely problems

- `Hero` relies on CSS `image-set` only; there is no explicit separate `background-image: url(...)` fallback declaration for non-supporting browsers.
  - File: `src/components/Hero.tsx:79-83`
- Many major route images use single-source PNG/JPG without responsive variants (`srcset`/`sizes`) and without format fallback.
  - Examples: `src/pages/AboutPage.tsx:476-481`, `src/pages/AboutPage.tsx:1000-1004`, `src/pages/MissionPage.tsx:891`, `src/pages/ImpactPage.tsx:488-492`
- External-image sections have no local fallback if CDN URLs fail.
  - Examples: `src/components/MissionGrid.tsx:13`, `src/components/StoryCarousel.tsx:52`, `src/components/ImpactSection.tsx:563`, `src/components/CTAFinal.tsx:20`

## Responsive image handling review

- `srcSet`/`<picture>` exists in a subset of components.
- `sizes` attribute usage: **none found**.
- Width/height attributes on `<img>`: **none found**.
- Implication:
  - Browser has less information for optimal source selection and layout stability.

## Performance risks

### High-risk assets

- `src/assets/63f606372ec6e500e9a7547d300fb9f0d31dae7e.png` (~13 MB)
- `src/assets/7c67e828e47be75e27ecc6de02db283be5ae7589.png` (~6.0 MB)
- `src/assets/c88e8fd418fa5de2d8271a01eff7835b8bc45301.png` (~3.2 MB)
- `src/assets/c468599141a487a1168ff53b1f6de665f3b4be9d.png` (~3.0 MB)
- `src/assets/bz_brevard_day.jpg` (~3.15 MB)

### Other risks

- Multiple external/hotlinked section images (Unsplash, Squarespace CDN) create runtime dependency risk and variability in performance.
- Source tree includes duplicate format sets in many places, but broader postbuild derivatives are not actually consumed.
- Build warning indicates large JS chunk (`build/assets/index-*.js` ~824 KB), compounding image payload pressure on page experience.

## External image dependencies

| URL host | Image URL count | Source references |
|---|---:|---|
| `images.unsplash.com` | 12 | `src/pages/HomePage.tsx`, `src/pages/GetInvolvedPage.tsx`, `src/components/MissionGrid.tsx`, `src/components/StoryCarousel.tsx`, `src/components/ImpactSection.tsx`, `src/components/CTAFinal.tsx`, `src/data/stories.ts` |
| `images.squarespace-cdn.com` | 1 | `src/pages/AboutPage.tsx:324` |
| `www.yoursparkpoint.org` (absolute OG fallback in schema) | 1 | `src/pages/StoryArticlePage.tsx:44` |

Detailed external URL list (14 total unique) is captured in `/tmp/sparkpoint-external-image-deps.json`.

## Unused local assets

- `src/assets/ba6e37fd64adba4fcc3b0218dcd2bb192cb23802.png` (~1.2 MB)
- `src/assets/bfacc09e892a84383df5476044a4c68f27340b81.png` (~0.6 MB)

## Recommended fixes by priority

### P0

- Fix image prop/render mismatches:
  - Use `heroImage` in `Hero` or remove prop and caller assumptions.
  - Use `backgroundImage` in `CTAFinal` or remove prop and caller assumptions.
- Decide whether postbuild AVIF/WebP generation should be kept:
  - If yes, wire generated variants into runtime markup/CSS.
  - If not, remove script to avoid shipping unreferenced artifacts.

### P1

- Replace large above-the-fold and route-hero PNGs with optimized formats and responsive variants.
- Add `sizes` where `srcSet`/`<picture>` is used.
- Add explicit dimensions or equivalent layout constraints for key `<img>` surfaces to reduce CLS risk.
- Reduce dependence on external hotlinked images for major sections by localizing critical assets.

### P2

- Convert appropriate logo/badge assets to SVG where possible.
- Consolidate image naming and variant strategy (source-of-truth per asset family).
- Add automated image budget checks (e.g., fail CI for very large new assets).

## All images found

Complete inventory table (all discovered references) follows.

| Source file | Component/page | Image path | Format | Local/external | Usage mode | Above fold/LCP | Fallback logic |
|---|---|---|---|---|---|---|---|
| public/404.html | 404 | /og/default.jpg -> public/og/default.jpg | jpg | local | unknown (data/import-driven) | No | No explicit fallback |
| src/components/BehindTheStories.tsx | BehindTheStories | figma:asset/183c96a680c45035b0835db81082bdb93af69f97.png -> src/assets/183c96a680c45035b0835db81082bdb93af69f97.png | png | local | img (data-driven) | No | No explicit fallback |
| src/components/BehindTheStories.tsx | BehindTheStories | figma:asset/28635c221385162e7318f9ca720b599fe97a1bb5.png -> src/assets/28635c221385162e7318f9ca720b599fe97a1bb5.png | png | local | img (data-driven) | No | No explicit fallback |
| src/components/BehindTheStories.tsx | BehindTheStories | figma:asset/804331be6917486c365a5471a09f615ba2d0f66b.png -> src/assets/804331be6917486c365a5471a09f615ba2d0f66b.png | png | local | img (data-driven) | No | No explicit fallback |
| src/components/BehindTheStories.tsx | BehindTheStories | figma:asset/9c661c719237d099265f1fb1d61cc2e4d16fcc41.png -> src/assets/9c661c719237d099265f1fb1d61cc2e4d16fcc41.png | png | local | img (data-driven) | No | No explicit fallback |
| src/components/CTAFinal.tsx | CTAFinal | figma:asset/16ed15b2e7cab4039cf2d9fb007333306f37886c.png -> src/assets/16ed15b2e7cab4039cf2d9fb007333306f37886c.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/components/CTAFinal.tsx | CTAFinal | https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMG5hdHVyZSUyMHRyZWVzfGVufDF8fHx8MTc2MTA5MDkxM3ww&ixlib=rb-4.1.0&q=80&w=1080 | jpg (query fm=jpg) | external | css-background | No | No explicit fallback |
| src/components/ConnectionSection.tsx | ConnectionSection | ../assets/connection_happens/sparkpurpose1.jpg -> src/assets/connection_happens/sparkpurpose1.jpg | jpg | local | img | No | No explicit fallback |
| src/components/ConnectionSection.tsx | ConnectionSection | ../assets/connection_happens/sparkpurpose1.webp -> src/assets/connection_happens/sparkpurpose1.webp | webp | local | picture-source | No | Yes (<picture><source>) |
| src/components/ConnectionSection.tsx | ConnectionSection | ../assets/connection_happens/story1.jpg -> src/assets/connection_happens/story1.jpg | jpg | local | img | No | No explicit fallback |
| src/components/ConnectionSection.tsx | ConnectionSection | ../assets/connection_happens/story1.webp -> src/assets/connection_happens/story1.webp | webp | local | picture-source | No | Yes (<picture><source>) |
| src/components/ConnectionSection.tsx | ConnectionSection | ../assets/connection_happens/vos1.jpg -> src/assets/connection_happens/vos1.jpg | jpg | local | img | No | No explicit fallback |
| src/components/ConnectionSection.tsx | ConnectionSection | ../assets/connection_happens/vos1.webp -> src/assets/connection_happens/vos1.webp | webp | local | picture-source | No | Yes (<picture><source>) |
| src/components/Footer.tsx | Footer | figma:asset/16ed15b2e7cab4039cf2d9fb007333306f37886c.png -> src/assets/16ed15b2e7cab4039cf2d9fb007333306f37886c.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/components/Footer.tsx | Footer | figma:asset/35bb889d1f4d0b05ae6753439b58199640858447.png -> src/assets/35bb889d1f4d0b05ae6753439b58199640858447.png | png | local | img | No | No explicit fallback |
| src/components/Footer.tsx | Footer | figma:asset/5a36f7b11c9d0bf970613a37a28b121b31918d77.png -> src/assets/5a36f7b11c9d0bf970613a37a28b121b31918d77.png | png | local | img | No | No explicit fallback |
| src/components/Footer.tsx | Footer | figma:asset/ec17a6fe91f3b0bf97249c7bd911f4723893563c.png -> src/assets/ec17a6fe91f3b0bf97249c7bd911f4723893563c.png | png | local | img | No | No explicit fallback |
| src/components/Header.tsx | Header | figma:asset/35bb889d1f4d0b05ae6753439b58199640858447.png -> src/assets/35bb889d1f4d0b05ae6753439b58199640858447.png | png | local | img | Likely | No explicit fallback |
| src/components/Hero.tsx | Hero | ../assets/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.png -> src/assets/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.png | png | local | image-set | Yes | Yes (image-set AVIF/WebP/PNG) |
| src/components/Hero.tsx | Hero | ../assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.avif -> src/assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.avif | avif | local | image-set | Yes | Yes (image-set AVIF/WebP/PNG) |
| src/components/Hero.tsx | Hero | ../assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.webp -> src/assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.webp | webp | local | image-set | Yes | Yes (image-set AVIF/WebP/PNG) |
| src/components/Hero.tsx | Hero | figma:asset/35bb889d1f4d0b05ae6753439b58199640858447.png -> src/assets/35bb889d1f4d0b05ae6753439b58199640858447.png | png | local | img | Yes | No explicit fallback |
| src/components/ImpactSection.tsx | ImpactSection | https://images.unsplash.com/photo-1632580254134-94c4a73dab76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBwZW9wbGV8ZW58MXx8fHwxNzYxMDE5NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080 | jpg (query fm=jpg) | external | unknown (data/import-driven) | No | No explicit fallback |
| src/components/MissionGrid.tsx | MissionGrid | https://images.unsplash.com/photo-1593043927112-08289c3f1b64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwcGFwZXIlMjB0ZXh0dXJlJTIwbGlnaHR8ZW58MXx8fHwxNzYxMDg5NDMzfDA&ixlib=rb-4.1.0&q=80&w=1080 | jpg (query fm=jpg) | external | unknown (data/import-driven) | No | No explicit fallback |
| src/components/SEOHead.tsx | SEOHead | /og/default.jpg -> public/og/default.jpg | jpg | local | unknown (data/import-driven) | No | No explicit fallback |
| src/components/StoryCarousel.tsx | StoryCarousel | https://images.unsplash.com/photo-1710438399440-83452997ffd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRleHR1cmUlMjBzdWJ0bGUlMjBwYXR0ZXJufGVufDF8fHx8MTc2MTA4OTQzMnww&ixlib=rb-4.1.0&q=80&w=1080 | jpg (query fm=jpg) | external | unknown (data/import-driven) | No | No explicit fallback |
| src/components/StructuredData.tsx | StructuredData | /logo.png -> public/logo.png | png | local | unknown (data/import-driven) | Likely | No explicit fallback |
| src/data/stories.ts | stories | figma:asset/0835779aef52124bf5c00840473e8285f8e0f937.png -> src/assets/0835779aef52124bf5c00840473e8285f8e0f937.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/data/stories.ts | stories | figma:asset/e4e8c9f59f3a2b2ee1533f1f427ca4a4cb3693a5.png -> src/assets/e4e8c9f59f3a2b2ee1533f1f427ca4a4cb3693a5.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/data/stories.ts | stories | https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwaGVscGluZyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NjExMzg3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral | jpg (query fm=jpg) | external | unknown (data/import-driven) | No | No explicit fallback |
| src/imports/InteractiveSparkPointInfographic-backup.tsx | InteractiveSparkPointInfographic-backup | figma:asset/046ca85659860578eeeab6a45f52700c54c519a3.png -> src/assets/046ca85659860578eeeab6a45f52700c54c519a3.png | png | local | img | No | No explicit fallback |
| src/imports/InteractiveSparkPointInfographic.tsx | InteractiveSparkPointInfographic | figma:asset/35bb889d1f4d0b05ae6753439b58199640858447.png -> src/assets/35bb889d1f4d0b05ae6753439b58199640858447.png | png | local | img | No | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/sp_port26_0000_daniel.jpg -> src/assets/board_pics/sp_port26_0000_daniel.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/sp_port26_0001_marsha.jpg -> src/assets/board_pics/sp_port26_0001_marsha.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/sp_port26_0002_ora.jpg -> src/assets/board_pics/sp_port26_0002_ora.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/sp_port26_0003_jeffrey.jpg -> src/assets/board_pics/sp_port26_0003_jeffrey.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/sp_port26_0004_carolyn.jpg -> src/assets/board_pics/sp_port26_0004_carolyn.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/sp_port26_0005_saundra.jpg -> src/assets/board_pics/sp_port26_0005_saundra.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/sp_port26_0006_gail.jpg -> src/assets/board_pics/sp_port26_0006_gail.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/sp_port26_0007_maureen.jpg -> src/assets/board_pics/sp_port26_0007_maureen.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/sp_port26_0008_shannon.jpg -> src/assets/board_pics/sp_port26_0008_shannon.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/sp_port26_0009_gloria.jpg -> src/assets/board_pics/sp_port26_0009_gloria.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/webp/sp_port26_0000_daniel.webp -> src/assets/board_pics/webp/sp_port26_0000_daniel.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/webp/sp_port26_0001_marsha.webp -> src/assets/board_pics/webp/sp_port26_0001_marsha.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/webp/sp_port26_0002_ora.webp -> src/assets/board_pics/webp/sp_port26_0002_ora.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/webp/sp_port26_0003_jeffrey.webp -> src/assets/board_pics/webp/sp_port26_0003_jeffrey.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/webp/sp_port26_0004_carolyn.webp -> src/assets/board_pics/webp/sp_port26_0004_carolyn.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/webp/sp_port26_0005_saundra.webp -> src/assets/board_pics/webp/sp_port26_0005_saundra.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/webp/sp_port26_0006_gail.webp -> src/assets/board_pics/webp/sp_port26_0006_gail.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/webp/sp_port26_0007_maureen.webp -> src/assets/board_pics/webp/sp_port26_0007_maureen.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/webp/sp_port26_0008_shannon.webp -> src/assets/board_pics/webp/sp_port26_0008_shannon.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/board_pics/webp/sp_port26_0009_gloria.webp -> src/assets/board_pics/webp/sp_port26_0009_gloria.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/bz_brevard_day.jpg -> src/assets/bz_brevard_day.jpg | jpg | local | img | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/bz_brevard_day.webp -> src/assets/bz_brevard_day.webp | webp | local | picture-source | Possible | Yes (<picture><source>) |
| src/pages/AboutPage.tsx | AboutPage | ../assets/icons/np-evolve.png -> src/assets/icons/np-evolve.png | png | local | img | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/icons/np-evolve.webp -> src/assets/icons/np-evolve.webp | webp | local | picture-source | Possible | Yes (<picture><source>) |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/sp_port26__0000_jenny.jpg -> src/assets/staff_pics/sp_port26__0000_jenny.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/sp_port26__0001_maggie.jpg -> src/assets/staff_pics/sp_port26__0001_maggie.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/sp_port26__0002_jeff.jpg -> src/assets/staff_pics/sp_port26__0002_jeff.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/sp_port26__0003_charlotte.jpg -> src/assets/staff_pics/sp_port26__0003_charlotte.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/sp_port26__0004_sarah.jpg -> src/assets/staff_pics/sp_port26__0004_sarah.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/sp_port26__0005_josh.jpg -> src/assets/staff_pics/sp_port26__0005_josh.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/sp_port26__0006_sophia.jpg -> src/assets/staff_pics/sp_port26__0006_sophia.jpg | jpg | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/webp/sp_port26__0000_jenny.webp -> src/assets/staff_pics/webp/sp_port26__0000_jenny.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/webp/sp_port26__0001_maggie.webp -> src/assets/staff_pics/webp/sp_port26__0001_maggie.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/webp/sp_port26__0002_jeff.webp -> src/assets/staff_pics/webp/sp_port26__0002_jeff.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/webp/sp_port26__0003_charlotte.webp -> src/assets/staff_pics/webp/sp_port26__0003_charlotte.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/webp/sp_port26__0004_sarah.webp -> src/assets/staff_pics/webp/sp_port26__0004_sarah.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/webp/sp_port26__0005_josh.webp -> src/assets/staff_pics/webp/sp_port26__0005_josh.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/staff_pics/webp/sp_port26__0006_sophia.webp -> src/assets/staff_pics/webp/sp_port26__0006_sophia.webp | webp | local | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0000_paper.jpg -> src/assets/sust/sus_0000_paper.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0000_paper.webp -> src/assets/sust/sus_0000_paper.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0001_group.jpg -> src/assets/sust/sus_0001_group.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0001_group.webp -> src/assets/sust/sus_0001_group.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0002_sarah_ora.jpg -> src/assets/sust/sus_0002_sarah_ora.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0002_sarah_ora.webp -> src/assets/sust/sus_0002_sarah_ora.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0003_walk.jpg -> src/assets/sust/sus_0003_walk.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0003_walk.webp -> src/assets/sust/sus_0003_walk.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0004_shirt.jpg -> src/assets/sust/sus_0004_shirt.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0004_shirt.webp -> src/assets/sust/sus_0004_shirt.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0005_gord.jpg -> src/assets/sust/sus_0005_gord.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | ../assets/sust/sus_0005_gord.webp -> src/assets/sust/sus_0005_gord.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/006b84f90bae2616433d7bda85278d8264e4e33c.png -> src/assets/006b84f90bae2616433d7bda85278d8264e4e33c.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/08d6097996fec1db647eccd1343a8e7ebf420b7b.png -> src/assets/08d6097996fec1db647eccd1343a8e7ebf420b7b.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/0c7f5d615ddb7365345eec2cd86bf98d3be9ca22.png -> src/assets/0c7f5d615ddb7365345eec2cd86bf98d3be9ca22.png | png | local | img | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/183c96a680c45035b0835db81082bdb93af69f97.png -> src/assets/183c96a680c45035b0835db81082bdb93af69f97.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/20c2a905251c86d5a4f9333b83199204b6928c7d.png -> src/assets/20c2a905251c86d5a4f9333b83199204b6928c7d.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/238168330742171cebb538968793e34afcac231e.png -> src/assets/238168330742171cebb538968793e34afcac231e.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/2f54cc163c056ac592d9e429a8920f74d0a98f56.png -> src/assets/2f54cc163c056ac592d9e429a8920f74d0a98f56.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/56901f1a91f140dcee14c66f977ed2a0bd9120ed.png -> src/assets/56901f1a91f140dcee14c66f977ed2a0bd9120ed.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/5b0388c9542f078a58f8b6be96161b02480d4b7d.png -> src/assets/5b0388c9542f078a58f8b6be96161b02480d4b7d.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/6188b8c6c445b647b8e4e9b74a1010513b0cc4b6.png -> src/assets/6188b8c6c445b647b8e4e9b74a1010513b0cc4b6.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/63f606372ec6e500e9a7547d300fb9f0d31dae7e.png -> src/assets/63f606372ec6e500e9a7547d300fb9f0d31dae7e.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/7c67e828e47be75e27ecc6de02db283be5ae7589.png -> src/assets/7c67e828e47be75e27ecc6de02db283be5ae7589.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/bef0024c7f7aa5cba807241e9b1a543393d1afd6.png -> src/assets/bef0024c7f7aa5cba807241e9b1a543393d1afd6.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/c88e8fd418fa5de2d8271a01eff7835b8bc45301.png -> src/assets/c88e8fd418fa5de2d8271a01eff7835b8bc45301.png | png | local | img | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/ce0a67a45092b4432ec7c00f4a17cb5a77e95a50.png -> src/assets/ce0a67a45092b4432ec7c00f4a17cb5a77e95a50.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | figma:asset/ce8cfb7a67e4c9db354c1d7021333b647621f8d5.png -> src/assets/ce8cfb7a67e4c9db354c1d7021333b647621f8d5.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/AboutPage.tsx | AboutPage | https://images.squarespace-cdn.com/content/v1/5e13af05d72fc96230cefbd1/72201284-5042-4368-b9b8-b64f85120734/Olivia-265.JPG?format=2500w | jpg | external | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/CommunityChampionsArticle.tsx | CommunityChampionsArticle | figma:asset/03643ed23c45475ef78b3e0f363a5b886b5679a9.png -> src/assets/03643ed23c45475ef78b3e0f363a5b886b5679a9.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/pages/CommunityChampionsArticle.tsx | CommunityChampionsArticle | figma:asset/081f67bc0043a989fd3bbe690f2bc36895e2ae29.png -> src/assets/081f67bc0043a989fd3bbe690f2bc36895e2ae29.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/pages/CommunityChampionsArticle.tsx | CommunityChampionsArticle | figma:asset/acc45b75e300283fd839e68a5d16299f663b13b6.png -> src/assets/acc45b75e300283fd839e68a5d16299f663b13b6.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/pages/CommunityChampionsArticle.tsx | CommunityChampionsArticle | figma:asset/e3f8a2b021eb0d337580338dd10e709a1762494c.png -> src/assets/e3f8a2b021eb0d337580338dd10e709a1762494c.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/pages/GetInvolvedPage.tsx | GetInvolvedPage | https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb25hdGlvbiUyMGNoYXJpdHklMjBnaXZpbmd8ZW58MXx8fHwxNzYxMTM4NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral | jpg (query fm=jpg) | external | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/GetInvolvedPage.tsx | GetInvolvedPage | https://images.unsplash.com/photo-1687360440648-ec9708d52086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBkaXZlcnNpdHklMjBwZW9wbGV8ZW58MXx8fHwxNzYxMTM4NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral | jpg (query fm=jpg) | external | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/GetInvolvedPage.tsx | GetInvolvedPage | https://images.unsplash.com/photo-1694350461777-1519e03ef70a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBuYXR1cmUlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NjA5OTcyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080 | jpg (query fm=jpg) | external | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/GetInvolvedPage.tsx | GetInvolvedPage | https://images.unsplash.com/photo-1758599543157-bc1a94fec33c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc2MTEwMjc2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral | jpg (query fm=jpg) | external | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/GetInvolvedPage.tsx | GetInvolvedPage | https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwaGVscGluZyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NjExMzg3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral | jpg (query fm=jpg) | external | unknown (data/import-driven) | Possible | No explicit fallback |
| src/pages/HeleneOneYearArticle.tsx | HeleneOneYearArticle | figma:asset/03643ed23c45475ef78b3e0f363a5b886b5679a9.png -> src/assets/03643ed23c45475ef78b3e0f363a5b886b5679a9.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/pages/HeleneOneYearArticle.tsx | HeleneOneYearArticle | figma:asset/081f67bc0043a989fd3bbe690f2bc36895e2ae29.png -> src/assets/081f67bc0043a989fd3bbe690f2bc36895e2ae29.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/pages/HeleneOneYearArticle.tsx | HeleneOneYearArticle | figma:asset/acc45b75e300283fd839e68a5d16299f663b13b6.png -> src/assets/acc45b75e300283fd839e68a5d16299f663b13b6.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/pages/HeleneOneYearArticle.tsx | HeleneOneYearArticle | figma:asset/e3f8a2b021eb0d337580338dd10e709a1762494c.png -> src/assets/e3f8a2b021eb0d337580338dd10e709a1762494c.png | png | local | unknown (data/import-driven) | No | No explicit fallback |
| src/pages/HomePage.tsx | HomePage | figma:asset/0835779aef52124bf5c00840473e8285f8e0f937.png -> src/assets/0835779aef52124bf5c00840473e8285f8e0f937.png | png | local | unknown (data/import-driven) | Likely | No explicit fallback |
| src/pages/HomePage.tsx | HomePage | figma:asset/e4e8c9f59f3a2b2ee1533f1f427ca4a4cb3693a5.png -> src/assets/e4e8c9f59f3a2b2ee1533f1f427ca4a4cb3693a5.png | png | local | unknown (data/import-driven) | Likely | No explicit fallback |
| src/pages/HomePage.tsx | HomePage | https://images.unsplash.com/photo-1629812205627-222da4a73816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JuaW5nJTIwbGlnaHQlMjBtb3VudGFpbnxlbnwxfHx8fDE3NjEwODkwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080 | jpg (query fm=jpg) | external | unknown (data/import-driven) | Likely | No explicit fallback |
| src/pages/HomePage.tsx | HomePage | https://images.unsplash.com/photo-1694350461777-1519e03ef70a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBuYXR1cmUlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NjEwOTcyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080 | jpg (query fm=jpg) | external | unknown (data/import-driven) | Likely | No explicit fallback |
| src/pages/HomePage.tsx | HomePage | https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJzJTIwaGVscGluZ3xlbnwxfHx8fDE3NjEwNzA2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080 | jpg (query fm=jpg) | external | unknown (data/import-driven) | Likely | No explicit fallback |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/helene1.jpg -> src/assets/moments_impact/helene1.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/helene1.webp -> src/assets/moments_impact/helene1.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/helene2.jpg -> src/assets/moments_impact/helene2.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/helene2.webp -> src/assets/moments_impact/helene2.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/helene3.jpg -> src/assets/moments_impact/helene3.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/helene3.webp -> src/assets/moments_impact/helene3.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/ora1.jpg -> src/assets/moments_impact/ora1.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/ora1.webp -> src/assets/moments_impact/ora1.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/ora2.jpg -> src/assets/moments_impact/ora2.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/ora2.webp -> src/assets/moments_impact/ora2.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/ora3.jpg -> src/assets/moments_impact/ora3.jpg | jpg | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/ImpactPage.tsx | ImpactPage | ../assets/moments_impact/ora3.webp -> src/assets/moments_impact/ora3.webp | webp | local | picture-source (data-driven) | Possible | Yes (<picture><source>) |
| src/pages/ImpactPage.tsx | ImpactPage | figma:asset/3c1537cde524e7172c827aa2411c2c759ae68ece.png -> src/assets/3c1537cde524e7172c827aa2411c2c759ae68ece.png | png | local | img | Possible | No explicit fallback |
| src/pages/ImpactPage.tsx | ImpactPage | figma:asset/c468599141a487a1168ff53b1f6de665f3b4be9d.png -> src/assets/c468599141a487a1168ff53b1f6de665f3b4be9d.png | png | local | img | Possible | No explicit fallback |
| src/pages/MissionPage.tsx | MissionPage | figma:asset/046ca85659860578eeeab6a45f52700c54c519a3.png -> src/assets/046ca85659860578eeeab6a45f52700c54c519a3.png | png | local | img | Possible | No explicit fallback |
| src/pages/MissionPage.tsx | MissionPage | figma:asset/5463509e242f1244d018bbff5b9c9fc1831a9b2f.png -> src/assets/5463509e242f1244d018bbff5b9c9fc1831a9b2f.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/MissionPage.tsx | MissionPage | figma:asset/56901f1a91f140dcee14c66f977ed2a0bd9120ed.png -> src/assets/56901f1a91f140dcee14c66f977ed2a0bd9120ed.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/MissionPage.tsx | MissionPage | figma:asset/90544aa933b2c117f40fb5271f7b12942198041b.png -> src/assets/90544aa933b2c117f40fb5271f7b12942198041b.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/MissionPage.tsx | MissionPage | figma:asset/c4e1406ca17d5d9941f67714b4ad381639235894.png -> src/assets/c4e1406ca17d5d9941f67714b4ad381639235894.png | png | local | css-background | Possible | No explicit fallback |
| src/pages/MissionPage.tsx | MissionPage | figma:asset/ce0a67a45092b4432ec7c00f4a17cb5a77e95a50.png -> src/assets/ce0a67a45092b4432ec7c00f4a17cb5a77e95a50.png | png | local | img (data-driven) | Possible | No explicit fallback |
| src/pages/StoriesPage.tsx | StoriesPage | figma:asset/b7ea59b58a471ceacde60e41e5e3cd69fe78c66f.png -> src/assets/b7ea59b58a471ceacde60e41e5e3cd69fe78c66f.png | png | local | img | Possible | No explicit fallback |
| src/pages/StoryArticlePage.tsx | StoryArticlePage | https://www.yoursparkpoint.org/og/default.jpg | jpg | external | unknown (data/import-driven) | No | No explicit fallback |
| src/pages/StoryCategoryPage.tsx | StoryCategoryPage | figma:asset/e3f8a2b021eb0d337580338dd10e709a1762494c.png -> src/assets/e3f8a2b021eb0d337580338dd10e709a1762494c.png | png | local | img (data-driven) | No | No explicit fallback |
| src/pages/TrustPage.tsx | TrustPage | figma:asset/5a36f7b11c9d0bf970613a37a28b121b31918d77.png -> src/assets/5a36f7b11c9d0bf970613a37a28b121b31918d77.png | png | local | img | No | No explicit fallback |
| src/pages/TrustPage.tsx | TrustPage | figma:asset/ec17a6fe91f3b0bf97249c7bd911f4723893563c.png -> src/assets/ec17a6fe91f3b0bf97249c7bd911f4723893563c.png | png | local | img | No | No explicit fallback |
