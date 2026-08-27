# docs/original-copy.md — the Turkish copy as written before the redesign

> Preserved 2026-08-27, before Turkish filler replaces page copy during stage 1
> (`design.md`). Soner rewrites the real copy later; this file is the reference so nothing
> written at iterations 5, 9 and 11 is lost in the meantime.
>
> Source commit: `a48f740`. Git history holds these files in full — this file exists so the
> copy can be read without a checkout.

## Why this matters

Two lines in here are load-bearing and should survive any rewrite:

- **Hakkımızda** — *"2000 yılında Kapaklı ilçesinin merkezinde kurulmuş olup ilçenin ilk
  kuyumcusudur"*. Recovered from the old site, true, verifiable, and a strong local claim.
  **Do not reuse "iki şube ile"** — there is one shop now.
- **Hizmetler / Altın Alım–Satım** — the promise that weighing happens at the counter in
  front of the customer and any deduction is stated beforehand. This addresses the two
  things customers actually worry about. It is also item 6 on the confirmation gate in
  `TECHNICAL.md`: confirm it matches how the shop operates before it ships.

Owners named in the copy: Filiz Eroğlu · Nuri Eroğlu.

The five category intro paragraphs in `lib/content.ts` are each a category's entire SEO
payload — 2–3 sentences mentioning Kapaklı or Tekirdağ once, naturally. Filler replaces them
temporarily; whatever replaces the filler needs to do the same job.

---

## app/hakkimizda/page.tsx

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactBand } from "@/components/ContactBand";
import { ArrowRightIcon } from "@/components/icons";
import { address, shop } from "@/lib/config";
import { pageTitle } from "@/lib/content";
import { PLACEHOLDER } from "@/lib/placeholders";

/* §6.6 — Hakkımızda.
 *
 * §4: `/hakkimizda` was indexed in the site's first generation and is being
 * reclaimed rather than redirected.
 *
 * The argument the page has to make: a jeweller sells things that come back —
 * for resizing, for repair, to be handed on. That is why the shop behaves the
 * way it does, and it is a more honest case than any claim about quality.
 *
 * The founding copy is recovered from the old site's Kurumsal page
 * (docs/old-site-map.md) and is verifiable. Its "iki şube ile" line is
 * deliberately NOT revived: the partnership ended and there is one shop now.
 * Nothing about the former partner belongs on a customer-facing page.
 */

export const metadata: Metadata = {
  title: pageTitle("Hakkımızda"),
  description:
    "2000 yılında kurulan Kapaklı'nın ilk kuyumcusu. Aynı adreste, aynı " +
    "ailenin elinde. Kapaklı / Tekirdağ.",
  alternates: { canonical: "/hakkimizda" },
};

