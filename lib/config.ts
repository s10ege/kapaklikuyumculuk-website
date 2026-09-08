/* Every shop-specific value on the site (§8).
 *
 * WHY THIS FILE EXISTS AT ALL
 *
 * The business's ranking problem is not a design problem. Per
 * docs/index-cleanup-plan.md, the shop's name currently resolves to two
 * addresses, four phone numbers, two districts and three name variants across
 * the web, and Google hedges. The README's instruction is explicit: business
 * data should live in exactly one file that the site, the structured data and
 * the Google profile all read from — "the architecture should make it hard to
 * reintroduce" inconsistency.
 *
 * So: no address, phone number or opening hour is written anywhere else in this
 * codebase. Footer, İletişim page, JSON-LD and sitemap all read from here.
 *
 * CONFIDENCE GRADES come from docs/business-facts.md and travel with the value:
 *   ✅ confirmed · 🟡 single source · ❌ conflicting or not found
 * Nothing marked ❌ is published as fact.
 */

export type Fact<T> = {
  readonly value: T;
  /** While true, components soften, reroute or hide the affected UI (§8).
   *  Turning a pending value on is one edit here and nothing else. */
  readonly pending: boolean;
};

/* ------------------------------------------------------------------------- */
/* Identity                                                                   */
/* ------------------------------------------------------------------------- */

export const shop = {
  /* §2 locks this string. Note it differs from docs/business-facts.md, which
   * grades "Kapaklı Kuyumculuk" as the ✅ trade name, and from
   * docs/index-cleanup-plan.md, which lists "Trakya Kapaklı Kuyumculuk" among
   * the variants to retire. See Risk 1 in plan.md: this choice only works if
   * the Google profile, the Instagram bio and every directory correction move
   * to this exact string too. Otherwise the site becomes a fourth variant. */
  name: "Trakya Kapaklı Kuyumculuk",

  /* ✅ Çerkezköy TSO registry — the authoritative record, and the strongest
   * documentary evidence if the Google ownership request is ever disputed. */
  legalName:
    "Trakya Kapaklı Kuyumculuk Emlak İnşaat ve İnşaat Malzemeleri Otomotiv " +
    "Petrol Tekstil İletişim Matbaacılık Radyo ve Televizyon Turizm Sanayi " +
    "Limited Şirketi",

  founded: 2000, // ✅
  url: "https://www.kapaklikuyumculuk.com",

  /* ✅ Recovered from the old site's Kurumsal page. True, verifiable, and the
   * strongest local claim available. Do NOT revive the old "iki şube ile"
   * wording — the partnership ended and there is one shop now. */
  claim: "Kapaklı'nın ilk kuyumcusu",
} as const;

/* The family. Both names are verified (docs/business-facts.md ✅). They are
 * the captions under the two portraits on /hakkimizda and nothing else —
 * never a byline, never a contact. Roles are captions too, so they read as
 * short as a label: "Kurucu", not a sentence. */
export const people = {
  founder: { name: "Nuri Eroğlu", role: "Kurucu" },
  owner: { name: "Filiz Eroğlu", role: "Mağaza sahibi" },
} as const;

/* ------------------------------------------------------------------------- */
/* Contact                                                                    */
/* ------------------------------------------------------------------------- */

/* Stored as E.164 digits only, and the display form is derived (see
 * formatTrPhone). Storing both would let them drift, and a phone number that
 * disagrees with itself between the footer and the schema is precisely the
 * failure this file exists to prevent. */
export const contact = {
  /** ✅ 4+ sources, and in the old site's title tag for years. */
  phone: { value: "902827172131", pending: false } satisfies Fact<string>,

  /** ✅ 3 sources — worth confirming it is still in use. */
  phoneAlt: { value: "902827175562", pending: false } satisfies Fact<string>,

  /** 🟡 Instagram bio only. Pending until the family confirms it, so every CTA
   *  on the site falls back to tel: until then (§9). The number is filled in
   *  already, so confirming it means flipping this one boolean. */
  whatsapp: { value: "905549157790", pending: true } satisfies Fact<string>,

  /** ✅ ⚠️ NOT @kapaklikuyumculuk. That handle matches our domain but belongs
   *  to a different jeweller in Şanlıurfa, and at least one directory already
   *  attributes it to this business (docs/index-cleanup-plan.md Step 4).
   *  Never inline this string anywhere else. */
  instagram: { value: "kuyumculukkapakli", pending: false } satisfies Fact<string>,

  /** ✅ Verified by DNS lookup: the domain has no MX records, so no email
   *  address exists. The İletişim page therefore has no form and no mailto. */
  email: { value: null, pending: false } satisfies Fact<null>,
} as const;

