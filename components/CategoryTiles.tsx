import Image from "next/image";
import Link from "next/link";

import type { Category } from "@/lib/content";
import { ArrowRightIcon } from "./icons";

/* §6.1 — the real purpose of the homepage.
 *
 * Four tiles, one row at lg+, 2×2 below. Nothing else.
 *
 * The two filler cells this component used to carry are gone with the fifth
 * category (2026-09-08). Both existed for the same reason: five tiles in a
 * three-column grid left a hole, and a hole reads as a loading failure — so
 * the homepage grew a pale-gold "Tüm Ürünler" tile and /urunler an ask-cell to
 * plug it. Four tiles divide evenly into both 4 and 2, so there is no hole to
 * plug, and a tile competing with four photographs for the same attention is
 * a cost with nothing left to buy. The route onward is a text link under the
 * grid instead — see AllProductsLink below.
 */
export function CategoryTiles({ categories }: { categories: Category[] }) {
  return (
    <ul className="grid grid-cols-2 border-l border-t border-line-dark lg:grid-cols-4">
      {categories.map((category, i) => (
        <li
          key={category.slug}
          className="border-b border-r border-line-dark"
        >
          {/* D16, revised 2026-08-29 — the polished photograph fills the tile
              (object-cover), inside the same hairline border (the 1px grid),
              with the gold label and the gold outline on hover. The cut-outs
              that object-contain and its padding existed for are gone with the
              rembg pipeline; a photograph half-floating on the panel colour
              would read as a mistake rather than a motif. The scrim below is
              the cost of that: a label over a photograph needs one. */}
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
                 above-the-fold image delays the paint it is measured by.
                 This was `priority={i === 0}`, deprecated in Next 16. The
                 straight rename is `preload`, but the local docs
                 (03-api-reference/02-components/image.md) say not to preload
                 when several images could be the LCP element depending on
                 viewport — and these tiles are 2x2 on a phone, 1x4 on a
                 desktop. They also say `loading="eager"` is what most cases
                 want instead.

                 Which is what the sentence above always described. `priority`
                 additionally injects a <link rel="preload"> in the head, which
                 is why Next kept warning "add loading='eager'" on /urunler
                 even with the prop set — the tile was preloaded and still
                 lazy-negotiated. One word, and the warning goes with it. */
              loading={i === 0 ? "eager" : "lazy"}
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />

            {/* The smallest scrim the label needs (D16) — carried by the label
                row itself rather than a fixed fraction of the tile, so it is
                exactly as tall as the text is. `Küpe Modelleri` wraps to two
                lines at 390 and one at 1440; a `h-1/2` scrim covered the second
                line and left the first at 2.1:1 over white paper. The extra top
                padding is the fade-in distance.

                The stops are measured, not guessed. gold-soft on a light ground
                cannot reach 3:1 at all — a photograph shot on white paper has
                to be pushed below roughly 95 grey behind the label before it
                does, which is what these put it at even where a specular
                highlight lands under a glyph. 3:1 is the AA bar for text this
                size. */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ground/95 via-ground/80 to-transparent p-4 pt-12 sm:p-5 sm:pt-14">
              {/* Gold label (D16), Jost — D8 keeps Ibarra ≥32px. */}
              <span className="text-xl leading-tight text-gold-soft sm:text-2xl">
                {category.name}
              </span>
              <span className="flex flex-none items-center gap-1.5 text-label uppercase text-muted opacity-0 transition-opacity group-hover:opacity-100">
                İncele
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Gold inset border on hover — an outline rather than a border, so
                nothing reflows and the 1px grid stays exact. Last, so its
                bottom edge is not washed out by the label's scrim. */}
            <div className="pointer-events-none absolute inset-0 opacity-0 outline outline-1 -outline-offset-[5px] outline-gold transition-opacity group-hover:opacity-100 motion-reduce:transition-none" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* The route onward, as a line of text rather than a fifth cell.
 *
 * D12 rations gold to one fill per section, and the tile grid below the
 * headline is already the section's weight — so this is the label treatment
 * (11px, 0.18em tracking, gold-soft), centred under the grid, with the 44px
 * tap target §7 requires. It is deliberately quieter than a tile: someone who
 * wants a category clicks a photograph, and this is for the minority who want
 * the lot.
 */
export function AllProductsLink({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Link
        href="/urunler"
        className="inline-flex min-h-11 items-center gap-2 text-label uppercase text-gold-soft transition-colors hover:text-cream-text"
      >
        Tüm ürünleri gör
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
