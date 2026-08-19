# Roadmap

Ordered by dependency, not by preference. Each phase unblocks the next.

Design and build come **last**, deliberately. A beautiful site launched into a
polluted index and an unclaimed Google profile won't fix the problem you actually
have.

---

## Phase 0 — Rescue (this week) ⏳

**The only phase with a hard external deadline.**

**Situation:** the site went dark on 27 July because of the attempted registrar
transfer, not because of non-payment. The A record was removed during that attempt.
No hosting package is visible in the Natro account — but the files may still be
sitting on the old server, simply unreachable because nothing points at them.

### Do this first — and spend nothing

⚠️ **Natro charges for DNS management ("Profesyonel DNS") when you hold only a domain.
Don't buy it, and don't buy hosting either.** Full reasoning:
**[`dns-a-kaydi-ekleme.md`](dns-a-kaydi-ekleme.md)** 🇹🇷

The trap: buying a new hosting package gives you an **empty** account. It does not
restore the old files. Only reactivating the *original* account would — and there
isn't one on your Natro account.

- [x] ~~Buy Professional DNS (~$1/yr) and add A records~~ — **done 3 Aug 2026**
- [x] ~~Run the recovery test~~ — **result: cPanel default page.** No hosting account
      for this domain on that server. See `domain-facts.md`.
- [ ] **Send the support ticket** (`natro-destek-talebi.md`) — now updated with the
      cPanel evidence. Last remaining question: was the account *migrated* to another
      server, or deleted? Any backup? Could it sit under a reseller's account?
- [ ] **Decide on the cPanel "SORRY!" page** — remove the A records, or put a holding
      page up and point them there (better)
- [ ] **Plan a photo session at the shop** — proceed on the assumption the old photos
      are gone

**Three possible outcomes:**

| What you see | What it means |
|---|---|
| **The old site loads** 🎉 | Hosting is alive. Download everything immediately — web root, database, and above all `wp-content/uploads/` |
| **A suspension / "hesabınız durduruldu" page** | Account exists but is suspended. Renew or reactivate, then download |
| **Nothing, or a generic server page** | The account is gone from that server. Move to the support ticket |

### If the A record test fails

- [ ] Send the ticket in **`natro-destek-talebi.md`**
- [ ] Ask the family **who built the old site** — if hosting was under a developer's
      own reseller account, they're the fastest route to the files
- [ ] If nothing surfaces, plan a photo session at the shop instead

**Realistic expectation:** re-shooting is a fine outcome. 2022-era photos of jewelry
that sold years ago wouldn't have earned a place on the new site anyway. The one
genuine loss would be storefront and interior shots — and those you can retake better.

## Phase 1 — Secure (this week) 🔒

- [ ] 2FA on the Natro account
- [ ] Unique strong password, stored in a password manager
- [ ] Confirm and harden the account's recovery email
- [ ] Auto-renew armed, with a card valid past July 2027
- [ ] Calendar reminders at 60/30/0 days before expiry
- [ ] Extend registration 3–5 years
- [ ] Request `clientDeleteProhibited` + `clientUpdateProhibited` from support
- [ ] Second family member has access

Full detail: **`domain-security-plan.md`**

**Blocks:** everything. Don't build on an asset you don't fully control.

## Phase 2 — Establish the facts 📋

- [ ] Go through **`aile-sorulari.md`** with the family (Turkish, printable)
- [ ] Confirm exact address, which phones are live, and real opening hours
- [ ] Confirm the Instagram handle
- [ ] Decide the canonical trade name (recommend: **Kapaklı Kuyumculuk**)
- [ ] Work out whose Google account might hold the profile
- [ ] Collect photos: storefront, interior, products

Full list: **`aile-sorulari.md`** (TR) and **`open-questions.md`** (EN)

**Blocks:** Phases 3, 4 and 5. Every one of them needs a correct address.

## Phase 3 — Go live minimally 🌐 ✅

**Done.** Verified live 2026-08-19: `https://www.kapaklikuyumculuk.com/` returns 200
with the holding page, valid SSL, and `http` → `https` → `www` all redirecting
correctly. Deployed from a private GitHub repo to Vercel (project `holdingscree-kk`).

- [x] Point DNS at a host — done via Vercel, `www` record now exists
- [x] Publish a one-page holding site: name, address, phones, hours, map link, Instagram
- [x] `robots.txt`, `sitemap.xml`, branded `404.html`, and old-URL 301s — added 2026-08-19
- [ ] **Verify the domain in Google Search Console** — the one item still open here.
      See Step 7 of `index-cleanup-plan.md`.
- [ ] Optionally move DNS to Cloudflare — safe to do, since no email runs on the domain

## Phase 4 — Clean the index 🧹

- [ ] **Request ownership** of the Google profile — do NOT create a duplicate
      (Place ID `ChIJHUgV0gQmtRQRsb2D_txDS2Q`). Owner has 3–7 days to respond
- [ ] Pass video verification
- [ ] **Get the former partner's shop disentangled from your name** across directories —
      remove the Atatürk Mah. address and the 717 85 88 / 717 39 87 numbers
- [ ] Claim your Yandex listing, Apple Maps, Facebook, Foursquare
- [ ] Push the canonical NAP to every directory
- [ ] Get the wrong Şanlıurfa Instagram account unlinked from esnaf.pro
- [ ] Fix the map pin location
- [ ] Upload 15–25 photos to the Google profile
- [ ] Reply to the existing 2.3★ review

Full detail: **`google-profile-claiming.md`**, **`index-cleanup-plan.md`**, **`google-business-plan.md`**

**Blocks:** nothing downstream, but this is where the ranking problem actually gets solved.

## Phase 5 — Design & build 🎨

Only now.

- [ ] Decide scope: showcase site vs. e-commerce (**recommend showcase** — gold retail
      online carries real pricing and regulatory complexity)
- [ ] Decide on a live gold price widget (common on Turkish jeweller sites, and a
      genuine reason for repeat visits)
- [ ] Design direction — ideally drawn from the shop's actual signage and print material
- [ ] Build
- [ ] 301-redirect all six old URLs (`old-site-map.md`)
- [ ] Submit sitemap, force re-crawl
- [ ] Structured data matching the Google profile exactly

## Phase 6 — Compound 📈

- [ ] Ask every happy customer for a Google review, in person, at purchase
- [ ] QR code on the counter and in the ring box
- [ ] Reply to every review
- [ ] Weekly Google post — new arrivals, bayram hours
- [ ] Monthly: re-check the name search, log profile views/calls

---

## Rough timeline

| Phase | Effort | When |
|---|---|---|
| 0 — Rescue | 2–3 hours | **Now** |
| 1 — Secure | 2 hours | This week |
| 2 — Facts | 1 conversation | This week |
| 3 — Minimal live | 1–2 hours | Next week |
| 4 — Index cleanup | ~6 hours + waiting | Weeks 2–4 |
| 5 — Design & build | The real project | Week 3 onwards |
| 6 — Compound | 15 min/week | Forever |

Phases 0–4 total maybe **two working days of actual effort**, spread over a month
because of verification and support waits. That's the work that determines whether
anyone finds the site you're about to build.
