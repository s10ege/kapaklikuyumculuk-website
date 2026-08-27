# Index & Listing Cleanup Plan

> **Amended 2026-08-27.** Two things in this document were superseded — the canonical
> trade name, and the Search Console removal list. Both are corrected inline and marked
> **AMENDED**. See `plan.md` and `FINAL.md`.

Goal: make the internet agree on **one** version of who this business is, where it
is, and how to reach it — before the new site launches.

This is the unglamorous work that actually fixes the "competitors show up when you
search our name" problem. Doing it *before* launch means the new site arrives into
a clean environment instead of adding a tenth conflicting version of your address.

---

## Why this comes first

Google resolves a search like "kapaklı kuyumculuk" by deciding *which real-world
entity* you mean. It does that by cross-referencing signals across the web. Right now
those signals contradict each other:

- **Your name is attached to two different addresses** — yours on Pınar Bulvarı, and
  the former partner's on Atatürk Mahallesi. That shop is a separate business under a
  different name now, but the directories never got the memo. **This is the most
  damaging signal of the lot**, and the one most likely to be causing the exact
  symptom you described.
- **4 phone numbers** across listings — only two are yours (0282 717 21 31 · 717 55 62).
  The other two (717 85 88 · 717 39 87) belong to the former partner's shop.
- **2 districts** (Kapaklı vs Çerkezköy) and **2 postal codes** (59510 vs 59500)
- **3+ name variants** (Kapaklı Kuyumculuk · Kapaklı Kuyumcusu · Trakya Kapaklı Kuyumculuk)
- **A dead website** that every listing still links to
- **An Instagram account belonging to a different shop in Şanlıurfa** attributed to you

Faced with that, Google hedges — and a competitor with one consistent address and
a working website wins. **Consistency beats volume.** Ten listings that agree
outperform forty that don't.

---

## Step 1 — Lock the canonical record (do this before touching any listing)

Nothing gets edited until the family confirms the disputed facts in
`open-questions.md`. Editing listings to a *wrong* value is worse than leaving them
inconsistent, because you'd be manually propagating the error.

Once confirmed, write the canonical form down and never deviate — same characters,
same abbreviations, same order, everywhere:

```
Trakya Kapaklı Kuyumculuk
Cumhuriyet Mah., Pınar Bulvarı No: 56/A
59510 Kapaklı / Tekirdağ
0282 717 21 31
https://www.kapaklikuyumculuk.com
```

There is **one** location. Any listing showing a second address under your name is
the former partner's shop and needs correcting, not reconciling.

Details that seem petty and are not: `Bulvarı` vs `Blv.` vs `Bulv.` · `No: 56/A` vs
`No:56/A` · `Kapaklı/Tekirdağ` vs `Kapaklı / Tekirdağ`. Pick one. Use it.

**AMENDED — the trade name is decided: `Trakya Kapaklı Kuyumculuk`.** This document
originally recommended "Kapaklı Kuyumculuk" because it matches the domain and most
listings. Soner chose the fuller name; it is now the canonical string everywhere, in
**title case** (ALL-CAPS risks a Google Business Profile name policy violation — where
the design shows caps, that is a CSS treatment, not the stored name). "Kapaklı
Kuyumcusu" should still be retired everywhere you control.

The decision only works if every listing moves to it in the same week. Publishing it
while the directories still say something else adds a *fourth* variant instead of
replacing three.

## Step 2 — Get something live at the domain

Currently the domain has no A record, so every listing that links to your website
sends visitors nowhere, and Google sees a dead link on the profile.

A single static holding page — logo, address, phones, hours, a map link —
is enough and takes an hour. Do this before the cleanup, so that when you update
each directory, the website field you enter actually works.

Details in `roadmap.md`.

## Step 3 — Audit what's out there

Search these and record what each one currently says. A simple table of
*platform · what it claims · is it claimable · claimed by us?* is enough.

**Priority — these carry ranking weight:**

