import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { OvalMark } from "@/components/Lockup";
import { address, shop } from "@/lib/config";
import { getCategories } from "@/lib/content";

/* The source of the Open Graph cards (§5) — a dev-only route that exists to be
 * photographed, not visited.
 *
 * Why a page and a screenshot rather than next/og's ImageResponse: the fonts
 * come from next/font/google, so no font binary is committed anywhere in this
 * repo, and ImageResponse needs the bytes at build time. Fetching Google Fonts
 * inside `next build` would make the build need the network — which the setup
 * script already treats as a thing that cannot be assumed here. Rendering in a
 * real browser gets the same webfonts the site serves, for free, and the
 * artefact that lands in the PR is the PNG Soner judges rather than JSX he
 * cannot evaluate.
 *
 * Each card is exactly 1200x630 and carries an id, so scripts/og.mjs can
 * screenshot the element rather than the viewport and never capture the
 * surrounding chrome.
 *
 * Design: espresso ground (D6), gold as a hairline only (D12), the warm radial
 * glow behind the coin (D7 — the sole permitted exception to no-shadows), the
 * display face well above its 32px floor (D8), and product photography inside
 * a hairline-bordered frame rather than bled to the edge.
 */

export const metadata: Metadata = {
  title: "OG cards",
  robots: { index: false, follow: false },
};

const W = 1200;
const H = 630;

/* The locality line. Both values come from config; this is a card, not copy,
   and it must not become a second place the address is written down. */
const PLACE = `${address.locality} · ${address.region}`;

function Card({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div
      id={id}
      style={{ width: W, height: H }}
      className="relative flex shrink-0 overflow-hidden bg-ground"
    >
      {/* The hairline frame, inset rather than on the edge — a border at the
          very edge of an OG card is the first thing a platform crops off. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 border border-gold/30"
      />
      {children}
    </div>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-5">
      <OvalMark className="h-16 w-16 flex-none text-gold-soft" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.375rem] font-medium uppercase tracking-[0.2em] text-cream-text">
          {shop.name.split(" ").slice(0, -1).join(" ")}
        </span>
        <span className="mt-2 text-[1rem] uppercase tracking-[0.32em] text-gold-soft">
          {shop.name.split(" ").at(-1)}
        </span>
      </span>
    </div>
  );
}

function PlaceLine() {
  return (
    <p className="text-[1.125rem] uppercase tracking-[0.22em] text-gold-soft">
      {PLACE}
    </p>
  );
}

/* The site-wide card: the coin, because it is what the homepage leads with and
   the only thing on this site nobody else in Kapaklı has. */
function DefaultCard() {
  return (
    <Card id="og-default">
      <div className="flex w-[58%] flex-col justify-between px-16 py-16">
        <Wordmark />
        <div>
          <h1 className="display-lg text-[3.25rem] leading-[1.1] text-cream-text">
            {shop.claim}
          </h1>
          <div className="mt-6 h-px w-16 bg-gold" />
        </div>
        <PlaceLine />
      </div>

      <div className="relative flex w-[42%] items-center justify-center">
        <div className="relative aspect-square w-[68%]">
          {/* D7 — the warm radial pool, same values as the hero. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-20%] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(184,150,79,0.35), transparent 70%)",
            }}
          />
          <Image
            src="/hero/coin-still-800.webp"
            alt=""
            fill
            loading="eager"
            sizes="400px"
            className="object-contain"
          />
        </div>
      </div>
    </Card>
  );
}

/* One card per category. The photograph is the category's own cover — the same
   image the tile on /urunler already uses, so the card and the page a visitor
   lands on show the same piece. */
function CategoryCard({
  slug,
  name,
  image,
}: {
  slug: string;
  name: string;
  image: string;
}) {
  return (
    <Card id={`og-${slug}`}>
      <div className="flex w-[55%] flex-col justify-between px-16 py-16">
        <Wordmark />
        <div>
          <h1 className="display-lg text-[3.5rem] leading-[1.05] text-cream-text">
            {name}
          </h1>
          <div className="mt-6 h-px w-16 bg-gold" />
        </div>
        <PlaceLine />
      </div>

      <div className="flex w-[45%] items-center justify-center pr-16">
        <div className="relative aspect-square w-[78%] overflow-hidden border border-line-dark">
          <Image
            src={image}
            alt=""
            fill
            loading="eager"
            sizes="420px"
            className="object-cover"
          />
        </div>
      </div>
    </Card>
  );
}

export default function OgCardsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const categories = getCategories();

  return (
    <div className="bg-panel px-8 py-12">
      <p className="mb-8 text-sm text-muted">
        Open Graph kartları — 1200×630. `npm run og` bu elemanları
        fotoğraflar.
      </p>

      <div className="flex flex-col gap-8">
        <DefaultCard />
        {categories.map((c) => (
          <CategoryCard
            key={c.slug}
            slug={c.slug}
            name={c.name}
            image={c.coverImage}
          />
        ))}
      </div>
    </div>
  );
}
