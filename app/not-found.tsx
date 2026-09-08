import type { Metadata } from "next";
import Link from "next/link";

import { DirectionsButton } from "@/components/DirectionsButton";
import { ArrowRightIcon } from "@/components/icons";
import { addressLines, phoneDisplay, phoneHref, shop } from "@/lib/config";
import { COPY } from "@/lib/copy";

/* §6.8 — 404.
 *
 * This page has a real job. The old WordPress site left 309 URLs behind, and
 * everything not worth a redirect — /wp-admin, /author/*, /wp-content/* —
 * deliberately lands here (§4 rule 3). Google is still crawling some of them.
 *
 * So it has to read like a shop, not like Vercel's English error screen: say
 * plainly that the site was renewed, then give the visitor the two things they
 * actually came for — the products and the phone number — with the address
 * underneath in case they only wanted to know where we are.
 *
 * The frontend-design brief puts it well: an empty screen is an invitation to
 * act, and errors do not apologise or stay vague about what happened.
 */

export const metadata: Metadata = {
  title: `Sayfa bulunamadı | ${shop.name}`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center bg-ground">
      <div className="mx-auto w-full max-w-2xl px-5 py-20 sm:py-28">
        <p className="text-label uppercase text-gold-soft">404</p>

        <h1 className="mt-4 display-md text-cream-text">
          Bu sayfa artık burada değil
        </h1>

        <div className="mt-6 h-px w-11 bg-gold" />

        <p className="mt-6 leading-relaxed text-cream-text">
          {COPY.notFound.body}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/urunler"
            className="inline-flex min-h-11 items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink-text transition-colors hover:bg-gold-soft"
          >
            Ürünlerimiz
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          {/* Jost — D8 keeps Ibarra ≥32px; the number is 20px. */}
          <a
            href={phoneHref}
            className="inline-flex min-h-11 items-center border border-gold-soft/50 px-6 py-3 text-xl text-gold-soft transition-colors hover:bg-gold/15"
          >
            {phoneDisplay}
          </a>
        </div>

        <div className="mt-12 border-t border-line-dark pt-6">
          <address className="text-sm not-italic leading-relaxed text-muted">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>

          <DirectionsButton variant="quiet" className="mt-4 !px-0" />
        </div>

        <p className="mt-10 text-sm text-muted">
          <Link href="/" className="underline underline-offset-4 hover:text-gold-soft">
            Anasayfaya dön
          </Link>
        </p>
      </div>
    </section>
  );
}
