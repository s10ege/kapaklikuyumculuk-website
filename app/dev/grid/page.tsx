import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/EmptyState";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product } from "@/lib/content";
import { PLACEHOLDER } from "@/lib/placeholders";

/* Verification artefact for iteration 7 of plan.md.
 *
 * The catalogue is empty at launch, so the real category pages only ever show
 * the Yakında panel. The grid still has to be right for phase two, and it is
 * easier to judge now than to rediscover later — so it is proven here against
 * fixtures rather than by temporarily seeding lib/content.ts and forgetting to
 * take the fixtures back out.
 *
 * 404s in production.
 */

export const metadata: Metadata = {
  title: "Grid",
  robots: { index: false, follow: false },
};

const FIXTURES: Product[] = [
  {
    id: "f1",
    name: "22 Ayar Burma Bilezik",
    category: "altin-seti",
    images: [PLACEHOLDER.urun],
    ayar: "22",
    gram: 38.5,
    order: 1,
  },
  {
    id: "f2",
    name: "Tek Taş Pırlanta Yüzük",
    category: "tek-tas-modelleri",
    images: [PLACEHOLDER.urun],
    note: "Sipariş üzerine üretilir",
    order: 2,
  },
  {
    id: "f3",
    name: "18 Ayar Altın Kolye",
    category: "altin-seti",
    images: [PLACEHOLDER.urun],
    ayar: "18",
    gram: 12.4,
    order: 3,
  },
  {
    id: "f4",
    name: "Beşi Bir Yerde",
    category: "altin-seti",
    images: [PLACEHOLDER.urun],
    ayar: "22",
    gram: 36,
    order: 4,
  },
  {
    id: "f5",
    name: "Pırlanta Halka Küpe",
    category: "kupe-modelleri",
    images: [PLACEHOLDER.urun],
    ayar: "18",
    gram: 4.75,
    order: 5,
  },
  {
    id: "f6",
    name: "Gümüş Hızma",
    category: "ozel-tasarim-takilar",
    images: [PLACEHOLDER.urun],
    ayar: "gümüş",
    order: 6,
  },
];

export default function GridPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-label uppercase text-gold-deep">Iterasyon 7</p>
        <h1 className="mt-3 display-lg">Ürün Izgarası</h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          Örnek verilerle. Lansmanda katalog boş olduğu için gerçek kategori
          sayfaları yalnızca Yakında panelini gösterir.
        </p>

        <div className="mt-10 border-b border-line pb-3">
          <p className="text-label uppercase text-ink-muted">
            {FIXTURES.length} model · 4&apos;lü masaüstü, 2&apos;li mobil ·
            görsele tıklayarak büyütün
          </p>
        </div>
        <div className="mt-6">
          <ProductGallery products={FIXTURES} />
        </div>

        <div className="mt-14 border-b border-line pb-3">
          <p className="text-label uppercase text-ink-muted">
            Tek satırda üç ürün — ızgara boşluk bırakmadan hizalanır
          </p>
        </div>
        <ProductGrid products={FIXTURES.slice(0, 3)} className="mt-6" />

        <div className="mt-14 border-b border-line pb-3">
          <p className="text-label uppercase text-ink-muted">
            Boş durum — lansmanda beş kategoride de görünen ekran
          </p>
        </div>
        <EmptyState subject="Pırlanta" className="mt-6" />
      </div>
    </main>
  );
}
