# SparkPoint master worklist

**Single source of truth for planned, active, and completed website work.**

## How to use this document

- Update this file at the beginning and end of every substantive work session.
- Keep only actionable work here; link to reports, PRs, and supporting documents instead of duplicating their full contents.
- Work in priority order unless an owner explicitly changes it. Bundle related items into one focused, testable change set.
- Status: `Now`, `Next`, `Blocked`, `Monitoring`, `Done`.
- Priority: `P0` urgent production or data risk; `P1` important security/reliability; `P2` planned improvement; `P3` editorial/polish.
- Each completed item should record the date, verification, and the PR or deployment that delivered it.

## Active bundles

### P0 — Production trust and deployment safeguards

| ID | Status | Work | Owner / next action | Completion evidence |
| --- | --- | --- | --- | --- |
| SEC-001 | Done | Custom domain / TLS on GitHub Pages. | Pages "DNS Check Successful" 2026-07-22 (4 AAAA records added; apex serves HTTPS, www+http redirect to https apex). CNAME-persistence PR #77 deploying. Squarespace shows apex "not connected / no certificate" = EXPECTED (hosted on GitHub Pages, not Squarespace). 2026-07-26: Pages flagged "DNS Check In Progress" again (`https_certificate.state: dns_changed`, per `gh api repos/ChFxPro/sparkpointv15/pages`) — apex kept serving HTTPS throughout (existing cert valid to 2026-09-13), no repo/deploy change involved; correlates with Squarespace-side subdomain activity for TICKET-001 (Squarespace republishes the whole zone on subdomain connect/disconnect). Expected to self-clear; no DNS action taken. | Pages DNS check green; confirm Enforce HTTPS. |
| SEC-002 | Done | Enable effective protection for `main`. | `Protect main (production)` ruleset enabled 2026-07-21 (PRs + passing build required, force-push/deletes blocked). | Ruleset active enforcement confirmed by owner. |
| SEC-003 | Done | Enable GitHub secret scanning and push protection. | Secret scanning + push protection enabled 2026-07-21. | GitHub security settings confirmed enabled by owner. |

### P1 — Public form and platform hardening

