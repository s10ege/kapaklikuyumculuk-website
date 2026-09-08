import type { Metadata, Viewport } from "next";
import { Ibarra_Real_Nova, Jost } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { JsonLd } from "@/components/JsonLd";
import { categoryLinks, PAGE_LINKS } from "@/lib/nav";
import { addressOneLine, phoneDisplay, shop } from "@/lib/config";
import { jewelryStoreSchema } from "@/lib/schema";

/* Display: Ibarra Real Nova. Body: Jost.
 *
 * §3 named Cormorant Garamond and Inter. Replaced deliberately: Cormorant with
 * a neutral grotesque is documented as the "safe luxury default" pairing, and
 * it is the exact combination that reads as templated rather than chosen.
 *
 * Ibarra Real Nova is Soner's pick at the 1.6 review, at the end of a real
 * selection: Bodoni Moda fell first — its Didone hairlines read as lost on
 * the espresso ground at 400 and at 600, so the thick/thin contrast was the
 * problem, not the weight — then Marcellus in situ, then live in-site trials
 * against EB Garamond and Cormorant Garamond, both judged too ornate. Ibarra
 * revives the face cut for the Spanish royal press: a formal, dignified
 * transitional serif whose moderate stroke contrast and large x-height hold
 * on dark at weight 500 without reading bold.
 *
 * Jost is a geometric sans in the Futura line. Futura is the Art Deco
 * geometric, and the shop's mark is a monogram inside a double oval — a Deco
 * medallion.
 *
 * `latin-ext` is mandatory, not optional. Without it the Turkish glyphs
 * ı İ ğ ş ç ö ü fall back to a different font mid-word, which reads as a font
 * choice rather than a bug — the single easiest thing to miss on this site.
 * Both faces were checked against next/font's own metadata before selection;
 * Prata and Vidaloka were strong candidates rejected for lacking latin-ext.
 *
 * next/font downloads both at build time and serves them from our own origin,
 * so no request reaches Google from a visitor's browser. That is what §3 asks
 * for; it just gets there without an @fontsource dependency, and adds
 * size-adjusted fallback metrics so swapping in the real face shifts nothing.
 */
const ibarra = Ibarra_Real_Nova({
  variable: "--font-display-face",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-body-face",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  /* Required for the per-page `alternates.canonical: "/urunler"` values to
     resolve to absolute URLs. Without it Next emits relative canonicals, which
     Google largely ignores. */
  metadataBase: new URL(shop.url),
  /* Built from lib/config.ts, not typed out. The hand-written version of this
     description drifted to "Cumhuriyet Mah. Pınar Bulvarı" — no comma — while
     the footer and the JSON-LD said "Cumhuriyet Mah., Pınar Bulvarı". Two
     spellings of one address on the homepage is the exact signal
     docs/index-cleanup-plan.md blames for the ranking problem, and it got in
     here by someone typing carefully rather than importing. */
  title: `${shop.name} | ${phoneDisplay} | Kapaklı Kuyumcu`,
  description:
    `${shop.founded} yılından beri Kapaklı'da. Altın set, bilezik, küpe, ` +
    `yüzük ve özel tasarım takılar. ${addressOneLine}. Tel: ${phoneDisplay}`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: shop.name,
    url: shop.url,
  },
  robots: { index: true, follow: true },
};

/* Matches the sticky header, which is what sits under the browser's URL bar on
 * a phone — cream since D6 put the frame around the espresso body. */
export const viewport: Viewport = {
  themeColor: "#f4f0e8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${ibarra.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#icerik"
          /* outline-color: the global rule paints rings gold, but this link's
             own focus fill IS gold — gold-deep keeps the ring visible against
             both its fill and the cream header behind it. */
          className="sr-only [outline-color:var(--color-gold-deep)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-ink-text"
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
        {/* Site-wide JewelryStore, generated from lib/config.ts (§10). */}
        <JsonLd data={jewelryStoreSchema()} />
      </body>
    </html>
  );
}
