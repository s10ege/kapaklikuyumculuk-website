# Git workflow

How this repo is worked on, by Soner and by Claude. Short, because a workflow nobody
remembers is not a workflow.

## After cloning

```bash
git clone https://github.com/s10ege/kapaklikuyumculuk-website.git
cd kapaklikuyumculuk-website
npm run setup
```

`node_modules/`, the third-party skills and the Playwright browsers are all deliberately
not in the repo. `npm run setup` restores them from `package-lock.json` and
`skills-lock.json`. In Claude Code the same thing is `/setup`.

## The shape

- **`origin`** → `https://github.com/s10ege/kapaklikuyumculuk-website.git`
- **`main`** is the deployable branch. Once Vercel is connected (stage 4.1), **a push to
  `main` deploys to production.** Treat it accordingly.
- **One branch per iteration**, named for the roadmap entry in `plan.md`:

```
stage1/1.1-coin-loop
stage1/1.2-palette-migration
stage3/3.4-redirect-reverify
```

Small, mechanical fixes can go straight to `main`. Anything that changes how the site looks
or what it claims goes through a branch, so there is a preview deployment to look at before
it is real.

## Commit messages

Match the existing history — lowercase type, colon, imperative summary:

```
feat: render the Ata Lirası loop and wire it into the hero
fix: keep the WhatsApp FAB clear of the iOS home indicator
docs: correct the canonical name across the Google plans
chore: normalise line endings with .gitattributes
```

One logical change per commit. Whitespace or line-ending renormalisation gets its **own**
commit, never mixed with content — otherwise the real change is invisible in the diff.

## Merging

- Rebase or merge from `main` into your branch before opening the PR, so the PR is a clean
  fast-forward.
- **Squash merge** into `main`. The branch history is working notes; `main` should read as
  one commit per iteration, matching `plan.md`.
- Delete the branch after merging.

**Exception — a stage-closing pass gets a merge commit** (`--no-ff`), decided 2026-09-08
when `final-tweaks` closed stage 2 with nine commits.

The squash rule exists because branch history is usually working notes, and it usually is.
A pass that closes a stage is the case where it is not: nine commits, each a distinct
decision, each carrying the reasoning that will be wanted in six months — why a redirect was
repointed, why one master was rebuilt and at what loss, why the pin-only embed replaced a
route. Squashing turns that into one message that either runs to five hundred lines or drops
what matters.

`git log --first-parent main` still reads as one entry per pass, which is what the squash
rule is actually asking for. The detail is one level down instead of gone.

## What Claude may and may not do

1. **Claude never pushes without being asked**, and never force-pushes at all.
2. Claude may commit locally when asked, and always says exactly what was staged.
3. **Never commit secrets.** `.env*` is ignored; keep it that way. There are no API keys in
   this project by design.
4. **Never commit `catalogue/raw/`.** The original photographs stay on Soner's machine.
5. Third-party skills are ignored via `.claude/skills/*` and restored with
   `npx skills install`; `skills-lock.json` pins them. The two project-local skills
   (`kk-brand`, `catalogue-pipeline`) are explicitly unignored and **are** committed.

## Pushing from this environment

> **Corrected 2026-09-08.** This section used to say pushing was impossible — no network to
> GitHub (403 from the proxy) and no stored credentials, so the split was "Claude commits,
> Soner pushes". That is no longer true on the machine this now runs on: `git push` reaches
> `origin` and authenticates. Verified with a dry run before the stage-2 merge.

Rule 1 below still stands and matters more now, not less: **Claude never pushes without
being asked.** Being able to push is not permission to push. Ask, then push, then say
exactly what moved.

If the old situation ever returns — a sandbox with no credentials — the fallback is
unchanged:

```powershell
cd C:\Users\soner\.vscode\projects\kapaklikuyumculuk_website
git log --oneline -5      # check what Claude committed
git push origin main      # or: git push -u origin <branch>
```
Neither is needed today.

## Two environment gotchas

1. **Stale `.git/index.lock`.** The sandboxed shell cannot delete files, so a lock left
   behind by an interrupted git command blocks *every* subsequent git write — including VS
   Code's, which reports "Another git process seems to be running". Claude moves stale locks
   to `.git/_to_delete/` as a workaround. **Delete that folder yourself when you see it.**
2. **This folder is inside Google Drive sync** (`.tmp.driveupload/`, `.tmp.drivedownload/`).
   Drive syncing a live git repo plus `node_modules` causes upload churn and occasional
   partial files. Both temp folders are now git-ignored, but the better fix is to exclude
   `node_modules/`, `.next/` and `.git/` from Drive sync — or move the project out of the
   Drive folder entirely.

## Running the tests

```bash
npm run test:unit       # node:test — config, content, copy, contrast, invariants
npm run test:e2e        # Playwright against `next dev`
npm run test:e2e:prod   # Playwright against `next build && next start`
```

**Two projects since 2026-09-08.** Everything used to run against the dev server, which
meant "the redirects work" and "the build is static" — both claims about production — were
proven on a dev server. The CSP pass made the gap concrete in both directions at once: a
policy correct in production took the whole dev site down, and a clean production sweep sat
beside thirteen red dev tests.

`prod` skips `lightbox.spec.ts`, which drives `/dev/grid`, and filters the `app/dev/*`
routes out of the overflow suite — those routes `notFound()` in production by design.

`E2E_BASE_URL` points either project at an already-running server and turns the managed one
off:

```bash
E2E_BASE_URL=https://www.kapaklikuyumculuk.com npx playwright test --project=prod tests/redirects.spec.ts
```

That is how `FINAL.md` 4.2 verifies the redirect map against the live domain, which was not
possible before.

## Large files

`ata_animation/` is 6.4 MB, including a 3.2 MB `.glb`. That is committed as source, which is
fine at this size. If rendered coin frames or a video are ever committed too, move the lot to
Git LFS rather than growing the repo.
