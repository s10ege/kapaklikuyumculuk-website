import Link from "next/link";
import { shop } from "@/lib/config";

/* The horizontal lockup (§3).
 *
 * The existing logo is a square, app-icon-style tile: a gold KK inside a double
 * oval on near-black. A header needs a horizontal form of it, so the mark sits
 * on the left with TRAKYA KAPAKLI letter-spaced beside it and KUYUMCULUK in
 * small caps beneath.
 *
 * This was written when there was no vector original (§14 item 5), so the oval
 * is redrawn here rather than traced from the PNG — at header sizes a trace of
 * a low-res tile would show.
 *
 * A vector original DID turn up, on 2026-09-09, and it is now app/icon.svg.
 * The note this replaces said to swap OvalMark's paths for it and change
 * nothing else. That was deliberately NOT done, because the two are not the
 * same drawing: the badge is a slanted, stroked -KK- with flanking dashes in a
 * metallic gold gradient on charcoal, sized to fill a rounded tile; this is an
 * upright KK set in the display face, in flat gold-deep, on cream, beside a
 * wordmark. Dropping one into the other changes the header and the footer on
 * every page and needs Soner's eye and a design review — worth doing, and its
 * own piece of work rather than a side effect of fixing the favicon.
 *
 * The wordmark is real text, not part of the SVG: it stays selectable, it
 * scales with the user's font settings, and screen readers get it for free.
 */

/* Exported since 2026-09-08 so the OG cards can draw the mark without the
   <Link> wrapper below. There is still exactly one copy of the redrawn oval —
   which is the point, since there is no vector original to fall back on. */
export function OvalMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        cx="32"
        cy="32"
        rx="29"
        ry="23"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="24.5"
        ry="18.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* fontWeight matches the display headings (D8): without it a variable
          display face falls back to 400 and the monogram draws lighter than
          every heading. Soner's call at the 1.6 approval. */}
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontFamily="var(--font-display), Georgia, serif"
        fontWeight="500"
        fontSize="21"
        letterSpacing="0.02em"
      >
        KK
      </text>
    </svg>
  );
}

export function Lockup({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex min-h-11 items-center gap-3 ${className}`}
      aria-label={`${shop.name} — anasayfa`}
    >
      {/* The lockup sits on cream in both the header and the footer, so the
          mark is gold-deep — the only gold legible there (design.md).

          The wordmark derives from shop.name and is uppercased by CSS only:
          hard rule 2 — the stored string stays title case everywhere, and
          with lang="tr" on the document the transform follows Turkish casing
          (Kapaklı → KAPAKLI, dotless ı preserved). */}
      <OvalMark className="h-10 w-10 flex-none text-gold-deep transition-colors group-hover:text-gold" />
      <span className="flex flex-col leading-none">
        <span className="text-[0.8125rem] font-medium uppercase tracking-[0.2em] text-ink-text">
          {shop.name.split(" ").slice(0, -1).join(" ")}
        </span>
        <span className="mt-[0.3rem] text-[0.625rem] uppercase tracking-[0.32em] text-gold-deep">
          {shop.name.split(" ").at(-1)}
        </span>
      </span>
    </Link>
  );
}
