import Image from "next/image";
import Link from "next/link";

import { CategoryTiles } from "@/components/CategoryTiles";
import { ContactButton } from "@/components/ContactButton";
import { HeroCoin } from "@/components/HeroCoin";
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
 * D6 overturned the alternating band rhythm: the body is one espresso room —
 * sections separate by spacing and hairlines (D11), panels are rationed — and
 * the cream frame is the header and footer around it. The old band comments
 * below are kept as section markers only.
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
      {/* ── Hero ─────────────────────────────────────────────── espresso ──
          D1/D13/D15: the old diamond-and-circles motif is retired — the coin
          is the hero's only motif now, homepage-only (D1). Headline left /
          coin right at lg+ (D13); stacked with the headline and both CTAs
          first on narrower screens, so they stay reachable without scrolling
          (D15). The single grid child order below serves both layouts: no
          reordering, just a column that only appears at lg. */}
      {/* overflow-hidden: the coin's radial glow deliberately bleeds past its
          own box (D7) — this clips that bleed at the viewport edge instead of
          letting it cause horizontal scroll on narrow screens. */}
      <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-ground">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <p className="text-label uppercase text-gold-soft">
              {address.locality} · {address.region}
            </p>

            <h1 className="mt-5 display-lg text-cream-text">
              Trakya Kapaklı
              <br />
              <span className="text-gold-soft">Kuyumculuk</span>
            </h1>

            <div className="mt-6 h-px w-11 bg-gold" />

            <p className="mt-6 max-w-md leading-relaxed text-muted">
              {shop.founded} yılından beri aynı yerde: altın, pırlanta ve
              sipariş üzerine üretilen özel tasarım takılar.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/urunler"
                className="inline-flex min-h-11 items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink-text transition-colors hover:bg-gold-soft"
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

          {/* Sized at 580px on Soner's direction at the 1.3 review — 1.5× the
              D14-ratio value (386px) that measured mathematically correct but
              read too small in the browser; the right margin pulls it off the
              container edge. 280/320 below lg are unchanged (mobile approved
              as-is). Supersedes D14's ≈1.2× headline-height ratio; the 46%
              width cap is waived with it, the 280px floor stands. */}
          <HeroCoin className="mx-auto w-[280px] sm:w-[320px] lg:mx-0 lg:mr-10 lg:w-[580px]" />
        </div>
      </section>

      {/* ── Kategoriler ──────────────────────────────────────── espresso ── */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="text-label uppercase text-gold-soft">Koleksiyonlar</p>
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
        <section>
          <div className="mx-auto max-w-6xl px-5 pb-16 sm:pb-20">
            <p className="text-label uppercase text-gold-soft">Öne Çıkanlar</p>
            <h2 className="mt-3 display-md">Seçtiklerimiz</h2>
            <div className="mt-5 h-px w-11 bg-gold" />
            <div className="mt-10">
              <ProductGallery products={featured} />
            </div>
          </div>
        </section>
      )}

      {/* ── Hizmetler ────────────────────────────────────────── espresso ──
          Two panels, not five. §6.1: two reads as deliberate, a padded list of
          five reads as filler. */}
      <section>
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:pb-20">
          <p className="text-label uppercase text-gold-soft">Hizmetler</p>
          <div className="mt-8 grid border-l border-t border-line-dark sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.slug}
                className="border-b border-r border-line-dark bg-panel p-6 sm:p-8"
              >
                {/* Jost — D8 keeps Bodoni ≥32px; this heading is 24px. */}
                <h3 className="text-2xl">{service.name}</h3>
                <div className="mt-4 h-px w-11 bg-gold" />
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {SERVICE_COPY[service.slug]}
                </p>
                <Link
                  href="/hizmetler"
                  className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-label uppercase text-gold-soft transition-colors hover:text-cream-text"
                >
                  Ayrıntılar
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hakkımızda ───────────────────────────────────────── espresso ──
          §6.1: trust is the entire product for a local jeweller. */}
      <section>
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
            <h2 className="mt-3 display-md">{shop.claim}</h2>
            <div className="mt-5 h-px w-11 bg-gold" />

            {/* Recovered from the old site's Kurumsal page — true, verifiable,
                and a stronger claim than anything we could write. */}
            <div className="mt-6 flex flex-col gap-4 leading-relaxed text-cream-text">
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

      {/* ── İletişim ─────────────────────────────────────────── espresso ── */}
      <section>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-label uppercase text-gold-soft">İletişim</p>
            <h2 className="mt-3 display-md">Mağazamıza bekleriz</h2>
            <div className="mt-5 h-px w-11 bg-gold" />
            <p className="mt-6 max-w-md leading-relaxed text-muted">
              Aradığınız modeli tarif edin ya da uğrayın; vitrinde olmayan
              modelleri de tedarik edebiliyoruz.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ContactButton variant="solid" />
              {/* Jost — D8 keeps Bodoni ≥32px; the number is 24px. */}
              <a
                href={phoneHref}
                className="inline-flex min-h-11 items-center px-4 text-2xl text-gold-soft transition-colors hover:text-cream-text"
              >
                {phoneDisplay}
              </a>
            </div>
          </div>

          {/* Hairline-separated definition grid — the same continuous-surface
              treatment as the product grid. */}
          <dl className="border-t border-line-dark">
            <div className="flex flex-col gap-1 border-b border-line-dark py-5 sm:flex-row sm:gap-6">
              <dt className="text-label uppercase text-muted sm:w-32 sm:flex-none">
                Adres
              </dt>
              <dd>
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="mt-1 block text-sm text-muted">
                  {address.landmark.value}
                </span>
              </dd>
            </div>

            <div className="flex flex-col gap-1 border-b border-line-dark py-5 sm:flex-row sm:gap-6">
              <dt className="text-label uppercase text-muted sm:w-32 sm:flex-none">
                Saatler
              </dt>
              <dd>
                <span className="block">{hours.days}</span>
                <span className="block">
                  {hours.opens} – {hours.closes}
                </span>
                <span className="block text-sm text-muted">
                  {hours.closedNote}
                </span>
              </dd>
            </div>

            <div className="flex flex-col gap-1 border-b border-line-dark py-5 sm:flex-row sm:gap-6">
              <dt className="text-label uppercase text-muted sm:w-32 sm:flex-none">
                Yol tarifi
              </dt>
              <dd>
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-gold-soft transition-colors hover:text-cream-text"
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
