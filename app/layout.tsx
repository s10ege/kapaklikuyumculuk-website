import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { categoryLinks, PAGE_LINKS } from "@/lib/nav";

/* §3 — Display: Cormorant Garamond. Body: Inter.
 *
 * `latin-ext` is mandatory, not optional. Without it the Turkish glyphs
 * ı İ ğ ş ç ö ü fall back to a different font mid-word, which reads as a font
 * choice rather than a bug — it is the single easiest thing to miss on this site.
 *
 * next/font downloads both at build time and serves them from our own origin,
 * so no request reaches Google from a visitor's browser. That is what §3 asks
 * for; it just gets there without an @fontsource dependency, and adds
 * size-adjusted fallback metrics so swapping in the real face shifts nothing.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
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
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-charcoal-deep"
        >
          İçeriğe geç
        </a>
        <Header categories={categoryLinks()} pages={PAGE_LINKS} />
        <div id="icerik" className="flex flex-1 flex-col">
          {children}
        </div>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
