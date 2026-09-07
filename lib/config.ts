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
  street: "Cumhuriyet Mah., Pınar Bulvarı No: 56/A",
  postalCode: "59510",
  locality: "Kapaklı",
  region: "Tekirdağ",
  country: "TR",

  /** 🟡 Instagram bio. Useful to a visitor finding the shop on foot. */
  landmark: { value: "Ziraat Bankası karşısı", pending: false },

  /* Coordinates are deliberately absent. docs/business-facts.md grades them ❌:
   * sources disagree by ~150 m. The maps embed keys on the address string
   * instead, and the JSON-LD omits `geo` rather than asserting a wrong pin. */
} as const;

export const areaServed = ["Kapaklı", "Çerkezköy", "Tekirdağ"] as const;

/* ------------------------------------------------------------------------- */
/* Hours                                                                      */
/* ------------------------------------------------------------------------- */

/* docs/business-facts.md grades hours ❌ — Google shows 09:00–20:00, two other
 * sources say 08:00–19:00. The owner resolved it: the closing time genuinely
 * moves between winter and summer. 20:00 is correct now.
 *
 * Because it is seasonal rather than unknown, it ships as a real value and
 * becomes owner-editable in phase two: the Sanity `siteSettings` document
 * (iteration 15) carries these fields so the switch needs no deploy. */
export const hours = {
  days: "Pazartesi – Cumartesi",
  opens: "09:00",
  closes: "20:00",
  closedNote: "Pazar kapalı",
  /** Days matching openingHoursSpecification in schema.org terms. */
  schemaDays: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  seasonal: true,
} as const;

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

/** The full address on one line, for maps queries and meta descriptions. */
export const addressOneLine = `${address.street}, ${address.postalCode} ${address.locality} / ${address.region}`;

/** Address block as rendered in the footer and on İletişim. */
export const addressLines = [
  address.street,
  `${address.postalCode} ${address.locality} / ${address.region}`,
] as const;

const mapsQuery = encodeURIComponent(`${shop.name} ${addressOneLine}`);

/** "Yol Tarifi Al" — opens the maps app. */
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

/** §6.7 — the keyless embed form, so no Maps API key is needed. Keyed on the
 *  address string because the coordinates are ❌. */
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;

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
