# Sanity — phase two

The schemas here are written and **not wired up**. `sanity` is deliberately not
a dependency yet.

Why deferred (§11): there are no products at launch, so nothing needs editing on
day one — and after handling fifty real photographs the requirements will be
clearer than anyone can guess now. What *is* fixed already is the shape of the
data, because `lib/content.ts` defines it. So phase two is a swap, not a design
exercise.

## Why Sanity, on the free tier

Verified 19 Aug 2026: 20 seats · 10,000 documents · 100 GB assets · 100 GB
bandwidth/month. A 500-product catalogue with four photos each uses roughly 2%
of that.

The deciding feature is **image hotspot**: the editor drags one dot onto the
important part of a photo, and every crop on the site — square tile, wide hero,
mobile strip — crops around it. With amateur photography of inconsistent
framing, that is the difference between a tidy grid and a messy one. It also
handles WebP conversion, resizing and CDN delivery with no code.

> ⚠️ **The free-tier dataset is public.** Fine for a product catalogue. Nothing
> private ever goes in it — no supplier pricing, no personal numbers, no
> customer records.

## Wiring it up

1. Create the project at sanity.io and note the project ID.
2. `npm i sanity next-sanity @sanity/image-url`
3. Delete `sanity/schemaTypes/types.ts` and wrap each schema export in
   `defineType(...)`. The object shapes are already exactly what `defineType`
   takes, so this is mechanical.
4. Add `sanity.config.ts` at the repo root pointing at `schemaTypes`.
5. Add `app/studio/[[...tool]]/page.tsx` to mount the studio.
   `/studio` is already disallowed in `app/robots.ts`.
6. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
7. Rewrite the function bodies in **`lib/content.ts`** to fetch via GROQ.
   **Only that file changes.** No page or component is touched — that is what
   the module boundary is for.

## The three documents

| Schema | Why |
|---|---|
| `category` | The five categories. Its slug field carries a loud Turkish warning that the slug is a published URL and needs a redirect before it changes (§4 rule 1) — two of these are already in Google's index. |
| `product` | Deliberately has **no price field**, and must never get one. Prices track the daily gold rate, which is why this is a catalogue and not a shop. |
| `siteSettings` | Not in §11's original plan. Added so the owner can change the seasonal closing time without a deploy, plus the canonical NAP with warnings that it must match the Google Business Profile character-for-character. |

## After wiring

`lib/config.ts` stays the fallback and the source of truth for anything
`siteSettings` does not cover. If the two ever disagree about the address, that
is the bug — the whole architecture exists to make one address impossible to
contradict.