/* ------------------------------------------------------------------------- */
/* Address — canonical, character-for-character                               */
/* ------------------------------------------------------------------------- */

/* docs/index-cleanup-plan.md: "Details that seem petty and are not: `Bulvarı`
 * vs `Blv.` vs `Bulv.` · `No: 56/A` vs `No:56/A` · `Kapaklı/Tekirdağ` vs
 * `Kapaklı / Tekirdağ`. Pick one. Use it." This is that one. It must match the
 * Google Business Profile exactly (§10).
 *
 * Kapaklı was part of Çerkezköy until 2012, so many listings still say
 * Çerkezköy and postal code 59500. The correct modern form is below. */
export const address = {
  /* ✅ Confirmed 2026-09-08. The door number is 56/C — this file said 56/A
   * until then, carried over from a directory listing. It is the number the
   * Google Business Profile will use, so it has to be right here first. */
  street: "Cumhuriyet Mah., Pınar Bulvarı No: 56/C",
  postalCode: "59510",
  locality: "Kapaklı",
  region: "Tekirdağ",
  country: "TR",

  /** The whole thing, one line, in the canonical spelling. Every other form on
   *  the site is built from this or from the fields above — never typed. */
  get formatted(): string {
    return `${this.street}, ${this.postalCode} ${this.locality} / ${this.region}`;
  },
} as const;

/* "Ziraat Bankası karşısı" was here until 2026-09-08, sourced from the
 * Instagram bio and shown under the address in the footer, on /iletisim, on
 * /hakkimizda and on the 404.
 *
 * It is gone, and not because it was wrong. A landmark is a second address in
 * everything but name, and this project exists because the shop already has
 * two addresses circulating. It also decays without telling anyone: branches
 * close and move, and a jeweller's address that points at a bank which is no
 * longer there is worse than one that points at nothing. The street number is
 * exact and the map has a pin now (see `geo` below), which is what the
 * landmark was standing in for while the coordinates were graded ❌.
 *
 * Do not reintroduce it, in any spelling. */

/* ✅ Confirmed 2026-09-08 from the shop's own Google Maps listing.
 *
 * docs/business-facts.md graded the coordinates ❌ — sources disagreed by
 * ~150 m — and the site published none rather than assert a wrong pin. That is
 * resolved: these come from the listing for "Trakya Kapaklı Kuyumculuk" at
 * Pınar Blv 56/C, so the pin, the address and the place ID all describe the
 * same door. The JSON-LD can carry `geo` and `hasMap`, the İletişim embed can
 * drop to a coordinate pin, and directions can name a destination rather than
 * a search string. */
export const geo = { lat: 41.326459, lng: 27.976502 } as const;

export const googlePlaceId = "ChIJSQxn1KkptRQRLtfCCLZCYLk";

