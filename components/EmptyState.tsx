import { ContactButton } from "./ContactButton";
import { COPY } from "@/lib/copy";

/* §6.2 — "Never a blank grid."
 *
 * Written as an invitation to act rather than an apology: it says what is
 * happening, and gives the visitor something to do about it right now.
 *
 * This was the launch state of every category page and the gallery, and the
 * single most-seen screen on the site. All four categories have photographs
 * now, so it is only reachable from /dev/grid — and from any category added
 * before it is shot, which is the state it exists for.
 *
 * `subject` names the headline. It also used to prefill the CTA's WhatsApp
 * message, so a message arrived already saying what the customer was looking
 * at; that went with WhatsApp on 2026-09-08.
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
      <p className="text-label uppercase text-gold-soft">
        {COPY.emptyState.eyebrow}
      </p>

      {/* Jost — D8 keeps Ibarra ≥32px and this line tops out at 30px. */}
      <p className="mx-auto mt-4 max-w-md text-2xl leading-snug sm:text-3xl">
        {headline ?? COPY.emptyState.headline(subject)}
      </p>

      {/* No "vitrinde olmayan modelleri de..." here: the ContactBand a scroll
          below says exactly that as its headline (1.5 review, C2). */}
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
        {COPY.emptyState.body}
      </p>

      {/* onDark, not solid: the ContactBand a few hundred pixels below this
          panel carries the page's gold fill, and two identical gold
          "Bizi Arayın" fills in one scroll read as templated (1.4 review). */}
      <ContactButton variant="onDark" className="mt-7" />
    </div>
  );
}
