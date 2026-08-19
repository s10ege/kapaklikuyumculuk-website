/* Placeholder artwork paths.
 *
 * §12: these are line-art motifs rather than grey boxes or stock photography,
 * so an unreplaced image reads as deliberate on the page and is still obvious
 * to us as outstanding work.
 *
 * Every one of these is a plain path string, and every consumer takes it as a
 * prop. Replacing a placeholder with a real photograph means editing the string
 * in lib/content.ts — no component changes anywhere.
 */

export const PLACEHOLDER = {
  /* Charcoal ground, for category tiles sitting in a cream section. */
  kategori: {
    pirlanta: "/placeholder/kategori-pirlanta.svg",
    "altin-seti": "/placeholder/kategori-altin-seti.svg",
    "kupe-modelleri": "/placeholder/kategori-kupe-modelleri.svg",
    "tek-tas-modelleri": "/placeholder/kategori-tek-tas-modelleri.svg",
    "ozel-tasarim-takilar": "/placeholder/kategori-ozel-tasarim-takilar.svg",
  },

  /* Cream ground, for product cards on a cream page — an emerald cut, so a
   * product tile is never mistaken for a category tile at a glance. */
  urun: "/placeholder/urun.svg",

  /* 16:9. §6.1 lays a charcoal gradient over this from the left, so the motif
   * sits right of centre and stays clear of the headline. */
  hero: "/placeholder/hero.svg",
} as const;

export type CategorySlug = keyof typeof PLACEHOLDER.kategori;
