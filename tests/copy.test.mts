import { test } from "node:test";
import assert from "node:assert/strict";

import { COPY } from "../lib/copy.ts";
import { getCategories } from "../lib/content.ts";

/* The voice gate.
 *
 * TECHNICAL.md §3 specified a build gate that would fail if Turkish filler
 * survived to launch. lib/filler.ts is gone as of 2026-09-08 and this replaced
 * it, doing a larger job — because filler was never the real risk. Filler is
 * obvious. What actually threatens a shop like this is fluent copy that says
 * nothing: "eşsiz zarafet", "hayallerinizdeki yüzük", "her zevke uygun". It
 * reads fine, it passes review, and it is indistinguishable from every other
 * jeweller's site in the country.
 *
 * The voice is sade esnaf sesi — the owner talking across the counter. Short
 * sentences, one idea each, concrete over evocative. That cannot be tested.
 * What can be tested is its absence, and these are the tells.
 */

/* ------------------------------------------------------------------ */
/* Everything a visitor reads, flattened                               */
/* ------------------------------------------------------------------ */

/* Walks COPY rather than listing its leaves, so a string added next month is
 * covered without anyone remembering to add it here. Functions are called with
 * a sample so templated copy is checked too. */
function strings(node: unknown, path = "COPY"): [string, string][] {
  if (typeof node === "string") return [[path, node]];
  if (typeof node === "function") {
    return [[path, (node as (s: string) => string)("Yüzük")]];
  }
  if (Array.isArray(node)) {
    return node.flatMap((item, i) => strings(item, `${path}[${i}]`));
  }
  if (node !== null && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) =>
      strings(value, `${path}.${key}`),
    );
  }
  return [];
}

const COPY_STRINGS = strings(COPY);

/* Category intros, titles and meta descriptions are copy too, and they live in
 * lib/content.ts because they travel with the category. */
const CATEGORY_STRINGS: [string, string][] = getCategories().flatMap((c) => [
  [`${c.slug}.intro`, c.intro],
  [`${c.slug}.description`, c.description],
]);

const ALL = [...COPY_STRINGS, ...CATEGORY_STRINGS];

test("the walker actually found the copy", () => {
  // Guards the guard: a broken walk would make every test below pass vacuously.
  assert.ok(
    COPY_STRINGS.length >= 25,
    `only ${COPY_STRINGS.length} strings walked out of COPY`,
  );
  assert.ok(CATEGORY_STRINGS.length >= 8);
});

/* ------------------------------------------------------------------ */
/* The banned list                                                     */
/* ------------------------------------------------------------------ */

/* Not a style preference. Every one of these is a word that sounds like it is
 * describing the jewellery while carrying no information about it — the
 * vocabulary of a site that has nothing specific to say. A customer deciding
 * whether to walk into this shop rather than the one across the road learns
 * nothing from "kusursuz işçilik" and something real from "ayar ve gram
 * etikette yazar". */
const BANNED = [
  "zarafet", "zarif", "eşsiz", "benzersiz", "büyüleyici", "kusursuz",
  "mükemmel", "ışıltı", "ışıltılı", "prestij", "tutku", "tutkuyla",
  "ayrıcalık", "ayrıcalıklı", "hayallerinizdeki", "özenle seçilmiş",
  "özenle tasarlanmış", "her zevke uygun", "kaliteden ödün vermeden",
  "sizler için", "sizlere", "en özel anlarınız", "unutulmaz", "şıklık",
  "göz alıcı", "zamansız", "yolculuk", "deneyim", "keşfedin", "hoş geldiniz",
];

test("no copy reaches for the words that say nothing", () => {
  const hits: string[] = [];

  for (const [path, text] of ALL) {
    const haystack = text.toLocaleLowerCase("tr");
    for (const word of BANNED) {
      if (haystack.includes(word)) hits.push(`${path}: "${word}"`);
    }
  }

  assert.deepEqual(hits, [], `banned copy:\n${hits.join("\n")}`);
});

/* ------------------------------------------------------------------ */
/* Punctuation and shape                                               */
/* ------------------------------------------------------------------ */

test("nothing shouts", () => {
  /* An exclamation mark on a jeweller's site is a sale sign. This shop's
   * argument is that it is calm and has been here since 2000. */
  const hits = ALL.filter(([, text]) => text.includes("!")).map(([p]) => p);
  assert.deepEqual(hits, [], `exclamation marks: ${hits.join(", ")}`);
});

test("nothing asks the reader a question it intends to answer itself", () => {
  /* "Hayalinizdeki yüzüğü mü arıyorsunuz?" is the shape being banned — the
   * rhetorical setup. A real question to the shop is fine, but copy does not
   * ask them; copy answers them. */
  const hits = ALL.filter(([, text]) => text.includes("?")).map(([p]) => p);
  assert.deepEqual(hits, [], `rhetorical questions: ${hits.join(", ")}`);
});

test("no sentence opens with Biz, or Sizin için", () => {
  /* Both are the sound of a company describing itself. The voice is first
   * person plural throughout without ever announcing that it is. */
  const hits: string[] = [];

  for (const [path, text] of ALL) {
    for (const sentence of text.split(/(?<=[.:;])\s+/)) {
      const opening = sentence.trimStart();
      if (/^Biz,/.test(opening) || /^Sizin için/i.test(opening)) {
        hits.push(`${path}: "${opening.slice(0, 40)}…"`);
      }
    }
  }

  assert.deepEqual(hits, [], hits.join("\n"));
});

