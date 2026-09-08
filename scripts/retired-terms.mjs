/* The retired-terms gate.
 *
 *   node scripts/retired-terms.mjs
 *
 * Three things were retired on 2026-09-08 and none may come back as a live
 * reference:
 *
 *   pırlanta / pirlanta  the category. Its pieces are white gold, not diamond,
 *                        so the name was a claim the shop cannot stand behind —
 *                        the one thing on this site that would be a lie.
 *   tek taş              the slug `tek-tas-modelleri`, replaced by `yuzuk`.
 *   Ziraat               the "Ziraat Bankası karşısı" landmark, which was a
 *                        second address in everything but name.
 *
 * WHY THERE IS AN ALLOWLIST, AND WHY IT IS SHORT. A word cannot be erased from
 * a repo that has to keep 301ing the URLs it used to live at, and the comments
 * explaining a retirement necessarily name the thing retired. Every entry below
 * is one of those two cases and says which.
 *
 * This is the source-level half. The half that actually protects a visitor is
 * in tests/seo.spec.ts, which asserts the words appear nowhere in the rendered
 * markup of any page — title, meta, JSON-LD and alt text included — and needs
 * no allowlist at all.
 */

import { execFileSync } from "node:child_process";

const PATTERN = "pirlanta|pırlanta|tek.?ta[sş]|ziraat";

/** path → why it is allowed to say the word. */
const ALLOWED = {
  "scripts/retired-terms.mjs":
    "this file — it has to name what it is looking for, and it found itself first",
  "next.config.ts":
    "the redirect map itself — the retired paths are its sources, by definition",
  "tests/redirects.spec.ts": "asserts that map, source by source",
  "tests/seo.spec.ts":
    "asserts the retired paths are absent from the sitemap, and the rendered-markup gate",
  "tests/content.test.mts": "asserts the retired slugs no longer resolve",
  "tests/config.test.mts": "asserts the landmark is gone, in four spellings",
  "lib/config.ts": "the comment recording why the landmark was removed",
  "lib/content.ts": "the comment recording why the category was retired",
  "holding-page/index.html":
    "the retired holding page, archived verbatim — editing it would falsify the record of what was live",
  "holding-page/README.md": "describes that archived file's redirect map",
};

/** Directories whose whole job is to record history or instruct an agent. */
const ALLOWED_DIRS = ["docs/", ".claude/", "screenshots/"];

/** Stage files carry dated history notes; §1.4 keeps those deliberately. */
const ALLOWED_STAGE_FILES = [
  "plan.md",
  "CATALOGUE.md",
  "TECHNICAL.md",
  "FINAL.md",
];

const output = execFileSync(
  "grep",
  [
    "-rniE", PATTERN, ".",
    "--exclude-dir=node_modules", "--exclude-dir=.next", "--exclude-dir=.git",
    "--exclude-dir=test-results",
    "--exclude=package-lock.json", "--exclude=tsconfig.tsbuildinfo",
  ],
  { encoding: "utf8" },
).trimEnd();

const offenders = [];

for (const line of output.split("\n").filter(Boolean)) {
  const file = line.slice(2, line.indexOf(":", 2));
  const allowed =
    file in ALLOWED ||
    ALLOWED_DIRS.some((d) => file.startsWith(d)) ||
    ALLOWED_STAGE_FILES.includes(file);

  if (!allowed) offenders.push(line.trim());
}

if (offenders.length > 0) {
  console.error("Retired terms found outside the allowlist:\n");
  for (const line of offenders) console.error(`  ${line}`);
  console.error(
    "\nIf this is a live reference, remove it. If it is a redirect source or a" +
      "\ncomment explaining the retirement, add the file to ALLOWED in this" +
      "\nscript with the reason — never silently widen the pattern.",
  );
  process.exit(1);
}

console.log("Retired-terms gate: clean.");
console.log(
  `Allowed by name: ${Object.keys(ALLOWED).length} files · ` +
    `by directory: ${ALLOWED_DIRS.join(" ")} · ` +
    `stage files: ${ALLOWED_STAGE_FILES.join(" ")}`,
);
