import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactBand } from "@/components/ContactBand";
import { ArrowRightIcon } from "@/components/icons";
import { address, shop } from "@/lib/config";
import { pageTitle } from "@/lib/content";
import { FILLER } from "@/lib/filler";

/* §6.6 — Hakkımızda.
 *
 * §4: `/hakkimizda` was indexed in the site's first generation and is being
 * reclaimed rather than redirected.
 *
 * The argument the page has to make: a jeweller sells things that come back —
 * for resizing, for repair, to be handed on. That is why the shop behaves the
 * way it does, and it is a more honest case than any claim about quality.
 *
 * The founding copy is recovered from the old site's Kurumsal page
 * (docs/old-site-map.md) and is verifiable. Its "iki şube ile" line is
 * deliberately NOT revived: the partnership ended and there is one shop now.
 * Nothing about the former partner belongs on a customer-facing page.
 */

export const metadata: Metadata = {
  title: pageTitle("Hakkımızda"),
  description:
    "2000 yılında kurulan Kapaklı'nın ilk kuyumcusu. Aynı adreste, aynı " +
    "ailenin elinde. Kapaklı / Tekirdağ.",
  alternates: { canonical: "/hakkimizda" },
};

const FACTS = [
  { label: "Kuruluş", value: "2000" },
  { label: "Konum", value: `${address.locality} / ${address.region}` },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumb
        trail={[{ label: "Anasayfa", href: "/" }, { label: "Hakkımızda" }]}
      />

      <section>
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-soft">Hakkımızda</p>
          <h1 className="mt-3 display-md">{shop.claim}</h1>
          <div className="mt-5 h-px w-11 bg-gold" />
        </div>
      </section>

      {/* D10 — the cream reading band. Long-form prose is measurably harder
          to read on dark, and this page is where trust is decided; the body
          moves onto the frame colour, ink on cream, line-light hairlines.
          The first two lines are the load-bearing claims (founding + the
          returns argument) and stay real; the rest is filler until 3.2. */}
      <section className="bg-frame text-ink-text">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-14">
            {/* Portrait slot, per §6.6 — a shop photograph reads as proof in
                a way a product shot does not. Until stage 2 shoots it, this
                is an honest placeholder in the band's own idiom rather than
                the retired diamond motif, which opened the band as a huge
                dark block at 768/390 (1.5 review). Height-capped so the
                band still leads with prose on phones. */}
            <div className="flex max-h-56 items-center justify-center border border-line-light lg:aspect-[3/4] lg:max-h-none">
              <p className="p-6 text-center text-label uppercase text-ink-muted">
                Mağaza fotoğrafı hazırlanıyor
              </p>
            </div>

            <div>
              <div className="flex flex-col gap-5 leading-relaxed">
                <p>
                  Kapaklı Kuyumculuk {shop.founded} yılında, Kapaklı ilçesinin
                  merkezinde kuruldu ve ilçenin ilk kuyumcusu oldu. O günden bu
                  yana aynı adreste, aynı ailenin elinde.
                </p>
                <p className="text-ink-muted">
                  Bir kuyumcunun sattığı şeyler geri gelir. {FILLER.aboutBody[0]}
                </p>
                <p className="text-ink-muted">{FILLER.aboutBody[1]}</p>
              </div>

              {/* Two-cell fact grid (§6.6). Two, because two verified facts
                  are worth more than six padded ones. */}
              <dl className="mt-10 grid border-l border-t border-line-light sm:grid-cols-2">
                {FACTS.map((fact) => (
                  <div
                    key={fact.label}
                    className="border-b border-r border-line-light px-5 py-6"
                  >
                    <dt className="text-label uppercase text-ink-muted">
                      {fact.label}
                    </dt>
                    {/* Jost — D8 keeps Ibarra ≥32px; the value is 24px. */}
                    <dd className="mt-2 text-2xl">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-wrap gap-3">
                {/* Outline, not the gold fill: the ContactBand below carries
                    this page's one fill, and the phone is the site's job
                    (1.5 review, C6 — reversible if Soner prefers the fill). */}
                <Link
                  href="/urunler"
                  className="inline-flex min-h-11 items-center gap-2 border border-gold-deep px-5 py-3 text-sm text-gold-deep transition-colors hover:bg-gold/15"
                >
                  Ürünlerimiz
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/hizmetler"
                  className="inline-flex min-h-11 items-center border border-gold-deep px-5 py-3 text-sm text-gold-deep transition-colors hover:bg-gold/15"
                >
                  Hizmetlerimiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The landmark composes from config (hard rule 1), not a literal. */}
      <ContactBand
        heading="Uğrayın, tanışalım"
        body={`${address.landmark.value}ndayız. Bir şey almak zorunda değilsiniz; bakmak da serbest.`}
      />
    </>
  );
}
