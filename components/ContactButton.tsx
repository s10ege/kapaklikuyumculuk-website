import { contactCta } from "@/lib/config";
import { PhoneIcon } from "./icons";

/* The one call-to-action on the site (§9).
 *
 * Nothing else renders a tel: link directly — everything routes through
 * contactCta(), which is the single place that decides what the CTA does.
 *
 * It took a `productName` until 2026-09-08, to pre-fill a WhatsApp message with
 * the piece the customer was looking at. WhatsApp is gone and a tel: link
 * cannot carry a message, so the prop went with it rather than staying on as
 * something four callers pass and nothing reads.
 */

type Variant = "solid" | "outline" | "onDark";

const VARIANTS: Record<Variant, string> = {
  /* Gold is an accent, not a fill (D12) — but a primary CTA is exactly the
   * small area where a solid gold block is the point rather than a mistake. */
  solid: "bg-gold text-ink-text hover:bg-gold-soft",
  /* For the cream reading bands (D10) — gold-deep is the legible gold there. */
  outline: "border border-gold-deep text-gold-deep hover:bg-gold/15",
  onDark: "border border-gold-soft/50 text-gold-soft hover:bg-gold/15",
};

export function ContactButton({
  variant = "solid",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const cta = contactCta();

  return (
    /* No target/rel: a tel: link hands off to the dialer and stays in the app,
     * so opening a tab for it would leave an empty one behind. */
    <a
      href={cta.href}
      className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${VARIANTS[variant]} ${className}`}
    >
      <PhoneIcon className="h-4 w-4 flex-none" />
      {cta.label}
    </a>
  );
}
