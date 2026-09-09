# Business Facts — Source of Truth

Compiled 2026-08-03 from public sources, revised after clarification from Soner.

Confidence: ✅ confirmed · 🟡 single source · ❌ conflicting or not found

---

## ⚠️ Key correction — there is ONE shop, not two

The old website (last updated ~2022) says *"Kapaklı ilçesinde **iki şube** ile
hizmet vermektedir."* **This is no longer true.**

There was a business partner. The partnership ended and the shops were divided.
The Atatürk Mahallesi location now belongs to the former partner and **trades under
a different name**.

**Everything at Atatürk Mahallesi is somebody else's business.** Its phone numbers,
its address, its listings — none of it should appear anywhere on the new site, in
structured data, or on the Google profile.

This reframes the whole cleanup: the job isn't to reconcile two branches, it's to
**disentangle one business from another**.

---

## The shop

| Fact | Value | Conf. |
|---|---|---|
| Trade name | **Kapaklı Kuyumculuk** | ✅ |
| Legal entity | Trakya Kapaklı Kuyumculuk Emlak İnşaat ... Sanayi Ltd. Şti. | ✅ |
| **Address** | **Cumhuriyet Mah., Pınar Bulvarı No: 56/C, 59510 Kapaklı / Tekirdağ** | ✅ confirmed by Soner 2026-09-08 |
| ~~Landmark~~ | ~~Ziraat Bankası karşısı~~ | **retired 2026-09-08** — see below |
| **Primary phone** | **0282 717 21 31** | ✅ 4+ sources; used in old site title tag |
| Second phone | 0282 717 55 62 | ✅ 3 sources — confirm still in use |
| ~~WhatsApp~~ | ~~0554 915 77 90~~ | **retired 2026-09-08** — see below |
| Coordinates | 41.326459, 27.976502 | ✅ the shop's own Google Maps listing, 2026-09-08 |
| Google Place ID | `ChIJSQxn1KkptRQRLtfCCLZCYLk` | ✅ same listing |
| Founded | 2000 | ✅ |
| Oda Sicil No | 3037 (Çerkezköy TSO) | 🟡 authoritative registry |
| Ticaret Sicil No | 3230 | 🟡 authoritative registry |
| NACE | 47.77.01 — altın/mücevherat perakende | 🟡 authoritative registry |
| Owner / responsible | Filiz Eroğlu · Nuri Eroğlu | ✅ |
| Email | **None exists.** No MX records on the domain. | ✅ verified by DNS lookup |

**Note:** the Çerkezköy TSO registry places the Ltd. Şti. at Pınar Bulvarı 56/A —
i.e. at *this* shop. That's an independent official record and the strongest
documentary evidence available if the Google ownership request is ever disputed.

⚠️ **The registry says 56/A and the door says 56/C.** Soner confirmed 56/C on
2026-09-08 and the site publishes that. The registry line is *not* corrected here,
because it is a quotation of an official record and its value is that it is quoted
accurately — an ownership claim resting on a document we have edited is worth
nothing. Expect Google to see both; the site, the profile and the signage should
all say 56/C, and the registry entry is supporting evidence that the company is at
this address on this street, not a competing address.

**WhatsApp is retired.** `0554 915 77 90` came from the Instagram bio and was graded 🟡
for its whole life, so `contact.whatsapp.pending` never flipped and the site never emitted
a single `wa.me` link — every button always fell back to `tel:`. Soner's decision on
2026-09-08 was to remove it outright: the shop takes calls and does not want to be reachable
on WhatsApp. A channel nobody watches is worse than no channel at all — the customer
messages and hears nothing back.

The number is deleted from `lib/config.ts` rather than left `pending`, so nothing can render
it and no future session finds a filled-in value that only needs a boolean flipped. It is
recorded here and nowhere else. **Do not reintroduce it without asking Soner.** This
reverses `TECHNICAL.md` §9, which made WhatsApp "the site's one CTA".

**The landmark is retired.** "Ziraat Bankası karşısı" came from the Instagram bio
and was published under the address in the footer, on `/iletisim`, on `/hakkimizda`
and on the 404. It was removed on 2026-09-08 — not because it was wrong, but because
a landmark is a second address in everything but name, and this file exists because
the shop already has two circulating. It also decays without telling anyone: branches
close and move. The exact door number and a real map pin do the job it was standing
in for. Do not reintroduce it.

## ⛔ NOT this business — the former partner's shop

Recorded here so it doesn't get reintroduced by mistake.

| Item | Value |
|---|---|
| Address | Atatürk Mah., İstiklal Cad. *or* Kurtuluş Cad. 1/A (sources conflict — irrelevant now) |
| Phones | **0282 717 85 88** and **0282 717 39 87** |
| Current name | Different — trades under its own name now |

