import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PLACEHOLDER } from "@/lib/placeholders";

/* Verification artefact for iteration 3 of plan.md: every placeholder rendered
 * through next/image at the aspect ratio its real page will use. 404s in
 * production. */

export const metadata: Metadata = {
  title: "Placeholders",
  robots: { index: false, follow: false },
};

const KATEGORILER = [
  ["Pırlanta", PLACEHOLDER.kategori.pirlanta],
  ["Altın Seti", PLACEHOLDER.kategori["altin-seti"]],
  ["Küpe Modelleri", PLACEHOLDER.kategori["kupe-modelleri"]],
  ["Tek Taş Modelleri", PLACEHOLDER.kategori["tek-tas-modelleri"]],
  ["Özel Tasarım Takılar", PLACEHOLDER.kategori["ozel-tasarim-takilar"]],
] as const;

export default function PlaceholdersPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header className="pb-8">
        <p className="text-label uppercase text-gold-deep">Iterasyon 3</p>
        <h1 className="mt-3 display-lg">Yer Tutucu Görseller</h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          Tümü <code className="font-mono text-sm">next/image</code> üzerinden.
          Gerçek fotoğrafa geçmek yalnızca yol dizesini değiştirmeyi gerektirir.
        </p>
      </header>

      <section className="border-t border-line pt-8">
        <p className="text-label uppercase text-gold-deep">
          Kategori karoları — 1:1, kömür zemin
        </p>
        <div className="mt-5 grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
          {KATEGORILER.map(([name, src]) => (
            <figure key={src} className="bg-cream">
              <div className="relative aspect-square">
                <Image
                  src={src}
                  alt={name}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-3 py-2">
                <p className="font-display text-lg">{name}</p>
                <p className="font-mono text-xs text-ink-muted">{src}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <p className="text-label uppercase text-gold-deep">
          Ürün karosu — 1:1, krem zemin
        </p>
        <div className="mt-5 grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-surface">
              <div className="relative aspect-square">
                <Image
                  src={PLACEHOLDER.urun}
                  alt="Ürün görseli yakında"
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="px-3 py-2">
                <p className="font-display text-base">22 Ayar Burma Bilezik</p>
                <p className="text-xs text-ink-muted">22 ayar · 38.5 gr</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <p className="text-label uppercase text-gold-deep">
          Vitrin — 16:9, soldan kömür geçişli
        </p>
        <div className="relative mt-5 aspect-video overflow-hidden">
          <Image
            src={PLACEHOLDER.hero}
            alt="Vitrin görseli yakında"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-deep via-charcoal-deep/70 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <p className="text-label uppercase text-gold-soft">
              2000&apos;den beri · Kapaklı
            </p>
            <p className="mt-3 display-md text-cream">
              Trakya Kapaklı
              <br />
              <span className="text-gold-soft">Kuyumculuk</span>
            </p>
            <div className="mt-4 h-px w-11 bg-gold" />
          </div>
        </div>
      </section>
    </main>
  );
}
