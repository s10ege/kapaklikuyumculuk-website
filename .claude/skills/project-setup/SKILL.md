---
name: project-setup
description: How to bootstrap or repair this repository — dependencies, gitignored skills, Playwright browsers and working folders. Use after a fresh clone, when skills or node_modules are missing, when e2e tests fail with missing browsers, or when anything reports that the project is not set up.
---

# Project setup

Everything a clone needs but git does not carry lives in one script:

```
npm run setup          # full
npm run setup -- --quick        # skip browsers and the smoke test
npm run setup -- --no-browsers  # skip only the browser download
```

Safe to re-run; every step is idempotent. The same thing is available in Claude Code as
`/setup`.

## What git deliberately does not carry

- **`node_modules/`** — restored by `npm ci` from `package-lock.json`.
- **Third-party skills.** `.claude/skills/*` is gitignored; `skills-lock.json` pins each
  one's source and content hash, and the script restores them. This is why the repo has no
  vendored copies of `frontend-design`, `webapp-testing` and the Vercel skills.
  The two project-local skills — `kk-brand` and `catalogue-pipeline` — **are** committed
  and need nothing.
- **Playwright browsers** — a large download, installed on demand.
- **`catalogue/raw/` and `catalogue/fixed/`** — the original product photographs stay on
  Soner's machine and must never be committed. See `CATALOGUE.md`.

## Failure modes worth knowing

- **Node too old.** Next 16 needs ≥ 20.9. `.nvmrc` pins 22. On Windows use nvm-windows.
- **No registry access.** The script pings npm before running `npm ci`, because `npm ci`
  deletes `node_modules` first and a failed offline run leaves the clone unusable. If the
  preflight stops you, you are in a sandboxed or proxied shell — run it in a normal
  terminal instead.
- **Skills still missing afterwards.** Usually the same proxy problem. The skills are only
  needed for design review and testing work, so the rest of the project still runs.
- **`.git/index.lock` reported.** A git process crashed, or a sandboxed shell left a lock
  it could not delete. If nothing is running, delete the file. See `docs/git-workflow.md`.

## What it does not do

Install Node itself, configure git credentials, or deploy anything. Node is the one
prerequisite; the script checks it and tells you how to fix it.
