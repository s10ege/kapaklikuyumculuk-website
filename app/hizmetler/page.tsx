import type { Metadata } from "next";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactBand } from "@/components/ContactBand";
import { pageTitle } from "@/lib/content";
import { FILLER } from "@/lib/filler";

/* §6.5 — Hizmetler.
 *
 * Two long-form panels on the D10 cream reading band. The two load-bearing
 * trust lines — the weighing promise and the no-surprise-deduction promise —
 * stay REAL through the filler stage (they are asserted by e2e and preserved
 * in docs/original-copy.md); the surrounding prose is FILLER until 3.2.
 */

export const metadata: Metadata = {
  title: pageTitle("Hizmetlerimiz"),
  description:
    "Altın alım–satımı ve sipariş üzerine üretim. Tartım tezgâh üstünde, " +
    "düşülecek pay işlem öncesinde açıklanır. Kapaklı / Tekirdağ.",
  alternates: { canonical: "/hizmetler" },
};

type Service = {
  slug: string;
  name: string;
  lede: string;
  body: string;
  points: readonly string[];
};

/* The two REAL lines that survive the filler stage (hard rule via kk-brand:
 * the weighing promise is one of the two load-bearing claims on the site). */
const WEIGHING_PROMISE =
  "Getirdiğiniz altın tezgâhın üstünde, sizin gözünüzün önünde tartılır.";
const REAL_POINTS = {
  weighing: "Tartım tezgâhın üstünde, sizin gözünüzün önünde yapılır.",
  deduction:
    "Düşülecek pay varsa işlemden önce söylenir — sonradan sürpriz olmaz.",
};

const SERVICES: Service[] = [
  {
    slug: "altin-alim-satim",
    name: "Altın Alım–Satım",
    lede: FILLER.services["altin-alim-satim"].lede,
    body: `${WEIGHING_PROMISE} ${FILLER.services["altin-alim-satim"].body}`,
    points: [
      REAL_POINTS.weighing,
      FILLER.services["altin-alim-satim"].points[0],
      REAL_POINTS.deduction,
      FILLER.services["altin-alim-satim"].points[1],
    ],
  },
  {
    slug: "siparis-uzerine-uretim",
    name: "Sipariş Üzerine Üretim",
    lede: FILLER.services["siparis-uzerine-uretim"].lede,
    body: FILLER.services["siparis-uzerine-uretim"].body,
    points: FILLER.services["siparis-uzerine-uretim"].points,
  },
];

export default function ServicesPage() {
  return (
    <>
      <Breadcrumb
        trail={[{ label: "Anasayfa", href: "/" }, { label: "Hizmetler" }]}
      />

      <section>
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-soft">Hizmetler</p>
          <h1 className="mt-3 display-md">Ne yapıyoruz</h1>
          <div className="mt-5 h-px w-11 bg-gold" />
          <p className="mt-6 max-w-2xl leading-relaxed text-muted">
            Vitrin dışında iki iş yapıyoruz, ve ikisi de güvene dayanıyor.
            Nasıl çalıştığımızı baştan yazdık ki mağazaya gelmeden ne
            olacağını bilin.
          </p>
        </div>
      </section>

      {/* D10 — the cream reading band. This page is the other place trust is
          decided; the two services' long-form prose moves onto the frame
          colour, ink on cream, line-light hairlines. */}
      <section className="bg-frame text-ink-text">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <div className="flex flex-col gap-12">
            {SERVICES.map((service) => (
              <article
                key={service.slug}
                id={service.slug}
                className="border-t border-line-light pt-10 first:border-t-0 first:pt-0"
              >
                <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
                  <div>
                    <h2 className="display-sm">{service.name}</h2>
                    <div className="mt-5 h-px w-11 bg-gold-deep" />
                    {/* Jost — D8 keeps Bodoni ≥32px; the lede is 20px. */}
                    <p className="mt-5 text-xl leading-snug text-gold-deep">
                      {service.lede}
                    </p>
                  </div>

                  <div>
                    <p className="leading-relaxed text-ink-muted">
                      {service.body}
                    </p>

                    <ul className="mt-8 border-t border-line-light">
                      {service.points.map((point) => (
                        <li
                          key={point}
                          className="border-b border-line-light py-4 text-sm leading-relaxed"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactBand
        heading="Önce bir sorun, sonra karar verin"
        body="Kur, gramaj ya da süre — aklınıza takılanı telefonla da sorabilirsiniz. Bağlayıcı bir şey değil."
      />
    </>
  );
}
