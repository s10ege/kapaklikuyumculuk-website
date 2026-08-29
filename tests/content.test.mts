import { test } from "node:test";
import assert from "node:assert/strict";

import {
  getCategories,
  getCategory,
  getCategorySlugs,
  getFeaturedProducts,
  getProducts,
  pageTitle,
  parseCatalogueMeta,
} from "../lib/content.ts";

/* ------------------------------------------------------------------ */
/* Slugs are published URLs (§4)                                       */
/* ------------------------------------------------------------------ */

/* This list is not a preference — it is the URL strategy. `/urunler/pirlanta`
 * and `/urunler/ozel-tasarim-takilar` are already in Google's index and are
 * being reclaimed as live pages; the other three receive 301s from `/urun/*`.
 * If this test fails, a redirect has to be added to vercel.json before the
 * slug changes, or the index history is lost. */
const PUBLISHED_SLUGS = [
  "pirlanta",
  "altin-seti",
  "kupe-modelleri",
  "tek-tas-modelleri",
  "ozel-tasarim-takilar",
];

test("category slugs match the URL strategy exactly", () => {
  assert.deepEqual(getCategorySlugs(), PUBLISHED_SLUGS);
});

test("slugs are URL-safe and lowercase", () => {
  for (const slug of getCategorySlugs()) {
    assert.match(slug, /^[a-z0-9-]+$/, `${slug} is not a clean slug`);
  }
});

test("getCategory finds each slug and rejects unknown ones", () => {
  for (const slug of PUBLISHED_SLUGS) {
    assert.equal(getCategory(slug)?.slug, slug);
  }
  assert.equal(getCategory("yuzuk-modelleri"), undefined);
});

test("categories come back in display order", () => {
  const orders = getCategories().map((c) => c.order);
  assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
});

/* ------------------------------------------------------------------ */
/* The intro paragraphs are the entire SEO surface (§6.2)              */
/* ------------------------------------------------------------------ */

test("every category carries the fields a page and its metadata need", () => {
  for (const c of getCategories()) {
    assert.ok(c.name.length > 0, `${c.slug} has no name`);
    assert.ok(c.title.length > 0, `${c.slug} has no title`);
    assert.ok(c.description.length > 0, `${c.slug} has no description`);
    assert.ok(c.coverImage.startsWith("/"), `${c.slug} cover is not a path`);
  }
});

test("intros are real paragraphs, not stubs", () => {
  for (const c of getCategories()) {
    // Roughly two to three sentences of Turkish. The lower bound is the guard
    // that matters: it stops an intro being replaced by a placeholder line.
    assert.ok(
      c.intro.length > 180,
      `${c.slug} intro is too short to carry the category (${c.intro.length})`,
    );
    const sentences = c.intro.split(/\.\s|\.$/).filter(Boolean);
    assert.ok(
      sentences.length >= 2 && sentences.length <= 4,
      `${c.slug} intro has ${sentences.length} sentences`,
    );
  }
});

test("each intro names the locality once, naturally", () => {
  for (const c of getCategories()) {
    const hits = (c.intro.match(/Kapaklı|Tekirdağ/g) ?? []).length;
    assert.equal(
      hits,
      1,
      `${c.slug} mentions the locality ${hits} times; once is the target`,
    );
  }
});

test("descriptions stay inside a sensible meta length", () => {
  for (const c of getCategories()) {
    assert.ok(
      c.description.length >= 70 && c.description.length <= 165,
      `${c.slug} description is ${c.description.length} chars`,
    );
  }
});

/* ------------------------------------------------------------------ */
/* Titles                                                              */
/* ------------------------------------------------------------------ */

test("titles keep the template the old site was indexed under", () => {
  assert.equal(
    pageTitle("Pırlanta Modelleri"),
    "Pırlanta Modelleri - Trakya Kapaklı Kuyumculuk | 0282 717 21 31 | Kapaklı",
  );
});

test("every category title uses the template", () => {
  for (const c of getCategories()) {
    assert.ok(
      c.title.includes("0282 717 21 31"),
      `${c.slug} title lost the phone number`,
    );
  }
});

