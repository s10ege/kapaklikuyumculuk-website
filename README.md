# Kapaklı Kuyumculuk — Project Planning

Planning workspace for taking over and relaunching the web presence of the family
jewelry shop in Kapaklı, Tekirdağ.

**Stage:** holding page live. Domain healthy, site up on Vercel, index cleanup shipped
and waiting on Search Console verification. Real build not started — by design.

---

## Start here

**→ [`roadmap.md`](docs/roadmap.md)** — the ordered plan. Read this first.

### Ready to use right now

| Doc | What it is |
|---|---|
| [`dns-a-kaydi-ekleme.md`](docs/dns-a-kaydi-ekleme.md) | 🇹🇷 **Do this first.** Exact Natro panel steps to bring the site back |
| [`natro-destek-talebi.md`](docs/natro-destek-talebi.md) | 🇹🇷 Support ticket, copy-paste ready — only if the DNS fix fails |
| [`aile-sorulari.md`](docs/aile-sorulari.md) | 🇹🇷 Printable question sheet to go through with the family |
| [`google-profile-claiming.md`](docs/google-profile-claiming.md) | ⚠️ **Read before touching anything on Google** |

### Plans

| Doc | What it's for |
|---|---|
| [`domain-security-plan.md`](docs/domain-security-plan.md) | Locking the domain down so it can't be lost or taken |
| [`index-cleanup-plan.md`](docs/index-cleanup-plan.md) | Making the internet agree on one version of the business |
| [`google-business-plan.md`](docs/google-business-plan.md) | Fixing the Google ranking problem, including how to earn reviews without getting the listing suspended |
| [`open-questions.md`](docs/open-questions.md) | Everything still needing a human answer |

### Reference

| Doc | What it holds |
|---|---|
| [`domain-facts.md`](docs/domain-facts.md) | Live DNS/registry audit, 2026-08-03 |
| [`business-facts.md`](docs/business-facts.md) | Every business fact with confidence level and source |
| [`old-site-map.md`](docs/old-site-map.md) | What was recovered from the dead site, and what wasn't |
| [`old-urls.txt`](docs/old-urls.txt) | All 309 old URLs recovered from Archive.org, 2026-08-19 |

---

## The situation in one page

**The problem as stated:** searching the shop's name on Google surfaces other shops.

**What's actually going on:**

1. **Your business name currently points at two different addresses.** There was a
   partner; the shops were divided. The Atatürk Mahallesi shop is his now, trading
   under a different name — but directories across the web still list that address
   and its phone numbers as *Kapaklı Kuyumculuk*. Google sees one name resolving to
   two locations in one small district and hedges. This is the most likely root cause,
   and almost nobody would think to look for it.

2. **The site was dark — now fixed.** *(Updated 2026-08-19: a holding page is live at
   `https://www.kapaklikuyumculuk.com/`, deployed to Vercel. The original reason it went
   down is below, kept for the record.)* The A record was removed on
   27 July during an attempted registrar transfer (which was blocked because the
   domain had just been renewed). The registration itself is healthy and paid through
   2027. **First thing to try: put the A record back to `94.73.146.147` and see if the
   old site simply returns.** Five minutes, reversible, and it may recover the product
   photos everyone assumed were lost.

3. **The Google profile is claimed by someone you can't identify** — likely the former
   partner or the old developer. It sits at 2.3★ from one review. There's a proper
   ownership-request route for this; the instinctive "make a new one and report the
   old one" approach backfires.

None of that is fixed by a nicer website. Secure the asset, clean the record, claim
the profile — then build.

---

## Working notes

- Customer-facing copy is Turkish.
- Facts in `business-facts.md` are marked ✅ / 🟡 / ❌. **Nothing marked ❌ gets
  published** until the family confirms it.
- Canonical address — use these exact characters everywhere:
  ```
  Kapaklı Kuyumculuk
  Cumhuriyet Mah., Pınar Bulvarı No: 56/C
  59510 Kapaklı / Tekirdağ
  0282 717 21 31
  ```
- **0282 717 85 88** and **0282 717 39 87** are the former partner's numbers. They
  should never appear on anything of yours.
- When the build starts, business data should live in exactly one file that the site,
  the structured data and the Google profile all read from. Inconsistency is the root
  problem here; the architecture should make it hard to reintroduce.
