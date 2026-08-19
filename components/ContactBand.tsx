import { ContactButton } from "./ContactButton";
import { phoneDisplay, phoneHref } from "@/lib/config";

/* The charcoal CTA band (§6.2, §6.5, §6.1).
 *
 * "Vitrinde olmayan modelleri de bulabiliriz" is the argument the shop actually
 * makes in person: a small jeweller's real inventory is larger than its window,
 * and saying so is what turns a browsing visitor into a message.
 *
 * Part of the band rhythm — charcoal here, cream above and below.
 */
export function ContactBand({
  heading = "Vitrinde olmayan modelleri de bulabiliriz",
  body = "Aradığınız modeli tarif edin ya da bir fotoğraf gönderin; tedarik edebiliyorsak size dönelim.",
  productName,
}: {
  heading?: string;
  body?: string;
  productName?: string;
}) {
  return (
    <section className="bg-charcoal">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl leading-snug text-cream sm:text-3xl">
            {heading}
          </h2>
          <div className="mt-4 h-px w-11 bg-gold" />
          <p className="mt-4 text-sm leading-relaxed text-cream/70">{body}</p>
        </div>

        <div className="flex flex-none flex-wrap items-center gap-3">
          <ContactButton productName={productName} variant="solid" />
          <a
            href={phoneHref}
            className="inline-flex min-h-11 items-center px-4 font-display text-xl text-gold-soft transition-colors hover:text-cream"
          >
            {phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
