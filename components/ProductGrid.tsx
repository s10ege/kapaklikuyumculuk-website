import type { Product } from "@/lib/content";
import { ProductCard } from "./ProductCard";

/* §6.2 — 4-up desktop, 2-up mobile, square crops, 1px rules.
 *
 * The rules are the signature. §3: separation comes from 1px of --color-line,
 * so the grid reads as one continuous surface with lines drawn on it — a
 * display case divided by thin metal, rather than cards floating on a page.
 *
 * Drawn as a border on each cell (right + bottom, with the container supplying
 * top + left) rather than as `gap-px` over a `bg-line` container. The gap
 * approach paints the container background through every cell the last row
 * does not fill, so a category with 6 products in a 4-column grid ends in two
 * grey blocks. Per-cell borders simply stop where the products do, and because
 * no cell carries a left or top border none of them double up.
 */
export function ProductGrid({
  products,
  className = "",
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-2 border-l border-t border-line lg:grid-cols-4 ${className}`}
    >
      {products.map((product) => (
        <div key={product.id} className="border-b border-r border-line">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
