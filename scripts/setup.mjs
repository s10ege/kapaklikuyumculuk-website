#!/usr/bin/env node
/**
 * Project bootstrap — everything a fresh clone needs that git does not carry.
 *
 *   npm run setup                 full setup
 *   npm run setup -- --quick      skip browsers and the smoke test
 *   npm run setup -- --no-browsers
 *
 * Safe to re-run. Every step is idempotent.
 *
 * Why this is not a postinstall hook: postinstall fires on every `npm install`,
 * including in CI where Playwright browsers and skills are pointless, and it is
 * skipped entirely when anyone runs with --ignore-scripts. An explicit command
 * that people can read is worth more than an implicit one they cannot.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ARGS = new Set(process.argv.slice(2));
const QUICK = ARGS.has("--quick");
const NO_BROWSERS = QUICK || ARGS.has("--no-browsers");

const MIN_NODE = [20, 9]; // Next 16 + React 19
const results = [];

// Colour only when we are attached to a terminal that wants it.
const COLOUR = process.stdout.isTTY && !process.env.NO_COLOR;
const wrap = (code) => (s) => (COLOUR ? `\u001b[${code}m${s}\u001b[0m` : String(s));
const c = {
  dim: wrap(2),
  bold: wrap(1),
  green: wrap(32),
  red: wrap(31),
  yellow: wrap(33),
};

function step(name) {
  console.log(`\n${c.bold("→ " + name)}`);
}

function record(name, ok, note = "") {
  results.push({ name, ok, note });
}

/** Run a command, streaming its output. shell:true so npm/npx resolve on Windows. */
function run(cmd, args) {
  const printed = [cmd, ...args].join(" ");
  console.log(c.dim(`  $ ${printed}`));
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", shell: true });
  return r.status === 0;
}

/* ── 1 · Node ─────────────────────────────────────────────────────────────── */

step("Checking Node");
{
  const [major, minor] = process.versions.node.split(".").map(Number);
  const ok = major > MIN_NODE[0] || (major === MIN_NODE[0] && minor >= MIN_NODE[1]);
  console.log(`  node ${process.version} (need >= ${MIN_NODE.join(".")})`);
  if (!ok) {
    console.error(c.red("\n  Node is too old for Next 16.\n"));
    console.error("  Windows:  install nvm-windows, then:  nvm install 22 && nvm use 22");
    console.error("  macOS/Linux with nvm:                 nvm install && nvm use");
    console.error("  Or download 22 LTS from https://nodejs.org\n");
    console.error("  The version this project expects is in .nvmrc.\n");
    process.exit(1);
  }
  record("node", true, process.version);
}

/* ── 2 · Dependencies ─────────────────────────────────────────────────────── */

step("Installing dependencies");
{
  // Preflight: npm ci DELETES node_modules before it downloads anything, so a
  // failed run on a machine with no registry access leaves you worse off than
  // when you started. Check reachability first and stop early if it is not there.
  console.log(c.dim("  $ npm ping"));
  const ping = spawnSync(
    "npm",
    ["ping", "--fetch-retries=0", "--fetch-timeout=8000"],
    { cwd: ROOT, stdio: "ignore", shell: true, timeout: 20000 }
  );
  const reachable = ping.status === 0;
  if (!reachable) {
    console.error(c.red("\n  Cannot reach the npm registry — stopping before touching node_modules."));
    console.error("  npm ci removes node_modules first, so running it offline would leave you");
    console.error("  with no dependencies at all.\n");
    console.error("  If you are in a sandboxed or proxied shell, run this in a normal terminal.\n");
    process.exit(1);
  }

  const hasLock = existsSync(join(ROOT, "package-lock.json"));
  const ok = hasLock ? run("npm", ["ci"]) : run("npm", ["install"]);
  if (!ok) {
    console.error(c.red("\n  npm install failed. Nothing below will work — stopping.\n"));
    process.exit(1);
  }
  record("dependencies", true, hasLock ? "npm ci" : "npm install");
}

/* ── 3 · Skills ───────────────────────────────────────────────────────────── */
/* Third-party skills are gitignored on purpose — skills-lock.json pins the exact
 * source and hash of each, so a clone restores them rather than carrying vendored
 * copies. The two project-local skills (kk-brand, catalogue-pipeline) ARE
 * committed and need nothing here. */

