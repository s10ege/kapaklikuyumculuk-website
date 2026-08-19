import {
  address,
  areaServed,
  contact,
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

const FACEBOOK_URL = "https://www.facebook.com/537179436417060";

export function jewelryStoreSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${shop.url}/#shop`,
    name: shop.name,
    legalName: shop.legalName,
    description:
      `${shop.founded} yılında Kapaklı'da kurulan ${shop.name}; altın, ` +
      "pırlanta ve özel tasarım takıları güvene ve dürüstlüğe dayalı hizmet " +
      "anlayışıyla sunar.",
    url: shop.url,
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

    /* `geo` is deliberately absent. docs/business-facts.md grades the
     * coordinates ❌ — sources disagree by roughly 150 m — and asserting a pin
     * we know might be wrong is worse than asserting none. The address block
     * above is unambiguous and is what Google will geocode. */

    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.schemaDays,
        opens: hours.opens,
        closes: hours.closes,
      },
    ],

    /* Only accounts genuinely ours. @kapaklikuyumculuk matches our domain but
     * belongs to a different jeweller in Şanlıurfa, and at least one directory
     * already attributes it to this business — linking it here would confirm
     * the error to Google in our own structured data. */
    sameAs: [instagramUrl, FACEBOOK_URL],

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