**Action:** these must be removed from every listing that still shows them as
"Kapaklı Kuyumculuk". Directories still carrying them are actively teaching Google
that your business name maps to two different addresses — a plausible cause of the
ranking problem.

## Hours

| Fact | Value | Conf. |
|---|---|---|
| Hours | 09:00–20:00 (what Google shows) **vs** 08:00–19:00 (2 sources) | ❌ **unresolved — ask** |
| Sunday | Closed | ✅ |

## Digital presence

| Item | State | Conf. |
|---|---|---|
| Website | **LIVE since 2026-09-09.** The real site is deployed at the canonical domain. *(Was dark from ~27 July 2026; see `domain-facts.md`.)* | ✅ |
| Google Business Profile | **`ChIJSQxn1KkptRQRLtfCCLZCYLk` — "Trakya kuyumculuk", Pınar Blv 56/C, 4,1★ / 15 reviews, category Kuyumcu, website already set, appears claimed.** Phone on the profile is `0554 915 77 90` — the retired WhatsApp number. **Soner's decision 2026-09-09: it stays on the profile.** Do not "correct" it. It remains forbidden in repo source. | ✅ |
| ⛔ NOT our profile | `ChIJHUgV0gQmtRQRsb2D_txDS2Q` is **"Vural Kuyumculuk", Atatürk Mah., Hürriyet Cd., Çerkezköy** — a different business at the former partner's address. Recorded here as ours until 2026-09-09, when both IDs were resolved in a browser. **Never request ownership of it.** | ✅ |
| Instagram | **@kuyumculukkapakli** — matches address and phones | ✅ |
| Instagram (wrong) | ⚠️ @kapaklikuyumculuk is a **different jeweller in Şanlıurfa**. Never link it. | ✅ |
| Facebook | facebook.com/537179436417060 | ✅ |
| Yandex Maps | Two unclaimed listings, 0 reviews — one is the former partner's | ✅ |
| Foursquare / Yelp | Stale listings exist | 🟡 |

## Products & services

- **From the old site:** altın, pırlanta, çeşitli saat markaları, özel tasarım takılar ✅
- **From one low-quality directory (unverified 🟡):** 8/10/14/22/24 ayar; beşi bir
  yerde; gremse; künye; alyans; küpe; gerdanlık; erkek grubu; hızma; tragus; heliks;
  kelepçe; kolye ucu; su yolu; Trabzon set; nişan ve düğün setleri; çocuk grubu
- **Brands (unverified 🟡):** Cetaş, Midas, Özyurt Bilezik, Koçak Gold, Esgold, İAR,
  Harem, Nadir Gold
- **Policies (unverified 🟡):** kredi kartına taksit; 1 yıl bakım/onarım/ayar garantisi

All of the 🟡 items need confirming — see `aile-sorulari.md`.

## Context: Kapaklı vs Çerkezköy

Kapaklı was **part of Çerkezköy until 2012**, when it became its own district of
Tekirdağ. Many directory listings still say "Çerkezköy" and postal code 59500.

Correct modern form: **`… Kapaklı / Tekirdağ, 59510`**

Combined with the partner split, this means a lot of listings are wrong in *two*
independent ways.

## Sources

- [Çerkezköy TSO registry](https://www.cerkezkoytso.org.tr/firma-3037-trakya_kapakli_kuyumculuk_emlak_insaat_ve_insaat_malzemeleri_otomotiv_petrol_tekstil_iletisim_matbaacilik_radyo_ve_televizyon_turizm_sanayi_limited_sirketi.html) — authoritative
- [Bulurum](https://www.bulurum.com/dir/kuyumcular/kapakli/) · [ellidokuz](https://www.ellidokuz.com/firma-rehberi/kuyumcular-sarrafiye/kapakli-kuyumculuk/71/10703) · [firmasec](https://www.firmasec.com/firma/kbcmbb-kapakli-kuyumcusu) · [taksitlibilezik](https://www.taksitlibilezik.com/kuyumcu/kapakli-kuyumculuk-kapakli-tekirdag-d3f93e01)
- [Yandex Maps 1](https://yandex.com.tr/maps/org/kapakli_kuyumculuk/59745993670/) · [Yandex Maps 2](https://yandex.com.tr/maps/org/kapakli_kuyumculuk/208746157258/)
- [directmap.ist](https://directmap.ist/%C3%A7erkezk%C3%B6y/2063) — mirrors Google data
- [esnaf.pro](https://esnaf.pro/firmalar/kapakli-kuyumculuk-tekirdag-pinar-bulvari-n56a-cumhuriyet/tekirdag/p/0927/05452763318-02827172131-filizeroglu/02827175562/) — low quality; contains a wrong Malatya phone and links the wrong Instagram
