import { test } from "node:test";
import assert from "node:assert/strict";
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
 * address check. */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, "");
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

test("opening hours are never inlined outside config", () => {
  /* Seasonal, and owner-editable in phase two — one source only. Two closing
   * times now (19:00 summer, 18:00 winter), which doubles the chance of one
   * being typed into a component; 08:00 and 20:00 stay in the pattern because
   * both appeared in earlier drafts and in the directory listings the cleanup
   * is correcting. */
  const hits = offenders(/\b0[89]:00\b|\b(?:18|19|20):00\b/);
  assert.deepEqual(hits, [], `hours belong in lib/config.ts:\n${hits.join("\n")}`);
});

test("scanned a realistic number of files", () => {
  // Guards the guard: a broken glob would make every test above pass vacuously.
  assert.ok(
    FILES.length >= 20,
    `only ${FILES.length} source files scanned — the walker is probably broken`,
  );
});
