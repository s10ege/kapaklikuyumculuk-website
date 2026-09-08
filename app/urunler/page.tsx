import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { CategoryTiles } from "@/components/CategoryTiles";
import { ContactBand } from "@/components/ContactBand";
import { COPY } from "@/lib/copy";
import { getCategories, pageTitle } from "@/lib/content";
import { openGraph } from "@/lib/metadata";

/* §6.3 — Ürünlerimiz.
 *
 * §4: `/urunler` is an already-indexed address (archived 2019) being reclaimed
 * as a live page rather than redirected away. A live page at an indexed URL is
 * worth far more than a 301.
 */

export const metadata: Metadata = {
  title: pageTitle("Ürünlerimiz"),
  description:
    "Kapaklı kuyumcu: altın set, küpe, yüzük ve sipariş üzerine yaptığımız " +
    "takılar. Ayar ve gram etikette, fiyat günün altın kuruna göre.",
  alternates: { canonical: "/urunler" },
  openGraph: openGraph("/urunler"),
};

export default function ProductsPage() {
  const categories = getCategories();

  return (
    <>
      <Breadcrumb
        trail={[
          { label: "Anasayfa", href: "/" },
          { label: "Ürünlerimiz", href: "/urunler" },
        ]}
      />

      <section>
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-soft">Koleksiyonlar</p>
          <h1 className="mt-3 display-md">Ürünlerimiz</h1>
          <div className="mt-5 h-px w-11 bg-gold" />

          <p className="mt-6 max-w-2xl leading-relaxed text-muted">
            {COPY.urunler.lede}
          </p>

          {/* Four tiles, nothing else. The ask-cell that used to complete a
              six-cell grid retired with the fifth category — four divides
              evenly, so there is no hole left for a filler tile to plug. */}
          <div className="mt-10">
            <CategoryTiles categories={categories} />
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
