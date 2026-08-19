import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactBand } from "@/components/ContactBand";
import { ArrowRightIcon } from "@/components/icons";
import { address, shop } from "@/lib/config";
import { pageTitle } from "@/lib/content";
import { PLACEHOLDER } from "@/lib/placeholders";

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

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-label uppercase text-gold-deep">Hakkımızda</p>
          <h1 className="mt-3 display-md">{shop.claim}</h1>
          <div className="mt-5 h-px w-11 bg-gold" />

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-14">
            {/* Portrait, per §6.6 — a shop photograph reads as proof in a way
                a product shot does not. */}
            <div className="relative aspect-[3/4] overflow-hidden border border-line">
              <Image
                src={PLACEHOLDER.hero}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex flex-col gap-5 leading-relaxed">
                <p>
                  Kapaklı Kuyumculuk {shop.founded} yılında, Kapaklı ilçesinin
                  merkezinde kuruldu ve ilçenin ilk kuyumcusu oldu. O günden bu
                  yana aynı adreste, aynı ailenin elinde.
                </p>
                <p className="text-ink-muted">
                  Bir kuyumcunun sattığı şeyler geri gelir. Yüzük küçük gelir,
                  zincir kopar, bir bilezik yıllar sonra toruna devredilir. Bu
                  yüzden bir takıyı satarken de, yıllar sonra tamire
                  geldiğinde de aynı şekilde davranmak zorundasınız. Aynı
                  ilçede, aynı insanlara iş yapmanın kuralı bu.
                </p>
                <p className="text-ink-muted">
                  Vitrinimizde altın, pırlanta ve seçkin saat markaları var.
                  Bunun yanında altın alım–satımı ve sipariş üzerine üretim
                  yapıyoruz. Aradığınız model vitrinde yoksa sorun — tedarik
                  edebildiklerimiz vitrindekilerden çok daha geniş.
                </p>
              </div>

              {/* Two-cell fact grid (§6.6). Two, because two verified facts
                  are worth more than six padded ones. */}
              <dl className="mt-10 grid border-l border-t border-line sm:grid-cols-2">
                {FACTS.map((fact) => (
                  <div
                    key={fact.label}
                    className="border-b border-r border-line bg-surface px-5 py-6"
                  >
                    <dt className="text-label uppercase text-ink-muted">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 font-display text-2xl">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/urunler"
                  className="inline-flex min-h-11 items-center gap-2 bg-gold px-5 py-3 text-sm font-medium text-charcoal-deep transition-colors hover:bg-gold-soft"
                >
                  Ürünlerimiz
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/hizmetler"
                  className="inline-flex min-h-11 items-center border border-gold-deep px-5 py-3 text-sm text-gold-deep transition-colors hover:bg-gold-pale"
                >
                  Hizmetlerimiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactBand
        heading="Uğrayın, tanışalım"
        body="Ziraat Bankası karşısındayız. Bir şey almak zorunda değilsiniz; bakmak da serbest."
      />
    </>
  );
}
