import Image from "next/image";
import type { Product } from "@/lib/content";

/* §6.2 — image, name in serif, spec line, DETAY label.
 *
 * Purely presentational, and deliberately so: iteration 8 wraps this same card
 * in a button to open the lightbox, and the gallery there renders exactly what
 * the static grid renders. One card, one appearance, two contexts.
 */

/** `22 ayar · 38.5 gr` — the vernacular a Turkish customer actually judges by.
 *  Prices are absent everywhere on this site because they track the daily gold
 *  rate; weight and karat are the facts that do not move. */
export function specLine(product: Product): string {
  const parts: string[] = [];
  if (product.ayar) parts.push(`${product.ayar} ayar`);
  if (product.gram !== undefined) {
    parts.push(`${product.gram.toLocaleString("tr-TR")} gr`);
  }
  return parts.join(" · ");
}

export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  product: Product;
  sizes?: string;
}) {
  const spec = specLine(product);
  const image = product.images[0];

  return (
    <article className="group flex h-full flex-col bg-surface">
      <div className="relative aspect-square overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
        {/* The gold border appears on hover as an inset outline rather than a
            real border, so nothing reflows and the 1px grid stays exact. */}
        <div className="pointer-events-none absolute inset-0 opacity-0 outline outline-1 -outline-offset-1 outline-gold transition-opacity group-hover:opacity-100 motion-reduce:transition-none" />
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 py-3">
        <p className="font-display text-lg leading-snug">{product.name}</p>
        {spec && <p className="text-xs text-ink-muted">{spec}</p>}
        {product.note && (
          <p className="text-xs text-gold-deep">{product.note}</p>
        )}
        <p className="mt-auto pt-2 text-label uppercase text-ink-muted transition-colors group-hover:text-gold-deep">
          Detay
        </p>
      </div>
    </article>
  );
}
