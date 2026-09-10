# SparkPoint Email Deliverability — yoursparkpoint.org

**Status: RESOLVED for Email Campaigns as of 2026-09-10.** One follow-up remains — see Outstanding.

Newsletters and event-ticket receipts were landing in spam. Root cause was a missing DKIM record;
it is now published and verified. **The current operational state is below. The original diagnosis
is preserved as an appendix and describes the pre-fix world — do not act on it.**

---

## Current state (verified 2026-09-10)

### Live authentication records

| Type | Host | Value | Purpose |
|---|---|---|---|
| CNAME | `squarespace._domainkey` | `squarespace-domainkey.squarespace-mail.com` | Squarespace DKIM |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:info@yoursparkpoint.org; fo=1` | DMARC + reporting |
| TXT | `@` | `v=spf1 a:dispatch-us.ppe-hosted.com include:secureserver.net ~all` | SPF (M365/Proofpoint) |
| CNAME | `selector1/selector2._domainkey` | `…netorgft13099510.onmicrosoft.com` | Microsoft 365 DKIM |

DMARC policy is deliberately `p=none`. **Do not tighten it** until aggregate reports at
`info@yoursparkpoint.org` confirm every legitimate sender aligns.

### Verified working

Test campaign to Gmail, 2026-09-10:

```
From:  SparkPoint <info@yoursparkpoint.org>
DKIM:  'PASS' with domain yoursparkpoint.org
DMARC: 'PASS'

dkim=pass header.i=@yoursparkpoint.org header.s=squarespace
dmarc=pass (p=NONE sp=NONE dis=NONE) header.from=yoursparkpoint.org
```

**SPF does not align, and that is correct.** SPF passes against Squarespace's Return-Path
(`mgcp02.squarespace-mail.com`), not `yoursparkpoint.org`. Squarespace owns the Return-Path, so SPF
alignment is impossible by design and DKIM alignment carries DMARC on its own.

Squarespace Email Campaigns sends via Mailgun.

### Re-verifying after any change

```bash
D=yoursparkpoint.org; NS=connect1.squarespacedns.com
dig +norecurse CNAME squarespace._domainkey.$D @$NS +short
dig +norecurse TXT _dmarc.$D @$NS +short
```

Then send a test campaign to Gmail → **Show original** → confirm `From` is
`info@yoursparkpoint.org`, `DKIM: PASS` with domain `yoursparkpoint.org`, and `DMARC: PASS`.

---

## Outstanding

**Commerce / ticket receipts are unverified.** Everything confirmed above is Email Campaigns.
Order and ticket notifications are a separate Squarespace sending path, and their docs do not state
whether they share the Email Campaigns sender profile and DKIM signature.

Tracked as **MAIL-001** in `WORKLIST.md`. Resolve by placing a real ticket order and reading the
receipt's headers — `dkim=pass header.i=@yoursparkpoint.org` means receipts are covered by the same
fix. A Squarespace *test* notification is not sufficient evidence: their docs state test sends always
originate from `no-reply@squarespace-mail.info` regardless of configuration.

If receipts do not pass, the documented fallback is switching the receipt From address to
Squarespace's own `no-reply@squarespace.info` — authenticated on their domain, at the cost of
branding on receipts.

### Lower priority

- **Orphaned sender records.** `k2/k3._domainkey` (Mailchimp) and `url920` / `36555601`
  (SendGrid) are live in the zone. If unused, remove them — they leave dangling delegations and will
  muddy DMARC reports.
- **Reputation and list hygiene.** The domain's sending history was built on rewritten From
  addresses; expect improvement over weeks, not instantly. Contacts who never explicitly opted in
  generate complaints that no DNS change fixes.

---

## Do NOT do

- **Do not add an SPF include for Squarespace.** They control the Return-Path; there is nothing to
  include. Editing SPF risks breaking working staff email.
- **Do not set `p=quarantine` or `p=reject`** before DMARC reports confirm alignment.
- **Do not add records at GoDaddy.** GoDaddy is the registrar only. Nameservers delegate to
  `connect1/connect2.squarespacedns.com`, so records added in GoDaddy's DNS manager never resolve.
- **Do not disconnect or transfer the domain** in the Squarespace panel, and **do not set the apex as
  primary domain** — `secure.yoursparkpoint.org` is the commerce site's primary domain and runs live
  ticket checkout. See TICKET-001 in `WORKLIST.md`.

---

## Operational notes

**DNS editor:** https://account.squarespace.com/domains/linked/yoursparkpoint.org/dns/dns-settings

Go directly to that URL. It is unreachable by clicking through Squarespace's UI — the site-level
DNS Settings row renders but is inert, and the `secure.` domain page has no DNS row at all.

**The Squarespace DNS panel can display records it does not publish.** `api._domainkey` appears in
the record list but returns nothing from the authoritative nameserver. **Verify every change with
`dig`, never with the panel.**

Full zone capture: `DNS-ZONE-BACKUP-yoursparkpoint.org.md`.

---

## Appendix — original diagnosis (2026-09-10, pre-fix)

> Historical record of the problem as found. Superseded by Current state above.

Squarespace had never been authorized to sign as `yoursparkpoint.org` — the `squarespace._domainkey`
record was absent from the zone (`dig` returned NXDOMAIN).

The mechanism was more specific than a DMARC failure. Squarespace never attempted to send as
`yoursparkpoint.org` at all: while the sender was unauthenticated it **rewrote the From address** to a
shared subdomain, observed live as:

```
SparkPoint <info.yoursparkpoint.org@grkcc7.sqspmail.com>
```

That put outbound mail on a domain whose reputation SparkPoint did not control, and whose name did
not match the links inside the emails — a from-domain/link-domain mismatch is a standard spam
heuristic. Transactional receipts were hit hardest, since unauthenticated transactional mail is the
exact shape filters are tuned against.

Microsoft 365 staff mail was never affected; it authenticated correctly throughout via the SPF chain
(`secureserver.net` → `spf-0.secureserver.net` → `spf.protection.outlook.com`, ~4 lookups) and
`selector1/2._domainkey`. **Squarespace was the only unauthenticated sender on the domain**, which is
why the problem was specific to newsletters and receipts.

Repo check at the time: no transactional email is sent from application code — no Resend, SendGrid,
or SMTP calls in `src/` or `supabase/functions/`. All outbound mail is Microsoft 365 or Squarespace.

Two conditions had to be met before Squarespace would stop rewriting the From address: the domain
authenticated **and** the sender address verified. `info@yoursparkpoint.org` proved to be already
verified from the original campaigns setup, so publishing the DKIM record completed both.

---

## Sources

- [DNS records for email — Squarespace Help Center](https://support.squarespace.com/hc/en-us/articles/31120985010957-DNS-records-for-email)
- [Email notifications your site sends — Squarespace Help Center](https://support.squarespace.com/hc/en-us/articles/360049390031-Customer-email-notifications)
- [Nameserver connect vs. DNS connect — Squarespace Help Center](https://support.squarespace.com/hc/en-us/articles/8387079117581-Nameserver-connect-vs-DNS-connect)
- [Squarespace Email Campaigns — Valimail](https://support.valimail.com/en/articles/8759544-squarespace-email-campaigns)