const FACTS = [
  { label: "Kuruluş", value: "2000" },
  { label: "Konum", value: `${address.locality} / ${address.region}` },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumb
        trail={[{ label: "Anasayfa", href: "/" }, { label: "Hakkımızda" }]}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-deep">Hakkımızda</p>
          <h1 className="mt-3 display-md">{shop.claim}</h1>
          <div className="mt-5 h-px w-11 bg-gold" />

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-14">
            {/* Portrait, per §6.6 — a shop photograph reads as proof in a way
                a product shot does not. */}
            <div className="relative aspect-[3/4] overflow-hidden border border-line">
              <Image
                src={PLACEHOLDER.hero}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex flex-col gap-5 leading-relaxed">
                <p>
                  Kapaklı Kuyumculuk {shop.founded} yılında, Kapaklı ilçesinin
                  merkezinde kuruldu ve ilçenin ilk kuyumcusu oldu. O günden bu
                  yana aynı adreste, aynı ailenin elinde.
                </p>
                <p className="text-ink-muted">
                  Bir kuyumcunun sattığı şeyler geri gelir. Yüzük küçük gelir,
                  zincir kopar, bir bilezik yıllar sonra toruna devredilir. Bu
                  yüzden bir takıyı satarken de, yıllar sonra tamire
                  geldiğinde de aynı şekilde davranmak zorundasınız. Aynı
                  ilçede, aynı insanlara iş yapmanın kuralı bu.
                </p>
                <p className="text-ink-muted">
                  Vitrinimizde altın, pırlanta ve seçkin saat markaları var.
                  Bunun yanında altın alım–satımı ve sipariş üzerine üretim
                  yapıyoruz. Aradığınız model vitrinde yoksa sorun — tedarik
                  edebildiklerimiz vitrindekilerden çok daha geniş.
                </p>
              </div>

              {/* Two-cell fact grid (§6.6). Two, because two verified facts
                  are worth more than six padded ones. */}
              <dl className="mt-10 grid border-l border-t border-line sm:grid-cols-2">
                {FACTS.map((fact) => (
                  <div
                    key={fact.label}
                    className="border-b border-r border-line bg-surface px-5 py-6"
                  >
                    <dt className="text-label uppercase text-ink-muted">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 font-display text-2xl">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/urunler"
                  className="inline-flex min-h-11 items-center gap-2 bg-gold px-5 py-3 text-sm font-medium text-charcoal-deep transition-colors hover:bg-gold-soft"
                >
                  Ürünlerimiz
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/hizmetler"
                  className="inline-flex min-h-11 items-center border border-gold-deep px-5 py-3 text-sm text-gold-deep transition-colors hover:bg-gold-pale"
                >
                  Hizmetlerimiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactBand
        heading="Uğrayın, tanışalım"
        body="Ziraat Bankası karşısındayız. Bir şey almak zorunda değilsiniz; bakmak da serbest."
      />
    </>
  );
}
```

## app/hizmetler/page.tsx

```tsx
import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactBand } from "@/components/ContactBand";
import { pageTitle } from "@/lib/content";

/* §6.5 — Hizmetler.
 *
 * Two long-form panels. The copy angle for Altın Alım–Satım comes straight
 * from the spec: the two things a customer actually worries about are the rate
 * and the weighing, so both are addressed in the first two sentences rather
 * than buried under reassurance.
 */

export const metadata: Metadata = {
  title: pageTitle("Hizmetlerimiz"),
  description:
    "Altın alım–satımı ve sipariş üzerine üretim. Tartım tezgâh üstünde, " +
    "düşülecek pay işlem öncesinde açıklanır. Kapaklı / Tekirdağ.",
  alternates: { canonical: "/hizmetler" },
};

type Service = {
  slug: string;
  name: string;
  lede: string;
  body: string;
  points: string[];
};

const SERVICES: Service[] = [
  {
    slug: "altin-alim-satim",
    name: "Altın Alım–Satım",
    lede: "Kur ve tartı — iki soru, iki açık cevap.",
    body:
      "Altın bozdururken müşterinin aklındaki iki soru bellidir: bugünkü kur " +
      "ne, ve tartı doğru mu. İkisini de açıkta yapıyoruz. Getirdiğiniz altın " +
      "tezgâhın üstünde, sizin gözünüzün önünde tartılır; ayarı belirlenir ve " +
      "o günkü kura göre karşılığı birlikte hesaplanır. İşçilik ya da kayıp " +
      "payı düşülecekse, işlem yapılmadan önce söylenir.",
    points: [
      "Tartım tezgâhın üstünde, sizin gözünüzün önünde yapılır.",
      "Ayar tayini ve hesap adım adım anlatılır; istediğiniz kadar sorun.",
      "Düşülecek pay varsa işlemden önce söylenir — sonradan sürpriz olmaz.",
      "Hurda altın, bilezik, künye ve set alımı yapılır.",
    ],
  },
  {
    slug: "siparis-uzerine-uretim",
    name: "Sipariş Üzerine Üretim",
    lede: "Vitrinde olmayan bir modeli ürettirebilirsiniz.",
    body:
      "Aklınızdaki parçayı çizerek, bir fotoğrafla ya da yalnızca tarif " +
      "ederek getirin; ölçüyü, ayarı ve gramajı birlikte netleştirelim. Eski " +
      "altınlarınızı bozdurup yeni bir parçaya dönüştürmek de mümkün — " +
      "çoğu zaman en uygun yol bu oluyor. Süre modelin işçiliğine göre " +
      "değiştiği için teslim tarihini en baştan konuşuruz.",
    points: [
      "Çizim, fotoğraf ya da sözlü tarif; hepsi başlangıç noktası olabilir.",
      "Ayar, gramaj ve taş seçimi üretime başlamadan netleştirilir.",
      "Teslim tarihi baştan konuşulur, üretim boyunca haber verilir.",
      "Eski altınlarınız yeni parçanın hesabına sayılabilir.",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Breadcrumb
        trail={[{ label: "Anasayfa", href: "/" }, { label: "Hizmetler" }]}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-deep">Hizmetler</p>
          <h1 className="mt-3 display-md">Ne yapıyoruz</h1>
          <div className="mt-5 h-px w-11 bg-gold" />
          <p className="mt-6 max-w-2xl leading-relaxed text-ink-muted">
            Vitrin dışında iki iş yapıyoruz, ve ikisi de güvene dayanıyor.
            Nasıl çalıştığımızı baştan yazdık ki mağazaya gelmeden ne
            olacağını bilin.
          </p>

          <div className="mt-12 flex flex-col gap-12">
            {SERVICES.map((service) => (
              <article
                key={service.slug}
                id={service.slug}
                className="border-t border-line pt-10"
              >
                <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
                  <div>
                    <h2 className="display-sm">{service.name}</h2>
                    <div className="mt-5 h-px w-11 bg-gold" />
                    <p className="mt-5 font-display text-xl leading-snug text-gold-deep">
                      {service.lede}
                    </p>
                  </div>

                  <div>
                    <p className="leading-relaxed text-ink-muted">
                      {service.body}
                    </p>

                    <ul className="mt-8 border-t border-line">
                      {service.points.map((point) => (
                        <li
                          key={point}
                          className="border-b border-line py-4 text-sm leading-relaxed"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactBand
        heading="Önce bir sorun, sonra karar verin"
        body="Kur, gramaj ya da süre — aklınıza takılanı telefonla da sorabilirsiniz. Bağlayıcı bir şey değil."
      />
    </>
  );
}
```

## lib/content.ts — categories and intro paragraphs

```ts
/* Explicit .ts extensions: node:test runs these modules directly under Node's
 * native type stripping, which requires the real extension on relative imports.
 * Turbopack resolves them the same way, so both paths agree. */
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
 * Each `intro` is real writing rather than keyword filler, because it has to
 * carry the category on its own: there are no product pages, so this paragraph
 * is what Google reads and what a customer arriving from Instagram actually
 * reads too. Each mentions Kapaklı or Tekirdağ exactly once, where it belongs
 * in the sentence.
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
    intro:
      "Pırlantada fark, taşın sertifikasında ve işçiliğinde ortaya çıkar. " +
      "Tektaş yüzükten pırlanta kolyeye kadar vitrinimizdeki parçaları, " +
      "kesim ve berraklık değerleriyle birlikte anlatarak gösteriyoruz. " +
      "Kapaklı'daki mağazamızda taşı elinize alıp ışık altında " +
      "inceleyebilir, bütçenize uygun seçenekleri yan yana " +
      "karşılaştırabilirsiniz.",
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
    intro:
      "Altın seti; bilezik, kolye, küpe ve yüzüğün birbiriyle uyumlu " +
      "şekilde bir araya gelmesiyle oluşur ve çoğunlukla nişan, düğün ya da " +
      "özel günler için hazırlanır. 14, 18 ve 22 ayar seçenekleriyle setin " +
      "gramajını ve modelini birlikte belirliyoruz. Tekirdağ ve çevresinden " +
      "gelen müşterilerimiz için set içeriğini isteğe göre " +
      "değiştirebiliyoruz.",
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
    intro:
      "Günlük kullanım için sade halkalardan özel günlerin sallantılı " +
      "modellerine kadar geniş bir küpe yelpazemiz var. Altın, pırlanta ve " +
      "gümüş seçenekleri; çocuk küpelerinden tragus ve helikse kadar farklı " +
      "ihtiyaçlara karşılık veriyor. Kulağınıza ve kullanım alışkanlığınıza " +
      "uygun modeli Kapaklı'daki mağazamızda deneyerek seçebilirsiniz.",
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
    intro:
      "Tek taş, bir kuyumcunun en çok konuşulan parçasıdır; çünkü çoğu " +
      "zaman bir söz verilirken alınır. Montürün yüksekliği, tırnak sayısı " +
      "ve taşın oturuşu yüzüğün parmaktaki görünümünü doğrudan değiştirir. " +
      "Kapaklı'daki mağazamızda farklı montür ve karat seçeneklerini yan " +
      "yana görüp aradaki farkı kendiniz değerlendirebilirsiniz.",
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
    intro:
      "Aklınızdaki modeli çizerek, bir fotoğrafla ya da yalnızca tarif " +
      "ederek getirin; birlikte netleştirip üretime veriyoruz. Eski " +
      "altınlarınızı bozdurup yeni bir parçaya dönüştürmek de mümkün. " +
      "Tekirdağ'da sipariş üzerine ürettiğimiz takılarda süre modelin " +
      "işçiliğine göre değişir, bu yüzden teslim tarihini en baştan " +
      "konuşuyoruz.",
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
```

## app/page.tsx — homepage service copy

```tsx
import Image from "next/image";
import Link from "next/link";

import { CategoryTiles } from "@/components/CategoryTiles";
import { ContactButton } from "@/components/ContactButton";
import { ProductGallery } from "@/components/ProductGallery";
import { ArrowRightIcon, PinIcon } from "@/components/icons";
import {
  address,
  addressLines,
  hours,
  mapsSearchUrl,
  phoneDisplay,
  phoneHref,
  services,
  shop,
} from "@/lib/config";
import { getCategories, getFeaturedProducts } from "@/lib/content";
import { PLACEHOLDER } from "@/lib/placeholders";

/* Anasayfa (§6.1).
 *
 * Band rhythm, per decision 2 in plan.md — the page reads as lit display cases
 * between dark frames:
 *
 *   charcoal   header
 *   charcoal   hero
 *   cream      kategoriler   (six dark tiles, so visually weighted)
 *   cream      öne çıkanlar  (absent entirely at launch)
 *   cream      hizmetler
 *   charcoal   hakkımızda    (§6.1 assigns charcoal here explicitly)
 *   cream      iletişim
 *   charcoal   footer
 */

const SERVICE_COPY: Record<string, string> = {
  "altin-alim-satim":
    "Altınınızı tartıp güncel kura göre değerlendiriyoruz. Tartım tezgâhın " +
    "üstünde, sizin gözünüzün önünde yapılır; varsa düşülecek pay işlem " +
    "öncesinde söylenir.",
  "siparis-uzerine-uretim":
    "Aklınızdaki modeli çizerek, fotoğrafla ya da tarif ederek getirin. " +
    "İşçiliğe göre süreyi ve teslim tarihini baştan konuşur, üretim boyunca " +
    "haber veririz.",
};

export default function Home() {
  const categories = getCategories();
  const featured = getFeaturedProducts(4);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── charcoal ── */}
      <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-charcoal">
        <Image
          src={PLACEHOLDER.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* §6.1 — gradient from the left, so the headline stays legible over
            whatever photograph replaces the placeholder. */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-deep via-charcoal-deep/85 to-charcoal-deep/25" />

        <div className="relative mx-auto w-full max-w-6xl px-5 py-20">
          <p className="text-label uppercase text-gold-soft">
            {address.locality} · {address.region}
          </p>

          <h1 className="mt-5 display-lg text-cream">
            Trakya Kapaklı
            <br />
            <span className="text-gold-soft">Kuyumculuk</span>
          </h1>

          <div className="mt-6 h-px w-11 bg-gold" />

          <p className="mt-6 max-w-md leading-relaxed text-cream/75">
            {shop.founded} yılından beri aynı yerde: altın, pırlanta ve sipariş
            üzerine üretilen özel tasarım takılar.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/urunler"
              className="inline-flex min-h-11 items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-charcoal-deep transition-colors hover:bg-gold-soft"
            >
              Ürünlerimiz
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex min-h-11 items-center border border-gold-soft/50 px-6 py-3 text-sm text-gold-soft transition-colors hover:bg-gold/15"
            >
              İletişim
            </Link>
          </div>
        </div>
      </section>

      {/* ── Kategoriler ─────────────────────────────────────────── cream ── */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="text-label uppercase text-gold-deep">Koleksiyonlar</p>
          <h2 className="mt-3 display-md">Ürünlerimiz</h2>
          <div className="mt-5 h-px w-11 bg-gold" />

          <div className="mt-10">
            <CategoryTiles categories={categories} />
          </div>
        </div>
      </section>

      {/* ── Öne Çıkanlar ────────────────────────────────────────── cream ──
          §6.1: hides itself entirely when nothing is flagged featured, rather
          than rendering an empty shelf. At launch there are no products, so
          this section does not exist in the markup at all. */}
      {featured.length > 0 && (
        <section className="bg-cream">
          <div className="mx-auto max-w-6xl px-5 pb-16 sm:pb-20">
            <p className="text-label uppercase text-gold-deep">Öne Çıkanlar</p>
            <h2 className="mt-3 display-md">Seçtiklerimiz</h2>
            <div className="mt-5 h-px w-11 bg-gold" />
            <div className="mt-10">
              <ProductGallery products={featured} />
            </div>
          </div>
        </section>
      )}

      {/* ── Hizmetler ───────────────────────────────────────────── cream ──
          Two panels, not five. §6.1: two reads as deliberate, a padded list of
          five reads as filler. */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:pb-20">
          <p className="text-label uppercase text-gold-deep">Hizmetler</p>
          <div className="mt-8 grid border-l border-t border-line sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.slug}
                className="border-b border-r border-line bg-surface p-6 sm:p-8"
              >
                <h3 className="font-display text-2xl">{service.name}</h3>
                <div className="mt-4 h-px w-11 bg-gold" />
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {SERVICE_COPY[service.slug]}
                </p>
                <Link
                  href="/hizmetler"
                  className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-label uppercase text-gold-deep transition-colors hover:text-ink"
                >
                  Ayrıntılar
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hakkımızda ────────────────────────────────────────── charcoal ──
          §6.1: trust is the entire product for a local jeweller. */}
      <section className="bg-charcoal">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={PLACEHOLDER.hero}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-label uppercase text-gold-soft">Hakkımızda</p>
            <h2 className="mt-3 display-md text-cream">{shop.claim}</h2>
            <div className="mt-5 h-px w-11 bg-gold" />

            {/* Recovered from the old site's Kurumsal page — true, verifiable,
                and a stronger claim than anything we could write. */}
            <div className="mt-6 flex flex-col gap-4 leading-relaxed text-cream/75">
              <p>
                Kapaklı Kuyumculuk {shop.founded} yılında Kapaklı ilçesinin
                merkezinde kuruldu ve ilçenin ilk kuyumcusu oldu. O günden beri
                aynı yerde, aynı ailenin elinde.
              </p>
              <p>
                Bir kuyumcunun sattığı şeyler geri gelir — ölçü değişir, tamir
                gerekir, bir sonraki kuşağa devredilir. Bu yüzden bir takıyı
                satarken de, yıllar sonra elimize geri geldiğinde de aynı
                şekilde davranırız.
              </p>
              <p>
                Altın, pırlanta ve seçkin saat markalarının yanında sipariş
                üzerine üretim de yapıyoruz.
              </p>
            </div>

            <Link
              href="/hakkimizda"
              className="mt-8 inline-flex min-h-11 items-center gap-1.5 border border-gold-soft/50 px-5 text-sm text-gold-soft transition-colors hover:bg-gold/15"
            >
              Devamını okuyun
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── İletişim ────────────────────────────────────────────── cream ── */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-label uppercase text-gold-deep">İletişim</p>
            <h2 className="mt-3 display-md">Mağazamıza bekleriz</h2>
            <div className="mt-5 h-px w-11 bg-gold" />
            <p className="mt-6 max-w-md leading-relaxed text-ink-muted">
              Aradığınız modeli tarif edin ya da uğrayın; vitrinde olmayan
              modelleri de tedarik edebiliyoruz.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ContactButton variant="solid" />
              <a
                href={phoneHref}
                className="inline-flex min-h-11 items-center px-4 font-display text-2xl text-gold-deep transition-colors hover:text-ink"
              >
                {phoneDisplay}
              </a>
            </div>
          </div>

          {/* Hairline-separated definition grid — the same continuous-surface
              treatment as the product grid. */}
          <dl className="border-t border-line">
            <div className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:gap-6">
              <dt className="text-label uppercase text-ink-muted sm:w-32 sm:flex-none">
                Adres
              </dt>
              <dd>
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="mt-1 block text-sm text-ink-muted">
                  {address.landmark.value}
                </span>
              </dd>
            </div>

            <div className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:gap-6">
              <dt className="text-label uppercase text-ink-muted sm:w-32 sm:flex-none">
                Saatler
              </dt>
              <dd>
                <span className="block">{hours.days}</span>
                <span className="block">
                  {hours.opens} – {hours.closes}
                </span>
                <span className="block text-sm text-ink-muted">
                  {hours.closedNote}
                </span>
              </dd>
            </div>

            <div className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:gap-6">
              <dt className="text-label uppercase text-ink-muted sm:w-32 sm:flex-none">
                Yol tarifi
              </dt>
              <dd>
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-gold-deep transition-colors hover:text-ink"
                >
                  <PinIcon className="h-4 w-4" />
                  Haritada açın
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
```
