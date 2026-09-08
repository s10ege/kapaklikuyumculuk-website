import type { Metadata } from "next";
import Link from "next/link";

import { AppleMapsIcon, GoogleMapsIcon } from "@/components/icons";
import { addressLines, directions, shop } from "@/lib/config";
import { DirectionsForward } from "./DirectionsForward";

/* The analytics hop for the directions button (TECHNICAL.md §9).
 *
 * WHY A PAGE AND NOT A ROUTE HANDLER. A handler returning a 302 is the obvious
 * shape and it is the wrong one here, for two reasons. It would be the only
 * dynamic route in the build — hard rule 9 keeps this site fully static, no ƒ.
 * And it would not do the job it exists for: Vercel Web Analytics counts page
 * views from a script on a rendered page, and a redirect renders nothing, so
 * the beacon this route exists to fire would never fire. A prerendered page
 * that forwards on load is static, and it is a real page view.
 *
 * The cost is one paint before the handoff. The page is written to be readable
 * in that moment and to stand on its own if the forward never happens — with
 * JavaScript off, both links are simply there.
 *
 * noindex: this is machinery, not a page anyone should arrive at from a search
 * result. It is absent from the sitemap for the same reason.
 */

export const metadata: Metadata = {
  title: `Yol tarifi - ${shop.name}`,
  robots: { index: false, follow: false },
};

const APPS = [
  { href: directions.apple, name: "Apple Haritalar", Icon: AppleMapsIcon },
  { href: directions.google, name: "Google Haritalar", Icon: GoogleMapsIcon },
];

export default function DirectionsPage() {
  return (
    <section className="flex flex-1 items-center bg-ground">
      <div className="mx-auto w-full max-w-lg px-5 py-20 sm:py-28">
        <p className="text-label uppercase text-gold-soft">Yol tarifi</p>

        {/* `hyphens-auto` with `break-words` behind it. At 320px — §6.7's
            floor — the padding leaves 280px, and "yönlendiriliyorsunuz" is a
            single 20-character word at 40px, so it cannot fit however the box
            is sized. The document scrolled sideways by 39px, which the
            overflow suite never caught because this route was not in it and
            because a wide *text node* leaves every element's own rect inside
            the viewport. With `lang="tr"` on the document, `hyphens: auto`
            breaks it at a real syllable and prints the hyphen; `break-words`
            is the ugly fallback for engines with no Turkish dictionary.

            Not solved by shortening the sentence: the copy is not what is
            wrong, and long Turkish words are a permanent condition of this
            site rather than an accident of this heading. */}
        <h1 className="mt-4 display-md hyphens-auto break-words text-cream-text">
          Haritaya yönlendiriliyorsunuz
        </h1>

        <div className="mt-6 h-px w-11 bg-gold" />

        <DirectionsForward />

        <address className="mt-6 text-sm not-italic leading-relaxed text-muted">
          {addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>

        {/* The fallback, and the whole page when JavaScript is off. */}
        <ul className="mt-8 border-t border-line-dark">
          {APPS.map(({ href, name, Icon }) => (
            <li key={name} className="border-b border-line-dark">
              <a
                href={href}
                className="flex min-h-14 items-center gap-3 transition-colors hover:text-gold-soft"
              >
                <Icon className="h-5 w-5 flex-none text-gold-soft" />
                {name}
              </a>
            </li>
          ))}
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
