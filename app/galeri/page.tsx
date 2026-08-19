import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactBand } from "@/components/ContactBand";
import { EmptyState } from "@/components/EmptyState";
import { ProductGallery } from "@/components/ProductGallery";
import { getCategories, getProducts, pageTitle } from "@/lib/content";

/* §6.4 — Galeri.
 *
 * §4: `/galeri` is one of the six URLs confirmed still in Google's index, where
 * it currently returns a 404 carrying the old title "GALERİ - Kapaklı
 * Kuyumculuk | 0282 717 21 31". Reclaiming the exact path with a real page is
 * the point; the redirect for it is deleted from vercel.json in iteration 13.
 *
 * Every product across every category in one grid, with the same lightbox.
 */

export const metadata: Metadata = {
  title: pageTitle("Galeri"),
  description:
    "Mağazamızdan altın, pırlanta ve özel tasarım takı fotoğrafları. " +
    "Kapaklı / Tekirdağ.",
  alternates: { canonical: "/galeri" },
};

export default function GalleryPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <>
      <Breadcrumb
        trail={[{ label: "Anasayfa", href: "/" }, { label: "Galeri" }]}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-deep">Galeri</p>
          <h1 className="mt-3 display-md">Vitrinimizden</h1>
          <div className="mt-5 h-px w-11 bg-gold" />

          <p className="mt-6 max-w-2xl leading-relaxed text-ink-muted">
            Tüm kategorilerden seçtiğimiz parçalar bir arada. Bir modeli daha
            yakından görmek için görsele dokunun.
          </p>

          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
            <p className="text-label uppercase text-ink-muted">
              {products.length > 0
                ? `${products.length} model`
                : "Hazırlanıyor"}
            </p>
            {products.length > 0 && (
              <p className="text-xs text-ink-muted">
                Görsele tıklayarak büyütün
              </p>
            )}
          </div>

          <div className="mt-6">
            {products.length > 0 ? (
              <ProductGallery products={products} />
            ) : (
              <EmptyState subject="Galerimiz" />
            )}
          </div>

          {/* With the gallery empty at launch, this row is how a visitor who
              landed here from an old search result gets somewhere useful. */}
          <nav aria-label="Kategoriler" className="mt-14">
            <p className="text-label uppercase text-gold-deep">Kategoriler</p>
            <ul className="mt-5 border-t border-line">
              {categories.map((category) => (
                <li key={category.slug} className="border-b border-line">
                  <Link
                    href={`/urunler/${category.slug}`}
                    className="flex min-h-[3.5rem] items-center justify-between gap-4 py-2 transition-colors hover:text-gold-deep"
                  >
                    <span className="font-display text-xl">
                      {category.name}
                    </span>
                    <span className="text-label uppercase text-ink-muted">
                      İncele
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
