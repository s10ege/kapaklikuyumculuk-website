import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactButton } from "@/components/ContactButton";
import { InstagramIcon, PinIcon } from "@/components/icons";
import {
  address,
  addressLines,
  contact,
  hours,
  instagramUrl,
  mapsEmbedUrl,
  mapsSearchUrl,
  phoneAltDisplay,
  phoneDisplay,
  phoneHref,
  shop,
} from "@/lib/config";
import { pageTitle } from "@/lib/content";

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
 * The map is the keyless `output=embed` form keyed on the address string, not
 * on coordinates: docs grades the coordinates ❌ because sources disagree by
 * ~150 m, and a pin in the wrong place is worse than no pin.
 */

export const metadata: Metadata = {
  title: pageTitle("İletişim"),
  description:
    `${addressLines[0]}, ${addressLines[1]}. Tel: ${phoneDisplay}. ` +
    `${hours.days} ${hours.opens}–${hours.closes}.`,
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumb
        trail={[{ label: "Anasayfa", href: "/" }, { label: "İletişim" }]}
      />

      <section>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:py-16 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-label uppercase text-gold-soft">İletişim</p>
            <h1 className="mt-3 display-md">Bize ulaşın</h1>
            <div className="mt-5 h-px w-11 bg-gold" />

            <p className="mt-6 max-w-md leading-relaxed text-muted">
              Mağazamız {address.landmark.value.toLowerCase()}. Aradığınız
              modeli önden sorabilir, uygun olup olmadığını öğrenip öyle
              gelebilirsiniz.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ContactButton variant="solid" />
              {/* Jost — D8 keeps Bodoni ≥32px; the number is 24px. */}
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
                  <span className="mt-1 block text-sm text-muted">
                    {address.landmark.value}
                  </span>
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
                  <span className="block">{hours.days}</span>
                  <span className="block">
                    {hours.opens} – {hours.closes}
                  </span>
                  <span className="block text-sm text-muted">
                    {hours.closedNote}
                  </span>
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
            <div className="relative aspect-[4/3] w-full border border-line-dark bg-panel lg:aspect-auto lg:flex-1">
              <iframe
                title={`${shop.name} konumu`}
                src={mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />
            </div>

            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 border border-gold-soft/50 px-5 py-3 text-sm text-gold-soft transition-colors hover:bg-gold/15"
            >
              <PinIcon className="h-4 w-4" />
              Yol Tarifi Al
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