step("Restoring skills");
{
  let names = [];
  try {
    const lock = JSON.parse(readFileSync(join(ROOT, "skills-lock.json"), "utf8"));
    names = Object.entries(lock.skills ?? {});
  } catch {
    console.log(c.yellow("  no skills-lock.json — skipping"));
    record("skills", true, "no lockfile");
  }

  if (names.length) {
    let ok = run("npx", ["--yes", "skills", "install"]);

    if (!ok) {
      // Older CLIs have no `install` verb — add each pinned skill by name.
      console.log(c.yellow("  `skills install` failed; adding each pinned skill instead"));
      ok = true;
      for (const [name, meta] of names) {
        if (!run("npx", ["--yes", "skills", "add", `${meta.source}@${name}`])) ok = false;
      }
    }

    const missing = names
      .map(([n]) => n)
      .filter((n) => !existsSync(join(ROOT, ".claude/skills", n)) && !existsSync(join(ROOT, ".agents/skills", n)));

    if (missing.length) {
      console.log(c.yellow(`  still missing: ${missing.join(", ")}`));
      console.log(c.dim("  usually a network or proxy problem — re-run this in a normal terminal"));
    }
    record("skills", missing.length === 0, missing.length ? `missing ${missing.length}` : `${names.length} restored`);
  }
}

/* ── 4 · Browsers ─────────────────────────────────────────────────────────── */

step("Installing Playwright browsers");
if (NO_BROWSERS) {
  console.log(c.dim("  skipped (--quick / --no-browsers)"));
  record("browsers", true, "skipped");
} else {
  const ok = run("npx", ["--yes", "playwright", "install", "chromium"]);
  if (!ok) console.log(c.yellow("  the 146 e2e tests cannot run without this"));
  record("browsers", ok, ok ? "chromium" : "failed — run `npx playwright install chromium`");
}

/* ── 5 · Gitignored working folders ───────────────────────────────────────── */
/* Git does not carry empty directories, and these are ignored by design: the raw
 * photographs stay on Soner's machine. See CATALOGUE.md. */

step("Creating working folders");
{
  const dirs = ["catalogue/raw", "catalogue/fixed"];
  for (const d of dirs) {
    mkdirSync(join(ROOT, d), { recursive: true });
    console.log(`  ${d}`);
  }
  record("folders", true, dirs.join(", "));
}

/* ── 6 · Housekeeping ─────────────────────────────────────────────────────── */
/* Claude works through a sandboxed shell that cannot delete files, so stale git
 * lock files get parked in .git/_to_delete instead of removed. Clear them here,
 * where we can. See docs/git-workflow.md. */

step("Housekeeping");
{
  const parked = join(ROOT, ".git/_to_delete");
  if (existsSync(parked)) {
    rmSync(parked, { recursive: true, force: true });
    console.log("  removed .git/_to_delete (parked lock files)");
  }
  const lock = join(ROOT, ".git/index.lock");
  if (existsSync(lock)) {
    console.log(c.yellow("  .git/index.lock exists — if no git process is running, delete it"));
  }
  record("housekeeping", true);
}

/* ── 7 · Smoke test ───────────────────────────────────────────────────────── */

step("Smoke test");
if (QUICK) {
  console.log(c.dim("  skipped (--quick)"));
  record("smoke test", true, "skipped");
} else {
  const ok = run("npm", ["run", "test:unit"]);
  record("smoke test", ok, ok ? "41 unit tests" : "unit tests failed");
}

/* ── Summary ──────────────────────────────────────────────────────────────── */

console.log(`\n${c.bold("Setup summary")}`);
for (const { name, ok, note } of results) {
  const mark = ok ? c.green("ok  ") : c.red("FAIL");
  console.log(`  ${mark}  ${name.padEnd(14)} ${c.dim(note)}`);
}

const failed = results.filter((r) => !r.ok);
console.log("");
if (failed.length) {
  console.log(c.yellow(`${failed.length} step(s) need attention — see above.`));
} else {
  console.log(c.green("Ready."));
}
console.log(`
${c.bold("Next")}
  npm run dev          start the dev server
  npm run test:e2e     146 end-to-end tests (needs the browsers step)
  plan.md              the roadmap — current stage is design.md
`);

process.exit(failed.length ? 1 : 0);
