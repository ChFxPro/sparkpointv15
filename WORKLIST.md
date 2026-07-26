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
| SEC-001 | Done | Custom domain / TLS on GitHub Pages. | Pages "DNS Check Successful" 2026-07-22 (4 AAAA records added; apex serves HTTPS, www+http redirect to https apex). CNAME-persistence PR #77 deploying. Squarespace shows apex "not connected / no certificate" = EXPECTED (hosted on GitHub Pages, not Squarespace). | Pages DNS check green; confirm Enforce HTTPS. |
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

### P1 — Dependency & framework upgrades

| ID | Status | Work | Owner / next action | Completion evidence |
| --- | --- | --- | --- | --- |
| DEP-001 | Next | Upgrade React `18.3.1` → `19.2.7+` (prerequisite for DEP-003). | Confirmed blocker (verified 2026-07-26 by installing Dependabot PR #82 in an isolated worktree): `npm install` fails with `peer react@">=19.2.7" from react-router@8.3.0`; repo pins `react`/`react-dom` at `^18.3.1`. Audit `src/` for React 19 breaking changes (removed legacy APIs, ref/JSX runtime changes); bump `react`+`react-dom` together; full regression pass. Existing Radix UI / Floating UI dependencies already declare wide-enough peer ranges (`>=16.8.0`) so they aren't expected to block this. | Clean `npm install` + `npx vite build` on React 19; every page/route manually spot-checked in-browser. |
| DEP-002 | Next | Bump CI/build Node.js to `>=22.22` (prerequisite for DEP-003). | react-router `8.0.0`'s changelog requires Node `>=22.22.0`; `.github/workflows/deploy.yml` currently provisions `node-version: 20` via `actions/setup-node`. Bump that (and any documented local dev Node version) to 22, then confirm the Pages deploy workflow still installs/builds/prerenders successfully end-to-end. | Pages deploy workflow run green on Node 22. |
| DEP-003 | Blocked | Merge react-router `7.15.1` → `8.3.0` (Dependabot PR #82). | Blocked on DEP-001 + DEP-002. Once both land, rebase/recreate PR #82 (`@dependabot recreate`), reinstall, and smoke-test every route — pay particular attention to v8's default trailing-slash behavior (gated behind a `future` flag pre-v8), given the site's clean-URL prerender/SEO setup. Fixes a real high-severity react-router CVE (open redirect in `<Link>`/`useNavigate`, plus SSR/RSC-mode issues not applicable to this client-only SPA); verified 2026-07-26 that no `navigate()`/`Link` target in this codebase takes user-controlled input, so current exploitability is low — important, not urgent. | `npm install`/build clean on `8.3.0`; all routes verified in-browser; `npm audit` no longer flags react-router. |

### P2 — Preventive code quality

| ID | Status | Work | Owner / next action | Completion evidence |
| --- | --- | --- | --- | --- |
| SEC-007 | Next | Remove or constrain raw HTML story rendering. | Keep content code-authored, or centralize allowlist sanitization before any CMS/user content is introduced. | Unit coverage or documented trusted-content boundary. |
| OPS-001 | Next | Add automated security checks. | Add dependency audit and a non-secret-leaking scan to CI after Actions policy is hardened. | Required checks run on a PR. |

## Ongoing product work

| ID | Status | Work | Bundle / notes |
| --- | --- | --- | --- |
| EDIT-001 | Next | Complete editorial QA for Programs content. | Group with program-content updates only. |
| EDIT-002 | Next | Curate fuller News/Media archive. | Group releases, media kits, and News/Media card updates. |
| UX-001 | Next | Polish sponsor and resilience hub content/assets. | Separate content/design bundle. |
| PERF-001 | In progress | Mobile performance (baseline Lighthouse 77). | Merged: PR #75 (compress textures + defer homepage infographic) and PR #76 (self-host Manrope via @fontsource, removing render-blocking Google Fonts + more image squeeze). Prod 77->80 after #75; #76 now live (expect higher). NEXT: re-run production PageSpeed; Tier 3 = Cloudflare edge (cache lifetimes + security headers, pairs with SEC-005) for 90+. Follow-ups: CLS 0->0.021 recheck, a11y contrast 96->100. | Re-run PageSpeed; green after Tier 3. |
| STORY-001 | Done | Rebuild /stories as the "Story Hub" (featured, filter+search two-column feed with type badges, live impact counter from impact2025.ts, Behind the Stories, Echoes strand, new Programs category + Community Connectors story). | Merged and deployed. | Story Hub live at /stories; legacy stacked layout replaced. |
| STORY-002 | Deferred | Community "where stories come from" map for the Story Hub. | Use a REAL area basemap (accurate WNC/county map) + a full CODEX visual-element creation run. Pins are community-level aggregate counts only, never tied to a specific story (anonymity). | Polished map section shipped into the Story Hub. |
| STORY-003 | Done | Behind the Stories reimagined as a folder-driven cinematic photo-shuffle reel (Embla) + Echoes cover-art fix. | Merged PR #71 (2026-07-22). Drop images in public/assets/behind_story to update (natural filename sort). | Shipped on /stories. |
| TICKET-001 | In progress | Branded ticket checkout: `secure.yoursparkpoint.org` set as the Squarespace commerce site's primary domain (store + checkout on-brand); main site adds `/tickets` and `/tickets/:slug` vanity redirects. | Slug→URL map in `src/data/ticketLinks.ts`; first event `wncrrhc` (WNC Regional Rural Health Convening). Squarespace-side DNS/SSL done by Jeff; code PR pending merge. | `/tickets` and `/tickets/wncrrhc` resolve to secure.yoursparkpoint.org. |

## Reference material

- [Security audit report](security_best_practices_report.md) — 2026-07-17 baseline and evidence.
- `AGENTS.md` — repository architecture and working rules. It points here for the live work queue.

## Change log

| Date | Update |
| --- | --- |
| 2026-07-21 | SEC-002 closed: `Protect main (production)` branch ruleset enabled (required PRs + build check, force-push/deletions blocked). |
| 2026-07-21 | SEC-003 closed: GitHub secret scanning and push protection enabled. |
| 2026-07-17 | Created as the canonical worklist; seeded with the security-audit remediation bundles and established project follow-ons. |
| 2026-07-17 | Deployed intake validation and a request-size limit; an invalid production submission was rejected with a 400 response before any stored or emailed side effect. |
| 2026-07-17 | Pinned every existing GitHub-owned action in the Pages deployment workflow to a reviewed full commit SHA, with release-version comments. GitHub Actions allowlist, Dependabot configuration, and a successful deployment remain required to close SEC-006. |
| 2026-07-21 | Story Hub (STORY-001) merged and deployed: /stories rebuilt as a featured + filter/search two-column feed with type badges, a live impact counter (impact2025.ts), Behind the Stories, an Echoes series strand, and a new Programs category holding the Community Connectors story. Follow-ons opened: STORY-002 (community map, deferred) and STORY-003 (Behind the Stories redesign). |
| 2026-07-22 | Shipped: Story Hub reel (#71), Privacy redesign (#74, SEC-008 page half), Perf Tier 1+2 (#75) and self-host fonts + image squeeze (#76). SEC-001 closed (AAAA + Pages DNS check green); CNAME persistence PR #77 deploying. SEC-002/SEC-003 confirmed enabled. |
| 2026-07-22 | Branded ticket checkout: `secure.yoursparkpoint.org` is the Squarespace commerce site's primary domain, so store + checkout are branded (`secure.yoursparkpoint.org/checkout`). Main site adds `/tickets` + `/tickets/:slug` vanity redirects (slug→URL map in `src/data/ticketLinks.ts`). Tickets sold as Squarespace Service products. Subdomain/DNS/SSL done in Squarespace by Jeff. |
| 2026-07-26 | Reviewed both open Dependabot PRs before merging. PR #72 (`sharp` 0.34.5→0.35.0): verified clean in an isolated worktree (install, full build, and a direct sharp smoke test all pass; fixes real high-severity libvips CVEs; no removed/renamed sharp APIs used in `scripts/`) — merged by owner. PR #82 (`react-router` 7.15.1→8.3.0): verified it currently breaks the build — `npm install` fails on a React peer-dependency conflict (needs React `>=19.2.7`, repo has `18.3.1`) and react-router 8 requires Node `>=22.22.0` vs CI's Node 20. Left open; opened DEP-001/DEP-002/DEP-003 to land the React 19 + Node 22 prerequisites and then complete the react-router 8 upgrade safely. |
