# SparkPoint Canonical + Internal Link Audit
Date: March 9, 2026
Preferred origin: https://www.yoursparkpoint.org

## Scope
- `src/components/SEOHead.tsx`
- `src/components/StructuredData.tsx`
- `src/pages/*`
- `src/pages/programs/*`
- `src/App.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/ExternalRedirect.tsx`
- `public/robots.txt`
- `public/sitemap.xml`
- `index.html`
- `public/404.html`

## Canonical Inventory (Rendered)

### Self-canonical routes
- `/` -> `https://www.yoursparkpoint.org/`
- `/about` -> `https://www.yoursparkpoint.org/about`
- `/mission` -> `https://www.yoursparkpoint.org/mission`
- `/impact` -> `https://www.yoursparkpoint.org/impact`
- `/programs` -> `https://www.yoursparkpoint.org/programs`
- `/stories` -> `https://www.yoursparkpoint.org/stories`
- `/stories/:categoryId` -> `https://www.yoursparkpoint.org/stories/:categoryId`
- `/stories/:categoryId/:slug` -> `https://www.yoursparkpoint.org/stories/:categoryId/:slug`
- `/stories/community-champions/helene-anniversary` -> `https://www.yoursparkpoint.org/stories/community-champions/helene-anniversary`
- `/get-involved` -> `https://www.yoursparkpoint.org/get-involved`
- `/intake` (including `?intent=*` variants) -> `https://www.yoursparkpoint.org/intake`
- `/sponsors` -> `https://www.yoursparkpoint.org/sponsors`
- `/resiliency-hub` -> `https://www.yoursparkpoint.org/resiliency-hub`
- `/news-media` -> `https://www.yoursparkpoint.org/news-media`
- `/trust` -> `https://www.yoursparkpoint.org/trust`
- `/privacy` -> `https://www.yoursparkpoint.org/privacy`

### Intentional canonicalization (true duplicate)
- `/community-champions/helene-one-year`
  - Canonical target: `https://www.yoursparkpoint.org/stories/community-champions/helene-anniversary`
  - Rationale: legacy/alias route serving duplicate content.
  - Additional handling: page set to `noindex`.

## Crawl/Indexing Issues Found

### 1. Canonicals: Non-Indexable Canonical (root cause)
- Static canonical tags in `index.html` and `public/404.html` could conflict with route-level canonical output in SPA rendering.
- Duplicate canonical behavior can produce inconsistent canonical evaluation during JS and non-JS crawls.

### 2. Canonicals: Canonicalised (root cause)
- Duplicate Helene route variants existed without explicit canonical intent.
- Alias route usage (`/contact`) in internal CTA flows increased unnecessary canonicalized URL variants.

### 3. Links: Pages Without Internal Outlinks (root cause)
- Thin/legacy pages and redirect surfaces had weak or missing explicit in-content internal anchors.
- Some CTA flows used JS navigation only (button `onClick`) instead of crawlable anchor links.

## Fixes Implemented

### Canonical fixes
- Removed static canonical tags from:
  - `index.html`
  - `public/404.html`
- Added canonical override support in SEO helper:
  - `src/components/SEOHead.tsx` (`canonicalPath` prop)
- Applied intentional canonicalization + `noindex` to duplicate legacy page:
  - `src/pages/CommunityChampionsArticle.tsx`

### Canonical target integrity checks
- Canonical targets normalized to `https://www.yoursparkpoint.org`.
- Canonical targets are not blocked by `robots.txt`.
- Canonical targets are not `noindex` (except legacy page itself; canonical target remains indexable).
- No canonical targets point to staging/dev domains.

### Internal outlink fixes
- Added meaningful internal links to low-link pages:
  - `src/pages/CommunityChampionsArticle.tsx`
  - `src/pages/HeleneOneYearArticle.tsx`
  - `src/pages/ResiliencyHubPage.tsx`
- Replaced alias/internal JS CTA targets with canonical internal anchors:
  - `src/pages/StoriesPage.tsx` (`/intake?intent=contact`)
  - `src/pages/StoryArticlePage.tsx` (`/intake?intent=contact` + category link via anchor)
  - `src/pages/TrustPage.tsx` (`/intake?intent=contact`)
- Improved redirect helper fallback with crawlable links:
  - `src/components/ExternalRedirect.tsx`

## Remaining Edge Cases / Human Review
1. Confirm hosting-level 301 from `https://yoursparkpoint.org/*` -> `https://www.yoursparkpoint.org/*`.
2. Confirm external SEO crawler runs in JS-rendered mode for SPA route metadata validation.
3. Decide long-term whether legacy alias routes (`/contact`, `/partner`, `/volunteer`, `/community-champions/helene-one-year`) should remain public or be handled by server redirects.

## Validation Summary
- Exactly one canonical source remains in app rendering (`SEOHead`), with static-shell canonical duplicates removed.
- Preferred canonical origin is normalized to `https://www.yoursparkpoint.org`.
- Important pages have crawlable internal outlinks via anchor tags.
- Production build: pass (`npm run build`).
- Known existing warning: large JS chunk size warning (>500kB) remains.
