# SparkPoint security audit

**Date:** 2026-07-17  
**Scope:** Production site, current `main` branch (`6558af7`), GitHub repository settings, GitHub Pages, Supabase project and Edge Functions. This was a read-only audit; no production settings, data, code, or credentials were changed.

## Executive summary

Two urgent production issues need attention:

1. The canonical `www.yoursparkpoint.org` hostname fails TLS certificate validation. The apex domain works, but the certificate configured for GitHub Pages only lists the apex hostname.
2. The public repository has no effective protection for `main`, so any account with push access can change the live site directly. The intended `Protect main (production)` ruleset exists but its enforcement is disabled.

The good news: current `main` has **zero known dependency vulnerabilities** according to `npm audit`, GitHub Dependabot has no open alerts, GitHub Pages enforces HTTPS for the apex domain, and direct database reads of intake submissions are denied by RLS. No committed private keys or common credential patterns were found in the working tree or history scan.

## Findings

### SEC-001 — Critical — Canonical `www` hostname has an invalid TLS certificate

- **Location:** `https://www.yoursparkpoint.org/` (runtime) and [vite.config.mts](vite.config.mts) lines 6–12.
- **Evidence:** A live HTTPS request to `www.yoursparkpoint.org` fails hostname verification: the presented certificate does not include `www.yoursparkpoint.org`. GitHub Pages reports an approved certificate only for `yoursparkpoint.org`; the site configuration uses `https://www.yoursparkpoint.org` as its canonical origin.
- **Impact:** Visitors, press links, social previews, and search engines that use the canonical `www` address can encounter a certificate warning or hard failure. Users should never be asked to bypass this warning.
- **Fix:** In GitHub Pages, configure the custom domain and certificate to cover **both** `yoursparkpoint.org` and `www.yoursparkpoint.org`, then configure a single canonical redirect after both hostnames validate. Confirm DNS matches GitHub Pages guidance and re-check both hostnames.
- **Mitigation:** Until corrected, use the working apex hostname in outward-facing links where possible; do not disable certificate checks.
- **False-positive notes:** The apex hostname passed HTTPS validation. The `www` failure was directly observed from the live site.

### SEC-002 — High — `main` branch protections are disabled

- **Location:** GitHub ruleset `Protect main (production)` for `refs/heads/main`.
- **Evidence:** GitHub reports the ruleset as `enforcement: disabled`; the branch-protection endpoint also reports that `main` is not protected. The deployment workflow publishes every push to `main` ([.github/workflows/deploy.yml](.github/workflows/deploy.yml) lines 3–5 and 46–58).
- **Impact:** A compromised administrator or mistaken direct push can immediately alter the public website and its deployment workflow without review or a passing build gate.
- **Fix:** Enable the existing ruleset. Require pull requests, at least one independent approval when staffing permits, resolved review conversations, and the production build as a required check. Block force pushes and deletions; prevent administrators from bypassing except for an explicitly documented emergency path.
- **Mitigation:** Keep the collaborator list minimal and use a separate emergency procedure while the ruleset is being enabled.
- **False-positive notes:** The repository currently has one direct collaborator with admin access, which limits exposure but does not replace branch protection.

### SEC-003 — High — GitHub secret scanning and push protection are disabled on a public repository

- **Location:** GitHub repository security settings for `ChFxPro/sparkpointv15`.
- **Evidence:** GitHub reports `secret_scanning: disabled` and `secret_scanning_push_protection: disabled`. The repository is public and contains integrations that rely on server-side Supabase and Monday credentials ([supabase/functions/make-server-393f2b0a/index.ts](supabase/functions/make-server-393f2b0a/index.ts) lines 22–37 and 142–157).
- **Impact:** An accidental commit of a service-role, Monday, or other operational secret could become public before anyone notices.
- **Fix:** Enable GitHub secret scanning, push protection, and validity checks. Add a short incident procedure: revoke/rotate any credential that is blocked or found in history, then document the rotation.
- **Mitigation:** Continue keeping secrets in Supabase project secrets, never in client variables or GitHub Actions variables.
- **False-positive notes:** No current-tree private key or common credential pattern was found. This finding is about prevention and detection, not a confirmed leak.

### SEC-004 — Medium — Public intake endpoint has no visible abuse protection or bounded validation

- **Location:** [supabase/functions/make-server-393f2b0a/index.ts](supabase/functions/make-server-393f2b0a/index.ts) lines 164–245; [src/components/GuidedIntakeForm.tsx](src/components/GuidedIntakeForm.tsx) lines 82–93.
- **Evidence:** Any site visitor can submit the public form using the publishable/legacy anon key. The handler checks only presence and intent, then writes a submission and asynchronously pushes data to Monday. There is no visible CAPTCHA/Turnstile, rate limiter, request-size cap, email-format validation, or field-length caps in the deployed function.
- **Impact:** Automated submissions can create spam records, consume service capacity, and pollute Monday. Large or malformed payloads may also create avoidable operational risk.
- **Fix:** Add server-side schema validation with strict field lengths and allowed values; reject unexpected fields; add an edge-compatible rate limit and bot challenge (for example, Turnstile verification); and add monitoring/alerting for spikes. Keep the endpoint public only because public intake is a deliberate product requirement.
- **Mitigation:** Temporarily monitor submission volume and Monday board activity closely. CORS is not an access-control boundary, so it is not a mitigation for scripted requests.
- **False-positive notes:** The live function has `verify_jwt: true`, but the public client intentionally supplies the public key. That blocks unauthenticated calls, not abuse by arbitrary visitors who can obtain the public key from the website.

### SEC-005 — Medium — Browser security headers are absent on the live Pages response

