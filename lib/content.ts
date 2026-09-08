import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/* Explicit .ts extensions: node:test runs these modules directly under Node's
 * native type stripping, which requires the real extension on relative imports.
 * Turbopack resolves them the same way, so both paths agree. */
import { COPY } from "./copy.ts";
import { PLACEHOLDER } from "./placeholders.ts";
import { phoneDisplay, shop } from "./config.ts";

/* The catalogue, and the only module that knows where products come from.
 *
 * Every page reads it through the functions at the bottom of this file — never
 * by importing CATEGORIES or PRODUCTS directly. That seam was originally cut for
 * a CMS; the CMS was dropped (plan.md, "Decisions overturned") and the seam now
 * hides a folder walk instead. Nothing above it changed either way.
 *
 * NO CMS: the catalogue is public/urunler/<kategori>/<parça>_<nn>.webp, read once
 * at module load. Drop an image in, and the product appears in that category
 * (CATALOGUE.md §3). An empty catalogue is a normal state, not a broken one —
 * every surface has a designed `Yakında` panel for it (§6.2).
 *
 * SAFE TO TOUCH THE FILESYSTEM HERE. Every value-importer of this module is a
 * server module (app/**, lib/nav.ts, lib/schema.ts); the three "use client"
 * components take type-only imports, which erase. Adding a value import of this
 * file to a client component would break the build — that is the intended
 * guard rail, not an accident.
 *
 * Read once, at import. In `next build` that is exactly right. Under `next dev`
 * it means a newly added photograph needs a server restart, which is the correct
 * trade for a folder that changes a few times a year.
 */

export type Category = {
  /** ⚠️ This is a published URL (§4). Changing one after launch means adding a
   *  301 to next.config.ts first — several of these paths are already in
   *  Google's index and are being reclaimed rather than redirected away. */
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
  /** Turkish alt text, written by hand in catalogue.json. The only text a search
   *  engine can read about the image, on a site competing on local intent (§3).
   *  Falls back to the product name. */
  alt?: string;
  /** `22 ayar · 38.5 gr` — ayar and gram only, as one string (§3). The vernacular
   *  a Turkish customer actually judges by. Never a price: those track the daily
   *  gold rate, and nothing in this type can carry one. */
  spec?: string;
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

/* The four from §2, in display order.
 *
 * Was five until 2026-09-08. `pirlanta` is gone: its pieces are white gold,
 * not diamond, and calling them pırlanta in a category name was a claim the
 * shop cannot stand behind. Its su yolu takımı moved to `altin-seti` and its
 * five rings to `yuzuk`. `tek-tas-modelleri` became `yuzuk` in the same pass —
 * the page carries every ring, tek taş or not, so the narrow slug was
 * describing a subset of its own contents.
 *
 * ⚠️ Both retired paths are indexed. `next.config.ts` 301s
 * `/urunler/pirlanta` and `/urunler/tek-tas-modelleri` to `/urunler/yuzuk`,
 * and `tests/redirects.spec.ts` asserts every source resolves in one hop.
 * Do not change a slug here without adding the redirect first.
 *
 * The `intro` is the category's entire search surface — there are no product
 * pages, so this paragraph is what Google reads and what a customer arriving
 * from Instagram actually reads too. Each intro mentions Kapaklı or Tekirdağ
 * exactly once, where it belongs in the sentence.
 *
 * §10 targets local intent — "kapaklı kuyumcu", "kapaklı altın", "tekirdağ
 * altın seti". Competing nationally on "pırlanta yüzük" against the chains is
 * not winnable and is not attempted.
 */
const CATEGORIES: Category[] = [
  {
    slug: "altin-seti",
    name: "Altın Setleri",
    title: pageTitle("Altın Seti Modelleri"),
    description:
      "Kapaklı'da altın set modelleri: kolye, bilezik, küpe ve yüzük bir " +
      "arada. Ayar ve gram etikette yazar, fiyat günün altın kuruna göre.",
    intro: COPY.categoryIntro["altin-seti"],
    coverImage: PLACEHOLDER.kategori["altin-seti"],
    order: 1,
  },
  {
    slug: "kupe-modelleri",
    name: "Küpe Modelleri",
    title: pageTitle("Küpe Modelleri"),
    description:
      "Kapaklı kuyumcu vitrininden altın küpe modelleri: halka, sallantılı, " +
      "mineli, taşlı ve çocuk küpesi. Ayar ve gram etikette yazar.",
    intro: COPY.categoryIntro["kupe-modelleri"],
    coverImage: PLACEHOLDER.kategori["kupe-modelleri"],
    order: 2,
  },
  {
    slug: "yuzuk",
    name: "Yüzük",
    title: pageTitle("Yüzük Modelleri"),
    description:
      "Kapaklı'da 14 ve 22 ayar yüzük modelleri, beyaz altın dahil. Ölçünüz " +
      "yoksa dükkânda beş dakikada bakarız, ölçü ayarı bizde yapılır.",
    intro: COPY.categoryIntro.yuzuk,
    coverImage: PLACEHOLDER.kategori["yuzuk"],
    order: 3,
  },
  {
    slug: "ozel-tasarim-takilar",
    name: "Özel Tasarım Takılar",
    title: pageTitle("Özel Tasarım Takılar"),
    description:
      "Tekirdağ'da sipariş üzerine takı üretimi. Çizin ya da fotoğraf " +
      "gönderin; ayarı ve gramı konuşup teslim gününü baştan söyleyelim.",
    intro: COPY.categoryIntro["ozel-tasarim-takilar"],
    coverImage: PLACEHOLDER.kategori["ozel-tasarim-takilar"],
    order: 4,
  },
];

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

/* Do not add invented products to "fill it out" — a jeweller's catalogue showing
 * pieces the shop does not have is worse than an honest Yakında. The only way in
 * is a photograph through scripts/catalogue.mjs. */

/** `<kategori>/<parça>` → the handful of things a filename cannot carry (§3). */
type Meta = {
  name?: string;
  alt?: string;
  spec?: string;
  note?: string;
  featured?: boolean;
  order?: number;
};

const IMAGE_RE = /^([a-z0-9-]+)_(\d{2})\.webp$/;

/* Resolved from `process.cwd()`, the project root under every loader this
 * module must survive: `next build`/`next dev`, `npm run test:unit`, and the
 * Playwright specs that import this file to derive expected state. A
 * module-relative fallback (`import.meta.dirname`) used to cover a test run
 * from a subdirectory, but the token itself defeats two of those loaders —
 * undefined once Turbopack has bundled the module, a parse-time SyntaxError
 * under Playwright's CJS transpile — so cwd is the one path they all agree
 * on, and every runner invokes from the root. */
function catalogueRoot(): string | null {
  const root = join(process.cwd(), "public", "urunler");
  return existsSync(root) ? root : null;
}

/* A malformed catalogue.json must not take the build down. It carries polish —
 * display names, alt text, which four are featured — and losing that is a
 * degraded catalogue, not a broken one. The warning is how it gets noticed.
 *
 * Split out from the file read so the degradation can be proven from a string,
 * without a test writing a broken file into public/. */
export function parseCatalogueMeta(json: string): Record<string, Meta> {
  try {
    const parsed: unknown = JSON.parse(json);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("expected an object keyed by <kategori>/<parça>");
    }
    return parsed as Record<string, Meta>;
  } catch (error) {
    console.warn(`catalogue.json ignored — ${(error as Error).message}`);
    return {};
  }
}

