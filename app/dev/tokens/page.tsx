import type { Metadata } from "next";
import { notFound } from "next/navigation";

/* Token proof sheet — the verification artefact for iteration 2 of plan.md.
 *
 * Kept in the repo rather than thrown away: the whole palette and type scale
 * are visible on one screen, so a later change to a token can be eyeballed
 * instead of hunted through pages. It 404s in production, so it never ships. */

export const metadata: Metadata = {
  title: "Tokens",
  robots: { index: false, follow: false },
};

const GOLDS = [
  ["gold", "#B8964F", "primary accent"],
  ["gold-deep", "#8A6D2F", "hover / gold text on light"],
  ["gold-soft", "#CBAE72", "gold text on dark"],
  ["gold-pale", "#EFE7D6", "hairlines, subtle fills"],
] as const;

const NEUTRALS = [
  ["charcoal", "#2A2724", "header, overlay, bands"],
  ["charcoal-deep", "#1A1816", "footer, sticky header"],
  ["cream", "#FBFAF7", "page background"],
  ["surface", "#FFFFFF", "cards, tiles"],
  ["ink", "#1C1917", "primary text"],
  ["ink-muted", "#6B6560", "secondary text"],
  ["line", "#E8E3DA", "1px borders"],
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
    <div className="border border-line">
      <div className="h-16" style={{ backgroundColor: hex }} />
      <div className="border-t border-line px-3 py-2">
        <p className="font-mono text-xs text-ink">{name}</p>
        <p className="font-mono text-xs text-ink-muted">{hex}</p>
        <p className="mt-1 text-xs text-ink-muted">{use}</p>
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
    <section className="border-t border-line pt-8">
      <p className="text-label uppercase text-gold-deep">{title}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function TokensPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header className="pb-8">
        <p className="text-label uppercase text-gold-deep">Iterasyon 2</p>
        <h1 className="mt-3 display-lg">Tasarım Belirteçleri</h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          Token ve font doğrulama sayfası. Üretimde 404 döner.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        <Section title="Altın — vurgu, asla büyük dolgu">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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

        <Section title="Display — Cormorant Garamond">
          <div className="flex flex-col gap-4">
            <p className="display-lg">Trakya Kapaklı Kuyumculuk</p>
            <p className="display-md">Özel Tasarım Takılar</p>
            <p className="display-sm">Tek Taş Modelleri</p>
            <p className="display-sm text-gold-deep">
              {GLYPHS}
            </p>
            <p className="font-display text-2xl">{PANGRAM}</p>
          </div>
        </Section>

        <Section title="Gövde — Inter">
          <div className="flex max-w-2xl flex-col gap-4">
            <p>{PANGRAM}</p>
            <p className="text-gold-deep">{GLYPHS}</p>
            <p className="text-ink-muted">
              Kapaklı Kuyumculuk 2000 yılında Kapaklı ilçesinin merkezinde
              kurulmuş olup ilçenin ilk kuyumcusudur. Geniş ürün yelpazesiyle,
              güler yüzlü ve dürüst personeliyle hizmet vermektedir.
            </p>
            <p className="text-label uppercase text-ink-muted">
              Etiket · 11px · 0.18em
            </p>
          </div>
        </Section>

        <Section title="Kategori adları — her iki yüzde">
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {CATEGORY_NAMES.map((name) => (
              <div key={name} className="bg-surface px-4 py-3">
                <p className="font-display text-xl">{name}</p>
                <p className="text-sm text-ink-muted">{name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Bant ritmi — §3 + karar 2">
          <div className="border border-line">
            <div className="bg-charcoal-deep px-6 py-4">
              <p className="text-label uppercase text-gold-soft">
                charcoal-deep · başlık
              </p>
            </div>
            <div className="bg-charcoal px-6 py-14">
              <p className="text-label uppercase text-gold-soft">charcoal</p>
              <p className="mt-2 display-md text-cream">
                Kapaklı&apos;nın kuyumcusu
              </p>
              <div className="mt-4 h-px w-11 bg-gold" />
            </div>
            <div className="bg-cream px-6 py-14">
              <p className="text-label uppercase text-gold-deep">cream</p>
              <p className="mt-2 display-md">Kategoriler</p>
            </div>
            <div className="bg-charcoal px-6 py-14">
              <p className="text-label uppercase text-gold-soft">charcoal</p>
              <p className="mt-2 display-md text-cream">
                Hakkımızda
              </p>
            </div>
            <div className="bg-charcoal-deep px-6 py-8">
              <p className="text-label uppercase text-gold-soft">
                charcoal-deep · alt bilgi
              </p>
            </div>
          </div>
        </Section>

        <Section title="Kurallar — yapısal olarak zorlanır">
          <div className="flex flex-wrap gap-4">
            <div className="rounded-3xl border border-line bg-surface px-4 py-3 shadow-2xl">
              <p className="text-sm">
                <code className="font-mono text-xs">rounded-3xl shadow-2xl</code>
                <br />
                yine de keskin ve gölgesiz
              </p>
            </div>
            <div className="border border-gold bg-gold-pale px-4 py-3">
              <p className="text-sm">gold-pale dolgu · gold kılcal çizgi</p>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