- **Location:** `https://yoursparkpoint.org/` (runtime); [index.html](index.html) lines 1–76.
- **Evidence:** The apex response has no observed `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, or `Permissions-Policy` header. No CSP meta policy exists in the app shell.
- **Impact:** The site has reduced defense-in-depth against future XSS, clickjacking, MIME confusion, and unnecessary referrer leakage. GitHub Pages does not provide a repository-level way to set all required response headers.
- **Fix:** Place the site behind an edge/CDN that can set response headers (for example, Cloudflare) and deploy a tested policy. Start CSP in report-only mode, account for the Google Fonts stylesheet and the small SPA redirect script, then enforce it. Set clickjacking protection, `nosniff`, a conservative referrer policy, and a minimal permissions policy.
- **Mitigation:** Keep all remote scripts out of the app; current HTML only fetches Google Fonts. Do not weaken CSP with broad `unsafe-inline` or `unsafe-eval` as a shortcut.
- **False-positive notes:** This was verified in the live apex response, not merely inferred from missing repository configuration.

### SEC-006 — Medium — GitHub Actions supply-chain controls are permissive

- **Location:** [.github/workflows/deploy.yml](.github/workflows/deploy.yml) lines 19–21 and 50–58; GitHub Actions settings.
- **Evidence:** Repository Actions settings allow all actions and workflows, and SHA pinning is not required. The Pages workflow uses floating major-version tags such as `actions/checkout@v4` and `actions/deploy-pages@v4`.
- **Impact:** A compromised or unexpectedly changed third-party action release could affect the production deployment pipeline.
- **Fix:** Restrict allowed Actions to GitHub-owned actions and an approved allowlist; pin production workflow actions to reviewed full commit SHAs and maintain them with Dependabot. Preserve the workflow’s existing least-privilege token permissions.
- **Mitigation:** The current workflow correctly uses `npm ci`, scopes permissions to Pages deployment, and defaults workflow permissions to read-only.
- **False-positive notes:** Major tags are common and convenient, but are mutable references rather than immutable supply-chain pins.

### SEC-007 — Low — Published stories use a raw HTML rendering escape hatch

- **Location:** [src/pages/StoryArticlePage.tsx](src/pages/StoryArticlePage.tsx) lines 145 and 252; [src/data/stories.ts](src/data/stories.ts) lines 15–18.
- **Evidence:** Article HTML is rendered with `dangerouslySetInnerHTML`. The current source is static, version-controlled content rather than visitor-provided content.
- **Impact:** There is no demonstrated current XSS path. However, a future move to CMS, form, or external story content could create stored XSS unless sanitation is introduced first.
- **Fix:** Keep article content as structured React/MDX data where practical, or centralize allowlist-based HTML sanitation before rendering any non-code-authored content.
- **Mitigation:** Add a review rule that forbids untrusted content from reaching this component.
- **False-positive notes:** This is a preventive finding; the audit did not find an attacker-controlled input path today.

### SEC-008 — Low — Privacy disclosure needs a data-handling refresh

- **Location:** [src/pages/PrivacyPage.tsx](src/pages/PrivacyPage.tsx) lines 57–96; [supabase/functions/make-server-393f2b0a/index.ts](supabase/functions/make-server-393f2b0a/index.ts) lines 164–236.
- **Evidence:** Intake records can include phone numbers, free-text messages, organization and partnership details, source path, availability, and volunteer interests; the service also transfers selected details to Monday. The policy is broadly reassuring but does not identify these processors, retention periods, deletion/access-request process, or this full field set.
- **Impact:** This can create transparency and compliance risk for an organization collecting personal information. Legal obligations depend on where visitors live and the organization’s activities.
- **Fix:** Have counsel or the appropriate privacy owner review and update the policy with the data categories, purposes, processors (Supabase and Monday), retention/deletion practices, security contact, and individual-rights request process. Align the actual access list to the policy’s “authorized volunteers” statement.
- **Mitigation:** Until updated, minimize requested fields and restrict access in Supabase and Monday.
- **False-positive notes:** This is not a legal determination; it is a code-to-policy consistency observation.

## Verified controls and non-findings

- `npm audit --package-lock-only` against current `main` reported **0 vulnerabilities**. GitHub Dependabot has **0 open alerts** and security updates enabled.
- GitHub Pages is deployed from the workflow, HTTPS is enforced for `yoursparkpoint.org`, and the latest production deployment completed successfully.
- The Supabase project is active and healthy. `intake_submissions` has RLS enabled; explicit policies deny `anon` and `authenticated` roles `SELECT`, `UPDATE`, and `DELETE`. This audit did **not** retrieve submission rows.
- The live form Edge Function requires JWT verification and keeps its service-role credential server-side. Its CORS allowlist is appropriately restrictive for browser use, but does not substitute for anti-abuse controls.
- The Supabase advisor flags broad table grants and a `SECURITY DEFINER` event-trigger helper. The reviewed helper is an event-trigger function that enables RLS for new public tables; it is not a demonstrated data-access path. Keep it under review and remove unnecessary grants where feasible.
- No tracked `.env`, private-key, or common credential pattern was found in the code/history scan. The public Supabase anon key was intentionally excluded from this category; it is public by design and is not a secret.

## Recommended order of work

1. Fix and verify TLS for `www.yoursparkpoint.org`.
2. Enable the existing `main` ruleset and GitHub secret scanning/push protection.
3. Add form abuse controls and server-side validation before the next campaign drives significant traffic.
4. Add edge-managed security headers.
5. Tighten Actions policy and pin workflow actions.
6. Refresh the privacy statement and establish data retention/access procedures.

## Audit limitations

This audit did not change settings, inspect form-submission contents, test destructive endpoints, enumerate external SaaS user access in Monday, or perform a legal-compliance certification. GitHub code scanning is not configured, and GitHub webhook settings could not be inspected with the available token scope.
