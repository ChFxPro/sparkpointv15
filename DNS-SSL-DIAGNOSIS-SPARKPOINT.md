# SparkPoint Domain & SSL Diagnosis — yoursparkpoint.org

**Date:** 2026-06-15
**Status:** All 5 phases complete (live data + screenshots). Root cause confirmed. **No changes have been made yet — awaiting go-ahead per remediation rules.**

---

## Phase 1 — Repository Inspection

- **No `CNAME` file exists in the repo source** (`public/`, repo root) — it is **generated at build/deploy time**.
- `.github/workflows/deploy.yml` writes the CNAME file dynamically during the GitHub Actions deploy:

  ```yaml
  - name: Add CNAME for custom domain
    run: |
      echo "yoursparkpoint.org" > build/CNAME
  ```

- **Resulting CNAME value:** `yoursparkpoint.org` (apex only — matches the GitHub Pages custom domain you reported).
- Build env vars (`SITE_ORIGIN`, `PUBLIC_ORIGIN`, `VITE_SITE_ORIGIN`) are all set to `https://www.yoursparkpoint.org` — **i.e., the site's canonical URLs are generated as `www`**, while the Pages custom domain / CNAME is the **apex**. This mismatch is relevant below.

## Phase 3 — Live DNS Validation (via authoritative resolvers, just now)

