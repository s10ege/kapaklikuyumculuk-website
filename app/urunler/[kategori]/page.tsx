import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactBand } from "@/components/ContactBand";
import { EmptyState } from "@/components/EmptyState";
import { ProductGrid } from "@/components/ProductGrid";
import { getCategories, getCategory, getCategorySlugs, getProducts } from "@/lib/content";

/* The category template (§6.2) — the piece that has to look right with three
 * products, forty, or none. Built before the homepage for exactly that reason.
 *
 * There are no individual product pages (§1). These five URLs are the entire
 * search surface, which is why the intro paragraph below is real writing and
 * why each page carries its own metadata.
 */

export function generateStaticParams() {
  return getCategorySlugs().map((kategori) => ({ kategori }));
}

export async function generateMetadata({
  params,
}: PageProps<"/urunler/[kategori]">): Promise<Metadata> {
  const { kategori } = await params;
  const category = getCategory(kategori);

  if (!category) return {};

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/urunler/${category.slug}` },
    openGraph: {
      title: category.title,
      description: category.description,
      url: `/urunler/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/urunler/[kategori]">) {
  const { kategori } = await params;
  const category = getCategory(kategori);

  if (!category) notFound();

  const products = getProducts(category.slug);
  const siblings = getCategories().filter((c) => c.slug !== category.slug);

  return (
    <>
      <Breadcrumb
        trail={[
          { label: "Anasayfa", href: "/" },
          { label: "Ürünlerimiz", href: "/urunler" },
          { label: category.name },
        ]}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-deep">Koleksiyon</p>
          <h1 className="mt-3 display-md">{category.name}</h1>
          <div className="mt-5 h-px w-11 bg-gold" />

          {/* With no product pages, this paragraph is the category's entire
              search surface (§6.2). It is written to be read. */}
          <p className="mt-6 max-w-2xl leading-relaxed text-ink-muted">
            {category.intro}
          </p>

          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
            <p className="text-label uppercase text-ink-muted">
              {products.length > 0 ? `${products.length} model` : "Hazırlanıyor"}
            </p>
            {products.length > 0 && (
              <p className="text-xs text-ink-muted">
                Görsele tıklayarak büyütün
              </p>
            )}
          </div>

          <div className="mt-6">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <EmptyState subject={category.name} />
            )}
          </div>
        </div>
      </section>

      <ContactBand productName={category.name} />

      {/* Sibling categories, so nobody dead-ends on an empty page (§6.2). At
          launch every category is empty, which makes this row the main way
          round the catalogue. */}
      <nav aria-label="Diğer kategoriler" className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-label uppercase text-gold-deep">
            Diğer kategoriler
          </p>
          <ul className="mt-5 border-t border-line">
            {siblings.map((sibling) => (
              <li key={sibling.slug} className="border-b border-line">
                <Link
                  href={`/urunler/${sibling.slug}`}
                  className="flex min-h-[3.5rem] items-center justify-between gap-4 py-2 transition-colors hover:text-gold-deep"
                >
                  <span className="font-display text-xl">{sibling.name}</span>
                  <span className="text-label uppercase text-ink-muted">
                    İncele
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
