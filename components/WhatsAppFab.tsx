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
      className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-md text-white shadow-none transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
        isWhatsApp ? "bg-whatsapp" : "bg-gold-deep"
      }`}
    >
      <Icon className="h-7 w-7" />
    </a>
  );
}
