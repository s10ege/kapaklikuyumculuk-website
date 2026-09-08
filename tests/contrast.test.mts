import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/* §7 — "measured, not assumed".
 *
 * Dark palettes fail differently from light ones, and this one had no
 * measurement behind it at all until 2026-09-08: the ratios lived in prose
 * comments in app/globals.css, written at the 1.2 gate and never re-checked.
 * Two of those comments turn out to be exactly right, which is the good case;
 * the point is that nothing would have noticed if a token had been nudged.
 *
 * Pure arithmetic, no browser. The tokens are parsed out of globals.css rather
 * than copied here, so this cannot drift from the palette it claims to check —
 * a contrast test with its own hardcoded hexes tests itself.
 *
 * Thresholds are WCAG 2.1 AA: 4.5:1 for body text, 3:1 for large text and for
 * UI components including focus indicators.
 */

const CSS = readFileSync("app/globals.css", "utf8");

function tokens(): Record<string, string> {
  const found: Record<string, string> = {};
  for (const [, name, hex] of CSS.matchAll(
    /--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})/g,
  )) {
    found[name] = hex;
  }
  return found;
}

const COLOR = tokens();

function relativeLuminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
  );
}

function contrast(a: string, b: string): number {
  const fg = COLOR[a];
  const bg = COLOR[b];
  assert.ok(fg, `unknown token --color-${a}`);
  assert.ok(bg, `unknown token --color-${b}`);

  const [hi, lo] = [relativeLuminance(fg), relativeLuminance(bg)].sort(
    (x, y) => y - x,
  );
  return (hi + 0.05) / (lo + 0.05);
}

/** Rounded the way a report would state it, so failures read like the comments
 *  in globals.css rather than like floating-point noise. */
const at = (a: string, b: string) => Math.round(contrast(a, b) * 100) / 100;

test("the palette parsed — this test is worthless if it did not", () => {
  /* Twelve tokens since the WhatsApp green was removed on 2026-09-08. A
   * regex that silently matched nothing would make every assertion below
   * pass against an empty object. */
  assert.ok(
    Object.keys(COLOR).length >= 12,
    `only parsed ${Object.keys(COLOR).length} colour tokens from globals.css`,
  );
});

/* ------------------------------------------------------------------ */
/* Body text — 4.5:1                                                   */
/* ------------------------------------------------------------------ */

test("every text token clears AA on the ground it is used on", () => {
  const pairs: [fg: string, bg: string, why: string][] = [
    ["cream-text", "ground", "D9 — body text on espresso"],
    ["cream-text", "panel", "body text on a raised panel"],
    ["muted", "ground", "secondary text on espresso"],
    ["muted", "panel", "secondary text on a panel"],
    ["gold-soft", "ground", "text-label, 11px uppercase — small, so 4.5 not 3"],
    ["gold-soft", "panel", "the same label on a panel"],
    ["ink-text", "frame", "text on the cream frame"],
    ["ink-muted", "frame", "secondary text on cream"],
    ["gold-deep", "frame", "gold on cream, at footer fine-print sizes"],
  ];

  const failures = pairs
    .filter(([fg, bg]) => contrast(fg, bg) < 4.5)
    .map(([fg, bg, why]) => `${fg} on ${bg} = ${at(fg, bg)}:1 (${why})`);

  assert.deepEqual(failures, [], `below the 4.5:1 AA minimum:\n${failures.join("\n")}`);
});

test("the two ratios globals.css states in prose are the ratios it has", () => {
  /* The comments at the 1.2 gate claim gold-deep measures 5.3:1 on frame and
   * ink-muted 6:1. Both were the reason a token changed, so if either drifts
   * the reasoning recorded beside it becomes a lie. */
  assert.equal(at("gold-deep", "frame"), 5.29);
  assert.equal(at("ink-muted", "frame"), 6.02);
});

/* ------------------------------------------------------------------ */
/* Focus rings — D18, 3:1                                              */
/* ------------------------------------------------------------------ */

test("the focus ring is visible on both grounds", () => {
  /* D18 says gold focus rings, verified on espresso AND cream. They are not
   * the same gold, and that is the whole point of the rule below. */
  assert.ok(
    contrast("gold", "ground") >= 3,
    `gold ring on espresso is ${at("gold", "ground")}:1`,
  );
  assert.ok(
    contrast("gold-deep", "frame") >= 3,
    `gold-deep ring on cream is ${at("gold-deep", "frame")}:1`,
  );
});

test("plain gold on cream is why the gold-deep override exists", () => {
  /* 2.46:1 — below the 3:1 a focus indicator needs, so a gold ring on the
   * cream header would be a ring nobody can see. globals.css handles it with
   * a `.bg-frame, .bg-frame *` rule that swaps in gold-deep.
   *
   * Asserted as a measurement AND as the presence of the rule, because the
   * measurement alone would still pass on the day somebody deletes the rule. */
  assert.ok(
    contrast("gold", "frame") < 3,
    "gold now clears 3:1 on cream — re-check whether the override is still needed",
  );
  assert.match(
    CSS,
    /\.bg-frame[^{]*\{[^}]*outline-color:\s*var\(--color-gold-deep\)/,
    "the .bg-frame outline-color override is gone; focus rings on cream are now 2.46:1",
  );
});

/* ------------------------------------------------------------------ */
/* Hairlines — measured, not graded                                    */
/* ------------------------------------------------------------------ */

test("hairlines are distinguishable from the ground they sit on", () => {
  /* line-dark on ground is 1.30:1 and line-light on frame is 1.18:1. Both are
   * far below the 3:1 a UI component needs, and that is not a failure: D11
   * separates sections by spacing FIRST, with the rule as a refinement, so
   * these carry no information on their own.
   *
   * The floor here is a regression guard rather than a standard — it fails if
   * a token change makes a hairline vanish entirely into its background. It
   * does not answer whether these are visible on a phone in daylight, which
   * is §13 risk 4 and can only be settled on real hardware in 4.2. */
  assert.ok(
    contrast("line-dark", "ground") >= 1.25,
    `line-dark on ground is ${at("line-dark", "ground")}:1`,
  );
  assert.ok(
    contrast("line-light", "frame") >= 1.15,
    `line-light on frame is ${at("line-light", "frame")}:1`,
  );
});

/* ------------------------------------------------------------------ */
/* D9 — never pure white                                               */
/* ------------------------------------------------------------------ */

test("no text token is pure white", () => {
  /* Halation on near-black: #fff on espresso measures 17.9:1, better than
   * cream-text's 14.55, and reads worse. A contrast test that only maximised
   * the number would argue for the wrong colour, so the rule is asserted
   * directly. */
  for (const name of ["cream-text", "muted", "gold-soft"]) {
    assert.notEqual(
      COLOR[name].toLowerCase(),
      "#ffffff",
      `--color-${name} is pure white (D9)`,
    );
  }
});
