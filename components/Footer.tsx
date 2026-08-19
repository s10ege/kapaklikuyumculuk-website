import Link from "next/link";

import {
  address,
  addressLines,
  contact,
  hours,
  instagramUrl,
  mapsSearchUrl,
  phoneDisplay,
  phoneHref,
  shop,
} from "@/lib/config";
import { categoryLinks } from "@/lib/nav";
import { InstagramIcon, PinIcon } from "./icons";

/* §5 — charcoal-deep, four columns, hairline, then copyright and legal entity.
 *
 * Every value here comes from lib/config.ts. This block and the Google Business
 * Profile have to agree character for character (§10), which is only true if
 * there is one place the characters live.
 */

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-label uppercase text-gold-soft">{children}</p>
  );
}

export function Footer() {
  const categories = categoryLinks();

  return (
    <footer className="bg-charcoal-deep text-cream/75">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-cream">{shop.name}</p>
            <div className="mt-4 h-px w-11 bg-gold" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              {shop.founded} yılından beri Kapaklı&apos;da. Altın, pırlanta ve
              özel tasarım takılar; {shop.claim}.
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
                    className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-gold-soft"
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
              <span className="text-cream/50">
                {address.landmark.value}
              </span>
              <a
                href={phoneHref}
                className="inline-flex min-h-11 items-center font-display text-xl text-gold-soft transition-colors hover:text-cream"
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
                  className="inline-flex min-h-11 items-center gap-2 text-sm transition-colors hover:text-gold-soft"
                >
                  <InstagramIcon className="h-4 w-4" />
                  <span>{`@${contact.instagram.value}`}</span>
                </a>
              )}
            </address>
          </div>

          <div>
            <ColumnHeading>Çalışma Saatleri</ColumnHeading>
            <div className="mt-4 flex flex-col gap-1 text-sm">
              <span>{hours.days}</span>
              <span>
                {hours.opens} – {hours.closes}
              </span>
              <span className="text-cream/50">{hours.closedNote}</span>
            </div>
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 border border-gold-soft/40 px-4 text-sm text-gold-soft transition-colors hover:bg-gold/15"
            >
              <PinIcon className="h-4 w-4" />
              Yol Tarifi Al
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          {/* Evaluated once, when the page is prerendered — so the year is the
              year of the last deploy, not of the visit. Correct in practice for
              a site that is redeployed when anything changes. */}
          <p className="text-xs leading-relaxed text-cream/45">
            © {new Date().getFullYear()} {shop.name} · {address.locality} /{" "}
            {address.region}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-cream/30">
            {shop.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
