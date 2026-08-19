import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { CategoryTiles } from "@/components/CategoryTiles";
import { ContactBand } from "@/components/ContactBand";
import { getCategories, pageTitle } from "@/lib/content";

/* §6.3 — Ürünlerimiz.
 *
 * §4: `/urunler` is an already-indexed address (archived 2019) being reclaimed
 * as a live page rather than redirected away. A live page at an indexed URL is
 * worth far more than a 301.
 */

export const metadata: Metadata = {
  title: pageTitle("Ürünlerimiz"),
  description:
    "Pırlanta, altın seti, küpe, tek taş ve özel tasarım takı " +
    "koleksiyonlarımız. Kapaklı / Tekirdağ.",
  alternates: { canonical: "/urunler" },
};

export default function ProductsPage() {
  const categories = getCategories();

  return (
    <>
      <Breadcrumb
        trail={[{ label: "Anasayfa", href: "/" }, { label: "Ürünlerimiz" }]}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-deep">Koleksiyonlar</p>
          <h1 className="mt-3 display-md">Ürünlerimiz</h1>
          <div className="mt-5 h-px w-11 bg-gold" />

          <p className="mt-6 max-w-2xl leading-relaxed text-ink-muted">
            Vitrinimizi beş başlıkta topladık. Aradığınız parça burada yoksa
            sorun — tedarik edebildiklerimiz vitrindekilerden çok daha geniş, ve
            sipariş üzerine üretim de yapıyoruz.
          </p>

          {/* No "Tüm Ürünler" tile here: this is that page. */}
          <div className="mt-10">
            <CategoryTiles categories={categories} showAllTile={false} />
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
