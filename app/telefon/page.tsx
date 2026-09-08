import type { Metadata } from "next";
import Link from "next/link";

import { PhoneIcon } from "@/components/icons";
import {
  hours,
  phoneAltDisplay,
  phoneDisplay,
  phoneHref,
  shop,
} from "@/lib/config";
import { CallForward } from "./CallForward";

/* The analytics hop for the call button (TECHNICAL.md §9), and the twin of
 * /yol-tarifi.
 *
 * WHY A PAGE AND NOT A REDIRECT. Three reasons, and any one is sufficient. A
 * redirect would be the only dynamic route in the build — hard rule 9 keeps
 * this site fully static, no ƒ. It renders nothing, so the Vercel Analytics
 * beacon this route exists to fire would never fire. And browsers handle a
 * redirect to a `tel:` URL inconsistently, which is the reason peculiar to
 * this one.
 *
 * WHAT IT COSTS. One paint before the dialer opens. The page is written to be
 * worth that paint: with JavaScript off, or on a desktop where `tel:` has no
 * handler at all, the number is right there as selectable text — which is
 * §6.11, and the reason only the label-bearing buttons route through here
 * while every printed number stays a direct `tel:` link.
 *
 * noindex, and absent from the sitemap: this is machinery, not a page anyone
 * should reach from a search result.
 */

export const metadata: Metadata = {
  title: `Telefon - ${shop.name}`,
  robots: { index: false, follow: false },
};

export default function CallPage() {
  return (
    <section className="flex flex-1 items-center bg-ground">
      <div className="mx-auto w-full max-w-lg px-5 py-20 sm:py-28">
        <p className="text-label uppercase text-gold-soft">Telefon</p>

        <h1 className="mt-4 display-md text-cream-text">Arama başlatılıyor</h1>

        <div className="mt-6 h-px w-11 bg-gold" />

        <CallForward />

        {/* The fallback, and the whole page on a desktop. The number is a link
            on the digits themselves so it can be tapped, and text so it can be
            selected and copied. */}
        <a
          href={phoneHref}
          className="mt-8 inline-flex min-h-14 items-center gap-3 text-3xl text-gold-soft transition-colors hover:text-cream-text"
        >
          <PhoneIcon className="h-6 w-6 flex-none" />
          {phoneDisplay}
        </a>

        <p className="mt-4 text-sm text-muted">{phoneAltDisplay}</p>

        {/* Someone who lands here outside opening hours should find that out
            here, not after the call rings out. */}
        <ul className="mt-8 border-t border-line-dark text-sm text-muted">
          {[hours.summer, hours.winter].map((season) => (
            <li
              key={season.label}
              className="flex flex-wrap justify-between gap-x-4 border-b border-line-dark py-3"
            >
              <span>{season.label}</span>
              <span className="text-cream-text">
                {season.days} · {season.open}–{season.close}
              </span>
            </li>
          ))}
          <li className="py-3">{hours.closed}</li>
        </ul>

        <p className="mt-8 text-sm text-muted">
          <Link
            href="/iletisim"
            className="underline underline-offset-4 hover:text-gold-soft"
          >
            İletişim sayfasına dön
          </Link>
        </p>
      </div>
    </section>
  );
}
