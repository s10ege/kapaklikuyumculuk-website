# Git workflow

How this repo is worked on, by Soner and by Claude. Short, because a workflow nobody
remembers is not a workflow.

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

## What Claude may and may not do

1. **Claude never pushes without being asked**, and never force-pushes at all.
2. Claude may commit locally when asked, and always says exactly what was staged.
3. **Never commit secrets.** `.env*` is ignored; keep it that way. There are no API keys in
   this project by design.
4. **Never commit `catalogue/raw/`.** The original photographs stay on Soner's machine.
5. Third-party skills are ignored via `.claude/skills/*` and restored with
   `npx skills install`; `skills-lock.json` pins them. The two project-local skills
   (`kk-brand`, `catalogue-pipeline`) are explicitly unignored and **are** committed.

## Pushing from this environment — currently not possible

Claude works on these files through a sandboxed shell on Soner's machine. That shell has
**no network access to GitHub** (proxy returns 403) and **no stored credentials**, so it can
stage and commit but cannot push, pull, clone or fetch.

So the split is: **Claude commits, Soner pushes.**

```powershell
cd C:\Users\soner\.vscode\projects\kapaklikuyumculuk_website
git log --oneline -5      # check what Claude committed
git push origin main      # or: git push -u origin <branch>
```

If that ever needs to change, the options are a GitHub personal access token available to
the shell, or moving the repo into Claude's own cloud workspace and pushing from there.
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

## Large files

`ata_animation/` is 6.4 MB, including a 3.2 MB `.glb`. That is committed as source, which is
fine at this size. If rendered coin frames or a video are ever committed too, move the lot to
Git LFS rather than growing the repo.
