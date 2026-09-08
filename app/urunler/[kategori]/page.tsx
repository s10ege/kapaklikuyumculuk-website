import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactBand } from "@/components/ContactBand";
import { EmptyState } from "@/components/EmptyState";
import { JsonLd } from "@/components/JsonLd";
import { ProductGallery } from "@/components/ProductGallery";
import { getCategories, getCategory, getCategorySlugs, getProducts } from "@/lib/content";
import { breadcrumbSchema, categoryItemListSchema } from "@/lib/schema";

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
  const itemList = categoryItemListSchema(category, products);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Anasayfa", url: "/" },
          { name: "Ürünlerimiz", url: "/urunler" },
          { name: category.name, url: `/urunler/${category.slug}` },
        ])}
      />
      {/* Null while the category is empty — an ItemList claiming to list
          products that do not exist is worse than none (§10). */}
      {itemList && <JsonLd data={itemList} />}

      <Breadcrumb
        trail={[
          { label: "Anasayfa", href: "/" },
          { label: "Ürünlerimiz", href: "/urunler" },
          { label: category.name },
        ]}
      />

      <section>
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-soft">Koleksiyon</p>
          <h1 className="mt-3 display-md">{category.name}</h1>
          <div className="mt-5 h-px w-11 bg-gold" />

          {/* With no product pages, this paragraph is the category's entire
              search surface (§6.2). It is written to be read. */}
          <p className="mt-6 max-w-2xl leading-relaxed text-muted">
            {category.intro}
          </p>

          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line-dark pb-3">
            <p className="text-label uppercase text-muted">
              {products.length > 0 ? `${products.length} model` : "Hazırlanıyor"}
            </p>
            {products.length > 0 && (
              <p className="text-xs text-muted">
                Görsele tıklayarak büyütün
              </p>
            )}
          </div>

          <div className="mt-6">
            {products.length > 0 ? (
              <ProductGallery products={products} />
            ) : (
              <EmptyState subject={category.name} />
            )}
          </div>
        </div>
      </section>

      <ContactBand />

      {/* Sibling categories, so nobody dead-ends on an empty page (§6.2). At
          launch every category is empty, which makes this row the main way
          round the catalogue. */}
      {/* pb-28 below sm: the fixed FAB overlaps the last row's İncele label
          on narrow screens without it (1.4 review). */}
      <nav aria-label="Diğer kategoriler">
        <div className="mx-auto max-w-6xl px-5 pt-12 pb-28 sm:pb-12">
          <p className="text-label uppercase text-gold-soft">
            Diğer kategoriler
          </p>
          <ul className="mt-5 border-t border-line-dark">
            {siblings.map((sibling) => (
              <li key={sibling.slug} className="border-b border-line-dark">
                <Link
                  href={`/urunler/${sibling.slug}`}
                  className="flex min-h-[3.5rem] items-center justify-between gap-4 py-2 transition-colors hover:text-gold-soft"
                >
                  {/* Jost — D8 keeps Ibarra ≥32px; row titles are 20px. */}
                  <span className="text-xl">{sibling.name}</span>
                  <span className="text-label uppercase text-muted">
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
