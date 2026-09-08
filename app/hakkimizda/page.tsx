import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactBand } from "@/components/ContactBand";
import { ArrowRightIcon } from "@/components/icons";
import { address, people, shop } from "@/lib/config";
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
 *
 * Photographs (2026-09-07): the shopfront leads the cream band, and the
 * founder and the owner who runs the shop today sit side by side under the
 * prose — the two faces are the proof behind "aynı ailenin elinde". Masters
 * come from scripts/hakkimizda-photos.mjs; the originals never enter the
 * repo. Names and roles are config, not literals (hard rule 1).
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

/* Alt text describes the picture; the figcaption already carries the name,
 * so repeating it would read the name twice to a screen reader. */
const PORTRAITS = [
  {
    ...people.founder,
    src: "/hakkimizda/nuri-eroglu.webp",
    alt: "Koyu takım elbise ve çizgili kravatla stüdyo portresi.",
  },
  {
    ...people.owner,
    src: "/hakkimizda/filiz-eroglu.webp",
    alt: "Lacivert ceketle, eli çenesinde, gülümseyen portre.",
  },
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
          {/* THE ALIGNMENT RULE (2026-09-08).
              The shop photograph and the prose column used to end at
              different heights — the photo was taller, so the band finished on
              a ragged edge that no amount of padding fixes, because padding
              can only be right at one viewport width.

              So it is structural instead: `items-stretch` (the grid default,
              named here because it is load-bearing) makes both columns the
              height of the taller one, and the figure drops its aspect ratio
              at lg in favour of `h-full`. `next/image fill` + `object-cover`
              then makes the photograph exactly that height, whatever the prose
              beside it turns out to be. The two bottom edges line up by
              construction and stay lined up when the copy changes.

              min-h is a floor, not a target: it stops the photo collapsing to
              a letterbox if the prose is ever cut right down. Below lg the
              columns stack and the photo takes a fixed 4:5, which is close to
              the master's own 3:4 so the crop is slight. */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-14">
            <figure className="relative aspect-[4/5] overflow-hidden border border-line-light lg:aspect-auto lg:h-full lg:min-h-[30rem]">
              <Image
                src="/hakkimizda/magaza.webp"
                alt={`${shop.name} mağazasının cephesi: tabela, tente ve vitrin.`}
                fill
                priority
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="object-cover"
              />
            </figure>

            {/* Capped deliberately: three paragraphs, the fact grid, the links.
                Everything that used to sit here and does not any more is below
                the grid, where it cannot push this column past the photograph
                it is supposed to line up with. */}
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

          {/* The founder and the owner who runs the shop today — the two faces
              behind "aynı ailenin elinde", with their names under them.

              Below the two-column grid rather than inside the right one. In
              the column they were the tallest thing on the page and forced the
              shop photograph to stretch to roughly half its width, which
              cropped the shopfront to a sliver. Down here they get room, the
              columns above line up, and the names sit directly under the faces
              where a reader looks for them.

              Capped at max-w-lg: at full width two portraits would be nearly
              700px tall each, which is a different page. Names and roles come
              from lib/config.ts (hard rule 1), never typed here. */}
          <ul className="mt-12 grid max-w-lg grid-cols-2 border-l border-t border-line-light">
            {PORTRAITS.map((person) => (
              <li
                key={person.name}
                className="border-b border-r border-line-light"
              >
                <figure>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={person.src}
                      alt={person.alt}
                      fill
                      sizes="(min-width: 640px) 16rem, 50vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <figcaption className="px-4 py-4 sm:px-5">
                    <p>{person.name}</p>
                    <p className="mt-1 text-label uppercase text-ink-muted">
                      {person.role}
                    </p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactBand
        heading="Uğrayın, tanışalım"
        body="Bir şey almak zorunda değilsiniz. Bakmak, sormak, tartıya baktırmak serbest."
      />
    </>
  );
}
