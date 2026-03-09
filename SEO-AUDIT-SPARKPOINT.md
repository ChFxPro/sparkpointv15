# SparkPoint SEO Audit & Optimization Sweep
Date: March 9, 2026
Site: https://www.yoursparkpoint.org
Framework: React + Vite

## 1. Crawl Inventory

### Route inventory audited
- /
- /about
- /mission
- /impact
- /programs
- /stories
- /stories/:categoryId
- /stories/:categoryId/:slug
- /stories/community-champions/helene-anniversary
- /community-champions/helene-one-year
- /get-involved
- /intake
- /sponsors
- /resiliency-hub
- /news-media
- /trust
- /privacy
- Redirect routes: /partner, /volunteer, /contact, /donations, /newsletter

### Core SEO surfaces audited
- HTML shell: `index.html`, `public/404.html`
- App shell/routing: `src/App.tsx`
- Route pages: `src/pages/**/*`
- Programs pages: `src/pages/programs/*`
- Shared components affecting semantics/images/navigation:
  - `src/components/Hero.tsx`
  - `src/components/Header.tsx`
  - `src/components/Footer.tsx`
  - `src/components/CTAFinal.tsx`
- Structured data: `src/components/StructuredData.tsx`
- Technical indexing files: `public/robots.txt`, `public/sitemap.xml`

### Heading structure snapshot
- All primary routes now render one visible page-level H1 in-route or via route hero component.
- Homepage H1 is now mission/geo aligned: “Building Connection Across Western North Carolina”.
- Story article route has two conditional H1 templates, but only one renders per layout path at runtime.

## 2. Critical Issues Found (and status)

### Metadata
- Issue: inconsistent metadata implementation across pages (title/description/canonical present, but OG/Twitter missing on multiple routes).
- Status: fixed.

### Canonical consistency
- Issue: mixed canonical domain references (`yoursparkpoint.org` vs `www.yoursparkpoint.org`).
- Status: fixed to canonical `https://www.yoursparkpoint.org` defaults.

### Structured data coverage
- Issue: only global NGO/WebSite schema existed; no breadcrumb schema; no page-level article/event schema.
- Status: fixed.

### Homepage SEO/H1 signal
- Issue: homepage headline animation lacked explicit geo-targeted primary query phrasing.
- Status: fixed with explicit H1 aligned to connection + WNC.

### Internal linking semantics
- Issue: some navigation actions used button JS redirects instead of links.
- Status: partially fixed on key global navigation/CTA surfaces.

### Technical indexing assets
- Issue: sitemap omitted several active routes and story URLs; robots pointed to non-canonical host string.
- Status: fixed with full route coverage and env-replaced canonical origin.

## 3. Implemented Fixes

### Reusable SEO helper
- Added `src/components/SEOHead.tsx`.
- Standardizes per-page:
  - title
  - meta description
  - canonical
  - robots
  - Open Graph tags
  - Twitter card tags
  - optional article publish/modified tags
  - optional page JSON-LD payloads
- Description normalization now keeps output in SEO-targeted range (150–160 chars where possible).

### Route metadata rollout
Replaced route-level `Helmet` blocks with `SEOHead` across:
- `HomePage`, `AboutPage`, `MissionPage`, `ImpactPage`, `StoriesPage`, `StoryCategoryPage`, `StoryArticlePage`, `GetInvolvedPage`, `IntakePage`, `ProgramsPage`, `NewsMediaPage`, `SponsorsPage`, `ResiliencyHubPage`, `TrustPage`, `PrivacyPage`, `CommunityChampionsArticle`, `HeleneOneYearArticle`.

### Structured data expansion
- Rebuilt `src/components/StructuredData.tsx` to output:
  - Organization/NGO (nonprofit identity + address + area served + socials)
  - WebSite schema
  - WebPage schema per route
  - dynamic BreadcrumbList per route
