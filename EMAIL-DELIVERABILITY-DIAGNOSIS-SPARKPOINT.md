# SparkPoint Email Deliverability Diagnosis — yoursparkpoint.org

**Date:** 2026-09-10
**Symptom:** Squarespace newsletters and Squarespace order/ticket receipts frequently land in recipients' spam folders.
**Status:** Root cause confirmed. **DNS fixes applied and verified 2026-09-10.**
Sender-address verification in Squarespace remains outstanding — see Resolution at the end.

---

## Resolution status (2026-09-10)

| Step | State |
|---|---|
| `squarespace._domainkey` CNAME published | ✅ Live, chases to a valid 2048-bit key |
| `_dmarc` updated with `rua=` reporting | ✅ Live, single clean record |
| `info@yoursparkpoint.org` sender verified in Squarespace | ⬜ **Outstanding — blocks the fix** |
| Test campaign headers confirmed | ⬜ Pending |
| Ticket receipt headers confirmed | ⬜ Pending |

**Correction to the mechanism described below.** The original diagnosis said Squarespace mail *fails*
DMARC. It is more specific than that: Squarespace never attempts to send as `yoursparkpoint.org` at
all. While the sender is unverified it **rewrites the From address** to a shared subdomain —
observed live as `SparkPoint <info.yoursparkpoint.org@grkcc7.sqspmail.com>`.

That means DKIM alone does not fix this. Squarespace requires the domain authenticated **and** the
sender address verified before it will send as you. The DNS half is done; the verification half is
not. Until both are complete, mail still goes out on the shared `sqspmail.com` subdomain, whose
reputation you do not control and whose domain does not match the links in your own emails.

## TL;DR

**Every email Squarespace sends on your behalf fails DMARC**, because the DKIM record that lets
Squarespace sign as `yoursparkpoint.org` was never added to the zone.

Missing record:

| Type | Host | Value |
|---|---|---|
| CNAME | `squarespace._domainkey` | `squarespace-domainkey.squarespace-mail.com` |

Confirmed absent — `dig CNAME squarespace._domainkey.yoursparkpoint.org` returns nothing.

Your Microsoft 365 mail (`info@`, `maggie@`, staff mail) authenticates correctly. **Squarespace is the
only unauthenticated sender on the domain**, which is exactly why the problem is specific to
newsletters and receipts.

---

## Live DNS evidence (queried 2026-09-10)

| Record | Value | Verdict |
|---|---|---|
| SPF (`@` TXT) | `v=spf1 a:dispatch-us.ppe-hosted.com include:secureserver.net ~all` | ✅ Valid for M365/Proofpoint |
| SPF lookup chain | `secureserver.net` → `spf-0.secureserver.net` → `spf.protection.outlook.com` | ✅ ~4 DNS lookups, well under the 10 limit |
| DKIM `selector1/2._domainkey` | → `…netorgft13099510.onmicrosoft.com` | ✅ M365 DKIM live |
| **DKIM `squarespace._domainkey`** | **NXDOMAIN** | ❌ **MISSING — root cause** |
| DMARC (`_dmarc` TXT) | `v=DMARC1; p=none` | ⚠️ Valid but no `rua=` → zero reporting |
| MX | `mx1/mx2-us1.ppe-hosted.com` | ✅ Proofpoint (GoDaddy Advanced Email Security) |
| DKIM `k2/k3._domainkey` | → `dkim2/dkim3.mcsv.net` | ⚠️ Mailchimp — orphaned? |
| CNAME `url920`, `36555601` | → `sendgrid.net` | ⚠️ SendGrid — orphaned? |
| `secure.yoursparkpoint.org` | → `ext-cust.squarespace.com` | ✅ Squarespace Commerce (checkout/ticketing) |
| BIMI / MTA-STS / TLS-RPT | none | ℹ️ Optional, not a cause |

Repo check: no transactional email is sent from application code (no Resend/SendGrid/SMTP calls in
`src/` or `supabase/functions/`). All outbound mail is Microsoft 365 or Squarespace.

---

## Why this puts mail in spam

DMARC only passes if the `From:` domain **aligns** with SPF or DKIM. For Squarespace-sent mail today:

1. **SPF alignment — impossible.** Squarespace uses its own Return-Path (`squarespace-mail.com`).
   SPF passes *for Squarespace's domain*, not yours, so it never aligns with `yoursparkpoint.org`.
   **There is no Squarespace SPF include to add.** (Many blog posts claim otherwise; it does nothing.)
2. **DKIM alignment — currently failing.** Without `squarespace._domainkey`, Squarespace signs with
   `d=squarespace-mail.com` instead of `d=yoursparkpoint.org`. Unaligned.
