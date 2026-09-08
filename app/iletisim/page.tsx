import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactButton } from "@/components/ContactButton";
import { DirectionsButton } from "@/components/DirectionsButton";
import { OpeningHours } from "@/components/OpeningHours";
import { InstagramIcon } from "@/components/icons";
import {
  addressLines,
  contact,
  hours,
  instagramUrl,
  mapsEmbedUrl,
  phoneAltDisplay,
  phoneDisplay,
  phoneHref,
  shop,
} from "@/lib/config";
import { pageTitle } from "@/lib/content";
import { COPY } from "@/lib/copy";
import { openGraph } from "@/lib/metadata";

/* §6.7 — İletişim.
 *
 * §4: `/iletisim` was indexed in the site's first generation and is reclaimed
 * rather than redirected.
 *
 * There is NO contact form and NO mailto anywhere on this page. The domain has
 * no MX records (docs/business-facts.md, verified by DNS lookup), so there is
 * no address to send to — a form here would silently drop every message a
 * customer sent.
 *
 * The map is the keyless `output=embed` form, keyed on the shop's own
 * coordinates. This comment said the opposite until 2026-09-08 — keyed on the
 * address string because the coordinates were graded ❌ and sources disagreed
 * by ~150 m. They came from the shop's own Maps listing on 2026-09-08 and
 * `mapsEmbedUrl` has been coordinate-keyed since; only the comment lagged.
 */

export const metadata: Metadata = {
  title: pageTitle("İletişim"),
  description:
    `${addressLines[0]}, ${addressLines[1]}. Tel: ${phoneDisplay}. ` +
    `Yaz ${hours.summer.open}–${hours.summer.close}, ` +
    `kış ${hours.winter.open}–${hours.winter.close}; ${hours.closed.toLocaleLowerCase("tr")}.`,
  alternates: { canonical: "/iletisim" },
  openGraph: openGraph("/iletisim"),
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumb
        trail={[
          { label: "Anasayfa", href: "/" },
          { label: "İletişim", href: "/iletisim" },
        ]}
      />

      <section>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:py-16 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-label uppercase text-gold-soft">İletişim</p>
            <h1 className="mt-3 display-md">Bize ulaşın</h1>
            <div className="mt-5 h-px w-11 bg-gold" />

            {/* The street belongs to lib/config.ts and to the grid below —
                naming it here too would be a second copy of the one string
                this project exists to keep single (tests/source-invariants). */}
            <p className="mt-6 max-w-md leading-relaxed text-muted">
              {COPY.iletisim.lede}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ContactButton variant="solid" />
              {/* Jost — D8 keeps Ibarra ≥32px; the number is 24px. */}
              <a
                href={phoneHref}
                className="inline-flex min-h-11 items-center px-4 text-2xl text-gold-soft transition-colors hover:text-cream-text"
              >
                {phoneDisplay}
              </a>
            </div>

            <dl className="mt-10 border-t border-line-dark">
              <div className="flex flex-col gap-1 border-b border-line-dark py-5 sm:flex-row sm:gap-6">
                <dt className="text-label uppercase text-muted sm:w-28 sm:flex-none">
                  Adres
                </dt>
                <dd>
                  <address className="not-italic">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>

              <div className="flex flex-col gap-1 border-b border-line-dark py-5 sm:flex-row sm:gap-6">
                <dt className="text-label uppercase text-muted sm:w-28 sm:flex-none">
                  Telefon
                </dt>
                <dd className="flex flex-col">
                  <a
                    href={phoneHref}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-gold-soft"
                  >
                    {phoneDisplay}
                  </a>
                  <span className="text-sm text-muted">
                    {phoneAltDisplay}
                  </span>
                </dd>
              </div>

              <div className="flex flex-col gap-1 border-b border-line-dark py-5 sm:flex-row sm:gap-6">
                <dt className="text-label uppercase text-muted sm:w-28 sm:flex-none">
                  Saatler
                </dt>
                <dd>
                  <OpeningHours />
                </dd>
              </div>

              {/* Hides itself entirely while the handle is pending (§8). */}
              {!contact.instagram.pending && (
                <div className="flex flex-col gap-1 border-b border-line-dark py-5 sm:flex-row sm:gap-6">
                  <dt className="text-label uppercase text-muted sm:w-28 sm:flex-none">
                    Instagram
                  </dt>
                  <dd>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-gold-soft"
                    >
                      <InstagramIcon className="h-4 w-4" />
                      {`@${contact.instagram.value}`}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex flex-col">
            {/* Hairline border, no radius (D-rules). The embed is the
                coordinate-pin form — the address-keyed one it replaced drew a
                route from "Kapaklı" to the shop, which answers a question
                nobody on this page asked. */}
            <div className="relative aspect-[4/3] w-full border border-line-dark bg-panel lg:aspect-auto lg:flex-1">
              <iframe
                title={`${shop.name} konumu`}
                src={mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />
            </div>

            <DirectionsButton className="mt-4 w-full" />
          </div>
        </div>
      </section>
    </>
  );
}
