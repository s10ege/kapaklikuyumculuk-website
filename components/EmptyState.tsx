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
  className = "",
}: {
  /** What the visitor came looking for — a category name, or "Galeri". */
  subject: string;
  className?: string;
}) {
  return (
    <div
      className={`border border-line bg-surface px-6 py-14 text-center sm:py-20 ${className}`}
    >
      <p className="text-label uppercase text-gold-deep">Yakında</p>

      <p className="mx-auto mt-4 max-w-md font-display text-2xl leading-snug sm:text-3xl">
        {subject} vitrinimizde — fotoğraflarını hazırlıyoruz.
      </p>

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
        Aradığınız modeli bize yazın ya da telefonla sorun; elimizdekileri
        sizin için çıkaralım. Vitrinde olmayan modelleri de tedarik
        edebiliyoruz.
      </p>

      <ContactButton
        productName={subject}
        variant="solid"
        className="mt-7"
      />
    </div>
  );
}
