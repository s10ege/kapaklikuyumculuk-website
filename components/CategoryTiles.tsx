import Image from "next/image";
import Link from "next/link";

import type { Category } from "@/lib/content";
import { ArrowRightIcon } from "./icons";

/* §6.1 — the real purpose of the homepage.
 *
 * Five category tiles plus a sixth "Tüm Ürünler" tile that completes the grid.
 * That sixth tile is not filler: five items in a three-column grid leaves a
 * hole, and the hole is exactly where a visitor who wants to browse everything
 * would look. It earns its place twice.
 *
 * Reused by /urunler in iteration 10, where the sixth tile is dropped.
 */
export function CategoryTiles({
  categories,
  showAllTile = true,
  showAskTile = false,
}: {
  categories: Category[];
  showAllTile?: boolean;
  /** /urunler: five tiles in a three-column grid leave a dead cell that
   *  reads as a loading failure. A quiet ask-cell completes the grid the
   *  same way Tüm Ürünler does on the homepage (1.5 review, C4). */
  showAskTile?: boolean;
}) {
  return (
    <ul className="grid grid-cols-2 border-l border-t border-line-dark sm:grid-cols-3">
      {categories.map((category, i) => (
        <li
          key={category.slug}
          className="border-b border-r border-line-dark"
        >
          {/* D16 — cut-out image on the panel colour, hairline border (the
              1px grid), gold label, border turns gold on hover. The image is
              object-contain with its own padding so the motif — and later the
              transparent product cut-outs from stage 2 — sits ON the panel
              rather than filling the tile; no scrim needed over a surface
              that is already the panel colour. */}
          <Link
            href={`/urunler/${category.slug}`}
            className="group relative block aspect-square overflow-hidden bg-panel"
          >
            <Image
              src={category.coverImage}
              alt=""
              fill
              /* On /urunler the first tile is the LCP element, and Next warns
                 about it. Eager-loading the first row only — lazy-loading an
                 above-the-fold image delays the paint it is measured by. */
              priority={i === 0}
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-contain p-5 pb-14 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:p-6 sm:pb-16"
            />

            {/* Gold inset border on hover — an outline rather than a border, so
                nothing reflows and the 1px grid stays exact. */}
            <div className="pointer-events-none absolute inset-0 opacity-0 outline outline-1 -outline-offset-[5px] outline-gold transition-opacity group-hover:opacity-100 motion-reduce:transition-none" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
              {/* Gold label (D16), Jost — D8 keeps Ibarra ≥32px. */}
              <span className="text-xl leading-tight text-gold-soft sm:text-2xl">
                {category.name}
              </span>
              <span className="flex flex-none items-center gap-1.5 text-label uppercase text-muted opacity-0 transition-opacity group-hover:opacity-100">
                İncele
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        </li>
      ))}

      {showAskTile && (
        <li className="border-b border-r border-line-dark">
          <Link
            href="/iletisim"
            className="group flex aspect-square flex-col items-start justify-end bg-panel p-4 transition-colors hover:bg-gold/15 sm:p-5"
          >
            <span className="text-xl leading-tight text-cream-text sm:text-2xl">
              Aradığınız burada yoksa
            </span>
            <span className="mt-2 flex items-center gap-1.5 text-label uppercase text-gold-soft">
              Bize Sorun
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </span>
          </Link>
        </li>
      )}

      {showAllTile && (
        <li className="border-b border-r border-line-dark">
          <Link
            href="/urunler"
            className="group flex aspect-square flex-col items-start justify-end bg-panel p-4 transition-colors hover:bg-gold/15 sm:p-5"
          >
            <span className="text-xl leading-tight text-cream-text sm:text-2xl">
              Tüm Ürünler
            </span>
            <span className="mt-2 flex items-center gap-1.5 text-label uppercase text-gold-soft">
              Hepsini gör
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </span>
          </Link>
        </li>
      )}
    </ul>
  );
}
