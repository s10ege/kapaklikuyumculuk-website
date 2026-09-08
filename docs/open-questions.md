# Open Questions

Updated 2026-08-03. Turkish version for the family: **`aile-sorulari.md`**

---

## ⏳ Urgent

- [ ] **Restore the A record to `94.73.146.147`** (plus a `www` record) and see whether
      the old site comes back. Five minutes, reversible, and it may recover everything.
- [ ] **Who built the old website?** No hosting package exists on the Natro account,
      so the files were probably under the developer's own reseller account. Fastest
      route to the old product photos if the A-record test fails.
- [ ] **Send the Natro support ticket** — ready to copy-paste in `natro-destek-talebi.md`
- [ ] **Is 2FA enabled on the Natro account?** If not, enable it today.
- [ ] **Which email address is the Natro account registered to?** Whoever controls
      that mailbox controls the domain.
- [ ] **Is auto-renew armed, on a card valid past July 2027?**

## 🔴 Blocking — before any listing or page goes live

- [ ] **Ramazan/bayram hour variations?** The seasonal pattern itself is resolved
      (see below); religious-holiday hours are not, and the site currently claims
      nothing about them.
- [ ] **Is 0282 717 55 62 still in use?** And which number should be the primary one?
- [ ] **Whose Google account holds the profile?** Former partner, old developer, or a
      family member? Google will show a masked version of the email when you submit
      the ownership request — that's often enough to identify them.
- [ ] **Can the former partner be contacted?** If the profile sits on his account, a
      phone call resolves this in minutes instead of weeks. See `google-profile-claiming.md`.
- [ ] **The 2.3★ review** — who left it, and does the family want to reply publicly?
- [ ] **Canonical trade name** — recommend **Kapaklı Kuyumculuk** (matches the domain
      and the old site). Retire "Kapaklı Kuyumcusu" and "Trakya Kapaklı Kuyumculuk"
      everywhere you can edit.

## 🟡 Content

- [ ] **Photos.** The biggest gap. Storefront with clear signage (needed for Google's
      video verification too), interior, display cases, products.
- [ ] **Instagram handle** — confirm @kuyumculukkapakli is yours.
      (NOT @kapaklikuyumculuk — that's a jeweller in Şanlıurfa.)
- [ ] **WhatsApp** — is 0554 915 77 90 correct and monitored?
- [ ] **Real product categories** — the current list is partly inferred from a
      low-quality directory. Prune to what's actually sold.
- [ ] **Brands carried** — confirm, and check whether any agreement restricts showing
      logos online.
- [ ] **Is the "1 yıl bakım/onarım/ayar garantisi" real?** Strong selling point if yes;
      don't publish it if not.
- [ ] **Keep the "ilçenin ilk kuyumcusu" claim?**
- [ ] **When did the partnership split?** Useful when asking directories to correct
      stale records.

## 🟢 Decisions for you

- [ ] **Business email** — `info@kapaklikuyumculuk.com` via Google Workspace or Zoho.
      Needed for the Google profile. Must NOT be the domain's recovery address.
- [ ] **Move DNS to Cloudflare?** Free, faster, easier DNSSEC. Safe now, since no
      email runs on the domain.
- [ ] **Showcase site or e-commerce?** Recommend showcase.
- [ ] **Live gold price widget?** Popular on Turkish jeweller sites; good reason for
      repeat visits.

---

## ✅ Resolved

- ~~Exact door number — 56 or 56/A?~~ → **56/C**, confirmed by Soner 2026-09-08 and
  published. Note the Çerkezköy TSO registry says 56/A; that entry is quoted as-is in
  `business-facts.md` rather than corrected, because its value as evidence depends on
  being an accurate quotation.
- ~~Opening hours — 09:00–20:00 or 08:00–19:00?~~ → **Both were half-right.** The
  closing time is seasonal: 09:00–19:00 May–September, 09:00–18:00 October–April,
  Monday–Saturday, closed Sunday. The site publishes both seasons all year rather than
  computing one, because it is statically generated.
- ~~Coordinates disagree by ~150 m~~ → **41.326459, 27.976502**, from the shop's own
  Google Maps listing, with place ID `ChIJSQxn1KkptRQRLtfCCLZCYLk`. The JSON-LD carries
  `geo` and `hasMap` as of 2026-09-08.
- ~~"Ziraat Bankası karşısı" — keep as a landmark?~~ → **Retired 2026-09-08.** A
  landmark is a second address in everything but name, and it decays silently when the
  branch moves.
- ~~Two branches?~~ → **One shop.** There was a partner; the shops were divided. The
  Atatürk Mahallesi location is now the former partner's, under a different name.
  **Your shop is Pınar Bulvarı No: 56/C.**
- ~~Which phones are ours?~~ → **0282 717 21 31** (primary) and **0282 717 55 62**.
  The 717 85 88 and 717 39 87 numbers belong to the former partner's shop and must be
  scrubbed from listings that still show them under your name.
- ~~Branch 2's street name conflict~~ → **Moot.** Not your address.
- ~~Is there email on the domain?~~ → **No.** No MX records. A leftover SPF record
  suggests mail existed once. Nothing to preserve; DNS changes are safe.
- ~~The $150/year domain cost~~ → **Now ~$30. Resolved.**
- ~~Registrar access?~~ → **Full login.**
- ~~Who is the registrar?~~ → **Nics Telekomünikasyon A.Ş. (NicProxy)**, IANA 1454.
  Natro is the reseller; escalation above them goes to NicProxy.
- ~~Domain at risk of expiring?~~ → **No.** Paid to 19 July 2027, transfer lock on.
- ~~Is there a Natro hosting package?~~ → **No.** Either deleted or never on this
  account. Ticket drafted.
- ~~What happened on 27 July 2026?~~ → **Soner's own transfer attempt.** He tried to
  move the domain to another registrar; it was blocked because the renewal was only
  days earlier, and the A record was removed in the process. No third party involved.
  **The site is down for a reversible reason, not a lapsed payment.**
- ~~Should we transfer the domain to another registrar?~~ → **Not now.** ICANN's
  60-day lock and the 45-day post-renewal window both applied. At ~$30/year there's
  no reason to. If wanted later, the safest window is 2–3 months before the July 2027
  expiry.
- ~~Should we create a new Google profile and report the old one?~~ → **No.** That
  route gets your new profile suppressed, not the old one. Use the ownership-request
  flow instead — see `google-profile-claiming.md`.
