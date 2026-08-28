/* Explicit .ts extensions: node:test runs these modules directly under Node's
 * native type stripping, which requires the real extension on relative imports.
 * Turbopack resolves them the same way, so both paths agree. */
import { FILLER } from "./filler.ts";
import { PLACEHOLDER } from "./placeholders.ts";
import { phoneDisplay, shop } from "./config.ts";

/* The catalogue, and the seam Sanity will slot into (§8).
 *
 * Every page reads the catalogue through the functions at the bottom of this
 * file — never by importing CATEGORIES or PRODUCTS directly. When Sanity is
 * wired up in phase two, only the bodies of those functions change: the schemas
 * are already shaped to match these types, and no page or component is touched.
 *
 * At launch there are no products (§2, "Launch content: category template only").
 * That is a normal state, not an empty one — every surface has a designed
 * `Yakında` panel for it (§6.2).
 */

export type Ayar = "14" | "18" | "22" | "24" | "gümüş" | "platin";

export type Category = {
  /** ⚠️ This is a published URL (§4). Changing one after launch means adding a
   *  301 to vercel.json first — two of these paths are already in Google's
   *  index and are being reclaimed rather than redirected away. */
  slug: string;
  name: string;
  /** <title> */
  title: string;
  /** meta description */
  description: string;
  /** The SEO paragraph. With no product pages, this is the category's entire
   *  search surface — see the note above CATEGORIES. */
  intro: string;
  coverImage: string;
  order: number;
};

export type Product = {
  id: string;
  name: string;
  /** Category.slug */
  category: string;
  images: string[];
  ayar?: Ayar;
  gram?: number;
  note?: string;
  featured?: boolean;
  order: number;
};

/* ------------------------------------------------------------------ */
/* Titles                                                              */
/* ------------------------------------------------------------------ */

/* The old site's title template was `%page% - Kapaklı Kuyumculuk | 0282 717 21
 * 31 | Kapaklı`, and it was indexed that way for years (docs/old-site-map.md).
 * A phone number in the title tag is unusual, but it earned its place here and
 * is worth keeping. Built from config so the number cannot drift. */
const TITLE_SUFFIX = `${shop.name} | ${phoneDisplay} | Kapaklı`;

export function pageTitle(name: string): string {
  return `${name} - ${TITLE_SUFFIX}`;
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

/* The five from §2, in display order.
 *
 * The `intro` is the category's entire search surface — there are no product
 * pages, so this paragraph is what Google reads and what a customer arriving
 * from Instagram actually reads too. During stages 1–2 it renders Turkish
 * FILLER (design.md § Copy); the original real intros are preserved in
 * docs/original-copy.md and Soner's rewrite replaces the FILLER import in
 * stage 3.2, before anything deploys. Each intro (filler included) mentions
 * Kapaklı or Tekirdağ exactly once, where it belongs in the sentence.
 *
 * §10 targets local intent — "kapaklı kuyumcu", "tekirdağ pırlanta", "kapaklı
 * altın". Competing nationally on "pırlanta yüzük" against the chains is not
 * winnable and is not attempted.
 */
const CATEGORIES: Category[] = [
  {
    slug: "pirlanta",
    name: "Pırlanta",
    title: pageTitle("Pırlanta Modelleri"),
    description:
      "Sertifikalı pırlanta yüzük, kolye ve küpe modelleri. Taşı ışık " +
      "altında inceleyerek seçin. Kapaklı / Tekirdağ.",
    intro: FILLER.categoryIntro["pirlanta"],
    coverImage: PLACEHOLDER.kategori.pirlanta,
    order: 1,
  },
  {
    slug: "altin-seti",
    name: "Altın Seti",
    title: pageTitle("Altın Seti Modelleri"),
    description:
      "Nişan ve düğün için 14, 18 ve 22 ayar altın setleri. Bilezik, " +
      "kolye, küpe ve yüzük bir arada. Kapaklı / Tekirdağ.",
    intro: FILLER.categoryIntro["altin-seti"],
    coverImage: PLACEHOLDER.kategori["altin-seti"],
    order: 2,
  },
  {
    slug: "kupe-modelleri",
    name: "Küpe Modelleri",
    title: pageTitle("Küpe Modelleri"),
    description:
      "Altın, pırlanta ve gümüş küpe modelleri; halka, sallantılı, çocuk " +
      "küpesi ve daha fazlası. Kapaklı / Tekirdağ.",
    intro: FILLER.categoryIntro["kupe-modelleri"],
    coverImage: PLACEHOLDER.kategori["kupe-modelleri"],
    order: 3,
  },
  {
    slug: "tek-tas-modelleri",
    name: "Tek Taş Modelleri",
    title: pageTitle("Tek Taş Yüzük Modelleri"),
    description:
      "Tek taş yüzük modelleri. Montür, tırnak sayısı ve karat " +
      "seçeneklerini karşılaştırın. Kapaklı / Tekirdağ.",
    intro: FILLER.categoryIntro["tek-tas-modelleri"],
    coverImage: PLACEHOLDER.kategori["tek-tas-modelleri"],
    order: 4,
  },
  {
    slug: "ozel-tasarim-takilar",
    name: "Özel Tasarım Takılar",
    title: pageTitle("Özel Tasarım Takılar"),
    description:
      "Sipariş üzerine üretilen özel tasarım takılar. Eski altınlarınızı " +
      "yeni bir parçaya dönüştürün. Kapaklı / Tekirdağ.",
    intro: FILLER.categoryIntro["ozel-tasarim-takilar"],
    coverImage: PLACEHOLDER.kategori["ozel-tasarim-takilar"],
    order: 5,
  },
];

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

/* Empty at launch, by decision (§2). The owner is shooting photography later,
 * and every grid on the site has a designed empty state for exactly this.
 * Do not add invented products to "fill it out" — a jeweller's catalogue
 * showing pieces the shop does not have is worse than an honest Yakında. */
const PRODUCTS: Product[] = [];

/* ------------------------------------------------------------------ */
/* The read API — the only thing pages are allowed to use              */
/* ------------------------------------------------------------------ */

function byOrder<T extends { order: number }>(a: T, b: T): number {
  return a.order - b.order;
}

export function getCategories(): Category[] {
  return [...CATEGORIES].sort(byOrder);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** All slugs, for generateStaticParams and the sitemap. */
export function getCategorySlugs(): string[] {
  return getCategories().map((c) => c.slug);
}

/** Every product, or just one category's. */
export function getProducts(categorySlug?: string): Product[] {
  const scoped =
    categorySlug === undefined
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === categorySlug);

  return [...scoped].sort(byOrder);
}

/** §6.1 — the Öne Çıkanlar section hides itself entirely when this is empty,
 *  rather than rendering an empty shelf. */
export function getFeaturedProducts(limit = 4): Product[] {
  return getProducts()
    .filter((p) => p.featured === true)
    .slice(0, limit);
}
