import {
  address,
  areaServed,
  contact,
  facebookUrl,
  geo,
  googleMapsUrl,
  hours,
  instagramUrl,
  shop,
} from "./config.ts";
import type { Category, Product } from "./content.ts";

/* Structured data (§10), generated from lib/config.ts.
 *
 * This is the whole reason config.ts exists. docs/index-cleanup-plan.md's
 * diagnosis is that Google sees one business name resolving to two addresses,
 * across three name variants and four phone numbers, and hedges. The fix is
 * consistency — so the schema, the footer and the Google Business Profile all
 * read from one place and cannot drift.
 *
 * §10 also notes the Google Business Profile is worth more traffic than this
 * entire website for a shop like this, and must carry the same name, address
 * and phone character-for-character.
 */

/** §10 — the seasonal hours, as schema.org sees them.
 *
 * Three entries, not two, and the third is not a mistake. Summer is one
 * unbroken run (01 May → 30 September) and fits a single spec. Winter runs
 * from October through April, which crosses New Year — and
 * `validFrom`/`validThrough` are dates, not a recurrence rule, so there is no
 * way to express "10-01 through 04-30" as one range without asserting a span
 * that runs backwards. It is published as the two calendar halves it actually
 * occupies: January–April, and October–December.
 *
 * Dates are stamped for the current year, which for a static site means the
 * year of the last deploy. That is correct in practice for a site rebuilt
 * whenever anything changes, and a stale year is a stale hint rather than a
 * wrong claim — the visible page carries both seasons unconditionally, so
 * nothing depends on this being fresh.
 *
 * Sunday is never emitted. A `dayOfWeek` list that omits a day means closed,
 * and an explicit Sunday entry with equal opens/closes is the other convention
 * — mixing them is how a shop ends up listed as open 00:00–00:00. */
/* The shopfront, produced by scripts/hakkimizda-photos.mjs and already used on
 * /hakkimizda. Deliberately NOT lib/metadata.ts's OG card — see the note at
 * `image` below for why the two should differ. */
const SHOPFRONT = "/hakkimizda/magaza.webp";

export function openingHoursSpecification(now: Date = new Date()) {
  const year = now.getFullYear();

  const spec = (season: "summer" | "winter", from: string, through: string) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: hours.schemaDays,
    opens: hours[season].open,
    closes: hours[season].close,
    validFrom: `${year}-${from}`,
    validThrough: `${year}-${through}`,
  });

  return [
    spec("summer", "05-01", "09-30"),
    spec("winter", "01-01", "04-30"),
    spec("winter", "10-01", "12-31"),
  ];
}

export function jewelryStoreSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${shop.url}/#shop`,
    name: shop.name,
    legalName: shop.legalName,
    description:
      `${shop.founded} yılında Kapaklı'da kurulan ${shop.name}; altın set, ` +
      "bilezik, küpe, yüzük ve özel tasarım takı satar, sipariş üzerine " +
      "üretir ve altın alım–satımı yapar.",
    url: shop.url,

    /* The shopfront photograph, not the Open Graph card.
     *
     * It was the OG card for a few hours on 2026-09-08, on the reasoning that
     * a search result and a shared link should show the same picture. That is
     * right for `og:image` and wrong here: this field feeds the local pack and
     * the knowledge panel, where Google asks for photographs of the business
     * and discourages logos and text overlays — `logo` is the field for a
     * lockup. The card is a lockup, a claim set in type and a stock coin.
     *
     * The shopfront is also the strongest same-entity signal available: the
     * identical file can sit on the Google Business Profile in stage 4, and
     * two identical images at one address is exactly the kind of agreement
     * this project is trying to manufacture. */
    image: `${shop.url}${SHOPFRONT}`,

    telephone: `+${contact.phone.value}`,
    foundingDate: String(shop.founded),
    priceRange: "₺₺",
    currenciesAccepted: "TRY",

    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },

    /* `geo` was deliberately absent until 2026-09-08: docs/business-facts.md
     * graded the coordinates ❌, sources disagreed by roughly 150 m, and
     * asserting a pin we knew might be wrong was worse than asserting none.
     * These come from the shop's own Google Maps listing, so the pin, the
     * street number and the place ID all describe the same door — and `hasMap`
     * points at that listing rather than at a search for it, which is the
     * difference between naming the place and hoping Google guesses it. */
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.lat,
      longitude: geo.lng,
    },
    hasMap: googleMapsUrl,


    openingHoursSpecification: openingHoursSpecification(),

    /* Only accounts genuinely ours. @kapaklikuyumculuk matches our domain but
     * belongs to a different jeweller in Şanlıurfa, and at least one directory
     * already attributes it to this business — linking it here would confirm
     * the error to Google in our own structured data. */
    sameAs: [instagramUrl, facebookUrl],

    areaServed: areaServed.map((name) => ({ "@type": "City", name })),
  };
}

export function breadcrumbSchema(trail: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${shop.url}${item.url}`,
    })),
  };
}

/** §10 — an ItemList of Product on each category page.
 *
 * Emitted only when the category has products. An empty ItemList would claim
 * the page lists things it does not, which is the kind of mismatch that earns
 * a structured-data penalty rather than a rich result. */
export function categoryItemListSchema(
  category: Category,
  products: Product[],
) {
  if (products.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name,
    numberOfItems: products.length,
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.images[0]
          ? `${shop.url}${product.images[0]}`
          : undefined,
        category: category.name,
        brand: { "@type": "Brand", name: shop.name },
        /* No `offers`: prices track the daily gold rate and are not published,
         * so any price here would be a fabrication. */
      },
    })),
  };
}
