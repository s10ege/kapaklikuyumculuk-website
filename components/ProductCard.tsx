import Image from "next/image";
import type { Product } from "@/lib/content";

/* §6.2 — image, name, spec line, DETAY label.
 *
 * Purely presentational, and deliberately so: iteration 8 wraps this same card
 * in a button to open the lightbox, and the gallery there renders exactly what
 * the static grid renders. One card, one appearance, two contexts.
 */

/* 60, not the default 75.
 *
 * Measured at w=750 on a production build: nine of the 60 masters exceed 80 KB
 * on the WebP path at q=75, the worst at 148 KB. AVIF-capable browsers were
 * never the problem — every image is under 66 KB there — but Safari before 16
 * and older Android get WebP, and they are not a rounding error for a shop in
 * Kapaklı. A card renders at a quarter of the viewport inside a hairline
 * border; 60 is invisible at that size and is not invisible on the wire.
 *
 * The lightbox deliberately does NOT use this: that image is the one somebody
 * has chosen to look at closely, which is the whole point of opening it. */
const CARD_QUALITY = 60;

export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  eager = false,
}: {
  product: Product;
  sizes?: string;
  /* The first card in a grid is the LCP element on every category page, and
     was lazy-loaded — Next names the file in the dev log every time. Only the
     caller knows which card is first, so it is a prop rather than a guess.
     Requires `images.qualities` in next.config.ts to include CARD_QUALITY;
     Next 16 rejects an unlisted value with a 400. */
  eager?: boolean;
}) {
  const image = product.images[0];

  return (
    <article className="group flex h-full flex-col bg-panel">
      <div className="relative aspect-square overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={product.alt ?? product.name}
            fill
            sizes={sizes}
            quality={CARD_QUALITY}
            loading={eager ? "eager" : "lazy"}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
        {/* The gold border appears on hover as an inset outline rather than a
            real border, so nothing reflows and the 1px grid stays exact. */}
        <div className="pointer-events-none absolute inset-0 opacity-0 outline outline-1 -outline-offset-1 outline-gold transition-opacity group-hover:opacity-100 motion-reduce:transition-none" />
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 py-3">
        {/* Jost — D8 keeps Ibarra ≥32px; a card name is 18px. */}
        <p className="text-lg leading-snug">{product.name}</p>
        {product.spec && <p className="text-xs text-muted">{product.spec}</p>}
        {product.note && (
          <p className="text-xs text-gold-soft">{product.note}</p>
        )}
        <p className="mt-auto pt-2 text-label uppercase text-muted transition-colors group-hover:text-gold-soft">
          Detay
        </p>
      </div>
    </article>
  );
}
