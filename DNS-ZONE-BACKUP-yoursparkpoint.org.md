# DNS Zone Backup — yoursparkpoint.org

**Captured:** 2026-09-10, direct from authoritative NS (`connect1.squarespacedns.com`)
**Verified identical across:** `connect1/2.squarespacedns.com`, `ns01-04.squarespacedns.com`, `dns1-4.p01.nsone.net`
**Registrar:** GoDaddy · **Parent delegation:** `connect1.squarespacedns.com`, `connect2.squarespacedns.com`

> Restore reference. If DNS is ever moved or a connect flow wipes records, rebuild from this.
> **Do not change nameservers until every record below is staged at the new provider.**

## Apex

| Type | Host | Value | Purpose |
|---|---|---|---|
| A | @ | 185.199.108.153 | GitHub Pages |
| A | @ | 185.199.109.153 | GitHub Pages |
| A | @ | 185.199.110.153 | GitHub Pages |
| A | @ | 185.199.111.153 | GitHub Pages |
| AAAA | @ | 2606:50c0:8000::153 | GitHub Pages IPv6 |
| AAAA | @ | 2606:50c0:8001::153 | GitHub Pages IPv6 |
| AAAA | @ | 2606:50c0:8002::153 | GitHub Pages IPv6 |
| AAAA | @ | 2606:50c0:8003::153 | GitHub Pages IPv6 |
| MX | @ | `10 mx1-us1.ppe-hosted.com` | **Staff email — Proofpoint** |
| MX | @ | `20 mx2-us1.ppe-hosted.com` | **Staff email — Proofpoint** |
| TXT | @ | `v=spf1 a:dispatch-us.ppe-hosted.com include:secureserver.net ~all` | **SPF** |
| TXT | @ | `NETORGFT13099510.onmicrosoft.com` | M365 tenant verification |
| TXT | @ | `google-site-verification=K7CihBbw33NB2gcvE1LSt3FREGOeT1ePFc7RnPd6wRc` | Google verification |

No CAA records. No SRV records.

## Subdomains

| Type | Host | Value | Purpose |
|---|---|---|---|
| CNAME | `www` | `chfxpro.github.io` | Website |
| CNAME | `secure` | `ext-cust.squarespace.com` | Squarespace Commerce / ticketing |
| CNAME | `url920` | `sendgrid.net` | SendGrid link branding — **orphaned?** |
| CNAME | `36555601` | `sendgrid.net` | SendGrid link branding — **orphaned?** |

## Email authentication

| Type | Host | Value | Purpose |
|---|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:info@yoursparkpoint.org; fo=1` | DMARC + reporting (updated 2026-09-10) |
| CNAME | `selector1._domainkey` | `selector1-yoursparkpoint-org._domainkey.netorgft13099510.onmicrosoft.com` | **M365 DKIM** |
| CNAME | `selector2._domainkey` | `selector2-yoursparkpoint-org._domainkey.netorgft13099510.onmicrosoft.com` | **M365 DKIM** |
| CNAME | `k2._domainkey` | `dkim2.mcsv.net` | Mailchimp DKIM — **orphaned?** |
| CNAME | `k3._domainkey` | `dkim3.mcsv.net` | Mailchimp DKIM — **orphaned?** |

| CNAME | `squarespace._domainkey` | `squarespace-domainkey.squarespace-mail.com` | **Squarespace DKIM — added 2026-09-10** |

Both added 2026-09-10 and verified live against the authoritative nameserver.
The DKIM CNAME chases through to a valid 2048-bit key.

**Phantom record:** `api._domainkey` (TXT, 1024-bit key) is displayed in the Squarespace DNS panel
but returns nothing from the authoritative nameserver. **The panel can show records it does not
publish — always verify with `dig`, never with the panel.**

**DNS editor:** https://account.squarespace.com/domains/linked/yoursparkpoint.org/dns/dns-settings
Unreachable by clicking through the UI — go direct to this URL.

## Drift since 2026-06-15

Comparing to the record table in `DNS-SSL-DIAGNOSIS-SPARKPOINT.md`:

| Record | June 2026 | Now | Note |
|---|---|---|---|
| `www` CNAME | `yoursparkpoint.org` | `chfxpro.github.io` | **Changed** — matches the June recommendation |
| AAAA @ | none | 4 GitHub Pages IPv6 | **Added** |
| `api._domainkey` | listed | not resolving | Gone or never existed |

**The zone was edited after 2026-06-15.** Someone had working editor access recently.
GoDaddy whois `Updated Date: 2026-08-12` is consistent with a change in that window.

Note: the SOA serial is `1678710553` (2023-03-13) and did **not** advance across these edits —
Squarespace/NS1 does not increment it. **SOA serial is not a reliable change indicator here.**

## Verify command

```bash
D=yoursparkpoint.org; NS=connect1.squarespacedns.com
for t in A AAAA MX TXT NS; do echo "-- $t --"; dig +norecurse $t $D @$NS +short; done
for h in www secure _dmarc selector1._domainkey selector2._domainkey k2._domainkey k3._domainkey squarespace._domainkey; do
  echo "$h => $(dig +norecurse CNAME $h.$D @$NS +short)$(dig +norecurse TXT $h.$D @$NS +short)"
done
```