| Platform | Known state | Action |
|---|---|---|
| **Google Business Profile** | Exists. Place ID `ChIJHUgV0gQmtRQRsb2D_txDS2Q`. 2.3★ / 1 review. **Claimed by an unknown party.** | **Request ownership — top priority.** Follow `google-profile-claiming.md`, not the instinctive route |
| Apple Maps (Business Connect) | Unknown | Claim — matters for iPhone users |
| Yandex Maps | Two unclaimed listings: `59745993670` (yours, Pınar Blv.) and `208746157258` (Atatürk Mah. — **the former partner's**) | Claim yours. Leave his alone, but get your name off it |
| Instagram | @kuyumculukkapakli is genuinely yours | Fix bio to canonical NAP + website |
| Facebook | Page `537179436417060` | Claim, fix NAP, link to Instagram |

**Secondary — mostly about consistency, not traffic:**

| Platform | Known state | Action |
|---|---|---|
| bulurum.com | Two records under your name — one is the former partner's shop | Request correction / removal of the Atatürk Mah. record |
| ellidokuz.com | Lists Atatürk Mah. / İstiklal Cad. under your name — **wrong shop entirely** | Request correction |
| esnaf.pro | **Poor quality.** Contains a Malatya phone number and links the wrong Instagram | Request correction or delisting |
| firmasec.com | Pınar Blv. 56 | Correct |
| taksitlibilezik.com | Has coordinates | Correct |
| Foursquare | ~70 visitors, 2 photos, unclaimed | Claim |
| Yelp | "KAPAKLI KUYUMCUSU" | Correct name, low priority in Turkey |
| Çerkezköy TSO | Registry data — authoritative, leave alone | Verify only |

## Step 4 — Fix the wrong-Instagram problem

`esnaf.pro` links **@kapaklikuyumculuk** to your business. That account is a jeweller
in **Şanlıurfa** — completely unrelated. This actively teaches Google that your
business name maps to someone else's entity.

- Request correction from esnaf.pro
- Check whether any other directory repeats the same error
- Make sure the correct handle (**@kuyumculukkapakli**) is listed everywhere instead
- Consider registering @kapaklikuyumculuk-style handle variants you're not using, so
  the confusion can't recur — but don't impersonate or dispute the Şanlıurfa shop's
  account, they got there first and are presumably legitimate

## Step 5 — Disentangle the former partner's shop

The highest-value cleanup in this document, and the one nobody would think to do.

Since the split, the Atatürk Mahallesi shop is a separate business under a different
name. But across the web it's still listed as **Kapaklı Kuyumculuk** — same name as
you, different address, different phone. From Google's point of view your business
name currently resolves to two locations in one small district, which is exactly the
kind of ambiguity that makes it show *neither* of you confidently.

For each directory carrying the Atatürk Mah. address under your name:

- Request that the record be **corrected or removed**, not merged into yours
- Where you can edit directly, remove **0282 717 85 88** and **0282 717 39 87**
- Note the correction request date — most Turkish directories take weeks and need chasing

**Tone matters here.** You're correcting stale data about your own business, not
attacking his. Frame every request as "this listing shows my business name at an
address that is not mine" — factual, easy for a moderator to action, and true.

Don't touch his *own* listings under his *own* name. That's his business and none of
this is about competing with him.

## Step 6 — Handle duplicates carefully

Duplicate listings split your signal. The fix is *merge* or *correct*, never
*delete-and-recreate*.

- **Never create a second Google profile for a location that already has one.**
  You'd lose the review history and risk suspension. See `google-profile-claiming.md`
  — there's a proper access-request route for a profile you can't log into.
- If you find genuine duplicates of *your* shop, use "Suggest an edit → Close or
  remove → Duplicate" and point at the one you're keeping.
- Retire the "Kapaklı Kuyumcusu" name variant wherever you can edit it.

## Step 7 — Old URLs and the search index

**Largely done, 2026-08-19.** Full inventory and reasoning in
[`old-site-map.md`](old-site-map.md) and [`old-urls.txt`](old-urls.txt).

What was found: **309 unique old URLs** recovered from Archive.org, across two
generations of the site. Six are confirmed still visible in Google today — and they
look bad, carrying titles like "Just another WordPress site", "Archives" and "© 2016".
All of them returned Vercel's English `404: NOT_FOUND` screen.

What was shipped into `holding-page/`:

- [x] **`vercel.json`** — every generation-1 and generation-2 content path 301s to `/`.
      Also redirects the `*.vercel.app` hostnames to the real domain; they were serving
      an indexable duplicate of the homepage.
- [x] **`404.html`** — branded Turkish page with the phone number and address, instead
      of Vercel's error screen. WordPress internals (`/wp-admin`, `/author/*`,
      `/wp-content/*`) are deliberately left at 404 and now land here.
- [x] **`robots.txt`** — did not exist at all; the path returned 404.
- [x] **`sitemap.xml`** — did not exist either.

Still to do, and it needs a human:

- [ ] **Verify the domain in Google Search Console** — DNS TXT record via the Natro
      panel. Choose **Domain property**, not URL-prefix: the old URLs are indexed as
      `http://www.`, and only a domain property covers every host and scheme variant.
- [ ] Submit `sitemap.xml`, then URL Inspection → Request indexing on the homepage
- [ ] **AMENDED — Removals → Remove all URLs with this prefix** for `/urun/`,
      `/wp-content/` and `/author/`. **Not `/urunler/`.** This list originally included
      `/urunler/`, written when only a holding page was live. `/urunler/` is now the live
      catalogue — removing that prefix would hide all five category pages from Google for
      about six months, and it would look exactly like a working site while it happened.
      The removals hide the rest within hours. Temporary (~6 months); the permanent
      removal is the 301/404 doing its work underneath.
- [ ] Bing Webmaster Tools — same sitemap, same removal list
- [ ] Yandex Webmaster — matters more than Bing in Turkey

Expected timing: removals bite in 4–24 hours; the 301s land in the index over 1–4
weeks; old images fade from Google Images over 4–12 weeks.

**When the real site launches**, change the `destination` values in `vercel.json` to
the real category pages. Do not delete the file.

## Step 8 — Re-verify after 30 days

Search the shop name again from a logged-out browser, ideally on mobile and from a
Kapaklı-area connection if possible. Record what appears. Compare monthly.

Things to watch: does your listing appear for the exact name? Does the map pack show
you first? Are the competitors still above you? Is the website link live?

---

## Sequencing note

Steps 1 and 2 gate everything else. There's no point editing thirty directory
listings until you know the correct address to put in them and have a working
website to point at.

Realistic effort: **Step 1** is a conversation with the family. **Step 2** is an
hour. **Steps 3–5** are a few hours spread over a week, mostly waiting on directory
support responses. **Step 7** happens at launch. **Step 8** is fifteen minutes a month, forever.
