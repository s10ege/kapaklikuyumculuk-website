import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { categoryLinks, PAGE_LINKS } from "@/lib/nav";

/* Display: Bodoni Moda. Body: Jost.
 *
 * §3 named Cormorant Garamond and Inter. Replaced deliberately: Cormorant with
 * a neutral grotesque is documented as the "safe luxury default" pairing, and
 * it is the exact combination that reads as templated rather than chosen.
 *
 * Bodoni Moda is a true Didone, which is the typographic language luxury
 * jewellery actually speaks — Cartier, Tiffany and Bulgari all sit in Didone or
 * classical-serif territory, and Bodoni is the Italian cut: high thick/thin
 * contrast that reads as cut stone and polished metal rather than as a wedding
 * invitation. Its optical-size axis is the reason it can carry 48px headlines
 * without the hairlines thinning out.
 *
 * Jost is a geometric sans in the Futura line. Futura is the Art Deco
 * geometric, and the shop's mark is a monogram inside a double oval — a Deco
 * medallion. Didone plus geometric sans is how jewellery was actually
 * advertised when that mark's visual language was set.
 *
 * `latin-ext` is mandatory, not optional. Without it the Turkish glyphs
 * ı İ ğ ş ç ö ü fall back to a different font mid-word, which reads as a font
 * choice rather than a bug — the single easiest thing to miss on this site.
 * Both faces were checked against next/font's own metadata before selection;
 * Prata was a strong candidate and was rejected for lacking latin-ext.
 *
 * next/font downloads both at build time and serves them from our own origin,
 * so no request reaches Google from a visitor's browser. That is what §3 asks
 * for; it just gets there without an @fontsource dependency, and adds
 * size-adjusted fallback metrics so swapping in the real face shifts nothing.
 */
const bodoni = Bodoni_Moda({
  variable: "--font-display-face",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-body-face",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trakya Kapaklı Kuyumculuk | 0282 717 21 31 | Kapaklı Kuyumcu",
  description:
    "2000 yılından beri Kapaklı'da. Altın, pırlanta ve özel tasarım takılar. " +
    "Cumhuriyet Mah. Pınar Bulvarı No: 56/A, Kapaklı / Tekirdağ.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${bodoni.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-charcoal-deep"
        >
          İçeriğe geç
        </a>
        <Header categories={categoryLinks()} pages={PAGE_LINKS} />
        {/* The one <main> landmark, defined here so every page has exactly one.
            Pages render fragments; a page supplying its own <main> would nest
            two and leave the skip link pointing at the outer one. */}
        <main id="icerik" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