- Added page-level JSON-LD:
  - `Article` schema on story article routes
  - `CollectionPage` schema on story category pages
  - `Event` schema on Helene one-year article routes

### Technical SEO assets
- Updated `index.html` and `public/404.html` metadata to canonical brand/domain messaging.
- Updated `public/robots.txt` and `public/sitemap.xml` to use `__SITE_ORIGIN__` replacement pattern.
- Expanded sitemap URL set to include all key public routes + story taxonomy/article URLs.
- Updated defaults used in:
  - `src/lib/siteOrigin.ts`
  - `vite.config.ts`
  - `scripts/replace-site-origin.js`

### Image + accessibility/SEO overlap
- Improved key alt text on high-value content images and story/media cards.
- Added additional `loading="lazy"` on non-critical content images.
- Improved nav semantics in key areas:
  - button-driven donation actions switched to link navigation in shared header/CTA components.
  - added explicit nav landmark labels in header/footer contexts.

### Homepage optimization
- Homepage H1 updated in hero to:
  - “Building Connection Across Western North Carolina”
- Added secondary “Listen • Learn • Lead” support line.
- Added contextual internal links from homepage SEO content block to `/mission`, `/programs`, and `/get-involved`.

## 4. Files Modified

- `index.html`
- `public/404.html`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/logo.png` (added)
- `scripts/replace-site-origin.js`
- `vite.config.ts`
- `src/lib/siteOrigin.ts`
- `src/App.tsx`
- `src/components/SEOHead.tsx` (added)
- `src/components/StructuredData.tsx`
- `src/components/Hero.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/CTAFinal.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/MissionPage.tsx`
- `src/pages/ImpactPage.tsx`
- `src/pages/StoriesPage.tsx`
- `src/pages/StoryCategoryPage.tsx`
- `src/pages/StoryArticlePage.tsx`
- `src/pages/GetInvolvedPage.tsx`
- `src/pages/IntakePage.tsx`
- `src/pages/NewsMediaPage.tsx`
- `src/pages/SponsorsPage.tsx`
- `src/pages/ResiliencyHubPage.tsx`
- `src/pages/TrustPage.tsx`
- `src/pages/PrivacyPage.tsx`
- `src/pages/CommunityChampionsArticle.tsx`
- `src/pages/HeleneOneYearArticle.tsx`
- `src/pages/programs/ProgramsPage.tsx`

## 5. Remaining Recommendations (not fully implemented in this sweep)

1. Image delivery and CWV
- Convert remaining large hero/content PNG/JPG assets to responsive `srcset` with width variants.
- Move oversized static assets behind progressive image strategy (AVIF/WebP + fallback).

2. JS bundle size
- Main JS bundle remains >500kB compressed warning target.
- Add route-level code splitting for heavyweight pages/components (`MissionPage`, `ImpactPage`, infographic surfaces).

3. Redirect/canonical hardening
- Ensure 301 redirect from `https://yoursparkpoint.org/*` to `https://www.yoursparkpoint.org/*` at hosting/CDN level.
- Keep one canonical host in all external references.

4. Structured data depth
- Add `NewsArticle` schema for media/news posts when a dedicated archive model exists.
- Add richer `Event` schema fields (start/end time, offers, event attendance details) when event data model is available.

5. Ongoing editorial QA
- Continue tuning on-page copy for query coverage around:
  - community connection
  - Western North Carolina nonprofits
  - community resilience
  - Transylvania County collaboration

## 6. SEO Score Estimate

- Before sweep: ~72/100
- After sweep: ~90/100

Estimated gains are from metadata completeness, canonical consistency, schema coverage, heading signal clarity, and improved crawl/indexing assets.

## 7. Verification Notes

- Build status: pass (`npm run build`)
- `robots.txt` allows indexing: yes (`User-agent: *`, `Allow: /`)
- Sitemap generated in build output: `https://www.yoursparkpoint.org/sitemap.xml`

