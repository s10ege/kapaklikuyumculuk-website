import { test } from "node:test";
import assert from "node:assert/strict";

import {
  getCategories,
  getCategory,
  getCategorySlugs,
  getFeaturedProducts,
  getProducts,
  pageTitle,
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
/* The empty launch state (§2)                                         */
/* ------------------------------------------------------------------ */

test("there are no products at launch", () => {
  assert.deepEqual(getProducts(), []);
});

test("every category is empty, so every grid shows Yakında", () => {
  for (const slug of PUBLISHED_SLUGS) {
    assert.deepEqual(getProducts(slug), []);
  }
});

test("featured is empty, so Öne Çıkanlar hides itself", () => {
  assert.deepEqual(getFeaturedProducts(), []);
});

test("filtering by an unknown category returns empty, not everything", () => {
  // Guards the shape of the filter: a falsy-check bug here would make an
  // unknown slug render the entire catalogue.
  assert.deepEqual(getProducts("does-not-exist"), []);
});

/* ------------------------------------------------------------------ */
/* Callers must not be able to corrupt the store                       */
/* ------------------------------------------------------------------ */

test("mutating a returned array does not affect later reads", () => {
  const first = getCategories();
  first.pop();
  assert.equal(getCategories().length, PUBLISHED_SLUGS.length);
});
