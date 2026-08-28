import { ContactButton } from "./ContactButton";

/* §6.2 — "Never a blank grid."
 *
 * This is the launch state of all five category pages and the gallery, which
 * makes it the single most-seen screen on the site. It is written as an
 * invitation to act rather than an apology: it says what is happening, and
 * gives the visitor something to do about it right now.
 *
 * The CTA prefills the category name, so a message arrives already saying what
 * the customer was looking at (§9).
 */
export function EmptyState({
  subject,
  headline,
  className = "",
}: {
  /** What the visitor came looking for — a category name, or "Galeri". */
  subject: string;
  /** Overrides the templated headline where the template reads wrong —
   *  "Galerimiz vitrinimizde" was nonsense (1.5 review, V2). */
  headline?: string;
  className?: string;
}) {
  return (
    <div
      className={`border border-line-dark bg-panel px-6 py-14 text-center sm:py-20 ${className}`}
    >
      <p className="text-label uppercase text-gold-soft">Yakında</p>

      {/* Jost — D8 keeps Bodoni ≥32px and this line tops out at 30px. */}
      <p className="mx-auto mt-4 max-w-md text-2xl leading-snug sm:text-3xl">
        {headline ?? `${subject} vitrinimizde — fotoğraflarını hazırlıyoruz.`}
      </p>

      {/* No "vitrinde olmayan modelleri de..." here: the ContactBand a scroll
          below says exactly that as its headline (1.5 review, C2). */}
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
        Aradığınız modeli bize yazın ya da telefonla sorun; elimizdekileri
        sizin için çıkaralım.
      </p>

      {/* onDark, not solid: the ContactBand a few hundred pixels below this
          panel carries the page's gold fill, and two identical gold
          "Bizi Arayın" fills in one scroll read as templated (1.4 review). */}
      <ContactButton
        productName={subject}
        variant="onDark"
        className="mt-7"
      />
    </div>
  );
}
