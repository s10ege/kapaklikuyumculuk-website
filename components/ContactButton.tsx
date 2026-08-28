import { contactCta } from "@/lib/config";
import { PhoneIcon, WhatsAppIcon } from "./icons";

/* The one call-to-action on the site (§9).
 *
 * Nothing else renders a wa.me or tel: link directly. Everything routes through
 * contactCta(), so while contact.whatsapp.pending is true every button on every
 * page falls back to the phone with the label "Bizi Arayın" — and when the
 * family confirms the number, all of them switch at once.
 *
 * `productName` is what makes the mechanic work: the shop opens a message that
 * already names the piece, and the customer types nothing.
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
  productName,
  variant = "solid",
  className = "",
}: {
  productName?: string;
  variant?: Variant;
  className?: string;
}) {
  const cta = contactCta(productName);
  const Icon = cta.channel === "whatsapp" ? WhatsAppIcon : PhoneIcon;

  return (
    <a
      href={cta.href}
      /* A tel: link stays in the app; wa.me opens WhatsApp, so it gets a new
       * tab and the usual rel guard. */
      {...(cta.channel === "whatsapp"
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`inline-flex min-h-[2.75rem] items-center justify-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${VARIANTS[variant]} ${className}`}
    >
      <Icon className="h-4 w-4 flex-none" />
      {cta.label}
    </a>
  );
}