| ID | Status | Work | Owner / next action | Completion evidence |
| --- | --- | --- | --- | --- |
| SEC-004 | Next | Harden public intake submissions. | Server-side validation and a 16 KB request limit deployed 2026-07-17; select and configure rate limiting and a bot challenge. | Production rejection check passed; remaining abuse controls verified. |
| SEC-005 | Next | Add browser security headers at the edge. | Choose/configure an edge layer capable of CSP, frame protection, `nosniff`, referrer, and permissions policies; deploy CSP report-only before enforcement. | Live response-header check and no blocked core site features. |
| SEC-006 | Next | Tighten GitHub Actions supply-chain controls. | Deployment workflow actions pinned to reviewed full SHAs on 2026-07-17; restrict allowed actions and configure Dependabot updates. | Actions settings and successful Pages deployment. |
| SEC-008 | In progress | Refresh privacy and retention disclosure. | Public /privacy page redesigned + accurate copy SHIPPED (merged PR #74). Internal data-processing/retention record drafted (project doc SparkPoint-Privacy-and-Data-SEC008.md). Site confirmed tracker-free. REMAINING: owner/counsel confirm retention window (default 24mo) + named data owner (default info@yoursparkpoint.org). | Owner/counsel sign-off. |
| IP-001 | Next | Establish SparkPoint intellectual-property and brand protections. | Asset inventory completed 2026-07-17 in `docs/IP-ASSET-RIGHTS-INVENTORY.md`; next, confirm ownership/permissions for code, copy, photography, logos, and contractor work; decide repository licensing posture; complete trademark clearance/filing strategy and publish reviewed rights notices. | Asset-rights inventory complete; remaining: board/counsel approval and published notices. |

### P2 — Preventive code quality

| ID | Status | Work | Owner / next action | Completion evidence |
| --- | --- | --- | --- | --- |
| SEC-007 | Next | Remove or constrain raw HTML story rendering. | Keep content code-authored, or centralize allowlist sanitization before any CMS/user content is introduced. | Unit coverage or documented trusted-content boundary. |
| OPS-001 | Next | Add automated security checks. | Add dependency audit and a non-secret-leaking scan to CI after Actions policy is hardened. | Required checks run on a PR. |

## Ongoing product work

| ID | Status | Work | Bundle / notes |
| --- | --- | --- | --- |
| EVENT-002 | Done | Add Thrive @ Five: Common Ground Release Party to `/events` and build its dedicated fundraiser page. | Built locally on `codex/thrive-at-five-coffee-release` 2026-07-27; pending PR/deployment. `/events` now features the July 31 fundraiser and retains the Rural Health Convening as the next upcoming event. `/events/thrive-at-five` includes the supplied product photography and label art, exact 50%-of-August-profits language, an August 1 coffee-purchase CTA linking to Pisgah Coffee Roasters, live music/food/friends details, click-to-play privacy-enhanced YouTube embed, Hub vision, partner branding, map/calendar/Facebook links, Event JSON-LD, sitemap and prerender registration. Desktop/mobile browser checks found no overflow or console errors; the purchase section and video interaction were verified. The exact GitHub Pages production build environment (`PUBLIC_BASE=/`) passed, followed by focused prerender validation: 81 pages prerendered, 0 failed; only the repository’s known chunk-size and Node module-type warnings remain. |
| RH-001 | Done | Build the `/rural-health-convening` event portal and Rural Health Field Simulator introduction. | Merged in PR #85 and verified live 2026-07-27 after GitHub Pages deployment run 30297118711. Includes event facts, a temporary Monday.com priority-registration list for the limited 200-seat event, partner hierarchy, simulator journey, ongoing-program framing, event JSON-LD, and static prerender registration. The prior public ticket CTA and QR are intentionally withheld until registration opens. Follow-up 2026-07-28 (PR #93, #94): added Transylvania Regional Hospital as a third sponsor; sponsor logos link to each org's site; corrected sponsor tiering to Summit ($3,500, equal billing — UNC Health Pardee and Transylvania Regional Hospital) vs. Ridgeline ($2,500, visibly smaller — Pisgah Health Foundation), reflected in logo size/order, a new hero credit line, and the SEO description (verified under the 160-char `SEOHead` cap after a reviewer flagged truncation). Verified locally via dev server on desktop and mobile viewports; no console errors. |
| RH-002 | Done | Add Transylvania County Tourism Development Authority as a Highlands ($1,500) sponsor across the convening webpage and official invitation. | Completed locally 2026-07-30 and included in a focused draft PR; review/deployment remain. The supplied transparent Brevard TDA mark now links to Explore Brevard and appears after Summit and Ridgeline sponsors in the hero credit, partnership hierarchy, and Event JSON-LD. Desktop/mobile browser checks confirmed the 120 px → 88 px → 72 px tier hierarchy, proportional 86 × 64 px mobile TDA rendering, no horizontal overflow, and a working simulator anchor. The direct-purchase invitation and email copy now include Highlands support; the purchase URL returned HTTP 200, Vite production compilation passed, and the refreshed one-page PDF was rendered and visually verified at exactly 5 × 7 inches. |
| EVENT-001 | Done | Add a reusable SparkPoint events hub at `/events` and publish the Rural Health Convening as its featured event. | Merged in PR #85 and verified live 2026-07-27 after GitHub Pages deployment run 30297118711. “Where We Gather” is driven by `src/data/events.ts`, automatically separates upcoming/past gatherings, and is integrated into navigation, footer, structured data, and prerender routes. |
| EDIT-001 | Next | Complete editorial QA for Programs content. | Group with program-content updates only. |
| EDIT-002 | Next | Curate fuller News/Media archive. | Group releases, media kits, and News/Media card updates. |
| UX-001 | Next | Polish sponsor and resilience hub content/assets. | Separate content/design bundle. |
| PERF-001 | In progress | Mobile performance (baseline Lighthouse 77). | Merged: PR #75 (compress textures + defer homepage infographic) and PR #76 (self-host Manrope via @fontsource, removing render-blocking Google Fonts + more image squeeze). Prod 77->80 after #75; #76 now live (expect higher). NEXT: re-run production PageSpeed; Tier 3 = Cloudflare edge (cache lifetimes + security headers, pairs with SEC-005) for 90+. Follow-ups: CLS 0->0.021 recheck, a11y contrast 96->100. | Re-run PageSpeed; green after Tier 3. |
| STORY-001 | Done | Rebuild /stories as the "Story Hub" (featured, filter+search two-column feed with type badges, live impact counter from impact2025.ts, Behind the Stories, Echoes strand, new Programs category + Community Connectors story). | Merged and deployed. | Story Hub live at /stories; legacy stacked layout replaced. |
| STORY-002 | Deferred | Community "where stories come from" map for the Story Hub. | Use a REAL area basemap (accurate WNC/county map) + a full CODEX visual-element creation run. Pins are community-level aggregate counts only, never tied to a specific story (anonymity). | Polished map section shipped into the Story Hub. |
| STORY-003 | Done | Behind the Stories reimagined as a folder-driven cinematic photo-shuffle reel (Embla) + Echoes cover-art fix. | Merged PR #71 (2026-07-22). Drop images in public/assets/behind_story to update (natural filename sort). | Shipped on /stories. |
| TICKET-001 | In progress | Branded ticket checkout: `secure.yoursparkpoint.org` set as the Squarespace commerce site's primary domain (store + checkout on-brand); main site adds `/tickets` and `/tickets/:slug` vanity redirects. | Slug→URL map in `src/data/ticketLinks.ts`; first event `wncrrhc` (WNC Regional Rural Health Convening). 2026-07-30 follow-up completed locally and included in a focused draft PR: added the print-friendly `/rh_tickets` alias in the React router and prerender redirect map, targeting the direct Rural Health Convening purchase page. Vite production compilation and `git diff --check` passed; a real-browser check reached the exact secure purchase URL with the correct product title and no console errors. PR review/deployment remain. Squarespace-side DNS/SSL done by Jeff. REMAINING (per `.storyhub/branded-ticket-checkout-HANDOFF.md`): disconnect leftover `tickets.yoursparkpoint.org` subdomain — still live/resolving as of 2026-07-26, not yet cleaned up; repoint `/donations` and `/newsletter` (`src/App.tsx`) at `secure.yoursparkpoint.org/...` — still hitting raw `cowbell-primrose-tet2.squarespace.com` as of 2026-07-26. | `/tickets`, `/tickets/wncrrhc`, and `/rh_tickets` resolve to secure.yoursparkpoint.org. |

## Reference material

- [Security audit report](security_best_practices_report.md) — 2026-07-17 baseline and evidence.
- `AGENTS.md` — repository architecture and working rules. It points here for the live work queue.

## Change log

| Date | Update |
| --- | --- |
| 2026-07-30 | Added the local `/rh_tickets` short URL for the Rural Health Convening invitation. It is wired as both a React external redirect and a QR-safe static prerender redirect to the exact secure purchase page; Vite compilation, diff checks, and real-browser destination verification passed. Draft PR review and deployment remain. |
| 2026-07-30 | Completed RH-002 locally: added Transylvania County Tourism Development Authority as the Highlands ($1,500) convening sponsor across the webpage, Event structured data, official 5 × 7 invitation, and email copy. Verified the sponsor hierarchy on desktop/mobile, the live purchase URL, Vite production compilation, and the rendered PDF; PR/deployment remain. |
| 2026-07-27 | EVENT-002 built locally on `codex/thrive-at-five-coffee-release`: Thrive @ Five is now the featured gathering on `/events`, with a dedicated Common Ground Resilience Roast fundraiser page at `/events/thrive-at-five`, including an August 1 purchase CTA for the coffee; PR/deployment remain. |
| 2026-07-27 | PR #85 merged and deployed: `/events` and `/rural-health-convening` are live. Production verification confirmed HTTP 200 responses, correct priority-list links and 200-seat language, the Events navigation placement, the simulator section, and no relevant browser console errors. |
| 2026-07-21 | SEC-002 closed: `Protect main (production)` branch ruleset enabled (required PRs + build check, force-push/deletions blocked). |
| 2026-07-21 | SEC-003 closed: GitHub secret scanning and push protection enabled. |
| 2026-07-17 | Created as the canonical worklist; seeded with the security-audit remediation bundles and established project follow-ons. |
| 2026-07-17 | Deployed intake validation and a request-size limit; an invalid production submission was rejected with a 400 response before any stored or emailed side effect. |
| 2026-07-17 | Pinned every existing GitHub-owned action in the Pages deployment workflow to a reviewed full commit SHA, with release-version comments. GitHub Actions allowlist, Dependabot configuration, and a successful deployment remain required to close SEC-006. |
| 2026-07-21 | Story Hub (STORY-001) merged and deployed: /stories rebuilt as a featured + filter/search two-column feed with type badges, a live impact counter (impact2025.ts), Behind the Stories, an Echoes series strand, and a new Programs category holding the Community Connectors story. Follow-ons opened: STORY-002 (community map, deferred) and STORY-003 (Behind the Stories redesign). |
| 2026-07-22 | Shipped: Story Hub reel (#71), Privacy redesign (#74, SEC-008 page half), Perf Tier 1+2 (#75) and self-host fonts + image squeeze (#76). SEC-001 closed (AAAA + Pages DNS check green); CNAME persistence PR #77 deploying. SEC-002/SEC-003 confirmed enabled. |
| 2026-07-22 | Branded ticket checkout: `secure.yoursparkpoint.org` is the Squarespace commerce site's primary domain, so store + checkout are branded (`secure.yoursparkpoint.org/checkout`). Main site adds `/tickets` + `/tickets/:slug` vanity redirects (slug→URL map in `src/data/ticketLinks.ts`). Tickets sold as Squarespace Service products. Subdomain/DNS/SSL done in Squarespace by Jeff. |
| 2026-07-26 | GitHub Pages custom domain flagged "DNS Check In Progress" again after being fully green since 2026-07-22/23. `gh api repos/ChFxPro/sparkpointv15/pages` showed `https_certificate.state: "dns_changed"` ("Detected a change to DNS settings. Requesting a new certificate.") — a benign automatic recheck, not an outage: apex kept serving `https://yoursparkpoint.org` at 200 with the prior cert (valid to 2026-09-13) throughout. No repo/workflow changes correlate (git log clean since `fa8f9bf`). Most likely trigger: Squarespace-side domain-panel activity tied to TICKET-001 (`secure.yoursparkpoint.org` connect + still-pending `tickets.yoursparkpoint.org` disconnect) — Squarespace republishes the full DNS zone on subdomain connect/disconnect, which GitHub picks up as a change on the apex/www records even though TICKET-001's subdomain is otherwise isolated from the apex A records. No DNS/Pages settings changed in response; expected to self-clear (GitHub SLA up to 24h). If still stuck, the documented fallback is Settings → Pages → remove custom domain → save → re-add `yoursparkpoint.org` → save (see `DNS-SSL-DIAGNOSIS-SPARKPOINT.md`). |