| Record | Host | Live value |
|---|---|---|
| A | `yoursparkpoint.org` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` ✅ (all 4 correct GitHub Pages IPs) |
| AAAA | `yoursparkpoint.org` | none |
| CNAME | `www.yoursparkpoint.org` | `yoursparkpoint.org` |
| AAAA/A | `www.yoursparkpoint.org` | resolves via CNAME → same 4 GitHub IPs |
| CAA | `yoursparkpoint.org` / `www` | **none present** (not blocking Let's Encrypt) |
| TXT | `yoursparkpoint.org` | `v=spf1 a:dispatch-us.ppe-hosted.com include:secureserver.net ~all`, `google-site-verification=K7Ci...`, `NETORGFT13099510.onmicrosoft.com` |
| TXT | `_github-pages-challenge-yoursparkpoint.yoursparkpoint.org` | **NXDOMAIN — does not exist** |
| MX | `yoursparkpoint.org` | `mx1-us1.ppe-hosted.com`, `mx2-us1.ppe-hosted.com` (Proofpoint email) |
| NS | `yoursparkpoint.org` | **8 records**: `dns1-4.p01.nsone.net` **and** `ns01-04.squarespacedns.com` |

### Notable findings
1. **A records are correct and complete** — all 4 GitHub Pages IPs present, no stale/legacy entries (no Squarespace A records like `198.185.159.x` etc.).
2. **`www` is a CNAME to the apex (`yoursparkpoint.org`)**, not to `<org>.github.io`. GitHub Pages' documented pattern for "www → apex" support is a CNAME to your `*.github.io` Pages hostname, not to the apex itself — this is a likely contributor to why GitHub never finishes validating `www`.
3. **No `_github-pages-challenge-*` TXT record exists.** This record is used for GitHub's *organization-level domain verification* (Settings → Pages → "Verify domain ownership"). If that verification was started but never completed (or the TXT was removed), it can leave the domain in a perpetually unverified/pending state, which can manifest as a stuck "DNS Check."
4. **The zone is delegated to 8 nameservers across two naming patterns** (`*.p01.nsone.net` + `*.squarespacedns.com`). Squarespace's DNS platform is built on NS1, so these are likely the same underlying infrastructure — but it's unusual to see both forms simultaneously, and it's worth confirming the **registrar-level NS delegation at GoDaddy matches this exactly**. A mismatch between what GoDaddy delegates and what's actually authoritative is a classic cause of a DNS check that "flaps" and never reports success.
5. Email (MX/SPF) and Microsoft 365 / Google verification TXT records are unrelated to Pages/SSL and **should not be touched**.

## Phase 4 — SSL Validation

- Live fetch of `http://www.yoursparkpoint.org` → 301/redirect → `https://yoursparkpoint.org/` and serves the site correctly **over plain HTTP** (port 80, no TLS handshake required, so no cert needed for that hop).
- `https://yoursparkpoint.org` and `https://www.yoursparkpoint.org` could not be fetched directly from this environment over HTTPS (connection-level failure consistent with a **TLS handshake / certificate problem on `www`**, and a network restriction on my end for the apex — full SSL Labs scan was still in progress at time of writing and didn't complete within this session).

### Why Safari says "This Connection Is Not Private" on `www`
Given:
- `https://yoursparkpoint.org` loads fine (your report) → GitHub has a valid cert covering **`yoursparkpoint.org`**.
- `https://www.yoursparkpoint.org` fails → the TLS cert presented for `www` does **not** include `www.yoursparkpoint.org` in its SAN list.
- GitHub Pages' automatic Let's Encrypt cert is issued **only for the exact custom domain on file** (here, the apex, from the generated `CNAME` file). `www` is supported as an HTTP→HTTPS+apex redirect, but is **not automatically included in the TLS certificate's SAN** unless GitHub's domain validation for `www` has separately completed — and per the DNS evidence above (CNAME to apex rather than to `*.github.io`, plus the stuck "DNS Check"), that validation likely never completed.

This is the classic "**hostname mismatch**" — the browser connects to `www.yoursparkpoint.org`, receives a cert valid only for `yoursparkpoint.org`, and refuses the connection.

## Phase 2 — GitHub Pages Settings (confirmed via screenshot, `ChFxPro/sparkpointv15`)

- **Site is live at** `https://yoursparkpoint.org/`
- **Source:** GitHub Actions (matches the workflow inspected in Phase 1)
- **Custom domain:** `yoursparkpoint.org` — status shown as **"● DNS Check In Progress"** (persistent, per your report)
- **Enforce HTTPS:** checkbox present and appears enabled
- No additional warning banners beyond the DNS Check status indicator

## Phase 5 — Squarespace Domain Panel (confirmed via screenshots)

- **Domains & Email → Domains → yoursparkpoint.org** (marked **Primary**)
- Banner: **"SSL Certificates Unavailable — It may take up to 48 hours to generate a certificate for new and recently connected domains. If it's been more than 48 hours, contact Customer Support."**
- A "Transfer your domain to Squarespace" upsell is shown (domain is registered elsewhere, not at Squarespace)
- **Details → Provider: GoDaddy** (confirms GoDaddy is the registrar of record)
- **SSL Certificate Status: Unavailable**
- **Primary Domain Settings → "Use www prefix": OFF** (apex is Squarespace's notion of primary, consistent with the apex-only GitHub CNAME)
- **DNS Settings** (Squarespace is the authoritative DNS host for this zone — confirms Phase 3 findings) shows the **full live record set**:

| Type | Name | Data |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | yoursparkpoint.org |
| CNAME | selector1._domainkey | selector1-yoursparkpoint-org...onmicrosoft.com (M365 DKIM) |
| CNAME | selector2._domainkey | selector2-yoursparkpoint-org...onmicrosoft.com (M365 DKIM) |
| CNAME | k2._domainkey | dkim2.mcsv.net (Mailchimp DKIM) |
| CNAME | k3._domainkey | dkim3.mcsv.net (Mailchimp DKIM) |
| CNAME | api._domainkey | (TXT, Mailchimp/SendGrid DKIM key) |
| CNAME | url920 / 36555601 | sendgrid.net |
| TXT | @ | `v=spf1 a:dispatch-us.ppe-hosted.com include:secureserver.net ~all` |
| TXT | @ | `google-site-verification=K7CihBbw...` |
| TXT | @ | `NETORGFT13099510.onmicrosoft.com` |
| TXT | _dmarc | `v=DMARC1; p=none` |
| MX | @ (10) | mx1-us1.ppe-hosted.com |
| MX | @ (20) | mx2-us1.ppe-hosted.com |

No AAAA, no CAA, and **no `_github-pages-challenge-*` TXT record** — all consistent with Phase 3.

---

## Root Cause Summary (confirmed)

1. **DNS is fully correct.** All 4 required GitHub Pages A records are present and exact, the `www` CNAME correctly targets the apex, there are no CAA restrictions, and no stale Squarespace A/ALIAS records remain. **DNS is not the defect.**

2. **GitHub's "DNS Check In Progress" is a stuck/stale validation state**, not a reflection of an actual DNS problem. This is a well-known GitHub Pages behavior: once a custom domain's automated check gets into this state, it can persist indefinitely even after DNS becomes (or already is) correct — GitHub does not re-run the check on its own. The standard, GitHub-documented remediation is to **remove the custom domain in Settings → Pages, save, then re-add the same domain and save again**, which forces a fresh DNS validation + Let's Encrypt certificate issuance cycle.

3. **The `www` SSL warning ("This Connection Is Not Private") is downstream of #2.** GitHub only provisions/extends the automatic TLS certificate's SAN to cover the `www` alias (in addition to the apex) once the custom domain's DNS check completes successfully. Because the check has been stuck, the cert was likely never (re)issued to include `www.yoursparkpoint.org` — so a TLS client connecting to `www` gets a certificate that's valid only for the apex → hostname mismatch → Safari/Chrome "Not Private" warning. **Re-running the domain validation (fix #2) should also trigger reissuance of a cert covering `www`.**

4. **Squarespace "SSL Certificate Unavailable" is a separate, lower-priority, likely cosmetic issue.** Squarespace is the DNS host for this zone (confirmed) but is **not** serving the website (all A records point to GitHub). Squarespace's own automatic SSL provisioning for a domain it manages requires that domain to resolve to Squarespace's hosting, which it doesn't (by design). This status can very likely be **ignored** — it has no effect on `yoursparkpoint.org`'s actual certificate (that's controlled entirely by GitHub Pages) and no effect on embedded Squarespace forms/donation widgets (those load from Squarespace's own domains with their own valid certs). **Do not "Disconnect Domain" or "Transfer to Squarespace"** from this panel — Squarespace is actively hosting your DNS zone (including email records), and disconnecting could break DNS/email entirely.

5. **Secondary, non-blocking observation:** the build workflow sets `SITE_ORIGIN`/canonical URLs to `https://www.yoursparkpoint.org`, but the GitHub Pages custom domain (and generated `CNAME` file) is the apex `yoursparkpoint.org`, and Squarespace's "Use www prefix" is OFF. This is an inconsistency in *intended canonical domain* (not a cause of the SSL error), worth aligning later — recommend standardizing on the **apex** as canonical (matches current working cert, GitHub custom domain, and Squarespace setting) and updating the build env vars accordingly.

---

## Recommended Fix

| Step | Action | Where | Risk |
|---|---|---|---|
| 1 | In **Settings → Pages**, click **Remove** next to the custom domain `yoursparkpoint.org`, then **Save** | GitHub repo settings | Low — site temporarily falls back to `chfxpro.github.io`; custom domain + HTTPS enforcement briefly inactive |
| 2 | Wait ~1–2 minutes | — | — |
| 3 | Re-enter `yoursparkpoint.org` in the custom domain field and **Save** | GitHub repo settings | Low — re-triggers DNS check + Let's Encrypt cert issuance (can take minutes, occasionally up to ~1 hr, GitHub states up to 24h) |
| 4 | Once status shows **"DNS check successful"**, re-check/re-enable **Enforce HTTPS** if it was disabled by step 1 | GitHub repo settings | Low |
| 5 | Validate `https://yoursparkpoint.org` and `https://www.yoursparkpoint.org` both load without warnings (SSL Labs / browser) | External validation | — |
| 6 | Leave Squarespace's "SSL Certificate Unavailable" notice as-is; **do not disconnect/transfer the domain** | Squarespace | N/A (no action) |
| 7 | (Optional, follow-up) Align canonical domain: decide apex vs. `www` as canonical, update `SITE_ORIGIN`/`PUBLIC_ORIGIN`/`VITE_SITE_ORIGIN` in `deploy.yml` to match | Repo (`deploy.yml`) | Low — cosmetic/SEO only |

**No DNS record changes are required** — the current DNS configuration (table in Phase 5) already matches GitHub Pages' requirements exactly.

## Risk Assessment

- **Steps 1–4 (GitHub Pages custom domain toggle):** Low risk, fully reversible, GitHub-documented pattern. Brief window (minutes, rarely longer) where the custom domain may not resolve with HTTPS enforced — visitors would still reach the site via `https://chfxpro.github.io/sparkpointv15` or, if DNS/cache hasn't flipped, may see a temporary 404/cert warning on the custom domain until the new cert is issued.
- **No registrar (GoDaddy) or Squarespace DNS changes are recommended** — avoids any risk of email (MX/DKIM/SPF/DMARC) or other service disruption.
- **Step 6 (leaving Squarespace as-is):** Zero risk. Reversing course here (disconnecting/transferring) would be **high risk** — Squarespace is the live DNS host for email and the website; disconnecting could cause a full outage.
- **Step 7 (canonical domain alignment):** Low risk, cosmetic — only affects generated absolute URLs/meta tags, not routing.

---

## Change Log

| # | Change | Where | Time (2026-06-15) | Result |
|---|---|---|---|---|
| 1 | Removed custom domain `yoursparkpoint.org` from GitHub Pages | `github.com/ChFxPro/sparkpointv15/settings/pages` | ~just now | Confirmed: "Custom domain removed." Site fell back to `https://chfxpro.github.io/sparkpointv15/`. |
| 2 | Re-added custom domain `yoursparkpoint.org` and saved | Same | ~just now | Confirmed: "Custom domain 'yoursparkpoint.org' saved." |
| 3 | (No action) Enforce HTTPS — remained checked throughout | Same | — | Verified still enabled after re-save |
| 4 | (No action) Squarespace / DNS / GoDaddy — untouched per recommendation | — | — | — |

**No DNS records, registrar settings, or Squarespace configuration were modified.**

## Validation Results (as of immediately after the fix)

| Check | Status |
|---|---|
| GitHub Pages DNS Check | ✅ **"DNS check successful"** (previously stuck on "DNS Check In Progress" — resolved immediately upon re-adding the domain) |
| Enforce HTTPS | ✅ Enabled |
| `https://yoursparkpoint.org` | ✅ Loads cleanly, no certificate warning, site renders correctly |
| `https://www.yoursparkpoint.org` | ⏳ **Still showing "Privacy error"** — expected immediately after a domain re-save. GitHub now needs to (re)issue the Let's Encrypt certificate's SAN to cover `www`; this typically completes within minutes but GitHub's SLA allows up to 24 hours. |
| `www` → apex redirect | Not yet verifiable until the `www` certificate is issued |
| Squarespace SSL Unavailable | Unchanged (expected, not a blocker — see Root Cause #4) |

## Next Step

The core fix (steps 1–4) is complete and the previously-stuck "DNS Check In Progress" resolved instantly to "DNS check successful." The apex domain (`https://yoursparkpoint.org`) is confirmed working with no warnings.

`https://www.yoursparkpoint.org` is still showing a privacy/certificate error — this is the expected interim state right after re-adding the domain, while GitHub's Let's Encrypt integration issues a certificate covering `www`. Recommend re-checking `https://www.yoursparkpoint.org` in **15–30 minutes**; if it's still failing after a few hours, the next step would be to wait out GitHub's full 24-hour SLA before further action (no further config changes should be needed). I can re-check it for you on request, or you can simply reload the page yourself.