/** The place itself, not a search for it — what `hasMap` should point at. */
export const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`;

export const areaServed = ["Kapaklı", "Çerkezköy", "Tekirdağ"] as const;

/* ------------------------------------------------------------------------- */
/* Hours                                                                      */
/* ------------------------------------------------------------------------- */

/* docs/business-facts.md graded hours ❌ — Google showed 09:00–20:00, two other
 * sources said 08:00–19:00, and the disagreement was never a data-quality
 * problem. The closing time genuinely moves between summer and winter, and
 * every source had captured a different half of a true seasonal pattern.
 *
 * So both seasons ship, both are published, and neither is hidden behind a
 * "current" calculation the visitor cannot check. Soner confirmed the times on
 * 2026-09-08: 19:00 in summer, 18:00 in winter. That supersedes the single
 * 20:00 value this file carried, which was the summer figure rounded up from
 * Google's listing.
 *
 * WHY BOTH ARE ALWAYS SHOWN. The site is statically generated, so a build in
 * August would freeze "summer" into HTML that is still being served in
 * December. Rendering both removes the failure mode entirely: the page is
 * correct whenever it is read, and the only thing needing today's date is
 * which of the two gets the emphasis. That is one small client component
 * (components/OpeningHours.tsx), and if its JavaScript never runs, a visitor
 * still sees both seasons with their months spelled out.
 *
 * Owner-editable in phase two: the Sanity `siteSettings` document (iteration
 * 15) carries these fields so a change of hours needs no deploy. */

export type Season = "summer" | "winter";

export type SeasonHours = {
  /** Rendered as-is, months included — this is what makes the static page
   *  honest without JavaScript. */
  readonly label: string;
  readonly days: string;
  readonly open: string;
  readonly close: string;
  /** Calendar months, 1–12. The two lists must cover all twelve exactly once. */
  readonly months: readonly number[];
};

export const hours = {
  summer: {
    label: "Yaz (Mayıs–Eylül)",
    days: "Pazartesi–Cumartesi",
    open: "09:00",
    close: "19:00",
    months: [5, 6, 7, 8, 9],
  },
  winter: {
    label: "Kış (Ekim–Nisan)",
    days: "Pazartesi–Cumartesi",
    open: "09:00",
    close: "18:00",
    months: [10, 11, 12, 1, 2, 3, 4],
  },
  closed: "Pazar kapalı",
  /** Days matching openingHoursSpecification in schema.org terms. Both seasons
   *  keep the same six days; only the closing time moves. */
  schemaDays: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
} as const;

/** Summer first — the order both seasons are rendered in before hydration. */
export const seasons: readonly Season[] = ["summer", "winter"];

/* Istanbul, not the visitor's clock.
 *
 * `new Date().getMonth()` is the browser's local month, and the one day a year
 * it matters — 30 September into 1 October — a visitor in Auckland would be
 * told the shop keeps winter hours while Kapaklı is still on summer time. The
 * shop is in one timezone and its hours belong to that timezone, so the month
 * is read there. Takes an explicit date so the boundaries can be tested. */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Istanbul",
      month: "numeric",
    }).format(date),
  );

  return (hours.summer.months as readonly number[]).includes(month)
    ? "summer"
    : "winter";
}

/* ------------------------------------------------------------------------- */
/* Services (§2)                                                              */
/* ------------------------------------------------------------------------- */

/* Two, not five. §6.1: "Two reads as deliberate; a padded list of five reads
 * as filler." Long-form copy lives on the Hizmetler page, not here. */
export const services = [
  { slug: "altin-alim-satim", name: "Altın Alım–Satım" },
  { slug: "siparis-uzerine-uretim", name: "Sipariş Üzerine Üretim" },
] as const;

/* ------------------------------------------------------------------------- */
/* Derived values                                                             */
/* ------------------------------------------------------------------------- */

/** `902827172131` → `0282 717 21 31`.
 *
 * Turkish numbers are 0 + a three-digit code + 3-2-2, for landline and mobile
 * alike, so one formatter covers both and the display form can never drift
 * from the number actually dialled. */
export function formatTrPhone(e164Digits: string): string {
  const national = e164Digits.replace(/\D/g, "").replace(/^90/, "");

  if (national.length !== 10) {
    // Not a shape we know how to format; return it untouched rather than
    // silently printing something that looks like a phone number and is not.
    return e164Digits;
  }

  const a = national.slice(0, 3);
  const b = national.slice(3, 6);
  const c = national.slice(6, 8);
  const d = national.slice(8, 10);
  return `0${a} ${b} ${c} ${d}`;
}

/** `902827172131` → `tel:+902827172131` */
export function telHref(e164Digits: string): string {
  return `tel:+${e164Digits.replace(/\D/g, "")}`;
}

export const phoneDisplay = formatTrPhone(contact.phone.value);
export const phoneHref = telHref(contact.phone.value);
export const phoneAltDisplay = formatTrPhone(contact.phoneAlt.value);

export const instagramUrl = `https://www.instagram.com/${contact.instagram.value}/`;

/** The full address on one line, for maps queries and meta descriptions.
 *  Kept as a named export because half the site imports it; it is the getter
 *  above and cannot drift from it. */
export const addressOneLine: string = address.formatted;

/** Address block as rendered in the footer and on İletişim. */
export const addressLines = [
  address.street,
  `${address.postalCode} ${address.locality} / ${address.region}`,
] as const;

