import Link from "next/link";

import {
  address,
  addressLines,
  contact,
  instagramUrl,
  phoneDisplay,
  phoneHref,
  shop,
} from "@/lib/config";
import { categoryLinks } from "@/lib/nav";
import { DirectionsButton } from "./DirectionsButton";
import { InstagramIcon } from "./icons";
import { Lockup } from "./Lockup";
import { OpeningHours } from "./OpeningHours";

/* §5 — cream (D6), four columns, hairline, then copyright and legal entity.
 *
 * Every value here comes from lib/config.ts. This block and the Google Business
 * Profile have to agree character for character (§10), which is only true if
 * there is one place the characters live.
 */

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-label uppercase text-gold-deep">{children}</p>
  );
}

export function Footer() {
  const categories = categoryLinks();

  return (
    <footer className="bg-frame text-ink-text/80">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {/* The gold-deep KK oval appears on cream in the footer as well
                as the header (design.md, palette section) — Lockup already
                carries the on-cream colours. */}
            <Lockup />
            {/* gold-deep — the on-cream gold; plain gold measures 2.46:1 here. */}
            <div className="mt-4 h-px w-11 bg-gold-deep" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              {shop.founded} yılından beri Kapaklı&apos;da. Altın set, bilezik,
              küpe, yüzük ve özel tasarım takılar; {shop.claim}.
            </p>
          </div>

          <nav aria-label="Kategoriler">
            <ColumnHeading>Kategoriler</ColumnHeading>
            {/* min-h-11 per link, not tighter rows with a gap: §7 sets a 44px
                tap target and most visits are a thumb on a phone. */}
            <ul className="mt-2 flex flex-col">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-gold-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColumnHeading>İletişim</ColumnHeading>
            <address className="mt-4 flex flex-col gap-2.5 text-sm not-italic">
              {addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <a
                href={phoneHref}
                className="inline-flex min-h-11 items-center text-xl text-gold-deep transition-colors hover:text-ink-text"
              >
                {phoneDisplay}
              </a>
              {/* The Instagram row hides itself entirely while the handle is
                  pending (§8) rather than rendering a dead icon. */}
              {!contact.instagram.pending && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm transition-colors hover:text-gold-deep"
                >
                  <InstagramIcon className="h-4 w-4" />
                  <span>{`@${contact.instagram.value}`}</span>
                </a>
              )}
            </address>
          </div>

          <div>
            <ColumnHeading>Çalışma Saatleri</ColumnHeading>
            <OpeningHours tone="cream" className="mt-4 text-sm" />
            <DirectionsButton variant="onCream" className="mt-5" />
          </div>
        </div>

        <div className="mt-12 border-t border-line-light pt-6">
          {/* Evaluated once, when the page is prerendered — so the year is the
              year of the last deploy, not of the visit. Correct in practice for
              a site that is redeployed when anything changes. */}
          {/* Solid ink-muted, not ink-text alpha — the alpha versions measured
              4.4:1 and 2.9:1 on cream, and the legal name is documentary
              evidence for the Google ownership claim. It should be readable. */}
          <p className="text-xs leading-relaxed text-ink-muted">
            © {new Date().getFullYear()} {shop.name} · {address.locality} /{" "}
            {address.region}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            {shop.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
