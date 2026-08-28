"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ProductCard, specLine } from "./ProductCard";
import { ContactButton } from "./ContactButton";
import { CloseIcon } from "./icons";
import type { Product } from "@/lib/content";

/* §6.2 — the grid plus its lightbox.
 *
 * Built on the native <dialog>. showModal() traps focus, closes on Escape and
 * restores focus to the element that opened it, all to the platform's own
 * semantics — a hand-rolled focus trap here would be more code and worse. Its
 * baseline (Chrome 111+, Safari 16.4+) is exactly the one Next 16 already
 * requires, so it costs nothing.
 *
 * Grid and lightbox live in one component because they share the selected
 * index: the arrows step through the same list the grid renders.
 */
export function ProductGallery({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback((i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => {
        const next = current + delta;
        // Wrap, so arrowing never dead-ends inside a category.
        if (next < 0) return products.length - 1;
        if (next >= products.length) return 0;
        return next;
      });
    },
    [products.length],
  );

  /* Arrow keys step through the category. Escape is handled by <dialog>
   * itself, so it is deliberately not intercepted here. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };

    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, [step]);

  const active = products[index];

  return (
    <>
      <div className="grid grid-cols-2 border-l border-t border-line-dark lg:grid-cols-4">
        {products.map((product, i) => (
          <div key={product.id} className="border-b border-r border-line-dark">
            <button
              type="button"
              onClick={() => open(i)}
              aria-haspopup="dialog"
              className="block w-full cursor-pointer text-left"
            >
              <ProductCard product={product} />
              <span className="sr-only">büyüt</span>
            </button>
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active ? active.name : "Ürün görseli"}
        /* Clicking the backdrop closes. The check is on the dialog itself
         * because a click inside the panel does not target the dialog node. */
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        /* overscroll-contain stops a scroll gesture inside the panel chaining to
         * the page behind it, which on a phone reads as the modal leaking. */
        className="m-auto w-[min(64rem,92vw)] overscroll-contain bg-panel p-0 text-cream-text backdrop:bg-ground/80"
      >
        {active && (
          <div className="relative grid gap-px bg-line-dark sm:grid-cols-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center bg-panel text-muted transition-colors hover:text-gold-soft"
            >
              <span className="sr-only">Kapat</span>
              <CloseIcon className="h-5 w-5" />
            </button>

            <div className="relative aspect-square bg-panel">
              {active.images[0] && (
                <Image
                  src={active.images[0]}
                  alt={active.name}
                  fill
                  sizes="(min-width: 640px) 32rem, 92vw"
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex flex-col bg-panel p-6 sm:p-8">
              {/* tabular-nums so the counter does not reflow as the index changes. */}
              <p className="text-label uppercase tabular-nums text-gold-soft">
                {index + 1} / {products.length}
              </p>

              {/* Jost — D8 keeps Bodoni ≥32px and this tops out at 30px. */}
              <h2 className="mt-3 text-2xl leading-snug sm:text-3xl">
                {active.name}
              </h2>

              {specLine(active) && (
                <p className="mt-2 text-sm text-muted">
                  {specLine(active)}
                </p>
              )}

              {active.note && (
                <p className="mt-2 text-sm text-gold-soft">{active.note}</p>
              )}

              {/* Why no price. Saying it plainly is more reassuring than
                  leaving a blank where a price would be. */}
              <p className="mt-5 border-t border-line-dark pt-5 text-sm leading-relaxed text-muted">
                Fiyatlar günlük altın kuruna göre değiştiği için sitede
                yayınlanmıyor. Güncel fiyat ve gramaj için bize ulaşın.
              </p>

              <ContactButton
                productName={active.name}
                variant="solid"
                className="mt-6 self-start"
              />

              {products.length > 1 && (
                <div className="mt-6 flex gap-px border-t border-line-dark pt-6">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="inline-flex min-h-11 items-center border border-line-dark px-4 text-sm transition-colors hover:border-gold hover:text-gold-soft"
                  >
                    ← Önceki
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="inline-flex min-h-11 items-center border border-line-dark px-4 text-sm transition-colors hover:border-gold hover:text-gold-soft"
                  >
                    Sonraki →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