/* §6.7 — the keyless embed, so no Maps API key is needed.
 *
 * Keyed on coordinates, not on the address string. The address-keyed form
 * (`?q=<name> <address>&output=embed`) is what this was until 2026-09-08, and
 * it rendered a *route* — Google resolved the query as a destination and drew
 * a line to it from "Kapaklı", which is a direction card, not a shop location.
 * A visitor looking for where the shop is got a trip planner starting from a
 * town centre they had not asked about.
 *
 * `q=<lat>,<lng>` drops a single pin and nothing else. `z=17` is street level
 * — close enough to see which side of the road it is on, wide enough to show
 * the junction people navigate by. `hl=tr` keeps the map's own labels Turkish. */
export const mapsEmbedUrl = `https://maps.google.com/maps?q=${geo.lat},${geo.lng}&z=17&hl=tr&output=embed`;

/* ------------------------------------------------------------------------- */
/* Directions                                                                 */
/* ------------------------------------------------------------------------- */

/* Both name the destination by coordinates rather than by a search string, so
 * the app opens on this shop instead of resolving a name that — as
 * docs/index-cleanup-plan.md documents at length — currently resolves to two
 * different addresses.
 *
 * Google also takes the place ID, which is stronger still: it names the
 * listing, so the destination card shows the shop's own name and hours rather
 * than a dropped pin. Apple has no equivalent, so `q` carries the name for the
 * label only; `daddr` is what it actually navigates to. */
export const directions = {
  google:
    "https://www.google.com/maps/dir/?api=1" +
    `&destination=${geo.lat},${geo.lng}` +
    `&destination_place_id=${googlePlaceId}`,
  apple:
    `https://maps.apple.com/?daddr=${geo.lat},${geo.lng}` +
    `&q=${encodeURIComponent(shop.name)}`,
} as const;

export type MapsApp = keyof typeof directions;

/** The internal hop (TECHNICAL.md §9).
 *
 *  Vercel Web Analytics is on the free tier, where custom events are Pro-only —
 *  so a click on an outbound link cannot be counted. Routing it through an
 *  internal URL first turns that click into an ordinary page view, which is
 *  free. This is the URL shape the analytics will count; `/yol-tarifi` itself
 *  is a real prerendered page that forwards, not a redirect, because a redirect
 *  renders nothing and would therefore never fire the analytics beacon it
 *  exists to fire. */
export const directionsPath = "/yol-tarifi";

export function directionsHref(app: MapsApp): string {
  return `${directionsPath}?app=${app}`;
}

/* ------------------------------------------------------------------------- */
/* The contact CTA (§9)                                                       */
/* ------------------------------------------------------------------------- */

export type ContactCta = {
  href: string;
  label: string;
  channel: "whatsapp" | "phone";
};

/** The pure form, taking its inputs explicitly.
 *
 * Split out from `contactCta` so both sides of the pending switch can be tested
 * directly. The whole point of §8's mechanism is that flipping one boolean
 * changes every CTA on the site; a test that can only ever observe today's
 * value would not be testing that. */
export function buildContactCta(opts: {
  whatsapp: Fact<string>;
  phoneHref: string;
  productName?: string | undefined;
}): ContactCta {
  if (opts.whatsapp.pending) {
    return { href: opts.phoneHref, label: "Bizi Arayın", channel: "phone" };
  }

  const message = opts.productName
    ? `Merhaba, ${opts.productName} hakkında bilgi almak istiyorum.`
    : "Merhaba, bilgi almak istiyorum.";

  return {
    href: `https://wa.me/${opts.whatsapp.value}?text=${encodeURIComponent(message)}`,
    label: "WhatsApp'tan Sorun",
    channel: "whatsapp",
  };
}

/** Every product card, lightbox and call-to-action on the site routes through
 * this one function.
 *
 * Prefilling the product name is the entire trick (§9): the shop instantly
 * knows what the customer is looking at, and the customer types nothing.
 *
 * While `contact.whatsapp.pending` is true the site never emits a `wa.me` link
 * — it falls back to `tel:` with the label "Bizi Arayın", so no button is ever
 * dead. Switching the whole site over is one boolean above. */
export function contactCta(productName?: string): ContactCta {
  return buildContactCta({
    whatsapp: contact.whatsapp,
    phoneHref,
    productName,
  });
}
