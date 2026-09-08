import { contactCta } from "@/lib/config";
import { PhoneIcon } from "./icons";

/* §5 — 56px, bottom right, every page, above all content.
 *
 * §7 assumes 80%+ of visits are a phone arriving from Instagram, and requires
 * that the shop is reachable in one tap from anywhere. This is that guarantee.
 *
 * It was `WhatsAppFab` until 2026-09-08 and carried a second appearance: a
 * WhatsApp-green fill with the WhatsApp glyph, waiting on a number that was
 * never confirmed. Nothing rendered it — the pending fallback below is what
 * has always shipped — so removing WhatsApp changed this file's behaviour not
 * at all, only its name and the branch that was never taken.
 */
export function CallFab() {
  const cta = contactCta();

  return (
    <a
      href={cta.href}
      aria-label={cta.label}
      /* Square, not the conventional circle. §3 caps radius at 2px and the rule
       * holds here: recognition comes from the glyph and the gold, not the
       * shape, so there is no reason to break the one visual rule that keeps
       * this site from looking like every other jeweller's template. */
      style={{
        bottom: "calc(1.25rem + env(safe-area-inset-bottom))",
        right: "calc(1.25rem + env(safe-area-inset-right))",
      }}
      /* Panel surface with a gold hairline, not a gold fill — D12 reserves
       * fills for one primary button per section, and a fixed element is in
       * every section at once. */
      className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-md border border-gold bg-panel text-gold-soft shadow-none transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      <PhoneIcon className="h-7 w-7" />
    </a>
  );
}
