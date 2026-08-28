import { contactCta } from "@/lib/config";
import { PhoneIcon, WhatsAppIcon } from "./icons";

/* §5 — 56px, bottom right, every page, above all content.
 *
 * §7 assumes 80%+ of visits are a phone arriving from Instagram, and requires
 * that phone and WhatsApp are reachable in one tap from anywhere. This is that
 * guarantee. While the WhatsApp number is pending it dials instead, so it is
 * never a dead button.
 */
export function WhatsAppFab() {
  const cta = contactCta();
  const isWhatsApp = cta.channel === "whatsapp";
  const Icon = isWhatsApp ? WhatsAppIcon : PhoneIcon;

  return (
    <a
      href={cta.href}
      {...(isWhatsApp
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      aria-label={cta.label}
      /* Square, not the conventional circle. §3 caps radius at 2px and the rule
       * holds here: recognition comes from the green and the glyph, not the
       * shape, so there is no reason to break the one visual rule that keeps
       * this site from looking like every other jeweller's template. */
      style={{
        bottom: "calc(1.25rem + env(safe-area-inset-bottom))",
        right: "calc(1.25rem + env(safe-area-inset-right))",
      }}
      className={`fixed z-50 flex h-14 w-14 items-center justify-center rounded-md shadow-none transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
        isWhatsApp
          ? "bg-whatsapp text-cream-text"
          : /* Pending state: panel surface with a gold hairline, not a gold
             * fill — D12 reserves fills for one primary button per section,
             * and a fixed element is in every section at once. Flips to the
             * green fill untouched once the number is confirmed. */
            "border border-gold bg-panel text-gold-soft"
      }`}
    >
      <Icon className="h-7 w-7" />
    </a>
  );
}