/* ------------------------------------------------------------------ */
/* Length                                                              */
/* ------------------------------------------------------------------ */

function sentenceCount(text: string): number {
  return text.split(/[.:]\s+|[.]$/).filter((s) => s.trim().length > 0).length;
}

test("product and contact paragraphs stay at three sentences or fewer", () => {
  /* Someone reading this on a phone, standing up, deciding whether to walk in.
   * A fourth sentence is where a paragraph starts restating the third. */
  const scoped = [
    ...CATEGORY_STRINGS.filter(([p]) => p.endsWith(".intro")),
    ...strings(COPY.urunler, "urunler"),
    ...strings(COPY.galeri, "galeri"),
    ...strings(COPY.iletisim, "iletisim"),
    ...strings(COPY.home, "home"),
  ];

  for (const [path, text] of scoped) {
    const count = sentenceCount(text);
    assert.ok(count <= 3, `${path} has ${count} sentences: "${text}"`);
  }
});

test("Hakkımızda paragraphs stay at four sentences or fewer", () => {
  // The one page allowed to make an argument rather than state a fact.
  for (const [i, paragraph] of COPY.hakkimizda.paragraphs.entries()) {
    const count = sentenceCount(paragraph);
    assert.ok(count <= 4, `paragraph ${i} has ${count} sentences`);
  }
});

/* ------------------------------------------------------------------ */
/* Local intent                                                        */
/* ------------------------------------------------------------------ */

function localityHits(text: string): number {
  return (text.match(/Kapaklı|Tekirdağ/g) ?? []).length;
}

test("no paragraph names the locality twice", () => {
  /* Twice in one paragraph is the tell of copy written for a search engine
   * rather than a reader, and Google has been able to see through it for
   * roughly a decade. Once, where it belongs in the sentence. */
  const hits: string[] = [];

  for (const [path, text] of ALL) {
    const count = localityHits(text);
    if (count > 1) hits.push(`${path} names it ${count} times`);
  }

  assert.deepEqual(hits, [], hits.join("\n"));
});

test("each page names Kapaklı or Tekirdağ exactly once", () => {
  /* §10's whole target is local intent. A page that never says where the shop
   * is competes nationally by accident, and a page that says it three times
   * reads as spam — so it is asserted in both directions, per page. */
  const pages: Record<string, string[]> = {
    home: [COPY.home.heroLede, COPY.home.about, COPY.home.contactLede,
           ...Object.values(COPY.home.services)],
    urunler: [COPY.urunler.lede],
    galeri: [COPY.galeri.lede],
    hizmetler: [
      COPY.hizmetler.lede,
      COPY.hizmetler["altin-alim-satim"].lede,
      COPY.hizmetler["altin-alim-satim"].body,
      COPY.hizmetler["siparis-uzerine-uretim"].lede,
      COPY.hizmetler["siparis-uzerine-uretim"].body,
    ],
    hakkimizda: [...COPY.hakkimizda.paragraphs],
  };

  for (const [page, texts] of Object.entries(pages)) {
    const total = texts.reduce((sum, t) => sum + localityHits(t), 0);
    assert.equal(total, 1, `${page} names the locality ${total} times`);
  }

  // And once per category page, via its intro.
  for (const category of getCategories()) {
    assert.equal(
      localityHits(category.intro),
      1,
      `${category.slug} names the locality ${localityHits(category.intro)} times`,
    );
  }
});

/* ------------------------------------------------------------------ */
/* Meta descriptions                                                   */
/* ------------------------------------------------------------------ */

test("category meta descriptions fit the 120–155 character window", () => {
  /* Under 120 wastes the slot; over 155 is truncated mid-sentence in the
   * result, which reads as carelessness on the one line a stranger sees. */
  for (const c of getCategories()) {
    const n = c.description.length;
    assert.ok(
      n >= 120 && n <= 155,
      `${c.slug} description is ${n} chars: "${c.description}"`,
    );
  }
});

test("no meta description shouts in capitals", () => {
  for (const c of getCategories()) {
    const words = c.description.split(/\s+/).filter((w) => w.length > 3);
    const shouted = words.filter(
      (w) => w === w.toLocaleUpperCase("tr") && /\p{L}/u.test(w),
    );
    assert.deepEqual(shouted, [], `${c.slug}: ${shouted.join(", ")}`);
  }
});

/* ------------------------------------------------------------------ */
/* The things customers actually ask about                             */
/* ------------------------------------------------------------------ */

test("the site answers the questions asked at the counter", () => {
  /* This is the test that would have failed the copy this replaced. The old
   * text was fluent and mentioned none of these; every one of them is
   * something a customer asks out loud before they buy. */
  const everything = ALL.map(([, t]) => t).join(" ").toLocaleLowerCase("tr");

  const mustAnswer: [string, RegExp][] = [
    ["ayar and gram are on the tag", /ayar[ıi]? ve gram[ıi]?/],
    ["the price follows the day's rate", /günün altın kuruna|günün kuru|o günkü kur/],
    ["weighing happens in front of you", /gözünüzün önünde|sizin önünüzde|önünüzde/],
    ["deductions are said beforehand", /tartıdan önce|işlemden önce/],
    ["resizing and repair", /ölçü ayarı/],
    ["how long an order takes", /iki ile dört hafta/],
    ["send a photo of something seen elsewhere", /fotoğraf/],
  ];

  const missing = mustAnswer
    .filter(([, pattern]) => !pattern.test(everything))
    .map(([label]) => label);

  assert.deepEqual(missing, [], `the copy never answers: ${missing.join("; ")}`);
});