function readMeta(root: string): Record<string, Meta> {
  const file = join(root, "catalogue.json");
  return existsSync(file) ? parseCatalogueMeta(readFileSync(file, "utf8")) : {};
}

/* `burma-basak-yuzuk` → `Burma Basak Yuzuk`. A fallback only: the slug is ASCII
 * and no transformation restores `ş` or `ü`, so anything customer-facing gets a
 * real `name` in catalogue.json. This exists so a freshly dropped-in image still
 * appears, rather than being silently skipped for want of a metadata line.
 * Turkish locale casing, so a leading `i` becomes `İ` and not `I`. */
function nameFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toLocaleUpperCase("tr") + word.slice(1))
    .join(" ");
}

function readCatalogue(): Product[] {
  const root = catalogueRoot();
  if (root === null) return [];

  const meta = readMeta(root);
  const products: Product[] = [];
  let sequence = 0;

  // Category order first, then filename — so the default ordering is the one
  // the site already displays categories in, and `order` only ever fine-tunes.
  for (const category of [...CATEGORIES].sort(byOrder)) {
    const dir = join(root, category.slug);
    if (!existsSync(dir)) continue;

    // Several files sharing a piece name are one product seen from several
    // angles (§1, "a second angle is welcome"), not several products.
    const angles = new Map<string, string[]>();

    for (const file of readdirSync(dir).sort()) {
      const [, piece] = IMAGE_RE.exec(file) ?? [];
      if (piece === undefined) continue;

      const images = angles.get(piece) ?? [];
      images.push(`/urunler/${category.slug}/${file}`);
      angles.set(piece, images);
    }

    for (const [piece, images] of angles) {
      const entry = meta[`${category.slug}/${piece}`] ?? {};
      sequence++;

      products.push({
        id: `${category.slug}/${piece}`,
        name: entry.name ?? nameFromSlug(piece),
        category: category.slug,
        images,
        alt: entry.alt,
        spec: entry.spec,
        note: entry.note,
        featured: entry.featured,
        order: entry.order ?? sequence,
      });
    }
  }

  return products;
}

const PRODUCTS: Product[] = readCatalogue();

/* ------------------------------------------------------------------ */
/* The read API — the only thing pages are allowed to use              */
/* ------------------------------------------------------------------ */

function byOrder<T extends { order: number }>(a: T, b: T): number {
  return a.order - b.order;
}

/* D16, as revised 2026-08-29: a category tile is filled edge to edge by the
 * polished photograph itself (`object-cover`), with a scrim under the label.
 * Until a category has photographs that is the line-art placeholder (§12), and the
 * moment it has one it should be a real piece — the placeholder is designed to
 * read as deliberate, not to be kept once there is something better. Like the
 * Yakında panels, it retires itself with no code change (§4). */
function withCover(category: Category): Category {
  const first = PRODUCTS.find((p) => p.category === category.slug);
  const image = first?.images[0];
  return image ? { ...category, coverImage: image } : category;
}

export function getCategories(): Category[] {
  return [...CATEGORIES].sort(byOrder).map(withCover);
}

export function getCategory(slug: string): Category | undefined {
  const found = CATEGORIES.find((c) => c.slug === slug);
  return found && withCover(found);
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
