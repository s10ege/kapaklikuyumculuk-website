import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/* Source-level invariants.
 *
 * The project's whole premise (docs/index-cleanup-plan.md) is that this
 * business's ranking problem comes from the same facts being written down
 * inconsistently in many places. The architecture answers that by keeping every
 * such fact in lib/config.ts — but an architecture is only a convention until
 * something enforces it, and the next person in a hurry will inline a phone
 * number because it is faster.
 *
 * These tests are that enforcement. They read the source rather than the DOM,
 * so they catch a hardcoded value even on a page nobody wrote a test for.
 */

const SOURCE_DIRS = ["app", "components", "lib"];
const ALLOWED = new Set(["lib/config.ts"]);

function sourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      sourceFiles(path, acc);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      acc.push(path.replace(/\\/g, "/"));
    }
  }
  return acc;
}

const FILES = SOURCE_DIRS.flatMap((d) => sourceFiles(d)).filter(
  (f) => !ALLOWED.has(f),
);

/* Blanks out comment text while preserving newlines, so reported line numbers
 * still point at the real line.
 *
 * A comment explaining one of these rules necessarily quotes the value it is
 * about — the first version of this helper only stripped `//` lines and
 * `*`-prefixed ones, so the comment documenting the address fix tripped the
 * address check.
 *
 * The second version stripped `//` to end of line with a regex, and quietly
 * broke every rule below. `//` appears in the middle of every URL, so
 *
 *     const FACEBOOK_URL = "https://www.facebook.com/537179436417060";
 *
 * was scanned as `const FACEBOOK_URL = "https:` and matched nothing. Found by
 * the stage-3 SEO audit, on the one line the Facebook invariant had just been
 * written to catch. Any inlined phone number, address or opening hour written
 * after a URL on the same line was invisible too.
 *
 * So this walks the file instead of pattern-matching it, tracking whether it
 * is inside a string, a template literal or a comment. Not a parser — it does
 * not need to be — but it does know that `//` inside quotes is not a comment,
 * which is the whole bug. */
function stripComments(source: string): string {
  let out = "";
  let i = 0;
  let quote: string | null = null;

  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];

    if (quote) {
      /* Inside a string: copy it through verbatim, and let a backslash carry
         the following character with it so an escaped quote does not end it. */
      if (c === "\\" && i + 1 < source.length) {
        out += c + next;
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      out += c;
      i += 1;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      out += c;
      i += 1;
      continue;
    }

    if (c === "/" && next === "*") {
      /* Blank the block, keeping newlines so line numbers survive. */
      const end = source.indexOf("*/", i + 2);
      const stop = end === -1 ? source.length : end + 2;
      for (let j = i; j < stop; j += 1) out += source[j] === "\n" ? "\n" : " ";
      i = stop;
      continue;
    }

    if (c === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") i += 1;
      continue;
    }

    out += c;
    i += 1;
  }

  return out;
}

function offenders(pattern: RegExp): string[] {
  const hits: string[] = [];
  for (const file of FILES) {
    const raw = readFileSync(file, "utf8");
    const code = stripComments(raw).split("\n");
    const original = raw.split("\n");

    for (const [i, line] of code.entries()) {
      if (pattern.test(line)) {
        hits.push(`${file}:${i + 1} ${(original[i] ?? "").trim()}`);
      }
    }
  }
  return hits;
}