3. **Net result: DMARC = fail** on every campaign and every receipt.

Practical consequences at the receiving end:

- Gmail displays **"via squarespace-mail.com"** under your sender name — a visible trust downgrade.
- Gmail, Yahoo and Outlook all weight DMARC alignment heavily for bulk/marketing mail. An
  unauthenticated bulk sender on a domain that *does* publish DMARC reads as a spoofing candidate.
- Receipts are worse-hit than they look: transactional mail from an unauthenticated domain is exactly
  the phishing shape filters are tuned for.

DKIM is the **only** alignment path available for Squarespace. That single missing CNAME is the whole
authentication story for these emails.

---

## Fix — in order

### 1. Add the Squarespace DKIM record ← this is the actual fix

In Squarespace: **Email Campaigns → Sender Profiles** (or **Settings → Domains → Email**). Verify the
`yoursparkpoint.org` sender address; Squarespace will then display the DKIM record to publish.

Squarespace is already the authoritative DNS host for this zone (`ns01-04.squarespacedns.com`), so it
will likely offer to add the record automatically. **Use the exact value Squarespace shows** — the
documented default is `squarespace._domainkey → squarespace-domainkey.squarespace-mail.com`, but take
the panel's value if it differs.

Verify after ~15 min:

```bash
dig +short CNAME squarespace._domainkey.yoursparkpoint.org
```

Then send a test to a Gmail account → **Show original** → confirm `DKIM: 'PASS' with domain
yoursparkpoint.org` and `DMARC: 'PASS'`. The "via squarespace-mail.com" line should disappear.

### 2. Turn on DMARC reporting (do this at the same time)

Current record is `v=DMARC1; p=none` with no reporting address, so you have no visibility into which
senders are failing. Replace with:

```
v=DMARC1; p=none; rua=mailto:dmarc@yoursparkpoint.org; fo=1
```

Keep `p=none` until reports show every legitimate sender aligned. Only then consider `p=quarantine`.
Tightening before step 1 is verified would send your own newsletters to spam on purpose.

### 3. Check the Commerce / ticket receipt sender

**Settings → Selling → Customer Notifications.** Confirm the From address is a `yoursparkpoint.org`
address so step 1's DKIM signature applies to it. Re-test a real ticket purchase after the DKIM record
is live — Squarespace documents DKIM for Email Campaigns explicitly, and commerce notifications are
less clearly documented, so verify rather than assume.

If receipts *still* fail after DKIM is confirmed passing on campaigns, the fallback Squarespace itself
recommends is switching the receipt From address to their own `no-reply@squarespace.info` — fully
authenticated on their domain, at the cost of your branding on receipts.

### 4. Remove orphaned sender records

`k2._domainkey` / `k3._domainkey` (Mailchimp) and the `url920` / `36555601` CNAMEs (SendGrid) are live
in the zone. If neither platform is in use, delete them. They aren't causing the spam problem, but
they leave dangling delegations that would let a re-registered account sign as your domain, and they
muddy DMARC reports once step 2 is on.

### 5. Non-authentication factors (secondary, address after the above)

- **Domain sending reputation** is currently built on a history of DMARC-failing mail. Expect
  improvement over days, not instantly, after step 1.
- **List hygiene.** Imported or purchased lists, or contacts who never explicitly opted in, generate
  spam complaints that no amount of DNS work will fix.
- **Consistency.** Send from one From address, on a predictable cadence — erratic bulk sending from a
  cold domain is itself a spam signal.

---

## Do NOT do

- **Don't add an SPF include for Squarespace.** Squarespace controls the Return-Path; there is nothing
  to include, and editing SPF risks breaking working M365 mail.
- **Don't set `p=quarantine`/`p=reject`** before DMARC reports confirm alignment.
- **Don't disconnect the domain in the Squarespace panel.** Squarespace hosts the DNS zone, including
  all MX and M365 records — disconnecting would break staff email. (Same warning as in
  `DNS-SSL-DIAGNOSIS-SPARKPOINT.md`.)

---

## Sources

- [DNS records for email — Squarespace Help Center](https://support.squarespace.com/hc/en-us/articles/31120985010957-DNS-records-for-email)
- [Email notifications your site sends — Squarespace Help Center](https://support.squarespace.com/hc/en-us/articles/360049390031-Customer-email-notifications)
- [Squarespace Email Campaigns — Valimail](https://support.valimail.com/en/articles/8759544-squarespace-email-campaigns)
- [How to stop Squarespace emails going to junk — Stellastra](https://stellastra.com/how-to-stop-squarespace-emails-going-to-spam/)
