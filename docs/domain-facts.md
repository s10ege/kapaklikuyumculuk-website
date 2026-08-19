# Domain Technical Audit — kapaklikuyumculuk.com

Live lookups performed **2026-08-03** against public DNS and the registry (RDAP).
These are observed facts, not assumptions.

---

## Registration

| Field | Value | Notes |
|---|---|---|
| **Registrar of record** | **Nics Telekomünikasyon A.Ş.** (NicProxy), IANA ID **1454** | ⚠️ Not Natro — see below |
| Reseller / who you deal with | **Natro** (Çizgi Telekomünikasyon A.Ş.) | Natro resells on NicProxy's platform |
| Created | **19 July 2013** | Domain is 13 years old — that age is an asset, don't lose it |
| **Expires** | **19 July 2027** | ~11.5 months of runway |
| Last updated | 10–15 July 2026 | Renewed about three weeks ago |
| Registrar abuse contact | abuse@nicproxy.com · +90 212 213 2963 | Escalation path above Natro |

**Why the registrar distinction matters:** if Natro's support can't or won't resolve
something (locked account, disputed ownership, transfer refusal), the escalation
goes to Nics Telekom / NicProxy — and ultimately ICANN — not to Natro. Natro is
the shopfront; Nics Telekom holds the ICANN accreditation.

## Security posture

| Control | State | Verdict |
|---|---|---|
| `clientTransferProhibited` (transfer lock) | ✅ **ON** | Good — domain can't be transferred away without a deliberate unlock |
| `clientDeleteProhibited` | ❌ **not set** | Gap |
| `clientUpdateProhibited` | ❌ **not set** | Gap |
| DNSSEC | ❌ **not enabled** (no DS, no DNSKEY) | Gap, low-to-moderate priority |
| WHOIS privacy | ✅ Fully redacted (standard ICANN gTLD redaction) | Fine |
| Account 2FA | **Unknown — check** | Highest-priority unknown |
| Auto-renew | **Unknown — check** | High priority |

No `pendingDelete`, `redemptionPeriod`, or other distress status. **The registration
itself is healthy.** The problems are elsewhere.

## DNS — this is why the site is dark

| Record | Result |
|---|---|
| **NS** | `ns1.natrohost.com`, `ns2.natrohost.com` |
| **A** (apex) | **NONE.** NOERROR with zero answers — the zone exists but has no address record |
| **A** (`www`) | **NXDOMAIN** — the `www` hostname doesn't exist at all |
| **MX** | **NONE** |
| **TXT** | `v=spf1 include:_spfcls.natrohost.com include:_netblockshalon.natrohost.com ~all` |
| **SOA serial** | `2026072712` → zone last edited **27 July 2026** |

### What this actually tells us

1. **The domain is fine. The hosting is what died.** The registration is paid
   through 2027 and the DNS zone is still live at Natro — but the A record that
   pointed at the web server is gone. A domain problem would look completely
   different (NXDOMAIN at the zone level, or a `pendingDelete` status).

2. ✅ **The 27 July zone edit was Soner's own.** He attempted to transfer the domain
   to another registrar and the transfer was blocked, but the DNS changes made during
   the attempt removed the A record. **No third party touched anything.**

   This matters enormously: it means the site didn't die from neglect or a lapsed
   payment — it's pointing nowhere because of a reversible configuration change. The
   old site was served from `94.73.146.147` (`cpls59.srvpanel.com`), a Natro
   shared-hosting box. **If that hosting account still exists, restoring the A record
   may simply bring the entire old site back, product photos and all.**

   That's a five-minute, fully reversible test and it should be the first thing tried.

3. **No email is running on the domain right now.** This answers the open question:
   there are no MX records, so nothing can receive mail at `@kapaklikuyumculuk.com`.
   Mail sent there is bouncing.

4. **But there probably *was* mail at some point.** The SPF record still points at
   Natro's mail infrastructure — that's a leftover from a working mail setup. If
   anyone in the family ever used an `@kapaklikuyumculuk.com` address, it has been
   dead since at least 27 July, and any mail sent to it since then is lost.
   Worth asking. Nothing needs to be *preserved*, since nothing is running — which
   makes changing DNS completely safe from a mail-breakage standpoint.

