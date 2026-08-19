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
    <main className="flex flex-1 flex-col">
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
    </main>
  );
}
