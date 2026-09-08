/* Every gate, by exit code, in one command.
 *
 *   npm run verify              # everything CI runs
 *   npm run verify -- --quick   # skip the two e2e suites (~6 minutes faster)
 *
 * This exists because of a specific mistake, made twice during stage 3. Gates
 * were run by hand and judged by reading their output — once through
 * `npm run build | grep f-marker`, which prints "no dynamic routes" for a build
 * that CRASHED, and once through `npm run test:unit | grep "^i pass"`, which
 * prints node:test's summary and drops the retired-terms gate chained after
 * it. Both reported green for three commits while exiting 1.
 *
 * So this reads exit codes and nothing else, prints one table, and its own
 * exit code is the answer.
 */
import { spawnSync } from "node:child_process";

const quick = process.argv.includes("--quick");

const STATIC_MARKER = "○  (Static)";
const DYNAMIC_MARKER = "ƒ";

/* `npm run build` alone is not enough: hard rule 9 says every route stays
 * static, and a crashed build satisfies "no dynamic marker in the output"
 * perfectly. So the route table has to be present AND free of the marker. */
function staticBuild() {
  const r = spawnSync("npm", ["run", "build"], { encoding: "utf8" });
  if (r.status !== 0) return { ok: false, note: "build failed" };

  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  if (!out.includes(STATIC_MARKER)) return { ok: false, note: "no route table" };
  if (out.includes(DYNAMIC_MARKER)) {
    return { ok: false, note: "dynamic route present" };
  }

  /* The table's tree characters. `┌` was missing from the first version, so
     this under-reported by one — an informational number that is wrong is
     worse than no number. `│` prefixes the indented children of a dynamic
     segment, so they count too. */
  const routes = (out.match(/^[┌├└│]/gm) ?? []).length;
  return { ok: true, note: `${routes} routes, all static` };
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  return { ok: r.status === 0, note: `exit ${r.status}` };
}

const gates = [
  ["typecheck", () => run("npm", ["run", "typecheck"])],
  ["lint", () => run("npm", ["run", "lint"])],
  ["unit + terms gate", () => run("npm", ["run", "test:unit"])],
  ["build (static)", staticBuild],
  ...(quick
    ? []
    : [
        ["e2e dev", () => run("npm", ["run", "test:e2e"])],
        ["e2e prod", () => run("npm", ["run", "test:e2e:prod"])],
      ]),
];

const results = [];
for (const [name, fn] of gates) {
  console.log(`\n-- ${name}`);
  results.push([name, fn()]);
}

const line = "-".repeat(52);
console.log(`\n${line}`);
for (const [name, { ok, note }] of results) {
  console.log(`${ok ? "  ok  " : " FAIL "} ${name.padEnd(20)} ${note}`);
}
if (quick) console.log("\n  (--quick: the two e2e suites were not run)");
console.log(line);

const failed = results.filter(([, r]) => !r.ok);
console.log(failed.length ? `\n${failed.length} gate(s) failed.\n` : "\nAll gates green.\n");
process.exit(failed.length ? 1 : 0);
