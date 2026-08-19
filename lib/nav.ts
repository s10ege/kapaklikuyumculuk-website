import { getCategories } from "./content.ts";

/* Site structure, in the order it is shown.
 *
 * §5: the mobile panel lists the five categories BEFORE the page links.
 * Most traffic is a phone arriving from Instagram (§7), and that visitor wants
 * to see pieces — not an About page. Desktop shows the page links only, since
 * the categories are one click away under Ürünlerimiz.
 */

export type NavLink = { href: string; label: string };

export const PAGE_LINKS: NavLink[] = [
  { href: "/urunler", label: "Ürünlerimiz" },
  { href: "/galeri", label: "Galeri" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function categoryLinks(): NavLink[] {
  return getCategories().map((c) => ({
    href: `/urunler/${c.slug}`,
    label: c.name,
  }));
}