## ✅ A-record test result (3 Aug 2026)

Professional DNS was purchased and A records added for `@` and `www` → `94.73.146.147`.

**Result: cPanel "Default Web Site Page".**

What that rules in and out:

- ✅ DNS is now configured correctly and resolving
- ✅ The server at `94.73.146.147` is alive and responding
- ❌ **No hosting account / vhost on that server matches the domain**
- ❌ Not a suspension page — a suspended account shows "Account Suspended", not this

**Conclusion:** the old hosting account is no longer on `cpls59.srvpanel.com`. Either
it was deleted, or it was migrated to a different server. The cPanel page itself
raises the migration possibility, so it's worth one question to support before
writing the files off — but the realistic expectation is that they're gone.

**Consequence:** the old product photos should be treated as lost. Plan a photo
session at the shop.

### Housekeeping

The domain now serves a cPanel "SORRY!" page. That's marginally worse than serving
nothing, because it's a real, indexable page — Google could crawl it and treat it as
the site's content. Either remove the two A records again, or get a holding page up
soon and point them there. The second is better.

## Why the transfer was blocked

The domain was renewed around **10–15 July 2026**. The transfer attempt came on
**27 July** — roughly 12 days later, well inside the **45-day post-renewal window**.

Within that window, transferring can mean the year you just paid for **is not carried
over** to the new registrar. Behaviour varies by registrar, which is why the gaining
registrar or Natro would have flagged it.

Separately, ICANN imposes a hard **60-day lock** after initial registration, after a
previous transfer, or after any change to the registrant name/organisation/email.
That lock cannot be overridden by any registrar.

**Practical read:** the domain simply wasn't transferable at that moment. Waiting is
the correct move — and at ~$30/year there's no financial reason to transfer at all.
If you still want to later, the clean window opens after **late August 2026** (45 days
past renewal), and the safest time is 2–3 months before the July 2027 expiry.

## ⏳ Is anything time-critical?

Less than it first appeared, now that we know the site was taken down deliberately
rather than by non-payment. But the hosting question is still open.

Natro's Web Hosting service agreement (§5.5):

> "...hizmet süresi bitiş tarihi itibarı ile **on beş (15) iş günü** içerisinde
> ödeme alınamayan Hizmetler **durdurulur**. Duraklama süresini takiben **on beş
> (15) iş günü** içerisinde ödeme yapılmayan Hizmetler **silinir**."

**15 business days to suspension, 15 more to permanent deletion — roughly 6 calendar
weeks total.** After that there is no archive and no recovery tier.

Two clauses make this worse:

- **§4.6:** *"Veri yedekleme, MÜŞTERİ'nin sorumluluğundadır… NATRO paylaşımlı
  sunucuları bir arşiv değildir."* Natro explicitly disclaims being an archive.
  Do not assume a restorable backup exists.
- **§5.5:** the customer waives claims for data loss arising from non-payment
  suspension. No legal lever once it's gone.

**Why this matters more than anything else in this folder:** the product photos
from the old site could not be recovered from any search index or archive. If they
still exist anywhere, it's on that Natro hosting account. Photos of jewelry that
was sold years ago cannot be re-shot.

Mailboxes are on a longer clock (§4.4.10): suspended after 3 months of no access,
deleted at the end of the 3rd month after that — about 6 months total.

## Sources

- RDAP/WHOIS via [who.is](https://who.is/whois/kapaklikuyumculuk.com) (proxies `rdap.verisign.com`)
- DNS via Google Public DNS resolver (`dns.google/resolve`)
- DNSSEC state via [Verisign DNSSEC Debugger](https://dnssec-analyzer.verisignlabs.com/kapaklikuyumculuk.com)
- [Natro Web Hosting Hizmet Sözleşmesi](https://www.natro.com/sozlesmeler/detay/webhosting-hizmet-sozlesmesi)
- [NicProxy registrar profile](https://domaindetails.com/registrars/nics-telekomunikasyon-a-s)
