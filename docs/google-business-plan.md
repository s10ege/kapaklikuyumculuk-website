# Google Business Profile & Local SEO Plan

> **Amended 2026-08-27.** The canonical trade name in this document was superseded.
> It is corrected inline and marked **AMENDED**. See `plan.md` and `FINAL.md`.

**The problem:** searching the shop's name surfaces competitors instead of the shop.

**The diagnosis:** this is almost never a review-count problem. It's an *entity
resolution* problem — Google isn't confident which business the name refers to,
so it falls back on nearby businesses with stronger, more consistent signals.
Everything below is aimed at making the shop the unambiguous answer.

---

## Why the shop is currently losing

Based on what's publicly visible right now:

| Signal | Current state | Impact |
|---|---|---|
| Website | **Down.** Domain resolves to nothing. | 🔴 Severe. Google drops the site from the index and the GBP's website link 404s — a strong negative quality signal. |
| GBP reviews | **1 review, 2.3★** | 🔴 Severe. Below ~4.0 with almost no volume, Google is reluctant to surface you and users won't click. |
| GBP claimed? | Unknown, looks neglected | 🔴 Unclaimed profiles rank far below claimed ones. |
| NAP consistency | **Poor.** Four phone numbers, two conflicting street names for Branch 2, Çerkezköy/Kapaklı and 59500/59510 mixed across directories. | 🟠 High. This is a primary confusion source. |
| Duplicate listings | Two unclaimed Yandex listings, Foursquare, Yelp — all stale | 🟠 Medium. Splits your signal. |
| Categories | Unknown | 🟠 Wrong primary category alone can sink you. |
| Photos | 1 photo on GBP | 🟡 Profiles with 10+ photos get materially more calls and direction requests. |

**Read that table again in order.** The site being down and the profile being
unclaimed dominate everything else. Fixing those two is worth more than any
number of reviews.

---

## Phase 1 — Stop the bleeding (this week)

1. **Get the domain resolving again**, even if only to a one-page "coming soon"
   with name, address, phone and hours. A live one-pager beats a dead domain by
   a wide margin. Deploy this repo to Vercel and point DNS at it.
2. **Claim the Google Business Profile.** Place ID `ChIJHUgV0gQmtRQRsb2D_txDS2Q`.
   - Search the shop on Google Maps → "Claim this business" / "Bu işletmeyi talep et".
   - If someone in the family already owns it, recover access instead of creating a
     duplicate. **Never create a second profile for the same location** — duplicates
     get merged or suspended and you lose the review history.
   - Verification in 2026 is usually **video**: one continuous, unedited 30s+ clip
     from a phone showing (a) the street and neighbouring shops, (b) the permanent
     signage with the business name, (c) you unlocking/operating inside — till,
     back room, keys. No people talking, no cuts. Review takes up to 5 business days.
3. ⚠️ **Read [`google-profile-claiming.md`](google-profile-claiming.md) before you
   touch anything on Google.** The profile is already claimed by someone unknown —
   likely the former partner or the old web developer. There is a proper ownership-
   request route that gets you the existing listing in 3–7 days. Creating a new
   profile and reporting the old one will get *your* new one suppressed instead.

## Phase 2 — Make the profile unambiguous (week 2)

4. **AMENDED — set the name to exactly `Trakya Kapaklı Kuyumculuk`**, title case, no
   added keywords. Stuffing ("Trakya Kapaklı Kuyumculuk Altın Pırlanta Tekirdağ") is a
   policy violation and a common cause of suppression, and so is ALL-CAPS: Google
   guidelines prohibit unnecessary capitalisation, and all-caps names have been treated
   as a name policy violation. Where the site shows caps, that is a CSS treatment, not
   the stored name.
5. **Primary category: `Kuyumcu` (Jewelry store).** Secondary categories only for
   things genuinely offered — `Kuyumcu tamiri`, `Altın alım satımı`, `Saatçi`.
   The primary category is one of the strongest ranking factors in local search.
6. **Fix NAP everywhere to one canonical form**, taken from `content/site.ts`:
   ```
   Trakya Kapaklı Kuyumculuk
   Cumhuriyet Mah., Pınar Bulvarı No: 56/C
   59510 Kapaklı / Tekirdağ
   0282 717 21 31
   ```
   Update: GBP, website, Instagram bio, Facebook, Yandex (claim both listings),
   Foursquare, Yelp, bulurum, ellidokuz, esnaf.pro. Same characters every time —
   "Blv." vs "Bulvarı" vs "Bulvarı" matters more than it should.
7. **Drag the map pin to the actual shop door.** Sources disagree by ~150m, which
   suggests the pin is wrong. This directly affects "kuyumcu near me" results.
