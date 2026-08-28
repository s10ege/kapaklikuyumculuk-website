import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { statSync } from "node:fs";
import { join } from "node:path";

/* Verification artefact for iteration 1.1 of design.md.
 *
 * The Ata Lirası loop, rendered offline from ata_animation/turkey_coin3.glb
 * by scripts/render-coin.mjs, reviewed here at 390 / 768 / 1440 before it is
 * wired into the hero (iteration 1.3). The espresso ground is hardcoded
 * because the palette tokens land in iteration 1.2 — it must match the flat
 * colour baked into the video exactly, or the seam shows.
 *
 * 404s in production.
 */

export const metadata: Metadata = {
  title: "Ata Lirası",
  robots: { index: false, follow: false },
};

const BUDGET_KB: Record<string, number> = {
  "coin-800.mp4": 1500,
  "coin-420.mp4": 500,
};

function sizeKb(file: string): number | null {
  try {
    return Math.round(statSync(join(process.cwd(), "public", "hero", file)).size / 1024);
  } catch {
    return null;
  }
}

function Caption({ file }: { file: string }) {
  const kb = sizeKb(file);
  const budget = BUDGET_KB[file];
  return (
    <p className="mt-3 text-sm text-[#9A958D]">
      {file} ·{" "}
      {kb === null ? "dosya yok" : budget ? `${kb} KB / bütçe ${budget} KB` : `${kb} KB`}
    </p>
  );
}

export default function CoinPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="bg-[#17120E] text-[#E8E3DA]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-label uppercase text-[#CBAE72]">İterasyon 1.1</p>
        <h1 className="mt-3 display-lg">Ata Lirası Döngüsü</h1>
        <p className="mt-3 max-w-xl text-[#9A958D]">
          ~16 saniyede bir tur; her yüz karşıya geldiğinde yavaşlayıp ~1,5
          saniye durur. Dikişi görmek için en az iki tam turu izleyin —
          başlangıca dönüş hissedilmemeli.
        </p>

        <div className="mt-12 border-b border-[#262B31] pb-3">
          <p className="text-label uppercase text-[#9A958D]">
            Masaüstü · 800 piksel
          </p>
        </div>
        <div className="mt-6">
          <video
            className="w-full max-w-[800px]"
            width={800}
            height={800}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/hero/coin-800.mp4" type="video/mp4" />
          </video>
          <Caption file="coin-800.mp4" />
        </div>

        <div className="mt-12 border-b border-[#262B31] pb-3">
          <p className="text-label uppercase text-[#9A958D]">
            Mobil · 420 piksel
          </p>
        </div>
        <div className="mt-6">
          <video
            className="w-full max-w-[420px]"
            width={420}
            height={420}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/hero/coin-420.mp4" type="video/mp4" />
          </video>
          <Caption file="coin-420.mp4" />
        </div>

        <div className="mt-12 border-b border-[#262B31] pb-3">
          <p className="text-label uppercase text-[#9A958D]">
            Sabit kare · prefers-reduced-motion ve prefers-reduced-data
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-start gap-8">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element -- dev
                preview compares raw files; the optimizer would re-encode them */}
            <img
              src="/hero/coin-still-800.webp"
              alt=""
              width={800}
              height={800}
              className="w-full max-w-[400px]"
            />
            <figcaption>
              <Caption file="coin-still-800.webp" />
            </figcaption>
          </figure>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/coin-still-420.webp"
              alt=""
              width={420}
              height={420}
              className="w-full max-w-[210px]"
            />
            <figcaption>
              <Caption file="coin-still-420.webp" />
            </figcaption>
          </figure>
        </div>
      </div>
    </main>
  );
}