test("no source file builds a wa.me link", () => {
  /* This used to guard a seam: §9's promise was that flipping one boolean
   * switched every CTA on the site, which held only while every CTA went
   * through contactCta().
   *
   * Since 2026-09-08 it guards a removal instead, and it is the stronger job.
   * WhatsApp is gone — the number, the branch, the icon, the colour token —
   * and the shop takes calls. A `wa.me` link appearing anywhere in this
   * codebase again would be someone reinstating a channel that was removed on
   * purpose. */
  const hits = offenders(/["'`][^"'`]*wa\.me/);
  assert.deepEqual(hits, [], `WhatsApp was removed on purpose:\n${hits.join("\n")}`);
});

test("no source file mentions WhatsApp at all", () => {
  // Same reason as above, one level broader: no label, no aria-label, no alt.
  const hits = offenders(/whatsapp/i);
  assert.deepEqual(hits, [], `WhatsApp was removed on purpose:\n${hits.join("\n")}`);
});

test("no component builds a tel: link by hand", () => {
  const hits = offenders(/["'`]tel:/);
  assert.deepEqual(hits, [], `use phoneHref from lib/config.ts:\n${hits.join("\n")}`);
});

test("no phone number is inlined outside config", () => {
  // Any Turkish landline/mobile shape, spaced or not.
  const hits = offenders(/0?\d{3}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/);
  assert.deepEqual(
    hits,
    [],
    `phone numbers belong in lib/config.ts:\n${hits.join("\n")}`,
  );
});

test("the street address is never inlined outside config", () => {
  /* docs/index-cleanup-plan.md is emphatic that the exact characters matter —
   * "Bulvarı" vs "Blv.", "No: 56/A" vs "No:56/A". One copy, one spelling. */
  const hits = offenders(/Pınar Bulvarı|Cumhuriyet Mah/);
  assert.deepEqual(
    hits,
    [],
    `the address belongs in lib/config.ts:\n${hits.join("\n")}`,
  );
});

test("the former partner's numbers appear nowhere in the source", () => {
  const hits = offenders(/717\s?85\s?88|717\s?39\s?87/);
  assert.deepEqual(hits, [], `these belong to a different business:\n${hits.join("\n")}`);
});

test("the Şanlıurfa lookalike Instagram handle is never linked", () => {
  /* @kapaklikuyumculuk matches our domain, which is exactly why it keeps being
   * used by mistake. The correct handle is @kuyumculukkapakli. */
  const hits = offenders(/instagram\.com\/kapaklikuyumculuk/);
  assert.deepEqual(hits, [], `wrong shop's account:\n${hits.join("\n")}`);
});

test("the shop's name is never inlined outside config", () => {
  /* Hard rule 2, and until 2026-09-08 the only fact in the canonical block
   * with no invariant behind it — the phone, the address and the hours all had
   * one; the name, which is the entire subject of this project, did not.
   *
   * It matters most on the day the name changes. docs/index-cleanup-plan.md's
   * whole thesis is that the shop's name currently resolves to three variants,
   * and plan.md Risk 1 is that publishing a fourth is worse than publishing
   * none. A hardcoded name in one component is how the site ends up being the
   * thing that adds the fourth.
   *
   * Both the canonical string and the retired bare `Kapaklı Kuyumculuk` are
   * caught. The retired one is also covered at source level by
   * scripts/retired-terms.mjs, but that gate allowlists whole directories;
   * this one does not. */
  const hits = offenders(/Trakya Kapaklı Kuyumculuk|Kapaklı Kuyumculuk/);
  assert.deepEqual(hits, [], `the name belongs in lib/config.ts:\n${hits.join("\n")}`);
});

test("the Facebook page is never inlined outside config", () => {
  /* Added 2026-09-08, when `FACEBOOK_URL` moved out of lib/schema.ts. It was
   * the last business fact living outside config, and therefore the last one
   * these tests could not see.
   *
   * It matters more than its size suggests because of where it is used:
   * `sameAs` is the site telling Google which accounts genuinely belong to
   * this shop. docs/index-cleanup-plan.md Step 4 records a directory already
   * attributing a different jeweller's Instagram to this business — naming the
   * wrong account here would confirm that error in our own structured data,
   * signed by us. Both the id and any facebook.com URL are caught, since a
   * vanity-URL guess would be the likely way a wrong one arrives. */
  const hits = offenders(/facebook\.com|537179436417060/);
  assert.deepEqual(hits, [], `Facebook belongs in lib/config.ts:\n${hits.join("\n")}`);
});

test("the correct Instagram handle is never inlined either", () => {
  /* There was only ever a negative rule here: the Şanlıurfa lookalike was
   * caught, the real handle was not. So `kuyumculukkapakli` could be typed
   * into any component and nothing would fail — and the failure mode of a
   * hardcoded handle is the same as a hardcoded phone number, just quieter.
   *
   * Facebook got both halves when it moved into config on 2026-09-08.
   * Instagram did not, until the stage-3 close audit noticed the asymmetry. */
  const hits = offenders(/kuyumculukkapakli/);
  assert.deepEqual(hits, [], `the handle belongs in lib/config.ts:\n${hits.join("\n")}`);
});

test("the canonical URL, the coordinates and the place id stay in config", () => {
  /* The same gap, three more facts. Each is a value the site publishes about
   * itself, and each was catchable by nothing:
   *
   *   shop.url        — appears in every canonical, og:url and JSON-LD @id
   *   geo.lat/lng     — the pin, and the reason the map stopped being keyed
   *                     on an address string
   *   googlePlaceId   — names the listing rather than dropping a pin
   *
   * The city line is here too. The address rule above matches only
   * "Pınar Bulvarı" and "Cumhuriyet Mah", so "59510 Kapaklı / Tekirdağ" could
   * be inlined without tripping it. */
  const hits = offenders(
    /kapaklikuyumculuk\.com|41\.3264|27\.9765|ChIJSQxn1KkptRQRLtfCCLZCYLk|59510/,
  );
  assert.deepEqual(hits, [], `these belong in lib/config.ts:\n${hits.join("\n")}`);
});

test("opening hours are never inlined outside config", () => {
  /* Seasonal, and owner-editable in phase two — one source only. Two closing
   * times now (19:00 summer, 18:00 winter), which doubles the chance of one
   * being typed into a component; 08:00 and 20:00 stay in the pattern because
   * both appeared in earlier drafts and in the directory listings the cleanup
   * is correcting. */
  const hits = offenders(/\b0[89]:00\b|\b(?:18|19|20):00\b/);
  assert.deepEqual(hits, [], `hours belong in lib/config.ts:\n${hits.join("\n")}`);
});

/* The helper the rules all depend on, tested directly. Every invariant above
 * is only as good as this, and for a while it was silently worthless — a
 * regex stripping `//` to end of line ate the second half of every URL. These
 * are the exact shapes that got past it. */
test("stripComments keeps `//` that is inside a string", () => {
  const kept = [
    'const a = "https://www.facebook.com/537179436417060";',
    "const b = 'https://www.instagram.com/kapaklikuyumculuk';",
    "const c = `https://wa.me/905549157790`;",
    'const d = "https://x.test/"; const e = "0282 717 21 31";',
  ];

  for (const line of kept) {
    assert.equal(
      stripComments(line),
      line,
      `a URL inside a string must survive: ${line}`,
    );
  }
});

test("stripComments still removes real comments", () => {
  assert.equal(stripComments("const a = 1; // 0282 717 21 31"), "const a = 1; ");
  const comment = "/* 0282 717 21 31 */";
  assert.equal(
    stripComments(`${comment}const a = 1;`),
    " ".repeat(comment.length) + "const a = 1;",
  );

  /* Line numbers must survive, or every offender is reported against the
     wrong line. */
  const block = "/* a\n b */\nconst x = 1;";
  assert.equal(stripComments(block).split("\n").length, block.split("\n").length);
});

test("stripComments is not fooled by an escaped quote", () => {
  const line = 'const a = "he said \\"https://x.test/\\" loudly";';
  assert.equal(stripComments(line), line);
});

test("scanned a realistic number of files", () => {
  // Guards the guard: a broken glob would make every test above pass vacuously.
  assert.ok(
    FILES.length >= 20,
    `only ${FILES.length} source files scanned — the walker is probably broken`,
  );
});

/* ------------------------------------------------------------------ */
/* The favicon is ours                                                 */
/* ------------------------------------------------------------------ */

/* D20 — "the favicon keeps the original logo tile — gold KK on near-black" —
 * was written in stage 1 and then not carried out for the whole project. The
 * site went live on 2026-09-09 serving Next.js's starter favicon: a black
 * circle with a white triangle, at the URL every Google result would draw its
 * icon from. Nothing caught it, because nothing looked.
 *
 * This pins the hash of the WRONG file rather than the right one. Asserting the
 * correct bytes would mean editing this test every time `npm run icons` runs,
 * which is the kind of test people delete. Asserting the starter is gone costs
 * nothing to keep and catches the one regression that actually happened —
 * somebody scaffolding a fresh app/ and restoring the default.
 *
 * It proves the file is not Next's, not that it is ours; the committed PNG in
 * the diff is the real review. */
const NEXTJS_STARTER_FAVICON =
  "2b8ad2d33455a8f736fc3a8ebf8f0bdea8848ad4c0db48a2833bd0f9cd775932";

test("the favicon is not the Next.js starter", () => {
  const bytes = readFileSync("app/favicon.ico");
  const digest = createHash("sha256").update(bytes).digest("hex");

  assert.notEqual(
    digest,
    NEXTJS_STARTER_FAVICON,
    "app/favicon.ico is the Next.js starter triangle again — run `npm run icons`",
  );
});

test("every brand icon the head and the schema point at exists", () => {
  /* app/icon.svg is the artwork; the other three are generated from it by
     scripts/icons.mjs and committed. A missing one is a silently broken <link>
     or a JSON-LD logo that 404s. */
  for (const file of [
    "app/icon.svg",
    "app/favicon.ico",
    "app/apple-icon.png",
    "public/brand/logo-512.png",
  ]) {
    assert.ok(
      statSync(file).size > 0,
      `${file} is missing or empty — run \`npm run icons\``,
    );
  }
});