8. **Upload 15–25 photos**: exterior with signage (critical — it's what Google
   matches against your verification video), interior, display cases, team,
   and product shots. Geotagging isn't necessary; quality and recency are.
9. **Add the website link and hours**, matching the site exactly.

## Phase 3 — Earn reviews legitimately (ongoing)

This is where the ranking gap actually closes — but it has to be done the real way.

**What works:**

- **Ask every satisfied customer, in person, at the moment of purchase.** Jewelry
  buyers are emotional buyers — wedding rings, engagements, new babies. That's the
  best review moment you'll ever get. A staff member simply saying "Google'da bizi
  değerlendirir misiniz?" while handing over the box converts remarkably well.
- **Make it one tap.** Generate the short review link from the GBP dashboard
  ("Ask for reviews"), turn it into a QR code, and put it on the counter, on the
  receipt, and on the ring box insert.
- **Follow up on WhatsApp** a day or two after a big purchase with a thank-you and
  the link. Personal, not bulk.
- **Reply to every review**, including the 2.3★ one. A calm, specific, non-defensive
  reply to a bad review is read by everyone who sees the profile and often
  prompts the reviewer to update it. Google also treats owner responsiveness as
  an engagement signal.
- **Target a steady trickle** — 2–4 per week beats 30 in one weekend, which looks
  exactly like a purchased burst.

**What will get the listing penalized or removed — do not do these:**

- Writing reviews yourself, or from family/staff accounts.
- Buying reviews, or trading them with other businesses.
- **Offering any incentive for a review** — discounts, prizes, loyalty points,
  a free cleaning. As of Google's March 2026 policy update this is explicitly
  banned, even when the review is honest. This one catches a lot of well-meaning
  shop owners.
- Asking only happy customers while filtering out unhappy ones ("review gating").
- Bulk-requesting from a list of people who didn't actually buy anything.

**The enforcement is real, not theoretical:** Google removed or blocked 240M+
policy-violating reviews and took down 12M fake business profiles in 2024, with
deletion rates rising over 600% in early 2025. Penalties escalate from hiding
individual reviews → a public "suspicious reviews" warning banner on your profile
→ blocking new ratings → removing the listing from Search and Maps entirely.

For a shop whose entire problem is *not being found*, a suspension would be
catastrophic and slow to reverse. The honest path is also the fast path here:
a real shop with real customers in a small district can realistically get to
30–50 genuine reviews in a few months, which is more than enough to dominate
local results in Kapaklı.

## Phase 4 — Consolidate (month 2+)

10. **Google Search Console** — verify the domain, submit `sitemap.xml`, and use
    the URL Inspection tool to force a re-crawl of the homepage.
11. **Post to GBP weekly** — new arrivals, bayram hours, a nişan set photo. Posts
    are a freshness signal and take two minutes.
12. **Build local citations** — Kapaklı/Çerkezköy chamber of commerce, local
    business directories, the Kuyumcular Odası listing. Same NAP every time.
13. **Add a page per product category with real photos and real text.** Thin
    pages don't rank; a genuine "Alyans" page with 300+ words and your own photos
    will pick up long-tail searches like "kapaklı alyans fiyatları".
14. **Track it.** Note the GBP "views/searches/calls" numbers monthly so you can
    tell what's actually working instead of guessing.

---

## Realistic timeline

| When | Expected |
|---|---|
| Week 1 | Site live, claim submitted |
| Week 2–3 | Verification passed, profile fully populated |
| Week 4–8 | Name searches start resolving to you; review count climbing |
| Month 3–6 | Ranking for "kapaklı kuyumcu" type terms; 30+ reviews |

Local SEO is slow at first and then compounds. The single highest-leverage hour
you can spend is claiming the profile and getting the video verification right.

## Sources

- [Verify your business with a video recording — Google Business Profile Help](https://support.google.com/business/answer/14271705?hl=en)
- [Google Business Profile Verification in 2026 — JXT Group](https://www.jxtgroup.com/google-business-profile-verification-in-2026-new-warnings-video-requirements-how-to-stay-compliant/)
- [Google review policy in 2026 — Birdeye](https://birdeye.com/blog/google-review-policy/)
- [Google Business Profile review policy update (April 2026) — Launchcodex](https://launchcodex.com/blog/seo-geo-ai/google-business-profile-review-policy-update/)
- [Google fake reviews crackdown — Marketing Growth Hub](https://www.marketinggrowthhub.com/google-fake-reviews-crackdown/)
- [FTC Review Rules for Google Business Profiles](https://www.leadoracle.ai/blog/ftc-review-rules-google-business-profiles)