/* ------------------------------------------------------------------ */
/* The catalogue, however full it happens to be (§3)                    */
/* ------------------------------------------------------------------ */

/* These assert invariants rather than a count. The catalogue is read from
 * public/urunler/ at import, so how many products exist depends on what is on
 * disk — nothing at all on a fresh clone, six during the 2.1 trial, fifty after
 * the real shoot. A test pinned to any one of those numbers would fail for the
 * wrong reason on the other two.
 *
 * The empty catalogue is a legitimate state, not a broken one: every grid has a
 * designed Yakında panel for it (§6.2). What must never happen is a product that
 * renders as a blank card or points at an image that is not there. */

test("an empty catalogue is a valid state, not an error", () => {
  // The launch state, and the state of any clone without the photographs.
  // Reading it must not throw, and must not invent anything.
  assert.ok(Array.isArray(getProducts()));
  assert.ok(Array.isArray(getFeaturedProducts()));
});

test("every product can actually render a card", () => {
  for (const p of getProducts()) {
    assert.ok(p.id.length > 0, "a product has no id");
    assert.ok(p.name.length > 0, `${p.id} has no name`);
    assert.ok(
      PUBLISHED_SLUGS.includes(p.category),
      `${p.id} is in "${p.category}", which is not a published category`,
    );
    assert.ok(p.images.length > 0, `${p.id} has no image`);
    for (const image of p.images) {
      assert.match(image, /^\/urunler\/[a-z0-9-]+\/[a-z0-9-]+_\d{2}\.webp$/,
        `${p.id} has an image path the folder walk could not have produced: ${image}`);
    }
  }
});

test("product ids are unique, so React keys and the lightbox index agree", () => {
  const ids = getProducts().map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("products come back in order", () => {
  const orders = getProducts().map((p) => p.order);
  assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
});

test("a category only ever returns its own products", () => {
  for (const slug of PUBLISHED_SLUGS) {
    for (const p of getProducts(slug)) {
      assert.equal(p.category, slug);
    }
  }
});

test("Öne Çıkanlar is capped at four and holds only flagged products", () => {
  const featured = getFeaturedProducts();
  assert.ok(featured.length <= 4, `${featured.length} featured products, max is 4`);
  for (const p of featured) assert.equal(p.featured, true);
  // The cap is the argument's job, not the caller's.
  assert.ok(getFeaturedProducts(2).length <= 2);
});

test("filtering by an unknown category returns empty, not everything", () => {
  // Guards the shape of the filter: a falsy-check bug here would make an
  // unknown slug render the entire catalogue.
  assert.deepEqual(getProducts("does-not-exist"), []);
});

/* ------------------------------------------------------------------ */
/* catalogue.json is hand-edited (§3)                                   */
/* ------------------------------------------------------------------ */

/* Soner edits this file by hand between shoots. A stray comma must cost the
 * display names and the featured flags — not the build. */

test("catalogue.json survives being hand-edited badly", () => {
  assert.deepEqual(parseCatalogueMeta("{ this is not json"), {});
  assert.deepEqual(parseCatalogueMeta("[]"), {});
  assert.deepEqual(parseCatalogueMeta("null"), {});
  assert.deepEqual(parseCatalogueMeta('"a string"'), {});
});

test("a well-formed catalogue.json comes back as written", () => {
  const meta = parseCatalogueMeta(
    '{"altin-seti/burma-bilezik":{"name":"Burma Bilezik","featured":true}}',
  );
  assert.equal(meta["altin-seti/burma-bilezik"]?.name, "Burma Bilezik");
  assert.equal(meta["altin-seti/burma-bilezik"]?.featured, true);
});

/* ------------------------------------------------------------------ */
/* Callers must not be able to corrupt the store                       */
/* ------------------------------------------------------------------ */

test("mutating a returned array does not affect later reads", () => {
  const first = getCategories();
  first.pop();
  assert.equal(getCategories().length, PUBLISHED_SLUGS.length);
});
