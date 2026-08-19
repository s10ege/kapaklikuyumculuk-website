"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Lockup } from "./Lockup";
import { CloseIcon, MenuIcon } from "./icons";
import type { NavLink } from "@/lib/nav";

/* §5 — sticky, charcoal-deep, slim.
 *
 * Categories and page links are passed in rather than imported, so this stays a
 * client component without dragging lib/content into the browser bundle.
 */
export function Header({
  categories,
  pages,
}: {
  categories: NavLink[];
  pages: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /* Navigating away must close the panel — otherwise the menu stays open over
   * the new page, because the route changes without this component unmounting.
   *
   * Adjusting during render rather than in an effect: React re-runs this
   * component immediately without painting the stale open panel, and it covers
   * back/forward navigation too, which an onClick handler on each link would
   * miss. */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  /* Escape closes, and the background does not scroll underneath an open panel
   * — on a phone that is the difference between a menu and a trap. */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-charcoal-deep">
      {/* Reserved for the phase-two gold price ticker (§5). Deliberately empty
          and zero-height now: the slot exists so adding the ticker later is a
          change here and nowhere else in the layout. */}
      <div id="gold-ticker-slot" aria-hidden="true" />

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Lockup />

        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {pages.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center border-b text-sm transition-colors ${
                      active
                        ? "border-gold text-gold-soft"
                        : "border-transparent text-cream/80 hover:text-gold-soft"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobil-menu"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-cream lg:hidden"
        >
          <span className="sr-only">{open ? "Menüyü kapat" : "Menüyü aç"}</span>
          {open ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {open && (
        <div
          id="mobil-menu"
          className="border-t border-white/10 bg-charcoal-deep lg:hidden"
        >
          {/* Categories first, then pages (§5). Someone arriving from Instagram
              wants to see pieces, not an About page. */}
          <nav aria-label="Kategoriler">
            <ul className="flex flex-col">
              {categories.map((link) => (
                <li key={link.href} className="border-b border-white/10">
                  <Link
                    href={link.href}
                    className="flex min-h-[3.25rem] items-center px-5 font-display text-xl text-cream transition-colors hover:text-gold-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Sayfalar">
            <ul className="flex flex-col py-2">
              {pages.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-11 items-center px-5 text-sm tracking-wide text-cream/70 transition-colors hover:text-gold-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
