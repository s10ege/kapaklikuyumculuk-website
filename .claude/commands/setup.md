---
description: Bootstrap a fresh clone — dependencies, skills, browsers and the gitignored working folders
allowed-tools: Bash, Read
---

Bootstrap this repository after a clone, or repair a half-set-up one.

Run:

```
npm run setup
```

That script (`scripts/setup.mjs`) is the single source of truth for what a clone needs.
Do not reimplement its steps here or run them individually unless a step has failed and
you are retrying just that one.

## What it does

1. Checks Node against `engines` (>= 20.9, `.nvmrc` says 22). Exits with instructions if too old.
2. `npm ping`, then `npm ci`. The ping matters: `npm ci` deletes `node_modules` before
   downloading, so an offline run would leave the clone with no dependencies at all.
3. Restores the gitignored third-party skills from `skills-lock.json`, falling back to
   adding each pinned skill by name if `skills install` is unavailable.
4. Installs the Playwright chromium build, without which the 146 e2e tests cannot run.
5. Creates `catalogue/raw/` and `catalogue/fixed/` — gitignored by design, since the
   original photographs stay on Soner's machine.
6. Clears `.git/_to_delete/`, where stale git lock files get parked.
7. Runs the 41 unit tests as a smoke check.

Flags: `-- --quick` skips browsers and the smoke test; `-- --no-browsers` skips only the
browser download.

## ⚠️ If you are running inside the Cowork device shell

That shell has **no network access** — npm and npx return 403 from a proxy. The script's
preflight will catch this and stop before touching `node_modules`. When that happens, do
not try to work around it: tell Soner to run `npm run setup` in his own terminal, and say
which step needed it.

## Reporting

Report the summary table the script prints, and for any failed step say what it blocks —
missing browsers block e2e, missing skills block the design review agents, a failed smoke
test means something is actually broken and should be investigated before any other work.
