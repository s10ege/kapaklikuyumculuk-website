import type { Metadata } from "next";
import { notFound } from "next/navigation";

/* Token proof sheet — originally the verification artefact for iteration 2,
 * rebuilt for the espresso system in iteration 1.2 of design.md.
 *
 * Kept in the repo rather than thrown away: the whole palette and type scale
 * are visible on one screen, so a later change to a token can be eyeballed
 * instead of hunted through pages. It 404s in production, so it never ships. */

export const metadata: Metadata = {
  title: "Tokens",
  robots: { index: false, follow: false },
};

const GOLDS = [
  ["gold", "#B8964F", "hairline accent"],
  ["gold-soft", "#CBAE72", "gold on dark, where it needs to lift"],
  ["gold-deep", "#77602A", "gold on cream — the only legible one there"],
] as const;

const NEUTRALS = [
  ["ground", "#17120E", "espresso — page background"],
  ["panel", "#241C15", "cards, raised bands (3–4/page, D11)"],
  ["frame", "#F4F0E8", "cream — header, footer, reading bands"],
  ["ink-text", "#1A1816", "text on cream"],
  ["ink-muted", "#5F5A52", "secondary text on cream"],
  ["cream-text", "#E8E3DA", "body text on dark — never pure white"],
  ["muted", "#9A958D", "secondary text on dark"],
  ["line-dark", "#262B31", "hairlines on espresso"],
  ["line-light", "#E4DED2", "hairlines on cream"],
  ["whatsapp", "#25D366", "WhatsApp only"],
] as const;

/* Every Turkish-specific glyph, upper and lower. If latin-ext is missing,
 * these are the characters that fall back to another face. */
const GLYPHS = "ı İ i I ğ Ğ ş Ş ç Ç ö Ö ü Ü â Â î Î û Û";

/* A real Turkish pangram — exercises the glyphs mid-word, which is where a
 * missing subset actually shows up. Isolated characters can look fine while
 * running text is broken. */
const PANGRAM = "Pijamalı hasta yağız şoföre çabucak güvendi.";

const CATEGORY_NAMES = [
  "Pırlanta",
  "Altın Seti",
  "Küpe Modelleri",
  "Tek Taş Modelleri",
  "Özel Tasarım Takılar",
];

function Swatch({ name, hex, use }: { name: string; hex: string; use: string }) {
  return (
    <div className="border border-line-dark">
      <div className="h-16" style={{ backgroundColor: hex }} />
      <div className="border-t border-line-dark px-3 py-2">
        <p className="font-mono text-xs text-cream-text">{name}</p>
        <p className="font-mono text-xs text-muted">{hex}</p>
        <p className="mt-1 text-xs text-muted">{use}</p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line-dark pt-8">
      <p className="text-label uppercase text-gold-soft">{title}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function TokensPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header className="pb-8">
        <p className="text-label uppercase text-gold-soft">İterasyon 1.2</p>
        <h1 className="mt-3 display-lg">Tasarım Belirteçleri</h1>
        <p className="mt-3 max-w-xl text-muted">
          Espresso sistemi — token ve font doğrulama sayfası. Üretimde 404
          döner.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        <Section title="Altın — kılcal vurgu, dolgu yalnız birincil düğmede">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {GOLDS.map(([n, h, u]) => (
              <Swatch key={n} name={n} hex={h} use={u} />
            ))}
          </div>
        </Section>

        <Section title="Nötrler">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {NEUTRALS.map(([n, h, u]) => (
              <Swatch key={n} name={n} hex={h} use={u} />
            ))}
          </div>
        </Section>

        <Section title="Display — Bodoni Moda, yalnız ≥32px (D8)">
          <div className="flex flex-col gap-4">
            <p className="display-lg">Trakya Kapaklı Kuyumculuk</p>
            <p className="display-md">Özel Tasarım Takılar</p>
            <p className="display-sm">Tek Taş Modelleri</p>
            <p className="display-sm text-gold-soft">
              {GLYPHS}
            </p>
            <p className="text-sm text-muted">
              32px altında Bodoni yok — ince çizgileri koyu zeminde kaybolur.
              Kalanı Jost taşır.
            </p>
          </div>
        </Section>

        <Section title="Gövde — Jost">
          <div className="flex max-w-2xl flex-col gap-4">
            <p>{PANGRAM}</p>
            <p className="text-gold-soft">{GLYPHS}</p>
            <p className="text-muted">
              Kapaklı Kuyumculuk 2000 yılında Kapaklı ilçesinin merkezinde
              kurulmuş olup ilçenin ilk kuyumcusudur. Geniş ürün yelpazesiyle,
              güler yüzlü ve dürüst personeliyle hizmet vermektedir.
            </p>
            <p className="text-label uppercase text-muted">
              Etiket · 11px · 0.18em
            </p>
          </div>
        </Section>

        <Section title="Kategori adları — koyu zeminde">
          <div className="grid gap-px border border-line-dark bg-line-dark sm:grid-cols-2">
            {CATEGORY_NAMES.map((name) => (
              <div key={name} className="bg-panel px-4 py-3">
                <p className="text-xl">{name}</p>
                <p className="text-sm text-muted">{name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Zemin ve çerçeve — D6">
          <div className="border border-line-dark">
            <div className="bg-frame px-6 py-4">
              <p className="text-label uppercase text-gold-deep">
                frame · başlık ve alt bilgi
              </p>
            </div>
            <div className="bg-ground px-6 py-14">
              <p className="text-label uppercase text-gold-soft">ground</p>
              <p className="mt-2 display-md text-cream-text">
                Kapaklı&apos;nın kuyumcusu
              </p>
              <div className="mt-4 h-px w-11 bg-gold" />
            </div>
            <div className="bg-panel px-6 py-14">
              <p className="text-label uppercase text-gold-soft">
                panel · kart ve bant
              </p>
              <p className="mt-2 text-cream-text">
                Yüzeyler gölgeyle değil, 1px line-dark çizgiyle ayrılır.
              </p>
            </div>
            <div className="bg-frame px-6 py-8">
              <p className="text-label uppercase text-gold-deep">
                frame · alt bilgi
              </p>
              <p className="mt-2 text-sm text-ink-text">
                Krem üzerinde metin ink-text, altın gold-deep.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Kurallar — yapısal olarak zorlanır">
          <div className="flex flex-wrap gap-4">
            <div className="rounded-3xl border border-line-dark bg-panel px-4 py-3 shadow-2xl">
              <p className="text-sm">
                <code className="font-mono text-xs">rounded-3xl shadow-2xl</code>
                <br />
                yine de keskin ve gölgesiz
              </p>
            </div>
            <div className="border border-gold bg-panel px-4 py-3">
              <p className="text-sm">panel dolgu · gold kılcal çizgi</p>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
